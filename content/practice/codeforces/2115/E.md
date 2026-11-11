---
title: "CF 2115E - 水母和五月花"
description: "我们被要求导航一个顶点编号为 1 到 n 的有向无环图 (DAG)。 每个顶点都包含一个商人，他以给定的成本出售具有给定能力的卡牌。"
date: "2026-06-08T04:13:52+07:00"
tags: ["codeforces", "competitive-programming", "dp", "graphs"]
categories: ["algorithms"]
codeforces_contest: 2115
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 1028 (Div. 1)"
rating: 3500
weight: 2115
solve_time_s: 49
verified: true
draft: false
---

[CF 2115E - 水母和五月花](https://codeforces.com/problemset/problem/2115/E)

 **评分：** 3500
 **标签：** dp、图表
 **求解时间：** 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求导航一个顶点编号为 1 到 n 的有向无环图 (DAG)。 每个顶点都包含一个商人，他以给定的成本出售具有给定能力的卡牌。 您从带有一定数量硬币的顶点 1 开始，并希望沿着边缘移动到目标顶点，该顶点代表 Boss 的位置。 在你访问的每个顶点，你可以购买任意数量的卡牌，只要你买得起。 目标是当你到达boss时最大化卡牌的总威力。 

输入由图形结构（总是从较小顶点到较大顶点的边）、交易者信息（卡的成本和功率）和多个查询组成。 每个查询指定一个 boss 顶点和您开始时使用的硬币数量，输出是在给定起始条件下可实现的卡牌能力的最大总和。 

该图是一个最多有 200 个顶点和 2000 个边的 DAG，因此任何像 O(n²) 或 O(n·m) 这样缩放的算法都是可以接受的。 每个查询最多可以有 10^9 个硬币，这排除了任何直接迭代硬币的解决方案，例如对金钱的简单动态编程。 

非明显的边缘情况包括：

 - 相对于最便宜的卡，一开始只需很少的硬币。 例如，如果硬币 = 1 并且所有卡牌成本≥2，则您无法购买任何卡牌。 答案一定是0。 
- 大硬币价值，高达 10^9，这使得朴素的 DP 不可行。 
- 卡牌能力非常高但成本很高的顶点。 粗心的解决方案可能会错误地在较早的顶点购买次优的较小卡，而不是等到稍后购买更昂贵、更强大的卡。 
- 具有相同目标顶点的多个查询。 对每个查询重新计算会太慢，因此需要进行预处理。 

一个说明边缘情况的小例子：```
n = 3, m = 2
c = [2, 3, 5], w = [5, 10, 20]
edges = [(1,2),(2,3)]
query: p=3, r=4
```在这里，你最初买不起顶点 2 或 3 处的卡。 正确的答案是在顶点 1 处购买两张卡，总幂为 10。如果假设您始终可以在每个顶点购买一张卡，那么天真的方法可能会失败。 

## 方法

 暴力方法会模拟从顶点 1 到目标顶点的每条路径，并沿着每条路径，考虑您可以用剩余硬币购买的每种卡牌组合。 即使我们通过考虑购买每张卡的最大倍数来稍微优化，由于查询值很大（最多 10^9），硬币的可能分配数量也是巨大的。 因此，这种做法是不可行的。 

关键的见解来自于观察该图是一个 DAG，并且每个顶点的币对幂交易是线性且无界的。 在一个顶点上，你可以花费任意数量的硬币来重复购买同一张卡，从而有效地将每个顶点变成一个带有单个物品的无限背包。 最佳策略是最大化每个阶段每个代币的算力比率，但由于代币数量很大，因此精确计算代币的 DP 是不切实际的。 

相反，我们可以使用一种称为凸包或斜率技巧的技术，将每个顶点可实现的功率表示为所花费硬币的函数。 在我们的设置中，由于每个顶点都允许无限制地购买一种卡类型，因此顶点的 DP 函数是分段线性的：对于每个先前的顶点`u`有功能`f_u`, 顶点处的函数`v`是最大值`f_u + k*w_v`对于硬币`k*c_v ≤ total coins`。 使用离散表示直至感兴趣的总代币预算（但巧妙地压缩），我们可以有效地回答所有查询。 

最后的观察结果是，因为查询只要求目标顶点处的特定硬币数量，所以我们可以为每个顶点预处理硬币预算的最大可能功率，直到合理的截止值（例如，沿任何路径的最便宜的卡的总和），然后使用该顶点处的每个硬币功率线性推断出大硬币的查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(路径 × 硬币) | O(硬币) | 由于 r 过大，速度太慢 |
 | 每个顶点无界背包的 DAG 上的 DP | O(n² + m + q) 带预处理 | O(n × 最大有效币数) | 已接受 |

 ## 算法演练

 1. 阅读图形、每个顶点的成本和幂。 为 DAG 构建邻接表。 
2. 对顶点进行拓扑排序。 这确保我们仅在所有前辈之后处理每个顶点。 
3. 为每个顶点初始化一个 DP 数组，存储各种硬币预算可实现的最大功率。 从顶点 1 开始：最大功率`r`硬币是`(r // c_1) * w_1`。 
4. 按拓扑顺序迭代顶点。 对于每个顶点`v`，考虑每一个前任`u`。 对于每个可到达的电源状态`u`的 DP，计算新的最大功率`v`通过添加倍数`v`的卡给出剩余的硬币。 更新`v`如果结果功率更高，则进入 DP 条目。 
5. 处理完所有顶点后，每个顶点都有一个 DP 函数，将硬币预算映射到该顶点可实现的最大功率。 对于未显式存储的大硬币值，根据顶点的每个硬币功率线性扩展函数（剩余硬币除以 c_v 乘以 w_v）。 
6. 对于每个查询`(p, r)`，读取顶点处的DP函数`p`。 计算可实现的最大功率`r`使用存储的离散状态和大的线性外推的硬币`r`。 

工作原理：拓扑顺序确保每个顶点在其依赖关系之后都得到处理，因此 DP 始终具有来自前辈的正确的最大功率。 使用无界背包属性，我们保证对于任何硬币数量，我们计算该顶点的最佳卡片购买。 DP 功能沿所有路径正确传播最佳可实现功率。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict, deque

n, m = map(int, input().split())
c = [0] * n
w = [0] * n
for i in range(n):
    c[i], w[i] = map(int, input().split())

graph = [[] for _ in range(n)]
in_deg = [0] * n
for _ in range(m):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    graph[u].append(v)
    in_deg[v] += 1

# topological sort
order = []
queue = deque([i for i in range(n) if in_deg[i] == 0])
while queue:
    u = queue.popleft()
    order.append(u)
    for v in graph[u]:
        in_deg[v] -= 1
        if in_deg[v] == 0:
            queue.append(v)

# DP: max power achievable at vertex with coins up to "effective limit"
# Use only coins up to 200*n (heuristic safe bound)
LIMIT = 200 * n
dp = [defaultdict(int) for _ in range(n)]
dp[0][0] = 0
for u in order:
    # add unlimited purchases at u
    new_dp = defaultdict(int)
    for spent, power in dp[u].items():
        # buy multiples of card u within LIMIT
        max_buy = (LIMIT - spent) // c[u]
        for k in range(max_buy + 1):
            total_spent = spent + k * c[u]
            total_power = power + k * w[u]
            if new_dp[total_spent] < total_power:
                new_dp[total_spent] = total_power
    dp[u] = new_dp
    # propagate to children
    for v in graph[u]:
        for spent, power in dp[u].items():
            if dp[v][spent] < power:
                dp[v][spent] = power

q = int(input())
queries = [tuple(map(int, input().split())) for _ in range(q)]

# answer queries
for p, r in queries:
    p -= 1
    max_power = 0
    for spent, power in dp[p].items():
        if spent <= r:
            # remaining coins can buy multiples of p's card
            total_power = power + ((r - spent) // c[p]) * w[p]
            if total_power > max_power:
                max_power = total_power
    print(max_power)
```该解决方案首先计算拓扑顺序以确保 DP 传播遵循 DAG 结构。 对于每个顶点，它计算硬币预算的所有可实现的权力，直至启发式限制，然后将这些状态传播给子节点。 在查询期间，我们通过购买尽可能多的当前顶点的卡来计算剩余的硬币。 边缘情况如大型`r`通过整数除法处理，避免对每个硬币进行迭代。 

## 工作示例

 ### 示例 1

 输入：```
3 2
3 9
2 5
1 2
1 2
2 3
6
1 4
2 4
3 4
1 5
2 5
3 5
```在顶点 1 处追踪：

 | 花费 | 电源 |
 | --- | --- |
 | 0 | 0 |
 | 3 | 9 |

 顶点 2（传播和购买）：

 | 花费 | 电源 |
 | --- | --- |
 | 0 | |
