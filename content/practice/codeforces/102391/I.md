---
title: "CF 102391I - 最小直径生成树"
description: "我们有一个无向连通图，其边的长度为正。 我们需要保留足够多的边来形成生成树，但目标不是树的总权重。 相反，我们希望生成的树中的最长路径尽可能短。"
date: "2026-08-12T05:26:26+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102391
codeforces_index: "I"
codeforces_contest_name: "XX Open Cup, Grand Prix of Korea"
rating: 0
weight: 102391
solve_time_s: 782
verified: false
draft: false
---

[CF 102391I - 最小直径生成树](https://codeforces.com/problemset/problem/102391/I)

 **评级：** -
 **标签：** -
 **求解时间：** 13m 2s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个无向连通图，其边的长度为正。 我们需要保留足够多的边来形成生成树，但目标不是树的总权重。 相反，我们希望生成的树中的最长路径尽可能短。 输出是最小可能直径以及实现它的任何生成树。 官方问题允许任何有效的最优树，因此正确实现打印的特定边不必与示例输出匹配。 

界限 (N\le 500) 足够小，足以允许算法围绕立方时间进行，但 (M) 可以大到 (N(N-1)/2)，因此图可以很稠密。 最大尺寸时大约可以有 (125000) 个边。 枚举生成树是完全不可能的，因为根据凯莱公式，（500）个顶点上的完整图有（500^{498}）个不同的生成树。 如果我们想要它的直径，即使检查一棵树也至少需要线性时间。 相反，我们需要一个使用最短路径信息的多项式算法。 

所有边长均为正数，可达(10^9)。 一条路径可以包含 (N-1) 条边，因此距离大约可以达到 (5\cdot10^{11})。 Python 整数直接处理这个范围，但使用 32 位整数类型会溢出。 

有三种边缘情况特别容易处理不当。 

首先，最佳中心可以位于边缘内部而不是顶点。 考虑```
4 3
1 2 1
2 3 1
3 4 1
```唯一的生成树是路径 (1-2-3-4)，其直径为 (3)。 如果我们只检查顶点中心，则最佳顶点有偏心率 (2)，导致值不正确 (4)。 真正的中心是边缘 (2-3) 的中点，半径为 (1.5)，因此正确的直径为 (3)。 

其次，包含中心的边不必是其端点之间的最短路径。 考虑```
3 3
1 2 1
2 3 1
1 3 100
```昂贵的边 (1-3) 仍然是图的边，必须被视为绝对中心的可能位置。 它的端点距离必须使用图最短路径来计算，而不是假设给定的边本身是其端点之间的最短路径。 最优树是路径 (1-2-3)，直径为 (2)。 

第三，相等的最短路径距离可能经常发生。 在```
3 3
1 2 1
2 3 1
1 3 1
```顶点 (2) 和 (3) 与顶点 (1) 的距离为 (1)。 Dijkstra 实现必须允许任意平局排序。 最终答案仍然是直径 (2)，并且算法不得依赖于等距离顶点的一种特定排序。 

## 方法

 蛮力方法在概念上很简单。 枚举边的每个子集，保留恰好包含 (N-1) 条边的子集，测试每个这样的子集是否是一棵树，计算其直径，并保留最小的一个。 这是正确的，因为每个生成树都出现在枚举中。 问题在于候选人的数量。 在完整的图 (K_N) 中，有 (N^{N-2}) 个生成树，因此对于 (N=500) 来说，枚举已经有 (500^{498}) 个候选。 计算每个候选者的直径将使总工作量达到 (N\cdot N^{N-2}) 的量级，远远超出任何实际限制。 

有用的观察是最小直径树具有非常特定的几何中心。 想象一下用相同长度的连续线段替换每个图形边缘。 该连续网络上的点可以是顶点或边的内部点。 对于这样的点 (x)，将其半径定义为从 (x) 到任意图顶点的最大最短路径距离。 

选取任何生成树 (T)，并查看其直径路径之一的中点。 该中点要么是树顶点，要么位于树边缘内。 树的每个顶点与该中点的树距离最多为直径的一半。 图最短路径只能比树路径短，因此同一点到每个顶点的图距离最多为树直径的一半。 因此，每个直径为 (D) 的生成树最多给出一个半径为 (D/2) 的网络点。 

反过来才是关键。 如果(x)是原始网络中到顶点的最大图距离为(R)的点，则构建以(x)为根的最短路径树，将内部边缘点视为细分顶点。 该树中每个根到顶点的距离最多为 (R)，因此每对顶点的树距离最多为 (2R)。 因此，最佳生成树直径恰好是此类网络点的最小可能半径的两倍。 

这将原始树优化问题转换为加权图上的绝对 1 中心问题。 这种等价性是最小直径生成树的标准表征。 

可能的中心只有两种。 中心可以是原始顶点，在这种情况下，其半径就是其偏心率。 或者它可以位于原始边缘内的某个位置。 我们可以直接测试所有顶点，但测试边需要更加小心。 

对于长度为 (w) 的边 (u-v)，令 (x) 为距 (u) 距离 (\alpha) 的点，其中 (0\le\alpha\le w)。 对于每个顶点 (z)，

 [
 d(x,z)=\min(\alpha+d(u,z),,w-\alpha+d(v,z))。 
]

 第一个表达式描述通过 (u) 到达 (z) 的路径，而第二个表达式描述通过 (v) 到达 (z) 的路径。 (x) 的半​​径是所有 (z) 中这些值的最大值。 

每个顶点贡献一个倒V形函数(α)。 所有这些函数的上包络线正是沿边缘的半径函数。 我们需要它的最低点。 在计算所有对距离和 Dijkstra 阶数后，Kariv-Hakimi 扫描会在线性时间内找到该上包络线的所有相关波谷。 

对于固定边 (u-v)，通过增加 (d(u,z)) 对顶点进行排序。 从距离 (u) 最远的顶点开始。 当我们向后扫描剩余的顶点时，新顶点仅当它距离 (v) 比当前活动顶点更远时才重要。 这样的改变在(u)侧的当前相关函数和(v)侧的新函数之间创建了新的交叉。 如果两个相关顶点是 (p) 和 (q)，则交叉点的半径为

 [
 R=\frac{d(u,p)+w+d(v,q)}{2}。 
]

 由于所需的答案是直径，因此存储两倍的半径很方便：

 [
 D=d(u,p)+w+d(v,q)。 
]

 这避免了每次浮点计算。

因此，完整的算法是全对最短路径计算，然后是顶点中心检查和针对每个图边的线性 Kariv-Hakimi 扫描。 最后，一旦知道了最佳中心，另一次 Dijkstra 计算就会构造一棵以该中心为根的最短路径树。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(N\cdot N^{N-2})) | (O(N^2)) | 太慢了|
 | 最佳 | (O(NM\log N + NM)) 与堆 Dijkstra | (O(N^2+M)) | 已接受 |

 对于所述 (N\le500)，这是标准的精确多项式方法。 一旦最短路径矩阵可用，绝对中心方法的理论公式通常给出为 (O(MN+N^2\log N))，并且所有对最短路径提供额外的 (N) 个单源计算。 

## 算法演练

 1. 从每个顶点运行 Dijkstra。 存储最短距离 (d[s][v]) 以及 Dijkstra 从 (s) 永久确定顶点的顺序。 

最终确定顺序按与 (s) 的非递减距离排序。 这正是 Kariv-Hakimi 边缘扫描所需的排序。 

1. 对于每个顶点 (c)，计算

 [
 D_c=2\max_v d[c][v]。 
]

 保留最小值并记住(c)作为当前的最佳中心。 

如果最佳绝对中心恰好是图顶点，则已经找到它。 因子 2 是故意的，因为最终的生成树直径是中心半径的两倍。 

1. 对于每个长度为 (w) 的图边 (u-v)，使用 (u) 中的 Dijkstra 顺序。 令该顺序为

 [
 r_0,r_1,\l点,r_{N-1},
 ]

 其中 (r_{N-1}) 距离 (u) 最远。 

初始化（a=N-1）。 然后扫描(b=N-2,N-3,\ldots,0)。 每当

 [
 d[v][r_b] > d[v][r_a],
 ]

 当前相关的两条包络线形成一个新的候选谷。 

相应的半径加倍为

 [
 D=d[u][r_b]+w+d[v][r_a]。 
]

 如果该值改进了当前答案，请记住该边以及两个顶点 (r_b) 和 (r_a)。 

进行严格比较的原因是，只有 (v) 侧的新的较大值才会改变上包络线。 相同的值无法创建活动线尚未表示的较低交叉点。 

1. 检查完所有顶点和边后，我们知道最小双倍半径 (D^*)。 

如果最佳中心是顶点（c），我们将构建一个以（c）为根的普通最短路径树。 

如果最佳中心位于边 (u-v) 上，则令 (p=r_b) 和 (q=r_a) 为找到候选边时记录的两个顶点。 交叉位置满足

 [
 α+d[u][p]=w-α+d[v][q]。 
]

 乘以二得出

 [
 2\alpha=w+d[v][q]-d[u][p]。 
]

 我们存储这个整数值而不是使用浮点数。 

1. 要构建顶点中心的树，请从该顶点运行 Dijkstra 并保留每个顶点的前趋。 每个非根顶点都贡献其前驱边。 

最短路径树正是我们想要的，因为每个顶点与根的图距离最多为中心半径，因此任何两个树顶点都通过根通过长度最多为该半径两倍的路径连接。 

1. 要构建边缘中心的树，请通过插入新中心 (x) 从概念上细分 (u-v)。 从(x)到(u)和(v)的距离是(α)和(w-α)。 

在实现中，我们避免创建新的顶点。 我们用双倍的暂定距离初始化 Dijkstra

 [
 2\阿尔法
 ]

 对于 (u) 和

 [
 2w-2\alpha
 ]

 对于（v）。 那么普通图的边的长度加倍（2w_e）。 

两个初始顶点允许稍后松弛。 这个细节很重要，因为所选边 (u-v) 不必是 (u) 和 (v) 之间的最短路径。 如果可以通过图表的其余部分更便宜地到达一个端点，则必须允许 Dijkstra 发现这一点。

1. 这个多源 Dijkstra 生成的前驱图是一个植根于从人工中心直接到达的顶点的森林。 如果 (u) 和 (v) 仍然是根，则添加原始边 (u-v)。 如果只剩下一个根，则不需要原来的边。 

生成的图恰好具有 (N-1) 条边，并且是生成树。 它的根到顶点的距离等于距所选中心的最短距离，因此它的直径最大为 (D^_)。 由于生成树的直径不能低于 (D^_)，因此它的直径恰好是最佳的。 

### 为什么它有效

 令 (R^_) 为连续图的一点到所有原始顶点的最小最大距离。 对于每个直径为 (D) 的生成树 (T)，直径路径的中点距每个顶点最多为树距离 (D/2)，并且图距离不能超过树距离。 因此 (R^_\le D/2)，给出 (D\ge2R^*)。 

相反，取绝对中心 (x) 和半径 (R^_)。 以 (x) 为根的最短路径树为每个顶点提供距 (x) 最多 (R^_) 的树距离。 任意两个顶点之间的树距离至多为它们到(x)的距离之和，因此其直径至多为(2R^_)。 两个不等式相交，证明最佳生成树直径为 (2R^_)。 

绝对中心位于顶点或边内部。 直接检查顶点中心。 在每条边上，半径是顶点距离函数的上包络，并且 Kariv-Hakimi 扫描精确检查该包络可以达到局部最小值的点。 因此，扫描找到的最小候选者是（R^_）。 最终的最短路径树达到直径 (2R^_)，因此打印的树是最优的。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

INF = 10**30

def dijkstra(source, graph, n):
    dist = [INF] * n
    parent = [-1] * n
    order = []

    dist[source] = 0
    pq = [(0, source)]

    while pq:
        d, u = heapq.heappop(pq)
        if d != dist[u]:
            continue

        order.append(u)

        for v, w in graph[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                parent[v] = u
                heapq.heappush(pq, (nd, v))

    return dist, parent, order

def dijkstra_center(graph, n, u, v, alpha2, w):
    """
    Dijkstra from an artificial center x lying on edge u-v.

    All distances are doubled, so alpha2 = 2 * distance(x, u).
    The initial distances are:
        dist2[u] = alpha2
        dist2[v] = 2*w - alpha2

    Unlike ordinary multi-source Dijkstra, u and v are allowed to
    be relaxed later. This is necessary because u-v itself need not
    be a shortest path between u and v.
    """
    dist = [INF] * n
    parent = [-1] * n

    dv = 2 * w - alpha2
    dist[u] = alpha2
    dist[v] = dv

    pq = [(alpha2, u)]
    if v != u:
        heapq.heappush(pq, (dv, v))

    used = [False] * n

    while pq:
        d, x = heapq.heappop(pq)
        if used[x] or d != dist[x]:
            continue

        used[x] = True

        for y, ew in graph[x]:
            nd = d + 2 * ew
            if nd < dist[y]:
                dist[y] = nd
                parent[y] = x
                heapq.heappush(pq, (nd, y))

    tree = []

    for x in range(n):
        if parent[x] != -1:
            tree.append((x, parent[x]))

    # If both endpoints are roots of the shortest-path forest,
    # the artificial center connects to both, which corresponds
    # to using the original edge u-v.
    if parent[u] == -1 and parent[v] == -1 and u != v:
        tree.append((u, v))

    return tree

def dijkstra_tree(graph, n, source):
    dist = [INF] * n
    parent = [-1] * n

    dist[source] = 0
    pq = [(0, source)]

    while pq:
        d, u = heapq.heappop(pq)
        if d != dist[u]:
            continue

        for v, w in graph[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                parent[v] = u
                heapq.heappush(pq, (nd, v))

    return [(v, parent[v]) for v in range(n) if parent[v] != -1]

def solve():
    n, m = map(int, input().split())

    graph = [[] for _ in range(n)]
    edges = []

    for _ in range(m):
        u, v, w = map(int, input().split())
        u -= 1
        v -= 1
        graph[u].append((v, w))
        graph[v].append((u, w))
        edges.append((u, v, w))

    # All-pairs shortest paths and Dijkstra finalization orders.
    dist = [[0] * n for _ in range(n)]
    orders = [None] * n

    for s in range(n):
        ds, _, order = dijkstra(s, graph, n)
        dist[s] = ds
        orders[s] = order

    # Best center found so far.
    best2 = INF
    best_type = 0          # 0 = vertex, 1 = edge
    best_vertex = -1

    for s in range(n):
        cur = 2 * max(dist[s])
        if cur < best2:
            best2 = cur
            best_type = 0
            best_vertex = s

    best_edge = None

    # Kariv-Hakimi sweep on every edge.
    for u, v, w in edges:
        r = orders[u]

        a = n - 1

        for b in range(n - 2, -1, -1):
            x = r[b]
            y = r[a]

            if dist[v][x] > dist[v][y]:
                candidate2 = dist[u][x] + w + dist[v][y]

                if candidate2 < best2:
                    best2 = candidate2
                    best_type = 1
                    best_edge = (u, v, w, x, y)

                a = b

    # Construct an optimal shortest-path tree.
    if best_type == 0:
        tree = dijkstra_tree(graph, n, best_vertex)
    else:
        u, v, w, p, q = best_edge

        # 2 * alpha = w + d(v,q) - d(u,p)
        alpha2 = w + dist[v][q] - dist[u][p]

        tree = dijkstra_center(graph, n, u, v, alpha2, w)

    out = [str(best2)]

    for u, v in tree:
        out.append(f"{u + 1} {v + 1}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```第一个 Dijkstra 循环同时计算两条信息。 距离数组给出所有对的最短路径矩阵，而顺序数组记录距源的非递减距离的顶点。 由于每条边权重均为正，因此 Dijkstra 永久提取顶点的顺序是有效的距离顺序。 

顶点中心循环使用 (2\cdot\max d[c][v]) 因为实际答案是直径而不是半径。 将所有内容都加倍也会使后面的边缘中心算术积分。 

边缘循环是 Kariv-Hakimi 算法的紧凑部分。 对于边 (u-v)，`r`按距 (u) 的距离排序。 变量`a`识别对面当前活动的最远线，而`b`扫描可以替换它的可能行。 什么时候`dist[v][r[b]]`变得严格大于`dist[v][r[a]]`，两条线形成一个新的相关交点，其双倍高度恰好是```
dist[u][r[b]] + w + dist[v][r[a]]
```重建代码使用双倍距离。 如果中心距 (u) 的距离为 (α)，则距人工中心的两个初始距离为 (α) 和 (w-α)。 将所有距离乘以二给出整数初始值，因此不需要浮点比较。 

重建 Dijkstra 故意不将 (u) 和 (v) 永久标记为不可变源。 昂贵的边可能在图中的其他地方有更短的替代路线，因此这些端点之一可能不再是人工中心的直接子节点。 前驱图仍然是一个森林，因为每个前驱都是通过严格的距离改进来分配的。 如果两个端点仍然是根，则人工中心将使用所选边的两半，因此这两个根将由原始边连接起来。 

Python 的任意精度整数消除了溢出问题。 最大相关距离低于 (5\cdot10^{11})，而双倍距离则保持在 (10^{12}) 以下。 

## 工作示例

 ### 示例 1

 该图是一个三角形，三条边的长度均为 (1)。 每个顶点都有偏心率 (1)，因此顶点中心已经给出了双倍的半径 (2)。 

| 中心候选人 | 半径 | 双倍半径 |
 | ---| ---| ---|
 | 顶点 1 | 1 | 2 |
 | 顶点 2 | 1 | 2 |
 | 顶点 3 | 1 | 2 |

 边缘扫描无法改善该值。 该算法可以选择顶点(1)，然后Dijkstra产生最短路径树，例如(1-2)和(1-3)。 

生成的树的直径为 (2)，与样本显示的最佳直径相匹配。 

### 示例 2

 该图的左簇通过长度为 (1000) 的长边 (3-4) 连接到右簇。 

重要的候选者是边缘（3-4）的内部。 左侧从 (3) 出发经过距离 (30) 到达顶点 (1)，而右侧从 (4) 出发经过距离 (30) 到达顶点 (6)。 

因此相关交叉口的半径加倍

 [
 30+1000+30=1060。 
]

 | 候选人 | 左贡献 | 边缘 | 正确的贡献 | 直径|
 | ---| ---| ---| ---| ---|
 | 中心在边缘 (3-4) | 30| 1000 | 1000 30| 1060 | 1060

 中心是 (3-4) 边的中点。 最短路径树通过 (3) 连接左顶点，通过 (4) 连接右顶点，得到直径为 (1060) 的树。 

示例输出恰好使用该中心边缘并报告直径 (1060)。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(NM\log N + NM)) | (N) Dijkstra 对每条边运行一次 (O(N)) 扫描 |
 | 空间| (O(N^2+M)) | 所有对距离、Dijkstra 阶和邻接表 |

 对于 (N\le500)，距离矩阵仅需要 (250000) 个条目。 该图可以包含大约 (125000) 条边，因此邻接列表在 (1024) MB 内存限制下也是可以管理的。 边缘扫描本身对每个边缘最多执行 (N) 个简单操作，这在最大密度下大约是 (6.25\cdot10^7) 次迭代。 最短路径阶段​​主导运行时间。 

标准的精确绝对中心公式是多项式的，并且基于处理每条边所遵循的所有对最短路径。 

## 测试用例

 输出树不是唯一的，因此测试工具不应将整个输出字符串与一个固定答案进行比较。 相反，它检查报告的直径，验证每个打印的边是否属于输入图，验证是否恰好有 (N-1) 个边，并检查这些边是否形成实际加权直径等于预期最佳值的树。```python
import sys
import io
from collections import deque
import heapq

# Put the submitted solution in the same file above this harness.
# The function solve() must be the solution entry point.

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def validate(inp: str, out: str, expected_diameter: int):
    data = list(map(int, inp.split()))
    it = iter(data)

    n = next(it)
    m = next(it)

    edge_weight = {}
    graph = [[] for _ in range(n)]

    for _ in range(m):
        u = next(it) - 1
        v = next(it) - 1
        w = next(it)

        edge_weight[frozenset((u, v))] = w
        graph[u].append((v, w))
        graph[v].append((u, w))

    lines = out.strip().splitlines()
    assert len(lines) == n

    diameter = int(lines[0])
    assert diameter == expected_diameter

    tree = []
    for line in lines[1:]:
        u, v = map(int, line.split())
        u -= 1
        v -= 1

        assert 0 <= u < n
        assert 0 <= v < n
        assert u != v

        key = frozenset((u, v))
        assert key in edge_weight

        tree.append((u, v, edge_weight[key]))

    assert len(tree) == n - 1

    # Check that the output is a tree.
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for u, v, _ in tree:
        ru = find(u)
        rv = find(v)
        assert ru != rv
        parent[ru] = rv

    root = find(0)
    for v in range(n):
        assert find(v) == root

    # Compute the actual diameter of the printed tree.
    tg = [[] for _ in range(n)]
    for u, v, w in tree:
        tg[u].append((v, w))
        tg[v].append((u, w))

    actual = 0

    for s in range(n):
        dist = [-1] * n
        dist[s] = 0
        q = deque([s])

        while q:
            u = q.popleft()
            for v, w in tg[u]:
                if dist[v] == -1:
                    dist[v] = dist[u] + w
                    q.append(v)

        actual = max(actual, max(dist))

    assert actual == expected_diameter

# Sample 1
sample1 = """\
3 3
1 2 1
2 3 1
3 1 1
"""
validate(sample1, run(sample1), 2)

# Sample 2
sample2 = """\
6 7
1 2 10
2 3 20
1 3 30
3 4 1000
4 5 30
5 6 20
4 6 10
"""
validate(sample2, run(sample2), 1060)

# Minimum-size graph.
case_min = """\
2 1
1 2 7
"""
validate(case_min, run(case_min), 7)

# Four-vertex path. The optimum center is inside an edge,
# so a vertex-only solution would incorrectly report 4.
case_edge_center = """\
4 3
1 2 1
2 3 1
3 4 1
"""
validate(case_edge_center, run(case_edge_center), 3)

# All edge weights equal. The triangle has a vertex center,
# and every spanning tree has diameter 10.
case_equal = """\
3 3
1 2 5
2 3 5
1 3 5
"""
validate(case_equal, run(case_equal), 10)

# Maximum-size dense input, all weights equal.
# A star has diameter 2 and is optimal.
n = 500
parts = [f"{n} {n * (n - 1) // 2}"]

for u in range(1, n + 1):
    for v in range(u + 1, n + 1):
        parts.append(f"{u} {v} 1")

case_max = "\n".join(parts) + "\n"
validate(case_max, run(case_max), 2)

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品1 | 直径 (2) | 顶点中心和等距离关系 |
 | 样品2 | 直径 (1060) | 内边缘中心位于长加权边缘上 |
 | (2) 顶点、权重的一条边 (7) | 直径 (7) | 最小尺寸边界|
 | 路径 (1-2-3-4)，单位权重 | 直径 (3) | 捕获仅测试顶点中心的解决方案 |
 | 带重量的等重三角形 (5) | 直径 (10) | 等距离和顶点中心处理 |
 | (500) 个顶点的完整图，所有权重 (1) | 直径 (2) | 最大值（N）、最大值（M）、稠密图、等权 |

 ## 边缘情况

 最小尺寸情况只有两个顶点：```
2 1
1 2 7
```恰好存在一棵生成树，由唯一的边组成，因此答案一定是（7）。 顶点中心相位给出任一端点的偏心率 (7) 和双倍半径 (14)，但实际树直径为 (7)，这暴露了盲目处理 (2R) (N=2) 的问题。 绝对中心半径实际上是 (3.5)，在边缘的中点处获得，因此边缘扫描找到候选点 (7)。 这就是为什么即使对于最小的图也需要测试内部边缘中心。 

对于四顶点路径```
4 3
1 2 1
2 3 1
3 4 1
```顶点偏心率为 (3,2,2,3)。 最佳候选顶点的半径加倍 (4)。 在边 (2-3) 上，相关的最远顶点是 (1) 和 (4)，给出

 [
 1+1+1=3。 
]

 边缘扫描记录直径 (3)，重建将人工中心放置在 (2-3) 的中点。 生成的树必然是原始路径，其直径为 (3)。 

对于包含一条边的图，该边不是其端点之间的最短路径，```
3 3
1 2 1
2 3 1
1 3 100
```尽管直接边的权重为 (100)，但最短路径矩阵给出 (d(1​​,3)=2)。 中心计算到处都使用这些最短路径距离。 仍将昂贵的边作为可能的中心位置进行检查，但它无法击败顶点 (2) 处的中心。 最终直径为 (2)，树边为 (1-2) 和 (2-3)。 

对于相等的距离，```
3 3
1 2 1
2 3 1
1 3 1
```Dijkstra 可能会根据堆关系行为以不同的顺序最终确定顶点。 边缘扫描仅使用所得的非递减距离顺序和对侧的严格改进。 相等的值不需要特定的平局打破规则。 候选顶点中心已经给出了双倍的半径 (2)，因此算法返回直径 (2)。 

对于最大稠密情况，当（N=500）时，图可以包含所有（124750）条可能的边。 如果每条边的权重为 (1)，则选择任意顶点作为中心，半径为 (1)，因此最佳直径为 (2)。 该算法仍然在 Kariv-Hakimi 扫描期间处理所有边，但每个候选边并不比顶点中心值更好。 此案例同时练习 (M=\Theta(N^2)) 输入边界和最短路径排序的等距离行为。 

实施此社论时要记住的一个更正：测试工具故意验证输出的_properties_，而不是比较边缘列表，因为 Codeforces 接受任何最小直径生成树。
