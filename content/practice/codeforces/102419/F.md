---
title: "CF 102419F - 异或求和"
description: "对于每个测试用例，我们需要打印一个恰好包含 (n) 个整数的数组。 每个值必须位于区间 ([0,m]) 内，所有值的普通和必须为 (s)，并且它们的按位异或必须为 (x)。 如果不存在这样的数组，我们打印 (-1)。"
date: "2026-08-12T20:17:54+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102419
codeforces_index: "F"
codeforces_contest_name: "SPC 2019"
rating: 0
weight: 102419
solve_time_s: 745
verified: true
draft: false
---

[CF 102419F - 异或求和](https://codeforces.com/problemset/problem/102419/F)

 **评级：** -
 **标签：** -
 **求解时间：** 12m 25s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于每个测试用例，我们需要打印一个恰好包含 (n) 个整数的数组。 每个值必须位于区间 ([0,m]) 内，所有值的普通和必须为 (s)，并且它们的按位异或必须为 (x)。 如果不存在这样的数组，我们打印 (-1)。 官方限制最多允许 (10^5) 个测试用例，所有测试用例的数组元素总数最多为 (3\cdot10^5)。 

(n) 的大小立即排除了任何探索许多可能数组的情况。 即使对于单个测试用例，枚举每个数组也需要 ((m+1)^n) 个候选者，当 (n=10^5) 时，这将是一个天文数字。 对于按总和索引的动态程序来说，值 (s) 和 (m) 也太大。 有用的结构必须来自 XOR 的二进制表示以及以重复方式构造大部分数组。 

第一个不变量是加法和异或之间的关系。 对于两个整数，

 [
 a+b=(a\oplus b)+2(a\mathbin{&}b)。 
]

 对于整个数组，这意味着普通和始终至少是 XOR，并且与 XOR 具有相同的奇偶校验。 因此， (s<x) 或 (s\not\equiv x\pmod 2) 立即使测试用例变得不可能。 

还有一些不太明显的边界情况。 如果(n=1)，则根本没有自由。 例如，(n=1,m=5,s=5,x=5) 对于数组 ([5]) 是有效的，而 (1,5,5,0) 是不可能的，因为唯一的元素必须等于其总和及其异或。 总是保留两个元素的粗心构造在这里也会失败。 

当 (x>m) 时出现第二种边界情况。 值 (x) 不能简单地放入数组中。 例如，(n=3,m=4,s=7,x=7) 对于 ([4,3,0]) 是有效的，因为 (4\oplus3=7)。 坚持使用 (x) 作为一个元素的构造会错误地拒绝它。 

总和的上限也可能具有欺骗性。 对于 (n=4,m=3,s=12,x=0)，有效答案 ([3,3,3,3]) 的 XOR 为零。 从两个零开始并尝试将整个剩余总和放入其他两个元素中将会失败，因为两个元素的贡献不能超过 (6)。 该构造必须能够选择总和较大的非最小对。 

最后，(m=0) 强制每个数组元素为零。 因此(n=4,m=0,s=0,x=0)是有效的，而(n=4,m=0,s=2,x=0)是不可能的。 这种情况自然可以通过一般构造来处理，但在检查 (m) 最高设置位周围的边界条件时很有用。 

## 方法

 蛮力方法在概念上很简单。 生成每个元素在 (0) 和 (m) 之间的数组，计算其总和并进行异或，并在两者与请求的值匹配时停止。 这是正确的，因为每一个可能的候选人都经过了审查。 问题是恰好有 ((m+1)^n) 个候选者。 对于 (n=10^5)，即使 (m) 的最小非平凡值也使这变得不可能，因此蛮力不仅稍微太慢，而且完全无法使用。 

关键的观察是，相同的数字对于异或来说非常方便。 如果我们将 (v,v) 放入数组中，它们的 XOR 为零，而它们对总和的贡献为 (2v)。 这意味着，一旦我们有一小群 XOR 为 (x) 的数字，则可以用相同的值填充剩余的每两个位置，而无需更改所需的 XOR。 我们只需要决定如何构造那个小的异或携带组以及它的总和应该有多大。 

对于偶数 (n)，特殊组可以包含两个数字。 对于奇数 (n)，当 (x\le m) 时它可以包含一个数字，或者当 (x>m) 时它可以包含三个数字。 在后一种情况下，这三个数字可以是 XOR (x) 后跟零的有效对。 因此，真正的问题被简化为用规定的异或和精心选择的和来构造两个有界数。 

假设两个数是(a,b)，它们的异或是(x)，它们的和是(p)。 定义

 [
 y=\frac{p-x}{2}.
 ]

 上面的身份给出

 [
 a\mathbin{&}b=y.
 ]

由于 (a\mathbin{&}b) 中设置的每个位在 (a\oplus b) 中都必须为零，因此我们需要 (y\mathbin{&}x=0)。 相反，当该条件成立时，(x)的位可以在(a)和(b)之间划分，而(y)的所有位被放置到两个数字中。 

这让我们可以直接用二进制解决有界对问题。 对于固定 (y)，写

 [
 a=y+u,\qquad b=y+(x\oplus u),
 ]

 其中 (u) 是 (x) 的集合位的任意子集。 因为 (u) 和 (x\oplus u) 使用不相交的位，所以它们也是相应的普通和。 如果 (c=m-y)，我们需要 (u\le c) 和 (x\oplus u\le c)。 从最高位到最低位可以贪婪地获取(x)不超过(c)的最大子集。 如果它的补集仍然大于 (c)，则没有其他子集可以工作，因为每个其他子集都不大于。 

剩下的问题是尝试哪个 (y)。 如果特殊组之后还有(r)个剩余位置，则这些位置可以等额填补。 他们的最大总贡献是（rm）。 因此，特殊对必须至少具有 (s-rm) 之和。 因为它的和是 (x+2y)，所以我们需要

 [
 y\ge \frac{s-rm-x}{2}。 
]

 我们选择满足该界限的最小 (y) 和 (y\mathbin{&}x=0)。 增加 (y) 会使对和变大，同时减少可用边界 (m-y)，因此如果最小的可行 (y) 无法形成有界对，则更大的 (y) 也无济于事。 

这给出了每个测试用例的对数二进制工作量，然后是实际打印答案所需的不可避免的 (O(n)) 工作量。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O((m+1)^n\cdot n)) | (O(n)) | (O(n)) | 太慢了|
 | 最佳| (O(n+\log m)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 检查(s<x)或(s)和(x)的奇偶校验是否不同。 由于 XOR 不能超过普通总和，并且每次进位都会使总和发生偶数变化，因此任何一个条件都无法得出解决方案。 
2. 确定需要多少特殊元素。 如果 (n) 为奇数且 (x\le m)，则使用单个元素 (x)。 其余 (n-1) 个位置形成相等的对。 否则，使用携带 XOR (x) 的两个元素，并且当 (n) 为奇数时附加零，以便剩余位置数为偶数。 
3. 令(r)为特殊组之后剩余的位置数。 该特殊对必须至少具有 (L=s-rm) 之和，因为剩余 (r) 个位置最多可以贡献 (rm)。 由于每个有效对都有总和 (x+2y)，因此从此下限计算所需的最小值 (y)。 
4. 找到同时满足 (y\ge (L-x)/2) 和 (y\mathbin{&}x=0) 的最小 (y\ge0)。 如果下限已经为非正数，则从零开始。 要找到避免 (x) 的设置位的下一个整数，请找到当前值的最低禁止设置位，并将其进位到允许且当前为零的第一个较高位。 
5. 对于这个(y)，设置(c=m-y)。 我们需要将 (x) 的集合位分成两个不相交的子集 (u) 和 (x\oplus u)，最多都是 (c)。 通过从高到低扫描 (x) 的位来构建最大可能的子集 (u\le c)。 如果 (x\oplus u>c)，则该对不能存在。 
6. 构造该对为 (a=y+u) 和 (b=y+(x\oplus u))。 它们的异或是(x)，它们的和是(x+2y)，并且两者最多都是(m)。 
7. 如果 (n) 为奇数且 (x>m)，则在该对后面附加零。 零既不会改变总和，也不会改变异或，并且它使剩余位置的数量为偶数。 
8. 令 (E) 为特殊组之后仍缺失的总和。 将 (E) 除以二。 重复取尽可能多的值，最多(m)，作为相等对的值。 每对都将其值的两倍贡献给总和，而 XOR 则为零，因此在足够多的对之后，就达到了精确的剩余总和。 
9. 如果在任何时候无法构造所需的特殊对，则打印 (-1)。 否则打印构造的数组。

该构造背后的不变量是特殊组始终具有恰好 (x) 的 XOR，而每个随后添加的对都具有 XOR 零。 同时，每个添加的对对总和的贡献均等。 所选择的下限保证剩余位置有足够的容量，并且贪婪填充步骤保证它们的可用容量足以实现从零到最大值的每个所需的偶数总和。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**30

def next_disjoint(value, x):
    """Smallest y >= value such that y & x == 0."""
    bad = value & x
    if bad == 0:
        return value

    k = (bad & -bad).bit_length() - 1

    for j in range(k + 1, 31):
        y_bit = (value >> j) & 1
        x_bit = (x >> j) & 1
        if y_bit == 0 and x_bit == 0:
            prefix = value & ~((1 << (j + 1)) - 1)
            return prefix | (1 << j)

    return 1 << 30

def make_pair(x, total, m):
    """
    Find a,b in [0,m] such that:
        a ^ b == x
        a + b == total
    """
    if total < x or ((total - x) & 1):
        return None

    y = (total - x) // 2

    if y > m or (y & x):
        return None

    cap = m - y

    if x > 2 * cap:
        return None

    u = 0
    for bit in range(29, -1, -1):
        b = 1 << bit
        if (x & b) and u + b <= cap:
            u |= b

    v = x ^ u

    if v > cap:
        return None

    return y + u, y + v

def solve_case(n, m, s, x):
    if s < x or ((s - x) & 1):
        return None

    # Odd n and x itself fits into one element.
    if n & 1 and x <= m:
        remaining = n - 1
        extra = s - x

        if extra < 0 or extra > remaining * m:
            return None

        ans = [x]
        half = extra // 2
        pairs = remaining // 2

        for _ in range(pairs):
            v = min(m, half)
            ans.append(v)
            ans.append(v)
            half -= v

        return ans

    # Otherwise we need a two-element XOR carrier.
    if n & 1:
        special = 3
    else:
        special = 2

    if n < special:
        return None

    remaining = n - special

    # The special pair must provide at least this much sum.
    lower = s - remaining * m

    if lower <= x:
        y_low = 0
    else:
        y_low = (lower - x) // 2

    if y_low < 0:
        y_low = 0

    if y_low > m:
        return None

    y = next_disjoint(y_low, x)

    if y > m:
        return None

    pair_sum = x + 2 * y

    if pair_sum > s:
        return None

    pair = make_pair(x, pair_sum, m)
    if pair is None:
        return None

    a, b = pair
    ans = [a, b]

    if n & 1:
        ans.append(0)

    extra = s - pair_sum

    if extra < 0 or extra > remaining * m or (extra & 1):
        return None

    half = extra // 2
    pairs = remaining // 2

    for _ in range(pairs):
        v = min(m, half)
        ans.append(v)
        ans.append(v)
        half -= v

    if half != 0 or len(ans) != n:
        return None

    return ans

def main():
    t = int(input())
    out = []

    for _ in range(t):
        n, m, s, x = map(int, input().split())
        ans = solve_case(n, m, s, x)

        if ans is None:
            out.append("-1")
        else:
            out.append(" ".join(map(str, ans)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```第一个帮手，`next_disjoint`，找到不低于所请求下界且其设置位不与 (x) 重叠的最小值。 如果当前值已经满足条件，则立即返回。 否则，必须删除其最低冲突位，并且最小可能的增加来自于设置当前值中 (x) 和零都允许的第一个较高位。 

这`make_pair`函数实现恒等式 (a+b=x+2(a\mathbin{&}b))。 变量`y`正是 (a\mathbin{&}b)，所以`y & x`必须为零。 一次`y`是固定的，(x) 的每一位都恰好属于这两个数字之一。 变量`u`选择哪些位属于第一个数字，并且`x ^ u`给出另一部分。 

从高到低的贪婪构造`u`是安全的，因为可用的权重是 2 的幂。 它找到 (x) 的集合位的最大子集，该子集不超过`cap`。 如果它的补集太大，则每个较小的子集都有一个更大的补集，因此没有替代分区。 

主要结构将相等的对视为阵列的可调节部分。 剩余位置的数量始终为偶数，这就是为什么特殊组对于奇数且可直接表示的情况有一个元素，对于偶数 (n) 有两个元素，并且当 (x>m) 时对于奇数 (n) 有三个元素。 Python 整数的使用还消除了对 (10^{18}) 以内的值溢出的任何担忧。 

操作顺序很重要。 特殊对的下界是在构造它之前计算的，因为选择太小的对可能会留下比剩余元素可以容纳的更多的总和。 相反，选择比必要的更大的对只会减少剩余容量，因此最小的可行 (y) 是正确的选择。 

## 工作示例

 对于第一个样本，请考虑 (n=4,m=4,s=15,x=7)。 由于 (n) 是偶数，因此两个元素进行 XOR，并且两个位置保持为相等对。 

| 变量| 价值|
 | --- | --- |
 | (n) | 4 |
 | (男)| 4 |
 | (s) | 15 | 15
 | (x)| 7 |
 | 剩余职位 | 2 |
 | 较低对和 | (15-2\cdot4=7) |
 | (y) 下限 | 0 |
 | 选择 (y) | 0 |
 | 配对总和| 7 |
 | 配对 | (4,3) |
 | 剩余金额 | 8 |
 | 同等对 | (4,4) |
 | 最终阵列| (4,3,4,4) |

 特殊对有 (4\oplus3=7) 和和 (7)。 最后一对贡献 (8) 而不改变 XOR，因此总数为 (15)，XOR 仍为 (7)。 这也证明了 (x>m) 的情况，直接放置 (x) 是非法的。 

对于第二个样本，(n=4,m=4,s=4,x=4)。 这里(x\le m)，但是(n)是偶数，所以异或载波必须仍然使用两个位置。 

| 变量| 价值|
 | --- | --- |
 | (n) | 4 |
 | (男)| 4 |
 | (s) | 4 |
 | (x)| 4 |
 | 剩余职位 | 2 |
 | 较低对和 | (4-2\cdot4=-4) |
 | 选择 (y) | 0 |
 | 配对总和| 4 |
 | 配对 | (4,0) |
 | 剩余金额 | 0 |
 | 最终阵列| (4,0,0,0) | (4,0,0,0) |

 对 (4,0) 具有异或 (4) 和和 (4)。 剩下的两个零保留这两个数量。 

作为另一个有用的跟踪，请考虑 (n=4,m=3,s=12,x=0)。 

| 变量| 价值|
 | --- | --- |
 | (n) | 4 |
 | (男)| 3 |
 | (s) | 12 | 12
 | (x)| 0 |
 | 剩余职位 | 2 |
 | 较低对和 | (12-2\cdot3=6) |
 | 选择 (y) | 3 |
 | 配对总和| 6 |
 | 配对 | (3,3) |
 | 剩余金额 | 6 |
 | 同等对| (3,3) |
 | 最终阵列| (3,3,3,3) | (3,3,3,3) |

 该迹线显示了为什么不能总是以最小可能和 (x) 选择该对。 这里 (x=0)，但使用 (0,0) 只会留下两个剩余元素的总和 (12)，这是不可能的。 下界迫使特殊对贡献 (6)，之后另一对贡献剩余的 (6)。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 (O(n+\log m)) | 二进制构造最多使用约 30 位，并且打印 (n) 个值的成本为 (O(n))。 |
 | 空间| (O(n)) | (O(n)) | 输出数组恰好包含 (n) 个整数。 |

 在所有测试用例中，总数 (n) 最多为 (3\cdot10^5)，因此总输出结构为 (O(3\cdot10^5))。 二进制部分仅在每个测试用例最多 30 位上执行恒定数量的扫描。 这完全符合 1 秒的时间限制，而 (O(n)) 内存则受到所需输出大小的限制。 

## 测试用例```python
# Self-contained assert-based tests for the construction.

import sys
import io

def next_disjoint(value, x):
    bad = value & x
    if bad == 0:
        return value

    k = (bad & -bad).bit_length() - 1

    for j in range(k + 1, 31):
        if ((value >> j) & 1) == 0 and ((x >> j) & 1) == 0:
            prefix = value & ~((1 << (j + 1)) - 1)
            return prefix | (1 << j)

    return 1 << 30

def make_pair(x, total, m):
    if total < x or ((total - x) & 1):
        return None

    y = (total - x) // 2

    if y > m or (y & x):
        return None

    cap = m - y

    if x > 2 * cap:
        return None

    u = 0
    for bit in range(29, -1, -1):
        b = 1 << bit
        if (x & b) and u + b <= cap:
            u |= b

    v = x ^ u

    if v > cap:
        return None

    return y + u, y + v

def solve_case(n, m, s, x):
    if s < x or ((s - x) & 1):
        return None

    if n & 1 and x <= m:
        remaining = n - 1
        extra = s - x

        if extra < 0 or extra > remaining * m:
            return None

        ans = [x]
        half = extra // 2

        for _ in range(remaining // 2):
            v = min(m, half)
            ans.extend([v, v])
            half -= v

        return ans

    special = 3 if (n & 1) else 2

    if n < special:
        return None

    remaining = n - special
    lower = s - remaining * m
    y_low = 0 if lower <= x else (lower - x) // 2

    if y_low > m:
        return None

    y = next_disjoint(y_low, x)

    if y > m:
        return None

    pair_sum = x + 2 * y

    if pair_sum > s:
        return None

    pair = make_pair(x, pair_sum, m)
    if pair is None:
        return None

    a, b = pair
    ans = [a, b]

    if n & 1:
        ans.append(0)

    extra = s - pair_sum

    if extra < 0 or extra > remaining * m or extra & 1:
        return None

    half = extra // 2

    for _ in range(remaining // 2):
        v = min(m, half)
        ans.extend([v, v])
        half -= v

    if half != 0 or len(ans) != n:
        return None

    return ans

def solve_text(inp: str) -> str:
    data = io.StringIO(inp)
    t = int(data.readline())
    out = []

    for _ in range(t):
        n, m, s, x = map(int, data.readline().split())
        ans = solve_case(n, m, s, x)

        if ans is None:
            out.append("-1")
        else:
            out.append(" ".join(map(str, ans)))

    return "\n".join(out)

def run(inp: str) -> str:
    return solve_text(inp)

def validate(inp: str, out: str):
    lines = out.strip().splitlines()
    data = inp.strip().splitlines()

    t = int(data[0])
    assert len(lines) == t

    for i in range(t):
        n, m, s, x = map(int, data[i + 1].split())
        line = lines[i].strip()

        if line == "-1":
            assert solve_case(n, m, s, x) is None
            continue

        a = list(map(int, line.split()))
        assert len(a) == n
        assert all(0 <= v <= m for v in a)
        assert sum(a) == s

        cur_xor = 0
        for v in a:
            cur_xor ^= v

        assert cur_xor == x

# Provided sample
sample = """\
3
4 4 15 7
4 4 4 4
4 4 15 1
"""
validate(sample, run(sample))

# Minimum-size valid case
case1 = """\
1
1 5 5 5
"""
validate(case1, run(case1))

# All elements equal
case2 = """\
1
4 3 12 0
"""
validate(case2, run(case2))

# Boundary case with x > m
case3 = """\
1
3 4 7 7
"""
validate(case3, run(case3))

# Impossible because the requested sum is too large for the XOR requirement
case4 = """\
1
4 4 15 1
"""
assert run(case4).strip() == "-1"

# Maximum-size n, with all elements forced to one
case5 = """\
1
100000 1 100000 0
"""
validate(case5, run(case5))
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 5 5 5 5`|`5`| 最小值（n），直接单元素构造|
 |`4 / 3 12 0`|`3 3 3 3`| 所有相等的值和大的所需总和 |
 |`3 / 4 7 7`|`4 3 0`| XOR 大于 (m)，需要拆分两个值 |
 |`4 / 4 15 1`|`-1`| 总容量和不可能的施工|
 |`100000 / 1 100000 0`| 100000 个 | 最大值 (n)、输出大小和配对填充 |

 ## 边缘情况

 对于 (n=1)，数组只有一个值。 考虑`1 5 5 5`。 检查通过，(x\le m)，奇数长度允许单个特殊值 (x=5)。 输出是`[5]`。 为了`1 5 4 5`，奇偶或和关系拒绝这种情况，因为唯一可能的元素必须是 (5)，其和不能是 (4)。 

当(x>m)时，不能直接插入值(x)。 为了`3 4 7 7`，二的最高有用幂是(4)，并且(7=4+3)。 特殊群体成为`[4,3,0]`。 其和为(7)，异或为(4\oplus3\oplus0=7)，每个值最多为(4)。 

对于所有平等的答案，请考虑`4 3 12 0`。 所需的异或为零，因此相等的对是理想的。 下界迫使第一对做出贡献 (6)，给出`[3,3]`。 剩余的总和是另一个 (6)，给出`[3,3]`再次。 最终的数组是`[3,3,3,3]`，其和为 (12) 并且 XOR 为零。 

对于 (m=0)，每个值都必须为零。 和`4 0 0 0`，奇数或偶数分支仅构造零对，并且请求的总和已经为零，因此返回四个零的数组。 和`4 0 2 0`，剩余容量为零，因此构造拒绝该测试用例。 

对于容量上限，`100000 1 100000 0`需要最大可能的总和。 由于 (n) 是偶数且 XOR 为零，因此该结构使用成对的 1。 每个元素都变为 (1)，给出 sum (100000) 和 XOR 零，因为偶数个 1 被异或在一起。 这也运用了允许的最大值 (n) 并确认输出结构在数组大小中保持线性。
