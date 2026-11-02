---
title: "CF 1692H - 赌博"
description: "我们提前知道下一次掷骰子的结果。 Marian 选择一个值 $a$ 和一个连续的轮段 $[l,r]$。 在该段的每一轮中，他总是猜测相同的值 $a$。 每当实际滚动​​价值等于 $a$ 时，他的钱就会翻倍。"
date: "2026-06-09T23:06:15+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dp", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 1692
codeforces_index: "H"
codeforces_contest_name: "Codeforces Round 799 (Div. 4)"
rating: 1700
weight: 1692
solve_time_s: 186
verified: false
draft: false
---

[CF 1692H - 赌博](https://codeforces.com/problemset/problem/1692/H)

 **评分：** 1700
 **标签：** 数据结构、dp、贪心、数学
 **求解时间：** 3m 6s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们知道接下来的结果$n$提前掷骰子。 玛丽安选择一个值$a$，以及连续的回合段$[l,r]$。 在该部分的每一轮中，他总是猜测相同的值$a$。 

每当实际滚动​​值等于$a$，他的钱就会翻倍。 否则，则减半。 

由于玛丽安一开始就是 1 美元，所以我们需要找到这个值$a$和段$[l,r]$最大化他的最终金额。 

第一个观察结果是只出现了二的幂。 如果一个段包含$k$成功的猜测和$m$猜测失败，则最终金额为$$2^k \cdot 2^{-m} = 2^{k-m}.$$最大化金钱与最大化指数完全相同$k-m$。 

一个段的总长度是$k+m$， 所以$$k-m = k-(\text{length}-k)=2k-\text{length}.$$对于固定值$a$，每次出现$a$贡献$+1$到$k$，而每个非$a$职位贡献$-1$到指数。 挑战在于找到最佳价值和最佳细分市场。 

制约因素很大。 全部的总和$n$跨测试用例的值最多是$2 \cdot 10^5$。 任何检查所有对的解决方案$(l,r)$是不可能的，因为这需要大约$n^2$工作。 和$n=2\cdot10^5$, quadratic algorithms would perform tens of billions of operations.

 我们需要一些接近线性或$O(n \log n)$。 

当某个值仅出现一次时，就会出现微妙的边缘情况。 

例子：```
1
5
1 2 3 4 5
```最好的答案是任何单一位置。 选择较长的段只会带来损失。 总是尝试连接多个事件的解决方案会错过这种情况。 

当两个事件相距很远时，就会出现另一种棘手的情况。```
1
5
7 1 1 1 7
```使用整个段作为值 7 给出指数$$2\cdot2-5=-1.$$仅使用一次出现即可得出指数$1$。 

最佳答案是长度为 1 的段，而不是包含两次出现的段。 

第三个陷阱是值的最佳段不一定在连续出现时开始和结束。 

考虑：```
1
7
5 2 5 3 4 5 5
```尽管存在间隙，但值 5 的最佳片段包括所有四次出现。 我们需要一种方法来自动决定哪些事件应该属于最佳片段。 

## 方法

 暴力解决方案会尝试所有可能的值$a$、每个左端点和每个右端点。 对于每个段，它将计算有多少个位置相等$a$并计算所得指数。 

这是正确的，因为它明确评估了每项法律策略。 

问题是运行时间。 有$O(n^2)$细分市场，并且天真地评估每个细分市场会花费另一个细分市场$O(n)$。 即使在预处理频率之后，仍然检查所有段$O(n^2)$，远远超出了极限。 

关键的观察来自重写乐谱。 

修复一些值$a$。 设其出现位置为$$p_1 < p_2 < \cdots < p_m.$$假设一个段从出现处开始$p_i$并在发生时结束$p_j$。 任何最佳价值细分$a$可以假设在出现以下情况时开始和结束$a$，因为超越它们只会增加失败。 

在该段内：$$k = j-i+1.$$长度为$$p_j-p_i+1.$$指数变为$$2(j-i+1) - (p_j-p_i+1).$$扩展：$$(j-i+1) - (p_j-p_i).$$重新排列：$$(p_i-i) - (p_j-j) + 1.$$现在定义$$b_t = p_t - t.$$对于固定$j$，最大化分数意味着找到最大的先前值$b_i$。 

这成为每个不同值的出现列表上的最大子数组样式问题。 

另一种查看方式甚至更简单。 两次连续出现之间有$$p_t-p_{t-1}-1$$非$a$元素。 连接这些事件会改变分数$$1-(p_t-p_{t-1}-1) = 2-(p_t-p_{t-1}).$$这为每个值的出现提供了一种自然的类似 Kadane 的动态规划。 

由于每个数组位置恰好属于一个出现列表，因此所有值的总工作量是线性的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^2)$到$O(n^3)$|$O(1)$| 太慢了|
 | 最佳 |$O(n)$每个测试用例|$O(n)$| 已接受 |

 ## 算法演练

 对于每个不同的值，收集它出现的所有位置。 

设位置为：$$p_1,p_2,\ldots,p_m.$$我们在此事件列表上运行 Kadane 式 DP。 

1. 从第一次出现的地方开始一个段。 
2.让`cur`是当前事件结束时的最佳片段的分数。 

单个事件的得分为 1，因为一次正确的猜测和零次失败给出了指数 1。 
3. 当从事件发生时转移$p_{i-1}$到$p_i$，扩展当前段的增益等于$$2-(p_i-p_{i-1}).$$期限$2$来自于多发生一次，而距离减去了它们之间引入的失败。 
4.如果$$cur + (2-(p_i-p_{i-1}))$$比从 1 分重新开始要好，延长当前段。 
5. 否则，在出现时开始一个新段$p_i$。 
6.更新后`cur`，将其与全局最佳答案进行比较。 如果更大，则存储：

 - 价值$a$,
 - 起始出现位置，
 - 结束出现位置。 
7. 对每个不同的值重复此操作。 

### 为什么它有效

 对于固定值$a$，每个候选片段由其在该片段内的第一次和最后一次出现唯一确定。 从一个事件扩展到下一个事件会精确地改变指数$2-(p_i-p_{i-1})$。 段的总指数变为这些转换增益加上第一次出现时的初始贡献 1 的总和。 

这将问题转化为在出现列表上查找最大和连续子序列。 Kadane 的算法正是针对此任务的最佳算法。 由于我们对每个值独立求解最优分段，然后选择总体最佳结果，因此最终答案是全局最优的。 

## Python 解决方案```python
import sys
from collections import defaultdict

input = sys.stdin.readline

def solve():
    t = int(input())

    out = []

    for _ in range(t):
        n = int(input())
        arr = list(map(int, input().split()))

        pos = defaultdict(list)

        for i, x in enumerate(arr, start=1):
            pos[x].append(i)

        best_score = -10**18
        best_a = arr[0]
        best_l = 1
        best_r = 1

        for value, positions in pos.items():
            cur_score = 1
            cur_start = positions[0]

            if cur_score > best_score:
                best_score = cur_score
                best_a = value
                best_l = cur_start
                best_r = positions[0]

            for i in range(1, len(positions)):
                gain = 2 - (positions[i] - positions[i - 1])

                if cur_score + gain < 1:
                    cur_score = 1
                    cur_start = positions[i]
                else:
                    cur_score += gain

                if cur_score > best_score:
                    best_score = cur_score
                    best_a = value
                    best_l = cur_start
                    best_r = positions[i]

        out.append(f"{best_a} {best_l} {best_r}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```第一部分将相等的值分组并存储它们的所有位置。 这是关键的预处理步骤，因为值的优化仅取决于该值出现的位置。 

对于每个出现列表，`cur_score`存储以当前事件结束的片段中的最佳分数。 过渡增益`2 - gap`直接来自指数的代数变换。 

重启条件与 Kadane 算法相同。 如果扩展产生的分数低于新的单次出现片段的分数，我们将丢弃前一个片段并从当前出现的位置重新开始。 

存储的边界是实际的数组位置，而不是出现列表内的索引。 这个细节很容易出错。 

不存在整数溢出问题，因为分数最多为$O(n)$，并且 Python 整数无论如何都是无界的。 

## 工作示例

 ### 示例 1

 输入：```
5
4 4 3 4 4
```值 4 的出现次数：

 | 发生 | 职位| 增益| 当前分数 | 细分 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | - | 1 | [1,1]|
 | 2 | 2 | 1 | 2 | [1,2]|
 | 3 | 4 | 0 | 2 | [1,4]|
 | 4 | 5 | 1 | 3 | [1,5]|

 最终得分为3，对应指数$$2\cdot4-5=3.$$回答：```
4 1 5
```该轨迹显示了附近的事件如何创造积极的收益并保持在相同的最佳部分。 

### 示例 2

 输入：```
5
11 1 11 1 11
```值 11 的出现次数：

 | 发生 | 职位| 增益| 当前分数 | 细分 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | - | 1 | [1,1]|
 | 2 | 3 | 0 | 1 | [1,3]|
 | 3 | 5 | 0 | 1 | [1,5]|

 值 1 的出现次数：

 | 发生 | 职位| 增益| 当前分数 | 细分 |
 | --- | --- | --- | --- | --- |
 | 1 | 2 | - | 1 | [2,2]|
 | 2 | 4 | 0 | 1 | [2,4]|

 最好的分数只有 1。任何一次出现都是最优的。 

这表明出现多次并不会自动产生帮助。 巨大的差距可以完全抵消好处。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n)$| 每个数组位置恰好出现在一个出现列表中，并被处理一次 |
 | 空间|$O(n)$| 出现位置的存储 |

 总计$n$所有测试用例最多$2 \cdot 10^5$。 所有出现列表的线性扫描很容易满足 2 秒的限制，并且存储所有位置仅需要线性内存。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from collections import defaultdict

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())
        arr = list(map(int, input().split()))

        pos = defaultdict(list)

        for i, x in enumerate(arr, 1):
            pos[x].append(i)

        best_score = -10**18
        ans = None

        for value, positions in pos.items():
            cur = 1
            start = positions[0]

            if cur > best_score:
                best_score = cur
                ans = (value, start, positions[0])

            for i in range(1, len(positions)):
                gain = 2 - (positions[i] - positions[i - 1])

                if cur + gain < 1:
                    cur = 1
                    start = positions[i]
                else:
                    cur += gain

                if cur > best_score:
                    best_score = cur
                    ans = (value, start, positions[i])

        out.append(f"{ans[0]} {ans[1]} {ans[2]}")

    return "\n".join(out)

# minimum size
assert run("1\n1\n5\n") == "5 1 1"

# all equal
assert run("1\n5\n7 7 7 7 7\n") == "7 1 5"

# isolated repeats, best is single element
assert run("1\n5\n7 1 1 1 7\n") in {
    "7 1 1",
    "7 5 5",
    "1 2 2",
    "1 3 3",
    "1 4 4",
}

# adjacent occurrences should merge
assert run("1\n4\n9 9 9 9\n") == "9 1 4"

# off-by-one boundary
assert run("1\n5\n3 1 3 3 1\n") == "3 1 4"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`[5]`|`5 1 1`| 最小尺寸数组 |
 |`[7,7,7,7,7]`|`7 1 5`| 整个数组是最优的 |
 |`[7,1,1,1,7]`| 任何单次出现的段 | 重启逻辑|
 |`[9,9,9,9]`|`9 1 4`| 连续正收益|
 |`[3,1,3,3,1]`|`3 1 4`| 正确的边界处理 |

 ## 边缘情况

 ### 一个值只出现一次

 输入：```
1
1
100
```出现列表为`[1]`。 

该算法初始化：

 | 职位| 分数 |
 | --- | --- |
 | 1 | 1 |

 不存在任何过渡。 答案变成：```
100 1 1
```假设每个最佳段都包含多次出现的解决方案在这里将失败。 

### 由大间隙分隔的重复值

 输入：```
1
5
7 1 1 1 7
```对于值 7：

 | 发生 | 职位| 增益| 分数 |
 | --- | --- | --- | --- |
 | 1 | 1 | - | 1 |
 | 2 | 5 | -2 | 重启|

 延期得分将为负数，因此 Kadane 从第 5 名重新开始。 

该算法正确返回单个位置段，因为连接两个事件会引入太多损失。 

### 最佳段从中间开始

 输入：```
1
7
5 1 1 5 5 1 5
```出现 5 次的位置为：```
1 4 5 7
```第一个差距很大并产生负贡献。 Kadane 重新启动会丢弃早期发生的事件并在稍后开始更好的片段。 

这正是算法将当前段起始位置与值的第一次出现分开存储的原因。 如果没有这种重启机制，答案将不是最优的。
