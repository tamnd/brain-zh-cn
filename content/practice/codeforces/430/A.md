---
title: "CF 430A - 点和线段（简单）"
description: "我们被要求使用红色和蓝色两种颜色对数轴上的一组点进行着色，以便对于每个给定的线段，该线段内的红色和蓝色点的数量最多相差一个。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "sortings"]
categories: ["algorithms"]
codeforces_contest: 430
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 245 (Div. 2)"
rating: 1600
weight: 430
solve_time_s: 94
verified: false
draft: false
---

[CF 430A - 点和线段（简单）](https://codeforces.com/problemset/problem/430/A)

 **评分：** 1600
 **标签：** 构造性算法，排序
 **求解时间：** 1m 34s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求使用红色和蓝色两种颜色对数轴上的一组点进行着色，以便对于每个给定的线段，该线段内的红色和蓝色点的数量最多相差一个。 换句话说，每个部分都应该接近平衡，每种颜色的点数要么完全相同，要么一种颜色超过另一种颜色。 输入提供各线段的点和端点的坐标。 输出必须为每个点分配一个颜色，编码为 0 表示红色，1 表示蓝色。 

约束非常小：最多有 100 个点和 100 个线段，坐标范围从 0 到 100。这允许算法具有 n 或 m 的二次复杂度，如下所示$100^2 = 10,000$对于 1 秒的时间限制来说，操作是微不足道的。 小坐标范围还表明我们可以利用坐标压缩，甚至在需要时使用按位置索引的数组。 

当两个段以一个点属于多个段的方式重叠时，就会出现微妙的边缘情况。 如果我们在不考虑线段重叠的情况下尝试一种朴素的交替模式，我们可能会造成一种情况，即一个点的颜色选择会导致其中一个重叠线段违反平衡条件。 例如，用点`[1, 2, 3]`和段`[1, 2]`和`[2, 3]`，将所有点着色为红色对于第一段来说似乎很好，但违反了第二段的平衡。 认识到这种模式是构建正确解决方案的关键。 

## 方法

 蛮力方法会考虑点的每一种可能的颜色。 对于n个点，有$2^n$即使对于 n = 20，这也很快变得不可行。根据所有段检查每种颜色很简单，但总操作数呈指数增长，使得对于 n = 100 来说暴力破解是不切实际的。 

关键的观察结果是，如果仅考虑段边界之间的相邻点，则段是独立的。 对于任何线段[l,r]，只要线段内的点沿x轴以交替图案着色，则平衡条件|红-蓝| ≤ 1 自动满足。 这是可行的，因为这些点是不同的并且沿着 OX 轴排序。 线段之外的点具有什么颜色并不重要，因为线段只计算它们包含的点。 按 x 坐标对点进行排序，然后交替着色，可以保证具有连续点的每个线段满足平衡要求。 

这种见解将问题简化为简单的贪婪策略：按 x 坐标对点进行排序并交替分配颜色，从红色开始。 无需显式回溯或处理冲突，因为交替可确保所有可能的段得到平衡。 这种方法在点数上是线性的，加上排序成本。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n * m) | O(2^n * m) | O(n) | 太慢了|
 | 按 Sorted X 交替颜色 | O(n log n + n) | O(n log n + n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取n、m、点和线段端点。 
2. 将每个点与其原始索引配对，因为排序会重新排序它们。 
3. 按 x 坐标对点进行排序。 
4. 初始化一个大小为n的颜色数组。 
5. 沿着排序的点交替指定颜色，从红色 (0) 开始。 例如，第一个点是0，第二个点是1，第三个点是0，依此类推。 
6. 使用保存的索引恢复原始顺序并打印颜色数组。 

工作原理：通过沿 x 轴以交替顺序对点进行着色，任何连续的点子集（形成一个线段）的色差最多为 1。 这满足了所有段问题的平衡条件。 排序确保我们按从左到右的顺序处理点，而交替则确保平衡不变。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
points = list(map(int, input().split()))
segments = [tuple(map(int, input().split())) for _ in range(m)]

# keep original indices
indexed_points = list(enumerate(points))
indexed_points.sort(key=lambda x: x[1])

colors = [0] * n
for i, (idx, _) in enumerate(indexed_points):
    colors[idx] = i % 2

print(' '.join(map(str, colors)))
```该解决方案首先读取输入并保留点的原始索引。 排序可确保我们沿着数轴正确地交替颜色。 分配`i % 2`保证交替，最后，打印尊重原始点顺序。 按 x 坐标排序至关重要，因为线段可能包含任意连续的点，并且只有连续的着色才能保持平衡。 

## 工作示例

 **样本1**：

 输入点：`[3, 7, 14]`细分：`[1,5], [6,10], [11,15]`| 排序索引 | 原创 idx | 点| 指定颜色 |
 | --- | --- | --- | --- |
 | 0 | 0 | 3 | 0 |
 | 1 | 1 | 7 | 1 |
 | 2 | 2 | 14 | 14 0 |

 段 [1,5] 包含`[3]`→ 1 红色，0 蓝色 → 差值 = 1

 段 [6,10] 包含`[7]`→ 1 蓝色，0 红色 → 差值 = 1

 段 [11,15] 包含`[14]`→ 1 红色，0 蓝色 → 差值 = 1

 所有段均满足要求。 

**定制样品2**：

 要点：`[2, 4, 5, 8]`细分：`[2,5], [4,8]`| 排序索引 | 原创 idx | 点| 指定颜色 |
 | --- | --- | --- | --- |
 | 0 | 0 | 2 | 0 |
 | 1 | 1 | 4 | 1 |
 | 2 | 2 | 5 | 0 |
 | 3 | 3 | 8 | 1 |

 段 [2,5] 包含`[2,4,5]`→ 颜色`[0,1,0]`→ 红色=2，蓝色=1 → 差值=1

 段 [4,8] 包含`[4,5,8]`→ 颜色`[1,0,1]`→ 红色=1，蓝色=2 → 差异=1

 交替模式保留了重叠片段之间的不变性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n + m) | O(n log n + m) | 对点进行排序是 O(n log n)，分段处理是隐式的 |
 | 空间| O(n + m) | 存储颜色和索引点以及段 |

 该解决方案很容易满足限制：100 个点和 100 个段产生微不足道的计算时间和内存使用。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, m = map(int, input().split())
    points = list(map(int, input().split()))
    segments = [tuple(map(int, input().split())) for _ in range(m)]
    indexed_points = list(enumerate(points))
    indexed_points.sort(key=lambda x: x[1])
    colors = [0] * n
    for i, (idx, _) in enumerate(indexed_points):
        colors[idx] = i % 2
    return ' '.join(map(str, colors))

# Provided sample
assert run("3 3\n3 7 14\n1 5\n6 10\n11 15\n") in ["0 1 0", "0 0 0", "1 0 1"], "sample 1"

# Minimum input
assert run("1 1\n0\n0 0\n") == "0", "single point"

# Maximum input with alternating pattern
assert run("4 2\n1 2 3 4\n1 2\n3 4\n") in ["0 1 0 1", "1 0 1 0"], "overlapping segments"

# All points at same value (edge case)
assert run("3 1\n5 5 5\n5 5\n") in ["0 1 0", "1 0 1"], "single-point segment repeated"

# Non-overlapping segments
assert run("5 2\n1 3 5 7 9\n0 2\n6 8\n") in ["0 1 0 1 0", "1 0 1 0 1"], "non-overlapping segments"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1\n0\n0 0`|`0`| 单点案例|
 |`4 2\n1 2 3 4\n1 2\n3 4`|`0 1 0 1`| 跨多个段的交替模式 |
 |`3 1\n5 5 5\n5 5`|`0 1 0`| 与单点线段处于同一坐标的点 |
 |`5 2\n1 3 5 7 9\n0 2\n6 8`|`0 1 0 1 0`| 不重叠的段|

 ## 边缘情况

 当点与线段边界重合或线段重叠时，交替策略仍然保证任何线段将包含相同数量的红点和蓝点，或者包含不同数量的红点和蓝点。
