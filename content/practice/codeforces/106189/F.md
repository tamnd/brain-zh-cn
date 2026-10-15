---
title: "CF 106189F - 经典俄罗斯方块：计分"
description: "我们得到了俄罗斯方块玩家的得分日志。 每个日志条目都告诉我们玩家一次准确地清除了 1、2、3 或 4 行，由字符串 single、double、triple 和 tetris 表示。 玩家从18级开始。"
date: "2026-06-25T06:48:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106189
codeforces_index: "F"
codeforces_contest_name: "ICPC Central Russia Regional Contest, 2025"
rating: 0
weight: 106189
solve_time_s: 39
verified: true
draft: false
---

[CF 106189F - 经典俄罗斯方块：评分](https://codeforces.com/problemset/problem/106189/F)

 **评级：** -
 **标签：** -
 **求解时间：** 39s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了俄罗斯方块玩家的得分日志。 每个日志条目告诉我们玩家一次准确地清除了 1、2、3 或 4 行，由字符串表示`single`,`double`,`triple`， 和`tetris`。 

玩家从 18 级开始。通关所获得的分数取决于当前等级。 

18级时：

 - 单=760分
 - 双倍 = 1900 点
 - 三倍 = 5700 点
 - 俄罗斯方块 = 22800 点

 当清除的线路总数达到一定阈值时，级别会增加。 

第一次转变很特别。 玩家将保持在 18 级，直到累积至少 130 条总清除线。 一旦总数达到 130 或更多，玩家就会升到 19 级。 

此后，每清除 10 条线，等级就会增加 1 级。 达到 140 行可以达到 20 级，达到 150 行可以达到 21 级，以此类推。 

每超过 18 级，得分值就会增加：

 - 单人 +40
 - 双打+100
 - 三人+300
 - 俄罗斯方块 +1200

 任务是处理日志，计算最终分数，并输出分数和最终级别。 

动作的数量可以大到$10^5$。 这立即排除了任何重复迭代每个动作的行数或级别范围的模拟。 我们需要一个其工作量与日志条目数量成正比的解决方案。 一个$O(N)$扫描速度足够快。 

一个微妙的细节是，用于对动作进行评分的级别是添加该动作中新清除的线之前的级别。 如果一次移动清除了足够多的线以跨越阈值，则该移动仍使用之前的级别进行评分，并且只有未来的移动才会使用更高的级别。 

考虑这个例子：```
129 cleared lines so far
next action = single
```单曲仍必须按 18 级单曲评分。 行动结束后，总数变为 130，玩家晋级到 19 级。 

一个常见的错误是首先更新行数，计算新级别，然后对动作进行评分。 这会错误地为实际触发转变的举动授予 19 级积分。 

另一个边缘情况是一次大的清晰跨越几个阈值。```
128 lines
next action = tetris
```玩家的总行数从 128 跳到 132。 该动作的评分仍为 18 级。之后才变为 19 级。 

## 方法

 简单的模拟会一一处理这些动作。 

对于每个动作，根据已清除的行数确定当前级别，查找该操作在该级别的分数，添加相应的已清除行数，然后继续。 

即使是暴力版本也已经很有效了，因为只有$10^5$行动。 唯一潜在的低效率是通过迭代阈值来重复重新计算级别。 如果我们每次都扫描阈值，成本就会不必要地增加。 

关键的观察结果是，级别仅取决于当前操作之前清除的行数。 有一个直接的公式。 

如果清除的行数少于 130 行，则级别为 18。 

否则：$$\text{level} = 19 + \left\lfloor \frac{\text{lines}-130}{10} \right\rfloor$$一旦我们可以在恒定时间内计算出当前级别，每个动作也会在恒定时间内处理。 

为了得分，让$$d = \text{level} - 18$$那么分值就变成：$$760 + 40d$$对于单身人士来说，$$1900 + 100d$$对于双人间来说，$$5700 + 300d$$对于三人组来说，$$22800 + 1200d$$俄罗斯方块。 

整个问题简化为对日志的一次传递。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力阈值模拟 | O(N) | O(1) | O(1) | 已接受 |
 | 最优直接级计算 | O(N) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 初始化`lines = 0`和`score = 0`。 
2. 对于每个得分动作，根据已清除的行数确定当前级别。 

如果`lines < 130`，级别为 18。否则使用：$$19 + (lines - 130) // 10$$3. 计算`d = level - 18`。 

这告诉我们自起始级别以来已经发生了多少级别提升。 
4. 使用当前级别的当前操作奖励积分。 

在添加新清除的线路之前，必须对该动作进行评分。 
5、添加相应数量的清除行：`single -> 1`

`double -> 2`

`triple -> 3`

`tetris -> 4`6. 继续，直到处理完所有日志条目。 
7. 处理整个日志后，使用相同的公式根据最终清除的行总数计算最终级别。 
8.输出最终得分和最终级别。 

### 为什么它有效

 在每一时刻，游戏级别仅由当前动作之前清除的行数决定。 评分规则取决于该级别，而不取决于操作后的行数。 

该算法准确地保持了这个不变量。 在处理每个日志条目之前，`lines`存储先前清除的行数。 当前级别是根据该值计算的，对操作进行相应评分，然后才添加新清除的行。 

因为每个动作都是使用与真实游戏相同的级别进行评分，并且因为级别转换是直接根据官方阈值计算的，所以累积分数和最终级别是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def get_level(lines):
    if lines < 130:
        return 18
    return 19 + (lines - 130) // 10

def solve():
    n = int(input())

    score = 0
    lines = 0

    for _ in range(n):
        action = input().strip()

        level = get_level(lines)
        d = level - 18

        if action == "single":
            score += 760 + 40 * d
            lines += 1
        elif action == "double":
            score += 1900 + 100 * d
            lines += 2
        elif action == "triple":
            score += 5700 + 300 * d
            lines += 3
        else:  # tetris
            score += 22800 + 1200 * d
            lines += 4

    final_level = get_level(lines)
    print(score, final_level)

solve()
```功能`get_level`直接编码电平转换规则。 将此逻辑保留在一个地方可以避免评分和最终级别计算之间的不一致。 

关键的实现细节是操作的顺序。 当前级别是在更新行数之前计算的。 这与移动跨越阈值时游戏的行为相匹配。 

分数值通过 18 级基本值加上与级别相关的增量来表示。 这避免了存储大表并反映了语句中描述的规则。 

Python 整数自动处理大值，因此即使每个操作都是俄罗斯方块，也不存在溢出问题。 

## 工作示例

 ### 示例 1

 输入：```
4
single
double
triple
tetris
```| 行动| 之前的行 | 水平| 获得积分 | | 之后的行 总分|
 | ---| ---| ---| ---| ---| ---|
 | 单身| 0 | 18 | 18 760 | 760 1 | 760 | 760
 | 双| 1 | 18 | 18 1900 | 1900 3 | 2660 | 2660
 | 三重| 3 | 18 | 18 5700 | 6 | 8360 |
 | 俄罗斯方块 | 6 | 18 | 18 22800 | 22800 10 | 10 31160|

 最终等级 = 18。 

输出：```
31160 18
```该跟踪显示没有超过阈值，因此每个操作都使用起始级别。 

### 示例 2

 构造的例子：```
2
tetris
tetris
```假设玩家在这两个动作之前已经清除了 128 条线。 我们关注跨越阈值的行为。 

| 行动| 之前的行 | 水平| 获得积分 | | 之后的行
 | ---| ---| ---| ---| ---|
 | 俄罗斯方块 | 128 | 128 18 | 18 22800 | 22800 132 | 132
 | 俄罗斯方块 | 132 | 132 19 | 19 24000 | 136 | 136

 第一个俄罗斯方块跨越了 130 条线，但得分仍为 18 级。只有下一个动作才获得 19 级得分。 

这证实了算法使用的关键不变量。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N) | 每个日志条目都会处理一次 |
 | 空间| O(1) | O(1) | 仅存储了几个计数器|

 至多有$10^5$动作，单个线性扫描很容易在时间限制内完成。 无论输入大小如何，内存使用量都保持不变。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    input_data = io.StringIO(inp)
    output_data = io.StringIO()

    def input():
        return input_data.readline()

    n = int(input())

    def get_level(lines):
        if lines < 130:
            return 18
        return 19 + (lines - 130) // 10

    score = 0
    lines = 0

    for _ in range(n):
        action = input().strip()

        level = get_level(lines)
        d = level - 18

        if action == "single":
            score += 760 + 40 * d
            lines += 1
        elif action == "double":
            score += 1900 + 100 * d
            lines += 2
        elif action == "triple":
            score += 5700 + 300 * d
            lines += 3
        else:
            score += 22800 + 1200 * d
            lines += 4

    output_data.write(f"{score} {get_level(lines)}")
    return output_data.getvalue()

# provided samples
assert run("4\nsingle\ndouble\ntriple\ntetris\n") == "31160 18"
assert run("2\nsingle\nsingle\n") == "1520 18"

# minimum input
assert run("1\nsingle\n") == "760 18"

# exact first threshold
assert run("130\n" + "single\n" * 130) == "98800 19"

# threshold crossed by last action
assert run("33\n" + "tetris\n" * 33) == "752400 19"

# all equal values
assert run("3\ntetris\ntetris\ntetris\n") == "68400 18"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 一张单| 760 18 | 最小尺寸|
 | 130 单打 | 98800 19 | 准确过渡到19级|
 | 33 俄罗斯方块 | 752400 19 | 通过多线清除跨越门槛|
 | 三个俄罗斯方块| 68400 18 | 重复相同的动作|

 ## 边缘情况

 考虑跨越阈值的情况：```
33
tetris
tetris
...
tetris
```经过 32 次俄罗斯方块后，玩家已清除 128 条线并保持在 18 级。第 33 次俄罗斯方块使用 18 级进行评分，得分为 22800 分。 将已清除的 4 条线相加后，总数变为 132，从而将玩家提升至 19 级。 

在评分之前更新行数的解决方案会错误地为最终的俄罗斯方块奖励 24000 分。 

现在考虑确切的阈值：```
130
single
single
...
single
```第 130 个单打在玩家还有 129 条清线时得分，因此使用 18 级计分。 添加该行后，总数恰好变为 130，最终级别变为 19。算法在更新之前计算级别`lines`，所以它正确地处理了这个边界。 

最后，考虑一个永远不会达到 130 行的游戏：```
2
single
double
```总行数仅为 3。每个动作的评分为 18 级，最终级别仍为 18。该公式正确地保留在所有计算的特殊预转换范围内。
