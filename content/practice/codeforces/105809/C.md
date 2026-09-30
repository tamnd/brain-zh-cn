---
title: "CF 105809C - 3D 国际象棋"
description: "我们有一个三维棋盘，尺寸为 $A 乘以 B 乘以 C$。 有些牢房被封锁，无法容纳骑士。 每个剩余的单元格都是 3D 骑士的潜在位置。"
date: "2026-06-25T15:28:37+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105809
codeforces_index: "C"
codeforces_contest_name: "Code Rush 2025"
rating: 0
weight: 105809
solve_time_s: 54
verified: true
draft: false
---

[CF 105809C - 3D 国际象棋](https://codeforces.com/problemset/problem/105809/C)

 **评级：** -
 **标签：** -
 **求解时间：** 54s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个具有尺寸的三维棋盘$A \times B \times C$。 有些牢房被封锁，无法容纳骑士。 每个剩余的单元格都是 3D 骑士的潜在位置。 

马的移动与通常的国际象棋模式所描述的完全一样，延伸到三个维度。 它选择两个轴，沿其中一个轴移动 2，沿另一个轴移动 1，而第三个坐标保持不变。 任何离开棋盘的举动都是无效的。 目标是放置尽可能多的骑士，这样就不会出现两个骑士同时攻击对方的情况。 

棋盘的每个方向的尺寸最多为 10，因此整个棋盘最多包含$10^3 = 1000$细胞。 即使在删除阻塞单元之前，可用位置的数量也足够小，我们可以根据图顶点来思考。 挑战不在于细胞的数量，而在于选择最大的非攻击子集的组合性质。 

对所有子集的简单搜索将需要检查最多$2^{1000}$配置，这是完全不可能的。 我们需要利用骑士移动图中的结构。 

当棋盘太小以至于不存在马的走法时，就会出现一种微妙的情况。 

例子：```
1 1 1
1
1 1 1
```没有可用的单元格，因此答案为 0。假设至少可以放置一名骑士的解决方案将会失败。 

另一个有趣的情况是棋盘上有可用的单元但没有攻击对。```
1 1 2
1
1 1 1
```只剩下一个可用的单元格。 答案是 1. 任何基于图的解决方案都必须正确处理孤立的顶点。 

更危险的错误是忘记从图表中删除阻塞的单元格。 考虑：```
3 3 3
1
2 2 2
```中心单元格不可用。 如果我们仍然通过该顶点创建边或将其计为候选位置，则最终答案会变得太大或太小，具体取决于实现。 正确答案是14。 

## 方法

 最直接的解释是建立一个图，其中每个可用单元都是一个顶点，如果放置在那里的骑士互相攻击，则一条边连接两个单元。 然后，任务就变成找到最大的顶点集，并且任何对之间都没有边。 在图论中，这是一个最大独立集。 

暴力方法将尝试每个可用单元子集并检查是否存在任何攻击对。 如果有$N$可用的细胞，这需要$2^N$子集。 即使是为了$N = 50$，这已经是无望了，而实际的限制是最多1000个cell。 

关键的观察来自于坐标的奇偶性。 

骑士移动改变坐标$(\pm2,\pm1,0)$按某种顺序。 总变化为$x+y+z$总是很奇怪，因为$2+1=3$。 这意味着骑士的每一步举动都会翻转平价$x+y+z$。 

如果我们根据奇偶校验为每个单元格着色$x+y+z$，每条边都连接相反的颜色。 攻击图是二分图。 

现在由于经典定理，问题变得容易多了。 在任意图中：$$\text{Maximum Independent Set}
=
|V|
-
\text{Minimum Vertex Cover}$$对于二部图，柯尼希定理指出：$$\text{Minimum Vertex Cover}
=
\text{Maximum Matching}$$结合这两个事实：$$\text{Answer}
=
|V|
-
\text{Maximum Matching}$$因此，我们不是直接搜索最大的独立集，而是构建骑士攻击的二分图，计算最大匹配，并从可用单元的数量中减去其大小。 

该板最多有 1000 个可用单元。 每个单元格只有固定数量的骑士移动，因此图形仍然稀疏。 Hopcroft-Karp 可以轻松处理这个尺寸。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(2^N)$|$O(N)$| 太慢了|
 | 最佳|$O(E\sqrt{V})$|$O(V+E)$| 已接受 |

 ## 算法演练

 1. 读取电路板尺寸并标记所有被阻挡的单元。 
2. 为每个可用单元分配一个整数 ID。 这些 id 成为图的顶点。 
3. 根据奇偶校验将顶点分割为两个分区$x+y+z$。 
4. 对于偶数分区中的每个可用单元格，生成所有可能的马移动。 
5. 如果目标单元位于棋盘内部并且未被阻挡，则在两个相应顶点之间添加一条边。 
6. 在生成的二部图上运行 Hopcroft-Karp 以计算最大匹配。 
7.让$N$是可用单元格的数量并且$M$为最大匹配尺寸。 
8. 输出$N-M$。 

第 8 步正确的原因是等式链：$$\text{Maximum Independent Set}
=
N-\text{Minimum Vertex Cover}
=
N-\text{Maximum Matching}$$### 为什么它有效

 骑士的每一步动作都会改变奇偶性，因此攻击图是二分的。 任何有效的骑士放置完全对应于该图中的独立集，因为没有两个选定的顶点可以共享攻击边。 

对于二部图，柯尼希定理将最小顶点覆盖问题转化为最大匹配问题。 由于最小顶点覆盖的补集是最大独立集，因此从顶点总数中减去匹配大小就可以得到最大可能的相互不攻击的骑士集。 有效的放置不能包含比该值更多的顶点，并且该定理保证存在这样的放置。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def solve():
    A, B, C = map(int, input().split())
    K = int(input())

    blocked = set()
    for _ in range(K):
        x, y, z = map(int, input().split())
        blocked.add((x - 1, y - 1, z - 1))

    cell_id = {}
    cells = []

    for x in range(A):
        for y in range(B):
            for z in range(C):
                if (x, y, z) not in blocked:
                    cell_id[(x, y, z)] = len(cells)
                    cells.append((x, y, z))

    n = len(cells)

    moves = []
    for axis2 in [2, -2]:
        for axis1 in [1, -1]:
            moves.extend([
                (axis2, axis1, 0),
                (axis2, 0, axis1),
                (axis1, axis2, 0),
                (0, axis2, axis1),
                (axis1, 0, axis2),
                (0, axis1, axis2),
            ])

    left_vertices = []
    for idx, (x, y, z) in enumerate(cells):
        if (x + y + z) % 2 == 0:
            left_vertices.append(idx)

    adj = [[] for _ in range(n)]

    for idx in left_vertices:
        x, y, z = cells[idx]

        for dx, dy, dz in moves:
            nx, ny, nz = x + dx, y + dy, z + dz

            if not (0 <= nx < A and 0 <= ny < B and 0 <= nz < C):
                continue

            if (nx, ny, nz) not in cell_id:
                continue

            adj[idx].append(cell_id[(nx, ny, nz)])

    INF = 10 ** 18

    pair_u = [-1] * n
    pair_v = [-1] * n
    dist = [0] * n

    def bfs():
        q = deque()

        for u in left_vertices:
            if pair_u[u] == -1:
                dist[u] = 0
                q.append(u)
            else:
                dist[u] = INF

        found = False

        while q:
            u = q.popleft()

            for v in adj[u]:
                pu = pair_v[v]

                if pu == -1:
                    found = True
                elif dist[pu] == INF:
                    dist[pu] = dist[u] + 1
                    q.append(pu)

        return found

    def dfs(u):
        for v in adj[u]:
            pu = pair_v[v]

            if pu == -1 or (dist[pu] == dist[u] + 1 and dfs(pu)):
                pair_u[u] = v
                pair_v[v] = u
                return True

        dist[u] = INF
        return False

    matching = 0

    while bfs():
        for u in left_vertices:
            if pair_u[u] == -1 and dfs(u):
                matching += 1

    print(n - matching)

solve()
```第一部分构造可用单元集并为每个单元分配一个紧凑的顶点 id。 使用整数 id 可以使匹配实现更加简单。 

招式生成明确地在三个维度上创建所有 24 个骑士招式。 一些实现意外地错过了一些坐标排列，这会产生一个缺少边的图和一个太大的答案。 

只有偶校验顶点才会创建出边。 这避免了将每条边存储两次并自然地形成二分图的左侧。 

Hopcroft-Karp 实现使用标准 BFS 分层阶段，然后进行 DFS 增强。 该图很稀疏，因此可以在限制内轻松运行。 

错误的一个常见来源是忘记阻塞单元并不作为顶点存在。 每个目的地都必须检查`cell_id`在添加边缘之前。 

## 工作示例

 ### 示例 1```
1 1 2
1
1 1 1
```可用细胞：

 | 细胞| 平价 |
 | --- | --- |
 | (1,1,2) | (1,1,2) | 奇数|

 没有骑士动作。 

| 数量 | 价值|
 | --- | --- |
 | 可用顶点| 1 |
 | 配套尺寸| 0 |
 | 回答 | 1 |

 这表明孤立顶点自动属于最大独立集。 

### 示例 2```
3 3 3
1
2 2 2
```共有 26 个单元格和 1 个阻塞单元格。 

| 数量 | 价值|
 | --- | --- |
 | 细胞总数| 27 | 27
 | 阻塞的细胞 | 1 |
 | 可用顶点| 26 | 26

 运行 Hopcroft-Karp 发现：

 | 数量 | 价值|
 | --- | --- |
 | 最大匹配| 12 | 12
 | 回答 | 14 | 14

 结果与示例输出匹配。 

此示例演示了从骑士放置到二分匹配的完全简化。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(E\sqrt{V})$| Hopcroft-Karp 最大匹配 |
 | 空间|$O(V+E)$| 图存储和匹配数组 |

 该板最多包含 1000 个可用单元。 每个单元格最多有 24 个骑士动作，所以$E$只有几万。 在这种大小的图上，Hopcroft-Karp 的速度很容易达到一秒的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    from collections import deque

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    A, B, C = map(int, input().split())
    K = int(input())

    blocked = set()
    for _ in range(K):
        x, y, z = map(int, input().split())
        blocked.add((x - 1, y - 1, z - 1))

    cell_id = {}
    cells = []

    for x in range(A):
        for y in range(B):
            for z in range(C):
                if (x, y, z) not in blocked:
                    cell_id[(x, y, z)] = len(cells)
                    cells.append((x, y, z))

    n = len(cells)

    moves = []
    for a in [2, -2]:
        for b in [1, -1]:
            moves.extend([
                (a, b, 0),
                (a, 0, b),
                (b, a, 0),
                (0, a, b),
                (b, 0, a),
                (0, b, a),
            ])

    left = [i for i, (x, y, z) in enumerate(cells)
            if (x + y + z) % 2 == 0]

    adj = [[] for _ in range(n)]

    for u in left:
        x, y, z = cells[u]
        for dx, dy, dz in moves:
            nx, ny, nz = x + dx, y + dy, z + dz
            if (nx, ny, nz) in cell_id:
                adj[u].append(cell_id[(nx, ny, nz)])

    INF = 10**18
    pair_u = [-1] * n
    pair_v = [-1] * n
    dist = [0] * n

    def bfs():
        q = deque()
        found = False

        for u in left:
            if pair_u[u] == -1:
                dist[u] = 0
                q.append(u)
            else:
                dist[u] = INF

        while q:
            u = q.popleft()
            for v in adj[u]:
                pu = pair_v[v]
                if pu == -1:
                    found = True
                elif dist[pu] == INF:
                    dist[pu] = dist[u] + 1
                    q.append(pu)
        return found

    def dfs(u):
        for v in adj[u]:
            pu = pair_v[v]
            if pu == -1 or (dist[pu] == dist[u] + 1 and dfs(pu)):
                pair_u[u] = v
                pair_v[v] = u
                return True
        dist[u] = INF
        return False

    matching = 0
    while bfs():
        for u in left:
            if pair_u[u] == -1 and dfs(u):
                matching += 1

    return str(n - matching) + "\n"

# sample
assert run("3 3 3\n1\n2 2 2\n") == "14\n"

# minimum usable board
assert run("1 1 1\n1\n1 1 1\n") == "0\n"

# single available cell
assert run("1 1 2\n1\n1 1 1\n") == "1\n"

# no knight moves anywhere
assert run("2 2 2\n1\n1 1 1\n") == "7\n"

# one-dimensional line
assert run("1 1 3\n1\n1 1 1\n") == "2\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1×1×1 全封锁 | 0 | 空图|
 | 1×1×2，带有一个封闭单元 | 1 | 单个孤立顶点|
 | 2×2×2 | 7 | 不存在有效的骑士动作 |
 | 1×1×3 | 1×1×3 2 | 退化维度处理 |
 | 案例案例| 14 | 14 完整的匹配逻辑 |

 ## 边缘情况

 考虑完全阻塞的板：```
1 1 1
1
1 1 1
```没有创建顶点。 匹配大小为0，算法输出$0 - 0 = 0$。 空放置是唯一有效的放置。 

考虑一块具有一个可用单元的板：```
1 1 2
1
1 1 1
```该图包含一个顶点且没有边。 Hopcroft-Karp 找不到匹配项。 答案就变成了$1 - 0 = 1$，这是最优的，因为单独的单元格总是可以包含一个骑士。 

考虑示例：```
3 3 3
1
2 2 2
```被阻挡的中心单元永远不会插入到图中。 每个攻击边缘仅在可用单元之间生成。 匹配大小为12，因此最大独立集大小为$26 - 12 = 14$。 这证实了被阻止的单元格被正确处理并且不参与图表或最终计数。
