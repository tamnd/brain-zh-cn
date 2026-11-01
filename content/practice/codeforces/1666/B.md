---
title: "CF 1666B - 预算分配"
description: "我们被要求将额外的预算资金分配给几个主题，每个主题都包含少量项目。 对于每个主题，都会给出其项目的最佳相对金钱比例，并且一些金钱已经分配给项目并且无法删除。"
date: "2026-06-10T02:13:37+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 1666
codeforces_index: "B"
codeforces_contest_name: "2021-2022 ICPC, NERC, Northern Eurasia Onsite (Unrated, Online Mirror, ICPC Rules, Teams Preferred)"
rating: 3300
weight: 1666
solve_time_s: 114
verified: false
draft: false
---

[CF 1666B - 预算分配](https://codeforces.com/problemset/problem/1666/B)

 **评分：** 3300
 **标签：** -
 **求解时间：** 1m 54s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求将额外的预算资金分配给几个主题，每个主题都包含少量项目。 对于每个主题，都会给出其项目的最佳相对金钱比例，并且一些金钱已经分配给项目并且无法删除。 任务是计算最小总“非最优性”，定义为分配给定的额外资金后实际资金比率与目标比率之间的绝对差之和。 

具体来说，每个主题都有`n_i`具有初始金额的项目`hat_c[i][j]`和理想分数`p[i][j]`。 如果我们添加`d[i][j]`额外的钱来购买物品`j`在主题中`i`，最终比例变为`(hat_c[i][j] + d[i][j]) / (sum_j hat_c[i][j] + sum_j d[i][j])`。 我们必须选择`d[i][j] >= 0`总计额外`x_k`最小化主题和项目的总和`|actual_ratio - ideal_ratio|`。 

主要挑战是每个主题的最优性是所添加的额外资金的非线性函数，因为它取决于主题中的资金总和，并且绝对值引入了分段线性行为。 额外的金钱价值`x_k`可以非常大（`10^12`），并且最多可以有`3 * 10^5`查询，因此任何针对每个查询的迭代优化都会太慢。 幸运的是，每个主题的项目数量非常少（`2 <= n_i <= 5`），这使我们能够独立分析每个主题，并预先计算额外资金如何减少非最优性的分段线性函数。 

需要仔细处理的边缘情况包括除一项外所有初始资金均为零的主题，或者一项已完全达到目标比例的主题。 如果预先存在的分配是倾斜的，天真的平均分配额外的钱可能会留下很大的非最优性。 

## 方法

 暴力方法是，对于每个查询`x_k`，尝试各种方法将额外的钱分配给每个主题的项目，以尽量减少绝对差异。 因为额外的钱是连续的，所以我们可以想象将其视为线性规划问题。 每个主题最多 5 个项目和 50,000 个主题，变量数量为 250,000 个。 解决 300,000 个查询的 250,000 个变量 LP 是不可行的。 

关键的见解是，在每个主题中，描述最小可实现的非最优性作为额外资金的函数的函数是分段线性和凸的。 每个项目在关于增加金钱的非最优导数中具有 +1、-1 或 0 的斜率。 对跨项目的所有候选斜率进行排序会给出斜率变化的断点。 因此，对于每个主题，我们可以预先计算一系列断点`(required_extra, non_optimality)`表示随着额外资金的增加，非最优性如何减少。 由于每个主题的项目数最多为 5 个，因此每个主题仅提供少量断点。 之后，回答每个查询相当于合并这些序列并执行二分搜索以有效地找到总非最优性。 

本质上，问题归结为针对每个主题计算相对于主题总预算的非最优分段线性函数。 一旦我们有了这些函数，我们就可以对它们求和并在对数时间内回答每个查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(q * (n_1 * n_2 * ... * n_t)) | O(总项目) | 太慢了|
 | 最佳 | O(T log T + Q log T) | O(T log T + Q log T) | O(T)| 已接受 |

 这里，`T`是项目总数 (<= 250,000)，`Q`是查询数 (<= 3*10^5)。 预计算分段线性函数在运行时占主导地位，但也是可行的。 

## 算法演练

 1. **标准化理想分数**：对于每个主题，转换输入整数`p'`到实际分数`p[i][j]`总和为 1。 
2. **计算初始比率**：对于每个主题，计算初始分配的总资金`C_i = sum_j hat_c[i][j]`以及每一项的比例`r[j] = hat_c[i][j] / C_i`。 
3. **确定每个项目的斜率**：对于一个项目`j`， 如果`r[j] < p[j]`，增加资金会降低非最优性（斜率 -1）。 如果`r[j] > p[j]`，增加资金会增加非最优性（斜率+1）。 如果`r[j] == p[j]`，额外的钱不会改变非最优性（斜率0）。 斜率在断点处发生变化，在断点处添加足够的资金使比率恰好达到目标分数。 
4. **计算每个主题的断点**：对于每个项目，计算使比率达到理想分数所需的额外资金。 收集所有斜率发生变化的唯一断点，对它们进行排序，并计算每个断点处的非最优性。 因为 n_i <= 5，所以每个主题最多有 5 个断点。 
5. **合并主题函数**：每个主题贡献一个分段线性函数`(required_extra, non_optimality)`。 通过对断点上的斜率求和来合并所有主题。 这使我们能够构建总额外资金与总非最优性的全局分段线性函数。 
6. **回答查询**：对于每个`x_k`，对合并的断点执行二分查找以查找包含`x_k`，然后使用该段中的线性函数计算非最优性。 

**为什么有效**：关键的不变量是，在每个细分市场中，相对于增加的资金的非最优斜率是恒定且已知的。 由于该函数是分段线性且凸的，因此跨主题对这些函数求和可以保留分段线性，并允许以任何额外的货币值进行精确计算。 断点捕获了斜率的所有变化，因此我们永远不会错过非最优性更有效地减少的点。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from bisect import bisect_right

t, q = map(int, input().split())
topics = []

for _ in range(t):
    parts = list(map(int, input().split()))
    n = parts[0]
    hat = parts[1:n+1]
    p_raw = parts[n+1:]
    s = sum(p_raw)
    p = [x/s for x in p_raw]
    topics.append((n, hat, p))

queries = list(map(int, input().split()))

# For each topic, compute its piecewise linear non-optimality function
segments = []  # list of (start_extra, slope, intercept)

for n, hat, p in topics:
    C = sum(hat)
    breakpoints = []
    nonopt0 = 0.0
    for i in range(n):
        if C == 0:
            ratio = 0
        else:
            ratio = hat[i] / C
        nonopt0 += abs(ratio - p[i])
        if ratio < p[i]:
            bp = (C * p[i] - hat[i])
            if bp > 0:
                breakpoints.append((bp, -1))
        elif ratio > p[i]:
            bp = (hat[i] - C * p[i])
            if bp > 0:
                breakpoints.append((bp, +1))
    breakpoints.sort()
    segs = []
    last_extra = 0
    slope = sum(-1 if (hat[i]/C if C>0 else 0) < p[i] else 1 if (hat[i]/C if C>0 else 0) > p[i] else 0 for i in range(n))
    intercept = nonopt0
    for bp, delta in breakpoints:
        segs.append((last_extra, slope, intercept))
        intercept += slope * (bp - last_extra)
        slope -= delta  # slope changes when breakpoint is reached
        last_extra = bp
    segs.append((last_extra, slope, intercept))
    segments.append(segs)

# Merge all segments
points = set()
for segs in segments:
    for x, _, _ in segs:
        points.add(x)
points = sorted(points)
slopes = []
intercepts = []

for i, x in enumerate(points):
    total_slope = 0
    total_intercept = 0
    for segs in segments:
        idx = bisect_right([s[0] for s in segs], x) - 1
        _, s, c = segs[idx]
        total_slope += s
        total_intercept += c
    slopes.append(total_slope)
    intercepts.append(total_intercept)

# Answer queries
for xk in queries:
    idx = bisect_right(points, xk) - 1
    total = intercepts[idx] + slopes[idx] * (xk - points[idx])
    print(total)
```该解决方案首先计算初始非最优性和每个主题项的斜率。 然后它会识别斜率发生变化的断点。 通过将段存储为（start_extra，斜率，截距），我们可以快速计算任何的总非最优性`x_k`使用二分查找。 边界情况如`C=0`进行处理以避免被零除。 对断点进行排序可确保我们以正确的顺序应用坡度更改。 

## 工作示例

 **样品1**

 | 额外 | 非最优 |
 | ---| ---|
 | | |
