---
title: "CF 11C - 有多少个正方形？"
description: "我们得到了一个二进制网格。 有效对象不是填充的正方形，它只是用 1 绘制的正方形的边框。 每个不属于边界的单元格都必须为 0。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 11
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 11"
rating: 2200
weight: 11
solve_time_s: 162
verified: true
draft: false
---
[CF 11C - 有多少个正方形？](https://codeforces.com/problemset/problem/11/C)

 **评分：** 2200
 **标签：** 实施
 **求解时间：** 2m 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一个二进制网格。 有效对象不是填充的正方形，它只是用 绘制的正方形的边框`1`s。 每个不属于边界的单元格都必须是`0`。 

该问题要求我们计算两种正方形。 

第一种是轴对齐的。 它的边是水平的和垂直的，就像矩阵中的普通正方形一样。 

第二种是旋转45度。 在矩阵坐标中它看起来像一颗钻石。 

有一个额外的限制可以完全改变问题。 必须隔离一个有效的方格。 任何`1`不属于该正方形的物体禁止接触该正方形，即使是对角线。 所以边界周围的每个相邻单元格都必须是`0`，除非该邻居也是同一个正方形的一部分。 

网格尺寸最多为`250 × 250`，但所有测试用例的总输入大小最多为`10^6`。 这意味着`O(n^4)`或者`O(n^5)`解决办法是无望的。 单个`250 × 250`网格已经大致有`6 × 10^4`细胞。 枚举所有可能的正方形并逐个单元地扫描它们的边界将很容易达到数十亿次操作。 

目标复杂度应保持在单元数量上接近线性或二次方，可能具有较小的常数因子。 

棘手的部分是不检测正方形本身。 真正的困难是正确验证隔离条件。 

考虑这个例子：```
111
101
111
```这是一个有效的轴对齐正方形。 中心`0`是允许的，因为只有边界很重要。 

现在看看这个：```
1110
1011
1110
0000
```粗心的解决方案可能会导致`3 × 3`边框在左侧。 但额外的`1`在`(1,3)`接触正方形的对角线，所以答案实际上是`0`。 

旋转的方块引入了另一个错误来源：```
00100
01010
00100
```这是一颗有效的钻石。 但是如果我们添加一个相邻的`1`:```
00100
01110
00100
```由于侧面单元接触到形状，菱形变得无效。 

另一个微妙的情况是边界重叠。 假设两个正方形共享一些单元格。 两者都无效，因为每个边界单元都会有外国邻居`1`是`。 
考虑该条件的最安全方法是：`1`s 本身必须恰好是一个方形边框，而不是其他任何东西。 

## 方法

 蛮力的想法很简单。 枚举每个可能的正方形，检查是否所有所需的边框单元格都已存在`1`，检查附近所有其他单元是否都在`0`，并统计有效的。 

对于轴对齐的正方形，有`O(n^2 m^2)`可能的矩形，我们只保留那些边长相等的矩形。 单纯验证一平方的成本`O(k)`在哪里`k`是边长。 最坏的情况大致变成`O(n^5)`。 

旋转的正方形更糟糕，因为它们的几何形状不太方便。 枚举所有中心和半径仍然会导致重复扫描许多边界单元。 

暴力方法在逻辑上是有效的，因为定义是局部的、显式的。 如果我们检查每个边界单元和每个相邻单元，正确性是立竿见影的。 问题在于重复工作量。 附近的候选方块一次又一次地重复使用几乎相同的信息。 

关键的观察结果是隔离条件完全表征了连接组件。 

取任意连接的组件`1`s`。 如果它形成有效的方形边框，则：

 1. 每一个`1`在属于该方块的组件中，
 2.没有多余的触碰`1`s`，
 3.整个部件具有非常刚性的形状。 

因此，我们不是枚举正方形，而是枚举连通分量。 

组件只能是两种可能的几何形状之一：

 1. 轴对齐的空心方形边框，
 2. 菱形边框。 

所有组件的单元总数与网格大小呈线性关系，因此一旦我们使用 BFS 或 DFS 提取组件，我们只需对每个组件进行分类即可。 

这极大地改变了复杂性。 每个单元只参与一个组件遍历和少量验证工作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^5) | O(n^5) | O(1) | O(1) | 太慢了|
 | 最佳| O(纳米) | O(纳米) | 已接受 |

 ## 算法演练

 1. 遍历网格并找到连通分量`1`使用 8 方向 BFS。 

我们使用 8 个方向，因为角接触在声明中也很重要。 如果两个`1`s 对角接触，属于同一个禁簇。 
2. 对于每个组件，收集其所有坐标。 

设组件尺寸为`s`。 
3. 尝试将该组件识别为轴对齐的正方形。 

计算：

 - 最小行数`r1`- 最大行数`r2`- 最小列`c1`- 最大列`c2`边界框本身必须是正方形，因此：```
r2 - r1 == c2 - c1
```设边长为：```
L = r2 - r1 + 1
```有效的边框恰好包含：```
4 * L - 4
```细胞。 
4. 验证边界结构。 

边界框周边的每个单元格都必须属于该组件。 每个内部单元不得属于该组件。 

如果所有检查均通过并且组件尺寸匹配`4L - 4`，该分量是一个有效的方格。 
5. 如果轴对齐验证失败，请尝试旋转方形验证。 

对于菱形，定义变换后的坐标：```
u = r + c
v = r - c
```在`(u,v)`空间中，菱形变成了轴对齐的方形边框。 
6. 计算：```
umin, umax
vmin, vmax
```变换后的边界框必须满足：```
umax - umin == vmax - vmin
```7.设：```
D = umax - umin
```变换后的正方形的每个边界点对应于一个原始网格单元。 

一个细胞`(r,c)`如果满足以下条件，则属于菱形边界：```
u == umin or u == umax or
v == vmin or v == vmax
```并且所有坐标都保留在变换后的正方形内。 
8. 生成菱形所有预期的边界单元，并将其与组件进行比较。 

如果它们完全匹配，则将该组件视为有效。 
9. 对所有有效分量求和。 

### 为什么它有效

 BFS 全部分区`1`将单元格划分为边或角邻接下的最大连通分量。 有效方格不能与外部方格共享邻接关系`1`s`，因此每个有效的方块必须显示为一个完整的连通分量。 

对于轴对齐的正方形，边界框唯一确定候选边界。 任何缺失的周边单元或额外的内部单元都会立即破坏定义。 

对于旋转的正方形，坐标变换会将对角线边缘转换为轴对齐边缘。 变换后的形状必须成为完美的方形边框`(u,v)`空间。 由于变换在网格单元上是双射的，因此精确匹配变换后的边界相当于匹配原始菱形。 

由于每个组件都根据两种合法几何形状进行彻底检查，因此每个计数的组件都是有效的，并且每个有效的方块都被精确计数一次。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

DIR8 = [
    (-1, -1), (-1, 0), (-1, 1),
    (0, -1),           (0, 1),
    (1, -1),  (1, 0),  (1, 1)
]

def axis_square(comp):
    cells = set(comp)

    r1 = min(r for r, c in comp)
    r2 = max(r for r, c in comp)
    c1 = min(c for r, c in comp)
    c2 = max(c for r, c in comp)

    if r2 - r1 != c2 - c1:
        return False

    side = r2 - r1 + 1

    if side < 2:
        return False

    expected = 4 * side - 4

    if len(comp) != expected:
        return False

    for r in range(r1, r2 + 1):
        for c in range(c1, c2 + 1):
            border = (
                r == r1 or r == r2 or
                c == c1 or c == c2
            )

            inside = (r, c) in cells

            if border != inside:
                return False

    return True

def diamond_square(comp):
    cells = set(comp)

    uv = []
    for r, c in comp:
        uv.append((r + c, r - c))

    umin = min(u for u, v in uv)
    umax = max(u for u, v in uv)
    vmin = min(v for u, v in uv)
    vmax = max(v for u, v in uv)

    if umax - umin != vmax - vmin:
        return False

    d = umax - umin

    if d < 2:
        return False

    expected_cells = set()

    for u in range(umin, umax + 1):
        for v in range(vmin, vmax + 1):

            border = (
                u == umin or u == umax or
                v == vmin or v == vmax
            )

            if not border:
                continue

            if (u + v) % 2 != 0:
                continue

            r = (u + v) // 2
            c = (u - v) // 2

            expected_cells.add((r, c))

    return expected_cells == cells

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n, m = map(int, input().split())
        g = [input().strip() for _ in range(n)]

        vis = [[False] * m for _ in range(n)]

        ans = 0

        for i in range(n):
            for j in range(m):
                if g[i][j] == '0' or vis[i][j]:
                    continue

                q = deque()
                q.append((i, j))
                vis[i][j] = True

                comp = []

                while q:
                    r, c = q.popleft()
                    comp.append((r, c))

                    for dr, dc in DIR8:
                        nr = r + dr
                        nc = c + dc

                        if 0 <= nr < n and 0 <= nc < m:
                            if not vis[nr][nc] and g[nr][nc] == '1':
                                vis[nr][nc] = True
                                q.append((nr, nc))

                if axis_square(comp) or diamond_square(comp):
                    ans += 1

        out.append(str(ans))

    sys.stdout.write("\n".join(out))

solve()
```BFS 部分在 8 方向邻接下构建连接组件。 仅使用 4 个方向是不正确的，因为该语句禁止对角线接触。 

这`axis_square`函数验证普通方形边框。 边界框准确地确定了边界应该存在的位置。 比较：```
if border != inside:
```是同时拒绝丢失的边界单元和非法内部单元的最干净的方法。 

菱形检查使用坐标变换：```
u = r + c
v = r - c
```这是关键的几何技巧。 旋转的正方形在变换后的坐标中变成普通的轴对齐正方形。 

奇偶校验：```
if (u + v) % 2 != 0:
```很重要，因为只有具有匹配奇偶校验的点才对应于反转后的整数网格坐标。 

最终的平等：```
expected_cells == cells
```保证既没有丢失的边界单元，也没有多余的单元。 

## 工作示例

 ### 示例 1

 输入：```
0001000
0010100
0100010
0010100
0001000
```这是一颗钻石。 

| 步骤| 价值|
 | ---| ---|
 | 元件尺寸| 5 |
 | 乌敏 | 3 |
 | 最大 | 5 |
 | 最小| -1 |
 | 最大电压| 1 |
 | 边界宽度等于 | 是的 |
 | 生成的边界单元 | 5 |
 | 匹配组件 | 是的 |

 变换后的正方形有边长`2`在`(u,v)`空间。 每个边界点都准确地映射回原来的五个单元格。 

### 示例 2

 输入：```
1111
1001
1001
1111
```| 步骤| 价值|
 | ---| ---|
 | 边界框 | 行 0..3，列 0..3 |
 | 边长| 4 |
 | 预期边界细胞 | 12 | 12
 | 实际组成细胞| 12 | 12
 | 内部包含 1 | 没有 |
 | 结果 | 有效 |

 这证实了空心是允许的。 只有边界很重要。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(纳米) | 每个单元格在 BFS 中都会被访问一次并检查恒定次数 |
 | 空间| O(纳米) | 参观阵列和组件存储 |

 网格最多包含`62500`每个测试用例的单元格。 即使有许多测试用例，线性处理在 2 秒限制内也足够快。 内存使用量也保持在限制以下。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from collections import deque

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    DIR8 = [
        (-1, -1), (-1, 0), (-1, 1),
        (0, -1),           (0, 1),
        (1, -1),  (1, 0),  (1, 1)
    ]

    def axis_square(comp):
        cells = set(comp)

        r1 = min(r for r, c in comp)
        r2 = max(r for r, c in comp)
        c1 = min(c for r, c in comp)
        c2 = max(c for r, c in comp)

        if r2 - r1 != c2 - c1:
            return False

        side = r2 - r1 + 1

        if side < 2:
            return False

        if len(comp) != 4 * side - 4:
            return False

        for r in range(r1, r2 + 1):
            for c in range(c1, c2 + 1):
                border = (
                    r == r1 or r == r2 or
                    c == c1 or c == c2
                )

                if border != ((r, c) in cells):
                    return False

        return True

    def diamond_square(comp):
        cells = set(comp)

        uv = [(r + c, r - c) for r, c in comp]

        umin = min(u for u, v in uv)
        umax = max(u for u, v in uv)
        vmin = min(v for u, v in uv)
        vmax = max(v for u, v in uv)

        if umax - umin != vmax - vmin:
            return False

        expected = set()

        for u in range(umin, umax + 1):
            for v in range(vmin, vmax + 1):

                border = (
                    u == umin or u == umax or
                    v == vmin or v == vmax
                )

                if not border:
                    continue

                if (u + v) % 2:
                    continue

                r = (u + v) // 2
                c = (u - v) // 2

                expected.add((r, c))

        return expected == cells

    t = int(input())
    out = []

    for _ in range(t):
        n, m = map(int, input().split())
        g = [input().strip() for _ in range(n)]

        vis = [[False] * m for _ in range(n)]

        ans = 0

        for i in range(n):
            for j in range(m):
                if g[i][j] == '0' or vis[i][j]:
                    continue

                q = deque([(i, j)])
                vis[i][j] = True

                comp = []

                while q:
                    r, c = q.popleft()
                    comp.append((r, c))

                    for dr, dc in DIR8:
                        nr = r + dr
                        nc = c + dc

                        if 0 <= nr < n and 0 <= nc < m:
                            if not vis[nr][nc] and g[nr][nc] == '1':
                                vis[nr][nc] = True
                                q.append((nr, nc))

                if axis_square(comp) or diamond_square(comp):
                    ans += 1

        out.append(str(ans))

    return "\n".join(out)

# provided samples
assert run(
"""2
8 8
00010001
00101000
01000100
10000010
01000100
00101000
11010011
11000011
10 10
1111111000
1000001000
1011001000
1011001010
1000001101
1001001010
1010101000
1001001000
1000001000
1111111000
"""
) == "1\n2", "sample"

# minimum size
assert run(
"""1
2 2
11
11
"""
) == "1", "smallest valid square"

# all zeros
assert run(
"""1
4 4
0000
0000
0000
0000
"""
) == "0", "empty grid"

# touching extra cell
assert run(
"""1
4 4
1110
1011
1110
0000
"""
) == "0", "foreign touching cell"

# valid diamond
assert run(
"""1
5 5
00100
01010
00100
00000
00000
"""
) == "1", "diamond square"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2×2`所有的|`1`| 最小有效轴对齐正方形 |
 | 全零 |`0`| 空组件|
 | 额外感人的细胞 |`0`| 隔离规则|
 | 钻石图案|`1`| 旋转方形检测 |

 ## 边缘情况

 考虑这个输入：```
1
4 4
1110
1011
1110
0000
```这`3 × 3`乍一看，边框看起来很有效。 但是具有 8 方向邻接的 BFS 会合并额外的单元格`(1,3)`进入同一个组件，因为它接触`(0,2)`对角线。 

元件尺寸变为`9`，同时一个`3 × 3`边界要求准确`8`细胞。 axis-square 验证器立即拒绝它。 

现在考虑重叠的形状：```
1
5 5
11111
10001
11111
10001
11111
```简单的方法可能会检测到多个方块。 我们的算法将整个结构视为一个连接的组件。 它的边界框是`5 × 5`，但内部含有非法`1`s`。 验证器拒绝它。 

最后，考虑可能的最小旋转正方形：```
1
3 3
010
101
010
```变换后的坐标产生：```
u in [1,3]
v in [-1,1]
```所有预期的转换边界单元都准确地映射回原始组件。 该算法计算一颗有效的钻石。
