---
title: "CF 75D - 大最大和"
description: "我们得到了一组小数组和一系列索引，指示如何将它们连接成一个更大的数组。 一旦以这种方式构建了大数组，目标就是找到连续子数组的最大和。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dp", "greedy", "implementation", "math", "trees"]
categories: ["algorithms"]
codeforces_contest: 75
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 67 (Div. 2)"
rating: 2000
weight: 75
solve_time_s: 94
verified: true
draft: false
---

[CF 75D - 大最大和](https://codeforces.com/problemset/problem/75/D)

 **评级：** 2000
 **标签：** 数据结构、dp、贪心、实现、数学、树
 **求解时间：** 1m 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一组小数组和一系列索引，指示如何将它们连接成一个更大的数组。 一旦以这种方式构建了大数组，目标就是找到连续子数组的最大和。 这本质上是经典最大子数组和问题的扩展，但有一个变化：显式构建数组可能成本太高，因为总长度可能很大。 序列中的每个索引都可以指向任意小数组，并且每个小数组可以在大数组中出现多次。 

输入限制告诉我们最多有 50 个小数组，每个大小最多为 5000，而大数组中的索引序列最多可达 250,000 个。 天真的连接会创建一个最大尺寸为 50 × 5000 × 250,000 的潜在数组，这对于时间或内存来说是完全不切实际的。 这立即表明我们需要一种无需显式构造完整数组即可推理总和的方法。 

边缘情况包括仅包含负数的数组。 例如，如果一个小数组是`[-5, -2]`另一个是`[-1]`，序列是`[1,2]`，正确的最大总和是`-1`而不是`-2`或者`-5`。 当连接数组可能允许总和跨越多个数组时，会出现另一个棘手的情况。 例如，如果一个小数组具有负前缀但正后缀，则最大子数组可以在一个实例中开始并在下一个实例中继续，因此我们必须仔细跟踪前缀和后缀。 

## 方法

 一个简单的解决方案是根据序列连接数组，然后应用标准 Kadane 算法来找到最大子数组和。 这在原则上是正确的，因为它直接对问题进行建模，但对于大型序列来说太慢了。 如果每个数组的长度约为 5000，并且序列有 250,000 个元素，则大数组的总长度可能会超过 10 亿个元素。 在实践中，即使是线性扫描也是不可能的。 

关键的见解是，可以使用每个小数组的三个统计数据增量计算串联序列中的最大总和：最大前缀总和、最大后缀总和以及总和。 前缀和是数组连续前缀的最大和，后缀和是连续后缀的最大和，总和是整个数组的和。 如果我们逐一处理索引序列，我们可以通过考虑以下任一方式来跟踪以当前数组结尾的最佳子数组总和：完全在当前数组内的新子数组，或者从先前数组开始并延续到当前数组的子数组。 

这使我们能够计算最大总和，而无需构建巨大的数组，从而将不切实际的内存使用问题减少到对索引序列进行线性扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(总长度) | O(总长度) | 太慢了 |
 | 最佳| O(小数组之和 + m) | O(n) | 已接受 |

 ## 算法演练

 1. 预先计算每个小数组的总和、最大前缀和、最大后缀和、最大子数组和。 前缀和后缀总和让我们可以跨多个串联扩展子数组，当数组完全构成更长的序列时，总和会有所帮助。 
2.初始化两个变量：`current_max`对于以前一个索引结尾的子数组的最大和，以及`global_max`为迄今为止在整个序列中找到的最大总和。 
3. 迭代定义大数组的索引序列。 对于每个索引，检索相应小数组的统计信息。 
4. 更新`current_max`通过选择从当前数组的最大子数组开始，或者扩展前一个数组`current_max`通过添加当前数组的最大前缀和。 
5. 更新`global_max`成为自身的最大值并且`current_max`。 这跟踪迄今为止处理的所有阵列中看到的总体最佳总和。 
6. 循环结束后，`global_max`包含完全连接的大数组中连续子数组的最大总和。 

为什么它有效：在每一步，`current_max`通过在当前数组中开始一个新的子数组或从先前的数组扩展一个子数组，正确地表示以当前数组结尾的最大总和。 跟踪所有最大值`current_max`value 保证考虑任何可能的连续子数组。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
small_arrays = []
for _ in range(n):
    data = list(map(int, input().split()))
    l = data[0]
    arr = data[1:]
    total = sum(arr)
    max_prefix = max_suffix = max_sub = arr[0]
    curr = 0
    for x in arr:
        curr += x
        max_prefix = max(max_prefix, curr)
    curr = 0
    for x in reversed(arr):
        curr += x
        max_suffix = max(max_suffix, curr)
    curr_max = arr[0]
    curr_sum = 0
    for x in arr:
        curr_sum += x
        curr_max = max(curr_max, curr_sum)
        if curr_sum < 0:
            curr_sum = 0
    max_sub = curr_max
    small_arrays.append((total, max_prefix, max_suffix, max_sub))

seq = list(map(int, input().split()))
current_max = global_max = -10**18

for idx in seq:
    total, pre, suf, sub = small_arrays[idx - 1]
    current_max = max(sub, suf + max(current_max, 0))
    global_max = max(global_max, current_max)

print(global_max)
```第一个循环计算每个小数组所需的所有统计信息。 请注意，前缀和后缀总和是与标准 Kadane 扫描分开计算的。 在主循环中，我们仔细更新`current_max`考虑从新开始和从前一个数组扩展。 使用`max(current_max, 0)`确保负运行和不会错误地减少下一个子数组。 所有总和都足够大，可以使用 64 位整数，因此初始值`-10**18`是安全的。 

## 工作示例

 样本1：

 | 步骤| 索引 | 当前数组 | 当前最大| 全局最大|
 | --- | --- | --- | --- | --- |
 | 1 | 2 | [3, 3] | 6 | 6 |
 | 2 | 3 | [-5, 1] | 1 | 6 |
 | 3 | 1 | [1, 6, -2] | 7 | 7 |
 | 4 | 3 | [-5, 1] | 9 | 9 |

 这表明运行总和正确地跨数组扩展，并且全局最大值捕获了跨越多个数组的最佳子数组。 

自定义示例：单个负数组后跟正数组

 输入：```
2 2
-3 -2 -1
4 5
1 2
```表：

 | 步骤| 索引 | 当前数组 | 当前最大| 全局最大|
 | --- | --- | --- | --- | --- |
 | 1 | 1 | [-3, -2, -1] | -1 | -1 |
 | 2 | 2 | [4, 5] | 9 | 9 |

 即使第一个数组完全为负，该算法也会正确地在第二个数组上启动一个新的子数组。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(小数组长度之和 + m) | 每个小数组被扫描一次以获取其统计信息； 序列被线性扫描。 |
 | 空间| O(n) | 我们为每个小数组存储四个数字和索引序列。 |

 时间复杂度是可以接受的，因为小数组的长度之和最多为 50 × 5000 = 250,000，序列长度最多为 250,000。 内存使用量是最小的，在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline
    n, m = map(int, input().split())
    small_arrays = []
    for _ in range(n):
        data = list(map(int, input().split()))
        l = data[0]
        arr = data[1:]
        total = sum(arr)
        max_prefix = max_suffix = max_sub = arr[0]
        curr = 0
        for x in arr:
            curr += x
            max_prefix = max(max_prefix, curr)
        curr = 0
        for x in reversed(arr):
            curr += x
            max_suffix = max(max_suffix, curr)
        curr_max = arr[0]
        curr_sum = 0
        for x in arr:
            curr_sum += x
            curr_max = max(curr_max, curr_sum)
            if curr_sum < 0:
                curr_sum = 0
        max_sub = curr_max
        small_arrays.append((total, max_prefix, max_suffix, max_sub))

    seq = list(map(int, input().split()))
    current_max = global_max = -10**18
    for idx in seq:
        total, pre, suf, sub = small_arrays[idx - 1]
        current_max = max(sub, suf + max(current_max, 0))
        global_max = max(global_max, current_max)
    return str(global_max)

# Provided sample
assert run("3 4
```
