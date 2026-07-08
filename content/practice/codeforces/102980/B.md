---
title: "CF 102980B - \u041f\u043e\u0432\u0440\u0435\u0436\u0434\u0435\u043d\u043d\u044b\u0439 \u043f\u0430\u0440\u043e\u043b\u044c"
description: "令 $mathcal{A}$ 为一组 $t$ 组合，并令 $$$kappat N = min{ 其中 $partial mathcal{A}$ 是通过从 $mathcal{A}$ 的成员中删除一个元素而获得的所有 $(t-1)$ 子集的集合。"
date: "2026-07-04T03:25:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102980
codeforces_index: "B"
codeforces_contest_name: "\u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u044b, \u0421\u0435\u0437\u043e\u043d 2020-2021, \u041f\u0435\u0440\u0432\u0430\u044f \u043b\u0438\u0447\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430"
rating: 0
weight: 102980
solve_time_s: 71
verified: false
draft: false
---

[CF 102980B - \u041f\u043e\u0432\u0440\u0435\u0436\u0434\u0435\u043d\u043d\u044b\u0439 \u043f\u0430\u0440\u043e\u043b\u044c](https://codeforces.com/problemset/problem/102980/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 11s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$\mathcal{A}$是一组$t$- 组合并让$|\mathcal{A}| = N$。 操作员$\kappa_t N$表示任何家族的阴影的最小可能大小$N$ $t$- 组合，即$$\kappa_t N = \min_{|\mathcal{A}| = N} |\partial \mathcal{A}|,$$在哪里$\partial \mathcal{A}$是所有的集合$(t-1)$- 通过从 的成员中删除一个元素而获得的子集$\mathcal{A}$。 

从定义$\partial$， 每个$t$- 组合完全贡献$t$清楚的$(t-1)$- 重叠识别之前的子集。 因此对于每一个$\mathcal{A}$,$$|\partial \mathcal{A}| \le t |\mathcal{A}| = tN.$$当达到这个界限时$N=1$，由于单个$t$- 组合正好$t$清楚的$(t-1)$-子集。 所以，$$\kappa_t 1 = t.$$最后，$$\kappa_t 1 - 1 = t - 1.$$要确定是否会出现更大的值，请考虑$N \ge 2$。 任意两个不同的$t$- 组合至少共享一个$(t-1)$-仅当它们仅在一个元素上不同时才设置子集； 在这种情况下，它们的阴影至少在一个元素中重叠，从而将总阴影大小严格减少到以下$tN$。 因此对于$N \ge 2$,$$\kappa_t N \le tN - 1,$$因为至少有一个重叠发生在任何非单一家庭的阴影下。 这意味着$$\kappa_t N - N \le (t-1)N - 1,$$这严格小于$t-1$为所有人$N \ge 2$。 

为了$N=0$,$\kappa_t 0 = 0$区别在于$0$。 

为了$N=1$，值为$t-1$，这是唯一的情况，其中上限$t$阴影大小是在没有重叠的情况下实现的。 

因此最大的$\kappa_t N - N$全面的$N \ge 0$达到$N=1$并且等于$$\boxed{t-1}.$$这样就完成了证明。 ∎
