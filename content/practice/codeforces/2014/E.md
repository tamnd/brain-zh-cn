---
title: "CF 2014E - 玛丽安与罗宾的约会"
description: "我们正在研究一个加权无向图，其中两个人从相反的两端开始，并希望尽快见面。 一个从顶点 1 开始，另一个从顶点 n 开始。"
date: "2026-06-08T13:00:46+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "graphs", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 2014
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 974 (Div. 3)"
rating: 1800
weight: 2014
solve_time_s: 74
verified: true
draft: false
---

[CF 2014E - 玛丽安与罗宾的约会](https://codeforces.com/problemset/problem/2014/E)

 **评分：** 1800
 **标签：** dfs 和类似的、图、最短路径
 **求解时间：** 1m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在研究一个加权无向图，其中两个人从相反的两端开始，并希望尽快见面。 一个从顶点 1 开始，另一个从顶点 n 开始。 它们沿着边移动，但有一个转折点：一些顶点包含马，并且使用马会在你拿起它后将所有旅行时间减半。 每个人都可以独立决定何时骑马，一旦骑马，速度提升将永久保持。 

目标是确定两个旅行者可以同时占据同一顶点的最早可能时间，假设最佳移动和可选等待。 

核心难点是每个人的出行成本不是单一的最短路径问题。 相反，成本取决于他们在到达给定点之前是否已经访问过马顶点。 这意味着每个顶点实际上有两种状态：没有马优势和有马优势。 

这些约束清楚地表明任何解决方案都必须接近线性。 每个测试批次最多有 2×10^5 个顶点和边，任何在每次状态转换时从头开始重新计算最短路径或显式模拟会议时间的方法都太慢。 每个状态的标准 Dijkstra 是可以接受的，但是像重新计算所有顶点上的成对会议时间这样的事情是不可接受的。 

如果我们忽略有状态性，就会出现一些微妙的失败案例。 

如果我们将马顶点视为在第一次遇到时贪婪地应用的简单成本修改器，就会出现一个问题。 例如，一条路径可能过早地通过马顶点而无法充分受益，而天真的算法可能会认为立即采取它总是最佳的。 

另一个问题是假设每个节点有一个最短路径距离就足够了。 但这会失败，因为稍后到达某个节点而没有马可能仍然比较早到达而没有马要好，具体取决于未来的加速。 

最后，一种简单的方法可能会尝试计算来自两端的最短路径，并在最大距离上取最小值。 这种情况会被打破，因为两个旅行者可以在不同的时间到达，而一个人可以等待。 

## 方法

 直接的暴力方法将尝试通过独立模拟两个旅行者到该顶点的最佳移动策略来计算每个顶点的最佳可能相遇时间。 对于每个顶点 v，我们将计算玛丽安在所有可能的骑马时间选择下到达 v 的最短时间，对于罗宾来说类似，然后取两个到达时间中的最大值。 答案将是所有顶点的最小值。 

问题在于，由于马状态，计算单个“最小到达时间”已经不是标准的最短路径。 如果我们尝试明确地分支是否在每个顶点都选择了一匹马，则每个路径决策都会使状态空间加倍，并且朴素枚举会导致指数路径或至少对马激活子集进行 O(2^n) 式推理。 

关键的观察结果是，该问题干净地分解为扩展状态图上的最短路径问题，每个节点只有两个状态：马前和马后。 一旦认识到这一点，机芯就成为标准的 Dijkstra 机芯。 我们从两个起点运行多源最短路径，跟踪使用和不使用马匹的最佳到达时间，然后合并每个顶点的结果。 

第二个重要的见解是如何对马匹拾取进行建模。 在马顶点，我们可以以零成本从“正常速度”状态过渡到“快速”状态。 从那时起，所有边都以一半的成本遍历。 由于所有权重都是偶数，减半可以保持完整性。 

一旦我们在每个顶点的两个状态上都获得了玛丽安和罗宾的最短到达时间，则顶点处的最佳会面时间就是所有有效状态组合中的最小值。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解路径和马匹选择 | 指数| 高| 太慢了|
 | 每个来源的 2 态 Dijkstra | O((n + m) log n) | O((n + m) log n) | O(n + m) | 已接受 |

 ## 算法演练

 我们将每个顶点视为有两层：第 0 层表示尚未使用马，第 1 层表示旅行者当前正在骑一匹马（或之前已激活一匹马）。 每条边的遍历取决于当前层。 

1. 构建一个图，其中每个顶点都有两个状态。 状态 0 转换代表全成本步行边缘，状态 1 转换代表半成本骑行。 这抓住了马的使用永久改变移动速度的事实。 
2. 分别初始化Marian 和Robin 的距离。 对于两者，将状态 0 中起始顶点的距离设置为零。 如果起始顶点有一匹马，我们也允许瞬时转换到状态 1。 
3. 在 Marian 的扩展状态图上运行 Dijkstra 算法。 每个状态都是（顶点，模式），并且转换遵循上述规则。 这将计算玛丽安在有或没有马优势的情况下到达每个顶点的最短时间。 
4. 从顶点 n 开始对 Robin 重复相同的 Dijkstra。 这会产生第二个距离表。 
5. 对于每个顶点 v，通过考虑所有状态组合来计算最佳可能的会面时间：Marian 处于状态 0 或 1，Robin 处于状态 0 或 1。 会面时间是 max(distM[v][i], distR[v][j]) 中的最小值。 
6. 取所有顶点的最小值。 如果两者都没有可到达的顶点，则输出 -1。 

### 为什么它有效

 状态图构造确保每个有效的现实世界策略恰好对应于扩展图中的一条路径。 关键的不变量是，一旦旅行者进入状态 1，所有后续的边权重都会减半，这与问题的不可逆马效应相匹配。 Dijkstra 保证了最优性，因为所有转换都具有非负权重，并且该图不包含除二态编码之外的隐藏依赖项。 因此，这个扩展空间中的最短路径与原始问题中的最优旅行策略完全对应。 

## Python 解决方案```python
import sys
import heapq
input = sys.stdin.readline

INF = 10**18

def dijkstra(n, adj, horses, start):
    dist = [[INF, INF] for _ in range(n + 1)]
    pq = []

    dist[start][0] = 0
    heapq.heappush(pq, (0, start, 0))

    if horses[start]:
        dist[start][1] = 0
        heapq.heappush(pq, (0, start, 1))

    while pq:
        d, u, s = heapq.heappop(pq)
        if d != dist[u][s]:
            continue

        for v, w in adj[u]:
            if s == 0:
                nd = d + w
                ns = s
                if nd < dist[v][ns]:
                    dist[v][ns] = nd
                    heapq.heappush(pq, (nd, v, ns))
            else:
                nd = d + w // 2
                ns = s
                if nd < dist[v][ns]:
                    dist[v][ns] = nd
                    heapq.heappush(pq, (nd, v, ns))

        if s == 0 and horses[u]:
            if d < dist[u][1]:
                dist[u][1] = d
                heapq.heappush(pq, (d, u, 1))

    return dist

t = int(input())
for _ in range(t):
    n, m, h = map(int, input().split())
    horses = [0] * (n + 1)
    for x in map(int, input().split()):
        horses[x] = 1

    adj = [[] for _ in range(n + 1)]
    for _ in range(m):
        u, v, w = map(int, input().split())
        adj[u].append((v, w))
        adj[v].append((u, w))

    distM = dijkstra(n, adj, horses, 1)
    distR = dijkstra(n, adj, horses, n)

    ans = INF
    for v in range(1, n + 1):
        ans = min(ans,
                  max(distM[v][0], distR[v][0]),
                  max(distM[v][0], distR[v][1]),
                  max(distM[v][1], distR[v][0]),
                  max(distM[v][1], distR[v][1]))

    print(-1 if ans == INF else ans)
```该实现将马效应编码为二进制状态。 Dijkstra队列存储（距离、节点、状态）的元组，并且状态转换被仔细地分开。 唯一微妙的过渡是在马顶点，我们允许以零成本切换到加速状态。 

组合答案时，将显式检查所有四个状态对。 这是必要的，因为旅行者在到达相遇顶点之前可能已经或可能没有激活马匹。 

## 工作示例

 ### 示例 1（直接改进的简单图表）

 考虑一个图，其中 1 连接到权重为 10 的 2，2 连接到权重为 10 的 3，并且顶点 2 有一匹马。 Marian starts at 1 and Robin at 3.

 | 步骤| 玛丽安分布[2][0] | 玛丽安分布[2][1] | 罗宾分布[2][0] | 罗宾分布[2][1] |
 | --- | --- | --- | --- | --- |
 | 初始化| 0 于 1 | 0 at 1 if 马 else INF | 0 于 3 | 0 at 3 if 马 else INF |
 | 迪杰斯特拉之后 | 10，然后通过马 5 | 5 | 10 | 10 5 通过 2 |

 在顶点 2 处，Marian 骑着马到达 5，Robin 从另一边到达 5。 集合时间是5点。 

这证实了在正确的顶点切换状态对于最优性至关重要。 

### 示例2（延迟马匹使用优势）

 路径 1-2-3-4，其中只有顶点 3 有一匹马，并且早期边的权重很大。 玛丽安可能会晚到 3 岁，但激活后会显着受益。 罗宾同样从对面接近。 

关键的观察结果是，最佳会面点不一定是在基本模式下最早到达的地方。 状态表显示，延迟激活会产生严格更好的下游时间，从而验证了对两层 Dijkstra 模型的需求。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) log n) | O((n + m) log n) | 两个 Dijkstra 在每个节点有 2 个状态的图上运行，每条边处理固定次数 |
 | 空间| O(n + m) | 两个源的邻接表和距离数组 |

 测试用例中的顶点和边的总和以 2×10^5 为界，因此即使使用基于堆的优先级队列，该方法也可以在限制内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import defaultdict
    import heapq

    INF = 10**18

    def dijkstra(n, adj, horses, start):
        dist = [[INF, INF] for _ in range(n + 1)]
        pq = []
        dist[start][0] = 0
        heapq.heappush(pq, (0, start, 0))
        if horses[start]:
            dist[start][1] = 0
            heapq.heappush(pq, (0, start, 1))

        while pq:
            d, u, s = heapq.heappop(pq)
            if d != dist[u][s]:
                continue
            for v, w in adj[u]:
                nd = d + (w if s == 0 else w // 2)
                if nd < dist[v][s]:
                    dist[v][s] = nd
                    heapq.heappush(pq, (nd, v, s))
            if s == 0 and horses[u]:
                if d < dist[u][1]:
                    dist[u][1] = d
                    heapq.heappush(pq, (d, u, 1))
        return dist

    t = int(input())
    out = []
    for _ in range(t):
        n, m, h = map(int, input().split())
        horses = [0] * (n + 1)
        for x in map(int, input().split()):
            horses[x] = 1
        adj = [[] for _ in range(n + 1)]
        for _ in range(m):
            u, v, w = map(int, input().split())
            adj[u].append((v, w))
            adj[v].append((u, w))

        distM = dijkstra(n, adj, horses, 1)
        distR = dijkstra(n, adj, horses, n)

        ans = INF
        for v in range(1, n + 1):
            ans = min(ans,
                      max(distM[v][0], distR[v][0]),
                      max(distM[v][0], distR[v][1]),
                      max(distM[v][1], distR[v][0]),
                      max(distM[v][1], distR[v][1]))

        out.append(str(-1 if ans == INF else ans))

    return "\n".join(out)

# sample 1
assert run("""6
2 1 1
1
1 2 10
3 1 2
2 3
1 2 10
3 3 1
2
1 2 4
1 3 10
2 3 6
4 3 2
2 3
1 2 10
2 3 18
3 4 16
3 2 1
2
1 2 4
1 3 16
7 7 1
3
1 5 2
2 6 12
1 2 12
6 4 8
7 3 4
6 3 4
7 6 4
""") == """5
-1
6
19
14
12"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 | 5 -1 6 19 14 12 | 5 -1 6 19 14 12 混合图表和马匹位置的正确性|

 ## 边缘情况

 一个关键的边缘情况是起始节点已经包含一匹马。 在这种情况下，该算法允许以零成本立即转换到加速状态。 如果省略此转换，则该旅行者的所有下游距离都会被高估，从而产生不正确的会面时间。 

另一种边缘情况发生在两个旅行者到达不同状态的顶点时，例如一个有马，一个没有。 正确的会议时间必须考虑所有四种状态组合。 未能检查混合状态会议会错误地假设两个旅行者的行为是对称的，这是错误的，因为一个人可能更早获得了加速。 

最后一个微妙的情况是断开的图。 如果任一距离对于所有顶点的所有状态都保持无限，则答案必须为 -1。 组合步骤自然地处理这个问题，因为所有最大操作都保持无限，并且最终的最小值永远不会更新。
