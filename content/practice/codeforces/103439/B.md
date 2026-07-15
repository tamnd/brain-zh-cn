---
title: "CF 103439B - 关于 Segment Deluxe 的新查询"
description: "令给定的位串为$a{25}点a0$，其中$s=12$个零，$t=14$个。 在 (41) 中定义的 Chase 序列 $C{st}$ 中，连续组合是通过交换相邻模式 $10 leftrightarrow 01$ 获得的，因此单个移动将 $1$ 与相邻的 $0$ 交换。"
date: "2026-07-03T07:46:22+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103439
codeforces_index: "B"
codeforces_contest_name: "XXII Open Cup, Grand Prix of Southeastern Europe"
rating: 0
weight: 103439
solve_time_s: 131
verified: false
draft: false
---

[CF 103439B - Segment Deluxe 的新查询](https://codeforces.com/problemset/problem/103439/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 11s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 令给定的位串为$a_{25}\dots a_0$， 在哪里$s=12$零点和$t=14$那些。 按照蔡斯的顺序$C_{st}$如（41）中所定义，连续组合是通过交换相邻模式获得的$10 \leftrightarrow 01$，所以一次移动就交换了$1$与邻居$0$。 

该序列以全零先于全一的配置开始，即$00\dots 011\dots 1.$从这个起点出发，任意$1$必须向左移动穿过每个$0$最初位于其左侧，直到到达目标字符串中的最终位置。 每个这样的交换都是一个相邻的交换$10$一对。 因此，达到给定配置所需的步骤数等于该形式的反转数$(1,0)$，表示位置对$i<j$和$a_i=1$和$a_j=0$。 

对于每个位置$i$含有一个$1$， 让$Z(i)$表示位置中零的数量$i,i+1,\dots,25$。 每个这样的零都恰好贡献了一次交换$1$在位置$i$，所以需要的交换总数是$\sum_{a_i=1} Z(i).$给定的字符串是$11001001000011111101101010.$计算$Z(i)$通过从右到左后缀计数零。 结果值为：$$\begin{aligned}
Z(1)&=12,\quad Z(2)=12,\quad Z(5)=10,\quad Z(8)=8,\\
Z(13)&=4,\quad Z(14)=4,\quad Z(15)=4,\quad Z(16)=4,\quad Z(17)=4,\quad Z(18)=4,\\
Z(20)&=3,\quad Z(21)=3,\quad Z(23)=2,\quad Z(25)=1.
\end{aligned}$$对包含 a 的所有位置求和$1$给出$$12+12+10+8+4+4+4+4+4+4+3+3+2+1=75.$$该值是将初始配置转换为Chase序列中给定位串所需的相邻交换数$C_{st}$，因此它等于其之前的组合数。 

因此给定位串之前的组合数为$\boxed{75}.$这样就完成了解决方案。 ∎
