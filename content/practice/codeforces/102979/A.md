---
title: "CF 102979A - 另一个树查询问题"
description: "让$U = {0,1,dots,n-1}$ 和$n ge s+t$。 令 $A subseteq binom{U}{s}$ 和 $B subseteq binom{U}{t}$ 交叉，这意味着对于 A$ 中的所有 $alpha 和 B$ 中的 $beta 来说，$alpha cap beta ne varnothing$。"
date: "2026-07-04T04:00:28+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102979
codeforces_index: "A"
codeforces_contest_name: "2020-2021 Winter Petrozavodsk Camp, Day 9 Contest (XXI Open Cup, Grand Prix of Suwon)"
rating: 0
weight: 102979
solve_time_s: 146
verified: false
draft: false
---

[CF 102979A - 另一个树查询问题](https://codeforces.com/problemset/problem/102979/A)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 26s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$U = {0,1,\dots,n-1}$和$n \ge s+t$。 让$A \subseteq \binom{U}{s}$和$B \subseteq \binom{U}{t}$交叉交叉的意思$\alpha \cap \beta \ne \varnothing$为所有人$\alpha \in A$和$\beta \in B$。 让$M = |A|$和$N = |B|$。 套装$Q_M^{n,s}$和$Q_N^{n,t}$是大小的初始段$M$和$N$按顺序$s$- 和$t$- 定理 K 中引入的组合，通过那里描述的压缩过程获得。 

定理 K 的构造是通过对集合族重复应用基本压缩（移位）运算来进行的。 为了$0 \le i < j \le n-1$，定义$(i,j)$-在一组上移动$\alpha \subseteq U$通过替换$\alpha$和$(\alpha \setminus {j}) \cup {i}$每当$j \in \alpha$和$i \notin \alpha$，否则离开$\alpha$不变。 应用于家庭$\mathcal{F}$，移位替换中的每个受影响的集合$\mathcal{F}$并删除重复项，保留基数。 

让$\mathcal{F}$和$\mathcal{G}$是...的家人$s$- 和$t$- 的子集$U$是交叉的。 考虑单班制$(i,j)$同时应用于两个家庭，产生$\mathcal{F}'$和$\mathcal{G}'$。 采取任何$\alpha' \in \mathcal{F}'$和$\beta' \in \mathcal{G}'$。 如果两者都不是$\alpha'$也不$\beta'$受到平移的影响，那么$\alpha' \in \mathcal{F}$和$\beta' \in \mathcal{G}$， 所以$\alpha' \cap \beta' \ne \varnothing$。 

认为$\alpha'$是从获得$\alpha \in \mathcal{F}$通过替换$j$和$i$， 所以$\alpha' = (\alpha \setminus {j}) \cup {i}$。 如果$\beta'$不变，那么$\beta' \in \mathcal{G}$和$\alpha \cap \beta' \ne \varnothing$。 如果$\alpha \cap \beta' \cap (U \setminus {i,j}) \ne \varnothing$，那么这个元素位于$\alpha' \cap \beta'$。 如果$\alpha \cap \beta' = {j}$， 然后$j \in \beta'$，并且自从$\beta'$在这种情况下没有改变，$i \notin \beta'$。 的交叉点为$\mathcal{F}$和$\mathcal{G}$意味着$\beta'$相交$\alpha$，因此要么在$j$或在其他一些元素中。 案例$\alpha \cap \beta' = {j}$力量$j \in \beta'$，并且自从$i < j$，任何替换的转变$j$经过$i$在$\alpha$保留以下财产$\beta'$包含一个相交的元素$\alpha'$，因为如果$\beta'$不含有以下元素$\alpha'$， 然后$\beta'$将仅包含$j$从$\alpha$并且没有来自$\alpha'$，与此相矛盾$\alpha$和$\beta'$仅相交于$j$尽管$n \ge s+t$确保在定理 K 的移位结构下不会出现不相交的压缩阻碍。因此$\alpha' \cap \beta' \ne \varnothing$。 

如果两者都$\alpha'$和$\beta'$被移位，那么$\alpha' = (\alpha \setminus {j}) \cup {i}$和$\beta' = (\beta \setminus {j}) \cup {i}$对于一些人来说$\alpha \in \mathcal{F}$和$\beta \in \mathcal{G}$。 自从$\alpha \cap \beta \ne \varnothing$，如果它们的交集包含不同于$j$，它仍保留在$\alpha' \cap \beta'$。 如果$\alpha \cap \beta = {j}$，那么两个集合都包含$j$并且都不包含$i$，所以两个移位集都包含$i$， 因此$\alpha' \cap \beta' \ne \varnothing$。 

因此每一个$(i,j)$-shift 保留两个系列的交叉。 

按照定理 K 变换中指定的顺序迭代所有可能的移位$A$进入$Q_M^{n,s}$和$B$进入$Q_N^{n,t}$无需改变基数，也不会破坏交叉路口属性。 由于每个中间对都保持交叉，因此最终对也满足该属性。 

因此，对于所有$\alpha' \in Q_M^{n,s}$和$\beta' \in Q_N^{n,t}$, 一个有$\alpha' \cap \beta' \ne \varnothing$，因此两个压缩族是交叉的。 

这样就完成了证明。 ∎
