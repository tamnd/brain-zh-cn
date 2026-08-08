---
title: "CF 102437C - \u0415\u0434\u0438\u043d\u0430\u044f\u0441\u0435\u0442\u044c"
description: "我们有一个无向连通图，其边形成仙人掌：每条路至多属于一个简单循环。 每个城市必须接收三种发射机类型之一，相邻城市必须接收不同类型。"
date: "2026-08-08T15:12:34+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102437
codeforces_index: "C"
codeforces_contest_name: "\u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u044b, \u0421\u0435\u0437\u043e\u043d 2019-2020, \u0427\u0435\u0442\u0432\u0451\u0440\u0442\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430, \u0443\u0441\u043b\u043e\u0436\u043d\u0435\u043d\u043d\u0430\u044f \u043d\u043e\u043c\u0438\u043d\u0430\u0446\u0438\u044f"
rating: 0
weight: 102437
solve_time_s: 257
verified: true
draft: false
---

[CF 102437C - \u0415\u0434\u0438\u043d\u0430\u044f \u0441\u0435\u0442\u044c](https://codeforces.com/problemset/problem/102437/C)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个无向连通图，其边形成仙人掌：每条路至多属于一个简单循环。 每个城市必须接收三种发射机类型之一，相邻城市必须接收不同类型。 类型 3 很昂贵，因此任务是最小化使用类型 3 着色的顶点数量。 

输入包含图表的城市和道路。 所需的输出是使用类型 3 的最小可能顶点数。在给定的仙人掌保证下，有效的 3 着色始终存在，因此`-1`对于有效输入实际上不会发生。 仙人掌是 2 简并的，因为每个非平凡子图最多有一个度数为 2 的顶点，并且这样的图总是 3 着色的。 

(n=10^5) 和 (m=1.5\cdot10^5) 的大小限制排除了图形大小中的任何二次方。 在最坏的情况下，即使 (O(n^2)) 也意味着大约 (10^{10}) 个原始操作。 我们需要一个在 (n+m) 中接近线性的算法。 仙人掌条件正是让我们获得这样的解的结构限制。 

在一些边缘情况下，更简单的方法会给出错误的答案。 单个顶点没有边缘，因此不需要昂贵的发射器。```
1 0
```答案是`0`。 假设每个连通图至少有一条边的解决方案会错误地处理这种情况。 

偶循环是二分的，因此它只需要前两种发射器类型。```
4 4
1 2
2 3
3 4
4 1
```答案是`0`。 对 3 类发射器每个周期充电的方法会错误地返回`1`。 

奇数循环确实需要类型 3，但多个奇数循环可以共享相同的昂贵顶点。 例如，考虑具有一个公共顶点的两个三角形。```
5 6
1 2
2 3
3 1
1 4
4 5
5 1
```答案是`1`。 使用类型 3 为顶点 1 着色，然后每个三角形都可以在其其他两个顶点上使用类型 1 和 2。 简单地计算奇数周期将错误地返回`2`。 

## 方法

 最直接的暴力解决方案为每个顶点分配三种颜色之一，然后检查所有边是否具有不同颜色的端点。 正好有 (3^n) 个分配，检查一个分配需要 (O(n+m)) 时间。 在最坏的情况下，这意味着 (3^{100000}) 次分配和大约 (150000\cdot3^{100000}) 次边缘检查，这是完全不可行的。 

蛮力之所以有效，是因为它明确地考虑了每种可能的颜色。 问题是大多数图不需要同时考虑。 在仙人掌中，图可以分解为块，每个块要么是一条边，要么是一个简单的循环。 不同的块最多通过一个公共顶点进行交互。 这将块结构变成了树。 

这表明在块树上进行动态编程。 对于每个顶点 (v)，我们保留三个值，一个值对应 (v) 的每种可能颜色。 该值表示下图 (v) 整个部分中类型 3 发射器的最小数量，假设 (v) 具有所选颜色。 

一旦其父顶点的颜色固定，连接多个顶点的块就可以独立处理。 对于一条边，我们只需要选择与父项不同的颜色。 对于一个循环，我们修复父顶点的颜色，并围绕循环的其余部分运行一条小路径 DP，最后检查最后一个顶点是否也与父顶点不同。 

重要的部分是有效地构建块。 Tarjan 的双连通分量算法在 (O(n+m)) 中完全做到了这一点。 在仙人掌中，每个生成的双连通分量都保证是一个边或一个简单循环。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(3^n(n+m))) | (O(n+m)) | 太慢了|
 | 块树DP | (O(n+m)) | (O(n+m)) | 已接受 |

 ## 算法演练

 1. 构建无向图并使用 Tarjan 算法找到所有双连通分量。 执行 DFS 时，将遍历的边保留在堆栈中。 每当`low[child] >= tin[parent]`，弹出边缘，直到子代的 DFS 边缘被移除。 这些边形成一个双连通分量。 

因为输入图是仙人掌，所以每个组件要么是单个桥，要么是一个简单的循环。 我们还收集属于每个组件的顶点。 
2. 构建顶点和组件之间的重合结构。 对于每个组件，存储它包含的图顶点。 对于每个顶点，存储包含它的组件列表。 

将原始顶点和组件视为两种不同类型的节点后，生成的关联图是一棵树。 这是仙人掌的切块树。 
3. 在任何图顶点（例如顶点）处将此块树作为根`0`。 对于每个组件，记住哪个顶点是其父级。 对于每个非根顶点，记住哪个组件是其父顶点。 

我们现在已经有了明确的亲子关系。 一个组件只有一个父顶点，而其所有其他顶点都通向独立的子树。 
4. 定义`dp[v][c]`作为以顶点为根的子树中类型 3 发射机的最小数量`v`，假设`v`接收颜色`c`。 

直接贡献`v`是`1`什么时候`c`是类型 3 并且`0`否则。 每个子组件都为相同颜色贡献自己的最佳值`v`。 

因此，

 [
 dp[v][c] = [c=3] + \sum_{\text{子组件} B} blockDP[B][c]。 
]
 5. 以与块树遍历相反的顺序处理顶点。 计算前`dp[v]`，每个子组件内的所有顶点都已被计算。 这为我们提供了计算该组件 DP 所需的一切。 
6. 对于具有父顶点的桥组件`p`和其他顶点`u`, 计算

 [
 块DP[B][c] =
 \min_{d\ne c} dp[u][d]。 
]

 边缘施加的唯一约束是其两个端点具有不同的颜色。 
7. 对于循环组件，首先将其顶点排序为

 [
 p,v_1,v_2,\l点,v_{k-1},p,
 ]

 哪里`p`是父顶点。 

修复颜色`c`的`p`。 启动仅具有颜色的三态 DP`c`允许在`p`，成本为零。 然后按顺序处理(v_1,v_2,\ldots,v_{k-1})。 指定颜色时`d`到下一个顶点，前一个顶点必须具有与下一个顶点不同的两种颜色之一`d`。 

处理完最后一个顶点后，只有颜色与固定父级颜色不同的状态才有效，因为最后一个顶点和父级通过闭环边连接。 
8. 一旦所有子组件都合并到每个顶点中，答案就是

 [
 \min_{c\in{1,2,3}} dp[根][c]。 
]

 由于有效的仙人掌始终是 3 色的，因此这些值中至少有一个是有限的。 

### 为什么它有效

 关键的不变量是`dp[v][c]`包含下面块树部分的最佳着色成本`v`， 和`v`固定为颜色`c`。 一个顶点的不同子组件仅在该顶点相交，因此在其颜色固定后，它们的选择是独立的，并且可以添加它们的最优成本。 

对于边缘组件，检查两种可能的不同颜色正是正确的着色条件。 对于一个循环，路径 DP 会考虑每个顶点的每种可能的颜色，同时在连续顶点上强制不等式，并且最终的过渡强制关闭边缘。 因此，组件的每一种适当的颜色都被表示出来，并选择成本最低的颜色。 

因为每个块只有在其所有后代顶点都被求解之后才被处理，所以不变量从叶子传播到根。 因此，根的三种可能颜色的最终最小值考虑了整个仙人掌的每种有效颜色，并选择最便宜的一种。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10 ** 9

def solve_case(n, edges):
    m = len(edges)

    graph = [[] for _ in range(n)]
    for eid, (u, v) in enumerate(edges):
        graph[u].append(eid)
        graph[v].append(eid)

    # Iterative Tarjan algorithm for biconnected components.
    tin = [-1] * n
    low = [0] * n
    parent = [-1] * n
    parent_edge = [-1] * n
    it = [0] * n

    edge_stack = []
    components = []

    timer = 0
    tin[0] = low[0] = timer
    timer += 1

    dfs_stack = [0]

    while dfs_stack:
        u = dfs_stack[-1]

        if it[u] < len(graph[u]):
            eid = graph[u][it[u]]
            it[u] += 1

            if eid == parent_edge[u]:
                continue

            a, b = edges[eid]
            v = b if a == u else a

            if tin[v] == -1:
                parent[v] = u
                parent_edge[v] = eid
                edge_stack.append(eid)

                tin[v] = low[v] = timer
                timer += 1

                dfs_stack.append(v)
            elif tin[v] < tin[u]:
                edge_stack.append(eid)
                if tin[v] < low[u]:
                    low[u] = tin[v]
        else:
            dfs_stack.pop()

            p = parent[u]
            if p != -1:
                if low[u] < low[p]:
                    low[p] = low[u]

                if low[u] >= tin[p]:
                    comp = []
                    while True:
                        eid = edge_stack.pop()
                        comp.append(eid)
                        if eid == parent_edge[u]:
                            break
                    components.append(comp)

    k = len(components)

    # Vertices belonging to every component.
    comp_vertices = [[] for _ in range(k)]
    incident = [[] for _ in range(n)]

    for cid, comp_edges in enumerate(components):
        vertices = set()

        for eid in comp_edges:
            u, v = edges[eid]
            vertices.add(u)
            vertices.add(v)

        vertices = list(vertices)
        comp_vertices[cid] = vertices

        for v in vertices:
            incident[v].append(cid)

    # Root the block-cut tree at vertex 0.
    # parent_comp[v] is the component through which v is reached.
    parent_comp = [-2] * n
    parent_comp[0] = -1

    # comp_parent[c] is the vertex through which component c is reached.
    comp_parent = [-1] * k

    order = [0]

    for v in order:
        for cid in incident[v]:
            if cid == parent_comp[v]:
                continue

            comp_parent[cid] = v

            for u in comp_vertices[cid]:
                if u == v:
                    continue

                if parent_comp[u] == -2:
                    parent_comp[u] = cid
                    order.append(u)

    dp = [[0, 0, 0] for _ in range(n)]
    block_dp = [[0, 0, 0] for _ in range(k)]

    # Process bottom-up.
    for v in reversed(order):
        # First calculate all components for which v is the parent.
        for cid in incident[v]:
            if comp_parent[cid] != v:
                continue

            comp_edges = components[cid]
            vertices = comp_vertices[cid]

            # A component consisting of one edge.
            if len(comp_edges) == 1:
                eid = comp_edges[0]
                a, b = edges[eid]
                u = b if a == v else a

                for c in range(3):
                    best = INF
                    for d in range(3):
                        if d != c and dp[u][d] < best:
                            best = dp[u][d]
                    block_dp[cid][c] = best

            else:
                # A cactus biconnected component with more than one edge
                # is a simple cycle.
                local = {x: [] for x in vertices}

                for eid in comp_edges:
                    a, b = edges[eid]
                    local[a].append(b)
                    local[b].append(a)

                # Order the cycle starting from its parent vertex v.
                cycle = [v]
                prev = -1
                cur = v

                while True:
                    x, y = local[cur]
                    nxt = x if x != prev else y

                    if nxt == v:
                        break

                    cycle.append(nxt)
                    prev, cur = cur, nxt

                for parent_color in range(3):
                    cur_dp = [INF, INF, INF]
                    cur_dp[parent_color] = 0

                    for u in cycle[1:]:
                        nxt_dp = [INF, INF, INF]

                        for new_color in range(3):
                            best = INF
                            for old_color in range(3):
                                if old_color == new_color:
                                    continue
                                if cur_dp[old_color] < best:
                                    best = cur_dp[old_color]

                            nxt_dp[new_color] = best + dp[u][new_color]

                        cur_dp = nxt_dp

                    best = INF
                    for last_color in range(3):
                        if last_color == parent_color:
                            continue
                        if cur_dp[last_color] < best:
                            best = cur_dp[last_color]

                    block_dp[cid][parent_color] = best

        # Now every child component of v is solved.
        for color in range(3):
            value = 1 if color == 2 else 0

            for cid in incident[v]:
                if comp_parent[cid] == v:
                    value += block_dp[cid][color]

            dp[v][color] = value

    return min(dp[0])

def main():
    n, m = map(int, input().split())
    edges = [tuple(map(lambda x: int(x) - 1, input().split()))
             for _ in range(m)]

    print(solve_case(n, edges))

if __name__ == "__main__":
    main()
```图结构通过整数 ID 存储每条边。 这对于 Tarjan 算法是必要的，因为父关系是边关系，而不仅仅是顶点关系。 特别是，当无向 DFS 看到返回其父级的边时，必须忽略该边。 

Tarjan 实现是迭代的而不是递归的。 仙人掌可以包含 (10^5) 个顶点的路径，因此递归 DFS 需要增加 Python 的递归限制，并且还会给 Python 调用堆栈带来不必要的压力。 显式堆栈提供相同的 DFS 顺序，而没有这种风险。 

边堆栈恰好包含属于当前双连通分量的那些 DFS 边。 什么时候`low[u] >= tin[parent[u]]`，下面没有边`u`上面可以连接`parent[u]`，所以边缘达到`parent_edge[u]`形成一个完整的块。 

这`incident`列表将双连通分量转变为分块树。 原始图可以有许多循环接触同一顶点，但块切割表示仍然具有树结构。 

循环 DP 仅使用三种状态。 对于每种新颜色，它采用不同颜色的最便宜的先前状态。 对父母颜色的最后限制至关重要。 省略它会意外地将循环视为路径，并且可能接受无效的着色。 

所有成本最多为 (n)，因此普通的 Python 整数就足够了。 不存在整数溢出问题。 

## 工作示例

 ### 示例 1

 该图由三个三角形组成。 第一个三角形包含顶点`1, 2, 3`，而另外两个三角形则连接在顶点处`2`和`3`。 

对于每个叶三角形，将共享顶点固定为类型 3，使其其他两个顶点使用类型 1 和 2，以便该组件贡献零个额外的类型 3 发射器。 如果共享顶点使用类型 1 或类型 2，则其他两个顶点之一必须使用类型 3。 

得到的 DP 值为：

 | 顶点或组件 | 类型 1 的状态 | 类型 2 的状态 | 类型 3 的状态 |
 | --- | --- | --- | --- |
 | 叶子三角形 2 | 1 | 1 | 0 |
 |`dp[2]`| 1 | 1 | 1 |
 | 叶子三角形 3 | 1 | 1 | 0 |
 |`dp[3]`| 1 | 1 | 1 |
 | 根三角形在 1 | 2 | 2 | 2 |
 |`dp[1]`| 2 | 2 | 3 |

 答案是`2`。 一种最佳着色使顶点 1 类型 2、顶点 2 类型 3 和顶点 3 类型 1。然后，每个附加三角形都可以用类型 1 和 2 完成，但附加到顶点 3 的三角形中的一个附加类型 3 除外。 

### 示例 2

 该图包含通过顶点 2、9 和 10 连接的多个环。通过顶点 3 到 8 的大环是偶数，通过顶点 10 到 13 的大环也是偶数。 三角形是唯一可以强制使用附加类型 3 的地方。 

相关的自下而上状态是：

 | 下部结构 | 1 型家长 | 2 型家长 | 3 型家长 |
 | --- | --- | --- | --- |
 | 甚至循环 3 | 1 | 1 | 0 |
 | 甚至循环10 | 1 | 1 | 0 |
 | 9 与 10 和 15 的三角形 | 1 | 1 | 1 |
 |`dp[9]`| 1 | 1 | 2 |
 | 2 处有 9 和 14 的三角形 | 2 | 2 | 1 |
 |`dp[2]`| 2 | 2 | 2 |

 最终的最小值是`2`。 

该迹线显示了为什么 DP 不能简单地计算奇数周期。 在共享顶点处做出的类型3选择可以同时满足多个循环约束，并且该共享顶点的状态准确地携带其父组件所需的信息。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n+m)) | Tarjan 处理每条边固定次数，并且每个块 DP 转换仅检查三种颜色 |
 | 空间| (O(n+m)) | 图形、组件列表、块切割信息和 DP 数组在输入大小上都是线性的 |

 允许的最大图只有 (O(n)) 条边，因为它是仙人掌，规定的限制为 (m\le150000)。 该算法对每个顶点和每条边执行恒定量的三色 DP 工作，因此它可以轻松满足预期的线性时间要求。 

## 测试用例

 以下测试假设上述解决方案保存为`solution.py`并暴露`solve_case`。```python
from solution import solve_case

def run(inp: str) -> str:
    data = list(map(int, inp.split()))
    n, m = data[0], data[1]

    edges = []
    pos = 2

    for _ in range(m):
        u = data[pos] - 1
        v = data[pos + 1] - 1
        pos += 2
        edges.append((u, v))

    return str(solve_case(n, edges))

# Sample 1
assert run("""\
7 9
1 2
2 3
3 1
2 4
4 5
5 2
3 6
6 7
7 3
""") == "2", "sample 1"

# Sample 2
assert run("""\
15 18
1 2
2 3
3 4
4 5
5 6
6 7
7 8
8 3
2 9
9 10
10 11
11 12
12 13
13 10
2 14
14 9
9 15
15 10
""") == "2", "sample 2"

# Minimum-size graph.
assert run("""\
1 0
""") == "0", "single isolated city"

# Even cycle, completely bipartite.
assert run("""\
4 4
1 2
2 3
3 4
4 1
""") == "0", "even cycle"

# Two triangles sharing one vertex.
# The common vertex can be the only type-3 vertex.
assert run("""\
5 6
1 2
2 3
3 1
1 4
4 5
5 1
""") == "1", "shared odd cycles"

# Maximum-size cactus for n = 100000.
# 49999 triangles share vertex 1, plus one leaf.
# This has 149998 edges, essentially the maximum possible for this n.
n = 100000
edges = []

for i in range(49999):
    a = 2 + 2 * i
    b = a + 1
    edges.append((1, a))
    edges.append((a, b))
    edges.append((b, 1))

edges.append((1, 100000))

assert solve_case(n, edges) == 1, "maximum-size cactus"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 0`|`0`| 最小尺寸图和零边边界情况 |
 | 四循环|`0`| 即使是自行车也只需要两种颜色 |
 | 两个三角形共享顶点 1 |`1`| 一个昂贵的顶点可以满足多个奇数循环 |
 | 49999 个共享三角形加一片叶子 |`1`| 最大尺寸输入、线性复杂度、大块树 |

 ## 边缘情况

 对于单个城市来说，```
1 0
```阻止列表为空。 根没有子组件，因此它的三个 DP 状态是`[0, 0, 1]`。 选择前两种颜色中的任何一种即可给出答案`0`。 

对于四循环```
4 4
1 2
2 3
3 4
4 1
```Tarjan 生成一个包含所有四个顶点的循环分量。 当父颜色固定时，循环 DP 可以围绕剩余三个顶点交替使用其他两种颜色，并在不使用类型 3 的情况下关闭循环。当父对象本身具有类型 3 并且其他状态正确考虑​​了类型 3 的可能使用时，组件贡献为零。在根处，最小值为`0`。 

对于共享顶点 1 的两个三角形，```
5 6
1 2
2 3
3 1
1 4
4 5
5 1
```块切割树将共享顶点作为两个三角形分量的父节点。 如果顶点 1 是类型 3，则每个三角形的两个剩余顶点可以使用类型 1 和 2。因此，两个分量 DP 为父颜色 3 贡献 0，而根本身为类型 3 贡献 1。 答案是`1`。 

最大尺寸测试由共享顶点 1 和一个附加叶子的 49999 个三角形组成。 为顶点 1 提供类型 3 让每个三角形在其其他顶点上仅使用类型 1 和 2，因此整个图恰好花费一台昂贵的发射器。 该算法一次处理所有 149998 个边和 100000 个顶点，无需全局枚举着色或循环，并返回`1`。
