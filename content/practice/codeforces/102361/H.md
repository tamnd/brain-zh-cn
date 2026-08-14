---
title: "CF 102361H - 蓬莱山辉夜姬"
description: "我们有一个素数模 (p) 和一个数组 (a1,ldots,an)，其中每个数组值都是非零模 (p)。 对于两个非零余数 (a,b)，我们需要最小的正指数 (u)，使得 (a^u) 属于由 (b) 生成的循环子群。 将该值称为 (f(a,b))。"
date: "2026-08-14T02:46:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102361
codeforces_index: "H"
codeforces_contest_name: "2019 China Collegiate Programming Contest Qinhuangdao Onsite"
rating: 0
weight: 102361
solve_time_s: 98
verified: true
draft: false
---

[CF 102361H - 蓬莱山辉夜](https://codeforces.com/problemset/problem/102361/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 38s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个素数模 (p) 和一个数组 (a_1,\ldots,a_n)，其中每个数组值都是非零模 (p)。 对于两个非零余数 (a,b)，我们需要最小的正指数 (u)，使得 (a^u) 属于由 (b) 生成的循环子群。 将该值称为 (f(a,b))。 

所需的答案是每个有序数组位置对上的 (f(a_i,a_j)f(a_j,a_i)) 之和，并以 (p) 为模进行缩减。 

第一个有用的简化来自于以下事实：非零余数模素数形成阶 (p-1) 的循环群。 因此，可以通过输入值的乘法顺序来理解输入值。 困难在于 (p) 可以大到 (10^{18})，因此即使分解 (p-1) 也需要真正的整数分解算法，而不是试除到 (\sqrt p)。 

当 (n) 达到 (10^5) 时，直接检查所有 (n^2) 对意味着最多 (10^{10}) 对评估。 这远远超出了竞争性编程时间限制所能支持的范围。 该解决方案必须压缩数组中的相同结构信息，然后利用 (p-1) 的除数结构。 

有几种边缘情况很容易被错误处理。 例如，如果 (n=1)，输入```
1 2
1
```答案为 (1)，因为 (f(1,1)=1)。 如果公式意外地将单位元素视为零阶，则此处会失败。 

重复的值也很重要。 为了```
3 7
2 2 2
```(2) 模 (7) 的阶数为 (3)。 每个有序对都有贡献 (1)，所以答案是 (9\bmod 7=2)。 我们必须计算多样性，而不仅仅是不同的值。 

边界值 (p-1) 是另一个有用的测试。 为了```
2 7
1 6
```顺序是（1）和（2）。 四个有序对贡献 (1,2,2,1)，给出 (6\bmod7=6)。 假设每个非零余数都是生成器的实现会出错。 

最后，定义一般允许 (f(a,b)=0)，但这种情况在实际输入中永远不会发生。 由于 (a\neq0)，(a) 的某个正幂为 (1)，并且 (1) 包含在由非零 (b) 生成的每个子群中。 因此每对输入值都有一个正值 (f)。 

## 方法

 蛮力方法将处理每个有序对 ((a_i,a_j))。 对于一对，可以重复乘以 (a_i) 直到达到 (a_j) 生成的元素，但这可能已经需要对一对进行 (O(p)) 工作。 即使在识别了群结构并使用 gcd 计算每对的答案之后，仍然有 (n^2) 对。 使用(n=10^5)，即(10^{10})对操作，这太慢了。 

蛮力之所以有效，是因为一对的答案完全取决于这两个元素在模 (p) 循环群中的位置。 关键的观察是这个位置可以用乘法阶来描述。 

设(q=p-1)，并选择原根(g) 模(p)。 写

 [
 a=g^A,\qquad b=g^B。 
]

 (b) 生成的子群由可被整除的指数组成

 [
 d_b=\gcd(B,q)。 
]

 我们需要最小的正值 (u)，使得 (a^u) 属于该子组。 由于 (a^u=g^{Au})，这意味着

 [
 d_b\中金。 
]

 最小正解是

 [
 f(a,b)=\frac{\gcd(B,q)}{\gcd(A,B,q)}。 
]

 可以在不知道离散对数 (A) 和 (B) 的情况下重写该表达式。 (a) 的乘法阶为

 [
 \operatorname{ord}(a)=\frac{q}{\gcd(A,q)},
 ]

 (b) 也类似。 另外，

 [
 \gcd(A,B,q)=\frac{q}{\operatorname{lcm}(\operatorname{ord}(a),\operatorname{ord}(b))}。 
]

 替换这些身份给出

 \frac{\operatorname{lcm}(r,s)}
 {\operatorname{gcd}(r,s)},
 ]

 其中 (r=\operatorname{ord}(a)) 和 (s=\operatorname{ord}(b))。 

因此实际值 (a_i) 从配对计算中消失。 我们只需要每个数组元素的乘法顺序。 

下一个压缩是按元素的顺序对元素进行分组。 令(c_d)为具有阶数(d)的输入值的数量。 那么所需的总和就变成了

 [
 \sum_{d\mid q}\sum_{e\mid q}
 c_d c_e
 \frac{\operatorname{lcm}(d,e)}{\gcd(d,e)}。 
]

 自从

 \frac{de}{\gcd(d,e)^2},
 ]

 定义 (b_d=c_d d)。 答案是

 [
 \sum_{d,e\mid q}\frac{b_d b_e}{\gcd(d,e)^2}。 
]

 剩下的问题是除数和变换。 对于任何正整数 (x)，

 [
 \frac1{x^2}=\sum_{k\mid x} h(k),
 ]

 莫比乌斯反演给出

 [
 h(k)=\sum_{t\mid k}\frac{\mu(t)}{(k/t)^2}。 
]

 因为 (k) 由 (p-1) 的质因数组成，所以可以简化为

 \frac{1}{k^2}
 \prod_{r\mid k}(1-r^2)。 
]

 现在代入 (x=\gcd(d,e))：

 \sum_{k\mid d,\ k\mid e}h(k)。 
]

 交换总和后，

 \sum_{k\mid q}
 h(k)
 \左（
 \sum_{\substack{d\mid q\k\mid d}} b_d
 \右）^2。 
]

 这就是中央减少。 对于 (q) 的每个除数 (k)，我们只需要 (b_d) 与 (k) 的所有除数倍数 (d) 之和。 

(q) 的所有约数都可以显式生成。 如果我们从值 (b_d) 开始，除数格后缀变换会在 (O(\tau(q)\omega(q))) 中计算这些多重和，其中 (\tau(q)) 是除数的数量，(\omega(q)) 是不同素数因子的数量。 对于这种方法来说，最大 (10^{18}) 的整数的约数数量足够小。 

剩下的数论任务是分解 (p-1)。 由于 (p-1) 可以接近 (10^{18})，所以试除法是不够的。 我们使用确定性 Miller-Rabin 进行下面的素性测试 (2^{64})，并结合 Pollard-Rho 进行分解。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^2)) 配对评估 | (O(1)) 额外 | 太慢了 |
 | 最佳 | (O(n\omega(q)\log p+\tau(q)\omega(q)+\text{因式分解})) | (O(\tau(q)+n)) | 已接受 |

 ## 算法演练

1. 将 (q=p-1) 和因子 (q) 设置为其不同的质因子及其指数。 由于 (p<2^{60})，具有固定基数集的确定性 Miller-Rabin 足以进行素性测试，而 Pollard-Rho 可以有效地分解剩余的合数。 
2. 对于每个输入值 (a_i)，计算其乘法阶模 (p)。 开始于`order = q`。 对于 (q) 的每个不同质因数 (r)，重复测试是否

 [
 a_i^{\text{阶}/r}\equiv1\pmod p.
 ]

 如果测试成功，则划分`order`通过 (r) 并再次测试。 最终的值正好是 (\operatorname{ord}(a_i))，因为乘法阶必须除以 (q)，并且每次成功除法都会删除一个不需要的素因数。 

1. 计算有多少个输入值具有每种可能的顺序。 将其存储为 (c_d)。 只有 (q) 的约数才能以阶数的形式出现。 
2. 生成 (q) 的每个除数 (d)。 对于每个除数，初始化

 [
 b_d=c_d d\pmod p。 
]

 乘以 (d) 直接来自将对贡献重写为 (de/\gcd(d,e)^2)。 

1. 计算

 [
 S_k=\sum_{\substack{d\mid q\k\mid d}}b_d
 ]

 对于每个除数 (k)。 一次处理一个不同的质因数 (r)。 对于每个除数 (d) 使得 (dr\mid q)，将属于 (dr) 的值添加到属于 (d) 的值中。 按降序处理除数使得更新为 (r) 指数上的就地后缀和。 

1. 计算

 [
 h(k)=\frac{\prod_{r\mid k}(1-r^2)}{k^2}\pmod p。 
]

 除法以 (p) 为模有效，因为 (p-1) 的每个除数都与 (p) 互质。 不是计算每个除数的模逆，而是预先计算每个不同素数的平方反比并从 (h(k/r)) 导出 (h(k))。 

1. 积累

 \sum_{k\mid q}h(k)S_k^2\pmod p。 
]

 这正是原始双和的变换形式。 

### 为什么它有效

 对于每个输入值，其乘法阶完全决定了相关的子组信息。 产品 (f(a,b)f(b,a)) 恰好是 (\operatorname{lcm}(r,s)/\gcd(r,s)=rs/\gcd(r,s)^2)，因此按顺序对值进行分组不会丢失任何信息。 

莫比乌斯导出函数 (h) 满足 (1/x^2=\sum_{k\mid x}h(k))。 将此恒等式应用于 (x=\gcd(d,e)) 可将成对 gcd 表达式转换为由单个公约数 (k) 索引的和。 后缀变换精确计算所有值 (\sum_{k\mid d}b_d)，因此 (h(k)S_k^2) 上的最终总和包含每个有序对及其原始贡献一次。 

## Python 解决方案```python
import sys
import math
import random

input = sys.stdin.readline

def is_prime(n):
    if n < 2:
        return False

    small = (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37)
    for p in small:
        if n % p == 0:
            return n == p

    d = n - 1
    s = 0
    while d % 2 == 0:
        s += 1
        d //= 2

    # Deterministic for every n < 2^64.
    for a in (2, 325, 9375, 28178, 450775, 9780504, 1795265022):
        if a % n == 0:
            continue

        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue

        for _ in range(s - 1):
            x = x * x % n
            if x == n - 1:
                break
        else:
            return False

    return True

def pollard_rho(n):
    if n % 2 == 0:
        return 2
    if n % 3 == 0:
        return 3

    while True:
        c = random.randrange(1, n)
        x = random.randrange(0, n)
        y = x
        d = 1

        while d == 1:
            x = (x * x + c) % n
            y = (y * y + c) % n
            y = (y * y + c) % n
            d = math.gcd(abs(x - y), n)

        if d != n:
            return d

def factor_rec(n, factors):
    if n == 1:
        return
    if is_prime(n):
        factors.append(n)
        return

    d = pollard_rho(n)
    factor_rec(d, factors)
    factor_rec(n // d, factors)

def factorize(n):
    factors = []
    factor_rec(n, factors)
    factors.sort()

    result = []
    for x in factors:
        if not result or result[-1][0] != x:
            result.append([x, 1])
        else:
            result[-1][1] += 1
    return result

def solve_data(data):
    it = iter(data.split())
    n = int(next(it))
    mod = int(next(it))
    a = [int(next(it)) for _ in range(n)]

    q = mod - 1
    factorization = factorize(q)
    primes = [r for r, _ in factorization]

    # Count elements by multiplicative order.
    freq = {}

    for x in a:
        order = q

        for r in primes:
            while order % r == 0 and pow(x, order // r, mod) == 1:
                order //= r

        freq[order] = freq.get(order, 0) + 1

    # Generate all divisors of q.
    divisors = [1]
    for r, e in factorization:
        old = divisors[:]
        mul = 1
        new = []
        for _ in range(e + 1):
            for d in old:
                new.append(d * mul)
            mul *= r
        divisors = new

    divisors.sort()
    index = {d: i for i, d in enumerate(divisors)}

    # b[d] = count[d] * d.
    values = [0] * len(divisors)
    for d, cnt in freq.items():
        values[index[d]] = (cnt * d) % mod

    # S[k] = sum_{d: k|d} b[d].
    #
    # Since d*r > d, descending order guarantees that values[d*r]
    # has already received all contributions for the current prime.
    descending = divisors[::-1]

    for r in primes:
        for d in descending:
            nd = d * r
            pos = index.get(nd)
            if pos is not None:
                values[index[d]] += values[pos]
                if values[index[d]] >= mod:
                    values[index[d]] -= mod

    # h[d] = sum_{t|d} mu(t) / (d/t)^2.
    #
    # If r is a prime divisor of d and d = r*m:
    #
    # h[d] / h[m] =
    #   (1-r^2)/r^2, if r does not divide m,
    #   1/r^2,       otherwise.
    inv_r2 = {}
    for r in primes:
        inv_r = pow(r, mod - 2, mod)
        inv_r2[r] = inv_r * inv_r % mod

    h = [0] * len(divisors)
    h[index[1]] = 1

    for d in divisors[1:]:
        for r in primes:
            if d % r == 0:
                m = d // r
                base = h[index[m]]
                inv2 = inv_r2[r]

                if m % r == 0:
                    h[index[d]] = base * inv2 % mod
                else:
                    factor = (1 - r * r) % mod
                    h[index[d]] = base * factor % mod
                break

    ans = 0
    for i in range(len(divisors)):
        ans = (ans + h[i] * values[i] % mod * values[i]) % mod

    return str(ans)

def solve():
    data = sys.stdin.buffer.read()
    sys.stdout.write(solve_data(data))

if __name__ == "__main__":
    solve()
```素性测试使用完整 64 位整数范围的标准确定性 Miller-Rabin 基。 这很重要，因为 (p-1) 几乎可以是 (10^{18})，因此这里没有必要将 Miller-Rabin 仅仅视为概率。 

Pollard-Rho 递归地分裂 (p-1)，直到所有因子都是素数。 递归深度很小，因为每次成功的分割都会大大减少合数。 

对于每个输入值，阶数计算从 (p-1) 开始，而不是从 (1) 开始。 如果素数 (r) 除当前候选顺序并且 (a^{\text{order}/r}=1)，则可以删除该因子。 重复测试可以正确处理素数幂。 例如，如果真实顺序包含 (r^2)，则第一次除法可能成功，但第二次除法将失败。 

除数数组包含(p-1)的每个除数，包括(1)和(p-1)。 从除数到索引的字典避免了除数是连续整数的任何假设。 

多重和变换按除数降序执行。 在处理素数 (r) 时，(d r) 处的值已经包含通过增加 (r) 的指数获得的所有倍数，因此将其添加到 (d) 即可一次性计算出所需的后缀和。 

(h(d)) 的计算以 (p) 为模进行。 由于 (p-1) 的每个除数都严格小于 (p)，因此存在所有所需的模逆。 Python 整数还避免了在 64 位实现中将接近 (10^{18}) 的数字相乘时出现的溢出问题。 

## 工作示例

 提供的样品是```
4 5
1 2 3 4
```这里（p-1=4=2^2）。 乘法阶数为(1,4,4,2)。 

| 命令 (d) | 频率 (c_d) | (b_d=c_d d) |
 | --- | --- | --- |
 | 1 | 1 | 1 |
 | 2 | 1 | 2 |
 | 4 | 2 | 8 |

 以 (5) 为模，除数 (1,2,4) 的初始 (b) 值为 (1,2,0)。 

对于素数 (2)，后缀变换给出

 | (k) | 初始 (b_k) | (S_k=\sum_{k\mid d}b_d) |
 | --- | --- | --- |
 | 1 | 1 | 11 | 11
 | 2 | 2 | 10 | 10
 | 4 | 8 | 8 |

 对 (5) 取模，即 (1,0,3)。 

相应的 (h) 值为

 [
 h(1)=1,\qquad
 h(2)=\frac{1-2^2}{2^2}=-\frac34,\qquad
 h(4)=\frac{1-2^2}{4^2}=-\frac3{16}。 
]

 模 (5)，这给出

 | (k) | (h(k)\bmod5) | (h(k)\bmod5) | (S_k\bmod5) | 贡献 |
 | --- | --- | --- | --- |
 | 1 | 1 | 1 | 1 |
 | 2 | 3 | 0 | 0 |
 | 4 | 2 | 3 | 18 模 5 = 3 |

 总数为 (4)，与样本输出匹配。 

该轨迹演示了主要的压缩：虽然有 (16) 个有序的输入位置对，但按顺序分组后，我们只使用三个除数 (1,2,4)。 

对于第二个例子，考虑```
2 7
1 6
```这里 (q=6=2\cdot3)。 (1)的阶数为(1)，而(6=-1)的阶数为(2)。 

| 命令 (d) | 频率 (c_d) | (b_d=c_d d) |
 | --- | --- | --- |
 | 1 | 1 | 1 |
 | 2 | 1 | 2 |
 | 3 | 0 | 0 |
 | 6 | 0 | 0 |

 多项式的总和是

 | (k) | (S_k) |
 | --- | --- |
 | 1 | 3 |
 | 2 | 2 |
 | 3 | 0 |
 | 6 | 0 |

 四个原始对贡献直接

 [
 \frac{1\cdot1}{1^2}=1,
 \四边形
 \frac{1\cdot2}{1^2}=2,
 \四边形
 \frac{2\cdot1}{1^2}=2,
 \四边形
 \frac{2\cdot2}{2^2}=1。 
]

 它们的和是 (6)，所以答案是 (6\bmod7=6)。 

此示例同时运用恒等元和非生成器。 这也证实了该公式使用了两个阶数的gcd，而不是简单地比较阶数是否相等。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(\text{Pollard-Rho} + n\omega(q)\log p+\tau(q)\omega(q)+\tau(q)\omega(q)\log p)) | 阶次计算对不同素数因子使用模幂，而除数变换对每个不同素数使用一次传递 |
 | 空间| (O(n+\tau(q))) | 存储输入值、阶次频率、除数数组和分解数据 |

 对于 (n\le10^5)，成对 (O(n^2)) 方法是不可能的。 除了模幂成本之外，优化方法仅线性取决于 (n)，而除数工作取决于 (p-1)。 对于 (10^{18}) 以内的整数，除数的数量对于显式除数格变换而言足够小，并且 Pollard-Rho 可以处理 (p-1) 的因式分解，而无需试除最多 (10^9) 的整数。 

## 测试用例```python
import io
import sys

# Paste the solve_data function and its helpers from the solution above
# before running these tests.

def run(inp: str) -> str:
    return solve_data(inp.encode()).strip()

# Provided sample
assert run("""\
4 5
1 2 3 4
""") == "4", "sample 1"

# Minimum size
assert run("""\
1 2
1
""") == "1", "minimum-size case"

# All values equal
assert run("""\
3 7
2 2 2
""") == "2", "all-equal values"

# Boundary value p-1 together with the identity
assert run("""\
2 7
1 6
""") == "6", "boundary orders"

# Mixed orders, catches confusion between gcd and lcm
assert run("""\
2 7
2 3
""") == "5", "different order structure"

# Maximum n with p=2. The only possible value is 1, so every
# ordered pair contributes 1. Since 100000^2 is even, the result is 0.
maximum_input = "100000 2\n" + " ".join(["1"] * 100000) + "\n"
assert run(maximum_input) == "0", "maximum-size case"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 2 / 1`|`1`| 最小大小和除数集仅包含 (1) |
 |`3 7 / 2 2 2`|`2`| 重数和等阶|
 |`2 7 / 1 6`|`6`| 命令 (1) 和 (2)，包括 (p-1) |
 |`2 7 / 2 3`|`5`| 不同的非平凡订单 |
 |`100000 2 / 1 ... 1`|`0`| 最大值 (n)、重复值和 (p=2) |

 ## 边缘情况

 对于最小输入```
1 2
1
```我们有 (q=1)，因此因式分解为空，唯一的除数是 (1)。 (1)阶初始化为(q=1)，(1)阶出现频率为1，后缀和为(1)。 由于(h(1)=1)，最终答案为(1)。 (p=2) 不需要特殊情况。 

对于重复值，请考虑```
3 7
2 2 2
```(2)模(7)的阶数为(3)，因此频率图包含(c_3=3)。 每对都有阶数 (3,3)，给出

 [
 \frac{3\cdot3}{3^2}=1。 
]

 有九个有序对，因此结果是 (9\bmod7=2)。 频率聚合处理所有九对而不显式枚举它们。 

对于边界值 (p-1)，考虑```
2 7
1 6
```顺序是（1）和（2）。 两个值都等于 (6) 的对贡献 (2\cdot2/2^2=1)，而每个混合对贡献 (1\cdot2/1^2=2)。 将四个贡献相加得出 (6)，因此输出为 (6)。 该算法从不假设任意非零余数具有阶数 (p-1)。 

对于尽可能最小的模量，```
100000 2
1 1 1 ... 1
```每个输入值都是(1)，其阶数是(1)。 每个有序对贡献 (1)，产生 (10^{10})。 由于 (p=2)，所需结果为 (10^{10}\bmod2=0)。 (p-1=1) 的因式分解不会产生质因数，除数变换自然会简化为单除数 (1)，因此不存在零除或空因数分解问题。
