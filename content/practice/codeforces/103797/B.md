---
title: "CF 103797B - 巴士投注"
description: "设 $$G(z)=sum{xin{0,1}^n} f(x),z^{x1+cdots+xn}.$$ 则 $$G(-1)=sum{x} f(x),(-1)^{ 其中 $ 将 $f$ 写在 $mathbb{R}$ 上的唯一多线性展开式中，$$f(x)=sum{Ssubseteq [n]} aS prod{iin S} xi,$$ 因此 $a{[n]}$ 是完整单项式 $x1x2cdots xn$ 的系数。"
date: "2026-07-02T08:47:06+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103797
codeforces_index: "B"
codeforces_contest_name: "IME++ Starters Try-outs 2022"
rating: 0
weight: 103797
solve_time_s: 52
verified: false
draft: false
---

[CF 103797B - 巴士投注](https://codeforces.com/problemset/problem/103797/B)

 **评级：** -
 **标签：** -
 **求解时间：** 52s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$$G(z)=\sum_{x\in\{0,1\}^n} f(x)\,z^{x_1+\cdots+x_n}.$$然后$$G(-1)=\sum_{x} f(x)\,(-1)^{|x|},$$在哪里$|x|=x_1+\cdots+x_n$。 

写$f$以其独特的多线性展开$\mathbb{R}$,$$f(x)=\sum_{S\subseteq [n]} a_S \prod_{i\in S} x_i,$$以便$a_{[n]}$是完整单项式的系数$x_1x_2\cdots x_n$。 

将这个展开式代入$G(-1)$交换总和给出$$G(-1)=\sum_{S\subseteq[n]} a_S \sum_{x\in\{0,1\}^n} \left(\prod_{i\in S} x_i\right)(-1)^{|x|}.$$内部总和消失，除非$S=[n]$。 确实，如果$j\notin S$，然后对于其他变量的每次赋值，通过翻转获得的两个赋值$x_j$贡献大小相等且符号相反，因为$(-1)^{|x|}$当因子改变符号时$\prod_{i\in S} x_i$是不变的。 这会产生完全取消。 因此仅$S=[n]$生存，给予$$G(-1)=a_{[n]}\sum_{x\in\{0,1\}^n} x_1x_2\cdots x_n(-1)^{|x|}.$$仅单个作业$x=(1,1,\dots,1)$贡献，所以$$G(-1)=a_{[n]}(-1)^n.$$因此$G(-1)\neq 0$意味着$a_{[n]}\neq 0$，所以多重线性多项式为$f$有学位$n$。 

每个 FBDD 特别是一棵决策树，决策树的标准多项式方法意味着任何确定性决策结构计算$f$深度必须至少等于所表示的多线性多项式的次数。 因此每个 FBDD 对于$f$必须包含查询所有内容的根到叶路径$n$变量。 

这正是回避的定义。 

这样就完成了证明。 ∎
