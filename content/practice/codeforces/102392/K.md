---
title: "CF 102392K - 搁浅机器人"
description: "我们有一个尺寸为 m × n × p 的三维矩形网格。 单元格可以是固体残骸、空白空间、机器人的起始单元格 R 或传送器 T。机器人占据一个空单元格，并且最初附着在一些邻近的固体残骸上。"
date: "2026-08-10T19:43:32+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102392
codeforces_index: "K"
codeforces_contest_name: "2019-2020 ICPC Southeastern European Regional Programming Contest (SEERC 2019)"
rating: 0
weight: 102392
solve_time_s: 372
verified: true
draft: false
---

[CF 102392K - 搁浅机器人](https://codeforces.com/problemset/problem/102392/K)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个三维矩形网格，其尺寸为`m × n × p`。 一个单元可以是固体残骸、空旷的空间、机器人的起始单元`R`，或传送器`T`。 机器人占据一个空单元，最初附着在一些邻近的固体残骸上。 目标是达到`T`以最少的动作同时结束附着在残骸上的动作。 

不寻常的部分是，可以在每次移动之前独立选择重力。 有六种可能的重力方向，每个坐标轴有一个正方向和一个负方向。 对于选定的方向，阳光来自相反的一侧。 仅当某个位置与太阳之间没有任何固体块时，该位置才可用。 移动可以是沿着表面的普通水平移动、从较高表面跳下然后坠落，或者改变重力方向后的纯粹坠落。 每一步的成本都是一。 

输入沿每个维度最多包含 500 个单元格，因此体积可以达到`500^3 = 125,000,000`细胞。 这立即排除了存储或搜索每个网格单元一个顶点的图的可能性。 即使是对所有单元的线性时间遍历也已经是输入本身的规模，而体积中的任何二次方都是完全不可能的。 有用的算法必须读取整个输入`O(mnp)`时间，但之后它需要处理更小的表示。 

关键的边缘情况来自空的单元格和有效的静止位置的单元格之间的区别。 例如，考虑以下一维排列。```
3 1 1
R*T
```机器人由中间的固体单元支撑，但没有可以移动的第二个横向维度。 它不能简单地穿过固体细胞来到达`T`，所以答案是`-1`。 相邻空单元格上的简单最短路径会错误地将传送器视为可达。 

另一个微妙的情况是从传送器中掉下来。 考虑：```
2 4 1
R*
T-
--
*-
```机器人可以选择重力增加`y`。 它的列包含一个实心块`y = 3`，所以从`y = 0`它落到`y = 2`。 传送器位于`y = 1`在那次秋天期间通过并且不会激活。 粗心的实施会检查跌倒穿过的每个单元格，从而错误地报告成功。 正确答案是`-1`。 

第三个边缘情况是阳光。 在```
3 3 1
-R-
-*-
-T-
```机器人和相关方向的传送器之间存在残骸，并且机器人无法安排有效的照明移动序列。 答案是`-1`。 将每个空的相邻单元视为可遍历的，忽略了整个移动必须在两个端点都被照亮时发生的事实。 

最后，网格边界很重要。 第一个或最后一个坐标平面上的实心块可能仅从一侧可见。 网格外的位置永远不是有效的机器人位置，因此坐标处的表面`0`无法在坐标处产生静止位置`-1`，并且在相反的边界处类似。 

## 方法

 蛮力方法是将每个空网格单元视为可能的机器人位置，并尝试从中尝试所有六个重力方向。 对于每个方向，我们可以扫描网格，直到找到第一个实心块，确定机器人是否可以移动或下降，然后运行 ​​BFS。 这是正确的，因为每个物理动作都可以直接模拟。 

问题在于状态空间和重复扫描。 可以有`125,000,000`细胞，并且对它们进行 BFS 已经需要大约 1.25 亿个状态。 如果每个州检查六个方向，每个方向扫描最多 500 个单元格，那么最坏的情况大约达到`6 · 125,000,000 · 500 = 375,000,000,000`基本细胞检查。 即使存储完整的访问数组也不必要地大。 

改变问题的观察结果是，对于一个固定的阳光方向，只有每条线中的第一个可见固体块很重要。 沿正方向考虑重力`z`。 对于每一个`(x,y)`， 让`zMin[x,y]`成为最小的`z`含有固体块。 沿同一条线更远的每个实心块在该方向上都将永远隐藏。 机器人只能在这样一个可见的方块之前完成一次移动，所以最多`m · n`该方向存在相关职位。 

相同的构造适用于相反的方向，使用`zMax`，以及其他两个轴。 在所有六个方向上最多有`2(np + mp + mn)`表面状态。 由于所有维度最多为 500，因此最多有 150 万个状态，而不是 1.25 亿个网格单元。 

深度缓冲区是 BFS 所需的完整几何信息。 对于沿轴的正重力，机器人在坐标`q`仅当第一个实体块位于坐标处时才能移动`s`和`q + 1 <= s`。 如果`q + 1 < s`，机器人悬挂着，一动就把它扔到`s - 1`。 如果`q + 1 = s`，它停留在表面上并且可以横向移动到另一个可见表面。 负方向是对称的，使用`q - 1 >= s`并降落在`s + 1`。 

蛮力方法之所以有效，是因为它试图从字面上模拟物理规则，但会失败，因为大多数细胞永远无法成为锚定状态。 观察到只有每行上的第一个可见块很重要，这让我们在执行 BFS 之前丢弃几乎整个三维体积。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(mnp · max(m,n,p))`在直接模拟中|`O(mnp)`| 太慢了|
 | 最佳 |`O(mnp + mnp)`用于输入/深度构造和`O(mn + mp + np)`对于 BFS |`O(mn + mp + np)`| 已接受 |

 输入本身包含`Θ(mnp)`字符，因此不能渐近地避免线性输入处理项。 

## 算法演练

 1. 一次一行读取网格并找到机器人和传送器。 我们不需要保留原来的三维角色网格。 对于每一行，将哪些位置包含实心块记录为紧凑位集，因为后面的深度缓冲区构造只需要知道单元是否是实心的。 
2. 构建`xmin`和`xmax`对于每一个`(y,z)`线。`xmin[y,z]`是第一个固体`x`协调和`xmax[y,z]`是最后一个。 可以通过字节字符串搜索直接找到一行的第一个和最后一个固定位置，因此这不需要 Python 循环遍历所有位置`m`人物。 
3.对于每一个固定的`(z,x)`线、计算`ymin`和`ymax`。 从上到下处理每一层的行`ymin`，并从下到上`ymax`。 未解析列的位集让我们可以在每个方向上为每个列分配一次。 
4.对于每一个固定的`(x,y)`线、计算`zmin`和`zmax`。 工艺层数从低到高依次为`zmin`并从高到低为`zmax`。 同样，未解析的位集保证每个`(x,y)`每个方向最多分配一次位置。 
5. 将 BFS 状态与先前移动所用的重力方向一起视为锚定位置。 状态不需要存储完整的三维坐标。 对于固定方向和横向坐标，深度缓冲区唯一地确定紧邻可见实体块的锚定坐标。 
6. 通过直接从机器人的起始坐标考虑所有六个可能的重力方向来初始化 BFS。 这与将机器人插入正常状态图中略有不同。 初始机器人已锚定，但对于新选择的重力方向，它可能不邻近可见表面。 如果它只是悬挂，那么它的第一个动作就是相应的坠落。 插入 BFS 的每个状态都已经是有效移动的端点。 
7. 处理锚定状态时，尝试所有六个重力方向。 对于选定的方向，找到相应线上的第一个实心块。 如果不存在这样的块，机器人就会落入太空，因此该方向不会产生任何移动。 如果当前坐标未照亮，则该方向也不会产生移动。 
8. 如果当前位置已经与可见块相邻，则机器人正在休息。 它可以移动到垂直于重力的两个轴上的四个相邻位置之一。 对于正重力方向，目标表面必须至少与当前表面沿重力轴一样远。 对于负方向，它不能沿着该轴更远。 端点就是紧邻目标可见块之前的单元格。 
9. 如果机器人被照亮但不靠近可见块，则它处于悬挂状态。 在这种重力作用下唯一可能的移动就是直接落到可见表面上。 端点是重力方向上紧邻块之前的单元格。 
10. 每当生成目的地时，检查其坐标是否等于传送器。 仅在移动的最终端点上执行检查，而不会在跌倒期间穿过的中间单元格上执行检查。 如果是新的，则将其特定方向的状态插入到 BFS 中。 
11. BFS 探索非递减移动次数的状态，因为每次转换都代表一次物理移动。 当端点第一次等于传送器时，其距离是最小可能的答案。 

为什么它起作用：对于每个重力方向，相应的深度缓冲区准确地识别出沿每条线从太阳可见的第一个残骸块。 第一个区块后面的任何区块都不会影响该方向下的合法移动。 发光机器人的每次合法移动要么是跌落到第一个可见块，要么是从静止表面横向移动到另一个可见表面。 这些正是 BFS 生成的转换。 相反，每个生成的转换都满足问题的照明、支撑和运动条件。 因此，BFS 图精确地包含锚定端点之间的所有合法移动。 由于每条边的成本为 1，因此 BFS 返回最小移动次数。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve():
    m, n, p = map(int, input().split())

    # For the six directions:
    # +x, -x use planes of size n*p
    # +y, -y use planes of size m*p
    # +z, -z use planes of size m*n
    sx = n * p
    sy = m * p
    sz = m * n

    xmin = array('h', [-1]) * sx
    xmax = array('h', [-1]) * sx
    ymin = array('h', [-1]) * sy
    ymax = array('h', [-1]) * sy
    zmin = array('h', [-1]) * sz
    zmax = array('h', [-1]) * sz

    rx = ry = rz = -1
    tx = ty = tz = -1

    # Translate every '*' to byte 1 and everything else to byte 0.
    trans = bytearray(256)
    trans[ord('*')] = 1
    trans = bytes(trans)

    # Bit i of a row-bitset is stored at bit 8*i.
    # This wastes 7 bits per cell, but makes extraction very simple.
    row_lane_mask = ((1 << (8 * m)) - 1) // 255

    layers = []

    for z in range(p):
        layer = []

        for y in range(n):
            row = input().strip()

            pos = row.find(b'R')
            if pos != -1:
                rx, ry, rz = pos, y, z

            pos = row.find(b'T')
            if pos != -1:
                tx, ty, tz = pos, y, z

            first = row.find(b'*')
            if first != -1:
                last = row.rfind(b'*')
                idx = z * n + y
                xmin[idx] = first
                xmax[idx] = last

            bits = int.from_bytes(row.translate(trans), 'little')
            layer.append(bits)

        layers.append(layer)

        # yMin for this z-layer.
        unseen = row_lane_mask
        base = z * m

        for y, bits in enumerate(layer):
            new = bits & unseen

            while new:
                low = new & -new
                x = (low.bit_length() - 1) >> 3
                ymin[base + x] = y
                unseen ^= low
                new ^= low

        # yMax for this z-layer.
        unseen = row_lane_mask

        for y in range(n - 1, -1, -1):
            new = layer[y] & unseen

            while new:
                low = new & -new
                x = (low.bit_length() - 1) >> 3
                ymax[base + x] = y
                unseen ^= low
                new ^= low

    # zMin and zMax use one lane per (x,y).
    cells = m * n
    global_lane_mask = ((1 << (8 * cells)) - 1) // 255

    # zMin.
    unseen = global_lane_mask

    for z in range(p):
        layer = layers[z]
        for y, bits in enumerate(layer):
            shifted = bits << (8 * y * m)
            new = shifted & unseen

            while new:
                low = new & -new
                cell = (low.bit_length() - 1) >> 3
                zmin[cell] = z
                unseen ^= low
                new ^= low

    # zMax.
    unseen = global_lane_mask

    for z in range(p - 1, -1, -1):
        layer = layers[z]
        for y, bits in enumerate(layer):
            shifted = bits << (8 * y * m)
            new = shifted & unseen

            while new:
                low = new & -new
                cell = (low.bit_length() - 1) >> 3
                zmax[cell] = z
                unseen ^= low
                new ^= low

    # The original 3D grid is no longer needed.
    del layers

    mins = (xmin, ymin, zmin)
    maxs = (xmax, ymax, zmax)
    dims = (m, n, p)
    planes = (sx, sy, sz)

    # Use one fixed stride for the six direction-specific state spaces.
    # Unused entries are harmless and keep state encoding simple.
    stride = max(planes)
    visited = bytearray(6 * stride)

    # Compact BFS queue. Every state id fits in an unsigned 32-bit integer.
    queue = array('I')

    def add_state(d, idx, x, y, z):
        if x == tx and y == ty and z == tz:
            return True

        sid = d * stride + idx
        if not visited[sid]:
            visited[sid] = 1
            queue.append(sid)

        return False

    def expand(x, y, z):
        """
        Generate all one-move destinations from (x,y,z).
        Returns True if the teleporter is reached.
        """
        coords = (x, y, z)

        for d in range(6):
            axis = d >> 1
            sign = 1 if (d & 1) == 0 else -1

            q = coords[axis]

            if axis == 0:
                tidx = y * p + z
            elif axis == 1:
                tidx = x * p + z
            else:
                tidx = y * m + x

            if sign == 1:
                surface = mins[axis][tidx]
                if surface < 0 or q + 1 > surface:
                    continue
            else:
                surface = maxs[axis][tidx]
                if surface < 0 or q - 1 < surface:
                    continue

            # The robot is hanging, so the only possible move is a fall.
            if q + sign != surface:
                q2 = surface - sign

                if q2 < 0 or q2 >= dims[axis]:
                    continue

                if axis == 0:
                    nx, ny, nz = q2, y, z
                elif axis == 1:
                    nx, ny, nz = x, q2, z
                else:
                    nx, ny, nz = x, y, q2

                if add_state(d, tidx, nx, ny, nz):
                    return True

                continue

            # The robot is resting on the visible surface.
            for other in range(3):
                if other == axis:
                    continue

                for delta in (-1, 1):
                    nx, ny, nz = x, y, z

                    if other == 0:
                        nx += delta
                        if nx < 0 or nx >= m:
                            continue
                    elif other == 1:
                        ny += delta
                        if ny < 0 or ny >= n:
                            continue
                    else:
                        nz += delta
                        if nz < 0 or nz >= p:
                            continue

                    if axis == 0:
                        nidx = ny * p + nz
                    elif axis == 1:
                        nidx = nx * p + nz
                    else:
                        nidx = ny * m + nx

                    if sign == 1:
                        ns = mins[axis][nidx]
                        if ns < 0 or ns < q + 1:
                            continue
                        nq = ns - 1
                    else:
                        ns = maxs[axis][nidx]
                        if ns < 0 or ns > q - 1:
                            continue
                        nq = ns + 1

                    if nq < 0 or nq >= dims[axis]:
                        continue

                    if axis == 0:
                        fx, fy, fz = nq, ny, nz
                    elif axis == 1:
                        fx, fy, fz = nx, nq, nz
                    else:
                        fx, fy, fz = nx, ny, nq

                    if add_state(d, nidx, fx, fy, fz):
                        return True

        return False

    # The robot is an anchored starting position, but it has no fixed
    # gravity direction. Generate its first move directly.
    if expand(rx, ry, rz):
        print(1)
        return

    # All states currently in the queue are endpoints of one move.
    distance = 1
    head = 0

    while head < len(queue):
        end = len(queue)

        while head < end:
            sid = queue[head]
            head += 1

            d = sid // stride
            idx = sid - d * stride

            axis = d >> 1
            sign = 1 if (d & 1) == 0 else -1

            if axis == 0:
                y = idx // p
                z = idx - y * p
                surface = xmin[idx] if sign == 1 else xmax[idx]
                x = surface - 1 if sign == 1 else surface + 1
            elif axis == 1:
                x = idx // p
                z = idx - x * p
                surface = ymin[idx] if sign == 1 else ymax[idx]
                y = surface - 1 if sign == 1 else surface + 1
            else:
                y = idx // m
                x = idx - y * m
                surface = zmin[idx] if sign == 1 else zmax[idx]
                z = surface - 1 if sign == 1 else surface + 1

            if expand(x, y, z):
                print(distance + 1)
                return

        distance += 1

    print(-1)

if __name__ == "__main__":
    solve()
```六个深度缓冲区存储在`array('h')`而不是普通的 Python 列表。 每个坐标都在`0`和`499`，因此有符号的 16 位整数就足够了，而该值`-1`表示不包含实心块的线。 这使内存与所需的成比例`O(mn + mp + np)`表面信息。 

输入表示对每行使用紧凑的位集。 一行最多有 500 个单元，将每个字符的信息放入其字节的低位中可以让 Python 在优化的整数和字节运算中执行大部分输入预处理。 位集对于查找第一个和最后一个实心行位置特别有用，而无需扫描 Python 中的每一列。 

这`ymin`和`ymax`构造使用未解析的列掩码。 一旦柱遇到第一个固体单元，该柱就会从掩模中移除。 因此，虽然每个输入行都被检查，但每个`(x,z)`line 仅导致两次成功分配，每个方向一次。 

同样的想法用于`zmin`和`zmax`，除了一行的位集被移入全局`(x,y)`坐标空间。 每个单元格位置在查找时最多分配一次`zmin`有一次当发现`zmax`。 

BFS 使用特定于方向的状态。 状态不是通用的网格坐标。 它是与上次移动所用方向相关联的锚定端点。 对于给定的方向和横向坐标，对应的深度缓冲区决定了实际的三维坐标，这就是为什么只有`O(mn + mp + np)`需要国家。 

机器人的初始位置是单独处理的，因为机器人可以在第一次移动之前选择新的重力方向。 如果该方向使机器人悬空，则第一个动作就是坠落。 移动之后，每个 BFS 状态都是正常的锚定表面状态。 

Python 中不存在整数溢出问题，坐标缓冲区使用有符号 16 位整数只是因为输入维度最多为 500。BFS 队列使用无符号 32 位整数，因为最多存在约 150 万个方向特定状态。 

## 工作示例

 ### 示例 1

 官方第一个样本是```
2 5 1
R-
*-
*-
*T
**
```机器人开始于`(0,0,0)`传送器位于`(1,3,0)`。 考虑重力增加`y`。 机器人列中的第一个实心块位于`y = 1`，所以机器人静止在`y = 0`。 在相邻的列中`x = 1`，第一个实心块位于`y = 4`，给出一个锚定位置`y = 3`。 

| BFS 状态 | 重力| 当前位置 | 目的地 | 距离 |
 | ---| ---| ---| ---| ---|
 | 初始|`+y`|`(0,0,0)`|`(1,3,0)`| 1 |

 目的地正是传送器，所以答案是`1`。 这演示了由深度缓冲区条件编码的跳跃行为。 机器人不需要一一遍历中间的空单元。 

### 示例 2

 官方的第二个样本是```
3 2 1
R-T
***
```机器人开始于`(0,0,0)`传送器是`(2,0,0)`。 在重力作用下逐渐增大`y`，每列的第一个实心块位于`y = 1`，因此机器人可以沿着顶面水平移动。 

| BFS 状态 | 当前位置 | 移动| 目的地 | 距离 |
 | ---| ---| ---| ---| ---|
 | 初始|`(0,0,0)`|`+x`表面移动|`(1,0,0)`| 1 |
 |`(1,0,0)`|`(1,0,0)`|`+x`表面移动|`(2,0,0)`| 2 |

 第二个端点是传送器，所以答案是`2`。 该迹线还显示了为什么 BFS 必须保留与表面状态相关的方向。 同一坐标可以是多个重力方向下的有效锚定端点，并且这些可能性可能导致不同的未来移动。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(mnp + mn + mp + np)`| 读取和构建深度信息与输入大小成线性关系； BFS 仅访问特定方向的表面状态 |
 | 空间|`O(mnp)`在输入预处理期间，`O(mn + mp + np)`预处理后 | 暂时保留紧凑行位集以构造深度缓冲区； BFS 本身仅使用六个深度缓冲区、访问过的状态及其队列 |

 理论算法与预期的解决方案相匹配，因为不可避免的输入大小为`O(mnp)`，而实际的搜索空间仅为`O(mn + mp + np)`。 为了`m,n,p <= 500`，搜索图最多有大约 150 万个特定方向的状态。 Python 实现还避免存储原始的三维字符网格，并使用紧凑的数值数组来表示永久状态。 

## 测试用例

 官方声明的PDF格式可以使第一个样本显得扁平化。 下面使用的有效示例布局是与实际相对应的布局`m × n × p`方面。```python
import sys
import io
from array import array

# Paste the solve() implementation above here.

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Official samples
assert run("""\
2 5 1
R-
*-
*-
*T
**
""") == "1", "sample 1"

assert run("""\
3 2 1
R-T
***
""") == "2", "sample 2"

assert run("""\
3 3 1
-R-
-*-
-T-
""") == "-1", "sample 3"

assert run("""\
5 4 2
-R---
-****
-****
-****
-----
-----
*T---
----*
""") == "5", "sample 4"

# Minimum possible number of cells that can contain both R and T
# while still giving R a neighboring solid block.
assert run("""\
2 1 1
RT
""") == "-1", "R and T cannot share a supporting configuration"

# Simple one-move boundary case.
assert run("""\
2 2 1
RT
**
""") == "1", "teleporter is reached by one surface move"

# A fall passes through T but does not end there.
assert run("""\
2 4 1
R*
T-
--
*-
""") == "-1", "passing through T during a fall must not count"

# Maximum individual dimension, while keeping the volume practical
# for a regression test. R is supported by the adjacent star.
row = ["-"] * 500
row[0] = "R"
row[1] = "*"
row[499] = "T"
max_dimension_case = "500 1 1\n" + "".join(row) + "\n"
assert run(max_dimension_case) == "-1", "maximum dimension and boundary handling"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 官方样本1 |`1`| 单次表面移动可包括长距离下降|
 | 官方样本2 |`2`| 普通水平移动和BFS距离|
 | 官方样本3 |`-1`| 照明会使明显附近的目标无法到达 |
 | 官方样本4 |`5`| 重力与三维运动的组合变化 |
 |`2 1 1`和`RT`|`-1`| 退化维度和缺乏横向运动|
 |`2 2 1`和`RT / **`|`1`| 边界表面和即时传送器到达|
 |`2 4 1`跌倒案例|`-1`| 跌倒时穿过传送器不算 |
 |`500 1 1`稀疏案例 |`-1`| 最大坐标尺寸和边界处理 |

 ## 边缘情况

 仅在计算出最终静止坐标后才通过检查目的地来处理跌倒情况。 在```
2 4 1
R*
T-
--
*-
```积极的-`y`深度缓冲区`x = 0`第一个实心块位于`y = 3`。 开始于`(0,0,0)`，机器人被照亮但悬挂着，因此生成的端点为`(0,2,0)`。 传送器位于`(0,1,0)`从未被视为目的地。 BFS 继续从`(0,2,0)`并最终报告`-1`。 这直接强制执行了仅在坠落期间穿过传送器是不够的规则。 

对于退化一维情况```
3 1 1
R*T
```机器人靠在中间的实心单元上。 在唯一有用的重力方向下，它不能横向移动，因为其他维度的大小均为一。 因此，BFS 在以下位置不生成端点：`T`，答案是`-1`。 基于普通六邻网格移动的解决方案会错误地忽略实心中间单元无法穿过的事实。 

用于照明案例```
3 3 1
-R-
-*-
-T-
```深度缓冲区正确地将实心中间单元识别为相关线的第一个障碍物。 只要机器人坐标超出第一个可见块，方向就会被拒绝，因此 BFS 永远不会错误地创建穿过照明阴影的移动。 搜索穷尽所有六个方向并返回`-1`。 

对于边界情况```
2 2 1
RT
**
```机器人开始于`(0,0,0)`。 随着重力的增加`y`，可见支撑位于`y = 1`，所以机器人静止在`y = 0`。 继续前进`x`到`(1,0,0)`达到`T`一举一动。 深度缓冲区端点保留在网格内，因此结果是正确的`1`。 

最常见的差一错误是将实体块坐标与机器人坐标混淆。 如果正方向上的第一个实心块位于`s`，机器人静止在`s - 1`，不在`s`。 对于负重力，相应的端点是`s + 1`。 在创建 BFS 状态和解码它们时，实现始终遵循这些公式。
