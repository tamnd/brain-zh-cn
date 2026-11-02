---
title: "CF 1692E - 二进制双端队列"
description: "我们得到一个长度为 $n$ 的二进制数组，这意味着每个元素要么是 0 要么是 1。任务是执行一系列操作，其中在每个操作中，我们删除数组的第一个或最后一个元素。"
date: "2026-06-09T23:02:30+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "implementation", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1692
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 799 (Div. 4)"
rating: 1200
weight: 1692
solve_time_s: 110
verified: true
draft: false
---

[CF 1692E - 二进制双端队列](https://codeforces.com/problemset/problem/1692/E)

 **评分：** 1200
 **标签：** 二分查找、实现、两个指针
 **求解时间：** 1m 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给定一个长度的二进制数组$n$，表示每个元素不是 0 就是 1。任务是执行一系列操作，在每个操作中，我们删除数组的第一个或最后一个元素。 经过一定次数的删除后，剩余元素的总和必须等于目标值$s$。 我们想要找到达到这个总和所需的最少操作次数，如果不可能则报告 -1。 

输入提供多个测试用例，每个测试用例都有数组大小$n$，目标总和$s$，以及数组本身。 全部的总和$n$所有测试用例不超过 200,000 个，因此我们的解决方案必须有效地处理每个测试用例，最好是在相对于数组大小的线性时间内处理。 二次解决方案，例如显式尝试所有可能的前缀和后缀，对于最大的数组来说太慢了，因为它们可能需要最多$n^2$每个测试用例的操作。 

当目标总和已经达到时，就会出现边缘情况$s$为零或等于数组的总和，或者当所有元素都相同时。 例如，如果数组是$[1, 1, 1]$和$s = 0$，仅从开头删除元素的幼稚方法可能无法探索从末尾删除元素。 另一个微妙的情况是当数组两端都有零时，例如$[0, 1, 1, 0]$和$s = 2$; 我们必须认识到，删除零不会影响总和，并且应该尽量减少运算。 

## 方法

 蛮力方法将迭代删除的所有组合$i$前面的元素和$j$元素从后面。 对于每个组合，我们将计算剩余数组的总和。 这适用于小数组，因为它正确地探索每个可能的子数组，但它需要$O(n^2)$最坏情况下每个测试用例的操作。 和$n$达到20万，这种方式在最坏的情况下需要400亿次操作，这是完全不可行的。 

关键的见解来自于重写问题：不要考虑删除什么，而是考虑保留什么。 如果数组和是$total\_sum$，然后删除元素以求和$s$相当于保留一个连续子数组，其总和为$s$。 由于我们可以从两端删除元素，所以我们保留的子数组必须是连续的。 这将问题简化为查找总和等于的最长连续子数组$s$。 一旦我们知道了这个子数组的长度，最少的操作次数就是元素总数减去子数组的长度。 

这自然会导致两指针或滑动窗口解决方案。 滑动窗口工作效率很高，因为数组只包含 0 和 1，因此窗口的总和可以在恒定时间内增量更新。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(1) | O(1) | 太慢了|
 | 最佳| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 计算数组的总和。 如果$s$大于总和，立即返回-1，因为无法达到$s$。 如果$s$等于总和，由于不需要任何操作，因此返回 0。 
2.初始化两个指针：`left = 0`用于窗口的开始和`current_sum = 0`为窗口内元素的总和。 我们将尝试找到其总和等于的最长子数组$s$。 
3. 使用索引迭代数组`right`。 添加`array[right]`到`current_sum`。 如果`current_sum`超过$s$，移动`left`指针向前并减`array[left]`从`current_sum`直到`current_sum <= s`。 
4. 每当`current_sum`等于$s$,更新变量`max_length`跟踪此类子数组的最大长度。 
5. 循环结束后，如果`max_length`保持 -1，返回 -1，因为没有找到有效的子数组。 否则，返回`n - max_length`，它表示将数组减少到所需总和所需的最少操作数。 

为什么它有效：滑动窗口不变量确保`current_sum`始终表示结尾为的连续子数组的总和`right`。 通过调整`left`，我们仅在必要时缩小窗口，保证每个候选子数组的总和`s`被考虑。 跟踪最大长度可确保最少的移除次数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def min_operations_to_sum(n, s, arr):
    total = sum(arr)
    if s > total:
        return -1
    if s == total:
        return 0
    
    max_len = -1
    left = 0
    current_sum = 0
    
    for right in range(n):
        current_sum += arr[right]
        while current_sum > s and left <= right:
            current_sum -= arr[left]
            left += 1
        if current_sum == s:
            max_len = max(max_len, right - left + 1)
    
    return n - max_len if max_len != -1 else -1

t = int(input())
for _ in range(t):
    n, s = map(int, input().split())
    arr = list(map(int, input().split()))
    print(min_operations_to_sum(n, s, arr))
```该解决方案首先快速处理不可能的情况，然后使用滑动窗口定位具有目标和的最长子数组。 这`while`内部循环`for`确保当总和超过时窗口正确缩小$s$。 这`max_len`变量跟踪最长的有效子数组。 返回`n - max_len`将保留的子数组转换为最小删除次数。 

## 工作示例

 ### 示例 1

 输入：`3 1 1 0 0`| 对| 左| 当前总和| 最大长度 |
 | --- | --- | --- | --- |
 | 0 | 0 | 1 | 1 |
 | 1 | 0 | 1 | 1 |
 | 2 | 0 | 1 | 1 |

 结果：`3 - 1 = 2`，但要小心，我们检查总和：`sum(arr) = 1`, 等于 s，因此返回 0。 

### 示例 2

 输入：`9 3 0 1 0 1 1 1 0 0 1`| 对| 左| 当前总和| 最大长度 |
 | --- | --- | --- | --- |
 | 0 | 0 | 0 | -1 |
 | 1 | 0 | 1 | -1 |
 | 2 | 0 | 1 | -1 |
 | 3 | 0 | 2 | -1 |
 | 4 | 0 | 3 | 5 |
 | 5 | 0 | 4 | - 减去左 -> 左=1，current_sum=4，左=2 -> current_sum=4，左=3->current_sum=3 |`max_len = 6`， 结果：`9 - 6 = 3`。 

此跟踪确认窗口正确调整两端并找到与目标总和匹配的最长子数组。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个元素在滑动窗口中最多添加和删除一次。 |
 | 空间| O(1) | O(1) | 除了输入数组之外，仅使用了少数变量。 |

 考虑到所有总和的约束$n$测试用例的数量≤ 200,000，该算法完全在 2 秒的时间限制内，并且使用的额外内存可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    t = int(input())
    for _ in range(t):
        n, s = map(int, input().split())
        arr = list(map(int, input().split()))
        print(min_operations_to_sum(n, s, arr))
    return output.getvalue().strip()

# Provided samples
assert run("7\n3 1\n1 0 0\n3 1\n1 1 0\n9 3\n0 1 0 1 1 1 0 0 1\n6 4\n1 1 1 1 1 1\n5 1\n0 0 1 1 0\n16 2\n1 1 0 0 1 0 0 1 1 0 0 0 0 0 1 1\n6 3\n1 0 1 0 0 0") == "0\n1\n3\n2\n2\n7\n-1"

# Custom tests
assert run("2\n1 1\n1\n1 0\n0") == "0\n-1", "single element arrays"
assert run("1\n5 3\n1 1 1 1 1") == "2", "all ones, remove two elements"
assert run("1\n5 0\n0 0 0 0 0") == "0", "all zeros,
```
