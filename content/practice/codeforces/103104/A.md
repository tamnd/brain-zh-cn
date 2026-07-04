---
title: "CF 103104A - CRC 测试"
description: "修复整数 $t ge 1$。 令$N ge 0$ 被给出。 将离散意义上的 $kappat N$ 定义为唯一整数 $m get t-1$，使得 $$binom{m}{t} le N < binom{m+1}{t},$$ 并设置 $$kappat N = binom{m}{t-1}。"
date: "2026-07-03T21:43:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103104
codeforces_index: "A"
codeforces_contest_name: "2021 Hubei Provincial Collegiate Programming Contest"
rating: 0
weight: 103104
solve_time_s: 160
verified: false
draft: false
---

[CF 103104A - CRC 测试](https://codeforces.com/problemset/problem/103104/A)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 40s
 **已验证：** 否

 ## 解决方案
 ## 设置

 修复一个整数$t \ge 1$。 让$N \ge 0$被给予。 定义$\kappa_t N$在离散意义上（如第 7.2.1.3 节的前面部分）作为唯一整数$m \ge t-1$这样$$\binom{m}{t} \le N < \binom{m+1}{t},$$并设置$$\kappa_t N = \binom{m}{t-1}.$$现在定义连续扩展如下。 为了$x \ge t-1$，函数$x \mapsto \binom{x}{t}$严格递增，因此可逆到$[0,\infty)$。 对于每个$N \ge 0$， 让$x \ge t-1$满足$$N = \binom{x}{t},$$并定义$$\widetilde{\kappa}_t N = \binom{x}{t-1}.$$目标是证明$$\kappa_t N \le \widetilde{\kappa}_t N$$对于所有整数$t \ge 1$和$N \ge 0$。 

## 解决方案

 让$N \ge 0$并选择$x \ge t-1$这样$N = \binom{x}{t}$。 让$m$是由下式确定的整数$$\binom{m}{t} \le \binom{x}{t} < \binom{m+1}{t}.$$自从$x \mapsto \binom{x}{t}$严格递增于$[t-1,\infty)$，不平等意味着$m \le x < m+1$。 

功能$x \mapsto \binom{x}{t-1}$也在严格增加$[t-2,\infty)$。 真正的$x \ge m \ge t-1$，单调性产生$$\binom{m}{t-1} \le \binom{x}{t-1}.$$根据定义$\kappa_t N$在离散意义上，$$\kappa_t N = \binom{m}{t-1}.$$根据连续扩张的定义，$$\widetilde{\kappa}_t N = \binom{x}{t-1}.$$代入不等式可得$$\kappa_t N \le \widetilde{\kappa}_t N.$$这样就完成了证明。 ∎

 ## 验证

 真实的$x \ge t-1$，表达式$$\binom{x}{t} = \frac{x(x-1)\cdots(x-t+1)}{t!}$$是一个产品$t$线性因子，每个因子不减$x$在$[t-1,\infty)$，因此产品是严格递增的。 同样的论点也适用于$\binom{x}{t-1}$在$[t-2,\infty)$。 

如果$m$定义为$\binom{m}{t} \le \binom{x}{t} < \binom{m+1}{t}$，单调性力$m \le x < m+1$，否则严格增加将与顺序相矛盾。 

不平等$\binom{m}{t-1} \le \binom{x}{t-1}$直接从单调性得出$m \le x$。 

所有替换均符合定义$\kappa_t N$和$\widetilde{\kappa}_t N$。 

## 注释

 该论证仅依赖于广义二项式系数的单调性$[t-1,\infty)$并且不需要凸性或可微性。 等式成立时$x$是一个整数，因为那么$N = \binom{x}{t}$力量$m = x$，所以两个定义都给出$\binom{x}{t-1}$。
