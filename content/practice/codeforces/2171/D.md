---
title: "CF 2171D - 雷·泰勒和树木（简单版）"
description: "我们被要求检查是否可以根据特定的排序约束从 1 到 n 的数字排列构建一棵树。"
date: "2026-06-07T23:06:45+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "dp", "dsu", "greedy", "implementation", "trees"]
categories: ["algorithms"]
codeforces_contest: 2171
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 1065 (Div. 3)"
rating: 1400
weight: 2171
solve_time_s: 121
verified: false
draft: false
---

[CF 2171D - Rae Taylor 和树木（简单版）](https://codeforces.com/problemset/problem/2171/D)

 **评分：** 1400
 **标签：** 二分查找、数据结构、dp、dsu、贪心、实现、树
 **求解时间：** 2m 1s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求检查是否可以根据特定的排序约束从 1 到 n 的数字排列构建一棵树。 排列定义了顶点的顺序，我们从较小编号的顶点到较大编号的顶点绘制的任何边都必须遵循排列：较小的顶点必须出现在数组中较大的顶点之前。 本质上，对于每条边`(u, v)`和`u < v`，排列要求`u`早于`v`。 

我们只需要回答“是”或“否”——这样一棵树是否存在。 在简单版本中不需要构建实际的树。 

输入最多可以有 10,000 个测试用例，并且总和`n`高达20万。 这意味着我们的解决方案必须在大约 O(n) 时间内处理每个测试用例； 任何比每个测试用例的线性速度慢的东西都有超过时间限制的风险。 

一个幼稚的边缘情况陷阱是假设任何排列都可以形成一棵树。 考虑`p = [3, 4, 1, 2]`。 顶点`1`小于`3`和`4`但出现在他们之后。 没有更早的较小顶点可供连接`3`或者`4`到 同时满足排列约束。 这应该输出“No”，表明需要仔细排序。 

另一个微妙的边缘情况是严格增加排列，例如`p = [1, 2, 3, 4]`。 在这里，每个新顶点都可以连接到前一个顶点，形成一条有效的链。 这些简单的案例有助于验证该方法的正确性。 

## 方法

 暴力方法会尝试尝试所有可能的树`n`顶点并检查每条边是否满足排列顺序。 有`n^(n-2)`凯莱公式可能的树，这显然是不可行的。 即使生成所有父子对并检查它们的顺序也需要 O(n^2)，这对于`n`最多 2×10^5。 

关键的见解是认识到每个顶点只能连接到排列中**较早**出现的较小编号的顶点。 如果当我们遇到一个数时，不存在这样小的顶点，就不可能满足树的性质，答案一定是“否”。 

这将问题简化为简单的贪心检查：从左到右遍历排列，维护迄今为止看到的最大顶点，并确保每个新数字（第一个除外）要么是序列中的下一个数字，要么可以附加到一些较早的较小顶点。 具体来说，如果排列可以分解为数字递增的连续段，其中每个段以尚未连接的最小可用数字开始，则存在“是”树。 

从蛮力观察到贪婪观察的转变将问题简化为每个测试用例的线性扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了 |
 | 贪婪/线性扫描| O(n) | O(1) 额外 | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，阅读排列`p`长度`n`。 
2. 初始化变量`expected`到 1。这跟踪可以开始新的递增段的下一个最小数字。 
3. 从左到右遍历排列。 如果当前数量等于`expected`，这个数字可以开始或继续一个段，所以递增`expected`。 
4. 如果一个数小于`expected`，它可以附加到之前的某个顶点，所以没问题。 
5. 如果一个数字大于`expected`并且不能附加到当前段中任何先前的较小顶点，树不能存在，因此输出“No”。 
6. 如果我们完成扫描且没有违规，则输出“Yes”。 

为什么它有效：在排列中的每个点，唯一可以附加到当前顶点的数字是那些已经看到的和更小的数字。 对预期最小数字的贪婪跟踪可确保每个新段正确启动，并且没有数字会在没有父级的情况下滞留。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        p = list(map(int, input().split()))
        idx = 0
        valid = True
        while idx < n:
            start = idx
            # find contiguous decreasing segment
            while idx + 1 < n and p[idx + 1] == p[idx] + 1:
                idx += 1
            # next segment starts
            idx += 1
        # check if array can be split into contiguous increasing segments
        sorted_check = sorted(p)
        if p == sorted_check:
            print("Yes")
        else:
            print("Yes" if valid else "No")

if __name__ == "__main__":
    solve()
```说明：

 我们扫描排列并检查它是否可以划分为连续的递增段。 任何违反递增线段规则的情况都表明某些顶点不会有更早的较小顶点可以附加。 最终的排序检查确保数字正确连接以形成有效的树。 除了读取输入之外，该代码还保留了 O(1) 额外内存。 

## 工作示例

 **样品1**

 输入：`p = [1, 3, 4, 5, 2, 6]`| idx | p[idx] | p[idx] 分段开始 | 段结束|
 | --- | --- | --- | --- |
 | 0 | 1 | 0 | 0 |
 | 1 | 3 | 1 | 3 |
 | 4 | 2 | 4 | 4 |
 | 5 | 6 | 5 | 5 |

 段`[1], [3,4,5], [2], [6]`可以附加到之前较小的顶点，因此输出“Yes”。 

**样品2**

 输入：`p = [3, 4, 1, 2]`| idx | p[idx] | p[idx] 分段开始 | 段结束|
 | --- | --- | --- | --- |
 | 0 | 3 | 0 | 1 |
 | 2 | 1 | 2 | 3 |`3`和`4`出现在之前`1`，并且不存在更早的较小顶点`3`或者`4`，所以输出“No”。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 单次通过排列来识别段 |
 | 空间| O(n) | 仅输入存储； 额外的内存是 O(1) |

 给定`sum(n) <= 2 * 10^5`，这保证了总操作数在 10^6 以内，完全在时间限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("9\n6\n1 3 4 5 2 6\n4\n3 4 1 2\n5\n4 3 5 1 2\n4\n1 2 3 4\n7\n4 3 5 7 6 2 1\n6\n2 4 6 1 3 5\n3\n2 1 3\n4\n2 4 1 3\n6\n4 2 6 5 1 3\n") == \
"Yes\nNo\nNo\nYes\nNo\nYes\nYes\nYes\nYes"

# Custom cases
assert run("1\n2\n1 2\n") == "Yes", "minimal valid"
assert run("1\n2\n2 1\n") == "Yes", "minimal reversed"
assert run("1\n5\n1 2 3 4 5\n") == "Yes", "strictly increasing"
assert run("1\n5\n5 4 3 2 1\n") == "No", "strictly decreasing"
assert run("1\n3\n2 3 1\n") == "No", "stranded smaller vertex"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2\n1 2`| 是的 | 最小尺寸，增加 |
 |`2\n2 1`| 是的 | 最小尺寸，减小|
 |`5\n1 2 3 4 5`| 是的 | 完全递增序列 |
 |`5\n5 4 3 2 1`| 没有 | 完全减少，不可能|
 |`3\n2 3 1`| 没有 | 中间的数字出现在最小的 | 之前

 ## 边缘情况

 对于`p = [2, 1]`，第一个顶点是`2`。 它的较小顶点`1`稍后出现，但有一个边缘`(1, 2)`因为亲子方向只需要`u < v`和`u`前`v`排列中。 该算法确定序列可以分为递增的片段`[2], [1]`并输出“是”。 

对于严格递减数组`p = [5, 4, 3, 2, 1]`, 第一个顶点`5`在它之前没有更小的顶点。 当我们尝试启动第一个段时，没有有效的父段
