---
title: "CF 103389C - \u8fde\u9501\u5546\u5e97"
description: "令顶点为所有二进制字符串 $a{2t-1} 点 a1a0$，其中恰好有 $t$ 个零和 $t$ 个。 移动包括在 {1,dots,2t-1}$ 中选择某个索引 $j 并将 $a0$ 与 $aj$ 交换，生成一个仍包含 $t$ 零和 $t$ 1 的新字符串。"
date: "2026-07-03T12:12:31+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103389
codeforces_index: "C"
codeforces_contest_name: "2021\u5e74\u4e2d\u56fd\u5927\u5b66\u751f\u7a0b\u5e8f\u8bbe\u8ba1\u7ade\u8d5b\u5973\u751f\u4e13\u573a"
rating: 0
weight: 103389
solve_time_s: 138
verified: false
draft: false
---

[CF 103389C - \u8fde\u9501\u5546\u5e97](https://codeforces.com/problemset/problem/103389/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 18s
 **已验证：** 否

 ## 解决方案
 ## 设置

 设顶点全部为二进制串$a_{2t-1}\dots a_1a_0$恰好与$t$零点和$t$那些。 移动包括选择一些索引$j \in {1,\dots,2t-1}$和交换$a_0$和$a_j$，产生一个新的字符串，仍然有$t$零点和$t$那些。 

问题是问是否所有$(t,t)$-可以通过对所有顶点进行排序来生成组合，其中连续字符串因这种交换而不同。 

同样，这询问图是否$G_t$其顶点都是${0,1,\dots,2t-1}$尺寸的$t$，有边缘$$S \sim T \quad \Longleftrightarrow \quad T = S \triangle \{0,j\} \text{ for some } j \neq 0,$$具有哈密顿循环。 

## 已知结果

 每个顶点$S$可以根据是否$0 \in S$。 

如果$0 \in S$， 然后$S = {0} \cup A$在哪里$A \subseteq {1,\dots,2t-1}$和$|A| = t-1$。 

如果$0 \notin S$， 然后$S = B$在哪里$B \subseteq {1,\dots,2t-1}$和$|B| = t$。 

因此顶点集分为两层：$$\mathcal{L}_{t-1} = \{A \subseteq [2t-1] : |A| = t-1\}, \quad
\mathcal{L}_t = \{B \subseteq [2t-1] : |B| = t\}.$$在此标识下，交换$a_0$和$a_j$完全对应于添加或删除$j$从子集$[2t-1]$。 因此边连接$A \in \mathcal{L}_{t-1}$到$B \in \mathcal{L}_t$恰好当$B = A \cup {j}$。 

所以$G_t$与布尔格上的中间层图同构$[2t-1]$，限制级别$t-1$和$t$。 

中层猜想断言该图对于所有的都是哈密顿图$t$。 这是 20 世纪 80 年代提出的，几十年来一直保持开放。 最终被Mütze（2014-2016系列结果）证明了其完全的普遍性，确定每个中层图都存在哈密顿循环。 

## 部分参数

 上面的同构将问题简化为在二分图中构建哈密顿循环，其部分是$\binom{2t-1}{t-1}$和$\binom{2t-1}{t}$顶点，邻接由单个元素的对称差给出。 

每条边恰好切换一个元素的成员资格$j \neq 0$，所以每一步都是有效的交换$a_0$与一些$a_j$。 中间层图中的任何哈密顿循环立即产生所有的循环排序$(t,t)$-满足所需交换条件的组合。 

因此，对中层问题的积极解决意味着对当前问题的积极回答。 

## 状态

 该问题相当于中层猜想。 

中层猜想现在是一个定理：所有的哈密顿循环都存在$t \ge 1$，由 Mütze 及其合作者在 2010 年代证明。 

因此所有$(t,t)$- 组合$a_{2t-1}\dots a_1a_0$确实可以通过反复交换来生成$a_0$与一些其他元素。 

这样就完成了解决方案。 ∎
