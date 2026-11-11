---
title: "CF 2136D - 为了冠军"
description: "设 $p = beta - alpha$ 为单个 $Uj$ 位于区间 $[alpha, beta)$ 内的概率，如方程 (4) 所示。 当 $r$ 连续 $U$ 落在 $[alpha, beta)$ 之外，然后在该区间内出现 $U$ 时，就会出现长度为 $r$ 的间隙。"
date: "2026-06-09T04:10:41+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "interactive", "math"]
categories: ["algorithms"]
codeforces_contest: 2136
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 1046 (Div. 2)"
rating: 1700
weight: 2136
solve_time_s: 124
verified: false
draft: false
---

[CF 2136D - 为了冠军](https://codeforces.com/problemset/problem/2136/D)

 **评分：** 1700
 **标签：** 构造性算法、交互、数学
 **求解时间：** 2m 4s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$p = \beta - \alpha$是单个的概率$U_j$位于区间内$[\alpha, \beta)$，如方程（4）所示。 _gap 长度$r$_ 发生在$r$连续的$U$掉到外面了$[\alpha, \beta)$，后面跟着一个$U$区间内。 对于随机序列，间隙具有长度的概率$r$是$\Pr(\text{gap length } = r) = (1-p)^r p, \quad r \ge 0.$表示为$X$的数量$U$需要观察一个间隙。 如果间隙长度为$r$， 然后$X = r+1$，因为间隙由$r$一次成功之后又是一次失败。 所以，$X$是具有成功概率的几何随机变量$p$。 

的期望值$X$是$$E[X] = \sum_{r=0}^{\infty} (r+1)(1-p)^r p = \sum_{r=0}^{\infty} (1-p)^r p + \sum_{r=0}^{\infty} r (1-p)^r p.$$第一个总和是$$\sum_{r=0}^{\infty} (1-p)^r p = 1,$$因为它是总概率为 1 的几何级数之和。第二个和是$$\sum_{r=0}^{\infty} r (1-p)^r p = \frac{1-p}{p},$$通过计算失败次数的几何分布平均值的标准公式。 结合这些给出$$E[X] = 1 + \frac{1-p}{p} = \frac{1}{p}.$$因此，预期数量$U$观察单个间隙的方法是$1/p$。 

让$X_1, X_2, \ldots, X_n$是独立的副本$X$，代表数量$U$需要观察每一个$n$差距。 那么总共有$U$需要观察$n$间隙是$$S_n = X_1 + X_2 + \cdots + X_n.$$根据期望的线性度，$$E[S_n] = n E[X] = \frac{n}{p}.$$方差为$X$是$$\operatorname{Var}(X) = \frac{1-p}{p^2},$$再次通过几何变量的标准公式在第一次成功之前计算失败。 自从$X_j$是独立的，$$\operatorname{Var}(S_n) = n \operatorname{Var}(X) = \frac{n(1-p)}{p^2}.$$标准差是方差的平方根：$$\sigma = \sqrt{\operatorname{Var}(S_n)} = \frac{\sqrt{n(1-p)}}{p}.$$这样就完成了证明。 

∎$$\boxed{\text{Expected number of $U$'s: } \frac{n}{p}, \quad \text{Standard deviation: } \frac{\sqrt{n(1-p)}}{p}}$$
