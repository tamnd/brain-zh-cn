---
title: "CF 105164H - APPQ 最高分"
description: "我们得到了一个以非常结构化的方式生成的数字宇宙。 每个数字对应于前 $n$ 个素数的指数向量。"
date: "2026-06-27T10:45:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105164
codeforces_index: "H"
codeforces_contest_name: "2024 ICPC Gran Premio de Mexico 1ra Fecha"
rating: 0
weight: 105164
solve_time_s: 42
verified: false
draft: false
---

[CF 105164H - APPQ 最高分](https://codeforces.com/problemset/problem/105164/H)

 **评级：** -
 **标签：** -
 **求解时间：** 42s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一个以非常结构化的方式生成的数字宇宙。 每个数字对应于第一个数字的指数向量$n$素数。 这$i$第一个坐标$e_i$告诉我们多少次$i$-th prime 出现在因式分解中，每个坐标的边界为$0 \le e_i \le a_i$。 因此，整个输入描述了指数向量的有限网格，并且每个有效数字都是该网格中的一个点。 

我们必须在对的结构限制下选择这些数字的子集。 如果我们取两个数字$x < y$，那么禁止
