---
title: "CF 175D - 坦克飞机：决斗"
description: "两辆坦克在时间 0 开始战斗。双方立即开火，然后每隔 dt 秒继续开火。 每次射击都可能无法击穿装甲，如果击穿，则伤害从整数区间中统一选择。"
date: "2026-06-02T16:56:46+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "dp", "math", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 175
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 115"
rating: 2400
weight: 175
solve_time_s: 40
verified: false
draft: false
---

[CF 175D - 坦克飞机：决斗](https://codeforces.com/problemset/problem/175/D)

 **评分：** 2400
 **标签：** 暴力破解、dp、数学、概率
 **求解时间：** 40s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 两辆坦克在时间 0 开始战斗。双方都立即开火，然后每隔一段时间继续开火`dt`秒。 每次射击都可能无法击穿装甲，如果击穿，则伤害从整数区间中统一选择。 

一旦坦克的生命值变为负值，它就会被摧毁。 如果两辆坦克同时开火，则两次射击同时发生。 这个细节至关重要，因为如果两辆坦克都死于同一时间点的射击，瓦西亚仍然被认为是胜利者。 

输入描述了 Vasya 的坦克和敌方坦克。 对于每辆坦克，我们都知道它的生命值、装弹时间、伤害间隔以及其射击未能击穿对手装甲的概率。 

任务是计算 Vasya 最终获胜的概率。 

限制小得惊人。 生命值永远不会超过 200，重载次数永远不会超过 30，伤害值永远不会超过 100。这些界限强烈表明我们应该明确地对剩余生命值进行建模。 涉及两个坦克 HP 值的状态空间最多包含约`201 × 201 = 40401`状态，这是完全可以管理的。 

困难的部分是时机。 坦克
