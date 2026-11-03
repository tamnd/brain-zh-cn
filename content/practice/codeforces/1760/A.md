---
title: "CF 1760A - 中号"
description: "任务是确定三个不同整数中既不是最小也不是最大的数字。 每个输入案例给出三个数字，输出应标识“中间”值。"
date: "2026-06-09T14:20:40+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1760
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 835 (Div. 4)"
rating: 800
weight: 1760
solve_time_s: 181
verified: false
draft: false
---

[CF 1760A - 中等数量](https://codeforces.com/problemset/problem/1760/A)

 **评分：** 800
 **标签：** 实施、排序
 **求解时间：** 3m 1s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 任务是确定三个不同整数中既不是最小也不是最大的数字。 每个输入案例给出三个数字，输出应标识“中间”值。 这本质上是找到三个值的中值，但不对更大的集合进行排序。 输入由多个测试用例组成，每个测试用例恰好有三个整数，全部在 1 到 20 的范围内。三个数字的小范围和固定大小意味着我们可以使用简单的比较或最小的条件逻辑，而不必担心性能。 边缘情况包括数字按升序、降序排列或在任何位置具有中间值的序列。 如果中位数不在该位置，粗心的方法（例如始终选择第二个输入数字）将会失败。 

## 方法

 最直接的方法是将每个数字与其他两个数字进行比较。 可以检查一下是否`a`位于之间`b`和`c`， 无论`b`位于之间`a`和`c`， 或者
