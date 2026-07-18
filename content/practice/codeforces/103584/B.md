---
title: "CF 103584B - 白色鹅脚"
description: "令 $a{n-1}dots a1a0$ 为二进制字符串，其中 $sum{j=0}^{n-1} aj=t$ 并为 $1le jle n-1$ 定义 $bj=ajoplus a{j-1}$。 能量为 $r=sum{j=1}^{n-1} bj.$ 每个 $bj=1$ 恰好在 $ajne a{j-1}$ 时，因此 $r$ 等于序列 $a0,a1,dots,a{n-1}$ 中的转换数量。"
date: "2026-07-03T03:06:33+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103584
codeforces_index: "B"
codeforces_contest_name: "UTPC Contest 02-25-22 Div. 2 (Beginner)"
rating: 0
weight: 103584
solve_time_s: 66
verified: false
draft: false
---

[CF 103584B - 白鹅脚](https://codeforces.com/problemset/problem/103584/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 6s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$a_{n-1}\dots a_1a_0$是一个二进制字符串$\sum_{j=0}^{n-1} a_j=t$并定义$b_j=a_j\oplus a_{j-1}$为了$1\le j\le n-1$。 能量是$r=\sum_{j=1}^{n-1} b_j.$每个$b_j=1$恰好在什么时候$a_j\ne a_{j-1}$， 所以$r$等于序列中的转换数$a_0,a_1,\dots,a_{n-1}$。 因此字符串唯一地分解为$r+1$最大恒定运行。 

让这些运行从左到右写为$u_1,u_2,\dots,u_{r+1},$在哪里$u_i\ge 1$和$u_1+u_2+\cdots+u_{r+1}=n.$设初始位为$\varepsilon\in{0,1}$。 跑步交替进行，所以跑步$i$由位组成$\varepsilon \oplus (i-1)\bmod 2.$重量限制$\sum_{j=0}^{n-1} a_j=t$成为游程长度的线性条件。 定义索引集$I_1(\varepsilon)=\{\,i\mid 1\le i\le r+1,\ \varepsilon\oplus(i-1)\equiv 1 \pmod 2\,\}.$然后$\sum_{i\in I_1(\varepsilon)} u_i=t.$因此，每个配置都是由初始位的选择唯一确定的$\varepsilon$和一个组合物$(u_1,\dots,u_{r+1})$的$n$分解为满足上述线性约束的正部分。 

对于词典生成，可以方便地用标准差异表示来替换组合。 定义$p_0=u_1,\quad p_i=u_{i+1}-u_i\ \ (1\le i\le r),$以便$u_k=p_0+p_1+\cdots+p_{k-1}\quad (1\le k\le r+1).$条件$u_i\ge 1$翻译成$p_0\ge 1,\qquad p_0+p_1+\cdots+p_k\ge k+1\ \ (0\le k\le r).$总和条件变为$n=\sum_{k=0}^{r} (r+1-k)p_k + \sum_{k=1}^{r} k p_k,$它简化为组合和非负增量序列之间的标准双射； 特别是，每项可受理的$(u_1,\dots,u_{r+1})$由以下组合唯一地表示$n$进入$r+1$积极的部分。 

因此，生成减少为生成以下的所有组合$n$进入$r+1$积极的部分并测试重量限制。 

从算法上来说，让$(u_1,\dots,u_{r+1})$像标准组合生成一样按字典顺序生成（等效地，通过迭代$r$之间的分隔符$n-1$间隙）。 对于每个生成的组合，通过运行奇偶性计算权重贡献。 

直接词典编排的过程如下。 维持$u_1,\dots,u_{r+1}$和$u_i\ge 1$和$\sum u_i=n$。 在每一步中，增加最右边的索引$j$这样$u_j$可以增加，同时仍然允许完成积极的部分：$u_j < n - \sum_{i<j} u_i - (r+1-j).$增加后$u_j$， 放$u_{j+1}=\cdots=u_{r+1}=1.$这会按照字典顺序生成所有的作品一次。 

对于生成的每个组合物，计算$t'=\sum_{i\in I_1(\varepsilon)} u_i.$该配置在以下时间被接受：$t'=t$。 

为了证明正确性，每个二进制字符串都具有能​​量$r$产生独特的运行分解$(u_1,\dots,u_{r+1})$和一个独特的初始位$\varepsilon$，因此当且仅当生成其相关组合并满足权重方程时，它才会由该过程生成。 相反，每个生成的对$(\varepsilon,(u_1,\dots,u_{r+1}))$定义一个唯一的二进制字符串，其运行结构恰好具有$r$过渡和权重$t$通过交替赋值和总和约束的构造。 

这在有效配置和接受的生成对之间建立了双射，因此算法生成所有且仅生成所需的字符串。 

这样就完成了证明。 ∎
