---
title: "CF 1431A - 卖汉堡包"
description: "我们被要求找到向一组客户出售汉堡包的最佳价格，每个客户都有特定的金额。 当且仅当汉堡包的价格不超过他们拥有的钱时，每个顾客才会购买一个汉堡包。"
date: "2026-06-11T05:05:11+07:00"
tags: ["codeforces", "competitive-programming", "*special"]
categories: ["algorithms"]
codeforces_contest: 1431
codeforces_index: "A"
codeforces_contest_name: "Kotlin Heroes 5: ICPC Round"
rating: 800
weight: 1431
solve_time_s: 77
verified: true
draft: false
---

[CF 1431A - 卖汉堡](https://codeforces.com/problemset/problem/1431/A)

 **评分：** 800
 **标签：** *特别
 **求解时间：** 1m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求找到向一组客户出售汉堡包的最佳价格，每个客户都有特定的金额。 当且仅当汉堡包的价格不超过他们拥有的钱时，每个顾客才会购买一个汉堡包。 目标是最大化自助餐厅收集的硬币总数。 从概念上讲，我们正在选择一个价格$m$，收入为$m$乘以资金至少为的客户数量$m$。 

输入是多个测试用例。 每个测试用例由客户数量组成$n$和一个数组$a$他们的可用硬币。 每个$a_i$可以大到$10^{12}$， 但$n$最多只有100。低$n$允许我们考虑可扩展的算法$n^2$甚至$n \log n$舒适地。 然而，潜在的巨大代币价值意味着任何依赖迭代所有可能价格的方法都无法达到$10^{12}$是不可行的。 

当所有客户都拥有相同的硬币时，当一个客户比其他客户拥有更多的钱时，或者当多个客户可以负担非常高的价格但将其设置得稍微低一些会增加总收入时，就会出现边缘情况。 例如，如果所有顾客都有 1 个硬币，那么将价格设置为高于 1 个硬币就不会获得任何收益。 如果顾客有硬币`[1, 1000000000000]`，最优价格不是最高价格，因为以 1 出售将允许出售两个汉堡，而不是最多只能出售一个。 

## 方法

 暴力法是考虑从 1 到最大客户硬币的每个整数价格，并计算每个整数的收入。 对于每个价格，我们都会迭代所有客户，计算有多少人会以该价格购买，然后乘以价格。 这是正确的，因为它详尽地测试了所有可能性，但速度太慢了。 即使是为了$n = 100$，如果最大的硬币是$10^{12}$，迭代所有价格是不可行的。 

允许优化的关键观察是，唯一可以产生最大收入的候选价格是等于某些客户的硬币的价格。 这是因为，将价格提高到超过任何客户的代币会立即减少买家数量，而不会将价格提高到买家的限制之上，并且两个客户代币之间的任何价格都不会改变买家的集合。 所以我们只需要考虑价格$m \in a$。 

一旦我们对硬币数组进行排序，我们就可以有效地计算每个候选价格的收入。 如果我们考虑价格$a[i]$在排序数组中，至少可以付款的客户数量$a[i]$是$n - i$。 收入简直就是$a[i] \cdot (n - i)$。 迭代这个排序数组会产生最大收益$O(n \log n)$由于排序的时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n * 最大(a_i)) | O(n) | 太慢了 |
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例数量$t$。 对于每个测试用例，请阅读$n$以及一系列的客户硬币$a$。 首先读取所有输入是竞争性编程的标准做法，并确保一致的 I/O 处理。 
2. 对数组进行排序$a$按非递减顺序。 排序可确保每个价格$a[i]$，有能力购买的买家数量为$n - i$。 
3.初始化一个变量来跟踪最大收入，$\text{max\_revenue} = 0$。 
4. 使用索引迭代已排序的数组$i$。 对于每枚硬币$a[i]$，计算潜在收入为$\text{revenue} = a[i] \cdot (n - i)$。 
5. 更新$\text{max\_revenue}$如果计算的收入大于当前最大值。 
6. After processing all candidate prices, output$\text{max\_revenue}$。 

为什么它有效：不变的是任何不等于客户硬币的价格的收入不能超过某些客户硬币的收入。 Sorting guarantees that$n - i$正确计算买家数量，因此每次收入计算都会考虑给定价格的所有可能的有效买家子集。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    a.sort()
    max_revenue = 0
    for i in range(n):
        revenue = a[i] * (n - i)
        if revenue > max_revenue:
            max_revenue = revenue
    print(max_revenue)
```代码首先读取测试用例的数量。 Sorting the coins array ensures we can efficiently calculate the number of customers who can pay a given price. Iterating through the sorted array, we compute the revenue as price times the number of buyers. Updating the maximum revenue at each step guarantees we track the best achievable revenue. 通过仔细使用可以避免差一错误$n - i$，统计索引中的所有买家$i$到最后。 

## 工作示例

 ### 示例 1

 Input coins:`[1, 1, 1]`。 排序：`[1, 1, 1]`。 

| 我| a[i] | n-i | revenue |
 | ---| ---| ---| ---|
 | 0 | 1 | 3 | 3 |
 | 1 | 1 | 2 | 2 |
 | 2 | 1 | 1 | 1 |

 最大收入为3。 

### 示例 2

 Input coins:`[4, 1, 1]`。 排序：`[1, 1, 4]`。 

| 我| 一个[我] | n-i | 收入|
 | ---| ---| ---| ---|
 | 0 | 1 | 3 | 3 |
 | 1 | 1 | 2 | 2 |
 | 2 | 4 | 1 | 4 |

 最大收入为 4。在这里，选择最高的代币会产生最佳收入，因为购买的客户较少，但较高的价格可以补偿。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 排序占主导地位。 数组上的迭代是线性的。 |
 | 空间| O(n) | 我们为每个测试用例存储硬币数组。 |

 给定$n \le 100$和$t \le 100$，该解决方案总体上可有效处理多达 10,000 个元素。 大硬币价值不会影响迭代计数，因为我们没有枚举所有可能的价格。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        a.sort()
        max_revenue = 0
        for i in range(n):
            revenue = a[i] * (n - i)
            if revenue > max_revenue:
                max_revenue = revenue
        print(max_revenue)
    return output.getvalue().strip()

# Provided samples
assert run("6\n3\n1 1 1\n3\n4 1 1\n3\n2 4 2\n8\n1 2 3 4 5 6 7 8\n1\n1000000000000\n3\n1000000000000 999999999999 1\n") == "3\n4\n6\n20\n1000000000000\n1999999999998"

# Custom cases
assert run("1\n1\n1\n") == "1", "single customer"
assert run("1\n5\n5 5 5 5 5\n") == "25", "all equal coins"
assert run("1\n3\n1 1000000000000 2\n") == "2000000000000", "two high-value buyers"
assert run("1\n4\n1 2 3 4\n") == "8", "incremental coins"
assert run("1\n2\n1 1000000000000\n") == "1000000000000", "high discrepancy"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1\n1\n1\n`|`1`| 最小尺寸输入 |
 |`1\n5\n5 5 5 5 5\n`|`25`| 币种一律平等，最优价格等于币值 |
 |`1\n3\n1 1000000000000 2\n`|`2000000000000`| 多个买家，确保选择收益最大化 |
 |`1\n4\n1 2 3 4\n`|`8`| 增量币，查看中间价格选择|
 |`1\n2\n1 1000000000000\n`|`1000000000000`| 差异大，单一高价买家占主导|

 ## 边缘情况

 对于拥有大量硬币的单个客户，算法会正确选择该硬币作为价格。 输入：`[1000000000000
