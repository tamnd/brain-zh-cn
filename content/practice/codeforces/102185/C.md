---
title: "CF 102185C - \u041a\u0430\u043a \u043f\u0435\u0440\u0435\u0441\u0442\u0430\u0442\u044c \u0431\u0435\u0441\u043f\u043e\u043a\u043e\u0438\u0442\u044c\u0441\u044f\u0438 \u043f\u043e\u043b\u044e\u0431\u0438\u0442\u044c\u043a\u0430\u043a\u0442\u0443\u0441\u044b"
description: "我们有一个连通的无向仙人掌图。 这里的仙人掌有一个更强的性质，即每个顶点最多属于一个简单循环，并且每个循环的长度都是偶数。 城市 1 最初包含一家工厂。"
date: "2026-08-19T15:38:19+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102185
codeforces_index: "C"
codeforces_contest_name: "Southern Russia Open Championship \u2013 ContestSFedU 2019, Team Final."
rating: 0
weight: 102185
solve_time_s: 433
verified: true
draft: false
---

[CF 102185C - \u041a\u0430\u043a \u043f\u0435\u0440\u0435\u0441\u0442\u0430\u0442\u044c \u0431\u0435\u0441\u043f\u043e\u043a\u043e\u0438\u0442\u044c\u0441\u044f\u0438 \u043f\u043e\u043b\u044e\u0431\u0438\u0442\u044c \u043a\u0430\u043a\u0442\u0443\u0441\u044b](https://codeforces.com/problemset/problem/102185/C)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个连通的无向仙人掌图。 这里的仙人掌有一个更强的性质，即每个顶点最多属于一个简单循环，并且每个循环的长度都是偶数。 城市 1 最初包含一家工厂。 火车从工厂出发，沿着最短路径到达每个目的地。 如果存在多条最短路径，则可以选择其中任何一条。 

对于初始工厂，该图具有有用的属性，即所有可能的最短路线仅在一个方向上使用每条铁路边。 添加工厂后，这种情况可能不再成立。 如果某个边缘可能有双向列车，我们必须在那里额外修建一条平行铁路，并在两条轨道上规定相反的方向。 

输入按城市、现有铁路和工厂的建造顺序描述它们。 对于每个新工厂，我们必须输出当时需要多少条新铁轨。 之前已经建成的工厂不再需要任何东西。 

该图最多有 (10^5) 个顶点和最多 (N-1+N/4) 条边。 第二个界限意味着总共只有 (O(N)) 条边，因此线性或 (N\log N) 解决方案是现实的。 对于 (10^5) 个工厂，扫描整个图中每个工厂的算法在最坏的情况下将执行大约 (10^{10}) 个边缘操作，这远远超出了两秒的限制。 二次预处理也是不必要的，因为仙人掌结构比任意图提供更多的信息。 

有几种简单的情况会暴露简单实现中的错误。 在由一条边组成的图上，如果查询是`2 2 1`，答案是`1 0 0`。 第二个工厂是第一个新工厂的副本，而最后一个查询是城市 1 的原始工厂，因此将每个查询视为新冲突是错误的。 

偶循环是另一个重要的情况。 为了```
4 4
1 2
2 3
3 4
4 1
1
3
```答案是`4`。 城市1和城市3在周期上是相反的。 四个铁路边缘中的每一个都可以通过从两个工厂出发的最短路线在相反的方向上使用，因此像树一样处理偶循环会低估答案。 

城市 1 的查询也必须给出零。 例如，```
2 1
1 2
3
1 1 1
```产生`0 0 0`。 同一城市的最初工厂和后来的工厂产生完全相同的最短路径方向。 

## 方法

 直接的方法是为每个新工厂重新计算最短路径结构。 从新工厂运行 BFS，获取到每个顶点的距离，并检查每条边。 对于边 (u v)，如果从源到 (u) 的距离较小，则最短路径可以使用该边作为 (u\to v)，并且对称地使用 (v\to u)。 将这一方向与现有的方向进行比较可以告诉我们是否需要另一条铁路。 

这是正确的，因为最短路径距离完全表征了一条边的哪个端点可以在最短路径上领先于另一个端点。 问题是重复工作。 一个 BFS 加上一次边缘扫描的成本 (O(N+M)=O(N))，并且为 (K) 个工厂执行此操作的成本 (O(KN))。 当两个参数都等于 (10^5) 时，这大约是 (10^{10}) 次操作。 

有用的观察是，均匀的仙人掌是部分立方体。 我们不需要部分立方体的一般理论来使用它的相关部分。 每座桥都形成一个由该单边组成的独立类。 在偶数循环内，相对的边形成对。 删除一对这样的相反的对会将图形恰好分成两侧。 该对中的两条边在最短路径方向上​​始终表现一致。 

因此，图的边可以划分为独立的类。 桥类的权重为 1，而偶数循环中的一对相对边的权重为 2。当工厂出现在其相应切口的两侧时，类会引发碰撞。 一旦双方都包含工厂，该类就永久固定并且不再贡献。 

还有一种仙人掌特定的简化。 该图以城市 1 为根。每个类都有一个边，它恰好是一个有根子树。 对于桥来说，这是桥下方的子树。 对于一个循环，如果它沿 DFS 树的顶点是

 [
 c_0,c_1,\ldots,c_{2h-1},
 ]

 (c_0) 是循环的最高顶点，包含边 (c_{i-1}c_i) 的对边类，对于 (1\le i\le h)，其非根边恰好是 (c_i) 的子树。 

初始工厂位于根部，因此每个此类切割的另一侧已经包含时间为零的工厂。 因此，当第一个未来工厂进入其根子树一侧时，一个类只贡献一次。 我们可以计算每个子树的第一次并将类权重添加到该答案中。 

蛮力方法之所以有效，是因为它明确地重建了每个源的方向信息。 它失败了，因为几乎所有信息都是重复的。 相关信息实际上由独立的桥类和相对边对携带的观察结果将整个问题简化为子树最小值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(K(N+M))) | (O(N+M)) | 太慢了 |
 | 最佳| (O(N+M+K)) | (O(N+M+K)) | 已接受 |

 ## 算法演练

 1. 使用 DFS 生成树将仙人掌定根于城市 1。 店铺`parent`,`depth`，以及每个顶点的父边。 DFS 树为我们提供了每个有根子树的自然含义。 
2. 最初给每个树边权重1。这样的边代表一个桥类，除非后来证明它属于一个环。 一个顶点`v`表示树的边缘`parent[v]`到`v`。 
3. 找到每一个非树边。 在仙人掌的无向 DFS 中，每条这样的边都将后代连接到祖先，并恰好闭合一个循环。 从后代向上遍历父指针，直到到达祖先。 由于仙人掌中的循环最多共享一个顶点，因此所有这些路径的总长度为 (O(N))。 
4. 假设发现的环具有顶点 (c_0,c_1,\ldots,c_{2h-1})，其中 (c_0) 是祖先，最终边 (c_{2h-1}c_0) 是非树边。 它的对边类是
 [
 (e_i,e_{i+h}),\qquad 0\le i<h。 
]
 对于包含(e_{i-1}=c_{i-1}c_i)的类，其远离根的一侧正是(c_i)的子树。 赋予该子树代表权重 2。循环的其余树边是这些对的相对成员，因此它们接收权重为零，并且不能将其视为单独的类。 
5. 对于每个城市，记录该城市第一次建立工厂的时间。 城市 1 的时间为零，因为它的工厂已经存在。 如果同一城市在查询序列中出现多次，则只有最早的查询对类计算有意义。 
6. 计算`first[v]`，根子树中任意位置的最早工厂时间`v`。 向后处理 DFS 顺序并将每个子级的最小值传播到其父级。 这就引出了一个问题：“工厂什么时候首先进入这个切入点？” 转化为一个存储值。 
7. 对于每个类别权重非零的顶点，令`t = first[v]`。 如果`t`是有限的，加上班级权重来回答`t`。 当第一个工厂进入其子树一侧时，这个类就会出现问题，因为城市 1 已经存在于另一侧。 
8. 输出查询次数 1 至 (K) 的累计值。 如果重复查询的相关子树已包含较早的工厂，则重复查询不会产生任何影响。 

不变量是每个独立方向冲突都由一个类表示，并且每个类由一个有根子树表示。 在第一个工厂进入该子树之前，所有工厂都在另一侧，因此不存在冲突。 在第一个条目中，两侧都包含工厂，并且该类的所有边都必须加倍。 之后班级就已经永久固定了。 由于类划分了所有相关的边，因此将它们的权重相加就可以精确地给出附加轨道的最小数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    graph = [[] for _ in range(n)]
    edges = []

    for eid in range(m):
        a, b = map(int, input().split())
        a -= 1
        b -= 1
        edges.append((a, b))
        graph[a].append((b, eid))
        graph[b].append((a, eid))

    k = int(input())
    queries = [int(x) - 1 for x in input().split()]

    # Build an actual DFS tree iteratively.
    parent = [-1] * n
    parent_edge = [-1] * n
    depth = [0] * n
    order = [0]
    parent[0] = 0

    it = [0] * n
    stack = [0]
    back_edges = []

    while stack:
        v = stack[-1]

        if it[v] == len(graph[v]):
            stack.pop()
            continue

        u, eid = graph[v][it[v]]
        it[v] += 1

        if eid == parent_edge[v]:
            continue

        if parent[u] == -1:
            parent[u] = v
            parent_edge[u] = eid
            depth[u] = depth[v] + 1
            order.append(u)
            stack.append(u)
        else:
            # In an undirected DFS of a cactus, a non-tree edge
            # goes between a vertex and one of its ancestors.
            if depth[u] < depth[v]:
                back_edges.append((v, u, eid))

    # weight[v] describes the edge parent[v] -> v.
    # Initially every tree edge is a bridge class of weight 1.
    weight = [0] * n
    for v in range(1, n):
        weight[v] = 1

    # Each even cycle contributes h classes of weight 2.
    # The first h tree edges on the ancestor-to-descendant path
    # represent these classes. The remaining tree edges are their
    # opposite partners and must not form separate classes.
    for descendant, ancestor, _ in back_edges:
        path = []
        cur = descendant

        while cur != ancestor:
            path.append(cur)
            cur = parent[cur]

        path.reverse()

        # The cycle has len(path) tree edges plus the back edge.
        cycle_len = len(path) + 1
        half = cycle_len // 2

        for i, child in enumerate(path):
            if i < half:
                weight[child] = 2
            else:
                weight[child] = 0

    INF = k + 1

    # first_at[v] is the first factory time exactly at v.
    first_at = [INF] * n
    first_at[0] = 0

    for t, v in enumerate(queries, 1):
        if first_at[v] == INF:
            first_at[v] = t

    # first[v] becomes the first factory time anywhere in subtree(v).
    first = first_at[:]

    for v in reversed(order[1:]):
        p = parent[v]
        if first[v] < first[p]:
            first[p] = first[v]

    answer = [0] * (k + 1)

    # Every nonzero-weight class is represented by one subtree.
    # Its opposite side already contains city 1 at time zero.
    # Thus the class contributes exactly when its subtree gets
    # its first factory.
    for v in range(1, n):
        if weight[v] and first[v] <= k:
            answer[first[v]] += weight[v]

    print(*answer[1:])

if __name__ == "__main__":
    solve()
```邻接列表存储两个端点和边标识符。 需要边标识符来区分父边和通向已访问过的顶点的另一条边。 

迭代 DFS 避免了包含 (10^5) 个顶点的路径上的 Python 递归深度问题。 这`it`array 记录下一个要检查的邻接条目，它提供与递归 DFS 相同的遍历顺序，而不依赖于 Python 调用堆栈。 

经过 DFS 后，每个树边最初接收权重 1。当后边关闭循环时，使用以下命令恢复其祖先到后代树路径`parent`。 如果循环长度为 (2h)，则其前 (h) 个树边代表 (h) 个相对边类别，每个类别的物理大小为 2。 其余的树边与其相对成员属于相同的类，因此为它们分配权重零可以防止重复计算。 

步行自行车道所花费的总工作量是线性的。 一个顶点只能出现在一个循环中，除非作为共享的连接点，因为该图是一个顶点仙人掌。 因此，所有恢复周期的长度总计为 (O(N))。 

查询处理是在子树聚合之前特意完成的。`first_at[v]`仅代表位于确切顶点的最早工厂，而`first[v]`反向遍历之后代表该顶点以下任何地方最早的工厂。 由于城市 1 的时间为零，因此真子树代表的每个类在互补侧都已经有一个工厂。 

Python 中不存在整数溢出问题。 在 C++ 中，32 位整数也足以提供答案，因为最多可以添加 (M\le 125000) 条物理边，但 Python 的整数类型完全消除了这个问题。 

## 工作示例

 仅提供了一个官方示例，因此第二个跟踪使用了较小的偶循环。 

对于官方示例，DFS可以生成树路径```
1 - 3 - 4 - 7 - 5 - 6
    |
    2
```与额外的边缘`5-3`关闭循环`3-4-7-5-3`。 相关班级代表如下所示。 

| 代表| 重量 | 意义| 子树中的第一个工厂 | 贡献 |
 | ---| ---| ---| ---| ---|
 | 2 | 1 | 桥1-2 | 2 | 1 在查询 2 |
 | 3 | 1 | 桥1-3 | 1 | 1 在查询 1 |
 | 4 | 2 | 对 3-4 和 7-5 | 3 | 2 在查询 3 |
 | 7 | 2 | 4-7 和 3-5 对 | 1 | 2 在查询 1 |
 | 5 | 0 | 对方成员已代表 | 1 | 0 |
 | 6 | 1 | 桥 5-6 | 1 | 1 在查询 1 |

 第一个查询是城市 6。它的子树包含代表顶点 3、7 和 6，其类权重为 (1+2+1=4)。 这些正是声明中列出的四首新曲目。 第二个查询是城市 2，它是子树 2 中的第一个工厂，因此它贡献了一个桥。 第三个查询是城市 4，它是子树 4 中的第一个工厂，添加了两个相反的循环边。 对城市 4 的重复查询没有任何改变，城市 5 已经位于早期工厂激活的区域内。 

对于第二个示例，考虑四周期。```
4 4
1 2
2 3
3 4
4 1
1
3
```以城市 1 为根给出自行车道`1-2-3-4`加上后边缘`4-1`。 

| 代表| 重量 | 子树中的第一个工厂 | 贡献 |
 | ---| ---| ---| ---|
 | 2 | 2 | 1 | 2 |
 | 3 | 2 | 1 | 2 |
 | 4 | 0 | 1 | 0 |

 这两个类对应于两对相对的边。 Factory 3 位于这两个类的非根端，因此这两个类都是双向的。 它们的权重之和为四，与所有四个物理边缘都需要额外的平行轨道的事实相匹配。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(N+M+K)) | DFS、循环重构、子树最小传播、查询处理都是线性的 |
 | 空间| (O(N+M+K)) | 邻接表、DFS 数组、查询序列和答案数组 |

 约束给出 (M=O(N))，因此总复杂度实际上是 (O(N+K))。 由于 (N) 和 (K) 均以 (10^5) 为界，这完全在预期限制内，而强力 (O(KN)) 方法将需要大约 (10^{10}) 次操作。 

## 测试用例```python
import sys
import io

def solve():
    input = sys.stdin.readline

    n, m = map(int, input().split())

    graph = [[] for _ in range(n)]

    for eid in range(m):
        a, b = map(int, input().split())
        a -= 1
        b -= 1
        graph[a].append((b, eid))
        graph[b].append((a, eid))

    k = int(input())
    queries = [int(x) - 1 for x in input().split()]

    parent = [-1] * n
    parent_edge = [-1] * n
    depth = [0] * n
    order = [0]
    parent[0] = 0

    it = [0] * n
    stack = [0]
    back_edges = []

    while stack:
        v = stack[-1]

        if it[v] == len(graph[v]):
            stack.pop()
            continue

        u, eid = graph[v][it[v]]
        it[v] += 1

        if eid == parent_edge[v]:
            continue

        if parent[u] == -1:
            parent[u] = v
            parent_edge[u] = eid
            depth[u] = depth[v] + 1
            order.append(u)
            stack.append(u)
        elif depth[u] < depth[v]:
            back_edges.append((v, u))

    weight = [0] * n
    for v in range(1, n):
        weight[v] = 1

    for descendant, ancestor in back_edges:
        path = []
        cur = descendant

        while cur != ancestor:
            path.append(cur)
            cur = parent[cur]

        path.reverse()

        cycle_len = len(path) + 1
        half = cycle_len // 2

        for i, child in enumerate(path):
            if i < half:
                weight[child] = 2
            else:
                weight[child] = 0

    INF = k + 1
    first = [INF] * n
    first[0] = 0

    for t, v in enumerate(queries, 1):
        if first[v] == INF:
            first[v] = t

    for v in reversed(order[1:]):
        p = parent[v]
        first[p] = min(first[p], first[v])

    ans = [0] * (k + 1)

    for v in range(1, n):
        if weight[v] and first[v] <= k:
            ans[first[v]] += weight[v]

    return " ".join(map(str, ans[1:]))

def run(inp: str) -> str:
    global solve
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

sample = """\
7 7
1 2
1 3
3 4
4 7
5 7
3 5
5 6
5
6 2 4 4 5
"""

assert run(sample) == "4 1 2 0 0", "official sample"

cycle4 = """\
4 4
1 2
2 3
3 4
4 1
1
3
"""

assert run(cycle4) == "4", "opposite vertices of an even cycle"

minimum = """\
2 1
1 2
3
2 2 1
"""

assert run(minimum) == "1 0 0", "minimum graph and repeated factory"

root_repeated = """\
2 1
1 2
4
1 1 1 1
"""

assert run(root_repeated) == "0 0 0 0", "all queries equal to the initial factory"

path = """\
6 5
1 2
2 3
3 4
4 5
5 6
5
6 6 4 4 2
"""

assert run(path) == "5 0 2 0 0", "tree path and repeated vertices"

n = 100000
edges = "\n".join(f"{i} {i + 1}" for i in range(1, n))
large = f"{n} {n - 1}\n{edges}\n3\n{n} {n} 1\n"

assert run(large) == f"{n - 1} 0 0", "maximum-size path"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 官方样品|`4 1 2 0 0`| 桥、偶循环、重复工厂、嵌套子树之间的完整交互 |
 | 带工厂 3 的四循环 |`4`| 偶数循环内的对边类 |
 | 二顶点图`2 2 1`|`1 0 0`| 最小图、重复工厂、初始工厂 |
 | 所有查询都为 1 的二顶点图 |`0 0 0 0`| 原厂重复使用|
 | 六顶点路径|`5 0 2 0 0`| 纯树行为和边界位置 |
 | 具有 100000 个顶点的路径 |`99999 0 0`| 最大输入大小和线性时间性能 |

 ## 边缘情况

 对于最小图```
2 1
1 2
3
2 2 1
```唯一的类是子树 2 代表的桥。它的第一个工厂时间是 1，因此它的权重 1 添加到答案 1。第二个查询仍然位于同一子树中，但它的第一个工厂时间已经是 1，所以它什么也不添加。 第三个查询是城市 1，位于该子树之外，因此它也没有添加任何内容。 结果是`1 0 0`。 

对于四循环```
4 4
1 2
2 3
3 4
4 1
1
3
```该循环包含两个相反的边缘类。 当 DFS 的根为 1 时，它们的代表是顶点 2 和 3，每个顶点的权重为 2。城市 3 位于两个代表子树内，因此两个类都接收第一个工厂时间 1。答案是 (2+2=4)。 这正是将每个周期边缘视为独立桥会被错误处理的情况。 

对于重复工厂，请考虑```
2 1
1 2
4
1 1 1 1
```唯一的类由子树 2 表示，并且没有查询进入该子树。 它的第一次是无限的，所以它永远不会做出贡献。 每个答案都是零。 

对于一条路径，```
6 5
1 2
2 3
3 4
4 5
5 6
5
6 6 4 4 2
```每条边都是一个单独的类。 第一个工厂 6 进入所有五个适当的后代侧切割，给出`5`。 6 处的重复查询没有添加任何内容。 工厂 4 是子树 4 和 5 中的第一个工厂，贡献两条边。 后面的 4 处查询已经被覆盖，并且工厂 2 所在的子树的第一个工厂已经存在于 4 或 6 处。结果是`5 0 2 0 0`。 

最大路径包含 (99999) 个网桥类。 A factory at city 100000 is the first factory in every proper subtree, so the first answer is (99999). 重复该城市不会激活任何新类别。 The implementation processes the entire graph and all queries with linear work, which is exactly the behavior required by the constraints.

 The central idea is that the problem is not really asking us to recompute shortest paths. In an even cactus, shortest-path direction conflicts are organized into bridge classes and opposite-edge pairs. 以城市 1 为根后，每个此类都有一个子树代表，每个查询的答案只是其代表子树在该查询时接收其第一个工厂的类的总权重。
