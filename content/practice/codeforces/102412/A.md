---
title: "CF 102412A - 一个多项式人"
description: "我们有一个素数模 (p)、一个残数模 (p) 的子集 (S) 和另一个子集 (V)。 对于每个在 (S) 中都有值的有序对 ((a,b))，我们计算 [ F(a,b)= frac{(2a+3b)^2+5a^2}{(3a+b)^2} + frac{(2a+5b)^2+3b^2}{(3a+2b)^2} pmod p。"
date: "2026-08-11T08:27:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102412
codeforces_index: "A"
codeforces_contest_name: "MEX Foundation Contest (supported by AIM Tech)"
rating: 0
weight: 102412
solve_time_s: 500
verified: true
draft: false
---

[CF 102412A - 一个多项式人](https://codeforces.com/problemset/problem/102412/A)

 **评级：** -
 **标签：** -
 **求解时间：** 8m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个素数模 (p)、一个残数模 (p) 的子集 (S) 和另一个子集 (V)。 对于每个在 (S) 中都有值的有序对 ((a,b))，我们评估

 [
 F(a,b)=
 \压裂{(2a+3b)^2+5a^2}{(3a+b)^2}
 +
 \压裂{(2a+5b)^2+3b^2}{(3a+2b)^2}
 \pmod p。 
]

 当出现的每个分母均非零并且 (F(a,b)) 属于 (V) 时，该对被精确计数。 原始公式中的乘积只是一种紧凑的方式，表示对于某些 (z\in V)，至少一个因子 (F(a,b)-z) 为零。 

素数 (p) 可以大到 (10^6)，而 (S) 和 (V) 可以各自包含所有 (p) 残基。 因此，对所有有序对的直接扫描可以执行大约 (p^2) 或最多 (10^{12}) 个对检查。 四秒的限制完全排除了这种情况。 有用的目标大致为 (O(p\log p))，它是在大小与 (p) 成比例的数组上进行 FFT 或 NTT 的比例。 最初的竞赛解决方案正是使用了这种减少。 

有三种边缘情况需要单独处理。 

首先，决不能对 ((0,0)) 对进行计数。 例如，```
2
1
0
1
0
```只有 ((0,0)) 对，但两个分母都为零，所以答案是`0`。 如果不小心地实现了在没有首先删除零值的情况下替换 (a/b)，则该对没有有效的比率，并且可能会意外地将其视为特殊比率。 

其次，正好有一个零的对具有完全有效的分母，不能被丢弃。 对于(a=0,b\ne0)，表达式为(16)。 对于 (a\ne0,b=0)，它是 (13/9)。 例如，```
7
2
0 1
2
2 3
```包含对 ((0,1))，其值为 (16\equiv2\pmod7)，以及对 ((1,0))，其值为 (13/9\equiv3\pmod7)。 对 ((1,1)) 的值为 (0)，该值不在 (V) 中，并且 ((0,0)) 无效。 正确的输出是`2`。 简单地从 (S) 中删除零的实现会丢失这两个有效的有序对。 

第三，即使对于非零 (a,b)，比率也可以使分母消失。 例如，对于(p=7)，(3a+b=0)意味着(a/b=2)，而(3a+2b=0)意味着(a/b=4)。 因此对于```
7
2
1 2
1
0
```((1,1)) 和 ((2,2)) 对中的比率 (1) 和 (1) 有效并给出值 (0)，而 ((1,2)) 和 ((2,1)) 对分别具有比率 (4) 和 (2)，因此分母为零。 正确的输出是`2`。 简单地计算模求逆后的有理表达式而不检查其分母可能会产生不相关的值。 

## 方法

 暴力解决方案很简单。 对于每个 (a\in S) 和每个 (b\in S)，检查两个分母，计算两个模分数，获得 (F(a,b))，并测试该值是否属于 (V)。 这是正确的，因为每个有序对都被检查一次。 问题是 (p^2) 对计数。 在 (p=10^6) 处，甚至在考虑模逆或隶属度检查之前，可能存在 (10^{12}) 对。 这远远超出了时间限制。 

拯救我们的结构是同质性。 表达式中的每个分子和分母在 (a,b) 中都有二阶。 因此，当 (a\ne0) 和 (b\ne0) 时，将两个变量乘以相同的非零值不会改变结果。 该值仅取决于比率

 [
 t=\frac{a}{b}\pmod p.
 ]

 此观察将代数部分从所有 (p^2) 对减少到仅 (p-1) 个可能的非零比率。 预期的解决方案首先评估每个此类比率的表达式，并记录哪些比率产生属于 (V) 的值。 

这样我们就可以忘记复杂的有理函数。 剩下的问题是计算满足 (a,b\in S) 的对

 [
 a b^{-1}\in L,
 ]

 其中 (L) 是一组可接受的比率。 

普通卷积处理加法，而不是乘法。 然而，以素数为模的非零余数的乘法群是循环的。 选择一个原根 (g)。 每个非零留数都可以唯一地写为 (g^x)，其中 (0\le x<p-1)。 如果 (a=g^x) 且 (b=g^y)，则

 [
 \frac ab=g^{x-y}。 
]

 乘法比变成了指数之差。 我们可以通过循环卷积来计算这些差异。 一种方便的公式将 (S) 指示符与 (L) 指示符进行卷积。 在指数 (x) 处，卷积计算 (y) 和 (r) 的选择，其中 (y+r=x)，完全对应于 (r=x-y)，因此对应于 (a/b)。 这是标准解决方案描述的中心转换。 

由于卷积系数最多为(p)，因此我们可以使用NTT模(998244353)而不会产生歧义。 最大的卷积系数最多为（10^6），比NTT模小很多。 我们使用的 NTT 长度是上面的 2 的下一个幂 (2(p-1)-1)，最多为 (2^{21})。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(p^2\log p)) 具有直接模逆 | (O(p)) | 太慢了|
 | 比率降低+ NTT | (O(p\log p)) | (O(p)) | 已接受 |

 ## 算法演练

 1. 读取 (p)、(S) 和 (V)，并为这两个集合构建常量时间隶属度数组。 我们还将 (S) 的零与非零元素分开，因为只有当两个值都非零时，比率 (a/b) 才存在。 
2. 处理正好有一个零的对。 如果 (0\in S)，则每个非零 (x\in S) 都会创建两个有序对：((0,x)) 和 ((x,0))。 第一个值为 (16)，第二个值为 (13/9)。 只要这些值属于 (V)，就添加相应的计数。 ((0,0)) 对始终无效。 
3. 求原根 (g) 模 (p)。 因子 (p-1)，然后测试候选 (g)，直到 (g^{(p-1)/q}\ne1\pmod p) 对于 (p-1) 的每个不同素因子 (q)。 这保证了 (g) 的幂将每个非零余数恰好枚举一次。 
4. 构建离散对数数组。 从 (x=1) 开始，重复乘以 (g)。 在指数 (e) 处，记录当前余数的对数 (e)。 经过 (p-1) 次迭代后，每个非零余数都有一个已知的指数。 
5. 使用标准线性递推预先计算所有非零留数的模逆

 p-\left\lfloor\frac pi\right\rfloor
 \operatorname{inv}[p\bmod i]\pmod p。 
]

 这避免了对每个比率执行单独的 (O(\log p)) 求幂。 

1. 枚举每个非零比率 (t)。 分母是

 [
 (3t+1)^2
 \quad\text{和}\quad
 (3t+2)^2。 
]

如果 (3t+1) 或 (3t+2) 为零模 (p)，则跳过此比率，因为原始表达式明确禁止除以零。 

1. 对于剩余的每个 (t)，代入 (a=t,b=1)。 结果值为

 [
 G(t)=
 \frac{(2t+3)^2+5t^2}{(3t+1)^2}
 +
 \frac{(2t+5)^2+3}{(3t+2)^2}。 
]

 如果(G(t)\in V)，则标记第二个卷积数组中(t)的离散对数。 

1. 从 (S) 构建第一个卷积数组。 如果 (x\in S) 和 (x\ne0)，则在索引 (\log_g x) 处放一个 1。 根据接受的比率构建第二个数组，将 1 放在索引 (\log_g t) 处。 
2. 用 NTT 计算它们的普通卷积。 如果指数数组包含 (y) 和 (r)，则 (y+r) 处的系数计算满足以下条件的对：

 [
 \log_g(a)+\log_g(t)=\log_g(a),
 ]

 将第一个指数解释为 (b) 的指数之后。 更直接地，对于所需的分子指数 (x)，等式 (y+r=x) 恰好是 (r=x-y)，这意味着 (t=g^{x-y}=a/b)。 

1. 将卷积的后半部分向后折叠 (p-1)。 指数以 (p-1) 为模，因此系数 (k+(p-1)) 表示与系数 (k) 相同的乘法群指数。 
2. 对于每个非零 (a\in S)，在 (\log_g a) 处添加循环卷积系数。 该系数精确计算 (b\in S) 的选择，其中 (a/b) 是可接受的比率。 添加步骤 2 中的零情况贡献以获得最终答案。 

### 为什么它有效

 对于每个非零对 ((a,b))，写出 (a=g^x) 和 (b=g^y)。 该表达式是零次齐次的，因此其值仅取决于 (a/b=g^{x-y})。 比率预处理准确地标记了定义表达式并属于 (V) 的那些指数 (r=x-y)。 循环卷积精确计数满足(x=y+r)的指数对，相当于(r=x-y)。 因此，每个有效的非零有序对贡献一次，并且没有无效的对贡献。 单独处理的零情况涵盖了比率表示不可用的每一对。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

NTT_MOD = 998244353
NTT_ROOT = 3

def factorize(n):
    factors = []
    d = 2
    while d * d <= n:
        if n % d == 0:
            factors.append(d)
            while n % d == 0:
                n //= d
        d += 1 if d == 2 else 2
    if n > 1:
        factors.append(n)
    return factors

def primitive_root(p):
    if p == 2:
        return 1

    factors = factorize(p - 1)
    for g in range(2, p):
        ok = True
        for q in factors:
            if pow(g, (p - 1) // q, p) == 1:
                ok = False
                break
        if ok:
            return g
    return -1

def ntt(a, invert, rev):
    n = len(a)

    for i in range(n):
        j = rev[i]
        if i < j:
            a[i], a[j] = a[j], a[i]

    length = 2
    while length <= n:
        wlen = pow(
            NTT_ROOT,
            (NTT_MOD - 1) // length,
            NTT_MOD
        )
        if invert:
            wlen = pow(wlen, NTT_MOD - 2, NTT_MOD)

        half = length >> 1

        for start in range(0, n, length):
            w = 1
            end = start + half
            j = start

            while j < end:
                u = a[j]
                v = a[j + half] * w % NTT_MOD

                x = u + v
                if x >= NTT_MOD:
                    x -= NTT_MOD

                y = u - v
                if y < 0:
                    y += NTT_MOD

                a[j] = x
                a[j + half] = y

                w = w * wlen % NTT_MOD
                j += 1

        length <<= 1

    if invert:
        inv_n = pow(n, NTT_MOD - 2, NTT_MOD)
        for i in range(n):
            a[i] = a[i] * inv_n % NTT_MOD

def convolution(a, b):
    need = len(a) + len(b) - 1
    n = 1
    while n < need:
        n <<= 1

    fa = a + [0] * (n - len(a))
    fb = b + [0] * (n - len(b))

    rev = array('I', [0]) * n
    half = n >> 1
    for i in range(1, n):
        rev[i] = (rev[i >> 1] >> 1) | ((i & 1) * half)

    ntt(fa, False, rev)
    ntt(fb, False, rev)

    for i in range(n):
        fa[i] = fa[i] * fb[i] % NTT_MOD

    del fb

    ntt(fa, True, rev)
    return fa[:need]

def solve():
    p = int(input())

    n = int(input())
    s = list(map(int, input().split())) if n else []

    m = int(input())
    v = list(map(int, input().split())) if m else []

    in_s = bytearray(p)
    for x in s:
        in_s[x] = 1

    in_v = bytearray(p)
    for x in v:
        in_v[x] = 1

    ans = 0

    has_zero = in_s[0]

    # Handle (0, b), b != 0.
    # The value is 16.
    if has_zero and in_v[16 % p]:
        ans += n - 1

    # Handle (a, 0), a != 0.
    # The value is 13 / 9.
    # If 9 == 0 mod p, the denominator is zero and no such pair is valid.
    if has_zero and 9 % p != 0:
        value = 13 * pow(9, p - 2, p) % p
        if in_v[value]:
            ans += n - 1

    nonzero_count = n - (1 if has_zero else 0)

    if nonzero_count == 0 or m == 0:
        print(ans)
        return

    q = p - 1

    # Find a primitive root and construct discrete logarithms.
    g = primitive_root(p)

    log = array('i', [-1]) * p
    cur = 1
    for e in range(q):
        log[cur] = e
        cur = cur * g % p

    # Linear-time modular inverses.
    inv = array('I', [0]) * p
    if p > 1:
        inv[1] = 1
        for i in range(2, p):
            inv[i] = (
                p - (p // i) * inv[p % i] % p
            )

    # A[x] = 1 iff g^x is in S.
    a_poly = [0] * q
    for x in range(1, p):
        if in_s[x]:
            a_poly[log[x]] = 1

    # B[r] = 1 iff g^r is an accepted ratio.
    b_poly = [0] * q

    for t in range(1, p):
        d1 = (3 * t + 1) % p
        d2 = (3 * t + 2) % p

        if d1 == 0 or d2 == 0:
            continue

        u = (2 * t + 3) % p
        w = (2 * t + 5) % p

        num1 = (u * u + 5 * t * t) % p
        num2 = (w * w + 3) % p

        inv_d1 = inv[d1]
        inv_d2 = inv[d2]

        term1 = num1 * inv_d1 % p * inv_d1 % p
        term2 = num2 * inv_d2 % p * inv_d2 % p
        value = (term1 + term2) % p

        if in_v[value]:
            b_poly[log[t]] = 1

    c = convolution(a_poly, b_poly)

    # Convert ordinary convolution into cyclic convolution modulo p - 1.
    for i in range(q, len(c)):
        c[i - q] += c[i]

    # For a = g^x, c[x] counts b = g^y with
    # x = y + log(a / b).
    for x in range(1, p):
        if in_s[x]:
            ans += c[log[x]]

    print(ans)

if __name__ == "__main__":
    solve()
```输入被读取`input = sys.stdin.readline`，根据需要。 会员集使用`bytearray`，即使在 (p=10^6) 时，每个残基的存储量也很小。 

零处理发生在使用任何离散对数之前。 ((0,b)) 的值为 (16)，而 ((a,0)) 的值为 (13/9)。 支票`9 % p != 0`是必要的，因为当 (b=0) 时 (p=3) 使第二个分数的分母为零。 

逆表避免了对每个 (p-1) 比率进行两次模幂运算。 一次`inv[d1]`和`inv[d2]`已知，分母的平方通过乘以倒数两次而反转。 比率循环还首先检查未平方的线性分母，这与检查原始平方分母是否为零完全相同。 

卷积数组使用指数索引`0`通过`p-2`。 第一个数组表示 (S) 的非零元素，而第二个数组表示可接受的比率。 由于群阶为 (p-1)，因此指数会环绕。 普通卷积包含以下总和`0`通过`2(p-2)`，所以第二部分被折回`p-1`。 

NTT 模数 (998244353) 足够大，以至于精确的整数卷积系数无法以 NTT 模数为模进行换行。 系数计算残基对的集合，因此最多为 (p\le10^6)。 

Python 实现使用与公认的 C++ 方法相同的算法，但最初的 4 秒竞赛限制是围绕高度优化的编译 NTT 代码设计的。 大小 (2^{21}) 的纯 Python NTT 具有大量解释器开销，因此对于原始 Codeforces 时间限制，C++ 是实用的实现语言。 Python 版本中的数学和整数运算是精确的。 

## 工作示例

 ### 示例 1

 输入是```
7
4
0 4 5 6
2
2 3
```非零元素是 (4,5,6)。 零情况贡献两个对，因为 (16\equiv2\pmod7)，因此每个非零元素创建一个有效对 ((0,b))。 值 (13/9\equiv3\pmod7) 也属于 (V)，在相反方向上给出相同数量的有效对。 

对于非零部分，可接受的比率集包含有理值为 (2) 或 (3) 的比率。 将相关残数转换为原根指数后，卷积对有效的非零有序对进行计数。 

一个紧凑的轨迹是：

 | 舞台| 状态| 贡献|
 | ---| ---| ---|
 | 输入 | (S={0,4,5,6}), (V={2,3}) | 0 |
 | 零病例 | (F(0,b)=2), (F(a,0)=3) | 6 |
 | 非零比率 | 检查 (t=1,\ldots,6)，排除分母零比率 | 2 |
 | 决赛| 所有有效的有序对 | 8 |

 最终输出是```
8
```该跟踪说明了为什么不能简单地删除零值。 它们占了此示例中的大部分答案。 

### 示例 2

 输入是```
19
10
0 3 4 5 8 9 13 14 15 18
10
2 3 5 9 10 11 12 13 14 15
```(S) 中有九个非零元素。 该算法首先处理涉及零的两个可能的方向。 然后，它计算每个非零比率模 (19) 的有理表达式，跳跃比率 (t) 满足 (3t+1=0) 或 (3t+2=0)。 

将所得比率集转换为原根的指数。 然后，卷积计算有多少有序指数对因每个接受的比率而不同。 

| 舞台| 关键状态| 运行答案|
 | ---| ---| ---|
 | 输入 | (|S|=10，|V|=10)| 0 |
 | 零病例 | (9) 每个方向的非零候选项 | 部分 |
 | 比率扫描| (18) 非零比率，跳过无效分母比率 | 部分 |
 | NTT | 指数模 (18) 的卷积 | 部分 |
 | 最终金额| 对每个非零 (a\in S) 添加 (c[\log_g a]) | 42 | 42

 最终输出是```
42
```这个例子的重要部分是卷积计算有序对。 不存在除以二的情况，因为 ((a,b)) 和 ((b,a)) 对应于相反的指数差并且是不同的有序对。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(p\log p)) | 原根预处理、比率评估和 NTT 卷积都在这个范围内 |
 | 空间| (O(p)) | 隶属数组、对数、逆表和 NTT 缓冲区在 (p) | 中是线性的

 最大的实例有 (p=10^6)。 比率扫描是线性的，而卷积最多使用大小为 (2^{21}) 的 NTT，从而给出预期的 (O(p\log p)) 复杂度。 这是原始 4 秒和 256 MiB 限制的正确渐近比例。 最初接受的方法同样使用具有线性大小残基集的 NTT 并报告相同的 (O(p\log p)) 想法。 

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
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Sample 1
assert run(
    """7
4
0 4 5 6
2
2 3
"""
) == "8\n", "sample 1"

# Sample 2
assert run(
    """19
10
0 3 4 5 8 9 13 14 15 18
10
2 3 5 9 10 11 12 13 14 15
"""
) == "42\n", "sample 2"

# Minimum-size input.
# Only (0, 0) exists, and its denominators are zero.
assert run(
    """2
1
0
1
0
"""
) == "0\n", "minimum size and invalid zero pair"

# All-equal nonzero values.
# For p = 7 and a = b = 1, the expression is 0.
assert run(
    """7
1
1
1
0
"""
) == "1\n", "all-equal nonzero values"

# Boundary denominator cases.
# For p = 7, ratios 2 and 4 make one denominator zero.
# S = {1, 2}, V = {0}; only (1,1) and (2,2) are valid.
assert run(
    """7
2
1 2
1
0
"""
) == "2\n", "denominator-zero ratios"

# Maximum-size style case.
# S and V contain every residue modulo 101.
# Every pair with valid denominators is accepted.
# The two invalid denominator lines contain 101 pairs each,
# and intersect only at (0,0), so 101^2 - (2*101 - 1) = 10000.
p = 101
all_values = " ".join(map(str, range(p)))
assert run(
    f"""{p}
{p}
{all_values}
{p}
{all_values}
"""
) == "10000\n", "full sets and large input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`p=2, S={0}, V={0}`|`0`| 最小尺寸输入和 ((0,0)) 分母失败 |
 |`p=7, S={1}, V={0}`|`1`| 全部相等的非零值和比率 (a/b=1) |
 |`p=7, S={1,2}, V={0}`|`2`| 分母零比率 (2) 和 (4) |
 |`p=101, S=V=\{0,\ldots,100\}`|`10000`| 大套装尺寸和完整的残留物覆盖 |

 ## 边缘情况

 对于 ((0,0)) 情况，取```
2
1
0
1
0
```该算法认为零属于 (S)，但不存在非零元素，因此零情况贡献为零。 它立即完成，而没有构建有意义的比率卷积。 这是正确的，因为两个原始分母都为零。 

对于 ((0,b)) 与 (b\ne0) 的对，第一个分数变为

 [
 \frac{9b^2}{b^2}=9,
 ]

 第二个变成

 [
 \frac{28b^2}{(2b)^2}=7,
 ]

 所以总数是 (16)。 对于 (p=7)，这是 (2)。 该算法在 (2\in V) 时为每个非零 (b\in S) 添加一对这样的对。 

对于 ((a,0)) 和 (a\ne0) 的对 ((a,0))，第一个分数是 (1)，而第二个分数是 (4/9)，给出 (13/9)。 该算法在使用该值之前会检查 (9\ne0\pmod p)。 此检查在 (p=3) 时很重要，此时分母为零。 

对于分母为零的比率，假设 (p=7) 和 (t=a/b=2)。 然后

 [
 3t+1=7\equiv0\pmod7。 
]

 该算法在计算倒数之前拒绝该比率。 同样，(t=4) 给出 (3t+2=14\equiv0\pmod7)。 这与原始除法规则完全匹配，而不是将具有未定义分母的有理表达式视为某个模值。 

对于 (p=101) 的所有留数情况，(S=V=\mathbb F_{101})。 每对分母非零的值在 (V) 中都有一定的值，因此仅排除分母失败的情况。 每个方程(3a+b=0)和(3a+2b=0)描述了(101)对，并且它们仅在((0,0))处相交。 因此有 (2\cdot101-1=201) 个无效对，留下

 [
 101^2-201=10000。 
]

 卷积处理所有非零对，而显式零处理处理剩余的有效对，而不将离散对数分配为零。
