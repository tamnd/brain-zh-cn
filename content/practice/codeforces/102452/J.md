---
title: "CF 102452J - 初级数学家"
description: "对于每个正整数 x，查看它的小数位。 如果这些数字是 d1、d2、...、dk，则将 f(x) 定义为 i < j 的每对不同位置上的 di dj 之和。 我们需要计算 [L, R] 中 x 和 f(x) 具有相同模 m 余数的整数。"
date: "2026-08-10T06:35:27+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102452
codeforces_index: "J"
codeforces_contest_name: "2019-2020 ICPC Asia Hong Kong Regional Contest"
rating: 0
weight: 102452
solve_time_s: 236
verified: true
draft: false
---

[CF 102452J - 初级数学家](https://codeforces.com/problemset/problem/102452/J)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于每个正整数`x`，看看它的小数位。 如果这些数字是`d1, d2, ..., dk`， 定义`f(x)`作为总和`di * dj`在每对不同的位置上`i < j`。 我们需要计算其中的整数`[L, R]`为此`x`和`f(x)`具有相同的模余数`m`。 

输入包含几个独立的案例。 每种情况都给出两个可能巨大的十进制整数`L`和`R`， 其次是`m`。 自从`R`最多可以包含 5000 位数字，无法转换为普通机器整数。 所需的答案是区间内有效整数的数量，减少模数`10^9 + 7`。 

所有数字总数的界限`R`值只有 5000，这告诉我们预期的算法应该与位数乘以多项式大致呈线性关系`m`。 和`m <= 60`，状态空间`m²`是可以管理的，同时`m³`乘以 5000 就已经太大了。特别是，具有 5000 位数字的 DP 和`60³`在考虑数字转换之前，各国将进行约 10.8 亿次国事访问。 

有几个边界细节可能会默默地导致错误的答案。 首先，区间是包含在内的。 为了`L = R = 10`和`m = 2`，我们有`f(10) = 0`和`10 ≡ 0 (mod 2)`，所以答案是`1`。 计算的解决方案`count(R) - count(L)`而不是`count(R) - count(L-1)`丢失唯一有效的号码。 

其次，自然数字 DP 在将所有数字计数到固定长度界限时使用前导零。 例如，`10`可以表示为`0010`。 那些前导零不会改变`f(x)`，因为每个包含零的乘积都是零，所以将它们视为数字序列的一部分是安全的。 价值`0`本身也可以通过前缀DP来计算，但是当我们减去它时它就消失了`count(L-1)`因为`L >= 10`。 

第三，两位数的数字有`f(ab) = a*b`， 不是`a+b`。 例如，对于`22`,`f(22) = 4`。 和`m = 2`， 两个都`22`和`4`与零一致，所以答案为`22 22 2`是`1`。 仅存储数字和的 DP 无法区分这种情况。 

最后，上限可以有数千位数字。 例如，`10`后跟 4998 个零是合法的 4999 位值。 我们必须将其作为字符串处理并执行每个算术运算模`m`; 将其转换为普通整数既不必要也不可取。 

## 方法

 直接的方法是枚举每个整数`x`从`L`通过`R`，提取其数字，计算`f(x)`，并检验一致性。 计算`f(x)`直接从所有数字对成本`Θ(k²)`对于一个`k`- 数字。 即使我们增量地维护对和，检查每个整数仍然需要花费`Θ(R-L+1)`运营。 在最坏的情况下，该区间几乎包含`10^5000`数字，每个数字可以有大约5000位数字。 因此，直接基于对的实现将按照以下顺序执行`10^5000 * 5000²`，这是完全不可行的。 

自然的下一步是数字 DP。 在从左到右构建数字时，假设已经选择的数字有总和`s`以及他们的贡献`f`是`g`。 如果下一个数字是`d`，那么之间的每个产品`d`前面的数字有助于`f`，所以新的贡献是`g + d*s`。 同时，新的数字改变了数值`x`经过`d * 10^p`， 在哪里`p`是它的位值。 

一个简单的 DP 将存储当前值`x`模数`m`，当前值`f(x)`模数`m`，以及模数的数字和`m`。 这给出了`m³`每个位置的状态。 和`m = 60`还有5000位数字，这太多了。 

有用的观察是我们永远不需要这两个值`x mod m`和`f(x) mod m`独立。 最终的条件正是`f(x) - x ≡ 0 (mod m)`。 所以我们可以直接存储它们的差异。 

让`q = f(prefix) - value(prefix) (mod m)`，并让`s`是前缀模的数字和`m`。 当我们追加数字时`d`按原位价值`p`，新对的贡献`f`是`d*s`，而新的贡献`x`是`d*p`。 因此`q' = q + d*s - d*p (mod m)`。 

新的数字和很简单`s' = s + d (mod m)`。 

只剩下两个模块化状态维度，`s`和`q`。 官方社论也有同样的描述`O(|R|m²)`状态减少。 

我们可以计算有效数字的上限`N`，然后使用`answer = count(R) - count(L-1)`。 

标准紧数字 DP 标志处理上限。 下面的实现将所有已经较小的前缀保留在一个 DP 数组中，并分别使单个前缀等于边界。 这从实际存储中删除了一维并保持转换简单。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`Θ((R-L+1) · k²)`|`O(k)`| 太慢了 |
 | 朴素数字 DP |`O(k · m³ · 10)`|`O(m³)`| 太慢了 |
 | 最佳数字 DP |`O(k · m² · 10)`|`O(m²)`| 已接受 |

 ## 算法演练

 1. 定义`count(N)`作为有效整数的数量`0`通过`N`。 然后可以获得请求的间隔：`count(R) - count(L-1)`。 从零开始计数很方便，因为数字 DP 自然允许前导零。 
2. 处理数字`N`从左到右。 对于前缀，存储`s`，其数字之和模`m`， 和`q`，值`f(prefix) - prefix`模数`m`。 这两个值恰好包含附加另一个数字时更新状态所需的信息。 
3. 假设下一个数字是`d`其小数位值为`p = 10^remaining (mod m)`。 数字贡献`d*s`到`f`，因为它与每个前面的数字配对，其总和为`s`。 它贡献`d*p`到数值。 因此差异根据`q' = q + d*s - d*p (mod m)`。 
4. 数字和独立变化为`s' = s + d (mod m)`。 对于每个州，尝试所有十个可能的数字。 已经小于的前缀`N`可以使用全部十位数字，而唯一前缀等于`N`只能使用相应绑定数字以内的数字。 
5. 单独保留紧前缀。 如果它的下一个数字小于相应的数字`N`，其新状态被插入到不受限制的 DP 中。 如果所选数字相等，则前缀保持紧密。 最后只有一条紧路径，代表`N`本身。 
6. 处理完所有数字后，每个有效状态都必须有`q = 0`。 将这些状态与每个可能的数字总和相加`s`，既处于非限制 DP 状态，又处于紧状态（如果适用）。 
7. 计算`count(R) - count(L-1)`模数`10^9+7`。 自从`L`和`R`是字符串，递减`L`使用十进制字符串算术而不是将其转换为整数。 

### 为什么它有效

 不变的是每个 DP 状态`(s, q)`精确表示前缀的数字和`s`和差异`q = f(prefix) - prefix`模数`m`。 当一个数字`d`被附加，唯一的新术语`f`是其前面数字的产品，其总数为`d*s`。 相应的数字本身的增加是`d*p`。 因此，转换计算出确切的新值`f - x`模数`m`。 

在最后一位数字上，`q = 0`相当于`f(x) ≡ x (mod m)`。 紧密过渡完全考虑了不大于的数字字符串`N`，而不受限制的状态恰好包含已经变小的前缀。 因此`count(N)`计算从零到的每个有效整数`N`正好一次。 减法`count(L-1)`精确地留下有效整数`[L, R]`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1_000_000_007

def decrement_decimal(s):
    """Return s - 1 as a decimal string. s is positive."""
    a = list(s)
    i = len(a) - 1

    while a[i] == '0':
        a[i] = '9'
        i -= 1

    a[i] = chr(ord(a[i]) - 1)

    res = ''.join(a).lstrip('0')
    return res if res else '0'

def count_upto(bound, m):
    """Count x in [0, bound] with f(x) == x (mod m)."""
    if bound == '-1':
        return 0

    digits = [ord(c) - 48 for c in bound]
    n = len(digits)

    states = m * m

    # dp[s * m + q]:
    # number of prefixes already strictly smaller than bound,
    # with digit sum s and f(prefix)-prefix == q (mod m).
    dp = [0] * states
    dp[0] = 1

    # The unique prefix equal to the bound so far.
    tight_s = 0
    tight_q = 0

    # 10^i mod m, where i is the number of positions to the right.
    pow10 = [1] * n
    for i in range(1, n):
        pow10[i] = pow10[i - 1] * 10 % m

    for pos in range(n):
        place = pow10[n - pos - 1]
        limit = digits[pos]

        ndp = [0] * states

        # Precompute the transition for each digit for every digit sum.
        # For a state (s, q):
        #   s' = s + d
        #   q' = q + d * (s - place)
        moves = []
        for s in range(m):
            row = []
            for d in range(10):
                ns = s + d
                if ns >= m:
                    ns -= m
                delta = (d * (s - place)) % m
                row.append((ns, delta))
            moves.append(row)

        # Extend prefixes which are already smaller than bound.
        for s in range(m):
            base = s * m
            row_moves = moves[s]

            for q in range(m):
                v = dp[base + q]
                if v == 0:
                    continue

                for d in range(10):
                    ns, delta = row_moves[d]

                    nq = q + delta
                    if nq >= m:
                        nq -= m

                    idx = ns * m + nq
                    nv = ndp[idx] + v
                    if nv >= MOD:
                        nv -= MOD
                    ndp[idx] = nv

        # Extend the unique tight prefix.
        # Digits smaller than limit become unrestricted.
        for d in range(limit):
            ns = tight_s + d
            if ns >= m:
                ns -= m

            nq = tight_q + d * (tight_s - place)
            nq %= m

            idx = ns * m + nq
            nv = ndp[idx] + 1
            if nv >= MOD:
                nv -= MOD
            ndp[idx] = nv

        # Choosing the bound digit keeps the prefix tight.
        tight_q += limit * (tight_s - place)
        tight_q %= m

        tight_s += limit
        if tight_s >= m:
            tight_s -= m

        dp = ndp

    ans = 1 if tight_q == 0 else 0

    # q == 0, any digit sum is acceptable.
    for s in range(m):
        ans += dp[s * m]
        if ans >= MOD:
            ans -= MOD

    return ans

def solve_case(L, R, m):
    left = decrement_decimal(L)
    return (count_upto(R, m) - count_upto(left, m)) % MOD

def main():
    T = int(input())

    out = []
    for _ in range(T):
        L = input().strip()
        R = input().strip()
        m = int(input())

        out.append(str(solve_case(L, R, m)))

    sys.stdout.write('\n'.join(out))

if __name__ == "__main__":
    main()
```使用以下方法将状态数组展平为一维`s * m + q`。 这避免了最内层转换中的嵌套 Python 列表，并使热循环更便宜。 该数组只有`m²`条目，所以最多`m = 60`它包含 3600 个州。 

这`place`值总是按模减少`m`。 实际的位值可以有数千位小数位，但只能是其模余数`m`影响复发。 这`pow10`数组从最右位置向左存储这些余数。 

过渡使用`q + d * (s - place)`。 使用当前前缀数字和执行乘法`s`，不是新的总和`s + d`。 新数字必须仅与已放置在其左侧的数字配对，这正是旧数字的配对`s`代表。 

每个 DP 单元中存储的计数始终按模数减少`10^9+7`。 由于旧单元格和要添加的值都已经低于模数，因此每次添加后进行一次条件减法就足够了。 这避免了相对昂贵的`% MOD`在最内层循环内。 

界限本身由一个紧密状态表示，而不是 DP 的附加维度。 每个使用较小数字的转换都会插入到`ndp`，而精确使用绑定数字的转换成为新的紧状态。 这相当于通常的紧密标志，但节省了内存和一些循环开销。 

故意允许使用前导零。 例如，当计数数字达到`999`，值`23`表示为`023`。 前导零没有任何贡献`f`，对数字和没有任何贡献，对数值也没有任何贡献，所以状态`023`与从实际的两位数表示获得的状态相同`23`。 

的减量为`L`在调用之前完成`count_upto`。 这是处理包含区间的最简洁的方法，并且它还避免了数字 DP 本身的特殊情况。 

## 工作示例

 第一个样本是```
2
10
50
17
33
33
3
```为了`m = 17`，考虑一个两位数`ab`。 其值为`10a+b`， 尽管`f(x)=ab`。 中的两个有效数字`[10,50]`是`23`和`42`。 

为了`23`，DP从`(s,q)=(0,0)`。 选择第一个数字后`2`，其位值为`10`， 所以`s=2`和`q=0+2*0-2*10=-20 ≡ 14 (mod 17)`。 选择后`3`，剩余位值为`1`， 所以`q=14+3*2-3*1=17 ≡ 0`。 最终状态有效。 

为了`42`，对应的状态为：

 | 职位| 数字| 对 17 取模 | 数字和`s`| 不同之处`q`|
 | --- | --- | --- | --- | --- |
 | 开始| | | 0 | 0 |
 | 1 | 4 | 10 | 10 4 | 11 | 11
 | 2 | 2 | 1 | 6 | 0 |

 无限制计数最多`50`还包含`0`， 因为`f(0)=0`。 因此`count(50)=3`，代表`0`,`23`， 和`42`。 最多`9`， 仅有的`0`是有效的，所以`count(9)=1`。 最终结果是`3-1=2`，匹配示例输出。 

第二个样本是`L=R=33`,`m=3`。 为了`33`，第一个数字给出`s=0`和`q=0`， 因为`3*0-3*10 ≡ 0 (mod 3)`。 第二位数字也离开`q=0`， 自从`3*0-3*1 ≡ 0 (mod 3)`。 

| 职位| 数字| 对 3 进行取模 | 数字和`s`| 不同之处`q`|
 | --- | --- | --- | --- | --- |
 | 开始| | | 0 | 0 |
 | 1 | 3 | 1 | 0 | 0 |
 | 2 | 3 | 1 | 0 | 0 |

 因此`33`是有效的。 的减法`count(32)`从`count(33)`精确隔离该边界值，产生`1`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(D · m² · 10)`| 每个`D`数字位置访问`m²`状态并尝试十位数字|
 | 空间|`O(m² + D)`| 二`m²`- 大小的 DP 数组是不必要的，因为旧数组已被新数组替换； 功率表使用`O(D)`空间|

 这里`D`是边界的位数。 两人呼吁`R`和`L-1`只需添加一个常数因子。 由于所有数字的总位数`R`值最多为 5000 并且`m <= 60`，每个数字的 DP 状态数最多为`3600`，每个状态有十种可能的转换。 内存使用量仍然很小，因为只有当前和下一个`m²`状态被存储。 

## 测试用例

 下面提供的示例和自定义案例练习了间隔边界、全等数字、最小允许值和接近最大长度的十进制数。```python
# Save the submitted solution as solution.py before running this test file.

import io
import sys
import solution

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solution.main()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided samples
sample = """\
2
10
50
17
33
33
3
"""
assert run(sample) == "2\n1", "provided samples"

# Minimum-size input.
# f(10) = 0 and 10 is divisible by 2.
assert run("""\
1
10
10
2
""") == "1", "minimum value"

# All digits equal.
# f(22) = 2 * 2 = 4, and both 22 and 4 are 0 modulo 2.
assert run("""\
1
22
22
2
""") == "1", "all-equal digits"

# Boundary case with no valid number.
# f(10)=0, 10 mod 3 = 1.
# f(11)=1, 11 mod 3 = 2.
assert run("""\
1
10
11
3
""") == "0", "boundary with no valid values"

# Inclusive interval and multiple consecutive valid values.
# For m=2:
# 10 -> f=0, valid
# 11 -> f=1, valid
# 12 -> f=2, valid
assert run("""\
1
10
12
2
""") == "3", "inclusive endpoints"

# Maximum-length style test.
# 1 followed by 4998 zeroes is a legal 4999-digit value.
# Its f(x) is 0, and the number is even, so it is valid for m=2.
huge = "1" + "0" * 4998
assert run(f"""\
1
{huge}
{huge}
2
""") == "1", "large decimal bound"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`10 10 2`|`1`| 最小允许值和`L = R`|
 |`22 22 2`|`1`| 所有数字相等和对积计算 |
 |`10 11 3`|`0`| 两个端点都无效的范围 |
 |`10 12 2`|`3`| 包含区间处理和连续有效​​值 |
 | 4999 位数字`10...0`和`m=2`|`1`| 非常大的十进制字符串和位值算术模`m`|

 ## 边缘情况

 对于包含边界情况`10 10 2`，算法计算`count(10)`和`count(9)`。 数量`10`达到最终状态`q=0`， 因为`f(10)-10 = -10 ≡ 0 (mod 2)`。 数量`0`也按两个界限进行计数，因此在减法过程中会取消。 结果正是`1`。 

对于全平等的例子`22 22 2`，这两个数字产生一对，所以`f(22)=4`。 DP首先读到`2`，然后读取第二个`2`。 第一个数字之后的差异是`-20 ≡ 0 (mod 2)`。 第二位数字之后，额外贡献是`2*2 - 2 = 2`，因此模二之差保持为零。 最终的答案是`1`。 

对于前导零的情况，考虑`23`同时数到`50`。 DP 将其处理为`23`，但如果边界有更多数字，它可以处理相同的值，例如`0023`。 每个插入的前导零都有`d=0`，所以它既不改变数字和也不改变`f-x`。 表示仍然达到相同的最终状态，这意味着固定长度数字 DP 正确地计数了数字。 

对于精确的上边界`33 33 3`，必须选择紧路径`3`在这两个位置。 第一个数字之后的数字和为`0 mod 3`区别还在于`0 mod 3`。 在第二个数字之后，差值保持为零。 由于路径永远不会变得小于边界，因此它保持单独紧状态并包含在末尾。 减法`count(32)`正好留下一个数字。 

对于由以下组成的最大长度情况`1`后面跟着 4998 个零，每对数字至少包含一个零，所以`f(x)=0`。 该数字本身是 10 的幂，可以被 2 整除，因此有效`m=2`。 该算法从不构造巨大的整数。 它只处理 4999 位数字并存储每个位模 2 的值，因此数值的大小对状态表示没有影响。
