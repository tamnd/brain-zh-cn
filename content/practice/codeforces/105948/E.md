---
title: "CF 105948E - 地形改造的殖民评估"
description: "我们得到一个图，其中每个顶点代表一颗行星，每个顶点都有一个称为其宜居性的数值。 该图是无向的，边代表行星之间的双向旅行路线。"
date: "2026-06-22T16:06:08+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105948
codeforces_index: "E"
codeforces_contest_name: "CCF CAT NAEC 2025 (Provincial)"
rating: 0
weight: 105948
solve_time_s: 55
verified: true
draft: false
---

[CF 105948E - 地形改造的殖民评估](https://codeforces.com/problemset/problem/105948/E)

 **评级：** -
 **标签：** -
 **求解时间：** 55s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个图，其中每个顶点代表一颗行星，每个顶点都有一个称为其宜居性的数值。 该图是无向的，边代表行星之间的双向旅行路线。 

对于每个测试用例，我们必须精确选择 k 个行星，以便每个选定的行星都可以通过完全留在选定的集合内来到达所有其他选定的行星。 换句话说，所选择的行星必须形成一个连通的诱导子图，因为不允许通过未选择的顶点进行遍历。 

在所有此类大小为 k 的有效连接选择中，我们查看所选集合内的最小可居住性值。 目标是最大化这个最小值。 

这立即表明答案取决于选择阈值 x 并检查是否存在包含至少 k 个权重至少为 x 的顶点的连通分量。 如果存在这样的集合，那么我们可以在该连接区域内选择其中的 k 个。 

这些约束意味着每个测试用例的 n 和 m 最多为 100000，测试的总和以 200000 为界。这排除了任何从头开始重新计算许多候选阈值连接性的方法。 解决方案必须在所有测试用例中有效地呈线性或接近线性。 

当图以没有连接组件的大小至少为 k 的方式断开连接时，就会出现微妙的边缘情况。 例如，如果 n = 5、k = 3，并且所有边都是孤立的，则不存在有效选择，即使所有权重都很大，答案也必须为 -1。 

当人们可能错误地考虑完整图的组成部分而不考虑遍历不能通过排除节点的约束时，就会发生另一种失败情况。 这意味着我们不能采用全局连接的组件，除非它内部的所有节点在所选阈值下都有效。 

## 方法

 蛮力的思想是考虑 k 个节点的每个可能的子集，检查它是否形成连通的归纳子图，并计算其中的最小权重。 这在组合上是不可能的，因为子集的数量以 n 为指数，甚至每个子集的连通性检查也以 n 加 m 为线性。 这导致大约 O(n 选择 k · (n + m)) 操作，即使对于非常小的 n 也是完全不可行的。 

一种更结构化的蛮力方法是固定答案 x，然后检查由权重至少为 x 的节点导出的子图是否包含大小至少为 k 的连通分量。 这将问题简化为每个 x 的可行性检查。 如果我们能够有效地检查这一点，我们就可以对 x 进行二分搜索。 

关键的见解是连接性仅取决于“活动”节点之间的边，并且我们只关心过滤图中连接组件的大小。 如果我们通过权重递减对节点进行排序并逐步激活它们，我们可以使用并查找结构来维护连接的组件。 一旦组件达到大小 k，当前权重阈值就可行。 

这将问题转化为排序加上 DSU 维护，每个测试用例都是线性的，但在给定约束的实践中总体上是线性的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n · (n + m)) | O(2^n · (n + m)) | O(n + m) | 太慢了 |
 | 阈值 + DSU | O(n log n + m α(n)) | O(n log n + m α(n)) | O(n + m) | 已接受 |

 ## 算法演练

 我们按照可居住性递减的顺序处理节点，以便当节点被激活时，其权重代表当前候选最小值。 

我们仅在活动节点上维护 DSU。

1. 将所有节点按权重递减排序。 这确保我们首先尝试更大的最小值，这直接对应于最大化最终答案。 
2. 最初，DSU 中没有活动节点。 
3. 按排序顺序迭代节点，并一次激活一个节点。 
4. 激活节点时，将其标记为活动节点并将其与所有已活动的邻居联合。 这会逐步构建当前激活节点的导出子图的连接组件。 
5. 每次激活后，计算包含该节点的 DSU 组件的大小。 如果它至少达到k，我们可以立即返回当前节点的权重作为答案。 
6. 如果我们处理完所有节点而没有找到大小为 k 的分量，则返回 -1。 

步骤 4 正确的原因是非活动节点的边不能对连接做出贡献。 通过仅联合活动邻居，我们强制 DSU 准确地表示导出子图中的连接性。 

### 为什么它有效

 在该过程中的任何时刻，活动集都精确对应于权重至少为当前阈值的节点。 DSU 组件表示由这些活动节点引起的子图中的连接组件。 当组件首次达到大小 k 时，意味着存在 k 个节点的连通子图，所有节点的权重至少为当前阈值。 因为我们按降序处理权重，所以该阈值是任何大小为 k 的有效连接集的最大可能最小值。 

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
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]

    def comp_size(self, x):
        return self.size[self.find(x)]

t = int(input())
for _ in range(t):
    n, m, k = map(int, input().split())
    w = list(map(int, input().split()))

    edges = [[] for _ in range(n)]
    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        edges[u].append(v)
        edges[v].append(u)

    order = sorted(range(n), key=lambda i: -w[i])

    active = [False] * n
    dsu = DSU(n)

    answer = -1

    for node in order:
        active[node] = True
        for nei in edges[node]:
            if active[nei]:
                dsu.union(node, nei)

        if dsu.comp_size(node) >= k:
            answer = w[node]
            break

    print(answer)
```DSU 是在其自己的组件中使用每个节点进行初始化的，但关键细节是组件仅在节点被激活时才变得有意义。 活动数组确保我们永远不会通过不活动节点进行合并，从而保留诱导子图约束。 

排序步骤至关重要，因为它保证我们第一次到达大小为 k 的组件时，我们使用尽可能高的最小权重。 

comp_size 检查使用新激活的节点的代表，这已经足够了，因为涉及该节点的所有合并在激活后立即发生。 

## 工作示例

 考虑一个具有 5 个节点且 k = 3 的小图：

 输入：```
n = 5, m = 4, k = 3
w = [5, 1, 4, 3, 2]
edges: (1-2), (2-3), (3-4), (4-5)
```按权重排序的节点：1(5)、3(4)、4(3)、5(2)、2(1)

 我们跟踪激活：

 | 步骤| 节点| 活动集| DSU 合并 | 元件尺寸| 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | {1} | 无 | 1 | -1 |
 | 2 | 3 | {1,3} | 无 | 1,1 | -1 |
 | 3 | 4 | {1,3,4} | 3 连接到 4 | 2 | -1 |
 | 4 | 5 | {1,3,4,5} | 4-5 | 3 | 3 |

 当添加节点 5（权重 2）时，链 3-4-5 处于活动状态，并形成大小为 3 的连接组件。但是，我们必须确保此处的最小权重为 3，而不是 2。该表显示了一个微妙的问题：实际上，添加节点 4 时会触发答案，因为连接的活动组件 {3,4,5} 在包含 5 之前尚未完全连接，但该集合的最小权重为 2，因此第一个有效的 k 组件实际上是该集合 {3,4,5}，其最小值为 2。如果较早存在尺寸为 3 的较高权重组件，则由于排序，它将首先被选择。 

这表明正确性取决于降序激活顺序，确保我们始终首先考虑最佳可能阈值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每次测试 O((n + m) α(n)) | 每个节点激活一次，每条边通过 DSU 联合最多处理两次 |
 | 空间| O(n + m) | 邻接表加 DSU 数组 |

 在所有测试用例中，n 和 m 的总数以 2 × 10^5 为界，因此解决方案在限制范围内运行良好。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
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
            ra, rb = self.find(a), self.find(b)
            if ra == rb:
                return
            if self.size[ra] < self.size[rb]:
                ra, rb = rb, ra
            self.parent[rb] = ra
            self.size[ra] += self.size[rb]

        def comp_size(self, x):
            return self.size[self.find(x)]

    t = int(input())
    out = []

    for _ in range(t):
        n, m, k = map(int, input().split())
        w = list(map(int, input().split()))

        edges = [[] for _ in range(n)]
        for _ in range(m):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            edges[u].append(v)
            edges[v].append(u)

        order = sorted(range(n), key=lambda i: -w[i])

        active = [False] * n
        dsu = DSU(n)

        ans = -1
        for node in order:
            active[node] = True
            for nei in edges[node]:
                if active[nei]:
                    dsu.union(node, nei)
            if dsu.comp_size(node) >= k:
                ans = w[node]
                break

        out.append(str(ans))

    return "\n".join(out)

# simple constructed tests
assert run("""1
1 0 1
5
""") == "5"

assert run("""1
3 0 2
5 4 3
""") == "-1"

assert run("""1
3 2 2
1 2 3
1 2
2 3
""") == "2"

assert run("""1
5 4 3
5 1 4 3 2
1 2
2 3
3 4
4 5
""") == "2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单节点 | 5 | 最小案例|
 | 断开的图| -1 | 不可能|
 | 小链 k=2 | 2 | 阈值正确性|
 | 全链 k=3 | 2 | 连接积累|

 ## 边缘情况

 一个关键的边缘情况是图有足够的节点，但即使在考虑权重之前，连接的组件也无法达到大小 k。 在这种情况下，算法将激活所有节点并且永远不会触发大小条件，因此它正确地输出 -1。 

另一个边缘情况是答案来自从不连接的高权重隔离节点。 由于需要连接性，单个节点无法满足 k > 1，并且 DSU 大小可以防止误报，因为没有边的联合永远不会发生。 

第三种情况涉及多个组件并行生长。 该算法仍然有效，因为每次激活仅合并局部邻域，并且任何组件第一次达到大小 k 时，由于权重下降处理，它对应于最佳可能阈值。
