---
title: "CF 103102A - 考古学家"
description: "令$q$ 为原$m$次单位根，因此$q^m=1$ 和$q^jneq 1$ 对于$1le j<m$。 写入$n=am+r,quad k=bm+s,$，其中$0le r,s<m$ 且$a=lfloor n/mrfloor$，$b=lfloor k/mrfloor$。 高斯二项式系数为 $binom{n}{k}q=frac{[n]q!}{[k]q!,[n-k]q!},qquad [t]q!"
date: "2026-07-03T22:32:45+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103102
codeforces_index: "A"
codeforces_contest_name: "2020-2021 ICPC Southeastern European Regional Programming Contest (SEERC 2020)"
rating: 0
weight: 103102
solve_time_s: 152
verified: false
draft: false
---

[CF 103102A - 考古学家](https://codeforces.com/problemset/problem/103102/A)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 32s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$q$成为一个原始人$m$的统一根，所以$q^m=1$和$q^j\neq 1$为了$1\le j<m$。 写$n=am+r,\quad k=bm+s,$在哪里$0\le r,s<m$和$a=\lfloor n/m\rfloor$,$b=\lfloor k/m\rfloor$。 

高斯二项式系数为$\binom{n}{k}_q=\frac{[n]_q!}{[k]_q!\,[n-k]_q!},\qquad [t]_q!=\prod_{i=1}^t \frac{1-q^i}{1-q}.$常数因子$(1-q)^{-t}$取消商，所以$\binom{n}{k}_q=\prod_{i=1}^k \frac{1-q^{n-k+i}}{1-q^i}.$索引集${1,2,\dots,k}$被划分为模余数类别$m$。 写出每一个$i$独特地作为$i=jm+t,\quad j\ge 0,\quad 1\le t\le m,$在哪里$t=m$表示的倍数$m$。 分解将因素分为两类。 

对于非倍数$m$， IE。$t\in{1,\dots,m-1}$，我们有$q^{jm+t}=q^t$自从$q^m=1$。 因此，每个这样的因素仅取决于$t$并且不在$j$：$\frac{1-q^{n-k+jm+t}}{1-q^{jm+t}}=\frac{1-q^{(a-b)m+(r-s)+t}}{1-q^t}.$因此，所有非多重因素仅取决于$(r,s)$并以多重方式发生$b$完整块加上长度由下式确定的剩余块$s$; 他们的产品正是$\binom{r}{s}_q$，因为它是相同的产品$\binom{r}{s}_q$取消全额后$m$- 周期性重复。 

对于多个$m$， 拿$i=jm$和$1\le j\le b$。 然后分子和分母都消失：$1-q^{jm}=0,\qquad 1-q^{n-k+jm}=1-q^{(a-b)m+r-s+jm}=1-q^{jm+r-s}.$自从$q^{jm}=1$，两者都表现为分圆因子中的一阶零点$(1-x^m)$在$x=q^j$。 使用标准本地扩展$1-x^m=(1-x)(1+x+\cdots+x^{m-1}),$评估于$x=q^j$表明相应消失因子的比率减少到一个独立于$t$- 转变，以及的全部贡献$b$这些指数等于普通二项式系数$\binom{a}{b}.$要直接在产品级别查看这一点，请将索引分组$i=jm$在分子和分母中。 影响因素的倍数$m$形式$\prod_{j=1}^b \frac{1-q^{(a-b)m+r-s+jm}}{1-q^{jm}}.$因式分解后$q^{jm}=1$并取消常见的消失线性项$(1-x^m)$，剩余的非零常数精确地组装成$\prod_{j=1}^b \frac{a-b+j}{j}=\binom{a}{b},$这是标准限制$q$-单位原根处的整数。 

结合倍数和非倍数的贡献得出$\binom{n}{k}_q=\binom{a}{b}\binom{r}{s}_q.$替代$a=\lfloor n/m\rfloor$,$b=\lfloor k/m\rfloor$,$r=n\bmod m$,$s=k\bmod m$产量$\binom{n}{k}_q=\binom{\lfloor n/m\rfloor}{\lfloor k/m\rfloor}\binom{n\bmod m}{k\bmod m}_q.$这样就完成了证明。 ∎
