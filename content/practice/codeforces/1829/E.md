---
title: "CF 1829E - 湖区"
description: "我们得到一个表示地形的二维网格，其中每个单元格都包含一个非负整数，表示该位置的水深。"
date: "2026-06-09T07:18:08+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dsu", "graphs", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1829
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 871 (Div. 4)"
rating: 1100
weight: 1829
solve_time_s: 80
verified: true
draft: false
---

[CF 1829E - 湖泊](https://codeforces.com/problemset/problem/1829/E)

 **评分：** 1100
 **标签：** dfs 和类似、dsu、图表、实现
 **求解时间：** 1m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个表示地形的二维网格，其中每个单元格都包含一个非负整数，表示该位置的水深。 “湖”被定义为正交连接的非零单元的连续区域，这意味着我们可以使用向上、向下、向左或向右移动在它们之间移动，而无需踏入零深度单元。 湖泊的体积是其组成单元所有深度的总和。 任务是找到每个网格中可能最大的湖泊体积。 

输入由多个测试用例组成。 每个测试用例定义网格的尺寸和每个单元的深度值。 最大网格大小为 1000 x 1000，所有测试用例中所有单元格的总和不超过$10^6$。 这意味着任何接触每个单元格恒定次数的算法都可以在时间限制内轻松运行。 然而，尝试比较每对单元格或对每个非零单元格执行全局操作的算法（例如$O(n^2)$每个测试用例）会太慢。 

非明显的边缘情况包括仅包含零的网格、所有非零单元都被隔离的网格以及接触网格边界的湖泊。 例如，1x1 网格中深度为 5 的单细胞湖泊应返回 5。 忘记标记访问过的细胞的幼稚 DFS 可能会重复计算湖泊，产生大于正确值的体积。 同样，忘记正确处理边界可能会导致越界错误。 

## 方法

 蛮力方法在概念上很简单。 对于每个非零像元，执行 DFS 或 BFS 来探索连接的非零区域，对深度求和以计算湖泊体积。 跟踪访问过的单元格以避免重复计数。 最后，返回遇到的最大音量。 这种方法是正确的，但其最坏情况性能与单元总数成正比，因为每个单元都被访问一次并且每个邻居检查都是恒定的。 考虑到限制，这是可以接受的，但是没有标记访问单元或仔细使用递归的简单实现可能会遇到堆栈溢出或冗余计算。 

最佳方法依赖于相同的原理，但使用迭代 BFS 来避免递归深度问题。 通过精确地处理每个单元一次并对连接的组件进行即时求和，我们保证我们最多访问每个单元一次。 关键的见解是，每个湖都是一个独立的连通组件，最大的体积来自于总和最高的组件。 由于我们只遍历非零湖一部分的单元格，因此我们可以有效地跳过不必要的检查。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力DFS/BFS | 每个测试用例 O(n*m) | O(n*m) | 已接受 |
 | 最优迭代 BFS | 每个测试用例 O(n*m) | O(n*m) | 已接受 |

 ## 算法演练

 1. 初始化变量`max_volume`为零。 这将追踪发现的最大的湖泊体积。 
2. 创建二维数组`visited`与网格大小相同，用于跟踪哪些单元格已包含在湖中。 
3. 迭代每个单元格`(i, j)`在网格中。 如果`a[i][j]`为零或已访问过，跳过它。 
4. 如果单元格非零且未被访问，则从该单元格启动 BFS。 初始化队列`(i, j)`和一个变量`current_volume`为零。 
5. 当队列不为空时，弹出一个单元格`(x, y)`。 将其标记为已访问，并添加`a[x][y]`到`current_volume`。 
6. 检查所有四个邻居`(x, y)`。 对于每个邻居`(nx, ny)`在网格范围内，如果`a[nx][ny] > 0`并且没有被访问过，将其添加到队列中。 
7. BFS完成后，比较`current_volume`和`max_volume`。 如果较大则更新`max_volume`。 
8. 继续迭代网格，直到处理完所有单元格。 
9. 返回`max_volume`对于这个测试用例。 

工作原理：BFS 确保每个连接的非零区域都被完全探索一次，并将其所有深度相加。 这`visited`array 保证没有单元格被计数两次。 由于所有可能的湖泊都是独立勘探的，因此可以正确识别最大湖泊体积。 

## Python 解决方案```python
import sys
from collections import deque
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        grid = [list(map(int, input().split())) for _ in range(n)]
        visited = [[False]*m for _ in range(n)]
        max_volume = 0
        
        for i in range(n):
            for j in range(m):
                if grid[i][j] > 0 and not visited[i][j]:
                    q = deque()
                    q.append((i,j))
                    visited[i][j] = True
                    current_volume = 0
                    while q:
                        x, y = q.popleft()
                        current_volume += grid[x][y]
                        for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
                            nx, ny = x + dx, y + dy
                            if 0 <= nx < n and 0 <= ny < m and grid[nx][ny] > 0 and not visited[nx][ny]:
                                visited[nx][ny] = True
                                q.append((nx, ny))
                    max_volume = max(max_volume, current_volume)
        print(max_volume)

if __name__ == "__main__":
    solve()
```该解决方案将读取输入、处理每个测试用例和 BFS 探索分开。 使用`deque`BFS 确保从前面有效弹出。 在单元入队时立即将单元标记为已访问可以避免多次访问并保持正确性。 四方向邻居检查尊重网格边界以避免索引错误。 

## 工作示例

 ### 示例 1

 输入：```
3 3
1 2 0
3 4 0
0 0 5
```| 访问过的小区 | 队列状态 | 当前音量 | 最大音量 |
 | ---| ---| ---| ---|
 | (0,0) | (0,0) | [(0,0)] | 0 | 0 |
 | (0,1)| [(0,1)] | 1 | 0 |
 | (1,0)| [(1,0)] | 3 | 0 |
 | (1,1) | []| 10 | 10 10 | 10
 | (2,2) | [(2,2)] | 5 | 10 | 10

 解释：BFS 首先探索相连的单元湖 (0,0),(0,1),(1,0),(1,1)，总计 10。孤立的单元 (2,2) 形成一个体积为 5 的湖。最大值正确为 10。 

### 示例 2

 输入：```
1 1
0
```跟踪：单元格为零，已跳过。`max_volume`仍为 0。正确输出 0。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n*m) | 每个单元被访问一次，每个邻居被检查四次 |
 | 空间| O(n*m) | 网格和访问数组，以及最坏情况下高达 n*m 的队列 |

 鉴于测试用例中所有单元格的总和不超过$10^6$，该解决方案可以在 3 秒的时间限制内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    f = io.StringIO()
    with redirect_stdout(f):
        solve()
    return f.getvalue().strip()

# Provided samples
assert run("5\n3 3\n1 2 0\n3 4 0\n0 0 5\n1 1\n0\n3 3\n0 1 1\n1 0 1\n1 1 1\n5 5\n1 1 1 1 1\n1 0 0 0 1\n1 0 5 0 1\n1 0 0 0 1\n1 1 1 1 1\n5 5\n1 1 1 1 1\n1 0 0 0 1\n1 1 4 0 1\n1 0 0 0 1\n1 1 1 1 1") == "10\n0\n7\n16\n21"

# Custom cases
assert run("1\n1 1\n5") == "5", "single cell lake"
assert run("1\n2 2\n0 0\n0 0") == "0", "all zeros"
assert run("1\n2 2\n1 1\n1 1") == "4", "full lake"
assert run("1\n3 3\n0 1 0\n1 0 1\n0 1 0") == "1", "diagonal not connected"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1x1 与 5 | 5 | 单细胞湖|
 | 2x2 全零 | 0 | 零湖案例|
 | 2x2 全一 | 4 | 全连接湖|
 | 3x3 十字 | 1 | 仅正交连接计数，对角线忽略 |

 ## 边缘情况

 只有零的网格：BFS 永远不会
