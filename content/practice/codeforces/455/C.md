---
title: "CF 455C - 文明"
description: "该图由通过道路连接的城市组成。 任何两个相连的城市之间只有一条简单路径的条件意味着每个相连的组件都是一棵树。 由于图可能是断开的，所以整个图就是一个森林。"
date: "2026-05-30T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dp", "dsu", "ternary-search", "trees"]
categories: ["algorithms"]
codeforces_contest: 455
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 260 (Div. 1)"
rating: 2100
weight: 455
solve_time_s: 121
verified: true
draft: false
---

[CF 455C - 文明](https://codeforces.com/problemset/problem/455/C)

 **评分：** 2100
 **标签：** dfs 和类似、dp、dsu、三元搜索、树
 **求解时间：** 2m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该图由通过道路连接的城市组成。 任何两个相连的城市之间只有一条简单路径的条件意味着每个相连的组件都是一棵树。 由于图可能是断开的，所以整个图就是一个森林。 

有两类操作必须在线处理。 

第一个操作询问包含给定城市的连接组件的直径。 这里，直径是树内最长路径的长度。 

第二个操作通过在第一个组件中的某个城市和第二个组件中的某个城市之间添加一条新边来合并两个连接的组件。 我们可以自由选择这条新边的端点，但我们必须选择它们以使生成的树的直径尽可能小。 

该图最初包含最多$3 \cdot 10^5$顶点和最多$3 \cdot 10^5$查询。 每次合并后从头开始重新计算直径的任何解决方案都会立即变得太慢。 即使单个 DFS 也超过整个组件的成本$O(n)$，并且在最坏的情况下，对许多查询执行此操作将导致数百亿次操作。 

关键的挑战是组件会随着时间的推移而变化。 我们需要一种方法来在组件合并时有效地维持每个连接组件的直径。 

一些边缘情况很容易被错误处理。 

考虑两个孤立的顶点：```
2 0 2
2 1 2
1 1
```合并后，生成的树有一条边，因此直径为 1。假设直径永远不会从 0 增加的解决方案是错误的。 

考虑合并已经属于同一棵树的组件：```
3 2 2
1 2
2 3
2 1 3
1 1
```合并操作不应该执行任何操作。 答案仍然是 2。无论如何，意外应用直径更新公式都会破坏存储的值。 

另一个微妙的情况是最佳新边缘未连接到直径的端点。 

假设我们合并两条长度为 4 的路径。连接直径端点会产生直径 9，这很糟糕。 最佳选择是连接两棵树的中心，产生直径 5。任何只关注直径端点的方法都会失败。 

## 方法

 强力解决方案将明确维护每个连接的组件。 每当查询要求直径时，我们可以运行两次 DFS 遍历来计算它。 每当两个组件合并时，我们都会添加边并继续。 

标准树直径技巧之所以有效，是因为从任意节点运行 DFS 会找到一个直径端点，然后从该端点再次运行 DFS 会找到直径长度。 问题是成本。 单个直径计算需要遍历整个组件。 高达$3 \cdot 10^5$查询，最坏的情况大致变成$O(nq)$，远远超出了极限。 

改变一切的观察结果是合并操作并不要求我们构建实际的最佳边缘。 它只要求我们在以最佳方式连接两棵树后保持直径。 

假设两棵树的直径$d_1$和$d_2$。 

对于具有直径的树$d$，其半径为：$$r = \left\lceil \frac{d}{2} \right\rceil$$半径是从选定中心到所有顶点的最小可能最大距离。 

当最佳地合并两棵树时，我们连接它们的中心。 任何其他选择都只能使最长的路径变得更大。 

所得直径变为：$$\max\left(d_1,\ d_2,\ r_1 + r_2 + 1\right)$$前两个术语完全覆盖一棵原始树内的路径。 第三个术语涵盖了跨越新边缘的路径。 

这意味着我们只需要每个连接组件的一条信息：它的直径。 

由于连接的组件是动态合并的，因此不相交集并集是一个完美的选择。 每个 DSU 根存储其组件的直径。 合并操作组合两个 DSU 集并使用上面的公式更新存储的直径。 

剩下的任务是计算每棵树的初始直径。 由于图是一个森林，我们可以使用标准的双 DFS 直径计算来处理每个连接的组件一次。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(n) | 太慢了 |
 | 最佳| O((n + q) α(n)) | O((n + q) α(n)) | O(n) | 已接受 |

 ## 算法演练

 1. 从输入边构建森林。 
2. 使用DFS 识别每个连接的组件。 
3. 对于每个组件，使用两次遍历计算其直径。 

首先找到距任意起点最远的顶点。 然后从最远的顶点开始，再次找到最大距离。 该距离就是树的直径。 
4. 初始化DSU结构。 

每个连接的组件成为一个 DSU 集，根存储该组件的直径。 
5. 对于类型1的查询，找到代表所请求城市的DSU并输出存储的直径。 
6. 对于类型 2 的查询，找到两个城市的 DSU 代表。 
7. 如果两个代表相同，则不执行任何操作。 

这些城市已经属于同一组成部分。 
8. 否则计算：$$r_1=\left\lceil\frac{d_1}{2}\right\rceil,\quad r_2=\left\lceil\frac{d_2}{2}\right\rceil$$9. 计算新直径：$$d=\max(d_1,d_2,r_1+r_2+1)$$10. 合并两个 DSU 组并将这个新直径存储在生成的根中。 

### 为什么它有效

 每个 DSU 集始终准确地代表当前林的一个连接组件。 

最初，直径是通过标准树直径算法正确计算的。 对于合并操作，连接中心可以最小化可以通过新边的最大距离。 合并树中最长的路径必须完全留在第一棵树内、完全留在第二棵树内或穿过新边。 这三种可能性完全对应于：$$d_1,\quad d_2,\quad r_1+r_2+1$$取它们的最大值给出最佳合并树的真实直径。 由于每个联合都存储该值，因此每个 DSU 根存储正确直径的不变式在每次操作后仍然为真。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def solve():
    n, m, q = map(int, input().split())

    g = [[] for _ in range(n)]

    parent = list(range(n))
    size = [1] * n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union_initial(a, b):
        ra = find(a)
        rb = find(b)

        if ra == rb:
            return

        if size[ra] < size[rb]:
            ra, rb = rb, ra

        parent[rb] = ra
        size[ra] += size[rb]

    for _ in range(m):
        a, b = map(int, input().split())
        a -= 1
        b -= 1

        g[a].append(b)
        g[b].append(a)

        union_initial(a, b)

    diameter = [0] * n

    visited = [False] * n

    def bfs(start):
        dist = [-1] * n
        dist[start] = 0

        dq = deque([start])
        farthest = start

        while dq:
            v = dq.popleft()

            if dist[v] > dist[farthest]:
                farthest = v

            for to in g[v]:
                if dist[to] == -1:
                    dist[to] = dist[v] + 1
                    dq.append(to)

        return farthest, dist[farthest]

    for v in range(n):
        if visited[v]:
            continue

        stack = [v]
        component = []
        visited[v] = True

        while stack:
            cur = stack.pop()
            component.append(cur)

            for to in g[cur]:
                if not visited[to]:
                    visited[to] = True
                    stack.append(to)

        start = component[0]
        endpoint, _ = bfs(start)
        _, diam = bfs(endpoint)

        root = find(start)
        diameter[root] = diam

    def merge(a, b):
        ra = find(a)
        rb = find(b)

        if ra == rb:
            return

        d1 = diameter[ra]
        d2 = diameter[rb]

        new_d = max(
            d1,
            d2,
            (d1 + 1) // 2 + (d2 + 1) // 2 + 1
        )

        if size[ra] < size[rb]:
            ra, rb = rb, ra

        parent[rb] = ra
        size[ra] += size[rb]
        diameter[ra] = new_d

    ans = []

    for _ in range(q):
        query = list(map(int, input().split()))

        if query[0] == 1:
            x = query[1] - 1
            ans.append(str(diameter[find(x)]))
        else:
            x = query[1] - 1
            y = query[2] - 1
            merge(x, y)

    sys.stdout.write("\n".join(ans))

solve()
```该图在开始时就构建一次，因为在合并操作期间选择的实际端点并不重要。 只有最终的直径很重要。 

第一个 DSU 构造根据初始森林对顶点进行分组。 之后，使用经典的双 BFS 技术精确计算每个连接组件的直径一次。 

直径数组由 DSU 根索引。 每当两个组件合并时，都会使用半径公式直接从旧直径计算出新直径。 不需要遍历图。 

一个常见的错误是使用`d // 2`而不是`(d + 1) // 2`。 直径为 5 的树的半径是 3，而不是 2。天花板划分至关重要。 

另一个容易犯的错误是在检查两个顶点是否已属于同一 DSU 集之前更新直径。 合并公式仅对不同的组件有效。 

## 工作示例

 ### 示例 1

 输入：```
6 0 6
2 1 2
2 3 4
2 5 6
2 3 2
2 5 3
1 1
```初始状态：

 | 组件| 直径|
 | --- | --- |
 | {1} | 0 |
 | {2} | 0 |
 | {3} | 0 |
 | {4} | 0 |
 | {5} | 0 |
 | {6} | 0 |

 处理查询：

 | 查询 | 组件合并 | 新直径|
 | --- | --- | --- |
 | 2 1 2 | 2 1 2 {1} + {2} | 1 |
 | 2 3 4 | 2 3 4 {3} + {4} | 1 |
 | 2 5 6 | 2 5 6 {5} + {6} | 1 |
 | 2 3 2 | 2 3 2 直径 1 + 直径 1 | 3 |
 | 2 5 3 | 2 5 3 直径 1 + 直径 3 | 4 |
 | 1 1 | 1 答案| 4 |

 输出：```
4
```此示例显示了小树的重复合并。 仅直径更新公式就足够了，初始化后不需要图遍历。 

### 示例 2

 输入：```
5 4 3
1 2
2 3
3 4
4 5
1 1
2 2 5
1 3
```初始组件：

 | 组件| 直径|
 | --- | --- |
 | {1,2,3,4,5} | 4 |

 加工：

 | 查询 | 结果 |
 | --- | --- |
 | 1 1 | 1 4 |
 | 2 2 5 | 2 2 5 相同的组件 |
 | 1 3 | 4 |

 输出：```
4
4
```这表明必须忽略同一组件内的合并请求。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + q) α(n)) | O((n + q) α(n)) | 初始图处理是线性的，DSU 操作是摊销逆 Ackermann |
 | 空间| O(n) | 图、DSU 数组和辅助存储 |

 森林最多包含$3 \cdot 10^5$顶点和边。 线性预处理加上近恒定时间 DSU 操作很容易满足限制。 

## 测试用例```python
import sys
import io
from collections import deque

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n, m, q = map(int, input().split())

    g = [[] for _ in range(n)]

    parent = list(range(n))
    size = [1] * n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def unite(a, b):
        ra = find(a)
        rb = find(b)
        if ra == rb:
            return
        if size[ra] < size[rb]:
            ra, rb = rb, ra
        parent[rb] = ra
        size[ra] += size[rb]

    for _ in range(m):
        a, b = map(int, input().split())
        a -= 1
        b -= 1
        g[a].append(b)
        g[b].append(a)
        unite(a, b)

    diameter = [0] * n
    vis = [False] * n

    def bfs(s):
        dist = [-1] * n
        dist[s] = 0
        dq = deque([s])
        far = s

        while dq:
            v = dq.popleft()
            if dist[v] > dist[far]:
                far = v

            for to in g[v]:
                if dist[to] == -1:
                    dist[to] = dist[v] + 1
                    dq.append(to)

        return far, dist[far]

    for i in range(n):
        if vis[i]:
            continue

        stack = [i]
        vis[i] = True
        comp = []

        while stack:
            v = stack.pop()
            comp.append(v)

            for to in g[v]:
                if not vis[to]:
                    vis[to] = True
                    stack.append(to)

        a, _ = bfs(comp[0])
        _, d = bfs(a)

        diameter[find(comp[0])] = d

    def merge(a, b):
        ra = find(a)
        rb = find(b)

        if ra == rb:
            return

        nd = max(
            diameter[ra],
            diameter[rb],
            (diameter[ra] + 1) // 2 + (diameter[rb] + 1) // 2 + 1
        )

        if size[ra] < size[rb]:
            ra, rb = rb, ra

        parent[rb] = ra
        size[ra] += size[rb]
        diameter[ra] = nd

    out = []

    for _ in range(q):
        qry = list(map(int, input().split()))

        if qry[0] == 1:
            out.append(str(diameter[find(qry[1] - 1)]))
        else:
            merge(qry[1] - 1, qry[2] - 1)

    return "\n".join(out)

# provided sample
assert run(
"""6 0 6
2 1 2
2 3 4
2 5 6
2 3 2
2 5 3
1 1
"""
) == "4"

# single isolated node
assert run(
"""1 0 1
1 1
"""
) == "0"

# merge two isolated vertices
assert run(
"""2 0 2
2 1 2
1 1
"""
) == "1"

# same component merge should do nothing
assert run(
"""3 2 2
1 2
2 3
2 1 3
1 2
"""
) == "2"

# chain of length four
assert run(
"""5 4 1
1 2
2 3
3 4
4 5
1 3
"""
) == "4"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单个孤立顶点| 0 | 最小图形尺寸|
 | 两个孤立的顶点合并 | 1 | 直径从0开始增长|
 | 合并到同一组件内 | 2 | 正确的 DSU 处理 |
 | 长度为 4 的路径 | 4 | 初始直径计算 |
 | 案例案例| 4 | 完整的工作流程 |

 ## 边缘情况

 考虑两个孤立的顶点：```
2 0 2
2 1 2
1 1
```两个分量都从直径 0 开始。合并公式给出：$$\max(0,0,0+0+1)=1$$查询正确返回：```
1
```考虑在同一组件内进行合并：```
3 2 2
1 2
2 3
2 1 3
1 2
```DSU 代表是平等的，因此合并操作立即退出。 存储的直径仍为2，答案为：```
2
```考虑合并两条长度为 4 的路径。 每棵树的直径为 4，半径为 2。 

公式给出：$$\max(4,4,2+2+1)=5$$连接中心可达到直径 5。连接端点将创建直径 9。该算法始终存储最佳值，因为它依赖于基于半径的公式而不是任何特定的边缘选择。 

最后，自然地处理孤立的顶点。 它们的直径为 0，半径也为 0，并且所有公式在没有特殊情况下仍然有效。
