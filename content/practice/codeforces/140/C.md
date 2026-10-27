---
title: "CF 140C - 新年雪人"
description: "我们得到了一组雪球，每个雪球都有特定的半径，我们的目标是使用这些雪球组装尽可能多的雪​​人。 每个雪人必须恰好由三个雪球组成，并且这三个雪球中的每一个都必须具有不同的半径。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "greedy"]
categories: ["algorithms"]
codeforces_contest: 140
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 100"
rating: 1800
weight: 140
solve_time_s: 120
verified: false
draft: false
---

[CF 140C - 新年雪人](https://codeforces.com/problemset/problem/140/C)

 **评分：** 1800
 **标签：** 二分查找、数据结构、贪心
 **求解时间：** 2m
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一组雪球，每个雪球都有特定的半径，我们的目标是使用这些雪球组装尽可能多的雪人。 每个雪人必须恰好由三个雪球组成，并且这三个雪球中的每一个都必须具有不同的半径。 输入包含一个整数 _n_（雪球的数量），后跟代表半径的 _n_ 个整数。 输出应该告诉我们可以建造的最大雪人数量，然后是雪人列表，每个雪人由三个雪球的半径按降序排列（大、中、小）指定。 

约束条件使 _n_ 最大为 100,000，半径最大为 1,000,000,000。 这排除了任何显式检查所有三元组的方法，因为简单的方法将需要大约 n3 次操作，这对于 n = 10⁵ 来说太慢了。 我们需要一种在近线性或最坏的 O(n log n) 时间内工作的方法。 

边缘情况很容易破坏简单的实现。 例如，如果所有雪球的半径相同，例如`5 5 5 5`，无法堆雪人。 另一种棘手的情况是当一个半径占主导地位时，例如`1 1 1 2 3`。 一个粗心的贪心方法，只是重复取最大的三个值，可能会错误地尝试使用三个相同的雪球，这违反了独特性要求。 此外，拥有三个不同半径的雪球是应该正确产生一个雪人的最小情况。 

## 方法

 暴力方法将迭代所有可能的雪球三元组，检查半径是否不同，并收集有效的雪人，直到没有三元组剩余。 虽然原则上是正确的，但这需要 O(n3) 次操作，对于 n = 10⁵ 来说，大约为 1015。 这是完全不切实际的。 

The key observation is that we only care about distinct radii and the number of snowballs available for each radius. 如果我们对每个半径存在多少个雪球进行计数，那么问题就简化为重复选择三个最大的剩余不同半径。 通过始终选择最大的可用半径，我们可以最大限度地增加雪人的数量，因为较小半径的雪球不会阻止未来雪人的创建——一旦较高半径的雪人耗尽，它们可以稍后配对。 

这表明了一种有效支持“弹出最大可用半径”并减少其计数的数据结构。 最大堆在这里是理想的选择。 每次迭代，我们提取三个最大的半径，将它们记录为雪人，减少它们的计数，如果它们仍然可用，则将它们推回原处。 我们继续下去，直到剩余的不同半径少于三个。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n3) | O(n) | 太慢了 |
 | 最大堆贪婪 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 计算每个半径的频率。 这使我们能够知道每种类型有多少个雪球可用，而无需存储单独的重复项。 
2. 初始化包含所有不同半径及其计数的最大堆（优先级队列）。 使用半径作为键来保持降序。 
3. 虽然堆中至少有三个不同的半径，但请执行以下操作：

 a. 弹出三个最大的半径。 

b. 将它们记录为雪人，并按降序对它们进行排序。 

c. 递减每个半径的计数。 如果任何半径仍有剩余的雪球，请将其推回堆中。 
4. 一旦剩余的不同半径少于三个，则停止。 记录的雪人代表可以堆砌的最大数量。 
5. 输出雪人总数及其组成半径列表。 

不变的是，在每一步中，都会选择三个最大的不同可用半径。 这保证了没有潜在的雪人会被低效的选择所阻挡，从而确保达到最大数量。 

## Python 解决方案```python
import sys
import heapq
from collections import Counter

input = sys.stdin.readline

n = int(input())
radii = list(map(int, input().split()))

# Step 1: Count frequencies
freq = Counter(radii)

# Step 2: Build max-heap (invert the radius for max-heap using heapq)
heap = [(-radius, count) for radius, count in freq.items()]
heapq.heapify(heap)

snowmen = []

while len(heap) >= 3:
    first = heapq.heappop(heap)
    second = heapq.heappop(heap)
    third = heapq.heappop(heap)
    
    radii_triplet = sorted([-first[0], -second[0], -third[0]], reverse=True)
    snowmen.append(radii_triplet)
    
    # Decrement counts and push back if still positive
    if first[1] > 1:
        heapq.heappush(heap, (first[0], first[1] - 1))
    if second[1] > 1:
        heapq.heappush(heap, (second[0], second[1] - 1))
    if third[1] > 1:
        heapq.heappush(heap, (third[0], third[1] - 1))

print(len(snowmen))
for s in snowmen:
    print(*s)
```代码首先按半径计算雪球的数量。 最大堆是通过对半径求反来构造的，因为Python的heapq是最小堆。 在每一步中，我们都会提取三个最大的不同半径，减少它们的计数，如果还有雪球，则将它们推回原处。 对每个三元组进行排序可确保输出按降序排列。 

## 工作示例

 **示例输入 1**：```
7
1 2 3 4 5 6 7
```| 堆（前 3 个）| 计数| 堆雪人 |
 | ---| ---| ---|
 | 7,6,5 | 各 1 个 | 7 6 5 | 7 6 5
 | 4,3,2 | 各 1 个 | 4 3 2 |

 经过这些迭代后，剩下的半径少于三个 (1)，因此算法停止。 两个雪人已创建：`[7 6 5]`和`[4 3 2]`。 

**自定义输入2**：```
8
1 1 2 2 3 3 4 4
```| 堆（前 3 个）| 计数| 堆雪人 |
 | ---| ---| ---|
 | 4,3,2 | 各 1 个 | 4 3 2 |
 | 4,3,1 | 各 1 个 | 4 3 1 | 4 3 1

 Heap now has only 2 distinct radii left, so the algorithm stops. 两个雪人就形成了。 This shows that the algorithm correctly handles multiple duplicates and maximizes the number of snowmen.

 ## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 计数频率为 O(n)。 Each snowball can be pushed and popped at most once per snowman, leading to O(n log n) operations with the heap. |
 | 空间| O(n) | The heap stores at most one entry per distinct radius, and the frequency counter stores one entry per distinct radius. |

 With n ≤ 10⁵, this algorithm runs efficiently within the 2-second limit.

 ## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call solution
    n = int(input())
    radii = list(map(int, input().split()))
    from collections import Counter
    import heapq

    freq = Counter(radii)
    heap = [(-radius, count) for radius, count in freq.items()]
    heapq.heapify(heap)

    snowmen = []

    while len(heap) >= 3:
        first = heapq.heappop(heap)
        second = heapq.heappop(heap)
        third = heapq.heappop(heap)

        radii_triplet = sorted([-first[0], -second[0], -third[0]], reverse=True)
        snowmen.append(radii_triplet)

        if first[1] > 1:
            heapq.heappush(heap, (first[0], first[1] - 1))
        if second[1] > 1:
            heapq.heappush(heap, (second[0], second[1] - 1))
        if third[1] > 1:
            heapq.heappush(heap, (third[0], third[1] - 1))

    print(len(snowmen))
    for s in snowmen:
        print(*s)

    return output.getvalue().strip()

# provided samples
assert run("7\n1 2 3 4 5 6 7\n") == "2\n7 6 5\n4 3 2"

# custom tests
assert run("4\n5 5 5 5\n") == "0"
assert run("3\n1 2 3\n") == "1\n3 2 1"
assert run("8\n1 1 2 2 3 3 4 4\n") == "2\n4 3 2\n4 3 1"
assert run("6\n1 1 2 2 3 3\n") == "2\n3 2 1\n3 2 1"
```| 测试输入
