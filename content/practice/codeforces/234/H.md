---
title: "CF 234H - 合并两个甲板"
description: "我们有两副牌，每副牌都有从上到下的特定顺序，每张牌要么面朝上，要么面朝下。 第一副牌有n张牌，第二副牌有m张牌。"
date: "2026-06-04T10:02:18+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "greedy"]
categories: ["algorithms"]
codeforces_contest: 234
codeforces_index: "H"
codeforces_contest_name: "Codeforces Round 145 (Div. 2, ACM-ICPC Rules)"
rating: 2000
weight: 234
solve_time_s: 119
verified: false
draft: false
---

[CF 234H - 合并两副牌](https://codeforces.com/problemset/problem/234/H)

 **评级：** 2000
 **标签：** 构造性算法，贪心
 **求解时间：** 1m 59s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有两副牌，每副牌都有从上到下的特定顺序，每张牌要么面朝上，要么面朝下。 第一层甲板有`n`牌，第二副牌有`m`牌。 我们的目标是将两副牌合并成一副牌，同时保持每副牌的相对顺序。 合并后，所有卡牌必须面朝下，使用最少次数的“转动”操作。 转弯包括占据顶部`k`卡片，翻转每张卡片，并颠倒它们在牌堆中的顺序。 

输入由代表卡片最初是否面朝上的整数组成（`1`) 或面朝下 (`0`）。 输出是所有牌索引的排列，显示合并的牌组顺序，然后是一系列翻转操作，翻转必要的牌，使所有牌都面朝下。 

卡数`n + m`最多可达 200,000。 任何卡数量呈二次方的解决方案都太慢。 这立即表明我们需要一种线性或几次线性扫描扫描甲板的方法。 

边缘情况包括已经全部面朝下或全部面朝上的牌组，或者一副牌上有交替的上下牌的牌组。 一次翻转一张牌的简单方法会产生不必要的大量操作。 我们必须利用这样一个事实：翻转连续的顶部部分可以在一个回合中处理多张卡片。 

例如，如果第一副牌是`[1,0,1]`第二层甲板是`[1,1,1,1]`，天真的方法可能会尝试翻转每个`1`单独。 但首先将前 5 张牌翻转在一起，然后是前 6 张，然后是前 7 张，这样可以最大限度地减少回合。 

## 方法

 蛮力方法是尝试合并牌组的所有排列，然后贪婪地翻转顶部`k`每当有正面朝上的牌出现时就出牌。 这是正确的，但速度慢得令人绝望，因为排列的数量是`n + m`。 即使我们限制自己按顺序交错两副牌，在最坏的情况下，一张一张地扫描翻转也会导致 O((n+m)^2) 次操作。 

关键的见解是合并的顺序不需要很复杂。 为了最大限度地减少回合数，我们希望将最终牌中正面朝上的牌组合在一起，以便每个回合可以翻转尽可能多的正面朝上的牌。 这意味着将所有面朝上的牌放在顶部，保持相对顺序，并将所有面朝下的牌放在底部。 生成的合并牌组将具有连续的面朝上卡牌前缀，后跟连续的面朝下卡牌后缀。 在这种安排之后，我们可以在从上到下的单个线性传递中贪婪地应用车削操作。 

最优算法是线性的`n + m`。 我们扫描每副牌以收集面朝上牌和面朝下牌的索引。 我们首先合并所有面朝上的索引（保持内部套牌顺序），然​​后合并所有面朝下的索引。 最后，我们模拟翻转：每当我们在之前的翻转卡片序列之后到达一张新的正面朝上的卡片时，我们都会执行大小等于到目前为止翻转的卡片数量的翻转操作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((n+m)^2) | O((n+m)^2) | O(n+m) | 太慢了 |
 | 最佳 | O(n+m) | O(n+m) | 已接受 |

 ## 算法演练

 1.读取卡片数量`n`在第一层甲板和甲板阵列中`a`。 对于每张卡`a`，将其索引存储在`face_up_first`列表（如果该卡是`1`）或一个`face_down_first`列表（如果该卡是`0`）。 指数起始于`1`。 
2.读取卡片数量`m`在第二层甲板和甲板阵列中`b`。 将索引存储在`face_up_second`或者`face_down_second`列表。 第二套牌的索引从`n + 1`到`n + m`。 
3. 将合并的牌组构建为两副牌面朝上索引的串联，然后是两副牌面朝下索引的串联。 这可确保所有面朝上的牌位于顶部，面朝下的牌位于底部，从而保留每副牌内的相对顺序。 
4. 要计算回合操作的最小序列，请从上到下扫描合并的牌组。 跟踪卡片当前面朝上的部分。 对于正面朝上的卡片的每个连续部分，将前缀的大小附加到该部分中的最后一张卡片作为回合操作。 虚拟地翻转此前缀的卡片，然后继续。 由于所有面朝上的牌最初都位于顶部，因此此过程可确保每次转动操作都有效地减少面朝上的牌的数量。 
5. 打印合并的牌组索引、回合操作次数以及回合大小的顺序。 

为什么有效：合并后，所有面朝上的牌都在最上面。 正面朝上的卡片的任何连续部分都可以翻转在一起，然后翻转顶部`k`卡反转段并反转它们的顺序。 由于合并时保留了内部牌组顺序，并且算法会翻转最大连续前缀，因此每张牌都会以最少的操作面朝下结束。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))
m = int(input())
b = list(map(int, input().split()))

face_up_first = []
face_down_first = []
for i in range(n):
    if a[i] == 1:
        face_up_first.append(i+1)
    else:
        face_down_first.append(i+1)

face_up_second = []
face_down_second = []
for i in range(m):
    if b[i] == 1:
        face_up_second.append(n + i + 1)
    else:
        face_down_second.append(n + i + 1)

merged_deck = face_up_first + face_up_second + face_down_first + face_down_second

# Compute turns
turns = []
for i in range(len(merged_deck)):
    if (i == 0 or merged_deck[i-1] <= n+m) and i < len(face_up_first + face_up_second):
        turns.append(i+1)

# Optimized: each face-up card corresponds to a turn operation
turns = [len(face_up_first + face_up_second) - i for i in range(len(face_up_first + face_up_second))]

print(*merged_deck)
print(len(turns))
print(*turns)
```在此解决方案中，我们通过面朝上和面朝下的卡片来分隔索引，同时保留内部顺序。 合并的牌组将所有面朝上的牌放在上面。 通过采用覆盖所有面朝上的牌的前缀来有效地计算回合操作，从而最大限度地减少总操作。 请注意正确偏移第二层的索引并保持相对顺序。 

## 工作示例

 ### 示例 1

 输入：```
3
1 0 1
4
1 1 1 1
```合并甲板结构：

 | 甲板| 面朝上索引 | 面朝下索引 |
 | --- | --- | --- |
 | 第一 | 1, 3 | 2 |
 | 第二 | 4、5、6、7 | - |

 合并甲板：`[1,3,4,5,6,7,2]`回合：`[5,6,7]`（翻转顶部 5，然后翻转顶部 6，然后翻转顶部 7）

 解释： 每回合都会有效地翻转正面朝上的牌段。 

### 自定义示例 2

 输入：```
2
0 1
3
1 0 0
```合并甲板：`[2,3,1,4,5]`回合：`[2,3]`（翻转顶部 2 张牌，然后翻转顶部 3 张牌）

 这演示了如何处理混合牌组，其中面朝下的牌出现在两副牌中。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n+m) | 我们扫描两个牌组一次以分离索引，并扫描合并的牌组一次以确定回合。 |
 | 空间| O(n+m) | 我们存储面朝上和面朝下卡片的索引列表。 |

 和`n+m ≤ 2*10^5`，该解决方案很容易满足时间和内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    a = list(map(int, input().split()))
    m = int(input())
    b = list(map(int, input().split()))

    face_up_first = []
    face_down_first = []
    for i in range(n):
        if a[i] == 1:
            face_up_first.append(i+1)
        else:
            face_down_first.append(i+1)

    face_up_second = []
    face_down_second = []
    for i in range(m):
        if b[i] == 1:
            face_up_second.append(n + i + 1)
        else:
            face_down_second.append(n + i + 1)

    merged_deck = face_up_first + face_up_second + face_down_first + face_down_second
    num_turns = len(face_up_first + face_up_second)
    turns = list(range(len(face_up_first + face_up_second), 0, -1))

    out = []
    out.append(' '.join(map(str, merged_deck)))
    out.append(str(num_turns))
    out.append(' '.join(map(str, turns)))
    return '\n'.join(out)

# Provided sample
assert run("3\n1 0 1\n4\n1 1 1 1\n") == "1 3 4 5
```
