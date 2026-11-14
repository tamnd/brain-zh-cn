---
title: "CF 429B - 锻炼"
description: "我们有一个二维健身房，表示为大小为 n × m 的网格。 每个单元格包含一个正整数，表示在该位置进行锻炼所消耗的卡路里。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp"]
categories: ["algorithms"]
codeforces_contest: 429
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 245 (Div. 1)"
rating: 1600
weight: 429
solve_time_s: 57
verified: true
draft: false
---

[CF 429B - 锻炼](https://codeforces.com/problemset/problem/429/B)

 **评分：** 1600
 **标签：** dp
 **求解时间：** 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个二维健身房，表示为大小为 _n_ × _m_ 的网格。 每个单元格包含一个正整数，表示在该位置进行锻炼所消耗的卡路里。 两个人，Iahub 和 Iahubina，各自从对角开始，需要到达另一侧：Iahub 从左上角开始，到右下角，仅向下或向右移动，而 Iahubina 从左下角开始，到右上角，仅向上或向右移动。 就在一个牢房里，他们相遇并暂停，但没有进行任何锻炼。 目标是最大化两条路径燃烧的总卡路里。 

关键的复杂性源于网格的大小：_n_ 和 _m_ 都可以达到 1000。尝试所有可能的交汇点和所有可能的路径的简单方法将呈指数级缓慢。 由于网格有多达 1,000,000 个单元，因此任何执行 O(n²·m²) 操作的解决方案都将超出时间限制。 我们需要 O(n·m) 左右的东西才能安全。 

非明显的边缘情况包括这样的场景：最大收益来自于在边界附近相遇，迫使路径以非直观的方式弯曲。 例如，考虑一个 3×3 网格，其中中间单元格具有最小值。 如果会议单元是中心，每个人都必须避免不必要地浪费高价值单元，而粗心的贪心方法可能会选择局部最大值，但会错过最佳组合和。 

## 方法

 强力方法会考虑每个可能的会议单元。 对于每个单元格，我们将计算从 Iahub 的起始点到该单元格以及 Iahubina 的从起始点到该单元格的所有可能路径收集的最大卡路里。 然后我们还将计算每个人从会议单元到终点的路径。 原则上这是正确的，但对于每个 n·m 个相遇单元，计算路径可能需要 O(n·m)，从而导致总操作量为 O(n²·m²)。 当 n、m ≤ 1000 时，这大约是 10^2 次操作，太慢了。 

关键的见解是每个人只能向两个方向移动：Iahub 向下或向右，Iahubina 向上或向右。 这意味着可以使用动态编程预先计算收集到任何单元的最大卡路里。 具体来说，我们可以计算四个 DP 数组：

 1.`dp1[i][j]`- 最大卡路里从左上角到`(i, j)`（Iahub启动）
 2.`dp2[i][j]`- 最大卡路里从右下到`(i, j)`（Iahub完）
 3.`dp3[i][j]`- 最大卡路里从左下角到`(i, j)`（亚胡比娜开始）
 4.`dp4[i][j]`- 最大卡路里从右上角到`(i, j)`（亚胡比娜完结）

 一旦这些被填满，对于每个潜在的会议单元`(i, j)`，我们可以将总增益计算为两条不相交路径的总和，以避免重复计算会议单元。 它们可以通过两种方式相遇，同时最大化总增益，对应于两种“交叉”模式：一种是水平交叉而不共享边缘，另一种是垂直交叉。 迭代所有内部单元（不包括边界）并计算这些 DP 数组的总和是 O(n·m)，这是高效的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²·m²) | O(n·m) | 太慢了|
 | DP预计算| O(n·m) | O(n·m) | 已接受 |

 ## 算法演练

 1. 阅读尺寸`n`,`m`和网格`a`。 我们需要计算沿四个方向的最大增益。 
2.初始化四个DP数组：`dp1`,`dp2`,`dp3`,`dp4`。 每个数组存储从特定开始到每个单元格的最大卡路里。 使用相应单元格的卡路里初始化每个 DP 数组的起始单元格。 
3. 填充`dp1`（Iahub 从左上到右下）。 对于每个单元格`(i, j)`，达到该值的最大卡路里为`a[i][j] + max(dp1[i-1][j], dp1[i][j-1])`。 第一行和第一列处理仅存在一个先前单元格的边缘情况。 
4. 填充`dp2`（Iahub 从右下角到左上角）。 对于每个单元格`(i, j)`,`dp2[i][j] = a[i][j] + max(dp2[i+1][j], dp2[i][j+1])`。 从右下角开始向后移动。 
5. 填充`dp3`（Iahubina 从左下到右上角）。 对于每个单元格`(i, j)`,`dp3[i][j] = a[i][j] + max(dp3[i+1][j], dp3[i][j-1])`。 从左下角开始。 
6. 填充`dp4`（Iahubina 从右上到左下）。 对于每个单元格`(i, j)`,`dp4[i][j] = a[i][j] + max(dp4[i-1][j], dp4[i][j+1])`。 从右上角开始。 
7. 迭代所有内部单元格`(i, j)`在哪里`1 ≤ i ≤ n-2`和`1 ≤ j ≤ m-2`。 对于每个单元格，计算两个可能的交叉总数：

 - 模式 1：Iahub 向下然后向右，Iahubina 向右然后向上。`total1 = dp1[i-1][j] + dp2[i+1][j] + dp3[i][j-1] + dp4[i][j+1]`- 模式 2：Iahub 向右然后向下，Iahubina 向上然后向右。`total2 = dp1[i][j-1] + dp2[i][j+1] + dp3[i+1][j] + dp4[i-1][j]`用最大值更新答案`total1`和`total2`。 
8. 输出最大总增益。 

**工作原理：** DP 阵列保证对于任何单元，我们都可以沿允许的方向获得最大增益。 通过预先计算所有四个方向，可以在 O(1) 中组合每个内部单元的交叉模式，而无需重复计算交汇点。 由于我们考虑了所有内部单元，因此我们确保选择最佳的交汇点。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]

dp1 = [[0]*m for _ in range(n)]
dp2 = [[0]*m for _ in range(n)]
dp3 = [[0]*m for _ in range(n)]
dp4 = [[0]*m for _ in range(n)]

# dp1: top-left to bottom-right
for i in range(n):
    for j in range(m):
        best = 0
        if i > 0:
            best = max(best, dp1[i-1][j])
        if j > 0:
            best = max(best, dp1[i][j-1])
        dp1[i][j] = a[i][j] + best

# dp2: bottom-right to top-left
for i in range(n-1, -1, -1):
    for j in range(m-1, -1, -1):
        best = 0
        if i < n-1:
            best = max(best, dp2[i+1][j])
        if j < m-1:
            best = max(best, dp2[i][j+1])
        dp2[i][j] = a[i][j] + best

# dp3: bottom-left to top-right
for i in range(n-1, -1, -1):
    for j in range(m):
        best = 0
        if i < n-1:
            best = max(best, dp3[i+1][j])
        if j > 0:
            best = max(best, dp3[i][j-1])
        dp3[i][j] = a[i][j] + best

# dp4: top-right to bottom-left
for i in range(n):
    for j in range(m-1, -1, -1):
        best = 0
        if i > 0:
            best = max(best, dp4[i-1][j])
        if j < m-1:
            best = max(best, dp4[i][j+1])
        dp4[i][j] = a[i][j] + best

ans = 0
for i in range(1, n-1):
    for j in range(1, m-1):
        total1 = dp1[i-1][j] + dp2[i+1][j] + dp3[i][j-1] + dp4[i][j+1]
        total2 = dp1[i][j-1] + dp2[i][j+1] + dp3[i+1][j] + dp4[i-1][j]
        ans = max(ans, total1, total2)

print(ans)
```前四个块计算所有四个方向的 DP 表。 内部单元格上的循环确保我们避开边界，因为交汇点必须允许所有路径继续。 这两种交叉模式处理两种可能的组合路径方式，而不会重叠卡路里。 离开
