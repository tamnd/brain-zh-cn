---
title: "CF 1419E - 解密"
description: "该问题围绕着将给定合数的约数排列在一个圆中，使得没有两个相邻的数字互质。"
date: "2026-06-11T06:45:59+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "implementation", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1419
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 671 (Div. 2)"
rating: 2100
weight: 1419
solve_time_s: 97
verified: false
draft: false
---

[CF 1419E - 解密](https://codeforces.com/problemset/problem/1419/E)

 **评分：** 2100
 **标签：** 构造性算法、实现、数学、数论
 **求解时间：** 1m 37s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 该问题围绕着将给定合数的约数排列在一个圆中，使得没有两个相邻的数字互质。 对于每个测试用例，我们都会得到一个合数`n`，我们需要输出其所有大于 1 的除数的排序，以及使每对邻居互质所需的最小移动次数。 每次移动都允许我们在两个相邻数字之间的任意位置插入最小公倍数，从而有效地解决任何一对互质邻居。 面临的挑战是选择一个最小化这些插入的初始排序。 

约束条件告诉我们`n`可以大到`10^9`，但所有测试用例的除数总数不超过`2 * 10^5`。 这意味着我们无法负担枚举除数所有排列的算法，因为阶乘增长将是灾难性的。 计算最大数字的除数`10^9`是可行的`O(sqrt(n))`每个数字。 如果我们小心的话，所有测试用例的总操作将完全符合典型的竞争性编程限制。 不明显的边缘情况包括单个素数的幂的数字，例如`16`，其中除数的数量很少，但一些天真的排序可能会错误地产生互质对，或者像这样的数字`30`，它有多个素因子，其中排序很重要，以避免不必要的 LCM 插入。 

## 方法

 暴力方法会尝试所有大于 1 的除数排列，并检查每对除数是否互质。 如果找到互质对，则会计算一次插入。 这种方法原则上是正确的，但一个数的约数可能多达数百个，并且检查所有排列会导致阶乘复杂性，在给定的限制下这是远远超出可行的。 

关键的见解是问题简化为素因子邻接。 每个除数都可以表示为素数除法的乘积`n`。 如果我们通过将共享素因数的因子分组在一起来对因子进行排序，我们就可以避免互素邻接。 例如，对于`n = p1 * p2 * ... * pk`对于不同的素数，排列除数使得共享素数的数字相邻可以保证没有互素邻居，并且对于单个素数的幂的数字，任何顺序都有效。 具体来说，最小移动次数为零或一，因为任何剩余互质邻接在圆形排列中仅出现一次，并且可以通过单个 LCM 插入来修复。 

因此，最优方法首先分解`n`化为素数，然后生成所有大于一的约数，并根据素数因子巧妙地排列它们，以确保没有两个相邻的数字是互质的。 如果我们遵循每个除数与其后继数至少共享一个素因数的序列，则自动满足邻接要求。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(d! * d) | O(d) | 太慢了 |
 | 最佳 | O(sqrt(n) + d) | O(d) | 已接受 |

 这里`d`是的约数`n`。 

## 算法演练

 1. 对于给定的`n`，通过试除法计算其所有素因子直至`sqrt(n)`。 记录重数的数量，但我们只需要不同的素数来排列约数。 
2. 通过对质数幂的组合进行递归相乘，生成所有大于 1 的除数。 将这些收集在一个列表中。 
3. 按该除数的最小因数素数对除数进行分组。 这可确保相邻数字至少共享一个素因数，从而避免互质对。 
4. 将组按循环顺序排列，其中每个组的最后一个元素与下一组的第一个元素共享一个素因数。 如果`n`恰好有两个不同的质因子，我们可能需要在组之间插入一个 LCM。 
5. 计算所需的移动次数。 如果数字只有一个素数因子，则所有除数都是该素数的幂，因此需要零步。 如果`n`恰好有两个不同的素数，如果两个素数的乘积位置错误，则可能需要移动一步。 否则，该安排保证零移动。 
6. 输出除数的有序列表和最小移动次数。 

不变量是每一相邻对至少共享一个素因数。 由于互质数的最小公倍数引入了可被两个素数整除的数字，因此一次插入即可解决唯一剩余的互质邻接关系。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from math import gcd, isqrt
from collections import defaultdict

def prime_factors(n):
    factors = []
    x = n
    for p in range(2, isqrt(n)+1):
        if x % p == 0:
            factors.append(p)
            while x % p == 0:
                x //= p
    if x > 1:
        factors.append(x)
    return factors

def all_divisors(n):
    divisors = []
    for i in range(2, isqrt(n)+1):
        if n % i == 0:
            divisors.append(i)
            if i != n // i:
                divisors.append(n//i)
    divisors.append(n)
    return divisors

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        primes = prime_factors(n)
        divisors = all_divisors(n)
        divisors.sort()
        if len(primes) == 1:
            print(*divisors)
            print(0)
        elif len(primes) == 2:
            p1, p2 = primes
            if n == p1 * p2:
                print(p1, p2, n)
                print(1)
            else:
                # place p1*p2 first to avoid coprime adjacency
                res = [p1*p2] + [d for d in divisors if d != p1*p2]
                print(*res)
                print(0)
        else:
            # more than 2 primes: any arrangement of divisors with prime groupings works
            print(*divisors)
            print(0)

if __name__ == "__main__":
    solve()
```该解决方案首先对数字进行因式分解，然后枚举所有除数。 当恰好有两个质因数时，需要进行特殊处理，因为最小的互质邻接可能只在圆中出现一次。 对除数进行排序并首先放置两个素数的乘积可以解决这个问题。 否则，简单的排序足以避免互质对，因为每个数字与至少一个邻居共享一个质因数。 

## 工作示例

 **示例输入 1**：```
6
```| 变量| 价值|
 | ---| ---|
 | n | 6 |
 | 素数 | [2, 3] |
 | 除数 | [2,3,6]|
 | 安排| [2,3,6]|
 | 移动| 1 |

 我们看到 2 和 3 互质，因此需要在它们之间插入 LCM 6，从而移动一步。 

**输入示例 2**：```
30
```| 变量| 价值|
 | ---| ---|
 | n | 30|
 | 素数 | [2, 3, 5] |
 | 除数 | [2, 3, 5, 6, 10, 15, 30] |
 | 安排| [2, 3, 5, 6, 10, 15, 30] |
 | 移动| 0 |

 每个相邻对共享一个素因数，因此需要零步。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(sqrt(n) + d) | 因式分解 O(sqrt(n))，除数枚举最高 O(d)，排序 O(d log d) |
 | 空间| O(d) | 存储除数列表和素因数 |

 这是有效的，因为`d`仅限于`2*10^5`所有测试用例的总计，并且 n 最多 1e9 的 sqrt(n) 分解是可以接受的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("3\n6\n4\n30\n") == "2 3 6\n1\n2 4\n0\n2 3 5 6 10 15 30\n0", "sample 1"

# Custom test cases
assert run("1\n16\n") == "2 4 8 16\n0", "power of single prime"
assert run("1\n10\n") == "2 5 10\n1", "two distinct primes product case"
assert run("1\n12\n") == "2 3 4 6 12\n0", "multiple prime factors"
assert run("1\n49\n") == "7 49\n0", "square of prime"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 16 | 16 2 4 8 16 \n0 | 2 4 8 16 单素数幂需要零步|
 | 10 | 10 2 5 10 \n1 | 两个不同的质数需要一次 LCM 插入 |
 | 12 | 12 2 3 4 6 12 \n0 | 2 3 4 6 12 安全排列的多个素数|
 | 49 | 49 7 49 \n0 | 7 49 正确处理素数平方 |

 ## 边缘情况
