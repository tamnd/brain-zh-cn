---
title: "CF 102471K - 所有配对最大流量"
description: "该图是在一个凸多边形内部绘制的，该多边形的顶点是循环编号的。 每个多边形边都存在，并且可以添加额外的对角线，但除了公共端点之外，对角线永远不会交叉。 每条边都有一个非负容量。"
date: "2026-08-09T18:51:34+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102471
codeforces_index: "K"
codeforces_contest_name: "2019 ICPC Asia-East Continent Final"
rating: 0
weight: 102471
solve_time_s: 530
verified: true
draft: false
---

[CF 102471K - 所有对最大流量](https://codeforces.com/problemset/problem/102471/K)

 **评级：** -
 **标签：** -
 **求解时间：** 8m 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该图是在一个凸多边形内部绘制的，该多边形的顶点是循环编号的。 每个多边形边都存在，并且可以添加额外的对角线，但除了公共端点之外，对角线永远不会交叉。 每条边都有一个非负容量。 

对于每对顶点 (s,t)，我们需要最大 (s)-(t) 流的值，该值与 (s)-(t) 割的最小容量相同。 所需的输出是所有无序顶点对上的这些值的总和，并以模 (998244353) 进行缩减。 原始问题有 (n\le 200000) 和 (m\le 400000)，每个多边形边都存在。 

这些限制立即排除了每对独立做任何事情的可能性。 有

 [
 \frac{n(n-1)}2
 ]

 对，当 (n=200000) 时，几乎是 (2\cdot 10^{10})。 即使每对只花费 (O(m)) 时间的操作也已经需要大约 (8\cdot10^{15}) 次边缘检查。 真正的最大流算法比简单地扫描边缘要昂贵得多，因此解决方案必须全局利用平面结构。 

有几种边缘情况很容易被错误处理。 最小的图形是三角形。 具有容量一的三个边缘，```
3 3
1 2 1
2 3 1
3 1 1
```答案是`6`， 不是`3`。 每对都有两个流量单位，因为直接边缘和双边缘替代路径都可以承载流量。 

零容量也是合法的。 为了```
3 3
1 2 0
2 3 1
3 1 2
```答案是`4`。 零容量边缘不会使每对都断开连接。 例如，顶点 (1) 和 (3) 之间的最大流仍然是 (2)，因为由入射到顶点 (1) 的两条边组成的割具有容量 (2)。 

大容量需要在取最终模数之前进行 64 位算术。 为了```
3 3
1 2 1000000000
2 3 1000000000
3 1 1000000000
```每对都有流量 (2000000000)，因此未修改的答案是 (6000000000)。 所需的输出是`10533882`。 

最后，在构造平面结构时，边缘((1,n))需要特殊处理。 它跨越了顶点编号的循环边界，因此仅将所有边视为间隔 ([u,v]) 而不分离该边会导致不正确的嵌套结构。 

## 方法

 蛮力方法在概念上很简单。 对于每一对 (s,t)，运行最大流算法并将其结果添加到答案中。 根据最大流最小割定理，这是正确的，但有 (n(n-1)/2) 次调用。 在 (n=200000) 处，这正好是 (19999900000) 次最大流量计算。 即使每次计算神奇地只需要 (O(m))，总数也将约为 (8\cdot10^{15}) 次基本边缘检查。 真正的最大流量计算会使情况变得更糟。 

有用的观察来自平面嵌入。 考虑当前位于无界区域边界上的边 (e)，并假设它在所有此类边界边中具有最小容量。 令(C) 为包含(e) 的最小循环。 我们可以删除 (e)，将其容量添加到 (C) 的所有其他边，并保留每对最小割。 这是用于解决该问题的中心归约。 

为什么这有效？ 在平面图中，两个顶点之间的切割可以由在两个端点处分割无界面之后平面对偶中的路径来表示。 包围有界区域的环 (C) 不能被这样的双路径恰好穿过一次。 如果最佳切割与 (C) 相互作用，则可以使用 (e) 和 (C) 的另一条边来表示。 由于 (e) 是当前暴露的最便宜的边界边缘，因此用 (e) 替换暴露的交叉点不会增加切割值。 

假设(e)的当前容量为(w)。 删除 (e) 会更改使用 (e) 的剪切 (-w)。 每当切割使用 (C) 的另一条边时，将 (w) 添加到 (C) 的所有其他边即可精确补偿。 避免 (C) 的削减保持不变。 相反，当需要获得原始图中不具有更大值的切割时，修改图中的任何切割都可以用（e）进行扩展。 因此，每个成对最小割保持不变。 

我们可以重复这个操作，直到只剩下 (n-1) 条边。 该图是一棵树，两个顶点之间的最大流量只是其唯一路径上的最小边容量。 原来的全对问题已简化为树瓶颈问题。 

剩下的挑战是有效地找到合适的周期。 直接模拟需要维持平面图不断变化的外边界。 更清晰的表示使用从非交叉对角线派生的树。 对角线按左端点递减和右端点递增排序。 表示当前边界的有序结构告诉我们哪条前一条边属于每个对角线创建的新面。 这会生成一棵具有 (m+1) 个节点的树，其中每个原始图边对应于一个树边。 

下面的实现使用 Fenwick 树而不是有序映射。 活动边界块按其多边形位置存储。 对于对角线 ((l,r))，([l,r)) 中的所有活动位置都成为该对角线的子项，然后将该对角线插入到位置 (l)。 由于每个活动位置仅在成为子位置时才会被删除，因此此类删除的总数是线性的。 每个 Fenwick 操作的成本为 (O(\log n))。 

一旦该辅助树存在，就从最小可用容量向上处理其叶子。 当面暴露时，其选定的边将被删除，并且其容量将传播到其他入射边。 优先级队列维护下一个候选边缘。 每个辅助树边最多进入队列一次，因此总处理成本为 (O(m\log m))。 这与该问题的标准解决方案方法所描述的减少相同。

最后，幸存的（n-1）条原始边形成一棵树。 按转换后的容量降序对它们进行排序。 最初，每个原始顶点都是一个单独的 DSU 组件。 当权重 (w) 的边连接大小 (a) 和 (b) 的分量时，恰好 (ab) 个顶点对在阈值 (w) 处首次连接，因此 (w\cdot a\cdot b) 被添加到答案中。 这是通常的 Kruskal 瓶颈计数参数的降序版本。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 至少 (O(n^2m)) 次边缘检查，更多的是实际最大流量 | (O(n+m)) | 太慢了|
 | 最佳| (O(m\log m+n\log n)) | (O(n+m)) | 已接受 |

 ## 算法演练

 1. 读取所有边并将多边形边与对角线分开。 每条边 ((i,i+1)) 由其位置 (i) 表示，而特殊边 ((1,n)) 由位置 (n) 表示。 每隔一条边都是对角线 ((l,r))，其中 (l<r)。 
2. 通过递减 (l) 对所有对角线进行排序，通过递增 (r) 打破平局。 此顺序遵循非交叉对角线的嵌套结构。 后面的对角线只能与位于其间隔内的当前暴露的边界块相互作用。 
3. 为每个当前暴露的多边形位置保留一条活动边。 芬威克树存储哪些位置处于活动状态，而`edge_at[pos]`告诉我们哪条原始边占据了该位置。 对于对角线 ((l,r))，重复查找 ([l,r)) 中的第一个活动位置。 将该边的辅助树父级分配给对角线，并从活动集中删除该位置。 
4. 删除 ([l,r)) 中的所有活动位置后，在位置 (l) 处插入对角线本身。 这通过单个代表性边界位置来表示新创建的面。 由于该图是非交叉的，因此生成的父关系形成一棵树。 
5. 处理完所有对角线后，将每个仍然活动的边界边连接到单个根节点 (m+1)。 每个原始边 (i) 现在对应于节点 (i) 和节点之间的辅助树边`fa[i]`。 
6. 最初，辅助树的每个叶子都代表一个面，该面恰好有一个边界边通向其父代。 将所有这些边放入最小堆中，并将相应的叶子标记为已暴露。 堆键是当前与该边界边缘关联的容量。 
7. 删除最小的堆条目。 如果该辅助边的另一个端点已经暴露，则该边已成为已处理边界的一部分，因此将当前值添加到其变换后的权重中。 
8. 否则，暴露另一个端点。 用于暴露它的边将从转换后的图中删除，因此用非常负的哨兵标记其转换后的权重。 然后将用于暴露面部的容量添加到每个其他事件辅助树边缘。 如果相邻的面尚未暴露，则将该边推入具有新增加的容量的堆中。 
9. 继续，直到堆为空。 每条标有非负变换权重的原始边都是最终树的 (n-1) 条边之一。 每条删除的边都有负哨兵。 
10. 根据变换后的权重以降序对幸存边进行排序。 使用每个原始图顶点的一个组件初始化 DSU。 对于权重为 (w) 的每个树边 ((u,v))，找到包含其端点的两个当前分量。 如果它们的大小为 (a) 和 (b)，则将 (wab) 添加到答案中并合并组件。 
11. 将累积答案模（998244353）减少并打印。 

整个算法背后的不变性是每次变换都保留每对原始顶点之间的最小割。 循环操作保留每个切割值，因此在所有删除之后，最终的树具有与原始图完全相同的成对最大流值。 在树上，一对的值是其唯一路径上的最小边。 降序 DSU 处理精确地将路径最小值为当前边权重的对分组，因此每对只贡献一次。 这就证明最终的总和就是所要求的所有最大流量之和。 

## Python 解决方案```python
import sys
import heapq
from array import array

input = sys.stdin.readline

MOD = 998244353
NEG = -(10 ** 18)

def solve():
    n, m = map(int, input().split())

    # Original endpoints and capacities.
    eu = array('i', [0]) * (m + 1)
    ev = array('i', [0]) * (m + 1)
    cap = array('q', [0]) * (m + 1)

    # fa[i] is the parent of auxiliary-tree node i.
    fa = array('i', [0]) * (m + 2)

    # Active boundary position -> original edge id.
    edge_at = array('i', [0]) * (n + 1)

    diagonals = []

    for eid in range(1, m + 1):
        u, v, w = map(int, input().split())
        if u > v:
            u, v = v, u

        eu[eid] = u
        ev[eid] = v
        cap[eid] = w

        if v == u + 1:
            edge_at[u] = eid
        elif u == 1 and v == n:
            edge_at[n] = eid
        else:
            diagonals.append((u, v, eid))

    # Fenwick tree containing 1 exactly at active positions.
    bit = array('i', [0]) * (n + 1)
    for i in range(1, n + 1):
        bit[i] = i & -i

    def bit_add(i, delta):
        while i <= n:
            bit[i] += delta
            i += i & -i

    def bit_sum(i):
        s = 0
        while i > 0:
            s += bit[i]
            i -= i & -i
        return s

    def bit_kth(k):
        """Return the position of the k-th active point, 1-indexed."""
        pos = 0
        step = 1 << (n.bit_length() - 1)
        while step:
            nxt = pos + step
            if nxt <= n and bit[nxt] < k:
                k -= bit[nxt]
                pos = nxt
            step >>= 1
        return pos + 1

    # The nesting order of noncrossing diagonals.
    diagonals.sort(key=lambda x: (-x[0], x[1]))

    for l, r, eid in diagonals:
        before = bit_sum(l - 1)
        right = bit_sum(r - 1)

        # Every active position in [l, r) becomes a child of eid.
        while before < right:
            pos = bit_kth(before + 1)
            old_edge = edge_at[pos]

            fa[old_edge] = eid
            edge_at[pos] = 0
            bit_add(pos, -1)

            right -= 1

        # The new diagonal becomes the representative of this face.
        edge_at[l] = eid
        bit_add(l, 1)

    root = m + 1

    # Remaining active boundary pieces belong to the outer root.
    for pos in range(1, n + 1):
        eid = edge_at[pos]
        if eid:
            fa[eid] = root

    # The auxiliary tree is represented by parent -> children links.
    head = array('i', [-1]) * (m + 2)
    nxt = array('i', [-1]) * (m + 1)

    for eid in range(1, m + 1):
        p = fa[eid]
        nxt[eid] = head[p]
        head[p] = eid

    # nw[i] is the final transformed weight of original edge i.
    nw = array('q', [0]) * (m + 1)
    vis = bytearray(m + 2)

    heap = []

    # Every non-root leaf is initially an exposed face.
    for i in range(1, m + 1):
        if head[i] == -1:
            heapq.heappush(heap, (cap[i], i, fa[i]))
            vis[i] = 1

    while heap:
        cur, u, v = heapq.heappop(heap)

        if vis[v]:
            # Both sides are already exposed. The edge contributes
            # its current value to its transformed weight.
            nw[u] += cur
            continue

        # Expose face v through auxiliary edge u-v.
        vis[v] = 1
        nw[u] = NEG

        # The parent side of v is another incident edge.
        p = fa[v]
        if p != 0:
            if vis[p]:
                nw[v] += cur
            else:
                heapq.heappush(heap, (cur + cap[v], v, p))

        # Process all child sides of v except the edge we arrived through.
        c = head[v]
        while c != -1:
            if c != u:
                if vis[c]:
                    nw[c] += cur
                else:
                    heapq.heappush(heap, (cur + cap[c], v, c))
            c = nxt[c]

    # The non-deleted edges form the final tree.
    tree_edges = []
    for eid in range(1, m + 1):
        if nw[eid] >= 0:
            tree_edges.append((nw[eid], eu[eid], ev[eid]))

    tree_edges.sort(reverse=True)

    # Descending Kruskal on the final tree.
    parent = array('i', range(n + 1))
    size = array('i', [1]) * (n + 1)

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    ans = 0

    for w, u, v in tree_edges:
        ru = find(u)
        rv = find(v)

        if ru == rv:
            continue

        if size[ru] < size[rv]:
            ru, rv = rv, ru

        ans = (
            ans
            + (w % MOD) * (size[ru] % MOD) % MOD
            * (size[rv] % MOD)
        ) % MOD

        parent[rv] = ru
        size[ru] += size[rv]

    print(ans % MOD)

if __name__ == "__main__":
    solve()
```第一部分将每个原始边存储在紧凑整数数组中。 包含数十万个 Python 整数的 Python 列表会消耗大量内存，因此`array`和`bytearray`用于大型数值结构。 

对角线结构使用 Fenwick 树作为有序集。`bit_sum(r-1)-bit_sum(l-1)`告诉我们 ([l,r)) 中有多少个活跃边界代表。`bit_kth`找到第一个位置，然后删除该位置。 每次删除仅发生一次，因此尽管每个单独操作的成本为 (O(\log n))，但删除总数是线性的。 

辅助树使用`head`和`nxt`而不是 Python 元组列表。 节点 (i) 有父节点`fa[i]`， 和`head[v]`给出 (v) 的第一个孩子。 这种表示方式就足够了，因为树的根部是人工外表面节点。 

堆存储`(current_capacity, child, parent)`。 仅当辅助边缘的一侧暴露而另一侧未暴露时才插入候选。 因此，每个辅助边最多创建一个堆条目。 当处理一个条目时，`vis[v]`告诉我们另一张脸是否已经暴露。 

负哨兵故意比任何可能的转换容量小得多。 每个原始容量最多为 (10^9)，并且最多有 (4\cdot10^5) 个添加，因此每个有效的转换容量都低于 (4\cdot10^{14})。`-10**18`因此可以安全地与所有有效值分开。 

最终的 DSU 按降序处理边。 由于幸存图是一棵树，因此在处理该边时，每个幸存边的端点位于不同的 DSU 组件中。 它们的组件大小的乘积精确地计算了路径首先在此边的阈值处连接的对。 

Python 整数不会溢出，但存储容量的数组使用有符号 64 位整数。 最大可能的转换容量正好在该范围内。 每次 DSU 贡献后，答案都会以模 (998244353) 减少。 

## 工作示例

 ### 示例 1

 该示例有六个多边形顶点和两条对角线。 对角线间隔为 ((1,4)) 和 ((1,5))，因此辅助树构造给出以下父关系：

 [
 1,2,3\rightarrow7,\qquad
 7,4\rightarrow8,\qquad
 8,5,6\右箭头9。 
]

 这里节点（1）到（6）代表多边形边，节点（7）和（8）代表两条对角线，节点（9）是人工外根。 

重要的处理状态是：

 | 步骤| 堆边缘值 | 暴露节点| 重要的变换权重 |
 | --- | --- | --- | --- |
 | 1 | 1 | 7 | (w_2=1,\w_3=1,\w_1=-\infty) |
 | 2 | 10 | 10 7 已曝光 | (w_2=11) | (w_2=11) |
 | 3 | 100 | 100 7 已曝光 | (w_3=101) | (w_3=101)
 | 4 | 1000 | 1000 8 | (w_4=-\infty,\w_7=1000) |
 | 5 | 10000 | 9 | (w_5=-\infty,\ w_6=10000,\ w_8=10000) |
 | 6 | 100000 | 9 已曝光 | (w_6=110000) |
 | 7 | 1000001 | 8 已曝光 | （w_7=1001001）|
 | 8 | 10001000 | 9 已曝光 | (w_8=10011000) |

 因此，幸存的边是：

 | 边缘 | 端点 | 改造后的产能 |
 | --- | --- | --- |
 | 2 | (2,3) | 11 | 11
 | 3 | (3,4) | 101 | 101
 | 6 | (6,1) | 110000 |
 | 7 | (1,4) | 1001001 |
 | 8 | (1,5) | 10011000 |

 降序 DSU 计算为：

 | 重量 | 元件尺寸| 结对贡献 |
 | --- | --- | --- |
 | 10011000 | (1\cdot1) | 10011000 |
 | 1001001 | (2\cdot1) | 2002002 |
 | 110000 | (3\cdot1) | 330000 |
 | 101 | 101 (4\cdot1) | 404 | 404
 | 11 | 11 (5\cdot1) | 55 | 55

 总和是

 [
 10011000+2002002+330000+404+55
 =12343461。 
]

 这证明了完全的简化：复杂的平面图变成了五边树，其瓶颈值对每个原始成对最大流进行编码。 官方示例具有相同的输出。 

### 自定义三角形

 考虑```
3 3
1 2 1
2 3 1
3 1 1
```没有对角线，因此辅助树只是连接到所有三个多边形边的根。 

| 步骤| 堆值| 暴露节点| 变换后的权重 |
 | --- | --- | --- | --- |
 | 1 | 1 | 根 | (w_1=-\infty,\w_2=1,\w_3=1) |
 | 2 | 1 | 根已经暴露| (w_2=2) | (w_2=2) |
 | 3 | 1 | 根已经暴露 | (w_3=2) | (w_3=2) |

 幸存的树包含容量 (2) 的两条边。 DSU 贡献为 (2\cdot1\cdot1=2) 和 (2\cdot2\cdot1=4)，给出`6`。 

此示例证实循环可以比任何单个边缘提供更多的流量。 这种减少通过增加幸存树的容量来保留额外的连接性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(m\log m+n\log n)) | 对角排序、Fenwick 运算、堆处理和最终边缘排序 |
 | 空间| (O(n+m)) | 原始边、辅助树、Fenwick 树、堆和 DSU |

 输入有 (m\le400000)，因此 (m) 只是大于 (n) 的常数因子。 因此，该算法的行为为 (O(m\log m))，这适合预期的限制。 Python 实现中的大型结构在实用的情况下使用紧凑数组，使内存与图形大小成比例。 

## 测试用例

 以下测试假设`solve()`Python 解决方案部分中的函数可用。```python
import sys
import io

# helper: run solution on input string, return output string
def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
assert run("""\
6 8
1 2 1
2 3 10
3 4 100
4 5 1000
5 6 10000
6 1 100000
1 4 1000000
1 5 10000000
""") == "12343461", "sample"

# Minimum-size graph, all equal capacities.
# Every pair has flow 2, and there are 3 pairs.
assert run("""\
3 3
1 2 1
2 3 1
3 1 1
""") == "6", "minimum triangle"

# Zero capacity boundary edge.
assert run("""\
3 3
1 2 0
2 3 1
3 1 2
""") == "4", "zero capacity"

# A diagonal crossing the cyclic boundary of the numbering structure.
# The graph is a 4-cycle plus diagonal (1,3), all capacities 1.
assert run("""\
4 5
1 2 1
2 3 1
3 4 1
4 1 1
1 3 1
""") == "13", "diagonal and boundary handling"

# Maximum-size graph with all capacities equal to 1.
# It is just a cycle, so every pair has flow 2.
# The answer is n * (n - 1) modulo 998244353.
n = 200000
lines = [f"{n} {n}"]
for i in range(1, n):
    lines.append(f"{i} {i + 1} 1")
lines.append(f"{n} 1 1")

maximum_case = "\n".join(lines) + "\n"
assert run(maximum_case) == "70025880", "maximum-size cycle"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 具有三个单位边的三角形 |`6`| 最小尺寸和循环流量|
 | 容量为 (0,1,2) 的三角形 |`4`| 零产能|
 | 四周期加对角线 (1,3) |`13`| 对角嵌套和循环边界边缘|
 | (n=m=200000) 单位容量循环 |`70025880`| 最大尺寸、相等值和性能 |

 ## 边缘情况

 最小尺寸三角形```
3 3
1 2 1
2 3 1
3 1 1
```从附着在根上的三个辅助叶开始。 第一个叶子节点被删除，另外两个叶子节点接收其容量，使其转换后的容量等于（2）。 生成的树有两条权重为 (2) 的边，因此它的三个顶点对贡献 (2+2+2=6)。 该算法从不假设原始图已经是一棵树。 

零容量情况```
3 3
1 2 0
2 3 1
3 1 2
```首先选择零容量边缘。 它的容量被添加到其他边，因此数值上没有任何变化。 剩下的树具有容量 (1) 和 (2)。 它的成对瓶颈值为 (1,1,2)，给出`4`。 这说明了为什么零必须保持有效的堆值以及为什么删除标记必须为负而不是使用零来表示“已删除”。 

对角线情况```
4 5
1 2 1
2 3 1
3 4 1
4 1 1
1 3 1
```包含循环边界边 ((1,4)) 以及对角线 ((1,3))。 对角线构造将((1,4))视为边界位置(4)，而不是视为从(1)到(4)的普通区间。 生成的变换树保留了所有六个成对流，其总和为`13`。 错误地处理这个单一的环绕边缘会改变辅助树，并可能默默地产生不同的答案。 

最大容量三角形```
3 3
1 2 1000000000
2 3 1000000000
3 1 1000000000
```生成一个具有两条边容量 (2000000000) 的转换树。 未修改的总和为(6000000000)，所需结果为`10533882`。 该实现将容量保留在有符号的 64 位数组中，并执行最终聚合模 (998244353)，因此原始容量和中间转换值都不会溢出。
