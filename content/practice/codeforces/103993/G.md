---
title: "CF 103993G - 评分"
description: "令 $G = (V,E)$ 表示 (18) 的连续美国图，并令 $U subseteq V$。 导出子图 $G mid U$ 是二部的当且仅当它不包含奇数长度的循环，等效地当且仅当 $G mid U$ 的每个连通分量都允许 2-着色。"
date: "2026-07-02T06:03:31+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103993
codeforces_index: "G"
codeforces_contest_name: "ICPC 2022-2023 NERC (NEERC), Southern and Volga Russia Qualifier"
rating: 0
weight: 103993
solve_time_s: 123
verified: false
draft: false
---

[CF 103993G - 评分](https://codeforces.com/problemset/problem/103993/G)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 3s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$G = (V,E)$表示 (18) 的连续美国图，并让$U \subseteq V$。 诱导子图$G \mid U$是二分的当且仅当它不包含奇数长度的循环时，等效地当且仅当$G \mid U$承认2色。 

一套$U$是最大诱导二分子图当且仅当$G \mid U$是二分的并且对于每个$v \in V \setminus U$，诱导子图$G \mid (U \cup {v})$包含奇数循环。 同样，每个排除的顶点对于保持二分性至关重要。 

介绍一下家人$$\mathcal{B} = \{U \subseteq V \mid G \mid U \text{ is bipartite}\}.$$所需的对象是最大元素$\mathcal{B}^\uparrow$练习 236 中 ZDD 族代数的意义。 

二分约束可以表示为排除所有奇数循环$C \subseteq V$：$$U \in \mathcal{B} \quad \Longleftrightarrow \quad \forall C \in \mathcal{C}_{\mathrm{odd}},\; C \nsubseteq U,$$在哪里$\mathcal{C}_{\mathrm{odd}}$是所有奇数循环的顶点集族$G$。 

因此$$\mathcal{B} = \mathcal{C}_{\mathrm{odd}}^{\nearrow},$$口译$\mathcal{C}_{\mathrm{odd}}^{\nearrow}$作为所有集合的族，在 ZDD 运算的意义上避免了奇数循环的超集$f \nearrow g$来自练习 236。最大诱导二部子图是该族的最大元素：$$\mathcal{M} = \mathcal{B}^\uparrow.$$因此，计算简化为 ZDD 评估$$\mathcal{M} = (\mathcal{C}_{\mathrm{odd}}^{\nearrow})^\uparrow.$$这种构造唯一地确定了族，并且 ZDD 实现应用了练习 237 的递归归约规则，沿着顶点的固定变量排序传播包含约束$G$。 每个奇数循环都会提供一个约束，禁止同时包含其所有顶点，并且最大值会删除任何可以扩展的集合，同时保留所有此类约束。 

因此，可接受的集合数为$$|\mathcal{M}| = \text{number of maximal elements of } \mathcal{B}.$$显式数值取决于图 (18) 的完整邻接结构，因为奇数循环集$\mathcal{C}_{\mathrm{odd}}$由此产生的 ZDD 减少取决于顶点之间的确切重合关系。 所提供的摘录中未指定该图表，因此无法仅从可用信息中得出封闭的数字计数。 

极端情况的结构特征不依赖于缺失的数据。 

最小最大诱导二分子图是任何包含最小集$U \in \mathcal{B}^\uparrow$。 这样的集合具有从其中删除任何顶点的属性$U$将允许扩展，并且添加任何顶点都会在导出的子图中引入奇数循环； 它的确切基数取决于局部奇数循环结构$G$。 

最大的最大诱导二部子图是任意$U \in \mathcal{B}^\uparrow$的最大基数。 每个这样的集合对应于移除最小奇数循环横截面$V \setminus U$，但这种横截面的大小取决于详细的循环结构$G$。 

相同的框架通过替换扩展到最大诱导三方子图$\mathcal{B}$对于其诱导子图没有阻碍 3-可着色性的循环的顶点集族，相当于没有需要四种颜色的子图，这再次简化为关于禁止配置及其最大元素的 ZDD 约束系统。 

这就完成了将问题简化为练习 236 的族代数下的 ZDD 评估。 ∎
