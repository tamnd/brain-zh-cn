---
title: "CF 102394H - 公路巴士"
description: "有 (n) 个公交车站通过无向连通图连接。 每条高速公路都有单位长度，因此两个站点之间的距离就是图中它们通常的最短路径长度。"
date: "2026-08-10T19:23:14+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102394
codeforces_index: "H"
codeforces_contest_name: "The 2019 China Collegiate Programming Contest Harbin Site"
rating: 0
weight: 102394
solve_time_s: 457
verified: true
draft: false
---

[CF 102394H - 公路巴士](https://codeforces.com/problemset/problem/102394/H)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 有 (n) 个公交车站通过无向连通图连接。 每条高速公路都有单位长度，因此两个站点之间的距离就是图中它们通常的最短路径长度。 

车站 (i) 可以出售到任何与 (i) 的图形距离至多为 (f_i) 的车站的巴士票。 乘坐这样的巴士费用

 [
 c_i+(T-1)w_i
 ]

 当所有公共汽车都在天 (T) 乘坐时。 价格仅取决于购票的车站，与目的地无关。 

爱丽丝从车站 (1) 出发。 对于每个可能的目的地 (k)，我们需要所有有效的公交车行程序列和全天的最低总票价 (1\le T\le T_{\max})。 

该图最多有 (200000) 个顶点，但只有 (n+50) 条边。 第二个界限是结构关键。 一般的稀疏图仍然可以具有复杂的最短路径，但是该图与树最多有 (51) 条边的不同。 

时间参数大到(10^6)，所以每天都尝试是不可能的。 顶点数量也足够大，即使 (O(n^2)) 工作也远远超出了预期范围。 该解决方案必须利用少量的额外边缘，以及从车站出发的每个传出总线转换具有相同成本的事实。 

有几种边界情况很容易破坏实现。 

首先是出发站本身。 Alice 不需要买票去参观站 (1)，因此它的答案始终为零。 例如，```
1 0 3
1 10 -5
```有输出```
0
```强制至少乘坐一次公共汽车的最短路径实现将错误地返回正值。 

第二个是负数 (w_i)。 稍后的一天可能比第 (1) 天便宜，并且不能简单地将最佳日期假设为第一天。 例如，```
2 1 3
1 10 -4
1 1 0
1 2
```有输出```
0
2
```(1) 站三天的票价为 (10,6,2)，因此 (3) 天到达第二站最便宜。 

三是无树公路。 认为```
3 3 1
1 3 0
1 3 0
1 3 0
1 2
2 3
1 3
```被给出。 生成树可以包含(1-2)和(2-3)，而(1-3)成为额外的边。 由于 (f_1=1)，由于额外的边缘，可以在一辆公交车中从站 (1) 到达站 (3)。 正确的输出是```
0
3
3
```仅考虑生成树中的距离的方法会错误地认为站 (3) 距离两条高速公路远。 

第四是包含半径条件。 如果 (f_i=2)，则距离恰好为 (2) 的目的地是合法的。 例如，```
3 2 1
2 7 0
1 100 0
1 100 0
1 2
2 3
```有输出```
0
7
7
```必须包括距离正好 (2) 的目的地。 

## 方法

 固定日期的直接解决方案在概念上很简单。 给站 (i) 出站边缘成本 (c_i+(T-1)w_i)，并将其连接到图距离 (f_i) 内的每个站。 然后从站 (1) 运行 Dijkstra。 

问题是这个隐式有向图可能很稠密。 半径覆盖整个图的车站有 (n) 个外出巴士转换。 在最坏的情况下，存在 (\Theta(n^2)) 个这样的转变。 尝试所有 (T_{\max}) 天将导致大致

 [
 O(T_{\max}n^2\log n)
 ]

 工作。 当 (n=200000) 和 (T_{\max}=10^6) 时，仅可能的松弛数就可以达到 (4\cdot10^{16}) 左右。 

第一个主要观察结果完全消除了白天的维度。 考虑一种固定的公交车乘坐顺序。 其总价为

 [
 \sum_i c_i+(T-1)\sum_i w_i,
 ]

 这是 (T) 的线性函数。 整数区间 ([1,T_{\max}]) 上的线性函数在两个端点之一达到最小值。 因此，每条特定路线仅需要在第 (1) 天或第 (T_{\max}) 天考虑。 

对所有路线取最小值可以保留此属性：

 \分钟\左(
 \min_{\text{路线}}\text{成本(路线},1),
 \min_{\text{路线}}\text{成本(路线},T_{\max})
 \右）。 
]

 所以我们只需要两次最短路径计算。 这种端点减少也是该问题的已知解决方法的起点。 

现在修复这两天之一。 让

 [
 a_i=c_i+(T-1)w_i。 
]

 每当 Alice 到达站 (i) 时，从 (i) 出发的每一次有效的公交车转换成本恰好为 (a_i)。 假设其当前最短距离为(d_i)。 因此，可以为其半径内的每个站点分配候选值

 [
 d_i+a_i。 
]

 这给出了一个有用的 Dijkstra 变体。 无需显式存储每个有向总线边缘，而是使用键 (d_i+a_i) 将站 (i) 放入优先级队列中。 处理时，我们需要找到距离（f_i）内所有尚未到达的顶点。 

如果高速公路图恰好是一棵树，那么这将成为标准的质心分解查询。 对于每个质心 (x)，将所有顶点存储在其当前组件中，并按距 (x) 的树距离排序。 对于源 (u)，遍历 (u) 的质心祖先。 如果 (d(u,x)) 已知且

 [
 d(u,x)+d(x,v)\le f_u,
 ]

 那么 (v) 是一个有效的目的地。 我们可以使用指针来使用排序列表。 一旦 Dijkstra 到达某个顶点，就不再需要考虑它，因此每个指针只会向前移动。 

实际图最多有 (51) 个超出生成树的边。 考虑这样一个非树边并选择其端点之一，例如 (x)。 使用此额外边的任何最短路径都会经过 (x)。 因此，使用该边从 (u) 通过某个路径可到达的目的地 (v) 满足

 [
 \运算符名称{距离}(u,x)+\运算符名称{距离}(x,v)\le f_u.
 ]

 我们可以从每个选定的端点 (x) 运行普通的 BFS，按照与 (x) 的距离的非递减顺序存储所有顶点，并使用完全相同的指针思想。 最多有 (51) 个这样的 BFS 运行。 这是参考解决方案中使用的质心分解思想的稀疏图扩展。 

重要的简化是我们从不构建密集总线图。 质心结构和少数 BFS 结构隐式地代表了所有有用的转换。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(T_{\max}n^2\log n)) | (O(n^2)) | 太慢了|
 | 最佳 | (O(n\log n+(m-n+1)n)) 每两个端点运行 | (O(n\log n+(m-n+1)n)) | 已接受 |

 由于 (m-n+1\le51)，最佳复杂度实际上是 (O(n\log n+51n))。 

## 算法演练

1. 构建高速公路图的任意生成树。 树中未选择的每条边称为额外边。 由于图是连通的且 (m\le n+50)，因此最多有 (51) 条额外边。 
2. 对于每条额外边 ((u,v))，选择一个端点，例如 (u)。 可以删除重复的选定端点，因为来自同一端点的一个 BFS 已经处理通过该端点的每条路径。 
3. 构建生成树的质心分解。 在每个质心 (x) 处，收集其当前组件中的所有顶点，并以非递减顺序存储它们距 (x) 的树距离。 
4. 在构建质心分解时，存储每个顶点 (u) 在每个分解级别的质心及其到该质心的距离。 这使得 Dijkstra 查询无需 LCA 计算即可获取 (\operatorname{dist}_{tree}(u,x))。 
5. 对于每个选定的额外边端点 (x)，在原始图中运行 BFS。 存储 BFS 阶数以及从 (x) 到每个顶点的距离。 BFS 自然地以非递减距离顺序生成顶点。 
6. 固定一天 (T)，最初 (T=1)。 定义车站(i)的票价为

 [
 a_i=c_i+(T-1)w_i。 
]

 运行下面描述的隐式 Dijkstra。 
7. 设置（d_1=0）。 优先级队列最初包含具有密钥 (a_1) 的站 (1)。 对于其他每个站点，其距离最初都是未知的。 
8. 当站(u)被弹出时，其优先键为

 [
 p=d_u+a_u。 
]

 从 (u) 出发乘坐一趟巴士可以到达的每个车站都可以接收距离 (p)。 
9. 处理(u)的每个质心层。 设 (x) 为该层的质心，并设 (r=d_{tree}(u,x))。 质心列表中的每个顶点 (v)

 [
 d_{树}(x,v)\le f_u-r
 ]

 是有效的树距离候选者。 使用指针使用排序列表的前缀。 
10. 处理每个选定的额外边缘端点 (x)。 让(r=d_G(u,x))。 在 (x) 的 BFS 列表中，消耗每个尚未处理的顶点 (v) 满足

 [
 d_G(x,v)\le f_u-r。 
]

 这样的顶点可以在 (f_u) 条高速公路内从 (u) 到达。 
11. 每当找到未访问的顶点 (v) 时，设置

 [
 d_v=p
 ]

 并将((d_v+a_v,v))插入优先级队列。 一个顶点仅插入一次。 
12. 重复此操作，直到优先级队列为空。 由此产生的距离是该固定日期的最低成本。 
13. 对 (T=T_{\max}) 运行相同的过程。 对于每个目的地，独立地取两个结果中较小的一个。 

### 为什么它有效

 不变的是，当第一次为站 (v) 分配距离时，该分配已经是最佳的。 优先级队列按 (d_u+a_u) 对车站进行排序，这正是 (u) 赋予其总线半径内每个目的地的值。 任何可以改进 (v) 的未来路线都必须源自其自身值不大于该替代值的站点，因此该站点将首先被处理。 因此第一个任务是 Dijkstra 式的最终距离。 

对于树部分，仅使用生成树边的每条路径都有其确切的树距离。 质心分解找到与 (u) 的树距离最大为 (f_u) 的每个顶点。 使用 (d(u,x)+d(x,v)) 的条件有时可能比实际树距离更强，但它从不接受无效顶点，因为它只限制有效树路由的上限。 

对于额外边部分，采用使用非树边的任何最短路径。 该路径包含该边的两个端点，包括选择用于预处理的端点。 因此，对于选定的端点 (x)，

 [
 d_G(u,x)+d_G(x,v)=d_G(u,v)。 
]

 (x) 的 BFS 结构因此找到其最短路线使用该额外边的每个目的地。 由于每条路径要么仅使用树边，要么至少使用一个额外的边，因此表示每个有效的总线转换。 

最后，每条路线在 (T) 中都有线性成本，因此其最佳日期是 (1) 或 (T_{\max})。 取两个固定日最短路径结果中的最小值给出全局最优答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from array import array
from collections import deque
import heapq

def solve():
    input = sys.stdin.readline

    n, m, tmax = map(int, input().split())

    f = [0] * (n + 1)
    c = [0] * (n + 1)
    w = [0] * (n + 1)

    for i in range(1, n + 1):
        f[i], c[i], w[i] = map(int, input().split())

    graph = [[] for _ in range(n + 1)]
    tree = [[] for _ in range(n + 1)]

    dsu = list(range(n + 1))
    dsu_size = [1] * (n + 1)

    def find(x):
        while dsu[x] != x:
            dsu[x] = dsu[dsu[x]]
            x = dsu[x]
        return x

    extra_sources = []
    seen_extra = bytearray(n + 1)

    for _ in range(m):
        u, v = map(int, input().split())
        graph[u].append(v)
        graph[v].append(u)

        ru = find(u)
        rv = find(v)

        if ru != rv:
            if dsu_size[ru] < dsu_size[rv]:
                ru, rv = rv, ru
            dsu[rv] = ru
            dsu_size[ru] += dsu_size[rv]

            tree[u].append(v)
            tree[v].append(u)
        else:
            if not seen_extra[u]:
                seen_extra[u] = 1
                extra_sources.append(u)

    del dsu
    del dsu_size
    del seen_extra

    # Centroid decomposition of the spanning tree.
    #
    # At every decomposition level, center[level][v] is the centroid
    # of v's current component, and cd_dist[level][v] is the tree
    # distance from v to that centroid.
    levels = n.bit_length() + 1

    center = [
        array('i', [0]) * (n + 1)
        for _ in range(levels)
    ]
    cd_dist = [
        array('i', [0]) * (n + 1)
        for _ in range(levels)
    ]

    # For every centroid x:
    # vec_v[x] is the vertices in its component in BFS order.
    # vec_d[x] contains their distances from x in the same order.
    vec_v = [None] * (n + 1)
    vec_d = [None] * (n + 1)

    removed = bytearray(n + 1)
    temp_parent = array('i', [0]) * (n + 1)
    subtree_size = array('i', [0]) * (n + 1)

    tasks = [(1, 0)]
    while tasks:
        start, level = tasks.pop()

        # Collect this component.
        order = []
        stack = [start]
        temp_parent[start] = 0

        while stack:
            u = stack.pop()
            order.append(u)

            pu = temp_parent[u]
            for v in tree[u]:
                if removed[v] or v == pu:
                    continue
                temp_parent[v] = u
                stack.append(v)

        total = len(order)

        # Compute subtree sizes with respect to the temporary root.
        for u in reversed(order):
            s = 1
            for v in tree[u]:
                if removed[v]:
                    continue
                if temp_parent[v] == u:
                    s += subtree_size[v]
            subtree_size[u] = s

        # Find a centroid.
        centroid = start
        best = total + 1

        for u in order:
            largest = total - subtree_size[u]

            for v in tree[u]:
                if removed[v]:
                    continue
                if temp_parent[v] == u and subtree_size[v] > largest:
                    largest = subtree_size[v]

            if largest < best:
                best = largest
                centroid = u

        # BFS from the centroid inside this component.
        vv = array('i')
        dd = array('i')

        q = deque([centroid])
        temp_parent[centroid] = 0
        center[level][centroid] = centroid
        cd_dist[level][centroid] = 0

        while q:
            u = q.popleft()
            du = cd_dist[level][u]

            vv.append(u)
            dd.append(du)

            for v in tree[u]:
                if removed[v] or v == temp_parent[u]:
                    continue

                temp_parent[v] = u
                center[level][v] = centroid
                cd_dist[level][v] = du + 1
                q.append(v)

        vec_v[centroid] = vv
        vec_d[centroid] = dd

        removed[centroid] = 1

        # After removing the centroid, each remaining neighbor starts
        # an independent component.
        next_level = level + 1
        for v in tree[centroid]:
            if not removed[v]:
                tasks.append((v, next_level))

    del removed
    del temp_parent
    del subtree_size

    # For each selected endpoint of an extra edge, run BFS in the
    # original graph. BFS order is already sorted by distance.
    key_vertices = []
    key_distances = []

    for source in extra_sources:
        dist = array('i', [-1]) * (n + 1)
        vertices = array('i')

        dist[source] = 0
        q = deque([source])

        while q:
            u = q.popleft()
            vertices.append(u)

            nd = dist[u] + 1
            for v in graph[u]:
                if dist[v] == -1:
                    dist[v] = nd
                    q.append(v)

        key_distances.append(dist)
        key_vertices.append(vertices)

    key_count = len(key_vertices)

    # Bits needed to encode a vertex are no longer needed here because
    # centroid vertices and distances are stored separately.
    def dijkstra(day_offset, best_answer):
        cost = [0] * (n + 1)
        for i in range(1, n + 1):
            cost[i] = c[i] + w[i] * day_offset

        dis = [-1] * (n + 1)
        dis[1] = 0

        # Each centroid list is consumed monotonically.
        ptr = [0] * (n + 1)

        # Each extra-edge BFS list is also consumed monotonically.
        ptr_key = [0] * key_count

        heap = [(cost[1], 1)]

        while heap:
            p, u = heapq.heappop(heap)

            # p = dis[u] + cost[u].
            if best_answer[u] > dis[u]:
                best_answer[u] = dis[u]

            fu = f[u]

            # Tree-distance transitions through centroid decomposition.
            for level in range(levels):
                x = center[level][u]
                if x == 0:
                    break

                remaining = fu - cd_dist[level][u]
                if remaining < 0:
                    continue

                vv = vec_v[x]
                dd = vec_d[x]

                j = ptr[x]
                size_v = len(vv)

                while j < size_v and dd[j] <= remaining:
                    v = vv[j]

                    if dis[v] == -1:
                        dis[v] = p
                        heapq.heappush(
                            heap,
                            (p + cost[v], v)
                        )

                    j += 1

                ptr[x] = j

            # Transitions whose route uses at least one non-tree edge.
            for z in range(key_count):
                kd = key_distances[z]
                kv = key_vertices[z]

                remaining = fu - kd[u]
                if remaining < 0:
                    continue

                j = ptr_key[z]
                size_v = len(kv)

                while j < size_v and kd[kv[j]] <= remaining:
                    v = kv[j]

                    if dis[v] == -1:
                        dis[v] = p
                        heapq.heappush(
                            heap,
                            (p + cost[v], v)
                        )

                    j += 1

                ptr_key[z] = j

        return best_answer

    INF = 10**30
    answer = [INF] * (n + 1)

    dijkstra(0, answer)

    if tmax > 1:
        dijkstra(tmax - 1, answer)

    sys.stdout.write(
        '\n'.join(str(answer[i]) for i in range(1, n + 1))
    )

if __name__ == "__main__":
    solve()
```输入阶段存储完整的图，因为额外边缘的 BFS 运行需要原始的高速公路。 同时，DSU选择生成树。 每条被拒绝的边都是一条额外的边，最多可以有 (m-n+1\le51) 条。 

质心预处理是迭代的而不是递归的。 这避免了Python的递归限制，也避免了维护一个大的递归调用堆栈。 对于每个质心分量，临时 DFS 确定子树大小并识别质心，然后 BFS 以非递减距离顺序记录顶点。 

这`array`模块是故意使用的。 包含数百万个 Python 整数的 Python 列表比压缩整数数组消耗更多的内存。 质心距离结构包含 (O(n\log n)) 个整数，而边外 BFS 结构包含 (O(51n)) 个整数。 打包数组将这些结构保持在内存预算之内。 

两个质心数组按分解级别进行索引。 对于顶点 (u)，`center[level][u]`给出相关质心和`cd_dist[level][u]`给出到它的距离。 这取代了典型 C++ 实现所使用的 LCA 和稀疏表，同时保留每个质心查询 (O(\log n))。 

每次 Dijkstra 运行都会重置指针数组。 指针永远不会向后移动。 在以后的查询中较小的半径是无害的，因为指针之前的每个条目都已经被检查过，并且检查时仍未访问的任何顶点都已经收到了其最佳 Dijkstra 距离。 

优先级队列存储`dis[u] + cost[u]`，而不仅仅是`dis[u]`。 这个值正是在(u)处再购买一张票后获得的成本。 由于从 (u) 出发的所有传出巴士转换都具有相同的价格，因此从 (u) 发现的每个目的地都会获得相同的候选目的地。 更重要的是，每个顶点仅在第一次发现时分配，因此仅发生 (O(n)) 堆插入。 

表达式`c[i] + w[i] * day_offset`使用从零开始的日偏移量。 天 (1) 对应于偏移量 (0)，天 (T_{\max}) 对应于偏移量 (T_{\max}-1)。 这是实现中主要的一对一细节。 

Python 整数不会溢出，因此即使数学值远大于 32 位整数，涉及 (w_i) 的中间乘法也是安全的。 该问题保证了实际票价保持在规定的范围内。 

## 工作示例

 ### 示例 1

 输入是```
6 6 2
1 50 -40
1 2 100
2 1 100
2 4 100
3 1 100
1 1 100
1 2
2 3
3 4
4 2
2 5
6 1
```第 (1) 天的票价为 (50,2,1,2,1,1)。 重要的 Dijkstra 状态是：

 | 日 | 弹出站 | 当前键 (p) | 新到达车站 | 最终距离受影响 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 50 | 50 2, 6 | (d_2=50,\d_6=50) |
 | 1 | 6 | 51 | 51 无 | 不变|
 | 1 | 2 | 52 | 52 3, 5 | (d_3=52,\d_5=52) |
 | 1 | 3 | 53 | 53 4 | (d_4=52) |
 | 1 | 5 | 53 | 53 无 | 不变|
 | 1 | 4 | 54 | 54 无 | 不变|

 目的地的最终成本为 (0,50,52,52,52,50)。 

对于第 (2) 天，票价变为 (10,102,101,102,101,101)：

 | 日 | 弹出站 | 当前键 (p) | 新到达车站 | 最终距离受影响 |
 | --- | --- | --- | --- | --- |
 | 2 | 1 | 10 | 10 2, 6 | (d_2=10,\d_6=10) |
 | 2 | 2 | 112 | 112 3, 5 | (d_3=112,\d_5=112) |
 | 2 | 6 | 111 | 111 无 | 不变|
 | 2 | 3 | 213 | 213 4 | (d_4=11​​2) |

 取这两天较小的结果得出```
0
10
52
52
52
10
```该跟踪还说明了为什么优先级队列键是`distance + current ticket cost`。 例如，在第(1)天以距离(50)到达站(2)，其外出转移键为(50+2=52)。 

### 示例 2

 考虑以下构造的情况：```
3 2 3
2 10 -4
1 100 0
1 100 0
1 2
2 3
```站 (1) 的半径为 (2)，因此可以直接到达其他两个站。 

| 日 | 票价1| 弹出站 | 关键（p）| 新到达车站 |
 | --- | --- | --- | --- | --- |
 | 1 | 10 | 10 1 | 10 | 10 2, 3 |
 | 1 | 10 | 10 2 | 110 | 110 无 |
 | 1 | 10 | 10 3 | 110 | 110 无 |
 | 3 | 2 | 1 | 2 | 2, 3 |
 | 3 | 2 | 2 | 102 | 102 无 |
 | 3 | 2 | 3 | 102 | 102 无 |

 最终的答案是```
0
2
2
```此跟踪确认了端点参数。 即使票价随日期变化，也永远不需要中间日期。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\log n + Kn)) | 质心预处理成本 (O(n\log n))，(K\le51) 边外 BFS 运行成本 (O(Kn))，两个 Dijkstra 运行中的每一个执行 (O(n\log n+Kn)) 工作 |
 | 空间| (O(n\log n+Kn)) | 质心列表包含 (O(n\log n)) 条目，边外距离结构包含 (O(Kn)) 条目 |

 这里 (K\le m-n+1\le51)。 对于 (n\le200000)，额外边部分由大约 (10.2) 万个顶点距离条目界定，而质心分解仅贡献 (O(n\log n)) 个条目。 两个 Dijkstra 运行是唯一依赖于日期参数的部分，而且只有两个。 这是问题的预期稀疏图复杂性。 

## 测试用例

 以下测试称为`solve()`从上面的解决方案中可以得到函数。 帮助器替换标准输入并捕获标准输出。```python
import sys
import io

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

# Provided sample
assert run("""\
6 6 2
1 50 -40
1 2 100
2 1 100
2 4 100
3 1 100
1 1 100
1 2
2 3
3 4
4 2
2 5
6 1
""") == """\
0
10
52
52
52
10""", "sample 1"

# Minimum-size graph.
assert run("""\
1 0 3
1 10 -5
""") == """\
0""", "single station"

# Negative w_i makes the last day optimal.
assert run("""\
2 1 3
1 10 -4
1 1 0
1 2
""") == """\
0
2""", "last-day optimum"

# All values equal, plus an extra edge creating a shortcut.
assert run("""\
3 3 1
1 3 0
1 3 0
1 3 0
1 2
2 3
1 3
""") == """\
0
3
3""", "extra-edge shortcut"

# Maximum n, a tree, f_i = 1 exactly at the radius boundary.
n = 200000
stations = "1 1 0\n" * n
edges = "\n".join(f"{i} {i + 1}" for i in range(1, n))

max_case = f"{n} {n - 1} 1\n" + stations + edges + "\n"
max_expected = "".join(f"{i}\n" for i in range(n))

assert run(max_case) == max_expected, "maximum-size chain"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | (n=1,m=0) | (n=1,m=0)`0`| 出发站无需门票|
 | 两个站 (w_1<0) |`0, 2`| 最佳日期可以是 (T_{\max}) |
 | 等值三角形|`0, 3, 3`| 超边最短路径和等票参数 |
 | (n=200000) 路径 (f_i=1) |`0,1,2,...,199999`| 最大输入尺寸和精确半径边界 |

 ## 边缘情况

 ### 起始站

 对于```
1 0 3
1 10 -5
```质心结构仅包含站 (1)。 迪杰斯特拉开始于`dis[1] = 0`，并且自我目的地已经确定。 最终输出是`0`。 无需进行总线转换。 

### 最后一天最佳值

 对于```
2 1 3
1 10 -4
1 1 0
1 2
```第一条 Dijkstra 线路在 (1) 站使用票价 (10)。 第二轮使用票价

 [
 10+(3-1)(-4)=2。 
]

 第二次运行时以成本 (2) 到达目的地，因此最终输出为`0, 2`。 这正是通过评估两个终点日处理的情况。 

### 非树快捷方式

 对于```
3 3 1
1 3 0
1 3 0
1 3 0
1 2
2 3
1 3
```假设生成树包含(1-2)和(2-3)。 从 (1) 到 (3) 的树距离为 (2)，位于站 (1) 半径之外。 边(1-3)是额外的，因此站点(1)成为特殊的BFS源之一。 其到(3)的BFS距离为(1)，满足(f_1=1)。 因此，额外边缘结构将距离 (3) 分配给站 (3)，给出`0, 3, 3`。 

### 精确半径

 对于```
3 2 1
2 7 0
1 100 0
1 100 0
1 2
2 3
```从站 (1) 到站 (3) 的树距离恰好为 (2)。 质心查询时，条件为`distance <= remaining`，不是严格的不等式。 由于 (2\le f_1=2)，到达站 (3) 的成本为 (7)。 输出是`0, 7, 7`。 

BFS 结构中使用相同的包含比较来获取额外的边。 必须始终处理恰好位于总线半径边界上的目的地。 

如果您愿意，我还可以提供一个较短的竞赛编辑版本，重点关注两个关键思想，或者 Python 实现的逐行推导。
