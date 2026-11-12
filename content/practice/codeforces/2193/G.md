---
title: "CF 2193G - 树中的路径"
description: "我们得到一棵树，它是一个由 $n$ 个顶点组成的无向、连通、无环图。 两个隐藏顶点 $x$ 和 $y$ 定义了一条唯一路径，因为树在任何一对顶点之间都只有一条简单路径。"
date: "2026-06-07T20:53:34+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "interactive", "sortings", "trees"]
categories: ["algorithms"]
codeforces_contest: 2193
codeforces_index: "G"
codeforces_contest_name: "Codeforces Round 1076 (Div. 3)"
rating: 2100
weight: 2193
solve_time_s: 185
verified: false
draft: false
---

[CF 2193G - 树中的路径](https://codeforces.com/problemset/problem/2193/G)

 **评分：** 2100
 **标签：** dfs 和类似的、交互式、排序、树
 **求解时间：** 3m 5s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一棵树，它是一个无向的、连通的、无环的图$n$顶点。 两个隐藏的顶点，$x$和$y$，定义一条唯一路径，因为树在任何一对顶点之间都只有一条简单路径。 我们不知道他们的身份$x$和$y$，但是我们可以通过询问任意两个选定顶点之间的路径是否与树进行交互$a$和$b$与之间的隐藏路径相交$x$和$y$。 我们的目标是使用最多找到隐藏路径上的至少一个顶点
