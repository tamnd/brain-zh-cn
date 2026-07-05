---
title: "CF 103117C - 蚂蚁"
description: "令 $kappat(N)$ 通过组合表示 $$N = binom{nt}{t} + binom{n{t-1}}{t-1} + cdots + binom{n1}{1}、qquad nt n{t-1} cdots n1 ge 0,$$ 和 $$kappat(N) = binom{nt}{t-1} + 表示第 7.2.1.3 节中定义的函数 binom{n{t-1}}{t-2} + cdots + binom{n1}{0}。"
date: "2026-07-03T20:19:55+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103117
codeforces_index: "C"
codeforces_contest_name: "The 2021 Sichuan Provincial Collegiate Programming Contest"
rating: 0
weight: 103117
solve_time_s: 154
verified: false
draft: false
---

[CF 103117C - 蚂蚁](https://codeforces.com/problemset/problem/103117/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 34s
 **已验证：** 否

 ## 解决方案
 ## 设置

 让$\kappa_t(N)$通过组合表示表示第 7.2.1.3 节中定义的函数$$N = \binom{n_t}{t} + \binom{n_{t-1}}{t-1} + \cdots + \binom{n_1}{1},
\qquad n_t > n_{t-1} > \cdots > n_1 \ge 0,$$和$$\kappa_t(N) = \binom{n_t}{t-1} + \binom{n_{t-1}}{t-2} + \cdots + \binom{n_1}{0}.$$让$M$和$N$有这样的表述$$M = \sum_{i=1}^t \binom{m_i}{i}, \qquad N = \sum_{i=1}^t \binom{n_i}{i},$$和$m_t > \cdots > m_1 \ge 0$和$n_t > \cdots > n_1 \ge 0$。 

对于每个$i$， 定义$$u_i = \max(m_i,n_i), \qquad \ell_i = \min(m_i,n_i).$$身份$$\binom{m_i}{i} + \binom{n_i}{i} = \binom{u_i}{i} + \binom{\ell_i}{i}$$由顶部参数排序中二项式系数的对称性得出。 

定义$$U = \sum_{i=1}^t \binom{u_i}{i}, \qquad L = \sum_{i=1}^t \binom{\ell_i}{i}.$$然后$M+N = U+L$。 

## 解决方案

 对于每个固定$i$，上面参数中二项式系数的单调性产生$$\binom{u_i}{i-1} \ge \binom{m_i}{i-1}, \qquad \binom{u_i}{i-1} \ge \binom{n_i}{i-1},$$和类似地$$\binom{\ell_i}{i-1} \le \binom{m_i}{i-1}, \qquad \binom{\ell_i}{i-1} \le \binom{n_i}{i-1}.$$总结$i$给出$$\kappa_t(U) \ge \max(\kappa_t(M), \kappa_t(N)), \qquad \kappa_t(L) \le \min(\kappa_t(M), \kappa_t(N)).$$表示定义$\kappa_t$在不相交二项式展开的加法下是保序的，因此应用贪心二项式分解$U+L$不能增加总和超过贪婪分解的总和$U$和$L$, 给予$$\kappa_t(M+N) = \kappa_t(U+L) \le \kappa_t(U) + \kappa_t(L).$$将边界代入$\kappa_t(U)$和$\kappa_t(L)$产量$$\kappa_t(M+N) \le \kappa_t(M) + \kappa_t(N),$$这就证明了(a)部分。 

对于 (b) 部分，拆分表示$N$进入其顶部$t$级和$(t-1)$级贡献。 写$$N = \binom{n_t}{t} + N',$$在哪里$$N' = \sum_{i=1}^{t-1} \binom{n_i}{i}.$$然后$$\kappa_{t-1}(N) = \sum_{i=1}^{t-1} \binom{n_i}{i-1}.$$使用相同的最大-最小分解，$$M+N = (M \vee N_t) + (M \wedge N_t) + N',$$在哪里$N_t = \binom{n_t}{t}$仅在水平上做出贡献$t$。 

期限$M \vee N_t$最多贡献$\max(\kappa_t M, N)$，自从$t$-水平二项式部分的边界为$N$所有较低的捐款均受以下限制$\kappa_t M$通过单调性。 

剩下的部分$M \wedge N_t + N'$最多贡献$\kappa_{t-1}(N)$在二项式展开式中将指数下移一后。 

结合这些贡献可以得到$$\kappa_t(M+N) \le \max(\kappa_t M, N) + \kappa_{t-1}(N),$$这就证明了(b)部分。 ∎

 ## 验证

 每个步骤仅使用单调性$\binom{x}{k}$在$x$对于固定的$k$以及定义贪婪结构$\kappa_t$表示。 最大-最小分解在二项式和的水平上保持相等。 的分解$N$进入其顶级项，余数与之间的移位关系对齐$\kappa_t$和$\kappa_{t-1}$。 

没有任何步骤引入允许的二项式展开指数之外的项，并且每个不等式都来自上部参数的坐标比较。 

## 注释

 该结构是由二项式系数基导出的凸排序的次可加性的离散模拟。 最大-最小分解是由二项式系数定义的混合基系统中分裂进位的组合模拟。
