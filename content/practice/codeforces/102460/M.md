---
title: "CF 102460M - DivModulo"
description: "我们需要计算二项式系数的特殊余数。 给定 (M)、(N) 和 (D)，且 (0 le N le M)，考虑 [ C(M,N)=frac{M!}{N!(M-N)!}。 ] DivModulo 运算并不简单地对该数字取模 (D)。"
date: "2026-08-08T10:26:58+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102460
codeforces_index: "M"
codeforces_contest_name: "2019-2020 ICPC Asia Taipei-Hsinchu Regional Contest"
rating: 0
weight: 102460
solve_time_s: 524
verified: true
draft: false
---

[CF 102460M - DivModulo](https://codeforces.com/problemset/problem/102460/M)

 **评级：** -
 **标签：** -
 **求解时间：** 8m 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要计算二项式系数的特殊余数。 给定 (M)、(N) 和 (D)，其中 (0 \le N \le M)，考虑

 [
 C(M,N)=\frac{M!}{N!(M-N)!}。 
]

 DivModulo 运算并不简单地对该数字取模 (D)。 相反，我们尽可能重复删除 (D) 的完整因子。 如果

 [
 C(M,N)=X D^h
 ]

 其中 (D\nmid X)，所需答案为 (X\bmod D)。 

只要二项式系数能被 (D) 整除，这种区别就很重要。 例如，(C(5,2)=10=2\cdot5)，所以普通模给出(0)，而DivModulo给出(2)。 

输入大小使得直接阶乘计算变得不可能。 (M) 可以达到 (4\cdot10^{18})，因此即使是 (O(M)) 算法也需要大约 (4\cdot10^{18}) 次迭代。 精确的阶乘也太大而无法构造。 有用的大小是 (D)，最多为 (1.6\cdot10^7)。 这强烈表明一种算法，其昂贵的预处理取决于（D），而巨大的值（M）和（N）是通过对数递归来处理的。 

有几种边缘情况暴露了不正确的方法。 

用于输入`5 2 5`，二项式系数为(10)。 普通模运算给出(10\bmod5=0)，但必须先去掉(5)的一个因数，所以正确答案是(2)。 

用于输入`6 2 6`，二项式系数为(15)。 (6) 和 (6^2) 都不能整除 (15)，所以答案是 (15\bmod6=3)。 即使 DivModulo 运算仅删除 (6) 的完整因子，如果不小心单独删除 (D) 的素数因子，也会删除因子 (2) 或 (3)。 

用于输入`1 0 2`，二项式系数为 (1)，因为 (0!=1)。 (2) 中没有因子可以去除，所以答案是 (1)。 假设 (N>0) 或错误地处理空阶乘的实现可能会在此失败。 

用于输入`6 3 6`，二项式系数为(20)。 从 (6\nmid20) 开始，没有删除任何内容，答案是 (20\bmod6=2)。 这是一个有用的边界情况，因为 (20) 的主要估值不同：有两个 (2) 因子，但没有 (3) 因子。 

## 方法

 蛮力方法很简单。 我们可以计算阶乘，形成二项式系数，重复除以 (D)，最后取余数。 不太极端的版本可以乘法生成二项式系数，但在最坏的情况下仍然需要 (\Theta(M)) 算术步骤。 在 (M=4\cdot10^{18}) 处，这意味着在考虑操作巨大整数的成本之前大约需要四次五千万次迭代。 帕斯卡三角形更不实用。 暴力方法是正确的，因为它直接遵循定义，但输入范围使其无法使用。 

关键的观察是，删除 (D) 的完整因素是一个估值问题。 因子 (D) 为

 [
 D=\prod_{i=1}^s p_i^{a_i},
 ]

 其中 (p_i) 是不同的素数。 

让

 [
 e_i=v_{p_i}(C(M,N))。 
]

 (D) 的完整副本对于每个 (i) 消耗 (a_i) 个 (p_i) 副本。 因此，二项式系数中包含的 (D) 的完整副本数为

 [
 K=\min_i\left\lfloor\frac{e_i}{a_i}\right\rfloor。 
]

 因此所需的整数是

 [
 R=\frac{C(M,N)}{D^K}。 
]

 我们无法计算 (C(M,N)) 本身，但我们只需要 (R) 模 (D)。 由于素数幂 (p_i^{a_i}) 是成对互质的，因此我们可以分别计算 (R) 对每个素数幂取模，并将结果与​​中国剩余定理结合起来。 

固定一个主电源

 [
 q=p^a。 
]

 假设二项式系数具有 (p)-adic 估值 (e=v_p(C(M,N)))。 去除(D^K)后，其剩余的(p)-adic指数为

 [
 k=e-aK。 
]

 将二项式系数写为

 [
 C(M,N)=p^e U,
 ]

 其中 (U) 不能被 (p) 整除。 然后

 p^k U\left(\frac{D}{q}\right)^{-K}。 
]

 以 (q) 为模，分母可逆，因为 (D/q) 不包含因子 (p)。 因此，剩下的任务是计算二项式系数模 (q) 的无 (p) 部分 (U)。 

对于阶乘，定义

 [
 F_p(n)=\frac{n!}{p^{v_p(n!)}}。 
]

 该值始终与 (p) 互质，因此它具有反模 (q)。 二项式的 (p) 自由部分是

 [
 U\当量
 F_p(M)F_p(N)^{-1}F_p(M-N)^{-1}\pmod q。 
]

 关键的递归来自于分离 (n!) 内 (p) 的倍数。 (p) 的每个倍数都可以去掉一个因数 (p)，从而在除以 (p) 后留下相应数字中不含 (p) 的部分。 因此，

 F_p\left(\left\lfloor\frac np\right\rfloor\right)
 \prod_{\substack{1\le i\le n\p\nmid i}}i
 \pmod q。 
]

 剩余的乘积在长度块中是周期性的 (q=p^a)。 如果

 [
 G(x)=\prod_{\substack{1\le i\le x\p\nmid i}}i\pmod q,
 ]

 然后

 G(q-1)^{\lfloor n/q\rfloor}G(n\bmod q)
 \pmod q。 
]

 我们可以在 (O(q)) 时间内为每个 (0\le x<q) 预先计算 (G(x))。 随后的每个阶乘计算都会重复将 (n) 替换为 (\lfloor n/p\rfloor)，因此只需要 (O(\log_p M)) 级。 

蛮力方法之所以有效，是因为它按字面意思计算阶乘定义，但会失败，因为 (M) 非常大。 只有 (p)-adic 估值和 (p)-free 部分才重要的观察结果让我们可以用 (O(D)) 预处理和 (M) 和 (N) 的对数多次约简来代替天文阶乘计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(M)) 或更糟 | (O(M)) 或更糟 | 太慢了 |
 | 最佳 | (O(D+\omega(D)\log^2 M)) | (O(\max p_i^{a_i})) | 已接受 |

 这里 (\omega(D)) 是 (D) 的不同质因数的数量。 (D) 项来自素数幂前缀表。 对数项说明了重复除以 (p) 和模幂。 

## 算法演练

1. 将 (D) 分解为不同的素数幂 (q_i=p_i^{a_i})。 试除法就足够了，因为 (D\le1.6\cdot10^7)，因此仅检查除数到 (\sqrt D) 最多需要大约 (4000) 个试验值。 
2. 对于每个素数 (p_i)，计算

 [
 e_i=v_{p_i}(M!)-v_{p_i}(N!)-v_{p_i}((M-N)!)。 
]

 阶乘的估值由勒让德公式给出，

 [
 v_p(n!)=\left\lfloor\frac np\right\rfloor+
 \left\lfloor\frac n{p^2}\right\rfloor+
 \left\lfloor\frac n{p^3}\right\rfloor+\cdots。 
]

 只有 (O(\log_p M)) 项非零。 

1. 计算

 [
 K=\min_i\left\lfloor\frac{e_i}{a_i}\right\rfloor。 
]

 这正是可以从二项式系数中删除的 (D) 的完整副本的数量。 最小值是必要的，因为 (D) 的一个副本同时消耗每个素数 (p_i) 的 (a_i) 个副本。 

1. 独立处理每个素数幂 (q=p^a)。 构建前缀数组

 [
 G(x)=\prod_{\substack{1\le i\le x\p\nmid i}}i\bmod q。 
]

 只有不能被 (p) 整除的数字才会被乘以前缀。 该表中的每个值都与 (p) 互质，这使得模逆有效。 

1. 实现阶乘单位函数 (F_p(n))。 在每次迭代时，乘以当前块的贡献，

 [
 G(q-1)^{\lfloor n/q\rfloor}G(n\bmod q),
 ]

 然后将 (n) 替换为 (\lfloor n/p\rfloor)。 循环在 (O(\log_p M)) 次迭代后终止。 

1. 使用三个阶乘单位值获得二项式系数的无 (p) 部分，

 [
 U=
 F_p(M)F_p(N)^{-1}F_p(M-N)^{-1}\pmod q。 
]

 所有三个阶乘单位都与 (q) 互质，因此存在倒数。 

1.让

 [
 k=e-aK。 
]

 在删除所有完整的 (D) 因子后，所需的 DivModulo 值仍包含 (p^k)。 因此它的余数模 (q) 为

 [
 r=
 U,p^k
 \left(\frac Dq\right)^{-K}
 \bmod q。 
]

 (D/q) 的倒数以 (q) 为模存在，因为 (q) 包含 (D) 的整个 (p) 次方。 

1. 使用中国剩余定理组合所有同余 (R\equiv r_i\pmod{q_i})。 质数幂是两两互质的，它们的乘积是 (D)，所以只有一个答案模 (D)。 

工作原理：对于每个素数 (p_i)，该算法将二项式系数分离为其精确的 (p_i) 幂和与 (p_i) 互质的部分。 估值计算准确地确定了可以全局删除多少个完整的 (D) 副本。 删除这些副本后，每个素数的剩余指数已知，并且剩余的无 (p) 部分通过阶乘递推计算。 因此，(D) 的每个素数幂分量的余数模是精确的。 然后，中国余数定理重建唯一的整数模 (D)，这正是 DivModulo 结果。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def factorize(n):
    factors = []
    e = 0
    while n % 2 == 0:
        n //= 2
        e += 1
    if e:
        factors.append((2, e))

    p = 3
    while p * p <= n:
        if n % p == 0:
            e = 0
            while n % p == 0:
                n //= p
                e += 1
            factors.append((p, e))
        p += 2

    if n > 1:
        factors.append((n, 1))
    return factors

def vp_factorial(n, p):
    ans = 0
    while n:
        n //= p
        ans += n
    return ans

def build_prefix(p, q):
    # pref[x] = product of all 1 <= i <= x with p not dividing i, modulo q.
    pref = array('I', [0]) * q
    pref[0] = 1

    cur = 1
    for i in range(1, q):
        if i % p:
            cur = (cur * i) % q
        pref[i] = cur

    return pref

def factorial_unit(n, p, q, pref):
    # n! with every factor p removed, modulo q.
    block = pref[q - 1]
    res = 1

    while n:
        res = res * pow(block, n // q, q) % q
        res = res * pref[n % q] % q
        n //= p

    return res

def solve_case(M, N, D):
    factors = factorize(D)

    valuations = []
    K = 10**100

    for p, a in factors:
        e = (
            vp_factorial(M, p)
            - vp_factorial(N, p)
            - vp_factorial(M - N, p)
        )
        valuations.append(e)
        K = min(K, e // a)

    # CRT state: answer == x (mod mod)
    x = 0
    mod = 1

    for (p, a), e in zip(factors, valuations):
        q = p ** a

        pref = build_prefix(p, q)

        fm = factorial_unit(M, p, q, pref)
        fn = factorial_unit(N, p, q, pref)
        fr = factorial_unit(M - N, p, q, pref)

        unit = fm
        unit = unit * pow(fn, -1, q) % q
        unit = unit * pow(fr, -1, q) % q

        remaining_p = e - a * K

        residue = unit * pow(p, remaining_p, q) % q

        other = D // q
        residue = residue * pow(pow(other, K, q), -1, q) % q

        # Combine:
        # x + mod * t == residue (mod q)
        t = (residue - x) % q
        t = t * pow(mod, -1, q) % q

        x += mod * t
        mod *= q
        x %= mod

    return x

def solve():
    M, N, D = map(int, input().split())
    print(solve_case(M, N, D))

if __name__ == "__main__":
    solve()
```因式分解例程使用试除法。 因为 (D) 最多为 (1.6\cdot10^7)，所以平方根低于 (4000)，因此简单的实现就足够了。`vp_factorial`实现勒让德公式。 它从不构造阶乘，仅执行除以相关素数的重复除法。`build_prefix`存储直到每个位置且不能被 (p) 整除的所有整数的乘积。 这`array('I')`代表是经过深思熟虑的。 包含数百万个 Python 整数的 Python 列表将消耗数百兆字节，而无符号整数数组将每个条目存储在四个字节中。 一次仅保留一张主功率表。`factorial_unit`实现算法演练中的递归。 递归是迭代编写的，以避免 Python 递归开销。 在每个级别，长度 (q) 的完整块贡献`pref[q - 1]`，而不完整的块贡献`pref[n % q]`。 然后`n`除以 (p)。 

三个阶乘单位使用模逆进行组合。 与原始阶乘不同，它们保证与 (q) 互质，这正是需要 (p)-adic 分解的原因。 

指数`remaining_p = e - a * K`永远不会是负数。 根据 (K) 的定义，每个主功率分量都有 (K\le e/a)。 

因素`(D // q)^K`模数取反`q`。 这个倒数总是存在，因为 (D/q) 不包含因子 (p)。 在取其倒数之前计算幂可以避免尝试除以非单位模 (D)。 

最后，CRT 更新使用等式

 [
 x+\text{mod}\cdot t\equiv r\pmod q。 
]

自从`mod`和`q`是互质的，`pow(mod, -1, q)`存在。 Python 整数是任意精度的，因此即使 (M) 达到 (4\cdot10^{18}) 也不会溢出。 

## 工作示例

 ### 示例 1

 对于`9 2 3`，我们有

 [
 C(9,2)=36=4\cdot3^2。 
]

 只有一个主功率分量 (q=3)。 

| 步骤| （页）| （一）| (e=v_p(C)) | (K) | 剩余 (p)-功率 | 残留物|
 | ---| ---| ---| ---| ---| ---| ---|
 | 因式分解| 3 | 1 | 2 | 2 | 0 | |
 | 删除后 (3^2) | 3 | 1 | 2 | 2 | (2-2=0) | (2-2=0) | 1 |

 (36) 的无 (3) 部分是 (4) 和 (4\bmod3=1)。 由于 (36=4\cdot3^2)，答案是`1`。 该迹线还显示了为什么普通模数不够：(36\bmod3=0)，而 DivModulo 首先删除 (3) 的两个因子。 

### 示例 2

 对于`5 2 5`，我们有

 [
 C(5,2)=10=2\cdot5。 
]

 这里 (p=5)、(a=1) 和 (e=1)，因此恰好删除了 (5) 的一个完整因子。 

| 步骤| （页）| （一）| (e=v_p(C)) | (K) | 剩余 (p)-功率 | 最终残留物|
 | ---| ---| ---| ---| ---| ---| ---|
 | 因式分解| 5 | 1 | 1 | 1 | 0 | |
 | 删除 (5^1) | 5 | 1 | 1 | 1 | (1-1=0) | (1-1=0) | 2 |

 不含 (5) 的部分为 (2)，因此 DivModulo 结果为`2`。 直接一个`10 % 5`会错误地产生零。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(D+\omega(D)\log^2 M+\sqrt D)) | 前缀表总共最多包含 (D) 个条目，而阶乘单位求值和模幂的对数为 (M)。 |
 | 空间| (O(\max_i p_i^{a_i})) | 一次仅存储一个主功率前缀表。 |

 (D) 的不同素幂分量之和至多为 (D)，因此总前缀预处理为 (O(D))。 对于 (D\le1.6\cdot10^7)，这就是问题的预期规模。 (M) 的巨大值仅出现在对数计算中，因此 (4\cdot10^{18}) 界限不会强制迭代阶乘本身。 

这`array('I')`存储将最大可能的前缀表保留在数十兆字节左右，而不是数百兆字节的 Python 对象开销，这与 (D=1.6\cdot10^7) 边界特别相关。 

## 测试用例```
# This test block assumes the solution above is saved as solution.py
# and exposes solve_case(M, N, D).

from solution import solve_case

# Provided samples
assert solve_case(9, 2, 3) == 1, "sample 1"
assert solve_case(5, 2, 5) == 2, "sample 2"
assert solve_case(6, 3, 6) == 2, "sample 3"
assert solve_case(7654321, 1234567, 1050) == 210, "sample 4"

# Minimum-size input: C(1, 0) = 1
assert solve_case(1, 0, 2) == 1, "minimum input"

# N = M: C(M, M) = 1 even for enormous M
assert solve_case(4_000_000_000_000_000_000,
                 4_000_000_000_000_000_000,
                 16_000_000) == 1, "maximum M and D"

# D does not divide the binomial coefficient, even though
# D has several prime factors.
# C(6, 2) = 15, and 6 does not divide 15.
assert solve_case(6, 2, 6) == 3, "composite D without complete factor"

# Multiple complete D factors must all be removed.
# C(10, 5) = 252 = 7 * 6^2, so the answer is 7 mod 6 = 1.
assert solve_case(10, 5, 6) == 1, "multiple D factors"

# Dividing by D is required before taking the remainder.
# C(5, 2) = 10 = 2 * 5.
assert solve_case(5, 2, 5) == 2, "remove one complete D factor"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 0 2`|`1`| 最小值 (M)、(N=0) 和 (0!=1) |
 |`4000000000000000000 4000000000000000000 16000000`|`1`| 最大值 (M)、最大值 (D) 和 (C(M,M)=1) |
 |`6 2 6`|`3`| 复合 (D)，其中不存在 (D) 的完全因子 |
 |`10 5 6`|`1`| 必须删除 (D) 的一个以上完整因子 |
 |`5 2 5`|`2`| DivModulo 与普通模的不同之处 |

 ## 边缘情况

 对于`5 2 5`，算法找到 (v_5(5!)=1)、(v_5(2!)=0) 和 (v_5(3!)=0)，给出 (e=1)。 由于 (D=5^1)，我们得到 (K=1)。 剩余的指数为 (e-K=0)，因此仅保留不含 (5) 的二项式部分。 该部分是（2），给出正确答案`2`。 

为了`6 2 6`，因式分解给出 (D=2\cdot3)。 二项式为(15)，因此其估值为(v_2(15)=0)和(v_3(15)=1)。 (6) 的完整副本数为

 [
 K=\min(0,1)=0。 
]

 没有任何内容被删除，并且 (15\bmod6=3)。 这说明了为什么主要电力估值的最小值是必要的。 单独删除素因数会改变正在计算的运算。 

为了`6 3 6`，二项式系数为 (20=2^2\cdot5)。 它的(2)-估值是(2)，而它的(3)-估值是(0)。 因此

 [
 K=\min(2,0)=0。 
]

 该算法保持 (20) 不变并重建 (20\bmod6=2)。 

为了`1 0 2`，(0!) 和 (1!) 都具有无 (p) 的部分 (1)，并且每个阶乘估值都为零。 因此（K=0），重建的残差为（1），答案为`1`。 

为了`10 5 6`，二项式系数为 (252=7\cdot6^2)。 主要估值为 (v_2(252)=2) 和 (v_3(252)=2)，因此 (K=2)。 去掉(6^2)后，剩下的值为(7)，其余数模(6)为`1`。 该算法无需构造 (252) 即可达到相同的结果，并且当二项式系数具有数千或五亿位时，相同的机制继续工作。
