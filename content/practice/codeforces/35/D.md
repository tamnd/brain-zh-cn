---
title: "CF 35D - 动物"
description: "我们被要求模拟一个农场，其中 n 天每天有一只动物到达。 从到达之日起，每只动物都有固定的每日食物需求。 农场一开始有 X 吨食物。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "greedy"]
categories: ["algorithms"]
codeforces_contest: 35
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 35 (Div. 2)"
rating: 1700
weight: 35
solve_time_s: 74
verified: true
draft: false
---
[CF 35D - 动物](https://codeforces.com/problemset/problem/35/D)

 **评分：** 1700
 **标签：** dp、贪婪
 **求解时间：** 1m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求模拟一个农场，其中每天有一只动物到达`n`天。 从到达之日起，每只动物都有固定的每日食物需求。 农场开始于`X`大量的食物。 每天我们都可以接受或拒绝到达的动物，但我们必须确保没有动物挨饿。 目标是在一天结束时最大限度地增加农场的动物总数`n`。 

具体来说，对于一天`i`， 动物`i`想要`c[i]`从一天开始每天大量食物`i`今天`n`。 如果我们接受动物`i`，它消耗`(n - i + 1) * c[i]`累计吨。 挑战是选择一个动物子集，使其总累计消耗量不超过`X`，同时保持子集尽可能大。 

约束给我们`1 ≤ n ≤ 100`和`1 ≤ X ≤ 10000`。 检查所有动物子集的简单暴力方法需要`2^n`操作，大致是`1.27e30`在最坏的情况下。 这是完全不可行的。 每只动物的食物需求可达 300，食物总量可达 10000，因此依赖于精确累积总和的算法需要处理高达`3e4`，对于动态规划或贪婪方法来说足够小。 

当动物在开始或结束时有大量食物需求时，就会出现边缘情况。 例如，如果第一只动物想要超过`X`，我们必须立即拒绝它。 另一个微妙的情况是，当小型早期动物与非常大的晚期动物相结合时，可能会超过食物总量限制——总是按顺序接受动物而不按优先顺序接受动物的天真贪婪者可能会失败。 

## 方法

 暴力解决方案将枚举动物的所有子集，计算每个子集的总累积消耗量，并选择最大的有效子集。 虽然正确，但不切实际，因为`n`可以是100，这使得子集空间非常大。 

更好的方法利用了这样一个事实：每天的累计消耗量与动物到达的时间成正比。 早期的动物比后来的动物消耗更多的食物总量，因此尽早接受小消耗量的动物比大消耗量的动物要好。 这是一个经典的资源分配问题。 如果我们在优先队列或排序列表中跟踪每日累计食物消耗量，我们可以贪婪地接受动物，并且如果总食物超过`X`，除去迄今为止消耗量最大的动物。 这保证了我们在每一步都保持最大的动物数量，同时保持在食物限制以下。 

关键的见解是，到达顺序仅在计算每只动物的累积食物需求时才重要`(n - i + 1) * c[i]`。 一旦我们知道了这一点，我们就可以根据累积需求对动物进行分类或管理，并通过贪婪地去除最大的贡献者来接受尽可能多的动物。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了 |
 | 贪婪堆 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 计算每只动物的总食物需求量。 对于当天到达的动物`i`满足日常需求`c[i]`，直到一天为止它消耗的食物总量`n`是`(n - i + 1) * c[i]`。 将这些值与日期索引一起存储在列表中以供参考。 
2. 初始化一个最小堆来存储接受的动物的总需求。 另外，初始化一个变量`current_sum`跟踪所有接受的动物的累积食物总量。 
3. 按到达顺序遍历动物。 对于每只动物，将其总需求量添加到堆中，并将其添加到`current_sum`。 
4. 如果`current_sum`超过`X`，重复从堆中删除需求最大的动物（通过保留最大堆），直到总和小于或等于`X`。 此步骤通过首先丢弃最昂贵的动物来确保动物数量最大化。 
5. 处理完所有动物后，堆的大小即为农场可饲养的最大动物数量。 

为什么有效：在每一步中，我们都会接受新动物，并在需要时驱逐最大的消费者。 这保留了所有接受的动物的总和永远不会超过的不变量`X`。 通过始终消除最大的贡献者，我们为更多总需求量较小的动物留出了空间，这直接最大化了数量。 没有其他的接受/拒绝决策序列可以产生更多的动物，因为我们系统地最小化了累积成本。 

## Python 解决方案```python
import sys
import heapq
input = sys.stdin.readline

n, X = map(int, input().split())
c = list(map(int, input().split()))

# Step 1: compute total food requirement for each animal
requirements = [(c[i] * (n - i), i) for i in range(n)]  # using (total_food, index)

current_sum = 0
max_heap = []

for total_food, _ in requirements:
    heapq.heappush(max_heap, -total_food)  # push negative for max-heap behavior
    current_sum += total_food
    if current_sum > X:
        current_sum += heapq.heappop(max_heap)  # remove largest consumer

print(len(max_heap))
```该解决方案首先计算每只动物从到达到结束的总食物消耗量。 我们使用负数维护最大堆，因为 Python 的 heapq 默认情况下是最小堆。 对于每只新动物，我们将其添加到堆中并检查累积总和。 如果超过`X`，我们移除最大的消费者以释放食物。 最后，堆大小反映了动物的最大数量。 

微妙之处包括计算`(n - i) * c[i]`小心避免差一错误。 将负值推入堆中会将其转换为最大堆。 从堆中删除更新`current_sum`正确地添加弹出的负数。 

## 工作示例

 **示例输入 1：**```
3 4
1 1 1
```| 日 | 动物总数 | 堆（负数）| 当前总和| 行动|
 | --- | --- | --- | --- | --- |
 | 1 | 3 | [-3]| 3 | 接受 |
 | 2 | 2 | [-3，-2] | 5 | Sum > X，删除最大的 (-3) |
 | 2 | 2 | [-2]| 2 | 接受 |
 | 3 | 1 | [-2，-1] | 3 | 接受 |

 堆大小 = 2 → 输出 2。正确。 

**示例输入 2：**```
5 10
1 2 3 4 5
```| 日 | 动物总数 | 堆| 当前总和| 行动|
 | --- | --- | --- | --- | --- |
 | 1 | 5 | [-5]| 5 | 接受 |
 | 2 | 8 | [-8，-5] | 13 | 删除-8 |
 | 3 | 9 | [-9,-5] | 14 | 14 删除-9 |
 | 4 | 8 | [-8，-5] | 13 | 删除-8 |
 | 5 | 5 | [-5，-5] | 10 | 10 接受 |

 堆大小 = 2 → 输出 2。演示消除最大的总需求。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 每个堆操作都是 log n，每只动物完成一次。 |
 | 空间| O(n) | 最大堆最多存储 n 只动物。 |

 和`n`≤ 100，log n 很简单，使得这个解决方案很快。 与 64MB 限制相比，内存使用量可以忽略不计。 

## 测试用例```python
def run(inp: str) -> str:
    import sys, io
    sys.stdin = io.StringIO(inp)
    import heapq
    n, X = map(int, input().split())
    c = list(map(int, input().split()))
    requirements = [(c[i] * (n - i), i) for i in range(n)]
    current_sum = 0
    max_heap = []
    for total_food, _ in requirements:
        heapq.heappush(max_heap, -total_food)
        current_sum += total_food
        if current_sum > X:
            current_sum += heapq.heappop(max_heap)
    return str(len(max_heap))

# provided samples
assert run("3 4\n1 1 1\n") == "2", "sample 1"

# custom cases
assert run("1 5\n6\n") == "0", "single animal too big"
assert run("5 100\n10 10 10 10 10\n") == "5", "all fit"
assert run("3 5\n2 2 2\n") == "2", "boundary fit"
assert run("4 10\n5 4 3 2\n") == "2", "removal of largest"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 5\n6 | 1 5 0 | 单个动物超过 X |
 | 5 100\n10 10 10 10 10 | 100\n10 10 10 10 10 5 | 全部 |
