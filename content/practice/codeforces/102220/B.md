---
title: "CF 102220B - 均衡饮食"
description: "我们有 (m) 种糖果和 (n) 种单独糖果。 每个糖果都有一个正值 (ai) 并且属于一个类型 (bi)。 对于每种类型 (j)，都有一个阈值 (lj)。 如果我们购买任何这种类型的糖果，我们必须至少购买 (lj) 个。 购买零也是允许的。"
date: "2026-08-19T00:14:44+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102220
codeforces_index: "B"
codeforces_contest_name: "The 13th Chinese Northeast Collegiate Programming Contest"
rating: 0
weight: 102220
solve_time_s: 284
verified: true
draft: false
---

[CF 102220B - 均衡饮食](https://codeforces.com/problemset/problem/102220/B)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有 (m) 种糖果和 (n) 种单独糖果。 每个糖果都有一个正值 (a_i) 并且属于一个类型 (b_i)。 对于每种类型 (j)，都有一个阈值 (l_j)。 如果我们购买任何这种类型的糖果，我们必须至少购买 (l_j) 个。 购买零也是允许的。 

对于选定的集合，令 (S) 为所有购买值的总和，并令 (C) 为属于任何一种类型的购买糖果的最大数量。 得分为（S/C）。 我们需要最大可能的分数，以简化分数表示。 

这些限制使得预期的结构非常清晰。 一个测试用例可以包含（10^5）颗糖果，而所有测试用例的（n）和（m）之和最多为（10^6）。 (O(n^2)) 或指数算法是立即不可能的。 即使是 (O(nm)) 方法，在一个大的情况下也可以达到 (10^{10}) 次运算。 我们大约需要 (O(n\log n+m))，其中对数因子来自排序。 

有几种边缘情况可能会使看似合理的解决方案变得不正确。 首先，阈值大于其可用糖果数量的类型根本无法做出贡献。 例如，```
1
2 1
2
5 1
1 1
```唯一有效的选择是两种糖果，所以答案是（6/2=3/1）。 只选择价值 5 的糖果会得到更大的分数，但这种选择违反了阈值。 

第二个边缘情况是 (l_j=1)。 在这种情况下，我们可以从该类型中获取任意正数的糖果，包括所有糖果。 例如，```
1
3 2
1 3
10 1
9 1
1 2
```单独取价值 10 的甜食给出 (10/1)，这是最佳的。 假设每个选定类型必须准确贡献其阈值的解决方案将错过这种可能性。 

第三个微妙之处是优化过程中使用的参数 (k) 不一定是结果集的实际最大计数。 例如，```
1
2 2
1 1
10 1
1 2
```对于 (k=2)，我们可以同时拿走糖果，并除以所施加的界限 (k) 时得到 (11/2)，即使实际的最大计数仅为 (1)。 同一个集合有分数（11/1），这是在（k=1）时考虑的。 因此，我们可以在每种类型最多有 (k) 个选定糖果的条件下进行优化，而不是坚持某种类型恰好有 (k) 个。 

## 方法

 蛮力方法很简单。 我们可以枚举 (n) 种糖果的每个子集，计算它包含的每种类型的糖果数量，拒绝违反阈值的子集，计算 (S)、计算 (C) 和最大化 (S/C)。 这是正确的，因为每种可能的购买都由一个子集表示。 不幸的是，有 (2^n) 个子集，当 (n=100000) 时，子集已经约为 (10^{30103})。 即使在考虑评估每个子集所需的工作之前，这也是完全不可行的。 

重新组织问题的有用方法是停止选择单个子集，而是固定分母。 假设我们决定没有任何类型可以贡献超过 (k) 种糖果。 考虑一种包含糖果的类型，按值从大到小排序为 (v_1,v_2,\ldots,v_s)。 

如果(s<l)，则永远不能选择这种类型，因为即使选择一种糖果也会违反最小值。 如果(s\ge l)但是(k<l)，则在当前界限(k)下也不能选择类型。 如果 (l\le k)，最好的选择是取最大的 (\min(k,s)) 值。 所有值都是正值，因此没有理由丢弃允许的高价值糖果。 

令(F(k))为每种类型最多贡献(k)颗糖果时可获得的最大总值。 对于具有排序值 (v_1,\ldots,v_s) 的类型，其贡献为

 [
 0 \quad\text{对于 } k<l,
 ]

 和

 [
 v_1+\cdots+v_k
 ]

 for (l\le k\le s)，而它是 (k>s) 的类型总和。 

剩下的问题是为每个 (k) 计算 (F(k))，而不需要重复对前缀求和。 关键的观察结果是随着 (k) 的增加，贡献的变化非常简单。 在 (k=l) 处，该类型突然贡献前 (l) 个最大值。 当 (k) 从 (k-1) 增加到 (k) 时，贡献正好增加 (v_k)，直到该类型的所有糖果都被包括在内。 

因此，对于每种类型，我们都可以将其更改添加到数组中。 如果它的阈值是 (l)，我们将其最大 (l) 值的总和添加到`gain[l]`。 对于后面的每个位置 (k)，直到类型的大小，我们将 (v_k) 添加到`gain[k]`。 前缀总和超过`gain`然后对于每个 (k) 给出 (F(k))。 

我们只需按类型然后按价值递减对糖果进行排序。 排序后，每个甜蜜操作的总数是线性的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(2^nn)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳| (O(n\log n+m+n)) | (O(n+m)) | 已接受 |

 ## 算法演练

 1. 读取每种类型的阈值 (l_j)。 存储阈值，以便在处理其糖果时可以立即获取该类型的阈值。 
2. 按类型对所有糖果进行排序，并在每种类型内按价值递减排序。 这将每种类型放入一个连续的部分，其中最有价值的糖果放在第一位。 我们不需要为所有 (m) 类型构建单独的 Python 列表，这很有用，因为 (m) 也可以是 (10^5)。 
3. 创建数组`gain`， 在哪里`gain[k]`表示当允许的最大计数从(k-1)变为(k)时(F(k))的增加。 
4. 一次处理一种类型。 假设其排序值是(v_1,\ldots,v_s)，阈值是(l)。 维护一个运行的前缀和。 
5、当加工糖果数量达到(l)时，将当前前缀和添加到`gain[l]`。 这是类型变得可选择的第一点，因此它的全部最佳有效贡献立即出现。 
6. 对于每个后续的甜蜜 (v_k)，将 (v_k) 添加到`gain[k]`而 (k\le s)。 将允许的数量从 (k-1) 增加到 (k) 让我们可以准确地从该类型中获取第二大的糖果。 
7. 忽略可用糖果数量小于其阈值的类型。 这种类型没有有效的正向选择，因此它对每个 (k) 没有任何贡献。 
8. 转换`gain`通过取前缀和代入 (F)。 经过这次操作后，`gain[k]`实际上是 (F(k))，即每种类型最大计数 (k) 下的最佳总值。 
9. 检查从 (1) 到 (n) 的每个 (k)。 使用交叉乘法将 (F(k)/k) 与迄今为止找到的最佳分数进行比较，因此不需要浮点运算。 
10. 将最佳分子和分母除以最大公约数并打印结果分数。 

### 为什么它有效

 固定任意正整数 (k)。 每种类型最多出现 (k) 次的有效选择可以按类型独立优化，因为除了公共上限 (k) 之外，不同类型的值之间不存在交互作用。 对于至少有 (l) 种可用糖果的类型，禁止选择少于 (l) 种糖果，而禁止选择多于 (k) 种糖果。 由于每个值都是正数，因此允许的最佳数量是 (\min(k,s))，并且最好的糖果正是最大的糖果。 

这`gain`构造精确地表示了随着 (k) 的增长，最优贡献如何变化。 在(l)之前，贡献为零。 在 (l) 处，前 (l) 个值同时可用。 (k) 的每次增加都会增加下一个最大值。 因此前缀和`gain`正是 (F(k))。 

现在考虑实际最大数量 (C) 的最佳购买。 在界限 (k=C) 下是可行的，因此 (F(C)) 至少是其总值。 因此 (F(C)/C) 至少是最佳分数。 相反，在界限 (k) 下构造的集合的实际最大计数至多为 (k)，因此其真实得分至少为 (F(k)/k)。 因此，检查所有 (k) 不会错过最优值，也不会产生大于真实最优值的值。 

## Python 解决方案```python
import sys
from math import gcd

input = sys.stdin.readline

MAX_A = 100_000_000
SHIFT = 27

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n, m = map(int, input().split())
        need = [0] + list(map(int, input().split()))

        # Encode (type, value) into one integer.
        # Higher bits contain the type.
        # Lower bits contain MAX_A - value, so sorting ascending
        # gives the values of each type in decreasing order.
        sweets = [0] * n
        for i in range(n):
            a, b = map(int, input().split())
            sweets[i] = (b << SHIFT) | (MAX_A - a)

        sweets.sort()

        gain = [0] * (n + 1)

        i = 0
        while i < n:
            type_id = sweets[i] >> SHIFT
            limit = need[type_id]

            j = i + 1
            while j < n and (sweets[j] >> SHIFT) == type_id:
                j += 1

            prefix = 0
            count = 0

            for p in range(i, j):
                value = MAX_A - (sweets[p] & ((1 << SHIFT) - 1))
                count += 1
                prefix += value

                if count == limit:
                    gain[count] += prefix
                elif count > limit:
                    gain[count] += value

            i = j

        # gain[k] is the increment when changing the bound
        # from k-1 to k. Convert it to F(k).
        for k in range(1, n + 1):
            gain[k] += gain[k - 1]

        best_num = gain[1]
        best_den = 1

        for k in range(2, n + 1):
            if gain[k] * best_den > best_num * k:
                best_num = gain[k]
                best_den = k

        d = gcd(best_num, best_den)
        out.append(f"{best_num // d}/{best_den // d}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```阈值数组按类型索引，因此`need[type_id]`给出了使用该类型时必须服用的最少糖果数量。 糖果太少的类型自然不会在内循环期间达到其阈值，因此它没有任何贡献。 

整数编码用于避免存储 (n) 个 Python 元组。 类型占据高位，而`MAX_A - value`占据低27位。 由于 (10^8<2^{27})，该值安全地适合这些低位。 因此，对编码整数进行排序首先按类型排序，然后按值递减排序。 

对于每个连续类型段，`prefix`是目前最大的糖果的总和。 恰好在`limit`，类型变得可选择，因此整个前缀被添加到`gain[limit]`。 后面的每一个糖果都只贡献自己的价值，因为前面的前缀已经被考虑在内。 

第二遍将增量转换为 (F(k)) 的实际值。 分数比较用途`gain[k] * best_den > best_num * k`，这是准确的。 最大可能的总值最多为 (10^6\cdot10^8=10^{14})，因此 Python 整数可以轻松处理所有算术。 

## 工作示例

 对于样本 1，有一种类型具有阈值 (2)，包含值 (7) 和 (2)。 该类型在 (k=2) 时变得可用，其中它的贡献为 (9)。 

| k | 处理值| 前缀 | 之前的增益[k] F(k) | F(k) | F(k)/k | F(k)/k |
 | --- | --- | --- | --- | --- |
 | 1 | 7 | 0 | 0 | 0 |
 | 2 | 7, 2 | 9 | 9 | 9/2 |

 最大值为 (9/2)。 (k=2) 处的转变演示了为什么将阈值贡献添加为整个前缀而不是仅添加最后一个值。 

对于样本 2，类型 1 具有阈值 (1) 和值 (2)。 类型 2 具有阈值 (2) 和值 (5,3,1)。 排序后，类型2被处理为(5,3,1)。 

| k | 1 型增益 | 2 型增益 | F(k) | F(k) | F(k)/k | F(k)/k |
 | --- | --- | --- | --- | --- |
 | 1 | 2 | 0 | 2 | 2 |
 | 2 | 0 | 8 | 10 | 10 5 |
 | 3 | 0 | 1 | 11 | 11 11/3 |

 最佳值为 (5)。 相应的购买包含类型 1 糖果的价值 (2) 和两个最佳类型 2 糖果的价值 (5) 和 (3)，给出总价值 (10) 和最大类型数 (2)。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\log n+m+n)) | 排序占主导地位，而分组、增益构造、前缀和和分数比较是线性的 |
 | 空间| (O(n+m)) | 编码后的糖果、阈值数组和增益数组均使用线性空间 |

 最大的测试用例包含 (10^5) 个糖果，所有测试用例的糖果总数最多为 (10^6)。 该算法对每个测试用例执行一次全局排序，然后仅进行线性扫描。 内存使用量保持在规定的 512 MB 限制内，而 Python 的任意精度整数可以安全地处理 (10^{14}) 左右的总数。 

## 测试用例```python
import sys
import io
from math import gcd

MAX_A = 100_000_000
SHIFT = 27

def solve():
    input = sys.stdin.readline
    t = int(input())
    out = []

    for _ in range(t):
        n, m = map(int, input().split())
        need = [0] + list(map(int, input().split()))

        sweets = [0] * n
        for i in range(n):
            a, b = map(int, input().split())
            sweets[i] = (b << SHIFT) | (MAX_A - a)

        sweets.sort()

        gain = [0] * (n + 1)
        mask = (1 << SHIFT) - 1

        i = 0
        while i < n:
            type_id = sweets[i] >> SHIFT
            limit = need[type_id]

            j = i + 1
            while j < n and (sweets[j] >> SHIFT) == type_id:
                j += 1

            prefix = 0
            count = 0

            for p in range(i, j):
                value = MAX_A - (sweets[p] & mask)
                count += 1
                prefix += value

                if count == limit:
                    gain[count] += prefix
                elif count > limit:
                    gain[count] += value

            i = j

        for k in range(1, n + 1):
            gain[k] += gain[k - 1]

        best_num = gain[1]
        best_den = 1

        for k in range(2, n + 1):
            if gain[k] * best_den > best_num * k:
                best_num = gain[k]
                best_den = k

        d = gcd(best_num, best_den)
        out.append(f"{best_num // d}/{best_den // d}")

    sys.stdout.write("\n".join(out))

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided samples
sample = """\
2
2 1
2
7 1
2 1
3 2
1 2
2 1
5 2
3 2
"""
assert run(sample) == "9/2\n5/1", "provided samples"

# Minimum-size input
assert run("""\
1
1 1
1
7 1
""") == "7/1", "minimum size"

# A type cannot be partially selected when its threshold is 2
assert run("""\
1
2 1
2
5 1
1 1
""") == "3/1", "threshold boundary"

# All values are equal and every type can be selected from one sweet upward
assert run("""\
1
4 2
1 1
7 1
7 1
7 2
7 2
""") == "14/1", "all equal values"

# The first valid k is exactly the threshold.
# Values are 10, 9, 1 and l = 2, so F(2) = 19.
assert run("""\
1
3 1
2
10 1
9 1
1 1
""") == "19/2", "off by one at threshold"

# Maximum n and m. Every type has exactly one sweet and l = 1.
# All sweets can be selected, while C = 1.
n = 100000
m = 100000
thresholds = " ".join(["1"] * m)
items = "\n".join(f"1 {i}" for i in range(1, m + 1))
maximum_case = f"1\n{n} {m}\n{thresholds}\n{items}\n"

assert run(maximum_case) == "100000/1", "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 1 / 1 / 7 1`|`7/1`| 最小尺寸输入和分母 (1) |
 |`2 1 / l=2 / values 5,1`|`3/1`| 无法部分选择类型 |
 | 四个相等的值分为两种类型 (l=1) |`14/1`| 一切平等的价值，并采取一切可用的糖果|
 | 一种类型，值 (10,9,1), (l=2) |`19/2`| 精确的阈值转换和逐一处理 |
 | (n=m=100000)，每种类型一个值，全部 (l=1) |`100000/1`| 最大尺寸输入和线性后处理|

 ## 边缘情况

 当一种类型的可用糖果少于其阈值时，该算法永远不会达到`count == limit`，所以它的`gain`贡献仍然为零。 为了```
1
2 1
2
5 1
1 1
```唯一的类型有两个糖果和阈值两个。 在`count=1`，没有添加任何内容。 在`count=2`，前缀是(5+1=6)，所以`gain[2]=6`。 结果 (F(2)=6)，给出 (6/2=3/1)。 单一糖果永远不会被视为有效。 

当 (l=1) 时，第一个糖果立即产生贡献`gain[1]`，并且后面的每一个糖果都会将其自己的值添加到相应的较大值 (k) 中。 为了```
1
3 2
1 3
10 1
9 1
1 2
```类型 1 在 (k=1) 时贡献 (10)，而类型 2 直到 (k=3) 才能贡献。 因此(F(1)=10)，答案是(10/1)。 该算法正确地允许选择第一种类型，而不强制任何额外的糖果。 

当所选集合的实际最大计数小于当前界限 (k) 时，计算仍然安全。 考虑```
1
2 2
1 1
10 1
1 2
```对于 (k=2)，两种类型都可以贡献一种甜食，因此 (F(2)=11)，产生候选者 (11/2)。 实际选择的集合的最大计数为 (1)，因此其真实分数为 (11/1)。 该算法还评估 (k=1)，其中 (F(1)=11)，从而找到正确答案 (11/1)。 界限 (k) 只是一种枚举可能性的方法，而不是声明某种类型必须恰好包含 (k) 个糖果。 

最后，阈值转换本身的处理必须不出现差一错误。 为了```
1
3 1
2
10 1
9 1
1 1
```排序后的值为 (10,9,1)。 在 (k=1) 时，该类型不可用，因为其阈值为 (2)，因此 (F(1)=0)。 在(k=2)处，立即添加前缀(10+9=19)，得到(F(2)=19)。 在 (k=3) 处，仅添加额外值 (1)，得到 (F(3)=20)。 比率为 (0)、(19/2) 和 (20/3)，因此答案为 (19/2)。 这正是通过在阈值处添加整个前缀以及之后仅添加下一个单独值来编码的行为。
