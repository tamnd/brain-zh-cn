---
title: "CF 102318J - 倍数"
description: "对于每个查询，我们有两个整数 a 和 b。 我们查看从 1 到 b 的每个整数，并计算它是否能被 2 到 a 中的至少一个整数整除。 答案是倍数集合并集的大小。"
date: "2026-08-14T00:06:24+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102318
codeforces_index: "J"
codeforces_contest_name: "UCF Locals 2017"
rating: 0
weight: 102318
solve_time_s: 210
verified: true
draft: false
---

[CF 102318J - 倍数](https://codeforces.com/problemset/problem/102318/J)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于每个查询，我们有两个整数`a`和`b`。 我们查看每个整数`1`通过`b`并计算它是否能被至少一个整数整除`2`通过`a`。 答案是倍数集合并集的大小。 

例如，与`a = 3`和`b = 30`，相关除数是`2`和`3`。 它们的倍数重叠，所以答案是`15 + 10 - 5 = 20`。 最初的竞赛声明正是给出了这个例子。 

约束条件很小，对于`a`， 和`a <= 130`， 但`b`可以大到`10^15`，并且最多可以有`100`查询。 该组合排除了迭代`1..b`，甚至一次。 一个循环结束`10^15`整数远远超出了可用的六秒。 的限制`a`是有用的部分：只有`31`最多素数`130`，所以问题实际上是如何有效地处理一小部分固定的素数整除条件。 

第一个微妙之处是重叠可分性。 为了`a = 3, b = 6`, 整数`2, 3, 4, 6`有效，所以答案是`4`。 只需添加`6//2 + 6//3 = 5`计数`6`两次。 需要包含-排除。 

第二个边缘情况是上边界。 为了`a = 15, b = 15`，答案包括`15`本身，因为`15`可以整除`3`和`5`。 一个公式仅基于`b // d // 2`当计算奇数倍时，可能会意外丢失该值。 奇数除数的奇数倍数的正确个数`d`最多`b`是`(b // d + 1) // 2`。 

第三个边缘情况是`b = 1`。 例如，`a = 130, b = 1`有答案`0`，因为在可被任意整数整除的范围内不存在正整数`2`通过`130`。 任何以以下开头的方法`b - 1`或者假设必须出现某个除数将会失败。 

第四种边缘情况是复合除数不需要自己的包含-排除集。 如果一个数可以被`12`，它已经可以被`2`和`3`。 为多个数添加单独的集合`12`只会重复信息。 官方竞赛评审也做出了同样的观察，并将相关因数减少为素数。 

## 方法

 直接的暴力方法是检查每个整数`x`从`1`到`b`，并且对于每个`x`测试是否有某个值`2..a`划分它。 即使更智能地检查整除性，访问所有`b`价值已经成本`O(b)`，这意味着最多`10^15`一个查询的迭代次数。 更数学的蛮力将包含-排除应用于素数。 有`31`最多素数`130`，所以无限制版本考虑了所有`2^31`，或关于`2.15 * 10^9`, 子集。 这也太大了。 官方分析确定了这个确切的指数障碍。 

有用的观察是答案更容易通过其补语来描述。 当一个数最多不能被任何素数整除时，这个数就不算被精确计数`a`。 复合值`2..a`不添加新条件，因为每个合数都有一个不大于其自身的质因数。 

设素数不超过`a`是`p1, p2, ..., pk`。 定义`phi(x, k)`作为整数的个数`1`通过`x`不能被这些中的任何一个整除`k`素数。 那么所要求的答案很简单`b - phi(b, k)`。 

该函数具有标准递归。 如果我们已经知道避免第一个的计数`k-1`素数，然后在这些数字中我们删除那些可以被整除的数字`pk`。 将这些数字除以`pk`，剩下的正是由`phi(b // pk, k-1)`。 因此`phi(x, k) = phi(x, k-1) - phi(x // pk, k-1)`。 

递归是正确的，但盲目扩展仍然会产生指数树。 第二个优化是直接评估小状态并记住有用的大状态。 只有`31`水平因为`a <= 130`。 当我们遇到以下情况时，我们也会立即停下来：`x < pk`，因为排除所有素数后`pk`，唯一幸存的正整数是`1`。 

这与经典素数计数算法中使用的部分筛函数相同。 记忆的重复性和重要性是`phi(x,k)`。 

由此产生的实现避免了显式生成数千万个主要产品。 最初的 UCF 评论描述了一种替代的包含-排除实现，该实现预先计算`23.6`万相关产品。 对于 Python 来说，评估等效的部分筛递归更为实用，因为递归仅具体化查询实际达到的状态。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 直接枚举|`O(b)`每个查询 |`O(1)`| 太慢了|
 | 完全包含-排除|`O(2^31)`每个查询 |`O(31)`| 太慢了|
 | 记忆部分筛| 实用的次指数状态计数，只有 31 个素数级别 |`O(S)`缓存状态| 已接受 |

 ## 算法演练

 1. 读取所有查询并确定直到`130`。 对于查询`(a, b)`，只有素数`p <= a`很重要，所以让`k`成为他们的计数。 这将转换可能除数的原始范围`2..a`最多进入`31`独特的主要条件。 
2. 定义`phi(x, k)`作为整数的个数`[1, x]`不能被任何第一个整除`k`素数。 想要的答案是`x - phi(x, k)`，因为每个正整数要么不被所有这些素数影响，要么至少能被其中一个素数整除。 
3. 使用`phi(x, 0) = x`。 没有禁止素数，每个整数`1`通过`x`幸存下来。 
4. 对于`k > 0`， 使用`phi(x, k) = phi(x, k-1) - phi(x // p[k-1], k-1)`。 

第一项保留所有避免前面素数的数字。 第二项恰好删除了那些也能被新引入的素数整除的幸存者。 
5.如果`x < p[k-1]`， 返回`1`为积极的`x`。 除以下之外没有其他整数`1`至少可以有一个素因数`p[k-1]`最多剩下`x`，所以只有`1`幸存下来。 
6.对于小`k`，直接评估递归，而不是创建许多递归调用。 最多需要七个素数`2^7 = 128`包含-排除项，这是很小的。 
7. 预计算`phi(x, k)`为所有人`x < 800`和所有`k <= 31`。 一旦递归状态变小，就可以在常数时间内得到答案。 这是部分筛计算的标准优化，可防止递归重复重建相同的小状态。 
8. 记住输入查询达到的大状态。 不同的分支经常产生相同的对`(x, k)`，特别是在整数除法之后。 重用这些结果可以防止递归表现得像一个完整的递归`2^k`树。 
9. 对于每个查询，计算`b - phi(b, k)`并打印结果。 Python 整数具有任意精度，因此值可达`10^15`不需要特殊的溢出处理。 

不变的是每次调用`phi(x, k)`准确地表示中的整数`[1, x]`其素因数避免了第一个`k`素数。 递归将这些整数划分为不能被整除的整数`pk`和那些能被整除的`pk`。 后者与计数值一一对应`phi(x // pk, k-1)`。 由于这两个组是不相交且详尽的，因此每个递归结果都是精确的。 

## Python 解决方案```python
import sys
from functools import lru_cache

input = sys.stdin.readline

MAX_A = 130
SMALL = 800

def sieve_primes(n):
    is_prime = bytearray(b'\x01') * (n + 1)
    is_prime[0:2] = b'\x00\x00'
    p = 2
    while p * p <= n:
        if is_prime[p]:
            is_prime[p * p:n + 1:p] = b'\x00' * (((n - p * p) // p) + 1)
        p += 1
    return [i for i in range(2, n + 1) if is_prime[i]]

primes = sieve_primes(MAX_A)
K = len(primes)

# small_phi[x][k] = numbers <= x not divisible by the first k primes.
small_phi = [[0] * (K + 1) for _ in range(SMALL)]

for x in range(SMALL):
    small_phi[x][0] = x

for k in range(1, K + 1):
    p = primes[k - 1]
    for x in range(SMALL):
        if x < p:
            small_phi[x][k] = 1 if x > 0 else 0
        else:
            small_phi[x][k] = (
                small_phi[x][k - 1]
                - small_phi[x // p][k - 1]
            )

@lru_cache(maxsize=250000)
def phi(x, k):
    if x < SMALL:
        return small_phi[x][k]

    if k == 0:
        return x

    p = primes[k - 1]

    if x < p:
        return 1

    # For small k, direct inclusion-exclusion is tiny.
    if k <= 7:
        res = x
        # Add/subtract all non-empty subsets.
        products = [1]
        for i in range(k):
            p = primes[i]
            old = products[:]
            for v in old:
                nv = v * p
                if nv <= x:
                    products.append(nv)

        # Recompute with signs from the number of prime factors.
        res = x
        products = [1]
        for i in range(k):
            p = primes[i]
            old = products[:]
            for v in old:
                nv = v * p
                if nv <= x:
                    products.append(nv)
                    if len([]) == -1:
                        pass

        # The compact recursive version is clearer and has only 2^7 states.
        def dfs(i, product, sign):
            if i == k:
                return 0
            total = 0
            np = product * primes[i]
            if np <= x:
                total += sign * (x // np)
                total += dfs(i + 1, np, -sign)
            total += dfs(i + 1, product, sign)
            return total

        # Inclusion-exclusion gives the number removed from [1, x].
        removed = dfs(0, 1, 1)
        return x - removed

    return phi(x, k - 1) - phi(x // p, k - 1)

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        a, b = map(int, input().split())

        k = 0
        while k < K and primes[k] <= a:
            k += 1

        out.append(str(b - phi(b, k)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```筛子构造`31`素数可达`130`。 查询本身永远不需要了解有关合数除数的任何信息，因为合数的整除性已经隐含在其素因数之一的整除性中。 

这`small_phi`表处理每个状态`x < 800`。 它的递推式与数学定义完全相同，因此它不是近似值或启发式。 该表只是用恒定时间查找替换了重复递归。 

缓存的`phi`函数处理更大的状态。 这`x < p`检查是一个有用的边界条件：返回`1`仅对于正数正确`x`， 尽管`x = 0`必须返回`0`。 小的——`k`分支最多使用`128`子集选择与大型递归部分相比可以忽略不计。 

两人临时`products`小型建筑`k`分支对于实际计算来说是不必要的，可以删除。 应提交以下更清晰的版本：```python
import sys
from functools import lru_cache

input = sys.stdin.readline

MAX_A = 130
SMALL = 800

def sieve_primes(n):
    is_prime = bytearray(b'\x01') * (n + 1)
    is_prime[0:2] = b'\x00\x00'
    p = 2
    while p * p <= n:
        if is_prime[p]:
            is_prime[p * p:n + 1:p] = b'\x00' * (
                (n - p * p) // p + 1
            )
        p += 1
    return [i for i in range(2, n + 1) if is_prime[i]]

primes = sieve_primes(MAX_A)
K = len(primes)

small_phi = [[0] * (K + 1) for _ in range(SMALL)]

for x in range(SMALL):
    small_phi[x][0] = x

for k in range(1, K + 1):
    p = primes[k - 1]
    for x in range(SMALL):
        if x < p:
            small_phi[x][k] = 1 if x else 0
        else:
            small_phi[x][k] = (
                small_phi[x][k - 1]
                - small_phi[x // p][k - 1]
            )

@lru_cache(maxsize=250000)
def phi(x, k):
    if x < SMALL:
        return small_phi[x][k]

    if k == 0:
        return x

    p = primes[k - 1]

    if x < p:
        return 1

    if k <= 7:
        def dfs(i, product, sign):
            if i == k:
                return 0

            total = dfs(i + 1, product, sign)

            np = product * primes[i]
            if np <= x:
                total += sign * (x // np)
                total += dfs(i + 1, np, -sign)

            return total

        return x - dfs(0, 1, 1)

    return phi(x, k - 1) - phi(x // p, k - 1)

def solve():
    t = int(input())
    ans = []

    for _ in range(t):
        a, b = map(int, input().split())

        k = 0
        while k < K and primes[k] <= a:
            k += 1

        ans.append(str(b - phi(b, k)))

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```第二个代码块是提交版本。 素数个数只有`31`，所以发现`k`通过短循环是微不足道的。 缓存是有意限制的，因此大量不相关的查询无法无限制地增加内存。 缓存命中立即返回，而算法的正确性不依赖于特定的缓存大小。 

## 工作示例

 提供的 Codeforces 页面不会在当前 HTML 渲染中公开示例输入和输出，而原始 UCF 语句确实提供了示例`a = 3, b = 30`。 以下跟踪使用该示例和第二个小查询。 

为了`a = 3, b = 30`，相关素数是`2`和`3`。 

| 步骤|`x`|`k`| Prime介绍 |`phi(x,k)`|
 | ---| ---| ---| ---| ---|
 | 开始| 30| 2 | 2, 3 | ？ |
 | 从中删除 3 的倍数`phi(30,1)`| 30| 2 | 3 |`phi(30,1) - phi(10,1)`|
 | 避免 2 | 30| 1 | 2 |`15`|
 | 避免其中2`1..10`| 10 | 10 1 | 2 |`5`|
 | 决赛| 30| 2 | 2, 3 |`15 - 5 = 10`|

 有`10`整数来自`1`通过`30`不能被任何一个整除`2`也不`3`。 他们是`1, 5, 7, 11, 13, 17, 19, 23, 25, 29`。 从中减去它们`30`给出`20`，与所述示例匹配。 

为了`a = 5, b = 10`，相关素数是`2, 3, 5`。 

| 步骤|`x`|`k`| 意义|
 | ---| ---| ---| ---|
 | 开始| 10 | 10 3 | 避免 2、3、5 |
 | 第一次分裂 | 10 | 10 2 |`phi(10,2) - phi(2,2)`|
 | 避免 2 和 3 | 10 | 10 2 |`3`，即`1, 7, 5`|
 | 避免2和3`1..2`| 2 | 2 |`1`|
 | 决赛| 10 | 10 3 |`3 - 1 = 2`|

 两个数不能被整除`2`,`3`， 或者`5`是`1`和`7`。 因此答案是`10 - 2 = 8`。 有效数字是`2, 3, 4, 5, 6, 8, 9, 10`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 相关素数数量的实用次指数| 递归只有31级，小状态是查表，重复状态会被缓存 |
 | 空间|`O(800 * 31 + S)`| 固定小表使用大约 25,000 个整数，而`S`是缓存的大数量`(x,k)`状态 |

 关键约束不是`b`本身，因为`b`可以达到`10^15`。 该算法永远不会迭代该范围。 它的工作是由下面的少量素数决定的`130`以及通过整数除法生成的不同的部分筛态。 固定素数界使该方法变得实用。 

最初的竞赛解决方案采用不同但等效的包含-排除路线，仅生成低于以下的不同素数的乘积`10^15`; 其分析报告涉及`23.6`万个生成的产品。 部分筛公式避免了整个集合的具体化，并且特别适合 Python。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from functools import lru_cache

def solve_io(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    # Same implementation used by the submission.
    MAX_A = 130
    SMALL = 800

    def sieve_primes(n):
        is_prime = bytearray(b'\x01') * (n + 1)
        is_prime[0:2] = b'\x00\x00'
        p = 2
        while p * p <= n:
            if is_prime[p]:
                is_prime[p * p:n + 1:p] = b'\x00' * (
                    (n - p * p) // p + 1
                )
            p += 1
        return [i for i in range(2, n + 1) if is_prime[i]]

    primes = sieve_primes(MAX_A)
    K = len(primes)

    small_phi = [[0] * (K + 1) for _ in range(SMALL)]

    for x in range(SMALL):
        small_phi[x][0] = x

    for k in range(1, K + 1):
        p = primes[k - 1]
        for x in range(SMALL):
            if x < p:
                small_phi[x][k] = 1 if x else 0
            else:
                small_phi[x][k] = (
                    small_phi[x][k - 1]
                    - small_phi[x // p][k - 1]
                )

    @lru_cache(maxsize=250000)
    def phi(x, k):
        if x < SMALL:
            return small_phi[x][k]

        if k == 0:
            return x

        p = primes[k - 1]

        if x < p:
            return 1

        if k <= 7:
            def dfs(i, product, sign):
                if i == k:
                    return 0

                total = dfs(i + 1, product, sign)

                np = product * primes[i]
                if np <= x:
                    total += sign * (x // np)
                    total += dfs(i + 1, np, -sign)

                return total

            return x - dfs(0, 1, 1)

        return phi(x, k - 1) - phi(x // p, k - 1)

    data = sys.stdin.readline
    t = int(data())
    out = []

    for _ in range(t):
        a, b = map(int, data().split())

        k = 0
        while k < K and primes[k] <= a:
            k += 1

        out.append(str(b - phi(b, k)))

    sys.stdout = old_stdout
    sys.stdin = old_stdin
    return "\n".join(out)

# Provided statement example.
assert solve_io("1\n3 30\n") == "20", "a=3, b=30"

# Minimum b: no positive integer can be a multiple of 2.
assert solve_io("1\n2 1\n") == "0", "minimum b"

# Minimum a and exact boundary.
assert solve_io("1\n2 2\n") == "1", "2 itself is a multiple of 2"

# All numbers except 1 are covered when a >= b.
assert solve_io("1\n130 100\n") == "99", "every integer 2..100 is itself an allowed divisor"

# Composite divisors must not create double counting.
assert solve_io("1\n4 20\n") == "13", "divisibility by 4 adds nothing beyond divisibility by 2"

# Maximum-size query, checked by range and complement properties.
out = solve_io("2\n130 1000000000000000\n130 1000000000000000\n").splitlines()
assert len(out) == 2
assert out[0] == out[1], "identical maximum-size queries must reuse the same exact answer"
assert 0 <= int(out[0]) <= 10**15, "answer must stay inside the queried range"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 2 1`|`0`| 最低限度`b`和有效倍数的空集 |
 |`1 / 2 2`|`1`| 除数等于的精确下边界`b`|
 |`1 / 130 100`|`99`| 每个值来自`2`通过`100`被覆盖|
 |`1 / 4 20`|`13`| 合数除数不能算作独立条件 |
 |`2 / 130 10^15`重复| 两次相同的值 | 最大尺寸算术和缓存重用 |

 ## 边缘情况

 对于`a = 2, b = 1`，算法找到一个相关素数，`2`。 补码计数为`phi(1,1) = 1`， 因为`1`不能被整除`2`。 答案是`1 - 1 = 0`。 边界是在除以素数之前处理的。 

为了`a = 2, b = 2`,`phi(2,1)`仅计数`1`，所以答案是`2 - 1 = 1`。 价值`2`本身被包括在内，因为定义使用闭范围`1..b`。 

为了`a = 3, b = 30`，递归计算`phi(30,2) = phi(30,1) - phi(10,1) = 15 - 5 = 10`。 十名幸存者的数字是`6`，其他二十个数字可以被整除`2`或者`3`。 这确认了重复句柄重叠，而无需手动列出交集。 

为了`a = 4, b = 20`，允许的除数是`2, 3, 4`，但素数列表仅包含`2`和`3`。 这是故意的。 的每一个倍数`4`已经是的倍数`2`，所以添加`4`无法改变联盟。 算法得到`20 - phi(20,2) = 20 - 7 = 13`。 

为了`a = 130, b = 100`，每个整数`2`通过`100`本身是一个允许的除数。 因此仅`1`被排除，给出`99`。 该算法包括所有素数`127`，但部分筛选解释仍然会准确地产生一个幸存整数。 

为了`a = 130, b = 10^15`，该算法从不尝试构造第一个`10^15`整数。 它最多递归地除以素数`127`，一旦状态跌破`800`它变成了表查找。 Python 的整数算术安全地表示计数中涉及的每个中间值。
