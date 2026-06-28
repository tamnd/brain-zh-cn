---
title: "CF 105167J - 拖延太多"
description: "我们得到了一组不同的整数，代表排列成一行的服务器机架的热量水平。 我们可以使用相邻交换来重新排列该数组，其中每个交换交换相邻元素。"
date: "2026-06-27T10:36:36+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105167
codeforces_index: "J"
codeforces_contest_name: "ETH Zurich Competitive Programming Contest Spring 2024"
rating: 0
weight: 105167
solve_time_s: 17
verified: false
draft: false
---

[CF 105167J - 拖延太多了](https://codeforces.com/problemset/problem/105167/J)

 **评级：** -
 **标签：** -
 **求解时间：** 17s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一组不同的整数，代表排列成一行的服务器机架的热量水平。 我们可以使用相邻交换来重新排列该数组，其中每个交换交换相邻元素。 

重新排列后，我们通过对每对相邻元素之间的绝对差求和来评估配置的质量。 形式上，对于排列$b$，得分为$$\sum_{i=2}^{n} |b_{i-1} - b_i|.$$每个测试用例的任务有两个部分。 首先，我们必须确定该分数在数组的所有排列中的最大可能值。 其次，在达到这一最大值的所有排列中，我们必须计算达到这种最佳排列所需的最小相邻交换数量。 

约束允许最多$2 \cdot 10^5$测试用例总计$n \le 4 \cdot 10^5$。 这迫使每个测试用例都有一个基本上线性或接近线性的解决方案。 任何显式尝试排列或模拟交换的方法都会失败，因为即使 (O(n^2)\
