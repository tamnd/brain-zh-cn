---
title: "CF 105190H - 阿里如何看待黑色"
description: "令 dp[n] 为初始集合 {1,2,...,n} 所需的最小操作数。 假设第一个操作选择x。 元素 x 立即消失。 每个小于 x 的值保持不变，而每个大于 x 的值都会减少 x。"
date: "2026-06-27T04:20:35+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105190
codeforces_index: "H"
codeforces_contest_name: "Al-Baath Collegiate Programming Contest 2024"
rating: 0
weight: 105190
solve_time_s: 36
verified: true
draft: false
---

[CF 105190H - 阿里如何看待黑色](https://codeforces.com/problemset/problem/105190/H)

 **评级：** -
 **标签：** -
 **求解时间：** 36s
 **已验证：** 是的

 ## 解决方案
 让`dp[n]`是初始集合所需的最少操作数`{1,2,...,n}`。 

假设第一个操作选择`x`。 

元素`x`立即消失。 每个值小于`x`保持不变，而每个大于的值`x`减少了`x`。 去掉零后，剩下的值恰好是`{1,2,...,x-1}`和`{1,2,...,n-x}`。 

这两部分是完全独立的。 由于重复值永远不会使问题变得更加困难，因此剩余的工作仅由这两个范围中较大的一个决定。 较大的尺寸是`max(x-1, n-x)`。 

因此`dp[n] = 1 + min(max(dp[x-1], dp[n-x]))`。 

最好的选择始终是尽可能均匀地分割范围，所以`max(x-1, n-x) = floor(n/2)`,

 给出更简单的递归`dp[0] = 0`

`dp[n] = dp[n//2] + 1`。 

为了`n ≤ 100`，一个小小的DP就够了。```python
import sys
input = sys.stdin.readline

n = int(input())

dp = [0] * (n + 1)
for i in range(1, n + 1):
    dp[i] = dp[i // 2] + 1

print(dp[n])
```这种递归形式相当于封闭形式`dp[n] = floor(log2(n)) + 1`为了`n ≥ 1`。 因此，例如，`n = 47`给出`5 + 1 = 6`，匹配样本。
