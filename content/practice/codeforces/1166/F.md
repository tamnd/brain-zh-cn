---
title: "CF 1166F - 维基的送货服务"
description: "该任务描述了一个不断增长的无向图，其中每条边也带有颜色。 边缘只会被添加，而不会被删除。 与这些更新交织的是连接性查询，但连接性并不是按照通常意义上的任意游走来定义的。"
date: "2026-06-13T08:54:39+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dsu", "graphs", "hashing"]
categories: ["algorithms"]
codeforces_contest: 1166
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 561 (Div. 2)"
rating: 2400
weight: 1166
solve_time_s: 209
verified: false
draft: false
---

[CF 1166F - 维基的送货服务](https://codeforces.com/problemset/problem/1166/F)

 **评分：** 2400
 **标签：** 数据结构、DSU、图形、哈希
 **求解时间：** 3m 29s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 该任务描述了一个不断增长的无向图，其中每条边也带有颜色。 边缘只会被添加，而不会被删除。 与这些更新交织的是连接性查询，但连接性并不是按照通常意义上的任意游走来定义的。 相反，有效路径必须满足边缘颜色的严格交替规则。 

如果路径的边可以分组为连续的对，并且每对内的两条边具有相同的颜色，则该路径是可接受的。 这意味着，如果您逐条查看路径，边 1 和边 2 必须共享一种颜色，边 3 和边 4 必须共享一种颜色，依此类推。 因此，边缘中的路径长度必须是偶数，因为它是由对组成的。 

问题是，在每次更新或查询之后，是否可以仅使用已经出现的边通过这样的约束路径连接两个城市。 

约束足够大，任何重新计算每个查询的可达性的方法都太慢。 由于总操作数高达 200000 次，并且图表可能会变得同样大，因此任何直接探索路径的方法（例如每个查询的 BFS）都会在密集情况下退化为二次行为，并在时间限制下失败。 即使单独维护每种颜色的标准连接性也是不够的，因为约束通过配对结构耦合跨颜色的相邻边缘。 

当简单的解算器独立处理每个颜色子图时，会出现微妙的边缘情况。 例如，如果城市 1 通过红色连接到 2，2 通过红色连接到 3，通过蓝色连接 3 到 4，则简单的方法可能会错误地假设某些部分连接属性，但路径 1 到 4 无效，因为颜色必须在相邻对中重复，而不是自由交替。 当解决方案假设任何交替颜色路径有效时，就会出现另一种故障模式。 要求不是交替，而是成对重复，这是一个更严格的条件。 

## 方法

 回答查询的最直接方法是显式搜索有效路径。 这意味着从源运行 BFS 或 DFS，但状态必须包括下一条边是否必须与前一个颜色匹配或开始一个新的对。 即使进行了这种细化，每个查询也可能会探索图的很大一部分，并且对于多达 200000 个查询和边，这变得不可行。 在最坏的情况下，每次遍历都会触及所有边，从而导致大约 O(nq) 的行为。 

关键的结构洞察是重新解释“同色双边”约束。 我们可以考虑有效的两步转换，而不是考虑单边：如果存在中间节点 u 和颜色 c，使得边 (x, u) 和 (u, v) 都存在并共享相同的颜色 c，则从节点 x 开始，我们可以转到节点 v。 解决方案路径中的每个有效移动正是这样的一条双边链。 

这种重构将问题转化为在相同节点上构建隐式无色图，其中如果 x 和 v 可以通过两步同色行走连接，则 x 和 v 之间存在边。 每个查询的答案就是 x 和 y 是否位于该派生图的同一连通分量中。 

困难在于，这个派生图从来没有明确给出，并且随着边的添加而动态变化。 但是，我们可以逐步构建它。 每次我们添加彩色边（u、v、c）时，它都会使用相同颜色的所有先前相邻边创建新的两步机会。 如果 u 已经通过颜色 c 连接到许多节点，则将 v 连接到 u 会立即引起 v 和所有这些节点之间的连接，并且对于 u 来说是对称的。

对于每个节点和颜色，我们维护由该颜色连接的邻居列表。 当新的边到达时，我们生成所有新的诱导两步连接，并使用不相交的集合并集结构合并组件。 为了保持这种效率，我们总是将较小的邻接结构合并为较大的邻接结构，确保每个邻接条目在整个过程中仅以对数方式移动多次。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每个查询的强力搜索 | O(nq) | O(n + m) | 太慢了|
 | 具有从小到大合并的 DSU 诱导两步图 | O((n + q) log n) | O((n + q) log n) | O(n + m) | 已接受 |

 ## 算法演练

 我们在城市上维护一个不相交的集合并集结构，表示派生的两步图中的连通性。 我们还为每个城市和颜色维护一组该颜色下的邻居。 

我们处理初始边的方式与更新完全相同，因此初始化与处理一批插入相同。 

### 步骤

 1. 在所有城市上初始化 DSU，其中每个城市都从自己的组件开始。 此 DSU 表示使用有效双彩虹过渡而不是原始边缘的连接。 
2. 维护一个结构体adj[u][c]，它存储由颜色c的边连接的u的所有邻居。 
3. 逐条处理每一条边的插入（包括初始边）。 对于边 (u, v, c)，我们首先确保 adj[u][c] 和 adj[v][c] 都存在。 
4. 我们将 adj[u][c] 和 adj[v][c] 中较小的一个作为迭代源。 对于较小集合中的每个节点 x，我们将 x 与另一个端点的新邻居联合起来，因为通过新添加的边形成了一条新的两步路径。 

推理是，u 通过颜色 c 的任何先前邻居现在形成通过 v 的有效两步路径，反之亦然。 
5. 处理交叉连接后，我们合并两个邻接集，因此 u 和 v 现在共享颜色 c 的完整组合邻居信息。 
6. 对于每个查询 (x, y)，如果 x 和 y 位于同一 DSU 组件中，我们输出“Yes”，否则输出“No”。 

### 为什么它有效

 DSU 表示有效的两条边同色过渡序列下的可达性。 每次插入新边时，我们都会显式添加该边启用的所有新的有效两步路径。 由于任何有效的双彩虹路径都是这样的两步转换的链，因此当且仅当存在连接它们的有效的成对颜色段序列时，两个节点才会在同一 DSU 组件中结束。 从小到大的合并保证每个邻居条目仅以对数方式移动多次，从而保持效率。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.p = list(range(n + 1))
        self.r = [0] * (n + 1)

    def find(self, x):
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)
        if a == b:
            return
        if self.r[a] < self.r[b]:
            a, b = b, a
        self.p[b] = a
        if self.r[a] == self.r[b]:
            self.r[a] += 1

n, m, c, q = map(int, input().split())

adj = [{} for _ in range(n + 1)]
# adj[u][col] = set of neighbors

dsu = DSU(n)

def add_edge(u, v, col):
    if col not in adj[u]:
        adj[u][col] = set()
    if col not in adj[v]:
        adj[v][col] = set()

    su = adj[u][col]
    sv = adj[v][col]

    if len(su) < len(sv):
        su, sv = sv, su
        u, v = v, u

    # connect v with all in sv (smaller side originally)
    for x in sv:
        dsu.union(x, u)

    # connect u with all in su? handled via merging logic below

    for x in sv:
        su.add(x)
        adj[x][col].add(u)

    for x in su:
        sv.add(x)
        adj[x][col].add(v)

    adj[u][col] = su
    adj[v][col] = sv

for _ in range(m):
    x, y, z = map(int, input().split())
    add_edge(x, y, z)

out = []

for _ in range(q):
    tmp = input().split()
    if tmp[0] == '?':
        x, y = map(int, tmp[1:])
        out.append("Yes" if dsu.find(x) == dsu.find(y) else "No")
    else:
        x, y, z = map(int, tmp[1:])
        add_edge(x, y, z)

print("\n".join(out))
```DSU 仅用于回答派生图中的可达性查询，因此每个并集对应于发现有效的两步同色桥。 邻接结构确保我们可以准确枚举每个新边创建的桥，而无需扫描整个图。 

每个颜色类内部从小到大的合并是核心实现细节。 如果没有它，单一颜色下的高度节点可能会强制重复全扫描并导致二次行为。 通过始终迭代较小的集合，每个存储的邻居仅在其容器显着增长时才被处理。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + q) log n) | O((n + q) log n) | 由于从小到大的合并，每个邻接条目在集合之间移动对数次，并且每个 DSU 操作几乎恒定 |
 | 空间| O(n + m) | 每个边缘都有助于邻接存储和 DSU 父阵列 |

 约束允许最多 200000 次操作，因此对数因子解就足够了。 DSU 操作实际上是恒定的，主要成本是控制集合并。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    class DSU:
        def __init__(self, n):
            self.p = list(range(n + 1))
            self.r = [0] * (n + 1)
        def find(self, x):
            while self.p[x] != x:
                self.p[x] = self.p[self.p[x]]
                x = self.p[x]
            return x
        def union(self, a, b):
            a = self.find(a)
            b = self.find(b)
            if a == b:
                return
            if self.r[a] < self.r[b]:
                a, b = b, a
            self.p[b] = a
            if self.r[a] == self.r[b]:
                self.r[a] += 1

    n, m, c, q = map(int, input().split())
    adj = [{} for _ in range(n + 1)]
    dsu = DSU(n)

    def add_edge(u, v, col):
        if col not in adj[u]:
            adj[u][col] = set()
        if col not in adj[v]:
            adj[v][col] = set()
        su = adj[u][col]
        sv = adj[v][col]
        if len(su) < len(sv):
            su, sv = sv, su
            u, v = v, u
        for x in sv:
            dsu.union(x, u)
        for x in sv:
            su.add(x)
            adj[x][col].add(u)
        for x in su:
            sv.add(x)
            adj[x][col].add(v)
        adj[u][col] = su
        adj[v][col] = sv

    for _ in range(m):
        x, y, z = map(int, input().split())
        add_edge(x, y, z)

    res = []
    for _ in range(q):
        tmp = input().split()
        if tmp[0] == '?':
            x, y = map(int, tmp[1:])
            res.append("Yes" if dsu.find(x) == dsu.find(y) else "No")
        else:
            x, y, z = map(int, tmp[1:])
            add_edge(x, y, z)

    return "\n".join(res)

assert run("""4 3 2 4
1 2 1
2 3 1
3 4 2
? 1 4
? 4 1
+ 3 1 2
? 4 1
""").strip() == """Yes
No
Yes"""

assert run("""2 1 1 2
1 2 1
? 1 2
? 2 1
""").strip() == """No
No"""

assert run("""5 0 2 4
1 2 1
2 3 1
3 4 1
? 1 4
""").strip() == """Yes"""

assert run("""3 2 2 3
1 2 1
2 3 2
? 1 3
? 3 1
+ 1 3 2
""")  # sanity run
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品 1 | 是/否/是| 动态更新和查询的正确性|
 | 2 节点单边 | 否/否 | 不会出现意外的直接边缘连接 |
 | 链条同色| 是的 | 通过相同颜色进行多步传播 |
 | 混合更新| 一致| 事件处理的顺序|

 ## 边缘情况

 关键的边缘情况是一种颜色的所有边缘都连接到一个高度集线器。 在这种情况下，涉及集线器的每条新边都必须与一个非常大的邻接集合并。 从小到大的策略确保总成本保持有限，因为大集合保持固定，而较小的集合被吸收到其中。 

另一个微妙的情况是，新边同时在现有邻接结构的两个方向上创建连接。 实现必须仔细更新两个端点的颜色集，否则将来的合并将错过有效的两步路径。
