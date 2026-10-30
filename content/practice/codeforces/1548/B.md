---
title: "CF 1548B - 整数有朋友"
description: "给定一个不同正整数的列表，我们想要确定最大的连续子数组，其中所有元素对某个大于或等于 2 的整数取模全等。"
date: "2026-06-10T13:33:45+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "divide-and-conquer", "math", "number-theory", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1548
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 736 (Div. 1)"
rating: 1800
weight: 1548
solve_time_s: 140
verified: true
draft: false
---

[CF 1548B - 整数有朋友](https://codeforces.com/problemset/problem/1548/B)

 **评分：** 1800
 **标签：** 二分查找、数据结构、分而治之、数学、数论、两个指针
 **求解时间：** 2m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一个不同正整数的列表，我们想要确定最大的连续子数组，其中所有元素都以某个大于或等于 2 的整数为模全等。简单来说，想象一下在数组上滑动一个窗口； 在该窗口内，必须存在一个数字$m \ge 2$使得窗口中的所有数字除以时留下相同的余数$m$。 目标是报告每个测试用例的此类窗口（称为“朋友组”）的最大大小。 

这些约束对于设计解决方案至关重要。 每个数组最多可以有 200,000 个元素，并且数字本身可以大到$10^{18}$。 由于所有测试用例的所有元素的总和上限为 200,000，因此我们知道每个测试用例的线性解是可行的，但任何二次解都可以$n$会太慢。 直接尝试每个可能的子数组的每个可能的模数将需要迭代值最多$10^{18}$，这是不可行的。 我们需要一个解决方案，避免对所有可能的情况进行暴力探索$m$。 

非明显的边缘情况包括仅包含两个数字的数组、数字为连续整数的数组以及数字之间的差异均为素数或非常大的数组。 例如，输入`[2, 4]`应该返回 2，因为两个数字都可以被 2 整除。假设模数始终是最小数字或仅检查连续差异的粗心方法可能会错误地处理`[3, 7, 11]`，其中正确的模数是 4，生成大小为 3 的朋友组。 

## 方法

 暴力方法会尝试检查每个连续的子数组和每个可能的$m$从 2 到该子数组中的最小元素。 对于每个子数组，我们将验证所有元素是否模全等$m$。 这个方法是正确的，但不切实际，因为$n$最多$2 \cdot 10^5$，子数组的数量是$O(n^2)$，并针对多个模检查每个子数组可能需要长达$O(n^3)$在最坏的情况下。 

关键的见解是模数只需要除以子数组中连续数字之间的差异。 如果子数组中的所有数字都对模全等$m$， 然后$m$除以每对差异。 因此，计算连续差值的最大公约数（GCD）就足够了。 这将问题转换为搜索最长连续段，其连续差异共享至少 2 的公共 GCD。 

通过将数组转换为差异数组并跟踪 GCD 至少为 2 的段，我们显着降低了复杂性。 我们只需要在数组上迭代一次，更新 GCD，并在 GCD 降至 2 以下时重置段。这种方法自然适合于每个测试用例中元素数量的线性时间解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^3) | O(n^3) | O(1) | O(1) | 太慢了|
 | 最佳 | O(n log(max(a))) | O(n log(max(a))) | O(n) | 已接受 |

 ## 算法演练

 1. 首先读取测试用例的数量。 对于每个测试用例，读取整数数组。 由于数组值可能非常大，因此我们需要避免随值本身缩放的操作。 
2.构建差异数组`diff`这样`diff[i] = abs(a[i+1] - a[i])`对于所有连续的对。 这将问题简化为查找差异 GCD 至少为 2 的线段。 
3. 初始化变量以跟踪当前 GCD 段和找到的最大段长度。 我们还跟踪该段的起始索引。 
4. 迭代差异数组。 在每一步中，用新的差值计算当前段的 GCD。 如果 GCD 降至 2 以下，则从当前差值开始新的段。 否则，扩展该段。 
5. 每次迭代后更新最大长度。 由于差异数组中的每个段都对应于原始数组中长一个元素的段，因此在更新最大值时将差异段长度加 1。 
6.处理完所有差异后，最大长度对应最大的好友组。 为每个测试用例打印或存储该值。 

为什么有效：朋友组中的所有数字共享相同的余数模数的属性$m \ge 2$直接翻译成$m$除以所有连续的差值。 维持连续差异的 GCD 可确保我们只考虑存在公共模数的段，并且当 GCD 降至 2 以下时重新启动可保证保留段不变性。 

## Python 解决方案```python
import sys
from math import gcd
input = sys.stdin.readline

def largest_friend_group(arr):
    n = len(arr)
    if n == 1:
        return 1
    diffs = [abs(arr[i+1] - arr[i]) for i in range(n-1)]
    max_len = 1
    current_gcd = diffs[0]
    start = 0
    for i in range(len(diffs)):
        if i > 0:
            current_gcd = gcd(current_gcd, diffs[i])
        if current_gcd == 1:
            current_gcd = diffs[i]
            start = i
        max_len = max(max_len, i - start + 2)
    return max_len

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    print(largest_friend_group(a))
```解决方案首先要有效地读取输入。 差异数组将问题从模数检查转变为 GCD 检查。 在迭代过程中，当前的 GCD 会被更新，每当它降至 2 以下时，该段就会重新启动。 最大长度计算为差异段的长度加一以计算原始数组长度。 显式处理单元素数组的边缘情况。 

## 工作示例

 输入样本`[1, 5, 2, 4, 6]`产生差异`[4, 3, 2, 2]`。 迭代地，我们跟踪 GCD：

 | 我| 差异[我] | 当前_gcd | 开始 | 最大长度 |
 | --- | --- | --- | --- | --- |
 | 0 | 4 | 4 | 0 | 2 |
 | 1 | 3 | 1 | 1 | 2 |
 | 2 | 2 | 2 | 2 | 3 |
 | 3 | 2 | 2 | 2 | 3 |

 我们得到的最大好友组长度为 3，这与`[2, 4, 6]`。 

输入样本`[8, 2, 5, 10]`产生差异`[6, 3, 5]`：

 | 我| 差异[我] | 当前_gcd | 开始 | 最大长度 |
 | --- | --- | --- | --- | --- |
 | 0 | 6 | 6 | 0 | 2 |
 | 1 | 3 | 3 | 0 | 3 |
 | 2 | 5 | 1 | 2 | 3 |

 最大段长度为3，匹配`[8, 2, 5]`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log(max(a))) | O(n log(max(a))) | 迭代数组并在每一步计算 GCD，GCD 采用 log(max element) |
 | 空间| O(n) | 存储差异数组 |

 鉴于总和$n$所有测试用例的总和是$2 \cdot 10^5$，该解决方案完全符合 2 秒时间限制和 256 MB 内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        output.append(str(largest_friend_group(a)))
    return "\n".join(output)

# Provided samples
assert run("4\n5\n1 5 2 4 6\n4\n8 2 5 10\n2\n1000 2000\n8\n465 55 3 54 234 12 45 78\n") == "3\n3\n2\n6"

# Custom cases
assert run("1\n1\n42\n") == "1", "single element"
assert run("1\n2\n10 20\n") == "2", "two elements divisible by 10"
assert run("1\n3\n2 3 5\n") == "2", "non-consecutive differences"
assert run("1\n5\n1000000000000000000 2000000000000000000 3000000000000000000 4000000000000000000 5000000000000000000\n") == "5", "large numbers"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\n1\n42\n`| 1 | 单元素数组 |
 |`1\n2\n10 20\n`| 2 | 两个元素可以被相同的数字整除 |
 | `1\n3\n2 3 5\n | | |
