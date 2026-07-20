---
title: "CF 103824A - \u5361\u5c14\u7684\u793c\u7269"
description: "令 $f(x1,ldots,xn)$ 为布尔函数，并令 $$G(z)=sum{x1=0}^1 cdots sum{xn=0}^1 z^{x1+cdots+xn} f(x1,ldots,xn)$$ 为其生成函数，如前面练习中所定义。"
date: "2026-07-02T08:17:56+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103824
codeforces_index: "A"
codeforces_contest_name: "2022 Summer Camp of XTU Qualifying Round"
rating: 0
weight: 103824
solve_time_s: 42
verified: false
draft: false
---

[CF 103824A - \u5361\u5c14\u7684\u793c\u7269](https://codeforces.com/problemset/problem/103824/A)

 **评级：** -
 **标签：** -
 **求解时间：** 42s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$f(x_1,\ldots,x_n)$是一个布尔函数并让$$G(z)=\sum_{x_1=0}^1 \cdots \sum_{x_n=0}^1 z^{x_1+\cdots+x_n} f(x_1,\ldots,x_n)$$是前面练习中定义的生成函数。 

让$$F(p_1,\ldots,p_n)=\sum_{x_1=0}^1 \cdots \sum_{x_n=0}^1
\prod_{k=1}^n (1-p_k)^{1-x_k} p_k^{x_k}\, f(x_1,\ldots,x_n)$$是可靠性多项式。 

专注于案例$p_1=\cdots=p_n=p$。 那么乘积中的每一项就变成$(1-p)^{1-x_k}p^{x_k}$，所以向量的权重$x=(x_1,\ldots,x_n)$仅取决于$s=x_1+\cdots+x_n$。 该产品简化为$$\prod_{k=1}^n (1-p)^{1-x_k}p^{x_k} = (1-p)^{n-s} p^s.$$定义$$A_s = \sum_{x_1=0}^1 \cdots \sum_{x_n=0}^1 [x_1+\cdots+x_n=s]\; f(x_1,\ldots,x_n),$$以便$A_s$计数（带重量$f$）所有作业都具有$s$那些。 

那么可靠性多项式就变成$$F(p)=\sum_{s=0}^n A_s p^s (1-p)^{n-s}.$$生成函数满足$$G(z)=\sum_{s=0}^n A_s z^s,$$由于按汉明权重对术语进行分组$s$产生完全相同的系数$A_s$。 

现在重写$F(p)$通过保理$(1-p)^n$：$$F(p)=(1-p)^n \sum_{s=0}^n A_s \left(\frac{p}{1-p}\right)^s.$$内数总和为$G!\left(\frac{p}{1-p}\right)$通过代入生成函数。 

所以$$F(p)=(1-p)^n G\!\left(\frac{p}{1-p}\right).$$这直接用生成函数来表达具有相等参数的可靠性多项式。$$\boxed{F(p)=(1-p)^n\, G\!\left(\frac{p}{1-p}\right)}$$这样就完成了解决方案。 ∎
