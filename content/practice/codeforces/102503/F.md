---
title: "CF 102503F - 乌拉姆螺旋"
description: "网格包含围绕 1 以方形螺旋排列的正整数。坐标以 1 为中心，第一个坐标向上增加，第二个坐标向右增加。 因此，2 位于 (0,1)，3 位于 (1,1)，4 位于 (1,0)，依此类推。"
date: "2026-08-09T05:40:11+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102503
codeforces_index: "F"
codeforces_contest_name: "National Olympiad in Informatics - Philippines (NOI.PH) Online Eliminations 2020"
rating: 0
weight: 102503
solve_time_s: 515
verified: true
draft: false
---

[CF 102503F - 乌拉姆螺旋](https://codeforces.com/problemset/problem/102503/F)

 **评级：** -
 **标签：** -
 **求解时间：** 8m 35s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 网格包含以方形螺旋排列的正整数`1`。 坐标以`1`，第一个坐标向上增加，第二个坐标向右增加。 因此`2`位于`(0,1)`,`3`在`(1,1)`,`4`在`(1,0)`， 等等。 

对于每个测试用例，我们都会得到两个 ulam 编号`i`和`j`。 我们在无限螺旋中找到这两个数字，取包含它们两个单元格的最小轴对齐矩形，并将该矩形内每个 ulam 的值相加。 所需的答案是这个和模`10^9 + 7`。 官方声明确认最多可能有`20,000`测试用例并且每个数字可以大到`10^18`。 

的界限`10^18`立即排除构造螺旋直到任一输入值。 周围有一个数字`10^18`大致说谎`5 * 10^8`远离中心的单元格，因此即使是一个大矩形也可以包含大约`10^18`细胞。 单独访问单元的解决方案根本不可行。 和`20,000`测试用例时，预期的解决方案需要每个案例基本上恒定或对数的工作。 

有几种边界情况很容易处理不当。 当两个输入相等时，矩形就是一个单元格。 例如，输入`1 1`有答案`1`， 不是`0`或周围环的大小。 假设两个不同坐标的粗心实现可能会出错。 

另一个常见的错误是在对螺旋角的四个边求和时将其计算两次。 例如，`13`和`25`都在半径环的同一垂直侧`2`。 他们的矩形包含`25, 10, 11, 12, 13`，其总和为`71`。 如果每个环边都被视为完全包含，则角值可以添加两次。 

坐标系的方向也很重要。 例如，`7`和`9`位于同一行的坐标处`(-1,-1)`和`(-1,1)`。 该矩形恰好包含`7,8,9`，所以答案为`7 9`是`24`。 颠倒第一个坐标的含义会改变正在考虑的螺旋线的哪一侧，并默默地产生错误的坐标。 

最后，大值不得通过浮点平方根进行转换。 对于诸如这样的输入`10^18`，浮点近似可能会落在完美正方形附近的错误螺旋环上。 Python 整数和`math.isqrt`避免这一类错误。 

## 方法

 直接方法很简单。 首先定位`i`和`j`在螺旋中。 然后确定两个位置之间的最小和最大行和列。 最后，枚举该矩形中的每个单元格，评估其 ulam 编号，并将其添加到答案中。 

这种蛮力是正确的，因为所请求的矩形是有限的，并且每个单元格都被访问一次。 问题在于它的大小。 值接近`10^18`，两点可以粗略地分开`10^9`每个坐标方向上的单元格，给出一个大致包含`10^18`细胞。 因此，最坏情况下的操作计数约为`10^18`仅针对一个测试用例进行单元评估。 

有用的观察结果是螺旋是高度结构化的。 每个单元恰好属于一个方环，其中环索引为

 [
 k=\max(|a|,|b|)。 
]

戒指`k`包含前一个方块的值加一到`(2k+1)^2`。 更重要的是，它的四个边都是一个算术级数，其值为一个二次多项式`k`加上沿该边的位置的线性函数。 

例如，环的底面`k`， 在哪里`a=-k`, 有

 [
 值 = 4k^2+3k+1+b。 
]

 其他三边也有类似简单的公式。 这彻底改变了问题。 我们不是访问每个单元格，而是象征性地将所请求的矩形与每个环边的交集相加。 对于固定边，属于矩形的坐标由以下形式的表达式界定`constant`,`k`， 或者`-k`。 在这些表达式交叉的连续点之间，端点是固定的仿射函数`k`。 一个环的贡献是一个最多三阶的多项式`k`，可以用整数幂的标准公式求和。 

暴力方法之所以有效，是因为它明确地访问了单元格。 它失败了，因为它们可能有千万亿个。 每个环边都是围绕二次基的仿射序列的观察结果让我们可以用恒定数量的多项式求和来替换所有这些访问。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(A)`每个案例，其中`A`是矩形面积 |`O(1)`| 太慢了|
 | 最佳|`O(1)`每箱 |`O(1)`| 已接受 |

 ## 算法演练

 1. 将每个输入的 ulam 数字转换为其螺旋坐标。 

对于一个号码`n`， 让`k`是满足以下条件的最小非负整数

 [
 n\le(2k+1)^2。 
]

 这是它的戒指。 环上的最大值为`(2k+1)^2`，位于`(-k,k)`。 从那里绕着环走一圈就会得到稍后使用的坐标公式。 

如果

 [
 d=(2k+1)^2-n,
 ]

 然后环的四个部分由下式获得`d`:

 [
 \开始{对齐}
 d<2k &: (a,b)=(-k,k-d),\
 2k\le d<4k &: (a,b)=(-k+d-2k,-k),\
 4k\le d<6k &: (a,b)=(k,-k+d-4k),\
 6k\le d &: (a,b)=(k-(d-6k),k)。 
\结束{对齐}
 ]

 中心`n=1`自然是由`k=0`。 
2. 获取两个位置的坐标边界矩形。 

如果两个位置是`(a1,b1)`和`(a2,b2)`, 定义

 [
 L_a=\min(a_1,a_2),\quad R_a=\max(a_1,a_2),
 ]

 和

 [
 L_b=\min(b_1,b_2),\quad R_b=\max(b_1,b_2)。 
]

 所需要的矩形正是

 [
 L_a\le a\le R_a，\qquad L_b\le b\le R_b。 
]
 3. 将每个环边上的值表示为多项式。 

我们将每个角恰好分配到一侧以避免重复计算。 所得的边范围和值公式为

 [
 \开始{数组}{c|c|c}
 边&坐标范围&值\
 \h行
 底 & a=-k,\ -k\le b\le k & 4k^2+3k+1+b\
 左 & b=-k,\ -k+1\le a\le k & 4k^2+k+1-a\
 顶部 & a=k,\ -k+1\le b\le k & 4k^2-k+1-b\
 右 & b=k,\ -k+1\le a\le k-1 & 4k^2-3k+1+a
 \结束{数组}
 ]

 非对称端点规则是经过深思熟虑的。 底侧拥有两个底角，左侧拥有左上角，顶侧拥有右上角，右侧没有角。 
4. 对于每条边，确定哪些环可以与所请求的矩形相交。 

例如，在底部我们有`a=-k`。 矩形需要

 [
 L_a\le-k\le R_a,
 ]

 所以

 [
 -R_a\le k\le-L_a。 
]

 类似的不等式给出有效的`k`其他三边的范围。 
5. 对于固定有效环，将边的坐标区间与矩形的坐标区间相交。 

每个端点都是一个仿射函数`k`。 例如，在底部，

 [
 -k\le b\le k
 ]

 必须与

 [
 L_b\le b\le R_b。 
]

 因此实际的端点是

 [
 l(k)=\max(L_b,-k),
 \qquad
 r(k)=\min(R_b,k)。 
]

 在其他方面，同样的想法也适用，间隔如下`[-k+1,k]`或者`[-k+1,k-1]`。 
6. 分割范围`k`每当两个仿射端点表达式交叉时。 

每个端点都是四个仿射函数之一：矩形的固定下界、边的下界、矩形的固定上界或边的上界。 两个仿射函数只能改变一次顺序。 因此，我们收集所有整数交叉点，分割`k`范围，并分别处理每个结果间隔。 

在这样一个区间内，我们确切地知道哪个仿射表达式是下端点，哪个是上端点。 他们的形式是

 [
 l(k)=pk+q,\qquad r(k)=sk+t。 
]
 7. 对 1 的一侧求和`k`区间作为多项式。 

假设边的数值公式为

 [
 Ak^2+Bk+C+Dx。 
]

 所选单元格的数量为

 [
 r-l+1，
 ]

 这是线性的`k`。 它们的坐标之和为

 [
 \frac{r(r+1)-l(l-1)}2,
 ]

 这是二次方`k`。 

因此，边的总贡献是一个最多三次的多项式`k`。 我们评估总和`1`,`k`,`k^2`， 和`k^3`使用封闭公式在区间内进行计算。 
8. 将四个边的贡献取模相加`10^9+7`。 

只有四个边，每个边只产生恒定数量的`k`间隔。 因此，整个测试用例需要恒定的时间。 

### 为什么它有效

 不变量是螺旋的每个单元恰好属于一个环的四个拥有的边范围之一。 坐标转换将每个输入 ulam 放在其唯一的环和边上，而边界矩形恰好包含坐标位于两个极值之间的单元格。 

对于每个拥有的边，与矩形的交点由其下仿射端点函数和上仿射端点函数精确表示。 在每个交叉处进行分裂使得这些函数在每个处理的间隔中都有固定的选择。 然后，多项式计算将这些环上的每个选定单元格相加一次。 由于四个边的所有权范围划分每个环而没有重叠，因此它们的贡献恰好等于所请求的矩形的总和。 

## Python 解决方案```python
import sys
from math import isqrt

input = sys.stdin.readline

MOD = 10**9 + 7
INV2 = pow(2, MOD - 2, MOD)
INV6 = pow(6, MOD - 2, MOD)

def coord(n):
    # Smallest k such that n <= (2k + 1)^2.
    k = (isqrt(n - 1) + 1) // 2

    m = (2 * k + 1) ** 2
    d = m - n

    if d < 2 * k:
        # Bottom: a = -k
        return -k, k - d

    if d < 4 * k:
        # Left: b = -k
        d -= 2 * k
        return -k + d, -k

    if d < 6 * k:
        # Top: a = k
        d -= 4 * k
        return k, -k + d

    # Right: b = k
    d -= 6 * k
    return k - d, k

def powers_sum(l, r):
    if l > r:
        return (0, 0, 0, 0)

    n = r - l + 1

    def pref1(x):
        return x * (x + 1) * INV2 % MOD

    def pref2(x):
        return x * (x + 1) * (2 * x + 1) % MOD * INV6 % MOD

    def pref3(x):
        y = x * (x + 1) % MOD * INV2 % MOD
        return y * y % MOD

    return (
        n % MOD,
        (pref1(r) - pref1(l - 1)) % MOD,
        (pref2(r) - pref2(l - 1)) % MOD,
        (pref3(r) - pref3(l - 1)) % MOD,
    )

def add_side(ans, kl, kr, fixed_l, fixed_r,
             lp, lq, rp, rq, A, B, C, D):
    """
    Sum one spiral side.

    The side coordinate interval is
        [lp*k + lq, rp*k + rq]
    and the rectangle coordinate interval is
        [fixed_l, fixed_r].

    Value on the side is
        A*k^2 + B*k + C + D*x.
    """
    kl = max(kl, 0)
    if kl > kr:
        return ans

    # Four affine expressions determine the two endpoints:
    # fixed_l, geometric_l, fixed_r, geometric_r.
    expr = [
        (0, fixed_l),
        (lp, lq),
        (0, fixed_r),
        (rp, rq),
    ]

    cuts = {kl, kr + 1}

    # Within each interval between crossings, the ordering of
    # all endpoint expressions is fixed.
    for i in range(4):
        p1, q1 = expr[i]
        for j in range(i + 1, 4):
            p2, q2 = expr[j]
            den = p1 - p2
            num = q2 - q1

            if den != 0 and num % den == 0:
                x = num // den
                if kl <= x <= kr:
                    cuts.add(x)
                    if x + 1 <= kr:
                        cuts.add(x + 1)

    cuts = sorted(cuts)

    for idx in range(len(cuts) - 1):
        l = cuts[idx]
        r = cuts[idx + 1] - 1

        if l > r:
            continue

        mid = (l + r) // 2

        gl = lp * mid + lq
        gr = rp * mid + rq

        # Choose which affine expression realizes max(fixed_l, geometric_l).
        if fixed_l >= gl:
            Lp, Lq = 0, fixed_l
        else:
            Lp, Lq = lp, lq

        # Choose which affine expression realizes min(fixed_r, geometric_r).
        if fixed_r <= gr:
            Rp, Rq = 0, fixed_r
        else:
            Rp, Rq = rp, rq

        # If the interval is empty at the midpoint, it is empty
        # throughout this segment because all orderings are fixed.
        if Lp * mid + Lq > Rp * mid + Rq:
            continue

        # count = r(k) - l(k) + 1
        count0 = Rq - Lq + 1
        count1 = Rp - Lp

        # Base value polynomial is C + B*k + A*k^2.
        base = [C, B, A]

        # Multiply base by count.
        poly = [0, 0, 0, 0]
        count = [count0, count1]

        for i in range(3):
            for j in range(2):
                poly[i + j] += base[i] * count[j]

        # Sum of coordinates:
        # (r(r+1) - l(l-1)) / 2.
        # For x = p*k + q:
        # x(x+1) = p^2*k^2 + p*(2q+1)*k + q(q+1).
        r2 = Rp * Rp
        r1 = Rp * (2 * Rq + 1)
        r0 = Rq * (Rq + 1)

        l2 = Lp * Lp
        l1 = Lp * (2 * Lq - 1)
        l0 = Lq * (Lq - 1)

        poly[2] += D * (r2 - l2) * INV2
        poly[1] += D * (r1 - l1) * INV2
        poly[0] += D * (r0 - l0) * INV2

        s0, s1, s2, s3 = powers_sum(l, r)

        ans += poly[0] * s0
        ans += poly[1] * s1
        ans += poly[2] * s2
        ans += poly[3] * s3
        ans %= MOD

    return ans

def solve_case(i, j):
    a1, b1 = coord(i)
    a2, b2 = coord(j)

    la = min(a1, a2)
    ra = max(a1, a2)
    lb = min(b1, b2)
    rb = max(b1, b2)

    ans = 0

    # Bottom:
    # a = -k, b in [-k, k]
    # value = 4k^2 + 3k + 1 + b
    ans = add_side(
        ans,
        -ra, -la,
        lb, rb,
        -1, 0, 1, 0,
        4, 3, 1, 1
    )

    # Left:
    # b = -k, a in [-k+1, k]
    # value = 4k^2 + k + 1 - a
    ans = add_side(
        ans,
        -rb, -lb,
        la, ra,
        -1, 1, 1, 0,
        4, 1, 1, -1
    )

    # Top:
    # a = k, b in [-k+1, k]
    # value = 4k^2 - k + 1 - b
    ans = add_side(
        ans,
        la, ra,
        lb, rb,
        -1, 1, 1, 0,
        4, -1, 1, -1
    )

    # Right:
    # b = k, a in [-k+1, k-1]
    # value = 4k^2 - 3k + 1 + a
    ans = add_side(
        ans,
        lb, rb,
        la, ra,
        -1, 1, 1, -1,
        4, -3, 1, 1
    )

    return ans % MOD

def main():
    t = int(input())
    out = []

    for _ in range(t):
        i, j = map(int, input().split())
        out.append(str(solve_case(i, j)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```这`coord`函数首先找到包含所请求号码的环。 表达式`(isqrt(n - 1) + 1) // 2`给出正确的环，无需浮点运算。 变量`d`测量数字距离右下角最大值的距离，直接标识其边长和坐标。 

这`powers_sum`函数提供三次多项式所需的四个量：`1`,`k`,`k^2`， 和`k^3`。 所有除法均以模进行`10^9+7`使用模逆。 

中心程序是`add_side`。 它的四个仿射端点表达式足以描述螺旋边与矩形之间的每一个可能的交点。 它将每个整数交叉插入到分区中，因此在每个结果区间内，相同的端点表达式保持活动状态。 中点仅用于识别那些活跃的表达式，而不是近似答案。 

多项式在`add_side`值得特别关注。 一个单元格的值是二次方`k`，而一侧选定部分上的单元数量与`k`。 他们的乘积是立方的。 坐标和贡献了另一个二次项。 因此，整个区间可简化为由以下方式返回的四个幂和`powers_sum`。 

侧面范围故意使用不同的端点。 底边包括两个底角，左侧从左下角之后的一个位置开始，顶边从左上角之后的一个位置开始，右侧不包括剩余的两个角。 这使得四个范围不相交并防止重复计算。 

Python 整数具有任意精度，因此即使原始值大到`10^18`并且矩形总和要大得多。 

## 工作示例

 ### 示例 1，`2 12`坐标是

 [
 2=(0,1),\qquad 12=(1,2)。 
]

 因此边界矩形是

 [
 0\le a\le1,\qquad1\le b\le2。 
]

 它里面的细胞是`2, 11, 3, 12`。 

| 步骤|`k`| 选定的坐标| 增值 | 运行总和 |
 | --- | --- | --- | --- | --- |
 | 底面|`1`|`(0,1)`|`2`|`2`|
 | 右/上交叉口 |`2`|`(0,2)`|`11`|`13`|
 | 顶面 |`1`|`(1,1)`|`3`|`16`|
 | 右侧 |`2`|`(1,2)`|`12`|`28`|

 答案是`28`，匹配样本。 跟踪显示矩形可以与几个不同的环相交，但算法永远不会迭代它们之间的所有环。 每个适用范围都以多项式求和。 

### 示例 1，`9 7`坐标是

 [
 9=(-1,1),\qquad7=(-1,-1)。 
]

 两个值位于同一行，因此边界矩形是

 [
 a=-1,\qquad -1\le b\le1。 
]

 | 步骤|`k`| 选定的坐标| 增值 | 运行总和 |
 | --- | --- | --- | --- | --- |
 | 底面|`1`|`(-1,-1)`|`7`|`7`|
 | 底面|`1`|`(-1,0)`|`8`|`15`|
 | 底面|`1`|`(-1,1)`|`9`|`24`|

 答案是`24`。 本例使用一个狭窄的矩形，其全部内容位于一个螺旋边上。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(1)`每个测试用例| 四边，每边仅分为恒定数量的仿射阶间隔 |
 | 空间|`O(1)`| 仅存储恒定数量的坐标、多项式系数和区间边界 |

 至多有`20,000`测试用例和输入最多`10^18`，该解决方案在每种情况下仅执行少量恒定的算术。 它从不构造螺旋，从不迭代矩形，也从不迭代两个输入值之间的所有环，因此它可以轻松地适应`3`第二个和`512 MB`限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

# The production solution above can be placed in this function/module.
# For a standalone test file, assume solve_case is already defined.

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output

    try:
        t = int(input())
        ans = []
        for _ in range(t):
            i, j = map(int, input().split())
            ans.append(str(solve_case(i, j)))
        return "\n".join(ans)
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
assert run("""\
3
2 12
9 7
7 9
""") == """\
28
24
24
""", "sample 1"

# Minimum input, same cell
assert run("""\
1
1 1
""") == """\
1
""", "single center cell"

# Adjacent cells
assert run("""\
1
1 2
""") == """\
3
""", "adjacent cells"

# Same row, exercises side traversal
assert run("""\
1
7 9
""") == """\
24
""", "same-row boundary case"

# Same column, includes two corners of one ring
assert run("""\
1
13 25
""") == """\
71
""", "same-column ring case"

# Maximum input value, equal endpoints
assert run("""\
1
1000000000000000000 1000000000000000000
""") == """\
49
""", "maximum value and modular reduction"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 1`|`1`| 最小输入和简并单单元矩形 |
 |`1 / 1 2`|`3`| 相邻单元格和第一个螺旋台阶 |
 |`1 / 7 9`|`24`| 同行矩形和底边遍历 |
 |`1 / 13 25`|`71`| 同列遍历和环角所有权 |
 |`1 / 10^18 10^18`|`49`| 最大输入、精确环计算和模运算 |

 ## 边缘情况

 在出现任何几何复杂性之前就处理了相等输入的情况。 为了`1 1`，两个坐标都是`(0,0)`，所以矩形是一个单元格。 底侧计算包括环`k=0`，其公式给出`1`，而其他三个拥有的边范围是空的。 输出正是`1`。 

同排情况`7 9`有坐标`(-1,-1)`和`(-1,1)`。 唯一相关的环是`k=1`，底边贡献了间隔`b=-1..1`。 其公式给出`7,8,9`，生产`24`。 没有其他方添加这些单元格，因此不存在重复。 

角落案例`13 25`有坐标`(2,2)`和`(-2,2)`。 矩形是单列`b=2`，行来自`-2`通过`2`。 值为`25,10,11,12,13`, 总结为`71`。 底部拥有`25`, 右侧拥有`10,11,12`，并且顶部拥有`13`。 端点约定正是防止角被计算两次的原因。 

最大值情况使用`10^18`对于两个输入。 由于两个坐标相同，因此只需要一个单元格。 该算法使用整数平方根算术定位数字并返回其模数值`10^9+7`。 因为

 [
 10^{18}=(10^9)^2\equiv(-7)^2\equiv49\pmod{10^9+7},
 ]

 预期输出是`49`。 这也说明了为什么解决方案中的任何地方都不需要浮点计算。
