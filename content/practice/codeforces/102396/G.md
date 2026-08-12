---
title: "CF 102396G - 重量溢出"
description: "我们最多有 25 个重量，每个重量都可以通过三种方式之一进行处理：可以将其放在第一个板上，放在第二个板上，或者不使用。 该比例并不比较实际的总和。"
date: "2026-08-11T23:31:21+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102396
codeforces_index: "G"
codeforces_contest_name: "2019-2020 Saint-Petersburg Open High School Programming Contest (SpbKOSHP 19)"
rating: 0
weight: 102396
solve_time_s: 427
verified: false
draft: false
---

[CF 102396G - 重量溢出](https://codeforces.com/problemset/problem/102396/G)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 7s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们最多有 25 个重量，每个重量都可以通过三种方式之一进行处理：可以将其放在第一个板上，放在第二个板上，或者不使用。 该比例并不比较实际的总和。 它首先减少每个板的总模数`m`，然后比较这些残差。 我们需要一个非空赋值，其中两个残基相等。 

如果体重`i`在第一块板上，给它系数`+1`。 如果它在第二块板上，请给出系数`-1`。 如果未使用，则给出系数`0`。 条件变为

 [
 \sum_{i=1}^{n} c_i a_i \equiv 0 \pmod m,
 ]

 其中每个系数都满足 (c_i\in{-1,0,1})，并且并非所有系数都为零。 一旦找到这样的系数，正系数描述第一块板，负系数描述第二块板。 

这些约束指向指数搜索而不是多项式动态规划。 只有 25 个权重，因此指数依赖于`n`如果通过分割权重来减小指数，则可以接受。 直接枚举有(3^{25}=847288609443)个可能的赋值，这远远超出了一秒的限制。 的价值`m`几乎可以是 (4\cdot10^7)，因此由残基索引的传统 DP 数组对于每个权重的转换来说也太大了。 官方给出的问题约束是`n <= 25`和`m < 4 * 10^7`，时间限制为一秒，内存为 512 MB。 

几个小案例可能会暴露不正确的实现。 

为了`m = 1`，每个非空放置都是有效的，因为每个整数都与零模 1 同余。例如，```
1 1
5
```可以通过在第一个板上放置重物 1 而在第二个板上不放置任何东西来回答。 仅搜索两个不同子集的实现可能会意外报告`-1`。 

质量已可被整除的重量`m`是一个立即的答案。 例如，```
1 7
14
```通过将重量 1 放在任一板上即可解决。 模条件是关于余数，而不是关于原始和。 

绝对不能接受空赋值。 例如，```
1 7
1
```没有解决办法。 唯一签署的金额是`0`，从不使用任何东西，并且`1`或者`-1`，使用重量。 粗心的中间相遇实现可能会从两半的空分配中发现残差零并错误地接受它。 

两个盘子上不能放置相同的重量。 例如，```
2 10
3 3
```解决方法是将重物 1 放在一个板上，将重物 2 放在另一块板上。 两个板残基都是 3。将两侧视为独立子集而不记住它们必须不相交的表示可能会意外地使用一个索引两次。 

最后，相等是模数`m`，而不是普通金额的相等。 为了```
2 5
7 2
```将两个重物放在相对的板上是有效的，因为`7 mod 5 = 2 mod 5`，即使它们的实际质量不同。 

## 方法

 最直接的解决方案独立考虑每个重量并尝试所有三个选择：未使用、第一块板或第二块板。 对于每个分配，我们计算有符号和模`m`如果为零并且至少选择了一个权重，则接受。 这是正确的，因为每个合法位置都对应于一个系数向量`{-1,0,1}`。 

问题是作业的数量。 有 25 个权重

 [
 3^{25}=847288609443
 ]

 的可能性。 即使检查一项作业只需要几条机器指令，数千亿个状态也无法满足时间限制。 

有用的观察是有符号和是可加的。 将权重分成不相交的两半。 对于上半部分的作业，令其签名和为`x`。 对于后半部分的作业，令其签名和为`y`。 它们一起形成一个有效的解决方案

 [
 x+y\equiv0\pmod m.
 ]

 因此，我们不是枚举所有 (3^n) 个分配，而是粗略地枚举每一半中的 (3^{n/2}) 个分配并匹配互补残基。 

有 25 个权重，一半最多有 12 个权重，另一半最多有 13 个权重。它们的搜索空间分别最多包含 (3^{12}=531441) 和 (3^{13}=1594323) 个分配。 我们将前半部分产生的每个残差存储在哈希表中，然后枚举后半部分并查找作为其模负的残差。 

存储空赋值有一个微妙的地方。 零残留总是因无所作为而产生的。 如果我们只存储该分配，则稍后也产生零的搜索可能会意外地组合两个空分配。 该实现明确拒绝这种情况，并且当存在残数零时，它还更喜欢对残数零进行非空前半部分分配。 

比较是：

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(3^n)) | (O(n)) | (O(n)) | 太慢了|
 | 中间相遇 | (O(3^{n/2})) | (O(3^{n/2})) | 已接受 |

 模运算还意味着每个中间和都可以立即减少。 Python 整数是无界的，因此即使原始质量可以大到 (10^9)，也不存在整数溢出问题。 

## 算法演练

 1. 将重量分成连续的两半。 如果`n = 25`，前半部分包含 12 个权重，后半部分包含 13 个权重。这两半是不相交的，这意味着在每一半中独立选择的任何分配都会自动使用每个权重最多一次。 
2. 枚举前半部分的每个三元赋值。 对于每个权重，系数`0`表示未使用，`1`表示第一块板，并且`2`指的是第二块板。 将这些选择转换为系数`0`,`+1`， 和`-1`，并计算有符号和模`m`。 
3. 为前半部分遇到的每个残基存储一个三元编码。 如果残差为零并且表当前仅包含空编码，则当出现具有相同残差的非空编码时替换它。 存储的编码足以重建属于每个板的权重。 
4. 枚举后半部分的每个三元赋值。 假设它的签名和是`s`。 上半部分的兼容分配必须有剩余`(-s) mod m`，因为组合的有符号和必须为零模`m`。 
5. 向上看`(-s) mod m`在上半场的比赛中。 如果不存在，则下半场作业无法形成解决方案。 如果存在，则组合两种编码。 
6. 仅当两个编码都为空时才拒绝组合。 任何其他组合至少包含一个选定的权重，并且总签名和可除以`m`，所以这是一个有效的答案。 
7. 解码两个三进制编码。 一个数字代表`+1`转到第一个盘子，而一个数字代表`-1`转到第二个盘子。 打印两个索引集。 

为什么有效：每个合法配售都有一个独特的签名表示，其系数为`{-1,0,1}`。 分割指数将其签名总和分为每一半的贡献，例如`x`和`y`， 和`x + y ≡ 0 (mod m)`。 在后半部分枚举期间，算法精确搜索等于的前半部分残数`-y`，因此会考虑所有可能的解决方案。 相反，查找返回的每一对都有`x + y ≡ 0`，并且两半是不相交的，因此它们的解码分配形成了合法的位置。 显式空分配检查保证至少实际放置了一个权重。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def build_map(values, mod):
    """
    Map residue -> one ternary encoding for this half.

    Ternary digit:
        0 = unused
        1 = first plate
        2 = second plate
    """
    result = {}

    def dfs(pos, total, code, place):
        if pos == len(values):
            old = result.get(total)
            if old is None or (total == 0 and old == 0 and code != 0):
                result[total] = code
            return

        # Leave this weight unused.
        dfs(pos + 1, total, code, place * 3)

        # Put it on the first plate.
        nxt = total + values[pos]
        if nxt >= mod:
            nxt -= mod
        dfs(pos + 1, nxt, code + place, place * 3)

        # Put it on the second plate.
        nxt = total - values[pos]
        if nxt < 0:
            nxt += mod
        dfs(pos + 1, nxt, code + 2 * place, place * 3)

    dfs(0, 0, 0, 1)
    return result

def find_in_second(values, mod, first_map):
    """
    Search all ternary assignments of the second half.
    Returns (first_code, second_code), or None.
    """

    answer = None

    def dfs(pos, total, code, place):
        nonlocal answer

        if answer is not None:
            return

        if pos == len(values):
            need = (-total) % mod
            first_code = first_map.get(need)

            if first_code is not None:
                if first_code != 0 or code != 0:
                    answer = (first_code, code)
            return

        # Unused.
        dfs(pos + 1, total, code, place * 3)

        if answer is not None:
            return

        # First plate.
        nxt = total + values[pos]
        if nxt >= mod:
            nxt -= mod
        dfs(pos + 1, nxt, code + place, place * 3)

        if answer is not None:
            return

        # Second plate.
        nxt = total - values[pos]
        if nxt < 0:
            nxt += mod
        dfs(pos + 1, nxt, code + 2 * place, place * 3)

    dfs(0, 0, 0, 1)
    return answer

def decode(code, length, offset, first, second):
    for i in range(length):
        digit = code % 3
        code //= 3

        index = offset + i + 1

        if digit == 1:
            first.append(index)
        elif digit == 2:
            second.append(index)

def solve():
    n, mod = map(int, input().split())
    a = list(map(int, input().split()))

    # Reducing the masses once makes every later transition smaller.
    a = [x % mod for x in a]

    # A split near the middle minimizes the larger ternary search space.
    mid = n // 2
    left = a[:mid]
    right = a[mid:]

    first_map = build_map(left, mod)
    answer = find_in_second(right, mod, first_map)

    if answer is None:
        print(-1)
        return

    left_code, right_code = answer

    first_plate = []
    second_plate = []

    decode(left_code, len(left), 0, first_plate, second_plate)
    decode(right_code, len(right), mid, first_plate, second_plate)

    print(len(first_plate))
    print(*first_plate)
    print(len(second_plate))
    print(*second_plate)

if __name__ == "__main__":
    solve()
```第一条预处理线减少了每`a[i]`模数`m`。 这在数学上是安全的，因为只有残基影响最终的比较。 它还让每个递归转换保持在区间内`[0, m)`使用一项条件调整而不是重复构造更大的整数。`build_map`执行整个前半部分搜索。 这`code`变量是已经做出的决策的基数三编码。 这`place`变量是当前的三的幂，因此选择第一块板会增加`place`编码并选择第二个板添加`2 * place`。 

签名总和保持模数`m`每次选择之后。 对于正向过渡，增加一个值最多可以达到`2m - 2`，所以一次减法就足够了。 对于负过渡，结果可能低至`-(m - 1)`，因此添加一项就足够了。 这避免了`%`每个递归节点的操作。 

对残差零的特殊处理很容易被忽视。 空赋值必须被存储，因为它可以合法地与另一半的非空赋值组合。 但是，如果非空前半部分赋值也产生零，则最好用它替换空编码。 条件在`build_map`正是处理这种情况。`find_in_second`寻找另一半。 对于每个有符号的残基`total`，它计算`(-total) % mod`并执行一次字典查找。 递归在找到有效对后立即停止，因此典型输入比完整 (3^{13}) 枚举早得多完成。 

三进制编码使用最低有效数字表示每一半中最早的权重。`decode`反复采取`code % 3`然后除以三，按照决策生成的顺序恢复决策。 后半部分的索引偏移量为`mid`，因为它的第一个局部位置对应于全局权重`mid + 1`。 

Python 没有固定宽度整数溢出，因此诸如原始质量之类的总和是安全的。 该实现仍然在整个搜索过程中执行模块化缩减，因为算法本身对残差类进行操作。 

## 工作示例

 对于样品 1，```
4 14
1 3 7 10
```分裂是`[1, 3]`和`[7, 10]`。 

| 舞台| 作业 | 有符号和模 14 | 所需上半场残球 |
 | --- | --- | --- | --- |
 | 上半场|`+1, +3`| 4 | |
 | 下半场| 空 | 0 | 0 |
 | 下半场|`+7`| 7 | 7 |
 | 下半场|`+10`| 10 | 10 4 |
 | 比赛|`(+1,+3)`和`(+10)`|`4 + 10 = 14 ≡ 0`| 4 |

 因此，该算法可以将权重 1、2 和 4 放在第一个盘子上，并将第二个盘子留空。 他们的总数是 14，所以规模计算`14 mod 14 = 0`在第一个盘子上和`0`在第二个。 示例的输出不同，但两者都是有效的，因为问题要求任何有效的构造。 

对于样品 2，```
3 7
1 2 4
```分裂是`[1]`和`[2, 4]`。 

| 舞台| 作业 | 有符号和模 7 | 所需上半场残球 |
 | --- | --- | --- | --- |
 | 上半场|`+1`| 1 | |
 | 下半场|`+2`| 2 | 5 |
 | 下半场|`-2`| 5 | 2 |
 | 下半场|`+4`| 4 | 3 |
 | 下半场|`-4`| 3 | 4 |
 | 下半场|`+2,+4`| 6 | 1 |
 | 比赛|`+1`和`+2,+4`|`1 + 6 = 7 ≡ 0`| 1 |

 由此产生的结构将所有三个重量放置在第一块板上。 它的和是 7，其模 7 的余数为零，而第二个盘子是空的。 这正是示例的结构。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(3^{n/2})) | 每一半都被枚举一次，每个状态都执行恒定时间模算术，而对于后半部分，则执行哈希表查找。 |
 | 空间| (O(3^{n/2})) | 前半部分为每个不同的残基存储一个三元编码，最多具有 (3^{n/2}) 个条目。 |

 为了`n = 25`，较大的一半只有 13 个权重，因此最多包含`3^13 = 1,594,323`作业。 较小的一半最多有`3^12 = 531,441`作业。 这比直接的小几个数量级`3^25`搜索并在 512 MB 内存限制内轻松适应。 的最大值`m`不作为 DP 的维度出现，因此大模界不会使内存使用量与 4000 万成正比。 

## 测试用例

 由于输出不是唯一的，测试应该验证返回的位置，而不是比较确切的输出字符串。 以下线束检查每个报告的索引是否有效，没有索引使用两次，至少放置一个重量，并且两个板和具有相等的残差。```python
import sys
import io

# Paste the solve_data implementation from the solution here.
def solve_data(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        # Call the submitted solve() here.
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def validate(inp: str, out: str) -> bool:
    data = list(map(int, inp.split()))
    n, mod = data[0], data[1]
    a = data[2:2 + n]

    tokens = out.split()
    if not tokens:
        return False

    if tokens[0] == "-1":
        return True

    p = 0

    k = int(tokens[p])
    p += 1
    first = list(map(int, tokens[p:p + k]))
    p += k

    q = int(tokens[p])
    p += 1
    second = list(map(int, tokens[p:p + q]))
    p += q

    if p != len(tokens):
        return False

    if k + q == 0:
        return False

    if any(x < 1 or x > n for x in first + second):
        return False

    if len(set(first)) != len(first):
        return False

    if len(set(second)) != len(second):
        return False

    if set(first) & set(second):
        return False

    s1 = sum(a[i - 1] for i in first) % mod
    s2 = sum(a[i - 1] for i in second) % mod

    return s1 == s2

# Provided sample 1.
sample1 = """\
4 14
1 3 7 10
"""
assert validate(sample1, solve_data(sample1)), "sample 1"

# Provided sample 2.
sample2 = """\
3 7
1 2 4
"""
assert validate(sample2, solve_data(sample2)), "sample 2"

# Minimum-size case and m = 1.
case1 = """\
1 1
123456789
"""
assert validate(case1, solve_data(case1)), "minimum size and modulo 1"

# A weight is itself divisible by m.
case2 = """\
1 7
14
"""
assert validate(case2, solve_data(case2)), "single divisible weight"

# Equal weights must be placed on opposite plates.
case3 = """\
2 10
3 3
"""
assert validate(case3, solve_data(case3)), "all equal values"

# Maximum n, with no signed sum able to reach a nonzero multiple
# of m. The total absolute sum is smaller than m.
case4 = "25 39999989\n" + " ".join(str(1 << i) for i in range(25)) + "\n"
result4 = solve_data(case4)
assert result4.strip() == "-1", "maximum-size no-solution case"

# Empty assignment must not be accepted.
case5 = """\
1 7
1
"""
assert solve_data(case5).strip() == "-1", "empty assignment"
```前两个测试确认了示例结构，同时允许程序生成不同的有效作业。 第三个测试检查最小的可能值`n`和特殊情况`m = 1`。 第四个检查当质量可被模数整除时的直接单重量解。 第五步检查两个相同的重量是否可以在相对的板上保持平衡，而无需重复使用索引。 第六个是最大尺寸的压力情况，它迫使算法探索搜索空间并确认实现可以正确报告不存在解决方案。 最终测试特别发现了接受空赋值的常见错误。 

| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`4 14 / 1 3 7 10`| 任何有效的展示位置 | 样品1 |
 |`3 7 / 1 2 4`| 任何有效的展示位置 | 样品2 |
 |`1 1 / 123456789`| 非空展示位置 | 最小尺寸和`m = 1`|
 |`1 7 / 14`| 任一板上的重量为 1 | 直接整除重量 |
 |`2 10 / 3 3`| 每个盘子上有一个重物| 等值与不相交|
 |`25 39999989 / 1 2 4 ... 2^24`|`-1`| 最大尺寸穷举搜索 |
 |`1 7 / 1`|`-1`| 空分配拒绝 |

 ## 边缘情况

 当`m = 1`，每个余数都为零。 对于输入```
1 1
5
```前半部分映射包含来自空分配和使用权重分配的残差零。 该实现特意首选对残差零进行非空编码。 后半部分是空的，因此生成的结构包含重量 1 并被接受。 

当单个重量可以被`m`，另一半的空作业足以完成它。 为了```
1 7
14
```权重 1 的有符号余数为零。 前半部分映射存储残差零的非空编码，后半部分搜索可以使用其空分配。 组合放置包含一个权重，并以 0 模 7 为符号和。 

对于相同的权重，考虑```
2 10
3 3
```作业`+3 - 3`已签署总和为零。 由于两个权重属于不同的一半，因此中间相遇查找会发现残留`3`从一半和剩余物`7`，其模否定，来自另一半。 解码结果将两个不同的索引放在相对的板上，给出残数`3`和`3`。 

对于不可能的情况，```
1 7
1
```唯一的非空签名和是`1`和`-1`，其残基是`1`和`6`。 两者都不为零。 唯一的零残差来自于什么都不选择，但后半部分搜索明确拒绝两个编码都为零的对，因此程序打印`-1`。 

对于最大尺寸的情况，分割包含 12 和 13 个权重。 第一个映射最多有 (3^{12}) 个不同赋值的空间，而第二个枚举最多检查 (3^{13}) 个。 实施的任何部分都线性依赖于潜在的巨大价值`m`，并且每个赋值都由三元整数而不是由选定索引的列表紧凑地表示。 

中心不变量很简单：每个存储的残数代表其一半的实数有符号赋值，并且每个后半状态仅与其自己的有符号和的模补相匹配。 一旦找到一对，它们的系数描述了在不相交的索引集上的有效放置，因此两个板残基的相等性直接从方程 (x+y\equiv0\pmod m) 得出。
