---
title: "CF 102270C - 划分"
description: "我们需要计算区间 ([A,B]) 内满足三个独立约束条件的正整数 (N)。 首先，(N) 的每个十进制数字都必须属于提供的集合 (S)。 其次，(N) 必须能被 (X) 整除。"
date: "2026-08-19T05:01:19+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102270
codeforces_index: "C"
codeforces_contest_name: "HCW 19 Individual Day 2"
rating: 0
weight: 102270
solve_time_s: 619
verified: false
draft: false
---

[CF 102270C - 划分](https://codeforces.com/problemset/problem/102270/C)

 **评级：** -
 **标签：** -
 **求解时间：** 10m 19s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们需要计算区间 ([A,B]) 内满足三个独立约束条件的正整数 (N)。 

首先，(N) 的每个十进制数字都必须属于提供的集合 (S)。 其次，(N) 必须能被 (X) 整除。 第三，如果我们从右边对位置进行编号，则位置 (i) 处的数字必须与 (i) 互质。 换句话说，对于从右侧第 (i) 个位置的数字 (d_i)，我们需要 (\gcd(d_i,i)=1)。 答案是此类整数的数量，并以 (10^9+7) 为模进行缩减。 

官方限制允许(B)最多有101位小数，而(X)可以大到(10^5)。 这立即排除了枚举间隔。 即使存储或迭代所有数字也最多需要大约 (10^{100}) 个候选值。 我们需要一种算法，其成本取决于位数和 (X)，而不是 (B) 的数值大小。 

有一些边界情况很容易处理不当。 第一个是前导零。 零可能是内部位置的有效数字，但它不能是正整数的最高有效数字。 例如，使用输入```
1 9 1
0
```答案是`0`。 粗心的实施可能会考虑`0`视为有效的一位数字，或将其视为诸如`01`作为普通正整数。 

第二个问题是互质条件是从右边开始计算的，而不是从左边开始计算。 例如，`12`对于位置条件来说是有效的，因为它的最右边的数字是 (2) 和 (\gcd(2,1)=1)，而它的左边的数字是 (1) 和 (\gcd(1,2)=1)。 这就是为什么简单地对照从左到右表示中的索引检查数字会给出错误的结果。 

第三个问题是处理右边数字时的上限。 考虑`B = 20`和一位数`8`。 比较低位数字`8`与低位数字`0`进行减法`0 - 8`借用，但是`8`显然仍然小于`20`。 从右到左边界的 DP 必须记住，较短的数字会自动低于较长的正上限。 

## 方法

 直接的方法是枚举从 (A) 到 (B) 的每个整数。 对于每个候选者，我们将检查其数字，验证 (S) 中的成员资格，检查每个位置的互质条件，并测试可被 (X) 整除。 这是正确的，因为每个候选者都会被检查一次，并且每个必需的条件都会被明确检查。 

问题在于区间的大小。 当(B)有101位数字时，可以有(10^{100})个候选者。 即使检查一个候选者只需要 (O(100)) 次操作，最坏的情况也大约是 (O(100\cdot10^{100}))，这是完全不可行的。 

关键的观察结果是，除了整除性之外，限制都是数字本地的。 在位置 (i)，我们可以通过检查 (\gcd(d,i)=1) 立即确定哪些数字是合法的。 整除性也可以用余数模 (X) 表示。 这给出了一个数字 DP，其状态仅包含余数和少量有关与界限比较的信息。 

这里有一个特别有用的技巧。 位置条件是从右侧定义的，因此我们不是处理从左到右的界限，而是处理构造的数字和从右到左的界限。 然后可以通过从界限中减去构造的数字时产生的借位来表示比较。 

假设当前处理的边界的低(i)位是(B_{\text{low}})，构造的数字对应的位是(N_{\text{low}})。 我们维护减法 (B_{\text{low}}-N_{\text{low}}) 是否需要借位到下一个位置。 这将通常的从左到右的紧条件变成了两种状态的借用条件。 

其余的从右边也很方便。 如果已经选择的(i-1)个低位数字组成一个余数为(r)的值，并且第(i)位的新数字为(d)，则新值是

 [
 r+d\cdot10^{i-1}。 
]

 因此我们只需要保留模 (X) 的余数。 

同一个DP可以计算每个可能的长度，直到边界的长度。 如果构造的数字的位数少于界限，则无论最终借位如何，它都会自动变小。 只有位数与界限完全相同的数字才需要最终借零。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(100\cdot10^{100})) | (O(1)) | (O(1)) | 太慢了 |
 | 最佳| (O(LX | S | )) 每边界 | (O(X)) | (O(X)) | 已接受 |

 这里（L\le101）。 我们为 (B) 和 (A-1) 运行有界 DP，这仅改变常数因子。 

## 算法演练

 1. 定义`dp0[r]`和`dp1[r]`处理完右侧的一些位置后。`dp0[r]`计算其当前从界限的相应低位数字中减去的结构没有借位，而`dp1[r]`计算带有借位的构造。 两个数组均按余数模 (X) 进行索引。 

最初没有选择任何数字，余数为零，并且没有借位，所以`dp0[0] = 1`而其他所有状态都是零。 
2. 从右到左处理位置 (i=1,2,\ldots,L)。 对于每个位置，从 (S) 构建满足 (\gcd(d,i)=1) 的数字列表。 这些正是可以出现在该位置的数字。 

这直接将异常位置条件合并到转换中，因此无效数字永远不会进入 DP。 
3. 维持(p=10^{i-1}\bmod X)。 如果当前数字是 (d)，则将其添加到已构造的较低位置会将余数从 (r) 更改为

 [
 (r+d p)\bmod X。 
]

 在每个位置之后乘以 10 来更新功率。 
4. 令 (b) 为从右侧开始的第 (i) 位数字。 假设先前的借位是(c)。 该位置的减法为

 [
 b-d-c。 
]

 新借位由该值是否为负决定。 只有三种情况。 

如果 (d<b)，则两种可能的旧借用都不会产生新借用。 

如果 (d=b)，则旧借位仍然是借位，而没有旧借位仍然不是借位。 

如果 (d>b)，则两个可能的旧借位都会产生新借位。 

这是普通数字 DP 中熟悉的紧状态转换的从右到左等效。 
5. 处理完位置(i)后，统计长度恰好为(i)的数字。 要使位置 (i) 成为最高有效位置，所选数字必须非零。 对于每个合法的非零数字 (d)，我们确切地知道前一个余数可以导致余数为零，即

 [
 r\equiv-d\cdot10^{i-1}\pmod X.
 ]

 只有一个这样的余数，因此计算精确长度的可整除数只需要对每个数字进行恒定数量的额外操作。 
6. 如果 (i<L)，则每个 (i) 位正数都小于 (L) 位界限。 因此，在计算该长度的贡献时，两个借用状态都被接受。 

如果 (i=L)，则该数字与边界具有相同的长度，因此仅接受最终借位为零的状态。 
7. 计算`count_leq(B)`，然后将 (A) 作为十进制字符串减一并计算`count_leq(A-1)`。 所需的区间答案是

 [
 \text{count_leq}(B)-\text{count_leq}(A-1)。 
]

 减法以模 (10^9+7) 执行。 

工作原理：处理完右侧的前 (i) 个位置后，每个 DP 状态准确地代表这些位置的一组有效选择，按其余数模 (X) 和从边界减法中的借位进行分类。 该转换仅考虑每个合法的下一个数字一次，并将其发送到数学上正确的新余数和借用状态。 当数字在 (i) 位之后停止时，明确要求其最高有效位非零。 对于较短的数字，两种借位状态都是有效的，因为边界的未处理的较高部分包含至少一个正数。 对于等长数字，借零恰好是构造的数字至多为界限的条件。 这样每个有效数都被统计一次，无效数不被统计。 

## Python 解决方案```python
import sys
from math import gcd

input = sys.stdin.readline

MOD = 1_000_000_007

def dec_one(s):
    s = s.lstrip('0')
    if not s:
        return None

    a = list(s)
    i = len(a) - 1

    while i >= 0 and a[i] == '0':
        a[i] = '9'
        i -= 1

    if i < 0:
        return None

    a[i] = str(ord(a[i]) - ord('0') - 1)

    res = ''.join(a).lstrip('0')
    return res if res else '0'

def count_leq(t, x, source_digits):
    if t is None or t == '0':
        return 0

    t = t.lstrip('0')
    if not t:
        return 0

    length = len(t)

    allowed = [[] for _ in range(length + 1)]
    for pos in range(1, length + 1):
        cur = allowed[pos]
        for d in source_digits:
            if gcd(d, pos) == 1:
                cur.append(d)

    # dp0[r]: low processed digits have no borrow.
    # dp1[r]: low processed digits have a borrow.
    dp0 = [0] * x
    dp1 = [0] * x
    dp0[0] = 1

    power = 1
    answer = 0

    # Digits of t indexed from the right.
    bound_digits = [ord(c) - 48 for c in reversed(t)]

    for pos in range(1, length + 1):
        bd = bound_digits[pos - 1]
        digits = allowed[pos]

        ndp0 = [0] * x
        ndp1 = [0] * x

        # Count numbers that stop at this position.
        # For pos < length, both borrow states are valid.
        # For pos == length, only borrow 0 is valid.
        if pos < length:
            length_count = 0

            for d in digits:
                if d == 0:
                    continue

                add = (d * power) % x
                prev = (-add) % x

                v = dp0[prev] + dp1[prev]
                if v >= MOD:
                    v -= MOD

                length_count += v
                if length_count >= MOD:
                    length_count -= MOD

            answer += length_count
            if answer >= MOD:
                answer -= MOD
        else:
            length_count = 0

            for d in digits:
                if d == 0:
                    continue

                add = (d * power) % x
                prev = (-add) % x

                if d < bd:
                    v = dp0[prev] + dp1[prev]
                elif d == bd:
                    v = dp0[prev]
                else:
                    v = 0

                if v >= MOD:
                    v -= MOD

                length_count += v
                if length_count >= MOD:
                    length_count -= MOD

            answer += length_count
            if answer >= MOD:
                answer -= MOD

        # Build the DP for the next position.
        for d in digits:
            add = (d * power) % x

            if d < bd:
                # Both old borrow states become borrow 0.
                src0 = dp0
                src1 = dp1
                dest = ndp0

                for r in range(x):
                    j = r + add
                    if j >= x:
                        j -= x

                    v = src0[r] + src1[r]
                    if v >= MOD:
                        v -= MOD

                    v += dest[j]
                    if v >= MOD:
                        v -= MOD

                    dest[j] = v

            elif d == bd:
                # No old borrow stays at 0, old borrow stays at 1.
                src0 = dp0
                src1 = dp1

                for r in range(x):
                    j = r + add
                    if j >= x:
                        j -= x

                    v = ndp0[j] + src0[r]
                    if v >= MOD:
                        v -= MOD
                    ndp0[j] = v

                    v = ndp1[j] + src1[r]
                    if v >= MOD:
                        v -= MOD
                    ndp1[j] = v

            else:
                # Both old borrow states become borrow 1.
                src0 = dp0
                src1 = dp1
                dest = ndp1

                for r in range(x):
                    j = r + add
                    if j >= x:
                        j -= x

                    v = src0[r] + src1[r]
                    if v >= MOD:
                        v -= MOD

                    v += dest[j]
                    if v >= MOD:
                        v -= MOD

                    dest[j] = v

        dp0, dp1 = ndp0, ndp1

        power = (power * 10) % x

    return answer

def solve_case(a, b, x, s):
    digits = [ord(c) - 48 for c in s]

    right_of_a = dec_one(a)

    upper = count_leq(b, x, digits)
    lower = count_leq(right_of_a, x, digits)

    return (upper - lower) % MOD

def main():
    A, B, X = input().split()
    X = int(X)
    S = input().strip()

    print(solve_case(A, B, X, S))

if __name__ == "__main__":
    main()
```这`allowed`array 是位置规则的直接实现。 位置 1 很特殊，因为每个数字都与 1 互质，而在数学上也允许零。 对于最低有效位置，零仍然有效，但只要该位置成为最高有效数字，精确长度计数步骤就会跳过它。 

两个余数数组是中心 DP 状态。 在每个位置都会重新创建数组，因为每个转换仅取决于前一个位置。 除了当前剩余和借用之外，不需要任何历史记录。 

更新内容`j = r + add`然后减去一个`x`避免了最内层循环内相对昂贵的模运算。 既然两者`r`和`add`在`[0,x-1]`，它们的总和小于`2x`，所以一次减法就足够了。 

精确长度计数与转换是分开的，因为零在内部是合法的，但作为前导数字是非法的。 对于非零候选数字`d`，产生最终余数零的唯一前一个余数是`(-d * power) % x`。 这避免了再次扫描整个余数数组只是为了确定有多少有效前导数字产生余数零。 

借用转型值得特别关注。 为了`d < bd`，即使是现有的借款也会被吸收，因为`bd - d - 1`仍然是非负的。 为了`d == bd`，现有的借用仍然有效。 为了`d > bd`，这两种情况都需要借用。 在从右到左的实现中，混淆这三种情况是最有可能产生错误答案的原因。 

Python 整数不会溢出，但每次加法后所有 DP 计数都会按模 (10^9+7) 减少。 小数递减是直接在字符串上完成的，这是必要的，因为 (A) 可能有 101 位数字，并且不需要适合固定宽度的整数。 

## 工作示例

 对于样品 1，```
A = 1
B = 20
X = 2
S = 1234789
```下面总结了有用的从右到左的上限状态。 

| 位置 | 绑定数字 | 允许的数字 | 长度贡献 | 原因 |
 | --- | --- | --- | --- | --- |
 | 1 | 0 | 1,2,3,4,7,8,9 | 3 | 2 的一位数倍数是 2, 4, 8 |
 | 2 | 2 | 1,3,7,9 | 3 | 两位数的有效倍数为 12、14、18 |

 在位置 1 处，每个数字都与 1 互质。由于一位数字自动位于下方`20`，有效的可整除数是`2`,`4`， 和`8`。 

在位置 2 处，最高有效数字必须与 2 互质，因此仅`1`,`3`,`7`， 和`9`是允许的。 绑定数字为 2。产生余数为零并且不产生借位的组合是`12`,`14`， 和`18`。 因此总数为 6，与样本输出匹配。 

对于样品 2，```
A = 1
B = 20
X = 3
S = 0123678
```踪迹相似。 

| 位置 | 绑定数字 | 允许的数字 | 长度贡献 | 有效号码 |
 | --- | --- | --- | --- | --- |
 | 1 | 0 | 0,1,2,3,6,7,8 | 2 | 3, 6 |
 | 2 | 2 | 1,3,7 | 2 | 12、18 |

 在位置 1，零作为前导数字被忽略，留下`3`和`6`作为 3 的一位数倍数。 

在位置 2 处，右数第二个数字受 (\gcd(d,2)=1) 限制，因此仅在提供的数字中`1`,`3`， 和`7`是可能的。 约束条件和余数条件离开`12`和`18`。 总数为 4，再次与样本匹配。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(LX | S | )) | 有 (L) 个位置，(X) 个余数状态，每个位置最多 10 个候选数字，有两个边界 |
 | 空间| (O(X+L | S | )) | 两个余数数组和预先计算的合法数字 |

 最大绑定长度只有101位左右，而(X\le10^5)。 该算法从不依赖于 (A) 或 (B) 的数值大小，仅依赖于它们的小数长度。 内存使用量在 (X) 中保持线性，这是最大测试的关键要求。 

## 测试用例```python
# Save the editorial solution as solution.py before running these tests.

from solution import solve_case

# Provided samples
assert solve_case(
    "1", "20", 2, "1234789"
) == 6, "sample 1"

assert solve_case(
    "1", "20", 3, "0123678"
) == 4, "sample 2"

# Minimum-size input.
assert solve_case(
    "1", "1", 1, "1"
) == 1, "single valid number"

# Single boundary value that is not divisible by X.
assert solve_case(
    "11", "11", 2, "12"
) == 0, "exact boundary but wrong remainder"

# Exact boundary value that is valid.
assert solve_case(
    "12", "12", 2, "12"
) == 1, "exact boundary"

# All-equal digit set. Valid numbers are 7 and 77.
assert solve_case(
    "1", "100", 7, "7"
) == 2, "all-equal digits"

# Maximum-size decimal bound.
# With only digit 1 available, every repunit from 1 to 101 digits is valid,
# and X = 1 makes every one divisible.
big_b = "1" + "0" * 100
assert solve_case(
    "1", big_b, 1, "1"
) == 101, "maximum-size bound"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 1 / 1`|`1`| 最小间隔及单次有效数 |
 |`11 11 2 / 12`|`0`| 可整性失败的精确上下边界 |
 |`12 12 2 / 12`|`1`| 满足所有条件的精确边界 |
 |`1 100 7 / 7`|`2`| 重复数字和位置互质 |
 |`1 10^100 1 / 1`|`101`| 最大数字长度和任意精度范围 |

 ## 边缘情况

 前导零是通过精确长度计数步骤来处理的，而不是通过全局禁止零来处理。 例如，```
1 9 1
0
```有答案`0`。 根据 gcd 规则，零在位置 1 是合法的，但它不能是正整数的前导数字，因此候选数永远不会被算作一位数。 

当零的位置从右侧算起为 1 时，零仍然可以是有效的内部数字。 这就是为什么零必须保留在过渡集中的原因。 例如，如果允许的数字是`01`, 数量`10`最右边的数字为零，且 (\gcd(0,1)=1)，而其前导数字 1 满足 (\gcd(1,2)=1)。 该算法在第一次转换期间允许零，并且仅当它用作最高有效数字时才拒绝它。 

在从右到左的比较中，短于界限的数字需要特殊处理。 为了`B = 20`, 一位数`8`将唯一数字与低位数字进行比较时会导致借位`0`的`20`。 DP 保留该借用状态而不是拒绝该数字。 由于构造的数字只有一位数，而界限有两位数，因此两位最终借用状态都被接受为一位数贡献。 

位置 gcd 条件必须使用距右侧的距离。 为了`12`，最右边的数字位于位置 1，左边的数字位于位置 2。两者都满足条件，因为 (\gcd(2,1)=1) 和 (\gcd(1,2)=1)。 DP 完全按照该顺序进行处理，因此用于构造允许的数字集的位置始终是正确的。 

最终得到区间为`count_leq(B) - count_leq(A-1)`。 这可以处理两个端点，而无需主 DP 中的特殊情况。 为了`A = B = 12`，第一个计数包括`12`第二次计数停止于`11`，只留下一个数字。 为了`A = B = 11`和`X = 2`，两个计算都同意不存在有效的可整除数，因此结果为零。
