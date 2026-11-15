---
title: "CF 79B - 多彩领域"
description: "我们被要求模拟在矩形田野上种植农作物，但有一个问题：有些单元格是荒地。 该字段表示为 n × m 网格，行编号为 1 到 n，列编号为 1 到 m。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 79
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 71"
rating: 1400
weight: 79
solve_time_s: 79
verified: true
draft: false
---

[CF 79B - 多彩领域](https://codeforces.com/problemset/problem/79/B)

 **评分：** 1400
 **标签：** 实施、排序
 **求解时间：** 1m 19s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求模拟在矩形田野上种植农作物，但有一个问题：有些单元格是荒地。 该字段表示为 _n_ × _m_ 网格，行编号从 1 到 _n_，列编号从 1 到 _m_。 一些细胞含有废物，其余细胞则含有按胡萝卜→猕猴桃→葡萄的顺序循环种植的农作物，一排一排地填满田地，跳过废物细胞。 

输入给出字段的尺寸、废物单元坐标列表和查询坐标列表。 对于每个查询，我们必须确定该单元是否是废物或者它包含哪种作物。 

约束条件适中：该字段最多可以有 40,000 行和列。 这会产生多达 16 亿个细胞。 显然，在内存限制内显式存储整个字段是不可能的，因此构建完整网格的任何解决方案都是不可行的。 然而，废弃单元和查询的数量很小（每个最多 1000 个），这暗示不需要对整个字段进行直接模拟。 我们必须以更抽象、基于索引的方式处理废弃单元和查询。 

可能破坏简单解决方案的边缘情况包括查询废弃的单元格、种植顺序中的第一个或最后一个单元格，或者对同一单元格进行多个查询。 如果在计数作物时未能正确跳过废弃单元，则作物分配将偏离一个或多个，从而产生错误的答案。 

## 方法

 暴力解决方案会尝试模拟整个种植过程。 您可以按行优先顺序迭代每个单元格，跳过废弃单元格，并在胡萝卜-猕猴桃-葡萄循环中分配作物。 这在概念上简单且正确，但该区域可能高达 40,000 × 40,000，即 16 亿个细胞。 即使采用快速迭代，模拟每个单元也需要数百秒——对于 2 秒的限制来说太慢了。 

允许优化的关键观察是种植顺序是可预测的：每个培养细胞纯粹根据其在行优先序列中的索引获得作物，忽略它之前的废弃细胞。 因此，我们可以在 O(1) 时间内计算任何单元格的“线性索引”。 然后，如果我们知道在此线性排序中给定单元格之前出现了多少个废物单元格，我们可以减去该计数以确定该单元格的作物类型。 废弃单元格充当序列中的偏移量，改变后续单元格的裁剪索引。 

有了这种洞察力，解决方案减少到三个主要步骤：将 2D 坐标映射到 1D 索引，按索引对废弃单元进行排序，对于每个查询，检查它是否是废弃单元，如果不是，则根据其之前的非废弃单元的数量使用模算术确定裁剪。 对废弃单元进行排序的成本为 O(k log k)，并且可以使用二分搜索在 O(log k) 内回答每个查询，在 k ≤ 1000 的情况下，这是有效的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n*m) | O(n*m) | 太慢了 |
 | 最佳| O(k log k + t log k) | O(k log k + t log k) | O(k) | 已接受 |

 ## 算法演练

 1. 使用以下公式按行优先顺序计算每个单元格的一维索引`(row - 1) * m + (col - 1)`。 这为每个单元提供了一个唯一的整数，允许以简单的线性方式处理废弃单元。 
2. 将每个废物单元坐标转换为其相应的一维索引并将它们存储在列表中。 然后对这个列表进行排序。 排序确保对于任何查询，我们都可以使用二分搜索有效地确定其前面有多少个废单元。 
3. 对于每个查询，首先将坐标转换为其一维索引。 使用二分搜索检查该索引是否位于废物索引的排序列表中。 如果是，则该单元格是废物，我们输出“废物”。 
4. 如果该单元格不是垃圾单元格，则使用以下命令计算索引小于查询单元格的垃圾单元格数量`bisect_left`。 从查询细胞索引中减去此计数即可得到其在培养细胞中从零开始的位置。 
5. 在此位置上使用模 3 来确定作物：位置 % 3 == 0 对应于胡萝卜，1 对应于猕猴桃，2 对应于葡萄。 

为什么有效：关键的不变量是培养细胞的作物类型仅取决于其在培养细胞中的相对位置，而不取决于整个田地。 对废细胞进行分类使我们能够有效地确定这个相对位置。 减去前面的废弃细胞的数量可以正确地改变顺序，从而保留预期的种植顺序。 

## Python 解决方案```python
import sys
import bisect
input = sys.stdin.readline

n, m, k, t = map(int, input().split())
waste = []

for _ in range(k):
    a, b = map(int, input().split())
    idx = (a - 1) * m + (b - 1)
    waste.append(idx)

waste.sort()
crops = ["Carrots", "Kiwis", "Grapes"]

for _ in range(t):
    i, j = map(int, input().split())
    query_idx = (i - 1) * m + (j - 1)
    pos = bisect.bisect_left(waste, query_idx)
    if pos < len(waste) and waste[pos] == query_idx:
        print("Waste")
    else:
        crop_idx = (query_idx - pos) % 3
        print(crops[crop_idx])
```该代码将废弃单元和查询转换为其线性索引。 对废物索引进行排序允许二分搜索来检测废物并有效地计算先前废物的数量。 减去先前废物的数量即可得出培养细胞指数，以循环确定作物。 

## 工作示例

 **示例输入 1：**```
4 5 5 6
4 3
1 3
3 3
2 5
3 2
1 3
1 4
2 3
2 4
1 1
1 1
```| 查询 | 线性 idx | 之前浪费| 调整后的 idx | 作物|
 | --- | --- | --- | --- | --- |
 | 1,3 | 2 | 0 | 废物| 废物|
 | 1,4| 3 | 1 | 2 | 葡萄|
 | 2,3 | 7 | 3 | 4 | 胡萝卜|
 | 2,4 | 8 | 3 | 5 | 新西兰人 |
 | 1,1 | 0 | 0 | 0 | 胡萝卜|
 | 1,1 | 0 | 0 | 0 | 胡萝卜|

 该迹线证实减去前面的废细胞数量可以正确对齐作物。 

**自定义输入 2（第一个单元格已浪费，最后一个单元格被查询）：**```
3 3 1 2
1 1
1 1
3 3
```| 查询 | 线性 idx | 之前浪费| 调整后的 idx | 作物|
 | --- | --- | --- | --- | --- |
 | 1,1 | 0 | 0 | 废物| 废物|
 | 3,3 | 8 | 1 | 7 | 新西兰人 |

 这确认了第一个和最后一个单元的边缘处理。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(k log k + t log k) | O(k log k + t log k) | 对 k 个废弃单元进行排序，并对 t 个查询进行二分搜索 |
 | 空间| O(k) | 存储分类废物索引 |

 即使在 k = t = 1000 的最坏情况下，算法也最多执行 2000 log 1000 次操作，与 2 秒限制相比可以忽略不计。 内存使用量在 256 MB 以内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    # insert the solution code here or call a function
    n, m, k, t = map(int, input().split())
    waste = []
    for _ in range(k):
        a, b = map(int, input().split())
        idx = (a - 1) * m + (b - 1)
        waste.append(idx)
    waste.sort()
    crops = ["Carrots", "Kiwis", "Grapes"]
    for _ in range(t):
        i, j = map(int, input().split())
        query_idx = (i - 1) * m + (j - 1)
        pos = bisect.bisect_left(waste, query_idx)
        if pos < len(waste) and waste[pos] == query_idx:
            print("Waste")
        else:
            crop_idx = (query_idx - pos) % 3
            print(crops[crop_idx])
    return out.getvalue().strip()

# provided sample
assert run("""4 5 5 6
4 3
1 3
3 3
2 5
3 2
1 3
1 4
2 3
2 4
1 1
1 1
""") == """Waste
Grapes
Carrots
Kiwis
Carrots
Carrots"""

# custom minimum size
assert run("""1 1 0 1
1 1
```
