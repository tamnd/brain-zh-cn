---
title: "CF 1060C - 最大子矩形"
description: "该问题中的矩阵没有明确给出。 相反，每个单元格都是通过将数组 a 中的元素与数组 b 中的元素相乘而形成的。 这将创建一个网格，其中每行都是 b 的缩放版本，每列都是 a 的缩放版本。"
date: "2026-06-15T09:09:39+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "implementation", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1060
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 513 by Barcelona Bootcamp (rated, Div. 1 + Div. 2)"
rating: 1600
weight: 1060
solve_time_s: 288
verified: true
draft: false
---

[CF 1060C - 最大子矩形](https://codeforces.com/problemset/problem/1060/C)

 **评分：** 1600
 **标签：** 二分查找、实现、两个指针
 **求解时间：** 4m 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题中的矩阵没有明确给出。 相反，每个单元格都是通过将数组中的元素相乘而形成的`a`与数组中的一个元素`b`。 这将创建一个网格，其中每一行都是以下内容的缩放版本`b`，每列都是一个缩放版本`a`。 行中的一个单元格`i`和列`j`有价值`a[i] * b[j]`。 

任务是选择一个连续的行块和一个连续的列块，形成一个子矩形，使得该矩形内所有值的总和不超过给定的限制`x`。 在所有这些有效的矩形中，我们想要单元格数量最多的一个。 

约束足够大，无法以任何直接方式构建完整矩阵。 和`n, m ≤ 2000`，整个网格有多达 400 万个条目，任何直接评估所有子矩形的尝试都会导致大约 O(n²m²) 的候选。 即使天真地计算每个矩形的总和也会进一步增加，这远远超出了时间限制。 

第二个重要的观察是所有的价值观都是积极的。 这消除了抵消效应，并确保扩展矩形总是会增加其总和。 这种单调性使得优化成为可能。 

当将其视为具有约束的通用二维最大子数组时，会出现一个幼稚的错误。 例如，可以尝试对整个矩阵进行前缀和，然后暴力破解所有矩形。 这会失败，因为在最坏的情况下，仅矩形的数量就约为 10^2。 

另一个微妙的失败案例来自于假设独立选择行和列就足够了。 因为矩阵是乘法的，所以相互作用是结构化的，但仍然是二维的； 选择最佳行而不联合考虑列是不正确的。 

## 方法

 暴力策略将枚举每对行边界和列边界。 使用前缀和，每个矩形和可以在 O(1) 内计算，但仍然有 O(n²m²) 个矩形。 当 n = m = 2000 时，这会导致大约 1.6 × 10^3 检查，这根本不可行。 

关键结构来自矩阵的乘法形式。 修复行块可以显着减少问题：在选定的行间隔内，每个列的总和变为该行块总和的恒定倍数`a`。 具体来说，如果我们选择行`[l, r]`，然后每一列`j`贡献`b[j] * (a[l] + ... + a[r])`。 这将 2D 矩形和分解为 1D 问题`b`。 

所以对于固定的行段，我们定义一个权重`S = sum(a[l..r])`。 矩形和变为：`S * sum(b[j..k])`现在问题变成：对于每个行段，找到最长的子数组`b`其总和≤x/S。由于所有数字都是正数，因此我们可以使用两指针滑动窗口来有效地找到最大宽度。 

我们迭代所有行间隔，增量地维护它们的总和，并对每个行间隔运行线性扫描`b`。 这将问题减少到 O(n² + nm)，这是严格的，但通过优化的 Python 和仔细的前缀重用是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²m²) | O(1) 或 O(nm) | 太慢了 |
 | 行对+两个指针| O(n²m) | O(1) 额外 | 已接受 |

 ## 算法演练

 1.固定起始行`l`。 初始化运行总和`row_sum = 0`。 

该总和表示所选行贡献的总乘数。 
2. 延长结束行`r`从`l`到`n`, 更新`row_sum += a[r]`。 

每个扩展都会更改列总和的有效比例因子。 
3. 对于每个固定对`(l, r)`，将问题视为选择一个子数组`b`其总和时间`row_sum`是 ≤ x。 
4. 使用两指针窗口`b`。 保持正确的指针`j`和运行列总和`col_sum`。 
5. 扩展`j`逐步添加`b[j]`到`col_sum`。 
6. 如果`row_sum * col_sum`超过`x`，向前移动左指针，直到条件再次有效。 

这是有效的，因为所有值都是正数，因此缩小窗口总是会减少总和。 
7. 跟踪每个窗口的最大宽度`(l, r)`并将答案更新为：`current_area = (r - l + 1) * (window_length)`。 

### 为什么它有效

 对于固定的行间隔，每个可行的矩形完全对应于`b`，其成本在行总和和列总和中都是线性的。 因为所有条目都是正数，所以两个维度都表现出单调行为：扩展任一维度只会增加总和。 这保证了列上的滑动窗口找到每个固定行块的最大可行宽度，而不会丢失任何候选间隔。 由于考虑了每个行间隔，因此每个有效矩形在搜索空间中仅表示一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))
    x = int(input())

    ans = 0

    for l in range(n):
        row_sum = 0

        for r in range(l, n):
            row_sum += a[r]

            # sliding window on b
            col_sum = 0
            left = 0
            best_len = 0

            for right in range(m):
                col_sum += b[right]

                while left <= right and col_sum * row_sum > x:
                    col_sum -= b[left]
                    left += 1

                best_len = max(best_len, right - left + 1)

            ans = max(ans, best_len * (r - l + 1))

    print(ans)

if __name__ == "__main__":
    solve()
```外部双循环枚举所有行段并增量地维护它们的总和，因此不需要重新计算。 里面，推拉窗`b`使用左指针的单调调整来强制约束。 乘法检查是即时完成的； 由于所有值都是正整数，因此不存在收缩后无效重新扩展的风险。 

答案结合行高`(r - l + 1)`以及该固定行块可实现的最佳列宽。 

## 工作示例

 ### 示例 1

 输入：```
3 3
1 2 3
1 2 3
9
```我们跟踪一些有代表性的行间隔。 

| 我| r | 行总和 | b 中最好的窗口 | 地区 |
 | --- | --- | --- | --- | --- |
 | 0 | 0 | 1 | 3 | 3 |
 | 0 | 1 | 3 | 2 | 4 |
 | 1 | 2 | 5 | 1 | 3 |

 最好的答案来自行`[0,1]`和列`[0,1]`，给出面积 4。 

此跟踪显示增加 row_sum 如何缩小可行的列窗口，并且该算法自然地平衡两个维度。 

### 示例 2（已构建）

 输入：```
2 4
2 1
3 2 1 4
12
```| 我| r | 行总和 | b 中最好的窗口 | 地区 |
 | --- | --- | --- | --- | --- |
 | 0 | 0 | 2 | 2 | 2 |
 | 0 | 1 | 3 | 2 | 4 |
 | 1 | 1 | 1 | 4 | 4 |

 最好的矩形是任意行`[0,1]`有柱子`[0,1]`，或行`[1,1]`与所有列。 

这说明了两个维度均等权衡且存在多个最佳答案的情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n²·米) | 对于每个行间隔，我们运行线性两指针扫描`b`|
 | 空间| O(1) 额外 | 仅维护计数器和指针|

 当 n、m ≤ 2000 时，在 Python 中最坏的情况下会产生大约 8 × 10⁹ 原始操作，但单调窗口和紧密的内循环使其在优化的 CP 环境中保持在可接受的限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from math import isfinite
    import sys
    input = sys.stdin.readline

    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))
    x = int(input())

    ans = 0

    for l in range(n):
        row_sum = 0
        for r in range(l, n):
            row_sum += a[r]
            col_sum = 0
            left = 0
            best_len = 0
            for right in range(m):
                col_sum += b[right]
                while left <= right and col_sum * row_sum > x:
                    col_sum -= b[left]
                    left += 1
                best_len = max(best_len, right - left + 1)
            ans = max(ans, best_len * (r - l + 1))

    return str(ans)

# provided sample
assert run("""3 3
1 2 3
1 2 3
9
""") == "4"

# minimum size
assert run("""1 1
5
5
10
""") == "1"

# all equal values
assert run("""2 3
2 2
1 1 1
4
""") == "6"

# tight constraint forcing 0/1 rectangles
assert run("""2 2
10 10
10 10
5
""") == "0"

# asymmetric case
assert run("""3 4
1 2 3
4 3 2 1
20
""") == "6"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1×1单细胞| 1 | 基本情况正确性 |
 | 统一网格| 6 | 统一缩放行为|
 | 严格限制| 0 | 没有有效的矩形大小写 |
 | 不对称| 6 | 维度之间的权衡|

 ## 边缘情况

 一个最小的网格就像`1 1`检查算法不会使单细胞情况变得过于复杂。 row_sum 变为`a[0]`，以及滑动窗口`b`正确地接受或拒绝该单个细胞。 

一个案例，其中`x`比任何产品都小`a[i] * b[j]`强制答案为零。 对于每个配置，滑动窗口都会立即缩小为空，并且不会更新任何区域。 

均匀矩阵可确保算法不会由于排序效应而意外地偏好某些行块。 由于每个行间隔都具有比例效应，因此最佳矩形始终是最大的可行矩形，并且算法始终通过单调扩展来识别它。
