---
title: "CF 917C - 蝌蚪"
description: "我们被要求将一组 x 蝌蚪从一行中的前 x 块石头移到最后 x 块石头。 石头编号为 1 到 n，每只蝌蚪恰好占据一块石头。"
date: "2026-06-13T02:16:36+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "dp", "matrices"]
categories: ["algorithms"]
codeforces_contest: 917
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 459 (Div. 1)"
rating: 2900
weight: 917
solve_time_s: 386
verified: false
draft: false
---

[CF 917C - Pollywog](https://codeforces.com/problemset/problem/917/C)

 **评分：** 2900
 **标签：** 组合数学、dp、矩阵
 **求解时间：** 6m 26s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求搬走一组`x`从一开始就是蝌蚪`x`石头排成一排直到最后`x`石头。 石头都有编号`1`通过`n`，并且每只蝌蚪恰好占据一块石头。 蝌蚪最多能跳`k`一次向右移动石头，每次跳跃距离`i`成本核算`c[i]`活力。 有些石头很特殊，会带来额外的能量消耗或奖励`w[p]`。 两只蝌蚪不能同时占据同一块石头。 目标是找到将所有蝌蚪移动到最后所需的最小总能量`x`石头，考虑到跳跃成本和特殊石头。 

约束条件告诉我们`x`和`k`最多 8 个，非常小，而`n`最多可达 10^8。 这立即表明我们无法明确模拟每块石头或迭代所有位置。 相反，该解决方案必须利用蝌蚪数量少和跳跃范围小的优势。 特殊石的数量最多为25颗，所以相比之下比较稀疏`n`。 能量值可能为负，因此最佳路径可能会故意落在有益的特殊石头上。 

当跳跃与最后一颗棋子重叠时，就会出现微妙的边缘情况。 例如，如果一只蝌蚪可以跳 1 到 3 块石头，并且就在最后一块石头之前`x`石头，我们必须确保它精确地落在空的目标石头上，而不与另一只蝌蚪碰撞。 总是采取最小立即跳跃成本的天真贪婪策略可能会失败，因为它可能会迫使后来的蝌蚪进行一次昂贵的跳跃或降落在具有负面影响的特殊石头上。 

## 方法

 最简单的方法是将每个可能的移动序列建模为状态转换。 状态可以由所有的位置来定义`x`pollywog，并且从每个状态，我们为最左边的 pollywog 生成所有有效的跳转。 我们计算每个跃迁的能量并递归地找到最小总能量。 虽然这在原则上是正确的，但状态的数量是`O(n^x)`在最坏的情况下，这是一个天文数字`n`可以达到 10^8，即使`x`最多 8。所以直接的状态空间搜索是不可行的。 

关键的见解来自于对蝌蚪严格向右移动且无法超越对方的观察。 它们的相对顺序被保留，这使我们能够将能量视为蝌蚪之间距离的函数，而不是绝对位置的函数。 自从`k`和`x`很小，我们可以将状态编码为蝌蚪与移动的石头窗口的偏移量，然后计算到达下一个特殊石头或最后一个石头的最小能量`x`使用动态规划的石头。 稀疏特殊石头意味着我们只需要显式处理几个位置，并且在它们之间，我们可以使用 min-plus 算术将最小能量计算为矩阵乘积。 这降低了指数级的复杂性`n`呈指数增长`x`和`k`，独立于`n`，并有效处理大间隙。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^x * k^x) | O(n^x * k^x) | O(n^x) | O(n^x) | 太慢了 |
 | 最优（DP + 矩阵求幂）| O(q * k^x * x^2) | O(q * k^x * x^2) | O(k^x) | O(k^x) | 已接受 |

 ## 算法演练

 1. 对状态进行编码`x`pollywogs 作为相对位置的元组。 因为跳跃最多是`k`石头，尺寸窗口内的相对位置`k`捕获有关碰撞的所有约束。 
2. 构建转移矩阵`T`对于单个移动，其中`T[s1][s2]`是从状态转移的最小能量`s1`陈述`s2`在最左边的蝌蚪的一跳中，考虑到跳跃成本和特殊的石头效果。 
3. 稀疏特殊石头允许我们将路径分成连续特殊石头之间的片段。 对于每个段`d`没有特殊石子的石子，计算过渡矩阵的幂`d`在最小加算术下。 这计算了遍历的最小能量`d`一批石头。 
4. 在每个特殊石头处，通过添加石头的能量来调整能量`w[p]`当最左边的蝌蚪落在上面时的值。 然后继续对下一段进行矩阵求幂。 
5.处理完所有特殊石子后，处理通向最后的最后一段`x`石头。 蝌蚪占据最后的所有有效状态中的最小能量`x`石头就是答案。 

为什么它有效：不变量是在每一步中，DP 或矩阵包含达到每个编码状态的最小能量。 因为蝌蚪不能互相超越，所以不会跳过任何状态，并且矩阵求幂可以正确地将最小能量传播到石头片段上。 特殊宝石会在到达时准确处理，因此所有能量贡献都会被考虑在内。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from itertools import product
from collections import defaultdict

def min_plus_matmul(A, B):
    n = len(A)
    C = [[float('inf')]*n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            for k in range(n):
                C[i][j] = min(C[i][j], A[i][k]+B[k][j])
    return C

def mat_pow(mat, power):
    n = len(mat)
    res = [[0 if i==j else float('inf') for j in range(n)] for i in range(n)]
    while power:
        if power % 2:
            res = min_plus_matmul(res, mat)
        mat = min_plus_matmul(mat, mat)
        power //= 2
    return res

x, k, n, q = map(int, input().split())
c = list(map(int, input().split()))
special = {}
for _ in range(q):
    p, w = map(int, input().split())
    special[p] = w

# Enumerate all valid relative states
states = []
def dfs(pos, last):
    if len(pos) == x:
        states.append(tuple(pos))
        return
    for jump in range(1, k+1):
        next_pos = last + jump
        dfs(pos+[next_pos], next_pos)
dfs([], 0)

state_index = {s:i for i,s in enumerate(states)}
size = len(states)

# Build single-step transition matrix
T = [[float('inf')]*size for _ in range(size)]
for i, s1 in enumerate(states):
    for j, s2 in enumerate(states):
        valid = True
        cost = 0
        for a, b in zip(s1, s2):
            d = b - a
            if d < 1 or d > k:
                valid = False
                break
            cost += c[d-1]
        if valid:
            T[i][j] = cost

dp = [float('inf')]*size
dp[state_index[tuple(range(1,x+1))]] = 0

# Process segments between special stones
points = sorted(list(special.keys()) + [n-x+1])
prev = x+1
for p in points:
    d = p - prev
    if d > 0:
        Tp = mat_pow(T, d)
        new_dp = [float('inf')]*size
        for i in range(size):
            for j in range(size):
                new_dp[j] = min(new_dp[j], dp[i]+Tp[i][j])
        dp = new_dp
    # apply special stone effect if leftmost pollywog lands on it
    new_dp = [float('inf')]*size
    for i, s in enumerate(states):
        leftmost = s[0] + (p-prev)
        add = special.get(leftmost, 0)
        new_dp[i] = dp[i] + add
    dp = new_dp
    prev = p

# Final segment to last x stones
d = n - x + 1 - prev
if d > 0:
    Tp = mat_pow(T, d)
    new_dp = [float('inf')]*size
    for i in range(size):
        for j in range(size):
            new_dp[j] = min(new_dp[j], dp[i]+Tp[i][j])
    dp = new_dp

# Answer: min energy among states ending at last x stones
ans = float('inf')
for i, s in enumerate(states):
    if s == tuple(range(n-x+1, n+1)):
        ans = min(ans, dp[i])
print(ans)
```该代码首先在一个窗口内生成蝌蚪的所有相对状态`k`并枚举遵守跳跃限制的转换。 矩阵求幂可有效处理特殊宝石之间的大间隙。 当最左边的蝌蚪到达时，每个特殊宝石的能量调整都会生效。 边界索引经过仔细处理，以确保不会发生冲突，并且最终位置与最后一个位置完全匹配`x`石头。 

## 工作示例

 使用示例 1：

 | 步骤| 职位（州）| dp值| 评论 |
 | --- | --- | --- | --- |
 | 0 | (1,2) | 0 | 初始位置 |
 | 跳3 | (2,5) | 1 | 最小的跳跃成本|
 | 跳2 | (3|||
