---
title: "CF 102346B - 小丑"
description: "选举结果由一系列票数表示，其中第一个位置属于卡洛斯，后面的每个位置都属于在他之后注册的候选人。 获胜者是得票最多的候选人。"
date: "2026-08-14T02:00:29+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102346
codeforces_index: "B"
codeforces_contest_name: "2019-2020 ACM-ICPC Brazil Subregional Programming Contest"
rating: 0
weight: 102346
solve_time_s: 383
verified: true
draft: false
---

[CF 102346B - 小丑](https://codeforces.com/problemset/problem/102346/B)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 选举结果由一系列票数表示，其中第一个位置属于卡洛斯，后面的每个位置都属于在他之后注册的候选人。 获胜者是得票最多的候选人。 如果多个候选人的最大计数相同，则最早注册的候选人获胜。 由于卡洛斯首先登记，因此当他的票数至少与其他候选人的票数一样多时，他就会当选。 

输入包含一个整数`N`， 其次是`N`积极的投票很重要。 第一个计票是卡洛斯的结果，其余计票属于其他候选人。 所需的输出是`S`如果卡洛斯获胜并且`N`否则。 

约束条件`N <= 10^4`足够小，甚至二次算法在某些语言中也可能是可行的，但在这里是不必要的。 二次解的性能约为`10^8`成对检查最大尺寸，而线性扫描只需要大约`10^4`比较。 总票数最多为`100,000`，因此值本身也很小，并且 Python 整数无论如何也不存在溢出问题。 

主要的边缘情况是平局。 例如，```
2
10
10
```产生```
S
```因为卡洛斯先登记的。 如果粗心的解决方案要求卡洛斯严格获得更多选票，则会错误地打印`N`。 

另一个边缘情况是当 Carlos 不是唯一最大值时：```
3
5
7
5
```正确的输出是```
N
```因为第二位候选人得票更多。 仅将卡洛斯与最后一位候选人进行比较会错误地接受他。 

卡洛斯也可以在后面几位候选人拥有相同票数的情况下追平最高票数：```
4
8
8
8
3
```正确的输出是`S`。 决胜规则总是对卡洛斯有利，因为他占据第一位置。 

## 方法

 一种完全直接的暴力方法是将每个候选人与其他候选人进行比较，并确定卡洛斯的票数是否至少与所有候选人一样多。 这是正确的，因为卡洛斯恰好在没有候选人拥有更多选票的情况下获胜。 如果我们执行每个可能的有序对比较，则有`N(N-1)`比较。 和`N = 10,000`， 那是`99,990,000`对于如此简单的条件来说，比较成本不必要地昂贵，并且根据语言和时间限制可能会出现问题。 

暴力破解之所以有效，是因为它明确地检查了获胜者的定义，但它多次重复相同的信息。 如果候选人 7 的票数少于卡洛斯，我们只需要确定一次。 没有理由将候选 7 与其他所有候选进行比较。 

关键的观察是卡洛斯的地位很特殊。 因为他先登记，平局已经对他有利。 因此，我们不需要确定确切的获胜者或对所有票数进行排序。 我们只需要知道是否有任何后来的候选人比卡洛斯拥有更多的选票。 一次通过剩余的`N - 1`价值观就足够了。 

表达相同想法的更通用方法是计算最大票数，同时保留第一个候选人的优先级。 由于第一个候选人是卡洛斯，检查是否`votes[0]`大于或等于所有票数的最大值就足够了。 这给出了线性时间解。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 成对暴力破解 | O(N²) | O(1) | O(1) | 不必要的缓慢 |
 | 最佳线性扫描 | O(N) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 阅读`N`以及第一票数。 将第一个计数存储为卡洛斯的投票总数，因为第一位候选人始终是卡洛斯。 
2. 阅读其余各部分`N - 1`投票很重要。 如果有任何一个严格大于卡洛斯的计数，立即判定卡洛斯不能获胜并输出`N`。 
3. 如果整个输入已被处理而没有找到更大的投票数，则输出`S`。 其他所有候选人至多拥有卡洛斯的票数，平等就足以让卡洛斯获胜，因为他先登记了。 

为什么有效：在扫描过程中，不变的是到目前为止处理的每个候选人最多有卡洛斯的选票数。 如果候选人因拥有严格更多的选票而违反了这一不变量，则无论所有剩余候选人如何，该候选人都必须击败卡洛斯。 如果处理完所有人后没有出现违规情况，卡洛斯至少拥有与每个候选人一样多的票数，因此平局规则使他成为获胜者。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
carlos = int(input())

for _ in range(n - 1):
    votes = int(input())
    if votes > carlos:
        print("N")
        break
else:
    print("S")
```前两次读取获得候选人数和卡洛斯的得票数。 卡洛斯的计数是单独保存的，因为整个决定取决于后来的候选人是否超过它。 

循环精确处理`N - 1`剩余候选人。 比较是严格的`votes > carlos`， 不是`votes >= carlos`。 获得相同票数的较晚候选人不会击败卡洛斯，因为卡洛斯登记较早。 

这`break`是安全的，因为一旦找到了拥有更多票数的候选人，最终的选举结果就无法改变。 这`for ... else`构造处理相反的情况：它的`else`仅当循环完成且未遇到`break`，这意味着没有人比卡洛斯拥有更多的选票。 

不存在整数溢出问题。 最大个体值最多为`100,000`，Python整数可以直接表示。 

## 工作示例

 此处提供的语句摘录不包含其两个示例案例的实际数字输入，尽管它将它们的输出显示为`S`和`N`。 以下跟踪使用两个具体输入来执行这两个结果。 

对于卡洛斯平局获胜的情况：```
4
8
8
5
8
```| 已处理候选人 | 卡洛斯投票 | 当前候选人投票|`votes > carlos`| 结果 |
 | --- | --- | --- | --- | --- |
 | 卡洛斯| 8 | 8 | 未检查 | 继续 |
 | 2 | 8 | 8 | 假 | 继续 |
 | 3 | 8 | 5 | 假 | 继续 |
 | 4 | 8 | 8 | 假 | 继续 |
 | 结束 | 8 | 没有找到更大的值 | 对所有人来说都是错误的 |`S`|

 扫描表明了为什么平等不能导致拒绝。 三位候选人各有八票，但卡洛斯是其中最早的，所以他获胜。 

对于另一位候选人拥有更多票数的情况：```
3
5
7
5
```| 已处理候选人 | 卡洛斯投票 | 当前候选人投票|`votes > carlos`| 结果 |
 | --- | --- | --- | --- | --- |
 | 卡洛斯| 5 | 5 | 未检查 | 继续 |
 | 2 | 5 | 7 | 真实|`N`|
 | 3 | 5 | 5 | 不需要| 未处理|

 第二位候选人立即结算结果。 剩下的输入依然存在，但却无法改变卡洛斯已经输掉的事实。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N) | 每个选票计数最多被读取和比较一次。 |
 | 空间| O(1) | O(1) | 仅有的`N`、卡洛斯的投票数和当前投票数被存储。 |

 至多有`10,000`对于候选者，该算法在最坏的情况下仅执行几千次比较。 它还避免存储整个数组，因此它的内存使用量保持不变，无论`N`。 

## 测试用例```python
import sys
import io

def solve():
    input = sys.stdin.readline

    n = int(input())
    carlos = int(input())

    for _ in range(n - 1):
        votes = int(input())
        if votes > carlos:
            print("N")
            break
    else:
        print("S")

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()
    result = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout

    return result

# The original statement excerpt does not include the numeric sample inputs.
# These two cases represent the shown sample outputs S and N.

assert run("4\n8\n8\n5\n8\n") == "S\n", "sample-style winning case"
assert run("3\n5\n7\n5\n") == "N\n", "sample-style losing case"

# Minimum-size input, Carlos wins through a tie.
assert run("2\n10\n10\n") == "S\n", "minimum size and tie"

# Minimum-size input, the second candidate wins.
assert run("2\n9\n10\n") == "N\n", "minimum size and Carlos loses"

# All candidates have the same number of votes.
assert run("5\n20\n20\n20\n20\n20\n") == "S\n", "all equal values"

# Carlos is the maximum, but the last candidate ties him.
assert run("6\n17\n3\n9\n17\n4\n17\n") == "S\n", "later ties must not defeat Carlos"

# Carlos loses to the first later candidate with more votes.
assert run("6\n12\n13\n100\n1\n1\n1\n") == "N\n", "larger candidate found early"

# Maximum-size input, Carlos wins and all values are equal.
n = 10000
inp = str(n) + "\n" + "\n".join(["1"] * n) + "\n"
assert run(inp) == "S\n", "maximum size"

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 / 10 / 10`|`S`| 最小尺寸和平局决胜 |
 |`2 / 9 / 10`|`N`| 立即损失的最小尺寸 |
 |`5 / 20 / 20 / 20 / 20 / 20`|`S`| 所有值均相等 |
 |`6 / 17 / 3 / 9 / 17 / 4 / 17`|`S`| 后来的多次领带仍然有利于卡洛斯|
 |`6 / 12 / 13 / 100 / 1 / 1 / 1`|`N`| 更大的数值必须立即击败卡洛斯 |
 | 10,000 名候选人，每人一票 |`S`| 最大输入尺寸|

 ## 边缘情况

 第一个边缘情况是卡洛斯和唯一的其他候选人之间的直接平局：```
2
10
10
```卡洛斯开始于`10`。 唯一后来的候选人也有`10`，所以条件`votes > carlos`是假的。 循环正常结束并打印`S`。 解决方案使用`votes >= carlos`会错误地拒绝卡洛斯。 

第二个边缘情况是较晚的候选人，其票数严格更多：```
3
5
7
5
```卡洛斯有`5`，下一个候选人有`7`。 自从`7 > 5`，算法打印`N`立即地。 最终的候选人并不重要，因为卡洛斯已经被击败了。 

第三个边缘情况包含几个与卡洛斯并列的候选人：```
4
8
8
5
8
```后来的每个票数要么等于或小于`8`。 扫描从未找到严格更大的值，因此它打印`S`。 该算法不需要计算有多少候选人处于平局，因为注册顺序会以对卡洛斯有利的方式解决所有此类平局。 

最大的情况可以包含 10,000 名具有相同票数的候选人：```
5
1
1
1
1
1
```无论有多少候选人出席，都适用相同的逻辑。 由于每位候选人至多拥有卡洛斯一票，因此结果为`S`。 实际最大时`N = 10,000`，该实现仍然只对每个后来的候选者执行一次比较，因此运行时间保持线性。
