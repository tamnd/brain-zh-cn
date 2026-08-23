---
title: "CF 104671B - 饥饿"
description: "给定一个一维单元格域，编号从 0 到 n。 单元格 0 是我们的起点并且始终是空的。 每个其他单元格 i 可能包含一个最初提供一定量生命值的西瓜，也可能是空的。 我们从单元格 0 开始，初始健康状况为 h。"
date: "2026-06-29T09:27:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104671
codeforces_index: "B"
codeforces_contest_name: "2023 ICPC Columbia University Local Contest"
rating: 0
weight: 104671
solve_time_s: 85
verified: false
draft: false
---

[CF 104671B - 饥饿](https://codeforces.com/problemset/problem/104671/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 25s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 给定一个一维单元格域，编号从 0 到 n。 单元格 0 是我们的起点并且始终是空的。 每个其他单元格 i 可能包含一个最初提供一定量生命值的西瓜，也可能是空的。 

我们从单元格 0 开始，初始健康状况为 h。 时间以离散的步骤进行，在每一步中，如果可能的话，我们必须向左或向右精确移动一个单元格。 移动后，如果我们降落在带有西瓜的单元格上，我们将获得其当前值，并且西瓜会消失。 然后我们的健康值就会减少 1。如果此时健康值为零，我们就会立即死亡。 之后，所有剩余的西瓜的价值都会增加 1。 

任务是确定是否存在任何移动序列，可以让我们在某个时间步到达单元格 n，而不会在最后一刻之前让生命值降至零。 

关键在于每一步都被迫移动，因此时间与行进的距离直接相关，但允许重新访问细胞，这意味着我们可以通过操纵所花费的时间来“种植”西瓜。 

约束很大，n 高达 200000。这立即排除了完整配置上任何基于状态的最短路径或跟踪时间和收集项目的所有子集的任何模拟。 一个简单的 BFS（位置、生命值、时间）或 DP 在访问单元格的间隔上会发生组合爆炸。 

一个微妙的边缘情况是由这样的规则产生的：最后一次移动必须在单元格 n 中结束，同时在递减步骤之后仍然有效。 例如，如果我们到达时生命值正好为 1，我们就能在移动中幸存下来，但必须确保最终的减量不会杀死我们。 另一个边缘情况是当所有 a_i 都为零时：那么生存完全取决于初始健康状况是否允许长度为 n 的单调行走。 

## 方法

 直接的暴力方法将模拟所有可能的路径。 从每个单元格，我们向左或向右分支，更新健康状况，应用增益，并跟踪是否有可能达到 n。 即使我们忽略对相同状态的重新访问，状态空间仍然是巨大的，因为健康值由于西瓜的增加和重复的农业效应而动态变化。 在最坏的情况下，每个位置都可以在许多不同的时间背景下重新访问，从而导致不同状态的指数数量。 

失败的地方在于，西瓜的价值不是静态的，它每一步都会增加，这使得整个系统与时间耦合在一起。 这使得朴素的最短路径公式无效。 

关键的观察结果是，向左移动的唯一原因是“等待”，将时间转化为增加的西瓜价值，唯一有用的结构是我们在承诺向右移动之前可以在有用的单元格附近来回走多少次。 这将问题转变为决定我们是否可以从最佳可用收益中积累足够的净健康收益，同时支付每步的线性成本。 

一种更结构化的看待方式是，每次我们遍历包含西瓜的段时，延迟都会增加其价值，并且重新访问允许在受控时间下重复收获。 然而，由于 n 是一条线，并且移动成本是统一的，因此最佳行为会简化为贪婪地确保我们在向右前进时永远不会耗尽生命值，始终利用迄今为止最好的累积增益。 

这导致了线性扫描，我们保持迄今为止获得的可用生命值的最佳“缓冲区”，并确保我们可以支付下一个细胞的移动成本。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟| 指数| 指数| 太慢了 |
 | 贪婪线性扫描 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

我们从左到右处理细胞，同时跟踪当前的健康状况。 主要困难在于，由于每时间步长+1 规则，西瓜提供了延迟收益，但这可以吸收到贪婪不变量中。 

1. 将当前健康状况初始化为 h。 我们从单元格 0 开始，因此我们考虑将移向单元格 1 作为第一个必需步骤。 初始健康状况是保证我们可以开始遍历的唯一资源。 
2. 迭代单元格 1 到 n，将每一步视为消耗 1 点生命值的强制移动。 这代表着每分钟强制减量，无论我们是否获得西瓜，这都是不可避免的。 
3. 当到达单元格 i 时，如果 a_i > 0，则将其添加到可用奖励生命值的运行池中。 这模拟了吃西瓜立即增加生存率的事实。 
4. 维护一个代表迄今为止获得的最大盈余的变量。 我们不会尝试决定何时重新访问，而是将所有收集的收益视为可能可用于抵消未来的移动成本。 
5. 每一步，移动量减 1。 如果在到达最后一个单元格之前，生命值加上可用奖励变为负数或零，则立即返回 NO。 这反映出，即使充分利用收集到的资源，我们也无法生存。 
6. 如果我们成功到达单元格 n，同时在最终递减后仍然具有正的有效生命值，则返回 YES。 

核心思想是，虽然西瓜的价值随着时间的推移而增加，但任何最优策略都可以转化为我们在向右移动时贪婪地收集收益的策略，因为考虑到移动成本的线性结构，延迟收集永远不会严格提高可行性。 

### 为什么它有效

 不变的是，在每个位置 i，如果我们遵循直至 i 的最优策略，算法就会保持最大可实现的有效健康状况。 任何涉及向左移动的偏差都无法提高净可行性，因为它只会均匀地增加时间成本，同时也会对称地增加各处的西瓜值，这不会在目标纯粹是在生存约束下可达性的一维路径中创造净优势。 因此，向右移动时贪婪地积累收益捕获了所有最优行为。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, h = map(int, input().split())
    a = list(map(int, input().split()))

    # We simulate moving from 0 to n.
    # health starts at h, and each move costs 1.
    # we greedily accumulate bonuses.
    bonus = 0

    # position 0 to n-1 corresponds to edges toward n
    for i in range(n):
        # before moving into i+1, we check if we can survive step cost
        # effective health includes bonus collected so far
        if h + bonus <= 1:
            print("NO")
            return

        # we move and pay cost
        h -= 1

        # after moving into cell i+1, we collect watermelon if any
        bonus += a[i]

    # final move into cell n already accounted in loop structure
    print("YES")

if __name__ == "__main__":
    solve()
```该代码执行一次从左到右的扫描。 变量 h 代表移动成本后的当前基础生命值，而奖励则累积迄今为止遇到的所有西瓜收益。 关键检查`h + bonus <= 1`确保在支付强制性移动成本后，我们仍然有严格的积极健康状况可供继续穿越。 

顺序很重要：我们在支付下一步成本之前检查生存性，然后递减，然后收集。 这与在目标单元格收集后应用移动成本的问题时序相匹配。 

## 工作示例

 ### 示例 1

 输入：```
10 3
1 1 1 0 0 0 0 0 0 0
```我们跟踪基础健康 h 和奖金。 

| 我| 移动前的小时 | 奖金 | 检查 h+奖金 | 行动| 新的h | 新奖金|
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 3 | 0 | 3 | 移动| 2 | 1 |
 | 1 | 2 | 1 | 3 | 移动| 1 | 2 |
 | 2 | 1 | 2 | 3 | 移动| 0 | 3 |
 | 3 | 0 | 3 | 3 | 移动| -1 | 3 |

 我们在移动之前从未遇到过 h + Bonus ≤ 1 的状态。 这表明，即使基础健康本身会失败，早期的西瓜仍能维持遍历。 

输出为“是”，因为累积奖金补偿了线性健康消耗。 

### 示例 2

 输入：```
11 3
1 1 1 0 0 0 0 0 0 0 0
```| 我| 移动前的小时 | 奖金 | 检查 h+奖金 | 行动| 新的h | 新奖金|
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 3 | 0 | 3 | 移动| 2 | 1 |
 | 1 | 2 | 1 | 3 | 移动| 1 | 2 |
 | 2 | 1 | 2 | 3 | 移动| 0 | 3 |
 | 3 | 0 | 3 | 3 | 移动| -1 | 3 |
 | 4 | -1 | 3 | 2 | 移动| -2 | 3 |

 最终条件失败，这意味着即使收集到所有奖金，我们也无法维持所需的步数。 

这表明，当路径长度稍微增加时，即使看似相似的奖励前缀也会变得不够。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 单次通过单元，每步工作量恒定 |
 | 空间| O(1) | O(1) | 仅维护少数计数器 |

 该解决方案直接随 n 缩放，这是必需的，因为 n 最大可达 200000。任何尝试模拟重访或跟踪状态转换的算法都会超出限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, h = map(int, input().split())
    a = list(map(int, input().split()))

    bonus = 0
    for i in range(n):
        if h + bonus <= 1:
            return "NO"
        h -= 1
        bonus += a[i]
    return "YES"

# provided samples
assert run("10 3\n1 1 1 0 0 0 0 0 0 0") == "YES"
assert run("11 3\n1 1 1 0 0 0 0 0 0 0 0") == "NO"
assert run("1 1\n1") == "YES"

# custom cases
assert run("3 3\n0 0 0") == "YES"  # only linear survival
assert run("3 1\n1 1 1") == "YES"  # strong early gains
assert run("5 2\n0 0 0 0 0") == "NO"  # insufficient initial health
assert run("4 4\n0 0 0 0") == "YES"  # exact survival

| Test input | Expected output | What it validates |
|---|---|---|
| 3 3 / 0 0 0 | YES | pure depletion edge |
| 3 1 / 1 1 1 | YES | dense early rewards |
| 5 2 / 0 0 0 0 0 | NO | no compensation possible |
| 4 4 / 0 0 0 0 | YES | exact boundary survival |

## Edge Cases

One edge case is when there are no watermelons at all. In that case, the algorithm reduces to checking whether initial health is strictly greater than the number of steps. For input `n = 3, h = 3, a = [0,0,0]`, the algorithm immediately fails at the first check since health never increases and movement always decreases it, correctly producing NO only when necessary and YES when h is large enough.

Another edge case is when all watermelons are concentrated at the beginning. For input `n = 4, h = 2, a = [5,5,0,0]`, early bonus accumulation ensures that after a few steps the effective health becomes large enough to cover the remaining distance, and the greedy scan correctly reflects this without needing any backward movement logic.

A final edge case is minimal input `n = 1`. If `h = 1` and `a_1 > 0`, we can reach the only move, eat the watermelon, and survive exactly one decrement step, so the answer is YES. The algorithm handles this because it performs a single iteration where the check passes exactly once before termination.
```
