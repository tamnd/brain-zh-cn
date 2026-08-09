---
title: "CF 102471C - 狄利克雷 $k$ 根"
description: "我们使用由正整数索引的数组，但数组的乘法不是普通的元素乘法。 对于两个函数 (f) 和 (g)，它们在 (n) 处的狄利克雷卷积为 [ (fg)(n)=sum{dmid n}f(d)g(n/d)。"
date: "2026-08-09T15:42:35+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102471
codeforces_index: "C"
codeforces_contest_name: "2019 ICPC Asia-East Continent Final"
rating: 0
weight: 102471
solve_time_s: 220
verified: true
draft: false
---

[CF 102471C - 狄利克雷$k$-th root](https://codeforces.com/problemset/problem/102471/C)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 40s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们使用由正整数索引的数组，但数组的乘法不是普通的元素乘法。 对于两个函数 (f) 和 (g)，它们在 (n) 处的狄利克雷卷积为

 [
 (f*g)(n)=\sum_{d\mid n}f(d)g(n/d)。 
]

 输入给出函数 (g) 的前 (n) 个值以及指数 (k)。 我们需要恢复一个函数 (f) 满足

 [
 f^k=\underbrace{f_f_\cdots*f}_{k\text{次}}=g,
 ]

 (f(1)=g(1)=1)，并且每个计算都以模 (998244353) 进行。 官方说法有（n\le 10^5）和一秒的时间限制。 

输出是此类 (f) 的前 (n) 个值。 在给定的约束下，解实际上总是存在并且是唯一的。 打印 (-1) 的明显可能性来自于问题的一般措辞，但这里 (k) 严格小于素数模数，并且下面的递推对于每个 (n>1) 都有一个非零分母。 

界限 (n\le10^5) 排除 (n) 中的任何二次方。 即使 (O(n^2)) 也需要大约 (10^{10}) 次迭代。 我们需要利用这样一个事实：狄利克雷卷积仅对乘积为目标的索引进行配对，因此可以在大约 (n\log n) 时间内枚举所有相关对。 

有几种边缘情况很容易被错误处理。 首先，(k=1) 是完全有效的。 例如，```
2 1
1 7
```有正确的输出```
1 7
```因为 (f^1=f=g)。 假设 (k\ge2) 的实现在这里会不必要地失败。 

其次，必须包括复合因式分解。 考虑```
4 2
1 2 2 1
```正确的输出是```
1 1 1 0
```因为

 [
 (f*f)(4)=f(1)f(4)+f(2)f(2)+f(4)f(1)=0+1+0=1。 
]

 仅考虑两个因素 (1) 和 (4) 的方法将错过 (2\cdot2) 的贡献。 

第三，递归中使用的数量必须计算具有重数的质因数。 例如，

 [
 \欧米伽(4)=2,
 ]

 不是（1）。 使用不同质因数的数量会使 (n=4) 的分母不正确并破坏递推式。 

最后，(k) 可以非常接近模数。 例如，```
2 998244352
1 1
```有答案```
1 998244352
```因为 (k=-1\pmod {998244353})，所以 (f(2)=1/k=-1\pmod {998244353})。 我们必须将所有除法作为模逆而不是普通的整数除法来执行。 

## 方法

 一种直接的方法是构造（f），将其与自身重复卷积，并将结果与（g）进行比较。 一个狄利克雷卷积可以通过枚举所有对 (ab=n) 来计算。 在每个 (n\le N) 中，此类对的总数为

 [
 \sum_{a=1}^{N}\left\lfloor\frac Na\right\rfloor
 =O(N\log N)。 
]

 因此，一次卷积的成本为 (O(n\log n))，但执行 (k-1) 次的成本为 (O(kn\log n))。 在最坏的情况下，(k) 几乎为 (10^9)，因此对于 (n=10^5)，这大约是 (10^{15}) 算术运算。 该方法是正确的，但指数使其无法使用。 

有用的观察是，采用普通导数将幂转化为 (k) 的乘积：

 [
 (F^k)'=kF^{k-1}F'。 
]

 狄利克雷级数为狄利克雷卷积提供了类似的代数表示。 困难在于微分 (n^{-s}) 引入了 (-\ln n)，这对于模 (998244353) 来说并不直接有用。 

我们实际上并不需要对数的数值属性。 我们只需要身份

 [
 \ln(ab)=\ln a+\ln b。 
]

 所以我们可以用任何完全加性函数替换 (\ln n)。 自然的选择是

 [
 \欧米茄（n），
 ]

 (n) 的质因数的数量，以重数计算。 它满足

 [
 \Omega(ab)=\Omega(a)+\Omega(b)。 
]

 定义函数上的运算符 (T)：

 [
 (Tf)(n)=\Ω(n)f(n)。 
]

 (\Omega) 的加性给出了狄利克雷卷积的莱布尼兹规则：

 [
 T(f_g)=Tf_g+f*Tg。 
]

 因此，对于 (G=F^k)，

 [
 T(G)_F=kG_T(F)。 
]

 查看属于 (n) 的系数，给出仅包含一次 (f(n)) 的方程。 所有其他术语都使用 (f(d)) 表示 (d<n)。 这将原来的根本问题变成了简单的重现。 

剩下的实现细节是有效地评估所有真除数的贡献。 当 (f(d)) 已知时，它对每个 (n=d\cdot a) 和 (a\ge2) 都有贡献。 我们可以立即将该贡献分配给累加器。 这样的对 ((d,a)) 的数量是 (O(n\log n))。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(kn\log n)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳| (O(n\log n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 计算每个 (1\le i\le n) 的 (\Omega(i))。 我们可以用线性筛来做到这一点，因为 (\Omega(p)=1) 和 (\Omega(ip)=\Omega(i)+1)。 
2. 定义转换

 [
 (Tf)(n)=\Ω(n)f(n)。 
]

 因为 (\Omega(ab)=\Omega(a)+\Omega(b))，这个变换服从

 [
 T(f_g)=Tf_g+f*Tg。 
]

 这正是普通导数在通常幂律中所贡献的代数性质。 

1. 由于 (g=f^k)，将 (T) 应用于两边并使用幂法则给出

 [
 T(g)_f=k,g_T(f)。 
]

 写出 (n) 处的系数，

 k\sum_{d\mid n}g(d)f(n/d)\Omega(n/d)。 
]

 1. 分离出包含(f(n)) 的项。 在右侧，它发生在 (d=1) 时，因为 (g(1)=f(1)=1)。 由于 (\Omega(1)=0)，左边没有对应的 (f(n)) 项。 重新排列给出

 \sum_{\substack{d\mid n\d<n}}
 f(d)g(n/d)
 \left(\Omega(n/d)-k\Omega(d)\right)。 
]

 因此

 [
 \盒装{
 f(n)=
 \压裂{
 \显示样式
 \sum_{\substack{d\mid n\d<n}}
 f(d)g(n/d)
 \left(\Omega(n/d)-k\Omega(d)\right)
 }{
 k\欧米伽(n)
 }
 }。 
]

 对于每个 (n>1)，(\Omega(n)\ge1)。 也 (1\le k<998244353)，所以 (k\not\equiv0\pmod{998244353})。 因此，分母是可逆的。 

1.设置(f(1)=1)。 维护蓄能器`acc[m]`包含 (f(m)) 的递推式分子。 

计算 (f(d)) 后，考虑每个 (a\ge2) 和 (d a\le n)。 这对

 [
 (d,a)
 ]

 对 (m=da) 的贡献为

 [
 f(d)g(a)
 \left(\Omega(a)-k\Omega(d)\right)。 
]

 所以我们将这个值精确地添加到`acc[d*a]`。 

1. 按升序处理 (d=1,2,\ldots,n)。 对于 (d=1)，(f(1)=1) 是已知的，其更新在每个累加器中创建项 (g(n)\Omega(n))。 对于 (d>1)，(d) 的所有真因数均已处理完毕，因此`acc[d]`已完成，我们可以计算

 [
 f(d)=
 \text{acc}[d],(k\Omega(d))^{-1}\pmod p。 
]

 然后立即将新已知的 (f(d)) 分配给它的所有倍数。 

1. 计算 (k) 的模逆和 (\Omega(n)) 的小可能值。 由于 (n\le10^5), (\Omega(n)\le16)，所以只需要一个很小的逆表。 

### 为什么它有效

 中心不变量是在计算 (f(n)) 之前，`acc[n]`恰好包含

 [
 \sum_{\substack{d\mid n\d<n}}
 f(d)g(n/d)
 \left(\Omega(n/d)-k\Omega(d)\right)。 
]

 每一项都在处理其较小因子 (d) 时添加，并且不添加涉及 (f(n)) 的项，因为我们只乘以 (a\ge2)。 

变换 (T(f)(n)=\Omega(n)f(n)) 满足莱布尼兹规则，因为 (\Omega) 是完全相加的。 因此，每个有效根都满足递推关系。 相反，我们的递归构造了满足该递归的值。 假设(H=f^k)。 (H) 和给定的 (g) 都满足相同的变换卷积方程。 它们的差值在 (1) 处为零，并且在每次 (n>1) 时，其系数乘以非零值 (k\Omega(n))，而所有其他项都涉及较小的索引。 对于每个 (n\le N)，(n) 上的感应力 (H(n)=g(n))。 因此构造的 (f) 是正确的 (k) 个狄利克雷根。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def solve():
    n, k = map(int, input().split())
    g = [0] + list(map(int, input().split()))

    # Linear sieve for Omega(n), the number of prime factors
    # counted with multiplicity.
    lp = [0] * (n + 1)
    omega = [0] * (n + 1)
    primes = []

    for i in range(2, n + 1):
        if lp[i] == 0:
            lp[i] = i
            primes.append(i)
            omega[i] = 1

        for p in primes:
            x = i * p
            if x > n or p > lp[i]:
                break
            lp[x] = p
            omega[x] = omega[i] + 1

    # Modular inverse of k.
    inv_k = pow(k, MOD - 2, MOD)

    # Omega(n) <= 16 for n <= 1e5, but 20 is a convenient safe bound.
    inv_omega = [0] * 21
    for x in range(1, 21):
        inv_omega[x] = pow(x, MOD - 2, MOD)

    f = [0] * (n + 1)
    acc = [0] * (n + 1)

    f[1] = 1

    for d in range(1, n + 1):
        if d > 1:
            f[d] = (acc[d] % MOD) * inv_k % MOD
            f[d] = f[d] * inv_omega[omega[d]] % MOD

        fd = f[d]
        od = omega[d]

        # Every a >= 2 gives m = d * a > d.
        # This contribution is part of the recurrence for f[m].
        for a in range(2, n // d + 1):
            m = d * a
            acc[m] += fd * g[a] * (omega[a] - k * od)

    print(*f[1:])

if __name__ == "__main__":
    solve()
```输入在索引零处存储有一个虚拟零，因此数学索引 (i) 和 Python 索引 (i) 重合。 这样就避免了重复`i - 1`转换。 

线性筛计算`omega[i]`使用最小素因数表示。 当 (i) 乘以一个素数 (p) 时，会引入一个额外的素因数，因此`omega[i * p] = omega[i] + 1`。 

累加器故意不减少模数`MOD`在最内层循环内。 每个`acc[m]`(m) 的每个真因数仅接收一项，因此它仅包含 (O(\tau(m))) 项。 Python 的任意精度整数可以轻松处理 (n\le10^5) 的这些值，同时避免对每个除数对进行昂贵的模运算。 

在迭代开始时`d`，每个真因数`d`已经将其贡献传播到`acc[d]`。 这就是为什么顺序递增的原因`d`是必不可少的。 计算后`f[d]`，我们立即将其传播到更大的索引，这保留了后续迭代所需的不变量。 

表达式```
omega[a] - k * od
```故意允许为负数。 最终的模数缩减为`acc[d]`正确处理负累加值。 

Python 中不存在整数溢出问题。 在具有固定宽度整数的语言中，在取模之前，应将乘积存储为足够宽的整数类型。 

该代码也没有显式测试`-1`。 在这些约束下，分母 (k\Omega(n)) 始终以素数模为模为非零，因此递归始终会产生有效的根。 

## 工作示例

 ### 示例 1

 输入是```
5 2
1 8 4 26 6
```我们有

 [
 \Omega(2)=1,\quad
 \Omega(3)=1,\quad
 \Omega(4)=2,\quad
 \欧米伽(5)=1。 
]

 累加器开始处理(d=1)。 由于 (f(1)=1)，它对每个 (a) 贡献 (g(a)\Omega(a))。 

| (d) | (f(d)) | (f(d)) | 更新索引 | 贡献|`acc`更新后 |
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 2 | (8\cdot1=8) |`acc[2]=8`|
 | 1 | 1 | 3 | (4\cdot1=4) |`acc[3]=4`|
 | 1 | 1 | 4 | (26\cdot2=52) |`acc[4]=52`|
 | 1 | 1 | 5 | (6\cdot1=6) |`acc[5]=6`|
 | 2 | 4 | 4 | (4\cdot8(1-2)=-32) |`acc[4]=20`|

 现在这些值是从

 [
 f(n)=\frac{\text{acc}[n]}{2\Omega(n)}。 
]

 | (n) | (\欧米茄(n)) |`acc[n]`| 分母| (f(n)) | (f(n)) |
 | ---| ---| ---| ---| ---|
 | 1 | 0 | | | 1 |
 | 2 | 1 | 8 | 2 | 4 |
 | 3 | 1 | 4 | 2 | 2 |
 | 4 | 2 | 20 | 4 | 5 |
 | 5 | 1 | 6 | 2 | 3 |

 得到的根是```
1 4 2 5 3
```有趣的部分是（n=4）。 直接 (1\cdot4) 贡献给出 (52)，但因式分解 (2\cdot2) 对递推贡献 (-32)，留下 (20)。 这正是恢复所需的 (f(4)=5)。 

### 构造示例

 采取```
5 2
1 4 6 14 14
```预期的根是```
1 2 3 5 7
```因为

 [
 (f*f)(2)=2f(2)=4,
 ]

 [
 (f*f)(3)=2f(3)=6,
 ]

 [
 (f*f)(4)=2f(4)+f(2)^2=10+4=14,
 ]

 和

 [
 (f*f)(5)=2f(5)=14。 
]

 重现过程如下。 

| (d) | (f(d)) | (f(d)) | 新的`acc`贡献 | 相关的`acc`|
 | ---| ---| ---| ---|
 | 1 | 1 | (g(a)\欧米茄(a)) |`acc[2]=4`,`acc[3]=6`,`acc[4]=28`,`acc[5]=14`|
 | 2 | 2 | (2\cdot4(1-2)=-8) 到索引 4 |`acc[4]=20`|
 | 3 | 3 | (3a\le5) 与 (a\ge2) 没有倍数 | 不变|
 | 4 | 5 | 范围内没有倍数 | 不变|
 | 5 | 7 | 范围内没有倍数 | 不变|

 最终的划分是

 [
 f(2)=4/2=2,
 ]

 [
 f(3)=6/2=3,
 ]

 [
 f(4)=20/4=5,
 ]

 [
 f(5)=14/2=7。 
]

 该迹线证明了以下不变量：`acc[n]`精确包含计算 (f(n)) 之前递推式的真除数部分。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n\log n)) | 每对 ((d,a)) 与 (da\le n) 和 (a\ge2) 都会被处理一次，得到 (\sum_{d=1}^n O(n/d)=O(n\log n))。 线性筛为(O(n))。 |
 | 空间| (O(n)) | (O(n)) | 数组`g`,`f`,`acc`,`omega`，并且筛数组都有长度 (O(n))。 |

 对于 (n=10^5)，除数对更新次数仅为 (n\log n) 量级，大约一百万次，而不是二次算法的 (10^{10}) 次运算。 内存消耗是线性的并且完全低于 256 MB。 最初的比赛限制为一秒和 256 MB。 

## 测试用例

 以下测试工具使用与提交的解决方案相同的算法。 最大尺寸情况特意使用 (k=1)，使预期答案易于验证，而无需嵌入 100,000 个元素的文字。```python
import sys
import io

MOD = 998244353

def solve_instance(inp: str) -> str:
    data = list(map(int, inp.split()))
    it = iter(data)

    n = next(it)
    k = next(it)
    g = [0] + [next(it) for _ in range(n)]

    lp = [0] * (n + 1)
    omega = [0] * (n + 1)
    primes = []

    for i in range(2, n + 1):
        if lp[i] == 0:
            lp[i] = i
            primes.append(i)
            omega[i] = 1

        for p in primes:
            x = i * p
            if x > n or p > lp[i]:
                break
            lp[x] = p
            omega[x] = omega[i] + 1

    inv_k = pow(k, MOD - 2, MOD)

    inv_omega = [0] * 21
    for x in range(1, 21):
        inv_omega[x] = pow(x, MOD - 2, MOD)

    f = [0] * (n + 1)
    acc = [0] * (n + 1)
    f[1] = 1

    for d in range(1, n + 1):
        if d > 1:
            f[d] = acc[d] % MOD
            f[d] = f[d] * inv_k % MOD
            f[d] = f[d] * inv_omega[omega[d]] % MOD

        fd = f[d]
        od = omega[d]

        for a in range(2, n // d + 1):
            m = d * a
            acc[m] += fd * g[a] * (omega[a] - k * od)

    return " ".join(map(str, f[1:]))

def run(inp: str) -> str:
    return solve_instance(inp)

# Provided sample
assert run(
    "5 2\n"
    "1 8 4 26 6\n"
) == "1 4 2 5 3", "sample 1"

# k = 1, so f must equal g.
assert run(
    "2 1\n"
    "1 7\n"
) == "1 7", "minimum size and k=1"

# Composite contribution 2 * 2 is required.
assert run(
    "4 2\n"
    "1 2 2 1\n"
) == "1 1 1 0", "composite factorization"

# k = MOD - 1, so 1 / k = -1 modulo MOD.
assert run(
    "2 998244352\n"
    "1 1\n"
) == "1 998244352", "large k boundary"

# All values of the root are 1. For k = 2, g(n) is the divisor count.
assert run(
    "5 2\n"
    "1 2 2 3 2\n"
) == "1 1 1 1 1", "all-equal root"

# Maximum n, with k = 1 and all values equal to 1.
n = 100000
inp = f"{n} 1\n" + " ".join(["1"] * n) + "\n"
expected = " ".join(["1"] * n)
assert run(inp) == expected, "maximum n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`5 2 / 1 8 4 26 6`|`1 4 2 5 3`| 提供样本和复合除数贡献 |
 |`2 1 / 1 7`|`1 7`| 最小尺寸和 (k=1) |
 |`4 2 / 1 2 2 1`|`1 1 1 0`| (2\cdot2) 分解和 (\Omega(4)=2) |
 |`2 998244352 / 1 1`|`1 998244352`| (k) 以其最大允许值 |
 |`5 2 / 1 2 2 3 2`|`1 1 1 1 1`| 等根值和除数重数 |
 | (n=100000,\k=1)，全部 | 100001 个 | 最大输入尺寸和边界性能|

 ## 边缘情况

 对于（k=1），递归仍然有效，无需修改。 和```
2 1
1 7
```我们有 (\Omega(2)=1)，(2) 的累加器是 (7)。 分母为 (1\cdot1)，因此 (f(2)=7)。 因此输出是`1 7`，完全按照要求。 

对于具有重复质因数的合数，(\Omega) 必须计算重数。 在```
4 2
1 2 2 1
```根是`1 1 1 0`。 在 (n=4) 时，真除数 (d=2) 贡献

 [
 f(2)g(2)(\欧米茄(2)-2\欧米茄(2))
 =1\cdot2(1-2)=-2。 
]

 初始 (d=1) 贡献为 (g(4)\Omega(4)=1\cdot2=2)，因此`acc[4]=0`因此 (f(4)=0)。 使用不同质因数的数量会错误地使用 (\Omega(4)=1) 并产生错误的分母。 

对于允许的最大指数，```
2 998244352
1 1
```我们有 (k\equiv-1\pmod{998244353})。 递归给出

 [
 f(2)=1/(-1)=-1\pmod{998244353},
 ]

 所以输出是`1 998244352`。 这说明了为什么即使输入指数表示为普通正整数也需要模求逆。 

对于（n=1），不会有递归，因为（\Omega(1)=0），这将使分母毫无意义。 问题从 (n=2) 开始，我们在处理任何其他索引之前显式设置 (f(1)=1)。 这也提供了以后每个狄利克雷卷积所需的单位元素。 

(g) 中零值的可能性不会导致特殊情况。 例如，根在```
4 2
1 2 2 1
```有 (f(4)=0)，并且递归处理它与其他值完全相同。 该算法永远不会除以 (g(n))，因此 (g) 的零项是无害的。 

表观 (-1) 输出情况也不需要对给定约束进行特殊处理。 由于 (k) 是非零模素数 (998244353)，并且 (\Omega(n)) 是严格小于 (n\le10^5) 素数的正整数，因此每个分母 (k\Omega(n)) 都是可逆的。 因此，递归确定了每个有效输入的根。
