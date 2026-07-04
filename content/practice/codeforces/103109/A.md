---
title: "CF 103109A - 学习排列"
description: "令 $kappat$ 为本节中定义的函数，其中 $mut$ 的逆函数为 $$M ge mut Nquad Longleftrightarrowquad kappat(M) ge N,$$ for $t ge 2$。"
date: "2026-07-03T21:13:47+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103109
codeforces_index: "A"
codeforces_contest_name: "mBIT Advanced Spring 2021"
rating: 0
weight: 103109
solve_time_s: 156
verified: false
draft: false
---

[CF 103109A - 学习排列](https://codeforces.com/problemset/problem/103109/A)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 36s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$\kappa_t$是本节中定义的函数，具有反函数$\mu_t$从某种意义上说$$M \ge \mu_t N \quad \Longleftrightarrow \quad \kappa_t(M) \ge N,$$为了$t \ge 2$。 让$\lambda_{t-1} M$表示$(t-1)$二项式表示中的水平贡献$\kappa_t(M)$，以便从构造中定义分解$\kappa_t$给出$$\kappa_t(M) = M + \lambda_{t-1} M.$$这个身份来自于以下的表示$\kappa_t(M)$作为二项式贡献的总和，其中顶级项是$M$剩下的贡献就是$(t-1)$- 结构应用于$M$。 

首先假设$M \ge \mu_t N$。 通过定义属性$\mu_t$，这相当于$\kappa_t(M) \ge N$。 代入分解$\kappa_t(M)$产量$$M + \lambda_{t-1} M \ge N.$$相反，假设$M + \lambda_{t-1} M \ge N$。 使用相同的分解重写左侧给出$\kappa_t(M) \ge N$，因此通过定义等价$\mu_t$,$$M \ge \mu_t N.$$这两种含义都是可逆的，因为每个步骤在分解时都使用等式$\kappa_t(M)$以及之间的定义等价$\mu_t$和$\kappa_t$。 所以，$$M \ge \mu_t N \quad \Longleftrightarrow \quad M + \lambda_{t-1} M \ge N.$$这样就完成了证明。 ∎
