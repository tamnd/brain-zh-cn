---
title: "CF 1750D - 计数 GCD"
description: "我们被要求计算与前缀最大公约数序列匹配的数组 $b$ 的数量。 具体来说，对于每个位置 $i$，$b$ 的前 $i$ 元素的 GCD 必须等于 $ai$。 每个元素 $bi$ 必须是 1 到 $m$ 之间的整数。"
date: "2026-06-09T15:06:18+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1750
codeforces_index: "D"
codeforces_contest_name: "CodeTON Round 3 (Div. 1 + Div. 2, Rated, Prizes!)"
rating: 1800
weight: 1750
solve_time_s: 80
verified: true
draft: false
---

[CF 1750D - 计算 GCD](https://codeforces.com/problemset/problem/1750/D)

 **评分：** 1800
 **标签：** 组合数学、数学、数论
 **求解时间：** 1m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求计算数组的数量$b$匹配一系列前缀最大公约数。 具体来说，对于每个位置$i$, 第一个的 GCD$i$的元素$b$必须等于$a_i$。 每个元素$b_i$必须是 1 到 1 之间的整数$m$。 输出是此类数组的数量模$998{,}244{,}353$。 

输入由多个测试用例组成。 每个测试用例都有一个整数$n$数组的长度和一个整数$m$为最大允许值。 然后$n$整数$a_1, \dots, a_n$指定所需的前缀 GCD。 

约束条件告诉我们$n$可以达到$2\cdot 10^5$和$m$最多$10^9$。 由于总和为$n$跨测试用例的边界为$2\cdot 10^5$，我们需要一个大致线性的解决方案$n$每个测试用例。 枚举所有可能数组的简单方法$b$是不可能的，因为$m^n$是一个天文数字。 迭代所有值的任何解决方案$b_i$明确是不可行的。 

当序列出现时，会出现不明显的边缘情况$a$不是可分意义上的不增。 例如，如果$a = [2,3]$，没有可能$b$因为$\gcd(b_1) = 2$和$\gcd(b_1,b_2) = 3$不可能发生 - 3 不能整除 2。忽略整除性检查的粗心解决方案将错误地尝试计算有效值$b_2$并产生一个非零计数。 

另一个微妙之处是当$a_i$等于$a_{i-1}$。 在那种情况下，$b_i$必须是的倍数$a_i$，但之前的 GCD 没有产生额外的约束，因此计数包括所有倍数$a_i$最多$m$保留 GCD。 

## 方法

 蛮力方法是枚举所有可能的$b_1$在$[1,m]$，那么对于每个$b_1$一切可能$b_2$在$[1,m]$，依此类推，在每一步计算前缀 GCD。 这需要$O(m^n)$，这是不可行的，因为$m$可以是$10^9$和$n$最多$2\cdot 10^5$。 

关键的观察结果是前缀 GCD 施加了很强的整除性约束。 具体来说，每个$b_i$必须是的倍数$a_i$，并且 GCD 从$a_{i-1}$到$a_i$,$b_i$必须满足$\gcd(b_i, a_{i-1}) = a_i$。 这相当于计算整数$x$这样$1 \le x \le \frac{m}{a_i}$和$\gcd(x, \frac{a_{i-1}}{a_i}) = 1$。 在这里，我们通过$a_i$将问题简化为计算与给定数字互质的整数。 使用 Euler totient 函数$\phi(k)$，我们可以计算最多的整数个数$t$互质于$k$高效。 

该观察允许对阵列进行线性扫描$a$, 计算$\phi(a_{i-1}/a_i)$对于每一步，给出一个$O(n \sqrt{a_{i-1}/a_i})$或每个测试用例解决方案更快。 如果有的话$a_i$不分开$a_{i-1}$，答案立即为 0。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(m^n) | O(m^n) | O(n) | 太慢了|
 | 最佳 | O(n log n) 摊销 | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 阅读$t$，测试用例的数量，并对它们进行迭代。 
2. 对于每个测试用例，请阅读$n$和$m$，然后是数组$a$。 
3. 初始化变量`ans = 1`保存有效选择模的乘积$998244353$。 
4.如果$a_0 > m$， 放`ans = 0`因为第一个元素不能超过$m$。 
5. 迭代$i$从 1 到$n-1$：

 1. 检查是否$a_{i-1}$可以整除$a_i$。 如果没有，请设置`ans = 0`并打破。 
2. 计算$k = a_{i-1} / a_i$。 整数个数$b_i = a_i \cdot x$这样$1 \le b_i \le m$和$\gcd(b_i, a_{i-1}) = a_i$等于整数的个数$x \le m / a_i$与 互质$k$。 
3.因式分解$k$进入其主要因素。 
4. 使用质因数的包含-排除来计算整数$x \le m / a_i$互质于$k$。 
5. 将此计数乘以`ans`模数$998244353$。 
6. 输出`ans`。 

Why it works: the invariant is that at step$i$，我们维护数组的数量$b_1 \dots b_i$满足前缀 GCD 约束。 可整除性确保 GCD 可以从$a_{i-1}$到$a_i$，并按比例缩放$a_i$将计数减少到互质整数。 包含-排除精确地计算互质的整数$k$，保证正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
MOD = 998244353

def prime_factors(x):
    i = 2
    factors = set()
    while i * i <= x:
        if x % i == 0:
            factors.add(i)
            while x % i == 0:
                x //= i
        i += 1
    if x > 1:
        factors.add(x)
    return list(factors)

def count_coprime(n, primes):
    # Inclusion-Exclusion to count numbers <= n coprime with product of primes
    res = 0
    m = len(primes)
    for mask in range(1, 1 << m):
        prod = 1
        bits = 0
        for i in range(m):
            if mask & (1 << i):
                prod *= primes[i]
                bits += 1
        cnt = n // prod
        if bits % 2 == 1:
            res += cnt
        else:
            res -= cnt
    return n - res

t = int(input())
for _ in range(t):
    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    if a[0] > m:
        print(0)
        continue
    ans = 1
    for i in range(1, n):
        if a[i-1] % a[i] != 0:
            ans = 0
            break
        k = a[i-1] // a[i]
        x_max = m // a[i]
        if k == 1:
            cnt = x_max
        else:
            primes = prime_factors(k)
            cnt = count_coprime(x_max, primes)
        ans = ans * cnt % MOD
    print(ans)
```这`prime_factors`函数通过试除法有效地分解数字。`count_coprime`对这些素数使用包含-排除来计算与因式分解互质的整数。 将这些计数相乘尊重每个位置选择的独立性，确保正确的总计数模数$998244353$。 

## 工作示例

 ### 示例 1

 输入：`3 5\n4 2 1`| 我| 一个[我] | 一个[i-1] | k = a[i-1]/a[i] | k = a[i-1]/a[i] | x_max = m//a[i] | 素数 | 计数_coprime | 回答 |
 | --- | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 4 | - | - | 5//4=1 | 5//4=1 - | 1 | 1 |
 | 2 | 2 | 4 | 2 | 5//2=2 | 5//2=2 [2] | 2-1=1 | 2-1=1 1 |
 | 3 | 1 | 2 | 2 | 5 // 1 = 5 | 5 // 1 = 5 | [2] | 5-2=3 | 5-2=3 3 |

 这与示例输出 3 匹配。 

### 示例 2

 输入：`2 1\n1 1`| 我| 一个[我] | 一个[i-1] | k | x_最大| 素数 | 计数_coprime | 回答 |

 |---|
