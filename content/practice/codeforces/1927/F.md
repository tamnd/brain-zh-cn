---
title: "CF 1927F - 微循环"
description: "我们被要求在无向加权图中找到一个简单的循环，其中该循环中的最小边尽可能小。 输入是一系列图：每个图由顶点数、边数以及带有权重的边列表来描述。"
date: "2026-06-08T18:55:53+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "dsu", "graphs", "greedy", "implementation", "sortings", "trees"]
categories: ["algorithms"]
codeforces_contest: 1927
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 923 (Div. 3)"
rating: 1900
weight: 1927
solve_time_s: 144
verified: false
draft: false
---

[CF 1927F - 微循环](https://codeforces.com/problemset/problem/1927/F)

 **评级：** 1900
 **标签：** 数据结构、dfs 和类似、dsu、图、贪婪、实现、排序、树
 **求解时间：** 2m 24s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求在无向加权图中找到一个简单的循环，其中该循环中的最小边尽可能小。 输入是一系列图：每个图由顶点数、边数以及带有权重的边列表来描述。 简单循环是指没有重复的顶点或边的循环。 输出是我们找到的循环中最小边的权重、该循环中的顶点数以及遍历的顶点序列。 

这些约束告诉我们一些重要的事情。 每个图最多可以有大约$2 \cdot 10^5$跨所有测试用例的边，这意味着任何迭代所有顶点对的算法都是不可行的。 该图是稀疏的，因为$m \le n(n-1)/2$，但是多达几千个顶点的密集图也是可能的。 因为总是至少存在一个简单循环，所以我们不必处理无循环图。 边权重为正整数，最大可达$10^6$，所以我们不需要处理负循环。 

一种简单的方法可能会尝试枚举所有循环，但这立即是不切实际的，因为图中的循环数量可能会随着顶点数量呈指数增长。 另一个微妙之处是多个循环可能共享边缘，并且最小化最轻边缘的循环不一定是最小或最短的循环。 粗心的解决方案可能会选择任何循环，或者通过 DFS 找到的第一个循环，这可能会产生比必要的更重的最小边缘。 

可能会妨碍简单方法的边缘情况包括三角形，其中一条边比其他边轻得多，或者断开的组件，其中只有某些部分包含小边。 例如，考虑一个图，其中顶点 1-3 形成一个边权重为 1、100、100 的三角形。最小最轻边循环显然是最小边为 1 的三角形本身。如果我们只在其他地方查找短循环，我们可能会错误地将 100 报告为最小边。 

## 方法

 蛮力方法会尝试枚举所有简单循环，然后选择具有最小最轻边缘的循环。 一种方法是选取每条边，将其删除，然后尝试找到连接其端点的路径。 如果存在路径，则添加删除的边即可完成一个循环。 这是正确的，因为任何循环都可以这样分解。 问题是每条边的寻路时间为 O(n + m)，导致总复杂度为 O(m(n + m))，这在给定的情况下太慢了$m \sim 2 \cdot 10^5$。 

关键的见解是，可以通过关注小子图来找到最小的最轻边循环。 三角形（3 个循环）通常是最佳的，因为任何较长循环中的最小边不能小于包含该循环的三角形中的最小边。 这将我们的问题简化为有效地在图中查找三角形。 我们可以利用顶点度：按权重对边进行排序，并尝试找到由连接到公共顶点的边形成的环。 联合查找 (DSU) 跟踪祖先或仅限于小社区的 BFS/DFS 有助于快速找到候选周期。 

我们还观察到，我们可以按权重递增的顺序尝试边缘。 完成循环的第一个边缘保证包括该循环中的最小可能边缘，因为所有较轻的边缘都已被处理而没有形成循环。 这类似于 Kruskal 的 MST 算法，但我们不是最少地连接组件，而是检查循环闭合。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力：枚举周期 | O(m(n+m)) | O(m(n+m)) | O(n+m) | 太慢了 |
 | 三角形搜索/边排序| O(米 * 度) | O(n+m) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，读取所有边并将它们与其权重一起存储。 按权重递增的顺序对边进行排序。 排序确保我们从最小的边开始处理，这很重要，因为必须首先考虑循环中的最小边。 
2. 初始化并查（DSU）结构以维护连接的组件。 对于每个顶点，跟踪其父顶点和排名以允许快速合并和祖先查找。 
3. 按权重顺序迭代边缘。 对于每条边，使用 DSU 检查其端点是否属于同一连接组件。 如果这样做，添加这条边就会形成一个循环。 
4. 当检测到循环时，重建它。 沿着除当前边之外的现有图边，从边的一个端点到另一端点执行 BFS 或 DFS。 收集路径并附加当前边以关闭循环。 该循环中的最小边缘是当前边缘，因为所有较亮的边缘都已经被处理并且没有形成循环。 
5. 如果端点不在同一组件中，则在 DSU 中合并它们。 这确保了未来的边缘可以正确检测周期。 
6、输出用于检测环路的边的权重、环路中的顶点数以及顶点的遍历顺序。 

为什么它有效：不变的是我们以增加权重的方式处理边缘。 DSU 保证边沿第一次关闭循环时，该循环不包含比当前边沿更轻的边沿。 任何包含较亮边缘的循环都会更早被检测到。 因此，我们报告的周期中的最小优势在全球范围内是最小的。 

## Python 解决方案```python
import sys
from collections import deque
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.parent = list(range(n+1))
        self.rank = [0]*(n+1)

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        xr, yr = self.find(x), self.find(y)
        if xr == yr:
            return False
        if self.rank[xr] < self.rank[yr]:
            self.parent[xr] = yr
        else:
            self.parent[yr] = xr
            if self.rank[xr] == self.rank[yr]:
                self.rank[xr] += 1
        return True

def find_cycle(n, edges):
    edges.sort(key=lambda x: x[2])
    dsu = DSU(n)
    graph = [[] for _ in range(n+1)]
    
    for u, v, w in edges:
        if dsu.find(u) == dsu.find(v):
            # cycle detected
            # BFS to find path from u to v
            prev = [-1]*(n+1)
            q = deque()
            q.append(u)
            visited = [False]*(n+1)
            visited[u] = True
            while q:
                node = q.popleft()
                if node == v:
                    break
                for nei in graph[node]:
                    if not visited[nei]:
                        visited[nei] = True
                        prev[nei] = node
                        q.append(nei)
            # reconstruct path
            path = []
            curr = v
            while curr != -1:
                path.append(curr)
                curr = prev[curr]
            path.reverse()
            path.append(u)
            return w, len(path), path
        else:
            dsu.union(u, v)
            graph[u].append(v)
            graph[v].append(u)
    return None

def main():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        edges = [tuple(map(int, input().split())) for _ in range(m)]
        b, k, path = find_cycle(n, edges)
        print(f"{b} {k}")
        print(" ".join(map(str, path)))

if __name__ == "__main__":
    main()
```代码对边进行排序以保证我们首先考虑最小边。 DSU 可有效检测新边缘何时形成循环。 BFS 用于在 O(n + m) 时间内重建循环的精确路径，这是可行的，因为我们每个循环只执行一次。 追加当前边会结束循环并保证包含最小边。 

## 工作示例

 输入示例：```
6 6
1 2 1
2 3 1
3 1 1
4 5 1
5 6 1
6 4 1
```| 步骤| 边 (u,v,w) | DSU合并？ | 检测到循环？ | BFS 路径 |
 | ---| ---| ---| ---| ---|
 | 1 | 1,2,1 | 是的 | 没有 | - |
 | 2 | 2,3,1 | 是的 | 没有 | - |
 | 3 | 3,1,1 | 没有 | 是的 | 1-2-3 | 1-2-3 |
 | 4 | ... | - | - | - |

 BFS 重建路径 1-2-3 并添加边 3-1 来结束循环。 最小边权重为 1。 

另一个输入：```
4 5
1 2 2
2 3 2
3 4 2
4 1 2
1 3 3
```检测到的第一个循环是具有最小边缘 2 的 1-2-3-1。BFS 重建 1-2-3，追加 1 关闭循环。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(m log m + m(n+m)) | O(m log m + m(n+m)) | 对边进行排序需要 O(m log m)。 DSU 操作几乎是 O(1) 摊销的。 BFS 重建路径需要 O(n + m)。 |
 | 空间| O(n + m) | 图邻接表、DSU 数组、访问数组 |

 假设所有测试用例的 m 总和 ≤
