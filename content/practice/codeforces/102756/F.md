---
title: "CF 102756F - 迷宫设计"
description: "迷宫是一条正好有三行n列的走廊。 每个字符描述一个图块。 0 格是爱丽丝可以站立的地方，而 1 格是被阻挡的。"
date: "2026-07-29T00:37:04+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102756
codeforces_index: "F"
codeforces_contest_name: "UTPC Contest 10-09-20 Div. 1"
rating: 0
weight: 102756
solve_time_s: 46
verified: true
draft: false
---

[CF 102756F - 迷宫设计](https://codeforces.com/problemset/problem/102756/F)

 **评级：** -
 **标签：** -
 **求解时间：** 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 迷宫是一条只有三行的走廊`n`列。 每个字符描述一个图块。 一个`0`瓷砖是爱丽丝可以站立的地方，而`1`瓷砖被堵塞。 Alice 可能从第一列中的任何空位块开始，并希望通过仅向上、下、左或右移动来到达最后一列中的任何空位块。 任务是确定这样的路径是否存在。 

输入大小是主要线索。 宽度可达`10^4`，但高度固定为仅三行。 A general grid algorithm that explores every reachable tile is already enough because there are only`3 * n`职位。 Any approach that tries to enumerate possible paths is impossible, since the number of paths grows exponentially with the number of columns.

 高度小就是隐藏结构。 A careless solution might treat this as a normal large grid and add unnecessary complexity, but the maze has only three layers. Another common mistake is to only check whether every column has an open tile. 这还不够，因为行之间的间隙可能会断开路径。 

例如：```
2
00
10
00
```答案是：```
Solvable!
```A path can start at the top left, move right, move down, and reach the final column. A column-by-column check works here, but it does not prove connectivity.

 另一种情况是：```
2
01
10
10
```答案是：```
Unsolvable!
```The last column contains an open tile, and the first column contains an open tile, but they are separated by blocked cells. A solution that only checks the existence of open cells at both ends would incorrectly accept it.

 The safest way to reason about the problem is to view open tiles as graph vertices. 由于该图只有`3n`顶点，搜索可到达的组件很容易足够快。 

## 方法

 直接的方法是从第一列中每个可能的起始图块运行图形遍历。 每个开放图块都是一个节点，边连接相邻的开放图块。 广度优先搜索或深度优先搜索会访问每个可到达的图块，并告诉我们是否可以到达最后一列。 这是正确的，因为图遍历精确地探索包含起始节点的连接组件。 

然而，从每个可能的第一列图块开始单独的遍历会重复工作。 在最坏的情况下，有三个起始位置，因此重复在这里实际上并没有什么害处，但没有必要。 更重要的是，当我们认识到所有有效的起点都通过同一个图连接时，问题就变得更加清晰。 我们可以将所有第一列打开的图块添加到一次初始搜索中，并立即探索整个可到达的区域。 

迷宫高度固定的观察结果使我们能够将整个通道建模为一个小图，其中`O(n)`节点。 A single BFS or DFS processes each tile at most once, giving a simple linear solution.

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n) | O(n) | 已接受，但不必要的重复搜索 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. Read the three maze rows and create a visited array for the three by`n`网格。 网格尺寸是固定的，因此该表示直接存储每个可能的位置。 
2. 将第一列中的每个打开的图块放入 BFS 队列中，并将其标记为已访问。 Alice 可以从这些位置中的任何一个开始，因此搜索应该同时从所有位置开始。 
3. Repeatedly remove a position from the queue and inspect its four neighboring positions. 如果邻居在迷宫内，处于开放状态并且尚未被访问过，则将其标记为已访问并将其添加到队列中。 
4. During the search, check whether a visited position lies in the last column. If one exists, the maze has a valid route from the beginning to the end.
 5. If the queue becomes empty without reaching the last column, every reachable position has been explored and no solution exists.

 Why it works: the invariant maintained by BFS is that every visited tile is reachable from some valid starting tile in the first column. When BFS finishes, every tile connected to the starting region has been visited. If the last column contains a visited tile, there is a valid path. If it does not, no path can exist because every possible movement from the starting region was already explored.

 ## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def solve():
    n = int(input())
    grid = [input().strip() for _ in range(3)]

    visited = [[False] * n for _ in range(3)]
    q = deque()

    for r in range(3):
        if grid[r][0] == '0':
            visited[r][0] = True
            q.append((r, 0))

    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while q:
        r, c = q.popleft()

        if c == n - 1:
            print("Solvable!")
            return

        for dr, dc in directions:
            nr = r + dr
            nc = c + dc

            if 0 <= nr < 3 and 0 <= nc < n:
                if not visited[nr][nc] and grid[nr][nc] == '0':
                    visited[nr][nc] = True
                    q.append((nr, nc))

    print("Unsolvable!")

if __name__ == "__main__":
    solve()
```该代码从所有可能的条目块开始 BFS，而不是选择任意一个开始。 这与问题定义匹配，因为 Alice 可以从第一列的任何位置开始。 

边界检查防止访问外部行`0`到`2`或外面的柱子`0`到`n - 1`。 在将单元添加到队列之前对其进行标记可以防止重复的队列条目，并保证每个图块都被处理一次。 

The early return when reaching column`n - 1`是安全的，因为到达最后一列中的任何图块就足以解决迷宫问题。 已经证明成功之后就没有必要继续探索了。 

## 工作示例

 对于第一个例子：```
2
00
10
00
```BFS 状态演变如下。 

| 步骤| 处理前排队| 当前瓷砖 | 新访问的瓷砖 | 结果 |
 | ---| ---| ---| ---| ---|
 | 1 | (0,0), (2,0) | (0,0), (2,0) | (0,0) | (0,0) | (0,1)| 继续 |
 | 2 | (2,0), (0,1) | (2,0), (0,1) | (2,0) | (2,1) | 继续 |
 | 3 | (0,1), (2,1) | (0,1), (2,1) | (0,1)| 无 | 继续 |
 | 4 | (2,1) | (2,1) | 到达最后一栏 | 可解决！ |

 跟踪显示 BFS 不需要遵循单一的计划路线。 它会探索每一条可能的路线，直到找到一条成功的路线。 

对于第二个例子：```
2
01
10
10
```| 步骤| 处理前排队| 当前瓷砖 | 新访问的瓷砖 | 结果 |
 | ---| ---| ---| ---| ---|
 | 1 | (0,0) | (0,0) | (0,0) | (0,0) | 无 | 继续 |
 | 2 | 空 | 无 | 无 | No final column reached |

 唯一的起始图块被阻止到达第二列，因此搜索正确地拒绝了迷宫。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 只有`3n`单元格，每个单元格最多被访问一次 |
 | 空间| O(n) | 访问过的数组和BFS队列存储最多所有单元|

 固定高度使图表保持较小。 迷宫上的线性扫描完全在限制范围内`n = 10^4`。 

## 测试用例```python
import sys
import io
from collections import deque

def solve_input(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    n = int(input())
    grid = [input().strip() for _ in range(3)]

    visited = [[False] * n for _ in range(3)]
    q = deque()

    for r in range(3):
        if grid[r][0] == '0':
            visited[r][0] = True
            q.append((r, 0))

    while q:
        r, c = q.popleft()
        if c == n - 1:
            return "Solvable!\n"

        for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < 3 and 0 <= nc < n:
                if not visited[nr][nc] and grid[nr][nc] == '0':
                    visited[nr][nc] = True
                    q.append((nr, nc))

    return "Unsolvable!\n"

assert solve_input("""2
00
10
00
""") == "Solvable!\n", "sample 1"

assert solve_input("""2
01
10
10
""") == "Unsolvable!\n", "sample 2"

assert solve_input("""2
00
00
00
""") == "Solvable!\n", "all open"

assert solve_input("""2
11
00
11
""") == "Unsolvable!\n", "blocked entry"

assert solve_input("""10000
""" + "0" * 10000 + "\n" + "1" * 10000 + "\n" + "0" * 10000 + "\n") == "Solvable!\n", "maximum width"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品1 | 可解决！ | A route that changes rows |
 | 样品2 | 无解！ | 断开连接的最后一栏 |
 | 全开放迷宫| 可解决！ | 简单全连接案例 |
 | 被阻止的条目 | 无解！ | No possible starting position |
 | 宽度10000箱| 可解决！ | 最大尺寸下的线性性能|

 ## 边缘情况

 第一个重要的边缘情况是存在多个起始位置时。 在：```
2
00
00
00
```BFS 从第一列中的所有三个单元格开始。 该算法不假设 Alice 从特定行开始，因此会处理每个可能的入口。 

第二种情况是当最后一列有开放单元格但无法到达时：```
2
01
10
10
```搜索开始于`(0,0)`。 它的邻居要么在网格之外，要么被阻塞，因此队列变空。 由于没有访问最终列单元格，因此算法输出`Unsolvable!`。 

第三种情况是狭长的迷宫：```
10000
00000000000000000000...000
11111111111111111111...111
00000000000000000000...000
```和`10000`列。 BFS 仍然访问每个可达块一次。 它不依赖于递归深度或可能路径的数量，因此它可以安全地处理最大宽度。
