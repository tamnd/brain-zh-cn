---
title: "CF 102700L - 孤独的一天"
description: "我们有一个 N × M 的网格，其单元要么是干净的，要么是脏的。 含有S和E的细胞也是干净的。 Vitor 可以一步在一侧相邻的清洁单元之间移动。"
date: "2026-08-08T08:28:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102700
codeforces_index: "L"
codeforces_contest_name: "2020 ICPC Universidad Nacional de Colombia Programming Contest"
rating: 0
weight: 102700
solve_time_s: 466
verified: true
draft: false
---

[CF 102700L - 孤独的一天](https://codeforces.com/problemset/problem/102700/L)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个`N × M`网格的单元格要么是干净的，要么是脏的。 细胞含有`S`和`E`也很干净。 Vitor 可以一步在一侧相邻的清洁单元之间移动。 此外，当该行中严格位于它们之间的每个单元都脏时，同一行中的两个干净单元可以通过隧道连接。 同样的规则也适用于垂直方向。 

隧道不是任意的远程连接。 如果两个洁净单元连接成一排，则它们之间不能有另一个洁净单元。 因此，对于每个干净单元，四个方向中的每个方向最多可以有一个隧道端点。 因此，运动图的阶数最多为四。 

输入给出网格，恰好有一个`S`正好一个`E`。 输出要求最短的移动序列`S`到`E`。 如果存在多个最短序列，则必须打印字典顺序最小的方向字符串。 方向字符是`D`,`L`,`R`， 和`U`，所以它们的字典顺序是`D < L < R < U`。 

约束足够大，网格本身可以包含四百万个单元。 执行与网格大小成正比的工作的算法是合理的，但重复扫描整个行或列以查找每个单元格则不合理。 特别是，一个`O(NM max(N,M))`方法可以大致执行`4 · 2000 · 2000 · 2000 = 32 billion`最坏情况下的定向检查。 甚至一个`O((NM)^2)`施工远远超出了两秒的限制。 我们需要在本质上线性的时间内发现所有有用的隧道连接。 

在一些边缘情况下，直接的实现可能会悄无声息地失败。 

考虑最小网格```
2 2
SX
XE
```没有干净的路径，也没有隧道，因为每个可能的中间单元都在网格之外。 正确的输出是`-1`。 粗心的实现将对角线分开的两个单元视为连接的，或者意外地允许隧道穿过边界，将错误地找到路径。 

一条隧道可以跨越许多脏单元格，但仍然必须算作一次移动。 例如，```
2 5
SXXXE
.....
```第一行包含`S`，三个脏单元格，以及`E`。 维托可以直接从`S`到`E`，所以答案是```
1
R
```仅考虑侧面相邻移动的实现将返回长度为四的路径。 

隧道的端点必须是干净的。 例如，```
2 5
SXXXX
XXXXE
```无法连接`S`和`E`，因为它们不在同一行或同一列。 更一般地说，脏单元格是障碍物，而不是隧道的中间顶点。 扫描必须记录干净单元并连接连续的干净单元，而不是将每个最大脏段视为可遍历。 

最后，仅靠最短距离是不够的。 在```
3 3
S..
...
..E
```许多路径的长度为四，但所需的答案是`DDRR`。 自从`D < L < R < U`，必须组织 BFS，以便在相等长度的路径中按字典顺序考虑路径。 仅仅找到最短路径是不够的。 

## 方法

 最直接的解决方案是将每个干净单元视为图的顶点。 正常的边相邻移动会产生一个边缘，而隧道会产生另一个边缘。 一旦该图构​​建完成，普通的 BFS 就可以从`S`给出最小移动次数，因为每条边都代表一次移动。 

构建图表的强力方法是站在每个干净的单元格处，向所有四个方向观察，直到到达下一个干净的单元格。 下一个干净的单元正是该方向上可能的隧道端点。 该方法是正确的，因为遇到的第一个干净单元是唯一可能的端点：如果在它之前出现另一个干净单元，则两个较远的单元之间将有一个干净单元，并且不会满足隧道条件。 

问题是重复扫描。 单个细胞最多可扫描`M`水平位置和`N`垂直位置。 400万个cell，2000个维度，可以达到百亿次检查。 图本身是稀疏的，但暴力发现并没有利用这种稀疏性。 

关键的观察结果是，可以通过一次线性扫描找到整行或整列的隧道邻居。 在一行中，保留最近干净单元格的位置。 每当遇到另一个干净单元时，这两个单元都是该行中连续的干净单元，因此它们通过隧道连接。 我们可以立即记录两个方向的连接。 对每根柱重复相同的过程即可得到所有垂直隧道连接。 

这是有效的，因为当两个洁净单元之间没有洁净单元时，它们正好有一个隧道。 因此，在一行中的所有干净单元中，只有连续的干净单元需要边缘。 同样的说法适用于每一列。 

构建完这四个方向邻居后，BFS 解决了最短路径问题。 为了获得字典顺序最小的最短路径，每个顶点的出边按顺序处理`D`,`L`,`R`,`U`。 BFS 按距离处理顶点，并且在一个距离层内，它按照用于到达它们的路径的字典顺序处理它们。 然后，按字典顺序处理传出边，使第一个发现的到每个顶点的路径成为到该顶点的所有最短路径中的最小路径。 

因此，这两种方法之间的关系很简单。 暴力解决方案已经有了正确的图和正确的 BFS，但浪费时间重新发现隧道邻居。 行和列扫描用网格上的四次线性扫描替换了所有这些重复搜索。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(NM(N+M))`|`O(NM)`| 太慢了|
 | 最佳 |`O(NM)`|`O(NM)`| 已接受 |

 ## 算法演练

 1. 读取网格并找到单元格`S`和`E`。 在构建连接时，将它们完全视为干净的单元格，因为该问题明确允许 Vitor 站在它们上面。 
2. 分配四个数组，代表每个方向上最接近的干净单元。 对于索引处的单元格`v`，数组存储其左、右、上、下隧道邻居。 缺席的邻居表示为`-1`。 
3. 从左到右扫描每一行。 保留前一个干净单元格的索引。 当当前单元格是干净的并且存在先前的干净单元格时，将两个单元格连接为左邻居和右邻居。 然后使当前单元格成为先前的干净单元格。 

这两个单元格是该行中连续的干净单元格，因此它们之间的每个单元格都是脏的。 它们确实是有效的隧道对。 该行中的其他单元格不能是前一个单元格的直接右邻居。 
4. 从上到下扫描每一列。 垂直应用相同的连续清洁单元理念。 当找到两个连续的干净单元格时，将它们连接为上下邻居。 
5. 启动 BFS`S`。 按顺序处理每个顶点的邻居`D`,`L`,`R`,`U`。 对于每个未访问过的干净单元，记录其前驱单元和进入它的方向，然后将其放入 BFS 队列中。 

顺序仅对打破平局很重要。 BFS 已经保证了最小距离，而按字典顺序处理方向则保证到达单元的第一条最短路径是其字典顺序最小的最短路径。 
6. 当 BFS 达到以下任一值时停止`E`或耗尽了可到达的组件。 如果`E`从未访问过，打印`-1`。 
7. 如果`E`已达到，请遵循前辈的指示`E`回到`S`。 每个存储的方向描述从前一个单元格到当前单元格的移动。 将收集到的字符进行反转，得到来自的路线`S`到`E`。 

为什么有效：在行和列扫描之后，每个合法隧道都由一条边表示。 更准确地说，对于任何干净单元，其向左、向右、向上或向下的第一个干净单元正是该方向上唯一可能的隧道邻居。 因此，构建的图包含所有合法的移动，没有非法的移动。 因此，BFS 计算真正的最小移动次数。 在每个 BFS 距离层中，顶点按照其最短路径前缀的字典顺序到达，因为父节点按该顺序处理，并且它们的传出方向被处理为`D`,`L`,`R`,`U`。 第一次`E`被发现后，它的路径因此是所有最短路径中最短且按字典顺序最小的。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    grid = [input().strip() for _ in range(n)]

    total = n * m

    left = array('i', [-1]) * total
    right = array('i', [-1]) * total
    up = array('i', [-1]) * total
    down = array('i', [-1]) * total

    start = -1
    target = -1

    for r in range(n):
        base = r * m
        row = grid[r]

        prev = -1
        for c in range(m):
            ch = row[c]
            if ch == 'X':
                continue

            v = base + c

            if ch == 'S':
                start = v
            elif ch == 'E':
                target = v

            if prev != -1:
                left[v] = prev
                right[prev] = v

            prev = v

    for c in range(m):
        prev = -1

        for r in range(n):
            v = r * m + c

            if grid[r][c] == 'X':
                continue

            if prev != -1:
                up[v] = prev
                down[prev] = v

            prev = v

    parent = array('i', [-1]) * total
    move = bytearray(total)

    queue = array('i')
    queue.append(start)
    parent[start] = start

    head = 0

    while head < len(queue):
        v = queue[head]
        head += 1

        if v == target:
            break

        r = v // m
        c = v - r * m

        # Lexicographic order: D < L < R < U.
        if r + 1 < n:
            to = down[v]
            if to != -1 and parent[to] == -1:
                parent[to] = v
                move[to] = ord('D')
                queue.append(to)

        to = left[v]
        if to != -1 and parent[to] == -1:
            parent[to] = v
            move[to] = ord('L')
            queue.append(to)

        to = right[v]
        if to != -1 and parent[to] == -1:
            parent[to] = v
            move[to] = ord('R')
            queue.append(to)

        if r > 0:
            to = up[v]
            if to != -1 and parent[to] == -1:
                parent[to] = v
                move[to] = ord('U')
                queue.append(to)

    if parent[target] == -1:
        print(-1)
        return

    path = bytearray()
    cur = target

    while cur != start:
        path.append(move[cur])
        cur = parent[cur]

    path.reverse()

    print(len(path))
    print(path.decode())

if __name__ == "__main__":
    solve()
```四个`array('i')`对象使用 32 位有符号整数存储整数单元索引。 这比这里的 Python 列表更可取，因为四百万个 Python 整数将比它们的打包表示消耗更多的内存。 

行扫描实现了图构造的水平部分。`prev`是最新的洁净室。 当找到一个新的干净单元格时，它就成为`prev`， 尽管`prev`成为新单元格的左邻居。 因为它们之间不能有另一个干净的单元，所以这与隧道定义完全匹配。 

列扫描在垂直方向上做同样的事情。 输入是逐行存储的，因此单元格的索引`(r, c)`是`r * m + c`。 向下移动添加`m`，同时向上移动减去`m`。 该实现使用预先计算的`up`和`down`数组，因此边界检查主要是防御性的。 失踪的邻居已经由`-1`。 

BFS 使用`parent[start] = start`作为起始单元格的已访问标记。 每个其他未访问的单元都有父单元`-1`。 这避免了维护单独的布尔访问数组。 

队列也是一个`array('i')`。 这`head`索引向前移动而不是重复删除第一个元素，这避免了`O(n)`的成本`pop(0)`。 

邻里秩序是故意的`D`,`L`,`R`,`U`。 不隐式依赖 ASCII 顺序。 该代码明确遵循所需的字典顺序。 当第一次发现一个单元时，其前身和传入方向将被永久存储。 在具有相同距离的情况下，到同一单元的后续路径不能按字典顺序更小，因为 BFS 按字典顺序到达父级，并且按字典顺序探索它们的边缘。 

Python 实现中没有发生整数溢出。 最大的细胞索引是`N*M-1`，这最多是`3,999,999`，轻松地位于有符号的 32 位整数内。 

重建工作是倒退的`E`到`S`。 由于每个存储的方向描述了 BFS 期间使用的前向边缘，因此收集的字符串最初是相反的。 呼唤`reverse()`恢复实际路线。 

## 工作示例

 ### 示例 1

 网格是```
3 3
S..
...
..E
```没有脏单元格，因此隧道不会产生任何长跳跃。 该图是普通的四邻居网格。 

| 当前单元格 | 方向尝试| 下一个单元 | 行动|
 | --- | --- | --- | --- |
 |`(0,0)`|`D`|`(1,0)`| 发现|
 |`(0,0)`|`L`| 无 | 忽略|
 |`(0,0)`|`R`|`(0,1)`| 发现|
 |`(0,0)`|`U`| 无 | 忽略|
 |`(1,0)`|`D`|`(2,0)`| 发现|
 |`(1,0)`|`L`| 无 | 忽略|
 |`(1,0)`|`R`|`(1,1)`| 发现|
 |`(1,0)`|`U`|`(0,0)`| 已经访问过 |
 |`(2,0)`|`D`| 无 | 忽略|
 |`(2,0)`|`L`| 无 | 忽略|
 |`(2,0)`|`R`|`(2,1)`| 发现|
 |`(2,0)`|`U`|`(1,0)`| 已经访问过 |
 |`(2,1)`|`D`| 无 | 忽略|
 |`(2,1)`|`L`|`(2,0)`| 已经访问过 |
 |`(2,1)`|`R`|`(2,2)`| 发现`E`|

 由此产生的前驱链是```
S -> D -> D -> R -> R -> E
```所以答案是```
4
DDRR
```还有其他几条长度为四的路径。 BFS排序选择`DDRR`因为`D`按字典顺序小于`R`，并且在每个分支点都应用相同的比较。 

### 示例 2

 网格是```
3 3
SX.
XXX
XXE
```第一行有两个干净的单元格，`S`以及第二列的单元格。 之间的三个单元格`S`并且下一个干净的单元不存在，因此通过正常的相邻移动到达下一个单元。 更重要的是，第一行的最后一个单元格和`S`正好被一个脏单元隔开，因此水平扫描直接将它们连接起来。 

第三列顶部有一个干净的单元格，`E`在底部，中间有一个肮脏的单元格。 垂直扫描连接这两个干净的单元。 

| 当前单元格 | 方向 | 邻居 | 结果 |
 | --- | --- | --- | --- |
 |`S = (0,0)`|`D`| 无 | 忽略|
 |`S = (0,0)`|`L`| 无 | 忽略|
 |`S = (0,0)`|`R`|`(0,2)`| 发现|
 |`S = (0,0)`|`U`| 无 | 忽略|
 |`(0,2)`|`D`|`E = (2,2)`| 发现|
 |`(0,2)`|`L`|`S`| 已经访问过 |
 |`(0,2)`|`R`| 无 | 忽略|
 |`(0,2)`|`U`| 无 | 忽略|

 该路径只有两个动作：```
RD
```该示例演示了为什么即使隧道边缘的端点在原始网格中不相邻，也必须添加隧道边缘。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(NM)`| 每个网格单元在行扫描中检查一次，在列扫描中检查一次，并且在 BFS 期间最多检查一次。 |
 | 空间|`O(NM)`| 四个邻居数组、BFS 父数组、队列、移动数组和网格都随单元格数量线性缩放。 |

 为了`N, M <= 2000`，最多有四百万个细胞。 该算法仅对每个单元执行恒定量的工作，而不是重复扫描长行和列。 打包的整数数组使内存使用量保持在 512 MB 限制以下。 渐近界限也是两秒时间限制的正确尺度。 

## 测试用例

 以下测试工具包含与可调用函数相同的算法，以便断言可以独立执行。```python
import sys
import io
from array import array

def solve_input(inp: str) -> str:
    data = inp.splitlines()
    n, m = map(int, data[0].split())
    grid = data[1:1 + n]

    total = n * m

    left = array('i', [-1]) * total
    right = array('i', [-1]) * total
    up = array('i', [-1]) * total
    down = array('i', [-1]) * total

    start = -1
    target = -1

    for r in range(n):
        base = r * m
        prev = -1

        for c in range(m):
            ch = grid[r][c]

            if ch == 'X':
                continue

            v = base + c

            if ch == 'S':
                start = v
            elif ch == 'E':
                target = v

            if prev != -1:
                left[v] = prev
                right[prev] = v

            prev = v

    for c in range(m):
        prev = -1

        for r in range(n):
            if grid[r][c] == 'X':
                continue

            v = r * m + c

            if prev != -1:
                up[v] = prev
                down[prev] = v

            prev = v

    parent = array('i', [-1]) * total
    move = bytearray(total)

    queue = array('i')
    queue.append(start)
    parent[start] = start

    head = 0

    while head < len(queue):
        v = queue[head]
        head += 1

        if v == target:
            break

        r = v // m

        to = down[v]
        if to != -1 and parent[to] == -1:
            parent[to] = v
            move[to] = ord('D')
            queue.append(to)

        to = left[v]
        if to != -1 and parent[to] == -1:
            parent[to] = v
            move[to] = ord('L')
            queue.append(to)

        to = right[v]
        if to != -1 and parent[to] == -1:
            parent[to] = v
            move[to] = ord('R')
            queue.append(to)

        to = up[v]
        if to != -1 and parent[to] == -1:
            parent[to] = v
            move[to] = ord('U')
            queue.append(to)

    if parent[target] == -1:
        return "-1\n"

    path = bytearray()
    cur = target

    while cur != start:
        path.append(move[cur])
        cur = parent[cur]

    path.reverse()

    return f"{len(path)}\n{path.decode()}\n"

# Provided sample 1.
assert solve_input(
    """3 3
S..
...
..E
"""
) == "4\nDDRR\n"

# Provided sample 2.
assert solve_input(
    """3 3
SX.
XXX
XXE
"""
) == "2\nRD\n"

# Provided sample 3.
assert solve_input(
    """2 2
SX
XE
"""
) == "-1\n"

# Custom case 1: a horizontal tunnel spanning three dirty cells.
assert solve_input(
    """2 5
SXXXE
.....
"""
) == "1\nR\n"

# Custom case 2: a vertical tunnel spanning three dirty cells.
assert solve_input(
    """5 2
SX
XX
XX
XX
EX
"""
) == "1\nD\n"

# Custom case 3: shortest path with lexicographic tie.
# The open 3x3 grid has many shortest paths. DDRR is the smallest.
assert solve_input(
    """3 3
S..
...
..E
"""
) == "4\nDDRR\n"

# Custom case 4: maximum-size grid, all cells dirty except S and E.
# There is no row or column containing both endpoints, so E is unreachable.
n = 2000
m = 2000
rows = ["X" * m for _ in range(n)]
rows[0] = "S" + "X" * (m - 1)
rows[-1] = "X" * (m - 1) + "E"

large_input = f"{n} {m}\n" + "\n".join(rows) + "\n"
assert solve_input(large_input) == "-1\n"

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 × 5`,`SXXXE`排成一排 |`1 / R`| 隧道可以跳过任意数量的脏单元。 |
 |`5 × 2`,`S`多于`E`之间有脏细胞|`1 / D`| 垂直隧道施工和边界处理。 |
 | 打开`3 × 3`网格|`4 / DDRR`| 在几个最短路径中按字典顺序最小。 |
 |`2000 × 2000`， 仅有的`S`和`E`干净|`-1`| 最大网格尺寸和无法到达的目的地，而不会意外连接对角线。 |

 ## 边缘情况

 的`2 × 2`无法到达的情况```
2 2
SX
XE
```仅包含两个干净的细胞，`S`和`E`，并且它们是对角线。 行扫描在第一行中看不到第二个干净单元，而列扫描在第一列中看不到第二个干净单元。 对于目的地也是如此。 因此，BFS 没有出边`S`， 所以`parent[E]`遗迹`-1`算法打印`-1`。 

对于较长的水平隧道，```
2 5
SXXXE
.....
```行扫描第一条记录`S`与之前的洁净室一样。 它忽略了这三个`X`细胞，然后遇到`E`并连接两个端点。 BFS 看到`E`作为`R`的邻居`S`，所以最短距离为 1，输出为`1`其次是`R`。 脏单元格永远不会插入到图中。 

对于长垂直隧道，```
5 2
SX
XX
XX
XX
EX
```第一列包含`S`，三个脏单元格，以及`E`。 在列扫描期间，`S`变成`prev`，跳过脏单元格，并且`E`终于连接到`S`作为它的下邻居。 BFS 一举实现`D`移动。 这发现了仅将相邻的干净单元视为可移动的常见错误。 

词典编排案例```
3 3
S..
...
..E
```有几条长度为 4 的最短路线。 BFS 首先到达左下单元格`D`，而不是通过右上角的单元格`R`， 因为`D`按字典顺序排在第一位。 从那里继续处理`D`前`R`，生产`DDRR`。 使用任意邻居顺序的 BFS 仍可能找到最短路径，但它可能会返回`DRDR`,`DRRD`，或另一个有效的长度为四的路线，这将违反输出要求。 

最大尺寸的外壳包含四百万个电池，但几乎所有电池都是脏的。 行和列扫描仍然仅接触每个单元恒定的次数。 BFS仅访问`S`因为它没有法律上的优势。 打包数组使内存与单元数量成正比，因此最坏情况的维度不会改变算法方法。
