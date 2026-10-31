---
title: "CF 1614A - 沙发床和商店"
description: "Divan 想要在三个约束下购买巧克力棒：他只考虑价格范围 [l, r] 内的巧克力棒，并且他不能超过他的总预算 k。"
date: "2026-06-10T06:46:43+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "constructive-algorithms", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1614
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 757 (Div. 2)"
rating: 800
weight: 1614
solve_time_s: 77
verified: true
draft: false
---

[CF 1614A - 沙发床和商店](https://codeforces.com/problemset/problem/1614/A)

 **评分：** 800
 **标签：** 暴力、构造性算法、贪婪
 **求解时间：** 1m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 Divan 想要在三个约束下购买巧克力棒：他只考虑价格范围 [l, r] 内的巧克力棒，并且他不能超过他的总预算 k。 我们给出了 n 块巧克力的价格，对于每个测试用例，我们需要计算他在不违反这些约束的情况下可以购买的最大数量。 

输入提供了多个测试用例，每个测试用例都包含条数、可接受的下限和上限价格、Divan 的总预算以及巧克力价格数组。 每个测试用例的输出是一个整数，表示 Divan 可以购买的最大巧克力数量。 

这些约束意味着 n 最多为 100，并且价格和预算最多可达 10^9。 n 的小尺寸告诉我们，任何复杂度大约为 O(n log n) 甚至 O(n^2) 的方法对于单个测试用例来说都是可以接受的。 然而，由于测试用例的数量 t 可以达到 100，因此在最坏的情况下，简单的 O(n^2) 方法可能需要多达 10^6 次操作，考虑到 1 秒的时间限制，这仍然是可以接受的。 更重要的是仔细处理价格过滤和预算约束。 

非明显的边缘情况包括所有巧克力棒都太便宜或太贵的情况，或者预算甚至比最便宜的可接受的巧克力棒还要小的情况。 例如，如果 l = 10、r = 20、k = 5，且价格为 [12, 15]，则正确答案为 0，因为 Divan 买不起任何金条。 粗心的解决方案可能会在不检查预算的情况下错误地选择最便宜的可接受的酒吧。 

当多个金条具有相同的价格时，就会出现另一种边缘情况，这可能完全满足预算。 例如，如果 k = 10 且价格 = [5, 5, 5]，Divan 只能购买两根金条，而不是三根。 忘记仔细累计成本可能会导致多算。 

## 方法

 强力解决方案将枚举可接受的巧克力棒的所有子集，并检查哪些子集符合预算。 对于 n = 100，这会产生 2^100 个子集，这在天文数字上太大了。 显然，这种方法是不可行的。 

关键的观察是，除了价格之外，我们并不关心我们选择哪种金条组合。 为了最大限度地增加金条数量，我们应该首先选择最便宜的金条，因为购买更便宜的金条可以让我们在相同的预算内包含更多金条。 这将问题简化为排序和贪婪选择任务：按价格过滤柱，按升序对剩余柱进行排序，然后迭代它们，累积它们的成本，直到超出预算。 当 n ≤ 100 时，这种方法既正确又有效。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力（所有子集）| O(2^n) | O(2^n) | O(n) | 太慢了 |
 | 过滤+排序+贪心| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取测试用例数t。 循环每个测试用例。 
2. 对于测试用例，读取 n、l、r、k 和价格数组 a。 
3. 过滤数组 a 以仅保留 l 和 r 之间的价格（含 l 和 r）。 这确保我们只考虑迪万喜欢的巧克力。 
4. 将过滤后的数组按升序排序。 排序保证我们首先考虑更便宜的金条，这最大化了我们在预算 k 下可以购买的金条数量。 
5. 初始化购买巧克力数量的计数器和剩余预算的变量。 迭代排序后的价格。 
6. 对于每个价格 p，检查 p 是否小于或等于剩余预算。 如果是，则从预算中减去 p 并增加计数器。 如果 p 超过剩余预算，则停止迭代，因为添加任何其他条形（都更昂贵）将超出预算。 
7. 处理完所有条后，输出计数器作为测试用例的答案。

Why it works: At every step, we maintain the invariant that we have spent the minimum possible amount on the maximum number of bars. 由于数组按升序排序，因此跳过一个条，因为它超出了剩余预算，保证不再包含更多条。 This greedy approach ensures the maximum number of chocolates is selected without exceeding the budget.

 ## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, l, r, k = map(int, input().split())
    prices = list(map(int, input().split()))
    
    # Keep only acceptable chocolates
    valid_prices = [p for p in prices if l <= p <= r]
    
    # Sort ascending to prioritize cheaper chocolates
    valid_prices.sort()
    
    count = 0
    remaining_budget = k
    for price in valid_prices:
        if price <= remaining_budget:
            remaining_budget -= price
            count += 1
        else:
            break
    
    print(count)
```该代码有效地读取所有测试用例。 过滤确保我们不会考虑不可接受的价格，排序允许贪婪地选择更便宜的巧克力棒，并且迭代会累积巧克力直到预算用完。 排序和过滤很简单，但需要注意 l 和 r 的边界（包含）。 一旦预算不足，迭代就必须停止，这是常见的差一错误来源。 

## 工作示例

 ### 示例 1

 输入：```
3 1 100 100
50 100 50
```| 变量| 过滤后的值| 排序后的值 | 逆行|
 | ---| ---| ---| ---|
 | 有效价格 | [50, 100, 50] | [50, 50, 100] | 计数 = 0，剩余 = 100 |
 | 步骤 1 | p = 50 | p = 50 | - | 计数 = 1，剩余 = 50 |
 | 步骤 2 | p = 50 | p = 50 | - | 计数 = 2，剩余 = 0 |
 | 步骤 3 | p = 100 | - | 超出预算，停止|

 输出：2。这证实了贪婪地选择最便宜的金条首先使计数最大化。 

### 示例 2

 输入：```
6 3 5 10
1 2 3 4 5 6
```过滤后的 valid_prices = [3, 4, 5]，升序排序 = [3, 4, 5]。 迭代：

 | 步骤| 价格| 剩余| 计数 |
 | ---| ---| ---| ---|
 | 1 | 3 | 10-3=7 | 10-3=7 1 |
 | 2 | 4 | 7-4=3 | 7-4=3 2 |
 | 3 | 5 | 3 < 5，停止| 2 |

 输出： 2. 当下一个柱超出剩余预算时，确认正确停止。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(t * n log n) | O(t * n log n) | 过滤是 O(n)，排序是 O(n log n)，迭代是 O(n)。 对于 t 测试用例，乘以 t。 |
 | 空间| O(n) | 存储过滤后的有效价格列表。 |

 当 n ≤ 100 且 t ≤ 100 时，t*n log n 最多为 100 * 100 * log 100 ≈ 66,000 次操作，完全在 1 秒的限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    
    # Solution code
    t = int(input())
    for _ in range(t):
        n, l, r, k = map(int, input().split())
        prices = list(map(int, input().split()))
        valid_prices = [p for p in prices if l <= p <= r]
        valid_prices.sort()
        count = 0
        remaining_budget = k
        for price in valid_prices:
            if price <= remaining_budget:
                remaining_budget -= price
                count += 1
            else:
                break
        print(count)
    
    sys.stdout = sys.__stdout__
    return output.getvalue().strip()

# Provided samples
assert run("8\n3 1 100 100\n50 100 50\n6 3 5 10\n1 2 3 4 5 6\n6 3 5 21\n1 2 3 4 5 6\n10 50 69 100\n20 30 40 77 1 1 12 4 70 10000\n3 50 80 30\n20 60 70\n10 2 7 100\n2 2 2 2 2 7 7 7 7 7\n4 1000000000 1000000000 1000000000\n1000000000 1000000000 1000000000 1000000000\n1 1 1 1\n1") == "2\n2\n3\n0\n0\n10\n1\n1", "samples"

# Custom edge cases
assert run("1\n5 10 20 5\n12 15 18 19 20") == "0", "budget too small for any"
assert run("1\n5 10 20 50\n12 15 18 19 20") == "4", "maximum bars under budget"
assert run("1\n3 5 5 10\n5 5 5") == "2", "all equal prices, exact budget use"
assert run("1\n1 1 1000000000 1000000000\n100000
```
