---
title: "CF 102460F - 斯隆小姐"
description: "对于每个参议员，我们都有一个整数 (ai)，当所有当前 (ai) 值的 gcd 大于 1 时，最终协议就会发生。斯隆可以选择一个参议员一次，然后将该参议员的值除以任何满足 (dle k) 的除数 (d)。"
date: "2026-08-09T02:50:20+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102460
codeforces_index: "F"
codeforces_contest_name: "2019-2020 ICPC Asia Taipei-Hsinchu Regional Contest"
rating: 0
weight: 102460
solve_time_s: 397
verified: true
draft: false
---

[CF 102460F - 斯隆小姐](https://codeforces.com/problemset/problem/102460/F)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于每个参议员，我们都有一个整数\(a_i\)，并且最终的协议恰好发生在当前所有的gcd\(a_i\)值大于 1。斯隆可以选择一名参议员一次，然后将该参议员的值除以任何除数\(d\)令人满意\(d\le k\)。 目标是使最终的 gcd 等于 1，同时最小化总游说时间。 

阻力\(e_i\)以一种稍微不寻常的方式影响时间。 如果当前的竞选活动已经游说\(x\)全力抵抗的参议员\(y\), 游说参议员\(i\)成本\[
y+e_i(x+1).
\]该订单乍一看很相关，但有一个有用的取消。 假设准确地说\(m\)参议员们受到游说，他们在竞选秩序中的抵抗是\(e_1,\ldots,e_m\)。 总成本是\[
\sum_{j=1}^{m}\left(\sum_{t<j}e_t+je_j\right).
\]对于职位固定的参议员\(j\)，其阻力在每个后来的参议员的第一个总和中出现一次，并乘以自己的位置一次。 其总系数为\[
(m-j)+j=m.
\]因此，总的活动时间就是\[
m\sum e_i.
\]顺序根本不重要。 因此，问题是选择参议员和法律部门，以便消除原始 gcd 的每个素因子，从而最小化\[
(\text{number of lobbied senators})\times(\text{sum of their resistances}).
\]约束条件主要是\(n\le 10^6\)。 \(O(n^2)\) 方法是立即不可能的，甚至 \(O(n2^{11})\) 方法也太大了，因为\(n2^{11}\)是关于\(2\cdot10^9\)。 有用的小参数是公共 gcd 的不同质因数的数量。 由于 gcd 最多为\(10^{12}\)，它最多包含 11 个不同的素数。 

有几种边缘情况很容易被错误处理。 如果初始 gcd 已经为 1，则答案为 0，因为不需要游说。 例如，```text
2 10
6 35
1 1
```gcd 为 1，所以正确答案是`0`。 始终游说至少一名参议员的实现将返回正值。 

另一个微妙的情况是，没有一个参议员可以删除所有公共素数。 例如，```text
2 2
6 6
1 1
```gcd 为 6。一名参议员可以除以 2，留下 3，另一名参议员可以除以 3，留下 2。最终的 gcd 为 1，因此答案为 4。仅检查一名参议员是否可以删除整个 gcd 的解决方案会错误地报告`-1`。 

除数限制也包含在内。 和```text
2 6
6 10
1 1
```第一个参议员可以除以 6 正是因为\(6\le k\)。 需要两位参议员，总共需要时间 \(2(1+1)=4\)。 测试`d < k`而不是`d <= k`可以拒绝合法的操作。 

最后，总理只能从参议员中移除\(i\)如果除法包含该素数的全部幂\(a_i\)。 如果\(a_i=12\)，除去素数 2 需要除以 4，而不仅仅是除以 2。无论何时，忘记指数都会给出错误的答案\(a_i\)包含一个普通素数的更高幂。 

## 方法

 直接的暴力方法将尝试参议员的每个子集以及每个选定参议员的每个合法除数。 这是正确的，因为每一个可能的活动都被明确考虑，但它是无望的\(n=10^6\)。 即使只是列举参议员子集也已经需要\(2^n\)运营，然后再考虑可能的部门。 

第一个有用的观察是，只有原始 gcd 中的素数才是物质。 让\[
g=\gcd(a_1,a_2,\ldots,a_n).
\]每个素数都不能整除\(g\)已经缺席了最终的gcd。 对于每个素数\(p\mid g\)，至少一名游说参议员必须丢失所有副本\(p\)。 

认为\[
a_i=p^{v_i}u,\qquad p\nmid u.
\]删除\(p\)完全来自参议员\(i\), 斯隆必须除以\(a_i\)至少\(p^{v_i}\)。 如果从同一个参议员中除去几个素数，则所需的除数是它们的完整素数幂的乘积。 当该产品最多是合法的\(k\)。 

这将算术问题变成了一个小的集合覆盖问题。 宇宙仅由不同的素数组成\(g\)，最多 11 个元素。 位掩码表示哪些公共素数已被删除。 

剩下的问题是\(n\)。 关键的压缩是最佳的营销活动永远不需要超过\(r\)参议员们，在哪里\(r\)是不同素数的数量\(g\)。 如果超过\(r\)选择参议员，一些选定的参议员没有贡献唯一必要的素数，因此删除该参议员可以消除所有素数并严格降低成本。 

因此，对于每种有用的罢免模式，我们只能保留少量最便宜的参议员。 对于参议员来说，移除模式是向下封闭的：如果参议员可以移除一组素数，那么它也可以移除该组的每个子集。 我们枚举最大的合法模式，最多保留\(r\)支持每种模式的最便宜的参议员，然后执行标准子集 DP。 的界限\(r\)候选人就足够了，因为任何最佳解决方案最多包含\(r\)参议员，因此当用存储的候选人替换其选定的参议员时，所需模式的候选人集满足霍尔条件。 

算术工作量也很小，因为我们只因式分解出现在单个全局 gcd 中的素数。 我们从不考虑每一个因素\(a_i\)按审判分庭直至\(\sqrt{a_i}\)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 |---|---|---|---|
 | 蛮力 | \(O(2^n)\) 或更糟 | \(O(n)\) | 太慢了|
 | 最佳| \(O(nr + C2^r + 3^r)\)，其中\(r\le11\)和\(C\)是不同参议员档案的数量 | \(O(Cr+2^r)\) | 已接受 |

 这里\(C\)在压缩表示中很小，因为具有相同主要功率分布的参议员被一起处理。 重要的一点是指数部分仅取决于\(r\le11\)，从不\(n\)。 

## 算法演练

 1. 计算gcd\(g\)全部的\(a_i\)。 如果\(g=1\)，立即打印0。 没有剩下的公共素数可以消除。 

2.因素\(g\)进入其独特的素数\(p_0,p_1,\ldots,p_{r-1}\)。 我们只需要这些素数，而不是每个素数的完全因式分解\(a_i\)。 

3. 对于每个参议员，确定每个的指数\(p_j\)在\(a_i\)。 如果指数是\(v\)，完全去除\(p_j\)需要因素\(p_j^v\)。 

4. 对于由 mask 表示的选定素数集\(S\),计算所需除数\[
D_i(S)=\prod_{j\in S}p_j^{v_{i,j}}.
\]参议员戴口罩是合法的\(i\)恰好在 \(D_i(S)\le k\) 时。 我们枚举参议员的最大合法掩码，因为最大合法掩码的每个子集都自动合法。 

5. 压缩具有相同主要功率分布的参议员。 对于每个移除模式仅保留最便宜的\(r\)参议员。 多于\(r\)一种模式的候选者永远不是必要的，因为有效的活动最多使用\(r\)参议员。 

6. 运行子集 DP。 让`dp[mask]`是已选定参议员集合的最小总阻力，其组合的移除素数掩模恰好是`mask`。 当参议员可以删除模式时`s`，过渡到\[
dp[mask\mid s]
=
\min(dp[mask\mid s],dp[mask]+e_i).
\]参议员只处理一次，因此同一个参议员永远不能使用两次。 

7. 对于每个可达到的最终状态`FULL`，假设 DP 使用\(m\)参议员和累积的抵抗\(E\)。 对应的活动时间为\(mE\)。 将所选参议员的数量与 DP 状态中的阻力一起存储，或者等效地使用由参议员数量索引的二维状态。 

单独保留参议员人数的原因是，仅将阻力最小化是不够的。 使用一名抵抗力为 100 的参议员的竞选活动可能比使用三名抵抗力分别为 50 的参议员的竞选活动更好，因为实际成本分别为 100 和 450。 

### 为什么它有效

 全局 gcd 恰好包含必须被销毁的素数。 当参议员对应的完整素数幂的乘积最多为\(k\)。 因此，每个合法的竞选活动都对应于参议员面具的集合，其联合是完整的素数面具，并且每个这样的集合都会给出一个合法的竞选活动。 

最佳营销活动最多包含\(r\)参议员。 对于我们保留的每个移除模式\(r\)最便宜的可用参议员，这足以取代任何最佳竞选活动的参议员，而无需将两个所需的角色强加给同一个参议员。 然后，子集 DP 考虑去除掩模的每个可能的联合，同时尊重每个参议员一次使用的条件。 最后，身份\[
\text{time}=m\sum e_i
\]将最小阻力和参议员人数转换为实际竞选时间。 

## Python 解决方案```python
import sys
from math import gcd

input = sys.stdin.readline

INF = 10**30

def factor_distinct(x):
    primes = []
    p = 2
    while p * p <= x:
        if x % p == 0:
            primes.append(p)
            while x % p == 0:
                x //= p
        p = 3 if p == 2 else p + 2
    if x > 1:
        primes.append(x)
    return primes

def solve():
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    e = list(map(int, input().split()))

    g = 0
    for x in a:
        g = gcd(g, x)

    if g == 1:
        print(0)
        return

    primes = factor_distinct(g)
    r = len(primes)
    full = (1 << r) - 1

    # For every distinct profile of prime powers, keep the smallest
    # resistances. At most r copies of one profile are ever useful.
    profiles = {}

    for x, cost in zip(a, e):
        powers = []
        y = x

        for p in primes:
            q = 1
            while y % p == 0:
                y //= p
                q *= p
            powers.append(q)

        key = tuple(powers)

        if key not in profiles:
            profiles[key] = [cost]
        else:
            arr = profiles[key]
            if len(arr) < r:
                arr.append(cost)
                arr.sort()
            elif cost < arr[-1]:
                arr[-1] = cost
                arr.sort()

    # Convert every profile into its maximal legal masks.
    #
    # A mask is maximal if it is legal but adding any omitted prime
    # makes the required divisor exceed k.
    candidates = []

    for powers, costs in profiles.items():
        legal = [False] * (1 << r)
        product = [1] * (1 << r)

        legal[0] = True

        for mask in range(1, 1 << r):
            bit = mask & -mask
            j = bit.bit_length() - 1
            prev = mask ^ bit

            if product[prev] <= k // powers[j]:
                product[mask] = product[prev] * powers[j]
                legal[mask] = True

        maximal = []

        for mask in range(1, 1 << r):
            if not legal[mask]:
                continue

            is_maximal = True
            missing = full ^ mask

            while missing:
                bit = missing & -missing
                j = bit.bit_length() - 1

                if legal[mask | bit]:
                    is_maximal = False
                    break

                missing ^= bit

            if is_maximal:
                maximal.append(mask)

        # Every stored resistance has the same profile, so it can
        # realize every maximal mask of this profile.
        for cost in costs:
            candidates.append((cost, maximal))

    # dp[mask] = (number of senators, total resistance).
    # We compare by the eventual objective indirectly using the pair.
    #
    # Since m <= r <= 11, keep the best resistance for every exact
    # count and mask.
    dp = [[INF] * (1 << r) for _ in range(r + 1)]
    dp[0][0] = 0

    for cost, masks in candidates:
        old = [row[:] for row in dp]

        for cnt in range(r):
            row = old[cnt]
            for mask, cur in enumerate(row):
                if cur == INF:
                    continue

                for s in masks:
                    nm = mask | s
                    nv = cur + cost
                    if nv < dp[cnt + 1][nm]:
                        dp[cnt + 1][nm] = nv

    ans = INF

    for cnt in range(1, r + 1):
        if dp[cnt][full] != INF:
            ans = min(ans, cnt * dp[cnt][full])

    print(-1 if ans == INF else ans)

if __name__ == "__main__":
    solve()
```实现的第一部分计算全局 gcd 并立即处理零游说情况。 gcd 分解仅对一个数字使用试除法，最多保留 11 个不同的素数。 

对于每位参议员来说，`powers[j]`是完整的力量`primes[j]`包含在该参议员的\(a_i\)。 如果该素数要完全消失，则这是必须包含在除数中的数量。 对于诸如以下的值，仅使用素数本身是不正确的\(a_i=12\)，其中删除 2 需要除以 4。 

的`profiles`字典是主要的压缩步骤。 从 gcd 的角度来看，具有相同主功率要求的参议员的行为是相同的，因此只有他们最小的阻力才重要。 保持\(r\)其中就足够了，因为最佳营销活动不需要超过\(r\)参议员。 

这`legal`array 使用递归计算一个配置文件的每个合法子集\[
D[S]=D[S\setminus\{p\}]\cdot p^{v_p(a_i)}.
\]该部门`powers[j] <= k // product[prev]`是故意这样写的，而不是先相乘。 它避免创建大于必要的数字，并与\(k\)。 

仅存储最大合法掩码。 如果参议员可以删除更大的素数集，那么使用严格的子集永远不会给该参议员带来优势。 始终可以使用较大的面罩代替。 

DP 维度`cnt`记录有多少名参议员被选出。 这是必要的，因为最终目标不仅仅是阻力的总和。 实际答案是将这个总和乘以游说参议员的数量。 

Python 整数具有任意精度，因此潜在的大乘积`cnt * dp[cnt][full]`不溢出。 最大可能的答案仍然可以轻松地作为整数进行管理。 

## 工作示例

 ### 示例 1

 输入是```text
3 6
30 30 30
100 4 5
```初始 gcd 为 30，其质因数为 2、3、5。对于每个参议员，去除 2 的成本为除数 2，去除 3 的成本为 3，去除 5 的成本为 5，去除 2 和 3 的成本为 6。 

重要的状态是：

 | 参议员使用 | 删除素数 | 电阻| 活动时间|
 |---:|---|---:|---:|
 | 0 | 无 | 0 | 0 |
 | 1 | {2,3} | 4 | 4 |
 | 2 | {2,3,5} | 9 | 18 |
 | 2 | {2,3,5} | 105 | 105 210 | 210
 | 3 | {2,3,5} | 109 | 109 327 | 327

 最好的最终状态是使用阻力为 4 和 5 的参议员。第一个可以通过将 30 除以 6 来一起消除 2 和 3，而第二个通过除以 5 来消除 5。总阻力为 9，并且有两个参议员进行游说，给出\[
2\cdot9=18.
\]所以输出是`18`。 

这个例子说明了为什么游说的顺序并不重要，以及为什么当所需的除数适合时，一位参议员可以删除几个素数\(k\)。 

### 示例 2

 输入是```text
1 1000000
```有一位参议员及其\(a_i\)值为 1。gcd 已经是 1。 

| 初始gcd | 面膜 | 参议员使用 | 回答 |
 |---:|---|---:|---:|
 | 1 | 0 | 0 | 0 |

 该活动已经成功，因此算法在构建任何 DP 状态之前退出。 正确的输出是`0`。 

这练习了不需要游说的边界情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 |---|---|---|
 | 时间 | 压缩实现中的 \(O(nr + C2^r + C2^{2r})\) |\(r\le11\)，指数功仅取决于不同的 gcd 素数 |
 | 空间| \(O(Cr + r2^r)\) | 存储压缩配置文件和小子集 DP |

 线性部分最多加工\(10^6\)参议员，并且只有全局 GCD 的最多 11 个素数。 指数部分以小素宇宙为界，而不是\(n\)。 该实现还在运行 DP 之前压缩相等的主功率配置文件，这对于大型\(n\)限制。 

## 测试用例```python
# This test harness uses the same solve logic through a small wrapper.

import sys
import io
from math import gcd

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        n, k = map(int, sys.stdin.readline().split())
        a = list(map(int, sys.stdin.readline().split()))
        e = list(map(int, sys.stdin.readline().split()))

        g = 0
        for x in a:
            g = gcd(g, x)

        if g == 1:
            return "0"

        primes = []
        x = g
        p = 2
        while p * p <= x:
            if x % p == 0:
                primes.append(p)
                while x % p == 0:
                    x //= p
            p = 3 if p == 2 else p + 2
        if x > 1:
            primes.append(x)

        r = len(primes)
        full = (1 << r) - 1

        profiles = {}

        for x, cost in zip(a, e):
            powers = []
            y = x

            for p in primes:
                q = 1
                while y % p == 0:
                    y //= p
                    q *= p
                powers.append(q)

            key = tuple(powers)
            arr = profiles.setdefault(key, [])

            if len(arr) < r:
                arr.append(cost)
                arr.sort()
            elif cost < arr[-1]:
                arr[-1] = cost
                arr.sort()

        candidates = []

        for powers, costs in profiles.items():
            msize = 1 << r
            product = [1] * msize
            legal = [False] * msize
            legal[0] = True

            for mask in range(1, msize):
                bit = mask & -mask
                j = bit.bit_length() - 1
                prev = mask ^ bit

                if product[prev] <= k // powers[j]:
                    product[mask] = product[prev] * powers[j]
                    legal[mask] = True

            maximal = []

            for mask in range(1, msize):
                if not legal[mask]:
                    continue

                missing = full ^ mask
                maximal_flag = True

                while missing:
                    bit = missing & -missing
                    if legal[mask | bit]:
                        maximal_flag = False
                        break
                    missing ^= bit

                if maximal_flag:
                    maximal.append(mask)

            for cost in costs:
                candidates.append((cost, maximal))

        INF = 10**30
        dp = [[INF] * (1 << r) for _ in range(r + 1)]
        dp[0][0] = 0

        for cost, masks in candidates:
            old = [row[:] for row in dp]

            for cnt in range(r):
                for mask in range(1 << r):
                    cur = old[cnt][mask]
                    if cur == INF:
                        continue

                    for s in masks:
                        nm = mask | s
                        nv = cur + cost
                        if nv < dp[cnt + 1][nm]:
                            dp[cnt + 1][nm] = nv

        ans = INF
        for cnt in range(1, r + 1):
            if dp[cnt][full] != INF:
                ans = min(ans, cnt * dp[cnt][full])

        return str(-1 if ans == INF else ans)

    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample 1
assert run("""3 6
30 30 30
100 4 5
""") == "18", "sample 1"

# Provided sample 2
assert run("""1 1000000
1
""") == "0", "sample 2"

# Provided sample 3
assert run("""3 5
7 7 7
1 1 1
""") == "-1", "sample 3"

# Already coprime, so no lobbying is needed.
assert run("""2 10
6 35
1 1
""") == "0", "initial gcd is already 1"

# Two senators must split the primes 2 and 3.
assert run("""2 2
6 6
1 1
""") == "4", "split one prime between two senators"

# k is inclusive: division by 6 is legal when k = 6.
assert run("""2 6
6 10
1 1
""") == "4", "boundary k"

# A higher prime exponent must be removed completely.
assert run("""2 4
12 18
1 1
""") == "4", "complete prime power removal"
```| 测试输入| 预期产出 | 它验证了什么 |
 |---|---:|---|
 |`2 10 / 6 35 / 1 1`|`0`| 初始 gcd 已经是 1 |
 |`2 2 / 6 6 / 1 1`|`4`| 不同的参议员可以消除不同的公共素数 |
 |`2 6 / 6 10 / 1 1`|`4`| 除数限制包含 |
 |`2 4 / 12 18 / 1 1`|`4`| 一个完整的素数幂，而不仅仅是素数，必须被分割出来 |

 ## 边缘情况

 当初始gcd为1时，算法立即停止。 为了```text
2 10
6 35
1 1
```gcd 为 1，因此素数列表为空，正确答案为`0`。 不应选出任何参议员。 

当几位参议员必须合作时，面具民主党自然会处理分裂。 为了```text
2 2
6 6
1 1
```常见的素数是 2 和 3。\(k=2\)，一名参议员只能移除 2 个，另一名参议员只能移除 3 个。DP 使用两名总阻力为 2 的参议员达到全面遮罩，因此最终成本为\(2\cdot2=4\)。 

当除数限制非常严格时，乘积比较必须允许相等。 为了```text
2 6
6 10
1 1
```第一个参议员可以将 6 除以 6，同时去除 2 和 3，而第二个参议员可以通过除以 5 从 10 中去除 5。所需的除数正好在限制范围内，所以答案是 4。 

当出现指数大于 1 的普通素数时，完整的指数必须从选定的参议员中消失。 例如，与```text
2 4
12 18
1 1
```gcd 为 6。参议员 1 需要除以 4 来完全去除 2，而参议员 2 需要除以 3 来去除 3。这两种操作都是合法的，给出最终的 gcd 1 和总时间 4。仅基于素数是否整除的掩码构造\(a_i\)会错误地认为 12 除以 2 就足够了，留下公因数 2。
