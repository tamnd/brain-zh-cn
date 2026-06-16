---
title: "CF 102A - 衣服"
description: "我们被要求找到最便宜的方式让杰拉德购买三件相互搭配的衣服。 每件衣服都有一个价格，并且一些成对的物品被标记为匹配。 输入为我们提供了商品总数、价格和匹配对列表。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force"]
categories: ["algorithms"]
codeforces_contest: 102
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 79 (Div. 2 Only)"
rating: 1200
weight: 102
solve_time_s: 102
verified: true
draft: false
---

[CF 102A - 衣服](https://codeforces.com/problemset/problem/102/A)

 **评分：** 1200
 **标签：** 暴力破解
 **求解时间：** 1m 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求找到最便宜的方式让杰拉德购买三件相互搭配的衣服。 每件衣服都有一个价格，并且一些成对的物品被标记为匹配。 输入为我们提供了商品总数、价格和匹配对列表。 我们的输出应该是形成完全连接的匹配三元组的三项的最小总和，如果不存在这样的三元组，则输出为-1。 

该问题可以自然地解释为图问题。 每个服装项目都是一个节点，每个匹配对都是一条无向边。 杰拉德想要在这张图中找到一个三角形，并且在所有三角形中，他想要节点权重（价格）总和最小的那个。 

鉴于限制条件，`n`最多可以达到 100，并且`m`最多 n(n-1)/2，这意味着图可能很稠密。 和`n`这么小，检查所有三元组节点的解决方案是可行的。 然而，我们必须小心地有效地检查三元组是否形成三角形，而不需要多余的计算。 

一个微妙的边缘情况是，恰好有三个项目，但并非所有项目都匹配。 例如，`n=3`并且只存在两条边：我们无法形成有效的三元组，答案必须是-1。 当存在多个三元组时，会出现另一种边缘情况，但其中一个包含非常昂贵的物品； 我们必须找到总和最小的三元组，而不仅仅是任何三角形。 

## 方法

 天真的方法是蛮力：考虑三个项目的每一个组合，并检查所有三对是否都存在于匹配列表中。 这是正确的，但它涉及检查`O(n^3)`三元组，并且对于每个三元组，验证三个边的存在。 和`n=100`,`n^3`是 1,000,000，考虑到 2 秒的限制，这是可以接受的。 

稍微更有效的方法是将每个节点的邻接信息存储在集合中。 然后，对于候选三元组`(i, j, k)`，我们可以在恒定时间内验证边缘是否`(i, j)`,`(i, k)`， 和`(j, k)`存在。 这减少了在原始边缘列表中重复搜索的开销。 

关键的观察结果是这个问题足够小，可以容忍 O(n^3) 迭代，因此不需要复杂的图算法。 使用邻接集简化了边缘检查，并且迭代 i<j<k 确保我们不会多次考虑相同的三元组。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 使用邻接表进行强力三重检查 | O(n^3) | O(n^3) | O(n^2) | O(n^2) | 已接受 |
 | 邻接集的强力三重检查 | O(n^3) | O(n^3) | O(n^2) | O(n^2) | 被接受且更简单|

 ## 算法演练

 1.读取物品数量`n`以及匹配对的数量`m`。 阅读每件商品的价格表。 
2. 为每个节点构造一个邻接集，存储它匹配的项。 这允许 O(1) 边缘检查。 
3. 初始化变量`min_sum`到一个非常大的数字，它将跟踪有效三元组的最小总和。 
4. 迭代所有三元组`(i, j, k)`这样`0 <= i < j < k < n`。 这可确保不会重复三元组​​并考虑所有组合。 
5. 对于每个三元组，检查所有三个边是否都存在于邻接集中：`i-j`,`i-k`,`j-k`。 如果他们这样做，计算他们的价格总和。 
6. 如果该金额小于`min_sum`， 更新`min_sum`。 
7. 检查完所有三元组后，如果`min_sum`已更新，打印出来。 否则，打印 -1 表示不存在有效的三元组。 

为什么有效：该算法系统地考虑每个可能的三元组，并且只接受在匹配图中形成三角形的三元组。 通过保持最小金额，我们确保结果是最便宜的组合。 邻接集保证了快速的边缘查找，因此每个有效的三元组都可以被正确识别，而无需冗余计算。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
prices = list(map(int, input().split()))

# adjacency sets for fast edge lookup
adj = [set() for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    adj[u].add(v)
    adj[v].add(u)

min_sum = float('inf')
for i in range(n):
    for j in range(i+1, n):
        if j not in adj[i]:
            continue
        for k in range(j+1, n):
            if k in adj[i] and k in adj[j]:
                total = prices[i] + prices[j] + prices[k]
                if total < min_sum:
                    min_sum = total

print(min_sum if min_sum != float('inf') else -1)
```该解决方案首先读取价格和边，将邻接信息存储在集合中。 三重迭代确保没有重复的组合，并在恒定时间内检查所有三个边的存在。 使用`float('inf')`作为初始`min_sum`确保我们可以干净地检测到任何有效三元组的缺失。 

## 工作示例

 样本1：

 | 我| j | k | 边缘存在吗？ | 价格总和 | 最小总和 |
 | ---| ---| ---| ---| ---| ---|
 | 0 | 1 | 2 | 是的 | 1+2+3=6 | 6 |

 这里所有三个边都存在，因此使用唯一有效的三元组，得到输出 6。 

示例 2（无三元组）：

 输入：```
3 2
10 20 30
1 2
2 3
```| 我| j | k | 边缘存在吗？ | 价格总和 | 最小总和 |
 | ---| ---| ---| ---| ---| ---|
 | 0 | 1 | 2 | 缺边 0-2 | - | 信息 |

 不存在有效的三元组，因此输出为 -1。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n^3) | O(n^3) | 迭代所有三元组并使用邻接集检查 O(1) 中的边 |
 | 空间| O(n^2) | O(n^2) | 邻接集最多存储 n(n-1)/2 条边 |

 给定`n <= 100`,`n^3`迭代次数约为 1,000,000 次，2 秒内即可轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, m = map(int, input().split())
    prices = list(map(int, input().split()))
    adj = [set() for _ in range(n)]
    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        adj[u].add(v)
        adj[v].add(u)
    min_sum = float('inf')
    for i in range(n):
        for j in range(i+1, n):
            if j not in adj[i]:
                continue
            for k in range(j+1, n):
                if k in adj[i] and k in adj[j]:
                    total = prices[i] + prices[j] + prices[k]
                    if total < min_sum:
                        min_sum = total
    return str(min_sum if min_sum != float('inf') else -1)

# provided samples
assert run("3 3\n1 2 3\n1 2\n2 3\n3 1\n") == "6"
assert run("3 2\n10 20 30\n1 2\n2 3\n") == "-1"

# custom cases
assert run("4 6\n1 2 3 4\n1 2\n1 3\n1 4\n2 3\n2 4\n3 4\n") == "6" # all items form multiple triangles
assert run("3 0\n1 2 3\n") == "-1" # no edges
assert run("5 3\n5 4 3 2 1\n1 2\n2 3\n3 4\n") == "-1" # not enough connected triple
assert run("3 3\n1000000 1000000 1000000\n1 2\n2 3\n1 3\n") == "3000000" # max prices
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 4 6 具有所有边缘 | 6 | 找到全连接图中的最小三角形 |
 | 3 0 | 3 0 -1 | 完全没有边缘处理 |
 | 5 3 | -1 | 尽管有一些边，但处理没有有效三元组的图 |
 | 3 3 最高价格 | 3000000 | 正确计算大价格的总和 |

 ## 边缘情况

 如果正好有三个项目但一对不匹配，例如输入`3 2\n10 20 30\n1 2\n2 3\n`，算法检查三元组`(0,1,2)`，看到那个边缘`0-2`失踪了，并且`min_sum`遗迹`inf`。 它正确打印-1。 

如果所有项目都完全连接，则三重`(i,j,k)`迭代找到多个候选但总是更新`min_sum`到最小的总和。 对于输入 `4 6\n1 2 3 4\n1 2\n1 3\n1 4\n2
