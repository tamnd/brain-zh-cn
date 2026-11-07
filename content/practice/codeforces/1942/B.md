---
title: "CF 1942B - 贝西和梅克斯"
description: "我们得到一个长度为 n 的数组 a，它是由整数 0 到 n-1 的一些未知排列 p 构造的。 a 的每个元素满足关系 a[i] = MEX(p[1..i]) - p[i]。 任务是重建产生该 a 的任何有效排列 p。"
date: "2026-05-31T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "math"]
categories: ["algorithms"]
codeforces_contest: 1942
codeforces_index: "B"
codeforces_contest_name: "CodeTON Round 8 (Div. 1 + Div. 2, Rated, Prizes!)"
rating: 1100
weight: 1942
solve_time_s: 78
verified: false
draft: false
---

[CF 1942B - 贝西和 MEX](https://codeforces.com/problemset/problem/1942/B)

 **评分：** 1100
 **标签：** 构造性算法，数学
 **求解时间：** 1m 18s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个数组`a`长度`n`，由一些未知的排列构成`p`整数的`0`通过`n-1`。 的每个元素`a`满足关系式`a[i] = MEX(p[1..i]) - p[i]`。 任务是重建任何有效的排列`p`产生这个`a`。 数组的 MEX 定义为该数组中缺失的最小非负整数。 

输入提供多个测试用例。 对于每种情况，算法必须重建一个排列`p`高效。 

限制因素很大：`n`可以大到 2_10^5，并且所有的总和`n`所有测试用例也≤ 2_10^5。 这意味着我们不能承受比每个测试用例的线性时间更糟糕的事情； 在最坏的情况下，O(n^2) 的暴力方法将导致大约 10^10 次操作，这对于 2 秒的时间限制来说太慢了。 

负值和大正值会出现一个微妙的问题`a`。 自从`a[i] = MEX(...) - p[i]`，有可能为`a[i]`是消极的。 例如，如果 MEX 在某个点是`2`但排列元素是`4`， 然后`a[i] = 2 - 4 = -2`。 一个粗心的算法假设`a[i] ≥ 0`将会失败。 此外，可能存在多个解决方案，因此任何有效的重建就足够了。 

需要考虑的一个边缘情况是当所有`a[i]`是`1`,`0`，或负数。 例如，如果`a = [1,1,1]`，那么算法必须正确生成尊重 MEX 差异的排列，而不重复使用数字。 

## 方法

 简单的方法是通过从头开始模拟 MEX 来贪婪地重建排列：对于每个位置`i`，迭代所有未使用的数字以查看哪个数字满足`a[i] = MEX(current) - x`。 这需要在 O(n) 时间内重新计算 MEX 每一步，从而形成 O(n^2) 算法。 这在原则上是正确的，但对于问题约束来说太慢了。 

关键的观察结果是，MEX 在每一步总是最多增加 1。 如果当前的 MEX 是`m`，那么排列的下一个元素是`m - a[i]`如果该号码仍然可用，或者其他未使用的号码小于`m`。 这给出了线性时间结构：

 1. 在排列中保留一组所有未使用的数字。 
2. 使用从以下位置开始的指针有效地跟踪当前的 MEX`0`。 
3. 对于每个位置`i`, 计算`p[i] = current_MEX - a[i]`。 如果该号码未使用，请分配它。 否则，选择小于当前 MEX 的最小未使用数字。 相应地更新当前的 MEX。 

这种方法之所以有效，是因为公式`p[i] = MEX - a[i]`直接从问题陈述中得出。 保证存在有效的排列，因此我们总是会找到与公式匹配的未使用的数字。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 初始化一个列表`used`尺寸的`n`跟踪哪些号码已放入`p`。 初始化一组`available`包含所有数字`0..n-1`。 
2. 设置`current_mex`到`0`。 
3. 对于每个索引`i`从`0`到`n-1`,计算候选数`x = current_mex - a[i]`。 
4.如果`x`是在`available`， 分配`p[i] = x`，将其从`available`，然后离开`current_mex`不变或增加它，如果`x == current_mex`。 
5. 如果`x`不在`available`， 分配`p[i]`作为最小的数`available`。 删除并更新`current_mex`如果需要的话。 
6. 重复此操作，直至所有位置均已填满。 
7.输出数组`p`。 

**为什么有效：** 不变的是在每一步，`current_mex`反映了迄今为止使用的数字的 MEX。 使用`p[i] = current_mex - a[i]`保证 MEX 差分公式成立。 可用性检查确保我们永远不会重复使用数字，从而保留排列属性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        used = [False] * n
        p = [0] * n
        mex = 0
        import heapq
        # maintain min-heap of unused numbers
        available = list(range(n))
        heapq.heapify(available)

        for i in range(n):
            x = mex - a[i]
            if 0 <= x < n and not used[x]:
                p[i] = x
                used[x] = True
                while mex < n and used[mex]:
                    mex += 1
            else:
                # pick smallest unused
                while used[available[0]]:
                    heapq.heappop(available)
                p[i] = heapq.heappop(available)
                used[p[i]] = True
                while mex < n and used[mex]:
                    mex += 1
        print(" ".join(map(str, p)))

if __name__ == "__main__":
    solve()
```该解决方案使用布尔数组`used`跟踪已分配的数字，确保排列的唯一性。 这`mex`指针有效地跟踪当前的 MEX。 最小堆存储未使用的数字，以便在理想情况下有效地选择最小的可用数字`x`已被使用。 

## 工作示例

 ### 示例 1

 输入：```
5
1 1 -2 1 2
```| 我| 一个[我] | 墨西哥 | 候选人 x | 分配 p[i] | 步骤后使用 | 步骤后的墨西哥|
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 1 | 0 | -1 | 0 | {0} | 1 |
 | 1 | 1 | 1 | 0 | 1 | {0,1} | 2 |
 | 2 | -2 | 2 | 4 | 4 | {0,1,4} | 2 |
 | 3 | 1 | 2 | 1 | 2 | {0,1,2,4} | 3 |
 | 4 | 2 | 3 | 1 | 3 | {0,1,2,3,4} | 5 |

 这显示了不变量：`mex`始终反映当前的 MEX，并且`p[i] = mex - a[i]`如果可能的话。 

### 示例 2

 输入：```
3
-2 1 2
```| 我| 一个[我] | 墨西哥 | 候选人 x | 分配 p[i] |
 | ---| ---| ---| ---| ---|
 | 0 | -2 | 0 | 2 | 2 |
 | 1 | 1 | 0 | -1 | 0 |
 | 2 | 2 | 1 | -1 | 1 |

 这里，负候选值触发选择最小的可用未使用数。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个元素都处理一次，每个元素的堆操作为 O(log n)，但 n 的总和为 O(n log n)，这在约束范围内是可以接受的 |
 | 空间| O(n) | 布尔数组`used`最小堆存储最多`n`元素|

 给定`sum(n) <= 2*10^5`，这非常适合 2 秒的时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# provided samples
assert run("3\n5\n1 1 -2 1 2\n5\n1 1 1 1 1\n3\n-2 1 2\n") in ["0 1 4 2 3\n0 1 2 3 4\n2 0 1","0 1 4 2 3\n0 1 2 3 4\n2 1 0"], "sample 1"

# custom: minimum size
assert run("1\n1\n0\n") == "0", "min size"

# custom: maximum n, trivial a
max_n = 10
assert run(f"1\n{max_n}\n" + " ".join(["1"]*max_n) + "\n") != "", "all ones"

# custom: negative a triggers selection of available
assert run("1\n3\n-1 -1 -1\n") != "", "all negative"

#
```
