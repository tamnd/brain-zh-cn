---
title: "CF 2091E - 利息比率"
description: "我们被要求计算整数对 $(a, b)$，其中 $1 le a < b le n$，使得比率 $F(a, b) = frac{text{lcm}(a, b)}{gcd(a, b)}$ 是素数。"
date: "2026-06-08T05:47:01+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "math", "number-theory", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 2091
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 1013 (Div. 3)"
rating: 1300
weight: 2091
solve_time_s: 72
verified: true
draft: false
---

[CF 2091E - 利息比率](https://codeforces.com/problemset/problem/2091/E)

 **评分：** 1300
 **标签：** 蛮力、数学、数论、两个指针
 **求解时间：** 1m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求计算整数对$(a, b)$在哪里$1 \le a < b \le n$使得比率$F(a, b) = \frac{\text{lcm}(a, b)}{\gcd(a, b)}$是一个素数。 输入由多个测试用例组成，每个测试用例指定一个最大数量$n$，对于每个测试用例，我们需要输出满足此条件的对的数量。 

主要的见解是$F(a, b) = \frac{\text{lcm}(a, b)}{\gcd(a, b)} = \frac{a \cdot b / \gcd(a, b)}{\gcd(a, b)} = \frac{a \cdot b}{\gcd(a, b)^2}$。 所以$F(a, b)$总是一个整数，并且我们需要它是素数。 由于素数大于 1，$F(a, b) \ge 2$。 

限制因素很大。$n$可以大到$10^7$，以及所有的总和$n$跨测试用例不超过$10^7$。 检查所有内容的幼稚方法$O(n^2)$每个测试用例对最多需要$10^{14}$在最坏的情况下进行操作，这远远超出了可行的范围。 这表明我们需要一个接近线性时间或稍微超线性的解决方案$n$。 

可能破坏粗心方法的边缘情况包括小$n$喜欢$n = 2$，其中仅存在一对$(1, 2)$，或情况$a$是 1，因为$F(1, p) = p$对于任意素数$p$。 另一个棘手的情况是当$b$是的倍数$a$;$F(a, b)$简化为$\frac{b}{a}$，因此我们可以通过考虑基本整数的倍数来生成所有有趣的比率。 

## 方法

 蛮力方法枚举所有对$(a, b)$和$1 \le a < b \le n$，计算$\gcd(a, b)$，计算$F(a, b)$，并检查它是否是素数。 虽然这在原则上是正确的，但对于$n \sim 10^7$这种方法需要$O(n^2 \log n)$时间因为计算$\gcd$并且检查素数不是常数时间。 这显然太慢了。 

关键的观察是表达$b$作为$b = a \cdot k$， 在哪里$k > 1$是一个整数。 然后$\gcd(a, b) = a$和$\text{lcm}(a, b) = a \cdot k$， 所以$F(a, b) = \frac{a \cdot k}{a} / a = k$。 所以，$F(a, b)$正是当$b = a \cdot p$对于一些素数$p$。 问题简化为计算每个整数的所有倍数$a$由素数$p$使产品不超过$n$。 

我们可以预先计算素数$n$使用筛子，然后对每个$a$迭代所有素数$p$和$a \cdot p \le n$。 这将复杂性降低到大约$O(n \log \log n)$用于筛子加$O(n \log n)$用于生成对，在给定约束的情况下这是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n² log n) | O(n² log n) | O(1) | O(1) | 太慢了|
 | 素数倍数 | O(n log log n + n log n) | O(n log log n + n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 预先计算所有素数直到最大值$n$使用埃拉托色尼筛法对所有测试用例进行分析。 这为我们提供了一种快速检查素数并枚举它们的方法。 
2.初始化一个数组`counts`在哪里`counts[i]`将存储给定的有趣比率的数量$i$。 
3. 对于每个整数$a$从 1 到$n$, 迭代素数$p$这样$a \cdot p \le n$。 每个有效产品$b = a \cdot p$形成有效对$(a, b)$，所以增加`counts[a * p]`。 
4. 为了有效地处理多个测试用例，请将所有整数的计数累加到`max_n`并在需要时存储前缀和。 
5. 对于给定的每个测试用例$n$，将所有有效对的贡献相加到$n$并打印结果。 
为什么有效：通过因式分解$b$作为$a$，我们保证$\gcd(a, b) = a$， 所以$F(a, b) = b / a$。 这保证了整数结果并允许直接检查素数。 筛子确保考虑所有质因数，并且迭代倍数确保所有有效对都被精确计数一次。 限制条件$1 \le a < b \le n$都是自然维持的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

# sieve of Eratosthenes
def sieve(max_n):
    is_prime = [True] * (max_n + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(max_n**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, max_n + 1, i):
                is_prime[j] = False
    primes = [i for i, val in enumerate(is_prime) if val]
    return primes, is_prime

def solve():
    t = int(input())
    ns = [int(input()) for _ in range(t)]
    max_n = max(ns)
    primes, _ = sieve(max_n)
    
    # precompute number of interesting ratios
    counts = [0] * (max_n + 1)
    for p in primes:
        for a in range(1, max_n // p + 1):
            counts[a * p] += 1
    
    # prefix sums
    for i in range(1, max_n + 1):
        counts[i] += counts[i - 1]
    
    for n in ns:
        print(counts[n])

if __name__ == "__main__":
    solve()
```筛子有效地生成所有素数。 我们迭代每个质数，然后迭代所有不超过的倍数`max_n`。 使用前缀和数组允许我们在恒定时间内回答每个测试用例。 仔细注意边界：循环`a in range(1, max_n // p + 1)`确保我们不超过允许的最大值$b$。 

## 工作示例

 输入样本`n = 5`:

 | 一个 | 素数 p | a * p <= 5 | 在这个素数之后计数[a*p] |
 | --- | --- | --- | --- |
 | 1 | 2,3,5 | 2,3,5 | 计数[2]=1，计数[3]=1，计数[5]=1 |
 | 2 | 2 | 4 | 计数[4]=1 |
 | 3 | 2 | 6 > 5 | 6 > 5 跳过|
 | 4 | 2 | 8 > 5 | 8 > 5 跳过|
 | 5 | 2 | 10 > 5 | 10 > 5 跳过|

 前缀总和产生总计`counts[5] = 4`。 

这证实了算法对对的计数`(1,2)`,`(1,3)`,`(1,5)`,`(2,4)`正确。 

输入样本`n = 10`:

 | 一个 | p| a*p <= 10 | a*p <= 10 | 对数 |
 | --- | --- | --- | --- |
 | 1 | 2,3,5,7 | 2,3,5,7 | 4 |
 | 2 | 2,3,5 | 4,6,10 | 3 更多 |
 | 3 | 2,3 | 6,9 | 2 更多 |
 | 4 | 2 | 8 | 1 更多 |
 | 5 | 2 | 10 | 10 已经算进2*5了吗？ 分别计算 |
 | 6..10 | 6..10 仅限产品 >10 | 跳过| |

 总计数 = 11，符合预期输出。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log log n + n log n) | O(n log log n + n log n) | 筛选 + 迭代素数和倍数 |
 | 空间| O(n) | 存储计数和筛数组 |

 这完全符合 2 秒的时间限制`n ≤ 10^7`内存限制为 256 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    solve()
    return out.getvalue().strip()

# provided samples
assert run("4\n5\n10\n34\n10007\n") == "4\n11\n49\n24317"

# minimum-size input
assert run("1\n2\n") == "1"

# maximum-size input (just check it runs)
assert run("1\n10000000\n
```
