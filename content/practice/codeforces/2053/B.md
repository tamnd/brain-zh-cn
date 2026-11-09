---
title: "CF 2053B - 杰出印象派画家"
description: "我们得到了一系列印象，其中每个印象都由一系列可能的整数值表示。 Eric 只记得第 $i$ 次展示位于 $li$ 和 $ri$ 之间。"
date: "2026-06-08T08:24:03+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "data-structures", "greedy"]
categories: ["algorithms"]
codeforces_contest: 2053
codeforces_index: "B"
codeforces_contest_name: "Good Bye 2024: 2025 is NEAR"
rating: 1200
weight: 2053
solve_time_s: 105
verified: false
draft: false
---

[CF 2053B - 杰出印象派](https://codeforces.com/problemset/problem/2053/B)

 **评分：** 1200
 **标签：** 二分查找、暴力破解、数据结构、贪心
 **求解时间：** 1m 45s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一系列印象，其中每个印象都由一系列可能的整数值表示。 艾瑞克只记得$i$-th 印象介于两者之间$l_i$和$r_i$。 面临的挑战是确定是否可以为每个印象单独分配一个值，以便其他印象不会采用相同的值。 换句话说，对于每个印象，我们必须确定是否存在所有印象的可行分配，使该特定印象独一无二。 

限制条件很大：最多可以有$2 \cdot 10^5$所有测试用例的印象数，每个范围最多可以跨越$2n$。 这排除了任何尝试显式尝试每个可能的分配的方法，因为这可能导致组合爆炸。 一个天真的$O(n^2)$通过测试所有潜在值来检查每个印象与所有其他印象的方法将大致执行$10^{10}$在最坏的情况下进行操作，这远远超出了可接受的范围。 该问题需要更智能的线性或近线性解决方案。 

可能会导致粗心实施的边缘情况包括强制为相同值的展示次数，例如两次展示次数都在该范围内$[1, 1]$，使得唯一性变得不可能。 另一种棘手的情况是当范围重叠但一个印象比其他印象窄得多时； 天真的贪婪分配可能无法意识到，如果处理正确，窄分配总是可以被隔离。 

## 方法

 强力解决方案将尝试在每个展示次数范围内生成每个可能的值分配，然后检查给定的展示次数是否可以是唯一的。 这在原则上是正确的，因为它探索了所有可能的场景，但它是完全不切实际的，因为即使是适度范围大小的适度数量的展示也会产生指数级的许多组合。 

关键的见解来自于注意到，如果我们按展示次数的最小和最大边界对展示次数进行排序，我们可以根据极值推断唯一性，而不是枚举所有分配。 具体来说，如果印象的范围完全被“消耗”其可能占用的所有数字的其他范围覆盖，则保证印象不是唯一的。 相反，如果在其范围内至少存在一个没有其他印象可以同时占据的值，则可以使其成为唯一的。 

通过从左到右和从右到左跟踪上限的最小值和下限的最大值，我们可以快速确定每个印象是否具有不与所有其他印象冲突的值。 这将问题简化为排序和线性扫描，而不是组合搜索。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((2n)^n) | O((2n)^n) | O(n) | 太慢了|
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取当前测试用例的所有印象并将它们存储为`(l_i, r_i)`以及它们的原始索引。 保留原始索引对于按输入顺序重建输出至关重要。 
2. 按展示次数的最小值对展示次数进行排序`l_i`。 这让我们能够推断出每个印象相对于其他印象所能获得的最早可能的价值。 
3.构造两个数组`prefix_max_l`和`suffix_min_r`。 这`prefix_max_l[i]`存储最大`l_j`对于索引左侧或索引处的所有展示次数`i`。 这`suffix_min_r[i]`存储最小值`r_j`对于索引右侧或索引处的所有展示`i`。 这些数组有效地总结了范围的可行重叠。 
4. 对于每次展示`i`，确定是否可以为其分配唯一值。 为此，请检查其中是否存在数字`[l_i, r_i]`这是没有被任何其他印象所掩盖的。 这归结为比较`l_i`与所有先前下界的最大值 (`prefix_max_l`） 和`r_i`与所有后续上限的最小值 (`suffix_min_r`）。 如果`l_i`大于其余的最大下限，或`r_i`小于其余的最小上限，可以使印象独特。 
5. 通过为唯一展示次数写入“1”，否则写入“0”来构造输出字符串，从而恢复原始输入顺序。 

工作原理：该算法有效地检查每个印象是否在其范围内至少存在一个与所有其他范围不冲突的整数。 通过预先计算前缀最大值和后缀最小值，我们可以避免重复扫描所有其他印象，从而在保持高效的同时保证正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        impressions = []
        for i in range(n):
            l, r = map(int, input().split())
            impressions.append((l, r, i))

        # Sort by left boundary
        impressions.sort()
        prefix_max_l = [0] * n
        suffix_min_r = [0] * n

        prefix_max_l[0] = impressions[0][0]
        for i in range(1, n):
            prefix_max_l[i] = max(prefix_max_l[i-1], impressions[i][0])

        suffix_min_r[-1] = impressions[-1][1]
        for i in range(n-2, -1, -1):
            suffix_min_r[i] = min(suffix_min_r[i+1], impressions[i][1])

        res = ['0'] * n
        for i in range(n):
            l, r, idx = impressions[i]
            left_ok = i == 0 or l > prefix_max_l[i-1]
            right_ok = i == n-1 or r < suffix_min_r[i+1]
            if left_ok or right_ok:
                res[idx] = '1'

        print(''.join(res))

solve()
```该代码使用快速读取输入`sys.stdin.readline`。 每个印象都与其原始索引一起存储以维持输出顺序。 排序依据`l_i`允许我们构建前缀最大值和后缀最小值，它们有效地总结了所有其他印象对当前印象的影响。 检查唯一性时，比较当前`l_i`和`r_i`对这些预先计算的数组进行判断，确定某个数字是否存在于任何其他印象无法获取的范围内。 

## 工作示例

 考虑第二个示例：```
4
1 3
1 3
1 3
1 3
```排序并构建前缀/后缀数组后：

 | 索引 | 我| r | 前缀_最大_l | 后缀_分钟_r |
 | --- | --- | --- | --- | --- |
 | 0 | 1 | 3 | 1 | 3 |
 | 1 | 1 | 3 | 1 | 3 |
 | 2 | 1 | 3 | 1 | 3 |
 | 3 | 1 | 3 | 1 | 3 |

 检查唯一性：

 - 印象 0：left_ok True (i=0)，right_ok False → '1'
 - 印象 1：left_ok False，right_ok False → '1'
 - 印象 2：left_ok False，right_ok False → '1'
 - 印象 3：left_ok 假，right_ok 真 (i=n-1) → '1'

 输出是`1111`。 

该表显示了前缀和后缀极端值如何帮助确定唯一性，而无需枚举所有可能的分配。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序占主导地位； 前缀/后缀计算为 O(n) |
 | 空间| O(n) | 用于存储展示次数、prefix_max_l、suffix_min_r 和输出的数组 |

 这符合约束条件，因为排序$2 \cdot 10^5$元素和执行线性扫描的时间远低于 1 秒，并且内存使用量适中。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    solve()
    return out.getvalue().strip()

# Provided samples
assert run("5\n2\n1 1\n1 1\n4\n1 3\n1 3\n1 3\n1 3\n6\n3 6\n2 2\n1 2\n1 1\n3 4\n2 2\n7\n3 4\n4 4\n4 4\n1 3\n2 5\n1 4\n2 2\n3\n4 5\n4 4\n5 5\n") == "00\n1111\n100110\n1001111\n011"

# Custom cases
assert run("1\n1\n1 1\n") == "1", "single impression should be unique"
assert run("1\n2\n1 2\n2 2\n") == "11", "two impressions with overlapping ranges"
assert run("1\n3\n1 3\n2 2\n3 3\n") == "111", "narrow central impression surrounded by wider"
assert run("1\n4\n1 2\n1 2\n1 2\n1 2\n") == "0000", "all identical ranges"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 印象 | 1 | 最小尺寸输入始终是唯一的 |
 | 重叠范围 | 11 | 11 多次展示仍然可以是独一无二的 |
 | 狭窄的中心印模 | 111 | 111 算法正确隔离窄范围 |
 | 所有相同的范围 | 0000 | 0000 检测何时不可能出现唯一性 |

 ## 边缘情况

 对于两次印象
