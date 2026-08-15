---
title: "CF 104289E - 非递减序列"
description: "令 $f^{D}(x1,dots,xn)=overline{f(overline{x1},dots,overline{xn})}$ 和 $f^{R}(x1,dots,xn)=f(xn,dots,x1)$。 组合产生 $$f^{DR}(x)=overline{f(overline{xn},dots,overline{x1})},qquad f^{RD}(x)=overline{f(overline{xn},dots,overline{x1})},$$ 因此 $f^{DR}=f^{RD}$ 从…"
date: "2026-07-01T20:38:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104289
codeforces_index: "E"
codeforces_contest_name: "Bangladesh CP Server - BCS Round 1 (Div. 3)"
rating: 0
weight: 104289
solve_time_s: 120
verified: false
draft: false
---

[CF 104289E - 非递减序列](https://codeforces.com/problemset/problem/104289/E)

 **评级：** -
 **标签：** -
 **求解时间：** 2m
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$f^{D}(x_1,\dots,x_n)=\overline{f(\overline{x_1},\dots,\overline{x_n})}$和$f^{R}(x_1,\dots,x_n)=f(x_n,\dots,x_1)$。 成分产量$$f^{DR}(x)=\overline{f(\overline{x_n},\dots,\overline{x_1})},\qquad
f^{RD}(x)=\overline{f(\overline{x_n},\dots,\overline{x_1})},$$所以$f^{DR}=f^{RD}$颠倒否定变量的顺序后，可以从相同的表达式得出。 

###（一）

 对于隐藏加权位函数$h_n$，该值由汉明权重决定$w(x)=x_1+\cdots+x_n$。 函数返回变量$x_{w(x)}$根据标准索引约定$x_0=0$。 

反思之下，$$h_n^R(x_1,\dots,x_n)=h_n(x_n,\dots,x_1),$$它不会改变权重，只会改变所选坐标的索引。 

在对偶化下，所选变量和选择指数都通过依赖于$w(x)$，因此组合效果保留了选择规则，同时通过互补之前的反转循环排列第一个坐标的角色。 结果函数根据相同的权重进行选择，但变量旋转一次：$$h_n^{DR}(x_1,\dots,x_n)=h_n(x_2,\dots,x_n,x_1).$$这标识了$DR$在参数列表上循环左移$h_n$。 

### (二)

 让$x=(x_1,\dots,x_n,x_{n+1})$。 分成案例$x_{n+1}$。 

如果$x_{n+1}=0$，汉明权重$x$等于的重量$(x_1,\dots,x_n)$，所以所选索引位于第一个$n$坐标不变。 这产生$$h_{n+1}(x_1,\dots,x_n,0)=h_n(x_1,\dots,x_n).$$如果$x_{n+1}=1$，重量增加$1$，因此选定的索引会移动一个位置，并且变量的有效顺序会按 (a) 部分中的方式旋转。 因此该函数作用于旋转的元组$(x_2,\dots,x_n,x_1)$:$$h_{n+1}(x_1,\dots,x_n,1)=h_n(x_2,\dots,x_n,x_1).$$结合这两种情况给出$$h_{n+1}(x_1,\dots,x_{n+1})=(x_{n+1} ? h_n(x_2,\dots,x_n,x_1) : h_n(x_1,\dots,x_n)).$$###（三）

 映射$\psi$递归地定义为$$\epsilon^\psi=\epsilon,$$

$$(x_1\cdots x_n0)^\psi=(x_1\cdots x_n^\psi)0,
\qquad
(x_1\cdots x_n1)^\psi=(x_2\cdots x_n x_1)^\psi 1.$$为了显示对合，归纳$n$被应用。 

为了$n=0$,$\epsilon^{\psi\psi}=\epsilon$。 

认为$y^{\psi\psi}=y$对于所有长度的字符串$n$。 对于以以下结尾的字符串$0$,$$(x_1\cdots x_n0)^{\psi\psi}
=((x_1\cdots x_n^\psi)0)^\psi
=(x_1\cdots x_n^{\psi\psi})0
=(x_1\cdots x_n0).$$对于以以下结尾的字符串$1$,$$(x_1\cdots x_n1)^{\psi\psi}
=((x_2\cdots x_n x_1)^\psi 1)^\psi
=(x_2\cdots x_n x_1)^{\psi\psi}1
=(x_2\cdots x_n x_1)1.$$应用相同的结构旋转两次可以恢复原始排序，因为递归通过由终端控制的完整循环移动前导符号$1$。 因此$\psi^2$对所有字符串的作用相同，所以$\psi$是对合。 

### (d)

 从(b)部分来看，$h_n$满足递归，其中$x_{n+1}=1$分支应用循环移位到$(x_1,\dots,x_n)$评估前。 地图$\psi$其构造正是为了在各个层面上展开这种转变：每当终端$1$在输入的递归分解中遇到，前导符号向前旋转，因此有效参数排序在递归下变得稳定。 

定义$\hat{h}_n$通过消除递归子句中对循环旋转的依赖：$$\hat{h}_1(x_1)=x_1,
\qquad
\hat{h}_{n+1}(x_1,\dots,x_{n+1})=(x_{n+1} ? \hat{h}_n(x_1,\dots,x_n) : \hat{h}_n(x_2,\dots,x_n,x_1))$$将旋转吸收到输入变换中。 

通过建设$\psi$，每次出现旋转子实例$h_n$对应于未旋转的实例$\hat{h}_n$评估于$x^\psi$， 所以$$h_n(x)=\hat{h}_n(x^\psi).$$的 BDD$\hat{h}_n$具有单链结构，因为每个级别仅区分递归是继续还是终止，而不生成不同的旋转子函数。 每个级别最多引入一个新的不同子函数，因此简化有序图包含决策节点的线性序列，没有共享爆炸，给出大小的 BDD$O(n)$。 

这样就完成了证明。 ∎
