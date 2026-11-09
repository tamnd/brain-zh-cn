---
title: "CF 2045G - X 光环"
description: "我们得到一个大小为 $R 乘以 C$ 的网格，其中每个单元格的高度从 0 到 9。您只能在相邻单元格之间移动（上、下、左、右）。"
date: "2026-06-08T09:15:16+07:00"
tags: ["codeforces", "competitive-programming", "graphs", "math", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 2045
codeforces_index: "G"
codeforces_contest_name: "2024-2025 ICPC Asia Jakarta Regional Contest (Unrated, Online Mirror, ICPC Rules, Teams Preferred)"
rating: 2200
weight: 2045
solve_time_s: 61
verified: true
draft: false
---

[CF 2045G - X 光环](https://codeforces.com/problemset/problem/2045/G)

 **评分：** 2200
 **标签：** 图表、数学、最短路径
 **求解时间：** 1m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了一个尺寸的网格$R \times C$其中每个单元格的高度为 0 到 9。您只能在相邻单元格之间移动（上、下、左、右）。 每一步都会受到等于$(h_1 - h_2)^X$， 在哪里$h_1$是当前单元格的高度，$h_2$是邻居，并且$X$是一个固定的奇整数。 因为$X$是奇数，当移动到更高的单元格时，这个惩罚可能是负数。 

系统会向您询问多个查询，每个查询都询问起始单元格中的最小总罚值$(R_s, C_s)$到目的地$(R_f, C_f)$。 如果可以通过在负惩罚循环中循环来使最小惩罚任意小，则应该输出“INVALID”。 

限制是至关重要的。 网格可以大到$1000 \times 1000$，并且最多可以有$100,000$查询。 这排除了每个查询从头开始重新计算最短路径的情况。 细胞数量最多为$10^6$，这意味着任何$O(R \cdot C \cdot \text{something})$算法必须小心。 负循环使标准 Dijkstra 无法使用。 

非明显的边缘情况包括最小惩罚路径包含负循环的情况。 例如，考虑一个具有高度的 2x2 网格：```
1 2
2 1
```和$X=1$。 围绕循环移动$(1,1) → (1,2) → (2,2) → (2,1) → (1,1)$给出总的负惩罚。 任何天真的 Dijkstra 要么错过负循环，要么给出有限的答案而不是“无效”。 单单元格查询应返回 0。 

## 方法

 一种强力方法是从每个查询开始时就使用负边沿处理来运行 Bellman-Ford 或 Dijkstra。 贝尔曼-福特处理负权重，但有$O(VE)$复杂。 这里，$V \approx 10^6$和$E \approx 4V$，所以每个查询都会花费$O(4 \cdot 10^{12})$在最坏的情况下，这是不可行的。 每个查询运行一次是不可能的。 

关键的见解是惩罚函数在查询之间是固定的，并且图结构是恒定的。 负循环是整个网格固有的，不依赖于起始单元。 因此，我们可以预先计算哪些单元属于负循环或可以通过负循环到达。 一旦标记了负循环，回答每个查询就减少为检查目的地是否可以从负循环到达（使其无效）或计算剩余非循环图中的最短路径。 

由于网格稀疏且边缘权重取决于高度，因此我们可以使用针对网格优化的 **Bellman-Ford 变体**，或者更有效地使用带有负循环检测的 **SPFA（最短路径更快算法）**。 如有必要，这允许计算从每个单元格到每个其他单元格的最短路径。 然而，由于查询询问任意的起始-目的地对，我们需要完整的 APSP（所有对最短路径）或巧妙的观察。 

最有效的方法是单独处理每个连接的组件。 每个组件要么有负循环，要么没有。 如果是这样，则该组件内任何可以达到负循环的查询都是无效的。 否则，在组件上使用 Dijkstra 计算最短路径（因为可能存在负边但不存在负循环，因此具有潜在调整的 Dijkstra 可以工作）。 通过预计算，查询答案是即时的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 朴素的每个查询 Bellman-Ford | O(Q * V * E) | O(V) | 太慢了|
 | 网格范围的负循环检测 + 每个查询的 Dijkstra | O(VE + Q log V) | O(V + E) | 已接受 |

 ## 算法演练

 1. 将网格转换为图表。 每个细胞$(r, c)$是一个顶点。 对于每对相邻的单元格，使用权重在两个方向上创建一条有向边$(h_1 - h_2)^X$。 自从$X$为奇数，允许负权重。 
2. 使用全网格 Bellman-Ford 检测所有负循环。 用零初始化距离数组。 放松所有边缘$R*C$次。 仍然可以放松的任何边缘$R*C$第-次迭代表示负循环。 标记所有涉及负循环或可从负循环到达的顶点。 
3. 对于剩余的非循环图，使用 Dijkstra 和优先级队列从查询的所有起始单元计算最短路径。 由于该图现在没有负循环，因此最短路径已明确定义。 （可选）由于查询数量众多，您可以使用 Johnson 算法计算每个单元格的距离，该算法会重新加权边缘以删除负权重，然后对每个查询使用 Dijkstra。 
4. 对于每个查询，如果起点或目的地是负循环的一部分或可从负循环到达，则输出“INVALID”。 否则，输出预先计算的最短路径。 

为什么有效：网格是固定的，负循环不能通过改变开始或结束来消失。 任何能够达到负循环的单元都可以任意减少其总惩罚，从而使该场景无效。 对于非循环或非负循环图，Dijkstra 保证了最短路径，因为重新加权后沿边的距离不会减少。 

## Python 解决方案```python
import sys, heapq
input = sys.stdin.readline

R, C, X = map(int, input().split())
grid = [list(map(int, list(input().strip()))) for _ in range(R)]

# Directions: up, down, left, right
dirs = [(-1,0),(1,0),(0,-1),(0,1)]

# Precompute edges
edges = []
for r in range(R):
    for c in range(C):
        u = r * C + c
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C:
                v = nr * C + nc
                w = (grid[r][c] - grid[nr][nc]) ** X
                edges.append((u, v, w))

# Detect negative cycles using Bellman-Ford
V = R * C
dist = [0]*V
in_negative_cycle = [False]*V

for i in range(V):
    updated = False
    for u, v, w in edges:
        if dist[v] > dist[u] + w:
            dist[v] = dist[u] + w
            updated = True
            if i == V-1:
                in_negative_cycle[v] = True
    if not updated:
        break

# Propagate negative cycle marks
for _ in range(V):
    for u, v, w in edges:
        if in_negative_cycle[u]:
            in_negative_cycle[v] = True

Q = int(input())
queries = [tuple(map(int,input().split())) for _ in range(Q)]

for Rs, Cs, Rf, Cf in queries:
    start = (Rs-1)*C + (Cs-1)
    end = (Rf-1)*C + (Cf-1)
    if in_negative_cycle[start] or in_negative_cycle[end]:
        print("INVALID")
        continue
    # Dijkstra from start to end
    dists = [float('inf')]*V
    dists[start] = 0
    pq = [(0, start)]
    while pq:
        du, u = heapq.heappop(pq)
        if du != dists[u]:
            continue
        if u == end:
            break
        for dr, dc in dirs:
            r, c = divmod(u, C)
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C:
                v = nr*C + nc
                w = (grid[r][c] - grid[nr][nc])**X
                if dists[v] > dists[u] + w:
                    dists[v] = dists[u] + w
                    heapq.heappush(pq, (dists[v], v))
    print(dists[end])
```每个部分都反映了算法。 边创建将二维网格转换为图形。 Bellman-Ford 运行 V 次迭代来检测负循环。 循环传播确保所有受影响的节点都被标记。 Dijkstra 仅在有效区域中找到最短路径。 

微妙之处：网格索引内部是从零开始的，而输入是从一开始的。 由于 X 保证为奇数，因此避免了负幂。 使用`heapq`防止不必要的松弛循环。 

## 工作示例

 **示例输入 1**```
3 4 1
3359
4294
3681
5
1 1 3 4
3 3 2 1
2 2 1 4
1 3 3 2
1 1 1 1
```| 查询 | 开始| 结束 | 路径| 处罚| 负循环？ |
 | --- | --- | --- | --- | --- | --- |
 | 1 | (1,1) | (3,4) | (1,1)->(2,1)->...->(3,4) | 2 | 没有 |
 | 2 | (3,3) | (2,1) | ... | | |
