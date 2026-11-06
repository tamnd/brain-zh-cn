---
title: "CF 1882D - 树异或"
description: "我们有一棵树，其中每个顶点都包含一个数字。 选择根后，我们可以重复选择一个顶点，并将其子树内的每个值与某个非负整数 c 进行异或。 应用这样的咒语需要花费（子树大小）×c。"
date: "2026-06-08T22:35:30+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "dfs-and-similar", "dp", "greedy", "trees"]
categories: ["algorithms"]
codeforces_contest: 1882
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 899 (Div. 2)"
rating: 1900
weight: 1882
solve_time_s: 47
verified: false
draft: false
---

[CF 1882D - 树异或](https://codeforces.com/problemset/problem/1882/D)

 **评级：** 1900
 **标签：** 位掩码、dfs 和类似的、dp、贪婪、树
 **求解时间：** 47s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一棵树，其中每个顶点都包含一个数字。 选择根后，我们可以重复选择一个顶点，并通过某个非负整数对其子树内的每个值进行异或`c`。 

应用这样的咒语需要花费`(subtree size) × c`。 

对于每一种可能的根选择，我们必须找到使所有顶点值相等所需的最小总成本。 

根很重要，因为当树的根不同时，子树的概念就会发生变化。 相同的边可以根据所选择的根将树分成不同的父子关系，因此对于不同的根来说，最优成本通常是不同的。 

制约因素很大。 在所有测试用例中，顶点总数最多为`2 · 10^5`。 任何为每个根独立重新计算答案的解决方案都需要大约`O(n^2)`在最坏的情况下工作，这远远超出了 3 秒的限制。 我们需要每个测试用例接近线性的时间。 

一个微妙的点是最终的公共值不是f
