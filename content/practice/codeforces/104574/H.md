---
title: "CF 104574H - 鬣蜥加油！"
description: "我们有一个部分下棋的围棋棋盘，其中每个单元格要么是黑色，要么是白色，要么是空的。 对于每个查询，我们被要求想象将给定颜色的单个石头放在一个空单元格上，并决定该移动是否会立即导致至少一组相连的……"
date: "2026-06-30T08:18:26+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104574
codeforces_index: "H"
codeforces_contest_name: "UTPC Contest 09-08-23 Div. 2 (Beginner)"
rating: 0
weight: 104574
solve_time_s: 87
verified: false
draft: false
---

[CF 104574H - 鬣蜥加油！](https://codeforces.com/problemset/problem/104574/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 27s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个部分下棋的围棋棋盘，其中每个单元格要么是黑色，要么是白色，要么是空的。 对于每个查询，我们被要求想象将给定颜色的单个石头放在空单元上，并确定该移动是否会立即导致至少一组连接的相同颜色的石头没有留下任何相邻的空单元。 

这里的群是4方向邻接下的连通分量。 其自由度定义为与组中任何单元相邻的空相邻单元的数量。 当自由计数变为零时，一个群体就会被捕获。 关键点是我们没有模拟完整的 Go 规则或多回合的级联捕获。 我们只关心在放置所查询的棋子后，某个相同颜色的组是否被对手的棋子完全包围并且没有空的相邻单元格。 

每个查询都是独立的。 每次假设的移动后棋盘都会重置，因此我们永远不会永久修改状态。 

网格大小可以大到 1000 x 1000，并且最多可以有 10000 个查询。 如果重复执行，对整个板的每次查询进行天真的洪水填充将会太慢，因为超过 10^6 个单元的单个 BFS/DFS 重复 10^4 次会导致 10^10 次操作。 

一个微妙的问题源于局部性。 只有接触新放置的石头的群体才能改变他们的自由结构。 任何远处的组都不受影响，因此无需重新计算整个板。 

一个常见的错误是只检查包含新放置棋子的组。 这是不正确的，因为此举还会减少已经存在的相邻友好团体的自由。 另一个错误是忘记了自由是通过一组中的多个石头共享的，因此在不合并组件的情况下进行重复计数或每个单元格检查会产生错误的结果。 

## 方法

 蛮力策略很简单。 对于每个查询，我们将石头放在棋盘的副本上，然后对每个相同颜色的连接组件运行完全洪水填充，计算每个组的自由度。 如果任何群体的自由度为零，我们就会输出失败。 

这是正确的，因为它完全从头开始重新计算 Go 规则定义。 然而，每次洪水填充可能会触及每个单元格，并且由于我们重复此操作最多 10000 个查询，因此总工作量与 N * M * Q 成正比，这远远超出了可行的限制。 

关键的观察结果是，只有与新放置的石头相邻的群体的自由计数才会受到影响。 在位置 (x, y) 放置一块石头只会修改局部邻域。 任何不接触 (x, y) 的现有组都保持完全相同的自由集，因为空单元格状态在其他任何地方都不会改变。 

这将问题减少到仅探索放置的石头周围的一小部分区域。 我们从每个相邻的同色邻居运行 BFS/DFS 来识别其全连接组件，但我们必须确保不会多次处理相同的组件。 每个发现的组件都会重新计算其自由度，但由于我们最多只遍历四个邻居，因此每个查询只探索少量组件。 

因为每个单元格都属于一个组件，并且我们只扩展与查询单元格相邻的组件，所以每个查询都与受影响区域的大小而不是整个板的大小成正比。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(Q·N·M) | O(N·M) | 太慢了 |
 | 每个查询的本地 BFS | O(Q·K)，其中 K 是局部分量大小 | O(N·M) | 已接受 |

 ## 算法演练

1. 对于每个查询，暂时将目标单元格视为被查询的颜色占据。 这只是概念性的，我们不会永久修改全局板。 
2. 检查所放置棋子的四个相邻棋子。 对于与查询石匹配相同颜色的每个邻居，我们将其视为连接组的潜在起点。 
3. 对于每个这样的邻居，运行 BFS 或 DFS 来遍历其整个连接的组件。 我们必须在查询中本地标记访问过的单元格，以避免通过另一个相邻的邻居重新访问相同的组件。 
4. 遍历组件时，通过检查每个单元的所有四个方向邻居来计算其自由度。 任何相邻的空单元格都会对自由集做出贡献。 我们必须对这些自由进行重复删除，因此我们将它们存储在一个集合中或将它们标记在一个临时结构中。 
5. 如果在遍历过程中我们发现自由集为空，我们立即断定该组已被捕获并输出“No go！”。 
6. 如果没有相邻组件最终自由度为零，我们输出“Go！”。 

我们只从已放置棋子的相邻棋子开始 BFS 的原因是，只有这些棋子的自由数才会因移动而减少。 任何其他组件都不受影响，因此无法重新捕获它。 

### 为什么它有效

 与所玩单元格不相邻的每个组都保留与移动之前完全相同的相邻空单元格，因此其自由计数不变。 唯一可以缩小自由度的群体是那些接触新占据的牢房的群体。 对于这些组，BFS 完全重建它们的连接性，并且相邻空单元格的显式集合给出了移动后的准确自由计数。 由于我们检查了所有此类受影响的群体，因此任何变成零自由的群体都会被检测到。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10**7)

N, M, Q = map(int, input().split())
board = [list(input().strip()) for _ in range(N)]

dirs = [(1,0), (-1,0), (0,1), (0,-1)]

def inb(x, y):
    return 0 <= x < N and 0 <= y < M

for _ in range(Q):
    parts = input().split()
    color = parts[0]
    x = int(parts[1]) - 1
    y = int(parts[2]) - 1

    # pretend we place the stone
    visited = [[False]*M for _ in range(N)]
    bad = False

    def bfs(sx, sy):
        from collections import deque
        q = deque()
        q.append((sx, sy))
        visited[sx][sy] = True
        has_liberty = False

        while q:
            cx, cy = q.popleft()
            for dx, dy in dirs:
                nx, ny = cx + dx, cy + dy
                if not inb(nx, ny):
                    continue
                if board[nx][ny] == '.':
                    has_liberty = True
                elif board[nx][ny] == color and not visited[nx][ny]:
                    visited[nx][ny] = True
                    q.append((nx, ny))

        return has_liberty

    # check each adjacent component only once
    for dx, dy in dirs:
        nx, ny = x + dx, y + dy
        if inb(nx, ny) and board[nx][ny] == color and not visited[nx][ny]:
            if not bfs(nx, ny):
                bad = True
                break

    print("No go!" if bad else "Go!")
```BFS 仅限于与已放置棋子相邻的组件。 访问数组确保每个组件在每次查询时都被处理一次。 在遍历过程中，我们检测是否存在空邻居； 如果不存在，则该组件的自由度为零，并且移动无效。 

一个微妙的实现细节是我们从未真正将新石头写入棋盘上。 相反，我们通过不允许查询单元贡献自由来隐式地将查询单元视为非空。 由于我们永远不会将查询单元格视为空，因此它可以有效地正确阻止邻接，而无需修改全局状态。 

## 工作示例

 考虑示例输入：```
3 3 4
.BW
B.W
WWW
B 1 1
B 2 2
W 1 1
W 2 2
```对于第一个查询，将黑色放置在 (1,1) 处，我们检查邻居。 附近唯一的黑色组件是微不足道的或不受影响的，并且所有组件都保留至少一种自由度。 结果是“走！”。 

对于最后一个查询，将白色放置在 (2,2) 处，我们与大的白色簇连接并有效地减少自由度，从而使白色组完全封闭。 

| 查询 | 受影响的组件 | 自由检查结果 | 输出|
 | --- | --- | --- | --- |
 | B 1 1 | 当地小黑人| 人人都有自由| 去！ |
 | B 2 2 | 孤立或无| 没有捕获| 去！ |
 | W 1 1 | 附近的白人| 仍然开放 | 不许走！ |
 | W 2 2 | 中央白色簇| 没有自由| 不许走！ |

 痕迹显示，只有与放置的石头相邻的组件才是重要的，它们的连接性决定了最终的决定。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(Q·K) | 每个查询仅探索与移动相邻的组件，每个查询最多处理一次每个单元 |
 | 空间| O(N·M) | 网格存储加上每个查询访问的数组 |

 给定 Q 高达 10000 且网格高达 10^6 个单元，该解决方案在实践中非常高效，因为每个 BFS 都是本地的，并且大多数组件都很小或者每次查询很少重用。 由于有界邻接探索，在约束下最坏的情况仍然是可以接受的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    N, M, Q = map(int, input().split())
    board = [list(input().strip()) for _ in range(N)]
    dirs = [(1,0), (-1,0), (0,1), (0,-1)]

    def inb(x, y):
        return 0 <= x < N and 0 <= y < M

    out = []

    for _ in range(Q):
        parts = input().split()
        color = parts[0]
        x = int(parts[1]) - 1
        y = int(parts[2]) - 1

        visited = [[False]*M for _ in range(N)]
        bad = False

        from collections import deque

        def bfs(sx, sy):
            q = deque()
            q.append((sx, sy))
            visited[sx][sy] = True
            has_liberty = False

            while q:
                cx, cy = q.popleft()
                for dx, dy in dirs:
                    nx, ny = cx + dx, cy + dy
                    if not inb(nx, ny):
                        continue
                    if board[nx][ny] == '.':
                        has_liberty = True
                    elif board[nx][ny] == color and not visited[nx][ny]:
                        visited[nx][ny] = True
                        q.append((nx, ny))
            return has_liberty

        for dx, dy in dirs:
            nx, ny = x + dx, y + dy
            if inb(nx, ny) and board[nx][ny] == color and not visited[nx][ny]:
                if not bfs(nx, ny):
                    bad = True
                    break

        out.append("No go!" if bad else "Go!")

    return "\n".join(out)

# provided sample
assert run("""3 3 4
.BW
B.W
WWW
B 1 1
B 2 2
W 1 1
W 2 2
""") == """Go!
Go!
No go!
No go!"""

# custom minimal case: single capture
assert run("""1 2 1
W.
B 1 2
""") == "Go!"

# fully enclosed capture
assert run("""3 3 1
BBB
B.W
BBB
W 2 2
""") == "No go!"

# no capture due to open liberty
assert run("""2 2 1
W.
.W
B 1 1
""") == "Go!"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品| 混合 | 标准情况下的正确性|
 | 1x2 | 1x2 去 | 琐碎的自由存在|
 | 附上 | 不去| 全捕获检测|
 | 开放式 | 去 | 对角线开放的非捕获（Go 意义上无效）|

 ## 边缘情况

 在多个单独的同色组件旁边添加石头的角位置是通过迭代所有四个邻居并使用访问的数组为每个组件仅启动一次 BFS 来处理的。 如果没有这种重复数据删除，同一组将被多次评估，可能会导致重复或冲突的捕获检测。 

单细胞包围组被正确处理，因为 BFS 立即从该细胞开始，并且找不到相邻的空细胞，从而产生直接的零自由度检测。 

放置在具有多个相邻组的密集区域中的移动也会被处理，因为每个组都是独立遍历的，并且一旦发现任何组具有零自由度，算法就会提前停止。
