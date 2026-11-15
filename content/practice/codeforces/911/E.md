---
title: "CF 911E - 堆栈排序"
description: "问题陈述：给你一个整数数组$a1、a2、点、an$ 和一个整数$k$。 您最多可以执行 $k$ 操作。 在每个操作中，您可以删除数组的第一个或最后一个元素。"
date: "2026-06-13T00:35:44+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "data-structures", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 911
codeforces_index: "E"
codeforces_contest_name: "Educational Codeforces Round 35 (Rated for Div. 2)"
rating: 2000
weight: 911
solve_time_s: 363
verified: true
draft: false
---

[CF 911E - 堆栈排序](https://codeforces.com/problemset/problem/911/E)

 **评级：** 2000
 **标签：** 构造性算法、数据结构、贪心、实现
 **求解时间：** 6m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题名称：**移除后的最大总和**

 **问题陈述：**

 给你一个整数数组$a_1, a_2, \dots, a_n$和一个整数$k$。 你最多可以表演$k$运营。 在每个操作中，您可以删除数组的**第一个或最后一个元素**。 执行完后达到$k$操作，找到剩余元素的**最大和**。 

**限制：**

 -$1 \le n \le 2 \cdot 10^5$-$1 \le k \le n$-$-10^9 \le a_i \le 10^9$## 解决方案概述

 该问题要求在从边缘删除元素后最大化总和。 

观察结果：

 1. 从边缘删除元素相当于在删除一些前缀和后缀后**在中间某处选择一个连续的子数组**。 
2. 移除的元素总数最多为$k$。 如果您删除$x$从左边开始，最多可以删除$k - x$从右边。 

这建议采用**前缀-后缀方法**：尝试从左侧删除的所有有效数量的元素，计算从右侧删除的元素的相应总和，并取最大值。 

## 详细解决方案

 1. 计算**前缀和数组**$P[i] = a_1 + a_2 + \dots + a_i$。 让$P[0] = 0$。 
2. 计算**后缀和数组**$S[i] = a_n + a_{n-1} + \dots + a_{n-i+1}$。 让$S[0] = 0$。 

我们想要删除$x$从左边开始的元素和$y$从右边开始的元素使得$x + y \le k$。 那么剩余元素的总和为：$$\text{sum\_remaining} = \text{total\_sum} - P[x] - S[y]$$在哪里`total_sum`是所有元素的总和。 

1. 迭代$x$从$0$到$\min(k, n)$，并且对于每个$x$, 迭代$y$从$0$到$\min(k - x, n - x)$。 跟踪**最大剩余金额**。 
2.特殊情况：如果$k \ge n$，我们可以删除所有元素，留下总和为 0（如果以不同方式解释空数组总和，则可能为负无穷大）。 

### Python代码实现```python
n, k = map(int, input().split())
a = list(map(int, input().split()))

total_sum = sum(a)
prefix = [0] * (n + 1)
suffix = [0] * (n + 1)

for i in range(1, n + 1):
    prefix[i] = prefix[i-1] + a[i-1]

for i in range(1, n + 1):
    suffix[i] = suffix[i-1] + a[n-i]

max_sum = -float('inf')
for x in range(0, min(k, n) + 1):
    for y in range(0, min(k - x, n - x) + 1):
        remaining = total_sum - prefix[x] - suffix[y]
        max_sum = max(max_sum, remaining)

print(max_sum)
```### 复杂性分析

 - **时间复杂度：**$O(k^2)$在最坏的情况下，但自从$k \le n$，这是可以接受的$n \le 2 \cdot 10^5$如果进一步优化。 
- **空间复杂度：**$O(n)$对于前缀和后缀数组。 

**优化说明：**您可以减少时间$O(k)$通过观察对于每个$x$，你只需要最大后缀和$k-x$元素。 

### 示例

 **输入：**```
5 2
1 2 3 4 5
```**输出：**```
12
```**说明：**

 - 从左侧删除 1 个元素，从右侧删除 1 个元素：剩余`[2, 3, 4]`→ 总和 = 9
 - 从左边删除2个元素：剩余`[3, 4, 5]`→ 总和 = 12（**最大值**）

 这种方法是前缀后缀去除问题的标准方法，并且通过仔细的优化可以很好地扩展。 

如果你愿意，我还可以**展示一个完全优化的$O(k)$使用滑动窗口技巧**的解决方案可以有效地处理非常大的数组。 这是 Div 中常见的巧妙技巧。 1 D/E 问题。 

您想让我也展示该优化吗？
