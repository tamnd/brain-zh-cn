---
title: "CF 102375J - \u041f\u043e\u0440\u0442\u0430\u043b\u044b"
description: "迷宫是一个（N×M）网格。 单元要么是自由的，被实心壁 W 占据，要么被玻璃壁 G 占据。仅在相邻的自由单元之间才可能进行普通移动。 外边界由实心墙组成，因此每条光线最终都会到达实心墙。"
date: "2026-08-15T18:29:27+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102375
codeforces_index: "J"
codeforces_contest_name: "\u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0439 \u0440\u0430\u0443\u043d\u0434 \u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442\u0430 \u0421\u0435\u0432\u0435\u0440\u043e-\u0417\u0430\u043f\u0430\u0434\u0430 \u0420\u043e\u0441\u0441\u0438\u0438 \u0438 \u041c\u043e\u0441\u043a\u0432\u044b ICPC 2019"
rating: 0
weight: 102375
solve_time_s: 1543
verified: false
draft: false
---

[CF 102375J - \u041f\u043e\u0440\u0442\u0430\u043b\u044b](https://codeforces.com/problemset/problem/102375/J)

 **评级：** -
 **标签：** -
 **求解时间：** 25m 43s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 迷宫是一个（N × M）网格。 细胞要么是自由的，要么被实心墙占据`W`，或被玻璃墙占据`G`。 普通移动只能在相邻的空闲单元之间进行。 外边界由实心墙组成，因此每条光线最终都会到达实心墙。 

传送门镜头沿四个网格方向之一行进，直到遇到第一堵实体墙。 玻璃墙并不能阻止拍摄。 传送门放置在面向射手的墙壁一侧。 最重要的结果是，门户的有用侧是实体墙之前的最后一个单元。 如果该单元格是空闲的，则可以安全地从该单元格进入传送门。 如果该单元是玻璃的，从另一侧进入门户将使旅行者留在玻璃墙内，因此这样的门户不能在有效的解决方案中使用。 

有两种门户颜色。 每种颜色最多有一个传送门，并且射击该颜色通常会替换其之前的传送门。 进入门户的一次移动算作一次`M`行动，但进入后旅行者立即出现在另一个门户。 

输入给出网格和两个空闲单元，起点（S）和出口（E）。 输出必须包含有效的镜头和动作序列。 主要目标是尽量减少射击次数 (P)。 在具有最小值 (P) 的解决方案中，移动动作的数量只需保持在 (2NM) 以内。 官方声明给出了(N,M\le 1000)、2秒限制和512 MiB内存。 

对于 (N,M\le1000)，可以有 (10^6) 个单元格。 这排除了状态空间包含二次数量的网格单元的算法，更不用说三次状态空间了。 网格的线性或近线性遍历是合适的。 输出本身可以包含 (O(NM)) 次运动，因此花费 (O(NM)) 时间和内存是自然目标。 

### 启动和退出已连接

 如果(S)和(E)属于自由单元的同一连通分量，则不需要入口。 正确答案是（P=0）。 例如，```
3 3
WWW
W.W
WWW
2 2
2 2
```有输出```
0 0
```始终初始化两个门户的解决方案已经不是最佳的。 

### 子弹可能会穿过玻璃

 考虑示例 1。从起始单元开始，向下射击穿过玻璃单元，然后到达实心壁。 有用的入口端点是紧邻实体墙之前的空闲单元。 只允许对紧邻的实心墙进行射击的简单实现会错过此过渡，并且可能会错误地报告迷宫需要更多射击或不可能。 

### 玻璃端点不可用

 端点为的门户`G`单元格不是有用的传送端点。 治疗`G`因为仅仅透明对于射击和传送来说是错误的，因为离开另一边的传送门会使旅行者进入玻璃墙。 

例如，```
5 5
WWWWW
W.GGW
WGWGW
WGG.W
WWWWW
2 2
4 4
```有两个独立的空闲单元。 来自任一端的每条重要射线都以紧邻实心壁之前的玻璃单元结束。 唯一安全的射击点是当前单元本身，因此组件之间不可能进行传送。 正确的输出是```
-1 -1
```接受玻璃端点的粗心实现会错误地找到路径。 

### 两种门户颜色必须交替使用

 传送后，当前端点的传送门仍保留在那里。 要移动到新端点，另一种颜色会在其他地方拍摄，取代该颜色的旧门户。 然后进入当前端点处仍然存在的门户执行传送。 

这就是为什么第一次传送后每次传送一次就足够了。 第一次传送需要两次射击，因为最初两个传送门都不存在。 

## 方法

 直接的强力解决方案可以模拟完整的物理状态。 这样的状态包含玩家当前的单元格以及两个门户的位置和方向，包括门户尚不存在的可能性。 有 (O(NM)) 个可能的有用门户位置，因此状态数为 (O((NM)^3))。 每个状态最多有 4 个移动动作和 8 个射击动作，给出最坏情况的转换计数，顺序为

 [
 12(NM)(NM+1)^2。 
]

 对于 (NM=10^6)，这大约是 (10^{19}) 次转换。 蛮力在概念上是正确的，因为它明确地表示了每种可能的配置，但门户位置创建了太多的组合。 

关键的观察是我们实际上不需要记住两个门户位置。 一旦发生传送，当前单元的传送门就有已知的方向，并且另一个传送门可以被下一个镜头取代。 因此，与下一个传送相关的唯一信息是当前组件以及新传送门应放置的单元格。 

如果空闲单元在至少一个方向上紧邻实体墙之前，则将其称为入口端点。 从单元格 (x) 向某个方向射击恰好有一个端点 (y)：紧邻该射线上第一个实体墙之前的单元格。 如果 (y) 是自由的，那么从 (x) 射击可以在 (y) 处创建一个安全传送门。 

现在考虑自由单元的两个不同的连接组件。 如果组件 (A) 中有一个端点 (x)，其射击在组件 (B) 中创建安全端点 (y)，我们可以将其用作有向边（A\to B）。 第一个这样的边缘需要两次射击。 到达 (B) 后，到达端点处的门户已经存在，因此沿着另一个组件边缘移动仅需要一次额外的射击。 

因此，该问题已成为自由单元连通分量上的普通未加权最短路径问题。 我们可以使用 BFS 找到这些组件，在 (O(NM)) 中生成所有可能的门户转换，然后在组件图上运行另一个 BFS。 

比较是：

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O((NM)^3)) 状态 | (O((NM)^3)) | 太慢了 |
 | 最佳 | (O(NM)) | (O(NM)) | 已接受 |

 ## 算法演练

 1. 读取网格并找到起始和退出单元格。 仅治疗`.`细胞可步行。 玻璃和实心墙都会阻碍普通的活动。 
2. 对所有空闲单元运行洪水填充。 为每个空闲单元分配一个连接组件标识符。 在此遍历过程中，标记与实体墙相邻的每个空闲单元。 这样的单元可以是安全的门户端点。 
3. 对于每个端点，确定射击将在四个方向中的每一个方向上创建什么端点。 例如，向左方向，找到第一个`W`向左移动单元格并立即将其向右移动。 我们可以通过四次线性扫描（两次行扫描和两次列扫描）来计算这些值。 
4. 构建隐式组件图。 对于每个端点 (x) 和每个方向，令 (y) 为沿该方向拍摄所到达的端点。 如果 (y) 是玻璃池或者 (x) 和 (y) 属于同一组件，则忽略转变。 否则，添加从 (x) 分量到 (y) 分量的定向过渡，记住 (x)、(y) 和拍摄方向。 
5. 如果开始和退出具有相同的组件标识符，则找到从（S）到（E）的普通BFS路径并以零次射击输出。 没有什么需要进一步优化的，因为零是可能的最小射击次数。 
6. 否则，从包含 (S) 的组件开始，在组件图上运行 BFS。 为每个新到达的组件存储源端点、目标端点和到达它的射击方向。 BFS 是合适的，因为每个组件转换都代表一次额外的瞬移，因此在第一次瞬移后又代表一次额外的镜头。 
7. 如果该图中的出口组件不可达，则输出`-1 -1`。 每个可能的安全门户转换都被表示为边缘，因此没有剩余的方法可以在自由单元组件之间移动。 
8. 重建最短组件路径。 假设它的转移是

 [
 x_0\到 y_0,\quad x_1\到 y_1,\quad \ldots,\quad x_{k-1}\到 y_{k-1}。 
]

 第一次过渡需要两次拍摄。 从 (x_0) 向 (y_0) 发射橙色，然后从 (x_0) 向任何相邻的实体墙发射蓝色，因此蓝色传送门位于 (x_0)。 进入蓝色传送门会传送到 (y_0)。 
9. 在每个中间组件内，从前一个转换的目标 (y_{i-1}) 走到下一个转换的源 (x_i)。 这些都是普通的自由细胞运动，不需要射击。 
10. 对于以后的每个过渡 (x_i\to y_i)，在 (x_i) 处拍摄与当前存在的入口相反的颜色。 然后进入 (x_i) 处的现有门户。 这将花费一次新的射击并将旅行者传送到 (y_i)。 进入传送门的方向正是在之前的过渡中创建的射击方向（x_i）。 
11. 最终传送后，从目的地端点正常步行至 (E)。 
12. 数一数`O`和`B`作为一个镜头和每一个`M`作为一个运动。 镜头数量为 (k+1)，其中 (k) 是组件转换的数量。 

### 为什么它有效

 不变的是，每次传送后，旅行者都会站在最新镜头创建的端点处，并且该端点处的传送门仍然可用。 另一种颜色可以移动到下一个组件转换所需的端点。 因此，组件图的每个有向边都是可实现的，第一个边花费两次镜头，而后面的每个边花费一次。 

相反，不同自由单元组件之间的每个安全传送都必须使用入口端点，该入口端点是紧邻某个实体墙之前的自由单元。 创建另一个端点的镜头精确定义了我们的四个方向扫描生成的过渡之一。 因此，任何有效的解决方案都会在我们的组件图中产生一条路径。 BFS 找到此类转换的最小数量，因此 (k+1) 是可能的最小镜头数量。 

运动界限也来自组件构造。 最短组件路径永远不会重复组件。 在每个访问的组件内，生成的行走最多使用 (\text{size(component)}-1) 个普通移动。 每个组件转换有一次门户入口移动。 如果路径使用 (k+1) 个分量，则总移动次数最多为

 \sum\text{大小（组件）}-1
 \le NM-1，
 ]

 这远远低于所需的 (2NM)。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from array import array
from collections import deque

DIRS = "UDLR"
DR = (-1, 1, 0, 0)

def solve_stream(readline):
    n, m = map(int, readline().split())

    rows = []
    grid = bytearray()
    for _ in range(n):
        s = readline().strip().encode()
        rows.append(s)
        grid.extend(s)

    sr, sc = map(int, readline().split())
    er, ec = map(int, readline().split())
    sr -= 1
    sc -= 1
    er -= 1
    ec -= 1

    vcount = n * m
    start = sr * m + sc
    finish = er * m + ec

    # 0 = not a boundary endpoint, 1 = safe portal endpoint.
    boundary = bytearray(vcount)

    # Direction of any solid wall adjacent to an endpoint.
    # Encoding: U=0, D=1, L=2, R=3.
    first_dir = bytearray(vcount)

    # Connected components of free cells.
    comp = array('i', [-1]) * vcount
    component_count = 0

    for i in range(vcount):
        if grid[i] != 46 or comp[i] != -1:
            continue

        cid = component_count
        component_count += 1

        q = deque([i])
        comp[i] = cid

        while q:
            x = q.popleft()
            r = x // m
            c = x - r * m

            is_boundary = False

            if grid[x - m] == 87:
                is_boundary = True
                first_dir[x] = 0
            elif grid[x + m] == 87:
                is_boundary = True
                first_dir[x] = 1
            elif grid[x - 1] == 87:
                is_boundary = True
                first_dir[x] = 2
            elif grid[x + 1] == 87:
                is_boundary = True
                first_dir[x] = 3

            if is_boundary:
                boundary[x] = 1

            y = x - m
            if grid[y] == 46 and comp[y] == -1:
                comp[y] = cid
                q.append(y)

            y = x + m
            if grid[y] == 46 and comp[y] == -1:
                comp[y] = cid
                q.append(y)

            y = x - 1
            if grid[y] == 46 and comp[y] == -1:
                comp[y] = cid
                q.append(y)

            y = x + 1
            if grid[y] == 46 and comp[y] == -1:
                comp[y] = cid
                q.append(y)

    start_comp = comp[start]
    finish_comp = comp[finish]

    # If ordinary movement already reaches the exit, no shot is needed.
    if start_comp == finish_comp:
        seen = bytearray(vcount)
        parent = array('i', [-1]) * vcount
        pdir = bytearray(vcount)

        q = deque([start])
        seen[start] = 1

        while q and not seen[finish]:
            x = q.popleft()

            for d, delta in enumerate((-m, m, -1, 1)):
                y = x + delta
                if grid[y] == 46 and not seen[y]:
                    seen[y] = 1
                    parent[y] = x
                    pdir[y] = d
                    q.append(y)

        path = []
        cur = finish
        while cur != start:
            path.append(pdir[cur])
            cur = parent[cur]
        path.reverse()

        out = ["0 {}".format(len(path))]
        out.extend("M" + DIRS[d] for d in path)
        return "\n".join(out) + "\n"

    # For every boundary cell, these arrays store the endpoint obtained
    # by shooting in the corresponding direction.
    left = array('i', [-1]) * vcount
    right = array('i', [-1]) * vcount
    up = array('i', [-1]) * vcount
    down = array('i', [-1]) * vcount

    # Horizontal sweeps.
    for r in range(n):
        base = r * m
        last_w = -1

        for c in range(m):
            x = base + c
            if grid[x] == 87:
                last_w = c
            elif boundary[x]:
                left[x] = base + last_w + 1

        next_w = m
        for c in range(m - 1, -1, -1):
            x = base + c
            if grid[x] == 87:
                next_w = c
            elif boundary[x]:
                right[x] = base + next_w - 1

    # Vertical sweeps.
    for c in range(m):
        last_w = -1

        for r in range(n):
            x = r * m + c
            if grid[x] == 87:
                last_w = r
            elif boundary[x]:
                up[x] = (last_w + 1) * m + c

        next_w = n
        for r in range(n - 1, -1, -1):
            x = r * m + c
            if grid[x] == 87:
                next_w = r
            elif boundary[x]:
                down[x] = (next_w - 1) * m + c

    # Linked lists of boundary cells, one list per component.
    head = array('i', [-1]) * component_count
    bnext = array('i', [-1]) * vcount

    for x in range(vcount):
        if boundary[x]:
            cid = comp[x]
            bnext[x] = head[cid]
            head[cid] = x

    # BFS over connected components.
    parent_comp = array('i', [-1]) * component_count
    edge_src = array('i', [-1]) * component_count
    edge_dst = array('i', [-1]) * component_count
    edge_dir = bytearray(component_count)

    parent_comp[start_comp] = start_comp
    q = deque([start_comp])

    target_arrays = (up, down, left, right)

    while q and parent_comp[finish_comp] == -1:
        cid = q.popleft()
        x = head[cid]

        while x != -1:
            for d, arr in enumerate(target_arrays):
                y = arr[x]

                if y == -1 or grid[y] != 46:
                    continue

                nc = comp[y]
                if nc == cid or parent_comp[nc] != -1:
                    continue

                parent_comp[nc] = cid
                edge_src[nc] = x
                edge_dst[nc] = y
                edge_dir[nc] = d
                q.append(nc)

                if nc == finish_comp:
                    break

            x = bnext[x]

            if parent_comp[finish_comp] != -1:
                break

    if parent_comp[finish_comp] == -1:
        return "-1 -1\n"

    # Recover component transitions in forward order.
    transitions = []
    cid = finish_comp

    while cid != start_comp:
        transitions.append(
            (edge_src[cid], edge_dst[cid], edge_dir[cid])
        )
        cid = parent_comp[cid]

    transitions.reverse()

    # Local BFS inside one free-cell component.
    seen = array('i', [0]) * vcount
    parent = array('i', [-1]) * vcount
    pdir = bytearray(vcount)
    stamp = 0

    def walk_path(a, b, cid):
        nonlocal stamp

        if a == b:
            return []

        stamp += 1
        q = deque([a])
        seen[a] = stamp

        while q:
            x = q.popleft()

            for d, delta in enumerate((-m, m, -1, 1)):
                y = x + delta

                if grid[y] != 46:
                    continue
                if comp[y] != cid:
                    continue
                if seen[y] == stamp:
                    continue

                seen[y] = stamp
                parent[y] = x
                pdir[y] = d

                if y == b:
                    q.clear()
                    break

                q.append(y)

        result = []
        cur = b

        while cur != a:
            result.append(pdir[cur])
            cur = parent[cur]

        result.reverse()
        return result

    actions = []

    # First component: walk from S to the source of the first transition.
    x0, y0, d0 = transitions[0]
    path = walk_path(start, x0, start_comp)
    actions.extend("M" + DIRS[d] for d in path)

    # First teleport needs two shots.
    actions.append("O" + DIRS[d0])
    actions.append("B" + DIRS[first_dir[x0]])

    # Enter the blue portal at x0.
    actions.append("M" + DIRS[first_dir[x0]])

    current = y0
    active_dir = d0

    # Every later teleport needs one new shot.
    for i in range(1, len(transitions)):
        x, y, d = transitions[i]

        cid = comp[current]
        path = walk_path(current, x, cid)
        actions.extend("M" + DIRS[move_d] for move_d in path)

        # The active portal at x was created by the previous transition.
        # Replace the other color with a portal at y.
        color = "B" if i % 2 == 1 else "O"
        actions.append(color + DIRS[d])

        # Enter the still existing portal at x.
        actions.append("M" + DIRS[active_dir])

        current = y
        active_dir = d

    # Final component: walk from the last portal endpoint to E.
    final_cid = comp[current]
    path = walk_path(current, finish, final_cid)
    actions.extend("M" + DIRS[d] for d in path)

    shots = len(transitions) + 1
    moves = len(actions) - shots

    out = [f"{shots} {moves}"]
    out.extend(actions)
    return "\n".join(out) + "\n"

def main():
    sys.stdout.write(solve_stream(input))

if __name__ == "__main__":
    main()
```第一阶段标记普通自由单元连接。 玻璃细胞永远不会插入 BFS，而这正是普通运动所需要的。 同时，如果空闲单元的四个邻居中至少有一个是边界端点，则该空闲单元被标记为边界端点。`W`。 所存储的`first_dir`给出可以将传送门直接放置在该单元格的方向.

 四个方向扫描是消除潜在二次射线模拟的部分。 在从左到右的行扫描中，`last_w`是左边最近的实体墙。 对于边界单元 (x)，向左射击的终点就是紧邻其之后的单元`last_w`。 其他三个数组是对称计算的。 由于每个单元都参与恒定数量的扫描操作，因此该阶段是线性的。 

组件图是在 BFS 期间延迟生成的，而不是存储每个图边。 这可以节省内存，因为组件可能包含许多边界单元。 当从队列中删除组件时，将扫描其边界单元的链接列表，并检查其四个可能目标中的每一个。 每个组件都被处理一次。 

重建使用第二种 BFS。 组件图告诉我们哪些单元格必须通过传送门连接，但它没有告诉我们如何在组件内部从上一个传送端点走到下一个射击位置。`walk_path`正好解决了当地的问题。 由于组件图路径从不重复组件，因此所有这些本地 BFS 运行探索的单元总数仍然是 (O(NM))。 

两个初始镜头的顺序是经过深思熟虑的。 橙色放置在第一个目的地，蓝色放置在当前源。 进入蓝色传送门然后到达橙色传送门。 在以后的每次转换中，当前不占用源端点的颜色都会被替换。 源头现有的门户在使用之前永远不会被破坏。 

所有网格索引内部都是从零开始的。 由于每个空闲单元都严格位于实体外边界内，因此诸如`x - 1`,`x + 1`,`x - m`， 和`x + m`每当评估其是否有空闲细胞时都是安全的。 整数溢出在 Python 中不是问题，并且紧凑`array`容器将百万单元状态保持在合理的内存使用范围内。 

## 工作示例

 ### 示例 1

 空闲单元分成包含起点的上部组件和包含出口的下部组件。 起始单元本身是有效的门户端点，因为它与左侧的实心墙相邻。 

有用的过渡从一开始就向下进行。 射线穿过玻璃单元，到达底部实体壁，并在该壁正上方的自由单元处创建一个入口。 

| 舞台| 当前单元格 | 行动| 门户端点 | 组件|
 | ---| ---| ---| ---| ---|
 | 1 | ((2,3)) | ((2,3)) |`OD`| 橙色 ((4,3)) | 启动组件|
 | 2 | ((2,3)) | ((2,3)) |`BL`| 蓝色位于 ((2,3)) | 启动组件|
 | 3 | ((2,3)) | ((2,3)) |`ML`| 传送到 ((4,3)) | 退出组件 |
 | 4 | ((4,3)) |`ML`| 无需门户| 退出组件 |

 前两个动作建立第一个传送，因此 (P=2)。 进入蓝色门户后`ML`，玩家出现在 ((4,3))，并且一个普通的移动到达出口 ((4,2))。 这也说明了为什么必须让光线穿过玻璃。 

### 示例 2

 第一个组件包含开始。 第一个有用的门户转换是在遍历该组件到 ((6,4)) 后准备的。 向上射击穿过玻璃单元并到达实心墙，在 ((3,4)) 处创建一个橙色传送门。 

然后玩家走回 ((2,3))，将蓝色传送门放在右侧，然后进入。 橙色传送门将玩家发送至 ((3,4))，之后最后的动作到达出口。 

| 舞台| 当前单元格 | 行动| 活跃有用的门户 | 组件|
 | ---| ---| ---| ---| ---|
 | 1 | ((2,3)) | ((2,3)) | 步行至 ((6,4)) | 无 | 启动组件|
 | 2 | ((6,4)) | ((6,4)) |`OU`| 橙色 ((3,4)) | 启动组件|
 | 3 | ((6,4)) | ((6,4)) | 步行至 ((2,3)) | 橙色 ((3,4)) | 启动组件|
 | 4 | ((2,3)) | ((2,3)) |`BR`| 蓝色位于 ((2,3)) | 启动组件|
 | 5 | ((2,3)) | ((2,3)) |`MR`| 传送到 ((3,4)) | 退出组件 |
 | 6 | ((3,4)) | ((3,4)) |`MR`| 普通运动| 退出组件 |
 | 7 | ((3,5)) |`MU`| 普通运动| 退出组件 |

 同样只需要两次射击。 长距离行走并不影响目标，因为射击次数已经很少了。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(NM)) | 组件 BFS、四方向扫描、组件图 BFS 和局部路径重建一起仅访问每个单元的恒定数量的网格结构 |
 | 空间| (O(NM)) | 组件标签、四个端点数组、边界列表、BFS 父级和重建状态都是线性的 |

 对于 (N,M\le1000), (NM\le10^6)。 该算法仅对这百万个单元执行恒定数量的传递，并存储线性数量的辅助信息，因此它符合预期的限制。 在门户情况下，生成的移动序列最多也是 (NM-1) 次移动，低于所需的 (2NM) 界限。 

## 测试用例

 建设性问题的输出不是唯一的，因此测试应该验证生成的操作序列，而不是逐字节与样本进行比较。 以下线束检查报告的射击计数，模拟每个动作，包括门户更换和传送，检查是否到达出口，并验证 (2NM) 移动范围。```python
import io

# Import solve_stream from the submitted solution.
# If this code is appended directly after the solution, simply remove
# the import and use solve_stream from the same file.

def run(inp: str) -> str:
    return solve_stream(io.StringIO(inp).readline)

def verify(inp: str, expected_p: int):
    out = run(inp)
    lines = out.strip().splitlines()

    first = list(map(int, lines[0].split()))
    p, s = first
    assert p == expected_p
    assert len(lines) == p + s + 1

    it = iter(inp.strip().splitlines())
    n, m = map(int, next(it).split())
    grid = [next(it) for _ in range(n)]
    sr, sc = map(int, next(it).split())
    er, ec = map(int, next(it).split())
    sr -= 1
    sc -= 1
    er -= 1
    ec -= 1

    pos = (sr, sc)
    portals = [None, None]  # 0 = orange, 1 = blue

    dirs = {
        'U': (-1, 0),
        'D': (1, 0),
        'L': (0, -1),
        'R': (0, 1),
    }

    shots = 0
    moves = 0

    def shoot_endpoint(r, c, d):
        dr, dc = dirs[d]
        nr, nc = r + dr, c + dc

        while grid[nr][nc] != 'W':
            nr += dr
            nc += dc

        return nr - dr, nc - dc, nr, nc

    for action in lines[1:]:
        typ = action[0]
        d = action[1]
        r, c = pos

        if typ in 'OB':
            color = 0 if typ == 'O' else 1
            erow, ecol, wrow, wcol = shoot_endpoint(r, c, d)

            # A glass endpoint is deadly and cannot be used by a valid solution.
            assert grid[erow][ecol] == '.'

            side = (wrow, wcol, d)

            occupied = False
            for portal in portals:
                if portal is not None and portal[2] == side:
                    occupied = True
                    break

            if not occupied:
                portals[color] = (erow, ecol, side)

            shots += 1

        else:
            assert typ == 'M'
            dr, dc = dirs[d]
            nr, nc = r + dr, c + dc

            if grid[nr][nc] == '.':
                pos = (nr, nc)
            else:
                assert grid[nr][nc] == 'W'

                used = None
                for color, portal in enumerate(portals):
                    if portal is None:
                        continue

                    pr, pc, side = portal
                    if (pr, pc) == (r, c) and side[2] == d:
                        used = color
                        break

                assert used is not None

                other = 1 - used
                assert portals[other] is not None

                tr, tc, _ = portals[other]
                assert grid[tr][tc] == '.'
                pos = (tr, tc)

            moves += 1

    assert shots == p
    assert moves == s
    assert pos == (er, ec)
    assert s <= 2 * n * m

# Provided samples.

sample1 = """\
5 5
WWWWW
WW..W
WWGWW
W...W
WWWWW
2 3
4 2
"""

sample2 = """\
7 6
WWWWWW
W..W.W
W.W..W
W.W..W
W.WG.W
W...WW
WWWWWW
2 3
2 5
"""

sample3 = """\
5 5
WWWWW
W.G.W
WW.GW
W.G.W
WWWWW
2 2
4 2
"""

verify(sample1, 2)
verify(sample2, 2)
verify(sample3, 4)

# Custom case 1: minimum grid, start equals exit.
minimum_case = """\
3 3
WWW
W.W
WWW
2 2
2 2
"""

verify(minimum_case, 0)

# Custom case 2: glass cells form a complete barrier and every nontrivial
# portal endpoint is glass, so no safe component transition exists.
impossible_case = """\
5 5
WWWWW
W.GGW
WGWGW
WGG.W
WWWWW
2 2
4 4
"""

out = run(impossible_case).strip()
assert out == "-1 -1"

# Custom case 3: the shot must cross several glass cells before reaching
# the solid border. The endpoint is the free cell immediately before W.
multi_glass_case = """\
5 5
WWWWW
W...W
WGGGW
W...W
WWWWW
2 2
4 2
"""

verify(multi_glass_case, 2)

# Custom case 4: maximum-size all-free grid. Ordinary BFS is enough,
# so the optimal number of shots is zero.
n = 1000
m = 1000
rows = ["W" + "." * (m - 2) + "W"] * (n - 2)
maximum_case = (
    f"{n} {m}\n"
    + "W" * m + "\n"
    + "\n".join(rows) + "\n"
    + "W" * m + "\n"
    + "2 2\n"
    + f"{n - 1} {m - 1}\n"
)

verify(maximum_case, 0)
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品1 | (P=2) | 首次传送、透过玻璃射击和传送门入口 |
 | 样品2 | (P=2) | 传送前后的长时间普通行走|
 | 样品 3 | (P=4) | 几个连续的门户过渡和颜色交替 |
 |`minimum_case`| (0) 镜头 | 开始已经等于退出和零次处理|
 |`impossible_case`|`-1 -1`| 玻璃端点不得被视为安全门户 |
 |`multi_glass_case`| (P=2) | 多个玻璃单元之后最近的实体壁 |
 |`maximum_case`| (0) 镜头 | (1000\times1000) 输入和线性时间行为 |

 ## 边缘情况

 对于最小网格，只有一个可能的空闲单元。 如果既是启动又是退出，则组件检查立即成功。 该算法从不构建门户图并输出`0 0`，这是最佳的，因为没有任何镜头可以在零的基础上进行改进。 

对于起点和出口由普通自由单元连接的迷宫，相同的组件测试在任何门户处理之前终止算法。 这对于最优性也是必要的。 具有一次或多次射击的基于门户的解决方案无法击败 (P=0)。 

对于玻璃屏障，定向扫描仍可能找到目标单元，但目标是`G`，因此相应的图边被丢弃。 这就是对枪透明的玻璃单元和传送后可以安全占据的玻璃单元之间的确切区别。 因此，不可能的自定义情况没有组件图路径并产生`-1 -1`。 

对于包含多个玻璃单元、随后是自由单​​元、然后是实心墙的射线，扫描不会在玻璃处停止。 它将紧邻实体壁之前的单元记录为端点。 样品 1 和`multi_glass_case`两者都行使这种条件。 仅搜索相邻墙壁的解决方案会错过有效的两次拍摄路线。 

对于重复的组件，将搜索组件图而不是单个端点图。 这可以防止留在一个自由组件内的无用转换。 它还给出了自由的运动范围，因为最短的组件路径最多访问每个组件一次。 

对于第一次传送，源处不存在现有的传送门。 该结构明确地花费了两次镜头，一次用于目的地，一次用于源。 后面的每个过渡仅需要一次拍摄，因为源已包含前一个过渡创建的门户。 这正是包含 (k) 条边的组件路径需要 (k+1) 次镜头的原因。 

对于最终组件，到达后不需要门户。 该算法只是从最终端点走到出口。 这很重要，因为目标是最大限度地减少射击，而不是移动长度，并且创建不必要的最终门户只会使答案变得更糟。
