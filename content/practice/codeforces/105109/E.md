---
title: "CF 105109E - 是乙烯基吗？"
description: "我们在平面上有十个点，每个点都应该位于隐藏对象的边界上。 该对象保证恰好是两种类型之一：黑胶唱片（其边界是圆形）或盒式磁带（其边界是轴对齐的矩形）。"
date: "2026-06-27T20:03:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105109
codeforces_index: "E"
codeforces_contest_name: "UTPC Spring 2024 Open Contest"
rating: 0
weight: 105109
solve_time_s: 79
verified: false
draft: false
---

[CF 105109E - 是乙烯基吗？](https://codeforces.com/problemset/problem/105109/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 19s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们在平面上有十个点，每个点都应该位于隐藏对象的边界上。 该对象保证恰好是两种类型之一：黑胶唱片（其边界是圆形）或盒式磁带（其边界是轴对齐的矩形）。 

任务是决定哪种形状与观察到的点一致。 对于圆，所有点距单个圆心的距离相同。 对于轴对齐的矩形，每个边界点位于与坐标轴对齐的四个直边之一上，这意味着它的 x 坐标是形状的最小或最大 x 值，或者它的 y 坐标是最小或最大 y 值。 

输入大小是固定的并且很小，只有十个点。 这立即排除了对渐近复杂性的任何担忧。 任何达到恒定时间几何计算的解决方案都是可以接受的。 

主要困难不是性能而是数值鲁棒性。 坐标是浮点值，最多 10 位小数，可能与真实形状偏差最多 1e-6。 这意味着任何几何测试都必须容忍小的 epsilon 误差。 

检查坐标精确相等或距离精确相等的简单方法将会失败，因为即使结构正确，浮点噪声也会破坏相等性。 

当点几乎但不完全与矩形边缘对齐时，就会出现微妙的边缘情况。 例如，矩形边界点的 x = 1.9999999 而不是 2.0。 任何严格的平等检查都会错误地拒绝有效的盒式磁带。 

同样，对于圆，使用不稳定的公式从三个点计算圆心可能会放大浮动误差，导致半径不一致，除非仔细处理公差。 

## 方法

 蛮力策略将尝试在两种假设下明确地重建形状。 

在圆假设下，我们可以选择任意三个不共线的点，计算外接圆，然后验证所有十个点是否都位于其上。 这涉及求解圆心和半径的方程组，然后检查一致性。 由于只有十个点，尝试所有三元组仍然保持恒定时间。 

在矩形假设下，我们可以尝试通过将点聚类为与边对应的四组来推断矩形边缘，或者尝试将所有点分配给边。 这很快就变得不必要了，因为轴对齐的矩形具有非常严格的结构：所有点都必须位于直线 x = minX、x = maxX、y = minY 或 y = maxY 上。 

关键的观察是我们不需要完全重建这两种形状。 我们只需要测试这些点是否满足矩形的结构约束。 如果他们这样做，我们输出 CASSETTE。 否则，根据问题保证，形状一定是圆形，所以我们输出VINYL。 

这将问题简化为轴对齐边界框成员资格的简单几何验证。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 圆形重构+矩形重构 | O(1) | O(1) | O(1) | O(1) | 已接受但没有必要 |
 | 仅矩形有效性检查 | O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

1. 读取所有十个点并存储它们的坐标。 我们将它们保存在浮点数组中，因为需要精度容差。 
2. 计算所有点的 xmin、xmax、ymin、ymax。 它们定义了包含所有点的最小轴对齐边界矩形。 
3. 对于每个点，检查它是否位于该矩形的边界上。 如果一个点的 x 坐标近似等于 xmin 或 xmax，或者它的 y 坐标近似等于 ymin 或 ymax，则该点有效。 我们使用 epsilon 比较而不是精确相等来处理浮动噪声。 
4. 如果每个点都满足边界条件，则将形状分类为矩形并输出 CASSETTE。 
5. 否则，输出VINYL。 

这样做的原因是任何轴对齐的矩形边界点必须至少满足这四个等式之一。 根据“边界点”的定义，内部点是不可能的，因此每个有效的输入点必须位于边缘上。 

### 为什么它有效

 对于正确的包埋盒，所有观察到的点都位于定义矩形边缘的四条线的并集上。 从这些点计算出的边界框与真实的矩形相匹配，因为至少有一个点在容差范围内实现了每个极端坐标。 因此，每个点都必须符合四个边界方程之一。 

对于黑胶唱片，点位于圆上，并且通常不始终满足任何轴对齐的极端约束。 虽然圆可以包含在矩形中，但其边界点并不限于这四条线，因此至少有一个点将违反矩形条件，从而导致矩形假设被拒绝。 

因为该问题恰好保证了一种有效形状，所以拒绝矩形意味着圆形。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

EPS = 1e-6

def close(a, b):
    return abs(a - b) <= EPS

points = []
for _ in range(10):
    x, y = map(float, input().split())
    points.append((x, y))

xs = [p[0] for p in points]
ys = [p[1] for p in points]

xmin, xmax = min(xs), max(xs)
ymin, ymax = min(ys), max(ys)

def on_rect_boundary(x, y):
    return close(x, xmin) or close(x, xmax) or close(y, ymin) or close(y, ymax)

is_rect = True
for x, y in points:
    if not on_rect_boundary(x, y):
        is_rect = False
        break

print("CASSETTE" if is_rect else "VINYL")
```该代码首先计算所有点的边界框，然后验证定义轴对齐矩形边界的结构条件。 辅助函数`close`根据语句的要求吸收最多 1e-6 的浮点误差。 

决策步骤故意是不对称的：我们只显式验证矩形情况。 这避免了不稳定的圆拟合，并保证了两个形状中的一个恰好有效。 

## 工作示例

 ### 示例 1

 输入点对应于一个圆。 

| 步骤| xmin/xmax/ymin/ymax 检查结果 |
 | --- | --- |
 | 计算边界 | 矩形包围圆点 |
 | 点验证 | 至少有一点违反边界条件 |
 | 最终决定| 不是矩形|

 圆点沿着曲线连续分布，因此某些点严格位于边界框边缘内。 这些点未通过矩形测试，强制分类为 VINYL。 

### 示例 2

 输入点位于轴对齐的矩形边界上。 

| 步骤| xmin/xmax/ymin/ymax 检查结果 |
 | --- | --- |
 | 计算边界 | 恢复精确的矩形|
 | 点验证 | 每个点都匹配一条边 |
 | 最终决定| 矩形确认|

 每个点都与推断边界框的垂直或水平边缘对齐，因此所有检查都通过，结果是 CASSETTE。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(10) | 我们以固定次数扫描固定数量的点 |
 | 空间| O(10) | 我们只存储输入点 |

 这些约束使得这个时间实际上是恒定的。 即使是更几何的重建方法也很容易足够快，但边界框测试更简单并且在给定公差下数值稳定。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    EPS = 1e-6

    def close(a, b):
        return abs(a - b) <= EPS

    points = []
    for _ in range(10):
        x, y = map(float, input().split())
        points.append((x, y))

    xs = [p[0] for p in points]
    ys = [p[1] for p in points]

    xmin, xmax = min(xs), max(xs)
    ymin, ymax = min(ys), max(ys)

    def on_rect_boundary(x, y):
        return close(x, xmin) or close(x, xmax) or close(y, ymin) or close(y, ymax)

    for x, y in points:
        if not on_rect_boundary(x, y):
            return "VINYL"
    return "CASSETTE"

# sample-like circle (rough)
assert run("0 1\n1 0\n0 -1\n-1 0\n0.7 0.7\n-0.7 0.7\n-0.7 -0.7\n0.7 -0.7\n0.5 0.86\n-0.5 -0.86\n") == "VINYL"

# perfect rectangle
assert run("0 0\n0 1\n0 2\n0 3\n1 0\n1 1\n1 2\n1 3\n0.5 0\n0.5 3\n") == "CASSETTE"

# near-rectangle with noise
assert run("0 0\n0 1\n0 2\n0 3\n1 0\n1 1\n1 2\n1 3\n0.5000005 0\n0.4999995 3\n") == "CASSETTE"

# diagonal-ish circle-ish points
assert run("0 0\n1 1\n2 0\n1 -1\n0.7 0.7\n1.3 0.7\n1.3 -0.7\n0.7 -0.7\n1 0.2\n1 -0.2\n") == "VINYL"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 喧闹圈| 乙烯基| 非轴结构下矩形条件失败 |
 | 干净的矩形| 盒式磁带 | 满足所有边界约束|
 | 嘈杂的矩形| 盒式磁带 | epsilon 处理正确性 |
 | 任意形状| 乙烯基| 拒绝非矩形集|

 ## 边缘情况

 典型的失败模式是过于严格地对待浮动相等。 在近矩形输入中，x 应恰好为 0，但显示为 1e-7，严格的相等检查会错误地拒绝有效的盒式磁带。 基于 epsilon 的比较`close`确保这些点仍然匹配 xmin 或 xmax。 

另一个边缘情况是假设点必须恰好是角点。 该问题允许点沿着边缘的任意位置。 该算法正确接受像 (xmin, 0.3) 或 (0.7, ymax) 这样的点，因为它只需要任何边界线上的隶属度，而不是角重合。 

最后的边缘情况是退化边界框，其中由于数值崩溃，xmin 等于 xmax 或 ymin 等于 ymax。 输入保证点之间的间隔至少为 0.05，可以防止出现这种情况，因此矩形保持明确定义。
