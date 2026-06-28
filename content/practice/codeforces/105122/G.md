---
title: "CF 105122G - 适度的数字"
description: "我们被要求计算 $[a, b]$ 范围内的整数，使得每个整数恰好有七个正因数。 该任务不是要在线有效地分解任意数字，而是要理解除数函数等于 7 的数字的结构。"
date: "2026-06-27T19:39:37+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105122
codeforces_index: "G"
codeforces_contest_name: "XXVI Interregional Programming Olympiad, Vologda SU, 2024"
rating: 0
weight: 105122
solve_time_s: 72
verified: false
draft: false
---

[CF 105122G - 适度的数字](https://codeforces.com/problemset/problem/105122/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 12s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求计算一个范围内的整数$[a, b]$使得每个整数恰好有七个正因数。 该任务不是要在线有效地分解任意数字，而是要理解除数函数等于 7 的数字的结构。 

输入由两个非常大的整数组成，最多可达$10^{18}$，定义一个闭区间。 输出是该区间内除数恰好为 7 的整数的数量。 

该约束立即排除任何迭代该范围的方法。 即使是在一定尺寸范围内一次通过$10^{18}$是不可能的。 任何有效的解决方案都必须用恰好七个除数来表征所有数字，并仅生成这些候选数字。 

一个常见的陷阱是尝试对范围内的每个数字进行动态分解。 即使每个分解都被优化为$O(\sqrt{n})$，范围大小使得这种方法不可用。 

另一个微妙的问题是假设“恰好七个除数”的行为与 2、4 或 6 个除数等常见情况类似。 对于七来说，结构受到高度约束，缺少该结构会导致完全错误的解决方案空间。 

## 方法

 我们从最直接的想法出发：对于每一个数字$x \in [a, b]$，通过迭代计算其除数计数$\sqrt{x}$，计算除数对。 这是正确的，但完全不可行。 在最坏的情况下，即使检查附近的单个数字$10^{18}$需要最多$10^9$迭代，我们需要这样做最多$10^{18}$数字。 

关键的观察是对恰好有七个除数的数字进行分类。 由于七是质数，因此除数计数公式对质因数分解施加了非常严格的结构。 

如果一个数字$n = p_1^{e_1} p_2^{e_2} \cdots$，那么除数的个数是$(e_1+1)(e_2+1)\cdots$。 对于等于 7（质数）的乘积，只能存在一个因数。 这意味着数字必须采用以下形式$p^6$， 在哪里$p$是素数。 

所以每个有效数字恰好是素数的六次方。 这将问题简化为：计算素数$p$这样$p^6 \in [a, b]$。 同样，我们需要区间内的素数：$$\lceil a^{1/6} \rceil \le p \le \lfloor b^{1/6} \rfloor.$$范围为$p$至多是$(10^{18})^{1/6} = 10^3$，所以我们只需要 1000 以内的素数。我们可以使用筛子预先计算一次素数，然后计算有多少个素数满足边界。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(b-a)$或者更糟|$O(1)$| 太慢了 |
 | 最佳（初筛+过滤）|$O(\sqrt[6]{b} + \log \log \sqrt[6]{b})$|$O(\sqrt[6]{b})$| 已接受 |

 ## 算法演练

 1. 计算素数底数的整数下界和上限。 我们找到所有整数$p$这样$p^6$在于$[a, b]$。 这是通过计算整数六次方根来完成的$a$和$b$，注意调整舍入误差。 
2. 预先计算直到$\lfloor b^{1/6} \rfloor$使用埃拉托色尼筛。 这很有效，因为限制最多为 1000。 
3. 迭代所有素数$p$从筛子上。 
4. 对于每个素数$p$，检查它是否在计算范围内。 如果是，则它恰好贡献了一个有效数字$p^6$。 
5. 计算所有这样的素数并输出结果。 

### 为什么它有效

 除数计数函数是乘法函数，仅当素数分解恰好包含一个素数的六次方时才等于 7。 没有其他分解可以产生素数除数，因为任何额外的素数因子都会将除数计数至少乘以 2。此限制将整个问题简化为非常小的间隔内的有界素数计数问题。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def iroot6(x: int) -> int:
    lo, hi = 1, 10**3 + 5
    while lo <= hi:
        mid = (lo + hi) // 2
        v = mid**6
        if v <= x:
            lo = mid + 1
        else:
            hi = mid - 1
    return hi

def sieve(n: int):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i * i, n + 1, i):
                is_prime[j] = False
    return is_prime

def solve():
    a = int(input().strip())
    b = int(input().strip())

    hi = iroot6(b)
    lo = iroot6(a)

    if lo**6 < a:
        lo += 1

    is_prime = sieve(hi)

    ans = 0
    for p in range(lo, hi + 1):
        if is_prime[p]:
            ans += 1

    print(ans)

if __name__ == "__main__":
    solve()
```该解决方案的核心是六次根计算。 我们通过使用整数二分搜索来避免浮点不稳定，即使在大边界附近也能确保正确性。 调整`if lo**6 < a: lo += 1`修复了边缘情况，即计算出的下界向下舍入为六次方仍在区间之外的值。 

该筛子只能运行大约 1000 个筛子，因此速度非常快。 然后，我们在限制范围内过滤素数，这直接对应于有效的六次方。 

## 工作示例

 ### 示例 1

 输入：```
50
100
```我们计算六次方根：$$50^{1/6} \approx 1,\quad 100^{1/6} \approx 2$$所以候选素数在$[1, 2]$。 只有质数是 2。 

| 步骤| 瞧| 你好| 候选人 p | p素数？ | 计数|
 | --- | --- | --- | --- | --- | --- |
 | 初始化| 1 | 2 | - | - | 0 |
 | p = 1 | 1 | 2 | 1 | 没有| 0 |
 | p = 2 | 1 | 2 | 2 | 是的 | 1 |

 仅有的$2^6 = 64$位于范围内，所以答案为 1。 

这证实了该区间内仅存在一个有效的六次方。 

### 示例 2

 输入：```
1
1000000000000000000
```我们计算：$$b^{1/6} = 1000$$所以我们计算素数$p \le 1000$。 

| 步骤| p 范围 | 行动| 计数|
 | --- | --- | --- | --- |
 | 初始化| 2..1000 | 2..1000 筛素数| 0 |
 | 扫描| 素数 ≤ 1000 | 全部计数 | 168 | 168

 这表明该解决方案将大量范围查询减少为固定的素数计数任务。 

该迹线证实该算法仅依赖于指数空间的边界，而不依赖于扫描原始区间。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(\sqrt[6]{b} \log \log \sqrt[6]{b})$| 筛选多达 1000 个素数线性扫描 |
 | 空间|$O(\sqrt[6]{b})$| 筛子的布尔数组 |

 界限$\sqrt[6]{10^{18}} \le 1000$使解决方案在实践中有效地保持时间恒定。 在限制下，内存和运行时间都是微不足道的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdout.getvalue().strip() if False else ""

# direct inline solution for testing
def solve_test(inp: str) -> str:
    import sys
    from io import StringIO

    def iroot6(x: int) -> int:
        lo, hi = 1, 10**3 + 5
        while lo <= hi:
            mid = (lo + hi) // 2
            v = mid**6
            if v <= x:
                lo = mid + 1
            else:
                hi = mid - 1
        return hi

    def sieve(n: int):
        is_prime = [True] * (n + 1)
        is_prime[0] = is_prime[1] = False
        for i in range(2, int(n**0.5) + 1):
            if is_prime[i]:
                for j in range(i * i, n + 1, i):
                    is_prime[j] = False
        return is_prime

    old = sys.stdin
    sys.stdin = StringIO(inp)

    a = int(input().strip())
    b = int(input().strip())

    hi = iroot6(b)
    lo = iroot6(a)
    if lo**6 < a:
        lo += 1

    is_prime = sieve(hi)

    ans = sum(1 for p in range(lo, hi + 1) if is_prime[p])

    sys.stdin = old
    return str(ans)

# samples
assert solve_test("50\n100\n") == "1"

# custom cases
assert solve_test("1\n63\n") == "0"
assert solve_test("1\n64\n") == "1"
assert solve_test("64\n64\n") == "1"
assert solve_test("1\n1000000000000000000\n") == "168"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 63 | 0 | 还没有素数的六次方|
 | 1 64 | 1 | 2^6 的边界包含 |
 | 64 64 | 64 1 | 单点范围|
 | 1 10^18 | 10^18 168 | 168 完整素数设置高达 1000 |

 ## 边缘情况

 当下限刚好高于有效的六次方时，就会出现一种边缘情况。 例如，如果$a = 65$， 然后$a^{1/6}$向下舍入为 2，但是$2^6 = 64$不在区间内。 调整步骤`if lo**6 < a: lo += 1`确保我们排除这个错误包含的候选者。 

另一种情况是当$a$和$b$非常小。 为了$a = b = 1$，六次根计算产生$lo = hi = 1$，但 1 不是素数，因此筛选正确地得出零。 

最后一种情况是范围很大但包含所有有效数字。 为了$a = 1$,$b = 10^{18}$，该算法将所有素数计数到 1000。筛子保证了正确性，因为每个有效数字都唯一对应于一个素数基数，并且映射中不存在重复或间隙。
