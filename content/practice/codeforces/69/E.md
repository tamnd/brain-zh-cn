---
title: "CF 69E - 子段"
description: "我们得到一个整数数组和一个固定的窗口大小 k。 对于长度为 k 的每个连续子数组（段），我们需要找到在该段内仅出现一次的最大元素。 如果没有元素恰好出现一次，我们输出“Nothing”。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "implementation"]
categories: ["algorithms"]
codeforces_contest: 69
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 63 (Div. 2)"
rating: 1800
weight: 69
solve_time_s: 82
verified: true
draft: false
---

[CF 69E - 子段](https://codeforces.com/problemset/problem/69/E)

 **评分：** 1800
 **标签：** 数据结构、实现
 **求解时间：** 1m 22s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组和一个固定的窗口大小`k`。 对于每个长度连续的子数组（段）`k`，我们需要找到在该段内仅出现一次的最大元素。 如果没有元素恰好出现一次，我们输出“Nothing”。 

输入以数组大小开始`n`和段长度`k`， 其次是`n`整数。 输出是`n-k+1`行，每一行对应一个段。 

限制因素很重要：`n`最多可达 100,000，这排除了任何超出粗略范围的解决方案`O(n log n)`或者`O(n)`如果我们想保持在 1 秒以内，则每个测试用例都可以工作。 检查每个段中所有元素的唯一性的简单方法是`O(n*k)`，最坏情况可以达到100亿次操作，并且会超时。 

当段的所有元素都重复时，就会出现不明显的边缘情况。 例如，如果该段是`[2, 2, 2]`，不存在只出现一次的元素。 粗心的实现可能会尝试返回最大值并产生`2`而不是“什么都没有”。 另一种边缘情况是当数组有负数或较大值时； 该算法必须正确地比较它们而不假设积极性。 

## 方法

 蛮力解决方案迭代每个长度段`k`。 对于每个段，我们计算每个数字的频率，然后选择频率恰好为 1 的数字中的最大值。 这是可行的，因为它通过直接检查保证了正确的结果，但复杂性是`O(n*k)`- 为了`n=10^5`和`k=10^5`，那太慢了。 

更快方法的关键观察是我们可以维持一个大小的滑动窗口`k`当我们从一个片段移动到下一个片段时更新频率。 我们不是从头开始重新计算每个段的频率，而是减少离开窗口的元素的计数并增加进入窗口的元素的计数。 这基本上减少了每一步的工作量`O(log k)`如果我们在一个允许快速提取最大值的数据结构中维护候选集，例如平衡 BST 或`SortedSet`。 

在这个问题中，我们使用一个`SortedSet`在当前窗口中仅出现一次的元素。 每当一个数字的频率从 1 变为 2 时，我们就把它从集合中删除； 当它从 2 下降到 1 时，我们添加它。 这组的最大值正是我们需要输出的数字。 如果集合为空，我们打印“Nothing”。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n*k) | O(k) | 太慢了 |
 | 带频率图+SortedSet的滑动窗口| O(n log k) | O(n log k) | O(k) | 已接受 |

 ## 算法演练

 1. 初始化一个频率字典，统计当前窗口中元素出现的次数。 初始化一个`SortedSet`（或等效）使所有元素的频率恰好为一。 
2. 填充频率图并设置第一个窗口长度`k`。 对于每个元素，增加其计数； 如果计数变为一，则将其添加到集合中； 如果变成两个，请将其删除。 
3. 输出第一个窗口的集合中的最大值。 如果集合为空，则打印“Nothing”。 
4. 将窗口一次滑动一个元素。 对于每一步，删除离开窗口的元素的频率：如果其频率从 2 下降到 1，则将其添加回集合中； 如果它从一下降到零，请将其删除。 然后增加新元素进入窗口的频率：如果成为1，则添加； 如果变成两个，请将其删除。 
5. 更新新窗口的集合后，输出最大元素，如果集合为空，则输出“Nothing”。 重复此操作，直到处理完所有窗口。 

工作原理：在每一步中，该集合都包含当前窗口中恰好出现一次的所有数字。 通过增量更新，我们永远不会丢失元素或包含重复项，因此可以保证集合的最大值满足问题要求。 滑动窗口保证我们只花`O(log k)`如果使用平衡结构，每步的时间，保持算法的效率。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from sortedcontainers import SortedSet
from collections import defaultdict

n, k = map(int, input().split())
a = [int(input()) for _ in range(n)]

freq = defaultdict(int)
unique = SortedSet()

# initialize first window
for i in range(k):
    freq[a[i]] += 1
for i in range(k):
    if freq[a[i]] == 1:
        unique.add(a[i])
    elif freq[a[i]] == 2:
        unique.discard(a[i])

# output for the first window
print(unique[-1] if unique else "Nothing")

# slide the window
for i in range(k, n):
    left = a[i - k]
    freq[left] -= 1
    if freq[left] == 1:
        unique.add(left)
    elif freq[left] == 0:
        unique.discard(left)

    right = a[i]
    freq[right] += 1
    if freq[right] == 1:
        unique.add(right)
    elif freq[right] == 2:
        unique.discard(right)

    print(unique[-1] if unique else "Nothing")
```该解决方案首先为第一个窗口构建频率图和`SortedSet`只出现一次的元素。 滑动窗口时，我们会仔细更新计数并相应地调整设置。 操作顺序很重要：首先递减，然后递增，因为窗口从左到右变化。 

## 工作示例

 **样品1：**

 输入：```
5 3
1
2
2
3
3
```| 窗口| 频率 | 独特| 输出|
 | --- | --- | --- | --- |
 | [1,2,2]| {1:1,2:2} | {1} | 1 |
 | [2,2,3]| {2:2,3:1} | {3} | 3 |
 | [2,3,3]| {2:1,3:2} | {2} | 2 |

 这演示了元素进入和离开窗口时对重复项的正确处理和正确的更新。 

**自定义输入：**

 输入：```
6 2
4
4
5
6
5
7
```| 窗口| 频率 | 独特| 输出|
 | --- | --- | --- | --- |
 | [4,4]| {4:2} | {} | 什么都没有|
 | [4,5]| {4:1,5:1} | {4,5} | 5 |
 | [5,6]| {5:1,6:1} | {5,6} | 6 |
 | [6,5]| {6:1,5:1} | {5,6} | 6 |
 | [5,7]| {5:1,7:1} | {5,7} | 7 |

 ## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log k) | O(n log k) | 滑动窗口更新涉及`SortedSet`每个元素的操作，即 log(窗口大小) |
 | 空间| O(k) | 频率图和`SortedSet`最多存储`k`元素|

 该解决方案可以轻松满足 1 秒的时间限制`n=10^5`并使用低于 256 MB 的内存。 

## 测试用例```python
import sys, io
from contextlib import redirect_stdout

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    f = io.StringIO()
    with redirect_stdout(f):
        # insert solution code here
        import sys
        input = sys.stdin.readline
        from sortedcontainers import SortedSet
        from collections import defaultdict

        n, k = map(int, input().split())
        a = [int(input()) for _ in range(n)]

        freq = defaultdict(int)
        unique = SortedSet()

        for i in range(k):
            freq[a[i]] += 1
        for i in range(k):
            if freq[a[i]] == 1:
                unique.add(a[i])
            elif freq[a[i]] == 2:
                unique.discard(a[i])
        print(unique[-1] if unique else "Nothing")

        for i in range(k, n):
            left = a[i - k]
            freq[left] -= 1
            if freq[left] == 1:
                unique.add(left)
            elif freq[left] == 0:
                unique.discard(left)

            right = a[i]
            freq[right] += 1
            if freq[right] == 1:
                unique.add(right)
            elif freq[right] == 2:
                unique.discard(right)

            print(unique[-1] if unique else "Nothing")
    return f.getvalue().strip()

# provided sample
assert run("5 3\n1\n2\n2\n3\n3\n") == "1\n3\n2"

# custom cases
assert run("2 1\n1\n1\n") == "1\n1", "single element windows"
assert run("3 3\n2\n2\n2\n") == "Nothing", "all duplicates"
assert run("4
```
