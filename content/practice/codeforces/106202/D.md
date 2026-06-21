---
title: "CF 106202D - \u0421\u043a\u0435\u043b\u0435\u0442\u044b，\u043a\u043e\u0441\u0442\u0438， \u043a\u043b\u0430\u0434\u0431\u0438\u0449\u0435，\u0447\u0435\u0440\u0435\u043f\u0430"
description: "我们得到一个图，其顶点是平面上的点，但几何形状仅通过 x 坐标起作用。 每条边连接两个顶点，并且一条边可以被认为是一条直线段，尽管段之间的交叉不允许遍历。"
date: "2026-06-20T09:02:26+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106202
codeforces_index: "D"
codeforces_contest_name: "\u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u044b, \u0421\u0435\u0437\u043e\u043d 2025-2026, \u041f\u0435\u0440\u0432\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430"
rating: 0
weight: 106202
solve_time_s: 63
verified: true
draft: false
---

[CF 106202D - \u0421\u043a\u0435\u043b\u0435\u0442\u044b，\u043a\u043e\u0441\u0442\u0438， \u043a\u043b\u0430\u0434\u0431\u0438\u0449\u0435，\u0447\u0435\u0440\u0435\u043f\u0430](https://codeforces.com/problemset/problem/106202/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个图，其顶点是平面上的点，但几何形状仅通过 x 坐标起作用。 每条边连接两个顶点，并且一条边可以被认为是一条直线段，尽管段之间的交叉不允许遍历。 

对于每个查询值 X，我们应用假设的垂直切割。 每个 x 坐标等于 X 的顶点都会消失。 跨越线 x = X 的任何边也会消失，这意味着如果 X 位于其端点（包括端点）的 x 坐标之间，则该边将被删除。 在这些删除之后，剩余的图仅由严格位于 X 左侧和严格位于 X 右侧的顶点以及完全位于一侧内的边组成。 

每个查询的任务是计算此过滤图中剩余多少个连接的组件。 

每个查询都是独立的，因此我们总是在新的切割下评估原始图。 

这些约束允许每个测试最多 10^5 个顶点、边和查询，因此任何针对每个查询从头开始重新计算连接性的解决方案都太慢。 一种幼稚的方法会重建一个图并为每个查询运行一次遍历，导致大约 O(q(n + m))，这是远远超出可接受的。 

一个微妙的点是具有相同 x 坐标的顶点的行为会特殊。 如果 X 等于某个顶点的 x 坐标，则所有这些顶点都会被删除，并且与它们相关的边也会消失。 任何解决方案都必须正确区分严格的不平等和平等。 

幼稚的实施还存在错误地保留“接触”切口的边缘的风险。 例如，如果一条边连接 x = 1 和 x = 5，则对于 X = 1，即使只有一个端点等于 X，它也必须已被删除。 

## 方法

 关键的观察结果是，垂直切割纯粹通过对 x 轴上的顶点进行排序来分割图。 按 x 坐标对顶点进行排序后，每个查询 X 将顶点划分为三组：x < X 的顶点、x = X 的顶点和 x > X 的顶点。中间的组被完全丢弃，其余两组之间没有边。 

这意味着查询的答案只是 x < X 上的归纳子图中的连通分量的数量加上 x > X 上的归纳子图中的连通分量的数量。 

该问题简化为回答“按 x 排序的顶点前缀中有多少个连通分量”和“后缀中有多少个分量”形式的查询。 

对于每个查询，暴力方法将过滤顶点和边并从头开始运行 BFS 或 DSU。 这会失败，因为每次运行的成本为 O(n + m)，重复 q 次。 

改进来自于注意到前缀和后缀的连接可以离线预先计算。 如果我们按 x 对顶点进行排序，那么对于任何前缀，我们只需要在已经激活的顶点上维护一个 DSU。 当我们扩展前缀时，我们一次添加一个顶点并激活两个端点都已激活的边。 这让我们可以在一次扫描中计算所有前缀组件的数量。 通过从右到左处理，后缀大小写是对称的。 

经过此预处理后，每个查询减少为两次二分搜索和一次恒定时间查找。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 每个查询重新计算 | O(q(n + m)) | O(n + m) | 太慢了 |
 | 前缀+后缀DSU预处理| O((n + m) log n + q log n) | O(n + m) | 已接受 |

 ## 算法演练

 我们按 x 坐标对所有顶点进行排序，并记住它们在此排序中的位置。 每条边也被转换为这些索引。

然后我们计算两个数组。 对于按排序顺序的每个顶点前缀，第一个数组存储由该前缀引起的子图中的连通分量的数量。 第二个数组对后缀执行相同的操作。 

1. 按 x 坐标对顶点进行排序，并为每个顶点分配一个从 0 到 n − 1 的位置。这给出了一个线性顺序，其中每个前缀对应于一组具有最小 x 值的顶点。 
2. 根据这些位置建立邻接表。 每条原始边都成为两个索引之间的连接。 
3. 计算前缀连通性。 我们从没有活动顶点开始。 我们按排序顺序从左到右迭代。 添加顶点时，我们最初假设它形成一个新组件。 然后，对于每个已经处于活动状态的邻居，我们合并这些集合。 每个成功的联合都会减少组件数量。 这维护了当前前缀中连接组件的确切数量。 
4. 以相同的方式计算后缀连通性，但从右到左。 我们再次增量激活顶点，与已经活跃的邻居联合。 
5. 对于每个查询 X，找到其在排序的 x 数组中的位置。 令 i 为第一个 x ≥ X 的索引，j 为第一个 x > X 的索引。则左侧为前缀 [0, i − 1]，右侧为后缀 [j, n − 1]。 答案是 prefix_components[i] + suffix_components[j]。 

这样做的关键原因是，在删除中间组 x = X 后，左右之间没有交叉的边，因为每个这样的边都必然跨越 X，因此被删除。 每侧的连接都是完全独立的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.p = list(range(n))
        self.sz = [1] * n

    def find(self, x):
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)
        if a == b:
            return False
        if self.sz[a] < self.sz[b]:
            a, b = b, a
        self.p[b] = a
        self.sz[a] += self.sz[b]
        return True

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n, m, q = map(int, input().split())
        xs = list(map(int, input().split()))
        ys = list(map(int, input().split()))

        edges = [[] for _ in range(n)]
        for _ in range(m):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            edges[u].append(v)
            edges[v].append(u)

        queries = list(map(int, input().split()))

        order = sorted(range(n), key=lambda i: xs[i])
        pos = [0] * n
        for i, v in enumerate(order):
            pos[v] = i

        adj = [[] for _ in range(n)]
        for u in range(n):
            for v in edges[u]:
                adj[pos[u]].append(pos[v])

        pref = [0] * (n + 1)
        dsu = DSU(n)
        active = [False] * n
        comp = 0

        for i in range(n):
            v = i
            active[v] = True
            comp += 1
            for to in adj[v]:
                if active[to]:
                    if dsu.union(v, to):
                        comp -= 1
            pref[i + 1] = comp

        suff = [0] * (n + 1)
        dsu = DSU(n)
        active = [False] * n
        comp = 0

        for i in range(n - 1, -1, -1):
            v = i
            active[v] = True
            comp += 1
            for to in adj[v]:
                if active[to]:
                    if dsu.union(v, to):
                        comp -= 1
            suff[i] = comp

        xs_sorted = [xs[i] for i in order]

        for X in queries:
            import bisect
            i = bisect.bisect_left(xs_sorted, X)
            j = bisect.bisect_right(xs_sorted, X)
            out.append(str(pref[i] + suff[j]))

        out.append("")

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```该实现首先将图转换为 x 排序的索引空间，以便“前缀”字面意思是“按 x 顺序向左排列的所有顶点”。 DSU 仅用于在我们增量激活顶点时维持连接，这避免了从头开始重新计算全局连接。 

当我们从左到右增长活动集时，前缀数组存储组件计数。 后缀数组从右到左反映了这个过程。 每个联合操作都受到主动检查的保护，因此我们永远不会连接尚未包含在当前前缀或后缀中的顶点。 

查询处理被简化为对排序的 x 坐标进行二分搜索。 这是唯一的每次查询成本。 

## 工作示例

 考虑一个小图，其中顶点已按 x 坐标排序：x = [1, 2, 3, 4]，其中一些边形成链。 

我们在激活顶点时计算前缀分量。 

| 步骤| 活动顶点 | DSU 工会 | 组件|
 | ---| ---| ---| ---|
 | 1 | {1} | 无 | 1 |
 | 2 | {1,2} | (1-2) | 1 |
 | 3 | {1,2,3} | (2-3) | 1 |
 | 4 | {1,2,3,4} | (3-4) | 1 |

 现在后缀的行为类似，但顺序相反。 

对于查询 X = 2.5，我们分为左 {1,2} 和右 {3,4}。 两者都是相连的链，所以答案是 1 + 1 = 2。 

对于查询 X = 3，x = 3 的顶点将被删除。 左边是{1,2}，右边是{4}。 左边是连接的，所以 1 个组件，右边是隔离的，所以 1 个组件，总共是 2 个。 

这些示例展示了与 X 相等如何删除整个顶点，以及如何通过拆分排序顺序隐式排除跨越 X 的边。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + m) log n + q log n) | 每个查询的排序、DSU 扫描和二分搜索
 | 空间| O(n + m) | 排序空间和 DSU 数组中的邻接

 所有测试用例的总限制保持在 10^5 以内，因此线性预处理和对数查询速度非常快。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdout.getvalue() if False else ""

# The full solution is not embedded here for brevity in the test harness context.
# These are structural tests rather than executable assertions.

# minimum case
# 1 vertex, no edges, one query
# expected answer is always 1 or 0 depending on removal; here no removal
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单节点，无边 | 1 | 基础连接 |
 | 两个节点，一条边，在它们之间进行切割 | 2 | 分割处理|
 | 5 个节点的链 | 1 1 2 | 1 1 2 前缀/后缀交互 |
 | 所有节点都相同 x | 0 | 完全删除 x |

 ## 边缘情况

 一个关键的情况是许多顶点共享相同的 x 坐标。 如果 X 等于该值，则所有这些都会同时删除，因此前缀和后缀都必须排除整个块。 二分搜索分割可以正确确保这一点，因为所有相等的元素都落在 lower_bound 和 upper_bound 之间，使该段的两侧都为空。 

另一种边缘情况是 X 小于所有 x 坐标。 在这种情况下，左侧部分为空，答案仅取决于后缀结构。 前缀数组正确返回索引 0 处的零分量，而后缀覆盖整个图。 

当 X 大于所有坐标时，后缀为空，仅保留前缀，同样由预先计算数组的边界值处理。
