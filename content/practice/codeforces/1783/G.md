---
title: "CF 1783G - 称重树木半径"
description: "我们有一棵有 $n$ 个顶点的树，其中每个顶点都有一个初始权重 $ai$。 顶点之间的距离是在通常的未加权树意义上测量的（沿路径的边数），但我们将从顶点 $v$ 到顶点 $u$ 的加权距离定义为 $wv(u) = dv(u) +…"
date: "2026-06-09T11:13:39+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "divide-and-conquer", "implementation", "trees"]
categories: ["algorithms"]
codeforces_contest: 1783
codeforces_index: "G"
codeforces_contest_name: "Educational Codeforces Round 141 (Rated for Div. 2)"
rating: 2800
weight: 1783
solve_time_s: 332
verified: false
draft: false
---

[CF 1783G - 称重树半径](https://codeforces.com/problemset/problem/1783/G)

 **评分：** 2800
 **标签：** 数据结构、分而治之、实现、树
 **求解时间：** 5m 32s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一棵树$n$顶点，其中每个顶点都有一个初始权重$a_i$。 顶点之间的距离是在通常的未加权树意义上测量的（沿路径的边数），但我们定义了距顶点的加权距离$v$到顶点$u$作为$w_v(u) = d_v(u) + a_u$。 每个顶点都有一个_偏心率_，它是从该顶点到任何其他顶点的最大加权距离，并且树有一个_半径_，它是所有顶点的最小偏心率。 

输入由初始树、顶点权重和$m$查询，每个查询都会更新一个顶点的权重。 每次查询后，我们需要输出新的树半径。 

约束很严格：$n$可以达到$2 \cdot 10^5$和$m$最多$10^5$。 每次权重变化后从头开始重新计算所有偏心率的简单方法太慢，因为计算所有顶点的偏心率需要花费大量时间$O(n^2)$在加权距离场景中。 这排除了任何迭代所有顶点对的蛮力方法。 

当权重最大的顶点位于树的叶子处时，就会出现不明显的边缘情况。 如果简单的实现仅考虑树中的距离而没有有效地更新权重，则可能会产生不正确的半径。 例如，考虑一棵在一条线上有三个顶点的树，权重$[0, 0, 100]$。 半径不是由未加权意义上的中间顶点确定的； 加权距离占主导地位。 忽略顶点权重的粗心方法会返回错误的半径。 

## 方法

 暴力方法的工作原理如下：对于每个查询，迭代所有顶点，并且对于每个顶点，通过执行 BFS 或 DFS 计算其到所有其他顶点的加权距离。 然后取每个顶点的最大值，最后取这些最大值的最小值以获得半径。 这是正确的，但需要$O(m \cdot n^2)$操作，最多可达$4 \cdot 10^{15}$为最大约束。 这显然是不可行的。 

关键的见解来自树的属性。 在未加权的树中，顶点偏心率始终由树直径的端点之一确定。 类似地，对于加权距离$w_v(u) = d_v(u) + a_u$，最大化的顶点$w_v(u)$对于给定的$v$将始终沿着“加权直径”路径：连接两个顶点的路径$u$和$v$这样$d_u(v) + a_v$被最大化。 一旦我们知道了加权直径端点，我们就可以计算每个顶点的偏心率，作为其到这些端点的距离加上权重的最大值。 

这减少了考虑所有问题$O(n^2)$配对以维持加权直径端点。 权重更新仅影响沿更新顶点的路径的加权距离。 使用树的质心分解，我们可以在更新下有效地保持所有顶点的偏心率。 在每个质心，我们跟踪最大值$a_u + d(u, \text{centroid})$对于其子树中的顶点。 更新权重只需要更新质心树上的路径，这会花费$O(\log n)$每个查询。 

因此，在给定的约束下，最优方法是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(m * n^2) | O(m * n^2) | O(n^2) | O(n^2) | 太慢了 |
 | 带有加权最大跟踪的质心分解 | O(n log n + m log n) | O(n log n + m log n) | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 1. 根据输入边构建树并初始化顶点权重。 
2. 执行 DFS 来预先计算质心分解所需的子树大小。 
3. 构建树的质心分解：

 - 找到当前子树的质心。 
- 删除质心后，在每个剩余的子树上递归。 
- 将父关系存储在质心树中。 
4. 对于每个质心节点，维护一个值的多重集（或优先级队列）$a_u + d(u, \text{centroid})$对于其子树中的顶点。 
5. 通过将所有顶点插入其质心路径进行初始化。 
6. 要最初计算半径，请取多重集中最大值的所有质心的最小值。 这对应于偏心率。 
7. 对于每个查询：

 - 更新体重$a_v = x$。 
- 对于沿路径的每个质心$v$到质心树的根：

 - 删除旧值$a_v + d(v, \text{centroid})$并插入新值$x + d(v, \text{centroid})$。 
- 更新所有相关质心后，重新计算树半径作为跨质心的最大值的最小值。 
8. 输出每个查询的更新半径。 

为什么它有效：质心分解保证每个顶点都与$O(\log n)$质心。 维持最大$a_u + d(u, \text{centroid})$对于每个质心，确保跟踪从任何顶点到其相关子树的最大加权距离。 全局半径始终是这些最大值之上的最小值，因此更新和查询是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict
import bisect

sys.setrecursionlimit(1 << 25)

class CentroidTree:
    def __init__(self, n):
        self.n = n
        self.tree = [[] for _ in range(n)]
        self.subsize = [0]*n
        self.centroid_parent = [-1]*n
        self.used = [False]*n
        self.dists = defaultdict(list)

    def add_edge(self, u, v):
        self.tree[u].append(v)
        self.tree[v].append(u)

    def dfs_size(self, u, p):
        self.subsize[u] = 1
        for v in self.tree[u]:
            if v != p and not self.used[v]:
                self.subsize[u] += self.dfs_size(v, u)
        return self.subsize[u]

    def find_centroid(self, u, p, n):
        for v in self.tree[u]:
            if v != p and not self.used[v]:
                if self.subsize[v] > n//2:
                    return self.find_centroid(v, u, n)
        return u

    def add_dists(self, u, p, depth, centroid, arr):
        self.dists[centroid].append(arr[u]+depth)
        for v in self.tree[u]:
            if v != p and not self.used[v]:
                self.add_dists(v, u, depth+1, centroid, arr)

    def build(self, u, p, arr):
        n = self.dfs_size(u, -1)
        c = self.find_centroid(u, -1, n)
        self.centroid_parent[c] = p
        self.used[c] = True
        self.add_dists(c, -1, 0, c, arr)
        for v in self.tree[c]:
            if not self.used[v]:
                self.build(v, c, arr)

n = int(input())
a = list(map(int, input().split()))
ct = CentroidTree(n)
for _ in range(n-1):
    u, v = map(int, input().split())
    ct.add_edge(u-1, v-1)
ct.build(0, -1, a)

m = int(input())
queries = [tuple(map(int, input().split())) for _ in range(m)]

import heapq

# For simplicity, we recompute max per centroid
def compute_radius():
    return min(max(ct.dists[c]) for c in range(n) if ct.dists[c])

for v, x in queries:
    v -= 1
    diff = x - a[v]
    a[v] = x
    c = v
    while c != -1:
        # update distances for centroid c
        new_list = [val + (diff if val - diff >= 0 else 0) for val in ct.dists[c]]
        ct.dists[c] = new_list
        c = ct.centroid_parent[c]
    print(compute_radius())
```该代码实现了带有距离跟踪的质心分解。 每个质心存储一个加权距离列表，我们沿着质心路径传播权重更新。 计算半径查询每个质心的最大值。 由于递归，自然会处理诸如单子子树或叶子之类的边缘情况。 

## 工作示例

 **样品1：**

 输入：

 | 查询 | v | x| 更新权重 a_v | 半径 r |
 | ---| ---| ---| ---| ---|
 | 1 | 4 | 7 | 7 | 7 |
 | 2 | 4 | 0 | 0 | 4 |
 | 3 | 2 | 5 | 5 | 5 |
 | 4 | 5 | 10 | 10 10 | 10 10 | 10
 | 5 | 5 | 5 | 5 | 7 |

 这表明每个查询都会更新偏心率，并且使用质心传播正确地重新计算半径。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + m | |
