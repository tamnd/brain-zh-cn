---
title: "CF 1304E - 1-树和查询"
description: "给定一棵具有 $n$ 个顶点的树，其中每个顶点都相互连接，使得任意两个顶点之间只有一条路径。 然后我们会被问到多个问题。"
date: "2026-06-11T17:56:42+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "shortest-paths", "trees"]
categories: ["algorithms"]
codeforces_contest: 1304
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 620 (Div. 2)"
rating: 2000
weight: 1304
solve_time_s: 74
verified: true
draft: false
---

[CF 1304E - 1-树和查询](https://codeforces.com/problemset/problem/1304/E)

 **评级：** 2000
 **标签：** 数据结构、dfs 和类似、最短路径、树
 **求解时间：** 1m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵树$n$顶点，其中每个顶点相互连接，使得任意两个顶点之间只有一条路径。 然后我们会被问到多个问题。 每个查询指定两个顶点$x$和$y$我们想象添加一个新的双向边和两个顶点$a$和$b$我们想要在它们之间找到一条路径。 该查询还提供一个整数$k$，并且我们必须确定是否存在一条从$a$到$b$正是使用$k$边缘。 该路径可以重新访问顶点或边，但必须精确地遍历$k$边缘。 

树的大小$n$可以达到$10^5$并且最多可以有$10^5$查询。 这意味着任何天真地检查路径或模拟每个查询在树上行走的算法都太慢，因为即使每个查询进行线性扫描也会导致$10^{10}$最坏情况下的操作。 长度$k$路径的最大可达$10^9$，因此显式生成路径是不可能的。 

不明显的细节是路径可以重新访问节点和边，这意味着我们可以遍历通过多次添加额外边创建的循环。 这允许比简单最短路径更长的路径，只要我们遍历循环适当的次数即可达到精确的长度$k$。 一种粗心的方法，只考虑之间的最短路径长度$a$和$b$对于以下位置的查询将会失败$k$更大，但可以通过循环添加的边来实现。 

另一个微妙的情况是当$a$和$b$是同一个节点。 如果我们遍历循环，路径长度仍然可能不为零，因此我们不能假设长度为零。 当添加额外的边时，具有 3 个节点的小树已经可以生成多条路径。 

## 方法

 暴力方法是构造树，添加查询边，然后执行 BFS 或 DFS 枚举所有路径$a$到$b$直到路径长度达到$k$。 这是正确的，因为它检查了所有可能性，但它是不可行的。 对于每个查询，即使只探索所有最短路径也是如此$O(n)$，并与$q = 10^5$，我们在$10^{10}$运营。 显式处理最长路径$10^9$是不可能的。 

关键的见解是树在任何两个顶点之间都有唯一的简单路径。 添加一条边恰好创建了一个简单的循环。 之间的任何路径$a$和$b$可以表示为原始树路径和该单循环的零次或多次遍历的组合。 这将问题简化为计算之间的最短距离$a$和$b$在树中并检查是否$k$使用循环可以实现。 具体来说，如果最短树路径是$d$，并且循环有长度$c$，那么任何可达的路径长度必须满足$k \ge d$和$(k - d) \mod 2 = 0$，因为循环边的每次遍历都会将两条边添加到一条简单路径中$a$到$b$。 

为了形式化，周期长度是距离的总和$x$到$y$穿过树加上添加的边。 然后，对于每个查询，我们检查三个候选路径长度：来自的直接路径$a$到$b$穿过树、路$a \to x \to y \to b$，以及路径$a \to y \to x \to b$。 如果$k$至少是候选长度并且具有相同的奇偶性，答案是YES。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(q * n) | O(n) | 太慢了|
 | 最佳 | O(n + q) | O(n) | 已接受 |

 ## 算法演练

 1. 将树构建为邻接表。 这允许快速遍历和距离计算。 由于树是无向的，因此存储两个方向的边。 
2. 从任意根（顶点1）执行单个DFS或BFS，以预先计算每个节点和每个节点的父节点的深度。 存储根与每个节点之间的距离。 这些距离将使我们能够使用以下公式计算恒定时间内任意两个节点之间的树距离$\text{dist}(u,v) = \text{depth}[u] + \text{depth}[v] - 2 \cdot \text{depth}[\text{lca}(u,v)]$，其中 LCA 是最低共同祖先。 
3. 实现一个函数来计算任意两个节点之间的距离。 使用 LCA 的二元提升，我们可以得到树距离$O(\log n)$每个查询。 自从$n \le 10^5$，这是有效的。 
4. 对于每个查询$(x, y, a, b, k)$，计算之间的最短树距离$a$和$b$，我们称之为$d_0$。 然后计算使用额外边的路径的距离：$d_1 = \text{dist}(a,x) + 1 + \text{dist}(y,b)$和$d_2 = \text{dist}(a,y) + 1 + \text{dist}(x,b)$。 
5. 对于每个候选距离$d$在$[d_0, d_1, d_2]$，检查是否$k \ge d$和$(k - d) \mod 2 = 0$。 如果任何候选人满足这些条件，请打印“是”。 否则，打印NO。 这确保了仅考虑比最短路径更长的路径，如果它们可以通过完整周期扩展以精确到达$k$。 

工作原理：1 树中的每条路径都可以分解为基本树路径和单循环的零次或多次完整遍历。 奇偶条件保证总边数能够准确达到$k$没有分数遍历。 考虑所有三个候选路径可确保我们考虑到通过添加边缘的两个方向。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(1 << 25)

n = int(input())
adj = [[] for _ in range(n + 1)]
for _ in range(n - 1):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)

LOG = 17
parent = [[-1] * (n + 1) for _ in range(LOG)]
depth = [0] * (n + 1)

def dfs(u, p):
    parent[0][u] = p
    for v in adj[u]:
        if v != p:
            depth[v] = depth[u] + 1
            dfs(v, u)

dfs(1, -1)

for k in range(1, LOG):
    for v in range(1, n + 1):
        if parent[k - 1][v] != -1:
            parent[k][v] = parent[k - 1][parent[k - 1][v]]

def lca(u, v):
    if depth[u] < depth[v]:
        u, v = v, u
    for k in range(LOG - 1, -1, -1):
        if parent[k][u] != -1 and depth[parent[k][u]] >= depth[v]:
            u = parent[k][u]
    if u == v:
        return u
    for k in range(LOG - 1, -1, -1):
        if parent[k][u] != -1 and parent[k][u] != parent[k][v]:
            u = parent[k][u]
            v = parent[k][v]
    return parent[0][u]

def dist(u, v):
    return depth[u] + depth[v] - 2 * depth[lca(u, v)]

q = int(input())
for _ in range(q):
    x, y, a, b, k = map(int, input().split())
    d0 = dist(a, b)
    d1 = dist(a, x) + 1 + dist(y, b)
    d2 = dist(a, y) + 1 + dist(x, b)
    ok = False
    for d in [d0, d1, d2]:
        if k >= d and (k - d) % 2 == 0:
            ok = True
            break
    print("YES" if ok else "NO")
```DFS 预先计算所有节点的深度和父数组。 二进制提升允许 LCA 查询$O(\log n)$。 距离函数可以快速计算出树的距离。 三个候选路径捕获最短路径以及沿任一方向穿过添加的边的两个选项。 奇偶校验确保我们可以使用循环扩展路径以准确到达$k$边缘。 

## 工作示例

 **示例输入 1**

 | 步骤| d0 | d1 | d2 | k | 结果 |
 | ---| ---| ---| ---| ---| ---|
 | 查询 1：1 3 1 2 2 | 1 | 2 | 4 | 2 | 是 |
 | 查询 2：1 4 1 3 2 | 3 | 2 | 4 | 2 | 是 |
 | 查询 3：1 4 | | | | | |
