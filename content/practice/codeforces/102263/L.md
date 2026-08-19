---
title: "CF 102263L - 汉堡"
description: "无限板是周期性的。 每个（n×m）块都包含相同的值，因此只有一个块内的位置很重要。 令从零开始的局部行和列为(x)和(y)。 该位置的汉堡值为 [ f(x,y)=xm+y+1。"
date: "2026-08-17T20:10:29+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102263
codeforces_index: "L"
codeforces_contest_name: "ArabellaCPC 2019"
rating: 0
weight: 102263
solve_time_s: 137
verified: true
draft: false
---

[CF 102263L - 汉堡](https://codeforces.com/problemset/problem/102263/L)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 无限板是周期性的。 每个（n × m）块都包含相同的值，因此只有一个块内的位置很重要。 令从零开始的局部行和列为(x)和(y)。 该位置的汉堡价值为

 [
 f(x,y)=xm+y+1。 
]

 吃完后，玩家移动 (r) 行和 (c) 列。 由于我们只关心重复块内的位置，因此状态序列为

 [
 (x+kr)\bmod n,\qquad (y+kc)\bmod m。 
]

 玩家在吃掉价值已经出现的汉堡之前立即停下来。 因为从 (1) 到 (nm) 的每个值都恰好出现在一个局部位置，所以当行和列残差相等时，两个状态具有相同的美味。 因此，当一对残基重复时，该过程停止。 

对于行坐标，访问的不同位置的数量是

 [
 p_n=\frac{n}{\gcd(n,r)}。 
]

 对于列坐标来说是

 [
 p_m=\frac{m}{\gcd(m,c)}。 
]

 完整的一对重复之后

 [
 L=\运算符名称{lcm}(p_n,p_m)
 ]

 移动。 玩家吃的正是 (L) 个汉堡。 

对于模拟而言，约束太大。 两个维度都可以达到(2\cdot10^9)，因此在一个周期内最多可以有(4\cdot10^{18})个位置。 官方的问题限制只有 0.5 秒，所以即使是 (O(nm)) 方法也是不可能的，更不用说从每个起始单元迭代完整的轨迹了。 该解决方案必须将轨迹减少到一些 gcd、lcm 和算术和计算。 

有几个简单的陷阱。 为了`1 1 1 1`，唯一的汉堡具有值（1），第一个汉堡被吃掉并且下一个状态具有相同的值，所以答案是`1`。 假设玩家总是至少吃两个汉堡的解决方案将会减少一个。 

为了`1 4 1 2`，从任何起始列访问的列具有相同的奇偶校验。 最佳轨迹访问具有值 (2) 和 (4) 的列，给出 (2+4=6)。 假设步骤 (2) 最终访问所有四列的粗心解决方案将错误地使用总和 (1+2+3+4=10)。 正确的示例输出是`6`。 

为了`4 3 2 1`，行步长为 (\gcd(4,2)=2)，因此只有两行属于任何行循环。 将行步骤视为与 (n) 互质的解决方案将包括来自所有四行的值。 正确答案是`48`。 

最后，当(r=n)或(c=m)时，对应的坐标根本不改变。 例如，与`3 2 3 2`，每次移动后都会到达相同的单元格，因此最佳起始单元格就是右下角的单元格，其值为 (6)。 答案是`6`。 

## 方法

 直接的做法是选择每一个可能的起始位置，模拟跳跃，直到出现先前吃掉的值，并保留最大的总和。 对于一个起始位置，这需要 (L) 次迭代，其中

 [
 L=\operatorname{lcm}\left(\frac n{\gcd(n,r)},\frac m{\gcd(m,c)}\right)。 
]

 有(nm)个可能的局部起始位置，因此暴力操作计数为

 [
 O(nmL)。 
]

 在最坏的情况下，两个缩减周期可以互质，使 (L) 接近 (nm)。 当两个维度接近 (2\cdot10^9) 时，这可以接近 ((nm)^2)，大约 (1.6\cdot10^{37}) 轨迹步长。 蛮力法是正确的，因为它确实遵循该过程，但它对周期的依赖使其无法使用。 

有用的观察结果是行坐标和列坐标独立演化。 对于尺寸为 (q) 且步骤 (d) 的一维，令

 [
 g=\gcd(q,d),\qquad p=\frac qg.
 ]

 从一个残基开始，所访问的残基恰好是

 [
 s,s+g,s+2g,点,s+(p-1)g
 ]

 对它们进行模 (q) 减少之后。 换句话说，一条轨迹访问一个完整的残基类模 (g)。 每个具有相同残基模 (g) 的起始点都会产生相同的位置集。 

该残基类别的总和是

 [
 p s+g\frac{p(p-1)}2.
 ]

 (s)的系数为正，因此最大和来自(s=g-1)。 因此，该维度的最大单周期总和为

 [
 S(q,d)=p(g-1)+g\frac{p(p-1)}2。 
]

 行周期和列周期可以具有不同的周期，因此在完整的二维轨迹期间，行周期重复(L/p_n)次，列周期重复(L/p_m)次。 

汉堡值是 (xm+y+1)，因此总贡献分为行部分、列部分和每个吃过的汉堡的一个常数 (1)。 这种分离使我们能够独立地最大化最佳行周期和最佳列周期。 相应的起始行和起始列可以简单地组合成一个起始单元格。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(nmL)) | (O(1)) | (O(1)) | 太慢了|
 | 最佳| (O(\log(\max(n,m)))) | (O(1)) | (O(1)) | 已接受 |

 ## 算法演练

 1. 计算 (g_n=\gcd(n,r)) 和 (p_n=n/g_n)。 行坐标恰好在 (p_n) 次跳转后返回到其起始值，因为 (p_n r) 是 (n) 的最小正倍数。 
2. 对于列，以相同的方式计算 (g_m=\gcd(m,c)) 和 (p_m=m/g_m)。 完整的本地单元在之后重复

 [
 L=\operatorname{lcm}(p_n,p_m)。 
]

 这是在下一个汉堡具有先前看到的值之前吃掉的汉堡的数量。 

1. 对于行维度，计算

 [
 S_n=p_n(g_n-1)+g_n\frac{p_n(p_n-1)}2。 
]

 这是一个行周期内从零开始的行索引的最大总和。 最佳起始行属于残基类 (g_n-1\pmod {g_n})。 

1. 对于柱尺寸，计算

 [
 S_m=p_m(g_m-1)+g_m\frac{p_m(p_m-1)}2.
 ]

 这是一个列循环期间从零开始的列索引的相应最大总和。 

1. 长度为 (p_n) 的行循环在完整轨迹期间发生 (L/p_n) 次。 因此，行索引总和为

 [
 S_n\frac{L}{p_n}。 
]

 同样，列索引总和为

 [
 S_m\frac{L}{p_m}。 
]

 1. 将这些坐标总和转换为汉堡的美味程度。 每个行索引贡献因子 (m)，每个列索引直接贡献因子，每个吃过的汉堡贡献因子 (1)。 答案是

 [
 mS_n\frac{L}{p_n}
 +
 S_m\压裂{L}{p_m}
 +
 L。 
]

 将此表达式取模 (10^9+7)。

工作原理：每条轨迹都是有限圆环 (\mathbb Z_n\times\mathbb Z_m) 上平移 ((x,y)\mapsto(x+r,y+c)) 的轨道。 它的长度是（L），所以恰好一个完整的轨道被吃掉。 在每个坐标中，轨道由一个以相应的 gcd 为模的残差类组成，并且通过选择其最大残差来获得该类的最大和。 由于汉堡值是独立行项、独立列项和常数的总和，因此独立地最大化两个坐标总和也会最大化完整轨迹总和。 因此，该公式会评估最佳的起始单元格。 

## Python 解决方案```python
import sys
from math import gcd

input = sys.stdin.readline

MOD = 10**9 + 7

def cycle_info(q, d):
    g = gcd(q, d)
    p = q // g

    # Maximum sum of residues in one cycle.
    # The best residue class starts at g - 1:
    # (g - 1), (2g - 1), ..., (pg - 1)
    s = p * (g - 1) + g * p * (p - 1) // 2
    return g, p, s

def solve():
    n, m, r, c = map(int, input().split())

    _, pn, row_sum = cycle_info(n, r)
    _, pm, col_sum = cycle_info(m, c)

    # lcm(pn, pm)
    L = pn // gcd(pn, pm) * pm

    row_repetitions = L // pn
    col_repetitions = L // pm

    answer = 0
    answer += (m % MOD) * (row_sum % MOD) % MOD
    answer %= MOD
    answer = answer * (row_repetitions % MOD) % MOD

    answer += (col_sum % MOD) * (col_repetitions % MOD) % MOD
    answer += L % MOD

    print(answer % MOD)

if __name__ == "__main__":
    solve()
```这`cycle_info`函数实现一维数学归约。`g`识别哪些残基类别被跳跃保留，而`p`是此类中的职位数量。 算术级数从 (g-1) 开始，因为这给出了最大可能的总和。 

完整的周期是行周期和列周期的lcm。 表达式`pn // gcd(pn, pm) * pm`计算它而不构建任何轨迹。 

行贡献需要行周期总和以及该周期在组合周期内发生的次数。 因素`m`将从零开始的行索引转换为其对汉堡价值的贡献。 柱贡献不需要额外的尺寸因子。 

Python 整数具有任意精度，因此即使完整周期可能在 (4\cdot10^{18}) 左右，中间产品也是安全的。 该代码仍然会按模数 (10^9+7) 减少乘积，从而保持算术紧凑并直接反映所需的输出。 

使用从零开始的坐标是经过深思熟虑的。 对于行 (x) 和列 (y)，汉堡值恰好是 (mx+y+1)。 使用基于 1 的坐标需要对每个算术级数进行额外的调整，并且很容易产生差一错误。 

## 工作示例

 对于示例 1，输入为`3 3 1 1`。 两个维度都有 gcd (1)，因此每个坐标都被完全访问。 

| 尺寸| (g)| 期间 (p) | 最佳周期总和| 重复|
 | --- | --- | --- | --- | --- |
 | 行| 1 | 3 | 3 | 1 |
 | 专栏 | 1 | 3 | 3 | 1 |

 完整周期为(L=3)。 行贡献为 (3\cdot3=9)，列贡献为 (3)，常数贡献为 (3)。 总数为（9+3+3=15），与样本相符。 

对于示例 2，输入为`1 4 1 2`。 行维度只有一个位置。 对于列，(\gcd(4,2)=2)，因此每个轨迹都会访问两个奇偶校验类之一。 

| 尺寸| (g)| 期间 (p) | 最佳周期总和| 重复|
 | --- | --- | --- | --- | --- |
 | 行| 1 | 1 | 0 | 2 |
 | 专栏 | 2 | 2 | 4 | 1 |

 完整周期为(L=2)。 最佳列类包含从零开始的列 (1) 和 (3)，对应于汉堡值 (2) 和 (4)。 答案是（0+4+2=6）。 这说明了 gcd 为何重要：跳转不会访问每一列。 

对于示例 3，输入为`2000000000 1 1 1`。 因为只有一列，所以列贡献为零。 行周期为(2\cdot10^9)，最佳行周期包含每一行。 答案是

 [
 \frac{2000000000\cdot1999999999}{2}+2000000000。 
]

 模 (10^9+7)，这是`91`，如示例中所示。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(\log(\max(n,m)))) | 两次 gcd 计算和常数时间算术 |
 | 空间| (O(1)) | (O(1)) | 只存储固定数量的整型变量 |

 维度可以是 (2\cdot10^9)，但算法从不迭代行、列、单元格或轨迹位置。 Euclid 的算法在对数时间内完成，因此该解决方案很容易满足 0.5 秒的限制并使用常量内存。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from math import gcd

MOD = 10**9 + 7

def solve_io(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        n, m, r, c = map(int, sys.stdin.readline().split())

        def cycle_sum(q, d):
            g = gcd(q, d)
            p = q // g
            s = p * (g - 1) + g * p * (p - 1) // 2
            return p, s

        pn, row_sum = cycle_sum(n, r)
        pm, col_sum = cycle_sum(m, c)

        L = pn // gcd(pn, pm) * pm

        ans = (
            (m % MOD) * (row_sum % MOD) % MOD
            * (L // pn)
            + (col_sum % MOD) * (L // pm)
            + L
        ) % MOD

        return str(ans)
    finally:
        sys.stdin = old_stdin
        output = sys.stdout.getvalue()
        sys.stdout = old_stdout

# Provided samples
assert solve_io("3 3 1 1\n") == "15", "sample 1"
assert solve_io("1 4 1 2\n") == "6", "sample 2"
assert solve_io("2000000000 1 1 1\n") == "91", "sample 3"

# Minimum size, only one burger and one-step repetition
assert solve_io("1 1 1 1\n") == "1", "minimum-size case"

# All burgers in the trajectory have the same local value
assert solve_io("1 2 1 2\n") == "2", "all-equal trajectory"

# Boundary case r = n and c = m, so the same cell is reached immediately
assert solve_io("3 2 3 2\n") == "6", "zero movement modulo dimensions"

# Partial gcd cycles in both dimensions
assert solve_io("4 3 2 1\n") == "48", "non-coprime row step"

# Maximum-size dimensions
assert solve_io("2000000000 2000000000 1 1\n") == "999998628", "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 1 1`|`1`| 最小尺寸和周期一 |
 |`1 2 1 2`|`2`| 一个坐标，其跳跃恰好是它的维度 |
 |`3 2 3 2`|`6`| 两次跳跃都等于其相应的尺寸 |
 |`4 3 2 1`|`48`| 非互质行步骤和重复行循环 |
 |`2000000000 2000000000 1 1`|`999998628`| 最大维数和大模运算 |

 ## 边缘情况

 对于`1 1 1 1`，我们有 (g_n=g_m=1)、(p_n=p_m=1) 和 (L=1)。 行和列的总和都为零，因为它们的基于零的坐标始终为零。 公式给出（0+0+1=1），所以正好吃掉一个汉堡。 

为了`1 4 1 2`，列 gcd 为 (2)，给出 (p_m=2)。 最好的残基类别是 (1\pmod2)，包含从零开始的列 (1) 和 (3)。 它们的总和为 (4)，轨迹长度为 (2)。 结果是(4+2=6)。 该算法从不假设非互质步骤访问整个维度。 

为了`3 2 3 2`，两次跳跃都等于它们的尺寸。 我们得到 (p_n=p_m=1)，因此 (L=1)。 最好的行残差是（2），最好的列残差是（1），唯一吃过的汉堡有值（2\cdot2+1+1=6）。 下一个位置有完全相同的美味，所以玩家立即醒来。 该公式产生(6)。 

为了`4 3 2 1`，行周期有(g_n=2)和(p_n=2)。 其最佳的从零开始的行是 (1) 和 (3)，其总和为 (4)。 完整的周期为 (L=\operatorname{lcm}(2,3)=6)，因此每个行位置出现 3 次，每个列位置出现两次。 行贡献为 (3\cdot4\cdot3=36)，列贡献为 (3\cdot2=6)，常数贡献为 (6)。 最终答案是（36+6+6=48）。 

为了`2000000000 2000000000 1 1`，两个维度都有周期 (2\cdot10^9)，因此完整的轨迹包含 (2\cdot10^9) 个汉堡。 每个坐标的一维最大和为 (2000000000\cdot1999999999/2)。 计算采用模乘法，因此不需要对巨大的轨迹进行迭代，最终结果为`999998628`。
