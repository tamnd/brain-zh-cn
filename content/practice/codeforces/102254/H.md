---
title: "CF 102254H - 寄予厚望"
description: "对于每条消息，我们都会得到一个基数 (n) 和一个模数 (m)，其中 (1 le n < m le 10^6)。 我们需要找到一个指数 (x)，将 (n) 提升到该指数后除以 (m) 后留下余数 (1)。 如果不存在这样的正指数，则所需的答案为 (-1)。"
date: "2026-08-17T21:13:05+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102254
codeforces_index: "H"
codeforces_contest_name: "IME++ Starters Try-outs 2019"
rating: 0
weight: 102254
solve_time_s: 141
verified: false
draft: false
---

[CF 102254H - 寄予厚望](https://codeforces.com/problemset/problem/102254/H)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 21s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 对于每条消息，我们都会得到一个基数 (n) 和一个模数 (m)，其中 (1 \le n < m \le 10^6)。 我们需要找到一个指数 (x)，将 (n) 提升到该指数后除以 (m) 后留下余数 (1)。 如果不存在这样的正指数，则所需的答案为 (-1)。 

关键的数学区别在于 (n) 是否可逆模 (m)。 如果 (\gcd(n,m)>1)，(n) 的每个正幂仍然可以被与 (m) 共享的某个素因数整除，因此它永远不会与 (1) 全等。 如果 (\gcd(n,m)=1)，则总是存在合适的指数，因为 (n) 属于模 (m) 的乘法群。 

当前显示的语句中有一个小的不一致：它显示 (0 \le x)，而第二个示例需要 (-1) 来表示 (2^x \pmod 4)。 由于 (2^0=1)，文字显示的条件将为每个查询提供 (x=0) 的解决方案。 样本和数学问题显然想要一个正指数。 下面的解决方案遵循预期的解释，这也是与示例 2 一致的唯一解释。 

界限 (m\le 10^6) 是数论预处理解决方案成为可能的原因。 可能有 (10^5) 个查询，因此通过试除法将每个模因式分解到 (\sqrt m)，然后进行可能昂贵的指数搜索，这在 Python 中成本太高。 我们需要使因式分解本质上是对数的，并保持每个查询的模运算量较小。 (O(m\log\log m)) 预处理过程以及每个查询的大致对数工作量完全在预期范围内。 

一些边缘情况可能会欺骗直接实现。 例如，使用输入`1 2`，正确答案是`1`，因为 (2) 不是这里的相关模数：查询是 (n=1,m=2) 和 (1^1\equiv1\pmod2)。 从指数 (2) 开始的搜索将错过最小的有效指数，但仍会接受任何有效指数。 

用于输入`2 4`，正确答案是`-1`。 由于 (\gcd(2,4)=2)，(2) 的每个正幂都是偶数，而与 (1\pmod4) 全等的数必须是奇数。 不首先检查互质性而盲目应用欧拉定理的粗心实现可能会错误地声称存在指数。 

用于输入`3 5`，答案是`4`。 这里 (\varphi(5)=4) 和 (3^4\equiv1\pmod5)，而 (3,3^2,3^3) 与 (1) 不同。 这也是示例，表明所需的指数不一定是 (1)。 

## 方法

 最直接的方法就是一一尝试正指数。 开始于`value = n % m`，重复乘以（n）模（m），当值变为（1）时停止。 这是正确的，因为第一次运行余数变为 (1) 时，它的指数恰好是一个解。 

问题在于迭代次数。 如果查询的乘法阶数接近 (10^6)，则搜索需要近一百万次模乘。 通过 (10^5) 次查询，可以达到大约 (10^{11}) 模乘法。 这远远超出了一秒的限制所能支持的范围。 

解锁更快解决方案的观察结果是，当 (\gcd(n,m)=1) 时，欧拉定理给出

 [
 n^{\varphi(m)}\equiv1\pmod m。 
]

 所以我们已经有了一个有保证的候选者（\varphi(m)）。 剩下的任务是从这个候选者中删除不必要的素因子。 

假设当前候选者是(k)，并且素数(p)整除(k)。 如果

 [
 n^{k/p}\equiv1\pmod m,
 ]

 那么(k/p)也是一个有效的指数，因此因子(p)是不必要的，可以删除。 我们对 (\varphi(m)) 的每个素因数都这样做。 结果值恰好是 (n) 模 (m) 的乘法阶。 

因为每个有效阶都可以除(\varphi(m))，所以最终的答案至多是(\varphi(m)\le m\le10^6)，所以它也满足指数界限。 

为了使 (10^5) 查询中的分解速度更快，我们为 (10^6) 以内的每个整数预先计算最小素因子或 SPF。 然后可以将每个模数分解为 (O(\log m)) 个除法。 它的欧拉函数可以直接从该因式分解中获得，并且 (\varphi(m)) 本身可以使用相同的 SPF 数组进行因式分解。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(qm)) | (O(1)) | (O(1)) | 太慢了 |
 | 最佳| (O(M\log\log M + q\log M\log M)) | (O(M)) | 已接受 |

 这里（M=10^6）。 第二个对数因子考虑了从 (\varphi(m)) 中剥离素因子时执行的模幂运算。 

## 算法演练

 1.预先计算最小素因数`spf[v]`对于每个 (2\le v\le10^6)。 SPF 数组让我们能够以对数时间分解任何查询模数和任何 totient。 
2. 对于每个查询 ((n,m))，计算 (\gcd(n,m))。 如果大于(1)，则输出`-1`。 (n) 的正幂仍然可以被 (n) 和 (m) 的每个公约数整除，因此它不能与 (1) 模 (m) 一致。 
3. 使用系数（m）`spf`。 如果

 [
 m=p_1^{a_1}p_2^{a_2}\cdots p_k^{a_k},
 ]

 计算

 m\prod_{i=1}^{k}\left(1-\frac1{p_i}\right)。 
]

 该公式中仅使用不同的质因数。 

1. 设置`order = phi(m)`。 欧拉定理保证 (n^{order}\equiv1\pmod m)，因为 gcd 检查确定 (n) 和 (m) 互质。 
2.因素`order`成其独特的素因数。 对于每个这样的素数 (p)，重复测试是否

 [
 n^{阶/p}\equiv1\pmod m。 
]

 如果测试成功，则划分`order`通过（p）并再次测试。 如果失败，则保留该因素。 

1.输出结果`order`。 它是产生余数 (1) 的最小正指数，因此它是有效答案，并且自动最多为 (10^6)。 

### 为什么它有效

 维持不变式`order`始终是满足 (n^{order}\equiv1\pmod m) 的正指数。 最初，根据欧拉定理，这是正确的。 当素因子 (p) 被删除时，我们只有在验证 (n^{order/p}\equiv1\pmod m) 后才这样做，因此不变量仍然为真。 当测试失败时，删除另一个 (p) 会破坏该属性。 

最终没有质因数`order`可以在保持一致性的同时被删除。 由于 (n) 模 (m) 的乘法阶除以产生 (1) 的每个指数，特别是除初始值 (\varphi(m))，因此重复删除每个可移除素因数恰好留下了最小的正指数。 

如果 (\gcd(n,m)>1)，则不存在正解，因此早期`-1`结果也是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MAX_M = 10**6

def build_spf(limit):
    spf = list(range(limit + 1))
    if limit >= 1:
        spf[1] = 1

    for i in range(2, int(limit ** 0.5) + 1):
        if spf[i] == i:
            start = i * i
            for j in range(start, limit + 1, i):
                if spf[j] == j:
                    spf[j] = i
    return spf

spf = build_spf(MAX_M)

def factor_distinct(x):
    """Return the distinct prime factors of x."""
    factors = []
    while x > 1:
        p = spf[x]
        factors.append(p)
        while x % p == 0:
            x //= p
    return factors

def phi_from_factorization(m):
    phi = m
    x = m

    while x > 1:
        p = spf[x]
        phi -= phi // p
        while x % p == 0:
            x //= p

    return phi

def multiplicative_order(n, m):
    if m == 1:
        return 1

    if __import__("math").gcd(n, m) != 1:
        return -1

    order = phi_from_factorization(m)

    for p in factor_distinct(order):
        while order % p == 0:
            candidate = order // p
            if pow(n, candidate, m) == 1:
                order = candidate
            else:
                break

    return order

def solve():
    q = int(input())
    out = []

    for _ in range(q):
        n, m = map(int, input().split())
        out.append(str(multiplicative_order(n, m)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```SPF 构建在处理查询之前完成一次。 对于每个合数，`spf[x]`存储其素因数之一，并重复除以该除数即可暴露完整因式分解而无需试除。`phi_from_factorization`以 (\varphi(m)=m) 开头。 对于每个不同的素数 (p\mid m)，它应用变换`phi -= phi // p`，这正是乘以 (1-1/p) 的整数形式。 然后，内部循环删除 (p) 的所有副本，因此每个不同的素数都会被处理一次。 

gcd 检查出现在欧拉定理之前。 欧拉定理要求互质，而跳过此检查是该解决方案中最显着的正确性错误。 为了`n = 2, m = 4`，例如，没有有效的正指数。 

降阶使用Python的内置`pow(n, exponent, m)`。 这可以直接计算模幂，而无需构造巨大的整数 (n^{exponent})。 Python 的任意精度整数也意味着不存在溢出问题，但是三参数`pow`仍然是必要的，因为普通的求幂会慢得多并且使用大量的中间值。 

这`while`围绕每个素因数进行循环是必要的。 素数可以在 (\varphi(m)) 中出现多次，并且可以删除多个副本。 例如，如果当前候选包含 (p^3)，一次成功的除法并不能证明剩余的 (p^2) 个副本是必要的。 

执行返回`1`当 (n=1) 时，由于 (1^1\equiv1\pmod m)。 预期的问题要求正指数，因此这是最小的有效答案。 

## 工作示例

 对于样本 1，查询为 (n=3,m=5)。 

| n | 米 | GCCD | Φ(米) | 当前订单 | 测试| 结果 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 3 | 5 | 1 | 4 | 4 | (3^{4/2}\bmod5=3^2\bmod5=4) | 保留因子 2 |
 | 3 | 5 | 1 | 4 | 4 | 不再有明显的因素| 输出4 |

 初始候选是 (\varphi(5)=4)。 它唯一的质因数是(2)，但指数(2)不会产生余数(1)。 因此这个因素不能被去除，答案仍然是（4）。 事实上，(3^4=81\equiv1\pmod5)。 

对于样本 2，查询为 (n=2,m=4)。 

| n | 米 | GCCD | 行动| 输出|
 | ---| ---| ---| ---| ---|
 | 2 | 4 | 2 | gcd 大于 1，因此不存在正序 | -1 |

 该算法在计算基于客户的订单之前停止。 (2) 的每个正幂都是偶数，因此不能与 (1\pmod4) 全等。 这正是欧拉定理无法处理的非互质情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(M\log\log M + q\log M\log M)) | SPF预处理成本(O(M\log\log M)); 每个查询将数字分解为 (O(\log M)) 并执行对数多次模幂 |
 | 空间| (O(M)) | SPF 数组包含 (10^6+1) 个整数 |

 使用 (M=10^6) 时，预处理是一次性成本，而 (q\le10^5) 使每个查询的工作易于管理。 该算法避免了潜在的 (10^{11}) 模乘暴力破解，并且每个查询仅使用少量模幂调用。 SPF 数组和查询输出的内存使用量也安全地低于 256 MB。 

## 测试用例```python
# helper: run the core solution on input string, return output string
import io
import math

def run(inp: str) -> str:
    data = inp.strip().split()
    it = iter(data)
    q = int(next(it))
    ans = []

    for _ in range(q):
        n = int(next(it))
        m = int(next(it))
        ans.append(str(multiplicative_order(n, m)))

    return "\n".join(ans)

# provided sample 1
assert run("""\
1
3 5
""") == "4", "sample 1"

# provided sample 2
assert run("""\
1
2 4
""") == "-1", "sample 2"

# Minimum-size modulus, n = 1
assert run("""\
1
1 2
""") == "1", "minimum-size valid query"

# Boundary case with n = m - 1. Since n == -1 (mod m), order is 2.
assert run("""\
1
999999 1000000
""") == "2", "maximum modulus boundary"

# Repeated identical queries, including a non-coprime case.
assert run("""\
4
5 8
5 8
6 9
6 9
""") == "2\n2\n-1\n-1", "repeated queries"

# Several small orders, including order 1 and order 2.
assert run("""\
4
1 7
2 7
3 7
6 7
""") == "1\n3\n6\n2", "small multiplicative orders"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1 2`|`1`| 最小有效值和 order-1 情况 |
 |`1 / 999999 1000000`|`2`| 最大模量和 (n\equiv-1\pmod m) 边界 |
 |`4 / 5 8 / 5 8 / 6 9 / 6 9`|`2 / 2 / -1 / -1`| 重复查询和非互质拒绝 |
 |`4 / 1 7 / 2 7 / 3 7 / 6 7`|`1 / 3 / 6 / 2`| 不同的精确乘法阶数和因子约简 |

 ## 边缘情况

 第一个边缘情况是最小模数，`1 2`。 gcd 为 (1)，且 (\varphi(2)=1)。 候选顺序已经是(1)，所以没有什么可以减少的。 算法输出`1`，确实是 (1^1\equiv1\pmod2)。 

第二个边缘情况是非互质查询`2 4`。 gcd 为 (2)，因此算法立即返回`-1`。 不需要模幂。 这可以防止将欧拉定理错误地应用到不可逆模 (4) 的值。 

第三个边缘情况是`999999 1000000`。 由于 (999999\equiv-1\pmod{1000000})，指数 (2) 就足够了。 (1000000) 的总和是 (400000)，因此算法从 (400000) 开始，只要相应的较小指数仍然产生 (1)，就会重复删除素因数。 最终达到`2`。 最终同余为 ((-1)^2\equiv1\pmod{1000000})。 

第四个边缘情况是`1 7`。 这里 (1) 的每个正幂都是 (1)，所以乘法阶数正好是`1`。 该算法从(\varphi(7)=6)开始，测试(6)的素因数，并反复减少候选，直到达到`1`。 最终结果是有效的，并揭示了为什么归约循环必须允许候选者一直下降到 1。 

第五个边缘情况涉及语句的显示下限`0 <= x`。 如果按字面解释该措辞，则每个查询都会有答案`0`，因为 (n^0=1) 对于每个正数 (n)。 这会使样本 2 不正确。 该算法有意遵循样本和乘法阶公式所暗示的正指数解释。 在提交之前，应根据声明可能已被修改的任何法官版本检查这种区别。
