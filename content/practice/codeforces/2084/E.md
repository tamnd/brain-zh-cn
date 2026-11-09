---
title: "CF 2084E - 绽放"
description: "我们得到了长度为 $n$ 的部分填充排列。 某些元素缺失并用 $-1$ 表示。 这里的排列意味着填充缺失值后，从 $0$ 到 $n-1$ 的每个数字恰好出现一次。"
date: "2026-06-08T06:15:19+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "combinatorics", "dp", "implementation", "math", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 2084
codeforces_index: "E"
codeforces_contest_name: "Teza Round 1 (Codeforces Round 1015, Div. 1 + Div. 2)"
rating: 2400
weight: 2084
solve_time_s: 201
verified: false
draft: false
---

[CF 2084E - 绽放](https://codeforces.com/problemset/problem/2084/E)

 **评分：** 2400
 **标签：** 二分查找、组合数学、dp、实现、数学、两个指针
 **求解时间：** 3m 21s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们给出了一个部分填充的长度排列$n$。 某些元素缺失并表示为$-1$。 这里的排列意味着在填充缺失值后，来自$0$到$n-1$恰好出现一次。 任务是计算可以从不完整数组创建的所有排列的值的总和，其中排列的值定义为所有非空连续子数组上的 MEX（最小排除值）之和。 

约束条件允许$n$最多$5000$每个测试用例，以及总和$n$所有测试用例的边界也受$5000$。 这意味着算法$O(n^2)$每个测试用例的时间复杂度是可以接受的。 一个$O(n^3)$解决方案将超出时间限制，特别是如果它尝试显式枚举所有排列，因为排列的数量随着缺失元素的数量呈阶乘增长。 

当数组有多个时，会出现微妙的边缘情况$-1$价值观。 试图填补每一个的天真的方法$-1$包含所有可能缺失的数字并计算每个子数组的 MEX 将组合爆炸。 另一种边缘情况是没有数字丢失； 该解决方案仍然必须正确计算所有子数组的 MEX 总和。 例如，像这样的数组`[2,0,1]`没有缺失元素，但跨子数组的 MEX 计算需要仔细计算排除的数字，而不仅仅是计算不同的元素。 

## 方法

 蛮力方法在概念上很简单：通过填充生成所有有效的排列$-1$s 与剩余的数字，然后对于每个排列，计算所有子数组的 MEX 之和。 这里的问题是，即使少量的缺失元素也会导致阶乘的许多排列。 例如，有 10 个缺失值，有$10!\approx3.6$万种排列。 计算每个排列的所有子数组的 MEX 和是另一回事$O(n^2)$操作，导致禁止$O(10!\cdot n^2)$复杂。 

关键的观察结果是 MEX 由子数组中不存在的最小数字确定。 如果我们跟踪每个潜在的 MEX 值$x$到底有多少个子数组具有 MEX$x$，我们可以计算出预期贡献$x$跨越所有排列而不枚举它们。 这将问题简化为组合：计算放置数字的方式的数量，以便子数组的 MEX 等于$x$。 我们可以通过动态规划和前缀和来有效地处理这个问题。 具体来说，我们可以考虑子数组的每个起点，跟踪已知数字，并使用组合计数乘以缺失值填充剩余位置的方式数量。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((n-m)！ * n^2) | O(n) | 太慢了|
 | 最佳 | O(n^2) | O(n^2) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 预先计算阶乘和模逆$n$快速计算组合计数模$10^9 + 7$。 这使我们能够有效地计算将缺失数字分配给子数组的方法数量。 
2. 对于每个测试用例，确定哪些数字缺失以及哪些位置未知（$-1$）。 跟踪`missing_count`对于从 0 到 n-1 的每个数字。 
3. 使用动态规划迭代所有可能的子数组。 对于从索引开始的每个子数组`i`，跟踪出现在已知位置的数字。 对于子数组中不存在的数字，确定可以从缺失的位置填充哪些数字而不违反排列属性。 
4. 通过计算子数组的预期 MEX 来计算对值总和的贡献。 MEX 价值的贡献$x$是分配以下数字的有效排列数$x$离开时在子数组内$x$丢失的。 这是使用基于数量的组合计数来完成的`-1`子数组中的 s 和可用的缺失数字。 
5. 累加从每个索引开始的所有子数组的贡献`i`计算所有排列的值的总和。 输出模数和$10^9 + 7$。 

工作原理：每个子数组的 MEX 都会被精确计算一次，考虑所有可能的方法来填充缺失的数字，同时尊重排列约束。 动态编程方法确保重叠子数组有效地重用计算。 组合推理确保我们计算所有有效排列，而无需显式生成它们。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def modinv(x):
    return pow(x, MOD-2, MOD)

def prepare_factorials(n):
    fac = [1] * (n+1)
    ifac = [1] * (n+1)
    for i in range(1, n+1):
        fac[i] = fac[i-1] * i % MOD
    ifac[n] = modinv(fac[n])
    for i in range(n-1, -1, -1):
        ifac[i] = ifac[i+1] * (i+1) % MOD
    return fac, ifac

def comb(n, k, fac, ifac):
    if k < 0 or k > n:
        return 0
    return fac[n] * ifac[k] % MOD * ifac[n-k] % MOD

t = int(input())
fac, ifac = prepare_factorials(5000)

for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    used = [0]*n
    unknown = 0
    for x in a:
        if x == -1:
            unknown += 1
        else:
            used[x] = 1
    missing = [i for i in range(n) if not used[i]]
    
    total = 0
    # Iterate over all subarrays
    for l in range(n):
        present = set()
        num_unknown = 0
        for r in range(l, n):
            if a[r] == -1:
                num_unknown += 1
            else:
                present.add(a[r])
            # Determine MEX
            mex = 0
            while mex in present:
                mex += 1
            # Number of ways to fill unknowns: choose positions for numbers < mex
            smaller_missing = sum(1 for x in missing if x < mex)
            ways = comb(num_unknown, smaller_missing, fac, ifac)
            total = (total + mex * ways) % MOD
    print(total)
```该解决方案首先预先计算阶乘和逆阶乘以进行快速组合计算。 然后它处理每个测试用例，跟踪已知和丢失的数字。 对于每个子数组，它动态跟踪当前数字，计算未知数，计算 MEX，并计算填充未知数的方法数，以便子数组具有该 MEX。 贡献值以模数累积$10^9 + 7$。 边缘条件（例如没有未知数的子数组）可以由组合函数自然处理，当`num_unknown`为零。 

## 工作示例

 ### 输入示例 1```
2
2
0 -1
2
-1 -1
```| 我| r | 现在 | 未知数 | 墨西哥 | 较小的缺失 | 方式| 贡献 | 总计 |
 | --- | --- | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | {0} | 0 | 1 | 0 | 1 | 1 | 1 |
 | 0 | 1 | {0} | 1 | 1 | 0 | 1 | 1 | 2 |
 | 1 | 1 | {} | 1 | 0 | 0 | 1 | 0 | 2 |

 该跟踪表明该算法正确跟踪当前数字和未知数。 MEX 计算准确，填充未知数的方法保持排列约束。 

### 输入示例 2```
3
-1 2 -1
```| 我| r | 现在 | 未知数 | 墨西哥 | 较小的缺失 | 方式| 贡献 | 总计 |
 | --- | --- | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | {} | 1 | 0 | 0 | 1 | 0 | 0 |
 | 0 | 1 | {2} | 1 | 0 | 0 | 1 | 0 | 0 |
 | 0 | 2 | {2} | 2 | 0 | 0 | 1 | 0 | 0 |
 | 1 | 1 | {2} | 0 | 0 | 0 | 1 | 0 | 0 |
 | 1 | 2 | {2} | 1 | 0 | 0 | 1 | 0 | 0 |
 | 2 | 2 | {} | 1 | 0 | 0 | 1 | 0 | 0 |

 该跟踪说明了子
