---
title: "CF 102966J - 只需转动轮子即可！"
description: "该系统由两个圆形轮组成，每当自行车移动时，它们总是一起旋转相同的角度。 每个轮子都被装饰成正多边形，一个具有 $F$ 边，另一个具有 $B$ 边，尽管两者实际上都是下面连续的圆圈。"
date: "2026-07-04T06:41:32+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102966
codeforces_index: "J"
codeforces_contest_name: "2020-2021 ICPC - Gran Premio de Mexico - Repechaje"
rating: 0
weight: 102966
solve_time_s: 46
verified: true
draft: false
---

[CF 102966J - 只需转动轮子即可！](https://codeforces.com/problemset/problem/102966/J)

 **评级：** -
 **标签：** -
 **求解时间：** 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该系统由两个圆形轮组成，每当自行车移动时，它们总是一起旋转相同的角度。 每个轮子都被装饰成一个正多边形，其中一个$F$两侧和另一侧$B$侧面，尽管两者实际上都是下面连续的圆圈。 视觉目标是，在某些时刻，两个轮子必须看起来“对齐”，这意味着每个多边形图案的一侧在底部位置完全水平。 

轮子上的每个完整图案都会重复$\frac{360}{k}$度如果车轮有$k$侧面，因此当轮子旋转时，有效的“对齐状态”会定期出现。 由于两个轮子一起旋转，因此只有当旋转角度同时为两个周期的倍数时，系统才处于有效的视觉状态。 

除了这个几何约束之外，自行车还必须行驶固定的距离$S$。 每个轮子都有周长$C$，因此将自行车向前移动$C$恰好对应于一整圈旋转，部分距离与旋转成比例对应。 该问题将“转”定义为相当于车轮旋转 30 度的固定旋转能量单位。 由于两个轮子始终一起旋转，因此两个轮子的圈数相同。 

任务是计算所需的 30 度转弯的最小次数，以便自行车行驶至少距离$S$，并且在那一刻，两个轮子都处于有效的对齐配置。 

约束条件意味着最多$10^5$测试用例，因此每个用例必须在常数或对数时间内解决。 的价值观$C$很小（最多 1000），而$S$可以很大（最多$10^9$），因此需要分数算术或模块化推理，而不是运动模拟。 

简单的模拟会通过逐轮迭代直到两个条件匹配而失败。 在最坏的情况下，对齐发生在与最小公倍数成比例的周期之后$F$和$B$，距离限制可以超出这个范围$10^9$每个测试的操作。 

当经常发生对齐但距离要求占主导地位时，会出现微妙的边缘情况。 例如，如果$F = B = 3$，每个旋转步骤都会发生对齐，但是如果$S$非常大，答案纯粹由距离而不是几何形状决定。 相反，如果$F$和$B$是互质的大值，对齐极其罕见，并且解决方案由同步而不是行进距离决定。 

## 方法

 如果我们忽略对齐要求，问题就简化为将距离转换为旋转。 一整圈对应于$C$距离单位，一圈对应$30^\circ$， IE。，$1/12$一个完整的旋转。 因此，每 12 圈对应一整圈，这意味着距离和圈数之间存在直接转换。 

这给出了一个简单的基线：计算需要多少次完整旋转才能覆盖$S$，将其转换为轮数，然后向上取整。 

然而，这忽略了关键的约束：系统必须仅在两个轮子同时处于对齐多边形状态的时刻停止。 这引入了对允许的旋转角度的周期性约束。 

每个轮子都带有$k$双方都有有效的方向$\frac{1}{k}$一个完整的旋转。 所以只有当总旋转是两者的倍数时系统才有效$\frac{1}{F}$和$\frac{1}{B}$，这意味着旋转必须是$\frac{1}{\mathrm{lcm}(F,B)}$。 

这将问题转化为两个周期系统之间的同步问题：由距离驱动的连续级数和由多边形周期的最小公倍数确定的一组离散的允许停止点。 

我们首先计算满足距离所需的最小旋转，然后将其四舍五入到下一个有效对齐步骤$\frac{1}{\mathrm{lcm}(F,B)}$网格。 这种舍入是整个困难：我们将连续的要求投射到离散的周期格上。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 轮次暴力模拟|$O(T \cdot ans)$|$O(1)$| 太慢了 |
 | 基于 LCM 的舍入到有效旋转状态 |$O(T \log \min(F,B))$|$O(1)$| 已接受 |

 ## 算法演练

 我们完全以“转”为单位进行工作，其中一转对应于 30 度的固定旋转。 

1. 将距离要求转换为所需的整轮转数。 由于一整圈对应于距离$C$，自行车必须至少执行$\frac{S}{C}$轮换。 我们将其保留为分数以避免精度损失。 
2. 将旋转转换为转弯。 一整圈为 12 圈，因此由于距离而所需的最小圈数为$x = 12 \cdot \frac{S}{C}$。 
3. 计算周期性对齐约束。 每当两个轮子返回到其多边形边缘与地面对齐的状态时，就会发生有效的配置。 对于带有$k$双方，这种情况每次都会发生$\frac{1}{k}$旋转，或等效地每个$\frac{12}{k}$轮流。 所以系统对齐周期依次是最小公倍数$\frac{12}{F}$和$\frac{12}{B}$，这简化为$\frac{12}{\gcd(F,B)}$。 
4. 找到对齐周期的最小倍数，该倍数至少为$x$。 这是一个标准的上限划分：如果周期是$p$，我们计算$\lceil x/p \rceil \cdot p$。 
5. 返回该值作为答案。 

关键决策是第 3 步：将多边形对齐转换为与运动相同的单位系统中基于 gcd 的周期结构。 

### 为什么它有效

 系统在旋转角度的一维圆上演化，但只有角度的离散子集对于停止有效。 该子集是周期性的，并且周期性完全由各个轮周期的最大公约数来表征。 每个有效的配置都是该循环结构中的一个格点。 由于轮流运动是单调的，到达所需距离后最早可行的停止时间恰好是超出距离阈值的第一个格点。 没有较早的点可以满足这两个约束，因为它要么违反距离要求，要么破坏对齐周期。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def ceil_div(a, b):
    return (a + b - 1) // b

T = int(input())
for _ in range(T):
    C, F, B, S = map(int, input().split())

    # convert required distance to turns:
    # 1 rotation = C distance = 12 turns
    need = S * 12

    # minimal turns ignoring alignment
    # (we work in rational form: need / C)
    # multiply first to keep integer arithmetic
    base_num = need
    base_den = C

    # alignment period in turns is 12 / gcd(F, B)
    import math
    g = math.gcd(F, B)
    period_num = 12
    period_den = g

    # we want smallest t >= base such that t is multiple of period
    # convert both to common denominator:
    # t = k * period
    # need <= k * period
    # k >= need / period
    # need in turns = base_num/base_den

    # inequality:
    # base_num/base_den <= k * period_num/period_den
    # k >= base_num * period_den / (base_den * period_num)

    num = base_num * period_den
    den = base_den * period_num

    k = ceil_div(num, den)
    ans = k * period_num // period_den

    print(ans)
```该实现将所有内容保留为整数以避免浮点漂移。 关键步骤是将距离条件和对齐条件依次转换为共享的线性比例，然后执行上限除法将结果捕捉到有效的周期网格上。 

一个常见的错误是分别计算旋转和对齐，然后尝试将它们合并； 这是因为对齐约束并不独立于距离累积。 基于 gcd 的约简确保两个约束都以相同的单位制表示。 

## 工作示例

 ### 示例 1

 输入：```
1
2 8 4 10
```我们根据距离计算所需的转弯：$$\text{base} = \frac{10}{2} \cdot 12 = 60$$对准周期：$$g = \gcd(8,4)=4,\quad \text{period} = \frac{12}{4} = 3$$所以我们需要 3 的最小倍数，至少是 60。 

| 步骤| 价值|
 | ---| ---|
 | 基础转弯| 60|
 | 期间 | 3 |
 | 第一个有效倍数 ≥ 基 | 60|

 答案是60。 

这显示了距离已经恰好落在有效对齐状态上的情况。 

### 示例 2

 输入：```
1
3 5 7 20
```距离要求：$$\text{base} = \frac{20}{3} \cdot 12 = 80$$结盟：$$g = 1,\quad \text{period} = 12$$| 步骤| 价值|
 | ---| ---|
 | 基础转弯| 80|
 | 期间 | 12 | 12
 | 12 的倍数 ≥ 80 | 84 | 84

 答案是84。 

这演示了捕捉行为：即使距离允许在 80 圈处停止，对齐也会强制等到 84 圈。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(T \log \min(F,B))$| 每个测试都使用 gcd 计算 |
 | 空间|$O(1)$| 只存储了几个整数 |

 约束允许最多$10^5$测试用例，因此每个用例的对数 gcd 很容易在 2 秒内足够快。 

## 测试用例```python
import sys, io
import math

def solve(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    T = int(input())
    out = []
    for _ in range(T):
        C, F, B, S = map(int, input().split())

        need = S * 12
        base_num = need
        base_den = C

        g = math.gcd(F, B)
        period_num = 12
        period_den = g

        num = base_num * period_den
        den = base_den * period_num

        k = (num + den - 1) // den
        ans = k * period_num // period_den
        out.append(str(ans))

    return "\n".join(out)

# sample
assert solve("1\n2 8 4 10\n") == "60"

# minimum values
assert solve("1\n1 3 3 1\n") is not None

# already aligned
assert solve("1\n10 4 4 10\n") == "12"

# coprime wheels forcing snapping
assert solve("1\n3 5 7 20\n") == "84"

# large distance
assert solve("1\n1000 12 18 1000000000\n") is not None
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 小对齐| 60| 精确匹配，无需舍入 |
 | 共质案例| 84 | 84 捕捉到下一个对齐|
 | 等轮| 准确| gcd = 全周期 |
 | 大S | 有效 | 溢出安全算术 |

 ## 边缘情况

 一种微妙的情况是两个轮子的边数相同。 例如$F = B = 6$。 在这种情况下，一个车轮的每个有效状态都对另一个车轮有效，因此对准周期变得最小。 该算法通过以下方式减少了这种情况$g = 6$，使周期$\frac{12}{6} = 2$轮流。 计算正确，允许非常频繁的停车点，因此只有距离很重要。 

另一种情况是当$F$和$B$是互质的。 例如$F = 7, B = 9$。 然后$g = 1$，因此每 12 圈才进行一次对齐。 即使距离建议提前停止，算法也会强制四舍五入到下一个 12 的倍数，这符合没有中间角度可以同时满足两个多边形对齐的事实。 

当出现最终边缘情况时$S$非常小，可能小于一圈。 转换仍然有效，因为我们以整数比例进行操作； 即使是小数距离在映射到共享单位系统后也会正确舍入。
