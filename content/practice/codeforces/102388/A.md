---
title: "CF 102388A - 奇怪的基地"
description: "我们需要打印正整数 (n) 的唯一基数 (phi) 表示，其中 (phi=(1+sqrt5)/2)。 一个数字可以是 (0) 或 (1)，并且两个相邻位置不能同时包含 (1)。"
date: "2026-08-14T13:47:21+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102388
codeforces_index: "A"
codeforces_contest_name: "SUFE ICPC Team Formation Test"
rating: 0
weight: 102388
solve_time_s: 242
verified: false
draft: false
---

[CF 102388A - 奇怪的基地](https://codeforces.com/problemset/problem/102388/A)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 2s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们需要打印正整数 (n) 的唯一基数 (\phi) 表示，其中 (\phi=(1+\sqrt5)/2)。 一个数字可以是 (0) 或 (1)，并且两个相邻位置不能同时包含 (1)。 与普通位置系统不同，允许使用负指数的幂，因此小数点后可能有几位数字。 

例如，(2) 不能仅使用非负幂来表示。 最大可用幂为 (\phi)，但 (\phi) 小于 (2)，精确修正为 (\phi^{-2})：

 [
 2=\phi+\phi^{-2},
 ]

 所以答案是`10.01`。 

最大的输入只有(10^5)，最多有(10)个测试用例。 这排除了枚举大量可能的数字字符串的算法。 有用的表示仅具有 (O(\log n)) 相关位置，因此处理每个可能的指数一次的算法对于一秒的限制来说很容易足够快。 

简单的实现可能会错误地处理三种边缘情况。 对于 (n=1)，答案很简单`1`，没有小数部分。 始终打印小数点的实现将产生不同的字符串。 对于 (n=2)，答案是`10.01`，因此将搜索限制为非负幂是行不通的。 对于 (n=3)，答案是`100.01`，并且小数位也是必需的。 最后，浮点减法可能会在真实余数为零后留下微小的非零余数，从而导致粗心的实现发出虚假的尾随数字。 

最后一个问题在这里特别重要，因为 (\phi) 是无理数。 我们将完全避免浮点运算。 

## 方法

 暴力方法可以枚举满足无相邻条件的每个二进制数字字符串，评估其值，并查找表示 (n) 的字符串。 这是正确的，因为问题保证了所需的表示存在并且是唯一的。 问题在于候选人的数量。 (n\le100000) 的最大正指数是 (25)，而所需的小数部分可以扩展到大约 (26) 个位置，大致给出 (50) 个相关位置。 即使在考虑固定的前导和尾随数字之前，长度为 (50) 且没有相邻数字的二进制串的数量也是 (F_{52}=32,951,280,099)。 评估这些候选人远远超出了时间限制。 

有用的观察是，尽管基数是非理性的，但这种表示形式具有与普通位置系统相同的贪婪结构。 假设当前的正余数为(r)，选择满足的最大指数(k)

 [
 \phi^k\le r。 
]

 减去 (\phi^k) 后，新的余数满足

 [
 r-\phi^k<\phi^{k+1}-\phi^k=\phi^{k-1}。 
]

 因此，位置 (k-1) 处的下一个数字必须为零。 这正是规范表示所要求的限制。 我们可以继续取拟合的最大幂，直到余数变为零。 

暴力破解之所以有效，是因为它会搜索所有可能的有效数字字符串。 它失败了，因为它们的数量呈指数级增长。 贪心观察让我们对每个指数做出单一决策，将问题减少到 (O(\log n)) 个位置。 

剩下的难点就是比较。 我们不能安全地将 (\phi^k) 存储为浮点数并重复减去它，因为最终余数可能非常小。 相反，(\phi) 的每一次幂都可以完全写成

 [
 \phi^k=a+b\phi
 ]

 对于整数 (a,b)。 身份

 [
 \phi^2=\phi+1
 ]

 让我们准确地更新这些整数对。 我们还可以仅使用整数运算来比较两个这样的表达式，因为 (a+b\phi) 的符号可以通过替换 (\phi=(1+\sqrt5)/2) 后比较整数来确定。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数，(L) 位置的 (\Theta(F_L)) 候选者 | (O(L)) | 太慢了 |
 | 最优贪心| (O(\log n)) 指数位置 | (O(\log n)) | 已接受 |

 ## 算法演练

 1. 将 (\phi) 的每一次幂表示为整数对 ((a,b))，即 (a+b\phi)。 从 (\phi^0=1) 开始，用 ((1,0)) 表示。 (a+b\phi) 乘以 (\phi) 得出
 [
 (a+b\phi)\phi=b+(a+b)\phi,
 ]
 因此增加指数将 ((a,b)) 变为 ((b,a+b))。 

对于负幂，除以 (\phi)。 由于 (\phi^{-1}=\phi-1)，乘以 (\phi^{-1}) 将 ((a,b)) 变为 ((b-a,a))。 因此，仅使用整数即可生成所有所需的幂。 
2. 找到 (\phi^q\le n) 的最大指数 (q)。 由于 (n\le100000)，(q) 至多为 (25)。 贪婪表示必须从这个位置开始，因为使用任何更大的幂都已经超过了数字。 
3. 将当前余数设置为 (n)，由 ((n,0)) 对表示。 然后从 (q) 向下检查指数。 
4. 在指数 (k) 处，测试当前余数是否至少为 (\phi^k)。 如果是，则将数字（1）放在位置（k）处，并从余数中减去相应的对。 否则输入数字 (0)。

选择最大的拟合幂就是贪心决策。 如果(\phi^k\le r<\phi^{k+1})，则减法后新的余数小于(\phi^{k-1})，因此不能选择紧随其后的位置。 
5. 继续计算负指数，直到余数正好为零对。 对于 (n\le100000)，下降到指数 (-30) 就足够了。 短界解释了原因。 如果最小小数指数为 (-m)，则其小数尾部为正且小于
 [
 \phi^{-m}+\phi^{-m-2}+\phi^{-m-4}+\cdots=\phi^{1-m}。 
]
 尾部是一个非零代数整数 (A+B\phi)，因此它的范数 (A^2+AB-B^2) 是一个非零整数。 其共轭体的绝对值小于(n+3<100003)，因此尾部大于(1/100003)。 如果(m\ge27)，则(\phi^{1-m}=\phi^{-26}<1/100003)，矛盾。 因此指数（-26）已经足够了。 
6. 将选定的数字转换为字符串。 从 (q) 到 (0) 的位置形成整数部分。 如果使用负数位置，则在位置 (0) 之后放置小数点，然后追加位置 (-1,-2,\ldots,p)。 省略前导和尾随不必要的零。 

**为什么它有效。** 在每次迭代中，余数正是答案中仍然缺少的值。 当 (\phi^k) 不超过该余数时，我们精确地选择它，因此新的余数仍然是非负的。 由于前一个余数小于 (\phi^{k+1})，因此减去 (\phi^k) 后将小于 (\phi^{k-1})，从而禁止选择下一个指数。 因此，每个生成的数字都是有效的，并且没有相邻的数字是 (1)。 当余数达到零时，所选幂的总和正好等于 (n)。 该问题指出，具有这些限制的有效表示是唯一的，因此贪婪表示是必需的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MIN_K = -30
MAX_K = 30

def nonnegative(a, b):
    """Return whether a + b*phi >= 0, using integer arithmetic only."""
    if b == 0:
        return a >= 0

    if b > 0:
        if a >= 0:
            return True

        # a + b*phi >= 0
        # b*sqrt(5) >= -2*a - b
        c = -a
        d = 2 * c - b

        if d <= 0:
            return True

        return 5 * b * b >= d * d

    # b < 0
    c = -b

    if a < 0:
        return False

    # a >= c*phi
    # 2*a - c >= c*sqrt(5)
    d = 2 * a - c

    if d < 0:
        return False

    return d * d >= 5 * c * c

def build_powers():
    powers = {0: (1, 0)}

    # Positive exponents.
    a, b = 1, 0
    for k in range(1, MAX_K + 1):
        a, b = b, a + b
        powers[k] = (a, b)

    # Negative exponents.
    a, b = 1, 0
    for k in range(-1, MIN_K - 1, -1):
        a, b = b - a, a
        powers[k] = (a, b)

    return powers

powers = build_powers()

def encode(n):
    # Find the largest q with phi^q <= n.
    q = 0
    for k in range(MAX_K, -1, -1):
        a, b = powers[k]
        if nonnegative(n - a, -b):
            q = k
            break

    rem_a, rem_b = n, 0
    digits = {}

    for k in range(q, MIN_K - 1, -1):
        a, b = powers[k]

        if nonnegative(rem_a - a, rem_b - b):
            digits[k] = '1'
            rem_a -= a
            rem_b -= b

            if rem_a == 0 and rem_b == 0:
                last = k
                break
        else:
            digits[k] = '0'
    else:
        raise AssertionError("The guaranteed finite representation was not found")

    if last >= 0:
        left = ''.join(digits[k] for k in range(q, 0, -1))
        left += digits[0]

        if last >= 0:
            return left

    left = ''.join(digits[k] for k in range(q, -1, -1))
    right = ''.join(digits[k] for k in range(-1, last - 1, -1))

    return left + '.' + right

def main():
    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())
        out.append(encode(n))

    sys.stdout.write('\n'.join(out))

if __name__ == "__main__":
    main()
```这`powers`字典存储精确的代数值。 例如，指数 (2) 为`(1, 1)`因为 (\phi^2=1+\phi)，而指数 (-2) 是`(2, -1)`因为 (\phi^{-2}=2-\phi)。 

这`nonnegative`函数是关键的数字细节。 对于 (a+b\phi)，写

 [
 2(a+b\phi)=(2a+b)+b\sqrt5。 
]

 如果这两个项已经具有相同的符号，则立即得到答案。 否则，两边都是非负的，我们可以将它们平方，用涉及 (5b^2) 的整数比较替换无理比较。 转换过程中没有任何地方进行舍入。 

正负发电使用从(\phi^2=\phi+1)导出的两个变换。 Python 整数具有任意精度，因此不存在溢出问题。 

循环向下，因为贪心规则首先需要最大的可用指数。 一旦选择了功率，在考虑下一个位置之前立即更新余数。 这种顺序赋予了不相邻属性。 

格式化代码将指数 (0) 视为小数点前的最后一位数字。 如果表示形式没有负指数，则不会打印小数点，从而正确处理 (n=1)。 

## 工作示例

 ### 示例 1：(n=2)

 不超过(2)的最大幂为(\phi^1)。 相关的精确值为 (\phi^1=\phi)、(\phi^0=1)、(\phi^{-1}=\phi-1) 和 (\phi^{-2}=2-\phi)。 

| 指数 (k) | 当前剩余| 比较 | 数字| 新余数 |
 | --- | --- | --- | --- | --- |
 | 1 | (2) | (2\ge\phi) | 1 | (2-\phi=\phi^{-2}) |
 | 0 | (2-\phi) | (2-\phi<1) | 0 | (2-\phi) |
 | -1 | (2-\phi) | (2-\phi<\phi^{-1}) | 0 | (2-\phi) |
 | -2 | (2-\phi) | (2-\phi=\phi^{-2}) | 1 | (0) |

 数字是`10.01`。 该迹线说明了为什么即使对于小整数也需要分数幂。 它还显示了精确算术的优点：最后减法之后，余数实际上就是整数对`(0, 0)`，不是零的浮点近似值。 

### 示例 2：(n=4)

 最大可用功率为 (\phi^2)，因为 (\phi^2=1+\phi<4) 而 (\phi^3>4)。 

| 指数 (k) | 当前剩余| 比较 | 数字| 新余数 |
 | --- | --- | --- | --- | --- |
 | 2 | (4) | (4\ge\phi^2) | 1 | (4-\phi^2=3-\phi) |
 | 1 | (3-\phi) | (3-\phi<\phi) | 0 | (3-\phi) |
 | 0 | (3-\phi) | (3-\phi\ge1) | 1 | (2-\phi=\phi^{-2}) |
 | -1 | (2-\phi) | (2-\phi<\phi^{-1}) | 0 | (2-\phi) |
 | -2 | (2-\phi) | (2-\phi=\phi^{-2}) | 1 | (0) |

 得到的表示是`101.01`。 选择指数 (2) 后，下一个指数 (1) 自动不可能。 选择指数(0)后，指数(-1)再次不可能。 这是直接出现在迹线中的贪婪不变量。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(\log n)) | 有 (O(\log n)) 个相关的正负指数位置，每个位置都被处理一次。 |
 | 空间| (O(\log n)) | 功率表和数字数组仅包含 (O(\log n)) 个条目。 |

 对于(n\le100000)，最大正指数仅为(25)，小数部分需要少于(30)个位置。 对于最多 (10) 个测试用例，该算法仅对每个输入文件执行几百次整数运算。 它完全符合 1 秒时间限制和 256 MB 内存限制。 

## 测试用例```python
import sys
import io

MIN_K = -30
MAX_K = 30

def nonnegative(a, b):
    if b == 0:
        return a >= 0

    if b > 0:
        if a >= 0:
            return True

        c = -a
        d = 2 * c - b

        if d <= 0:
            return True

        return 5 * b * b >= d * d

    c = -b

    if a < 0:
        return False

    d = 2 * a - c

    if d < 0:
        return False

    return d * d >= 5 * c * c

def build_powers():
    powers = {0: (1, 0)}

    a, b = 1, 0
    for k in range(1, MAX_K + 1):
        a, b = b, a + b
        powers[k] = (a, b)

    a, b = 1, 0
    for k in range(-1, MIN_K - 1, -1):
        a, b = b - a, a
        powers[k] = (a, b)

    return powers

powers = build_powers()

def encode(n):
    q = 0

    for k in range(MAX_K, -1, -1):
        a, b = powers[k]
        if nonnegative(n - a, -b):
            q = k
            break

    rem_a, rem_b = n, 0
    digits = {}

    for k in range(q, MIN_K - 1, -1):
        a, b = powers[k]

        if nonnegative(rem_a - a, rem_b - b):
            digits[k] = '1'
            rem_a -= a
            rem_b -= b

            if rem_a == 0 and rem_b == 0:
                last = k
                break
        else:
            digits[k] = '0'
    else:
        raise AssertionError("representation did not terminate")

    left = ''.join(digits[k] for k in range(q, -1, -1))

    if last >= 0:
        return left

    right = ''.join(digits[k] for k in range(-1, last - 1, -1))
    return left + '.' + right

def solve_data(inp):
    data = list(map(int, inp.split()))
    t = data[0]

    ans = []
    for i in range(1, t + 1):
        ans.append(encode(data[i]))

    return '\n'.join(ans) + '\n'

def run(inp: str) -> str:
    return solve_data(inp)

sample = """\
5
1
2
3
100000
123
"""

expected_sample = """\
1
10.01
100.01
101010001010100000100000.101000101000000010000001
10000000000.0000000001
"""

assert run(sample) == expected_sample, "sample"

assert run("""\
1
1
""") == "1\n", "minimum input"

assert run("""\
3
2
3
4
""") == """\
10.01
100.01
101.01
""", "small boundary cases"

assert run("""\
3
5
5
5
""") == """\
1000.1001
1000.1001
1000.1001
""", "repeated equal values"

assert run("""\
1
100000
""") == "101010001010100000100000.101000101000000010000001\n", "maximum input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1`|`1`| 最少输入和省略不必要的小数点 |
 |`2`,`3`,`4`|`10.01`,`100.01`,`101.01`| 分数权力和贪婪边界决策 |
 |`5`,`5`,`5`|`1000.1001`三次| 具有相同值的多个测试用例 |
 |`100000`|`101010001010100000100000.101000101000000010000001`| 最大输入及全范围正负位置|

 ## 边缘情况

 对于 (n=1)，输入为```
1
```最大可用功率为(\phi^0=1)。 第一个贪心步骤选择它，使精确余数为零。 没有访问负指数，因此输出很简单`1`。 盲目插入的格式化程序`.`会错误地产生诸如`1.`。 

对于 (n=2)，输入为```
2
```第一个选定的幂是 (\phi^1)，剩下 (2-\phi=\phi^{-2})。 (\phi^0) 和 (\phi^{-1}) 都不适合，而 (\phi^{-2}) 完全适合。 数字是`10.01`。 这捕获了假设每个​​整数都有仅使用非负幂的表示的实现。 

对于 (n=3)，输入为```
3
```第一个选择的幂是(\phi^2)，留下(3-\phi^2=2-\phi=\phi^{-2})。 因此结果是`100.01`。 出现与 (2) 相同的小数校正，但整数部分向左移动了一位。 这是对小数点周围指数索引的有用检查。 

对于 (n=4)，输入为```
4
```贪婪的选择是（\phi^2），然后（1），然后（\phi^{-2}）。 幂 (\phi^1) 和 (\phi^{-1}) 被拒绝，因为它们将超过当前余数。 结果是`101.01`。 这种情况在贪婪比较中捕获了一个相差一的错误，并验证所选数字永远不会变得相邻。 

对于 (n=100000)，表示同时达到许多正位置和许多负位置。 精确的对算术继续工作，无需对微小的分数幂进行任何特殊处理。 余数最终变成精确的`(0, 0)`，在不依赖 epsilon 或浮点舍入的情况下生成示例输出。
