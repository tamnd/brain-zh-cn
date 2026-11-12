---
title: "CF 2172M - 到端口的最大距离"
description: "我们有一个由道路连接的城市网络，每条道路的长度正好一公里。 每个城市生产一种农产品，城市1是中心港口。"
date: "2026-06-07T22:59:57+07:00"
tags: ["codeforces", "competitive-programming", "graphs", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 2172
codeforces_index: "M"
codeforces_contest_name: "2025 ICPC Asia Taichung Regional Contest (Unrated, Online Mirror, ICPC Rules, Preferably Teams)"
rating: 1300
weight: 2172
solve_time_s: 77
verified: true
draft: false
---

[CF 2172M - 到端口的最大距离](https://codeforces.com/problemset/problem/2172/M)

 **评分：** 1300
 **标签：** 图，最短路径
 **求解时间：** 1m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个由道路连接的城市网络，每条道路的长度正好一公里。 每个城市生产一种农产品，城市 1 是中心港口。 目标是针对每种产品类型找出生产该产品的城市到达港口所需的最坏距离。 换句话说，对于产品类型$i$，我们需要距所有生产城市的最短距离中的最大值$i$前往城市 1。 

输入给出城市数量$n$, 道路$m$，以及产品类型$k$，后跟长度列表$n$表示每个城市的产品。 下一个$m$线描述双向边缘。 该图保证是连通的，因此每个城市都可以到达城市 1。输出是单行$k$整数，其中$i$-第一个整数是产品的最大距离$i$。 

约束表明我们最多可以有$2 \times 10^5$城市和边缘。 单独计算从每个城市到港口的最短路径的简单方法将需要$O(n + m)$每个城市，导致$O(n(n + m))$，这太慢了。 这意味着我们需要对图进行一次遍历才能有效地计算距离。 由于所有边都具有相等的长度，因此广度优先搜索 (BFS) 是理想的选择，因为它可以在线性时间内在未加权图中生成最短路径。 

当多个城市生产相同产品时，尤其是其中一个城市为城市 1 时，就会出现微妙的边缘情况。例如，如果城市 1 生产产品 3，则该产品的最大距离应为 0，即使其他城市也生产该产品。 当一种产品类型仅由一个城市生产时，会出现另一种边缘情况； 我们的算法仍然必须正确计算其距离。 

## 方法

 暴力方法使用 BFS 或 Dijkstra 计算从每个生产产品的城市到城市 1 的最短路径。 然后我们会计算每个产品的最大距离。 这是可行的，因为 BFS 保证未加权图中的最短路径。 然而，在最坏的情况下，所有$n$城市生产相同的产品，我们会执行$n$BFS 遍历，每次遍历$O(n + m)$，导致$O(n(n + m))$，这远远超出了可接受的限度$n = 2 \times 10^5$。 

最优方法利用未加权图中最短路径的对称性。 我们不是从每个城市启动一个 BFS，而是从港口城市 1 启动一个 BFS。BFS 计算从城市 1 到所有其他城市的最短距离$O(n + m)$。 之后，我们可以简单地迭代所有城市，并针对每种产品类型，跟踪生产该产品的城市之间的最大距离。 这减少了工作$O(n(n + m))$到一个单一的$O(n + m)$BFS 加上对城市的线性扫描，非常适合时间限制。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n(n + m)) | O(n(n + m)) | O(n + m) | 太慢了 |
 | 最佳 | O(n + m) | O(n + m + k) | O(n + m + k) | 已接受 |

 ## 算法演练

 1.解析输入读取城市数量$n$, 道路$m$，以及产品类型$k$。 另请阅读每个城市生产的产品清单。 
2. 使用道路信息构建图的邻接表。 这种表示允许在 BFS 期间有效地遍历邻居。 
3.初始化一个size的距离数组$n + 1$具有哨兵值（例如，$-1$) 表示未访问过的城市。 将城市 1 的距离设置为 0。 
4. 从城市开始进行BFS 1. 使用队列逐层处理城市。 对于每个出队的城市，检查所有邻居； 如果邻居未被访问，则将其距离设置为当前城市的距离加一并将其入队。 
5. 经过 BFS 后，距离数组包含从城市 1 到其他所有城市的最短距离。 
6.初始化一个size的结果数组$k + 1$带零。 迭代所有城市； 对于城市的产品类型，将相应的结果条目更新为其当前值和城市距离的最大值。 
7. 打印产品类型的结果$1$到$k$。 

为什么它起作用：BFS保证当第一次访问一个城市时，我们找到了从起始城市到它的最短路径。 跟踪每种产品类型的最大距离可以正确识别生产该产品的最远城市。 由于所有边的权重相等，BFS 可以正确计算最短距离，确保结果准确。 

## Python 解决方案```python
import sys
from collections import deque
input = sys.stdin.readline

n, m, k = map(int, input().split())
products = list(map(int, input().split()))

# Build adjacency list
graph = [[] for _ in range(n + 1)]
for _ in range(m):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

# BFS from city 1
dist = [-1] * (n + 1)
dist[1] = 0
queue = deque([1])

while queue:
    u = queue.popleft()
    for v in graph[u]:
        if dist[v] == -1:
            dist[v] = dist[u] + 1
            queue.append(v)

# Track maximum distances per product type
res = [0] * (k + 1)
for i in range(n):
    p = products[i]
    res[p] = max(res[p], dist[i + 1])

print(" ".join(str(res[i]) for i in range(1, k + 1)))
```邻接表允许$O(1)$邻居查找。 BFS 使用队列来保证按照距港口距离递增的顺序访问城市。 最后的循环正确地将城市映射到其产品类型并更新所看到的最大距离。 这`i + 1`索引将从零开始的数组位置转换为从一开始的城市编号。 

## 工作示例

 **样品1**

 输入：```
3 3 2
2 1 1
1 2
3 1
3 2
```| 城市 | 产品 | 距离 1 | 每个产品的最大数量 |
 | --- | --- | --- | --- |
 | 1 | 2 | 0 | 2 → 最大(0,0)=0 |
 | 2 | 1 | 1 | 1 → 最大值(0,1)=1 |
 | 3 | 1 | 1 | 1 → 最大值(1,1)=1 |

 输出：```
1 0
```解释：产品 1 由城市 2 和 3 生产，距离均为 1，因此最大值为 1。产品 2 仅由城市 1、距离为 0。 

**样本 2（已构建）**

 输入：```
5 4 3
1 2 3 1 2
1 2
2 3
3 4
4 5
```| 城市 | 产品 | 距离 | 每个产品的最大数量 |
 | --- | --- | --- | --- |
 | 1 | 1 | 0 | 1 → 0 |
 | 2 | 2 | 1 | 2 → 1 |
 | 3 | 3 | 2 | 3 → 2 |
 | 4 | 1 | 3 | 1 → 3 |
 | 5 | 2 | 4 | 2 → 4 |

 输出：```
3 4 2
```此跟踪确认该算法正确计算每个产品类型的多个城市的最大距离，并处理 BFS 中的非连续城市编号。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | BFS 访问每个城市一次，并对每条边迭代一次。 城市的最终循环是 O(n)。 |
 | 空间| O(n + m + k) | O(n + m + k) | 邻接表需要 O(n + m)。 距离数组 O(n)。 结果数组 O(k)。 队列最多 O(n)。 |

 和$n, m \le 2 \times 10^5$，运行时间完全低于 1 秒，并且使用的内存少于 256 MB。 

## 测试用例```python
import sys, io
from collections import deque

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, m, k = map(int, input().split())
    products = list(map(int, input().split()))
    graph = [[] for _ in range(n + 1)]
    for _ in range(m):
        u, v = map(int, input().split())
        graph[u].append(v)
        graph[v].append(u)
    dist = [-1] * (n + 1)
    dist[1] = 0
    queue = deque([1])
    while queue:
        u = queue.popleft()
        for v in graph[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                queue.append(v)
    res = [0] * (k + 1)
    for i in range(n):
        p = products[i]
        res[p] = max(res[p], dist[i + 1])
    return " ".join(str(res[i]) for i in range(1, k + 1))

# Provided
```
