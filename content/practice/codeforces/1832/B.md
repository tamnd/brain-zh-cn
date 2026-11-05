---
title: "CF 1832B - 最大总和"
description: "给定一个由不同整数组成的数组，并且必须恰好执行 k 个删除操作。 在每个操作中，我们可以删除最大的元素，也可以一起删除两个最小的元素。"
date: "2026-06-09T07:00:14+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "sortings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1832
codeforces_index: "B"
codeforces_contest_name: "Educational Codeforces Round 148 (Rated for Div. 2)"
rating: 1100
weight: 1832
solve_time_s: 82
verified: true
draft: false
---

[CF 1832B - 最大总和](https://codeforces.com/problemset/problem/1832/B)

 **评分：** 1100
 **标签：** 暴力破解、排序、两个指针
 **求解时间：** 1m 22s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个不同整数的数组，并且必须精确执行`k`删除操作。 在每个操作中，我们可以删除最大的元素，也可以一起删除两个最小的元素。 恰好之后`k`运算时，我们需要剩余元素的总和尽可能大。 数组大小`n`最多可达 200,000，所有的总和`n`跨测试用例也不超过200,000，这意味着我们必须在大致线性或线性时间上处理每个测试用例。 

通过重复查找最小值或最大值来模拟每个操作的简单解决方案会太慢，因为在未排序的数组中查找两个最小值或最大值每次操作的成本为 O(n)，导致复杂度为 O(k·n)，大约可以达到$10^{10}$在最坏的情况下。 

要考虑的边缘情况包括仅包含三个元素的数组，其中`k = 1`，因为删除最大元素或两个最小元素之间的选择很微妙。 当最大的元素比所有其他元素大得多时，就会出现另一种边缘情况 - 即使删除最大的元素一次也可能比重复删除小元素更糟糕。 

## 方法

 蛮力方法很简单：对于每个`k`步骤，扫描数组以找到两个最小或最大的元素，删除它们，然后继续。 这是正确的，但每个测试用例的复杂度为 O(k·n)。 什么时候`n`和`k`很大，就会超时。 

更快解决方案的关键洞察来自排序。 一旦数组按升序排序，两个最小的元素始终位于开头，最大的元素位于末尾。 我们可以预先计算所有元素的总和，并考虑删除前缀对（每次两个最小的）或后缀单数（每次最大的）的效果，而不是模拟每个操作。 具体来说，我们只需要考虑所有的组合`i`删除两个最小元素的操作和`k-i`删除最大元素的操作。 对于每个`i`从 0 到`k`，剩余的金额是总和减去总和`2*i`最小的和`k-i`最大的元素。 迭代所有`i`在`0..k`是可行的，因为`k < n/2`如果我们预先计算前缀和，则每次求和计算都可以在 O(1) 内完成。 

这将排序的复杂度从 O(k·n) 显着降低到 O(n log n)，再加上迭代的 O(k)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(k·n) | O(n) | 对于大的 n、k 来说太慢 |
 | 排序 + 前缀/后缀总和 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例的数量。 对于每个测试用例，请阅读`n`和`k`，后跟数组`a`。 
2. 将数组按升序排序。 这允许恒定时间访问前缀和后缀形式的最小和最大元素。 
3. 预先计算数组的前缀和。 让`prefix[i]`是第一个的总和`i`元素。 
4. 预先计算后缀和。 让`suffix[i]`是最后一个的总和`i`元素。 
5. 初始化变量`max_sum`数量非常少。 
6. 迭代`i`从 0 到`k`。`i`表示删除两个最小元素的操作数。 其余`k-i`操作删除最大的元素。 
7. 计算剩余元素的总和，即总和减去第一个元素的总和`2*i`元素并减去最后一个元素的总和`k-i`元素。 
8. 更新`max_sum`如果这个总和大于之前的最大值。 
9. 迭代完所有之后`i`， 打印`max_sum`。 

为什么它有效：排序确保我们总是可以准确地删除`2*i`最小的和`k-i`任何操作组合的最大元素。 因为我们考虑了执行多少个两个最小删除与最大删除的所有可能性，所以我们有效地探索整个解决方案空间，而无需模拟每个操作。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    a.sort()
    
    prefix = [0]*(n+1)
    for i in range(n):
        prefix[i+1] = prefix[i] + a[i]
    
    suffix = [0]*(n+1)
    for i in range(n-1, -1, -1):
        suffix[n-i] = suffix[n-i-1] + a[i]
    
    total = prefix[n]
    max_sum = 0
    for i in range(k+1):
        if 2*i > n or (k-i) > n:
            continue
        remaining_sum = total - prefix[2*i] - suffix[k-i]
        max_sum = max(max_sum, remaining_sum)
    
    print(max_sum)
```该代码对数组进行排序，预先计算前缀和后缀总和，然后迭代所有可能的“删除两个最小”操作数。 前缀和减去`2*i`最小元素，后缀和减去`k-i`最大的元素。 仔细处理前缀和后缀可以防止差一错误。 所有运算都使用整数运算，避免了溢出，因为 Python 处理大整数。 

## 工作示例

 考虑第一个样本输入：```
5 1
2 5 1 10 6
```排序数组：`[1, 2, 5, 6, 10]`前缀和：`[0, 1, 3, 8, 14, 24]`后缀总和（反转）：`[0, 10, 16, 21, 23, 24]`-`i=0`表示 0 个“两个最小”运算，1 个“最大”运算：剩余总和 = 24 - 0 - 10 = 14
 -`i=1`表示 1 个“二最小”运算，0 个“最大”运算：剩余总和 = 24 - 3 - 0 = 21

 最大总和为 21，与预期输出相符。 

第二个样本：```
5 2
2 5 1 10 6
```排序：`[1,2,5,6,10]`总和 = 24

 -`i=0`：0“两个最小”，2“最大”：总和 = 24 - 0 - (16) = 8
 -`i=1`：1“两个最小”，1“最大”：总和 = 24 - 3 - 10 = 11
 -`i=2`：2“两个最小”，0“最大”：总和= 24 - 3 - 0 = 21？ 等等2*2=4>5？ 无效的。 

最大总和为 11。 

该跟踪证实我们正确处理 2*i > n 边界并选择所有有效组合的最大总和。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序占主导地位，前缀/后缀和以及 k 上的迭代为 O(n + k) ≤ O(n) |
 | 空间| O(n) | 我们存储大小为 n+1 的前缀和后缀和数组 |

 有限制`n ≤ 2·10^5`并且所有测试用例的总和≤ 2·10^5，该解决方案很容易满足时间和内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    t = int(input())
    for _ in range(t):
        n, k = map(int, input().split())
        a = list(map(int, input().split()))
        a.sort()
        
        prefix = [0]*(n+1)
        for i in range(n):
            prefix[i+1] = prefix[i] + a[i]
        
        suffix = [0]*(n+1)
        for i in range(n-1, -1, -1):
            suffix[n-i] = suffix[n-i-1] + a[i]
        
        total = prefix[n]
        max_sum = 0
        for i in range(k+1):
            if 2*i > n or (k-i) > n:
                continue
            remaining_sum = total - prefix[2*i] - suffix[k-i]
            max_sum = max(max_sum, remaining_sum)
        print(max_sum)
    return output.getvalue().strip()

# Provided samples
assert run("6\n5 1\n2 5 1 10 6\n5 2\n2 5 1 10 6\n3 1\n1 2 3\n6 1\n15 22 12 10 13 11\n6 2\n15 22 12 10 13 11\n5 1\n999999996 999999999 999999997 999999998 999999995\n") == "21\n11\n3\n62\n46\n3999999986"

# Custom test cases
assert run("1\n3 1\n1 2 3\n") == "3"  # minimum-size input
assert run("1\n4 1\n5 1 2 4
```
