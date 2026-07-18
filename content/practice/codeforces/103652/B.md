---
title: "CF 103652B - 线性同余发生器"
description: "令 $G$ 为具有生成器 $(alpha1,dots,alphak)$ 的对称群 $Sn$ 的凯莱图，并假设每个生成器对于 {1,dots,n}$ 中的固定不同符号 $x,y 满足 $$alphaj(x)=y$$。"
date: "2026-07-02T21:59:09+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103652
codeforces_index: "B"
codeforces_contest_name: "2019 Summer Petrozavodsk Camp, Day 8: XIX Open Cup Onsite"
rating: 0
weight: 103652
solve_time_s: 130
verified: false
draft: false
---

[CF 103652B - 线性同余生成器](https://codeforces.com/problemset/problem/103652/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 10s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$G$是对称群的凯莱图$S_n$带发电机$(\alpha_1,\dots,\alpha_k)$，并假设每个生成器满足$$\alpha_j(x)=y$$对于固定的不同符号$x,y \in {1,\dots,n}$。 

让哈密顿路径进入$G$从恒等排列开始$e=12\cdots n$给出：$$v_0=e,\ v_1,\dots,v_{N-1}, \quad N=n!.$$对于每一步，都存在一个索引$j_i$这样$$v_{i+1}=v_i \alpha_{j_i}.$$定义$$a_i = v_i(x), \quad b_i = v_i(y).$$由转移规则和假设$\alpha_{j}(x)=y$，我们得到$$v_{i+1}(x)=v_i(\alpha_{j_i}(x))=v_i(y),$$因此$$a_{i+1}=b_i \quad \text{for } 0 \le i \le N-2.$$该恒等式链接序列的连续值$(a_i)$和$(b_i)$通过轮班：$$b_i=a_{i+1}.$$顺序$(a_i)$是函数取值的列表$g \mapsto g(x)$沿着哈密顿路径。 由于每个顶点$S_n$恰好出现一次，$(a_0,a_1,\dots,a_{N-1})$是一个排列${1,\dots,n}$。 

从$b_i=a_{i+1}$为了$0 \le i \le N-2$，序列$(b_0,\dots,b_{N-2})$正是子序列$$(a_1,a_2,\dots,a_{N-1}).$$所以$(b_0,\dots,b_{N-2})$包含每个元素${1,\dots,n}$除了$a_0$。 

在初始顶点$v_0=e$，我们有$a_0=e(x)=x$。 因此价值$x$没有出现在$(b_0,\dots,b_{N-2})$。 自从$(b_0,\dots,b_{N-1})$也是一个排列${1,\dots,n}$，缺失值必须出现在最终位置：$$b_{N-1}=x.$$因此$$v_{N-1}(y)=x.$$这样就完成了证明。 ∎
