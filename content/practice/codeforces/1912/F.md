---
title: "CF 1912F - 逃亡狂潮"
description: "我们被要求计算在树上追捕的预期持续时间，其中一名警察和一名逃犯轮流移动。 城市被表示为一棵具有 $n$ 个顶点的无向树。"
date: "2026-06-08T20:17:06+07:00"
tags: ["codeforces", "competitive-programming", "math", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 1912
codeforces_index: "F"
codeforces_contest_name: "2023-2024 ICPC, NERC, Northern Eurasia Onsite (Unrated, Online Mirror, ICPC Rules, Teams Preferred)"
rating: 3100
weight: 1912
solve_time_s: 185
verified: false
draft: false
---

[CF 1912F - 逃亡狂潮](https://codeforces.com/problemset/problem/1912/F)

 **评分：** 3100
 **标签：** 数学、概率
 **求解时间：** 3m 5s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求计算在树上追捕的预期持续时间，其中一名警察和一名逃犯轮流移动。 城市被表示为一棵无向树，$n$顶点。 警察从固定顶点开始，而逃犯则选择任何其他顶点开始。 军官先移动，要么走到相邻的顶点，要么站着不动，消耗一个单位的时间。 然后，逃亡者会立即移动到不在通往警察的路径上的任何顶点，除非被迫，否则可以有效地避免被捕。 两者都发挥最佳效果：警官最大限度地缩短预期抓捕时间，而逃犯则最大限度地延长预期抓捕时间。 

输出是逃犯被抓获之前的预期分钟数。 由于逃犯会即时移动并且始终知道警察的位置，因此问题简化为在具有逃犯完美信息的两人游戏下计算预期捕获时间。 

顶点数量很少（$n \le 100$），所以三次算法$n$是可行的。 树结构保证了任意两个顶点之间的唯一路径，从而简化了逃亡者安全移动的计算。 边缘情况包括：

 -$n = 2$，警察和逃犯位于相邻的顶点，导致立即抓获。 
- 具有“长路径”的树木，逃亡者可以不断地移动到远处的顶点。 忽略逃犯瞬时动作的天真广度优先搜索将无法产生正确的期望。 

理解这些微妙之处至关重要：逃亡者的即时移动意味着我们无法天真地模拟逐个回合的位置。 

## 方法

 暴力方法将尝试枚举警官和逃犯的每一个动作序列，并递归地计算预期的捕获时间。 对于每个官员职位$p$和逃犯位置$f$，我们可以尝试所有的军官行动和所有可能的逃犯安全行动，对可能性进行平均。 这导致$O(n^2 \cdot n \cdot n)$最坏情况下的递归，因为有$n^2$位置对，最多$n$为每个移动。 即使有记忆，状态空间也是$O(n^2)$，但是计算期望的递归可以将其乘以$O(n^4)$，这是可以接受的$n \le 100$，但麻烦且容易出错。 

关键的见解是，逃亡者总是可以避开警察，除非警察已经“足够近”以困住他。 换句话说，从一个位置$(p, f)$，预期捕获时间仅取决于子树距离：军官一次移动可以减少的最远距离。 逃亡者会将自己分布在所有最安全的位置。 这将问题简化为线性方程组，其中每个状态$(p, f)$表示未知的预期捕获时间$E[p][f]$。 如果$p = f$,$E[p][f] = 0$。 否则，官员会选择采取行动以尽量减少$1 + E[p'][f']$，逃亡者选择$f'$最大化$E[p'][f']$。 这导致了可通过迭代或矩阵求逆求解的最小-最大线性系统。 

这种洞察力减少了天真$O(n^4)$概率分支迭代的递归$O(n^3)$解决方案：对于每个军官职位，我们使用动态规划计算针对所有可能的逃犯职位的预期时间，传播值直到收敛。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^4) | O(n^4) | O(n^2) | O(n^2) | 可接受但实施起来很复杂 |
 | 线性系统/DP | O(n^3) | O(n^3) | O(n^2) | O(n^2) | 高效、清洁、可行 |

 ## 算法演练

 1. 解析树输入并构造邻接列表表示。 每个顶点都存储其邻居，以允许恒定时间访问军官的动作。 
2. 初始化一个2D数组$E[p][f]$代表预期捕获时间（如果军官在）$p$和逃犯在$f$。 放$E[p][p] = 0$为所有人$p$，因为捕获是立即发生的。 
3. 预先计算逃亡者的“安全行动”。 对于每对$(p, f)$，找到所有顶点$f'$使得路径从$f$到$f'$不通过$p$。 这可以使用 BFS 或 DFS 有效地完成$f$，忽略包含的子树$p$。 
4. 初始化$E[p][f] = 1$为了$p \ne f$作为起始猜测。 这代表军官下一步行动的基准时间。 
5. 迭代直至收敛：

 1. 对于每个官员职位$p$和逃犯位置$f$， 如果$p \ne f$，计算所有军官移动的最小值$p' \in \{p\} \cup \text{neighbors}(p)$的$1 + \text{average of } E[p'][f']$在所有安全逃亡行动中$f'$。 
2. 更新$E[p][f]$到这个最小值。 重复直到变化低于一个小 epsilon ($1e-9$）。 
6. 最终答案是预计时间$E[s][f]$，对所有可能的逃亡起始位置进行平均$f \ne s$，因为逃亡者可以最佳地选择任何初始顶点。 

这是有效的，因为步骤 5 中的运算符是收缩映射：每次更新都会使值更接近真实期望，并且唯一的固定点表示所有位置的最小-最大期望。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    n = int(input())
    adj = [[] for _ in range(n)]
    for _ in range(n-1):
        u, v = map(int, input().split())
        adj[u-1].append(v-1)
        adj[v-1].append(u-1)
    s = int(input()) - 1

    # Precompute distances and safe moves
    from collections import deque
    safe = [[[] for _ in range(n)] for _ in range(n)]
    for p in range(n):
        for f in range(n):
            visited = [False]*n
            visited[p] = True
            q = deque([f])
            safe[p][f] = []
            while q:
                u = q.popleft()
                safe[p][f].append(u)
                for v in adj[u]:
                    if not visited[v]:
                        visited[v] = True
                        q.append(v)

    # Initialize expected times
    E = [[0.0 if i==j else 1.0 for j in range(n)] for i in range(n)]
    eps = 1e-9
    changed = True
    while changed:
        changed = False
        for p in range(n):
            for f in range(n):
                if p == f:
                    continue
                best = float('inf')
                for np_ in [p] + adj[p]:
                    # Fugitive maximizes
                    sume = 0
                    moves = safe[np_][f]
                    for nf in moves:
                        sume += E[np_][nf]
                    sume /= len(moves)
                    best = min(best, 1 + sume)
                if abs(E[p][f] - best) > eps:
                    E[p][f] = best
                    changed = True

    # Fugitive chooses initial position to maximize expectation
    ans = 0.0
    for f in range(n):
        if f != s:
            ans = max(ans, E[s][f])
    print(ans)

if __name__ == "__main__":
    main()
```邻接列表允许恒定时间访问军官的移动。 逃犯的安全行动是使用 BFS 预先计算的，忽略包含警官的子树。 DP更新$E[p][f]$直至收敛。 对安全逃犯移动的平均实现了逃犯混合策略的概率期望。 我们采用初始位置的最大值，因为逃亡者最佳地选择了起始顶点。 

## 工作示例

 **样品1**

 输入：```
2
1 2
2
```| 步骤| 官员| 逃犯| E[p][f] | E[p][f]
 | ---| ---| ---| ---|
 | 初始化| 2 | 1 | 1 |

 在这里，警官可以立即移动到1，在一分钟内抓获逃犯。 输出为 1。 

**样品2（定制）**

 输入：```
3
1 2
2 3
1
```| 步骤| 官员| 逃犯| E[p][f] | E[p][f]
 | ---| ---| ---| ---|
 | 初始化| 1 | 2 | 1.5 | 1.5
 | 初始化| 1 | 3 | 2 |

 3号逃犯最大化了时间。 最优期望为 2。 

这些痕迹显示了逃犯如何利用远处的位置，以及警官如何选择行动以最大限度地缩短预期抓捕时间。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n^3) | O(n^3) | 对于每个军官和逃犯职位对，我们迭代最多$n$官员移动并考虑最多$n$安全逃犯行动。 |
 | 空间| O(n^2) | O(n^2) | 存储 E[p][f] 和 safe[p][f] 数组。 |

 给定$n \le 100$, (O(n^3
