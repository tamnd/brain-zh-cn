---
title: "CF 1348D - 凤凰与科学"
description: "令 $u(x)$ 为具有整数系数且在 $mathbb{Z}$ 上无平方的多项式。 这意味着 $u(x)$ 在 $mathbb{C}$ 中没有重根，相当于 $mathbb{Z}[x]$ 中的 $gcd(u(x), u'(x)) = 1$，其中 $u'(x)$ 是 $u(x)$ 的导数。"
date: "2026-06-11T14:48:27+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "constructive-algorithms", "greedy", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 1348
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 638 (Div. 2)"
rating: 1900
weight: 1348
solve_time_s: 173
verified: false
draft: false
---

[CF 1348D - 凤凰与科学](https://codeforces.com/problemset/problem/1348/D)

 **评级：** 1900
 **标签：** 二分查找、构造性算法、贪心、实现、数学
 **求解时间：** 2m 53s
 **已验证：** 否

 ## 解决方案
 ## 练习 4.6.2.23 的更正解

 让$u(x)$是一个具有整数系数且无平方的多项式$\mathbb{Z}$。 这意味着$u(x)$没有重复的根$\mathbb{C}$，等价地，$\gcd(u(x), u'(x)) = 1$在$\mathbb{Z}[x]$， 在哪里$u'(x)$是$u(x)$。 

我们想要证明素数的数量是有限的$p$这样$u(x)$不是 squarefree 模$p$，即减少$\overline{u}(x) \in \mathbb{F}_p[x]$有重根。 

### 步骤 1：平方自由度模的表征$p$多项式$v(x)$在一片田野上$F$是无平方的当且仅当$\gcd(v(x), v'(x)) = 1$在$F[x]$。 所以，$\overline{u}(x)$**不是无平方模$p$** 当且仅当$$\gcd\big(\overline{u}(x), \overline{u}'(x)\big) \neq 1 \quad \text{in } \mathbb{F}_p[x].$$等价地，存在一个非常数多项式$d(x) \in \mathbb{F}_p[x]$将两者分开$\overline{u}(x)$和$\overline{u}'(x)$。 

### 第 2 步：使用结果

 让$R = \operatorname{Res}(u, u')$表示**结果**$u(x)$和$u'(x)$。 所得结果满足：$$R = 0 \quad \text{if and only if} \quad \gcd(u, u') \neq 1 \text{ in } \mathbb{C}[x].$$自从$u(x)$是无平方的$\mathbb{Z}$，我们有$\gcd(u, u') = 1$超过$\mathbb{Z}[x]$， 所以$$R = \operatorname{Res}(u, u') \neq 0.$$结果是一个整数。 此外，对于任意素数$p$，减少$u$模数$p$满足$$\overline{u}(x) \text{ is not squarefree over } \mathbb{F}_p \quad \iff \quad p \text{ divides } R.$$这是因为$\gcd(\overline{u}, \overline{u}') \neq 1$超过$\mathbb{F}_p[x]$当且仅当结果对模消失$p$。 

### 步骤 3：只有有限多个素数可以整除非零整数

 自从$R \in \mathbb{Z}$是非零的，它只有有限多个素因数。 让$p_1, p_2, \dots, p_k$表示这些素数。 那么对于任意素数$p \notin \{p_1, \dots, p_k\}$，多项式$\overline{u}(x)$是无平方模$p$。 

### 步骤 4：结论

 因此，素数集$p$这样$u(x)$**不是无平方模$p$** 包含在有限素因数集中$\operatorname{Res}(u, u')$。 因此，这样的素数只有有限个。$$\boxed{\text{Only finitely many primes } p \text{ make } u(x) \text{ not squarefree modulo } p.}$$### 第 5 步：可选备注

 该论证不需要显式计算$u(x)$或者$u'(x)$。 它纯粹依赖于结果的代数性质以及非零整数具有有限多个素因数的事实。 

**解决方案结束。**
