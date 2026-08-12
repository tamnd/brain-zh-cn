---
title: "CF 102373D - 好的子集"
description: "我们有一个由 (n) 个正整数组成的数组。 我们可以选择其元素的任何子集，并且当所有选定值的最大公约数大于（1）时，该子集被认为是好的。 任务是找到这样一个子集中元素的最大可能数量。"
date: "2026-08-12T22:55:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102373
codeforces_index: "D"
codeforces_contest_name: "\u0426\u0438\u043a\u043b \u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434 \u0434\u043b\u044f \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432, \u0421\u0435\u0437\u043e\u043d 2019-2020, \u041f\u0435\u0440\u0432\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430"
rating: 0
weight: 102373
solve_time_s: 206
verified: false
draft: false
---

[CF 102373D - 良好子集](https://codeforces.com/problemset/problem/102373/D)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 26s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个由 (n) 个正整数组成的数组。 我们可以选择其元素的任何子集，并且当所有选定值的最大公约数大于（1）时，该子集被认为是好的。 任务是找到这样一个子集中元素的最大可能数量。 

gcd 的关键属性给出了更有用的解释。 当一组数字至少共享一个素数时，其 gcd 大于 (1)。 因此，我们不用考虑任意子集，而是可以问一个更简单的问题：最大数量的数组元素以 (p) 作为除数的素数 (p) 是哪个？ 答案是最大频率。 

(n)的值只有(1000)，但每个(a_i)可以大到(10^{18})。 小 (n) 排除了子集的指数枚举，但大值是更微妙的约束。 通过尝试每个整数到其平方根来分解数字，对于 (10^{18}) 附近的单个输入值最多需要 (10^9) 次试除法，这在 Python 中太昂贵了。 我们需要一种能够有效处理 64 位整数的整数分解方法，这自然会导致 Miller-Rabin 素性测试与 Pollard-Rho 分解相结合。 

有几种边缘情况可能会破坏更简单的实现。 如果每个值都相等，例如```
3
2 2 2
```答案是 (3)，因为所有三个值共享素因数 (2)。 仅查找对然后计算不同 gcd 值的实现很容易错误地处理重复值。 

单元素输入，例如```
1
35
```有答案（1）。 单元素子集的 gcd 是元素本身，每个输入值至少为 (2)。 将答案初始化为零并仅在找到两个不同元素之间的公因数后才更新它的实现将错误地返回零。 

另一个重要的情况是，成对最大公约数不会自动定义整个组的一个公因子。 为了```
3
6 10 15
```每对的 gcd 都大于 (1)，但所有三个数字的 gcd 均为 (1)。 正确答案是 (2)，因为共享一个素数的最大群是 ({6,10})、共享 (2) 或 ({6,15})、共享 (3)。 如果粗心的解决方案对图中的连通分量进行计数（其中边代表 gcd 大于 (1)），则会错误地返回 (3)。 

最后，一个数字可以有很大的质因数。 例如，```
2
1000000007 1000000009
```包含接近 (10^9) 的大素数，更一般地，约束允许接近 (10^{18}) 的素数值。 假定很快就能找到小因素的试划分实现可能会超时。 

## 方法

 最直接的强力解决方案考虑 (n) 数组元素的每个子集。 对于每个子集，它计算所有选定元素的 gcd，并保留 gcd 大于 (1) 的最大子集。 这是正确的，因为每个可能的候选子集​​都被显式检查。 然而，有 (2^n) 个子集，计算多达 (n) 个元素的 gcd 成本为 (O(n\log A))，其中 (A) 是最大的数组值。 对于（n=1000），最坏的情况是（1000\cdot2^{1000}\log A）次gcd运算，这是完全不可行的。 

蛮力之所以有效，是因为好的子集的定义很简单，但它花费了几乎所有的精力来区分实际上具有相同的好的子集的根本原因的子集。 如果几个数字具有素因数 (p)，则由这些数字组成的每个子集的 gcd 可被 (p) 整除。 我们不需要单独检查这些子集。 

关键的观察是，当存在素数除以所选子集中的每个数字时，gcd 大于 (1)。 对于任何素数 (p)，其 gcd 可被 (p) 整除的最大子集由可被 (p) 整除的每个输入数组成。 添加另一个可被 (p) 整除的数字永远不会使 gcd 失去 (p)，因此没有理由忽略这样的元素。 

因此，如果我们将每个 (a_i) 分解为其不同的素数因子，我们就可以维持每个素数的频率。 最终的答案就是最大的频率。 

剩下的挑战是对 (10^{18}) 大的数字进行因式分解。 试除到 (\sqrt{a_i}) 太慢，因此最佳实现使用确定性 Miller-Rabin 对 64 位整数进行素性测试，并使用 Pollard-Rho 来分割合数。 Pollard-Rho 递归地因式分解每个输入值，并且仅对每个数组元素计算不同的质因数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(2^n n\log A)) | (O(n)) | (O(n)) | 太慢了|
 | 最佳 | 64 位分解的预期 (O(n\cdot C_{64})) | (O(n+\log A)) | 已接受 |

 这里 (C_{64}) 表示使用 Pollard-Rho 分解一个 64 位整数的预期成本。 它的运行时间是概率性的，但 Miller-Rabin 使用一组足以满足所有 64 位整数的确定性基数。 

## 算法演练

 1.读取(n)个值并创建一个映射`count`从素数因子到包含该素数的数组元素的数量。 
2. 对于每个值 (x)，使用 Miller-Rabin 和 Pollard-Rho 将其完全分解为其素因数。 我们只保留 (x) 的不同质因数，因为包含 (p^2) 的元素应该对可被 (p) 整除的元素数量恰好贡献一次。 
3. 对于 (x) 的每个不同质因数 (p)，增量`count[p]`。 这表示可以使用 (p) 作为迄今为止处理的元素中的公约数的最大子集的大小。 
4. 处理完所有数字后，返回其中的最大值`count`。 如果素数 (p) 恰好出现在 (k) 个输入元素中，则这些 (k) 个元素的 gcd 可被 (p) 整除，因此它们形成大小 (k) 的有效子集。 
5. 如果 (n=1)，因式分解仍能找到至少一个素因子，因为每个输入值至少为 (2)。 它的频率是（1），无需特殊情况即可给出正确答案。 

### 为什么它有效

 对于每个好的子集，其 gcd (g) 都大于 (1)，因此 (g) 至少有一个素因数 (p)。 该质数除掉子集的每个元素。 因此，每个大小为 (k) 的好子集都包含在可被某个素数 (p) 整除的输入元素集合中，这意味着算法的最大频率至少为 (k)。 

相反，如果素数 (p) 整除 (k) 个输入元素，则这 (k) 个元素的 gcd 可被 (p) 整除，因此它大于 (1)。 它们形成大小 (k) 的有效子集。 因此，最大主频本身是可以实现的。 两个方向都准确地给出了所需的最佳值。 

## Python 解决方案```python
import sys
import random
import math

input = sys.stdin.readline

random.seed(0xC0FFEE)

SMALL_PRIMES = (
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37
)

MR_BASES = (
    2, 325, 9375, 28178, 450775, 9780504, 1795265022
)

def is_prime(n):
    if n < 2:
        return False

    for p in SMALL_PRIMES:
        if n % p == 0:
            return n == p

    d = n - 1
    s = 0
    while d % 2 == 0:
        s += 1
        d //= 2

    for a in MR_BASES:
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

def factor(n, result):
    if n == 1:
        return

    if is_prime(n):
        result.add(n)
        return

    d = pollard_rho(n)
    factor(d, result)
    factor(n // d, result)

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    count = {}

    for x in a:
        primes = set()
        factor(x, primes)

        for p in primes:
            count[p] = count.get(p, 0) + 1

    print(max(count.values()))

if __name__ == "__main__":
    solve()
```

`is_prime`首先删除小型优质案例，因为它们便宜并且也使 Pollard-Rho 的工作更容易。 对于剩余值，它将 (n-1) 写为 (d\cdot2^s) 并使用标准七个基数执行 Miller-Rabin，为每个无符号 64 位整数提供确定性素数测试。`pollard_rho`使用伪随机迭代 (f(x)=x^2+c\pmod n) 搜索重要因子。 Floyd 的循环检测将一个序列值前进一次，再前进两次，然后取它们与 (n) 之差的 gcd。 当该 gcd 成为一个非平凡除数时，递归可以分割该数字。 

递归`factor`当 Miller-Rabin 证明其参数为素数时，函数立即停止。 否则 Pollard-Rho 提供一个除数，并且两个部分都被递归分解。 结果存储在`set`，这很重要，因为最终统计量计算的是包含素数的数组元素，而不是该素数的总指数。 

Python 整数具有任意精度，因此最大 (10^{18}) 的值以及模算术使用的乘积不会溢出。 表达式`x * x % n`出于同样的原因也很安全。 

米勒-拉宾碱基是固定的而不是随机生成的。 这很重要，因为它使素性测试在整个输入范围内具有确定性。 Pollard-Rho 本身仍然是随机的，这使得它在困难的复合输入上具有良好的预期性能。 

## 工作示例

 对于示例 1，输入为`6 15 10 42`。 因式分解和频率状态演变如下。 

| 当前值| 不同的质因数 | 频率状态| 当前答案 |
 | ---| ---| ---| ---|
 | 6 | 2, 3 | 2:1、3:1 | 1 |
 | 15 | 15 3, 5 | 2:1、3:2、5:1 | 2 |
 | 10 | 10 2, 5 | 2:2、3:2、5:2 | 2 |
 | 42 | 42 2、3、7 | 2:3、3:3、5:2、7:1 | 3 |

 最大频率为(3)。 能被(3)整除的三个元素是(6,15,42)，其gcd为(3)，所以输出为`3`。 

该跟踪说明了为什么算法对每个元素计算不同的素因数。 数字 (42) 包含 (2\cdot3\cdot7)，但它只为三个相应的素数频率中的每一个贡献一个计数。 

对于样本 2，每个值都是`2`。 

| 当前值| 不同的质因数 | 频率状态| 当前答案 |
 | ---| ---| ---| ---|
 | 2 | 2 | 2:1 | 1 |
 | 2 | 2 | 2:2 | 2 |
 | 2 | 2 | 2:3 | 3 |

 素数(2)的最终频率是(3)，所以三个元素都可以选择，答案是`3`。 

此案例证实了重复值是独立处理的。 每次出现都是一个单独的数组元素，并且应该增加其素因数的频率。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 预期 (O(n\cdot C_{64})) | 每个 (n) 值均采用 Miller-Rabin 和 Pollard-Rho | 因式分解
 | 空间| (O(n+\log A)) | 频率图存储遇到的素数，递归因式分解具有对数深度 |

 这里 (A\le 10^{18}) 和 (C_{64}) 表示 64 位整数的预期 Pollard-Rho 分解成本。 由于 (n\le1000)，需要因式分解的值的数量很少，而每个值最多 (10^9) 的试除法成本太高。 所选择的因式分解方法是专门针对问题允许的大 64 位值而设计的。 

## 测试用例```python
import sys
import io
import contextlib
import random
import math

SMALL_PRIMES = (
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37
)

MR_BASES = (
    2, 325, 9375, 28178, 450775, 9780504, 1795265022
)

random.seed(0xC0FFEE)

def is_prime(n):
    if n < 2:
        return False

    for p in SMALL_PRIMES:
        if n % p == 0:
            return n == p

    d = n - 1
    s = 0
    while d % 2 == 0:
        s += 1
        d //= 2

    for a in MR_BASES:
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

def factor(n, result):
    if n == 1:
        return
    if is_prime(n):
        result.add(n)
        return

    d = pollard_rho(n)
    factor(d, result)
    factor(n // d, result)

def solve_text(inp):
    data = inp.split()
    n = int(data[0])
    a = list(map(int, data[1:n + 1]))

    count = {}

    for x in a:
        primes = set()
        factor(x, primes)

        for p in primes:
            count[p] = count.get(p, 0) + 1

    return str(max(count.values())) + "\n"

# Provided samples
assert solve_text("""4
6 15 10 42
""") == "3\n", "sample 1"

assert solve_text("""3
2 2 2
""") == "3\n", "sample 2"

assert solve_text("""1
35
""") == "1\n", "sample 3"

# Minimum-size input
assert solve_text("""1
2
""") == "1\n", "single element"

# All elements share a large prime factor
assert solve_text("""4
1000000007 2000000014 3000000021 4000000028
""") == "4\n", "large common prime factor"

# Pairwise gcds can be greater than 1 without one common divisor
assert solve_text("""3
6 10 15
""") == "2\n", "pairwise gcd trap"

# Boundary near 10^18, with no common prime factor
assert solve_text("""3
999999999999999989 999999999999999937 1000000000000000000
""") == "1\n", "large boundary values"

# Maximum n, all equal
values = " ".join(["2"] * 1000)
assert solve_text("1000\n" + values + "\n") == "1000\n", "maximum n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 2`|`1`| 最小值 (n) 和单例情况 |
 |`4 / 1000000007 2000000014 3000000021 4000000028`|`4`| 大素因数分解和重复公因数 |
 |`3 / 6 10 15`|`2`| 防止将成对 gcd 连接视为一个常见的 gcd |
 |`3 / 999999999999999989 999999999999999937 1000000000000000000`|`1`| 大 64 位边界值 |
 |`1000`的副本`2`|`1000`| 最大值 (n) 和重复的相同值 |

 ## 边缘情况

 单例情况由相同的因子计数不变量直接处理。 对于输入```
1
35
```永远不需要 Pollard-Rho，因为 Miller-Rabin 将 (35) 识别为复合并将其分解为 (5) 和 (7)。 两个素数都接收频率 (1)，因此最大值为 (1)。 该算法不需要将该元素与其他任何元素进行比较。 

对于重复值，```
3
2 2 2
```每个事件都被单独考虑。 每次出现的不同质因数的集合是`{2}`，因此 (2) 的频率从 (1) 进展到 (2) 再到 (3)。 最终答案是（3）。 这避免了在计数之前对输入值进行重复数据删除的常见错误。 

对于成对 gcd 陷阱，```
3
6 10 15
```因子集是`{2,3}`,`{2,5}`， 和`{3,5}`。 素数(2) 出现两次，素数(3) 出现两次，素数(5) 出现两次。 没有素数出现 3 次，所以答案是 (2)，即使每对的 gcd 都大于 (1)。 该算法计算实际的公共素数，而不是从成对关系中推断出一个组。 

对于非常大的值，分解例程完全使用以当前数字为模的整数算术进行操作。 例如，当输入包含接近 (10^{18}) 的素数时，Miller-Rabin 可以识别它，而无需试除每个较小的整数。 当值是复合值时，Pollard-Rho 会搜索重要因子，而不是扫描所有候选因子直至其平方根。 这是使 (10^{18}) 界限变得实用的实现部分。 

最大重复值情况有 (2) 的 (1000) 个副本。 每个值的分解工作很小，并且频率图仅包含一个键。 最终计数达到 (1000)，表明允许答案等于整个数组大小，并且任何差一限制都不应排除整个数组。
