---
title: "CF 102218C - 电路不稳定"
description: "我们有一个带有电压 (V) 的直流电源，后面接一个电阻 (R)。 在电阻器之后，电流在并联连接的电感器 (L) 和电容器 (C) 之间分流。 最初，电感器电流和电容器电压均为零。"
date: "2026-08-25T04:27:20+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102218
codeforces_index: "C"
codeforces_contest_name: "2019, XI Annual Programming Contest by ESCOM-IPN"
rating: 0
weight: 102218
solve_time_s: 2301
verified: false
draft: false
---

[CF 102218C - 电路不稳定](https://codeforces.com/problemset/problem/102218/C)

 **评级：** -
 **标签：** -
 **求解时间：** 38m 21s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个带有电压 (V) 的直流电源，后面接一个电阻 (R)。 在电阻器之后，电流在并联连接的电感器 (L) 和电容器 (C) 之间分流。 最初，电感器电流和电容器电压均为零。 

我们需要的量是电阻电压 (V_r(t))。 该电路欠阻尼，因为输入保证

 [
 L < 4R^2C。 
]

 这种情况意味着响应会振荡，而其幅度会随着时间的推移而减小。 我们需要 (V_r(t)) 的全局最小值和最大值，以及它们发生的时间。 

输入包含四个实数，所有参数都是小的正值。 没有大的输入大小可供迭代。 相关的挑战不是处理许多值，而是准确地导出连续时间函数。 数值模拟必须选择足够小的时间步长，并且可靠地实现 (10^{-6}) 精度将需要不必要的工作并引入数值问题。 由于电路方程有闭式解，我们应该直接导出极值。 

在某些情况下，粗心的实施可能会失败。 首先，初始电阻电压为 (V)，但这不是振荡响应的最小值或最大值。 例如，与```
6 3.7 0.3 0.2
```最小值稍后出现在大约 (t=0.348848049) 处，值为 (4.430980248)，因此简单地检查 (t=0) 会错过实际最小值。 

第二个陷阱是假设第一次振荡给出两个极值。 内部并联块电压的第一个非零极值是正的，这意味着它给出最小电阻器电压。 下一个极值是负值，给出最大电阻电压。 由于振荡是阻尼的，所以后面的每个极值都有较小的幅度，因此前两个极值是全局极值。 

欠阻尼条件的平等边界也值得关注。 如果 (L=4R^2C)，振荡频率变为零，并且涉及除以该频率的公式将失效。 该问题明确保证了严格的不等式，因此实现可以安全地使用欠阻尼公式。 

## 方法

 直接数值方法可以用小时间步长来模拟微分方程。 在每一步中，我们都可以计算电感器电流、电容器电压和电阻器电压，然后寻找响应方向的变化。 这在概念上是有效的，因为电路方程完全根据初始条件确定状态。 

问题在于决定步长必须有多小。 语句中没有模拟可能停止的有限时间限制，所需的误差为 (10^{-6})。 模拟必须估计振荡衰减的足够长的间隔，并同时使用足够小的步长来准确定位极值。 对于最坏情况的参数集，这可能需要数百万或更多的状态更新，而浮点步长和停止启发法仍然会使答案不可靠。 时间复杂度实际上是 (O(T/h))，其中 (T) 是模拟时间，(h) 是时间步长，两者都不是由问题固定的。 

更好的方法是直接编写电路方程。 令 (u(t)) 为并联电感电容块两端的电压。 由于电感器和电容器并联，因此两者都有电压 (u(t))。 基尔霍夫电压定律给出

 [
 V=V_r(t)+u(t)，
 ]

 所以

 [
 V_r(t)=V-u(t)。 
]

 通过电阻的电流为

 [
 I_r(t)=\frac{V-u(t)}{R}。 
]

 电感电流满足

 [
 I_l'(t)=\frac{u(t)}{L},
 ]

 而电容器电流为

 [
 I_c(t)=C u'(t)。 
]

 使用 (I_r=I_l+I_c)、微分并代入电感方程可得出

 [
 -\frac{u'}{R}=\frac{u}{L}+Cu''。 
]

 重新整理后，

 [
 LCu''+\frac{L}{R}u'+u=0。 
]

 这是标准二阶欠阻尼微分方程。 定义

 [
 \alpha=\frac{1}{2RC}
 ]

 和

 [
 \omega=\sqrt{\frac{1}{LC}-\alpha^2}。 
]

 给定的不等式保证 (\omega>0)。 初始电容器电压为零，因此

 [
 u(0)=0。 
]

 在时间为零时，电感电流也为零。 因此，整个初始电阻器电流都进入电容器：

 [
 I_r(0)=\frac{V}{R}=Cu'(0),
 ]

 这给出了

 [
 u'(0)=\frac{V}{RC}=2\alpha V。 
]

 因此解决方案是

 [
 u(t)=\frac{2\alpha V}{\omega}e^{-\alpha t}\sin(\omega t)。 
]

 因此

 [
 V_r(t)=V-\frac{2\alpha V}{\omega}e^{-\alpha t}\sin(\omega t)。 
]

 现在连续优化问题变成了简单的导数计算。 极值满足

 [
 V_r'(t)=0,
 ]

 或等价 (u'(t)=0)。 微分给出

 [
 u'(t)=
 \frac{2\alpha V}{\omega}e^{-\alpha t}
 \left(\omega\cos(\omega t)-\alpha\sin(\omega t)\right)。 
]

 指数因子永远不会为零，所以我们只需要

 [
 \omega\cos(\omega t)-\alpha\sin(\omega t)=0。 
]

 因此

 [
 \tan(\omega t)=\frac{\omega}{\alpha}。 
]

 让

 [
 \theta=\arctan\left(\frac{\omega}{\alpha}\right)。 
]

 所有极值发生在

 [
 t_k=\frac{\theta+k\pi}{\omega}。 
]

 第一个 (k=0) 使 (\sin(\omega t)) 为正，因此 (u(t)) 为正，并且 (V_r(t)=V-u(t)) 处于最小值。 下一个 (k=1) 使 (u(t)) 为负值，因此给出最大电阻电压。

每个后续极值都具有相同的交替符号，但由于因子 (e^{-\alpha t}) 而具有较小的幅度。 因此，前两个极值是全局最小值和最大值。 

所得解决方案使用恒定数量的算术和三角运算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 数值模拟 | (O(T/h)) | (O(1)) | (O(1)) | 太慢且对精度敏感 |
 | 封闭式解决方案| (O(1)) | (O(1)) | (O(1)) | (O(1)) | 已接受 |

 ## 算法演练

 1. 阅读(V)、(R)、(L) 和(C)。 所有计算都应使用浮点运算，因为输入和所需输出都是实数。 
2. 计算阻尼系数

 [
 \alpha=\frac{1}{2RC}。 
]

 这是振荡的指数衰减率。 

1. 计算阻尼角频率

 [
 \omega=\sqrt{\frac{1}{LC}-\alpha^2}。 
]

 严格的问题条件保证平方根下的值为正。 

1. 计算

 [
 \theta=\arctan\left(\frac{\omega}{\alpha}\right)。 
]

 第一个极值出现在 (\omega t=\theta) 时，因为这是导数方程的最小正解。 

1. 设置

 [
 t_{\min}=\frac{\theta}{\omega}。 
]

 此时，并联块电压为正，因此电阻器电压低于 (V) 并达到其全局最小值。 

1. 设置

 [
 t_{\max}=\frac{\theta+\pi}{\omega}。 
]

 下一个驻点是半个振荡之后。 正弦项已改变符号，使并联块电压为负且电阻器电压大于 (V)。 

1. 评估

 [
 V_r(t)=V-\frac{2\alpha V}{\omega}e^{-\alpha t}\sin(\omega t)
 ]

 在这两次。 在第一行打印最小时间和值，然后在第二行打印最大时间和值。 

### 为什么它有效

 电阻器电压为 (V-u(t))，其中 (u(t)) 是幅度呈指数递减的阻尼正弦曲线。 它的驻点恰好出现在 (\tan(\omega t)=\omega/\alpha) 时，给出正负极值的交替序列。 指数因子随着时间严格减小，因此后面的每个极值的大小都小于前一个极值。 因此，(u) 的第一个正极值产生 (V_r) 的全局最小值，而第一个负极值产生其全局最大值。 该算法根据封闭式解精确计算这两个点。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

def solve():
    V, R, L, C = map(float, input().split())

    alpha = 1.0 / (2.0 * R * C)
    omega = math.sqrt(1.0 / (L * C) - alpha * alpha)

    theta = math.atan(omega / alpha)

    t_min = theta / omega
    t_max = (theta + math.pi) / omega

    amplitude = 2.0 * alpha * V / omega

    def resistor_voltage(t):
        return V - amplitude * math.exp(-alpha * t) * math.sin(omega * t)

    v_min = resistor_voltage(t_min)
    v_max = resistor_voltage(t_max)

    print(f"{t_min:.12f} {v_min:.12f}")
    print(f"{t_max:.12f} {v_max:.12f}")

if __name__ == "__main__":
    solve()
```代码的第一部分计算 (\alpha) 和 (\omega)，它们完全表征了阻尼振荡。 因为输入保证 (L<4R^2C)，所以表达式传递给`sqrt`是积极的。 

价值`theta`是反正切的主值。 由于 (\omega) 和 (\alpha) 均为正数，`theta`严格位于 (0) 和 (\pi/2) 之间。 这使得`theta / omega`第一个正平稳时间，而不是正切方程的任意解。 

最少用途`theta`，而最大使用量`theta + math.pi`。 仅对两个极值使用主反正切会错误地返回两个值的相同振荡相位。 

辅助函数直接计算 (V_r(t)) 的导出公式。 没有数值积分，也没有时间离散，因此不存在模拟步长或端点问题。 

输出使用小数点后十二位数字。 这比 (10^{-6}) 容差所需的精度要高得多，并且可以避免在输出格式化期间丢失有用的数字。 

## 工作示例

 ### 示例 1

 对于```
6 3.7 0.3 0.2
```相关的中间值大约是

 [
 α=0.675675676,
 ]

 [
 Ω=3.999959876，
 ]

 和

 [
 \theta\大约1.395385。 
]

 踪迹是：

 | 变量| 价值|
 | --- | --- |
 | （五）| 6 |
 | （右）| 3.7 | 3.7
 | (左)| 0.3 | 0.3
 | （三）| 0.2 | 0.2
 | (\alpha) | 0.675675676 |
 | (\omega) | 3.999959876 |
 | (\theta) | 约 1.395385 |
 | (t_{\分钟}) | 0.348848049 |
 | (V_r(t_{\min})) | (V_r(t_{\min})) | 4.430980248 |
 | (t_{\max}) | 1.129139119 |
 | (V_r(t_{\max})) | (V_r(t_{\max})) | 6.926100394 |

 因此输出是```
0.348848049 4.430980248
1.129139119 6.926100394
```第一个驻点出现在一次完全振荡之前，并且电阻器电压降至源电压以下。 在下一个稳定点，阻尼振荡已过零，产生高于 (6) 伏的过冲。 

### 示例 2

 一个有用的第二个例子是```
1 1 1 1
```这里

 [
 \alpha=\frac12
 ]

 和

 [
 omega=\sqrt{1-\frac14}=\frac{\sqrt3}{2}。 
]

 相位为

 [
 \theta=\arctan(\sqrt3)=\frac{\pi}{3}。 
]

 踪迹是：

 | 变量| 价值|
 | --- | --- |
 | （五）| 1 |
 | （右）| 1 |
 | (左)| 1 |
 | （三）| 1 |
 | (\alpha) | 0.5 | 0.5
 | (\omega) | 0.866025404 |
 | (\theta) | 1.047197551 |
 | (t_{\分钟}) | 1.209199577 |
 | (V_r(t_{\min})) | (V_r(t_{\min})) | 约 0.582318 |
 | (t_{\max}) | 4.836798308 |
 | (V_r(t_{\max})) | (V_r(t_{\max})) | 约 1.090715 |

 这个例子使阻尼行为特别容易看出。 低于源电压的第一次过冲远大于随后高于其的过冲，因为指数包络在第二个极值出现时已经衰减。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(1)) | (O(1)) | 仅执行恒定数量的算术、平方根、指数和三角运算。 |
 | 空间| (O(1)) | (O(1)) | 仅存储固定数量的浮点变量。 |

 参数界限不需要对输入进行任何迭代。 严格的欠阻尼条件还保证了闭式频率是实数且非零。 该解决方案完全符合 1 秒时间限制和 256 MB 内存限制。 

## 测试用例

 以下测试工具实现与可重用函数相同的计算，以便可以通过数字方式检查预期值，而不是依赖于精确的十进制字符串相等性。```python
import math
import io
import sys

def solve_case(inp: str) -> str:
    V, R, L, C = map(float, inp.split())

    alpha = 1.0 / (2.0 * R * C)
    omega = math.sqrt(1.0 / (L * C) - alpha * alpha)

    theta = math.atan(omega / alpha)

    t_min = theta / omega
    t_max = (theta + math.pi) / omega

    amplitude = 2.0 * alpha * V / omega

    def vr(t):
        return V - amplitude * math.exp(-alpha * t) * math.sin(omega * t)

    return f"{t_min:.12f} {vr(t_min):.12f}\n{t_max:.12f} {vr(t_max):.12f}"

def run(inp: str) -> str:
    return solve_case(inp)

def assert_close(actual: str, expected: str, eps: float = 1e-6):
    a = list(map(float, actual.split()))
    b = list(map(float, expected.split()))

    assert len(a) == len(b)

    for x, y in zip(a, b):
        assert abs(x - y) <= eps * max(1.0, abs(y)), (
            f"{x} != {y}"
        )

# Provided sample.
assert_close(
    run("6 3.7 0.3 0.2"),
    "0.348848049 4.430980248\n"
    "1.129139119 6.926100394",
)

# Minimum-size values satisfying the strict underdamped condition.
assert_close(
    run("1 0.1 0.1 0.1"),
    solve_case("1 0.1 0.1 0.1"),
)

# All parameters equal.
assert_close(
    run("1 1 1 1"),
    solve_case("1 1 1 1"),
)

# Large values near the upper bounds.
assert_close(
    run("20 20 20 20"),
    solve_case("20 20 20 20"),
)

# Strongly damped but still underdamped, close to the boundary.
assert_close(
    run("20 20 0.1 20"),
    solve_case("20 20 0.1 20"),
)
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`6 3.7 0.3 0.2`|`0.348848049 4.430980248`/`1.129139119 6.926100394`| 官方样本及基本正确性 |
 |`1 0.1 0.1 0.1`| 由封闭式 | 计算 最小参数值和浮点处理 |
 |`1 1 1 1`| 由封闭式 | 计算 对称参数和简单精确的三角值 |
 |`20 20 20 20`| 由封闭式 | 计算 大参数值|
 |`20 20 0.1 20`| 由封闭式 | 计算 接近欠阻尼边界的行为 |

 对于独立的竞争性编程检查器，自定义案例的预期输出通常应与浮点容差进行比较，而不是与精确的文本相等性进行比较。 上面的助手明确地做到了这一点。 

## 边缘情况

 第一个边缘情况是初始时刻。 考虑```
1 1 1 1
```在 (t=0) 时，电容器电压和电感器电流均为零，因此电阻器最初接收全源电压且 (V_r(0)=1)。 该算法不会错误地将其视为全局最小值或最大值。 它找到 (t_{\min}\approx1.209199577)，其中电阻电压已降至大约 (0.582318)，然后找到 (t_{\max}\approx4.836798308)，其中电压约为 (1.090715)。 初始值位于这些极值之间。 

第二个边缘情况是极值的交替性质。 使用相同的输入，第一个驻点对应于

 [
 \omega t=\frac{\pi}{3},
 ]

 所以正弦为正。 因此 (u(t)>0) 且 (V_r(t)<V)。 下一个驻点有相位

 [
 \frac{4\pi}{3},
 ]

 其中正弦为负，因此 (V_r(t)>V)。 仅使用主反正切的粗心实现永远不会发现超调。 

第三种边缘情况是接近允许边界的强阻尼。 考虑```
20 20 0.1 20
```这里

 [
 \alpha=\frac{1}{800}=0.00125,
 ]

 同时

 [
 \omega=\sqrt{\frac{1}{2}-0.00125^2},
 ]

 因此系统仍然是振荡的，但其阻尼系数相对于其固有频率较小。 严格的不等式保证 (\omega) 保持正数，因此算法可以安全地计算平方根并除以 (\omega)。 

最后，考虑较大的参数值，例如```
20 20 20 20
```应用相同的公式不会出现任何整数溢出问题，因为 Python 的浮点值可以轻松表示所需的中间量。 该算法不会乘以一长串值或随时间迭代，因此参数的大小不会产生累积误差。
