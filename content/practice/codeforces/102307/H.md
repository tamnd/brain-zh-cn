---
title: "CF 102307H - 最难的挑战"
description: "每个团队都有三个长度相同的字符串。 在每个位置，团队都可以从三名成员中的任何一个中选择角色，独立于其他位置。 因此，具有字符串 (P,Q,R) 的团队最多可以构造 (3^n) 个不同的字符串。"
date: "2026-08-13T07:22:35+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102307
codeforces_index: "H"
codeforces_contest_name: "2019 ICPC Universidad Nacional de Colombia Programming Contest"
rating: 0
weight: 102307
solve_time_s: 193
verified: true
draft: false
---

[CF 102307H - 最难的挑战](https://codeforces.com/problemset/problem/102307/H)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个团队都有三个长度相同的字符串。 在每个位置，团队都可以从三名成员中的任何一个中选择角色，独立于其他位置。 因此，具有字符串 (P,Q,R) 的团队最多可以构造 (3^n) 个不同的字符串。 

构造字符串的分数是其以 127 为底的多项式哈希模

 [
 MOD=10^{15}+37。 
]

 哈希的预期解释是标准的从左到右递归

 [
 h_0=0,\qquad h_{i+1}=(127h_i+\operatorname{ord}(S_i))\bmod MOD。 
]

 这相当于按 127 的降幂对字符进行加权。官方问题页面给出了 (A,B\le 28)，示例中正是使用了这种结构。 

对于猫头鹰，我们必须在所有长度为 (A) 的字符串中找到尽可能小的分数。 我们独立地为山羊做同样的事情，然后比较两个最低分数。 分数较小者获胜，相等则平局。 

28 的上限是整个难度。 直接枚举需要一个团队的 (3^{28}=22,876,792,454,961) 个候选字符串，远远超出 10 秒内可以处理的范围。 另一方面，将 28 个位置分成两半，每半最多给出 (3^{14}=4,782,969) 种可能性。 几百万个州面积虽大但易于管理，这强烈建议采用中间会合解决方案。 

模数也很重要。 如果没有模运算，选择字典顺序或数字上最小的字符串就足够了，因为所有字符值都是正数，并且较早的位置具有较大的 127 次幂。取模后，较大的多项式值可以具有更小的余数。 任何最小化未模多项式的方法都可能默默地选择错误的字符串。 

第二个边缘情况是一个团队的三名成员在某个位置上具有相同的性格。 那么在该位置只有一个不同的选择，即使一个简单的实现可能会计算三次。 重复项不会影响正确性，但删除它们可以大大减少实际工作量。 

如果按照字面意思解释语句中的指数，长度为一的情况也很容易被错误处理。 对于一个字符，分数必须只是其 ASCII 值。 例如，```
1 1
E
L
I
X
Y
Z
```给出`Owls`，因为猫头鹰可以获得`E`，其得分为 69，而山羊队的最低得分为 88。从左到右的哈希递归使该边界情况变得明确。 

最后，模块化环绕可以发生在长字符串上。 例如，第二个样本在山羊一侧有 28 个字符，因此多项式在减少之前会远远超出 (MOD)。 比较原始多项式值并不等同于比较它们的分数。 

## 方法

 暴力解法直接遵循定义。 对于每个位置，尝试三个可用字符中的每一个，递归构造每个可能的字符串，计算其哈希值，并保留最小分数。 这是正确的，因为每个合法构造的字符串都只出现一次，除了当两个团队成员在某个位置具有相同字符时无害的重复之外。 

问题是叶子的数量。 长度为 28 时，一支球队有 (3^{28}=22,876,792,454,961) 个可能的字符串。 即使计算每个哈希值减少到恒定时间，也无法检查数十万亿个候选者。 在每个叶子上重新计算整个哈希会使情况变得更糟。 

关键的观察是一个字符串可以分成两个独立的部分。 假设左侧片段的哈希值 (L)，右侧片段的哈希值 (R)，右侧片段的长度 (k)。 他们的串联有哈希

 [
 (L\cdot127^k+R)\bmod MOD。 
]

 所以我们可以分别枚举每一个可能的左半部分和每一个可能的右半部分。 左右半场最多有 14 个位置，双方最多有 (3^{14}=4,782,969) 种可能性。 这就是中间相遇的减少。 

还有一个更有用的观察结果，因为最终值取模 (MOD)。 对于固定左散列，定义

 [
 X=(L\cdot127^k)\bmod MOD。 
]

 我们需要最小化

 [
 (X+R)\bmod MOD
 ]

 超过所有可能的右散列 (R)。 

如果 (X+R<MOD)，结果就是 (X+R)，因此在所有非包装候选者中，最小的右散列是最好的。 如果 (X+R\ge MOD)，则结果是 (X+R-MOD)，因此最佳包装候选者是满足的最小右散列

 [
 R\ge MOD-X。 
]

 对所有正确的哈希值进行排序后，通过一次二分搜索即可找到该候选者。 因此我们根本不需要存储或排序左半部分。 

蛮力之所以有效，是因为每个选择都是独立的，但失败是因为它探索了所有位置选择的笛卡尔积。 串联的散列分为转换后的左散列和右散列，这一观察结果让我们可以用两组大致 (3^{14}) 状态和对数查找来替换巨大的笛卡尔积。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(3^nn)) | (O(3^nn)) | (O(n)) | (O(n)) | 太慢了|
 | 中间会面 | (O(3^{n/2}\log 3^{n/2})) | (O(3^{n/2})) | 已接受 |

 下面的实现对 Python 内存使用进行了一些小的额外优化。 在生成哈希值时，长度 14 的一半本身被分成两段，最多 7 个字符。 然后，每个片段最多具有 (3^7=2187) 个值，并且它们的笛卡尔积创建所需的 (3^{14}) 哈希值，而无需同时保存大小的中间列表 (3^8,3^9,\ldots,3^{13})。 

## 算法演练

 1. 对于当前团队，将其字符串位置拆分为长度为 (L=\lfloor n/2\rfloor) 的前缀和包含剩余位置的后缀。 分割使两个部分的长度最多为 14，因此双方的可能字符串都不会超过 (3^{14}) 个。 
2. 生成后缀所有可能的哈希值。 对于部分字符串，更新其哈希值`hash = (hash * 127 + character) % MOD`。 可以对同一位置处的相同字符进行重复数据删除，因为选择第一个副本或第二个副本会生成相同的结果字符串。 
3. 对后缀哈希进行排序。 排序使我们能够使用以下方法找到大于或等于任何所需阈值的最小后缀哈希`bisect_left`。 
4. 以同样的方式生成前缀的哈希值。 我们不需要存储所有组合的前缀哈希，因为每个哈希都可以立即与排序后的后缀数组进行匹配。 
5. 对于前缀哈希 (L_h)，令 (R) 为后缀长度并计算

 [
 X=(L_h\cdot127^R)\bmod MOD。 
]

 使用此前缀的每个完整字符串都有分数

 [
 (X+H_r)\bmod MOD
 ]

 对于某些后缀哈希（H_r）。 
6. 考虑最小的后缀哈希。 如果`X + smallest_suffix < MOD`，它给出了该前缀的最佳非包装结果。 更大的后缀不能改善非包装结果，因为表达式在后缀哈希中增加。 
7.找到第一个满足的后缀哈希`suffix >= MOD - X`。 如果存在这样的值，则它会给出最佳的环绕结果。 同样，每个后面的后缀哈希都会产生至少同样大的结果，因为在包装表达式之后`X + suffix - MOD`。 
8. 在每个前缀哈希上保留最小的候选者。 这是该团队可能的最低得分。 
9. 对另一队运行相同的程序并比较两个结果的分数。 打印`Owls`如果猫头鹰得分较小，`Goats`如果山羊得分较小，并且`Tie`否则。 

它的工作原理源自固定前缀不变量。 一旦前缀哈希被固定，每个可能的完整分数都具有以下形式`(X + suffix_hash) mod MOD`。 下面的后缀哈希中`MOD-X`，表达式是递增的，所以最小的后缀哈希是最优的。 至少在后缀哈希中`MOD-X`，包装的表达式也在增加，因此该阈值的第一个后缀哈希是最佳的。 这是模结果仅有的两种可能的形式，因此检查这两种形式可以找到每个前缀的最佳完成方式。 由于检查了每个可能的前缀，因此找到了全局最小值。 

## Python 解决方案```python
import sys
from bisect import bisect_left

input = sys.stdin.readline

MOD = 1000000000000037
BASE = 127

def distinct_choices(strings, pos):
    a = ord(strings[0][pos])
    b = ord(strings[1][pos])
    c = ord(strings[2][pos])

    if a == b == c:
        return (a,)
    if a == b:
        return (a, c)
    if a == c:
        return (a, b)
    if b == c:
        return (a, b)

    return (a, b, c)

def small_hashes(strings, left, right):
    """All hashes for a segment of length at most 7."""
    values = [0]

    for pos in range(left, right):
        choices = distinct_choices(strings, pos)
        values = [
            (value * BASE + ch) % MOD
            for value in values
            for ch in choices
        ]

    return values

def segment_hashes(strings, left, right):
    """
    Generate all hashes for a segment of length at most 14.

    Split it into two pieces of at most 7 characters so that
    intermediate Python lists stay small.
    """
    length = right - left

    if length <= 7:
        return small_hashes(strings, left, right)

    middle = left + length // 2

    first = small_hashes(strings, left, middle)
    second = small_hashes(strings, middle, right)

    power = pow(BASE, right - middle, MOD)

    return [
        (x * power + y) % MOD
        for x in first
        for y in second
    ]

def best_score(strings):
    n = len(strings[0])

    left_len = n // 2
    right_start = left_len

    # Generate and sort every possible suffix hash.
    suffix_hashes = segment_hashes(strings, right_start, n)
    suffix_hashes.sort()

    min_suffix = suffix_hashes[0]
    right_len = n - right_start
    right_power = pow(BASE, right_len, MOD)

    # Generate prefix hashes in two small pieces.
    if left_len <= 7:
        prefix_hashes = small_hashes(strings, 0, left_len)
        prefix_parts = (prefix_hashes, None, 1)
    else:
        middle = left_len // 2
        first = small_hashes(strings, 0, middle)
        second = small_hashes(strings, middle, left_len)
        power_between = pow(BASE, left_len - middle, MOD)
        prefix_parts = (first, second, power_between)

    best = MOD

    first, second, power_between = prefix_parts

    if second is None:
        for prefix_hash in first:
            x = (prefix_hash * right_power) % MOD

            # Best non-wrapping candidate.
            candidate = x + min_suffix
            if candidate < MOD and candidate < best:
                best = candidate

            # Best wrapping candidate.
            threshold = MOD - x
            idx = bisect_left(suffix_hashes, threshold)

            if idx < len(suffix_hashes):
                candidate = x + suffix_hashes[idx] - MOD
                if candidate < best:
                    best = candidate
    else:
        for first_hash in first:
            base = (first_hash * power_between) % MOD

            for second_hash in second:
                prefix_hash = (base + second_hash) % MOD
                x = (prefix_hash * right_power) % MOD

                # Best non-wrapping candidate.
                candidate = x + min_suffix
                if candidate < MOD and candidate < best:
                    best = candidate

                # Best wrapping candidate.
                threshold = MOD - x
                idx = bisect_left(suffix_hashes, threshold)

                if idx < len(suffix_hashes):
                    candidate = x + suffix_hashes[idx] - MOD
                    if candidate < best:
                        best = candidate

    return best

def main():
    A, B = map(int, input().split())

    owls = [input().strip() for _ in range(3)]
    goats = [input().strip() for _ in range(3)]

    owls_score = best_score(owls)
    goats_score = best_score(goats)

    if owls_score < goats_score:
        print("Owls")
    elif goats_score < owls_score:
        print("Goats")
    else:
        print("Tie")

if __name__ == "__main__":
    main()
```这`distinct_choices`函数删除某个位置的重复字符。 这只是一种优化，因为重复的选择代表相同的字符，因此代表相同的构造字符串。`small_hashes`通过用一个字符重复扩展现有散列来枚举某个段的所有字符串。 该细分市场被刻意限制为七个职位。 在 7 个位置上，最多有 2187 个状态，这与最终的 (3^{14}) 状态集相比很小。`segment_hashes`将两个这样的小部分组合起来。 如果第一部分有哈希`x`第二部分有哈希`y`，连接的哈希是

 [
 (x\cdot127^{|第二个|}+y)\bmod MOD。 
]

 这正是中间相遇分裂所需的代数。`best_score`对后缀哈希进行一次排序。 对于每个前缀，`right_power`将其哈希值移动后缀字符的数量。 这`min_suffix`候选人处理非包装情况，而`bisect_left`找到导致换行的第一个后缀，因此是最佳换行候选者。 

Python 中不存在整数溢出问题，因为整数具有任意精度。 显式模运算仍然是必要的，因为该问题定义了分数模 (MOD)，并且保持值减小也可以保持算术效率。 

分割边界使用半开区间。 前缀是`[0, left_len)`，而后缀是`[left_len, n)`。 这可以避免意外地遗漏或重复分割位置处的字符。 

对七字边界的特殊处理也是经过深思熟虑的。 当段的长度最多为7时，直接生成。 当它较长时，它被分成两个较小的部分。 这使得最大的临时列表较小，同时保留相同的哈希集。 

## 工作示例

 ### 示例 1

 输入是```
6 6
ANDRES
FELIPE
MANUEL
VICTOR
IVANSS
DIEGOS
```对于每支球队，长度为 6 个，因此中间会合的双方各有 3 个角色。 每一方最多有 (3^3=27) 个可能的哈希值。 

对于 Owl，前三个位置可以产生 27 个可能的前缀哈希，后三个位置可以产生 27 个后缀哈希。 排序的后缀哈希允许算法为每个前缀找到最佳后缀。 

对应的轨迹是：

 | 变量| 猫头鹰 | 山羊 |
 | --- | --- | --- |
 | 长度 | 6 | 6 |
 | 前缀长度 | 3 | 3 |
 | 后缀长度 | 3 | 3 |
 | 每一半的最大哈希值 | 27 | 27 27 | 27
 | 最终结果| 较小| 更大|
 | 获胜者 | 猫头鹰 | |

 此示例的重要部分是该算法永远不会构造所有 (3^6=729) 个完整字符串。 它仅构造两组 27 个半哈希值，并通过模不等式将它们组合起来。 

### 示例 2

 输入是```
1 28
E
L
I
AAAAAAAAAAAAAAAAAAAAAAAAAAAA
BBBBBBBBBBBBBBBBBBBBBBBBBBBB
CCCCCCCCCCCCCCCCCCCCCCCCCCCC
```猫头鹰队只有一个位置。 他们的可能分数为 69、76 和 73，因此最低分数为 69。 

山羊队有28个位置，但每个位置都包含相同的三个选择，`A`,`B`， 和`C`。 该算法将这 28 个位置分成两组，每组 14 个。每一半最多包含 (3^{14}=4,782,969) 种可能性，尽管重复结构在实践中产生的不同哈希要少得多。 

高层的跟踪是：

 | 变量| 猫头鹰 | 山羊 |
 | --- | --- | --- |
 | 长度 | 1 | 28 | 28
 | 前缀长度 | 0 | 14 | 14
 | 后缀长度 | 1 | 14 | 14
 | 最大半态| 3 | 4,782,969 | 4,782,969
 | 最低最终分数 | 69 | 69 大于 69 |
 | 获胜者 | 猫头鹰 | |

 山羊多项式远大于约简前的模数，因此此示例也采用了模块化哈希，而不是普通的整数比较。 官方示例输出是`Goats`因为取模运算后，山羊的最低分数实际上更小。 

该示例特别有用，因为它演示了为什么原始多项式幅值不能用作分数的代理。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(3^{n/2}\log 3^{n/2})) | 最多生成 (3^{n/2}) 个后缀哈希，对它们进行排序，然后对每个前缀组合执行一次二分搜索 |
 | 空间| (O(3^{n/2})) | 排序后缀哈希主导内存使用 |

 对于 (n=28)，最大的一半包含 (3^{14}=4,782,969) 个组合。 该算法独立处理两支球队，因此在处理另一支球队之前释放大后缀数组。 七个字符的子分割还避免了同时保留多个大型中间 Python 列表。 与通过重复的全尺寸扩展构造 14 字符哈希列表相比，这可以更轻松地将实现保持在 256 MB 内存限制内。 

## 测试用例

 以下线束假设提交的解决方案保存为`solution.py`并暴露`main`。```python
# helper: run solution on input string, return output string
import sys
import io

from solution import main

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        main()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample 1
assert run(
    """6 6
ANDRES
FELIPE
MANUEL
VICTOR
IVANSS
DIEGOS
"""
) == "Owls", "sample 1"

# Provided sample 2
assert run(
    """1 28
E
L
I
AAAAAAAAAAAAAAAAAAAAAAAAAAAA
BBBBBBBBBBBBBBBBBBBBBBBBBBBB
CCCCCCCCCCCCCCCCCCCCCCCCCCCC
"""
) == "Goats", "sample 2"

# Minimum size, and all choices identical on both sides.
assert run(
    """1 1
A
A
A
A
A
A
"""
) == "Tie", "minimum size and identical choices"

# Small boundary case with different lengths.
# Owls can only make "AA", score 65*127+65 = 8320.
# Goats can only make "Z", score 90.
assert run(
    """2 1
AA
AA
AA
Z
Z
Z
"""
) == "Goats", "different lengths and two-character hash"

# Maximum size with identical values.
# Both teams can produce exactly the same 28-character string.
assert run(
    """28 28
AAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAA
"""
) == "Tie", "maximum length and all equal values"

# Duplicate choices at every position.
# The three members on each side are identical, so there is only one
# distinct constructed string per team.
assert run(
    """3 3
ABC
ABC
ABC
ABD
ABD
ABD
"""
) == "Owls", "duplicate choices and exact boundary split"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| --- | ---|
 | 样品1 |`Owls`| 官方示例和普通的中间人行为 |
 | 样品2 |`Goats`| 28 个字符字符串上的长度为 1 的处理和模块化环绕 |
 |`1 1`有六个`A`字符串|`Tie`| 最小尺寸和相同分数 |
 |`2 1`和`AA`相对`Z`|`Goats`| 不等长度和第一个非平凡的哈希指数 |
 |`28 28`与所有`A`|`Tie`| 最大输入长度和重复值 |
 |`3 3`具有重复的成员字符串 |`Owls`| 每个位置相同选择的重复数据删除 |

 ## 边缘情况

 ### 长度一

 考虑```
1 1
E
L
I
X
Y
Z
```猫头鹰可以选择`E`,`L`， 或者`I`，所以他们的最低分数是`69`。 属羊人可以选择`X`,`Y`， 或者`Z`，所以他们的最低分数是`88`。 

猫头鹰的前缀长度为零，后缀长度为一。 后缀数组包含三个 ASCII 值 69、73 和 76。单个前缀哈希值为零，因此算法直接计算最小后缀并获得 69。山羊类似地获得 88，给出`Owls`。 

这会捕获意外使用不正确的 127 次方作为最后一个字符的实现。 

### 重复选择

 考虑```
3 3
ABC
ABC
ABC
ABD
ABD
ABD
```在每个 Owls 位置，所有三个成员都给出相同的字符，因此恰好存在一个可能的字符串，`ABC`。 同样，山羊也只有一个可能的字符串，`ABD`。`distinct_choices`将每个位置的三个相同的角色选择变成一个选择。 因此，生成的哈希集每侧包含一个值，而不是 (3^3) 个重复结构。 然后比较只是比较散列`ABC`与散列`ABD`, 给予`Owls`。 

正确性不依赖于重复数据删除。 它仅删除等效分支。 

### 不等半长

 考虑```
2 1
AA
AA
AA
Z
Z
Z
```对于猫头鹰队来说，分割是一个角色加一个角色。 唯一可能的字符串是`AA`，其得分为

 [
 65\cdot127+65=8320。 
]

 对于山羊来说，唯一可能的字符串是`Z`，得分为 90。该算法独立处理不同的长度，因此猫头鹰的两字符哈希和山羊的单字符哈希永远不会混合。 结果是`Goats`。 

这会捕获一个差一错误，其中后缀长度是根据原始团队长度而不是当前拆分计算的。 

### 模块化环绕

 再次考虑第二个示例：```
1 28
E
L
I
AAAAAAAAAAAAAAAAAAAAAAAAAAAA
BBBBBBBBBBBBBBBBBBBBBBBBBBBB
CCCCCCCCCCCCCCCCCCCCCCCCCCCC
```猫头鹰的最低分数为 69。山羊的多项式值呈指数增长，因为它们的字符串包含 28 个位置。 该值反复以模 (10^{15}+37) 进行减小，因此最终分数与未模多项式并不单调相关。 

对于固定的 Goats 前缀哈希 (L)，该算法计算

 [
 X=(L\cdot127^{14})\bmod MOD。 
]

 然后，它至少在排序后的后缀哈希中搜索第一个值`MOD - X`。 该后缀正是第一个其加法环绕模数的后缀。 将生成的包装值与最小后缀哈希中的最佳非包装候选值进行比较。 

该算法从不假设较大的多项式必须具有较大的分数。 它比较实际的残差，这就是问题所要求的。 

### 二分搜索期间的精确阈值

 假设对于某个前缀，计算值是 (X)，并且后缀集恰好包含

 [
 MOD-X。 
]

 然后

 [
 (X+(MOD-X))\bmod MOD=0。 
]`bisect_left`故意搜索第一个大于或等于阈值的后缀，而不是严格大于。 这种平等情况必须被接受，因为它产生最佳的可能分数，零。 

粗心的实现使用`bisect_right`会跳过精确的零结果候选者，并可能返回更大的分数。 

### 最大长度

 对于长度为 28 的团队，每一半最多包含 (3^{14}=4,782,969) 个可能的字符串。 该实现一次处理一个团队的后缀数组，并通过组合两个 7 字符集来构造 14 字符集。 后者每个最多包含 2187 个元素，因此唯一的大分配是最终的后缀数组。 

直接针对排序后缀数组处理前缀组合，而不是存储另一个包含近 500 万个 Python 整数的数组。 这种不对称处理在 Python 中特别有用，因为数百万个 Python 整数的正常列表比 C++ 向量中相同数量的紧凑整数消耗更多的内存。 

当输入具有最大多样性时，所得算法仍然检查完整的 (3^{14}) 中间相遇状态空间，但从未接近 (3^{28}) 强力搜索空间。
