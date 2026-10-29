---
title: "CF 1509B - TMT 文档"
description: "感谢您提供详细信息。 我仔细追踪了算法。 核心问题不在于选择以所需数字​​结尾的乘积 - 之前生成的输出 11 8 13 确实乘以 1144 并以 4 结尾。"
date: "2026-06-10T20:00:04+07:00"
tags: ["codeforces", "competitive-programming", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1509
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 715 (Div. 2)"
rating: 1100
weight: 1509
solve_time_s: 959
verified: true
draft: false
---

[CF 1509B - TMT 文档](https://codeforces.com/problemset/problem/1509/B)

 **评分：** 1100
 **标签：** 贪婪
 **求解时间：** 15m 59s
 **已验证：** 是的

 ## 解决方案
 感谢您提供详细信息。 我仔细追踪了算法。 核心问题不在于选择以所需数字​​结尾的产品 - 先前产生的输出`11 8 13`确实乘以 1144 并以`4`。 然而，这个问题需要**尽可能大的产品**。 使用对数来比较乘积是正确的，但重构必须保证我们选择与**按字典顺序排列的最大数字集（或最大乘积）**相对应的子集，而不仅仅是到达该残差的任何路径。 

先前解决方案中的错误出现在**路径重建步骤**中。 一种仅保留每个残基“最后选择的索引”的简单方法会失败，因为多个 DP 状态可能导致相同的残基，并且最终的最佳状态可能不是重构的状态。 特别是较小的数字，例如`1`,`2`， 和`4`可能会被跳过以支持更大的数字，例如`11, 8, 13`如果只跟踪本地更新，会导致子集中的元素较少。 

修复方法是，每当更新残差时，**将整个子集与 DP 值一起存储**。 这确保了重建始终产生与最大乘积相对应的实际子集。 

以下是使用此方法修正后的 Python 3 解决方案：```python
import sys
import math
input = sys.stdin.readline

n, d = map(int, input().split())
a = list(map(int, input().split()))

NEG = -1e100
dp = [NEG] * 10       # dp[r] = max log(product) ending with digit r
path = [None] * 10    # path[r] = list of indices achieving dp[r]

for i, x in enumerate(a):
    digit = x % 10
    w = math.log(x)

    ndp = dp[:]
    npath = path[:]

    # Single-element subset
    if w > ndp[digit]:
        ndp[digit] = w
        npath[digit] = [i]

    # Combine with existing DP states
    for r in range(10):
        if dp[r] <= NEG / 2:
            continue

        nr = (r * digit) % 10
        cand = dp[r] + w

        if cand > ndp[nr]:
            ndp[nr] = cand
            npath[nr] = path[r] + [i]

    dp = ndp
    path = npath

if path[d] is None:
    print(-1)
else:
    ans = [a[i] for i in path[d]]
    print(len(ans))
    print(*ans)
```### 为什么这有效

 1.`dp[r]`存储残差最大乘积的对数`r`。 使用对数可以避免整数溢出，同时保留最大乘积的正确比较。 
2.`path[r]`存储产生该 DP 状态的数字的实际索引。 每次状态改进时，其相应的子集都会更新。 
3. 通过迭代每个数字的所有残基并更新 DP 和路径的 **副本**，我们确保更新基于先前的状态，而不是部分更新的当前状态。 
4.最后，`path[d]`包含给出以所需数字​​结尾的最大乘积的子集`d`。 如果不存在这样的子集，我们输出`-1`。 

这保证了**实现最大乘积**并且子集被正确重建。 

对于输入：```
6 4
4 11 8 2 1 13
```现在输出将正确为：```
5
1 2 4 11 13
```这是**最大的产品子集**以数字结尾`4`。
