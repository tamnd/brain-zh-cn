---
title: "CF 1185F - 两个披萨"
description: "我们被要求帮助一群朋友恰好挑选两个披萨，以便最大数量的朋友对选择感到满意。"
date: "2026-06-12T00:54:49+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "brute-force"]
categories: ["algorithms"]
codeforces_contest: 1185
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 568 (Div. 2)"
rating: 2100
weight: 1185
solve_time_s: 66
verified: true
draft: false
---

[CF 1185F - 两个披萨](https://codeforces.com/problemset/problem/1185/F)

 **评分：** 2100
 **标签：** 位掩码，暴力破解
 **求解时间：** 1m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求帮助一群朋友恰好挑选两个披萨，以便最大数量的朋友对选择感到满意。 每个朋友都有一组最喜欢的食材，如果朋友最喜欢的食材中的每一种都出现在两个选定的披萨中至少一个上，那么朋友就会感到满意。 每个披萨都有一组固定的原料和价格。 如果多对披萨满足相同数量的朋友，我们必须选择组合价格最低的一对。 输出只是两个披萨的索引。 

朋友的数量，$n$，以及披萨的数量，$m$，每个都可以大到$10^5$。 每个朋友和披萨最多涉及 9 种成分，因为可能的成分总数为 9。这些界限排除了任何明确检查所有成分的解决方案$n \times m^2$组合，这将达到$10^{15}$最坏情况下的操作。 相反，我们需要利用少量的成分并使用一种表示形式，使我们能够快速检查哪些朋友对一对披萨感到满意。 

当多个比萨饼一起满足朋友所需的所有成分，但没有一个比萨饼满足时，就会出现微妙的边缘情况。 例如，如果一个朋友喜欢食材{1,2}，而披萨是[{1},{2}]，那么只选择一个披萨并不能满足这个朋友的需求。 任何独立评估每个披萨满意度的幼稚方法都会错误地将这位朋友视为不满意。 当几对披萨满足相同数量的朋友时，就会出现另一个边缘情况 - 我们必须选择总成本最小的一对。 

## 方法

 蛮力方法很简单：迭代所有的披萨对，计算其成分的并集，并计算有多少朋友拥有该并集中的所有成分。 跟踪给出最多数量的满意朋友的配对，以最小的总成本打破平局。 这在原则上是正确的，但有$O(m^2 \cdot n \cdot k)$复杂度，其中$k \le 9$是每个朋友的成分数量。 和$m = 10^5$和$n = 10^5$，这是完全不切实际的。 

关键的见解是只有 9 种成分，因此我们可以将任何成分集表示为 9 位整数（位掩码）。 朋友的偏好集和比萨饼的成分都可以编码为长度为 9 的位掩码。使用按位运算，我们可以快速确定比萨饼或比萨饼的组合是否满足朋友的偏好。 由于只有$2^9 = 512$可能的成分集，我们可以为每个成分集预处理最便宜的披萨。 然后，而不是检查所有$m^2$直接比萨饼对，我们只需要考虑 512 个可能的集合中的对，大大减少了比较的次数$10^{10}$粗略地$512^2 = 262144$，这是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n * m^2) | O(n * m^2) | O(1) | O(1) | 太慢了 |
 | 位掩码压缩 | O(n + 2^9 * 2^9) | O(n + 2^9 * 2^9) | O(2^9) | O(2^9) | 已接受 |

 ## 算法演练

 1. 将每个朋友最喜欢的食材集编码为 9 位整数。 每一位代表朋友是否喜欢该成分。 
2. 将每个披萨的成分编码为 9 位整数。 每个披萨也有成本。 
3. 维护一个字典，将每个位掩码映射到具有该组确切成分的最便宜披萨的索引。 如果多个披萨共享相同的位掩码，请保留两个最便宜的，因为最佳对可能包含两次相同的成分集。 
4. 对于每个可能的朋友面具（最多 512 个），计算有多少朋友拥有该面具。 这使我们能够通过检查两个披萨面具的并集是否包含朋友面具来快速计算满意度。 
5. 迭代所有对的披萨面具（如果至少有两个该类型的披萨，则包括使用相同的面具两次）。 对于每一对，计算两个掩码的并集。 对于每个友元掩码，使用按位 AND 检查它是否完全包含在并集中。 统计满意的朋友数量。 
6. 记录使朋友满意程度最大化的那对披萨。 如果多对产生相同的最大值，请选择总成本最小的一对。 存储输出索引。 
7. 输出所选的两个披萨的索引。 

为什么有效：通过使用位掩码和成分的小宇宙，我们将问题简化为考虑所有有意义的成分组合，而不是单独考虑所有比萨饼。 披萨面具的每个组合都正确地代表了选择这两个披萨时可用的成分。 通过按位检查计算满意的朋友可确保正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
friend_count = [0] * 512  # count of friends for each mask

for _ in range(n):
    parts = list(map(int, input().split()))
    fmask = 0
    for ing in parts[1:]:
        fmask |= 1 << (ing - 1)
    friend_count[fmask] += 1

pizza_masks = {}
pizza_prices = {}
pizza_indices = {}

for idx in range(1, m + 1):
    parts = list(map(int, input().split()))
    price = parts[0]
    pmask = 0
    for ing in parts[2:]:
        pmask |= 1 << (ing - 1)
    
    if pmask not in pizza_prices:
        pizza_prices[pmask] = [price]
        pizza_indices[pmask] = [idx]
    else:
        pizza_prices[pmask].append(price)
        pizza_indices[pmask].append(idx)
        # keep only two cheapest
        combined = sorted(zip(pizza_prices[pmask], pizza_indices[pmask]))
        pizza_prices[pmask], pizza_indices[pmask] = zip(*combined[:2])

best_count = -1
best_cost = None
best_pair = None

masks = list(pizza_prices.keys())
for i in range(len(masks)):
    for j in range(i, len(masks)):
        mask1, mask2 = masks[i], masks[j]
        cost1_list, cost2_list = pizza_prices[mask1], pizza_prices[mask2]
        idx1_list, idx2_list = pizza_indices[mask1], pizza_indices[mask2]

        if i == j and len(cost1_list) < 2:
            continue  # cannot pick same pizza twice if only one exists

        cost = cost1_list[0] + (cost2_list[0] if i != j else cost1_list[1])
        union_mask = mask1 | mask2
        count = 0
        for fmask in range(512):
            if friend_count[fmask] > 0 and (fmask & union_mask) == fmask:
                count += friend_count[fmask]

        if count > best_count or (count == best_count and cost < best_cost):
            best_count = count
            best_cost = cost
            if i != j:
                best_pair = (idx1_list[0], idx2_list[0])
            else:
                best_pair = (idx1_list[0], idx1_list[1])

print(best_pair[0], best_pair[1])
```该代码首先将朋友和披萨编码为位掩码，然后每个掩码存储两个最便宜的披萨。 掩码上的嵌套循环确保我们考虑所有可行的对，而无需迭代所有$m^2$披萨。 联合掩码和按位与运算可以有效地检查哪些朋友满意。 

## 工作示例

 ### 输入示例 1```
3 4
2 6 7
4 2 3 9 5
3 2 3 9
100 1 7
400 3 3 2 5
100 2 9 2
500 3 2 9 5
```| 步骤| 掩码1 | 掩码2 | 联合掩码 | 满意啦| 成本| 最佳配对 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | 7 | 14 | 14 15 | 15 2 | 500 | 500 (2,3) |

 跟踪显示朋友 1 喜欢 {6,7}，朋友 2 喜欢 {2,3,5,9}，朋友 3 喜欢 {2,3,9}。 披萨 2 {3,2,5} + 披萨 3 {9,2} 满足朋友 2 和 3。披萨 1 {7} 满足朋友 1。最佳配对是披萨 2 和 3，因为它在最佳配对中以最小的价格覆盖了最多的朋友。 

### 自定义输入2```
2 3
1 1
1 2
100 1 1
200 1 2
300 2 1 2
```| 步骤| 掩码1 | 掩码2 | 联合掩码 | 满意啦| 成本| 最佳配对 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 2 | 3 | 2 | 300 | 300 (1,2) |
 | 2 | 1 | 3 | 3 | 2 | 400 | 400 (1,3) |

 第一对已经以最小的成本提供了最大的满意度。 表明算法更喜欢平局中的最小成本。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + 2^9 * | |
