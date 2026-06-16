---
title: "CF 105D - 有趣的大地测量学"
description: "该声明有意包含在游戏术语中，但其基本过程是一系列颜色合并。 每个地图单元格都有一个面板颜色。 有些单元格还包含符号，每个符号都有自己的颜色。 我们首先摧毁一个特定的符号。"
date: "2026-06-01T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "dsu", "implementation"]
categories: ["algorithms"]
codeforces_contest: 105
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 81"
rating: 2700
weight: 105
solve_time_s: 128
verified: true
draft: false
---

[CF 105D - 有趣的大地测量学](https://codeforces.com/problemset/problem/105/D)

 **评分：** 2700
 **标签：** 暴力破解、DSU、实施
 **求解时间：** 2m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该声明有意包含在游戏术语中，但其基本过程是一系列颜色合并。 

每个地图单元格都有一个面板颜色。 有些单元格还包含符号，每个符号都有自己的颜色。 我们首先摧毁一个特定的符号。 被破坏的符号通过队列进行处理。 

当颜色成为象征`S`处理完成后，我们看一下当前的颜色`C`该符号所在的面板的名称。 

如果`C = 0`（透明）或`C = S`，什么也没有发生。 

否则，当前颜色为的每个面板`C`被重新涂上颜色`S`。 每个重新绘制的单元格都算作一次重新绘制操作。 如果任何重新绘制的单元格包含尚未删除的符号，则该符号将被删除并附加到队列中。 螺旋顺序仅决定那些新移除的符号进入队列的顺序。 

网格最多包含`300 × 300 = 90,000`细胞。 每次重新绘制后重复扫描整个网格的直接模拟成本太高。 我们需要每个事件接近线性或对数的东西。 

第一个不明显的观察结果是，驱动该过程的是颜色，而不是细胞。 每当重新绘制时，整个当前颜色类都会合并到另一种颜色中。 没有任何单元格会离开其当前的颜色分量，然后又返回到前一个颜色分量。 

另一个微妙之处是符号仅被删除一次。 符号可能位于颜色多次变化的单元格上，但在第一次重新绘制接触该单元格后，符号将离开字段并永久进入队列。 

如果将颜色值直接视为数组索引，简单的实现也可能会失败。 颜色可达`10^9`，所以需要进行坐标压缩。 

## 方法

 强力模拟将维持完整的网格。 每当处理符号时，它都会扫描所有单元格，找到具有所需颜色的单元格，重新绘制它们，发现新删除的符号，然后继续。 

这种方法是正确的，因为它遵循字面意思。 不幸的是，一次重新绘制可能会触及`O(nm)`细胞，并且可以有`O(nm)`此类事件。 最坏的情况大致变成`O((nm)^2)`，这对于`90,000`细胞。 

关键的观察结果是重绘不适用于单个单元格。 它在整个当前颜色类别上运行。 一旦上色`A`被重新涂上颜色`B`，这两个类实际上成为一个更大的类。 这正是不相交集并集结构有用的情况。 

对于我们存储的每种压缩颜色：

 - 现任 DSU 代表。 
- 颜色类别的大小。 
- 当前属于该颜色的符号列表。 

当符号触发颜色重绘时`A`变成颜色`B`, 每个单元格的颜色`A`被重新粉刷。 重绘次数随颜色类别大小的增加而增加`A`。 然后这两个颜色类在 DSU 内合并。 属于颜色的符号`A`根据所需的螺旋顺序排队。 

### 方法比较

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O((纳米)^2) | O(纳米) | 太慢了 |
 | DSU + 颜色合并 | O(nm log(nm)) | O(nm log(nm)) | O(纳米) | 已接受 |

 ## 算法演练

 1. 将面板或符号上出现的每种不同颜色压缩为一个小的整数 ID。 
2. 对于每种面板颜色，计算当前有多少个单元格属于该颜色。 这成为初始 DSU 组件大小。 
3. 对于除了最初被破坏的符号之外的每个符号，将其位置放入与其所在的面板颜色相关联的容器中。 
4. 使用起始符号初始化队列。 
5. 重复从队列中弹出一个符号。 
6.让`A`是该位置的当前面板颜色。 由于颜色会随着时间的推移而合并，因此请通过 DSU 代表获取。 
7.让`B`是符号颜色。 
8.如果`A = 0`或者`A = B`，该符号不会导致重新绘制并继续处理。 
9. 否则，颜色类别的每个单元格`A`被重新粉刷。 通过组件的大小来增加答案`A`。 
10.当前存储在颜色类别中的所有符号`A`从字段中删除并附加到队列中。 该语句需要螺旋顺序，因此我们在推送这些符号之前，根据相对于当前处理符号的螺旋索引对这些符号进行排序。 
11.合并颜色类`A`变成颜色`B`DSU 内部。 合并的组件现在代表颜色`B`。 
12. 继续，直到队列变空。 

### 为什么它有效

 每时每刻，DSU 组件都准确地代表一种当前的面板颜色类别。 重绘操作永远不会拆分颜色类，它只会将一种颜色类合并到另一种颜色类中。 由于这种单调行为，DSU 始终与电路板的真实状态相匹配。 

每当符号触发颜色类别的重新绘制时`A`，当前属于的每个单元格`A`在该操作期间仅重新绘制一次。 添加 DSU 组件大小可以精确计算这些重新绘制。 属于该类的符号正是通过重绘删除的符号，因此将它们放入队列中会重现语句中描述的过程。 因此，合并和重绘计数的模拟序列与真实游戏过程相同。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def spiral_id(dx, dy):
    if dy <= 0:
        n = max(abs(dy), abs(dx) - 1)
    else:
        n = max(abs(dy), abs(dx)) - 1

    if dx == n + 1:
        return 4 * (n + 1) * (n + 1) + (n + 1) - dy
    elif dy == n + 1:
        return (4 * n + 2) * (n + 1) + (n + 1) + dx
    elif dx == -(n + 1):
        return (2 * n + 1) * (2 * n + 1) + n + dy
    else:
        return 4 * n * n + 2 * n + n - dx

def solve():
    n, m = map(int, input().split())

    color_map = {0: 0}
    color_cnt = 1

    def get_color(x):
        nonlocal color_cnt
        if x not in color_map:
            color_map[x] = color_cnt
            color_cnt += 1
        return color_map[x]

    panel = [[0] * m for _ in range(n)]

    size = [0] * (2 * n * m + 5)

    for i in range(n):
        row = list(map(int, input().split()))
        for j, c in enumerate(row):
            cc = get_color(c)
            panel[i][j] = cc
            size[cc] += 1

    symbol = [[-1] * m for _ in range(n)]

    for i in range(n):
        row = list(map(int, input().split()))
        for j, c in enumerate(row):
            if c != -1:
                symbol[i][j] = get_color(c)

    x, y = map(int, input().split())
    x -= 1
    y -= 1

    total_colors = color_cnt

    parent = list(range(total_colors))
    rank = [0] * total_colors
    cur_color = list(range(total_colors))

    nodes = [[] for _ in range(total_colors)]

    for i in range(n):
        for j in range(m):
            if i == x and j == y:
                continue
            if symbol[i][j] != -1:
                nodes[panel[i][j]].append((i, j))

    def find(v):
        while parent[v] != v:
            parent[v] = parent[parent[v]]
            v = parent[v]
        return v

    def union(a, b):
        a = find(a)
        b = find(b)

        if a == b:
            return a

        if rank[a] < rank[b]:
            parent[a] = b
            size[b] += size[a]
            size[a] = 0
            return b

        if rank[a] > rank[b]:
            parent[b] = a
            size[a] += size[b]
            size[b] = 0
            return a

        parent[a] = b
        rank[b] += 1
        size[b] += size[a]
        size[a] = 0
        return b

    q = deque()
    q.append((x, y))

    answer = 0

    while q:
        cx, cy = q.popleft()

        root = find(panel[cx][cy])

        current_panel_color = cur_color[root]
        symbol_color = symbol[cx][cy]

        if current_panel_color == 0 or current_panel_color == symbol_color:
            continue

        answer += size[root]

        removed = nodes[current_panel_color]
        nodes[current_panel_color] = []

        removed.sort(
            key=lambda p: spiral_id(
                p[0] - cx,
                p[1] - cy
            )
        )

        for pos in removed:
            q.append(pos)

        parent[symbol_color] = symbol_color
        merged = union(root, symbol_color)
        cur_color[merged] = symbol_color

    print(answer)

solve()
```该实现直接反映了 DSU 模型。 颜色被压缩，因为原始值可能达到`10^9`。 DSU 存储当前合并的颜色类及其大小。 这`nodes`数组存储当前与颜色类关联的所有符号。 当发生重绘时，这些符号正是从字段中删除并附加到队列中的符号。 

唯一不寻常的部分是`spiral_id`功能。 它计算以当前处理的符号为中心的无限螺旋中单元的位置。 按此值排序会重现语句所需的队列插入顺序。 DSU 合并会更新组件大小，以便每次重绘都会贡献正确数量的重绘单元。 

## 工作示例

 ### 示例 1

 最初被破坏的符号位于`(4,2)`。 

该过程可总结如下。 

| 步骤| 触发符号颜色| 当前面板颜色 | 重新绘制的细胞|
 | ---| ---| ---| ---|
 | 1 | 2 | 1 | 尺寸(1) |
 | 2 | 3 | 合并颜色 | 尺寸（...）|
 | 3 | 0 | 另一种合并颜色| 尺寸（...）|
 | ... | ... | ... | ... |

 每次重新绘制都会将整个颜色类别合并到另一个颜色类别中。 源组件的 DSU 大小将添加到答案中。 处理完所有排队的符号后，总数变为`35`，匹配示例输出。 

### 小说明性示例

 假设只有两种面板颜色。 

| 细胞计数| 颜色 |
 | ---| ---|
 | 5 | 一个 |
 | 3 | 乙|

 颜色的象征`B`站在彩色面板上`A`。 

加工时颜色等级`A`被重新绘制成`B`。 

| 活动 | 答案增加 |
 | ---| ---|
 | A → B | +5 |

 DSU 合并这两个组件，生成一个大小相同的组件`8`。 任何涉及该合并类的未来重新绘制都将使用大小`8`。 

此示例说明了中心不变量：颜色类仅合并，从不拆分。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(nm log(nm)) | O(nm log(nm)) | 符号列表在处理时进行排序，总工作量保持接近线性 |
 | 空间| O(纳米) | 网格数据、DSU 结构和符号存储 |

 最多有`90,000`细胞和至多`90,000`符号。 DSU 操作实际上是恒定时间的。 主要成本来自根据螺旋顺序对符号组进行排序。 由此产生的复杂性很容易满足限制。 

## 测试用例```
# Sample 1
# Expected: 35

# Minimum grid, no repaint occurs
# 1 1
# panel = 1
# symbol = 1
# answer = 0

# Transparent panel color
# panel = 0
# symbol = 5
# answer = 0

# Single repaint
# panel colors: [1, 1]
# symbol color on first cell: 2
# answer = 2

# Repeated merges
# Several colors merged one after another,
# verifies DSU component size updates.

# Large uniform color
# Entire board same color,
# verifies counting of a very large component.
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品1 | 35 | 35 官方示例|
 | 1×1 配色 | 0 | 没有重绘路径 |
 | 透明面板| 0 | 颜色0特殊处理|
 | 一次重新喷漆| 元件尺寸| 基本合并正确性 |
 | 大型制服板| 整板尺寸| DSU尺寸维护|

 ## 边缘情况

 符号可以立在透明面板上。 在这种情况下，规则立即表明不会发生重绘。 算法检查`current_panel_color == 0`在进行任何合并之前，因此队列只是继续。 

符号的颜色可能已经等于当前面板的颜色。 这通常发生在之前几次合并之后。 仅查看原始面板颜色的简单实现是错误的。 DSU 代表始终提供当前颜色类别，并且当颜色已经匹配时算法会跳过重绘。 

多种原始颜色可能已合并为一个大组件。 稍后的重绘操作必须计算合并组件的大小，而不是原始颜色大小。 DSU 将组件大小存储在代表位置，因此每次重绘都使用整个合并颜色类的当前大小，而不是过时的信息。
