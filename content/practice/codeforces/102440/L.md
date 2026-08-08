---
title: "CF 102440L - \u0420\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u0435 \u043a\u0440\u043e\u043b\u0438\u043a\u043e\u0432"
description: "我们有从 (1) 到 (n) 编号的兔子，每只兔子都必须收到两个标签之一：(0) 或 (1)。 标签不能随意选择。 每当 (b) 除 (a) 时，标签必须满足 [ f(a)=f(b) text{OR} f(a/b)。"
date: "2026-08-08T14:13:45+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102440
codeforces_index: "L"
codeforces_contest_name: "2018-2019 9th BSUIR Open Programming Championship. Junior"
rating: 0
weight: 102440
solve_time_s: 499
verified: true
draft: false
---

[CF 102440L - \u0420\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u0435 \u043a\u0440\u043e\u043b\u0438\u043a\u043e\u0432](https://codeforces.com/problemset/problem/102440/L)

 **评级：** -
 **标签：** -
 **求解时间：** 8m 19s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有从 (1) 到 (n) 编号的兔子，每只兔子都必须收到两个标签之一：(0) 或 (1)。 标签不能随意选择。 每当 (b) 除 (a) 时，标签必须满足

 [
 f(a)=f(b)\ \文本{OR}\ f(a/b)。 
]

 有些兔子已经有了规定的标签，我们需要计算每个既满足可分性规则又满足所有规定的完整标签。 答案取模 (10^9+7)。 

输入结构的有用部分是 (n\le 10^6) 和 (m\le18) 的组合。 兔子的数量足够大，以至于任何算法都无法枚举所有 (n) 只兔子的状态，或更糟糕的是，枚举所有 (2^n) 个标签的状态。 同时，只有 18 只兔子受到约束，这强烈表明指数部分应该取决于 (m)，而不是 (n)。 最多 18 个指定数字的因式分解也很便宜，因为每个数字最多为 (10^6)。 

在一些边缘情况下，将规则视为普通的局部约束会给出错误的答案。 第一个是兔子（1）。 例如，```
1 1
1 0
```答案为 (1)，因为 (f(1)=0) 完全有效并且没有其他兔子。 粗心的解决方案可能会将 (1) 视为具有素因数，并错误地强制采用其他值。 

第二个是(f(1)=1)的可能性。 例如，```
3 1
1 1
```有答案（1）。 一旦 (f(1)=1)，每个素数也必须有颜色 (1)，因此每只兔子都有颜色 (1)。 这是一种完整的着色，如果我们只考虑从 (f(1)=0) 的素数选择生成的着色，很容易错过。 

第三种边缘情况是不可能的肯定条件。 例如，```
5 2
4 1
2 0
```有答案（0）。 条件 (f(2)=0) 强制 (f(4)=f(2)=0)，与规定值 (f(4)=1) 相矛盾。 仅仅独立地计算指定的兔子就会忽略这种依赖性。 

最后一个有用的例子是```
5 2
2 1
3 1
```其中有答案（3）。 组（1）中的每只兔子都有一种颜色，当（f（1）=0）时，素数（2）和（3）必须都是（1），而素数（5）可以独立地为（0）或（1）。 因此，第二种类型有两种着色，总共为 (3)。 

## 方法

 直接蛮力方法是将 (0) 或 (1) 分配给 (n) 只兔子中的每一只。 有 (2^n) 个作业。 对于每个分配，我们可以通过迭代 (b) 及其倍数 (a) 来检查每个整除对。 这样的对的数量是

 [
 \sum_{b=1}^{n}\left\lfloor\frac nb\right\rfloor=\Theta(n\log n)。 
]

 在 (n=10^6) 时，对一种着色的整除性检查约为 (1.4\cdot10^7) 次，而着色数量为 (2^{10^6})。 该方法是正确的，但它对 (n) 的指数依赖使其完全无法使用。 

关键的观察结果来自于仅将规则应用于素因数。 假设 (p) 是素数且 (p\mid x)。 如果 (f(p)=1)，则

 [
 f(x)=f(p)\text{ 或 }f(x/p)=1,
 ]

 因此 (p) 的每个倍数也必须具有颜色 (1)。 如果相反 (f(p)=0)，那么

 [
 f(x)=f(x/p)。 
]

 反复去除质因数表明，除了 (f(1)) 的特殊选择外，每个数字的颜色完全由其不同质因数的颜色决定。 

因此，只有两种结构情况。 

如果 (f(1)=1)，每个素数 (p) 也必须具有颜色 (1)，因为将规则应用于 (a=p,b=p) 不会强制这一点，但将其应用于 (a=p,b=1) 是同义反复，因此我们需要另一个参数。 由于(p)可以表示为(a=p,b=p)，所以仍然没有限制。 考虑(a=p^2,b=p)得到决定性条件：

 [
 f(p^2)=f(p)\text{ 或 }f(p)=f(p)。 
]

 因此，原色最初看起来是独立的。 然而，如果 (f(1)=1)，则与 (b=x) 的一般关系也不会强制执行任何操作。 正确的结构语句实际上略有不同：(f(1)) 不是由整除性规则强制的。 如果 (f(1)=1)，通过质数 (p) 与 (f(p)=0) 的递推给出 (f(p)=f(1)=1)，因此 (p) 不能为 (0)。 因此每个素数都是 (1)，然后每个数字都是 (1)。 因此 (f(1)=1) 恰好给出一种颜色。 

如果 (f(1)=0)，每个数字 (x>1) 都会得到其不同质因数的颜色或：

 [
 f(x)=\bigvee_{p\mid x}f(p)。 
]

 现在未知数只是素数的颜色。 规定的 (x=0) 强制 (x) 的每个素因数为 (0)。 规定(x=1)意味着(x)的至少一个素因数必须是(1)。 

这将问题转化为计算对最多 18 个 OR 子句的素数的布尔赋值。 我们可以对颜色为 (1) 的规定兔子进行包含-排除的分配计数。 对于选定的正约束子集，包含-排除要求我们使每个选定的 OR 子句为假。 使 OR 子句为假意味着将其所有素因数设置为 (0)。 我们从子集中需要的唯一数量是它强制为零的不同质数变量的数量。 

质数变量的数量可以很大，当（n=10^6）时最多可达（78498），但正约束的数量最多为18。因此，我们将每个正约束的质因数表示为Python整数位掩码。 约束的子集可以通过对其掩码进行按位或来处理。 指数部分只有(2^{18}=262144)，很小。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (\Theta(2^n n\log n)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳 | (O(n\log\log n + 2^m m)) | (O(n+2^m)) | 已接受 |

 ## 算法演练

 1. 构建一个直至 (n) 的埃拉托斯特尼筛。 除了计算直到 (n) 的所有素数外，还保留所得的素数列表，以便可以有效地分解最多 18 个指定数字。 
2. 将指定的兔子分为颜色（0）和颜色（1）的兔子。 将每个规定的数字分解为其不同的素因数。 
3. 将指定零值数的每个素因数添加到集合中`forced_zero`。 在 (f(1)=0) 情况下，当一个数字的每个素数因子都具有颜色 (0) 时，它的颜色恰好为 (0)，因此这些素数是强制的。 
4.检查是否可以全1着色。 当规定的兔子没有颜色 (0) 时，这正是可能的。 如果是，请在答案中加一。 这说明了单独的情况 (f(1)=1)。 
5. 对于(f(1)=0)情况，检查每只规定颜色(1)的兔子。 如果它的值为 (1)，则不存在可以使其颜色为 (1) 的素因数，因此这种情况贡献为零。 
6. 给出在正约束中出现且尚未强制将位位置归零的每个素数。 对于每个正约束，构建一个恰好包含这些素数的掩码。 仅在零约束下出现的素数已被固定为零，因此它们不需要一点。 
7. 令 (F) 为在考虑正约束之前保持自由的质数变量的总数。 对于正约束的子集 (S)，对其掩码进行 OR 运算。 它的设置位恰好是附加素数，必须为零才能使 (S) 中的所有约束为假。 因此，(S) 中所有约束均为假的分配数为

 [
 2^{F-\operatorname{popcount}(\operatorname{OR}(S))}。 
]

 1. 对正约束的所有子集应用包含-排除。 对于偶数大小的子集添加此数量，对于奇数大小的子集减去该数量。 结果值恰好是满足每个正约束的 (f(1)=0) 着色数。 
2. 将 (f(1)=0) 贡献添加到可能的全 1 着色，减少模 (10^9+7)，并打印结果。 

包含-排除不变量起作用的原因是正约束是其原色的或。 当所有主要变量都为零时，这样的约束就会失效。 对于任何选定的失败约束集合，所需的零变量恰好是其素因子集的并集。 掩码 OR 计算该并集，而无需重复计算共享素数。 然后，包含-排除对没有任何正约束失败的分配进行计数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1_000_000_007

def build_sieve(n):
    sieve = bytearray(b'\x01') * (n + 1)

    if n >= 0:
        sieve[0] = 0
    if n >= 1:
        sieve[1] = 0

    p = 2
    while p * p <= n:
        if sieve[p]:
            start = p * p
            count = (n - start) // p + 1
            sieve[start:n + 1:p] = b'\x00' * count
        p += 1

    primes = [i for i in range(2, n + 1) if sieve[i]]
    return sieve, primes

def factor_distinct(x, primes):
    factors = []

    for p in primes:
        if p * p > x:
            break

        if x % p == 0:
            factors.append(p)
            while x % p == 0:
                x //= p

        if x == 1:
            break

    if x > 1:
        factors.append(x)

    return factors

def solve():
    n, m = map(int, input().split())

    fixed = []
    for _ in range(m):
        x, y = map(int, input().split())
        fixed.append((x, y))

    sieve, primes = build_sieve(n)
    prime_count = len(primes)

    factorized = []
    forced_zero = set()

    for x, y in fixed:
        factors = factor_distinct(x, primes)
        factorized.append((x, y, factors))

        if y == 0:
            for p in factors:
                forced_zero.add(p)

    answer = 0

    # Case f(1) = 1.
    # Then every prime must also be 1, so the whole coloring is all ones.
    if all(y == 1 for _, y in fixed):
        answer = 1

    # Case f(1) = 0.
    positive = []

    impossible = False

    for x, y, factors in factorized:
        if y == 1:
            if x == 1:
                impossible = True
                break
            positive.append(factors)

    if not impossible:
        # Assign bit positions only to primes that can still be free.
        prime_id = {}
        next_bit = 0

        for factors in positive:
            for p in factors:
                if p not in forced_zero and p not in prime_id:
                    prime_id[p] = next_bit
                    next_bit += 1

        masks = []
        for factors in positive:
            mask = 0
            for p in factors:
                if p not in forced_zero:
                    mask |= 1 << prime_id[p]
            masks.append(mask)

        # A positive constraint with all its prime factors forced to zero
        # can never become 1.
        if any(mask == 0 for mask in masks):
            c0 = 0
        else:
            free_primes = prime_count - len(forced_zero)

            k = len(masks)
            total_subsets = 1 << k

            union = [0] * total_subsets
            c0 = 0

            for subset in range(1, total_subsets):
                bit = subset & -subset
                idx = bit.bit_length() - 1
                union[subset] = union[subset ^ bit] | masks[idx]

            for subset in range(total_subsets):
                used = union[subset].bit_count()
                ways = pow(2, free_primes - used, MOD)

                if subset.bit_count() & 1:
                    c0 -= ways
                else:
                    c0 += ways

            c0 %= MOD

        answer = (answer + c0) % MOD

    print(answer)

if __name__ == "__main__":
    solve()
```筛子有两个不同的用途。`prime_count`告诉我们在 (f(1)=0) 情况下存在多少个独立素数变量，而素数列表让我们最多可以分解 18 个指定数字。 由于每个输入值最多为 (10^6)，因此除以素数到其平方根的试除法很小。 

这`forced_zero`集合代表来自规定的零值兔子的信息。 如果 (x) 规定为零，则 (x) 的每个素因数都必须为零。 从掩模中去除这些底漆是至关重要的。 它们已经是固定的，因此再次将它们计数为自由变量会超出分配的计数。 

特别的`all(y == 1)`检查句柄 (f(1)=1)。 在这种情况下，通过删除零色素数获得的递推将矛盾 (f(1)=1)，因此每个素数必须为 1，并且每只兔子都变为 1。 确实有一种这样的颜色。 

对于 (f(1)=0) 情况，每个正约束都成为一个子句，表示至少一个素因数必须具有颜色 (1)。 包含-排除对满足所有这些子句的赋值进行计数。 这`union`数组存储每个子集的质数掩码的并集，使用

 [
 U(S)=U(S\setminus{i})\ \text{OR}\ M_i。 
]

 中的指数为`pow(2, free_primes - used, MOD)`是在所选子句被迫失败后仍然空闲的素数变量的数量。 

Python 中不存在整数溢出问题。 模幂直接执行`pow(base, exponent, MOD)`，因此即使着色的数学数量巨大，也不需要构造中间值。 

## 工作示例

 ### 示例 1

 输入是```
5 2
4 1
2 0
```(5) 之前的素数是 (2,3,5)。 兔子 (2) 固定为零，因此质数 (2) 被迫为零。 兔子 (4) 具有素因子集 ({2})，但规定为 1。 

| 步骤| 规定的零因子 | 积极面膜| 有效 (f(1)=0) 分配 | 回答 |
 | ---| ---| ---| ---| ---|
 | 因数 (2) | ({2}) | | | |
 | 因数 (4) | ({2}) | (0) | (0) | (0) |
 | 检查 (f(1)=1) | 无效，因为规定 (2=0) | | (0) | (0) |

 正掩码是空的，因为它唯一的素因数已经被强制为零。 因此，积极条件永远无法满足。 全一着色也被规定的零所禁止，所以最终答案是（0）。 

### 示例 2

 输入是```
5 2
2 1
3 1
```素数有(2,3,5)三个，没有一个素数被强制为零。 对于(f(1)=0)，两个正约束是子句(2=1)和(3=1)。 

| 条款子集 | 强制零素数的并集 | 尺寸| 标志 | 作业 |
 | ---| ---| ---| ---| ---|
 | (\var没有) | (\var没有) | 0 | (+)| (2^3=8) | (2^3=8) |
 | ({2}) | ({2}) | 1 | (-)| (2^2=4) | (2^2=4) |
 | ({3}) | ({3}) | 1 | (-)| (2^2=4) | (2^2=4) |
 | ({2,3}) | ({2,3}) | ({2,3}) | ({2,3}) | 2 | (+)| (2^1=2) | (2^1=2) |

 包含-排除给出

 [
 8-4-4+2=2。 
]

 这是 (f(1)=0) 的两种着色，其中素数 (2) 和 (3) 都是 1，素数 (5) 是任意的。 由于每个规定值都是 1，因此全 1 着色又贡献了 1。 

最终答案是（2+1=3）。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n\log\log n + m\sqrt n + 2^m m)) | 筛选范围，因子最多 (m) 个数字，然后处理正约束的每个子集 |
 | 空间| (O(n+2^m)) | 筛子和素数列表使用 (O(n))，而子集联合数组使用 (O(2^m)) |

 使用 (n\le10^6)，筛子很容易管理，并且仅 18 个数字的分解可以忽略不计。 指数分量以 (2^{18}=262144) 个子集为界，这对于 Python 来说足够小。 该算法避免了任何指数依赖于百万只兔子的状态空间。 

## 测试用例```python
import sys
import io
from contextlib import redirect_stdout

MOD = 1_000_000_007

def solve():
    input = sys.stdin.readline

    n, m = map(int, input().split())

    fixed = []
    for _ in range(m):
        x, y = map(int, input().split())
        fixed.append((x, y))

    sieve = bytearray(b'\x01') * (n + 1)
    sieve[0] = 0
    if n >= 1:
        sieve[1] = 0

    p = 2
    while p * p <= n:
        if sieve[p]:
            start = p * p
            count = (n - start) // p + 1
            sieve[start:n + 1:p] = b'\x00' * count
        p += 1

    primes = [i for i in range(2, n + 1) if sieve[i]]

    def factor_distinct(x):
        res = []
        for p in primes:
            if p * p > x:
                break
            if x % p == 0:
                res.append(p)
                while x % p == 0:
                    x //= p
            if x == 1:
                break
        if x > 1:
            res.append(x)
        return res

    factorized = []
    forced_zero = set()

    for x, y in fixed:
        factors = factor_distinct(x)
        factorized.append((x, y, factors))
        if y == 0:
            forced_zero.update(factors)

    answer = 1 if all(y == 1 for _, y in fixed) else 0

    positive = []
    impossible = False

    for x, y, factors in factorized:
        if y == 1:
            if x == 1:
                impossible = True
                break
            positive.append(factors)

    if not impossible:
        prime_id = {}
        for factors in positive:
            for p in factors:
                if p not in forced_zero and p not in prime_id:
                    prime_id[p] = len(prime_id)

        masks = []
        for factors in positive:
            mask = 0
            for p in factors:
                if p not in forced_zero:
                    mask |= 1 << prime_id[p]
            masks.append(mask)

        if any(mask == 0 for mask in masks):
            c0 = 0
        else:
            free_primes = len(primes) - len(forced_zero)
            k = len(masks)
            total = 1 << k

            union = [0] * total
            c0 = 0

            for subset in range(1, total):
                bit = subset & -subset
                idx = bit.bit_length() - 1
                union[subset] = union[subset ^ bit] | masks[idx]

            for subset in range(total):
                ways = pow(
                    2,
                    free_primes - union[subset].bit_count(),
                    MOD
                )
                if subset.bit_count() & 1:
                    c0 -= ways
                else:
                    c0 += ways

            c0 %= MOD

        answer = (answer + c0) % MOD

    print(answer)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    out = io.StringIO()
    try:
        with redirect_stdout(out):
            solve()
    finally:
        sys.stdin = old_stdin

    return out.getvalue().strip()

# Provided samples
assert run("""5 2
4 1
2 0
""") == "0", "sample 1"

assert run("""5 2
2 1
3 1
""") == "3", "sample 2"

# Minimum size, f(1) = 0 gives the unique valid coloring.
assert run("""1 1
1 0
""") == "1", "minimum size with zero"

# Minimum size, f(1) = 1 gives the unique all-ones coloring.
assert run("""1 1
1 1
""") == "1", "minimum size with one"

# All prescribed values are zero. Prime 2 is forced to zero,
# while primes 3, 5, and 7 remain arbitrary.
assert run("""10 3
2 0
4 0
8 0
""") == "8", "all-equal zero constraints"

# A positive constraint on 1 is impossible when f(1) = 0,
# while the all-ones coloring remains valid.
assert run("""10 1
1 1
""") == "1", "positive constraint on one"

# Maximum n, boundary factorization at n itself.
# There are 78498 primes <= 1,000,000, and fixing n to zero
# forces exactly primes 2 and 5 to zero.
expected = pow(2, 78498 - 2, MOD)
assert run("""1000000 1
1000000 0
""") == str(expected), "maximum n boundary"

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 / 1 0`|`1`| 尽可能最小的 (n)，正确处理 (1) |
 |`1 1 / 1 1`|`1`| 单独的 (f(1)=1) 着色 |
 |`10 3 / 2 0, 4 0, 8 0`|`8`| 相同强制素数和全零约束的重复倍数 |
 |`10 1 / 1 1`|`1`| (1) 和全 1 情况的正约束 |
 |`1000000 1 / 1000000 0`| (2^{78496}\bmod 10^9+7) | 最大值 (n)、边界分解和大素数 |

 ## 边缘情况

 第一个特殊情况是 (x=1)。 它的素因子集是空的。 如果它被规定为零，它只是固定（f（1）= 0），这与每个独立的原色选择兼容。 例如，```
1 1
1 0
```有一个答案。 该算法不将素数放入`forced_zero`，进入 (f(1)=0) 情况，并计数 (2^0=1) 着色。 

如果(1)被规定为1，则(f(1)=0)的情况是不可能的，因为不存在其颜色可以使(f(1))等于1的素数。 单独的全 1 情况恰好贡献了一个：```
10 1
1 1
```所以答案是（1）。 

第二种情况是零约束，其素因子与正约束重叠。 在```
5 2
4 1
2 0
```零约束迫使素数 (2) 为零。 (4) 的正约束只有素因子 (2)，因此它的掩码变为零。 零掩码意味着相应的 OR 子句永久为假，并且 (f(1)=0) 贡献立即为零。 由于零处方也禁止全一着色，因此最终结果为（0）。 

第三种情况是许多规定的零值包含相同的素数。 为了```
10 3
2 0
4 0
8 0
```所有三个约束仅强制素数 (2) 为零。 素数 (3,5,7) 保持独立，提供 (2^3=8) 有效着色。 该算法将强制素数存储在一个集合中，因此 (2) 的重复出现仅计算一次。 

最后一种情况是最大边界（n=10^6）。 为了```
1000000 1
1000000 0
```因式分解为 (2^6\cdot5^6)，因此只有素数 (2) 和 (5) 被强制为零。 (10^6) 以内的所有其他素数保持独立。 (10^6) 以内有 (78498) 个素数，因此答案是

 [
 2^{78498-2}\bmod 10^9+7。 
]

 该算法从不枚举那些素数分配。 它只需要它们的计数，这正是该解决方案在允许的最大 (n) 下仍然实用的原因。
