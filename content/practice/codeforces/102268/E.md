---
title: "CF 102268E - 预期值"
description: "我们有一个连通的无向平面图，其顶点由其坐标给出，其边是直线段。 随机游走从顶点 (1) 开始。 每当行走位于顶点时，它都会均匀地选择其入射边之一并穿过它。"
date: "2026-08-17T18:47:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102268
codeforces_index: "E"
codeforces_contest_name: "300iq Contest 1"
rating: 0
weight: 102268
solve_time_s: 410
verified: false
draft: false
---

[CF 102268E - 预期值](https://codeforces.com/problemset/problem/102268/E)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 50s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个连通的无向平面图，其顶点由其坐标给出，其边是直线段。 随机游走从顶点 (1) 开始。 每当行走位于顶点时，它都会均匀地选择其入射边之一并穿过它。 该过程在第一次到达顶点 (n) 时停止，我们需要预期的移动次数，以模 (998244353) 表示。 

随机游走本身不需要坐标。 它们的目的是描述平面嵌入，这为我们提供了边数的关键结构限制。 具有 (n\ge 3) 个顶点的简单平面图最多具有 (3n-6) 条边。 因此，尽管该语句在语法上允许一般的完整图绑定，但实际的输入图是稀疏的，(m=O(n))。 官方问题使用 (n\le 3000)，因此 (O(n^2)) 算法是现实的，而密集 (O(n^3)) 线性代数方法太慢。 

问题的概率性质还隐藏着另一个约束。 击球时间不受 (n) 限制，因此模拟固定步数的步行无法直接给出准确的答案。 具有 (n) 个顶点的路径的预期命中时间为 (n(n-1))，更复杂的图也可能具有较大的命中时间。 我们需要将生存概率的无限序列转化为有限的计算。 

第一个边缘情况是可能的最小图。 对于两个顶点和一条边 (1\mathbin{-}2)，答案正是 (1)。```
2
0 0
5000 5000
1
1 2
```仅构建瞬态图并假设每个瞬态顶点都有传出转换的粗心实现可能会在这里失败，因为在删除目标后，没有剩余的边。 正确的解释是，步行直接移动到顶点 (2)，因此输出为 (1)。 

第二个边缘情况是较大图中目标的直接边缘。 考虑```
3
0 0
1 0
5000 5000
2
1 2
1 3
```从顶点 (1) 开始，步行以 (1/2) 的概率到达顶点 (3)，而以 (1/2) 的概率移动到顶点 (2)，从那里它必须返回到 (1)。 期望为 (3)，因为
 [
 E_1=1+\frac12E_2,\qquad E_2=1+E_1,
 ]
 所以（E_1=3）。 一个常见的错误是在删除目标后对瞬态转移概率进行归一化。 这会错误地使顶点 (1) 以概率 (1) 移动到顶点 (2)，而原始行走仍会在所有原始邻居中进行选择。 

第三种边缘情况是具有许多与目标相关的边的图。 这些边缘会影响其他端点的程度，因为它们代表击中目标的真正可能性。 即使它们从瞬态转移矩阵中消失，它们也必须保持在用于转移概率的程度。 

## 方法

 最直接的方法是为每个顶点写一个第一步方程。 令 (E_v) 为从 (v) 到达 (n) 的预期剩余时间。 然后 (E_n=0)，并且对于每个其他顶点
 [
 E_v=1+\frac{1}{\deg(v)}\sum_{u\sim v}E_u。 
]
 固定(E_n=0)后，这是一个具有(n-1)个未知数的线性系统。 

这个系统在数学上是完美的，但是普通的密集高斯消元法执行 (\Theta(n^3)) 算术运算。 仅消除更新计数大约为
 [
 \sum_{k=0}^{n-2}(n-k-1)^2
 =\frac{(n-1)(n-2)(2n-3)}6,
 ]
 当 (n=3000) 时，大约更新 (9\times10^9) 次。 稀疏输入并不能节省简单的实现，因为消除会产生填充。 强力线性系统公式对于理解正确性很有用，但它没有充分利用图结构。 

解锁预期解决方案的观察是停止直接询问期望。 对于非负整数值随机变量 (T)，
 [
 E[T]=\sum_{i\ge0}\Pr(T>i)。 
]
 设 (S_i=\Pr(T>i))。 我们不是求解一个期望值，而是生成序列 (S_i) 的前 (2(n-1)) 个值。 

从状态空间中删除目标顶点 (n)，但不更改原始度数。 令 (f_i(v)) 为在 (i) 移动之后步行者处于瞬态顶点 (v) 且从未访问过 (n) 的概率。 过渡是线性的：
 [
 f_{i+1}(v)=\sum_{u\sim v,\u\ne n}\frac{f_i(u)}{\deg(u)}。 
]
 生存概率很简单
 [
 S_i=\sum_{v\ne n}f_i(v)。 
]

 只有 (n-1) 个瞬态，因此这是重复应用的固定线性变换。 根据凯莱-汉密尔顿定理，从 ((n-1)\times(n-1)) 矩阵的幂获得的每个序列最多满足 (n-1) 次的线性递推。 因此，(S_i)也满足这样的递推式。 Berlekamp-Massey 可以从前 (2(n-1)) 项中恢复最短的递归。 标准 (2N) 项界限正是我们只需要这个无限序列的有限前缀的原因。 

最后，递归给出无限和而不产生更多项。 如果
 [
 C(x)=c_0+c_1x+\cdots+c_Lx^L
 ]
 是 Berlekamp-Massey 返回的连接多项式，则
 [
 F(x)=\sum_{i\ge0}S_ix^i
 ]
 满足 (F(x)C(x)=R(x))，其中 (R) 的次数小于 (L)。 因此
 [
 F(1)=\frac{R(1)}{C(1)}。 
]
 这正是该问题的已知解决方案中使用的技术。 平面图界限 (m=O(n)) 使得生成所有项需要 (O(nm)=O(n^2)) 运算，而 Berlekamp-Massey 则需要 (O(n^2)) 运算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^3)) | (O(n^2)) | 太慢了 |
 | 最佳| (O(nm+n^2)=O(n^2)) | (O(n+m)) | 已接受 |

 ## 算法演练

1. 读取图并计算每个顶点的原始度数。 该度数必须包括直接到达顶点 (n) 的边，因为这些边是随机游走做出的真实选择。 
2. 从瞬态空间中移除顶点 (n)。 存储两个端点不同于 (n) 的每条边。 这样的边缘有助于两个方向的过渡。 与 (n) 相关的边不会存储为瞬态转换，因为采用其中之一会终止该过程。 
3. 计算每个瞬态顶点度数的模逆。 如果 (u) 处的当前概率为 (f(u))，则对每个邻居的贡献量为 (f(u)/\deg(u))。 所有除法均以模 (998244353) 进行。 
4. 将 (f_0(1)=1) 和所有其他瞬态概率初始化为零。 因此，(S_0=1)，因为步行已走了零步，并且肯定没有到达 (n)。 
5. 重复应用瞬态转移矩阵来生成 (S_1,S_2,\ldots,S_{2N-1})，其中 (N=n-1)。 对于内部边缘 ((u,v))，下一个概率在 (v) 处接收 (f(u)/\deg(u))，在 (u) 处接收 (f(v)/\deg(v))。 因此，处理每个无向边一次会执行两个有向转换。 
6. 将 Berlekamp-Massey 应用于所得序列。 它返回满足以下条件的系数 (C_0,\ldots,C_L)
 [
 \sum_{j=0}^{L}C_jS_{i-j}=0
 ]
 对于每个 (i\ge L)，其中 (C_0=1)。 递归度最多为(N)，因此(2N)项足以确定无限递归。 
7. 定义
 [
 F(x)=\sum_{i\ge0}S_ix^i,\qquad
 C(x)=\sum_{j=0}^{L}C_jx^j。 
]
 将它们相乘得出
 [
 F(x)C(x)=R(x),
 ]
 其中从 (x^L) 开始的系数消失，因为它们正是递推方程。 因此(R)最多具有(L-1)度。 
8. 在 (x=1) 处进行评估。 由于 (F(1)=E[T])，
 [
 E[T]=\frac{R(1)}{C(1)}。 
]
 分子可以根据 (S_i) 的前缀和计算：
 [
 R(1)=
 \sum_{j=0}^{L-1}C_j
 \left(\sum_{k=0}^{L-1-j}S_k\right)。 
]
 分母很简单
 [
 C(1)=\sum_{j=0}^{L}C_j。 
]
 9. 将分子乘以 (C(1)) 的模逆并打印结果。 问题的模分数解释保证了为所提供的测试定义了该逆矩阵。 

### 为什么它有效

 关键的不变量是 (f_i) 准确包含在 (i) 移动但未访问目标的情况下位于每个非目标顶点的概率。 转换保留了该含义，因为每个原始选择都有概率 (1/\deg(u))，而转换到 (n) 则简单地从幸存概率质量中省略。 因此 (S_i=\sum_v f_i(v)) 正是 (\Pr(T>i))。 

瞬态转换是乘以固定矩阵 (M)。 Cayley-Hamilton 给出了一个次数最多 (N=n-1) 的多项式，它消灭了 (M)，因此从 (M^i) 获得的每个标量序列，包括 (S_i)，都满足次数最多为 (N) 的递推。 Berlekamp-Massey 从 (2N) 项中恢复了递归。 一旦递归已知，(F(x)C(x)) 只包含其前 (L) 个系数，因此在 (x=1) 处评估有理生成函数会给出所有生存概率的无限总和，这正是预期的命中时间。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def berlekamp_massey(s):
    # C[0] = 1 and
    # sum(C[i] * s[n-i]) = 0
    # for all sufficiently large n.
    C = [1]
    B = [1]

    L = 0
    m = 1
    b = 1

    for n in range(len(s)):
        d = s[n]
        for i in range(1, L + 1):
            d = (d + C[i] * s[n - i]) % MOD

        if d == 0:
            m += 1
            continue

        old_C = C[:]
        coef = d * pow(b, MOD - 2, MOD) % MOD

        need = m + len(B)
        if len(C) < need:
            C.extend([0] * (need - len(C)))

        for i in range(len(B)):
            C[i + m] = (C[i + m] - coef * B[i]) % MOD

        if 2 * L <= n:
            L = n + 1 - L
            B = old_C
            b = d
            m = 1
        else:
            m += 1

    return C[:L + 1]

def solve():
    n = int(input())

    # Coordinates only describe the plane embedding.
    for _ in range(n):
        input()

    m = int(input())

    target = n - 1
    deg = [0] * n
    internal_edges = []

    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1

        if u != target:
            deg[u] += 1
        if v != target:
            deg[v] += 1

        if u != target and v != target:
            internal_edges.append((u, v))

    inv_deg = [0] * (n - 1)
    for v in range(n - 1):
        inv_deg[v] = pow(deg[v], MOD - 2, MOD)

    N = n - 1
    terms = [1]

    # f[v] is the probability of being at v without
    # having visited the target.
    f = [0] * N
    f[0] = 1

    # We need 2N terms: S_0 ... S_{2N-1}.
    for _ in range(1, 2 * N):
        scaled = [0] * N
        for v in range(N):
            scaled[v] = f[v] * inv_deg[v] % MOD

        nxt = [0] * N

        # Each undirected internal edge represents two
        # possible directed transitions.
        for u, v in internal_edges:
            x = nxt[u] + scaled[v]
            if x >= MOD:
                x -= MOD
            nxt[u] = x

            x = nxt[v] + scaled[u]
            if x >= MOD:
                x -= MOD
            nxt[v] = x

        total = 0
        for v in range(N):
            total += nxt[v]
            if total >= MOD:
                total -= MOD

        terms.append(total)
        f = nxt

    C = berlekamp_massey(terms)
    L = len(C) - 1

    # prefix[i] = S_0 + ... + S_i
    prefix = [0] * len(terms)
    cur = 0
    for i, x in enumerate(terms):
        cur += x
        if cur >= MOD:
            cur -= MOD
        prefix[i] = cur

    # R(1) = sum_{j=0}^{L-1} C[j] *
    #              (S_0 + ... + S_{L-1-j})
    numerator = 0
    for j in range(L):
        numerator = (
            numerator + C[j] * prefix[L - 1 - j]
        ) % MOD

    denominator = sum(C) % MOD
    answer = numerator * pow(denominator, MOD - 2, MOD) % MOD

    print(answer)

if __name__ == "__main__":
    solve()
```输入解析器首先读取所有坐标并丢弃它们。 它们对于描述平面图的语句是必要的，但随机游走仅取决于邻接。 

在将目标从过渡系统中移除之前计算度数组。 这是实现中最微妙的图形细节。 如果存在一条边 (u-n)，则它必须增加 (\deg(u))，即使它对`nxt`，因为选择该边正是结束步行的事件。 

仅存储端点均为瞬态的边。 更新两者后处理无向边 ((u,v))`nxt[u]`和`nxt[v]`，与显式存储两个有向边相比，它将转换循环大约减少一半。 

概率向量保持模数`MOD`每次转换后。 该实现使用条件减法而不是`% MOD`对于每个边缘添加。 两个操作数都已在 ([0,\mathrm{MOD})) 范围内，因此一次减法就足够了。 

Berlekamp-Massey 仅存储当前和之前的连接多项式。 因此，该实现使用 (O(n)) 内存，而不是存储每个中间多项式，这是不必要的。 

最后的生成函数计算值得特别关注。 若(C(x)=\sum C_jx^j)，则(F(x)C(x))中(x^k)的系数为
 [
 \sum_{j=0}^{k}C_jS_{k-j}。 
]
 它在 (k\ge L) 内消失，因此只有 (k<L) 对 (R(1)) 有贡献。 代码中的前缀和表达式在 (O(L)) 时间内计算所有这些贡献，而不是使用另一个 (O(L^2)) 嵌套循环。 

数学计算中不会发生整数溢出，因为每个值都会以模 (998244353) 进行减少。 Python 整数还消除了 C++ 中存在的固定宽度溢出问题，尽管保持值减小对于性能仍然是必要的。 

## 工作示例

 ### 示例 1

 该图只有顶点 (1) 和 (2)，其中 (2) 作为目标。 

| 步骤| (f(1)) | (f(1)) | (S_i) | BM状态|
 | --- | --- | --- | --- |
 | (0) | (1) | (1) | 初始|
 | (1) | (0) | (0) | 复发开始|
 | (2) | (0) | (0) | 稳定的零尾|
 | 决赛| (0) | (1,0,\点) | (C(x)=1) 有效 |

 从顶点 (1) 的唯一移动直接到顶点 (2)，因此 (T=1)。 生存序列为(1,0,0,\ldots)，其生成函数为(F(x)=1)。 最终结果为(1)。 

### 示例 2

 该图有六个顶点，顶点 (6) 是目标。 瞬态度为
 [
 \deg(1)=2,\quad
 \deg(2)=4,\quad
 \deg(3)=2,\quad
 \deg(4)=3,\quad
 \deg(5)=2。 
]

 前几个瞬态足以了解如何处理概率质量。 

| 步骤| (f(1)) | (f(1)) | (f(2)) | (f(2)) | (f(3)) | (f(3)) | (f(4)) | (f(4)) | (f(5)) | (f(5)) | (S_i) |
 | --- | --- | --- | --- | --- | --- | --- |
 | (0) | (1) | (0) | (0) | (0) | (0) | (1) |
 | (1) | (0) | (1/2) | (0) | (0) | (0) | (1/2) |
 | (2) | (1/8) | (0) | (1/8) | (1/8) | (0) | (3/8) |
 | (3) | (0) | (1/6) | (1/24) | (1/16) | (1/24) | (5/16) |

 在步骤(1)，一半概率从(1)到(2)，而另一半则直接到达目标并从瞬态消失。 这就是为什么(S_1=1/2)。 

实际期望值也可以直接从第一步方程中检查。 从顶点 (i) 写入 (E_i) 的预期时间，我们得到
 [
 E_1=1+\frac{E_2}{2},
 ]
 [
 E_2=1+\frac{E_1+E_3+E_4}{4},
 ]
 [
 E_3=1+\frac{E_2+E_4}{2},
 ]
 [
 E_4=1+\frac{E_2+E_3+E_5}{3},
 ]
 [
 E_5=1+\frac{E_4}{2}。 
]
 求解得到 (E_1=18/5)。 取模 (998244353),
 [
 18\cdot5^{-1}\equiv798595486,
 ]
 与示例输出匹配。 

BM 阶段使用 (2(n-1)=10) 个生存值的完整前缀，找到序列的递归，并且生成函数评估返回相同的 (18/5)。 该迹线说明了为什么已经达到目标的概率必须从状态向量中永久消失。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(nm+n^2)) | (2(n-1)) 稀疏转换成本 (O(nm)) 和 Berlekamp-Massey 成本 (O(n^2)) |
 | 空间| (O(n+m)) | 该图、两个概率向量、生存序列和 BM 多项式都是线性大小的 |

 对于具有 (n\ge3)、(m\le3n-6) 的简单平面图，因此 (nm=O(n^2))。 因此，总复杂度为 (O(n^2))。 对于 (n\le3000)，这是问题的预期规模，而密集高斯消除将需要三次工作。 平面图的稀疏性正是将重复的矩阵向量乘法变成可行的运算的原因。 

## 测试用例```python
# Save the solution above as solution.py before running this test file.
import sys
import io

from solution import solve

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    try:
        solve()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

    return out.getvalue().strip()

def path_input(n: int) -> str:
    lines = [str(n)]
    for i in range(n):
        lines.append(f"{i} 0")

    lines.append(str(n - 1))
    for i in range(1, n):
        lines.append(f"{i} {i + 1}")

    return "\n".join(lines) + "\n"

# Provided sample 1
sample1 = """\
2
0 0
35 35
1
1 2
"""
assert run(sample1) == "1", "sample 1"

# Provided sample 2
sample2 = """\
6
0 0
1 1
2 4
3 9
4 16
5 25
8
1 2
2 3
2 4
3 4
4 5
5 6
1 6
2 6
"""
assert run(sample2) == "798595486", "sample 2"

# Minimum size, also tests the direct transition into the target.
assert run("""\
2
0 0
5000 5000
1
1 2
""") == "1", "minimum-size graph"

# Path 1-2-3 has expected hitting time 3 * 2 = 6.
assert run("""\
3
0 0
1 0
5000 5000
2
1 2
2 3
""") == "6", "path graph"

# Four-cycle, target is vertex 4.
# The expected hitting time from 1 is 9.
assert run("""\
4
0 0
5000 0
5000 5000
0 5000
4
1 2
2 3
3 4
4 1
""") == "9", "regular cycle"

# Star centered at vertex 1, target is vertex 4.
# E = 2 * 3 - 1 = 5.
assert run("""\
4
0 0
5000 0
0 5000
5000 5000
3
1 2
1 3
1 4
""") == "5", "direct target edge and high degree"

# Maximum-size path.
# H(1, n) = n(n-1) for a path.
assert run(path_input(3000)) == "8997000", "maximum-size sparse graph"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 由一条边连接的两个顶点 |`1`| 最小尺寸和空瞬态边缘集 |
 | 三顶点路径 |`6`| 反复回溯和非平凡重现 |
 | 四循环|`9`| 每个顶点具有相等度数的图 |
 | 四顶点星|`5`| 目标边缘必须保持在源度数 |
 | 坐标为 (0) 和 (5000) 的三顶点路径 |`6`| 坐标边界和普通图形行为 |
 | 三千顶点路径|`8997000`| 最大 (n)、稀疏平面图和 (O(n^2)) 尺度 |

 ## 边缘情况

 处理二顶点图是因为算法定义了(N=n-1=1)，所以只有一个瞬态。 它的度数为 1，其唯一的边到达目标，并且内部边列表为空。 初始状态为 (f_0(1)=1)，一次转换后瞬态概率变为零。 因此 (S_0=1) 和 (S_i=0) 之后，给出 (F(x)=1) 和答案 (1)。```
2
0 0
5000 5000
1
1 2
```较大图中目标的直接边的处理方式与普通瞬态边不同。 为了```
3
0 0
1 0
5000 5000
2
1 2
1 3
```顶点 (1) 的度数为 (2)，而不是度数 (1)。 转换 (1\to3) 被省略`nxt`因为它终止了行走，但因子 (1/\deg(1)=1/2) 仍用于转换 (1\to2)。 第一生存概率为(S_0=1)、(S_1=1/2)、(S_2=1/2)，它们的无限和为(3)。 

同样的原理可以处理连接到多个顶点的目标。 考虑四顶点星```
4
0 0
5000 0
0 5000
5000 5000
3
1 2
1 3
1 4
```顶点 (1) 的度数为 (3)。 每次访问 (1) 时，到达目标 (4) 的概率为 (1/3)，而移动到两个非目标叶子之一的概率为 (2/3)。 每片叶子立即返回到（1）。 第一步方程是
 [
 E_1=1+\frac23(1+E_1),
 ]
 给予（E_1=5）。 该实现获得了相同的结果，因为两个叶边保留在瞬态图中，而目标边仅对顶点 (1) 的度有贡献。 

一条漫长的道路则走向相反的极端。 对于（n=3000），每个内部顶点的度数为（2），顶点（1）的度数为（1），顶点（n）是吸收目标。 预计时间是
 [
 n(n-1)=3000\cdot2999=8997000。 
]
 在最终到达目标之前，步行可能会花费二次方步数反复向后移动，因此任何仅模拟 (O(n)) 步的方法从根本上是不够的。 递归方法并不关心实际期望有多大，因为它以代数方式重建了整个无限尾部。 

最后，模运算边界值得关注。 每个转移概率都是有理数，例如 (1/2)、(1/3) 或 (1/\deg(v))，因此实现在生成序列之前将每个分母转换为其模逆。 由于每个瞬态顶点在原始连通图中都具有正度，因此这些倒数以素数为模而存在。 最终除以 (C(1)) 的处理方式相同，符合问题所需的分数解释。
