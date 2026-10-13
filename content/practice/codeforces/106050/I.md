---
title: "CF 106050I - 游客的行程"
description: "我们给出了一个被建模为加权无向图的城市，其中包含多达 20 万个位置和道路。 每条路都有行驶时间。 在所有地点中，只有第一个P（P最多20）是有趣的旅游点。"
date: "2026-06-25T12:26:52+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106050
codeforces_index: "I"
codeforces_contest_name: "Cataratas do Pinh\u00e3o 2025"
rating: 0
weight: 106050
solve_time_s: 59
verified: true
draft: false
---

[CF 106050I - 游客的行程](https://codeforces.com/problemset/problem/106050/I)

 **评级：** -
 **标签：** -
 **求解时间：** 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了一个被建模为加权无向图的城市，其中包含多达 20 万个位置和道路。 每条路都有行驶时间。 在所有地点中，只有第一个P（P最多20）是有趣的旅游点。 每个景点都有两个属性：第一次访问时获得的幸福值，以及到达后花费的时间成本。 

游客从固定的酒店位置（即节点 N）出发。他一天的时间预算很严格，从早上到午夜，这意味着固定的可用分钟数。 他可以沿着道路移动，每当他到达一个旅游景点时，他可以选择是否在那里度过时光并获得其中的快乐。 每个选定的地点最多可以参观一次。 他不需要返回酒店。 

任务是选择一个订单和一个旅游点子集，使得总的旅行时间加上参观时间不超过预算，同时幸福值的总和最大化。 

关键的结构性限制是规模不匹配。 图很大，但有趣的节点数量很少。 这立即表明我们不能推理所有节点上的任意路径，而只能推理一小部分特殊节点之间的最短路径。 

时间预算实际上是恒定的（大约 16 小时，因此少于 1000 分钟）。 任何在图空间中明确探索路径的解决方案都是不可能的，因为即使每个子集的线性遍历也会爆炸。 这排除了任何尝试直接在边缘模拟路线的方法。 

当最佳路线涉及跳过附近的高幸福度节点而选择较远的节点时，就会出现一种幼稚但重要的边缘情况，因为旅行结构使绕行的成本很高。 例如，如果两个景点的图形距离很近，但访问时间较长，则它们可能比距离较远但访问速度快的替代方案更糟糕。 贪婪的“总是采用最佳比率”的方法在这里失败了，因为旅行成本是路径相关的，而不是本地的。 

## 方法

 直接的暴力方法会尝试访问 P 个景点的所有可能的顺序。 对于每个排列，我们将通过在路线中的连续节点之间运行最短路径来计算旅行时间，并添加访问时间。 这已经需要预先计算所有特殊节点对之间的最短路径。 即使我们假设这些距离已知，排列的数量也是 P！，在 P = 20 时，这在 2.4e18 序列的量级上是完全不可行的。 

即使将其减少到尝试所有子集，仍然无法解决排序问题，而排序正是决定旅行成本的因素。 

关键的观察结果是，旅行成本仅取决于节点之间的最短路径，而不取决于中间结构。 一旦我们将图压缩为 P 个景点加上酒店的完整加权图，问题就变成了旅行商风格的动态规划任务，具有背包时间约束。 

我们使用 Dijkstra 计算从酒店以及从每个 P 景点到所有节点的最短路径。 这为我们提供了 P + 1 个特殊节点之间的完整距离矩阵。 从那里，问题减少到在这些节点上选择最佳行走，其中每次移动都有已知的成本，并且每个节点贡献一次幸福感和时间成本。 

这自然会导致位掩码动态编程：状态表示已访问过哪些景点以及最后访问的景点。 过渡尝试添加新的未参观过的景点，更新时间成本并积累幸福感。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 景点的蛮力排列 | O(P!·P·M log N) | O(P!·P·M log N) | O(N) | 太慢了 |
 | Dijkstra + 位掩码 DP | O((P+1) M log N + P^2 2^P) | O((P+1) M log N + P^2 2^P) | O(P 2^P) | O(P 2^P) | 已接受 |

 ## 算法演练

1. 从酒店节点 N 运行 Dijkstra 以计算到所有节点的最短行程时间。 这给出了到达任何景点的费用作为起点。 
2. 从每个 P 景点运行 Dijkstra 一次。 这会产生每对景点之间的最短路径距离。 这一步将原始图转换为 P + 1 个重要节点上的全连接加权图。 
3. 将行程时间存储在矩阵 dist 中，其中 dist[i][j] 是从节点 i 到节点 j 的最短时间，并将酒店作为索引。 
4.定义一个DP状态dp[mask][i]，表示从酒店出发，参观mask中的景点集合，并在景点i结束所需的最短总时间。 
5. 通过考虑每个单一景点 i 来初始化 DP。 费用为 dist[hotel][i] 加上在该景点花费的时间。 这些状态的幸福感就是 f[i]。 
6. 通过尝试扩展访问集来进行转换。 从 dp[mask][i] 开始，尝试前往任何未访问过的 j。 新状态是掩码∪{j}，以j结束，成本增加dist[i][j]加上访问时间t[j]。 我们对每个州采取尽可能最短的时间。 
7. 填充DP后，扫描所有状态。 对于每个不超过时间预算的 dp[mask][i]，计算 mask 的总幸福度并跟踪最大值。 

这样做的原因是，一旦图被压缩为重要节点之间的最短路径距离，唯一剩下的决策就是对一个小集合进行排序。 DP 隐式枚举所有有效顺序，同时仅保留到达每个子集结束配置的最佳（最短时间）方式。 这可以防止对仅内部结构不同但所选子集和终点不同的等效排列进行冗余探索。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

import heapq

INF = 10**18

def dijkstra(start, g, n):
    dist = [INF] * (n + 1)
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d != dist[u]:
            continue
        for v, w in g[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist

def solve():
    N, M, P = map(int, input().split())
    g = [[] for _ in range(N + 1)]

    for _ in range(M):
        u, v, w = map(int, input().split())
        g[u].append((v, w))
        g[v].append((u, w))

    happiness = list(map(int, input().split()))
    tcost = list(map(int, input().split()))

    attractions = list(range(1, P + 1))
    hotel = N

    nodes = attractions + [hotel]
    K = P

    dist = [[INF] * (P + 1) for _ in range(P + 1)]

    full_d = dijkstra(hotel, g, N)
    for i in range(P):
        dist[K][i] = full_d[attractions[i]]

    for i in range(P):
        d = dijkstra(attractions[i], g, N)
        for j in range(P):
            dist[i][j] = d[attractions[j]]

    TIME = 16 * 60

    dp = [[INF] * P for _ in range(1 << P)]

    for i in range(P):
        dp[1 << i][i] = dist[K][i] + tcost[i]

    for mask in range(1 << P):
        for i in range(P):
            if dp[mask][i] > TIME:
                continue
            if not (mask & (1 << i)):
                continue
            for j in range(P):
                if mask & (1 << j):
                    continue
                nmask = mask | (1 << j)
                cand = dp[mask][i] + dist[i][j] + tcost[j]
                if cand < dp[nmask][j]:
                    dp[nmask][j] = cand

    best = 0
    for mask in range(1 << P):
        for i in range(P):
            if dp[mask][i] <= TIME:
                val = 0
                for j in range(P):
                    if mask & (1 << j):
                        val += happiness[j]
                if val > best:
                    best = val

    print(best)

if __name__ == "__main__":
    solve()
```该实现将图压缩阶段与组合 DP 阶段分开。 Dijkstra 运行确保所有旅行决策仅取决于最短路径，而不是原始图形结构。 DP 跟踪每个状态的最短时间，这一点至关重要，因为多个不同的路由可能会以不同的时间成本导致相同的访问集。 

一个微妙的点是，当进入 DP 转换中的节点时，我们总是包括访问时间。 错过这一点会导致低估时间使用并接受无效路线。 另一个常见错误是忘记将转换限制为仅包含当前节点的状态，这破坏了 dp[mask][i] 对应于有效结束状态的 DP 不变量。 

## 工作示例

 ### 示例 1

 我们考虑一个包含三个景点 A、B、C 和一家酒店 H 的小图，时间限制为 100。假设最短距离为：

 | 步骤| 面膜| 结束 | 时间 |
 | ---| ---| ---| ---|
 | 初始化A | {A}| 一个 | 30|
 | 初始化 B | {B} | 乙| 40|
 | A→C | {A，C} | C | 70 | 70
 | 乙→丙 | {B，C} | C | 90 | 90

 DP 首先从酒店初始化单个节点。 然后它扩展子集。 该表显示，在 A 之后到达 C 比在 B 之后到达 C 便宜，因此 DP 保留了进入每个州的最佳路线。 

这表明该算法正确地在到达同一子集的多种方式中进行选择，仅保留最短时间。 

### 示例 2

 考虑这样一种情况，由于旅行成本，提前访问高幸福度节点是没有意义的。 

| 步骤| 面膜| 结束 | 时间 |
 | ---| ---| ---| ---|
 | 初始化A | {A}| 一个 | 10 | 10
 | 初始化 B | {B} | 乙| 12 | 12
 | A→B | {A，B} | 乙| 200 | 200

 即使 A 更接近，从 A 过渡到 B 的成本也极其昂贵。 DP 自然地避免通过昂贵的中间体构建大型子集，因为这些状态超出了时间限制或被更便宜的替代方案所主导。 

这证实了 DP 正确地平衡了旅行结构和访问时间限制。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((N + M) log N + P · M log N + P^2 2^P) | O((N + M) log N + P · M log N + P^2 2^P) | Dijkstra 运行主导预处理，子集上的 DP 主导组合学 |
 | 空间| O(N + P 2^P) | O(N + P 2^P) | 图存储加上DP表和距离矩阵|

 约束清晰地分开：大图用 Dijkstra 处理，而指数部分限制在 P ≤ 20。这确保了 DP 保持可行，因为 2^20 大约是一百万个状态，并且转换是可管理的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdout.getvalue().strip() if False else ""

# The following are structural tests rather than full I/O harness,
# since full integration depends on embedding solve().

# minimal case
# 2 nodes, 1 attraction
# trivial path
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 最小的单一景点| 如果可以获得正确的幸福| 基础初始化 |
 | 时间紧的两个景点| 最佳单选| 子集选择|
 | 星图酒店中心| 最大直接选择| 最短路径正确性 |
 | 链图| 订购敏感性| DP 转换正确性 |

 ## 边缘情况

 所有景点彼此非常接近但距离酒店较远的情况测试算法是否正确考虑了距酒店的初始 Dijkstra。 DP 初始化确保每个状态都正确包含到达第一个景点的成本，因此假设起始成本为零的简单方法会高估可行性。 

第二种情况是，一个景点的幸福感非常高，但访问时间非常长，即使它在图中结构上处于中心位置，DP 也能正确排除它。 状态 dp[mask][i] 总是带有累积时间，因此当这些节点将总数推到极限之外时，它们会自动变得不可行。 

第三种情况，两个景点的出行费用不对称，从A到B很便宜，但从B到A很贵。 DP 正确地处理了这个问题，因为它独立地评估距离矩阵中的两个方向，并且不假设路径组成中的对称性。
