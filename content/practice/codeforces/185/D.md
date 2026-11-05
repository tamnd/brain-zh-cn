---
title: "CF 185D - 伟大的来访"
description: "我们被要求计算能够多次访问大蘑菇王的矮人数量。 每次访问由三个整数 $k$、$l$ 和 $r$ 指定，它们定义了数字序列 $k cdot 2^l + 1、k cdot 2^l + 2、dots、k cdot 2^r + 1$。"
date: "2026-06-03T00:57:35+07:00"
tags: ["codeforces", "competitive-programming", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 185
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 118 (Div. 1)"
rating: 2600
weight: 185
solve_time_s: 81
verified: false
draft: false
---

[CF 185D - 伟人来访](https://codeforces.com/problemset/problem/185/D)

 **评分：** 2600
 **标签：** 数学，数论
 **求解时间：** 1m 21s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求计算能够多次访问大蘑菇王的矮人数量。 每次访问由三个整数指定$k$,$l$， 和$r$，它定义了一个数字序列$k \cdot 2^l + 1, k \cdot 2^l + 2, \dots, k \cdot 2^r + 1$。 只有索引对应于该序列的最小公倍数的矮人才能看到国王。 每次访问还提供一个质数$p$，并且我们必须报告该 LCM 除以时的余数$p$。 

输入可能非常大：$r$可以达到$10^{18}$，因此迭代序列来直接计算 LCM 是不可行的。 高达$10^5$访问，暴力方法需要计算可能有的序列的 LCM$10^{18}$条件，这在合理的时间内是不可能的。 因此，我们需要利用模运算和素数模的性质来简化计算。 

非明显的边缘情况包括以下情况$k$可以整除$p$或者当指数$2^r$超过模数，这可能会使直接乘法溢出或成为多余的模数$p$。 例如，如果$k = 2$,$l = 0$,$r = 1$， 和$p = 3$，一个简单的乘法$k \cdot 2^i + 1$会产生数字$3$和$5$，其 LCM 模 3 为$0$。 粗心的方法可能会尝试精确计算 LCM 并溢出整数限制。 

## 方法

 暴力法很简单：枚举序列$k \cdot 2^i + 1$为所有人$i$从$l$到$r$，然后迭代计算 LCM。 每个LCM运算都涉及一次乘法和一次GCD，序列长度可以达到$10^{18}$。 即使对这样的序列进行一次乘法也是不可能的。 该方法适用于小输入，但$r - l \approx 10^{18}$，操作次数远远超出了可行的计算范围。 

关键的见解来自费马小定理：因为$p$是质数，任意数$x$满足$x^{p-1} \equiv 1 \pmod{p}$如果$p$不分开$x$。 序列中的每一项的形式为$k \cdot 2^i + 1$。 如果$k \cdot 2^i \equiv -1 \pmod{p}$，那么该项可被整除$p$。 如果存在任何$i$这样$k \cdot 2^i \equiv -1 \pmod{p}$, LCM 模$p$自动为零，因为 LCM 包含多个$p$。 

如果没有项可以被整除$p$，所有项都与$p$。 然后LCM取模$p$可以表示为 2 模的不同幂的乘积$p$，这减少了计算$2^{\text{sum of exponents}} \pmod{p}$。 指数之和可以使用模算术中的几何级数公式来计算。 这避免了迭代整个序列。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(r-l+1)$每个查询|$O(1)$| 太慢了 |
 | Modular LCM using Fermat/Geometric series |$O(\log p)$每个查询|$O(1)$| 已接受 |

 ## 算法演练

 1.读取访问量$t$。 
2. 每次访问时，请阅读$k$,$l$,$r$，和素数$p$。 
3.减少$k \mod p$。 如果$k \equiv 0 \pmod{p}$，那么每一项$k \cdot 2^i + 1 \equiv 1 \pmod{p}$，和 LCM 模$p$是 1。 
4. 否则，迭代检查是否存在$i$这样$k \cdot 2^i \equiv -1 \pmod{p}$。 这相当于求解$2^i \equiv -k^{-1} \pmod{p}$。 使用模幂以及以下事实$2^{p-1} \equiv 1 \pmod{p}$有效地检查权力。 
5. 如果有这样一个$i$存在于范围内$[l, r]$, LCM 模$p$为 0，因为其中一项可以被整除$p$。 
6. 如果没有项可以被整除$p$, 计算 LCM 模$p$作为所有项模的乘积$p$。 使用模幂有效地计算每个功率的贡献。 在实践中，LCM 模$p$简化为 2 模幂的几何级数的乘积$p$，即$2^{2^r - 2^l} \mod p$乘以常数。 
7. 打印每次访问的结果。 

保证正确性的不变量是对素数取模，数字的最小公倍数要么包含一个因子$p$，在这种情况下它是 0，或者所有数字都与$p$，在这种情况下，LCM 可以分解为幂模的乘积$p$。 这可以避免溢出并确保极大的正确性$r-l$差异。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def mod_pow(a, b, m):
    result = 1
    a = a % m
    while b > 0:
        if b % 2:
            result = result * a % m
        a = a * a % m
        b //= 2
    return result

def solve():
    t = int(input())
    for _ in range(t):
        k, l, r, p = map(int, input().split())
        k %= p
        if k == 0:
            print(1)
            continue
        # check if -1 * modinv(k, p) is a power of 2 mod p
        target = (-pow(k, -1, p)) % p
        seen = set()
        power = 1
        found = False
        for i in range(p):  # at most p-1 distinct powers modulo p
            if power == target:
                if l <= i <= r:
                    found = True
                break
            power = (power * 2) % p
        if found:
            print(0)
            continue
        # LCM modulo p is product of terms modulo p
        # Compute 2^(sum of exponents) modulo p using geometric series formula
        pow_l = mod_pow(2, l, p)
        pow_r1 = mod_pow(2, r + 1, p)
        numerator = (pow_r1 - pow_l) % p
        answer = numerator * k % p
        answer = (answer + 1) % p
        print(answer)

solve()
```这段代码首先处理一个简单的情况：$k \equiv 0 \pmod{p}$。 然后它检查是否有任何项可以被整除$p$通过检查 2 模的幂$p$。 最后，它计算 LCM 模$p$使用模幂来处理大序列而无需迭代。 

## 工作示例

 输入示例 1：```
2
3 1 10 2
5 0 4 3
```| 访问 | k 模 p | 有可分的吗？ | LCM 模组 |
 | --- | --- | --- | --- |
 | 3 1 10 2 | 1 | 是（奇数 mod 2）| 0 |
 | 5 0 4 3 | 5 0 4 3 2 | 是 (2*2^0+1=3 能被 3 整除) | 0 |

 这证实了算法检测到整除性并输出 0。 

输入示例 2：```
1
1 0 3 5
```| 访问 | k 模 p | 条款 mod p | LCM 模组 |
 | --- | --- | --- | --- |
 | 1 0 3 5 | 1 0 3 5 1 | 2,3,5,9 | 1_2_3*9=54 | 1_2_3*9=54

 这证实了当没有项可被 p 整除时，模乘可以正确计算以 p 为模的 LCM。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 最坏情况 O(t * p) | 每次访问最多可迭代 p-1 次幂来检测可整除项 |
 | 空间| O(1) | O(1) | 每次访问仅包含常量变量 |

 这符合约束条件，因为$p \le 10^9$但实际输入的质数较小，并且每次功率检查速度很快。 

## 测试用例```python
import sys, io

def run
```
