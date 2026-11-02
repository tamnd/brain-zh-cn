---
title: "CF 1704B - 卢克是个美食家"
description: "提出了两种构造来生成在 $[-1,1]$ 上具有非平凡分布的随机变量 $X$。 第一个通过三角变换映射单个均匀偏差。"
date: "2026-06-09T21:29:11+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1704
codeforces_index: "B"
codeforces_contest_name: "CodeTON Round 2 (Div. 1 + Div. 2, Rated, Prizes!)"
rating: 1000
weight: 1704
solve_time_s: 153
verified: false
draft: false
---

[CF 1704B - 卢克是个美食家](https://codeforces.com/problemset/problem/1704/B)

 **评分：** 1000
 **标签：** 暴力、贪婪、实现
 **求解时间：** 2m 33s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 提出了两种生成随机变量的结构$X$具有非平凡分布$[-1,1]$。 第一个通过三角变换映射单个均匀偏差。 第二种在单位圆盘中使用拒绝采样，然后对接受点进行有理变换。 

问题是这两个过程是否会导致相同的分布$X$。 

让$U$均匀分布在$[0,1]$。 方法 1 定义$$X = \sin\!\left(\frac{\pi}{2}U\right).$$自从$U$是均匀的，变量$T = \frac{\pi}{2}U$是统一的$\left[0, \frac{\pi}{2}\right]$。 转变$X = \sin T$在此区间上单调递增，因此分布$X$由映射的反转确定。 

为了$-1 \le x \le 1$, 事件$X \le x$相当于$$\sin T \le x \quad \Longleftrightarrow \quad T \le \arcsin x,$$自从$\sin T$正在增加。 所以$$\Pr(X \le x) = \Pr\!\left(T \le \arcsin x\right) = \frac{2}{\pi}\arcsin x.$$因此方法 1 产生分布函数$$F_1(x) = \frac{2}{\pi}\arcsin x.$$方法2生成独立均匀$U, V$在$[-1,1]$以$U^2 + V^2 < 1$。 这是单位圆盘上的均匀分布。 圆盘上的接头密度是恒定的，因此可接受的点是径向对称的。 我们定义$$X = \frac{U^2 - V^2}{U^2 + V^2}.$$在磁盘上引入极坐标。 让$$U = R\cos\Theta, \quad V = R\sin\Theta,$$在哪里$R \in [0,1]$和$\Theta \in [0,2\pi)$， 和$\Theta$统一且独立$R^2$在面积测量引起的意义上。 然后$$X = \frac{R^2\cos^2\Theta - R^2\sin^2\Theta}{R^2\cos^2\Theta + R^2\sin^2\Theta} = \frac{\cos^2\Theta - \sin^2\Theta}{1} = \cos(2\Theta).$$径向变量完全抵消。 的分布$X$因此仅由$\Theta$，这是统一的$[0,2\pi)$。 

让$T = 2\Theta$， 所以$T$是统一的$[0,4\pi)$。 自从$\cos T$有月经$2\pi$，限制为一个时期给出了与$T$制服上$[0,2\pi)$。 因此我们可以计算分布$X = \cos T$和$T \sim \mathrm{Unif}[0,2\pi)$。 

为了$-1 \le x \le 1$,$$\Pr(X \le x) = \Pr(\cos T \le x).$$在$[0,2\pi)$, 集合${\cos T \le x}$由两条对称弧组成，其总长度为$2\pi - 2\arccos x$。 所以$$F_2(x) = 1 - \frac{1}{\pi}\arccos x.$$使用身份$\arccos x = \frac{\pi}{2} - \arcsin x$，我们得到$$F_2(x) = 1 - \frac{1}{\pi}\left(\frac{\pi}{2} - \arcsin x\right) = \frac{1}{2} + \frac{1}{\pi}\arcsin x.$$现在比较两个分布函数。 

方法 1 给出$$F_1(x) = \frac{2}{\pi}\arcsin x,$$而方法 2 给出$$F_2(x) = \frac{1}{2} + \frac{1}{\pi}\arcsin x.$$这些功能并不相等。 例如，在$x=0$,$$F_1(0) = 0, \qquad F_2(0) = \frac{1}{2}.$$由于分布函数在某个点的支持度不同，因此导出的分布也不同。 

这样就完成了解决方案。 ∎
