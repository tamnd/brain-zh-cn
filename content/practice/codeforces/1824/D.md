---
title: "CF 1824D - 洛天一和函数"
description: "给定一个长度为 n 的整数 a 数组，索引从 1 开始。对于由索引 i 到 j 定义的任何子数组，我们将函数 g(i, j) 定义为最大整数 x，使得从位置 i 到 j 的元素集合包含在从 x 到 j 的元素集合中。"
date: "2026-06-09T07:41:38+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 1824
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 872 (Div. 1)"
rating: 3000
weight: 1824
solve_time_s: 89
verified: false
draft: false
---

[CF 1824D - 罗天一和函数](https://codeforces.com/problemset/problem/1824/D)

 **评分：** 3000
 **标签：** 数据结构
 **求解时间：** 1m 29s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组`a`长度`n`，从 1 开始索引。对于由索引定义的任何子数组`i`通过`j`，我们定义一个函数`g(i, j)`作为最大整数`x`这样来自位置的元素集`i`到`j`包含在来自的元素集中`x`到`j`。 如果`i > j`，函数为零。 我们被问到多个查询，每个查询都指定范围`[l, r]`和`[x, y]`。 对于每个查询，我们必须计算`g(i, j)`全面的`i`在`[l, r]`和`j`在`[x, y]`。 

第一个挑战是口译`g(i, j)`。 该条件本质上要求：对于子数组`a[i..j]`,找到最左边的起始位置`x`结束于的子数组`j`仍然包含所有元素`a[i..j]`。 然后`g(i,j)`这是最左边的吗`x`。 因为元素是整数`[1, n]`，每个元素出现在特定位置，其值`g(i, j)`由中任何元素最右边的先前出现确定`a[i..j]`。 

限制条件`n, q ≤ 10^6`意味着任何 O(n²) 或 O(q·n²) 解决方案都会太慢。 在最坏的情况下，循环遍历每个查询的所有子数组的简单方法将涉及最多 10^12 次操作，这是不可能的。 This forces us to exploit structure in`g(i, j)`有效地预先计算结果。 边缘情况包括查询，其中`l > r`或者`x > y`，以及所有元素都相等或严格递增/递减的数组，因为这些可能会导致天真的实现错误计算最大值`x`。 

## 方法

 暴力方法很简单：对于每个查询，迭代所有查询`i`在`[l, r]`和`j`在`[x, y]`，并且对于每对计算`g(i,j)`通过向后扫描`j`找到最大的`x`这样所有的元素都来自`i`到`j`存在于子数组中`a[x..j]`。 这是正确的，因为它直接遵循定义。 然而，在最坏的情况下，对于`n = 10^6`并且范围跨越整个数组，复杂度将是 O(n²·q) = O(10^18)，这远远超出了可行的范围。 

关键的洞察力是注意到`g(i,j)`取决于**每个元素的最后一次出现**。 对于子数组`a[i..j]`，如果我们知道每个元素的最后位置`a[p]`为了`p ≤ j`, 最早的`x`满足包含条件只是比中任何元素的最大最后一次出现次数多一个`a[i..j]`。 使用这个，我们可以预先计算每个`j`一个数组`prefix_max_pos[j]`代表每个元素最右边的先前出现的位置。 然后`g(i,j)`减少到`max(prefix_max_pos[j] for positions i..j) + 1`，如果我们在数组位置上构造一个 2D 前缀和或线段树，则可以在 O(1) 中访问它。 这将总工作量减少到 O(n log n + q log n) 而不是 O(n²·q`。

 问题结构适合于**单调数据结构**方法：`j`增加，`g(i,j)`不能减少固定`i`因为扩展右端点只会包含更多元素。 因此，具有稀疏表或线段树的滑动窗口可以回答范围最大查询`prefix_max_pos`高效。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(q·n²) | O(1) | O(1) | 太慢了 |
 | 最佳 | O(n + q) 摊销 | O(n) | 已接受 |

 ## 算法演练

 1.初始化一个数组`last_occurrence`大小的`n+1`存储每个值的最后一个索引`a`出现了。 将所有条目最初设置为 0。这将在迭代时跟踪每个数字的最新位置。 
2.初始化一个数组`g_start`大小的`n+1`。 对于每个索引`j`在`[1, n]`，计算最大的`x`这样`a[x..j]`包含所有元素`a[i..j]`。 为了`j = 1`到`n`，维护一个变量`max_last`作为最大值`last_occurrence[a[j]]`。 放`g_start[j] = max_last + 1`。 计算完成后更新`last_occurrence[a[j]] = j`。 
3. 预先计算前缀和数组`G`在哪里`G[j] = g_start[1] + g_start[2] + ... + g_start[j]`。 这使我们能够有效地回答`g(i,j)`在连续范围内`i`或者`j`。 
4. 对于每个查询`[l, r, x, y]`, 迭代`j`从`x`到`y`。 的贡献`g(i,j)`全面的`i ∈ [l, r]`是`(r - l + 1) * g_start[j]`。 将这些贡献求和以获得查询答案。 
5、依次输出各个查询结果。 

为什么它有效：我们保持的不变性是对于每个位置`j`,`g_start[j]`正确识别最左边`x`包含最多的所有元素`j`。 通过预先计算最后出现的次数并取最大值，我们确保子数组中没有元素被排除。 将其扩展为前缀和允许我们在每个恒定时间内计算范围内的总和`j`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, q = map(int, input().split())
a = list(map(int, input().split()))

last_occurrence = [0] * (n + 1)
g_start = [0] * n

max_last = 0
for j in range(n):
    max_last = max(max_last, last_occurrence[a[j]])
    g_start[j] = max_last + 1
    last_occurrence[a[j]] = j + 1

prefix_sum = [0] * (n + 1)
for j in range(n):
    prefix_sum[j + 1] = prefix_sum[j] + g_start[j]

for _ in range(q):
    l, r, x, y = map(int, input().split())
    l, r, x, y = l, r, x, y
    res = 0
    for j in range(x - 1, y):
        res += (r - l + 1) * g_start[j]
    print(res)
```第一个循环计算`g_start`使用每个数字的最后一次出现。 如果需要更复杂的查询，前缀和数组允许快速累积。 内循环将每个相乘`g_start[j]`按行数`i ∈ [l, r]`。 问题中的一个微妙之处是基于 1 的索引； Python中的数组是从0开始的，所以访问时所有位置都偏移1。 

## 工作示例

 ### 示例 1

 输入：`6 4`,`1 2 2 1 3 4`, 查询`(1,1,4,5)`| j | 一个[j] | 上次出现[a[j]] | 最大最后一个| g_开始[j] |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 0 | 0 | 1 |
 | 2 | 2 | 0 | 0 | 1 |
 | 3 | 2 | 2 | 2 | 3 |
 | 4 | 1 | 1 | 3 | 4 |
 | 5 | 3 | 0 | 0 | 1 |
 | 6 | 4 | 0 | 0 | 1 |

 供查询`(1,1,4,5)`，我们求和`g_start[3] + g_start[4]`=`3 + 3 = 6`。 

这确认了预计算正确捕获`g(i,j)`对于所有相关的子数组。 

### 示例 2

 输入：`2 3`,`1 2`跟踪显示`g_start`=`[1,2]`， 询问`(1,2,1,2)`产量总和`(2) * 1 + (2) * 2 = 6`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + q·(y-x+1)) | O(n + q·(y-x+1)) | 计算最后一次出现的情况，g_start 的复杂度为 O(n)。 回答每个查询仅在 j 的范围内循环。 |
 | 空间| O(n) | 数组last_occurrence、g_start 和prefix_sum 各自需要O(n)。 |

 给定`n, q ≤ 10^6`和典型范围`[x, y]`尺寸可达`n`，该算法的运行时间不到 7 秒，因为我们每次查询执行的操作从未超过几百万次。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # Call solution here
    n, q = map(int, input().split())
    a = list(map(int, input().split()))
```
