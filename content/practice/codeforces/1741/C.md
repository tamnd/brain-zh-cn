---
title: "CF 1741C - 最小化厚度"
description: "我们得到一个正整数数组，并要求将其划分为连续的段，以使所有段的总和相同。 每个段必须是连续的，并且每个元素恰好属于一个段。"
date: "2026-06-09T16:25:33+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy", "math", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1741
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 826 (Div. 3)"
rating: 1100
weight: 1741
solve_time_s: 159
verified: false
draft: false
---

[CF 1741C - 最小化厚度](https://codeforces.com/problemset/problem/1741/C)

 **评分：** 1100
 **标签：** 蛮力、贪心、数学、两个指针
 **求解时间：** 2m 39s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个正整数数组，并要求将其划分为连续的段，以使所有段的总和相同。 每个段必须是连续的，并且每个元素恰好属于一个段。 裂缝的厚度是最大线段的长度，目标是最小化该厚度。 

约束是适中的：每个测试用例的数组长度最多为 2000，所有测试用例的总长度也以 2000 为界。这使得算法的最坏情况时间复杂度约为$O(n^2)$每个测试用例，因为$2000^2$2秒以内的操作是可以接受的。 

非明显的边缘情况包括无法均匀分割的数组，除非将整个数组作为一个段，例如像 `[10, 23, 7,
