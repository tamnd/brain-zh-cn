---
title: "CF 142D - 帮助怪物史莱克与驴 2"
description: "我们被要求分析矩形网格上的两人游戏，其中每个单元格可能包含史莱克（绿色）或驴子（红色）的玩具士兵，或者是空的。 网格的尺寸为 n × m，每行最多有两个士兵。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "games"]
categories: ["algorithms"]
codeforces_contest: 142
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 102 (Div. 1)"
rating: 2600
weight: 142
solve_time_s: 154
verified: true
draft: false
---

[CF 142D - 帮助史瑞克与驴 2](https://codeforces.com/problemset/problem/142/D)

 **评分：** 2600
 **标签：** 游戏
 **求解时间：** 2m 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求分析矩形网格上的两人游戏，其中每个单元格可能包含史莱克（绿色）或驴子（红色）的玩具士兵，或者是空的。 网格的尺寸为_n_ × _m_，每行最多有两个士兵。 玩家轮流将 1 到 _k_ 个单位之间的一些士兵移向或远离沿行的敌方士兵。 士兵不能穿过或进入任何其他士兵占据的牢房，并且移动仅限于该士兵所在的行。 如果玩家没有有效的动作，他们就会失败。 史莱克总是先行动。 任务是在双方都发挥最佳的情况下预测获胜者。 

输入指定网格布局，以及控制玩家一回合可以移动的最大士兵数量的数字_k_。 输出是获胜者：如果史莱克获胜，则输出“第一”；如果驴赢，则输出“第二”；如果游戏可以在最佳玩法下无限期地继续下去，则输出“平局”。 

约束告诉我们 _n_、_m_ 和 _k_ 最多都是 100。这表明我们无法对所有游戏状态进行简单的递归模拟，因为可能的排列数量与士兵数量成指数关系。 然而，每排最多两名士兵的限制极大地限制了每排的可能移动。 这暗示游戏可以分解为独立的行并使用组合博弈论进行建模。 

当行包含单个士兵或没有士兵时，会出现一个重要的边缘情况。 例如，如果一排有一个单独的史莱克士兵并且没有驴子士兵，则该士兵可以自由移动，并且该排可能永远不会“结束”。 相反，如果两个玩家在同一行上都有一名士兵并且 _k_ ≥ 1，则该行的行为就像一个移动次数有限的简单 Nim 堆。 误解这些情况可能会产生错误的获胜者。 

## 方法

 蛮力方法是递归地模拟每一个可能的动作，将位置标记为赢或输。 这将涉及生成最多 _k_ 个士兵的所有子集以进行移动，计算他们的新位置，并递归地评估结果状态。 这种方法在概念上是有效的，因为游戏是有限的，但会变得棘手：即使每行只有两名士兵并且 100 行，分支因子也很大，并且状态数量呈指数级增长。 

关键的见解是每一行都是独立的。 由于士兵沿着行移动并且不能跳跃或跨越其他行，因此除了通过“行游戏”的总和之外，一行上的移动不会影响其他行。 因此，每一行都可以被视为一维组合游戏。 具体来说，问题简化为计算每行的格伦迪数（Nimbers）。 一旦知道了每一行的 Grundy 数，就可以根据 Sprague-Grundy 定理对所有行 Grundy 数进行异或运算来确定总获胜者：如果 XOR 为零，则第二个玩家获胜；如果 XOR 为零，则第二个玩家获胜；如果 XOR 为零，则第二个玩家获胜。 如果非零，则第一个玩家获胜。 如果一行是无界的（士兵可以在某个方向上无限移动），它就贡献了一个“无限”游戏，产生平局。 检测此类无限移动至关重要。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^(n*m)) | O(2^(n*m)) | O(n*m) | 太慢了 |
 | 每行格伦迪| O(n * m * k) | O(n * m * k) | O(n * m) | 已接受 |

 ## 算法演练

1. 读取网格尺寸_n_、_m_、每次移动的最大士兵数_k_以及网格本身。 
2. 初始化一个累加器，用于行 Grundy 数字的 XOR。 
3. 找出每一行史莱克和驴子士兵的位置。 
4. 如果该行不包含敌方士兵，请检查是否有任何士兵可以自由移动到行边界之外。 如果是这样，请将游戏标记为“平局”。 
5. 对于有两名玩家的行，将最左边和最右边士兵之间的段建模为有界 Nim 堆。 堆大小等于士兵之间的空单元格数量。 假设玩家可以在一个回合中移动 1 到 _k_ 个单位，计算其 Grundy 数。 
6. 将每行的 Grundy 数异或到累加器中。 
7. 处理完所有行后，如果有任何行被标记为无限，则打印“Draw”。 
8. 否则，如果异或为零，则打印“Second”； 否则打印“第一”。 

正确性取决于斯普拉格-格伦迪定理：每一行都是一个独立的公正游戏，具有明确的动作，行格伦迪数字的异或决定了总体获胜者。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def mex(s):
    m = 0
    while m in s:
        m += 1
    return m

def compute_grundy(length, k):
    if length == 0:
        return 0
    g = [0] * (length + 1)
    for i in range(1, length + 1):
        s = set()
        for move in range(1, min(k, i) + 1):
            s.add(g[i - move])
        g[i] = mex(s)
    return g[length]

def main():
    n, m, k = map(int, input().split())
    grid = [input().strip() for _ in range(n)]
    xor_sum = 0
    infinite = False
    
    for row in grid:
        positions = [(i, c) for i, c in enumerate(row) if c in 'GR']
        if not positions:
            continue
        
        G_pos = [i for i, c in positions if c == 'G']
        R_pos = [i for i, c in positions if c == 'R']
        
        if not R_pos:
            infinite = True
            continue
        if not G_pos:
            continue
        
        left = min(G_pos + R_pos)
        right = max(G_pos + R_pos)
        empty_between = right - left - 1
        xor_sum ^= compute_grundy(empty_between, k)
    
    if infinite:
        print("Draw")
    elif xor_sum == 0:
        print("Second")
    else:
        print("First")

if __name__ == "__main__":
    main()
```该解决方案首先计算士兵之间分段的格伦迪数，然后聚合它们。 这`compute_grundy`函数使用动态编程表进行有界移动的 1D Nim 堆。 我们分别跟踪无限行。 边界检查可以避免错误计算网格之外的单元格。 

## 工作示例

 **样品1**

 输入：```
2 3 1
R-G
RG-
```第 1 行：0 (R) 和 2 (G) 处的位置。 之间的空单元格： 1. 长度为 1 且 k=1 的格兰迪数为 1。 XOR 和 = 1。 

第 2 行：0 (R) 和 1 (G) 处的位置。 之间的空单元格：0。Grundy 数 = 0。XOR 和仍为 1。 

没有无限行，XOR 和 ≠ 0，因此输出为“First”。 

**自定义示例**```
2 4 2
G--R
-R-G
```第 1 行：0 (G) 和 3 (R) 之间的空单元格：2.Grundy 数 = 2。XOR 和 = 2。 

第 2 行：1 (R) 和 3 (G) 处的位置：空单元格 = 1。Grundy =1。 异或和 = 2 ^ 1 = 3。 输出：“第一。”

 这表明多行通过 XOR 正确组合，尊重独立的行行为。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n * m * k) | O(n * m * k) | 每行最多有 m 个单元格，我们计算长度为 m 的 Grundy 数，移动次数为 k。 |
 | 空间| O(米) | 每行长度最大为 m 的段的 DP 表。 |

 当 n、m ≤ 100 且 k ≤ 100 时，n * m * k ≤ 10^6，完全符合 2 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    f = io.StringIO()
    with redirect_stdout(f):
        main()
    return f.getvalue().strip()

# provided sample
assert run("2 3 1\nR-G\nRG-\n") == "First", "sample 1"

# minimum-size inputs
assert run("1 1 1\nG\n") == "Draw", "single G alone"

# maximum-size inputs, all G
assert run("100 100 100\n" + ("G"*100 + "\n")*100) == "Draw", "all G infinite"

# row with k > empty space
assert run("1 5 3\nG---R\n") == "First", "row with length 3, k=3"

# row with no G
assert run("1 5 3\nR---R\n") == "Second", "row with only R"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 1 1\nG\n | 1 1 1\nG\n | 画 | 单兵行动自如，游戏无限|
 | 100x100 网格 G | 画 | 最大输入，无限移动检测|
 | 1 5 3\nG---R | 第一 | k >= 空空间的有界 Nim 堆 |
 | 1 5 3\nR---R | 第二 | 只有第二个玩家可以移动，第一个玩家不能移动 |

 ## 边缘情况

 与一个孤独的史莱克士兵发生争吵
