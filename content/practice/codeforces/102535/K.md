---
title: "CF 102535K - Kim Maybe 和 Mooks"
description: "敌人的队伍可以看作是一个长度为n的数组。 每个位置要么是活跃的敌人，写作 MOOK，要么是不活跃的敌人，写作 MEEK。 Kim 总是从左端开始，一直走到第一个活跃的敌人。"
date: "2026-08-05T15:23:45+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102535
codeforces_index: "K"
codeforces_contest_name: "2020 UP ACM Algolympics Elimination Round"
rating: 0
weight: 102535
solve_time_s: 71
verified: true
draft: false
---

[CF 102535K - Kim Maybe 和 Mooks](https://codeforces.com/problemset/problem/102535/K)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 敌人的队伍可以看作是一个长度数组`n`。 每个位置要么是一个活跃的敌人，写为`MOOK`，或不活跃的敌人，写为`MEEK`。 Kim 总是从左端开始，一直走到第一个活跃的敌人。 击败该敌人需要一分钟，之后该位置将变为非活动位置，并且在其再次活动之前的每个非活动位置。 

任务是计算直到每个位置变为`MEEK`。 

就以下方面而言，限制很小`n`， 和`n`最多 50 个，但测试用例可以很多，最多 10,000 个。 所花费的时间与操作数量成正比的模拟仍然可能是危险的，因为操作数量可能会呈指数增长`n`。 50 位置线可以代表周围的值`2^50`，因此任何真正执行每场战斗的方法都无法完成。 解决方案必须找到数学模式，而不是模拟战斗。 

棘手的情况来自于这样一个事实：战线并不是在每次战斗后简单地失去一个敌人。 例如，已经不活动的位置可以再次变为活动状态。 

考虑：```
1
MOOK
```答案是`1`。 一种只计算初始数量的解决方案`MOOK`位置在这里可行，但在较大的情况下会失败，因为敌人可能会回来。 

另一个例子是：```
3
MOOK
MEEK
MEEK
```答案也是`1`。 击败第一阵地后，就没有剩下任何活跃的敌人了。 一个粗心的模拟，期待每一个原创`MEEK`需要做一些工作就多了。 

一个更具启发性的例子是：```
3
MEEK
MOOK
MEEK
```答案是`2`。 第一场战斗将线路更改为：```
MOOK
MEEK
MEEK
```第二次战斗就结束了。 中间的敌人导致前方的敌人重新出现，这是问题的核心行为。 

## 方法

 直接的解决方案是保留当前数组，找到第一个`MOOK`，将其改为`MEEK`, 翻以前的所有`MEEK`职位进入`MOOK`，并重复直到数组仅包含`MEEK`。 这完全是按照流程来的，所以是正确的。 

问题在于重复次数。 这个过程实际上是通过一个二进制数来倒数的，所以战斗的次数可以大到`2^n - 1`。 和`n = 50`，最坏的情况将需要超过一万亿次操作。 即使非常有效的模拟也无法解决这个问题。 

有用的观察是每个位置的行为与二进制数字完全相同。 让`MOOK`代表`1`和`MEEK`代表`0`。 第一个位置是最低有效位。 当金击败第一名时`MOOK`，她找到第一个`1`位并将其更改为`0`，虽然一切都更早`0`位变成`1`。 这正是从二进制数中减一的原理。 

例如，国家```
MOOK
MEEK
MOOK
```代表二进制数字`101`当以左侧作为最低有效位读取时。 其值为：```
1 * 2^0 + 0 * 2^1 + 1 * 2^2 = 5
```该过程在达到零之前会进行五次战斗。 

整个问题简化为将初始排列转换为二进制数，其中最左边的位置具有权重`2^0`，然后输出该值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n * n) | O(2^n * n) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 从左到右阅读该行并处理每个`MOOK`作为二进制数字`1`和每一个`MEEK`作为二进制数字`0`。 

最左边的敌人是最不重要的位，因为它是金可以击败的第一个位置。 
2. 扫描行时保持当前二进制值。 对于索引处的位置`i`， 添加`2^i`如果它包含一个`MOOK`。 

每个活跃敌人所贡献的战斗次数正是其二进制权重所代表的。 
3. 打印累计值。 

数值可以达到`2^50 - 1`，它非常适合 Python 的整数类型。 

为什么它有效：

 不变量是当前敌方阵线代表进程结束前仍需要的战斗次数。 一次战斗执行从二进制表示中减一的精确转换，其中最左边的位置是最低有效位。 由于当二进制数达到零时该过程停止，因此起始二进制值正是所需的战斗数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    ans = []

    for _ in range(t):
        n = int(input())
        value = 0

        for i in range(n):
            s = input().strip()
            if s == "MOOK":
                value += 1 << i

        ans.append(str(value))

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```该程序独立处理每个测试用例。 变量`value`存储该行表示的二进制数。 

移位操作`1 << i`创建位置的权重。 由于第一输入行有索引`0`在代码中，第一个敌人贡献了`2^0`，匹配第一个敌人是 Kim 可以到达的第一个敌人的过程。 

该解决方案从不模拟战斗，因此它避免了指数级的状态变化。 Python 整数还可以避免溢出问题，因为最大可能值如下`2^50`。 

## 工作示例

 对于示例案例：```
MOOK
MEEK
MEEK
```二进制值计算如下：

 | 索引 | 状态| 贡献 | 当前值|
 | --- | --- | --- | --- |
 | 0 | 莫克 | 2^0 = 1 | 2^0 = 1 1 |
 | 1 | 温顺| 0 | 1 |
 | 2 | 温顺| 0 | 1 |

 答案是`1`。 这证实了第一个敌人已经是唯一需要战斗的情况。 

为了：```
MOOK
MEEK
MEEK
MOOK
MEEK
MOOK
MEEK
```贡献是：

 | 索引 | 状态| 贡献 | 当前值|
 | --- | --- | --- | --- |
 | 0 | 莫克 | 1 | 1 |
 | 1 | 温顺| 0 | 1 |
 | 2 | 温顺| 0 | 1 |
 | 3 | 莫克 | 8 | 9 |
 | 4 | 温顺| 0 | 9 |
 | 5 | 莫克 | 32 | 32 41 | 41
 | 6 | 温顺| 0 | 41 | 41

 输出是`41`。 该痕迹表明，分开的敌人群体并不是独立的，因为每个位置都贡献一个二进制权重。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 每个敌人的位置都会被读取一次 |
 | 空间| O(1) | O(1) | 仅存储累积的答案 |

 总工作量最多为所有测试用例的 500,000 个位置读取，这很容易满足限制。 

## 测试用例```python
import sys
import io

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

def solve():
    input = sys.stdin.readline
    t = int(input())
    ans = []

    for _ in range(t):
        n = int(input())
        value = 0
        for i in range(n):
            if input().strip() == "MOOK":
                value += 1 << i
        ans.append(str(value))

    print("\n".join(ans))

assert run("""3
1
MOOK
3
MOOK
MEEK
MEEK
7
MOOK
MEEK
MEEK
MOOK
MEEK
MOOK
MEEK
""") == "1\n1\n41\n"

assert run("""1
1
MEEK
""") == "0\n"

assert run("""1
4
MOOK
MOOK
MOOK
MOOK
""") == "15\n"

assert run("""1
3
MEEK
MOOK
MEEK
""") == "2\n"

assert run("""1
50
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
MOOK
""") == str((1 << 50) - 1) + "\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单身的`MEEK`|`0`| 已完成状态 |
 | 四`MOOK`价值观 |`15`| 所有位设置和二进制转换 |
 |`MEEK, MOOK, MEEK`|`2`| 非零中间位|
 | 五十`MOOK`价值观 |`2^50 - 1`| 最大尺寸和大整数处理 |

 ## 边缘情况

 对于输入：```
1
MOOK
```该算法为唯一的位置分配了权重`2^0`, 给予`1`。 这符合单打所需。 

对于输入：```
3
MOOK
MEEK
MEEK
```该算法忽略不活跃位置并返回`1`。 该过程在第一次失败后立即结束，因为没有设置更高的二进制位。 

对于输入：```
3
MEEK
MOOK
MEEK
```第二个位置贡献`2^1`, 给予`2`。 第一次战斗激活第一个位置，第二次战斗将其移除。 这证实了最初的非活动位置不仅仅是空的空间，它们是值为零的二进制数字。 

对于所有 50 个位置都为的最大情况`MOOK`，答案是：```
1 + 2 + 4 + ... + 2^49 = 2^50 - 1
```该算法直接处理这个问题，而不执行任何单独的战斗。
