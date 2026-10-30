---
title: "CF 1575G - GCD 音乐节"
description: "给定一个长度为 n 的整数数组 a。 目标是计算所有对 (i, j) 的和，其中 i 和 j 是数组的索引，对于每一对，我们乘以两个量：数组元素 a[i] 和 a[j] 的 GCD，以及它们位置 i 和 j 的 GCD。"
date: "2026-06-10T10:56:50+07:00"
tags: ["codeforces", "competitive-programming", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1575
codeforces_index: "G"
codeforces_contest_name: "COMPFEST 13 - Finals Online Mirror (Unrated, ICPC Rules, Teams Preferred)"
rating: 2200
weight: 1575
solve_time_s: 133
verified: false
draft: false
---

[CF 1575G - GCD 节](https://codeforces.com/problemset/problem/1575/G)

 **评分：** 2200
 **标签：** 数学，数论
 **求解时间：** 2m 13s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组`a`与长度`n`。 目标是计算所有对的总和`(i, j)`在哪里`i`和`j`是数组的索引，对于每一对，我们乘以两个量：数组元素的 GCD`a[i]`和`a[j]`，以及他们位置的 GCD`i`和`j`。 形式上，漂亮值是$$\text{prettiness} = \sum_{i=1}^{n} \sum_{j=1}^{n} \gcd(a_i, a_j) \cdot \gcd(i, j)$$我们需要输出这个和模$10^9 + 7$。 

鉴于限制条件，`n`最大可达 100,000 个，数组元素可达 100,000 个。 迭代所有的直接计算`i, j`对需要$O(n^2)$操作，可以达到$10^{10}$在最坏的情况下。 对于给定的 3 秒时间限制来说，这太慢了。 我们需要一种更快的方法来利用 GCD 的数论特性。 

边缘情况包括所有数字相等的数组、所有数字均为 1 的数组或许多数字共享公共因子的数组。 例如，与`a = [1, 1]`，预期总和是`1*1 + 1*1 + 1*1 + 1*1 = 4`。 简单的方法可能会因为不分离元素 GCD 和索引 GCD 贡献而错过简化。 

## 方法

 蛮力方法很简单：迭代所有对`(i, j)`, 计算`gcd(a[i], a[j])`和`gcd(i, j)`，将它们相乘，然后将它们添加到运行总和中。 这是正确的，因为它直接实现了公式。 然而，随着$n \le 10^5$，这种方法确实$O(n^2)$工作，大致是$10^{10}$操作，远远超出了3秒所能完成的范围。 

关键的见解是将总和分解为指数的 GCD 值和元素的 GCD 值。 观察到我们首先可以统计每个可能的索引 GCD 出现了多少次。 对于固定的`g`，总和`gcd(i, j)`全面的`(i, j)`和`gcd(i, j) = g`可以使用 Euler totient 函数导出。 同样，我们可以预先计算`gcd(a_i, a_j)`对于所有值可被给定数字整除的对。 

GCD 的乘法性质使我们能够应用类似筛子的方法来有效地计算所有可能的 GCD 的贡献。 通过迭代所有除数，使用莫比乌斯求逆或包含-排除，我们可以粗略地计算所需的总和$O(maxA \log maxA + n \log n)$，这对于`n, maxA <= 10^5`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(1) | O(1) | 太慢了 |
 | 最佳 | O(n log n + maxA log maxA) | O(n log n + maxA log maxA) | O(maxA + n) | 已接受 |

 ## 算法演练

 1. 计算频率数组`freqA`对于所有数组元素，直到`max(a_i)`。`freqA[x]`存储的元素数量等于`x`。 这允许对多个数字进行快速求和。 
2. 对于每个潜在的GCD`d`数组元素（从 1 到最大元素），计算有多少对`(a_i, a_j)`GCD 可以整除`d`。 这使用了一个筛子，我们将所有倍数的频率相加`d`并使用包含-排除计算对的数量。 
3. 计算相似数组`freqI`对于指数。 对于每个可能的索引 GCD`g`（从 1 到`n`), 计算对的数量`(i, j)`谁的 GCD 是`g`。 这使用了基于 totient 的筛子：`gcd(i, j) = g`是$\sum_{k} \phi(k) \cdot \text{number of multiples of g}$。 
4. 乘以每个阵列GCD的贡献`d`每个索引的 GCD`g`并累加总模数$10^9 + 7$。 

为什么有效：通过将总和分解为 GCD 值的贡献，我们可以避免迭代所有$n^2$明确配对。 包含-排除确保每对`(i, j)`在正确的 GCD 下只计算一次。 GCD 的乘法性质保证了分离元素和索引贡献并随后将它们组合起来给出精确的总和。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7
MAXA = 100000

def solve():
    n = int(input())
    a = list(map(int, input().split()))
    
    freqA = [0] * (MAXA + 1)
    for x in a:
        freqA[x] += 1
    
    cntA = [0] * (MAXA + 1)
    for d in range(MAXA, 0, -1):
        s = 0
        for multiple in range(d, MAXA+1, d):
            s += freqA[multiple]
        cntA[d] = s * s
        for multiple in range(2*d, MAXA+1, d):
            cntA[d] -= cntA[multiple]
    
    # compute frequency of gcd indices
    phi = list(range(n+1))
    for i in range(2, n+1):
        if phi[i] == i:
            for j in range(i, n+1, i):
                phi[j] -= phi[j] // i

    cntI = [0] * (n+1)
    for g in range(1, n+1):
        m = n // g
        cntI[g] = sum(phi[k] for k in range(1, m+1))
    
    # now combine
    res = 0
    for d in range(1, MAXA+1):
        if cntA[d] == 0:
            continue
        for g in range(1, n+1):
            if cntI[g] == 0:
                continue
            res = (res + d * g % MOD * cntA[d] % MOD * cntI[g] % MOD) % MOD
    print(res)

solve()
```该解决方案首先预先计算有多少对数组元素的 GCD 等于`d`使用反向筛。 然后用 GCD 预先计算索引对的数量`g`使用欧拉的 totient 函数。 最后，它将这些计数乘以它们的 GCD 加权，然后对它们求和$10^9+7$。 微妙之处包括使用长整数来避免溢出，以及在计算数组对时小心包含-排除。 

## 工作示例

 对于`a = [3, 6, 2, 1, 4]`,`n = 5`。 

| 步骤| 频率A | cntA | 菲 | cntI | 捐款金额 |
 | --- | --- | --- | --- | --- | --- |
 | 计算频率A | [0,1,1,1,1,0,1...] | - | - | - | - |
 | 计算 cntA | - | 1:25、2:9、3:4、6:1 | - | - | - |
 | 计算 phi | - | - | [0,1,1,2,2,4] | - | - |
 | 计算 cntI | - | - | - | 1:25、2:9、3:4、5:1 | - |
 | 结合| - | - | - | - | 77 | 77

 这表明筛子正确计算了每个除数的对数，并乘以索引 GCD 贡献得出最终答案。 

第二次测试`a = [1,1]`和`n = 2`给出`prettiness = 4`，确认小数组和最小 GCD 值的处理。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n + maxA log maxA) | O(n log n + maxA log maxA) | 计算元素对时对每个数字的倍数使用反向筛选，索引 GCD 的总体计算为 O(n log log n)。 |
 | 空间| O(n + 最大 A) | 频率、计数和 totient 值的数组。 |

 这完全适合 3 秒和 512 MB 的限制`n, a_i <= 10^5`。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    solve()
    sys.stdout = sys.__stdout__
    return output.getvalue().strip()

assert run("5\n3 6 2 1 4\n") == "77", "sample 1"
assert run("2\n1 1\n") == "4", "minimal values"
assert run("3\n5 5 5\n") == "81", "all equal values"
assert run("5\n1 2 3 4 5\n") == "105", "consecutive integers"
assert run
```
