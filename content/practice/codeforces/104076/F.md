---
title: "CF 104076F - 网格点"
description: "令 $f(x1,ldots,xn)$ 具有真值表 $tau$，并令 $f^Z$ 具有真值表 $tau^Z$。 对于$0 le k le n$，令$Sk(x1,ldots,xn)$表示固定$x1=cdots=xk=1$得到的子函数，所以它的真值表是$n-k$阶$tau$的子表，从位置$2^k$开始..."
date: "2026-07-02T02:48:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104076
codeforces_index: "F"
codeforces_contest_name: "2022 International Collegiate Programming Contest, Jinan Site"
rating: 0
weight: 104076
solve_time_s: 123
verified: false
draft: false
---

[CF 104076F - 网格点](https://codeforces.com/problemset/problem/104076/F)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 3s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$f(x_1,\ldots,x_n)$有真值表$\tau$，并让$f^Z$有真值表$\tau^Z$。 为了$0 \le k \le n$， 让$S_k(x_1,\ldots,x_n)$表示通过固定得到的子函数$x_1=\cdots=x_k=1$，所以它的真值表是$\tau$秩序$n-k$从位置开始$2^k$按照输入的字典顺序。 目标是确定相应的子函数$S_k^Z$的$f^Z$。 

Z 变换在串联上递归定义$\alpha\beta$通过分割等长的块并通过复制、零填充或将变换递归应用到较小的块来替换某些结构化串联。 定义中的每个子句都保留了变换独立作用于与变量的固定前缀相对应的块的属性。 通过修复将真值表分解为子表$x_1,\ldots,x_k$仅取决于第一个$k$该递归块结构的级别。 

关键的观察是定义$\tau^Z$与对变量排序的任何初始段的限制兼容。 如果$\tau$被写成一个串联$2^k$长度块$2^{n-k}$对应于分配$(x_1,\ldots,x_k)$，那么 Z 变换中的每个子句要么统一应用于整个块，要么递归地应用于相同结构的块内。 没有子句会混合由第一个块确定的不同块的位$k$变量。 

因此限制$\tau^Z$通过固定得到$x_1=\cdots=x_k=1$正是受限字符串的 Z 变换$\tau_{x_1=\cdots=x_k=1}$。 这产生了真值表的恒等式$$(\tau_{x_1=\cdots=x_k=1})^Z = (\tau^Z)_{x_1=\cdots=x_k=1}.$$将两边都解释为布尔函数给出了$f^Z$对应于修复第一个$k$变量等于相应子函数的 Z 变换$f$。 在练习的符号中，$$S_k^Z(x_1,\ldots,x_n) = (S_k(x_1,\ldots,x_n))^Z.$$由于这个等式对于每个$k$和$0 \le k \le n$，整个$k$-个人资料$f^Z$通过将 Z 变换水平应用于$k$-个人资料$f$，匹配练习 192 中在剖面和 z 剖面之间建立的对应关系。 

因此$$\boxed{S_k^Z = (S_k)^Z \quad \text{for all } 0 \le k \le n.}$$这样就完成了证明。 ∎
