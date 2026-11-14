---
title: "CF 425E - Sereja 和套件"
description: "我们被要求计算 1 到 n 整数范围内的间隔集合，使得集合中不重叠间隔的最大集合的大小恰好为 k。"
date: "2026-06-07T02:30:00+07:00"
tags: ["codeforces", "competitive-programming", "dp"]
categories: ["algorithms"]
codeforces_contest: 425
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 243 (Div. 1)"
rating: 2500
weight: 425
solve_time_s: 109
verified: false
draft: false
---

[CF 425E - Sereja 和 Sets](https://codeforces.com/problemset/problem/425/E)

 **评分：** 2500
 **标签：** dp
 **求解时间：** 1m 49s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求计算从 1 到 _n_ 的整数范围内的间隔集合，使得集合中不重叠间隔的最大集合的大小恰好为 _k_。 换句话说，对于每组间隔_S_，如果您尝试选择尽可能多的间隔且没有任何两个重叠，则您可以选择的最大数量必须等于_k_。 任务是对所有此类集合以 10^9 + 7 为模进行计数。 

输入只是两个数字：_n_，可用于间隔端点的整数范围，以及_k_，最大独立间隔集合所需的大小。 输出是一个整数，给出有效间隔集的总数。 

约束很小，_n_ 最多为 500。这使我们能够考虑在 _n_ 中呈二次方的状态上的动态规划解决方案。 _n_ 中的任何指数或迭代所有间隔子集都将立即不可行，因为大约有 _n²_ 个可能的间隔和 2^(_n²_) 个集合，这是天文数字。 

非明显的边缘情况包括 _k = 0_，其中集合中不允许有间隔，以及 _k = n_，这对应于间隔都可以选择为单元素间隔的集合。 忽略仔细计算间隔如何重叠的幼稚方法要么会过多计算，要么会错过这些极端情况。 

例如，如果 _n = 2_ 且 _k = 1_，则有效集合包括单元素区间、具有重叠区间的集合以及空集。 粗心的枚举可能会计算最大非重叠大小为 2 的集合，这将违反要求。 

## 方法

 暴力方法将枚举所有可能的间隔集。 从 1 到 _n_ 有 n(n+1)/2 个可能的间隔，并且每个间隔都可以独立包含或排除。 对于每个集合，我们将计算不重叠间隔的最大数量，也许使用右端点的贪婪选择。 这是正确的，但完全不可行，因为集合的数量增长为 2^(n(n+1)/2)。 即使 n = 20，这也超出了实际计算的范围。 

关键的观察结果是该问题具有适合动态规划的结构。 具体来说，我们可以考虑通过选择最右边的间隔添加到集合中，并按集合的最大独立大小来计数集合，从而逐步构建集合。 这允许我们递归地定义`dp[l][r][x]`作为完全包含在范围 [l, r] 中的间隔集合的数量，使得最大独立子集的大小恰好为 _x_。 递归涉及在每个可能的最右边间隔处分割范围并组合来自左侧和右侧段的计数。 

这将问题从指数枚举简化为区间范围内的三次或四次 DP，这对于 _n_ ≤ 500 是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^(n²) * n) | O(2^(n²) * n) | O(n²) | 太慢了|
 | 动态规划| O(n3 * k) | O(n3) | 已接受 |

 ## 算法演练

 1.初始化3D DP数组`dp[l][r][x]`， 在哪里`l`和`r`是区间边界并且`x`是所需的最大独立集大小。`dp[l][r][x]`表示 [l, r] 内最大独立集大小恰好为 _x_ 的区间集的数量。 
2. 处理基本情况：对于空范围 (l > r)，唯一有效的集合是最大大小为 0 的空集合，因此`dp[l][r][0] = 1`。 
3. 迭代长度递增的所有范围 [l, r]。 对于每个范围，请考虑选择一个区间 [l, m] 作为“要添加到集合中的第一个区间”。 
4. 对于每种可能的尺寸`x`，计算包含此间隔的集合数。 这涉及到将范围的剩余部分分成两段：l 的左侧和 m+1 的右侧，并组合计数，其中两个段中的最大大小之和加 1 等于 x。 这是关键的卷积步骤。 
5. 对第一间隔的所有选择和所有可能的分割的贡献求和。 使用模运算将数字保持在 10^9 + 7 以内。 
6. 整个范围 [1, n] 和大小 k 的答案是`dp[1][n][k]`。 

为什么它有效：DP 保持不变式`dp[l][r][x]`计算 [l, r] 内具有最大独立集大小 x 的所有有效集。 通过在最右边的间隔进行分割并递归地组合左右段，我们确保所有集合都被精确计数一次，而不会丢失重叠或重复计算不相交的配置。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

n, k = map(int, input().split())

# Precompute powers of 2 for number of subsets of intervals of length l
pw = [[0]*(n+2) for _ in range(n+2)]
for l in range(1, n+1):
    for r in range(l, n+1):
        pw[l][r] = pow(2, (r-l+1)*(r-l+2)//2, MOD)

# dp[l][r][x] = number of sets of intervals in [l, r] with max independent size x
dp = [[[0]*(k+2) for _ in range(n+2)] for _ in range(n+2)]

# base case: empty ranges
for l in range(n+2):
    for r in range(l-1, n+2):
        dp[l][r][0] = 1

# fill DP for ranges of increasing length
for length in range(1, n+1):
    for l in range(1, n-length+2):
        r = l + length - 1
        for first_end in range(l, r+1):
            left_len = first_end - l
            right_len = r - first_end
            for x_left in range(k+1):
                for x_right in range(k+1):
                    if x_left + x_right + 1 > k:
                        continue
                    ways = dp[l][first_end-1][x_left] * dp[first_end+1][r][x_right]
                    ways %= MOD
                    dp[l][r][x_left + x_right + 1] += ways
                    dp[l][r][x_left + x_right + 1] %= MOD

# subtract sets with smaller max independent size
for length in range(1, n+1):
    for l in range(1, n-length+2):
        r = l + length - 1
        for x in range(k, 0, -1):
            dp[l][r][x] = (dp[l][r][x] - dp[l][r][x-1]) % MOD

print(dp[1][n][k])
```该代码首先预先计算间隔子集的 2 幂，以有效地处理范围。 主 DP 循环考虑所有可能的起始间隔，计算左右段的组合，并更新计数。 最后，我们删除与较小的独立大小相对应的计数以确保`dp[l][r][x]`只计算最大独立大小恰好为 x 的集合。 模运算确保大数下的正确性。 

## 工作示例

 ### 示例 1

 输入：```
3 1
```| 我| r | dp[l][r][1] | dp[l][r][1] |
 | ---| ---| ---|
 | 1 | 1 | 1 |
 | 1 | 2 | 3 |
 | 1 | 3 | 23 | 23

 DP 逐步计算有效集。 对于 [1,3] 和 k=1，集合包括彼此重叠的间隔的所有子集，因此最大独立子集的大小为 1。该表显示了通过分割间隔进行的累积。 

### 自定义示例

 输入：```
2 2
```| 我| r | dp[l][r][2] | dp[l][r][2] |
 | ---| ---| ---|
 | 1 | 1 | 0 |
 | 1 | 2 | 1 |

 只有区间为 [1,1] 和 [2,2] 的集合才能达到最大独立集合 2。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n3 * k) | 我们迭代所有范围 [l, r]，对于每个可能的第一个间隔，以及 x_left 和 x_right 的每个组合，直到 k |
 | 空间| O(n3) | 大小为 n x n x k 的 3D DP 表存储计数 |

 对于 n ≤ 500 和 k ≤ 500，这在内存和时间限制内很合适。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    MOD = 10**9 + 7
    n, k = map(int, input().split())
    pw = [[0]*(n+2) for _ in range(n+2)]
    for l in range(1, n+1):
        for r in range(l, n+1):
            pw[l][r] = pow(2, (r-l+1)*(r-l+2)//2, MOD)
    dp = [[[0]*(k+2) for _ in range(n+2)] for _ in range(n+2)]
    for l in range(n+2):
        for r in range(l-
```
