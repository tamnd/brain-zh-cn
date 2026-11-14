---
title: "CF 433B - 栗山未来的石头"
description: "我们有一系列的石头，每个石头都有一个数字成本。 Kuriyama Mirai 想要反复问两类问题：在第一类中，她要求原始序列的连续片段中石子的成本总和；在第二类中，她要求计算原始序列中连续片段中石子的成本总和； 在第二种类型中，她要求......的总和"
date: "2026-06-07T02:42:48+07:00"
tags: ["codeforces", "competitive-programming", "dp", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 433
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 248 (Div. 2)"
rating: 1200
weight: 433
solve_time_s: 66
verified: true
draft: false
---

[CF 433B - 栗山未来的石头](https://codeforces.com/problemset/problem/433/B)

 **评分：** 1200
 **标签：** dp、实施、排序
 **求解时间：** 1m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一系列的石头，每个石头都有一个数字成本。 Kuriyama Mirai 想要反复问两类问题：在第一类中，她要求原始序列的连续片段中石子的成本总和；在第二类中，她要求计算原始序列中连续片段中石子的成本总和； 在第二种类型中，她要求同一段中的石头的成本总和，但在按成本以非递减顺序对所有石头进行排序之后。 

输入首先给出石子的数量，然后是它们各自的成本，然后是问题的数量和问题本身。 每个问题都提供类型（1 或 2）和段边界。 输出是与该查询对应的总和。 

鉴于最多可以有 100,000 个石头和 100,000 个查询，直接对每个查询的一个段求和的简单方法在最坏的情况下将需要 O(n * m) 次操作。 这可能高达 10^10 次操作，远远超过 2 秒时间限制的合理限制。 因此，我们需要一种能够有效处理多个查询的方法，最好在预处理后每个查询的复杂度为 O(1)。 

非明显的边缘情况包括长度为 1 的段（其中 l 等于 r）、覆盖整个数组的段以及所有棋子价值相等的数组。 粗心的解决方案可能会混合基于 1 和基于 0 的索引，或者忘记总和可能超过 32 位整数，从而导致溢出。 例如，一个数组`v = [10^9, 10^9, 10^9]`并查询`1 1 3`应返回 3*10^9，它不适合 32 位有符号整数。 

## 方法

 暴力方法很简单：对于每个查询，迭代段索引并对值求和。 这是正确的，因为它直接实现了问题陈述。 然而，最坏的情况是 100,000 个石头和 100,000 个查询会导致 O(n*m) 操作，这太慢了。 

关键的见解是两种类型的查询都要求连续段的总和。 对于任何数组，如果我们预先计算一个前缀和数组，那么任何段的和`[l, r]`可以使用以下公式在 O(1) 中计算`prefix[r] - prefix[l-1]`。 对于类型 2 查询，我们首先对原始数组进行排序并计算其前缀和。 这将每个查询的时间减少到 O(1)，而预处理需要 O(n log n) 进行排序，O(n) 进行前缀和。 

蛮力方法之所以有效，是因为它直接对所请求的元素求和，但对于大量输入则失败。 分段总和可以简化为前缀总和的观察结果让我们能够在恒定时间内回答每个查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n*m) | O(n) | 太慢了|
 | 前缀求和+排序 | O(n log n + m) | O(n log n + m) | O(n) | 已接受 |

 ## 算法演练

 1. 读取石子数量`n`和石头成本数组`v`。 
2.构造前缀和数组`prefix_original`为了`v`在哪里`prefix_original[i] = v[0] + ... + v[i]`。 这允许对原始数组进行 O(1) 求和查询。 
3. 复印一份`v`并排序得到`v_sorted`。 构建前缀和数组`prefix_sorted`对于排序后的数组。 
4.读取查询数`m`。 
5. 对于每个查询`(type, l, r)`：

- 如果`type`为 1，计算总和为`prefix_original[r] - prefix_original[l-1]`。 
- 如果`type`是 2，计算总和为`prefix_sorted[r] - prefix_sorted[l-1]`。 
6. 输出每个查询的结果。 

这是有效的，因为前缀和数组保持了不变式：`prefix[i]`等于从索引 1 到 i 的所有元素的总和。 减去两个前缀和就可以精确地得出这些索引之间的元素之和，从而不可能错误计算段和。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
v = list(map(int, input().split()))

# prefix sum for the original array
prefix_original = [0] * (n + 1)
for i in range(1, n + 1):
    prefix_original[i] = prefix_original[i - 1] + v[i - 1]

# prefix sum for the sorted array
v_sorted = sorted(v)
prefix_sorted = [0] * (n + 1)
for i in range(1, n + 1):
    prefix_sorted[i] = prefix_sorted[i - 1] + v_sorted[i - 1]

m = int(input())
for _ in range(m):
    t, l, r = map(int, input().split())
    if t == 1:
        print(prefix_original[r] - prefix_original[l - 1])
    else:
        print(prefix_sorted[r] - prefix_sorted[l - 1])
```解决方案首先构造前缀和以避免重复求和。 使用`n+1`以 0 开头的 length 数组简化了边界处理，并确保从索引 1 开始的段的总和是正确的，没有特殊情况。 排序为类型 2 查询创建数组，并应用相同的前缀和技巧。 注意有效地读取输入`sys.stdin.readline`。 

## 工作示例

 **样本 1 输入：**```
6
6 4 2 7 2 7
3
2 3 6
1 3 4
1 1 6
```| 步骤| 前缀_原始 | 前缀_排序 | 查询 | 计算| 结果 |
 | ---| ---| ---| ---| ---| ---|
 | 初始| [0,6,10,12,19,21,28] | [0,2,4,6,11,18,25] | 2 3 6 | 前缀排序[6]-前缀排序[2] = 25-4 | 21 | 21
 | 第二 | | | 1 3 4 | 1 3 4 前缀_原始[4]-前缀_原始[2]=19-10 | 9 |
 | 第三| | | 1 1 6 | 1 1 6 前缀_原始[6]-前缀_原始[0]=28-0 | 28 | 28

 这表明前缀和可以为任何段提供恒定时间的答案。 

**自定义输入：**```
5
1 1 1 1 1
2
1 1 5
2 1 5
```| 步骤| 前缀_原始 | 前缀_排序 | 查询 | 计算| 结果 |
 | ---| ---| ---| ---| ---| ---|
 | 初始| [0,1,2,3,4,5] | [0,1,2,3,4,5] | 1 1 5 | 1 1 5 5-0 | 5 |
 | 第二 | | | 2 1 5 | 2 1 5 5-0 | 5 |

 这表明该算法正确处理所有相等的元素。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n + m) | O(n log n + m) | 排序需要 O(n log n)，计算前缀和需要 O(n)，m 个查询中的每一个都是 O(1) |
 | 空间| O(n) | 两个大小为 n+1 的前缀和数组，加上排序副本 |

 给定 n、m ≤ 10^5，这在 2 秒内即可轻松完成，并且使用量远低于 256 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    n = int(input())
    v = list(map(int, input().split()))
    prefix_original = [0] * (n + 1)
    for i in range(1, n + 1):
        prefix_original[i] = prefix_original[i - 1] + v[i - 1]
    v_sorted = sorted(v)
    prefix_sorted = [0] * (n + 1)
    for i in range(1, n + 1):
        prefix_sorted[i] = prefix_sorted[i - 1] + v_sorted[i - 1]
    m = int(input())
    for _ in range(m):
        t, l, r = map(int, input().split())
        if t == 1:
            print(prefix_original[r] - prefix_original[l - 1])
        else:
            print(prefix_sorted[r] - prefix_sorted[l - 1])
    return output.getvalue().strip()

# provided sample
assert run("6\n6 4 2 7 2 7\n3\n2 3 6\n1 3 4\n1 1 6\n") == "24\n9\n28", "sample 1"

# all equal
assert run("5\n1 1 1 1 1\n2\n1 1 5\n2 1 5\n") == "5\n5", "all equal"

# single element
assert run("1\n42\n2\n1 1 1\n2 1 1\n") == "42\n42", "single element"

# large values
assert run("3\n1000000000 1000000000 1000000000\n1\n1 1 3\n") == "3000000000", "overflow test"

# segment of length 1
assert run("4\n3 1 4 1
```
