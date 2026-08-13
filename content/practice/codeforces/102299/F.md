---
title: "CF 102299F - 福贝琴科 v 罗德夫斯基"
description: "我们有两个正整数 (A) 和 (B)，代表分数 (A/B)。 我们可以选择任何整数基（beta ge 2），并且我们想要最小的基，其中该分数在小数点之后具有有限表示。"
date: "2026-08-13T08:11:26+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102299
codeforces_index: "F"
codeforces_contest_name: "2019 USP Try-outs"
rating: 0
weight: 102299
solve_time_s: 73
verified: true
draft: false
---

[CF 102299F - Forbechenko 诉 Rodvsky](https://codeforces.com/problemset/problem/102299/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个正整数 (A) 和 (B)，代表分数 (A/B)。 我们可以选择任何整数基（\beta \ge 2），并且我们想要最小的基，其中该分数在小数点之后具有有限表示。 例如，(1/3) 在基数 10 中永远重复，但它恰好是 (0.1_3)，因此 (A=1,B=3) 的答案是 (3)。 原始问题有 (1 \le A,B \le 10^{18})、一秒时间限制和 256 MB 内存限制。 

第一个有用的步骤是减少分数。 设 (g=\gcd(A,B))、(a=A/g) 和 (b=B/g)。 只有减少的分母 (b) 才重要。 在底数 (\beta) 中，当有理数的约分母除以 (\beta) 的某个幂时，它就具有有限分数表示。 如果 (b) 有素因数分解

 [
 b=p_1^{e_1}p_2^{e_2}\cdots p_k^{e_k},
 ]

 那么 (b\mid\beta^t) 对于某个 (t) 恰好是在每个 (p_i) 除 (\beta) 时。 指数 (e_i) 并不重要，因为一旦 (p_i\mid\beta)， (p_i) 的任意高次幂除以 (\beta) 的足够大次幂。 

因此，最小的可能基数是

 [
 \beta=p_1p_2\cdots p_k,
 ]

 约化分母的不同素因数的乘积。 如果分母变为（1），则分数是整数并且在每个基数上都是有限的，因此答案是（2）。 

(10^{18}) 的大界限才是真正的困难。 当约化分母本身是一个大素数时，迭代所有可能的基可能需要 (10^{18}) 个候选基。 即使是普通的分母除法到其平方根也可能需要大约 (10^9) 次除法，这远远超出了一秒解决方案所能承受的范围。 因式分解必须使用次线性整数因式分解算法。 

一些边缘情况很容易被错误处理。 用于输入`1 1`，约分母为 (1)，因此正确的输出为`2`。 始终返回已发现素因数的乘积的解决方案可能会意外返回 (1)，这不是有效的基数。 

用于输入`2 4`，分数减少到 (1/2)，所以答案是`2`。 在减少分数之前对 (B) 进行因式分解的解决方案在这里仍然适用，但这种区别对于输入（例如`6 15`：约简分数是 (2/5)，所以答案是`5`，不是未约分母的因子与分子的不相关因子相结合的乘积。 

用于输入`1 12`，分母为 (2^2\cdot3)。 答案是`6`， 不是`12`。 素数的指数不需要出现在底数中。 粗心地构造整个分母而不是它的根式的解决方案会产生错误的答案。 

用于输入`1 3`，答案是`3`。 这捕获了仅检查熟悉的基数（例如 (2, 10)）的实现，或者将有限十进制表示与某些任意基数中的有限表示相混淆的实现。 

## 方法

 一种直接的方法是按升序尝试碱基。 对于每个候选值 (\beta)，将当前分母除以每个能整除 (\beta) 的因子。 如果分母最终可以减少到 (1)，则该分数在该基数中具有有限表示。 这是正确的，因为该过程正在准确检查分母的每个质因数是否出现在候选基数中。 

问题在于候选人的数量。 考虑 (A=1) 和 (B=p)，其中 (p) 是接近 (10^{18}) 的大素数。 从 (2) 到 (p-1) 的每个碱基均失败，而 (p) 则成功。 这意味着暴力破解可以执行大约 (10^{18}) 次候选检查。 即使每次检查只需要几次机器操作，这也是完全不可行的。 

一个更简单的数学解决方案是通过尝试从 (2) 到 (\sqrt b) 的每个整数来分解约化分母。 这比尝试基数要好得多，但是对于 (b) 接近 (10^{18}) 的情况，循环仍然达到大约 (10^9) 次迭代。 一秒的限制也排除了这种情况。 

关键的观察是我们不需要指数的完全素因数分解。 我们只需要不同的质因数。 然而，找到任意 64 位整数的这些不同因子仍然是一个整数因式分解问题。 这里合适的工具是 Pollard 的 Rho 分解与确定性 Miller-Rabin 素性测试相结合。 

米勒-拉宾很快告诉我们剩余的数是否是质数。 如果它是复合的，Pollard 的 Rho 会比试除法更快地找到一个不平凡的因子。 我们递归地对两个部分进行因式分解，并将每个不同的素数恰好相乘一次。 

蛮力之所以有效，是因为当底数包含分母的每个质因数时，它就是有效的。 它会失败，因为发现第一个有效碱基可能需要检查整个 (10^{18}) 范围。 观察结果表明，只有不同的质因数才重要，因此我们可以用单个 64 位整数的一次因式分解来代替对基数的搜索。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(B\log B)) 在最坏的情况下 | (O(1)) | (O(1)) | 太慢了 |
 | 审判庭| (O(\sqrt B)) 划分 | (O(1)) | (O(1)) | 太慢了 |
 | 波拉德·罗 + 米勒-拉宾 | 硬半素数的预期分解工作大约为 (O(B^{1/4})) | (O(\log B)) 递归 | 已接受 |

 ## 算法演练

 1. 计算 (g=\gcd(A,B)) 并将 (B) 替换为 (B/g)。 这给出了分数最低项的分母，这是与表示是否终止相关的唯一部分。 
2. 如果约化后的分母为 (1)，则打印`2`。 分数是整数，因此它在每个基数中都有有限的表示形式，并且 (2) 是允许的最小基数。 
3. 使用 Miller-Rabin 和 Pollard's Rho 对约化分母进行因式分解。 Miller-Rabin 立即处理质数，而 Pollard 的 Rho 在当前数字为合数时提供适当的除数。 
4. 收集不同的质因数。 如果某个因子重复出现，例如(2^5)，则仅存储(2)一次。 底数只需要包含素数本身，而不是它的全指数。 
5. 将所有不同的质因数相乘并打印结果。 该乘积可被约分母的每个质因数整除，并且没有更小的正整数可以同时被所有质因数整除。 

### 为什么它有效

 令约简分数为(a/b)。 对于某个整数 (x)，具有 (k) 位数字的有限基 (\beta) 分数表示形式为 (x/\beta^k)，因此 (a/b=x/\beta^k)，这意味着 (b\mid\beta^k)。 相反，如果 (b\mid\beta^k)，则 (a/b) 可以写成分母 (\beta^k)，给出有限表示。 因此，问题正是找到最小的（β），其素因子包括（b）的每个素因子。 这些不同素数的乘积是最小的整数，因此算法的结果是最优的。 

## Python 解决方案```python
import sys
import math
import random

input = sys.stdin.readline

# Deterministic for every 64-bit integer.
MR_BASES = (2, 325, 9375, 28178, 450775, 9780504, 1795265022)

def is_prime(n: int) -> bool:
    if n < 2:
        return False

    small_primes = (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37)
    for p in small_primes:
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

def pollard_rho(n: int) -> int:
    if n % 2 == 0:
        return 2
    if n % 3 == 0:
        return 3

    while True:
        y = random.randrange(1, n - 1)
        c = random.randrange(1, n - 1)
        m = 128

        g = 1
        r = 1
        q = 1

        while g == 1:
            x = y

            for _ in range(r):
                y = (y * y + c) % n

            k = 0
            while k < r and g == 1:
                ys = y
                limit = min(m, r - k)

                for _ in range(limit):
                    y = (y * y + c) % n
                    q = q * abs(x - y) % n

                g = math.gcd(q, n)
                k += limit

            r <<= 1

        if g == n:
            while True:
                ys = (ys * ys + c) % n
                g = math.gcd(abs(x - ys), n)
                if g > 1:
                    break

        if g != n:
            return g

def factor(n: int, factors: list[int]) -> None:
    if n == 1:
        return

    if is_prime(n):
        factors.append(n)
        return

    d = pollard_rho(n)
    factor(d, factors)
    factor(n // d, factors)

def solve() -> None:
    A, B = map(int, input().split())

    B //= math.gcd(A, B)

    if B == 1:
        print(2)
        return

    factors = []
    factor(B, factors)

    answer = 1
    for p in set(factors):
        answer *= p

    print(answer)

if __name__ == "__main__":
    solve()
```实现的第一部分减少了分数`math.gcd`，匹配第一个算法步骤。 仅除分母就足够了，因为我们不需要减少分子来进行其余的计算。`is_prime`使用足以满足 (2^{64}) 以下所有整数的确定性 Miller-Rabin 基集，其中包括整个输入范围。 Python 的任意精度整数还使模乘法安全，无需任何特殊的 128 位处理。`pollard_rho`使用 Pollard Rho 的布伦特式批量变体。 该序列由 (f(x)=x^2+c\pmod n) 生成。 当两个生成的值以未知质因数为模而变得相等时，它们的差值具有 (n) 的非平凡 gcd。 在一批差异之后计算 gcd 减少了相对昂贵的 gcd 操作的数量。 

变量`q`存储几个绝对差模 (n) 的乘积。 如果这些差异中的任何一个包含因子 (n)，则整个乘积与 (n) 的 gcd 可以揭示它。 如果批次意外地给出了完整的数字 (n)，则代码会回退到一次检查一个差异。 

递归`factor`对于素数，函数立即停止。 否则，它使用 Pollard 的 Rho 分割数字并递归处理两个因子。 临时列表中允许重复因素，因为最终的结果是`set`消除了它们的多样性。 

最后的乘法有意发生在重复数据删除之后。 例如，如果分母是 (72=2^3\cdot3^2)，则因子列表可能包含多个副本`2`和`3`，但答案必须是 (2\cdot3=6)，而不是 (72)。 

Python 中不存在整数溢出问题。 在 C++ 实现中，Pollard Rho 内部的模乘法需要一个 128 位中间类型用于此输入范围。 

## 工作示例

 对于示例 1，输入为`1 3`。 分母已经减少了，并且`3`是素数。 

| 步骤| 减少分母 | 发现质因数 | 回答 |
 | --- | --- | --- | --- |
 | 减少分数 | 3 | 无 | 1 |
 | 测试素性 | 3 | 3 | 1 |
 | 建立激进| 3 | {3} | 3 |

 答案是`3`。 在底数 (3) 中，分数恰好是 (0.1_3)，因此表示终止。 

对于示例 2，输入为`3 4`。 分母是(4=2^2)。 

| 步骤| 减少分母 | 发现质因数 | 回答 |
 | --- | --- | --- | --- |
 | 减少分数 | 4 | 无 | 1 |
 | 因素 4 | 4 | 2, 2 | 1 |
 | 删除重复项 | 4 | {2} | 1 |
 | 建立激进| 4 | {2} | 2 |

 答案是`2`。 虽然分母包含(2^2)，但底数只需要包含素数(2)。 由于 (4\mid2^2)，该分数具有有限的二进制表示形式。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 对于困难的 64 位复合材料，预期为 (O(B^{1/4}\operatorname{polylog}B)) | Pollard 的 Rho 发现非平凡因子的速度比试除法快得多，而 Miller-Rabin 则可以快速处理素数 |
 | 空间| (O(\log B)) | 递归因式分解深度为对数，仅存储因子列表 |

 对于 (B\le10^{18})，试除法可能需要大约 (10^9) 次迭代，而 Pollard 的 Rho 正是针对这个 64 位分解范围而设计的。 该算法还仅执行对数数量的递归，并且使用很少的内存，因此它符合规定的 256 MB 内存限制，并且适用于优化实现的一秒目标。 

## 测试用例```python
# This test harness contains the same algorithm as the submitted solution.
import sys
import io
import math
import random

MR_BASES = (2, 325, 9375, 28178, 450775, 9780504, 1795265022)

def is_prime(n):
    if n < 2:
        return False

    for p in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37):
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
        y = random.randrange(1, n - 1)
        c = random.randrange(1, n - 1)
        m = 128

        g = 1
        r = 1
        q = 1

        while g == 1:
            x = y

            for _ in range(r):
                y = (y * y + c) % n

            k = 0
            while k < r and g == 1:
                ys = y
                limit = min(m, r - k)

                for _ in range(limit):
                    y = (y * y + c) % n
                    q = q * abs(x - y) % n

                g = math.gcd(q, n)
                k += limit

            r <<= 1

        if g == n:
            while True:
                ys = (ys * ys + c) % n
                g = math.gcd(abs(x - ys), n)
                if g > 1:
                    break

        if g != n:
            return g

def factor(n, factors):
    if n == 1:
        return

    if is_prime(n):
        factors.append(n)
        return

    d = pollard_rho(n)
    factor(d, factors)
    factor(n // d, factors)

def solve_data(inp):
    A, B = map(int, inp.split())

    B //= math.gcd(A, B)

    if B == 1:
        return "2\n"

    factors = []
    factor(B, factors)

    ans = 1
    for p in set(factors):
        ans *= p

    return str(ans) + "\n"

def run(inp: str) -> str:
    return solve_data(inp)

# Provided samples
assert run("1 3\n") == "3\n", "sample 1"
assert run("3 4\n") == "2\n", "sample 2"

# Minimum-size input
assert run("1 1\n") == "2\n", "integer fraction"

# All factors have powers, so only distinct primes matter
assert run("1 12\n") == "6\n", "radical of 12"

# Numerator and denominator must be reduced first
assert run("6 15\n") == "5\n", "reduction by gcd"

# Maximum-size denominator from the stated range
assert run("1 1000000000000000000\n") == "10\n", "maximum-size denominator"

# Large all-equal values, again producing an integer
assert run("1000000000000000000 1000000000000000000\n") == "2\n", "large equal values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1`|`2`| 最小输入和分母等于 (1) |
 |`1 12`|`6`| 重复的质因数不能重复相乘 |
 |`6 15`|`5`| 因式分解之前必须进行 gcd 约简 |
 |`1 1000000000000000000`|`10`| 最大分母和大复合因式分解 |
 |`1000000000000000000 1000000000000000000`|`2`| 大分子和分母相等 |

 ## 边缘情况

 对于`1 1`，算法计算 (g=1)，使分母为 (1)。 它立即返回`2`。 不尝试因式分解，因为基数中没有要包含的质因数。 

为了`2 4`，gcd 为 (2)，因此约化后的分母变为 (2)。 Miller-Rabin 认为它是素数，根式是 (2)。 输出是`2`。 这说明了为什么分解必须使用约化分母而不是盲目使用原始分母。 

为了`6 15`，gcd 为 (3)，给出约化分数 (2/5)。 约化分母的唯一质因数是 (5)，因此输出为`5`。 分子的因素对答案没有影响。 

为了`1 12`，分母因子为 (2^2\cdot3)。 该算法可能会发现以下因素`2, 2, 3`， 但`set(factors)`将它们更改为`{2,3}`乘法之前。 答案是`6`。 (6) 的基数有效是因为 (12\mid6^2)。 

为了`1 3`，分母本身是素数。 米勒-拉宾确定`3`立即，所以 Pollard 的 Rho 是不必要的。 答案是`3`，这也说明了为什么最小的有效基数不限于 2 或 10 的幂。 

为了`1 1000000000000000000`，分母是

 [
 10^{18}=2^{18}\cdot5^{18}。 
]

 只有不同的素数 (2) 和 (5) 才重要，所以答案是`10`。 这个案例既练习了大整数算术，也练习了素数指数和不同素数因子之间的区别。 

对于相同的大值，例如`1000000000000000000 1000000000000000000`，归约产生分母 (1)，因此算法返回`2`立即地。 这避免了对大整数进行不必要的因式分解，并确认整数分数在尽可能小的基数中有效。
