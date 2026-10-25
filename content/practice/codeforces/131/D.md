---
title: "CF 131D - 地铁"
description: "我们有一个由 n 个车站组成的地铁系统，由 n 个通道连接，每个通道连接两个不同的车站。 该系统形成一个连通图，其中每个站都可以到达其他每个站。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "graphs"]
categories: ["algorithms"]
codeforces_contest: 131
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 95 (Div. 2)"
rating: 1600
weight: 131
solve_time_s: 74
verified: true
draft: false
---

[CF 131D - 地铁](https://codeforces.com/problemset/problem/131/D)

 **评分：** 1600
 **标签：** dfs 和类似的、图表
 **求解时间：** 1m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个由 _n_ 个车站组成的地铁系统，由 _n_ 个通道连接，每个通道连接两个不同的车站。 该系统形成一个连通图，其中每个站都可以到达其他每个站。 根据图论，具有 _n_ 个节点和 _n_ 个边的连通图恰好包含一个环。 这个循环对应于问题中的“环路”。 目标是计算从每个车站到环路的距离，即到达自行车上任何车站所需穿越的最少通道数。 作为循环一部分的站点的距离为零。 

输入由第一行之后的 _n_ 行组成，每行描述两个站之间的双向连接。 输出是 _n_ 个数字的序列，其中第 i 个数字是车站 _i_ 到环路的距离。 

约束 _n ≤ 3000_ 意味着时间复杂度高达大约 O(n²) 的解决方案将在 2 秒限制内轻松运行。 如果不必要地访问节点，则在不利用图结构的情况下重复搜索距离的简单方法仍然可能太慢。 

需要注意的边缘情况包括小型循环，其中几乎所有车站都位于环路上，以及连接到循环的线性链，其中距离需要沿着分支正确传播。 例如，形状像三角形且在一个节点上附有长尾的图要求为尾部的节点分配正确的增量距离。 

## 方法

 暴力方法首先尝试通过检查所有可能的循环来找到环路。 这涉及枚举循环并验证其唯一性，这在组合上变得昂贵，对于邻接检查来说大约为 O(n3)。 一旦知道了周期，从每个站点到周期的 BFS 就可以计算出 O(n²) 的距离。 虽然正确，但这是不必要的工作，因为图的属性允许更直接的方法。 

关键的观察结果是该图是连通的并且恰好有一个循环。 这意味着不在循环中的任何站都是以某个循环节点为根的树的一部分。 因此，问题简化为两个步骤：首先识别环路中的节点，然后沿着树枝将距离传播到环路。 

通过修改的深度优先搜索可以有效地执行循环检测。 当 DFS 期间检测到后沿时，它标志着周期的存在。 在 DFS 期间跟踪路径使我们能够准确识别哪些节点处于循环中。 一旦识别出循环，从所有循环节点开始的广度优先搜索同时向外传播距离。 每个站点将沿着最短的循环路径到达，确保正确的距离分配。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解（所有周期 + 每个节点的 BFS）| O(n3) | O(n²) | 太慢了|
 | 周期的 DFS + 距离的 BFS | O(n) | O(n) | 已接受 |

 ## 算法演练

1. 将地铁表示为邻接列表，其中每个车站都映射到其连接的车站列表。 此结构允许对邻居进行 O(1) 迭代。 
2. 运行深度优先搜索来检测唯一的循环。 在 DFS 期间跟踪每个节点的父节点。 如果遇到不是父节点的被访问节点，则发现循环。 记录当前节点和访问节点之间的DFS路径上的所有节点，以识别环路。 
3. 将所有站点的距离数组初始化为 -1，表示“未访问过”。 为循环中识别的所有站点设置距离 0。 
4. 使用队列从所有循环节点同时开始进行广度优先搜索。 对于每个出队的节点，迭代其邻居。 如果邻居的距离为-1，则将其设置为当前节点的距离加一并将其入队。 
5. 继续 BFS，直到所有节点都分配了距离。 最后，距离数组包含每个车站到环路的最小距离。 

工作原理：DFS 保证唯一循环的识别，因为图只有一个循环。 BFS 逐层向外传播从环路开始的距离，并且由于所有边的权重相等，因此第一次访问节点时会通过到达环路的最短路径。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline
sys.setrecursionlimit(10000)

n = int(input())
adj = [[] for _ in range(n)]
for _ in range(n):
    u, v = map(int, input().split())
    adj[u - 1].append(v - 1)
    adj[v - 1].append(u - 1)

visited = [False] * n
parent = [-1] * n
cycle_nodes = []

def dfs(u, p):
    visited[u] = True
    for v in adj[u]:
        if v == p:
            continue
        if visited[v]:
            # cycle detected, reconstruct path
            cycle_nodes.append(v)
            node = u
            while node != v:
                cycle_nodes.append(node)
                node = parent[node]
            return True
        parent[v] = u
        if dfs(v, u):
            return True
    return False

dfs(0, -1)

dist = [-1] * n
q = deque()
for node in cycle_nodes:
    dist[node] = 0
    q.append(node)

while q:
    u = q.popleft()
    for v in adj[u]:
        if dist[v] == -1:
            dist[v] = dist[u] + 1
            q.append(v)

print(' '.join(map(str, dist)))
```邻接表有效地代表了地铁。 当遇到后沿时，DFS 函数会跟踪父节点以重建循环。 BFS 确保所有距离正确传播，初始循环节点距离为零。 请注意避免重新访问节点并通过转换为基于 0 的索引来处理基于 1 的输入。 

## 工作示例

 ### 输入示例 1```
4
1 3
4 3
4 2
1 2
```| 节点| DFS 父级 | 循环节点| BFS 队列 | 距离阵列|
 | ---| ---| ---| ---| ---|
 | 1 | - | 1,2,3,4 | 1,2,3,4 | 0,0,0,0 | 0,0,0,0 |

 所有节点都是循环的一部分，因此BFS不会进一步扩展。 正如预期的那样，每个距离都是 0。 

### 自定义输入2```
6
1 2
2 3
3 1
3 4
4 5
5 6
```| 节点| DFS 父级 | 循环节点| BFS 队列 | 距离阵列|
 | ---| ---| ---| ---| ---|
 | 1 | - | 1,2,3 | 1,2,3 | 0,0,0,-1,-1,-1 | 0,0,0,-1,-1,-1 |
 | 4 | 3 | | 4 | 1 |
 | 5 | 4 | | 5 | 2 |
 | 6 | 5 | | 6 | 3 |

 这表明 BFS 沿着附加到循环的树传播距离。 节点 4 距离为 1 个通道，节点 5 为 2 个通道，节点 6 为 3 个通道。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个节点在 DFS 中被访问一次，在 BFS 中被访问一次。 每条边最多遍历两次。 |
 | 空间| O(n) | 邻接列表、父数组、访问数组和 BFS 队列均线性扩展。 |

 当 _n ≤ 3000_ 时，它可以在时间和内存限制内轻松运行。 

## 测试用例```python
import sys, io
def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque
    input = sys.stdin.readline
    sys.setrecursionlimit(10000)

    n = int(input())
    adj = [[] for _ in range(n)]
    for _ in range(n):
        u, v = map(int, input().split())
        adj[u - 1].append(v - 1)
        adj[v - 1].append(u - 1)

    visited = [False] * n
    parent = [-1] * n
    cycle_nodes = []

    def dfs(u, p):
        visited[u] = True
        for v in adj[u]:
            if v == p:
                continue
            if visited[v]:
                cycle_nodes.append(v)
                node = u
                while node != v:
                    cycle_nodes.append(node)
                    node = parent[node]
                return True
            parent[v] = u
            if dfs(v, u):
                return True
        return False

    dfs(0, -1)

    dist = [-1] * n
    q = deque()
    for node in cycle_nodes:
        dist[node] = 0
        q.append(node)

    while q:
        u = q.popleft()
        for v in adj[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                q.append(v)

    return ' '.join(map(str, dist))

# Provided sample
assert run("4\n1 3\n4 3\n4 2\n1 2\n") == "0 0 0 0", "sample 1"

# Custom tests
assert run("6\n1 2\n2 3\n3 1\n3 4\n4 5\n5 6\n") == "0 0 0 1 2 3", "triangle with tail"
assert run("3\n1 2\n2 3\n3 1\n") == "
```
