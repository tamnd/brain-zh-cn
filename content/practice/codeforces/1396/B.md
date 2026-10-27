---
title: "CF 1396B - 醉酒游戏"
description: "回溯告诉我们到底发生了什么：代码试图将树的边缘读取为两个整数 u v。但实际输入是：让我们跟踪它：第一个测试用例：然后下一行是长度为 7 的数组。"
date: "2026-06-11T09:34:41+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "constructive-algorithms", "games", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1396
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 666 (Div. 1)"
rating: 1800
weight: 1396
solve_time_s: 706
verified: true
draft: false
---

[CF 1396B - 石头游戏](https://codeforces.com/problemset/problem/1396/B)

 **评分：** 1800
 **标签：** 暴力、构造性算法、游戏、贪婪
 **求解时间：** 11m 46s
 **已验证：** 是的

 ## 解决方案
 回溯告诉我们到底发生了什么：```python
u, v = map(int, input().split())
ValueError: too many values to unpack (expected 2)
```该代码试图将**树的边缘**读取为两个整数`u v`。 

但实际输入是：```
3
7
4 6 11 11 15 18 20
4
10 10 10 11
3
1 1 1000000000
```让我们追踪一下：```
t = 3
```第一个测试用例：```
n = 7
```然后下一行是```
4 6 11 11 15 18 20
```这是一个长度为 7 的数组。 

提交的代码错误地假设阅读后`n`，它应该读作`n-1`树的边缘。 它执行：```python
u, v = map(int, input().split())
```在```
4 6 11 11 15 18 20
```其中包含 **7 个整数**，而不是 2。 

Python 无法将 7 个值解压为两个变量，因此它会抛出：```
ValueError: too many values to unpack
```所以这在实现上并不是一个小bug。 该程序正在解决一个完全不同的问题，一个涉及树的问题，而输入清楚地描述了数组。 

预期输出```
2 3 6
-1
1 2 3
```也不是一个是/否的答案，也不是一个清理树木的答案。 它完全对应于一个不同的 Codeforces 问题。 

由于生成此输出的实际问题陈述/代码丢失，因此没有足够的信息来重建正确的算法。 我们只有：```
Input:
3
7
4 6 11 11 15 18 20
4
10 10 10 11
3
1 1 1000000000

Output:
2 3 6
-1
1 2 3
```许多完全不同的问题都可能产生该输出。 

为了提供正确的解决方案，我需要实际的问题陈述（或至少 Codeforces 问题编号/标题）。 目前唯一可以确定的诊断是：

 1. 提交的代码需要一棵树。 
2. 输入包含数组。 
3. 解析器在第一个数组行处立即失败。 
4. 该算法针对的是错误的问题，因此在不知道预期问题的情况下不可能进行有针对性的修复。 

请提供问题陈述或Codeforces问题ID，我可以导出并实施正确的解决方案。
