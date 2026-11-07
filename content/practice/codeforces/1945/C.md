---
title: "CF 1945C - 左宫和右宫"
description: "我们有一个村庄，有 n 栋房子排成一排。 每个居民都有自己想要居住在街道哪一侧的偏好：左 (0) 或右 (1)。"
date: "2026-05-31T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force"]
categories: ["algorithms"]
codeforces_contest: 1945
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 935 (Div. 3)"
rating: 1200
weight: 1945
solve_time_s: 48
verified: true
draft: false
---

[CF 1945C - 左右宫](https://codeforces.com/problemset/problem/1945/C)

 **评分：** 1200
 **标签：** 暴力破解
 **求解时间：** 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个村庄`n`房屋排成一排。 每个居民都有自己想要居住在街道哪一侧的偏好：左（`0`）或右（`1`）。 村庄规划者希望在房屋之间修建一条道路，以便两边至少有一半的居民感到满意。 如果获得自己喜欢的一方的居民数量至少是该方房屋数量一半的上限，则一方满意。 

实际上，这个问题要求我们找到一个分区索引`i`（路在房子后面`i`）这样左边的长度段`i`至少有`ceil(i/2)`零和右边的长度段`n-i`至少有`ceil((n-i)/2)`那些。 其中有效的`i`，我们应该选择最靠近村庄中间的一个，即最小化`abs(n/2 - i)`，关系被较小的打破`i`。 

这些约束允许所有测试用例中最多包含 300,000 栋房屋和最多 20,000 个测试用例。 在最坏的情况下，通过完整扫描左右段来检查每个分割的简单解决方案将是每个测试用例的 O(n^2)，这太慢了。 我们需要每个测试用例有一个 O(n) 或更好的解决方案。 边缘情况包括所有偏好同一侧的房屋、边界处的道路（第一栋房屋之前或最后一栋房屋之后）或影响一半路段天花板的奇数和偶数大小的路段。 

## 方法

 蛮力方法会考虑每个可能的分裂`i`从 0 到`n`并计算左段中的 0 和右段中的 1 的数量。 如果计数满足上限条件，我们认为它是有效的。 这种方法在逻辑上可行，但对于大字符串需要 O(n^2) 操作，因为每次分割都需要扫描数组的一部分，这对于`n`最多 3·10^5。 

关键的见解是我们可以预先计算前缀和。 让`prefix_zeros[j]`是第一个零的数量`j`房屋。 然后是左边长度段中零的个数`i`是`prefix_zeros[i]`。 右侧长度段中的个数`n-i`可以导出为`(total_ones - prefix_ones[i])`或同等地`((n - prefix_zeros[n]) - (i - prefix_zeros[i]))`，但更简单的是计算 1 的前缀和。 有了这些前缀和，检查每个分割的时间复杂度就变成了 O(1)，而且我们只需要一次遍历数组即可找到最佳分割。 

满足条件仅取决于 0 和 1 的计数这一观察结果使我们能够使用前缀和将上限不等式转换为简单的数字比较。 这将潜在的二次暴力减少为线性时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^2) | O(n^2) | O(1) | O(1) | 太慢了 |
 | 前缀和/线性扫描 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，请阅读`n`和字符串`a`。 转变`a`到一个整数列表中以便于算术。 
2. 计算零的前缀和，`prefix_zeros`， 在哪里`prefix_zeros[i]`是第一个零的数量`i`房屋。 
3. 计算 1 的总数，`total_ones`，通过计算整个数组中的个数或从中减去零`n`。 
4.初始化变量以跟踪最佳索引`best_i`和到中心的最小距离`min_dist = n`。 我们会尽力减少`abs(n/2 - i)`。 
5. 迭代所有可能的分割索引`i`从 0 到`n`。 对于每个分割，左段的长度`i`，右段长度`n-i`。 
6. 计算左边零的数量：`left_zeros = prefix_zeros[i]`。 计算右边的个数：`right_ones = total_ones - (i - left_zeros)`。 
7. 检查是否`left_zeros >= ceil(i/2)`和`right_ones >= ceil((n-i)/2)`。 使用整数算术计算上限：`ceil(x/2) = (x+1)//2`。 
8. 如果两个条件都成立，则计算`dist = abs(n/2 - i)`。 如果`dist < min_dist`或者`dist == min_dist`和`i < best_i`， 更新`best_i`和`min_dist`。 
9.循环结束后，输出`best_i`。 

为什么有效：前缀和让我们立即知道任何左段中有多少个零以及任何右段中有多少个0。 上限条件通过整数运算得到正确处理。 通过扫描全部`i`从 0 到`n`and tracking the closest to the middle, we ensure the solution satisfies both the fairness condition and the minimal distance requirement.

 ## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = input().strip()
        arr = [int(ch) for ch in a]

        prefix_zeros = [0]*(n+1)
        for i in range(n):
            prefix_zeros[i+1] = prefix_zeros[i] + (1 if arr[i] == 0 else 0)
        total_ones = n - prefix_zeros[n]

        best_i = 0
        min_dist = n
        for i in range(n+1):
            left_len = i
            right_len = n - i
            left_zeros = prefix_zeros[i]
            right_ones = total_ones - (right_len - (total_ones - (prefix_zeros[n] - prefix_zeros[i])))
            right_ones = total_ones - (i - left_zeros)

            if left_zeros >= (left_len + 1)//2 and right_ones >= (right_len + 1)//2:
                dist = abs(n/2 - i)
                if dist < min_dist or (dist == min_dist and i < best_i):
                    best_i = i
                    min_dist = dist
        print(best_i)

if __name__ == "__main__":
    solve()
```在此实现中，我们计算零的前缀和。 右侧段的个数是通过从总数中减去左侧的个数来计算的。 这`(length + 1)//2`技巧正确地处理了天花板划分。 从 0 迭代到`n`确保我们考虑道路的所有可能位置，包括第一栋房子之前和最后一栋房子之后。 如果两个位置同样接近中心，平局逻辑确保我们选择较小的指数。 

## 工作示例

 ### 示例 1：

 输入字符串`101`和`n=3`。 

| 我| 左长度 | 右长度 | 左零 | 对的人 | ceil(left_len/2) | ceil(left_len/2) | ceil(right_len/2) | ceil(right_len/2) | 有效的？ |
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 0 | 0 | 3 | 0 | 2 | 0 | 2 | 是的 |
 | 1 | 1 | 2 | 0 | 2 | 1 | 1 | 没有 |
 | 2 | 2 | 1 | 1 | 1 | 1 | 1 | 是的 |
 | 3 | 3 | 0 | 1 | 0 | 2 | 0 | 没有 |

 距离中心最近的`n/2 = 1.5`是`i=2`。 输出`2`。 

### 示例 2：

 输入字符串`010111`和`n=6`。 

| 我| 左长度 | 右长度 | 左零 | 对的人 | ceil(left_len/2) | ceil(left_len/2) | ceil(right_len/2) | ceil(right_len/2) | 有效的？ |
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 0 | 0 | 6 | 0 | 4 | 0 | 3 | 是的 |
 | 1 | 1 | 5 | 1 | 4 | 1 | 3 | 是的 |
 | 2 | 2 | 4 | 1 | 3 | 1 | 2 | 是的 |
 | 3 | 3 | 3 | 2 | 2 | 2 | 2 | 是的 |
 | 4 | 4 | 2 | 2 | 2 | 2 | 1 | 是的 |
 | 5 | 5 | 1 | 2 | 1 | 3 | 1 | 没有 |
 | 6 | 6 | 0 | 3 | 0 | 3 | 0 | 是的 |

 最接近中间`3`是索引`3`，但决胜局更喜欢较小的指数`3`。 输出`3`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n) | 前缀和计算是 O(n)，扫描分割是 O(n) |
 | 空间| 每个测试用例 O(n) | 长度为 n+1 的前缀和数组 |

 该算法与每个测试用例的房屋数量呈线性关系。 总和为`n`在所有 ≤ 3·10^5 的测试用例中，这很容易满足 2 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin
```
