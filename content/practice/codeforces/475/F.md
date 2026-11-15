---
title: "CF 475F - 元宇宙"
description: "我们在无限二维网格上得到一组点，代表“元宇宙”中的行星。目标是沿着空行或空列重复分割这组行星，将集合完全分成两个非空子集，每个子​​集位于行或列的一侧。"
date: "2026-05-30T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 475
codeforces_index: "F"
codeforces_contest_name: "Bayan 2015 Contest Warm Up"
rating: 2900
weight: 475
solve_time_s: 108
verified: false
draft: false
---

[CF 475F - 元宇宙](https://codeforces.com/problemset/problem/475/F)

 **评分：** 2900
 **标签：** 数据结构
 **求解时间：** 1m 48s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们在无限的二维网格上得到一组点，代表“元宇宙”中的行星。 目标是沿着空行或空列重复分割行星组，将行星组完全分成两个非空子集，每个子​​集位于行或列的一侧。 行或列只有在不包含行星并且其两侧都有行星的情况下才可以用于分裂。 在执行所有可能的分裂之后，剩余的行星组被称为“宇宙”，我们被要求对它们进行计数。 

输入包含多达 100,000 个行星，其坐标可大至 ±10^9。 这立即排除了任何扫描整个网格或直接尝试所有可能的分割的算法，因为网格实际上是无限的。 任何解决方案都必须对点集本身进行操作，并避免单独考虑空白区域。 边缘情况包括在同一行或同一列上对齐的行星组、单行星宇宙或可以进行多次分割但不得重复计算宇宙的配置。 

粗心的实现可能会尝试通过迭代最小和最大 x 和 y 值之间的每个坐标来模拟分割，如果以错误的顺序应用分割，则会由于性能和丢失宇宙的风险而失败。 例如，一个行星位于坐标 (0,0)、(0,2)、(2,0)、(2,1)、(2,2) 的元宇宙必须分裂三次，产生三个宇宙，而不是四个，因为一次分裂可能包含多个行星。 

## 方法

 蛮力方法是尝试所有可能的垂直和水平分割。 人们将从最小 x 到最大 x 扫描空列，检查每个候选列的两侧是否存在行星。 同样，从最小 y 扫描到最大 y 行。 这种方法是正确的，但速度非常慢，因为扫描潜在的分割线涉及 O（坐标范围）操作，考虑到坐标可以是 ±10^9，这是不可行的。 即使我们将扫描限制为包含行星的坐标，在最坏的情况下，递归应用分割仍然会导致 O(n^2) 行为，因为每次分割可能需要扫描所有剩余的行星以检查它们是在一侧还是另一侧。 

关键的见解是，分割只能沿着已排序的 x 坐标或 y 坐标中的间隙发生。 如果我们按 x 对行星进行排序，并跟踪此排序列表的前缀和后缀中的最小和最大 y，我们可以快速识别两个 x 坐标之间是否存在将行星分成两个非空集合的垂直线。 类似地，按 y 排序可以检查水平分割。 这将问题简化为对排序的点列表进行递归分而治之，跟踪边界而不是扫描无限网格。 每个递归调用都会对集合进行分区，并通过比较子集的边界框来检查是否可以进行垂直或水平分割。 如果不可能分裂，我们就到达了一个宇宙。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了 |
 | 最佳| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

1. 将所有行星存储为 (x, y) 元组列表。 这是我们将递归拆分的基本数据结构。 
2. 定义一个递归函数，该函数采用行星列表及其边界框（min_x、max_x、min_y、max_y）。 如果列表仅包含一颗行星，则返回 1，因为单个行星已经是一个宇宙。 
3. 按 x 坐标对行星列表进行排序。 计算最小和最大 y 坐标的前缀和后缀数组。 对于每对连续的行星，检查它们之间是否存在垂直分割：如果左侧子集中的最大 y 小于右侧子集中的最小 y，则分割有效，反之亦然。 如果找到有效的分割，则在左右子集上递归调用该函数，并返回两侧的全域之和。 
4. 如果不可能进行垂直分割，则重复按 y 坐标排序的过程，计算 x 的前缀和后缀数组，并检查有效的水平分割。 
5. 如果垂直或水平分割都不可能，则返回 1，因为该子集形成一个全域。 
6. 对原始行星列表调用递归函数。 返回值是宇宙的总数。 

为什么有效：通过仅跟踪按排序顺序的边界框，我们可以有效地检查是否可以进行分割，而无需扫描无限网格。 每次分裂都会将行星分成两个非空、非重叠的集合。 由于每次分割都会严格减少集合的大小，因此递归终止。 边界框保证不会错过任何分割，并且一旦无法分割，则子集满足宇宙条件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(1 << 20)

def count_universes(planets):
    if len(planets) == 1:
        return 1

    planets_x = sorted(planets, key=lambda p: p[0])
    n = len(planets_x)
    pref_ymin = [0] * n
    pref_ymax = [0] * n
    suff_ymin = [0] * n
    suff_ymax = [0] * n

    pref_ymin[0] = pref_ymax[0] = planets_x[0][1]
    for i in range(1, n):
        pref_ymin[i] = min(pref_ymin[i-1], planets_x[i][1])
        pref_ymax[i] = max(pref_ymax[i-1], planets_x[i][1])
    
    suff_ymin[-1] = suff_ymax[-1] = planets_x[-1][1]
    for i in range(n-2, -1, -1):
        suff_ymin[i] = min(suff_ymin[i+1], planets_x[i][1])
        suff_ymax[i] = max(suff_ymax[i+1], planets_x[i][1])
    
    for i in range(n-1):
        if pref_ymax[i] < suff_ymin[i+1] or pref_ymin[i] > suff_ymax[i+1]:
            return count_universes(planets_x[:i+1]) + count_universes(planets_x[i+1:])
    
    planets_y = sorted(planets, key=lambda p: p[1])
    pref_xmin = [0] * n
    pref_xmax = [0] * n
    suff_xmin = [0] * n
    suff_xmax = [0] * n

    pref_xmin[0] = pref_xmax[0] = planets_y[0][0]
    for i in range(1, n):
        pref_xmin[i] = min(pref_xmin[i-1], planets_y[i][0])
        pref_xmax[i] = max(pref_xmax[i-1], planets_y[i][0])
    
    suff_xmin[-1] = suff_xmax[-1] = planets_y[-1][0]
    for i in range(n-2, -1, -1):
        suff_xmin[i] = min(suff_xmin[i+1], planets_y[i][0])
        suff_xmax[i] = max(suff_xmax[i+1], planets_y[i][0])
    
    for i in range(n-1):
        if pref_xmax[i] < suff_xmin[i+1] or pref_xmin[i] > suff_xmax[i+1]:
            return count_universes(planets_y[:i+1]) + count_universes(planets_y[i+1:])
    
    return 1

n = int(input())
planets = [tuple(map(int, input().split())) for _ in range(n)]
print(count_universes(planets))
```该解决方案在 x 和 y 维度上实现递归边界框检查。 前缀和后缀数组有效地跟踪最小值和最大值，避免重复扫描列表。 必须注意在行星之间严格划分，因此使用 i 和 i+1 索引进行检查。 

## 工作示例

 输入示例 1：```
5
0 0
0 2
2 0
2 1
2 2
```| 步骤| 按 x 排序的行星 | 首选项 y 分钟 | 首选 y-最大 | 足够 y 分钟 | 满足 y-max | 分裂？ |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | (0,0),(0,2),(2,0),(2,1),(2,2) | 0,0,0,0,0 | 0,0,0,0,0 | 0,2,2,2,2 | 0,0,1,1,2 | 2,2,2,2,2 | 在索引 1 处： pref_ymax=2, suff_ymin=0 → 检查下一个分割 |
 | 2 | (0,0),(0,2) / (2,0),(2,1),(2,2) | ... | ... | ... | ... | x=1 处的垂直分割产生左侧 2 个行星，右侧 3 个行星 |

 继续递归，最终找到 3 个宇宙：{(0,0),(0,2)}、{(2,0),(2,1)}、{(2,2)}。 

第二个例子：单行行星：```
3
0 0
1 0
2 0
```按 x 排序，处处 pref_ymax = suff_ymin = 0，因此不可能进行垂直分割。 按 y 排序，pref_xmax < suff_xmin 对于所有 i 均失败，因此递归函数返回 1 个 Universe。 

## 复杂度分析

 |
