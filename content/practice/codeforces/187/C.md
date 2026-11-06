---
title: "CF 187C - 弱内存"
description: "我们有一个无向图，表示公园内的交叉路口和道路。 一些十字路口有志愿者。 PMP从s路口出发，公交车站在t路口。 PMP记忆力较弱。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dsu"]
categories: ["algorithms"]
codeforces_contest: 187
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 119 (Div. 1)"
rating: 2000
weight: 187
solve_time_s: 132
verified: true
draft: false
---

[CF 187C - 内存弱](https://codeforces.com/problemset/problem/187/C)

 **评级：** 2000
 **标签：** dfs 和类似的、dsu
 **求解时间：** 2m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个无向图，表示公园内的交叉路口和道路。 一些十字路口有志愿者。 PMP从十字路口开始`s`，公交车站就在十字路口`t`。 

PMP记忆力较弱。 在与志愿者交谈后，他只能记住一条最多包含`q`不包括当前交叉点的交叉点。 由于路径长度是用道路来衡量的，这意味着志愿者最多只能引导他沿着一条路径走`q`边缘。 

志愿者可以直接指导 PMP`t`，或引导他去找另一位志愿者。 志愿者始终以最佳方式合作。 我们必须找到最小值`q`这样PMP就可以保证达到`t`。 

该图最多有`10^5`顶点和`2 * 10^5`边缘。 任何由每个志愿者独立运行 BFS 的解决方案都已经变得危险。 如果`k`也近`10^5`，然后一个`O(k * (n + m))`方法已经远远超出了极限。 

问题的结构很微妙。 PMP不需要记住从`s`到`t`。 他只需要在志愿者之间移动，最后从某个志愿者到`t`。 这将问题转化为距离阈值下特殊节点之间的连通性问题。 

一些边缘情况很容易被错误处理。 

考虑这个图：```
1 -- 2 -- 3
```志愿者仅在`1`， 开始`s = 1`， 目标`t = 3`。 

最短路由`1`到`3`有长度`2`，所以答案是`2`。 一个粗心的解决方案，只检查志愿者到志愿者的转换，会错误地得出结论：达到`t`是不可能的，因为`t`不是志愿者。 

另一个棘手的情况是断开连接的图。 

输入：```
4 2 1
1
1 2
3 4
1 4
```正确输出：```
-1
```甚至任意大`q`无能为力，因为没有路径`1`到`4`。 

当使用中间志愿者减少所需的记忆时，会出现一种更微妙的情况。 

输入：```
5 4 2
1 3
1 2
2 3
3 4
4 5
1 5
```最短路由`1`到`5`有长度`4`，但答案是`2`。 

PMP 可以移动：`1 -> 3 -> 5`第一段有长度`2`，第二段也有长度`2`。 

任何仅计算最短路径的解决方案`s`到`t`忽略了问题的实际结构。 

## 方法

 蛮力解释很简单。 假设我们修复一些候选值`q`。 We can build a new graph whose vertices are volunteers plus the target`t`。 

如果两个顶点在原图中的最短路径距离至多，则两个顶点相连`q`。 

那么 PMP 成功的时间恰好是`s`可以达到`t`在这个压缩图中。 

测试单个`q`，我们可以从每个志愿者和`t`，计算所有成对距离`q`。 如果有`k`志愿者，这费用大约是`O((k + 1)(n + m))`。 

尝试一切可能`q`使用二分查找的值会让事情变得更糟。 在最坏的情况下：```
O(log n * k * (n + m))
```随着所有极限的临近`10^5`，这变得完全不可行。 

关键的观察结果是，答案仅取决于当我们逐渐允许更大的距离时图组件如何合并。 

假设我们知道最短路径距离最多为的所有顶点对`d`。 然后每个这样的对在以下情况下有效地成为 PMP 连接`q = d`。 

这表明以递增的顺序处理距离，当图形区域在当前阈值内变得可达时合并它们。 

解决这类问题的经典技巧是多源BFS结合DSU。 

想象一下所有志愿者同时扩张。 每个顶点都会记住哪个志愿者首先到达它。 当来自两个不同志愿者的 BFS 波在边缘相遇时，我们发现这两个志愿者之间的最短距离。 

更准确地说，如果：```
dist[u] + dist[v] + 1 = D
```和`u`和`v`属于不同的志愿者来源，那么这些志愿者之间的最短距离恰好是`D`。 

这会在志愿者组件之间生成加权边缘。 按距离对这些边进行排序后，我们可以按升序合并它们。 当组件包含的第一时刻`s`连接到可以直接到达的组件`t`给出了答案。 

该问题与志愿者隐式图上的克鲁斯卡尔算法非常相似。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(log n * k * (n + m)) | O(n + m) | 太慢了 |
 | 最佳 | O((n + m) log (n + m)) | O((n + m) log (n + m)) | O(n + m) | 已接受 |

 ## 算法演练

 1. 从所有自愿顶点同时运行多源 BFS。 

每个顶点存储：`owner[v]`，最先到达的志愿者来源。`dist[v]`，距该源的距离。 

这将图划分为围绕志愿者的类似 Voronoi 的区域。 
2. 在 BFS 期间，每当我们检查一条边时`(u, v)`如果其端点属于不同的所有者，我们会发现两个志愿者来源之间的候选连接。 

这两个源之间的最短路径是：```
dist[u] + dist[v] + 1
```因为路径从一个源到`u`，穿过边缘，然后到达另一个源`v`。 
3. 存储志愿者来源之间的所有此类候选边。 

多个边可以连接同一对源。 这很好，因为克鲁斯卡尔式处理自然会忽略更糟糕的重复项。 
4.我们还需要将志愿者与目标联系起来`t`。 

运行正常的 BFS`t`计算从每个顶点到`t`。 
5. 对于每个志愿者来源`x`， 记录`dt[x]`，从该志愿者到的最短距离`t`。 

如果PMP有记忆`q >= dt[x]`，然后志愿`x`可以直接引导他到公交车站。 
6. 按距离对所有志愿者连接边进行排序。 
7. 在志愿者源和代表目标的一个额外节点上创建一个 DSU。 
8. 按照距离递增的顺序处理候选边。 

处理带权重的边时`w`，联合两个志愿者组件。 
9. 另外，根据志愿者的距离对志愿者进行排序`t`。 

每当`dt[x] <= current_weight`、工会志愿者`x`与特殊目标节点。 
10. 起始志愿者与目标节点首次连接的权重为最小有效权重`q`。 
11. 如果连接从未发生，则输出`-1`。 

### 为什么它有效

 多源BFS保证两个BFS区域的每次相遇都会产生相应志愿者源之间的真实最短距离。 这与最短路径 Voronoi 分解中使用的属性相同。 

按递增顺序处理边缘模拟逐渐增加允许的内存限制`q`。 

在处理过程中的任何时刻，当 PMP 可以使用长度最大为当前阈值的段在两个志愿者之间移动时，两个志愿者都属于同一个 DSU 组件。 

同样，一旦志愿者连接到特殊目标节点，PMP 就可以从该志愿者直接前往`t`。 

第一个阈值在哪里`s`变得连接到`t`正是最小的可行内存限制。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)

        if a == b:
            return

        if self.size[a] < self.size[b]:
            a, b = b, a

        self.parent[b] = a
        self.size[a] += self.size[b]

def solve():
    n, m, k = map(int, input().split())

    volunteers = list(map(int, input().split()))

    graph = [[] for _ in range(n + 1)]

    for _ in range(m):
        u, v = map(int, input().split())
        graph[u].append(v)
        graph[v].append(u)

    s, t = map(int, input().split())

    volunteer_id = {}
    for i, v in enumerate(volunteers):
        volunteer_id[v] = i

    # multi-source BFS from volunteers
    owner = [-1] * (n + 1)
    dist = [-1] * (n + 1)

    q = deque()

    for i, v in enumerate(volunteers):
        owner[v] = i
        dist[v] = 0
        q.append(v)

    edges = []

    while q:
        u = q.popleft()

        for v in graph[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                owner[v] = owner[u]
                q.append(v)
            elif owner[v] != owner[u]:
                w = dist[u] + dist[v] + 1
                edges.append((w, owner[u], owner[v]))

    # BFS from target
    dt = [-1] * (n + 1)

    q = deque([t])
    dt[t] = 0

    while q:
        u = q.popleft()

        for v in graph[u]:
            if dt[v] == -1:
                dt[v] = dt[u] + 1
                q.append(v)

    start_id = volunteer_id[s]

    if dt[s] == -1:
        print(-1)
        return

    target_node = k

    volunteer_to_t = []

    for i, v in enumerate(volunteers):
        volunteer_to_t.append((dt[v], i))

    volunteer_to_t.sort()
    edges.sort()

    dsu = DSU(k + 1)

    ptr = 0
    ans = -1

    all_weights = []

    for w, _, _ in edges:
        all_weights.append(w)

    for w, _ in volunteer_to_t:
        all_weights.append(w)

    all_weights = sorted(set(all_weights))

    edge_ptr = 0

    for current in all_weights:
        while edge_ptr < len(edges) and edges[edge_ptr][0] <= current:
            _, a, b = edges[edge_ptr]
            dsu.union(a, b)
            edge_ptr += 1

        while ptr < len(volunteer_to_t) and volunteer_to_t[ptr][0] <= current:
            _, x = volunteer_to_t[ptr]
            dsu.union(x, target_node)
            ptr += 1

        if dsu.find(start_id) == dsu.find(target_node):
            ans = current
            break

    print(ans)

solve()
```第一个 BFS 从每个志愿者身上同时增长。 每个节点都会记录哪个志愿者首先到达它以及距离有多远。 当两个区域跨越边缘接触时，我们获得相应志愿者之间的最短路径连接。 

第二个 BFS 计算到目标的普通最短距离。 这告诉我们每个志愿者何时可以直接指导 PMP`t`。 

DSU 阶段的行为类似于 Kruskal 算法。 随着阈值的增加，可以穿越更多的志愿者对。 一旦起始志愿者连接到特殊目标节点，当前阈值就是答案。 

一个微妙的细节是处理无法达到的目标。 如果`dt[s] == -1`，那么即使不受限制的运动也无法到达`t`，所以我们立即打印`-1`。 

另一个重要的实现细节是使用`<= current`同时处理边缘和志愿者与目标的链接。 在检查连接之前，权重最大为当前阈值的所有连接必须已处于活动状态。 

## 工作示例

 ### 示例 1

 输入：```
6 6 3
1 3 6
1 2
2 3
4 2
5 6
4 5
3 4
1 6
```多源BFS结果：

 | 顶点| 业主志愿者| 距离 |
 | --- | --- | --- |
 | 1 | 1 | 0 |
 | 2 | 1 | 1 |
 | 3 | 3 | 0 |
 | 4 | 3 | 1 |
 | 5 | 6 | 1 |
 | 6 | 6 | 0 |

 生成的志愿者边缘：

 | 志愿者| 重量 |
 | --- | --- |
 | 1 和 3 | 2 |
 | 3 和 6 | 3 |

 到目标的距离`6`:

 | 志愿者| 距离 6 |
 | ---| ---|
 | 1 | 5 |
 | 3 | 3 |
 | 6 | 0 |

 DSU处理：

 | 当前q | 活跃的志愿者边缘| 志愿者连接到 t | 可以达到t |
 | ---| ---| ---| ---|
 | 0 | 无 | 6 | 没有 |
 | 2 | 1-3 | 1-3 6 | 没有 |
 | 3 | 3-6 | 3-6 3,6| 是的 |

 回答：```
3
```这个例子说明了为什么中级志愿者很重要。 PMP 永远不会记住来自的整个长度为 5 的路径`1`到`6`。 

### 自定义示例

 输入：```
5 4 2
1 3
1 2
2 3
3 4
4 5
1 5
```志愿者地区：

 | 顶点| 业主| 距离 |
 | ---| ---| ---|
 | 1 | 1 | 0 |
 | 2 | 1 | 1 |
 | 3 | 3 | 0 |
 | 4 | 3 | 1 |
 | 5 | 3 | 2 |

 志愿者优势：

 | 志愿者| 重量 |
 | ---| ---|
 | 1 和 3 | 2 |

 到目标的距离`5`:

 | 志愿者| 距离 |
 | ---| ---|
 | 1 | 4 |
 | 3 | 2 |

 DSU 演变：

 | 当前q | 活动边缘| 目标连接 | 可达 |
 | ---| ---| ---| ---|
 | 2 | 1-3 | 1-3 3 | 是的 |

 回答：```
2
```该跟踪证实最佳解决方案可能使用志愿者切换来减少所需的内存。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) log (n + m)) | O((n + m) log (n + m)) | BFS 是线性的，排序候选边占主导地位 |
 | 空间| O(n + m) | Graph, BFS arrays, DSU, and edge storage |

 The graph size is at most`2 * 10^5`边，所以线性 BFS 遍历很容易足够快。 粗略排序`O(m)`候选边缘也能轻松地符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io
from collections import deque

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    class DSU:
        def __init__(self, n):
            self.parent = list(range(n))
            self.size = [1] * n

        def find(self, x):
            while self.parent[x] != x:
                self.parent[x] = self.parent[self.parent[x]]
                x = self.parent[x]
            return x

        def union(self, a, b):
            a = self.find(a)
            b = self.find(b)

            if a == b:
                return

            if self.size[a] < self.size[b]:
                a, b = b, a

            self.parent[b] = a
            self.size[a] += self.size[b]

    n, m, k = map(int, input().split())
    volunteers = list(map(int, input().split()))

    graph = [[] for _ in range(n + 1)]

    for _ in range(m):
        u, v = map(int, input().split())
        graph[u].append(v)
        graph[v].append(u)

    s, t = map(int, input().split())

    volunteer_id = {}
    for i, v in enumerate(volunteers):
        volunteer_id[v] = i

    owner = [-1] * (n + 1)
    dist = [-1] * (n + 1)

    q = deque()

    for i, v in enumerate(volunteers):
        owner[v] = i
        dist[v] = 0
        q.append(v)

    edges = []

    while q:
        u = q.popleft()

        for v in graph[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                owner[v] = owner[u]
                q.append(v)
            elif owner[v] != owner[u]:
                edges.append((dist[u] + dist[v] + 1, owner[u], owner[v]))

    dt = [-1] * (n + 1)

    q = deque([t])
    dt[t] = 0

    while q:
        u = q.popleft()

        for v in graph[u]:
            if dt[v] == -1:
                dt[v] = dt[u] + 1
                q.append(v)

    if dt[s] == -1:
        return "-1"

    volunteer_to_t = []

    for i, v in enumerate(volunteers):
        volunteer_to_t.append((dt[v], i))

    volunteer_to_t.sort()
    edges.sort()

    dsu = DSU(k + 1)

    target = k
    start = volunteer_id[s]

    vals = []

    for w, _, _ in edges:
        vals.append(w)

    for w, _ in volunteer_to_t:
        vals.append(w)

    vals = sorted(set(vals))

    ep = 0
    tp = 0

    for cur in vals:
        while ep < len(edges) and edges[ep][0] <= cur:
            _, a, b = edges[ep]
            dsu.union(a, b)
            ep += 1

        while tp < len(volunteer_to_t) and volunteer_to_t[tp][0] <= cur:
            _, x = volunteer_to_t[tp]
            dsu.union(x, target)
            tp += 1

        if dsu.find(start) == dsu.find(target):
            return str(cur)

    return "-1"

# provided sample
assert run(
"""6 6 3
1 3 6
1 2
2 3
4 2
5 6
4 5
3 4
1 6
"""
) == "3", "sample"

# disconnected graph
assert run(
"""4 2 1
1
1 2
3 4
1 4
"""
) == "-1", "unreachable target"

# direct short path
assert run(
"""3 2 1
1
1 2
2 3
1 3
"""
) == "2", "single volunteer"

# intermediate volunteer reduces answer
assert run(
"""5 4 2
1 3
1 2
2 3
3 4
4 5
1 5
"""
) == "2", "handoff between volunteers"

# already adjacent to target
assert run(
"""2 1 1
1
1 2
1 2
"""
) == "1", "minimum nonzero answer"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 断开连接图|`-1`| 正确处理无法到达的目标 |
 | 单一志愿者路径|`2`| 直接志愿者对目标的指导|
 | 中级志愿者案例|`2`| 多步骤志愿者路线|
 | 二节点图 |`1`| 尽可能小的有效答案 |

 ## 边缘情况

 考虑断开连接的图：```
4 2 1
1
1 2
3 4
1 4
```BFS 来自`t = 4`永远不会到达节点`1`， 所以`dt[1] = -1`。 

算法立即返回`-1`。 不需要 DSU 处理，因为即使不受限制的行程也无法连接组件。 

现在考虑目标不是志愿者的情况：```
3 2 1
1
1 2
2 3
1 3
```唯一的志愿者在节点`1`。 BFS 来自`t = 3`给出距离`2`对于志愿者`1`。 

不存在志愿者与志愿者之间的边缘，但算法正确连接了志愿者`1`直接到达目标节点`q = 2`。 

最后，考虑重要的继电器情况：```
5 4 2
1 3
1 2
2 3
3 4
4 5
1 5
```最短路由`1`到`5`有长度`4`，但是志愿者`3`充当中间检查点。 

DSU 首先激活志愿者之间的优势`1`和`3`按体重`2`。 志愿者`3`还直接连接到重量目标`2`。 

此时此刻，`s`变得连接到`t`，所以答案是`2`。
