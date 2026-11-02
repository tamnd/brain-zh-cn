---
title: "CF 1725F - 实地摄影"
description: "每行最初包含一个连续的参赛者块，放置在一个非常大的整数行列上。 $i$ 行占据了从 $Li$ 到 $Ri$ 的每个位置，因此几何上每一行只是一个闭区间。"
date: "2026-06-16T16:52:35+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "data-structures", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1725
codeforces_index: "F"
codeforces_contest_name: "COMPFEST 14 - Preliminary Online Mirror (Unrated, ICPC Rules, Teams Preferred)"
rating: 2100
weight: 1725
solve_time_s: 175
verified: false
draft: false
---

[CF 1725F - 实地摄影](https://codeforces.com/problemset/problem/1725/F)

 **评分：** 2100
 **标签：** 位掩码、数据结构、排序
 **求解时间：** 2m 55s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 每行最初包含一个连续的参赛者块，放置在一个非常大的整数行列上。 排$i$占据了每一个位置$L_i$到$R_i$，所以几何上每一行只是一个闭区间。 

我们可以将整行向左或向右移动任何正整数$k$。 每一个这样的举动都会增加$k$使用按位或将其放入全局累加器中。 对于查询值$W$，我们必须选择一个seq
