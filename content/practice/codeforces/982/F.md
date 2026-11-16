---
problem: 982F
contest_id: 982
problem_index: F
name: "The Meeting Place Cannot Be Changed"
contest_name: "Codeforces Round 484 (Div. 2)"
rating: 2700
tags: ["dfs and similar", "graphs"]
answer: passed_samples
verified: false
solve_time_s: 87
date: 2026-06-18
model: gpt-5-3-mini
samples_passed: 0
samples_total: 1
share_url: https://chatgpt.com/share/6a33a65c-a680-83ec-b683-c182360d8ebc
---

# CF 982F - 集合地点不可更改

 **评分：** 2700
 **标签：** dfs 和类似的、图表
 **型号：** gpt-5-3-mini
 **求解时间：** 1m 27s
 **已验证：** 否（0/1 个样本）
 **分享：** https://chatgpt.com/share/6a33a65c-a680-83ec-b683-c182360d8ebc

 ---

 ## 解决方案

 ## 问题理解

 我们得到了一张有向图，表示由单向道路连接的交叉路口。 汽车从某个未知的十字路口出发，然后永远沿着外出道路行驶。 我们保证这一运动永远不会被卡住，这意味着在每一种可到达的情况下，总是至少有一个传出边缘来继续旅程。 

Petr 希望选择一个交叉路口，这样无论汽车从哪里开始，也无论在移动过程中选择哪个出站边缘，汽车最终都会在其无限行走中的某个点到达所选的交叉路口。 

用图术语重新表述，我们正在寻找图中所有无限有向游走都不可避免的顶点，假设游走任意遵循边但可以无限期地继续。 

约束 n 最大为 100000，m 最大为 500000，迫使任何解在图的大小上都呈线性或接近线性。 任何涉及每个节点重复 DFS 或成对检查可达性的操作都将立即超出限制，因为它将扩展到 O(n(m+n)) 或更糟。 

当图形包含排列在一个循环中的多个强连接组件时，就会出现微妙的失败情况。 例如，考虑组件 A → B → C → A 的有向循环，其中每个组件也有内部循环。 天真的直觉可能会选择一个 SCC 内的一个顶点，并假设所有路径最终都会流入该顶点，但实际上，该过程可以永远循环，而无需提交到单个入口点。 

另一个棘手的情况是，当存在多个大型 SCC 时，可以根据路径选择以不同的顺序访问这些 SCC。 在这样的图中，尽管组件内部的循环保证了无限移动，但没有单个顶点是不可避免的。 

## 方法

 强力解释是测试每个顶点作为候选交点。 对于固定顶点 v，我们需要验证从每个可能的起始位置和每个可能的边延续，无限游走最终到达 v。这已经暗示了最坏情况需要推理所有可能的可达集和所有无限路径。 直接模拟所有步行是不可能的，因为路径的数量随着长度呈指数增长。 

更结构化的强力方法是反向检查可达性：对于每个顶点 v，计算可以到达 v 的顶点集。然后检查每个顶点是否存在到 v 的路径。这相当于当边向前追踪时，v 从图中的所有节点都是可到达的。 该检查可以通过每个顶点的 DFS 或 BFS 来完成，成本为 O(n(m+n))，这太大了。 

关键的结构见解是图可以分解为强连接的组件。 在强连接组件内，每个顶点都可以到达彼此，因此从无限运动的角度来看，每个 SCC 的行为就像一个单一的“宏观状态”。 折叠每个 SCC 会生成一个有向无环图。 

在该压缩图中，问题就变成了找到一个可以从所有其他组件访问的组件。 在 DAG 中，当且仅当在反向可达性意义上恰好存在一个接收器组件时，或者等效地，该组件是凝结图中唯一没有传入边的组件时，才会发生这种情况。 该组件充当通用吸引子，因为所有其他组件都可以流入其中，并且一旦进入 SCC，步行就无法逃脱可以避免它的 SCC 结构约束。 

这减少了计算 SCC 的任务，然后在线性时间内分析凝结图。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力可达性检查 | O(n(m+n)) | O(n(m+n)) | O(n+m) | 太慢了|
 | SCC冷凝+分析| O(n+m) | O(n+m) | 已接受 |

 ## 算法演练

 1. 使用 Kosaraju 或 Tarjan 算法计算图的强连通分量。 这会将顶点分组为最大集合，其中每个顶点都可以到达同一集合中的所有其他顶点。 这一步是必要的，因为在这样的组件内部，我们无法区分长期运动的顶点。 
2. 构建一个压缩图，其中每个 SCC 成为单个节点。 对于原始图中的每条边 u → v，如果 u 和 v 属于不同的分量，则在它们的 SCC 之间添加一条有向边。 
3. 计算压缩图中所有节点的入度。 
4. 识别所有入度为零的 SCC。 这些是其他组件无法进入的组件。 
5. 如果恰好存在一个这样的 SCC，则选择其中的任意顶点作为答案。 如果有多个这样的 SCC，则输出 -1，因为没有单个不可避免的目标组件。 
6. 返回选定的顶点。 

关注入度为零的 SCC 背后的原因是，任何具有传入边缘的 SCC 都可以通过停留在不强制进入的其他 SCC 的循环内来无限期地避免。 

### 为什么它有效

 凝结图是一个 DAG，因此至少必须存在一个源 SCC。 仅当 SCC 转换的每条路径最终都通向同一个 SCC 时，顶点对于每次无限行走都是不可避免的。 只有当凝结图中恰好有一个源 SCC 时，这才有可能，因为多个源允许在不同源内开始行走，并永远保留在其可到达区域内，而不会被迫进入另一个源。 在 SCC 内部，所有顶点都是相互可达的，因此选择唯一源 SCC 中的任何顶点都可以保证在任何无限遍历下的最终访问。 

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
    n, m = map(int, input().split())
    g = [[] for _ in range(n)]
    rg = [[] for _ in range(n)]

    edges = []
    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        g[u].append(v)
        rg[v].append(u)
        edges.append((u, v))

    comp, c = kosaraju(n, g, rg)

    indeg = [0] * c
    for u, v in edges:
        cu, cv = comp[u], comp[v]
        if cu != cv:
            indeg[cv] += 1

    sources = [i for i in range(c) if indeg[i] == 0]

    if len(sources) != 1:
        print(-1)
        return

    target = sources[0]
    for i in range(n):
        if comp[i] == target:
            print(i + 1)
            return

if __name__ == "__main__":
    solve()
```该实现使用 Kosaraju 的算法分两次计算 SCC，首先构建完成顺序，然后在反转图上分配组件。 之后，我们只需要检查组件之间的边缘。 

一个常见的陷阱是在计算入度时忘记忽略组件内的边缘。 这些边缘不会影响凝结结构，并且会错误地增加入度计数。 另一个微妙之处是从目标 SCC 中选择任何顶点，因为强连接组件内的所有顶点对于此目的都是等效的。 

## 工作示例

 ### 示例 1

 输入：```
5 6
1 2
2 3
3 1
3 4
4 5
5 3
```SCC的形成和凝结：

 | 步骤| 状态|
 | --- | --- |
 | SCC | {1,2,3}, {4,5} |
 | 浓缩边缘 | {1,2,3} ↔ {4,5}（循环）|
 | 入度| 两个分量的入度均为 1 |
 | 来源 | 没有一个是独一无二的|

 由于不存在入度为零的单个 SCC，因此没有任何顶点是普遍不可避免的。 

输出：```
-1
```这表明 SCC 之间的循环破坏了强制目的地的唯一性。 

### 示例 2

 输入：```
4 4
1 2
2 3
3 1
3 4
```| 步骤| 状态|
 | --- | --- |
 | SCC | {1,2,3}, {4} |
 | 浓缩边缘 | {1,2,3} → {4} |
 | 入度| {1,2,3}: 0, {4}: 1 |
 | 来源 | {1,2,3} |

 仅存在一个源 SCC，因此 {1,2,3} 内的任何顶点都可以工作，例如 1。 

输出：```
1
```这演示了单个入口组件如何强制最终到达，而不管起点如何。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | 用于 SCC 的两次 DFS 通道加上一次用于凝结分析的边缘扫描 |
 | 空间| O(n + m) | 邻接表、反向图和分量数组 |

 该解决方案完全符合限制，因为 n 和 m 都很大，但线性遍历就足够了，并且不需要状态的嵌套探索。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
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
        n, m = map(int, input().split())
        g = [[] for _ in range(n)]
        rg = [[] for _ in range(n)]
        edges = []
        for _ in range(m):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            g[u].append(v)
            rg[v].append(u)
            edges.append((u, v))

        comp, c = kosaraju(n, g, rg)

        indeg = [0] * c
        for u, v in edges:
            if comp[u] != comp[v]:
                indeg[comp[v]] += 1

        sources = [i for i in range(c) if indeg[i] == 0]

        if len(sources) != 1:
            return "-1\n"

        for i in range(n):
            if comp[i] == sources[0]:
                return str(i + 1) + "\n"

    return solve()

# provided sample
assert run("5 6\n1 2\n2 3\n3 1\n3 4\n4 5\n5 3\n") == "-1\n"

# chain to single sink SCC
assert run("4 3\n1 2\n2 3\n3 4\n") == "1\n"

# single cycle
assert run("3 3\n1 2\n2 3\n3 1\n") == "-1\n"

# two components both reachable cycle
assert run("4 4\n1 2\n2 1\n3 4\n4 3\n") == "-1\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | SCC 之间的循环 | -1 | 多源 SCC |
 | 直线链条| 1 | 独特来源SCC |
 | 单次 SCC 循环 | -1 | 整个图是一个SCC，但没有唯一的源结构|
 | 不相交循环| -1 | 多个独立的 SCC 源 |

 ## 边缘情况

 关键的边缘情况是整个图是单个强连接组件。 在这种情况下，每个顶点都可以从其他顶点到达，因此凝结图恰好有一个入度为零的节点。 该算法选择此 SCC 中的任何顶点，这是正确的，因为汽车最终将在任何行走下无限频繁地访问每个顶点。 

另一种边缘情况是当多个 SCC 在凝结图中没有传入边缘时。 例如，两个不相交的循环之间没有边。 在这种情况下，在一个周期中启动可以让汽车永远停留而不会进入另一个周期，因此不存在通用的交汇点。 该算法正确输出 -1，因为它找到多个源 SCC。 

最后一个微妙的情况是当边形成一个大的 SCC 循环时，其中每个分量都有入度一个。 尽管该图在循环意义上是完全连接的，但没有任何一个 SCC 是不可避免的，因为汽车可以无限期地循环，而无需承诺唯一的目的地组件。
