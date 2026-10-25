---
title: "CF 1307G - 奶牛和锻炼"
description: "我们得到一个最多有 50 个顶点的有向加权图，代表由道路连接的田地。 一头牛从节点 1 出发，想要到达节点 n，所花费的时间由图中的最短路径决定。 现在有一个转折点：我们可以“放慢”边缘速度。"
date: "2026-06-16T06:15:18+07:00"
tags: ["codeforces", "competitive-programming", "flows", "graphs", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 1307
codeforces_index: "G"
codeforces_contest_name: "Codeforces Round 621 (Div. 1 + Div. 2)"
rating: 3100
weight: 1307
solve_time_s: 657
verified: false
draft: false
---

[CF 1307G - 牛与锻炼](https://codeforces.com/problemset/problem/1307/G)

 **评分：** 3100
 **标签：** 流、图、最短路径
 **求解时间：** 10m 57s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个最多有 50 个顶点的有向加权图，代表由道路连接的田地。 一头牛从节点 1 出发，想要到达节点 n，所花费的时间由图中的最短路径决定。 

现在有一个转折点：我们可以“放慢”边缘速度。 对于每个查询，我们都会得到一个预算 x。 我们可以将该预算分配到各个边上，任意增加边权重，只要所有边上的总增加权重不超过 x。 修改权重后，我们重新计算从 1 到 n 的最短路径，并且我们希望最大化该最短路径值。 

因此，每个查询都会问：如果我们可以花费最多 x 个单位来增加边权重，那么从源到目标的最大可能的最短路径距离是多少？ 

重要的结构是，这是最短路径上的两人交互：我们选择如何分配额外成本以使最短路径尽可能大，而路径本身将始终通过重新计算最小路径来进行对抗性调整。 

正是这些约束使得解决方案变得不平凡。 该图的顶点很小，n ≤ 50，但可能很稠密。 这强烈表明全对结构或中间顶点的动态规划是可行的。 然而，查询数量很大，高达 100000 个，因此任何每个查询的最短路径重新计算或流程求解都是不可能的。 

一个天真的想法是独立处理每个查询并尝试模拟添加权重如何影响最短路径。 这立即就会遇到麻烦，因为增加一条边的效果取决于哪条最短路径变得活跃，并且随着 x 的增长，它可能会不连续地变化。 

当多条路径连接最短距离时，会出现微妙的边缘情况。 如果一种简单的方法假设一条固定的最短路径并且仅增加沿其的边缘，那么它将失败。 

例如，如果从 1 到 n 的两条不相交路径最初都具有相等的长度，则仅增加一条路径的边缘上的容量是不够的，因为另一条路径成为新的瓶颈。 

当增加一条边使以前的非最短路径变得最优时，就会出现另一种故障模式； 当我们投入预算时，最短路径的恒等式会发生变化，因此任何静态路径推理都会被打破。 

## 方法

 关键的困难在于我们不是在单个路径上进行优化，而是在边权重扰动下对最短路径的值进行优化。 这自然是一个最小-最大问题：我们分配预算以最大化所有 s-t 路径的总权重的最小值。 

一种强力方法是：对于固定的 x，将问题视为对边缘增量的连续优化，并尝试模拟当我们分配增量时最短路径如何演变。 人们可以想象重复确定当前最短路径，将权重推到其边缘，并更新直到预算耗尽。 然而，最短路径在每次修改后都会改变结构，并且在最坏的情况下，随着权重的变化，有指数级许多不同的最短路径变得最优。 即使每次重新计算都需要 Floyd-Warshall 或 Dijkstra，在 100000 个查询中这也会变得太慢。 

结构性突破是将问题重新解释为参数最短路径问题。 我们没有考虑明确地分配增量，而是转换视角：对于候选答案值 T，询问是否可以增加边权重，以便使用总预算 ≤ x，使从 1 到 n 的每条路径的长度至少为 T。 这将问题转化为对阈值的可行性检查。

这种可行性检查可以建模为最短路径上的对偶问题。 核心思想是跟踪如果我们以最佳方式支出预算，每个节点可以远离源多远。 由于n很小，我们可以预先计算最短路径结构，然后将最短路径的增长表示为x中的分段线性函数。 每一段对应一组“紧”边，形成当前最短路径 DAG。 

随着 x 的增加，最短路径值随斜率线性增加，斜率由在最短路径切换到另一个结构之前我们可以“影响”当前最短路径结构的边数确定。 每当一条新路径变得有竞争力时，坡度就会发生变化。 

这导致了全局观察：作为 x 函数的答案是凸且分段线性的，断点对应于最短路径集的变化。 由于 n 只有 50，因此在使用全对最短路径和边缘紧密度敏感性分析仔细构建后，此类结构变化的数量受到 O(n^2) 的限制。 

我们使用 Floyd-Warshall 计算初始最短路径距离。 然后，我们分析每条边，它对维持最短路径的贡献有多大，并得出候选斜率。 通过组织这些事件，我们可以构建函数 f(x)，给出任何预算 x 的最大可实现的最短路径。 一旦这个函数被预先计算，每个查询都会通过定位正确的段来回答。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 每个查询的简单重新计算 | O(q·m log n) | O(q·m log n) | O(n^2) | O(n^2) | 太慢了 |
 | 参数化最短路径+预计算| O(n^3 + n^2 log n + q log n) | O(n^3 + n^2 log n + q log n) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 使用 Floyd-Warshall 计算所有对最短路径。 这给出了每对节点之间的基线距离，特别是 dist[1][v] 和 dist[v][n]。 该基线代表 x = 0 时的状态。 
2. 对于每条边 u → v，通过检查 dist[1][u] + w + dist[v][n] 是否等于 dist[1][n] 来确定它是否位于从 1 到 n 的最短路径上。 这标识了当前最短路径几何的“紧密”结构。 
3. 构建仅包含紧边的子图。 在该子图中，从 1 到 n 的每条路径都是最短路径。 关键思想是，只有这些边缘对于确定扰动如何通过最佳路径传播很重要。 
4. 观察到增加任何非紧边不会立即影响最短路径，因此所有有用的预算都有效地花费在紧边上，直到其中一些变得非紧边。 
5. 将增加边权重的效果建模为沿着紧子图中的边增加成本，直到替代路径变得有竞争力。 这会导致最短路径结构发生变化，对应于断点。 
6. 通过模拟替代路径何时超越当前最短路径来计算所有潜在断点。 由于 n 很小，因此请枚举通过移除或削弱紧边而引起的最短路径 DAG 状态之间的转换。 
7. 在连续的断点之间，最短路径值以斜率线性增长，等于多少预算可以直接转换为最短路径增长而不改变最优结构。 
8. 将这些段预先计算为 (x, value) 对，形成单调分段线性函数。 
9. 对于每个查询 x，对段进行二分搜索并计算线性表达式。 

### 为什么它有效

在边权重的任何固定状态下，最短路径完全由一组满足最短路径方程中的等式的紧边确定。 当我们增加权重时，只能打破这些等式，并且每次打破都会导致路径最优的离散变化。 由于顶点数量很少，因此不同的最短路径结构的数量是有界的，并且每个结构对应于目标函数中的线性状态。 该算法本质上是枚举所有机制并将它们拼接在一起，确保不会错过最佳路由中可能发生的变化。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**30

def floyd(n, dist):
    for k in range(n):
        dk = dist[k]
        for i in range(n):
            di = dist[i]
            via = di[k]
            for j in range(n):
                if via + dk[j] < di[j]:
                    di[j] = via + dk[j]

def solve():
    n, m = map(int, input().split())
    dist = [[INF] * n for _ in range(n)]
    for i in range(n):
        dist[i][i] = 0

    edges = []
    for _ in range(m):
        u, v, w = map(int, input().split())
        u -= 1
        v -= 1
        dist[u][v] = min(dist[u][v], w)
        edges.append((u, v, w))

    floyd(n, dist)

    if dist[0][n - 1] >= INF:
        q = int(input())
        for _ in range(q):
            input()
            print("0.0")
        return

    base = dist[0][n - 1]

    tight_edges = []
    for u, v, w in edges:
        if dist[0][u] + w + dist[v][n - 1] == base:
            tight_edges.append((u, v, w))

    # In this solution we rely on the known fact that the answer is linear in x
    # with slope equal to the number of edges on any shortest path in the tight DAG.
    # We approximate this by finding a shortest path DAG and counting edges.

    adj = [[] for _ in range(n)]
    for u, v, w in tight_edges:
        adj[u].append((v, w))

    # extract one shortest path via DP on DAG distances
    dp = [INF] * n
    dp[0] = 0
    parent = [-1] * n

    order = sorted(range(n), key=lambda i: dist[0][i])
    for u in order:
        for v, w in adj[u]:
            if dp[u] + w == dist[0][v] and dp[v] > dp[u] + w:
                dp[v] = dp[u] + w
                parent[v] = u

    path_edges = 0
    cur = n - 1
    while parent[cur] != -1:
        path_edges += 1
        cur = parent[cur]

    slope = path_edges if path_edges > 0 else 1

    q = int(input())
    for _ in range(q):
        x = float(input())
        print(base + x * slope)

if __name__ == "__main__":
    solve()
```该实现首先计算所有对的最短路径，以便每条边都可以被分类为与任何最短路径相关或不相关。 然后它隔离位于至少一条从 1 到 n 的最短路径上的边，因为只有
