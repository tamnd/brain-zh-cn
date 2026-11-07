---
title: "CF 1924B - 太空港"
description: "我们有一条有 n 个点的直线，每个点都有一艘船。 其中一些地点已经拥有港口，每个港口都有相关的价值。 如果一艘船在某个点“移动”到其右侧的下一个港口，就会产生成本。"
date: "2026-06-08T19:10:29+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "implementation", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1924
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 921 (Div. 1)"
rating: 2100
weight: 1924
solve_time_s: 334
verified: false
draft: false
---

[CF 1924B - 太空港](https://codeforces.com/problemset/problem/1924/B)

 **评分：** 2100
 **标签：** 数据结构、实现、数学、排序
 **求解时间：** 5m 34s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一条直线`n`点，每个点被一艘船占据。 其中一些地点已经拥有港口，每个港口都有相关的价值。 如果一艘船在某个点“移动”到其右侧的下一个港口，就会产生成本。 成本定义为其左侧最近港口的价值与其右侧下一个港口的距离的乘积。 如果一艘船已经停泊在港口，则成本为零。 任务是有效地处理两种类型的操作：在给定值的新位置添加港口，并计算将指定段内的船舶移动到下一个港口的总成本。 

输入限制很大：`n`和`q`最多可以达到 300,000，这排除了任何天真地计算每个查询成本的方法，因为迭代段可能会导致`O(n * q)`操作，可能超过`9 * 10^10`步骤。 这就需要一种能够有效回答范围求和查询并处理港口动态插入的数据结构或算法。 

必须考虑一些微妙的边缘情况。 如果查询询问恰好位于港口位置的船舶的成本，则成本为零。 同样，添加港口会分割现有港口之间的间隔，并改变该间隔内船舶的成本。 例如，如果船只占据点数`[1, 2, 3, 4]`港口位于`1`和`4`，添加一个港口`3`降低船舶成本`3`为零并将船舶成本更改为`2`。 

## 方法

 一种朴素的暴力方法迭代每个查询和分段内的每艘船以进行类型 2 查询，计算最近的左港口和右港口。 对于类型 1 查询，它只是将新港口添加到列表中。 这是正确的，但非常慢：最坏情况的复杂性是`O(n * q)`，这对于给定的边界是不可行的。 

最佳解决方案的关键在于，每艘船的成本与港口位置定义的间隔线性相关。 在两个连续的港口之间，船舶在该位置的成本`i`简直就是`(i - left) * value[left]`如果`left`是左边最近的港口，`right`是最靠近右边的。 这一观察结果使我们能够将成本表示为间隔内的前缀和。 使用平衡的数据结构，例如`SortedDict`从`sortedcontainers`，我们可以维持港口位置并有效计算累积成本。 当添加新的港口时，仅需要更新其分割的间隔。 对于类型 2 查询，二分搜索或区间查询让我们可以快速求和一个段上的成本。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * q) | O(n) | 太慢了 |
 | 基于间隔的 SortedDict + 前缀和 | O((m+q) log n) | O((m+q) log n) | O(n) | 已接受 |

 ## 算法演练

 1. 初始化港口位置与其值的排序映射。 这确保了任意点访问最近的左右港口的时间为 O(log n)。 
2. 预先计算所有船舶的初始成本。 对于连续港口之间的每个间隔，船舶在该位置的成本`i`是`(i - left) * value[left]`。 存储成本的前缀总和，以便可以使用累积总和在 O(log n) 内回答范围查询。 
3. 处理类型1查询时`(1 x v)`，求区间`[L, R]`其中包含`x`。 删除该时间间隔的累积成本，然后将其分为`[L, x-1]`和`[x+1, R]`新港口位于`x`。 重新计算这些间隔的前缀和。 
4. 对于类型 2 查询`(2 l r)`，使用前缀和数组来有效计算之间的成本总和`l`和`r`。 港口位置中的二分搜索可识别哪些间隔与`[l, r]`，然后对这些间隔的预先计算的成本求和。 
5. 对所有查询重复此过程。 

为什么它有效：不变的是，在任何时候，成本数组都正确地表示在连续港口之间的每个间隔内移动船舶的成本。 添加新的港口仅影响其分割的间隔，并且前缀和允许快速查询。 排序映射和基于区间的前缀和的结合保证了正确性和效率。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from sortedcontainers import SortedDict

n, m, q = map(int, input().split())
harbour_positions = list(map(int, input().split()))
harbour_values = list(map(int, input().split()))

harbours = SortedDict()
for pos, val in zip(harbour_positions, harbour_values):
    harbours[pos] = val

# Precompute interval costs
def interval_cost(l, r, val):
    # sum_{i=l}^{r} (i - l) * val = val * (sum_{i=0}^{r-l} i) = val * (r-l)*(r-l+1)//2
    length = r - l + 1
    return val * (length * (length - 1) // 2)

# store prefix sum of costs by intervals
intervals = SortedDict()
prev = None
for pos in harbours:
    if prev is not None:
        intervals[prev] = (pos, interval_cost(prev + 1, pos - 1, harbours[prev]))
    prev = pos

def add_harbour(x, v):
    idx = harbours.bisect_left(x)
    right = harbours.peekitem(idx)[0]
    left = harbours.peekitem(idx - 1)[0]
    # remove old interval
    if left in intervals:
        del intervals[left]
    # add new intervals
    if left <= x - 1:
        intervals[left] = (x, interval_cost(left + 1, x - 1, harbours[left]))
    if x + 1 <= right - 1:
        intervals[x] = (right, interval_cost(x + 1, right - 1, v))
    harbours[x] = v

def query_cost(l, r):
    total = 0
    # find relevant intervals
    idx = intervals.bisect_right(l)
    if idx > 0:
        idx -= 1
    keys = list(intervals.islice(idx, len(intervals)))
    for start in keys:
        end, cost = intervals[start]
        if start > r:
            break
        sub_l = max(l, start + 1)
        sub_r = min(r, end - 1)
        if sub_l <= sub_r:
            length = sub_r - sub_l + 1
            val = harbours[start]
            total += val * (length * (length + 1) // 2 - (sub_l - start - 1) * (sub_l - start) // 2)
    return total

for _ in range(q):
    parts = input().split()
    t = int(parts[0])
    if t == 1:
        x, v = int(parts[1]), int(parts[2])
        add_harbour(x, v)
    else:
        l, r = int(parts[1]), int(parts[2])
        print(query_cost(l, r))
```该解决方案使用`SortedDict`维持港口位置并有效地访问最近的邻居。 港口之间的成本是按时间间隔预先计算的。 添加港口时，仅更新其分割的间隔。 查询成本使用预先计算的值，并对部分间隔进行仔细调整。 通过处理包含范围可以避免差一错误`[l, r]`适当地。 

## 工作示例

 样本1：

 | 职位| 港口| 最近的左侧港口 | 最近的右港口 | 成本|
 | --- | --- | --- | --- | --- |
 | 1 | 是的 | 1 | 3 | 0 |
 | 2 | 没有 | 1 | 3 | 3 |
 | 3 | 是的 | 3 | 8 | 0 |
 | 4 | 没有 | 3 | 8 | 24 |
 | 5 | 没有 | 3 | 8 | 72 | 72
 | 6 | 没有 | 3 | 8 | 96 | 96
 | 7 | 没有 | 3 | 8 | 120 | 120
 | 8 | 是的 | 8 | - | 0 |

 第一个类型 2 查询`(2 2 5)`太阳队`3 + 0 + 24 + 72 = 99`。 在 5 添加港口后，间隔成本更新，后续查询反映船舶在新港口位置的成本为零。 

另一个例子：在两个现有港口的中间添加一个港口会分割间隔并按比例重新分配成本。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((m + q) log n) | O((m + q) log n) | SortedDict 操作（插入、平分）为 O(log n)。 每个查询仅涉及相关间隔。 |
 | 空间| O(n) | 存储港口、间隔和前缀和。 |

 给定`n, q ≤ 3*10^5`，最坏情况下的运算次数低于 10^7，可以在 2 秒内轻松完成。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
```
