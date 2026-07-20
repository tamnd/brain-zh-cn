---
title: "CF 103811L - 锁定"
description: "令对应于分配 $x1 ldots xn$ 的最小项的贡献为 $$C(x1,ldots,xn)=prod{i=1}^n (1-pi)^{1-xi}pi^{xi}。"
date: "2026-07-02T08:30:20+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103811
codeforces_index: "L"
codeforces_contest_name: "La Salle-Pui Ching Programming Challenge \u57f9\u6b63\u5587\u6c99\u7de8\u7a0b\u6311\u6230\u8cfd 2021"
rating: 0
weight: 103811
solve_time_s: 125
verified: false
draft: false
---

[CF 103811L - 锁定](https://codeforces.com/problemset/problem/103811/L)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 5s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 令对应于作业的最小项的贡献$x_1 \ldots x_n$是$$C(x_1,\ldots,x_n)=\prod_{i=1}^n (1-p_i)^{1-x_i}p_i^{x_i}.$$取对数将乘积的最大化转换为和的最大化：$$\log C(x_1,\ldots,x_n)=\sum_{i=1}^n \bigl((1-x_i)\log(1-p_i)+x_i\log p_i\bigr).$$对于每个索引$i$，定义两个局部权重$$w_i(0)=\log(1-p_i), \qquad w_i(1)=\log p_i.$$那么目标就变成了$\sum_{i=1}^n w_i(x_i)$，最大化最小项贡献相当于最大化这个总和$f(x_1,\ldots,x_n)=1$。 

根到$\top$BDD 中的路径根据排序属性修复一些变量并跳过其他变量。 如果一个节点有可变索引$j$其后继者有索引$k>j+1$，然后变量$j+1,\ldots,k-1$不会出现在该路径上。 对于每个这样的跳过变量$i$，它的值可以独立选择，所以它的最优贡献是$$m_i=\max(\log(1-p_i),\log p_i).$$因此，BDD 中的每个转换都会贡献一个固定间隙项，该间隙项仅由端点的索引以及所选分支的贡献确定。 

定义动态规划值$H(v)$对于每个节点$v$，解释为最大可实现的对数贡献$v$到$\top$。 

对于汇聚节点来说，$$H(\top)=0, \qquad H(\bot)=-\infty.$$对于分支节点$v$由变量标记$x_j$，设其低后继者和高后继者为$\mathrm{LO}(v)$和$\mathrm{HI}(v)$。 对于任何继任者$u$的$v$，定义差距贡献$$G(j,u)=\sum_{i=j+1}^{V(u)-1} m_i,$$在哪里$V(u)$是节点的变量索引$u$对于水槽，我们采取$V(\top)=n+1$。 

那么递归就是$$H(v)=\max\Bigl(w_j(0)+G(j,\mathrm{LO}(v))+H(\mathrm{LO}(v)),\; w_j(1)+G(j,\mathrm{HI}(v))+H(\mathrm{HI}(v))\Bigr).$$根有索引$j_0=V(\mathrm{ROOT})$，其初始间隙贡献$\sum_{i=1}^{j_0-1} m_i$。 通过将此初始间隙添加到$H(\mathrm{ROOT})$，并且通过在每个节点处跟踪在递归中达到最大值的分支来恢复最佳分配。 

正确性源自将任何完整赋值分解为三个独立部分：当前变量的固定决策、跳过变量的独立最优选择以及子 BDD 中的最优延续。 每个完整的分配恰好对应于一个根到-$\top$路径与间隙上的独立选择一起，递归穷举所有这些可能性，不遗漏或重复。 BDD 排序的非循环性确保$H(v)$由于所有后继者都有更大的索引，因此通过对递减变量索引进行向后归纳可以很好地定义。 

构建的作业满足$f(x_1,\ldots,x_n)=1$因为只有$\top$-考虑可达路径，并且其最小项贡献最大，因为每个局部决策和每个跳过变量选择在加法分解下都是单独最优的$\log C$。 

这样就完成了解决方案。 ∎
