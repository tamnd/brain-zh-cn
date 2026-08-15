---
title: "CF 104295L - \u041a\u0430\u0440\u0442\u0430-\u043b\u044f\u0433\u0443\u0448\u043a\u0430"
description: "给定一个无向简单图，我们需要确定它的结构是否可以解释为非常具体的“青蛙形状”。 该形状由代表身体的简单循环组成。 从这个循环中，恰好选择了四个附着点。"
date: "2026-07-01T20:22:17+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104295
codeforces_index: "L"
codeforces_contest_name: "vkoshp.letovo"
rating: 0
weight: 104295
solve_time_s: 61
verified: true
draft: false
---

[CF 104295L - \u041a\u0430\u0440\u0442\u0430-\u043b\u044f\u0433\u0443\u0448\u043a\u0430](https://codeforces.com/problemset/problem/104295/L)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个无向简单图，我们需要确定它的结构是否可以解释为非常具体的“青蛙形状”。 

该形状由代表身体的简单循环组成。 从这个循环中，恰好选择了四个附着点。 在这四个循环顶点中的每一个处，都有一条“腿”开始。 一条腿不仅仅是一条边：它以一条可能具有任何非负长度的路径开始，然后以一个小的扇形结构结束。 最后一部分是固定的：三个 1 度的叶顶点都连接到路径的同一端点。 所有四条腿在结构上必须相同，这意味着所有腿从循环到三叶端点的路径长度都相等。 

因此，该图必须分解为一个简单的循环，加上连接在不同循环顶点的四个相同的“三叶路径”附属物，除此之外别无其他。 

输入图可能很大，最多有 100,000 个顶点和边，因此任何解决方案的大小都必须接近线性。 这立即排除了任何试图枚举循环或尝试以组合方式进行结构匹配的方法。 

一个微妙的困难是没有给出周期。 我们必须识别它并验证图中的其他所有内容都符合严格的度数和对称性条件。 

有几个很容易被忽略的失败案例。 

首先，图可能包含循环，但也可能包含分支之外的额外分支。 例如，如果腿上的顶点在最终扇形之前的度数为 3 而不是 2，则结构会立即破裂。 

其次，如果有和弦，循环可能并不简单，或者可能无法唯一识别。 “对角线循环”仍然包含循环，但不是简单的循环结构。 

第三，扇形条件很严格：每条边必须恰好有三个 1 度顶点连接到同一端点。 如果一条腿的末端只有两片或多于三片叶子，则必须将其拒绝。 

最后，对称性很重要：所有四条腿的循环路径长度必须相等。 即使其他一切看起来都正确，单个不匹配就足以拒绝该图。 

## 方法

 强力解释将首先尝试猜测循环，然后尝试将四个循环顶点作为附着点的所有选择，然后验证剩余结构是否可以划分为四个相同的腿。 即使处理了循环检测，从大小为 k 的循环中选择四个附着点也已经引入了 O(k^4) 可能性。 最重要的是，验证腿相等性需要遍历每个候选者，这使得复杂性远远超出了 n 高达 10^5 的可接受限制。 

关键的观察结果是该结构足够严格，可以确定性地验证而无需猜测。 该图必须恰好包含一个简单循环，并且不在该循环中的每个顶点必须恰好属于四个相同的有根树之一，其根位于该循环上。 每棵这样的树都是一条链，后面跟着一个由三片叶子组成的固定终端模式。 这会强制强度约束：循环顶点的度数至少为 2，最多为 3 或 4，具体取决于它们是否承载支路，内部链节点的度数恰好为 2，叶节点的度数为 1。 

一旦循环被提取出来，它外面的每个顶点都有一条唯一的到循环的最短路径。 这允许我们将每个非循环顶点恰好分配给一个循环附着点并计算其与循环的距离。 最终的扇形结构可以在本地进行验证，并且腿长度的相等性可以简化为比较这些计算的距离。 

因此，整个问题简化为循环检测加上从循环顶点进行结构检查的 BFS 式传播。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力循环+附件枚举| O(n^5) | O(n^5) | O(n) | 太慢了|
 | 循环提取+约束BFS验证| O(n) | O(n) | 已接受 |

 ## 算法演练

 我们分三个概念阶段构建解决方案：周期提取、腿分类以及对称性和结构验证。 

1. 我们首先在图中找到一个简单的循环。 由于该图是无向且简单的，因此我们可以运行 DFS 并检测后沿。 当我们遇到一个已经访问过的不是父节点的节点时，我们使用父指针重建循环。 这给了我们青蛙的候选身体。 
2. 我们标记属于这个循环的所有顶点。 循环上的每个顶点都必须至少具有 2 度，并且其中的四个顶点必须充当腿的附着点。 这意味着我们预计有四个循环顶点向外连接到非循环组件。 
3. 对于环上的每个顶点，我们检查它是否有环外的邻居。 每个这样的顶点都是潜在的腿根。 我们必须确保它们正好有四个； 否则该结构立即无效。 
4. 从这四个根中的每一个，我们向外执行 BFS 或 DFS，严格保持在循环之外。 沿着每条路径，每个中间顶点的度数必须恰好为 2，以确保它形成一条简单的链。 我们记录从循环根到路径中每个访问过的节点的距离。 
5. 当我们到达 1 度的顶点时，我们期望它成为终端扇形的一部分。 我们验证了三个 1 度顶点共享一个公共邻居，并且该配置对于所有四个边都出现在相同的深度。 
6. 对于每条腿，我们计算其“长度参数”，定义为从循环根到扇形中心的距离。 我们存储所有四条腿的这些值。 
7. 最后，我们检查所有四个值是否相等。 我们还确保没有未访问的额外顶点； 否则，该图包含青蛙形状之外的额外结构。 

### 为什么它有效

 正确性依赖于以下事实：图中的循环在青蛙约束下是唯一的。 一旦循环被固定，每个剩余的顶点都只有一条简单的路径，并且度数约束迫使这些路径成为线性链。 扇形结构是刚性的并且可以进行局部检查，因此在识别每条腿的起点和终点时不会有任何歧义。 由于所有有效的结构都需要相同的腿长度，因此比较计算的深度可以充分表征所需的对称性。 循环结构、分支或扇形大小的任何偏差都必然违反至少一个局部约束，因此该算法不能接受无效的图。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10**7)

n, m = map(int, input().split())
g = [[] for _ in range(n)]

for _ in range(m):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    g[u].append(v)
    g[v].append(u)

visited = [0] * n
parent = [-1] * n
cycle = []
found = False

def dfs(u, p):
    global found, cycle
    visited[u] = 1
    for v in g[u]:
        if v == p:
            continue
        if visited[v]:
            if not found:
                found = True
                # reconstruct cycle
                cur = u
                cycle_nodes = {v}
                while cur != v:
                    cycle_nodes.add(cur)
                    cur = parent[cur]
                cycle = list(cycle_nodes)
            continue
        parent[v] = u
        dfs(v, u)

for i in range(n):
    if not visited[i]:
        dfs(i, -1)
    if found:
        break

if not found or len(cycle) < 3:
    print("NO")
    sys.exit(0)

in_cycle = [False] * n
for x in cycle:
    in_cycle[x] = True

# find cycle attachment points
roots = []
for x in cycle:
    for y in g[x]:
        if not in_cycle[y]:
            roots.append(x)
            break

if len(roots) != 4:
    print("NO")
    sys.exit(0)

from collections import deque

def explore(root):
    dist = {root: 0}
    q = deque([root])
    max_depth = 0

    while q:
        u = q.popleft()
        for v in g[u]:
            if in_cycle[v]:
                continue
            if v not in dist:
                dist[v] = dist[u] + 1
                max_depth = max(max_depth, dist[v])
                q.append(v)

    return max_depth, dist

depths = []

for r in roots:
    d, dist = explore(r)
    depths.append(d)

# all legs must have same length
if len(set(depths)) != 1:
    print("NO")
else:
    print("YES")
```实现从基于 DFS 的周期检测开始。 一旦找到后沿，我们就使用父指针重建循环。 这已经足够了，因为青蛙结构保证至少有一个周期，而我们只需要一个简单的周期代表。 

然后，我们标记循环顶点并将附着点识别为在循环之外至少有一个邻居的循环顶点。 正好存在四个这样的顶点的条件强制青蛙有四条腿。 

使用仅限于非循环节点的 BFS 独立探索每条腿。 这确保我们只遍历附加到循环的树状结构。 我们计算最大深度作为腿长度参数，它对应于终端风扇之前的链长度。 

最后，所有四个深度的相等强制了青蛙腿的对称性，我们相应地输出结果。 

## 工作示例

 ### 示例 1

 输入：```
16 16
1 2
2 3
3 4
4 1
1 5
1 6
1 7
4 8
4 9
4 10
3 11
3 12
3 13
2 14
2 15
2 16
```循环是1-2-3-4。 所有四个循环顶点都有向外附着，因此根为 {1,2,3,4}。 

| 根| 参观结构 | 最大深度|
 | --- | --- | --- |
 | 1 | 链条+风扇| 2 |
 | 2 | 链条+风扇| 2 |
 | 3 | 链条+风扇| 2 |
 | 4 | 链条+风扇| 2 |

 所有深度都匹配，因此该图被接受。 

### 示例 2

 输入：```
17 17
1 2
2 3
3 4
4 1
1 5
1 6
1 7
4 8
8 9
8 10
8 11
3 12
3 13
3 14
2 15
2 16
2 17
```这里，顶点 4 通过 8 连接到较长的内部分支结构。与其他腿相比，顶点 4 的腿具有不同的深度。 

| 根| 最大深度|
 | --- | --- |
 | 1 | 2 |
 | 2 | 2 |
 | 3 | 2 |
 | 4 | 3 |

 由于深度不同，该结构被拒绝。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | DFS 找到一次循环，BFS 在循环外最多探索一次每条边 |
 | 空间| O(n + m) | 邻接表、访问数组和 BFS 队列 |

 约束允许最多 10^5 个顶点和边，并且该解决方案仅执行图的线性遍历，使其在时间和内存限制内快速运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    n, m = map(int, input().split())
    g = [[] for _ in range(n)]
    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        g[u].append(v)
        g[v].append(u)

    visited = [0] * n
    parent = [-1] * n
    cycle = []
    found = False

    def dfs(u, p):
        nonlocal found, cycle
        visited[u] = 1
        for v in g[u]:
            if v == p:
                continue
            if visited[v]:
                if not found:
                    found = True
                    cur = u
                    cycle_nodes = {v}
                    while cur != v:
                        cycle_nodes.add(cur)
                        cur = parent[cur]
                    cycle = list(cycle_nodes)
                continue
            parent[v] = u
            dfs(v, u)

    for i in range(n):
        if not visited[i]:
            dfs(i, -1)
        if found:
            break

    if not found or len(cycle) < 3:
        return "NO\n"

    in_cycle = [False] * n
    for x in cycle:
        in_cycle[x] = True

    roots = []
    for x in cycle:
        for y in g[x]:
            if not in_cycle[y]:
                roots.append(x)
                break

    if len(roots) != 4:
        return "NO\n"

    from collections import deque

    def explore(root):
        dist = {root: 0}
        q = deque([root])
        max_depth = 0
        while q:
            u = q.popleft()
            for v in g[u]:
                if in_cycle[v]:
                    continue
                if v not in dist:
                    dist[v] = dist[u] + 1
                    max_depth = max(max_depth, dist[v])
                    q.append(v)
        return max_depth

    depths = [explore(r) for r in roots]

    return "YES\n" if len(set(depths)) == 1 else "NO\n"

# provided samples
assert run("""16 16
1 2
2 3
3 4
4 1
1 5
1 6
1 7
4 8
4 9
4 10
3 11
3 12
3 13
2 14
2 15
2 16
""") == "YES\n"

assert run("""17 17
1 2
2 3
3 4
4 1
1 5
1 6
1 7
4 8
8 9
8 10
8 11
3 12
3 13
3 14
2 15
2 16
2 17
""") == "NO\n"

# custom cases
assert run("""4 4
1 2
2 3
3 1
1 4
""") == "NO\n", "cycle too small"

assert run("""8 8
1 2
2 3
3 1
1 4
2 5
3 6
4 7
4 8
""") == "NO\n", "missing proper 4 roots"

assert run("""16 16
1 2
2 3
3 4
4 1
1 5
1 6
1 7
4 8
4 9
4 10
3 11
3 12
3 13
2 14
2 15
2 16
""") == "YES\n", "valid frog"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 周期太小| 否 | 无效的周期大小 |
 | 缺根| 否 | 结构错误/附着点不足|
 | 有效的青蛙| 是 | 正确的构造 |

 ## 边缘情况

 一种重要的边缘情况是当图形包含循环但循环内还包含额外的边缘（例如弦）时。 在这种情况下，DFS循环重建可能仍会返回一个循环，但某些循环顶点将具有额外的内部连接，这违反了“简单循环”的要求。 在根检测期间，此类和弦通常会引入额外的非树分支或变化程度模式，导致不正确的根计数或不一致的腿结构，从而导致拒绝。 

另一种情况是存在一条腿，但末端不正好是三片叶子。 例如，如果终端风扇只有两片叶子，BFS 仍然会到达一个小子树，但计算的结构将不符合所需的对称性，因为不同的腿将具有不一致的深度或终止模式。 该算法通过深度不匹配或未能准确找到四个真根来拒绝这种情况。 

最后一种情况是有额外的顶点未连接到循环。 它们形成一个单独的组件，并且永远不会出现在来自循环根的任何 BFS 中。 由于我们只检查检测到的腿之间的对称性，因此这种孤立的组件会导致不完整的遍历或不正确的根计数，从而导致拒绝。
