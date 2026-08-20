---
title: "CF 104390A - 合并"
description: "两个人报告沿线有充电站。 每个车站都有一个位置和多个销售点。 我们有效地构建了多个位置集，其中每个位置根据存在的网点数量出现多次。 先生。"
date: "2026-07-01T02:46:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104390
codeforces_index: "A"
codeforces_contest_name: "The Unofficial Mirror Contest of 19th Thailand Olympiad in Informatics Day 1"
rating: 0
weight: 104390
solve_time_s: 178
verified: true
draft: false
---

[CF 104390A - 合并](https://codeforces.com/problemset/problem/104390/A)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 两个人报告沿线有充电站。 每个车站都有一个位置和多个销售点。 我们有效地构建了多个位置集，其中每个位置根据存在的网点数量出现多次。 

X先生的数据是固定的：每个AC站重复贡献其坐标`s_i`次。 Y先生的数据类似，但在合并之前，每个坐标都在查询中使用相同的公式进行线性变换：`y -> alpha * y + beta`。 改造后各直流站贡献`t_j`这个新坐标的副本。 

一旦两个多重集组合起来，所有内容都按坐标排序，然后我们将结果展平为单个序列。 每个位置扩展成一个块，其长度等于其总重数。 查询询问此展平序列中第 k 个位置的值。 

重要的困难是我们没有显式地构建扩展数组。 元素总数可以达到数千万，因此任何实现合并序列的方法都无法适应时间或内存。 

这些约束表明对每个数据集进行预处理是可以的，但每个查询必须在输入大小的大致对数时间内得到回答。 对于最多 100,000 个站和 50,000 个查询，即使每次查询 O(N log N + Q log N) 也是可以接受的，但任何与 k 或总重数呈线性关系的情况都是不可接受的。 

一个微妙的边缘情况是变换后的重叠。 不同的原始 Y 坐标可能会映射到与 X 坐标一致的位置，从而需要正确求和计数。 另一个微妙之处是转换保留了顺序，因为`alpha >= 1`，因此 Y 站的相对顺序不会改变。 这可以防止在转换后重新排序 Y 的需要； 只有价值观的转变和规模。 

## 方法

 直接方法会将每个站扩展为重复的坐标，并像合并排序的标准合并步骤一样合并两个列表。 这是正确的，因为最终的结构只是两个交错的排序流。 然而，扩展元素的总数可能非常大，因此显式合并太慢并且占用内存太大。 

关键的观察是我们实际上从来不需要完整的合并序列。 我们只需要第 k 个元素。 这建议使用选择策略而不是完整构建。 我们可以通过检查候选值有多少元素小于或等于它来回答每个查询，而不是构建数组。 可以使用每个数组内的前缀和和二分搜索来有效地计算该计数。 

然后我们对答案值本身进行二分搜索。 由于两个数组均按位置排序，并且 Y 在转换后仍保持排序，因此可以使用 upper_bound 逻辑以对数时间计算每个数组的元素计数 ≤ v。 

这将问题转换为对两个加权排序列表进行重复的顺序统计查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 扩展和合并 | 每个查询的 O(总槽数) | O(总槽数) | 太慢了|
 | 对带有前缀计数的值进行二分搜索 | O((N+M) log V + Q log V log N) | O(N+M) | 已接受 |

 ## 算法演练

 ### 预计算

 我们首先将每个数组压缩为前缀和，以便我们可以在对数时间内计算有多少个站点位于某个范围内。 

### 处理每个查询

 1、将Y先生的变换按需转换为函数：不修改数组，只变换比较阈值。 这避免了为每个查询重建 Y。 
2. 对于候选答案值`v`，使用二分搜索计算有多少个 X 值 ≤ v`x_i`和前缀和`s_i`。 
3. 对于 Y 值，反转变换条件。 我们想要：`alpha * y + beta ≤ v`变成：`y ≤ (v - beta) // alpha`这给出了原始 Y 数组中的阈值。 
4. 数一数有多少个`y_j`使用二分搜索和前缀总和来满足此阈值`t_j`。 
5. 将两个计数相加，得到元素总数 ≤ v。 
6. 对可能的值进行二分查找以找到最小的 v，使得计数至少为 k。 

### 为什么它有效

 合并的结构是排序的多重集。 谓词“count ≤ v”在 v 中是单调的，这意味着随着 v 的增加，计数永远不会减少。 这保证了二分查找的正确性。 前缀总和确保我们正确考虑多重性，因此每个站点都准确贡献其网点数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from bisect import bisect_right

def build_prefix(vals, w):
    # prefix sums for weights
    pref = [0] * (len(w) + 1)
    for i in range(len(w)):
        pref[i + 1] = pref[i] + w[i]
    return pref

def count_leq(vals, pref, x):
    # number of vals <= x, using prefix + bisect
    idx = bisect_right(vals, x)
    return pref[idx]

def solve():
    N, M, Q = map(int, input().split())
    x = list(map(int, input().split()))
    sx = list(map(int, input().split()))
    y = list(map(int, input().split()))
    ty = list(map(int, input().split()))

    px = build_prefix(x, sx)
    py = build_prefix(y, ty)

    total = px[-1] + py[-1]

    def count(v, a, b):
        # X part
        cx = count_leq(x, px, v)
        # Y part: alpha*y + beta <= v => y <= (v - beta) / alpha
        limit = (v - b) // a
        cy = count_leq(y, py, limit)
        return cx + cy

    for _ in range(Q):
        a, b, k = map(int, input().split())

        lo = -10**12
        hi = 10**12

        while lo < hi:
            mid = (lo + hi) // 2
            if count(mid, a, b) >= k:
                hi = mid
            else:
                lo = mid + 1

        print(lo)

if __name__ == "__main__":
    solve()
```X 和 Y 数组在整个计算过程中保持不变。 前缀总和超过`s_i`和`t_j`允许通过二分搜索在对数时间内回答每个“有多少个电台在这里做出贡献”的查询。 

关键的实现细节是变换不等式的反转。 自从`alpha`始终为正，除法不会翻转方向，整数楼层除法可以正确处理边界。 

二分搜索对答案值空间而不是索引进行操作，这避免了触及潜在的巨大扩展多重集。 

## 工作示例

 ### 示例 1

 我们考虑一个小配置：

 X = 位置`[1, 4]`有重量`[2, 1]`Y = 位置`[2, 3]`有重量`[1, 2]`询问：`alpha = 2, beta = 0, k = 3`我们搜索最小值 v，使得至少 3 个元素 ≤ v。 

| v | X ≤ v | Y 变换 ≤ v | 总计 |
 | --- | --- | --- | --- |
 | 1 | 2 | 0 | 2 |
 | 2 | 2 | 1 | 3 |

 第一个达到 k = 3 的 v 是 2，这就是答案。 

这显示了多重性如何直接影响累积计数。 

### 示例 2

 X =`[1, 5]`和`[1, 1]`Y=`[2, 6]`和`[1, 1]`询问：`alpha = 1, beta = -2, k = 2`Y 变为`[0, 4]`。 

我们评估计数：

 | v | X ≤ v | Y ≤ v | 总计 |
 | --- | --- | --- | --- |
 | 0 | 0 | 1 | 1 |
 | 1 | 1 | 1 | 2 |

 所以答案是1。 

这演示了转换后的数组如何引入新的排序以及不等式的反转如何干净地处理它。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(Q log V log N) | O(Q log V log N) | 使用 log N 计数对值范围进行二分搜索 |
 | 空间| O(N + M) | 数组和前缀和的存储 |

 这些约束允许最多 50,000 个查询，每个查询在值空间上执行大约 60 次二分搜索迭代，每次花费两个对数计数。 这完全符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdin.read()

# Note: full solution integration assumed in real testing environment
# These are structural tests rather than executable here

# minimal case
# 1 station each, direct query

# edge: identical positions
# large k at boundary

# transformation flips order only via shift, not sorting
```## 边缘情况

 关键的边缘情况是变换后的 Y 值恰好落在 X 值上。 在这种情况下，必须合并两个贡献而不是覆盖。 基于不等式的计数自然可以处理这个问题，因为两个数组独立地贡献相同的阈值。 

另一个边缘情况是大的负贝塔值，这可能会使 Y 值低于所有 X 值。 二分搜索仍然有效，因为计数函数仅正确返回 X 贡献，直到阈值达到 Y 的移位范围。 

最终的边缘情况是 k 接近元素总数。 二分查找上限必须足够宽； 否则，算法可能会过早收敛。 为值设置较宽的安全范围可确保正确性，无论转换参数如何。
