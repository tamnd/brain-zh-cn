---
title: "CF 103149C - 愤怒的奶牛"
description: "让 $N$ 的度 $t$ 组合表示 (57) 写成以下形式 $$N = binom{ct}{t} + binom{c{t-1}}{t-1} + cdots + binom{c1}{1},$$ 其中 $$s+t ct cdots c1 ge 0.$$ 让 $$M = binom{s+t}{t} - N。"
date: "2026-07-03T18:46:29+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103149
codeforces_index: "C"
codeforces_contest_name: "EGOI 2021 Day 2"
rating: 0
weight: 103149
solve_time_s: 153
verified: false
draft: false
---

[CF 103149C - 愤怒的奶牛](https://codeforces.com/problemset/problem/103149/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 33s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让学位——$t$的组合表示 (57)$N$写成表格$$N = \binom{c_t}{t} + \binom{c_{t-1}}{t-1} + \cdots + \binom{c_1}{1},$$在哪里$$s+t > c_t > \cdots > c_1 \ge 0.$$让$$M = \binom{s+t}{t} - N.$$补码运算是在所有的全集中进行的$t$- 的组合${0,1,\dots,s+t-1}$。 每学期$\binom{c_j}{j}$计算块$j$- 最大元素为的组合$c_j$。 减法$N$从完整的初始段中删除这些块，所以$M$由同一组合数系统中的互补块确定。 

对于固定的$j$, 计数的块$\binom{c_j}{j}$正好占据对应的索引区间$j$- 其前导条目最多为的组合$c_j$。 因此，补码通过计算所有$j$- 其主要条目位于的组合${c_j+1,\dots,s+t-1}$。 通过组合数系统的定义属性，这种转变颠倒了贡献的顺序，并在以规范形式重写时产生交替的校正项。 

控制单个移位级别的关键恒等式是伸缩关系$$\binom{x}{j} = \binom{x-1}{j} + \binom{x-1}{j-1},$$重复应用以将上索引从$c_j$最多$s+t-1$。 迭代这个扩展$s+t-1-c_j$次产量$$\binom{s+t-1}{j} - \binom{c_j}{j}
=
\sum_{k=0}^{s+t-2-c_j} \binom{c_j+k}{j-1}.$$当这些扩展被插入到表达式中时$$M = \binom{s+t}{t} - \sum_{j=1}^t \binom{c_j}{j},$$完整二项式系数$\binom{s+t}{t}$分解为所有层的总和$j$在组合表示中。 每一层都提供一系列项，这些项具有通过重复使用身份而产生的交替符号$$\binom{x}{r} = \binom{x-1}{r} + \binom{x-1}{r-1}.$$收集每个固定等级的术语后$j$，取消发生在连续扩展之间，因为每个中间项恰好出现两次且符号相反，一次来自扩展级别$j$一旦从水平$j-1$。 其余未取消的项正是通过交替连续二项式层的贡献而获得的项。 

这产生了交替组合定律（30），它完全用从原始数字导出的交替二项式贡献来表达补码表示$c_t,\dots,c_1$:$$M = \sum_{j=1}^t (-1)^{t-j} \, \Phi_j(c_j),$$在哪里$\Phi_j(c_j)$是规范的$j$通过转移获得的等级贡献$c_j$进入全范围${0,\dots,s+t-1}$通过重复的帕斯卡展开式。 

由于每一步都是通过迭代应用帕斯卡恒等式和相邻层之间的取消而获得的，因此得到的表达式是精确且唯一的。 这样就完成了证明。 ∎
