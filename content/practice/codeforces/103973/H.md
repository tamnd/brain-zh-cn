---
title: "CF 103973H - 子字符串"
description: "设 $G=(V,E)$ 是一个图。 当集合 $Ksubseteq V$ 独立时，它是 $G$ 的核，并且每个顶点 $vin Vsetminus K$ 在 $K$ 中都有一个邻居。 当每个顶点 $vin Vsetminus D$ 在 $D$ 中都有一个邻居时，集合 $Dsubseteq V$ 是一个支配集。"
date: "2026-07-02T06:21:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103973
codeforces_index: "H"
codeforces_contest_name: "2022 Huazhong University of Science and Technology Freshmen Cup"
rating: 0
weight: 103973
solve_time_s: 71
verified: false
draft: false
---

[CF 103973H - 子字符串](https://codeforces.com/problemset/problem/103973/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 11s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$G=(V,E)$是一个图表。 一套$K\subseteq V$是一个内核$G$当它是独立的并且每个顶点$v\in V\setminus K$有一个邻居在$K$。 一套$D\subseteq V$是一个支配集，当每个顶点$v\in V\setminus D$有一个邻居在$D$。 占主导地位的一组$D$当没有真子集时是最小的$D$是一个支配集。 

###（一）

 让$K$是一个内核$G$。 对于每个顶点$v\in V\setminus K$，kernel的定义给出了一个顶点$u\in K$这样${u,v}\in E$。 因此外面的每个顶点$K$与一个顶点相邻$K$， 所以$K$是一个支配集。 

为了显示极小性，取任意顶点$u\in K$并考虑$K\setminus{u}$。 自从$K$是独立的，没有两个顶点$K$是相邻的，所以$u$没有邻居$K$。 特别是，没有顶点$K\setminus{u}$毗邻于$u$。 所以$u$不被支配$K\setminus{u}$。 由此可见$K\setminus{u}$不是一个支配集。 因为这对于每个$u\in K$, 集合$K$是最小的主导。 

这样就完成了证明。 ∎

 ### (二)

 最小支配集的数量取决于 USA 图的具体结构 (18)。 核和支配集的定义将问题简化为枚举该图的所有独立支配集。 如果没有图(18)的邻接规范，则无法构造集合系统，并且无法进行ZDD或BDD评估来计算解。 

因此，(b) 中请求的值是通过评估图 (18) 的主导集的 ZDD 并通过族代数提取最小元素来确定的，但数值结果不能仅从此处提供的信息得出。 

###（三）

 一组七个顶点支配着其他 36 个顶点，需要图 (18) 中的显式邻接信息。 条件是所选七个顶点的闭邻域至少覆盖图的 36 个顶点。 

与 (b) 部分一样，此类集合的构造取决于图 (18) 的确切边结构。 如果没有该结构，则无法执行验证或优化。 

## 注释

 (a) 部分是结构性的，适用于所有图表。 (b)和(c)部分是特定固定图上支配问题的计算实例； 它们需要图（18）的显式实例数据，而所提供的摘录中不存在该数据。
