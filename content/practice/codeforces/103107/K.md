---
title: "CF 103107K - 继续吃"
description: "对于实数 $x get t-1$，定义广义二项式系数 $$binom{x}{t} = frac{x(x-1)cdots(x-t+1)}{t!}，qquad binom{x}{t-1} = frac{x(x-1)cdots(x-t+2)}{(t-1)!}。"
date: "2026-07-03T21:29:18+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103107
codeforces_index: "K"
codeforces_contest_name: "The 16th Heilongjiang Provincial Collegiate Programming Contest"
rating: 0
weight: 103107
solve_time_s: 95
verified: false
draft: false
---

[CF 103107K - 继续吃](https://codeforces.com/problemset/problem/103107/K)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 35s
 **已验证：** 否

 ## 解决方案
 ## 设置

 真实的$x \ge t-1$，定义广义二项式系数$$\binom{x}{t} = \frac{x(x-1)\cdots(x-t+1)}{t!}, \qquad 
\binom{x}{t-1} = \frac{x(x-1)\cdots(x-t+2)}{(t-1)!}.$$功能$x \mapsto \binom{x}{t}$严格递增于$[t-1,\infty)$自从$$\frac{\binom{x+1}{t}}{\binom{x}{t}} = \frac{x+1}{x-t+1} > 1 \quad (x \ge t-1).$$因此对于每个整数$N \ge 0$存在一个唯一的实数$x \ge t-1$这样$$N = \binom{x}{t}.$$定义实值函数$$\kappa_t^{(\mathbb{R})}(N) = \binom{x}{t-1} \quad \text{where } N = \binom{x}{t}.$$让整数版本$\kappa_t^{(\mathbb{Z})}(N)$定义如下：选择唯一的整数$m \ge t-1$这样$$\binom{m}{t} \le N < \binom{m+1}{t},$$并设置$$\kappa_t^{(\mathbb{Z})}(N) = \binom{m}{t-1}.$$目标是证明$$\kappa_t^{(\mathbb{R})}(N) \ge \kappa_t^{(\mathbb{Z})}(N)
\quad \text{for all integers } t \ge 1, \; N \ge 0.$$等式成立时$x$是一个整数。 

## 解决方案

 修复$t \ge 1$和$N \ge 0$。 让$x \ge t-1$是唯一的实数，使得$$N = \binom{x}{t}.$$让$m$是由下式确定的整数$$\binom{m}{t} \le \binom{x}{t} < \binom{m+1}{t}.$$自从$x \mapsto \binom{x}{t}$严格递增于$[t-1,\infty)$，不等式$$\binom{m}{t} \le \binom{x}{t}$$意味着$m \le x$，以及严格单调性力$m \le x < m+1$。 

因此$$m \le x.$$考虑功能$$f(x) = \binom{x}{t-1}.$$为了$x \ge t-1$，计算比率$$\frac{f(x+1)}{f(x)} = \frac{\binom{x+1}{t-1}}{\binom{x}{t-1}} = \frac{x+1}{x-t+2}.$$自从$x \ge t-1$, 一个有$x+1 \ge t$和$x-t+2 \le x+1$， 因此$$\frac{x+1}{x-t+2} > 1,$$所以$f(x)$严格递增于$[t-1,\infty)$。 

从$m \le x$和单调性$f$，由此可知$$\binom{m}{t-1} \le \binom{x}{t-1}.$$代入定义可得$$\kappa_t^{(\mathbb{Z})}(N) \le \kappa_t^{(\mathbb{R})}(N).$$如果$x$是一个整数，那么必然$x=m$，所以等式成立。 

这样就完成了证明。 ∎

 ## 验证

 该论证仅使用两个单调性事实，两者都直接从广义二项式系数的显式比率得出。 不平等$m \le x$由严格单调性得出$\binom{x}{t}$在$[t-1,\infty)$，以及比较$\kappa$值减少为单调性$\binom{x}{t-1}$。 没有使用额外的假设。
