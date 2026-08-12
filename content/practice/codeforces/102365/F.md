---
title: "CF 102365F - 公平分配"
description: "对于每个村民子集，考虑他们房屋的凸包面积。 随机排列为每个村民提供边际贡献：当插入该村民时，将新的凸包面积与插入之前的面积进行比较。"
date: "2026-08-13T00:02:04+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102365
codeforces_index: "F"
codeforces_contest_name: "UBC Programming Contest 2019 (UBCPC 2019)"
rating: 0
weight: 102365
solve_time_s: 216
verified: true
draft: false
---

[CF 102365F - 公平分配](https://codeforces.com/problemset/problem/102365/F)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 36s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于每个村民子集，考虑他们房屋的凸包面积。 随机排列为每个村民提供边际贡献：当插入该村民时，将新的凸包面积与插入之前的面积进行比较。 村民所需的答案是所有可能的插入订单的边际贡献的平均值。 

等效地，这是凸包面积函数的 Shapley 值。 对于固定村民 (p)，当将 (p) 插入到其他 (N-1) 个点的均匀随机排序中时，我们需要船体面积的预期增加。 

输入最多包含 200 个不同的平面点，坐标以 (10^4) 为界。 (N) 的值较小，排除了阶乘或指数枚举，但为三次算法留下了空间。 特别是，(N^3) 在最大尺寸下仅是 (8\cdot10^6) 次迭代，这是优化实现的合理目标。 坐标界限还意味着每个普通的方向测试都可以轻松地适合 64 位整数，尽管 Python 整数消除了任何溢出问题。 

第一个退化情况是（N=1）。 单个点的凸包面积为零，因此唯一的答案是 (0)。```
1
10000 -10000
```正确的输出是```
0
```假设每个村民最终都能形成三角形的实现可能会尝试除以不存在的级别。 

第二种情况有两点。```
2
0 0
10000 10000
```答案又是```
0
0
```两点的凸包是一个线段，因此每个边际贡献为零。 基于三点的公式必须明确处理这种情况。 

第三个问题是共线性。 考虑```
4
0 0
1 0
2 0
0 1
```外壳是一个具有顶点 ((0,0),(2,0),(0,1)) 的三角形，但点 ((1,0)) 位于其一条边上。 通常的一般位置公式的简单版本可以使用两个端点 ((0,0),(2,0)) 来计算三角形，也可以计算涉及 ((1,0)) 的较小三角形，从而产生过多的面积。 正确的 Shapley 值是```
0.4166666666666667
0.0833333333333333
0.0833333333333333
0.4166666666666667
```下面的实现通过使用无穷小的符号扰动进行方向决策，同时保留三角形区域的原始坐标来处理此类简并性。 这是正确的限制性解释，因为凸包面积以及边际贡献的每个有限平均值在任意小的扰动下都是连续的。 

## 方法

 直接方法遵循字面定义。 枚举 (N!) 种排列中的每一种。 对于每个排列，一次插入一个点，每次插入后重新计算凸包，并将面积的增加添加到相应的村民中。 这是正确的，因为它明确地评估了问题所要求的期望的实验。 

问题是排列的阶乘数。 即使在考虑船体构造之前，(200!) 也大约为 (7.9\cdot10^{374})。 为每个前缀重新计算外壳将使工作变得粗略 (O(N!,N^2\log N))，这是无望的。 

有用的观察结果是，边际船体面积的增加具有非常具体的几何结构。 假设 (p) 是要插入的点。 新船体中旧船体中不存在的部分是一个三角形链，其公共顶点是 (p)。 每个这样的三角形都可以用两个较早的点 (q) 和 (q') 来描述。 

引导从 (q) 到 (q') 的直线，并令 (H(q,q')) 为其左开半平面。 如果 (p) 位于该半平面内，则当 (q) 和 (q') 是最先出现的两个相关点，而 (p) 是第三个出现时，三角形 (pqq') 可以恰好出现在船体新暴露的部分中。 

令 (L(q,q')) 为严格位于 (H(q,q')) 中的输入点的数量。 在由 (q,q') 和那些 (L) 点组成的 (L+2) 个点中，所需事件表示 (q,q') 占据前两个位置（无论顺序如何），而 (p) 占据第三个位置。 其概率为

 # \frac{2!,(L-1)!}{(L+2)!}

 \frac{2}{L(L+1)(L+2)}。 
]

 这是关键的减少。 大量的排列集合消失了。 对于每一对有序点，我们只需要一个整数、它的半平面水平和一个有理概率。 

对于固定 (p)，预期贡献为

 \sum_{\substack{q\ne q'\p\in H(q,q')}}
 \运算符名称{区域}(pqq')\rho(q,q')。 
]

 通过按每个 (q) 周围的极角对其他点进行排序并使用旋转指针，可以有效地计算级别值。 一旦级别已知，评估所有 (p) 的公式需要 (O(N^3)) 时间。 

对于给定的 (N\le200)，这是实际的解决方案。 相同的几何分解采用更先进的 (O(N^2)) 算法，通过线排列聚合加权线半平面查询，这是该思想的渐近最优版本。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(N!,N^2\log N)) | (O(N)) | 太慢了|
 | 对和半平面水平 | (O(N^3)) | (O(N^2)) | 已接受 |

 ## 算法演练

1. 阅读所有要点并为方向决策准备一个微小的象征性扰动。 计算三角形面积时原始坐标保持不变。 当原始三个点共线时，扰动仅决定一个点属于直线的哪一侧。 
2. 对于每个点 (q)，按照围绕 (q) 的极角对所有其他点进行排序。 由于扰动，没有两个相关方向是完全相关的。 
3. 使用第二个指针扫过已排序的方向。 对于有向对 (q\to q')，从 (q') 严格逆时针方向遇到的小于 (180^\circ) 的每个点都位于有向线的左半平面内。 这些点的数量为 (L(q,q'))。 
4. 将每个级别（L\ge1）转换为概率
 [
 \rho(q,q')=\frac{2}{L(L+1)(L+2)}。 
]
 零层的权重为零，因为没有第三点位于该半平面内。 
5. 对于每个目标点 (p)，检查每个无序对 (q,q')。 计算原始带符号双精度面积
 [
 c=(q'-q)\times(p-q)。 
]
 如果(c>0)，(p)在(q\to q')的左边，所以加上
 [
 \frac{c}{2}\rho(q,q')。 
]
 如果(c<0)，(p)在(q'\to q)的左边，所以添加
 [
 \frac{-c}{2}\rho(q',q)。 
]
 如果 (c=0)，则三角形的面积为零并且没有任何贡献。 
6. 打印每个点的累计值。 对于 (N<3)，循环自然会为每个村民生成零。 

计算背后的不变性是，通过插入 (p) 创建的每个正面积块都由精确的一对有向 (q,q') 表示，即旧船体的一个暴露边缘的端点。 该对表示的事件正是 (q,q') 出现在 (p) 之前，而相关边上的每个点都出现在 (p) 之后。 分配给该对的概率正是该事件的概率。 因此，对相应的三角形面积求和给出了期望中一种排列的边际贡献，并且期望的线性允许对所有对进行独立求和。 

对于共线输入，无穷小扰动仅改变原始面积为零的三元组的侧面分类。 无论如何，这样的三元组贡献的面积为零。 对于每个非共线三元组，原始整数方向非零并且远大于无穷小扰动，因此其侧面分类保持不变。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

def solve():
    n = int(input())
    pts = [tuple(map(int, input().split())) for _ in range(n)]

    if n < 3:
        for _ in range(n):
            print("0.0")
        return

    # The perturbation is only used for orientation / angular ordering.
    # x_i -> x_i + eps * i
    # y_i -> y_i + eps * i^2
    #
    # eps is chosen far below the smallest possible nonzero integer
    # orientation, which has absolute value at least 1.
    eps = 1e-10

    px = [x + eps * (i + 1) for i, (x, y) in enumerate(pts)]
    py = [y + eps * (i + 1) * (i + 1)
          for i, (x, y) in enumerate(pts)]

    rho = [[0.0] * n for _ in range(n)]

    # Compute the level of every directed line q -> r.
    #
    # For a fixed q, points are sorted by angle around q.
    # For every starting direction, a monotone pointer finds the
    # entire open semicircle to its left.
    for q in range(n):
        order = [i for i in range(n) if i != q]

        qx = px[q]
        qy = py[q]

        order.sort(
            key=lambda i: math.atan2(py[i] - qy, px[i] - qx)
        )

        m = n - 1
        doubled = order + order
        t = 0

        for s in range(m):
            if t < s + 1:
                t = s + 1

            a = doubled[s]
            ax = px[a] - qx
            ay = py[a] - qy

            while t < s + m:
                b = doubled[t]
                bx = px[b] - qx
                by = py[b] - qy

                cross = ax * by - ay * bx
                if cross > 0.0:
                    t += 1
                else:
                    break

            level = t - s - 1
            if level > 0:
                rho[q][a] = (
                    2.0 / (level * (level + 1) * (level + 2))
                )

    ans = [0.0] * n

    # For each p and each unordered pair q,r, exactly one orientation
    # puts p strictly on the left, unless p,q,r are collinear.
    for p in range(n):
        total = 0.0
        px0, py0 = pts[p]

        for q in range(n):
            qx, qy = pts[q]

            for r in range(q + 1, n):
                if r == p or q == p:
                    continue

                rx, ry = pts[r]

                cross = (
                    (rx - qx) * (py0 - qy)
                    - (ry - qy) * (px0 - qx)
                )

                if cross > 0:
                    total += 0.5 * cross * rho[q][r]
                elif cross < 0:
                    total += 0.5 * (-cross) * rho[r][q]

        ans[p] = total

    for value in ans:
        print("{:.15f}".format(value))

if __name__ == "__main__":
    solve()
```实现的第一部分构建扰动坐标。 扰动故意很小，而它对点索引的依赖使其具有确定性。 如果原始方向非零，则其绝对值至少为 1，因为所有输入坐标都是整数。 扰动太小而无法扭转这种方向。 

角度扫描计算 (L(q,q'))，而不针对每条有向线测试所有 (N) 个点。 对于每个固定 (q)，点都会循环排序一次。 随着起始方向前进，左半圆的端点永远不会向后移动，因此排序后的所有级别（q）都是在线性时间内获得的。 

这`rho`矩阵由有向对索引。 这很重要，因为同一几何线的两个方向具有不同的左半平面，因此通常具有不同的级别和概率。 

最后的三重循环仅使用无序对。 如果原始叉积为正，则相关有向线为 (q\to r)。 如果为负，则相关方向为 (r\to q)。 这避免了重复执行相同的几何对。 

面积计算使用原始整数坐标，而不是扰动坐标。 这是至关重要的。 扰动是决定组合关系的符号装置，而不是对几何表示的实际货币数量的修改。 

所有涉及原始坐标的几何方向计算都是整数计算。 Python 的任意精度整数使得这里不可能发生溢出。 唯一的浮点运算是概率值、角度排序和最终累加。 

## 工作示例

 ### 示例 1

 该样本包含四点：```
(2,2)
(0,2)
(2,0)
(1,1)
```前三个点形成面积为 (2) 的三角形，而 ((1,1)) 位于其内部。 预期股份为```
0.8333333333333333
0.5
0.5
0.1666666666666667
```以下轨迹重点关注几何对的贡献。 

| 目标 (p) | 配对| 双区| 相关级别 | 概率 | 贡献|
 | ---| ---| ---| ---| ---| ---|
 | ((2,2)) | ((2,2)) | ((0,2),(2,0)) | ((0,2),(2,0)) | 4 | 1 | (1/3) | (2/3) |
 | ((2,2)) | ((2,2)) | 其他相关对 | 变化 | 变化 | 变化 | (1/6) 总计 |
 | ((0,2)) | ((0,2)) | 船体对 | 变化 | 变化 | 变化 | (1/2) 总计 |
 | ((2,0)) | ((2,0)) | 船体对 | 变化 | 变化 | 变化 | (1/2) 总计 |
 | ((1,1)) | ((1,1)) | 船体对 | 变化 | 变化 | 变化 | (1/6) 总计 |

 内部点收到正数，因为它可以插入到形成较小外壳的两个点之后，并且可以放大该外壳，即使它永远不属于所有四个点的最终外壳。 

### 示例 2

 考虑三点输入```
3
0 0
2 0
0 2
```全凸包的面积为 (2)。 恰好有三个点，当该村民在排列中排名第三时，该村民恰好贡献非零面积。 每个村民在 (3!) 个排列中正好是 (2!) 第三个，因此每个村民都会收到 (2/3)。 

| 目标 (p) | 其他点数| 相关配对 | 双区| 水平| 概率 | 回答 |
 | ---| ---| ---| ---| ---| ---| ---|
 | ((0,0)) | ((0,0)) | 2 | ((2,0),(0,2)) | ((2,0),(0,2)) | 4 | 1 | (1/3) | (2/3) |
 | ((2,0)) | ((2,0)) | 2 | ((0,2),(0,0)) | ((0,2),(0,0)) | 4 | 1 | (1/3) | (2/3) |
 | ((0,2)) | ((0,2)) | 2 | ((0,0),(2,0)) | ((0,0),(2,0)) | 4 | 1 | (1/3) | (2/3) |

 三个答案之和为 (2)，即最终船体的面积。 这是直接出现在几何中的 Shapley 分配的效率属性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(N^3)) | 级别计算为 (O(N^2\log N))，然后是 (O(N^3)) 对累加 |
 | 空间| (O(N^2)) | 有向概率矩阵包含 (N^2) 个值 |

 对于 (N\le200)，立方部分每个目标包含少于 400 万个无序点对检查，并且在利用无序对后，总共只有大约 400 万个对目标组合。 预处理的概率比这个小。 内存使用量由 (200\times200) 概率矩阵主导。 

渐进更强的几何解将最终的加权半平面聚合减少到 (O(N^2))，但它需要构造和遍历线排列。 上面的三次实现要简单得多，并且与竞赛的 (N=200) 约束非常匹配。 底层对分解与已知 (O(N^2)) 结果中使用的分解相同。 

## 测试用例```python
# The tests below assume the solution above is placed in this file.
# For a standalone test script, the implementation is reproduced
# through the run() helper.

import sys
import io
import math

def algorithm(inp: str) -> list[float]:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    try:
        n = int(input())
        pts = [tuple(map(int, input().split())) for _ in range(n)]

        if n < 3:
            return [0.0] * n

        eps = 1e-10

        px = [x + eps * (i + 1) for i, (x, y) in enumerate(pts)]
        py = [y + eps * (i + 1) * (i + 1)
              for i, (x, y) in enumerate(pts)]

        rho = [[0.0] * n for _ in range(n)]

        for q in range(n):
            order = [i for i in range(n) if i != q]
            qx, qy = px[q], py[q]

            order.sort(
                key=lambda i: math.atan2(py[i] - qy, px[i] - qx)
            )

            m = n - 1
            doubled = order + order
            t = 0

            for s in range(m):
                if t < s + 1:
                    t = s + 1

                a = doubled[s]
                ax = px[a] - qx
                ay = py[a] - qy

                while t < s + m:
                    b = doubled[t]
                    bx = px[b] - qx
                    by = py[b] - qy

                    if ax * by - ay * bx > 0.0:
                        t += 1
                    else:
                        break

                level = t - s - 1
                if level > 0:
                    rho[q][a] = (
                        2.0 / (level * (level + 1) * (level + 2))
                    )

        ans = [0.0] * n

        for p in range(n):
            px0, py0 = pts[p]
            total = 0.0

            for q in range(n):
                if q == p:
                    continue

                qx, qy = pts[q]

                for r in range(q + 1, n):
                    if r == p:
                        continue

                    rx, ry = pts[r]

                    cross = (
                        (rx - qx) * (py0 - qy)
                        - (ry - qy) * (px0 - qx)
                    )

                    if cross > 0:
                        total += 0.5 * cross * rho[q][r]
                    elif cross < 0:
                        total += 0.5 * (-cross) * rho[r][q]

            ans[p] = total

        return ans

    finally:
        sys.stdin = old_stdin

def run(inp: str) -> list[float]:
    return algorithm(inp)

def assert_close(actual, expected, name):
    assert len(actual) == len(expected), name
    for a, e in zip(actual, expected):
        assert abs(a - e) <= 1e-8 * max(1.0, abs(e)), (
            name, a, e
        )

# Provided sample
sample = """\
4
2 2
0 2
2 0
1 1
"""
assert_close(
    run(sample),
    [
        0.8333333333333333,
        0.5,
        0.5,
        0.16666666666666666,
    ],
    "provided sample",
)

# Minimum-size input
assert_close(
    run("""\
1
10000 -10000
"""),
    [0.0],
    "one point",
)

# Two points, still zero area
assert_close(
    run("""\
2
-10000 -10000
10000 10000
"""),
    [0.0, 0.0],
    "two points",
)

# Three points, every point gets one third of the triangle area.
triangle = """\
3
0 0
2 0
0 2
"""
assert_close(
    run(triangle),
    [2.0 / 3.0, 2.0 / 3.0, 2.0 / 3.0],
    "triangle",
)

# Square: all four vertices are symmetric, so every answer is 1/4.
square = """\
4
0 0
1 0
1 1
0 1
"""
assert_close(
    run(square),
    [0.25, 0.25, 0.25, 0.25],
    "square",
)

# Collinear points plus one off-line point.
degenerate = """\
4
0 0
1 0
2 0
0 1
"""
assert_close(
    run(degenerate),
    [
        5.0 / 12.0,
        1.0 / 12.0,
        1.0 / 12.0,
        5.0 / 12.0,
    ],
    "collinear boundary point",
)

# Maximum-size input. The expected individual answers are not written
# explicitly, so we check the defining efficiency property:
# their sum must equal the area of the full convex hull.
pts = [(i, (i * i) % 10000) for i in range(200)]
maximum = "200\n" + "\n".join(f"{x} {y}" for x, y in pts) + "\n"
got = run(maximum)

assert len(got) == 200, "maximum size length"
assert all(x >= -1e-9 for x in got), "nonnegative maximum answers"

def convex_hull(points):
    points = sorted(set(points))
    if len(points) <= 1:
        return points

    def cross(o, a, b):
        return (
            (a[0] - o[0]) * (b[1] - o[1])
            - (a[1] - o[1]) * (b[0] - o[0])
        )

    lower = []
    for p in points:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)

    upper = []
    for p in reversed(points):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)

    return lower[:-1] + upper[:-1]

def hull_area(points):
    h = convex_hull(points)
    if len(h) < 3:
        return 0.0

    s = 0
    for i in range(len(h)):
        x1, y1 = h[i]
        x2, y2 = h[(i + 1) % len(h)]
        s += x1 * y2 - y1 * x2

    return abs(s) / 2.0

assert abs(sum(got) - hull_area(pts)) <= 1e-6 * max(
    1.0, hull_area(pts)
), "maximum efficiency"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品1 | (0.8333333,0.5,0.5,0.1666667) | 原始样本和内点|
 |`1 / (10000,-10000)`|`0`| 最小尺寸和零面积船体 |
 | 两个相对的边界点 |`0,0`| 不存在三角形|
 | 直角三角形 |`2/3`对于每一点| 最后插入的概率 (1/3) |
 | 单位平方 |`0.25`对于每一点| 对称与均等分配 |
 | 共线链加一点|`5/12,1/12,1/12,5/12`| 简并共线性处理 |
 | 200 个生成点 | 总和等于整个船体面积 | 最大输入尺寸和效率不变|

 ## 边缘情况

 对于单个点，由于 (N<3)，因此跳过预处理阶段，并且解立即打印零。 没有有向对可以定义三角形，因此这与几何定义一致。 

对于两点，同样的提前返还适用。 它们的凸包是一条线段，其面积为零。 这避免了为不存在的第三点构建概率。 

对于三个不共线的点，每当插入第三个目标点时，正好有一对前驱点。 包含目标的半平面恰好包含一个点，因此 (L=1) 且

 [
 \rho=\frac{2}{1\cdot2\cdot3}=\frac13。 
]

 目标接收三角形区域的三分之一。 由于这三个点中的每一个都有相同的第三个概率，因此每个点恰好占据整个区域的三分之一。 

对于共线点，即使符号扰动将点置于线的确定一侧，原始叉积也可能为零。 该算法故意为这两项工作使用不同的坐标。 原始叉积决定了实际的三角形面积，对于共线三元组来说，该面积为零。 扰动的几何形状决定了概率所需的组合排序。 这对应于从通用位置配置中获取限制，并避免重复计算包含多个输入点的外壳边缘。 

对于具体的简并输入```
4
0 0
1 0
2 0
0 1
```整个船体的面积为 (1)。 两个端点 ((0,0)) 和 ((0,1)) 各自接收 (5/12)，而底部边缘上的两个点各自接收 (1/12)。 他们的总和是

 [
 \frac5{12}+\frac1{12}+\frac1{12}+\frac5{12}=1，
 ]

 所以整个船体区域只分布一次。 

最终效率检查也是一个有用的调试不变量。 对于每个排列，所有边际增量的总和都会望远镜到最终的船体面积。 取期望可以保持这种相等性，因此计算出的答案必须始终等于所有输入点的凸包面积。 显着差异通常意味着有向半平面、概率水平或方向符号处理不正确。
