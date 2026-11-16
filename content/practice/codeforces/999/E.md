---
title: "CF 999E - 从首都可达"
description: "我们得到一个有向图，其中城市是节点，道路是单向边。 指定一座城市为首都。 目标是确保从首都出发，沿着定向道路可以到达每个城市。"
date: "2026-06-16T23:52:51+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "graphs", "greedy"]
categories: ["algorithms"]
codeforces_contest: 999
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 490 (Div. 3)"
rating: 2000
weight: 999
solve_time_s: 75
verified: true
draft: false
---

[CF 999E - 来自首都的可达性](https://codeforces.com/problemset/problem/999/E)

 **评级：** 2000
 **标签：** dfs 和类似的、图、贪婪
 **求解时间：** 1m 15s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个有向图，其中城市是节点，道路是单向边。 指定一座城市为首都。 目标是确保从首都出发，沿着定向道路可以到达每个城市。 如果无法到达某个城市，我们可以添加新的定向道路，并且我们希望尽量减少添加的数量。 

核心任务不是计算可达性本身，而是确定必须插入的新有向边的最小数量，以便资本最终可以到达图中的每个节点。 

对于顶点和边的数量呈线性或接近线性的图算法来说，约束足够小。 当 n 和 m 都达到 5000 时，O(n²) 或 O(nm) 解决方案原则上是可以接受的，但任何三次方或从头开始重复重新计算可达性的解决方案都无法扩展。 

当图表包含强连接组件时，就会出现一个微妙的问题。 在强连接组件内部，每个节点都是相互可达的，因此单独处理节点会导致冗余推理。 正确的抽象是，只有强连接组件之间的结构才重要。 

一种幼稚的方法可能会尝试模拟贪婪地添加边，重复运行可达性搜索并将资本连接到新节点。 如果多个不可达区域间接相互依赖，则此方法会失败。 例如，如果图在 DAG 中排列了多个 SCC，则连接组件中的一个节点可能会解锁许多其他节点，并且贪婪的局部决策可能会在不识别这一结构的情况下进行多计数或少计数。 

## 方法

 一种直接但效率低下的策略是从首都重复运行 BFS 或 DFS，标记所有可达节点，然后选择一个不可达节点并添加一条从首都到该节点的道路，如此重复，直到所有节点都可达。 每次添加都会改变可达性，因此我们从头开始重新计算。 在最坏的情况下，我们可能会添加 O(n) 条边，每次可达性计算成本为 O(n + m)，导致 O(n(n + m)) 时间，这在上限上太慢了。 

关键的见解是，强连接组件内部的可达性对于单独的组件并不重要。 一旦我们将每个强连接组件收缩为单个节点，该图就变成了有向无环图（DAG）。 在 DAG 中，从资本的可达性仅取决于从资本组件可到达哪些组件。 

现在的问题是：在这个 DAG 中，哪些组件从资本组件中是不可达的，我们需要添加多少条边才能使所有组件都可以从资本组件中可达？ 每条添加的边都可以从任何可到达的组件开始，并到达任何不可到达的组件，因此我们希望有效地连接 DAG 中不可到达的部分。 

DAG 的一个众所周知的特性可以在这方面发挥作用。 如果我们考虑凝聚图，则每个从源不可到达的弱连接区域都需要至少一个来自可到达侧的传入边。 当从可达区域的连接性角度来看时，所需边的最小数量等于不可达组件子图中的源组件数量。 

实际上，我们通过计算强连接组件、构建压缩 DAG、标记哪些组件可以从首都到达、然后计算有多少不可达组件没有来自另一个不可达组件的传入边来解决这个问题。 每个这样的组件必须接收至少一个新边缘。 

这将问题简化为 SCC 分解加上对压缩图的线性扫描。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 具有边缘添加的重复 DFS/BFS | O(n(n + m)) | O(n(n + m)) | O(n + m) | 太慢了|
 | SCC+凝结图分析| O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 我们首先使用 Kosaraju 算法或 Tarjan 算法将图压缩为强连通分量。 此步骤将相互可达的节点分组为单个单元，因为在这样的组内，可达性已经得到保证并且不需要任何新的边。 

接下来，我们构建凝聚图，其中每个 SCC 成为一个节点，边代表组件之间的连接。 该图保证是 DAG，因为周期已收缩。 

然后我们识别包含资本的 SCC。 从此组件中，我们对凝结图执行 DFS 或 BFS 来标记所有已可达的组件。 

之后，我们只关注未标记为可达的组件。 在这些不可到达的组件中，我们计算哪些组件没有来自任何可到达组件的传入边缘。 每个这样的组件代表一个无法间接到达的区域，因此需要至少连接一条新边。 

最后，我们对这些分量进行计数并输出结果。 

### 为什么它有效

 收缩为 SCC 后，图就变成了 DAG，可达性的行为类似于偏序遍历。 可到达的SCC中的任何节点都可以到达其组件中的所有节点以及下游的所有SCC。 如果 SCC 无法访问，则它必须位于不同的 DAG 区域，且没有从首都组件发出的路径。 

如果一个不可达的 SCC 具有来自另一个不可达的 SCC 的传入边缘，则一旦该上游 SCC 连接即可到达。 因此，只有在不可达子图中没有传入边的 SCC 才是需要显式连接的独立“入口点”。 每个这样的 SCC 至少需要一条新边，一条边就足够了，因为它可以从任何可到达的 SCC 进行连接。 这建立了下界和构造最优性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**7)

def kosaraju(n, g, rg):
    visited = [False] * n
    order = []

    def dfs1(v):
        visited[v] = True
        for to in g[v]:
            if not visited[to]:
                dfs1(to)
        order.append(v)

    for i in range(n):
        if not visited[i]:
            dfs1(i)

    comp = [-1] * n
    cid = 0

    def dfs2(v, c):
        comp[v] = c
        for to in rg[v]:
            if comp[to] == -1:
                dfs2(to, c)

    for v in reversed(order):
        if comp[v] == -1:
            dfs2(v, cid)
            cid += 1

    return comp, cid

def solve():
    n, m, s = map(int, input().split())
    s -= 1

    g = [[] for _ in range(n)]
    rg = [[] for _ in range(n)]

    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        g[u].append(v)
        rg[v].append(u)

    comp, k = kosaraju(n, g, rg)

    cg = [[] for _ in range(k)]
    indeg = [0] * k

    for u in range(n):
        for v in g[u]:
            if comp[u] != comp[v]:
                cg[comp[u]].append(comp[v])

    cap = comp[s]

    reachable = [False] * k
    stack = [cap]
    reachable[cap] = True

    while stack:
        v = stack.pop()
        for to in cg[v]:
            if not reachable[to]:
                reachable[to] = True
                stack.append(to)

    indeg_unreach = [0] * k

    for u in range(n):
        cu = comp[u]
        if reachable[cu]:
            continue
        for v in g[u]:
            cv = comp[v]
            if not reachable[cv]:
                indeg_unreach[cv] += 1

    ans = 0
    for c in range(k):
        if not reachable[c] and indeg_unreach[c] == 0:
            ans += 1

    print(ans)

if __name__ == "__main__":
    solve()
```该解决方案首先构建 SCC 分解的原始图和反转图。 计算组件标签后，它隐式构建凝结图并探索资本组件的可达性。 

一个关键的实现细节是在计算传入边沿之前分离可达和不可达的 SCC。 这可以防止对源自已可达区域的边进行过多计数，这对于连接其余图并不重要。 

最后的计数步骤仅考虑不可达且来自其他不可达SCC的传入边沿为零的SCC，这与必须直接连接的独立组件完全对应。 

## 工作示例

 ### 示例 1

 输入：```
9 9 1
1 2
1 3
2 3
1 5
5 6
6 1
1 8
9 8
7 1
```SCC分解后，假设除了(1,5,6)这样的循环之外，每个节点都是它自己的组件。 我们跟踪 1 的组件的可达性。 

| 步骤| 行动| 可到达的 SCC |
 | --- | --- | --- |
 | 1 | 从SCC(1)开始 | {1} |
 | 2 | 遍历冷凝边缘| {1,2,3,5,6,8} |
 | 3 | 标记无法访问的 SCC | {4,7,9} |
 | 4 | 统计没有来自不可达的传入的 SCC | 3 |

 结果为 3，满足连接三个独立的不可达区域的需要。 

这证实了只有独立的不可到达的 SCC 源才重要，而不是所有节点。 

### 示例 2（已构建）

 输入：```
5 2 5
5 4
4 3
```这里节点5可以到达4和3，但是节点1和2是隔离的。 

| 步骤| 行动| 可到达的 SCC |
 | --- | --- | --- |
 | 1 | 从SCC开始(5) | {5,4,3} |
 | 2 | 剩余 SCC | {1,2} |
 | 3 | 计算独立的不可达 SCC | 2 |

 需要两条边，一条到达 SCC(1)，一条到达 SCC(2)。 

这表明每个断开连接的组件都需要至少一个传入连接。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | SCC 计算和图遍历每次在顶点和边上以线性时间运行 |
 | 空间| O(n + m) | 邻接表、反向图、分量数组和辅助结构 |

 这些约束允许最多 5000 个节点和边，并且线性时间 SCC 方法完全在限制范围内。 内存使用量也完全在 256 MB 范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    from types import ModuleType

    # assumes solution is defined in same file context
    return _sys.stdout.getvalue() if False else ""

# Since full harness integration isn't possible in this static format,
# below are logical assert-style cases for reference.

# sample 1
# assert run("""9 9 1
# 1 2
# 1 3
# 2 3
# 1 5
# 5 6
# 6 1
# 1 8
# 9 8
# 7 1
# """) == "3"

# minimal case
# assert run("""1 0 1
# """) == "0"

# disconnected nodes
# assert run("""3 0 1
# """) == "2"

# already strongly connected
# assert run("""3 3 1
# 1 2
# 2 3
# 3 1
# """) == "0"

# reversed chain
# assert run("""4 3 4
# 4 3
# 3 2
# 2 1
# """) == "0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单节点| 0 | 简单的基本情况|
 | 没有边缘| n-1 | n-1 最坏的断线情况|
 | 循环图| 0 | SCC 崩溃行为 |
 | 反向路径 | 0 | 尾部完全可达性|

 ## 边缘情况

 一种边缘情况是资本位于凝结图的汇组件中。 在这种情况下，其 SCC 不存在传出边缘，因此只能到达其 SCC 内的节点。 该算法仅将该组件标记为可达性，并且所有其他没有传入可达性的 SCC 都会被计数。 这正确地为每个独立的不可达区域生成一个所需的连接。 

另一种情况是图已经强连通。 SCC压缩后，只有一个分量。 可达性步骤将其标记为立即可达，并且最终计数没有发现无法到达的组件，返回零而不执行任何不必要的计数。 

第三种情况是存在多个小的、不相连的、根本没有边缘的 SCC。 每个 SCC 的可到达组件的传入边数为零，因此每个 SCC 都被计数一次。 该算法正确地将每一项解释为需要与首都地区的直接连接。
