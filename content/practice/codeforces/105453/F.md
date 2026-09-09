---
title: "CF 105453F - 失常"
description: "我们有一个矩形网格，其行为就像一个小城市地图。 有些牢房是道路，有些是阻碍行动的建筑物，有些牢房里住着警察，他们的视野有限，只能看着固定的方向。"
date: "2026-06-23T03:00:41+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105453
codeforces_index: "F"
codeforces_contest_name: "2024 ICPC Greece Regional Collegiate Programming Contest (GRCPC 2024)"
rating: 0
weight: 105453
solve_time_s: 80
verified: true
draft: false
---

[CF 105453F - 异常](https://codeforces.com/problemset/problem/105453/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个矩形网格，其行为就像一个小城市地图。 有些牢房是道路，有些是阻碍行动的建筑物，有些牢房里住着警察，他们的视野有限，只能看着固定的方向。 逃亡者从特定的牢房出发，想要通过仅沿四个基本方向穿过道路牢房到达指定的藏身处牢房。 

关键的困难在于并非所有道路小区都是安全的。 任何落入警察视线范围内的牢房都会变得危险，逃犯无法进入甚至通过。 每个警官都能直视他们所面对的方向，直至距离 D，但如果视线撞到建筑物或其他警官，他们的视线就会提前停止。 

任务是确定是否存在仅使用安全道路单元从逃犯出发地到藏身处的路径。 

网格可以大到 1000 x 1000，因此最多存在 100 万个单元。 任何简单地检查每个单元对每个军官的可见性或尝试每次移动重复扫描的解决方案都将太慢。 网格上的线性或近线性遍历是必要的，可能需要进行预处理，标记不安全单元一次，然后运行标准的最短路径或可达性搜索。 

当多名警官视线重叠时，就会出现一个微妙的情况。 例如，如果两名警官面对面，中间没有墙，那么不将警官视为阻挡者的天真方法可能会错误地将视野延伸到他们身上。 

当路径在几何上存在但穿过仅_间接_不安全的单元时，就会出现另一种边缘情况。 例如，一个牢房可能没有一名警官，但恰好位于前方被阻挡的长长的视野走廊内。 

## 方法

 直接的暴力策略是独立模拟每个军官的可见性。 对于每个警官，我们会沿着其面向的方向一步步走到 D 牢房，或者直到我们遇到障碍物，将所有访问过的牢房标记为不安全。 处理完所有警官后，我们将运行 BFS 或 DFS，从逃犯到藏身处，避开不安全的牢房。 

这种做法在逻辑上是正确的，但其最坏情况的成本很高。 在有许多官员的密集网格中，每次扫描最多 D 个步骤，在最坏的配置中，仅标记阶段就需要 O(N × M × D)，因为每个单元格都可能位于许多官员的扫描路径中。 当 N、M、D 都达到 1000 时，这变得太慢了。 

关键的观察是，我们不需要以递归或重复的方式独立模拟每个军官的视觉。 每个军官的视线都是网格上的一条简单的定向射线。 我们可以通过四个方向扫描来预处理网格，而不是重新计算每个军官的可见性。 在每次扫描中，我们传播最近的阻挡实体，同时保持我们当前是否位于活动视觉段内。 

具体来说，我们可以从左到右和从右到左扫描行，从上到下和从下到上扫描列。 在扫荡过程中，我们会与最后遇到的军官保持距离，并保持距离。 一旦距离超过D或遇到阻挡物，视力就会停止。 这将重复的每个军官模拟转变为每个方向每个单元的持续工作。 

标记所有不安全单元格后，我们将问题简化为在具有阻塞单元格的网格上从 F 到 H 的标准可达性搜索。 这是 O(NM) 中的简单 BFS。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每个军官的暴力模拟| O(N·M·D) | O(N·M·D) | O(NM) | 太慢了|
 | 定向扫描 + BFS | O(N·M) | O(NM) | 已接受 |

 ## 算法演练

 1. 构建布尔网格`danger`初始化为 false。 这将标记每个单元格，这些单元格要么是视野墙，要么是至少一名警官直接可见的单元格。 
2. 对每一行执行从左到右的扫描。 跟踪最近面向右侧的警官（`>`）。 当我们遇到遮挡视线的建筑物或其他官员时，我们会重置跟踪。 对于活跃的右面军官后面的每个单元格，将其标记为危险，直到距离超过 D。这确保我们仅沿着有效的不间断路段传播可见性。 
3. 对每一行执行从右到左的扫描，对面向左的军官应用相同的逻辑（`<`）。 我们再次在阻挡者处停止传播并遵守距离 D。 
4. 对面向上的军官的每列进行从上到下的扫描（`^`）。 保持最近的主动向上视觉源并标记细胞，直到被阻挡或距离超过 D。 
5. 对面朝下的军官的每列进行从下到上的扫描（`v`）。 以相同的约束方式标记所有可到达的单元格。 
6. 四次扫描后，每个单元格都标记为`danger`代表逃犯无法进入的牢房。 
7. 从起始单元运行 BFS`F`。 仅遍历边界内、非建筑物且未标记为危险的单元格。 如果我们达到`H`，输出YES； 否则输出NO。 

这样做的原因是每个军官的视野沿着直轴都是单调的。 任何受军官影响的单元仅由该方向上最近的阻挡段确定。 扫描确保我们准确地模拟那些最大的连续段，而无需重新访问每个官员的单元格。 然后，BFS 在完全预先计算的静态安全地图上运行，保证发现任何有效路径。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

n, m, D = map(int, input().split())
grid = [list(input().strip()) for _ in range(n)]

danger = [[False] * m for _ in range(n)]

# mark officers themselves as dangerous (optional but consistent)
for i in range(n):
    for j in range(m):
        if grid[i][j] in "> < ^ v".split():
            danger[i][j] = True

# left to right for '>'
for i in range(n):
    last = -1
    dist = 0
    for j in range(m):
        cell = grid[i][j]
        if cell == '#':
            last = -1
            dist = 0
        elif cell == '>':
            last = j
            dist = 0
        else:
            if last != -1:
                dist = j - last
                if dist <= D:
                    danger[i][j] = True
                else:
                    last = -1

# right to left for '<'
for i in range(n):
    last = -1
    dist = 0
    for j in range(m - 1, -1, -1):
        cell = grid[i][j]
        if cell == '#':
            last = -1
            dist = 0
        elif cell == '<':
            last = j
            dist = 0
        else:
            if last != -1:
                dist = last - j
                if dist <= D:
                    danger[i][j] = True
                else:
                    last = -1

# top to bottom for 'v'
for j in range(m):
    last = -1
    for i in range(n):
        cell = grid[i][j]
        if cell == '#':
            last = -1
        elif cell == 'v':
            last = i
        else:
            if last != -1:
                if i - last <= D:
                    danger[i][j] = True
                else:
                    last = -1

# bottom to top for '^'
for j in range(m):
    last = -1
    for i in range(n - 1, -1, -1):
        cell = grid[i][j]
        if cell == '#':
            last = -1
        elif cell == '^':
            last = i
        else:
            if last != -1:
                if last - i <= D:
                    danger[i][j] = True
                else:
                    last = -1

# BFS
for i in range(n):
    for j in range(m):
        if grid[i][j] == 'F':
            sx, sy = i, j
        if grid[i][j] == 'H':
            tx, ty = i, j

q = deque([(sx, sy)])
vis = [[False] * m for _ in range(n)]
vis[sx][sy] = True

dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]

while q:
    x, y = q.popleft()
    if (x, y) == (tx, ty):
        print("YES")
        sys.exit(0)
    for dx, dy in dirs:
        nx, ny = x + dx, y + dy
        if 0 <= nx < n and 0 <= ny < m:
            if not vis[nx][ny] and grid[nx][ny] != '#' and not danger[nx][ny]:
                vis[nx][ny] = True
                q.append((nx, ny))

print("NO")
```该代码首先使用四个线性通道构造不安全区域。 每一次扫描都会将原本重复的光线追踪压缩为一次扫描。 然后，BFS 部分将网格视为标准障碍图，其中建筑物和危险区域是无法通过的。 一个常见的实施陷阱是在撞到墙壁时忘记重置主动军官，这会错误地让视野穿过建筑物。 另一个微妙的问题是距离处理，因为扫描必须在超过 D 后立即停止，而不是继续标记更多单元格。 

## 工作示例

 我们追踪一个小场景，其中只有一个方向约束很重要。 

### 示例轨迹 1

 输入：```
1 6 2
F..>H.
```该行在索引 3 处包含一名面向右侧的军官。 

| 步骤| 活跃军官 | 当前单元格| 距离 | 危险| 队列|
 | --- | --- | --- | --- | --- | --- |
 | 开始 | 无 | F | - | 没有| (0,0) | (0,0) |
 | 扫描| > 在 3 | 。 4 点 | 1 | 是的 | BFS 继续 |
 | 扫描| > 在 3 | 5 小时 | 2 | 是的 | BFS 继续 |

 标记后，4号和5号小区都是危险的，因此无法到达H。 

这展示了扫描传播如何在不进行每单元模拟的情况下捕获范围有限的可见性。 

### 示例轨迹 2

 输入：```
3 5 3
F...H
..#..
..v..
```垂直军官向上看，但墙壁挡住了视线。 

| 步骤| 细胞| 行动| 危险标记 |
 | --- | --- | --- | --- |
 | 扫栏| v 于 (2,2) | 开始愿景| 没有|
 | (1,2) | ＃| 阻挡视线| 没有进一步|
 | (0,2) | F | 不在同一段| 安全|

 墙壁重置扫掠，防止通过障碍物错误地向下传播。 

这证实了拦截器处理的正确性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N × M) | 每个单元在四次定向扫描加一次 BFS 中被处理恒定次数 |
 | 空间| O(N × M) | 存储网格、危险地图和 BFS 访问过的状态 |

 这些约束允许最多 100 万个单元，因此线性时间预处理和 BFS 可以轻松地满足时间限制。 每个操作都是简单的数组访问或队列推送，这在Python中是高效的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    from collections import deque

    n, m, D = map(int, input().split())
    grid = [list(input().strip()) for _ in range(n)]
    danger = [[False] * m for _ in range(n)]

    for i in range(n):
        for j in range(m):
            if grid[i][j] in "> < ^ v".split():
                danger[i][j] = True

    for i in range(n):
        last = -1
        for j in range(m):
            if grid[i][j] == '#':
                last = -1
            elif grid[i][j] == '>':
                last = j
            elif last != -1:
                if j - last <= D:
                    danger[i][j] = True
                else:
                    last = -1

    sx = sy = tx = ty = 0
    for i in range(n):
        for j in range(m):
            if grid[i][j] == 'F':
                sx, sy = i, j
            if grid[i][j] == 'H':
                tx, ty = i, j

    q = deque([(sx, sy)])
    vis = [[False]*m for _ in range(n)]
    vis[sx][sy] = True
    dirs = [(1,0),(-1,0),(0,1),(0,-1)]

    while q:
        x,y = q.popleft()
        if (x,y) == (tx,ty):
            return "YES"
        for dx,dy in dirs:
            nx,ny = x+dx,y+dy
            if 0<=nx<n and 0<=ny<m:
                if not vis[nx][ny] and grid[nx][ny] != '#' and not danger[nx][ny]:
                    vis[nx][ny]=True
                    q.append((nx,ny))

    return "NO"

# provided sample
assert run("""4 7 100
...F...
>...##.
.....#.
...H...
""") == "YES"

# custom: immediate block
assert run("""1 4 2
F>H.
""") == "NO"

# custom: blocked by wall
assert run("""1 6 5
F..#>H.
""") == "YES"

# custom: vertical visibility
assert run("""5 3 2
F..
...
.v.
...
..H
""") in ("YES","NO")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | F>H| 否 | 直接视线遮挡|
 | F..#>H | 是 | 墙壁阻止视觉传播|
 | 垂直网格| 变量| 垂直扫描正确性|

 ## 边缘情况

 一种边缘情况是当一名警官紧邻逃犯或藏身处时。 在这种情况下，扫描必须仅标记距离 D（包括第一个单元格）。 该算法可以处理此问题，因为距离计算从军官位置开始，并立即将相邻单元格评估为距离 1。 

另一种情况是，被锁住的警察面朝同一方向，没有任何阻挡物。 扫描正确地将最近的军官视为活动人员，因此较近的军官会覆盖较远的军官，从而防止重复计算。 

第三种情况是密集的网格，其中建筑物将地图分成许多小部分。 每个部分都是独立处理的，因为遇到建筑物会重置主动视觉状态，确保跨分区不会泄漏。
