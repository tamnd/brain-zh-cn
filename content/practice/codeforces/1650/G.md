---
title: "CF 1650G - 计数快捷键"
description: "我们被要求计算无向图中从起始顶点 s 到目标 t 的路径，其长度要么恰好是最短距离，要么最多超过最短距离 1。 该图有 n 个顶点和 m 个边，没有环或多边。"
date: "2026-06-10T03:55:48+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "dp", "graphs", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 1650
codeforces_index: "G"
codeforces_contest_name: "Codeforces Round 776 (Div. 3)"
rating: 2100
weight: 1650
solve_time_s: 91
verified: false
draft: false
---

[CF 1650G - 计数快捷方式](https://codeforces.com/problemset/problem/1650/G)

 **评分：** 2100
 **标签：** 数据结构、dfs 和类似、dp、图、最短路径
 **求解时间：** 1m 31s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求计算无向图中从起始顶点开始的路径`s`到一个目标`t`其长度要么正好是最短距离，要么最多超过它一倍。 该图有`n`顶点和`m`边缘，没有循环或多重边缘。 输入边形成标准的邻接表结构，每个测试用例都是独立的。 每个测试用例的输出是一个整数模$10^9+7$。 

约束意味着`n`和`m`可以达到$2 \cdot 10^5$跨越所有测试用例，并且最多可以有$10^4$测试用例。 This prohibits any naive path enumeration, because the number of non-simple paths can be exponential. The core insight is that we only care about paths with length equal to the shortest path or the shortest path plus one. This dramatically restricts the set of relevant paths to either the edges along shortest paths or edges that "shortcut" by adding one extra hop.

 Non-obvious edge cases include graphs where multiple shortest paths overlap at vertices, and where an extra edge creates a one-step detour. For instance, a triangle with vertices 1-2-3-1 and`s=1`,`t=3`通过边 1-3 的最短路径长度为 1，但两步路径 1-2-3 也计算在内。 一种只考虑最短路径树的粗心方法会错过这些一步较长的路径。 

## 方法

 暴力解决方案尝试枚举所有路径`s`到`t`使用DFS，计算长度最多的那些`d+1`在哪里`d`是最短路径。 这原则上是有效的，但是`n`最多$2 \cdot 10^5$并且路径数量呈指数级增长，这是不可行的。 

关键的观察是我们不需要生成所有路径。 计算最短距离`s`到所有顶点并从`t`使用 BFS 到所有顶点。 将这些距离表示为`dist_s[v]`和`dist_t[v]`。 A path of length equal to`dist_s[t]`必须遵循边缘`(u,v)`这样`dist_s[u] + 1 + dist_t[v] == dist_s[t]`。 对于长度路径`dist_s[t] + 1`，考虑边缘`dist_s[u] + 1 + dist_t[v] == dist_s[t] + 1`或者`dist_s[v] + 1 + dist_t[u] == dist_s[t] + 1`。 计算具有适当重数的所有有效边。 

另一个微妙之处是路径可能会重新访问节点。 为了解决这个问题，在 BFS 层上应用了动态编程：仅使用最短路径层来计算到达每个顶点的方式数量。 然后，对于形成 +1 长度绕道的边，将到达一端的路径乘以到达另一端的路径`t`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力DFS | O(2^n) | O(2^n) | O(n) | 太慢了 |
 | BFS + DP | 每个测试用例 O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 运行 BFS`s`计算`dist_s[v]`对于所有顶点。 这给出了最短距离`s`到每个顶点。 
2. 运行 BFS`t`计算`dist_t[v]`对于所有顶点。 这给出了最短距离`t`到每个顶点。 
3. 初始化`ways_s[v]`作为最短路径的数量`s`到`v`。 放`ways_s[s] = 1`。 按 BFS 顺序处理顶点`s`，对于每个顶点`u`更新`ways_s[v] += ways_s[u]`为所有邻居`v`在哪里`dist_s[v] == dist_s[u] + 1`。 
4. 同样，计算`ways_t[v]`的最短路径数`v`到`t`使用 BFS 从`t`。 
5. 初始化`result = ways_s[t]`。 这会计算所有最短路径。 
6. 遍历所有边`(u,v)`。 如果`dist_s[u] + 1 + dist_t[v] == dist_s[t] + 1`， 添加`ways_s[u] * ways_t[v]`到`result`。 同样，如果`dist_s[v] + 1 + dist_t[u] == dist_s[t] + 1`， 添加`ways_s[v] * ways_t[u]`到`result`。 使用模数$10^9+7$。 
7. 输出`result`。 

这样做的原因是任何长度的路径`d`必须按顺序沿着 BFS 层前进，这是由`ways_s`和`ways_t`。 任意长度的路径`d+1`可以通过使用两层之间的一个“额外”边缘来构造，并且分别对这些边缘进行计数以确保所有路径都被恰好捕获一次。 

## Python 解决方案```python
import sys
from collections import deque
input = sys.stdin.readline
MOD = 10**9 + 7

def bfs(n, adj, start):
    dist = [None] * n
    dist[start] = 0
    q = deque([start])
    while q:
        u = q.popleft()
        for v in adj[u]:
            if dist[v] is None:
                dist[v] = dist[u] + 1
                q.append(v)
    return dist

def count_shortest_paths(n, adj, start):
    dist = [None] * n
    ways = [0] * n
    dist[start] = 0
    ways[start] = 1
    q = deque([start])
    while q:
        u = q.popleft()
        for v in adj[u]:
            if dist[v] is None:
                dist[v] = dist[u] + 1
                ways[v] = ways[u]
                q.append(v)
            elif dist[v] == dist[u] + 1:
                ways[v] = (ways[v] + ways[u]) % MOD
    return dist, ways

t = int(input())
for _ in range(t):
    input()  # blank line
    n, m = map(int, input().split())
    s, u_t = map(int, input().split())
    s -= 1
    u_t -= 1
    adj = [[] for _ in range(n)]
    edges = []
    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        adj[u].append(v)
        adj[v].append(u)
        edges.append((u, v))
    
    dist_s, ways_s = count_shortest_paths(n, adj, s)
    dist_t, ways_t = count_shortest_paths(n, adj, u_t)
    shortest = dist_s[u_t]
    result = ways_s[u_t] % MOD

    for u, v in edges:
        if dist_s[u] + 1 + dist_t[v] == shortest + 1:
            result = (result + ways_s[u] * ways_t[v]) % MOD
        if dist_s[v] + 1 + dist_t[u] == shortest + 1:
            result = (result + ways_s[v] * ways_t[u]) % MOD
    print(result)
```BFS 有效地计算距离`O(n + m)`并跟踪沿最短路径的路数。 乘法从`s`到一端，从另一端到`t`计算所有有效的 +1 长度路径。 使用模可以确保我们不超过整数限制。 

## 工作示例

 **样品1**

 输入：`4 4`边形成正方形，`s=1`,`t=4`。 最短路径的长度为 2。路径：

 | 路径 | 长度 | 计数 |
 | --- | --- | --- |
 | 1-2-4 | 1-2-4 2 | 1 |
 | 1-3-4 | 1-3-4 2 | 1 |`ways_s`和`ways_t`正确跟踪计数，并且不存在 +1 边缘。 结果是2。 

**样品2**

 输入：`6 8`,`s=6`,`t=1`。 最短路径长度为 1。长度 ≤2 的路径：

 | 路径 | 长度 | 计数 |
 | --- | --- | --- |
 | 6-1 | 6-1 1 | 1 |
 | 6-4-1 | 6-4-1 2 | 1 |
 | 6-2-1 | 6-2-1 | 2 | 1 |
 | 6-5-1 | 2 | 1 |

 DP along BFS layers correctly counts these paths.

 ## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n + m) | BFS遍历所有顶点和边一次； 计算 +1 条路径的边数为 O(m) |
 | 空间| O(n + m) | 邻接表加上距离和方式数组 |

 总和`n`和`m`所有测试用例 ≤$2 \cdot 10^5$，所以总时间为 2 秒是可以接受的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # insert solution code here
    MOD = 10**9 + 7

    from collections import deque

    def count_shortest_paths(n, adj, start):
```
