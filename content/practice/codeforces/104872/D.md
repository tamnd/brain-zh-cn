---
title: "CF 104872D - a、ab、ba 弦"
description: "我们维护一个仅由字符 a 和 b 组成的二进制字符串，并在线应用了两个操作。 第一个操作翻转单个位置，将 a 变为 b 或将 b 变为 a。"
date: "2026-06-28T10:25:11+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104872
codeforces_index: "D"
codeforces_contest_name: "2023-2024 Russia Team Open, High School Programming Contest (VKOSHP XXIV)"
rating: 0
weight: 104872
solve_time_s: 35
verified: false
draft: false
---

[CF 104872D - a、ab、ba 字符串](https://codeforces.com/problemset/problem/104872/D)

 **评级：** -
 **标签：** -
 **求解时间：** 35s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们正在维护一个仅由字符组成的二进制字符串`a`和`b`，有两个在线应用的操作。 第一个操作翻转单个位置，转动`a`进入`b`或者`b`进入`a`。 第二个操作询问给定的子字符串是否可以完全划分为连续的块，其中每个块恰好是三种允许的形式之一：单个字符`a`，或一对`ab`，或一对`ba`。 

因此，每个有效的分解都是使用长度为 1 或 2 的图块对子字符串进行平铺，但长度为 2 的图块受到限制：它们必须交替字符。 

关键的困难在于，我们必须对长度高达 100,000 的字符串回答最多 100,000 次更新和 100,000 次查询，因此任何针对每个查询重新扫描子字符串的解决方案都会立即变得太慢。 在最坏的情况下，直接检查每个查询子字符串将花费 O(n) 每个查询，从而导致 O(nq)，这是完全不可行的。 

微妙之处在于允许的平铺不是任意的。 例如，像这样的子字符串`aa`始终有效，因为它可以分为两个单独的`a`瓷砖。 但`aaa`也是有效的。 同时`aba`有效为`ab | a`， 尽管`aab`有效为`a | ab`。 真正的障碍是当我们被迫放置长度为 2 的图块但本地奇偶校验和邻接约束发生冲突时。 

天真的
