---
title: "CF 1695C - 零路径"
description: "我们有一个网格，其单元格仅包含 1 或 -1。 从左上角开始，我们只能向右或向下移动，直到到达右下角。 每个被访问的单元都将其值贡献给路径总和。 任务不是找到此类路径的数量或最小总和。"
date: "2026-06-09T22:43:38+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "dp", "graphs", "greedy", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 1695
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 801 (Div. 2) and EPIC Institute of Technology Round"
rating: 1700
weight: 1695
solve_time_s: 181
verified: false
draft: false
---

[CF 1695C - 零路径](https://codeforces.com/problemset/problem/1695/C)

 **评分：** 1700
 **标签：** 暴力破解、数据结构、dp、图、贪婪、最短路径
 **求解时间：** 3m 1s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个网格，其单元格仅包含`1`或者`-1`。 从左上角开始，我们只能向右或向下移动，直到到达右下角。 每个被访问的单元都将其值贡献给路径总和。 

任务不是找到此类路径的数量或最小总和。 我们只需判断至少一条有效路径的总和是否准确`0`。 

一条路径从`(1,1)`到`(n,m)`总是访问相同数量的单元格。 我们准确地制造`n-1`向下移动和`m-1`向右移动，因此路径包含$$L=n+m-1$$细胞。 

所有网格的总大小最多为$10^6$细胞。 这立即排除了任何枚举路径的算法。 甚至一个$20\times20$网格已经包含$$\binom{38}{19}\approx 3.5\times10^{10}$$不同的路径。 我们需要一个其工作与细胞数量成正比的解决方案。 

一些边缘情况很容易被忽略。 

考虑单个细胞：```
1 1
1
```唯一有总和的路径$1$，所以答案是`NO`。 

更微妙的情况是路径长度为奇数时：```
1 2
1 -1
```路径总和为$0$，所以答案是`YES`。 

但：```
1 3
1 -1 1
```每条路径包含三个
