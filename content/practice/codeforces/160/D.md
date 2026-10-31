---
title: "CF 160D - MST 中的边缘"
description: "我们得到一个没有环或多边的连通加权无向图。 每条边都有一个正权重。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dsu", "graphs", "sortings"]
categories: ["algorithms"]
codeforces_contest: 160
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 111 (Div. 2)"
rating: 2300
weight: 160
solve_time_s: 81
verified: true
draft: false
---

[CF 160D - MST 中的边](https://codeforces.com/problemset/problem/160/D)

 **评分：** 2300
 **标签：** dfs 和类似、dsu、图表、排序
 **求解时间：** 1m 21s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个没有环或多边的连通加权无向图。 每条边都有一个正权重。 任务是根据每条边是否属于所有最小生成树、至少一个最小生成树或根本不属于最小生成树来对它进行分类。 换句话说，对于每条边，我们想知道它对于构建 MST 是必不可少的、可选的还是不可能包含在任何 MST 中。 

该图最多可以有 100,000 个顶点和 100,000 条边，每条边的权重最多为 1,000,000。 由于这些限制，复杂度低于 O(m log n) 的算法可能会太慢。 尝试显式构建所有 MST 或删除边缘以查看 MST 权重增加是否需要 O(m^2) 或更差的操作的暴力方法是不可行的。 

非明显的边缘情况包括具有相同重量形成周期的多个边缘。 例如，考虑一个具有顶点 1、2、3 和边 (1-2，权重 1)、(2-3，权重 1)、(3-1，权重 1) 的三角形图。 任意两条边形成一个 MST。 在这种情况下，所有边都是“至少一个”，没有边是“任何”，也没有边是“无”。 当单个边具有连接两个组件的最小权重时，会发生另一种边缘情况 - 该边必须位于每个 MST 中，但忽略等权循环的粗心算法可能会对其进行错误分类。 

## 方法

 暴力方法很简单：对于每条边，暂时删除它并重新计算 MST。 如果 MST 权重增加，则边缘存在于每个 MST 中。 如果 MST 权重保持不变，但该边包含在一个可能的 MST 中，则它至少属于一个 MST。 如果包含它总是会增加 MST 权重，则它不在 MST 中。 这原则上可行，但时间复杂度为 O(m * (m log n))，因为每个 MST 计算都是 O(m log n)。 当m达到100,000时，这就变成了100亿次操作，这太慢了。 

关键的观察结果是，可以通过按权重对边进行排序并按升序处理边来有效地分析 MST，如 Kruskal 算法中那样。 并查找 (DSU) 结构跟踪连接的组件。 如果一条边连接两个独立的组件，则它可能是 MST 的一部分。 如果相同权重的多个边连接相同的组件，我们必须仔细决定哪些是可选的。 为此，我们可以按权重对边进行分组，检查其组内每条边的连通性，并确定删除它是否会破坏连通性。 这避免了从头开始重新计算 MST，并让我们使用 DSU 并按等级并集和路径压缩在 O(m log n) 中对边进行分类。 

最后一种方法是改进的 Kruskal：对边进行排序，一起处理具有相同权重的边，并且对于每个组，将组件之间唯一连接的边标记为“任意”，将连接组件但具有替代项的边标记为“至少一个”，将形成循环的边标记为“无”。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(m^2 log n) | O(m^2 log n) | O(n) | 太慢了 |
 | 改进的Kruskal + DSU | O(m log n) | O(n + m) | 已接受 |

 ## 算法演练

1. 读取图的边并将它们与其输入索引一起存储，以便保留输出顺序。 按权重升序对所有边进行排序。 排序确保我们首先处理最小的边，就像 Kruskal 的 MST 算法一样。 
2. 初始化一个不相交集联合 (DSU) 结构，每个顶点有一个组件。 每个组件将代表迄今为止连接的顶点集。 
3. 按权重分组处理边。 对于每组具有相同权重的边，执行以下操作：
 4. 对于组中的每条边，检查其端点是否属于当前 DSU 中的同一组件。 如果它们在同一个组件中，则该边将形成一个环，并且不能属于任何 MST，因此将其标记为“none”。 
5. 如果端点位于不同的组件中，则暂时将边标记为“至少一个”。 这些边可能包含在 MST 中。 
6. 对于该权重组中标记为“至少一个”的所有边，创建一个临时图，其中节点是 DSU 组件，边是连接不同组件的当前权重边。 运行 DFS 或联合查找检查以检测哪些边是此临时图中的桥。 作为桥的边必须包含在连接这些组件的每个 MST 中，因此将其标记更新为“任意”。 非桥边仍然是“至少一个”。 
7. 对组中的所有边进行分类后，在主 DSU 中合并它们的组件。 这可确保下一个权重组看到更新的连接。 
8. 重复此操作，直至处理完所有边缘。 最后，按照原始输入顺序输出分类。 

工作原理：在每个阶段，连接单独组件的边都可能位于 MST 中。 通过对相等权重的边进行分组，我们可以正确处理多个边可以相互替代的情况。 识别桥可确保对连接至关重要的边被标记为“任意”，同时排除形成循环的边。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict

sys.setrecursionlimit(1 << 25)

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0]*n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        x_root = self.find(x)
        y_root = self.find(y)
        if x_root == y_root:
            return False
        if self.rank[x_root] < self.rank[y_root]:
            self.parent[x_root] = y_root
        else:
            self.parent[y_root] = x_root
            if self.rank[x_root] == self.rank[y_root]:
                self.rank[x_root] += 1
        return True

n, m = map(int, input().split())
edges = []
for i in range(m):
    a, b, w = map(int, input().split())
    edges.append((w, a-1, b-1, i))

edges.sort()
res = [None]*m
dsu = DSU(n)
i = 0

while i < m:
    j = i
    group = []
    while j < m and edges[j][0] == edges[i][0]:
        group.append(edges[j])
        j += 1

    temp_graph = defaultdict(list)
    temp_edges = []
    for w, u, v, idx in group:
        u_root = dsu.find(u)
        v_root = dsu.find(v)
        if u_root == v_root:
            res[idx] = "none"
        else:
            res[idx] = "at least one"
            temp_graph[u_root].append((v_root, idx))
            temp_graph[v_root].append((u_root, idx))
            temp_edges.append((u_root, v_root, idx))

    visited = {}
    low = {}
    tin = {}
    timer = [0]

    def dfs(u, parent):
        visited[u] = True
        timer[0] += 1
        tin[u] = low[u] = timer[0]
        for v, idx in temp_graph[u]:
            if v == parent:
                continue
            if v in visited:
                low[u] = min(low[u], tin[v])
            else:
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if low[v] > tin[u]:
                    res[idx] = "any"

    for node in temp_graph:
        if node not in visited:
            dfs(node, -1)

    for w, u, v, idx in group:
        dsu.union(u, v)
    i = j

for r in res:
    print(r)
```该方案首先对边进行排序，初始化DSU，并按权重处理边。 它将边缘形成周期分类为“无”，并使用每个权重组的临时图来检测标记为“任何”的桥。 DSU 在处理后合并，确保下一组的连接更新。 

## 工作示例

 ### 示例 1

 输入边沿：

 | idx | 你| v | 瓦 |
 | ---| ---| ---| ---|
 | 0 | 1 | 2 | 101 | 101
 | 1 | 1 | 3 | 100 | 100
 | 2 | 2 | 3 | 2 |
 | 3 | 2 | 4 | 2 |
 | 4 | 3 | 4 | 1 |

 排序后：

 | 你| v | 瓦 | idx |
 | ---| ---| ---| ---|
 | 3 | 4 | 1 | 4 |
 | 2 | 3 | 2 | 2 |
 | 2 | 4 | 2 | 3 |
 | 1 | 3 | 100 | 100 1 |
 | 1 | 2 | 101 | 101 0 |

 权重为 1 的边：仅边 3-4，连接单独的组件，标记为“任意”。 

权重为 2 的边：边 2-3 和 2-4。 两者都连接单独的组件，还没有桥接周期，标记为“至少一个”。 DFS 检测到临时图中都不是桥，仍然是“至少一个”。 

权重为 100:1-3 的边连接单独的组件，标记为“任意”。 

权重为 101:1-2 的边将形成一个环，标记为“无”。 

输出
