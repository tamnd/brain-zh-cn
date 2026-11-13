---
title: "CF 229B - 行星"
description: "我们得到了一个由星门连接的行星的无向加权图。 杰克在时间 0 开始前往行星 1，并希望尽早到达行星 n。 通过星门需要固定的正时间。 不寻常的部分是等待规则。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "graphs", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 229
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 142 (Div. 1)"
rating: 1700
weight: 229
solve_time_s: 97
verified: true
draft: false
---

[CF 229B - 行星](https://codeforces.com/problemset/problem/229/B)

 **评分：** 1700
 **标签：** 二分查找、数据结构、图、最短路径
 **求解时间：** 1m 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一个由星门连接的行星的无向加权图。 杰克在星球上开始`1`在某个时间`0`并想要到达星球`n`尽早。 

通过星门需要固定的正时间。 不寻常的部分是等待规则。 每个星球都有一系列的阻塞时刻。 如果杰克当时站在一个星球上`t`， 和`t`属于该星球的封锁集，他被禁止立即离开。 他必须等到第一次没有被阻止的时候。 

该限制仅在离开行星时适用。 允许在阻塞时刻到达。 该问题要求到达行星的最短时间`n`， 或者`-1`如果不存在路由。 

该图最多有`10^5`顶点和`10^5`边缘，所以任何算法都比粗略地更糟糕`O((n + m) log n)`在 Python 中是有风险的。 标准的全对最短路径算法在这里是不可能的。 甚至`O(nm)`意思是周围`10^10`运营。 

所有行星的阻塞时间总数也受以下限制：`10^5`。 这个细节很重要，因为它意味着我们可以有效地在这些列表中进行预处理或搜索。 

一些边缘情况很容易被错误处理。 

一个微妙的案例发生在起始星球上。 杰克开始时间`0`，但如果行星`1`被封锁的时间`0`，他不能立即离开。 

例子：```
2 1
1 2 5
1 0
0
```正确答案是`6`， 不是`5`，因为杰克在离开之前必须等待一秒钟。 

另一个棘手的情况是连续阻塞时间。```
2 1
1 2 3
3 0 1 2
0
```杰克开始时间`0`，但次`0`,`1`， 和`2`都被星球封锁了`1`。 他只能按时离开`3`，所以答案是`6`。 

一个粗心的实现只检查一个阻塞时刻会错误地产生`4`。 

断开连接的图表是错误的另一个来源。```
3 1
1 2 5
0
0
0
```行星`3`无法到达，所以答案一定是`-1`。 

最后，在封锁时间到达是完全合法的。 该限制仅在尝试离开时适用。```
2 1
1 2 3
0
1 3
```答案依然是`3`。 杰克到达星球`2`正好有另一个旅行者到达那里，但这并不重要，因为旅程结束了。 

## 方法

 蛮力的想法很简单。 将每个状态视为`(planet, current_time)`。 从一个状态开始，要么等待一秒，要么遍历一个边（如果当前时间没有被阻塞）。 

这是有效的，因为所有转换都是明确建模的。 问题在于时间维度的大小。 边权重可以累积得远远超过`10^9`，并且探索所有中间时间是不可能的。 

更精致的蛮力方法仍然会使用 Dijkstra 算法，但每当我们到达行星时`t`，我们反复递增`t`同时它仍然被阻止。 

这已经好多了，因为我们不再对全球的每一秒进行建模。 剩下的问题是效率。 假设一颗行星有阻塞时间：```
0 1 2 3 4 ... 100000
```如果许多最短路径松弛重复地一一扫描这些值，则总复杂度可能会变成二次。 

关键的观察结果是等待行为是确定性的。 一旦我们知道到达时间`t`在一颗行星上，只有一个最早的有效出发时间。 由于阻塞时刻是排序的，因此我们可以直接跳转到该出发时间，而不是盲目递增。 

这将问题变回具有修改边缘松弛的标准最短路径问题。 

对于每一个星球`u`， 定义：```
next_free(u, t)
```作为最早的时间`>= t`没有被阻止`u`。 

那么每条边松弛就变成：```
departure = next_free(u, dist[u])
arrival = departure + weight
```该图仍然具有非负边成本，因此 Dijkstra 仍然有效。 

计算`next_free`有效地，我们将每个阻止列表存储在哈希集中`O(1)`会员资格测试。 由于每个阻塞时刻在所有增量中最多被访问一次，因此总工作量与总阻塞计数保持线性关系。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 随着时间的推移暴力破解状态| 不可能| 不可能| 太慢了 |
 | Dijkstra 与天真的等待扫描 | 可能为 O(K²) | O(n + m + K) | 太慢了 |
 | 优化的 Dijkstra | O((n + m) log n + K) | O(n + m + K) | 已接受 |

 这里`K`是阻塞时刻的总数。 

## 算法演练

 1. 为图构建邻接表。 

每条边都存储邻近的行星和旅行时间。 
2. 将每个行星的阻塞时刻存储在哈希集中。 

快速的会员资格测试至关重要，因为我们会反复询问给定时间是否被阻止。 
3. 预先计算每个阻塞时刻的最早有效出发时间。 

假设一颗行星有阻塞时刻：```
3 4 5 8 9
```如果杰克准时到达`3`，他实际上必须等到`6`。 

如果他到达`4`，答案仍然是`6`。 

我们通过向后扫描每个阻止列表来有效地进行预处理。 
4. 从星球上运行 Dijkstra 算法`1`。 

优先级队列存储`(current_time, node)`。 
5. 处理节点时`u`在某个时间`t`，确定实际出发时间。 

如果`t`未受阻，出发时间保持不变`t`。 

否则，直接跳转到连续阻塞段之后的第一个非阻塞时间。 
6. 放松所有出线边缘。 

对于边缘`(u, v, w)`:```
new_time = departure_time + w
```如果这有所改善`dist[v]`，将新状态推入堆中。 
7. Dijkstra完成后，打印`dist[n]`。 

如果仍然无限，则打印`-1`。 

### 为什么它有效

 Dijkstra 算法依赖于一个特性：一旦以最小距离提取了一个节点，以后就不再存在到达该节点的更短路径。 

等待规则不会违反此属性，因为等待只会增加时间，而不会减少时间。 每个边遍历实际上都具有非负动态成本：```
effective_cost = waiting_time + edge_weight
```预处理步骤保证对于每个到达时间，我们计算出准确的最早合法出发时间。 由于每次松弛都使用真实的最小偏离，因此所有候选路径都会被正确评估。 

由于所有有效转移成本都是非负的，因此标准 Dijkstra 正确性证明仍然适用。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

INF = 10**30

def solve():
    n, m = map(int, input().split())

    graph = [[] for _ in range(n + 1)]

    for _ in range(m):
        a, b, c = map(int, input().split())
        graph[a].append((b, c))
        graph[b].append((a, c))

    nxt = [{} for _ in range(n + 1)]

    for i in range(1, n + 1):
        arr = list(map(int, input().split()))

        k = arr[0]
        times = arr[1:]

        if k == 0:
            continue

        jump = {}

        last = times[-1]
        jump[last] = last + 1

        for j in range(k - 2, -1, -1):
            cur = times[j]
            nxt_time = times[j + 1]

            if nxt_time == cur + 1:
                jump[cur] = jump[nxt_time]
            else:
                jump[cur] = cur + 1

        nxt[i] = jump

    dist = [INF] * (n + 1)
    dist[1] = 0

    pq = [(0, 1)]

    while pq:
        t, u = heapq.heappop(pq)

        if t != dist[u]:
            continue

        depart = nxt[u].get(t, t)

        for v, w in graph[u]:
            nt = depart + w

            if nt < dist[v]:
                dist[v] = nt
                heapq.heappush(pq, (nt, v))

    print(-1 if dist[n] == INF else dist[n])

solve()
```邻接列表是标准的 Dijkstra 基础设施。 由于图是稀疏的，因此这种表示可以保持内存和迭代的效率。 

预处理步骤是核心技巧。 对于每个阻塞时间`t`，我们严格将第一个有效时间存储在包含以下内容的连续阻塞段之后：`t`。 

例如：```
blocked = [3, 4, 5, 8]
```变成：```
3 -> 6
4 -> 6
5 -> 6
8 -> 9
```这使得算法能够以恒定的预期时间计算等待时间。 

向后扫描很重要。 加工时`4`，我们已经知道答案`5`。 如果`5`是连续的，那么`4`继承相同的最终逃逸时间。 

在 Dijkstra 内部，有这样一行：```
depart = nxt[u].get(t, t)
```方法：```
If t is blocked, jump forward.
Otherwise leave immediately.
```一个常见的错误是在遍历边缘后重新计算等待。 等待规则适用于离开行星之前，而不是到达之后。 

另一个微妙之处是陈旧的堆条目。 Dijkstra 可能会将同一节点的多个版本推送到优先级队列中。 支票：```
if t != dist[u]:
    continue
```安全地丢弃过时的状态。 

Python 整数是任意精度的，因此大的路径和不存在溢出问题。 

## 工作示例

 ### 示例 1

 输入：```
4 6
1 2 2
1 3 3
1 4 8
2 3 4
2 4 5
3 4 3
0
1 3
2 3 4
0
```阻塞时刻：```
Planet 1: none
Planet 2: {3}
Planet 3: {3, 4}
Planet 4: none
```预处理的跳转：```
Planet 2: 3 -> 4
Planet 3: 3 -> 5, 4 -> 5
```| 步骤| 堆流行| 出发时间 | 轻松边缘| 新距离 |
 | --- | --- | --- | --- | --- |
 | 1 | (0,1)| 0 | 1→2 | 2 |
 | 1 | (0,1)| 0 | 1→3 | 3 |
 | 1 | (0,1)| 0 | 1→4 | 8 |
 | 2 | (2,2) | 2 | 2→4 | 7 |
 | 3 | (3,3) | 5 | 3→4 | 8 |
 | 4 | (7,4) | 7 | 无 | 决赛|

 最短路线是：```
1 → 2 → 4
```与总时间`7`。 

该跟踪演示了为什么在离开节点之前必须应用等待。 到达星球`3`在某个时间`3`迫使杰克等到`5`。 

### 断开连接的示例

 输入：```
3 1
1 2 5
0
0
0
```| 步骤| 堆流行| 出发时间 | 轻松边缘| 新距离 |
 | --- | --- | --- | --- | --- |
 | 1 | (0,1)| 0 | 1→2 | 5 |
 | 2 | (5,2) | 5 | 没有用| 无 |

 行星`3`永远不会达到。 

最终答案：```
-1
```这证实了该算法通过距离数组自然地处理断开的组件。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) log n + K) | Dijkstra占主导地位，预处理扫描一度阻塞次数|
 | 空间| O(n + m + K) | 图、堆、距离数组、阻塞时间图 |`n`,`m`，以及总阻止数`K`最多都是`10^5`，因此该算法完全符合限制。 堆操作是对数的，每个阻塞时间只参与预处理一次。 

## 测试用例```python
import sys
import io
import heapq

INF = 10**30

def solve():
    input = sys.stdin.readline

    n, m = map(int, input().split())

    graph = [[] for _ in range(n + 1)]

    for _ in range(m):
        a, b, c = map(int, input().split())
        graph[a].append((b, c))
        graph[b].append((a, c))

    nxt = [{} for _ in range(n + 1)]

    for i in range(1, n + 1):
        arr = list(map(int, input().split()))

        k = arr[0]
        times = arr[1:]

        jump = {}

        if k:
            jump[times[-1]] = times[-1] + 1

            for j in range(k - 2, -1, -1):
                cur = times[j]

                if times[j + 1] == cur + 1:
                    jump[cur] = jump[times[j + 1]]
                else:
                    jump[cur] = cur + 1

        nxt[i] = jump

    dist = [INF] * (n + 1)
    dist[1] = 0

    pq = [(0, 1)]

    while pq:
        t, u = heapq.heappop(pq)

        if t != dist[u]:
            continue

        depart = nxt[u].get(t, t)

        for v, w in graph[u]:
            nt = depart + w

            if nt < dist[v]:
                dist[v] = nt
                heapq.heappush(pq, (nt, v))

    return str(-1 if dist[n] == INF else dist[n])

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return solve()

# provided sample
assert run(
"""4 6
1 2 2
1 3 3
1 4 8
2 3 4
2 4 5
3 4 3
0
1 3
2 3 4
0
"""
) == "7"

# disconnected graph
assert run(
"""3 1
1 2 5
0
0
0
"""
) == "-1"

# starting node blocked at time 0
assert run(
"""2 1
1 2 5
1 0
0
"""
) == "6"

# consecutive waiting times
assert run(
"""2 1
1 2 3
3 0 1 2
0
"""
) == "6"

# arrival at blocked destination is allowed
assert run(
"""2 1
1 2 3
0
1 3
"""
) == "3"

print("ok")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 起始节点在时间 0 被阻塞 | 6 | 等待立即适用于源头|
 | 连续阻塞时刻| 6 | 等待必须持续通过整个阻塞段 |
 | 断开连接图| -1 | 无法到达的目标处理 |
 | 抵达目的地受阻 | 3 | 即使时间被封锁也允许到达 |

 ## 边缘情况

 考虑起始行星立即被阻挡的情况。```
2 1
1 2 5
1 0
0
```预处理存储：```
0 -> 1
```迪杰斯特拉开始于`(0,1)`。 从那时起`0`被阻塞，算法跳转到出发时间`1`。 穿越边缘需要`5`更多秒数，所以最终答案变成`6`。 

现在检查连续的阻塞时间。```
2 1
1 2 3
3 0 1 2
0
```预处理产生：```
0 -> 3
1 -> 3
2 -> 3
```当 Dijkstra 处理行星时`1`在某个时间`0`，立即跳转到出发时间`3`。 抵达星球时间`2`变成`6`。 

一次递增的幼稚实现会错误地在某个时间离开`1`，这仍然是被禁止的。 

最后，考虑一下到达目的地时受阻的情况。```
2 1
1 2 3
0
1 3
```杰克到达星球`2`在某个时间`3`。 该算法在到达后从不检查等待规则，除非尝试另一次边缘遍历。 自从星球`2`是目的地，答案依然存在`3`。 

这与问题陈述完全一致。
