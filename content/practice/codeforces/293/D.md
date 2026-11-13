---
title: "CF 293D - Ksusha 和 Square"
description: "给定一个凸多边形，其顶点具有整数坐标。 考虑位于多边形内部或其边界上的每个晶格点，即具有整数坐标的每个点。"
date: "2026-06-05T17:22:49+07:00"
tags: ["codeforces", "competitive-programming", "geometry", "math", "probabilities", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 293
codeforces_index: "D"
codeforces_contest_name: "Croc Champ 2013 - Round 2"
rating: 2700
weight: 293
solve_time_s: 43
verified: false
draft: false
---

[CF 293D - Ksusha 和 Square](https://codeforces.com/problemset/problem/293/D)

 **评分：** 2700
 **标签：** 几何、数学、概率、两指针
 **求解时间：** 43s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 给定一个凸多边形，其顶点具有整数坐标。 考虑位于多边形内部或其边界上的每个晶格点，即具有整数坐标的每个点。 

在所有无序的不同格点对中，我们均匀地随机选择一对。 这两个点成为正方形的对角。 任务是计算该正方形的预期面积。 

正方形的几何形状实际上是最简单的部分。 如果两个点是正方形的相对顶点且对角线长度为$d$，则边长为$d/\sqrt 2$，所以面积是$$\frac{d^2}{2}.$$整个问题就变成了：

 \mathbb E[\text{面积}] = \frac12 \cdot \mathbb E[\text{距离平方为]()
