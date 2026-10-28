---
title: "CF 1473A - 更换元件"
description: "我们得到一个正整数数组和一个阈值 $d$。 在一个操作中，我们可以选择任何元素并将其替换为任何其他两个不同元素的总和。"
date: "2026-06-11T00:27:37+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1473
codeforces_index: "A"
codeforces_contest_name: "Educational Codeforces Round 102 (Rated for Div. 2)"
rating: 800
weight: 1473
solve_time_s: 164
verified: false
draft: false
---

[CF 1473A - 更换元件](https://codeforces.com/problemset/problem/1473/A)

 **评分：** 800
 **标签：** 贪婪、实现、数学、排序
 **求解时间：** 2m 44s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个正整数数组和一个阈值，$d$。 在一个操作中，我们可以选择任何元素并将其替换为任何其他两个不同元素的总和。 目标是确定经过一些操作序列后，数组的每个元素是否可以小于或等于$d$。 输入由多个测试用例组成，每个测试用例给出数组和$d$，我们将为每种情况输出 YES 或 NO。 

鉴于限制条件，$n$最多可达 100 个，$d$最多 100 个，每个元素最多 100 个。这告诉我们，对每个可能的操作序列进行简单的暴力模拟仅适用于小型数组； 潜在操作的总数是组合的$n$，因此枚举所有序列将是一个天文数字。 因此，我们必须找到一个属性，让我们无需模拟每一个操作就能做出决定。 

当大多数元素位于上方时，会出现不明显的边缘情况$d$但两个最小的元素足够小，它们的总和不超过$d$。 例如，考虑$a = [1, 2, 5]$和$d = 3$。 最大的元素在上面$d$，但两个最小的总和为$3$，因此用它们的总和替换最大的元素会产生所有元素$\le d$。 A careless approach might just check the maximum element and fail to notice this potential transformation.

 Another edge case is when all elements are initially below$d$，此时无需任何操作。 相反，如果两个最小元素本身之和大于$d$，没有任何操作可以减少较大的元素，所以答案立即是否定的。 

## 方法

 暴力方法会重复尝试三个索引的每种组合，替换元素并检查所有元素是否低于$d$。 虽然原则上是正确的，但这太慢了，因为每个步骤都有$O(n^3)$选择，我们可能需要多次重复操作。 为了$n = 100$，即使单次迭代也需要最多$10^6$步骤和序列可以任意长。 

关键的观察结果是，只有两个最小的元素对于减少任何较大的元素很重要。 任何大于的元素$d$只能用其他两个元素的和来代替。 最小可能的和是两个最小元素的和。 如果该总和小于或等于$d$，我们总是可以用该总和替换任何大元素。
