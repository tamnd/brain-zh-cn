---
title: "CF 103810B - \u041f\u0430\u0440\u043d\u044b\u0439\u0442\u0430\u043d\u0435\u0446"
description: "让 $f(x1,dots,xn)$ 由根节点 $r$ 的有序简化 BDD 表示。 对于 BDD 中的每个节点 $k$，为其变量索引写入 $V(k)$，并为其两个后继写入 $mathrm{LO}(k)$ 和 $mathrm{HI}(k)$。 接收器是 $bot$ 和 $top$。"
date: "2026-07-02T08:32:38+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103810
codeforces_index: "B"
codeforces_contest_name: "\u0412\u0441\u0435\u0440\u043e\u0441\u0441\u0438\u0439\u0441\u043a\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432 \u043f\u043e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0442\u0438\u043a\u0435 2021\u20142022, \u041c\u0443\u043d\u0438\u0446\u0438\u043f\u0430\u043b\u044c\u043d\u044b\u0439 \u044d\u0442\u0430\u043f, \u0427\u0435\u043b\u044f\u0431\u0438\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c"
rating: 0
weight: 103810
solve_time_s: 127
verified: false
draft: false
---

[CF 103810B - \u041f\u0430\u0440\u043d\u044b\u0439\u0442\u0430\u043d\u0435\u0446](https://codeforces.com/problemset/problem/103810/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 7s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$f(x_1,\dots,x_n)$由带有根节点的有序简化 BDD 表示$r$。 对于每个节点$k$在 BDD 中，写$V(k)$为其变量索引，并写入$\mathrm{LO}(k)$和$\mathrm{HI}(k)$为其两位继任者。 水槽是$\bot$和$\top$。 

对于每个节点$k$，定义一个布尔函数$f_k$关于变量$x_{V(k)}, x_{V(k)+1}, \dots, x_n$作为由 BDD 表示的子函数，植根于$k$。 让$T(k)$表示真值表$f_k$按照第 7.1.1 节中使用的顺序，即字典顺序$(x_{V(k)},\dots,x_n)$从零开始。 

BDD 的结构意味着分解$$f_k(x_{V(k)},\dots,x_n) = 
\begin{cases}
f_{\mathrm{LO}(k)}(x_{V(k)+1},\dots,x_n) & \text{if } x_{V(k)}=0,\\
f_{\mathrm{HI}(k)}(x_{V(k)+1},\dots,x_n) & \text{if } x_{V(k)}=1.
\end{cases}$$这个恒等式决定了真值表的相应分解。 如果$T(k)$有长度$2^m$， 在哪里$m = n - V(k) + 1$，那么每个$T(\mathrm{LO}(k))$和$T(\mathrm{HI}(k))$有长度$2^{m-1}$。 真值表的排序约定意味着前半部分$T(k)$对应于$x_{V(k)}=0$下半部分对应于$x_{V(k)}=1$。 所以$$T(k) = T(\mathrm{LO}(k)) \, T(\mathrm{HI}(k)).$$对于接收器，相应的子函数是常量。 如果$k=\bot$， 然后$f_k$是相同的$0$， 因此$$T(\bot) = 00\cdots 0 \quad (2^m \text{ zeros for the appropriate } m).$$如果$k=\top$， 然后$f_k$是相同的$1$， 因此$$T(\top) = 11\cdots 1.$$算法C被修改，用二进制字符串的连接代替子结果的算术组合。 评估按照由变量排序引起的逆拓扑顺序在 BDD 上自下而上进行。 对于每个节点$k$， 一次$T(\mathrm{LO}(k))$和$T(\mathrm{HI}(k))$已经计算出，值$T(k)$是通过串联而成的。 因为 BDD 被缩减，所以每个节点计算一次，并且因为它是有序的，所以所有依赖关系都在变量索引中严格前向，因此这个评估顺序被很好地定义。 

通过对变量索引进行归纳可以得出正确性。 对于汇，该陈述根据定义成立。 对于分支节点$k$， 认为$T(\mathrm{LO}(k))$和$T(\mathrm{HI}(k))$正确表示通过修复获得的子函数$x_{V(k)}=0$和$x_{V(k)}=1$。 真值表的字典结构恰好分为这两半，因此串联精确地产生了真值表$f_k$。 这样就完成了归纳步骤。 

将构造应用于根节点会产生$T(r)$，这是完全详细的真值表$f$在标准中$2^n$位排序。 

因此，修改后的算法 C 输出$T(r)$，真值表$f$。$$\boxed{T(r)}$$
