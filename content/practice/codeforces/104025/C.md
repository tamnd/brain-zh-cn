---
title: "CF 104025C - 组合"
description: "让 ZDD 表示 ${x1,dots,xn}$ 子集的 $mathcal{F}$ 族，按变量索引排序，并让每个节点 $k$ 用 $V(k)in{1,dots,n}$ 标记。"
date: "2026-07-02T04:13:38+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104025
codeforces_index: "C"
codeforces_contest_name: "The 16-th BIT Campus Programming Contest - Onsite Round"
rating: 0
weight: 104025
solve_time_s: 125
verified: false
draft: false
---

[CF 104025C - 组合](https://codeforces.com/problemset/problem/104025/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 5s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让ZDD代表一个家庭$\mathcal{F}$的子集${x_1,\dots,x_n}$，按变量索引排序，并让每个节点$k$被标记为$V(k)\in{1,\dots,n}$。 让$\mathrm{LO}(k)$和$\mathrm{HI}(k)$表示它的孩子，用 ZDD 语义$\mathrm{LO}(k)$排除$x_{V(k)}$和$\mathrm{HI}(k)$包括$x_{V(k)}$。 

引入终端节点$\bot$和$\top$， 和$\top$代表家庭${\emptyset}$和$\bot$代表空虚的家庭。 那么贡献的解决方案的数量$\top$是$1$并由$\bot$是$0$。 

对于每个节点$k$， 让$F(k)$表示以子 ZDD 为根的解决方案的数量$k$，其中解决方案被视为沿路径尚未固定的变量的完整分配。 如果路径到达标记为$j$最后一次看到变量索引后$i<j$，然后变量$x_{i+1},\dots,x_{j-1}$不受约束，每个因素贡献一个因子$2$。 

为了正式表达这一点，通过设置将变量索引扩展到终端$V(\top)=V(\bot)=n+1$。 然后从一个节点开始的每条弧$k$给一个孩子$c\in{\mathrm{LO}(k),\mathrm{HI}(k)}$完全跳过$V(c)-V(k)-1$变量，贡献因素$2^{V(c)-V(k)-1}$。 

因此，每个子节点的贡献是子树中部分解的数量乘以跳过变量引起的自由分配的数量。 这产生了递归$$F(k)=\sum_{c\in\{\mathrm{LO}(k),\mathrm{HI}(k)\}} 2^{V(c)-V(k)-1}\,F(c),$$有基值$$F(\bot)=0,\qquad F(\top)=1.$$这种递归在单次遍历中的评估与 BDD 计数的算法 C 完全相同，只是乘法因子取决于变量级别间隙而不是统一的。 

要将其实现为算法 C 的修改，请存储计算值$F(k)$在表中以避免重新计算。 处理节点时$k$,首先递归计算$F(\mathrm{LO}(k))$和$F(\mathrm{HI}(k))$，然后使用由它们的水平差异确定的因子将它们组合起来$V(k)$如重现所示。 记忆化结构与算法 C 相同，因为每个节点在简化的 ZDD 中都会被评估一次。 

这计算了由 ZDD 表示的布尔函数的满足赋值的数量，因为每个根到终端路径对应于唯一的部分赋值，并且每个跳过的变量使一致的完整扩展的数量加倍。 

这样就完成了证明。 ∎
