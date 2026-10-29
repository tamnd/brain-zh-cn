---
title: "CF 1530C - 追击"
description: "我们有一个有多个阶段的竞赛，每个阶段的得分在 0 到 100 分之间。 你和伊利亚已经完成了 n 个阶段，我们知道你们俩的分数。"
date: "2026-06-10T16:52:07+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1530
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 733 (Div. 1 + Div. 2, based on VK Cup 2021 - Elimination (Engine))"
rating: 1200
weight: 1530
solve_time_s: 45
verified: false
draft: false
---

[CF 1530C - 追求](https://codeforces.com/problemset/problem/1530/C)

 **评分：** 1200
 **标签：** 二分查找、暴力破解、贪心、排序
 **求解时间：** 45s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个有多个阶段的竞赛，每个阶段的得分在 0 到 100 分之间。 你和伊利亚已经完成了`n`阶段，我们知道你们俩的分数。 比赛仅选取最高的参赛者进行排名`k - floor(k / 4)`分数超出第一名`k`阶段，将它们相加得到总分。 

问题是：给定你当前的分数和 Ilya 的分数，假设 Ilya 在这些额外的阶段中没有得分，理论上你需要达到至少等于 Ilya 的总分的额外满分阶段（100 分）的最小数量是多少？ 

输入保证了总和`n`所有测试用例最多`10^5`。 自从`n`可以达到`10^5`，任何天真地尝试额外阶段的所有可能性的算法都会太慢。 我们需要比 `O(n
