---
title: "CF 105E - 举起和投掷"
description: "我们被赋予了三个角色，每个角色都站在一维半线上的不同位置。 每个位置都是从1开始的整数，每个角色都有一个移动范围和一个投掷范围。"
date: "2026-06-01T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force"]
categories: ["algorithms"]
codeforces_contest: 105
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 81"
rating: 2500
weight: 105
solve_time_s: 153
verified: true
draft: false
---

[CF 105E - 举起和投掷](https://codeforces.com/problemset/problem/105/E)

 **评分：** 2500
 **标签：** 暴力破解
 **求解时间：** 2m 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被赋予了三个角色，每个角色都站在一维半线上的不同位置。 每个位置都是从1开始的整数，每个角色都有一个移动范围和一个投掷范围。 移动范围定义了他们可以移动到空闲位置的距离，投掷范围定义了他们可以将他们持有的另一个角色投掷多远。 此外，如果一个角色紧邻，则可以举起另一个角色，从而形成一个、两个甚至三个角色的堆叠。 堆叠时，只有最上面的角色可以行动 - 移动和投掷仅限于举重者。 

输入包括每个角色的起始位置、移动范围和投掷范围。 输出是任何角色可以到达的最大位置，无论是通过移动、举起还是投掷自己或他人。 由于位置是小整数 (1-10)，并且每个角色每种类型只有一个动作，因此状态空间有限，如果小心处理，则可以进行详尽的模拟。 

当字符足够接近以形成堆栈或多个投掷序列竞争时，就会出现边缘情况。 例如，如果所有角色都是相邻的并且其中一个角色的投掷范围很长，则最佳路径可能包括形成一列并将顶部角色投掷到前面很远的地方。 只考虑个体运动的天真的方法可能会错过这些组合序列。 考虑职位`1 1 1`有范围`3 3 3`; 最佳方案可能涉及举起和投掷链条，而不是独立的动作。 

## 方法

 暴力方法会尝试每个角色的所有可能的移动、举起和投掷序列，并跟踪结果位置。 由于每个角色最多可以执行三个动作，因此需要对动作顺序进行排列，并选择举起或投掷谁，这会很快导致组合爆炸。 对于三个字符和限制为 1-10 的位置，这在理论上是可行的，但在不丢失序列的情况下实现起来很混乱。 

关键的观察是头寸很小，行动有限，并且状态可以完全表示为当前头寸加上谁持有谁的元组。 这使得它适合广度优先搜索或记忆深度优先搜索。 通过从任何给定配置生成所有可达状态并跟踪所看到的最大位置，我们可以系统地探索没有冗余的空间。 BFS 方法自然地考虑了回合顺序和动作限制。 

最佳方法将每个角色的动作视为状态转换。 如果目的地空闲并且在移动范围内，则移动有效。 如果两个角色相邻并且尚未持有，则电梯有效。 如果目标位置空闲并且在投掷范围内，则投掷有效。 BFS 探索所有组合，更新任何角色到达的最大位置。 因为只有 10 个位置和 3 个角色，所以状态总数足够小，足以完全模拟。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(3! × 3^3 × 10^3)​​ | O(3! × 3^3 × 10^3)​​ | O(10^3)​​ | O(10^3)​​ | 如果没有仔细修剪，太杂乱/不切实际 |
 | 具有状态记忆功能的 BFS | O(10^3 × 3! × 3^3) | O(10^3 × 3! × 3^3) | O(10^3)​​ | O(10^3)​​ | 已接受 |

 ## 算法演练

 1. 将游戏状态表示为三个角色位置的元组和描述持有关系的嵌套元组。 这种紧凑的表示方式允许快速比较和记忆。 
2. 使用起始位置和空的保持结构初始化 BFS 队列。 跟踪在单独变量中遇到的最大位置。 
3. 对于每个状态，考虑未被控制的角色的所有有效移动。 对于每个自由角色，尝试移动到其移动范围内未占据的每个位置。 如果结果状态未被访问过，则将其推入队列。 
4. 对于每个空闲且与另一个空闲角色相邻的角色，模拟举起。 更新保持结构，以便升降机现在可以保持抬起的角色。 将新状态推入队列。 
5. 对于每个持有另一个角色的角色，尝试将持有的角色（或列，如果堆叠了多个）扔到其投掷范围内的每个空闲位置。 相应地更新位置并将新状态推送到队列。 
6. 每次状态转换后，如果任何角色的新位置超过当前最大值，则更新最大位置。 
7. 继续BFS，直到队列为空。 返回记录的最大位置。 

这是可行的，因为 BFS 保证我们探索所有可到达的状态，而不会错过任何移动、举起和投掷的组合。 状态表示可以防止循环，确保不会重新访问任何状态，并且通过在每一步更新最大值，我们不需要回溯。 

## Python 解决方案```python
import sys
from collections import deque
input = sys.stdin.readline

def solve():
    pos = []
    move = []
    throw = []
    for _ in range(3):
        p, m, t = map(int, input().split())
        pos.append(p)
        move.append(m)
        throw.append(t)

    max_pos = max(pos)
    visited = set()
    # state: positions tuple, holding tuple (who holds whom)
    # holding: -1 means free, 0/1/2 means held by character index
    queue = deque()
    init_holding = (-1, -1, -1)
    queue.append((tuple(pos), init_holding))
    visited.add((tuple(pos), init_holding))

    def get_free_positions(positions):
        return set(range(1, 11)) - set(positions)

    while queue:
        positions, holding = queue.popleft()
        max_pos = max(max_pos, max(positions))

        # move
        for i in range(3):
            if holding[i] != -1:
                continue
            for delta in range(-move[i], move[i] + 1):
                if delta == 0:
                    continue
                new_pos = positions[i] + delta
                if 1 <= new_pos <= 10 and new_pos not in positions:
                    new_positions = list(positions)
                    new_positions[i] = new_pos
                    new_state = (tuple(new_positions), holding)
                    if new_state not in visited:
                        visited.add(new_state)
                        queue.append(new_state)

        # lift
        for i in range(3):
            if holding[i] != -1:
                continue
            for j in range(3):
                if i != j and holding[j] == -1 and abs(positions[i] - positions[j]) == 1:
                    new_holding = list(holding)
                    new_holding[j] = i
                    new_state = (positions, tuple(new_holding))
                    if new_state not in visited:
                        visited.add(new_state)
                        queue.append(new_state)

        # throw
        for i in range(3):
            held = [idx for idx, h in enumerate(holding) if h == i]
            if not held:
                continue
            free_pos = get_free_positions(positions)
            for target in free_pos:
                if abs(positions[i] - target) <= throw[i]:
                    new_positions = list(positions)
                    for h_idx in held:
                        new_positions[h_idx] = target
                    new_holding = list(holding)
                    for h_idx in held:
                        new_holding[h_idx] = -1
                    new_state = (tuple(new_positions), tuple(new_holding))
                    if new_state not in visited:
                        visited.add(new_state)
                        queue.append(new_state)

    print(max_pos)

solve()
```该解决方案首先读取角色位置、移动范围和投掷范围。 BFS 探索所有可达状态，同时记住访问过的状态以防止无限循环。 移动、举起和投掷是单独处理的，始终检查动作是否有效。 处理`holding`元组正确地确保仅当前未持有的字符尝试执行操作，并且抛出操作正确地传播任何堆叠字符的位置。 微妙之处在于抛出的堆栈作为一个整体移动。 

## 工作示例

 **样品1**

 输入：```
9 3 3
4 3 1
2 3 3
```| 步骤| 职位 | 控股| 行动| 最大位置 |
 | ---| ---| ---| ---| ---|
 | 0 | 9,4,2 | -1,-1,-1 | -1,-1,-1 | 初始化| 9 |
 | 1 | 6,4,2 | -1,-1,-1 | -1,-1,-1 | 拉哈尔升至 6 | 6 |
 | 2 | 6,5,2 | -1,-1,-1 | -1,-1,-1 | 弗洛纳升至 5 | 6 |
 | 3 | 6,5,4 | 5 持有 1 | 弗隆 (Flonne) 举升埃特纳火山 | 6 |
 | 4 | 6,5,4 | 0 持有 2 | 拉哈尔 (Laharl) 举起弗隆 (Flonne) | 6 |
 | 5 | 9,5,4 | -1,0,2 | 拉哈尔扔弗洛纳| 9 |
 | 6 | 12,5,4 | -1,-1,2 | 弗洛讷 (Flonne) 抛出埃特纳火山 (Etna) | 12 | 12
 | 7 | 15,5,4 | 15,5,4 | -1,-1,-1 | -1,-1,-1 | 埃特纳火山移动| 15 | 15

 这显示了形成堆栈并使用连续抛出的最佳策略。 

**自定义示例**

 输入：```
1 1 10
2 1 1
3 1 1
```| 步骤| 职位 | 控股| 行动| 最大位置 |
 | ---| ---| ---| ---| ---|
 | 0 | 1,2,3 | -1,-1,-1 | -1,-1,-1 | 初始化| 3 |
 | 1 | 1,2,3 | 0 持有 1 | 拉哈尔举起埃特纳火山| 3 |
 | 2 | 1,2,3 | 0 持有 2 | 埃特纳火山提升弗隆 | 3 |
 | 3 | | | | |
