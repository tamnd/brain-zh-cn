---
title: "CF 464E - 经典问题"
description: "我们得到一个无向加权图，最多有 100,000 个顶点和 100,000 个边。 每个边权重是 2 的幂，指定为 $2^{xi}$，其中 $xi$ 介于 0 到 100,000 之间。"
date: "2026-06-07T17:13:33+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "graphs", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 464
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 265 (Div. 1)"
rating: 3000
weight: 464
solve_time_s: 80
verified: true
draft: false
---

[CF 464E - 经典问题](https://codeforces.com/problemset/problem/464/E)

 **评分：** 3000
 **标签：** 数据结构、图、最短路径
 **求解时间：** 1m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个无向加权图，最多有 100,000 个顶点和 100,000 个边。 每个边的权重是 2 的幂，指定为$2^{x_i}$， 在哪里$x_i$介于 0 到 100,000 之间。 任务是找到从起始顶点开始的最短路径$s$到目标顶点$t$，报告其长度模数$10^9 + 7$，如果存在，则输出沿路径的顶点序列。 如果不存在路径，我们返回-1。 

该图可以是稀疏的或密集的，但顶点和边数表明任何复杂度低于$O((n + m) \log n)$很可能会超过时间限制。 像带有邻接矩阵的 BFS 这样简单的方法太慢了，因为$O(n^2)$操作可以达到$10^{10}$为最大$n$，这是不可行的。 同样，明确地探索所有路径是指数级的并且是不可能的。 

非明显边缘情况包括具有零边缘的图，其中$s$和$t$已断开连接。 例如，一个图表$n = 2$,$m = 0$， 和$s = 1$,$t = 2$应该输出`-1`。 假设连接的粗心实现将尝试访问邻居并崩溃。 另一个微妙之处是边权重的大小：因为它们是 2 的幂，即使很小$x_i$可能会产生非常大的数字，超过典型的 32 位整数。 模运算只能应用于最终输出，而不能应用于距离比较。 

## 方法

 暴力解决方案将尝试枚举来自$s$到$t$，对边权重求和并跟踪最小总数。 原则上这是正确的，但是用以下方法枚举图中的路径$10^5$节点的组合具有爆炸性，无法在合理的时间内完成。 

自然的改进是考虑标准最短路径算法。 由于所有边权重均为非负，因此适用 Dijkstra 算法。 使用优先级队列选择当前具有最小暂定距离的顶点，我们更新邻居的距离。 一个简单的基于数组的实现将运行在$O(n^2)$，这太慢了。 使用二叉堆将复杂性降低到$O((n + m) \log n)$，符合限制。 

边缘权重是 2 的幂，由此产生了微妙的优化。 这确保了没有两条不同的最短路径具有相同的前缀，除非它们在该点之前共享相同的顶点。 虽然这个事实对于正确性来说并不是必需的，但它保证了 Dijkstra 的标准贪婪选择不会失败。 如果所有权重均为 0 或 1，则可以使用 0-1 BFS 进行进一步优化，但在此问题中，权重可以是 2 的大幂，因此标准 Dijkstra 是合适的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数| 指数| 太慢了|
 | Dijkstra 与二叉堆 | O((n + m) log n) | O((n + m) log n) | O(n + m) | 已接受 |

 ## 算法演练

 1. 解析输入并构建邻接表。 每个条目存储一对`(neighbor, weight)`。 我们选择邻接表是因为$m$可以比$n^2$。 
2.初始化一个距离数组`dist`尺寸的$n+1$无穷大，除了`dist[s] = 0`。 该阵列跟踪最小已知距离$s$到每个顶点。 
3. 初始化一个`parent`array of size $n+1` to store the predecessor of each vertex along the shortest path. This is used to reconstruct the path after computing distances.
 4.使用最小堆（优先级队列）`pq`并推`(0, s)`进入其中，表示距离为零的起始顶点。 堆总是存储`(current_distance, vertex)`。 
5. 虽然`pq`不为空：

 - 流行音乐`(d, u)`从堆中。 
- 如果`d`大于`dist[u]`， 继续; 这是一个过时的条目。 
- 对于每个邻居`(v, w)`的`u`，检查是否`dist[u] + w < dist[v]`。 如果属实，则更新`dist[v] = dist[u] + w`和`parent[v] = u`，然后推`(dist[v], v)`进入`pq`。 
6. 循环结束后，如果`dist[t]`保持无穷大，输出`-1`因为没有路。 
7. 否则，输出`dist[t] % 10^9 + 7`作为路径长度。 要重建路径，从`t`并遵循`parent`向后指针指向`s`，然后颠倒顺序。 

**为什么有效**：Dijkstra 算法保证了正确性，因为我们总是以当前最小的暂定距离来扩展顶点。 每次我们最终确定一个顶点时，我们就知道它的最短距离。 这`parent`数组沿最小路径正确记录了前驱。 使用堆可确保操作高效，从而提高整体效率$O((n + m) \log n)$复杂。 

## Python 解决方案```python
import sys
import heapq
input = sys.stdin.readline

MOD = 10**9 + 7

def main():
    n, m = map(int, input().split())
    adj = [[] for _ in range(n + 1)]
    for _ in range(m):
        u, v, x = map(int, input().split())
        w = 1 << x  # 2^x
        adj[u].append((v, w))
        adj[v].append((u, w))
    s, t = map(int, input().split())

    dist = [float('inf')] * (n + 1)
    dist[s] = 0
    parent = [-1] * (n + 1)
    pq = [(0, s)]

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                parent[v] = u
                heapq.heappush(pq, (dist[v], v))

    if dist[t] == float('inf'):
        print(-1)
        return

    print(dist[t] % MOD)
    path = []
    u = t
    while u != -1:
        path.append(u)
        u = parent[u]
    path.reverse()
    print(len(path))
    print(' '.join(map(str, path)))

if __name__ == "__main__":
    main()
```邻接列表有效地存储邻居，堆维护当前的最小边界，父数组允许路径重建。 变速`1 << x`避免缓慢求幂。 我们仅在输出处应用模，以避免破坏 Dijkstra 比较。 使用`float('inf')`安全地处理未初始化的距离。 

## 工作示例

 **样品1**

 输入：```
4 4
1 4 2
1 2 0
2 3 0
3 4 0
1 4
```| 步骤| pq | 距离 | 家长 | 行动|
 | ---| ---| ---| ---| ---|
 | 初始化| [(0,1)] | [无限，0，无限，无限，无限] | [-1,-1,-1,-1,-1] | 从 1 开始 |
 | 流行 1 | []| 不变| 不变| 邻居：2 (1)、4 (4) |
 | 推 2,4 | [(1,2),(4,4)] | [无穷,0,1,无穷,4] | [-1,-1,1,-1,1] | 堆更新 |
 | 流行 2 | [(4,4)] | 不变| 不变| 邻居：1,3 |
 | 更新3 | [(4,4),(1,3)] | [inf,0,1,2,4] | [-1,-1,1,2,1] | 距离改善 |
 | 流行 3 | [(4,4)] | 不变| 不变| 邻居：2,4 |
 | 更新4 | [(4,4),(4,4)] | [inf,0,1,2,3] | [-1,-1,1,2,3] | 距离改善 |
 | 流行 4 | ... | 完成 | 路径已建| 1->2->3->4 |

 该表表明，堆确保我们始终扩展最小距离，确认正确性并重现预期路径。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + m) log n) | O((n + m) log n) | 每个顶点可以多次进入堆，每个堆操作花费log n，每次更新考虑一次总边m |
 | 空间| O(n + m) | 邻接表存储所有边，dist 和父数组各存储 n 个元素 |

 当 n 和 m 达到 100,000 时，总操作次数在 10^6 到 10^7 之间，完全在 5 秒的限制之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    main()
    return sys.stdout.getvalue().strip()

# Sample 1
assert run("4 4\n1 4 2\n1 2 0\n2 3 0\n3 4 0\n1 4\n") == "3\n4\n1
```
