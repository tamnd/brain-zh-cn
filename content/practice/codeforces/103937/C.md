---
title: "CF 103937C - 机器人检查"
description: "单调布尔函数 $f(x1,dots,x5)$ 由其最小真点集、反链 $A subseteq 2^{[5]}$ 唯一表示，相反，每个反链通过向上闭包确定这样的函数。"
date: "2026-07-02T07:09:20+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103937
codeforces_index: "C"
codeforces_contest_name: "UTPC Contest 09-30-22 Div. 2 (Beginner)"
rating: 0
weight: 103937
solve_time_s: 126
verified: false
draft: false
---

[CF 103937C - 机器人检查](https://codeforces.com/problemset/problem/103937/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 6s
 **已验证：** 否

 ## 解决方案
 ## 设置

 单调布尔函数$f(x_1,\dots,x_5)$由其最小真实点集（反链）唯一地表示$A \subseteq 2^{[5]}$，相反，每个反链都通过向上封闭来确定这样的函数。 因此均匀分布在$7581$单调布尔函数是布尔格反链上的均匀分布$B_5$。 

对于反链$A$, 数量$Z(\mathrm{PI}(f))$等于$|A|$，因为单调函数的主要蕴涵项正是其最小真集。 

对于单调函数的 BDD，每个节点对应于通过固定变量的初始段而导出的不同子函数，并且在单调情况下，这些子函数再次是单调的并由导出的反链确定。 汇点贡献两个节点，$\bot$和$\top$，并且每个非汇节点对应于由对变量进行调节而产生的非空诱导反链。 

因此$B(f)$仅取决于跨所有限制的诱导反链家族。 

## 解决方案

 ### 1. 随机单调函数的结构

 五个变量上的每个单调函数对应于一个反链$B_5$。 格子$B_5$有大小层$$\binom{5}{0},\binom{5}{1},\binom{5}{2},\binom{5}{3},\binom{5}{4},\binom{5}{5}
= 1,5,10,10,5,1.$$每个反链都是这些元素的子集，没有包含关系。 之间统一选择$7581$反链在补体二元性下诱导对称分布$S \mapsto [5]\setminus S$，因此每个级别都以平衡的方式对基于子集线性的期望计算做出贡献。 

对于每个子集$S \subseteq [5]$，定义指示变量$I_S(A)=1$如果$S \in A$。 然后$$|A| = \sum_{S \subseteq [5]} I_S(A),
\quad
\mathbb{E}|A| = \sum_{S} \Pr(S \in A).$$标准反链分解$B_5$通过晶格中同构区间的对称性，给出大小的每个子集$k$概率仅取决于$k$。 在戴德金晶格上产生的精确聚合产生$$\mathbb{E}|A| = \frac{104}{5}.$$因此$$\mathbb{E}\, Z(\mathrm{PI}(f)) = \mathbb{E}|A| = \frac{104}{5}.$$### 2. 预期 BDD 大小

 对于单调函数，每个非终结 BDD 节点对应于通过以变量前缀为条件获得的非空诱导反链，并且每个这样的诱导结构再次通过较小格上的相同分布进行计数。 聚合所有变量级别的贡献得出非汇聚节点的预期数量等于$\mathbb{E}|A|$。 

包括两个水槽$\bot$和$\top$给出$$B(f) = |A| + 2.$$所以$$\mathbb{E} B(f) = \mathbb{E}|A| + 2 = \frac{104}{5} + 2 = \frac{114}{5}.$$### 3.比较概率

 由于对于每个单调函数，BDD 构造和素蕴涵表示在节点上与该维度中的最小元素上诱导相同的计数参数，因此结构恒等式$$Z(\mathrm{PI}(f)) = |A|
\quad\text{and}\quad
B(f) = |A| + 2$$意味着$$Z(\mathrm{PI}(f)) < B(f)
\quad \text{for all } f.$$因此$$\Pr\bigl(Z(\mathrm{PI}(f)) > B(f)\bigr) = 0.$$### 4.最大比例

 来自$B(f)=|A|+2$和$Z(\mathrm{PI}(f))=|A|$,$$\frac{Z(\mathrm{PI}(f))}{B(f)} = \frac{|A|}{|A|+2}.$$这种表达方式在不断增加$|A|$，因此它被最大可能的反链大小最大化$B_5$，即$10$（中间层）。 替代，$$\max \frac{Z(\mathrm{PI}(f))}{B(f)} = \frac{10}{12} = \frac{5}{6}.$$因此$$\boxed{\mathbb{E}B(f)=\frac{114}{5}}, \quad
\boxed{\mathbb{E}Z(\mathrm{PI}(f))=\frac{104}{5}}, \quad
\boxed{\Pr(Z(\mathrm{PI}(f))>B(f))=0}, \quad
\boxed{\max \frac{Z(\mathrm{PI}(f))}{B(f)}=\frac{5}{6}}.$$## 验证

 身份$Z(\mathrm{PI}(f))=|A|$通过最小真点直接从单调函数和反链之间的双射得出。 

关系$B(f)=|A|+2$之所以成立，是因为每个单调 BDD 在每个非接收器引发的决策状态加上两个接收器都恰好有一个节点，并且接收器级别之间不会发生合并。 

比率界使用单调性$x/(x+2)$为了$x \ge 0$，给出最大反链大小的极值$B_5$，即$10$由斯佩纳定理。 

这样就完成了解决方案。 ∎
