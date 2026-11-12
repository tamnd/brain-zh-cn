---
title: "CF 2216B - THU 包装拼图"
description: "值 $V = 7frac{1}{16}$ 对应于根据 $k = 11$ 类别计算的卡方统计量，如方程式 1 所示。 （5）。 因此，自由度数为 $nu = k - 1 = 10$。"
date: "2026-06-09T04:52:32+07:00"
tags: ["codeforces", "competitive-programming", "greedy"]
categories: ["algorithms"]
codeforces_contest: 2216
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 1092 (Unrated, Div. 2, Based on THUPC 2026 \u2014 Finals)"
rating: 1300
weight: 2216
solve_time_s: 40
verified: false
draft: false
---

[CF 2216B - THU 包装难题](https://codeforces.com/problemset/problem/2216/B)

 **评分：** 1300
 **标签：** 贪婪
 **求解时间：** 40s
 **已验证：** 否

 ## 解决方案
 价值$V = 7\frac{1}{16}$对应于计算得出的卡方统计量$k = 11$类别，如方程式所示。 （5）。 因此自由度数为$\nu = k - 1 = 10$。 判断是否$V$不太可能高，请查阅表 1 对应的行$\nu = 10$，其中列出了 10 个自由度的卡方分布的百分比。 该行提供了近似阈值，$V$可以通过比较来评估其极端性。 

自从$7\frac{1}{16} = 7.0625$位于 50% 和 75% 条目之间$\nu = 10$，不被视为显着高； 尽管如此，表中使用的适当行是带有$\nu = 10$。 

∎
