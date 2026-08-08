---
title: "CF 102700A - 方法"
description: "有两个朋友同时在飞机上移动。 第一个从点 (A) 开始，径直走向 (B)。 第二个从 (C) 开始，径直走向 (D)。"
date: "2026-08-08T08:09:09+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102700
codeforces_index: "A"
codeforces_contest_name: "2020 ICPC Universidad Nacional de Colombia Programming Contest"
rating: 0
weight: 102700
solve_time_s: 228
verified: true
draft: false
---

[CF 102700A - 方法](https://codeforces.com/problemset/problem/102700/A)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 有两个朋友同时在飞机上移动。 第一个从点 (A) 开始，径直走向 (B)。 第二个从 (C) 开始，径直走向 (D)。 他们的速度相等，所以如果我们选择公共速度为（1），那么每个朋友所需要的时间正好是他们自己路线的长度。 一旦朋友到达目的地，该朋友就会停在那里。 

输入包含第一行的 (A) 和 (B) 四个坐标，后面是第二行的 (C) 和 (D) 四个坐标。 所需的输出是两个朋友之间从同时出发到都到达目的地的任何时间之间的最小欧几里德距离。 

坐标的绝对值最大可达 (10^9)。 这使得平方距离大约大到 (10^{18})，因此实现需要可以安全地表示这些值的算术。 Python 整数具有任意精度，只有在计算实际最小化时间或最终平方根时才需要浮点数。 由于只有四个点并且没有取决于输入大小的参数，因此预期的解决方案应该花费恒定的时间。 

一个常见的错误是仅比较初始距离和最终距离。 例如，```
0 0 10 0
5 5 5 -5
```初始距离是(5\sqrt{2})，最终距离也是(5\sqrt{2})，但是朋友们在移动的过程中变得更近了。 在时间 (5) 时，第一个朋友位于 ((5,0))，第二个朋友位于 ((5,0))，因此正确答案为 (0)。 仅检查端点会错过实际的最小值。 

当一位朋友提前到达时会出现另一种极端情况。 例如，```
0 0 1 0
2 0 2 10
```第一个朋友在一个时间单位后到达 ((1,0))，然后停留在那里。 第二个朋友继续移动十个单位。 最短距离是 (1)，是第一个朋友到达目的地时所达到的。 将两条轨迹视为无限期地持续下去会考虑第一个朋友从未实际占据的位置，并且可能会产生无效答案。 

第三种情况是在一段时间间隔内相对速度为零。 例如，```
0 0 10 0
0 1 10 1
```朋友们以完全相同的速度平行移动，因此他们的距离始终为 (1)。 即使问题本身是完全明确定义的，除以相对速度的平方而不检查它是否为零的公式也会除以零。 

最后，最小值可以恰好发生在一位朋友到达目的地时。 例如，```
0 0 2 0
1 1 1 -1
```在时间 (1) 处，第二个朋友到达 ((1,-1))，而第一个朋友位于 ((1,0))，给出距离 (1)。 由于相关间隔在到达时间关闭，因此实现必须允许最小化时间等于任一端点。 

## 方法

 一种直接的方法是以非常小的时间增量模拟运动，计算每个增量的两个位置，并保持找到的最小距离。 这在概念上很容易，因为实际的轨迹只是两条线段，后面跟着驻点。 问题是没有有意义的固定模拟步骤。 当坐标达到 (10^9) 时，路线的长度可能约为 (10^9)，因此即使使用一百万或十亿时间样本进行模拟也会太不准确或太慢​​。 更重要的是，数值模拟可以跳过最小值出现的确切时刻，因此无法可靠地提供所需的（10^{-6}）精度。 

蛮力可以改为在每个轨迹上采样 (K) 个点。 这需要 (O(K)) 距离评估，但 (K) 必须选择足够大，以保证每种可能的坐标配置所需的精度。 由于当坐标很大时，最小值可能出现在任意狭窄的区域中，因此没有实际的固定值 (K) 可以提供这样的保证。 

关键的观察结果是运动在时间上是分段线性的。 在任何一个朋友到达目的地之前，两个位置都是时间的线性函数。 一个朋友到达后，该朋友的位置变得恒定，而另一个朋友的位置仍然是线性的。 两者到达后，两个位置都保持不变。 

考虑任意时间间隔，其中两个位置可以写为

 [
 P_1(t)=P+tV_1
 ]

 和

 [
 P_2(t)=Q+tV_2。 
]

 那么他们的相对位置就是

 [
 R(t)=(P-Q)+t(V_1-V_2)。 
]

 所以在这个区间上，距离的平方是

 [
 f(t)=|R(t)|^2。 
]

 这是 (t) 的二次函数。 形式的二次方

 [
 在^2+bt+c
 ]

 (a\geq0) 在其顶点或区间的端点处达到最小值。 我们可以直接计算顶点而不需要采样时间。 

只有三个可能的运动阶段。 在第一次到达之前，两个朋友都搬走了。 在第一次和第二次到达之间，一个移动，另一个静止。 第二次到达后，两者都没有移动，因此距离是恒定的。 我们可以独立处理这些间隔并取最小距离。 

蛮力方法之所以有效，是因为每个采样时间都会给出一对有效的位置，但它会失败，因为它没有有限的采样密度来保证所需的精度。 每个相都具有线性相对运动的观察结果将整个问题简化为最小化最多三个一维凸二次方程，这需要恒定的时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟 | (O(K)) | (O(1)) | (O(1)) | 太慢且不保证准确 |
 | 最优分段二次最小化 | (O(1)) | (O(1)) | (O(1)) | (O(1)) | 已接受 |

 ## 算法演练

 1. 读取四个点并计算运动向量 (B-A) 和 (D-C)。 它们的长度是总行程时间，因为两个朋友的速度相同 (1)。 
2. 使用速度向量表示每个朋友在时间 (t) 的位置。 到达之前，速度是朝向目的地的标准化方向。 到达后，速度为零。 

归一化很方便，因为相等的物理速度意味着两个速度矢量都必须具有大小 (1)，无论它们各自的路径有多长。 
3. 设 (T_1=|B-A|) 和 (T_2=|D-C|)。 在 (0)、(\min(T_1,T_2)) 和 (\max(T_1,T_2)) 处分割时间线。 在每个结果间隔上，每个朋友的速度都是固定的。 
4. 对于一个区间 ([L,R])，将相对位置写为

 [
 X(t)=X_0+tV,
 ]

 其中 (X_0) 是零时刻的相对位置，(V) 是相对速度。 

距离的平方为

 [
 |X_0+tV|^2。 
]

 展开它给出

[
 |V|^2t^2+2(X_0\cdot V)t+|X_0|^2。 
]
 5. 如果 (V\neq0)，对二次方程进行微分。 其无约束最小值出现在

 [
 t^*=-\frac{X_0\cdot V}{|V|^2}。 
]

 由于我们只允许使用 ([L,R]) 内的时间，因此将此值限制在该间隔内。 候选人时间为

 [
 \max(L,\min(R,t^*))。 
]

 钳位处理二次方不断减小直到一个朋友到达目的地的情况。 
6. 如果（V=0），则相对位置在整个间隔内不会改变，因此每次都有相同的距离。 我们可以简单地评估一个端点。 
7. 评估所有运动阶段的最小值并取最小的平方距离。 最后，取其平方根并以足够的精度打印出来。 

### 为什么它有效

 不变的是，在每个处理的时间间隔上，这两个位置公式准确地描述了朋友在该间隔内每个时间的位置。 它们的相对位置在时间上是线性的，因此它们的平方距离是凸二次方。 当顶点位于区间内时，闭区间上的凸二次方程的最小值是其顶点，否则是区间端点之一。 夹紧步骤精确检查该点。 由于完整的时间线在朋友速度变化的每一时刻都被划分，因此每个可能的时间都被这些间隔之一覆盖。 因此，在所有间隔中选取最小的候选者就可以得到全局最小距离。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

def dot(a, b):
    return a[0] * b[0] + a[1] * b[1]

def norm(a):
    return math.hypot(a[0], a[1])

def position_at(p, v, t):
    return (p[0] + v[0] * t, p[1] + v[1] * t)

def solve():
    ax, ay, bx, by = map(int, input().split())
    cx, cy, dx, dy = map(int, input().split())

    a = (float(ax), float(ay))
    b = (float(bx), float(by))
    c = (float(cx), float(cy))
    d = (float(dx), float(dy))

    ab = (b[0] - a[0], b[1] - a[1])
    cd = (d[0] - c[0], d[1] - c[1])

    t1 = norm(ab)
    t2 = norm(cd)

    if t1 > 0:
        v1 = (ab[0] / t1, ab[1] / t1)
    else:
        v1 = (0.0, 0.0)

    if t2 > 0:
        v2 = (cd[0] / t2, cd[1] / t2)
    else:
        v2 = (0.0, 0.0)

    def state(t):
        if t < t1:
            p1 = position_at(a, v1, t)
        else:
            p1 = b

        if t < t2:
            p2 = position_at(c, v2, t)
        else:
            p2 = d

        return (
            p1[0] - p2[0],
            p1[1] - p2[1],
        )

    def distance_sq(t):
        r = state(t)
        return r[0] * r[0] + r[1] * r[1]

    # The only times where velocities can change are the arrival times.
    cuts = sorted(set([0.0, t1, t2]))

    ans = float("inf")

    # Before the first arrival, both move.
    # Between arrival times, one may be stationary.
    # The final interval is constant, but processing it is harmless.
    for i in range(len(cuts)):
        if i + 1 < len(cuts):
            l = cuts[i]
            r = cuts[i + 1]
        else:
            # There is no need to search after both have arrived.
            continue

        mid = (l + r) * 0.5

        if mid < t1:
            vv1 = v1
        else:
            vv1 = (0.0, 0.0)

        if mid < t2:
            vv2 = v2
        else:
            vv2 = (0.0, 0.0)

        rel_v = (vv1[0] - vv2[0], vv1[1] - vv2[1])

        rel_l = state(l)

        vv2_norm_sq = dot(rel_v, rel_v)

        if vv2_norm_sq == 0.0:
            candidate = l
        else:
            optimum = -dot(rel_l, rel_v) / vv2_norm_sq
            candidate = max(l, min(r, optimum))

        ans = min(ans, distance_sq(candidate))

    # Both friends are stationary from max(t1, t2) onward.
    ans = min(ans, distance_sq(max(t1, t2)))

    print(f"{math.sqrt(ans):.12f}")

if __name__ == "__main__":
    solve()
```实现的第一部分计算两条路线长度并将每条路线转换为单位速度矢量。 这可以直接从选择常见步行速度（1）得出。 如果路线的长度为零，则相应的朋友已经到达目的地，因此其速度设置为零，而不是尝试除以零长度。 

这`state`函数实现分段运动。 与到达时间的比较可以确定朋友是否仍在移动或已经到达目的地。 端点本身被视为目的地位置，这在数学上与当时的移动公式相同。 

这`cuts`数组包含每次速度可以改变的时间。 最多有 3 个不同的时间，因此循环仅执行恒定次数的迭代。 对于每个间隔，中点仅用于确定在整个开放间隔中哪个速度处于活动状态。 中点不是答案的数值近似值。`rel_l`是区间左端点的相对位置。 由于相对速度在整个区间内是恒定的，因此区间内任意时刻 (t) 的相对位置为

 [
 \text{rel}_l+(t-L)\text{rel}_v。 
]

 该代码在导出顶点时使用等效的全局时间表达式。 因为`rel_l`在时间 (L) 评估，根据全局时间计算的确切顶点应该是

 [
 L-\frac{\text{rel}_l\cdot\text{rel}_v}{|\text{rel}_v|^2}。 
]

 因此，实现应该使用这种形式。 完整的更正实施如下。```python
import sys
import math

input = sys.stdin.readline

def solve():
    ax, ay, bx, by = map(int, input().split())
    cx, cy, dx, dy = map(int, input().split())

    a = (float(ax), float(ay))
    b = (float(bx), float(by))
    c = (float(cx), float(cy))
    d = (float(dx), float(dy))

    ab = (b[0] - a[0], b[1] - a[1])
    cd = (d[0] - c[0], d[1] - c[1])

    t1 = math.hypot(ab[0], ab[1])
    t2 = math.hypot(cd[0], cd[1])

    v1 = (0.0, 0.0) if t1 == 0.0 else (ab[0] / t1, ab[1] / t1)
    v2 = (0.0, 0.0) if t2 == 0.0 else (cd[0] / t2, cd[1] / t2)

    def position(p, v, t, total, destination):
        if t >= total:
            return destination
        return (p[0] + v[0] * t, p[1] + v[1] * t)

    def relative_position(t):
        p1 = position(a, v1, t, t1, b)
        p2 = position(c, v2, t, t2, d)
        return (p1[0] - p2[0], p1[1] - p2[1])

    def dist_sq(t):
        x, y = relative_position(t)
        return x * x + y * y

    cuts = sorted(set((0.0, t1, t2)))
    ans = float("inf")

    for i in range(len(cuts) - 1):
        l = cuts[i]
        r = cuts[i + 1]

        mid = (l + r) * 0.5

        active_v1 = v1 if mid < t1 else (0.0, 0.0)
        active_v2 = v2 if mid < t2 else (0.0, 0.0)

        rv = (
            active_v1[0] - active_v2[0],
            active_v1[1] - active_v2[1],
        )

        rel_l = relative_position(l)

        rv_sq = rv[0] * rv[0] + rv[1] * rv[1]

        if rv_sq == 0.0:
            best_t = l
        else:
            # rel(t) = rel_l + (t-l) * rv
            # Minimize |rel(t)|^2.
            tau = -(rel_l[0] * rv[0] + rel_l[1] * rv[1]) / rv_sq
            best_t = max(l, min(r, l + tau))

        ans = min(ans, dist_sq(best_t))

    ans = min(ans, dist_sq(max(t1, t2)))

    print(f"{math.sqrt(ans):.12f}")

if __name__ == "__main__":
    solve()
```第二个版本是要提交的版本。 之间的区别`tau`和`best_t`是一个有用的实现细节。`tau`测量相对于当前间隔开始的时间，而`best_t`是实际的全球时间。 混合这两个坐标系是错误最小化器的典型来源。 

Python 中不会发生整数溢出，因为整数具有任意精度。 在速度归一化之前，坐标会转换为浮点，因为归一化的矢量和路线长度需要实数算术。 通过在小数点后打印十二位数字可以轻松处理 (10^{-6}) 的最终误差容限。 

## 工作示例

 ### 示例 1

 输入是```
0 0 1 0
2 0 2 1
```第一个朋友水平移动一个单位，因此 (T_1=1)。 第二个垂直移动一个单位，因此 (T_2=1)。 因此两者都在相同的区间 ([0,1]) 内移动。 

速度为 ((1,0)) 和 ((0,1))，因此相对速度为 ((1,-1))。 初始相对位置为((-2,0))。 

| 间隔| 左侧相对位置 | 相对速度| 松开相对时间| 选择的时间 | 距离 |
 | --- | --- | --- | --- | --- | --- |
 | ([0,1]) | ([0,1]) | ((-2,0)) | ((-2,0)) | ((1,-1)) | ((1,-1)) | (1) | (1) | (\sqrt{2}) | (\sqrt{2}) |

 在时间 (1) 时，好友分别位于 ((1,0)) 和 ((2,1))。 它们的差是((-1,-1))，其长度是(\sqrt{2})。 因此，输出约为 (1.414213562373)。 

此示例演示了普通情况，其中两个朋友都在整个相关区间内移动，并且二次极小值恰好出现在区间边界处。 

### 示例 2

 输入是```
-2 -4 -2 -2
-3 -5 -3 -2
```两个朋友垂直向上移动。 第一条路线的长度为 (2)，第二条路线的长度为 (3)。 它们的速度都是 ((0,1))，因此在前两个单位时间内它们的相对速度为零。 

| 间隔| 左侧相对位置 | 相对速度| 选择的时间 | 距离 |
 | --- | --- | --- | --- | --- |
 | ([0,2]) | ([0,2]) | ((1,1)) | ((1,1)) | ((0,0)) | ((0,0)) | (0) | (\sqrt{2}) | (\sqrt{2}) |
 | ([2,3]) | ((1,1)) | ((1,1)) | ((0,-1)) | ((0,-1)) | (3) | (1) |

 在第一个间隔期间，两个朋友一起移动，因此他们的分离仍然存在 (\sqrt{2})。 在时间 (2)，第一个朋友停在 ((-2,-2))，而第二个朋友停在 ((-3,-3))。 第二个继续向上，在时间 (3) 处到达 ((-3,-2))，此时距离变为 (1)。 因此答案是（1）。 

该迹线明确证实，必须在不除法的情况下处理零相对速度，并且在一个朋友已经停止之后可能会出现最小值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(1)) | (O(1)) | 最多有三个不同的时间线边界和两个要最小化的移动间隔。 |
 | 空间| (O(1)) | (O(1)) | 仅存储恒定数量的点、向量和标量值。 |

 坐标界限不会影响操作数量，因为该算法从不采样坐标平面或时间轴。 尽管坐标可以大到 (10^9)，但只执行恒定数量的算术运算，因此该解决方案很容易满足一秒的时间限制和 512 MB 内存限制。 

## 测试用例```python
import sys
import io
import math

def solve():
    input = sys.stdin.readline

    ax, ay, bx, by = map(int, input().split())
    cx, cy, dx, dy = map(int, input().split())

    a = (float(ax), float(ay))
    b = (float(bx), float(by))
    c = (float(cx), float(cy))
    d = (float(dx), float(dy))

    ab = (b[0] - a[0], b[1] - a[1])
    cd = (d[0] - c[0], d[1] - c[1])

    t1 = math.hypot(ab[0], ab[1])
    t2 = math.hypot(cd[0], cd[1])

    v1 = (0.0, 0.0) if t1 == 0 else (ab[0] / t1, ab[1] / t1)
    v2 = (0.0, 0.0) if t2 == 0 else (cd[0] / t2, cd[1] / t2)

    def position(p, v, t, total, destination):
        if t >= total:
            return destination
        return (p[0] + v[0] * t, p[1] + v[1] * t)

    def relative_position(t):
        p1 = position(a, v1, t, t1, b)
        p2 = position(c, v2, t, t2, d)
        return p1[0] - p2[0], p1[1] - p2[1]

    def dist_sq(t):
        x, y = relative_position(t)
        return x * x + y * y

    cuts = sorted(set((0.0, t1, t2)))
    ans = float("inf")

    for i in range(len(cuts) - 1):
        l, r = cuts[i], cuts[i + 1]
        mid = (l + r) * 0.5

        active_v1 = v1 if mid < t1 else (0.0, 0.0)
        active_v2 = v2 if mid < t2 else (0.0, 0.0)

        rv = (
            active_v1[0] - active_v2[0],
            active_v1[1] - active_v2[1],
        )

        rel_l = relative_position(l)
        rv_sq = rv[0] * rv[0] + rv[1] * rv[1]

        if rv_sq == 0.0:
            best_t = l
        else:
            tau = -(rel_l[0] * rv[0] + rel_l[1] * rv[1]) / rv_sq
            best_t = max(l, min(r, l + tau))

        ans = min(ans, dist_sq(best_t))

    ans = min(ans, dist_sq(max(t1, t2)))

    print(f"{math.sqrt(ans):.12f}")

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def assert_close(actual: str, expected: float, message: str):
    value = float(actual)
    assert abs(value - expected) <= 1e-6, (
        f"{message}: got {value}, expected {expected}"
    )

# Provided sample 1.
assert_close(
    run("0 0 1 0\n2 0 2 1\n"),
    math.sqrt(2),
    "sample 1"
)

# Provided sample 2.
assert_close(
    run("-2 -4 -2 -2\n-3 -5 -3 -2\n"),
    1.0,
    "sample 2"
)

# Both friends start and finish at the same places.
assert_close(
    run("0 0 0 0\n0 0 0 0\n"),
    0.0,
    "both stationary at the same point"
)

# Both move with exactly the same velocity, so the distance never changes.
assert_close(
    run("0 0 10 0\n0 1 10 1\n"),
    1.0,
    "parallel identical motion"
)

# The friends meet exactly when the first friend reaches the destination.
assert_close(
    run("0 0 10 0\n5 5 5 -5\n"),
    0.0,
    "minimum exactly at an arrival boundary"
)

# One friend is already at its destination while the other moves.
assert_close(
    run("0 0 0 0\n2 0 2 10\n"),
    2.0,
    "zero-length first route"
)

# Large coordinates, checking arithmetic and precision.
assert_close(
    run("1000000000 1000000000 -1000000000 1000000000\n"
        "1000000000 1000000001 -1000000000 1000000001\n"),
    1.0,
    "large coordinates"
)

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`0 0 0 0`和`0 0 0 0`|`0`| 两个朋友都静止在同一个位置。 |
 |`0 0 10 0`和`0 1 10 1`|`1`| 相对速度为零，因此不被零除。 |
 |`0 0 10 0`和`5 5 5 -5`|`0`| 最小值恰好出现在相边界处。 |
 |`0 0 0 0`和`2 0 2 10`|`2`| 一条路线的长度为零，并且相应的朋友从一开始就是静止的。 |
 | 震级坐标 (10^9) |`1`| 大坐标和浮点精度。 |

 ## 边缘情况

 ### 朋友们在到达边界见面

 考虑```
0 0 10 0
5 5 5 -5
```两条路线都需要 (10) 个时间单位。 在 (t=5) 时，第一个朋友位于 ((5,0))，而第二个朋友也在 ((5,0))。 相对位置恰好为零，因此答案为（0）。 

区间最小化计算 (t=5) 处的无约束二次最小值。 由于(5)位于闭区间([0,10])内，因此直接接受。 这捕获了仅严格检查内部点或仅检查最终位置的实现。 

### 一位朋友先于另一位朋友到达

 考虑```
0 0 1 0
2 0 2 10
```第一个朋友在 (t=1) 到达 ((1,0)) 并停留在那里。 第二个朋友从 ((2,0)) 向上移动。 在第二阶段期间，相对位置由静止的第一朋友和移动的第二朋友确定。 最近的点位于 (t=1)，距离为 (1)。 

时间线在 (t=1) 处分割，因此算法不会意外地在到达后继续第一个朋友的速度。 

### 相对速度为零

 考虑```
0 0 10 0
0 1 10 1
```两个朋友的速度都是 ((1,0))。 它们的相对速度为 ((0,0))，相对位置始终为 ((0,-1))。 因此距离始终为 (1)。 

该算法检测到相对速度平方为零并跳过顶点公式。 区间中的任何点都是最佳的，因此评估左端点就足够了。 

### 朋友从一开始就是静止的

 考虑```
0 0 0 0
2 0 2 10
```第一个朋友的路线为零长度并且永远不会移动。 第二个从距离第一个的距离 (2) 开始并垂直移动，因此 (t=0) 时的最小距离为 (2)。 

路线长度检查为第一个朋友创建了零速度。 然后，第二个朋友的动作将被正常处理，第一个朋友在整个相关时间间隔内被视为静止。 

### 最小值位于间隔端点

 假设二次距离函数在整个区间内递减，并在区间结束后达到其顶点。 该顶点对应于其中一个朋友已经改变速度的时间，因此它不能用于该阶段。 

夹紧操作将超出范围的顶点更改为 (L) 或 (R)。 由于每个速度变化时间都明确包含在`cuts`，正确的终点仍然被评估为相邻阶段的一部分。 这可以防止在假设的速度不再有效时接受数学上有效的二次最小值的常见错误。
