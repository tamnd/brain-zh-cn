---
title: "CF 103828E - 你知道纳西姆在哪里吗？"
description: "设 $G(z)=sum{x1=0}^{1}cdotssum{xn=0}^{1} z^{x1+cdots+xn} f(x1,ldots,xn)$ 为练习 25 中定义的生成函数，并设 $F(p)$ 表示 $p1=cdots=pn=p$ 时的可靠性多项式，因此 $$F(p)=sum{x1=0}^{1}cdotssum{xn=0}^{1} (1-p)^{1-x1}p^{x1}cdots…"
date: "2026-07-02T08:14:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103828
codeforces_index: "E"
codeforces_contest_name: "(DCPC + TCPC + BCPC) 2022"
rating: 0
weight: 103828
solve_time_s: 95
verified: false
draft: false
---

[CF 103828E - 你纳西姆在哪里吗？](https://codeforces.com/problemset/problem/103828/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 35s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$G(z)=\sum_{x_1=0}^{1}\cdots\sum_{x_n=0}^{1} z^{x_1+\cdots+x_n} f(x_1,\ldots,x_n)$是练习 25 中定义的生成函数，并让$F(p)$表示可靠性多项式，当$p_1=\cdots=p_n=p$， 以便$$F(p)=\sum_{x_1=0}^{1}\cdots\sum_{x_n=0}^{1} (1-p)^{1-x_1}p^{x_1}\cdots (1-p)^{1-x_n}p^{x_n} f(x_1,\ldots,x_n).$$对于固定向量$x=(x_1,\ldots,x_n)$，根据汉明权重的乘积因子$w(x)=x_1+\cdots+x_n$, 给予$$(1-p)^{1-x_1}p^{x_1}\cdots (1-p)^{1-x_n}p^{x_n}=(1-p)^{n-w(x)}p^{w(x)}.$$替代率$$F(p)=\sum_{x} f(x)\, (1-p)^{n-w(x)} p^{w(x)}.$$因式分解$(1-p)^n$产生$$F(p)=(1-p)^n \sum_{x} f(x)\left(\frac{p}{1-p}\right)^{w(x)}.$$剩余的总和符合定义$G(z)$评估于$z=\frac{p}{1-p}$， 自从$z^{w(x)}$以相同的指数结构出现。 所以，$$F(p)=(1-p)^n G\!\left(\frac{p}{1-p}\right).$$这表达了$F(p)$作为生成函数的简单缩放，通过一次替换然后乘以单项式因子获得。 这样就完成了解决方案。 ∎
