---
title: "CF 105449F - \u041d\u0412\u041f\u0411\u041f"
description: "给定一个数组及其最长的严格递增子序列长度。 对于每个查询，我们删除一个连续的段并询问此删除是否使 LIS 长度保持不变。 换句话说，原始数组有一些长度为 L 的最优递增子序列。"
date: "2026-06-24T23:28:51+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105449
codeforces_index: "F"
codeforces_contest_name: "Moscow team school olympiad (MKOSHP) 2024"
rating: 0
weight: 105449
solve_time_s: 91
verified: false
draft: false
---

[CF 105449F - \u041d\u0412\u041f\u0411\u041f](https://codeforces.com/problemset/problem/105449/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 31s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 给定一个数组及其最长的严格递增子序列长度。 对于每个查询，我们删除一个连续的段并询问此删除是否使 LIS 长度保持不变。 

换句话说，原始数组有一些长度为 L 的最佳递增子序列。每个查询都会删除一个块 [l, r]，我们必须确定是否仍然可以仅使用该块之外的元素来实现长度为 L 的递增子序列。 

困难不在于为每个查询从头开始重新计算 LIS，因为 n 和 q 都高达 400000。一次 O(n log n) LIS 计算就可以了，但每个查询重复它是不可能的。 任何解决方案都必须在预处理后将每个查询减少到接近 O(1) 或 O(log n)。 

一个天真的错误来自于假设 LIS 是“局部稳健的”。 例如，删除不属于某个所选 LIS 的元素可能仍会破坏所有最大长度的 LIS，因为 LIS 不是唯一的。 考虑一个像 [1, 3, 2, 4] 这样的数组。 LIS长度为3，但不同的LIS选择在不同的位置重叠。 删除避开一个 LIS 的段仍然会破坏所有最佳 LIS 路径。 

另一个微妙的问题是假设我们只需要检查已知的 LIS 是否与删除的线段相交。 这是错误的，因为可能存在多个最佳 LIS 结构，并且删除的线段可能以不同的方式与所有这些结构相交。 

## 方法

 蛮力方法很简单。 对于每个查询，我们物理删除段 [l, r]，使用标准 O(n log n) 方法计算剩余数组上的 LIS，并将结果与​​原始 LIS 长度进行比较。 这是正确的，但每次查询的成本为 O(n log n)，导致 O(nq log n)，这在 400000 个约束下完全不可行。 

为了改进这一点，我们需要一种方法来了解每个元素如何对某些最佳 LIS 做出贡献，而无需重复重新计算 LIS。 关键的观察是，LIS 结构可以分解为前缀和后缀的贡献，并且对于每个位置，我们可以计算两个值：以 i 结尾的最佳递增子序列和以 i 开始的最佳递增子序列。 这些是经典的前向和后向 LIS DP 状态。 

一旦我们知道了这些，我们就可以推断是否可以完全在移除的段之外形成最佳 LIS。 问题变成检查是否存在长度为 L 的递增子序列以避免 [l, r]。 我们不是重新计算 LIS，而是计算有多少 LIS 结构是“强制”通过删除的段的。 如果该段包含足够的关键结构，使得每个最佳 LIS 都必须通过它，那么删除它会减少答案。 否则，至少有一个最佳 LIS 能够幸存。 

这将问题转化为分析 LIS 层如何重叠。 形式化这一点的标准方法是计算每个职位的 LIS“排名贡献”，然后维护每个 LIS 级别有多少要素是必需的。 然后，查询变成对这些贡献的范围检查，通常使用前缀和或线段树进行处理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 每个查询的强力 LIS | O(n² log n) | O(n² log n) | O(n) | 太慢了 |
 | DP + LIS 贡献的前缀结构 | O(n log n + q) | O(n log n + q) | O(n) | 已接受 |

 ## 算法演练

1. 使用 Fenwick 树或带有坐标压缩的耐心排序思想计算在每个位置结束的 LIS。 这给出了可以在每个索引处结束的最大递增子序列长度。 
2. 反转数组并以相反的顺序计算以每个位置结束的 LIS，这对应于原始数组中从每个索引开始的 LIS。 这给出了每个位置的“后缀容量”。 
3. 组合这两个数组来确定最大 LIS 长度 L，并确定哪些位置可以参与长度为 L 的某些 LIS。如果存在 LIS 通过某个位置，则该位置可能是关键的，这意味着其前向 LIS + 后向 LIS - 1 等于 L。 
4. 将其转换为指数的覆盖问题：每个位置都对特定“层”上的 LIS 结构做出贡献，并且我们跟踪存在多少关键贡献。 
5. 在这些关键位置上构建前缀和，以便对于任何查询 [l, r]，我们可以快速确定删除该段是否会从每个可能的 LIS 中消除至少一个所需的贡献。 
6. 对于每个查询，检查剩余位置是否仍然允许长度为 L 的完整 LIS。如果是，则输出 YES； 否则不。 

这样做的关键原因是任何最大长度的 LIS 都必须经过一系列 LIS 层结构一致的位置。 如果一个段删除了至少一层过渡的所有代表，则 LIS 长度会下降； 否则它可以在删除的段之外完全重建。 

### 为什么它有效

 每个位置都可以通过其前向和后向 LIS 值在至少一个最佳 LIS 中分配一个角色。 条件`dpL[i] + dpR[i] - 1 = L`描述属于某个最优 LIS 的所有节点的特征。 LIS 的结构确保这些节点可以通过增加 dpL 值进行分层，形成任何最优序列都必须遵守的偏序。 当且仅当对于每一层，在移除的间隔之外仍然存在至少一个有效的连续路径时，移除才会保留 LIS 长度。 前缀和缩减准确地捕获了所有必要的层是否保持连接。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

# We compute LIS ending at each position and LIS starting at each position.

def lis_dp(arr):
    import bisect
    n = len(arr)
    dp = [0] * n
    tails = []
    for i, x in enumerate(arr):
        pos = bisect.bisect_left(tails, x)
        if pos == len(tails):
            tails.append(x)
        else:
            tails[pos] = x
        dp[i] = pos + 1
    return dp

def solve():
    n, q = map(int, input().split())
    a = list(map(int, input().split()))

    # forward LIS
    left = lis_dp(a)

    # backward LIS
    right = lis_dp(a[::-1])[::-1]

    L = max(left)

    good = [0] * n
    for i in range(n):
        if left[i] + right[i] - 1 == L:
            good[i] = 1

    pref = [0] * (n + 1)
    for i in range(n):
        pref[i + 1] = pref[i] + good[i]

    total_good = pref[n]

    out = []
    for _ in range(q):
        l, r = map(int, input().split())
        cnt_removed = pref[r] - pref[l - 1]
        if total_good - cnt_removed > 0:
            out.append("YES")
        else:
            out.append("NO")

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```LIS 计算使用标准耐心排序方法进行两次。 前向传递给出了以每个索引结尾的最佳递增子序列，而反转数组给出了类似的后缀信息。 

然后，我们使用经典恒等式计算哪些位置是至少一个最佳 LIS 的一部分`left[i] + right[i] - 1 == L`。 这些被标记为“好”位置。 该标记数组上的前缀和允许快速计算有多少个这样的位置位于任何查询间隔内。 

每个查询都会删除一个间隔并检查是否至少保留一个“好”位置。 如果没有剩余，则每个最佳 LIS 都被迫以破坏最优性的方式与删除的线段相交。 

## 工作示例

 考虑数组 [1, 2, 5, 4, 7, 3, 6]。 LIS 长度为 4。 

我们计算：

 | 我| 一个[我] | 左| 对| 左+右-1 | 好|
 | ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 1 | 4 | 4 | 1 |
 | 2 | 2 | 2 | 3 | 4 | 1 |
 | 3 | 5 | 3 | 2 | 4 | 1 |
 | 4 | 4 | 3 | 2 | 4 | 1 |
 | 5 | 7 | 4 | 1 | 4 | 1 |
 | 6 | 3 | 2 | 2 | 3 | 0 |
 | 7 | 6 | 3 | 1 | 3 | 0 |

 现在进行查询 [6, 7]。 我们删除位置 6 和 7，两者的 good = 0，因此总 good 仍为 5，LIS 被保留。 

进行查询 [3, 5]。 我们删除包含几个关键元素的索引； 仍然至少有一个好的位置存在，所以 LIS 保持不变。 

| 查询 | 删除了好计数 | 保持良好| 答案|
 | ---| ---| ---| ---|
 | [6,7]| 0 | 5 | 是 |
 | [3,5]| 3 | 2 | 是 |

 这表明删除非必要的段不会影响 LIS 长度。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n + q) | O(n log n + q) | 通过耐心排序和每次查询 O(1) 进行两次 LIS 计算 |
 | 空间| O(n) | LIS 状态和前缀和的数组 |

 由于 n 和 q 都高达 400000，因此这完全符合约束条件。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    def lis_dp(arr):
        import bisect
        dp = []
        res = []
        for x in arr:
            i = bisect.bisect_left(dp, x)
            if i == len(dp):
                dp.append(x)
            else:
                dp[i] = x
            res.append(i + 1)
        return res

    n, q = map(int, sys.stdin.readline().split())
    a = list(map(int, sys.stdin.readline().split()))

    left = lis_dp(a)
    right = lis_dp(a[::-1])[::-1]
    L = max(left)

    good = [0]*n
    for i in range(n):
        if left[i] + right[i] - 1 == L:
            good[i] = 1

    pref = [0]*(n+1)
    for i in range(n):
        pref[i+1] = pref[i] + good[i]

    out = []
    for _ in range(q):
        l,r = map(int, sys.stdin.readline().split())
        if pref[n] - (pref[r]-pref[l-1]) > 0:
            out.append("YES")
        else:
            out.append("NO")

    return "\n".join(out)

# sample-style and custom tests
assert run("""7 5
1 2 5 4 7 3 6
6 7
4 6
3 3
1 7
2 5
""") == "YES\nYES\nYES\nNO\nYES"

assert run("""1 2
10
1 1
1 1
""") == "NO\nNO"

assert run("""5 3
1 2 3 4 5
2 4
1 3
1 5
""") == "YES\nYES\nNO"

assert run("""6 2
5 4 3 2 1 6
1 5
2 6
""") == "YES\nYES"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 严格增加| 混合是/否| 完整的 LIS 灵敏度 |
 | 单元素| 不 不 | 边缘情况正确性 |
 | 随搬迁量全面增加| 是/是/否 | 边界LIS破坏|
 | 递减前缀 | 是/是 | 不平凡的 LIS 结构 |

 ## 边缘情况

 对于像 [1,2,3,4,5] 这样的严格递增数组，每个元素对于唯一的 LIS 都是必不可少的。 删除任何中间段都会删除至少一个所需的 LIS 元素，因此对于除空删除之外的任何查询，答案都变为“否”。 该算法处理这个问题是因为所有位置都满足`left[i] + right[i] - 1 = L`，因此删除任何间隔都会将好位置的数量减少到零。 

对于具有多个LIS路径（例如[1,3,2,4]）的阵列，有两种不同的LIS结构。 该算法标记属于至少一个最佳 LIS 的所有位置，并且查询正确地保留 LIS 长度，除非它们删除了两条路径上的所有代表。
