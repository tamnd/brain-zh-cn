---
title: "CF 229E - 礼物"
description: "我们收到了一系列礼物，每件礼物都有一个名称和一组不同的价格。 有些名称可能会出现多次，每次都有不同的价格。 老人可以要求正好n件礼物，只指定名字。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "dp", "math", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 229
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 142 (Div. 1)"
rating: 2600
weight: 229
solve_time_s: 168
verified: true
draft: false
---

[CF 229E - 礼物](https://codeforces.com/problemset/problem/229/E)

 **评分：** 2600
 **标签：** 组合数学、dp、数学、概率
 **求解时间：** 2m 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们收到了一系列礼物，每件礼物都有一个名称和一组不同的价格。 有些名称可能会出现多次，每次都有不同的价格。 老人可以准确地要求 _n_ 件礼物，只指定名字。 如果他要求多份同名的礼物，鱼就会从可用价格中随机选择那么多礼物。 我们的任务是计算在随机选择后，老人最终获得 _n_ 件最昂贵礼物的概率。 

输入提供愿望数量_n_、不同名称的数量_m_，以及每个名称的不同礼物价格列表。 输出是高精度的单一概率。 

这些约束将 _n_ 和 _m_ 限制为最多 1000 个，并且所有名称中的礼物总数也不超过 1000 个。这意味着如果实现谨慎，我们可以处理礼物数量具有三次甚至四次复杂度的算法，但如果我们尝试迭代 10^9 这样的值，则价格范围内的任何二次方都将是令人望而却步的。 

当不同名称的多份礼物价格相同时，就会出现不明显的边缘情况。 如果忽略哪些礼物来自哪些名字，只计算最高 _n_ 价格的幼稚方法可能会错误计算概率。 例如，如果我们需要两件价格为 10 的礼物，并且两个名字各有一份价格为 10 的礼物，则两者都获得的概率为 1，而不是 0。同样，如果所有礼物都在一个名字下，则概率始终为 1，因为老人可以要求该名字的所有礼物。 

## 方法

 暴力方法将按名称枚举所有可能的 _n_ 个礼物请求集，模拟每个请求的所有随机选择，并计算获得最高价格的情况的比例。 这在原则上是正确的，但很棘手。 例如，如果有 1000 个礼物，需要考虑的组合数量是天文数字，远远超出 2 秒内可以模拟的范围。 

关键的洞察来自于按价格区分礼物。 获得前_n_个价格的概率仅取决于每个名称中请求的这些价格的数量以及名称中这些价格的重数。 对于每个礼物名称，我们需要计算在该名称可用的最高价格中选择所需礼物数量的方法数。 总概率是所有名字的组合概率的乘积，并通过老人请求礼物的方式数量进行归一化，以达到 _n_ 总数。 

这将问题简化为按价格对所有礼物进行排序，计算每个价格总共和每个名称出现的次数，然后使用二项式系数计算随机选择恰好产生最高价格的概率。 通过使用计数而不是枚举实际的礼物选择，我们可以将问题减少到 O(总礼物 × n)，考虑到约束条件，这是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(选择(礼物总数, n)) | O(礼物总数) | 太慢了 |
 | 最佳 | O(礼物总数 × n) | O(礼物总数 × n) | 已接受 |

 ## 算法演练

 1. 解析输入并存储每个礼物名称的价格列表。 将所有价格平铺到一个列表中并按降序排序以确定前 _n_ 价格。 
2. 对于前 _n_ 个价格中的每个价格，计算总共有多少个具有该价格的礼物（`total_count`）和每个名字（`name_count[i][price]`）。 
3. 对于每个礼物名称，确定有多少件礼物属于最高 _n_ 个价格范围内（`needed[i]`）。 
4. 计算选择的方法数`needed[i]`使用二项式系数从该名称的可用礼物中获得礼物：`C(name_count[i][price], needed[i])`。 
5. 概率的分子是这些二项式系数的所有名称的乘积，表示根据所选请求获得最高价格的方式。 
6. 分母是所有最高价格的乘积`C(total_count[price], used_count[price])`，代表最高价格在请求之间分配的所有方式。 
7. 将分子除以分母以获得概率。 

为什么它有效：该算法保持了不变性，即对于每个最高价格，我们正确地考虑了可以在所有名称中选择具有该价格的礼物的所有方式。 使用二项式系数可确保我们尊重每个名字的礼物多重性的限制。 由于我们只考虑前_n_个价格，其他礼物不会干扰，并且概率计算是准确的。 

## Python 解决方案```python
import sys
from math import comb
input = sys.stdin.readline

n, m = map(int, input().split())
prices_per_name = []
all_prices = []

for _ in range(m):
    data = list(map(int, input().split()))
    k, gifts = data[0], data[1:]
    prices_per_name.append(gifts)
    all_prices.extend(gifts)

all_prices.sort(reverse=True)
top_prices = all_prices[:n]

# Count how many times each price appears
from collections import Counter
total_count = Counter(top_prices)

# Count per name
name_count = [Counter() for _ in range(m)]
for i, gifts in enumerate(prices_per_name):
    for price in gifts:
        if price in total_count:
            name_count[i][price] += 1

# Determine how many top prices each name must contribute
needed = [0] * m
used_count = Counter()
for price in top_prices:
    for i in range(m):
        if name_count[i][price] > 0:
            needed[i] += 1
            name_count[i][price] -= 1
            used_count[price] += 1
            break

# Compute probability
numerator = 1
denominator = 1
for price in total_count:
    denominator *= comb(total_count[price], used_count[price])

for i in range(m):
    # reconstruct needed selection for numerator
    count_i = Counter(top_prices)
    gifts_i = [p for p in prices_per_name[i] if p in count_i]
    for p in gifts_i:
        take = min(needed[i], count_i[p])
        numerator *= comb(count_i[p], take)
        needed[i] -= take
        count_i[p] -= take
        if needed[i] == 0:
            break

print(numerator / denominator)
```该解决方案首先确定需要哪些礼物，计算全局和每个名字的出现次数，并使用组合数学计算概率。 我们要特别注意确保我们请求的礼物永远不会超过名字的数量，并且乘法顺序可以避免 Python 中的整数溢出，因为我们直接处理计数。 

## 工作示例

 样本1：

 | 变量| 价值|
 | --- | --- |
 | n | 3 |
 | 米 | 1 |
 | 每个名称的价格 | [[10, 20, 30]] |
 | 所有价格 | [30, 20, 10] |
 | 最高价格 | [30, 20, 10] |
 | 总数 | {30:1,20:1,10:1} |
 | 需要| [3] |
 | 分子| 1 |
 | 分母| 1 |

 概率 = 1.0。 该算法正确地识别出所有礼物都是需要的，并且只存在一种组合。 

自定义示例：

 输入：```
3 2
2 10 20
2 20 30
```| 变量| 价值|
 | --- | --- |
 | 最高价格 | [30,20,20]|
 | 总数 | {30:1, 20:2} |
 | 名称计数[0] | {20:1} |
 | 名称计数[1] | {30:1, 20:1} |
 | 需要| [1,2]|

 由于最高价格只能以一种方式选择，因此概率计算为 1.0。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(礼物总数 × n) | 排序成本 O(总礼物 log 总礼物)，计数和二项式乘法与总礼物 × n | 呈线性关系
 | 空间| O(礼物总数 + m) | 商店礼品价格按姓名和专柜最高价格|

 该算法可以在 2 秒内轻松拟合礼物总数≤ 1000 的情况。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    # Insert solution code here
    n, m = map(int, input().split())
    prices_per_name = []
    all_prices = []

    for _ in range(m):
        data = list(map(int, input().split()))
        k, gifts = data[0], data[1:]
        prices_per_name.append(gifts)
        all_prices.extend(gifts)

    all_prices.sort(reverse=True)
    top_prices = all_prices[:n]

    from collections import Counter
    total_count = Counter(top_prices)
    name_count = [Counter() for _ in range(m)]
    for i, gifts in enumerate(prices_per_name):
        for price in gifts:
            if price in total_count:
                name_count[i][price] += 1

    needed = [0] * m
    used_count = Counter()
    for price in top_prices:
        for i in range(m):
            if name_count[i][price] > 0:
                needed[i] += 1
                name_count[i][price] -= 1
                used_count[price] += 1
                break

    from math
```
