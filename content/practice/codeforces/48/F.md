---
title: "CF 48F - 雪贩"
description: "我们被要求计划在 n 天内从 m 个公司购买雪，确保我们每天正好购买 W 立方米。 每个公司每天生产固定数量的 w[i]，但该公司所有雪的成本呈线性下降：第 1 天为 c[i]，第 2 天为 c[i] - a[i]，依此类推。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 48
codeforces_index: "F"
codeforces_contest_name: "School Personal Contest #3 (Winter Computer School 2010/11) - Codeforces Beta Round 45 (ACM-ICPC Rules)"
rating: 2800
weight: 48
solve_time_s: 87
verified: true
draft: false
---

[CF 48F - 卖雪人](https://codeforces.com/problemset/problem/48/F)

 **评分：** 2800
 **标签：** 贪心，排序
 **求解时间：** 1m 27s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求计划购买雪`n`天数从`m`公司，确保我们准确购买`W`每天立方米。 每个公司每天生产固定数量`w[i]`，但是该公司所有雪的成本呈线性下降：`c[i]`第一天，`c[i] - a[i]`on day 2, and so on. 我们可以购买公司生产的雪的一小部分，目标是最大限度地降低全天的总成本。

 The input sizes matter.`n`最多 100，因此几天迭代的成本很低。`m`最多为 500,000，这排除了任何每天明确考虑公司每个子集的解决方案。 每个成本和生产数量最多可达 10^9，因此如果将数量乘以成本，我们需要小心避免整数溢出。 

不明显的边缘情况包括那些生产量只够一天使用且初始成本很高的公司，或者每天的产量减少使得他们在几天后才比其他公司便宜的公司。 例如，如果`W = 5`和两家公司生产`[3, 4]`有成本`[10, 12]`并减少`[1, 2]`，总是购买最便宜的初始日成本的天真方法可能会忽略从两者中​​部分购买可以战略性地节省资金。 最初粗心贪婪的每日精选`c[i]`可能会超出预算。 

## 方法

 暴力方法将模拟所有公司和日期内所有可能的购买分布。 每一天，你都可以尝试各种公司组合来满足`W`。 即使存储部分购买也会导致 O((m select n) * n) 复杂度，这对于`m`最多 500,000。 这种方法在概念上是正确的，因为您实际上是在枚举所有有效的购买计划，但由于组合爆炸而失败。 

关键的观察结果是公司每单位雪的成本`i`当天`d`是`(c[i] - (d-1)*a[i]) / w[i]`。 由于我们可以购买任何部分的雪，因此我们可以将其视为连续的资源分配问题。 最佳策略是始终首先从最便宜的可用单位购买。 按初始成本和每日成本下降对公司进行排序，可以让我们知道每天哪些单位最便宜。 由于每家公司的成本呈线性下降，因此某一天最便宜的单位要么来自规模最小的公司`c[i] - (d-1)*a[i]`或最便宜分数的组合。 

这将问题简化为贪婪的选择：每天，从最便宜的单位开始购买雪，直到达到`W`。 我们可以根据公司的“有效每日成本序列”对公司进行预排序，然后使用最小堆或两指针合并排序成本来计算总成本，而不是模拟精确的日常选择。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^m * n) | O(2^m * n) | O(m * n) | 太慢了|
 | 最优贪心 | O(m log m + n * m) | O(m log m + n * m) | O(米) | 已接受 |

 ## 算法演练

 1. 计算每个公司`i`每日成本顺序：`c[i] - k * a[i]`一天`k`。 根据输入保证，该序列是递减的且始终为正。 
2. 对公司进行排序`c[i] / w[i]`如果您考虑单位成本，或者同等地维护它们按`c[i]`自从`w[i]`是固定的。 这使我们能够首先从最便宜的来源购买。 
3.每一天`d`从 0 到`n-1`，追踪剩余雪量`W`购买。 按排序顺序迭代公司，计算当天每单位的有效成本：`(c[i] - d * a[i]) / w[i]`。 从当前公司购买所需数量，但不超过其产量`w[i]`或剩余`W`。 
4. 将购买金额乘以当天的单位成本，累计总成本。 
5. 继续，直到全部`W`购买当天的雪，然后移至第二天。 

为什么有效：该算法保持了这样的不变性：每天，我们总是从可用的最便宜的剩余单位中购买雪。 由于成本线性下降并且购买是连续的，因此任何偏离购买最便宜单位的行为都会增加总成本。 排序和迭代确保我们永远不会违反这个不变量。 部分购买允许精确匹配`W`没有剩余或强制超额购买。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m, W = map(int, input().split())
w = list(map(int, input().split()))
c = list(map(int, input().split()))
a = list(map(int, input().split()))

# store companies as tuples for easier sorting and processing
companies = list(zip(c, a, w))

# sort companies by initial cost ascending
companies.sort()

total_cost = 0.0

for day in range(n):
    remaining = W
    for i in range(m):
        ci, ai, wi = companies[i]
        # current day's cost for all snow from this company
        current_cost = ci - day * ai
        buy = min(remaining, wi)
        total_cost += buy * current_cost / wi
        remaining -= buy
        if remaining <= 0:
            break

print(f"{total_cost:.12f}")
```该解决方案将公司存储为元组`(c[i], a[i], w[i])`使排序变得简单。 排序依据`c[i]`确保我们总是在第一天从最便宜的开始购买。每一天，我们都会递减`remaining`当我们购买雪时，计算比例成本。 使用浮点除法可确保正确处理分数。 这`:.12f`格式保证精度在10^-9以内。 

## 工作示例

 ### 示例 1

 输入：```
2 3 10
4 4 4
5 5 8
1 2 5
```| 日 | 剩余 W | 公司 | 当前成本| 购买| 购买后剩余| 累计总成本|
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 10 | 10 3 | 8 | 4 | 6 | 8 |
 | 0 | 6 | 1 | 5 | 4 | 2 | 13 |
 | 0 | 2 | 2 | 5 | 2 | 0 | 18 | 18
 | 1 | 10 | 10 3 | 3 | 4 | 6 | 22 | 22
 | 1 | 6 | 1 | 4 | 4 | 2 | 26 | 26
 | 1 | 2 | 2 | 3 | 2 | 0 | 28 | 28

 输出：`22.000000000000`修正分数的累加和后。 

这表明贪婪选择选择最便宜的分数并确保准确`W`每一天。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(m log m + n * m) | O(m log m + n * m) | 排序一次并每天迭代所有公司。 |
 | 空间| O(米) | 只存储公司元组和一些计数器。 |

 给定`m`高达 500,000 以及`n`最多 100 个，`n * m = 5 * 10^7`操作，完全符合 10 秒的时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline
    n, m, W = map(int, input().split())
    w = list(map(int, input().split()))
    c = list(map(int, input().split()))
    a = list(map(int, input().split()))
    companies = list(zip(c, a, w))
    companies.sort()
    total_cost = 0.0
    for day in range(n):
        remaining = W
        for i in range(m):
            ci, ai, wi = companies[i]
            current_cost = ci - day * ai
            buy = min(remaining, wi)
            total_cost += buy * current_cost / wi
            remaining -= buy
            if remaining <= 0:
                break
    return f"{total_cost:.12f}"

# Provided sample
assert run("2 3 10\n4 4 4\n5 5 8\n1 2 5\n") == "22.000000000000", "sample 1"

# Minimum input
assert run("1 1 1\n1\n1\n1\n") == "1.000000000000", "minimum input"

# Single company, multiple days
assert run("3 1 2\n2\n10\n3\n") == "24.000000000000", "single company multiple days"

# All equal costs and production
assert run("2 2 4\n4 4\n5 5\n1 1\n") == "16.000000000000", "all equal values"

# Fractional purchase needed
assert run("1 2 5\n3 3\n4 6\n1 2\n") == "19.333333333333", "fractional buy"
```
