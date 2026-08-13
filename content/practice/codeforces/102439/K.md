---
title: "CF 102439K - 创新"
description: "我们有一个加权的城市树。 因为该图是一棵树，所以每对城市之间都只有一条路径，因此该路径自动为最短路径。"
date: "2026-08-12T08:17:22+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102439
codeforces_index: "K"
codeforces_contest_name: "2018-2019 9th BSUIR Open Programming Championship. Semifinal"
rating: 0
weight: 102439
solve_time_s: 155
verified: true
draft: false
---

[CF 102439K - 创新](https://codeforces.com/problemset/problem/102439/K)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 35s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个加权的城市树。 因为该图是一棵树，所以每对城市之间都只有一条路径，因此该路径自动为最短路径。 每个查询选择两个城市，并用权重为其平方根的底的边替换其路径上的每条边。 同一条边可能会改变很多次。 在初始状态和每次查询之后，我们需要所有无序城市对的距离总和，模 (10^9+7)。 官方声明给出了相同的操作和示例输出（140,92,72,48）。 

第一个有用的观察是我们永远不需要维持个体的成对距离。 随意给树生根。 考虑一条边，其子端子树包含顶点。 删除这条边将树分成大小为 (s) 和 (n-s) 的部分。 恰好 (s(n-s)) 个无序对的路径穿过该边。 如果其当前权重为(w)，则其对所有成对距离之和的贡献为

 [
 w \cdot s(n-s)。 
]

 所以整个答案很简单

 [
 \sum_{\text{边}e} w_e \cdot s_e(n-s_e)。 
]

 系数 (s_e(n-s_e)) 永远不会改变，因为树结构永远不会改变。 仅边权重发生变化。 

这将问题转化为动态数组问题。 我们需要将 (w \leftarrow \lfloor\sqrt w\rfloor) 应用于树路径上的每个边，同时保持所有边值的加权和。 

这些界限使得直接模拟变得不可能。 可以有 (2\cdot10^5) 个查询，并且路径可以包含 (2\cdot10^5-1) 条边，因此显式访问每个路径边可能需要大约 (4\cdot10^{10}) 条边更新。 在每次查询后重新计算所有成对距离会更糟，为 (O(mn^2))。 我们需要利用平方根可以非常快速地减少权重的事实。 

只有少数真正危险的边缘情况。 

### 单一城市

 最小可能的输入是```
1 1
1 1
```没有道路，因此每个成对距离和为零。 正确的输出是```
0
0
```假设每个查询至少包含一条边的粗心实现可能会尝试访问不存在的边或产生无效范围。 

### 权重已经为 1 的边

 考虑```
2 1
1 2 1
1 2
```初始总和为 (1)，应用运算得到 (\lfloor\sqrt1\rfloor=1)，因此答案仍为 (1)：```
1
1
```一个常见的错误是假设每个查询的边都会发生变化。 当某个范围内的所有权重都已为 1 时，线段树必须能够立即停止。 

###同一路径上的重复更新

 考虑```
3 3
1 2 16
2 3 9
1 3
1 3
1 3
```每条边贡献 (2w)，因为每条边将一个顶点与两个顶点分开。 输出是```
50
14
6
4
```边权重演化为 (16\to4\to2\to1) 和 (9\to3\to1\to1)。 在整个输入的每个边上仅应用一次平方根的实现是错误的。 

### 根与其父级没有边

 当有根树被展平时，每个非根顶点代表将其连接到其父级的边。 根代表没有边。 对于路径查询，不得意外地将根位置视为真实道路。 当最终的重光间隔包含最低的共同祖先时，这特别容易出错。 

## 方法

 最直接的解决办法是从边缘贡献公式开始。 建立树的根，计算每个子树的大小，并为每个边分配固定系数 (s(n-s))。 然后，对于每个查询，从 (u) 走到 (v)，更改该路径上的每条边，并通过相应的贡献差异调整全局答案。 

这种方法是正确的，因为每条边都确切地知道有多少城市对使用它。 如果一条边从 (w) 变为 (w')，则总答案将发生变化

 [
 (w'-w)s(n-s)。 
]

 问题是访问的边数。 在路径形树中，两个端点之间的查询包含 (n-1) 条边。 对于 (m=2\cdot10^5)，这会导致大约 (4\cdot10^{10}) 次边缘访问。 尽管每个平方根都很便宜，但许多操作无法满足 1.5 秒的限制。 

关键的观察是一条边不能改变很多次。 对于 (w\le10^6)，序列的边界为

 [
 10^6\to1000\to31\to5\to2\to1。 
]

 因此，在整个输入期间，每个边最多变化五次。 一旦边缘达到 1，所有涉及它的后续更新都不会执行任何操作。 

这使得线段树特别合适。 我们首先使用重轻分解将每个树路径变成数组的 (O(\log n)) 连续间隔。 然后线段树将当前的边权重存储在这个展平的数组上。 

一个简单的线段树可以存储每个节点的最大权重。 如果最大值为 1，则可以跳过整个查询段。 否则，我们下降直到找到受影响的边缘。 这已经给出了摊销解，因为只有 (O(n)) 实际重量变化。 

我们可以通过存储最小和最大权重来使线段树更强。 平方根函数是单调的。 如果一个线段具有最小值 (a) 和最大值 (b)，并且

 [
 \lfloor\sqrt a\rfloor=\lfloor\sqrt b\rfloor,
 ]

 那么 (a) 和 (b) 之间的每个值都具有完全相同的新值。 我们可以通过分配该值来延迟更新整个段。 这消除了许多不必要的下降。 

线段树还存储每个节点中的系数之和以及该节点当前的加权和。 当整个节点变得相同的权重（x）时，它的贡献立即

 [
 x\cdot\sum c_i.
 ]

 因此，线段树的根总是包含所需的答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(nm)) 预处理后 | (O(n)) | (O(n)) | 太慢了|
 | HLD+线段树| (O(m\log^2 n+n\log n\log\log W)) 摊销 | (O(n)) | (O(n)) | 已接受 |

 这里 (W\le10^6)，所以 (\log\log W) 实际上是一个小常数。 每条边的实际成功更改次数最多为 5。 

## 算法演练

 1. 以城市 1 为树根并计算`parent`,`depth`， 和`subtree_size`对于每个城市。 对于每个非根顶点 (v)，从 (v) 到其父顶点的边具有系数

 [
 c_v=\text{子树大小}[v]\cdot(n-\text{子树大小}[v])。 
]

 该系数准确计算有多少无序城市对使用该边缘。 
2. 计算每个顶点的重子节点，即具有最大子树的子节点。 重轻分解将每条重链分组为数组的一个连续区间。 到顶点 (v) 的父级的边存储在 (v) 的数组位置。 

根的权重为零，因为它不对应于边。 
3. 在展平的数组上构建线段树。 每个线段树节点存储其最小边权重、最大边权重、其固定系数之和、当前加权贡献以及可选的延迟分配值。 
4. 当查询的区间被完全覆盖时，首先检查其最大权重。 如果最多为 1，则该间隔不需要做任何工作。 

否则计算最小值和最大值的底平方根。 如果它们相等，则平方根函数的单调性意味着区间中的每个值都变为相同的数字。 整个段可以被惰性地分配而无需访问它的叶子。 
5. 如果最小值和最大值产生不同的平方根，则该段至少包含两个不同的结果值，因此不能用一个惰性赋值来表示。 将任何待处理的作业推给子级并递归到两半。 
6.使用重轻分解来分解每个树查询路径。 当两个端点属于不同的重链时，更新属于更深链的整个链段。 一旦两个顶点位于同一条链上，就将间隔更新为严格低于其最低公共祖先。 

最终间隔使用`pos[lca] + 1`， 不是`pos[lca]`，因为顶点位置表示通向该顶点的边。 LCA 本身在其下方的路径上没有边缘。 
7. 处理查询后，线段树的根包含每条边上的 (w_e c_e) 之和。 打印该值模 (10^9+7)。 

### 为什么它有效

 对于每条边，其路径使用该边的城市对的数量永久为 (s(n-s))，因此所需的全局总和恰好是边权重乘以其固定系数的总和。 线段树精确地维护这些加权边缘贡献。 

在查询期间，所请求的树路径上的每条边都会被 (w\mapsto\lfloor\sqrt w\rfloor) 变换一次。 重光分解恰好覆盖了这些边缘，而不覆盖其他边缘。 线段树对每个被覆盖的边应用相同的变换。 当整个段具有相同的平方根值时，惰性赋值有效，因为平方根函数是单调的。 否则，递归最终会到达可以正确表示变换的更小的段。 

因此，在每次查询之后，每条边都恰好具有其所需的当前权重，并且线段树根恰好是所需的所有成对最短路径之和。 

## Python 解决方案```python
import sys
from math import isqrt
from array import array

input = sys.stdin.readline

MOD = 1_000_000_007

def solve():
    n, m = map(int, input().split())

    # Forward-star adjacency representation.
    head = array('i', [-1]) * n
    to = array('i', [0]) * (2 * max(0, n - 1))
    nxt = array('i', [0]) * (2 * max(0, n - 1))
    ew = array('i', [0]) * (2 * max(0, n - 1))

    ptr = 0
    for _ in range(n - 1):
        u, v, w = map(int, input().split())
        u -= 1
        v -= 1

        to[ptr] = v
        ew[ptr] = w
        nxt[ptr] = head[u]
        head[u] = ptr
        ptr += 1

        to[ptr] = u
        ew[ptr] = w
        nxt[ptr] = head[v]
        head[v] = ptr
        ptr += 1

    # Root the tree and compute parent, depth, edge-to-parent weight.
    parent = array('i', [-1]) * n
    depth = array('i', [0]) * n
    weight_to_parent = array('i', [0]) * n
    order = array('i', [0]) * n

    parent[0] = 0
    stack = [0]
    order_len = 0

    while stack:
        v = stack.pop()
        order[order_len] = v
        order_len += 1

        e = head[v]
        while e != -1:
            u = to[e]
            if u != parent[v]:
                parent[u] = v
                depth[u] = depth[v] + 1
                weight_to_parent[u] = ew[e]
                stack.append(u)
            e = nxt[e]

    # Subtree sizes and heavy children.
    size = array('i', [1]) * n
    heavy = array('i', [-1]) * n

    for idx in range(n - 1, 0, -1):
        v = order[idx]
        p = parent[v]
        size[p] += size[v]

        h = heavy[p]
        if h == -1 or size[v] > size[h]:
            heavy[p] = v

    # Heavy-light decomposition.
    chain_head = array('i', [0]) * n
    pos = array('i', [0]) * n

    cur = 0
    chain_stack = [0]

    while chain_stack:
        h = chain_stack.pop()
        v = h

        while v != -1:
            chain_head[v] = h
            pos[v] = cur
            cur += 1

            e = head[v]
            hv = heavy[v]
            while e != -1:
                u = to[e]
                if parent[u] == v and u != hv:
                    chain_stack.append(u)
                e = nxt[e]

            v = hv

    # Flattened edge weights and fixed edge coefficients.
    weights = array('i', [0]) * n
    coeff = array('q', [0]) * n

    for v in range(1, n):
        p = pos[v]
        weights[p] = weight_to_parent[v]
        coeff[p] = size[v] * (n - size[v])

    # Segment tree arrays.
    #
    # mn[x], mx[x]      minimum/maximum weight in the node
    # sumc[x]           sum of fixed edge coefficients
    # sumw[x]           current weighted contribution
    # lazy[x]           >= 0 means all values in this node are assigned to it
    #
    # The root position has coefficient 0 and weight 0.
    S = 4 * n + 5

    mn = array('i', [0]) * S
    mx = array('i', [0]) * S
    lazy = array('i', [-1]) * S
    sumc = array('q', [0]) * S
    sumw = array('q', [0]) * S

    def apply(node, value):
        mn[node] = value
        mx[node] = value
        sumw[node] = value * sumc[node]
        lazy[node] = value

    def build(node, left, right):
        if left == right:
            w = weights[left]
            c = coeff[left]
            mn[node] = w
            mx[node] = w
            sumc[node] = c
            sumw[node] = w * c
            return

        mid = (left + right) >> 1
        lc = node << 1
        rc = lc | 1

        build(lc, left, mid)
        build(rc, mid + 1, right)

        mn[node] = min(mn[lc], mn[rc])
        mx[node] = max(mx[lc], mx[rc])
        sumc[node] = sumc[lc] + sumc[rc]
        sumw[node] = sumw[lc] + sumw[rc]

    def push(node):
        value = lazy[node]
        if value != -1:
            lc = node << 1
            rc = lc | 1
            apply(lc, value)
            apply(rc, value)
            lazy[node] = -1

    def pull(node):
        lc = node << 1
        rc = lc | 1
        mn[node] = min(mn[lc], mn[rc])
        mx[node] = max(mx[lc], mx[rc])
        sumw[node] = sumw[lc] + sumw[rc]

    def range_sqrt(node, left, right, ql, qr):
        if right < ql or qr < left or mx[node] <= 1:
            return

        if ql <= left and right <= qr:
            a = isqrt(mn[node])
            b = isqrt(mx[node])

            if a == b:
                apply(node, a)
                return

        if left == right:
            apply(node, isqrt(mx[node]))
            return

        push(node)

        mid = (left + right) >> 1
        lc = node << 1
        rc = lc | 1

        if ql <= mid:
            range_sqrt(lc, left, mid, ql, qr)
        if qr > mid:
            range_sqrt(rc, mid + 1, right, ql, qr)

        pull(node)

    build(1, 0, n - 1)

    def update_path(u, v):
        while chain_head[u] != chain_head[v]:
            hu = chain_head[u]
            hv = chain_head[v]

            if depth[hu] < depth[hv]:
                u, v = v, u
                hu, hv = hv, hu

            range_sqrt(1, 0, n - 1, pos[hu], pos[u])
            u = parent[hu]

        if u == v:
            return

        if depth[u] < depth[v]:
            u, v = v, u

        # u is deeper. The LCA itself is not an edge on the path.
        range_sqrt(1, 0, n - 1, pos[v] + 1, pos[u])

    out = [str(sumw[1] % MOD)]

    for _ in range(m):
        u, v = map(int, input().split())
        update_path(u - 1, v - 1)
        out.append(str(sumw[1] % MOD))

    sys.stdout.write('\n'.join(out))

if __name__ == "__main__":
    solve()
```第一个预处理阶段使用迭代遍历，因为 Python 的默认递归深度不适合可以是 (2\cdot10^5) 个顶点链的树。 这`order`数组记录根到叶的遍历顺序，向后处理它可以给出子树的大小，而无需递归。 

在子树大小已知后，选择重子节点。 然后分解直接遍历每个重链并将轻子链推入堆栈。 这会为每个重链产生连续的位置，这正是线段树所需要的。 

系数数组由子顶点的位置索引。 如果顶点 (v) 不是根，则该位置表示来自`parent[v]`至(v)。 其系数为`size[v] * (n - size[v])`。 

线段树内部不存储模约简和。 最大可能总数大约低于 (n^2\cdot10^6)，这在 Python 整数范围内并且也在有符号 64 位算术范围内。 在每次合并和赋值期间避免模运算可以使实现速度更快。 仅打印给用户的值会按模 (10^9+7) 减少。 

这`lazy`value 代表赋值，而不是增量。 值为`-1`表示没有待处理的分配。 由于边权重始终是非负的，`-1`是一个明确的标记。 

最小和最大优化是线段树的微妙部分。 假设一个节点包含的权重在 16 到 25 之间。两个端点的平方根分别为 4 和 5，因此结果不均匀。 节点必须分裂。 相反，如果节点包含 16 到 24 之间的值，则平方根范围为 4 到 4，因此每个值都变为 4，并且可以立即分配整个节点。 

最终 HLD 间隔开始于`pos[v] + 1`当两个端点都在同一条链上时。 这是该问题中最常见的差一点。 顶点位置表示传入边，因此 LCA 的位置表示从其父级到 LCA 的边，该边不是查询路径的一部分。 

## 工作示例

 官方的样本是```
5 3
1 2 4
2 3 4
1 4 9
1 5 16
1 5
1 3
1 4
```以城市 1 为根后，边（1-2）的边系数为 6，边（2-3）的边系数为 4，边（1-4）的边系数为 4，边（1-5）的边系数为 4。 

| 状态| 边缘 (1-2) | 边缘 (2-3) | 边缘 (1-4) | 边缘 (1-5) | 总计 |
 | --- | --- | --- | --- | --- | --- |
 | 初始| (4\cdot6=24) | (4\cdot4=16) | (9\cdot4=36) | (16\cdot4=64) | 140 | 140
 | 查询 (1,5) | 24 | 16 | 16 36 | 36 (4\cdot4=16) | 92 | 92
 | 查询 (1,3) | (2\cdot6=12) | (2\cdot4=8) | 36 | 36 16 | 16 72 | 72
 | 查询 (1,4) | 12 | 12 8 | (3\cdot4=12) | 16 | 16 48 | 48

 第一个查询仅更改边 (1-5)，因为它是从 1 到 5 的路径上唯一的边。第二个查询将两条边从 1 更改为 3。最后一个查询更改边 (1-4)。 因此输出是```
140
92
72
48
```第二个例子强调重复变换。```
3 3
1 2 16
2 3 9
1 3
1 3
1 3
```两条边的系数均为 2。 

| 查询 | 重量 (1-2) | 体重 (2-3) | 总计 |
 | --- | --- | --- | --- |
 | 初始| 16 | 16 9 | 50 | 50
 | (1,3) | 4 | 3 | 14 | 14
 | (1,3) | 2 | 1 | 6 |
 | (1,3) | 1 | 1 | 4 |

 该跟踪说明了为什么边缘在第一次创新后不能简单地标记为“已处理”。 它仍然符合资格，直到其权重达到 1。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(m\log^2 n+n\log n\log\log W)) 摊销 | HLD 每个查询创建 (O(\log n)) 段间隔，而每个边仅更改 (O(\log\log W))，最多五次 |
 | 空间| (O(n)) | (O(n)) | 树、HLD数组、线段树都使用线性内存|

 对于 (n,m\le2\cdot10^5)，重要的事实是路径更新的昂贵部分不可能无限期地发生。 每个道路权重在达到 1 之前仅经过几个平方根级别。线段树另外将统一范围折叠为惰性分配。 该实现使用迭代树预处理和紧凑整数数组，使 Python 内存使用量保持在 256 MB 限制以下合理。 

## 测试用例

 以下测试工具假设`solve()`存在上述解决方案中的函数。 它重定向标准输入和输出，因此可以独立检查每个完整的输入。```python
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

# Official sample
sample = """\
5 3
1 2 4
2 3 4
1 4 9
1 5 16
1 5
1 3
1 4
"""
assert run(sample) == "140\n92\n72\n48", "official sample"

# Minimum-size tree, no edges at all.
case_min = """\
1 1
1 1
"""
assert run(case_min) == "0\n0", "single city"

# Weight 1 must never change.
case_one = """\
2 1
1 2 1
1 2
"""
assert run(case_one) == "1\n1", "weight already one"

# All equal values and repeated full-path updates.
case_equal = """\
4 2
1 2 4
2 3 4
3 4 4
1 4
1 4
"""
assert run(case_equal) == "40\n20\n10", "all equal weights"

# Boundary sequence 16 -> 4 -> 2 -> 1 and 9 -> 3 -> 1.
case_repeated = """\
3 3
1 2 16
2 3 9
1 3
1 3
1 3
"""
assert run(case_repeated) == "50\n14\n6\n4", "repeated square roots"

# Maximum-size structural test.
# A path of 200000 vertices with every edge equal to 1.
# Every query is the whole path, so the answer never changes.
n = 200000
m = 200000

initial = n * (n - 1) * (n + 1) // 6
expected_line = str(initial % 1_000_000_007) + "\n"
expected = expected_line * (m + 1)

parts = [f"{n} {m}"]
for i in range(1, n):
    parts.append(f"{i} {i + 1} 1")
for _ in range(m):
    parts.append(f"1 {n}")

max_case = "\n".join(parts) + "\n"

assert run(max_case) == expected, "maximum-size all-one path"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1`， 询问`1 1`|`0, 0`| 没有边缘和一条空路|
 | 边权重为 1 的两个城市 |`1, 1`| 重量已经极轻 |
 | 所有权重的四城市路径 4 |`40, 20, 10`| 等值和重复的全路径更新 |
 | 权重为 16 和 9 的三城市路径 |`50, 14, 6, 4`| 多个平方根级别和重复查询 |
 | 200000 个城市路径，所有权重 1 | 所有 200001 行上的值相同 | 最大 (n,m)、长路径和跳过未更改的范围 |

 ## 边缘情况

 ### 单一城市

 对于```
1 1
1 1
```线段树仅包含人工根位置。 它的系数为零，因此它的加权贡献为零。 路径更新发现两个端点是相同的顶点并返回而不接触线段树。 输出是```
0
0
```该实现会处理此问题，因为当以下情况时，所有 HLD 间隔均为空：`u == v`，并且线段树仍然具有有效的单元素根。 

### 权重已经等于 1

 对于```
2 1
1 2 1
1 2
```唯一的边具有系数 (1)。 其初始贡献为(1)。 查询过程中，线段树看到`mx == 1`并立即返回。 没有分配和贡献发生变化。 输出是```
1
1
```在路径上的所有道路都达到 1 后，这种提前终止也可以降低重复查询的成本。 

### 重复变换

 对于```
3 3
1 2 16
2 3 9
1 3
1 3
1 3
```第一个查询更改 (16\to4) 和 (9\to3)。 第二个更改 (4\to2) 和 (3\to1)。 第三个变化 (2\to1)，而另一条边已经是 1。总数为 (50,14,6,4)。 

线段树的最小值和最大值使得第三次查询变得高效。 一旦范围仅包含权重 1，则其最大值为 1，并且递归会在访问任何叶子之前停止。 

###最低共同祖先

 考虑```
3 1
1 2 4
2 3 4
1 3
```该路径包含两条边，因此最初的答案是

 [
 4\cdot2+4\cdot2=16。 
]

 查询后两个权重都变为 2，给出

 [
 2\cdot2+2\cdot2=8。 
]

 输出是```
16
8
```当端点位于同一重链上时，更新必须覆盖来自`pos[1] + 1`通过`pos[3]`。 LCA 本身的位置代表 LCA 的传入边缘，必须排除。 这正是最终 HLD 间隔使用的原因`pos[v] + 1`。 

### 没有有效更改的路径

 假设一棵大树包含许多权重为 1 的边，并且查询路径完全由这些边组成。 查询前后的答案是相同的。 线段树使用最大值来识别这一点。 查询仍然执行 HLD 分解，但每个段立即返回，而不是降序。 这可以防止最坏情况的行为依赖于未更改路径的物理长度。
