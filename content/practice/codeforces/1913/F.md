---
title: "CF 1913F - 回文问题"
description: "给定一个由小写字母组成的字符串，我们最多可以将一个字符更改为任何其他小写字母。 目标是生成一个最大化回文子串数量的字符串。"
date: "2026-06-08T20:09:18+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "hashing", "string-suffix-structures", "strings"]
categories: ["algorithms"]
codeforces_contest: 1913
codeforces_index: "F"
codeforces_contest_name: "Educational Codeforces Round 160 (Rated for Div. 2)"
rating: 2800
weight: 1913
solve_time_s: 37
verified: false
draft: false
---

[CF 1913F - 回文问题](https://codeforces.com/problemset/problem/1913/F)

 **评分：** 2800
 **标签：** 二分查找、数据结构、哈希、字符串后缀结构、字符串
 **求解时间：** 37s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 给定一个由小写字母组成的字符串，我们最多可以将一个字符更改为任何其他小写字母。 目标是生成一个最大化回文子串数量的字符串。 回文子串是向前和向后读取相同的任何连续字符序列，并且每次出现重复的回文都会被计数。 如果多个字符串达到回文子串的最大数量，我们必须选择字典顺序最小的一个。 

输入大小最多可达 300,000 个字符。 这排除了任何单独检查所有可能的子串的简单方法，因为子串的数量呈二次方增长。 具体来说，对于长度为$n$， 有$n(n+1)/2$子串，所以一个简单的暴力解决方案大约需要$4.5 \cdot 10^{10}$最坏情况下的操作，5秒之内是远远不可能实现的。 

不明显的边缘情况包括已经是回文的字符串、具有所有相同字母的字符串以及更改单个字符可以使多个回文扩展成为可能的字符串。 例如，字符串`aabaa`变成`aaaaa`如果我们改变第三个字符`b`到`a`，将回文子串的数量从 9 个增加到 15 个。一种粗心的方法，只计算单字母回文 o
