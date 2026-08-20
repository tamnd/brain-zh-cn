---
title: "CF 102219D - 亿万富翁阿里"
description: "我可以写社论，但您提供的问题陈述缺少决定整个解决方案的一条信息：从 a 和 b 定义 x 的公式。"
date: "2026-08-20T03:45:33+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102219
codeforces_index: "D"
codeforces_contest_name: "2019 ICPC Malaysia National"
rating: 0
weight: 102219
solve_time_s: 86
verified: false
draft: false
---

[CF 102219D - 亿万富翁阿里](https://codeforces.com/problemset/problem/102219/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 26s
 **已验证：** 否

 ## 解决方案
 我可以写社论，但是您提供的问题陈述缺少决定整个解决方案的一条信息：定义的公式`x`从`a`和`b`。 

渲染的语句字面上包含：

 > “这两个整数用于计算另一个整数`x`使用以下公式：”

 后面是一个省略的图像。 Codeforces 官方声明具有与图像相同的公式，因此网络副本也不会将其公开为文本。 引用turn5view0

 这不是表面上的遗漏。 不同的公式导致完全不同的算法。 例如，使用样本的最终值`a = [3, 6, 6, 5, 5, 2, 3]`和`b = [1, 2, 1, 1, 1, 1, 2]`,

 乘积公式给出总共`39`，而幂公式`a^b mod 100007`给出`85`，两者都不匹配样本输出`16`。 

官方页面确认每位好友开头为`a = b = 1`，更新包含顺时针圆形范围，并且每个最终`x`减少模数`100005 + 7`; 仅有的
