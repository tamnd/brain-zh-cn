---
title: "CF 1744F - MEX 与 MED"
description: "将正方形放置在坐标 (A(0,0))、(B(1,0))、(C(1,1))、(D(0,1)) 中。 那么 (E) 位于 (AB) 上，(F) 位于 (BC) 上，且 (BE=BF)。 写 (E=(x,0)) 给出 (BE=1-x)，而 (F=(1,y)) 给出 (BF=y)，因此 (y=1-x) 和 (F=(1,1-x))。"
date: "2026-06-09T15:58:55+07:00"
tags: ["codeforces", "competitive-programming", "math", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1744
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round  828 (Div. 3)"
rating: 2000
weight: 1744
solve_time_s: 114
verified: false
draft: false
---

[CF 1744F - MEX 与 MED](https://codeforces.com/problemset/problem/1744/F)

 **评级：** 2000
 **标签：** 数学，两个指针
 **求解时间：** 1m 54s
 **已验证：** 否

 ## 解决方案
 ## 探索

 将正方形放置在坐标 (A(0,0))、(B(1,0))、(C(1,1))、(D(0,1)) 中。 那么 (E) 位于 (AB) 上，(F) 位于 (BC) 上，且 (BE=BF)。 写 (E=(x,0)) 给出 (BE=1-x)，而 (F=(1,y)) 给出 (BF=y)，因此 (y=1-x) 和 (F=(1,1-x))。 

中点是

 [
 L=\left(\frac{x+1}{2},\frac{1-x}{2}\right),\quad
 N=\left(\frac12,1-\frac{x}{2}\right),\quad
 O=\left(\frac12,\frac12\right)。 
]

 从 (AL) 与 (DF) 的交点获得点 (K)。 

目标是证明 (C(1,1),K,L,O,N) 是同循环的。 由于 (x) 中的所有坐标都是显式有理式，因此最稳定的方法是通过取决于 (x) 的三个点确定圆，并验证其余两个点位于其上。 

最微妙的一点是确保根据一个配置正确计算圆，其中一个点 (L) 取决于参数 (x)，因此圆的系数也取决于 (x)。 

## 问题理解

 任务是证明正方形中的五个明确构造的点位于一个公共圆上。 

主要困难在于圆的定义点之一 (L) 取决于自由参数 (x)，因此圆必须
