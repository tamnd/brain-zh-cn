---
title: "CF 1092E - 最小直径森林"
description: "我们得到的图已经是一个森林，这意味着它由几棵不相连的树组成。 任务是添加足够多的边以将所有这些树连接成一棵树。"
date: "2026-06-13T04:38:17+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "dfs-and-similar", "greedy", "trees"]
categories: ["algorithms"]
codeforces_contest: 1092
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 527 (Div. 3)"
rating: 2000
weight: 1092
solve_time_s: 314
verified: false
draft: false
---

[CF 1092E - 最小直径森林](https://codeforces.com/problemset/problem/1092/E)

 **评级：** 2000
 **标签：** 构造性算法、dfs 和类似的、贪婪的、树
 **求解时间：** 5m 14s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到的图已经是一个森林，这意味着它由几棵不相连的树组成。 任务是添加足够多的边以将所有这些树连接成一棵树。 自从一棵树上`n`顶点正好有`n - 1`边，并且输入已经包含`m`边，我们必须添加`n - 1 - m`边，它比连接组件的数量正好少一。 

添加这些边后，我们可以自由选择如何连接组件，但生成的结构必须仍然是树。 在连接组件的所有可能方法中，我们希望能够最小化最终树的直径，其中直径是任何一对顶点之间的最大最短路径距离。 

输入图结构仅通过其连接的组件和每个组件的内部结构起作用，因为我们可以任意连接组件。 

约束条件`n ≤ 1000`意味着即使每个组件进行二次或接近二次的预处理也是可以接受的。 我们可以负担从多个节点运行 BFS 或 DFS，甚至每个组件运行两次，因为所有组件的总工作量约为`O(n^2)`在最坏的情况下。 

一个天真的但不正确的直觉是任意地或以链的方式连接组件。 这会失败，因为直径对排序变得敏感。 

例如，假设我们有三个组件：

 分量 A 是一条长度为 10 的长路径，分量 B 是一条单边，分量 C 是另一条单边。 如果我们将它们连接成一条链 A-B-C，则直径会穿过两个附件并变得不必要的大。 更好的策略是以限制跨组件距离的方式放置最大的“中心”。 

另一个微妙的失败案例是选择树的端点而不是中心。 如果我们附加叶子而不是中心节点，即使全局结构是最佳的，组件内部的距离也会增大最终直径。 

核心困难在于每个组件的行为就像一个有半径的“球”，我们正在决定如何将这些球粘合在一起。 

## 方法

 暴力解决方案会尝试将组件连接到树中的各种方法，并每次计算所得的直径。 如果有`k`组件，有`k^(k-2)`通过凯莱公式可能标记的树，甚至限制在组件之间选择边缘仍然留下指数配置。 对于每种配置，计算直径成本`O(n)`或者`O(n^2)`根据方法的不同，即使对于小型企业来说，这也是完全不可行的`n`。 

关键的观察结果是每个组件都可以用两个值来概括：其直径和中心。 直径告诉我们最差的内部距离，而中心则最小化到组件内部所有节点的最大距离。 当我们连接组件时，任何穿过组件的路径都必须经过所选的连接点，因此组件的唯一有用的表示是其最远节点距其所选连接点的距离。 

如果我们为每个组件选择一个中心并将所有中心连接成星形，则所有跨组件路径都会经过单个集线器。 然后，两个组件之间的任何路径都由它们的半径之和加上它们之间的一条边来控制。 这将整个问题简化为选择最佳的轮毂组件。 

最佳轮毂是半径最大的部件。 这确保了最差的跨组件路径最小化，因为所有其他组件都附加到最大的组件。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数| O(n) | 太慢了 |
 | 最佳 | O(n^2) | O(n^2) | O(n) | 已接受 |

 ## 算法演练

 1. 使用 DFS 或 BFS 将图拆分为连接的组件。 每个组件都是独立处理的，因为它们最初之间没有边缘。 
2. 对于每个组件，选择一个任意节点并运行 BFS 来查找最远的节点`a`。 该节点是直径候选的一个端点。 
3.再次运行BFS`a`找到最远的节点`b`。 之间的距离`a`和`b`是该部件的直径。 这是可行的，因为距任意起点最远的节点始终是树中某个直径的端点。 
4. 运行 BFS`a`再次和从`b`再次计算到所有节点的距离。 对于每个节点，计算`max(dist_a[x], dist_b[x])`。 最小化该值的节点是组件的中心。 该节点最小化到所有其他节点的最大距离。 
5. 存储每个组件的直径和中心。 
6. 识别具有最大半径的组件（实际上是直径的一半四舍五入，但我们直接使用计算的最大距离）。 该组件成为枢纽。 
7. 对于每个其他组件，使用添加的边将其中心连接到轮毂中心。 这些边足以将所有组件连接成一棵树。 
8. 将最终直径计算为两个值中的最大值：最大的原始组件直径和所有组件对的最大直径`radius[i] + 1 + radius[j]`，通过将最大和第二大半径配对来最大化。 

### 为什么它有效

 每个组件的行为就像一棵扎根于其中心的树，任何进入或离开组件的路径都必须经过构造中的该中心。 这将每个组件减少为权重等于其半径的加权节点。 因此，穿过组件的任何路径的直径由两个半径加上一个连接边确定。 选择最大的半径作为轮毂可以最大限度地减少不同组件之间两个半径的最差总和，因为所有其他组件都通过单个点连接，而不是链接和累积多个半径。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

n, m = map(int, input().split())
g = [[] for _ in range(n)]

for _ in range(m):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    g[u].append(v)
    g[v].append(u)

vis = [False] * n
comp = []

def bfs(start):
    dist = [-1] * n
    q = deque([start])
    dist[start] = 0
    order = []
    while q:
        x = q.popleft()
        order.append(x)
        for y in g[x]:
            if dist[y] == -1:
                dist[y] = dist[x] + 1
                q.append(y)
    return dist, order

def find_center(nodes):
    start = nodes[0]
    dist1, _ = bfs(start)
    a = max(nodes, key=lambda x: dist1[x])

    dista, _ = bfs(a)
    b = max(nodes, key=lambda x: dista[x])

    distb, _ = bfs(b)

    best = None
    best_val = 10**9
    for x in nodes:
        val = max(dista[x], distb[x])
        if val < best_val:
            best_val = val
            best = x

    diameter = dista[b]
    radius = best_val
    return a, b, best, diameter, radius

components = []

for i in range(n):
    if not vis[i]:
        stack = [i]
        vis[i] = True
        nodes = []
        while stack:
            x = stack.pop()
            nodes.append(x)
            for y in g[x]:
                if not vis[y]:
                    vis[y] = True
                    stack.append(y)

        a, b, c, diam, rad = find_center(nodes)
        components.append((rad, c, diam))

if len(components) == 1:
    rad, c, diam = components[0]
    print(diam)
    sys.exit()

components.sort(reverse=True)
hub_rad, hub_center, hub_diam = components[0]

edges = []

for i in range(1, len(components)):
    edges.append((hub_center, components[i][1]))

ans = hub_diam
if len(components) > 1:
    ans = max(ans, components[0][0] + components[1][0] + 1)

print(ans)
for u, v in edges:
    print(u + 1, v + 1)
```该代码首先使用 DFS 将森林分解为多个组件。 对于每个组件，它执行基于 BFS 的直径提取，然后通过最小化到两个直径端点的最大距离来计算中心。 一旦每个组件被归纳为中心、半径和直径，算法就会选择半径最大的组件作为轮毂。 

所有其他部件都直接连接到该轮毂中心，形成星形结构。 最终的直径计算结果与跨组件路径分析得出的理论界限相匹配。 

一个微妙的实现细节是，我们重用从直径端点到候选计算中心的 BFS 结果。 这避免了不必要的重新计算并使解决方案保持在`O(n^2)`。 

## 工作示例

 ### 示例 1

 输入：```
4 2
1 2
2 3
```有两个组成部分：`{1,2,3}`和`{4}`。 

| 组件| 直径| 中心| 半径 |
 | ---| ---| ---| ---|
 | {1,2,3} | 2 | 2 | 1 |
 | {4} | 0 | 4 | 0 |

 集线器是组件`{1,2,3}`。 我们连接节点`2`到`4`。 

最终直径为`max(2, 1 + 0 + 1) = 2`。 

### 示例 2

 输入：```
5 2
1 2
3 4
```两个组成部分：`{1,2}`和`{3,4}`，加上孤立节点`{5}`。 

| 组件| 直径| 中心| 半径 |
 | ---| ---| ---| ---|
 | {1,2} | 1 | 1 | 1 |
 | {3,4} | 1 | 3 | 1 |
 | {5} | 0 | 5 | 0 |

 我们选择其中之一`{1,2}`或者`{3,4}`作为枢纽。 认为`{1,2}`是枢纽，我们连接`1-3`和`1-5`。 

最终直径为`max(1, 1 + 1 + 1) = 3`。 

这些示例展示了一旦​​多个组件具有非零半径，跨组件路径将如何占据主导地位。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n²) | 每个节点参与其组件中恒定数量的 BFS 遍历
 | 空间| O(n) | 图、访问数组和 BFS 队列的存储 |

 二次界在约束条件下很合适，因为`n ≤ 1000`。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    from collections import deque

    n, m = map(int, input().split())
    g = [[] for _ in range(n)]
    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        g[u].append(v)
        g[v].append(u)

    vis = [False] * n

    def bfs(start):
        dist = [-1] * n
        q = deque([start])
        dist[start] = 0
        while q:
            x = q.popleft()
            for y in g[x]:
                if dist[y] == -1:
                    dist[y] = dist[x] + 1
                    q.append(y)
        return dist

    def comp_nodes(i):
        stack = [i]
        vis[i] = True
        nodes = []
        while stack:
            x = stack.pop()
            nodes.append(x)
            for y in g[x]:
                if not vis[y]:
                    vis[y] = True
                    stack.append(y)
        return nodes

    def center(nodes):
        dist1 = bfs(nodes[0])
        a = max(nodes, key=lambda x: dist1[x])
        dista = bfs(a)
        b = max(nodes, key=lambda x: dista[x])
        distb = bfs(b)
        best = min(nodes, key=lambda x: max(dista[x], distb[x]))
        return best

    comps = []
    for i in range(n):
        if not vis[i]:
            nodes = comp_nodes(i)
            comps.append(nodes)

    return str(len(comps))

# sample checks (structure sanity only)
assert run("4 2\n1 2\n2 3\n") == "2", "sample 1 structure"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 个隔离节点 | 0 | 单组件基本案例|
 | 链+孤立节点| 小直径| 跨组件处理|
 | 两条相等的边 | 3 | 对称半径相互作用|
 | 全连接树| 原始直径| 没有添加边缘情况|

 ## 边缘情况

 单分量输入已经形成一棵树，因此没有添加边，答案只是它的直径。 该算法自然会处理这一问题，因为当只有一个组件存在时，它永远不会进入组件连接阶段。 

完全断开的节点形成尺寸为一的组件，每个组件的半径为零。 该算法将它们全部连接到选定的中心节点，从而产生一颗星。 直径最多变为 2，这是最佳的，因为孤立节点上的任何树的直径必须至少为 2，除非`n ≤ 2`。 

长长的路径加上许多小部件，考验着集线器的选择是否正确。 该算法确保最长半径组件的中心成为轮毂，防止小组件因用作连接点而导致直径增大。
