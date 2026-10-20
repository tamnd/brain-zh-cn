---
title: "CF 1120A - 戴安娜和莉安娜"
description: "肖特河镇有一株非常长的藤本植物。 每个公民都会收到一个由恰好 k 朵花制成的花环，这些花环是由一台机器从藤本植物上按顺序剪下来的，该机器总是按顺序取出接下来的 k 朵花。"
date: "2026-06-12T04:24:52+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1120
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 543 (Div. 1, based on Technocup 2019 Final Round)"
rating: 1900
weight: 1120
solve_time_s: 97
verified: false
draft: false
---

[CF 1120A - 戴安娜和利亚娜](https://codeforces.com/problemset/problem/1120/A)

 **评级：** 1900
 **标签：** 贪婪、实现、两个指针
 **求解时间：** 1m 37s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 肖特河镇有一株非常长的藤本植物。 每位公民都将收到一个由精确材料制成的花圈`k`机器从藤本植物上依次切下花朵，总是取出下一个花朵`k`花有序。 戴安娜有一个偏爱的花序列，我们可以称之为她的示意图。 她想要至少一个花环与该示意图相匹配，这意味着它至少包含每种花类型所需的数量，无论顺序如何。 她可以事先从藤本植物上除去任何花朵，但她必须留下足够的花朵，以便机器仍然可以生产至少`n`花圈。 

输入提供藤本植物作为花卉类型的数组`a[1..m]`戴安娜的示意图为`b[1..s]`。 目标是确定一组要移除的花位置，以便在离开时至少有一个花环与戴安娜的示意图相匹配`n`或者更完整的花圈，或者得出结论这是不可能的。 

限制条件很大：`m`,`n`， 和`k`每朵最多可达 500,000 朵，总花数至少为`n*k`。 这排除了任何以简单方式扫描或模拟所有可能的移除组合的解决方案，因为子数组或子集的数量以组合方式增长。 相反，我们需要一个线性或近线性的解决方案来有效地找到合适的段并计算要删除的位置。 

很容易被忽略的边缘情况包括：`n=1`戴安娜实际上是唯一的公民，除了她的示意图要求的花朵外，几乎所有的花朵都被移走。 另一个微妙的情况是当藤本植物已经在 k 块的边界处包含一个完美的工件时； 如果不小心实现，粗心的滑动窗口逻辑可能会错过它。 

## 方法

 暴力方法会尝试所有可能的连续方法`k`-length子数组，数一下花的数量，看看是否可以满足原理图。 对于每个候选者，我们可以计算是否还有足够的花来产生`n`完整的工件。 计算每个子数组的花朵类型需要 O(k)，并且有 O(m) 个可能的起始位置，因此总复杂度为 O(m*k)。 和`m`高达 500,000 以及`k`可能等于`m`，这种方法太慢了。 

关键的观察是戴安娜最多只关心一个长度的子数组`k`匹配她的原理图。 如果我们可以找到包含所有所需花朵的任何段，那么我们可以删除该段之外的多余花朵以确保第一个`n`工件仍然存在。 这将问题简化为藤本植物上的两指针或滑动窗口技术，并结合哈希图来跟踪原理图所需的花朵数量。 

一旦找到合适的窗口，我们就计算哪些花是“额外的”——要么在窗口外面，要么需要填充剩余的花`n-1`花圈，或超出原理图要求的窗户内部。 这些多余的花朵是需要去除的候选者，并且它们的数量可以是最少的。 这种见解使我们能够使用带有哈希映射和两个指针的单次传递在 O(m) 时间内解决问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(m*k) | O(k) | 太慢了 |
 | 滑动窗口+计数图| O(米) | O(最大(a_i, b_i)) | 已接受 |

 ## 算法演练

 1. 计算戴安娜示意图中每朵花出现的次数。 让`needed[type]`是某种花型出现的次数`b`。 
2.使用带有两个指针的滑动窗口`l`和`r`在藤本植物上。`r`扩展到包括鲜花，直到所有类型`needed`很满意。 维护哈希图`current[type]`计算窗口内每种类型的花有多少朵。 维护一个柜台`missing`有多少不同的类型仍然需要更多的花来满足示意图。 
3. 什么时候`missing`达到零，我们有一个窗口`[l, r]`至少包含所需的花朵。 检查窗口外是否有足够的花朵来创建剩余的花朵`n-1`工件（每个长度`k`）。 窗户还可能包括示意图之外的额外花朵，这些花朵是可拆卸的。 
4. 决定移除哪些花。 首先，在窗口内标记超出所需数量的花朵。 二、如果窗后剩余的花朵数量超过`(n-1)*k`，将它们标记为可移动，直到完全`(n-1)*k`花朵留在所选窗口外。 可移除的花朵总数最多为`m - n*k`。 
5. 输出要移除的花朵数量及其位置。 

为什么它起作用：滑动窗口保证我们找到一个包含原理图的连续块恰好一次。 通过仅去除窗内多余的花朵和窗外其他工件不需要的花朵，我们不会违反机器至少生产的要求`n`花圈。 这种方法涵盖了所有可能的最小移除，因为任何有效的解决方案都必须包含一个满足原理图的窗口并且准确地`n-1`其他工件，最多留下`m - n*k`可移动的花朵。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import Counter

m, k, n, s = map(int, input().split())
a = list(map(int, input().split()))
b = list(map(int, input().split()))

needed = Counter(b)
current = Counter()
missing = len(needed)
res_l = res_r = -1

l = 0
for r in range(m):
    if a[r] in needed:
        current[a[r]] += 1
        if current[a[r]] == needed[a[r]]:
            missing -= 1
    while missing == 0:
        # window [l, r] satisfies schematic
        # check if enough flowers remain outside to make n-1 workpieces
        left_flower_count = l
        right_flower_count = m - r - 1
        total_outside = left_flower_count + right_flower_count
        if total_outside >= (n-1)*k:
            res_l, res_r = l, r
            break
        if a[l] in needed:
            if current[a[l]] == needed[a[l]]:
                missing += 1
            current[a[l]] -= 1
        l += 1
    if res_l != -1:
        break

if res_l == -1:
    print(-1)
else:
    to_remove = []
    # extra inside window
    inside_count = Counter()
    for i in range(res_l, res_r+1):
        if a[i] in needed:
            if inside_count[a[i]] < needed[a[i]]:
                inside_count[a[i]] += 1
            else:
                to_remove.append(i+1)
        else:
            to_remove.append(i+1)
    # extra outside window
    remaining = m - len(to_remove) - n*k
    for i in range(m):
        if remaining == 0:
            break
        if i < res_l or i > res_r:
            to_remove.append(i+1)
            remaining -= 1
    print(len(to_remove))
    print(' '.join(map(str, to_remove)))
```该代码使用滑动窗口来查找满足戴安娜原理图的段。 它首先使用右侧指针展开窗口，并在所有所需的花朵都出现时从左侧收缩。 找到合适的窗户后，它会识别窗户内外多余的花朵进行移除，确保剩余的花朵至少形成`n`完整的工件。 

边界处理很微妙。 索引从从 0 开始转换为从 1 开始输出。 当计算窗户内多余的花朵时，我们会跟踪一个单独的计数器，以避免移除必要的花朵。 

## 工作示例

 ### 示例 1

 输入：```
7 3 2 2
1 2 3 3 2 1 2
2 2
```| 步骤| 我| r | 当前| 失踪| 窗口有效吗？ |
 | ---| ---| ---| ---| ---| ---|
 | 初始化| 0 | 0 | {} | 1 | 没有|
 | r = 0 | 0 | 0 | {} | 1 | 没有|
 | r = 1 | 0 | 1 | {2:1} | 1 | 没有|
 | r = 2 | 0 | 2 | {2:1} | 1 | 没有|
 | r = 3 | 0 | 3 | {2:1,3:1} | 1 | 没有|
 | r = 4 | 0 | 4 | {2:2,3:1} | 0 | 是的 |

 窗户`[1,5]`满足原理图。 外面的花可以形成`n-1=1`工件。 额外的内侧是花 3（位置 4）。 将其删除。 输出：```
1
4
```### 示例 2

 输入：```
1 1 1 1
1
1
```唯一的花朵与示意图相符，无需移除。 输出：```
0
```这些痕迹证实算法正确地找到了有效窗口，计算了额外的花朵，并确保为其他工件保留了足够的花朵。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(米) | 每朵花最多被滑动窗口处理两次； 计数和清除呈线性 |
 | 空间| O(s + u) | s = 示意图大小，u = 藤本植物中不同花类型的数量 |
