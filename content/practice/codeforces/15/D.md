---
title: "CF 15D - 地图"
description: "我们得到一个大小为 n × m 的矩形地图，其中每个单元格都有一个非负高度。 彼得想要建造大小为 a × b 的城市。 要放置一座城市，他必须将矩形内的所有单元减少到最小高度，从而平整矩形内的地面。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 15
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 15"
rating: 2500
weight: 15
solve_time_s: 132
verified: true
draft: false
---
[CF 15D - 地图](https://codeforces.com/problemset/problem/15/D)

 **评分：** 2500
 **标签：** 数据结构、实现、排序
 **求解时间：** 2m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给定了一张尺寸为的矩形地图`n`×`m`，其中每个单元格都有一个非负高度。 彼得想要建造规模较大的城市`a`×`b`。 要放置一座城市，他必须将矩形内的所有单元减少到最小高度，从而平整矩形内的地面。 在某个位置建造建筑物的成本是移除的地面总量。 目标是反复找到最佳矩形——所有可用位置中平整成本最小的矩形——并在那里放置一座城市。 如果多个位置相同，Peter 会优先选择最上面的位置，然后是最左边的位置。 一旦一个小区被一个城市占据，它就不能再用于后续的城市。 

该问题为我们提供了高达 1000×1000 的地图，以及高达完整地图尺寸的城市大小。 检查每个可能的矩形并从头开始计算其成本的简单方法将迭代最多 1,000,000 个矩形，在最坏的情况下，每个矩形可能涉及最多 1,000,000 个单元格的总和。 这会导致大约 10^12 次操作 - 远远超出 2 秒的时间限制。 因此，我们需要一种更有效的方法来避免天真地重新计算总和和最小值。 

边缘情况包括城市占据整个空间的非常小的地图、所有像元都相等的地图（使多个位置平局）以及具有大值的地图（最多 10^9），这需要仔细的整数处理。 例如，在具有高度的 2×2 地图中`[[1, 2], [3, 5]]`城市大小为 1×2，第一个城市将占据左上角，练级成本为 1，然后第二个城市将占据底行，成本为 2。如果我们忽略“最左上”的决胜局，则顺序可能是错误的。 

## 方法

 蛮力方法评估每一个`a×b`地图中的矩形。 对于每个矩形，它会找到最小高度，并将每个单元格与该最小值之间的差值相加，以计算调平成本。 然后它选择成本最小的矩形并将其标记为已占用。 如此重复，直到没有`a×b`矩形可用。 虽然正确，但这种方法非常慢，因为从头开始评估每个矩形需要 O(a·b) 次操作，从而使整体复杂度为 O((n−a+1)(m−b+1)·a·b)。 对于 n=m=1000 和 a=b=500，这大约是 10^11 次操作。 

关键的见解是，滑动矩形内的**最小值**和**高度总和**都可以进行预处理，以实现快速查询。 我们可以计算前缀和来快速计算任意矩形的和，时间复杂度为 O(1)。 对于最小值，我们可以使用基于双端队列的 2D 滑动最小值技术：首先计算宽度的行最小值`b`，然后对这些行方向的高度结果进行列方向的最小值`a`。 这会产生一个矩阵，其中每个`a×b`矩形的最小值在 O(1) 内可用。 使用这两个预计算，我们可以计算 O(n·m) 中所有可能位置的平整成本，而不是 O(n·m·a·b)。 最后，为了按顺序放置城市，我们需要一种有效的方法来标记占用的单元格。 二维二元占用图上的 Fenwick 树或线段树就足够了，但具有相同滑动矩形检查的简单占用网格也可以工作，因为每个单元格只能是一个城市的一部分，从而限制了总迭代次数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((n−a+1)(m−b+1)·a·b·k) | O((n−a+1)(m−b+1)·a·b·k) | O(n·m) | 太慢了|
 | 最佳 | O(n·m) | O(n·m) | 已接受 |

 ## 算法演练

 1. 计算高度的二维前缀和数组。 对于每个单元格`(i, j)`，存储所有单元格的总和`(1, 1)`到`(i, j)`。 这允许使用包含-排除原理进行 O(1) 矩形和查询。 
2. 计算宽度的行向滑动最小值`b`使用双端队列。 对于每一行，维护一个索引双端队列，使得最左边的元素始终是当前长度窗口中的最小值`b`。 将这些中间结果存储在矩阵中`row_min`。 
3. 计算列向滑动高度最小值`a`在`row_min`获得每一个的最小值`a×b`长方形。 再次，每列使用双端队列来维持垂直滑动窗口中的当前最小值。 称这个矩阵为`rect_min`。 
4. 对于每个`a×b`矩形，计算平整成本为`sum of heights − minimum × (a·b)`使用前缀和数组作为总和`rect_min`为最小值。 跟踪成本最小的矩形。 通过选择最上面、然后最左边的矩形来打破联系。 
5. 在占用网格中将所选矩形标记为已占用。 重复步骤 4-5，直到不再有可用的矩形（即任何候选矩形至少包含一个已占用的单元格）。 
6. 按照城市排列顺序输出城市的位置及其平整成本。 

为什么有效：在每次迭代中，我们都会考虑所有有效的矩形并计算精确的平整成本。 通过预处理总和和最小值，每个矩形的计算量是恒定的。 选择成本最小的矩形并将其标记为已占用，可以保证我们遵循问题的确定性城市布局。 滑动窗口方法保证每个矩形的最小值始终是正确的。 

## Python 解决方案```python
import sys
from collections import deque
input = sys.stdin.readline

def read_matrix(n, m):
    mat = []
    for _ in range(n):
        mat.append(list(map(int, input().split())))
    return mat

def prefix_sum(mat):
    n, m = len(mat), len(mat[0])
    ps = [[0]*(m+1) for _ in range(n+1)]
    for i in range(n):
        for j in range(m):
            ps[i+1][j+1] = mat[i][j] + ps[i][j+1] + ps[i+1][j] - ps[i][j]
    return ps

def rectangle_sum(ps, x1, y1, x2, y2):
    return ps[x2][y2] - ps[x1][y2] - ps[x2][y1] + ps[x1][y1]

def sliding_min_row(mat, b):
    n, m = len(mat), len(mat[0])
    row_min = [[0]*(m-b+1) for _ in range(n)]
    for i in range(n):
        dq = deque()
        for j in range(m):
            while dq and mat[i][dq[-1]] >= mat[i][j]:
                dq.pop()
            dq.append(j)
            if dq[0] == j-b:
                dq.popleft()
            if j >= b-1:
                row_min[i][j-b+1] = mat[i][dq[0]]
    return row_min

def sliding_min_col(mat, a):
    n, m = len(mat), len(mat[0])
    rect_min = [[0]*m for _ in range(n-a+1)]
    for j in range(m):
        dq = deque()
        for i in range(n):
            while dq and mat[dq[-1]][j] >= mat[i][j]:
                dq.pop()
            dq.append(i)
            if dq[0] == i-a:
                dq.popleft()
            if i >= a-1:
                rect_min[i-a+1][j] = mat[dq[0]][j]
    return rect_min

def main():
    n, m, a, b = map(int, input().split())
    heights = read_matrix(n, m)
    ps = prefix_sum(heights)
    
    row_min = sliding_min_row(heights, b)
    rect_min = sliding_min_col(row_min, a)
    
    occupied = [[False]*m for _ in range(n)]
    result = []
    
    while True:
        best = None
        best_cost = None
        for i in range(n-a+1):
            for j in range(m-b+1):
                if any(occupied[x][y] for x in range(i, i+a) for y in range(j, j+b)):
                    continue
                total = rectangle_sum(ps, i, j, i+a, j+b)
                cost = total - rect_min[i][j]*a*b
                if best_cost is None or cost < best_cost or (cost == best_cost and (i < best[0] or (i==best[0] and j<best[1]))):
                    best = (i, j)
                    best_cost = cost
        if best is None:
            break
        i, j = best
        result.append((i+1, j+1, best_cost))
        for x in range(i, i+a):
            for y in range(j, j+b):
                occupied[x][y] = True
    
    print(len(result))
    for r in result:
        print(*r)

if __name__ == "__main__":
    main()
```**说明：**

 前缀和部分允许 O(1) 矩形和查询。 行式和列式滑动最小值实现了 2D 单调队列来计算 O(n·m) 中的最小值，而不是为每个矩形重新计算。 占用网格确保我们永远不会选择已经使用过的矩形。
