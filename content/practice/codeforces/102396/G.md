---
title: "CF 102396G - 重量溢出"
description: "我们最多有 25 个重物，每个重物都可以放在第一块板上、第二块板上，或者不使用。 该规模不与普通金额进行比较。 相反，它会减少两个塔板总和模 (m)，并在这两个余数相等时报告平衡。"
date: "2026-08-14T14:17:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102396
codeforces_index: "G"
codeforces_contest_name: "2019-2020 Saint-Petersburg Open High School Programming Contest (SpbKOSHP 19)"
rating: 0
weight: 102396
solve_time_s: 196
verified: false
draft: false
---

[CF 102396G - 重量溢出](https://codeforces.com/problemset/problem/102396/G)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 16s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们最多有 25 个重物，每个重物都可以放在第一块板上、第二块板上，或者不使用。 该规模不与普通金额进行比较。 相反，它会减少两个塔板总和模 (m)，并在这两个余数相等时报告平衡。 

如果第一个板包含集合 (L)，第二个板包含不相交集合 (R)，则所需条件为

 [
 \sum_{i\in L} a_i \equiv \sum_{i\in R} a_i \pmod m。 
]

 等价地，

 [
 \sum_{i\in L} a_i-\sum_{i\in R}a_i\equiv0\pmod m。 
]

 所以每个权重都恰好有三种可能的状态。 我们可以用 (0)、(+1) 和 (-1) 对这些状态进行编码，其中 (0) 表示未使用，(+1) 表示第一个板，(-1) 表示第二个板。 我们需要一个非零赋值，其符号和可被 (m) 整除。 

边界 (n\le25) 是中心线索。 直接枚举有 (3^n) 个状态，并且 (3^{25}=847288609443)，这远远超出了一秒解决方案可以检查的范围。 模 (m) 几乎可以是 (4\cdot10^7)，因此如果我们处理所有权重，则由每个残数索引的动态编程数组也将过于昂贵。 权重的数量相对较少，建议将它们分成两半，并在每一半中独立枚举三个选择。 

值 (a_i) 可以大到 (10^9)，但只有它们的余数模 (m) 会影响尺度。 Python整数也避免了溢出，因此在实现中不存在算术溢出问题。 

第一种边缘情况是(n=1)。 例如，```
1 5
3
```没有答案，因为唯一的非空放置将权重 3 放在一个板上，而将另一个空置，给出残数 3 和 0。仅检查某个子集总和是否可被 (m) 整除的粗心解决方案恰好可以处理这种情况，但基于比较两个独立生成的子集的解决方案必须明确禁止在两侧使用相同的权重。 

当单个权重已经可以被 (m) 整除时，就会出现第二种边缘情况。 例如，```
1 5
10
```有有效的输出```
1
1
0
```因为第一块板有残渣（10\bmod5=0），而第二块板是空的。 如果不小心实施，要求两个板都包含重量，则会拒绝有效答案。 

第三种边缘情况是（m=1）。 例如，```
1 1
7
```总是可解的，因为每个整数都与 0 模 1 同余。算法必须允许空板，并且不能意外地将所有未使用的分配视为有效答案。 

第四种边缘情况是普通总和不需要相等。 例如，```
4 14
1 3 7 10
```可以将重物（1,3,10）放在一个盘子上。 它们的普通和是 14，变成余数 0，而另一个盘子是空的。 仅寻找相等的普通和的解决方案将错过这种有效的模等式。 

## 方法

 蛮力方法直接从每个权重的三种可能状态得出。 对于每个权重，选择未使用的第一个板或第二个板，计算所得的有符号和模 (m)，并接受余数为零的非零分配。 这是正确的，因为每个合法布局都恰好对应于这三个状态分配之一。 

问题是作业的数量。 对于 (n=25)，有

 [
 3^{25}=847288609443
 ]

 的可能性。 即使检查一个分配只需要一次恒定时间操作，这对于一秒的限制来说也太大了。 

有用的观察是有符号和是可加的。 如果我们将权重分为两组，则每个完整的分配都可以写为前半部分的有符号和加上后半部分的有符号和。 对于前半部分产生的余数 (x)，我们只需要等于 (-x\bmod m) 的后半部分余数。 

这就是中间会合的想法。 我们不是探索所有 (3^n) 个作业，而是在一半中探索 (3^{\lfloor n/2\rfloor}) 个作业，在另一半中探索 (3^{\lceil n/2\rceil}) 个作业。 对于（n=25），这些数字是（3^{12}=531441）和（3^{13}=1594323），这是实用的。 

有一个细节使这一公式特别方便。 我们不仅存储前半部分中是否存在残数，还存储产生该残数的一个赋值。 当后半部分找到互补残基时，两个存储的分配一起直接描述两个板。 

全零赋值必须特殊处理。 它总是给出零余量，但禁止在任何地方不放置任何重量。 如果任何一半提供非零选择，则组合分配有效。 仅必须拒绝两个存储的代码都为零的情况。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(3^n)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳| (O(3^{\lceil n/2\rceil})) | (O(3^{\lfloor n/2\rfloor})) | 已接受 |

 ## 算法演练

 1. 将权重分成大小为 (\lfloor n/2\rfloor) 的前半部分和包含剩余权重的后半部分。 选择分割以使较大的枚举最多仅包含 13 个权重。 
2. 列举上半场的每项作业。 每个权重有三个选择：贡献 (0)、贡献 (+a_i) 或贡献 (-a_i)。 将生成的余数模 (m) 以及生成它的一个编码赋值一起存储在字典中。 如果多项作业产生相同的残数，则只需要一项，因为每一项对于完成解决方案都同样有用。 
3. 使用相同的三个选项枚举下半场的每项作业。 假设其有符号和有余数。 为了使完整的有符号和能被 (m) 整除，前半部分必须有余数

 [
 (-s)\bmod m。 
]

 查字典查一下这个残留物。 

1. 当找到匹配的残基时，对两个分配进行解码。 选择 (+1) 进入第一个板，选择 (-1) 进入第二个板，选择 (0) 被忽略。 
2. 仅当两个赋值代码均为零时才拒绝匹配。 在所有其他情况下，至少使用一个权重，并且两个半和相加为零模 (m)，因此天平是平衡的。 
3. 如果完整枚举结束后没有匹配项，则打印 (-1)。 每个可能的位置都由一对半分配来表示，因此不会错过任何解决方案。

为什么有效：每个合法位置都对应一个系数向量 (c_i\in{-1,0,+1})，其中系数表示盘子或未使用的状态。 当放置平衡尺度时，将向量分成两半给出满足 (x+y\equiv0\pmod m) 的残数 (x) 和 (y)。 前半部分字典包含它可以产生的每个残基的一个代表，后半部分搜索精确检查每个可能的后半部分分配的互补残基。 因此，找到每个有效的非空放置，而每个报告的放置都有可被 (m) 整除的签名总和。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    a = [x % m for x in map(int, input().split())]

    mid = n // 2
    left = a[:mid]
    right = a[mid:]

    # choice encoding:
    # 0 = unused
    # 1 = first plate
    # 2 = second plate
    #
    # Two bits are enough for every choice.
    first = {}

    def build_first(pos, end, residue, code):
        if pos == end:
            first.setdefault(residue, code)
            return

        x = a[pos]

        build_first(pos + 1, end, residue, code)

        nr = residue + x
        if nr >= m:
            nr -= m
        build_first(pos + 1, end, nr, code | (1 << (2 * (pos - 0))))

        nr = residue - x
        if nr < 0:
            nr += m
        build_first(pos + 1, end, nr, code | (2 << (2 * (pos - 0))))

    build_first(0, mid, 0, 0)

    answer = None

    def search_second(pos, end, residue, code):
        nonlocal answer

        if answer is not None:
            return

        if pos == end:
            need = (-residue) % m
            if need in first:
                left_code = first[need]
                if left_code != 0 or code != 0:
                    answer = (left_code, code)
            return

        x = a[pos]

        # Leave the weight unused.
        search_second(pos + 1, end, residue, code)

        if answer is not None:
            return

        # Put it on the first plate.
        nr = residue + x
        if nr >= m:
            nr -= m
        search_second(
            pos + 1,
            end,
            nr,
            code | (1 << (2 * (pos - mid)))
        )

        if answer is not None:
            return

        # Put it on the second plate.
        nr = residue - x
        if nr < 0:
            nr += m
        search_second(
            pos + 1,
            end,
            nr,
            code | (2 << (2 * (pos - mid)))
        )

    search_second(mid, n, 0, 0)

    if answer is None:
        return "-1\n"

    left_code, right_code = answer
    first_plate = []
    second_plate = []

    for i in range(mid):
        choice = (left_code >> (2 * i)) & 3
        if choice == 1:
            first_plate.append(i + 1)
        elif choice == 2:
            second_plate.append(i + 1)

    for i in range(n - mid):
        choice = (right_code >> (2 * i)) & 3
        idx = mid + i + 1
        if choice == 1:
            first_plate.append(idx)
        elif choice == 2:
            second_plate.append(idx)

    out = [
        str(len(first_plate)),
        " ".join(map(str, first_plate)),
        str(len(second_plate)),
        " ".join(map(str, second_plate)),
    ]
    return "\n".join(out) + "\n"

if __name__ == "__main__":
    sys.stdout.write(solve())
```前半部分存储在由残差键控的字典中。`setdefault`保留残基遇到的第一个分配并避免不必要的替换。 由于每个残留物只需要一名见证人，因此这就足够了。 

该分配使用每个权重两位进行编码。 值 0、1 和 2 代表未使用、第一块板和第二块板。 将代码保留为整数使得字典比存储每个状态的 Python 列表或元组小得多。 

递归在每次转换时计算模 (m) 的余数。 由于当前余数已经在(0)到(m-1)的范围内，因此余数加1最多需要减1次(m)，减1最多需要加1次(m)。 这避免了更昂贵的一般`%`枚举最热门部分内的操作。 

两半使用单独的本地位位置。 解码后半部分时，索引移位`mid`恢复原来的重量编号。 因此，可以在两半中使用相同的本地编码。 

Python 不会遇到使用 32 位整数的语言中会发生的固定宽度整数溢出问题。 原始权重在计数之前以模 (m) 减少，因此每个存储的残差无论如何仍然很小。 

## 工作示例

 对于样品 1，```
4 14
1 3 7 10
```分割是（ [1,3] \mid [7,10] ）。 前半部分可以产生带符号的残基，例如 (0,1,3,4,10,12,\ldots)。 后半部分搜索最终考虑将权重10放在第一个盘子上，这会贡献残数10。它的补数是（​​14-10=4），前半部分通过将权重1和3放在第一个盘子上可以产生残数4。 

| 舞台| 上半场剩余| 下半场剩余| 所需残留量| 找到作业 |
 | --- | --- | --- | --- | --- |
 | 初始| 0 | 0 | 0 | 全部未使用，被拒绝|
 | 上半年枚举| 4 | 0 | 0 | 权重 1 和 2 产生 4 |
 | 下半年搜索 | 4 | 10 | 10 4 | 找到匹配项 |

 最终的结果是，第一个盘子上放置了重物 1、2 和 4，而第二个盘子上什么也没有。 它们的普通总和是 (1+3+10=14)，因此在模 14 的两个板上都可以看到 (0)。这表明该算法正在寻找模相等而不是普通和的相等。 

对于样品 2，```
3 7
1 2 4
```分割是（ [1]\mid[2,4] ）。 前半部分产生残数 (0,1,6)。 后半部分可以通过将重物 2 和 4 放在第一个板上来产生残渣 6。 其所需补码为1，该补码存在于前半部字典中。 

| 舞台| 上半场剩余| 下半场剩余| 所需残留量| 找到作业 |
 | --- | --- | --- | --- | --- |
 | 初始| 0 | 0 | 0 | 全部未使用，被拒绝|
 | 上半年枚举| 1 | 0 | 0 | 重量 1 产生 1 |
 | 下半年枚举| 1 | 6 | 1 | 权重 2 和 3 产生 6 |

 最终的放置将所有三个重量放在第一个板上。 它们的和是 (1+2+4=7)，模 7 为零，而第二个盘子是空的。 这也是为什么空的第二个盘子是合法的一个有用的例子。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(3^{\lceil n/2\rceil})) | 每一半枚举每个三元赋值，较大的一半最多有 13 个权重。 |
 | 空间| (O(3^{\lfloor n/2\rfloor})) | 字典为较小的一半生成的每个不同残基存储一个分配。 |

 在 (n=25) 时，较大的一半有 (3^{13}=1,594,323) 个分配，而存储的一半最多有 (3^{12}=531,441) 个条目。 这比 (3^{25}) 暴力搜索要小得多，并且通过实现所使用的紧凑整数表示形式可以轻松满足 512 MB 内存限制。 

## 测试用例

 下面的测试工具检查返回的布局的结构有效性，而不需要特定的有效见证人。 这是测试这个问题的正确方法，因为许多不同的输出可以满足相同的输入。```python
import sys
import io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    try:
        return solve()
    finally:
        sys.stdin = old_stdin

def check_output(inp: str, out: str) -> bool:
    data = list(map(int, inp.split()))
    n, m = data[0], data[1]
    a = data[2:2 + n]

    tokens = out.split()
    if not tokens:
        return False

    if tokens[0] == "-1":
        return len(tokens) == 1

    p = 0

    k = int(tokens[p])
    p += 1
    left = [int(tokens[p + i]) for i in range(k)]
    p += k

    q = int(tokens[p])
    p += 1
    right = [int(tokens[p + i]) for i in range(q)]
    p += q

    if p != len(tokens):
        return False

    if k + q == 0:
        return False

    if any(x < 1 or x > n for x in left + right):
        return False

    if len(set(left)) != len(left):
        return False
    if len(set(right)) != len(right):
        return False
    if set(left) & set(right):
        return False

    s_left = sum(a[i - 1] for i in left) % m
    s_right = sum(a[i - 1] for i in right) % m

    return s_left == s_right

# Provided sample 1
sample1 = """\
4 14
1 3 7 10
"""
out = run(sample1)
assert check_output(sample1, out), "sample 1"

# Provided sample 2
sample2 = """\
3 7
1 2 4
"""
out = run(sample2)
assert check_output(sample2, out), "sample 2"

# Minimum size, and m = 1.
case1 = """\
1 1
7
"""
out = run(case1)
assert check_output(case1, out), "minimum size"

# Minimum size with no possible answer.
case2 = """\
1 5
3
"""
assert run(case2).strip() == "-1", "single weight with nonzero residue"

# All equal values. One copy can balance another.
case3 = """\
4 10
7 7 7 7
"""
out = run(case3)
assert check_output(case3, out), "all equal values"

# Boundary-style pair: 2 + 3 = 5 modulo 5.
case4 = """\
2 5
2 3
"""
out = run(case4)
assert check_output(case4, out), "modulo boundary"

# Maximum n and a guaranteed no-answer instance.
# The sum of all powers of two is 2^25 - 1 = 33554431,
# which is smaller than m, so every subset has a distinct ordinary sum.
powers = [1 << i for i in range(25)]
case5 = "25 39999999\n" + " ".join(map(str, powers)) + "\n"
assert run(case5).strip() == "-1", "maximum-size no-answer case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / 7`| 任何有效的非空展示位置 | 最小值 (n)、模 1 和空的第二块板 |
 |`1 5 / 3`|`-1`| 最小不可能实例 |
 |`4 10 / 7 7 7 7`| 任何具有相等非空或空侧残基的放置 | 全部相等的值和重复的残基 |
 |`2 5 / 2 3`| 每个盘子上有一个重物| 精确模边界 |
 |`25 39999999 / 1 2 4 ... 2^24`|`-1`| 最大（n）、大（m）和无模块碰撞的情况 |

 ## 边缘情况

 对于```
1 5
3
```前半部分为空，后半部分包含权重 3。前半部分字典仅包含带有空赋值的残差 0。 后半部分可以产生残基 0、3 和 2，但只有残基 0 具有匹配的补码。 该比赛在任何半场都不会使用权重，因此算法会拒绝它并打印`-1`。 这正是所需的行为。 

为了```
1 5
10
```唯一的权重具有残差 0。前半部分字典再次包含残差 0，而将权重 1 放在第一个板上的后半部分分配也具有残差 0。两个分配代码不都是零，因此匹配被接受。 输出将权重 1 放在第一个板上，并将第二个板留空。 

为了```
1 1
7
```每个残数都为零，因为模数为 1。后半部分枚举立即找到残数为零的非空赋值，前半部分空赋值提供所需的补码。 所得到的放置是有效的，因为每个塔板总和都等于 0 模 1。 

对于```
4 14
1 3 7 10
```前半部分可以从放置在第一个板上的重物 1 和 2 产生带符号的余数 4。 将权重 4 放在第一个板上的下半场作业贡献了余数 10。由于 (4+10=14)，它们的组合符号余数为零。 因此，输出可以将权重 1、2 和 4 放在第一个板上，给出模和为零，而第二个板为空。 

对于最大尺寸无应答情况```
25 39999999
1 2 4 8 16 32 64 128 256 512 1024 2048 4096
8192 16384 32768 65536 131072 262144 524288 1048576
2097152 4194304 8388608 16777216
```所有权重的总和为(2^{25}-1=33554431)，小于(m)。 因此，每个子集都有不同的普通和，因此两个不相交的子集不能有相等的和，除非两者都是空的。 由于总数永远不会达到 (m)，因此也不存在总和可被 (m) 整除的非空子集。 中间相遇搜索耗尽所有三态分配并正确返回`-1`。
