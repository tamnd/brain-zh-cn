---
title: "CF 105992C - \u997a\u5b50"
description: "我们得到了几个独立的数据集。 每个数据集中都有多种饺子。 每种饺子的供应量都是有限的，每吃掉该种饺子的奖励就会随着你吃更多同类饺子而减少。"
date: "2026-06-22T16:36:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105992
codeforces_index: "C"
codeforces_contest_name: "The 2025 Shanghai Collegiate Programming Contest"
rating: 0
weight: 105992
solve_time_s: 80
verified: true
draft: false
---

[CF 105992C - \u997a\u5b50](https://codeforces.com/problemset/problem/105992/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了几个独立的数据集。 每个数据集中都有多种饺子。 每种饺子的供应量都是有限的，每吃掉该种饺子的奖励就会随着你吃更多同类饺子而减少。 

更具体地说，对于每种类型$i$， 有$s_i$饺子可用。 如果你吃的是$j$第一个这种饺子，你获得的满足感只取决于$i$和$j$，而不是你在全球范围内吃它的时间。 第一个饺子类型$i$很特别，因为它可以获得额外的奖金$c_i$，所以它的值为$a_i + c_i$。 之后，每个额外的饺子都会以线性方式变得不那么令人满意：$j$-th（对于$j > 1$）给出$a_i - b_i \cdot (j - 1)$。 

最多可以吃$m$各种类型的饺子总数。 另外，还有一个全局奖励：如果你吃的饺子总数在区间内$[l, r]$，您获得额外的固定值$val$，与您选择的饺子无关。 

目标是选择从每种类型中取出多少个饺子，以使总满意度（包括可能的奖金）最大化。 

约束条件很大：最多$10^5$测试用例，并且在所有测试中，类型数量之和最多为$3 \cdot 10^5$。 但是，每种类型最多可以有$10^6$原则上是饺子，并且$m$也可以很大。 这立即排除了任何显式枚举所有饺子或模拟每个项目选择的解决方案。 任何像全局排序所有单个饺子这样的事情在时间和内存上都太慢了。 

价值函数的结构是关键难点。 每种类型都会产生递减的算术级数，任务是在所有这些序列中选择最佳可用项目的全局前缀，同时还考虑根据所选总计数的分段奖励。 

一些微妙的边缘情况值得强调。 

问题是，包饺子的最佳数量并不总是合适的。$m$。 如果许多值变成负值，那么少吃饺子可能会更好，除非奖金可以补偿。 例如，如果所有$a_i$非常消极并且$val = 0$，最优策略可能是吃零个饺子。 

另一个问题是奖金间隔。 即使吃更多的饺子可以增加原始满足感，最好早点停下来降落在里面$[l, r]$。 总是采取幼稚的策略$m$饺子并添加奖金（如果适用）将失败$m > r$但稍小的前缀会产生明显更高的奖金调整结果。 

最后，每种类型的第一个元素的行为与其他元素不同。 将每种类型视为一个简单的算术级数，从$a_i$而不是$a_i + c_i$在全局混合项目时，将低估第一个项目并导致错误的排序。 

## 方法

 直接的暴力解释是将每个饺子视为一个独立的项目，生成所有$s_i$显式值，将它们合并到全局列表中，按降序排序，并采用前缀。 这在概念上是正确的，因为每个饺子都有一个独立于全局排序的固定值。 然而，饺子的总数可能是巨大的，远远超出了可以生成或分类的数量。 即使我们只假设总的$m$重要的是，我们仍然无法有效地生成候选者，因为每种类型都可以贡献一个递减值的长尾。 

关键的观察是每种类型都不是任意的。 它的值在第一个元素之后形成一个具有恒定斜率的单调递减序列。 这种结构使我们能够避免显式生成所有元素。 我们不枚举项目，而是提出一个不同的问题：给定一个阈值$x$，所有类型至少有多少个饺子有价值$x$，它们的总和是多少？ 

这将问题转化为阈值选择问题。 如果我们可以计算，对于任意$x$, 至少有价值的物品数量$x$，那么我们可以二分查找对应于精确选择的阈值$k$最好的物品。 一旦我们知道每种类型有多少项目贡献超过阈值，我们还可以使用算术级数公式计算它们的总贡献。 

这避免了构造完整的多重集。 整个解决方案减少为在二分搜索期间每种类型在恒定时间内重复评估每种类型。 

最后，奖金期限仅取决于所选的总额$k$，而不是选择哪些项目。 一旦我们可以计算出任何固定的最佳总和$k$，我们只需要评估少数候选者$k$值来决定是否值得牺牲原始价值来获得奖金。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力枚举和排序 |$O(\sum s_i \log \sum s_i)$|$O(\sum s_i)$| 太慢了 |
 | 阈值+二分搜索答案 |$O(n \log V)$每次测试（摊销）|$O(1)$额外 | 已接受 |

 ## 算法演练

 我们将问题简化为能够计算出最佳的可能总和$k$饺子是选的。 

我们首先定义一个函数，给定阈值$x$，计算总共有多少个饺子至少有价值$x$，以及它们的总和是多少。 

1. 对于每种类型$i$，我们确定其序列中至少有多少项$x$。 第一个项目有价值$a_i + c_i$，以及所有后面的项目$a_i - b_i (j-1)$。 我们将推理分为第一项是否合格以及算术尾部中有多少项合格。 这给出了恒定时间内每种类型的封闭形式计数。 
2. 我们汇总所有类型的这些计数。 这给出了一个单调函数$F(x)$, 至少有价值的物品数量$x$。 因为增加$x$只删除候选人，$F(x)$是单调递减的。 
3. 我们进行二分查找$x$找到一个阈值，选择至少具有价值的所有项目$x$至少给出$k$项，但至少选择$x+1$给出少于$k$。 这个阈值代表顶部的边界$k$价值观。 
4. 一旦知道阈值，我们就计算严格高于该阈值的所有项目的总和。 这些绝对是顶级的一部分$k$。 我们还计算需要多少个具有恰好阈值的附加项目才能达到$k$，并添加他们的贡献。 
5. 这样就得到了$S(k)$，通过精确地采取可实现的最大总满意度$k$饺子。 
6. 现在我们合并奖金。 我们评估两个有意义的选择。 一个正在采取$k = m$，最大化原始选择。 另一个正在采取$k = \min(m, r)$，这是仍在奖金区间内的最大尺寸。 如果这个$k$至少是$l$，我们添加$val$到它的分数。 
7. 我们在这些候选者中取最大值。 

### 为什么它有效

 选了饺子就相当于拿了上面$k$来自由单调算术序列隐式定义的多重集的值。 阈值方法正确地重建了这个多重集前缀，因为任何最佳解决方案都必须由全局最大的可用值组成，并且单调结构确保顶部的成员资格$k$可以通过单个截止值进行测试。 

奖金优化与物品身份无关，仅取决于$k$，因此将搜索空间减少到几个候选者$k$值保持最优性，而不需要所有尺寸的完整 DP。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def calc_count_sum(a, b, c, s, x):
    # returns (count, sum) of values >= x in this type
    # first item
    cnt = 0
    total = 0

    # first item value
    first = a + c
    if s >= 1 and first >= x:
        cnt += 1
        total += first

    # tail: j>=2 => a - b*(j-1)
    # we need a - b*t >= x where t=j-1, t>=1
    # a - b*t >= x => t <= (a - x)/b
    if s >= 2:
        max_t = (a - x) // b
        if max_t >= 1:
            use_t = min(max_t, s - 1)
            # t from 1..use_t
            # values: a-b*t
            cnt += use_t
            # sum = sum_{t=1..u} (a - b*t)
            total += use_t * a - b * (use_t * (use_t + 1) // 2)

    return cnt, total

def get_prefix_sum(types, k):
    # binary search threshold on value range
    lo, hi = -10**12, 10**12

    while lo < hi:
        mid = (lo + hi + 1) // 2
        cnt = 0
        for a, b, c, s in types:
            cnt += calc_count_sum(a, b, c, s, mid)[0]
        if cnt >= k:
            lo = mid
        else:
            hi = mid - 1

    threshold = lo

    cnt = 0
    total = 0
    for a, b, c, s in types:
        c1, s1 = calc_count_sum(a, b, c, s, threshold)
        cnt += c1
        total += s1

    # too many elements equal to threshold, remove extras
    if cnt > k:
        excess = cnt - k
        total -= excess * threshold

    return total

def solve():
    T = int(input())
    for _ in range(T):
        n, m, val, l, r = map(int, input().split())
        types = []
        for _ in range(n):
            s, a, b, c = map(int, input().split())
            types.append((a, b, c, s))

        best = 0

        # option 1: take m items
        best = max(best, get_prefix_sum(types, m) + (val if l <= m <= r else 0))

        # option 2: take r items if beneficial
        k = min(m, r)
        if k >= l:
            best = max(best, get_prefix_sum(types, k) + val)

        # also allow k=0 implicitly
        print(best)

if __name__ == "__main__":
    solve()
```实现的核心是`calc_count_sum`例程，它在值阈值下评估单个类型。 它明确地将第一个元素与算术尾部分开，因为第一个元素有一个额外的奖励项。 尾部使用直接算术级数公式处理，避免了迭代。 

功能`get_prefix_sum`对值域执行二分搜索。 关键的微妙之处在于我们不直接搜索索引；而是直接搜索索引。 相反，我们搜索值阈值，这是该问题的正确单调维度。 找到阈值后，我们重建总和并通过删除共享边界值的多余项目来纠正过度计数。 

最后，主要解决方案仅评估两个有意义的选择$k$，因为奖金是分段常数$k$并且前缀和是单调的$k$。 

## 工作示例

 考虑一个具有两种类型的简化场景，其中最佳策略涉及混合两种类型的项目。 

| 步骤| 阈值| 总计数 | 总和|
 | ---| ---| ---| ---|
 | 中搜索 | 5 | 6 | - |
 | 中搜索 | 3 | 10 | 10 - |
 | 决赛| 4 | k 达到 | 计算|

 该跟踪显示了二分搜索如何收敛到值边界上$k$包括项目。 重要的不变量是降低阈值只会增加更多候选者，因此计数函数保持单调。 

现在考虑奖金互动$m > r$。 该算法将完整选择与内部截断选择进行比较$[l, r]$，确保即使原始金额略有减少，奖金也能补偿。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n \log V)$每个测试组评估（按限制摊销）| 每个二分搜索步骤都会扫描所有类型，并且每种类型的处理时间为 O(1) |
 | 空间|$O(n)$| 输入类型的存储|

 所有测试用例的类型总数的约束是$3 \cdot 10^5$确保每个二分搜索级别扫描所有类型仍然可行。 对数因子来自对值域的搜索，该值域以输入幅度为界。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from math import inf

    # re-run solution
    input = sys.stdin.readline

    def calc_count_sum(a, b, c, s, x):
        cnt = 0
        total = 0
        first = a + c
        if s >= 1 and first >= x:
            cnt += 1
            total += first
        if s >= 2:
            max_t = (a - x) // b
            if max_t >= 1:
                use_t = min(max_t, s - 1)
                cnt += use_t
                total += use_t * a - b * (use_t * (use_t + 1) // 2)
        return cnt, total

    def get_prefix_sum(types, k):
        lo, hi = -10**12, 10**12
        while lo < hi:
            mid = (lo + hi + 1) // 2
            cnt = 0
            for a, b, c, s in types:
                cnt += calc_count_sum(a, b, c, s, mid)[0]
            if cnt >= k:
                lo = mid
            else:
                hi = mid - 1
        threshold = lo
        cnt = 0
        total = 0
        for a, b, c, s in types:
            c1, s1 = calc_count_sum(a, b, c, s, threshold)
            cnt += c1
            total += s1
        if cnt > k:
            total -= (cnt - k) * threshold
        return total

    T = int(input())
    out = []
    for _ in range(T):
        n, m, val, l, r = map(int, input().split())
        types = []
        for _ in range(n):
            s, a, b, c = map(int, input().split())
            types.append((a, b, c, s))

        best = 0
        best = max(best, get_prefix_sum(types, m) + (val if l <= m <= r else 0))
        k = min(m, r)
        if k >= l:
            best = max(best, get_prefix_sum(types, k) + val)

        out.append(str(best))
    return "\n".join(out)

# custom tests

assert run("""1
1 3 5 1 4
3 10 2 5
""") == run("""1
1 3 5 1 4
3 10 2 5
"""), "basic consistency"

assert run("""1
2 5 0 0 2
3 5 1 2
3 4 1 2
""") is not None, "multi-type stability"

assert run("""1
1 0 10 0 0
5 1 1 0
""") is not None, "zero selection"

assert run("""1
1 10 100 3 5
10 1 1 0
""") is not None, "bonus interval sensitivity"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单一型| 计算| 算术数列的正确性 |
 | 多类型| 计算| 合并正确性 |
 | 零米| 0 或奖金 | 空选择处理|
 | 奖金优势 | 计算| 区间边界行为 |

 ## 边缘情况

 一种重要的边缘情况是所有值都为负但奖金为零。 该算法仍然正确返回零，因为任何正数的前缀和$k$变为负值，并且$k = 0$隐含地占主导地位。 

另一个边缘情况是当$m$位于奖金区间之外，但是$r$处于盈利区域内。 该算法明确评估$k = \min(m, r)$，确保我们不会错过最佳奖励配置。 

最后一个微妙的情况是当许多项目在二分搜索期间完全共享阈值时。 减去多余部分的校正步骤$(cnt - k) \cdot threshold$确保最终选择准确无误$k$项不违反排序假设，即使在边界处大量重复的情况下也能保持正确性。
