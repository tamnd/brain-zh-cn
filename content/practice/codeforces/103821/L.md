---
title: "CF 103821L - ResliPhobia"
description: "令 $w(x1,ldots,xn)$ 表示最小项 $$(1-p1)^{1-x1}p1^{x1}cdots (1-pn)^{1-xn}pn^{xn} 的贡献。$$ 在满足 $f(x1,ldots,xn)=1$ 的所有分配上最大化此数量相当于最大化沿 BDD 中路径的独立局部因子的乘积..."
date: "2026-07-02T08:25:52+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103821
codeforces_index: "L"
codeforces_contest_name: "(Aleppo + HAIST + SVU + Private) CPC 2022"
rating: 0
weight: 103821
solve_time_s: 127
verified: false
draft: false
---

[CF 103821L - ResliPhobia](https://codeforces.com/problemset/problem/103821/L)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 7s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$w(x_1,\ldots,x_n)$表示最小项的贡献$$(1-p_1)^{1-x_1}p_1^{x_1}\cdots (1-p_n)^{1-x_n}p_n^{x_n}.$$在满足所有任务的情况下最大化此数量$f(x_1,\ldots,x_n)=1$相当于最大化 BDD 中路径上的独立局部因子的乘积$f$，因为每个变量$x_i$仅贡献一个因素，仅取决于在标记为的节点处采用的是 LO 还是 HI 分支$i$。 

让每个BDD节点$v$由变量索引标记$i=V(v)$被赋予一个值$W(v)$定义为最大可能的贡献$v$到终端节点$\top$。 对于汇节点，边界条件为$$W(\top)=1,\qquad W(\bot)=0.$$价值$1$在$\top$对应于空产品，并且$0$反映任何到达的路径$\bot$对有效的解决方案没有任何贡献。 

对于分支节点$v$贴上标签$i$，与 LO 后继者$v_0$和HI继任者$v_1$，任何延伸路径的赋值$v$必须准确选择两个变量设置之一。 延伸穿过 LO 边缘的贡献为$(1-p_i)W(v_0)$，通过 HI 边缘的贡献是$p_iW(v_1)$。 的最优延续$v$因此满足$$W(v)=\max\bigl((1-p_i)W(v_0),\; p_iW(v_1)\bigr).$$因为 BDD 是按变量索引排序的有向无环图，所以值$W(v)$可以按照从汇到根的逆拓扑顺序进行计算。 这种循环是明确定义的，因为每一个继承者$v$具有严格更大的变量索引。 

一次$W(\text{root})$计算后，通过以下在每个节点实现最大值的选择来获得最佳的令人满意的分配。 从根节点开始$r$， 如果$r$是一个接收器，分配已经确定。 如果$r$是一个分支节点，标记为$i$，那么如果$$(1-p_i)W(v_0)\ge p_iW(v_1)$$作业集$x_i=0$并继续$v_0$，否则设置$x_i=1$并继续$v_1$。 重复此过程会产生一条必然以以下位置结束的路径$\top$，因为任何贡献正权重的路径都对应于令人满意的分配$f$。 

正确性源自以下事实：每个令人满意的分配都双射对应于根到$\top$BDD 中的路径，以及分配因子沿边的乘法贡献，与递归定义中的完全相同$W(v)$。 因此，计算出的路径使所有令人满意的分配之间的总乘积最大化。 

这样就完成了证明。 ∎
