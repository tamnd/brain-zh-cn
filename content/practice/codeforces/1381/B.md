---
title: "CF 1381B - 取消合并"
description: "我们得到了大小为 $2n$ 的排列。 任务是决定我们是否可以将数字分成两个不相交的序列$a$和$b$，每个序列的长度为$n$，这样，如果我们从$a$和$b$的头部开始重复模拟特定的“双指针合并”过程，我们......"
date: "2026-06-16T13:47:59+07:00"
tags: ["codeforces", "competitive-programming", "dp"]
categories: ["algorithms"]
codeforces_contest: 1381
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 658 (Div. 1)"
rating: 1800
weight: 1381
solve_time_s: 88
verified: false
draft: false
---

[CF 1381B - 取消合并](https://codeforces.com/problemset/problem/1381/B)

 **评分：** 1800
 **标签：** dp
 **求解时间：** 1m 28s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了大小的排列$2n$。 任务是决定我们是否可以将数字分成两个不相交的序列$a$和$b$，每个长度$n$，这样如果我们从头开始重复模拟一个特定的“双指针合并”过程$a$和$b$，我们精确地恢复给定的排列。 

合并过程一次是确定性的$a$和$b$是固定的：在每一步我们都会比较当前前面的元素并始终采用较小的元素。 这意味着最终的序列完全由元素出现的相对顺序决定$a$和$b$，而不是任何选择的自由。 

因此，真正的问题不是模拟前向合并，而是我们是否可以对两个有效序列进行逆向工程，这两个序列在​​贪婪比较下的交错会产生目标排列。 

在非常重要的方面，限制很小。 每个测试都有$n \le 2000$和总和$n$最多也是$2000$。 这立即排除了比粗略更糟糕的情况$O(n^2)$per test, and strongly suggests that we should be thinking in terms of dynamic programming over positions or over splits, rather than factorial or exponential constructions.

 一种天真的方法是尝试将每个元素分配给任一元素的所有方法$a$或者$b$，但那就是$2^{2n}$，这是完全不可行的。 Even trying to simulate validity after assignment is still exponential.

 A more subtle failure case appears when we try greedy assignment based on local comparisons. 由于合并规则取决于每个动态演变的数组的_front_，因此任何忽略未来约束的贪婪分配都将破坏早期小元素错误地“强制”未来结构的排列。 例如，在错误的数组中过早放置的少量数字可能会阻止以后所需的比较，从而即使前缀看起来一致，也无法进行有效的分割。 

## 方法

 The brute-force idea is to assign each element of the permutation to either$a$或者$b$，确保双方都准确接收$n$元素。 对于每个分配，我们模拟合并过程是否重现排列。 这需要维护两个队列并反复比较它们的前面，这会花费$O(n)$每个模拟。 由于有$\binom{2n}{n}$任务的总复杂度呈指数级增长，远远超出任何限制。 

关键的观察是合并过程不依赖于绝对标签，而是依赖于前缀结构引起的相对排序约束。 在重建过程中的任何时刻，重要的是哪些元素仍然是两个阵列的“活动前沿”。 这表明，而不是构建$a$和$b$直接，我们可以处理排列并决定如何分配每个前缀元素，同时保持可能性
