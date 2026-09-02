---
title: "CF 104941H - 怎么样？"
description: "我们得到一个可变字符串 $s$ 和一个包含小写字母和通配符星号的模式 $p$。 星号可以被任何（可能是空的）字符串替换，与其他星号无关。"
date: "2026-06-28T18:18:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104941
codeforces_index: "H"
codeforces_contest_name: "SLPC 2024 Open Division"
rating: 0
weight: 104941
solve_time_s: 22
verified: false
draft: false
---

[CF 104941H - 它如何适合？](https://codeforces.com/problemset/problem/104941/H)

 **评级：** -
 **标签：** -
 **求解时间：** 22s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个可变字符串$s$和一个图案$p$包含小写字母和通配符星号。 星号可以被任何（可能是空的）字符串替换，与其他星号无关。 如果在替换每个星号后我们能够准确地获得字符串，则该模式与字符串匹配。 

每次更新单个字符后$s$，我们需要回答当前的子串是否至少存在一个连续的子串$s$与模式匹配的$p$。 

所以任务不是匹配整个字符串，而是检查是否存在“好窗口”$s$每次更新后。 

约束将两个对象清楚地分开。 字符串$s$很大，可达$2 \cdot 10^5$，并且它改变了很多次，直到$2 \cdot 10^4$。 图案$p$字数很小，最多200个字符。 This asymmetry is the main structural hint: preprocessing and pattern-centric reasoning are mandatory, while the string must be handled dynamically.

 一种简单的方法是在每次更新后扫描所有子字符串，这立即是不可能的：$O(n^2)$子串次数最多$2 \cdot 10^4$更新已经超出任何限制。 

有一些微妙的失败案例会导致天真的贪婪匹配失败。 

第一个问题是空星行为。 例如，图案`"a*b"`比赛`"ab"`（星号为空）和 `"axxb*
