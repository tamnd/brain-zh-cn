---
title: "CF 1648A - 奇怪的总和"
description: "我们得到一个大小为 $n 乘以 m$ 的二维网格，其中每个单元格包含由整数表示的颜色。 任务是计算每对共享相同颜色的单元格之间的曼哈顿距离之和。"
date: "2026-06-10T03:58:43+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "data-structures", "geometry", "math", "matrices", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1648
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 775 (Div. 1, based on Moscow Open Olympiad in Informatics)"
rating: 1400
weight: 1648
solve_time_s: 72
verified: true
draft: false
---

[CF 1648A - 奇怪的总和](https://codeforces.com/problemset/problem/1648/A)

 **评分：** 1400
 **标签：** 组合数学、数据结构、几何、数学、矩阵、排序
 **求解时间：** 1m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一个大小为 2D 的网格$n \times m$其中每个单元格包含由整数表示的颜色。 任务是计算每对共享相同颜色的单元格之间的曼哈顿距离之和。 两个单元格之间的曼哈顿距离$(r_1, c_1)$和$(r_2, c_2)$是$|r_1 - r_2| + |c_1 - c_2|$，它计算从一个单元格移动到另一个单元格所需的垂直和水平步数。 

输入包括$n$行与$m$每个单元均为整数，且单元格总数不超过 100,000。 这意味着我们无法提供直接迭代所有单元对的解决方案，因为这可能会导致粗略的结果$(10^5)^2 / 2 = 5 \cdot 10^9$操作，远远超过了2秒的时间限制。 线性或近线性方法是必要的。 

边缘情况包括所有单元格具有相同颜色的网格、仅具有一行或一列的网格或每个单元格具有不同颜色的网格。 粗心的蛮力方法会尝试盲目地对所有对的距离求和，这对于最大的输入来说太慢了。 

## 方法

 这种简单的方法会迭代每种颜色，收集该颜色的所有位置，并对所有颜色对的曼哈顿距离求和。 如果出现颜色$k$次，这需要$O(k^2)$每种颜色的操作。 在最坏的情况下，如果所有 100,000 个单元格都具有相同的颜色，则此方法需要$O(10^{10})$操作，这是不切实际的。 

关键的见解是曼哈顿距离可分为行贡献和列贡献：$|r_1 - r_2| + |c_1 - c_2| = |r_1 - r_2| + |c_1 - c_2|$。 因此，我们可以独立计算行和列的总和。 如果我们对一种颜色的所有行索引进行排序并计算运行总和，则可以在相对于出现次数的线性时间内计算出行贡献的总距离。 这同样适用于列索引。 具体来说，排序后，对于每个位置$i$，到所有先前位置的总距离是$i \cdot \text{row}_i - \text{sum of previous rows}$。 将所有位置的总和得出总行贡献，对于列也类似。 

这降低了时间复杂度$O(k^2)$每种颜色到$O(k \log k)$用于排序加$O(k)$用于求和计算。 鉴于所有的总和$k$所有颜色最多为 100,000 个，这样效率很高。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((纳米)^2) | O(纳米) | 太慢了 |
 | 最佳 | O(nm log nm) | O(纳米) | 已接受 |

 ## 算法演练

 1. 创建一个字典，将每种颜色映射到两个列表：该颜色所有出现的行索引和列索引。 这将行和列的贡献分开，并按颜色组织位置。 
2. 对于每种颜色，对行索引列表进行排序。 排序是必要的，因为距离总和的公式适用于有序序列。 
3. 初始化行距离的运行总和。 迭代排序的行索引。 对于当前索引$i$， 添加$i \cdot \text{row}_i - \text{sum of previous rows}$至总数。 这可以有效地计算总和$|r_i - r_j|$对于所有以前的$j < i$在线性时间内。 
4. 对列索引重复步骤 2-3，对同一总变量的贡献求和。 
5. 处理完所有颜色后，打印累加和。 这是所有具有相同颜色的单元对之间的曼哈顿距离的总和。 

为什么有效：行和列的分离利用了曼哈顿距离的线性。 排序确保我们可以有效地计算累积差异。 公式$i \cdot x_i - \text{sum of previous}$是从观察得出的$\sum_{j=0}^{i-1} |x_i - x_j| = i \cdot x_i - \sum_{j=0}^{i-1} x_j$对于排序序列，保证每对都被精确计数一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict

def main():
    n, m = map(int, input().split())
    color_positions = defaultdict(lambda: ([], []))  # maps color -> (rows, cols)
    
    for r in range(n):
        row = list(map(int, input().split()))
        for c, color in enumerate(row):
            color_positions[color][0].append(r)
            color_positions[color][1].append(c)
    
    total_sum = 0
    for rows, cols in color_positions.values():
        for indices in (rows, cols):
            indices.sort()
            acc = 0
            running_sum = 0
            for i, val in enumerate(indices):
                acc += i * val - running_sum
                running_sum += val
            total_sum += acc
    
    print(total_sum)

if __name__ == "__main__":
    main()
```该字典分别收集每种颜色的行索引和列索引，从而实现独立的求和计算。 排序可确保公式正确应用。`running_sum`累加每个维度先前索引的总和，从而避免重复重新计算总和。 此方法可以处理所有大小的网格和颜色，而不会超出内存或时间限制。 

## 工作示例

 输入示例 1：```
2 3
1 2 3
3 2 1
```| 颜色 | 行| 科尔斯 | 已排序的行 | 行贡献| 已排序的列 | 上校贡献 | 总贡献|
 | --- | --- | --- | --- | --- | --- | --- | --- |
 | 1 | [0,1]| [0,2]| [0,1]| 1 | [0,2]| 2 | 3 |
 | 2 | [0,1]| [1,1]| [0,1]| 1 | [1,1]| 0 | 1 |
 | 3 | [0,1]| [2,0]| [0,1]| 1 | [0,2]| 2 | 3 |

 总和：3 + 1 + 3 = 7，与预期输出匹配。 

第二个示例使用一种颜色填充网格：```
2 2
5 5
5 5
```| 颜色 | 行| 科尔斯 | 行贡献| 上校贡献 |
 | --- | --- | --- | --- | --- |
 | 5 | [0,0,1,1] | [0,1,0,1] | 4 | 4 |

 所有六对之间的曼哈顿距离：距离总和为 8，与我们的计算相符。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(nm log nm) | 对每种颜色的行和列索引进行排序占主导地位； 总和计算是线性的。 |
 | 空间| O(纳米) | 存储每种颜色的位置需要 O（单元数）。 |

 和$nm \le 10^5$，排序占主导地位，但在 2 秒内就可以轻松完成。 内存使用量仍低于 256 MB 限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    main()
    return output.getvalue().strip()

# Provided sample
assert run("2 3\n1 2 3\n3 2 1\n") == "7", "sample 1"

# Minimum size
assert run("1 1\n1\n") == "0", "single cell"

# All cells same
assert run("2 2\n5 5\n5 5\n") == "8", "all same color"

# Row only
assert run("1 4\n1 2 1 2\n") == "4", "single row"

# Column only
assert run("4 1\n1\n2\n1\n2\n") == "4", "single column"

# Maximum distinct
assert run("2 3\n1 2 3\n4 5 6\n") == "0", "all distinct colors"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1x1 网格 | 0 | 单细胞，无配对 |
 | 2x2 都一样 | 8 | 多对，验证总和计算 |
 | 1x4 混合 | 4 | 水平距离、行贡献|
 | 4x1 混合 | 4 | 垂直距离、柱贡献 |
 | 2x3 全部不同 | 0 | 没有配对，确保总和为零 |

 ## 边缘情况

 对于所有单元格具有相同颜色的网格，例如：```
2 2
5 5
5 5
```行：[0,0,1,1]，列：[0,1,0,1]。 对行和列进行排序，算法计算行贡献：1_0-0=0, 2_0-0=0, 3*
