---
title: "CF 102277G - 世界杯狂热"
description: "该问题将两支足球队置于笛卡尔平面上。 每队有 (n) 名球员，因此总共有 (2n) 个不同的分数。 球员的位置永远不会改变。"
date: "2026-08-16T19:37:09+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102277
codeforces_index: "G"
codeforces_contest_name: "UCF Locals 2018"
rating: 0
weight: 102277
solve_time_s: 98
verified: true
draft: false
---

[CF 102277G - 世界杯狂热](https://codeforces.com/problemset/problem/102277/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 38s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题将两支足球队置于笛卡尔平面上。 每队有 (n) 名球员，因此总共有 (2n) 个不同的分数。 球员的位置永远不会改变。 

只有当两个球员都属于同一支球队并且没有来自任何一支球队的其他球员严格位于连接两名球员的直线段上的情况下，一名球员才可以将球直接传给另一名球员。 通过距离并不重要。 

球从第 1 队的球员 1 开始，目标是使用尽可能少的传球到达第 1 队的球员 (n)。 如果没有到达目标的合法传球序列，则答案为（-1）。 

原始竞赛声明给出 (2 \le n \le 11)，而每个坐标都是从 1 到 999 的整数，并且所有 (2n) 个玩家位置都是不同的。 时间限制为 1 秒，内存限制为 256 MB。 由于最多有 22 个顶点，因此即使 (O(n^3)) 算法也只执行几千次几何检查。 真正的问题不是图的大小，而是认识到传递规则形成最短路径问题而不是需要几何搜索。 

在一些边缘情况下，粗心的实施可能会失败。 首先，恰好位于两名队友之间的对手阻挡传球。 例如，```
2
1 1 3 1
2 1 2 2
```第 1 队位于 ((1,1)) 和 ((3,1))，对手位于 ((2,1))。 正确的输出是```
-1
```因为第一队唯一可能的传球被阻挡了。 仅检查三个点是否共线而不检查第三个点是否位于端点之间的测试可能会错误地拒绝或接受错误的线段，具体取决于其实现。 

其次，两名球员之间的队友也会阻挡直接传球，但该队友可以成为中间顶点。 例如，```
3
1 1 3 1 5 1
1 3 3 3 5 3
```第 1 队的队员位于 ((1,1),(3,1),(5,1))。 玩家 1 不能直接传给玩家 3，因为玩家 2 位于他们之间，但是玩家 1 可以传给玩家 2，然后玩家 2 可以传给玩家 3。正确的输出是```
2
```一个粗心的解决方案将“他们之间有一个队友”视为目标无法到达，将会错过这条路径。 

第三，仅有共线性是不够的。 位于同一条无限线上但在该段之外的球员不会阻挡传球。 例如，```
2
1 1 3 1
5 1 5 2
```((1,1)) 和 ((3,1)) 之间没有玩家，所以正确的输出是```
1
```仅检查叉积并忘记“之间”条件的解决方案将错误地声明此传递被阻止。 

## 方法

 最直接的暴力想法是枚举从玩家 1 到到达玩家 (n) 的所有可能的传球序列。 这是正确的，因为每个合法的解决方案都是这样的图边序列。 由于重复顶点永远无法改进最短路径，因此我们可以将注意力限制在简单路径上。 最多 22 名玩家，最多可以有 22 名玩家

 [
 \sum_{k=0}^{20} P(20,k)
 ]

 从起点到目标的不同简单路径，其中 (P(20,k)=20!/(20-k)!)。 这个数量约为 (20!)，大约为 (6.6\cdot10^{18})，因此枚举路径是完全不切实际的。 

暴力破解之所以有效，是因为它精确地探索了可能的传递序列，但由于序列的数量呈阶乘增长，所以会失败。 关键的观察是，只需要问题的几何部分来确定是否存在直接通过。 一旦知道了这些合法通行证，问题就变成了普通的未加权最短路径问题。 

我们可以为每个玩家创建一个图顶点。 当对应的玩家是队友并且没有玩家严格位于它们之间时，连接两个顶点。 每一次合法传球的成本恰好为 1，因此最小传球次数恰好是第 1 队球员 1 和第 1 队球员 (n) 之间的最短路径距离。 

因为最多有 22 个顶点，所以我们可以简单地测试每对玩家并扫描每三个玩家来确定这对玩家是否连接。 这需要 (O(n^3)) 时间。 图建好后，BFS 在 (O(n^2)) 中找到最短路径，这与几何预处理相比可以忽略不计。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 最坏情况下的 (O(20!)) 路径探索 | (O(n)) 递归深度 | 太慢了 |
 | 最佳 | (O(n^3)) | (O(n^2)) | 已接受 |

 ## 算法演练

 1. 将所有 (2n) 个玩家存储在一个数组中。 前 (n) 名玩家属于团队 1，其余 (n) 名玩家属于团队 2。这使得每个几何检查都可以使用一个通用索引方案。 
2. 对于每对不同的球员（u，v），首先检查他们是否属于同一队。 如果他们在不同的球队，他们之间永远不会有优势，因为传球只允许在队友之间进行。 
3. 对于同一队的球员，检查所有其他球员 (w)。 计算叉积

 [
 (v-u)\次(w-u)。 
]

 如果它非零，则 (w) 不在通过 (u) 和 (v) 的直线上，因此它不能阻止通过。 

1. 当叉积为零时，检查(w)是否位于(u)到(v)的线段内。 对于不同的点，在建立共线性后，检查其坐标是否位于端点的坐标范围内就足够了。 如果存在这样的球员，直接传球就会被阻挡。 
2. 如果没有玩家阻挡该线段，则在 (u) 和 (v) 之间添加一条无向图边。 传递可以在任一方向进行，因此该图是无向的。 
3. 从顶点 0 运行 BFS，代表第 1 队的玩家 1。将其距离初始化为零，将每隔一个距离初始化为 (-1)。 当 BFS 第一次到达某个顶点时，它的距离是到达该顶点所需的最小遍历次数，因为每个图边都有相同的成本。 
4. 返回顶点 (n-1) 的距离，代表第 1 队队员 (n)。 如果 BFS 从未达到它，则存储的值将保持 (-1)，这正是所需的结果。 

为什么它有效：当相应的通道合法时，图形恰好包含一条边。 因此，每个合法通道序列对应于一个图路径，并且每个图路径对应于一个有效通道序列。 由于每次传递的成本为 1，因此最小化传递次数与查找最短的未加权图路径相同。 BFS 返回最短距离，因此该算法无法产生更小或更大的有效答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(n, team1, team2):
    points = team1 + team2
    total = 2 * n

    graph = [[] for _ in range(total)]

    def blocked(a, b):
        ax, ay = points[a]
        bx, by = points[b]

        dx = bx - ax
        dy = by - ay

        for c in range(total):
            if c == a or c == b:
                continue

            cx, cy = points[c]

            cross = dx * (cy - ay) - dy * (cx - ax)
            if cross != 0:
                continue

            if min(ax, bx) <= cx <= max(ax, bx) and \
               min(ay, by) <= cy <= max(ay, by):
                return True

        return False

    for i in range(total):
        for j in range(i + 1, total):
            same_team = (i < n) == (j < n)
            if not same_team:
                continue

            if not blocked(i, j):
                graph[i].append(j)
                graph[j].append(i)

    dist = [-1] * total
    dist[0] = 0
    queue = [0]
    head = 0

    while head < len(queue):
        u = queue[head]
        head += 1

        if u == n - 1:
            return dist[u]

        for v in graph[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                queue.append(v)

    return -1

def solve():
    data = list(map(int, sys.stdin.buffer.read().split()))
    pos = 0

    n = data[pos]
    pos += 1

    team1 = []
    for _ in range(n):
        x = data[pos]
        y = data[pos + 1]
        pos += 2
        team1.append((x, y))

    team2 = []
    for _ in range(n):
        x = data[pos]
        y = data[pos + 1]
        pos += 2
        team2.append((x, y))

    print(solve_case(n, team1, team2))

if __name__ == "__main__":
    solve()
```实施首先将两个团队合并为`points`。 索引`0`通过`n - 1`是团队 1，而索引`n`通过`2 * n - 1`是 Team 2。这使得玩家所在球队的身份可以与`n`。 

这`blocked`函数执行算法的几何部分。 叉积仅使用整数运算，因此不存在浮点精度问题。 由于坐标以 999 为界，Python 中的中间值很小，并且也适合标准 64 位整数。 

范围检查仅在之后进行`cross == 0`。 这种顺序很重要，因为坐标范围测试本身并不能确定该点位于线段上。 共线性加上在两个坐标范围内正好给出了所需的“严格介于”条件，因为端点本身被显式跳过。 

图构造通过使用检查每个无序对一次`j`从`i + 1`向前。 只要传球合法，就会插入两个方向，因为两个队友之间的传球是可逆的。 

BFS 使用列表加整数`head`而不是重复删除第一个元素。 从 Python 列表的前面删除需要花费 (O(n))，同时前进`head`保持每个队列操作恒定的时间。 目标出队时的提前返回是有效的，因为 BFS 按非递减距离顺序处理顶点。 

输入语句包含一个测试用例而不是测试用例计数，因此解决方案准确读取 (n) 的一个值和两个坐标列表。 使用`sys.stdin.buffer.read()`这里很安全并且解析速度很快。 

## 工作示例

 2018 年的原始竞赛声明未提供示例输入/输出对，因此以下跟踪使用构建的示例来练习图构造和 BFS。 

### 示例 1```
3
1 1 3 1 5 1
1 3 3 3 5 3
```第 1 队由水平线上的三名队员组成 (y=1)。 中间的球员阻挡从球员 1 到球员 3 的直接传球。 

| 播放器已处理 | 法律新刃| 距离 |
 | ---| ---| ---|
 | 1 | 1 -> 2 | 1 -> 2 0 |
 | 2 | 2 -> 3 | 2 -> 3 | 1 |
 | 3 | 目标达成 | 2 |

 从玩家 1 到玩家 3 的直接边缘不存在，因为玩家 2 严格位于他们之间。 BFS 改为遵循`1 -> 2 -> 3`，产生最少两次通过。 第二队的球员位于一条平行线上，因此他们不会阻挡第一队的任何水平线段。 

### 示例 2```
2
1 1 3 1
2 1 2 2
```第 1 队仅有的两名球员是 ((1,1)) 和 ((3,1))。 ((2,1)) 处的 Team 2 玩家直接位于他们之间。 

| 玩家对 | 同一个团队| 已屏蔽 | 边缘|
 | ---| ---| ---| ---|
 | 1, 2 | 是的 | 是的，对手在 (2,1) | 没有 |

 BFS 从玩家 1 开始，找不到传出边缘，并且目标保持在距离 (-1) 处。 这表明对方球队的球员与队友一样有效地阻挡传球。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n^3)) | 有 (O(n^2)) 个玩家对，每对最多检查 (2n) 个可能的阻挡者。 |
 | 空间| (O(n^2)) | 传递图最多包含 (O(n^2)) 条边，并且 BFS 数组是线性的。 |

 对于 (n \le 11)，最多有 22 个玩家，因此几何构造最多执行几千次阻止检查。 (O(n^3)) 界限很容易在 1 秒的时间限制内，并且 (O(n^2)) 图仅使用 256 MB 内存限制的一小部分。 

## 测试用例```python
# helper: run the solution logic on an input string
import sys
import io

def solve_case(n, team1, team2):
    points = team1 + team2
    total = 2 * n

    graph = [[] for _ in range(total)]

    def blocked(a, b):
        ax, ay = points[a]
        bx, by = points[b]

        dx = bx - ax
        dy = by - ay

        for c in range(total):
            if c == a or c == b:
                continue

            cx, cy = points[c]
            cross = dx * (cy - ay) - dy * (cx - ax)

            if cross == 0 and \
               min(ax, bx) <= cx <= max(ax, bx) and \
               min(ay, by) <= cy <= max(ay, by):
                return True

        return False

    for i in range(total):
        for j in range(i + 1, total):
            if (i < n) != (j < n):
                continue

            if not blocked(i, j):
                graph[i].append(j)
                graph[j].append(i)

    dist = [-1] * total
    dist[0] = 0
    queue = [0]
    head = 0

    while head < len(queue):
        u = queue[head]
        head += 1

        if u == n - 1:
            return dist[u]

        for v in graph[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                queue.append(v)

    return -1

def run(inp: str) -> str:
    data = list(map(int, inp.split()))
    pos = 0

    n = data[pos]
    pos += 1

    team1 = []
    for _ in range(n):
        team1.append((data[pos], data[pos + 1]))
        pos += 2

    team2 = []
    for _ in range(n):
        team2.append((data[pos], data[pos + 1]))
        pos += 2

    return str(solve_case(n, team1, team2))

# The original 2018 statement has no sample input/output pairs.

# Minimum-size input, direct pass.
assert run(
    """2
1 1 3 1
1 3 3 3
"""
) == "1", "minimum-size direct pass"

# Blocked direct pass, and no alternate teammate exists.
assert run(
    """2
1 1 3 1
2 1 2 2
"""
) == "-1", "opponent blocks the only pass"

# Teammate blocks the direct pass but provides an intermediate route.
assert run(
    """3
1 1 3 1 5 1
1 3 3 3 5 3
"""
) == "2", "intermediate teammate"

# Player on the same infinite line but outside the segment does not block.
assert run(
    """2
1 1 3 1
5 1 5 2
"""
) == "1", "collinear point outside segment"

# Maximum-size case: 22 players, Team 1 lies on y=1 and Team 2 on y=2.
# Adjacent Team 1 players can pass, so reaching Player 11 needs 10 passes.
team1 = " ".join(f"{x} 1" for x in range(1, 12))
team2 = " ".join(f"{x} 2" for x in range(1, 12))
assert run(f"11\n{team1}\n{team2}\n") == "10", "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`n=2`，四名不同的球员，没有阻挡者|`1`| 最小尺寸图和直接边 |
 |`n=2`，对手正好介于两个队友之间|`-1`| 被对方队伍阻挡 |
 |`n=3`，源和目标之间的队友|`2`| 中间顶点和最短路径 |
 |`n=2`，线段外共线玩家|`1`| 正确的段边界处理 |
 |`n=11`, 22 名玩家在两条平行线上 |`10`| 最大玩家数量和重复 BFS 转换 |

 ## 边缘情况

 对于最小尺寸的情况```
2
1 1 3 1
1 3 3 3
```只有四个顶点。 第 1 队的两名球员之间没有球员，因此该图包含从顶点 0 到顶点 1 的边。BFS 在距离 0 处初始化源，在距离 1 处发现目标，然后返回`1`。 在实现中并不假设必须存在中间队友。 

对于阻塞段的情况```
2
1 1 3 1
2 1 2 2
```Team 1 的一对玩家具有方向向量 ((2,0))。 ((2,1)) 处的对手给出的叉积为零并且位于两个端点坐标范围内，因此`blocked`返回真。 不添加图形边。 因此，BFS 将目标保留在`-1`，给出正确答案。 

对于中级玩家的情况```
3
1 1 3 1 5 1
1 3 3 3 5 3
```((1,1),(5,1)) 对 ((1,1),(5,1)) 被 ((3,1)) 阻挡，因此玩家 1 和 3 之间不存在直接边。相邻对 ((1,1),(3,1)) 和 ((3,1),(5,1)) 的端点之间严格没有玩家，因此两条边都存在。 BFS 在距离一处到达玩家 2，在距离二处到达玩家 3。 

对于线段外共线的情况```
2
1 1 3 1
5 1 5 2
```点 ((5,1)) 与 Team 1 对共线，但位于从 ((1,1)) 到 ((3,1)) 的线段之外。 范围检查将其作为阻止程序拒绝。 Team 1 边缘保留在图中，并且 BFS 返回`1`。 

对于最大尺寸的情况，有 22 个玩家，这是该语句允许的最大图：```
11
1 1 2 1 3 1 4 1 5 1 6 1 7 1 8 1 9 1 10 1 11 1
1 2 2 2 3 2 4 2 5 2 6 2 7 2 8 2 9 2 10 2 11 2
```每个相邻的 Team 1 对都有一个清晰的线段，而不相邻的对则被 Team 1 玩家之一在其端点之间阻挡。 因此，BFS 按顺序遍历所有 11 名第 1 队球员，经过 10 次传球后到达第 11 名球员。 测试还证实，在最大可能的输入大小下，实现仍然简单。
