---
title: "CF 102219H - 你安全吗？"
description: "传感器坐标描述了平面上的一组点。 受影响的区域是包含每个传感器的最短闭合多边形，它正是传感器点的凸包。"
date: "2026-08-20T04:14:24+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102219
codeforces_index: "H"
codeforces_contest_name: "2019 ICPC Malaysia National"
rating: 0
weight: 102219
solve_time_s: 1178
verified: false
draft: false
---

[CF 102219H - 你安全吗？](https://codeforces.com/problemset/problem/102219/H)

 **评级：** -
 **标签：** -
 **求解时间：** 19m 38s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 传感器坐标描述了平面上的一组点。 受影响的区域是包含每个传感器的最短闭合多边形，它正是传感器点的凸包。 我们必须按逆时针顺序打印该船体的顶点，并在最后重复第一个顶点。 

构建完受影响区域后，剩下的坐标就是必须确定其安全性的位置。 严格位于凸包内的位置是不安全的。 在它之外的位置是安全的，并且恰好在其边界上的位置也是安全的。 

传感器数量和位置数量均最多为 50 个，测试用例最多为 50 个。 坐标是 -500 到 500 之间的小范围内的整数。这些界限甚至使 O(CP) 多边形内点检查变得微不足道，但它们也使标准 O(C log C) 凸包特别方便。 不需要浮点几何或复杂的空间数据结构。 整数叉积就足够了，而且它们的量级足够小，可以轻松地适合 Python 整数。 

第一个微妙的情况是边界上的位置。 考虑三个传感器形成一个三角形：```
3 1
0 0
4 0
0 4
2 0
```地点`(2, 0)`正好位于船体边缘，因此输出必须是`2 0 is safe!`。 粗心的多边形内点实现将边界点视为内部点，会错误地将其标记为不安全。 

第二种情况是传感器位于两个实际船体顶点之间的边缘上：```
4 1
0 0
4 0
4 4
0 4
2 0
```重点`(2, 0)`是一个传感器，但它不是最小周长多边形的顶点。 船体应仅包含`(0,0)`,`(4,0)`,`(4,4)`， 和`(0,4)`。 保持每个传感器共线会在打印周边上产生额外的点，即使它们不是多边形顶点。 

第三种情况是所有传感器共线时：```
3 2
0 0
2 0
4 0
1 0
5 0
```凸包退化到两个端点`(0,0)`和`(4,0)`。 没有二维内部，因此两个查询点都是安全的。 盲目假设船体至少有三个顶点的解决方案在这里可能会失败。 

重复的传感器坐标会产生另一个类似的简并性：```
3 1
1 1
1 1
1 1
1 1
```只有一个明显的点，因此受影响的区域没有内部。 查询点位于退化的船体上并且是安全的。 在建造船体之前删除重复项可以自然地处理这个问题。 

## 方法

 直接的强力解决方案可以尝试传感器点的每种可能的排序，将排序封闭为多边形，检查生成的多边形是否包含每个传感器，并保持有效多边形的周长最小。 这是正确的，因为所需的多边形必须在传感器坐标之间具有其顶点，并且检查每个排序最终会考虑最佳排序。 

问题是订单数量。 当 C = 50 时，就有 50 个！ 大约 3.04 × 10^64 种可能的排列。 即使检查一种排列只需要 O(C)，工作量也将达到 50 × 50！，大约 1.52 × 10^66 次基本几何运算。 15 秒的限制远远不允许这种情况发生。 

蛮力之所以有效，是因为答案是一个多边形，其边界由极端传感器点确定。 关键的观察结果是，任何严格位于凸多边形内部的传感器永远都不需要作为最小周长封闭多边形的顶点。 同样，如果多个传感器沿着船体的一个边缘共线，则只有两个端点重要。 剩下的正是凸包。 

一旦传感器被简化为凸包，安德鲁的单调链算法就会在 O(C log C) 时间内构建它。 排序为点提供了确定性的顺序，叉积告诉我们最近添加的点是左转还是右转。 下链或上链中的非左转意味着中间点不能是船体顶点，因此可以将其删除。 

知道船体后，可以通过检查其相对于每个船体边缘的方向来对每个位置进行分类。 因为船体是逆时针方向的，所以严格位于船体内部的点与每个有向边都有正叉积。 零交叉积意味着该点位于边缘上并且必须被分类为安全。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(C·C!) | O(C·C!) | O(C)| 太慢了 |
 | 最佳| O(C log C + CP) | O(C log C + CP) | O(C)| 已接受 |

 ## 算法演练

 1.读取传感器坐标并去除重复点。 重复的坐标不会创建额外的几何信息，因此保留它们只会使船体构造复杂化。 
2. 按字典顺序对不同的传感器点进行排序`(x, y)`。 这为安德鲁算法提供了所需的排序，并且还使最左边和最右边的点具有确定性。 
3. 从左到右搭建下船体。 对于每个新点，将其附加并检查最后三个点。 如果它们的叉积小于或等于零，则删除中间点。 负叉积意味着顺时针旋转，因此中点位于边界内。 零叉积意味着三个点共线，并且不需要中间点作为外壳顶点。 
4. 使用相同的规则构建上壳，但以相反的顺序处理排序点。 连接下部链和上部链以逆时针顺序给出完整的凸包。 
5. 删除连接两个链时创建的重复端点。 结果列表仅包含每个实际的外壳顶点一次。 
6. 在其自己的行上打印每个外壳顶点，然后再次打印第一个顶点。 单调链结构提供逆时针方向，因此不需要额外的排序或旋转。 
7. 对于每个查询位置，首先处理退化外壳。 如果不同的船体顶点少于三个，则船体没有二维内部，因此每个位置都是安全的。 
8. 对于正确的多边形，计算每个有向外壳边与从该边的起点到查询点的向量的叉积。 如果任何叉积为负，则该位置位于外部。 如果任何叉积为零，则它位于边界上并且是安全的。 只有当每个叉积都严格为正时，该位置才严格位于内部，因此是不安全的。 

### 为什么它有效

 凸包是包含所有传感器的最小凸集。 任何最小周长的封闭多边形都可以用该凸包的边界替换，而不增加周长，同时每个传感器保持封闭。 因此，所需的周长恰好由凸包顶点组成，省略了两个顶点之间的共线点。 

安德鲁算法保持了每个当前链都是已处理点的有效凸边界的不变性。 每当最后三个点进行非左转时，中间点就不可能是凸包的极值点，因此删除它可以保留正确的边界。 处理完两个方向上的每个点后，两条链形成完整的凸包。 

对于逆时针凸多边形，每个内部点严格位于每个有向边的左侧。 因此，所有边交叉积对于严格内部的点来说都是正的。 零交叉积标识边界，该问题明确将其分类为安全。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def cross(a, b, c):
    return (b[0] - a[0]) * (c[1] - a[1]) - \
           (b[1] - a[1]) * (c[0] - a[0])

def convex_hull(points):
    points = sorted(set(points))

    if len(points) <= 1:
        return points

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

def strictly_inside(hull, p):
    n = len(hull)

    if n < 3:
        return False

    for i in range(n):
        a = hull[i]
        b = hull[(i + 1) % n]
        value = cross(a, b, p)

        if value <= 0:
            return False

    return True

def solve():
    t = int(input())
    output = []

    for case_no in range(1, t + 1):
        c, p = map(int, input().split())

        sensors = [tuple(map(int, input().split())) for _ in range(c)]
        locations = [tuple(map(int, input().split())) for _ in range(p)]

        hull = convex_hull(sensors)

        output.append(f"Case {case_no}")

        if hull:
            for x, y in hull:
                output.append(f"{x} {y}")
            output.append(f"{hull[0][0]} {hull[0][1]}")

        for x, y in locations:
            if strictly_inside(hull, (x, y)):
                status = "unsafe!"
            else:
                status = "safe!"
            output.append(f"{x} {y} is {status}")

        if case_no != t:
            output.append("")

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    solve()
```这`cross`函数计算由三个点形成的三角形的有符号面积乘以二。 它的标志就是船体建造所需要的。 正值表示逆时针旋转，零表示共线性，负值表示顺时针旋转。 

这`convex_hull`函数首先使用`set`消除重复的坐标，然后对点进行排序。 这`<= 0`条件是故意的。 使用`< 0`将保留船体边缘上的共线点，但所需的周长由实际的多边形顶点组成，因此必须删除中间的共线传感器。 

这两个链共享他们的第一点和最后一点，这就是为什么`lower[:-1]`和`upper[:-1]`是串联的。 这可以避免在外壳表示内重复这些端点。 第一个外壳点再次单独打印，因为所需的输出明确地闭合了多边形。 

遏制测试仅使用整数算术。 仅当每个叉积都严格为正时，查询才是不安全的。 叉积为零立即返回`False`，正确地将边或顶点视为安全。 Python 整数不会溢出，尽管在坐标范围内实际乘积已经非常小。 

该实现在任何地方都不使用浮点。 这对于这个问题很有用，因为一个点可以精确地位于边缘上，并且浮点比较可以将精确的边界情况转变为不正确的内部或外部分类。 

## 工作示例

 ### 示例案例1

 这六个传感器是：```
(-477,-180)
(31,-266)
(-474,28)
(147,49)
(323,-53)
(277,-79)
```排序后，安德鲁算法删除`(277,-79)`因为它位于周围船体顶点形成的转弯内。 生成的外壳有五个顶点。 

| 舞台| 当前操作| 赫尔州|
 | --- | --- | --- |
 | 排序点 | 从左到右处理|`(-477,-180), (-474,28), (31,-266), (147,49), (277,-79), (323,-53)`|
 | 下船体| 删除顺时针/共线转弯 |`(-477,-180), (31,-266), (323,-53)`|
 | 上船体| 逆向过程 |`(-477,-180), (-474,28), (147,49), (323,-53)`|
 | 组合船体| 加入两条链 |`(-477,-180), (31,-266), (323,-53), (147,49), (-474,28)`|
 | 闭合多边形| 重复第一点|`(-477,-180)`|

 对于这五个地点来说，`(-139,-183)`对每个船体边缘产生正叉积，因此它严格位于内部且不安全。 其他四个地点要么在外面，要么在边界上，所以都是安全的。 输出开始于`(-477,-180)`，沿着船体逆时针方向移动，并以重复该点结束。 

### 示例案例2

 这五个传感器是：```
(-52,-325)
(104,420)
(315,356)
(-192,8)
(493,146)
```所有五个点都是船体顶点。 

| 舞台| 当前操作| 赫尔州|
 | --- | --- | --- |
 | 排序点 | 从左到右处理|`(-192,8), (-52,-325), (104,420), (315,356), (493,146)`|
 | 下船体| 删除非左转弯 |`(-192,8), (-52,-325), (493,146)`|
 | 上船体| 逆向过程 |`(-192,8), (104,420), (315,356), (493,146)`|
 | 组合船体| 加入两条链 |`(-192,8), (-52,-325), (493,146), (315,356), (104,420)`|
 | 闭合多边形| 重复第一点|`(-192,8)`|

 查询`(404,228)`严格位于内部，因为每条边都在其左侧看到它。 因此它是不安全的。 查询`(-239,484)`位于多边形之外并且是安全的。 

这两条轨迹还说明了为什么船体是通过转弯而不是通过测试每个可能的多边形来构建的。 一旦局部转弯证明它们是不必要的，无法保留在凸边界上的点就会消失。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(C log C + CP) | O(C log C + CP) | 排序主导船体构造，然后每个位置最多检查 C 个船体边缘 |
 | 空间| O(C)| 排序后的点和两个外壳链包含 O(C) 个点 |

 当 C 和 P 最多为 50 时，一个测试用例的最坏情况在 O(C log C) 排序后仅执行几千次叉积运算。 即使有 50 个测试用例，这也完全在 15 秒的限制之内，并且与 256 MB 的限制相比，使用的内存可以忽略不计。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

input = sys.stdin.readline

def cross(a, b, c):
    return (b[0] - a[0]) * (c[1] - a[1]) - \
           (b[1] - a[1]) * (c[0] - a[0])

def convex_hull(points):
    points = sorted(set(points))

    if len(points) <= 1:
        return points

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

def strictly_inside(hull, p):
    if len(hull) < 3:
        return False

    for i in range(len(hull)):
        if cross(hull[i], hull[(i + 1) % len(hull)], p) <= 0:
            return False

    return True

def solve():
    t = int(input())
    output = []

    for case_no in range(1, t + 1):
        c, p = map(int, input().split())
        sensors = [tuple(map(int, input().split())) for _ in range(c)]
        locations = [tuple(map(int, input().split())) for _ in range(p)]

        hull = convex_hull(sensors)

        output.append(f"Case {case_no}")

        for x, y in hull:
            output.append(f"{x} {y}")
        if hull:
            output.append(f"{hull[0][0]} {hull[0][1]}")

        for x, y in locations:
            status = "unsafe!" if strictly_inside(hull, (x, y)) else "safe!"
            output.append(f"{x} {y} is {status}")

        if case_no != t:
            output.append("")

    return "\n".join(output)

def run(inp: str) -> str:
    global input
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline
    try:
        return solve()
    finally:
        sys.stdin = old_stdin

sample = """\
2
6 5
-477 -180
31 -266
-474 28
147 49
323 -53
277 -79
346 488
-139 -183
-427 129
386 -222
-408 -315
5 2
-52 -325
104 420
315 356
-192 8
493 146
404 228
-239 484
"""

expected_sample = """\
Case 1
-477 -180
31 -266
323 -53
147 49
-474 28
-477 -180
346 488 is safe!
-139 -183 is unsafe!
-427 129 is safe!
386 -222 is safe!
-408 -315 is safe!

Case 2
-192 8
-52 -325
493 146
315 356
104 420
-192 8
404 228 is unsafe!
-239 484 is safe!"""

assert run(sample) == expected_sample, "provided sample"

minimum_triangle = """\
1
3 4
0 0
4 0
0 4
2 2
2 0
5 5
0 4
"""

expected_minimum_triangle = """\
Case 1
0 0
4 0
0 4
0 0
2 2 is unsafe!
2 0 is safe!
5 5 is safe!
0 4 is safe!"""

assert run(minimum_triangle) == expected_minimum_triangle, \
    "minimum-size triangle and boundary cases"

collinear = """\
1
3 3
0 0
2 0
4 0
1 0
4 0
5 0
"""

expected_collinear = """\
Case 1
0 0
4 0
0 0
1 0 is safe!
4 0 is safe!
5 0 is safe!"""

assert run(collinear) == expected_collinear, \
    "collinear sensors"

duplicates = """\
1
5 3
1 1
1 1
1 1
2 2
2 2
1 1
2 2
0 0
"""

expected_duplicates = """\
Case 1
1 1
2 2
1 1
1 1 is safe!
2 2 is safe!
0 0 is safe!"""

assert run(duplicates) == expected_duplicates, \
    "duplicate and collinear sensors"

boundary_square = """\
1
8 5
0 0
10 0
10 10
0 10
5 0
10 5
5 10
0 5
5 5
0 0
10 10
11 5
5 10
"""

expected_boundary_square = """\
Case 1
0 0
10 0
10 10
0 10
0 0
5 5 is unsafe!
0 0 is safe!
10 10 is safe!
11 5 is safe!
5 10 is safe!"""

assert run(boundary_square) == expected_boundary_square, \
    "collinear edge points and boundary queries"

all_equal = """\
1
3 3
7 7
7 7
7 7
7 7
8 8
6 7
"""

expected_all_equal = """\
Case 1
7 7
7 7
7 7 is safe!
8 8 is safe!
6 7 is safe!"""

assert run(all_equal) == expected_all_equal, \
    "all sensors equal"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小尺寸三角形| 三角形顶点，内部不安全，边缘安全 | 最小有效传感器数量和严格的边界处理 |
 | 三个共线传感器 | 两个端点且没有不安全位置 | 没有内部的退化船体 |
 | 重复传感器 | 两个不同的端点 | 重复去除和退化几何 |
 | 每个边缘都有传感器的正方形 | 仅四个角顶点 | 不得打印船体边缘上的共线点 |
 | 所有传感器均相同 | 重复一分封围 | 完全简并和重复坐标 |

 ## 边缘情况

 边界规则直接由条件处理`cross <= 0`。 对于带有传感器的三角形`(0,0)`,`(4,0)`， 和`(0,4)`, 地点`(2,0)`与第一条边的叉积为零。 该函数立即返回`False`，生产`2 0 is safe!`。 室内位置`(2,2)`对所有三个边都有正叉积，因此是不安全的。 

对于共线传感器`(0,0)`,`(2,0)`， 和`(4,0)`，下链和上链折叠到两个端点。 最终的船体是`[(0,0), (4,0)]`。 由于其长度小于三，`strictly_inside`回报`False`无需尝试多边形边缘逻辑。 因此`(1,0)`,`(4,0)`，甚至`(5,0)`都是安全的，因为线段没有二维内部。 

当多个传感器位于同一船体边缘时，`<= 0`去除条件丢弃中间点。 对于包含的正方形`(5,0)`,`(10,5)`,`(5,10)`， 和`(0,5)`，在处理相应的链时，每个点都会被删除。 打印的多边形仅包含`(0,0)`,`(10,0)`,`(10,10)`， 和`(0,10)`，它们是最小外接多边形的实际顶点。 

对于重复的坐标，`sorted(set(points))`将重复的传感器减少到一个几何点。 连同三份`(7,7)`，船体变为`[(7,7)]`。 代码打印出来`(7,7)`两次，因此周边列表在同一点开始和结束，并且每个查询都是安全的，因为没有二维受影响的内部。 

使用整数叉积也可以精确地处理顶点。 等于外壳顶点的查询使得与一个或多个关联边的叉积为零，因此它被分类为安全而不是不安全。 不需要 epsilon，因为每个坐标和每个操作都是精确的。
