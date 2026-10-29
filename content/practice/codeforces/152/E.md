---
title: "CF 152E - 花园"
description: "我们有一个矩形网格，其中每个单元格都有一个成本，即如果我们用混凝土铺设该单元格则被破坏的花朵数量。 在所有牢房中，有多达七个包含重要建筑物的特殊牢房。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "dp", "graphs", "trees"]
categories: ["algorithms"]
codeforces_contest: 152
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 108 (Div. 2)"
rating: 2500
weight: 152
solve_time_s: 144
verified: true
draft: false
---

[CF 152E - 花园](https://codeforces.com/problemset/problem/152/E)

 **评分：** 2500
 **标签：** 位掩码、dp、图形、树
 **求解时间：** 2m 24s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个矩形网格，其中每个单元格都有一个成本，即如果我们用混凝土铺设该单元格则被破坏的花朵数量。 在所有牢房中，有多达七个包含重要建筑物的特殊牢房。 我们必须选择一组连接的铺好的单元格，使得每个重要的单元格都属于铺好的区域，并且每个重要的单元格都可以使用穿过铺好的单元格的 4 向移动到达其他的单元格。 

目标是最大限度地减少所有铺砌单元的成本总和。 

考虑网格的一种有用方法是将其视为加权图。 每个单元格都是一个顶点，相邻单元格通过边连接，进入一个单元格会花费其花数。 我们正在寻找包含所有终端的最小成本连通子图。 这正是网格图上的斯坦纳树问题。 

网格最多可以包含 200 个单元，这对于所有顶点上的图算法来说足够小。 终端数量最多为7个，这才是真正的线索。 一般的斯坦纳树问题是NP困难的，但当终端数量很小时，子集动态规划变得可行。 

对所有网格子集进行简单的子集枚举需要检查$2^{200}$状态，完全不可能。 甚至枚举终端之间的所有树或所有路径也会以组合方式爆炸。 

端子数量较少表明 DP 优于端子掩码。 自从$2^7 = 128$，我们可以为每个终端子集和每个小区维护一个 DP 状态。 

有几个容易被忽略的极端情况。 

一种微妙的情况是最佳解决方案重新访问多个终端连接共享的小区。 

例子：```
2 3 3
1 100 1
1 1 1
1 1
1 3
2 2
```最便宜的结构不是三个独立的最短路径。 中间底排充当共享走廊。 独立连接终端的贪婪策略会高估成本并产生非最优联合。 

另一个棘手的情况是两个终端相邻时。```
1 2 2
5 7
1 1
1 2
```答案必须以总成本 12 铺平两个单元格。将路径成本视为边成本而不是顶点成本的粗心实现可能会忘记包括一个端点。 

重建过程中出现了一个更微妙的问题。 不同的子集可以合并在同一单元中。```
3 3 3
1 1 1
1 100 1
1 1 1
1 1
1 3
3 2
```最佳树围绕廉价的外部单元合并并避开中心。 如果父跟踪仅存储最短路径松弛而不存储子集合并，即使 DP 值正确，重建也会失败。 

## 方法

 暴力方法是枚举网格单元的每个子集，检查它是否形成包含所有终端的连接组件，并计算其总成本。 网格最多有 200 个单元格，因此需要检查$2^{200}$子集，这是一个天文数字。 

一个稍微聪明一点的暴力想法是尝试所有可能的连接终端的树。 由于图本身有多达 200 个顶点和许多可能的 Steiner 点，因此候选树的数量仍然远远超出可行范围。 

关键的观察结果是重要细胞的数量极少。 当只有少数终端存在时，我们可以使用位掩码来描述连接要求。 

假设我们定义：$$dp[mask][v]$$作为连接铺设区域的最低成本，该区域恰好包含以下终端`mask`并在单元格处结束`v`， 意义`v`属于连通结构。 

现在问题开始看起来可以解决。 只有$2^k \le 128$掩模和最多 200 个单元格，因此状态总数约为 25,000 个。 

下一个观察是这些状态如何结合。 

如果两个连接的结构都在同一个单元格处结束`v`, 一个覆盖子集`A`和另一个覆盖子集`B`，然后将它们合并在`v`创建一个有效的连接结构`A ∪ B`。 

这给出了过渡：$$dp[A \cup B][v] = dp[A][v] + dp[B][v] - cost(v)$$我们减去一次单元成本，因为两个结构都已经计算了它。 

执行子集合并后，我们仍然需要跨网格移动。 从每个单元格中，我们可以像图上的最短路径一样放松邻居。 由于所有边缘添加都对应于支付邻居的小区成本，因此多源最短路径传播以最佳方式更新所有可到达的端点。 

这种子集 DP 和最短路径的组合就是经典的 Dreyfus-Wagner 风格的 Steiner Tree DP。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(2^{nm})$|$O(2^{nm})$| 太慢了|
 | 最佳 |$O(3^k \cdot nm + 2^k \cdot (nm)^2)$|$O(2^k \cdot nm)$| 已接受 |

 ## 算法演练

 1. 将每个网格单元转换为图顶点。 

给每个单元格一个整数 id。 四个基本方向上的相邻单元格相连。 
2. 定义DP状态。 

让：$$dp[mask][v]$$是包含所有航站楼的连接结构的最小总铺砌成本`mask`并在顶点结束`v`。 
3. 初始化单例掩码。 

如果终端`i`位于顶点`v`， 然后：$$dp[1 << i][v] = cost(v)$$因为仅包含该终端的最小连接结构是单个细胞本身。 
4. 将较小的子集合并为较大的子集。 

对于每个掩码和每个非空真子掩码：$$sub \subset mask$$更新：$$dp[mask][v] = \min( dp[mask][v], dp[sub][v] + dp[mask \oplus sub][v] - cost(v) )$$两个连接的结构在同一个单元中相遇`v`，产生更大的连接结构。 
5. 对每个掩模运行最短路径松弛。 

子集合并后，以一个单元结束的最佳结构可以扩展到相邻单元。 

由于所有成本都是正数，Dijkstra 自然而然地发挥作用。 

对于每个蒙版，从具有初始距离的所有顶点开始运行 Dijkstra`dp[mask][v]`。 

放松自`u`到`to`添加`cost(to)`。 
6. 追踪家长信息。 

重建需要两种父母：

 首先，来自 Dijkstra 的最短路径父母。 

其次，子集拆分父项显示哪两个子掩码被合并。 
7. 找到最佳端点。 

答案是：$$\min_v dp[(1<<k)-1][v]$$任何端点都可以工作，因为结构本身是连接的。 
8. 重建使用过的细胞。 

递归地跟随父指针。 

每当一个状态来自子集合并时，就会递归到两个部分。 

每当状态来自最短路径松弛时，就会递归到前驱单元。 

将每个访问过的单元格标记为已铺砌。 

### 为什么它有效

 DP 不变量为：$$dp[mask][v]$$始终等于包含每个终端的所有连接铺好的子图中的最小成本`mask`并包含顶点`v`。 

子集转换是正确的，因为任何连通的 Steiner 树都可以在分支顶点处​​分解为覆盖不相交终端子集的更小的连通树。 

最短路径松弛是正确的，因为通过一个相邻单元扩展连接结构可以保留连接性并准确地增加该单元的铺路成本。 

由于每个连接的 Steiner 树都可以通过重复合并较小的终端组并延伸到相邻单元来构建，因此 DP 探索了所有有效的可能性。 每个转变都保持最优性，因此完整掩模的最终状态是全局最优的。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

INF = 10**18

def solve():
    n, m, k = map(int, input().split())

    grid = [list(map(int, input().split())) for _ in range(n)]

    terminals = []
    for _ in range(k):
        x, y = map(int, input().split())
        terminals.append((x - 1, y - 1))

    V = n * m

    def vid(x, y):
        return x * m + y

    cost = [0] * V

    for i in range(n):
        for j in range(m):
            cost[vid(i, j)] = grid[i][j]

    adj = [[] for _ in range(V)]

    dx = [-1, 1, 0, 0]
    dy = [0, 0, -1, 1]

    for x in range(n):
        for y in range(m):
            v = vid(x, y)

            for d in range(4):
                nx = x + dx[d]
                ny = y + dy[d]

                if 0 <= nx < n and 0 <= ny < m:
                    adj[v].append(vid(nx, ny))

    FULL = 1 << k

    dp = [[INF] * V for _ in range(FULL)]

    parent = [[None] * V for _ in range(FULL)]

    for i, (x, y) in enumerate(terminals):
        v = vid(x, y)
        dp[1 << i][v] = cost[v]

    for mask in range(FULL):

        sub = (mask - 1) & mask

        while sub:
            other = mask ^ sub

            for v in range(V):
                val = dp[sub][v] + dp[other][v] - cost[v]

                if val < dp[mask][v]:
                    dp[mask][v] = val
                    parent[mask][v] = ("merge", sub, other)

            sub = (sub - 1) & mask

        pq = []

        for v in range(V):
            if dp[mask][v] < INF:
                heapq.heappush(pq, (dp[mask][v], v))

        while pq:
            dist, v = heapq.heappop(pq)

            if dist != dp[mask][v]:
                continue

            for to in adj[v]:
                nd = dist + cost[to]

                if nd < dp[mask][to]:
                    dp[mask][to] = nd
                    parent[mask][to] = ("move", v)

                    heapq.heappush(pq, (nd, to))

    full = FULL - 1

    best_v = min(range(V), key=lambda v: dp[full][v])

    ans = dp[full][best_v]

    used = [[False] * m for _ in range(n)]

    sys.setrecursionlimit(10**6)

    def build(mask, v):
        x = v // m
        y = v % m

        used[x][y] = True

        p = parent[mask][v]

        if p is None:
            return

        if p[0] == "move":
            build(mask, p[1])

        else:
            _, a, b = p
            build(a, v)
            build(b, v)

    build(full, best_v)

    print(ans)

    for i in range(n):
        row = []

        for j in range(m):
            row.append('X' if used[i][j] else '.')

        print("".join(row))

solve()
```该解决方案有两个相互交织的组成部分：子集 DP 和最短路径。 

DP表存储每个终端子集和端点的最佳连接结构。 由于所有终端计数都很小，因此迭代所有掩码是可行的。 

子集合并循环使用标准子掩码迭代模式：```
sub = (mask - 1) & mask
```这可以有效地枚举所有正确的非空子掩码。 

这里的一个常见错误是重复计算会议单元格。 两个部分结构都已经包含顶点`v`，所以我们在合并过程中减去一次它的成本。 

合并后，Dijkstra 通过网格传播连接的结构。 距离更新会增加目标单元格成本，因为进入新铺好的单元格会破坏其花朵。 

父跟踪存储两种类型的转换。```
("move", prev_vertex)
```意思是 Dijkstra 松弛。```
("merge", left_mask, right_mask)
```意味着两个子集在同一顶点合并。 

重建 DFS 递归地遵循这些转换并标记所有访问过的单元。 

一个微妙的细节是多次递归调用可能会重新访问同一状态。 这是无害的，因为我们只需要最后一组用过的电池。 

## 工作示例

 ### 示例 1

 输入：```
3 3 2
1 2 3
1 2 3
1 2 3
1 2
3 3
```终端位于`(1,2)`和`(3,3)`。 

| 步骤| 面膜| 端点| 成本|
 | --- | --- | --- | --- |
 | 初始化 | 01 | (1,2) | 2 |
 | 初始化 | 10 | 10 (3,3) | 3 |
 | 迪杰斯特拉 | 01 | 可达细胞| 最短的成本|
 | 迪杰斯特拉 | 10 | 10 可达细胞| 最短的成本|
 | 合并 | 11 | 11 共同端点| 合并|
 | 决赛| 11 | 11 (3,2) | 9 |

 重构后的结构变为：```
.X.
.X.
.XX
```该迹线展示了关键的不变量：每个 DP 状态都代表一个连接的结构。 仅当两个子集独立连接后才会发生合并。 

### 示例 2

 输入：```
2 3 3
1 100 1
1 1 1
1 1
1 3
2 2
```| 步骤| 面膜| 端点| 最佳成本|
 | --- | --- | --- | --- |
 | 初始化 | 001| (1,1) | 1 |
 | 初始化 | 010| (1,3) | 1 |
 | 初始化 | 100 | 100 (2,2) | 1 |
 | 合并 | 101 | 101 (2,1) | 3 |
 | 合并 | 111 | 111 (2,2) | 5 |

 最佳摊铺：```
X.X
XXX
```完全避免了成本为 100 的昂贵的中上单元。 这个例子说明了为什么算法必须考虑斯坦纳点而不是独立连接的终端对。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(3^k \cdot nm + 2^k \cdot nm \log(nm))$| 子集合并加上每个掩码的 Dijkstra |
 | 空间|$O(2^k \cdot nm)$| DP 表和家长追踪 |

 DP 最多有 128 个掩模和 200 个顶点，包含大约 25,000 个状态。 Dijkstra 在如此小的图上运行速度非常快，因此该解决方案完全符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    import heapq

    input = sys.stdin.readline
    INF = 10**18

    out = io.StringIO()
    sys.stdout = out

    n, m, k = map(int, input().split())

    grid = [list(map(int, input().split())) for _ in range(n)]

    terminals = []
    for _ in range(k):
        x, y = map(int, input().split())
        terminals.append((x - 1, y - 1))

    V = n * m

    def vid(x, y):
        return x * m + y

    cost = [0] * V

    for i in range(n):
        for j in range(m):
            cost[vid(i, j)] = grid[i][j]

    adj = [[] for _ in range(V)]

    for x in range(n):
        for y in range(m):
            v = vid(x, y)

            for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
                nx = x + dx
                ny = y + dy

                if 0 <= nx < n and 0 <= ny < m:
                    adj[v].append(vid(nx, ny))

    FULL = 1 << k

    dp = [[INF] * V for _ in range(FULL)]

    for i, (x, y) in enumerate(terminals):
        dp[1 << i][vid(x, y)] = cost[vid(x, y)]

    for mask in range(FULL):

        sub = (mask - 1) & mask

        while sub:
            other = mask ^ sub

            for v in range(V):
                dp[mask][v] = min(
                    dp[mask][v],
                    dp[sub][v] + dp[other][v] - cost[v]
                )

            sub = (sub - 1) & mask

        pq = []

        for v in range(V):
            if dp[mask][v] < INF:
                heapq.heappush(pq, (dp[mask][v], v))

        while pq:
            dist, v = heapq.heappop(pq)

            if dist != dp[mask][v]:
                continue

            for to in adj[v]:
                nd = dist + cost[to]

                if nd < dp[mask][to]:
                    dp[mask][to] = nd
                    heapq.heappush(pq, (nd, to))

    ans = min(dp[FULL - 1])

    print(ans)

    sys.stdout = sys.__stdout__

    return out.getvalue().strip()

# provided sample
assert run(
"""3 3 2
1 2 3
1 2 3
1 2 3
1 2
3 3
"""
) == "9"

# minimum size
assert run(
"""1 1 1
5
1 1
"""
) == "5"

# adjacent terminals
assert run(
"""1 2 2
5 7
1 1
1 2
"""
) == "12"

# avoid expensive center
assert run(
"""2 3 3
1 100 1
1 1 1
1 1
1 3
2 2
"""
) == "5"

# all equal values
assert run(
"""2 2 2
1 1
1 1
1 1
2 2
"""
) == "3"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1x1`网格|`5`| 最小可能的状态空间|
 | 邻近航站楼 |`12`| 正确计算端点成本 |
 | 昂贵的中心|`5`| Steiner 布线避免了昂贵的单元 |
 | 所有费用均等|`3`| 正确处理多条最优路径 |

 ## 边缘情况

 考虑相邻终端的情况：```
1 2 2
5 7
1 1
1 2
```初始化创建：```
dp[01][left] = 5
dp[10][right] = 7
```Dijkstra 传播允许每个状态到达相邻单元。 当两个掩码在任一端点合并时，总数变为：```
5 + 7 = 12
```合并期间的减法可防止重复计算。 

现在考虑昂贵中心的例子：```
2 3 3
1 100 1
1 1 1
1 1
1 3
2 2
```一个天真的最短路径联合将使用顶行并支付 102。 相反，DP 发现所有子集都可以沿着第二行廉价地合并：```
X.X
XXX
```总成本5.

 最后，考虑一个重合并结构：```
3 3 3
1 1 1
1 100 1
1 1 1
1 1
1 3
3 2
```最佳的树围绕昂贵的中心弯曲并在外部单元处合并。 在重建过程中，递归调用遵循子集合并和移动转换，正确恢复完全连接的结构，而不包括中心单元。
