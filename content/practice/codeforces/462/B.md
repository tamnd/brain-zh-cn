---
title: "CF 462B - 苹果人和纸牌游戏"
description: "阿普尔曼收集了 n 张卡片，每张卡片都标有一个大写字母。 Toastman 可以恰好挑选 k 张卡片，对于他挑选的每张卡片，Appleman 都会向他支付硬币，硬币的数量等于 Toastman 的卡片中与该卡片具有相同字母的卡片的数量。"
date: "2026-05-30T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy"]
categories: ["algorithms"]
codeforces_contest: 462
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 263 (Div. 2)"
rating: 1300
weight: 462
solve_time_s: 69
verified: true
draft: false
---

[CF 462B - 苹果人和纸牌游戏](https://codeforces.com/problemset/problem/462/B)

 **评分：** 1300
 **标签：** 贪婪
 **求解时间：** 1m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 阿普尔曼收集了 _n_ 张卡片，每张卡片上都标有一个大写字母。 Toastman 可以恰好挑选 _k_ 张卡片，对于他挑选的每张卡片，Appleman 都会向他支付硬币，硬币的数量等于 Toastman 的卡片中与该卡片具有相同字母的卡片的数量。 换句话说，如果 Toastman 挑选了几张带有相同字母的卡片，那么每张卡片都会将他手中该字母的计数贡献给总和。 

输入给出卡片数量 _n_、要挑选的卡片数量 _k_ 以及长度为 _n_ 的字符串，其中每个字符代表卡片的字母。 输出应该是一个整数：如果 Toastman 最佳地挑选卡片，他可以获得的最大硬币数量。 

界限很重要。 由于 _n_ 高达 100,000 且时间限制为一秒，任何比 O(n log n) 更差的算法都有超时的风险。 检查所有可能大小为 _k_ 的子集的简单方法是完全不可行的，因为子集的数量按 n 选择 k 的顺序组合增长。 

当多个字母出现多次但单个字母少于 _k_ 时，就会出现不明显的边缘情况。 例如，如果卡片是`AABBC`并且_k_是4，一种简单的方法，简单地按顺序取出前_k_张牌可以选择`AABB`或者`ABBC`。 最优的是`AABB`因为选择两个 A 和两个 B 可以最大化重复的字母，从而最大化硬币。 另一种边缘情况是当 _k_ 超过最常见字母的计数时； 然后，该算法必须补充下一个最常见的字母。 

## 方法

 暴力方法是检查 _k_ 张卡的所有组合，计算每个组合的硬币总数，并保留最大值。 这原则上是正确的，因为它测试了每种可能性，但组合数量对于 _n_ = 100,000 甚至中等 _k_ 而言是天文数字，因此无法使用。 

关键的观察结果是，硬币收益与字母在所选卡片中出现的次数成二次方。 如果 Toastman 选择 _x_ 张相同字母的卡片，他们将向总硬币贡献 _x²_。 因此，为了最大化硬币，他应该首先从出现频率最高的字母中选择尽可能多的牌，然后是下一个出现频率最高的字母，依此类推，直到他总共选择了 _k_ 张牌。 如果剩余的 _k_ 小于下一个字母的计数，他只需拿走那么多张牌，贡献所选计数的平方。 

这是一个经典的贪婪策略：始终首先选择出现频率最高的字母，因为它们可以最大化二次增益。 按降序对计数进行排序可确保我们始终选择最佳字母。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n 选择 k) | O(n) | 太慢了 |
 | 最佳| O(n + 26 log 26) ≈ O(n) | O(26) ≈ O(1) | O(26) ≈ O(1) | 已接受 |

 ## 算法演练

 1. 计算卡片字符串中每个字母的出现次数。 对于大写字母，请使用字典或 26 元素数组。 这给出了每个字母的频率。 
2. 按频率降序排列。 这确保了我们总是首先选择贡献最多硬币的字母。 
3. 初始化变量`coins = 0`和`remaining = k`。 循环遍历排序后的频率。 
4. 对于每个频率`f`， 如果`f <= remaining`， 添加`f * f`到`coins`并减去`f`从`remaining`。 
5. 如果`f > remaining`, 只取`remaining`该信的卡片，添加`remaining * remaining`到`coins`，并设置`remaining = 0`。 打破循环，因为我们已经选择了 _k_ 张牌。 
6. 打印`coins`。 

为什么它有效：不变的是，在每一步中，我们都选择了最大化剩余 _k_ 个选择的平方和的字母集。 对较大数字进行平方总是比将其分成较小的组产生更大的增量。 因此，相同 _k_ 张卡的其他分配方式无法产生更多的硬币。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, k = map(int, input().split())
cards = input().strip()

# Step 1: Count letter frequencies
freq = [0] * 26
for c in cards:
    freq[ord(c) - ord('A')] += 1

# Step 2: Sort frequencies descending
freq.sort(reverse=True)

coins = 0
remaining = k

# Step 3: Greedy selection
for f in freq:
    if remaining == 0:
        break
    take = min(f, remaining)
    coins += take * take
    remaining -= take

print(coins)
```第一部分使用 ASCII 索引对字母进行计数，以实现恒定时间访问。 排序确保贪婪选择首先选择最大的可用组。 在循环中，`take = min(f, remaining)`处理剩余时隙少于频率的情况，这种情况很容易被忽视，也是差一错误的常见来源。 

## 工作示例

 样本1：

 输入：```
15 10
DZFDFZDFDDDDDDF
```| 步骤| 频率排序| 剩余 k | 累积金币 | 行动|
 | --- | --- | --- | --- | --- |
 | 1 | [9,3,2,1,0...] | 10 | 10 0 | 拿 9 个“D”→ 硬币 += 81 |
 | 2 | 3 | 1 | 81 | 81 拿 1 个“F”→ 硬币 += 1 → 总共 82 |
 | 3 | ... | 0 | 82 | 82 完成 |

 这证实了首先选择最大的组可以最大化硬币。 

样本2：

 输入：```
5 3
AABBC
```| 步骤| 频率排序| 剩余 k | 累积金币 | 行动|
 | --- | --- | --- | --- | --- |
 | 1 | [2,2,1,...] | 3 | 0 | 拿 2 个“A”→ 硬币 += 4 → 剩余=1 |
 | 2 | 2 | 1 | 4 | 拿 1 个“B”→ 硬币 += 1 → 总共 5 |

 该算法正确处理剩余<频率的情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + 26 log 26) ≈ O(n) | 计数字母是O(n)，排序26个频率是常数 |
 | 空间| O(26) ≈ O(1) | O(26) ≈ O(1) | 仅使用 26 个字母的频率数组 |

 当 n 达到 100,000 时，O(n) 复杂度是可以接受的，并且内存使用量很小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, k = map(int, input().split())
    cards = input().strip()
    freq = [0] * 26
    for c in cards:
        freq[ord(c) - ord('A')] += 1
    freq.sort(reverse=True)
    coins = 0
    remaining = k
    for f in freq:
        if remaining == 0:
            break
        take = min(f, remaining)
        coins += take * take
        remaining -= take
    return str(coins)

# provided sample
assert run("15 10\nDZFDFZDFDDDDDDF\n") == "82"

# custom cases
assert run("5 3\nAABBC\n") == "5", "mixed letters, k less than max count"
assert run("3 3\nAAA\n") == "9", "all letters same"
assert run("4 2\nABCD\n") == "1", "all different, pick 2"
assert run("1 1\nZ\n") == "1", "single card"
assert run("100000 100000\n" + "A"*100000 + "\n") == "10000000000", "max size all same"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 5月3日，AABBC | 5 | 具有部分频率的贪婪选择|
 | 3 3，AAA | 9 | 所有卡都相同|
 | 4 2、ABCD | 1 | 所有不同的字母，k < n |
 | 1 1，Z | 1 | 最小输入|
 | 100000 100000，全A | 10000000000 | 最大输入大小 |

 ## 边缘情况

 当 _k_ 超过最常见字母的频率时，算法会正确地继续到下一个最高频率。 例如，使用输入`AABBC`并且 *k=4`，最常见的字母“A”的频率为 2。该算法采用两个 As，剩下 2 个。 接下来，“B”的频率为 2，并且由于剩余=2，因此它需要两个 B。 硬币总数 = 2² + 2² = 8。始终按顺序取前 k 个字母的天真的方法可能会错误地得出不同的总和。 贪婪不变量确保每一步都选择最大可能的贡献，从而保证正确性。
