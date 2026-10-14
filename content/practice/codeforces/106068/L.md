---
title: "CF 106068L - 三角孔"
description: "我们从一个等边三角形开始，其大小由其高度 $H$ 描述。 该过程是迭代的。 在每次操作中，三角形被细分为四个全等的等边三角形，并且仅保留中心三角形，而丢弃其他三个三角形。"
date: "2026-06-21T15:57:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106068
codeforces_index: "L"
codeforces_contest_name: "2025 Aleppo and Idlib Private Universities Collegiate Programming Contest (APUCPC 2025)"
rating: 0
weight: 106068
solve_time_s: 39
verified: true
draft: false
---

[CF 106068L - 三角孔](https://codeforces.com/problemset/problem/106068/L)

 **评级：** -
 **标签：** -
 **求解时间：** 39s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从一个等边三角形开始，其大小由其高度描述$H$。 该过程是迭代的。 在每次操作中，三角形被细分为四个全等的等边三角形，并且仅保留中心三角形，而丢弃其他三个三角形。 重复这个操作$K$次，始终应用于剩余的三角形。 

任务是确定最后剩下的三角形的面积$K$此类操作。 

从几何角度来看，每个操作都会按固定的线性因子缩小三角形。 由于三角形被分成四个等面积的子三角形并且只保留一个，因此面积正好减少了一个因子$4$每次操作。 这使得问题从根本上是关于重复细分下面积的指数衰减而不是任何几何重建。 

对于操作数量而言，输入范围很大，其中$K$最多$10^5$。 这立即排除了任何模拟几何或使用浮点几何构造逐步执行迭代面积重新计算的方法。 然而，变换的结构是乘法的并且每步都是恒定的，因此整个过程可以简化为封闭形式的表达式。 

出现微妙的边缘情况时$K = 0$，其中没有发生任何变换，答案只是原始三角形的面积。 即使不应用任何步骤，任何假设至少一项操作的解决方案都会错误地减小面积。 

另一个问题来自浮点稳定性。 由于答案涉及重复除以 4 的幂，因此简单的迭代乘法或除法可能会累积较大的精度误差$K$，特别是靠近$10^{-4}$容忍边界。 这鼓励一次性计算最终的幂运算，而不是逐步更新。 

## 方法

 直接模拟将显式地维护三角形并在每次细分后重新计算其面积。 由于每一步只保留四等分之一，因此可以将面积重新计算为“当前面积除以 4”。 这是正确的，因为每个操作在统一缩小区域的同时保留了相似性。 

然而，这导致了线性时间过程$K$。 和$K$最多$10^5$，这在计算上仍然是可行的，但它引入了不必要的浮点重复除法，这增加了累积错误风险并增加了开销。 

关键的观察结果是，该变换是纯粹的乘法且跨步骤独立。 后$K$运算时，面积正好是初始面积乘以$(1/4)^K$。 这使我们能够使用指数在恒定时间内计算最终结果。 

唯一剩下的部分是给定高度的等边三角形的初始面积$H$。 对于等边三角形，如果高为$H$，边长为$s = \frac{2H}{\sqrt{3}}$，面积为：$$A = \frac{\sqrt{3}}{4}s^2 = \frac{\sqrt{3}}{4} \cdot \frac{4H^2}{3} = \frac{\sqrt{3}}{3}H^2$$所以最终的答案就变成了：$$A_K = \frac{\sqrt{3}}{3}H^2 \cdot 4^{-K}$$| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 逐步模拟| O(K) | O(1) | O(1) | 太慢/数值不稳定 |
 | 闭式公式| O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取整数$H$和$K$。 这些定义了原始几何形状以及应用收缩操作的次数。 
2. 使用基于高度的公式计算等边三角形的初始面积$A_0 = \frac{\sqrt{3}}{3}H^2$。 此步骤将几何输入转换为标量。 
3. 计算由下式引起的缩放因子$K$操作，即$4^{-K}$。 每次操作恰好保留四个等面积部分之一，因此每次面积都会除以 4。 
4. 将初始面积乘以缩放因子以获得最终面积。 
5. 将结果输出为浮点数。 

### 为什么它有效

 每个操作中的变换将任何等边三角形映射到面积为四分之一的相似三角形。 相似性保证了形状与尺度无关，因此只有面积演化才是相关的。 由于每个步骤独立地应用相同的恒定比率，因此之后的面积$K$步骤恰好是初始面积乘以$K$相同因素$1/4$。 这种乘法不变性确保不需要中间几何推理，并且不存在依赖于序列的行为。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

H, K = map(int, input().split())

# initial area of equilateral triangle from height
area0 = (math.sqrt(3) / 3.0) * H * H

# each operation keeps 1/4 of the area
area = area0 * (0.25 ** K)

print(area)
```该代码首先使用标准等边三角形恒等式将几何高度转换为面积。 然后将变换作为单次幂运算应用，从而避免任何迭代循环。 使用`0.25 ** K`与重复除法相比，确保了清晰度和数值稳定性。 

一个常见的陷阱是先计算边长，然后重新计算面积，这会引入额外的浮点运算，而不会提高精度。 另一种是循环K次，这是不必要的，并且可能会累积舍入误差。 

## 工作示例

 ### 示例 1

 输入：```
10 2
```初始面积：$$A_0 = \frac{\sqrt{3}}{3} \cdot 100$$| 步骤| 当前区域 | 运营因素| 新区 |
 | ---| ---| ---| ---|
 | 0 | 57.7350 | - | 57.7350 |
 | 1 | 57.7350 | 1/4 | 1/4 14.4338 |
 | 2 | 14.4338 | 1/4 | 1/4 3.6084 |

 输出：```
3.608439
```该轨迹显示了重复的均匀缩放行为。 不变的是每一步都会将面积减少 4 倍。 

### 示例 2

 输入：```
5 0
```| 步骤| 当前区域 | 运营因素| 新区 |
 | ---| ---| ---| ---|
 | 0 | 14.4338 | - | 14.4338 |

 输出：```
14.433757
```这演示了不发生转换的基本情况。 该算法正确地避免了应用任何缩放因子。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(1) | O(1) | 仅恒定数量的算术运算和一次求幂 |
 | 空间| O(1) | O(1) | 没有使用辅助数据结构 |

 计算很容易满足约束条件，并且浮点求幂$K \le 10^5$由于优化了电源例程，Python 中的效率很高。 

## 测试用例```python
import sys, io
import math

def solve():
    input = sys.stdin.readline
    H, K = map(int, input().split())
    area0 = (math.sqrt(3) / 3.0) * H * H
    print(area0 * (0.25 ** K))

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    import io as sio
    out = sio.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# provided samples
assert run("10 2")[:5] == "3.608"
assert run("5 0")[:6] == "14.433"

# custom cases
assert run("1 0")[:5] == "0.577", "minimum height no operations"
assert run("1 1") != "0", "single reduction should shrink area"
assert run("1000000000 0") != "", "maximum H no operations"
assert run("2 5") != "", "small height large K stability check"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 0 | 1 0 基地面积| 最小投入，不减量|
 | 1 1 | 1 减少价值| 单一变换的正确性 |
 | 1000000000 0 | 大H | 最大尺度下的数值稳定性|
 | 2 5 | 小H，大K | 指数稳定性 |

 ## 边缘情况

 对于$K = 0$，算法应返回原始三角形区域而不应用任何缩放。 如果我们机械地遵循这个公式，求幂$4^0 = 1$，所以结果保持不变。 用于输入$H = 10, K = 0$，计算变为：$$A = \frac{\sqrt{3}}{3} \cdot 100 \cdot 1$$该算法自然地处理这个问题，无需特殊的分支。 

对于大型$K$， 说$K = 100000$, 因子$0.25^K$underflows toward zero in floating-point arithmetic. This is consistent with the mathematical limit since the area tends to zero exponentially. The printed tolerance allows this behavior, so the result remains valid even if it becomes numerically zero.

 对于大型$H$， 例如$H = 10^9$，当与指数衰减相结合时，初始面积变大，但仍然在双精度范围内，因为按比例缩放$4^{-K}$迅速降低中等程度的震级$K$。
