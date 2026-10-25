---
title: "CF 1286A - 花环"
description: "我们有一排 n 个灯泡，每个灯泡编号从 1 到 n。 某些灯泡丢失，由输入数组中的零表示。"
date: "2026-06-11T19:09:52+07:00"
tags: ["codeforces", "competitive-programming", "dp", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1286
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 612 (Div. 1)"
rating: 1800
weight: 1286
solve_time_s: 162
verified: true
draft: false
---

[CF 1286A - 加兰](https://codeforces.com/problemset/problem/1286/A)

 **评分：** 1800
 **标签：** dp、贪婪、排序
 **求解时间：** 2m 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一行`n`灯泡，每个编号为`1`到`n`。 某些灯泡丢失，由输入数组中的零表示。 我们的目标是使用尚不存在的数字来填充缺失的灯泡，并将它们放置在一个序列中，以最大限度地减少具有不同奇偶校验的相邻对的数量。 在这个问题中，复杂性计算有多少个相邻的对有一个偶数和一个奇数。 例如，如果一个序列是`1 4 2 3 5`，奇数和偶数之间有两种转换：`(1,4)`和`(2,3)`。 

输入尺寸很小：`n`可以达到 100。这意味着我们可以负担得起`O(n^3)`甚至`O(n^4)`方法，但是一个`O(n^2)`动态规划解决方案更清晰、更健壮。 如果不考虑奇偶性，只是贪婪地放置最小的缺失数字，那么粗心的方法很容易造成不必要的转换。 例如，如果`n=4`顺序是`0 0 1 0`，从左到右填充零而不考虑奇偶校验可能会产生`[2,3,1,4]`，产生三个奇偶校验跃迁，而`[3,2,1,4]`只产生一个。 

当所有缺失位置连续或位于末尾时，就会出现边缘情况。 在这些情况下，我们需要跟踪最后放置的灯泡的奇偶校验以避免额外的复杂性。 

## 方法

 一个简单的暴力解决方案会尝试丢失数字的所有可能的排列，计算每个排列所产生的复杂性，并返回最小值。 这是有效的，因为有`k`缺少数字，所以原则上需要`k!`安排。 然而，在最坏的情况下`k=n=100`，这是一个天文数字（`100!`）并且显然不可行。 即使尝试所有方法将缺失的数字分为奇数组和偶数组，组合也会很快爆炸。 

关键的观察结果是，复杂性仅取决于相邻数字的奇偶性，而不取决于它们的确切值。 这使我们能够将问题简化为**关于位置和奇数和偶数的剩余计数的动态规划问题**。 具体来说，对于数组中的每个位置，如果前一个数字是奇数或偶数，我们可以跟踪最小复杂度，以及剩余未使用的奇数和偶数灯泡的数量。 DP状态为`(pos, odd_remaining, even_remaining, prev_parity)`并且转换在当前零位置放置一个奇数或偶数，如果它不同于`prev_parity`。 

这种结构之所以有效，是因为每个决定仅取决于先前数量的奇偶性以及每种类型剩余的灯泡数量。 我们永远不需要知道确切的值。 我们使用记忆来存储中间结果并避免重新计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(k!) | O(n) | 太慢了|
 | DP 超过奇偶校验 | O(n^3) | O(n^3) | O(n^3) | O(n^3) | 已接受 |

 ## 算法演练

 1. 确定数组中缺少哪些数字，并将它们分为奇数和偶数。 如果总数来自`1`到`n`，通过减去已经存在的数字来计算缺失的数字。 
2.定义DP表`dp[pos][odd_left][even_left][prev_parity]`， 在哪里`pos`是当前索引，`odd_left`和`even_left`计算还有多少个未使用的奇数和偶数灯泡，以及`prev_parity`是前一个放置的灯泡的奇偶校验。 将所有值初始化为无穷大，除了没有放置灯泡的起始位置和`prev_parity`可以是未定义的。 
3. 迭代位置。 如果灯泡已放置（非零），则通过仅考虑与其奇偶校验一致的转换来更新 DP，如果其奇偶校验不同于`prev_parity`。 如果灯泡丢失（零），请尝试放置奇数或偶数灯泡（如果有）。 通过在两个选择中取最小复杂度来更新 DP 表。 
4. 最后，答案是其中的最小值`dp[n][0][0][0]`和`dp[n][0][0][1]`，代表放置的所有灯泡，最后一个灯泡是偶数或奇数。 
5. 返回这个最小值作为花环的最小复杂度。 

工作原理：DP 保证了正确性，因为在每一步中，我们都会考虑零奇偶校验的所有有效选择，并跟踪剩余奇数/偶数灯泡的确切数量。 由于复杂性仅取决于奇偶校验转换，因此 DP 状态完全捕获最佳决策所需的信息。 记忆确保重叠子问题仅计算一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
p = list(map(int, input().split()))

used = [False] * (n + 1)
for x in p:
    if x != 0:
        used[x] = True

odd_left = sum(1 for i in range(1, n+1) if not used[i] and i % 2 == 1)
even_left = sum(1 for i in range(1, n+1) if not used[i] and i % 2 == 0)

INF = 10**9
dp = [[[INF, INF] for _ in range(even_left+1)] for _ in range(odd_left+1)]
dp[odd_left][even_left][0] = 0
dp[odd_left][even_left][1] = 0

for idx, val in enumerate(p):
    new_dp = [[[INF, INF] for _ in range(even_left+1)] for _ in range(odd_left+1)]
    for o in range(odd_left+1):
        for e in range(even_left+1):
            for prev_parity in [0,1]:
                if dp[o][e][prev_parity] >= INF:
                    continue
                if val != 0:
                    cur_parity = val % 2
                    add = 0 if idx == 0 or cur_parity == prev_parity else 1
                    new_dp[o][e][cur_parity] = min(new_dp[o][e][cur_parity], dp[o][e][prev_parity] + add)
                else:
                    if o > 0:
                        cur_parity = 1
                        add = 0 if idx == 0 or cur_parity == prev_parity else 1
                        new_dp[o-1][e][cur_parity] = min(new_dp[o-1][e][cur_parity], dp[o][e][prev_parity] + add)
                    if e > 0:
                        cur_parity = 0
                        add = 0 if idx == 0 or cur_parity == prev_parity else 1
                        new_dp[o][e-1][cur_parity] = min(new_dp[o][e-1][cur_parity], dp[o][e][prev_parity] + add)
    dp = new_dp

res = min(dp[0][0][0], dp[0][0][1])
print(res)
```解释：我们首先计算未使用的奇数和偶数。 然后我们使用 DP 过来`(odd_left, even_left, prev_parity)`而不是效率的完整指数。 对于每个位置，我们将前一个状态传播到下一个状态，如果奇偶校验发生变化，就会增加复杂性。 我们仔细检查边界以避免负指数。 处理完所有位置后取最小复杂度。 

## 工作示例

 ### 示例 1

 输入：`5\n0 5 0 2 3\n`| idx | 值| 哦| 电子| 上一个奇偶校验 | new_dp[奇数][偶数][cur_parity] |
 | ---| ---| ---| ---| ---| ---|
 | 0 | 0 | 2 | 1 | - | 尝试奇数：1，偶数：2 |
 | 1 | 5 | - | - | - | 只考虑奇偶校验=1，如果奇偶校验相同则加0，否则加1 |
 | 2 | 0 | 1 | 1 | - | 尝试奇数/偶数放置 |
 | 3 | 2 | - | - | - | 仅考虑奇偶校验=0 |
 | 4 | 3 | - | - | - | 仅考虑奇偶校验=1 |

 结果：`2`过渡。 

### 示例 2

 输入：`7\n0 7 3 5 0 0 0\n`在跟踪剩余的奇数/偶数灯泡的同时处理全零会导致最佳放置的单一转换。 

这些痕迹证实我们的 DP 正确处理内部零和终端零。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n^3) | O(n^3) | 三个嵌套循环：odd_left (≤n/2)、even_left (≤n/2)、prev_parity (2) |
 | 空间| O(n^3) | O(n^3) | DP 表大小 (odd_left+1) * (even_left+1) * 2 |

 给定`n≤100`，最坏情况的操作量约为 50^2_2_100=~500,000，在 1s 时间限制下是可以接受的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    exec(open('solution.py').read())  # assuming code above is saved as solution.py
    return sys.stdout.getvalue().strip()

# provided samples
assert run("5\n0 5 0
```
