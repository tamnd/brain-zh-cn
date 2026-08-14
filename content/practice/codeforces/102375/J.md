---
title: "CF 102375J - \u041f\u043e\u0440\u0442\u0430\u043b\u044b"
description: "迷宫是一个（N×M）网格。 牢房可以是普通的自由空间、玻璃墙或实心墙。 普通移动只能在相邻的空闲单元之间进行。 玻璃会阻挡移动，但传送门射击可以穿过它。 外边界完全由实心墙组成。"
date: "2026-08-14T13:19:44+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102375
codeforces_index: "J"
codeforces_contest_name: "\u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0439 \u0440\u0430\u0443\u043d\u0434 \u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442\u0430 \u0421\u0435\u0432\u0435\u0440\u043e-\u0417\u0430\u043f\u0430\u0434\u0430 \u0420\u043e\u0441\u0441\u0438\u0438 \u0438 \u041c\u043e\u0441\u043a\u0432\u044b ICPC 2019"
rating: 0
weight: 102375
solve_time_s: 866
verified: false
draft: false
---

[CF 102375J - \u041f\u043e\u0440\u0442\u0430\u043b\u044b](https://codeforces.com/problemset/problem/102375/J)

 **评级：** -
 **标签：** -
 **求解时间：** 14m 26s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 迷宫是一个（N × M）网格。 牢房可以是普通的自由空间、玻璃墙或实心墙。 普通移动只能在相邻的空闲单元之间进行。 玻璃会阻挡移动，但传送门射击可以穿过它。 外边界完全由实心墙组成。 

入口连接到实体壁单元的一侧。 有橙色和蓝色两种颜色，每种颜色一次只能存在一个传送门。 射击取代了该颜色的旧门户。 当向某个方向进行射击时，光线会继续传播，直到到达最近的固体墙壁。 玻璃池不会阻止射线。 传送门放置在面向射手的墙壁一侧。 

仅当传送门的一侧与空闲单元相邻时，传送门才有用。 如果相应的一面是玻璃，则进入或离开门户将是不可能的或致命的，因此这样的门户不能参与有效的路线。 

有趣的是，这两个门户位置是持久的。 使用一个传送门后，另一个传送门仍保持在原来的位置。 这使我们能够使用单个附加镜头将一种颜色替换为新的目的地门户，然后输入另一种颜色并传送到新目的地。 

输出不要求普通移动中的最短路线。 主要目标是尽量减少射击次数。 在具有最少射击次数的所有解决方案中，接受最多具有 (2NM) 移动步数的任何路线。 问题允许 (N,M\le1000) 个，因此最多可以有 (10^6) 个单元格。 二次或三次依赖于单元数量的算法已经太大，而 (O(NM)) 解是自然的目标。 最初的比赛限制为 2 秒和 512 MiB。 

第一个边缘情况是当开始和退出位于同一个普通连接组件中时。 例如，```
3 3
WWW
W.W
WWW
2 2
2 2
```正确的输出是```
0 0
```根本没有任何动作。 在考虑普通移动之前总是构建两个传送门的解决方案将不必要地使用枪。 

第二个边缘情况是紧邻实心墙之前的玻璃单元。 考虑```
5 5
WWWWW
W.GWW
WWWWW
W...W
WWWWW
2 2
4 2
```启动和退出位于不同的组件中。 从一开始就射击到玻璃牢房后的实心墙，但传送门放置在玻璃牢房旁边，因此无法安全使用。 在其他方向上的射击只能到达起始组件周围的实心墙壁。 正确的输出是`-1 -1`。 如果不小心将透过玻璃可见的每一面墙都视为可用目的地，则会错误地声称这两个组件可以连接。 

第三种边缘情况是针对相同普通组件的门户。 在完全开放的内部，向边界墙射击可能会创建一个门户，但与路线相关的两侧已经通过普通运动连接起来。 这样的门户绝不能算作进步。 将每个可能的镜头视为图形边缘会产生许多无用的自循环。 

第四种边缘情况是组件可能包含自由单元，但没有直接邻近实体壁的自由单元。 这样的组件有时可以穿过玻璃并在其他地方创建门户，但它无法为自己放置可用的源门户。 因此，它不能用作传送的当前侧。 在决定哪些图的边实际上是可遍历的时，这种区别很重要。 

## 方法

 直接暴力模型从完整的物理状态开始。 该状态必须包含当前的空闲单元以及两个彩色门户的位置。 一个门户有 (O(NM)) 可能的相关墙面，因此一对门户已经给出 (O((NM)^2)) 个配置。 乘以当前位置给出 (O((NM)^3)) 种可能的状态。 对于 (NM=10^6)，最坏情况下的状态约为 (10^{18}) 个状态。 即使每个状态存储一个字节也是不可能的，因此完整的状态空间搜索不是一种可行的方法。 

关键的观察结果是，普通的运动完全消除了在计数镜头时区分单个细胞的需要。 在自由单元的一个连接组件内，我们可以移动到任何其他单元而无需开枪。 唯一有意义的过渡是从一个自由空间组件传送到另一个自由空间组件。 

考虑不包含实心壁​​的水平或垂直单元格序列。 假设其右端点后面是实心墙，并且紧邻该墙之前的单元是自由的。 序列中的每个空闲单元都可以射向墙壁。 生成的传送门被放置在与最终空闲单元相邻的墙侧。 射手和墙壁之间的玻璃隔间并不重要。 因此，该序列中表示的每个空闲组件都可以创建一个门户，该门户的可用端点属于包含最终空闲单元的组件。 

这给出了一个有向图，其顶点是自由单元的连通分量。 当组件 (A) 中的单元可以射向实心壁并且面向射击者的壁的一侧与组件 (B) 中的自由单元相邻时，存在边缘（A\ 到 B）。 那么组件 (B) 就是新创建的门户的可能目的地。 

方向意义重大。 如果 (A) 可以看到属于 (B) 的可用门户端，那么我们可以从 (A) 创建该目标门户。 一个新的镜头可能无法实现反向过渡。 

门户颜色解释了为什么该图足够了。 第一次传送需要两次射击，因为两种颜色最初都没有传送门。 将一种颜色放置在当前组件中的任何可用墙面上，并将另一种颜色放置在图形边缘描述的目的地处。 传送后，一个传送门位于当前组件中，另一个传送门位于新组件中。 要到达另一个组件，只需一次射击。 将仍在您身后的门户替换为下一个目的地的新门户，然后输入当前组件中保留的门户。 

因此，当（K>0）时，使用（K）条图边的路线需要恰好（K+1）次射击。 使用零边缘的路线需要零射击。 因此，最小化发射次数与在组件图中查找最短有向路径相同。

我们不需要明确地搜索所有可能的射线。 两个实体墙之间的水平段可以通过两次扫描进行处理，每个扫描方向一次。 垂直段的处理方式相同。 每个自由单元参与恒定数量的操作，因此可以在线性时间内构建完整的图。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 完整的状态空间搜索| (O((NM)^3)) 状态 | (O((NM)^3)) | 太慢了 |
 | 最优组件图| (O(NM)) | (O(NM)) | 已接受 |

 ## 算法演练

 1. 标记每个连通分量`.`使用 BFS 的细胞。 当两个自由单元可以使用普通移动而不交叉地连接时，它们完全属于同一个组件`G`或者`W`。 

在发现组件时，请记住与实体壁直接相邻的一个自由单元以及该壁的方向。 每当组件需要执行传送时，这样的单元格都会为我们提供源门户的有效位置。 
2. 通过扫描每一行构建有向分量图。 

对于固定行，查看不包含的最大间隔`W`。 如果紧邻右侧实体墙之前的单元格是空闲的，则该间隔中的每个空闲单元格都可以向右射击并创建属于该最终空闲单元格的组件的可用门户。 将每个射手组件的边缘添加到该目标组件。 

从左到右重复相同的扫描以获得向左的边缘。 
3. 对每列执行类似的两次扫描。 

向下扫掠可处理墙壁位于射手下方的传送门。 向上扫掠可处理墙壁位于射手上方的传送门。 

玻璃池永远不会停止扫描。 唯一重要的是紧邻实体壁的单元是否是自由的。 如果该单元格是`G`，门户的可用侧将有一个玻璃墙，并且不得添加为边缘。 
4. 忽略源分量和目标分量相等的图边。 

普通的移动已经将这样的组件中的每一对单元连接起来，因此传送门无法提高射击次数。 
5. 对起始组件的有向组件图运行 BFS。 

每条图边代表一次传送到新组件。 所有边的成本相同，因此普通 BFS 给出的传送次数最少。 存储前一个组件以及每个发现的边缘的准确射击单元和方向。 稍后需要这些证人来重建实际行动。 
6. 如果退出组件不可达，则打印`-1 -1`。 

组件图描述了引入新的可用门户目的地的每一种可能的方式。 如果在此图中无法到达出口组件，则任何传送门射击序列都无法使其到达。 
7. 如果start和exit在同一个组件中，则重建它们之间的普通路径并以零射击输出。 
8. 否则，重建 BFS 找到的组件序列。 

假设第一条图边使用射手单元 (u)、方向 (d)，并到达单元 (v)。 选择记住的起始组件的墙相邻单元 (q) 作为第一个入口位置。 从起点走到（q），将蓝色传送门放在那里，然后走到（u），按照方向（d）放置橙色传送门，返回到（q），然后进入蓝色传送门。 传送将我们带到（v）。 

用了两次射击，这正是第一次瞬移所需的成本。 
9. 对于后面的每一条图边，当前组件中已经存在一个入口。 从当前到达的牢房走到射击目击者（u），向下一个目的地射击另一种颜色，返回旧传送门并进入。 

新门户现在位于下一个组件中。 这正好花费一枪。 
10. 到达出口组件后，从到达单元正常步行至出口。 

对于每个组件，我们在该组件内使用一个简单的 BFS 路径。 每个组件在最短组件路径上最多出现一次，因此普通行走的总量保持在所需的（2NM）范围内。 

### 为什么它有效

 不变量是，在每次图形转换之前，将一个入口放置在当前组件中可用的墙壁一侧。 另一个门户要么不相关，要么正在被下一个镜头取代。 存储的图形边缘告诉我们准确的拍摄位置，以便将新的门户放置在下一个组件中可用的墙壁一侧。 然后我们返回到现有的门户并穿过它，到达新的组件。 

每次第一次传送都需要两次射击，因为两种颜色最初都不存在。 以后每次传送到新到达的组件都需要至少一次新的射击，因为如果不更改传送门位置，目的地对就无法获取新组件。 相反，该构造对于每个后续图形边缘恰好使用一个新镜头。 因此，具有 (K) 条边的最短图形路径给出了尽可能少的 (K+1) 个镜头。 

该图准确地包含了有用的传送转换。 当通过自由单元或玻璃单元可以看到目标墙侧并且其直接单元是自由的时，可以精确地创建过渡。 这四次扫描正好列举了这些情况。 因此，该图上的 BFS 找到新门户目的地的最小可能数量，这是所需的最佳值。 

## Python 解决方案```python
import sys
from collections import deque
from array import array

input = sys.stdin.readline

# Direction codes:
# 0 = U, 1 = D, 2 = L, 3 = R
DR = (-1, 1, 0, 0)
DC = (0, 0, -1, 1)
DIR_CHARS = b"UDLR"
OPPOSITE = (1, 0, 3, 2)

def solve():
    n, m = map(int, input().split())
    g = [input().strip() for _ in range(n)]

    sr, sc = map(int, input().split())
    er, ec = map(int, input().split())
    sr -= 1
    sc -= 1
    er -= 1
    ec -= 1

    total = n * m
    start = sr * m + sc
    finish = er * m + ec

    # Component id of every cell, -1 for walls and glass.
    comp = array('i', [-1]) * total

    # One usable portal position for each component.
    portal_cell = array('i')
    portal_dir = bytearray()

    component_count = 0
    q = deque()

    for r in range(1, n - 1):
        row = g[r]
        for c in range(1, m - 1):
            pos = r * m + c
            if row[c] != '.' or comp[pos] != -1:
                continue

            cid = component_count
            component_count += 1
            portal_cell.append(-1)
            portal_dir.append(0)

            comp[pos] = cid
            q.clear()
            q.append(pos)

            while q:
                p = q.popleft()
                pr = p // m
                pc = p - pr * m

                # Find one free cell with a solid wall next to it.
                if portal_cell[cid] == -1:
                    if g[pr - 1][pc] == 'W':
                        portal_cell[cid] = p
                        portal_dir[cid] = 0
                    elif g[pr + 1][pc] == 'W':
                        portal_cell[cid] = p
                        portal_dir[cid] = 1
                    elif g[pr][pc - 1] == 'W':
                        portal_cell[cid] = p
                        portal_dir[cid] = 2
                    elif g[pr][pc + 1] == 'W':
                        portal_cell[cid] = p
                        portal_dir[cid] = 3

                np = p - m
                if g[pr - 1][pc] == '.' and comp[np] == -1:
                    comp[np] = cid
                    q.append(np)

                np = p + m
                if g[pr + 1][pc] == '.' and comp[np] == -1:
                    comp[np] = cid
                    q.append(np)

                np = p - 1
                if g[pr][pc - 1] == '.' and comp[np] == -1:
                    comp[np] = cid
                    q.append(np)

                np = p + 1
                if g[pr][pc + 1] == '.' and comp[np] == -1:
                    comp[np] = cid
                    q.append(np)

    start_comp = comp[start]
    finish_comp = comp[finish]

    # If ordinary movement is already enough, construct that path later.
    # Otherwise build the component graph.
    head = array('i', [-1]) * component_count
    to = array('i')
    nxt = array('i')
    witness = array('i')
    target_cell = array('i')
    edge_dir = bytearray()

    def add_edge(a, b, u, v, d):
        if a == b:
            return
        idx = len(to)
        to.append(b)
        witness.append(u)
        target_cell.append(v)
        edge_dir.append(d)
        nxt.append(head[a])
        head[a] = idx

    # Horizontal edges: shooting right.
    for r in range(1, n - 1):
        target = -1
        base = r * m
        for c in range(m - 1, 0, -1):
            ch = g[r][c]
            if ch == 'W':
                if g[r][c - 1] == '.':
                    target = base + c - 1
                else:
                    target = -1
            elif ch == '.' and target != -1:
                u = base + c
                add_edge(comp[u], comp[target], u, target, 3)

    # Horizontal edges: shooting left.
    for r in range(1, n - 1):
        target = -1
        base = r * m
        for c in range(0, m - 1):
            ch = g[r][c]
            if ch == 'W':
                if g[r][c + 1] == '.':
                    target = base + c + 1
                else:
                    target = -1
            elif ch == '.' and target != -1:
                u = base + c
                add_edge(comp[u], comp[target], u, target, 2)

    # Vertical edges: shooting down.
    for c in range(1, m - 1):
        target = -1
        for r in range(n - 1, 0, -1):
            ch = g[r][c]
            if ch == 'W':
                if g[r - 1][c] == '.':
                    target = (r - 1) * m + c
                else:
                    target = -1
            elif ch == '.':
                if target != -1:
                    u = r * m + c
                    add_edge(comp[u], comp[target], u, target, 1)

    # Vertical edges: shooting up.
    for c in range(1, m - 1):
        target = -1
        for r in range(0, n - 1):
            ch = g[r][c]
            if ch == 'W':
                if g[r + 1][c] == '.':
                    target = (r + 1) * m + c
                else:
                    target = -1
            elif ch == '.' and target != -1:
                u = r * m + c
                add_edge(comp[u], comp[target], u, target, 0)

    # BFS on the component graph.
    parent_comp = array('i', [-1]) * component_count
    parent_edge = array('i', [-1]) * component_count

    parent_comp[start_comp] = start_comp
    cq = deque([start_comp])

    while cq:
        a = cq.popleft()

        if a == finish_comp:
            break

        # A component without a free cell directly adjacent to W
        # cannot serve as the source of a usable portal.
        if portal_cell[a] == -1:
            continue

        e = head[a]
        while e != -1:
            b = to[e]
            if parent_comp[b] == -1:
                parent_comp[b] = a
                parent_edge[b] = e
                cq.append(b)
            e = nxt[e]

    if parent_comp[finish_comp] == -1:
        print("-1 -1")
        return

    # Temporary arrays for paths inside ordinary components.
    cell_parent = array('i', [-1]) * total

    def get_path(a, b, cid):
        """Return direction codes of a shortest ordinary path a -> b."""
        if a == b:
            return []

        bfsq = [a]
        visited = [a]
        cell_parent[a] = a
        qi = 0

        while qi < len(bfsq):
            p = bfsq[qi]
            qi += 1

            if p == b:
                break

            r = p // m
            c = p - r * m

            np = p - m
            if comp[np] == cid and cell_parent[np] == -1:
                cell_parent[np] = p
                bfsq.append(np)
                visited.append(np)

            np = p + m
            if comp[np] == cid and cell_parent[np] == -1:
                cell_parent[np] = p
                bfsq.append(np)
                visited.append(np)

            np = p - 1
            if comp[np] == cid and cell_parent[np] == -1:
                cell_parent[np] = p
                bfsq.append(np)
                visited.append(np)

            np = p + 1
            if comp[np] == cid and cell_parent[np] == -1:
                cell_parent[np] = p
                bfsq.append(np)
                visited.append(np)

        path = []
        cur = b
        while cur != a:
            p = cell_parent[cur]
            delta = cur - p
            if delta == -m:
                path.append(0)
            elif delta == m:
                path.append(1)
            elif delta == -1:
                path.append(2)
            else:
                path.append(3)
            cur = p

        path.reverse()

        for v in visited:
            cell_parent[v] = -1

        return path

    # Reconstruct component path and corresponding graph edges.
    components = []
    edges = []

    cur = finish_comp
    while cur != start_comp:
        components.append(cur)
        e = parent_edge[cur]
        edges.append(e)
        cur = parent_comp[cur]

    components.append(start_comp)
    components.reverse()
    edges.reverse()

    actions = bytearray()
    shots = 0
    steps = 0

    def add_move(d):
        nonlocal steps
        actions.extend((77, DIR_CHARS[d], 10))
        steps += 1

    def add_shot(color, d):
        nonlocal shots
        actions.extend((color, DIR_CHARS[d], 10))
        shots += 1

    if not edges:
        path = get_path(start, finish, start_comp)
        for d in path:
            add_move(d)

        out = bytearray()
        out.extend(f"{shots} {steps}\n".encode())
        out.extend(actions)
        sys.stdout.buffer.write(out)
        return

    # First teleport.
    first_edge = edges[0]
    first_comp = start_comp

    q_cell = portal_cell[first_comp]
    q_dir = portal_dir[first_comp]

    u = witness[first_edge]
    v = target_cell[first_edge]
    d = edge_dir[first_edge]

    # Move to the source portal position.
    path = get_path(start, q_cell, first_comp)
    for x in path:
        add_move(x)

    # Blue is the initial source portal.
    add_shot(ord('B'), q_dir)

    # Move to the shooting position for the destination portal.
    path = get_path(q_cell, u, first_comp)
    for x in path:
        add_move(x)

    # Orange becomes the destination portal.
    add_shot(ord('O'), d)

    # Return to the blue portal.
    for x in reversed(path):
        add_move(OPPOSITE[x])

    # Enter the blue portal and arrive at v.
    add_move(q_dir)

    current_cell = v
    current_portal_dir = d
    current_portal_color = ord('O')

    # Remaining teleports.
    for i in range(1, len(edges)):
        e = edges[i]
        cid = components[i]

        u = witness[e]
        v = target_cell[e]
        d = edge_dir[e]

        # Move from the arrival point to the shooting position.
        path = get_path(current_cell, u, cid)
        for x in path:
            add_move(x)

        # Replace the portal of the opposite color.
        new_color = ord('B') if current_portal_color == ord('O') else ord('O')
        add_shot(new_color, d)

        # Return to the existing portal.
        for x in reversed(path):
            add_move(OPPOSITE[x])

        # Enter the existing portal.
        add_move(current_portal_dir)

        current_cell = v
        current_portal_dir = d
        current_portal_color = new_color

    # Finish by ordinary movement.
    final_cid = finish_comp
    path = get_path(current_cell, finish, final_cid)
    for x in path:
        add_move(x)

    out = bytearray()
    out.extend(f"{shots} {steps}\n".encode())
    out.extend(actions)
    sys.stdout.buffer.write(out)

if __name__ == "__main__":
    solve()
```第一阶段仅标签`.`细胞。 这`comp`array 是一个紧凑的整数数组，而不是一个 Python 列表，这一点很重要，因为可以有一百万个单元格。 在同一个 BFS 期间，代码会记住与实心墙相邻的空闲单元。 这是可以放置传送序列的第一个传送门的位置。 

图的构造故意避免为每个单元格存储四个最近壁值。 相反，每行和每列都被扫描两次。 在从右到左扫描期间，当遇到实心墙时，代码会记住紧邻其左侧的空闲单元。 另一堵固体墙之前的每个后来的自由单元都可以射向该墙。 左、上、下扫描是对称的。 

检查紧邻实体壁的细胞的条件是微妙的部分。 玻璃牢房可以位于射手和墙壁之间的任何位置，但接触传送门的牢房必须是自由的。 如果是的话`G`，传送门无法安全使用，因此目标被丢弃。 

组件 BFS 存储用于到达每个组件的精确图边。 该边包含射击单元、方向和目标单元。 因此，图搜索不仅告诉我们存在过渡，它还提供了足够的几何信息来打印相应的`O`或者`B`行动。 

这`get_path`函数执行仅限于一个组件的普通 BFS。 仅当出现在最终组件路径上的组件时才会调用它。 组件内的简单路径的单元数少于其数量，因此总工作保持线性。 仅针对该 BFS 触及的单元重置前驱数组，而不是每次都重建一百万个元素的结构。 

输出累积在`bytearray`。 一个有效的解决方案可以包含多达数百万个操作，因此将每个操作存储为单独的 Python 字符串会产生不必要的对象开销。 字节表示比较紧凑，可以直接写在最后。 

第一次传送后，传送门颜色会交替变化。 第一个蓝色门户是源头，而橙色是第一个目的地。 到达目的地后，橙色是当前组件中当前可用的门户。 下一个镜头创建一个蓝色目的地，然后使用橙色门户。 这种交替模式正是导致以后每次传送都需要花费一枪的原因。 

普通的运动范围是从构造中得出的。 在每个非最终组件内，路线从其入口单元到射击单元并返回，最多花费该组件中单元数量的两倍。 最终组件仅遍历一次。 进入每个传送门都会增加一次移动动作，总共最多为（2NM）。 

## 工作示例

 ### 示例 1

 游离细胞分裂成两个普通成分。 启动组件包含`(2,3)`和`(2,4)`，而退出组件包含第 4 行上的空闲单元。 

穿过第 3 列的垂直走廊在起始组件和下部组件之间包含一个玻璃单元。 它下方的实体边界墙的上方有一个自由单元，因此从一开始就向下射击可以为下部组件创建一个可用的入口。 

| 行动| 当前单元格 | 现有有用的门户| 运营| 结果 |
 | --- | --- | --- | --- | --- |
 |`OD`|`(2,3)`| 无 | 透过玻璃将橙色放在下面 | 橙色属于下位组件 |
 |`BL`|`(2,3)`| 下面橙色| 将蓝色放在左墙上 | 蓝色的是源码传送门|
 |`ML`|`(2,3)`| 蓝色左| 进入蓝色门户 | 传送到较低的组件 |
 |`ML`| 下部组件| 下面橙色| 普通搬家| 到达出口 |

 该解决方案需要两次射击，因为这是第一次传送。 重要的几何点是，玻璃单元不会阻止射击到达实体边界，并且边界之前的自由单元使生成的入口可用。 

### 示例 2

 启动和退出位于不同的普通组件中。 组件图包含一条使用一次传送的路径，因此最小射击次数为两次。 

| 相| 组件| 运营| 目的|
 | --- | --- | --- | --- |
 | 1 | 开始| 普通动作| 到达有用的拍摄位置 |
 | 2 | 开始|`OU`| 创建目的地门户|
 | 3 | 开始| 普通动作| 到达源门户 |
 | 4 | 开始|`BR`| 创建源门户|
 | 5 | 开始|`M`进入蓝色门户| 传送|
 | 6 | 退出组件 | 普通动作| 到达出口 |

 确切的普通路径可能与示例输出不同。 检查器不要求最短的移动步数，只要求最多（2NM）。 图 BFS 只与传送数量有关，传送数量决定了最小射击次数。 

该示例还演示了为什么门户更换很重要。 第一次传送后，一个传送门保留在旧组件中，另一个传送门保留在新组件中。 稍后的镜头可以用目标门户替换旧的门户，从而仅允许另一次传送以进行额外的射击。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(NM)) | 组件 BFS、四次网格扫描、组件 BFS 和路径重建每个仅处理恒定数量的网格单元或图形边缘 |
 | 空间| (O(NM)) | 组件 ID、图边、BFS 前驱和输出操作缓冲区在网格大小中都是线性的 |

 最多有 (10^6) 个单元格。 图构造仅为每个空闲单元创建恒定数量的候选边，并且所有图搜索在单元和边的数量上都是线性的。 紧凑型`array`结构使内存使用量与输入大小成正比，而不是与完整状态空间表示的更大的 Python 对象开销成正比。 

## 测试用例

 输出不是唯一的，因此比较整个输出字符串对于此问题没有有用的测试。 下面的测试而是比较强制属性：解决方案是否无法达到、最小射击次数以及移动范围。 他们还验证打印的操作数量是否与标题匹配。```python
# Save the submitted solution as solution.py.
# The helper imports its solve() function.

import io
import sys

from solution import solve

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def header(out: str):
    first = out.splitlines()[0].split()
    return tuple(map(int, first))

def check_valid_header(inp: str, out: str, expected_p: int):
    lines = out.splitlines()
    p, s = map(int, lines[0].split())

    assert p == expected_p
    assert s >= 0

    n, m = map(int, inp.splitlines()[0].split())
    assert s <= 2 * n * m
    assert len(lines) - 1 == p + s

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

assert header(run(sample1))[0] == 2, "sample 1 must use two shots"
check_valid_header(sample1, run(sample1), 2)

assert header(run(sample2))[0] == 2, "sample 2 must use two shots"
check_valid_header(sample2, run(sample2), 2)

assert header(run(sample3))[0] == 4, "sample 3 must use four shots"
check_valid_header(sample3, run(sample3), 4)

# Minimum-size grid, start equals exit.
minimum_case = """\
3 3
WWW
W.W
WWW
2 2
2 2
"""

assert run(minimum_case) == "0 0\n", "same start and exit need no actions"

# Different components with no usable portal transition.
unreachable_case = """\
5 5
WWWWW
W.GWW
WWWWW
W...W
WWWWW
2 2
4 2
"""

assert run(unreachable_case) == "-1 -1\n", "glass directly before a solid wall must not create an edge"

# Boundary-adjacent free cells, but ordinary movement is already sufficient.
boundary_case = """\
5 5
WWWWW
W...W
W.W.W
W...W
WWWWW
2 2
4 4
"""

out = run(boundary_case)
assert header(out)[0] == 0
check_valid_header(boundary_case, out, 0)

# Maximum-size all-open interior. Everything is one ordinary component.
# The minimum number of shots is zero and a shortest Manhattan path has
# 1994 movement steps.
n = 1000
m = 1000
rows = []
rows.append("W" * m)
for _ in range(n - 2):
    rows.append("W" + "." * (m - 2) + "W")
rows.append("W" * m)

maximum_case = (
    f"{n} {m}\n"
    + "\n".join(rows)
    + "\n2 2\n999 999\n"
)

out = run(maximum_case)
p, s = header(out)
assert p == 0
assert s == 1994
check_valid_header(maximum_case, out, 0)
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 | (P=2)，有效 (S\le2NM) | 首个通过玻璃的门户过渡 |
 | 样品2 | (P=2)，有效 (S\le2NM) | 围绕门户过渡的不平凡的普通运动|
 | 样品 3 | (P=4)，有效 (S\le2NM) | 多次连续一次性传送门更换|
 |`3 x 3`, 开始等于退出 |`0 0`| 最小网格和零样本情况 |
 | 隔离组件`G`前`W`|`-1 -1`| 防止将危险门户视为可用 |
 | 邻接普通迷宫| (P=0) | 边界处理和普通连接 |
 |`1000 x 1000`开放式内饰|`P=0`,`S=1994`| 最大网格大小、内存使用和线性时间行为 |

 ## 边缘情况

 对于最小网格```
3 3
WWW
W.W
WWW
2 2
2 2
```组件标签恰好创建一个包含开始和退出的自由组件。 组件 BFS 永远不需要，因为两个单元是相同的。 路径重建返回一个空路径，因此程序打印`0 0`。 

对于先玻璃后实心墙的案例```
5 5
WWWWW
W.GWW
WWWWW
W...W
WWWWW
2 2
4 2
```起始组件在上方和下方的实心墙旁边都有一个空闲单元，但都不允许访问其他组件。 在向右扫描中，第 4 列处的实心墙紧邻其前面的第 3 列处有一个玻璃单元。 目标因此被丢弃。 其他方向到达实体墙，实体墙的入口侧仍保留在起始组件中。 退出组件永远不会被组件 BFS 发现，所以答案是`-1 -1`。 

对于同一组件中有多个空闲单元的网格，例如```
5 5
WWWWW
W...W
W.W.W
W...W
WWWWW
2 2
4 4
```成分标记将所有游离细胞放入一个成分中。 由可见边界墙产生的任何图形边都是自边并且被忽略。 普通路径就足够了，所以结果是零镜头。 这可以防止图形构造将可能的门户放置与必要的门户转换混淆。 

对于被玻璃包围的组件，该组件在可见性扫描中仍可能显示为射击者，因为射击可以穿过玻璃。 但是，如果组件没有直接邻近实体壁的自由单元，`portal_cell[cid]`停留`-1`。 然后 BFS 拒绝使用该组件作为传送源。 这符合物理规则：组件可以发射，但它没有玩家可以离开的安全门户。 

对于具有（1000×1000）网格和开放内部的最大尺寸情况，整个内部是一个组件。 普通的最短路由`(2,2)`到`(999,999)`有 (997+997=1994) 步，因此程序返回零次射击和 1994 个移动步。 图形构建仍然仅扫描数百万个单元格的恒定次数，这证明了为什么线性公式符合约束条件。
