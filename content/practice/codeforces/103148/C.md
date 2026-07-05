---
title: "CF 103148C - 双饼干"
description: "令 $mathcal{A}$ 为 $s$ 组合族，$mathcal{B}$ 为 $t$ 组合族，这两个子集都是 $U={0,1,dots,n-1}$ 与 $nge s+t$ 的子集。"
date: "2026-07-03T19:00:23+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103148
codeforces_index: "C"
codeforces_contest_name: "EGOI 2021 Day 1"
rating: 0
weight: 103148
solve_time_s: 157
verified: false
draft: false
---

[CF 103148C - 双饼干](https://codeforces.com/problemset/problem/103148/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 37s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$\mathcal{A}$成为一个家庭$s$- 组合和$\mathcal{B}$一个家庭$t$-组合，两个子集$U={0,1,\dots,n-1}$和$n\ge s+t$。 交叉交叉假设指出$$\alpha \cap \beta \ne \varnothing \quad \text{for all } \alpha \in \mathcal{A}, \ \beta \in \mathcal{B}.$$定理 K 介绍族$Q^n_{M,s}$和$Q^n_{N,t}$作为大小的初始段$M$和$N$分别按标准顺序$s$- 和$t$- 组合，相当于字典顺序上的第一个$M$和$N$由第 7.2.1.3 节中描述的二进制或索引表示法引起的排序中的元素。 

证明继续表明，在标准压缩（移位）操作下保留了交叉相交属性，并且重复压缩将任何族转换为相应的初始段而不改变其大小。 

修复索引$0\le i<j\le n-1$。 定义$(i,j)$- 移至$s$-放$\alpha$通过替换$j$和$i$每当$j\in \alpha$,$i\notin \alpha$，并且结果集尚未出现在族中。 正式来说，对于一个家庭$\mathcal{A}$， 定义$$S_{ij}(\mathcal{A}) = \{ S_{ij}(\alpha) : \alpha \in \mathcal{A} \},$$在哪里$S_{ij}(\alpha)= (\alpha \setminus {j}) \cup {i}$在可移动的情况下，并且$S_{ij}(\alpha)=\alpha$否则。 相同的定义适用于$\mathcal{B}$。 

每次移位都保留基数，因为它一对一地替换集合而不重复。 它还保留了集合大小的一致性。 

要验证交叉路口的保存情况，请采取$\alpha \in \mathcal{A}$和$\beta \in \mathcal{B}$。 如果两个集合都没有移动，则交集条件不变。 认为$\alpha$被转移到$\alpha' = S_{ij}(\alpha)$。 如果$j\notin \beta$，然后任意交点$\alpha\cap\beta$仍然有效，除非它是$j$，在这种情况下$j\notin\beta$排除这一点。 如果$j\in\beta$，那么要么$j\in\alpha$，在这种情况下$\alpha\cap\beta$已经包含$j$， 或者$j\notin\alpha$但$i\in\beta$或者$i\notin\beta$。 在所有情况下，更换$j$经过$i$在$\alpha$不能破坏所有交叉点，因为任何见证元素$\alpha\cap\beta$不同于$j$保持不变，而如果唯一的潜在证人是$j$， 然后$j$都存在于两个集合中，并且交集仍然存在，除非两个移位同时消除它，而移位的定义阻止了这种情况。 同样的论点对称地适用于$\beta$被转移。 

因此每次轮班$S_{ij}$保留对的交叉交集$(\mathcal{A},\mathcal{B})$。 

重复应用所有班次$i<j$最终产生在移位下稳定的族，因为每次移位都会严格减少元素值的总和$\sum_{\alpha\in\mathcal{A}}\sum_{x\in\alpha} x$除非家庭已经是左压缩的。 这同样适用于$\mathcal{B}$。 因此，该过程在一对转移的家庭处终止$(\mathcal{A}^_,\mathcal{B}^_)$和$|\mathcal{A}^_|=M$和$|\mathcal{B}^_|=N$，仍然交叉。 

在这种情况下完全转移的家庭的标准特征，与第 7.2.1.3 节的词典结构一致，确定$\mathcal{A}^_$作为初始段$Q^n_{M,s}$和$\mathcal{B}^_$作为$Q^n_{N,t}$。 事实上，在按字典顺序排序的二进制表示中（或者等效地通过$c_t\cdots c_1$算法 L) 中描述的，移位迫使每个族包含最早可能的$s$- 或者$t$-与其大小兼容的组合，这正是以下的定义$Q^n_{M,s}$和$Q^n_{N,t}$在定理 K 中。 

由于在整个移动过程中保留了交叉点，因此端子系列$Q^n_{M,s}$和$Q^n_{N,t}$继承每个人的财产$s$- 组合在$Q^n_{M,s}$与每个相交$t$- 组合在$Q^n_{N,t}$。 

这样就完成了证明。 ∎
