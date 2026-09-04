---
title: "CF 105002L - \u041c\u043e\u043d\u0441\u0442\u0440\u044b"
description: "我们得到了一组怪物，我们想在总体“攻击性”的全球限制下选择其中一些来最大化我们捕获的数量。 每个怪物的行为都有一定的条件性。"
date: "2026-06-28T03:21:12+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105002
codeforces_index: "L"
codeforces_contest_name: "vkoshp.letovo 2022"
rating: 0
weight: 105002
solve_time_s: 23
verified: false
draft: false
---

[CF 105002L - \u041c\u043e\u043d\u0441\u0442\u0440\u044b](https://codeforces.com/problemset/problem/105002/L)

 **评级：** -
 **标签：** -
 **求解时间：** 23s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一组怪物，我们想在总体“攻击性”的全球限制下选择其中一些来最大化我们捕获的数量。 

每个怪物的行为都有一定的条件性。 如果我们决定采取一组大小相同的怪物$k$，那么对于每个怪物都有一个阈值$c_i$。 如果最终选择的尺寸$k$不超过此阈值，怪物贡献值较低$a_i$。 如果选择的尺寸大于$c_i$，怪物变得更加危险并做出贡献$b_i$， 在哪里$b_i \ge a_i$。 

目标是选择怪物的子集，使得当根据子集的最终大小计算它们的贡献时，总和不超过$s$，并且子集的大小尽可能大。 

关键的困难在于，选择怪物的成本取决于我们总共选择的怪物数量，因此固定子集的值并不是预先固定的。 

的c
