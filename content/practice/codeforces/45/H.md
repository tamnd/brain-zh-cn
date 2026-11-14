---
title: "CF 45H - 道路问题"
description: "我们得到一个代表道路网络的无向连通图。 每个交汇点都是一个顶点，每条道路都是一条边，任何一对顶点之间最多有一条边。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "graphs"]
categories: ["algorithms"]
codeforces_contest: 45
codeforces_index: "H"
codeforces_contest_name: "School Team Contest 3 (Winter Computer School 2010/11)"
rating: 2100
weight: 45
solve_time_s: 118
verified: true
draft: false
---

[CF 45H - 道路问题](https://codeforces.com/problemset/problem/45/H)

 **评分：** 2100
 **标签：**图表
 **求解时间：** 1m 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个代表道路网络的无向连通图。 每个交汇点都是一个顶点，每条道路都是一条边，任何一对顶点之间最多有一条边。 

城市希望最终的图满足更强的连通性条件：在每对路口之间，必须存在至少两条边不相交的路径。 在图论中，这意味着图必须成为 2 边连接的，或者等效地，图必须不包含桥。 

桥是一条边，删除它会断开图的连接。 任何没有桥的图都会自动满足要求，因为每对顶点之间都有两条边不相交的路径。 

我们可以添加新的边，但不允许创建平行的边。 任务是添加最少数量的边，以便生成的图没有桥。 如果由于每个可能的有用边缘已经存在而无法完成此操作，我们将打印`-1`。 

该图最多有 900 个顶点，但最多有 100000 条边。 大量的边数立即排除了在每次候选边添加后从头开始重复重新计算连接的算法。 一个天真的`O(m * (n + m))`在密集图中，桥重新计算已经太大。 

小顶点边界是更有趣的约束。 自从`n ≤ 900`， 一个`O(n^2)`对顶点对的搜索是完全可以接受的。 当我们需要找到补图中缺失的边时，这会变得很有用。 

有几种边缘情况很容易被错误处理。 

考虑一个已经是 2 边连接的图：```
3 3
1 2
2 3
3 1
```正确答案是：```
0
```即使没有桥，粗心的解决方案仍可能尝试连接某些 DFS 树的叶子。 

现在考虑一棵树：```
4 3
1 2
2 3
3 4
```每条边都是一座桥。 最佳答案是一个新的优势：```
1
1 4
```添加这条单边会创建一个包含所有原始边的循环。 

当图表几乎完成时，会出现更微妙的情况：```
4 5
1 2
1 3
1 4
2 3
2 4
```唯一缺失的边是`(3,4)`。 该图仍然包含桥梁？ 不，不是，所以答案是`0`。 但想象一下一个图表，其中修复桥梁需要添加已经存在的边。 由于平行边被禁止，一些图变得不可能。 

例如：```
2 1
1 2
```唯一可能的边缘已经存在。 我们无法添加另一个副本`(1,2)`，所以答案是：```
-1
```忽略“无多条边”条件的解决方案将错误地输出一条额外边。 

## 方法

 蛮力的想法很简单。 重复查找所有桥，然后尝试每一个可能缺失的边并评估添加后有多少桥消失。 添加最佳边，更新图形，然后继续，直到没有桥剩余。 

这是可行的，因为添加边只能减少桥的数量。 最终图变成 2 边连通的。 

问题是成本。 检测桥梁需要`O(n + m)`用 Tarjan 算法。 有`O(n^2)`候选边，我们可以添加很多边。 在密集图中，这很容易超出数亿次操作。 

关键的观察结果是桥梁形成树结构。 

如果我们将每个最大 2 边连接组件压缩为单个节点，则所有剩余的桥边形成一棵树，称为桥树。 这棵树中的每一片叶子都对应于通过一个桥连接的一个组件。 

为了消除所有桥，叶子必须通过新的边缘配对在一起。 每添加一条边最多可以减少两个叶子的数量。 这给出了经典下界：$$\left\lceil \frac{\text{number of leaves}}{2} \right\rceil$$对于不受限制的图，这个界限总是可以实现的。 

这里额外的复杂性是对平行边缘的禁止。 当我们连接两个桥树叶子时，我们必须从那些尚未相邻的组件中选择实际的顶点。 自从`n ≤ 900`，我们可以直接搜索这样的对。 

整个问题就变成了：

 1. 寻找桥梁。 
2. 构建桥接组件。 
3. 构建桥树。 
4. 叶子对。 
5. 对于每对叶子组件，找到它们之间缺失的边。 

如果在某个时刻不存在这样的缺失边缘，则答案是不可能的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²(n + m)) 或更糟 | O(n + m) | 太慢了|
 | 最佳 | O(n² + m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 运行 Tarjan 的寻桥 DFS。 

对于每条边，使用发现时间和低链路值确定它是否是网桥。 
2. 从概念上删除所有桥并计算连通分量。 

不使用桥连接的顶点属于同一个 2 边连接组件。 
3. 将每个组件压缩为一个节点并构建桥树。 

每个原始桥都成为两个压缩组件之间的边缘。 由于桥在压缩后不能形成环，因此该结构是树。 
4. 数一下桥树的叶子。 

有度数的组件`1`桥树中是一个叶子组件。 
5. 从两端将叶子配对。 

如果有`k`叶子，所需的最小边数为`(k + 1) // 2`。 

标准方法是列出所有叶子和对：`leaf[i]`和`leaf[i + k/2]`。 
6. 对于每对叶子组件，搜索没有现有边的两个顶点。 

我们迭代第一个组件中的所有顶点和第二个组件中的所有顶点，直到找到一对`(u, v)`这样就已经不存在任何边缘了。 
7. 将这些边添加到答案中。 

每个添加的边都会创建一个穿过两个叶子之间路径上的桥的循环，从而消除这些桥。 
8. 如果任何所需的对没有可用的非边缘，则打印`-1`。 

由于平行边缘被禁止，因此无法执行修复操作。 

### 为什么它有效

 压缩2边连通分量后，剩余的每条边都是一座桥，因此压缩后的图是一棵树。 

在树中，桥的存在正是因为叶子通过单边连接。 连接两个叶子会沿着它们之间的唯一路径创建一个循环，从而移除该路径上的所有桥梁。 

每条添加的边最多可以消除两个叶子缺陷，因此至少`ceil(leaves / 2)`边缘是必要的。 配对策略恰好达到了这个界限，使其成为最优的。 

唯一剩下的问题是边缘可用性。 由于最终的图不能包含多条边，因此我们必须确保每对选定的组件至少包含一对不相邻的顶点。 如果这样的一对不存在，则无法在这些组件之间添加有效的修复边，并且构造变得不可能。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(1 << 25)

def solve():
    n, m = map(int, input().split())

    g = [[] for _ in range(n)]
    edges = []
    adj = [[False] * n for _ in range(n)]

    for idx in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1

        edges.append((u, v))

        g[u].append((v, idx))
        g[v].append((u, idx))

        adj[u][v] = True
        adj[v][u] = True

    tin = [-1] * n
    low = [0] * n
    is_bridge = [False] * m
    timer = 0

    def dfs(v, pe):
        nonlocal timer

        tin[v] = low[v] = timer
        timer += 1

        for to, eid in g[v]:
            if eid == pe:
                continue

            if tin[to] != -1:
                low[v] = min(low[v], tin[to])
            else:
                dfs(to, eid)
                low[v] = min(low[v], low[to])

                if low[to] > tin[v]:
                    is_bridge[eid] = True

    dfs(0, -1)

    comp = [-1] * n
    comps = []

    def dfs_comp(v, cid):
        comp[v] = cid
        comps[cid].append(v)

        for to, eid in g[v]:
            if is_bridge[eid]:
                continue
            if comp[to] == -1:
                dfs_comp(to, cid)

    cid = 0
    for i in range(n):
        if comp[i] == -1:
            comps.append([])
            dfs_comp(i, cid)
            cid += 1

    if cid == 1:
        print(0)
        return

    tree = [[] for _ in range(cid)]
    deg = [0] * cid

    for eid, (u, v) in enumerate(edges):
        cu = comp[u]
        cv = comp[v]

        if cu != cv:
            tree[cu].append(cv)
            tree[cv].append(cu)
            deg[cu] += 1
            deg[cv] += 1

    leaves = []

    for i in range(cid):
        if deg[i] == 1:
            leaves.append(i)

    k = len(leaves)
    need = (k + 1) // 2

    if k == 2:
        pairings = [(leaves[0], leaves[1])]
    else:
        pairings = []

        half = (k + 1) // 2

        for i in range(k // 2):
            pairings.append((leaves[i], leaves[i + half]))

        if k % 2 == 1:
            pairings.append((leaves[0], leaves[half - 1]))

    ans = []

    for a, b in pairings:
        found = False

        for u in comps[a]:
            for v in comps[b]:
                if not adj[u][v]:
                    ans.append((u + 1, v + 1))
                    adj[u][v] = adj[v][u] = True
                    found = True
                    break
            if found:
                break

        if not found:
            print(-1)
            return

    print(len(ans))
    for u, v in ans:
        print(u, v)

solve()
```第一部分构建图并存储邻接列表和邻接矩阵。 邻接列表用于 DFS 遍历，而邻接矩阵让我们测试在恒定时间内是否已经存在一条边。 

桥DFS是标准的Tarjan算法。`tin[v]`存储 DFS 进入时间，以及`low[v]`通过后边缘存储最早可到达的祖先。 一个边缘`(v, to)`成为一座桥梁，当`low[to] > tin[v]`。 

识别出桥之后，我们运行另一个 DFS，忽略桥边缘。 每次遍历都标记一个最大 2 边连通分量。 

压缩桥树没有明确构建为单独的对象。 我们只需要组件度数和每个组件内的顶点列表。 

叶子配对逻辑是微妙的部分。 配对相对的叶子可以平衡树并保证添加边的最佳数量。 奇数叶子需要额外的环绕配对。 

当搜索有效的新边时，我们迭代两个组件的实际顶点。 邻接矩阵避免了意外的平行边。 

该实现在添加每条边后更新邻接矩阵。 如果没有此更新，以后的配对可能会意外地重复使用相同的边缘。 

## 工作示例

 ### 示例 1

 输入：```
4 3
1 2
2 3
3 4
```每条边都是一座桥，因此每个顶点都成为自己的组成部分。 

| 步骤| 组件| 桥树| 叶子| 添加边缘 |
 | ---| ---| ---| ---| ---|
 | 压缩后| {1}、{2}、{3}、{4} | 1-2-3-4 | 1-2-3-4 | 1, 4 | 无 |
 | 一对叶子| 相同| 相同| 1, 4 | (1,4) |

 添加的边缘创建循环`1-2-3-4-1`，所以所有以前的桥梁都消失了。 

### 示例 2

 输入：```
6 6
1 2
2 3
3 1
3 4
4 5
5 6
```三角形`{1,2,3}`已经是 2 边连接的。 边缘`(3,4)`,`(4,5)`， 和`(5,6)`是桥梁。 

| 步骤| 组件| 桥树| 叶子| 添加边缘 |
 | ---| ---| ---| ---| ---|
 | 压缩后| {1,2,3}, {4}, {5}, {6} | A-B-C-D | A、D | 无 |
 | 一对叶子| 相同| 相同| A、D | (1,6) |

 新的边连接两个叶组件并创建一个覆盖每条桥路径的循环。 

该轨迹说明了为什么压缩强连接区域可以极大地简化问题。 我们只修复一棵树，而不是对原始图进行推理。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n² + m) | 桥 DFS 和组件 DFS 是线性的，顶点对搜索最多使用 O(n²) |
 | 空间| O(n² + m) | 邻接矩阵加图存储|

 这`n²`邻接矩阵对于`n = 900`，需要少于一百万个布尔条目。 DFS 遍历在图大小上是线性的，因此解决方案完全符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    sys.setrecursionlimit(1 << 25)

    n, m = map(int, input().split())

    g = [[] for _ in range(n)]
    edges = []
    adj = [[False] * n for _ in range(n)]

    for idx in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1

        edges.append((u, v))

        g[u].append((v, idx))
        g[v].append((u, idx))

        adj[u][v] = True
        adj[v][u] = True

    tin = [-1] * n
    low = [0] * n
    is_bridge = [False] * m
    timer = 0

    def dfs(v, pe):
        nonlocal timer

        tin[v] = low[v] = timer
        timer += 1

        for to, eid in g[v]:
            if eid == pe:
                continue

            if tin[to] != -1:
                low[v] = min(low[v], tin[to])
            else:
                dfs(to, eid)
                low[v] = min(low[v], low[to])

                if low[to] > tin[v]:
                    is_bridge[eid] = True

    dfs(0, -1)

    comp = [-1] * n
    comps = []

    def dfs_comp(v, cid):
        comp[v] = cid
        comps[cid].append(v)

        for to, eid in g[v]:
            if is_bridge[eid]:
                continue
            if comp[to] == -1:
                dfs_comp(to, cid)

    cid = 0
    for i in range(n):
        if comp[i] == -1:
            comps.append([])
            dfs_comp(i, cid)
            cid += 1

    if cid == 1:
        return "0"

    deg = [0] * cid

    for eid, (u, v) in enumerate(edges):
        cu = comp[u]
        cv = comp[v]

        if cu != cv:
            deg[cu] += 1
            deg[cv] += 1

    leaves = []

    for i in range(cid):
        if deg[i] == 1:
            leaves.append(i)

    k = len(leaves)

    if k == 2:
        pairings = [(leaves[0], leaves[1])]
    else:
        pairings = []

        half = (k + 1) // 2

        for i in range(k // 2):
            pairings.append((leaves[i], leaves[i + half]))

        if k % 2 == 1:
            pairings.append((leaves[0], leaves[half - 1]))

    ans = []

    for a, b in pairings:
        found = False

        for u in comps[a]:
            for v in comps[b]:
                if not adj[u][v]:
                    ans.append((u + 1, v + 1))
                    adj[u][v] = adj[v][u] = True
                    found = True
                    break
            if found:
                break

        if not found:
            return "-1"

    out = [str(len(ans))]
    for u, v in ans:
        out.append(f"{u} {v}")

    return "\n".join(out)

# provided sample
assert run(
"""4 3
1 2
2 3
3 4
"""
).startswith("1")

# already 2-edge-connected
assert run(
"""3 3
1 2
2 3
3 1
"""
) == "0"

# impossible case
assert run(
"""2 1
1 2
"""
) == "-1"

# simple chain
assert run(
"""5 4
1 2
2 3
3 4
4 5
"""
).startswith("1")

# graph with one cyclic component and tail
assert run(
"""6 6
1 2
2 3
3 1
3 4
4 5
5 6
"""
).startswith("1")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 三角形图|`0`| 已经 2 边连接 |
 | 具有一条边的两个顶点 |`-1`| 禁止平行边缘 |
 | 长链| 增加一项优势 | 一个周期修复所有桥梁 |
 | 带有附加路径的循环 | 增加一项优势 | 组件压缩工程|

 ## 边缘情况

 考虑不可能的情况：```
2 1
1 2
```该图包含一座桥。 桥树有两片叶子，因此理论上添加一条边就能修复图。 但唯一可能的优势`(1,2)`已经存在。 

该算法由两个组成部分组成`{1}`和`{2}`。 在搜索它们之间的非边的过程中，每个候选对已经是相邻的。 搜索失败，算法正确打印`-1`。 

现在考虑一个已经有效的图：```
4 4
1 2
2 3
3 4
4 1
```Tarjan 的算法没有发现任何桥梁。 压缩后所有顶点仍保留在一个组件中。 由于组件数量为 1，算法立即打印`0`。 

最后，考虑一个具有多个共享路径的桥的图：```
7 6
1 2
2 3
3 4
4 5
3 6
6 7
```桥上的树有叶子了`{1,5,7}`。 

该算法将树上的叶子配对。 添加的一条边消除了一条路径上的所有桥接，而另一条边则删除了剩余的桥接路径。 这证实了以下不变量：每个新边都会修复其端点之间的整个树路径，而不仅仅是单个桥。
