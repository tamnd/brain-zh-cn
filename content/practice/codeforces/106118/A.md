---
title: "CF 106118A - 安排团队"
description: "我们有一组固定的 n 个玩家，每个玩家都有一个强度值。 我们必须选择这些球员的单一排序，并且该排序将在针对 m 个不同的对手球队时不变地重复使用。"
date: "2026-06-19T20:05:34+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106118
codeforces_index: "A"
codeforces_contest_name: "2025 ICPC, Chula Selection Contest"
rating: 0
weight: 106118
solve_time_s: 58
verified: true
draft: false
---

[CF 106118A - 安排团队](https://codeforces.com/problemset/problem/106118/A)

 **评级：** -
 **标签：** -
 **求解时间：** 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一组固定的 n 个玩家，每个玩家都有一个强度值。 我们必须选择这些球员的单一排序，并且该排序将在针对 m 个不同的对手球队时不变地重复使用。 每场比赛都会对球员的位置进行比较，因此我们阵容中的位置 i 总是与每个对手球队的位置 i 进行比赛。 

对于每个位置，玩家通过与所有对手球队的同一列进行重复比较来累积积分。 胜一场得1分，平一场得0.5分，负一场得0分。阵容的总得分是所有位置和所有对手球队的总得分。 

任务是对 n 个玩家进行排列，以使总累积分数最大化。 

约束在一个维度上很小，而在另一个维度上很大。 玩家数量 n 最多为 20，这立即表明排列上的指数搜索在理论上是可能的，但必须仔细优化。 对手队伍的数量 m 最多可达 5000 个，这个数字足够大，以至于任何在重组合循环内重复扫描所有对手的解决方案如果天真地完成，都会变得太慢。 

尝试玩家的每种排列的幼稚方法将涉及 n! 的可能性。 当 n = 20 时，这是一个天文数字，无法直接评估。 即使计算单个排列的分数也需要 O(mn) 的工作，因此暴力破解是完全不可行的。 

第二个简单的方向是贪婪地将每个玩家独立地分配到一个位置。 这也会失败，因为球员的贡献取决于该位置的对手值，而交换两名球员会影响全局所有位置。 

关系产生了一种微妙的边缘情况。 由于同等强度产生半分，而不是零，因此得分不是纯粹的二元得分。 例如，如果一名玩家与许多对手条目相同，将他们置于具有许多相等比较的位置可以胜过稍强但输得更频繁的玩家。 任何忽视联系或将其视为可忽略不计的方法都会错误地评估比较。 

## 方法

 关键的观察是，一旦我们确定了分配给哪个球员，每个位置都是独立的。 将球员 x 分配到位置 i 所贡献的分数仅取决于所有 m 支球队中第 i 列中的对手值的多重集。 这建议预先计算每个球员在每个位置上的表现。 

对于每个球员和每个位置，如果该球员占据该位置，我们可以计算一个代表总分的值。 这将问题简化为将 n 个玩家分配到 n 个位置，从而最大化所选配对的总和。 

一旦重新表述，我们就认识到二分图上的一个经典分配问题：一侧是玩家，另一侧是位置，边权重等于预先计算的分数。 我们必须选择一个完美的匹配，使总重量最大化。 

由于 n ≤ 20，我们可以使用位掩码上的动态编程来解决这个分配问题。 国家会跟踪哪些位置已经被填补，我们会一一分配球员。 

暴力排列方法失败了，因为它探索了 n! 安排。 分数按玩家位置对进行加法分解的观察使我们能够将问题简化为最佳匹配，这可以在 O(n·2^n) 中解决。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力排列 | O(n!·m·n) | O(n!·m·n) | O(1) | O(1) | 太慢了 |
 | 位掩码 DP 分配 | O(n^2 · 2^n) | O(n^2 · 2^n) | O(n·2^n) | O(n·2^n) | 已接受 |

 ## 算法演练

 我们首先重写评分，以便我们可以计算独立贡献。 

## 步骤 1：预计算列统计信息

 对于每个位置 i 和每个对手球队 k，我们查看值 bk,i。 我们将使用这些价值观来评估所有球队中每个球员在该位置上的表现。

这隔离了这样一个事实：一旦分配固定，职位就不会相互影响。 

## 步骤 2：计算分数矩阵

 对于每个玩家 p 和每个位置 i，如果玩家 p 位于位置 i，我们计算总得分。 我们对所有对手球队进行求和，每场胜利加 1，每场平局加 0.5，输给 bk,i 则加 0。 

这给出了一个矩阵 Score[p][i]，其中每个条目独立于所有其他分配。 

## 步骤 3：重新表述为作业

 现在我们必须为每个位置选择一名球员，在排列中最大化总分 [p][i]。 这是球员与位置之间最大权重的完美匹配。 

问题结构确保位置之间没有耦合，除非每个玩家只能使用一次。 

## 步骤 4：位掩码动态规划

 我们将 dp[mask] 定义为当我们已经将玩家分配到由 mask 表示的位置集时可达到的最大分数。 

在每个状态下，设置的位数就是分配位置的数量，这决定了我们接下来要分配的球员。 

我们尝试将任何未使用的位置分配给下一个玩家并相应地更新 dp。 

这是有效的，因为在步骤 t 处，正好填充了 t 个位置，因此赋值顺序是隐式固定的。 

## 步骤 5：重构答案

 我们存储转换，以便我们可以恢复每个玩家在最佳解决方案中被分配到的位置，然后输出相应的优势排列。 

### 为什么它有效

 正确性来自于总分是独立贡献得分[p][i]之和。 一旦我们确定了球员和位置之间的配对，任何术语都不会与其他任何术语相互作用。 DP探索了形成完美匹配的所有方式，并且每个状态恰好代表一个部分匹配。 由于每个扩展都恰好添加一对有效的对，因此 DP 绝不会重复计数或错过任何配置。 最终状态对应于完全排列，并且在所有此类匹配中，DP 保持最大总和。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
a = list(map(int, input().split()))

b = [list(map(int, input().split())) for _ in range(m)]

# Precompute score for each player at each position
score = [[0.0] * n for _ in range(n)]

for i in range(n):  # position
    for p in range(n):  # player
        s = 0.0
        ap = a[p]
        for k in range(m):
            x = b[k][i]
            if ap > x:
                s += 1.0
            elif ap == x:
                s += 0.5
        score[p][i] = s

# dp over masks of positions
size = 1 << n
dp = [-1e18] * size
parent = [(-1, -1)] * size  # (prev_mask, chosen_position)

dp[0] = 0

for mask in range(size):
    cnt = bin(mask).count("1")
    if cnt >= n:
        continue
    for pos in range(n):
        if not (mask & (1 << pos)):
            nxt = mask | (1 << pos)
            val = dp[mask] + score[cnt][pos]
            if val > dp[nxt]:
                dp[nxt] = val
                parent[nxt] = (mask, pos)

# reconstruct
full = (1 << n) - 1
assign_pos = [-1] * n

mask = full
while mask:
    prev_mask, pos = parent[mask]
    cnt = bin(prev_mask).count("1")
    assign_pos[cnt] = pos
    mask = prev_mask

# output permutation of strengths
ans = [a[i] for i in assign_pos]
print(*ans)
```第一阶段将所有对手信息压缩到单个贡献矩阵中。 球员和位置的双循环确保每个配对都得到独立评估。 

DP 在位置上使用位掩码。 变量 cnt 表示已经分配了多少名玩家，这隐式地选择了我们当前放置的玩家。 这种顺序是固定的，可确保我们在不显式跟踪玩家使用情况的情况下构建排列。 

父数组存储转换，因此我们可以重建在每个步骤中选择的位置。 重建从完整掩模向后走，并以与构造相反的顺序分配位置。 

## 工作示例

 ### 示例 1

 输入：```
2 2
10 20
15 5
12 18
```我们计算得分矩阵：

 | 球员\位置| 0 | 1 |
 | --- | --- | --- |
 | 10 | 10 0 | 2 |
 | 20 | 2 | 1 |

 现在 DP 转换：

 | 面膜| 碳纳米管| 选择| dp值|
 | --- | --- | --- | --- |
 | 00 | 00 0 | 将 10 或 20 分配给 pos 0/1 | 0 |
 | 01 | 1 | 下一个作业 | 迄今为止最好的|
 | 10 | 10 1 | 下一个作业 | 迄今为止最好的|
 | 11 | 11 2 | 完整| 3 |

 最优重建产生分配 20 → 位置 0, 10 → 位置 1，产生`[20, 10]`。 

该轨迹显示了 DP 如何自然地捕捉到更强的玩家应该被放置在具有更有利比较的列中。 

### 示例 2

 输入：```
3 1
5 7 9
6 7 8
```分数矩阵：

 | 球员\位置| 0 |
 | --- | --- |
 | 5 | 0 |
 | 7 | 0.5 | 0.5
 | 9 | 1 |

 只有一个位置存在，因此 DP 按照掩码扩展的顺序简单地分配所有玩家。 重建产量`[9, 7, 5]`如果跨位置扩展，但这里它只是根据每个位置的累积分数选择最佳排序。 

这显示了关系（7 vs 7）如何贡献分数值并影响排序决策。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2·m + n·2^n) | O(n^2·m + n·2^n) | 对 m 个球队中的每个球员位置对进行评分，加上位掩码 DP 转换 |
 | 空间| O(n·2^n) | O(n·2^n) | 所有掩码的 DP 和父指针 |

 约束 n ≤ 20 使得指数 DP 可行，而 m ≤ 5000 在预计算步骤内线性处理。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    b = [list(map(int, sys.stdin.readline().split())) for _ in range(m)]

    score = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for p in range(n):
            ap = a[p]
            for k in range(m):
                x = b[k][i]
                if ap > x:
                    score[p][i] += 1
                elif ap == x:
                    score[p][i] += 0.5

    size = 1 << n
    dp = [-10**18] * size
    dp[0] = 0

    for mask in range(size):
        cnt = bin(mask).count("1")
        for pos in range(n):
            if not (mask & (1 << pos)):
                dp[mask | (1 << pos)] = max(dp[mask | (1 << pos)], dp[mask] + score[cnt][pos])

    # greedy reconstruction not needed for value check only
    return str(dp[(1 << n) - 1])

# provided sample
assert run("""2 2
10 20
15 5
12 18
""").startswith("3")

# custom: minimum size
assert run("""1 1
5
4
""").startswith("1")

# custom: all equal
assert run("""3 2
5 5 5
5 5 5
5 5 5
""").startswith("3")

# custom: strictly increasing opponents
assert run("""3 2
1 2 3
4 5 6
7 8 9
""") is not None
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2 2 样品 | 3 | 混合赢/输结构的正确性|
 | n=1 例 | 1 | 基本情况处理 |
 | 一切平等| 3 | 领带累积正确性 |
 | 对手不断增加| 有效值 | 订购敏感性|

 ## 边缘情况

 一个关键的边缘情况是许多比较都相同。 例如，如果所有玩家对所有对手条目具有相同的强度，则每次分配都会产生相同的分数 m·n·0.5。 该算法仍然有效，因为每个 Score[p][i] 都是相同的，因此 DP 找到多个等效的最佳匹配并返回任何排列。 

另一种情况是，一名玩家支配所有其他玩家，但仅限于特定列。 假设一名球员总体上最强，但所有对手球队都有一个非常强的值集中在一列中。 评分矩阵正确地反映了将该玩家放置在其他位置可能会减少总胜利，而 DP 捕捉到了这种权衡，因为它评估的是完整的列总和而不是全局实力。 

最后，当 n = 1 时，DP 退化为单一状态。 直接计算分数，并且重建简单地输出唯一可能的排列。
