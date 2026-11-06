---
title: "CF 190A - 瓦夏和巴士"
description: "我们被要求计算公共汽车上有多名成人 n 和儿童 m 的最低和最高公共汽车票价。 每个成年人为自己支付一卢布，每个成年人最多可以免费携带一名儿童。 任何额外的儿童每人收费一卢布。"
date: "2026-06-03T01:26:51+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 190
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 120 (Div. 2)"
rating: 1100
weight: 190
solve_time_s: 21
verified: false
draft: false
---

[CF 190A - Vasya 和公共汽车](https://codeforces.com/problemset/problem/190/A)

 **评分：** 1100
 **标签：** 贪心，数学
 **求解时间：** 21s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求计算给定一些成年人的最低和最高公共汽车票价`n`和孩子们`m`在公共汽车上。 每个成年人为自己支付一卢布，每个成年人最多可以免费携带一名儿童。 任何额外的儿童每人收费一卢布。 孩子们不能单独骑行，所以`m`不能超过`n`乘以每个成年人可以支付的孩子数量，否则这种情况是不可能的。 

输入是两个整数`n`和`m`。 输出要么是代表最低和最高总票价的两个整数，要么是“不可能”一词（如果公交车上不存在成人和儿童的组合）。 

考虑到约束条件`0 ≤ n, m ≤ 10^5`,
