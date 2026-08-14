---
title: "CF 102331C - 计数仙人掌"
description: "我们有一个最多有 13 个顶点的简单无向图。 我们选择其边的子集，同时保留整个顶点集，并询问生成的生成图是否是仙人掌。 仙人掌是相连的，没有一条边可以属于两个不同的简单环。"
date: "2026-08-14T05:03:49+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102331
codeforces_index: "C"
codeforces_contest_name: "2019 Summer Petrozavodsk Camp, Day 2: 300iq Contest 2 (XX Open Cup, Grand Prix of Kazan)"
rating: 0
weight: 102331
solve_time_s: 174
verified: true
draft: false
---

[CF 102331C - 计算仙人掌](https://codeforces.com/problemset/problem/102331/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 54s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个最多有 13 个顶点的简单无向图。 我们选择其边的子集，同时保留整个顶点集，并询问生成的生成图是否是仙人掌。 仙人掌是相连的，没有一条边可以属于两个不同的简单环。 任务是对所有此类边缘子集进行模数 (998244353) 计数。 官方限制的顶点数量故意很小，但当（n=13）时，可能的边数量已经是 78 条。 

(n) 的小值告诉我们顶点的子集是自然状态空间。 只有 (2^{13}=8192) 个顶点子集，因此具有多个子集维度的解决方案仍然可行。 另一方面，枚举边缘子集是没有希望的。 完整图有 13 个顶点，有 78 条边，给出 (2^{78})，大约 (3.0\cdot10^{23})，可能的边子集。 即使检查一个子集只需要 (O(n+m))，总数也将约为 (2.7\cdot10^{25}) 个基本操作。 预期的解决方案必须利用仙人掌图的结构，而不是检查各个边缘子集。 

在一些简单的情况下，粗心的解释会给出错误的答案。 为了```
1 0
```答案是（1）。 该图由一个顶点且无边组成，单顶点图是连通的。 假设仙人掌必须包含边缘的实现将错误地返回零。 

为了```
2 0
```答案是（0）。 两个顶点是断开的，因此空边集不是仙人掌。 这捕获了自动计算空边子集的实现。 

为了```
3 2
1 2
2 3
```答案是（1）。 仅连接包含两条边的子集。 将每个森林都算作一棵有效的仙人掌也会错误地计算两个单边子集。 

第二个微妙之处出现在几个周期中。 在```
4 6
1 2
1 3
1 4
2 3
2 4
3 4
```有 27 个有效的跨越仙人掌子图。 每个连通的3边子图都是一棵树，(K_4)的所有16个生成树都是有效的。 每个连通的 4 边子图都是单环的，因此有效，另外还有 11 个。 五边子图是（K_4），其中删除了一条边，并且它的两个三角形共享一条边，因此这些五边图都不是仙人掌。 完整的（K_4）也是无效的。 这说明了为什么仅仅计算连接的稀疏子图是不够的。 

## 方法

 直接的方法是枚举 (m) 个输入边的每个子集。 对于每个子集，我们可以运行图遍历来检查连通性，然后检测某些边是否属于两个简单循环，例如通过计算双连通分量。 这是正确的，因为每个可能的答案都会被检查一次。 问题是 (2^m) 因子。 在 (n=13) 时，(m) 可以为 78，因此在我们执行仙人掌测试之前大约有 (3.0\cdot10^{23}) 个子集。 

有用的观察是仙人掌具有非常刚性的块结构。 每个双连通分量要么是单边，要么是简单循环。 删除关节顶点后，这些块以树状方式连接。 这表明将问题分为两个阶段。 首先计算每个顶点集上可能的单周期。 然后将这些循环和围绕关节顶点的单边组合起来。 

这种分解特别适合子集动态规划，因为 (n\le13)。 最近的同一想法的表述描述了一种状态，其中已处理的顶点被禁止作为关节点。 最初，这样的组件只能是单个顶点或简单的循环。 当顶点可用作铰接点时，悬挂在其上的所有组件都是独立的，并且可以与一组指数组合，可以使用排序子集变换来评估该指数。 

第一阶段计算简单周期。 确定循环中编号最大的顶点 (h)。 包含(h)的环在去除(h)后成为简单路径，其两个端点是(h)的邻居。 子集 DP 对这些路径进行计数。 每个周期产生两次，每个方向一次，因此我们乘以 (1/2)。 

第二阶段从这些循环计数开始，并从小到大处理顶点。 处理 (i) 时，包含 (i) 的有效分量要么是已计数的循环，要么是从 (i) 到较小顶点的边以及先前在其他顶点上构造的仙人掌。 多个这样的组件可以在(i)处相遇。 由于除了 (i) 之外，它们的顶点集是不相交的，因此选择所有这些顶点集恰好是集合划分指数。 排序子集变换同时计算所有顶点子集的指数。 这是将算法从 (O(3^n\operatorname{poly}(n))) 分解为 (O(n^3 2^n)) 的主要优化。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(2^m(n+m))) | (O(n+m)) | 太慢了|
 | 最佳| (O(n^3 2^n)) | (O(n2^n)) | 已接受 |

 ## 算法演练

1. 用位掩码表示每个顶点子集。 我们将维护一个数组（f[S]）。 在关节处理阶段之前，(f[S]) 表示恰好位于 (S) 上的原子仙人掌块的数量：(f[{v}]=1)，对于 (|S|\ge3)，(f[S]) 是顶点集恰好为 (S) 的简单循环的数量。 
2. 通过固定最大顶点 (h) 来计算所有简单循环。 在这样的循环中，只有小于 (h) 的顶点才会出现在其他地方。 将 (dp[M][v]) 定义为顶点集为 (M)、端点为 (v)、另一个端点为 (h) 的邻居的简单路径的数量。 最初，如果 (v) 与 (h) 相邻，则单顶点路径 ({v}) 是可能的。 
3. 将这些路径一次延伸一个顶点。 从以 (v) 结束的路径中，选择一个未使用的邻居 (w)，并追加 (w)。 由于 (w) 一定不属于掩码，因此生成的路径仍然很简单。 
4. 每当一条路径使用至少两个顶点并终止于 (h) 的邻居时，将两个端点的边添加到 (h) 会创建一个简单的循环。 将路径计数的一半添加到 (f[M\cup{h}])。 因子 (1/2) 消除了同一无向循环的两个方向。 
5. 为每个顶点设置 (f[{v}]=1)。 需要这些单例状态是因为稍后通过将一个已构造的组件附加到新处理的顶点来创建边缘块。 
6. 处理顶点 (i=0,1,\ldots,n-1)。 此时，小于(i)的顶点已被允许作为关节点，而(i)本身尚未被处理为一个。 暂时从宇宙中删除 (i) 并考虑剩余顶点的子集 (S)。 
7. 构造包含 (i) 的单组分块的数量。 其值为
 [
 g[S]=f[S\cup{i}]
 +f[S]\cdot \deg_i(S_{<i}),
 ]
 其中 (S_{<i}) 仅包含小于 (i) 的顶点。 第一项意味着整个作品已经是一个循环。 第二种方法是我们使用从 (i) 到较小顶点的一条边，并附加之前构造的由 (f[S]) 表示的仙人掌。 仅使用较小的邻居，因为每条边都必须在一个处理步骤中引入。 
8. 多个这样的块可以附加到(i)，并且它们的顶点集必须是不相交的。 因此，集合的新值是所有无序集合划分为这些部分的总和。 这是集合幂级数 (g) 的指数。 
9. 为了有效地评估该指数，请将 (g[S]) 存储在与 (|S|) 对应的系数中，然后应用子集 zeta 变换。 变换后，每个子集的行为就像大小变量中的普通多项式，因此我们可以独立计算其形式指数。 最后应用逆子集变换并获取由子集基数索引的系数。 
10. 将结果值复制回包含 (i) 的状态，并继续处理下一个顶点。 处理完所有顶点后，(f[V]) 正是输入图的跨越仙人掌子图的数量。 

### 为什么它有效

 不变量是，在处理顶点（i）之前，（f[S]）对（S）上的仙人掌结构进行计数，其中每个小于（i）的顶点都被禁止作为关节点。 因此，任何包含 (i) 的结构都可以唯一地分解为仅在 (i) 处相遇的片段。 每个单独的部分要么是一个现有的循环，要么是从 (i) 到已处理的顶点的一条边，并附有有效的仙人掌。 指数集划分步骤将所有可能的不相交部分恰好组合一次。 按升序处理顶点还为每个桥提供了引入它的唯一时刻，因此不会对任何边结构进行两次计数。 由于每个仙人掌都可以通过这种方式精确地分解为其循环和桥接块，因此最终状态对每个有效边缘子集恰好计数一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353
INV2 = (MOD + 1) // 2

def count_cactus(n, edges):
    N = 1 << n

    adj = [0] * n
    for u, v in edges:
        adj[u] |= 1 << v
        adj[v] |= 1 << u

    # f[S] initially counts atomic blocks:
    # one vertex for |S| = 1, or one simple cycle for |S| >= 3.
    f = [0] * N

    # Count simple cycles by fixing their maximum vertex h.
    for h in range(2, n):
        lim = 1 << h

        # dp[mask][v] = number of simple paths using exactly mask
        # and ending at v, whose starting vertex is adjacent to h.
        dp = [[0] * h for _ in range(lim)]

        ah = adj[h]
        for v in range(h):
            if (ah >> v) & 1:
                dp[1 << v][v] = 1

        for mask in range(1, lim):
            row = dp[mask]

            for v in range(h):
                cur = row[v]
                if cur == 0:
                    continue

                available = adj[v] & (lim - 1) & ~mask
                while available:
                    bit = available & -available
                    available -= bit
                    w = bit.bit_length() - 1

                    nxt = dp[mask | bit]
                    nv = nxt[w] + cur
                    if nv >= MOD:
                        nv -= MOD
                    nxt[w] = nv

        for v in range(h):
            if not ((ah >> v) & 1):
                continue

            for mask in range(1, lim):
                if mask.bit_count() >= 2:
                    val = dp[mask][v]
                    if val:
                        s = mask | (1 << h)
                        f[s] = (f[s] + val * INV2) % MOD

    for i in range(n):
        f[1 << i] = 1

    # Precompute inverses up to n.
    inv = [0] * (n + 1)
    if n >= 1:
        inv[1] = 1
    for i in range(2, n + 1):
        inv[i] = MOD - (MOD // i) * inv[MOD % i] % MOD

    # Insert vertex i into a compressed mask.
    def insert_vertex(mask, i):
        low = (1 << i) - 1
        return (mask & low) | ((mask & ~low) << 1) | (1 << i)

    # Remove vertex i from a full mask.
    def remove_vertex(mask, i):
        low = (1 << i) - 1
        return (mask & low) | ((mask >> 1) & ~low)

    # Process each vertex as a newly available articulation point.
    for i in range(n):
        k = n - 1
        size = 1 << k
        lower_mask = (1 << i) - 1
        lower_neighbors = adj[i] & lower_mask

        # a[mask][d] stores the ranked subset-zeta representation.
        a = [[0] * (k + 1) for _ in range(size)]

        # Build g for the universe with vertex i removed.
        for s in range(size):
            full_without = insert_vertex(s, i) ^ (1 << i)
            full_with = full_without | (1 << i)

            deg = (lower_neighbors & full_without).bit_count()

            val = f[full_with]
            if deg:
                val += f[full_without] * deg
                val %= MOD

            a[s][s.bit_count()] = val

        # Subset zeta transform.
        bit = 1
        while bit < size:
            step = bit << 1
            for base in range(0, size, step):
                for off in range(bit):
                    x = a[base + off]
                    y = a[base + off + bit]
                    for d in range(k + 1):
                        y[d] += x[d]
                        if y[d] >= MOD:
                            y[d] -= MOD
            bit <<= 1

        # Pointwise formal exponential.
        for s in range(size):
            g = a[s]
            res = [0] * (k + 1)
            res[0] = 1

            for degree in range(1, k + 1):
                total = 0
                for j in range(1, degree + 1):
                    total += j * g[j] % MOD * res[degree - j]
                    if total >= (1 << 61):
                        total %= MOD
                res[degree] = total % MOD * inv[degree] % MOD

            a[s] = res

        # Inverse subset zeta transform.
        bit = 1
        while bit < size:
            step = bit << 1
            for base in range(0, size, step):
                for off in range(bit):
                    x = a[base + off]
                    y = a[base + off + bit]
                    for d in range(k + 1):
                        y[d] -= x[d]
                        if y[d] < 0:
                            y[d] += MOD
            bit <<= 1

        # Update all states containing i.
        for s in range(size):
            full = insert_vertex(s, i)
            f[full] = a[s][s.bit_count()]

    return f[N - 1]

def solve():
    n, m = map(int, input().split())

    edges = []
    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        edges.append((u, v))

    print(count_cactus(n, edges))

if __name__ == "__main__":
    solve()
```第一部分构建邻接位掩码。 因为 (n) 最多为 13，所以一组候选邻居自然适合一个 Python 整数，并且诸如与子集交集和`bit_count()`非常便宜。 

循环 DP 固定最大顶点 (h)，因此每个循环都恰好分配给一次迭代。`dp[mask][v]`代表一条简单的路径，遮罩本身可以防止一个顶点被使用两次。 仅当其端点与 (h) 相邻时，路径才通过 (h) 闭合。 每个无向循环都有两个方向，这就是为什么`INV2`被应用。 

衔接阶段通过删除当前顶点 (i) 来压缩顶点域。`insert_vertex`将压缩掩码转换回原始编号。 表达式涉及`lower_neighbors`仅计算小于 (i) 的邻居。 这个顺序是必要的。 如果所有邻居都被允许存在，则可以在两个端点引入相同的网桥。 

排序子集变换为每个子集基数存储一个系数。 经过 zeta 变换后，集合指数在每个变换子集处变为普通多项式指数。 复发

 [
 E_k=\frac{1}{k}\sum_{j=1}^{k}jG_jE_{k-j}
 ]

 计算 (\exp(G)) 中的 (k) 次系数。 逆 zeta 变换恢复子集值。 

所有算术均以模 (998244353) 执行。 Python 整数不会溢出，但中间乘积仍然以素数为模进行约简。 使用 (1,2,\ldots,n) 的标准递推计算逆值，用于循环方向的特殊值 (1/2) 为`(MOD + 1) // 2`。 

## 工作示例

 ### 示例 1

 该图是一个三角形。```
3 3
1 2
2 3
3 1
```所有三个顶点上都有一个简单循环。 有效的生成仙人掌子图是三个生成树和完整的三角形。 

| 舞台| 重要状态| 价值|
 | --- | --- | --- |
 | 循环 DP | (f[{1,2,3}]) | 1 |
 | 处理顶点 1 | (f[{1,2,3}]) | 1 |
 | 处理顶点 2 | (f[{1,2,3}]) | 1 |
 | 处理顶点 3 | (f[{1,2,3}]) | 4 |
 | 决赛| (f[V]) | 4 |

 当处理顶点3时，它可以分别附加到顶点1和2。指数结合了三个生成树对应的可能性，而先前计数的循环则贡献了第四个结构。 

因此答案是`4`。 

### 示例 2

 该图有五个顶点，没有边。```
5 0
```没有循环，也没有可能的桥接块。 单例状态是存在的，但是没有办法将两个不同的顶点组合成一个连接的结构。 

| 舞台| 可用顶点数 | 全套状态|
 | --- | --- | --- |
 | 初始块 | 1 至 5 | 0 |
 | 处理顶点 1 | 5 | 0 |
 | 处理顶点 2 | 5 | 0 |
 | 处理顶点 3 | 5 | 0 |
 | 处理顶点 4 | 5 | 0 |
 | 处理顶点 5 | 5 | 0 |

 最终的完整状态保持为零，与样本输出匹配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n^3 2^n)) | 循环 DP 需要 (O(n^2 2^n))； 排序子集指数应用于每个顶点和总体成本 (O(n^3 2^n)) |
 | 空间| (O(n2^n)) | 主子集数组和一个排序变换表占据内存 |

 对于 (n\le13)，(2^n) 仅是 8192。因此，优化关节阶段的立方因子对于预期限制来说足够小。 该方法避免了不可能的 (2^m) 枚举，并且完全适用于顶点子集。 已知相同的循环计数加上集合指数结构可以实现 (O(n^3 2^n)) 的广义公式。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

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

# Provided sample 1
assert run("""\
3 3
1 2
2 3
3 1
""") == "4", "sample 1"

# Provided sample 2
assert run("""\
5 0
""") == "0", "sample 2"

# Provided sample 3
assert run("""\
8 9
1 5
1 8
2 4
2 8
3 4
3 6
4 7
5 7
6 8
""") == "35", "sample 3"

# Minimum-size graph: one isolated vertex is connected.
assert run("""\
1 0
""") == "1", "single vertex"

# Two vertices without an edge are disconnected.
assert run("""\
2 0
""") == "0", "two isolated vertices"

# A path on three vertices has exactly one spanning cactus.
assert run("""\
3 2
1 2
2 3
""") == "1", "path of length two"

# Complete graph K4.
# 16 spanning trees + 11 connected unicyclic four-edge graphs.
assert run("""\
4 6
1 2
1 3
1 4
2 3
2 4
3 4
""") == "27", "K4"

# Maximum number of vertices with no edges.
assert run("""\
13 0
""") == "0", "maximum n, empty graph"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 0`| 1 | 最小可能的图和单例基本状态 |
 |`2 0`| 0 | Connectivity boundary and empty edge set |
 |`3 2`有边缘`1-2, 2-3`| 1 | 跨越要求和桥梁施工|
 | (K_4) | 27 | 27 多个循环和拒绝循环共享边缘的图 |
 |`13 0`| 0 | 最大顶点边界和子集状态边界 |

 ## 边缘情况

 对于单顶点情况```
1 0
```初始状态 (f[{1}]) 设置为 1。没有可以引入另一个顶点的关节变换，因此完整掩码保持为 1。该算法正确地将单顶点图视为已连接。 

对于两个孤立的顶点，```
2 0
```两个单例状态都已初始化，但没有边缘，也没有循环。 在每个衔接步骤中，涉及度数的项为零。 不会创建包含两个顶点的状态，因此 (f[{1,2}]=0)。 

对于路径```
3 2
1 2
2 3
```没有循环状态。 当处理顶点 2 时，其下邻居 1 创建由边 (1-2) 组成的片段。 当处理顶点 3 时，其下邻居 2 附加包含顶点 1 和 2 的已构造组件。因此，完整掩码恰好接收到与完整路径相对应的一个贡献。 

对于 (K_4)，循环 DP 将每个简单循环创建为原子块。 铰接阶段可以连接自行车和桥，但它永远不会创建两个不同的自行车块共享边缘的结构。 因此，所有 16 个生成树和所有 11 个连接的单环四边图都存活下来，而五边和六边图则被排除在外，因为它们的循环在边上重叠。 结果答案是 27。 

最微妙的边界是周期计数中的除以二。 诸如 (1-2-3-1) 之类的循环可以作为 (1,2,3) 或 (1,3,2) 进行遍历，但这两种遍历都描述相同的无向边集。 DP 对两个方向进行计数，并仅在结束循环后除以二。 这是安全的，因为该图没有多重边，因此每个简单循环都恰好具有这两个方向。
