---
title: "CF 2197C - 分数游戏"
description: "值 $V = 7frac{1}{16}$ 对应于根据 $k = 11$ 类别计算的卡方统计量，如方程式 1 所示。 （5）。 因此，自由度数为 $nu = k - 1 = 10$。"
date: "2026-06-09T04:44:55+07:00"
tags: ["codeforces", "competitive-programming", "games", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 2197
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 1079 (Div. 2)"
rating: 1200
weight: 2197
solve_time_s: 130
verified: false
draft: false
---

[CF 2197C - 分数游戏](https://codeforces.com/problemset/problem/2197/C)

 **评分：** 1200
 **标签：** 游戏、贪心、数学
 **求解时间：** 2m 10s
 **已验证：** 否

 ## 解决方案
 价值$V = 7\frac{1}{16}$对应于计算得出的卡方统计量$k = 11$类别，如方程式所示。 （5）。 因此自由度数为$\nu = k - 1 = 10$。 判断是否$V$不太可能高，请查阅表 1 对应的行$\nu = 10$，其中列出了 10 个自由度的卡方分布的百分比。 该行提供了近似阈值，$V$可以通过比较来评估其极端性。 

自从$7\frac{1}{16} = 7.0625$位于 50% 和 75% 条目之间$\nu = 10$，不被视为显着高； 尽管如此，表中使用的适当行是带有$\nu = 10$。 

∎
