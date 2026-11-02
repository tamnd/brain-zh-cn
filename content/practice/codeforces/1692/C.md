---
title: "CF 1692C - 主教在哪里？"
description: "这种差异不是由小的实现错误引起的。 输出表明算法本身高估了独立间隔的成本。"
date: "2026-06-09T23:00:35+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1692
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 799 (Div. 4)"
rating: 800
weight: 1692
solve_time_s: 104
verified: false
draft: false
---

[CF 1692C - 主教在哪里？](https://codeforces.com/problemset/problem/1692/C)

 **评分：** 800
 **标签：** 实施
 **求解时间：** 1m 44s
 **已验证：** 否

 ## 解决方案
 这种差异不是由小的实现错误引起的。 输出```
11010  -> expected 2, got 3
110000 -> expected 2, got 4
01000010001010011000 -> expected 5, got 13
```表明算法本身高估了独立区间的成本。 

例如，关于`11010`，产生的解决方案`3`有效地分别处理两个不匹配对：```
(1,3) cost 2
(2,5) cost 1
total = 3
```但最优解对整个段执行一次操作`[1,5]`有成本`2`，同时修复两个不匹配对。 

同样的现象在`110000`，其中错误的算法需要支付多次局部维修费用，而最佳解决方案则利用维修之间的相互作用并实现总成本`2`。 

因此，没有针对性的单行修复。 使用的递归没有计算正确的状态转换。 Codeforces 1693F 的底层优化是一个更难的贪婪/两指针问题，评级为 3400，产生的 DP`0 1 1 3 3 4 13`不等同于编辑解决方案。 

为了提供正确的替换，我需要生成这些输出的实际代码。 仅通过输出值，我可以确定算法模型是错误的，但我无法重建确切的有缺陷的实现或安全地修补它。 

请粘贴生成的Python代码```
0
1
1
3
3
4
13
```我可以逐行跟踪执行情况，识别精确的错误转换，并提供正确的版本。
