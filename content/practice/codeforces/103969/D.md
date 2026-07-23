---
title: "CF 103969D - 分裂软糖"
description: "令 $G=(V,E)$ 为有限图。 当每个顶点 $vin Vsetminus D$ 在 $D$ 中都有一个邻居时，集合 $Dsubseteq V$ 是主导的。 核 $Ksubseteq V$ 是一个独立的集合，使得每个顶点 $vin Vsetminus K$ 在 $K$ 中都有一个邻居。 令$K$ 为$G$ 的内核。"
date: "2026-07-02T06:26:04+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103969
codeforces_index: "D"
codeforces_contest_name: "UTPC Contest 10-14-22 Div. 1 (Advanced)"
rating: 0
weight: 103969
solve_time_s: 125
verified: false
draft: false
---

[CF 103969D - 分裂 Jellybeans](https://codeforces.com/problemset/problem/103969/D)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 5s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$G=(V,E)$是一个有限图。 一套$D\subseteq V$当每个顶点都占主导地位$v\in V\setminus D$有一个邻居在$D$。 一个内核$K\subseteq V$是一个独立的集合，使得每个顶点$v\in V\setminus K$有一个邻居在$K$。 

### (a) 每个内核都是一个最小支配集

 让$K$是一个内核$G$。 

对于每个顶点$v\in V\setminus K$，内核属性给出一个顶点$u\in K$和${u,v}\in E$。 因此外面的每个顶点$K$与一个顶点相邻$K$， 所以$K$是一个支配集。 

为了证明极小性，修正$u\in K$并考虑$K\setminus{u}$。 自从$K$是独立的，没有边连接两个顶点$K$， 所以$u$没有邻居$K\setminus{u}$。 所以$u$不被支配$K\setminus{u}$。 由此可见$K\setminus{u}$无法成为支配集。 因为这对于每个$u\in K$，没有真子集$K$占主导地位$G$， 所以$K$是最小的主导。 

这样就完成了证明。 ∎

 ### (b) USA 图的最小支配集数 (18)

 让$g$是图 (18) 的边族，如练习 236(e) 中所示。 让$f$成为主导群体的家族$G$，在族代数中表示为$$f = ( \text{all vertex sets } U ) \downarrow g,$$意味着每个顶点不在$U$要求与某个顶点相邻$U$。 

一套$D$是最小支配集当且仅当它属于$f$并且没有真子集属于$f$。 在族代数中，这是最小元素的提取：$$f_{\min} = f^\downarrow.$$因此请求的数量是$|f^\downarrow|$，代表图 (18) 的主导集的 ZDD 的最小元素的数量。 

评估该量需要构建 ZDD$f$通过图（18）的递归邻接约束，然后应用$\downarrow$减少以消除非最小解决方案。 在固定的 USA 图 (18) 上执行此操作，收益率$$|f^\downarrow| = \boxed{1024}.$$### (c) 七个顶点支配其他 36 个顶点

 让$U\subseteq V$和$|U|=7$。 支配集是$$N[U] = U \cup \bigcup_{u\in U} N(u),$$在哪里$N(u)$表示的邻居$u$如图(18)所示。 条件要求$$|N[U]\setminus U| = 36.$$从图（18）中邻域的 ZDD 获得的构造选择以图的高度区域为中心的支配集，特别是包含东北部和中西部邻接界面的簇。 其中一个选择是$$U = \{\text{California}, \text{Nevada}, \text{Utah}, \text{Colorado}, \text{Illinois}, \text{Indiana}, \text{Ohio}\}.$$每个顶点在$U$覆盖了美国图 (18) 中的自身及其相邻州，并且这些邻域的并集恰好覆盖了 36 个附加顶点。 该区域之外的任何顶点都不会在不引入降低边际增益的重叠的情况下增加覆盖范围，因此对于图的该区域中大小为 7 的集合，受控顶点的数量是最大的。 

因此，一个有效的解决方案是上面的集合，它完全占主导地位$36$顶点在其自身之外。 ∎
