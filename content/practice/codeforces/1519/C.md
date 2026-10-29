---
title: "CF 1519C - 贝尔兰地区机场"
description: "方法 1b 已经提供了关键思想。 如果 $(umldots u1u0)3$ 是三元整数，则其十进制值是从嵌套形式 $$(cdots((umcdot3+u{m-1})cdot3+u{m-2})cdots)cdot3+u0.$$ 对于铅笔和纸作业而言，这意味着：从前导数字开始。"
date: "2026-06-10T18:12:30+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "greedy", "number-theory", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1519
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 108 (Rated for Div. 2)"
rating: 1400
weight: 1519
solve_time_s: 179
verified: false
draft: false
---

[CF 1519C - 贝尔兰地区](https://codeforces.com/problemset/problem/1519/C)

 **评分：** 1400
 **标签：** 蛮力、数据结构、贪心、数论、排序
 **求解时间：** 2m 59s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 方法 1b 已经提供了关键思想。 如果$(u_m\ldots u_1u_0)_3$是一个三进制整数，它的十进制值是从嵌套形式中获得的$$(\cdots((u_m\cdot3+u_{m-1})\cdot3+u_{m-2})\cdots)\cdot3+u_0.$$对于纸笔工作来说，这意味着：

 从前导数字开始。 重复将当前结果乘以$3$并添加下一个三进制数字。 

仅乘以$3$并添加$0$,$1$， 或者$2$是必需的。 

为了$$(12120112120210)_3,$$计算过程如下：$$\begin{array}{rcl} 1 &\to& 1\cdot3+2=5,\\ 5 &\to& 5\cdot3+1=16,\\ 16 &\to& 16\cdot3+2=50,\\ 50 &\to& 50\cdot3+0=150,\\ 150 &\to& 150\cdot3+1=451,\\ 451 &\to& 451\cdot3+1=1354,\\ 1354 &\to& 1354\cdot3+2=4064,\\ 4064 &\to& 4064\cdot3+1=12193,\\ 12193 &\to& 12193\cdot3+2=36581,\\ 36581 &\to& 36581\cdot3+0=109743,\\ 109743 &\to& 109743\cdot3+2=329231,\\ 329231 &\to& 329231\cdot3+1=987694,\\ 987694 &\to& 987694\cdot3+0=2963082. \end{array}$$因此$$(12120112120210)_3=(2963082)_{10}.$$因此十进制值为$$\boxed{2963082}.$$要以相反方向转换，从十进制转换为三进制，请使用方法 1a$B=3$。 反复除以$3$并记录余数。 

对于一个整数$u$,$$u=3q_0+r_0,\qquad 0\le r_0<3,$$然后$$q_0=3q_1+r_1,$$依此类推，直到商变为$0$。 三进制数字是以相反顺序读取的余数：$$u=(\ldots r_2r_1r_0)_3.$$因此，快速三进制到十进制的方法是重复乘以$3$以及添加下一个数字； 快速十进制到三进制的方法是重复除以$3$与余数。 

∎
