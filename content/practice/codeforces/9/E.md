---
title: "CF 9E - 有趣的图表和苹果"
description: "我们从无向多重图开始。 允许多条边，也允许循环。 我们可能会添加新的边，目标是将图转换成非常具体的结构。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dsu", "graphs"]
categories: ["algorithms"]
codeforces_contest: 9
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 9 (Div. 2 Only)"
rating: 2300
weight: 9
solve_time_s: 108
verified: true
draft: false
---
[CF 9E - 有趣的图表和苹果](https://codeforces.com/problemset/problem/9/E)

 **评分：** 2300
 **标签：** dfs 和类似、dsu、图表
 **求解时间：** 1m 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从无向多重图开始。 允许多条边，也允许循环。 我们可能会添加新的边，目标是将图转换成非常具体的结构。 

当每个顶点都属于一个循环时，图被称为有趣图。 由于允许连接组件，因此每个连接组件必须看起来像一个简单的循环，如果它是一个循环，则长度可能为一。 

同一件事的另一种说法是每个连通分量都必须是单环的。 不允许存在一棵树，因为某些顶点不属于任何循环，并且不允许具有两个不同循环的组件，因为重叠上的顶点将属于多个循环。 

我们被要求添加尽可能少的边。 在所有最佳答案中，我们必须输出按字典顺序排列的最小添加边集。 

该图最多有 50 个顶点，但最多有 2500 个边，因为允许存在多个边和循环。 的小值`n`意味着偶数`O(n^3)`或者`O(n^4)`解决方案是完全安全的。 更困难的部分不是性能，而是对结构和字典最小性的推理。 

棘手的部分是了解哪些配置已经不可能。 

假设一个连通分量已经包含两个不同的循环。 那么无论添加多少边都无法解决这个问题，因为我们只允许添加边，而不能删除它们。 例如：```
4 4
1 2
2 3
3 1
3 4
```顶点`1,2,3`已经形成一个循环。 顶点`4`作为树节点附加。 这个组件仍然有效，因为我们可以添加边缘`(4,4)`然后每个顶点都属于一个循环。 

现在比较：```
4 5
1 2
2 3
3 1
2 4
4 3
```该组件已经包含两个周期：`1-2-3-1`和`2-4-3-2`。 

没有添加的边可以消除这种重叠，所以正确的答案是`NO`。 

循环也需要小心。 循环已算作仅涉及该顶点的循环。 如果具有循环的顶点参与任何其他循环，则该图立即失效。 例如：```
2 2
1 1
1 2
```该图仍然可以修复。 我们可以添加`(2,2)`。 

但：```
2 3
1 1
1 2
2 1
```包含两个循环`1`和周期`1-2-1`，所以顶点`1`属于两个周期。 答案是`NO`。 

另一个微妙的情况是平行边缘。 之间的两条平行边`u`和`v`形成长度为二的循环。 例如：```
2 2
1 2
1 2
```已经是一个有趣的图表了。 每个顶点恰好属于一个循环。 

粗心的 DFS 假设简单的图会错过这一点。 

最后，字典顺序在全球范围内都很重要，而不是逐边独立地重要。 如果存在两种不同的最佳结构，我们必须更喜欢端点的扁平序列按字典顺序更小的结构。 

## 方法

 暴力方法将尝试所有可能的添加边集，并检查结果图是否变得有趣。 由于有`n(n+1)/2`可能的边包括循环，甚至对于`n = 50`搜索空间是天文数字。 穷举搜索是完全不可能的。 

第一个有用的观察是结构性的。 在连接的组件中`v`顶点和`e`边，独立循环的数量等于：```
e - v + 1
```对于一个有趣的组件，每个顶点必须恰好属于一个循环。 这意味着该组件必须恰好包含一个循环，因为两个不同的循环将迫使某个顶点属于多个循环或创建断开的循环区域。 

因此每个连接的组件必须满足：```
e = v
```连接的组件`e = v - 1`是一棵树。 它还不包含环，但我们可以通过添加一条边来创建恰好一个环。 

连接的组件`e > v`已经至少有两个循环，因此不可能永远存在，因为无法删除边缘。 

这将问题变得简单得多。 

每个组件都属于以下三类之一：

 首先，组件具有`e > v`立即不可能。 

二、组件与`e = v`已经很好了。 我们不应该碰它们。 

三、组件与`e = v - 1`是树。 我们需要在每个这样的组件内添加一条边来创建一个循环。 

现在任务变成：

 对于每个树组件，在尚未通过边连接的两个顶点之间添加一条边。 

为什么端点必须已经不相邻？ 因为在相邻顶点之间添加另一条边会创建一个循环，该循环会重用长度为 1 的现有路径，从而产生多边循环。 这实际上是有效的。 真正的限制是不同的。 

问题在于，在树内添加任何边都会恰好创建一个循环，这始终是可以接受的。 甚至平行边和环也是允许的。 所以每个树组件总是可以用一条边固定。 

剩下的挑战是词典编纂的极简性。 

假设我们有一个树组件。 在其中所有可能添加的边中，我们想要字典顺序最小的对`(u,v)`和`u <= v`。 

由于组件是独立的，因此独立地选择每个组件内的最小有效边也会最小化排序后的全局序列。 

我们可以简单地尝试所有对`(u,v)`按字典顺序排列，并选择第一个其加法恰好创建一个循环而不违反条件的那个。 

对于树来说，每条添加的边都有效。 因此，按字典顺序排列的最小有效边就是组件内最小的对。 

树组件中始终允许循环，因为顶点以前不属于任何循环。 添加`(u,u)`仅创建一个循环`u`，而所有其他顶点仍然在循环之外，这是不够的。 因此，除非组件的大小为一，否则循环无效。 

这是关键的微妙之处。 

为了使每个顶点都属于同一个循环，添加的边必须连接两个不同的顶点。 然后创建的循环包括它们之间的整个路径。 

在树中，添加边`(u,v)`创建一个完全由以下路径组成的循环`u`到`v`。 

对于属于该循环的组件中的每个顶点，之间的路径`u`和`v`必须包含组件的每个顶点。 这意味着树本身必须是一条简单的路径，并且`u,v`必须是它的端点。 

这才是真正的表征。 

因此，一个组件是可修复的，当且仅当：```
e = v
```或者```
e = v - 1
```在第二种情况下，组件必须是路径。 

添加一条边后，分支树永远不会变得有趣，因为某些分支顶点将留在循环之外。 

例如：```
4 3
1 2
2 3
2 4
```没有添加边可以使所有四个顶点恰好属于一个循环。 

决定性的观察是每个有效的连接组件必须已经是：```
a cycle
```或者```
a path
```因为最终图中的度数必须全部恰好成为非循环周期内的两个。 

因此：

 如果一个组件已经有一个度数大于二的顶点，则不可能。 

如果一个组件有两个以上的一阶顶点，则不可能。 

如果组件是路径，则连接其两个端点。 

如果组件是孤立的顶点，请添加一个循环。 

在所有最佳答案中，这种贪婪构造在字典顺序上自动是最小的，因为每个组件只有一个有效的完成。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数| 指数| 太慢了|
 | 最佳 | O(n²) | O(n²) | 已接受 |

 ## 算法演练

 1. 完全按照给定构建多重图，包括循环和平行边。 
2. 仔细计算每个顶点的度数。 

循环贡献`2`达到无向图的程度。 
3. 使用 DFS 或 DSU 查找连接的组件。 
4. 对于每个组件，计算：

 顶点数，

 边数，

 以及其中每个顶点的度数。 
5. 如果任意顶点的度数大于`2`， 输出`NO`。 

在一张有趣的图中，每个顶点都恰好属于一个循环，因此每个顶点都必须具有精确的度数`2`。 
6. 如果组件已经满足`edges = vertices`，那么就已经是一个循环了。 

不应添加边缘。 
7. 否则组件必须满足`edges = vertices - 1`。 

如果没有，则输出`NO`。 
8. 在这样的组件中，计算度数的顶点`1`。 

有效的路径组件必须恰好有两个端点。 
9. 如果组件只有一个顶点且没有边，则添加一个循环`(v,v)`。 
10. 否则，连接两个 1 度顶点。 

这将路径闭合为包含每个顶点一次的循环。 
11. 存储所有添加的边并按字典顺序对它们进行排序。 
12. 输出结果列表。 

### 为什么它有效

 在一个有趣的连通组件中，每个顶点都必须位于一个简单的循环上。 这迫使每个顶点的度数恰好为 2。 

每个顶点的度数为 2 的连通图恰好是一个循环分量，包括循环和来自平行边的 2 循环。 

如果一个组件已经满足这个要求，我们就保持它不变。 

如果一个组件的边比顶点少一个，那么它就是一棵树。 添加一条边后唯一可以成为循环的树是路径，因为每个顶点必须以二度结束。 连接两个端点会将路径转换为包含所有顶点的循环。 

任何违反这些结构特性的组件永远无法通过单独添加边缘来修复。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10**6)

def solve():
    n, m = map(int, input().split())

    adj = [[] for _ in range(n)]
    deg = [0] * n
    edges = []

    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1

        adj[u].append(v)
        if u != v:
            adj[v].append(u)

        deg[u] += 1
        deg[v] += 1

        edges.append((u, v))

    visited = [False] * n
    answer = []

    def dfs(start, comp):
        stack = [start]
        visited[start] = True

        while stack:
            u = stack.pop()
            comp.append(u)

            for v in adj[u]:
                if not visited[v]:
                    visited[v] = True
                    stack.append(v)

    for i in range(n):
        if visited[i]:
            continue

        comp = []
        dfs(i, comp)

        comp_set = set(comp)

        edge_count = 0
        for u, v in edges:
            if u in comp_set and v in comp_set:
                edge_count += 1

        size = len(comp)

        bad = False
        leaves = []

        for v in comp:
            if deg[v] > 2:
                bad = True
                break

            if deg[v] == 1:
                leaves.append(v)

        if bad:
            print("NO")
            return

        if edge_count == size:
            for v in comp:
                if deg[v] != 2:
                    print("NO")
                    return

        elif edge_count == size - 1:
            if size == 1:
                if deg[comp[0]] != 0:
                    print("NO")
                    return

                answer.append((comp[0] + 1, comp[0] + 1))

            else:
                if len(leaves) != 2:
                    print("NO")
                    return

                u, v = sorted([leaves[0] + 1, leaves[1] + 1])
                answer.append((u, v))

        else:
            print("NO")
            return

    answer.sort()

    print("YES")
    print(len(answer))

    for u, v in answer:
        print(u, v)

solve()
```解决方案首先要严格按照给定的方式构建图表。 平行边和循环被保留，因为它们影响循环结构。 

度的处理很微妙。 在无向图中，循环对其顶点的度数贡献两倍。 该实现会自动实现这一点，因为即使在以下情况下，两个端点也会递增：`u == v`。 

通过 DFS 发现连接的组件。 自从`n <= 50`，效率不是问题，但迭代 DFS 完全避免了递归深度问题。 

对于每个组件，我们通过扫描原始边缘列表来重新计算边缘数量。 即使对于循环和平行边，这也能干净地工作。 

核心验证是程度条件。 任何度数大于 2 的顶点都会导致无法立即得到答案。 

一个组件`edges == vertices`一定已经是一个循环了。 每个顶点的度数必须正好为 2。 

一个组件`edges == vertices - 1`是一棵树。 唯一有效的树是路径。 对于一条路径，两个 1 度顶点连接起来形成闭环。 

孤立顶点的情况需要特殊处理。 将顶点连接到自身会创建一个长度为 1 的循环。 

最后，所有添加的边在输出之前按字典顺序排序。 

## 工作示例

 ### 示例 1

 输入：```
3 2
1 2
2 3
```该图是单一路径。 

| 步骤| 组件| 度| 边缘计数 | 行动|
 | ---| ---| ---| ---| ---|
 | 1 | {1,2,3} | [1,2,1]| 2 | 检测到路径 |
 | 2 | 端点 = (1,3) | - | - | 加 (1,3) |

 最终添加的边：```
1 3
```新的图成为循环`1-2-3-1`, and every vertex belongs to exactly one cycle.

 ### 示例 2

 输入：```
4 3
1 2
2 3
2 4
```This graph is a branching tree.

 | 步骤| 组件| 度| 边缘计数 | 行动|
 | ---| ---| ---| ---| ---|
 | 1 | {1,2,3,4} | [1,3,1,1] | 3 | 发现 3 级 |

 由于顶点`2`度数已经大于二，不可能有最终有趣的图。 

输出：```
NO
```该迹线演示了关键的不变量：最终图中的每个顶点的度数必须恰好为 2。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n²) | DFS 加上微小约束下的重复边缘扫描 |
 | 空间| O(n²) | 最坏情况多重图的邻接存储 |

 由于只有 50 个顶点和最多 2500 个边，该解决方案很容易满足限制。 即使是立方解也能轻松通过。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n, m = map(int, input().split())

    adj = [[] for _ in range(n)]
    deg = [0] * n
    edges = []

    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1

        adj[u].append(v)
        if u != v:
            adj[v].append(u)

        deg[u] += 1
        deg[v] += 1

        edges.append((u, v))

    visited = [False] * n
    answer = []

    def dfs(start, comp):
        stack = [start]
        visited[start] = True

        while stack:
            u = stack.pop()
            comp.append(u)

            for v in adj[u]:
                if not visited[v]:
                    visited[v] = True
                    stack.append(v)

    out = []

    for i in range(n):
        if visited[i]:
            continue

        comp = []
        dfs(i, comp)

        comp_set = set(comp)

        edge_count = 0
        for u, v in edges:
            if u in comp_set and v in comp_set:
                edge_count += 1

        size = len(comp)

        leaves = []

        for v in comp:
            if deg[v] > 2:
                return "NO\n"

            if deg[v] == 1:
                leaves.append(v)

        if edge_count == size:
            for v in comp:
                if deg[v] != 2:
                    return "NO\n"

        elif edge_count == size - 1:
            if size == 1:
                answer.append((comp[0] + 1, comp[0] + 1))
            else:
                if len(leaves) != 2:
                    return "NO\n"

                u, v = sorted([leaves[0] + 1, leaves[1] + 1])
                answer.append((u, v))

        else:
            return "NO\n"

    answer.sort()

    out.append("YES")
    out.append(str(len(answer)))

    for u, v in answer:
        out.append(f"{u} {v}")

    return "\n".join(out) + "\n"

# provided sample
assert run(
"""3 2
1 2
2 3
"""
) == (
"""YES
1
1 3
"""
), "sample 1"

# isolated vertex
assert run(
"""1 0
"""
) == (
"""YES
1
1 1
"""
), "single vertex loop"

# already valid cycle
assert run(
"""3 3
1 2
2 3
3 1
"""
) == (
"""YES
0
"""
), "already interesting"

# branching tree impossible
assert run(
"""4 3
1 2
2 3
2 4
"""
) == (
"""NO
"""
), "degree > 2 impossible"

# parallel edges form cycle
assert run(
"""2 2
1 2
1 2
"""
) == (
"""YES
0
"""
), "2-cycle with parallel edges"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 0`| 添加循环 | 孤立顶点处理 |
 | 三角形图|`YES 0`| 已经有效的周期|
 | 分支树|`NO`| 度数大于二 |
 | 平行边|`YES 0`| 多图循环处理 |

 ## 边缘情况

 考虑孤立顶点的情况：```
1 0
```该组件具有 1 个顶点和 0 个边。 从技术上讲，它是一棵树，但连接端点是不可能的，因为只有一个顶点。 

该算法检测到`size == 1`并添加循环`(1,1)`。 

最终的图有一个包含唯一顶点的循环，因此答案是有效的。 

现在考虑平行边：```
2 2
1 2
1 2
```度数变成`[2,2]`。 该组件有`2`顶点和`2`边缘，所以它已经是一个循环组件。 

简单图实现可能会错误地拒绝这一点，但算法会正确地接受它。 

最后，考虑一个具有重叠周期的组件：```
4 5
1 2
2 3
3 1
2 4
4 3
```顶点度数为`[2,3,3,2]`。 

该算法立即拒绝该图，因为顶点`2`和`3`已经拥有大于二的学位。 

没有添加的边缘可以修复该结构，因为不可能去除循环。
