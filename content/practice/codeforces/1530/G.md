---
title: "CF 1530G - 多么逆转"
description: "给定两个二进制字符串 a 和 b，它们具有相同的长度 n 和整数 k。 我们的目标是通过重复反转 a 中恰好包含 k 个的子串，将 a 转换为 b。 每次反转都可以涉及任意数量的零。"
date: "2026-06-10T16:55:35+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms"]
categories: ["algorithms"]
codeforces_contest: 1530
codeforces_index: "G"
codeforces_contest_name: "Codeforces Round 733 (Div. 1 + Div. 2, based on VK Cup 2021 - Elimination (Engine))"
rating: 3300
weight: 1530
solve_time_s: 49
verified: false
draft: false
---

[CF 1530G - 多么逆转](https://codeforces.com/problemset/problem/1530/G)

 **评分：** 3300
 **标签：** 构造性算法
 **求解时间：** 49s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有两个二进制字符串，`a`和`b`, 相同长度`n`和一个整数`k`。 我们的目标是转型`a`进入`b`通过反复反转子串`a`恰好包含`k`那些。 每次反转都可以涉及任意数量的零。 输出应该是一系列反转或`-1`如果在规定的限度内无法进行转化。 

这个问题是建设性的，但它有一个微妙的限制：我们不能随意移动。 我们只能反转包含完全包含的块`k`那些。 这意味着我们需要考虑他人的立场
