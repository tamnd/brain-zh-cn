---
title: "CF 102218J - 只是一个简单的任务"
description: "我们需要确定从 (0) 到 (n-1) 的每一天 (k)，有多少个有序对 ((i,j)) 满足 [ icdot j equalv k pmod n。"
date: "2026-08-17T23:24:10+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102218
codeforces_index: "J"
codeforces_contest_name: "2019, XI Annual Programming Contest by ESCOM-IPN"
rating: 0
weight: 102218
solve_time_s: 179
verified: false
draft: false
---

[CF 102218J - 只是一个简单的任务](https://codeforces.com/problemset/problem/102218/J)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 59s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们需要确定，从 (0) 到 (n-1) 的每一天 (k)，有多少个有序对 ((i,j)) 满足

 [
 i\cdot j \equiv k \pmod n。 
]

 每个这样的对为天 (k) 贡献一个容量单位，因此所需的数组正是所有 (n^2) 个有序对上的乘积 (i j \bmod n) 的频率分布。 官方声明确认，天数的索引范围为 (0) 到 (n-1)，该范围内的每个有序对都有一个贡献。 

直接模拟考虑所有 (n^2) 对。 当 (n) 与 (2.2\times10^6) 一样大时，这意味着最多 (4.84\times10^{12}) 次模乘，这远远超出了两秒实现所能执行的范围。 即使是 (O(n\sqrt n)) 方法在这种规模下也太大了。 该解决方案需要利用模 (n) 乘法的算术结构，而不是枚举对。 

零余数需要特别注意，因为 (i=0) 对每个 (j) 都有贡献，并且只要 (ij) 可被 (n) 整除，每个非零 (i) 也会有贡献。 对于 (n=1)，只有 ((0,0)) 对，所以答案很简单`1`。 假设正模量具有多个留数的解决方案很容易对这种情况进行错误处理。 

第二个常见错误是将合数模乘法视为每个非零乘数都是可逆的。 例如，对于 (n=4)，正确的输出是```
8
2
4
2
```值 (2) 出现四次，因为 (0\cdot2)、(2\cdot1)、(2\cdot3) 和 (2\cdot2) 不是直接对残基进行正确推理。 更系统地说，解的数量取决于 (\gcd(i,n))。 仅基于模逆的粗心方法会错过由非互质乘数引起的额外解。 

对于素数模数（例如 (n=5)），每个非零乘数都是可逆的。 答案是```
9
4
4
4
4
```所有非零余数具有相同的频率，而零具有更大的频率。 即使在这种小情况下，假设所有残基必须具有相同计数的实现也会失败。 

## 方法

 暴力解决方案完全遵循定义。 创建一个包含 (n) 个计数器的数组，迭代每个 (i) 和每个 (j)，计算 ((i j)\bmod n)，并递增相应的计数器。 每对都被处理一次，因此结果是正确的。 问题是对的数量。 最多 (n=2{,}200{,}000) 时，有 (2{,}200{,}000^2=4{,}840{,}000{,}000{,}000) 对，这使得该方法无法使用。 

关键是不要再询问哪些单独的对产生残差，而是询问有多少 (j) 个值对一个特定 (i) 产生固定残差。 考虑一致性

 [
 ij\equiv k\pmod n。 
]

 设 (g=\gcd(i,n))。 线性同余的标准属性表明，该方程在 (g\mid k) 时精确有解，并且当它可解时，它精确地具有 (g) 模 (n) 的解。 

这立即告诉我们一个乘数 (i) 的贡献是什么。 如果 (g=\gcd(i,n))，则 (i) 对可被 (g) 整除的每个答案位置 (k) 贡献 (g)，并对所有其他位置贡献零。 

下一个问题是 (i) 有多少个值与 (n) 具有特定的 gcd。 假设 (g\mid n)。 写作

 [
 i=gx,\qquad n=gm
 ]

 给出

 [
 \gcd(i,n)=g
 ]

 恰好当 (\gcd(x,m)=1) 时。 由于 (x) 的范围超过 (0,\ldots,m-1)，因此存在 (\varphi(m)) 个这样的值。 这里包含 (i=0) 的情况是因为 (\gcd(0,n)=n)，对应于 (m=1) 和 (\varphi(1)=1)。 

因此，对于 (n) 的每个除数 (g)，恰好

 [
 \varphi\left(\frac ng\right)
 ]

 (i) 的值具有 gcd (g)。 这些 (i) 中的每一个都对可被 (g) 整除的每个 (k) 做出贡献。 因此，与除数 (g) 相关的总贡献为

 [
 g\varphi\left(\frac ng\right)
 ]

 到 (g) 的每个倍数。 

所以最终的公式是

 [
 \盒装{
 c_k=
 \sum_{\substack{g\mid n\g\mid k}}
 g\varphi\left(\frac ng\right)
 }
 ]

 或同等地，

 [
 c_k=
 \sum_{g\mid\gcd(k,n)}
 g\varphi\left(\frac ng\right)。 
]

 现在我们只需要枚举(n)的约数即可。 对于每个除数 (g)，将其权重 (g\varphi(n/g)) 添加到位置 (0,g,2g,\ldots)。 数组更新的总数为

 [
 \sum_{g\mid n}\frac nd=\sum_{g\mid n}\frac ng=\sigma(n),
 ]

 符合无害端点约定。 这比 (n^2) 小得多。 对于最大输入 (2{,}200{,}000=2^6\cdot5^5\cdot11)，因此它只有 84 个除数，其除数之和仅为 (5{,}952{,}744)。 

我们可以先对 (n) 进行因式分解，生成它的所有除数，然后直接根据素因式分解计算 (\varphi(n/g))。 不需要达到 (n) 的筛子，这使得实现既简单又节省内存。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n^2)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳 | (O(\sqrt n+\sigma(n))) | (O(n+\tau(n))) | 已接受 |

 ## 算法演练

 1. 将 (n) 分解为素数幂 (n=\prod p^a)。 试除法就足够了，因为 (n\le2.2\times10^6)，所以只需要检查 (O(\sqrt n)) 个候选除数。 
2. 生成 (n) 的每个除数 (g)。 在这一代期间，还计算 (\varphi(n/g))。 如果 (p^b) 是 (n/g) 中素数的剩余幂，则当 (b=0) 时，它对 totient 的贡献为 (1)，否则为 (p^{b-1}(p-1))。 
3. 对于每个除数 (g)，计算其权重

 [
 w=g\varphi(n/g)。 
]

 满足 (\gcd(i,n)=g) 的 (i) 的值在数量上恰好为 (\varphi(n/g))，并且每个这样的 (i) 为每个可被 (g) 整除的留数提供 (g) 个解。

1. 将 (w) 添加到每个可被 (g) 整除的数组位置。 受影响的位置是 (0,g,2g,\ldots,n-g)。 故意包含位置零，因为零可以被每个正除数整除。 
2. 处理完每个除数后，输出结果数组。 每个有序对都根据其第一个坐标的 gcd 进行计算，因此位置 (k) 处的累加值正是其乘积与 (k) 模 (n) 一致的对的数量。 

### 为什么它有效

 修复留数 (k)。 根据 (g=\gcd(i,n)) 划分所有可能的第一坐标 (i)。 对于这样的 (i)，当 (g\mid k) 时，同余 (ij\equiv k\pmod n) 对于 (j) 有 (g) 个解，否则没有解。 与 gcd (g) 正好有 (\varphi(n/g)) 个第一个坐标。 因此，当 (g\mid k) 时，该组中的所有第一个坐标恰好对 (c_k) 贡献 (g\varphi(n/g))。 该算法将该数量精确地添加到 (g) 的每个倍数中，因此每个有效对贡献一次，每个无效对贡献零。 对所有除数求和即可得出每天的准确容量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def factorize(n):
    factors = []

    if n % 2 == 0:
        e = 0
        while n % 2 == 0:
            n //= 2
            e += 1
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

def generate_terms(factors):
    terms = []

    def dfs(pos, divisor, phi_quotient):
        if pos == len(factors):
            terms.append((divisor, phi_quotient))
            return

        p, a = factors[pos]

        p_powers = [1]
        for _ in range(a):
            p_powers.append(p_powers[-1] * p)

        for e in range(a + 1):
            remaining = a - e

            if remaining == 0:
                phi_part = 1
            else:
                phi_part = (p - 1) * p_powers[remaining - 1]

            dfs(
                pos + 1,
                divisor * p_powers[e],
                phi_quotient * phi_part
            )

    dfs(0, 1, 1)
    return terms

def solve():
    n = int(input())

    factors = factorize(n)
    terms = generate_terms(factors)

    ans = [0] * n

    for divisor, phi_quotient in terms:
        weight = divisor * phi_quotient

        for k in range(0, n, divisor):
            ans[k] += weight

    sys.stdout.write('\n'.join(map(str, ans)))

if __name__ == "__main__":
    solve()
```这`factorize`函数提取 (n) 的素数幂。 由于最大可能输入的平方根仅为 1484 左右，因此与主要输出工作相比，试除法很小。 

递归`generate_terms`函数使用素因数分解来枚举除数。 如果 (n) 包含 (p^a)，则为除数 (g) 内的 (p) 选择指数 (e)，将指数 (a-e) 留在 (n/g) 内。 该代码立即计算相应的 totient 因子，因此每个生成的对都是精确的`(g, phi(n/g))`。 

主循环直接实现除数贡献。 对于除数`divisor`，值`weight`是 (g\varphi(n/g))。 范围从零开始，而不是从`divisor`，因为余数零可以被每个除数整除，并且接收来自每个 gcd 类的贡献。 

Python 整数具有任意精度，因此不存在溢出问题。 在固定宽度语言中，64 位整数是合适的类型，因为单个容量可能比 (2^{31}-1) 大得多。 

答案数组使用 Python 的列表表示形式。 在 (22) 万个位置处，这仍然在 256 MB 内存限制内，同时重复整数加法也比盒装高级映射结构快得多。 

## 工作示例

 对于 (n=6)，素因数分解为 (2\cdot3)。 除数项很容易推导：

 [
 \开始{数组}{c|c|c}
 g & \varphi(6/g) & g\varphi(6/g)\
 \h行
 1 & \varphi(6)=2 & 2\
 2 & \varphi(3)=2 & 4\
 3 & \varphi(2)=1 & 3\
 6 & \varphi(1)=1 & 6
 \结束{数组}
 ]

 数组更新的轨迹是：

 | 除数 (g) | 重量 | 职位更新 | 更新后的数组 |
 | ---| ---| ---| ---|
 | 1 | 2 | 0、1、2、3、4、5 | 2, 2, 2, 2, 2, 2 | 2, 2, 2, 2, 2, 2 |
 | 2 | 4 | 0, 2, 4 | 6, 2, 6, 2, 6, 2 | 6, 2, 6, 2, 6, 2 |
 | 3 | 3 | 0, 3 | 9, 2, 6, 5, 6, 2 |
 | 6 | 6 | 0 | 15, 2, 6, 5, 6, 2 |

 最终的数组正是示例输出。 该迹线显示了为什么零接收来自每个除数的贡献，而每个非零残差仅接收其自身除数的权重。 

对于素数 (n=5)，唯一的约数是 (1) 和 (5)。 

| 除数 (g) | 重量 | 职位更新 | 更新后的数组 |
 | ---| ---| ---| ---|
 | 1 | (\varphi(5)=4) | 0, 1, 2, 3, 4 | 0, 1, 2, 3, 4 | 4, 4, 4, 4, 4 | 4, 4, 4, 4, 4 |
 | 5 | (5\varphi(1)=5) | (5\varphi(1)=5) | 0 | 9, 4, 4, 4, 4 | 9, 4, 4, 4, 4 |

 这演示了素数模的特殊情况。 每个非零余数都收到相同的四个贡献，因为每个非零乘数都是可逆的模素数。 零从乘数处获得五个额外贡献 (i=0)。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(\sqrt n+\sigma(n))) | 因式分解成本 (O(\sqrt n))，除数更新循环执行 (\sum_{g\mid n}n/g=\sigma(n)) 次迭代 |
 | 空间| (O(n+\tau(n))) | 答案数组有 (n) 个条目，除数列表有 (\tau(n)) 个条目 |

 与暴力破解的关键区别在于，算术更新的次数与 (n) 的除数结构相关，而不是与 (n^2) 相关。 在最大输入时，(n) 只有 84 个除数和 (\sigma(n)=5{,}952{,}744)，因此与直接枚举所需的 (4.84\times10^{12}) 操作相比，更新阶段仍然很小。 内存消耗主要由 (n) 元素答案数组主导，大小正好在 256 MB 以内。 

## 测试用例```python
import sys
import io

def solution(data: str) -> str:
    n = int(data.strip())

    def factorize(x):
        factors = []

        if x % 2 == 0:
            e = 0
            while x % 2 == 0:
                x //= 2
                e += 1
            factors.append((2, e))

        p = 3
        while p * p <= x:
            if x % p == 0:
                e = 0
                while x % p == 0:
                    x //= p
                    e += 1
                factors.append((p, e))
            p += 2

        if x > 1:
            factors.append((x, 1))

        return factors

    factors = factorize(n)
    terms = []

    def dfs(pos, divisor, phi_quotient):
        if pos == len(factors):
            terms.append((divisor, phi_quotient))
            return

        p, a = factors[pos]

        powers = [1]
        for _ in range(a):
            powers.append(powers[-1] * p)

        for e in range(a + 1):
            remaining = a - e

            if remaining == 0:
                phi_part = 1
            else:
                phi_part = (p - 1) * powers[remaining - 1]

            dfs(
                pos + 1,
                divisor * powers[e],
                phi_quotient * phi_part
            )

    dfs(0, 1, 1)

    ans = [0] * n

    for divisor, phi_quotient in terms:
        weight = divisor * phi_quotient
        for k in range(0, n, divisor):
            ans[k] += weight

    return '\n'.join(map(str, ans))

# Provided sample
assert solution("6") == "15\n2\n6\n5\n6\n2", "sample 1"

# Minimum input
assert solution("1") == "1", "n = 1"

# Prime n, all nonzero residues have equal capacities
assert solution("5") == "9\n4\n4\n4\n4", "prime modulus"

# Composite n with repeated prime factors
assert solution("4") == "8\n2\n4\n2", "composite modulus"

# Maximum-size input.
# Checking the complete 2.2-million-line string directly would waste memory,
# so verify its size and boundary values.
maximum = solution("2200000")
maximum_lines = maximum.splitlines()

assert len(maximum_lines) == 2200000, "maximum n output length"
assert maximum_lines[0] == "84000000", "maximum n c[0]"
assert maximum_lines[-1] == "800000", "maximum n c[n-1]"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1`|`1`| 最小尺寸和零残留的特殊作用|
 |`5`|`9, 4, 4, 4, 4`| 质数模和相等的非零容量 |
 |`4`|`8, 2, 4, 2`| 复合模数和不可逆乘数 |
 |`2200000`| 2,200,000 行，第一`84000000`， 最后的`800000`| 最大输入大小、输出边界和性能 |

 ## 边缘情况

 对于 (n=1)，唯一可能的对是 ((0,0))。 因式分解没有质因数，因此除数生成器仅生成 (g=1)，其中 (\varphi(1)=1)。 更新循环将 (1) 添加到位置 0，精确产生```
1
```一种从以下位置开始除数枚举的解决方案`2`会默默怀念唯一的贡献。 

对于 (n=4)，除数贡献揭示了为什么复合模需要 gcd 参数。 这些项是 (g=1) 具有权重 (\varphi(4)=2)、(g=2) 具有权重 (2\varphi(2)=2) 和 (g=4) 具有权重 (4\varphi(1)=4)。 第一项更新每个位置，第二项更新位置零和位置二，第三项仅更新零。 结果是```
8
2
4
2
```零位置接收(2+2+4=8)，而二位置接收(2+2=4)。 这捕获了假设每个​​非零乘数恰好有一个模逆的实现。 

对于 (n=5)，唯一的约数是 (1) 和 (5)。 除数 (1) 对每个位置贡献 (\varphi(5)=4)，而除数 (5) 仅对零贡献 (5)。 结果是```
9
4
4
4
4
```这会出现相反的错误，即解决方案将零视为普通余数，并忘记乘数 (i=0) 对每个可能的 (j) 都贡献为零。 

对于最大值 (n=2{,}200{,}000)，素因数分解为 (2^6\cdot5^5\cdot11)，给出 84 个除数。 更新循环仅执行 (5{,}952{,}744) 次添加，而输出仍然包含所有 (220 万) 容量。 第一个值是 (84{,}000{,}000)，从

 [
 \sum_{g\mid n}g\varphi(n/g),
 ]

 对应于残差 (n-1) 的最终值为 (800{,}000=\varphi(n))，因为 (\gcd(n-1,n)=1)。 这种情况在位置 0 和 (n-1) 处执行了预期的渐近行为和数组边界。
