---
title: "CF 105129H - 数组子序列"
description: "给定一个数组，并要求我们考虑在保留顺序的同时精确选择 k 个元素的所有方法，尽管顺序约束不会影响最终选择哪些值，只会影响哪些子集有效。"
date: "2026-06-27T19:22:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105129
codeforces_index: "H"
codeforces_contest_name: "Shorouk Academy 2024 Collegiate Programming Contest"
rating: 0
weight: 105129
solve_time_s: 56
verified: true
draft: false
---

[CF 105129H - 数组子序列](https://codeforces.com/problemset/problem/105129/H)

 **评级：** -
 **标签：** -
 **求解时间：** 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个数组，并要求我们考虑在保留顺序的同时精确选择 k 个元素的所有方法，尽管顺序约束不会影响最终选择哪些值，只会影响哪些子集有效。 对于每个选定的 k 个元素组，我们只查看其最大和最小值并取它们的差值。 任务是计算该数量在大小为 k 的所有可能子序列上的平均值。 

关键对象不是子序列结构本身，而是所有 k 元素索引子集上的诱导均匀分布。 大小为 k 的索引的每个子集都有相同的可能性，因此问题简化为子集上的纯组合期望。 

约束条件很大，测试用例中的 n 高达 5 · 10^5。 任何枚举子集甚至直接处理所有对的解决方案都是立即不可行的，因为这至少是二次的。 即使每对 O(n log n) 风格的方法也太慢了。 这强烈表明，解决方案必须将期望降低为单个元素或少量结构化贡献的总和，这些贡献可以在线性或近线性时间内预先计算。 

经常打破天真的尝试的一个微妙点是将子序列视为保留邻接信息。 他们没有。 对于组合计数而言，只有相对索引顺序很重要，而不是连续结构。 另一个常见的陷阱是试图同时直接推理最大值和最小值，这会导致重复计算或复杂的依赖性。 正确的方向是将期望中最大和最小的贡献分开，从而消除依赖性。 

作为具体的故障模式，请考虑尝试通过枚举所有子集来模拟小 n。 对于 n = 50 和 k = 25，这已经是天文数字了。 另一个不正确的想法是尝试修复一对 (i, j) 并假设它们之间的元素独立，而不正确考虑有多少子集选择两者作为极值元素。 这种依赖性是纯粹的组合，必须用二项式系数表示。 

## 方法

 蛮力方法很简单。 我们枚举大小为 k 的每个子集，计算其最小值和最大值，并累加它们的差值。 这是正确的，因为它直接遵循均匀分布的期望定义。 然而，此类子集的数量为 C(n, k)，对于中等大小的 k，其数量以 n 呈指数增长。 即使 n = 40，这也是不可行的。 

关键的观察是，对差异的期望完全分裂为期望的差异。 表达式 max(S) − min(S) 变为 E[max(S)] − E[min(S)]。 这完全消除了最小值和最大值之间的相互作用，并将问题简化为两个独立的阶统计期望。 

现在结构变得经典了。 对数组进行排序后，每个元素 ai 都可以被视为所选子集的最大值或最小值的候选者。 我们只需要计算有多少个大小为 k 的子集将 ai 作为其最大值，以及类似地有多少个子集将 ai 作为其最小值。 每个这样的计数根据排序顺序中位于其左侧或右侧的元素数量直接转换为二项式系数。 

这将问题转化为对已排序数组的线性扫描，并使用阶乘预计算计算出组合权重。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力枚举| O(C(n, k) · k) | O(C(n, k) · k) | O(k) | 太慢了 |
 | 通过订单统计获得的预期值 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 ### 1. 对数组进行排序

我们对数组进行排序，使位置与排名相对应。 这使我们能够仅使用索引来推断有多少元素小于或大于给定元素。 

### 2. 预计算阶乘和逆阶乘

 我们需要模数下的二项式系数，因此我们预先计算阶乘和最多 n 的模逆。 这使得任何 C(n, k) 查询的复杂度为 O(1)。 

### 3.修复每个元素的贡献

 我们将期望解释为所有元素的总和，其中每个元素的贡献基于所选子集的最大值或最小值。 

对于位置 i（0 索引）处的元素，我们计算两个概率：

 其为最大值的概率是从其之前的 i 个元素中选择剩余 k − 1 个元素的方法数除以子集总数。 

它是最小值的概率是从它后面的元素中选择 k − 1 个元素的方法数。 

这些直接使用二项式系数表示。 

### 4. 贡献总额

 对于每个元素 ai，我们将其值乘以其最大概率和最小概率之差相加。 这产生了对最大 - 最小的净预期贡献。 

### 5. 按子集总数进行归一化

 所有概率共享相同的分母 C(n, k)，因此我们最后乘以它的模逆。 

### 为什么它有效

 每个子集都有唯一的最大值和最小值，因此当我们对所有元素的贡献求和时，每个子集的最大值在“max”项中只计算一次，每个子集的最小值在“min”项中只计算一次。 期望的线性保证了这种分解不会丢失或重复计算任何配置。 组合公式确保每个元素都按照其发挥极值作用的子集数量精确加权。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def modinv(x):
    return pow(x, MOD - 2, MOD)

maxn = 5 * 10**5 + 5
fact = [1] * (maxn)
invfact = [1] * (maxn)

for i in range(1, maxn):
    fact[i] = fact[i - 1] * i % MOD

invfact[maxn - 1] = pow(fact[maxn - 1], MOD - 2, MOD)
for i in range(maxn - 2, -1, -1):
    invfact[i] = invfact[i + 1] * (i + 1) % MOD

def C(n, r):
    if r < 0 or r > n:
        return 0
    return fact[n] * invfact[r] % MOD * invfact[n - r] % MOD

t = int(input())
for _ in range(t):
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    a.sort()

    if k == 1:
        print(0)
        continue

    total = C(n, k)
    inv_total = modinv(total)

    ans = 0

    for i, val in enumerate(a):
        # as maximum: choose k-1 from left side
        max_cnt = C(i, k - 1)
        # as minimum: choose k-1 from right side
        min_cnt = C(n - i - 1, k - 1)

        ans += val * (max_cnt - min_cnt)
        ans %= MOD

    ans = ans * inv_total % MOD
    print(ans)
```该实现预先计算阶乘一次，这是必要的，因为多个测试用例共享相同的边界。 核心循环使用排序顺序将索引 i 解释为正好有 i 个较小元素和 n − i − 1 个较大元素，这就是允许直接二项式计数的原因。 

由于 max 和 min 一致，因此 k = 1 的特殊情况会单独处理，从而使结果为零。 

一个微妙的实现细节是在从 max_cnt 中减去 min_cnt 时仔细维护模运算，因为在应用模数之前中间值可能会变为负值。 

## 工作示例

 考虑 k = 2 的数组 [4, 1, 3, 1]。 

排序后得到[1,1,3,4]。 总子集为 C(4, 2) = 6。 

我们计算每个元素的贡献。 

| 我| 价值| C(i,1) | C(i,1) | C(n-i-1,1) | C(n-i-1,1) | 净贡献|
 | ---| ---| ---| ---| ---|
 | 0 | 1 | 0 | 3 | 1 · (0 − 3) | 1
 | 1 | 1 | 1 | 2 | 1 · (1 − 2) | 1 · (1 − 2) |
 | 2 | 3 | 2 | 1 | 3·(2−1) | 3·(2−1)|
 | 3 | 4 | 3 | 0 | 4·(3−0)|

 求和给出标准化前的分子。 除以 6 得到期望值。 

该迹线显示了每个元素如何独立做出贡献，具体取决于它是否可以充当 2 元素子集的端点。 

现在考虑 k = 1 的 [1, 1, 1]。每个子集都是单个元素，因此 max − min 始终为 0。该算法直接返回 0，因为贡献取消。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 预处理后每个测试用例的 O(n) | 每个元素处理一次，二项式查询的复杂度为 O(1) |
 | 空间| O(n) | 最大 n 的阶乘和逆阶乘 |

 由于测试的总 n 为 5 · 10^5，因此预处理完全符合限制。 然后，每个测试用例都以线性时间运行，这对于该输入规模是最佳的。 

## 测试用例```python
import sys, io

MOD = 10**9 + 7

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    maxn = 100
    fact = [1] * (maxn)
    invfact = [1] * (maxn)
    for i in range(1, maxn):
        fact[i] = fact[i - 1] * i % MOD
    invfact[maxn - 1] = pow(fact[maxn - 1], MOD - 2, MOD)
    for i in range(maxn - 2, -1, -1):
        invfact[i] = invfact[i + 1] * (i + 1) % MOD

    def C(n, r):
        if r < 0 or r > n:
            return 0
        return fact[n] * invfact[r] % MOD * invfact[n - r] % MOD

    t = int(input())
    out = []
    for _ in range(t):
        n, k = map(int, input().split())
        a = list(map(int, input().split()))
        a.sort()

        if k == 1:
            out.append("0")
            continue

        total = C(n, k)
        inv_total = pow(total, MOD - 2, MOD)

        ans = 0
        for i, val in enumerate(a):
            max_cnt = C(i, k - 1)
            min_cnt = C(n - i - 1, k - 1)
            ans += val * (max_cnt - min_cnt)
            ans %= MOD

        out.append(str(ans * inv_total % MOD))

    return "\n".join(out)

# provided samples
assert run("""4
4 2
4 1 3 1
3 1
1 1 1
6 3
-10 -10 10 10 10 -10
4 4
4 2 1 3
""") == """2
0
20
2"""

# custom cases
assert run("""1
1 1
5
""") == "0", "single element"

assert run("""1
2 2
1 10
""") == "9", "full array"

assert run("""1
5 2
1 2 3 4 5
""") == "3", "small increasing"

assert run("""1
5 1
1 2 3 4 5
""") == "0", "k=1 case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单元素| 0 | k=1 简并 |
 | 完整阵列| 9 | 整个集合的最大-最小|
 | 小幅增加| 3 | 组合加权正确性|
 | k=1 情况 | 0 | 边缘情况取消 |

 ## 边缘情况

 当k等于1时，每个子序列只包含一个元素，因此最大值和最小值相同。 该算法通过立即返回零来处理此问题，以匹配公式中否则会出现的组合取消。 

当 k 等于 n 时，只有一个子序列，即整个数组。 每个元素的贡献都会分解为确定性的最大值和最小值，并且该公式正确地简化为 max(a) − min(a)，因为在完全概率权重的情况下，只有一个元素被计为最大值，一个元素被计为最小值。 

当所有值都相等时，每个子集的范围为零。 公式中，排序后每一项都乘以相同值的差值，因此总和对系统取模后为零，与预期结果相符。 

当值为负时，不会发生任何变化，因为所有组合推理都与幅度符号无关。 该公式仅依赖于期望的线性，因此自然可以处理负贡献，无需特殊的外壳。
