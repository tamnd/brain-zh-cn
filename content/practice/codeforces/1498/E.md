---
title: "CF 1498E - 两栋房子"
description: "给定一个拥有 $n$ 房屋的城市，其中每对房屋都有一条有向道路连接它们，或者从第一栋到第二栋，反之亦然。 输入未指定这些道路的方向。"
date: "2026-06-10T21:38:33+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "graphs", "greedy", "interactive", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1498
codeforces_index: "E"
codeforces_contest_name: "CodeCraft-21 and Codeforces Round 711 (Div. 2)"
rating: 2200
weight: 1498
solve_time_s: 160
verified: false
draft: false
---

[CF 1498E - 两栋房子](https://codeforces.com/problemset/problem/1498/E)

 **评分：** 2200
 **标签：** 暴力破解、图表、贪心、交互、排序
 **求解时间：** 2m 40s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被赋予了一座城市$n$房屋，其中每对房屋都有一条直接的道路连接它们，或者从第一栋到第二栋，反之亦然。 输入未指定这些道路的方向。 相反，我们得到一个数组$k$在哪里$k_i$是通往房屋的道路数量$i$。 

我们被要求找一对房子$A$和$B$这样$A$和$B$是双向可达的，这意味着每个人都可以通过某种路径到达另一个人，并且在所有这些对中，我们希望最大化其中一个$|k_A - k_B|$。 如果不存在这样的对，我们应该报告$(0, 0)$。 

问题是互动的。 我们可以查询一栋房子是否可以到达另一栋房子，但是一旦法官对任何查询回答“是”，我们就必须停止询问并输出我们的答案。 查询没有上限，但查询必须唯一且格式正确。 

时间
