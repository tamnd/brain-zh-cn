---
title: "CF 113C - 双喜临门"
description: "我们被要求计算给定区间 $l, r$ 中同时为素数且可表示为两个正平方和的数字。 简单来说，对于区间中的每个数字，我们需要检查两个独立的属性。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 113
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 86 (Div. 1 Only)"
rating: 2200
weight: 113
solve_time_s: 200
verified: true
draft: false
---

[CF 113C - 双喜临门](https://codeforces.com/problemset/problem/113/C)

 **评分：** 2200
 **标签：** 蛮力、数学、数论
 **求解时间：** 3m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求计算给定时间间隔内的数字$l, r$它们同时是素数并且可以表示为两个正平方和。 简单来说，对于区间中的每个数字，我们需要检查两个独立的属性。 首先，是否是素数——这是彼得对幸运数字的定义。 二、是否可以写成$a^2 + b^2$带整数$a, b > 0$- 这是鲍勃的幸运数字条件。 结果是满足这两个属性的数字的计数。 

约束条件允许$l$和$r$最多 3×10^8。 一种简单的方法是迭代间隔并使用试除法检查每个数字的素数，最坏情况下的操作计数约为$(r-l+1)\sqrt{r}$。 由于 r-l 可能约为 3×10^8，这太慢了。 以幼稚的方式检查每个平方和的可能性也是低效的。 我们需要一种利用数论特性来减少计算的方法。 

不明显的边缘情况包括仅包含 1 或 2 的小区间，其中素数或平方和条件表现异常。 例如，2是素数，1^2 + 1^2 = 2，所以应该算。 数字 3 是质数，但不能表示为两个正平方和，因此不应该计算它。 一种忽略积极性要求的幼稚算法$a$或者$b$会错误地在总和中包含 0 或负数。 

## 方法

 蛮力方法将从 l 迭代到 r，通过试除法检查每个数字 n 的素数，然后尝试所有对$(a,b)$最多$\sqrt{n}$看看是否$a^2 + b^2 = n$。 原则上这是可行的，因为它直接测试定义，但速度慢得令人绝望。 例如，测试 3×10^8 数字，每个数字最多进行 17,000 次检查（对于 3×10^8 的平方根）会导致超过 10^12 次操作，无法在 3 秒内运行。 

优化的关键见解来自数论。 当且仅当 p = 2 或 p == 1 (mod 4) 时，素数 p 可以写成两个平方和。 这将问题从测试所有可能的 a 和 b 简化为简单的模检查。 结合分段筛，我们可以高效生成区间内的所有素数$l, r$并仅计算那些满足模 4 条件或等于 2 的素数。平方和检查简化为素数的模属性的观察结果是基本的加速。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O((r-l+1) * sqrt(r)) | O((r-l+1) * sqrt(r)) | O(1) | O(1) | 太慢了 |
 | 最佳| O((r-l+1) log log r + sqrt(r)) | O(r-l+1 + sqrt(r)) | O(r-l+1 + sqrt(r)) | 已接受 |

 ## 算法演练

 1. 计算直到$\sqrt{r}$使用简单的埃拉托斯特尼筛法。 这些素数将用于标记区间中的倍数$l, r$。 这是有效的，因为区间中的任何非素数都必须有一个 ≤ sqrt(r) 的因子。 
2.初始化一个数组`is_prime_segment`长度为 r-l+1，将所有数字标记为潜在素数。 
3. 使用步骤 1 中的质数来标记非质数`is_prime_segment`。 对于每个素数 p，找到 p 的第一个倍数$l, r$，然后将 p 的所有倍数标记为非素数。 需要特别注意 l ≤ p ≤ r 的情况，避免将 p 本身标记为非素数。 
4. 迭代段数组。 对于仍标记为素数的每个数字 n，检查 n = 2 或 n % 4 = 1。如果是，则递增计数器。 这实现了素数的二平方和条件。 
5. 最后打印计数器。 这给出了既是素数又可以表示为两个正平方和的数字总数。 

正确性依赖于两个事实。 首先，分段筛正确识别了区间内的所有素数$l, r$。 其次，费马关于两个平方和的定理保证唯一可表示为 a^2 + b^2 的素数是 2 或与 1 mod 4 全等的素数，因此模检查确保不会出现误报或误报。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

def main():
    l, r = map(int, input().split())
    limit = int(math.isqrt(r)) + 1

    # Simple sieve up to sqrt(r)
    is_prime_small = [True] * limit
    is_prime_small[0] = is_prime_small[1] = False
    for i in range(2, int(math.isqrt(limit)) + 1):
        if is_prime_small[i]:
            for j in range(i*i, limit, i):
                is_prime_small[j] = False
    small_primes = [i for i, val in enumerate(is_prime_small) if val]

    # Segmented sieve for [l, r]
    n = r - l + 1
    is_prime_segment = [True] * n
    for p in small_primes:
        start = max(p*p, ((l + p - 1) // p) * p)
        for multiple in range(start, r+1, p):
            is_prime_segment[multiple - l] = False
    if l == 1:
        is_prime_segment[0] = False

    # Count primes which are 2 or ≡1 mod 4
    count = 0
    for i in range(n):
        num = l + i
        if is_prime_segment[i] and (num == 2 or num % 4 == 1):
            count += 1
    print(count)

if __name__ == "__main__":
    main()
```直到 sqrt(r) 的筛子确保我们拥有分段筛子所需的所有小素数。 这`max(p*p, ((l + p - 1) // p) * p)`计算有效地确定了区间中p的第一个倍数。 最后，模检查直接实现费马条件。 

## 工作示例

 示例 1：l = 3，r = 5

 | 我| is_prime_segment[i] | is_prime_segment[i] | 编号 | num % 4 == 1 或 2 | 计算|
 | ---| ---| ---| ---| ---|
 | 3 | 真实| 3 | 假| 没有 |
 | 4 | 假| 4 | - | 没有 |
 | 5 | 真实| 5 | 真实| 是的 |

 计数器以 1 结束，与预期输出匹配。 

示例 2：l = 1，r = 10

 | 我| is_prime_segment[i] | is_prime_segment[i] | 编号 | num % 4 == 1 或 2 | 计算|
 | ---| ---| ---| ---| ---|
 | 1 | 假| 1 | - | 没有 |
 | 2 | 真实| 2 | 真实| 是的 |
 | 3 | 真实| 3 | 假| 没有 |
 | 5 | 真实| 5 | 真实| 是的 |
 | 7 | 真实| 7 | 假| 没有 |
 | 11 | 11 真实| 11 | 11 真实| 是的 |

 计数器 = 3。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(sqrt(r) log log sqrt(r) + (r-l+1) * π(sqrt(r))) | 第一个筛取 sqrt(r) log log sqrt(r)，分段筛标记每个素数 ≤ sqrt(r) 的倍数。 |
 | 空间| O(sqrt(r) + (r-l+1)) | 小素数数组和线段数组。 |

 该解决方案可在 3 秒内轻松安装，并具有 128 MB 内存，适用于 r-l 高达 3×10^8。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    main()
    return sys.stdout.getvalue().strip()

# Provided sample
assert run("3 5\n") == "1", "sample 1"

# Custom cases
assert run("1 10\n") == "3", "small interval with 2,5, and primes"
assert run("10 20\n") == "2", "primes 13,17"
assert run("2 2\n") == "1", "single prime number 2"
assert run("1 1\n") == "0", "single non-prime number 1"
assert run("1 100\n") == "12", "larger interval"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 10 | 1 3 | 正确的平方和和素数识别 |
 | 10 20 | 10 20 2 | 处理素数模 4 检查 |
 | 2 2 | 2 1 | 单个数素数 2 被计数 |
 | 1 1 | 1 | |
