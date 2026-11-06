---
title: "CF 190D - 非秘密密码"
description: "我们得到一个整数序列和一个阈值 $k$。 任务是计算有多少个连续子数组包含某个在该子数组内至少出现 $k$ 次的值。"
date: "2026-06-03T01:19:49+07:00"
tags: ["codeforces", "competitive-programming", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 190
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 120 (Div. 2)"
rating: 1900
weight: 190
solve_time_s: 24
verified: false
draft: false
---

[CF 190D - 非秘密密码](https://codeforces.com/problemset/problem/190/D)

 **评级：** 1900
 **标签：** 两个指针
 **求解时间：** 24s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们给出一个整数序列和一个阈值$k$。 任务是计算有多少个连续子数组包含至少出现的某个值$k$该子数组内的时间。 

同样，对于数组的每个段，我们检查是否存在该段内频率达到的元素$k$，我们想要计算发生这种情况的所有段。 

限制条件很大：$n \le 4 \cdot 10^5$。 任何显式检查所有子数组的方法都会立即变得太慢，因为子数组的数量是$O(n^2)$，达到约$8 \cdot 10^{10}$在最坏的情况下。 甚至每个子阵列的线性扫描也是不可能的。 这迫使我们采用线性或近线性的两指针或离线计数策略。 

出现微妙的边缘情况时$k = 1$。 在这种情况下，每个子数组都是有效的，因为任何元素都已经至少出现过一次。 例如，对于数组$[5, 7, 5]$，每个子数组都符合条件，答案是$\frac{n(n+1)}{2} = 6$。 假设必须跟踪重复发生的简单实现可能仍然有效，但它通常会使这个微不足道的情况变得过于复杂。 

当所有元素都不同并且$k \ge 2$。 例如，$[1, 2, 3, 4]$和$k = 2$有答案$0$。 很多不正确
