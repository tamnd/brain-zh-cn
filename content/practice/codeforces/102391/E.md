---
title: "CF 102391E - 死仙人掌协会"
description: "我们从连接的加权仙人掌开始。 每个原始顶点(v)具有修复值(RVv)，并且每个原始边(e)具有长度(Le)和修复值(REe)。 对于每个循环，必须恰好删除一个边缘。 删除一条边 (e={u,v}) 并不是简单地将其删除。"
date: "2026-08-14T14:13:40+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102391
codeforces_index: "E"
codeforces_contest_name: "XX Open Cup, Grand Prix of Korea"
rating: 0
weight: 102391
solve_time_s: 498
verified: false
draft: false
---

[CF 102391E - 死仙人掌协会](https://codeforces.com/problemset/problem/102391/E)

 **评级：** -
 **标签：** -
 **求解时间：** 8m 18s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们从连接的加权仙人掌开始。 每个原始顶点(v)具有修复值(RV_v)，并且每个原始边(e)具有长度(L_e)和修复值(RE_e)。 

对于每个循环，必须恰好删除一个边缘。 删除一条边 (e={u,v}) 并不是简单地将其删除。 相反，一个新叶子以边长度 (RV_u+RE_e) 附加到 (u)，另一个新叶子以边长度 (RV_v+RE_e) 附加到 (v)。 对每个循环执行此操作后，该图就是一棵树。 我们希望最终树的直径尽可能最小。 

输入最多包含 (100,000) 个原始顶点和 (150,000) 个边。 由于这里的连通图有 (M-N+1) 个独立循环，因此可以有近 (50,000) 个循环。 边长和愈合值达到 (10^9)，因此答案可以在 (10^{14}) 左右。 这排除了枚举已移除边缘的所有选择，并且也意味着每次距离计算都必须使用 64 位整数。 (O((N+M)\log V)) 解适合 (10) 秒限制。 

粗心的解决方案可能会因多种原因而失败。 

考虑尽可能小的仙人掌，即所有原始边长等于 (1)、所有顶点修复值 (0) 和所有边修复值 (1) 的三角形。```
3 3
0 0 0
1 2 1 1
2 3 1 1
3 1 1 1
```答案是（4）。 切割任何边缘后，剩余的两个原始边缘形成长度为 (2) 的路径，并且两个新的愈合边缘会添加另一个 (2)。 仅计算原始顶点之间的直径的解决方案将错误地报告 (2)。 

第二个陷阱是，切割的最佳边缘不一定是最短的边缘。 样本 1 包含一个三角形，其中最短边切削刃 (1\text{-}2) 给出直径 (12)，而切削刃 (2\text{-}3) 给出最佳直径 (10)。 所选边的修复值会改变两个新叶子，因此仅原始边长度是不够的。```
3 3
1 2 3
3 1 2 3
1 2 1 2
2 3 3 1
```第三个常见错误是忘记桥梁。 它们永远不会被切割，但它们仍然为穿过它们的每条路径贡献其普通的边缘长度。 例如，```
4 4
0 0 0 0
1 2 1 1
2 3 1 1
3 1 1 1
3 4 10 1
```有答案（12）。 三角形被分成一条路径，长度为 (10) 的桥仍然连接到顶点 (3)。 将每个双连通分量视为可以自由修改的循环将给出无效状态。 

## 方法

 直接的解决方案是枚举每个周期中移除的边。 如果循环的长度为 (c_1,c_2,\ldots,c_k)，则有

 [
 \prod_{i=1}^{k}c_i
 ]

 可能的最终树。 对于每个选择，我们可以构建结果树并在 (O(N+M)) 中运行树直径算法。 

这是正确的，因为每棵合法的最终树都对应于每个循环中一条边的一个选择。 问题在于选择的数量。 由共享一个关节顶点的大约 (50,000) 个三角形组成的仙人掌有大约 (3^{50,000}) 个不同的选择。 即使每个选择只进行一次操作也已经是无望的，并且重新计算直径使得暴力破解大致为 (O(3^{50,000}(N+M)))。 

有用的观察是目标是最小可能的最大值。 这立即表明二分搜索。 固定一个候选直径（R），并询问是否存在某种方法来切割最终直径最大为（R）的仙人掌。 这个可行性条件是单调的：如果(R)可行，则每个较大的值也是可行的。 

剩下的问题是如何有效地检查 (R) 的一个值。 仙人掌具有非常有用的分解作用。 每个双连接组件要么是一个单桥，要么是一个简单的循环。 用单独的块节点替换每个循环给出了块切割树。 该树包含所有结构选择，而每个单独的循环都可以作为一个本地对象进行处理。 官方竞赛教程正是使用了这种分解以及反向 DFS 动态程序和二分搜索。 

对于此分解的每个节点 (u)，将 (d_u) 定义为从 (u) 到已处理子树内最远顶点的最小可能距离，条件是该子树内的每个直径最多为 (R)。 如果不存在有效选择，则 (d_u) 为无穷大。 

对于普通的原始顶点，过渡是标准的树过渡。 每个孩子贡献其最远的距离，并且两个最大贡献的总和必须最多为（R）。 最大贡献变为(d_u)。 

循环更加复杂，因为我们可以切割它的任何一条边。 一旦边缘被切断，循环就变成了一条路径，每个端点都有一片愈合的叶子。 如果从其父关节顶点查看循环，则每个可能的切割都会将其分为左路径和右路径。 我们可以使用前缀和后缀动态规划来扫描两侧，因此在循环的线性预处理之后，每个可能的切割都会在恒定时间内被评估。 

关键的结构事实是只需要从每个循环顶点到其附加子树的距离。 一旦知道了这些值，循环的其余部分就只是一个加权路径加上两个候选治疗叶。 这就是将周期边缘上明显的指数选择减少为每个周期的线性工作的原因。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(3^{\Theta(N)}(N+M))) 最坏情况 | (O(N+M)) | 太慢了 |
 | 最佳 | (O((N+M)\log V)) | (O(N+M)) | 已接受 |

 ## 算法演练

 1. 使用 Tarjan 的双连通分量算法将仙人掌分解为桥和简单的循环。 

对于每个桥，将其两个原始顶点直接连接到新的块切割树中。 对于每个循环，创建一个额外的循环节点并将其连接到属于该循环的每个顶点。 生成的图是一棵树，因为每个循环都被单个块节点替换。 

对于每个循环，我们还按循环顺序保留其顶点以及相应的原始边 ID。 在评估每个可能的移除边缘时需要此顺序。 

1. 对答案进行二分查找。

令 (R) 为当前候选直径。 可行性检查确定某些合法的切割集是否会生成最大直径 (R) 的树。 

通过取所有原始边缘长度和所有可能的愈合边缘长度中的最大值来获得上限。 最终直径最多使用 (N-1) 个普通树边，每个周期最多使用两个愈合边，因此

 \maxWeight\left(N-1+2(M-N+1)\right)。 
]

 1. 以逆DFS顺序处理分块树。 

对于每个原始顶点 (u)，所有子子树都已经生成了它们的 (d) 值。 如果子节点是由长度为 (w) 的桥连接的原始顶点，则其贡献为 (d_v+w)。 如果子级是循环块，则其 (d_v) 已经包含从 (u) 开始的整个循环路径，因此不会添加额外的边长度。 

保留两个最大的贡献 (x) 和 (y)。 如果(x+y>R)，候选直径是不可能的。 否则设置 (d_u=x)。 

1. 处理以其父顶点为枢轴的循环块。 

假设循环包含顶点

 [
 v_0,v_1,\l点,v_{L-1},v_L
 ]

 其中 (v_0=v_L) 是枢轴。 让边 (e_i) 连接 (v_i) 和 (v_{i+1})。 

对于每个非枢轴顶点 (v_i)，(d_{v_i}) 是已知的。 将 (l_i) 定义为沿循环左侧从枢轴到 (v_i) 的距离：

 [
 l_0=0,\qquad
 l_i=l_{i-1}+L_{e_{i-1}}。 
]

 类似地，定义沿另一个方向的后缀距离 (r_i)。 

第一组前缀值记录距枢轴的最远距离：

 [
 LD_i=\max_{1\le j\le i}(d_{v_j}+l_j)。 
]

 我们还需要

 [
 LF_i=\max_{1\le j\le i}(d_{v_j}-l_j),
 ]

 因为对于两棵子树 (p<q)，它们通过路径的距离是

 [
 (d_{v_p}-l_p)+(d_{v_q}+l_q)。 
]

 因此，端点都在左侧的最佳直径可以通过以下方式逐步更新：

 \max(LG_{i-1},LF_{i-1}+d_{v_i}+l_i)。 
]

 右侧使用对称后缀数组（RD，RF，RG）。 官方解决方案从这两个子树距离表达式得出相同的左半递归。 

1. 将治疗叶子添加到循环过渡中。 

假设边 (e_{i-1}) 是我们切割的边。 它的端点是 (v_{i-1}) 和 (v_i)，所以两个新的叶子长度是

 [
 a=RV_{v_{i-1}}+RE_{e_{i-1}},
 ]

 和

 [
 b=RV_{v_i}+RE_{e_{i-1}}。 
]

 切割后，循环变为从(v_{i-1})到(v_i)的路径。 该局部结构内的每个可能的直径都属于六种端点类型之一。 

第一种类型的两个端点都在左侧。 其值为左前缀直径(LG_{i-1})。 

第二种类型的两个端点都在右侧。 其值为(RG_i)。 

第三种类型的一个端点位于左子树中，一个端点位于右子树中。 其值为(LD_{i-1}+RD_i)。 

第四种类型使用 (v_{i-1}) 处的新愈合叶子和右侧部分的端点。 其值为

 [
 a+\max(LH_{i-1},l_{i-1}+RD_i)。 
]

 第五种类型是对称的，使用 (v_i) 处的愈合叶子：

 [
 b+\max(RH_i,r_{i+1}+LD_{i-1})。 
]

 第六种类型通过剩余的循环路径直接连接两个新的愈合叶子：

 [
 a+l_{i-1}+r_{i+1}+b。 
]

 取这六个值中的最大值。 如果该最大值至多为 (R)，则该特定切割有效。 

对于有效切割，在此处理循环中从枢轴到最远顶点的距离为

 [
 D=
 \最大(
 LD_{i-1},
 RD_i，
 a+l_{i-1},
 b+r_{i+1}
 ）。 
]

 循环块在其所有可能的切割边缘上取最小值 (D)。 

1. 一旦子树没有有效状态，就拒绝候选者。 

如果原始顶点有两个子分支，其组合距离超过 (R)，则该子树之外的任何选择都无法修复违规。 同样，如果循环中每个可能的切割都超过 (R)，则该循环不能成为直径最多为 (R) 的解的一部分。 

1. 处理根后，当根具有有限 (d) 值时，候选 (R) 恰好是可行的。 

然后二分查找返回最小的可行值 (R)。 

### 为什么它有效

不变量是 (d_u) 是已处理子树的所有有效配置中距 (u) 的最小可能最远距离，每个内径最多为 (R)。 

对于普通顶点，只有两个最深的子分支可以形成穿过该顶点的直径，因此保留尽可能小的最大深度就足够了。 对于循环块，一旦其切割边缘固定，该块就变成一条路径，并且每个可能的直径的端点恰好位于上述六个类别之一。 前缀和后缀最大值计算每个类别的最佳值，而无需枚举顶点对。 在每次有效切割上采用最小深度可以准确地为父级保留最佳的状态。 

因此，当某些合法的循环割集产生直径最大为 (R) 的树时，根是可行的。 由于可行性是单调的，二分查找给出了可能的最小直径。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(1_000_000)

INF = 10**30

def solve():
    n, m = map(int, input().split())
    rv = [0] + list(map(int, input().split()))

    U = [0] * (m + 1)
    V = [0] * (m + 1)
    W = [0] * (m + 1)
    RE = [0] * (m + 1)

    g = [[] for _ in range(n + 1)]

    max_base = 0

    for eid in range(1, m + 1):
        a, b, w, re = map(int, input().split())
        U[eid] = a
        V[eid] = b
        W[eid] = w
        RE[eid] = re
        g[a].append((b, eid))
        g[b].append((a, eid))
        max_base = max(max_base, w, rv[a] + re, rv[b] + re)

    # Tarjan decomposition.
    dfn = [0] * (n + 1)
    low = [0] * (n + 1)
    edge_stack = []

    # Block-cut tree.
    # Original vertices are 1..n.
    # Cycle block vertices are n+1..cnt.
    t = [[] for _ in range(n + 2)]

    # cycle_info[node] = (vertices, edge_ids)
    # vertices has length len(edge_ids)+1 and starts/ends at the pivot.
    cycle_info = [None] * (n + 1)

    timer = 0
    cnt = n
    max_cycle_len = 0

    def add_component(pivot, edges):
        nonlocal cnt, max_cycle_len

        if len(edges) == 1:
            eid = edges[0]
            a = U[eid]
            b = V[eid]
            t[a].append((b, eid))
            t[b].append((a, eid))
            return

        cnt += 1
        node = cnt

        # A cactus biconnected component with more than one edge
        # is a simple cycle. Build its cyclic order locally.
        local = {}
        for eid in edges:
            a = U[eid]
            b = V[eid]
            local.setdefault(a, []).append(eid)
            local.setdefault(b, []).append(eid)

        verts = [pivot]
        eids = []

        cur = pivot
        prev_eid = 0

        while True:
            choices = local[cur]
            if choices[0] != prev_eid:
                eid = choices[0]
            else:
                eid = choices[1]

            eids.append(eid)

            a = U[eid]
            b = V[eid]
            nxt = b if a == cur else a

            verts.append(nxt)

            prev_eid = eid
            cur = nxt

            if cur == pivot:
                break

        cycle_info.append((verts, eids))
        max_cycle_len = max(max_cycle_len, len(eids))

        # Connect every cycle vertex to the block node.
        for i in range(len(eids)):
            v = verts[i]
            eid = eids[i]
            t[node].append((v, eid))
            t[v].append((node, eid))

    def tarjan(u, parent_eid):
        nonlocal timer

        timer += 1
        dfn[u] = low[u] = timer

        for v, eid in g[u]:
            if eid == parent_eid:
                continue

            if dfn[v] == 0:
                edge_stack.append(eid)
                tarjan(v, eid)

                if low[v] < low[u]:
                    low[u] = low[v]

                if low[v] >= dfn[u]:
                    comp = []
                    while True:
                        x = edge_stack.pop()
                        comp.append(x)
                        if x == eid:
                            break
                    add_component(u, comp)

            elif dfn[v] < dfn[u]:
                edge_stack.append(eid)
                if dfn[v] < low[u]:
                    low[u] = dfn[v]

    tarjan(1, 0)

    # Root the block-cut tree once.
    parent = [0] * (cnt + 1)
    parent[1] = -1
    order = [1]

    for u in order:
        for v, _ in t[u]:
            if v == parent[u]:
                continue
            parent[v] = u
            order.append(v)

    # Reusable cycle arrays. Reusing them is much cheaper than allocating
    # ten fresh lists for every cycle on every binary-search iteration.
    size = max_cycle_len + 3

    lp = [0] * size
    rp = [0] * size
    ld = [0] * size
    rd = [0] * size
    lf = [0] * size
    rf = [0] * size
    lg = [0] * size
    rg = [0] * size
    lh = [0] * size
    rh = [0] * size

    def check(limit):
        d = [INF] * (cnt + 1)

        for u in reversed(order):
            if u <= n:
                best1 = 0
                best2 = 0

                for v, eid in t[u]:
                    if parent[v] != u:
                        continue

                    if v > n:
                        cur = d[v]
                    else:
                        cur = d[v] + W[eid]

                    if cur > best1:
                        best2 = best1
                        best1 = cur
                    elif cur > best2:
                        best2 = cur

                if best1 + best2 > limit:
                    return False

                if best1 > limit:
                    return False

                d[u] = best1
                continue

            verts, eids = cycle_info[u]
            L = len(eids)

            lp[0] = 0
            ld[0] = 0
            lf[0] = 0
            lh[0] = 0
            lg[0] = 0

            for i in range(1, L):
                lp[i] = lp[i - 1] + W[eids[i - 1]]
                x = d[verts[i]]
                ld[i] = max(ld[i - 1], x + lp[i])
                lf[i] = max(lf[i - 1], x - lp[i])
                lh[i] = max(lh[i - 1] + W[eids[i - 1]], x)

            if L >= 2:
                lg[1] = 0

            for i in range(2, L):
                x = d[verts[i]]
                lg[i] = max(
                    lg[i - 1],
                    lf[i - 1] + x + lp[i]
                )

            rp[L + 1] = 0
            for i in range(L, 1, -1):
                rp[i] = rp[i + 1] + W[eids[i - 1]]

            rd[L] = 0
            rf[L] = 0
            rh[L] = 0
            rg[L] = 0

            for i in range(L - 1, 0, -1):
                x = d[verts[i]]
                rd[i] = max(rd[i + 1], x + rp[i + 1])
                rf[i] = max(rf[i + 1], x - rp[i + 1])
                rh[i] = max(rh[i + 1] + W[eids[i]], x)

            if L >= 2:
                rg[L - 1] = 0

            for i in range(L - 2, 0, -1):
                x = d[verts[i]]
                rg[i] = max(
                    rg[i + 1],
                    rf[i + 1] + x + rp[i + 1]
                )

            best_depth = INF

            for i in range(1, L + 1):
                eid = eids[i - 1]

                a = rv[verts[i - 1]] + RE[eid]
                b = rv[verts[i]] + RE[eid]

                r1 = lg[i - 1]
                r2 = rg[i]
                r3 = ld[i - 1] + rd[i]
                r4 = a + max(lh[i - 1], lp[i - 1] + rd[i])
                r5 = b + max(rh[i], rp[i + 1] + ld[i - 1])
                r6 = a + lp[i - 1] + rp[i + 1] + b

                diameter = max(r1, r2, r3, r4, r5, r6)

                if diameter <= limit:
                    depth = max(
                        ld[i - 1],
                        rd[i],
                        a + lp[i - 1],
                        b + rp[i + 1]
                    )
                    if depth < best_depth:
                        best_depth = depth

            if best_depth > limit:
                return False

            d[u] = best_depth

        return True

    cycles = m - n + 1
    lo = 0
    hi = max_base * (n - 1 + 2 * cycles)

    while lo < hi:
        mid = (lo + hi) // 2
        if check(mid):
            hi = mid
        else:
            lo = mid + 1

    print(lo)

if __name__ == "__main__":
    solve()
```输入数组分别存储每条边的端点、原始长度和修复值。 在整个仙人掌分解过程中保留边 ID 非常有用，因为循环过渡需要其原始长度和修复值。 

Tarjan 的算法将边存储在堆栈上。 每当`low[v] >= dfn[u]`，直到树边 (u\text{-}v) 的边形成一个双连通分量。 在仙人掌中，该组件要么是单个桥，要么是简单的循环，因此不需要通用的双连接组件机械。 

分块树在二分查找之前先生根一次。 它的结构永远不会改变，因此在每次可行性检查期间重建它会浪费时间。 

这`check`函数以相反的顺序处理这棵树。 对于原始顶点，两个最大的子深度就足够了，因为经过该顶点的每条路径最多可以使用两个子分支。 使用对应于上述前缀和后缀数量的十个可重用数组来处理循环块。 

末尾的重复枢轴`verts`是故意的。 它代表循环的结束点，并使两侧的分度一致。 DP 从不读取该重复主元的子树值，因此不需要来自父级的值。 

所有距离都使用Python整数，因此不存在溢出问题。 在具有固定宽度整数的语言中，需要有符号 64 位算术。 

二分查找使用严格条件`lo < hi`，可行的中点将上边界移动到`mid`。 这会直接返回第一个可行值，而不需要单独的答案变量。 

## 工作示例

 ### 示例 1

 该图是一个三角形。 可以删除三个可能的边。 生成的树始终由两个幸存的原始边缘加上两个愈合叶子组成。 

| 切边| 第一个端点处的愈合叶子 | 第二个端点处的愈合叶子 | 直径|
 | --- | --- | --- | --- |
 | (1\文本{-}2) | (RV_1+RE_2=3) | (RV_2+RE_2=4) | 12 | 12
 | (2\文本{-}3) | (RV_2+RE_1=3) | (RV_3+RE_1=4) | 10 | 10
 | (3\文本{-}1) | (RV_3+RE_3=6) | (RV_1+RE_3=4) | 14 | 14

 第二个选择是最优的。 去除边(2\text{-}3)后，剩余路径为(2\text{-}1\text{-}3)，长度为(1+2=3)。 两片愈合叶子相加 (3) 和 (4)，得到直径 (3+3+4=10)。 

DP 在处理唯一的循环时看到相同的选择。 对于候选 (R=10)，切割 (2\text{-}3) 最多具有所有六个直径类别 (10)，并且其从枢轴得出的深度最多为 (10)。 另外两次削减违反了限制。 

### 示例 2

 有两个三角形共享顶点 (1)。 由于分块树在顶点（1）处分支，因此最终直径可以是每个三角形贡献的最大深度之和。 

对于第一个循环，每个可能的切割距顶点 (1) 的最佳深度为：

 | 切入循环 (1\text{-}2\text{-}3) | 距顶点 1 的最大深度 |
 | --- | --- |
 | (1\文本{-}2) | 12 | 12
 | (2\文本{-}3) | 10 | 10
 | (3\文本{-}1) | 17 | 17

 对于第二个周期，对应的值为：

 | 切入循环 (1\text{-}4\text{-}5) | 距顶点 1 的最大深度 |
 | --- | --- |
 | (1\文本{-}4) | 13 |
 | (4\文本{-}5) | 12 | 12
 | (5\文本{-}1) | 12 | 12

 由于两个循环在顶点 (1) 相交，因此它们最远分支之间的直径是两个深度的总和。 

| 第一次循环切割| 第二次循环削减| 产生的跨周期直径|
 | --- | --- | --- |
 | (1\文本{-}2) | (1\文本{-}4) | 25 | 25
 | (1\文本{-}2) | (4\文本{-}5) | 24 |
 | (1\文本{-}2) | (5\文本{-}1) | 24 |
 | (2\文本{-}3) | (1\文本{-}4) | 23 | 23
 | (2\文本{-}3) | (4\文本{-}5) | 22 | 22
 | (2\文本{-}3) | (5\文本{-}1) | 22 | 22
 | (3\文本{-}1) | (1\文本{-}4) | 30|
 | (3\文本{-}1) | (4\文本{-}5) | 29 | 29
 | (3\文本{-}1) | (5\文本{-}1) | 29 | 29

 最小值为 (22)，通过切割边 (2\text{-}3) 和 (4\text{-}5) 获得。 此示例说明了为什么 DP 必须保留尽可能最小的最远深度，而不仅仅是单个循环的直径。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O((N+M)\log V)) | Tarjan 和块切割结构是线性的。 每个可行性检查都会扫描每个块和循环边缘一定次数，并且二分搜索执行 (O(\log V)) 检查。 |
 | 空间| (O(N+M)) | 原始图、分块树、分解数据、DP数组和临时循环数组在输入大小上都是线性的。 |

 最多有 (M-N+1) 个循环，所有循环的边总数最多为 (M) 个。 因此，完整的可行性检查是线性的。 对于最多大约 (2\cdot10^{14}) 可能的答案值，二分搜索需要少于 (50) 次迭代。 这符合规定的限制，而 Python 通过重用循环数组而不是在每次检查期间为每个循环分配新数组而受益匪浅。 

## 测试用例

 以下线束假设上述解决方案保存为`solution.py`。 它重定向标准输入和输出并调用`solve`直接运行。```python
import sys
import io
import solution

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()
        solution.input = sys.stdin.readline
        solution.solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Sample 1
assert run("""\
3 3
1 2 3
3 1 2 3
1 2 1 2
2 3 3 1
""") == "10", "sample 1"

# Sample 2
assert run("""\
5 6
1 2 3 4 5
1 2 6 1
1 3 5 4
2 3 4 2
1 4 3 6
1 5 2 3
4 5 1 5
""") == "22", "sample 2"

# Minimum-size cactus, all equal values.
# Any cut produces a path with two original edges and two healing edges.
assert run("""\
3 3
0 0 0
1 2 1 1
2 3 1 1
3 1 1 1
""") == "4", "minimum size and all equal values"

# A bridge attached to one cycle vertex.
# The optimal cut avoids making the long bridge branch even longer.
assert run("""\
4 4
0 0 0 0
1 2 1 1
2 3 1 1
3 1 1 1
3 4 10 1
""") == "12", "bridge attachment"

# Large values, testing 64-bit-sized distances.
assert run("""\
3 3
1000000000 1000000000 1000000000
1 2 1000000000 1000000000
2 3 1000000000 1000000000
3 1 1000000000 1000000000
""") == "6000000000", "large weights"

# Maximum-size instance: one cycle containing all 100000 vertices.
# All original edges and healing edges have length 1.
n = 100000
parts = [
    f"{n} {n}",
    " ".join(["0"] * n)
]
for i in range(1, n):
    parts.append(f"{i} {i + 1} 1 1")
parts.append(f"{n} 1 1 1")

max_case = "\n".join(parts) + "\n"
assert run(max_case) == "100001", "maximum-size single cycle"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 所有值都相等的最小三角形 | 4 | 愈合叶子必须参与直径。 |
 | 桥长度为 10 的三角形 | 12 | 12 桥保持完整，并且它们的长度必须包含在子树深度中。 |
 | 具有值 (10^9) 的三角形 | 6000000000 | 大整数算术和二分搜索范围。 |
 | 100000 顶点循环 | 100001 | 线性循环处理、边界索引和最大输入大小。 |

 ## 边缘情况

 所有值相等的最小三角形由循环转换本身处理。 为了```
3 3
0 0 0
1 2 1 1
2 3 1 1
3 1 1 1
```该循环具有三个可能的切割位置。 每次切割都会创建两个长度为 (1) 的愈合边缘，而两个幸存的原始边缘也具有总长度 (2)。 循环 DP 的第六类，即两个愈合叶之间的路径，达到 (4)，因此可行性检查恰好在 (R=4) 处成功。 

示例 1 案例体现了原始边缘长度和修复成本之间的差异。 切割 (2\text{-}3) 使用愈合值 (RE=1)，产生叶子长度 (2+1=3) 和 (3+1=4)。 剩余路径的长度为 (1+2=3)，直径为 (10)。 切割最短的原始边缘 (1\text{-}2) 改为使用 (RE=2)，产生更大的愈合叶子和直径 (12)。 周期DP直接通过(a=RV_u+RE_e)和(b=RV_v+RE_e)考虑治愈值。 

对于桥梁案例，```
4 4
0 0 0 0
1 2 1 1
2 3 1 1
3 1 1 1
3 4 10 1
```Tarjan 为顶点 (1,2,3) 和一个普通树边 (3\text{-}4) 创建一个循环块。 当处理顶点 (3) 时，桥贡献 (10+d_4)。 然后，循环转换会比较所有三种可能的切割，同时携带已计算的分支深度。 最好的结果是（12）。 

对于大额的情况，```
3 3
1000000000 1000000000 1000000000
1 2 1000000000 1000000000
2 3 1000000000 1000000000
3 1 1000000000 1000000000
```每个幸存的原始边都有长度 (10^9)，每个修复边都有长度 (2\cdot10^9)。 最终树的路径包含两条原始边和两条修复边，因此其直径为 (6\cdot10^9)。 Python 整数直接处理这个问题，而 C++ 实现则需要`long long`。 

最后，一个循环可以包含几乎所有（100,000）个顶点。 前缀和后缀计算在循环长度上是线性的，并且每次可行性检查仅触及每条边恒定的次数。 该算法从不枚举循环顶点对或完整的切割配置，这是将最大尺寸情况保持在所需复杂性范围内的属性。
