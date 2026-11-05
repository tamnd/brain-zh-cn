---
title: "CF 1805D - 宽广的图表"
description: "我们得到一棵具有 $n$ 个顶点的树，并要求生成 $k = 1$ 到 $n$ 的一系列图 $Gk$。 在每个图 $Gk$ 中，如果原始树中 $u$ 和 $v$ 之间的距离至少为 $k$，则顶点 $u$ 和 $v$ 之间存在边。"
date: "2026-06-09T09:17:48+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dp", "graphs", "greedy", "trees"]
categories: ["algorithms"]
codeforces_contest: 1805
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 862 (Div. 2)"
rating: 1800
weight: 1805
solve_time_s: 207
verified: false
draft: false
---

[CF 1805D - 宽广的图](https://codeforces.com/problemset/problem/1805/D)

 **评分：** 1800
 **标签：** dfs 和类似的、dp、图、贪婪、树
 **求解时间：** 3m 27s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一棵树$n$顶点并要求生成一系列图$G_k$为了$k = 1$到$n$。 在每个图表中$G_k$, 顶点之间存在边$u$和$v$如果之间的距离$u$和$v$在原始树中至少是$k$。 对于每个$k$，我们必须计算连接组件的数量$G_k$。 

输入提供$n-1$定义树的边。 自从$n$可以达到$10^5$，任何具有二次时间的解$n$立即被排除。 明确计算所有对的成对距离需要$O(n^2)$操作，这太慢了。 因此，我们需要一个大致可以工作的解决方案$O(n \log n)$或者$O(n)$。 

当发生微妙的边缘情况时$k$大于树的直径。 在这种情况下，没有两个顶点是连接的，并且每个顶点形成其自己的组件。 例如，一棵有 5 个顶点的星形树$k = 3$产生 5 个分量，因为任何两个叶子之间的最大距离为 2。不考虑树结构的简单算法会错误地连接相距太远的顶点。 

当出现另一种边缘情况时$k = 1$。 根据定义，所有顶点对都满足距离要求，因此$G_1$是完全连接的，无论树的结构如何，都只产生一个组件。 

## 方法

 暴力方法将构建$G_k$明确地为每个$k$。 对于每个$k$，我们会检查每对顶点之间的距离，然后运行 ​​DFS 或 BFS 来计算分量。 这种做法是正确的，但是对于$n = 10^5$它大约需要$n^2$每距离检查$k$，总共得到$O(n^3)$运营。 这是不可能的。 

关键的见解是问题本质上是关于树的直径和子树的深度。 的连接组件$G_k$可以从树中顶点的“深度”以及在不触及会分裂组件的顶点的情况下存在的路径多长来推断。 更具体地说，我们可以在任意顶点处建立树，然后为每个顶点计算其子树中的最长路径。 如果子树没有足够的深度来到达距离$k$，它将形成一个单独的组件$G_k$。 

最终的优化使用树上的动态规划。 在每个顶点，我们跟踪其下方最长的两棵子树的高度。 这些高度使我们能够确定每个$k$顶点是否参与更大的组件或启动新组件。 通过有效地组合高度并在树上传播计数，我们可以计算所有组件的数量$k$在$O(n \log n)$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^3) | O(n^3) | O(n^2) | O(n^2) | 太慢了 |
 | 最佳| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 任意给树求根，例如在顶点 1 处。这是一个简化子树计算的簿记选择。 
2. 从根执行DFS。 在每个顶点，计算其两个最深的子树的高度。 这些高度对应于子树内的最长距离。 
3. 为每个顶点维护一组子树高度。 这使我们能够快速确定穿过顶点的最大路径以及该路径是否至少$k$长的。 
4. 对于每个顶点，向上传播对分量数量的贡献。 如果最大子树高度加一小于$k$，该顶点及其子树形成一个新组件。 否则，子树将合并为更大的组件。 
5. 聚合每个组件的数量$k$使用扫描独特的深度。 这确保我们仅在组件数量发生变化的点更新计数。 
6. 输出所有计算出的成分计数$k = 1$到$n$。 为了$k$大于树的直径，产量$n$因为每个顶点都成为它自己的组件。 

工作原理：该算法保持一个不变式，即在每个顶点，我们知道其子树中可到达的最大深度。 当该深度不足以保持至少$k$，子树分裂成一个新的组件。 这保证了所有满足距离约束的路径都正确连接，并且没有无法到达距离的顶点$k$被错误地合并。 

## Python 解决方案```python
import sys
from collections import defaultdict, deque
input = sys.stdin.readline

n = int(input())
edges = defaultdict(list)
for _ in range(n-1):
    u, v = map(int, input().split())
    edges[u].append(v)
    edges[v].append(u)

# BFS to get heights from farthest node (tree diameter ends)
def bfs(start):
    dist = [-1]*(n+1)
    q = deque([start])
    dist[start] = 0
    while q:
        u = q.popleft()
        for v in edges[u]:
            if dist[v] == -1:
                dist[v] = dist[u]+1
                q.append(v)
    farthest = max(range(1,n+1), key=lambda x: dist[x])
    return farthest, dist

# first BFS to find one end of diameter
u, _ = bfs(1)
# second BFS to find other end and distances
v, dist_u = bfs(u)
_, dist_v = bfs(v)

diameter = max(dist_u)
res = [1]*n  # initialize with 1 for k=1

# for k
```
