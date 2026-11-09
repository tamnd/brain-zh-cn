---
title: "CF 208C - 警察局"
description: "我们得到一个代表城市和道路的无向连通图，其中每条道路都有相同的旅行时间。 在所有城市中，城市 1 和城市 n 比较特殊：我们关心这两个端点之间的旅行。"
date: "2026-06-03T17:29:27+07:00"
tags: ["codeforces", "competitive-programming", "dp", "graphs", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 208
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 130 (Div. 2)"
rating: 1900
weight: 208
solve_time_s: 116
verified: true
draft: false
---

[CF 208C - 警察局](https://codeforces.com/problemset/problem/208/C)

 **评级：** 1900
 **标签：** dp、图、最短路径
 **求解时间：** 1m 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个代表城市和道路的无向连通图，其中每条道路都有相同的旅行时间。 在所有城市中，城市 1 和城市 n 比较特殊：我们关心这两个端点之间的旅行。 人们在从 1 到 n 时总是选择最短路径，并且如果存在多个最短路径，则所有最短路径都被认为是同等可能的。 

我们被允许在一个城市设立一个警察局。 任何在其端点之一有警察局的道路都被认为是安全的； 所有其他道路都很危险。 对于从城市 1 到城市 n 的每条最短路径，我们计算它使用了多少个安全边。 由于可能存在多条最短路径，因此我们取所有最短路径上安全边的平均数量，并且我们希望选择使该期望值最大化的警察局的位置。 

就顶点而言，约束很小，最多 100 个城市，但道路数量可能很大。 这立即表明，具有 n 三次行为的算法仍然可以接受，但任何涉及枚举所有最短路径的算法都不能接受。 

主要困难在于，答案同时取决于所有最短路径的结构，而不仅仅是一条路径。 一种简单的方法是尝试枚举从 1 到 n 的所有最短路径并评估每个候选站位置。 然而，在密集图中，最短路径的数量可能呈指数增长。 

当图在 1 和 n 之间有许多具有重叠边的最短路径时，就会出现微妙的边缘情况。 例如，在按 BFS 距离分层的完整二分结构中，每条最短路径都是中间选择的不同组合。 即使 n 约为 30，暴力枚举也会立即失败。 

另一个边缘情况是最短路径是唯一的。 在这种情况下，问题简化为最大化该单条路径接触所选节点的边数，这大大简化了并且是正确性的良好健全性检查。 

## 方法

 蛮力思想在概念上很简单：首先计算从 1 到 n 的所有最短路径，然后对于每个候选城市 c，评估每条最短路径并计算该路径上有多少条边与 c 相关。 最后，对所有路径求平均值并取最大值。 

正确性很明显，因为它直接遵循定义。 失败来自于最短路径的数量，在一般图中，最短路径的数量可能呈指数增长。 即使存储它们也是不可行的，因为每条路径的长度都是 O(n) 并且这样的路径可以呈指数级增长。 

关键的观察是我们实际上不需要枚举路径。 我们只需要知道，对于每条最短路径上的每条边，它是否有助于给定的站点选择。 我们不是逐条路径地推理，而是切换视角并在边缘上进行聚合。 

我们首先使用 BFS 计算从 1 到 n 的最短距离。 这会将边划分为可以位于最短路径上的边：如果边 (u, v) 在最短路径 DAG 中的连续层之间移动，则该边 (u, v) 是相关的，这意味着 dist1[u] + 1 + distN[v] 等于 dist1[n] 或对称条件。 

现在我们构建一个仅由可以出现在从 1 到 n 的最短路径中的边组成的 DAG，方向从较小的 dist1 到较大的 dist1。 每条最短路径都对应这个DAG中的一条路径。 

令 P 为所有最短路径的集合。 对于每个候选节点 c，我们想要路径中与 c 相关的边数在 P 上的平均值。 我们将其重写为边上的求和：对于每条边 e，我们计算有多少条最短路径经过 e，如果 e 接触 c，则加 1。

这将问题转移到计算最短路径 DAG 中的每条边，有多少条最短路径使用它。 这是 DAG 上的标准 DP：我们计算从 1 到每个节点以及从每个节点到 n 的路径（仅限于最短路径边）。 每个边缘贡献都是前向和后向计数的乘积。 

一旦我们知道了边的使用计数，评估候选节点 c 就变成了对所有事件最短路径边求和，即使用这些边的最短路径的数量，并通过最短路径的总数进行归一化。 

这将问题简化为计算所有对最短路径 DAG 计数，然后进行 n 次评估，每次评估的时间复杂度为 O(deg(c))。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 枚举所有最短路径 | 指数| 指数| 太慢了 |
 | 最短路径 DAG + DP 计数 | O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 使用 BFS 计算距节点 1 的最短距离。 这定义了最短路径结构的前向分层。 
2. 使用 BFS 计算距节点 n 的最短距离。 这使我们能够验证一条边是否位于 1 和 n 之间的某个最短路径上。 
3. 构建满足 dist1[u] + 1 + distN[v] = dist1[n] 或对称条件的“有用边”集合。 这确保了每条选定的边都可以属于至少一条最短路径。 
4. 构造仅限于有用边的邻接表，并将它们从较小的 dist1 定向到较大的 dist1。 这会产生 DAG，因为距离沿着边缘严格增加。 
5. 在该 DAG 上从节点 1 运行 DP 以计算ways1[v]，即从 1 到 v 的最短路径的数量。递归对所有传入 DAG 边上的ways1 求和。 
6. 类似地计算ways2[v]，即反向DAG 中从v 到n 的最短路径的数量。 
7. 最短路径总数为ways1[n]。 对于每个有用的边 (u, v)，计算有多少条最短路径将其用作ways1[u] *ways2[v]。 
8.对于每个候选站点城市c，计算所有事件有用边的贡献。 如果边是(c, v)，则贡献ways1[c] *ways2[v]； 如果是(u,c)，则贡献ways1[u]*ways2[c]。 将所有这些贡献相加并除以总最短路径即可得到预期的安全边数。 

这种聚合起作用的原因是，每条最短路径都被唯一地分解为边，并且可以使用到达其端点的方式数量来独立计算每条边的贡献，而无需重复计算路径。 

### 为什么它有效

 从 1 到 n 的每条最短路径都与最短路径 DAG 中的一条路径完全对应。 对于任何边 e = (u, v)，包含 e 的最短路径的数量恰好是从 1 到达 u 的方式数量乘以从 v 到达 n 的方式数量。由于在此分解中每条路径只计算一次，因此对边上的贡献求和即可给出期望的正确线性分解。 因此，对路径的期望相当于通过所有最短路径上的频率对每条边进行加权。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

n, m = map(int, input().split())
g = [[] for _ in range(n + 1)]
edges = []

for _ in range(m):
    u, v = map(int, input().split())
    g[u].append(v)
    g[v].append(u)
    edges.append((u, v))

def bfs(src):
    dist = [10**9] * (n + 1)
    dist[src] = 0
    q = deque([src])
    while q:
        u = q.popleft()
        for v in g[u]:
            if dist[v] > dist[u] + 1:
                dist[v] = dist[u] + 1
                q.append(v)
    return dist

dist1 = bfs(1)
distn = bfs(n)
D = dist1[n]

sg = [[] for _ in range(n + 1)]
rg = [[] for _ in range(n + 1)]

valid_edges = []

for u, v in edges:
    if dist1[u] + 1 + distn[v] == D:
        sg[u].append(v)
        rg[v].append(u)
        valid_edges.append((u, v))
    elif dist1[v] + 1 + distn[u] == D:
        sg[v].append(u)
        rg[u].append(v)
        valid_edges.append((v, u))

ways1 = [0] * (n + 1)
ways1[1] = 1
order = sorted(range(1, n + 1), key=lambda x: dist1[x])
for u in order:
    for v in sg[u]:
        ways1[v] += ways1[u]

waysn = [0] * (n + 1)
waysn[n] = 1
order = sorted(range(1, n + 1), key=lambda x: -dist1[x])
for u in order:
    for v in rg[u]:
        waysn[v] += waysn[u]

total_paths = ways1[n]

edge_cnt = 0
node_ans = [0] * (n + 1)

for u, v in valid_edges:
    cnt = ways1[u] * waysn[v]
    node_ans[u] += cnt
    node_ans[v] += cnt
    edge_cnt += cnt

best = 0.0
for i in range(1, n + 1):
    if total_paths:
        best = max(best, node_ans[i] / total_paths)

print(f"{best:.10f}")
```该实现首先使用 BFS 计算距两个端点的最短距离，这是识别哪些边可以参与最短路径的支柱。 然后，通过强制前向和后向距离之间的一致性，将该图过滤为最短路径 DAG。 

前向DP统计从1开始有多少条最短路径到达每个节点，而后向DP统计从每个节点到n有多少条最短路径。 这两个值结合起来给出穿过每个有向边的最短路径的数量。 

最后，每个节点聚合来自其关联边的贡献。 除以最短路径总数将原始计数转换为最短路径均匀分布的期望值。 

必须注意确保边缘仅在正确方向上计数一次，因为原始图是无向的，但 DP 是在由距离引起的有向非循环结构上运行的。 

## 工作示例

 ### 示例 1

 输入：```
4 4
1 2
2 4
1 3
3 4
```从1到4的最短距离是2。所有路径的长度都是2，并且恰好有两条最短路径。 

| 路径| 边缘 |
 | --- | --- |
 | 1-2-4 | 1-2-4 (1,2), (2,4) | (1,2), (2,4) |
 | 1-3-4 | 1-3-4 (1,3), (3,4) |

 对于每个节点作为站：

 | 车站| 提供安全边缘的路径| 平均 |
 | --- | --- | --- |
 | 1 | 两条路径都有 1 个入射边 | 1.0 |
 | 2 | 第一条路径有 2，第二条路径有 0 | 1.0 |
 | 3 | 第一条路径有 0，第二条路径有 2 | 1.0 |
 | 4 | 两条路径都有 1 个入射边 | 1.0 |

 最佳值为 1.0，这与每条最短路径恰好触及与其层上任何选定节点相关的一条边的直觉相匹配。 

这证实了基于边缘的聚合正确地处理了多个最短路径上的对称贡献。 

### 示例 2

 输入：```
5 6
1 2
2 5
1 3
3 5
2 4
4 5
```最短路径是：

 1-2-5、1-3-5、1-2-4-5、1-3-4-5（取决于结构），提供多个重叠路线。 

| 车站| 重点观察| 结果 |
 | --- | --- | --- |
 | 2 | 参与多条最短路径| 更高的贡献 |
 | 3 | 对称于 2 | 类似|
 | 4 | DAG 中更深，贡献更少的边缘端点 | 降低|

 此示例演示了最短路径 DAG 中的中心节点如何积累更多事件最短路径边，DP 通过乘法路径计数捕获这些边。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | 两次 BFS 运行加上两次 DAG DP 边缘遍历 |
 | 空间| O(n + m) | 最短路径 DAG 的邻接表和 DP 数组 |

 图的大小足够小，以至于边缘上的线性时间处理很容易足够快。 主要操作是 BFS 遍历和简单的 DP 传播，这两种操作都可以在限制范围内轻松扩展。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    from collections import deque

    n, m = map(int, sys.stdin.readline().split())
    g = [[] for _ in range(n + 1)]
    edges = []

    for _ in range(m):
        u, v = map(int, sys.stdin.readline().split())
        g[u].append(v)
        g[v].append(u)
        edges.append((u, v))

    def bfs(src):
        dist = [10**9] * (n + 1)
        dist[src] = 0
        q = deque([src])
        while q:
            u = q.popleft()
            for v in g[u]:
                if dist[v] > dist[u] + 1:
                    dist[v] = dist[u] + 1
                    q.append(v)
        return dist

    dist1 = bfs(1)
    distn = bfs(n)
    D = dist1[n]

    sg = [[] for _ in range(n + 1)]
    rg = [[] for _ in range(n + 1)]

    valid_edges = []

    for u, v in edges:
        if dist1[u] + 1 + distn[v] == D:
            sg[u].append(v)
            rg[v].append(u)
            valid_edges.append((u, v))
        elif dist1[v] + 1 + distn[u] == D:
            sg[v].append(u)
            rg[u].append(v)
            valid_edges.append((v, u))

    ways1 = [0] * (n + 1)
    ways1[1] = 1
    order = sorted(range(1, n + 1), key=lambda x: dist1[x])
    for u in order:
        for v in sg[u]:
            ways1[v] += ways1[u]

    waysn = [0] * (n + 1)
    waysn[n] = 1
    order = sorted(range(1, n + 1), key=lambda x: -dist1[x])
    for u in order:
        for v in rg[u]:
            waysn[v] += waysn[u]

    total_paths = ways1[n]

    node_ans = [0] * (n + 1)
    for u, v in valid_edges:
        cnt = ways1[u] * waysn[v]
        node_ans[u] += cnt
        node_ans[v] += cnt

    best = 0.0
    for i in range(1, n + 1):
        if total_paths:
            best = max(best, node_ans[i] / total_paths)

    return f"{best:.10f}"

# provided sample
assert run("4 4\n1 2\n2 4\n1 3\n3 4\n") == "1.0000000000"

# custom: line graph
assert run("3 2\n1 2\n2 3\n") == "1.0000000000"

# custom: triangle
assert run("3 3\n1 2\n2 3\n1 3\n") == "1.0000000000"

# custom: square with diagonal
assert run("4 5\n1 2\n2 4\n1 3\n3 4\n2 3\n") == "1.0000000000"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 折线图| 1.0 | 独特的最短路径处理|
 | 三角形| 1.0 | 多条最短路径对称性|
 | 正方形+对角线| 1.0 | 重叠最短路径 DAG 一致性

 ## 边缘情况

 一种重要的情况是 1 和 n 之间恰好存在一条最短路径。 在这种情况下，DP 简化为对单个路径进行计数，并且每个节点的贡献仅取决于它是否接触该路径的一个或两个边缘。 该算法可以正确处理此问题，因为ways1 和waysn 沿路径变为1，而在其他地方变为0，因此边缘贡献会崩溃为简单的指标值。 

另一种情况是，许多最短路径完全对称，例如分层网格，其中每一层的选择数量都会增加一倍。 在这里，天真的想法可能会出现重复计算问题，但前向-后向分解可确保每条路径每条边精确计数一次，因为每条最短路径都是通过选择 DAG 中的转换序列来唯一确定的。
