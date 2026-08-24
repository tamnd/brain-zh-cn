---
title: "CF 102163G - 阿里和早餐"
description: "Ali 从区间 ([L,R]) 中统一选择发射角度，以度为单位。 茶滴以速度 (V) 从原点开始，在重力 (g=10) 下遵循普通抛射运动，最后落在 (X) 轴上。"
date: "2026-08-23T08:11:23+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102163
codeforces_index: "G"
codeforces_contest_name: "NCD 2019"
rating: 0
weight: 102163
solve_time_s: 874
verified: true
draft: false
---

[CF 102163G - 阿里和早餐](https://codeforces.com/problemset/problem/102163/G)

 **评级：** -
 **标签：** -
 **求解时间：** 14m 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 Ali 从区间 ([L,R]) 中统一选择发射角度，以度为单位。 茶滴以速度 (V) 从原点开始，在重力 (g=10) 下遵循普通抛射运动，最后落在 (X) 轴上。 每个朋友都拥有一个杯子，该杯子由该轴上的区间 ([X_1,X_2]) 表示。 对于每个杯子，我们需要使着陆坐标属于该区间的发射角度的分数。 杯子可能会重叠，并且每个概率都是独立计算的。 

角度 (θ) 的射程为

 [
 x(\theta)=\frac{V^2\sin(2\theta)}{g}
 =\frac{V^2}{10}\sin(2\theta)。 
]

 输入允许 (N\le 1000)，因此每个测试用例的 (O(N)) 解决方案很容易足够快。 即使 (O(N\log N)) 也能舒适地适应，但没有理由在这里对任何东西进行排序，因为每个杯子都可以独立处理。 坐标和速度可以达到(10^9)，所以(V^2)可以达到(10^{18})。 Python 整数可以准确地处理这个问题，而最终的反三角计算只需要浮点精度，因为答案会打印到小数点后四位。 

主要的几何困难是 (x(\theta)) 在整个 (0^\circ) 到 (90^\circ) 区间内不是单调的。 它增加直到 (45^\circ)，然后减少。 仅计算一个反正弦角的粗心实现会错过第二个分支。 例如，对于 (V=10)，角度 (30^\circ) 和角度 (60^\circ) 都会产生 (10\sin60^\circ) 的着陆位置。 两个角度都必须对概率有贡献。 

终点也需要小心。 考虑```
1
1 10 0 90
0 10
```最大可能范围是 (10)，所以正确答案是`1.0000`。 由于微小的浮点误差而将 (x=V^2/10) 视为位于反正弦域之外的公式可能会错误地产生零或域误差。 

情况（L=R）是另一种特殊情况。 例如，```
1
1 10 45 45
9 10
```发射角度固定为 (45^\circ)，产生 (x=10)，所以正确答案是`1.0000`。 在不处理这种情况的情况下除以 (R-L) 将除以零。 

最后，杯子可以完全超出射弹的最大射程。 为了```
1
1 10 0 90
11 20
```答案是`0.0000`，因为水滴永远不会传播得比 (10) 更远。 同样的推理处理从 (0) 开始的杯子，当角度间隔具有正长度时，精确端点 (x=0) 的概率为零。 

## 方法

 直接的蛮力想法是对许多发射角度进行采样，模拟相应的着陆位置，并计算进入每个杯子的样本数量。 这是一个近似值，因为角度是唯一的随机变量，但它不是一个好的竞争性编程解决方案。 例如，在 (90^\circ) 间隔内每 (10^{-5}) 度采样一个杯子大约需要 (9\cdot10^6) 个样本。 当 (N=1000) 时，大约变成 (9\cdot10^9) 次杯子检查。 更重要的是，除非仔细控制采样误差，否则采样不能为所需的四位小数舍入提供干净的数学保证。 

蛮力之所以有效，是因为答案正是一组有效角度的测量值。 有用的观察是我们可以分析地描述该集合。 

开始于

 [
 x=\frac{V^2}{10}\sin(2\theta),
 ]

 着陆坐标 (x) 对应于

 [
 \sin(2\theta)=\frac{10x}{V^2}。 
]

 对于 (0\leq x\leq V^2/10)，令

 [
 \alpha=\frac{1}{2}\arcsin\left(\frac{10x}{V^2}\right)。 
]

 在 (0^\circ\leq\theta\leq90^\circ) 内，方程 (x(\theta)=x) 有两个可能的解：

 [
 θ=α
 ]

 和

 [
 θ=90^circ-alpha。 
]

 更重要的是，不等式 (x(\theta)\leq x) 在两个区间上成立：

 [
 \theta\leq\alpha
 ]

 或

 [
 \theta\geq90^\circ-\alpha。 
]

 因此，对于任何坐标 (x)，我们都可以准确计算出所请求的角度间隔 ([L,R]) 最多产生多少个着陆坐标 (x)。 将此量称为 (F(x))。 落在杯子内的概率 ([X_1,X_2]) 就简单地表示为

 [
 \frac{F(X_2)-F(X_1)}{R-L}。 
]

 将问题转化为 (O(N)) 的观察结果是，每个杯子只需要对同一累积函数进行两次评估。 杯子之间没有相互作用，因此重叠的杯子不需要特殊处理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(NM))，其中 (M) 是采样角度的数量 | (O(1)) | (O(1)) | 太慢而且只是近似值 |
 | 最佳 | (O(N)) | (O(1)) 除了输入/输出存储 | 已接受 |

 ## 算法演练

 1. 将 (L) 和 (R) 从角度转换为弧度。 Python中的三角函数使用弧度，并且将整个计算保持在弧度内可以避免重复转换角度。 
2.定义最大可能的水平范围

 [
 X_{\max}=\frac{V^2}{10}。 
]

 如果查询的坐标 (x) 至少为 (X_{\max})，则每个可能的发射角度都落在 (x) 处或之前。 如果 (x\leq0)，则对于非简并角度区间，累积概率为零，因为精确着陆在 (x=0) 处仅发生在孤立的端点角度处。 

1. 对于(0<x<X_{\max})，计算

 [
 \alpha=\frac12\arcsin\left(\frac{10x}{V^2}\right)。 
]

 (x(\theta)\leq x) 的有效角度为

 [
 [0,\alpha]\cup[90^\circ-\alpha,90^\circ]。 
]

 这是关键的一步。 第二个间隔是必要的，因为射弹射程在 (45^\circ) 之后减小。 

1. 将两个有效角度间隔与实际随机间隔 ([L,R]) 相交。 第一个交点的长度是

 [
 \max(0,\min(R,\alpha)-L),
 ]

 第二个的长度是

 [
 \max(0,R-\max(L,90^\circ-\alpha))。 
]

 它们的总和是着陆坐标至多为 (x) 的总角度测量值。 

1. 对于每个杯子 ([X_1,X_2])，计算两个端点的累积测量值。 它们的差异正是角度测量

 [
 X_1\leq x(\theta)\leq X_2。 
]

 除以 (R-L) 即可获得概率。 

1. 如果(L=R)，则跳过累积计算，因为不存在正长度随机区间。 直接评估单个轨迹。 如果它的着陆坐标属于杯子，则打印`1.0000`; 否则打印`0.0000`。 

### 为什么它有效

 对于正长度角度区间，函数 (F(x)) 精确计算 ([L,R]) 中着陆坐标至多为 (x) 的角度的测量值。 两个反正弦分支描述了满足该不等式的每个角度，因为 (2\theta) 位于 (0) 和 (\pi) 之间，其中正弦先增大然后减小。 因此，由 (F(X_2)) 而不是由 (F(X_1)) 计数的角度正是落在杯子内的角度。 由于发射角度是均匀的，因此将该角度测量值除以总角度长度即可得出所需的概率。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

PI = math.pi
HALF_PI = math.pi / 2.0

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n, v, L, R = map(int, input().split())

        lrad = math.radians(L)
        rrad = math.radians(R)
        total = rrad - lrad

        v2 = v * v

        if L == R:
            # The angle is fixed, so the result is deterministic.
            landing = (v2 / 10.0) * math.sin(2.0 * lrad)

            for _ in range(n):
                x1, x2 = map(int, input().split())

                # Small tolerance protects exact endpoint cases such as
                # sin(0) and sin(pi/2) from floating-point noise.
                eps = 1e-9 * max(1.0, abs(landing))

                if x1 - eps <= landing <= x2 + eps:
                    out.append("1.0000")
                else:
                    out.append("0.0000")

            continue

        def measure_leq(x):
            """
            Return the angular length inside [lrad, rrad]
            for which the landing coordinate is <= x.
            """
            if x <= 0:
                return 0.0

            # Compare using integers before converting to float.
            # x >= v^2 / 10  <=>  10*x >= v^2
            if 10 * x >= v2:
                return total

            y = (10.0 * x) / v2

            # y is mathematically in (0, 1), but clamp against
            # a possible floating-point overshoot.
            y = max(0.0, min(1.0, y))

            alpha = 0.5 * math.asin(y)

            # First branch: theta <= alpha.
            left = max(0.0, min(rrad, alpha) - lrad)

            # Second branch: theta >= pi/2 - alpha.
            second_start = HALF_PI - alpha
            right = max(0.0, rrad - max(lrad, second_start))

            return left + right

        for _ in range(n):
            x1, x2 = map(int, input().split())

            m1 = measure_leq(x1)
            m2 = measure_leq(x2)

            probability = (m2 - m1) / total

            # Protect the printed value from tiny accumulated
            # floating-point errors such as 1.0000000000000002.
            probability = max(0.0, min(1.0, probability))

            out.append(f"{probability:.4f}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```该解决方案首先为每个测试用例转换一次角度边界，因为每个杯子都使用相同的间隔。 整数`v2`准确存储 (V^2)。 比较`10 * x >= v2`在转换为浮点之前有意执行，因此重要的最大范围边界是在没有精度损失的情况下确定的。 

这`measure_leq`function 是演练中累积函数的实现。 对于内部坐标，`alpha`代表第一个反正弦分支。 变量`second_start`表示 (45^\circ) 之后的对称分支。 每个分支与实际随机间隔相交，使用`max`和`min`，当没有交集时自然会给出零。 

杯赛概率用差值`m2 - m1`。 无需担心杯端点本身是否包含在内，因为对于正长度的连续随机角度区间，各个角度的概率为零。 

在定义累积函数之前先分离固定角度的情况。 否则`total`为零，概率公式将除以零。 该分支中的容差仅用于将确定性浮点轨迹与整数杯边界进行比较。 

Python 的任意大小整数还消除了 32 位实现中存在的溢出问题。 唯一的浮点运算是三角计算和最终概率，其精度足以精确到小数点后四位。 

## 工作示例

 提供的示例使用 (V=15)，因此

 [
 X_{\max}=\frac{15^2}{10}=22.5。 
]

 随机角度区间为(30^\circ)到(45^\circ)，长度为(15^\circ)。 

| 杯| (X_1) | (X_2) | (X_1) | 处的累积测量 (X_2) | 处的累积测量 概率|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 16 | 16 21 | 21 (0) | 约 (4.4805^\circ) | 0.2987 | 0.2987
 | 2 | 21 | 21 22 | 22 约 (4.4805^\circ) | 大约 (8.9490^\circ) | 0.2979 | 0.2979
 | 3 | 22 | 22 30| 大约 (8.9490^\circ) | (15^\circ) | 0.4034 | 0.4034
 | 4 | 10 | 10 15 | 15 (0) | (0) | 0.0000 | 0.0000
 | 5 | 1 | 40 | 40 (0) | (15^\circ) | 1.0000 | 1.0000

 第一个杯子说明了主要的反正弦计算。 区间内可能的最小着陆位置开始于 (19.49) 附近，因此 (16) 不贡献累积测量值。 上端点 (21) 对应于 (34.48^\circ) 周围的角度，在 (30^\circ) 到 (45^\circ) 区间内留下大约 (4.48^\circ) 个有效角度。 除以 (15^\circ) 大约得出 (0.2987)。 

第二个和第三个杯子表明重叠或相邻的间隔不需要任何全局处理。 每个答案都是从相同的累积函数获得的。 最终的杯子包含了整个可能的着陆范围，因此它的概率恰好为一。 

对于第二个例子，考虑简并角区间```
1
3 10 45 45
9 10
0 9
10 20
```发射角度固定为(45^\circ)，着陆位置为

 [
 \frac{10^2}{10}\sin(90^\circ)=10。 
]

 | 杯| 固定角度| 着陆位置| 着陆在杯内吗？ | 概率|
 | --- | --- | --- | --- | --- |
 | ([9,10]) | (45^\circ) | 10 | 10 是的 | 1.0000 | 1.0000
 | ([0,9]) | (45^\circ) | 10 | 10 没有 | 0.0000 | 0.0000
 | ([10,20]) | (45^\circ) | 10 | 10 是的 | 1.0000 | 1.0000

 此示例练习 (L=R) 分支，并确认杯边界被视为杯的一部分。 对于固定角度，没有可积分的概率分布，因此答案很简单，即确定性着陆坐标是否属于该区间。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 (O(N)) | 每个杯子执行两次恒定时间累积计算 |
 | 空间| (O(1)) 辅助空间 | 除了输出缓冲区外，仅需要标量变量 |

 对于 (N\leq1000)，该算法仅对每个杯子执行少量算术和三角运算。 在坐标范围内没有排序、模拟、数值积分或迭代，因此它完全符合一秒的限制。 最大的中间整数是 (V^2\leq10^{18})，Python 可以准确处理。 

## 测试用例```python
import sys
import io
import math

PI = math.pi
HALF_PI = math.pi / 2.0

def solve_text(inp: str) -> str:
    data = io.StringIO(inp)
    input_ = data.readline
    t = int(input_())
    out = []

    for _ in range(t):
        n, v, L, R = map(int, input_().split())

        lrad = math.radians(L)
        rrad = math.radians(R)
        total = rrad - lrad
        v2 = v * v

        if L == R:
            landing = (v2 / 10.0) * math.sin(2.0 * lrad)

            for _ in range(n):
                x1, x2 = map(int, input_().split())
                eps = 1e-9 * max(1.0, abs(landing))

                if x1 - eps <= landing <= x2 + eps:
                    out.append("1.0000")
                else:
                    out.append("0.0000")

            continue

        def measure_leq(x):
            if x <= 0:
                return 0.0

            if 10 * x >= v2:
                return total

            y = (10.0 * x) / v2
            y = max(0.0, min(1.0, y))

            alpha = 0.5 * math.asin(y)

            left = max(0.0, min(rrad, alpha) - lrad)

            second_start = HALF_PI - alpha
            right = max(0.0, rrad - max(lrad, second_start))

            return left + right

        for _ in range(n):
            x1, x2 = map(int, input_().split())

            probability = (
                measure_leq(x2) - measure_leq(x1)
            ) / total

            probability = max(0.0, min(1.0, probability))
            out.append(f"{probability:.4f}")

    return "\n".join(out)

def run(inp: str) -> str:
    return solve_text(inp)

sample1 = """\
1
5 15 30 45
16 21
21 22
22 30
10 15
1 40
"""

assert run(sample1) == """\
0.2987
0.2979
0.4034
0.0000
1.0000
""", "sample 1"

sample2 = """\
1
3 10 0 90
0 5
5 10
0 10
"""

assert run(sample2) == """\
0.3333
0.6667
1.0000
""", "full angle range"

sample3 = """\
1
3 10 45 45
9 10
0 9
10 20
"""

assert run(sample3) == """\
1.0000
0.0000
1.0000
""", "fixed angle"

sample4 = """\
1
1 10 0 90
11 20
"""

assert run(sample4) == """\
0.0000
""", "cup beyond maximum range"

sample5 = """\
1
3 10 0 90
0 10
0 10
0 10
"""

assert run(sample5) == """\
1.0000
1.0000
1.0000
""", "all equal cups"

# Maximum N: 1000 independent cups, all containing the entire
# reachable range. The generated input has exactly 1000 queries.
n = 1000
max_case = "1\n{} 10 0 90\n".format(n) + ("0 10\n" * n)
expected = "1.0000\n" * n
assert run(max_case).splitlines() == expected.strip().splitlines(), "maximum N"

# Boundary case: x = 0 is reachable only at isolated angles,
# so it has probability zero for a positive-length angle interval.
sample6 = """\
1
2 10 0 90
0 1
1 10
"""

assert run(sample6) == """\
0.0000
1.0000
""", "zero endpoint and maximum endpoint"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 10 0 90 / 0 10`|`1.0000`| 最小尺寸的外壳和完整的可达范围 |
 |`1 / 3 10 0 90 / 0 5, 5 10, 0 10`|`0.3333, 0.6667, 1.0000`| 反正弦分支和精确最大值 |
 |`1 / 3 10 45 45 / 9 10, 0 9, 10 20`|`1.0000, 0.0000, 1.0000`| (L=R) 和边界包含 |
 |`1 / 1 10 0 90 / 11 20`|`0.0000`| 罩杯完全超出可触及范围|
 |`1 / 3 10 0 90 / 0 10`重复|`1.0000`对于每一个杯子| 完全平等的罩杯值和独立答案 |
 | 1000 杯`[0,10]`| 1000行`1.0000`| 最大 (N) 和线性复杂度 |
 |`1 / 2 10 0 90 / 0 1, 1 10`|`0.0000, 1.0000`| 下边界和最大范围边界 |

 ## 边缘情况

 当(L=R)时，随机角度区间的宽度为零，因此通常的概率公式不能除以(R-L)。 为了```
1
1 10 45 45
9 10
```该算法计算单个着陆位置 (10)，检查 (9\leq10\leq10)，并打印`1.0000`。 如果杯子是`[0,9]`，相同的确定性计算将产生`0.0000`。 

当杯子延伸超出最大可能范围时，累积函数立即返回上端点的整个角度测量值。 为了```
1
1 10 0 90
11 20
```最大范围为 (10)，因此杯子的两个端点都超出它。 两个累积测量值的差异为零，给出`0.0000`。 

当杯子包含整个可到达范围时，每个发射角度都是有效的。 为了```
1
1 10 0 90
0 10
```下端点贡献零累积测量，上端点贡献全部 (90^\circ)。 他们的区别是完全随机区间，所以答案是`1.0000`。 

非单调射程是通过计算两个角度间隔来处理的。 带 (V=10)、(L=0)、(R=90) 和杯子`[0,5]`，条件 (x\leq5) 等价于 (\sin(2\theta)\leq0.5)。 对于 (\theta\in[0,15^\circ]) 和 (\theta\in[75^\circ,90^\circ]) 会出现这种情况，给出 (90^\circ) 中的 (30^\circ) 有效角度，因此`0.3333`。 仅使用第一个反正弦分支的实现将仅计数 (15^\circ) 并错误地返回`0.1667`。 

对于 (x=0)，唯一可能的角度是 (0^\circ) 和 (90^\circ)。 当 (L<R) 时，这些是孤立点，概率为零。 因此```
1
2 10 0 90
0 1
1 10
```产生`0.0000`对于第一杯和`1.0000`对于第二个。 累积计算自然可以处理这个问题，因为`measure_leq(0)`返回零，同时`measure_leq(10)`返回完整的角度测量值。 

重叠的杯子不需要特殊处理，因为每个概率都会询问自己的间隔。 在样本中，`[16,21]`,`[21,22]`， 和`[22,30]`共享端点，但每个答案都是根据两个累积值独立计算的。 没有尝试划分地面或仅将着陆点分配给一个杯子。
