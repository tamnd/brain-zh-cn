---
title: "CF 1418G - 三次出现"
description: "给定一个长度为 $n$ 的数组，我们想要计算有多少个连续的段具有以下属性：该段内出现的每个不同值恰好出现 3 次。 这个条件令人惊讶地受到限制。"
date: "2026-06-11T06:51:45+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "divide-and-conquer", "hashing", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1418
codeforces_index: "G"
codeforces_contest_name: "Educational Codeforces Round 95 (Rated for Div. 2)"
rating: 2500
weight: 1418
solve_time_s: 28
verified: false
draft: false
---

[CF 1418G - 三次出现](https://codeforces.com/problemset/problem/1418/G)

 **评分：** 2500
 **标签：** 数据结构、分而治之、哈希、两个指针
 **求解时间：** 28s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个长度的数组$n$，我们想要计算有多少个连续的段具有以下属性：该段内出现的每个不同值恰好出现三次。 

这个条件令人惊讶地受到限制。 如果某个数字在段内出现一次或两次，则该段无效。 如果出现四次，则该段也无效。 有效段仅包含频率全部等于 3 的值。 

数组长度可以达到$5 \cdot 10^5$。 二次算法将粗略地检查$2.5 \times 10^{11}$子数组，这在五秒的时间限制下是完全不可行的。 甚至$O(n\sqrt n)$在 Python 中会感到不舒服。 我们需要非常接近线性时间的东西。 

一些边缘情况很容易被错误处理。 

考虑```
3
1 1 1
```答案是```
1
```整个数组有效，因为唯一的值恰好出现了 3 次。 

现在考虑```
4
1 1 1 1
```答案是```
1
```只有前三个位置和后三个位置形成有效的子数组。 整个数组无效，因为频率变成了四。 任何仅仅检查长度能否被三整除的方法都会失败。 

另一个微妙的例子是```

```答案是```

```整个数组有效，因为这两个值都出现了 3 次。 小的
