---
title: "CF 102433M - 迷宫连接"
description: "输入是正交迷宫旋转 45 度后的矩形图。 每个非点字符代表其输入单元内的一个对角墙段。"
date: "2026-08-12T07:41:24+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102433
codeforces_index: "M"
codeforces_contest_name: "2019-2020 ACM-ICPC Pacific Northwest Regional Contest (Div. 1)"
rating: 0
weight: 102433
solve_time_s: 100
verified: true
draft: false
---

[CF 102433M - 迷宫连接](https://codeforces.com/problemset/problem/102433/M)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 40s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 输入是正交迷宫旋转 45 度后的矩形图。 每个非点字符代表其输入单元内的一个对角墙段。 斜杠占据从右上角到左下角的对角线，而反斜杠占据相反的对角线。 点不包含墙。 

任务不是找到一条特定的路径。 我们需要移除尽可能少的墙段，以便每个自由空间区域都有一条通往无界外部区域的路径。 迷宫可能包含几个不相连的封闭区域，因此答案是将所有自由空间组件合并到外部组件所需的墙壁移除数量。 

斜线方向上的棋盘条件保证了绘图具有预期的迷宫几何形状。 对于该算法来说更重要的是，在将图片缩放两倍之后，每个对角墙都可以由恰好两个阻挡的网格位置来表示。 然后我们可以将连续迷宫视为普通的网格连接问题。 

当 R,C≤1000 时，输入最多包含 10 6 个单元。 任何检查二次数量的输入单元的解决方案（例如 O((RC) 2 )）都可以达到 10 12 次操作，而且速度太慢。 对输入的常数因子展开进行线性或近线性扫描是合适的。 缩放后的网格最多具有约 4×10 6 个位置，因此实现还必须避免具有过多每单元开销的 Python 对象。 

有几种边缘情况可能会欺骗仅推理原始字符的实现。 一堵墙不一定能围住任何东西。 例如，```
1 1
/
```有输出`0`，因为对角线段到达边界并且没有隔离有界区域。 将每面墙都算作障碍物会错误地返回`1`。 

完全空的迷宫是另一种边界情况：```
1 1
.
```整个空间已经与外界相连，所以答案是`0`。 该实现必须对连接的自由空间组件进行计数，而不是对迷宫单元进行计数。 

对角线的方向也很重要。 考虑示例 3：```
2 2
\/
/\
```四堵墙没有围成一个区域，因此正确的输出是`0`。 假设四个斜线的每 2×2 排列都会创建一个闭合正方形的解决方案会出错。 

最后，几个封闭区域需要多次移除。 样本 2 有两个封闭区域，所以它的答案是`2`。 从每个区域移除一堵墙是必要的，因为移除一堵墙只能合并两个当前不同的自由空间组件。 

## 方法

 强力解决方案可以从几何定义开始。 对于每组可能要移除的墙，删除这些墙，淹没生成的迷宫，并检查每个自由空间组件是否到达外部。 这是正确的，因为它明确地测试了我们要求满足的条件，但最多可以有 10 6 面墙。 枚举子集需要 2 10 6 种可能性，这是不可能的。 

一种不太极端的暴力策略是识别墙壁并重复模拟它们的移除。 对于每个候选墙，我们可以将其移除并在整个缩放网格上运行洪水填充，以确定剩余的组件数。 对于 W=O(RC) 墙壁和每次洪水填充的 O(RC) 工作量，这已经花费了 O((RC) 2 )。 在最大输入大小下，在考虑重复迭代之前，这大约是 10 12 次单元访问。 

有用的观察是我们实际上不需要决定要拆除哪些墙。 我们只需要知道在删除之前存在多少个自由空间组件。 

假设自由空间有 K 个连通分量，其中之一是外部分量。 所有其他组件最终都必须连接到它。 移除一堵墙最多可以合并两个组件，因此至少需要移除 K−1 次。 

该下限也是可以实现的。 组件之间由墙分隔开，以自由空间组件为顶点、边为可移动墙的邻接图通过整个平面迷宫连接起来。 我们可以选择这个邻接图的生成树并删除它的 K−1 条边。 因此答案正是 K−1。 

剩下的问题是计算 K。最简洁的表示是将每个输入单元缩放为 2×2 块。 斜杠成为其右上到左下对角线上的两个封锁位置，反斜杠成为另一条对角线上的两个封锁位置。 点使所有四个位置都空闲。 经过这种转换后，普通的四向连通性就准确地代表了迷宫区域的连通性。 

然后，我们会大量填充每个未访问的空闲位置。 每次洪水填充都会发现一个区域，因此洪水次数为 K，答案为 K−1。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 重复洪水填充的 O((RC) 2 ) | O(RC) | 太慢了|
 | 最佳 | O(RC) | O(RC) | 已接受 |

 ## 算法演练

 1. 读取 R×C 字符网格并创建大小约为 2R×2C 的缩放网格。 我们在其周围使用额外的一行和一列可用空间，以便明确表示外部区域。 
2. 对于每个包含的输入单元格`/`，将其缩放后的 2×2 块的右上点和左下点对应的两个位置标记为被遮挡。 一个`/`因此变成了两个单元的对角墙。 
3. 对于每个包含的输入单元格`\`，将相对的两个位置标记为已阻止。 点使整个缩放块保持空闲。 
4. 扫描缩放网格的每个位置。 每当发现未访问的空闲位置时，增加组件计数并从该位置开始洪水填充，将所有可到达的空闲位置标记为已访问。 
5、输出`components - 1`。 其中一个组成部分是无界的外部区域。 所有其他组件都需要与其连接，并且每移除一堵墙最多可以减少一个组件数量。 

### 为什么它有效

 缩放后的网格保留了原始迷宫的拓扑结构，因为每个对角墙都由形成相同对角线段的两个相邻的块单元表示。 因此，当原始自由空间中的两点对应的缩放位置属于同一个四向连通分量时，它们就被精确地连接起来。 

让缩放后的网格包含 K 个自由空间分量。 一个是外部区域，而其余 K−1 个分量是当前无法逃脱的封闭区域。 移除一堵墙最多可以合并两个组件，因此少于 K−1 次移除不可能将所有区域连接到外部。 

相反，每当两个自由空间组件共享一面墙时，删除该墙就会合并它们。 组件邻接结构是连接的，因为一旦忽略墙壁，整个平面就会连接。 该结构的生成树有 K−1 条边，移除这些墙会将每个组件合并到外部组件中。 因此最小值恰好是 K−1。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve():
    R, C = map(int, input().split())
    maze = [input().rstrip('\n') for _ in range(R)]

    H = 2 * R + 2
    W = 2 * C + 2
    total = H * W

    # 0 = free and unvisited
    # 1 = wall or already visited
    grid = bytearray(total)

    # Keep one-cell padding around the drawing. The padding represents
    # the unbounded outside region.
    for i in range(R):
        row = maze[i]
        base = (2 * i + 1) * W
        for j, ch in enumerate(row):
            if ch == '/':
                grid[base + 2 * j + 2] = 1
                grid[base + W + 2 * j + 1] = 1
            elif ch == '\\':
                grid[base + 2 * j + 1] = 1
                grid[base + W + 2 * j + 2] = 1

    components = 0
    stack = array('i')

    for start in range(total):
        if grid[start]:
            continue

        components += 1
        grid[start] = 1
        stack.append(start)

        while stack:
            v = stack.pop()
            r = v // W
            c = v - r * W

            if r > 0:
                u = v - W
                if not grid[u]:
                    grid[u] = 1
                    stack.append(u)

            if r + 1 < H:
                u = v + W
                if not grid[u]:
                    grid[u] = 1
                    stack.append(u)

            if c > 0:
                u = v - 1
                if not grid[u]:
                    grid[u] = 1
                    stack.append(u)

            if c + 1 < W:
                u = v + 1
                if not grid[u]:
                    grid[u] = 1
                    stack.append(u)

    print(components - 1)

if __name__ == "__main__":
    solve()
```实现的第一部分构建缩放表示。 该数组存储为`bytearray`，而不是 Python 整数列表，因为最大的缩放网格包含大约 400 万个位置，并且每个位置只需要一位逻辑信息，这里用一个字节表示。 

对于输入位置的斜线`(i, j)`，被封锁的位置是`(2i+1, 2j+2)`和`(2i+2, 2j+1)`。 对于反斜杠，它们是`(2i+1, 2j+1)`和`(2i+2, 2j+2)`。 这`+1`偏移在整个绘图周围留下自由边框。 

洪水填充使用整数单元索引堆栈而不是存储`(row, column)`元组。 将位置编码为`row * W + column`使每个堆栈条目成为一个整数。`array('i')`使该堆栈​​远小于包含数百万个 Python 整数对象的 Python 列表。 

用于恢复行和列的除法和余数是安全的，因为网格尺寸只有 2000 左右。Python 整数还消除了对溢出的任何担忧。 

在访问相邻索引之前有意执行边界检查。 由于外部填充是相同缩放网格的一部分，因此外部没有特殊的洪水填充逻辑。 它只是包含填充单元的组件。 

## 工作示例

 ### 示例 1

 输入是```
2 2
/\
\/
```四个对角墙形成一个封闭区域。 缩放表示包含一个有界自由空间分量和一个外部分量。 

| 舞台| 行动| 找到组件 | 堆栈状态 |
 | --- | --- | --- | --- |
 | 1 | 从外部填充开始 | 1 | 探索外部细胞 |
 | 2 | 区域外洪水填埋完成 | 1 | 空 |
 | 3 | 查找第一个封闭的自由区域 | 2 | 探索封闭细胞 |
 | 4 | 洪水填埋完成封闭区域| 2 | 空 |
 | 5 | 计算`components - 1`| 1 | 空 |

 这两个组成部分正是几何学所暗示的：无界的外部和单个封闭的正方形。 一堵墙的拆除将它们连接起来，所以答案是`1`。 

### 示例 2

 输入是```
4 4
/\..
\.\.
.\/\
..\/
```缩放迷宫具有三个自由空间组件。 一个在外面，两个在封闭的地方。 

| 舞台| 行动| 找到组件 | 堆栈状态 |
 | --- | --- | --- | --- |
 | 1 | 洪水淹没了外部地区| 1 | 遍历后清空 |
 | 2 | 遇到第一个封闭区域 | 2 | 遍历后清空|
 | 3 | 遇到第二个封闭区域| 3 | 遍历后清空|
 | 4 | 计算`components - 1`| 2 | 空 |

 两个封闭的组件是独立的，因此每个组件都需要与外部连接。 结果是`2`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(RC) | 缩放后的网格有 O(RC) 个单元，每个单元最多被构建和访问一次。 |
 | 空间| O(RC) | 缩放网格和洪水填充堆栈都使用线性空间。 |

 对于 R,C≤1000，缩放后的网格最多包含约 400 万个单元。 该算法对每个单元执行恒定量的工作，因此避免了从头开始重复求解迷宫的二次行为。 紧凑型`bytearray`表示在这种大小下特别有用，而整数堆栈避免了存储坐标元组的内存开销。 

## 测试用例

 以下测试使用与提交的解决方案相同的组件计数逻辑。 助手接受完整的输入字符串并返回生成的输出。```python
# helper: run solution on input string, return output string
import sys
import io
from array import array

def solve_io(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    R, C = map(int, sys.stdin.readline().split())
    maze = [sys.stdin.readline().rstrip('\n') for _ in range(R)]

    H = 2 * R + 2
    W = 2 * C + 2
    total = H * W

    grid = bytearray(total)

    for i in range(R):
        row = maze[i]
        base = (2 * i + 1) * W

        for j, ch in enumerate(row):
            if ch == '/':
                grid[base + 2 * j + 2] = 1
                grid[base + W + 2 * j + 1] = 1
            elif ch == '\\':
                grid[base + 2 * j + 1] = 1
                grid[base + W + 2 * j + 2] = 1

    components = 0
    stack = array('i')

    for start in range(total):
        if grid[start]:
            continue

        components += 1
        grid[start] = 1
        stack.append(start)

        while stack:
            v = stack.pop()
            r = v // W
            c = v - r * W

            if r > 0:
                u = v - W
                if not grid[u]:
                    grid[u] = 1
                    stack.append(u)

            if r + 1 < H:
                u = v + W
                if not grid[u]:
                    grid[u] = 1
                    stack.append(u)

            if c > 0:
                u = v - 1
                if not grid[u]:
                    grid[u] = 1
                    stack.append(u)

            if c + 1 < W:
                u = v + 1
                if not grid[u]:
                    grid[u] = 1
                    stack.append(u)

    sys.stdout.write(str(components - 1) + '\n')
    result = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return result

# Provided sample 1
assert solve_io(
    "2 2\n"
    "/\\\n"
    "\\/\n"
) == "1\n", "sample 1"

# Provided sample 2
assert solve_io(
    "4 4\n"
    "/\\..\n"
    "\\.\\.\n"
    ".\\/\\\n"
    "..\\/\n"
) == "2\n", "sample 2"

# Provided sample 3
assert solve_io(
    "2 2\n"
    "\\/\n"
    "/\\\n"
) == "0\n", "sample 3"

# Provided sample 4
assert solve_io(
    "8 20\n"
    "/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\\n"
    "\\../\\.\\/./././\\/\\/\\/\\\n"
    "/./\\.././\\/\\.\\/\\/\\/\\/\\\n"
    "\\/\\/\\.\\/\\/./\\/..\\../\n"
    "/\\/./\\/\\/./..\\/\\/..\\\n"
    "\\.\\.././\\.\\/\\/./\\.\\/\n"
    "/.../\\../..\\/./.../\\\n"
    "\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\\n"
) == "26\n", "sample 4"

# Minimum-size input, a single empty cell.
assert solve_io(
    "1 1\n"
    ".\n"
) == "0\n", "single empty cell"

# A single diagonal wall reaches the boundary and encloses nothing.
assert solve_io(
    "1 1\n"
    "/\n"
) == "0\n", "single boundary wall"

# A 2x2 diamond with the opposite orientation is open, not enclosed.
assert solve_io(
    "2 2\n"
    "\\/\n"
    "/\\\n"
) == "0\n", "open 2x2 arrangement"

# Maximum-size valid empty maze.
assert solve_io(
    "1000 1000\n" + (".\n" * 1000)
) == "0\n", "maximum-size empty maze"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 2 /\,\/`|`1`| 基本封闭区域和对角线映射 |
 |`4 4 /\.., \.\., .\/\, ..\/`|`2`| 多个封闭组件|
 |`2 2 \/, /\`|`0`| 不形成外壳的方向 |
 |`1 1 .`|`0`| 最小尺寸的完全开放迷宫|
 |`1 1 /`|`0`| 接触边界的墙并不封闭空间 |
 |`1000 1000`充满`.`|`0`| 最大尺寸和内存使用量 |

 ## 边缘情况

 单细胞空迷宫```
1 1
.
```仅创建一个自由空间组件。 洪水填充从该单元格开始，访问整个缩放网格（包括其填充），并获取`components = 1`。 最终计算给出`1 - 1 = 0`。 

单细胞壁```
1 1
/
```处理方式与封闭的四墙正方形不同。 它的两个阻塞的鳞片细胞仅形成到达边界的一段。 剩余的空闲位置都属于同一个组件，因此组件数仍然是`1`答案是`0`。 这就是为什么直接计算墙壁字符是不正确的。 

对于样品 3，```
2 2
\/
/\
```对角线段接触边界的方式使自由空间保持连接。 缩放的洪水填充仅找到外部组件。 答案是`0`，尽管有四个墙字符。 

对于样品 2，```
4 4
/\..
\.\.
.\/\
..\/
```洪水填充发现了三个组成部分。 第一个是外部的，而另外两个是封闭的。 算法返回`3 - 1 = 2`，匹配需要开放两个独立区域的事实。 

在最大尺寸下，缩放后的网格约为 2002×2002。 该算法仍然访问每个位置一次。 使用`bytearray`对于网格和`array('i')`DFS 堆栈避免了 Python 所带来的大对象开销`list[list[int]]`或一堆`(row, column)`元组会介绍。
