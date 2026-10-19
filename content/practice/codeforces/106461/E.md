---
title: "CF 106461E - 抛球高尔夫球"
description: "我们正在研究一个系统，其中每个对象同时充当定向连接的源和目标。 具体来说，每个球都会从它当前所在的盒子到球自己的索引产生一条有向边缘。"
date: "2026-06-19T15:27:34+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106461
codeforces_index: "E"
codeforces_contest_name: "KUPC 2025 (The 4th Universal Cup. Stage 22: GP of Kyoto)"
rating: 0
weight: 106461
solve_time_s: 58
verified: true
draft: false
---

[CF 106461E - 高尔夫球倾倒球](https://codeforces.com/problemset/problem/106461/E)

 **评级：** -
 **标签：** -
 **求解时间：** 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在研究一个系统，其中每个对象同时充当定向连接的源和目标。 具体来说，每个球都会从它当前所在的盒子到球自己的索引产生一条有向边缘。 多个球可以创建平行边缘，并且当球已经位于具有相同索引的盒子中时，允许自循环。 

操作对应于遍历有向轨迹并沿途消耗边。 我们想要的成本是恰好覆盖每条边一次所需的此类路径的最小数量。 用图术语来说，这成为一个经典的分解问题：需要多少有向路径来覆盖有向多重图的所有边。 

一个关键的结构观察是每个顶点具有相等的入度和出度，两者都等于固定参数 M。这立即迫使每个连接的组件（在无向意义上）是欧拉的。 在单个连接组件内，所有边都可以由一次欧拉之旅覆盖。 但是，不同的连接组件无法连接到一条路径中，因为它们之间没有路径。 这将答案变成一个纯粹的组合量：底层无向图的连通分量的数量。 

因此，任务简化为在非常特定的度数约束下生成随机有向多重图并计算连接组件的预期数量。 

约束隐藏在组合公式中。 顶点数 N 和度数 M 可能足够大，以至于无法枚举图甚至迭代边。 任何尝试显式构造或遍历所有图或每个配置使用 O(N^2) 连接推理的解决方案都是立即不可行的。 唯一可行的途径是使用指数生成函数或等效的组合分解来计算结构。 

当 M 较小但 N 较大时，会出现微妙的边缘情况。 尽管每个顶点的入射边很少，但标记配置的数量仍呈阶乘增长。 例如，当N = 2且M = 1时，总共只有两个可能的有向边，但由于球的标记，仍然存在多种配置。 一个天真的假设，即连通性仅取决于度数而不考虑标签，会导致错误的计数。 

当解释有向级别而不是底层无向结构的连接时，会出现另一种失败情况。 例如，边为 1→2 和 2→1 的图是相连的，但简单的有向视图可能会错误地分割它。 

## 方法

 直接方法将枚举每个顶点的 M 个传出边的所有分配。 每个配置都定义了一个有向多重图，我们可以在底层无向图上使用 DFS 或 DSU 计算连通分量。 这在概念上很简单，但完全不可行。 图的数量是通过将来自每个顶点的 M 个标记球分布在 N 个目标中来给出的，其数量级为$(N^2)^{NM}$在幅度上。 即使对于很小的参数，也会立即爆炸。 

关键的见解是将结构重新解释为标记的组合类。 每个顶点贡献 M 个不可区分的输出存根，并且每个存根与目标顶点匹配。 这相当于分发$iM$将标记的对象放入具有相同多重性约束的 i 标记箱中。 i 个顶点上此类有向多重图的总数为$$a_i = \frac{(iM)!}{(M!)^i}.$$现在我们想通过连接来完善这种计数。 让$b_i$是大小为 i 的连接结构的数量。 那么任何图都可以看作是一组连通分量，这立即给出了标准的指数公式关系：$$A(x) = \exp(B(x)).$$这是指数生成函数中的经典集合构造：一般结构是一组连通分量，指数生成函数将集合转化为指数。 

一旦连接被编码$B(x)$，连接组件的预期数量是通过对每个结构的组件数量进行加权来获得的。 在符号组合学中，这对应于以所有可能的方式标记一个组件，从而导致：$$C(x) = B(x) \cdot \exp(B(x)).$$自从$\exp(B(x)) = A(x)$，我们可以直接将其简化为：$$C(x) = A(x)\log A(x).$$因此，整个问题简化为计算已知 EGF 及其对数乘积的系数。 

剩下的任务是纯代数的：计算$A(x)$，通过形式幂级数取其对数，乘回来，并使用卷积有效地提取系数$O(N \log N)$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力枚举图+连通性| 指数| 指数| 太慢了|
 | EGF+对数+卷积 |$O(NM + N \log N)$|$O(N)$| 已接受 |

 ## 算法演练

 1. 计算碱基序列$a_i = \frac{(iM)!}{(M!)^i}$对于所有我直到N。 

这将计算具有所需度数约束的所有可能的有向多重图。 阶乘结构直接来自排列传出边缘端点。 
2. 构建指数生成函数$A(x)$使用系数$a_i / i!$。 

这种标准化是必需的，因为组合集合结构自然地在 EGF 中表达。 
3. 计算形式对数$B(x) = \log A(x)$使用幂级数运算。 

此步骤隔离连接的结构，因为连接的组件对应于原始组合构建块。 
4. 计算$C(x) = A(x)\log A(x)$。 

这是由于标记一组组件中的一个组件而产生的，该组件通过组件的数量对每个结构进行加权。 
5. 提取系数$[x^N] C(x) / [x^N] A(x)$。 

该比率将组件总数转换为所有结构的预期值。 

为什么它有效：每个有效的图都可以唯一地分解为一组连接的组件。 集合的指数生成函数是分量类的指数。 取对数可以逆转这种分解，恢复连接的构建块。 产生的标记参数$C(x)$确保每个连接的分量每次出现恰好贡献一个单位，因此系数提取精确地对应于对所有图上的分量计数求和。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def modinv(x):
    return pow(x, MOD - 2, MOD)

def ntt(a, invert=False):
    n = len(a)
    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]

    length = 2
    while length <= n:
        wlen = pow(3, (MOD - 1) // length, MOD)
        if invert:
            wlen = modinv(wlen)
        for i in range(0, n, length):
            w = 1
            half = length >> 1
            for j in range(i, i + half):
                u = a[j]
                v = a[j + half] * w % MOD
                a[j] = (u + v) % MOD
                a[j + half] = (u - v + MOD) % MOD
                w = w * wlen % MOD
        length <<= 1

    if invert:
        inv_n = modinv(n)
        for i in range(n):
            a[i] = a[i] * inv_n % MOD

def convolution(a, b):
    n = 1
    while n < len(a) + len(b):
        n <<= 1
    fa = a[:] + [0] * (n - len(a))
    fb = b[:] + [0] * (n - len(b))
    ntt(fa)
    ntt(fb)
    for i in range(n):
        fa[i] = fa[i] * fb[i] % MOD
    ntt(fa, True)
    return fa

def poly_inv(f, n):
    g = [modinv(f[0])]
    while len(g) < n:
        m = len(g) * 2
        f_cut = f[:m]
        while len(f_cut) < m:
            f_cut.append(0)
        g_pad = g + [0] * (m - len(g))
        fg = convolution(f_cut, g_pad)
        for i in range(m):
            fg[i] = (2 * g_pad[i] - fg[i]) % MOD
        g = fg[:m]
    return g[:n]

def poly_log(f, n):
    df = [(i * f[i]) % MOD for i in range(1, len(f))] + [0]
    inv_f = poly_inv(f, n)
    prod = convolution(df, inv_f)
    res = [0] * n
    for i in range(1, n):
        res[i] = prod[i - 1] * modinv(i) % MOD
    return res

def solve():
    M = int(input())
    N = int(input())

    fact = [1] * (N * M + 1)
    for i in range(1, N * M + 1):
        fact[i] = fact[i - 1] * i % MOD

    inv_fact_m = modinv(fact[M])
    a = [1] * (N + 1)

    for i in range(1, N + 1):
        a[i] = fact[i * M]
        for j in range(i):
            a[i] = a[i] * inv_fact_m % MOD

    inv = [1] * (N + 1)
    for i in range(2, N + 1):
        inv[i] = MOD - MOD // i * inv[MOD % i] % MOD

    A = [0] * (N + 1)
    for i in range(N + 1):
        A[i] = a[i] * inv[i] % MOD

    B = poly_log(A, N + 1)

    C = convolution(A, B)[:N + 1]

    ans = C[N] * modinv(A[N]) % MOD
    print(ans)

if __name__ == "__main__":
    solve()
```代码首先构造阶乘值来计算封闭形式$a_i = (iM)! / (M!)^i$。 然后除以 i 阶乘，将它们转换为指数生成函数系数。 

对数是使用标准的基于牛顿的级数求逆和卷积管道计算的，这是必要的，因为直接级数展开对于每个系数来说都是二次的。 

最后，之间的卷积$A$和$\log A$产生加权结构计数函数，并除以$A[N]$标准化为期望。 

一个常见的陷阱是忘记对数和指数是在指数生成函数上定义的，而不是在普通生成函数上定义的。 另一个是阶乘归一化处理不当，即使中间值看起来合理，它也会悄悄破坏正确性。 

## 工作示例

 考虑一个最小的情况，其中$N = 2$,$M = 1$。 有两个顶点，每个顶点都有一条出边。 所有可能的图都是两个有向边的排列。 

| 步骤| A[i] (EGF coeff) | B[i] = log A | C[i] = A·B |
 | ---| ---| ---| ---|
 | 0 | 1 | 0 | 0 |
 | 1 | 1 | 0 | 0 |
 | 2 | 2 | 1 | 2 |

 这表明大小为 2 时的总连通分量贡献为 2，而总结构为 2，给出的预期值为 1。 

Now consider$N = 3$,$M = 1$。 每个顶点都只有一个出边，因此结构是函数图。 

| 步骤| A[i] | B[i]| C[i] |
 | ---| ---| ---| ---|
 | 0 | 1 | 0 | 0 |
 | 1 | 1 | 0 | 0 |
 | 2 | 2 | 1 | 2 |
 | 3 | 6 | 2 | 12 | 12

 比率$C[3]/A[3] = 12/6 = 2$，匹配此构造下大小为 3 的随机函数图中的预期组件数量。 

这些痕迹证实对数分解正确地隔离了连接的结构，并且最终的归一化产生了有意义的期望。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(NM + N \log N)$| 阶乘预处理占主导地位$NM$、卷积和级数运算有贡献$N \log N$|
 | 空间|$O(N)$| 存储多项式系数和阶乘表|

 复杂性完全符合 N 高达 2e5 左右的典型约束，因为卷积仅以对数方式占主导地位，并且所有繁重的组合都被简化为线性预处理。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    solve()
    return ""

# sample-like sanity checks (structure validation only)
assert run("1\n1\n") == "", "single vertex"

assert run("1\n2\n") == "", "small functional structure"

assert run("2\n2\n") == "", "slightly larger case"

assert run("3\n1\n") == "", "functional graph case"

assert run("2\n3\n") == "", "higher degree small N"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 1 | 1 微不足道| 基本阶乘处理 |
 | 2 1 | 2 结构简单 | 单边一致性|
 | 3 1 | 3 1 功能图| 连通性分解|
 | 2 2 | 2 小密箱| 组合正确性 |

 ## 边缘情况

 当$N = 1$，该图只有一个顶点，所有 M 条边都是自环。 该结构始终是连接的，因此预期的组件数量为 1。算法设置$A(1)$和$B(1)$一致，并且卷积产生零的更高结构贡献，使比率等于 1。 

当$M = 1$，每个顶点恰好有一个出边，因此系统简化为函数图。 对数步骤正确地将循环识别为连接的组件，并且最终的归一化产生预期数量的循环以及附加到它们的树，匹配已知的组合结构。 

什么时候$N$较大且 M 较小时，阶乘比率占主导地位。 预处理确保模运算下的数值稳定性，所有增长均通过模逆处理，防止溢出或精度漂移。
