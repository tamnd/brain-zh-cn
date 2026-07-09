---
title: "CF 102986B - 分享麦片"
description: "令 $alpha$ 为 $t$ 组合，因此 $alpha$ 是 ${0,1,dots,n-1}$ 的 $t$ 元素子集。 运算符 $partialt alpha$ 生成通过删除 $alpha$ 的一个元素而获得的所有 $(t-1)$ 组合。 如果 $alpha={ct,dots,c1}$，则 $$partialt alpha={alphasetminus{cj}mid 1le jle t}。"
date: "2026-07-04T02:56:17+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102986
codeforces_index: "B"
codeforces_contest_name: "UTPC Contest 03-05-21 Div. 2 (Beginner)"
rating: 0
weight: 102986
solve_time_s: 151
verified: false
draft: false
---

[CF 102986B - 分享Cheerios](https://codeforces.com/problemset/problem/102986/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 31s
 **已验证：** 否

 ## 解决方案
 让$\alpha$成为一个$t$- 组合，所以$\alpha$是一个$t$-元素子集${0,1,\dots,n-1}$。 

操作员$\partial_t \alpha$产生所有$(t-1)$-删除其中一个元素得到的组合$\alpha$。 如果$\alpha={c_t,\dots,c_1}$， 然后$$\partial_t \alpha=\{\alpha\setminus\{c_j\}\mid 1\le j\le t\}.$$的每个元素$\partial_t \alpha$因此是一个$(t-1)$- 组合${0,1,\dots,n-1}$。 

操作员$\partial_{t+1} \alpha$产生所有$(t+1)$- 包含的组合$\alpha$，通过邻接一个尚未存在的新元素而获得$\alpha$。 如果$\overline{\alpha}={0,1,\dots,n-1}\setminus \alpha$， 然后$$\partial_{t+1} \alpha=\{\alpha\cup\{x\}\mid x\in \overline{\alpha}\}.$$的每个元素$\partial_{t+1} \alpha$因此是一个$(t+1)$- 组合包含$\alpha$。
