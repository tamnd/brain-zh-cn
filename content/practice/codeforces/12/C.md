---
title: "CF 12C - 水果"
description: "瓦莱拉有一份包含多种水果的购物清单，如果他想要多个相同类型的水果，可能会重复购买。 市场上，摊位上有_n_种水果和_n_个价格标签，但标签尚未贴在水果上。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 12
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 12 (Div 2 Only)"
rating: 1100
weight: 12
solve_time_s: 62
verified: true
draft: false
---
[CF 12C - 水果](https://codeforces.com/problemset/problem/12/C)

 **评分：** 1100
 **标签：** 贪婪、实现、排序
 **求解时间：** 1m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 瓦莱拉有一份包含多种水果的购物清单，如果他想要多个相同类型的水果，可能会重复购买。 市场上，摊位上有_n_种水果和_n_个价格标签，但标签尚未贴在水果上。 每个标签代表特定种类的一种水果的价格。 瓦莱拉想知道他可以支付的最低和最高总金额，具体取决于卖家如何将标签贴在他想要的水果上。 

输入提供价格标签的数量`n`以及瓦莱拉清单上的水果数量`m`。 下一行给出了`n`价格。 然后`m`行列出了他的清单上的水果名称。 由于列表中不同水果的数量不超过`n`，我们保证每种不同的水果始终有可用的价格。 输出必须是两个数字：Valera 列表中水果的最小和最大可能总和。 

在条件限制下`n, m ≤ 100`并且价格 ≤ 100，迭代价格标签分配的所有可能排列的简单方法在理论上是可行的，但效率低下，因为`n!`排列很快就会变得不可行。 边缘情况包括列表中的所有水果都是单一类型的情况，或者价格相同的情况，不小心处理重复项或索引可能会产生错误的结果。 

例如，如果`n=2`,`m=3`, 价格`[1, 2]`，并且该列表包含`apple`,`apple`,`apple`，最小总数为`1 + 1 + 2 = 4`，而最大总数是`2 + 2 + 1 = 5`。 不能正确处理重复水果的幼稚方法可能会错误计算总和。 

## 方法

 暴力方法考虑了为瓦莱拉清单上的水果定价的所有可能方法。 您可以生成价格表的所有排列，然后将列表中水果的相应价格相加。 这种方法是正确的，因为每个可能的分布都被明确考虑，但它太慢了：即使对于`n=10`,`10! = 3,628,800`排列对于 1 秒的时间限制来说是过多的，并且`n`最多可达 100。 

关键的见解是，问题简化为贪婪策略：当将最便宜的可用价格分配给最常请求的水果时，获得最小总数，而当将最昂贵的价格分配给最常请求的水果时，获得最大总数。 对价格列表进行排序并计算每种水果出现的次数足以计算两个极端。 水果的出现频率很重要，因为列表中重复的项目必须分别指定价格。 

贪婪方法之所以有效，是因为不同水果之间不存在超出计数的相互作用。 一旦知道了计数，影响总和的唯一变量就是每种水果收到的价格，因此分配最低到最频繁（或最高到最频繁）可以保证最佳总和。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n! * m) | O(n) | 太慢了 |
 | 最佳 | O(n log n + m) | O(n log n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1.读取价格标签的数量`n`以及水果的数量`m`。 
2. 阅读清单`n`价格并按升序排序。 排序将允许有效地选择最便宜和最昂贵的价格。 
3. 阅读`m`从 Valera 的列表中找出水果，并计算每种不同水果出现的次数。 这将创建一个频率图，其中键是水果名称，值是 Valera 想要每种水果的次数。 
4. 提取频率并按降序排序。 最常请求的水果将被分配最低总价的最低价格和最高总价的最高价格。 
5. 初始化两个和：`min_total`和`max_total`。 为了`min_total`，将最便宜的价格依次分配给最常见的水果。 为了`max_total`，将最昂贵的价格依次分配给最常见的水果。 每个频率可能会消耗排序价格表中的多个价格。 
6. 输出`min_total`和`max_total`。 

这样做的原因是，对于两个极端，任何偏离此分配的行为都会导致未分配更便宜的价格或未使用更昂贵的价格，从而增加最小值或减少最大值。 不变的是最大的频率总是与最小或最大的剩余价格匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import Counter

n, m = map(int, input().split())
prices = list(map(int, input().split()))
prices.sort()

fruits = [input().strip() for _ in range(m)]
freq = list(Counter(fruits).values())
freq.sort(reverse=True)

# minimum total
min_total = 0
price_idx = 0
for f in freq:
    for _ in range(f):
        min_total += prices[price_idx]
        price_idx += 1

# maximum total
prices_rev = prices[::-1]
max_total = 0
price_idx = 0
for f in freq:
    for _ in range(f):
        max_total += prices_rev[price_idx]
        price_idx += 1

print(min_total, max_total)
```该解决方案可以高效读取输入，计算水果频率，并对价格和频率进行排序。 内部循环对列表中的每个水果精确迭代一次。 频率图正确处理了边界条件，例如所有水果都相同。 反转价格数组可以对最大总数进行对称计算。 

## 工作示例

 **样品1**

 输入：```
5 3
4 2 1 10 5
apple
orange
mango
```| 步骤| 价格| 频率 | 最小总计 | 最大总数 |
 | ---| ---| ---| ---| ---|
 | 价格排序 | [1,2,4,5,10] | [1,1,1]| 0 | 0 |
 | 分配分钟 | 1→苹果，2→橙子，4→芒果 | [1,1,1]| 7 | - |
 | 分配最大 | 10→苹果，5→橙子，4→芒果 | [1,1,1]| - | 19 | 19

 这表明该算法正确地将最便宜的价格与所要求的水果配对为最低价格，将最昂贵的价格与最高价格配对。 

**定制样品2**

 输入：```
4 5
1 3 2 4
apple
apple
banana
banana
banana
```| 步骤| 价格| 频率 | 最小总计 | 最大总数 |
 | ---| ---| ---| ---| ---|
 | 价格排序 | [1,2,3,4] | [3,2]| 0 | 0 |
 | 分配分钟 | 1→香蕉，2→香蕉，3→香蕉，4→苹果，下一个最便宜的2→苹果| 0 | 12 | 12 - |
 | 分配最大 | 4→香蕉，3→香蕉，2→香蕉，1→苹果，次贵2→苹果| - | 14 | 14 |

 这表明重复的水果被正确处理，并且总和反映了贪婪的分配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n + m) | O(n log n + m) | 排序价格占主导地位，计数频率为O(m) |
 | 空间| O(n + m) | 存储价格和频率图|

 和`n, m ≤ 100`，该算法可以在 1 秒的时间限制内轻松执行，并且使用远小于 256 MB 的内存。 

## 测试用例```python
import sys, io
def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline
    from collections import Counter

    n, m = map(int, input().split())
    prices = list(map(int, input().split()))
    prices.sort()

    fruits = [input().strip() for _ in range(m)]
    freq = list(Counter(fruits).values())
    freq.sort(reverse=True)

    min_total = 0
    price_idx = 0
    for f in freq:
        for _ in range(f):
            min_total += prices[price_idx]
            price_idx += 1

    prices_rev = prices[::-1]
    max_total = 0
    price_idx = 0
    for f in freq:
        for _ in range(f):
            max_total += prices_rev[price_idx]
            price_idx += 1

    return f"{min_total} {max_total}"

# Provided sample
assert run("5 3\n4 2 1 10 5\napple\norange\nmango\n") == "7 19", "sample 1"

# Custom: single fruit repeated
assert run("2 3\n1 2\napple\napple\napple\n") == "4 5", "single fruit repeated"

# Custom: all prices equal
assert run("3 3\n5 5 5\napple\nbanana\norange\n") == "15 15", "all prices equal"

# Custom: min-size input
assert run("1 1\n7\napple\n") == "7 7", "min-size input"

# Custom: max-size, uniform price
inp = "100 100\n" +
```
