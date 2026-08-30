---
title: "CF 104885D-\u0412\u0440\u0435\u043c\u044f\u043d\u0430\u043c\u0430\u0440\u0441\u0435"
description: "我们在时钟上给出一个时间间隔，以小时和分钟表示，从开始时刻 H1:M1 到结束时刻 H2:M2。"
date: "2026-06-28T09:08:19+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104885
codeforces_index: "D"
codeforces_contest_name: "Municipal stage of ROI in Nizhny Novgorod 2023"
rating: 0
weight: 104885
solve_time_s: 23
verified: false
draft: false
---

[CF 104885D - \u0412\u0440\u0435\u043c\u044f \u043d\u0430 \u043c\u0430\u0440\u0441\u0435](https://codeforces.com/problemset/problem/104885/D)

 **评级：** -
 **标签：** -
 **求解时间：** 23s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们在时钟上给出了从开始时刻开始的时间间隔，以小时和分钟为单位`H1:M1`到结束的时刻`H2:M2`。 我们在时间中一分钟一分钟地前进，每一个中间时间`h:m`我们通过连接十进制表示来构建一个字符串`h`和`m`没有分隔符。 例如，`7:05`变成字符串`"705"`， 尽管`12:30`变成`"1230"`。 

对于每个这样的字符串，语句中的固定规则分配一个“显示成本”，它对应于显示该字符串的所有数字需要多少个显示元素（想想数字显示器上的段）。 任务是计算给定时间间隔内所有分钟的最大显示成本。 

因此，关键输入不是图形或数组，而是连续的时间序列。 输出是一个整数：间隔期间最坏情况的显示要求。 

即使没有严格的限制
