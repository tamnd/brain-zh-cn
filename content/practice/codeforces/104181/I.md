---
title: "CF 104181I - 雨天送货"
description: "我们得到一个有向图，其中每个节点代表一个朋友的房子，每个有向边代表一条单向路。 您可以选择任何起始房屋，然后沿着定向道路重复行驶，可能会多次重新访问房屋和道路。"
date: "2026-07-02T00:39:58+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104181
codeforces_index: "I"
codeforces_contest_name: "UTPC Contest 02-10-23 Div. 1 (Advanced)"
rating: 0
weight: 104181
solve_time_s: 66
verified: true
draft: false
---

[CF 104181I - 雨天送货](https://codeforces.com/problemset/problem/104181/I)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个有向图，其中每个节点代表一个朋友的房子，每个有向边代表一条单向路。 您可以选择任何起始房屋，然后沿着定向道路重复行驶，可能会多次重新访问房屋和道路。 

我们的目标是最大限度地增加您在这条步行路线上可以参观的不同房屋的数量。 由于允许重访，但只计算唯一的房屋，因此问题减少为寻找起始节点和覆盖尽可能多的不同可到达节点的定向步行。 

一个关键的观察是，一旦进入有向循环，您就可以留在该循环内并无限期地遍历它，这意味着该循环中的所有节点都可以相互访问。 从任何节点，通过有向路径可到达的所有节点实际上都是同一可达闭包的一部分，但循环压缩了此结构。 

就节点而言，约束很小，最多 1000 个，边稀疏，最多 2N 条边。 这强烈表明 O(N^2) 或 O(NM) 方法是可以接受的，而枚举所有路径或节点子集之类的方法则不可接受。 

一个天真的解释是尝试每个起始节点并执行 DFS/BFS 计算可达节点。 这在许多情况下已经给出了正确的答案，但它错过了一个重要的微妙之处：因为循环允许重新访问，并且因为可达性是通过强连接的组件传递的，所以真正的结构是 SCC 的 DAG。 如果不仔细考虑 SCC 结构，答案取决于该凝聚图中的最长可达性，而不仅仅是局部 BFS 计数。 

一个常见的错误是将图视​​为来自每个节点的简单可达性是独立的，但在循环图中，天真的可达性会重复计算或无法利用整个 SCC 表现为单个单元。 

边缘情况包括：

 单个定向循环，例如 1 → 2 → 3 → 1。任何开始都应给出答案 3，而不是 1 或 2。 

例如 1 → 2 → 3 的链。从 1 开始产生 3，但从 3 开始只产生 1。答案是 3。 

如果忽略 SCC 压缩，具有分支和合并路径（其中多个 SCC 路径汇聚）的图可能会导致天真的贪婪遍历计数不足或计数过多。 

## 方法

 暴力破解的想法很简单：对于每个节点，运行 BFS 或 DFS 并计算可访问的节点数量。 答案是所有起始节点的最大值。 这是正确的，因为每个有效的步行都保持在其起点的可达集合内，并且重新访问不会将集合增加到超出可达范围之外。 

然而，这种方法假设可达性独立于路径重用结构。 在密集图或具有许多重叠路径的图中，这仍然有效，但如果我们尝试使用额外状态以简单的方式重复重新计算可达性，则会变得低效。 最坏的情况是 O(N(N + M))，大约是 10^6 次操作，仍然处于临界状态，但可以接受。 

更深层次的问题是理解 SCC 形成真正的原子单元。 在强连接组件内部，所有节点都是相互可达的，因此内部的任何节点都可以到达整个组件。 一旦构建了 SCC，该图就变成了 DAG。 该任务简化为找到从此 DAG 中的任何 SCC 可到达的最大节点数，这成为按组件大小加权的 DAG 节点上的最长路径。 

这一观察减少了冗余探索并给出了干净的动态编程结构。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 来自每个节点的强力 DFS/BFS | O(N(N+M)) | O(N(N+M)) | O(N+M) | 最坏情况下太慢 |
 | SCC 冷凝 + DAG 上的 DP | O(N+M) | O(N+M) | 已接受 |

 ## 算法演练

 ## 1. 计算强连通分量

我们首先使用 Kosaraju 或 Tarjan 将图分解为 SCC。 原因是在 SCC 内部，每个节点都是相互可达的，因此它们在收集好友方面表现为一个整体。 

## 2. 构建压缩图

 我们将每个 SCC 压缩为单个节点。 对于原始图中的每条边 u → v，如果 u 和 v 属于不同的 SCC，我们在它们的分量之间添加一条有向边。 这会产生 DAG，因为 SCC 冷凝消除了循环。 

## 3. 为组件分配权重

 每个 SCC 节点的权重等于其内部原始节点的数量。 这反映了如果我们进入该组件，我们会自动收集多少朋友。 

## 4.计算DAG上的可达性DP

 我们计算每个组件可达到的最大权重总和。 由于图是 DAG，我们可以按拓扑顺序处理节点或使用记忆 DFS。 对于每个组件，其值是其自身权重加上所有传出邻居中最好的权重。 

## 5.采取最佳起点

 我们尝试每个组件作为起点并取最大 DP 值。 

### 为什么它有效

 关键的不变量是 SCC 压缩以一对一的方式保留可达性：原始图中的任何路径都对应于 SCC DAG 中的路径，并且 SCC 内的任何行走都不会增加超出该 SCC 的可达组件集。 因此，最大化访问的不同节点相当于选择起始 SCC 并最大化 DAG 中可达节点的总权重。 由于 DAG 路径不形成循环，因此 DP 可以正确累积最佳可达总和，而无需重复计算。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**7)

def solve():
    n, m = map(int, input().split())
    g = [[] for _ in range(n)]
    gr = [[] for _ in range(n)]
    
    for _ in range(m):
        a, b = map(int, input().split())
        a -= 1
        b -= 1
        g[a].append(b)
        gr[b].append(a)

    # Kosaraju: first pass order
    vis = [False] * n
    order = []

    def dfs1(u):
        vis[u] = True
        for v in g[u]:
            if not vis[v]:
                dfs1(v)
        order.append(u)

    for i in range(n):
        if not vis[i]:
            dfs1(i)

    # second pass assign components
    comp = [-1] * n
    comps = []

    def dfs2(u, cid):
        comp[u] = cid
        comps[cid].append(u)
        for v in gr[u]:
            if comp[v] == -1:
                dfs2(v, cid)

    for u in reversed(order):
        if comp[u] == -1:
            comps.append([])
            dfs2(u, len(comps) - 1)

    k = len(comps)

    # build condensed graph
    dag = [set() for _ in range(k)]
    weight = [0] * k

    for cid in range(k):
        weight[cid] = len(comps[cid])
        for u in comps[cid]:
            for v in g[u]:
                if comp[v] != cid:
                    dag[cid].add(comp[v])

    dag = [list(s) for s in dag]

    # DP on DAG
    dp = [-1] * k
    vis_dp = [False] * k

    def dfs(u):
        if vis_dp[u]:
            return dp[u]
        vis_dp[u] = True
        best = 0
        for v in dag[u]:
            best = max(best, dfs(v))
        dp[u] = weight[u] + best
        return dp[u]

    ans = 0
    for i in range(k):
        ans = max(ans, dfs(i))

    print(ans)

if __name__ == "__main__":
    solve()
```该解决方案首先构建原始图及其反向图，这是 Kosaraju 算法所需的。 第一个 DFS 计算完成顺序，确保以尊重图的出口结构的方式处理节点。 

第二个 DFS 在反转图上分配组件 ID，对可相互访问的节点进行分组。 每个组件都被显式存储，因此我们可以计算其大小和传出边缘。 

压缩步骤对每个组件使用一组以避免重复边缘，这很重要，因为多个原始边缘可能会折叠成相同的 SCC 转换。 然后，DP 步骤使用记忆 DFS 计算每个 SCC 的最佳可达总和。 

一个微妙的细节是递归深度； 由于深度高达 1000 个节点以及可能更深的 DFS 链，Python 需要增加递归限制。 

## 工作示例

 ### 示例 1

 输入：```
3 2
1 2
2 3
```这里所有节点形成一个没有环的简单链。 

| 步骤| SCC 作业 | 浓缩图| DP值|
 | ---| ---| ---| ---|
 | 1 | {1}、{2}、{3} | 1→2→3 | 自下而上计算|
 | 2 | 每个节点大小 1 | 同一条链 | dp[3]=1 | dp[3]=1 |
 | 3 | | | dp[2]=2 | dp[2]=2
 | 4 | | | dp[1]=3 | dp[1]=3 |

 这表明可达性沿着链线性累积。 

### 示例 2

 输入：```
3 1
1 2
```| 步骤| SCC 作业 | 浓缩图| DP值|
 | ---| ---| ---| ---|
 | 1 | {1}、{2}、{3} | 1→2 | dp[2]=1 | dp[2]=1 |
 | 2 | | | dp[1]=2 | dp[1]=2 |
 | 3 | | | 节点 3 隔离 = 1 |

 最好的起点是节点 1 给出 2。 

这些示例证实 DP 正确聚合了可达组件。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N + M) | Kosaraju 以线性时间运行，SCC DAG 构建和 DP 也是线性的 |
 | 空间| O(N + M) | 邻接表、组件存储和 DP 阵列 |

 约束最多允许大约 2000 个边，因此线性图处理在 5 秒内很容易足够快。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    n, m = map(int, sys.stdin.readline().split())
    g = [[] for _ in range(n)]
    gr = [[] for _ in range(n)]
    for _ in range(m):
        a, b = map(int, sys.stdin.readline().split())
        a -= 1
        b -= 1
        g[a].append(b)
        gr[b].append(a)

    sys.setrecursionlimit(10**7)

    vis = [False] * n
    order = []

    def dfs1(u):
        vis[u] = True
        for v in g[u]:
            if not vis[v]:
                dfs1(v)
        order.append(u)

    for i in range(n):
        if not vis[i]:
            dfs1(i)

    comp = [-1] * n
    comps = []

    def dfs2(u, cid):
        comp[u] = cid
        comps[cid].append(u)
        for v in gr[u]:
            if comp[v] == -1:
                dfs2(v, cid)

    for u in reversed(order):
        if comp[u] == -1:
            comps.append([])
            dfs2(u, len(comps) - 1)

    k = len(comps)
    dag = [set() for _ in range(k)]
    weight = [len(c) for c in comps]

    for cid in range(k):
        for u in comps[cid]:
            for v in g[u]:
                if comp[v] != cid:
                    dag[cid].add(comp[v])

    dag = [list(s) for s in dag]

    from functools import lru_cache

    @lru_cache(None)
    def dfs(u):
        best = 0
        for v in dag[u]:
            best = max(best, dfs(v))
        return weight[u] + best

    ans = 0
    for i in range(k):
        ans = max(ans, dfs(i))
    return str(ans) + "\n"

# provided samples
assert run("3 2\n1 2\n2 3\n") == "3\n", "sample 1"
assert run("3 1\n1 2\n") == "2\n", "sample 2"
assert run("5 5\n3 5\n3 2\n2 3\n4 5\n5 1\n") == "4\n", "sample 3"

# custom cases
assert run("1 0\n") == "1\n", "single node"
assert run("3 3\n1 2\n2 3\n3 1\n") == "3\n", "single cycle"
assert run("4 3\n1 2\n2 3\n3 4\n") == "4\n", "chain"
assert run("4 2\n1 2\n3 4\n") == "2\n", "disconnected components"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单节点 | 1 | 最小图形处理|
 | 单周期| 3 | SCC 崩溃正确性 |
 | 链条| 4 | 线性可达性累积|
 | 断开的组件| 2 | 正确处理独立子图 |

 ## 边缘情况

 单个强连接循环，例如`1 → 2 → 3 → 1`通过将所有节点分组到一个 SCC 来处理。 在压缩过程中，这成为权重为 3 的单个节点，没有传出边缘，并且无论起点如何，DP 都会立即返回 3。 

纯线性图，例如`1 → 2 → 3 → 4`产生四个尺寸为 1 的 SCC。 DAG 成为一条链，DP 从尾部向后正确累加，确保最大起始节点为链头，得到 4。 

断开连接的图，例如`1 → 2`和`3 → 4`结果产生两个独立的 DAG 组件。 由于 DP 是在所有 SCC 根上评估的，因此最大值正确地选择了较大的可达段，在本例中为 2。
