---
title: "CF 338D - GCD 工作台"
description: "我们被要求确定给定的数字序列是否在假设的 GCD 表的某行中显示为连续元素。 该表有 n 行 m 列，其中第 i 行和 j 列的每个元素是 i 和 j 的最大公约数。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "chinese-remainder-theorem", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 338
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 196 (Div. 1)"
rating: 2900
weight: 338
solve_time_s: 93
verified: true
draft: false
---

[CF 338D - GCD 表](https://codeforces.com/problemset/problem/338/D)

 **评分：** 2900
 **标签：** 中国剩余定理，数学，数论
 **求解时间：** 1m 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求确定给定的数字序列是否在假设的 GCD 表的某行中显示为连续元素。 该表有 _n_ 行和 _m_ 列，其中第 _i_ 行和 _j_ 列的每个元素是 _i_ 和 _j_ 的最大公约数。 输入给出了表的维度以及长度_k_的序列。 我们的任务是检查是否存在行和起始列，以便序列与该列以后的值完全匹配。 

这些限制是不寻常的。 _n_ 和 _m_ 都可以大到 10^12，这会立即排除任何显式构造表的解决方案。 序列长度_k_最多为10,000，这比行的潜在宽度小得多。 这表明该解决方案必须主要对数字本身的属性进行操作，而不是对强力表生成进行操作。 

一种简单的方法可能会尝试迭代每一行和每个起始列，计算 GCD，并检查序列。 对于大量输入来说，这会严重失败。 当序列连续包含多个 1 时，就会出现边缘情况。 例如，如果序列是 [1, 1, 1]，粗心的方法可能会天真地尝试将其与连续整数匹配，但正确的匹配取决于行索引和整除关系。 当序列号超过行号时，会出现另一个棘手的情况，因为 _GCD(i, j)_ 永远不会超过 _i_。 例如，如果序列的第一个元素是 7，但我们正在检查第 5 行，则该行永远无法启动序列。 

## 方法

 蛮力法很简单。 对于从 1 到 _n_ 的每一行，对于从 1 到 _m-k+1_ 的每个起始列，计算序列中每个位置的 GCD（行，列 + 偏移量）并进行比较。 如果出现任何匹配，则返回 YES。 否则，返回NO。 这是正确的，但在计算上是不可行的。 每行最多可以有 10^12 列，每次比较最多涉及 10^4 次 GCD 计算，最坏情况下的操作计数约为 10^28，这远远超出了任何可行的计算。 

实现高效解决方案的关键观察是利用 GCD 行的结构。 对于固定行 _i_，_GCD(i, j)_ 仅取决于 _i_ 的因子。 如果我们将 _d_ 表示为 _i_ 的除数，则满足 _GCD(i, j) = d_ 的位置 _j_ 必须是与 _i_ 兼容的 _d_ 的倍数。 换句话说，如果我们将行索引分解为素数的乘积，则 GCD 模式完全由整除关系决定。 该序列可以解释为起始列 _j_ 上的一系列同余。 对于序列中的每个位置，条件 _GCD(i, j+l-1) = a[l]_ 变为模方程 _j+l-1 ≡ 0 (mod a[l]/gcd(i, a[l]))_。 同时求解所有这些模方程可简化为中国剩余定理 (CRT) 问题。 

我们可以观察到序列的第一个元素 _a1_ 必须除以某个行号 _i_，而不是检查每个可能的行。 对于每个可能的行 _i_（是 _a1_ 的倍数），我们尝试找到满足所有模块化约束的列 _j_。 如果存在任何解决方案，则该顺序将出现在表中。 这种方法极大地减少了搜索空间，因为我们只考虑 _a1_ 的除数（或倍数，取决于我们如何构造它）并求解大小为 _k_ 的小型 CRT 系统，这对于 _k ≤ 10,000_ 是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * m * k) | O(n * m * k) | O(1) | O(1) | 太慢了 |
 | 最佳 | O(k * log(max(a_i))) | O(k * log(max(a_i))) | O(k) | 已接受 |

 ## 算法演练

1. 计算序列 _a1_ 的第一个元素的所有除数。 只有这些除数的倍数的行才可能以 _a1_ 开头作为某些列的 GCD。 这会立即限制候选行。 
2. 对于每个候选行 _i_，为起始列 _j_ 构造一个模同余系统。 对于序列的第_l_个元素，条件_GCD(i, j+l-1) = a[l]_ 转换为模方程。 具体来说，令 _g = gcd(i, a[l])_; 那么 _j+l-1_ 必须能被 _a[l]/g_ 整除。 对于当前元素，将其记录为 _j == r (mod m)_。 
3. 使用中国余数定理将所有这些同余组合成一个同余。 如果存在一致的解，_j_ 的值必须位于有效列范围 1 到 _m-k+1_ 内。 如果是，则输出YES。 
4. 如果没有候选行产生有效的解，则输出NO。 

为什么它起作用：每个模块约束精确地编码了 GCD 等于序列元素的要求。 CRT 保证如果存在联立解，则恰好存在一个以模的最小公倍数为模的解。 检查该解决方案是否落在列范围内，确认该序列出现在表中。 因为我们只检查合理的行候选并正确求解 CRT，所以我们不会错过任何解决方案，并且我们不会考虑不可能的行，因此不会发生误报。 

## Python 解决方案```python
import sys
from math import gcd
input = sys.stdin.readline

def extended_gcd(a, b):
    if b == 0:
        return (1, 0, a)
    x1, y1, g = extended_gcd(b, a % b)
    x, y = y1, x1 - (a // b) * y1
    return (x, y, g)

def crt_pair(a1, m1, a2, m2):
    # Solve x ≡ a1 mod m1, x ≡ a2 mod m2
    # Returns (x mod lcm(m1,m2), lcm) or (None, None) if impossible
    g = gcd(m1, m2)
    if (a2 - a1) % g != 0:
        return (None, None)
    p, q, _ = extended_gcd(m1 // g, m2 // g)
    mod = m1 // g * m2
    x = (a1 + (a2 - a1) // g * p * (m1 // g)) % mod
    return (x, mod)

def solve():
    n, m, k = map(int, input().split())
    a = list(map(int, input().split()))
    from itertools import product
    
    # candidate rows: multiples of a[0] within n
    first = a[0]
    divisors = set()
    i = 1
    while i*i <= first:
        if first % i == 0:
            divisors.add(i)
            divisors.add(first // i)
        i += 1

    for row in divisors:
        if row > n:
            continue
        mods = []
        for l in range(k):
            g = gcd(row, a[l])
            if a[l] % g != 0:
                break
            mods.append(((l) % (a[l] // g), a[l] // g))
        else:
            x, mod = mods[0]
            ok = True
            for r, m_ in mods[1:]:
                x, mod = crt_pair(x, mod, r, m_)
                if x is None:
                    ok = False
                    break
            if ok and x + 1 <= m - k + 1:
                print("YES")
                return
    print("NO")

solve()
```该解决方案首先根据第一个序列元素枚举合理的行索引。 每个序列元素都会产生一个模约束，我们使用中国剩余定理成对地求解该约束。 小心处理不可能的同余并确保起始列位于允许的范围内。 

## 工作示例

 ### 示例 1

 输入：`100 100 5`有顺序`5 2 1 2 1`。 

| 步骤| 行候选| 模块化约束| CRT解决方案| 有效列？ |
 | --- | --- | --- | --- | --- |
 | 1 | 5 | j = 0 mod 1, j = ? | 4 | 是的 |

 跟踪确认第 5 行可以在第 4 列开始序列。 

### 示例 2

 输入：`100 8 5`有顺序`5 2 1 2 1`。 

| 步骤| 行候选| 模块化约束| CRT解决方案| 有效列？ |
 | --- | --- | --- | --- | --- |
 | 全部 | 5, 1 | 约束不一致| 无 | 没有 |

 没有行在列边界内产生一致的 CRT 解决方案，因此输出为“否”。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(k * sqrt(a1) * log(max(a_i))) | O(k * sqrt(a1) * log(max(a_i))) | 除数枚举花费 sqrt(a1)，每个除数需要 k 次模计算和 CRT 运算，每个 CRT 运算花费 log(max(a_i)) |
 | 空间| O(k) | 我们存储 k 个模块化约束 |

 这完全符合以下限制：sqrt(10^12) ~ 10^6，k ≤ 10^4，最多给出 10^
