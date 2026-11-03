---
title: "CF 1736A - 使 A 等于 B"
description: "这是一个 B 类（证明）问题。 该声明要求对所有自然数 $n$ 进行通用声明，即 $S(7n)$ 或 $S(9n)$ 中至少有一个超过 $S(n)/5$。"
date: "2026-06-09T18:00:22+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1736
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 825 (Div. 2)"
rating: 800
weight: 1736
solve_time_s: 117
verified: false
draft: false
---

[CF 1736A - 使 A 等于 B](https://codeforces.com/problemset/problem/1736/A)

 **评分：** 800
 **标签：** 暴力、贪婪、排序
 **求解时间：** 1m 57s
 **已验证：** 否

 ## 解决方案
 ## 问题类型检查

 这是一个 **B 类（证明）** 问题。 该声明要求对所有自然数有一个普遍的主张$n$，即至少其中之一$S(7n)$或者$S(9n)$超过$S(n)/5$。 有效的解决方案必须严格建立所有人的不平等$n$，不仅仅是为了小例子或通过直觉。 需要有适当理由的逐步逻辑推论。 

## 逐步验证

 **步骤 1：用较小的值进行探索$n$** - 有效的。 的计算$n=1,2,10,111$正确地说明了不等式的合理性，但它们并不构成证明。 

**步骤 2：引理 1，声明$S(9k) \ge S(k)$为所有人$k$**
