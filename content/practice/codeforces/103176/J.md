---
title: "CF 103176J - 只是一张 \\10 美元的纸币"
description: "令 $[n]={1,2,dots,n}$ 并令 $mathcal{A}$ 为 $[n]$ 的 $r$ 子集族，这样对于所有 $alpha,betainmathcal{A}$ 都有 $alphacapbetaneqvarnothing$。 假设$rle n/2$。 目标是证明$$设$mathcal{B}={[n]setminus alpha : alphainmathcal{A}}$。"
date: "2026-07-03T16:44:09+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103176
codeforces_index: "J"
codeforces_contest_name: "La Salle-Pui Ching Programming Challenge 2019"
rating: 0
weight: 103176
solve_time_s: 131
verified: false
draft: false
---

[CF 103176J - 只是一张 \\10 美元的纸币](https://codeforces.com/problemset/problem/103176/J)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 11s
 **已验证：** 否

 ## 解决方案
 ## 设置

 让$[n]={1,2,\dots,n}$并让$\mathcal{A}$成为一个家庭$r$- 的子集$[n]$这样对于所有$\alpha,\beta\in\mathcal{A}$一个有$\alpha\cap\beta\neq\varnothing$。 认为$r\le n/2$。 目标是证明$$|\mathcal{A}|\le \binom{n-1}{r-1}.$$让$\mathcal{B}={[n]\setminus \alpha : \alpha\in\mathcal{A}}$。 的每一个元素$\mathcal{B}$有尺寸$n-r$。 

对于一套$X\subseteq[n]$，符号$\partial_k \mathcal{B}$表示$k$- 的影子$\mathcal{B}$，意味着所有人的家庭$k$- 某些成员中包含的子集$\mathcal{B}$。 

我们设定$k=n-2r$，这是非负的，因为$r\le n/2$。 

## 解决方案

 每个$B\in\mathcal{B}$有尺寸$n-r$，因此它恰好包含$$\binom{n-r}{n-2r}=\binom{n-r}{r}$$大小的子集$n-2r$。 总结一切$B\in\mathcal{B}$给出总发生率$$I=\sum_{B\in\mathcal{B}} \binom{n-r}{r}=|\mathcal{A}|\binom{n-r}{r}.$$现在修复一个$(n-2r)$-子集$X\subseteq[n]$。 让$$\mathcal{B}(X)=\{B\in\mathcal{B}: X\subseteq B\}.$$每一个这样的$B$对应于一个$r$-子集$\alpha=[n]\setminus B$包含在$X^c$，其大小为$2r$。 因此$\mathcal{B}(X)$与一个家庭处于双射状态$$\mathcal{A}(X)=\{\alpha\in\mathcal{A} : \alpha\subseteq X^c\},$$其中每个$\alpha$是一个$r$-固定的子集$2r$-放$X^c$。 

家人$\mathcal{A}(X)$仍然相交，因为相交是在限制下保留的。 所以$\mathcal{A}(X)$是一个交叉的家庭$r$-a的子集$2r$-元素集。 

根据极值情况下的 Erdős-Ko-Rado 定理$n=2r$，任何相交族$r$-a的子集$2r$-set 最多有大小$$\binom{2r-1}{r-1}.$$因此$$|\mathcal{B}(X)| \le \binom{2r-1}{r-1}.$$现在求和$(n-2r)$-子集$X$。 这样的子集的数量是$\binom{n}{n-2r}=\binom{n}{2r}$。 每个$B\in\mathcal{B}$准确贡献$\binom{n-r}{r}$这样的子集$X$包含在其中。 因此发生率相同$I$也满足$$I \le \binom{n}{2r}\binom{2r-1}{r-1}.$$将两个表达式组合起来$I$产量$$|\mathcal{A}|\binom{n-r}{r} \le \binom{n}{2r}\binom{2r-1}{r-1}.$$将二项式系数重写为阶乘形式，$$\binom{n}{2r}=\frac{n!}{(2r)!(n-2r)!},\quad
\binom{2r-1}{r-1}=\frac{(2r-1)!}{(r-1)!r!},\quad
\binom{n-r}{r}=\frac{(n-r)!}{r!(n-2r)!}.$$替换给出$$|\mathcal{A}| \le
\frac{n!}{(2r)!(n-2r)!}\cdot \frac{(2r-1)!}{(r-1)!r!}\cdot \frac{r!(n-2r)!}{(n-r)!}.$$取消$(n-2r)!$和$r!$将其简化为$$|\mathcal{A}| \le \frac{n!}{(2r)!}\cdot \frac{(2r-1)!}{(r-1)!}\cdot \frac{1}{(n-r)!}.$$使用$\frac{(2r-1)!}{(2r)!}=\frac{1}{2r}$，我们得到$$|\mathcal{A}| \le \frac{n!}{(n-r)!}\cdot \frac{1}{2r(r-1)!}.$$自从$\frac{n!}{(n-r)!}=n(n-1)\cdots(n-r+1)$, 重组给出$$|\mathcal{A}| \le \frac{(n-1)!}{(r-1)!(n-r)!}=\binom{n-1}{r-1}.$$这样就完成了证明。 ∎

 ## 验证

 重复计算是一致的，因为每对$(X,B)$和$|X|=n-2r$和$X\subseteq B$双向计数一次：固定一次$B$并选择$X\subseteq B$，并一次通过修复$X$并选择$B\supseteq X$。 

减少到a的情况$2r$- 元素接地设置有效，因为$X^c$有尺寸$2r$和每一个$\alpha\in\mathcal{A}(X)$是一个$r$- 的子集$X^c$。 

界限$|\mathcal{A}(X)|\le \binom{2r-1}{r-1}$使用尖锐的 EKR 极值情况$n=2r$，其中每个相交族都包含在一颗星中，因此其大小最多为$r$-包含固定元素的子集。 

所有阶乘取消都保持相等，因为所有项都是正数并且$r\le n/2$确保定义所有二项式系数。 

## 注释

 该论点隔离了一个$2r$-点限制，其中相交条件变得足够严格以迫使星形结构。 阴影参数$n-2r$正是允许每个$B\in\mathcal{B}$生成统一数量的低维见证，同时仍然嵌入极值$2r$- 管理边界的配置。
