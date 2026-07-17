---
title: "CF 103488F - 未来愿景"
description: "我们有一个网格迷宫，其中一些单元格是墙壁，其他单元格是空的。 角色从零时刻标记为 H 的固定单元开始，每分钟可以移动到四个相邻单元中的任何一个或保持在原地。 行动被墙壁阻挡。"
date: "2026-07-03T09:47:17+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103488
codeforces_index: "F"
codeforces_contest_name: "The 2021 Zhejiang University City College Freshman Programming Contest"
rating: 0
weight: 103488
solve_time_s: 51
verified: true
draft: false
---

[CF 103488F - 未来愿景](https://codeforces.com/problemset/problem/103488/F)

 **评级：** -
 **标签：** -
 **求解时间：** 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个网格迷宫，其中一些单元格是墙壁，其他单元格是空的。 字符从标记的固定单元格开始`H`在零时间，每分钟可以移动到四个相邻单元格中的任何一个或保持在原地。 行动被墙壁阻挡。 同时，从时间开始每分钟都会显示一个目标位置`0`到时间`k-1`，并且在某个时间`i`剑位于提供的单元格中`(x_i, y_i)`。 

任务是确定角色是否可以在剑所在的同一时间到达某个牢房，如果可以，则报告最早的时间。 

关键结构是玩家和剑都会随着时间的推移而演变，但方式却截然不同。 玩家在网格上移动，以单位速度的曼哈顿过渡受到墙壁的限制，而剑只是传送到已知的位置序列。 

网格大小最多为 100 x 100，每次测试总共最多有 10,000 个单元格。 在多达 100 个测试用例中，每个测试的最短路径计算是可行的，但如果仔细实施，k 中每个时间步长的任何二次方仍然会通过。 

一个微妙的点是剑可以出现在墙壁上，这意味着到达剑的位置并不需要当时牢房是可行走的，只需要玩家可以站在那里。 然而，由于玩家无法占据墙壁，因此这些位置只有在网格中不是墙壁时才是有效目标。 

第二个重要细节是允许等待。 这意味着奇偶校验约束不会阻止可达性； 时间总是可以被拉长的。 

第三种边缘情况是剑在零时间出现在起始位置，必须立即接受。 

## 方法

 一个蛮力的想法是逐步模拟时间。 对于每一次`t`，我们可以重新计算玩家是否可以到达`(x_t, y_t)`正好在`t`移动开始于`H`。 这意味着为每个时间步运行 BFS 或最短路径计算，复杂度大致为`k * n * m`每次测试。 在最坏的情况下，这大约变成`10^4 * 10^4 = 10^8`每个测试的操作数，当乘以最多 100 个测试用例时，速度太慢。 

关键的观察是，从一开始的可达性并不取决于剑的位置。 我们只需要一条最短路径距离`H`到网格中的每个单元格。 一旦知道这些距离，就检查玩家是否可以及时到达剑前`t`变成一个简单的条件：最短路径距离必须至多`t`，因为额外的时间可以花在原地等待。 

这将重复图搜索的问题减少到网格上的一个 BFS。 之后，我们扫描一次剑时间线，找到条件成立的最早时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每次重新计算 BFS | O(k·n·m) | O(k·n·m) | O(n·m) | 太慢了|
 | 单 BFS + 扫描 | O(n·m + k) | O(n·m + k) | O(n·m) | 已接受 |

 ## 算法演练

 我们首先计算最短距离`H`网格上的每个单元都使用标准的 BFS。 

1. 找到起始单元格`H`并用无穷大值初始化距离矩阵，然后将起始单元距离设置为零。 这编码了我们从零时间开始而没有移动。 
2. 运行 BFS`H`跨越四个方向。 每当我们第一次到达有效的非壁单元时，我们将其距离指定为 BFS 层深度。 这保证了距离是到达该单元格所需的最小移动次数。 
3. BFS 完成后，我们为每个单元格提供了停留在那里所需的最短时间。 
4. 每一次`t`从`0`到`k-1`，读取剑的位置`(x_t, y_t)`并检查网格单元是否不是墙以及是否`dist[x_t][y_t] ≤ t`。 如果两个条件都成立，我们可以在 时间之前到达该单元格`t`然后等待（如有必要）。 
5. 第一个这样的时间就是答案； 如果没有时间满足条件，则输出`"NO"`。 

我们不要求距离和时间完全相等的原因是等待总是允许的。 如果最短路径需要 3 步，但剑在时间 5 出现，我们可以在时间 3 到达它并等待两分钟。 

### 为什么它有效

 BFS 保证`dist[v]`是到达任何单元格所需的最少移动次数`v`从一开始。 某个时刻到某个单元格的任何有效轨迹`t`必须至少包含`dist[v]`移动，加上可选的等待步骤。 因此，此时的可达性`t`相当于`dist[v] ≤ t`。 由于剑的位置是按时间顺序检查的，因此该条件第一次成立就是最早可能的捕获时刻。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

def solve():
    n, m = map(int, input().split())
    grid = [list(input().strip()) for _ in range(n)]
    
    sx = sy = -1
    for i in range(n):
        for j in range(m):
            if grid[i][j] == 'H':
                sx, sy = i, j

    dist = [[-1] * m for _ in range(n)]
    q = deque()
    q.append((sx, sy))
    dist[sx][sy] = 0

    dirs = [(1,0), (-1,0), (0,1), (0,-1)]

    while q:
        x, y = q.popleft()
        for dx, dy in dirs:
            nx, ny = x + dx, y + dy
            if 0 <= nx < n and 0 <= ny < m:
                if grid[nx][ny] != '#' and dist[nx][ny] == -1:
                    dist[nx][ny] = dist[x][y] + 1
                    q.append((nx, ny))

    k = int(input())
    for t in range(k):
        x, y = map(int, input().split())
        x -= 1
        y -= 1

        if 0 <= x < n and 0 <= y < m and grid[x][y] != '#':
            if dist[x][y] != -1 and dist[x][y] <= t:
                print("YES", t)
                return

    print("NO")

if __name__ == "__main__":
    solve()
```BFS 部分从起始位置构建完整距离地图，将墙壁视为不可通行。 队列按照距离递增的顺序处理单元格，因此我们第一次为单元格分配距离时，它是最佳的。 

然后，查询循环直接检查从等待逻辑派生的条件。 从输入坐标中减去 1 至关重要，因为网格内部索引为 0，而输入索引为 1。 

提早返回可确保我们在最早的有效时间停留。 

## 工作示例

 考虑一个简单的网格，其中起点靠近开放区域，剑立即出现在同一位置。 

| 步骤| 活动 | 职位| 距离检查 | 结果 |
 | --- | --- | --- | --- | --- |
 | 0 | BFS 初始化 | 哈 | 0 ≤ 0 | 是 |

 这演示了无需移动的立即捕获情况。 

现在考虑这样一种情况，剑最初无法触及，但后来变得可以触及。 

| t | 剑 (x,y) | 距离[x][y] | 条件 dist ≤ t | 结果|
 | --- | --- | --- | --- | --- |
 | 0 | 阻塞的细胞| -1 | 假 | 没有|
 | 1 | 远小区| 3 | 假 | 没有|
 | 2 | 相同 | 3 | 假 | 没有|
 | 3 | 相同| 3 | 真实| 是 |

 此跟踪显示等待如何使中间故障变得无关紧要，并且只有第一次阈值很重要。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n·m + k) | O(n·m + k) | BFS 访问每个单元一次，然后每个剑查询检查一次 |
 | 空间| O(n·m) | 迷宫中的距离网格和 BFS 队列 |

 边界 n、m ≤ 100 使得 BFS 可以忽略不计，甚至每个测试的 k 高达 10,000 对于线性扫描来说也足够小。 经过 100 次测试，这仍然在一定范围内。 

## 测试用例```python
import sys, io
from collections import deque

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = []
    def input():
        return sys.stdin.readline()
    
    def solve():
        n, m = map(int, input().split())
        grid = [list(input().strip()) for _ in range(n)]
        
        sx = sy = -1
        for i in range(n):
            for j in range(m):
                if grid[i][j] == 'H':
                    sx, sy = i, j

        dist = [[-1]*m for _ in range(n)]
        q = deque()
        q.append((sx, sy))
        dist[sx][sy] = 0

        dirs = [(1,0),(-1,0),(0,1),(0,-1)]

        while q:
            x,y = q.popleft()
            for dx,dy in dirs:
                nx,ny = x+dx,y+dy
                if 0<=nx<n and 0<=ny<m:
                    if grid[nx][ny] != '#' and dist[nx][ny] == -1:
                        dist[nx][ny] = dist[x][y] + 1
                        q.append((nx,ny))

        k = int(input())
        for t in range(k):
            x,y = map(int, input().split())
            x-=1;y-=1
            if 0<=x<n and 0<=y<m and grid[x][y] != '#':
                if dist[x][y] != -1 and dist[x][y] <= t:
                    out.append(f"YES {t}")
                    return
        out.append("NO")

    solve()
    return "\n".join(out)

# minimum grid
assert run("1 1\nH\n1\n1 1\n") == "YES 0", "min case"

# unreachable
assert run("2 2\nH#\n##\n2\n2 2\n1 2\n") == "NO", "blocked"

# reachable later
assert run("2 2\nH.\n..\n3\n2 2\n2 2\n2 1\n") == "YES 2", "delayed"

# obstacle maze
assert run("3 3\nH..\n###\n..#\n3\n1 3\n3 1\n3 3\n") == "NO", "walls block"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1×1 开始 | 是 0 | 立即匹配 |
 | 封锁网格| 否 | 遥不可及的目标|
 | 延迟到达 | 是 2 | 等待逻辑|
 | 重墙迷宫| 否 | 障碍物下的 BFS 正确性 |

 ## 边缘情况

 一个常见的失败案例是忘记允许等待。 如果某个单元格在剑时间之前就可以到达，正确的解决方案仍然会接受它。 例如，如果`dist = 2`剑在时间出现`5`，答案有效于`t = 5`，不会因不匹配而被拒绝。 

另一个边缘情况是剑出现在壁格上。 BFS 仍必须正常计算距离，但检查必须拒绝墙壁，因为玩家无法占据它们。 正确的实现明确验证`grid[x][y] != '#'`。 

最后，必须在任何 BFS 假设之前处理在时间零时显示为剑的起始单元。 自从`dist[start] = 0`，条件`dist <= 0`正确触发立即成功。
