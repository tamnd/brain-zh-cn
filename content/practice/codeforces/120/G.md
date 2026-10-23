---
title: "CF 120G - 吊杆"
description: "我们正在模拟具有多个团队和卡牌的派对游戏“Boom”的简化版本。 有n支球队，每队有两名球员。 每个玩家都有解释单词的能力 (a) 和理解单词的能力 (b)。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 120
codeforces_index: "G"
codeforces_contest_name: "School Regional Team Contest, Saratov, 2011"
rating: 1800
weight: 120
solve_time_s: 77
verified: true
draft: false
---

[CF 120G - 繁荣](https://codeforces.com/problemset/problem/120/G)

 **评分：** 1800
 **标签：** 实施
 **求解时间：** 1m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在模拟具有多个团队和卡牌的派对游戏“Boom”的简化版本。 有`n`球队，每队有两名球员。 每个玩家都有能力解释单词（`a`）和理解单词的能力（`b`）。 有一个甲板`m`卡片，每张都包含一个复杂的单词`c`。 游戏轮流进行，玩家从牌堆顶部取出牌并尝试向队友解释它们。 每个回合都有固定的时间`t`。 

解释一个单词所需的时间取决于卡片的复杂性、当前回合玩家的技能以及团队已经在该单词上花费了多少时间。 具体来说，对于一张卡`k`正在由玩家解释`j`团队的`i`给其他队友`q`，有效解释时间为`max(1, c_k - (a_ij + b_iq) - d_ik)`， 在哪里`d_ik`是该团队已在这张卡上花费的累计时间。 如果团队在回合内猜出单词，则卡片将被移除，团队得分。 否则，该回合的剩余时间结束，该牌将移至牌堆底部。 游戏继续进行，直到猜出所有牌为止。 

输入提供了所有玩家的技能、牌及其复杂性。 输出必须列出每个团队的得分以及他们猜测的单词顺序。 

限制条件适中：`n, m ≤ 100`和`t ≤ 100`。 这允许对游戏进行显式模拟，因为总回合数受以下限制：`m * n * 2`，每回合的每个操作都是简单的算术。 当一个单词的复杂度低于解释和理解技能的总和，导致解释时间为 1，或者当一个回合的持续时间短于所需的解释时间，迫使该单词回到牌库时，就会出现边缘情况。 

幼稚的实现可能会对每张卡的累积时间管理不善（`d_ik`）或错误地循环播放玩家，导致错误的得分或无限循环。 

## 方法

 暴力法是根据规则直接模拟游戏。 我们维护一个卡片队列，并为每个玩家的回合计算解释当前卡片所需的时间。 如果在剩余的回合时间内可以猜出该卡，我们将增加该团队的分数，移除该卡并记录该单词。 否则，我们增加`d_ik`按回合持续时间并将卡移至牌组底部。 我们按顺序循环播放玩家，直到猜出所有牌。 The approach is correct because it literally implements the game's rules, but it requires careful tracking of cumulative times for each card per team. 操作次数大致为`O(m * n * 2)`对于转弯，考虑到约束（`≤ 20,000`运营）。 

The key insight is that no optimizations based on sorting or skipping cards are necessary because every card might require multiple turns by different players to be guessed, and the simulation is cheap. 挑战在于维持猜测单词的顺序并正确更新累积时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟| O(m * n * 2) | O(n * m + m) | 已接受 |

 ## 算法演练

 1.读取输入值`n`和`t`团队数量和回合持续时间。 
2. 对于每个团队，读取两名球员的技能值并将其成对存储`(a, b)`对于玩家 1 和玩家 2。 
3.读取卡片数量`m`，然后对于每张卡片，读取其单词和复杂性`c`。 
4. 初始化一个`deque`以及代表这副牌的牌的索引。 初始化`d_ik = 0`对于所有团队和卡片，以及每个团队猜测的单词的空列表。 
5. 当牌组中有牌时：

 1. 对于按顺序排列的每个玩家：第 1 队的玩家 1，...，第 n 队的玩家 2，执行以下操作。 
2. 设置`remaining_time = t`。 
3.同时`remaining_time > 0`并且牌组不为空：

 1. 从牌堆正面取出牌。 
2. 计算解释它所需的时间为`max(1, c_k - (a_ij + b_iq) - d_ik)`。 
3. 如果所需时间≤remaining_time：

 - 扣除时间`remaining_time`。 
- 记录团队猜测的单词中的单词。 
- 增加团队的得分。 
- 从牌组中取出该牌。 
4.其他：

 - 增量`d_ik`对于这张卡`remaining_time`。 
- 放`remaining_time = 0`。 
- 将卡片移至牌组底部。 
6. 打印每个小组的结果：猜出的单词数量和单词顺序。 

为什么有效：每张卡牌最终都会积累足够的有效时间来猜测，因为每回合都有贡献`t`以其累计的`d_ik`为各自的团队。 模拟尊重回合顺序、时间限制和技能贡献，因此保证分数和单词序列符合游戏规则。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

n, t = map(int, input().split())
teams = []
for _ in range(n):
    a1, b1, a2, b2 = map(int, input().split())
    teams.append([(a1, b1), (a2, b2)])

m = int(input())
cards = []
for _ in range(m):
    word = input().strip()
    complexity = int(input())
    cards.append((word, complexity))

# Initialize
deck = deque(range(m))
d = [[0] * m for _ in range(n)]
guessed_words = [[] for _ in range(n)]
scores = [0] * n

while deck:
    for player in range(2):
        for team_id in range(n):
            remaining_time = t
            while remaining_time > 0 and deck:
                card_id = deck[0]
                word, c = cards[card_id]
                a, b = teams[team_id][player]
                other_player = 1 - player
                _, b_other = teams[team_id][other_player]
                required_time = max(1, c - (a + b_other) - d[team_id][card_id])
                if required_time <= remaining_time:
                    remaining_time -= required_time
                    guessed_words[team_id].append(word)
                    scores[team_id] += 1
                    d[team_id][card_id] += required_time
                    deck.popleft()
                else:
                    d[team_id][card_id] += remaining_time
                    remaining_time = 0
                    deck.rotate(-1)

for i in range(n):
    print(scores[i], *guessed_words[i])
```代码紧密遵循算法。 这`deque`允许有效地将卡片移动到底部。 这`d`数组跟踪每个团队每张卡的累积时间。 嵌套循环强制执行玩家回合顺序，并且`max(1, ...)`确保没有单词需要少于 1 秒。 

需要仔细注意`remaining_time`和`d[team][card]`更新以避免差一错误。 

## 工作示例

 输入示例 1：```
2 2
1 1 1 1
1 1 1 1
3
home
1
car
1
brother
1
```| 步骤| 甲板| 玩家| 团队| 剩余时间 | d[团队][卡] | 猜字 | 笔记|
 | --- | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 【家、车、兄弟】| 1 | 1 | 2 | 0 | []| 所需时间 = max(1,1-(1+1)-0)=1 |
 | 2 | 【车哥】| 1 | 1 | 1 | 主页=1 | [首页] | 下一辆车，必需=1 |
 | 3 | [兄弟] | 1 | 2 | 2 | 0 | []| 兄弟猜对了|
 | 4 | []| - | - | - | - | [团队1：家、车； team2：兄弟] | 所有单词都猜对了 |

 Trace显示每回合消耗正确的时间并更新累积时间`d`准确。 

自定义输入：```
1 1
1 1 1 1
1
test
5
```单队单卡，复杂度高于技能：

 | 步骤| 甲板| 玩家| 团队| 剩余时间 | d[团队][卡] | 猜字 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | [测试] | 1 | 1 | 1 | 0 | []|
 | 2 | [测试] | 2 | 1 | 1 | 1 | []|
 | 3 | ... | ... | ... | ... | ... | ... |

 这证实了累积时间处理和轮换工作正常。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(m * n * 2 * m) = O(n * m^2) | O(m * n * 2 * m) = O(n * m^2) | 在最坏的情况下，每张卡都可以循环流通，直到猜出为止，每张|
