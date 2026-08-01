---
title: "CF 104090F - 大米老师爱看的"
description: "在 ZDD 中，每个级别对应一个变量，标记为 $k$ 的节点表示对 $xk$ 的决策，其中低边排除该变量，高边将其包含在所表示的集合族中。"
date: "2026-07-02T02:32:33+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104090
codeforces_index: "F"
codeforces_contest_name: "The 2022 ICPC Asia Hangzhou Regional Programming Contest"
rating: 0
weight: 104090
solve_time_s: 133
verified: false
draft: false
---

[CF 104090F - 大米老师爱看的](https://codeforces.com/problemset/problem/104090/F)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 13s
 **已验证：** 否

 ## 解决方案
 在ZDD中，每个级别对应一个变量，以及一个标记为的节点$k$代表一项决定$x_k$，其中低边排除变量，高边将其包含在表示的集合族中。 水槽$\perp$代表空虚的家庭，而$\top$表示仅包含空集的族。 

显示的 ZDD 是标记为的单个节点$x_3$其低沿去$\perp$高边沿去$\top$。 这意味着当$x_3=0$，不接受任何子集，并且当$x_3=1$，唯一接受的子集是选择后的空延续$x_3$。 

因此，所表示的族恰好由一组组成：${3}$。 所有其他变量$x_1,x_2,x_4,x_5,x_6$没有出现在任何节点中，因此必须强制它们$0$在每一次令人满意的任务中。 

因此，布尔函数是单个赋值的指示符，其中$x_3=1$所有其他变量都是$0$:$$f(x_1,x_2,x_3,x_4,x_5,x_6) = x_3 \cdot \overline{x_1}\,\overline{x_2}\,\overline{x_4}\,\overline{x_5}\,\overline{x_6}.$$等价地，它是单例集的特征函数${{3}}$在子集表示中。
