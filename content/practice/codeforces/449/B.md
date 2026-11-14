---
title: "CF 449B - Jzzhu 和城市"
description: "我们得到一个代表城市和道路的无向加权图。 城市 1 是首都。 除了普通道路外，还有专门的火车路线将首都直接连接到一些城市。 政府希望关闭尽可能多的火车路线。"
date: "2026-05-30T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "graphs", "greedy", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 449
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 257 (Div. 1)"
rating: 2000
weight: 449
solve_time_s: 86
verified: true
draft: false
---

[CF 449B - Jzzhu 和城市](https://codeforces.com/problemset/problem/449/B)

 **评级：** 2000
 **标签：** 图、贪婪、最短路径
 **求解时间：** 1m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个代表城市和道路的无向加权图。 城市 1 是首都。 除了普通道路外，还有专门的火车路线将首都直接连接到一些城市。 

政府希望关闭尽可能多的火车路线。 限制是，移除这些列车后，每个城市到首都的最短距离必须与之前完全相同。 

任务不是在移除火车后找到最短路径。 相反，我们必须确定有多少火车路线是不必要的，同时保留距首都的所有最短距离。 

该图最多包含$10^5$城市,$3 \cdot 10^5$道路，以及$10^5$火车路线。 这些限制立即排除了任何重复重新计算最短路径的方法。 即使运行 Dijkstra 几千次也已经太昂贵了。 我们需要一些接近的东西$O((n+m+k)\log n)$。 

问题中最微妙的部分是多条火车路线可能会前往同一个城市。 即使该城市需要火车，其中一些也可能是多余的。 

考虑：```
1 --(10)-- 2

Train: 1 -> 2 length 5
Train: 1 -> 2 length 7
```到城市2的最短距离是5。长度为7的火车显然可以去掉。 

另一个棘手的情况是，当火车达到最短距离时，但也存在基于道路的等长最短路径。```
1 --(2)-- 3 --(3)-- 2

Train: 1 -> 2 length 5
```到城市 2 的最短距离是 5。移除火车不会改变任何东西，因为道路路径的长度也是 5。让每辆火车都参与某个最短路径的解决方案是不正确的。 

第三种微妙的情况是，城市的最短距离只能通过火车来实现。```
1 --(100)-- 2

Train: 1 -> 2 length 5
```这里火车是必不可少的。 删除它会将最短距离从 5 更改为 100。 

挑战在于准确确定哪些列车是不可或缺的。 

## 方法

 暴力方法将独立检查每条火车路线。 对于每列火车，暂时将其删除，重新计算距首都的最短路径，并检查是否有任何城市的距离发生变化。 

这是正确的，因为它直接测试语句中的条件。 不幸的是，它的速度慢得令人绝望。 可以有$10^5$火车，每次 Dijkstra 执行的成本大约是$O((n+m)\log n)$。 最坏的情况将达到约$10^5 \times 4 \cdot 10^5 \log 10^5$操作，远远超出极限。 

关键的观察是火车路线可以被视为图中的边。 从城市1到城市的火车$s$与长度$y$只是另一个边缘$(1,s,y)$。 

如果我们在包含公路和火车的图表上运行 Dijkstra，我们将获得到每个城市的真实最短距离。 

之后，问题就变成了：实际上需要哪些列车边缘来保持这些最短距离？ 

假设有一个城市$v$有最短距离$dist[v]$。 任意边缘$(u,v,w)$满意的$$dist[u] + w = dist[v]$$可以是最短路径树的一部分。 

如果城市$v$至少有一个传入的最短路径道路边缘，然后一列火车在$v$不是必需的。 我们可以达到$v$通过道路，同时保持相同的最短距离。 

如果没有道路边缘可以产生$dist[v]$，那么必须至少保留一列火车才能实现最短距离。 

这将问题转化为计算最短路径结构实际需要多少条火车路线。 

### 方法比较

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(k(n+m)\log n)$|$O(n+m)$| 太慢了 |
 | 最佳|$O((n+m+k)\log n)$|$O(n+m+k)$| 已接受 |

 ## 算法演练

 ### 步骤 1

 使用所有道路边缘构建图表。 

单独存放每列火车。 对于 Dijkstra，还将每列火车添加为城市 1 与其目的地城市之间的边。 

此时，道路和火车被统一视为图边。 

### 步骤 2

 从完整图表上的城市 1 运行 Dijkstra。 

得到的数组`dist`包含所有火车可用时从首都到每个城市的最短距离。 

这些距离正是关闭路线后必须保持不变的值。 

### 步骤 3

 对于每个城市，确定是否存在可以作为最短路径的最后一条边的道路边。 

对于每条道路$(u,v,w)$：

如果$$dist[u] + w = dist[v]$$然后城市$v$可以通过道路最佳到达。 

同样，如果$$dist[v] + w = dist[u]$$然后城市$u$可以通过道路最佳到达。 

维护一个数组`roadParentPossible`。`roadParentPossible[x] = True`意味着城市`x`至少有一条由普通道路连接的最短路径前驱。 

### 步骤 4

 处理所有火车路线。 

对于终点站为 city 的火车`s`与长度`y`，只有当$$y = dist[s]$$因为火车是直接从首都出发的，距离为零。 

任何火车$$y > dist[s]$$永远不能属于最短路径并且可以立即移除。 

### 步骤 5

 满意的列车中`y == dist[s]`，决定哪些是必要的。 

如果`roadParentPossible[s]`是真的，那么城市`s`已经有最短路径的前身。 每辆达到相同距离的列车都是多余的，可以删除。 

如果`roadParentPossible[s]`是假的，那么必须保留一些最短路径的火车前往城市`s`。 

同一城市可能存在多趟最短的列车。 在这种情况下，只保留一个并删除所有其他。 

使用每个城市的计数器来跟踪有多少趟最短有效的火车到达那里。 

### 步骤 6

 数一下可移动的火车。 

如果满足以下条件，火车可拆卸：

 1. 比最短距离长。 
2.到达已经有最短路径前身的城市。 
3. 对于需要火车的城市，它是多趟最短有效火车之间的额外重复。 

### 为什么它有效

 迪杰斯特拉之后，`dist[v]`是每个城市的最短距离。 任何保留的解决方案仍然必须实现这些距离。 

一个拥有最短路径道路前身的城市可以完全通过道路获得其最佳距离，因此不需要火车结束于此。 

没有这样的前身的城市必须直接从火车获得最短的距离。 保留一列最短有效的火车就足够了，因为所有火车都从首都出发并产生相同的距离值。 前往同一城市的额外火车没有任何贡献。 

因此，每一列被移除的列车都被证明是不必要的，并且每一列保留的列车都需要保留至少一个最短距离。 因此，移除的列车数量是最大的。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

def solve():
    n, m, k = map(int, input().split())

    graph = [[] for _ in range(n + 1)]
    roads = []

    for _ in range(m):
        u, v, w = map(int, input().split())
        roads.append((u, v, w))
        graph[u].append((v, w))
        graph[v].append((u, w))

    trains = []

    for _ in range(k):
        s, y = map(int, input().split())
        trains.append((s, y))
        graph[1].append((s, y))
        graph[s].append((1, y))

    INF = 10**30
    dist = [INF] * (n + 1)
    dist[1] = 0

    pq = [(0, 1)]

    while pq:
        d, u = heapq.heappop(pq)

        if d != dist[u]:
            continue

        for v, w in graph[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))

    road_parent_possible = [False] * (n + 1)

    for u, v, w in roads:
        if dist[u] + w == dist[v]:
            road_parent_possible[v] = True
        if dist[v] + w == dist[u]:
            road_parent_possible[u] = True

    valid_train_count = [0] * (n + 1)

    for s, y in trains:
        if y == dist[s]:
            valid_train_count[s] += 1

    removable = 0

    for s, y in trains:
        if y > dist[s]:
            removable += 1
        elif road_parent_possible[s]:
            removable += 1
        else:
            if valid_train_count[s] > 1:
                removable += 1
                valid_train_count[s] -= 1

    print(removable)

if __name__ == "__main__":
    solve()
```### 实施讨论

 第一阶段构建一个包含道路和火车的图。 Dijkstra 不需要区分它们，因为我们最初关心的是真正的最短距离。 

已知最短距离后，仅检查道路边缘以填充`road_parent_possible`。 该数组标识已经具有以普通道路结尾的最短路径的城市。 

数组`valid_train_count`计算长度恰好等于到达目的地的最短距离的火车。 只有这样的火车才有可能有用。 

在最后阶段，每列火车都会被分类。 比最短距离长的列车立即变得多余。 如果存在最短路径前身，则每趟前往该城市的火车都是多余的。 否则，只有一列最短有效的列车必须幸存，并且所有其他副本都将被删除。 

一个常见的错误是试图在 Dijkstra 期间决定是否需要乘坐火车。 等距离的情况使得这种方法容易出错。 首先计算所有最短距离，然后分析最短路径图，这样会更清晰。 

## 工作示例

 ### 示例 1

 输入：```
5 5 3
1 2 1
2 3 2
1 3 3
3 4 4
1 5 5
3 5
4 5
5 5
```迪杰斯特拉之后：

 | 城市 | 距离 |
 | --- | --- |
 | 1 | 0 |
 | 2 | 1 |
 | 3 | 3 |
 | 4 | 5 |
 | 5 | 5 |

 检查道路：

 | 城市 | 有最短路径前身吗？ |
 | --- | --- |
 | 2 | 是的 |
 | 3 | 是的 |
 | 4 | 没有 |
 | 5 | 是的 |

 列车分析：

 | 火车 | 最短有效？ | 道前身存在吗？ | 可拆卸的？ |
 | --- | --- | --- | --- |
 | (3,5) | 没有 | 是的 | 是的 |
 | (4,5) | 是的 | 没有 | 没有 |
 | (5,5) | 是的 | 是的 | 是的 |

 可移动列车总数 = 2。 

### 显示重复列车的示例

 输入：```
3 1 3
1 2 10
2 3 10
3 20
3 20
3 20
```迪杰斯特拉之后：

 | 城市 | 距离 |
 | --- | --- |
 | 1 | 0 |
 | 2 | 10 | 10
 | 3 | 20 |

 对于城市 3，没有道路边缘可以达到距离 20。 

| 火车 | 有效的？ |
 | --- | --- |
 | 20 | 是的 |
 | 20 | 是的 |
 | 20 | 是的 |

 必须保留一列火车。 

| 剩余需求| 可拆卸|
 | --- | --- |
 | 1 | 2 |

 答案是2。 

这个例子说明了为什么正确计算重复的最短列车是必要的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O((n+m+k)\log n)$| 一张 Dijkstra 加上道路和火车的线性扫描 |
 | 空间|$O(n+m+k)$| 图存储、距离数组、辅助数组 |

 该图最多包含$m+k$邻接列表中超出对称性的边。 迪杰斯特拉在运行时间上占据主导地位。 和$n \le 10^5$和$m+k \le 4 \cdot 10^5$，这完全符合限制。 

## 测试用例```
# helper verification logic would call solve() and compare output

# Sample 1
assert answer == 2  # provided sample

# Single essential train
# 1--100--2, train length 5
assert answer == 0  # train cannot be removed

# Train worse than road path
# road distance 5, train distance 10
assert answer == 1  # train removable

# Duplicate shortest trains
# three trains of equal optimal length
assert answer == 2  # keep one, remove two

# Road provides same shortest distance
# 1-3 (2), 3-2 (3), train to 2 length 5
assert answer == 1  # train redundant

# Multiple cities requiring trains
assert answer == 1  # only redundant train removed

# Large chain with no trains useful
assert answer == k  # all trains removable

# City reachable only by train
assert answer == 0  # must keep train
```### 测试总结

 | 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 | 2 | 官方示例|
 | 单程必备列车| 0 | 所需列车无法移除 |
 | 火车比公路差| 1 | 非最短列车移除 |
 | 重复的最短列车 | 2 | 保留一列最短的火车 |
 | 平等道路替代方案 | 1 | 最短的火车仍然可能是多余的 |
 | 多个火车目的地 | 变化 | 独立城市办理|
 | 大链条| k | 大规模列车拆除 |
 | 仅限火车通行 | 0 | 必要性检测 |

 ## 边缘情况

 ### 多趟火车前往同一城市

 考虑：```
3 1 3
1 2 10
2 3 10
3 20
3 20
3 20
```到城市 3 的最短距离是 20。没有道路前身可以达到这个值。 必须保留一列火车，但另外两列是多余的。 该算法对所有最短有效的列车进行计数，并删除除一列之外的所有列车。 

### 火车是最短距离，但仍然没有必要

 考虑：```
3 2 1
1 3 2
3 2 3
2 5
```城市 2 的最短距离为 5。火车的长度也为 5。一个简单的解决方案可能会保留它，因为它位于最短路径上。 然而，道路路径已经达到距离 5。`road_parent_possible[2]`变为真，因此火车被移除。 

### 火车比最佳距离更长

 考虑：```
2 1 1
1 2 5
2 10
```通过公路到城市 2 的最短距离是 5。 列车长度为 10，不属于任何最短路径。 该算法检测到`10 > dist[2]`并立即将其删除。 

### 多个最短路径前身

 考虑：```
1--2 (2)
1--3 (2)
2--4 (2)
3--4 (2)
Train 1->4 (4)
```城市 4 有多条最短的道路前身。 完全通过道路仍然可以实现最短距离。 火车是可移动的，并且算法在扫描道路边缘时正确地将城市 4 标记为具有最短路径的前身道路。
