---
title: "CF 105618F-\u041a\u0442\u043e\u0445\u043e\u0447\u0435\u0442\u0441\u0442\u0430\u0442\u044c \u043d\u0435\u043c\u0430\u043b\u043e\u043d\u044c\u0435\u0440\u043e\u043c？"
description: "我们得到一个带有 $n$ 个房间和 $m$ 个双向隧道的加权无向图。 每条隧道都有一定的交通费用。 我们总是从房间 $1$ 开始，对于每个房间 $v$，我们希望以最低成本达到它。"
date: "2026-06-26T18:19:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105618
codeforces_index: "F"
codeforces_contest_name: "\u041a\u043e\u0433\u043d\u0438\u0442\u0438\u0432\u043d\u044b\u0435 \u0442\u0435\u0445\u043d\u043e\u043b\u043e\u0433\u0438\u0438 2024-2025. \u0422\u0440\u0435\u0442\u0438\u0439 \u043e\u0442\u0431\u043e\u0440"
rating: 0
weight: 105618
solve_time_s: 68
verified: true
draft: false
---

[CF 105618F-\u041a\u0442\u043e\u0445\u043e\u0447\u0435\u0442\u0441\u0442\u0430\u0442\u044c \u043d\u0435\u043c\u0430\u043b\u043e\u043d\u044c\u0435\u0440\u043e\u043c？]（https://codeforces.com/problemset/problem/105618/F）

 **评级：** -
 **标签：** -
 **求解时间：** 1m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个带权无向图$n$房间和$m$双向隧道。 每条隧道都有一定的交通费用。 我们总是从房间开始$1$，并且对于每个房间$v$我们希望以最低的成本来实现这一目标。 

扭曲是与每个房间相关的单一特殊能力$a$：如果我们现在在房间$a$，我们可以立即创建一个新隧道$a$到任何其他房间$v$有成本$c_a$。 这条人工隧道在任何路线上只能使用一次。 它的行为就像“传送边缘”，其成本仅取决于激活它的房间。 

至关重要的是，这种能力不是全球性的。 对于每个目的地$v$，我们可以想象在从$1$到$v$，但不同的目的地可能会选择不同的传送激活。 

所以对于一个固定的目标$v$，有效路径要么是原始图中的正常最短路径，要么是在某个点访问节点的路径$a$，然后直接跳转到$v$支付费用$c_a$。 

约束允许最多$2 \cdot 10^5$所有测试用例的总顶点和边，这推动我们$O((n+m)\log n)$或线性算术解。 任何试图从头开始为每个节点重新计算最短路径的想法都会太慢，因为即使每个节点有一个 Dijkstra 也会爆炸$O(nm \log n)$。 

当图表断开连接时，会出现微妙的边缘情况。 如果没有传送，某些节点将无法到达。 通过传送，如果有任何可到达的节点，它们仍然可以到达$a$提供有限的$c_a$，因为我们可以直接从$a$到任意顶点。 

另一种情况是传送比任何地方的正常路径都差。 那么它必须被完全忽略，并且答案会减少到标准的最短路径。 

## 方法

 思考这个问题的一个直接方法是计算最短路径$1$使用 Dijkstra 算法，然后独立尝试所有可能的传送用途。 对于固定对$(a, v)$，我们可以考虑一条来自$1$到$a$, 支付$c_a$，并结束于$v$。 这建议检查所有中间选择$a$对于每一个$v$，这导致$O(n^2)$最短路径计算之上的组合。 即使忽略图的边缘，这也会变得太大。 

关键的简化是分离传送的结构。 一旦我们到达某个节点$a$，传送不再取决于目的地。 它总是允许我们直接跳转到最终节点。 这意味着整个“传送阶段”会分解为一个全局候选值：$$\min_a (\text{dist}[a] + c_a)$$在哪里$\text{dist}[a]$是最短距离$1$到$a$在原始图表中。 

该值表示仅使用一次传送即可到达任何节点的最便宜的方式。 由于传送将我们直接带到目的地，因此该候选者统一适用于所有节点。 

因此，问题简化为计算来自节点的单源最短路径$1$，然后计算所有节点的全局最小值，最后将该值与每个节点进行比较$\text{dist}[v]$。 

暴力破解会失败，因为它试图单独推理传送目的地。 正确的观察是，传送选择仅取决于激活节点，而不取决于目标，因此其效果可以概括为一个标量。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 重新计算或尝试所有传送对 |$O(n^2)$或者更糟|$O(n)$| 太慢了|
 | Dijkstra + 全局最小合并 |$O((n+m)\log n)$|$O(n+m)$| 已接受 |

 ## 算法演练

 我们分两个独立的阶段构建解决方案。 

1.从节点运行Dijkstra$1$在原始图上并计算$\text{dist}[v]$对于所有顶点。 这在不使用传送的情况下提供了最佳成本。 这是有效的原因是所有原始隧道都是标准加权边缘，因此 Dijkstra 在任何特殊操作之前完全捕获最佳运动。 
2. 在 Dijkstra 期间或之后处理节点时，计算值$\text{dist}[a] + c_a$对于每个节点$a$。 在所有节点上保持该表达式的最小值。 这代表了最佳的“传送激活成本”。 
3. 对于每个节点$v$，计算最终答案为：$$\min(\text{dist}[v], \text{bestTeleport})$$因为要么我们从不使用传送，要么我们使用它一次，它立即完成旅程$v$。 
4. 输出所有节点的这些值。 

重要的结构点是，teleport 不会创建新的分层图遍历。 它只引入了一个全局快捷方式选项。 

### 为什么它有效

 任何有效路径$1$到$v$使用传送必须首先遵循正常边缘$1$到某个节点$a$，然后应用传送，然后停止。 这条路径的成本正好是$\text{dist}[a] + c_a$。 因为我们已经计算了到达每个区域的最短路径$a$，用更糟糕的东西替换前缀并不能改善结果。 因此，每条基于传送的路径都由以下值之一表示$\text{dist}[a] + c_a$，并取所有最小值$a$捕捉所有的可能性。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

INF = 10**30

def dijkstra(n, adj):
    dist = [INF] * (n + 1)
    dist[1] = 0
    pq = [(0, 1)]

    while pq:
        d, u = heapq.heappop(pq)
        if d != dist[u]:
            continue
        for v, w in adj[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist

t = int(input())
for _ in range(t):
    n, m = map(int, input().split())
    c = [0] + list(map(int, input().split()))

    adj = [[] for _ in range(n + 1)]
    for _ in range(m):
        u, v, w = map(int, input().split())
        adj[u].append((v, w))
        adj[v].append((u, w))

    dist = dijkstra(n, adj)

    best_teleport = INF
    for i in range(1, n + 1):
        if dist[i] < INF:
            best_teleport = min(best_teleport, dist[i] + c[i])

    res = []
    for v in range(1, n + 1):
        if v == 1:
            res.append("0")
        else:
            ans = min(dist[v], best_teleport)
            res.append(str(ans))

    print(" ".join(res))
```代码首先构建图并计算从节点开始的最短路径$1$。 基于堆的 Dijkstra 确保正确处理高达$10^9$。 

第二遍通过扫描所有节点一次来计算最佳传送锚点。 一个常见的错误是尝试在 Dijkstra 松弛期间应用传送； 这是不必要的，因为传送不依赖于目的地状态。 

最后，每个答案都是直接最短路径和全局传送捷径之间的简单比较。 

## 工作示例

 ### 示例 1

 考虑一个小图，其中节点$1$连接到节点$2$，和节点$2$分支出来。 

我们计算最短路径：

 | 节点| 距离 |
 | --- | --- |
 | 1 | 0 |
 | 2 | 1 |
 | 3 | 3 |
 | 4 | 6 |

 现在计算传送候选者$dist[a] + c[a]$:

 | 一个 | 距离[a] | c[a] | 总和|
 | --- | --- | --- | --- |
 | 1 | 0 | 100 | 100 100 | 100
 | 2 | 1 | 4 | 5 |
 | 3 | 3 | 3 | 6 |
 | 4 | 6 | 2 | 8 |

 所以最好的传送是$5$。 

最终答案：

 | 节点| 直达 | 传送 | 结果 |
 | --- | --- | --- | --- |
 | 1 | 0 | 5 | 0 |
 | 2 | 1 | 5 | 1 |
 | 3 | 3 | 5 | 3 |
 | 4 | 6 | 5 | 5 |

 这表明传送仅对于正常路径比全局快捷方式更差的节点才重要。 

### 示例 2

 断开连接的图：

 节点$1$除了没有边之外是孤立的，但存在传送值。 

| 节点| 距离 |
 | --- | --- |
 | 1 | 0 |
 | 2 | 信息 |
 | 3 | 信息 |

 传送值：

 | 一个 | 距离[a] + c[a] |
 | --- | --- |
 | 1 | 10 | 10
 | 2 | 信息 |
 | 3 | 信息 |

 所以最好的传送是$10$。 每个节点都可以通过成本到达$10$，即使图表已断开连接。 

这证实了传送作为全球连接的助推器。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O((n+m)\log n)$| 迪杰斯特拉占主导地位； 每个边通过堆操作松弛一次 |
 | 空间|$O(n+m)$| 邻接表加上距离和堆存储|

 限制最多允许$2 \cdot 10^5$总边缘，因此每个测试套件单个 Dijkstra 可以在时间限制内轻松适应。 

## 测试用例```python
import sys, io
import heapq

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    INF = 10**30

    def dijkstra(n, adj):
        dist = [INF] * (n + 1)
        dist[1] = 0
        pq = [(0, 1)]
        while pq:
            d, u = heapq.heappop(pq)
            if d != dist[u]:
                continue
            for v, w in adj[u]:
                nd = d + w
                if nd < dist[v]:
                    dist[v] = nd
                    heapq.heappush(pq, (nd, v))
        return dist

    t = int(input())
    out_lines = []
    for _ in range(t):
        n, m = map(int, input().split())
        c = [0] + list(map(int, input().split()))
        adj = [[] for _ in range(n + 1)]
        for _ in range(m):
            u, v, w = map(int, input().split())
            adj[u].append((v, w))
            adj[v].append((u, w))

        dist = dijkstra(n, adj)

        best = INF
        for i in range(1, n + 1):
            if dist[i] < INF:
                best = min(best, dist[i] + c[i])

        res = []
        for v in range(1, n + 1):
            if v == 1:
                res.append("0")
            else:
                res.append(str(min(dist[v], best)))
        out_lines.append(" ".join(res))

    return "\n".join(out_lines)

# sample-like test
assert run("""1
3 2
5 1 10
1 2 1
2 3 1
""") == "0 1 2"

# disconnected graph
assert run("""1
3 0
10 100 100
""") == "0 10 10"

# teleport worse than edges
assert run("""1
3 2
100 100 100
1 2 1
2 3 1
""") == "0 1 2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 直线链条|`0 1 2`| 正态 Dijkstra 正确性 |
 | 没有边缘|`0 10 10`| 传送连接 |
 | 大c值|`0 1 2`| 次优时忽略传送 |

 ## 边缘情况

 断开连接的图突出了传送的主要作用：它用有限的全局最小值代替了无法到达的距离。 在这种情况下，Dijkstra 为许多节点生成无穷大，但传送聚合仍然产生可用值，因为它仅取决于可到达的节点$a$。 

当所有$c_a$非常大，算法自然会回退到标准最短路径，因为$\min(\text{dist}[v], \text{bestTeleport})$从不选择传送术语。 

单节点图虽然微不足道，但对于实现的正确性很重要：节点$1$必须始终输出$0$，即使传送计算否则会建议非零值。
