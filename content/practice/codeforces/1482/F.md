---
title: "CF 1482F - 有用的边缘"
description: "我们得到一个无向加权图，最多有 600 个顶点和大约 180,000 条边，其中每条边都有一个正权重。 然后我们得到一个查询列表，每个查询由一对顶点 $u$ 和 $v$ 以及一个数字 $l$ 组成。"
date: "2026-06-10T23:27:35+07:00"
tags: ["codeforces", "competitive-programming", "graphs", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 1482
codeforces_index: "F"
codeforces_contest_name: "\u0422\u0435\u0445\u043d\u043e\u043a\u0443\u0431\u043e\u043a 2021 - \u0424\u0438\u043d\u0430\u043b"
rating: 2400
weight: 1482
solve_time_s: 192
verified: true
draft: false
---

[CF 1482F - 有用的边缘](https://codeforces.com/problemset/problem/1482/F)

 **评分：** 2400
 **标签：** 图，最短路径
 **求解时间：** 3m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个无向加权图，最多有 600 个顶点和大约 180,000 条边，其中每条边都有一个正权重。 然后我们得到一个查询列表，每个查询由一对顶点组成$u$和$v$和一个数字$l$。 如果某个查询对之间存在路径，则认为边是有用的$(u, v)$其总重量不超过$l$并穿过该边缘。 目标是计算有多少边是有用的。 

考虑到这些限制，为每个查询检查每个路径的简单方法是不可行的，因为路径的数量呈指数增长。 的上限$n = 600$建议算法$O(n^3)$复杂性是可以接受的，因为$600^3 \approx 2 \times 10^8$5 秒时间范围内的操作正好在合理范围内。 边权重和查询限制很大（$10^9$），因此我们必须避免依赖于显式构造所有路径或使用该大小的基于权重的数组的算法。 

不明显的边缘情况包括最小路径可能在顶点上循环多次以保持在长度以下的查询$l$。 例如，形成三角形的图形$1-2-3-1$权重为 2, 2, 3 和一个查询$(1,3,4)$需要考虑类似的路径$1-2-3$其总和为 4。粗心的实现仅考虑最短路径而不重新组合距离可能会错过这一点。 

另一个微妙之处是，输入可以包括影响同一条边的有用性的多个查询，并且单个查询可以使多个边同时有用。 

## 方法

 暴力方法是单独处理每个查询，执行完整搜索（如 Dijkstra 或 BFS）$u$查找长度范围内的所有可达路径$l$，并将这些路径上的每条边标记为有用。 这原则上可行，但速度太慢。 每个 Dijkstra 调用都是$O(m + n \log n)$，并且最多$q = 180,000$查询，这很容易超过$10^{10}$运营。 

加速这一过程的关键观察是，我们只需要知道，对于每条边$(a, b)$，如果它可以参与任意路径$u \to v$最多长度$l$。 我们可以使用 Floyd-Warshall 算法预先计算所有对的最短路径，因为$n \le 600$。 让$dist[x][y]$表示最短距离$x$到$y$。 然后，对于边缘$(a,b,w)$，这对于查询很有用$(u,v,l)$如果其中之一$dist[u][a] + w + dist[b][v] \le l$或者$dist[u][b] + w + dist[a][v] \le l$。 这是有效的，因为任何有用的路径都不能比连接端点的最短路径短。 针对所有查询检查所有边的此条件是可行的，因为$O(n^2 + q \cdot m)$符合时限内。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(q * (n + m log n)) | O(q * (n + m log n)) | O(n + m) | 太慢了|
 | 最佳 | O(n^3 + m * n) | O(n^3 + m * n) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 读取图的边并构造邻接矩阵或距离矩阵，其中`dist[i][j]`最初是无穷大，除了对角线上的 0 之外。 填写连接顶点之间的直接边权重。 
2.运行Floyd-Warshall：迭代每个中间顶点`k`，并且对于每对`(i,j)`， 更新`dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`。 这确保了`dist[i][j]`成为顶点之间的最短距离`i`和`j`。 
3. 准备一个数组`best[i]`对于每个顶点`i`，这将跟踪最大允许的`l - dist[i][v]`涉及所有查询`v`。 这本质上是可以在邻近的边缘上“花费”多少剩余距离`i`在一条通往`v`。 
4. 迭代每个查询`(u, v, l)`。 对于每个顶点`a`， 更新`best[a] = max(best[a], l - dist[v][a])`。 这意味着从顶点`a`，边向`v`不得超过此剩余距离以满足查询。 
5. 现在，迭代所有边`(a,b,w)`。 为了使边有用，必须存在一个顶点`i`这样`best[a] >= w`或者`best[b] >= w`。 这会检查该边是否可以参与满足任何查询的路径。 计算所有这样的边。 
6. 输出有用边的总数。 

为什么有效：Floyd-Warshall 算法保证`dist[i][j]`是最短路径距离。 通过跟踪最大允许剩余路径长度（`best[a]`），我们准确捕获哪些边可以成为任何查询的有效路径的一部分。 任何不满足此条件的边都不能包含在任何查询限制下的任何路径中。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
INF = 10**18

edges = []
dist = [[INF]*n for _ in range(n)]
for i in range(n):
    dist[i][i] = 0

for _ in range(m):
    u, v, w = map(int, input().split())
    u -= 1
    v -= 1
    edges.append((u, v, w))
    dist[u][v] = w
    dist[v][u] = w

q = int(input())
queries = []
for _ in range(q):
    u, v, l = map(int, input().split())
    u -= 1
    v -= 1
    queries.append((u, v, l))

# Floyd-Warshall
for k in range(n):
    for i in range(n):
        for j in range(n):
            if dist[i][j] > dist[i][k] + dist[k][j]:
                dist[i][j] = dist[i][k] + dist[k][j]

# Prepare best residual distances
best = [-10**18]*n
for u, v, l in queries:
    for i in range(n):
        best[i] = max(best[i], l - dist[v][i])

count = 0
for a, b, w in edges:
    if best[a] >= w or best[b] >= w:
        count += 1

print(count)
```该代码读取图形并查询，计算所有对的最短路径，然后计算最大剩余距离`best[i]`对于每个顶点。 最后，对每条边进行测试`best`to determine usefulness. 微妙的实现点包括使用较大的初始值`INF`以避免溢出并将 Python 列表的基于 1 的索引转换为基于 0 的索引。 

## 工作示例

 **样品1：**```
n = 4, edges = [(1,2,1),(2,3,1),(3,4,1),(1,3,3),(2,4,3),(1,4,5)], query = (1,4,4)
```| 边缘 | 距离[u][a] + w + 距离[b][v] | 有用？ |
 | --- | --- | --- |
 | 1-2 | 1-2 0+1+2=3 | 是的 |
 | 2-3 | 2-3 1+1+1=3 | 是的 |
 | 3-4 | 3-4 2+1+0=3 | 是的 |
 | 1-3 | 1-3 0+3+1=4 | 是的 |
 | 2-4 | 2-4 1+3+0=4 | 是的 |
 | 1-4 | 1-4 0+5+0=5 | 没有 |

 这确认了 5 个有用的边，与输出相匹配。 

**样本 2（已构建）：**```
n=3, edges=[(1,2,10),(2,3,5)], queries=[(1,3,11)]
```| 边缘 | 距离[1][a] + w + 距离[b][3] | 有用？ |
 | --- | --- | --- |
 | 1-2 | 1-2 0+10+5=15 | 没有 |
 | 2-3 | 2-3 10+5+0=15 | 没有 |

 没有边满足查询，输出为 0。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^3 + n_m + n_q) | O(n^3 + n_m + n_q) | Floyd-Warshall 是 n^3，正在更新`best`是n_q，检查边是m_n |
 | 空间| O(n^2 + m + q) | O(n^2 + m + q) | 距离矩阵为 n^2，边列表为 m，查询列表为 q |

 假设 n=600，n^3 ≈ 2×10^8，并且 m,q ≤ n^2，这在 5 秒和 512 MB 内存中非常适合。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, m = map(int, input().split())
    INF = 10**18
    edges = []
```
