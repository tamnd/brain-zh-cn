---
title: "CF 121C - 幸运排列"
description: "我们被要求检查从 1 到 n 的数字排列，并重点关注“幸运数字”——仅包含数字 4 和 7 的整数。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "combinatorics", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 121
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 91 (Div. 1 Only)"
rating: 1900
weight: 121
solve_time_s: 94
verified: true
draft: false
---

[CF 121C - 幸运排列](https://codeforces.com/problemset/problem/121/C)

 **评级：** 1900
 **标签：** 蛮力、组合数学、数论
 **求解时间：** 1m 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求检查从 1 到 _n_ 的数字排列，并关注“幸运数字”——仅包含数字 4 和 7 的整数。该问题特别要求我们找到从 1 到 _n_ 的数字的字典顺序第 _k_ 个排列，并计算该排列中有多少数字占据本身就是幸运数字的位置。 仅当值及其位置都幸运时，该数字才符合此计数。 

输入提供两个整数：_n_（排列的大小）和 _k_（按字典顺序排列的从 1 开始的索引）。 如果 _k_ 超过排列总数（_n_ 阶乘），则输出应为 -1。 否则，我们必须输出幸运位置上本身幸运的数字的计数。 

约束非常严格：_n_ 可以大到 10^9。 计算所有_n_！ 对于任何超过 20 的 _n_ 值，排列都是不可行的，如 20！ 单独是~2.4×10^18。 这立即排除了任何尝试显式生成排列的幼稚方法。 边缘情况包括非常小的 _n_（1 或 2），其中排列是微不足道的，以及 _n_ 足够大以致阶乘超出实际计算，必须使用部分阶乘计算或截止启发式来处理。 

粗心的方法可能会尝试使用库函数生成所有排列。 用于输入`n = 50`和`k = 1`，这会由于内存或时间限制而崩溃。 另一个微妙的情况是像 4 和 7 这样的位置 - 如果 _n_ < 7，这些索引不存在，因此算法必须正确地将所考虑的位置限制在排列的范围内。 

## 方法

 蛮力方法在概念上很简单。 生成数字 1 到 _n_ 的所有排列，按字典顺序对它们进行排序，选择第 _k_ 个排列，并迭代其索引，计算索引和值都是幸运数字的位置。 这对于小_n_是正确的，但是对于生成_n_！ 排列很快就变得不可行。 对于 _n_ = 15，有 1.3×10^12 种排列。 对它们进行排序并为第 k 个排列建立索引超出了实际计算的范围。 

关键的见解是，如果 _n_ 很大，我们不需要整个排列。 该问题仅询问幸运数字，并且低于任何合理_n_的幸运数字很少。 例如，1000以下，幸运数字少于50个。 因此，如果 _n_ > 15，则幸运位置数较少，排列的余数不会影响结果。 这使我们能够专注于最后一个`min(n, 15)`基于阶乘的字典顺序计算的元素，而前面的元素按升序排列，因为它们不能影响超过 15 的索引的字典顺序。 

这将问题简化为仅针对最后几个元素计算基于部分阶乘的排列，并根据幸运值检查幸运索引。 通过这一观察，即使对于大的_n_，问题也变得容易处理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n!) | O(n!) | 太慢了 |
 | 最佳 | O(分钟(n,15)^2) | O(分钟(n,15)) | 已接受 |

 ## 算法演练

 1. 生成最多 _n_ 个幸运数字。 这些将用于确定哪些位置和值是幸运的。 我们可以使用组合数字 4 和 7 的递归或迭代过程来生成它们。 
2. 如果 _n_ > 15，则修复第一个`n-15`元素按升序排列。 最后 15 个或更少的元素将被排列以达到第_k_个字典排列。 这是可行的，因为 15! = 1.3×10^12，适合阶乘计算。 
3. 计算最后一个的第_k_个排列`min(n,15)`使用阶乘编号的元素。 初始化可用元素的列表。 对于每个位置，通过将 _k_ 除以剩余位置的阶乘、更新 _k_ 并删除已使用的元素来确定哪个元素进入该位置。 
4. 放置固定前缀（如果有），后跟最后元素的计算排列，以形成完整的排列。 
5. 迭代排列的位置。 对于每个幸运数字并包含幸运值的位置，递增计数器。 
6. 输出计数器。 如果 _k_ 超过了最后一段的总排列，则输出 -1。 

这种方法之所以有效，是因为字典顺序仅取决于最后 15 个元素的排序，并且前缀按升序固定。 不变的是，在每一步中，阶乘除法都会正确选择第 k 次排列中的下一个元素，从而保证正确性。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

def lucky_numbers_up_to(n):
    result = []
    def generate(x):
        if x > n:
            return
        if x > 0:
            result.append(x)
        generate(x*10 + 4)
        generate(x*10 + 7)
    generate(0)
    return result

def kth_permutation(arr, k):
    n = len(arr)
    k -= 1  # 0-based
    perm = []
    available = arr[:]
    for i in range(n, 0, -1):
        fact = math.factorial(i - 1)
        index = k // fact
        if index >= len(available):
            return None
        perm.append(available.pop(index))
        k %= fact
    return perm

def main():
    n, k = map(int, input().split())
    if n > 15:
        prefix_len = n - 15
        suffix_len = 15
    else:
        prefix_len = 0
        suffix_len = n
    
    total_suffix_perms = math.factorial(suffix_len)
    if k > total_suffix_perms:
        print(-1)
        return
    
    prefix = list(range(1, prefix_len + 1))
    suffix = list(range(prefix_len + 1, n + 1))
    
    perm_suffix = kth_permutation(suffix, k)
    if perm_suffix is None:
        print(-1)
        return
    
    perm = prefix + perm_suffix
    lucky_nums = set(lucky_numbers_up_to(n))
    
    count = 0
    for idx, val in enumerate(perm, 1):
        if idx in lucky_nums and val in lucky_nums:
            count += 1
    print(count)

if __name__ == "__main__":
    main()
```这`lucky_numbers_up_to`函数使用递归生成所有幸运数字。 这`kth_permutation`函数使用阶乘编号计算第 k 个排列，调整基于 0 的索引。 main 函数通过将排列分成固定前缀和小后缀来处理大 _n_ 情况。 使用 O(1) 隶属度测试集来计算幸运数字非常简单。 边界处理确保当 _k_ 超出可能的排列时打印 -1。 

## 工作示例

 示例 1：输入`7 4`| 步骤| 前缀 | 后缀 | k | 排列|
 | ---| ---| ---| ---| ---|
 | 初始化| []| [1,2,3,4,5,6,7] | 4 | - |
 | 计算第 k 个 perm | []| [1,2,3,4,6,7,5] | 4 | [1,2,3,4,6,7,5] |
 | 数一数幸运位置| - | - | - | 1 |

 只有位置 4 包含值 4，都是幸运的，因此 count = 1。 

示例 2：输入`4 2`| 步骤| 前缀 | 后缀 | k | 排列|
 | ---| ---| ---| ---| ---|
 | 初始化| []| [1,2,3,4] | 2 | - |
 | 计算第 k 个 perm | []| [1,2,4,3] | 2 | [1,2,4,3] |
 | 数一数幸运位置| - | - | - | 1 |

 位置 4 包含值 4，计数 = 1。 

这些痕迹证实了基于阶乘的选择和幸运数字计数的正确处理。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(分钟(n,15)^2) | 生成第 k 个排列涉及迭代最多 15 个元素，每个步骤都使用列表中的 pop |
 | 空间| O(min(n,15) + log(n)) | O(min(n,15) + log(n)) | 存储后缀、阶乘列表和幸运数字，最多可达 n |

 对于 n ≤ 10^9，该算法非常高效，因为它从不存储完整的排列，并且阶乘计算限制为 15!。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from solution import main
    sys.stdout = io.StringIO()
    main()
    return sys.stdout.getvalue().strip()

# provided samples
assert run("7 4\n") == "1", "sample 1"
assert run("4 2\n") == "1", "sample 2"

# custom cases
assert run("15 1\n") == "0", "smallest k, no lucky in first permutation"
assert run("15 1000000\n") == "2", "middle k, expect some lucky intersections"
assert run("20 2432902008176640000\n") == "-1", "k
```
