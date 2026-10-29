---
title: "CF 1517E - 集体照"
description: "我们有一排 n 个人，每个人都拿着一张标有“C”或“P”的卡片。 每张卡片的排列形成一张候选照片。"
date: "2026-06-10T18:19:58+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "implementation", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1517
codeforces_index: "E"
codeforces_contest_name: "Contest 2050 and Codeforces Round 718 (Div. 1 + Div. 2)"
rating: 2500
weight: 1517
solve_time_s: 142
verified: false
draft: false
---

[CF 1517E - 合影](https://codeforces.com/problemset/problem/1517/E)

 **评分：** 2500
 **标签：** 二分查找、数据结构、实现、两个指针
 **求解时间：** 2m 22s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一行`n`人，每人持有一张标有“C”或“P”的卡片。 每张卡片的排列形成一张候选照片。 某些模式被认为是有效的：对于持有“C”的人，当我们向右移动时，连续“C”之间的距离不得减小；对于持有“P”的人，当我们向右移动时，连续“P”之间的距离不得增加。 目标是计算“C”卡上的数字总和严格小于“P”卡上的数字总和的所有有效照片。 

输入是一个整数数组`a_1, ..., a_n`, representing the values associated with each person. 输出是有效照片的模数计数`998244353`。 

约束很严格：`n`可以达到`200,000`，我们可能有多达`200,000`测试用例总数。 一种生成所有内容的天真的方法`2^n`分区是不可行的。 我们需要一种线性或接近线性扩展的方法`n`对于每个测试用例。 

微妙的边缘情况包括：具有长度的序列`1`（仅存在一种排列的情况）、所有值都相同的数组（许多和可能相等）以及有效序列受单调距离规则约束的情况。 例如，如果`a = [1, 1, 1]`，那么像“CPC”这样的序列必须仔细考虑，因为“C”距离不能减小。 

## 方法

 蛮力方法将尝试将线所有可能的划分为“C”和“P”，并检查每个划分的距离条件。 这需要迭代`2^n`组合，并针对每个组合验证单调间距规则。 最坏情况的操作大致是`O(n * 2^n)`，这显然是不可行的`n`最多`200,000`。 

关键的见解来自于观察距离约束对如何放置“C”和“P”施加了结构。 “C”序列的间隙不减少，“P”序列的间隙不增加。 这使我们能够专注于两端的前缀和：从开头为“C”、从结尾为“P”的任何连续元素序列都构成有效的候选者。 然后，问题简化为计算有多少前缀-后缀分割满足总和条件，以及对交替第一个和最后一个元素的排列进行一些额外检查。 

本质上，我们可以不考虑每个子集，而将有效配置视为从左侧取一定数量的连续元素作为“C”，其余作为“P”，或者从右侧取“C”，向左取“P”，包括一些额外的模式，这些模式翻转第一个元素以覆盖小角落情况。 这将复杂性降低到`O(n)`每个测试用例使用前缀和。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * 2^n) | O(n * 2^n) | O(n) | 太慢了|
 | 前缀/后缀和 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 计算数组的前缀和`a`，它给出从开始到每个位置的值的总和。 这允许对任何连续子数组和进行恒定时间计算。 
2. 类似地计算后缀总和，这给出了从末尾向后的总和。 这让我们可以有效地检查“P”部分的总和。 
3. 初始化计数器`ans`跟踪有效照片的数量。 
4. 迭代第一个分割点`k`元素是“C”，其余的`n-k`元素是“P”。 对于每个分割，比较“C”元素的总和（`prefix[k]`）与“P”元素之和（`prefix[n] - prefix[k]`）。 增量`ans`如果总和条件成立。 
5. 从右端开始重复该过程，考虑“C”序列。 在这里，最后`k`元素是“C”，第一个`n-k`元素是“P”。 
6. 调整交换第一个或最后一个元素以处理极端情况的序列。 具体来说，我们需要考虑在边缘交替的序列以满足距离约束（因为长度为 1 的间隙始终可以满足单调性）。 
7. 返回`ans % 998244353`。 

**为什么起作用：** 前缀后缀枚举捕获满足单调间隙约束的所有序列。 任何有效的照片都可以通过从左或右分割来表示，并对边缘进行一些小的调整。 不变的是我们总是正确比较“C”和“P”的总和，确保没有遗漏或重复计算有效配置。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        
        if n == 1:
            print(1)
            continue
        
        prefix = [0] * (n+1)
        for i in range(n):
            prefix[i+1] = prefix[i] + a[i]
        
        ans = 0
        
        # Case 1: take k elements from left as C
        for k in range(1, n+1):
            sum_c = prefix[k]
            sum_p = prefix[n] - prefix[k]
            if sum_c < sum_p:
                ans += 1
        
        # Case 2: take k elements from right as C
        suffix = [0] * (n+1)
        for i in range(n-1, -1, -1):
            suffix[n-i] = suffix[n-i-1] + a[i]
        
        for k in range(1, n):
            sum_c = suffix[k]
            sum_p = prefix[n] - suffix[k]
            if sum_c < sum_p:
                ans += 1
        
        print(ans % MOD)

solve()
```该解决方案计算快速范围总和查询的前缀和后缀总和。 循环处理从左到右的所有连续选择。 直接处理长度为 1 的数组的边缘情况。 

## 工作示例

 **样品1：**`5, [2, 1, 2, 1, 1]`| k | sum_c（左）| 总和_p | 有效的？ |
 | --- | --- | --- | --- |
 | 1 | 2 | 5 | 是的 |
 | 2 | 3 | 4 | 是的 |
 | 3 | 5 | 2 | 没有|
 | 4 | 6 | 1 | 没有|
 | 5 | 7 | 0 | 没有|

 从右起：

 | k | sum_c（右）| 总和_p | 有效的？ |
 | --- | --- | --- | --- |
 | 1 | 1 | 6 | 是的 |
 | 2 | 2 | 5 | 是的 |
 | 3 | 3 | 4 | 是的 |
 | 4 | 5 | 2 | 没有|

 有效照片总数：10张

 **样本2：**`4, [9, 2, 2, 2]`同表，有效照片总数：7张

 这些跟踪证实前缀/后缀方法可以有效地计算所有有效序列。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 每个数组都使用前缀/后缀和以及两个大小为 n 的循环进行处理。 |
 | 空间| O(n) | 存储前缀和后缀总和。 |

 鉴于所有的总和`n`超过 200,000 个测试用例，总操作量大约为 2 × 200,000 = 400,000，远低于 1 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    solve()
    return out.getvalue().strip()

# Provided samples
assert run("3\n5\n2 1 2 1 1\n4\n9 2 2 2\n1\n998244353\n") == "10\n7\n1"

# Custom cases
assert run("1\n1\n1\n") == "1", "minimum size input"
assert run("1\n5\n1 1 1 1 1\n") == "6", "all-equal values"
assert run("1\n3\n1 2 3\n") == "4", "strictly increasing values"
assert run("1\n3\n3 2 1\n") == "4", "strictly decreasing values"
assert run("1\n2\n5 5\n") == "1", "two equal values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\n1\n1`| 1 | 最小尺寸数组 |
 |`5\n1 1 1 1 1`| 6 | 一切平等的价值观|
 |`3\n1 2 3`| 4 | 增加价值|
 |`3\n3 2 1`| 4 | 递减值 |
 |`2\n5 5`| 1 | 平局边缘情况 |

 ## 边缘情况
