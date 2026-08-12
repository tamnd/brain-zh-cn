---
title: "CF 102394D - 无人驾驶汽车"
description: "我们有一个轴对齐的矩形场和严格位于其内部的两条不相交的线段。 汽车是一个点，其路线上的每个点到这两个路段的距离必须相等。"
date: "2026-08-10T19:04:26+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102394
codeforces_index: "D"
codeforces_contest_name: "The 2019 China Collegiate Programming Contest Harbin Site"
rating: 0
weight: 102394
solve_time_s: 187
verified: true
draft: false
---

[CF 102394D - 无人驾驶汽车](https://codeforces.com/problemset/problem/102394/D)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个轴对齐的矩形场和严格位于其内部的两条不相交的线段。 汽车是一个点，其路线上的每个点到这两个路段的距离必须相等。 路线的起点和终点都在矩形边界上，两个边界点不同，并且必须穿过内部。 

因此关键对象是集合

 [
 {P\mid\操作符名称{距离}(P,A)=\操作符名称{距离}(P,B)}。 
]

 这是两个线段的 Voronoi 平分线。 由于两条线段均位于矩形内部且不相交，因此相关平分线将更靠近线段 (A) 的区域与更靠近线段 (B) 的区域分开。 在矩形内部，它形成了汽车必须遵循的独特的边界到边界路线。 答案是矩形内平分线的长度。 

每个输入情况通过其左下角 ((x_l,y_l)) 和右上角 ((x_r,y_r)) 给出矩形，后跟两个线段端点。 端点是整数坐标，但所需的路线是连续曲线，因此答案通常是无理数。 

官方约束允许多达 (10^5) 个独立案例，而每个坐标都在 (-1000) 到 (1000) 之间。 小坐标范围并不能使网格解决方案可行，因为所需的误差为 (10^{-9})，远小于输入的自然单位比例。 每个测试用例恒定数量的计算几何是适当的目标。 

有几种边缘情况很容易被错误处理。 首先，线段的最近点并不总是内部点。 例如，```
1
0 0 5 5
1 1 4 1
1 4 4 4
```有答案（5）。 在线段的水平范围之外，最近的点是它们的端点，因此将每个线段视为无限线会给出错误的平分线。 

其次，最近的特征可以在线段端点处精确地改变。 在样本中，```
1
0 0 7 6
2 4 4 4
3 2 5 2
```平分线由端点-端点线、点-线抛物线段和线-线段组成。 忽略 (x=2,3,4,5) 处的转换会给出错误的长度。 正确答案是（7.552593593868681136）。 

第三，两条支撑线可以平行或相交。 例如，两个平行的水平线段产生一条角平分线，而两个不平行的线段通过其支撑线的交点产生两条角平分线。 假设单个有限交点的通用线交点例程在并行情况下会默默地失败。 

最后，线段可以是垂直的，因此除以 (x) 差的公式是不安全的。 该实现单独处理垂直约束线。 

## 方法

 字面上的强力方法将对网格上的矩形进行采样，计算每个网格点处的两个线段距离，并尝试重建等式曲线。 即使是一个单位间距的网格，最大尺寸的矩形也大约有 (2000\cdot2000=4\cdot10^6) 个点。 在 (10^5) 种情况下，大约有 (4\cdot10^{11}) 点评估。 更根本的是，这样的网格永远无法保证所需的 (10^{-9}) 几何精度。 

蛮力的想法很有用，因为它揭示了我们真正需要知道的东西：在所需曲线的每个点，每段的哪一部分负责距离？ 对于一个细分市场来说，只有三种可能性。 最近的点可以是其第一端点、第二端点或线段的内部点。 

一旦两个段的最近特征都固定下来，等式曲线就变成了一个非常简单的经典对象。 两个点要素给出一条垂直平分线。 两条线要素给出角平分线。 点特征和线特征给出抛物线，因为曲线恰好是到焦点的距离等于到准线的距离的点的集合。 

该观察将连续问题减少到只有九种最接近特征的组合。 每个组合还具有一个简单的有效区域，由一个或两个半平面描述。 我们将相应的直线或抛物线与这些半平面和矩形相交。 由此产生的片段划分了完整的沃罗诺伊平分线，因此可以简单地将它们的长度相加。 

公认的几何实现正是使用这种恒定大小的分解。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 网格暴力| (O((W/\varepsilon)(H/\varepsilon))) | (O(1)) 或 (O(WH)) | 太慢而且不准确|
 | 特征分解| 每个案例 (O(1)) | (O(1)) | (O(1)) | 已接受 |

 ## 算法演练

 1. 将矩形的每个边界表示为一条有向线，并约定有效点位于其内侧。 相同的表示将用于描述线段的哪个端点或内部部分是最近特征的半平面。 
2. 对于每个段 (XY)，考虑三个最近特征状态。 状态 (0) 表示最近的点是 (X)。 状态(1)表示它是(Y)。 状态（2）表示垂直投影位于线段内部。 

对于状态(0)，有效条件为

 [
 (P-X)\cdot(Y-X)\le 0。 
]

 对于状态(1)，有

 [
 (P-Y)\cdot(X-Y)\le 0。 
]

对于状态 (2)，两个端点条件相反，要求投影位于端点之间。 
3. 枚举所有 (3\times3=9) 对特征状态，每个段一个状态。 将相应的半平面边界添加到四个矩形边界上。 这些不等式接受的每个点都具有在每个线段上精确选择的最近特征。 
4. 如果两个选定的要素都是点 (P) 和 (Q)，则它们在 (PQ) 垂直平分线上的距离恰好相等。 构造该线并用所有当前的半平面剪裁它。 
5. 如果两个选定要素都是线段内部，则它们的距离是到两条支撑线的距离。 两条线的距离相等是角平分线。 如果支撑线平行，则它们之间有一条平分线。 如果它们相交，则存在两个角平分线，并且都必须针对特征有效性半平面进行测试。 
6. 如果一个要素是点，另一个要素是内线，则等式曲线是抛物线。 将准线移至(y=0)，旋转至水平，并将焦点变换至((u,v))。 平移到抛物线顶点并（如有必要）垂直反射后，方程变为

 [
 x^2=py,\qquad p=2v。 
]

 有效性边界是线。 直线 (y=kx+b) 与抛物线相交给出

 [
 x^2-pkx-pb=0,
 ]

 这只是一个二次方程。 垂直边界直接给出一个 (x) 坐标。 
7. 对于每条候选线，将其与每个活动半平面边界相交。 沿候选线对所有交叉点参数进行排序。 在两个连续参数之间，候选参数要么完全有效，要么完全无效，因为区间内没有跨越约束边界。 测试每个间隔的中点并添加有效间隔的长度。 
8. 对于每个候选抛物线，在其 (x) 参数中执行相同的过程。 对所有根进行排序后，通过评估相应的抛物线点 ((x,x^2/p)) 来测试中点 (x)。 弧长是通过分析计算的，而不是通过数值采样计算的：

 \frac{x\sqrt{1+4x^2/p^2}}2+
 \frac p4\operatorname{asinh}\left(\frac{2x}{p}\right)。 
]
 9. 将所有九个特征组合中的有效部分相加。 它们是不相交的，除了可能在特征转换边界处，其长度为零。 它们的并集正好是矩形内的沃罗诺伊平分线，因此累加的长度就是所需的最小路径。 

### 为什么它有效

 对于平面上的每个点，线段上最近的点被唯一地分类为其第一端点、第二端点或内部投影，两个描述重合的边界除外。 因此，九个特征对覆盖了整个相等轨迹。 

在一对固定特征内，两个距离函数都具有固定的代数形式。 因此，等式轨迹恰好是上面处理的三个对象之一：直线、角平分线或抛物线。 半平面约束保证所选要素确实是其线段上的最近点。 将这些对象与每个约束边界相交，将它们划分为有效性恒定的区间。 

因此，相等位点的每个正长度部分都被计数一次，并且不计数无效部分。 由于两个不相交凸段的等轨迹是它们的两个 Voronoi 区域之间的分隔符，因此矩形内部的部分就是所需的边界到边界路径。 因此，它的总长度是最小有效路径长度。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

EPS = 1e-9
INF = 1e100

def add(a, b):
    return (a[0] + b[0], a[1] + b[1])

def sub(a, b):
    return (a[0] - b[0], a[1] - b[1])

def mul(a, k):
    return (a[0] * k, a[1] * k)

def rot90(a):
    return (-a[1], a[0])

def rot270(a):
    return (a[1], -a[0])

def flip(a):
    return (-a[0], -a[1])

def cross(a, b):
    return a[0] * b[1] - a[1] * b[0]

def length(a):
    return math.hypot(a[0], a[1])

def sgn(x):
    if x > EPS:
        return 1
    if x < -EPS:
        return -1
    return 0

def line_intersection(a, b, p, q):
    """
    Intersect infinite lines AB and PQ.

    Return:
        (2, None, None) if coincident,
        (0, None, None) if parallel,
        (1, point, t) otherwise, where point = A + t(B-A).
    """
    d1 = sub(b, a)
    d2 = sub(q, p)
    den = cross(d1, d2)
    num = cross(sub(p, a), d2)

    if sgn(den) == 0:
        if sgn(num) == 0:
            return 2, None, None
        return 0, None, None

    t = num / den
    return 1, add(a, mul(d1, t)), t

def solve_case(xl, yl, xr, yr, seg_a, seg_b):
    rect = [
        ((float(xl), float(yl)), (float(xr), float(yl))),
        ((float(xr), float(yl)), (float(xr), float(yr))),
        ((float(xr), float(yr)), (float(xl), float(yr))),
        ((float(xl), float(yr)), (float(xl), float(yl))),
    ]

    total = 0.0

    def check(point, edges):
        for a, b in edges:
            if sgn(cross(sub(point, a), sub(b, a))) > 0:
                return False
        return True

    def call_line(a, b, edges):
        """
        Add the valid length of the infinite line AB under all
        current half-plane constraints.
        """
        values = []

        for p, q in edges:
            typ, _, t = line_intersection(a, b, p, q)
            if typ == 2:
                return 0.0
            if typ == 1:
                values.append(t)

        if len(values) < 2:
            return 0.0

        values.sort()
        dlen = length(sub(b, a))
        ret = 0.0

        for i in range(1, len(values)):
            t1 = values[i - 1]
            t2 = values[i]
            mid = (t1 + t2) * 0.5
            p = add(a, mul(sub(b, a), mid))
            if check(p, edges):
                ret += (t2 - t1) * dlen

        return ret

    def integral_parabola(p, x):
        """
        Integral of sqrt(1 + 4*x^2/p^2) dx.
        """
        if p <= 0:
            return 0.0

        z = 2.0 * x / p
        root = math.sqrt(1.0 + z * z)
        return 0.5 * x * root + 0.25 * p * math.asinh(z)

    def solve_features(edges, tp0, f0, tp1, f1):
        nonlocal total

        if tp0 > tp1:
            tp0, tp1 = tp1, tp0
            f0, f1 = f1, f0

        A = f0[0]
        B = f0[1] if len(f0) > 1 else None
        C = f1[0]
        D = f1[1] if len(f1) > 1 else None

        if tp0 == 0 and tp1 == 0:
            mid = mul(add(A, C), 0.5)
            direction = rot90(sub(A, mid))
            total += call_line(add(mid, direction), mid, edges)
            return

        if tp0 == 1 and tp1 == 1:
            typ, o, _ = line_intersection(A, B, C, D)

            if typ == 0:
                origin = mul(add(A, C), 0.5)
                total += call_line(origin, add(origin, sub(D, C)), edges)
                return

            if typ == 2:
                return

            if length(sub(A, o)) < length(sub(B, o)):
                A, B = B, A

            if length(sub(C, o)) < length(sub(D, o)):
                C, D = D, C

            ang1 = math.atan2(A[1] - o[1], A[0] - o[0])
            ang2 = math.atan2(C[1] - o[1], C[0] - o[0])
            ang = (ang1 + ang2) * 0.5

            direction = (math.cos(ang), math.sin(ang))
            total += call_line(o, add(o, direction), edges)
            total += call_line(o, add(o, rot90(direction)), edges)
            return

        # Point-line case.
        # A is the point, CD is the supporting line.
        direction = sub(D, C)

        # Translate C to the origin.
        A = sub(A, C)
        transformed = [(sub(p, C), sub(q, C)) for p, q in edges]

        # Rotate CD onto the positive x-axis.
        w = math.atan2(direction[1], direction[0])
        cw = math.cos(-w)
        sw = math.sin(-w)

        def rotate_point(p):
            return (p[0] * cw - p[1] * sw,
                    p[0] * sw + p[1] * cw)

        A = rotate_point(A)
        transformed = [
            (rotate_point(p), rotate_point(q))
            for p, q in transformed
        ]

        if A[1] < 0:
            A = flip(A)
            transformed = [(flip(p), flip(q)) for p, q in transformed]

        p = 2.0 * A[1]

        if sgn(p) == 0:
            return

        vertex = (A[0], A[1] * 0.5)

        transformed = [
            (sub(a, vertex), sub(b, vertex))
            for a, b in transformed
        ]

        roots = []

        for a, b in transformed:
            dx = a[0] - b[0]

            if sgn(dx) == 0:
                roots.append(a[0])
                continue

            k = (a[1] - b[1]) / dx
            bb = a[1] - k * a[0]

            # x^2 - p*k*x - p*b = 0
            disc = p * p * k * k + 4.0 * p * bb

            if sgn(disc) < 0:
                continue

            if disc < 0:
                disc = 0.0

            root = math.sqrt(disc)
            roots.append((p * k - root) * 0.5)
            roots.append((p * k + root) * 0.5)

        if len(roots) < 2:
            return

        roots.sort()

        prev_value = None

        for i, x in enumerate(roots):
            value = integral_parabola(p, x)

            if i > 0:
                mid = (roots[i - 1] + x) * 0.5
                point = (mid, mid * mid / p)

                if check(point, transformed):
                    total += value - prev_value

            prev_value = value

    segments = [seg_a, seg_b]

    for state_a in range(3):
        for state_b in range(3):
            edges = list(rect)
            features = [None, None]
            types = [state_a, state_b]

            for idx, state in enumerate(types):
                a, b = segments[idx]
                d = sub(b, a)

                if state == 0:
                    # Closest point is a.
                    edges.append((a, add(a, rot90(d))))
                    features[idx] = [a]

                elif state == 1:
                    # Closest point is b.
                    edges.append((b, add(b, rot90(sub(a, b)))))
                    features[idx] = [b]

                else:
                    # Closest point is in the interior of AB.
                    edges.append((a, add(a, rot270(d))))
                    edges.append((b, add(b, rot270(sub(a, b)))))
                    features[idx] = [a, b]

            solve_features(
                edges,
                state_a,
                features[0],
                state_b,
                features[1]
            )

    return total

def solve(inp):
    rd = inp.readline
    t = int(rd())
    out = []

    for _ in range(t):
        xl, yl, xr, yr = map(int, rd().split())
        a = tuple(map(float, rd().split()))
        b = tuple(map(float, rd().split()))

        seg_a = ((a[0], a[1]), (a[2], a[3]))
        seg_b = ((b[0], b[1]), (b[2], b[3]))

        ans = solve_case(
            xl, yl, xr, yr,
            seg_a, seg_b
        )

        if abs(ans) < 5e-12:
            ans = 0.0

        out.append(f"{ans:.15f}")

    return "\n".join(out)

if __name__ == "__main__":
    sys.stdout.write(solve(sys.stdin))
```在考虑任何特征之前，将矩形作为四个半平面边界插入。 由于矩形是凸形的，因此可以简单地通过对候选曲线与这些边界的交点进行排序来剪切候选曲线。 

这`work`几何推导的逻辑直接由三种状态表示。 通过端点的垂直边界来自点积条件，定义线段上的投影是否位于该端点之前。`call_line`将无限直线参数化为 (A+t(B-A))。 每个约束交叉都会产生一个 (t) 值。 对这些值进行排序将连续裁剪问题转化为恒定数量的间隔检查。 测试中点就足够了，因为在该区间内没有跨越任何约束边界。 

当支撑线相交时，线与线的情况需要特殊处理。 有两条角平分线，而不是一条。 该代码选择远离交点的光线并平均它们的方向，然后使用第二个平分线的垂直方向。 

点线情况是数值上比较敏感的部分。 变换去除任意线段方向，之后等式曲线具有标准抛物线方程（x^2=py）。 每个约束要么成为一条垂直线，要么成为 (y=kx+b)，因此所有相交参数都来自直接 (x) 值或二次方程。 

蟒蛇的`float`在这里就足够了，因为所需的误差是 (10^{-9})，而坐标幅度仅为 (2000)。 在确定叉积、行列式或判别式是否为零时，该实现使用绝对 epsilon。 这可以防止微小的浮点噪声将几何平行线变成人为的交叉点。 

## 工作示例

 ### 示例 1

 输入是```
1
0 0 7 6
2 4 4 4
3 2 5 2
```两个部分都是水平的，但下面的部分向右移动了一个单位。 等式曲线有五个正长度部分。 下面总结了九种功能组合。 

| 特征对| 平等曲线| 有效区间| 长度|
 | ---| ---| ---| ---|
 | A-左端点，B-左端点 | 直线 (y=x/2+7/4) | (0\le x\le2) | (\sqrt5) |
 | A-内部，B-左端点 | 抛物线| (2\le x\le3) | (1.0402288194) |
 | A-内饰，B-内饰| (y=3) | (y=3) | (3\le x\le4) | (1) |
 | A-右端点，B-内部| 抛物线| (4\le x\le5) | (1.0402288194) |
 | A-右端点，B-右端点 | 直线 (y=x/2+3/4) | (5\le x\le7) | (\sqrt5) |

 其他四个特征组合没有正长度的有效区间。 对于任一抛物线段，代入相应的坐标后，弧长积分为

 1.040228819434551。 
]

 因此累积长度为

 [
 2\平方5
 +1.040228819434551
 +1
 +1.040228819434551
 +2\sqrt5,
 ]

 这给出了

 [
 7.552593593868681。 
]

 这与官方示例输出 (7.552593593868681136) 一致。 

### 对称线段

 考虑```
1
0 0 10 10
2 3 8 3
2 7 8 7
```这两段是水平的，长度相等，并且直接位于彼此之上。 它们的支撑线平分线是 (y=5)。 

| 特征对| 有效区间| 贡献| 累计长度|
 | ---| ---| ---| ---|
 | 左端点，左端点| (0\le x\le2) | (2) | (2) |
 | 室内，室内| (2\le x\le8) | (6) | (8) |
 | 右端点，右端点 | (8\le x\le10) | (2) | (10) |

 所有混合点线组合都会在线段端点处折叠为零长度过渡。 最终答案为（10）。 

此示例演示了为什么算法不能将线段视为单个几何图元。 相同的最终平分线由端点和内部特征情况组装而成，尽管它看起来像一条直线。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 (O(1)) | 正好有九个特征对，每个特征对都有恒定数量的约束、交集、根和区间检查 |
 | 空间| (O(1)) | (O(1)) | 最多存储恒定数量的点、边界、根和临时区间 |

 在 (10^5) 种情况下，总工作量与具有相对较小常数的情况数量呈线性关系。 原始问题有 6 秒限制和 512 MB 内存限制，因此避免对矩形坐标区域的任何依赖至关重要。 

## 测试用例

 以下工具假设上述解决方案代码在同一文件中可用或已导入，以便`solve`是可调用的。```
import io
import math

def run(inp: str) -> str:
    return solve(io.BytesIO(inp.encode())).strip()

def assert_close(inp: str, expected: float, name: str):
    got = float(run(inp))
    assert math.isclose(got, expected, rel_tol=1e-10, abs_tol=1e-10), (
        f"{name}: got {got}, expected {expected}"
    )

# Provided sample
sample1 = """\
1
0 0 7 6
2 4 4 4
3 2 5 2
"""
assert_close(sample1, 7.552593593868681136, "sample 1")

# Minimum-size valid construction.
# The rectangle has width 2 and height 5.
# The two vertical segments occupy disjoint interior intervals.
case_minimum = """\
1
0 0 2 5
1 1 1 2
1 3 1 4
"""
assert_close(case_minimum, 2.0, "minimum-size case")

# Maximum-size rectangle and symmetric horizontal segments.
case_maximum = """\
1
-1000 -1000 1000 1000
-500 -500 500 -500
-500 500 500 500
"""
assert_close(case_maximum, 2000.0, "maximum-size case")

# Segment endpoints are as close as allowed to the rectangle boundary.
case_boundary = """\
1
0 0 5 5
1 1 4 1
1 4 4 4
"""
assert_close(case_boundary, 5.0, "boundary case")

# Both segments are vertical, exercising x1 == x2.
case_vertical = """\
1
0 0 10 10
3 2 3 8
7 2 7 8
"""
assert_close(case_vertical, 10.0, "vertical segments")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`0 0 2 5`, (x=1) | 上的线段`2`| 具有两个不相交的整数坐标段的最小实用矩形 |
 |`-1000 -1000 1000 1000`，水平线段|`2000`| 最大坐标范围和大几何值 |
 |`0 0 5 5`，使用坐标 (1) 和 (4) 进行分段 |`5`| 距矩形边界最近允许距离处的端点 |
 |`0 0 10 10`，垂直线段|`10`| 垂直段和防止被零除的保护 |

 ## 边缘情况

 第一个边缘情况是最近点是端点的线段。 考虑```
1
0 0 5 5
1 1 4 1
1 4 4 4
```对于(x<1)，下段的最近点是其左端点，上段也是如此。 那里的等式轨迹有一条端点-端点垂直平分线。 该算法通过特征状态 (0,0) 达到这种情况，而不是错误地使用两条无限支撑线。 最终路线是完整的水平线 (y=2.5)，长度为 (5)。 

第二个边缘情况是特征转换。 在官方示例中，对于（2<x<3），上段最接近的特征是其内部，而下段最接近的特征是其左端点。 在 (x=3) 处，下部最近的特征更改为段内部。 该算法明确考虑两种特征状态，并且过渡点显示为与活动半平面边界之一的交点。 由于单个点的长度为零，因此不存在重复计算问题。 所得总数为 (7.552593593868681136)。 

第三种边缘情况是垂直段。 考虑```
1
0 0 10 10
3 2 3 8
7 2 7 8
```两条支撑线是 (x=3) 和 (x=7)，因此它们的平分线是 (x=5)。 该路线从 ((5,0)) 穿过矩形到 ((5,10))，长度为 (10)。 在抛物线代码中，垂直约束线通过其零 (x) 差来检测，因此不会发生被零除的情况。 

第四种边缘情况是平行支撑线。 当两个选定的内部特征平行时，它们之间恰好有一条等距线。 该算法检测到支撑线交点不存在，直接构造中点线。 这可以避免尝试从未定义的交点形成角度。 

第五种边缘情况是一对相交的支撑线。 即使有限线段本身不相交，两个不平行的线段也可能具有相交的支撑线。 到这两条线的距离相等给出两条角平分线。 该算法生成两者，并让特征半平面丢弃与实际片段不对应的部分。 这是必要的，因为仅保留一个角平分线可以删除 Voronoi 平分线的有效部分。 

最后一种边缘情况是约束边界处的数值简并性。 候选曲线可以与半平面边界精确重合，特别是在端点特征和内部特征之间的过渡处。 该实现将重合线视为在该特征情况下贡献为零，因为相同的几何块由相邻特征情况表示。 这可以防止相同的正长度曲线被计算两次。 

这个版本故意是几何的而不是公式优先的：一旦理解了最近特征分解，就可以针对类似的 Voronoi 问题重新导出三种曲线类型及其裁剪规则。
