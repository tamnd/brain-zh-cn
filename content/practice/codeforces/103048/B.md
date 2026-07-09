---
title: "CF 103048B - 手链"
description: "令 $2 × 2 × 3$ 环面为笛卡尔积 $C2 × C2 × C3,$，因此其元素为三元组 $(i,j,k)$，其中 $i 在 {0,1}$ 中，$j 在 {0,1}$ 中，$k 在 {0,1,2}$ 中，并且在相应坐标中对 $2,2,3$ 进行加法运算。"
date: "2026-07-04T01:50:26+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103048
codeforces_index: "B"
codeforces_contest_name: "2021 ECNU Campus Invitational Contest"
rating: 0
weight: 103048
solve_time_s: 75
verified: false
draft: false
---

[CF 103048B - 手链](https://codeforces.com/problemset/problem/103048/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 15s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$2 \times 2 \times 3$环面是笛卡尔积$C_2 \times C_2 \times C_3,$所以它的元素是三元组$(i,j,k)$和$i \in {0,1}$,$j \in {0,1}$,$k \in {0,1,2}$，并且加法取模$2,2,3$在各自的坐标中。 

功能$\alpha$和$\beta$与环面相关的 充当前两个循环坐标中的单位平移，同时保持第三个坐标不变。 因此$\alpha(i,j,k) = (i+1 \bmod 2,\; j,\; k), \qquad \beta(i,j,k) = (i,\; j+1 \bmod 2,\; k).$由于每个坐标周期是独立的，因此应用$\alpha$或者$\beta$不影响其余坐标。 第三个坐标$k$在两张地图下保持不变。 

要显式计算函数，请列出所有$12$顶点并直接应用定义。 

为了$k=0$,$\alpha(0,0,0)=(1,0,0), \quad \beta(0,0,0)=(0,1,0),$

$\alpha(1,0,0)=(0,0,0), \quad \beta(1,0,0)=(1,1,0),$

$\alpha(0,1,0)=(1,1,0), \quad \beta(0,1,0)=(0,0,0),$

$\alpha(1,1,0)=(0,1,0), \quad \beta(1,1,0)=(1,0,0).$为了$k=1$,$\alpha(0,0,1)=(1,0,1), \quad \beta(0,0,1)=(0,1,1),$

$\alpha(1,0,1)=(0,0,1), \quad \beta(1,0,1)=(1,1,1),$

$\alpha(0,1,1)=(1,1,1), \quad \beta(0,1,1)=(0,0,1),$

$\alpha(1,1,1)=(0,1,1), \quad \beta(1,1,1)=(1,0,1).$为了$k=2$,$\alpha(0,0,2)=(1,0,2), \quad \beta(0,0,2)=(0,1,2),$

$\alpha(1,0,2)=(0,0,2), \quad \beta(1,0,2)=(1,1,2),$

$\alpha(0,1,2)=(1,1,2), \quad \beta(0,1,2)=(0,0,2),$

$\alpha(1,1,2)=(0,1,2), \quad \beta(1,1,2)=(1,0,2).$这两个地图在前两个坐标中是内合的，$\alpha^2 = \beta^2 = \mathrm{id},$他们通勤，$\alpha\beta(i,j,k) = \beta\alpha(i,j,k) = (i+1 \bmod 2,\; j+1 \bmod 2,\; k),$因此，环面是由独立作用于前两个循环因子的两个通勤对合生成的。 这给出了完整的$\alpha$和$\beta$的结构$2 \times 2 \times 3$环面。 

这样就完成了解决方案。 ∎
