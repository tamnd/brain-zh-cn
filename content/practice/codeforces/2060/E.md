---
title: "CF 2060E - 图形合成"
description: "我们在同一组顶点上得到两个无向图。 一张图，称为工作图，是我们可以修改的结构。 第二张图是一个固定的参考结构，我们最终必须在连接性方面“匹配”。"
date: "2026-06-08T10:40:52+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dsu", "graphs", "greedy"]
categories: ["algorithms"]
codeforces_contest: 2060
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 998 (Div. 3)"
rating: 1500
weight: 2060
solve_time_s: 74
verified: true
draft: false
---

[CF 2060E - 图合成](https://codeforces.com/problemset/problem/2060/E)

 **评分：** 1500
 **标签：** dfs 和类似的、dsu、图、贪婪
 **求解时间：** 1m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在同一组顶点上得到两个无向图。 一张图，称为工作图，是我们可以修改的结构。 第二张图是一个固定的参考结构，我们最终必须在连接性方面“匹配”。 

允许的操作非常强大：我们可以自由地将任何缺失的边插入工作图中或删除任何现有的边。 每一个这样的修改都会花费一次操作。 在执行这些编辑的一些序列之后，我们不再关心精确的边，只关心连接的组件。 目标是当且仅当两个顶点在参考图中连接时，它们最终在工作图中连接。 

因此，该任务从根本上讲是将顶点的一个分区转换为另一个分区，其中每个分区由图的连接组件定义。 

约束很严格：所有测试用例最多有 2×10^5 个顶点和边。 这立即排除了任何对每个边重复重新计算连接性或简单地模拟变化的方法。 任何解决方案都必须从本质上将问题减少到每个测试用例的几次线性或几乎线性通过，通常使用 DSU 或 DFS。 

当两个图已经定义相同的连通性但具有非常不同的边集时，就会出现微妙的边缘情况。 例如，如果两个图都是连接的，但一个是树，另一个是稠密的，则不需要任何操作，因为连接已经匹配，即使边集差异很大。 尝试“对齐边缘”而不是组件的幼稚方法会错误地计算不必要的编辑。 

当两个图完全断开但以不同方式划分顶点时，会出现另一种边缘情况。 例如，如果 F 是一个组件，而 G 将所有内容拆分为单例，那么我们必须删除足够的边来隔离 F 中的每个顶点。在这种情况下，任何只关注边缘差异而不考虑组件结构的方法都会多计或少计。 

## 方法

 暴力视角会尝试直接将 F 转换为某个与 G 具有相同连接分量的目标图。可以想象重复检查顶点对，并根据它们最终是否应该连接来决定是否需要或必须删除一条边。 然而，每个操作都会改变全局的连接性，因此每次编辑后重新计算连接的组件会导致昂贵的重复图形遍历。 即使我们仔细选择边缘，在任意添加和删除下保持动态连接也会将我们推向比必要的更重的结构。 

关键的简化是我们实际上不需要匹配边，只需要匹配连接的组件。 一旦认识到这一点，问题就简化为比较顶点集的两个部分：F 的分量与 G 的分量。 

在 G 的每个连通分量内，所有顶点最终都必须在最终图中连通。 这意味着在每个 G 分量内，最终状态必须是单个连接分量。 相反，来自不同 G 分量的顶点必须在最终图中断开连接，因此 F 的任何在不同 G 分量之间交叉的边从根本上来说都是“错误的”，必须被删除。 

现在结构变得干净了。 我们首先通过删除 F 中连接不同 G 分量的所有边来强制 F 尊重 G 的划分。 经过此清理后，F 的每个剩余组件都完全位于 G 的某个组件内。在每个 G 组件内，我们需要将可能的多个 F 组件连接成一个。 两个组件的每次合并都需要添加一个边，而我们能做的最好的就是贪婪地连接组件，因此成本就是组件的数量减去每个 G 组件的一个。

这导致了基于 DSU 的解决方案：我们使用 G 的 DSU 来识别组，然后模拟这些组内有效的 F 边，对每个组的结果组件进行计数，并计算需要多少次合并。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力重新计算| O(n·(m₁+m2)) | O(n+m) | 太慢了 |
 | DSU 组件合并 | O((n+m₁+m2) α(n)) | O(n) | 已接受 |

 ## 算法演练

 我们在概念上使用了两次不相交集联合结构，但在实现中只需要一个 DSU。 

1. 为图 G 构建 DSU 以计算其连通分量。 每个顶点都分配有一个代表，用于标识它属于哪个最终组件。 此步骤将问题从基于图的问题转换为基于组件的问题。 
2. 为顶点初始化另一个 DSU，但只允许保留在同一 G 组件内的并集。 这确保了我们永远不会意外地合并在最终答案中必须保持独立的组件。 
3. 迭代 F 的所有边。对于每条边 (u, v)，检查 u 和 v 是否属于同一个 G 分量。 如果不这样做，则该边在最终结构中无效并贡献一个所需的删除。 如果这样做，则在 F 的受限 DSU 中联合 u 和 v。 
4. 处理完所有有效边后，我们现在将每个 G 分量划分为由 F 允许的边形成的几个连接块。 
5. 对于每个 G 分量，计算其顶点之间存在多少个 DSU 根。 如果一个组件有 k 个这样的部分，我们需要恰好 k−1 次操作才能将它们连接成单个连接组件。 
6. 对所需合并的所有 G 分量求和，并添加所有跨分量边的删除。 这个总数就是答案。 

### 为什么它有效

 正确性来自于将问题分为两个独立的约束：删除违反所需断开连接的边，并仅添加边以恢复每个所需组内的连接性。 一旦跨分量边缘被移除，每个 G 分量就变成一个孤立的子问题。 在这样的子问题中，任何具有 k 个分量的连接结构都需要至少 k−1 个边才能连接，并且我们总是可以实现它，因为允许添加分量内的任何缺失边。 

这给出了实现它的下限和建设性方法。 

## Python 解决方案```python
import sys
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
    t = int(input())
    for _ in range(t):
        n, m1, m2 = map(int, input().split())

        g_dsu = DSU(n)

        edges_f = []
        for _ in range(m1):
            u, v = map(int, input().split())
            edges_f.append((u - 1, v - 1))

        for _ in range(m2):
            u, v = map(int, input().split())
            g_dsu.union(u - 1, v - 1)

        comp_vertices = [[] for _ in range(n)]
        for i in range(n):
            comp_vertices[g_dsu.find(i)].append(i)

        f_dsu = DSU(n)

        deletions = 0

        for u, v in edges_f:
            if g_dsu.find(u) != g_dsu.find(v):
                deletions += 1
            else:
                f_dsu.union(u, v)

        answer = deletions

        for comp in comp_vertices:
            roots = set()
            for v in comp:
                roots.add(f_dsu.find(v))
            if len(comp) > 0:
                answer += len(roots) - 1

        print(answer)

if __name__ == "__main__":
    solve()
```该代码首先使用 DSU 将图 G 压缩为组件。 然后，它根据 F 的边缘是否尊重这些组件来过滤它们。 任何边缘交叉组件都会立即计为所需删除。 

在每个有效的 G 组件内，我们跟踪 F 允许的边如何将顶点分割成子组件。 每个不同的 DSU 根对应一个片段，我们计算需要多少次合并才能统一它们。 

一个微妙的实现细节是，我们从不尝试维护 F 中的全局连接。我们只依赖代表性标签，因为跨组件结构一旦过滤就不再相关。 

## 工作示例

 我们追踪一个小情况，其中 G 的顶点分割方式与 F 不同。 

考虑 n = 4 的情况。 

F 边：(1,2)、(2,3)

 G 边：(1,2)、(3,4)

 G分量是{1,2}和{3,4}。 

### 追踪

 | 步骤| 行动| DSU(G) 组件 | DSU(F 限制) | 删除|
 | --- | --- | --- | --- | --- |
 | 初始化| 构建 G | {1,2}, {3,4} | 全部分开| 0 |
 | 过程 (1,2) | 允许工会 | {1,2}, {3,4} | {1,2} | 0 |
 | 过程 (2,3) | 交叉边缘| {1,2}, {3,4} | {1}、{2}、{3}、{4} | 1 |

 现在在 G 组件内部：

 对于 {1,2}，F 有一个分量，因此成本为 0。 

对于 {3,4}，F 有两个单例，因此成本为 1。 

总答案是2。 

该跟踪显示了算法如何干净地将删除成本与内部合并成本分开，以匹配约束的分解。 

第二个案例演示了完全连接的 G。 

F边：无

 G边：形成链条1-2-3-4

 所有顶点都在一个 G 组件中，因此我们只计算 F 内部的连通性。每个顶点都是孤立的，因此我们有 4 个组件，需要 3 次合并。 该算法自然输出 3，符合我们只需要在单个组内构建生成树的想法。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m₁ + m2) | DSU 操作以及对边和顶点的单次遍历 |
 | 空间| O(n) | DSU 阵列和分组存储 |

 这些约束允许最多 2×10^5 的总元素，因此线性或近线性 DSU 操作完全在限制范围内，特别是通过路径压缩和按大小并集确保每次操作接近恒定的摊销时间。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque
    import sys

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

    t = int(input())
    out = []

    for _ in range(t):
        n, m1, m2 = map(int, input().split())

        g = DSU(n)

        edges = []
        for _ in range(m1):
            u, v = map(int, input().split())
            edges.append((u - 1, v - 1))

        for _ in range(m2):
            u, v = map(int, input().split())
            g.union(u - 1, v - 1)

        f = DSU(n)

        del_cost = 0

        for u, v in edges:
            if g.find(u) != g.find(v):
                del_cost += 1
            else:
                f.union(u, v)

        comp = {}
        for i in range(n):
            r = g.find(i)
            comp.setdefault(r, []).append(i)

        ans = del_cost
        for nodes in comp.values():
            roots = set(f.find(x) for x in nodes)
            ans += len(roots) - 1

        out.append(str(ans))

    return "\n".join(out)

# provided samples
assert run("""5
3 2 1
1 2
2 3
1 3
2 1 1
1 2
1 2
3 2 0
3 2
1 2
1 0 0
3 3 1
1 2
1 3
2 3
1 2
""") == """3
0
2
0
2"""

# custom cases
assert run("""1
4 0 0
1
""") == "0", "empty graphs"

assert run("""1
4 3 1
1 2
2 3
3 4
1 2
""") == "2", "chain mismatch"

assert run("""1
3 3 1
1 2
2 3
1 3
1 2
""") == "2", "triangle vs edge"

assert run("""1
5 0 4
1 2
2 3
3 4
4 5
""") == "4", "build full connectivity"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 空图| 0 | 简单对齐 |
 | 链不匹配| 2 | 删除加合并|
 | 三角形与边| 2 | F | 中的冗余边
 | 构建全面互联 | 4 | 纯建筑成本|

 ## 边缘情况

 F 是全连接但 G 将顶点分割成许多组件的情况说明了为什么删除计数至关重要。 如果 F 中的所有边都连接不同的 G 分量，则必须删除每个这样的边，否则最终的图将错误地连接必须保持分离的分量。 

G 是全连接但 F 有多个分量的另一种情况显示了相反的效果。 不需要删除，但 F 内每个断开的片段必须用比其计数少一条的边连接。 该算法自然会处理这个问题，因为所有顶点都属于一个 G 组，因此只有内部 DSU 结构才能确定答案。
