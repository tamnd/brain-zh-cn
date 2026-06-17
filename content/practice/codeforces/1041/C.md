---
title: "CF 1041C - 茶歇"
description: "一天中，我们总会有一些时刻愿意喝咖啡。 每个时刻都是一天中的特定分钟，持续时间从第 1 分钟到第 m 分钟。"
date: "2026-06-16T18:00:26+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "greedy", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1041
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 509 (Div. 2)"
rating: 1600
weight: 1041
solve_time_s: 276
verified: false
draft: false
---

[CF 1041C - 茶歇](https://codeforces.com/problemset/problem/1041/C)

 **评分：** 1600
 **标签：** 二分查找、数据结构、贪心、二指针
 **求解时间：** 4m 36s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 一天中，我们总会有一些时刻愿意喝咖啡。 每个时刻都是一天中的特定分钟，持续时间从第 1 分钟到第 m 分钟。 每个咖啡休息时间都必须分配给一个工作日，并且多个休息时间可以分配给同一天，但前提是它们在当天的时间上相距足够远。 限制是，如果同一天发生两次休息，则它们之间的分钟数必须至少相差 d。 

我们不是分配任意的时间表，而是将一组固定的时间点划分为多个序列，每个序列代表一天，并且每个序列必须遵守连续选定时间之间的最小间隙约束。 目标是尽量减少需要的此类序列的数量。 

关键约束是 n 最大为 200000，这强制采用 O(n log n) 或 O(n) 方法。 任何重复扫描已分配的中断或试图在没有结构的情况下贪婪地模拟日复一日的操作，在最坏的情况下都会退化为 O(n²) 并失败。 

一个
