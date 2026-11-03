---
title: "CF 1742G - 奥瑞"
description: "任务是重新排列给定的非负整数数组，以便前缀 OR 数组按字典顺序尽可能大。"
date: "2026-06-09T16:18:34+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "brute-force", "greedy", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1742
codeforces_index: "G"
codeforces_contest_name: "Codeforces Round 827 (Div. 4)"
rating: 1500
weight: 1742
solve_time_s: 120
verified: false
draft: false
---

[CF 1742G - Orray](https://codeforces.com/problemset/problem/1742/G)

 **评分：** 1500
 **标签：** 位掩码、暴力破解、贪心、数学、排序
 **求解时间：** 2m
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 任务是重新排列给定的非负整数数组，以便前缀 OR 数组按字典顺序尽可能大。 前缀 OR 数组定义为$b_i = a_1 ,\mathsf{OR}, a_2 ,\mathsf{OR}, \dots ,\mathsf{OR}, a_i$，表示每个元素$b_i$表示从数组开头到位置的累积按位或$i$。 目标是排列$a$最大化$b$按字典顺序排列，这意味着第一个元素$b$应尽可能大，如果存在平局，则第二个元素应尽可能大，依此类推。 

输入包含多个测试用例，所有数组的总大小不超过$2 \cdot 10^5$。 这个约束意味着算法$O(n^2)$复杂性不会有效运行，但是$O(n \log n)$或者$O(n \cdot 30)$操作是可以接受的，因为每个数字最多是$10^9$, 最多意味着
