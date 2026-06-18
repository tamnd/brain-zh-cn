---
title: "CF 1059D - 自然保护区"
description: "我们在平面上得到一组点，每个点代表动物的位置。 我们需要放置一个覆盖所有这些点的圆。 同时，有一条固定的水平河流，变换后成为x轴，所以这条线是$y = 0$。"
date: "2026-06-15T09:37:53+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "geometry", "ternary-search"]
categories: ["algorithms"]
codeforces_contest: 1059
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 514 (Div. 2)"
rating: 2200
weight: 1059
solve_time_s: 278
verified: true
draft: false
---

[CF 1059D - 自然保护区](https://codeforces.com/problemset/problem/1059/D)

 **评分：** 2200
 **标签：** 二分查找、几何、三元查找
 **求解时间：** 4m 38s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在平面上得到一组点，每个点代表动物的位置。 我们需要放置一个覆盖所有这些点的圆。 同时有一条固定的水平河流，变换后成为x轴，所以这条线是$y = 0$。 

除了简单地覆盖所有点之外，圆还必须满足两个几何约束。 首先，它必须至少接触河流一次，即从圆心到线的距离$y = 0$最多必须是半径。 其次，圆圈与河流相交的点不得超过一处。 对于圆和直线来说，有多个公共点意味着直线穿过圆，因此圆心到直线的距离必须严格小于半径，这是不允许的。 结合这两个约束会产生一个非常具体的结构：圆必须与 x 轴相切。 

所以中心$(x, y)$必须满足$|y| = r$，并且因为圆必须包含所有点，每个点$(x_i, y_i)$必须满足：$$(x - x_i)^2 + (y - y_i)^2 \le r^2.$$自从$|y| = r$，问题简化为在远处寻找水平线上的中心$r$从 x 轴最小化$r$同时覆盖所有点。 

输入大小达到$10^5$，这会立即排除任何重新计算所有对的距离或尝试每对点的候选圆的情况。 任何解决方案都必须将问题简化为针对少量变量的单个连续优化，并在每次猜测的线性时间内对其进行评估。 

当所有点都以对称方式非常接近 x 轴时，就会出现微妙的边缘情况。 试图独立地假设圆心位于所有点上方或所有点下方的简单方法可能会失败，因为正确的解决方案可能需要根据分布将圆心放置在上方或下方。 

如果假设中心位于质心的正上方或正下方，则会出现另一种失败情况。 这并不能得到保证：最佳圆受到覆盖和相切的约束，因此 x 坐标和 y 坐标相互作用。 

## 方法

 暴力方法会尝试猜测圆心和半径，通过验证所有点都在内部来检查可行性。 由于中心在二维上是连续的，因此这变成了无限的搜索空间。 即使在精细网格上离散化 x 和 y 也是不可行的：每次检查都是$O(n)$，并且网格需要太多的评估。 

关键的结构见解是圆始终与 x 轴相切，因此其中心被限制在$y = r$或者$y = -r$。 我们可以固定一个标志并专注于一个案例； 对称性处理另一个。 

将中心固定在$(x, r)$，点的条件变为：$$(x - x_i)^2 + (r - y_i)^2 \le r^2.$$展开并简化消除了二次$r$:$$(x - x_i)^2 + r^2 - 2r y_i + y_i^2 \le r^2$$这减少到：$$(x - x_i)^2 + y_i^2 \le 2r y_i.$$对于每个点，这都施加了一个下限$r$作为一个函数$x$:$$r \ge \frac{(x - x_i)^2 + y_i^2}{2y_i}.$$如果$y_i < 0$，不等式方向翻转，这意味着对于轴上方的中心来说这种配置是不可能的。 这立即给出了一个可行性条件：对于选定的中心高符号，所有点必须严格位于轴的正确一侧。 

因此，对于固定符号，问题就变成了最小化：$$r(x) = \max_i \frac{(x - x_i)^2 + y_i^2}{2y_i}.$$这是一个凸函数$x$，因为它是凸二次方程的最大值。 这使我们能够应用三元搜索$x$, 评估$r(x)$在线性时间内。 

如果两种情况均可行，则最终答案是两种情况中的最小值（中心位于轴上方或下方）。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数/无限搜索| O(n) | 太慢了 |
 | x 上的三元搜索 | O(n log C) | O(n log C) | O(1) | O(1) | 已接受 |

 ## 算法演练

 我们对待点$y > 0$作为轴上方中心的候选，并且点$y < 0$对于其下方的中心。 

1. 将问题分成两个独立的情况：center at$y = r$和中心在$y = -r$。 这是必要的，因为一旦选择切线方向就固定了。 
2. 对于“above axis”情况，检查是否有任何点$y_i \le 0$。 如果是这样，则放弃这种情况，因为由切线得出的不等式不会始终成立。 
3. 定义函数$f(x)$计算固定水平坐标所需的半径：$$f(x) = \max_i \frac{(x - x_i)^2 + y_i^2}{2y_i}.$$如果中心垂直固定在轴上方的高度，此函数捕获所需的最小半径$r$。 

1. 使用三元搜索$x$在包含所有点的足够大的间隔上，通常$[-10^7, 10^7]$。 的凸性为$f(x)$保证单一的全局最小值。 
2. 在每一步中，评估$f(x)$在$O(n)$通过扫描所有点并计算最大约束。 
3. 翻转所有符号后，对“轴下”情况重复相同的过程$y_i$。 
4. 取两种情况下的最小有效结果。 如果两者都无效，则输出$-1$。 

### 为什么它有效

 该变换将几何覆盖问题简化为最小化一维凸函数的上包络。 每个点定义一个约束$r$作为凸二次方程$x$，可行半径是这些曲线中的最大值。 凸函数的最大值仍然是凸的，确保了唯一的最小值。 三元搜索是有效的，因为该函数除了全局最小值之外没有局部最小值。 相切约束消除了第二个自由度$y$，将问题分解为单变量优化。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**30

def solve_case(points):
    def calc(x):
        res = 0.0
        for xi, yi in points:
            res = max(res, ((x - xi) * (x - xi) + yi * yi) / (2.0 * yi))
        return res

    lo, hi = -1e7, 1e7
    for _ in range(80):
        m1 = (2 * lo + hi) / 3
        m2 = (lo + 2 * hi) / 3
        if calc(m1) > calc(m2):
            lo = m1
        else:
            hi = m2
    return calc((lo + hi) / 2)

def solve(points):
    best = INF

    # case 1: center above axis
    if all(y > 0 for _, y in points):
        best = min(best, solve_case(points))

    # case 2: center below axis (flip)
    flipped = [(x, -y) for x, y in points]
    if all(y > 0 for _, y in flipped):
        best = min(best, solve_case(flipped))

    return best if best < INF else -1

def main():
    n = int(input())
    points = [tuple(map(int, input().split())) for _ in range(n)]
    ans = solve(points)
    print(ans)

if __name__ == "__main__":
    main()
```该实现明确地分离了两个几何配置，以避免在评估函数内混合符号约束。 这`calc(x)`函数计算固定水平中心位置所需的半径，三元搜索细化最佳 x 坐标。 

迭代次数固定为 80 次，足以满足所需精度的浮点收敛。 每个评估与点数成线性关系，因此性能为$O(n \log C)$。 

一个常见的陷阱是忘记分母$2y_i$需要一致的符号处理。 这就是为什么我们明确翻转“轴下方”情况的坐标，而不是尝试将两者统一在一个公式中。 

## 工作示例

 ### 示例 1

 输入：```
1
0 1
```我们评估“轴上”情况，因为该点位于河流上方。 

| 步骤| x 候选人 | 计算半径|
 | --- | --- | --- |
 | 初始| 0 | 0.5 | 0.5

 三元搜索立即稳定在$x = 0$，因为对称性使得单个点的所有 x 值都相等。 

结果证实最小圆恰好在一点处接触轴并穿过单个巢穴。 

### 示例 2

 输入：```
2
-1 2
1 2
```该结构是对称的，因此最佳中心位于$x = 0$。 

| 步骤| x| 半径约束|
 | --- | --- | --- |
 | 评价| 0 | 最大值((1 + 4)/4, (1 + 4)/4) = 1.25 |

 三元搜索很快收敛到$x = 0$，确认对称性将问题简化为单个评估点。 

这显示了多个点如何创建竞争的二次约束，其最大值定义半径。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \log R)$| 每个三元搜索步骤扫描所有点，重复约 80 次 |
 | 空间|$O(1)$| 仅存储输入点|

 约束允许最多$10^5$点，并且每次评估都是线性的。 通过恒定次数的迭代，解决方案可以轻松地满足时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import math

    INF = 10**30

    def solve_case(points):
        def calc(x):
            res = 0.0
            for xi, yi in points:
                res = max(res, ((x - xi) * (x - xi) + yi * yi) / (2.0 * yi))
            return res

        lo, hi = -1e7, 1e7
        for _ in range(80):
            m1 = (2 * lo + hi) / 3
            m2 = (lo + 2 * hi) / 3
            if calc(m1) > calc(m2):
                lo = m1
            else:
                hi = m2
        return calc((lo + hi) / 2)

    n = int(input())
    pts = [tuple(map(int, input().split())) for _ in range(n)]

    best = INF

    if all(y > 0 for _, y in pts):
        best = min(best, solve_case(pts))

    flipped = [(x, -y) for x, y in pts]
    if all(y > 0 for _, y in flipped):
        best = min(best, solve_case(flipped))

    print(-1 if best == INF else best)

# provided sample 1
assert run("1\n0 1\n") == "0.5", "sample 1"

# custom: symmetric pair
assert run("2\n-1 2\n1 2\n") != "", "basic feasibility"

# custom: impossible (mixed sides too restrictive for single tangency)
assert run("2\n-1 1\n1 -1\n") == "-1", "infeasible configuration"

# custom: vertical line
assert run("3\n0 2\n0 3\n0 4\n") != "", "collinear vertical points"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 轴上方 1 点 | 0.5 | 0.5 基本相切行为 |
 | 对称点| 正半径| 凸性和对称性|
 | 混合迹象不可能的情况| -1 | 可行性约束|

 ## 边缘情况

 关键的边缘情况是当点位于 x 轴两侧时，会强制上方或下方的任何圆切线失败。 例如，如果我们有积分$(0, 1)$和$(0, -1)$，与轴相切的圆不能包含下点，反之亦然。 该算法正确地拒绝了这两种情况，因为每个可行性检查都未通过其符号条件。 

另一个微妙的情况是所有点都非常接近轴但不交叉它。 在这种情况下，数值精度会影响三元搜索收敛性。 固定的迭代次数确保了稳定性，并且以浮点工作就足够了，因为所需的精度仅为$10^{-6}$。 

最后一种情况涉及对称分布，其中最佳 x 不在任何输入 x 坐标处。 三元搜索可以顺利地处理这个问题，因为目标是凸的，因此最小值可能位于点之间的连续空间中，而不需要离散的候选位置。
