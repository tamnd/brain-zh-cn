---
title: "CF 41B - 火星币"
description: "我们被要求最大化 Vasya 在 _n_ 天结束时可以拥有的金额，如果他从给定数量的布尔开始，并且可以购买并随后出售火星币。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force"]
categories: ["algorithms"]
codeforces_contest: 41
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 40 (Div. 2)"
rating: 1400
weight: 41
solve_time_s: 68
verified: true
draft: false
---
[CF 41B - 火星币](https://codeforces.com/problemset/problem/41/B)

 **评分：** 1400
 **标签：** 暴力破解
 **求解时间：** 1m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求最大化 Vasya 在 _n_ 天结束时可以拥有的金额，如果他从给定数量的布尔开始，并且可以购买并随后出售火星币。 每天都有一个美元价格，Vasya 只能执行一次买卖操作，购买整数美元并在第二天以完整整数价格出售。 

输入给出了天数、初始资金（以布尔为单位）以及每日美元价格列表。 输出是 Vasya 在可能买卖一次后可以拥有的最大布尔量。 

限制很小：天数和初始资金最多为 2000，这使得算法可以二次扩展，因为 2000² 次操作只有大约 400 万次，完全适合 2 秒的时间限制。 主要挑战不是效率，而是正确建模整数买入/卖出行为。 

一些边缘情况并不明显。 例如，如果美元价格永远不会上涨，则最佳策略是永远不购买，因此最大资金就是初始金额。 如果初始资金小于所有美元价格，则 Vasya 无法购买任何美元，并且最大资金同样保持不变。 假设他总是在第一天购买的粗心解决方案会在这里产生错误的答案。 

## 方法

 最直接的方法就是暴力破解。 对于每一天，考虑在当天购买美元。 对于每个潜在的买入日，模拟随后的每一天的卖出。 计算 Vasya 可以购买的美元数量（将当前的金币除以价格的整数），乘以售价，然后添加剩余的金币以计算最终总额。 跟踪所有买入/卖出对的最大值。 

此方法是正确的，因为它枚举了所有可能的买入/卖出决策。 操作次数大致为$O(n^2)$因为对于我们可能考虑购买的 n 天中的每一天，我们都会检查所有后面的日子作为潜在的卖出天。 当 n ≤ 2000 时，最多 400 万次操作，这是可以接受的。 

让我们稍微简化的关键见解是，某一天之后的最高售价才是重要的。 我们可以预先计算从第 _i_ 天开始的最高价格，而不是检查每个购买日的所有后续日期。 那么第 _i_ 天买入的利润就是`(max_price_after_i - price[i]) * dollars_can_buy`。 这减少了冗余比较并简化了推理，尽管渐进地它仍然是 O(n²)，因为计算美元和剩余的布尔仍然涉及每天的整数运算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(1) | O(1) | 已接受 |
 | 优化的最大跟踪 | O(n²) | O(n) | 已接受 |

 ## 算法演练

 1.读取天数`n`和初始资金`b`，然后读取每日价格数组`a`。 
2. 初始化变量`max_money`用初始资金，代表 Vasya 不购买任何美元的情况。 
3. 迭代每一天`i`作为潜在的购买日。 计算 Vasya 可以购买的美元数量为`b // a[i]`。 如果他买不到任何美元，请跳到第二天。 
4. 每个购买日`i`，迭代以后的每一天`j > i`作为潜在的卖出日。 如果 Vasya 当天卖出，计算最终收益`j`作为`dollars_bought * a[j] + leftover_bourles`。 更新`max_money`如果这个总数更大。 
5. 检查完所有可能的买入/卖出对后，打印`max_money`。 

为什么有效：在每次迭代中，我们都会考虑所有可行的买卖日，并且计算会考虑整数美元购买和剩余的布尔。 由于枚举了每个有效场景，因此所有迭代中的最大值保证是真正的最大值。 跳过无法购买美元的日子可以确保初始资金太少的边缘情况的正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, b = map(int, input().split())
a = list(map(int, input().split()))

max_money = b

for i in range(n):
    dollars = b // a[i]
    leftover = b % a[i]
    if dollars == 0:
        continue
    for j in range(i + 1, n):
        total = dollars * a[j] + leftover
        if total > max_money:
            max_money = total

print(max_money)
```该解决方案首先使用有效地读取输入`sys.stdin.readline`。 我们维持`max_money`考虑到根本不购买的可能性。 对于每个潜在的购买日，整数除法给出 Vasya 可以购买的美元数量，模运算给出剩余的 bourles。 我们跳过无法购买美元的迭代。 嵌套循环考虑所有可能的销售日期，更新看到的最大金额。 仔细使用整数运算可确保没有浮点错误。 

## 工作示例

 **样品1**

 输入：```
2 4
3 7
```| 购买第一天 | 美元 | 剩余| 销售日 总金额| 最大资金 |
 | ---| ---| ---| ---| ---| ---|
 | 0 | 1 | 1 | 1 | 1*7 + 1 = 8 | 8 |

 解释：Vasya 可以用 3 布尔购买 1 美元，留下 1 布尔。 第一天以 7 的价格出售，得到 8，这是最优的。 

**自定义示例**

 输入：```
3 5
5 4 3
```| 购买第一天 | 美元 | 剩余| 销售日 总金额| 最大资金 |
 | ---| ---| ---| ---| ---| ---|
 | 0 | 1 | 0 | 1 | 1*4 + 0 = 4 | 5 |
 | 0 | 1 | 0 | 2 | 1*3 + 0 = 3 | 5 |
 | 1 | 1 | 1 | 2 | 1*3 + 1 = 4 | 5 |

 说明：价格每天都在下降。 任何一天购买都会导致少于最初的 5 个布尔。 最好的办法就是什么都不做。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n²) | 每个买入日都会检查所有后来的卖出日； n ≤ 2000 所以 ~4e6 次操作 |
 | 空间| O(n) | 价格数组，常量额外变量 |

 考虑到限制，该解决方案足够快。 内存使用量很小，远低于 256 MB 限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, b = map(int, input().split())
    a = list(map(int, input().split()))
    max_money = b
    for i in range(n):
        dollars = b // a[i]
        leftover = b % a[i]
        if dollars == 0:
            continue
        for j in range(i + 1, n):
            total = dollars * a[j] + leftover
            if total > max_money:
                max_money = total
    return str(max_money)

# provided sample
assert run("2 4\n3 7\n") == "8", "sample 1"

# minimum-size input
assert run("1 1\n1\n") == "1", "min input"

# prices decreasing
assert run("3 5\n5 4 3\n") == "5", "no profit"

# all-equal prices
assert run("4 10\n2 2 2 2\n") == "10", "no profit all same"

# buy on first day, sell on last
assert run("3 10\n2 5 6\n") == "30", "first to last"

# initial money too small
assert run("3 1\n2 3 4\n") == "1", "cannot buy"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 1 \n 1 | 1 1 1 | 最小输入|
 | 3 5 \n 5 4 3 | 5 4 3 | 3 5 \n 5 4 3 | 3 5 5 | 价格下降，无人购买|
 | 4 10 \n 2 2 2 2 | 4 10 \n 2 2 2 2 | 10 | 10 所有价格均等，无需购买 |
 | 3 10 \n 2 5 6 | 3 10 30| 第一天买入，最后一天卖出可实现利润最大化 |
 | 3 1 \n 2 3 4 | 3 1 \n 2 3 4 | 1 | 初始资金太少买不起|

 ## 边缘情况

 如果初始资金小于所有价格，Vasya 就无法购买任何美元。 例如，`b = 1`和价格`[2,3,4]`。 该算法计算`dollars = b // a[i]`每天为 0，跳过所有迭代，然后离开`max_money = b = 1`。 

如果价格单调下降，那么尽早购买会导致比最初购买的资金更少，因此跳过购买可以获得最大收益。 跟踪证实该算法正确地将总金额与`max_money`每一步都从不选择更糟糕的选择。 

如果价格保持不变，任何买卖周期都相当于保留初始资金，并且
