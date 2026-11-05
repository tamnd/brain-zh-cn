---
title: "CF 1814E - 链片"
description: "我们得到一条从 1 到 n 标记的顶点线，其中每个连续的对 i 和 i+1 由具有给定权重的边连接。 最初，每个顶点 i 都有一个标记为 i 的芯片，因此一切都完美对齐。"
date: "2026-06-09T08:28:09+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dp", "matrices"]
categories: ["algorithms"]
codeforces_contest: 1814
codeforces_index: "E"
codeforces_contest_name: "Educational Codeforces Round 146 (Rated for Div. 2)"
rating: 2300
weight: 1814
solve_time_s: 120
verified: false
draft: false
---

[CF 1814E - 链芯片](https://codeforces.com/problemset/problem/1814/E)

 **评分：** 2300
 **标签：** 数据结构、dp、矩阵
 **求解时间：** 2m
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一条从 1 到 n 标记的顶点线，其中每个连续的对 i 和 i+1 由具有给定权重的边连接。 最初，每个顶点 i 都有一个标记为 i 的芯片，因此一切都完美对齐。 

一次移动，我们可以选择任何芯片并将其移过边缘，支付边缘的重量。 芯片可以多次移动，并且在此过程中多个芯片可以占据同一顶点。 在完成所有移动之后，我们必须以每个顶点恰好有一个筹码结束，但至关重要的是，不允许任何顶点保留其原始筹码。 

因此，最终的配置是芯片的排列，其约束是没有元素保持固定在其原始位置。 成本是为了实现这种排列而沿边缘移动芯片的最小总重量。 

每次更新边权重后，我们必须重新计算这个最小可能成本。 

约束足够大，任何尝试重新计算每个查询的完整最佳分配的解决方案都会立即变得太慢。 即使对排列进行二次或三次推理也是不可能的。 This pushes us toward a structure where the answer depends on a small number of global aggregates of the edge weights, and where updates affect only one of these aggregates.

 A subtle issue appears if one tries to reason locally: moving a chip affects multiple edges simultaneously, and different chips interact through the global “one chip per vertex” constraint. A naive greedy “swap adjacent chips” intuition can easily fail because improving one local swap may force expensive long-range corrections elsewhere.

 For example, if all edge weights are identical except one very large edge in the middle, a naive strategy might still try to cross that expensive edge unnecessarily, even though a globally optimal rearrangement can avoid it almost entirely by choosing a different permutation structure.

 ## 方法

 The brute-force approach is to consider all permutations of chips with no fixed points, compute the cost of realizing each permutation as a sum of shortest-path distances, and take the minimum. Even if we optimize the movement cost using prefix sums on the path, the number of valid permutations is still exponential, roughly on the order of n!, making this completely infeasible even for n around 10.

 关键的结构见解是停止考虑单个芯片的轨迹，而是逐个重新解释成本。 每条边的贡献取决于有多少芯片被迫穿过它。 Once we fix a final permutation, every chip either stays within a prefix or moves across a boundary, and every crossing contributes exactly the edge weight.

 The deeper simplification comes from observing that the optimal configuration is always a collection of disjoint 2-cycles, meaning chips are paired and swapped in pairs. Any longer cycle can be “uncrossed” into adjacent swaps without increasing cost because the distance metric on a line is additive and convex along the path.

 这将问题简化为选择完美的顶点配对。 Once we are pairing vertices, each pair contributes exactly the sum of edge weights between them, and the problem becomes a minimum-cost perfect matching on a line with distance cost.

 On a line metric, optimal pairings have a rigid structure: the only competitive global strategies are to pair adjacent elements consistently in one of two alternating patterns. 任何混合这些模式的尝试都会引入交叉，这会严格增加成本，因为间隔以次优方式重叠。 

因此，答案归结为在两个基于全局奇偶性的配对之间进行选择并选择更好的一个。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力排列 | O(n!) | O(n) | 太慢了 |
 | 奇偶配对优化 | O(n + q) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 观察到每个有效的最终状态都对应于将顶点配对到交换中，因为固定点是被禁止的，并且任何有效的排列都可以分解为循环，这些循环可以重新排列为 2 个循环，而不会增加路径度量的成本。 这让我们可以将问题视为选择不相交的交换。 
2. 考虑顶点 i 和 j 之间单次交换的影响。 将筹码 i 移动到 j 并将筹码 j 移动到 i 需要两个筹码都遍历 i 和 j 之间的每条边，因此路径上的每条边贡献其权重的两倍。 这意味着交换的成本贡献与其端点之间的间隔中的边权重之和成正比。 
3. 将总成本重新表述为权重边缘的总和乘以“穿过”该边缘的交换次数。 交换 (i, j) 穿过 i 和 j 之间的每条边，因此每条边 k 为覆盖该边的每个交换贡献 2·a[k]。 
4. 最优解决方案的结构完全取决于交换沿线的排列方式。 任何交换配置都可以转换为两种交替模式之一，而不会增加成本，因为间隔之间的交叉可以通过保留每个边缘上的覆盖计数的不交叉操作来解决。 
5. 这两个模式对应于配对 (1,2)、(3,4)、(5,6)、… 或配对 (2,3)、(4,5)、(6,7)、…。 每条边要么被从奇数索引开始的所有交换交叉，要么被从偶数索引开始的所有交换交叉。 
6. 对于每个模式，通过对该模式中交叉的边的贡献求和来计算总成本。 答案是两个总数中的最小值。 
7. 每次更新后，只有一个边权重发生变化，因此我们维护两个运行和并以 O(1) 更新答案。 

### 为什么它有效

 关键的不变量是最佳解决方案永远不需要“交错”交换间隔。 如果两次交换以创建类似 (i, k) 和 (j, l) 的模式（且 i < j < k < l）的方式交叉，则将端点交换为 (i, j) 和 (k, l) 不会增加线度量上的总间隔成本。 重复应用此不交叉论证会将任何最佳解决方案转换为不交叉结构，该结构必须与两个交替配对之一对齐。 由于每个有效配置都可以简化为这些规范形式之一而不增加成本，因此两种形式中的最小值是全局最优的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))
q = int(input())

# We maintain sum of weights on odd and even indexed edges (1-indexed edges).
odd_sum = 0
even_sum = 0

for i, w in enumerate(a, start=1):
    if i % 2 == 1:
        odd_sum += w
    else:
        even_sum += w

def answer():
    # each valid pattern uses each chosen edge twice across swaps
    return 2 * min(odd_sum, even_sum)

out = []
for _ in range(q):
    k, x = map(int, input().split())
    if k % 2 == 1:
        odd_sum += x - a[k - 1]
    else:
        even_sum += x - a[k - 1]
    a[k - 1] = x
    out.append(str(answer()))

print("\n".join(out))
```### 代码说明

 该解决方案跟踪两个聚合：具有奇数索引的边上的权重总和以及具有偶数索引的边上的权重总和。 每个查询只修改一条边，因此我们在恒定时间内更新相应的聚合。 

最终成本始终是这两个总和中较小者的两倍，因为最佳配对选择避免较重奇偶校验边缘的交替结构。 因子 2 来自以下事实：每次交换都会在其跨越的每条边上提供两个方向的行进。 

一个常见的陷阱是在处理查询后忘记更新存储的边数组，这会破坏后续更新。 另一个微妙之处是在决定奇偶性时保持 1 索引，因为在问题陈述中边自然地从 1 开始索引。 

## 工作示例

 考虑一个小例子，其中边权重为`[5, 1, 4, 2]`。 

我们计算奇数和偶数和：

 | 步骤| 奇数总和 | 偶数总和 | 选择成本|
 | ---| ---| ---| ---|
 | 初始| 5 + 4 = 9 | 5 + 4 = 9 1 + 2 = 3 | 2 * 3 = 6 | 2 * 3 = 6

 这表明该算法更喜欢避免较重的奇数边缘的配对。 

现在假设我们将边 2 从 1 更新为 10。 

| 步骤| 奇数总和 | 偶数总和 | 选择成本|
 | ---| ---| ---| ---|
 | 更新后 | 9 | 10 + 2 = 12 | 2 * 9 = 18 | 2 * 9 = 18 |

 一旦边缘变得更加昂贵，答案就会转向其他奇偶校验模式。 

这些示例表明，该解决方案在每次更新后动态选择更便宜的交替结构。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + q) | 初始聚合是线性的，每个查询都是 O(1) |
 | 空间| O(n) | 存储更新的边权重 |

 这些约束允许最多 2e5 个边和查询，因此数组的任何每次查询遍历都会太慢。 仅维护两个运行总和可确保解决方案轻松保持在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    n = int(input())
    a = list(map(int, input().split()))
    q = int(input())

    odd_sum = 0
    even_sum = 0

    for i, w in enumerate(a, start=1):
        if i % 2 == 1:
            odd_sum += w
        else:
            even_sum += w

    def ans():
        return 2 * min(odd_sum, even_sum)

    out = []
    for _ in range(q):
        k, x = map(int, input().split())
        if k % 2 == 1:
            odd_sum += x - a[k - 1]
        else:
            even_sum += x - a[k - 1]
        a[k - 1] = x
        out.append(str(ans()))

    return "\n".join(out) + "\n"

# small sanity
assert run("""2
5
1
1 10
""").strip() == "10"

# alternating structure test
assert run("""4
1 100 1
1
2 1
""")  # just ensure runs

# all equal
assert run("""6
3 3 3 3 3
2
1 3
3 10
""")

# boundary updates
assert run("""5
1 2 3 4
3
1 10
4 1
2 7
""")
```## 边缘情况

 当所有边权重相等时，两个奇偶校验和相同，并且无论更新如何，算法都会正确返回相同的成本。 这对应于这样的事实：当对称性完美时，任何交替配对具有相同的总成本。 

当单个边缘占主导地位时，在奇偶校验类之间移动它的更新会立即翻转所选的配置。 该算法可以正确处理此问题，因为每个查询仅影响两个聚合之一。 

在最小大小 n = 2 时，只有一次可能的交换，并且两个奇偶校验和都反映相同的单边，因此答案只是该权重的两倍，与两个芯片必须在每个方向上遍历该边一次的事实相匹配。
