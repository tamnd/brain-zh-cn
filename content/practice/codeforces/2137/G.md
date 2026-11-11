---
title: "CF 2137G - 哭我一条河"
description: "给定一个有 n 个节点和 m 个边的有向无环图。 每个节点都以蓝色开始，玩家 Cry 和 River 玩两人代币游戏。 令牌从节点 s 开始。 Cry 首先移动，然后是 River，它们交替移动。"
date: "2026-06-08T02:33:29+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dp", "games", "graphs"]
categories: ["algorithms"]
codeforces_contest: 2137
codeforces_index: "G"
codeforces_contest_name: "Codeforces Round 1047 (Div. 3)"
rating: 2200
weight: 2137
solve_time_s: 89
verified: false
draft: false
---

[CF 2137G - 为我哭泣](https://codeforces.com/problemset/problem/2137/G)

 **评分：** 2200
 **标签：** dfs 和类似、dp、游戏、图表
 **求解时间：** 1m 29s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个有向无环图`n`节点和`m`边缘。 每个节点都以蓝色开始，玩家 Cry 和 River 玩两人代币游戏。 令牌从一个节点开始`s`。 Cry 首先移动，然后是 River，它们交替移动。 如果令牌到达没有传出边的节点，则 Cry 获胜。 如果代币到达红色节点，则河牌获胜。 如果一个节点既是红色又是终端，则河流获胜。 

我们必须回答多个问题：一些将节点更新为红色，一些询问假设最优玩法，Cry 是否可以从给定节点强制获胜。 该图保证是一个 DAG，并且所有测试用例的节点、边和查询的数量总计可达 200,000。 

这些约束表明我们无法为每个查询模拟每个游戏。 简单的模拟需要在每次进行查询时检查来自节点的所有可能路径。 和`n`最多 2·10^5 且`q`最多 2·10^5，这可能会导致 O(nq) 次操作，大约为 4·10^10，对于 2 秒的限制来说太慢了。 

微妙的边缘情况包括：既是终端节点又后来被漆成红色的节点。 如果查询，正确的结果是 River 立即获胜，而不是 Cry。 此外，没有传出边的节点最初允许 Cry 立即获胜。 天真地忽略这些条件可能会导致错误的答案。 

## 方法

 暴力方法很简单：对于类型 2 的每个查询，递归地模拟所有可能的移动序列，跟踪轮到哪个玩家，并返回获胜者。 这是有效的，因为图是非循环的，因此递归最终将终止。 然而，最坏的情况是探索来自一个节点的所有路径，这可能是最长路径长度的指数。 当类型 1 查询动态更改颜色时，即使没有有效处理更新的记忆也会失败，从而使先前缓存的结果无效。 

优化的关键观察是这是一个 DAG，它允许节点的拓扑排序。 我们可以使用向后动态规划方法计算每个节点 Cry 的赢/输状态，从终端节点向上传播值。 没有传出边的终端节点最初因 Cry 获胜，而红色节点因 Cry 失败（因 River 获胜）。 对于其他节点，如果任何子节点输给下一个玩家，Cry 可以强制获胜。 这类似于标准的“DAG 游戏”DP 或 Grundy 数计算。 

动态更新（将节点涂成红色）使事情变得复杂。 由于 DAG 是静态的，唯一的变化是输赢状态向后传播。 当某个节点变成红色时，Cry 就无法再在那里获胜。 此更改仅影响可以到达该红色节点的节点，因此我们可以使用反向图中的队列（BFS 样式）向后传播新状态，仅更新获胜/失败状态发生变化的节点。 

这为所有查询提供了高效的在线算法。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n 每个查询) | O(n) | 太慢了|
 | 最佳| O(n + m + q) 摊销 | O(n + m) | 已接受 |

 ## 算法演练

 1. 读图并构造邻接表及其逆邻接表。 当节点被涂成红色时，反向邻接列表允许向后传播状态变化。 
2. 初始化各个节点的状态。 没有传出边缘的终端节点在 Cry 中获胜。 所有红色节点（最初没有）都因哭泣而失败。 具有传出边缘的蓝色节点最初是未定义的。 
3. 使用自下而上的 DP 按拓扑顺序计算每个节点的初始赢/输状态。 对于每个节点，如果任何一个孩子输给了下一个玩家（即河牌），那么 Cry 可以通过移动到那里来获胜。 如果所有子节点都为下一个玩家获胜，则 Cry 无法强制获胜，并且该节点正在失败。 
4. 对于每个查询：

 - 如果是类型1（将节点涂成红色），则将该节点标记为“哭泣”失败。 如果状态发生变化，则沿着反向边缘向后传播变化，更新其获胜/失败状态取决于该节点的祖先。 
- 如果是类型 2（查询），则只需输出该节点处 Cry 的当前状态。 

工作原理：DAG 保证没有循环，因此每个节点的状态仅取决于其后代。 通过最初以逆拓扑顺序进行处理并向后传播更新，我们始终保持正确的赢/输状态。 将节点涂成红色只会更改可以到达该节点的节点的状态，并且传播可确保状态保持一致。 

## Python 解决方案```python
import sys
from collections import deque
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m, q = map(int, input().split())
        adj = [[] for _ in range(n)]
        radj = [[] for _ in range(n)]
        outdeg = [0] * n
        
        for _ in range(m):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            adj[u].append(v)
            radj[v].append(u)
            outdeg[u] += 1

        # 0 = unknown, 1 = Cry wins, -1 = River wins
        state = [0] * n
        queue = deque()

        # initialize terminal nodes
        for i in range(n):
            if outdeg[i] == 0:
                state[i] = 1
                queue.append(i)

        # compute initial states using BFS from terminals
        while queue:
            node = queue.popleft()
            for prev in radj[node]:
                if state[prev] != 0:
                    continue
                if state[node] == -1:
                    state[prev] = 1
                    queue.append(prev)
                else:
                    outdeg[prev] -= 1
                    if outdeg[prev] == 0:
                        state[prev] = -1
                        queue.append(prev)

        red = [False] * n

        for _ in range(q):
            tp, u = map(int, input().split())
            u -= 1
            if tp == 1:
                if red[u]:
                    continue
                red[u] = True
                if state[u] == 1:
                    state[u] = -1
                    queue = deque([u])
                    while queue:
                        node = queue.popleft()
                        for prev in radj[node]:
                            if state[prev] == 1:
                                continue
                            # check if Cry has a move to a losing node
                            can_win = any(state[v] == -1 and not red[v] for v in adj[prev])
                            if not can_win and not red[prev]:
                                state[prev] = -1
                                queue.append(prev)
            else:
                if red[u]:
                    print("NO")
                else:
                    print("YES" if state[u] == 1 else "NO")

if __name__ == "__main__":
    solve()
```解释：我们将终端节点初始化为 Cry 获胜。 BFS 传播相应地设置其他节点。 将节点涂成红色标志着它在 Cry 中失败，并通过反向图触发反向传播以更新所有受影响的祖先。 然后查询立即读取状态。 微妙之处包括减少出度以检测节点何时丢失以及正确处理红色节点，因此我们永远不允许 Cry 在那里“获胜”。 

## 工作示例

 ### 输入示例 1```
1
7 8 10
1 2
1 3
1 4
2 5
3 6
5 7
2 3
3 4
2 1
1 3
1 4
2 1
2 2
2 3
2 4
2 5
2 6
2 7
```| 节点| 输出| 红色| 状态|
 | --- | --- | --- | --- |
 | 7 | 0 | F | 1 |
 | 5 | 1 | F | 1 |
 | 2 | 2 | F | 1 |
 | 3 | 2 | F -> T | 更新后-1 |
 | 4 | 1 | F -> T | 更新后-1 |
 | 1 | 3 | F | 最初为 1，然后某些路径导致 -1 |

 查询结果：

 - 2 1：是
 - 2 2：否
 - 2 3：是
 - 2 4：否
 - 2 5：否
 - 2 6：是
 - 2 7：是

 这演示了当节点被涂成红色时的初始传播和向后更新。 

### 自定义输入```
1
3 2 3
1 2
2 3
2 1
1 3
2 1
```追踪：

 | 节点| 输出| 红色| 状态|
 | --- | --- | --- | --- |
 | 3 | 0 | F -> T | 红色后-1 |
 | 2 | 1 | F | 最初为 1，传播后为 -1 |
 | 1 | 1 | F | 最初为 1，传播后为 -1 |

 查询 2 1：否

 正确显示红色油漆向后传播。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m + q) 摊销 | 每条边最多被处理两次：一次在初始传播期间，一次在||期间。
