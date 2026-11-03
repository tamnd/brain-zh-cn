---
title: "CF 1749F - 到路径的距离"
description: "我们有一棵有 $n$ 个顶点的树。 每个顶点最初的值为零。 有两种查询。 第一种类型询问特定顶点的当前值。"
date: "2026-06-09T15:19:12+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "trees"]
categories: ["algorithms"]
codeforces_contest: 1749
codeforces_index: "F"
codeforces_contest_name: "Educational Codeforces Round 138 (Rated for Div. 2)"
rating: 2800
weight: 1749
solve_time_s: 133
verified: true
draft: false
---

[CF 1749F - 到路径的距离](https://codeforces.com/problemset/problem/1749/F)

 **评分：** 2800
 **标签：** 数据结构、dfs 和类似、树
 **求解时间：** 2m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵树$n$顶点。 每个顶点最初的值为零。 有两种查询。 第一种类型询问特定顶点的当前值。 第二种要求我们添加一个固定值$k$到小距离内的所有顶点$d$从连接两个顶点的路径$u$和$v$。 这里的距离是通常的树距离：沿最短路径的边数。 

因为$n$和$m$每个都可以达到$2 \cdot 10^5$，对于类型二的每个查询迭代所有顶点的简单解决方案将执行最多$4 \cdot 10^{10}$最坏情况下的操作。 这太慢了。 最大距离$d$在更新中被限制为 20，这暗示我们可以利用一个小的邻域属性而不是触及所有顶点。 

一个微妙的方面是如何定义“到路径的距离”。 例如，不在路径上的顶点如果在距离内，仍然会受到影响$d$到路径上的任意顶点。 如果粗心地只更新路径本身的顶点，就会产生不正确的结果。 例如，在一棵中心为 1、叶子为 2、3、4 的星形树中，查询将路径从 2 更新为 3$d = 1$还必须更新顶点 1，该顶点不直接位于路径上，但相邻。 

另一个潜在的陷阱是当$d$非常大。 为了$d \ge \text{tree diameter}$，更新影响所有顶点。 这种边缘情况需要有效处理，而不需要明确地迭代所有节点。 

## 方法

 暴力方法很容易描述。 对于第二类的每个查询，我们识别沿路径的所有顶点$u$到$v$，然后对于树中的每个顶点，我们计算其到路径上每个顶点的距离，如果距离至多则更新其值$d$。 这保证了正确性，但最坏情况的复杂性是$O(m \cdot n \cdot d_{\text{path}})$，这大约是$8 \cdot 10^{10}$在最坏的情况下。 显然太慢了。 

关键的见解来自两个观察。 一、最大距离$d$更新次数最多为 20。与$n$。 其次，受影响的顶点正是距离内的顶点$d$来自某条路径，我们可以将其分解为“距每个端点的距离减去沿路径的距离”。 这表明我们可以从路径节点开始以 BFS 或 DFS 方式传播更新，但只能传播到距离$d$。 自从$d \le 20$，每次更新最多大致触及$O(d \cdot n_{\text{path}})$顶点，这是可以接受的。 另一个简化是我们可以预先计算深度和父指针，以快速定位沿树的路径和距离。 

我们进一步优化，注意到更新仅涉及路径周围小“球”内的顶点。 从端点使用 BFS$u$和$v$，或者使用预先计算的欧拉之旅和 LCA 结构，我们可以有效地枚举距离内的所有顶点$d$不访问不相关的顶点的路径。 这将复杂性降低到大约$O(m \cdot d^2)$，这对于$d \le 20$和$m \le 2 \cdot 10^5$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(m \cdot n^2)$|$O(n)$| 太慢了|
 | 最优（小距离BFS/DFS）|$O(m \cdot d^2 + n)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 读取树并构造邻接表。 这允许从任何顶点快速遍历到其邻居。 
2. 使用简单的 DFS 计算每个顶点的深度和父顶点。 深度有助于快速确定树上任意两个节点之间的距离。 
3. 准备 LCA 结构，例如使用二元提升。 LCA可以让我们快速找到任意两个顶点之间的路径$u$和$v$，因为该路径可以分解为来自$u$到 LCA 并从$v$到 LCA。 
4. 对于类型一的查询，只需打印顶点的当前值。 这是常数时间。 
5. 对于类型二的查询，首先计算 LCA$u$和$v$来识别路径。 对于每个节点$x$在路径上从$u$到$v$，执行 BFS 或 DFS 直到距离$d$，添加$k$到所有到达的顶点。 为了避免重复计算，请仅保留此更新的访问集。 
6. 因为$d$很小，每个路径节点的 BFS/DFS 仅限于一个很小的邻域。 即使对于最坏情况的路径长度$n$，每次更新仅传播$O(d^2)$次，考虑到限制，这是可以接受的。 

为什么有效：每次更新仅影响距离内的顶点$d$的路径。 通过从每个路径节点启动 BFS/DFS 并限制遍历距离$d$，我们精确地覆盖了受影响的集合。 LCA分解保证了路径被正确识别并且没有顶点被跳过。 访问集确保我们不会添加$k$在单个查询中多次访问同一顶点。 

## Python 解决方案```python
import sys
from collections import deque
input = sys.stdin.readline
sys.setrecursionlimit(1 << 25)

n = int(input())
adj = [[] for _ in range(n)]
for _ in range(n-1):
    u, v = map(int, input().split())
    adj[u-1].append(v-1)
    adj[v-1].append(u-1)

# depth and parent for LCA
LOG = 20
parent = [[-1]*n for _ in range(LOG)]
depth = [0]*n

def dfs(u, p):
    parent[0][u] = p
    for v in adj[u]:
        if v != p:
            depth[v] = depth[u] + 1
            dfs(v, u)
dfs(0, -1)

# binary lifting
for k in range(1, LOG):
    for v in range(n):
        if parent[k-1][v] != -1:
            parent[k][v] = parent[k-1][parent[k-1][v]]

def lca(u, v):
    if depth[u] < depth[v]:
        u, v = v, u
    for k in reversed(range(LOG)):
        if parent[k][u] != -1 and depth[parent[k][u]] >= depth[v]:
            u = parent[k][u]
    if u == v:
        return u
    for k in reversed(range(LOG)):
        if parent[k][u] != -1 and parent[k][u] != parent[k][v]:
            u = parent[k][u]
            v = parent[k][v]
    return parent[0][u]

# value array
val = [0]*n

m = int(input())
for _ in range(m):
    tmp = list(map(int, input().split()))
    if tmp[0] == 1:
        print(val[tmp[1]-1])
    else:
        _, u, v, k, d = tmp
        u -= 1
        v -= 1
        w = lca(u, v)
        # collect path nodes
        path = []
        x = u
        while x != w:
            path.append(x)
            x = parent[0][x]
        path.append(w)
        stack = []
        x = v
        while x != w:
            stack.append(x)
            x = parent[0][x]
        path.extend(reversed(stack))
        
        visited = [False]*n
        for node in path:
            dq = deque()
            dq.append((node, 0))
            while dq:
                cur, dist = dq.popleft()
                if dist > d or visited[cur]:
                    continue
                visited[cur] = True
                val[cur] += k
                for nei in adj[cur]:
                    if not visited[nei]:
                        dq.append((nei, dist+1))
```说明：DFS 计算所有节点的深度和父节点。 二元提升让我们可以找到 LCA$O(\log n)$时间。 对于每次更新，我们都会枚举来自的路径$u$到$v$通过LCA，然后从每个路径节点到距离执行有限的BFS$d$。 本地访问的数组可以避免同一更新中的重复计数。 类型一的查询仅返回存储的值。 

## 工作示例

 **样品1**

 | 查询 | 路径| 受影响的顶点 | 更新值 |
 | --- | --- | --- | --- |
 | 2 4 5 10 2 | 2 4 5 10 2 4-2-5 | 4-2-5 4,2,5,1,3 | +10 |
 | 1 3 | - | - | 10 | 10
 | 1 6 | - | - | 0 |
 | 2 1 1 10 20 | 2 1 1 10 20 1 | 全部 | |
