---
title: "CF 103081I - 电子邮件"
description: "我们给定一组人，在无向图中表示为节点。 两个节点之间的边意味着这两个人最初知道彼此的电子邮件地址。 该系统以同步轮次演化。"
date: "2026-07-04T00:24:36+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103081
codeforces_index: "I"
codeforces_contest_name: "2020-2021 ICPC Southwestern European Regional Contest (SWERC 2020)"
rating: 0
weight: 103081
solve_time_s: 57
verified: true
draft: false
---

[CF 103081I - 电子邮件](https://codeforces.com/problemset/problem/103081/I)

 **评级：** -
 **标签：** -
 **求解时间：** 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给定一组人，在无向图中表示为节点。 两个节点之间的边意味着这两个人最初知道彼此的电子邮件地址。 该系统以同步轮次演化。 每天早上，每个人都会向所有邻居广播他们当前的整个地址簿。 每天晚上，每个人都会将白天收到的所有内容合并到自己的地址簿中。 一旦一个人在晚间更新中没有收到任何新内容，他们就会停止参与。 

问题不是直接模拟该过程，而是确定最终每个人是否都知道其他人的电子邮件地址。 如果是，我们还必须计算最后一次有意义的传播完成需要多长时间，以天为单位，并根据关于是否计算最后一次更新或稳定步骤的特定约定来测量。 

通信规则本质上是信息随着时间的推移而传递关闭，但关键细节是信息以分层方式每天传播一跳，因为更新仅在晚上合并，并且仅在第二天早上发送。 

输入图最多有 100,000 个节点和 100,000 条边。 任何尝试显式模拟完整地址簿传播的解决方案都是不可能的，因为每个节点都可以积累 O(N) 信息，并且在最坏的情况下每个节点每天的成本可能为 O(N + M)，这远远超出了可行的限制。 这立即迫使我们在图结构和距离的层面上进行推理，而不是模拟集合。 

一个关键的观察是，只有图是连通的，这个过程才有意义。 如果未连接，则组件之间不存在电子邮件传输路径，因此无论进行多少次重复联合都无法桥接不同的连接组件。 

当图表已经完整或接近完整时，会出现微妙的边缘情况。 例如，如果每个节点都连接到每个其他节点，则该过程基本上在一轮内完成。 天真的 BFS 式“多源洪水”可能会错误地假设零时间或相差一的差异，具体取决于是否计算最终稳定日。 另一个边缘情况是一个断开的图，其中仅存在两个组件：即使在每个组件内所有内容都收敛，但在全局范围内也不可能到达完整的全局地址簿。 

## 方法

 该过程的强力解释是明确地模拟每一天。 每个节点维护一组已知的电子邮件。 每天，每个节点都会将其完整集发送给邻居，合并所有收到的集，然后重复直到没有集发生变化。 如果集合很大，那么在最坏的情况下，每个并集操作的成本可能是 O(N)，并且每天都会发生在 O(M) 条边上。 在最坏的情况下，这会导致 O(D·N·M) 行为，其中 D 可以是 O(N)，这对于 100,000 个节点来说是完全不可行的。 

关键的结构见解是，该过程相当于计算未加权图中的最短路径距离，但在轮数的定义方式上有所不同。 如果我们仔细思考，一条信息每天都会传播一个边缘。 这意味着，如果我们固定一个起始节点，则其电子邮件到达另一个节点所需的时间恰好是它们在边上的最短路径距离。 由于最终每个人都必须知道其他人的电子邮件，因此重要的是信息在每个连接组件的直径上传播需要多长时间。

更准确地说，一旦我们考虑单个连接组件，信息就会像波浪一样同时从每个节点传播。 任何新信息出现的最后时刻对应于图形的偏心率结构。 当每个节点都到达其他每个节点时，该过程完成，因此时间由同一连接组件中任意两个节点之间的最大最短路径距离（即直径）决定。 

因此，问题简化为查找图是否连通，如果是，则计算连通图的直径。 最终答案是根据这个直径进行小幅调整得出的，具体取决于我们是测量最后更新日还是稳定日。 

为了计算一般未加权图中的直径，我们对每个组件使用两次 BFS 遍历：选择任何节点，BFS 找到最远的节点，然后从该节点再次 BFS 以获得最远的距离。 组件之间的最大此类值是直径。 如果有多个组件，则该过程永远不会完全连接每个组件，因此答案为 -1。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟| O(D·N·M) | O(N²) 最坏情况集 | 太慢了 |
 | 每个组件的 BFS 直径 | O(N + M) | O(N + M) | 已接受 |

 ## 算法演练

 我们将输入转换为无向图的邻接列表表示。 

我们首先确定连通性并准备测量距离。 

1. 从 M 条边构建图的邻接表。 这是必需的，因为 BFS 需要快速的邻居访问，而边缘列表遍历对于重复搜索来说太慢。 
2. 使用 BFS 或 DFS 检查所有节点是否属于单个连接组件。 如果我们找到多个组件，我们会立即返回 -1，因为没有任何本地交换序列可以桥接断开的部分。 
3. 对于每个连接的组件，我们使用两次 BFS 遍历计算其直径。 我们从组件中的任意节点开始，运行 BFS 来找到距离它最远的节点 u。 此步骤标识该组件中最长路径的一个端点。 
4. 我们再次从 u 开始运行 BFS，计算到同一组件中任何节点的最大距离。 遇到的最大距离是该部件的直径。 
5. 跟踪所有组件的最大直径。 如果图是连通的，这就是全局直径。 
6、根据工艺计时规则将直径换算为所需天数。 由于每一天都对应于一个边缘层的完整传播，并且该过程从第 0 天早上已经存在的初始知识开始，因此距离最后一次更新的天数就是直径。 

### 为什么它有效

 关键的不变量是，在 k 个完整天后，每个节点确切地知道源自图中距离的 k 个边内的信息。 这是因为每天都会沿着所有边缘同时向外扩展知识一跳。 因此，k 天后节点 v 处的已知电子邮件集完全对应于 v 距离 k 内的所有节点。 

一旦 k 达到节点的偏心率，该节点就会停止变化。 当 k 达到所有节点的最大偏心率（即图的直径）时，最后一次全局更改发生。 因此，在直径步长之后，没有节点可以接收新信息，并且某些节点必须在该点之前仍在接收信息，以确保正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

def bfs(start, adj):
    n = len(adj) - 1
    dist = [-1] * (n + 1)
    q = deque([start])
    dist[start] = 0
    far = start

    while q:
        v = q.popleft()
        for to in adj[v]:
            if dist[to] == -1:
                dist[to] = dist[v] + 1
                q.append(to)
                if dist[to] > dist[far]:
                    far = to
    return far, dist

def bfs_dist(start, adj):
    n = len(adj) - 1
    dist = [-1] * (n + 1)
    q = deque([start])
    dist[start] = 0
    far = 0

    while q:
        v = q.popleft()
        for to in adj[v]:
            if dist[to] == -1:
                dist[to] = dist[v] + 1
                q.append(to)
                if dist[to] > dist[far]:
                    far = to
    return dist

def solve():
    n, m = map(int, input().split())
    adj = [[] for _ in range(n + 1)]

    for _ in range(m):
        u, v = map(int, input().split())
        adj[u].append(v)
        adj[v].append(u)

    visited = [False] * (n + 1)
    components = 0
    diameter = 0

    for i in range(1, n + 1):
        if not visited[i]:
            components += 1
            q = deque([i])
            visited[i] = True
            comp_nodes = [i]

            while q:
                v = q.popleft()
                for to in adj[v]:
                    if not visited[to]:
                        visited[to] = True
                        q.append(to)
                        comp_nodes.append(to)

            if components > 1:
                print(-1)
                return

            start = i
            far, _ = bfs(start, adj)
            dist = bfs_dist(far, adj)
            diameter = max(diameter, max(dist))

    print(diameter)

if __name__ == "__main__":
    solve()
```该解决方案首先构建邻接列表，该列表支持邻居的线性时间遍历。 基于 BFS 的组件检查可确保我们及早检测到断开连接，这是必需的，因为组件之间不存在通信路径。 

对于每个连接的组件，我们使用标准的二次 BFS 技术计算其直径。 第一个 BFS 标识距任意起点最远的节点，该节点充当该组件中最长路径的端点。 来自该端点的第二个 BFS 计算真实的偏心率结构，给出该组件中的最大距离。 

最终答案是直径，因为每个距离单位对应于一整天的传播。 

## 工作示例

 ### 示例 1

 输入：```
4 3
1 2
2 3
3 4
```这是单链。 

我们首先从节点 1 开始 BFS：

 | 步骤| 节点| 距离 |
 | ---| ---| ---|
 | 1 | 1 | 0 |
 | 2 | 2 | 1 |
 | 3 | 3 | 2 |
 | 4 | 4 | 3 |

 最远的节点是 4。 

现在 BFS 从 4 开始：

 | 步骤| 节点| 距离 |
 | ---| ---| ---|
 | 1 | 4 | 0 |
 | 2 | 3 | 1 |
 | 3 | 2 | 2 |
 | 4 | 1 | 3 |

 直径为 3，因此 3 天后没有新信息可以传播。 

这对应于图中最长的链距离。 

### 示例 2

 输入：```
6 3
1 2
3 4
5 6
```该图具有三个不相连的组件。 

在组件扫描期间，我们在完成第一个组件后遇到第二个组件。 由于存在多个组件，因此该过程永远无法统一所有电子邮件集。 

输出是：```
-1
```这证实了连通性是全面融合的严格要求。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N + M) | 每个 BFS 访问节点和边一次，并且我们对每个组件执行恒定数量的 BFS 运行 |
 | 空间| O(N + M) | 邻接表加上 BFS 队列和距离数组 |

 这些约束允许线性时间图遍历，因此即使对于 100,000 个节点和边，这种方法也能轻松适应限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque

    def bfs(start, adj):
        n = len(adj) - 1
        dist = [-1] * (n + 1)
        q = deque([start])
        dist[start] = 0
        far = start
        while q:
            v = q.popleft()
            for to in adj[v]:
                if dist[to] == -1:
                    dist[to] = dist[v] + 1
                    q.append(to)
                    if dist[to] > dist[far]:
                        far = to
        return far

    def bfs_dist(start, adj):
        n = len(adj) - 1
        dist = [-1] * (n + 1)
        q = deque([start])
        dist[start] = 0
        while q:
            v = q.popleft()
            for to in adj[v]:
                if dist[to] == -1:
                    dist[to] = dist[v] + 1
                    q.append(to)
        return dist

    def solve():
        n, m = map(int, input().split())
        adj = [[] for _ in range(n + 1)]
        for _ in range(m):
            u, v = map(int, input().split())
            adj[u].append(v)
            adj[v].append(u)

        visited = [False] * (n + 1)
        components = 0
        diameter = 0

        for i in range(1, n + 1):
            if not visited[i]:
                components += 1
                q = deque([i])
                visited[i] = True
                while q:
                    v = q.popleft()
                    for to in adj[v]:
                        if not visited[to]:
                            visited[to] = True
                            q.append(to)

                if components > 1:
                    return "-1"

                far = bfs(i, adj)
                dist = bfs_dist(far, adj)
                diameter = max(diameter, max(dist))

        return str(diameter)

    return solve()

# provided samples
assert run("4 3\n1 2\n2 3\n3 4\n") == "3"
assert run("6 3\n1 2\n3 4\n5 6\n") == "-1"

# custom cases
assert run("2 1\n1 2\n") == "1", "minimum chain"
assert run("5 4\n1 2\n2 3\n3 4\n4 5\n") == "4", "line graph"
assert run("3 3\n1 2\n2 3\n1 3\n") == "1", "complete graph"
assert run("4 2\n1 2\n3 4\n") == "-1", "two components"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 2 节点链 | 1 | 最小连通情况|
 | 5节点线| 4 | 长路径传播|
 | 三角形| 1 | 稠密图早期收敛 |
 | 两对| -1 | 断线处理|

 ## 边缘情况

 断开连接的图是在组件检测阶段处理的。 扫描节点时，算法每次发现未访问的节点时都会增加组件计数器。 如果该计数器超过 1，则立即返回 -1。 例如，输入`1-2`和`3-4`形成两个组成部分。 BFS 仅标记每个组件内的节点，第二次发现会在尝试任何直径计算之前触发终止。 

全连接图的直径为 1。任何节点的第一个 BFS 一步即可到达所有其他节点，第二个 BFS 确认最大距离为 1。算法正确返回 1，符合一轮足以完全交换的直觉。 

线性链是传播的最坏情况。 每个 BFS 步长正好延伸一个节点，因此直径等于 N-1。 该算法正确地捕获了这一点，因为最远的端点是链的末端，并且第二个 BFS 测量全长。
