---
title: "CF 102471H - 国王"
description: "我们有一个以素数 (p) 为模的非零残基序列 (b1,b2,ldots,bn)。 King 序列是一个子序列，其连续值是通过乘以一个固定的非零余数 (q) 获得的。"
date: "2026-08-09T04:43:25+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102471
codeforces_index: "H"
codeforces_contest_name: "2019 ICPC Asia-East Continent Final"
rating: 0
weight: 102471
solve_time_s: 390
verified: true
draft: false
---

[CF 102471H - 国王](https://codeforces.com/problemset/problem/102471/H)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个以素数 (p) 为模的非零余数序列 (b_1,b_2,\ldots,b_n)。 King 序列是一个子序列，其连续值是通过乘以一个固定的非零余数 (q) 获得的。 换句话说，选择一些位置（i_1<i_2<\cdots<i_k）后，它们的值必须满足

 [
 b_{i_{j+1}}\equiv q b_{i_j}\pmod p
 ]

 对于每一个连续的对。 

任务是找到最大可能的长度。 有一个特殊的转义子句：如果最大值小于（n/2），我们只需打印（-1）。 否则我们必须打印实际的最大长度。 原始语句使用相同的 (n) 来表示序列长度，因此我们始终使用 (n)。 

(p) 的素性给出了一个重要的性质。 每个 (b_i) 均非零模 (p)，因此每个 (b_i) 都有一个乘法逆元。 因此，任何两个不同的位置立即确定可能的比率。 如果我们确定 (b_i) 和 (b_j) 是 King 子序列的连续成员，那么唯一可能的比率是

 [
 q\equiv b_j b_i^{-1}\pmod p。 
]

 约束 (n\le 200000) 以及最多 (200000) 的总数 (n) 排除了正常情况下的任何二次或三次。 对于每个 (O(n)) 可能比率扫描整个序列一次的解决方案已经执行 (O(n^2)) 工作，在最大大小下大约进行 (4\cdot10^{10}) 次迭代。 2 秒的限制要求每次恒定次数的试验基本上呈线性工作。 

有几种边缘情况很容易被错误处理。 首先，(n=2) 很特殊，因为任意两个非零值形成一个 King 序列：它们的比率就是 (b_2b_1^{-1})。 因此答案始终是（2）。 例如，对于 (n=2,p=7) 和序列 (3,5)，答案是 (2)，而不是 (-1)。 

第二个边界情况来自分数阈值。 条件是长度至少为(n/2)，因此整数比较为(2L\ge n)。 对于 (n=5)，长度为 (3) 的序列符合条件，因为 (3\ge2.5)。 例如，```
1
5 7
2 4 5 6 8
```使用 (2,4,8) 和比率 (2) 得到答案 (3)。 粗心的实现使用`length >= n // 2`会错误地将长度 (2) 视为足够。 

重复的值也很重要。 如果所有值都相等，则(q=1)，所以整个数组是King序列。 例如，```
1
5 7
3 3 3 3 3
```有答案（5）。 假设 (q\ne1) 的实现将拒绝有效的最大序列。 

最后，模除法必须使用模逆来执行，而不是普通的整数除法。 对于(p=7)，(2)和(5)之间的比率是(5\cdot2^{-1}\equiv5\cdot4\equiv6\pmod7)，而不是普通整数运算的(5/2)。 

## 方法

 最直接的蛮力从选择 King 子序列的前两个元素开始。 假设它们出现在位置 (i<j)。 他们独特地决定

 [
 q=b_jb_i^{-1}\pmod p。 
]

 一旦（q）固定，我们就可以贪婪地扩展子序列。 从(b_j)开始，向右扫描，取第一个等于(qb_j)的元素，然后取第一个等于(q^2b_j)的元素，以此类推。 使用 (q^{-1}) 反向使用相同的想法。 

这是正确的，因为对于固定的起始元素和固定的比率，采取最早可能的下一个事件永远不会损害未来的选择。 每个后面的元素至少有同样多的空间来继续该序列。 

问题是可能的起始对的数量。 有 (O(n^2)) 对，通过扫描序列成本 (O(n)) 来测试每对，在最坏的情况下给出 (O(n^3))。 在 (n=200000) 时，大约是 (8\cdot10^{15}) 次基本扫描操作，这是完全不可行的。 

特殊的输出条件改变了问题。 我们只关心 King 子序列至少包含数组一半的情况。 这么大的子序列在原始序列内部是密集的。 不要尝试每个可能的起始对，而是随机选择一个数组位置 (x)。 如果 (x) 属于长度至少为 (n/2) 的 King 子序列，则它是一个有用的锚点。 预期的随机解决方案使用非常接近的位置 (x+1) 和 (x+2) 来获取候选比率，然后扫描整个数组以查找每个候选。 

这是关键的减少：我们不需要确定性地确定比率。 我们只需要生成正确比率的恒定概率，因为该算法可以多次重复实验。 标准可接受的方法重复此实验 100 次。 

对于固定的候选比率 (q)，扫描本身是线性的。 如果所选锚点位于位置 (x)，我们使用 (q^{-1}) 向后延伸，然后使用 (q) 向前延伸。 最早的匹配出现始终是安全的，因此生成的长度是包含该比例的锚点的最大 King 子序列。 

每个报告的答案都是通过这种结构独立验证的，因此随机化只能导致假阴性，而绝不会导致假阳性。 如果算法打印长度 (L)，则实际收集的元素形成长度 (L) 的有效 King 子序列。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n^3)) | (O(1)) | (O(1)) | 太慢了 |
 | 最佳随机| (O(Kn))，(K=100) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 读取 (n)、(p) 和数组。 由于每个 (b_i) 都在 (1) 和 (p-1) 之间，因此每个值都有一个模逆。 
2. 对于非常小的数组，直接枚举对。 这避免了微小边界情况周围不必要的随机性，并给出了准确的结果。 对于一对位置 (i<j)，计算

 [
 q=b_jb_i^{-1}\pmod p
 ]

 并使用该比率计算最长的 King 子序列。 

1. 对于较大的阵列，重复随机实验 100 次。 选择一个均匀随机的位置 (x)。 
2. 如果 (x+1\le n)，则使用

 [
 q=b_{x+1}b_x^{-1}\pmod p
 ]

 作为候选比例。 当 (x) 和 (x+1) 是所需 King 子序列的连续元素时，此候选者特别有用。 

1. 如果(x+2\le n)，类似地使用

 [
 q=b_{x+2}b_x^{-1}\pmod p。 
]

 第二个候选处理有用元素被一个丢弃的数组元素分隔开的情况。 这是用于解决该问题的随机策略的一部分。 

1. 对于每个候选比率 (q)，用费马小定理计算 (q^{-1})：

 [
 q^{-1}\equiv q^{p-2}\pmod p。 
]

 因为 (p) 是素数且 (q\ne0)，所以这个逆元总是存在。

1. 从 (b_x) 开始，向左扫描。 保持当前期望值等于当前值乘以 (q^{-1})。 每当扫描到的元素等于期望值时，就获取它并更新期望值。 采取第一个可能的出现是贪婪的，并且最大化我们仍然可以使用的元素数量。 
2. 从第二个锚点位置重新开始向右扫描。 每当一个元素等于当前值乘以 (q) 时，就取它。 将两边得到的元素个数和两个锚元素相加。 
3.更新最佳答案。 最后，如果满足(2\cdot\text{best}\ge n)，则输出最佳长度。 否则输出(-1)。 

### 为什么它有效

 对于每个固定的候选比率（q），贪婪扫描保持所选择的元素形成有效的 King 序列并且最后选择的元素是具有所需值的最早可能元素的不变量。 用较早出现的元素替换任何选定的元素不能减少随后可用的位置集，因此贪婪扫描获得与该锚点和比率兼容的最大子序列。 

假设最优 King 子序列的长度至少为 (n/2)。 它的元素至少占据原始位置的一半，因此均匀随机的位置击中该子序列的概率恒定。 一旦选择了有用的锚点，附近的元素就会在预期的随机策略下以恒定的概率提供候选比率。 重复实验 100 次使得错过每个有用候选者的概率变得非常小。 这就是为什么问题的不寻常 (n/2) 要求允许随机线性时间解决方案。 

该算法无法输出无效的肯定答案，因为每个候选长度都来自显式构造的 King 子序列。 随机性仅影响是否发现足够长的序列。 

## Python 解决方案```python
import sys
import random

input = sys.stdin.readline

TRIALS = 100
SMALL = 50

def fixed_ratio_length(a, p, left, right, q):
    """
    a is 0-indexed.
    left and right are two consecutive chosen positions,
    and a[right] == q * a[left] (mod p).

    Return the longest King subsequence with ratio q that
    contains both anchor positions.
    """
    inv_q = pow(q, p - 2, p)

    length = 2
    cur = a[left]

    for i in range(left - 1, -1, -1):
        if a[i] == cur * inv_q % p:
            cur = a[i]
            length += 1

    cur = a[right]

    for i in range(right + 1, len(a)):
        if a[i] == cur * q % p:
            cur = a[i]
            length += 1

    return length

def exact_small(a, p):
    n = len(a)
    best = 1

    for i in range(n):
        inv_ai = pow(a[i], p - 2, p)

        for j in range(i + 1, n):
            q = a[j] * inv_ai % p
            best = max(best, fixed_ratio_length(a, p, i, j, q))

    return best

def solve_case(n, p, a, rng):
    if n <= SMALL:
        return exact_small(a, p)

    best = 1

    for _ in range(TRIALS):
        x = rng.randrange(n)

        if x + 1 < n:
            q = a[x + 1] * pow(a[x], p - 2, p) % p
            best = max(best, fixed_ratio_length(a, p, x, x + 1, q))

        if x + 2 < n:
            q = a[x + 2] * pow(a[x], p - 2, p) % p
            best = max(best, fixed_ratio_length(a, p, x, x + 2, q))

    if 2 * best >= n:
        return best
    return -1

def main():
    rng = random.Random()

    T = int(input())
    out = []

    for _ in range(T):
        n, p = map(int, input().split())
        a = list(map(int, input().split()))
        out.append(str(solve_case(n, p, a, rng)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```这`fixed_ratio_length`函数实现了核心贪婪扫描。 已知两个锚点位置是候选比率的连续成员，因此初始长度为`2`。 向后扫描使用`inv_q`，而前向扫描使用`q`。 

表达式`pow(x, p - 2, p)`是Python的模幂运算。 它计算的倒数`x`在 (O(\log p)) 时间内对素数 (p) 取模。 Python中不存在整数溢出问题，并且在模幂和乘法期间应用模数。 

比较`2 * best >= n`故意避免浮点运算。 这可以正确处理 (n) 的偶数和奇数值。 例如，当 (n=5) 时，长度 (3,4,5) 合格，而长度 (2) 则不合格。 

这`SMALL`渐近算法不需要分支。 它使小输入的实现具有确定性，其中三次强力是廉价的，并消除了微小阵列的尴尬边界行为。 

随机部分使用 100 项试验，与标准解决方案策略相匹配。 

## 工作示例

 ### 示例 1

 考虑```
6 1000000007
1 1 2 4 8 16
```序列(1,2,4,8,16)是比率为(2)的King子序列，所以正确答案是(5)。 

假设一项随机试验选择位置 (2)，使用基于 1 的索引。 那么(a_2=1),(a_3=2)，所以第一个候选比例为

 [
 q=2\cdot1^{-1}\equiv2。 
]

 扫描过程如下。 

| 职位| 价值| 扫描时预计 | 行动| 长度 |
 | ---| ---| ---| ---| ---|
 | 2 | 1 | 1 | 锚| 2 |
 | 1 | 1 | (1\cdot2^{-1}) | 拿| 3 |
 | 3 | 2 | (1\cdot2) | 拿| 4 |
 | 4 | 4 | (2\cdot2) | 拿| 5 |
 | 5 | 8 | (4\cdot2) | 拿| 6 |
 | 6 | 16 | 16 (8\cdot2) | 拿| 7 |

 该表说明了为什么实施时必须小心锚点计数。 向后扫描添加较早的`1`，而前向扫描则从第二个锚点开始`2`。 因此，找到的实际序列是 (1,1,2,4,8,16)，长度为 (6)，而不是 (5)。 完整的输入实际上有六个值，这本身就是选择前两个相等值后比率为 (2) 的 King 序列？ 不是。前两个值是 (1,1)，因此该对的比率为 (1)，而从第二个值开始的序列的比率为 (2)。 因此，候选 (q=2) 不能包含两个第一个位置，并且向后比较会拒绝第一个值，因为 (1\ne1\cdot2^{-1}\pmod p)。 因此，正确的轨迹是：

 | 职位| 价值| 预计| 行动| 长度 |
 | ---| ---| ---| ---| ---|
 | 2 | 1 | 1 | 锚| 2 |
 | 1 | 1 | (500000004) | 跳过| 2 |
 | 3 | 2 | 2 | 拿| 3 |
 | 4 | 4 | 4 | 拿| 4 |
 | 5 | 8 | 8 | 拿| 5 |
 | 6 | 16 | 16 16 | 16 拿| 6 |

 使用位置 (2,3,4,5,6) 得到的长度为 (5)。 由于(2\cdot5\ge6)，答案是(5)。 

### 示例 2

 考虑```
6 1000000007
597337906 816043578 617563954 668607211 89163513 464203601
```不存在长度至少为 (3) 的 King 子序列，因此答案为 (-1)。 

试验可以选择任意位置并构建一个或两个候选比率。 然后扫描整个数组中的每个候选者。 重要的状态是当前所需的值。 

| 试用| 锚| 候选来源 | 候选人 (q) | 找到最佳长度 |
 | ---| ---| ---| ---| ---|
 | 1 | 随机| (x,x+1) | (x,x+1) | 配对的比率| 2 |
 | 1 | 随机| (x,x+2) | (x,x+2) | 配对的比率| 2 |
 | 2 | 随机| (x,x+1) | (x,x+1) | 配对的比率| 2 |
 | 2 | 随机| (x,x+2) | (x,x+2) | 配对的比率| 2 |
 | ... | ... | ... | ... | 2 |

 候选长度 (2) 始终有效，因为任何两个非零残基都确定一个比率。 由于(2\cdot2<6)，最终结果是(-1)。 

这个例子展示了随机方法的一个重要特性：不成功的候选人不会导致错误的肯定答案。 他们根本达不到要求的门槛。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(Kn+K\log p)) | 每个 (K=100) 试验执行恒定数量的线性扫描和模反演 |
 | 空间| (O(n)) | (O(n)) | 数组显式存储 |

 所有测试用例的总数 (n) 最多为 (200000)，因此线性扫描仍与全局输入大小乘以随机试验常数数成正比。 Python 实现还使用精确的模算术，并且仅存储输入数组和常量大小的临时状态。 

随机性应该被理解为预期解决方案的一部分，而不是偶然的优化。 标准发布的解决方案使用与 (K=100) 相同的 (O(Kn)) 策略。 

## 测试用例

 下面的测试工具使用相同的解决方案逻辑。 小情况得到彻底解决，这使得自定义边界测试具有确定性。 大型全平等情况也是确定性的，因为每个候选比率都是 (1)。```python
# helper: run solution on input string, return output string
import io
import random
import sys

TRIALS = 100
SMALL = 50

def fixed_ratio_length(a, p, left, right, q):
    inv_q = pow(q, p - 2, p)

    length = 2
    cur = a[left]

    for i in range(left - 1, -1, -1):
        if a[i] == cur * inv_q % p:
            cur = a[i]
            length += 1

    cur = a[right]

    for i in range(right + 1, len(a)):
        if a[i] == cur * q % p:
            cur = a[i]
            length += 1

    return length

def exact_small(a, p):
    best = 1

    for i in range(len(a)):
        inv_ai = pow(a[i], p - 2, p)

        for j in range(i + 1, len(a)):
            q = a[j] * inv_ai % p
            best = max(best, fixed_ratio_length(a, p, i, j, q))

    return best

def solve_case(n, p, a, rng):
    if n <= SMALL:
        best = exact_small(a, p)
    else:
        best = 1

        for _ in range(TRIALS):
            x = rng.randrange(n)

            if x + 1 < n:
                q = a[x + 1] * pow(a[x], p - 2, p) % p
                best = max(
                    best,
                    fixed_ratio_length(a, p, x, x + 1, q)
                )

            if x + 2 < n:
                q = a[x + 2] * pow(a[x], p - 2, p) % p
                best = max(
                    best,
                    fixed_ratio_length(a, p, x, x + 2, q)
                )

    return str(best if 2 * best >= n else -1)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    rng = random.Random(123456789)

    try:
        T = int(sys.stdin.readline())
        ans = []

        for _ in range(T):
            n, p = map(int, sys.stdin.readline().split())
            a = list(map(int, sys.stdin.readline().split()))
            ans.append(solve_case(n, p, a, rng))

        return "\n".join(ans)
    finally:
        sys.stdin = old_stdin

# Provided samples
sample = """\
4
6 1000000007
1 1 2 4 8 16
6 1000000007
597337906 816043578 617563954 668607211 89163513 464203601
5 1000000007
2 4 5 6 8
5 1000000007
2 4 5 6 7
"""

assert run(sample) == "5\n-1\n3\n-1", "provided samples"

# Minimum-size input: every pair is a King sequence.
assert run("""\
1
2 7
3 5
""") == "2", "minimum n"

# All equal values: q = 1, so the whole array is valid.
assert run("""\
1
5 7
3 3 3 3 3
""") == "5", "all equal values"

# Odd n: for n = 5, length 3 qualifies, while length 2 does not.
assert run("""\
1
5 1000000007
2 4 5 6 8
""") == "3", "odd threshold"

# No qualifying subsequence.
assert run("""\
1
5 1000000007
2 4 5 6 7
""") == "-1", "below threshold"

# Maximum-size input. All values are equal, so the answer is n.
n = 200000
large_input = "1\n{} 1000000007\n{}\n".format(n, "7 " * (n - 1) + "7")
assert run(large_input) == str(n), "maximum n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 7 / 3 5`|`2`| 最小尺寸情况以及任何两个非零值形成 King 序列的事实 |
 |`5 7 / 3 3 3 3 3`|`5`| 比率 (q=1) 和重复值 |
 |`5 1000000007 / 2 4 5 6 8`|`3`| 奇数 (n) 和 (2L\ge n) 阈值 |
 |`5 1000000007 / 2 4 5 6 7`|`-1`| 所需半长序列不存在的情况|
 | (n=200000)，所有值`7`|`200000`| 最大输入大小和线性时间行为 |

 ## 边缘情况

 对于 (n=2)，答案始终是 (2)。 和```
1
2 7
3 5
```比率为 (5\cdot3^{-1}\equiv5\cdot5\equiv4\pmod7)，因此 (3,5) 是 King 序列。 实现的精确小情况分支直接找到这一对。 

对于相等的值，取```
1
5 7
3 3 3 3 3
```选择 (q=1) 给出 (1\cdot3\equiv3\pmod7)，因此每个连续的对都满足该规则。 最大值为(5)，且(2\cdot5\ge5)，所以输出为`5`。 

对于奇数阈值，考虑```
1
5 1000000007
2 4 5 6 8
```子序列(2,4,8)的比率为(2)，因此其长度为(3)。 没有长度 (4) King 子序列，但 (3) 就足够了，因为 (2\cdot3=6\ge5)。 正确的输出是`3`。 这就是为什么该实现使用`2 * best >= n`而不是`best >= n // 2`。 

对于低于阈值的序列，```
1
5 1000000007
2 4 5 6 7
```最长的 King 子序列的长度为 (2)。 任何两个元素都可以定义一个比率，但没有比率支持按所需顺序排列三个元素。 由于 (2\cdot2=4<5)，输出为`-1`。 

在最大输入大小时，考虑 (7) 的 (200000) 个副本。 比率 (q=1) 适用于整个数组，因此答案是 (200000)。 该算法不需要存储任何按值或比率索引的动态编程表。 它只保留数组并重复扫描它，因此内存剩余 (O(n))。 

当 (q=1) 时，模逆边界也是安全的。 费马公式给出 (1^{p-2}\equiv1)，因此向后和向前扫描正确地继续通过相等的值。 每个输入值都是非零模 (p)，因此不需要零的倒数。
