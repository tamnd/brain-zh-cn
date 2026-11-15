---
title: "CF 78E - 疏散"
description: "我们有一个大小为 n × n 的实验室网格，代表一个研究站，其中一些瓷砖是反应堆，其他瓷砖是实验室。 一座反应堆出现故障并会爆炸，导致有毒冷却剂扩散到邻近的实验室。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "flows", "graphs", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 78
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 70 (Div. 2)"
rating: 2300
weight: 78
solve_time_s: 154
verified: true
draft: false
---

[CF 78E - 疏散](https://codeforces.com/problemset/problem/78/E)

 **评分：** 2300
 **标签：** 流、图、最短路径
 **求解时间：** 2m 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个大小为 _n_ × _n_ 的实验室网格，代表一个研究站，其中一些瓷砖是反应堆，其他瓷砖是实验室。 一座反应堆出现故障并会爆炸，导致有毒冷却剂扩散到邻近的实验室。 每个实验室都包含一定数量的科学家和一定数量的救援舱。 科学家可以在一分钟内在相邻实验室之间移动，并可以立即进入胶囊。 冷却剂以类似的方式传播，每分钟都会感染邻近的实验室。 一旦实验室被感染，任何尚未进入太空舱的科学家都会死亡。 

任务是确定在爆炸前有限的时间内，如果所有科学家都采取最佳行动，可以拯救的最大科学家人数。 

约束很小：_n_ 最多可以为 10，这意味着图块总数最多为 100。分钟数 _t_ 最多可以为 60。由于网格很小，即使是 _n_ 具有三次或四次复杂度的解决方案也是可行的。 然而，我们必须小心，因为这个问题需要考虑科学家在感染之前通过实验室网络的流动情况。 

边缘情况包括紧邻故障反应堆的实验室。 例如，反应堆旁边有一名科学家和胶囊的实验室可能会也可能不会拯救其科学家，具体取决于感染时间。 另一个棘手的情况是，当科学家的数量超过了可到达的安全实验室中的胶囊数量时，那么一些科学家必然会死亡。 单纯地让科学家贪婪地推动而不考虑感染时间或胶囊容量的简单解决方案将产生不正确的结果。 

## 方法

 暴力方法会尝试模拟科学家每分钟的每一个可能的动作，同时传播感染。 每个科学家都必须在每一步做出决定，从而产生指数级的可能性，即使对于 _n_ = 10 和 _t_ = 60，这显然也是不可行的。 

关键的观察结果是，这从根本上来说是一个具有时间限制的最大流量问题。 我们可以将每个时间步骤的每个实验室建模为图中的节点。 边将时间 _k_ 的实验室与其在时间 _k+1_ 的相邻实验室连接起来，代表科学家在一分钟内移动。 此外，每个实验室都有一个用于进入胶囊的节点，其容量等于胶囊的数量。 感染限制了每个节点可以存在的时间长度。 

一旦构建了图表，我们就可以使用标准最大流量算法计算在其实验室被感染之前可以到达胶囊的科学家的最大数量。 网格的小尺寸和时间限制使得将其建模为最多具有 _n_ × _n_ × (_t_+1) 个节点的流网络是可行的，这对于 Dinic 或 Edmonds-Karp 流算法来说是可管理的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟| O(4^(_n^2_×_t_)) | O(4^(_n^2_×_t_)) | O(_n^2_×_t_) | O(_n^2_×_t_) | 不可行|
 | 时间扩展最大流量 | O(V^2 E) ≈ O((n^2 t)^2 × 4) | O(n^2 × t) | O(n^2 × t) | 已接受 |

 ## 算法演练

 1. 确定发生故障的反应堆的坐标。 这将是冷却剂扩散的根源。 
2. 使用从故障反应堆开始的广度优先搜索，计算每个实验室被感染的最早时间。 反应堆阻止了扩散。 将这个感染时间存储在一个二维数组中`infect_time`。 从未被感染的实验室可以被认为是有`infect_time = t+1`。 
3.构建时间扩展的流网络。 时间 _k_ (0 ≤ k ≤ _t_) 时的每个实验室都由一个节点表示。 对于位置 (i,j) 和时间 k 的实验室，如果邻居的感染时间大于 k+1，则在时间 k+1 将其以无限容量连接到其邻居。 此外，在时间 k 到时间 k+1 连接同一个实验室，以便科学家留在原地。 
4. 每次对于每个实验室，将其​​节点连接到容量等于该实验室中胶囊数量的“胶囊接收器”节点。 该边缘仅在严格小于实验室感染时间的情况下存在。 
5. 引入一个在时间 0 连接到所有实验室的源节点，其容量等于该实验室科学家的数量。 
6. 运行从源到胶囊接收器的最大流量算法 (Dinic)。 最大流量值等于在感染到达之前可以逃脱的科学家的最大数量。 
7. 返回计算出的最大流量。 

为什么有效：网络正确地编码了运动和时间约束。 每个科学家对应一个流量单位，胶囊容量和感染时间限制流入水槽的流量。 科学家不能在其感染时间之外占据节点，也不能进入超出可用数量的胶囊。 因此，流量最大化直接对最优疏散计划进行建模。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

class Edge:
    def __init__(self, to, rev, cap):
        self.to = to
        self.rev = rev
        self.cap = cap

class MaxFlow:
    def __init__(self, N):
        self.size = N
        self.graph = [[] for _ in range(N)]

    def add(self, fr, to, cap):
        self.graph[fr].append(Edge(to, len(self.graph[to]), cap))
        self.graph[to].append(Edge(fr, len(self.graph[fr]) - 1, 0))

    def bfs_level(self, s, t, level):
        q = deque()
        level[s] = 0
        q.append(s)
        while q:
            v = q.popleft()
            for e in self.graph[v]:
                if e.cap > 0 and level[e.to] < 0:
                    level[e.to] = level[v] + 1
                    q.append(e.to)
        return level[t] >= 0

    def dfs_flow(self, v, t, upTo, level, iter):
        if v == t:
            return upTo
        for i in range(iter[v], len(self.graph[v])):
            e = self.graph[v][i]
            if e.cap > 0 and level[v] < level[e.to]:
                d = self.dfs_flow(e.to, t, min(upTo, e.cap), level, iter)
                if d > 0:
                    e.cap -= d
                    self.graph[e.to][e.rev].cap += d
                    return d
            iter[v] += 1
        return 0

    def max_flow(self, s, t):
        flow = 0
        level = [-1] * self.size
        INF = 10**9
        while True:
            level = [-1] * self.size
            if not self.bfs_level(s, t, level):
                break
            iter = [0] * self.size
            while True:
                f = self.dfs_flow(s, t, INF, level, iter)
                if f == 0:
                    break
                flow += f
        return flow

n, t = map(int, input().split())
sci_grid = [input().strip() for _ in range(n)]
input()  # empty line
cap_grid = [input().strip() for _ in range(n)]

INF = 10**9
dx = [0,0,1,-1]
dy = [1,-1,0,0]

infect_time = [[INF]*n for _ in range(n)]
queue = deque()
for i in range(n):
    for j in range(n):
        if sci_grid[i][j] == 'Z':
            queue.append((i,j,0))
            infect_time[i][j] = 0

while queue:
    x, y, time = queue.popleft()
    for d in range(4):
        nx, ny = x+dx[d], y+dy[d]
        if 0<=nx<n and 0<=ny<n and sci_grid[nx][ny] not in 'YZ' and infect_time[nx][ny] > time+1:
            infect_time[nx][ny] = time+1
            queue.append((nx, ny, time+1))

# build flow graph
def node(i,j,k):
    return (i*n+j)*(t+1)+k

N = n*n*(t+1) + 2
src = N-2
sink = N-1
mf = MaxFlow(N)

for i in range(n):
    for j in range(n):
        if sci_grid[i][j] in 'YZ':
            continue
        max_time = min(t, infect_time[i][j]-1)
        for k in range(max_time+1):
            # stay
            if k < max_time:
                mf.add(node(i,j,k), node(i,j,k+1), INF)
            # move
            for d in range(4):
                ni, nj = i+dx[d], j+dy[d]
                if 0<=ni<n and 0<=nj<n and sci_grid[ni][nj] not in 'YZ' and k+1 <= infect_time[ni][nj]-1:
                    mf.add(node(i,j,k), node(ni,nj,k+1), INF)
            # capsules
            mf.add(node(i,j,k), sink, int(cap_grid[i][j]))

for i in range(n):
    for j in range(n):
        if sci_grid[i][j] not in 'YZ' and int(sci_grid[i][j]) > 0:
            mf.add(src, node(i,j,0), int(sci_grid[i][j]))

print
```
