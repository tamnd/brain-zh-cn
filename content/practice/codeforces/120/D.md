---
title: "CF 120D - 三子"
description: "我们有一个矩形玉米地，表示为大小为 n × m 的网格，其中每个单元格包含一定数量的玉米。 父亲想将这块地分给三个儿子，让每个儿子都能得到预定数量的玉米：A、B 或 C 吨。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force"]
categories: ["algorithms"]
codeforces_contest: 120
codeforces_index: "D"
codeforces_contest_name: "School Regional Team Contest, Saratov, 2011"
rating: 1400
weight: 120
solve_time_s: 95
verified: true
draft: false
---

[CF 120D - 三个儿子](https://codeforces.com/problemset/problem/120/D)

 **评分：** 1400
 **标签：** 暴力破解
 **求解时间：** 1m 35s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个矩形玉米地，表示为大小为 _n_ × _m_ 的网格，其中每个单元格包含一定数量的玉米。 父亲想将这块田地分给三个儿子，让每个儿子都能收到预定数量的玉米：_A_、_B_ 或_C_ 吨。 必须使用两条平行线（水平或垂直）执行划分，这两条平行线严格位于行或列之间。 每个结果部分必须至少包含一个正方形。 

输入包括田地的尺寸、每个单元格中的玉米数量以及三个儿子的目标总和。 输出是放置两条平行线的方法数，以便三个结果部分包含任意顺序的精确数量 _A_、_B_ 和 _C_。 

鉴于 _n_ 和 _m_ 都最多为 50，如果我们有效地计算总和，则检查每对可能的线对的强力方法是可行的。 由于任何矩形中的总和都可以在常数时间内用前缀和计算出来，因此我们可以在不超过时间限制的情况下检查所有可能的分区。 当所需数量之一为零时，特别是当该字段包含零时，会出现微妙的边缘情况。 另一种边缘情况是，当所有单元格具有相等的值并且所需的数量相同时，这可能会导致多个有效分区，而假定唯一总和的简单实现可能会错过这些有效分区。 

## 方法

 一种朴素的暴力方法迭代所有水平或垂直线对。 对于水平线，我们尝试将第一条线放置在第 1 行和 _n-1_ 之间，将第二条线放置在第一行 +1 和 _n-1_ 之间。 对于垂直线，我们沿列执行相同的操作。 对于每对候选线，我们计算三个结果部分中玉米的总和，并检查它们是否与多重集 {_A_, _B_, _C_} 匹配。 这种方法之所以有效，是因为场很小，但如果我们通过迭代单元格来计算每个部分的总和，时间复杂度就会变成 O(n²·m + m²·n)，这对于最坏情况的 50×50 网格来说效率很低。 

关键的优化是使用前缀和。 通过预先计算大小为 n×m 的二维前缀和数组，我们可以在常数时间内计算任意矩形截面的和。 对于水平分区，行 r1..r2 的总和只是前缀总和差，对于具有列总和的垂直分区也是如此。 这将复杂度降低到 O(n² + m²)，这是可以接受的，因为 n² + m² ≤ 50² + 50² = 5000。有效计算总和后，我们只需要根据三个部分的总和检查 {_A_, _B_, _C_} 的所有排列。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 无前缀和的暴力破解 | O(n²·m + m²·n) | O(1) | O(1) | 太慢了 |
 | 使用前缀和进行优化 | O(n² + m²) | O(n·m) | 已接受 |

 ## 算法演练

 1. 读取尺寸_n_、_m_ 和场网格。 读取目标玉米数量_A_、_B_、_C_。 
2. 计算二维前缀和数组`ps`在哪里`ps[i][j]`表示从左上角到单元格 (i,j) 的矩形的总和。 公式为`ps[i][j] = field[i][j] + ps[i-1][j] + ps[i][j-1] - ps[i-1][j-1]`。 
3. 将计数器初始化为零以跟踪有效分区。 
4. 检查水平分区。 对于每对线`r1`和`r2`(1 ≤ r1 < r2 < n)，使用前缀和计算三个水平条带中玉米的总和：顶部行 0..r1-1，中间行 r1..r2-1，底部行 r2..n-1。 If the multiset of these sums matches {_A_, _B_, _C_}, increment the counter.
 5. 类似地检查垂直分区。 对于每对列`c1`和`c2`(1 ≤ c1 < c2 < m)，使用前缀和计算三个垂直条带中玉米的总和：左列 0..c1-1，中间列 c1..c2-1，右列 c2..m-1。 如果这些和的多重集匹配 {_A_, _B_, _C_}，则递增计数器。 
6. 打印计数器。 

工作原理：前缀和数组保证每个矩形区域的总和可以在 O(1) 内计算。 通过迭代所有有效的行对并检查 {_A_, _B_, _C_} 的所有排列的总和，我们确保所有可能的有效除法都被精确计算一次。 由于循环边界，每个分区保证至少包含一行或一列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
field = [list(map(int, input().split())) for _ in range(n)]
A, B, C = map(int, input().split())

# compute prefix sums
ps = [[0]*m for _ in range(n)]
for i in range(n):
    for j in range(m):
        ps[i][j] = field[i][j]
        if i > 0:
            ps[i][j] += ps[i-1][j]
        if j > 0:
            ps[i][j] += ps[i][j-1]
        if i > 0 and j > 0:
            ps[i][j] -= ps[i-1][j-1]

def rect_sum(r1, c1, r2, c2):
    res = ps[r2][c2]
    if r1 > 0:
        res -= ps[r1-1][c2]
    if c1 > 0:
        res -= ps[r2][c1-1]
    if r1 > 0 and c1 > 0:
        res += ps[r1-1][c1-1]
    return res

targets = sorted([A, B, C])
count = 0

# horizontal partitions
for r1 in range(1, n):
    for r2 in range(r1+1, n):
        s1 = rect_sum(0, 0, r1-1, m-1)
        s2 = rect_sum(r1, 0, r2-1, m-1)
        s3 = rect_sum(r2, 0, n-1, m-1)
        if sorted([s1, s2, s3]) == targets:
            count += 1

# vertical partitions
for c1 in range(1, m):
    for c2 in range(c1+1, m):
        s1 = rect_sum(0, 0, n-1, c1-1)
        s2 = rect_sum(0, c1, n-1, c2-1)
        s3 = rect_sum(0, c2, n-1, m-1)
        if sorted([s1, s2, s3]) == targets:
            count += 1

print(count)
```前缀和计算确保恒定时间矩形查询。 我们仔细处理边界以避免相差一的错误。 在比较之前对总和进行排序可以处理以下事实：_A_、_B_、_C_ 的顺序并不重要。 

## 工作示例

 **样品1**

 输入：```
3 3
1 1 1
1 1 1
1 1 1
3 3 3
```| r1 | r2 | s1 | s2 | s3 | 匹配？ |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 2 | 3 | 3 | 3 | 是的 |

 | c1 | c2 | s1 | s2 | s3 | 匹配？ |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 2 | 3 | 3 | 3 | 是的 |

 Count = 2，与预期输出匹配。 

**自定义输入**```
3 3
1 2 3
4 5 6
7 8 9
6 15 24
```水平分区产量总和`[1+2+3+4+5+6]=21`等等，仅`r1=1,r2=2`产生`[6, 15, 24]`排序后。 垂直分区也不会产生新的匹配。 输出 = 1。 

这些痕迹确认算法正确地考虑了所有线路布局并使用了前缀和。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n² + m²) | 两个嵌套循环用于沿行和列的行位置； 矩形求和查询的复杂度为 O(1) |
 | 空间| O(n·m) | 大小为 n×m 的二维前缀和数组 |

 给定 n,m ≤ 50，最坏情况下每个方向 2500 次操作，总共约 5000 次总和检查，完全在 1 秒内完成。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, m = map(int, input().split())
    field = [list(map(int, input().split())) for _ in range(n)]
    A, B, C = map(int, input
```
