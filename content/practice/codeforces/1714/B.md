---
title: "CF 1714B - 删除前缀"
description: "给定一个长度为 n 的整数 a 序列，其中每个整数都位于 1 到 n 之间。 目标是通过从开头重复删除元素来使序列仅包含不同的值。"
date: "2026-06-09T20:04:36+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1714
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 811 (Div. 3)"
rating: 800
weight: 1714
solve_time_s: 99
verified: true
draft: false
---

[CF 1714B - 删除前缀](https://codeforces.com/problemset/problem/1714/B)

 **评分：** 800
 **标签：** 数据结构，贪心，实现
 **求解时间：** 1m 39s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数序列`a`长度`n`，其中每个整数位于`1`和`n`。 目标是通过从开头重复删除元素来使序列仅包含不同的值。 对于每个测试用例，我们必须确定从左侧删除的最小元素数，以便剩余序列不包含重复项。 

The input consists of multiple test cases, up to 10^4, and the sum of all sequence lengths does not exceed 2×10^5. 这意味着任何与每个测试用例的序列长度呈线性关系的解决方案都可以轻松满足 2 秒的时间限制，而每个测试用例具有 O(n^2) 的解决方案将太慢。 

An important edge case occurs when the duplicates appear at the very start of the array, for example`[1,1,1,1]`。 仅从序列开头检查重复项的简单方法可能会错误地删除太少的元素。 另一种边缘情况是当序列已经是唯一的时，例如`[1,2,3]`。 在这种情况下，答案一定是零。 所有元素都不同但按降序排列的序列，例如`[6,5,4,3,2,1]`，是另一种情况，可能会导致算法无法从末尾正确跟踪重复项。 

## 方法

 暴力方法将模拟前缀的删除。 从删除零个元素开始，检查剩余序列是否唯一。 如果不是，则再删除一个元素，再次检查，然后重复，直到序列唯一。 这是可行的，因为检查子序列中的唯一性可以使用集合来完成，但在最坏的情况下，这是 O(n^2)，因为我们可能检查所有前缀，并且每次检查都是 O(n)。 为了`n`最多 2×10^5，这太慢了。 

关键的见解是，从头开始删除元素只会影响左侧的重复项。 一旦从右侧第一次出现重复项，我们就可以删除最早出现之前的所有内容。 这自然会导致反向遍历：从数组的右端开始，将元素插入到集合中。 一旦我们遇到集合中已有的元素，我们就会停止。 该停止点之前的元素数量正是我们必须删除的最小前缀，以实现剩余序列的唯一性。 这将问题简化为从最后开始的线性扫描，每个测试用例的时间为 O(n)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了|
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1.初始化一组`seen`跟踪已经出现的数字。 
2. 开始从最右边的元素向最左边的元素扫描序列。 
3. 对于每个元素，检查它是否在`seen`。 
4.如果元素已经在`seen`，停止扫描。 这是从右侧遇到的第一个重复项。 
5. 如果该元素不在`seen`，将其添加到`seen`并继续向左移动。 
6. 停止后，我们扫描的最左边元素的位置对应于要移除的最小前缀。 要删除的元素数量正是该元素的索引（从 0 开始索引）。 
7. 打印每个测试用例要删除的元素数量。 

**为什么它有效：**不变的是`seen`始终包含从迄今为止扫描的最右边元素开始的数组后缀中的所有元素。 必须删除与此后缀中的元素重复的第一个元素，因为它违反了唯一性。 通过从右侧扫描，我们可以保证保留最长的唯一后缀，并且左侧任何与该后缀中的元素重复的元素都必须属于被删除的前缀。 这保证了最少的前缀删除。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    seen = set()
    remove_count = 0
    # traverse from right to left
    for i in range(n-1, -1, -1):
        if a[i] in seen:
            break
        seen.add(a[i])
        remove_count += 1
    # the minimal prefix to remove
    print(n - remove_count)
```该解决方案初始化一个`set`用于跟踪重复项。 它计算最长唯一后缀中的元素数量。 减去这个计数`n`给出要删除的最小前缀长度。 从右到左的遍历确保我们有效地捕获最长的唯一后缀。 当遇到重复项时，我们会立即中断，从而避免不必要的工作。 

## 工作示例

 **示例1：`[3, 1, 4, 3]`**

 | 我| 一个[我] | 见过| 删除计数 |
 | --- | --- | --- | --- |
 | 3 | 3 | {} | 1 |
 | 2 | 4 | {3} | 2 |
 | 1 | 1 | {3,4} | 3 |
 | 0 | 3 | {1,4,3} | 停止|

 剩余后缀`[1,4,3]`，删除前缀长度= 4 - 3 = 1。 

**示例2：`[1,2,1,7,1,2,1]`**

 | 我| 一个[我] | 见过| 删除计数 |
 | --- | --- | --- | --- |
 | 6 | 1 | {} | 1 |
 | 5 | 2 | {1} | 2 |
 | 4 | 1 | {1,2} | 停止|

 剩余后缀`[2,1]`，删除前缀长度 = 7 - 2 = 5。 

这些痕迹表明，从右向左扫描会捕获最长的唯一后缀，并产生要删除的最小前缀长度。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 每个元素被添加到`seen`最多一次。 从右到左扫描在第一次重复时立即停止。 |
 | 空间| 每个测试用例 O(n) | 这`seen`set 可以存储序列中所有不同的数字。 |

 鉴于总和`n`所有测试用例不超过 2×10^5，该解决方案非常适合 2 秒时间限制和 256 MB 内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call solution
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        seen = set()
        remove_count = 0
        for i in range(n-1, -1, -1):
            if a[i] in seen:
                break
            seen.add(a[i])
            remove_count += 1
        print(n - remove_count)
    return output.getvalue().strip()

# Provided samples
assert run("5\n4\n3 1 4 3\n5\n1 1 1 1 1\n1\n1\n6\n6 5 4 3 2 1\n7\n1 2 1 7 1 2 1\n") == "1\n4\n0\n0\n5"

# Custom test cases
assert run("2\n3\n1 1 1\n3\n1 2 3\n") == "2\n0", "all-equal vs all-distinct"
assert run("1\n5\n5 4 3 2 1\n") == "0", "reverse-order unique"
assert run("1\n1\n1\n") == "0", "single element"
assert run("1\n6\n1 2 3 3 2 1\n") == "3", "multiple duplicates"
assert run("1\n7\n1 2 3 4 5 6 7\n") == "0", "already unique"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 1`| 2 | 正确处理开始时的重复元素 |
 |`1 2 3`| 0 | 序列已经是唯一的 |
 |`5 4 3 2 1`| 0 | 最长的后缀是整个数组 |
 |`1 2 3 3 2 1`| 3 | 正确删除内部重复的前缀 |
 |`1 2 3 4 5 6 7`| 0 | 已经是独一无二的，无需删除 |

 ## 边缘情况

 对于`[1,1,1,1,1]`，从右边扫描，我们看到最后一个`1`首先，然后停在上一个`1`。 后缀是`[1]`，删除的前缀长度 = 5-1 = 4。算法正确识别最小删除。 

为了`[6,5,4,3,2,1]`，从右扫描，每个元素都是唯一的，直到最左边的元素。 后缀是整个数组，因此最小前缀去除量为 0。 

对于`[1]`，单元素序列总是唯一的。 该算法从右侧扫描，添加`1`到`seen`,
