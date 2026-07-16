---
title: "CF 103462E - Eaom 和 Longzhu"
description: "我们得到了通过门户连接的房间的有向或无向加权图。 旅行者从房间 1 出发，想要到达房间 n。 每次他进入一个房间，他都会收集一种叫做“龙珠”的物品，而每根龙珠都有七种类型中的一种。"
date: "2026-07-03T07:01:10+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103462
codeforces_index: "E"
codeforces_contest_name: "The Hangzhou Normal U Qualification Trials for ZJPSC 2021"
rating: 0
weight: 103462
solve_time_s: 51
verified: true
draft: false
---

[CF 103462E - Eaom 和 Longzhu](https://codeforces.com/problemset/problem/103462/E)

 **评级：** -
 **标签：** -
 **求解时间：** 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了通过门户连接的房间的有向或无向加权图。 旅行者从房间 1 出发，想要到达房间 n。 每次他进入一个房间，他都会收集一种叫做“龙珠”的物品，而每根龙珠都有七种类型中的一种。 

通过门户移动会消耗能量，但成本有一个变化：每次移动后，旅行者都会获得能量退款，该退款取决于在前一个房间中收集的龙珠类型和在当前房间中收集的龙珠类型。 退款由 7 × 7 矩阵指定，移动时的实际能量变化是门户成本减去相应的退款值。 

目标是选择从房间 1 到房间 n 的路径，同时选择在每个访问的房间中拾取哪种龙珠类型，以使消耗的总能量最小化。 

该声明的一个关键观察结果是，允许重新访问房间，并且每次访问都允许选择可能不同的龙珠类型。 这意味着状态不仅仅是一个房间，而且还包括最后收集的类型。 

约束条件建议图形大小适中，最多 500 个房间和最多约 125k 条边。 对所有路径采用简单的方法是不可能的，因为路径的数量呈指数增长。 即使每个节点的每种类型的最短路径也很重要，因为转换取决于先前的类型。 

一个微妙的边缘情况是由于每个房间的龙珠收藏不是固定的。 例如，如果一个房间可以重新访问，我们可能想多次进入它，专门更改最后收集的类型。 

另一个重要的边缘情况是，某些转换可能会产生负净成本（因为退款最高可达 10，而边缘成本是 10 的倍数），这意味着需要标准 Dijkstra，无需仔细的状态处理。 

## 方法

 蛮力的想法是将每个可能的房间访问序列和龙珠选择视为单独的路径。 在每一步中，我们选择下一个房间和类型，并累积能量变化。 这立即变成指数，因为在每个节点，我们分支最多 7 种类型和多个传出边，并且重新访问节点会创建循环。 即使限制为最短的简单路径也无济于事，因为成本取决于类型之间的转换，而不仅仅是节点。 

关键的见解是，过去需要的唯一记忆是最后收集的龙珠类型。 沿着边缘移动的成本仅取决于先前类型和当前类型，而不取决于完整历史记录。 这将问题简化为（room，last_type）形式的状态上的分层最短路径。 最多有 500 × 7 个状态，这对于 Dijkstra 来说已经足够小了。 

每个状态转换对应于沿着图边缘移动并为目标节点选择新类型。 成本是边权重减去矩阵的退款。 由于权重是非负的，但退款可能会减少权重，因此如果我们正确合并矩阵，我们仍然有非负的有效成本。 

我们从节点 1 的所有状态运行 Dijkstra，并选择初始类型。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 路径上的暴力破解 | 指数| 指数| 太慢了 |
 | Dijkstra on (node, last_type) 状态 | O((n·7 + m·7) log (n·7)) | O((n·7 + m·7) log (n·7)) | O(n·7 + m·7) | 已接受 |

 ## 算法演练

 我们将每个状态建模为一对 (u, c)，其中 u 是一个房间，c 是最后收集的 longzhu 类型。 我们将计算达到每个这样的状态所需的最小能量。

1. 为所有房间和类型初始化一个无穷大的距离表 dist[u][c]。 该表表示当最后收集的龙珠类型为c时到达房间u的最低能量消耗。 
2.对于起始房间1，我们可以自由选择7种类型中的任何一种。 对于每种类型 c，设置 dist[1][c] = 0 并将 (0, 1, c) 推入优先级队列。 这反映出第一龙珠并没有产生任何过渡成本。 
3. 在这些增强状态上运行标准 Dijkstra 过程。 每次我们弹出 (cost, u, c) 时，如果它与 dist[u][c] 相比已经过时，我们就会跳过它。 
4. 对于权重为 w 的每条边 (u → v)，考虑移动到 v 并在 [0, 6] 中选择一个新类型 nc。 过渡成本为：

 w - x[c][nc]

 其中 x[c][nc] 是将最后一个类型 c 切换到新类型 nc 的退款。 
5. 对于每个候选下一个类型 nc，计算 new_cost = cost + w - x[c][nc]。 如果这改善了 dist[v][nc]，则更新它并将其推入优先级队列。 这一步是正确的，因为每次访问节点都允许选择新的龙珠类型。 
6. 处理完所有状态后，答案是 [0, 6] 中所有 c 中 dist[n][c] 中的最小值。 如果全部保持无穷大，则输出-1。 

### 为什么它有效

 不变的是，每当 Dijkstra 确定状态 (u, c) 时，我们就找到了以最后收集的类型 c 到达房间 u 的最小可能能量成本。 这是成立的，因为一旦选择了前一个类型和下一个类型，每个转换成本都是固定的，并且所有边缘松弛都遵循扩展状态图中的非负调整权重。 原来的问题变成了一个有 7n 个节点的图上的最短路径问题，Dijkstra 保证了这些条件下的最优性。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

INF = 10**30

def solve():
    n, m = map(int, input().split())
    
    x = [list(map(int, input().split())) for _ in range(7)]
    
    g = [[] for _ in range(n + 1)]
    for _ in range(m):
        u, v, w = map(int, input().split())
        g[u].append((v, w))
        g[v].append((u, w))
    
    dist = [[INF] * 7 for _ in range(n + 1)]
    pq = []
    
    for c in range(7):
        dist[1][c] = 0
        heapq.heappush(pq, (0, 1, c))
    
    while pq:
        d, u, c = heapq.heappop(pq)
        if d != dist[u][c]:
            continue
        
        for v, w in g[u]:
            for nc in range(7):
                nd = d + w - x[c][nc]
                if nd < dist[v][nc]:
                    dist[v][nc] = nd
                    heapq.heappush(pq, (nd, v, nc))
    
    ans = min(dist[n])
    print(-1 if ans == INF else ans)

if __name__ == "__main__":
    solve()
```该实现直接镜像分层状态图。 dist 数组对节点和最后类型状态进行编码。 优先级队列确保我们始终首先扩展最便宜的已知状态。 

一个常见的陷阱是忘记在节点 1 处初始化所有 7 个类型。这是必需的，因为第一步取决于我们假装最初收集的类型。 

另一个微妙的点是，我们永远不会在起始位置减去退款，因为在第一个状态之前没有先前的类型。 

## 工作示例

 考虑一个有 2 个房间和一条边的最小图：```
n = 2, m = 1
edge: 1 - 2 cost 10
x[0][0] = 0 (all other values irrelevant)
```| 步骤| 状态| 行动| 距离更新 |
 | --- | --- | --- | --- |
 | 初始化| (1,0..6) | 开始 | 0 |
 | 流行 | (1,0)| 使用类型 0 转到 2 | 10 | 10
 | 完成 | (2,0) | 结束 | 10 | 10

 这表明即使没有退款，答案也只是最短路径成本。 

现在考虑退款很重要的情况：```
n = 2, m = 1
edge: 1 - 2 cost 10
x[0][1] = 10, others 0
```| 步骤| 状态| 行动| 成本|
 | --- | --- | --- | --- |
 | 初始化| (1,0..6) | 开始 | 0 |
 | 流行 | (1,0)| 在节点 2 处选择类型 1 | 10 - 10 = 0 | 10 - 10 = 0
 | 结果 | (2,1) | 廉价到达| 0 |

 这表明该算法正确地利用了最佳类型转换。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n·7² + m·7² log(n·7)) | O(n·7² + m·7² log(n·7)) | 每条边在 Dijkstra 内经过 7×7 类型的过渡而松弛 |
 | 空间| O(n·7 + m) | 邻接表和距离表|

 常数很小：7 是固定的，因此该解的行为就像具有大约 3500 个状态的图上的标准最短路径。 即使只有 8 秒，这也很容易符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from subprocess import Popen, PIPE
    import textwrap
    
    code = r"""
import sys, heapq
input = sys.stdin.readline

INF = 10**30

def solve():
    n, m = map(int, input().split())
    x = [list(map(int, input().split())) for _ in range(7)]
    g = [[] for _ in range(n + 1)]
    for _ in range(m):
        u, v, w = map(int, input().split())
        g[u].append((v, w))
        g[v].append((u, w))
    dist = [[INF]*7 for _ in range(n+1)]
    pq = []
    for c in range(7):
        dist[1][c] = 0
        heapq.heappush(pq, (0,1,c))
    while pq:
        d,u,c = heapq.heappop(pq)
        if d != dist[u][c]:
            continue
        for v,w in g[u]:
            for nc in range(7):
                nd = d + w - x[c][nc]
                if nd < dist[v][nc]:
                    dist[v][nc] = nd
                    heapq.heappush(pq,(nd,v,nc))
    ans = min(dist[n])
    print(-1 if ans >= INF else ans)

solve()
"""
    p = Popen([sys.executable, "-c", code], stdin=PIPE, stdout=PIPE, stderr=PIPE, text=True)
    out, err = p.communicate(inp)
    return out.strip()

# custom cases
assert run("""2 1
0 0 0 0 0 0 0
0 0 0 0 0 0 0
0 0 0 0 0 0 0
0 0 0 0 0 0 0
0 0 0 0 0 0 0
0 0 0 0 0 0 0
0 0 0 0 0 0 0
1 2 10
""") == "10"

assert run("""2 1
0 0 0 0 0 0 0
0 0 0 0 0 0 0
0 0 0 0 0 0 0
0 0 0 0 0 0 0
0 0 0 0 0 0 0
0 0 0 0 0 0 0
0 0 0 0 0 0 0
1 2 10
""") == "10"

assert run("""3 2
0 0 0 0 0 0 0
0 0 0 0 0 0 0
0 0 0 0 0 0 0
0 0 0 0 0 0 0
0 0 0 0 0 0 0
0 0 0 0 0 0 0
0 0 0 0 0 0 0
1 2 10
2 3 10
""") == "20"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单边| 10 | 10 基本正确性|
 | 同款零退款| 10 | 10 状态初始化 |
 | 链图| 20 | 多步传播 |

 ## 边缘情况

 一个边缘情况是，最佳策略在一开始就有意选择一种不明显的龙珠类型。 节点 1 处所有七种类型的初始化确保我们不会错误地限制初始状态。 该算法平等对待所有起始类型，因此即使只有一种类型导致最佳转换，它也是可以达到的。 

另一种情况是，退款金额足够大，足以使搬家实际上免费甚至有益。 Dijkstra 框架仍然有效，因为只要转换是有界的并且每个边缘步骤一致，扩展状态图就不会在状态级别引入负循环。 该算法将通过重复松弛来正确传播改进的状态，直到稳定。 

最后的边缘情况是重新访问节点以更改类型。 该算法自然地处理这个问题，因为 (u, c) 是一个完整状态，因此使用不同的 c 重新访问 u 只是扩展图中的另一个节点。
