---
title: "CF 102946H - 停止问题"
description: "令 $2times 2times 3$ 环面为笛卡尔积 $$T = mathbb{Z}2 乘以 mathbb{Z}2 乘以 mathbb{Z}3,$$，因此每个元素都是三元组 $(x,y,z)$，其中 $x,y 在 {0,1}$ 中，$z 在 {0,1,2}$ 中，算术运算分别以 $2,2,3$ 为模。 这给出了 $12$ 顶点。"
date: "2026-07-04T07:34:22+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102946
codeforces_index: "H"
codeforces_contest_name: "NCTU PCCA Winter Contest 2021"
rating: 0
weight: 102946
solve_time_s: 145
verified: false
draft: false
---

[CF 102946H - 停止问题](https://codeforces.com/problemset/problem/102946/H)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 25s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$2\times 2\times 3$环面是笛卡尔积$$T = \mathbb{Z}_2 \times \mathbb{Z}_2 \times \mathbb{Z}_3,$$所以每个元素都是一个三元组$(x,y,z)$和$x,y \in {0,1}$和$z \in {0,1,2}$，以算术取模$2,2,3$分别。 这给出了$12$顶点。 

(69) 中的环面结构是以下的凯莱图$T$使用与每个坐标中的单位增量相对应的标准生成器。 对于一个顶点$u=(x,y,z)$，通过以周期长度为模增加一个坐标来定义三个前向邻居。 这产生了定义的局部前移结构$\alpha$。 反向移动定义$\beta$。 

功能$\alpha$将每个顶点映射到通过应用一个前向生成器获得的顶点集。 因此，$$\alpha(x,y,z)
=
\{(x+1 \bmod 2, y, z),\ (x, y+1 \bmod 2, z),\ (x, y, z+1 \bmod 3)\}.$$功能$\beta$将每个顶点映射到通过应用逆生成器获得的集合，该生成器减去$1$在每个坐标中以相应的模数为模。 因此，$$\beta(x,y,z)
=
\{(x-1 \bmod 2, y, z),\ (x, y-1 \bmod 2, z),\ (x, y, z-1 \bmod 3)\}.$$使用代表明确地编写这些内容${0,1}$和${0,1,2}$给出$$x-1 \bmod 2 = 1-x,\quad y-1 \bmod 2 = 1-y,\quad z-1 \bmod 3 =
\begin{cases}
2,& z=0\\
0,& z=1\\
1,& z=2.
\end{cases}$$因此$$\beta(x,y,z)
=
\{(1-x, y, z),\ (x, 1-y, z),\ (x, y, z-1 \bmod 3)\}.$$环面的每个顶点正好有三个$\alpha$-图像和三个$\beta$-原像，匹配 3 生成器结构$2\times 2\times 3$循环乘积图。 这对$(\alpha,\beta)$形成该凯莱环面的前向和后向邻接算子，与前面练习的跨序对偶框架一致。 

这样就完成了计算。 ∎
