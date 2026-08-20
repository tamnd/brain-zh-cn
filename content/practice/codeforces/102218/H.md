---
title: "CF 102218H - 伤心广播电台"
description: "我们有几个正弦波，它们都以相同的角频率振荡。 波之间唯一不同的是它们的振幅和相位。 我们需要用具有相同频率的一个正弦波替换它们的和，并报告其幅度和相位。"
date: "2026-08-20T03:26:26+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102218
codeforces_index: "H"
codeforces_contest_name: "2019, XI Annual Programming Contest by ESCOM-IPN"
rating: 0
weight: 102218
solve_time_s: 111
verified: false
draft: false
---

[CF 102218H - 伤心广播电台](https://codeforces.com/problemset/problem/102218/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 51s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有几个正弦波，它们都以相同的角频率振荡。 波之间唯一不同的是它们的振幅和相位。 我们需要用具有相同频率的一个正弦波替换它们的和，并报告其幅度和相位。 

对于波 (i)，

 [
 f_i(t)=A_i\sin(\omega t+\phi_i)。 
]

 完整的信号是

 [
 f(t)=\sum_{i=1}^{n} A_i\sin(\omega t+\phi_i),
 ]

 我们想要值 (A\ge 0) 和 (0\le\phi<2\pi) 使得

 [
 f(t)=A\sin(\omega t+\phi)
 ]

 对于每 (t)。 

一旦我们认识到每个波都具有相同的频率，频率（Ω）实际上与计算无关。 挑战在于有效地组合幅度和相位。 

对于 (n\le 10^5)，(O(n)) 算法完全处于 2 秒限制的预期范围内。 (O(n^2)) 方法在最大输入大小下需要大约 (10^{10}) 次基本运算，这远远超出了时间限制。 输入幅度和相位是实数，因此实现还必须使用浮点运算并遵守所需的 (10^{-6}) 精度。 

三种边缘情况通常会导致原本合理的实现失败。 首先是取消。 考虑```
2 1
1 0
1 3.141592653589793
```这两个波是相反的，因此它们的和恰好为零。 正确的结果是```
0 0
```因为当 (A=0) 时，相位没有影响，并且 (0) 是有效选择。 粗心的实现可能会调用`atan2(0, 0)`并获得依赖于实现的解释，或者可能产生微小的数值幅度和任意相位。 

第二个问题是相位的象限。 为了```
1 1
1 4.71238898038469
```答案是相同的幅度和相位，大约```
1 4.71238898038469
```自从`atan2`返回 ([-\pi,\pi]) 中的值，它可能返回 (-\pi/2) 而不是 (3\pi/2)。 数学相位是等效的，但所需的输出范围具体为([0,2\pi))，因此必须对负角度进行归一化。 

第三个问题是两个累积部分的取消。 例如，```
2 1
100 0
100 3.141592653589793
```应该再次产生零。 中间的正弦和余弦分量可以非常小，因为大的正和负贡献被抵消。 解决方案不应基于浮点值的精确相等做出决策，除非最终幅度实际上为零。 

## 方法

 考虑该问题的一种直接但不必要的昂贵方法是在许多不同时间评估完整信号。 对于每个选定的时间 (t)，我们将计算所有 (n) 个波并将它们相加。 如果我们使用 (n) 个采样时间，则需要对 (n) 个波进行 (n) 次评估，从而给出 (O(n^2)) 工作。 在 (n=10^5) 处，大约有 (10^{10}) 波评估，这太慢了。 

蛮力方法是正确的，因为每个单独的波都是根据其定义精确评估的，因此计算出的样本实际上是所需总和的样本。 问题在于，共同频率为我们提供的结构比任意样本所需的结构要多得多。 

关键的观察是角加恒等式

 [
 \sin(x+\phi)=\sin x\cos\phi+\cos x\sin\phi。 
]

 将其应用于每个波可以得到

 A_i\cos\phi_i\sin(\omega t)
 +
 A_i\sin\phi_i\cos(\omega t)。 
]

 现在，所有波都使用相同的两个基函数 (\sin(\omega t)) 和 (\cos(\omega t)) 来表示。 我们只需要将它们的系数相加即可。 

定义

 [
 C=\sum_{i=1}^{n} A_i\cos\phi_i
 ]

 和

 [
 S=\sum_{i=1}^{n} A_i\sin\phi_i。 
]

 那么完整的信号就变成了

 [
 f(t)=C\sin(\omega t)+S\cos(\omega t)。 
]

 现在展开所需的单波：

 A\cos\phi\sin(\omega t)
 +
 A\sin\phi\cos(\omega t)。 
]

 匹配两个系数给出

 [
 A\cos\phi=C,
 \qquad
 A\sin\phi=S。 
]

 这两个方程描述了一个坐标为 ((C,S)) 的向量。 它的长度是所得的振幅，

 [
 A=\sqrt{C^2+S^2},
 ]

 它的方向是结果相，

 [
 \phi=\operatorname{atan2}(S,C)。 
]

 因此，整个问题简化为对输入的一次传递，累加两个实数。 

同样的见解也可以被视为向量加法。 每个正弦曲线 (A_i\sin(\omega t+\phi_i)) 对应于长度 (A_i) 和角度 (\phi_i) 的向量。 添加波意味着添加这些矢量。 所得向量的长度为 (A)，方向为 (\phi)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^2)) | (O(1)) | (O(1)) | 太慢了|
 | 最佳| (O(n)) | (O(n)) | (O(1)) | (O(1)) | 已接受 |

 ## 算法演练

 1. 初始化两个累加器（C=0）和（S=0）。 它们将分别存储 (\sin(\omega t)) 和 (\cos(\omega t)) 的系数。 
2. 对于每个输入波，计算 (A_i\cos\phi_i) 并将其添加到 (C)。 计算 (A_i\sin\phi_i) 并将其添加到 (S)。 

这是中心的转变。 我们永远不需要在任何实际时间 (t) 评估波，因为它们的共同频率意味着每个波都使用相同的两个基函数。 
3.处理完所有波后，计算

 [
 A=\sqrt{C^2+S^2}。 
]

 值 (C) 和 (S) 恰好是 (A\cos\phi) 和 (A\sin\phi)，因此它们的欧几里德长度必定是振幅。 

1. 如果 (A) 实际上为零，则输出 (0) 和相位 (0)。 

无论相位如何，零幅度正弦曲线都为零，因此相位 (0) 是有效的规范选择。 这也避免了询问零向量的方向。 
2.否则计算

 [
 \phi=\operatorname{atan2}(S,C)。 
]`atan2`是必需的而不是普通的`atan(S/C)`因为它知道两个分量的符号，从而确定正确的象限。 

1. 如果相位为负，则加上 (2\pi)。 然后用足够的十进制数字打印 (A) 和 (\phi) 以满足 (10^{-6}) 误差要求。 

### 为什么它有效

 处理完每个波后，累加器满足

 [
 C=\sum_i A_i\cos\phi_i
 ]

 和

 [
 S=\sum_i A_i\sin\phi_i。 
]

 根据角加恒等式，原始和为

 [
 f(t)=C\sin(\omega t)+S\cos(\omega t)。 
]

 计算出的幅度和相位满足

 [
 A\cos\phi=C
 ]

 和

 [
 A\sin\phi=S。 
]

 将这两个等式代入

 [
 A\sin(\omega t+\phi)
 ]

 正好产生 (C\sin(\omega t)+S\cos(\omega t))，即原始总和。 因此，所得到的正弦曲线对于 (t) 的每个可能值都是等效的，而不仅仅是在选定的采样点上。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

n, omega = input().split()
n = int(n)
omega = float(omega)

c = 0.0
s = 0.0

for _ in range(n):
    a, phi = map(float, input().split())
    c += a * math.cos(phi)
    s += a * math.sin(phi)

amplitude = math.hypot(c, s)

if amplitude < 1e-12:
    phase = 0.0
else:
    phase = math.atan2(s, c)
    if phase < 0.0:
        phase += 2.0 * math.pi

print(f"{amplitude:.12f} {phase:.12f}")
```第一行写着`n`和`omega`。 的价值`omega`被解析，因为它是输入格式的一部分，但它不会出现在后面的计算中。 一旦每个波具有相同的频率，只有其幅度和相位决定必须相加的系数向量。 

变量`c`和`s`直接对应于算法中导出的两个系数。 对于每个波，代码计算其水平分量 (A_i\cos\phi_i) 和垂直分量 (A_i\sin\phi_i)，然后将它们添加到各自的累加器中。`math.hypot(c, s)`计算 (\sqrt{c^2+s^2})。 最好手动编写表达式，因为`hypot`旨在稳健地计算向量长度。 

零位检查使用非常小的容差而不是检查`amplitude == 0`。 浮点消除可能会留下由微小残值表示的数学零结果。 当幅度为零时，任何相位都是有效的，因此选择相位 (0) 会给出稳定且有效的输出。 

对于非零结果，`atan2(s, c)`返回向量 ((c,s)) 的角度。 它的结果在([-\pi,\pi])，而问题需要([0,2\pi))。 将 (2\pi) 添加到负结果会将其转换为所需的范围。 恰好 (2\pi) 的结果不会出现在`atan2`，并且仅对负值执行加法 (2\pi)，因此上边界仍然有效。 

频率永远不需要乘以任何表达式。 这样做实际上是一个概念错误，因为所需的输出相位是 (A\sin(\omega t+\phi)) 中的常数 (\phi)，而不是与时间相关的角度 (\omega t+\phi)。 

## 工作示例

 所提供的声明中没有第二个官方示例，因此下面的第二个跟踪使用了一个小的构造输入。 

对于样本 1，重要的状态是 ((C,S)) 对。 下表显示了每个波后的累积值，为了可读性进行了四舍五入。 

| 波| (A_i) | (\phi_i) | (C) 后波| (S) 后波 |
 | --- | --- | --- | --- | --- |
 | 1 | 93.22 | 5.53 | 5.53 65.75 | 65.75 -66.07 | -66.07
 | 2 | 48.58 | 0.86 | 0.86 97.49 | 97.49 -28.99 | -28.99
 | 3 | 15.31 | 15.31 5.39 | 5.39 107.13 | 107.13 -40.89 | -40.89
 | 4 | 5.66 | 5.66 4.12 | 4.12 104.07 | 104.07 -44.76 | -44.76
 | 5 | 48.53 | 48.53 6.09 | 6.09 152.43 | 152.43 -54.13 | -54.13
 | 6 | 6.60 | 6.60 1.42 | 1.42 153.42 | 153.42 -47.61 | -47.61
 | 7 | 21.15 | 21.15 0.06 | 0.06 174.50 | 174.50 -46.34 | -46.34
 | 8 | 4.27 | 4.27 5.47 | 5.47 177.49 | 177.49 -49.20 | -49.20

 圆桌隐藏了一些精度，但全精度累加器给出了大约

 [
 A=185.184472750
 ]

 和

 [
 \phi=6.019915094。 
]

 由于 (C>0) 且 (S<0)，所得矢量位于第四象限。`atan2`首先正确地产生负等效角，然后归一化步骤添加 (2\pi)，给出接近 (6.02) 的所需相位。 

对于构建的取消示例```
2 1
3 0
3 3.141592653589793
```两个波具有相等的振幅和相位，间隔为 (\pi)。 

| 波| (A_i) | (\phi_i) | (C) 后波| (S) 后波 |
 | --- | --- | --- | --- | --- |
 | 1 | 3 | 0 | 3 | 0 |
 | 2 | 3 | (\pi) | 0 | 大约 0 |

 最终的向量是零向量，因此其幅度为零。 该算法选择阶段 (0)，产生```
0.000000000000 0.000000000000
```任何其他相位都将代表相同的零信号。 该跟踪说明了为什么算法必须显式处理零向量情况而不是尝试解释其方向。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n)) | (O(n)) | 每个波需要一个正弦、一个余弦和常数附加算术。 |
 | 空间| (O(1)) | (O(1)) | 仅存储两个累加分量和一些标量变量。 |

 对于 (n=10^5)，算法对输入执行一次传递并且不存储波数组。 其 (O(n)) 运行时间适合 2 秒限制，而其恒定内存使用量远低于 256 MB 限制。 Python的三角函数调用主导了常数因子，但每个都只有(10^5)个，这很实用。 

## 测试用例

 由于浮点输出无法安全地与精确字符串进行比较，因此下面的测试工具会解析两个输出值，并根据容差将它们与预期值进行检查。```python
import sys
import io
import math

def solve():
    input = sys.stdin.readline

    n, omega = input().split()
    n = int(n)
    omega = float(omega)

    c = 0.0
    s = 0.0

    for _ in range(n):
        a, phi = map(float, input().split())
        c += a * math.cos(phi)
        s += a * math.sin(phi)

    amplitude = math.hypot(c, s)

    if amplitude < 1e-12:
        phase = 0.0
    else:
        phase = math.atan2(s, c)
        if phase < 0.0:
            phase += 2.0 * math.pi

    print(f"{amplitude:.12f} {phase:.12f}")

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

def check(inp: str, expected_a: float, expected_phi: float, message: str):
    out = run(inp).split()
    actual_a = float(out[0])
    actual_phi = float(out[1])

    assert math.isclose(actual_a, expected_a, rel_tol=1e-6, abs_tol=1e-6), message
    assert math.isclose(actual_phi, expected_phi, rel_tol=1e-6, abs_tol=1e-6), message

# Provided sample.
sample1 = """\
8 66.82
93.22 5.53
48.58 0.86
15.31 5.39
5.66 4.12
48.53 6.09
6.60 1.42
21.15 0.06
4.27 5.47
"""
check(
    sample1,
    185.184472750,
    6.019915094,
    "sample 1"
)

# Minimum-size input, a single wave must remain unchanged.
check(
    """\
1 1
7 1.2
""",
    7.0,
    1.2,
    "single wave"
)

# Exact cancellation.
check(
    """\
2 10
5 0
5 3.141592653589793
""",
    0.0,
    0.0,
    "complete cancellation"
)

# Phase in the fourth quadrant. This catches atan2 without normalization.
check(
    """\
1 2
4 4.71238898038469
""",
    4.0,
    1.5 * math.pi,
    "negative atan2 result must be normalized"
)

# Equal phases. The amplitudes simply add.
check(
    """\
4 50
1.5 0.75
2.5 0.75
3.0 0.75
4.0 0.75
""",
    11.0,
    0.75,
    "equal amplitudes direction"
)

# Large input, exercising linear processing and accumulation.
large_n = 100000
large_input = f"{large_n} 1\n" + ("1 0\n" * large_n)
large_out = run(large_input).split()
assert math.isclose(float(large_out[0]), 100000.0, rel_tol=1e-6, abs_tol=1e-6)
assert math.isclose(float(large_out[1]), 0.0, rel_tol=1e-6, abs_tol=1e-6)
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 | （185.184472750，\ 6.019915094）| 完整官方示例及综合积累 |
 |`1 1 / 7 1.2`| (7,\1.2)| 最小输入和单波行为 |
 |`2 10 / 5 0 / 5 π`| (0,\0) | (0,\0) | 完全抵消和零振幅|
 |`1 2 / 4 3π/2`| (4,\ 3π/2) |`atan2`象限处理和相位标准化|
 | 带相位的四波 (0.75) | (11,\ 0.75) | 等相位，幅度直接相加 |
 | (10^5) 波，振幅 (1)、相位 (0) | (100000,\0) | 最大输入大小和线性复杂度 |

 ## 边缘情况

 完全抵消由零幅度分支处理。 为了```
2 1
1 0
1 3.141592653589793
```第一波贡献 ((C,S)=(1,0))。 第二个贡献 ((-1,0))，因此最终向量是 ((0,0))。 其幅度为零，算法输出相位为零。 频率不会改变这个结论，因为两个波具有相同的频率。 

第四象限的一个阶段暴露了一个常见的错误`atan2`。 为了```
1 1
1 4.71238898038469
```累积的分量大约是

 [
 C=0，\qquad S=-1。 
]`atan2(-1,0)`返回 (-\pi/2)。 由于所需的相位必须是非负的，因此算法将 (2\pi) 相加，得到 (3\pi/2)，这正是原始相位。 

浮点取消也可以安全处理。 考虑```
2 1
100 0
100 3.141592653589793
```从数学上讲，矢量贡献为 ((100,0)) 和 ((-100,0))。 在浮点算术中，第二个正弦值不一定精确地表示为零，因此最终向量可能包含微小的残差。 这`1e-12`阈值将此类残差视为零向量。 由于所需的数值容差为 (10^{-6})，因此这不会丢弃任何有意义的非零结果。 

最后，除了归一化步骤之外，相界本身不需要特殊处理。 接近 (2\pi) 的相位有一个向量指向正 (C) 轴的正下方，而略高于零的相位则指向正 (C) 轴的正上方。`atan2`正确区分这些标志。 归一化仅将负表示更改为 ([0,2\pi)) 中的等价值，而不更改表示的正弦曲线。
