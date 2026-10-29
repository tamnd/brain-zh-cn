---
title: "CF 1493D - 数组的 GCD"
description: "我们得到一个整数数组，我们需要处理一系列查询，其中每个查询将数组的特定元素乘以给定因子。 每次查询后，我们必须计算整个数组以 $10^9+7$ 为模的最大公约数 (GCD)。"
date: "2026-06-10T22:15:06+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "hashing", "implementation", "math", "number-theory", "sortings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1493
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 705 (Div. 2)"
rating: 2100
weight: 1493
solve_time_s: 52
verified: false
draft: false
---

[CF 1493D - 数组的 GCD](https://codeforces.com/problemset/problem/1493/D)

 **评分：** 2100
 **标签：** 暴力破解、数据结构、哈希、实现、数学、数论、排序、两个指针
 **求解时间：** 52s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组，我们需要处理一系列查询，其中每个查询将数组的特定元素乘以给定因子。 每次查询后，我们必须计算整个数组模的最大公约数（GCD）$10^9+7$。 输入数组最多可达$2 \cdot 10^5$元素，并且可以有任意多个查询。 涉及的数字，包括乘数，也取决于$2 \cdot 10^5$。 

一个简单的解决方案是在每次查询后从头开始重新计算 GCD，这需要每次都迭代整个数组。 和$n$和$q$可能两者兼而有之$2 \cdot 10^5$，这会导致$O(nq) \approx 4 \cdot 10^{10}$操作，远远超出了2秒的限制。 因此，我们需要一种更快的方法来避免重复重新计算完整的 GCD。 

非明显的边缘情况包括某些元素等于 1 的数组，或多个元素仅共享其素因数分解的一部分的数组。 例如，如果数组是$[2, 3, 5]$我们将第一个元素乘以 3，GCD 从 1 变为 1。如果假设与任何元素相乘总是增加 GCD，那么简单的实现可能会失败。 

我们还必须仔细考虑模运算。 GCD 本身是通过整数计算的，但最终输出需要模数$10^9+7$。 在计算素因子贡献之前不小心应用模可能会产生错误的答案。 

## 方法

 暴力方法在每次查询后迭代数组，计算所有元素的 GCD。 这是正确的，因为 GCD 是关联的，并且迭代所有元素会给出正确的结果。 然而，随着$n$和$q$最多$2 \cdot 10^5$，最坏情况下的操作次数为$O(nq) = 4 \cdot 10^{10}$，这对于 2 秒来说太慢了。 

关键的观察是一组数字的 GCD 完全由它们的素因数分解决定。 我们可以代表
