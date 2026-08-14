---
title: "CF 102341I - 地狱猿"
description: "对于每个查询，我们都会将多个 Infernape 放置在一棵固定树的顶点上。 顶点 (vi) 处具有功率 (ri) 的 Infernape 恰好加热距 (vi) 的树距离最大为 (ri) 的顶点。 如果至少 (k-1) 个 (k) 地狱火加热某个顶点，则该顶点被认为是好的。"
date: "2026-08-14T01:53:41+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102341
codeforces_index: "I"
codeforces_contest_name: "Radewoosh+mnbvmar Contest (supported by AIM Tech)"
rating: 0
weight: 102341
solve_time_s: 953
verified: true
draft: false
---

[CF 102341I - Infernape](https://codeforces.com/problemset/problem/102341/I)

 **评级：** -
 **标签：** -
 **求解时间：** 15m 53s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于每个查询，我们都会将多个 Infernape 放置在一棵固定树的顶点上。 顶点 (v_i) 处具有功率 (r_i) 的 Infernape 恰好加热距 (v_i) 的树距离最大为 (r_i) 的顶点。 

如果至少 (k-1) 个 (k) 地狱火加热某个顶点，则该顶点被认为是好的。 同等地，在Infernape定义的(k)个球中，顶点最多可以位于一个球之外。 任务是为每个查询独立地计算所有好的顶点。 

树本身最多有 (10^5) 个顶点，而所有查询中的 Infernape 总数最多为 (3\cdot10^5)。 时间限制为 7 秒，因此扫描整个树以查找每个 Infernape 的算法过于昂贵。 诸如 (10^5\cdot3\cdot10^5=3\cdot10^{10}) 操作之类的界限排除了任何 (O(nk)) 方法。 我们大约需要 (O((n+\sum k)\log n)) 或接近它的东西。 

解决方案必须准确处理多种边界情况。 首先，所需的集合不是所有球的交集。 例如，在树 (1-2) 上，在 (1) 和 (2) 处获取两个 Infernape，它们的力量均为 (0)。 正确答案是（2），因为每个顶点都被一个地狱火加热并且（k-1=1）。 两个球的交集是空的，因此仅计算公共交集的实现将错误地返回 (0)。 

其次，距离界限是包容性的。 在路径 (1-2-3) 上，将一个地狱猿放在 (1) 处并具有力量 (1)，将另一只地狱猿放在 (3) 处并具有力量 (1)。 每个顶点都至少被一个地狱火加热，所以答案是（3）。 将距离 (r_i) 视为排除会错误地仅留下顶点 (2)。 

第三，几个球的交点可能具有在边的中间而不是在原始顶点处的中心。 在树 (1-2) 上，将 Infernape 放置在具有力量 (1) 的两个端点。 它们的共同加热区域包含两个顶点，并且自然地以边缘的中点为中心。 将每个中间球中心限制在原始顶点会使相交操作变得笨拙，并且可能会引入相差一的错误。 

最后，在添加另一个球后，交叉点可能会变成空的。 这样的交叉点的贡献必须为零。 该算法明确地表示这种状态，而不是尝试为其分配一个人工中心。 

## 方法

 直接的方法是检查查询中每个 Infernape 的每个树顶点。 我们可以计算它与 Infernape 的距离，计算有多少个球包含它，并在计数达到 (k-1) 时增加答案。 这是正确的，因为它遵循字面定义。 一个查询的成本为 (O(nk))，整个输入的成本为 (O(n\sum k))。 在最大总数 (k) 下，这大约是 (3\cdot10^{10}) 个顶点检查，这几乎是不可行的。 

第一个有用的观察是，可以使用交集来表达答案，而不是直接计算覆盖范围。 令 (S_i) 为除编号 (i) 之外的每个 Infernape 加热的顶点集合，并令 (S) 为由所有 (k) 个 Infernape 加热的顶点集合。 由恰好 (k-1) 个 Infernape 加热的顶点恰好属于一个 (S_i)。 被所有 (k) 加热的顶点属于每个 (S_i)，因此在它们的总和中被计数 (k) 次。 减去 (S) 的 (k-1) 个副本即可准确修复该超算：

 [
 \text{answer}=\sum_{i=1}^{k}|S_i|-(k-1)|S|。 
]

 这将问题简化为计算树球 (k+1) 个交叉点的大小。 

第二个观察是树上球交叉点的结构。 树中两个相连球的交集要么是空的，要么是中心位于两个原始中心之间的路径上的球。 重复操作意味着任意数量的球的交集仍然可以用一对来表示

 [
 （c，R），
 ]

 表示距中心 (c) 距离最远 (R) 的所有点。

中心可以位于边缘的中间，这就是树被细分的原因。 每条原始边 (u-v) 都被替换为 (u-x-v)，其中 (x) 是新的辅助顶点。 然后每棵原始树的距离加倍。 我们还将每个 Infernape 半径加倍。 这使得原始边的中点成为实际顶点，因此每个交点都可以用整数中心和整数半径表示。 最终答案中仅计算原始顶点。 

对于两个球 (U(a,A)) 和 (U(b,B))，设 (D=\operatorname{dist}(a,b))。 如果 (A+B<D)，它们的交集为空。 如果一个半径足够远以包含另一个球，我们将原封不动地返回较小的球。 否则新的半径是

 [
 R=\min(A,B)-\left\lfloor\frac{D-|A-B|}{2}\right\rfloor,
 ]

 新的中心是从(a)到(b)的路径上的对应点。 二元提升提供距离和沿路径指定距离处的点。 这是解决方案的几何核心。 在该问题的已知解决方案中使用相同的表示和交集运算。 

我们可以使用前缀和后缀交集来构造线性多次交集运算中的所有交集。 让`pre[i]`是第一个 (i) 球和的交集`suf[i]`从 (i) 开始的球的交叉点。 那么排除球 (i) 的交集就是简单的

 [
 \text{pre}[i-1]\cap\text{suf}[i+1]。 
]

 因此，每个查询仅创建 (k+1) 个球计数请求。 

剩下的问题是有效地计算有多少原始树顶点位于许多任意球内。 质心分解离线解决了这个问题。 对于每个质心，我们知道其当前组件中的每个顶点到该质心的距离。 可以使用以下方法通过质心测试以 (u) 为中心、半径 (R) 的查询

 [
 \运算符名称{距离}(u,c)+\运算符名称{距离}(c,x)\le R.
 ]

 组件中的所有顶点通过其距质心的距离满足第二部分。 按距离计算的前缀计数给出了可能的数量 (x)。 如果 (u) 位于质心的一个子组件中，则来自同一子组件的顶点可能具有不穿过质心的较短路径。 我们首先通过质心计算整个组件，然后减去完全相同的子顶点。 每个顶点查询对都被分配给它们的路径穿过该质心的最高质心，因此它只被计算一次。 

质心分解是离线处理的，因为在分解开始之前所有球计数请求都是已知的。 由此产生的方法需要 (O((n+K)\log n)) 时间，其中 (K) 是 Infernape 的总数，以及 (O(n\log n+K)) 内存。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(nK)) | (O(n)) | (O(n)) | 太慢了|
 | 最佳| (O((n+K)\log n)) | (O(n\log n+K)) | 已接受 |

 ## 算法演练

 1. 通过插入一个辅助顶点来细分每条原始边。 生成的树有 (2n-1) 个顶点，并且每个原始距离恰好加倍。 将原始顶点存储为前（n）个顶点，因此质心计数阶段可以忽略辅助顶点。 
2. 对细分树进行生根并构建二元升降台。 表格支持`lca(u,v)`和`jump(u,d)`， 在哪里`jump`将 (d) 边从 (u) 向上移动。 这些操作足以找到两个中心之间的距离并在其连接路径上找到一个新的中心。 
3. 表示一个非空交集`(center, radius)`在细分的树中。 空交点由无效中心表示。 使用非常大的半径作为单位元素，因为无限球与普通球相交应该返回普通球。 
4. 实现两个代表球的交集。 设它们的中心为 (a,b)，半径为 (A,B)，设 (D) 为它们的距离。 如果 (A+B<D)，则返回空。 如果 (A\ge D+B)，则第二个球包含在第一个球中，因此返回第二个球。 对称情况返回第一个。 否则计算新半径
 [
 R=\min(A,B)-\left\lfloor\frac{D-|A-B|}{2}\right\rfloor。 
]
 新中心是从 (a) 到 (b) 的路径上距 (a) 距离为 (A-R) 的点，或者距 (b) 距离为 (B-R) 的点。 二元提升定位该点。 
5. 对于每个查询，构建前缀交集`pre`和后缀交集`suf`。 完整的交集是`suf[0]`。 对于每个可能省略的 Infernape (i)，所有其他球的交集为`pre[i] ∩ suf[i+1]`。 如果该交集非空，则创建系数为 (+1) 的计球请求。 创建一个与系数 (1-k) 完全交集的附加请求。 
6. 按质心分解细分树。 删除质心会将当前组件分割成更小的组件，每个组件最多包含一半的顶点。 因此分解具有 (O(\log n)) 个级别。 
7. 在一个质心（c）处，遍历整个当前组件并构建`cnt[d]`，距 (c) 恰好为 (d) 的原始顶点数。 将其转换为前缀数组，所以`cnt[d]`变为最大距离 (d) 处的原始顶点数。 
8. 再次遍历该组件，处理以该组件顶点为中心的每一个计球请求。 如果其中心 (u) 距 (c) 的距离为 (du)，则半径 (R) 可以通过 (c) 到达每个顶点 (x)，其中
 [
 du+\算子名{dist}(c,x)\le R.
 ]
 因此贡献是`cnt[min(max_distance, R-du)]`。 
9. 对于 (c) 的每个子组件，仅使用该子组件的顶点重复计数遍历，但给出其计数系数 (-1)。 这会从通过 (c) 计算的贡献中删除同子顶点。 之后，递归到子组件。 减法是必要的，因为通过 (c) 的路径不是同一子节点内两个顶点的实际路径。 
10.处理完所有质心分解级别后，每个球请求包含其所代表的球在原始顶点中的大小。 对于查询（q），其存储的系数已经计算
 [
 \sum_i |S_i|-(k-1)|S|,
 ]
 这正是所需的答案。 

### 为什么它有效

 正确性有两个独立的部分。 首先，包含公式是精确的，因为恰好被 (k-1) 个球覆盖的顶点属于一个省略球交点，而被所有 (k) 个球覆盖的顶点属于所有 (k) 个省略球交点，并随后减去 (k-1) 次。 

其次，每个交叉点都由一个树球或空状态精确表示。 在树上，两个相交球的边界约束沿着它们中心之间的唯一路径相交，因此相交点以该路径为中心，并具有上面给出的半径。 细分使每个可能的中点成为实际顶点，而加倍距离则保留有关原始顶点的所有陈述。 

对于固定质心，第一次遍历根据顶点到质心的距离对顶点进行计数。 对于中心子组件之外的顶点，这样的路径是正确的。 对于同一个子节点中的顶点，通过质心的距离可能与实际距离不同，因此第二次遍历精确地减去那些同子节点的候选点。 因此，这个质心级别精确地计算了路径经过质心的对。 每对顶点在分解过程中都被一个最高质心分开，因此不会遗漏任何对，也不会被计算两次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    N = 2 * n - 1

    g = [[] for _ in range(N)]

    for i in range(n - 1):
        a, b = map(int, input().split())
        a -= 1
        b -= 1
        x = n + i
        g[a].append(x)
        g[x].append(a)
        g[b].append(x)
        g[x].append(b)

    # Root the subdivided tree and build binary lifting.
    parent = [0] * N
    depth = [0] * N
    order = [0]

    for u in order:
        pu = parent[u]
        for v in g[u]:
            if v == pu:
                continue
            parent[v] = u
            depth[v] = depth[u] + 1
            order.append(v)

    LOG = N.bit_length()
    up = [parent]

    for _ in range(1, LOG):
        prev = up[-1]
        cur = [0] * N
        for i in range(N):
            cur[i] = prev[prev[i]]
        up.append(cur)

    def jump(u, d):
        bit = 0
        while d:
            if d & 1:
                u = up[bit][u]
            d >>= 1
            bit += 1
        return u

    def lca(a, b):
        if depth[a] < depth[b]:
            a, b = b, a

        diff = depth[a] - depth[b]
        bit = 0
        while diff:
            if diff & 1:
                a = up[bit][a]
            diff >>= 1
            bit += 1

        if a == b:
            return a

        for j in range(LOG - 1, -1, -1):
            if up[j][a] != up[j][b]:
                a = up[j][a]
                b = up[j][b]

        return up[0][a]

    def distance(a, b):
        p = lca(a, b)
        return depth[a] + depth[b] - 2 * depth[p]

    INF = 10**9

    # A ball is (center, radius). (-1, -1) is empty.
    def intersect(A, B):
        a, ra = A
        b, rb = B

        if a < 0 or b < 0:
            return (-1, -1)

        p = lca(a, b)
        D = depth[a] + depth[b] - 2 * depth[p]

        if ra + rb < D:
            return (-1, -1)

        if ra >= D + rb:
            return B

        if rb >= D + ra:
            return A

        R = min(ra, rb) - (D - abs(ra - rb)) // 2

        da = depth[a] - depth[p]
        move_a = ra - R

        if da >= move_a:
            c = jump(a, move_a)
        else:
            c = jump(b, rb - R)

        return (c, R)

    q = int(input())

    answers = [0] * q

    # Offline ball-counting requests.
    qhead = [-1] * N
    qradius = []
    qid = []
    qcoef = []
    qnext = []

    def add_request(center, radius, idx, coef):
        pos = len(qradius)
        qradius.append(radius)
        qid.append(idx)
        qcoef.append(coef)
        qnext.append(qhead[center])
        qhead[center] = pos

    for qi in range(q):
        k = int(input())

        balls = [None] * k
        for i in range(k):
            v, r = map(int, input().split())
            balls[i] = (v - 1, 2 * r)

        pre = [None] * (k + 1)
        pre[0] = (0, INF)

        for i in range(k):
            pre[i + 1] = intersect(pre[i], balls[i])

        suf = [None] * (k + 1)
        suf[k] = (0, INF)

        for i in range(k - 1, -1, -1):
            suf[i] = intersect(balls[i], suf[i + 1])

        # Full intersection has coefficient 1-k.
        all_ball = suf[0]
        if all_ball[0] >= 0:
            add_request(all_ball[0], all_ball[1], qi, 1 - k)

        # Intersection of every ball except i has coefficient +1.
        for i in range(k):
            cur = intersect(pre[i], suf[i + 1])
            if cur[0] >= 0:
                add_request(cur[0], cur[1], qi, 1)

    # Centroid decomposition.
    dead = bytearray(N)
    temp_parent = [-1] * N
    subsize = [0] * N

    def find_centroid(start):
        comp = [start]
        temp_parent[start] = -1

        for u in comp:
            pu = temp_parent[u]
            for v in g[u]:
                if dead[v] or v == pu:
                    continue
                temp_parent[v] = u
                comp.append(v)

        total = len(comp)

        for u in comp:
            subsize[u] = 1

        for u in reversed(comp):
            p = temp_parent[u]
            if p != -1:
                subsize[p] += subsize[u]

        centroid = start
        best = total + 1

        for u in comp:
            largest = total - subsize[u]

            for v in g[u]:
                if dead[v]:
                    continue
                if temp_parent[v] == u and subsize[v] > largest:
                    largest = subsize[v]

            if largest < best:
                best = largest
                centroid = u

        return centroid, total

    def collect(start, parent_node, start_dist, cnt, sign):
        stack = [(start, parent_node, start_dist)]
        max_dist = start_dist

        while stack:
            u, p, d = stack.pop()

            if u < n:
                cnt[d] += sign

            if d > max_dist:
                max_dist = d

            for v in g[u]:
                if dead[v] or v == p:
                    continue
                stack.append((v, u, d + 1))

        return max_dist

    def process_requests(start, parent_node, start_dist, cnt, deg):
        stack = [(start, parent_node, start_dist)]

        while stack:
            u, p, d = stack.pop()

            e = qhead[u]
            while e != -1:
                r = qradius[e]

                if r >= d:
                    limit = r - d
                    if limit > deg:
                        limit = deg
                    answers[qid[e]] += qcoef[e] * cnt[limit]

                e = qnext[e]

            for v in g[u]:
                if dead[v] or v == p:
                    continue
                stack.append((v, u, d + 1))

    tasks = [0]

    while tasks:
        start = tasks.pop()

        centroid, total = find_centroid(start)
        dead[centroid] = 1

        cnt = [0] * (total + 1)

        # First count all vertices through the centroid.
        deg = collect(centroid, -1, 0, cnt, 1)

        for d in range(1, deg + 1):
            cnt[d] += cnt[d - 1]

        process_requests(centroid, -1, 0, cnt, deg)

        # Then subtract vertices belonging to the same child component.
        for v in g[centroid]:
            if dead[v]:
                continue

            # Only the prefix that will be used by this child needs clearing.
            child_deg = 0
            stack = [(v, centroid, 1)]
            while stack:
                u, p, d = stack.pop()
                if d > child_deg:
                    child_deg = d
                for w in g[u]:
                    if dead[w] or w == p:
                        continue
                    stack.append((w, u, d + 1))

            for d in range(child_deg + 1):
                cnt[d] = 0

            child_deg = collect(v, centroid, 1, cnt, -1)

            for d in range(1, child_deg + 1):
                cnt[d] += cnt[d - 1]

            process_requests(v, centroid, 1, cnt, child_deg)

        # The remaining neighbors are roots of independent components.
        for v in g[centroid]:
            if not dead[v]:
                tasks.append(v)

    sys.stdout.write("\n".join(map(str, answers)))

if __name__ == "__main__":
    solve()
```第一部分构建细分树并对其进行一次生根。 辅助顶点故意放置在原始顶点之后，因此测试`u < n`稍后准确识别必须计数的顶点。 

二元升降台使用两次。`lca`给出两个球中心之间的距离，而`jump`定位交叉路口的新中心。 读取查询时，所有半径都会加倍，与细分树中加倍的边长度相匹配。 

前缀和后缀数组是每个查询仅需要 (O(k)) 个球交叉点的原因。 身份球`(0, INF)`允许第一个前缀或后缀运算的编写方式与其他所有交集完全相同。 

请求数组形成每个树顶点的链表。 这可以避免创建最多 (2n-1) 个包含请求列表的 Python 列表对象，并且还可以避免存储大量四元素元组。 每个请求存储其中心、半径、原始查询索引、系数以及同一中心的下一个请求。 

质心分解是迭代编写的。 具有 (10^5) 个顶点的路径上的递归 DFS 将超出 Python 的递归限制，而质心分解本身具有对数深度，但其分量遍历却没有。 组件查找器显式构造遍历顺序并向后计算子树大小。 

质心计数阶段首先对通过质心的每个原始顶点进行计数。 对于以距质心距离 (d) 为中心的请求，仅半径为`r - d`仍可用于路径的后半段。 前缀数组的答案计算在 (O(1)) 中。 

子组件的第二次遍历具有负权重。 它从第一个计数中删除同子顶点，仅保留从请求中心出发的路径经过当前质心的顶点。 此质心级别完成后，质心将被永久删除，并且每个剩余的邻居都会启动一个独立的子问题。 

所有算术都是整数算术。 Python 整数还消除了对 64 位溢出的任何担忧，否则必须考虑累积答案。 

## 工作示例

 官方示例包含以下树和两个查询，输出为 (5) 和 (7)。 

### 示例 1

 第一个查询有 3 个 Infernape：```
(8, 1)
(3, 1)
(3, 2)
```相关的加热装置是

 [
 B_1={8,9,1,2,7},
 ]

 [
 B_2={3,1,4,10},
 ]

 和

 [
 B_3={3,1,4,10,5,8}。 
]

 交集计算可总结如下。 

| 运营| 产生的交集 | 原始顶点之间的大小 | 系数|
 | --- | --- | --- | --- |
 | (B_2\cap B_3) | ({3,1,4,10}) | 4 | (+1) |
 | (B_1\cap B_3) | ({1,8}) | 2 | (+1) |
 | (B_1\cap B_2) | ({1}) | 1 | (+1) |
 | (B_1\cap B_2\cap B_3) | ({1}) | 1 | (1-3=-2) | (1-3=-2) |

 累计答案为

 [
 4+2+1-2\cdot1=5。 
]

 顶点 (1) 被所有三个 Infernape 加热，因此它最初出现在所有三个省略球交叉点中。 系数 (-2) 正好删除两个副本，根据需要留下一个出现位置。 

### 示例 2

 第二个查询有两个 Infernape：```
(7, 3)
(6, 0)
```第二个球仅包含顶点 (6)。 第一个球包含

 [
 {7,8,1,2,9,3}。 
]

 由于 (k=2)，一个顶点需要至少一个 Infernape 加热，所以答案就是这两个集合的并集。 

| 运营| 结果 | 尺寸| 系数|
 | --- | --- | --- | --- |
 | 仅第一个球 | ({7,8,1,2,9,3}) | ({7,8,1,2,9,3}) 6 | (+1) |
 | 仅第二球 | ({6}) | 1 | (+1) |
 | 两个球 | 空 | 0 | (-1) |

 结果是

 [
 6+1-0=7。 
]

 此示例还练习了空交状态。 该算法不会为空交叉点创建质心请求，因此它的贡献恰好为零。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O((n+K)\log n)) | 二元提升处理 (O(\log n)) 中的每个球交集，质心分解处理 (O(\log n)) 级别上的每个树顶点和每个请求 |
 | 空间| (O(n\log n+K)) | 二进制提升使用 (O(n\log n))，而离线请求和树使用 (O(n+K)) |

 这里 (K) 是所有查询大小的总和，其中 (K\le300000)。 细分树的顶点数少于 (200000)，因此对数因子仍然很小。 离线质心处理避免了暴力方法的 (O(nK)) 瓶颈，并围绕给定的 (10^5) 和 (3\cdot10^5) 限制进行设计。 

## 测试用例

 以下线束假设提交的解决方案保存为`solution.py`。 该样本为官方样本，后面是四个针对性案例。 最后一种情况构造一条具有最大允许值的路径 (n=100000)。```python
import sys
import io
import solution

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    old_input = solution.input

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solution.input = sys.stdin.readline

    try:
        solution.solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        solution.input = old_input

# Official sample
sample = """\
10
1 3
6 4
9 8
1 8
3 4
2 8
10 3
4 5
8 7
2
3
8 1
3 1
3 2
2
7 3
6 0
"""

assert run(sample) == "5\n7", "official sample"

# Minimum-size tree, zero-radius balls.
# Each vertex is heated by exactly one Infernape.
case_min = """\
2
1 2
1
2
1 0
2 0
"""

assert run(case_min) == "2", "minimum-size tree"

# Boundary distance is inclusive.
# On 1-2-3, each endpoint reaches vertex 2.
# The union contains all three vertices.
case_boundary = """\
3
1 2
2 3
1
2
1 1
3 1
"""

assert run(case_boundary) == "3", "inclusive radius boundary"

# Three identical zero-radius balls.
# Only vertex 2 is heated, and it is heated by all three.
case_equal = """\
3
1 2
2 3
1
3
2 0
2 0
2 0
"""

assert run(case_equal) == "1", "identical balls"

# Maximum-size path.
# Both radius-(n-1) balls cover the whole tree.
n = 100000
edges = "\n".join(f"{i} {i + 1}" for i in range(1, n))
case_max = (
    f"{n}\n"
    f"{edges}\n"
    "1\n"
    "2\n"
    f"1 {n - 1}\n"
    f"{n} {n - 1}\n"
)

assert run(case_max) == str(n), "maximum-size path"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 官方 10 顶点示例 |`5`和`7`| 全交集公式和一般质心计数|
 | 两个顶点，半径均为 0 |`2`| 最小树和 (k-1=1) 意味着并集而不是交集的事实 |
 | 路径 (1-2-3)，端点半径 1 |`3`| 包含距离边界 |
 | 三个相同的 0 半径球 |`1`| 重复中心、等球和系数 (1-k) |
 | 生成具有 (100000) 个顶点的路径 |`100000`| 最大值 (n)、最大半径和大树分解 |

 ## 边缘情况

 对于最小树```
2
1 2
1
2
1 0
2 0
```这两个球是 ({1}) 和 ({2})。 它们的完整交点是空的，而省略一个球得到的两个交点的大小为(1)和(1)。 公式给出 (1+1-1\cdot0=2)。 质心阶段永远不会收到空交点的请求，因此它不会意外地计算出无效中心。 

对于包含半径的情况```
3
1 2
2 3
1
2
1 1
3 1
```加倍的树包含边长 (1) 的路径，并且两个原始球的半径加倍 (2)。 它们的边界都准确地到达顶点 (2)。 省略的球交点只是两个原始球，而它们的公共交点是顶点 (2)。 公式为(2+2-1=3)，匹配两个球的并集。 

对于相同的球```
3
1 2
2 3
1
3
2 0
2 0
2 0
```每个球都是单例 ({2})。 每个省略球交点的尺寸为 (1)，完整交点的尺寸也为 (1)。 累计值为

 [
 1+1+1-2\cdot1=1。 
]

 这说明了为什么当一个顶点被所有 (k) 个 Infernape 覆盖时，简单地对 (k) 个省略的交点求和是错误的。 

中点情况发生在```
2
1 2
1
2
1 1
2 1
```细分后，树为(1-x-2)，两个半径都变为(2)。 两个球的交点具有中心 (x)、插入的中点和细分度量中的半径 (1)。 两个原始顶点距 (x) 的距离为 (1)，因此计算的大小为 (2)。 这正是为什么边缘细分是表示的一部分而不仅仅是实现便利的原因。 

最后，最大尺寸路径包含 (100000) 个原始顶点和 (99999) 个边。 放置在半径为 (99999) 的端点处的两个 Infernape 分别覆盖整个路径。 交集也是整条路径，所以答案是（100000）。 质心分解重复地将路径大致切成两半，即使原始树高度不平衡，也保持级别数为对数。
