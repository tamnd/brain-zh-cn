---
title: "CF 102439A - 距离 BSUIR 开赛还有四分钟"
description: "我们有一条从位置 0 到位置 (xn) 的大学的直路。 摄像机 (i) 位于位置 (xi)，当汽车经过该点时，其速度不得超过 (vi)。 汽车以零速启动。"
date: "2026-08-14T15:55:52+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102439
codeforces_index: "A"
codeforces_contest_name: "2018-2019 9th BSUIR Open Programming Championship. Semifinal"
rating: 0
weight: 102439
solve_time_s: 142
verified: true
draft: false
---

[CF 102439A - 距离 BSUIR Open 还剩四分钟](https://codeforces.com/problemset/problem/102439/A)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 22s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一条从位置 0 到位置 (x_n) 的大学的直路。 摄像机 (i) 位于位置 (x_i)，当汽车经过该点时，其速度不得超过 (v_i)。 汽车以零速启动。 它最多可以以加速度加速（a），最多以减速度制动（b），并保持匀速。 

输入给出了摄像机位置及其速度限制，以及两个加速度参数。 所需的输出是从位置 0 到最后一个摄像机（也是大学）的最小可能行进时间。 

主要困难在于相机仅在一个位置限制速度。 在摄像机之间，汽车可能暂时比任一端点的速度快得多。 例如，如果两个连续摄像机的速度为 1 和 1，则最快的运动不一定保持在速度 1。汽车可以加速到 1 以上，然后在第二个摄像机之前制动回 1。 

当 (n) 达到 (10^5) 时，(O(n^2)) 算法的执行时间约为

 [
 \frac{10^5(10^5-1)}2 \约 5\cdot 10^9
 ]

 最坏情况下的成对检查。 这远远超出了一秒限制所能处理的范围。 该解决方案必须对每个摄像机进行固定次数的处理。 

有几种边缘情况很容易被错误处理。 例如，如果唯一的摄像机速度限制为零，```
1 1 1
1 0
```正确答案是（2）。 汽车必须从零开始，行驶一个单位后又回到零，因此它加速到速度 1，然后制动到零。 简单使用 (x/v) 的解决方案会中断，因为端点速度为零。 

中间摄像头还可以迫使汽车停下来。 为了```
2 1 1
1 0
2 1
```正确答案约为 (3.4494897428)。 第一个单元需要加速和制动归零，然后汽车才能再次开始加速。 将每个部分视为独立的恒速运动在这里会严重失败。 

相同的相机限制是另一个微妙的情况。 考虑```
2 1 1
1 1
2 1
```答案约为 (1.8989794856)。 在第二段，汽车应加速到速度 1 以上，然后制动回速度 1。仅以速度 1 行驶这两个段会得到较慢的答案。 

最后，最后一个摄像机是目的地，因此它的速度限制是端点约束，而不仅仅是继续前进之前的限制。 如果其限制为零，则汽车必须以零速度完成。 向后传递自然地处理了该约束。 

## 方法

 一种直接的方法是确定每个摄像头对其速度的限制程度。 对于 (x_i) 处的摄像机，后面的每个摄像机 (j) 都会给出制动条件

 [
 u_i^2 \le v_j^2 + 2b(x_j-x_i)。 
]

 暴力实现可以检查每个后面的摄像机的每个（i），采用允许的最小速度，然后从一开始就进行类似的加速工作。 这是正确的，因为每个可能的未来相机都被显式检查，但它执行 (O(n^2)) 操作，大约在 (n=10^5) 时检查 (5\cdot10^9) 次。 

有用的观察结果是这些约束具有局部重现性。 假设摄像机 (i+1) 可以合法使用的最大速度已知。 那么相机 (i) 处的最大速度在距离 (x_{i+1}-x_i) 上仍然可以降低到该速度为

 [
 \sqrt{v_{i+1}^2+2b(x_{i+1}-x_i)}。 
]

 任何早期的相机都已通过 (i+1) 处存储的值进行了汇总。 这意味着完整的制动限制可以在一次向后传递中计算出来。 

同样的想法从一开始就有效。 如果摄像机（i-1）处可达到的最大速度为（u），则在加速度最大为（a）的情况下行驶距离（d）后，可达到的最大速度为

 [
 \sqrt{u^2+2ad}。 
]

 将此与相机自身的限制相结合，给出左侧所有约束所允许的最大速度。 

令 (F_i) 为摄像机 (i) 处的最大速度，仅考虑起点和之前的摄像机。 令 (B_i) 为摄像机 (i) 处的最大速度，仅考虑其后面的摄像机和制动限制。 那么两个方向同时兼容的最大速度为

 [
 s_i=\min(F_i,B_i)。 
]

 这些速度正是我们需要的端点速度。 一旦两个连续端点速度固定，它们之间的最快运动具有非常简单的形状：以速率（a）加速到某个峰值速度（p），然后以速率（b）制动到下一个端点速度。 

对于长度为 (d) 的线段，以速度 (u) 开始并以速度 (v) 结束，加速和制动期间行驶的距离为

 [
 d=\frac{p^2-u^2}{2a}+\frac{p^2-v^2}{2b}。 
]

 求解 (p^2) 给出

 [
 p^2=
 \frac{2abd+bu^2+av^2}{a+b}。 
]

 那么该段的时间是

 [
 \frac{p-u}{a}+\frac{p-v}{b}。 
]

 两个通道产生的端点速度是相互可达的，因此所得的 (p) 始终至少是两个端点速度。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^2)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳 | (O(n)) | (O(n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 读取所有相机位置 (x_i) 和限制 (v_i)。 将位置 0 视为速度固定为零的附加点。 
2. 计算前进速度限制 (F_i)。 从位置 0 处的速度为零开始。对于每个摄像机，使用加速度 (a) 计算从先前的前进速度可达到的最大速度，然后用 (v_i) 限制它：

 [
 F_i=\min\left(v_i,\sqrt{F_{i-1}^2+2a(x_i-x_{i-1})}\right)。 
]

 这捕获了来自一开始和所有早期相机的所有限制。 

1. 计算向后速度限制 (B_i)。 从最后一个摄像机开始 (B_n=v_n)。 向后移动并计算汽车在前一个摄像头处的速度，同时仍制动至 (B_{i+1})：

 [
 B_i=\min\left(v_i,\sqrt{B_{i+1}^2+2b(x_{i+1}-x_i)}\right)。 
]

 这会将所有未来的制动约束压缩为每个摄像机的一个值。 

1. 定义每个摄像机的实际终点速度为

 [
 s_i=\min(F_i,B_i)。 
]

前向值保证汽车可以从一开始就到达 (s_i)，同时尊重之前的摄像头。 后向值保证它可以从 (s_i) 继续到目的地，同时尊重未来的摄像机。 

1、位置0加上速度（s_0=0）。 对于每对连续的位置，令距离为 (d=x_i-x_{i-1})，起始速度为 (u=s_{i-1})，结束速度为 (v=s_i)。 
2. 找出最佳峰值速度

 [
 p^2=
 \frac{2abd+bu^2+av^2}{a+b}。 
]

 汽车从 (u) 加速到 (p)，然后从 (p) 到 (v) 制动。 分段时间为

 [
 t_i=\frac{p-u}{a}+\frac{p-v}{b}。 
]

 1. 将所有分段时间相加并以足够的精度打印结果。 

### 为什么它有效

 前向传递保持了 (F_i) 是摄像机 (i) 处可达到的最大速度的不变量，同时满足从开始到 (i) 的每个摄像机。 递归直接从 (v^2=u^2+2ad) 得出。 

向后传递保持了对称不变量，即 (B_i) 是摄像机 (i) 允许的最大速度，同时仍然能够满足从 (i) 到目的地的每个摄像机。 它的递推遵循制动关系 (u^2=v^2+2bd)。 

因此 (s_i=\min(F_i,B_i)) 是每个摄像机在两个方向上可行的最大速度。 使用较大的终点速度将违反先前的加速约束或未来的制动约束。 使用较小的终点速度无法改善行进时间，因为固定位置之间最快的路段不会因允许较大的可行终点速度而带来收益减少。 

对于两个固定终点速度，任何花费在低于 (a) 的加速或低于 (b) 的制动的时间都可以被更快的加速或制动所取代，而不会违反终点条件。 因此，最佳分段由最大加速度和随后的最大制动组成。 求解距离方程给出了其唯一的峰值速度，因此分段公式给出了可能的最小时间。 将这些最优片段相加即可得出全局最优值。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

def solve():
    n, a, b = map(int, input().split())

    x = [0] * n
    v = [0] * n

    for i in range(n):
        x[i], v[i] = map(int, input().split())

    # Maximum speed reachable from the start while
    # respecting all cameras seen so far.
    forward = [0.0] * n
    cur = 0.0
    prev_x = 0

    for i in range(n):
        d = x[i] - prev_x
        reachable = math.sqrt(cur * cur + 2.0 * a * d)
        cur = min(float(v[i]), reachable)
        forward[i] = cur
        prev_x = x[i]

    # Maximum speed allowed when looking from the destination backwards.
    backward = [0.0] * n
    backward[-1] = float(v[-1])

    for i in range(n - 2, -1, -1):
        d = x[i + 1] - x[i]
        reachable = math.sqrt(
            backward[i + 1] * backward[i + 1] + 2.0 * b * d
        )
        backward[i] = min(float(v[i]), reachable)

    # The actual feasible maximum speed at each camera.
    speed = [min(forward[i], backward[i]) for i in range(n)]

    ans = 0.0
    prev_speed = 0.0
    prev_x = 0.0

    for i in range(n):
        d = x[i] - prev_x
        cur_speed = speed[i]

        # During the optimal segment:
        #
        # d = (p^2 - u^2)/(2a) + (p^2 - v^2)/(2b)
        #
        # so:
        # p^2 = (2abd + bu^2 + av^2) / (a+b)
        p2 = (
            2.0 * a * b * d
            + b * prev_speed * prev_speed
            + a * cur_speed * cur_speed
        ) / (a + b)

        # Protect against a tiny negative value caused by floating point
        # rounding in cases where the exact value is zero.
        p = math.sqrt(max(0.0, p2))

        ans += (p - prev_speed) / a
        ans += (p - cur_speed) / b

        prev_speed = cur_speed
        prev_x = x[i]

    print(f"{ans:.10f}")

if __name__ == "__main__":
    solve()
```第一遍使用`cur`作为当前从一开始就可以达到的最佳速度。 表达式`cur * cur + 2.0 * a * d`是标准的恒定加速度关系，并且在相机限制中取最小值会立即包含新的限制。 

向后传递从最终摄像机的实际速度限制开始。 由于目的地恰好是最后一个摄像机，因此它之后没有更晚的位置，因此它的后向值就是简单的`v[-1]`。 每个较早的摄像机都受到下一个摄像机之前可用制动距离的限制。 

第三阶段结合了两个阵列。 相机可以从左侧到达，但无法安全地从右侧离开，反之亦然。 取最小值可以同时处理这两种情况。 

段计算是最微妙的部分。 峰值速度不一定等于任一端点速度。 即使两个摄像头都需要速度 1，汽车之间的速度也可能比 1 快。 的二次表达式为`p2`正是解释了这种可能性。 

Python 中不存在整数溢出问题。 在转换为浮点数之前，Python 整数可以轻松处理最大的中间值，并且相应的值也完全在双精度浮点数的有用范围内。 这`max(0.0, p2)`Guard 仅防止因舍入引起的微小负值。 

## 工作示例

 ### 示例 1

 输入是```
2 1 1
1 1
2 2
```前向传播从零开始。 

| 相机 | 职位| 限制| 向前 (F_i) | 向后 (B_i) | 最终速度 (s_i) |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 1 | 1.000000 | 1.000000 | 1.000000 |
 | 2 | 2 | 2 | 1.732051 | 2.000000 | 1.732051 |

 对于第一段，起点和终点速度分别为 0 和 1。最佳峰值速度为

 [
 p=\sqrt{1.5}\约1.224745。 
]

 该段大约需要 (1.449490) 个时间单位。 

对于第二段，端点速度为 1 和 (\sqrt3)。 汽车可以在整个路段加速，因此其峰值为(\sqrt3)，该路段大约需要(0.732051)。 

| 细分 | 距离 | 启动速度| 结束速度| 峰值速度| 时间 |
 | --- | --- | --- | --- | --- | --- |
 | 0 到 1 | 1 | 0.000000 | 0.000000 1.000000 | 1.224745 | 1.449490 |
 | 1 到 2 | 1 | 1.000000 | 1.732051 | 1.732051 | 0.732051 |

 总数约为 (2.1815405)，与样本输出匹配。 

### 示例 2

 输入是```
4 1 5
2 3
4 5
7 3
9 5
```前向限制是

 [
 2、\四边形 2.828427、\四边形 3、\四边形 3.605551。 
]

 向后限制是

 [
 3、\四边形 4.358899、\四边形 3、\四边形 5。 
]

 取最小值给出实际速度

 [
 2、\quad2.828427、\quad3、\quad3.605551。 
]

 | 细分 | 距离 | 启动速度| 结束速度| 峰值速度| 时间 |
 | --- | --- | --- | --- | --- | --- |
 | 0 到 2 | 2 | 0.000000 | 0.000000 2.000000 | 2.000000 | 2.000000 |
 | 2 至 4 | 2 | 2.000000 | 2.828427 | 2.828427 2.828427 | 2.828427 0.828427 | 0.828427
 | 4 至 7 | 3 | 2.828427 | 2.828427 3.000000 | 3.628590 | 0.925880 |
 | 7 至 9 | 2 | 3.000000 | 3.605551 | 3.605551 | 0.605551 |

 总和约为 (4.3598594)，与第二个样本匹配。 

第三段特别有用，因为它的峰值速度大于两个端点速度。 这正是仅基于平均速度或相机速度的解决方案会错过的情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n)) | (O(n)) | 两次线性传递计算前向和后向限制，然后是一次线性传递计算段时间。 |
 | 空间| (O(n)) | (O(n)) | 存储摄像机数据以及前进、后退和最终速度数组。 |

 该算法仅对每个相机执行固定数量的运算，因此 (10^5) 个相机仅需要数十万次算术运算。 内存使用量也是线性的，轻松容纳在 256 MB 以内。 

## 测试用例```python
import sys
import io
import math

def solve_io(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    n, a, b = map(int, sys.stdin.readline().split())

    x = [0] * n
    v = [0] * n

    for i in range(n):
        x[i], v[i] = map(int, sys.stdin.readline().split())

    forward = [0.0] * n
    cur = 0.0
    prev_x = 0

    for i in range(n):
        d = x[i] - prev_x
        cur = min(float(v[i]), math.sqrt(cur * cur + 2.0 * a * d))
        forward[i] = cur
        prev_x = x[i]

    backward = [0.0] * n
    backward[-1] = float(v[-1])

    for i in range(n - 2, -1, -1):
        d = x[i + 1] - x[i]
        backward[i] = min(
            float(v[i]),
            math.sqrt(
                backward[i + 1] * backward[i + 1]
                + 2.0 * b * d
            )
        )

    speed = [min(forward[i], backward[i]) for i in range(n)]

    ans = 0.0
    prev_speed = 0.0
    prev_x = 0.0

    for i in range(n):
        d = x[i] - prev_x
        cur_speed = speed[i]

        p2 = (
            2.0 * a * b * d
            + b * prev_speed * prev_speed
            + a * cur_speed * cur_speed
        ) / (a + b)

        p = math.sqrt(max(0.0, p2))

        ans += (p - prev_speed) / a
        ans += (p - cur_speed) / b

        prev_speed = cur_speed
        prev_x = x[i]

    sys.stdin = old_stdin
    return f"{ans:.10f}"

def assert_close(inp: str, expected: float, eps: float = 1e-8):
    actual = float(solve_io(inp))
    assert abs(actual - expected) <= eps, (actual, expected)

# Provided sample 1
assert_close(
    """\
2 1 1
1 1
2 2
""",
    2.1815405,
    1e-7,
)

# Provided sample 2
assert_close(
    """\
4 1 5
2 3
4 5
7 3
9 5
""",
    4.3598594,
    1e-7,
)

# Minimum-size input, endpoint speed is zero.
assert_close(
    """\
1 1 1
1 0
""",
    2.0,
)

# One camera, endpoint speed is nonzero.
expected = 2.0 * math.sqrt(1.5) - 1.0
assert_close(
    """\
1 1 1
1 1
""",
    expected,
)

# All camera limits are equal.
p = math.sqrt(1.5)
expected = (2.0 * p - 1.0) + 2.0 * (p - 1.0)
assert_close(
    """\
3 1 1
1 1
2 1
3 1
""",
    expected,
)

# Intermediate camera forces a full stop.
expected = 2.0 + (2.0 * math.sqrt(1.5) - 1.0)
assert_close(
    """\
2 1 1
1 0
2 1
""",
    expected,
)

# Maximum-size input with a very simple exact answer.
# Every camera forces speed zero, so every unit segment takes exactly 2 time units.
n = 100000
parts = [f"{n} 1 1"]
parts.extend(f"{i} 0" for i in range(1, n + 1))
max_input = "\n".join(parts) + "\n"
assert_close(max_input, 2.0 * n, 1e-7)

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 1 / 1 0`|`2`| 最小输入和零终点速度|
 |`1 1 1 / 1 1`|`1.4494897428...`| 从零开始，以正速度结束 |
 |`3 1 1 / 1 1 / 2 1 / 3 1`|`2.3484692289...`| 摄像机之间的限制和加速度高于摄像机速度 |
 |`2 1 1 / 1 0 / 2 1`|`3.4494897428...`| 中级零速相机|
 |`100000 1 1`随后是职位`1..100000`, 全部有极限`0`|`200000`| 最大值 (n)、线性时间行为和重复零约束 |

 ## 边缘情况

 对于速度限制为零的最终相机，请考虑```
1 1 1
1 0
```前进速度为零，因为相机禁止任何正端点速度。 向后的速度也为零，因为这是目的地。 因此选定的终点速度为零。 对于单个段来说，

 [
 p^2=\frac{2\cdot1\cdot1\cdot1}{2}=1,
 ]

 所以（p=1）。 加速需要一个时间单位，制动需要另一个时间单位，正好给出 (2)。 

对于中间零速相机，```
2 1 1
1 0
2 1
```两次通过都在第一个摄像机处选择零速度。 第一段的峰值速度为 1，需要 2 个时间单位。 第二段从零开始，以速度 1 结束，给出峰值速度 (\sqrt{1.5}) 和时间 (2\sqrt{1.5}-1)。 总数约为 (3.4494897428)。 向后传递可以防止算法通过第一个摄像头携带非法的正速度。 

对于相同的相机限制，```
2 1 1
1 1
2 1
```两个相机速度都选择为 1。在第一段上，峰值为 (\sqrt{1.5})，因此时间为 (2\sqrt{1.5}-1)。 在第二段上使用相同的峰值，但两个端点已经具有速度 1，给出时间 (2(\sqrt{1.5}-1))。 总数约为 (1.8989794856)。 这说明了为什么分段计算必须允许汽车超过摄像机之间的两个摄像机速度。 

对于速度限制高但限制性摄像机较早的目的地，前向传递可以成为主动约束。 在示例 1 中，第二个摄像头允许速度 2，但在可用距离内，第一个摄像头只能以速度 1 到达 (\sqrt3)。 因此，最终选择的速度是 (\sqrt3)，而不是 2。前向传播防止算法假设每个摄像机的发布限制都是独立可达到的。
