---
title: "CF 103941A - 摩卡 \u4e0a\u5c0f\u73ed\u5566"
description: "当由任何前缀分配产生的每个子表都是珠子时，布尔函数是很好的。 当真值表不是 $alphaalpha$ 形式时，它就是一个珠子，因此每个子函数在其有序决策结构的每个节点都必须具有不同的 LO 和 HI 子表。"
date: "2026-07-02T06:56:17+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103941
codeforces_index: "A"
codeforces_contest_name: "2022 CCPC Henan Provincial Collegiate Programming Contest"
rating: 0
weight: 103941
solve_time_s: 123
verified: false
draft: false
---

[CF 103941A - 摩卡 \u4e0a\u5c0f\u73ed\u5566](https://codeforces.com/problemset/problem/103941/A)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 3s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 当由任何前缀分配产生的每个子表都是珠子时，布尔函数是很好的。 当真值表不是以下形式时，它就是一个珠子$\alpha\alpha$，因此每个子函数在其有序决策结构的每个节点都必须具有不同的 LO 和 HI 子表。 

让$f$和$g$是甜蜜的布尔函数$n$变量，并定义$$h(x_1,\dots,x_n)=f(x_1,\dots,x_n)\wedge g(x_1,\dots,x_n).$$对于任何固定前缀分配$(x_1=c_1,\dots,x_k=c_k)$， 让$f_c$,$g_c$， 和$h_c$表示顺序的导出子表$n-k$。 然后$$h_c = f_c \wedge g_c$$在真值表上逐点计算。 

当子表具有以下形式时，它不能完全成为珠子$\beta\beta$，意味着它的两半（对应于$x_{k+1}=0$和$x_{k+1}=1$) 相等。 因此$h$当存在前缀分配使得导出的子函数满足时，并不准确$$h_c(0,x_{k+2},\dots,x_n)=h_c(1,x_{k+2},\dots,x_n).$$使用$h_c=f_c\wedge g_c$，两半相等意味着对于每一个延续，$$f_c(0,\dots)\wedge g_c(0,\dots) = f_c(1,\dots)\wedge g_c(1,\dots).$$自从$f$和$g$是甜蜜的，每个都满足对于每个前缀，其 LO 和 HI 子表是不同的。 因此，对于每个这样的前缀，至少有一个$f_c(0,\dots)\ne f_c(1,\dots)$和$g_c(0,\dots)\ne g_c(1,\dots)$成立。 

考虑一个前缀，其中两者$f_c$和$g_c$变化的方式使得它们的结合在分裂过程中变得恒定。 当一个函数有价值时就会发生这种情况$0$在另一个具有不同值的所有输入上，导致 AND 将两个分支折叠为相同的结果。 

当存在前缀分配使得其中之一时，就会出现具体的障碍$f_c$或者$g_c$是相同的$0$在两个分支上，而另一个是任意的。 Sweetness 并不排除这种可能性，因为一个函数可能有一个等于常数的子函数$0$在某个节点上，同时在更高级别的该节点上仍然具有不同的 LO 和 HI 子表。 

取前缀 where$f_c(0,\dots)=f_c(1,\dots)=0$。 这并不违反甜度$f$因为相关条件涉及两个子表的相等性，而不是它们在下面的所有变量中保持不变。 这同样适用于$g$。 在这样一个节点，$$h_c(0,\dots)=h_c(1,\dots)=0$$所以$h_c$不是珠子。 

仍有待证明这种配置即使在两者都存在时也可能发生$f$和$g$很甜蜜。 构造$f$因此在某个节点，它的 LO 和 HI 子函数不同，但两者的计算结果都是$0$在下一个限制级别，并类似地构造$g$因此它的变化发生在不相交的支持上。 然后在组合节点处 AND 强制两个分支相同$0$价值观。 

此类配置已经存在$n=2$。 让$$f(x_1,x_2)=x_1,\quad g(x_1,x_2)=\overline{x_1}.$$两者都很甜蜜，因为它们唯一的重要子函数具有不同的 LO 和 HI 值。 然而，$$h(x_1,x_2)=f\wedge g = x_1\wedge \overline{x_1}=0,$$常数零函数有真值表$00$，这不是一颗珠子。 因此$h$不甜。 

因此，甜蜜函数类在合取下不是封闭的。$$\boxed{\text{false}}$$这样就完成了解决方案。 ∎
