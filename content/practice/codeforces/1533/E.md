---
title: "CF 1533E - 国际象棋队组建"
description: "我们的任务是组建一支国际象棋队，在 Polycarp 现有的 $n$ 成员名册中添加一名最终棋手。 每个玩家的实力都是整数，对方队伍已经有$n+1$人。"
date: "2026-06-10T16:22:14+07:00"
tags: ["codeforces", "competitive-programming", "*special", "binary-search", "data-structures", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1533
codeforces_index: "E"
codeforces_contest_name: "Kotlin Heroes: Episode 7"
rating: 0
weight: 1533
solve_time_s: 192
verified: true
draft: false
---

[CF 1533E - 国际象棋团队组建](https://codeforces.com/problemset/problem/1533/E)

 **评级：** -
 **标签：** *特殊，二分查找，数据结构，贪心
 **求解时间：** 3m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们的任务是组建一支国际象棋队，在波利卡普现有的名单中增加一名最终棋手。$n$成员。 每个球员的实力都是整数，而对方球队已经有$n+1$成员。 目标是从其中选择一名候选人$m$选项，以便在将我们的球队与对方球队配对后，玩家的对手和他们自己之间的最大差异（游戏难度）被最小化。 

这些意见为我们提供了当前团队的技能$a_1 \dots a_n$, 对方球队$b_1 \dots b_{n+1}$，以及候选选项$c_1 \dots c_m$。 对于每个候选人，我们需要计算通过最佳配对玩家可以实现的最小可能难度。 

限制因素很大：$n$和$m$可以达到$2 \cdot 10^5$，意味着任何$O(n \cdot m)$或者$O(n^2)$方法会太慢。 执行 2 秒后，我们需要一个接近于$O(n \log n + m \log n)$或更好。 

幼稚的实现可能会错过的边缘情况包括候选人的技能比所有现有团队成员小得多或大得多的情况。 例如，如果所有$a_i = 1$候选人是$c_k = 10^9$，配对不当可能会产生巨大的困难。 不考虑排序和最佳配对顺序的粗心算法会在这些极端情况下产生错误的结果。 

## 方法

 暴力方法会考虑将每个候选人添加到团队中，生成所有候选人$n+1$分解与对方球队可能的配对，并计算每个配对的最大难度。 这种做法原则上是正确的，但根本不可行。 为了$n = 2 \cdot 10^5$，排列的数量是天文数字。 

关键的观察是，最小化最大差异相当于在排序后将最小的技能与最小的相反技能相匹配，以及将最大的技能与最大的技能相匹配。 这是因为函数$f(x) = b_j - a_i$就排序而言是单调的：将强大的玩家与强大的对手匹配可以减少最坏情况的差距。 因此，对现有团队和对手进行排序可以让我们预先计算连续成员之间的差异。 我们可以计算两个差异数组，一个表示跳过第一个对手，另一个表示跳过最后一个对手，从而有效地覆盖新候选者的所有插入点。 然后，对于每个候选者，二分搜索找到排序团队中的正确位置，并且预先计算的数组很快给出最小的难度。 

我们只需要在排序后考虑相邻对的观察就减少了问题$O((n+1)!)$到$O(n \log n + m \log n)$，这对于输入大小来说是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O((n+1)!) | O(n) | 太慢了 |
 | 排序+贪心+二分查找| O(n log n + m log n) | O(n log n + m log n) | O(n) | 已接受 |

 ## 算法演练

 1. 对波利卡普目前的队伍进行排序$a$和对方球队$b$。 这确保了按顺序配对可以最大限度地减少个人困难。 
2. 计算两个前缀数组：`left_diffs`用于配对$a_i$和$b_{i-1}$（跳过第一个对手）和`right_diffs`用于配对$a_i$和$b_i$（跳过最后一个对手）。 每个存储该场景的最大差异。 这些数组代表了新候选人可以填补的两个自然“空白”。 
3. 对于每位候选人$c_k$，使用二分查找来确定哪里$c_k$适合排序的团队$a$。 这确定了它将占据哪个对手的差距。 
4. 将左侧前缀的最大难度、候选者引入的差异以及右侧后缀的最大难度相结合来计算难度。 此步骤使用预先计算的数组$O(1)$使用权。 
5. 输出每个候选人的最低难度。 

为什么有效：排序可确保按顺序配对最小化最大差异。 预先计算前缀最大值使我们能够有效地计算任何候选插入的新最大难度。 二分搜索保证候选人被放置在相对于现有团队的最佳位置。 通过构造，该算法始终评估每个候选者可实现的最小最大差异。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
import bisect

n = int(input())
a = list(map(int, input().split()))
b = list(map(int, input().split()))
m = int(input())
c = list(map(int, input().split()))

a.sort()
b.sort()

left = [0] * n
right = [0] * n

for i in range(n):
    left[i] = b[i] - a[i]
for i in range(n):
    right[i] = b[i+1] - a[i]

pref_left = [0] * (n+1)
pref_right = [0] * (n+1)

for i in range(n):
    pref_left[i+1] = max(pref_left[i], left[i])
for i in range(n-1, -1, -1):
    pref_right[i] = max(pref_right[i+1], right[i])

res = []
for val in c:
    idx = bisect.bisect_left(a, val)
    max_left = pref_left[idx]
    max_right = pref_right[idx]
    max_diff = max(max_left, max_right, b[idx] - val)
    res.append(str(max_diff))

print(' '.join(res))
```该解决方案首先对球队进行排序，然后在跳过对手阵列的任一端时预先计算差异。 二分搜索确定候选者的最佳插入点，并在恒定时间内计算每个候选者的最大难度。 仔细处理前缀数组可以防止 off-by-o
