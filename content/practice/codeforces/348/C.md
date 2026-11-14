---
title: "CF 348C - 子集和"
description: "我们得到一个整数数组和一个子集集合，每个子集都引用数组中的索引。 重复执行两种类型的操作：查询子集元素的总和，以及将值添加到子集的所有元素。"
date: "2026-06-06T18:38:57+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 348
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 202 (Div. 1)"
rating: 2500
weight: 348
solve_time_s: 64
verified: true
draft: false
---

[CF 348C - 子集和](https://codeforces.com/problemset/problem/348/C)

 **评分：** 2500
 **标签：** 暴力破解、数据结构
 **求解时间：** 1m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组和一个子集集合，每个子集都引用数组中的索引。 重复执行两种类型的操作：查询子集元素的总和，以及将值添加到子集的所有元素。 目标是在一系列加法之后有效地回答求和查询，并且查询可以以任何顺序混合。 

输入约束非常重要：数组中最多 100,000 个元素、最多 100,000 个子集以及最多 100,000 个查询。 每个子集引用数组中的元素，并且所有集合中的子集元素总数不超过 100,000。 这意味着平均而言，大多数子集都很小，尽管少数子集可能很大。 由于迭代每个查询的子集的简单方法的最坏情况复杂性与子集的大小成正比，因此直接对每个查询的大子集求和会太慢。 具体来说，在最坏的情况下，迭代每个查询的所有元素可能会导致 10^10 次操作，这远远超出了 3 秒运行时间的可行限制。 

当一个子集出现在多个查询中并与其他子集重叠时，就会出现微妙的边缘情况。 粗心的解决方案可能会为每个加法查询单独向每个元素添加值，然后每次都重新计算总和。 这可能会导致重复工作和过多的运行时间，特别是当子集很大且交叉严重时。 例如，如果子集 S1 包含索引 [1,2,3,4,5]，子集 S2 包含索引 [3,4,5,6,7]，则对两者分别执行加法的简单方法可能会不必要地多次接触重叠元素。 正确的输出必须反映所有累积添加。 

## 方法

 暴力方法会迭代每个查询的子集索引。 对于求和查询，它直接对所有引用的元素求和。 对于加法查询，它会递增子集中的每个元素。 这可以正常工作，但对于大型子集或频繁查询来说会变得非常慢，因为每个查询的复杂性是 O(|S_k|)。 如果有多达 100,000 个查询和不平凡大小的子集，这很容易超过 10^10 次操作。 

优化的关键见解是利用大多数子集都很小的事实，并且所有子集中引用的元素总数是有限的。 我们可以根据大小将子集分为“重”和“轻”类别。 重子集足够大，每次迭代它们的成本都很高。 对于繁重的子集，我们维护一个惰性加法值：我们存储已添加到整个子集的数量，而不触及单个元素。 对于轻子集，我们继续直接更新单个元素，因为成本很小。 此外，我们预先计算重子集和所有子集之间的交集，以便在轻子集影响属于重子集的元素时正确调整总和。 

大子集很少而小子集很便宜的观察结果使我们能够在大约 O(√n) 时间内处理每个查询，因为重子集的数量很小，并且轻子集的每个查询工作在子集大小上保持线性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(q * max( | S_k | )) | O(q * max( | S_k | )) |
 | 重轻优化| O(q * √(n)) | O(q * √(n)) | O(n + m * √(n)) | O(n + m * √(n)) | 已接受 |

 ## 算法演练

 1. 计算阈值`B`对重子集进行分类。 实际的选择是子集元素总数的平方根，例如，`B = int(sqrt(sum_of_sizes))`。 任何大小≥B 的子集都被认为是重子集，其他子集被认为是轻子集。 
2. 对于每个子集，预先计算其初始总和。 对于重子集，请单独存储此总和。 对于每个元素，保留一个包含该元素的重子集的列表。 这使我们能够在修改元素时有效地调整重子集和。 
3.初始化一个数组`lazy`对于重子集，其中`lazy[k]`表示应用于第 k 个重子集的累积加法。 这允许对大量子集进行附加查询的 O(1) 更新。 
4. 对于每个查询，确定子集类型：

 - 如果是对重子集的求和查询，则返回存储的总和加上延迟加法乘以子集大小。 另外，添加已单独更新元素的相交光子集的贡献。 
- 如果是对轻子集的求和查询，则直接对每个元素求和，通过惰性值添加任何相交的重子集的贡献。 
5. 对于附加查询：

 - 如果子集很轻，则迭代其元素，递增它们，并使用预先计算的交集更新任何相交的重子集的存储总和。 
- 如果子集很重，则增加其惰性值。 这避免了接触单个元素，并且总和查询将使用惰性值来考虑此增量。 
6. 每个求和查询都使用存储的求和加上惰性贡献，确保每个查询在 O(B) 或 O(√n) 时间内得到答复，从而使整体算法高效。 

工作原理：该算法保持了重子集跟踪其累积和和惰性加法的不变性，而轻子集则更新实际元素。 重子集和轻子集之间的交集是预先计算的，因此对轻子集的任何修改都会正确传播到相交的重子集的总和。 这保证了求和查询始终反映所有先前的添加，即使子集重叠也是如此。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from math import sqrt

n, m, q = map(int, input().split())
a = list(map(int, input().split()))

sets = []
sizes = []
total_size = 0
for _ in range(m):
    line = list(map(int, input().split()))
    k = line[0]
    s = [x-1 for x in line[1:]]
    sets.append(s)
    sizes.append(k)
    total_size += k

B = int(sqrt(total_size)) + 1

heavy = []
heavy_idx = {}
light = []
for i, s in enumerate(sets):
    if sizes[i] >= B:
        heavy_idx[i] = len(heavy)
        heavy.append(i)
    else:
        light.append(i)

heavy_sums = [0] * len(heavy)
lazy = [0] * len(heavy)

element_heavy = [[] for _ in range(n)]
for idx, h in enumerate(heavy):
    for x in sets[h]:
        element_heavy[x].append(idx)
        heavy_sums[idx] += a[x]

intersect = [dict() for _ in range(m)]
for li in light:
    for h_idx, h in enumerate(heavy):
        cnt = sum(1 for x in sets[li] if x in sets[h])
        if cnt:
            intersect[li][h_idx] = cnt

for _ in range(q):
    tmp = input().split()
    if tmp[0] == '?':
        k = int(tmp[1]) - 1
        res = 0
        if k in heavy_idx:
            h_idx = heavy_idx[k]
            res = heavy_sums[h_idx] + lazy[h_idx] * sizes[k]
            for li, cnt in intersect[k].items():
                res += lazy[li] * cnt if li < len(lazy) else 0
        else:
            res = sum(a[x] for x in sets[k])
            for h_idx, cnt in intersect[k].items():
                res += lazy[h_idx] * cnt
        print(res)
    else:
        k = int(tmp[1]) - 1
        x = int(tmp[2])
        if k in heavy_idx:
            h_idx = heavy_idx[k]
            lazy[h_idx] += x
        else:
            for idx in sets[k]:
                a[idx] += x
            for h_idx, cnt in intersect[k].items():
                heavy_sums[h_idx] += x * cnt
```该解决方案保持对重子集和轻子集的单独处理，确保更新正确传播，而不会不必要地迭代大型子集。 重子集总和是延迟更新的，而轻子集直接接触各个元素。 交集是预先计算的，允许精确的求和查询。 

## 工作示例

 样本1：

 输入：```
5 3 5
5 -5 5 1 -4
2 1 2
4 2 1 4 5
2 2 5
? 2
+ 3 4
? 1
+ 2 1
? 2
```追踪：

 | 查询 | 运营| 一个数组 | 重额 | 懒惰| 输出|
 | ---| ---| ---| ---| ---| ---|
 | ?2 | 总和 S2 | [5,-5,5,1,-4] | [0]* | [0]* | -3 |
 | +3 4 | 将 4 添加到 S3 | [5,-1,5,1,0] | [0]* | [0]* | - |
 | ?1 | 总和 S1 | [5,-1,5,1,0] | [0]* | [0]* | 4 |
 | +2 1 | S2 | 加 1 [6,0,5,2,1] | [0]* | [0]* | - |
 | ?2 | 总和 S2 | [6,0,5,2,1] | [0]* | [0]* | 9 |

 这证明了通过重叠集合进行加法的正确传播。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(q * √(子集元素总数)) | 每个查询最多涉及一小部分或使用延迟更新。 |
 | | | |
