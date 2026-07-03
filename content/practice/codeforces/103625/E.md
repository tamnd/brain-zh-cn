---
title: "CF 103625E - 聚魂箱"
description: "令 $wk(x)$ 表示 Paley 排序中 $[0,1)$ 上的第 $k$ 个沃尔什函数，如第 7.2.1.1 节中所定义，以便每个 $wk$ 是一个 ${pm 1}$ 值阶跃函数，其不连续性仅出现在二进有理数处，其符号模式由 $k$ 的二进制数字确定。"
date: "2026-07-02T22:39:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103625
codeforces_index: "E"
codeforces_contest_name: "UTPC Contest 03-25-22 Div 1. (Advanced)"
rating: 0
weight: 103625
solve_time_s: 130
verified: false
draft: false
---

[CF 103625E - 聚魂箱](https://codeforces.com/problemset/problem/103625/E)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 10s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$w_k(x)$表示$k$沃尔什函数开启$[0,1)$按照第 7.2.1.1 节中定义的佩利排序，以便每个$w_k$是一个${\pm 1}$-值阶跃函数，其不连续性仅出现在二进有理数处，其符号模式由以下的二进制数字确定$k$。 

写$k$二进制形式$$k = (b_m b_{m-1}\cdots b_0)_2,\qquad b_m=1.$$使用 Walsh 函数的标准表示作为 Rademacher 函数的乘积，$w_k(x)=\prod_{j=0}^m r_j(x)^{b_j}$，其中每个$r_j(x)$在与分母的二进点处精确地改变符号$2^{j+1}$，函数$w_k$在每个二元长度区间上是恒定的$2^{-m}$并且可能仅在此类间隔的端点处改变符号。 

每个符号变化$w_k$发生在某一点$x$当大规模跨越二元边界时$2^{-j}$，活性Rademacher因子的奇偶性发生变化。 因此每个符号变化点$w_k$是形式的二元有理数$$x = \frac{t}{2^m},\qquad 0 < t < 2^m,$$并且不同的符号变化对应于不同的整数$t$。 自从$w_k$完全改变符号$k$次$(0,1)$，这些点组成了一组$k$内部二元有理$(0,1)$。 

按递增顺序表示这些点$$0 < z_{k1} < z_{k2} < \cdots < z_{kk} < 1.$$沃尔什函数的结构意味着集合${z_{k1},\dots,z_{kk}}$与第一个重合$k$基数中范德科普特序列的点$2$在二元反射与Rademacher符号变化的自然识别下。 事实上，水平上的每个二元区间$m$对应于修复第一个$m$的二进制数字$x$，而连续符号变化引起的排序与这些二元区间的反映的二进制枚举相匹配。 这种识别源于以下事实：引入因子$r_j$准确地切换符号时$j$的二进制数$x$变化，因此符号翻转的累积模式编码了二元有理数的反向二进制顺序。 

让$\mathcal{V}={v_1,v_2,\dots}$成为基地-$2$范德科普特序列$[0,1)$， 在哪里$v_n$是通过反映二进制数字得到的$n$。 然后对于每个$k$, 多重集${z_{k1},\dots,z_{kk}}$等于${v_1,\dots,v_k}$，并且按照递增顺序，它与这些第一个的不断增加的重新排列相一致$k$范德科普特点。 

这是 van der Corput 序列的标准二进差异性质，对于每个区间$[0,t)\subset[0,1)$,$$\left|\#\{1\le n\le k : v_n < t\} - kt\right| \le C\log k$$对于绝对常数$C$。 同样的界限也适用于有序集${z_{k1},\dots,z_{kk}}$因为重新排序不会改变初始段中的计数。 

使固定$l$和$1\le l\le k$。 让$I_l=[0,z_{kl})$。 根据订单统计的定义，确切地说$l-1$点位于$I_l$， 所以$$\#\{j\le k : z_{kj} < z_{kl}\} = l-1.$$将差异应用到$t=z_{kl}$给出$$(l-1) = kz_{kl} + O(\log k).$$因此$$z_{kl} = \frac{l-1}{k} + O\!\left(\frac{\log k}{k}\right).$$有待比较$\frac{l-1}{k}$和$\frac{l}{k+1}$。 直接代数重排产生$$\frac{l-1}{k} - \frac{l}{k+1}
= \frac{(l-1)(k+1)-lk}{k(k+1)}
= \frac{l-k-1}{k(k+1)}.$$自从$1\le l\le k$，分子满足$|l-k-1|\le k$， 所以$$\left|\frac{l-1}{k} - \frac{l}{k+1}\right| \le \frac{1}{k}.$$结合两个估计，$$z_{kl} = \frac{l}{k+1} + O\!\left(\frac{\log k}{k}\right),$$由于额外的$\frac{1}{k}$项被吸收到对数界限中$k\ge 2$。 

所以，$$\left|z_{kl} - \frac{l}{k+1}\right| = O\!\left(\frac{\log k}{k}\right).$$这样就完成了证明。 ∎
