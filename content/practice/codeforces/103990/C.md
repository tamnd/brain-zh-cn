---
title: "CF 103990C - 正确"
description: "令 $U$ 为 (18) 中图 $G$ 的顶点集，并令 $g$ 为其边族，编码如练习 236(e) 中所示，因此 g$ 中的每个 $e 都是 $U$ 的 2 元素子集。 如果 $C$ 中的每对不同的顶点都是 $G$ 的边，则顶点集 $C subseteq U$ 是 $G$ 中的一个团。"
date: "2026-07-02T06:04:28+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103990
codeforces_index: "C"
codeforces_contest_name: "2022 ICPC Asia Taiwan Online Programming Contest"
rating: 0
weight: 103990
solve_time_s: 44
verified: false
draft: false
---

[CF 103990C - 正确](https://codeforces.com/problemset/problem/103990/C)

 **评级：** -
 **标签：** -
 **求解时间：** 44s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$U$是图的顶点集$G$在 (18) 中，让$g$是它的边族，如练习 236(e) 中编码，所以每个$e \in g$是 2 元素子集$U$。 

一组顶点$C \subseteq U$是一个派系$G$如果每对不同的顶点$C$是一个边缘$G$。 等价地，$C$是一个派系$G$当且仅当$C$是补图中的独立集$\overline{G}$。 让$\overline{g}$表示 的边族$\overline{G}$。 

根据练习 236(e) 和独立集的族代数编码，具有边族的图的独立集族$h$由下式给出$$\mathrm{Ind}(h) = \mathcal{P}(U) \; \↘ \; h,$$由于条件“$\alpha$不是任何边的超集$e \in h$”正是这样的说法，即没有边缘完全包含在$\alpha$。 

将此应用到$\overline{G}$, 派系家族$G$是$$\mathrm{Cliq}(G) = \mathcal{P}(U) \; \↘ \; \overline{g}.$$拉帮结派$C$如果它属于包含在内的该族的最小元素，则它是最大的。 因此最大派系族是$$\mathrm{MaxCliq}(G) = \bigl(\mathcal{P}(U) \; \↘ \; \overline{g}\bigr)^{\downarrow}.$$该 ZDD 表达式确定了所有最大派系的集合$G$曾经的边缘家庭$\overline{g}$被替换并应用减少规则。 

计算可以被覆盖的集合$k$派系$G$，考虑一个顶点子集$X \subseteq U$。 套装$X$可以被覆盖$k$派系$G$当且仅当存在派系$C_1, \dots, C_k \in \mathrm{Cliq}(G)$这样$$X \subseteq C_1 \cup \cdots \cup C_k.$$等价地，每个顶点$X$被分配给其中之一$k$拉帮结派，所以$X$承认一个分区$k$每个子集都是一个派系。 转换为补图$\overline{G}$, 每个派系在$G$是一个独立的集合$\overline{G}$，因此这个条件相当于要求$X$最多是并集$k$独立设置$\overline{G}$，这正是归纳子图的陈述$\overline{G}[X]$是$k$-可着色。 

因此，顶点集族可以被覆盖$k$派系$G$是$$F_k = \{X \subseteq U \mid \chi(\overline{G}[X]) \le k\}.$$在 ZDD 形式中，这是通过构建所有适当的族来获得的$k$- 的颜色$\overline{G}$通过重复应用独立集生成和族的乘积构建，然后从颜色标记的分区投影到顶点集。 

可以覆盖的最大集合$k$派系是最小元素（相对于可行性下的包容性最大化）$F_k$， 因此$$F_k^{\uparrow} = \{X \in F_k \mid \nexists Y \in F_k \text{ with } X \subsetneq Y\}.$$对于具体的图$G$在(18)中，具体的最大派系和最大派系的基数$k$-clique-coverable 集合是通过在固定边族上评估这些 ZDD 表达式来获得的$\overline{g}$与该图相关联并执行归约。 直接从终端简化的 ZDD 中读取所得的族，作为与最大解相对应的所有 root-to-⊤ 路径的集合。 

这样就完成了构建。 ∎
