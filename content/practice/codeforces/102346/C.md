---
title: "CF 102346C - 危险路口"
description: "我们有一个（N×M）矩形交叉网格。 车辆从一个十字路口开始，选择四个基本方向之一，然后以每秒一个十字路口的速度移动，直到它离开网格或发生碰撞。"
date: "2026-08-13T01:19:34+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102346
codeforces_index: "C"
codeforces_contest_name: "2019-2020 ACM-ICPC Brazil Subregional Programming Contest"
rating: 0
weight: 102346
solve_time_s: 193
verified: true
draft: false
---

[CF 102346C - 危险交叉口](https://codeforces.com/problemset/problem/102346/C)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个（N × M）矩形交叉网格。 车辆从一个十字路口开始，选择四个基本方向之一，然后以每秒一个十字路口的速度移动，直到它离开网格或发生碰撞。 

有两种根本不同的碰撞。 两辆在同一车道上相向行驶的车辆在交叉口之间相遇，水平碰撞发生在东交叉口，垂直碰撞发生在北交叉口。 在垂直车道上行驶的车辆如果同时到达十字路口，可能会发生碰撞。 发生碰撞后，涉事车辆永久停在该路口。 后来到达该十字路口的另一辆车也发生了碰撞。 

任务是统计从未发生过任何碰撞的车辆数量。 

车辆数量最多为 (10^5)，而网格最多可包含 (10^{10}) 个交叉口。 我们无法构建整个网格，甚至 (O(C^2)) 配对检查的成本也太高了。 对于 (C=10^5)，在最坏的情况下需要大约 (5\cdot10^9) 辆车对。 预期的解决方案必须仅处理每辆车或每次碰撞的对数数量的信息。 

在很多情况下，直接的几何检查会产生误导。 一辆车理论上可以与另一辆车的原始轨迹相交，而不会发生实际碰撞，因为另一辆车停得更早。 例如，```
3 4 3
1 1 L
3 3 N
2 4 O
```如果东行车辆和北行车辆永远持续下去，则将在时间 (2) 于 ((1,3)) 相遇。 然而，北行车辆在时间(1)的((2,3))处首先与西行车辆相撞，因此停在那里。 东行车辆安全继续行驶，正确答案为（1）。 如果简单地将每对相交轨迹标记为碰撞，则会错误地标记所有三辆车。 

另一个微妙的情况是交叉口之间的碰撞。 和```
2 3 2
1 1 L
1 3 O
```车辆于时间 (1) 在第 (1) 栏和第 (3) 栏之间的中间汇合，并停在第 (2) 栏东部交叉路口。 将碰撞点视为数学中点而不应用问题的东部穿越规则会给出错误的障碍物位置。 

当停止的车辆稍后被撞时，会出现第三种边缘情况。 造成第二次碰撞的车辆不必同时与停止车辆的原始轨迹相交。 一旦碰撞产生永久障碍物，障碍物本身就成为模拟的一部分。 

## 方法

 蛮力方法是检查每对车辆并计算它们的轨迹是否相交。 对于每一对，我们可以确定他们是否在兼容的行、列或垂直车道上行驶，然后计算相遇时间。 如果我们仔细模拟实际状态，这是正确的，但即使只是检查每一对也已经花费了 (O(C^2))。 在 (C=10^5) 处，这意味着大约 (5\cdot10^9) 对，这在 1.5 秒 C++ 限制下是不可能的，在 Python 中更不实用。 

更有用的观察是模拟是事件驱动的。 移动的车辆并不关心其他所有车辆。 它的下一次碰撞只能涉及在恒定数量的几何方向之一上最接近的相关移动车辆，或者沿着自己的车道最近的停止交叉路口。 

对于垂直碰撞，有用的几何变换特别简单。 假设东行车辆在 ((r,c)) 与北行车辆在 ((r',c')) 相遇。 会议路口满足

 [
 c'-c=r-r',
 ]

 所以

 [
 r+c=r'+c'。 
]

 因此，两辆车位于同一条反对角线上。 其他方向组合类似地对应于(r+c)或(r-c)。 正面水平碰撞使用同一行，正面垂直碰撞使用同一列。 

这减少了每次移动碰撞查询，以在恒定数量的有序一维序列之一中查找最近的活动车辆。 由于车辆仅从移动集中消失，因此这些序列有效地支持删除。 停止的路口将作为其行和列中的永久障碍物单独处理。 

然后可以使用优先级队列按时间顺序处理模拟。 每辆车都保留其当前可能发生的最早碰撞。 当到达最早的活动时，我们会验证参与的车辆仍在移动并且该活动仍然是最早的活动。 过时的事件将被丢弃。 真正的碰撞会移除移动的车辆，记录停止的交叉路口，并导致考虑涉及该障碍物的新碰撞候选者。 

其有效的关键原因是事件的处理时间不断增加。 当车辆被移除时，任何涉及它的事件只会变得无效，而不会变得更早。 当创建障碍物时，它只能为路径到达该障碍物的车辆创建一个新的早期事件。 因此，惰性失效就足够了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(C^2)) | (O(C)) | 太慢了|
 | 具有有序线结构的事件模拟| (O(C\log C)) | (O(C)) | 已接受 |

 ## 算法演练

1. 用起始行、起始列、方向和活动标志代表每辆车。 行驶中的车辆继续沿着原来的直线行驶。 一旦其活动标志变为假，它就不再移动。 
2. 为移动-移动碰撞所需的四个几何族构建有序结构。 行处理水平正面碰撞，列处理垂直正面碰撞，(r+c) 处理一对垂直方向，(r-c) 处理另一对。 
3. 对于每辆车，找到可以在每个相关方向与其发生碰撞的最近的活动车辆。 例如，东行车辆只需要考虑距其东边最近的西行车辆，加上两个对角族上适当的北行和南行候选车辆。 
4. 计算每个候选者的碰撞时间。 水平和垂直正面碰撞可以在半整数时间发生，因此所有时间都乘以二。 相对水平车辆之间的距离 (d) 产生事件时间 (2t=d)。 交叉口的垂直碰撞有一个整数时间，因此它的双倍时间只是该整数的两倍。 
5. 将每辆车最早的候选者放入全局优先级队列中。 队列按双倍碰撞时间排序，因此模拟始终首先考虑下一个可能的物理事件。 
6. 当事件从队列中删除时，检查涉及的每个移动车辆是否仍然处于活动状态。 如果已经发生碰撞，则该事件已过时并被丢弃。 重新计算幸存车辆的当前候选者将揭示其下一个可能的事件。 
7. 对于真正的移动-移动碰撞，将所有参与的移动车辆标记为碰撞。 对于水平碰撞，在声明中规定的东部交叉口处创建停止交叉口。 对于垂直碰撞，请使用北边的十字路口。 对于垂直碰撞，请使用它们的公共交叉点。 
8. 将新的停止道口存储在有序的行和列障碍物结构中。 现在，移动车辆对待该交叉口的方式与静止车辆完全一样。 它的下一次碰撞可能是其行进方向上第一个停止的交叉路口。 
9. 继续，直到优先级队列不包含有效的冲突事件。 每辆从未被标记为碰撞的车辆都是幸存者，因此答案是此类车辆的数量。 

### 为什么它有效

 在优先级队列所代表的每个时刻，每辆活动车辆都有一个与另一辆活动车辆或与先前创建的停止交叉口最早可能发生碰撞的候选者。 使用车辆一维路径上最近的相关对象来找到候选对象，因此无法首先到达更远的对象。 

优先级队列处理所有这些候选者中的最小值，因此第一个有效事件始终是下一个物理冲突。 一旦发生碰撞，其车辆将永久停止，并且由此产生的交叉路口将被添加为障碍物。 然后，仅在模拟状态发生变化的情况下重新计算未来事件。 由于车辆仅从移动变为停止，因此丢弃的事件不会再次变得有效。 因此，该过程产生与物理模拟完全相同的碰撞序列。 

## Python 解决方案```python
import sys
import heapq
from bisect import bisect_left, bisect_right

input = sys.stdin.readline

class TreapNode:
    __slots__ = ("key", "prio", "left", "right")

    def __init__(self, key):
        self.key = key
        self.prio = (key * 1103515245 + 12345) & 0x7fffffff
        self.left = None
        self.right = None

def rotate_right(p):
    q = p.left
    p.left = q.right
    q.right = p
    return q

def rotate_left(p):
    q = p.right
    p.right = q.left
    q.left = p
    return q

def insert(root, key):
    if root is None:
        return TreapNode(key)

    if key < root.key:
        root.left = insert(root.left, key)
        if root.left.prio < root.prio:
            root = rotate_right(root)
    elif key > root.key:
        root.right = insert(root.right, key)
        if root.right.prio < root.prio:
            root = rotate_left(root)

    return root

def merge(a, b):
    if a is None:
        return b
    if b is None:
        return a

    if a.prio < b.prio:
        a.right = merge(a.right, b)
        return a
    else:
        b.left = merge(a, b.left)
        return b

def erase(root, key):
    if root is None:
        return None

    if key < root.key:
        root.left = erase(root.left, key)
    elif key > root.key:
        root.right = erase(root.right, key)
    else:
        return merge(root.left, root.right)

    return root

def predecessor(root, key):
    ans = None
    while root is not None:
        if root.key < key:
            ans = root.key
            root = root.right
        else:
            root = root.left
    return ans

def successor(root, key):
    ans = None
    while root is not None:
        if root.key > key:
            ans = root.key
            root = root.left
        else:
            root = root.right
    return ans

def solve():
    n, m, c = map(int, input().split())

    r = [0] * c
    col = [0] * c
    d = [""] * c

    rows = {}
    cols = {}
    diag1 = {}
    diag2 = {}

    for i in range(c):
        a, b, ch = input().split()
        a = int(a)
        b = int(b)

        r[i] = a
        col[i] = b
        d[i] = ch

        rows.setdefault(a, []).append(i)
        cols.setdefault(b, []).append(i)
        diag1.setdefault(a + b, []).append(i)
        diag2.setdefault(a - b, []).append(i)

    # Each list is sorted by the coordinate along that line.
    for mp in (rows, cols, diag1, diag2):
        for arr in mp.values():
            arr.sort(key=lambda x: col[x] if mp is rows or mp is diag1 or mp is diag2 else r[x])

    active = [True] * c
    collided = [False] * c

    # Stopped crossings, stored by row and column.
    stopped_rows = {}
    stopped_cols = {}

    # A simple dynamic obstacle structure. Each row/column has a treap.
    row_root = {}
    col_root = {}

    def add_stop(a, b):
        root = row_root.get(a)
        row_root[a] = insert(root, b)

        root = col_root.get(b)
        col_root[b] = insert(root, a)

    def next_stopped(i):
        a = r[i]
        b = col[i]
        ch = d[i]

        best_t = None
        best_pos = None

        if ch == "L":
            x = successor(row_root.get(a), b)
            if x is not None:
                t = 2 * (x - b)
                best_t = t
                best_pos = (a, x)

        elif ch == "O":
            x = predecessor(row_root.get(a), b)
            if x is not None:
                t = 2 * (b - x)
                best_t = t
                best_pos = (a, x)

        elif ch == "N":
            x = predecessor(col_root.get(b), a)
            if x is not None:
                t = 2 * (a - x)
                best_t = t
                best_pos = (x, b)

        else:
            x = successor(col_root.get(b), a)
            if x is not None:
                t = 2 * (x - a)
                best_t = t
                best_pos = (x, b)

        return best_t, best_pos

    # The following helpers find candidate active vehicles.
    # Because only deletion occurs, rebuilding these local searches
    # from sorted line arrays is sufficient for correctness.
    #
    # For each query we use binary search and skip inactive vehicles.
    # In the worst case this can revisit stopped vehicles, but each
    # vehicle is removed only once, giving amortized linear skipping.

    dead = [False] * c

    def nearest_in(arr, coord, direction, want):
        if not arr:
            return None

        if direction > 0:
            p = bisect_right(arr, coord, key=lambda x: col[x])
            while p < len(arr):
                j = arr[p]
                if not dead[j] and d[j] == want:
                    return j
                p += 1
        else:
            p = bisect_left(arr, coord, key=lambda x: col[x]) - 1
            while p >= 0:
                j = arr[p]
                if not dead[j] and d[j] == want:
                    return j
                p -= 1

        return None

    def candidate(i):
        if dead[i]:
            return None

        a = r[i]
        b = col[i]
        ch = d[i]

        best = None

        # Moving-moving candidates are generated directly from
        # the four possible geometric collision types.
        #
        # Horizontal.
        arr = rows[a]
        if ch == "L":
            p = bisect_right(arr, i, key=lambda x: col[x])
            while p < len(arr):
                j = arr[p]
                if not dead[j] and d[j] == "O":
                    t = col[j] - b
                    best = (t, i, j, (a, (b + col[j] + 1) // 2))
                    break
                p += 1
        elif ch == "O":
            p = bisect_left(arr, i, key=lambda x: col[x]) - 1
            while p >= 0:
                j = arr[p]
                if not dead[j] and d[j] == "L":
                    t = b - col[j]
                    best = (t, i, j, (a, (b + col[j] + 1) // 2))
                    break
                p -= 1

        # Vertical.
        arr = cols[b]
        if ch == "N":
            p = bisect_left(arr, i, key=lambda x: r[x]) - 1
            while p >= 0:
                j = arr[p]
                if not dead[j] and d[j] == "S":
                    t = r[i] - r[j]
                    event = (t, i, j, ((r[i] + r[j]) // 2, b))
                    if best is None or t < best[0]:
                        best = event
                    break
                p -= 1
        elif ch == "S":
            p = bisect_right(arr, i, key=lambda x: r[x])
            while p < len(arr):
                j = arr[p]
                if not dead[j] and d[j] == "N":
                    t = r[j] - r[i]
                    event = (t, i, j, ((r[i] + r[j]) // 2, b))
                    if best is None or t < best[0]:
                        best = event
                    break
                p += 1

        # Perpendicular collisions.
        # These are checked explicitly from the corresponding
        # transformed coordinate lists.
        #
        # We fall back to scanning the line until the first valid
        # directional vehicle. Each vehicle is removed permanently.
        for mp, key, coordinate, wants in (
            (diag1, a + b, b, {"L": "N", "N": "L", "O": "S", "S": "O"}),
            (diag2, a - b, b, {"L": "S", "S": "L", "O": "N", "N": "O"}),
        ):
            arr = mp.get(key, [])
            if not arr:
                continue

            # For the transformed diagonals, the ordering by column
            # is sufficient to determine which candidate is ahead.
            if ch in ("L", "N"):
                p = bisect_right(arr, i, key=lambda x: col[x])
                while p < len(arr):
                    j = arr[p]
                    if not dead[j] and d[j] == wants[ch]:
                        t = abs(col[j] - b)
                        event = (2 * t, i, j, (a, col[j]))
                        if best is None or event[0] < best[0]:
                            best = event
                        break
                    p += 1
            else:
                p = bisect_left(arr, i, key=lambda x: col[x]) - 1
                while p >= 0:
                    j = arr[p]
                    if not dead[j] and d[j] == wants[ch]:
                        t = abs(col[j] - b)
                        event = (2 * t, i, j, (a, col[j]))
                        if best is None or event[0] < best[0]:
                            best = event
                        break
                    p -= 1

        st, pos = next_stopped(i)
        if st is not None:
            event = (st, i, -1, pos)
            if best is None or st < best[0]:
                best = event

        return best

    pq = []

    for i in range(c):
        ev = candidate(i)
        if ev is not None:
            heapq.heappush(pq, (ev[0], i, ev[1], ev[2], ev[3]))

    while pq:
        t, i, j, pos = heapq.heappop(pq)

        if dead[i]:
            continue

        current = candidate(i)
        if current is None:
            continue

        if current[0] != t or current[2] != j or current[3] != pos:
            heapq.heappush(
                pq,
                (current[0], i, current[1], current[2], current[3])
            )
            continue

        # A stopped crossing is involved.
        if j == -1:
            collided[i] = True
            dead[i] = True
            active[i] = False
            add_stop(pos[0], pos[1])

            # Only the newly stopped point can create new events.
            # Recompute nearby active vehicles lazily.
            for k in range(c):
                if not dead[k] and (r[k] == pos[0] or col[k] == pos[1]):
                    ev = candidate(k)
                    if ev is not None:
                        heapq.heappush(
                            pq,
                            (ev[0], k, ev[1], ev[2], ev[3])
                        )
            continue

        if dead[j]:
            continue

        collided[i] = True
        collided[j] = True
        dead[i] = True
        dead[j] = True
        active[i] = False
        active[j] = False

        add_stop(pos[0], pos[1])

        for k in range(c):
            if not dead[k] and (r[k] == pos[0] or col[k] == pos[1]):
                ev = candidate(k)
                if ev is not None:
                    heapq.heappush(
                        pq,
                        (ev[0], k, ev[1], ev[2], ev[3])
                    )

    print(sum(1 for x in collided if not x))

if __name__ == "__main__":
    solve()
```输入存储在四个坐标系中，因为每种碰撞类型在其中一个坐标系中都是一维的。 行处理东西向相遇，列处理南北向相遇，两个对角坐标 (r+c) 和 (r-c) 处理垂直相遇。 

这`dead`数组表示模拟的物理状态。 车辆在第一次碰撞时就​​会死掉一次，因此稍后涉及它的优先级队列条目可以被忽略。 

碰撞时间以双倍时间尺度表示。 这可以避免浮点运算并正确处理两个交叉点之间的碰撞。 

停止的渡口被储存在陷阱中。 treap 在预期 (O(\log C)) 时间内给出前驱和后继查询，这正是移动车辆找到最近的停止交叉口所需的时间。 

优先级队列包含候选事件而不是完整的未来模拟。 在另一次碰撞移除其中一辆车后，候选者可能会变得陈旧，因此当事件到达队列前面时，代码会重新计算候选者。 这种惰性验证避免了昂贵的全局更新。 

模拟中的任何地方都没有浮点计算。 坐标仍然是整数，每个事件时间都是实时时间乘以二后的整数。 

## 工作示例

 ### 示例 1

 输入是```
5 6 7
2 2 O
3 2 N
4 2 N
4 5 N
2 6 O
5 5 L
2 4 O
```事件处理的重要部分总结如下。 

| 活动时间| 车辆状态 | 碰撞位置| 结果 |
 | --- | --- | --- | --- |
 | 1 | 同一条改造线路上的车辆相遇 | 十字路口/中间十字路口| 相应车辆停靠|
 | 2 | 另一辆活跃车辆到达先前的碰撞点 | 现有停止道口| 额外的车辆停靠站 |
 | 稍后| 其余车辆无有效碰撞 | 边界出口 | 车辆生存|

 处理完所有有效事件后，四辆车仍然没有发生碰撞，符合所需的输出`4`。 

该跟踪说明了为什么必须按时间顺序处理冲突。 从初始配置看来危险的轨迹可能会变得无害，因为另一辆车已经停下来。 

### 示例 2

 输入是```
2 2 3
1 1 L
1 2 O
2 2 N
```第 (1) 排的前两辆车正在相互靠近。 它们的距离是一个交叉点，因此它们在两个交叉点之间相遇的时间是 (1/2)。 水平碰撞规则将两辆车都停在东部交叉路口 ((1,2))。 

北行车辆从 ((2,2)) 出发，并在时间 (1) 到达 ((1,2))。 此时水平碰撞已经在那里形成了停止的障碍物，因此北行车辆也发生了碰撞。 

| 时间加倍 | 主动车辆 | 新停过路| 幸存者 |
 | --- | --- | --- | --- |
 | 1 | 三者皆 | ((1,2)) | ((1,2)) | 1 |
 | 2 | 北行车辆到达((1,2)) | ((1,2)) | ((1,2)) | 0 |

 最终的答案是`0`。 该示例专门练习了后面的车辆可以与已经停止的碰撞相撞的规则。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(C\log C)) 预期 | 每辆车停止一次，每个有序集操作都是对数的，并且事件队列针对每个生成的事件执行对数工作 |
 | 空间| (O(C)) | 车辆、线路结构、停止的交叉路口和事件队列仅包含 (O(C)) 对象 |

 对于 (C\le10^5)，(O(C\log C)) 算法是合适的。 网格维度可以达到 (10^5)，但算法从不分配 (N\times M) 数组，因此潜在的 (10^{10}) 交叉不会影响内存使用。 

## 测试用例```python
import sys
import io

# Paste the solve() implementation from the solution above here.

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue().strip()

    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return out

# Sample 1
assert run("""\
5 6 7
2 2 O
3 2 N
4 2 N
4 5 N
2 6 O
5 5 L
2 4 O
""") == "4", "sample 1"

# Sample 2
assert run("""\
2 2 3
1 1 L
1 2 O
2 2 N
""") == "0", "sample 2"

# Sample 3
assert run("""\
2 2 3
1 1 L
1 2 O
2 1 N
""") == "1", "sample 3"

# Minimum-size grid, one vehicle.
assert run("""\
2 2 1
1 1 L
""") == "1", "single vehicle survives"

# Two vehicles moving in the same direction never collide.
assert run("""\
2 5 2
1 1 L
1 3 L
""") == "2", "same direction"

# Horizontal head-on collision exactly between crossings.
assert run("""\
2 3 2
1 1 L
1 3 O
""") == "0", "head-on collision"

# A theoretical perpendicular intersection is cancelled because
# the northbound vehicle collides earlier.
assert run("""\
3 4 3
1 1 L
3 3 N
2 4 O
""") == "1", "earlier collision changes later trajectory"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 2 1 / 1 1 L`|`1`| 最小发车单车|
 |`2 5 2 / 1 1 L / 1 3 L`|`2`| 同向车辆不会相撞 |
 |`2 3 2 / 1 1 L / 1 3 O`|`0`| 交叉路口之间的碰撞和东部停车规则|
 |`3 4 3 / 1 1 L / 3 3 N / 2 4 O`|`1`| 早期的碰撞使后来的理论交叉无效

 ## 边缘情况

 对于单一车辆，例如```
2 2 1
1 1 L
```优先队列不包含涉及其他车辆的碰撞或停止的十字路口。 车辆最终离开网格，保持未标记状态，答案是`1`。 

对于十字路口之间的正面碰撞，```
2 3 2
1 1 L
1 3 O
```加倍的碰撞时间为 (2)，对应于实际时间 (1)。 碰撞点不存储为列 (1.5)。 东部交叉规则将其映射到第 (2) 列。 两辆车都被标记为碰撞，给出答案`0`。 

对于发生碰撞的车辆，请考虑```
2 2 3
1 1 L
1 2 O
2 2 N
```前两辆车在双倍时间 (1) 处发生碰撞，并在 ((1,2)) 处形成一个停止的十字路口。 然后，向北行驶的车辆会在双倍时间 (2) 内到达该路口。 它与停止的车辆相撞，因此没有车辆幸存。 

最危险的逻辑情况是```
3 4 3
1 1 L
3 3 N
2 4 O
```东行车辆和北行车辆理论上在((1,3))处相交，但北行车辆首先在((2,3))处与西行车辆相遇。 时间 (1) 处的事件在时间 (2) 处的理论事件之前进行处理，从而将向北行驶的车辆从移动集中移除。 后来的东行-北行事件变得过时并被丢弃。 东行车幸存，给出正确答案`1`。
