---
title: "CF 102331D - 行列式"
description: "我们有一个连通的无向图，需要其邻接矩阵模 (998244353) 的行列式。 该图最多有 (25,000) 个顶点和 (500,000) 个边，但涉及 (k+1) 个顶点的异常情况才是真正的结构约束。"
date: "2026-08-13T03:33:52+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102331
codeforces_index: "D"
codeforces_contest_name: "2019 Summer Petrozavodsk Camp, Day 2: 300iq Contest 2 (XX Open Cup, Grand Prix of Kazan)"
rating: 0
weight: 102331
solve_time_s: 188
verified: true
draft: false
---

[CF 102331D - 行列式](https://codeforces.com/problemset/problem/102331/D)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个连通的无向图，需要其邻接矩阵模 (998244353) 的行列式。 该图最多有 (25,000) 个顶点和 (500,000) 个边，但涉及 (k+1) 个顶点的异常情况才是真正的结构约束。 官方声明给出了 (k\le 25)，竞赛教程将等效结构识别为具有最大尺寸 (k) 的边双连通分量。 

邻接矩阵的行列式可以通过莱布尼兹公式组合地看待。 每个非零项对应于顶点的排列，其中每个顶点都被发送到相邻顶点。 将该排列分解为循环即可将所有顶点分解为有向循环，长度为 (l) 的循环的符号为 ((-1)^{l-1})。 

关键的图表观察是关于桥梁的。 如果一条边是桥，则任何环都不能包含该边。 因此，桥只能作为由其两个端点组成的 2 循环出现在置换循环中。 删除所有桥后，每个剩余的连接组件内部都没有桥，因此这些组件形成了图的自然小块。 

为什么这些碎片很小？ 假设删除所有桥后得到的图有一个组件至少包含 (k+1) 个顶点。 从中选择任意 (k+1) 个顶点。 没有桥将这些顶点中的任何两个分开，因为在移除每个桥后它们仍然是连接的。 这与声明中的条件相矛盾。 相反，如果每个这样的组件最多有 (k) 个顶点，则任何 (k+1) 个选定的顶点必须位于至少两个不同的组件中，并且组件树路径上的桥分隔合适的对。 因此，给定的条件正是每个边双连通分量最多包含 (k\le25) 个顶点的陈述。 

这完全改变了问题的规模。 一般的 (25,000\times25,000) 行列式太大了。 高斯消去法大约需要

 [
 \frac{n^3}{3}\约\frac{25000^3}{3}\约5.2\cdot10^{12}
 ]

 在最密集的野外作业情况下。 即使存储这样的矩阵也需要数亿个条目。 相反，有用的工作必须发生在大小最多为 25 的组件内，并通过树 DP 将它们连接起来。 

有几种边缘情况很容易破坏粗心的实现。 对于单个顶点，```
1 0 1
```邻接矩阵是([0])，所以答案是(0)。 将空图视为具有行列式 (1)，而不考虑实际组件包含一个未覆盖的顶点会给出错误的结果。 

对于由一根桥连接的两个顶点，```
2 1 1
1 2
```邻接矩阵是

 [
 \begin{pmatrix}0&1\1&0\end{pmatrix},
 ]

 其行列式为 (-1)，因此所需的模数答案为 (998244352)。 对桥进行 2 个周期计数但忘记其奇数排列符号的 DP 会生成 (1)。 

对于三个顶点的路径，```
3 2 1
1 2
2 3
```行列式是(0)。 中间顶点不能被循环分解覆盖。 仅跟踪是否使用每条边的树 DP 可能会错误地将两条边计为有效结构，即使行列式项是循环覆盖，而不是任意边子集。 

还必须在不假设每个组件都贡献非零行列式的情况下处理无桥组件。 例如，```
3 3 3
1 2
2 3
3 1
```有一个组件包含所有三个顶点。 它的邻接矩阵具有行列式(2)，并且根本不存在桥转移。 在这种情况下，分量 DP 必须简化为普通的小行列式。 

## 方法

 直接法遵循行列式的定义。 我们可以构造整个邻接矩阵并运行高斯消去模 (998244353)。 这是正确的，因为基本行操作在跟踪其效果时会保留行列式。 不幸的是，在最坏的情况下，(25,000\times25,000)密集消除需要大约(5.2\cdot10^{12})消除更新，这远不及可用的五秒。 

行列式展开本身更糟糕。 莱布尼茨公式有 (n!) 个排列项，因此它仅可用于理解行列式的含义，而不是一种算法。 

蛮力视图确实揭示了我们需要的结构。 行列式项是顶点的循环分解。 桥不能属于长度至少为三的循环，因为这样的循环会在桥端点之间提供另一条路径。 因此，行列式项使用的每个桥都是 2 周期。 

删除所有桥并将每个剩余的连接组件收缩到一个节点中。 结果是一棵树。 每个组件最多有 (k) 个顶点，因此我们可以从叶子到任意根处理这棵树。 这正是竞赛教程中描述的树 DP 方法。 

考虑一个组件 (B) 及其一个顶点 (v)。 多个子组件可以通过桥连接到 (v)。 在有效的循环分解中，最多可以使用这些子桥之一，因为使用桥意味着 (v) 与子端点一起参与 2 循环。 

对于每个子组件 (C)，定义两个 DP 值。 值 (dp[C][0]) 表示不使用从 (C) 到其父级的桥。 值(dp[C][1])表示使用了桥，因此将(C)的边界顶点从(C)的内部循环覆盖中移除。 父子 2 循环的符号是由父转换故意处理的，因此 (dp[C][1]) 本身只是删除该边界顶点后的行列式贡献。 这种约定使得局部矩阵特别干净。 

对于顶点 (v)，令

 [
 s_v=\prod_C dp[C][0],
 ]

 其中 (C) 范围涵盖附加到 (v) 的所有子组件。 如果没有使用子桥，则 (v) 停留在当前组件内并接收权重 (s_v)。 

如果仅使用一个子桥，则贡献为

 [
 t_v=\sum_C dp[C][1]\prod_{D\ne C}dp[D][0]。 
]

 我们无需除法即可计算此值，因为某些 (dp[C][0]) 可能为零。 开始于`prod = 1`和`t = 0`，每个孩子更新

 [
 t\leftarrow t\cdot dp[C][0]+prod\cdot dp[C][1],
 ]

 随后

 [
 prod\leftarrow prod\cdot dp[C][0]。 
]

 现在令 (A) 为当前边双连通分量的普通邻接矩阵。 我们将其替换为相同大小的小加权矩阵 (B)：

 [
 B_{vv}=-t_v,
 ]

 对于内部边 (v\mathord{-}u)，

 [
 B_{vu}=s_v。 
]

 两个方向可以具有不同的权重，这很好，因为仅使用行列式。 展开 (B) 的行列式，选择对角线条目 (-t_v) 意味着 (v) 使用一个子桥。 通过内部边选择剩余的行会在未删除的顶点上留下邻接矩阵的行列式。 减号恰好是电桥2周期的符号。 

因此 (dp[B][0]=\det B)。 

如果 (p) 是 (B) 关联到父桥的顶点，则 (dp[B][1]) 必须从内部组件中删除 (p)。 所有直接附加到 (p) 的子级都必须使用类型 0，贡献 (s_p)。 因此

 [
 dp[B][1]=s_p\det B_{\setminus p},
 ]

 其中 (B_{\setminus p}) 是通过删除行和列 (p) 得到的。 

现在每个行列式最多为 (25\times25)。 由于组件大小的总和为 (n)，因此总成本为 (O(nk^2))，与竞赛教程中所述的预期复杂性相匹配。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力决定因素| (O(n^3)) 高斯消元法，或 (O(n!)) 莱布尼兹展开 | (O(n^2)) 对于稠密矩阵 | 太慢了 |
 | 最佳电桥组件 DP | (O(m+n k^2)) | (O(m+n)) | 已接受 |

 ## 算法演练

 1. 使用低链接 DFS 查找原始图的每个桥。 当 (v) 的 DFS 子树没有后边到达 (u) 或 (u) 的祖先时，边 (u-v) 就是桥，等价`low[v] > tin[u]`。 该实现使用迭代 DFS，以便 (25,000) 个顶点的路径不依赖于 Python 递归深度。 
2. 从概念上删除所有桥并找到剩余的连接组件。 这些是边双连通分量。 给定条件保证每个组件最多有 (k) 个顶点。 
3. 构建组件树。 每个原始桥连接两个不同的组件，并且由于桥不能形成循环，因此收缩每个组件会生成一棵树。 
4. 任意根组件树。 对于每个非根组件，请记住位于组件内部的父桥的端点。 该顶点是当组件使用其父桥时必须消失的边界顶点。 
5. 按相反的树顺序处理组件。 对于当前组件的每个顶点 (v)，合并附加到 (v) 的所有已计算的子组件。 将 (s_v) 计算为所有子类型 0 值的乘积。 
6. 将 (t_v) 计算为恰好有一个子节点使用其网桥的配置总和。 复发`t = t * dp0 + prod * dp1`将新子项添加到唯一选择的子项中，或者保持先前的选择不变。 它避免除以可能的零 (dp0)。 
7. 构建局部矩阵 (B)。 将 (-t_v) 放在其对角线上。 对于从 (v) 到 (u) 的每个内部边，将 (s_v) 放在位置 ((v,u)) 处。 行权重 (s_v) 表示当 (v) 保留在组件中时所有子子树的贡献。 
8. 通过模高斯消去法计算 (\det B)。 该值为 (dp[B][0])，因为每个行列式项都会选择通过子桥离开的顶点的对角线选项或保留在组件中的顶点的内部边。 
9. 对于每个非根组件，从 (B) 中删除其父边界顶点，计算所得行列式，并将其乘以 (s_p)。 这给出(dp[B][1])。 当父组件将桥用作 2 周期时，它将提供减号。 
10.根分量经过处理后，其0型值是整个原始邻接矩阵的行列式，因此将其模（998244353）输出。 

为什么有效：每个行列式项都是顶点循环分解。 在一个边双连接组件内部，所有循环都是内部循环，除非顶点参与桥 2 循环。 桥只能在这样的 2 个循环中使用，并且一个顶点最多只能属于一个循环，因此每个顶点要么保留在其组件内，要么只连接到一个子组件。 值 (s_v) 和 (t_v) 恰好枚举了这两种可能性。 局部行列式枚举所有兼容的内部循环覆盖，而递归 DP 值已经考虑了每个后代组件。 由于分量图是一棵树，因此每个行列式循环分解都恰好有一次递归分解，并以其正确的符号计数一次。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

MOD = 998244353

def determinant(a):
    n = len(a)
    if n == 0:
        return 1

    ans = 1

    for col in range(n):
        pivot = col
        while pivot < n and a[pivot][col] == 0:
            pivot += 1

        if pivot == n:
            return 0

        if pivot != col:
            a[pivot], a[col] = a[col], a[pivot]
            ans = -ans

        p = a[col][col] % MOD
        ans = ans * p % MOD
        inv = pow(p, MOD - 2, MOD)

        row = a[col]

        for r in range(col + 1, n):
            x = a[r][col]
            if x == 0:
                continue

            factor = x * inv % MOD
            rr = a[r]
            rr[col] = 0

            for c in range(col + 1, n):
                rr[c] = (rr[c] - factor * row[c]) % MOD

    return ans % MOD

def solve():
    n, m, k = map(int, input().split())

    head = array('i', [-1]) * n
    to = array('i')
    nxt = array('i')
    eu = array('i')
    ev = array('i')

    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1

        eid = len(eu)
        eu.append(u)
        ev.append(v)

        to.append(v)
        nxt.append(head[u])
        head[u] = len(to) - 1

        to.append(u)
        nxt.append(head[v])
        head[v] = len(to) - 1

    # Find bridges with iterative low-link DFS.
    tin = array('i', [0]) * n
    low = array('i', [0]) * n
    parent = array('i', [-1]) * n
    parent_edge = array('i', [-1]) * n
    it = array('i', head)
    bridge = array('b', [0]) * m

    timer = 0
    stack = [0]
    timer += 1
    tin[0] = low[0] = timer

    while stack:
        v = stack[-1]
        e = it[v]

        if e == -1:
            stack.pop()

            p = parent[v]
            if p != -1:
                pe = parent_edge[v]
                if low[v] > tin[p]:
                    bridge[pe >> 1] = 1
                if low[v] < low[p]:
                    low[p] = low[v]
            continue

        it[v] = nxt[e]

        if e == parent_edge[v]:
            continue

        u = to[e]

        if tin[u] == 0:
            parent[u] = v
            parent_edge[u] = e ^ 1
            timer += 1
            tin[u] = low[u] = timer
            stack.append(u)
        else:
            if tin[u] < low[v]:
                low[v] = tin[u]

    # Build edge-biconnected components by ignoring bridges.
    comp = array('i', [-1]) * n
    blocks = []
    pos = array('i', [0]) * n

    cid = 0
    for start in range(n):
        if comp[start] != -1:
            continue

        vertices = []
        stack = [start]
        comp[start] = cid

        while stack:
            v = stack.pop()
            pos[v] = len(vertices)
            vertices.append(v)

            e = head[v]
            while e != -1:
                if not bridge[e >> 1]:
                    u = to[e]
                    if comp[u] == -1:
                        comp[u] = cid
                        stack.append(u)
                e = nxt[e]

        blocks.append(vertices)
        cid += 1

    bc = cid

    # Component tree.
    tree = [[] for _ in range(bc)]

    for e in range(m):
        if not bridge[e]:
            continue

        u = eu[e]
        v = ev[e]
        cu = comp[u]
        cv = comp[v]

        tree[cu].append((cv, u, v))
        tree[cv].append((cu, v, u))

    # Root the component tree.
    parent_block = array('i', [-2]) * bc
    parent_block[0] = -1

    parent_vertex = array('i', [-1]) * bc
    order = [0]

    for c in order:
        for d, vc, vd in tree[c]:
            if parent_block[d] != -2:
                continue

            parent_block[d] = c
            parent_vertex[d] = vd
            order.append(d)

    # For every local vertex, store its child components.
    children_at = []
    for vertices in blocks:
        children_at.append([[] for _ in vertices])

    for c in range(1, bc):
        p = parent_block[c]

        # Find the edge p-c and its endpoint inside p.
        for d, vp, vc in tree[p]:
            if d == c:
                children_at[p][pos[vp]].append(c)
                break

    dp0 = array('i', [0]) * bc
    dp1 = array('i', [0]) * bc

    # Process bottom-up.
    for c in reversed(order):
        vertices = blocks[c]
        s = len(vertices)

        sv = [1] * s
        tv = [0] * s

        for i in range(s):
            prod = 1
            chosen = 0

            for child in children_at[c][i]:
                a = dp0[child]
                b = dp1[child]

                chosen = (chosen * a + prod * b) % MOD
                prod = prod * a % MOD

            sv[i] = prod
            tv[i] = chosen

        # B[i][i] = -t_i
        # B[i][j] = s_i for an internal edge i-j.
        mat = [[0] * s for _ in range(s)]

        for i in range(s):
            mat[i][i] = (-tv[i]) % MOD

        for i, v in enumerate(vertices):
            e = head[v]
            while e != -1:
                if comp[to[e]] == c:
                    j = pos[to[e]]
                    mat[i][j] = sv[i]
                e = nxt[e]

        dp0[c] = determinant([row[:] for row in mat])

        if c != 0:
            boundary = pos[parent_vertex[c]]
            reduced = []

            for i in range(s):
                if i == boundary:
                    continue

                row = []
                for j in range(s):
                    if j == boundary:
                        continue
                    row.append(mat[i][j])
                reduced.append(row)

            minor = determinant(reduced)
            dp1[c] = sv[boundary] * minor % MOD

    print(dp0[0] % MOD)

if __name__ == "__main__":
    solve()
```实现的第一部分将图存储在前向星形数组中。 这`array`模块保持邻接表示紧凑，这很重要，因为该语句允许最多 (500,000) 个输入边，即使结构承诺使得在规定的 (k\le25) 下不可能实现如此密集的输入。 该表示对于原始输入限制仍然具有鲁棒性。 

DFS 保留的桥`tin[v]`和`low[v]`。 对于无向边，显式跳过 DFS 树边的反向边。 当孩子完成后，`low[child] > tin[parent]`识别一座桥。 

知道桥之后，另一次遍历将每个顶点分配给其桥连接的组件。 这`pos`array 将原始顶点映射到其组件内的本地索引，因此可以在没有字典的情况下构建小型行列式矩阵。 

组件树是迭代生根的。 对于每个组件，`children_at[i]`准确包含桥端点位于本地顶点的子组件`i`。 这是 (s_v,t_v) 转换所需的信息。 

复发```
chosen = (chosen * a + prod * b) % MOD
prod = prod * a % MOD
```是故意写的，没有模块化划分。 一个诱人的实现是计算 (t_v=s_v​​\sum dp_1/dp_0)，但 (dp_0) 可以为零。 前缀乘积递归在任何情况下都有效。 

局部矩阵只有(s\times s)，而不是(2s\times2s)。 原始社论中的辅助顶点构造可以通过代数方式消除。 行 (v) 乘以 (s_v)，同时选择子连接给出对角线值 (-t_v)。 这产生了上述的紧凑矩阵（B）并大大削减了常数因子。 原始教程描述了等效的虚拟顶点构造，并给出了每个组件的 (O(k^3)) 工作量。 

高斯消除搜索非零主元，因为零主元并不一定意味着行列式为零，直到检查了该列下方的每一行。 行交换会翻转行列式符号，而将一行的倍数添加到另一行不会改变它。 每个算术运算都会以模 (998244353) 进行缩减，因此 Python 整数永远不会变得大到足以导致溢出问题。 

当组件具有一个边界顶点并且该顶点被删除时，就会出现空矩阵。 它的行列式是 (1)，这是标准的空积约定，并且是由单个顶点组成的叶组件所必需的。 

## 工作示例

 ### 示例 1

 图形就是路径```
1 - 2 - 3 - 4
```与（k=1）。 每条边都是一座桥，因此每个边双连通分量都包含一个顶点。 

组件树的根位于顶点 1。 

| 组件| 顶点| 子 (dp_0) | 子 (dp_1) | （s_v）| (t_v) | (dp_0) | (dp_1) | (dp_1) |
 | --- | --- | --- | --- | --- | --- | --- | --- |
 | 4 | 4 | 无 | 无 | 1 | 0 | 0 | 1 |
 | 3 | 3 | 0 | 1 | 0 | 1 | 1 | 0 |
 | 2 | 2 | 1 | 0 | 1 | 0 | 0 | 1 |
 | 1 | 1 | 0 | 1 | 0 | 1 | 1 | 不需要|

 对于叶顶点 4，其局部矩阵就是 ([0])，即 (dp_0=0)。 删除其边界顶点会留下空矩阵，因此 (dp_1=1)。 因此，父级通过对角线条目 (-t_v) 看到桥 2 周期及其负号。 

在根处，生成的局部矩阵是具有有效子连接的 ([0])，最终行列式是 (1)，与样本输出匹配。 该示例演示了为什么桥 2 周期的符号必须恰好引入一次。 

### 示例 2

 六个顶点形成两个通过桥连接的小循环区域。 移除桥之后，组件树的组件大小最多为三个，满足（k=3）。 

对于每个组件，首先处理子组件。 在每个边界顶点，DP 结合了不使用子桥的可能性和仅使用一个子桥的可能性。 

| 舞台| 当前组件| 当地尺寸| (dp_0) | (dp_1) | (dp_1) |
 | --- | --- | --- | --- | --- |
 | 1 | 叶组件| 小| 从其局部矩阵计算| 删除边界后计算|
 | 2 | 中间组件 | 小| 组合子 (s_v,t_v) 值 | 删除其父边界 |
 | 3 | 根组件| 小| 最终决定因素| 不需要|

 得到的根值为

 [
 998244352\相当于-1\pmod{998244353},
 ]

 这是第二个样本输出。 该迹线练习了组件同时具有内部边缘和桥过渡的情况，因此局部行列式必须将组件内部的循环覆盖与子 2 循环相结合。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(m+n k^2)) | 桥梁检测和组件构建是线性的。 大小为 (s\le k) 的组件需要 (O(s^3)) 行列式工作，并且 (\sum s=n)，给出 (O(nk^2))。 |
 | 空间| (O(m+n)) | 图、桥信息、组件树和 DP 数组与输入大小呈线性关系。 |

 最大的组件只有 25 个顶点，因此昂贵的线性代数是在微小的矩阵上执行的。 组件大小的总和为 (n)，这就是为什么三次局部计算全局变为 (O(nk^2)) 的原因。 竞赛教程为预期的树 DP 给出了相同的 (O(nk^2)) 界限。 

迭代 DFS 避免了递归堆栈问题，即使在读取标称 (500,000) 边输入限制时，紧凑的邻接数组也能保持内存使用受控。 

## 测试用例```python
# Assume the solution code above is saved as solution.py.
# This harness redirects stdin/stdout and calls solve() directly.

import io
import sys
from contextlib import redirect_stdout

from solution import solve

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()

    try:
        with redirect_stdout(out):
            solve()
        return out.getvalue().strip()
    finally:
        sys.stdin = old_stdin

# Provided samples.
assert run("""\
4 3 1
1 2
2 3
3 4
""") == "1", "sample 1"

assert run("""\
6 6 3
2 3
5 6
2 5
1 2
3 4
6 2
""") == "998244352", "sample 2"

assert run("""\
10 15 10
1 8
1 7
6 7
2 8
6 9
1 2
4 9
4 10
4 6
5 6
3 8
9 10
8 10
3 5
2 7
""") == "35", "sample 3"

# Minimum-size graph.
assert run("""\
1 0 1
""") == "0", "single isolated vertex"

# One bridge. The adjacency matrix has determinant -1.
assert run("""\
2 1 1
1 2
""") == "998244352", "single edge"

# Three-vertex path. Its determinant is zero.
assert run("""\
3 2 1
1 2
2 3
""") == "0", "odd path"

# One bridge-free component. Its adjacency matrix is the triangle matrix,
# whose determinant is 2.
assert run("""\
3 3 3
1 2
2 3
3 1
""") == "2", "triangle"

# Maximum n with a path. For P_n, det(P_n) is 1 when n is divisible by 4.
n = 25000
edges = "\n".join(f"{i} {i + 1}" for i in range(1, n))
large_path = f"{n} {n - 1} 1\n{edges}\n"
assert run(large_path) == "1", "maximum-n path"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 0 1`|`0`| 空邻接矩阵条目和最小尺寸边界情况 |
 |`2 1 1`|`998244352`| 桥的标志 2 周期 |
 |`3 2 1`|`0`| 奇数路径不存在循环覆盖 |
 | 三角形 (k=3) |`2`| 无桥分量和普通局部行列式 |
 | 具有 (25,000) 个顶点的路径 |`1`| 最大值 (n)、迭代 DFS 和线性大小的组件树 |

 ## 边缘情况

 对于单个顶点，```
1 0 1
```没有边缘，也没有桥梁。 唯一的分量包含顶点 1，因此其局部矩阵为 ([0])。 高斯消元法找不到主元并返回 (0)。 因此，根 DP 为 (0)，与邻接行列式完全匹配。 

对于单桥而言，```
2 1 1
1 2
```两个顶点都是单例组件。 叶子具有 (dp_0=0) 和 (dp_1=1)，因为删除其边界会留下空矩阵。 在父级，子级贡献 (t=1)，因此局部矩阵为 ([-1])。 其行列式为 (-1)，以 (998244353) 为模表示为 (998244352)。 因此，桥的 2 周期符号仅被计算一次。 

对于三顶点路径，```
3 2 1
1 2
2 3
```顶点 3 处的叶子给出 (dp_0=0,dp_1=1)。 在顶点 2 处，子连接给出 (t_2=1)，因此局部矩阵变为 ([-1])，给出 (dp_0=-1) 和 (dp_1=0)。 零 (dp_1) 意味着当顶点 2 的子端已固定时，不能同时通过其父桥移除顶点 2。 根据要求，在根处，所得行列式为 (0)。 

对于三角形，```
3 3 3
1 2
2 3
3 1
```没有桥，因此组件树包含一个节点。 每个 (s_v) 都是 (1)，每个 (t_v) 都是 (0)。 局部矩阵就是三角形邻接矩阵，

 [
 \开始{p矩阵}
 0&1&1\
 1&0&1\
 1&1&0
 \end{pmatrix},
 ]

 其行列式为(2)。 因此，DP 自然退化为小型无桥组件的普通行列式计算。 

大路径测试使用 (25,000) 个单例组件。 它的组件树本身就是一条路径，因此桥DFS达到了最大可能的深度。 由于该实现使用显式堆栈而不是递归 Python 调用，因此它可以处理这种情况，而不会出现递归限制或 C 堆栈问题。 路径的行列式递推为 (D_n=-D_{n-2})，其中 (D_0=1) 和 (D_2=-1)。 由于 (25,000\equiv0\pmod4)，答案是 (1)。 该测试练习算法的线性部分而不是小矩阵部分。
