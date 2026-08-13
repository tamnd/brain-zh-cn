---
title: "CF 102282H - \u0411\u0435\u0437\u0438\u043c\u0435\u043d\u0438"
description: "我们在笛卡尔平面上有两个圆。 每个圆都由其圆心的整数坐标和正整数半径来描述。 任务是确定有多少点属于两个圆，并以足够的数值精度打印这些点。"
date: "2026-08-13T09:12:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102282
codeforces_index: "H"
codeforces_contest_name: "2011, \u041e\u0442\u0431\u043e\u0440\u043e\u0447\u043d\u044b\u0439 \u043a\u043e\u043d\u0442\u0435\u0441\u0442 \u0421\u0413\u0410\u0423 \u043d\u0430 \u0447\u0435\u0442\u0432\u0435\u0440\u0442\u044c\u0444\u0438\u043d\u0430\u043b ACM ICPC"
rating: 0
weight: 102282
solve_time_s: 73
verified: true
draft: false
---

[CF 102282H - \u0411\u0435\u0437\u0438\u043c\u0435\u043d\u0438](https://codeforces.com/problemset/problem/102282/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在笛卡尔平面上有两个圆。 每个圆都由其圆心的整数坐标和正整数半径来描述。 任务是确定有多少点属于两个圆，并以足够的数值精度打印这些点。 两个不同的圆可以有零个、一个或两个公共点。 如果两个圆实际上是同一个圆，则圆上的每个点都是公共的，所以所需的答案是`MANY`。 

坐标和半径范围只有 (10^3)​​，因此输入本身很小。 更重要的是，只有两个几何对象，答案最多包含两个有限点。 因此，解决方案应使用恒定数量的算术运算，而不是在平面上迭代或以数字方式搜索交点。 即使是简单的 (O(1)) 几何推导也能在一秒的限制内轻松完成，并且使用的内存可以忽略不计。 平方距离等整数量最多为 (10^7) 量级，因此 Python 整数运算根本不存在溢出问题。 

如果实现直接跳到交集公式，有几种情况很容易处理错误。 如果圆有相同的圆心和相同的半径，则有无穷多个公共点。 例如，```
0 0 1
0 0 1
```必须产生```
MANY
```基于除以中心之间的距离的公式在这里将除以零。 

如果圆心重合但半径不同，则圆没有公共点。 例如，```
0 0 1
0 0 2
```有输出```
0
```仅检查中心是否重合的粗心实现可能会错误地将其分类为无限多个交叉点。 

两个外切圆恰好有一个交点。 例如，```
0 0 1
2 0 1
```必须产生一个点，`(1, 0)`。 需要两个不同根的浮点比较可能会意外地将相同的切点打印两次。 

内部相切在不同的配置中也存在相同的问题。 为了```
0 0 3
1 0 2
```较小的圆圈与较大的圆圈相接触`(3, 0)`，所以答案又是一点。 

最后，两个圆可以有一个中心在另一个圆内，同时保持完全不相交。 例如，```
0 0 5
1 0 1
```没有交点，因为中心之间的距离小于半径之差。 仅检查中心距离是否小于半径之和会错误地将其视为相交情况。 

## 方法

 直接的暴力方法将尝试通过扫描包含两个圆的区域并测试候选点是否满足两个圆方程来搜索公共点。 由于交叉点坐标是任意实数，因此基于网格的实现必须选择某种数值分辨率。 为了保证坐标在 (10^{-6}) 范围内，需要一个间距约为 (10^{-6}) 的网格。 坐标范围在每个方向上可以跨越大约 2000 个单位，在最坏的情况下给出沿每个轴的大约 (2\cdot10^9) 个位置和大约 (4\cdot10^{18}) 个网格点。 即使在恒定时间内检查单个点也会使这种方法完全不可行，并且降低网格分辨率将不再保证所需的精度。 

蛮力思想在概念上是有效的，因为真正的交点恰好是满足两个圆方程的点，但它失败了，因为平面是连续的，并且所需的精度使得穷举采样变得巨大。 有用的观察是两个圆方程可以代数组合。 减去它们就消除了二次项 (x^2+y^2)，留下一条直线。 每个交点必须位于这条称为根轴的线上。 然后我们可以将第一个圆与该线相交，最多直接给出两个点。 

有一种更简洁的方法来计算坐标。 令中心为 (C_1) 和 (C_2)，并令 (d) 为它们之间的距离。 通过两个中心的线包含公共弦的中点。 如果从 (C_1) 到该弦的距离是 (a)，则毕达哥拉斯定理给出

 [
 a=\frac{r_1^2-r_2^2+d^2}{2d}。 
]

 公共弦垂直于连接中心的线。 如果 (h) 是弦的半长，则

 [
 h^2=r_1^2-a^2。 
]

 通过从 (C_1) 向 (C_2) 移动距离 (a) 可以获得从 (C_1) 到弦的垂线的底部。 然后，垂直单位向量让我们在两个方向上移动 (h) 以获得两个可能的交点。 

在使用这些公式之前，我们使用平方距离对配置进行分类。 这避免了不必要的平方根，并使所有几何比较精确，因为输入值是整数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(4\cdot10^{18})) 候选者以 (10^{-6}) 分辨率进行检查 | (O(1)) | (O(1)) | 太慢了 |
 | 最佳| (O(1)) | (O(1)) | (O(1)) | (O(1)) | 已接受 |

 ## 算法演练

 1. 读取两个圆的圆心和半径。 计算`dx = x2 - x1`,`dy = y2 - y1`，以及中心距的平方`d2 = dx*dx + dy*dy`。 保持`d2`我们不用立即求平方根，而是使用精确的整数比较对所有简并和不相交的配置进行分类。 
2.如果`d2 == 0`并且半径相等，圆重合。 一个圆的每个点都属于另一个圆，所以打印`MANY`并停止。 
3.如果`d2 == 0`并且半径不同，圆是同心但不同的。 他们不能见面，所以打印`0`并停止。 
4. 使用平方比较中心距与半径的总和与差。 如果 (d > r_1+r_2)，则圆在外部分开。 如果 (d < |r_1-r_2|)，则一个圆严格位于另一个圆内部。 在任何一种情况下，交叉点都为零。 
5. 计算

 [
 d=\sqrt{d^2}
 ]

 然后计算

 [
 a=\frac{r_1^2-r_2^2+d^2}{2d}。 
]

 这是沿着连接中心的线从第一个中心到公共弦的距离。 公式如下：写出两个交点的两个直角三角形关系并将它们相减。 

1. 计算

 [
 h^2=r_1^2-a^2。 
]

 对于两个相交的圆，该值是非负的。 因为`a`使用浮点运算计算，切线配置可以产生微小的负值，例如`-1e-12`而不是精确的零。 在求平方根之前将这样的值钳位为零。 

1. 找到从第一中心到公共弦的垂直线的脚：

 [
 p_x=x_1+a\frac{dx}{d},\qquad
 p_y=y_1+a\frac{dy}{d}。 
]

 然后构造一个垂直于中心线的单位向量，

 [
 \left(-\frac{dy}{d},\frac{dx}{d}\right)。 
]

 将此矢量乘以 (h) 即可得出从弦中点到任一交点的位移。 

1. 如果 (h=0)，圆相切，因此两个可能的点重合。 打印一点。 否则打印两者

 [
 (p_x-h\frac{dy}{d},\ p_y+h\frac{dx}{d})
 ]

 和

 [
 (p_x+h\frac{dy}{d},\ p_y-h\frac{dx}{d})。 
]

 顺序并不重要。 

构造背后的不变性是，每个生成的点通过直角三角形关系（a^2+h^2=r_1^2）位于第一个圆上，并且它也位于第二个圆上，因为所选弦位置满足相应的半径方程。 相反，每个公共点必须位于公共弦上，其位置由两个圆方程唯一确定。 垂直构造找到位于第一个圆上的弦上的每个点，因此它精确地产生所有交点。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

def solve():
    x1, y1, r1 = map(int, input().split())
    x2, y2, r2 = map(int, input().split())

    dx = x2 - x1
    dy = y2 - y1
    d2 = dx * dx + dy * dy

    # Coincident centers.
    if d2 == 0:
        if r1 == r2:
            print("MANY")
        else:
            print(0)
        return

    # Disjoint or one circle strictly inside the other.
    sum_r = r1 + r2
    diff_r = abs(r1 - r2)

    if d2 > sum_r * sum_r or d2 < diff_r * diff_r:
        print(0)
        return

    d = math.sqrt(d2)

    # Distance from the first center to the common chord.
    a = (r1 * r1 - r2 * r2 + d2) / (2.0 * d)

    # Half of the common chord length, squared.
    h2 = r1 * r1 - a * a

    # Floating-point roundoff can make a tangent case slightly negative.
    if h2 < 0.0:
        h2 = 0.0

    h = math.sqrt(h2)

    # Midpoint of the common chord.
    px = x1 + a * dx / d
    py = y1 + a * dy / d

    # Unit vector perpendicular to the line between centers.
    ux = -dy / d
    uy = dx / d

    # First intersection point.
    x_a = px + h * ux
    y_a = py + h * uy

    # Tangency: both mathematical constructions give the same point.
    if h == 0.0:
        print(1)
        print(f"{x_a:.10f} {y_a:.10f}")
        return

    # Two distinct intersection points.
    x_b = px - h * ux
    y_b = py - h * uy

    print(2)
    print(f"{x_a:.10f} {y_a:.10f}")
    print(f"{x_b:.10f} {y_b:.10f}")

if __name__ == "__main__":
    solve()
```第一部分计算中心之间的向量及其平方长度。 特殊情况`d2 == 0`必须在一般公式之前处理，因为公式`a`除以中心距。 

接下来的两个比较使用整数平方。 条件`d2 > (r1 + r2)^2`表示圆之间的距离大于其半径之和。 条件`d2 < (r1 - r2)^2`表示中心距小于绝对半径差，因此一个圆严格位于另一个圆内部。 故意不拒绝任一比较中的相等，因为相等意味着相切，这给出了一个有效的交点。 

在知道配置有一个或两个交叉点后，代码计算`d`， 其次是`a`和`h2`。 表达式为`a`是中心几何公式。 价值`h2`确定公共弦是否具有正长度或已折叠到单个切点。 

这`if h2 < 0.0`校正仅处理浮点舍入。 使用精确的整数比较已经拒绝了真正的不相交配置，因此这里的小负值只能由接近相切的算术错误产生。 

沿中心到中心方向计算公共弦的中点。 向量`(-dy / d, dx / d)`垂直于该方向且长度为一，因此将其乘以`h`准确给出从弦中点到任一交点的偏移。 

Python 中不存在整数溢出问题。 在具有固定宽度整数类型的语言中，仍应根据可用整数范围检查平方表达式，尽管给定的边界对于有符号 64 位整数来说足够小，没有困难。 

## 工作示例

 ### 示例 1

 输入描述了以`(0, 0)`和`(300, 0)`，都具有半径`200`。 

| 步骤|`dx`|`dy`|`d2`|`d`|`a`|`h2`|
 | --- | --- | --- | --- | --- | --- | --- |
 | 初始| 300 | 300 0 | 90000 | 300 | 300 150 | 150 17500 |

 中心距为`300`。 自从`|200 - 200| < 300 < 200 + 200`，圆相交两次。 和弦中点是`(150, 0)`，半弦长度为 (\sqrt{17500})，大约`132.2875656`。 垂直方向是垂直的，所以两点近似`(150, 132.2875656)`和`(150, -132.2875656)`。 

根据规定的格式输出为：```
2
150.0000000 132.2875656
150.0000000 -132.2875656
```该结构围绕连接中心的线对称，正如几何预测的那样。 

### 示例 2

 圆圈的中心位于`(0, 0)`和`(0, 2)`，都具有半径`1`。 

| 步骤|`dx`|`dy`|`d2`|`d`|`a`|`h2`|
 | --- | --- | --- | --- | --- | --- | --- |
 | 初始| 0 | 2 | 4 | 2 | 1 | 0 |

 这里，圆心距等于半径之和，因此圆是外切的。 公共弦的长度为零，因为`h2 = 0`。 其单点是`(0, 1)`。 

输出是：```
1
0.0000000 1.0000000
```该轨迹锻炼了一个和两个交点之间的边界，并显示了为什么切线情况不得打印同一点两次。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(1)) | (O(1)) | 执行固定数量的算术运算和比较。 |
 | 空间| (O(1)) | (O(1)) | 仅存储恒定数量的标量变量和输出坐标。 |

 约束远小于 (O(1)) 几何解决方案所需的约束。 该算法仅执行少量整数运算、平方根、除法和格式化操作，因此它很容易满足一秒的时间限制，并且基本上不使用内存。 

## 测试用例

 下面的测试工具比较几何答案，而不需要对两个交点进行精确排序。 它还检查特殊`MANY`情况和所需的点数。```python
import sys
import io
import math

input = sys.stdin.readline

def solve():
    x1, y1, r1 = map(int, input().split())
    x2, y2, r2 = map(int, input().split())

    dx = x2 - x1
    dy = y2 - y1
    d2 = dx * dx + dy * dy

    if d2 == 0:
        if r1 == r2:
            print("MANY")
        else:
            print(0)
        return

    sum_r = r1 + r2
    diff_r = abs(r1 - r2)

    if d2 > sum_r * sum_r or d2 < diff_r * diff_r:
        print(0)
        return

    d = math.sqrt(d2)
    a = (r1 * r1 - r2 * r2 + d2) / (2.0 * d)
    h2 = r1 * r1 - a * a

    if h2 < 0.0:
        h2 = 0.0

    h = math.sqrt(h2)

    px = x1 + a * dx / d
    py = y1 + a * dy / d

    ux = -dy / d
    uy = dx / d

    x_a = px + h * ux
    y_a = py + h * uy

    if h == 0.0:
        print(1)
        print(f"{x_a:.10f} {y_a:.10f}")
        return

    x_b = px - h * ux
    y_b = py - h * uy

    print(2)
    print(f"{x_a:.10f} {y_a:.10f}")
    print(f"{x_b:.10f} {y_b:.10f}")

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

def parse_output(out: str):
    lines = out.strip().splitlines()

    if lines == ["MANY"]:
        return "MANY", []

    n = int(lines[0])
    points = []

    for line in lines[1:]:
        x, y = map(float, line.split())
        points.append((x, y))

    assert len(points) == n
    return n, points

def assert_points_on_circles(inp: str, out: str):
    data = list(map(int, inp.split()))
    x1, y1, r1, x2, y2, r2 = data

    result, points = parse_output(out)

    if result == "MANY":
        assert x1 == x2 and y1 == y2 and r1 == r2
        return

    for x, y in points:
        d1 = (x - x1) ** 2 + (y - y1) ** 2
        d2 = (x - x2) ** 2 + (y - y2) ** 2

        assert abs(d1 - r1 * r1) <= 1e-5 * max(1.0, r1 * r1)
        assert abs(d2 - r2 * r2) <= 1e-5 * max(1.0, r2 * r2)

# Provided sample 1.
sample1 = """\
0 0 200
300 0 200
"""
out = run(sample1)
result, points = parse_output(out)
assert result == 2, "sample 1 count"
assert_points_on_circles(sample1, out)

# Provided sample 2.
sample2 = """\
0 0 1
0 2 1
"""
out = run(sample2)
result, points = parse_output(out)
assert result == 1, "sample 2 count"
assert_points_on_circles(sample2, out)
assert abs(points[0][0]) < 1e-9
assert abs(points[0][1] - 1.0) < 1e-9

# Custom case 1: coincident circles, the minimum radius.
case1 = """\
0 0 1
0 0 1
"""
assert run(case1).strip() == "MANY", "coincident circles"

# Custom case 2: concentric circles with different radii.
case2 = """\
0 0 1
0 0 2
"""
assert run(case2).strip() == "0", "concentric distinct circles"

# Custom case 3: internal tangency.
case3 = """\
0 0 3
1 0 2
"""
out = run(case3)
result, points = parse_output(out)
assert result == 1, "internal tangency count"
assert_points_on_circles(case3, out)
assert abs(points[0][0] - 3.0) < 1e-9
assert abs(points[0][1]) < 1e-9

# Custom case 4: maximum-size coordinates and radii, two intersections.
case4 = """\
-1000 -1000 1000
1000 -1000 1000
"""
out = run(case4)
result, points = parse_output(out)
assert result == 2, "maximum-size two-intersection case"
assert_points_on_circles(case4, out)

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`0 0 200`/`300 0 200`| 两个交点 | 一般二路口施工|
 |`0 0 1`/`0 2 1`| 一点在`(0, 1)`| 外切线|
 |`0 0 1`/`0 0 1`|`MANY`| 重合圆和被零除的预防 |
 |`0 0 1`/`0 0 2`|`0`| 不同半径的同心圆 |
 |`0 0 3`/`1 0 2`| 一点在`(3, 0)`| 内切线 |
 |`-1000 -1000 1000`/`1000 -1000 1000`| 两个交点 | 最大尺寸坐标和半径|

 ## 边缘情况

 对于重合圆，请考虑```
0 0 1
0 0 1
```中心距的平方为零，半径相等。 该算法立即打印`MANY`在尝试计算中心距离作为除数之前。 这里的不变量是两个方程描述完全相同的点集。 

对于不同半径的同心圆，```
0 0 1
0 0 2
```中心距的平方再次为零，但半径不同。 算法打印`0`。 具有相同圆心的两个圆只有半径相等才可以共享点。 

对于外切线，```
0 0 1
2 0 1
```中心距的平方为`4`，正好等于`(1 + 1)^2`。 不相交条件使用`>`而不是`>=`，因此该情况​​在交集计算中仍然有效。 结果值为`h2`为零，给出单点`(1, 0)`。 

对于内切线，```
0 0 3
1 0 2
```中心距正好是`|3 - 2| = 1`。 同样，严格的不等式并不拒绝该配置。 公式给出`a = 3`和`h2 = 0`, 生产`(3, 0)`，小圆与大圆相接触的点。 

为了严格遏制，```
0 0 5
1 0 1
```中心距是`1`，而半径差为`4`。 由于 (1^2 < 4^2)，算法立即打印`0`。 此分类不需要平方根或浮点计算。 

对于两个普通的交叉路口，```
0 0 2
3 0 2
```中心距是`3`，严格位于半径差之间`0`和半径总和`4`。 算法到达构造阶段，得到`a = 1.5`，并获得正的`h2`，所以它打印两个对称点。 它们围绕连接中心的线的对称性直接源于垂直单位向量的使用。 

主要数值边界是相切。 精确的几何值`h2`那里为零，但浮点计算可以产生一个微小的负数。 夹紧`h2`归零可以防止`math.sqrt`避免失败，同时保持所有真正有效的两相交案例不变。
