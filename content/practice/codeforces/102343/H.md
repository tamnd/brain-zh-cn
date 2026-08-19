---
title: "CF 102343H - 山景城"
description: "山体轮廓是分段线性函数。 输入将其顶点从左到右指定为点 (xi, yi)，并且在连续点之间，山是连接它们的直线。 在给定范围之外，高程为零。"
date: "2026-08-17T10:19:35+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102343
codeforces_index: "H"
codeforces_contest_name: "UCF Locals 2019"
rating: 0
weight: 102343
solve_time_s: 127
verified: true
draft: false
---

[CF 102343H - 山景城](https://codeforces.com/problemset/problem/102343/H)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 山体轮廓是分段线性函数。 输入从左到右给出其顶点作为点`(x_i, y_i)`，并且在连续点之间，山是连接它们的直线。 在给定范围之外，高程为零。 相机选择固定宽度的水平间隔`W`，即`[x, x + W]`，我们希望在该区间内获得最大可能的平均海拔。 由于每张图片的宽度相同，因此最大化平均值与最大化区间内山下的面积完全相同。 官方的限制是`n <= 10^5`,`x_i <= 10^9`,`y_i <= 10^4`， 和`W <= 10^9`。 

的大值`n`排除显式比较所有山段对的算法。 一个`O(n^2)`方法将大致执行`n(n-1)/2`， 几乎`5 * 10^9`，配对检查`n = 10^5`，这远远超出了七秒的限制所能支持的。 坐标也很大，因此不能选择离散 x 轴。 我们需要直接使用连续分段线性函数。 

三种边界情况通常会导致错误的实现。 首先，最佳间隔可以恰好在山的顶点开始或结束。 例如，与`W = 1`和点`(0, 10), (1, 20)`, 区间`[0, 1]`有平均数`15`，所以正确的输出是`15.000000000`。 仅严格搜索段内部的实现可能会错过最佳值。 

其次，最佳起始位置不一定是山顶点或移动顶点。 考虑```
3 2
0 0
2 10
4 0
```间隔`[1, 3]`有面积`15`，因此平均`7.5`。 正确的输出是`7.500000000`。 仅检查位置的搜索`x_i`和`x_i-W`会检查`0`,`2`， 和`4`，并且错过了真正的最佳值`x = 1`。 

第三，部分相机间隔可能位于所提供的山之外。 为了```
2 10
0 10
1 20
```整座山都包含在`[0, 10]`。 它的面积是三角形/梯形面积`15`，所以答案是`1.500000000`。 将最后一个输入点视为山继续其最终坡度会产生完全不同的答案。 该语句明确将所提供的景观之外的海拔定义为零。 

## 方法

 直接的暴力方法可以处理每个部分`y(x)`以及移位函数的每一段`y(x + W)`作为可能的一对。 在两者都是固定线性函数的区间内，它们的差是线性的，因此可以用初等微积分精确地处理面积函数。 困难在于第一个函数的一个段可以与第二个函数的许多移位段重叠，并且在最坏的情况下有`O(n^2)`这样的对。 和`n = 10^5`，这意味着大约`5 * 10^9`配对关系，甚至在考虑对每个关系进行算术之前。 

关键的观察是我们永远不需要考虑任意的​​线段对。 定义`F(x) = integral from x to x+W of y(t) dt`。 

期望的平均值是`F(x) / W`， 和`W`是固定的，所以最大化平均值意味着最大化`F(x)`。 

根据微积分基本定理，`F'(x) = y(x + W) - y(x)`。 

这大大改变了问题。 公式唯一的位置`F'(x)`可以改变的是位置`x`穿过原始山的顶点或`x + W`跨越一。 这些位置正是`x_i`和`x_i - W`。 

对这些事件位置进行排序后，两个连续事件之间的每个间隔都有一个非常简单的结构。 两个都`y(x)`和`y(x+W)`在那里是线性的，所以`F'(x)`是线性的并且`F(x)`是二次的。 

一个区间上的二次方只有两种方法才能达到其最大值。 它可以在端点处达到它，或者，当二次方程是凹的时，在其驻点处达到它。 因此，每个事件间隔仅需要其两个端点和至多一个内部候选者。 

在建立山的前缀积分后，可以在恒定时间内评估该区域本身。 事件位置可以排序`O(n log n)`，每个事件都可以通过二分查找找到相关的山段。 这给出了一个`O(n log n)`解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了|
 | 最佳| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 构建分段线性山和前缀区域数组。 对于每个顶点`x_i`，存储山下从第一个顶点到`x_i`。 这让我们可以计算任意区间下的面积`[a,b]`作为`A(b) - A(a)`。 
2. 定义`F(x) = A(x + W) - A(x)`。 这正是左边缘位于`x`，所以最大化`F`解决了原来的问题。 
3. 创建所有事件位置`0`， 每一个`x_i`，以及每个非负`x_i - W`。 第一组标记在哪里`y(x)`改变其线性段。 第二个移动组标记了`y(x + W)`更改其段。 位置`0`包含在内是因为相机从非负 x 轴开始。 
4. 对事件位置进行排序和去重。 两个连续事件之间`[L,R]`， 两者都不`y(x)`也不`y(x+W)`穿过一个顶点，因此两个函数在整个区间内都是线性的。 
5. 评估`F(L)`和`F(R)`对于每个事件间隔。 现在涵盖了事件中出现的每个全局最大值。 
6. 区间内`[L,R]`，得到斜率`y(x)`和斜率`y(x+W)`通过在中点评估两者。 他们的区别在于斜率`F'(x)`。 自从`F'(x)`是线性的，其斜率在整个区间内是恒定的。 
7. 如果斜率`F'`是负数，`F`是凹在`[L,R]`。 它的驻点是可能的内部最大值。 计算零`F'(x)`并评估`F`如果它位于区间内。 如果斜率非负，`F`是线性的或凸的，因此它在区间上的最大值已经在端点处。 
8. 保留找到的最大面积并将其除以`W`打印答案时。 打印小数点后九位数字足以满足要求`10^-6`宽容。 

该算法背后的不变量是每个可能的最大化器要么位于一个事件位置，要么恰好位于一个事件间隔内。 在每个这样的间隔上，`F'(x)`是线性的，所以`F(x)`是二次的。 二次方没有其他类型的局部最大值。 因此，当二次方程为凹时，检查端点和单个驻点涵盖了每个可能的全局最大值。 

## Python 解决方案```python
import sys
from bisect import bisect_right

def solve():
    input = sys.stdin.readline

    n, W = map(int, input().split())
    xs = [0] * n
    ys = [0] * n

    for i in range(n):
        xs[i], ys[i] = map(int, input().split())

    # pref[i] = area under the mountain from xs[0] to xs[i].
    pref = [0.0] * n
    for i in range(1, n):
        dx = xs[i] - xs[i - 1]
        pref[i] = pref[i - 1] + dx * (ys[i - 1] + ys[i]) * 0.5

    total_area = pref[-1]

    def area(t):
        """Integral of y from xs[0] to t."""
        if t <= xs[0]:
            return 0.0
        if t >= xs[-1]:
            return total_area

        i = bisect_right(xs, t) - 1
        dx = t - xs[i]
        slope = (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i])

        return pref[i] + ys[i] * dx + 0.5 * slope * dx * dx

    def value_slope(t):
        """Return y(t) and the slope of y at t."""
        if t < xs[0] or t > xs[-1]:
            return 0.0, 0.0

        if t == xs[-1]:
            return float(ys[-1]), 0.0

        i = bisect_right(xs, t) - 1
        dx = t - xs[i]
        slope = (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i])
        value = ys[i] + slope * dx

        return value, slope

    # The derivative can change only when x or x + W
    # reaches an input vertex.
    events = {0}
    for x in xs:
        events.add(x)
        if x >= W:
            events.add(x - W)

    events = sorted(events)

    def captured_area(x):
        return area(x + W) - area(x)

    best = captured_area(0)

    for k in range(len(events) - 1):
        L = events[k]
        R = events[k + 1]

        if L == R:
            continue

        best = max(best, captured_area(L), captured_area(R))

        mid = (L + R) * 0.5

        y1, s1 = value_slope(mid)
        y2, s2 = value_slope(mid + W)

        # F'(x) = y(x + W) - y(x)
        # Its slope is s2 - s1.
        derivative_slope = s2 - s1

        derivative_at_mid = y2 - y1
        derivative_at_left = (
            derivative_at_mid
            + derivative_slope * (L - mid)
        )

        # F is concave exactly when F' is decreasing.
        if derivative_slope < 0.0:
            root = L - derivative_at_left / derivative_slope

            if L < root < R:
                best = max(best, captured_area(root))

    print(f"{best / W:.9f}")

if __name__ == "__main__":
    solve()
```前缀数组存储梯形区域。 在连续的顶点之间，山有方程`y(x) = y_i + s(x-x_i)`，所以部分线段上的面积是`y_i * dx + s * dx² / 2`。 这`area`函数将部分梯形与已经积累的前缀区域结合起来。 

这`value_slope`函数返回坐标处的高程和坡度。 在提供的山之外，两者均为零，这可以处理端点之外所需的零高程。 在最后一个顶点，右侧坡度也为零，因为景观在那里结束。 

事件集包含`x_i - W`仅当它为非负时，因为相机的左边缘仅限于非负 x 轴。 包括`x_i - W`是捕捉相机右边缘穿过山峰顶点所引起的变化。 

中点用于获取事件间隔内的斜率。 它不能与事件重合，因此对于应使用哪个线性段没有任何歧义。 然后，通过从中点沿恒定导数斜率移动来获得左端点处的导数。 

表达式`root = L - derivative_at_left / derivative_slope`直接来自求解线性方程`F'(x) = 0`。 我们仅在以下情况下检查此根：`F'`是递减的，因为只有此时对应的驻点才是最大值而不是最小值。 

所有坐标和面积计算都适合 Python 的整数和浮点表示形式。 最大可能的面积约为`10^13`，而双精度提供的精度远高于绝对或相对误差所需的精度`10^-6`。 

## 工作示例

 ### 示例 1

 对于```
4 20
0 10
20 20
30 5
60 30
```事件位置是`0, 10, 20, 30, 40, 60`。 相关扫描可总结如下。 

| 间隔 | 候选人类型 | 占领区| 平均 |
 | --- | --- | --- | --- |
 |`[0, 10]`| 端点/驻点| 最多 400 | 最多 20 |
 |`[10, 20]`| 端点/驻点| 最多 400 | 最多 20 |
 |`[20, 30]`| 端点/驻点| 最多 400 | 最多 20 |
 |`[30, 40]`| 端点/驻点| 最多 400 | 最多 20 |
 |`[40, 60]`| 终点`x = 40`|`1300 / 3`|`65 / 3`|

 最后一个区间包含最优值。 相机盖`[40,60]`，山从高度线性上升`13.333...`到`30`。 其面积为`433.333...`，并除以宽度`20`给出`21.666666667`，与官方样品相符。 

### 示例 2

 对于```
3 1
10 50
90 50
1000 49
```山在高处是水平的`50`几乎整个有用区域。 接近开始和结束的相关事件位置包括`0`,`10`,`89`,`90`,`999`， 和`1000`。 

| 间隔 | 相机区域| 最大相关平均值|
 | --- | --- | --- |
 |`[0, 10]`| 部分在外，则高度 50 | 低于 50 |
 |`[10, 89]`| 完全在 50 高度 | 50 | 50
 |`[89, 90]`| 完全在 50 高度 | 50 | 50
 |`[90, 999]`| 开始包括降序部分 | 最多 50 |
 |`[999, 1000]`| 包括较低的高度 | 低于 50 |

 任何完全位于水平部分内的宽度一区间都具有精确的平均值`50`，所以答案是`50.000000000`。 该示例还说明了为什么最大值不必出现在最终顶点处。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 有 O(n) 个事件，排序成本为 O(n log n)，每个事件使用 O(log n) 二分搜索。 |
 | 空间| O(n) | 顶点、前缀区域和事件位置都使用 O(n) 内存。 |

 和`n <= 10^5`，该算法仅对每个事件执行对数数量的操作，而不是数十亿次成对检查。 坐标范围不会影响事件的数量，因此即使 x 坐标达到，运行时间仍然受到控制`10^9`。 官方规定时间限制为七秒，内存限制为256 MB。 

## 测试用例```python
# helper: run the submitted solution on an input string
import sys
import io
from bisect import bisect_right

def solve():
    input = sys.stdin.readline

    n, W = map(int, input().split())
    xs = [0] * n
    ys = [0] * n

    for i in range(n):
        xs[i], ys[i] = map(int, input().split())

    pref = [0.0] * n
    for i in range(1, n):
        dx = xs[i] - xs[i - 1]
        pref[i] = pref[i - 1] + dx * (ys[i - 1] + ys[i]) * 0.5

    total_area = pref[-1]

    def area(t):
        if t <= xs[0]:
            return 0.0
        if t >= xs[-1]:
            return total_area

        i = bisect_right(xs, t) - 1
        dx = t - xs[i]
        slope = (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i])
        return pref[i] + ys[i] * dx + 0.5 * slope * dx * dx

    def value_slope(t):
        if t < xs[0] or t > xs[-1]:
            return 0.0, 0.0
        if t == xs[-1]:
            return float(ys[-1]), 0.0

        i = bisect_right(xs, t) - 1
        dx = t - xs[i]
        slope = (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i])
        return ys[i] + slope * dx, slope

    events = {0}
    for x in xs:
        events.add(x)
        if x >= W:
            events.add(x - W)
    events = sorted(events)

    def captured(x):
        return area(x + W) - area(x)

    best = captured(0)

    for k in range(len(events) - 1):
        L, R = events[k], events[k + 1]

        best = max(best, captured(L), captured(R))

        mid = (L + R) * 0.5
        y1, s1 = value_slope(mid)
        y2, s2 = value_slope(mid + W)

        ds = s2 - s1
        dm = y2 - y1
        dL = dm + ds * (L - mid)

        if ds < 0.0:
            root = L - dL / ds
            if L < root < R:
                best = max(best, captured(root))

    print(f"{best / W:.9f}")

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample 1
assert run(
    """4 20
0 10
20 20
30 5
60 30
"""
) == "21.666666667\n"

# Provided sample 2
assert run(
    """3 1
10 50
90 50
1000 49
"""
) == "50.000000000\n"

# Minimum-size input.
assert run(
    """2 1
0 10
1 20
"""
) == "15.000000000\n"

# Interior stationary point, catches implementations that only inspect events.
assert run(
    """3 2
0 0
2 10
4 0
"""
) == "7.500000000\n"

# Camera width is much larger than the mountain.
assert run(
    """2 10
0 10
1 20
"""
) == "1.500000000\n"

# All equal values.
assert run(
    """4 3
0 7
5 7
10 7
15 7
"""
) == "7.000000000\n"

# Maximum-size input, generated compactly.
n = 100000
parts = [f"{n} 500"]
parts.extend(f"{i} 7" for i in range(n))
large_input = "\n".join(parts) + "\n"

assert run(large_input) == "7.000000000\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 1 / 0 10 / 1 20`|`15.000000000`| 最小输入和终点最佳 |
 |`3 2 / 0 0 / 2 10 / 4 0`|`7.500000000`| 内部驻点|
 |`2 10 / 0 10 / 1 20`|`1.500000000`| 镜头间隔前的风景结束|
 |`4 3 / 0 7 / 5 7 / 10 7 / 15 7`|`7.000000000`| 高度均等 |
 |`100000`等高顶点 |`7.000000000`| 最大限度`n`和渐近性能|

 ## 边缘情况

 对于端点情况```
2 1
0 10
1 20
```事件集是`{0, 1}`。 该算法评估两个相机位置。 在`x = 0`，捕获的区域是有高度的梯形`10`和`20`,给定面积`15`和平均`15`。 不存在丢失的内部最大值，因为面积函数仅在事件间隔上是二次的，并且这里相关间隔没有更好的驻点。 

对于内部最大```
3 2
0 0
2 10
4 0
```事件集是`{0, 2, 4}`。 在`[0,2]`,`y(x)`随坡度上升`5`， 尽管`y(x+2)`有坡度的跌落`-5`。 因此`F'(x)`有坡度`-10`。 在`x = 0`,`F'(0) = 10`，它的零位于`x = 1`。 该算法评估该点并获得面积`15`，给出平均值`7.5`。 这正是导致仅检查断点的算法失败的情况。 

对于比风景更宽的相机，```
2 10
0 10
1 20
```事件集包含`0`和`1`。 后`x = 1`，左边缘已经超出了山的范围，所以捕获的面积为零。 在`x = 0`，相机覆盖整座山体和九个单位的零高度地形。 面积为`15`，所以平均值是`1.5`。 超出最终点的零扩展直接由`area(t)`。 

对于同等高度，```
4 3
0 7
5 7
10 7
15 7
```两个都`y(x)`和`y(x+W)`只要相机完全位于山上，坡度就为零。 最后`F'(x) = 0`每一个这样的位置都是最佳的。 该算法不需要为此特殊情况。 由于导数斜率也为零，因此它只是保留端点值，所有端点值都具有相同的面积。 

对于最大尺寸的情况，生成的输入包含`100000`顶点和恒定高程`7`。 山内的每个摄像头位置都能准确捕捉到`7 * W`面积，所以答案就是`7.000000000`。 事件构造和二分搜索仍然存在`O(n log n)`，这是官方预期的规模`n <= 10^5`约束。
