---
title: "CF 102441G - 仙人掌距离之和"
description: "我们有一个最多有 (10^5) 个顶点的连通仙人掌图。 仙人掌是稀疏的，并且具有一种特别有用的结构：每个双连通分量要么是一个单桥，要么是一个简单的循环。"
date: "2026-08-08T13:28:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102441
codeforces_index: "G"
codeforces_contest_name: "2018-2019 9th BSUIR Open Programming Championship. Final"
rating: 0
weight: 102441
solve_time_s: 139
verified: true
draft: false
---

[CF 102441G - 仙人掌中的距离总和](https://codeforces.com/problemset/problem/102441/G)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 19s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个最多有 (10^5) 个顶点的连通仙人掌图。 仙人掌是稀疏的，并且具有一种特别有用的结构：每个双连通分量要么是一个单桥，要么是一个简单的循环。 对于每对无序顶点 (u,v)，我们需要其最短路径距离（通过边数来测量），并且需要所有对的这些距离的总和。 

该图包含 (n) 个顶点和 (m) 个边，后面是每条边的端点。 答案是一个整数，包含所有 (\binom n2) 无序对的总和。 官方例子已经有答案了`3`对于三角形和`42`对于七顶点仙人掌。 

界限 (n\le 10^5) 排除任何二次方。 即使 (O(n^2)) 也已经意味着大约 (10^{10}) 对操作。 该图是稀疏的，因为 (m\le 2n)，因此 (O(n+m)) 或 (O((n+m)\log n)) 解决方案是自然目标。 一秒的限制使得线性方法特别有吸引力。 答案本身可能比 32 位整数大得多。 (10^5) 个顶点上的路径已经有总距离

 [
 \frac{n(n-1)(n+1)}6,
 ]

 大约是 (1.67\cdot10^{14})，因此需要 64 位算术。 Python 整数会自动处理这个问题。 

几个小案例暴露了很容易犯的错误。 对于一个顶点，没有对：```
1 0
```答案是`0`。 假设每个块包含至少一条边的实现在这里可能会失败。 

一棵树的行为必须与一棵普通树完全相同。 例如，```
3 2
1 2
2 3
```有对距离 (1,1,2)，所以答案是`4`。 将每个双连接组件视为一个循环会错误地对两个桥接块进行分类。 

循环不能像树一样处理。 对于一个三角形，```
3 3
1 2
2 3
3 1
```每对的距离为一，所以答案是`3`。 生成树计算将给出 (4)，因为它计算距离为 2 的对 (1,3)。 

即使循环也有另一种边界情况。 在一个广场上，```
4 4
1 2
2 3
3 4
4 1
```两个相对的对的距离为二，而四个相邻的对的距离为一。 答案是（8）。 用两个有向弧长之一替换每个循环距离的实现必须正确处理等长情况。 

## 方法

 直接的方法是从每个顶点运行广度优先搜索。 一个 BFS 给出了从其源到每个其他顶点的距离，因此对所有 BFS 结果求和是正确的。 然而，每个 BFS 扫描 (O(n+m)) 图数据。 重复 (n) 次的成本为 (O(n(n+m)))。 在最大边界处，邻接列表包含 (2m\le4\cdot10^5) 个条目，因此仅扫描来自所有 (10^5) 个源的邻接条目可能需要大约 (4\cdot10^{10}) 次扫描。 这远远超出了一秒的限制。 

关键的观察结果是仙人掌不具有任意的双连通分量。 每个块要么是一座桥，要么是一个简单的循环。 如果我们将每个块压缩为一个节点并将其连接到其中包含的原始顶点，我们就得到了块切割树。 该树描述了不同块的连接方式，而一个块内的原始循环提供了其附着顶点之间的精确距离。 

为这棵切块树扎根。 对于块 (B)，假设其父附着顶点是 (p)。 属于 (B) 的每个其他顶点 (v) 都有一个包含 (v) 及其下方所有块的后代区域。 设其大小为(s_v)。 从 (B) 的角度来看，该区域中的所有顶点都恰好在 (v) 处连接到 (B)。 

(B) 的父侧也有一个区域。 它的大小是

 [
 n-\sum_{v\ne p}s_v。 
]

 因此，每个原始顶点恰好属于这些区域之一，并且最高块为 (B) 的所有对都可以通过乘以区域大小来计数。 

对于桥来说，只有两个附着顶点，它们在块内的距离为 1。 它的贡献简直就是

 [
 s_1s_2。 
]

 对于顶点循环排列为 (v_0,v_1,\ldots,v_{k-1}) 的循环，块内 (v_i) 和 (v_j) 之间的距离为

 [
 \min(|i-j|,\k-|i-j|)。 
]

 剩下的问题是计算

 [
 \sum_{i<j}s_i s_j\min(j-i,k-(j-i))
 ]

 在循环的线性时间内。 首先计算普通线距离总和

 [
 T=\sum_{i<j}s_i s_j(j-i)。 
]

 那么每对 (j-i>k/2) 都在线上太远了。 它的正确距离是(k-(j-i))，所以要减去的量是

 [
 (j-i)-(k-(j-i))=2(j-i)-k。 
]

 移动边界在线性时间内识别所有此类对，并且 (s_i) 和 (i s_i) 的前缀和给出了它们的总校正。 

暴力法为每对单独支付费用。 仙人掌结构让我们可以用块附着顶点的加权和来替换穿过一个块的所有对。 块切割树告诉我们要使用哪些权重，循环公式处理整个循环而不枚举其顶点对。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n(n+m))) | (O(n+m)) | 太慢了 |
 | 最佳 | (O(n+m)) | (O(n+m)) | 已接受 |

 ## 算法演练

 1. 运行迭代低链接 DFS 并将图拆分为双连接组件。 由于输入是仙人掌，因此每个结果分量要么是一个桥边，要么是一个简单周期。 使用迭代 DFS，因此包含 (10^5) 个顶点的路径不依赖于 Python 的递归堆栈。 
2. 隐式构建分块树。 对于每个双连通分量，存储其顶点并将该分量添加到每个顶点的关联列表中。 当块和关节顶点被视为交替节点类型时，仙人掌属性保证此重合结构是一棵树。 
3. 在顶点处建立该结构的根`0`。 遍历过程中，记录每个顶点的父块以及每个块的父顶点。 还要保持块的发现顺序。 稍后颠倒该顺序会得到自下而上的处理顺序。 
4. 将每个顶点子树大小初始化为 1，代表顶点本身。 从下向上处理块。 对于具有父顶点 (p) 的块 (B)，每个其他事件顶点 (v) 的分支权重等于其已计算的子树大小`sub[v]`。 
5. 令 (S) 为这些子分支大小的总和。 父侧分支具有权重（n-S）。 这包括父顶点和当前块之外的所有内容。 因此，分支权重之和恰好为 (n)。 
6. 如果该块是桥，则将其两个分支权重相乘。 两个区域之间的唯一路径必须经过此桥一次，因此端点位于不同区域的每一对都会贡献一个。 
7. 如果该块是循环，则通过跟随其两个局部邻居来重建其循环顶点顺序。 将分支权重与每个循环顶点相关联。 该块的贡献是每两个附着顶点之间的圆形距离的加权和。 
8. 首先将周期贡献计算为一条线。 对于每个 (j)，维护前缀和

 [
 P=\sum_{i<j}s_i
 ]

 和

 [
 Q=\sum_{i<j}i s_i。 
]

 然后所有以 (j) 结尾的对都贡献

 [
 s_j(jP-Q)。 
]

 这使用距离 (j-i) 生成总和。 

1. 纠正周期另一侧表现较好的配对。 对于每个左端点 (i)，所有相关右端点满足

 [
 j-i>\left\lfloor\frac{k}{2}\right\rfloor。 
]

 单调指针找到第一个这样的 (j)。 前缀与后缀之和然后给出

 [
 s_i\sum_j s_j(2(j-i)-k)
 ]

 在恒定时间内（i）。 

1. 将块贡献添加到答案中，并将总子分支大小添加到`sub[p]`。 这使得当前块的整个后代区域在处理其父块时可用。 

### 为什么它有效

 不变的是，在处理一个块之后，其父顶点接收位于有根块切割树中该块下方的原始顶点的确切数量。 对于特定块，其关联分支区域是不相交的并且一起包含每个原始顶点。 任何路径使用该块的对都具有位于两个不同区域的端点，并且其在块内的距离恰好是对应的附着顶点之间的距离。 这样的一对在分隔其两个端点的最高块处被计数一次。 一个区域内的对被故意推迟到较低的区块。 因此，每个无序对在其最短路径上出现的每个块段都被精确计数一次，并且所有块贡献的总和恰好是所有最短路径距离的总和。 

对于一个循环，唯一的特殊问题是选择两个弧中较短的一个。 线计算给出一个弧长，并且校正精确地替换另一弧较短的那些对。 当周期长度为偶数且两条弧相等时，该对正好有差值（k/2），因此不包括在严格校正条件中并保持正确的距离。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def cycle_cost(order, weights):
    k = len(order)

    pref_w = [0] * (k + 1)
    pref_iw = [0] * (k + 1)

    line_cost = 0
    for i, w in enumerate(weights):
        line_cost += w * (i * pref_w[i] - pref_iw[i])
        pref_w[i + 1] = pref_w[i] + w
        pref_iw[i + 1] = pref_iw[i] + i * w

    half = k // 2
    left = half + 1
    correction = 0

    total_w = pref_w[k]
    total_iw = pref_iw[k]

    for i, w in enumerate(weights):
        need = i + half + 1
        if left < need:
            left = need

        if left < k:
            suffix_w = total_w - pref_w[left]
            suffix_iw = total_iw - pref_iw[left]

            correction += w * (
                2 * suffix_iw - (2 * i + k) * suffix_w
            )

    return line_cost - correction

def solve():
    input = sys.stdin.readline

    n, m = map(int, input().split())

    eu = [0] * m
    ev = [0] * m
    adj = [[] for _ in range(n)]

    for eid in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        eu[eid] = u
        ev[eid] = v
        adj[u].append((v, eid))
        adj[v].append((u, eid))

    # Iterative Tarjan DFS.
    tin = [0] * n
    low = [0] * n
    parent_edge = [-1] * n
    it = [0] * n

    edge_stack = []
    components = []

    timer = 1
    tin[0] = low[0] = timer

    dfs_stack = [0]

    while dfs_stack:
        u = dfs_stack[-1]

        if it[u] < len(adj[u]):
            v, eid = adj[u][it[u]]
            it[u] += 1

            if eid == parent_edge[u]:
                continue

            if tin[v] == 0:
                parent_edge[v] = eid
                timer += 1
                tin[v] = low[v] = timer

                edge_stack.append(eid)
                dfs_stack.append(v)
            elif tin[v] < tin[u]:
                if tin[v] < low[u]:
                    low[u] = tin[v]
                edge_stack.append(eid)

        else:
            dfs_stack.pop()

            pe = parent_edge[u]
            if pe == -1:
                continue

            p = eu[pe] if ev[pe] == u else ev[pe]

            if low[u] < low[p]:
                low[p] = low[u]

            if low[u] >= tin[p]:
                comp = []

                while True:
                    eid = edge_stack.pop()
                    comp.append(eid)
                    if eid == pe:
                        break

                components.append(comp)

    # Store vertices of every block and its incidence list.
    block_vertices = []
    incidence = [[] for _ in range(n)]

    for b, comp in enumerate(components):
        seen = {}
        verts = []

        for eid in comp:
            a = eu[eid]
            c = ev[eid]

            if a not in seen:
                seen[a] = True
                verts.append(a)

            if c not in seen:
                seen[c] = True
                verts.append(c)

        block_vertices.append(verts)

        for v in verts:
            incidence[v].append(b)

    B = len(block_vertices)

    # Root the block-cut tree at vertex 0.
    parent_block = [-1] * n
    parent_vertex = [-1] * B

    parent_block[0] = -2

    block_order = []
    vertex_order = [0]
    stack = [0]

    while stack:
        v = stack.pop()

        for b in incidence[v]:
            if b == parent_block[v]:
                continue

            if parent_vertex[b] != -1:
                continue

            parent_vertex[b] = v
            block_order.append(b)

            for x in block_vertices[b]:
                if x == v:
                    continue

                if parent_block[x] == -1:
                    parent_block[x] = b
                    vertex_order.append(x)
                    stack.append(x)

    sub = [1] * n
    answer = 0

    # Process blocks bottom-up.
    for b in reversed(block_order):
        verts = block_vertices[b]
        p = parent_vertex[b]

        child_sum = 0
        for v in verts:
            if v != p:
                child_sum += sub[v]

        parent_weight = n - child_sum

        if len(verts) == 2:
            a, c = verts

            if a == p:
                wa = parent_weight
                wc = sub[c]
            else:
                wa = sub[a]
                wc = parent_weight

            answer += wa * wc

        else:
            # A cactus block with at least three vertices is a cycle.
            local = {}

            for v in verts:
                local[v] = []

            for eid in components[b]:
                a = eu[eid]
                c = ev[eid]
                local[a].append(c)
                local[c].append(a)

            start = verts[0]
            order = []
            prev = -1
            cur = start

            for _ in range(len(verts)):
                order.append(cur)

                x, y = local[cur]
                nxt = x if x != prev else y

                prev, cur = cur, nxt

            weights = []
            for v in order:
                if v == p:
                    weights.append(parent_weight)
                else:
                    weights.append(sub[v])

            answer += cycle_cost(order, weights)

        sub[p] += child_sum

    print(answer)

if __name__ == "__main__":
    solve()
```第一部分读取图形，同时为每条边分配一个 ID。 Tarjan 算法需要边 ID，因为无向边在邻接列表中出现两次，并且 DFS 必须区分实际的父边和通向已访问顶点的另一条边。 

低链路DFS维持`tin`和`low`。 当一个孩子`u`满足`low[u] >= tin[p]`，从边堆栈顶部到父边的所有边形成一个双连通分量。 在仙人掌中，这些组件正是算法其余部分所需的桥梁和循环。 

组件构造仅对一个组件临时使用字典。 处理的条目总数是线性的，因为每条边都属于一个组件。 持久表示是每个块中的顶点列表加上将原始顶点连接到块的关联列表。 

有根遍历永远不会构造单独的块切割树。`parent_block`和`parent_vertex`准确包含导航所需的信息。 加工`block_order`向后保证每个`sub[v]`所使用的块已经合并了下面的所有块`v`。 

桥壳故意较短。 它的两个区域在其附着顶点之间有一条边，因此它们的叉积恰好是其路径使用该桥的对的数量。 

循环情况根据每个循环顶点在块内恰好有两个邻居的事实重建了实际的循环顺序。 该顺序不取决于选择哪个方向，因为圆形距离是对称的。 

这`cycle_cost`函数是二次部分消失的地方。`line_cost`使用其前向距离对每对进行计数。 两指针校正恰好考虑了向前距离超过半个周期的对。 不等式是严格的，这对于偶循环至关重要，因为相对的顶点已经具有正确的距离 (k/2)。 

Python 整数可以避免溢出，但乘积仍然很大，因此将所有计算保留为整数是必要的。 没有模运算，因为问题要求精确的总和。 

## 工作示例

 ### 示例 1

 该图是一个三角形。 有一个循环块，每个顶点的分支权重为一。 

| 循环位置| 顶点| 分枝重量|
 | ---| ---| ---|
 | 0 | 1 | 1 |
 | 1 | 2 | 1 |
 | 2 | 3 | 1 |

 线距离总和为(1+2+1=4)。 位置 0 和位置 2 之间的对被循环周围的三个边隔开，因此其线距 2 必须修正为 1。 修正值为(2\cdot2-3=1)。 循环贡献为(4-1=3)。 

最终的答案是`3`，与官方样品相符。 

### 示例 2

 该图由两个通过顶点连接的三角形组成`1`和`3`，有一条路径`1-5-7`附加到顶点`1`。 在顶点处求根`1`给出以下相关的分支大小。 

| 块| 父顶点 | 子分支权重 | 父端权重 | 贡献 |
 | ---| ---| ---| ---| ---|
 | 三角形`1-2-3`| 1 | 1, 3 | 3 | 15 | 15
 | 边缘`1-5`| 1 | 2 | 5 | 10 | 10
 | 边缘`5-7`| 5 | 1 | 6 | 6 |
 | 三角形`3-4-6`| 3 | 1, 1 | 5 | 11 | 11

 对于第一个三角形，三个分支权重为 (3,1,3)。 它的每对附着顶点在三角形上都是相邻的，因此它的加权贡献为

 [
 3\cdot1+1\cdot3+3\cdot3=15。 
]

 第二个三角形的权重为 (5,1,1)，给出

 [
 5\cdot1+5\cdot1+1\cdot1=11。 
]

 两个桥贡献是 (2\cdot5=10) 和 (1\cdot6=6)。 他们的总和是

 [
 15+10+6+11=42。 
]

 结果是`42`，再次匹配官方样本。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n+m)) | Tarjan、分块构建、分块遍历、每次循环计算在总图大小上都是线性的 |
 | 空间| (O(n+m)) | 邻接表、双连通分量、关联表和辅助数组都是线性的 |

 该图最多有 (2n) 条边，因此 (n+m=O(n))。 在 (n=10^5) 时，算法仅处理线性数量的图对象，而不是单独考虑大约 (5\cdot10^9) 个无序顶点对。 官方限制为 1 秒和 256 MB，因此避免二次对枚举和深度递归 DFS 在这里特别有用。 

## 测试用例

 以下线束假设提交的解决方案保存为`solution.py`并暴露了`solve()`函数如上所示。```python
import sys
import io
from contextlib import redirect_stdout

from solution import solve

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()

    try:
        with redirect_stdout(out):
            solve()
    finally:
        sys.stdin = old_stdin

    return out.getvalue().strip()

# Provided sample 1
assert run(
    """3 3
1 2
2 3
3 1
"""
) == "3", "sample 1"

# Provided sample 2
assert run(
    """7 8
2 1
3 1
5 1
3 2
4 3
5 7
6 3
4 6
"""
) == "42", "sample 2"

# Minimum-size graph
assert run(
    """1 0
"""
) == "0", "single vertex"

# A path of length two
assert run(
    """3 2
1 2
2 3
"""
) == "4", "tree distances"

# Five-cycle, all branch weights equal to one
assert run(
    """5 5
1 2
2 3
3 4
4 5
5 1
"""
) == "15", "odd cycle"

# Four-cycle, catches the even-cycle midpoint case
assert run(
    """4 4
1 2
2 3
3 4
4 1
"""
) == "8", "even cycle"

# Maximum-size tree, a path with 100000 vertices.
n = 100000
max_case = str(n) + " " + str(n - 1) + "\n"
max_case += "\n".join(f"{i} {i + 1}" for i in range(1, n)) + "\n"

assert run(max_case) == "166666666650000", "maximum-size path"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 0`|`0`| 最小尺寸图和空对集 |
 |`3 2`, 边缘`1-2`,`2-3`|`4`| 桥梁处理和普通树木距离|
 | 五循环|`15`| 奇数循环和相等分支权重 |
 | 四循环|`8`| 偶数循环和相反的顶点 |
 | 具有 100000 个顶点的路径 |`166666666650000`| 最大尺寸、大答案和线性性能 |

 ## 边缘情况

 单顶点图```
1 0
```没有双连通分量。 DFS 访问顶点`0`，区块顺序仍为空，初始答案为`0`。 不需要特殊的假块。 

对于路径```
3 2
1 2
2 3
```两个双连接组件都是桥。 下桥有分支尺寸 (1) 和 (2)，贡献 (2)。 上桥有分支尺寸 (1) 和 (2)，并贡献另一个 (2)。 总计为`4`。 这说明了为什么桥梁必须与自行车保持区别。 

对于三角形```
3 3
1 2
2 3
3 1
```单个循环的权重为 (1,1,1)。 普通行总和为`4`，并且一对的长弧被校正为`1`，生产`3`。 这正是生成树距离和出错的情况。 

对于广场```
4 4
1 2
2 3
3 4
4 1
```四个分支权重均为一。 线距离总和为`10`。 只有位置相差3的对才需要校正，每次校正为(2\cdot3-4=2)。 结果是`8`。 差值二处的对没有被校正，因为它的两条弧的长度都是二。 这种严格的边界可以防止偶数周期上出现差一错误。 

对于第二个示例，关节顶点属于多个块。 顶点`3`例如，由两个三角形共享。 它的子树大小包括顶点`3`,`4`， 和`6`当处理第一个三角形时。 然后，第一个三角形的父侧权重包括图形的其余部分。 这正是块切割树视点有用的原因：关节顶点在结构上是共享的，但每个端点对仍然分配给正确的块区域，而无需重复计算。
