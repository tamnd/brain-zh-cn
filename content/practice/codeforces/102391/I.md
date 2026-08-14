---
title: "CF 102391I - 最小直径生成树"
description: "我们需要从连接的带权无向图中准确选择 (N-1) 条边，以便每个顶点都是可达的，并且生成的图是一棵树。 在所有此类生成树中，我们希望最长的加权路径尽可能短。"
date: "2026-08-14T14:05:19+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102391
codeforces_index: "I"
codeforces_contest_name: "XX Open Cup, Grand Prix of Korea"
rating: 0
weight: 102391
solve_time_s: 413
verified: false
draft: false
---

[CF 102391I - 最小直径生成树](https://codeforces.com/problemset/problem/102391/I)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 53s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们需要从连接的带权无向图中准确选择 (N-1) 条边，以便每个顶点都是可达的，并且生成的图是一棵树。 在所有此类生成树中，我们希望最长的加权路径尽可能短。 输出必须包含可能的最小直径以及达到该直径的一棵树的边缘。 该语句允许任何最优树，因此不同的正确输出可以包含不同的边。 

主要困难在于最小化直径与最小化边缘总重量不同。 即使原始图包含会给出小得多的直径的短路径，最小生成树也可以具有非常长的分支。 

对于 (N\le 500)，立方时间是自然的目标。 完整的全对最短路径计算需要 (O(N^3))，这在最大尺寸下大约是 (125) 百万个基本距离更新。 枚举生成树是完全不可能的，因为 (N) 个顶点上的完整图已经具有 (N^{N-2}) 个生成树。 界限 (M\le N(N-1)/2) 也意味着我们必须适应密集图，因此主要术语为 (O(NM)) 的算法在最坏情况下仍然是 (O(N^3))。 

粗心的解决方案可能会错过三种情况。 

首先，最优中心不必是原始顶点。 考虑```
3 2
1 2 2
2 3 4
```唯一的生成树是图本身，因此正确的直径是 (6)，使用边 (1\ 2) 和 (2\ 3)。 它的中心位于边 (2\3) 内的一个单位，而不是顶点 (2) 或顶点 (3)。 仅查看顶点中心将错误地获得 (8)，因为顶点 (2) 的偏心率为 (4)。 

其次，原始图使用的图边不需要属于最优生成树。 例如，```
4 6
1 2 1
2 3 1
3 4 1
1 4 100
1 3 10
2 4 10
```树 (1-2-3-4) 的直径为 (3)，这是最佳直径，因为每个生成树都必须连接顶点 (1) 和 (4)，并且该图包含形成该路径的三个单位边。 由于边缘 (1-4) 直接连接端点，因此粗心的构造会产生更糟糕的树。 

第三，多条最短路径可以具有相同的长度。 为了```
3 3
1 2 1
2 3 1
1 3 1
```正确的直径是 (2)，树 ({1-2,2-3})、({1-2,1-3}) 和 ({1-3,2-3}) 都是有效答案。 实施不得依赖于特定的打破平局顺序。 

## 方法

 强力解决方案将枚举 (N-1) 个图边的每个子集，测试该子集是否是生成树，然后计算其直径。 有

 [
 \binom{M}{N-1}
 ]

 这样的子集。 如果我们使用图遍历来检查连通性，测试一个子集至少需要 (O(N+M))，所以最坏情况的工作是

 [
 O\left(\binom{M}{N-1}(N+M)\right)。 
]

 对于 (N=500) 和完整的图 (M=124750)，这使得这个数字比任何可行的操作计数都要大。 蛮力是正确的，因为它确实检查了每个可能的生成树，但候选数的枚举数量是错误的。 

有用的观察是每棵树都有一个中心。 选取一棵树的最长路径并查看其中点。 中点要么是现有顶点，要么位于边内的某个位置。 如果中点是顶点 (c)，则每个顶点与 (c) 的树距离最多为直径的一半。 由于图最短路径只能比树路径短，因此（c）的图偏心率也最多为树直径的一半。 

这立即将问题与最短路径树联系起来。 如果我们选择一个顶点 (c) 并构建一个以 (c) 为根的最短路径树，则每个根到顶点的距离就成为图距离。 其直径至多为(c)偏心率的两倍。 如果 (c) 是最优树的中心，则该界限达到最优。 

复杂的是第二种情况，其中中心位于边缘内部。 标准解决方案通过将边缘上的任意点视为临时虚拟顶点来处理此问题。 所有这些点的最小可能偏心率是图的绝对 1 中心，并且以该中心为根的最短路径树给出最小直径生成树。 这种等价是 (O(NM+N^3)) 解决方案背后的经典约简。 

对于权重 (w) 的边 (e=(u,v))，假设虚拟中心距 (u) 为 (x) 个单位。 对于任意顶点 (z)，其到中心的距离为

 [
 \min(x+d(u,z),\w-x+d(v,z))。 
]

 对于固定 (z)，这是 (x) 的 V 形函数，斜率为 (+1) 和 (-1)。 所有顶点的最大值是这些 V 形函数的上包络线。 该包络的最小值出现在已经被顶点中心情况覆盖的端点处，或者出现在两个连续相关函数之间的交点处。 

对于一条边，按 (d(u,z)) 按降序对所有顶点进行排序。 扫描此顺序时，仅保留 (d(v,z)) 严格递增的顶点。 这些正是可以出现在上封套上的顶点。 如果连续保留的顶点是 (a) 和 (b)，则两条相关线相交于

 [
 x=\frac{w-d(u,a)+d(v,b)}{2},
 ]

 相应的偏心率为

 [
 \frac{w+d(u,a)+d(v,b)}{2}。 
]

 因此候选直径就是

 [
 w+d(u,a)+d(v,b)。 
]

 这将沿边缘的连续优化转变为 (N) 距离对的线性扫描。 

所需的全对距离可以通过 Floyd-Warshall 获得。 我们还为每个可能的端点预先计算一次距离顺序，而不是为每个图边单独排序。 总复杂度变为 (O(N^3+NM+N^2\log N))，在给定范围内为 (O(N^3))。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(\binom{M}{N-1}(N+M))) | (O(N+M)) | 太慢了 |
 | 最佳| (O(N^3+NM+N^2\log N)) | (O(N^2+M)) | 已接受 |

 ## 算法演练

1. 将图存储为邻接列表和距离矩阵。 矩阵最初包含给定的边权重和对角线上的零。 由于所有权重都是正数，因此不存在负循环并发症。 
2. 运行 Floyd-Warshall 来计算 (d(u,v))，即每对原始顶点之间的最短距离。 后面的中心计算仅取决于这些最短路径距离，而不取决于原始边缘结构。 
3. 对于每个顶点 (c)，计算其偏心率作为行 (c) 中的最大值。 正好位于 (c) 的中心给出候选直径 (2\operatorname{ecc}(c))。 存储最佳候选顶点。 
4. 对于权重 (w) 的每个图边 (e=(u,v))，考虑该边内某处可能的中心。 对于这条边，按 (d(u,z)) 按降序对顶点进行排序。 对于与同一 (u) 关联的每条边，排序顺序会重复使用，因此每个顶点仅计算一次。 
5. 从远到近扫描该顺序。 保留与 (v) 距离大于先前保留值的最后一个顶点。 如果当前顶点是 (a) 并且先前保留的顶点是 (b)，则两个相应的包络线段在可能的局部最小值处相遇。 其候选直径为

 [
 d(u,a)+w+d(v,b)。 
]

 如果该值改善了答案，则存储 (e)、(a) 和 (b)。 相应的中心位置，测量两次以避免分数，是

 [
 2x=w+d(v,b)-d(u,a)。 
]

 1.检查完所有顶点和边后，存储的候选点是图的绝对中心。 最小直径生成树可以由以此中心为根的最短路径树获得。 这是问题的核心结构属性。 
2. 如果中心是原始顶点，则从该顶点运行 Dijkstra，并保留除根之外的每个顶点的前趋边。 由于每个前驱都是沿着从中心开始的最短路径选择的，因此这些（N-1）条边形成了所需的最短路径树。 
3. 如果中心位于边 ((u,v)) 上，则暂时删除该边并在概念上将其替换为虚拟顶点 (c)。 两条虚拟边的长度为 (x) 和 (w-x)。 我们通过用距离 (x) 初始化 (u) 和用距离 (w-x) 初始化 (v) 来运行多源 Dijkstra。 我们不需要浮点运算，因为所有距离都可以加倍。 因此，初始距离为 (2x) 和 (2(w-x))，均为整数。 
4. 生成的前驱结构是图中具有虚拟中心的最短路径树。 如果只有 (u) 和 (v) 之一仍然直接连接到虚拟节点，则删除该虚拟连接已经在原始顶点上留下了生成树。 如果两者都保持连接状态，则删除两个虚拟边会留下两个组件，因此我们添加原始边 ((u,v)) 来重新连接它们。 
5. 打印存储的最小直径和从前驱树获得的（N-1）条原始图边。 

整个算法背后的不变性是所选中心到图顶点的最小可能最大最短路径距离。 任何直径为 (D) 的生成树都有一个中点，其偏心率最大为 (D/2)，因此绝对中心偏心率的两倍是每个可能的树直径的下限。 相反，以该中心为根的最短路径树的每个顶点都在该中心的偏心率范围内，因此每个树路径最多是该值的两倍。 下限和上限一致，证明最优性。 边缘扫描在每个可能的边缘上找到精确的最小偏心率，而顶点扫描则处理端点的中心。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

INF = 10**30

def dijkstra_vertex(n, adj, root):
    dist = [INF] * n
    parent = [-1] * n
    dist[root] = 0
    pq = [(0, root)]

    while pq:
        d, u = heapq.heappop(pq)
        if d != dist[u]:
            continue

        for v, w, eid in adj[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                parent[v] = u
                heapq.heappush(pq, (nd, v))

    return parent

def dijkstra_edge_center(n, adj, u, v, banned_eid, x2, w):
    # All distances are doubled.
    # The dummy center has doubled distances x2 and 2*w-x2
    # to u and v respectively.
    dist = [INF] * n
    parent = [-2] * n  # -2 means directly attached to dummy
    pq = []

    dv = 2 * w - x2

    dist[u] = x2
    dist[v] = dv
    heapq.heappush(pq, (x2, u))
    if v != u:
        heapq.heappush(pq, (dv, v))

    while pq:
        d, cur = heapq.heappop(pq)
        if d != dist[cur]:
            continue

        for to, ew, eid in adj[cur]:
            if eid == banned_eid:
                continue

            nd = d + 2 * ew
            if nd < dist[to]:
                dist[to] = nd
                parent[to] = cur
                heapq.heappush(pq, (nd, to))

    result = []

    for node in range(n):
        if parent[node] >= 0:
            result.append((parent[node], node))

    # If both u and v are still attached to the dummy, the two
    # components must be joined by the original center edge.
    if parent[u] == -2 and parent[v] == -2:
        result.append((u, v))

    return result

def solve():
    n, m = map(int, input().split())

    adj = [[] for _ in range(n)]
    edges = []

    dist = [[INF] * n for _ in range(n)]
    for i in range(n):
        dist[i][i] = 0

    for eid in range(m):
        u, v, w = map(int, input().split())
        u -= 1
        v -= 1
        edges.append((u, v, w))
        adj[u].append((v, w, eid))
        adj[v].append((u, w, eid))

        if w < dist[u][v]:
            dist[u][v] = w
            dist[v][u] = w

    # Floyd-Warshall.
    for k in range(n):
        dk = dist[k]
        for i in range(n):
            di = dist[i]
            dik = di[k]
            if dik >= INF:
                continue

            # The explicit loop avoids creating a large temporary
            # matrix row and works well for n <= 500.
            for j in range(n):
                nd = dik + dk[j]
                if nd < di[j]:
                    di[j] = nd

    # Distance orders, reused for every edge.
    orders = []
    for u in range(n):
        row = dist[u]
        order = list(range(n))
        order.sort(key=row.__getitem__, reverse=True)
        orders.append(order)

    best_diameter = INF
    best_type = 0
    best_root = -1
    best_edge = -1
    best_a = -1
    best_b = -1

    # Centers at original vertices.
    for u in range(n):
        ecc = max(dist[u])
        candidate = 2 * ecc
        if candidate < best_diameter:
            best_diameter = candidate
            best_type = 0
            best_root = u

    # Centers inside graph edges.
    for eid, (u, v, w) in enumerate(edges):
        order = orders[u]

        last = order[0]
        b_last = dist[v][last]

        for now in order[1:]:
            b_now = dist[v][now]

            if b_now > b_last:
                candidate = dist[u][now] + w + b_last

                if candidate < best_diameter:
                    best_diameter = candidate
                    best_type = 1
                    best_edge = eid
                    best_a = now
                    best_b = last

                last = now
                b_last = b_now

    # Construct the shortest-path tree from the selected center.
    if best_type == 0:
        parent = dijkstra_vertex(n, adj, best_root)
        answer_edges = []

        for v in range(n):
            if v != best_root:
                answer_edges.append((parent[v], v))
    else:
        u, v, w = edges[best_edge]

        # If a is the vertex on the u-side and b is the vertex on
        # the v-side, the center position satisfies
        #
        # x = (w + d(v,b) - d(u,a)) / 2.
        #
        # We store 2*x.
        x2 = w + dist[v][best_b] - dist[u][best_a]

        answer_edges = dijkstra_edge_center(
            n, adj, u, v, best_edge, x2, w
        )

    out = [str(best_diameter)]
    out.extend(f"{u + 1} {v + 1}" for u, v in answer_edges)
    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```距离矩阵用原始边长初始化，然后由 Floyd-Warshall 在最短路径下闭合。 该图很简单，因此每一对最多有一个输入边，但在初始化期间取最小值也使矩阵构造更加稳健。 

这`orders`数组是一个重要的实现细节。 对于每个端点 (u)，它以 (d(u,\cdot)) 的降序存储所有顶点。 然后可以重用边 ((u,v))`orders[u]`，避免在 (M) 边循环内进行排序。 

顶点中心阶段故意简单。 对于每个顶点，其偏心率恰好是其距离行中的最大值，因此候选直径是该值的两倍。 

边缘-中心相位跟随上包络扫描。`last`是之前保留的顶点，而`now`是当前顶点，按距 (u) 距离的递减顺序排列。 条件`b_now > b_last`表示第二个坐标已向新的上包络线段所需的方向移动。 候选人`dist[u][now] + w + b_last`恰好是两个相应 V 形函数的局部最小值的两倍。 

中心本身可以位于沿边缘的半整数位置。 浮点运算是不必要的并且有潜在危险，因此该构造使用双倍的距离。 如果直径为（D），则从虚拟中心到（u）侧端点的距离加倍为

 [
 2x=D-2d(u,a),
 ]

 这与计算得出的值相同`w + dist[v][best_b] - dist[u][best_a]`。 

对于以边缘为中心的候选，原始中心边缘暂时从 Dijkstra 中排除。 这是必要的，因为虚拟中心代表该边缘内的点，而不是允许绕过中心的单独路线。 两个端点在距虚拟中心一定距离处被初始化为源。 

价值`parent[node] == -2`意味着顶点直接连接到概念最短路径树中的虚拟中心。 如果两个端点都保留该状态，则在移除虚拟点后必须恢复原始边缘。 如果只有一条保持连接，则前趋边已经在原始图上形成生成树。 

Python 整数具有任意精度，因此边权重高达 (10^9)、包含最多 (499) 条边的路径和双倍距离都适合，无需任何溢出处理。 

## 工作示例

 ### 示例 1

 该图是一个所有边长都等于 (1) 的三角形。 

| 舞台| 关键状态| 价值|
 | --- | --- | --- |
 | APSP | (d(1,2),d(1,3),d(2,3)) | (1,1,1) | (1,1,1) |
 | 顶点 1 | 偏心率| (1) |
 | 顶点 2 | 偏心率| (1) |
 | 顶点 3 | 偏心率| (1) |
 | 最佳候选顶点 | (2\c点 1) | (2) |
 | 边缘候选人 | 最小值| (2) |
 | 选定中心 | 一个可能的顶点 | (1) |
 | 建造树| 两条边 | (1-2,\ 1-3) |
 | 直径| (1+1)| (2) |

 每个顶点都有偏心率 (1)，因此每个顶点都是最优中心。 迪杰斯特拉 (Dijkstra) 从它们中的任何一个生成一颗双边缘星，其直径为 (2)。 这表明最短路径中的联系和中心之间的联系是无害的。 

### 示例 2

 该图在左簇和右簇之间有一个类似于桥的重型连接。 

| 舞台| 关键状态| 价值|
 | --- | --- | --- |
 | 左簇| 短距离 | (10,20,30) 规模 |
 | 右簇 | 短距离 | (10,20,30) 规模 |
 | 连接边缘| (3-4) | (1000) | (1000)
 | 最佳顶点中心| 候选直径| 大于 (1060) |
 | 边缘中心| 边缘| (3-4) |
 | 边缘中心候选 | (d(3,a)+1000+d(4,b)) | (1060) |
 | 选定直径| 最小值| (1060) |
 | 建造树| 跨簇边缘| (3-4) |
 | 最后一棵树| 五边| (3-4,4-6,6-5,3-2,2-1) | (3-4,4-6,6-5,3-2,2-1) |
 | 直径| 最长的树路| (1060) |

 重要的特征是最优中心位于权重（1000）的边缘。 两侧都有自己的短结构，因此将中心放置在重边内部比选择任一端点作为中心更好地平衡两侧。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(N^3+NM+N^2\log N)) | Floyd-Warshall 成本 (O(N^3))，对所有距离订单成本进行排序 (O(N^2\log N))，并扫描每条边的订单成本 (O(NM)) |
 | 空间| (O(N^2+M)) | 距离矩阵使用(O(N^2))，而图和边列表使用(O(M)) |

 对于 (N\le500)，(N^3) 和 (NM) 最多都是 (10^8) 次运算。 内存要求适中，因为 (500\times500) 距离矩阵只有 (250000) 个条目。 尽管 Floyd-Warshall 部分是 Python 实现的性能关键部分，但该算法是这些边界的预期多项式方法。 

## 测试用例

 由于该问题接受任何最佳生成树，因此测试应验证报告的直径和树本身，而不是逐个字符比较完整的输出字符串。```python
# Paste the solve() implementation from the solution above before this test code.

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

def validate(inp: str, out: str, expected_diameter: int):
    data = list(map(int, inp.split()))
    it = iter(data)

    n = next(it)
    m = next(it)

    weights = {}
    for _ in range(m):
        u = next(it)
        v = next(it)
        w = next(it)
        if u > v:
            u, v = v, u
        weights[(u, v)] = w

    lines = out.strip().splitlines()
    assert len(lines) == n, "wrong number of output lines"

    diameter = int(lines[0])
    assert diameter == expected_diameter, (
        f"wrong diameter: got {diameter}, expected {expected_diameter}"
    )

    tree = [[] for _ in range(n)]
    used = set()

    for line in lines[1:]:
        u, v = map(int, line.split())
        assert 1 <= u <= n and 1 <= v <= n and u != v

        key = (min(u, v), max(u, v))
        assert key in weights, "output contains an edge not in the graph"
        assert key not in used, "duplicate tree edge"

        used.add(key)
        w = weights[key]
        tree[u - 1].append((v - 1, w))
        tree[v - 1].append((u - 1, w))

    assert len(used) == n - 1

    parent = [-1] * n
    parent[0] = 0
    stack = [0]
    order = []

    while stack:
        u = stack.pop()
        order.append(u)
        for v, _ in tree[u]:
            if v == parent[u]:
                continue
            assert parent[v] == -1, "cycle in output"
            parent[v] = u
            stack.append(v)

    assert len(order) == n, "output edges do not connect all vertices"

    def farthest(start):
        dist = [-1] * n
        dist[start] = 0
        stack = [start]
        best = start

        while stack:
            u = stack.pop()
            if dist[u] > dist[best]:
                best = u

            for v, w in tree[u]:
                if dist[v] != -1:
                    continue
                dist[v] = dist[u] + w
                stack.append(v)

        return best, dist[best]

    a, _ = farthest(0)
    _, tree_diameter = farthest(a)

    assert tree_diameter == expected_diameter, (
        f"constructed tree has diameter {tree_diameter}"
    )

# Sample 1.
sample1 = """\
3 3
1 2 1
2 3 1
3 1 1
"""
validate(sample1, run(sample1), 2)

# Sample 2.
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

# Center lies inside an edge.
case_edge_center = """\
3 2
1 2 2
2 3 4
"""
validate(case_edge_center, run(case_edge_center), 6)

# All edge weights equal.
case_equal = """\
4 6
1 2 5
1 3 5
1 4 5
2 3 5
2 4 5
3 4 5
"""
validate(case_equal, run(case_equal), 10)

# A very long direct edge should not be forced into the tree.
case_long = """\
4 6
1 2 1
2 3 1
3 4 1
1 4 100
1 3 10
2 4 10
"""
validate(case_long, run(case_long), 3)

# Maximum-size style test, 500 vertices.
# A unit-weight star is already optimal and has diameter 2.
n = 500
parts = [f"{n} {n - 1}"]
for v in range(2, n + 1):
    parts.append(f"1 {v} 1")
case_max = "\n".join(parts) + "\n"

validate(case_max, run(case_max), 2)

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 1 / 1 2 7`| 直径 (7) | 最小值（N）、单边树、边界处理 |
 |`3 2 / 1 2 2 / 2 3 4`| 直径 (6) | 中心严格位于边缘和半整数安全结构内 |
 | 4 个顶点的完整图，每个权重 (5) | 直径 (10) | 等距离、许多最佳树、平局处理 |
 | 具有权重 (100) 边的四顶点图 | 直径 (3) | 避免有吸引力但有害的长边|
 | 具有 (500) 个顶点的单位星 | 直径 (2) | 最大值（N），稀疏图，大输入尺寸 |

 ## 边缘情况

 第一个边缘情况是最小尺寸图：```
2 1
1 2 7
```生成树只有一棵，即单边（1-2），所以它的直径为（7）。 顶点中心扫描给出任一顶点和候选直径 (14) 的偏心率 (7)，如果将其解释为树直径，则该偏心率看起来太大。 这就是为什么必须仔细理解一般中心参数的原因：单个边的中点是虚拟中心。 边缘扫描考虑边缘 (1-2)，找到距任一端点距离 (3.5) 的中心，并生成候选直径 (7)。 该构造使用双倍虚拟距离，因此不会存储浮点值 (3.5)。 

第二个边缘情况是加权路径```
3 2
1 2 2
2 3 4
```唯一可能的树的直径为 (6)。 顶点 (2) 具有偏心率 (4)，因此仅顶点算法将报告 (8)。 对于边 (2-3)，相关顶点是 (1) 和 (3)。 它们距端点的距离对是 ((2,6)) 和 ((4,0))。 他们的信封交集给出

 [
 D=2+4+0=6，
 ]

 加倍后的中心坐标为(4+0-2=2)，即中心距顶点(2) 1 个单位。 以边为中心的 Dijkstra 构造恢复了原始的两条边。 

第三个边缘情况是完整的等权图：```
4 6
1 2 5
1 3 5
1 4 5
2 3 5
2 4 5
3 4 5
```以任何顶点为中心的星形的直径为 (10)，这是最佳的，因为每对不同的顶点都被至少一个权重 (5) 的边分隔开，并且在此图中，四个顶点上的树的直径不能低于 (10)。 该实现可能会选择一颗与人类期望的不同的星星，因为所有距离比较​​都可以平局。 验证器检查树属性和直径，而不需要特定的边顺序。 

第四个边缘情况包含很长的边缘：```
4 6
1 2 1
2 3 1
3 4 1
1 4 100
1 3 10
2 4 10
```Floyd-Warshall 首先发现顶点之间的最短距离由三个单位边控制。 因此，中心计算有利于图的短中心区域。 最终的树可以使用 (1-2)、(2-3) 和 (3-4)，给出直径 (3)。 权重（100）边永远不会仅仅因为它存在而被需要。 

第五个边缘情况是一个图，其删除选定的中心边缘会断开该图：```
3 2
1 2 2
2 3 4
```当边(2-3)被视为中心边时，临时图具有两个分量，一个包含顶点(1,2)，另一个包含顶点(3)。 多源Dijkstra从虚拟中心的两侧开始。 两个端点仍然直接连接到概念虚拟，因此构造会删除这两个虚拟连接并恢复原始边缘 (2-3)。 恰好保留两条原始边，形成生成树。 

最后一个微妙的情况是非桥中心边缘。 如果有一条替代路径连接其端点，则多源 Dijkstra 可能会更便宜地从另一侧发现一个端点。 然后只有一个端点保持直接连接到虚拟中心。 前趋边已经将所有原始顶点连接成一棵树，因此原始中心边不会再次添加。 这就是为什么构造检查两个端点是否仍然是虚拟根而不是盲目添加中心边缘。
