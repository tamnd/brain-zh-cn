---
title: "CF 104767G - 仓鼠"
description: "我们得到了一组绘制在整数网格上的单位段。 每一段连接两个水平或垂直方向恰好相距一步的网格交点。"
date: "2026-06-29T02:28:33+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104767
codeforces_index: "G"
codeforces_contest_name: "2023-2024 CTU Open Contest"
rating: 0
weight: 104767
solve_time_s: 33
verified: false
draft: false
---

[CF 104767G - 仓鼠](https://codeforces.com/problemset/problem/104767/G)

 **评级：** -
 **标签：** -
 **求解时间：** 33s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一组绘制在整数网格上的单位段。 每一段连接两个水平或垂直方向恰好相距一步的网格交点。 如果我们将每个网格交叉点视为一个顶点，将每个给定线段视为无向边，则输入描述了无限网格图的稀疏子图。 

只要没有墙段阻挡仓鼠的移动，仓鼠就会沿着相邻顶点之间的网格边缘移动。 目标是安装额外的单元段，使仓鼠被困在至少一个封闭区域内，这意味着生成的平面图中至少有一个有界面。 从图的角度来看，这对应于在最终图中创建至少一个简单的循环，因为网格图中的任何循环都包围着一个区域，如果不穿过边缘就无法逃脱该区域。 

任务是确定必须在当前未使用的相邻网格点之间添加的附加单元边的最小数量，以保证生成的图至少包含一个循环。 

限制条件
