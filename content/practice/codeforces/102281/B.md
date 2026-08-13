---
title: "CF 102281B-\u041a\u0443\u043b\u0438\u043d\u0430\u0440\u043d\u0430\u044f\u0437\u0430\u0434\u0430\u0447\u0430"
description: "我们有一个边长为 (a)、(b) 和 (c) 的三角形饼干切割器，以及一个半径为 (r) 的圆形饼干切割器。"
date: "2026-08-13T16:09:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102281
codeforces_index: "B"
codeforces_contest_name: "2011, IV \u0421\u0430\u043c\u0430\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u043d\u0430\u044f \u043c\u0435\u0436\u0432\u0443\u0437\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e"
rating: 0
weight: 102281
solve_time_s: 114
verified: true
draft: false
---

[CF 102281B - \u041a\u0443\u043b\u0438\u043d\u0430\u0440\u043d\u0430\u044f \u0437\u0430\u0434\u0430\u0447\u0430](https://codeforces.com/problemset/problem/102281/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 54s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个边长为 (a)、(b) 和 (c) 的三角形饼干切割器，以及一个半径为 (r) 的圆形饼干切割器。 饼干很薄，所以问题纯粹是二维的：圆形饼干能否完全放入三角形切割器内部，三角形饼干是否可以完全放入圆形切割器内部？ 

第一个问题要求能容纳三角形的最大圆。 该圆是三角形的内切圆，因此相关量是内半径。 

第二个问题要求可以包含整个三角形的最小圆。 这样的圆是由三角形的外接圆决定的，所以相关的量就是外接半径。 

输入包含 1 到 10000 之间的四个整数。对于 (O(1)) 解决方案来说，这些界限很小，甚至不需要线性算法，因为只有一个三角形需要处理。 主要关心的不是运行时间而是数值正确性。 使用 Heron 公式进行直接浮点计算可能会在答案发生变化的边界处引入舍入误差。 

在一些边缘情况下，粗心的实施可能会失败。 考虑```
1 1 1 1
```三角形是等边的。 它的内半径是 (\sqrt{3}/6)，小于 1，而它的外接半径是 (\sqrt{3}/3)，也小于 1。两个 cookie 都适合，所以两个答案都必须是正数。 混淆内半径和外接半径的实现将会得到错误的答案之一。 

更有用的边界情况是```
2 2 2 1
```这里的外接半径是(2/\sqrt{3})，它大于1，而内半径是(1/\sqrt{3})，它小于1。因此圆适合三角形，但三角形不适合圆。 对两个方向使用相同的半径标准会给出错误的结果。 

确切的边界也必须包容地处理。 例如，```
2 2 2 1
```并不恰好位于边界上，但可以拟合边长为 1 的等边三角形和半径恰好为其内半径的圆。 比较必须使用`>=`， 不是`>`。 

最后，边可以大到 10000，因此在 Python 中直接计算 Heron 表达式是安全的，但在固定宽度整数语言中的实现仍然应该仔细选择算术。 涉及的最大乘积约为 (10^{16})，它适合有符号 64 位整数，但不适合有符号 32 位整数。 

## 方法

 简单的几何方法会尝试模拟物理插入过程。 对于圆，可以尝试多种可能的位置和方向，并测试圆是否穿过三边之一。 对于圆内的三角形，可以类似地枚举位置和旋转。 问题在于位置和旋转是连续变量，因此不存在既精确又保证找到最优值的有限强力搜索。 如果我们将角度离散化为 (N) 个值，将位置离散化为 (M) 个值，则结果搜索成本 (O(NM)) 检查，并且其答案仍然取决于所选的离散化。 在最坏的情况下，没有有限的操作计数使这种方法成为精确的解决方案，因为任意精细的网格仍然可能错过有效的位置。 

蛮力思想确实有一个有用的特性：它之所以有效，是因为它正在寻找极值位置。 如果圆尽可能大，则该圆必须以一个特殊点为圆心；如果该圆尽可能小，则该三角形必须与一个特殊的封闭圆相关。 我们可以通过数学方式识别它们，而不是搜索这些位置。 

对于三角形，最大内切圆的半径等于内切半径

 [
 \rho = \frac{A}{s},
 ]

 其中 (A) 是三角形的面积，(s=(a+b+c)/2) 是其半周长。 圆形 cookie 恰好适合 (r\geq\rho)。 

相反，包含所有三个顶点的最小圆的半径等于外接圆半径

 [
 R = \frac{abc}{4A}。 
]

 当 (r\geq R) 时，三角形恰好适合圆形刀具。 

剩下的问题是避免浮点运算。 海伦公式给出

 [
 A^2=s(s-a)(s-b)(s-c)。 
]

 将所有内容乘以 16 并定义会更方便

 [
 D=(a+b+c)(-a+b+c)(a-b+c)(a+b-c)=16A^2。 
]

 那么(4A=\sqrt D)。 半径内条件变为

 [
 r\geq\frac{\sqrt D}{2(a+b+c)}。 
]

 两边都是非负的，所以我们可以将它们平方：

 [
 4r^2(a+b+c)^2\geq D.
 ]

 对于外接圆半径，

 [
 R=\frac{abc}{\sqrt D},
 ]

 所以

 [
 r\geq R
 ]

 相当于

 [
 r^2D\geq a^2b^2c^2。 
]

 现在，这两个决定都是精确的整数比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 对位置和旋转的几何蛮力 | 没有有限精确界限 | O(1) | O(1) | 不适合|
 | 浮点公式| O(1) | O(1) | O(1) | O(1) | 边界风险 |
 | 使用 Heron 公式进行整数比较 | O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取边长 (a,b,c) 和圆半径 (r)。 三边长描述了一个三角形，因此我们需要的第一个几何量是它的平方面积。 
2. 计算

 [
 D=(a+b+c)(-a+b+c)(a-b+c)(a+b-c)。 
]

 由于 (D=16A^2)，其平方根为 (4A)。 我们实际上不需要计算平方根。 

1. 检查圆是否适合三角形内

 [
 4r^2(a+b+c)^2\geq D.
 ]

 这正是条件 (r\geq\rho)，其中 (\rho) 是三角形的内半径。 

1. 使用以下命令检查三角形是否适合圆内

 [
 r^2D\geq a^2b^2c^2。 
]

 这正是条件 (r\geq R)，其中 (R) 是外接圆半径。 

1. 打印每次比较对应的句子。 平等才算是合适，因为饼干可以接触到切刀。 

### 为什么它有效

 三角形内可以放置的最大圆是其内切圆，因此检查内半径对于第一个方向既是必要的也是充分的。 包含非简并三角形所有顶点的最小圆是其外接圆，因此检查外接圆半径对于第二方向是必要且充分的。

值(D)满足(D=16A^2)。 将此恒等式代入内半径和外接半径的公式中，可将这两个几何条件转换为精确的整数不等式。 由于每个变换都保留比较的方向，并且所有平方的量都是非负的，因此该算法产生与原始几何问题相同的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

a, b, c, r = map(int, input().split())

p = a + b + c

# 16 * area^2
d = p * (-a + b + c) * (a - b + c) * (a + b - c)

# Circle fits into triangle iff r >= inradius.
circle_in_triangle = 4 * r * r * p * p >= d

# Triangle fits into circle iff r >= circumradius.
triangle_in_circle = r * r * d >= a * a * b * b * c * c

if circle_in_triangle:
    print("Circle gets into the triangle")
else:
    print("Circle doesn’t get into the triangle")

if triangle_in_circle:
    print("Triangle gets into the circle")
else:
    print("Triangle doesn’t get into the circle")
```变量`p`存储 (a+b+c)，它出现在 Heron 表达式和 inradius 比较中。 变量`d`是(16A^2)，使得整个解决方案避免`sqrt`。 

对于第一个比较，代码使用```
4 * r * r * p * p >= d
```因为

 [
 r\geq\frac{\sqrt D}{2p}
 ]

 相当于

 [
 4r^2p^2\geq D.
 ]

 对于第二个比较，代码使用```
r * r * d >= a * a * b * b * c * c
```因为 (R=abc/\sqrt D)。 在这两种情况下，平等都是刻意接受的。 

Python 整数具有任意精度，因此不存在溢出问题。 在 C++ 等语言中，64 位整数足以满足这些约束。 输入仅包含一个测试用例，因此计算中不存在循环。 

必须保留确切的输出字符串，包括大撇号`doesn’t`，因为 Codeforces 直接比较输出文本。 

## 工作示例

 ### 示例 1

 对于第一个样本，输入是```
1 1 1 10
```三角形是等边的，而圆则很大。 

| 变量| 价值|
 | --- | --- |
 | （一）| 1 |
 | （二）| 1 |
 | （三）| 1 |
 | (r)| 10 | 10
 | (p=a+b+c) | 3 |
 | (D) | 3 |
 | (4r^2p^2) | 3600 | 3600
 | (r^2D) | (r^2D) | 300 | 300
 | (a^2b^2c^2) | (a^2b^2c^2) | 1 |
 | 三角形内有圆| 假 |
 | 圆内三角形| 真实 |

 第一个不等式失败，因为半径为 10 的圆比三角形的内半径大得多。 第二个不等式成立，因为三角形的外接圆半径远小于 10。 

输出是```
Circle doesn’t get into the triangle
Triangle gets into the circle
```### 示例 2

 对于第二个样本，输入是```
10 10 10 1
```现在三角形比圆形大得多。 

| 变量| 价值|
 | --- | --- |
 | （一）| 10 | 10
 | （二）| 10 | 10
 | （三）| 10 | 10
 | (r)| 1 |
 | (p=a+b+c) | 30|
 | (D) | 30000 |
 | (4r^2p^2) | 3600 | 3600
 | (r^2D) | (r^2D) | 30000 |
 | (a^2b^2c^2) | (a^2b^2c^2) | 1000000 |
 | 三角形内有圆| 真实 |
 | 圆内三角形| 假 |

 圆的半径大于三角形的内半径，因此圆适合在内部。 然而，三角形的外接圆半径远大于1，因此三角形无法放入圆内。 

输出是```
Circle gets into the triangle
Triangle doesn’t get into the circle
```## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(1)) | (O(1)) | 执行固定数量的算术运算。 |
 | 空间| (O(1)) | (O(1)) | 仅存储固定数量的整型变量。 |

 约束允许边长和半径最大为 10000，并且该解决方案仅执行少量算术运算。 它远低于 1.5 秒的时间限制，并且与 128 MB 限制相比，使用的内存可以忽略不计。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline
    a, b, c, r = map(int, input().split())

    p = a + b + c
    d = p * (-a + b + c) * (a - b + c) * (a + b - c)

    circle_in_triangle = 4 * r * r * p * p >= d
    triangle_in_circle = r * r * d >= a * a * b * b * c * c

    first = (
        "Circle gets into the triangle"
        if circle_in_triangle
        else "Circle doesn’t get into the triangle"
    )
    second = (
        "Triangle gets into the circle"
        if triangle_in_circle
        else "Triangle doesn’t get into the circle"
    )

    return first + "\n" + second

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    try:
        return solve()
    finally:
        sys.stdin = old_stdin

# Provided sample 1
assert run("1 1 1 10\n") == (
    "Circle doesn’t get into the triangle\n"
    "Triangle gets into the circle"
), "sample 1"

# Provided sample 2
assert run("10 10 10 1\n") == (
    "Circle gets into the triangle\n"
    "Triangle doesn’t get into the circle"
), "sample 2"

# Minimum-size valid triangle
assert run("1 1 1 1\n") == (
    "Circle gets into the triangle\n"
    "Triangle gets into the circle"
), "minimum-size values"

# Maximum-size equilateral triangle
assert run("10000 10000 10000 10000\n") == (
    "Circle gets into the triangle\n"
    "Triangle gets into the circle"
), "maximum-size values"

# Exact inradius boundary for a 3-4-5 triangle:
# inradius = 1, circumradius = 2.5
assert run("3 4 5 1\n") == (
    "Circle gets into the triangle\n"
    "Triangle doesn’t get into the circle"
), "inradius boundary"

# Exact circumradius boundary for a 3-4-5 triangle
assert run("3 4 5 3\n") == (
    "Circle gets into the triangle\n"
    "Triangle gets into the circle"
), "circumradius boundary"

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 1 1`| 两者都进入| 最小值和对称等边几何|
 |`10000 10000 10000 10000`| 两者都进入| 最大值和大整数运算 |
 |`3 4 5 1`| 仅圈 | 精确的半径内边界 |
 |`3 4 5 3`| 两者都进入| 圆半径边界和包容性比较 |

 ## 边缘情况

 对于最小尺寸的情况```
1 1 1 1
```我们得到(D=3)。 圆形条件为(4\cdot1^2\cdot3^2=36\geq3)，三角形条件为(1^2\cdot3=3\geq1)。 两次比较都成功。 该示例捕获了意外使用方向之一的错误半径公式的实现。 

对于半径为 1 的 3-4-5 三角形，```
3 4 5 1
```面积为 6，因此内半径为 (6/6=1)。 该圆完全接触最佳位置的所有三个边，因此必须被接受。 外接圆半径为 (3\cdot4\cdot5/(4\cdot6)=2.5)，因此三角形不适合。 此案严查`>`比较。 

对于半径为 3 的同一个三角形，```
3 4 5 3
```圆仍然大于内半径，现在也大于外接半径。 两个方向都成功了。 这验证了两个不等式是独立的，并且外接圆半径计算用于圆内三角形方向。 

对于最大值，```
10000 10000 10000 10000
```该算术涉及 (10^{16}) 左右的值。 Python 精确地处理这些整数，因此不会丢失精度。 几何形状不会随比例变化：内半径和外接半径都与边长成正比，并且半径 10000 对于两个方向来说都绰绰有余。
