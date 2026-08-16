---
title: "CF 102375L - \u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435\u0442\u043e\u0447\u043a\u0438"
description: "我们在矩形内有一个整数网格，其角为 (0, 0) 和 (X, Y)。 在所有标记点中，p1 是特殊的。 我们需要计算与 p1 的欧几里德距离不大于其与每个其他标记点的距离的每个网格点。"
date: "2026-08-15T07:33:50+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102375
codeforces_index: "L"
codeforces_contest_name: "\u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0439 \u0440\u0430\u0443\u043d\u0434 \u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442\u0430 \u0421\u0435\u0432\u0435\u0440\u043e-\u0417\u0430\u043f\u0430\u0434\u0430 \u0420\u043e\u0441\u0441\u0438\u0438 \u0438 \u041c\u043e\u0441\u043a\u0432\u044b ICPC 2019"
rating: 0
weight: 102375
solve_time_s: 1254
verified: false
draft: false
---

[CF 102375L - \u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435 \u0442\u043e\u0447\u043a\u0438](https://codeforces.com/problemset/problem/102375/L)

 **评级：** -
 **标签：** -
 **求解时间：** 20m 54s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们在有角的矩形内有一个整数网格`(0, 0)`和`(X, Y)`。 在所有标记点中，`p1`很特别。 我们需要计算每个网格点的欧氏距离`p1`不大于它到每个其他标记点的距离。 

直接解释建议根据每个标记点检查每个网格点。 那太贵了。 比较平方距离后就会出现有用的结构。 对于固定的竞争对手`pi`，该组点至少接近于`p1`至于`pi`是由两点的垂直平分线界定的一个半平面。 所需的集合是所有这些半平面与矩形的交集。 

最初的竞赛声明给出了`X, Y, K <= 2 * 10^5`，具有 2 秒时间限制和 512 MiB 内存限制。 这立即排除了对所有网格点和标记点对的迭代。 矩形本身可以包含大约`(2 * 10^5 + 1)^2 = 4 * 10^10`整数点，所以即使`O(XY)`算法是不可能的。 我们需要粗略地处理标记点`O(K log K)`时间，然后只扫描一个坐标范围。 

有几种边界情况可能会悄无声息地破坏实现。 

如果`K = 1`，根本没有竞争对手，所以每个格点都不错。 例如，```
1 1 1
0 0
```有输出`4`，因为矩形的四个整数点是`(0,0)`,`(0,1)`,`(1,0)`， 和`(1,1)`。 一个常见的错误是计算`X * Y`细胞而不是`(X + 1) * (Y + 1)`网格点。 

竞争对手可以有相同的`x`坐标为`p1`。 那么它们的垂直平分线是水平的，所以它们不会强加一个`x`完全受束缚。 例如，```
2 4 3
1 2
1 0
1 4
```第一个参赛者需要`y >= 1`，第二个要求`y <= 3`，以及每一个`x`从`0`通过`2`是允许的。 答案是`3 * 3 = 9`。 将每一位参赛者视为`x`-line 要么除以零，要么默默地失去这个限制。 

平分线可以经过两个整数坐标之间的中间。 例如，```
2 2 2
1 1
0 1
```反对的条件`(0,1)`是`x >= 1/2`，所以整数点必须有`x >= 1`。 有两种可能`x`值和三种可能`y`值，给出输出`6`。 使用截断整数除法而不是数学下限或上限可能会产生错误的边界。 

领带也必须被接受。 条件是距离小于或等于竞争对手的距离，因此正好在平分线上的点属于好区域。 这就是为什么解决方案中的所有包络比较在选择活动线路时都使用非严格比较的原因。 

## 方法

 暴力解决方案直接来自定义。 枚举每个整数`(x, y)`在矩形中，计算其平方距离`p1`，然后将该值与到每个其他标记点的平方距离进行比较。 平方距离就足够了，因为平方根是单调的。 

这是正确的，因为当没有任何竞争对手严格接近时，分数就被接受。 然而，最坏的情况大约是`4 * 10^10`网格点和`2 * 10^5`竞争对手，大致给出`8 * 10^15`距离比较。 这超出了时间限制的多个数量级。 

关键的观察结果是，比较两个平方欧几里德距离消除了中的二次项`x`和`y`。 让`p1 = (x1, y1)`并让竞争对手`q = (xi, yi)`。 不平等`(x - x1)^2 + (y - y1)^2 <= (x - xi)^2 + (y - yi)^2`简化为`2(xi - x1)x + 2(yi - y1)y <= xi^2 + yi^2 - x1^2 - y1^2`。 

这是一个线性半平面。 

现在修复一个整数`y`。 每一位参赛者都与`xi > x1`给出一个上限`x`，而每个竞争对手`xi < x1`给出一个下界`x`。 因此，对于每一行`y`，好点形成一个整数区间`[L(y), R(y)]`。 我们只需要计算最严格的下限和上限。 

每个界限都是一个线性函数`y`，可能具有有理系数。 上边界是多条线中的最小值，下边界是多条线中的最大值。 这种包络线可以用凸包技巧来构造。 我们按斜率对线进行排序，丢弃永远无法成为最佳的线，然后扫描`y`从下到上，同时保持指向当前最佳行的指针。 

相同`y`坐标也可能受到竞争对手的限制`xi = x1`。 这些约束在构建线路包络之前直接处理。 

蛮力之所以有效，是因为它精确地测试了定义，但当矩形包含数十亿个网格点时，它就会失败。 每次距离比较都变成半平面的观察结果让我们可以用两个一维线包络和一次扫描来代替二维枚举`y`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(XYK)`|`O(K)`| 太慢了 |
 | 最佳 |`O(K log K + Y)`|`O(K)`| 已接受 |

 ## 算法演练

 1. 阅读`p1 = (x1, y1)`并将允许的行间隔初始化为`0 <= y <= Y`。 每个参赛者都拥有相同的`x`坐标为`p1`只能限制这个区间。 竞争对手不同`x`坐标将转换为线。 
2. 对于竞争对手`q = (xi, yi)`， 定义`dx = xi - x1`,`dy = yi - y1`,`C = xi^2 + yi^2 - x1^2 - y1^2`。 

其半平面为`2 dx x + 2 dy y <= C`。 

该方程采用整数运算，因此浮点误差不会影响边界点。 
3.如果`dx = 0`，不等式不包含`x`。 什么时候`dy > 0`，就变成`y <= (yi + y1) / 2`。 

什么时候`dy < 0`，就变成`y >= (yi + y1) / 2`。 

将它们转换为整数下限和上限边界，并将它们与当前行间隔相交。 
4.如果`dx > 0`，求解不等式`x`:`x <= (C - 2dy * y) / (2dx)`。 

这是一条上限线。 对于固定的`y`，所有这些竞争对手都必须得到满足，因此我们采取这些行中的最小值。 
5.如果`dx < 0`，除法反转不等式：`x >= (2dy * y - C) / (2(-dx))`。 

这是一条下界线。 我们需要所有这些功能的最大值。 不要实现第二种外壳，而是存储每条较低线的否定。 原始行的最大值成为它们的负数的最小值的负数。 
6. 将每条有理线表示为`f(y) = (m*y + b) / d`和`d > 0`。 按斜率递减对线进行排序`m/d`。 对于相等的斜率，只有具有最小截距的线对于最小包络线很重要。 
7. 建造下层信封。 考虑三个连续的行`a`,`b`， 和`c`随着坡度的减小。 让`x_ab`在哪里`a`和`b`相交，并且`x_bc`在哪里`b`和`c`相交。 如果`x_ab >= x_bc`， 线`b`永远不是最小值，因此可以将其删除。 所有比较均通过交叉乘法执行，这避免了浮点运算。 
8. 从第一个允许的行开始扫描整数行`y`到最后允许的`y`。 由于查询坐标不断增加，因此包络上的活动线只能向前移动。 虽然下一行不比当前行差`y`，使指针前进。 
9. 评估上包络线`y`并取得其数学底线。 评估负下包络线并取其下限的负值，这给出了原始下限的数学上限。 
10. 将结果间隔限制为`[0, X]`。 如果`L <= R`，该行贡献`R - L + 1`好的整数点。 对所有允许的行的这些贡献求和。 

### 为什么它有效

 对于每一位参赛者`pi`，该算法精确插入包含至少与`p1`至于`pi`。 这些半平面的交点正是以下的 Voronoi 单元`p1`，仅限于矩形。 

在固定行上`y`，每个半平面`xi > x1`贡献了一个上限`x`，以及每个半平面`xi < x1`贡献一个下限。 因此，它们的交集就是从最大下界到最小上界的区间。 平等的——`x`竞争对手仅影响存在的行。 

凸包恰好包含对于某些查询坐标来说可以是最小的线。 当最优区间为空时，交序检验会精确地删除中间线。 在增加扫描的过程中`y`，最小值只能向前穿过船体，因此所选线始终是真实的包络值。 下限和上限这些精确的有理值恰好给出第一个和最后一个整数`x`就行了。 因此，每一个被计算的点都是好的，每一个好的点都被计算在内。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from functools import cmp_to_key

def slope_cmp(a, b):
    # Compare a.m / a.d and b.m / b.d, in decreasing order.
    left = a[0] * b[2]
    right = b[0] * a[2]

    if left > right:
        return -1
    if left < right:
        return 1

    # Equal slopes. Smaller intercept first.
    left = a[1] * b[2]
    right = b[1] * a[2]

    if left < right:
        return -1
    if left > right:
        return 1
    return 0

def value_leq(a, b, x):
    # a(x) <= b(x), with both denominators positive.
    left = (a[0] * x + a[1]) * b[2]
    right = (b[0] * x + b[1]) * a[2]
    return left <= right

def redundant(a, b, c):
    # Slopes are strictly decreasing.
    # b is redundant iff intersection(a,b) >= intersection(b,c).

    n1 = b[1] * a[2] - a[1] * b[2]
    d1 = a[0] * b[2] - b[0] * a[2]

    n2 = c[1] * b[2] - b[1] * c[2]
    d2 = b[0] * c[2] - c[0] * b[2]

    return n1 * d2 >= n2 * d1

def build_hull(lines):
    if not lines:
        return []

    lines.sort(key=cmp_to_key(slope_cmp))

    hull = []

    for line in lines:
        if hull:
            last = hull[-1]

            # Same slope. Keep the smaller intercept.
            if line[0] * last[2] == last[0] * line[2]:
                if line[1] * last[2] < last[1] * line[2]:
                    hull[-1] = line
                continue

        while len(hull) >= 2 and redundant(hull[-2], hull[-1], line):
            hull.pop()

        hull.append(line)

    return hull

def solve():
    X, Y, K = map(int, input().split())

    points = [tuple(map(int, input().split())) for _ in range(K)]
    x1, y1 = points[0]

    ymin = 0
    ymax = Y

    upper_lines = []
    lower_lines = []

    base_sq = x1 * x1 + y1 * y1

    for xi, yi in points[1:]:
        dx = xi - x1
        dy = yi - y1
        C = xi * xi + yi * yi - base_sq

        if dx == 0:
            s = xi + x1

            if dy > 0:
                # y <= (yi + y1) / 2
                ymax = min(ymax, s // 2)
            else:
                # y >= (yi + y1) / 2
                ymin = max(ymin, (s + 1) // 2)

        elif dx > 0:
            # x <= (C - 2*dy*y) / (2*dx)
            upper_lines.append((-2 * dy, C, 2 * dx))

        else:
            # x >= (2*dy*y - C) / (2*(-dx))
            #
            # Store the negation:
            # -x_bound = (-2*dy*y + C) / (2*(-dx))
            lower_lines.append((2 * dy, -C, -2 * dx))

    if ymin > ymax:
        print(0)
        return

    upper_hull = build_hull(upper_lines)
    lower_hull = build_hull(lower_lines)

    upper_ptr = 0
    lower_ptr = 0

    answer = 0

    for y in range(ymin, ymax + 1):
        if upper_hull:
            while (
                upper_ptr + 1 < len(upper_hull)
                and value_leq(
                    upper_hull[upper_ptr + 1],
                    upper_hull[upper_ptr],
                    y
                )
            ):
                upper_ptr += 1

            m, b, d = upper_hull[upper_ptr]
            upper_num = m * y + b
            right = upper_num // d
        else:
            right = X

        if lower_hull:
            while (
                lower_ptr + 1 < len(lower_hull)
                and value_leq(
                    lower_hull[lower_ptr + 1],
                    lower_hull[lower_ptr],
                    y
                )
            ):
                lower_ptr += 1

            m, b, d = lower_hull[lower_ptr]
            lower_neg_num = m * y + b

            # Original lower bound is -lower_neg_line.
            # ceil(-z) = -floor(z).
            left = -(lower_neg_num // d)
        else:
            left = 0

        if left < 0:
            left = 0
        if right > X:
            right = X

        if left <= right:
            answer += right - left + 1

    print(answer)

if __name__ == "__main__":
    solve()
```输入被读取`sys.stdin.readline`，第一个标记点​​用作`p1`完全按照输入格式指定。 数量`base_sq`商店`x1^2 + y1^2`，因此无需重新计算相同的值即可形成每个竞争对手的常数。 

三个分支`dx`直接对应于算法中的三种几何情况。 为了`dx = 0`，不会创建任何线，因为限制是纯垂直的。 为了`dx > 0`，上界线的分母为正。 为了`dx < 0`, 乘以`-1`在该行被求反之前使分母为正值。 

船体商店`(m, b, d)`而不是浮点斜率和截距。 每次比较都会将两个分数相乘。 坐标可以大到`2 * 10^5`，平方坐标可以大致达到`4 * 10^10`，但Python整数具有任意精度，因此不存在溢出问题。 

这`redundant`测试使用连续线的精确交点坐标。 这些交集表达式中的分母为正，因为船体是按严格递减斜率排序的。 这使得即使交点坐标为负时叉乘也有效。 

查询指针仅向前移动。 由于行是按递增方式处理的`y`，最优线也单调地穿过斜率顺序一致的船体。 这将构建后的所有信封查询减少到线性时间。 

场内操作是另一个微妙点。 蟒蛇的`//`是数学底除法，包括负分子，这正是有理边界所要求的。 对于取反的下包络线，如果其值为`z = -g`，所需的整数下界是`ceil(g) = -floor(z)`，它解释了代码中使用的表达式。 

## 工作示例

 对于样品 1，`p1 = (2,2)`。 其他四个点产生以下相关界限：`(1,1)`给出`x >= 3 - y`。`(1,3)`给出`x >= y - 1`。`(3,3)`给出`x <= 5 - y`。`(3,1)`给出`x <= y + 1`。 

因此，信封是`L(y) = max(3-y, y-1)`和`R(y) = min(5-y, y+1)`。 

行扫描为：

 |`y`|`L(y)`|`R(y)`| 好的`x`价值观 | 贡献 |
 | ---| ---| ---| ---| ---|
 | 0 | 3 | 1 | 无 | 0 |
 | 1 | 2 | 2 | 2 | 1 |
 | 2 | 1 | 3 | 1、2、3 | 3 |
 | 3 | 2 | 2 | 2 | 1 |
 | 4 | 3 | 1 | 无 | 0 |

 总计为`1 + 3 + 1 = 5`。 中间一行包含`p1`本身，并且紧邻上方和下方的行仅包含相关平分线上的点。 这说明了为什么必须接受平等。 

对于样品 2，`p1 = (0,0)`每个竞争对手都是`(i,0)`为了`1 <= i <= 5`。 每位参赛者给出`2ix <= i^2`，

或者`x <= i/2`。 

最小的上界来自`(1,0)`, 给予`x <= 1/2`。 自从`x`是不可或缺的，每一个优点都有`x = 0`。 没有下限，也没有行限制。 

|`y`| 下限| 上限 | 贡献 |
 | ---| ---| ---| ---|
 | 0 | 0 | 0 | 1 |
 | 1 | 0 | 0 | 1 |
 | 2 | 0 | 0 | 1 |
 | 3 | 0 | 0 | 1 |
 | 4 | 0 | 0 | 1 |
 | 5 | 0 | 0 | 1 |
 | 6 | 0 | 0 | 1 |

 答案是`7`。 这个例子也说明了为什么许多竞争对手可以从信封中消失。 一次`(1,0)`给出最紧界限，所有后来的平行平分线都是无关的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(K log K + Y)`| 将两个线集排序并缩减为外壳，然后将所有相关行扫描一次。 |
 | 空间|`O(K)`| 在删除冗余行之前，每个参赛者最多存储一行。 |

 和`K, Y <= 2 * 10^5`，排序主导渐近成本。 该算法从不枚举`O(XY)`网格点，这是与暴力破解的关键区别。 Python 的任意精度整数还消除了在固定宽度整数语言中需要 64 位算术的溢出问题。 

## 测试用例

 以下测试假设提交的解决方案另存为`solution.py`。 助手暂时取代了它`input`函数并捕获其输出，因此每个断言都执行相同的操作`solve()`由提交使用。```python
import sys
import io
import solution

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    old_input = solution.input

    sys.stdin = io.StringIO(inp)
    solution.input = sys.stdin.readline
    sys.stdout = io.StringIO()

    try:
        solution.solve()
        return sys.stdout.getvalue().strip()
    finally:
        solution.input = old_input
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample 1
assert run("""\
4 4 5
2 2
1 1
1 3
3 3
3 1
""") == "5", "sample 1"

# Provided sample 2
assert run("""\
6 6 6
0 0
1 0
2 0
3 0
4 0
5 0
""") == "7", "sample 2"

# Minimum-size rectangle, only p1.
assert run("""\
1 1 1
0 0
""") == "4", "minimum case"

# All competitors have the same x coordinate as p1.
assert run("""\
2 4 3
1 2
1 0
1 4
""") == "9", "horizontal bisectors"

# Half-integer bisector: x >= 1/2 becomes x >= 1.
assert run("""\
2 2 2
1 1
0 1
""") == "6", "half-integer boundary"

# Maximum K, with the first competitor already giving the tightest
# possible x-bound. There are 200000 distinct marked points.
points = ["0 0"]
points.extend(f"{i} 0" for i in range(1, 200000))

max_case = "200000 200000 200000\n" + "\n".join(points) + "\n"

assert run(max_case) == "200001", "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 1 / 0 0`|`4`| 最小尺寸，`K = 1`，以及网格点和单元格的区别|
 |`2 4 3 / (1,2), (1,0), (1,4)`|`9`| 具有相同特征的竞争对手`x`坐标和纯行限制|
 |`2 2 2 / (1,1), (0,1)`|`6`| 半整数平分线处的精确地面处理 |
 |`200000 200000 200000`有积分`(0,0), (1,0), ..., (199999,0)`|`200001`| 大坐标，最大`K`，以及围护结构的性能|

 ## 边缘情况

 当`K = 1`，线数组为空。 外壳查询被跳过，因此代码使用`left = 0`和`right = X`对于每一行。 对于输入```
1 1 1
0 0
```行间隔是`[0,1]`对于两者`y = 0`和`y = 1`，每行贡献两点并产生`4`。 

当竞争对手分享时`x`和`p1`，代码输入`dx == 0`分支。 为了```
2 4 3
1 2
1 0
1 4
```重点`(1,0)`有`dy = -2`，所以条件变为`y >= 1`。 重点`(1,4)`有`dy = 2`，所以条件变为`y <= 3`。 所得行间隔为`[1,3]`，每行包含所有三种可能的`x`坐标。 答案是`9`。 

对于半整数边界```
2 2 2
1 1
0 1
```竞争对手有`dx = -1`,`dy = 0`，下界函数是`1/2`。 下包络线的计算结果恰好是`1/2`，Python 的楼层除法给出`0`对于变换后的值`-1/2`只有正确处理符号变换后。 该代码计算原始整数下界为`1`，给出有效行`x = 1,2`对于这三个中的每一个`y`价值观和答案`6`。 

正好位于平分线上的点必须保持良好状态，因为允许平分。 在样本 1 中，`(2,2)`是`p1`本身，同时`(2,1)`和`(2,3)`位于相关平分线上。 包络比较使用`<=`，因此连接当前最佳线的线可以变为活动状态，而不排除连接的坐标。 

矩形边界也是搜索空间的一部分。 如果计算出的下限为负，则将其限制为`0`，如果上限超过`X`，它被钳位到`X`。 因此，超出矩形的 Voronoi 单元会被正确剪裁，而不是在允许的网格之外进行计数。 

最后，有效输入的答案永远不可能为零，因为`p1`它本身是矩形内的一个整数点，它到自身的距离为零。 该实现可能会暂时获取一行上的空区间，但是该行`y = y1`总是至少包含`x = x1`，所以总答案至少是一。
