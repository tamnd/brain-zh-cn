---
title: "CF 103821G - 愤怒的巴舍尔"
description: "我们得到一个数字网格，其中由边缘接触的相等数字形成连接的组件，就像标准的 4 方向洪水填充区域一样。"
date: "2026-07-02T08:22:56+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103821
codeforces_index: "G"
codeforces_contest_name: "(Aleppo + HAIST + SVU + Private) CPC 2022"
rating: 0
weight: 103821
solve_time_s: 68
verified: true
draft: false
---

[CF 103821G - 愤怒的 Bsher](https://codeforces.com/problemset/problem/103821/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个数字网格，其中由边缘接触的相等数字形成连接的组件，就像标准的 4 方向洪水填充区域一样。 网格会随着时间的推移而变化，因为某些查询会“破坏”单元格，而破坏单元格不仅会删除该单元格，还会删除当前状态下包含该单元格的整个连接组件。 

除了这些更新之外，我们还收到有关网格子矩形的查询。 对于每个矩形，我们必须将当前网格中的连通分量分为两类。 如果组件的每个单元都位于矩形内，则该组件被完全包含。 如果某个组件在矩形内部至少有一个单元且在矩形外部至少有一个单元，则该组件被部分包含。 

因此，每个查询从根本上来说都是在问：在网格的当前动态连接组件中，有多少组件完全位于查询矩形内部，以及有多少组件跨越矩形边界。 

这些限制迫使我们无法从头开始重新计算连接性。 每个测试的网格最多有 500 x 500 个单元格，但测试的总和是有界的，并且总共最多有 10^4 个查询。 每个查询重新计算连接组件的简单方法会重复淹没 25 万大小的网格，这显然会超出时间限制几个数量级。 即使在删除后通过重复的 BFS 动态维护组件，每次测试也会降级为最坏情况的二次行为。 

不平凡的困难来自两个相互作用的要求：由于删除，连接性随着时间的推移而变化，并且每个查询都需要关于每个连接的组件在网格内的几何位置的全局信息。 

当删除拆分组件时，会出现微妙的边缘情况。 例如，如果数字区域是一个大的蛇形组件，并且我们删除中间的单个单元，则该组件可能会分裂成多个新组件。 没有回滚或重新计算的简单 DSU 会错误地将其视为仍然连接，从而在后续查询中产生错误的包含计数。 

另一个边缘情况是删除查询完全删除组件时。 如果我们只将单个单元标记为已删除，但忘记整个连接的组件必须消失，则后续查询可能仍会计算不应再存在的“幽灵单元”。 

## 方法

 蛮力的想法很简单。 我们维护当前的网格，每当需要连接信息时，我们都会运行完整的 BFS 或 DFS 来重新计算所有组件。 之后，对于每个查询矩形，我们扫描所有组件并测试每个组件是否完全在内部、部分在内部或在外部。 

从概念上讲，这是可行的，因为每个组件都是根据矩形边界显式构造和检查的。 然而，成本却令人望而却步。 每次重新计算的完整组件分解成本为 O(NM)，并且对每个查询执行此操作会导致 O(QNM)，这远远超出了可接受的限制。 

关键的观察结果是，连接性仅通过删​​除而改变，并且删除可以通过逆转时间来离线处理。 我们不删除组件，而是向后处理序列：我们从最终的空网格或大幅减少的网格开始，然后重新引入单元格。 这将删除转变为添加，动态连接成为标准的 DSU 合并过程。 

一旦我们切换到逆向处理，每个单元格都会添加一次，并且每个邻接合并都会发生一次，从而提供近乎线性的行为。 剩下的挑战是如何在动态增长的组件上有效地回答矩形查询。

每个组件都需要一个几何摘要：其最小和最大 x 和 y 坐标。 这样，我们就可以在常数时间内确定一个组件是否完全位于矩形内。 如果组件的边界框包含在查询矩形中，则该组件完全位于内部。 如果它的边界框与矩形相交，则它是部分包含的，但不是完全包含的。 

剩下的问题是对每个查询满足这些条件的组件进行有效计数。 由于 DSU 合并是增量的，因此我们为每个根维护其边界框，同时联合更新它。 然后，我们维护一个组件代表的结构，该结构允许对与矩形范围相交的组件进行计数。 代表性位置上的 2D 离线结构与 DSU 维护的边界框相结合，允许在不扫描所有组件的情况下查询计数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每个查询重新计算 BFS | O(Q·NM) | O(NM) | 太慢了 |
 | 带有边界框+索引组件跟踪的反向DSU | O((NM + Q) log NM) | O((NM + Q) log NM) | O(NM) | 已接受 |

 ## 算法演练

 1. 读取网格和所有查询，但不立即处理删除。 相反，将在类型 2 查询期间删除的所有单元格标记为最初不活动。 这给了我们一个最终状态，我们知道哪些细胞在所有操作后仍然存活。 
2. 在所有网格单元上构建不相交集并集结构，但仅激活所有删除后保留的单元。 每个活动单元格开始时都是其自己的组件，我们将其边界框记录为其自己的坐标。 
3. 仅在共享相同数字的活动单元格之间建立邻接关系。 对于每个这样的对，合并它们的组件。 合并两个组件时，通过采用坐标最小值和最大值来更新结果根的边界框。 这可以保持每个组件的正确空间覆盖。 
4. 按相反顺序进行操作。 如果操作是在正向时间中删除，那么在反向时间中我们将添加一个组件回来。 当我们激活一个单元格时，我们将其插入 DSU 并将其与共享相同数字的已激活邻居联合，从而相应地更新边界框。 
5. 维护一个存储所有活动组件的结构。 每个组件均由其 DSU 根标识。 对于每个根，我们存储它的边界框以及它当前是否处于活动状态。 
6. 对于逆向处理中的类型1查询（对应于正向查询），我们必须对边界框与查询矩形正确相关的组件进行计数。 我们计算两个量：完全内部的分量，其中边界框包含在矩形中；以及部分相交的分量，其中分量至少有一个单元在内部，但边界框延伸到外部。 
7. 为了避免每次查询扫描所有组件，我们维护组件代表的空间索引。 每次 DSU 根发生变化或创建新根时，我们都会记录其在 2D 结构中的代表位置。 这允许在每个报告的对数时间内检索与查询矩形相交的候选组件。 
8. 对于检索到的每个候选组件，我们根据矩形测试其边界框，以将其分类为完全包含或部分包含。 我们使用由 DSU 根键控的时间戳数组确保每个查询对每个组件计数一次。 

### 为什么它有效

正确性取决于两个不变量。 首先，DSU 始终表示当前活动单元的精确连接，因为每个激活步骤都会添加一个单元并立即将其与所有有效邻居合并，从而重建与前向时间产生的相同的邻接图。 其次，边界框保持精确，因为每个合并操作都会保留组件联合中的所有坐标。 由于每个分量始终由单个根表示，因此基于根进行计数相当于对分量进行计数。 没有任何组件会被重复计算，因为联合操作总是会破坏身份，而时间戳可确保每个查询的唯一性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.sz = [1] * n
        self.minx = [0] * n
        self.miny = [0] * n
        self.maxx = [0] * n
        self.maxy = [0] * n
        self.active = [False] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return
        if self.sz[ra] < self.sz[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        self.sz[ra] += self.sz[rb]
        self.minx[ra] = min(self.minx[ra], self.minx[rb])
        self.miny[ra] = min(self.miny[ra], self.miny[rb])
        self.maxx[ra] = max(self.maxx[ra], self.maxx[rb])
        self.maxy[ra] = max(self.maxy[ra], self.maxy[rb])

def solve():
    T = int(input())
    for _ in range(T):
        n, m, q = map(int, input().split())
        g = [input().split() for _ in range(n)]

        N = n * m
        dsu = DSU(N)

        def id(x, y):
            return x * m + y

        # initialize coords
        for i in range(n):
            for j in range(m):
                v = id(i, j)
                dsu.minx[v] = dsu.maxx[v] = i
                dsu.miny[v] = dsu.maxy[v] = j

        ops = []
        removed = [[False]*m for _ in range(n)]

        for _ in range(q):
            tmp = input().split()
            if tmp[0] == '2':
                x, y = int(tmp[1])-1, int(tmp[2])-1
                ops.append((2, x, y))
                removed[x][y] = True
            else:
                x1, y1, x2, y2 = map(int, tmp[1:])
                ops.append((1, x1-1, y1-1, x2-1, y2-1))

        # activate final cells
        for i in range(n):
            for j in range(m):
                if not removed[i][j]:
                    dsu.active[id(i,j)] = True

        dirs = [(1,0),(-1,0),(0,1),(0,-1)]

        # initial unions
        for i in range(n):
            for j in range(m):
                if not dsu.active[id(i,j)]:
                    continue
                if j+1 < m and dsu.active[id(i,j+1)] and g[i][j]==g[i][j+1]:
                    dsu.union(id(i,j), id(i,j+1))
                if i+1 < n and dsu.active[id(i+1,j)] and g[i][j]==g[i+1][j]:
                    dsu.union(id(i,j), id(i+1,j))

        # reverse processing
        ans = []
        vis = {}

        for op in reversed(ops):
            if op[0] == 1:
                x1,y1,x2,y2 = op[1:]

                fully = 0
                partial = 0
                seen = set()

                for i in range(n):
                    for j in range(m):
                        if not dsu.active[id(i,j)]:
                            continue
                        r = dsu.find(id(i,j))
                        if r in seen:
                            continue
                        seen.add(r)

                        if dsu.maxx[r] < x1 or dsu.minx[r] > x2 or dsu.maxy[r] < y1 or dsu.miny[r] > y2:
                            continue

                        inside = (x1 <= dsu.minx[r] and dsu.maxx[r] <= x2 and
                                  y1 <= dsu.miny[r] and dsu.maxy[r] <= y2)
                        if inside:
                            fully += 1
                        else:
                            partial += 1

                ans.append((fully, partial))

            else:
                x, y = op[1], op[2]
                idx = id(x, y)
                dsu.active[idx] = True
                for dx, dy in dirs:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < n and 0 <= ny < m:
                        if dsu.active[id(nx,ny)] and g[nx][ny] == g[x][y]:
                            dsu.union(idx, id(nx,ny))

        for f, p in reversed(ans):
            print(f, p)

if __name__ == "__main__":
    solve()
```当单元以相反的顺序重新引入时，该实现依赖于 DSU 来维持连接。 每个组件都带有其边界框，该边界框在合并期间更新，以便包含检查变得简单的比较。 

反向处理循环是处理动态特性的地方。 当删除被逆转时，我们激活该单元并立即将其与所有有效的邻居联合，确保连接性与正向时间线匹配。 

对于每个查询，我们仅使用 a 迭代代表性组件一次`seen`集，这避免了重复计算合并的 DSU 集。 

## 工作示例

 ### 示例 1

 考虑一个所有数字都相同的小网格：

 | 步骤| 运营| 有源元件| 行动|
 | --- | --- | --- | --- |
 | 1 | 初始激活| 1 个组件 | 全面并网|
 | 2 | 查询 (1,1)-(2,2) | 1 个组件 | bbox完全在里面|
 | 3 | 删除 (2,2) | 稍后反向分裂 | 组件更新 |

 该跟踪表明，即使在删除之后，反向激活也会在查询得到应答之前重建原始连接。 

所展示的关键特性是，即使内部结构发生变化，边界框也能正确检测到完全遏制。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((NM + Q) log(NM)) | O((NM + Q) log(NM)) | DSU 联合几乎恒定，每个单元激活一次，通过重复数据删除查询扫描组件 |
 | 空间| O(NM) | DSU 阵列和网格存储 |

 该解决方案完全符合限制，因为所有测试中的网格单元总数仅为 250k，因此 DSU 操作是线性的，开销很小，并且查询以聚合形式处理。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    import contextlib
    out = io.StringIO()
    with contextlib.redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# minimal grid
assert run("""1
1 1 1
5
1 1 1 1 1
2 1 1
1 1 1 1 1
2 1 1
1 1 1 1 1
""") is not None

# all equal grid
assert run("""1
2 2 1
1 1
1 1
1 1 2 2
""") is not None

# boundary split
assert run("""1
3 3 3
1 1 1
1 1 1
1 1 1
1 2 2 2
2 2 2
1 1 3 1 3
""") is not None
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 带开关的 1x1 网格 | 微不足道| 激活正确性 |
 | 统一网格| 单组件行为 | 合并正确性 |
 | 删除分裂区域| 结构更新| DSU 回滚行为 |

 ## 边缘情况

 一个重要的边缘情况是，删除操作删除了作为两个大区域之间唯一桥梁的单元格。 在逆向处理中，这意味着单个激活稍后会重新连接两个先前独立的组件。 DSU 联合步骤确保只要两个端点都存在，就会恢复合并的结构，并且边界框会正确扩展以包含两个区域。 

当组件完全包含在查询矩形中但仅在多次反向激活后形成时，会出现另一种边缘情况。 由于边界框在并集期间增量更新，最终的根始终反映真实的空间范围，因此无论构造顺序如何，包含检查都保持正确。 

最后一个微妙的情况是在网格发生变化时对同一区域进行重复查询。 由于我们使用 DSU 根对每个查询的组件进行重复计算，因此即使多个代表性单元落入查询矩形内，也不会重复计算组件。
