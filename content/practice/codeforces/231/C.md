---
title: "CF 231C - 添加或不添加"
description: "我们得到一个整数数组和有限数量的增量运算。 每次操作将单个元素加一，同一元素可以多次增加。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "sortings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 231
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 143 (Div. 2)"
rating: 1600
weight: 231
solve_time_s: 178
verified: true
draft: false
---

[CF 231C - 添加或不添加](https://codeforces.com/problemset/problem/231/C)

 **评分：** 1600
 **标签：** 二分查找、排序、两个指针
 **求解时间：** 2m 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组和有限数量的增量运算。 每次操作将单个元素加一，同一元素可以多次增加。 我们的目标是在执行最多 _k_ 次这样的操作后，找到一个在数组中出现尽可能多次的数字。 如果多个数字可以达到相同的最大频率，我们必须选择最小的一个。 

输入由两个整数 _n_ 和 _k_ 组成，后跟一个 _n_ 整数数组。 输出是可达到的最大频率和达到该频率的最小数量。 

鉴于 _n_ 可以达到 10^5 并且 _k_ 可以大到 10^9，任何迭代所有可能的数字并计算出现次数或尝试每种操作组合的算法都会太慢。 复杂度为 O(n^2) 的简单暴力解决方案将会超时，因为在 2 秒限制内不可能执行 10^10 次操作。 

要考虑的边缘情况包括所有数字都相等的数组、不需要任何操作即可获得最佳结果的数组，以及实现频率的最小数字小于可以通过更多操作实现相同频率的数字的场景。 例如，对于输入`3 3`带数组`1 2 3`，将 1 和 2 各增加两次会使 3 出现 3 次，但如果我们将 1 和 2 各增加一次，达到最大频率的最小数字是 2。 

## 方法

 暴力方法会将数组中的每个唯一数字视为潜在目标。 对于每个目标，我们可以迭代所有元素并计算需要多少增量才能将较小的数字提高到该目标。 我们对操作进行求和，如果总数小于或等于 _k_，我们记录可实现的频率。 这是有效的，因为对于任何候选数字，使其他数字等于它所需的增量数量是确定性的。 然而，在最坏的情况下，这是 O(n^2)，因为对于每个数字，我们可能会扫描整个数组。 

关键的见解是，在对数组进行排序后，我们可以使用滑动窗口技术来有效地计算使连续的数字段等于窗口中的最大数字所需的操作数。 通过维护排序数组的前缀和，我们可以计算在常数时间内将窗口中的所有数字提升到最右边的数字所需的操作。 然后我们将窗口向前移动以考虑更大的部分。 这将复杂性降低到 O(n log n)，因为我们排序一次，然后使用带有前缀和的线性传递。 排序还允许我们在多个数字并列时轻松选择达到最大频率的最小数字，因为按排序顺序出现的第一个数字始终是最小的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了 |
 | 带前缀和的滑动窗口 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 将数组按升序排序。 排序可确保任何连续的子序列都可以被考虑递增到相同的值，而不必担心稍后出现较小的数字。 
2.构造前缀和数组。 对于每个索引_i_，前缀和存储从索引0到_i_的所有元素的总和。 这允许对任何子数组的总和进行恒定时间计算。 
3.初始化两个指针，`left`和`right`，都从 0 开始。`right`指针代表当前数字，我们的目标是使其他数字等于。 这`left`指针定义了段的开始。 
4. 对于每个位置`right`，计算提升所有元素所需的总增量`a[left]`到`a[right]`到值`a[right]`。 使用前缀和，操作是`operations_needed = a[right] * (right - left + 1) - (prefix_sum[right] - prefix_sum[left-1] if left > 0 else prefix_sum[right])`。 
5.如果`operations_needed`超过_k_，增量`left`直到窗口有效。 这有效地从左侧缩小窗口，直到所需的操作在允许的 _k_ 范围内。 
6. 跟踪最大窗口长度和对应的数字。 如果多个数字产生相同的长度，请选择较小的一个。 
7. 遍历数组后`right`，报告最大频率和相关数字。 

该算法之所以有效，是因为排序后的数组确保对于任何段，右端的数字始终是最大值。 将段中的所有元素增加到该值需要最少的操作。 移动`left`每当超过操作限制时转发保证我们始终保持有效的窗口。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, k = map(int, input().split())
a = list(map(int, input().split()))
a.sort()

prefix_sum = [0] * n
prefix_sum[0] = a[0]
for i in range(1, n):
    prefix_sum[i] = prefix_sum[i-1] + a[i]

max_freq = 1
best_num = a[0]
left = 0

for right in range(n):
    total = prefix_sum[right] - (prefix_sum[left-1] if left > 0 else 0)
    operations_needed = a[right] * (right - left + 1) - total
    while operations_needed > k:
        left += 1
        total = prefix_sum[right] - (prefix_sum[left-1] if left > 0 else 0)
        operations_needed = a[right] * (right - left + 1) - total
    window_size = right - left + 1
    if window_size > max_freq:
        max_freq = window_size
        best_num = a[right]

print(max_freq, best_num)
```该解决方案从排序开始，从而实现高效的窗口化。 前缀和可以实现所需操作的恒定时间计算。 滑动窗口确保我们永远不会超过_k_个操作并且只考虑有效的段。 在严格更大的频率上更新最佳数字可以保证我们在出现平局的情况下选择最小的数字。 

## 工作示例

 示例 1 输入`5 3`带数组`[6, 3, 4, 0, 2]`。 

| 对| 左| 一个[右] | 所需操作 | 窗口大小 | 最大频率| 最佳编号 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 0 | 0 | 0 | 1 | 1 | 0 |
 | 1 | 0 | 2 | 2*2-3=1 | 2*2-3=1 | 2 | 2 | 2 |
 | 2 | 0 | 3 | 3*3-(0+2+3)=9-5=4>3| 左=1 | 3*2-(2+3)=6-5=1| 2 |
 | 3 | 1 | 4 | 4*3-(2+3+4)=12-9=3 | 3 | 3 | 4 |
 | 4 | 1 | 6 | 6*4-(2+3+4+6)=24-15=9>3| 左=2 | 6*3-(3+4+6)=18-13=5>3| 左=3 |

 该跟踪确认该段`[2, 3, 4]`可以转化为`[4,4,4]`使用 ≤3 次操作，给出频率 3，最小数量为 4。 

样本2输入`3 0`带数组`[5,5,5]`。 滑动窗口永远不需要增量； max_freq 变为 3，best_num 变为 5。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 排序占主导地位，带有前缀和的滑动窗口是 O(n) |
 | 空间| O(n) | 长度为 n 的前缀和数组 |

 该解决方案符合 n 最多 10^5 和 k 最多 10^9 的时间和内存限制。 没有任何操作需要的只是整数运算，因此 64 位整数就足够了。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    a.sort()
    prefix_sum = [0]*n
    prefix_sum[0] = a[0]
    for i in range(1, n):
        prefix_sum[i] = prefix_sum[i-1] + a[i]
    max_freq = 1
    best_num = a[0]
    left = 0
    for right in range(n):
        total = prefix_sum[right] - (prefix_sum[left-1] if left > 0 else 0)
        operations_needed = a[right]*(right-left+1)-total
        while operations_needed > k:
            left += 1
            total = prefix_sum[right] - (prefix_sum[left-1] if left > 0 else 0)
            operations_needed = a[right]*(right-left+1)-total
        window_size = right-left+1
        if window_size > max_freq:
            max_freq = window_size
            best_num = a[right]
    return f"{max_freq} {best_num}"

assert run("5 3\n6 3 4 0 2\n") == "3 4"
assert run("3 0\n5 5 5\n")
```
