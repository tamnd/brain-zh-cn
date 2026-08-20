---
title: "CF 102174G - \u795e\u5723\u7684 F2 \u8fde\u63a5\u7740\u6211\u4eec"
description: "有两个县，每个县包含编号为 (1) 到 (n) 的职位。 同一县内的职位之间没有任何联系。 棱镜是在县之间移动的唯一方式。 棱镜由两个位置间隔和一个行程时间来描述。"
date: "2026-08-19T07:06:36+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102174
codeforces_index: "G"
codeforces_contest_name: "The 14-th BIT Campus Programming Contest"
rating: 0
weight: 102174
solve_time_s: 182
verified: true
draft: false
---

[CF 102174G - \u795e\u5723\u7684 F2 \u8fde\u63a5\u7740\u6211\u4eec](https://codeforces.com/problemset/problem/102174/G)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 有两个县，每个县包含编号为 (1) 到 (n) 的职位。 同一县内的职位之间没有任何联系。 棱镜是在县之间移动的唯一方式。 

棱镜由两个位置间隔和一个行程时间来描述。 如果一个单元当前位于第一个间隔中的任何位置，则它可以在恰好 (w) 时间内跳转到第二个间隔中的任何位置。 跳跃是双向的，因此相同的成本适用于相反的方向。 

(p) 个战斗单位从第一县的位置 (x_1,\ldots,x_p) 开始，而 (q) 个敌方建筑占据第二县的位置 (y_1,\ldots,y_q)。 战斗单位一旦到达任何建筑物就被视为完成。 由于所有单位可以同时移动，因此需要的答案是当每个单位独立选择到达某个敌方建筑物的最快路线时，单位之间的最晚到达时间。 

如果 (d(x,y)) 表示战斗位置 (x) 和建筑物位置 (y) 之间的最短路径距离，则答案为

 [
 \max_{i=1}^{p}\min_{j=1}^{q} d(x_i,y_j)。 
]

 如果即使是一支战斗部队也无法到达任何敌方建筑，答案是`boring game`。 

输入最多包含 (10^5) 个位置、(10^5) 个棱柱、(10^5) 个战斗单位和 (10^5) 个建筑物。 当 (n,m) 都在 (10^5) 左右时，将每个棱镜显式扩展到所有位置对是不可能的。 即使覆盖所有位置的单个棱镜也将代表 (n^2=10^{10}) 对，并且对于 (10^5) 个棱镜，最坏的情况在考虑两个方向之前就达到 (10^{15}) 对。 解决方案需要每个棱镜的大致对数功，而不是间隔大小的线性或二次功。 

有几种容易被忽略的边界情况。 首先，作战单位可能与每座建筑物完全脱节。 例如，```
2 1 1 1
1 1 1 1 4
2
1
```有一个棱柱仅连接每个县的位置（1），而战斗单位从位置（2）开始。 正确的输出是`boring game`。 粗心的实现将无法到达的距离初始化为零，或者简单地取可到达单位的最大值，可能会错误地返回零。 

其次，包括棱镜间隔的两端。 例如，```
4 1 1 1
1 1 4 4 3
1
4
```从位置（1）到位置（4）有一条直接路线，所以答案是`3`。 在线段树分解过程中将区间视为半开会默默地丢失这条路线。 

第三，棱镜是双向的。 例如，```
3 1 1 1
1 1 3 3 5
3
1
```也有答案`5`，即使战斗单位在显示为输入棱镜的第二个端点的间隔中开始。 仅添加列出的方向的实现会产生`boring game`。 

最后，答案是单位最短距离的最大值，而不是全局最短路径。 如果两个单位需要时间（2）和（7），他们同时移动，所以对手在时间（7）投降，而不是时间（9）和时间（2）。 

## 方法

 强力解决方案首先将每个棱柱变成普通的图边。 对于连接 ([a,b]) 到 ([c,d]) 的棱镜，我们将从每个 (x\in[a,b]) 到每个 (y\in[c,d]) 添加一条边，并在相反方向添加另一条边。 该图准确地代表了问题，因此在其上运行多源最短路径算法是正确的。 

问题在于边的数量。 一个棱镜可以在每个方向上创建 ((b-a+1)(d-c+1)) 对。 对于长度为 (n) 的两个间隔，这是 (2n^2) 个有向边。 在 (n=10^5) 处，即只有一个棱镜有 (2\cdot10^{10}) 条边，而 (10^5) 个棱镜的最坏情况是 (2\cdot10^{15})。 这远远超出了时间和记忆的限制。 

第一个有用的观察是目的地是一组建筑物，因此我们不需要为每个战斗单位进行单独的最短路径计算。 添加一个概念性的超级源，以零成本连接到反转图中的每个敌方建筑。 然后，一次 Dijkstra 运行给出了从每个位置到最近的建筑物的距离。 

第二个观察处理大间隔。 假设我们想要将区间 (A) 的每个点连接到区间 (B) 的每个点。 线段树可以仅使用 (O(\log n)) 个规范节点来表示任一区间。 

我们使用线段树的两个有向副本。 在第一个副本中，每个子节点都以零成本指向其父节点。 因此，一个点可以从它的叶子爬升到任何区间包含该点的线段树节点。 在第二个副本中，每个父级都以零成本指向其子级。 因此，线段树节点可以下降到其区间内的任何点。 

对于一个有向棱镜（A\到 B），创建一个虚拟顶点 (v)。 向上树中覆盖 (A) 的每个规范节点以成本 (w) 连接到 (v)，并且 (v) 以零成本连接到向下树中覆盖 (B) 的每个规范节点。 从 (A) 的任意点开始的路径可以爬升到一个规范节点，在 (v) 处恰好支付一次 (w)，然后下降到 (B) 的任意点。 

因为棱镜是双向的，所以我们为 (B\to A) 创建相同的结构。 向上和向下的树必须保持分开。 如果它们的父子边是双向的，则一个点可以通过在同一棵树上攀爬和下降来在自己的县内自由移动，这将引入原始问题中不存在的路径。 

下面的实现在反向压缩图上运行 Dijkstra。 它将棱镜连接紧凑地存储为范围事件，而不是具体化每个图形边缘。 虚拟顶点的目标区间附加到其规范线段树节点。 当 Dijkstra 到达这样的节点时，虚拟顶点就可以以零额外成本到达。 当虚拟顶点本身被弹出时，其源区间被分解为另一棵树的规范节点，并且这些节点接收棱镜成本。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| --- | ---| --- |
 | 蛮力 | 最坏情况下的 (O(mn^2)) 边缘构造 | (O(mn^2)) | 太慢了 |
 | 线段树压缩+ Dijkstra | (O((n+m)\log^2 n)) | (O(n+m\log n)) | 已接受 |

 ## 算法演练

1. 将两个县的每个位置视为概念图的一个顶点。 对于成本为 (w) 的棱镜 ([a,b]\leftrightarrow[c,d])，创建两个虚拟顶点，一个表示从 ([a,b]) 到 ([c,d]) 的方向，另一个表示相反方向。 两个虚拟顶点是必要的，因为区间方向具有不同的源范围和目标范围。 
2. 在所有 (2n) 个位置上构建一棵线段树。 位置 (1) 到 (n) 代表县 1，位置 (n+1) 到 (2n) 代表县 2。 保留该树的两个逻辑副本。 在向上复制中，每个子节点都以零成本指向其父节点。 在向下的副本中，每个父节点都以零成本指向其子节点。 
3. 将每个真实位置的向上和向下副本在两个方向上以零成本边连接起来。 这使得同一物理位置的两种表示可以互换，而内部线段树节点保持方向性。 
4. 对于每个有向棱柱 (A\to B)，将 (B) 分解为 (O(\log n)) 向下树的规范节点。 在反转图中，每个节点都获得到棱柱虚拟顶点的零成本连接。 我们将这些连接存储为附加到相应线段树节点的事件。 
5. 将源间隔 (A) 和成本 (w) 存储在虚拟顶点内。 当在反向 Dijkstra 过程中到达虚拟顶点时，将 (A) 分解为向上树的 (O(\log n)) 个规范节点，并将所有节点松弛 (w)。 这正是进入棱镜时支付（w）的相反形式。 
6. 从距离为零的每个敌方建筑初始化 Dijkstra。 该建筑由向下树中的叶子代表。 从向下的树开始很方便，因为反转棱柱边从代表目标区间的规范节点进入虚拟顶点。 
7. 在 Dijkstra 期间，向上树节点的边向其子节点反转，因为原始向上树具有从子节点到父节点的边。 向下树节点具有朝向其父节点的反向边，因为原始向下树具有从父节点到子节点的边。 真实的叶子还具有到另一棵树的相应叶子的零成本边。 
8. 当 Dijkstra 完成时，战斗位置（x_i）对应的向上树叶中存储的距离恰好是（x_i）到任何敌方建筑物的最短距离。 取所有作战单位的最大值。 如果任何这样的距离是无限的，则打印`boring game`。 

### 为什么它有效

 考虑从区间 (A) 到区间 (B) 的一个原始棱镜。 (A) 中的每个点都可以向上爬树到覆盖 (A) 的规范节点之一。 从那里它到达棱柱顶点并支付（w）。 然后，棱柱顶点到达向下树中覆盖 (B) 的每个规范节点，并且该节点可以下降到 (B) 中的每个点。 因此，压缩图包含每对允许的端点之间的精确成本 (w) 的路径。 

相反，该构造引入的唯一正成本转变是通过虚拟棱柱顶点的转变。 零成本线段树边仅改变相同区间成员资格的表示，并且决不允许在不相关的实际位置之间移动。 因此，真实位置之间的每条压缩路径都对应于具有相同成本的原始棱柱遍历的有效序列。 

在所有建筑物的反向图上运行 Dijkstra 计算从每个真实位置到其最近建筑物的距离。 由于所有作战单位同时且独立地移动，因此所有作战单位到达的时间就是这些最短距离中的最大值。 无法到达的源具有无限的距离，完全匹配所需的`boring game`健康）状况。 

## Python 解决方案```python
import sys
import heapq
from array import array

input = sys.stdin.readline

INF = 4_000_000_000_000_000_000

def solve():
    n, m, p, q = map(int, input().split())

    # There are 2*n real positions, the first n in county 1
    # and the next n in county 2.
    N = 2 * n

    # Iterative segment tree size.
    S = 1
    while S < N:
        S <<= 1

    # Segment-tree indices are 1 .. 2*S-1.
    # Tree 0: upward tree, child -> parent in the original graph.
    # Tree 1: downward tree, parent -> child in the original graph.
    OUT_BASE = 2 * S
    VBASE = 4 * S

    virtual_count = 2 * m
    total_nodes = VBASE + virtual_count

    # For each downward-tree canonical node, head[idx] is the first
    # virtual prism attached to it in the reversed graph.
    head = array('i', [-1]) * (2 * S)

    # Linked-list storage for prism events.
    event_v = array('i')
    event_next = array('i')

    # Information stored for every virtual vertex.
    # In the reversed graph, this is the interval reached from the
    # virtual vertex, plus the cost of the prism.
    source_l = array('i')
    source_r = array('i')
    weight = array('q')

    def add_event(seg_idx, vid):
        event_v.append(vid)
        event_next.append(head[seg_idx])
        head[seg_idx] = len(event_v) - 1

    def add_interval_events(l, r, vid):
        """Attach vid to canonical nodes covering inclusive [l, r]."""
        l += S
        r += S + 1

        while l < r:
            if l & 1:
                add_event(l, vid)
                l += 1
            if r & 1:
                r -= 1
                add_event(r, vid)
            l >>= 1
            r >>= 1

    # Create both directions of every prism.
    for i in range(m):
        a, b, c, d, w = map(int, input().split())

        # Convert to zero-based positions in the combined 2*n array.
        a -= 1
        b -= 1
        c = n + c - 1
        d = n + d - 1

        # Direction: county 1 [a,b] -> county 2 [c,d].
        vid = VBASE + 2 * i
        source_l.append(a)
        source_r.append(b)
        weight.append(w)

        # In the reversed graph, destination [c,d] reaches vid at cost 0.
        add_interval_events(c, d, vid)

        # Direction: county 2 [c,d] -> county 1 [a,b].
        vid = VBASE + 2 * i + 1
        source_l.append(c)
        source_r.append(d)
        weight.append(w)

        # In the reversed graph, destination [a,b] reaches vid at cost 0.
        add_interval_events(a, b, vid)

    sources = [x - 1 for x in map(int, input().split())]
    targets = [n + y - 1 for y in map(int, input().split())]

    dist = array('q', [INF]) * total_nodes
    heap = []

    # Start from every enemy building in the downward-tree representation.
    for pos in targets:
        node = OUT_BASE + S + pos
        if dist[node] != 0:
            dist[node] = 0
            heapq.heappush(heap, (0, node))

    while heap:
        dcur, u = heapq.heappop(heap)
        if dcur != dist[u]:
            continue

        # Virtual prism vertex.
        if u >= VBASE:
            k = u - VBASE
            l = source_l[k] + S
            r = source_r[k] + S + 1
            nd = dcur + weight[k]

            # In the reversed graph, a virtual vertex reaches
            # canonical nodes covering its source interval in the
            # upward tree.
            while l < r:
                if l & 1:
                    v = l
                    node = v
                    if nd < dist[node]:
                        dist[node] = nd
                        heapq.heappush(heap, (nd, node))
                    l += 1

                if r & 1:
                    r -= 1
                    v = r
                    node = v
                    if nd < dist[node]:
                        dist[node] = nd
                        heapq.heappush(heap, (nd, node))

                l >>= 1
                r >>= 1

            continue

        # Downward-tree node.
        if u >= OUT_BASE:
            idx = u - OUT_BASE

            # Reverse of parent -> child is child -> parent.
            if idx > 1:
                v = OUT_BASE + (idx >> 1)
                if dcur < dist[v]:
                    dist[v] = dcur
                    heapq.heappush(heap, (dcur, v))

            # A leaf representing a real position is connected to
            # the same position in the upward tree.
            if idx >= S and idx < S + N:
                v = idx
                if dcur < dist[v]:
                    dist[v] = dcur
                    heapq.heappush(heap, (dcur, v))

            # Reverse prism edges: this canonical destination node
            # can enter every prism whose destination interval contains it.
            e = head[idx]
            while e != -1:
                v = event_v[e]
                if dcur < dist[v]:
                    dist[v] = dcur
                    heapq.heappush(heap, (dcur, v))
                e = event_next[e]

        # Upward-tree node.
        else:
            idx = u

            # Reverse of child -> parent is parent -> child.
            if idx < S:
                v = idx << 1
                if dcur < dist[v]:
                    dist[v] = dcur
                    heapq.heappush(heap, (dcur, v))

                v += 1
                if dcur < dist[v]:
                    dist[v] = dcur
                    heapq.heappush(heap, (dcur, v))

            # Same physical position, other representation.
            if idx >= S and idx < S + N:
                v = OUT_BASE + idx
                if dcur < dist[v]:
                    dist[v] = dcur
                    heapq.heappush(heap, (dcur, v))

    answer = 0

    for pos in sources:
        node = S + pos
        if dist[node] >= INF // 2:
            print("boring game")
            return
        if dist[node] > answer:
            answer = dist[node]

    print(answer)

if __name__ == "__main__":
    solve()
```第一个构造部分选择二的幂的线段树大小（S），这使得线段节点的父节点和子节点简单`idx >> 1`和`idx << 1`。 组合树包含两个县，因此单个线段树就足够了。 县二位置移动了(n)，而县一位置保留在上半区。 

两个数组`source_l`和`source_r`存储每个虚拟棱柱顶点的源侧的间隔。 目标间隔不单独存储，因为其规范节点在输入处理期间立即转换为事件。 与为每个棱镜存储两个显式邻接列表相比，这可以节省大量内存。 

事件数组使用整数数组而不是 Python 元组列表。 Python 元组具有相当大的对象开销，当 (10^5) 个棱柱每个产生 (O(\log n)) 个线段树事件时，这将是危险的。`head`,`event_v`， 和`event_next`形成一个紧凑的链表表示。 

该图从未具体化为传统的邻接表。 线段树边是在 Dijkstra 期间直接从节点索引生成的。 当处理向上的节点时，会生成其子节点。 当处理向下的节点时，会生成其父节点。 唯一需要显式存储的边是棱镜事件。 

极差分解内部使用半开区间([l,r))。 输入区间 ([l,r]) 通过将线段树端点设置为`l + S`和`r + S + 1`。 那`+1`是必不可少的，因为问题区间是包容性的。 

距离类型是有符号的 64 位数组。 一条路径可以包含许多棱镜过渡，每个棱镜过渡的成本高达 (10^9)，因此 32 位整数是不够的。 Python 整数在数字上是安全的，但是`array('q')`保持距离表紧凑。 

陈旧条目检查`if dcur != dist[u]`替换单独的访问数组。 如果一个节点被多次改进，旧的堆条目仍保留在堆中，并且只处理与当前最佳距离匹配的条目。 

这两个县并不仅仅因为它们的位置编号相同而相互连接。 唯一的跨县运动来自棱镜顶点。 两个线段树表示之间的零成本边仅存在于同一物理位置的两个表示之间。 

## 工作示例

 ### 示例 1

 输入是```
5 3 2 2
2 4 1 3 1
1 1 4 5 3
1 2 3 4 2
2 3
4 5
```第一个战斗单位从位置 (2) 开始，第二个战斗单位从位置 (3) 开始。 敌方建筑位于位置（4）和（5）。 

第一个单元的有用直接路线是通过第三个棱镜，从县一位置 ([1,2]) 到县二位置 ([3,4])，成本为 (2)。 第二个单位可以使用第一个棱镜从位置（3）到县二位置（3），成本（1），然后使用第三个棱镜返回县一并再次穿越到达敌方建筑。 其最佳到达时间是（4）。 

| 迪杰斯特拉态 | 距离 | 意义|
 | --- | --- | --- |
 | 4 号楼 | 0 | 初始来源 |
 | 5号楼| 0 | 初始来源 |
 | 棱镜 (1) 反向顶点 | 0 | 其目标区间包含建筑物 4 |
 | 棱镜 (3) 反向顶点 | 0 | 其目标区间包含建筑物 4 |
 | 来源位置 2 | 2 | 第一支战斗部队到达一座建筑物 |
 | 源位置 3 | 4 | 第二支战斗部队到达一座建筑物 |

 最大最短距离为 (4)，因此输出为`4`。 这说明了为什么最终运算是各个最短路径上的最大值，而不是总和。 

### 示例 2

 第二个小例子是```
3 1 1 1
1 2 2 3 5
2
3
```唯一的棱镜允许县一位置 (1) 和 (2) 以成本 (5) 到达县二位置 (2) 和 (3)。 战斗单位从位置（2）开始，建筑物位于位置（3）。 

| 步骤| 当前代表| 距离 | 运营|
 | --- | --- | --- | --- |
 | 1 | 3号楼，下叶| 0 | Dijkstra 初始化 |
 | 2 | ([2,3]) | 的向下规范节点 0 | 逆向向下爬树|
 | 3 | 棱镜虚拟顶点| 0 | 目的地间隔事件 |
 | 4 | ([1,2]) | 的向上规范节点 5 | 支付棱镜费用 |
 | 5 | 位置 2 的向上叶片 | 5 | 在反向向上树中下降 |

 唯一的战斗单位在 (5) 个时间单位内到达建筑物，所以答案是`5`。 该轨迹表明，无论需要多少个线段树节点来表示任一区间，棱镜成本都只支付一次。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O((n+m)\log^2 n)) | 每个棱镜创建 (O(\log n)) 事件，Dijkstra 使用对数堆因子 | 处理生成的 (O((n+m)\log n)) 转换 |
 | 空间| (O(n+m\log n)) | 两个线段树和距离表是线性的，而棱镜事件需要(O(m\log n))紧凑存储 |

 (10^5) 个位置和 (10^5) 个棱镜的约束排除了任何与间隔长度的乘积成比例的构造。 线段树表示将每个区间交互减少为对数多个结构操作。 该实现还避免了 Python 对象密集的邻接列表，这在 256 MB 内存限制下尤其重要。 

## 测试用例

 以下测试假设提交的解决方案可用`solution.py`并暴露了`solve()`函数如上所示。```python
# helper: run solution on input string, return output string
import sys
import io
from solution import solve

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
assert run(
    """5 3 2 2
2 4 1 3 1
1 1 4 5 3
1 2 3 4 2
2 3
4 5
"""
) == "4", "provided sample"

# Custom 1: minimum-size input
assert run(
    """1 1 1 1
1 1 1 1 7
1
1
"""
) == "7", "minimum size"

# Custom 2: unreachable combat unit
assert run(
    """2 1 1 1
1 1 1 1 4
2
1
"""
) == "boring game", "unreachable source"

# Custom 3: both interval boundaries must be included
assert run(
    """4 1 1 1
1 1 4 4 3
1
4
"""
) == "3", "inclusive boundaries"

# Custom 4: duplicate positions and multiple prisms
assert run(
    """5 2 3 2
2 4 3 5 2
3 3 1 2 7
2 2 4
3 5
"""
) == "2", "duplicate positions and overlapping intervals"

# Custom 5: maximum n and m, while keeping every prism interval a singleton
m = 100000
lines = ["100000 100000 1 1"]
lines.extend(["1 1 1 1 1"] * m)
lines.append("1")
lines.append("1")
max_case = "\n".join(lines) + "\n"

assert run(max_case) == "1", "maximum n and m"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 提供样品|`4`| 多个单元和路径 |
 | (n=1,m=1) | (n=1,m=1) |`7`| 尽可能最小的图 |
 | 断开源|`boring game`| 无法到达的距离处理 |
 | 单例边界区间 |`3`| 包含区间端点 |
 | 重复和重叠的职位 |`2`| 重复的来源和目标|
 | (n=m=100000) 带有单棱镜 |`1`| 最大输入规模和紧凑存储 |

 ## 边缘情况

 断开连接的情况```
2 1 1 1
1 1 1 1 4
2
1
```在县一级阵地（2）启动唯一的战斗部队。 唯一棱镜仅接受一县位置 (1)，因此没有路径可以离开位置 (2)。 Dijkstra 从未为其向上的叶子分配有限的距离。 最终扫描检测到`INF`和打印`boring game`。 

包含边界情况```
4 1 1 1
1 1 4 4 3
1
4
```两个棱镜间隔均由其边界位置组成。 ([1,1]) 和 ([4,4]) 的分解各自生成一个线段树叶子。 反转的 Dijkstra 到达距离为零的虚拟棱镜，然后到达距离为 (3) 的源叶。 答案是`3`。 

反向情况```
3 1 1 1
1 1 3 3 5
3
1
```需要使用棱镜从第二个列出的间隔回到第一个间隔。 该构造显式地为此方向创建第二个虚拟顶点。 从县二位置 (1) 开始，反向 Dijkstra 到达虚拟顶点，然后到达县一源，成本为 (5)。 输出是`5`。 

重复位置的情况```
5 2 3 2
2 4 3 5 2
3 3 1 2 7
2 2 4
3 5
```在位置 (2,2,4) 有战斗单位，具有相同的无建筑物目标区间端点的两个副本。 位置（2）和位置（4）都可以使用第一个棱镜以成本（2）到达建筑物。 复制的战斗单位与位置 (2) 处的另一个单位具有相同的距离。 因此最大值为`2`。 

大输入测试包含 (10^5) 个棱镜，但每个间隔都是一个单例。 每个棱镜在每个方向仅贡献一个规范线段树事件，因此事件数组在 (m) 中保持线性。 此案例检查实现是否不会为每个潜在的图边分配 Python 元组或列表对象，以及整数数组表示是否缩放至最大输入大小。
