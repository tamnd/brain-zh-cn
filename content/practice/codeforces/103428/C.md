---
title: "CF 103428C - 赋值或乘法"
description: "令 $q$ 为单位的原 $m$ 根。 对于每个带有 $1 le i le t$ 的 $i$，写入 $$ni = m ai + bi, qquad 0 le bi < m,$$ 并设置 $$N = n1 + cdots + nt, qquad A = a1 + cdots + at, qquad B = b1 + cdots + bt,$$，以便 $N = mA + B$。"
date: "2026-07-03T09:41:14+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103428
codeforces_index: "C"
codeforces_contest_name: "The 2021 CCPC Weihai Onsite"
rating: 0
weight: 103428
solve_time_s: 62
verified: false
draft: false
---

[CF 103428C - 赋值或乘法](https://codeforces.com/problemset/problem/103428/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 2s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$q$成为一个原始人$m$统一的根。 对于每个$i$和$1 \le i \le t$， 写$$n_i = m a_i + b_i, \qquad 0 \le b_i < m,$$并设置$$N = n_1 + \cdots + n_t, \qquad A = a_1 + \cdots + a_t, \qquad B = b_1 + \cdots + b_t,$$以便$N = mA + B$。 

这$q$-多项式系数定义为$$\binom{N}{n_1,\ldots,n_t}_q = \frac{[N]!_q}{[n_1]!_q \cdots [n_t]!_q}.$$来自练习 49，对于每对$(n,k)$一个有因式分解$$\binom{n}{k}_q = \binom{\lfloor n/m \rfloor}{\lfloor k/m \rfloor}\binom{n \bmod m}{k \bmod m}_q.$$多项式系数允许伸缩分解$$\binom{N}{n_1,\ldots,n_t}_q
=
\binom{N}{n_1}_q
\binom{N-n_1}{n_2}_q
\cdots
\binom{n_t}{n_t}_q,$$自连续取消以来$q$-阶乘收益率$$\frac{[N]!_q}{[n_1]!_q \cdots [n_t]!_q}
=
\frac{[N]!_q}{[n_1]!_q [N-n_1]!_q}
\cdot
\frac{[N-n_1]!_q}{[n_2]!_q [N-n_1-n_2]!_q}
\cdots
\frac{[n_t]!_q}{[n_t]!_q}.$$对于每个因子，应用练习 49 中的二项式结果。对于第一个因子，$$\binom{N}{n_1}_q
=
\binom{A}{a_1}
\binom{B}{b_1}_q,$$自从$N = mA + B$和$n_1 = ma_1 + b_1$。 

移除后$n_1$，其余参数为$$N^{(1)} = N - n_1 = m(A-a_1) + (B-b_1),$$并迭代相同的分解给出，对于每个$j$,$$\binom{N - (n_1+\cdots+n_{j-1})}{n_j}_q
=
\binom{A - (a_1+\cdots+a_{j-1})}{a_j}
\binom{B - (b_1+\cdots+b_{j-1})}{b_j}_q.$$将这些身份相乘$j = 1,\ldots,t$在整数多项式部分和$q$- 多项式部分。 整数因子可伸缩至$$\binom{A}{a_1}\binom{A-a_1}{a_2}\cdots\binom{a_t}{a_t}
=
\binom{A}{a_1,\ldots,a_t},$$而$q$- 望远镜因素$$\binom{B}{b_1}_q\binom{B-b_1}{b_2}_q\cdots\binom{b_t}{b_t}_q
=
\binom{B}{b_1,\ldots,b_t}_q.$$结合两部分给出$$\binom{N}{n_1,\ldots,n_t}_q
=
\binom{A}{a_1,\ldots,a_t}
\binom{B}{b_1,\ldots,b_t}_q.$$替换回来$A = \sum_{i=1}^t \lfloor n_i/m \rfloor$和$B = \sum_{i=1}^t (n_i \bmod m)$产生指定的扩展：$$\boxed{
\binom{n_1+\cdots+n_t}{n_1,\ldots,n_t}_q
=
\binom{\sum_{i=1}^t \lfloor n_i/m \rfloor}{\lfloor n_1/m \rfloor,\ldots,\lfloor n_t/m \rfloor}
\binom{\sum_{i=1}^t (n_i \bmod m)}{n_1 \bmod m,\ldots,n_t \bmod m}_q
}.$$这样就完成了证明。 ∎
