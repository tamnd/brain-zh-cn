---
title: "CF 104886E - 随机树路径匹配"
description: "我们有一棵有根树，每个顶点都有权重。 For each query, we look at two nodes, take the unique simple path from the root to each of them, and then try to “align” these two root-to-node paths."
date: "2026-06-28T09:06:59+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104886
codeforces_index: "E"
codeforces_contest_name: "USI-Team-Selection 2023-2024"
rating: 0
weight: 104886
solve_time_s: 29
verified: false
draft: false
---

[CF 104886E - Random Tree Path Match](https://codeforces.com/problemset/problem/104886/E)

 **评级：** -
 **标签：** -
 **Solve time:** 29s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一棵有根树，每个顶点都有权重。 对于每个查询，我们查看两个节点，采用从根到每个节点的唯一简单路径，然后尝试“对齐”这两个根到节点路径。 

The task is not to compare the paths directly as sequences, but to pick two subsequences, one from each root-to-node path, with the same length. Once we pick such a pair of subsequences, we pair elements position-wise and compute the sum of products of the corresponding weights. The goal for each query is to maximize this value.

 因此，从概念上讲，我们沿着两条根到节点路径选择一系列匹配节点，保留两条路径的顺序，并最大化所选权重之间的点积。 

The tree itself is not adversarial; it is generated randomly with each node attaching to a uniformly chosen earlier node. That detail is not decorative. 它确保典型的根到节点路径平均较短，但最坏情况深度仍然是线性的，因此任何解决方案都必须适用于最坏情况路径长度。 

A naive interpretation would suggest comparing all subsequence pairs, but that already hints at exponential blow-up. Even restricting to dynamic programming over two sequences would still cost quadratic per query in worst cases, which is far too large if there are many queries.

 当一条路径是另一条路径的前缀或者两条路径共享长前缀然后发散时，就会出现微妙但重要的边缘情况。 在这些情况下，许多候选子序列匹配会崩溃为结构相似的比对，并且朴素DP会重复重新计算相同的转换。 

例如，如果两个节点都是 1 的深度后代，并且除了较小的后缀差异之外，它们的路径几乎相同，则每个查询重新计算完整 DP 会浪费与完整深度成比例的工作，即使只有很小的后缀不同。 

## 方法

 A direct brute force approach treats each query independently. 我们提取两个根到节点序列并运行经典的最长公共子序列样式动态编程，但我们不是最大化长度，而是最大化加权点积。 For sequences of length d1 and d2, this DP costs O(d1 · d2). In a degenerate tree where depth is O(n), a single query becomes quadratic. 对于最多 10^5 次查询，这是完全不可行的。 

The key structural observation is that both sequences are root paths in the same tree. 这意味着它们不是任意数组：它们共享一个长前缀，并且仅在其最低共同祖先之后分歧。 如果我们将两条路径分解为从根到 LCA 和从 LCA downwar 的段
