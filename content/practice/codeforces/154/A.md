---
title: "CF 154A - 家庭任务"
description: "我们得到一串小写字母和一组禁用字母对。 每个禁止对包含两个不同的字母，如果一对 (a, b) 被禁止，则“ab”和“ba”都被禁止作为相邻字符。 我们可以从字符串中删除任何字符。"
date: "2026-06-02T16:49:09+07:00"
tags: ["codeforces", "competitive-programming", "greedy"]
categories: ["algorithms"]
codeforces_contest: 154
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 109 (Div. 1)"
rating: 1600
weight: 154
solve_time_s: 30
verified: false
draft: false
---

[CF 154A - 家庭任务](https://codeforces.com/problemset/problem/154/A)

 **评分：** 1600
 **标签：** 贪婪
 **求解时间：** 30s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一串小写字母和一组禁用字母对。 每个禁止对包含两个不同的字母，并且如果一对`(a, b)`都被禁止`"ab"`和`"ba"`禁止作为相邻字符。 

我们可以从字符串中删除任何字符。 删除后，剩余的字符会靠近，因此原本不相邻的字符可能会成为邻居。 我们的目标是删除尽可能少的字符，以便最终字符串中的相邻字符之间不会出现禁止对。 

字符串长度最多为`100000`，而最多有`13`禁止对。 针对所有位置的二次或动态规划解决方案将过于昂贵。 和`n = 100000`， 甚至`O(n²)`意思是关于`10^10`的操作，这是完全不可行的。 我们需要接近线性时间的东西。 

不寻常的限制是每个字母最多属于一个禁止的 p
