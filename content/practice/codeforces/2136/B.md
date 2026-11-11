---
title: "CF 2136B - 与 Bitset 类似"
description: "我们被要求构造一个长度为 $n$ 的排列，满足由二进制字符串 $s$ 和整数 $k$ 确定的位置最大约束。"
date: "2026-06-09T04:10:02+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "greedy", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 2136
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 1046 (Div. 2)"
rating: 900
weight: 2136
solve_time_s: 85
verified: false
draft: false
---

[CF 2136B - 像位集](https://codeforces.com/problemset/problem/2136/B)

 **评分：** 900
 **标签：** 构造性算法，贪心，二指针
 **求解时间：** 1m 25s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求构造一个长度排列$n$满足由二进制字符串确定的位置最大约束$s$和一个整数$k$。 对于每个职位$i$在哪里$s_i = 1$，我们必须确保$p_i$永远不是任何长度至少为连续的子数组中的最大值$k$其中包含$i$。 职位与$s_i = 0$没有任何限制。 如果这样的排列不存在，我们报告“NO”。 

约束条件允许$n$最多$2 \cdot 10^5$跨多个测试用例。 这排除了算法$O(n^2)$行为，因为最坏情况下的总操作可能会超过$10^{10}$。 我们需要一个$O(n \log n)$或者更好，理想情况下$O(n)$，每个测试用例的解决方案。 

当有太多连续的 1 相对于$k$。 例如，如果$s = 1111$和$k = 3$，四个 1 组成的块中的任何元素都将位于某个长度为 3 或更长的区间内，并且如果分配的元素是连续的，则其中一个元素将不可避免地成为某个区间中的最大值。 这会使排列变得不可能。 另一个边缘情况是当$k = 1$; 每个元素与$s_i = 1$位于长度为 1 的区间内，该区间通常包含自身，但问题允许$p_i$不是 length-1 间隔中的最大值。 这很重要，因为它改变了我们分配最大和最小数字的方式。 

## 方法

 暴力方法将尝试所有排列并检查至少长度的所有子数组$k$对于每个 1。这显然是不可行的：对于每个排列都有$n!$可能性，并检查所有间隔可能需要$O(n^2)$。 所以即使对于小$n$这太慢了。 

关键的观察结果是约束仅在 1 秒内起作用。 对于0，我们可以自由分配任何数字。 确保 1 永远不会是任何长度区间中的最大值$\ge k$包含它，我们可以分配所有 1 位置相对较小的数字和所有 0 位置相对较大的数字。 那么，在任意长度的区间内$k$或更多，总会有至少一个 0 的数字大于 1 位的数字，保证没有一个 1 是最大的。 

然而，有一个限制。 如果连续 1 的块的长度大于$k$，那么存在一个长度-$k$间隔完全在这个块内。 该区间内的所有数字都很小，因此最大值必然是 1 之一。 因此，我们必须检查最长的连续1s块是否小于$k$。 如果是，则可以进行有效分配。 否则的话，那是不可能的。 

这给出了一种建设性的方法：将最小的数字依次分配给 1，将最大的数字依次分配给 0。 我们可以简单地遍历字符串并填充数字列表。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n! * n^2) | O(n! * n^2) | O(n) | 太慢了|
 | 贪婪的建设性 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 迭代二进制字符串$s$并找出最长连续 1 段的长度。 如果这个长度是$\ge k$，输出“NO”，因为总会有一个长度-$k$1s 的间隔，其中之一为最大值。 
2. 如果最长的1s段小于$k$，输出“是”。 我们可以构造一个排列。 
3. 准备两个列表：一个用于分配给 1 的编号（从 1 开始向上），另一个用于分配给 0 的编号（从 1 开始）$n$向下）。 
4. 迭代$s$为了。 对于每个位置$i$， 如果$s_i = 1$，分配下一个最小的未使用的数字。 如果$s_i = 0$，分配下一个最大的未使用数字。 
5. 打印构建的排列。 

原理：通过将较小的数字分配给 1，将较大的数字分配给 0，任何长度的间隔至少$k$至少包含一个 0 的 0 数将大于 1 数，确保没有 1 是最大的。 因为最长的连续1s块小于$k$,任意长度的区间$k$or more 必须至少包含一个 0。因此，构造始终满足约束条件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, k = map(int, input().split())
    s = input().strip()
    
    # Step 1: check longest consecutive 1s
    max_ones = 0
    cur = 0
    for ch in s:
        if ch == '1':
            cur += 1
            max_ones = max(max_ones, cur)
        else:
            cur = 0
    
    if max_ones >= k:
        print("NO")
        continue
    
    # Step 2: construct permutation
    perm = [0] * n
    low = 1
    high = n
    for i, ch in enumerate(s):
        if ch == '1':
            perm[i] = low
            low += 1
        else:
            perm[i] = high
            high -= 1
    print("YES")
    print(' '.join(map(str, perm)))
```第一部分迭代字符串以查找最长的连续 1 块。 这是唯一不可能进行排列的点。 第二部分是构造性赋值：使用两个指针（低位和高位）确保所有数字仅使用一次，并且 1 获得最小的数字，而 0 获得最大的数字。 通过仔细初始化 low = 1 和 high = n，并在赋值后立即递增或递减，可以避免差一错误。 

## 工作示例

 ### 示例 1

 输入：```
4 3
0010
```| 我| s[i] | 最大个数 | 低| 高| 烫发[i] |
 | ---| ---| ---| ---| ---| ---|
 | 0 | 0 | 0 | 1 | 4 | 4 |
 | 1 | 0 | 0 | 1 | 3 | 3 |
 | 2 | 1 | 1 | 1 | 3 | 1 |
 | 3 | 0 | 0 | 2 | 2 | 2 |

 排列：`[4, 3, 1, 2]`。 覆盖位置 2 的任何长度 >= 3 的区间中的最大数字是 4、3 或 2，绝不会是 1。有效。 

### 示例 2

 输入：```
5 2
11011
```最长的连续1=2，等于k。 根据我们的检查，由于 max_ones >= k，输出为“NO”。 

这些痕迹证实该算法正确识别不可能的情况并在可行时构造排列。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n) | 单遍查找最长的 1 块并单遍构造排列 |
 | 空间| O(n) | 排列的存储 |

 总和为$n$在所有 ≤ 2e5 的测试用例中，总操作量明显低于 1e6，符合时间限制。 内存使用量在 256 MB 以内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call the solution
    t = int(input())
    for _ in range(t):
        n, k = map(int, input().split())
        s = input().strip()
        max_ones = 0
        cur = 0
        for ch in s:
            if ch == '1':
                cur += 1
                max_ones = max(max_ones, cur)
            else:
                cur = 0
        if max_ones >= k:
            print("NO")
            continue
        perm = [0] * n
        low = 1
        high = n
        for i, ch in enumerate(s):
            if ch == '1':
                perm[i] = low
                low += 1
            else:
                perm[i] = high
                high -= 1
        print("YES")
        print(' '.join(map(str, perm)))
    return output.getvalue().strip()

# Provided samples
assert run("6\n2 1\n00\n4 3\n0010\n5 2\n11011\n7 5\n1111110\n8 4\n00101011\n10 2\n1000000010\n") == \
"""YES
2 1
YES
4 3 1 2
NO
NO
YES
8 7 2 6 5 4
```
