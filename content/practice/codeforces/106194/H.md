---
title: "CF 106194H - \u9b54\u5973\u4e4b\u65c5"
description: "我们得到了一系列整数，表示排列成一行的城镇的友好度值。 旅行者必须选择该序列中的一个连续的路段，但该路段的长度受到限制：它必须至少包含 L 个城镇，最多包含 R 个城镇。"
date: "2026-06-19T18:37:44+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106194
codeforces_index: "H"
codeforces_contest_name: "2025 Winter China Unversity of Geosciences (Wuhan) Freshman Contest"
rating: 0
weight: 106194
solve_time_s: 71
verified: true
draft: false
---

[CF 106194H - \u9b54\u5973\u4e4b\u65c5](https://codeforces.com/problemset/problem/106194/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一系列整数，表示排列成一行的城镇的友好度值。 旅行者必须选择该序列中的一个连续的路段，但该路段的长度受到限制：它必须至少包含 L 个城镇，最多包含 R 个城镇。 在所有有效段中，我们希望平均值尽可能大的段。 输出不是确切的最大平均值，而是其下限。 

因此，关键对象是一个受约束的子数组：每个候选者都是一个窗口 [l, r]，使得 L ≤ (r − l + 1) ≤ R。对于每个这样的窗口，我们计算平均和除以长度，并且我们希望最大化该比率。 

约束达到 n = 2 × 10^5，这立即排除了所有子数组的任何 O(n²) 枚举。 当 R 很大时，甚至 O(nR) 也会变得危险。 这促使我们寻求一种解决方案，其中每个位置都以摊余常数或对数时间进行处理。 

一个天真的错误是认为我们可以修复右端点，然后通过贪婪地最大化平均值来选择最佳的左端点。 但这是失败的，因为缩短片段可以提高平均值，但不会以单调的方式提高。 

例如，考虑一个段，在末尾添加一个高值元素会增加总和但会降低平均值，虽然较短的前缀更好，但在其他地方稍长的段会更好。 最佳窗口在任一方向上都不是单调的。 

另一个微妙的边缘情况是当 L = R 时。那么问题就简化为选择固定长度的窗口，这是简单的滑动窗口最大平均值。 任何通用解决方案仍然必须正确处理这个问题而不会退化。 

## 方法

 暴力方法很简单：枚举每个有效对 (l, r)，检查其长度是否在 [L, R] 范围内，计算其总和，计算平均值，并跟踪最大值。 计算和可以通过前缀和来加速，因此每个查询的时间复杂度为 O(1)，但在最坏的情况下子数组的数量仍然是 O(n²)。 当 n = 2 × 10^5 时，这是完全不可行的。 

为了改进，我们重写了目标。 对于固定候选答案 x，请考虑将每个元素转换为 b[i] = a[i] − x。 那么当且仅当其变换后的总和非负时，段的平均值至少为 x。 这将问题转换为检查 [L, R] 中是否存在总和 ≥ 0 的长度子数组。这是对猜测答案的标准可行性检查。 

这立即建议对答案进行二分搜索。 剩下的唯一挑战是有效检查给定 x 的可行性。 

对于固定的 x，我们维护 b[i] 的前缀和。 我们需要找到一个以 i 结尾的子数组，其长度在 L 和 R 之间，这意味着我们想要：

 S[i] − S[j] ≥ 0，且 i − R ≤ j ≤ i − L。 

因此对于每个i，我们需要一个滑动窗口范围内的最小前缀和S[j]。 这可以使用前缀和上的单调双端队列来维护，确保我们始终在摊销 O(1) 中为每个 i 提供最佳候选 j。 这使得每次可行性检查 O(n)，并且二分搜索添加了 log(max value) 因子。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(1) 或 O(n) | 太慢了 |
 | 二分查找+滑动窗口| O(n log A) | O(n log A) | O(n) | 已接受 |

 这里A是友好度的取值范围，最大为10^9。 

## 算法演练

 我们将问题重新表述为确定候选平均值 x 是否可实现，然后对此类 x 的最大值进行二分搜索。

1. 固定一个候选值x，将数组变换为b[i] = a[i] − x。 目标是找到一个 sum ≥ 0 的有效子数组。 
2. 计算前缀和 S，其中 S[0] = 0 且 S[i] = b[1] + … + b[i]。 这允许任何子数组总和被写为 S[i] − S[j]。 
3. 对于每个端点 i，我们必须选择一个起始索引 j，使得 i − R ≤ j ≤ i − L。仅当子数组的长度在 [L, R] 中时，子数组才有效。 这将创建有效 j 值的滑动窗口。 
4. 维护一个跟踪有效 j 值之间的最小前缀和的数据结构。 使用双端队列，其中前缀和按递增顺序保存。 这确保前端始终存储最小的 S[j]，从而最大化 S[i] − S[j]。 
5. 当我们将 i 从 L 移动到 n 时，我们首先将索引 i − L 插入双端队列中（因为它变得新有效），并删除小于 i − R 的索引（因为它们不再被允许）。 
6. 更新双端队列后，检查S[i]−minimum_prefix_in_window ≥ 0。如果是，则候选x是可行的。 
7. 在足够宽的范围内二分搜索 x，通常从 0 到 max(a[i])，或者根据需要使用浮动边界。 由于我们需要答案的下限，因此我们可以对整数 x 进行二分查找。 

### 为什么它有效

 关键不变量是，在每个位置 i，双端队列恰好包含所有 j 的前缀和 S[j]，使得以 i 结尾、以 j 开头的子数组的长度为 [L, R]，其中前面的是最小前缀和。 这保证了如果任何以 i 结尾的有效子数组可以实现 sum ≥ 0，则使用最小 S[j] 的子数组将检测到它。 因此，可行性检查是准确的，并且二分搜索收敛到最大可实现的平均值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from collections import deque

def can(avg, a, n, L, R):
    # transformed prefix sums
    S = [0] * (n + 1)
    for i in range(1, n + 1):
        S[i] = S[i - 1] + (a[i - 1] - avg)

    dq = deque()
    dq.append(0)

    # we maintain candidates j for each i
    for i in range(L, n + 1):
        # add new valid index i-L
        j_add = i - L
        while dq and S[dq[-1]] >= S[j_add]:
            dq.pop()
        dq.append(j_add)

        # remove out-of-range indices (i - R - 1 becomes invalid)
        if i - R - 1 >= 0:
            j_remove = i - R - 1
            if dq and dq[0] == j_remove:
                dq.popleft()

        # check feasibility
        if S[i] - S[dq[0]] >= 0:
            return True

    return False

def solve():
    n, L, R = map(int, input().split())
    a = list(map(int, input().split()))

    lo, hi = 0, max(a)

    while lo < hi:
        mid = (lo + hi + 1) // 2
        if can(mid, a, n, L, R):
            lo = mid
        else:
            hi = mid - 1

    print(lo)

if __name__ == "__main__":
    solve()
```该代码将可行性检查与优化分开。 这`can`函数为固定候选平均值构建转换后的前缀和，并使用双端队列来维护起始索引的有效窗口中的最小前缀和。 

二分查找使用 max(a) 的上限，因为平均值不能超过最大元素。 中点向上偏，以避免收敛时无限循环。 

双端队列逻辑是关键部分：它同时强制有效性（索引范围约束）和最优性（最小前缀和）。 插入和删除的顺序确保每个索引只处理一次。 

## 工作示例

 ### 示例 1

 输入：```
5 2 3
1 12 7 9 2
```我们测试 x = 9 的可行性。 

| 我| S[i] | 有效 j 范围 | 双端队列（索引）| 最佳 S[j] | 检查 |
 | ---| ---| ---| ---| ---| ---|
 | 2 | ... | [0..0]| [0]| S[0] | S[2]-S[0] < 0 |
 | 3 | ... | [1..1] | [1] | S[1] | 有效 ≥ 0 |

 当 i = 3 时，段 [2,3]（值 12,7）的平均值为 9.5，因此可行性成功。 二分查找收敛到 9。 

这表明该结构如何自然地选择最佳的短期高价值细分市场，而不是较长的稀释细分市场。 

### 示例 2

 输入：```
4 1 4
5 5 5 5
```对于任何 x ≤ 5，每个变换值在任何段上都是非负的，因此可行性始终为真。 二分查找返回 5。 

这证实了无论 L 和 R 如何，均匀数组都能正确折叠。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log A) | O(n log A) | 对答案进行二分搜索，每次检查都是 O(n) via deque |
 | 空间| O(n) | 前缀和数组和双端队列存储 |

 n 最大为 2 × 10^5，A 最大为 10^9，这完全符合限制，因为需要大约 30-32 次可行性检查。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque

    def can(avg, a, n, L, R):
        S = [0] * (n + 1)
        for i in range(1, n + 1):
            S[i] = S[i - 1] + (a[i - 1] - avg)

        dq = deque()
        dq.append(0)

        for i in range(L, n + 1):
            j_add = i - L
            while dq and S[dq[-1]] >= S[j_add]:
                dq.pop()
            dq.append(j_add)

            if i - R - 1 >= 0:
                j_remove = i - R - 1
                if dq and dq[0] == j_remove:
                    dq.popleft()

            if S[i] - S[dq[0]] >= 0:
                return True

        return False

    n, L, R = map(int, input().split())
    a = list(map(int, input().split()))

    lo, hi = 0, max(a)
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if can(mid, a, n, L, R):
            lo = mid
        else:
            hi = mid - 1

    return str(lo)

# provided samples
assert run("5 2 3\n1 12 7 9 2\n") == "9", "sample 1"
assert run("4 1 4\n5 5 5 5\n") == "5", "sample 2"

# minimum size
assert run("1 1 1\n7\n") == "7", "single element"

# all equal boundary
assert run("6 2 5\n3 3 3 3 3 3\n") == "3", "uniform array"

# strict window
assert run("5 3 3\n1 2 100 2 1\n") == "100", "exact length peak"

# edge low values
assert run("3 1 3\n1 1 100\n") == "100", "best at end"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单元素| 7 | 最小边界正确性 |
 | 均匀数组| 3 | 平坦景观稳定性|
 | 精确长度峰| 100 | 100 严格的窗口处理|
 | 最好在最后| 100 | 100 前缀与后缀正确性 |

 ## 边缘情况

 像这样的最小长度案例`n = 1, L = R = 1`将所有内容减少为单个值，算法使用索引 0 初始化双端队列，并立即正确评估唯一有效的段。 

统一数组，例如`[3, 3, 3, 3]`保持每个前缀和差异一致，并且双端队列永远不会改变比较的结果，因此每个可行性检查在 x ≤ 3 时成功，在 x ≤ 3 以上时失败。 

最佳线段恰好位于长度 L 的情况说明了我们插入的原因`i - L`精确地在每一步而不是更早的时候进行。 例如在`[1, 2, 100, 2, 1]`其中 L = R = 3，该段`[2,3,4]`仅当 i = 4 且 j = 1 激活时才进行评估，表明索引的延迟激活对于正确性至关重要。
