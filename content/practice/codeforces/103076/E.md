---
title: "CF 103076E - 死星"
description: "令 $n = s + t$ 如第 7.2.1.3 节的等式 (1) 所示，并通过严格递增索引 $n ct cdots c1 ge 0,$ 来描述可接受的和弦，并受到约束 $ct - c1 < m,$ 的约束，并且在本练习中，附加邻接排除 $c{j+1} cj + 1 四边形…"
date: "2026-07-04T00:23:25+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103076
codeforces_index: "E"
codeforces_contest_name: "UFPE Starters Final Try-Outs 2021"
rating: 0
weight: 103076
solve_time_s: 159
verified: false
draft: false
---

[CF 103076E - 死星](https://codeforces.com/problemset/problem/103076/E)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 39s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$n = s + t$如第 7.2.1.3 节的方程（1），并让允许的和弦通过严格递增的指数来描述$n > c_t > \cdots > c_1 \ge 0,$受约束$c_t - c_1 < m,$并且，在本练习中，额外的邻接排除$c_{j+1} > c_j + 1 \quad (t > j \ge 1).$邻接条件重写为统一间隙条件$c_{j+1} \ge c_j + 2 \quad (t > j \ge 1).$定义变换序列$d_j = c_j - (j-1), \quad 1 \le j \le t.$从$c_{j+1} \ge c_j + 2$我们得到$d_{j+1} = c_{j+1} - j \ge c_j + 2 - j = (c_j - (j-1)) + 1 = d_j + 1,$所以$n - (t-1) > d_t > \cdots > d_1 \ge 0.$因此$(d_t,\ldots,d_1)$是一个普通的$t$-从减少的集合中提取的组合${0,1,\ldots,n-(t-1)-1}$。 

相反，给定任何严格递增序列$d_t > \cdots > d_1 \ge 0$在这个缩小的范围内，定义$c_j = d_j + (j-1)$产生一个满足的序列$c_{j+1} \ge c_j + 2$通过颠倒上述计算。 这在可接受的和弦和普通和弦之间建立了双射$t$- 尺寸组合$n-(t-1)$。 

间距约束通过代入变换为$c_t - c_1 = (d_t + t - 1) - d_1 = (d_t - d_1) + (t - 1).$因此原来的界限$c_t - c_1 < m$变成$d_t - d_1 < m - (t-1).$因此，带有邻接排除的修改后的钢琴和弦问题等价于练习 57 中应用于参数的原始问题$n' = n - (t-1), \quad m' = m - (t-1).$特别是，练习 57 中的所有枚举和生成过程在此减少后逐字应用，替换$n$经过$n-(t-1)$和$m$经过$m-(t-1)$。 

这样就完成了证明。 ∎
