---
title: "CF 104076C - DFS 订单 2"
description: "令$tau$为$f(x1,ldots,xn)$的真值表，令$f^Z$为真值表为$tau^Z$的布尔函数，其中$tau^Z$由练习192中的递归Z变换定义。"
date: "2026-07-02T02:46:39+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104076
codeforces_index: "C"
codeforces_contest_name: "2022 International Collegiate Programming Contest, Jinan Site"
rating: 0
weight: 104076
solve_time_s: 70
verified: false
draft: false
---

[CF 104076C - DFS 订单 2](https://codeforces.com/problemset/problem/104076/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 10s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$\tau$是真值表$f(x_1,\ldots,x_n)$，并让$f^Z$是布尔函数，其真值表为$\tau^Z$， 在哪里$\tau^Z$由练习 192 中的递归 Z 变换定义。 

让$S_k(x_1,\ldots,x_n)$表示子函数$f$通过固定得到$x_1=\cdots=x_k=1$并保留剩余变量，因此其真值表是长度-$2^{n-k}$的子表$\tau$对应于作业索引的后缀$(1,\ldots,1, x_{k+1},\ldots,x_n)$。 让$S_k^Z$表示类似的子函数$f^Z$。 

目标是确定之间的关系$S_k^Z$和$S_k$。 

Z 变换是通过字符串的递归分解来定义的$\alpha\beta$根据是否$\beta$是一个零块，等于$\alpha$，或一般的串联情况。 通过所有三个子句保留的唯一结构是递归分割成等长的两半以及重复块或零块的识别。 这意味着变换在二元分解树上逐级进行$\tau$。 

在深度$k$在真值表分解中，字符串$\tau$被划分为$2^k$顺序子表$n-k$，每个对应于固定第一个$k$变量。 Z 变换不会改变这些子表的索引； 它仅替换每个子表$\sigma$经过$\sigma^Z$并可能用规范的零或重复块替换重复或结构化对。 

因此每个子表定义$S_k$独立转化为对应的子表定义$S_k^Z$。 特别是，限制操作“修复第一个$k$变量”与真值表上的 Z 变换进行交换。

 正式地，让$\tau_{x_1=\cdots=x_k=1}$表示后缀子表定义$S_k$，递归定义$\tau^Z$产量$$(\tau_{x_1=\cdots=x_k=1})^Z = (\tau^Z)_{x_1=\cdots=x_k=1}.$$因此真值表为$S_k^Z$正是$(\tau_{x_1=\cdots=x_k=1})^Z$，这意味着子函数本身是通过对子函数进行 Z 变换获得的$S_k$。 

因此，对于每一个$k$和$0 \le k \le n$,$$S_k^Z(x_1,\ldots,x_n) = (S_k(x_1,\ldots,x_n))^Z.$$由于限制定义$S_k$将自由变量的数量减少到$n-k$，该恒等式在概要分解的所有级别上保持一致，并且它保留了 BDD 概要中子函数之间的对应关系$f$和 ZDD 风格的轮廓$f^Z$在练习 192 中建立。 

因此$$\boxed{S_k^Z = (S_k)^Z \quad \text{for } 0 \le k \le n.}$$这样就完成了证明。 ∎
