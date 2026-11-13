---
title: "CF 227A - 我该转向哪里？"
description: "英雄从A点出发，骑行到B点，然后必须继续向C点行驶。在B点，他面朝从A到B的方向。我们需要确定到达C点是需​​要左转、右转还是继续直行。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "geometry"]
categories: ["algorithms"]
codeforces_contest: 227
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 140 (Div. 2)"
rating: 1300
weight: 227
solve_time_s: 155
verified: true
draft: false
---

[CF 227A - 我该转向哪里？](https://codeforces.com/problemset/problem/227/A)

 **评分：** 1300
 **标签：** 几何
 **求解时间：** 2m 35s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 英雄从点开始`A`, 骑行至点`B`，然后必须继续向点`C`。 在点`B`，他面向的方向是`A`到`B`。 我们需要判断是否达到`C`需要左转、右转或继续直行。 

几何约束大大简化了问题。 道路保证平行、共线或垂直。 这意味着运动从`B`到`C`要么与以下方向相同`A -> B`，沿完全相反的方向，或正好旋转 90 度。 该声明还保证所有三个点共线或成角度`ABC`是一个直角。 

坐标可以大到`10^9`，既可以是正值，也可以是负值。 这就排除了任何涉及网格、模拟或浮点几何的方法。 我们只需要对坐标进行一些算术运算，所以`O(1)`解决方案是自然的目标。 

一个常见的错误是混淆了方向。 英雄站在`B`当背对着`A`，因此相关方向向量为：```
AB = B - A
```而不是`BA = A - B`。 

例如：```
A = (0, 0)
B = (0, 1)
C = (1, 1)
```英雄从`A`到`B`。 达到`C`，他必须右转。 使用反转向量会错误地产生`LEFT`。 

另一个容易犯的错误出现在直线情况下。 

例子：```
A = (0, 0)
B = (1, 0)
C = (2, 0)
```正确答案是：```
TOWARDS
```仅检查叉积符号的粗心实现可能会错误分类，因为叉积为零。 我们必须明确地单独处理共线情况。 

负坐标也会暴露符号错误。 

例子：```
A = (0, 0)
B = (-1, 0)
C = (-1, -1)
```英雄向左移动，然后向下移动。 那是左转，不是右转。 负轴的视觉直觉变得更加困难，这就是为什么依赖方向公式比在心里画案例更安全。 

## 方法

 解决这个问题的强力方法是明确地模拟英雄的方向并将其与所有可能的有效动作进行比较。 由于运动规则只允许直行、左转或右转，我们可以从`A`到`B`，在两个方向上手动旋转它，并将每个结果与来自的向量进行比较`B`到`C`。 

例如，如果英雄以向量移动`(dx, dy)`， 然后：```
Left rotation  = (-dy, dx)
Right rotation = (dy, -dx)
```我们可以比较一下`BC`针对这些变换后的向量并决定答案。 这是正确的，因为该问题仅保证这三种可能性。 

暴力法已经是常数时间了，所以这里不存在性能问题。 尽管如此，它仍然依赖于手动处理几何变换和共线性的特殊情况。 

更清晰的观察是，这正是计算几何的标准方向测试。 给定两个向量：```
u = AB
v = BC
```他们的 2D 叉积告诉我们转弯方向：```
cross = ux * vy - uy * vx
```如果叉积为正，则旋转`u`到`v`是逆时针方向，意思是左转。 

如果为负，则为顺时针转弯，即右转。 

如果为零，则向量共线，因此英雄继续直线前进。 

这将整个问题简化为一个算术公式。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 手动旋转的蛮力 | O(1) | O(1) | O(1) | O(1) | 已接受 |
 | 跨产品导向测试| O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取点的坐标`A`,`B`， 和`C`。 
2. 构造方向向量`A`到`B`。```
AB = (xb - xa, yb - ya)
```这代表了英雄当前面临的方向。 

1. 构造方向向量：`B`到`C`。```
BC = (xc - xb, yc - yb)
```这代表了英雄接下来想要移动的方向。 

1. 计算二维叉积：```
cross = AB.x * BC.y - AB.y * BC.x
```该值的符号确定两个向量之间的方向。 

1.如果`cross > 0`， 打印`"LEFT"`。 

正叉积意味着旋转`AB`到`BC`是逆时针方向。 

1.如果`cross < 0`， 打印`"RIGHT"`。 

负叉积表示顺时针旋转。 

1. 否则，打印`"TOWARDS"`。 

零交叉积意味着两个向量位于同一条线上。 

### 为什么它有效

 叉积测量二维几何中的有符号面积和方向。 对于向量`u`和`v`，符号：```
u.x * v.y - u.y * v.x
```告诉是否从旋转`u`到`v`逆时针或顺时针旋转。 

英雄当前面对的方向正好是向量`AB`，期望的下一个方向是`BC`。 由于该问题仅保证左转、右转或直行，因此叉积完全决定了正确答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

xa, ya = map(int, input().split())
xb, yb = map(int, input().split())
xc, yc = map(int, input().split())

abx = xb - xa
aby = yb - ya

bcx = xc - xb
bcy = yc - yb

cross = abx * bcy - aby * bcx

if cross > 0:
    print("LEFT")
elif cross < 0:
    print("RIGHT")
else:
    print("TOWARDS")
```代码的第一部分读取三个点并将它们转换为方向向量。 使用向量而不是绝对坐标是关键的几何步骤，因为转弯取决于相对运动，而不是位置。 

叉积计算是解决方案的核心：```
cross = abx * bcy - aby * bcx
```顺序很重要。 交换向量会反转符号并翻转左/右答案。 

Python 整数自动处理非常大的值，因此坐标接近`10^9`是安全的。 在 C++ 等语言中，使用`long long`是必要的，因为产品可以达到`10^18`。 

最终条件直接将方向映射到所需的输出。 必须单独检查零，因为共线向量既不是左转也不是右转。 

## 工作示例

 ### 示例 1

 输入：```
0 0
0 1
1 1
```| 变量| 价值|
 | --- | --- |
 | AB | (0, 1) | (0, 1) |
 | 公元前 | (1, 0) | (1, 0) |
 | 十字| -1 |
 | 结果 | 右 |

 英雄首先向上移动，然后转向正 x 轴。 是顺时针旋转，所以答案是`"RIGHT"`。 

### 示例 2

 输入：```
0 0
1 0
2 0
```| 变量| 价值|
 | --- | --- |
 | AB | (1, 0) | (1, 0) |
 | 公元前 | (1, 0) | (1, 0) |
 | 十字| 0 |
 | 结果 | 走向|

 两个向量都指向完全相同的方向。 叉积变为零，确认英雄继续直线前进。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(1) | O(1) | 仅执行少量算术运算 |
 | 空间| O(1) | O(1) | 没有使用额外的数据结构 |

 该解决方案很容易满足限制，因为无论坐标大小如何，它都执行恒定时间整数算术。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    xa, ya = map(int, input().split())
    xb, yb = map(int, input().split())
    xc, yc = map(int, input().split())

    abx = xb - xa
    aby = yb - ya

    bcx = xc - xb
    bcy = yc - yb

    cross = abx * bcy - aby * bcx

    if cross > 0:
        print("LEFT")
    elif cross < 0:
        print("RIGHT")
    else:
        print("TOWARDS")

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    output = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return output.strip()

# provided sample
assert run(
"""0 0
0 1
1 1
"""
) == "RIGHT", "sample 1"

# straight line
assert run(
"""0 0
1 0
2 0
"""
) == "TOWARDS", "straight movement"

# left turn with negative coordinates
assert run(
"""0 0
-1 0
-1 -1
"""
) == "LEFT", "negative coordinate orientation"

# right turn
assert run(
"""0 0
1 0
1 -1
"""
) == "RIGHT", "clockwise turn"

# large coordinates
assert run(
"""1000000000 1000000000
999999999 1000000000
999999999 999999999
"""
) == "LEFT", "large values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`(0,0) -> (1,0) -> (2,0)`|`TOWARDS`| 共线运动|
 |`(0,0) -> (-1,0) -> (-1,-1)`|`LEFT`| 负坐标的正确方向 |
 |`(0,0) -> (1,0) -> (1,-1)`|`RIGHT`| 顺时针旋转|
 | 大的`10^9`坐标|`LEFT`| 没有溢出问题|

 ## 边缘情况

 考虑共线情况：```
0 0
1 0
2 0
```这些向量是：```
AB = (1, 0)
BC = (1, 0)
```叉积变为：```
1 * 0 - 0 * 1 = 0
```算法打印`"TOWARDS"`。 如果没有显式检查零，实现可能会错误地将其分类为左或右。 

现在考虑反向水平移动：```
0 0
-1 0
-1 -1
```这些向量是：```
AB = (-1, 0)
BC = (0, -1)
```叉积为：```
(-1) * (-1) - 0 * 0 = 1
```由于结果是肯定的，算法会打印`"LEFT"`。 这种情况捕获了由对屏幕坐标或反向矢量顺序的直觉引起的符号错​​误。 

最后，考虑非常大的坐标：```
1000000000 1000000000
999999999 1000000000
999999999 999999999
```这些向量是：```
AB = (-1, 0)
BC = (0, -1)
```使用整数算术仍然可以正确计算叉积。 Python 安全地处理这些值，算法输出`"LEFT"`没有任何精度问题。
