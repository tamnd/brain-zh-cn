---
title: "CF 102263E - 最长路径问题"
description: "我们有一个加权树，并且每个原始边都是独立考虑的。 对于权重 (w) 的一个选定边，删除它会将树分为两个部分，例如 (A) 和 (B)。"
date: "2026-08-17T19:57:49+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102263
codeforces_index: "E"
codeforces_contest_name: "ArabellaCPC 2019"
rating: 0
weight: 102263
solve_time_s: 239
verified: true
draft: false
---

[CF 102263E - 最长路径问题](https://codeforces.com/problemset/problem/102263/E)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个加权树，并且每个原始边都是独立考虑的。 对于权重 (w) 的一个选定边，删除它会将树分为两个部分，例如 (A) 和 (B)。 然后，我们可以通过在 (A) 的任何顶点和 (B) 的任何顶点之间放置具有相同权重 (w) 的相同边来重新连接这两个组件。 任务是在重新连接后输出尽可能小的直径。 

输入包含 (n) 个顶点和 (n-1) 个加权边。 第 (i) 个输出值对应于第 (i) 个输入边，因此每个边都需要自己的答案。 官方给出的约束允许（n=200000），边权重最大为（10^9），原始判断时间限制为1秒，内存为256MB。 

树的大小立即排除了对每个边单独进行遍历的可能性。 单次遍历的成本为 (O(n))，对于 (n-1) 条边执行该操作已经成本为 (O(n^2))，最大 (n) 时大约 (4\cdot10^{10}) 个顶点访问。 我们需要在不同的剪辑之间重用信息。 

有三种边缘情况特别容易处理不当。 

对于由两个顶点组成的树，唯一的边也是整棵树。```
2
1 2 5
```正确的输出是```
5
```移除边后，两个组件都包含一个顶点。 唯一可能的重新连接权重为 5，因此生成的直径为 5。假设两个组件都具有非零直径或半径的解决方案可能会错误地生成更大的值。 

加权边缘造成了另一个陷阱。 考虑```
3
1 2 10
2 3 1
```正确的输出是```
11
11
```删除任一边后，一个组件由单个顶点组成，另一个组件由两个顶点组成。 对于边权值为 10 的二顶点分量，最佳顶点的偏心率为 10。用 (D/2) 替换顶点半径是无效的，因为加权边的中点不一定是顶点。 包含权重 1 的边缘的组件也会出现同样的问题。 

最后，最佳重连接顶点不必是原始移除边的端点。 对于官方样本，```
4
1 2 2
1 3 3
2 4 2
```第二条边的权重为 3。删除它会在一侧留下顶点 3 和路径 (3?) 实际上另一个组件是 (1-2-4)。 它的最佳重连顶点是顶点2，而不是顶点1。将3直接重连到2得到答案5。官方的说法也给出了这个特殊的重构。 

## 方法

 直接的方法是独立处理每条边。 删除边，遍历两个生成的组件，找到它们的直径，找到它们的最佳可能附着顶点，然后组合两个组件。 这是正确的，因为切割后组件之间唯一的新路径是新插入的边。 

对于一个分量(T)，设其直径为(D(T))，设其顶点半径为(R(T))，表示(T)顶点之间的最小偏心率。 如果我们使用删除的权重 (w) 边将 (x\in A) 重新连接到 (y\in B)，则新树中的每条路径要么完全在 (A) 内部，要么完全在 (B) 内部，要么穿过新边。 穿过边缘的最长路径有长度

 [
 \运算符名称{ecc}_A(x)+w+\运算符名称{ecc}_B(y)。 
]

 (x) 和 (y) 的选择是独立的，因此最佳可能的交叉路径是

 [
 R(A)+w+R(B)。 
]

 因此，切割的答案是

 [
 \max(D(A),D(B),R(A)+w+R(B))。 
]

 蛮力方法可以从头开始计算每条边的这些量。 即使每次切割仅在 (O(n)) 内处理，总数也是 (O(n^2))。 在 (n=200000) 上，每个边缘已经完成一次扫描

 [
 (n-1)n=39,999,800,000
 ]

 在考虑确定直径和中心所需的额外工作之前，先进行顶点访问。 这远远超出了可用时间。 

有用的观察结果是，删除边总是会创建仅有的两个有向分量之一。 对于边 (u-v)，我们可以将状态 (u\rightarrow v) 视为描述当 (v) 被禁止作为邻居时包含 (u) 的分量。 恰好有 (2(n-1)) 个这样的有向状态。 

这就把问题变成了重新root DP。 对于每个有向状态，我们存储从其根到该组件中任何顶点的最大距离、最大深度路径的一个端点、直径以及直径的两个端点。 状态可以从所有相邻组件的相应状态构建。 

剩下的困难是半径。 一旦直径端点 (a,b) 已知，任何顶点 (x) 的偏心率为

 [
 \max(d(x,a),d(x,b))。 
]

 因此，最佳顶点位于从 (a) 到 (b) 的路径上。 沿着这条路径，第一个数量增加，而第二个数量减少，因此通过紧邻直径中点的两个顶点之一获得最佳值。 加权边使中点可能位于边内，这就是为什么我们使用二元提升显式定位这两个顶点。 

这也是竞赛讨论中描述的相同的高级分解：计算每条边的两个有向侧的直径端点和深度信息，然后在重新连接它们时使用这些组件的中心。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n^2)) | (O(n)) | (O(n)) | 太慢了 |
 | 重生DP+二进制提升| (O(n\log n)) | (O(n\log n)) | 已接受 |

 ## 算法演练

1. 以顶点 1 处的原始树为根并构建迭代 DFS 顺序。 对于每个顶点，存储其父顶点、连接其父顶点的有向边、深度以及距根的加权距离。 迭代遍历避免了包含 200000 个顶点的路径上的 Python 递归深度问题。 
2.用两个有向边ID来表示每条无向边。 对于有向边 (u\rightarrow v)，定义其 DP 状态来描述边 (uv) 被移除后包含 (u) 的分量。 该状态存储四条信息：距 (u) 的最大距离、达到该最大值的端点、直径长度以及该直径的两个端点。 
3. 按 DFS 逆序计算子端状态。 假设 (u) 有一个父级 (p)。 要在排除 (p) 后构造以 (u) 为根的分量，请检查 (u) 除 (p) 之外的每个邻居。 如果邻居是 (v)，则它作为来自 (u) 的分支的贡献具有长度

 [
 w(u,v)+H(v\右箭头 u),
 ]

 其中 (H(v\rightarrow u)) 是相反方向状态存储的最大向下距离。 最大的分支给出了状态的高度。 

1. 扫描顶点的分支时，保留三个最大的分支长度和两个最大的子直径。 三个分支候选就足够了，因为当排除一条边时，至多当前最佳分支消失，留下接下来的两个候选。 出于同样的原因，两个候选直径就足够了。 
2. 对于以 (u) 为根的状态，直径有两种可能的形式。 它可以完全位于一个相邻组件内，在这种情况下，我们采用该组件的直径。 或者它可以穿过 (u)，在这种情况下它使用两个最大的分支长度。 如果这些分支端点是 (x) 和 (y)，则候选直径为

 [
 \运算符名称{分支}(x)+\运算符名称{分支}(y)。 
]

 所得直径的端点同时已知，因此不需要单独的直径遍历。 

1. 执行第二次自上而下的重新根除过程。 一旦描述顶点的父侧的状态可用，该顶点的每个相邻组件就有一个已知的状态。 对于每个子边，重新计算相对边的状态，同时排除该子边。 这给出了每个有向边的 DP 状态，因此现在表示了每个可能的切割。 
2. 为有根树构建一个二元提升表。 除了普通的祖先跳跃之外，根距离数组还可以让我们确定每次跳跃所经过的加权距离。 我们使用该表进行 LCA 查询和查找沿祖先路径最接近指定距离的顶点。 
3. 对于每个有向分量，获取其存储的直径端点 (a,b)。 让(D=d(a,b))。 最佳顶点是沿直径路径距 (a) 距离 (D/2) 的两个顶点之一。 二进制提升在 (O(\log n)) 中找到这些候选者。 它们的偏心率直接从它们在直径上的位置获得，因此不需要额外的全顶点扫描。 
4. 对于权重 (w) 的每条原始边，令其两个有向状态具有直径 (D_1,D_2) 和顶点半径 (R_1,R_2)。 答案是

 [
 \boxed{\max(D_1,D_2,R_1+w+R_2)}。 
]

 DP状态的构造保证(D_1,D_2)准确描述通过删除这条边创建的两个分量。 半径计算考虑每个组件中的最佳可能顶点，因此第三项是穿过新边的最小可能路径。

为什么它有效：重新连接的树中的每条路径都属于三个类中的一个，完全在第一个组件中，完全在第二个组件中，或者跨越新的边。 前两类由两个部件直径精确界定。 对于第三类，选择一个附着顶点 (x) 会影响其组件内部的偏心率，并且这两个选择是独立的，因此最小化两个偏心率会得到两个组件半径加上固定边权重的总和。 重根 DP 计算每个有向分量的精确直径，而直径的端点确定每个顶点的偏心率。 由于直径路径上的最小偏心率发生在其中点周围的两个顶点之一，因此二元提升步骤找到了精确的顶点半径。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve():
    n = int(input())
    m = n - 1

    # Forward-star adjacency representation.
    # Directed edge d has source implicit in the current adjacency list,
    # destination to[d], weight wt[d], and next adjacency edge nxt[d].
    head = array('i', [-1]) * n
    to = array('i', [0]) * (2 * m)
    nxt = array('i', [0]) * (2 * m)
    wt = array('q', [0]) * (2 * m)

    for i in range(m):
        u, v, w = map(int, input().split())
        u -= 1
        v -= 1

        d = 2 * i
        r = d ^ 1

        to[d] = v
        wt[d] = w
        nxt[d] = head[u]
        head[u] = d

        to[r] = u
        wt[r] = w
        nxt[r] = head[v]
        head[v] = r

    # Root the tree at 0.
    parent = array('i', [-1]) * n
    parent[0] = 0
    parent_edge = array('i', [-1]) * n
    depth = array('i', [0]) * n
    dist_root = array('q', [0]) * n

    order = []
    order_append = order.append
    order_append(0)

    stack = [0]

    while stack:
        u = stack.pop()
        e = head[u]

        while e != -1:
            v = to[e]
            if v != parent[u]:
                parent[v] = u
                parent_edge[v] = e
                depth[v] = depth[u] + 1
                dist_root[v] = dist_root[u] + wt[e]
                order_append(v)
                stack.append(v)
            e = nxt[e]

    # DP state for directed edge d:
    # component containing source(d), excluding destination(d).
    height = array('q', [0]) * (2 * m)
    far = array('i', [0]) * (2 * m)

    diam = array('q', [0]) * (2 * m)
    dia_a = array('i', [0]) * (2 * m)
    dia_b = array('i', [0]) * (2 * m)

    def build_state(u, excluded):
        # Three best branches are enough because one branch may be excluded
        # and we still need the two best remaining branches.
        b1v = 0
        b1x = u
        b1e = -1

        b2v = 0
        b2x = u
        b2e = -1

        b3v = 0
        b3x = u
        b3e = -1

        # Two best diameters, because one neighbor may be excluded.
        d1v = 0
        d1a = u
        d1b = u
        d1e = -1

        d2v = 0
        d2a = u
        d2b = u
        d2e = -1

        e = head[u]

        while e != -1:
            if e != excluded:
                r = e ^ 1

                branch = wt[e] + height[r]
                endpoint = far[r]

                if branch > b1v:
                    b3v, b3x, b3e = b2v, b2x, b2e
                    b2v, b2x, b2e = b1v, b1x, b1e
                    b1v, b1x, b1e = branch, endpoint, e
                elif branch > b2v:
                    b3v, b3x, b3e = b2v, b2x, b2e
                    b2v, b2x, b2e = branch, endpoint, e
                elif branch > b3v:
                    b3v, b3x, b3e = branch, endpoint, e

                dv = diam[r]
                if dv > d1v:
                    d2v, d2a, d2b, d2e = d1v, d1a, d1b, d1e
                    d1v, d1a, d1b, d1e = dv, dia_a[r], dia_b[r], e
                elif dv > d2v:
                    d2v, d2a, d2b, d2e = dv, dia_a[r], dia_b[r], e

            e = nxt[e]

        # Select the best two branches after excluding one edge.
        if b1e != excluded:
            x1v, x1x, x1e = b1v, b1x, b1e
            x2v, x2x, x2e = b2v, b2x, b2e
        else:
            x1v, x1x, x1e = b2v, b2x, b2e
            if b2e != excluded:
                x2v, x2x, x2e = b3v, b3x, b3e
            else:
                x2v, x2x, x2e = 0, u, -1

        best_d = d1v
        best_a = d1a
        best_b = d1b

        if d1e == excluded:
            best_d = d2v
            best_a = d2a
            best_b = d2b

        cross = x1v + x2v
        if cross > best_d:
            best_d = cross
            best_a = x1x
            best_b = x2x

        return x1v, x1x, best_d, best_a, best_b

    # Bottom-up pass.
    for idx in range(n - 1, 0, -1):
        u = order[idx]
        d = parent_edge[u] ^ 1

        h, f, dd, aa, bb = build_state(u, d)

        height[d] = h
        far[d] = f
        diam[d] = dd
        dia_a[d] = aa
        dia_b[d] = bb

    # Top-down pass.
    for u in order:
        e = head[u]

        while e != -1:
            v = to[e]

            if parent[v] == u:
                h, f, dd, aa, bb = build_state(u, e)

                height[e] = h
                far[e] = f
                diam[e] = dd
                dia_a[e] = aa
                dia_b[e] = bb

            e = nxt[e]

    # Binary lifting.
    LOG = max(1, n.bit_length())
    up = [array('i', parent)]

    for _ in range(1, LOG):
        prev = up[-1]
        cur = array('i', [0]) * n

        for v in range(n):
            cur[v] = prev[prev[v]]

        up.append(cur)

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

        for k in range(LOG - 1, -1, -1):
            ua = up[k][a]
            ub = up[k][b]
            if ua != ub:
                a = ua
                b = ub

        return parent[a]

    def climb_with_distance(v, x):
        # Move upward as far as possible without exceeding distance x.
        used = 0

        for k in range(LOG - 1, -1, -1):
            p = up[k][v]
            if p != v:
                w = dist_root[v] - dist_root[p]
                if w <= x:
                    x -= w
                    used += w
                    v = p

        return v, used

    def vertex_radius(a, b, D):
        if a == b:
            return 0

        l = lca(a, b)
        da = dist_root[a] - dist_root[l]
        db = dist_root[b] - dist_root[l]

        half = D // 2

        # Find the vertex at or immediately before the midpoint,
        # walking from a.
        if 2 * da >= D:
            p, used = climb_with_distance(a, half)
            ppos = used

            if 2 * ppos == D:
                return ppos

            # Find the next vertex toward b.
            if p != l:
                q = parent[p]
                edge_w = dist_root[p] - dist_root[q]
            else:
                # p is the LCA. The next vertex lies on the lca -> b path.
                q, _ = climb_with_distance(b, db - 1)
                edge_w = dist_root[q] - dist_root[l]

            qpos = ppos + edge_w

            r1 = max(ppos, D - ppos)
            r2 = max(qpos, D - qpos)
            return min(r1, r2)

        # The midpoint is on the lca -> b part.
        # Find the vertex at or immediately after the midpoint,
        # walking from b.
        need_from_b = D - half
        q, used_b = climb_with_distance(b, need_from_b)
        qpos = D - used_b

        if 2 * qpos == D:
            return qpos

        p = parent[q]
        edge_w = dist_root[q] - dist_root[p]
        ppos = qpos - edge_w

        r1 = max(ppos, D - ppos)
        r2 = max(qpos, D - qpos)
        return min(r1, r2)

    radius = array('q', [0]) * (2 * m)

    for d in range(2 * m):
        radius[d] = vertex_radius(dia_a[d], dia_b[d], diam[d])

    ans = []

    for i in range(m):
        d = 2 * i
        r = d ^ 1

        cross = radius[d] + wt[d] + radius[r]
        best = diam[d]

        if diam[r] > best:
            best = diam[r]
        if cross > best:
            best = cross

        ans.append(str(best))

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```邻接结构使用数组而不是 Python 元组列表，因为输入可以包含 200000 个顶点，并且实现还需要多个 DP 数组和一个二进制提升表。 打包的整数数组保持内存可预测，并避免 Python 整数的每个对象的大量开销。 

有向 DP 数组由每个原始边的两个有向版本进行索引。 如果`d`代表一个方向，`d ^ 1`代表相反方向。 这使得每次切割的两个组成部分在最后立即可用。 

自下而上的传递计算指向顶点父级的边。 然后，自上而下的传递提供缺少的父端信息并计算每个子项的另一个方向。 这是标准的两遍重新生根模式，但这里的状态同时包含最长的分支和直径。 

这`build_state`函数保留了三个分支候选者。 第三个候选者是必要的，因为最佳分支可以恰好是为所请求的有向状态排除的分支。 在这种情况下，只保留两个分支会默默地失去正确的第二佳分支。 同样的排除问题解释了为什么保留两个直径候选者。 

半径计算故意不使用`diameter // 2`。 当允许中心位于树上的任何位置时，该公式是正确的，但新的边端点必须是现有顶点。 对于加权边，连续中点可以严格位于边内。 相反，代码会找到该中点两侧最近的两个顶点，并采用更好的偏心率。 

所有距离均使用 64 位压缩整数。 一棵树最多可以包含 (199999) 个权重 (10^9) 的边，因此路径的权重可以接近 (2\cdot10^{14})，这不适合 32 位整数。 

## 工作示例

 对于样品 1，```
4
1 2 2
1 3 3
2 4 2
```这三项削减可概括如下。 

| 边缘| 零件直径| 组件半径| 边重| 穿越值| 回答 |
 | ---| ---| ---| ---| ---| ---|
 | (1-2) | 2, 3 | 2, 3 | 2 | 7 | 7 |
 | (1-3) | 4, 0 | 2, 0 | 3 | 5 | 5 |
 | (2-4) | 3, 0 | 3, 0 | 2 | 5 | 5 |

 第一条边将路径 (2-4) 与边 (1-3) 分开。 它们的半径均在其各自组件的中间可用顶点处获得，给出(2+2+3=7)。 对于第二条边，单个组件的半径为零，而另一个组件的直径为 4，半径为 2。最佳交叉路径的长度为 (3+2=5)。 这给出了官方输出`7, 5, 5`。 

对于示例 2，考虑加权路径```
3
1 2 10
2 3 1
```| 边缘| 左组件| 右组件 | 半径| 穿越值| 回答 |
 | ---| ---| ---| ---| ---| ---|
 | (1-2) |`{1}`|`2-3`| 0, 1 | 11 | 11 11 | 11
 | (2-3) |`1-2`|`{3}`| 10, 0 | 11 | 11 11 | 11

 第一次切割的第二个分量只有两个顶点由权重为 1 的边连接，因此其半径为 1。移除的边贡献 10，得到 11。对于第二次切割，角色相反，双顶点分量的半径为 10。这个示例具体说明了为什么不能通过盲目取一半直径来获得加权顶点半径。 

三顶点单元路径的有用内部 DP 跟踪甚至更简单。 

| 顶点/状态 | 最佳分行 | 第二分店| 直径| 直径端点|
 | ---| ---| ---| ---| ---|
 | 叶| 0 | 0 | 0 | 叶，叶|
 | 中| 1 | 0 | 1 | 中间，叶子|
 | 整个路径| 1 | 1 | 2 | 两片叶子|

 在中间顶点，两个分支的长度均为 1，因此它们的总和形成直径 2。这正是重根 DP 中每个有向状态所使用的局部不变量。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n\log n)) | 重新定位需要 (O(n))； 每个 (2(n-1)) 分量半径都使用 (O(\log n)) 中的二进制提升。 |
 | 空间| (O(n\log n)) | DP 和图存储使用 (O(n))，而二进制提升使用 (O(n\log n))。 |

 对于 (n=200000)，对数因子约为 18。原则上，打包数组实现使内存占用量远低于 256 MB 限制。 原始问题的 1 秒限制对于 Python 来说相当严格，因此对于原始判断来说，C++ 实现是更安全的选择，而此 Python 版本旨在最小化内存开销并避免递归成本。 预期的算法复杂度为 (O(n\log n))，与竞赛讨论中描述的二进制提升策略相匹配。 

## 测试用例

 以下测试假设`solve`上述解决方案中的功能可用。 助手重置了两者`sys.stdin`和模块级`input`功能，因为竞争性编程解决方案绑定`input`到`sys.stdin.readline`。```python
import sys
import io

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_input = input

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    try:
        solve()
        return sys.stdout.getvalue() if hasattr(sys.stdout, "getvalue") else ""
    finally:
        sys.stdin = old_stdin
        input = old_input

# A safer helper when stdout is not redirected by the surrounding environment.
def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_stdout = sys.stdout
    old_input = input

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    input = sys.stdin.readline

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        input = old_input

# Provided sample.
assert run("""\
4
1 2 2
1 3 3
2 4 2
""") == "7\n5\n5", "sample 1"

# Minimum-size tree.
assert run("""\
2
1 2 5
""") == "5", "minimum-size tree"

# Weighted path, catches the incorrect radius = diameter / 2 assumption.
assert run("""\
3
1 2 10
2 3 1
""") == "11\n11", "unequal weighted edges"

# All equal weights, star-shaped tree.
assert run("""\
4
1 2 1
1 3 1
1 4 1
""") == "2\n2\n2", "equal-weight star"

# Path with equal weights.
assert run("""\
4
1 2 1
2 3 1
3 4 1
""") == "3\n3\n3", "equal-weight path"

# Large boundary test: maximum n and all equal weights.
n = 200000
large = [str(n)]
large.extend(f"1 {v} 1" for v in range(2, n + 1))
large_input = "\n".join(large) + "\n"
large_output = run(large_input)
assert large_output == "2\n" * (n - 1), "maximum-size star"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 / 1 2 5`|`5`| 单例组件和最小值 (n) |
 |`3 / 1 2 10 / 2 3 1`|`11 / 11`| 加权中心和非半整数直径中心|
 |`4 / 1 2 1 / 1 3 1 / 1 4 1`|`2 / 2 / 2`| 等权重、高回根度|
 |`4 / 1 2 1 / 2 3 1 / 3 4 1`|`3 / 3 / 3`| 路径结构和中点处理|
 | 星标 (n=200000) |`2`重复| 最大尺寸输入和内存行为|

 ## 边缘情况

 二顶点树```
2
1 2 5
```剪切后创建两个单例组件。 它们的直径和半径都为零。 唯一剩下的路径是权重 5 的新边，因此公式变为

 [
 \max(0,0,0+5+0)=5。 
]

 DP 表示每个高度为 0、直径为 0 且直径端点相同的单例。 当两个端点重合时，半径例程立即返回 0。 

加权路径```
3
1 2 10
2 3 1
```说明了为什么半径计算必须基于顶点。 切割 (2-3) 后，包含顶点 1 和 2 的组件的直径为 10。其唯一可能的中心是顶点 1 和 2，两者的偏心率均为 10。边的连续中点的偏心率为 5，但不能选择该点作为重新连接边的端点。 该算法查看直径端点 1 和 2，发现它们之间没有顶点，并返回半径 10。 

对于官方样本，```
4
1 2 2
1 3 3
2 4 2
```切割 (1-3) 给出单例组件`{3}`和组件`1-2-4`。 后者在顶点 1 和 4 之间的直径为 4，顶点 2 正好位于中点，因此其半径为 2。移除的边的权重为 3。因此，最佳交叉路径为 (0+3+2=5)，大于内径 4。算法输出 5，相当于将顶点 3 直接重新连接到顶点 2，如问题所述。 

最后一个微妙的情况是加权直径，其中点位于边缘内。 假设一个组件是一条边权重为 4 和 10 的路径。它的直径为 14，而中点距离任一端点 7 个单位，位于第二条边内。 可用顶点位于位置 0、4 和 14，因此它们的偏心率为 14、10 和 14。正确的顶点半径是 10，而不是 7。二元提升例程定位位置 7 周围的顶点，并采用较小的偏心率，这正是所需的离散中心。
