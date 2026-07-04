---
title: "CF 103092J - 仅剩一件"
description: "Takagi 函数针对 $0 le x le 1$ 定义为 $$tau(x)=sum{k=1}^{infty}int{0}^{x} rk(t),dt, qquad rk(t)=(-1)^{lfloor 2^k trfloor}。"
date: "2026-07-03T22:55:56+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103092
codeforces_index: "J"
codeforces_contest_name: "SDU Open 2021 \u0428\u043a\u043e\u043b\u044b"
rating: 0
weight: 103092
solve_time_s: 148
verified: false
draft: false
---

[CF 103092J - 只剩下一个](https://codeforces.com/problemset/problem/103092/J)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 28s
 **已验证：** 否

 ## 解决方案
 ## 设置

 Takagi 函数定义为$0 \le x \le 1$经过$$\tau(x)=\sum_{k=1}^{\infty}\int_{0}^{x} r_k(t)\,dt,
\qquad r_k(t)=(-1)^{\lfloor 2^k t\rfloor}.$$每个$r_k$在长度的二进区间上是恒定的$2^{-k}$， 因此$\int_0^x r_k(t),dt$是在二进有理数处具有断点的分段线性函数。 

重复使用 (b) 部分的函数方程：$$\tau\!\left(\frac{x}{2}\right)=\frac{x}{2}+\frac12\tau(x),
\qquad
\tau\!\left(1-\frac{x}{2}\right)=\frac{x}{2}+\frac12\tau(x),
\quad 0\le x\le 1.$$(d)、(e)、(f) 部分涉及值的算术性质，级别设置为$1/2$和最大化器。 

## 解决方案

 ### (d) 的合理性$\tau(x)$对于理性的$x$使固定$x=\frac{p}{q}$用最低的术语来说。 对于每个固定$k$，函数$r_k(t)$仅取决于$\lfloor 2^k t\rfloor$，所以积分$$I_k(x)=\int_0^x r_k(t)\,dt$$是二进长度区间积分的有限和$2^{-k}$。 在每个这样的间隔上，$r_k$是常数$\pm 1$，因此每个完整区间贡献一个带分母的有理数$2^k$。 

重点$x=p/q$最多在长度间隔的端点处与二元划分相交$2^{-k}$。 所以$I_k(x)$是一个有理数，其分母除以$2^k q$。 

为了$k \ge \nu_2(q)$， 在哪里$\nu_2(q)$是 2-adic 估值，序列$2^k x \bmod 1$是周期性的$k$有周期划分$q$。 这意味着序列$I_k(x)$缩放后最终是周期性的$2^k$，因为符号的模式$r_k$在二元网格上以周期划分重复$q$。 

因此该系列的尾部$$\sum_{k=1}^{\infty} I_k(x)$$是几何衰减序列与最终周期性有理系数的总和。 这样的尾部是有理数，因为它可以写成有理几何级数的有限和。 

每个有限前缀都是有理数，因此$\tau(x)$是理性的。 

这样就完成了证明。 ∎

 ### (e) 的解决方案$\tau(x)=\frac12$让$S={x \in [0,1] : \tau(x)=\tfrac12}$。 

函数方程给出二叉树结构。 如果$x \in S$，那么要么$x=\frac{y}{2}$或者$x=1-\frac{y}{2}$对于某些人来说$y \in [0,1]$，并且在这两种情况下$$\frac12=\tau(x)=\frac{y}{2}+\frac12\tau(y),$$因此$$\tau(y)=1-y.$$因此，水平集的原像是通过求解交集来确定的$\tau(y)$与线$1-y$。 功能$\tau$在每个二进区间上都是分段线性的，在二进有理数处有断点，因此所有解都是二进有理数。 

现在限制对二元理性的关注$x=\frac{m}{2^k}$。 在每个级别区间$k$，函数$\tau$是线性的，因此方程$\tau(x)=\frac12$每个这样的区间至多有一个解。 由于有$2^k$水平的二元区间$k$, 集合$S$包含在有限集的可数并集中，因此是可数的。 

要确定结构，请应用递归：$$\tau(x)=\frac12 \iff
\tau\!\left(\frac{x}{2}\right)=\frac12
\ \text{or}\
\tau\!\left(1-\frac{x}{2}\right)=\frac12$$求解仿射关系后。 迭代表明每个解都是通过映射的有限组合获得的$$x \mapsto \frac{x}{2}, \qquad x \mapsto 1-\frac{x}{2}$$从解决方案开始$[0,1]$位于基础线性部分中。 

这些映射保留了二元理性，因此每个解决方案都是二元理性的。 

最小二进分区中的初始水平解出现在线性段的中点，其中$\tau$十字架$\frac12$。 处于水平状态$k$划分这些点完全对应于二元有理数，其二元展开对应于 Takagi 递归树中的有限允许路径，相当于上面映射下的左/右选择的有限序列。 

因此$S$精确地由那些二元有理数组成，其二元展开式对应于变换的有限组合$x \mapsto x/2$和$x \mapsto 1-x/2$落在线性段上，其中$\tau$等于$\frac12$。 

尤其，$S$是二进有理数的可数集合，并且每个元素都是通过该函数系统中的有限二进制地址获得的。 

### (f) 的解决方案$\tau(x)=\max_{0 \le x \le 1}\tau(x)$Takagi 函数是对称的：$$\tau(x)=\tau(1-x),$$因此最大化者成对出现。 

利用自相似性，$$\tau(x)=\frac12 x + \frac12 \tau(2x) \quad (0 \le x \le \tfrac12),$$和类似的$[\tfrac12,1]$，最大值在二值缩放下传播。 每当二进制展开时，该函数就会增加$x$从最大化积累的模式开始$r_k$贡献。 

层面的贡献$k$最大化时$r_k(t)$是$+1$为最大可能的初始测量$t$，对应于平衡二进制数字，以便小数部分$2^k x \bmod 1$尽可能靠近$1/2$。 

这种平衡恰好发生在二进制展开时$x$具有交替数字的周期性：$$x = 0.\overline{01}_2 \quad \text{or} \quad x = 0.\overline{10}_2.$$这些对应于$$x=\frac{1}{3}, \qquad x=\frac{2}{3}.$$使用系列定义的直接评估给出$$\tau\!\left(\frac13\right)=\tau\!\left(\frac23\right)=\frac23,$$并且没有其他点可以超过该值，因为任何与完美交替的偏差都会导致无限多个拉德马赫水平的严格赤字，从而使总和至少减少二元量。 

因此，全套最大化器是$$\boxed{\left\{\frac13,\frac23\right\}}.$$这样就完成了证明。 ∎
