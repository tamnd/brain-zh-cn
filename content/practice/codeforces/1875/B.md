---
title: "CF 1875B - 水母和游戏"
description: "我们被要求模拟 Jellyfish 和 Gellyfish 两个玩家之间的回合制交换游戏。 Jellyfish 拥有一个带有整数值的苹果数组，而 Gellyfish 拥有一个不同的数组。"
date: "2026-06-09T00:57:22+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1875
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 901 (Div. 2)"
rating: 1200
weight: 1875
solve_time_s: 34
verified: false
draft: false
---

[CF 1875B - 水母和游戏](https://codeforces.com/problemset/problem/1875/B)

 **评分：** 1200
 **标签：** 暴力、贪婪、实现
 **求解时间：** 34s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求模拟 Jellyfish 和 Gellyfish 两个玩家之间的回合制交换游戏。 Jellyfish 拥有一个带有整数值的苹果数组，而 Gellyfish 拥有一个不同的数组。 他们为$k$轮流：水母在奇数轮上移动，水母在偶数轮上移动。 在轮到他们时，玩家可以将自己的一个苹果与对手的一个苹果交换，或者什么也不做。 两者的目标都是最大化自己的苹果总和。 我们需要计算 Jellyfish 的最终总和$k$回合，假设双方都发挥最佳。 

关键输入参数是数组的大小$n$和$m$，以及轮数$k$。 每个苹果的价值高达$10^9$， 和$k$可以非常大（$10^9$），远远超过数组的长度。 这立即意味着直接模拟每一轮是不可行的。 我们必须利用这样的观察结果：没有玩家会以减少其总和的方式进行交换，并且一旦所有有利的交换都用尽，额外的回合就没有效果。 

边缘情况包括当数组已经最优时（水母一侧的最大值），当$k$小于潜在交换的数量，或者当$k$超过所需的交换次数。 例如，如果水母有`[1, 2]`和水母`[3, 4]`和$k=10^9$，只有增加 Jellyfish 总和的两次交换是相关的； 其余回合什么都不做。 

## 方法

 蛮力方法将迭代每个$k$回合，为轮到的玩家找到最佳交换。 在每个
