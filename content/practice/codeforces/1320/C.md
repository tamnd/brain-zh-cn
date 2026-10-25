---
title: "CF 1320C - 黑暗世界：阿撒托斯之战"
description: "是的，不等式 $nu(n) le 2^{l(n) - lambda(n)}$ 对于所有正整数 $n$ 都成立。 考虑最小长度 $l(n)$ 的加法链，并令 $lambda(n)$ 为仅由加倍步骤组成的最短链的长度。"
date: "2026-06-11T16:55:01+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1320
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 625 (Div. 1, based on Technocup 2020 Final Round)"
rating: 2000
weight: 1320
solve_time_s: 168
verified: false
draft: false
---

[CF 1320C - 暗筏世界：阿撒托斯之战](https://codeforces.com/problemset/problem/1320/C)

 **评级：** 2000
 **标签：** 暴力破解、数据结构、排序
 **求解时间：** 2m 48s
 **已验证：** 否

 ## 解决方案
 是的，不平等$\nu(n) \le 2^{l(n) - \lambda(n)}$对于所有正整数都成立$n$。 考虑最小长度的加法链$l(n)$并让$\lambda(n)$是仅由双步组成的最短链的长度。 每个非加倍步骤最多可以使当前指数的二进制表示形式中的 1 数量加倍。 因此，从单一出发$1$， 后$l(n) - \lambda(n)$非重复步数，步数$\nu(n)$满足$\nu(n) \le 2^{l(n) - \lambda(n)}$。 

这直接建立了界限。 因此，将这个不等式应用到$2^n - 1$，其二进制表示形式包括$n$，我们得到下界$l(2^n - 1) \ge n - 1 + \lfloor \lg n \rfloor$，与方程（17）和（49）一致。 至此论证完毕。 ∎
