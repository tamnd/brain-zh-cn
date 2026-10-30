---
title: "CF 1575L - 最长数组解构"
description: "我们从一个数组开始。 我们可以重复删除任意元素，并且每次删除后剩余的元素都会靠在一起。 对于任何结果数组，将其分数定义为值等于其当前从 1 开始的索引的位置数。"
date: "2026-06-10T11:00:04+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "divide-and-conquer", "dp", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1575
codeforces_index: "L"
codeforces_contest_name: "COMPFEST 13 - Finals Online Mirror (Unrated, ICPC Rules, Teams Preferred)"
rating: 2100
weight: 1575
solve_time_s: 154
verified: false
draft: false
---

[CF 1575L - 最长数组解构](https://codeforces.com/problemset/problem/1575/L)

 **评分：** 2100
 **标签：** 数据结构、分而治之、dp、排序
 **求解时间：** 2m 34s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们从一个数组开始。 我们可以重复删除任意元素，并且每次删除后剩余的元素都会靠在一起。 

对于任何结果数组，将其分数定义为值等于其当前从 1 开始的索引的位置数。 We want to choose a subsequence of the original array, preserving relative order, so that in the resulting array as many positions as possible satisfy$$b_i=i.$$任务是计算可达到的最高分数。 

关键的观察是删除元素只会更改索引。 保留元素的相对顺序永远不会改变。 任何最终数组只是原始数组的子序列。 

制约因素很大。 数组长度可以达到$2 \cdot 10^5$，这立即排除了任何明确考虑位置对的子集、区间或动态规划的解决方案。 甚至$O(n^2)$大约需要$4 \cdot 10^{10}$在最坏的情况下进行操作，远远超出了时间限制。 我们需要一些接近的东西$O(n \log n)$。 

有几种情况很容易被误解。 

考虑：```
3
1 1 1
```答案是1.我们可以保留单个元素并获得`[1]`，其第一个位置匹配。 粗心的解决方案可能会计算值 1 的所有出现次数并错误地返回 3。 

考虑：```
4
4 4 4 4
```答案是 1。保留所有元素只能在位置 4 处匹配一次。我们也可以保留单个元素，但它位于位置 1 处并且不再匹配。 删除后的索引很重要。 

考虑：```
5
2 3 4 5 6
```答案是 5。最初没有元素与其位置匹配，但保留整个数组会产生位置```
1 2 3 4 5
```反对价值观```
2 3 4 5 6
```仍然不匹配。 然而，如果我们考虑最终的子序列位置，每个元素都可以成为匹配项，因为第一个保留的元素成为位置 1，第二个元素成为位置 2，依此类推。 仅查看原始索引的解决方案会错过这一点。 

## 方法

 蛮力观点很简单。 每个最终数组都是原始数组的子序列，因此我们可以枚举所有子序列，计算它们的分数，然后
