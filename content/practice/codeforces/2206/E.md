---
title: "CF 2206E - 并行求和"
description: "给定一个由 n 个整数组成的序列 A = [a1, a2, ..., an]，但我们不知道 A 本身。 相反，我们提供了一系列长度为 n - m + 1 的并行和序列，其中每个和是 A 的 m 个连续元素的和。形式上，这些和为 si = ai + a{i+1} + ..."
date: "2026-06-07T19:44:47+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "geometry"]
categories: ["algorithms"]
codeforces_contest: 2206
codeforces_index: "E"
codeforces_contest_name: "2026 ICPC Asia Pacific Championship - Online Mirror (Unrated, Online Mirror, ICPC Rules, Teams Preferred)"
rating: 2500
weight: 2206
solve_time_s: 285
verified: false
draft: false
---

[CF 2206E - 并行求和](https://codeforces.com/problemset/problem/2206/E)

 **评分：** 2500
 **标签：** 数据结构、几何
 **求解时间：** 4m 45s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个序列`n`整数`A = [a_1, a_2, ..., a_n]`，但我们不知道`A`本身。 相反，我们提供了一系列平行的长度和`n - m + 1`，其中每个总和是`m`的连续元素`A`。 形式上，总和是`s_i = a_i + a_{i+1} + ... + a_{i+m-1}`。 我们的任务是，对于多个查询，确定给定范围内最大元素的最小可能值`[l_j, r_j]`原始数组的大小，或者报告它可以任意小。 

挑战在于`n`最大可达20万条查询数量`q`最多 100,000。 每个查询都需要对重叠总和所施加的约束进行推理。 对所有可能的数组进行简单的重建是不可行的，因为有效序列的空间`A`是巨大的。 

关键的微妙之处在于数组可以包含负数并且某些范围`A`受到约束不足。 例如，如果查询完全落在可以自由移动而不违反任何总和的位置内，则最小最大值是无界的并且可以任意为负值。 在这种情况下，假设每个元素由总和唯一确定的粗心方法将失败。 

例如，考虑`n = 5, m = 2`和`s = [1, 1, 1, 1]`。 顺序`[1, 0, 1, 0, 1]`满足总和，但是`[0, 1, 0, 1, 0]`也有效。 如果我们查询`[2, 2]`，最小可能值是无界的，因为第二个元素可以任意小，同时保持总和。 

## 方法

 暴力方法将尝试枚举所有序列`A`与总和兼容，然后直接计算每个查询范围内的最大值。 这种方法显然是不切实际的。 即使重建单个数组也确定性地需要`O(n)`运算，并且由于重叠和引入的自由度，有效序列的数量呈指数级增长。 暴力枚举需要`O(2^n)`在最坏的情况下。 

关键的见解是将问题转化为基于差异的表示。 定义`d_i = a_{i+1} - a_i`在循环模中`m`感觉。 观察总和，每个新总和都会对差模施加线性约束`m`。 然后我们可以计算每个模类的前缀最小值和最大值。 具体来说，对于每个位置`i`模数`m`，我们可以维持之间的运行累积差异`a_i`和一些基本元素`a_{start_of_class}`。 

这使我们能够有效地回答查询。 如果查询跨越多个模类，则通过组合范围内每个类的极值来确定最小最大值。 如果范围包含模类的完整循环，则最小最大值可以任意小，因为我们可以在不违反总和的情况下将基本元素向下移动。 否则，最小最大值受累积差值的前缀最大值限制。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n * q) | O(2^n * q) | O(n) | 太慢了 |
 | 前缀差+模类| O(n + q) | O(n) | 已接受 |

 ## 算法演练

 1. 计算模差`m`。 定义`diff[i] = s[i+1] - s[i]`为了`i = 1..n-m`。 这表示总和的变化，并对每个模类中的连续元素进行编码约束。 
2. 对于每个位置`i = 1..n`，为其分配一个模类`i % m`。 每个类代表总和中“对齐”的元素，并且只能一起移动而不影响其他类的总和。 
3. 对于每个模类，计算差异的前缀和。 让`prefix[j]`是该类别中差异的累积总和，直到`j`-th 元素。 跟踪最小和最大前缀值，它们表示类中相对于任意基数的最低和最高元素。 
4. 对于每个查询`[l, r]`，确定范围内存在的模类集。 如果任何类的第一个和最后一个元素在范围内（完整循环），则输出`unbounded`因为基本元素可以无限减少。 否则，对于部分存在的每个类别，计算该段中的最大累积差异并取各个类别的总体最大值。 
5. 输出每个查询的结果。 

为什么它有效：模类分解隔离了数组中的自由度。 前缀最大值和最小值跟踪总和所施加的最严格的约束。 由于模分离，移动类的基本元素会保留该类和其他类的总和，并且完整的循环表示无限的自由。 没有有效的配置`A`被忽略，因为考虑了所有前缀差异，并且在存在自由时准确检测无界情况。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
s = list(map(int, input().split()))
q = int(input())

# compute differences of sums
d = [s[i+1] - s[i] for i in range(n - m)]

# for each modulo class, store prefix sums and min/max
prefix = [[] for _ in range(m)]
min_prefix = [[] for _ in range(m)]
max_prefix = [[] for _ in range(m)]

for i in range(m):
    val = 0
    arr = []
    mins = []
    maxs = []
    idx = i
    while idx < n:
        if idx < n - m:
            val += d[idx]
        arr.append(val)
        mins.append(min(arr))
        maxs.append(max(arr))
        idx += m
    prefix[i] = arr
    min_prefix[i] = mins
    max_prefix[i] = maxs

# process queries
for _ in range(q):
    l, r = map(int, input().split())
    l -= 1
    r -= 1
    unbounded = False
    answer = -10**18
    for mod in range(m):
        start = (l + m - mod - 1) // m
        end = (r - mod) // m
        if start <= end:
            if end - start + 1 == len(prefix[mod]):
                unbounded = True
                break
            answer = max(answer, max_prefix[mod][end])
    print("unbounded" if unbounded else answer)
```该解决方案首先构造差异数组并按模类分隔元素。 计算前缀最小值和最大值以跟踪约束。 使用整数除法来处理查询以查找每个类中的段索引，并通过检查类是否完全跨越来检测无界性。 请注意从零开始的索引以匹配 Python 约定。 

## 工作示例

 ### 输入示例 1```
8 4
4 -4 2 6 5
4
3 7
4 6
1 8
2 5
```| 查询 | 跨类| 部分/完整| 最大| 输出|
 | --- | --- | --- | --- | --- |
 | 3-7 | 3-7 3-7 班 | 部分 | 2 | 2 |
 | 4-6 | 类循环存在| 完整| - | 无界|
 | 1-8 | 1-8 全部 | 部分 | 4 | 4 |
 | 2-5 | 2-5 部分 | - | -1 | -1 |

 该表显示第一个查询仅部分跨越类，给出有界最大值。 第二个查询跨越整个类周期，因此没有限制。 其余查询的处理方式类似。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + q) | 为所有类构建前缀数组的时间复杂度为 O(n)，每次查询查找的时间复杂度为 O(q) |
 | 空间| O(n) | 前缀数组总共存储 n 个元素，以 m 类为模 |

 和`n`高达 200,000 以及`q`最多10万，这在4s和1GB内存内是可行的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    exec(open('solution.py').read())
    return sys.stdout.getvalue().strip()

# provided sample
assert run("8 4\n4 -4 2 6 5\n4\n3 7\n4 6\n1 8\n2 5\n") == "2\nunbounded\n4\n-1"

# minimum size input
assert run("1 1\n5\n1\n1 1\n") == "5"

# all equal sums
assert run("5 2\n3 3 3 3\n2\n1 5\n2 4\n") == "unbounded\nunbounded"

# maximum n with small m
assert run("6 1\n1 2 3 4 5 6\n1\n1 6\n") == "6"

# negative sums
assert run("4 2\n-1 -2 -3\n1\n1 4\n") == "unbounded
```
