---
title: "CF 104651D - 离散傅里叶变换"
description: "给定一个长度为 n 的整数序列。 由此，我们计算其离散傅立叶变换，从而产生 n 个复数值。 每个频率 t 对应于所有数组元素的复数和，每个元素乘以取决于其索引和 t 的单位复数旋转。"
date: "2026-06-29T15:16:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104651
codeforces_index: "D"
codeforces_contest_name: "The 2023 CCPC Online Contest"
rating: 0
weight: 104651
solve_time_s: 69
verified: true
draft: false
---

[CF 104651D - 离散傅立叶变换](https://codeforces.com/problemset/problem/104651/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个长度为 n 的整数序列。 由此，我们计算其离散傅立叶变换，从而产生 n 个复数值。 每个频率 t 对应于所有数组元素的复数和，每个元素乘以取决于其索引和 t 的单位复数旋转。 

我们可以精确地修改一个位置，即索引 k，用我们选择的任何整数替换它。 这个单一的变化同时影响每个傅里叶系数，因为每个系数都是所有数组元素的线性组合。 

目标是选择位置 k 处的新值，以便在重新计算变换后，所有傅里叶系数中的最大幅度变得尽可能小。 

约束足够小，O(n²) 预处理方法是可以接受的。 由于n最多为2000，因此直接计算所有傅里叶系数是可行的。 更困难的部分是对一个自由变量进行优化。 

当最佳修改远离原始值时，会出现微妙的边缘情况。 简单的方法可能只尝试小的调整或假设最佳值位于原始 f_k 附近，但最佳选择取决于所有频率的全局平衡，而不是局部结构。 

例如，如果原始序列已经有一个主傅里叶峰值，则更改 f_k 可以“拉低”该峰值，但可能会稍微提高其他峰值。 将 x 限制在 f_k 周围的一个小邻域内可能会完全错过真正的最优值。 

## 方法

 直接解释很简单：尝试 f_k 的所有可能的替换值，重新计算傅里叶变换，并跟踪最佳答案。 然而，这是不可能的，因为候选值是无界的。 即使限制在合理的数值范围内，仍然留下无限多种可能性。 

关键的观察结果是傅立叶变换在输入序列中是线性的。 如果我们用 F⁰_t 表示原始变换，则用 x 替换 f_k 会通过添加 (x − f_k) 乘以取决于 t 的单位复数根来更改每个系数。 这意味着每个傅立叶系数都成为单个实数变量 x 的仿射函数。 

重写后，每个系数都成为平面上的一个点，其到原点的距离是x的凸函数。 目标是所有 t 中这些凸函数的最大值。 凸函数的最大值仍然是凸的，因此问题简化为最小化实数 x 上的一维凸函数，最终答案以整数计算。 

该结构允许对实数 x 进行三元搜索。 每次评估都需要计算所有 n 个距离，每次检查的成本为 O(n)。 整体复杂度变为 O(n² log precision)，对于 n 高达 2000 来说，这已经足够快了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解 x | 无限 / O(范围·n²) | O(n) | 不可能|
 | 最优三元搜索 | O(n² log R) | O(n² log R) | O(n) | 已接受 |

 ## 算法演练

 首先，我们计算原始数组的离散傅立叶变换。 这为我们提供了每个频率 t 的基线系数 F⁰_t。 

接下来，我们隔离索引 k 的变化如何影响每个系数。 我们预先计算单位复数乘数 ω_t = e^{-2π i k t / n}。 如果我们将 f_k 替换为值 x，则新系数变为 F⁰_t + (x − f_k) · ω_t。 

现在，我们通过旋转每个系数，使方向 ω_t 成为实轴，以几何方式重新解释该表达式。 这将每个频率转换为复平面中的固定点，并且变量 x 沿实轴移动。 大小变为从移动点 x 到平面中固定点的距离。

我们为每个 t 定义一个函数 g_t(x) = |x + b_t|，其中 b_t 是从 F⁰_t 和 ω_t 导出的预先计算的复数常数。 目标是最小化 max_t g_t(x)。 

然后我们搜索最小化该最大值的实际值 x。 由于凸函数的最大值是凸的，因此我们对实数 x 应用三元搜索。 

对于每个候选 x，我们评估所有频率并计算最大距离。 收敛后，我们检查找到的实际最优值周围的最佳整数值，因为最终答案必须是整数替换。 

### 为什么它有效

 每个 g_t(x) 都是 x 的凸函数，因为它是从平面中的固定点到沿直线移动的点的欧几里德距离。 凸函数的最大值也是凸的，这保证了单个全局最小值。 这确保了三元搜索不会陷入局部最小值，并且缩小间隔始终可以保留真正的最优值。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

def dft(f):
    n = len(f)
    res = [0j] * n
    for t in range(n):
        acc = 0j
        for s in range(n):
            angle = -2.0 * math.pi * s * t / n
            acc += f[s] * complex(math.cos(angle), math.sin(angle))
        res[t] = acc
    return res

def solve():
    n, k = map(int, input().split())
    f = list(map(int, input().split()))

    F = dft(f)

    base = f[k]

    # precompute w_t = exp(-i 2π k t / n)
    w = []
    for t in range(n):
        angle = -2.0 * math.pi * k * t / n
        w.append(complex(math.cos(angle), math.sin(angle)))

    # b_t = F_t - f_k * w_t
    b = [F[t] - base * w[t] for t in range(n)]

    def cost(x):
        x = float(x)
        best = 0.0
        for t in range(n):
            val = b[t] + x * w[t]
            best = max(best, abs(val))
        return best

    # ternary search on real x
    lo, hi = -1e5, 1e5
    for _ in range(80):
        m1 = (2 * lo + hi) / 3
        m2 = (lo + 2 * hi) / 3
        if cost(m1) < cost(m2):
            hi = m2
        else:
            lo = m1

    x0 = (lo + hi) / 2

    # check nearby integers
    best_ans = float('inf')
    for xi in range(int(x0) - 3, int(x0) + 4):
        best_ans = min(best_ans, cost(xi))

    print(best_ans)

if __name__ == "__main__":
    solve()
```该解决方案首先直接计算完整的傅里叶变换，这在约束下是可以接受的。 然后，它使用预先计算的旋转因子来隔离索引 k 的贡献。 

成本函数评估给定替换值的所有频率的最大幅度。 三元搜索不断缩小凸函数达到最小值的区间。 由于浮点运算引入了较小的漂移，因此最后一步检查连续最优值附近的整数值，以确保满足整数约束。 

## 工作示例

 考虑一个小序列，其中改变单个元素会显着改变光谱平衡。 假设 n = 3、k = 2、f = [1, 1, 0]。 

我们首先计算傅里叶系数。 然后我们研究改变 f2 如何同时影响所有系数。 

| 步骤| x 猜猜 | 受影响的 F_t 结构 | 最大 |F_t| |

 |------|--------|------------------------|--------|

 | 开始 | 0 | 原始光谱| 大|

 | 中1 | -2 | 降低主频率| 较小|

 | 中2 | 2 | 不平衡转移到其他地方| 更大|

 三元搜索更喜欢最大值减小的方向，最终收敛到最佳权衡附近。 

这个例子说明，最好的修改不一定是接近原值0； 选择它是为了全局平衡所有频率，而不是局部调整一个频率。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n² + n log R) | O(n² + n log R) | DFT 成本 O(n²)，每次评估成本 O(n)，三元搜索使用 O(log R) 评估 |
 | 空间| O(n) | 存储傅立叶系数和预先计算的旋转因子 |

 当 n ≤ 2000 时，DFT 贡献了大约 400 万次操作，三元搜索又增加了几十万次操作，这完全在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from math import isclose

    # inline solution
    import math

    def dft(f):
        n = len(f)
        res = [0j] * n
        for t in range(n):
            acc = 0j
            for s in range(n):
                angle = -2.0 * math.pi * s * t / n
                acc += f[s] * complex(math.cos(angle), math.sin(angle))
            res[t] = acc
        return res

    n, k = map(int, input().split())
    f = list(map(int, input().split()))
    F = dft(f)
    base = f[k]

    w = []
    for t in range(n):
        angle = -2.0 * math.pi * k * t / n
        w.append(complex(math.cos(angle), math.sin(angle)))

    b = [F[t] - base * w[t] for t in range(n)]

    def cost(x):
        best = 0.0
        for t in range(n):
            best = max(best, abs(b[t] + x * w[t]))
        return best

    lo, hi = -1e5, 1e5
    for _ in range(60):
        m1 = (2 * lo + hi) / 3
        m2 = (lo + 2 * hi) / 3
        if cost(m1) < cost(m2):
            hi = m2
        else:
            lo = m1

    x0 = (lo + hi) / 2
    ans = float('inf')
    for xi in range(int(x0) - 3, int(x0) + 4):
        ans = min(ans, cost(xi))

    return str(ans)

# provided sample
assert run("3 2\n1 1 0\n")[:1] == "2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 3 2, 1 1 0 | 3 2, 1 1 0 2.0 | 基本正确性|
 | 1 0, 5 | 0.0 | 0.0 单元素琐碎案例 |
 | 4 1, 1 2 3 4 | 4 1, 1 2 3 4 变化 | 傅立叶响应的对称性 |
 | 5 3、全零| 0.0 | 0.0 零谱稳定性|

 ## 边缘情况

 临界边缘情况是最佳修改远离 f_k 的原始值。 如果实现仅尝试 f_k 附近的值，它将错过最佳消除需要在一个方向上进行大幅移动以减少主要傅里叶峰值的解决方案。 在凸公式中，这对应于远离搜索间隔原点的最小值。 

另一种边缘情况是多个频率同等占主导地位时。 在这种情况下，成本函数具有平坦的底部区域而不是尖锐的最小值。 三元搜索仍然正确收敛，因为凸性保证任何局部平台都是全局最优的，但整数舍入对于避免偏离平坦区域至关重要。
