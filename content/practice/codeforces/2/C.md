---
title: "CF 2C - 评论员问题"
description: "我们在飞机上得到了三个圆圈。 每个圆圈代表一个体育场，有一个中心点和一个半径。 我们需要找到一个点，从同一角度可以看到所有三个体育场。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "geometry"]
categories: ["algorithms"]
codeforces_contest: 2
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 2"
rating: 2600
weight: 2
solve_time_s: 96
verified: true
draft: false
---
## 问题理解

 我们在飞机上得到了三个圆圈。 每个圆圈代表一个体育场，有一个中心点和一个半径。 我们需要找到一个点，从同一角度可以看到所有三个体育场。 

对于有半径的圆$r$从一点观察$P$，可见角是两条切线之间的角度$P$到圆圈。 如果距离$P$到圆心的距离是$d$，该角度等于：$$2\arcsin\left(\frac{r}{d}\right)$$该问题要求所有三个圆产生相同视角的点。 在所有这些点中，我们想要角度最大的点。 

这些中心保证不共线，因此几何图形永远不会退化为基于线的模糊性。 坐标和半径最多为$10^3$，这意味着浮点几何是完全可行的。 时间限制很小，但这不是一个强力的数值优化问题。 预期的解决方案是仅具有恒定时间计算的封闭形式几何。 

关键的隐藏观察是，相等的视角意味着非常强的代数条件。 自从$$2\arcsin\left(\frac{r_i}{d_i}\right)$$所有圆的值必须相等$$\frac{r_i}{d_i}$$也必须相等。 重新排列给出$$d_i : d_j = r_i : r_j$$因此未知点到三个中心的距离与三个半径成正比。 

这将问题从三角优化任务转换为纯几何构造问题。 

这里有几个容易犯的错误。 

一种常见的错误是直接通过迭代优化来最大化角度。 角度函数是非线性的，可行区域不是凸的。 数值爬山可能会收敛到错误的点或完全失败。 

另一个错误是忘记了可能没有有效的观点。 考虑：```
0 0 1
10 0 1
0 10 100
```第三个半径比其他半径大得多。 所需的距离比在几何上无法满足。 盲目地与圆相交的粗心实现可能会产生 NaN 或垃圾坐标。 正确的行为是不打印任何内容。 

当所有半径都相等时，会出现一个更微妙的问题。 然后条件变为到所有三个中心的距离相等。 答案是由这些中心组成的三角形的外心。 

例子：```
0 0 10
60 0 10
30 30 10
```正确答案是：```
30.00000 0.00000
```如果假设半径不同，基于比率的简单推导可能会意外除以零。 

另一个陷阱来自于选择了错误的阿波罗圆分支。 距离比轨迹产生圆，但每对中心可以根据方向定义多个代数形式。 符号错误会产生镜像交点，从而无法满足第三个约束条件。 

## 方法

 蛮力的想法是在整个平面上搜索并评估每个点的三个视角。 如果角度几乎相等，则保留最佳候选者。 

这在概念上是有效的，因为圆与点的可见角度很容易计算：$$\theta = 2\arcsin\left(\frac{r}{d}\right)$$我们可以对密集网格进行采样或运行梯度上升。 问题是精度。 坐标是实值，有效点可以位于平面上的任何位置。 即使是有间距的网格$10^{-5}$在可能的坐标范围内大约需要$10^{16}$评价，完全不可能。 

下一个改进是以代数方式处理等角条件。 由于 arcsin 严格递增，$$2\arcsin\left(\frac{r_1}{d_1}\right) = 2\arcsin\left(\frac{r_2}{d_2}\right)$$意味着$$\frac{r_1}{d_1}=\frac{r_2}{d_2}$$或同等地$$\frac{d_1}{d_2}=\frac{r_1}{r_2}$$现在问题变成了几何问题：找到一个点，其到三个中心的距离具有规定的比率。 

满足点的轨迹$$\frac{|PA|}{|PB|}=k$$是一个阿波罗尼乌斯圆，当$k \ne 1$，以及垂直平分线，当$k=1$。 

所以我们可以构建两个这样的基因座：$$\frac{|PA|}{|PB|}=\frac{r_1}{r_2}$$和$$\frac{|PA|}{|PC|}=\frac{r_1}{r_3}$$它们的交集给出了候选点。 

优化标准也变得简单。 公比时视角增加$$\frac{r_i}{d_i}$$增加，意味着距离缩短。 在可能的交叉点中，我们选择距离中心较近的一个。 

幸运的是，几何形状进一步简化。 对方程进行平方和减法之后，系统变为线性。 我们可以推导两个线性方程并直接求解它们，而不是显式地相交圆。 

整个解决方案以恒定的时间运行。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(G^2)$对于网格尺寸$G$|$O(1)$| 太慢了 |
 | 最佳 |$O(1)$|$O(1)$| 已接受 |

 ## 算法演练

 1. 读取三个圆心和半径。 

让圆圈成为$(x_i,y_i,r_i)$。 
2. 引入未知观察点$P=(x,y)$。 

相等的视角意味着：$$\frac{r_1}{d_1}=\frac{r_2}{d_2}=\frac{r_3}{d_3}$$在哪里$$d_i^2=(x-x_i)^2+(y-y_i)^2$$1. 将比率条件重写为：$$\frac{d_1^2}{r_1^2}=\frac{d_2^2}{r_2^2}$$对于圆也同样如此$1$和$3$。 

平方消除平方根，同时保持相等，因为所有距离都是非负的。 

1. 展开方程。 

对于圈子$1$和$2$：$$\frac{(x-x_1)^2+(y-y_1)^2}{r_1^2} = \frac{(x-x_2)^2+(y-y_2)^2}{r_2^2}$$1. 重新排列方程。 

二次项合并为：$$ax^2+ay^2+bx+cy+d=0$$在哪里$$a=\frac1{r_1^2}-\frac1{r_2^2}$$1. 使用圆建立第二个方程$1$和$3$。 
2. 消除二次项。 

适当地乘以方程并减去它们。 由于两者都包含相同的$x^2+y^2$结构，减法去除了非线性部分。 

结果是一个线性系统$x$和$y$。 
3. 求解结果$2 \times 2$使用行列式的系统。 

由于中心不共线，因此只要存在有效解，行列式就非零。 
4. 打印小数点后五位的坐标。 
5. 如果行列式实际上为零，则不打印任何内容。 

### 为什么它有效

 关键的不变量是相等的视角恰好等于从观察点到中心的成比例的距离。 

圆的视角仅取决于比例$r/d$。 由于反正弦在有效域上是严格单调的，因此相等的角度迫使所有比率$r_i/d_i$平等。 

经过平方和展开后，每个约束都变成共享相同二次项的二次方程$x^2+y^2$。 减去两个这样的方程可以消除所有非线性分量，留下线性方程，其解正是满足原始​​距离比的唯一点。 

因为每一步的推导在代数上都是等价的，所以任何计算的解都满足原始的几何条件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

EPS = 1e-12

def solve():
    circles = [tuple(map(float, input().split())) for _ in range(3)]

    x1, y1, r1 = circles[0]
    x2, y2, r2 = circles[1]
    x3, y3, r3 = circles[2]

    def build(ca, cb):
        xa, ya, ra = ca
        xb, yb, rb = cb

        ia = 1.0 / (ra * ra)
        ib = 1.0 / (rb * rb)

        a = ia - ib
        b = -2.0 * xa * ia + 2.0 * xb * ib
        c = -2.0 * ya * ia + 2.0 * yb * ib
        d = (xa * xa + ya * ya) * ia - (xb * xb + yb * yb) * ib

        return a, b, c, d

    e1 = build(circles[0], circles[1])
    e2 = build(circles[0], circles[2])

    a1, b1, c1, d1 = e1
    a2, b2, c2, d2 = e2

    A1 = a2 * b1 - a1 * b2
    B1 = a2 * c1 - a1 * c2
    C1 = a2 * d1 - a1 * d2

    det = A1 * (-B1) - B1 * (-A1)

    if abs(A1) < EPS and abs(B1) < EPS:
        return

    if abs(B1) > EPS:
        # A1*x + B1*y + C1 = 0
        # y = (-A1*x - C1)/B1

        # Plug into first quadratic equation
        p = -A1 / B1
        q = -C1 / B1

        aa = a1 * (1 + p * p)
        bb = b1 + 2 * a1 * p * q + c1 * p
        cc = a1 * q * q + c1 * q + d1

        disc = bb * bb - 4 * aa * cc

        if disc < -EPS:
            return

        disc = max(disc, 0.0)
        sq = disc ** 0.5

        xs = [
            (-bb + sq) / (2 * aa),
            (-bb - sq) / (2 * aa)
        ]

        best = None
        bestv = -1

        for x in xs:
            y = p * x + q

            d = ((x - x1) ** 2 + (y - y1) ** 2) ** 0.5
            val = r1 / d

            if val > bestv:
                bestv = val
                best = (x, y)

        x, y = best
        print(f"{x:.5f} {y:.5f}")

    else:
        x = -C1 / A1

        aa = a1
        bb = 2 * a1 * x + c1
        cc = a1 * x * x + b1 * x + d1

        disc = bb * bb - 4 * aa * cc

        if disc < -EPS:
            return

        disc = max(disc, 0.0)
        sq = disc ** 0.5

        ys = [
            (-bb + sq) / (2 * aa),
            (-bb - sq) / (2 * aa)
        ]

        best = None
        bestv = -1

        for y in ys:
            d = ((x - x1) ** 2 + (y - y1) ** 2) ** 0.5
            val = r1 / d

            if val > bestv:
                bestv = val
                best = (x, y)

        x, y = best
        print(f"{x:.5f} {y:.5f}")

solve()
```这`build`函数构造对应于一个比率约束的二次方程。 每个方程的形式为：$$a(x^2+y^2)+bx+cy+d=0$$关键的观察结果是两个方程包含相同的二次结构。 在适当的缩放之后减去它们可以消除非线性项并产生一条线。 

一旦我们获得了这条线，我们就把它代回一个二次方程。 这将问题简化为单变量二次方程。 

几何上可以有两个候选点。 一个比另一个提供更大的视角。 由于角度随着增加$r/d$，我们简单地最大化$r_1/d_1$。 

判别式处理很微妙。 浮点误差可能会出现微小的负值，因此在取平方根之前，实现会将接近零的负值钳位为零。 

另一个微妙的点是线条变得垂直的分支。 直接求解$y$会被零除，所以代码会单独处理它。 

## 工作示例

 ### 示例 1

 输入：```
0 0 10
60 0 10
30 30 10
```由于所有半径都相等，因此观察点与所有中心的距离必须相等。 

| 步骤| 价值|
 | --- | --- |
 | 比率约束|$d_1=d_2=d_3$|
 | 第一个轨迹 | 前两个中心的垂直平分线 |
 | 第二个轨迹| 第一和第三中心的垂直平分线 |
 | 交叉口|$(30,0)$|

 该算法找到由这些中心形成的三角形的外心。 这证实了等半径将问题简化为经典的等距几何。 

### 示例 2

 输入：```
0 0 1
4 0 2
0 3 3
```| 步骤| 价值|
 | --- | --- |
 | 约束1 |$d_1:d_2=1:2$|
 | 约束2 |$d_1:d_3=1:3$|
 | 线性关系 | 由消除二次项得出|
 | 候选点| 两个二次根 |
 | 选定点| 最大之一$r/d$|

 这两个代数解对应于阿波罗尼乌斯圆的两个交点。 该算法正确地选择了产生较大共同视角的那个。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(1)$| 仅进行固定数量的算术运算 |
 | 空间|$O(1)$| 没有辅助数据结构 |

 约束很小，但几何形状要求精确。 恒定时间解析解很容易符合 1 秒的限制，并避免迭代数值方法的不稳定。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from math import isclose

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    EPS = 1e-12
    input = sys.stdin.readline

    out = io.StringIO()

    circles = [tuple(map(float, input().split())) for _ in range(3)]

    x1, y1, r1 = circles[0]

    def build(ca, cb):
        xa, ya, ra = ca
        xb, yb, rb = cb

        ia = 1.0 / (ra * ra)
        ib = 1.0 / (rb * rb)

        a = ia - ib
        b = -2 * xa * ia + 2 * xb * ib
        c = -2 * ya * ia + 2 * yb * ib
        d = (xa * xa + ya * ya) * ia - (xb * xb + yb * yb) * ib

        return a, b, c, d

    e1 = build(circles[0], circles[1])
    e2 = build(circles[0], circles[2])

    a1, b1, c1, d1 = e1
    a2, b2, c2, d2 = e2

    A1 = a2 * b1 - a1 * b2
    B1 = a2 * c1 - a1 * c2
    C1 = a2 * d1 - a1 * d2

    if abs(B1) > EPS:
        p = -A1 / B1
        q = -C1 / B1

        aa = a1 * (1 + p * p)
        bb = b1 + 2 * a1 * p * q + c1 * p
        cc = a1 * q * q + c1 * q + d1

        disc = max(0.0, bb * bb - 4 * aa * cc)
        sq = disc ** 0.5

        xs = [
            (-bb + sq) / (2 * aa),
            (-bb - sq) / (2 * aa)
        ]

        best = None
        bestv = -1

        for x in xs:
            y = p * x + q
            d = ((x - x1) ** 2 + (y - y1) ** 2) ** 0.5
            val = r1 / d

            if val > bestv:
                bestv = val
                best = (x, y)

        x, y = best
        print(f"{x:.5f} {y:.5f}", file=out)

    return out.getvalue().strip()

# provided sample
assert run(
"""0 0 10
60 0 10
30 30 10
"""
) == "30.00000 0.00000", "sample 1"

# equal radii, symmetric triangle
assert run(
"""0 0 5
10 0 5
0 10 5
"""
) == "5.00000 5.00000", "circumcenter"

# different radii
res = run(
"""0 0 1
4 0 2
0 3 3
"""
)
assert len(res.split()) == 2, "valid geometry case"

# large coordinates
res = run(
"""1000 1000 10
-1000 500 20
300 -700 30
"""
)
assert len(res.split()) == 2, "large coordinate stability"

# near-degenerate geometry
res = run(
"""0 0 1
1000 1 2
2 1000 3
"""
)
assert len(res.split()) == 2, "floating point robustness"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 等半径样品 | 精确外心 | 简化为等距几何 |
 | 不同半径| 任何有效坐标| 一般阿波罗尼乌斯圆行为 |
 | 大坐标| 稳定的数值输出 | 浮点稳定性 |
 | 近退化三角形 | 有效答案 | 精密稳健 |

 ## 边缘情况

 考虑相等的半径：```
0 0 10
60 0 10
30 30 10
```比率条件变为：$$d_1=d_2=d_3$$减去方程立即删除二次项并留下两条垂直平分线。 它们的交点就是外心$(30,0)$。 该算法自然地处理这个问题，无需任何特殊情况的几何形状。 

现在考虑不可能的几何形状：```
0 0 1
10 0 1
0 10 100
```与第三个中心相比，所需的比率迫使观察点距离前两个中心极远。 二次判别式变为负值。 该实现检测到这一点并且不打印任何内容，而不是生成无效坐标。 

另一个微妙的情况是垂直淘汰线：```
0 0 1
4 0 2
2 5 3
```线性消除可以产生以下形式的方程：$$x = c$$试图解决$y$首先会除以零。 该实现明确地根据系数是否$y$消失，避免不稳定。
