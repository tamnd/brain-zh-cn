---
title: "CF 197B - 限制"
description: "我们有两个多项式：$P(x)$ 和 $Q(x)$，以 $x$ 的降幂形式表示。 任务是计算： $$lim{x to infty} frac{P(x)}{Q(x)}$$ 输入给出两个多项式的次数以及从最高次数项到常数项的所有系数。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "math"]
categories: ["algorithms"]
codeforces_contest: 197
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 124 (Div. 2)"
rating: 1400
weight: 197
solve_time_s: 93
verified: true
draft: false
---

[CF 197B - 限制](https://codeforces.com/problemset/problem/197/B)

 **评分：** 1400
 **标签：** 数学
 **求解时间：** 1m 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个多项式，$P(x)$和$Q(x)$，以降幂形式写成$x$。 任务是计算：$$\lim_{x \to \infty} \frac{P(x)}{Q(x)}$$输入给出两个多项式的次数以及从最高次数项到常数项的所有系数。 

关键的观察是当$x$变得非常大，最高阶项支配其他一切。 与主导项相比，较低的幂变得微不足道。 

例如：$$\frac{3x^5 + 2x + 1}{7x^5 - 9}$$行为几乎完全相同：$$\frac{3x^5}{7x^5} = \frac{3}{7}$$对于非常大的$x$。 

约束很小，度数最多为 100，因此性能并不是这里真正的挑战。 即使对多项式进行数值计算也能轻松满足限制。 真正的挑战是数学的正确性。 浮点计算会引入精度问题，甚至可能对大输入产生完全错误的答案。 

一些边缘情况很容易被错误处理。 

考虑：```
2 1
1 1 1
2 5
```这是：$$\frac{x^2 + x + 1}{2x + 5}$$分子的次数较大，因此比率无限制地增长。 由于两个首项系数均为正，因此答案为：```
Infinity
```以某个大的有限值进行计算的粗心实现可能仍然会产生有限的数字。 

现在考虑：```
2 1
-1 0 0
2 1
```这是：$$\frac{-x^2}{2x+1}$$分子仍然占主导地位，但领先系数为负。 极限变为：```
-Infinity
```当分子度数较大时，符号就很重要。 

当分母的次数较大时，会发生另一个重要情况：```
1 2
5 1
1 0 0
```这是：$$\frac{5x+1}{x^2}$$作为$x \to \infty$，分母增长得更快，因此结果趋近于零：```
0/1
```最后，当两个度数相等时，我们必须正确地减少分数：```
1 1
6 0
8 1
```限制是：$$\frac{6x}{8x} = \frac{6}{8} = \frac{3}{4}$$印刷`6/8`是错误的，因为该问题需要一个不可约分数。 

## 方法

 蛮力方法将直接评估两个多项式的非常大的值，例如$x = 10^9$，然后除以结果并尝试推断极限。 

这在许多普通情况下都有效，因为主导术语压倒了较小的术语。 对于相同的度数，该比率接近首项系数的比率。 对于不同程度，幅度变得极大或极小。 

问题是可靠性。 在许多语言中，大幂会很快溢出，浮点运算会失去精度。 即使 Python 的任意大小的整数也会不必要地产生天文数字般的大值。 更重要的是，数值近似在这里根本上是错误的工具，因为答案是精确的并且完全由多项式次数和主导系数决定。 

多项式增长的结构提供了更清晰的解决方案。 

认为：$$P(x)=a_0x^n+\dots$$和$$Q(x)=b_0x^m+\dots$$作为$x \to \infty$：$$\frac{P(x)}{Q(x)} \sim \frac{a_0x^n}{b_0x^m} = \frac{a_0}{b_0}x^{n-m}$$现在一切只取决于$n-m$。 

如果$n>m$, 因子$x^{n-m}$变得无限大。 标志来自$\frac{a_0}{b_0}$。 

如果$n<m$，该因子趋于零。 

如果$n=m$，幂完全抵消，仅保留主导系数之比。 

这将整个问题简化为几次比较和一次 gcd 计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 强力多项式评估 | O(n + m) | O(1) | O(1) | 数字不安全 |
 | 最优数学观察| O(n + m) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 阅读学位$n$和$m$。 
2. 读取两个多项式的系数数组。 
3. 提取首项系数。 

由于系数是从最高阶到最低阶给出的，因此主要系数很简单：$$a_0 = A[0], \quad b_0 = B[0]$$4. 比较学位$n$和$m$。 
5. 如果$n > m$，分子增长速度快于分母。 

极限变为正无穷大或负无穷大，具体取决于以下符号：$$a_0 \times b_0$$如果产品呈阳性，则打印`"Infinity"`。 

否则打印`"-Infinity"`。 
6. 如果$n < m$，分母增长得更快。 

限制接近零，因此打印：```
0/1
```7. 如果$n = m$，计算约简分数：$$\frac{a_0}{b_0}$$计算：$$g = \gcd(|a_0|, |b_0|)$$将两个数字除以$g$。 
8. 确保分母为正。 

如果分母为负数，则将分子和分母都乘以$-1$。 
9. 按以下格式打印分数：```
p/q
```### 为什么它有效

 对于非常大的$x$，与首项相比，低次多项式项变得可以忽略不计。 商：$$\frac{P(x)}{Q(x)}$$具有与以下相同的渐近行为：$$\frac{a_0x^n}{b_0x^m} = \frac{a_0}{b_0}x^{n-m}$$指数$n-m$完全确定表达式是无限增长、缩小到零还是稳定在恒定值。 由于算法的每一步都直接遵循这种渐近形式，因此生成的答案在数学上是精确的。 

## Python 解决方案```python
import sys
from math import gcd

input = sys.stdin.readline

n, m = map(int, input().split())

A = list(map(int, input().split()))
B = list(map(int, input().split()))

a0 = A[0]
b0 = B[0]

if n > m:
    if a0 * b0 > 0:
        print("Infinity")
    else:
        print("-Infinity")

elif n < m:
    print("0/1")

else:
    g = gcd(abs(a0), abs(b0))

    p = a0 // g
    q = b0 // g

    if q < 0:
        p *= -1
        q *= -1

    print(f"{p}/{q}")
```第一部分读取度数和系数数组。 由于输入顺序已经从最高阶系数开始，因此前导系数可立即在索引处可用`0`。 

程度比较驱动整个解决方案。 当分子次数较大时，只有符号重要。 乘以首项系数即可得出极限的符号。 

等次分支是唯一需要进行不可比较算术的地方。 我们使用以下方法减少分数`gcd`，然后标准化符号，使分母保持正值，完全按照语句的要求。 

一个微妙的点是在内部使用绝对值`gcd`。 蟒蛇的`math.gcd`安全地处理负数，但采用绝对值可以保持意图明确并避免跨语言的可移植性问题。 

另一个微妙的细节是分母标准化。 结果就像`1/-2`在数学上是正确的，但违反了所需的输出格式，因为分母必须为正。 

## 工作示例

 ### 示例 1

 输入：```
2 1
1 1 1
2 5
```这代表：$$\frac{x^2+x+1}{2x+5}$$| 变量| 价值|
 | --- | --- |
 | n | 2 |
 | 米 | 1 |
 | a0 | 1 |
 | b0 | 2 |
 | 学位比较| n > m |
 | a0 × b0 的符号 | 积极|

 输出：```
Infinity
```分子的增长就像$x^2$，而分母则增长为$x$。 自从$x^2$占主导地位$x$，比率无限增长。 

### 示例 2

 输入：```
1 1
6 0
8 1
```这代表：$$\frac{6x}{8x+1}$$| 变量| 价值|
 | --- | --- |
 | n | 1 |
 | 米 | 1 |
 | a0 | 6 |
 | b0 | 8 |
 | 最大CD(6, 8) | 2 |
 | 简化分子 | 3 |
 | 减少分母 | 4 |

 输出：```
3/4
```两个多项式以相同的速率增长，因为它们的次数匹配。 极限等于主系数之比。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | 读取输入数组在运行时占据主导地位 |
 | 空间| O(1) | O(1) | 除了输入数组之外，只使用了几个变量 |

 约束条件非常小，因此该解决方案可以立即运行。 即使最大程度为 100，与时间限制相比，工作量也是微不足道的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from math import gcd

def solve():
    input = sys.stdin.readline

    n, m = map(int, input().split())

    A = list(map(int, input().split()))
    B = list(map(int, input().split()))

    a0 = A[0]
    b0 = B[0]

    if n > m:
        if a0 * b0 > 0:
            print("Infinity")
        else:
            print("-Infinity")

    elif n < m:
        print("0/1")

    else:
        g = gcd(abs(a0), abs(b0))

        p = a0 // g
        q = b0 // g

        if q < 0:
            p *= -1
            q *= -1

        print(f"{p}/{q}")

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    out = io.StringIO()
    backup = sys.stdout
    sys.stdout = out

    solve()

    sys.stdout = backup
    return out.getvalue().strip()

# provided sample
assert run(
"""2 1
1 1 1
2 5
"""
) == "Infinity", "sample 1"

# equal degrees, reducible fraction
assert run(
"""1 1
6 0
8 1
"""
) == "3/4", "fraction reduction"

# denominator degree larger
assert run(
"""1 2
5 1
1 0 0
"""
) == "0/1", "approaches zero"

# negative infinity
assert run(
"""2 1
-1 0 0
2 1
"""
) == "-Infinity", "negative sign handling"

# minimum size polynomials
assert run(
"""0 0
5
-10
"""
) == "-1/2", "constant polynomials"

# denominator normalization
assert run(
"""1 1
1 0
-2 3
"""
) == "-1/2", "positive denominator requirement"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 具有可约系数的等度 | 3/4 | 适当的 gcd 减少 |
 | 分子度数较小 | 0/1 | 正确的零处理 |
 | 负前导符号| -无限| 无穷大符号正确性 |
 | 0 次多项式 | -1/2 | 最小有效输入|
 | 负分母| -1/2 | 分母归一化 |

 ## 边缘情况

 考虑：```
2 1
-1 0 0
2 1
```主要术语是：$$\frac{-x^2}{2x} = -\frac{x}{2}$$该算法比较度数并发现$2 > 1$。 然后它检查以下符号：$$(-1) \times 2 = -2$$由于符号为负，因此打印：```
-Infinity
```这正确地捕捉了发散的方向。 

现在考虑：```
1 2
5 1
1 0 0
```主导行为是：$$\frac{5x}{x^2} = \frac{5}{x}$$作为$x$增长，该值缩小到零。 

该算法看到$1 < 2$并立即打印：```
0/1
```不需要分数约简，因为精确极限为零。 

最后，考虑分母符号标准化：```
1 1
1 0
-2 3
```原始主导系数比为：$$\frac{1}{-2}$$最大公约数是$1$，所以未约化的分数仍然存在`1/-2`。 

该算法检测负分母并翻转两个符号：$$\frac{1}{-2} = \frac{-1}{2}$$它打印：```
-1/2
```满足所需的输出格式。
