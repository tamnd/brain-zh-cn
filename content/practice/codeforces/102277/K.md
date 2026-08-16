---
title: "CF 102277K - 巧克力"
description: "蒂莫西有一个具有固定宽度和高度的矩形盒子。 每块巧克力棒都必须具有整数尺寸，必须能够装入盒子内而无需旋转，并且每对可能的尺寸最多只能使用一次。 尺寸为（a 乘以 b）的金条成本为（a b）。"
date: "2026-08-16T19:45:25+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102277
codeforces_index: "K"
codeforces_contest_name: "UCF Locals 2018"
rating: 0
weight: 102277
solve_time_s: 294
verified: true
draft: false
---

[CF 102277K - 巧克力](https://codeforces.com/problemset/problem/102277/K)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 54s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 蒂莫西有一个具有固定宽度和高度的矩形盒子。 每块巧克力棒都必须具有整数尺寸，必须能够装入盒子内而无需旋转，并且每对可能的尺寸最多只能使用一次。 尺寸为 (a \times b) 的条形成本为 (a b)。 

朝向是酒吧身份的一部分。 一根 (5\times3) 条和一根 (3\times5) 条是不同的礼物，而两根 (5\times5) 条是相同的，只能使用一根。 因此，如果盒子的尺寸为（W\times H），则可能的礼物正是（WH）订购的对

 [
 1\le a\le W,\qquad 1\le b\le H。 
]

 任务是选择尽可能多的不同对，同时将它们的面积总和（也是它们的总成本）保持在蒂莫西的储蓄余额 (B) 之内。 输出是可以制作的最大条数。 

官方竞赛页面给出了 3 秒的时间限制和 256 MB 的内存限制。 困难在于矩形可以表示大量可能的维度对，因此枚举所有（WH）条形不是可行的策略。 我们需要利用这样一个事实：金条的成本仅取决于产品 (ab)。 

第一个不明显的边缘情况是方形盒子。 对于 (2\times2) 盒子，四个可能的维度都有成本 (1,2,2,4)。 预算为(5)时，正确答案为(3)，因为我们可以选择(1\times1)、(1\times2)和(2\times1)，其总成本为(5)。 粗心的实现将 (1\times2) 和 (2\times1) 视为同一条柱将返回 (2)。 

当预算太小而无法购买任何东西时，就会出现第二种边缘情况。 对于 (3\times3) 盒子和预算 (0)，正确答案是 (0)。 每个合法的酒吧都有正面积，所以选择最便宜的酒吧就已经超出了预算。 假设始终可以选择至少一个柱的实现将错误地返回 (1)。 

第三种边缘情况是预算足够大，可以购买所有可能的金条。 对于 (2\times2) 盒子，所有四个条的总成本为 (1+2+2+4=9)。 根据预算 (9)，答案为 (4)。 在找到一些负担得起的前缀后没有理由停止，因为可以采用每个可能的维度对。 

## 方法

 直接的方法是生成每个可能的对 ((a,b))，计算其成本 (ab)，对所有 (WH) 成本进行排序，并采用总和符合预算的最便宜的前缀。 这是正确的，因为每个酒吧对我们来说都有相同的价值，即多一个学生收到礼物，因此在任何固定数量的酒吧中，我们应该始终选择最便宜的酒吧。 

问题是对的数量。 生成整个乘法表已经花费了 (O(WH)) 次运算，并且存储它需要 (O(WH)) 内存。 如果两个维度都很大，则远远超出 3 秒解决方案所能承受的范围。 即使是避免存储表但扫描每一对的版本仍然执行 (WH) 乘法。 

关键的观察结果是，我们实际上不需要按排序顺序了解各个条形。 对于值 (x)，请考虑面积至多为 (x) 的所有条形。 对于固定宽度 (a)，允许的高度满足

 [
 b\le\left\lfloor\frac{x}{a}\right\rfloor。 
]

 由于盒子将高度限制为 (H)，因此 (a) 行中此类条的数量为

 [
 t_a=\min\left(H,\left\lfloor\frac{x}{a}\right\rfloor\right)。 
]

 这让我们可以计算成本最多为 (x) 的柱的数量及其总成本，而无需枚举每一对。 

剩下的困难是对所有可能的（a）求和。 一旦 (a) 变大，值 (\lfloor x/a\rfloor) 在很长的时间间隔内保持恒定。 我们可以单独处理较小的 (a) 值，并在具有相同商的组中处理较大的值。 这是标准的楼层划分分组技术，可为一个查询提供 (O(\sqrt{x})) 工作量。

有一种更简洁的方法来使用此功能。 令 (F(x)) 为每个成本至多为 (x) 的合法金块的总成本。 我们可以找到满足 (F(x)>B) 的最小 (x)。 然后可以购买比 (x) 便宜的每根金条，而 (x) 是下一组不同金条的成本。 剩余的钱可以购买一定数量的 (x) 成本金条。 这避免了对柱的数量进行第二次二分搜索。 

暴力方法之所以有效，是因为排序给出了最便宜的可能前缀。 由于乘法表太大而失败。 观察到具有相同面积的所有条形形成一个阈值组，使我们能够一次对整个组进行计数和求和，从而将问题简化为楼层划分求和和一次二分搜索。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(WH\log(WH))) | (O(WH)) | 太慢了 |
 | 阈值分组 | (O(\sqrt B\log B)) | (O(1)) | (O(1)) | 已接受 |

 ## 算法演练

 1. 令 (W) 和 (H) 为盒子尺寸，(B) 为节省量。 每块合法的巧克力棒对应一对有序对 ((a,b))，其中 (1\le a\le W) 和 (1\le b\le H)，其成本为 (ab)。 
2. 计算每个可能的柱的总成本：

 [
 T=\frac{W(W+1)}2\cdot\frac{H(H+1)}2.
 ]

 如果 (B\ge T)，则可以购买所有可能的金条，因此答案很简单 (WH)。 

1. 定义`stats(x)`返回两个值。 第一个是面积最大 (x) 的合法条的数量。 第二个是它们的面积之和。 

对于固定宽度 (a)，可用高度的数量为

 [
 t=\min(H,\lfloor x/a\rfloor)。 
]

 该宽度贡献的数量为(t)，而其成本贡献为

 a\frac{t(t+1)}2.
 ]

 1. 将 (t=H) 的所有宽度放在一起处理。 发生这种情况时

 [
 a\le\left\lfloor\frac{x}{H}\right\rfloor。 
]

 如果此范围包含 (m) 宽度，则它贡献 (mH) 条，并且

 [
 \frac{m(m+1)}2\frac{H(H+1)}2
 ]

 总成本。 

对第一个范围进行分组很重要，因为它可能包含大量宽度，而每个宽度都具有完全相同数量的有效高度。 

1. 对于剩余的小宽度，直接迭代到 (\lfloor\sqrt{x}\rfloor)。 这样的值只有 (O(\sqrt{x})) 个。 
2. 一旦(a>\sqrt{x})，商(\lfloor x/a\rfloor)就很小。 对于当前 (a)，设 (q=\lfloor x/a\rfloor)。 相同的商仍然有效

 [
 r=\left\lfloor\frac{x}{q}\right\rfloor。 
]

 因此，从 (a) 到 (r) 的所有宽度都可以一起处理。 它们对计数的贡献是间隔长度乘以 (q)，它们的成本贡献是

 [
 \left(\sum_{i=a}^{r}i\right)\frac{q(q+1)}2.
 ]

 1. 我们现在知道如何计算 (F(x))，即面积最大为 (x) 的所有条形的总成本。 由于 (F(x)) 是非递减的，因此二分查找最小的 (x) 使得

 [
 F(x)>B。 
]

 搜索上限可以取为(\min(WH,B+1))。 如果不是所有的酒吧都能负担得起，那么第一个超出预算的面积就不需要大于（B+1）。 

1. 令第一个值为 (x)。 计算面积最大为 (x-1) 的所有条形的数量和总成本。 这些金条中的每一个都可以购买。 
2. 让`remaining = B - cost`。 下一个成本组中剩余的每个候选者的成本恰好为 (x)，因此我们可以购买

 [
 \left\lfloor\frac{\text{剩余}}x\right\rfloor
 ]

 更多酒吧。 

1. 将此数字添加到成本低于 (x) 的柱数中。 结果是礼物的最大可能数量。 

### 为什么它有效

 不变量是，对于任何阈值 (x)，`stats(x)`准确地描述了成本至多为 (x) 的完整合法金块集合。 由于每根金条都有相同的好处，因此最佳解决方案始终包括最便宜的可用金条。 令 (x) 为最小成本阈值，其完整组将使预算不足。 所有成本低于 (x) 的金条都必须采用最优解决方案，因为用更昂贵的金条替换其中任何一个都无法提高礼物的数量。 在选择它们之后，每个剩余的候选者的成本恰好是 (x)，因此在剩余预算允许的情况下选择尽可能多的候选者是最佳的。 阈值分组仅改变这些条的计数方式，而不改变表示哪些条。 

## Python 解决方案```python
import sys
from math import isqrt

input = sys.stdin.readline

def solve_case(W, H, B):
    total_bars = W * H
    total_cost = (W * (W + 1) // 2) * (H * (H + 1) // 2)

    if B >= total_cost:
        return total_bars

    if B <= 0:
        return 0

    def stats(x):
        if x <= 0:
            return 0, 0

        # For a <= m, every height 1..H is affordable.
        m = min(W, x // H)

        count = m * H
        cost = (
            m * (m + 1) // 2
            * (H * (H + 1) // 2)
        )

        left = m + 1
        if left > W or left > x:
            return count, cost

        root = isqrt(x)

        # Small widths are processed individually.
        right = min(W, root)

        for a in range(left, right + 1):
            t = min(H, x // a)
            if t <= 0:
                break

            count += t
            cost += a * t * (t + 1) // 2

        left = max(left, root + 1)

        # For a > sqrt(x), floor(x / a) is constant on intervals.
        while left <= W and left <= x:
            q = x // left
            if q <= 0:
                break

            right = min(W, x // q)
            t = min(H, q)

            length = right - left + 1
            count += length * t

            sum_a = (left + right) * length // 2
            cost += sum_a * t * (t + 1) // 2

            left = right + 1

        return count, cost

    # If not all bars fit, the first area whose complete group
    # makes the total exceed B is at most B + 1.
    lo = 1
    hi = min(total_bars if total_bars < B + 1 else B + 1,
             W * H)

    while lo < hi:
        mid = (lo + hi) // 2
        _, cost = stats(mid)

        if cost > B:
            hi = mid
        else:
            lo = mid + 1

    x = lo

    count_before, cost_before = stats(x - 1)
    remaining = B - cost_before

    return count_before + remaining // x

def solve(data):
    values = list(map(int, data.split()))
    if not values:
        return ""

    W, H, B = values[:3]
    return str(solve_case(W, H, B))

def main():
    data = sys.stdin.buffer.read()
    sys.stdout.write(solve(data) + "\n")

if __name__ == "__main__":
    main()
```第一部分`solve_case`处理整个乘法表都可以承受的情况。 三角和的乘积给出了所有可能的有序尺寸对的精确总面积。`stats(x)`是中心例程。 表达式`m = min(W, x // H)`识别宽度，每个高度可达`H`适合在阈值以下。 使用算术级数公式计算它们的贡献可以防止潜在的巨大循环。 

直接环路覆盖宽度可达`sqrt(x)`。 在那之后，`x // a`很小并且仅在相对稀疏的位置发生变化。 表达式`right = min(W, x // q)`找到商保持的最大间隔`q`。 该区间内所有宽度的总和是使用标准算术级数公式计算的。 

二分搜索使用总成本而不是柱的数量。 这是实现的微妙部分。 如果`x`是所有面积最大的条形成本的第一个值`x`超出预算，那么`x`必须与实际的酒吧成本相对应。 否则`F(x)`将等于`F(x-1)`，与极小性相矛盾。 因此，边界处每个未选择的柱的成本恰好是`x`，所以整数除以`x`准确给出了仍然可以负担的数量。 

Python 整数具有任意精度，因此诸如`W * (W + 1) * H * (H + 1)`不要溢出。 这些公式仅在乘法之后使用整数除法，避免浮点舍入。 搜索是双方包容的，并评估`stats(x - 1)`是将较便宜的金条与边界组区分开来的因素。 

## 工作示例

 由于提供的 Codeforces 页面公开了语句标题和竞赛元数据，但未公开其文本表示中的语句示例 I/O，因此以下跟踪使用同一问题的两个具体实例。 最初的UCF问题是公式的来源。 

### 示例 1

 考虑一个预算为 (5) 的 (2\times2) 盒子。 

四个可能的条形图的面积为 (1,2,2,4)。 最便宜的三个成本（1+2+2=5），所以答案是（3）。 

| 阈值 (x) | 成本条 (\le x) | 计数 | 总成本|
 | ---| ---| ---| ---|
 | 1 | (1\次1) | 1 | 1 |
 | 2 | (1\次1,1\次2,2\次1) | 3 | 5 |
 | 3 | 相同的三栏 | 3 | 5 |
 | 4 | 所有四个酒吧| 4 | 9 |

 二分查找找到(x=4)，因为通过(3)的成本是(5)，而通过(4)的成本是(9)。 该算法采用比 (4) 更便宜的所有三个柱形图，为最后一个柱形图留下零预算。 

### 示例 2

 考虑一个预算为 (10) 的 (3\times3) 盒子。 

这些区域是

 [
 1,2,3,2,4,6,3,6,9。 
]

 排序后，他们是

 [
 1,2,2,3,3,4,6,6,9。 
]

 | 阈值 (x) | 计数 | 总成本|
 | ---| ---| ---|
 | 1 | 1 | 1 |
 | 2 | 3 | 5 |
 | 3 | 5 | 11 | 11
 | 4 | 6 | 15 | 15

 整个组超出预算的第一个阈值是(x=3)。 所有五个面积最多为 (2) 的条形成本为 (5)，剩下 (5)。 接下来的每根金条都要花费 (3)，因此只能再购买一根。 答案是（4）。 

该跟踪说明了为什么我们搜索累积成本超过预算的第一个阈值，而不是简单地寻找累积成本适合的最大阈值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(\sqrt B\log B)) | 每个阈值查询都使用 (O(\sqrt B)) 中的楼层划分分组，并且二分搜索进行 (O(\log B)) 查询。 |
 | 空间| (O(1)) | (O(1)) | 仅维护标量变量。 |

 该算法从不构造 (W\times H) 乘法表。 阈值查询按算术间隔进行操作，因此即使可能的巧克力棒数量非常大，内存使用量也保持恒定。 原始竞赛的 3 秒和 256 MB 限制使得这种渐近缩减成为必要。 

## 测试用例

 原始声明可作为 UCF 本地竞赛 2018 问题集提供，其中问题出现在“巧克力礼品”名称下。 以下测试测试了最小尺寸、大尺寸范围、同等成本方向、完全的承受能力以及额外一根钢筋变得过于昂贵的边界。```
# helper: run solution on input string, return output string
import io

def run(inp: str) -> str:
    return solve(inp).strip()

# Minimum-size input
assert run("1 1 1\n") == "1", "minimum box and exact budget"

# Nothing is affordable
assert run("3 3 0\n") == "0", "zero budget"

# 2x2 costs are 1, 2, 2, 4
assert run("2 2 5\n") == "3", "equal-cost orientations"

# All bars are affordable
assert run("2 2 9\n") == "4", "entire multiplication table fits"

# Boundary case: 3x3 sorted costs are 1,2,2,3,3,4,6,6,9
assert run("3 3 10\n") == "4", "cannot afford the fifth cheapest bar"

# One-dimensional box, useful for checking arithmetic progression
assert run("1 5 15\n") == "5", "all bars in a 1x5 box"

# Large dimensions with tiny budget
assert run("1000000 1000000 1\n") == "1", "large dimensions, smallest possible budget"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 1`|`1`| 最小尺寸实例和精确的承受能力 |
 |`3 3 0`|`0`| 不适合正成本条的边界情况 |
 |`2 2 5`|`3`| 不同的方向，同等的成本|
 |`2 2 9`|`4`| 完全负担得起 |
 |`3 3 10`|`4`| 两个累积成本组之间的边界 |
 |`1 5 15`|`5`| 一维框的算术级数行为 |
 |`1000000 1000000 1`|`1`| 尺寸非常大，预算却很少|

 ## 边缘情况

 对于方形盒子来说，方向仍然很重要。 输入时`2 2 5`，算法计算成本 (1,2,2,4)。 在阈值 (2) 处，`stats(2)`返回计数 (3) 和成本 (5)。 下一个阈值是（4），其累积成本是（9），所以答案仍然是（3）。 (1\times2) 和 (2\times1) 都被计数，因为它们对应于外部总和中的不同宽度。 

对于空预算，输入`3 3 0`立即返回`0`。 实施检查`B <= 0`在开始阈值搜索之前，因此它永远不会尝试除以零边界成本或假设可以选择正成本条。 

当每个可能的条都适合时，输入`2 2 9`在二分查找之前处理。 总成本是

 [
 \frac{2\cdot3}{2}\frac{2\cdot3}{2}=9,
 ]

 这等于预算，因此所有 (2\cdot2=4) 条都是可以承受的。 当答案只是可能维度对的总数时，这种提前退出还可以防止不必要的阈值计算。 

对于一维情况`1 5 15`，可能的成本为 (1,2,3,4,5)，其总和为 (15)。 完整的负担能力检查返回 (5)。 这种情况很有用，因为当一维恰好是一并且没有二维结构可供利用时，商分组代码仍然必须工作。 

对于大案`1000000 1000000 1`，最便宜的可能柱是 (1\times1)，成本正好是 (1)。 因此答案是（1）。 搜索永远不需要枚举百万级网格。 阈值立即位于最小成本附近，并且分组公式隐式表示矩形的其余部分。
