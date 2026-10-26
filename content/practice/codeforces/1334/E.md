---
title: "CF 1334E - 除数路径"
description: "我们得到一个数字 $D$，需要推理它的所有除数。 该问题定义了一个图，其顶点都是 $D$ 的约数。 如果 $x$ 可被 $y$ 整除并且商 $x / y$ 为素数，则存在从除数 $y$ 到较大除数 $x$ 的边。"
date: "2026-06-11T15:59:29+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "graphs", "greedy", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1334
codeforces_index: "E"
codeforces_contest_name: "Educational Codeforces Round 85 (Rated for Div. 2)"
rating: 2200
weight: 1334
solve_time_s: 49
verified: false
draft: false
---

[CF 1334E - 除数路径](https://codeforces.com/problemset/problem/1334/E)

 **评分：** 2200
 **标签：** 组合数学、图、贪心、数学、数论
 **求解时间：** 49s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个数字$D$并需要推理它的所有除数。 该问题定义了一个图，其顶点都是以下的约数$D$。 除数存在一条边$y$到一个更大的除数$x$如果$x$可以整除$y$和商$x / y$是素数。 这样一条边的权重是$x$不是以下的约数$y$。 任务是，对于多个查询，每个查询都要求一对除数$v$和$u$，计算图中它们之间的最短路径的数量。 

限制因素很重要：$D$可以大到$10^{15}$最多有$3 \cdot 10^5$查询。 枚举所有除数$D$或者对于大量数据来说，显式构建完整的图是不可行的
