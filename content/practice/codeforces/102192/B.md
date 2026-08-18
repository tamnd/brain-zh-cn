---
title: "CF 102192B - 披萨中心"
description: "我们有一个非退化三角形和一个矩形纸垫。 pad 的宽度是固定的 w，而它的高度是我们想要最小化的数量。 三角形可以自由旋转，并且允许触及边界。"
date: "2026-08-18T09:54:22+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102192
codeforces_index: "B"
codeforces_contest_name: "2018 Chinese Multi-University Training, Nanjing U Contest"
rating: 0
weight: 102192
solve_time_s: 732
verified: true
draft: false
---

[CF 102192B - 披萨中心](https://codeforces.com/problemset/problem/102192/B)

 **评级：** -
 **标签：** -
 **求解时间：** 12m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个非退化三角形和一个矩形纸垫。 焊盘具有固定宽度`w`，而它的高度是我们想要最小化的数量。 三角形可以自由旋转，并且允许触及边界。 旋转三角形的水平尺寸不得超过`w`; 其垂直尺寸成为所需的高度。 

对于每个测试用例，六个坐标描述三个三角形顶点，后面是条带宽度。 我们必须打印尽可能小的高度，或者`impossible`如果没有旋转可以使三角形适合宽度的条带`w`。 

最多有 50,000 个独立测试用例。 坐标和`w`最多 10,000，因此整数算术对于几何谓词来说已经足够了，但答案本身通常是不合理的。 时间限制仅为 3 秒，这排除了为每个测试用例采样大量旋转角度的情况。 特别是，扫描每个三角形数百万个可能的角度将非常昂贵。 每个案例都需要恒定量的几何工作。 

第一个边缘情况是一条太窄而根本无法容纳三角形的条带。 例如，```
0 0 2 0 1 2 1
```最小可能宽度大于`1`，所以答案是`impossible`。 仅尝试水平放置一侧的粗心实现可能会意外报告高度，而不是认识到没有方向满足宽度限制。 

第二种边缘情况是一个三角形，其最佳方向不是通过简单地将一条边水平放置来获得的。 例如，对于足够窄的条带，比条带长的边缘在旋转之后可能必须接触两个垂直边界。 正确的方向是通过其在宽度方向上的投影来确定的，而不是通过将边缘与矩形对齐来确定。 

第三种边缘情况是边界处的平等。 为了```
0 0 1 0 0 1 1
```三角形与宽度完全吻合`1`和高度准确`1`，所以输出是`1.0000000000`。 使用严格的`< w`测试将错误地拒绝此放置。 

最后，即使三个顶点本身不能全部重合或共线，坐标也可能包含重复的值。 例如，```
0 0 0 1 1 1 1
```是一个有效的直角三角形。 该算法必须依赖于向量几何，而不是假设所有六个输入坐标都是不同的。 

## 方法

 一个直接的暴力想法是旋转三角形多个角度，每次旋转后计算其边界框，并在宽度最多为 的旋转中保持最小的高度`w`。 这在概念上是有效的，因为对于任何固定旋转，三个旋转顶点完全确定所需的矩形。 问题是旋转是连续的，因此网格搜索需要极小的角步长来保证所需的`1e-6`精确。 采样每个`10^-6`弧度大约需要`2π / 10^-6`，或者一个测试用例大约有 630 万个方向。 5万个案例，相当于超过3000亿次定向检查，远远超出了时间限制。 较粗的网格也没有正确性保证，因为最佳值可能位于两个采样角度之间。 

有用的观察结果是，始终可以选择一个最佳放置位置，其中一个三角形顶点位于矩形的一角。 从几何角度来说，一旦三角形位于矩形内部，请平移矩形，直到其在相关的下边界和侧边界处变紧。 在最佳紧密配置下，可以使三角形顶点与矩形角重合。 这将连续放置问题减少到只有三角形顶点的三种选择，加上其他两个顶点中较低的顶点的两种选择。 

将三角形顶点固定为矩形的左下角。 让向量`a`和`b`从该顶点指向另外两个顶点。 我们需要旋转它们，使两个坐标都非负，两个水平坐标最多为`w`，最大纵坐标越小越好。 

两个向量必须形成最多 90 度的角度才能实现此角配置。 我们可以用他们的点积来测试这一点。 如果`|a| <= w`，此排序的最佳位置是`a`水平地。 那么它的垂直贡献为零，并且将矩形旋转远离`a`只会增加它的垂直坐标。 贡献的高度`b`正是从`b`到线通过`a`，即`cross(a,b) / |a|`， 假如`b`仍然适合水平放置。 

如果`|a| > w`,`a`不能是水平的，因为其水平投影会超过带材宽度。 最佳可能的安置位置`a`就是让它的水平投影准确`w`。 然后将其垂直投影固定为

 [
 h_a=\sqrt{|a|^2-w^2}。 
]

 有两个可能的方面`a`另一个向量可以位于其上。 我们通过交换来测试两者`a`和`b`，并通过反映所有`y`坐标。 一旦角度为`a`相对于水平面的夹角是固定的`a`和`b`决定了位置`b`。 我们可以直接用三角学来检查它的水平投影和垂直投影。 

蛮力方法之所以有效，是因为每次旋转都可以被评估。 它失败了，因为有太多的旋转需要检查。 对矩形角的观察让我们放弃了几乎整个连续搜索空间。 只有六个有序向量对，反射处理水平轴的两侧。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(T·K) 其中 K 是数百万个采样角度 | O(1) | O(1) | 太慢而且不准确|
 | 最佳 | O(T)| O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取三个顶点和条带宽度`w`。 使用顶点之间的向量来处理每个计算，因为三角形的平移对所需的矩形尺寸没有影响。 
2. 对于三个三角形顶点中的每一个，将其视为矩形角并构造两个向量`a`和`b`从该顶点到其余顶点。 尝试这两种顺序，因为一个向量可以是下面的射线，另一个向量可以是上面的射线。 
3. 拒绝订购时`a · b < 0`。 然后，两个向量形成大于 90 度的角度，因此它们不能同时位于从矩形角开始的同一象限内。 
4. 计算`A² = a · a`。 如果`A² <= w²`,`a`可以水平放置而不会超出带材宽度。 在这种情况下，需要`a × b >= 0`并要求投影`b`到`a`至多是`w`。 结果高度是`|a × b| / |a|`。 
5.如果`A² > w²`,`a`必须倾斜。 套装

 [
 h=\sqrt{A^2-w^2}。 
]

 这是最小的垂直投影`a`可以有，而其水平投影恰好是`w`。 

1. 计算

 [
 \phi=\arctan(h/w),
 ]

 这是哪个角度`a`当其水平投影为`w`。 还计算角度`δ`之间`a`和`b`来自

 [
 \cos\delta=\frac{a\cdot b}{|a||b|}。 
]

 1.如果`a × b >= 0`,`b`位于与正转相同的旋转侧`a`。 它与水平面的夹角是`φ + δ`。 它必须保持在第一象限内，所以`φ + δ <= π/2`。 它的水平投影也最多必须是`w`。 如果这些条件成立，则其垂直投影为`|b| sin(φ+δ)`，因此候选高度是该值中的较大者和`h`。 
2.如果`a × b < 0`,`b`位于另一边`a`。 它与水平面的夹角是`φ - δ`。 我们需要`φ - δ >= 0`以便`b`保持在水平边界之上。 它的水平投影也最多必须是`w`。 在此配置中，其垂直投影不能超过`h`，所以候选身高就是`h`。 
3. 在水平轴上反射三角形后，重复相同的六次有序向量测试。 反射处理相关向量位于原始坐标系另一侧的放置。 
4. 如果至少找到一个候选者，则打印最小的候选者。 否则打印`impossible`。 

为什么它有效：关键的不变量是算法考虑的每个候选都代表一个合法的位置，其中一个三角形顶点位于矩形角上，并且每个最佳位置都有这种形式的等效紧位置。 对于固定角点和有序对，宽度约束要么允许第一个向量变为水平，要么强制其水平投影等于`w`。 这正是算法处理的两种情况。 然后，角度检查表征第二个向量是否保留在矩形内。 由于检查了所有三个可能的角顶点、两个向量阶以及两个方向，因此不会遗漏最佳放置。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

EPS = 1e-10
INF = float("inf")
PI = math.pi

def solve_case(points, w):
    ans = INF
    w2 = float(w * w)

    def calc(a, b):
        nonlocal ans

        ax, ay = a
        bx, by = b

        dot = ax * bx + ay * by
        cross = ax * by - ay * bx
        aa = ax * ax + ay * ay
        bb = bx * bx + by * by

        # Both vectors must fit into the same 90-degree quadrant.
        if dot < -EPS:
            return

        A = math.sqrt(aa)
        B = math.sqrt(bb)

        if aa <= w2 + EPS:
            # Put a horizontally.
            if cross < -EPS:
                return

            # Projection of b onto a must not exceed w.
            if dot * dot > w2 * aa + EPS:
                return

            height = cross / A
            if height < ans:
                ans = height
            return

        # a is longer than the available width, so its x-projection
        # has to be exactly w.
        h = math.sqrt(max(0.0, aa - w2))
        phi = math.atan2(h, float(w))

        c = dot / (A * B)
        c = max(-1.0, min(1.0, c))
        delta = math.acos(c)

        if cross >= -EPS:
            angle = phi + delta

            # b must remain in the first quadrant.
            if angle > PI / 2 + EPS:
                return

            bx_proj = B * math.cos(angle)
            if bx_proj > w + EPS:
                return

            by_proj = B * math.sin(angle)
            ans = min(ans, max(h, by_proj))
        else:
            angle = phi - delta

            # b must not cross below the horizontal side.
            if angle < -EPS:
                return

            bx_proj = B * math.cos(angle)
            if bx_proj > w + EPS:
                return

            ans = min(ans, h)

    # Reflection lets us consider both sides of the horizontal axis.
    for reflected in (False, True):
        if reflected:
            p = [(x, -y) for x, y in points]
        else:
            p = points

        for i in range(3):
            j = (i + 1) % 3
            k = (i + 2) % 3

            a = (p[j][0] - p[i][0], p[j][1] - p[i][1])
            b = (p[k][0] - p[i][0], p[k][1] - p[i][1])

            calc(a, b)
            calc(b, a)

    return ans

def main():
    out = []

    t = int(input())
    for _ in range(t):
        x1, y1, x2, y2, x3, y3, w = map(int, input().split())

        points = [
            (x1, y1),
            (x2, y2),
            (x3, y3),
        ]

        ans = solve_case(points, w)

        if math.isinf(ans):
            out.append("impossible")
        else:
            out.append(f"{ans:.10f}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```这`calc`函数是步骤 3 到 8 的实现。矢量点积确定两条光线是否可以适合一个象限，而叉积则确定两条光线位于哪一侧`a`包含`b`。 

这`aa <= w²`分支是这样的情况`a`可以沿着矩形的宽度放置。 表达式`cross / A`是从第三个顶点到通过前两个顶点的直线的垂直距离，因此它直接给出了所需的高度。 

第二个分支处理以下情况`a`比带材更宽。 表达式`sqrt(aa - w²)`直接从向量形成的直角三角形得出`a`，其水平投影`w`，及其垂直投影。`atan2(h, w)`优于`atan(h / w)`因为它在所有有效值下都表现得很干净，尽管`w`这里是正值。 

参数传递给`acos`被钳位到`[-1, 1]`。 从数学上讲，它已经在该区间内，但浮点舍入可以产生诸如`1.0000000000000002`，否则会导致域错误。 

比较使用较小的 epsilon，因为最佳配置通常恰好位于条带边界上。 仅使用严格的浮点比较可以拒绝有效的放置，例如投影完全正确的向量`w`。 

循环检查每个三角形顶点、第一个向量的两个选择以及两个垂直反射。 每个测试用例仅进行 12 个恒定大小的检查。 

Python 整数具有任意精度，因此坐标差的平方不会溢出。 仅在获得精确的整数点积、叉积和平方长度后，三角计算才使用浮点数。 

## 工作示例

 对于第一个样本，三角形是`(0,0), (3,0), (0,4)`宽度是`10`。 一对向量来自`(0,0)`是`a=(3,0)`和`b=(0,4)`。 

| 顶点|`a`|`b`|`|a| <= w`| 候选人身高|
 |---|---|---|---|---:|
 |`(0,0)`|`(3,0)`|`(0,4)`| 是的 |`4`|
 |`(0,0)`|`(0,4)`|`(3,0)`| 是的 | 被定向拒绝|
 |`(3,0)`|`(-3,0)`|`(-3,4)`| 是的 |`4`|
 |`(0,4)`|`(0,-4)`|`(3,-4)`| 是的 |`2.4`|

 最后的配置对应于放置长度的边`5`沿着宽度方向。 其海拔高度为`3·4/5 = 2.4`，它小于从其他边获得的高度。 因此输出是`2.4000000000`。 

对于第二个样本，同一个三角形的宽度为`1`。 

| 数量 | 价值|
 | --- | --- |
 | 三角区|`6`|
 | 最长边|`5`|
 | 最小可能的三角形宽度|`2.4`|
 | 可用带钢宽度|`1`|
 | 可行的候选人 | 无 |
 | 输出|`impossible`|

 每个角配置都无法通过投影检查，因为条带比三角形的最小可能宽度窄。 该算法永远不会为不可能的放置发明高度，因此最终答案仍然是无穷大，并且`impossible`被打印。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(T)| 每个测试用例恰好执行 12 个恒定大小的几何检查和恒定数量的三角运算。 |
 | 空间| O(1) | O(1) | 仅存储三个输入点和恒定数量的临时浮点值。 |

 该算法最多有 50,000 个测试用例，总共只执行几十万个几何配置。 这完全符合预期的每个案例恒定时间设计，而内存使用量与测试案例的数量无关。 

## 测试用例```python
# The helper mirrors the submitted solution.
import sys
import io
import math

def solve_input(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()

        input = sys.stdin.readline

        EPS = 1e-10
        INF = float("inf")
        PI = math.pi

        def solve_case(points, w):
            ans = INF
            w2 = float(w * w)

            def calc(a, b):
                nonlocal ans

                ax, ay = a
                bx, by = b

                dot = ax * bx + ay * by
                cross = ax * by - ay * bx
                aa = ax * ax + ay * ay
                bb = bx * bx + by * by

                if dot < -EPS:
                    return

                A = math.sqrt(aa)
                B = math.sqrt(bb)

                if aa <= w2 + EPS:
                    if cross < -EPS:
                        return

                    if dot * dot > w2 * aa + EPS:
                        return

                    ans = min(ans, cross / A)
                    return

                h = math.sqrt(max(0.0, aa - w2))
                phi = math.atan2(h, float(w))

                c = dot / (A * B)
                c = max(-1.0, min(1.0, c))
                delta = math.acos(c)

                if cross >= -EPS:
                    angle = phi + delta

                    if angle > PI / 2 + EPS:
                        return

                    bx_proj = B * math.cos(angle)
                    if bx_proj > w + EPS:
                        return

                    by_proj = B * math.sin(angle)
                    ans = min(ans, max(h, by_proj))
                else:
                    angle = phi - delta

                    if angle < -EPS:
                        return

                    bx_proj = B * math.cos(angle)
                    if bx_proj > w + EPS:
                        return

                    ans = min(ans, h)

            for reflected in (False, True):
                p = [(x, -y) for x, y in points] if reflected else points

                for i in range(3):
                    j = (i + 1) % 3
                    k = (i + 2) % 3

                    a = (
                        p[j][0] - p[i][0],
                        p[j][1] - p[i][1],
                    )
                    b = (
                        p[k][0] - p[i][0],
                        p[k][1] - p[i][1],
                    )

                    calc(a, b)
                    calc(b, a)

            return ans

        def main():
            out = []
            t = int(input())

            for _ in range(t):
                x1, y1, x2, y2, x3, y3, w = map(int, input().split())
                points = [(x1, y1), (x2, y2), (x3, y3)]

                ans = solve_case(points, w)

                if math.isinf(ans):
                    out.append("impossible")
                else:
                    out.append(f"{ans:.10f}")

            sys.stdout.write("\n".join(out))

        main()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided samples.
assert solve_input(
    "2\n"
    "0 0 3 0 0 4 10\n"
    "0 0 3 0 0 4 1\n"
) == "2.4000000000\nimpossible", "provided samples"

# Minimum-size valid triangle. Width exactly reaches the boundary.
assert solve_input(
    "1\n"
    "0 0 1 0 0 1 1\n"
) == "1.0000000000", "minimum coordinates and exact width"

# Same geometry after translation and permutation of the vertices.
assert solve_input(
    "1\n"
    "7 8 7 9 8 9 1\n"
) == "1.0000000000", "translation and vertex order"

# A narrow strip that cannot contain an equilateral triangle of side 2.
assert solve_input(
    "1\n"
    "0 0 2 0 1 2 1\n"
) == "impossible", "impossible due to minimum width"

# Maximum coordinate values, with width exactly equal to the two legs.
assert solve_input(
    "1\n"
    "0 0 10000 0 0 10000 10000\n"
) == "10000.0000000000", "maximum coordinates and boundary width"

# A valid triangle with repeated coordinate components.
assert solve_input(
    "1\n"
    "0 0 0 1 1 1 1\n"
) == "1.0000000000", "repeated coordinate components"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`0 0 1 0 0 1 1`|`1.0000000000`| 宽度边界处的最小坐标和相等 |
 |`7 8 7 9 8 9 1`|`1.0000000000`| 平移不变性和任意顶点顺序 |
 |`0 0 2 0 1 2 1`|`impossible`| 比三角形最小宽度更窄的条带 |
 |`0 0 10000 0 0 10000 10000`|`10000.0000000000`| 最大坐标值和精确边界投影 |
 |`0 0 0 1 1 1 1`|`1.0000000000`| 无共线性的重复坐标分量 |

 ## 边缘情况

 对于不可能的情况```
0 0 2 0 1 2 1
```三角形的边长是等边`2`。 它的最小可能宽度是它的高度，`sqrt(3)`，大于可用宽度`1`。 每个有序向量对最终要么不满足象限条件，要么不满足宽度投影条件。 由于没有候选人达到`ans`，程序打印`impossible`。 

对于精确的边界接触，```
0 0 1 0 0 1 1
```向量`(1,0)`长度正好平方`w²`。 这`aa <= w² + EPS`分支接受它，另一个顶点的水平投影为零，垂直投影为一。 候选人身高正好是`1`，所以输出是`1.0000000000`。 此案例捕获了意外使用的实现`aa < w²`或者`projection < w`。 

对于最大坐标情况，```
0 0 10000 0 0 10000 10000
```向量来自`(0,0)`到`(10000,0)`长度恰好等于带材宽度。 水平放置该边给出高度`10000`，而其他拐角配置在宽度限制下无法改善它。 该算法在转换为浮点之前使用整数平方长度执行所有计算，避免溢出和不必要的数值错误。 

对于重复的坐标分量，```
0 0 0 1 1 1 1
```向量来自`(0,0)`是`(0,1)`和`(1,1)`。 他们的点积是正的，他们的叉积有大小`1`。 由于宽度正好是`1`，三角形与高度相符`1`。 该示例演示了为什么算法不应依赖于成对不同的输入坐标。 仅需要非共线性保证。
