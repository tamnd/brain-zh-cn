---
title: "CF 102317A - 雄伟 10"
description: "该问题要求我们处理几个篮球运动员。 每个球员都只有三项统计数据，例如得分、篮板或助攻。 当统计量至少为 10 时，将被视为“双倍”。"
date: "2026-08-17T10:13:37+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102317
codeforces_index: "A"
codeforces_contest_name: "UCF Locals 2016"
rating: 0
weight: 102317
solve_time_s: 59
verified: true
draft: false
---

[CF 102317A - Majestic 10](https://codeforces.com/problemset/problem/102317/A)

 **评级：** -
 **标签：** -
 **求解时间：** 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题要求我们处理几个篮球运动员。 每个球员都只有三项统计数据，例如得分、篮板或助攻。 当统计数据至少为 10 时，才算为“双倍”。对于每个球员，我们必须打印三个原始统计数据，然后描述该球员是否有零个、一个、两个或三个这样的统计数据。 

四种可能的描述是`zilch`对于零统计数据达到 10，`double`恰好有一个，`double-double`正好两个，并且`triple-double`对于这三个人来说。 输入包含正数的玩家，后跟每个玩家的三个整数统计数据。 每个统计数据都在 0 到 100 之间（含 0 和 100）。 

这些限制使其成为直接线性扫描。 每个玩家只有三个值，因此处理一个玩家需要恒定的工作量。 该声明没有对玩家数量施加上限，但即使玩家数量非常多，也只需要每个玩家不断地工作，给出了 O(n) 算法，其中 n 是玩家数量。 没有理由考虑排序、动态规划、图形算法或任何二次运算。 

主要的边界情况是值 10 本身。 由于 10 算作双精度数，因此比较必须是`>= 10`， 不是`> 10`。 例如，```
1
10 0 0
```产生```
10 0 0
double
```粗心的实现使用`> 10`会错误打印`zilch`。 

相反的边界是9，这不算数。 例如，```
1
9 9 9
```产生```
9 9 9
zilch
```仅检查值是否为正会错误地对该玩家进行分类。 

所有三个统计数据都可以同时合格。 例如，```
1
10 20 30
```产生```
10 20 30
triple-double
```独立的连锁`if`立即打印第一个合格统计数据的答案的语句可能会错误地停止于`double`。 正确的方法是在选择描述之前计算所有合格的统计数据。 

零的情况也很重要。 为了```
1
0 1 9
```输出是```
0 1 9
zilch
```该玩家仍有三项有效统计数据，但均未达到阈值。 

## 方法

 从渐近的角度来看，直接的方法已经是最优的。 对于每个玩家，一一检查这三个统计数据，统计有多少个是满足的`value >= 10`。 因为正好有三个统计数据，所以这需要每个玩家最多进行 3 次比较，然后在四个可能的字符串中进行选择。 对于 n 个玩家，最坏的情况是 3n 次阈值比较，加上产生输出的 O(n) 工作量。 

这里没有真正更快的渐近技术可供发现。 答案独立取决于三个统计数据中的每一个，因此算法必须至少读取输入值。 关键的观察是，玩家的整个状态可以用一个小整数来表示，统计数量达到 10。一旦知道了该数量，就可以直接得到所需的消息。 

因此，强力方法和最优方法是相同的线性扫描。 有用的优化是概念性的而不是渐近的：不是根据实际值编写四个单独的案例，而是将每个玩家减少到合格统计数据的数量。 这使得边界条件变得明确，并防止重叠条件产生错误的消息。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n) | O(1) | O(1) | 已接受 |
 | 最佳| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取玩家人数。 这准确地告诉我们必须处理多少组三个统计数据。 
2. 对于每个玩家，读取三个统计数据并将计数器初始化为零。 计数器将代表该玩家赢得的双打次数。 
3. 使用以下命令对照阈值 10 检查三个统计数据中的每一个`>=`。 只要统计数据至少为 10，就递增计数器。需要包含比较，因为正好 10 的值符合条件。 
4. 选择计数器对应的消息。 计数 0 映射到`zilch`, 1 至`double`, 2 至`double-double`, 和 3 到`triple-double`。 
5. 打印原始的三个统计数据，后跟所选消息。 在玩家结果后打印一个空行，匹配所需的输出格式。 

不变量很简单：处理完三个统计数据中的任何一个前缀后，计数器恰好等于已处理的至少为 10 的统计数据的数量。每个统计数据当且仅当其符合条件时才向计数器贡献 1，因此在处理完所有三个统计数据后，计数器恰好是双精度数的数量。 从 0 到 3 的最终映射是详尽的，因此所选消息必须是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    output = []

    names = ["zilch", "double", "double-double", "triple-double"]

    for _ in range(n):
        stats = list(map(int, input().split()))

        doubles = sum(value >= 10 for value in stats)
        output.append(f"{stats[0]} {stats[1]} {stats[2]}\n{names[doubles]}")

    sys.stdout.write("\n\n".join(output) + "\n\n")

if __name__ == "__main__":
    solve()
```这`names`array 直接编码四个可能的答案。 其指标是满足阈值的统计数，所以`names[doubles]`避免较长的条件语句链。 

蟒蛇对待`True`作为 1 和`False`为 0，这使得`sum(value >= 10 for value in stats)`一种计算合格统计数据的紧凑方法。 比较仍然包含在内，因此 10 被正确处理。 

原始统计数据被存储，以便可以按照所需的顺序准确地再现它们。 由于每个玩家只有三个值，因此每个玩家使用恒定的内存。 这`output`list 在写入一次之前存储所有玩家生成的输出，这也可以在有很多玩家时保持 I/O 效率。 

不存在整数溢出问题，因为每个输入统计量最多为100，并且计数器只能为0、1、2或3。最终`"\n\n"`为每个玩家的输出块提供所需的空行，包括最终玩家。 

## 工作示例

 对于示例 1，输入包含四个玩家。 处理过程可追溯如下。 

| 玩家| 统计 | 合格值|`doubles`| 留言 |
 | --- | --- | --- | --- | --- |
 | 1 | 5 0 8 | 无 | 0 |`zilch`|
 | 2 | 30 10 50 | 30 10 50 30、10、50 | 3 |`triple-double`|
 | 3 | 20 5 20 | 20 5 20 20, 20 | 2 |`double-double`|
 | 4 | 5 100 6 | 5 100 6 100 | 100 1 |`double`|

 结果输出是```
5 0 8
zilch

30 10 50
triple-double

20 5 20
double-double

5 100 6
double
```此示例练习了计数器的每个可能值（从零到三）。 它还确认正好 10 人符合资格，因为第二名玩家的中间统计数据是 10。 

第二个有用的示例重点关注阈值本身以及紧邻其之下和之上的值。```
3
9 10 11
0 0 0
10 10 10
```| 玩家| 统计 | 第一次检查后| 第二次检查后| 第三次检查后| 留言 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 9 10 11 | 9 10 11 0 | 1 | 2 |`double-double`|
 | 2 | 0 0 0 | 0 0 0 0 | 0 | 0 |`zilch`|
 | 3 | 10 10 10 | 10 10 10 1 | 2 | 3 |`triple-double`|

 对应的输出是```
9 10 11
double-double

0 0 0
zilch

10 10 10
triple-double
```第一个玩家在单行中展示边界的两侧。 值 9 被拒绝，而 10 和 11 被接受。 第三位玩家确认产生三个资格值`triple-double`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | n 个玩家中的每一个都恰好检查了三个统计数据，因此每个玩家的工作量是恒定的。 |
 | 空间| O(n) | 该实现在写入之前存储所有玩家生成的输出。 该算法本身需要每个玩家 O(1) 辅助空间。 |

 该问题的每个玩家的计算量是恒定的，因此运行时间随着玩家数量的增加而线性增长。 即使输入包含大量玩家，该算法也仅对每个玩家执行三个阈值检查，并且不执行任何嵌套扫描。 统计值本身很小，因此算法使用的内存与其大小无关。 

## 测试用例```python
import sys
import io

def solve():
    input = sys.stdin.readline
    n = int(input())
    output = []

    names = ["zilch", "double", "double-double", "triple-double"]

    for _ in range(n):
        stats = list(map(int, input().split()))
        doubles = sum(value >= 10 for value in stats)
        output.append(f"{stats[0]} {stats[1]} {stats[2]}\n{names[doubles]}")

    sys.stdout.write("\n\n".join(output) + "\n\n")

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
assert run(
    """4
5 0 8
30 10 50
20 5 20
5 100 6
"""
) == (
    """5 0 8
zilch

30 10 50
triple-double

20 5 20
double-double

5 100 6
double

"""
), "sample 1"

# Minimum-size input
assert run(
    """1
0 0 0
"""
) == (
    """0 0 0
zilch

"""
), "minimum-size case"

# All values equal to the threshold
assert run(
    """1
10 10 10
"""
) == (
    """10 10 10
triple-double

"""
), "threshold is inclusive"

# Values immediately around the threshold
assert run(
    """3
9 9 9
9 10 11
11 9 10
"""
) == (
    """9 9 9
zilch

9 10 11
double-double

11 9 10
double-double

"""
), "boundary values"

# Large stress case
large_n = 100000
large_input = str(large_n) + "\n" + ("100 0 0\n" * large_n)
large_expected = ("100 0 0\ndouble\n\n" * large_n)
assert run(large_input) == large_expected, "large input"

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 0 0 0`|`zilch`| 最小尺寸输入和零合格统计|
 |`1 / 10 10 10`|`triple-double`| 包容门槛和全部三项资格 |
 |`3 / 9 9 9`,`9 10 11`,`11 9 10`|`zilch`,`double-double`,`double-double`| 紧邻边界下方、边界处和边界上方的值 |
 | 100000 名玩家`100 0 0`|`double`对于每一位玩家| 大输入和线性时间行为 |

 ## 边缘情况

 最危险的边界情况恰好是 10。```
1
10 0 0
```该算法首先检查 10，然后评估`10 >= 10`为真，并改变`doubles`从 0 到 1。其余值不符合条件，因此最终计数为 1，输出为`double`。 一个实现使用`>`会产生错误的答案。 

下边界表现对称。 为了```
1
9 9 9
```每次比较`9 >= 10`为 false，使计数器保持为 0。输出为`zilch`。 这会捕获意外测试统计数据是否为正而不是是否达到所需阈值的实现。 

所有符合资格的情况是```
1
10 10 10
```计数器在第一个值后变为 1，在第二个值后变为 2，在第三个值后变为 3。 最终的查找结果是`names[3]`，这给出了`triple-double`。 一旦找到第一个合格统计数据就打印的解决方案在这里会失败。 

不合格的情况是```
1
0 0 0
```计数器在整个扫描过程中保持为零，因此`names[0]`给出`zilch`。 这也证实了零是正常的统计值，不需要特殊的输入处理。 

最后，输出格式本身可能会导致原本正确的解决方案失败。 对于多个玩家，每个玩家的原始统计数据后面必须跟着其消息，并用空行分隔输出块。 该解决方案为每个玩家构建一个完整的块，并用两个换行符连接这些块，从而防止来自不同玩家的统计数据和消息意外混合。
