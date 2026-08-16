---
title: "CF 102388A - 奇怪的基地"
description: "我们需要使用黄金比例的幂 [ phi=frac{1+sqrt5}{2} 来打印正整数 (n) 的唯一规范表示。 ] 每个位置包含 (0) 或 (1)，并且两个相邻位置不能同时包含 (1)。"
date: "2026-08-15T08:21:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102388
codeforces_index: "A"
codeforces_contest_name: "SUFE ICPC Team Formation Test"
rating: 0
weight: 102388
solve_time_s: 617
verified: true
draft: false
---

[CF 102388A - 奇怪的基地](https://codeforces.com/problemset/problem/102388/A)

 **评级：** -
 **标签：** -
 **求解时间：** 10m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要使用黄金比例的幂来打印正整数 (n) 的唯一规范表示

 [
 \phi=\frac{1+\sqrt5}{2}。 
]

 每个位置包含 (0) 或 (1)，并且两个相邻位置不能同时包含 (1)。 与普通位置系统不同，有用的位置可以具有负指数，因此输出可能包含小数部分。 例如，

 [
 2=\phi^1+\phi^{-2},
 ]

 写成`10.01`。 

输入最多包含 10 个独立整数，每个 (n\le 100000)。 (n) 中的二次解对于一个测试用例已执行最多 (10^{10}) 次操作，远远超出了一秒的限制。 即使是探索指数级多数字字符串的方法也是完全不可行的。 我们需要一种算法，其工作量大致随基数 (\phi) 位置的数量而增长，而基数 (\phi) 位置的数量在 (n) 中仅呈对数。 

有几种边缘情况很容易被错误处理。 最小的输入是 (n=1)，其答案很简单`1`。 始终打印小数点的格式化程序可能会错误地生成`1.`。 

第一个需要负幂的数字是 (n=2)。 它的答案是```
2
10.01
```仅搜索幂 (\phi^0,\phi^1,\phi^2,\ldots) 的方法永远无法完成，因为 (2) 不是所需正幂的总和。 

浮点运算是另一个危险的情况。 对于 (n=2)，确切的恒等式是 (\phi+\phi^{-2}=2)，但是用普通浮点计算这两项可能会留下微小的残差，而不是恰好为零。 持续生成负幂直到残差变为零的循环可能会产生不正确的额外数字。 下面的解决方案永远不会对 (\phi) 进行数值计算。 

最后，必须禁止相邻的。 例如，(4) 表示为`101.01`，而不是附近权力的任意组合。 由于身份相同，贪心过程会自动创建所需的分离

 [
 \phi^{k+1}-\phi^k=\phi^{k-1}。 
]

 这里使用的贪婪表征是标准规范或伯格曼基（\phi）表示。 

## 方法

 直接的暴力解决方案将选择一系列指数并枚举每个可能的二进制数字字符串，拒绝包含相邻数字的字符串并检查其余字符串的计算结果为 (n)。 这在原则上是正确的，因为所需的表示是有限且唯一的，但搜索空间呈指数增长。 对于 49 个位置的范围，有 (F_{51}=20,365,011,074) 个没有相邻字符串的二进制字符串，因此即使在恒定时间内测试一个候选字符串，对于最大的输入来说也已经是无望的了。 

一种更自然但仍然不合适的方法是在保持符号表达式的同时重复添加或减去 (\phi) 的幂。 它避免枚举所有字符串，但如果没有贪婪观察，就没有理由知道接下来应该选择哪个幂，因此算法仍然必须探索替代方案。 

关键的观察是可以贪婪地构建规范表示。 在每一点，令 (r) 为仍要表示的正余数。 选择满足的最大幂 (\phi^k)

 [
 \phi^k\le r。 
]

 将 (1) 放在 (k) 位置，然后将 (r) 替换为 (r-\phi^k)。 重复此操作最终达到零并产生规范表示。 这正是最小基（\phi）表示的贪婪表征。 

还有第二个困难：涉及 (\phi) 的比较不能安全地使用普通浮点。 有用的代数事实是 (\phi) 的每一次幂都可以精确地写成

 [
 a+b\phi
 ]

 对于整数 (a,b)。 自从

 [
 \phi^2=\phi+1,
 ]

 将这样的一对乘以 (\phi) 只是

 [
 (a+b\phi)\phi=b+(a+b)\phi。 
]

 同样，因为 (1/\phi=\phi-1)，除以 (\phi) 为

 [
 (a+b\phi)/\phi=(b-a)+a\phi。 
]

 因此，我们可以仅使用整数运算来生成所需的所有功率。 

比较本身也可以是准确的。 对于

 [
 x=a+b\phi,
 ]

 写

 [
 x=\frac{(2a+b)+b\sqrt5}{2}。 
]

 仅使用整数乘法和比较即可确定该表达式的符号。 该算法中的任何地方都没有数值近似。 

因此，暴力方法会失败，因为有效数字串的数量是指数级的，而规范表示是贪婪的观察结果将问题简化为扫描幂一次。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(F_L))，其中 (L) 是位置数 | (O(L)) | 太慢了 |
 | 贪婪的精确代数运算 | (O(L)) | (O(L)) | 已接受 |

 ## 算法演练

1. 以 ((a,b)) 的形式表示每个代数数，即 (a+b\phi)。 输入整数 (n) 以 ((n,0)) 开头，当前余数以相同的形式存储。 
2. 找到 (\phi^k\le n) 的最大指数 (k)。 从 (\phi^0=1) 开始，将当前功率重复乘以 (\phi)，但不超过 (n)。 由于 (\phi>1)，该过程在 (O(\log n)) 次迭代后停止。 
3. 从这个最大的指数开始，处理能力按递减顺序排列。 在指数 (k) 处，将当前余数与 (\phi^k) 进行比较。 如果幂合适，则将数字 (1) 放在该位置，然后从余数中减去幂。 否则输入数字 (0)。 
4. 在每个位置之后，使用精确对变换 ((a,b)\mapsto(b-a,a)) 将当前功率除以 (\phi)。 这从指数 (k) 移动到指数 (k-1)。 
5. 当余数恰好变为 ((0,0)) 时停止。 有限表示性质保证贪婪过程达到零。 
6. 数字是从最大指数到最小指数收集的。 紧接着指数（0）之后将它们分开，从整数部分删除不必要的前导零，从小数部分删除不必要的尾随零，并且仅在保留小数位时才插入小数点。 

相邻的永远不会出现的原因直接源于贪婪的选择。 假设选择 (\phi^k)。 在选择它之前，余数小于 (\phi^{k+1})，因为 (k) 是最大可能的指数。 相减后，新的余数小于

 [
 \phi^{k+1}-\phi^k=\phi^{k-1}。 
]

 因此，不可能选择下一个位置(k-1)。 贪心过程自动满足无相邻规则。 

**为什么有效。** 在每次迭代中，余数 (r) 正是所有尚未选择的数字所表示的值。 该算法选择不超过 (r) 的最大幂，这正是规范贪婪表示的定义选择。 减去该幂可以保留不变量，并且恒等式 (\phi^{k+1}-\phi^k=\phi^{k-1}) 证明两个连续选定的位置是不可能的。 当余数达到零时，所选幂的总和恰好等于原始值 (n)，并且规范表示的唯一性意味着生成的数字序列就是所需的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def mul_phi(p):
    a, b = p
    return (b, a + b)

def div_phi(p):
    a, b = p
    return (b - a, a)

def nonnegative(a, b):
    """
    Return whether a + b*phi >= 0 exactly.

    a + b*phi = (2*a + b + b*sqrt(5)) / 2.
    """
    c = 2 * a + b

    if c == 0:
        return b >= 0

    if b > 0 and c > 0:
        return True

    if b < 0 and c < 0:
        return False

    if c > 0:
        return c * c >= 5 * b * b

    return 5 * b * b >= c * c

def geq(x, y):
    """
    Return whether x >= y for two numbers represented as
    (a, b) = a + b*phi.
    """
    a = x[0] - y[0]
    b = x[1] - y[1]
    return nonnegative(a, b)

def solve_one(n):
    # Find the largest non-negative exponent whose power does not exceed n.
    power = (1, 0)  # phi^0
    k = 0

    while True:
        nxt = mul_phi(power)
        if not geq((n, 0), nxt):
            break
        power = nxt
        k += 1

    max_k = k
    remainder = (n, 0)
    digits = []

    # Greedily process phi^k, phi^(k-1), ...
    while remainder != (0, 0):
        if geq(remainder, power):
            digits.append('1')
            remainder = (
                remainder[0] - power[0],
                remainder[1] - power[1]
            )
        else:
            digits.append('0')

        power = div_phi(power)
        k -= 1

    s = ''.join(digits)

    # The digit corresponding to phi^0 is at index max_k.
    split = max_k + 1
    left = s[:split].lstrip('0')
    right = s[split:].rstrip('0')

    if not left:
        left = '0'

    if right:
        return left + '.' + right

    return left

def main():
    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())
        out.append(solve_one(n))

    sys.stdout.write('\n'.join(out))

if __name__ == "__main__":
    main()
```这`mul_phi`功能实现

 [
 (a+b\phi)\phi=b+(a+b)\phi,
 ]

 所以它向右移动一位指数。 这`div_phi`函数实现 (\phi^{-1}=\phi-1) 的乘法，向左移动一个指数。 

这`nonnegative`功能是关键的精度细节。 它从不将 (\phi) 转换为浮点数。 对于 (a+b\phi)，乘以 (2) 得到 (2a+b+b\sqrt5)。 如果两个无理分量具有相同的符号，则答案是立即的。 如果它们的符号不同，则对两个正数进行平方可得出 (c^2) 和 (5b^2) 之间的精确比较。 

第一个循环找到最大的可用非负指数。 然后第二个循环从该指数向下执行贪婪构造。 循环允许传递负指数，这是必要的，因为 (2) 和 (123) 等整数需要小数位置。 

输出格式使用`max_k + 1`作为分割位置，因为指数 (0) 处的数字恰好是整数部分的最后一位。 最高有效位 (1) 之前的前导零和最低有效位 (1) 之后的尾随零将被删除。 仅当存在非空小数部分时才打印小数点。 

Python 整数具有任意精度，因此即使幂系数像斐波那契数一样增长，也不存在整数溢出问题。 

## 工作示例

 对于样本值（n=2），不超过（2）的最大幂为（\phi^1）。 然后贪心过程达到精确表示（\phi+\phi^{-2}）。 

| 指数 (k) | 当前功率| 步骤前的余数 | 行动| 步骤后的余数 |
 | ---| ---| ---| ---| ---|
 | (1) | (\phi) | (2) | 选择 (1) | (2-\phi) |
 | (0) | (1) | (2-\phi) | 选择 (0) | (2-\phi) |
 | (-1) | (\phi^{-1}) | (2-\phi) | 选择 (0) | (2-\phi) |
 | (-2) | (\phi^{-2}) | (2-\phi) | 选择 (1) | (0) |

 由于 (\phi^{-2}=2-\phi)，最后的数字是`10.01`。 该迹线还显示了为什么小数部分不能简单地像普通小数一样对待。 

对于构建的第二个示例（n=5），最大可用功率为（\phi^3）。 精确余数逐渐变得足够小，以至于最终用负幂进行校正。 

| 指数 (k) | 当前功率| 步骤前的余数 | 行动| 步骤后的余数 |
 | ---| ---| ---| ---| ---|
 | (3) | (1+2\phi) | (5) | 选择 (1) | (4-2\phi) |
 | (2) | (1+\phi) | (4-2\phi) | 选择 (0) | (4-2\phi) |
 | (1) | (\phi) | (4-2\phi) | 选择 (0) | (4-2\phi) |
 | (0) | (1) | (4-2\phi) | 选择 (0) | (4-2\phi) |
 | (-1) | (-1+\phi) | (4-2\phi) | 选择 (1) | (5-3\phi) |
 | (-2) | (2-\phi) | (5-3\phi) | 选择 (0) | (5-3\phi) |
 | (-3) | (-3+2\phi) | (5-3\phi) | 选择 (0) | (5-3\phi) |
 | (-4) | (5-3\phi) | (5-3\phi) | 选择 (1) | (0) |

 得到的表示是`1000.1001`。 精确的对表示使得最终的减法等于零，而不仅仅是接近于零。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(\log n)) | 贪婪扫描处理与表示长度成比例的幂数，表示长度随 (n) 对数增长。 |
 | 空间| (O(\log n)) | 输出数字和精确的代数系数都只需要每个处理的指数一个条目。 |

 对于(n\le100000)，处理的位置数量只有几十个。 最多十个测试用例，与一秒的时间限制相比，总算术量很小，并且与 256 MB 相比，内存使用量可以忽略不计。 

## 测试用例```python
# helper: run the solution on an input string
import sys
import io

def mul_phi(p):
    a, b = p
    return (b, a + b)

def div_phi(p):
    a, b = p
    return (b - a, a)

def nonnegative(a, b):
    c = 2 * a + b

    if c == 0:
        return b >= 0

    if b > 0 and c > 0:
        return True

    if b < 0 and c < 0:
        return False

    if c > 0:
        return c * c >= 5 * b * b

    return 5 * b * b >= c * c

def geq(x, y):
    a = x[0] - y[0]
    b = x[1] - y[1]
    return nonnegative(a, b)

def solve_one(n):
    power = (1, 0)
    k = 0

    while True:
        nxt = mul_phi(power)
        if not geq((n, 0), nxt):
            break
        power = nxt
        k += 1

    max_k = k
    remainder = (n, 0)
    digits = []

    while remainder != (0, 0):
        if geq(remainder, power):
            digits.append('1')
            remainder = (
                remainder[0] - power[0],
                remainder[1] - power[1]
            )
        else:
            digits.append('0')

        power = div_phi(power)
        k -= 1

    s = ''.join(digits)
    split = max_k + 1

    left = s[:split].lstrip('0')
    right = s[split:].rstrip('0')

    if not left:
        left = '0'

    return left + ('.' + right if right else '')

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    t = int(input())
    ans = [solve_one(int(input())) for _ in range(t)]

    sys.stdin = old_stdin
    return '\n'.join(ans)

# Provided sample
assert run(
    """5
1
2
3
100000
123
"""
) == (
    """1
10.01
100.01
101010001010100000100000.101000101000000010000001
10000000000.0000000001"""
), "sample 1"

# Minimum value and repeated equal values
assert run(
    """4
1
1
1
1
"""
) == (
    """1
1
1
1"""
), "minimum and repeated values"

# First values that require fractional powers
assert run(
    """2
2
3
"""
) == (
    """10.01
100.01"""
), "negative exponent boundary"

# Values with several separated one digits
assert run(
    """2
5
18
"""
) == (
    """1000.1001
1000000.000001"""
), "multiple separated digits"

# Maximum input value
assert run(
    """1
100000
"""
) == (
    """101010001010100000100000.101000101000000010000001"""
), "maximum n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1, 1, 1, 1`|`1, 1, 1, 1`| 最小值和重复相等输入 |
 |`2, 3`|`10.01, 100.01`| 第一种需要负指数的情况 |
 |`5, 18`|`1000.1001, 1000000.000001`| 几个分离的选定权力|
 |`100000`|`101010001010100000100000.101000101000000010000001`| 最大允许输入和长小数输出 |

 ## 边缘情况

 对于（n=1），最大可用功率为（\phi^0=1）。 第一个贪心步骤正好减去 (1)，留下对 ((0,0))。 数字序列仅包含`1`，所以格式化程序打印`1`没有小数点。 

对于 (n=2)，算法首先选择 (\phi^1)，留下 (2-\phi)。 接下来的两个幂 (1) 和 (\phi^{-1}) 都太大了。 在指数 (-2) 处，幂正好是 (2-\phi)，因此余数为零。 输出是`10.01`。 这个例子说明了为什么负指数是必要的。 

对于（n=3），第一个选择的幂是（\phi^2=1+\phi）。 余数为 (2-\phi=\phi^{-2})，因此输出为`100.01`。 贪心选择还证明了邻接不变量，因为选择指数 (2) 使得指数 (1) 不可能。 

对于 (n=5)，所选指数为 (3,-1,-4)。 对应的值为

 [
 \phi^3+\phi^{-1}+\phi^{-4}=5,
 ]

 所以输出是`1000.1001`。 两个选定的负数位置由两个零分隔，表明无相邻一规则适用于小数点，就像适用于整数一侧一样。 

对于 (n=123)，答案是`10000000000.0000000001`。 这意味着

 [
 123=\phi^{10}+\phi^{-10}。 
]

 这两个代数项各自都是无理数，但它们的 (\phi) 系数完全抵消。 整数对表示处理这种取消，而不依赖于浮点精度。 

对于 (n=100000)，算法仅对几十个位置继续相同的过程，并精确地达到零。 长答案并不意味着算法昂贵，因为工作量与位数而不是数值（100000）成正比。
