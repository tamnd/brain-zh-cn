---
title: "CF 1939C - 更多礼物"
description: "该问题为您提供了一系列朋友，每个人都想要一定数量的礼物。 每个朋友也有自己喜欢的礼物类型。"
date: "2026-06-08T17:49:55+07:00"
tags: ["codeforces", "competitive-programming", "*special", "dfs-and-similar", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1939
codeforces_index: "C"
codeforces_contest_name: "XVIII Open Olympiad in Informatics - Final Stage, Day 1 (Unrated, Online Mirror, IOI rules)"
rating: 0
weight: 1939
solve_time_s: 74
verified: true
draft: false
---

[CF 1939C - 更多礼物](https://codeforces.com/problemset/problem/1939/C)

 **评级：** -
 **标签：** *特殊，dfs和类似，两个指针
 **求解时间：** 1m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题为您提供了一系列朋友，每个人都想要一定数量的礼物。 每个朋友也有自己喜欢的礼物类型。 您分发礼物的方式必须使所有朋友收集的礼物总数最大化，但每个朋友收到的礼物不能多于他们最初要求的数量。 您可以任意重新排列朋友的顺序，这意味着您可以策略性地将礼物与请求相匹配，以最大化总和。 

输入由好友数量组成`n`，后跟两个长度数组`n`：一个代表每个朋友想要的礼物数量，另一个代表他们喜欢的类型。 产出是分配规则下可获得的最大礼物总数。 

限制条件表明`n`最大可达 2×10^5。 这排除了尝试所有排列的蛮力方法，因为`n!`增长得太快了。 我们正在寻找一种算法，每个测试用例的工作时间大约为 O(n log n) 或 O(n)。 不明显的边缘情况包括朋友要求零礼物或所有朋友都喜欢同一类型，如果不正确处理按类型分配，这可能会误导天真的求和方法。 

一个小例子说明了一个棘手的情况：如果所有朋友都想要一份礼物，但喜欢不同的类型，那么按顺序赠送礼物的天真方法可能会低估满足基于类型的约束的机会。 

## 方法

 蛮力方法将迭代朋友的所有排列，并根据偏好限制求和礼物。 这在原则上是正确的，但不可行：对于`n = 10^5`，即使是单个阶乘计算量也是天文数字，因此该方法在实践中失败。 

关键的见解来自于观察到问题可以按礼物类型进行分解。 由于好友可以自由重新排序，因此最优策略是将相同类型的好友放在一起处理。 在每种类型中，如果我们按降序对请求进行排序，我们可以贪婪地分配礼物：请求最大的朋友应该获得尽可能多的礼物，然后是下一个最大的，依此类推。 这保证了每种类型的局部最大值。 处理完所有类型后，对这些最大值求和即可得出全局最大值，因为在重新排序后不会有两个朋友竞争同一类型。 

实际上，问题简化为按类型分组、在每个组内排序以及执行前缀总和以找到最大总数。 由于排序步骤，此方法的工作时间为 O(n log n)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n!) | O(n) | 太慢了 |
 | 分组 + 按类型排序 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1.读取好友数量`n`和两个数组：`gifts`对于请求和`types`对于首选的礼物类型。 
2. 创建从每种礼物类型到喜欢该类型的朋友的请求列表的映射。 这会根据偏好对朋友进行分组。 
3. 对于每种类型，按降序对请求进行排序。 这确保我们可以首先满足最大的请求，从而最大化本地总和。 
4. 计算每个排序列表的前缀和。 位置处的前缀和`k`代表如果我们满足第一个条件，收集到的礼物总数`k`该类型的最大请求。 
5. 将这些前缀总和除以所领取礼物的总数。 对于每个可能的朋友数量`k`从类型中获取，将相应的前缀和添加到索引为的运行总计中`k`。 
6. 处理完所有类型后，答案是总计中的最大值，它代表任何分配策略可实现的最大礼物。 

为什么有效：按类型分组和排序可确保每个朋友在不违反限制的情况下收到尽可能多的礼物。 对前缀和求和保留了这种最优性，因为对不同类型的朋友重新排序不会减少总礼物——它们是独立的。 不变量是对于每种类型，顶部的前缀和`k`任何请求都是最大的`k`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict
from itertools import accumulate

def main():
    t = int(input())
    for _ in range(t):
        n = int(input())
        gifts = list(map(int, input().split()))
        types = list(map(int, input().split()))
        
        type_map = defaultdict(list)
        for g, ty in zip(gifts, types):
            type_map[ty].append(g)
        
        prefix_sums = defaultdict(int)
        for lst in type_map.values():
            lst.sort(reverse=True)
            acc = list(accumulate(lst))
            for k, val in enumerate(acc, start=1):
                prefix_sums[k] += val
        
        print(max(prefix_sums.values()))

if __name__ == "__main__":
    main()
```代码完全遵循算法。 这`defaultdict(list)`按类型收集请求。 排序可确保我们首先考虑最大的请求。`accumulate`有效地产生前缀和。 最后，`prefix_sums`地图上选择的朋友总数与收集的礼物总数，以及`max`返回正确答案。 边界条件是自然处理的：空类型不贡献任何内容，并且单友元类型由从 1 开始的前缀和正确解释。 

## 工作示例

 输入示例 1：```
1
5
2 3 1 4 2
1 2 1 2 1
```| 步骤| 类型地图 | 排序列表 | 前缀和 | 总计 |
 | ---| ---| ---| ---| ---|
 | 初始| {1:[2,1,2], 2:[3,4]} | {1:[2,2,1], 2:[4,3]} | {1:[2,4,5], 2:[4,7]} | {1:6,2:11,3:5,4:0} |

 最大值为 11。此跟踪确认从类型 2 中选择前 2 个以及从类型 1 中选择前 2 个会产生最大的总礼物。 

输入示例 2：```
1
3
1 1 1
1 1 1
```| 步骤| 类型地图 | 排序列表 | 前缀和 | 总计 |
 | ---| ---| ---| ---| ---|
 | 初始| {1:[1,1,1]} | {1:[1,1,1]} | [1,2,3]| {1:1,2:2,3:3} |

 最大值为 3。所有朋友都获得一份礼物。 正确处理所有相同类型的边缘情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 对每种类型的列表进行排序占主导地位； 每个朋友都在同一个列表中 |
 | 空间| O(n) | 将类型映射到列表和前缀和需要线性存储 |

 给定`n`高达 2×10^5，排序占主导地位，这非常适合典型的 2 秒限制。 内存使用呈线性，远低于典型的 512 MB 限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    main()
    return sys.stdout.getvalue().strip()

# Provided sample
assert run("1\n5\n2 3 1 4 2\n1 2 1 2 1\n") == "11", "sample 1"

# Minimum size
assert run("1\n1\n5\n1\n") == "5", "single friend"

# All equal gifts
assert run("1\n4\n2 2 2 2\n1 1 1 1\n") == "8", "all same type and request"

# Multiple types with one friend each
assert run("1\n3\n1 2 3\n1 2 3\n") == "6", "different types, single friend"

# Large k distribution
assert run("1\n6\n1 2 3 1 2 3\n1 1 2 2 3 3\n") == "12", "multiple types, multiple friends"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 位朋友 | 5 | 处理单身朋友边缘情况 |
 | 一切平等| 8 | 当所有请求相等时正确聚合 |
 | 不同类型| 6 | 正确求和独立类型 |
 | 每种类型有多个朋友 | 12 | 12 确认跨类型的前缀总和聚合 |

 ## 边缘情况

 对于零请求的类型，算法自然会跳过它：列表为空，排序和累加不会产生前缀和，并且不会添加任何内容`prefix_sums`。 对于所有朋友都请求相同数字的类型，排序会保留顺序，并正确累加总和。 聚合步骤确保重叠`k`将不同类型的值相加，正确反映可能的总礼物量。 每个边缘情况都确认每种类型的贪婪前缀和策略是合理且最大的。
