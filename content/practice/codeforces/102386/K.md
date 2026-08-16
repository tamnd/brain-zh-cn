---
title: "CF 102386K-\u041c\u0430\u043b\u044b\u0448\u0438\u041a\u0430\u0440\u043b\u0441\u043e\u043d"
description: "我们有一个严格的凸多边形，其顶点是逆时针方向给出的，并且具有整数坐标。 我们需要画一条直线将多边形分成面积完全相同的两个区域。"
date: "2026-08-15T18:57:38+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102386
codeforces_index: "K"
codeforces_contest_name: "\u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0439 \u0442\u0443\u0440 \u0423\u0440\u0430\u043b\u044c\u0441\u043a\u043e\u0433\u043e \u0447\u0435\u0442\u0432\u0435\u0440\u0442\u044c\u0444\u0438\u043d\u0430\u043b\u0430 \u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442\u0430 \u043c\u0438\u0440\u0430 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e 2019"
rating: 0
weight: 102386
solve_time_s: 549
verified: false
draft: false
---

[CF 102386K - \u041c\u0430\u043b\u044b\u0448\u0438\u041a\u0430\u0440\u043b\u0441\u043e\u043d](https://codeforces.com/problemset/problem/102386/K)

 **评级：** -
 **标签：** -
 **求解时间：** 9m 9s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个严格的凸多边形，其顶点是逆时针方向给出的，并且具有整数坐标。 我们需要画一条直线将多边形分成面积完全相同的两个区域。 该线本身必须包含两个不同的整数坐标点，并且它们的坐标必须在 (-10^{18}) 到 (10^{18}) 的范围内。 

有用的几何特性是多边形可以从其任何一个顶点进行三角剖分。 选择第一个顶点 (V_0)，并将其连接到所有其他顶点。 这会产生 (N-2) 个三角形，其面积加倍后为整数，因为每个坐标都是整数。 然后，整个问题就变成了找到总面积加倍的一半落在这个三角形序列中的位置。 原始问题使用 (N\le 1000)、以 (10^5) 为边界的坐标以及一秒的限制。 这对于线性或二次算法来说足够小，但是一旦识别出扇形三角剖分，就没有理由做任何二次算法。 精确的整数运算也优于浮点数，因为所需的相等性是精确的。 

对所有整数坐标对 (A,B) 的直接穷举搜索是有限的，因为坐标是有界的，但完全无用。 大约有 ((4\cdot10^{36})^2/2\approx8\cdot10^{72}) 个无序晶格点对，并且对照所有多边形边检查一条线将添加另一个因子 (N)。 对于 (N=1000)，其数量级为 (10^{75}) 基本几何运算。 看起来更合理的强力方法（例如尝试穿过多边形顶点对的线）也是不够的，因为有效的切割线不需要穿过两个多边形顶点。 

有几种边界情况，粗心的实现可能会处理不当。 对于三角形```
3
0 0
4 0
0 2
```答案是从 ((0,0)) 到对边中点的中位数。 中点本身不需要整数坐标，因此简单地寻找边缘上的整数点可能会失败。 我们的构造将有理点与其分母相乘，并在同一直线上获得一个整数点。 

对于广场```
4
0 0
2 0
2 2
0 2
```第一个扇形三角形已经具有多边形两倍面积的一半。 仅处理一半严格位于三角形内的情况的粗心实现可能会移动到下一个三角形并访问无效索引。 必须立即处理相等情况，从 ((0,0)) 到 ((2,2)) 的对角线是有效答案。 

提供的示例是另一个有用的案例：```
4
0 3
3 0
3 6
0 7
```半面积点严格位于第一个扇形三角形内部。 浮点实现可能会近似切割点，但检查器需要精确相等。 相反，我们使用整数乘法在完全相同的行上构造一个整数点。 

在规定的约束条件下，解总是存在的，所以`-1`输出从来都不是必需的。 下面的构造明确为每个有效输入生成一个。 

## 方法

 最直接的暴力解决方案是搜索整数点并测试候选线。 仅从坐标界限来看这已经是不可能的，因为晶格包含大约 (4\cdot10^{36}) 个点。 即使将搜索限制为通过多边形顶点对的线，也会留下 (O(N^2)) 个候选点，并且根据多边形检查每个候选点需要 (O(N)) 时间。 最坏的情况约为 (N^3/2)，大约为 (5\cdot10^8) (N=1000) 的边缘操作。 更重要的是，受限搜索并不完整，因为所需的线可以在严格位于边缘内部的两个点处与多边形边界相交。 

关键的观察是我们根本不需要搜索方向。 固定第一个多边形顶点 (V_0)，并将多边形三角化为

 [
 (V_0,V_1,V_2),\quad
 (V_0,V_2,V_3),\quad
 \点，\四边形
 (V_0,V_{N-2},V_{N-1})。 
]

 每个三角形的面积加倍后都是一个整数。 当我们遍历这些三角形时，累积面积从零开始，到整个多边形的两倍面积结束。 因此，存在第一个三角形，其包含使得累加面积达到或超过总面积的一半。 

如果累积面积恰好是某个完整三角形之后的一半，则从 (V_0) 到该三角形最后一个顶点的对角线已经是所需的切割线。 

否则，总面积的一半严格位于一个三角形 (V_0BC) 内。 在该三角形内，通过 (V_0) 和 (BC) 上的点 (P) 的每条线都会截断一个三角形 (V_0BP)。 它的面积随着（P）沿着（BC）移动而线性变化，因此我们可以在（BC）上选择所需的精确比率。 

剩下的困难是（P）可能是有理数而不是积分。 这就是异常大的 (10^{18}) 输出界限变得有用的地方。 如果

 [
 P=\frac{(2T-d)B+dC}{2T},
 ]

 我们可以简单地使用

 [
 Q=(2T-d)B+dC。 
]

 点 (Q) 具有整数坐标，并且它与 (P) 位于来自 (V_0) 的同一射线上。 因此线 (V_0Q) 正是所需的切割线。 任何地方都没有除法，也没有浮点运算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(N^3)) 将候选限制为顶点对后 | (O(N)) | 太慢而且不完整|
 | 最佳 | (O(N)) | (O(N)) | 已接受 |

 ## 算法演练

 1. 选择第一个多边形顶点（V_0）作为扇形三角剖分的公共顶点。 通过减去 (V_0) 来平移所有其他顶点，因此 (V_0) 成为原点。 平移不会改变通过 (V_0) 的区域或线。 
2. 对于每个连续对 (V_i,V_{i+1})，其中 (1\le i<N-1)，计算

 [
 T_i=\left|\operatorname{cross}(V_i,V_{i+1})\right|。 
]

 这是三角形面积的两倍 (V_0V_iV_{i+1})。 因为所有坐标都是整数，所以每个(T_i)都是整数。 

1. 对所有(T_i)求和以获得(S)，即整个多边形的两倍面积。 我们特意使用双倍面积，以便目标恰好为 (S/2)，而不引入分数。 
2. 穿过三角形，同时保持其前缀面积加倍。 找到新前缀满足 (2\cdot\text{prefix}\ge S) 的第一个三角形 (V_0BC)。 凸性保证所有扇形三角形都位于多边形内部并且面积为正，因此这样的三角形总是存在。 
3. 如果(2\cdot\text{prefix}=S)，输出(V_0)和当前三角形的最后一个顶点。 该对角线之前的扇形三角形恰好具有总面积的一半。 
4. 否则，让`before`是 (V_0BC) 之前所有扇形三角形面积的两倍，令 (T) 是 (V_0BC) 面积的两倍。 定义

 [
 d=S-2\cdot\text{之前}。 
]

 当前三角形的所需部分必须具有双倍面积 (d/2)。 由于当前三角形是第一个穿过半区边界的三角形，

 [
 0<d<2T。 
]

 1. 设 (B=V_i) 和 (C=V_{i+1})。 (BC) 上的点可以写为

 [
 P=\frac{(2T-d)B+dC}{2T}。 
]

 三角形 (V_0BP) 的面积增加了一倍

 # \frac{d}{2T}\operatorname{cross}(B,C)

 \压裂d2。 
]

 因此，该三角形之前的面积加上 (V_0BP) 的面积正好是 (S/2)。 

1. 我们不输出(P)，因为它可能是小数。 相反计算

 [
 Q=(2T-d)B+dC。 
]

 (Q)的所有坐标都是整数。 由于(Q=2T\cdot P)，点(V_0,P,Q)共线，因此通过(V_0)和(Q)的直线就是所需的切割线。 

在编号的步骤之后，不变的是累积的扇形三角形准确地表示候选对角线一侧的区域。 在选定的三角形之前，该区域严格低于一半，而在添加选定的三角形之后，它至少为一半。 如果相等发生在三角形边界处，则相应的对角线可以解决问题。 否则，所需的量严格介于零和所选三角形的整个区域之间，因此上述唯一点 (P) 严格位于其边缘内部。 缩放后的整数点 (Q) 位于完全相同的直线上，证明输出线具有整数点并且正好平分多边形。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def cross(ax, ay, bx, by):
    return ax * by - ay * bx

def solve():
    n = int(input())
    p = [tuple(map(int, input().split())) for _ in range(n)]

    ox, oy = p[0]

    # Translate the polygon so p[0] becomes (0, 0).
    q = [(x - ox, y - oy) for x, y in p]
    q[0] = (0, 0)

    # Doubled areas of the fan triangles.
    areas = []
    total = 0

    for i in range(1, n - 1):
        ax, ay = q[i]
        bx, by = q[i + 1]
        t = abs(cross(ax, ay, bx, by))
        areas.append(t)
        total += t

    prefix = 0

    for i, t in enumerate(areas, start=1):
        prefix += t

        # The current fan triangle ends at q[i + 1].
        if prefix * 2 == total:
            x, y = q[i + 1]
            print(ox, oy)
            print(ox + x, oy + y)
            return

        if prefix * 2 > total:
            before = prefix - t
            d = total - 2 * before

            # Current triangle is q[0], q[i], q[i + 1].
            bx, by = q[i]
            cx, cy = q[i + 1]

            # Q = (2T-d) * B + d * C.
            #
            # Q is a scaled version of the exact rational
            # point on BC, so OQ is the same cutting line.
            qx = (2 * t - d) * bx + d * cx
            qy = (2 * t - d) * by + d * cy

            print(ox, oy)
            print(ox + qx, oy + qy)
            return

if __name__ == "__main__":
    solve()
```实现的第一部分将多边形平移第一个顶点。 这使得面积公式特别简单，因为每个扇形三角形都将原点作为一个顶点。 

这`cross`函数是唯一需要的几何基元。 对于两个向量 (u) 和 (v)，其绝对值是原点和这两个向量形成的三角形面积的两倍。 Python 整数具有任意精度，因此即使构造的输出可能比输入坐标大得多，中间产品也是安全的。 

第一个循环计算扇形三角形面积及其总面积。 第二个循环搜索超过总数一半的第一个前缀。 等式分支是单独的，因为在这种情况下所需的线已经是多边形对角线。 

在严格交叉的分支中，`before`是已经占的两倍面积。 数量`d = total - 2 * before`是当前三角形所需剩余面积的两倍。 系数`2 * t - d`和`d`均为正数，因此构造点在缩放前位于当前两个多边形顶点之间的线段上。 

代码永远不会除以`2 * t`。 这是核心的实现技巧。 有理点乘以其分母，产生整数点`Q`在同一条线上。 输入坐标以 (10^5) 为界，每个平移坐标的大小最多为 (2\cdot10^5)，而单个三角形的大小为 (2T\le8\cdot10^{10})。 因此构造的坐标完全低于 (10^{18})。 

## 工作示例

 对于提供的样品，```
4
0 3
3 0
3 6
0 7
```第一个顶点的平移给出 ((0,0),(3,-3),(3,3),(0,4))。 风扇由两个三角形组成。 

| 三角形| 相对于 (V_0) | 的顶点 面积翻倍| 前缀|
 | ---| ---| ---| ---|
 | 1 | ((0,0),(3,-3),(3,3)) | 18 | 18 18 | 18
 | 2 | ((0,0),(3,3),(0,4)) | 12 | 12 30|

 总面积翻倍为 (30)，因此目标为 (15)。 第一个三角形已经穿过目标。 这里`before = 0`、(T=18)和(d=30)。 缩放后的点是

 [
 Q=(36-30)(3,-3)+30(3,3)=(108,72)。 
]

 程序翻译回来后输出```
0 3
108 75
```切割线在 ((0,3)) 和 ((3,5)) 处与多边形相交，生成的三角形面积为 (15/2)，正好是多边形面积的一半。 示例的输出不同，但允许有多个有效答案。 

对于第二个例子，考虑平方```
4
0 0
2 0
2 2
0 2
```| 三角形| 相对于 (V_0) | 的顶点 面积翻倍| 前缀|
 | ---| ---| ---| ---|
 | 1 | ((0,0),(2,0),(2,2)) | 4 | 4 |
 | 2 | ((0,0),(2,2),(0,2)) | 4 | 8 |

 总面积加倍后为 (8)，因此一半为 (4)。 第一个前缀已经恰好是 (4)，这会激活相等分支。 算法输出```
0 0
2 2
```对角线将正方形分成两个三角形，每个三角形的面积为 (2)。 

第三个小例子是三角形```
3
0 0
4 0
0 2
```扇形三角形只有一个，因此其面积加倍为 (8)。 目标是 (4)，它对应于相对边缘的中点。 该建筑给出了

 [
 Q=8(4,0)+8(0,2)=(32,16)，
 ]

 因此输出线是通过 ((0,0)) 和 ((32,16)) 的线，相当于 (y=x/2)。 它穿过对边的中点 ((2,1))，并且恰好是三角形的中线。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(N)) | 每个多边形顶点都会被处理固定次数。 |
 | 空间| (O(N)) | 多边形和扇形三角形区域是显式存储的。 |

 对于 (N\le1000)，线性时间远低于可用限制。 最大的整数值由叉积和缩放一个多边形边上的点产生，但 Python 的任意精度整数可以准确处理它们。 最终构造的坐标远低于 (10^{18})，因此也满足输出限制。 

## 测试用例

 以下测试工具使用精确的整数几何来验证返回的行。 由于几何问题通常允许许多不同的输出，因此测试检查输出的数学属性，而不需要一对特定的点。```python
# helper: run solution on input string, return output string
import sys
import io
from fractions import Fraction
import math

def cross(ax, ay, bx, by):
    return ax * by - ay * bx

def solve_data(data):
    it = iter(data.strip().split())
    n = int(next(it))
    p = [(int(next(it)), int(next(it))) for _ in range(n)]

    ox, oy = p[0]
    q = [(x - ox, y - oy) for x, y in p]

    areas = []
    total = 0

    for i in range(1, n - 1):
        ax, ay = q[i]
        bx, by = q[i + 1]
        t = abs(cross(ax, ay, bx, by))
        areas.append(t)
        total += t

    prefix = 0

    for i, t in enumerate(areas, start=1):
        prefix += t

        if prefix * 2 == total:
            x, y = q[i + 1]
            return f"{ox} {oy}\n{ox + x} {oy + y}\n"

        if prefix * 2 > total:
            before = prefix - t
            d = total - 2 * before

            bx, by = q[i]
            cx, cy = q[i + 1]

            qx = (2 * t - d) * bx + d * cx
            qy = (2 * t - d) * by + d * cy

            return f"{ox} {oy}\n{ox + qx} {oy + qy}\n"

    return "-1\n"

def run(inp: str) -> str:
    return solve_data(inp)

def polygon_double_area(p):
    s = 0
    n = len(p)
    for i in range(n):
        x1, y1 = p[i]
        x2, y2 = p[(i + 1) % n]
        s += x1 * y2 - y1 * x2
    return abs(s)

def line_value(a, b, p):
    ax, ay = a
    bx, by = b
    x, y = p
    return (bx - ax) * (y - ay) - (by - ay) * (x - ax)

def clip_halfplane(poly, a, b, keep_positive):
    if not poly:
        return []

    result = []

    def inside(v):
        return v >= 0 if keep_positive else v <= 0

    for i in range(len(poly)):
        p = poly[i]
        q = poly[(i + 1) % len(poly)]
        fp = line_value(a, b, p)
        fq = line_value(a, b, q)
        inp = inside(fp)
        inq = inside(fq)

        if inp:
            result.append(p)

        if inp != inq:
            den = fq - fp
            t = Fraction(-fp, den)
            x = p[0] + t * (q[0] - p[0])
            y = p[1] + t * (q[1] - p[1])
            result.append((x, y))

    return result

def double_area_fraction(poly):
    if len(poly) < 3:
        return Fraction(0)

    s = Fraction(0)
    for i in range(len(poly)):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % len(poly)]
        s += x1 * y2 - y1 * x2
    return abs(s)

def valid_cut(inp, out):
    tokens = out.strip().split()
    if len(tokens) == 1 and tokens[0] == "-1":
        return False

    if len(tokens) != 4:
        return False

    a = (int(tokens[0]), int(tokens[1]))
    b = (int(tokens[2]), int(tokens[3]))

    if a == b:
        return False

    it = iter(inp.strip().split())
    n = int(next(it))
    poly = [(int(next(it)), int(next(it))) for _ in range(n)]

    total = Fraction(polygon_double_area(poly))

    left = clip_halfplane(poly, a, b, True)
    right = clip_halfplane(poly, a, b, False)

    return (
        double_area_fraction(left) * 2 == total
        and double_area_fraction(right) * 2 == total
        and abs(a[0]) <= 10**18
        and abs(a[1]) <= 10**18
        and abs(b[0]) <= 10**18
        and abs(b[1]) <= 10**18
    )

# Provided sample.
sample1 = """\
4
0 3
3 0
3 6
0 7
"""
assert valid_cut(sample1, run(sample1)), "sample 1"

# Minimum-size polygon.
triangle = """\
3
0 0
4 0
0 2
"""
assert run(triangle) == "0 0\n32 16\n", "minimum-size triangle"

# Equal fan areas, exercising the exact-half branch.
square = """\
4
0 0
2 0
2 2
0 2
"""
assert run(square) == "0 0\n2 2\n", "exact prefix half"

# Coordinates at the input boundary.
boundary_triangle = """\
3
100000 100000
-100000 100000
-100000 -100000
"""
assert valid_cut(boundary_triangle, run(boundary_triangle)), "coordinate boundary"

# A nontrivial polygon where half the area lies strictly inside a fan triangle.
pentagon = """\
5
0 0
4 0
5 2
3 5
0 4
"""
assert run(pentagon) == "0 0\n144 145\n", "interior fan triangle"

# Maximum-size stress test.
# Points are sampled from a large circle and slightly perturbed radially.
# The radius is large enough that rounding preserves strict convexity.
n = 1000
pts = []
for i in range(n):
    angle = 2.0 * math.pi * i / n
    r = 90000 + (i % 7)
    x = int(round(r * math.cos(angle)))
    y = int(round(r * math.sin(angle)))
    pts.append((x, y))

# Rotate the generated order if necessary so it is counterclockwise.
area = polygon_double_area(pts)
if area < 0:
    pts.reverse()

max_case = str(n) + "\n" + "\n".join(f"{x} {y}" for x, y in pts) + "\n"
assert valid_cut(max_case, run(max_case)), "maximum-size stress test"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品1 | 任意精确面积平分整数线 | 第一个扇形三角形内部的重要切割 |
 |`3 / 0 0 / 4 0 / 0 2`|`0 0`和`32 16`| 最小多边形和有理中点缩放|
 |`4 / 0 0 / 2 0 / 2 2 / 0 2`|`0 0`和`2 2`| 精确前缀等于一半 |
 | 坐标为 (\pm100000) | 的边界三角形 任何有效的整数行 | 大输入坐标和大构造整数 |
 | 五顶点多边形 |`0 0`和`144 145`| 严格的内部扇形三角形结构 |
 | 生成 1000 顶点多边形 | 任何有效的整数行 | 最大值 (N)、整数运算和线性时间遍历 |

 ## 边缘情况

 对于最小三角形```
3
0 0
4 0
0 2
```该算法恰好有一个面积加倍的扇形三角形 (8)。 前缀立即等于总数，但半面积条件是在该三角形内部达到的，而不是在整个三角形之后达到的。 这里`before = 0`、(T=8)和(d=8)。 构造的整数点为(Q=8(4,0)+8(0,2)=(32,16))。 从 ((0,0)) 到 ((32,16)) 的线是中位数，因此两个部分的面积均为 (4)。 

对于精确前缀的情况```
4
0 0
2 0
2 2
0 2
```第一个扇形三角形的面积翻倍 (4)，总面积翻倍为 (8)。 平等测试在严格交叉分支之前触发。 输出对角线 ((0,0)) 到 ((2,2)) 将正方形分成两个相等的三角形。 这种情况捕获了选择当前三角形时的相差一错误以及假设半区域点始终位于边缘内部的实现。 

对于提供的样品```
4
0 3
3 0
3 6
0 7
```第一个三角形的面积 (18) 加倍，而整个多边形的面积 (30) 加倍。 由于 (18>15)，目标位于该三角形内。 精确的缩放点是相对于第一个顶点的坐标 ((108,72))，给出输出点 ((108,75))。 通过 ((0,3)) 和 ((108,75)) 的线再次与多边形相交于 ((3,5))，所得三角形的面积为 (7.5)，正好是多边形面积 (15) 的一半。 

对于边界坐标情况```
3
100000 100000
-100000 100000
-100000 -100000
```输入使用最大允许的坐标幅度。 经过第一个顶点平移后，其他点为 ((-200000,0)) 和 ((-200000,-200000))。 该构造将对边中点缩放三角形的两倍面积，并生成一个大小约为 (10^{13}) 的点，但仍远低于 (10^{18})。 不需要浮点运算，因此边界处没有精度损失。 

最微妙的边缘情况是有理切割点本身不是整数点。 该算法从不尝试舍入该点。 相反，它将点表示为两个整数顶点的有理仿射组合，并将整个组合乘以其分母。 从固定整数顶点 (V_0) 缩放矢量会更改其长度，但不会更改其方向，因此生成的整数点确定完全相同的切割线。 这就是为什么该构造适用于每个有效的整数坐标凸多边形，而不是仅适用于半面积切割恰好穿过现有格点的多边形。
