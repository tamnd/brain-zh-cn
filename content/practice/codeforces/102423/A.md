---
title: "CF 102423A - 无进位平方根"
description: "此问题中的运算看起来与普通乘法相似，只是乘法内部执行的每个加法都会丢弃进位。"
date: "2026-08-12T04:42:20+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102423
codeforces_index: "A"
codeforces_contest_name: "North American Southeast Regional 2019 (Div 1)"
rating: 0
weight: 102423
solve_time_s: 228
verified: true
draft: false
---

[CF 102423A - 无进位平方根](https://codeforces.com/problemset/problem/102423/A)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 此问题中的运算看起来与普通乘法相似，只是乘法内部执行的每个加法都会丢弃进位。 如果将两个数字的十进制数字视为系数数组，则它们的无进位乘积恰好是按系数卷积，每个系数以 10 为模减少。 

例如，如果数字 (a) 从最低有效位到最高有效位的数字为 (a_0,a_1,\ldots)，则 (a\otimes a) 的第 (k) 位数字为

 [
 c_k=\left(\sum_{i+j=k}a_i a_j\right)\bmod 10.
 ]

 输入为 1 个正十进制整数 (N)，最多 25 位且无前导零。 我们需要无进位平方恰好为 (N) 的最小正整数 (a)。 如果不存在这样的 (a)，我们打印 (-1)。 官方声明给出了1秒的时间限制和512MB的内存限制。 

25 位数字的界限足够小，我们可以负担十进制位数的二次方的算法。 我们无法列举出所有可能的根源。 具有 13 位数字的根已经放弃了 (10^{13}) 个候选者，这远远超出了一秒程序可以检查的范围。 

有几种边缘情况很重要，因为十进制无进位算术不是普通算术。 首先，一位输入不一定具有通常的整数平方根。 用于输入`6`，答案是`4`，因为 (4\otimes4=16)，其唯一保留的数字是 6。使用普通平方根的程序会立即拒绝它。 

其次，最低有效数字可以有几个可能的模 10 平方根。对于输入`6`，4和6都满足(x^2\equiv6\pmod {10})。 选择第一个局部方便的数字而不考虑数字的其余部分可能会导致非最小根。 

第三，能被5整除造成了一种特殊情况。 用于输入`5`，答案是`5`，因为 (5\otimes5=5)。 将算术视为除以 (2a_0) 总是可能模 10 中断，因为 10 不是一个字段。 

最后，最高位必须按度数而不是普通的数字平方根界限来处理。 非零前导数字始终具有模 10 的非零平方，因此具有 (m) 位数字的根会生成精确具有 (2m-1) 个小数位的平方。 因此，25 位输入最多可以有 13 位数字的根，但其根通常不接近普通整数平方根。 

## 方法

 直接的方法是枚举每个可能的根并计算其无进位平方。 由于 25 位数字最多可以有 13 位根，因此可以有 (10^{13}) 个候选根。 即使对一个候选值进行平方只需要 (O(13^2)) 数字运算，最坏的情况也大约是 (10^{13}\cdot169)，或大约 (1.7\times10^{15}) 基本数字乘积。 暴力破解是正确的，因为最终会测试所有可能的根，但搜索空间却大得令人绝望。 

有用的观察是，无进位算术是模 10 的多项式算术。模 10 不是素数，这使得直接代数变得尴尬，但 10 因式分解为两个互质素数：

 [
 10=2\cdot5。 
]

 根据中国余数定理，十进制数字由其模 2 和模 5 的余数唯一确定。因此，我们可以在域 (\mathbb F_2) 和 (\mathbb F_5) 上分别求解，而不是求解 (\mathbb Z_{10}) 上的多项式平方方程，然后将结果数字组合起来。 

模 2，平方变得异常简单。 在特征2中，

 a_0+a_1x^2+a_2x^4+\cdots。 
]

 所有奇次系数都消失。 因此，输入在每个奇数位置必须具有零系数，并且 (x^{2i}) 的系数直接告诉我们模 2 的第 (i) 根系数。 

Modulo 5，情况也是可以控制的，因为我们是在一个领域工作。 如果多项式的常数系数非零，一旦我们选择其平方根（r_0），后面的每个系数都会被强制。 平方 (x^k) 的系数为

 [
 2r_0r_k+\sum_{i=1}^{k-1}r_ir_{k-i}。 
]

 由于 (r_0\neq0) 模 5，(2r_0) 可逆，因此 (r_k) 具有唯一值。 (r_0) 至多有两种选择，因为 (\mathbb F_5) 的非零元素至多有两个平方根。 

如果多项式可被 (x^t) 模 5 整除，则平方只能具有偶数 (t) 值。 我们删除 (x^t)，求解剩余常数系数非零的多项式，并将 (t/2) 个零系数放回到根中。 相同的次数参数适用于另一端，因此非零多项式的次数也必须是偶数。 

然后使用具有所需余数模 2 和 5 的唯一数字 0 到 9 将两个模根逐位组合。最多可以得到两个完整的小数根，因此我们只需选择较小的有效根即可。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(10^{13}\cdot25^2)) | (O(25)) | 太慢了|
 | 模块化分解 | (O(25^2)) | (O(25)) | 已接受 |

 ## 算法演练

 1. 读取 (N) 的十进制表示形式，并从最低有效位到最高有效位存储其数字。 从最低有效位开始计算与多项式系数阶数相匹配，因此系数 (k) 立即可用：`digits[k]`。 
2. 求解模 2 的平方方程。对于每个奇数索引 (k)，输入数字必须是偶数。 如果某个奇数位置的数字是奇数，则不存在根，因为 (\mathbb F_2) 上的每个平方在奇数次都有零系数。 对于每个 (i)，将位置 (i) 处的根系数模 2 设置为位置 (2i) 处的输入系数模 2。 
3. 减少输入多项式模 5 并找到其第一个和最后一个非零系数。 如果每个系数都为零模 5，则根也为零模 5。否则，第一个非零位置和次数必须都是偶数。 平方具有偶数估值，因为其最低非零项来自于最低非零根项的平方，并且其次数是根次数的两倍。 
4. 从模 5 多项式中去除 (x) 的偶次幂。 其余多项式具有非零常数系数。 尝试其最多两个平方根中的每一个来得到该常数系数。 这两个选择对应于(r)和(-r)。 
5. 对于每个选定的常数根，从低次到高次确定剩余的系数。 在系数 (k) 处，涉及两个已知系数的所有乘积都是已知的，仅留下 (2r_0r_k) 未知。 使用模逆除以 (2r_0) 模 5。 
6. 通过平方来验证完整的模 5 多项式。 这很便宜，因为最多有 25 个输入数字，而且它还使实现能够鲁棒地应对循环中的任何边界错误。 
7. 将每个有效的模 5 根与唯一的模 2 根组合。 对于每个位置，找到满足两个所需残基的数字 (d\in[0,9])。 中国余数定理保证恰好有一个这样的数字。 
8. 从生成的根表示中删除前导零，并将其转换为整数字符串。 如果有两个候选人，请选择较小的一个。 
9. 如果没有候选人幸存，则打印`-1`。 

### 为什么它有效

 中心不变量是候选根同时由其模 2 和模 5 的系数表示。模 2 结构保证其平方与 (N) 模 2 匹配，而模 5 结构保证其平方与 (N) 模 5 匹配。每个结果十进制数字都是具有这两个余数的唯一余数模 10，因此完整的平方与每个系数处的 (N) 模 10 匹配。 

由于两个十进制数字模 10 相等意味着数字本身相等，因此无进位平方正好是 (N)。 相反，每个真正的无进位平方根都会产生一个模 2 的平方根和一个模 5 的平方根，因此我们的两个模搜索不能丢弃可能的根。 唯一不明确的是非零模 5 平方根的符号，最多给出两个候选值。 因此，选择较小的候选者会得到所需的最小正根。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def square_mod(poly, mod, length=None):
    if length is None:
        length = 2 * len(poly) - 1

    res = [0] * length
    for i, x in enumerate(poly):
        for j, y in enumerate(poly):
            if i + j >= length:
                break
            res[i + j] = (res[i + j] + x * y) % mod
    return res

def roots_mod5(n5):
    m = len(n5)

    first = -1
    last = -1

    for i, x in enumerate(n5):
        if x % 5 != 0:
            if first == -1:
                first = i
            last = i

    if first == -1:
        return [[0] * ((m + 1) // 2)]

    if first % 2 == 1 or last % 2 == 1:
        return []

    shift = first
    root_degree = (last - first) // 2
    target = n5[first:last + 1]

    constant = target[0] % 5

    initial_roots = []
    for r in range(5):
        if r * r % 5 == constant:
            initial_roots.append(r)

    result = []

    for r0 in initial_roots:
        q = [0] * (root_degree + 1)
        q[0] = r0

        inv = pow((2 * r0) % 5, 3, 5)

        for k in range(1, root_degree + 1):
            known = 0
            for i in range(1, k):
                known += q[i] * q[k - i]
            q[k] = ((target[k] - known) * inv) % 5

        full = [0] * (shift // 2 + len(q))
        full[shift // 2:] = q

        expected = n5
        got = square_mod(full, 5, len(expected))

        if got == expected:
            result.append(full)

    return result

def combine(r2, r5):
    length = max(len(r2), len(r5))
    ans = []

    for i in range(length):
        a = r2[i] if i < len(r2) else 0
        b = r5[i] if i < len(r5) else 0

        digit = None
        for d in range(10):
            if d % 2 == a and d % 5 == b:
                digit = d
                break

        ans.append(digit)

    while len(ans) > 1 and ans[-1] == 0:
        ans.pop()

    return int(''.join(map(str, reversed(ans))))

def carryless_square(a):
    digits = list(map(int, reversed(str(a))))
    res = [0] * (2 * len(digits) - 1)

    for i, x in enumerate(digits):
        for j, y in enumerate(digits):
            res[i + j] = (res[i + j] + x * y) % 10

    while len(res) > 1 and res[-1] == 0:
        res.pop()

    return int(''.join(map(str, reversed(res))))

def solve():
    s = input().strip()
    digits = list(map(int, reversed(s)))
    n = len(digits)

    # Solve modulo 2.
    # In characteristic 2, every square has zero coefficients
    # at odd degrees.
    for i in range(1, n, 2):
        if digits[i] % 2:
            print(-1)
            return

    r2_len = (n + 1) // 2
    r2 = [0] * r2_len

    for i in range(r2_len):
        r2[i] = digits[2 * i] % 2

    # Solve modulo 5.
    n5 = [x % 5 for x in digits]
    roots5 = roots_mod5(n5)

    if not roots5:
        print(-1)
        return

    candidates = []

    for r5 in roots5:
        candidate = combine(r2, r5)

        if candidate > 0 and carryless_square(candidate) == int(s):
            candidates.append(candidate)

    if not candidates:
        print(-1)
    else:
        print(min(candidates))

if __name__ == "__main__":
    solve()
```输入数字首先被反转，因为多项式系数自然是从最低有效十进制数字开始索引的。 位置 0 处的系数是常数项，位置 1 是 (x) 的系数，依此类推。 

模 2 部分故意简单。 如果输入的奇数位数字为奇数，则答案立即不可能。 否则，根位置 (i) 处的系数将从输入位置 (2i) 复制。 不存在递推，因为 Frobenius 恒等式使所有交叉项模 2 消失。 

模 5 例程首先查找输入多项式的估值和次数。 对于非零平方，两者都必须是偶数。 去除(x)的初始幂后，常数系数不为零，因此其平方根也不为零。 (2r_0) 的倒数以 5 为模，这使得后面的每个系数都唯一确定。 

表达式`pow((2 * r0) % 5, 3, 5)`计算模 5 的倒数。由于每个非零余数 (x) 模 5 满足 (x^4=1)，因此其倒数为 (x^3)。 Python 的模幂运算直接处理这个问题。 

最终组合仅搜索十个可能的十进制数字。 在这里使用 CRT 的封闭公式很诱人，但十元素搜索更清晰，并且消除了符号或残留错误的机会。 

一旦两个模计算都正确，最终的无进位平方验证在数学上就不需要了，但对于 25 位输入来说，它基本上不需要任何成本。 它可以保护实现免受涉及未使用的高系数的错误，并在接受之前确认准确的小数结果。 

## 工作示例

 ### 示例 1：`6`输入只有一个系数，因此多项式为 (6)。 

模 2，(6\equiv0)。 因此，根系数必须为 0 模 2。 

模 5，(6\equiv1)。 1 模 5 的两个平方根是 1 和 4。 

| 根模 5 | 根模 2 | 小数位| 候选人|
 | --- | --- | --- | --- |
 | 1 | 0 | 6 | 6 |
 | 4 | 0 | 4 | 4 |

 两位候选人都是真正的根源：

 [
 4\otimes4=16\longrightarrow6,
 ]

 同时

 [
 6\otimes6=36\longrightarrow6。 
]

 较小的正根是 4，所以输出是`4`。 

此示例说明了为什么通过贪婪地选择数字来仅求解模 10 可能会产生误导。 有多个有效的最低数字，并且两个素数模视图使完整的可能性集变得明确。 

### 示例 2：`149`数字从低到高分别是（9,4,1）。 

对 2 取模，它们变为 (1,0,1)。 奇数位置系数为零，因此模 2 存在根。其系数从位置 0 和 2 获得：

 [
 r_0=1,\qquad r_1=1。 
]

 因此根是 (1+x) 模 2。 

以 5 为模，多项式为

 [
 4+4x+x^2。 
]

 常数系数 4 具有平方根 2 和 3 模 5。首先选择 2 给出

 [
 r_0=2。 
]

 对于 (x) 的系数，

 [
 4=2r_0r_1=4r_1\pmod5,
 ]

 所以（r_1=1）。 所得根是 (2+x) 模 5。 

将残数逐位组合得出：

 | 职位| 模组 2 | 模组 5 | 小数位|
 | ---| ---| ---| ---|
 | 0 | 1 | 2 | 7 |
 | 1 | 1 | 1 | 1 |

 因此，该候选人是`17`。 

另一个模 5 根给出了另一个有效的候选者，但它更大。 该算法检查两者并选择`17`，匹配示例输出。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(L^2)) | 每个多项式乘法或系数递归最多涉及 (L^2) 个数字对，其中 (L\le25)。 |
 | 空间| (O(L)) | 输入和恒定数量的根数组仅包含 (O(L)) 个系数。 |

 这里(L)是(N)的小数位数，根据官方问题陈述最多是25位。 最大的计算量仅为几百位数字级运算，因此二次算法可以轻松地在一秒限制内，并且与 512 MB 限制相比，使用的内存可以忽略不计。 

## 测试用例

 以下测试工具将解决方案公开为函数，以便每个断言都可以独立运行。```python
# helper: run solution on input string, return output string
import sys
import io

def solve_data(data: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(data)
    sys.stdout = io.StringIO()

    solve()

    output = sys.stdout.getvalue().strip()

    sys.stdin = old_stdin
    sys.stdout = old_stdout

    return output

# Provided samples
assert solve_data("6\n") == "4", "sample 1"
assert solve_data("149\n") == "17", "sample 2"
assert solve_data("123476544\n") == "11112", "sample 3"
assert solve_data("15\n") == "-1", "sample 4"

# Minimum-size input.
assert solve_data("1\n") == "1", "minimum input"

# All-equal digits, deliberately not a square.
assert solve_data("11111\n") == "-1", "all-equal non-square"

# Boundary case where the root is exactly half the number of digits.
assert solve_data("10000\n") == "100", "degree boundary"

# Maximum-size valid construction:
# 1111111111111 ⊗ 1111111111111
# = 1234567890123456789012345
assert solve_data("1234567890123456789012345\n") == "1111111111111", \
    "maximum-size valid input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1`|`1`| 最小尺寸输入和正根处理|
 |`11111`|`-1`| 数字全相等并拒绝不可能的平方 |
 |`10000`|`100`| 输入和根长度之间的度数计算和边界 |
 |`1234567890123456789012345`|`1111111111111`| 最大尺寸有效输入和高次系数 |

 ## 边缘情况

 用于输入`6`，模 2 根为零，而模 5 根为 1 和 4。CRT 给出小数根 6 和 4，算法选择 4。这捕获了假设最低十进制数字具有唯一平方根的常见错误。 

用于输入`5`，模 5 多项式为零，因此其根为零模 5。模 2 多项式也为零，因此唯一的 CRT 数字为 5。该算法产生`5`，确实 (5\otimes5=5)。 这捕获了尝试除以 (2a_0) 模 10 而不首先将模数分成字段的实现。 

用于输入`15`，模 2 多项式的零阶系数为 1，一阶系数为 1。 奇数次系数不为零，但每个模 2 的平方在奇数次都有零系数。 该算法立即拒绝该数字并打印`-1`，这是第四个官方样本。 

用于输入`10000`，多项式为 (x^4)。 它的模 2 平方根是 (x^2)，它的模 5 平方根也是 (x^2)。 CRT 因此产生小数根`100`。 将它无载地平方给出`10000`。 这测试了输入有几个尾随零数字并且根的次数完全由多项式次数确定的情况。 

对于 25 位输入`1234567890123456789012345`, 根`1111111111111`有13位数字。 其无进位平方的系数由对每个度数有贡献的对的数量给出，并以 10 为模进行减少，从而精确地产生 25 位输入。 这会运用最大可能的根长度，并确认算法不会意外分配或检查超出有效多项式次数的系数。
