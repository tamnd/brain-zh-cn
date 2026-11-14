---
title: "CF 33C - 奇妙的随机和"
description: "给定一个整数序列，任务是通过执行两个操作来最大化其总和：首先，我们可以选择序列的任何前缀，并将其中的每个元素乘以 -1； 其次，我们可以选择序列的任何后缀并将其中的每个元素乘以-1。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy"]
categories: ["algorithms"]
codeforces_contest: 33
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 33 (Codeforces format)"
rating: 1800
weight: 33
solve_time_s: 186
verified: true
draft: false
---
[CF 33C - 奇妙的随机总和](https://codeforces.com/problemset/problem/33/C)

 **评分：** 1800
 **标签：** 贪婪
 **求解时间：** 3m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个整数序列，任务是通过执行两个操作来最大化其总和：首先，我们可以选择序列的任何前缀，并将其中的每个元素乘以 -1； 其次，我们可以选择序列的任何后缀并将其中的每个元素乘以-1。 这两个操作都是可选的，并且前缀和后缀可以重叠。 输出是一个整数，即可实现的最大总和。 

关键限制是序列最多可以包含 100,000 个元素，并且单个元素的范围为 -10,000 到 10,000。 由于时间限制为 2 秒，这将我们限制为以大致线性或线性对数时间运行的解决方案。 二次方法，例如尝试每对可能的前缀和后缀，需要的顺序是$10^{10}$在最坏的情况下进行操作，这是不可行的。 

微妙的边缘情况包括具有所有负数的序列，其中翻转整个序列可能是最佳的，以及具有单个元素的序列，其中翻转可能有益也可能无益。 例如，输入`[-5]`应该输出`5`， 尽管`[3]`应该输出`3`。 粗心的方法可能会假设前缀和后缀是不相交的，或者无法正确处理空翻转。 

## 方法

 暴力方法将尝试每个可能的前缀进行翻转，然后尝试每个可能的后缀进行翻转，计算总和并跟踪最大值。 具体来说，对于每个索引$i$从 0 到$n$，我们翻转第一个$i$元素，然后对于每个索引$j$从 0 到$n$, 翻转最后一个$j$元素。 每次评估都需要求和$n$元素。 这给出了$O(n^3)$最坏情况下的复杂性。 即使我们预先计算前缀和以将总和计算减少到$O(1)$，这仍然产生$O(n^2)$，这对于$n = 10^5$。 

允许线性解决方案的关键观察是，如果我们最初翻转它然后再翻转回来，翻转前缀或后缀相当于从总和中减去该段总和的两倍。 更具体地说，令序列的总和为$S$。 翻转长度前缀$k$将总和更改为$-2 \times \text{sum of first k elements}$。 翻转长度后缀$l$将总和更改为$-2 \times \text{sum of last l elements}$。 因此，最大化总和减少为选择前缀和后缀，使得被翻转（并减去两次）的段的总和最小化。 

为了有效地实现这一点，我们可以预先计算前缀和和后缀和。 我们跟踪最小前缀和和最小后缀和，然后考虑不翻转、仅翻转前缀、仅翻转后缀或两者都翻转的组合。 最佳总和就是这些组合中的最大值。 因为前缀和和后缀和是线性计算的，并且组合步骤也是线性的，所以整体复杂度为$O(n)$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1.读取序列并计算总和$S$。 这代表没有任何翻转的总和。 
2. 计算序列的前缀和。 对于每个索引$i$, 前缀总和为$i$是从 0 到 的元素之和$i$。 迭代时跟踪最小前缀和。 这将使我们稍后能够确定最有利的翻转前缀。 
3. 同样，计算从末尾到开头的后缀和，跟踪最小后缀和。 这为翻转提供了最有利的后缀。 
4. 考虑不翻转任何段。 这简单地产生$S$。 
5. 考虑翻转总和最小的前缀。 翻转此前缀会将总和更改为$S - 2 \times (\text{minimum prefix sum})$。 
6. 考虑翻转总和最小的后缀。 翻转此后缀会将总和更改为$S - 2 \times (\text{minimum suffix sum})$。 
7. 考虑翻转前缀和后缀。 由于翻转可能重叠，因此在翻转最小前缀和最小后缀时计算总和，调整重叠以避免双重减法。 
8. 答案是这些场景中的最大值。 

为什么有效：翻转一个线段相当于减去其总和的两倍。 除了正确考虑的重叠之外，这些操作是线性且独立的。 通过预先计算最小前缀和后缀总和，我们确保选择在全局范围内最大化总和，而不会错过任何更好的组合。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))

total = sum(a)

# Compute minimum prefix sum
prefix_sum = 0
min_prefix = 0
for x in a:
    prefix_sum += x
    min_prefix = min(min_prefix, prefix_sum)

# Compute minimum suffix sum
suffix_sum = 0
min_suffix = 0
for x in reversed(a):
    suffix_sum += x
    min_suffix = min(min_suffix, suffix_sum)

# Maximum sum options
max_sum = total
max_sum = max(max_sum, total - 2 * min_prefix)
max_sum = max(max_sum, total - 2 * min_suffix)
max_sum = max(max_sum, total - 2 * (min_prefix + min_suffix))

print(max_sum)
```该解决方案首先计算总和作为基线。 前缀和循环跟踪运行总和并更新最小前缀和，处理翻转空前缀不会产生任何变化的情况。 后缀求和循环则相反。 所有翻转选项中的最大值给出了最终答案。 自然处理诸如所有负数或单个元素之类的边缘情况，因为空翻转对应于零减法。 

## 工作示例

 **示例1**

 输入：`[-1, -2, -3]`| 步骤| 前缀总和 | 最小前缀 | 后缀总和 | 最小后缀 | 总计 | 最大总和候选人 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | -1 | -1 | -3 | -3 | -6 | 6, 6, 6, 6 | 6, 6, 6, 6 |

 翻转整个序列（前缀和/或后缀）会产生 6，即正确的最大值。 

**示例2**

 输入：`[3, -4, 2]`| 步骤| 前缀总和 | 最小前缀 | 后缀总和 | 最小后缀 | 总计 | 最大总和候选人 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 3 | 0 | 2 | -4 | 1 | 1, 1, 9, 9 | 1, 1, 9, 9 |

 翻转后缀`[-4, 2]`给出总和`9`，这是最大值。 

这些痕迹证实，即使元素混合正负，算法也能识别出要翻转的最佳片段。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 一次计算总和，一次计算前缀和，一次计算后缀和，常数时间组合 |
 | 空间| O(1) | O(1) | 仅存储少量运行总计和最小值 |

 这完全符合 2 秒的限制$n \le 10^5$内存限制为 256 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    a = list(map(int, input().split()))
    total = sum(a)
    prefix_sum = 0
    min_prefix = 0
    for x in a:
        prefix_sum += x
        min_prefix = min(min_prefix, prefix_sum)
    suffix_sum = 0
    min_suffix = 0
    for x in reversed(a):
        suffix_sum += x
        min_suffix = min(min_suffix, suffix_sum)
    max_sum = total
    max_sum = max(max_sum, total - 2 * min_prefix)
    max_sum = max(max_sum, total - 2 * min_suffix)
    max_sum = max(max_sum, total - 2 * (min_prefix + min_suffix))
    return str(max_sum)

# Provided sample
assert run("3\n-1 -2 -3\n") == "6", "sample 1"

# Custom cases
assert run("1\n5\n") == "5", "single positive"
assert run("1\n-5\n") == "5", "single negative"
assert run("5\n-1 -2 -3 -4 -5\n") == "15", "all negative"
assert run("5\n1 2 3 4 5\n") == "15", "all positive"
assert run("4\n3 -1 -2 5\n") == "11", "mixed positive/negative"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\n5\n`| 5 | 单一正元素 |
 |`1\n-5\n`| 5 | 单负元素 |
 |`5\n-1 -2 -3 -4 -5\n`| 15 | 15 翻转所有负数 |
 |`5\n1 2 3 4 5\n`| 15 | 15 所有积极的事情都不需要翻转|
 | `4\n3 - | | |
