---
title: "CF 103861K - 视力测试"
description: "令 $H$ 为 $mathbb{F}2$ 上的 $mtimes n$ 奇偶校验矩阵，并令 $$f(x)= [Hx=0], qquad x=(x1,dots,xn)^T.$$ 修复变量阶 $x1,dots,xn$。"
date: "2026-07-02T07:55:03+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103861
codeforces_index: "K"
codeforces_contest_name: "2021 ICPC Asia East Continent Final"
rating: 0
weight: 103861
solve_time_s: 123
verified: false
draft: false
---

[CF 103861K - 视力测试](https://codeforces.com/problemset/problem/103861/K)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 3s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$H$成为一个$m\times n$奇偶校验矩阵$\mathbb{F}_2$，并让$$f(x)= [Hx=0], \qquad x=(x_1,\dots,x_n)^T.$$修复可变顺序$x_1,\dots,x_n$。 为了$0\le k\le n$， 写$H_k$为$m\times k$子矩阵由第一个组成$k$的列$H$，并定义$$r_k = \operatorname{rank}(H_k).$$对于部分分配$u=(x_1,\dots,x_k)$，该综合症是$$s(u)=H_k u \in \mathbb{F}_2^m.$$由以下引出的子函数$u$关于其余变量$x_{k+1},\dots,x_n$是$$f_u(x_{k+1},\dots,x_n) = [H_{k+1..n}(x_{k+1},\dots,x_n) = s(u)].$$两项作业$u,u'$产生相同的子函数当且仅当$s(u)=s(u')$，因为校正子相等对其余变量给出了相同的仿射约束。 

地图$u\mapsto s(u)$图像等于的列空间$H_k$，有基数$2^{r_k}$。 因此，该级别的不同子功能的数量$k$在 BDD 中等于$2^{r_k}$。 

每个不同的子功能对应于该级别的唯一 BDD 节点$k$。 因此非终端节点的数量等于$$\sum_{k=0}^{n-1} 2^{r_k},$$自从$k=n$仅提供终端子功能。 

处于水平$n$，每个分配都会产生一致性$s(u)=0$或不一致$s(u)\ne 0$，所以所有一致的叶子合并成一个$\top$节点和所有不一致的叶子合并成一个$\bot$节点。 这正是贡献$2$汇节点。 

因此$$B(f)=\sum_{k=0}^{n-1} 2^{r_k} + 2.$$自从$r_0=0$，这相当于$$B(f)=3+\sum_{k=1}^{n-1} 2^{r_k}.$$对于汉明码，$n=2^m-1$， 和$H$具有以下所有非零向量作为列$\mathbb{F}_2^m$。 按照标准顺序，其中第一个$m$列组成可逆矩阵，秩增长满足$$r_k = k \quad (1\le k\le m), \qquad r_k=m \quad (m\le k\le n).$$代入公式可得$$B(f)=\sum_{k=0}^{m}2^k + \sum_{k=m+1}^{n-1}2^m + 2.$$第一个总和是$$\sum_{k=0}^{m}2^k = 2^{m+1}-1.$$第二个总和包含$n-1-m$项，因此等于$$(n-1-m)2^m.$$和$n=2^m-1$，这变成了$$(2^m-2-m)2^m.$$所以$$B(f)=(2^{m+1}-1) + (2^m-2-m)2^m + 2.$$简化，$$(2^{m+1}-1)+2 = 2^{m+1}+1,$$所以$$B(f)=2^{m+1}+1 + 2^{2m} - (m+2)2^m.$$自从$2^{m+1} = 2\cdot 2^m$，这变成了$$B(f)=2^{2m} - m2^m + 1.$$因此对于汉明码来说，$$\boxed{B(f)=2^{2m}-m2^m+1}.$$对于(c)部分，接收到的字$y=(y_1,\dots,y_n)$和独立通道概率$p_k=\Pr[y_k=x_k]$引入分配的似然权重$x$:$$\Pr(x\mid y) \propto \prod_{k=1}^n \bigl(p_k^{[x_k=y_k]} (1-p_k)^{[x_k\ne y_k]}\bigr).$$MAP 码字在所有方面最大化了该乘积$x$满意的$f(x)=1$。 在 BDD 中$f$，每个根到$\top$路径对应于一个码字。 在电平上分配每个 HI 边缘$k$因素$$p_k \text{ if } y_k=1,\quad (1-p_k) \text{ if } y_k=0,$$每个 LO 边缘都有互补因子。 

MAP码字是通过计算从根到的最大权重路径获得的$\top$，其中路径权重是边权重的乘积。 同样，取对数会将其转换为非循环 BDD 中的最长路径问题：$$\sum \log(\text{edge weight}).$$BDD 上的动态编程，按拓扑顺序评估节点，在根处产生最优值，回溯产生相应的码字。 

这样就完成了解决方案。 ∎
