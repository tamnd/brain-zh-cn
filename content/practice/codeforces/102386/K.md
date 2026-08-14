---
title: "CF 102386K-\u041c\u0430\u043b\u044b\u0448\u0438\u041a\u0430\u0440\u043b\u0441\u043e\u043d"
description: "我们有一个严格的凸多边形，其顶点是整数格点并且逆时针列出。 我们需要一条直线将多边形分成面积完全相同的两个区域。"
date: "2026-08-14T13:42:47+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102386
codeforces_index: "K"
codeforces_contest_name: "\u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0439 \u0442\u0443\u0440 \u0423\u0440\u0430\u043b\u044c\u0441\u043a\u043e\u0433\u043e \u0447\u0435\u0442\u0432\u0435\u0440\u0442\u044c\u0444\u0438\u043d\u0430\u043b\u0430 \u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442\u0430 \u043c\u0438\u0440\u0430 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e 2019"
rating: 0
weight: 102386
solve_time_s: 246
verified: false
draft: false
---

[CF 102386K - \u041c\u0430\u043b\u044b\u0448\u0438\u041a\u0430\u0440\u043b\u0441\u043e\u043d](https://codeforces.com/problemset/problem/102386/K)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 6s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个严格的凸多边形，其顶点是整数格点并且逆时针列出。 我们需要一条直线将多边形分成面积完全相同的两个区域。 该线本身必须包含两个不同的整数格点，因此等效地我们需要一条具有有理斜率和有理截距的面积平分线。 

关键的几何自由度是我们可以选择任何线，不一定是穿过多边形顶点的线。 然而，选择一个特定的顶点会给我们一个更强大的结构。 修复第一个顶点 (V_0)。 当点 (P) 沿多边形边界从 (V_1) 向 (V_{n-1}) 移动时，线 (V_0P) 会扫过边界上一个端点为 (V_0) 的所有可能的切口。 对于每个边界位置 (P)，(V_0P) 一侧的面积从零连续变化到整个多边形面积。 由于多边形是凸多边形，因此恰好有一个这样的 (P) 就可以得到一半的面积。 

输入最多有 (1000) 个顶点，每个坐标最多有 (10^5) 个绝对值。 在此极限下，直接 (O(n^2)) 解决方案在数值上已经很小，大约有一百万个基本几何运算，但该结构允许 (O(n)) 构造。 坐标界限还使得精确的整数算术变得实用。 两个坐标差的叉积最多约为 (8\cdot10^{10})，并且最多 (1000) 个三角形的总和低于 (10^{14})。 Python 整数在这里不存在溢出问题，而即使是带符号的 64 位算术也足以进行面积计算。 

有几种边缘情况可能会悄悄破坏浮点实现。 首先，所需的切割可以精确地穿过另一个多边形顶点。 例如，```
4
0 0
4 0
4 2
0 2
```有面积(8)，从((0,0))到((4,2))的对角线将其分为(4)的两个区域。 涉及浮点参数的比较可能会意外地将端点放入下一个边沿。 精确的整数比较可以避免这种情况。 

另一种情况是半面积点严格位于边内。 该样本对于直通 (y=4) 具有完全相同的行为。 该线不通过多边形顶点，但与右垂直边的交点是整数点。 更一般地说，交集仅保证是有理数，而不是整数。 我们必须为整条线构造一个整数方向，而不是要求交点本身是一个整数点。 

最后，加倍的总面积可能是奇数。 在示例中，加倍面积为 (15)，因此一半为 (15/2)。 仅基于整数面积的解决方案会错误地得出精确切割是不可能的结论。 切割点可以简单地具有有理坐标，并且所得到的线在缩放之后仍然具有整数方向。 

## 方法

 自然的强力构造首先选择多边形顶点 (V_i) 作为切割线的固定端点。 然后，我们可以绕着剩余的边界走动，确定半区域交点位于哪条边上，并求解沿该边的位置。 如果对每个 (V_i) 独立重复整个搜索，则需要 (O(n^2)) 时间。 对于 (n=1000)，这大约是 (10^6) 次边缘检查，因此它实际上并未被给定的约束排除，但它多次重复完全相同的几何工作。 

有用的观察是我们不需要尝试每个顶点。 选择（V_0）一次。 多边形可以分成三角形

 [
 (V_0,V_1,V_2),\quad
 (V_0,V_2,V_3),\quad\ldots,\quad
 (V_0,V_{n-2},V_{n-1})。 
]

 由于多边形是严格凸且逆时针的，因此所有这些三角形的面积均为正，它们的面积加起来等于多边形的面积。 

假设所需的半面积点位于边缘 (V_iV_{i+1}) 上。 由 (V_0)、边界链 (V_0,V_1,\ldots,V_i,P) 和线段 (PV_0) 界定的区域由所有前面的扇形三角形加上三角形 (V_0V_iP) 组成。 沿着边 (V_iV_{i+1})，后一个三角形的面积在 (P) 的位置呈线性。 因此，一旦我们知道包含目标的边缘，(P) 的确切位置就是该边缘的有理分数。 

最后一步是使格子要求变得简单的部分。 写

 [
 P=V_i+\frac pq(V_{i+1}-V_i)。 
]

 然后

 (q-p)(V_i-V_0)+p(V_{i+1}-V_0)。 
]

 右侧的向量具有整数坐标。 它是所需直线的方向向量，因此(V_0)和(V_0+D)是切割线上的两个整数点。 根本不需要使用浮点坐标来构造 (P)。 

这也证明了在问题的保证下总是存在有效的答案。 对于有效输入，永远不会达到 (-1) 输出情况。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 尝试每个顶点并扫描边界 | (O(n^2)) | (O(n)) | (O(n)) | 已接受 (n\le1000)，但没有必要 |
 | 固定一个顶点并扫描一次扇形 | (O(n)) | (O(n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 选择(V_0)作为切割线的固定顶点。 由于多边形是凸多边形，因此从 (V_0) 到相对边界上的点的每条线都会切断一个明确定义的区域，该区域的面积从零连续增长到完整的多边形面积。 
2. 使用 (V_0) 中的扇形计算多边形的双倍面积 (S)。 对于每个 (i=1,\ldots,n-2)，计算

 [
 T_i=\算子名{cross}(V_i-V_0,V_{i+1}-V_0)。 
]

 所有的总和 (T_i) 恰好是多边形面积 (S) 的两倍。 

1. 穿过扇形三角形，同时保持`prefix`，当前边 (V_iV_{i+1}) 之前所有完整三角形的面积加倍。 半区目标是(S/2)。 为了避免分数，请测试

 [
 2\cdot前缀\le S\le2(前缀+T_i)。 
]

 满足此条件的第一条边包含所需的边界点 (P)。 凸面和正三角形区域保证只需要一条边，除了共享顶点处无害的相等性之外。 

1. 让

 [
 r=S-2\cdot 前缀。 
]

 这是三角形 (V_0V_iV_{i+1}) 内仍需要的两倍面积的两倍。 如果 (P) 除以 (V_iV_{i+1}) 的比率 (p)，则

 [
 \frac pq=\frac{r}{2T_i}。 
]

 将这个分数除以其最大公约数。 我们始终使用整数，因此即使是奇数 (S) 也不会导致特殊情况。 

1. 定义

 [
 a=V_i-V_0,\qquad b=V_{i+1}-V_0。 
]

 从 (V_0) 到 (P) 的向量乘以 (q) 为

 [
 D=(q-p)a+pb。 
]

 (a)和(b)都是整数向量，因此(D)是整数向量。 由于 (P) 位于多边形边界上且切口两侧面积均为正，因此 (D) 不能为零。 

1. 输出（V_0）和（V_0+D）。 它们是同一面积平分线上的不同整数点。 

构造背后的不变性是`prefix`始终等于已被线 (V_0P) 扫除的部分面积的两倍。 每个下一个扇形三角形都会增加一个正数，因此最终目标 (S/2) 恰好位于一个三角形内。 在该三角形内，面积与 (P) 的位置线性相关，这给出了用于构造整数方向向量的精确有理参数。 

## Python 解决方案```python
import sys
from math import gcd

input = sys.stdin.readline

def cross(ax, ay, bx, by):
    return ax * by - ay * bx

def solve():
    n = int(input())
    p = [tuple(map(int, input().split())) for _ in range(n)]

    x0, y0 = p[0]

    triangles = []
    total = 0

    for i in range(1, n - 1):
        xi, yi = p[i]
        xj, yj = p[i + 1]

        ax = xi - x0
        ay = yi - y0
        bx = xj - x0
        by = yj - y0

        t = cross(ax, ay, bx, by)
        triangles.append(t)
        total += t

    prefix = 0

    for i in range(1, n - 1):
        t = triangles[i - 1]

        if 2 * prefix <= total <= 2 * (prefix + t):
            r = total - 2 * prefix
            den = 2 * t

            g = gcd(r, den)
            num = r // g
            den //= g

            xi, yi = p[i]
            xj, yj = p[i + 1]

            ax = xi - x0
            ay = yi - y0
            bx = xj - x0
            by = yj - y0

            dx = (den - num) * ax + num * bx
            dy = (den - num) * ay + num * by

            print(x0, y0)
            print(x0 + dx, y0 + dy)
            return

        prefix += t

if __name__ == "__main__":
    solve()
```第一个循环计算所有扇形三角形面积。 使用相对于 (V_0) 的向量可以避免编写完整的鞋带公式，并使后续的方向构造使用完全相同的量。 

第二个循环搜索目标三角形。 比较故意写成`2 * prefix <= total <= 2 * (prefix + t)`。 这可以处理偶数和奇数总加倍区域，并且不会将任何内容转换为`float`。 

一旦找到目标边缘，`r / den`是描述半面积点沿该边的位置的分数 (p/q)。`gcd`不需要正确性，但减少分数可以使结果方向向量更小。 

表达式```
dx = (den - num) * ax + num * bx
```是整数形式

 [
 q(P-V_0)=(q-p)(V_i-V_0)+p(V_{i+1}-V_0)。 
]

 输出点可以比原始多边形远得多，这是允许的。 它的大小仍然安全地低于 (10^{18})。 原始多边形中的每个坐标差最多为 (2\cdot10^5)，每个扇形三角形的面积最多为两倍 (8\cdot10^{10})，缩放后得到的方向坐标仍远低于 (10^{18})。 

实现永远不会打印`-1`，因为该构造证明对于满足输入保证的每个多边形都存在有效的格子线。 

## 工作示例

 对于提供的示例，多边形是```
(0,3), (3,0), (3,6), (0,7)
```(V_0=(0,3)) 的扇形有两个三角形。 

| 边缘|`prefix`|`t`|`total`| 目标条件|`r / (2t)`|
 | --- | --- | --- | --- | --- | --- |
 | (V_1V_2) | 0 | 18 | 18 30| (0\le30\le36) | (30/36=5/6) |

 目标位于 (V_1V_2)。 因此(p=5)，(q=6)。 相对于(V_0)，

 [
 V_1-V_0=(3,-3),
 \qquad
 V_2-V_0=(3,3)。 
]

 整数方向为

 [
 (6-5)(3,-3)+5(3,3)=(18,12)。 
]

 程序可以因此输出```
0 3
18 15
```该线有斜率 (12/18=2/3)。 样本行 (y=4) 是另一个有效答案，因此预计会出现不同的正确输出。 

作为第二个例子，考虑一个直角三角形。```
3
0 0
4 0
0 4
```只有一个扇形三角形。 

| 边缘|`prefix`|`t`|`total`|`r`| 约简分数 |
 | --- | --- | --- | --- | --- | --- |
 | (V_1V_2) | 0 | 16 | 16 16 | 16 16 | 16 (1/2) |

 半区点是(V_1V_2)的中点，因此切割线从((0,0))到((2,2))。 方向公式给出

 [
 (2-1)(4,0)+1(0,4)=(4,4)。 
]

 因此程序输出```
0 0
4 4
```直线 (y=x) 将三角形分成两个全等的三角形。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n)) | (O(n)) | 一次通过计算扇形区域，一次通过定位目标边缘 |
 | 空间| (O(n)) | (O(n)) | 顶点和扇形三角形面积被存储 |

 线性解很容易拟合 (n\le1000)。 主要运算是整数加法、乘法、比较和一次 gcd 计算。 所有几何决策都是精确的，因此解决方案不依赖于数值精度。 

## 测试用例

 下面的测试工具以精确的方式检查生产线的几何形状`Fraction`算术。 这很有用，因为答案不是唯一的，因此将输出与一对特定的点进行比较会错误地拒绝许多正确的解决方案。```python
import sys
import io
from fractions import Fraction
from math import gcd, atan2

def solve_text(inp: str) -> str:
    data = inp.strip().split()
    it = iter(data)

    n = int(next(it))
    p = [(int(next(it)), int(next(it))) for _ in range(n)]

    x0, y0 = p[0]

    triangles = []
    total = 0

    for i in range(1, n - 1):
        xi, yi = p[i]
        xj, yj = p[i + 1]

        ax = xi - x0
        ay = yi - y0
        bx = xj - x0
        by = yj - y0

        t = ax * by - ay * bx
        triangles.append(t)
        total += t

    prefix = 0

    for i in range(1, n - 1):
        t = triangles[i - 1]

        if 2 * prefix <= total <= 2 * (prefix + t):
            r = total - 2 * prefix
            den = 2 * t

            g = gcd(r, den)
            num = r // g
            den //= g

            xi, yi = p[i]
            xj, yj = p[i + 1]

            ax = xi - x0
            ay = yi - y0
            bx = xj - x0
            by = yj - y0

            dx = (den - num) * ax + num * bx
            dy = (den - num) * ay + num * by

            return f"{x0} {y0}\n{x0 + dx} {y0 + dy}\n"

        prefix += t

    return "-1\n"

def polygon_area2(poly):
    s = 0
    n = len(poly)
    for i in range(n):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % n]
        s += x1 * y2 - y1 * x2
    return s

def clip_halfplane(poly, A, B, keep_positive):
    ax, ay = A
    bx, by = B
    dx = bx - ax
    dy = by - ay

    def side(P):
        px, py = P
        return dx * (py - ay) - dy * (px - ax)

    result = []

    for i in range(len(poly)):
        P = poly[i]
        Q = poly[(i + 1) % len(poly)]

        fP = side(P)
        fQ = side(Q)

        inP = fP >= 0 if keep_positive else fP <= 0
        inQ = fQ >= 0 if keep_positive else fQ <= 0

        if inP:
            result.append(P)

        if inP != inQ:
            t = Fraction(fP, fP - fQ)
            x = P[0] + t * (Q[0] - P[0])
            y = P[1] + t * (Q[1] - P[1])
            result.append((x, y))

    return result

def area2_fraction(poly):
    if len(poly) < 3:
        return Fraction(0)

    s = Fraction(0)
    for i in range(len(poly)):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % len(poly)]
        s += x1 * y2 - y1 * x2
    return abs(s)

def valid_answer(inp: str, out: str) -> bool:
    data = inp.strip().split()
    n = int(data[0])
    poly = []
    pos = 1

    for _ in range(n):
        poly.append((int(data[pos]), int(data[pos + 1])))
        pos += 2

    ans = out.strip().split()
    if len(ans) != 4:
        return False

    A = (int(ans[0]), int(ans[1]))
    B = (int(ans[2]), int(ans[3]))

    if A == B:
        return False

    if any(abs(v) > 10**18 for v in A + B):
        return False

    total = Fraction(abs(polygon_area2(poly)))

    positive = clip_halfplane(poly, A, B, True)
    negative = clip_halfplane(poly, A, B, False)

    ap = area2_fraction(positive)
    an = area2_fraction(negative)

    return ap * 2 == total or an * 2 == total

def make_max_polygon():
    vectors = []

    for x in range(1, 51):
        for y in range(0, 51):
            if x == 0 and y == 0:
                continue
            if gcd(x, y) == 1:
                vectors.append((x, y))

    vectors.sort(key=lambda v: atan2(v[1], v[0]))
    vectors = vectors[:500]

    edges = vectors[:]

    for x, y in vectors:
        edges.append((-x, -y))

    poly = []
    x = 0
    y = 0

    for dx, dy in edges:
        poly.append((x, y))
        x += dx
        y += dy

    min_x = min(x for x, y in poly)
    max_x = max(x for x, y in poly)
    min_y = min(y for x, y in poly)
    max_y = max(y for x, y in poly)

    shift_x = -(min_x + max_x) // 2
    shift_y = -(min_y + max_y) // 2

    return [(x + shift_x, y + shift_y) for x, y in poly]

sample1 = """\
4
0 3
3 0
3 6
0 7
"""

assert valid_answer(sample1, solve_text(sample1)), "sample 1"

triangle = """\
3
0 0
4 0
0 4
"""

assert valid_answer(triangle, solve_text(triangle)), "minimum-size triangle"

half_vertex = """\
4
0 0
4 0
4 2
0 2
"""

assert valid_answer(half_vertex, solve_text(half_vertex)), "half-area at a vertex"

boundary_coordinates = """\
3
-100000 -100000
100000 -100000
0 100000
"""

assert valid_answer(
    boundary_coordinates,
    solve_text(boundary_coordinates)
), "boundary coordinates"

max_poly = make_max_polygon()
assert len(max_poly) == 1000
assert max(abs(x) <= 10**5 and abs(y) <= 10**5 for x, y in max_poly)

max_input = str(len(max_poly)) + "\n"
max_input += "\n".join(f"{x} {y}" for x, y in max_poly) + "\n"

assert valid_answer(max_input, solve_text(max_input)), "maximum-size polygon"

# A polygon with all coordinates equal cannot satisfy the input guarantees:
# three distinct vertices would be impossible. Such a test is intentionally
# excluded because it is not a valid instance of the problem.
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 提供样品| 任何精确的半区域线，例如程序的输出 | 严格在边内的有理相交 |
 | (3)-顶点直角三角形 | 穿过两个整数点的线平分三角形 | 最小有效多边形 |
 | (4\times2) 矩形 | 通过相反顶点的对角线| 半区域目标恰好位于扇形三角形边界 |
 | 使用 (\pm10^5) 坐标的三角形 | (10^{18}) 输出范围内的任何有效整数行 | 边界坐标算术 |
 | 生成 (1000) 顶点多边形 | 任何有效的整数行 | 最大（n）和线性扫描|
 | 所有坐标都相等 | 不存在有效输入 | 确认为什么这不能成为合法的测试用例 |

 ## 边缘情况

 当半面积点恰好是多边形顶点时，目标可以由两个连续的扇形三角形共享。 为了```
4
0 0
4 0
4 2
0 2
```第一个扇形三角形的面积 (8) 加倍，而整个多边形的面积 (16) 加倍。 恰好在 (V_2=(4,2)) 处达到目标。 整数比较接受相等的第一条边，给出方向 (V_2-V_0=(4,2))。 不涉及 epsilon。 

当半面积点严格位于边内时，该参数是有理数。 在示例中，第一个扇形三角形的面积增加了一倍 (18)，而总数为 (30)。 所需的分数是

 [
 \frac{30}{36}=\frac56。 
]

 因此该点是有理的，但缩放方向

 [
 (6-5)(3,-3)+5(3,3)=(18,12)
 ]

 是不可或缺的。 因此，输出线包含两个整数点，即使其边界交点不需要是整数点。 

当加倍总面积为奇数时，算法仍然有效。 如果 (S=15)，则目标为 (7.5)（以双倍面积单位表示）。 比较将所有内容乘以 2，因此它会搜索

 [
 2\cdot 前缀\le15\le2(前缀+T_i)。 
]

 结果分子是奇数，但是`gcd`通常约简有理分数。 不需要关于多边形区域的奇偶性假设。 

当坐标接近输入限制时，所有计算都保持准确。 多边形坐标的差异最多为 (2\cdot10^5)，单个扇形三角形的面积最多为两倍 (8\cdot10^{10})。 即使在缩放有理方向之后，输出坐标仍保持在 (10^{18}) 以下。 Python 的任意精度整数使算术变得简单。 

所有顶点相等或三个共线顶点的简并输入将使构造所使用的几何假设无效。 此类输入被问题明确排除，因此算法不需要对它们进行防御性处理。
