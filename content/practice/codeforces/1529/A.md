---
title: "CF 1529A - Eshag 喜欢大阵列"
description: "令$U(x)$ 和$V(x)$ 为具有整数系数的$r$ 次多项式，并令$W(x) = U(x)V(x),$ 因此$W(x)$ 的次数最多为$2r$。 写$U(x) = sum{i=0}^{r} Ui x^i, qquad V(x) = sum{i=0}^{r} Vi x^i, qquad W(x) = sum{k=0}^{2r} Wk x^k。"
date: "2026-06-10T16:59:23+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 1529
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 722 (Div. 2)"
rating: 800
weight: 1529
solve_time_s: 151
verified: false
draft: false
---

[CF 1529A - Eshag 喜欢大数组](https://codeforces.com/problemset/problem/1529/A)

 **评分：** 800
 **标签：** 构造性算法，贪心，数学
 **求解时间：** 2m 31s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$U(x)$和$V(x)$是次数多项式$r$具有整数系数，并令$W(x) = U(x)V(x),$所以$W(x)$最多有学位$2r$。 

写$U(x) = \sum_{i=0}^{r} U_i x^i, \qquad V(x) = \sum_{i=0}^{r} V_i x^i, \qquad W(x) = \sum_{k=0}^{2r} W_k x^k.$使固定$2r+1$不同的整数$x_0, x_1, \ldots, x_{2r}$。 定义$P_j = U(x_j), \qquad Q_j = V(x_j), \qquad R_j = W(x_j) = P_jQ_j.$自从$W(x)$最多有学位$2r$，映射$W(x) \mapsto (W(x_0), W(x_1), \ldots, W(x_{2r}))$是单射的。 事实上，如果最多有一个次数多项式$2r$消失于$2r+1$不同的点，那么它同样为零。 

因此价值观$R_0, \ldots, R_{2r}$确定系数$W_0, \ldots, W_{2r}$独一无二。 

定义$(2r+1)\times(2r+1)$范德蒙矩阵$A$经过$A_{j,k} = x_j^k, \qquad 0 \le j,k \le 2r.$那么评价恒等式为$W(x)$是$R = AW,$在哪里$R = (W(x_0), \ldots, W(x_{2r}))^T, \qquad W = (W_0, \ldots, W_{2r})^T.$的独特性$x_j$意味着$A$是可逆的，因为它的行列式等于$\prod_{0 \le i < j \le 2r} (x_j - x_i) \ne 0.$因此$W = A^{-1}R.$让$\lambda_{k,j}$表示条目$A^{-1}$。 然后对于每个$k$,

 W_k = \sum_{j=0}^{2r} \lambda_{k,j} W(x_j)。 \标签{25}

 各系数$W_k$因此是值的固定线性组合$W(x_j)$，其中常数$\lambda_{k,j}$仅取决于所选的插值点$x_0, \ldots, x_{2r}$并且不在$U$或者$V$。 

自从$W(x_j) = U(x_j)V(x_j)$和每个$U(x_j), V(x_j)$是通过评估学位获得的$r$固定整数参数的多项式，每个这样的评估由有限多次加法和乘法组成，固定整数由下式确定$x_j$。 每个$W(x_j)$是相对于输入大小参数的有界大小的两个整数的一乘$n$在第 4.3.3 节的递归乘法模型中。 

重建公式（25）应用固定$(2r+1)\times(2r+1)$向量的线性变换$(W(x_0), \ldots, W(x_{2r}))$。 由于系数$\lambda_{k,j}$是独立于的固定整数$n$，此变换仅包含常数的加法和乘法。 

这就确定了每个系数$W_k$从值中获得$W(x_0), \ldots, W(x_{2r})$由线性关系 (25) 得到。 

这样就完成了证明。 ∎
