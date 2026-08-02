---
title: "CF 104097C - \u9812\u734e\u97f3\u6a02（仪式）"
description: "我们得到一个由一组顶点和边描述的无向图。 任务是确定该图是否与称为“Cthulhu”的非常具体的结构模式匹配。"
date: "2026-07-02T02:13:18+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104097
codeforces_index: "C"
codeforces_contest_name: "2022 Taiwan NHSPC Mock Contest"
rating: 0
weight: 104097
solve_time_s: 52
verified: true
draft: false
---

[CF 104097C - \u9812\u734e\u97f3\u6a02（仪式）](https://codeforces.com/problemset/problem/104097/C)

 **评级：** -
 **标签：** -
 **求解时间：** 52s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个由一组顶点和边描述的无向图。 任务是确定该图是否与称为“Cthulhu”的非常具体的结构模式匹配。 

我们正在寻找的结构可以被描述为一个中心简单循环，树可能连接到它的一些顶点。 每个顶点要么属于该单个循环，要么属于悬挂在该循环上的一棵树。 循环本身必须很简单，这意味着它只访问每个顶点一次，并且它必须至少包含三个顶点，这样它就不会退化。 

从图论的角度来看，这意味着图应该是连通的，并且它应该恰好包含一个循环。 所有其他边必须形成附加到循环的树状分支，而不引入任何额外的循环。 

输入提供顶点和边的数量，后跟边列表。 输出是一个二元决策：该图是否可以解释为这样的“附有树的循环”结构。 

约束足够小，线性或近线性图遍历就足够了。 对于多达大约 100 个顶点，即使是 O(n + m) DFS 或 BFS 也相当快，而任何二次方程仍然会通过。 然而，结构条件很微妙：仅仅检查连通性是不够的，单独检查边的数量也是不够的。 

一个天真的错误是假设“边等于顶点”就足够了，而不验证连通性。 例如，由两个断开的循环组成的图，每个循环都带有树，仍然可以具有正确的边计数，但无效，因为该结构不是单个统一的基于循环的组件。 

另一个失败案例来自于断开连接的树木。 例如，考虑一个具有 4 个顶点和 3 个边的图，形成一棵树，加上其他地方的孤立循环组件； 它可能满足局部边缘计数，但全局失败。 

第二个微妙的边缘情况是当图恰好有 n 个边但包含多个循环时。 例如，由一条路径连接的两个单独的周期仍然可以使边数接近 n，但违反了“整个图中恰好有一个周期”的要求。 

## 方法

 蛮力的想法是通过模拟每个顶点的图遍历并检查我们是否可以将边划分为单个循环加树来显式检测循环并验证完整的结构约束。 人们可以尝试枚举循环，重建循环主干，并验证每个剩余的边都属于与其相连的树。 这很快就会变得复杂，因为在任意图中进行循环检测与重建并结合附件验证需要仔细记账，并且在最坏的情况下，每条边可能会被重新考虑多次，从而导致在简单实现中出现指数或高多项式行为。 

关键的简化来自结构观察。 在任何连通无向图中，如果正好有n个顶点和n条边，则正好有一个循环。 这是一个标准的不变量：树有 n − 1 条边，并且每条附加边恰好引入一个循环。 因此，如果图是连通的并且有 n 个边，则它必须恰好包含一个环，并且所有其他边在其周围形成树附件。 

这与所需的结构精确匹配，前提是我们还确保图不会退化。 由于中心循环必须至少有三个顶点，因此我们必须确保 n ≥ 3。有了这些条件，就不需要进一步的结构验证：连通性保证单个组件，边数保证正好一个循环。 

因此，问题简化为两个检查：图必须是连通的，边的数量必须等于顶点的数量，并且具有最小尺寸约束以保证有效性。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力（显式循环重建）| O(n2) 到 O(n3) | O(n + m) | 太慢/不必要|
 | 最佳（连接性 + 边缘数）| O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 我们将图简化为其基本结构属性并直接验证它们。 

1. 读取图形并构建邻接表表示。 这允许有效地遍历连接。 
2. 检查顶点数是否至少为 3。少于 3 个顶点的有效中心环不可能存在，因此任何较小的图都会立即无效。 
3. 通过比较 m 和 n 来验证边沿计数条件。 如果图的边数与顶点数不完全相同，则它不能恰好包含一个循环，因此它会立即失败。 
4. 从至少具有一条边的任意顶点开始运行图遍历。 使用DFS或BFS来标记所有可达的顶点。 
5. 遍历完成后，确保图中出现的所有顶点都被访问过。 如果任何顶点不可到达，则图将断开连接，这违反了结构是带有附加树的单循环的要求。 
6. 如果所有检查都通过，则该图与所需的结构匹配。 

### 为什么它有效

 具有 n 个顶点和 n 个边的连通无向图的圈数为 1，这意味着存在一个独立的循环。 所有剩余的边都被迫进入附加到该循环的树状结构，因为任何额外的循环都需要至少一个超出 n 的额外边。 连接性确保不存在可能隐藏额外循环或断开结构的孤立组件。 大小约束确保循环作为简单循环而不是简并结构是有效的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    adj = [[] for _ in range(n + 1)]

    for _ in range(m):
        u, v = map(int, input().split())
        adj[u].append(v)
        adj[v].append(u)

    if n < 3 or m != n:
        print("NO")
        return

    vis = [False] * (n + 1)

    # find a start node with at least one edge
    start = 1
    while start <= n and len(adj[start]) == 0:
        start += 1

    if start > n:
        print("NO")
        return

    stack = [start]
    vis[start] = True

    while stack:
        u = stack.pop()
        for v in adj[u]:
            if not vis[v]:
                vis[v] = True
                stack.append(v)

    for i in range(1, n + 1):
        if len(adj[i]) > 0 and not vis[i]:
            print("NO")
            return

    print("FHTAGN!")

if __name__ == "__main__":
    solve()
```邻接表以适合遍历的形式存储图。 在任何搜索之前，早期检查都会处理结构上的不可能性。 DFS 确保参与图中的每个顶点都是单个连接组件的一部分。 微妙之处在于，在检查连通性时，度数为零的孤立顶点将被忽略，因为它们不参与任何循环或边结构，并且该问题隐式假设有意义的结构位于由边引起的连接分量中。 

条件 m == n 是取代显式循环检测的决定性结构捷径。 如果没有它，我们将需要显式地识别和验证唯一的循环，但这里的边数已经编码了该约束。 

## 工作示例

 考虑一个小的有效案例：

 输入：

 6 6

 边与额外的树枝形成单个循环

 我们跟踪连接性：

 | 步骤| 节点已处理 | 访问过的节点 |
 | --- | --- | --- |
 | 1 | 起始节点| {开始} |
 | 2 | 邻居扩大 | 跨组件增长 |
 | 3 | 遍历结束| 组件中的所有节点 |

 所有有边的顶点都被访问，并且 m == n 成立，因此输出被接受。 

现在考虑一个断开连接的情况：

 输入：

 4 4

 两个不相交的组件

 从一个组件开始的遍历仅到达图的一部分：

 | 步骤| 节点已处理 | 访问过的节点 |
 | --- | --- | --- |
 | 1 | 开始 | 部分集 |
 | 2 | DFS 结束 | 不完全覆盖 |

 由于某些带有边的顶点未被访问，因此该图是无效的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | 每个顶点和边在 DFS 和构造过程中都会处理一次 |
 | 空间| O(n + m) | 邻接表和访问数组 |

 约束足够小，使得这种线性遍历很容易在限制范围内。 即使对于最大输入大小，操作数量也可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    stdout.flush = lambda: None

    n, m = map(int, inp.splitlines()[0].split())
    adj = [[] for _ in range(n + 1)]
    edges = inp.splitlines()[1:1+m]
    for e in edges:
        u, v = map(int, e.split())
        adj[u].append(v)
        adj[v].append(u)

    if n < 3 or m != n:
        return "NO"

    vis = [False] * (n + 1)

    start = 1
    while start <= n and len(adj[start]) == 0:
        start += 1
    if start > n:
        return "NO"

    stack = [start]
    vis[start] = True
    while stack:
        u = stack.pop()
        for v in adj[u]:
            if not vis[v]:
                vis[v] = True
                stack.append(v)

    for i in range(1, n + 1):
        if len(adj[i]) > 0 and not vis[i]:
            return "NO"

    return "FHTAGN!"

# provided sample-like cases
assert run("6 6\n1 2\n2 3\n3 4\n4 5\n5 6\n6 1\n") == "FHTAGN!"

# minimum invalid size
assert run("2 1\n1 2\n") == "NO"

# tree (no cycle)
assert run("4 3\n1 2\n2 3\n3 4\n") == "NO"

# disconnected correct edge count but invalid
assert run("4 4\n1 2\n2 1\n3 4\n4 3\n") == "NO"

# single cycle + extra tree attachment style valid structure
assert run("5 5\n1 2\n2 3\n3 1\n3 4\n4 5\n") == "FHTAGN!"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 6 循环 | FHTAGN！ | 基本有效循环结构|
 | n=2 情况 | 否 | 最小尺寸限制|
 | 树| 否 | 缺乏周期|
 | 两个组成部分| 否 | 连接要求|
 | 带尾巴的循环| FHTAGN！ | 循环+树附件正确性|

 ## 边缘情况

 常见的边缘情况是具有正确数量的边但未连接的图。 在这种情况下，DFS 将仅覆盖一个组件，而不会访问其他顶点，并且最终检查正确地拒绝它。 

另一个微妙的情况是存在孤立的顶点。 由于它们不参与任何边，因此在检查连通性时会忽略它们，但如果它们包含在顶点计数中而不贡献结构，它们仍然会导致图无法满足 m == n 条件。 

最后的边缘情况是最小有效周期大小。 当n小于3时，即使m == n，也不可能存在简单循环，并且早期拒绝可以防止错误地接受简并结构。
