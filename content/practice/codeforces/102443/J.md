---
title: "CF 102443J - 工厂"
description: "我们得到一个（m×n）矩形地图。 一个单元要么是一个车间，写为 ，要么是空的，写为 .. 所有车间单元形成一个侧面连接的区域，并且内部没有封闭的空区域。"
date: "2026-08-09T13:47:27+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102443
codeforces_index: "J"
codeforces_contest_name: "2019-2020 Russia Team Open, High School Programming Contest (VKOSHP 19)"
rating: 0
weight: 102443
solve_time_s: 468
verified: true
draft: false
---

[CF 102443J - 工厂](https://codeforces.com/problemset/problem/102443/J)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个 (m × n) 矩形地图。 一个单元格要么是一个车间，写成`*`，或空，写为`.`。 所有车间单元形成一个侧面连接的区域，内部没有封闭的空区域。 后一种情况意味着每个空单元都属于工厂的外部区域。 

查看单元格之间的网格线。 如果一个网格节点是至少一个车间单元的一角，则该网格节点被称为重要节点。 车间单元的每一侧都是连接其两个端点网格节点的走廊。 

我们需要构建一条通过重要网格节点的封闭路线。 每一步都必须遵循一条走廊，任何走廊都不能使用两次，并且每个重要节点都必须出现在路线上的某个位置。 路线不必很短。 如果这样的路线不存在，我们打印`No`。 否则我们打印`Yes`、走廊的数量以及路线中网格节点的顺序。 原始约束为 (1 \le m,n \le 20)，时间限制为两秒，内存为 256 MB。 

关键的图形解释是走廊形成平面网格图。 我们正在寻找一个包含每个重要顶点的连通子图，其中每个使用的顶点都有偶数度。 这样的图有一个欧拉回路，而该回路正是问题所要求的路线。 

在一些简单的情况下，天真的解释会出错。 考虑```
1 1
*
```答案是`Yes`。 四个角形成一个循环，因此路线可以简单地绕着单个车间走。 

为了```
1 1
.
```没有重要的节点。 空路由有效，所以答案是`Yes`零走廊。 假设路线必须包含至少一个车间的解决方案将错误地拒绝这种情况。 

考虑```
2 2
**
**
```答案是`No`。 对应的网格图是（3×3）网格。 它的四个角顶点的度数为 2，因此跨偶子图被迫使用整个外边界。 这会使中心顶点断开连接，而使用中心的边会使相邻的三阶顶点之一成为奇数。 这是一个有用的示例，因为仅仅检查工厂是否已连接是不够的。 

最后，```
1 2
**
```是`Yes`。 这两个单元形成一个（2×3）网格图，周长给出了通过每个重要节点的有效闭合路线。 仅考虑单个车间单元循环的结构可能会忽略相邻循环可以组合成一条更大路线的事实。 

## 方法

 直接的强力解决方案可以用平面图的面来描述。 每个车间单元都是一个有界面，而所有空单元和外部都属于同一个外表面，因为工厂没有孔。 为每个工作室提供两种颜色中的一种。 每当两个相邻面具有不同颜色时，请使用网格边缘将它们分开。 

对于任何着色，选定的边在每个网格节点处自动具有偶数度数。 绕着一个节点行走，面部颜色最终会返回到其起始颜色，因此颜色变化的次数是偶数。 如果每个重要节点至少有一次颜色变化，则每个重要节点都有正偶度。 

因此，暴力算法可以尝试车间单元的每个二进制着色，构建其过渡边，检查是否覆盖每个重要节点，最后检查所选边是否连接。 如果有 (K) 个车间单元，则考虑 (2^K) 种颜色。 在最坏的情况下（K=mn=400），给出大约（400 \cdot 2^{400}）的工作。 那是完全不可行的。 

有用的观察结果是，一个网格节点的状况仅取决于紧邻该节点的车间单元。 在一个内部节点，最多有四个这样的单元。 在边界节点处，数量更少，外部被视为零颜色的面。 

这种局部结构意味着我们在构建它时不需要记住整个颜色。 逐行处理单元格并仅记住​​最后 (w) 个单元格的颜色，其中 (w=\min(m,n))。 当分配下一个单元时，每个新完成的内部网格节点都具有该边界中可用的所有事件单元。 我们可以立即检查约束并在失败时丢弃状态。 

可以对工厂进行调换，使 (w) 成为较小的尺寸。 配置文件状态只是一个 (w) 位掩码。 任意位置最多有 (2^w) 个状态，每个状态最多有两种选择下一个车间单元。 空单元格只有一种可能的颜色。 

无孔条件使得面部解释特别有用。 选定的边是两个面颜色之间的边界。 如果每个重要节点都与选定的边相关联，则这些边界组件无法保持分离：两个不同的边界组件将在它们之间留下相同颜色面的区域，并且严格位于该区域内的网格节点将没有选定的关联边。 这与覆盖每个重要节点的要求相矛盾。 因此，所选的转换图是连接的。 

一旦知道了这些边，找到实际路线就是欧拉图的 Hierholzer 算法。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(mn \cdot 2^{mn})) | (O(百万)) | 太慢了|
 | DP简介| (O(mn \cdot 2^w)), (w=\min(m,n)) | (O(mn \cdot 2^w)), (w=\min(m,n)) | (O(mn \cdot 2^w)) 带记忆 | 已接受 |

 ## 算法演练

1. 必要时转置地图，使列数 (w) 不大于行数。 该算法的指数部分取决于边界宽度，因此使用较小的维度是 (2^{20}) 和可能更大的状态空间之间的差异。 
2. 标记至少一个车间单元的角落的每个网格节点。 这些正是最终路线必须访问的节点。 
3. 将每个车间单元解释为一张颜色为零或一的脸。 空单元格和外部始终被视为颜色零。 当两侧面的颜色不同时，将精确选择一条边。 
4. 按行优先顺序扫描单元格。 DP 状态将最近 (w) 个单元的颜色存储在位掩码中。 位零表示最近分配的单元格，而最高存储位表示当前列的前一行中的单元格。 
5. 对于车间单元，尝试两种可能的颜色。 对于空单元格，仅允许颜色为零，因为它是外表面的一部分。 
6. 每当新分配的单元完成内部网格节点时，检查四个入射面颜色。 如果该节点很重要并且所有四种颜色都相等，则没有选定的边与该节点相关，因此该状态永远不会产生有效的路线。 
7. 当事件单元可用时，处理顶部、左侧、右侧和底部边界节点。 地图外缺失的单元格的颜色为零，因此具有一个车间单元格的边界节点在该单元格接收颜色一时恰好被覆盖。 
8. 记住由当前单元格位置和边界掩码组成的对。 如果两种颜色选择都不能产生完全有效的着色，请记住该状态是不可能的。 转置步骤使掩模宽度最多保持为 20。 
9. 通过从初始零掩码开始并重复采用递归状态成功的颜色来重建一个成功的着色。 记忆的DP告诉我们哪个选择可以到达终点。 
10. 将颜色转换为走廊。 对于每个水平和垂直网格边缘，查看其两侧的车间单元格，在地图外和空单元格中使用颜色零。 当两种颜色不同时，保持边缘准确。 
11. 所选图在每个重要节点处具有偶数度，因为所选边对应于节点周围的颜色变化。 每个重要节点都有正度，因为DP拒绝单色邻域。 无孔属性提供连通性，因此所选图是欧拉图。 
12. 在选定的图上运行 Hierholzer 算法。 它仅使用每个选定的走廊一次生成一条闭合路径。 由于每个重要节点都属于该图，因此生成的路线满足所有要求。 

### 为什么它有效

 DP 轮廓的不变量是已经检查了其事件单元已被分配的每个网格节点。 只有当每个重要的完成节点至少有两个选定的关联边时，状态才会被保留，并且由于选定的边的度始终是偶数，这意味着它的度是正的且偶数。 

表面颜色结构使每个选定的边缘度数自动均匀。 在任何网格节点周围，进入和离开一组颜色（一个面）会导致偶数次颜色变化。 DP 防止重要节点上的数字为零，因此每个重要节点都属于所选图。 由于工厂是相连的并且没有孔，一组不相连的颜色变化边界会在没有颜色变化的区域内留下一些重要的网格节点，这与 DP 条件相矛盾。 因此，所选图是连接的，并且其所有度都是偶数，因此欧拉定理保证使用每个所选边恰好一次的闭合路径。 

## Python 解决方案```python
import sys
from functools import lru_cache

input = sys.stdin.readline
sys.setrecursionlimit(1_000_000)

def solve_case(original_grid):
    original_m = len(original_grid)
    original_n = len(original_grid[0])

    # Use the smaller dimension as the profile width.
    transposed = original_n > original_m

    if transposed:
        grid = [
            ''.join(original_grid[r][c] for r in range(original_m))
            for c in range(original_n)
        ]
    else:
        grid = original_grid[:]

    h = len(grid)
    w = len(grid[0])
    full = (1 << w) - 1

    # important[r][c] says whether grid node (r, c)
    # is a corner of at least one workshop cell.
    important = [[False] * (w + 1) for _ in range(h + 1)]

    for r in range(h):
        for c in range(w):
            if grid[r][c] == '*':
                important[r][c] = True
                important[r + 1][c] = True
                important[r][c + 1] = True
                important[r + 1][c + 1] = True

    if not any(any(row) for row in important):
        # No important nodes exist.
        if transposed:
            return "Yes\n0\n0 0\n"
        return "Yes\n0\n0 0\n"

    def all_equal_and_important(r, c, values):
        if not important[r][c]:
            return False
        first = values[0]
        return all(v == first for v in values)

    @lru_cache(maxsize=None)
    def dfs(pos, mask):
        if pos == h * w:
            return True

        r, c = divmod(pos, w)

        if grid[r][c] == '*':
            choices = (1, 0)
        else:
            choices = (0,)

        for x in choices:
            left = mask & 1

            # Check the internal node (r, c).
            if r > 0 and c > 0:
                up = (mask >> (w - 1 - c)) & 1
                up_left = (mask >> (w - c)) & 1

                if all_equal_and_important(
                    r, c, (up_left, up, left, x)
                ):
                    continue

            # Top boundary.
            if r == 0:
                if c == 0:
                    if all_equal_and_important(0, 0, (0, 0, 0, x)):
                        continue
                else:
                    if all_equal_and_important(0, c, (0, 0, left, x)):
                        continue

                if c == w - 1:
                    if all_equal_and_important(0, w, (0, 0, 0, x)):
                        continue

            # Left boundary.
            if c == 0 and r > 0:
                up = (mask >> (w - 1)) & 1
                if all_equal_and_important(r, 0, (0, 0, up, x)):
                    continue

            # Right boundary.
            if c == w - 1 and r > 0:
                up = mask & 1
                if all_equal_and_important(r, w, (0, 0, up, x)):
                    continue

            # Bottom boundary.
            if r == h - 1:
                if c == 0:
                    if all_equal_and_important(h, 0, (0, 0, 0, x)):
                        continue
                else:
                    if all_equal_and_important(h, c, (0, 0, left, x)):
                        continue

                if c == w - 1:
                    if all_equal_and_important(h, w, (0, 0, 0, x)):
                        continue

            new_mask = ((mask << 1) & full) | x

            if dfs(pos + 1, new_mask):
                return True

        return False

    if not dfs(0, 0):
        return "No\n"

    # Reconstruct one successful face coloring.
    colors = [[0] * w for _ in range(h)]
    pos = 0
    mask = 0

    while pos < h * w:
        r, c = divmod(pos, w)

        if grid[r][c] == '*':
            choices = (1, 0)
        else:
            choices = (0,)

        chosen = None

        for x in choices:
            left = mask & 1
            ok = True

            if r > 0 and c > 0:
                up = (mask >> (w - 1 - c)) & 1
                up_left = (mask >> (w - c)) & 1
                if all_equal_and_important(
                    r, c, (up_left, up, left, x)
                ):
                    ok = False

            if ok and r == 0:
                if c == 0:
                    if all_equal_and_important(0, 0, (0, 0, 0, x)):
                        ok = False
                else:
                    if all_equal_and_important(0, c, (0, 0, left, x)):
                        ok = False

                if ok and c == w - 1:
                    if all_equal_and_important(0, w, (0, 0, 0, x)):
                        ok = False

            if ok and c == 0 and r > 0:
                up = (mask >> (w - 1)) & 1
                if all_equal_and_important(r, 0, (0, 0, up, x)):
                    ok = False

            if ok and c == w - 1 and r > 0:
                up = mask & 1
                if all_equal_and_important(r, w, (0, 0, up, x)):
                    ok = False

            if ok and r == h - 1:
                if c == 0:
                    if all_equal_and_important(h, 0, (0, 0, 0, x)):
                        ok = False
                else:
                    if all_equal_and_important(h, c, (0, 0, left, x)):
                        ok = False

                if ok and c == w - 1:
                    if all_equal_and_important(h, w, (0, 0, 0, x)):
                        ok = False

            if not ok:
                continue

            new_mask = ((mask << 1) & full) | x
            if dfs(pos + 1, new_mask):
                chosen = x
                break

        if chosen is None:
            raise RuntimeError("reconstruction failed")

        colors[r][c] = chosen
        mask = ((mask << 1) & full) | chosen
        pos += 1

    # Convert back to the original orientation.
    if transposed:
        selected = [
            [0] * original_n for _ in range(original_m)
        ]
        for r in range(h):
            for c in range(w):
                selected[c][r] = colors[r][c]
    else:
        selected = colors

    m = original_m
    n = original_n

    def face(r, c):
        if 0 <= r < m and 0 <= c < n:
            return selected[r][c]
        return 0

    vertices = (m + 1) * (n + 1)
    graph = [[] for _ in range(vertices)]
    edges = []

    def vid(r, c):
        return r * (n + 1) + c

    def add_edge(r1, c1, r2, c2):
        a = vid(r1, c1)
        b = vid(r2, c2)
        eid = len(edges)
        edges.append((a, b))
        graph[a].append((eid, b))
        graph[b].append((eid, a))

    # Horizontal grid edges.
    for r in range(m + 1):
        for c in range(n):
            above = face(r - 1, c)
            below = face(r, c)
            if above != below:
                add_edge(r, c, r, c + 1)

    # Vertical grid edges.
    for r in range(m):
        for c in range(n + 1):
            left = face(r, c - 1)
            right = face(r, c)
            if left != right:
                add_edge(r, c, r + 1, c)

    important_original = [
        [False] * (n + 1) for _ in range(m + 1)
    ]

    for r in range(m):
        for c in range(n):
            if original_grid[r][c] == '*':
                important_original[r][c] = True
                important_original[r + 1][c] = True
                important_original[r][c + 1] = True
                important_original[r + 1][c + 1] = True

    important_vertices = []
    for r in range(m + 1):
        for c in range(n + 1):
            if important_original[r][c]:
                important_vertices.append(vid(r, c))

    start = important_vertices[0]

    # The face-color construction should give a connected graph.
    seen = {start}
    stack = [start]

    while stack:
        v = stack.pop()
        for _, to in graph[v]:
            if to not in seen:
                seen.add(to)
                stack.append(to)

    if len(seen) != len(important_vertices):
        return "No\n"

    # Hierholzer's algorithm.
    used = [False] * len(edges)
    ptr = [0] * vertices
    stack = [start]
    route = []

    while stack:
        v = stack[-1]

        while ptr[v] < len(graph[v]) and used[graph[v][ptr[v]][0]]:
            ptr[v] += 1

        if ptr[v] == len(graph[v]):
            route.append(stack.pop())
            continue

        eid, to = graph[v][ptr[v]]
        ptr[v] += 1

        if used[eid]:
            continue

        used[eid] = True
        stack.append(to)

    route.reverse()

    if len(route) != len(edges) + 1:
        return "No\n"

    out = ["Yes", str(len(edges))]
    for v in route:
        r, c = divmod(v, n + 1)
        out.append(f"{r} {c}")

    return "\n".join(out) + "\n"

def solve():
    m, n = map(int, input().split())
    grid = [input().strip() for _ in range(m)]
    sys.stdout.write(solve_case(grid))

if __name__ == "__main__":
    solve()
```配置文件掩码是核心实现细节。 在处理单元之前，位 0 是紧邻其左侧的已处理单元。 较高位以相反顺序表示前一行。 这使得新完成的内部节点周围的所有四个单元在恒定时间内可用。 

更新内容```
new_mask = ((mask << 1) & full) | x
```删除最旧的边界单元，将每个剩余单元从位零移动一个位置，并在位零处插入新颜色。 掩码必须被截断`full`，否则它将超出所选的轮廓宽度。 

空单元格被迫着色为零。 以这种方式处理它们使得边界处理统一：空单元和外面是平面嵌入的同一面，因为输入保证不存在封闭的空区域。 

重建不会为每个状态存储父指针。 相反，一旦知道初始状态成功，它就会再次尝试可能的下一个颜色，并询问记忆的 DP 结果状态是否仍然可以完成。 这会保存一个单独的父数组。 

最终图表是根据颜色变化构建的，而不是通过添加每个选定车间单元的每个边缘来构建。 这种区别很重要。 如果两个相邻的车间面的颜色均为一，则不得使用它们的共享边。 如果它们的颜色不同，则共享边恰好是过渡图中的走廊。 

在构建图之后使用 Hierholzer 算法，因为所有度都是偶数并且图是连通的。 生成的顶点序列所包含的顶点恰好比所使用的走廊的数量多一个，在同一顶点处开始和结束，并且从不重复走廊。 

## 工作示例

 ### 示例 1

 第一个样本是```
3 3
***
***
.**
```有效的面部着色可以被视为选择一些车间单元作为颜色一并将外部视为颜色零。 DP 扫描单元格，同时检查每个新完成的网格节点。 

| 职位| 当前单元格 | 已选颜色 | 一步一步的前沿|
 | --- | --- | --- | --- |
 | (0,0) | (0,0) |`*`| 1 |`...1`|
 | (0,1)|`*`| 0 |`..01`|
 | (0,2) |`*`| 1 |`.101`|
 | (1,0)|`*`| 0 |`1010`|
 | (1,1) |`*`| 1 |`0101`|
 | (1,2) |`*`| 0 |`1010`|
 | (2,0) |`.`| 0 |`0100`|
 | (2,1) |`*`| 1 |`1001`|
 | (2,2) |`*`| 0 |`0010`|

 程序选择的确切颜色可能有所不同，因为存在多种有效颜色。 重要的是每个重要节点都能在其入射面中看到两种颜色。 由此产生的颜色变化边形成一个连通的欧拉图，Hierholzer 的算法将这些边转换为有效的闭合路径。 官方示例使用 16 条走廊，但问题接受任何有效路线。 

### 示例 2

 第二个样本是```
1 4
****
```车间只有一排牢房。 重要的节点是（2×5）网格的十个角。 过渡边缘可形成整个条带的周边。 

| 职位| 细胞| 颜色选择 | 相关约束|
 | --- | --- | --- | --- |
 | (0,0) | (0,0) |`*`| 1 | 必须覆盖左上角节点 |
 | (0,1)|`*`| 0 | 相邻的顶部节点看到颜色 1 和 0 |
 | (0,2) |`*`| 1 | 相邻的顶部节点看到颜色 0 和 1 |
 | (0,3) |`*`| 0 | 相邻的顶部节点看到颜色 1 和 0 |

 同样，确切的颜色可能有所不同。 重要的事实是，每个边界节点在入射边上都有颜色变化，因此选定的走廊形成连通的均匀图。 官方样本有一条有十条走廊的路线。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(mn2^w)) | 每个状态有 (mn) 个配置文件位置，最多 (2^w) 个掩模，并且最多有两种颜色选择 |
 | 空间| (O(mn2^w)) | 记忆表可以包含每个位置和边界掩码的一种状态 |

 这里 (w=\min(m,n))，因为如有必要，网格会转置在 DP 之前。 对于 (w\le20)，配置文件最多具有 (2^{20}=1,048,576) 个掩码。 指数依赖性取决于较小的网格尺寸，而不是所有（mn）个单元，这是强力（2^{mn}）搜索的关键减少。 原始问题有 (m,n\le20) 和 256 MB 内存限制。 

## 测试用例

 输出路由不是唯一的，因此测试应该验证返回路由的结构而不是比较`Yes`逐字节回答。 下面的助手检查是否访问了每个重要节点，每次移动都在相邻网格节点之间，每个走廊最多使用一次，并且每个使用的边实际上都是走廊。```python
# The solution above defines solve_case(grid).

import io
import sys

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    try:
        m, n = map(int, input().split())
        grid = [input().strip() for _ in range(m)]
        return solve_case(grid)
    finally:
        sys.stdin = old_stdin

def validate(inp: str, out: str, expected_possible: bool):
    lines = out.strip().splitlines()
    assert lines

    if not expected_possible:
        assert lines[0] == "No"
        return

    assert lines[0] == "Yes"

    m, n = map(int, inp.splitlines()[0].split())
    grid = inp.splitlines()[1:1 + m]

    k = int(lines[1])
    route = [tuple(map(int, line.split())) for line in lines[2:]]

    assert len(route) == k + 1
    assert route[0] == route[-1]

    important = set()

    for r in range(m):
        for c in range(n):
            if grid[r][c] == '*':
                important.add((r, c))
                important.add((r + 1, c))
                important.add((r, c + 1))
                important.add((r + 1, c + 1))

    assert important.issubset(set(route))

    used = set()

    for a, b in zip(route, route[1:]):
        ar, ac = a
        br, bc = b

        assert 0 <= ar <= m
        assert 0 <= br <= m
        assert 0 <= ac <= n
        assert 0 <= bc <= n

        assert abs(ar - br) + abs(ac - bc) == 1

        edge = tuple(sorted((a, b)))
        assert edge not in used
        used.add(edge)

        if ar == br:
            r = ar
            c = min(ac, bc)
            workshop = (
                r > 0 and grid[r - 1][c] == '*'
            ) or (
                r < m and grid[r][c] == '*'
            )
        else:
            r = min(ar, br)
            c = ac
            workshop = (
                c > 0 and grid[r][c - 1] == '*'
            ) or (
                c < n and grid[r][c] == '*'
            )

        assert workshop

# Provided sample 1.
sample1 = """\
3 3
***
***
.**
"""
validate(sample1, run(sample1), True)

# Provided sample 2.
sample2 = """\
1 4
****
"""
validate(sample2, run(sample2), True)

# Minimum-size workshop.
case3 = """\
1 1
*
"""
validate(case3, run(case3), True)

# No workshops at all.
case4 = """\
2 3
...
...
"""
validate(case4, run(case4), True)

# Full 2 x 2 factory, whose 3 x 3 grid graph has no spanning
# Eulerian subgraph.
case5 = """\
2 2
**
**
"""
validate(case5, run(case5), False)

# A maximum-width one-row factory.
case6 = "1 20\n" + "*" * 20 + "\n"
validate(case6, run(case6), True)

# A maximum-size full grid. The forced outer boundary leaves
# an interior grid graph that cannot be included in one Eulerian route.
case7 = "20 20\n" + "\n".join(["*" * 20] * 20) + "\n"
validate(case7, run(case7), False)
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 3 / *** / *** / .**`|`Yes`| 提供样品、内部节点和非矩形车间|
 |`1 4 / ****`|`Yes`| 提供样品及薄工厂|
 |`1 1 / *`|`Yes`| 最小车间和仅限边界图 |
 |`2 3 / ... / ...`|`Yes`| 无重要节点、零长度路径 |
 |`2 2 / ** / **`|`No`| 最小的非平凡不可能欧拉案例 |
 |`1 20 / ********************`|`Yes`| 最大轮廓宽度和长边界|
 |`20 20 / all *`|`No`| 最大尺寸网格和强制边界障碍|

 ## 边缘情况

 对于单个研讨会而言，```
1 1
*
```唯一的四个重要节点是该单元的角点。 面色 DP 可以将车间面着色为 1，将外部面着色为 0。 选择每个边界边，给出四边欧拉循环。 因此输出开始于`Yes`， 其次是`4`，五个网格节点形成一个封闭的正方形。 

对于空地图，```
1 1
.
```根本没有重要的节点。 DP 将颜色零分配给唯一的单元，并且转换图不包含边。 该实现在运行 Hierholzer 之前处理此问题并打印由单个网格节点组成的零走廊路线。 

为了```
2 2
**
**
```四个外角中的每一个都只有一个事件车间单元格，因此这些单元格被迫涂上一种颜色。 这迫使整个外部边界进入转换图中。 然后，边界顶点已经具有所需的二度，从而防止选择通向中心的四个边。 该中心很重要，但变得孤立，因此不存在有效的路线。 DP 轮廓通过其局部面部颜色约束发现了同样的矛盾。 

对于单行边界情况```
1 2
**
```两个车间单元可以接收相反的颜色。 共享边缘将被选中，并且与颜色一单元格相邻的外边缘也会被选中。 由此产生的选定图是连通的，并且每个重要节点的度数都是偶数，因此 Hierholzer 会生成一条闭合路线，而不会重复走廊。 

实施中的边界检查值得特别关注。 内部节点最多由四个车间单元控制，但外边界上的节点只有一两个实际单元，并且外表面必须被视为颜色零。 忘记外表面是误报的常见来源，特别是对于单个车间单元或薄型（1 \times n）工厂。
