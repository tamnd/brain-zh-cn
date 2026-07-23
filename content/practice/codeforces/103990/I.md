---
title: "CF 103990I - 邀请函"
description: "令 $G = (V,E)$ 并令 $g$ 表示按照练习 236(e) 的意义编码的边族，因此 $g = bigcup{u-v in E}(eu sqcup ev)$ 并且独立集族由扩展族代数中的公式表示，如该练习中所示。"
date: "2026-07-02T06:07:09+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103990
codeforces_index: "I"
codeforces_contest_name: "2022 ICPC Asia Taiwan Online Programming Contest"
rating: 0
weight: 103990
solve_time_s: 40
verified: false
draft: false
---

[CF 103990I - 邀请](https://codeforces.com/problemset/problem/103990/I)

 **评级：** -
 **标签：** -
 **求解时间：** 40s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$G = (V,E)$并让$g$表示按照练习 236(e) 的意义编码的边族，因此$g = \bigcup_{u-v \in E}(e_u \sqcup e_v)$独立集合族由扩展族代数中的公式表示，如该练习中所示。 

一个小集团在$G$是一组顶点$C \subseteq V$这样每对不同的顶点$C$由边连接$G$。 让$G^c$表示同一顶点集上的补图，具有边族$g^c$由所有无序对组成$u-v$不在$E$。 然后是一套$C$是一个派系$G$当且仅当它是一个独立的集合$G^c$。 这将 clique 枚举转换为$G$进入独立集合枚举$G^c$。 

让$f_{\mathrm{ind}}(g)$用边族表示图的独立集族$g$，如练习 236(e) 中所示。 然后是小集团家族$G$是$$f_{\mathrm{clique}}(G) = f_{\mathrm{ind}}(g^c).$$最大派系$G$因此 是这个族的最大元素，所以$$f_{\max\text{-clique}}(G) = \bigl(f_{\mathrm{ind}}(g^c)\bigr)^\uparrow.$$该表达式已经是族代数语言，并且可以通过 ZDD 运算直接实现一次$g^c$可用。 补边族由下式获得$$g^c = \binom{V}{2} \setminus g,$$因此，在扩展族代数中，它是通过 2 元素子集级别的通用族减法构造的。 

顶点集$U \subseteq V$可以被覆盖$k$派系当且仅当存在派系$C_1, \dots, C_k$在$G$这样$$U \subseteq C_1 \cup \cdots \cup C_k.$$等价地，每个$C_i$是一个独立的集合$G^c$， 所以$U$可以被覆盖$k$派系$G$当且仅当$U$可以被覆盖$k$独立设置$G^c$。 这相当于陈述$U$允许对导出的子图进行适当的着色$(G^c \mid U)$至多$k$颜色，其中每个颜色类都是一个独立的集合$G^c$。 

让$F_k$表示可以被覆盖的顶点集族$k$派系$G$。 然后$$F_k = \{ U \subseteq V \mid U \text{ is $k$-colorable in } G^c \}.$$覆盖的最大集合$k$那么派系是$$F_k^\uparrow.$$该公式将问题简化为族代数中独立集构造的重复应用$G^c$，结合一个$k$- 对应于不相交并集的折叠乘积构造$k$独立家庭。 具体来说，如果$f = f_{\mathrm{ind}}(g^c)$是补图的独立集族，则可覆盖的集合族$k$派系是通过以下方式获得的$k$折叠联合闭合$$F_k = \underbrace{f \sqcup f \sqcup \cdots \sqcup f}_{k\ \text{times}},$$在哪里$\sqcup$表示练习 236 的 ZDD 代数中使用的族不相交并集。 

最大$k$-clique-coverable 集是通过应用最大值运算符获得的，$$F_k^\uparrow = \bigl(\underbrace{f \sqcup \cdots \sqcup f}_{k\ \text{times}}\bigr)^\uparrow.$$对于具体情况，其中$G$是连续的美国图 (18)，通过构建 ZDD 进行计算$f_{\mathrm{ind}}(g^c)$使用补图的边族，然后应用$\uparrow$提取最大元素的操作，最后迭代ZDD并构建$k$增加次数$k$。 由此产生的族，包括它们的基数和极值元素，取决于图（18）的显式邻接结构。 如果给定上下文中没有 (18) 的边列表，则最大团和最大团的最终枚举$k$-clique-coverable顶点集无法实例化。 

这就完成了族代数简化为 ZDD 运算的推导以及所需族的结构表征。 ∎
