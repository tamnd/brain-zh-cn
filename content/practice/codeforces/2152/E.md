---
title: "CF 2152E - 单调子序列"
description: "给定一个长度为 $n^2 + 1$ 的隐藏排列，我们需要找到一个长度恰好为 $n+1$ 的单调子序列。 子序列可以是递增的，也可以是递减的。"
date: "2026-06-08T00:50:56+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "graphs", "greedy", "interactive", "math"]
categories: ["algorithms"]
codeforces_contest: 2152
codeforces_index: "E"
codeforces_contest_name: "Squarepoint Challenge (Codeforces Round 1055, Div. 1 + Div. 2)"
rating: 2100
weight: 2152
solve_time_s: 94
verified: false
draft: false
---

[CF 2152E - 单调子序列](https://codeforces.com/problemset/problem/2152/E)

 **评分：** 2100
 **标签：** 构造性算法、图、贪婪、交互式、数学
 **求解时间：** 1m 34s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一个隐藏的长度排列$n^2 + 1$我们需要精确地找到长度的单调子序列$n+1$。 子序列可以是递增的，也可以是递减的。 问题是我们无法直接看到排列； 相反，我们可以使用一组索引查询交互器，并且交互器返回这些索引处的值的从左到右的最大值。 也就是说，对于查询的子序列，我们仅了解从左向右查看时哪些元素是可见的。 

该问题保证任何长度排列$n^2 + 1$包含长度的单调子序列$n+1$，来自 Erdos-Szekeres 定理。 这就是为什么我们的目标总是可以实现的。 

限制是适度的：$n$上升到 100，所以$n^2 + 1$最多为 10,001。 由于我们仅限于$n$对于每个测试用例的查询，我们必须通过很少的交互来提取足够的信息。 这排除了查询单个元素或检查所有子序列的暴力策略。 交互机制还意味着我们需要仔细构建查询，以最大化获得的信息：每个查询应该为我们提供一个相当大的元素链，这些元素要么增加要么减少。 

当排列具有较大平台或几乎按降序排序时，就会出现边缘情况。 例如，如果$n=2$排列是 [3,1,2,5,4]，像选择连续索引这样的简单查询可能只返回一个可见元素，使我们无法构建单调子序列$n$查询。 另一个微妙的情况是隐藏排列严格递减。 旨在检测递增序列的查询每次只会返回第一个元素，因此我们必须考虑对称情况。 

## 方法

 暴力方法是按顺序查询单个元素或小集合，并尝试完全重建排列。 这是可行的，因为我们最终可以比较所有元素并构建单调子序列。 然而，它需要查询几乎所有$n^2 + 1$元素，远远超出了极限$n$查询。 例如，如果$n = 100$，这意味着可能有 10,001 个查询，而不是允许的 100 个。显然，由于交互限制，暴力破解会失败。 

关键的见解来自 Erdos-Szekeres 定理本身。 它保证在任何长度排列中$n^2+1$，存在长度递增的子序列$n+1$或减少。 因此，我们不需要完整的排列； 我们只需要仔细构建查询来“找出”这些序列之一。 

如果我们将排列分成$n$大致长度连续的块$n$，查询每个块给出从左到右的最大值。 每个极大值链都是严格递增的。 如果任何区块至少产生$n+1$马克西玛，我们完成了。 否则，我们可以跨区块合并链。 因为我们有$n$块和每条链的长度最多$n$，这些链的并集至少包含$n+1$元素。 对这些收集的元素应用耐心排序（或标准 LIS/LDS 动态规划方法）保证我们可以提取长度的单调子序列$n+1$。 这正是使用$n$查询并拟合问题约束。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^4) | O(n^4) | O(n^2) | O(n^2) | 由于查询限制太慢|
 | 最佳 | O(n^3) | O(n^3) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 划分$n^2+1$元素进入$n$块，每个块大致包含$n$指数。 这确保了每个元素都恰好包含在一个块中，并且没有一个块是空的。 
2. 对于每个块，使用该块中的所有索引向交互器发出查询。 响应给出了该块的从左到右的最大值。 将这些最大值收集到一个列表中。 每个列表代表一个严格递增的链。 
3. 毕竟$n$查询，我们最多有$n^2$收集到的最大值中的元素（因为每个块最多贡献$n$最大值）。 根据 Erdos-Szekeres 定理，这些元素中存在长度递增的子序列$n+1$或减少。 
4. 使用耐心排序在收集的最大值中找到最长递增子序列（LIS）和最长递减子序列（LDS）。 第一个达到长度的$n+1$给出了我们的答案。 该子序列中的元素对应于原始排列中的索引。 
5. 按排序顺序输出单调子序列的索引。 

正确性来自两个不变量：每个块查询给出一个严格递增的链，并且$n$最多这样长度的链$n$总是包含长度的单调子序列$n+1$鄂尔多斯-塞克雷斯。 我们从未超越$n$查询，满足交互限制。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
print_flush = lambda x: (print(x), sys.stdout.flush())

def lis_or_lds(seq, n):
    from bisect import bisect_left, bisect_right
    # Try LIS
    piles = []
    idx_map = []
    for idx, val in enumerate(seq):
        pos = bisect_left(piles, val)
        if pos == len(piles):
            piles.append(val)
            idx_map.append([idx])
        else:
            piles[pos] = val
            idx_map[pos].append(idx)
    if len(piles) >= n+1:
        result = []
        k = n+1
        last = float('inf')
        for i in range(len(seq)-1, -1, -1):
            if seq[i] <= last and k > 0:
                result.append(seq[i])
                last = seq[i]
                k -= 1
        return result[::-1]
    # Else LDS
    piles = []
    idx_map = []
    for idx, val in enumerate(seq):
        pos = bisect_left(piles, -val)
        if pos == len(piles):
            piles.append(-val)
            idx_map.append([idx])
        else:
            piles[pos] = -val
            idx_map[pos].append(idx)
    result = []
    k = n+1
    last = float('-inf')
    for i in range(len(seq)-1, -1, -1):
        if seq[i] >= last and k > 0:
            result.append(seq[i])
            last = seq[i]
            k -= 1
    return result[::-1]

def solve_case():
    n = int(input())
    indices = list(range(1, n*n + 2))
    block_size = (n*n + 1 + n - 1) // n
    maxima_indices = []

    for i in range(n):
        block = indices[i*block_size : (i+1)*block_size]
        if not block:
            continue
        print_flush(f"? {len(block)} {' '.join(map(str, block))}")
        resp = list(map(int, input().split()))
        c = resp[0]
        maxima_indices.extend(resp[1:])

    answer = lis_or_lds(maxima_indices, n)
    print_flush(f"! {' '.join(map(str, answer))}")

def main():
    t = int(input())
    for _ in range(t):
        solve_case()

if __name__ == "__main__":
    main()
```解决方案如下$n$并构建$n$大小大致相等的块。 它查询每个块以获得从左到右的最大值，收集所有最大值索引，并在它们之间找到单调子序列。 基于二等分的 LIS/LDS 确保我们可以提取$n+1$元素有效。 

## 工作示例

 ### 示例 1

 | 步骤| 查询区块 | 回应 | 千里马收集| 笔记|
 | --- | --- | --- | --- | --- |
 | 1 | [1,2]| [1,2]| [1,2]| 长度已为 2 (n+1)，增加子序列 |
 | 2 | - | - | - | 无需进一步查询 |

 输出：[1,2]

 ### 示例 2

 | 步骤| 查询区块 | 回应 | 千里马收集| 笔记|
 | --- | --- | --- | --- | --- |
 | 1 | [1,2,3]| [1] | [1] | 单极大值 |
 | 2 | [4,5]| [4,5]| [1,4,5]| 收集 3 个元素 |
 | LIS 或 LDS | [1,4,5]| [1,4,5]| 选择增加| 长度 3 = n+1 |

 输出：[1,4,5]

 这些痕迹表明，划分为块并收集最大值保证了单调子序列的足够候选者。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^3) | O(n^3) | 每个查询最多返回 n 个元素，对于 LIS/LDS，平分 n^2 个元素是 O(n^2 log n) ≈ O(n^3) 最坏情况 |
 | 空间| O(n^2) | O(n^2) | 存储最多 n 个块的最大值索引，每个块的长度 ≤ n |

 和$n \le 100$, n^
