---
title: "CF 102566G - 扑克之星"
description: "每个玩家收到五张私人牌后，我们就会得到一个扑克牌桌状态。 唯一未知的牌是两张共享牌桌的牌。 任务是计算每个玩家在翻开这两张牌后成为获胜者的概率。"
date: "2026-08-06T21:00:58+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102566
codeforces_index: "G"
codeforces_contest_name: "AGM 2020, Qualification Round"
rating: 0
weight: 102566
solve_time_s: 96
verified: true
draft: false
---

[CF 102566G - 扑克之星](https://codeforces.com/problemset/problem/102566/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 36s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个玩家收到五张私人牌后，我们就会得到一个扑克牌桌状态。 唯一未知的牌是两张共享牌桌的牌。 任务是计算每个玩家在翻开这两张牌后成为获胜者的概率。 

测试用例给出玩家的数量，然后给出属于每个玩家的五张牌。 剩下的牌组成一副牌，从中选择两张公共牌。 对于每一对可能的剩余牌，我们确定每个玩家可以从他们的七张可用牌中组成的最强的五张牌扑克牌，使用扑克排序规则决定获胜者，并计算每个玩家获胜的频率。 答案是每个玩家的获胜次数除以可能的桌牌对的数量，以给定素数为模打印。 

重要的约束隐藏在游戏设计中。 永远只有两张未知的牌。 即使考虑到每个玩家，可能的牌局总数最多也只是从 52 张牌中选择两张牌，只有 1326 种可能性。 这意味着昂贵的部分不是枚举结果，而是正确评估扑克牌。 试图模拟牌组所有未来交易的解决方案是不必要的，而且太大，而直接枚举所有可能的牌面是很容易管理的。 

棘手的部分主要是扑克比较。 诸如 A、2、3、4、5 之类的低 A 顺子必须被视为拥有高牌 5，而不是 A。 同花比较会忽略花色并比较排序后的牌的等级。 玩家的七张牌中可以有几种可能的五张牌，因此仅评估前五张牌或贪婪地选择牌会给出错误的答案。 

例如，如果玩家有 A 红心、K 红心、Q 红心、J 红心、10 颗梅花，而棋盘包含 9 颗红心和 2 颗梅花，则正确的手牌只是同花，而不是皇家同花顺。 只检查排名而忘记所有五张牌必须具有相同花色的粗心实现会高估玩家。 

另一个常见的错误是忽视最终的平局规则。 如果两个玩家拥有完全相同的扑克牌，则索引较低的玩家获胜。 对于两个玩家在每个可能的牌局后获得相同手牌强度的测试用例，第一个玩家必须获得概率 1，第二个玩家必须获得概率 0。 

## 方法

 最简单的方法是尝试每对可能的公共牌。 对于每一对，将两张牌添加到每个玩家的手上，检查最终七张牌中所有可能的五张牌选择，并保留最强的一张。 这是正确的，因为游戏的未知部分仅由这两张牌组成。 

可能的棋盘数量最多为 1326。每个玩家需要检查 21 个可能的五张牌子集，因为七张牌恰好包含 C(7,5) 个选项。 由于 21 是一个小常数，因此详尽的评估足够快。 

主要观点是概率空间很小。 由于手牌层次结构，扑克本身看起来很复杂，但未来状态的数量非常少。 我们不需要先进的概率公式、模拟或动态规划。 我们只需要一个可靠的扑克评估员。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(C(52,2) * N * 21) | O(N) | 优化手牌评估后录用 |
 | 最佳 | O(C(52,2) * N * 21) | O(N) | 已接受 |

 暴力法和最优方法是相同的枚举思想。 优化是认识到这已经足够小，并将精力集中在恒定因素和正确性上。 

## 算法演练

1. 将每张牌转换成点数和花色的数值。 存放每个玩家的五张私人牌并标记所有使用过的牌。 
2. 生成剩余卡牌列表。 此列表中的每个可能的对代表一个同样可能的未来表状态。 
3. 对于每个可能的牌桌对，评估每个玩家。 将他们的五张私人牌与两张牌桌组合起来，并枚举所有 21 种可能的五张牌。 根据扑克排名保留最好的牌。 
4. 比较该牌桌状态下所有玩家的最佳牌。 手牌最高的玩家获胜。 如果几个玩家的牌值相等，则选择最小的指数。 
5. 在所选玩家的计数器上添加一场胜利。 处理完所有表对后，将每个计数器乘以可能对的数量的模逆。 

为什么它有效：每个可能的最终游戏状态都只表示一次，因为枚举了所有可能的剩余牌对。 手牌评估器返回与扑克规则相同的顺序，因为每手牌都会转换为类别和平局值。 由于每种可能状态的获胜者都被计算在内，因此最终的比率正是所需的概率。 

## Python 解决方案```python
import sys
from itertools import combinations

input = sys.stdin.readline

MOD = 100055128505716009

rank_map = {
    "2": 2, "3": 3, "4": 4, "5": 5, "6": 6,
    "7": 7, "8": 8, "9": 9, "10": 10,
    "J": 11, "Q": 12, "K": 13, "A": 14
}

suits = {
    "clubs": 0,
    "diamonds": 1,
    "hearts": 2,
    "spades": 3
}

def evaluate_five(cards):
    ranks = sorted([x[0] for x in cards], reverse=True)
    cnt = {}
    for r in ranks:
        cnt[r] = cnt.get(r, 0) + 1

    groups = sorted(((c, r) for r, c in cnt.items()), reverse=True)

    flush = len({x[1] for x in cards}) == 1

    unique = sorted(set(ranks))
    straight = False
    high = 0
    if len(unique) == 5:
        if unique == [2, 3, 4, 5, 14]:
            straight = True
            high = 5
        elif unique[-1] - unique[0] == 4:
            straight = True
            high = unique[-1]

    if straight and flush:
        return (8, high)

    if groups[0][0] == 4:
        return (7, groups[0][1], groups[1][1])

    if groups[0][0] == 3 and groups[1][0] == 2:
        return (6, groups[0][1], groups[1][1])

    if flush:
        return (5, *ranks)

    if straight:
        return (4, high)

    if groups[0][0] == 3:
        kickers = sorted([r for r in ranks if r != groups[0][1]], reverse=True)
        return (3, groups[0][1], *kickers)

    if groups[0][0] == 2 and groups[1][0] == 2:
        pairs = sorted([groups[0][1], groups[1][1]], reverse=True)
        return (2, pairs[0], pairs[1], groups[2][1])

    if groups[0][0] == 2:
        kickers = sorted([r for r in ranks if r != groups[0][1]], reverse=True)
        return (1, groups[0][1], *kickers)

    return (0, *ranks)

def evaluate_seven(cards):
    best = None
    for comb in combinations(cards, 5):
        cur = evaluate_five(comb)
        if best is None or cur > best:
            best = cur
    return best

def solve():
    t = int(input())
    ans = []

    for _ in range(t):
        n = int(input())
        players = []
        used = set()

        for _ in range(n):
            hand = []
            for _ in range(5):
                r, s = input().split()
                card = (rank_map[r], suits[s])
                hand.append(card)
                used.add(card)
            players.append(hand)

        deck = []
        for r in range(2, 15):
            for s in range(4):
                if (r, s) not in used:
                    deck.append((r, s))

        wins = [0] * n
        total = 0

        for a, b in combinations(deck, 2):
            total += 1
            board = [a, b]
            best = None
            winner = -1

            for i in range(n):
                cur = evaluate_seven(players[i] + board)
                if best is None or cur > best:
                    best = cur
                    winner = i

            wins[winner] += 1

        inv = pow(total, MOD - 2, MOD)
        ans.append(" ".join(str(x * inv % MOD) for x in wins))

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```卡片编码将排名和花色转换为整数，这使得比较变得简单，并避免了算法中昂贵部分的字符串处理。 

功能`evaluate_five`直接遵循扑克等级制度。 返回的元组从手类别开始，因此更强的类别会自动比较更大。 剩余的元组条目是有序的平局断路器，与该类别的规则匹配。 

七张牌评估器检查所有可能的五张牌选择。 它们只有 21 张，因此这种直接方法比尝试为 7 张牌构建复杂的基于案例的逻辑更清晰、更安全。 

模逆是用费马定理计算的，因为模数是素数。 Python 整数不会溢出，因此乘以逆数是安全的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(C(R,2) * N * 21 * 5) | R为剩余牌张数，最多52 |
 | 空间| O(N) | 存储玩家和临时卡牌列表 |

 最大可能的棋盘数量为 1326，因此即使有很多玩家，算法也保持在预期限制内。 内存使用主要是存储输入的手牌。 

## 工作示例

 对于一个简单的单人游戏案例：

 输入：```
1
1
A hearts
K hearts
Q hearts
J hearts
10 hearts
```踪迹是：

 | 检查板 | 玩家手牌| 最佳类别 | 胜利 |
 | ---| ---| ---| ---|
 | 第一板 | 已经有皇家同花顺| 同花顺 | 1 |
 | 所有板| 不变的获胜者 | 同花顺| 全部 |

 玩家总是获胜，因为只有一名参与者。 概率为 1。 

对于两名玩家：

 | 检查板 | 玩家 1 | 玩家 2 | 获胜者 |
 | ---| ---| ---| ---|
 | 板 1 | 一对 A | 高卡| 玩家 1 |
 | 板 2 | 一对 A | 一对国王| 玩家 1 |
 | 所有板| 正常比较| 正常比较| 计算|

 这表明该算法从不假设私人牌单独决定获胜者。 每对可能的桌牌都可以改变结果。 

## 测试用例```
# These tests illustrate the expected behavior of the algorithm.
# They are intended for use with the solve() function.

sample = """1
4
2 clubs
4 diamonds
7 hearts
J spades
Q clubs
2 diamonds
4 hearts
7 spades
J clubs
Q diamonds
2 hearts
4 spades
7 clubs
J diamonds
Q hearts
2 spades
4 clubs
7 diamonds
J hearts
Q spades
"""

# Expected output:
# 1 0 0 0

single = """1
1
A hearts
K hearts
Q hearts
J hearts
10 hearts
"""

# Expected output:
# 1
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单人同花顺| 1 | 处理最少数量的玩家 |
 | 四人游戏样本 | 1 0 0 0 | 1 0 0 0 处理多个玩家并打破平局 |

 ## 边缘情况

 通过显式检查序列 A、2、3、4、5 来处理低 A 顺子。 如果没有这种特殊情况，诸如 A 红心、2 梅花、3 方块、4 黑桃、5 红心之类的手牌将错误地收到高牌 A，而不是直牌高牌 5。 

在比较完整的手牌元组后，处理玩家之间的平局。 如果两个玩家具有相同的类别和决胜局，则比较将较早的指数保留为获胜者。 这符合最小玩家索引赢得未解决的平局的规则。 

拥有七张牌的玩家可能有多种强力组合。 例如，持有 A 黑桃、A 红心、A 方块、K 梅花、K 红心以及包含另一张 A 的棋盘，可创建葫芦和三种同种的可能性。 枚举所有五个牌子集可保证选择葫芦。
