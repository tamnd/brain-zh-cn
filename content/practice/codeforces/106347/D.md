---
title: "CF 106347D - \u041c\u043e\u0434\u0443\u043b\u044c\u043d\u044b\u0439\u0433\u0440\u0430\u0444"
description: "我们有一个连通的无向图。 每个顶点都存储一个数字，穿过一条边会消耗其两个端点写入的数字之间的绝对差。"
date: "2026-06-25T08:05:25+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106347
codeforces_index: "D"
codeforces_contest_name: "\u0412\u044b\u0441\u0448\u0430\u044f \u043f\u0440\u043e\u0431\u0430 - 2024. \u0417\u0430\u043a\u043b\u044e\u0447\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0439 \u044d\u0442\u0430\u043f"
rating: 0
weight: 106347
solve_time_s: 53
verified: true
draft: false
---

[CF 106347D - \u041c\u043e\u0434\u0443\u043b\u044c\u043d\u044b\u0439\u0433\u0440\u0430\u0444](https://codeforces.com/problemset/problem/106347/D)

 **评级：** -
 **标签：** -
 **求解时间：** 53s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个连通的无向图。 每个顶点都存储一个数字，穿过一条边会消耗其两个端点写入的数字之间的绝对差。 从顶点步行之前`1`到顶点`n`，我们最多可以替换其中的数字`k`具有我们选择的任何值的顶点。 任务是在做出最佳替代方案后找到尽可能最小的旅行成本。 

输入给出了图、每个顶点的初始值以及可以更改值的最大顶点数。 输出是这些更改之后从第一个顶点到最后一个顶点的路径的最小可能成本。 

主要困难来自于改变的顶点可以取任何值。 我们不需要直接决定实际的新数字。 我们需要了解从路径中删除少量顶点会产生什么影响。 

就图形大小而言，限制很小，但值却不小。 最多有 2000 个顶点和 2000 个边，而`k`最多为 10。依赖于数值的解决方案是不可能的，因为值可以达到`10^9`。 采用二次图处理的解决方案是可以接受的，但任何涉及所有可能路径的解决方案都是不可接受的。 

的小值`k`是关键限制。 我们可以负担得起将图大小乘以一个小因子的算法，例如`O(n * k)`状态或探索周围的深度路径`k`。 我们无法枚举所有路径，因为即使是稀疏图也可以包含指数级数量的路径。 

有几种边缘情况很容易破坏实现。 

如果`k = 0`，没有顶点可以被修改，所以答案一定是带有边权重的普通最短路径`|a_u-a_v|`。 例如：```
2 1 0
5 20
1 2
```唯一的路是有代价的`15`，所以答案是：```
15
```始终假设至少一项自由修改的解决方案可能会错误地输出零。 

开始或结束顶点可能位于已更改的顶点之中。 考虑：```
2 1 2
100 200
1 2
```两个顶点都可以更改为相同的值，所以答案是：```
0
```只允许更改路径内部顶点的解决方案错过了这种情况。 

一个路径可以包含多个`k`顶点，但仍然受益于中间的变化。 例如：```
4 3 1
1 100 5 10
1 2
2 3
3 4
```改变顶点`2`到`5`给出路径成本`9`。 更改的顶点不需要分配其邻居的原始值之一，并且算法必须允许任意替换。 

## 方法

 直接的方法是尝试每条可能的路径并决定应更改其上的哪些顶点。 这是正确的，因为一旦路径被修复，唯一剩下的选择就是最多的新值`k`顶点。 然而，即使只有 2000 个顶点的图也可能有大量不同的路径，因此这种方法具有指数行为并且不可用。 

看待问题的更好方法是忘记分配给已更改顶点的确切值。 假设一条路径包含我们修改的一些顶点。 如果我们从路径中删除那些修改过的顶点，则其余未更改的顶点将按其原始顺序显示。 在两个连续的未改变的顶点之间，所有被移除的顶点都可以被分配位于两个原始值之间的值，因此整个线段的成本恰好是两个未改变的端点的绝对差。 

例如，路径```
A - X - Y - B
```在哪里`X`和`Y`改变，成本最低：```
|a[A] - a[B]|
```因为`X`和`Y`可以在两个端点值之间选择。 

这将问题转化为我们在未更改的顶点之间移动并为每个跳过的顶点花费一个单位的修改预算的问题。 自从`k`只有10，我们只需要知道最多跳过的路径`k`顶点。 

我们在可能未更改的顶点之间创建过渡。 过渡自`u`到`v`如果存在来自的图形路径，则存在`u`到`v`其内部顶点正是修改后的顶点。 如果路径有`d`边缘，它消耗`d-1`修改和成本`|a_u-a_v|`。 

开始和结束需要特殊处理，因为它们本身可以修改。 我们添加两个虚拟顶点。 虚拟起点表示第一个未改变的顶点之前的路径的前缀已经改变的情况。 虚拟完成表示最后一个未更改的顶点被更改后的后缀。 这些转换的成本为零，并且消耗被跳过的顶点数量。 

创建这个小的扩展图后，剩下的问题是具有附加资源的最短路径问题：已经使用了多少修改。 由于资源最多为 10，因此我们可以在状态上运行 Dijkstra`(vertex, used_changes)`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 路径数量呈指数增长 | O(n) | 太慢了|
 | 最佳| O(n(n+m) + nk^2) | O(n(n+m) + nk^2) | O(nk + n^2) | O(nk + n^2) | 已接受 |

 ## 算法演练

 1. 从每个原始顶点运行广度优先搜索，但在深度之后停止`k + 1`。 

我们只关心最多包含的路径`k`修改内部顶点。 较长的最短路径段永远不能用作未更改顶点之间的过渡。 
2. 对于每对原始顶点`u`和`v`由 BFS 发现`u`，如果距离至少为一条边，则创建过渡。 

如果距离是`d`， 全部`d - 1`内部顶点可以改变。 过渡使用`d - 1`改变并且有成本`|a_u - a_v|`。 
3. 添加虚拟起始顶点。 

从虚拟开始，我们可以到达任何原始顶点`v`通过改变之前的每个顶点`v`在从顶点开始的某条路径上`1`。 如果到顶点的距离`1`到`v`是`d`，这个转变消耗了`d`变化和成本为零。 
4. 添加虚拟终点顶点。 

从原始顶点`u`，我们可以通过更改之后的所有顶点来完成`u`在通往顶点的路径上`n`。 如果距离是`d`，过渡消耗`d`变化和成本为零。 
5. 在状态上运行 Dijkstra`(vertex, number_of_changes_used)`。 

状态存储到达顶点后的最小旅行成本，同时花费恰好那么多的修改。 仅当新的修改数量不超过时才接受转换`k`。 
6. 答案是在所有状态下到虚拟终点的最小距离，最多`k`使用的修改。 

为什么它有效：

 不变的是，每个 Dijkstra 状态都代表在修改之前准确选择哪些顶点之后到达顶点的最佳方式。 每当修改的段被交叉时，唯一重要的信息是两个未更改的端点，因为可以选择所有内部更改值以使段成本成为这些端点的绝对差。 BFS 生成的转换代表可以使用可用修改预算的每个可能的段。 由于 Dijkstra 探索了所有此类转变，并为每笔已用预算保持最便宜的成本，因此它不能放弃更好的有效解决方案。 

## Python 解决方案```python
import sys
import heapq
from collections import deque

input = sys.stdin.readline

def solve():
    n, m, k = map(int, input().split())
    a = list(map(int, input().split()))

    g = [[] for _ in range(n)]
    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        g[u].append(v)
        g[v].append(u)

    INF = 10**30

    jumps = [[] for _ in range(n)]

    for s in range(n):
        dist = [-1] * n
        q = deque([s])
        dist[s] = 0

        while q:
            v = q.popleft()
            if dist[v] == k + 1:
                continue
            for u in g[v]:
                if dist[u] == -1:
                    dist[u] = dist[v] + 1
                    q.append(u)

        for v in range(n):
            if v != s and dist[v] != -1 and dist[v] <= k + 1:
                jumps[s].append((v, dist[v] - 1, abs(a[s] - a[v])))

    start = n
    finish = n + 1
    total = n + 2

    jumps.extend([[], []])

    # From virtual start to first unchanged vertex.
    dist = [-1] * n
    q = deque([0])
    dist[0] = 0
    while q:
        v = q.popleft()
        if dist[v] == k:
            continue
        for u in g[v]:
            if dist[u] == -1:
                dist[u] = dist[v] + 1
                q.append(u)

    for v in range(n):
        if dist[v] != -1 and dist[v] <= k:
            jumps[start].append((v, dist[v], 0))

    # From unchanged vertex to virtual finish.
    dist = [-1] * n
    q = deque([n - 1])
    dist[n - 1] = 0
    while q:
        v = q.popleft()
        if dist[v] == k:
            continue
        for u in g[v]:
            if dist[u] == -1:
                dist[u] = dist[v] + 1
                q.append(u)

    for v in range(n):
        if dist[v] != -1 and dist[v] <= k:
            jumps[v].append((finish, dist[v], 0))

    # The whole path can consist of changed vertices.
    if dist[0] != -1 and dist[0] + 1 <= k:
        jumps[start].append((finish, dist[0] + 1, 0))

    d = [[INF] * (k + 1) for _ in range(total)]
    d[start][0] = 0

    pq = [(0, start, 0)]

    while pq:
        cur, v, used = heapq.heappop(pq)
        if cur != d[v][used]:
            continue

        for u, add_used, cost in jumps[v]:
            nu = used + add_used
            if nu <= k and cur + cost < d[u][nu]:
                d[u][nu] = cur + cost
                heapq.heappush(pq, (d[u][nu], u, nu))

    print(min(d[finish]))

if __name__ == "__main__":
    solve()
```BFS 预处理构造每个有用的压缩路径段。 深度限制为`k + 1`因为未改变的顶点之间的过渡最多可能包含`k`改变了内部顶点。 

扩展图将转换存储为`(destination, extra changes, cost)`。 Dijkstra 阶段不需要知道分配给修改顶点的实际值。 它仅跟踪已花费了多少修改。 

虚拟顶点用于处理端点的更改。 如果没有它们，解决方案将错误地假设顶点`1`和`n`必须保持原来的价值观。 

所有费用大约可以达到`10^9 * n`，所以Python自然而然地使用整数。 该算法永远不会构建密集的`n x n`矩阵，使内存使用保持可控。 

## 工作示例

 对于第一个样本：```
6 7 1
1 15 5 10 4 10
1 2
2 3
3 6
1 4
4 5
5 6
2 5
```一个有用的压缩路径是`1 -> 2 -> 5 -> 6`。 

| 步骤| 当前部分 | 使用的更改 | 成本|
 | --- | --- | --- | --- |
 | 开始| 在顶点 1 | 0 | 0 |
 | 移动到顶点 2 | 保留 1 和 2 作为端点 | 0 | 14 | 14
 | 更改顶点 2 | 将值 15 替换为 3 | 1 | 14 | 14
 | 移动到 5 | 压缩过渡 2 到 5 | 1 | 2 |
 | 6 点结束 | 最终未改变的顶点 | 1 | 9 |

 重要的是，更改的顶点不会与算法中选定的值一起存储。 过渡直接捕获最佳可能结果。 

对于第二个样本：```
6 7 3
1 15 5 10 4 10
1 2
2 3
3 6
1 4
4 5
5 6
2 5
```整个路线可以改变。 

| 步骤| 状态| 使用的更改 | 成本|
 | --- | --- | --- | --- |
 | 开始| 虚拟启动| 0 | 0 |
 | 完成前更改顶点 | 遵循仅包含已更改顶点的路径 | 3 | 0 |
 | 完成 | 虚拟完成| 3 | 0 |

 跟踪确认虚拟开始和结束正确处理所有有用顶点都被修改的情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n(n+m) + nk^2) | O(n(n+m) + nk^2) | 我们从每个顶点运行有界 BFS，然后运行 ​​Dijkstra`O(nk)`州。 |
 | 空间| O(nk + n + m) | 扩展的状态图和 BFS 数据符合限制。 |

 该图只有 2000 个顶点，修改限制为 10。BFS 深度限制阻止预处理成为完整的全对最短路径计算。 

## 测试用例```python
import sys, io, heapq
from collections import deque

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)

    def solve():
        n, m, k = map(int, input().split())
        a = list(map(int, input().split()))
        g = [[] for _ in range(n)]
        for _ in range(m):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            g[u].append(v)
            g[v].append(u)

        INF = 10**30
        jumps = [[] for _ in range(n)]

        for s in range(n):
            dist = [-1] * n
            q = deque([s])
            dist[s] = 0
            while q:
                v = q.popleft()
                if dist[v] == k + 1:
                    continue
                for u in g[v]:
                    if dist[u] == -1:
                        dist[u] = dist[v] + 1
                        q.append(u)
            for v in range(n):
                if v != s and dist[v] != -1 and dist[v] <= k + 1:
                    jumps[s].append((v, dist[v] - 1, abs(a[s] - a[v])))

        start, finish = n, n + 1
        jumps.extend([[], []])

        dist = [-1] * n
        q = deque([0])
        dist[0] = 0
        while q:
            v = q.popleft()
            if dist[v] == k:
                continue
            for u in g[v]:
                if dist[u] == -1:
                    dist[u] = dist[v] + 1
                    q.append(u)
        for v in range(n):
            if dist[v] != -1 and dist[v] <= k:
                jumps[start].append((v, dist[v], 0))

        dist = [-1] * n
        q = deque([n - 1])
        dist[n - 1] = 0
        while q:
            v = q.popleft()
            if dist[v] == k:
                continue
            for u in g[v]:
                if dist[u] == -1:
                    dist[u] = dist[v] + 1
                    q.append(u)
        for v in range(n):
            if dist[v] != -1 and dist[v] <= k:
                jumps[v].append((finish, dist[v], 0))

        if dist[0] != -1 and dist[0] + 1 <= k:
            jumps[start].append((finish, dist[0] + 1, 0))

        d = [[INF] * (k + 1) for _ in range(n + 2)]
        d[start][0] = 0
        pq = [(0, start, 0)]

        while pq:
            cur, v, used = heapq.heappop(pq)
            if cur != d[v][used]:
                continue
            for u, add, cost in jumps[v]:
                if used + add <= k and cur + cost < d[u][used + add]:
                    d[u][used + add] = cur + cost
                    heapq.heappush(pq, (d[u][used + add], u, used + add))

        return str(min(d[finish])) + "\n"

    res = solve()
    sys.stdin = old
    return res

assert run("""6 7 1
1 15 5 10 4 10
1 2
2 3
3 6
1 4
4 5
5 6
2 5
""") == "9\n"

assert run("""6 7 3
1 15 5 10 4 10
1 2
2 3
3 6
1 4
4 5
5 6
2 5
""") == "0\n"

assert run("""2 1 0
5 20
1 2
""") == "15\n"

assert run("""2 1 2
100 200
1 2
""") == "0\n"

assert run("""3 2 1
1 100 10
1 2
2 3
""") == "9\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 | 9 | 经过一处修改的基本压缩过渡 |
 | 样品2 | 0 | 可以修改整个路径|
 | 两个顶点，`k=0`| 15 | 15 不修改边界情况 |
 | 两个顶点，`k=2`| 0 | 改变端点|
 | 三顶点链| 9 | 内部顶点替换 |

 ## 边缘情况

 对于`k = 0`，预处理仅创建具有零个跳过顶点的过渡。 Dijkstra 状态崩溃为普通最短路径状态，因此答案是原始加权最短路径。 

对于起点或终点发生更改的路径，虚拟顶点提供缺失的端点。 例如：```
2 1 2
100 200
1 2
```从虚拟开始直接过渡到虚拟结束需要两次更改，且成本为零。 这表示将两个顶点更改为相同的值。 

对于具有多个连续更改的顶点的路径，BFS 转换会立即删除整个段。 在：```
4 3 2
1 100 200 10
1 2
2 3
3 4
```改变顶点`2`和`3`给端点留下成本：```
|1 - 10| = 9
```该算法从顶点达到相同的压缩过渡`1`到顶点`4`使用两次修改并且永远不需要猜测顶点的新值`2`和`3`。
