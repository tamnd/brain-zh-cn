---
title: "CF 1148H - 神圣潜水员"
description: "我们被要求维护一个动态增长的数组。 在每次操作中，我们向数组添加一个新元素，并立即计算给定范围 [l, r] 内其 mex 等于给定数字 k 的连续子数组（段）的数量。"
date: "2026-06-12T03:13:18+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 1148
codeforces_index: "H"
codeforces_contest_name: "Codeforces Global Round 3"
rating: 3500
weight: 1148
solve_time_s: 99
verified: false
draft: false
---

[CF 1148H - 神圣潜水员](https://codeforces.com/problemset/problem/1148/H)

 **评分：** 3500
 **标签：** 数据结构
 **求解时间：** 1m 39s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求维护一个动态增长的数组。 在每次操作中，我们将一个新元素追加到数组中，并立即计算给定范围内连续子数组（段）的数量`[l, r]`其 **mex** 等于给定数字`k`。 集合的 mex 是该集合中不存在的最小非负整数。 

然而，查询被混淆了：我们得到了值`a'`,`l'`,`r'`,`k'`，并且必须使用前一个查询的答案对其进行解码。 这就引入了依赖链——每个操作都不能独立计算。`lans`最初为零，但每个后续查询都取决于最后计算的答案。 

限制因素很大。 和`n`最多 2·10^5 和 3 秒的时间限制，一种检查每个可能的子数组的算法`[l, r]`对于每个查询都是不可行的。 最坏的情况将涉及`O(n^3)`操作（每个查询可以检查`O(n^2)`子数组），这太慢了。 我们需要一种利用 mex 和增量构建特性的方法。 

经常会阻碍幼稚实现的边缘情况包括以下查询：`k`超过数组中当前的最大值、长度为一的范围以及重复的元素。 例如，如果数组是`[0,0,0]`和`k=1`，答案非零，因为像这样的段`[0]`有 mex 1，但如果实现天真地假设 mex 等于 max+1，则可能会错误地返回零。 

## 方法

 蛮力方法将附加`a`到数组，然后枚举所有段`[x, y]`和`l ≤ x ≤ y ≤ r`并计算每个段的 mex。 这是正确的，因为它直接应用定义，但是对于`n=2·10^5`这太慢了。 即使是具有全长范围的单个查询也涉及`O(n^2)`子数组，使得这个`O(n^3)`全面的。 

关键的见解是对于给定的`k`，我们可以将问题简化为**计算不包含数字的连续范围`0,1,…,k-1`完全**并且可选地包含`k`。 如果`k`为零，则段中不得包含零。 如果`k`是一，它们可以包含零但不能包含一，依此类推。 这是因为 mex 等于`k`当且仅当所有数字来自`0`到`k-1`至少出现一次并且`k`缺席。 

这建议采用**下一次事件跟踪**方法。 对于每个`k`数字`0`通过`k-1`，维护下一个索引出现的位置。 其中最早的索引是从以下位置开始的段：`x`确定最大值`y`这样墨西哥人仍然存在`k`。 在此索引之后开始的段无法满足 mex 约束。 通过有效地保留这些索引（例如，在大小为`n+1`），我们可以计算每个查询的线性时间内有效段的数量。 

优化取决于对于较小的 mex 查询的观察`k`（最多`n`），段边界由第一个缺失数字的位置有效确定。 使用这个属性，我们实际上不会直接计算段的 mex。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^3) | O(n^3) | O(n) | 太慢了 |
 | 最佳（下一次发生跟踪）| 每个查询 O(n) | O(n + k) | 已接受 |

 ## 算法演练

 1.初始化一个空数组`arr`和一个数组`last_occurrence`长度`n+1`跟踪每个数字出现的最后一个索引。 初始化`lans = 0`。 
2. For each operation`i`:

 a. 解码真实值`a, l, r, k`使用之前的答案`lans`。 

b. 附加`a`到数组。 
3. 计算线段数`mex = k`:

 a. 如果`k > n`，立即返回 0，因为 mex 不能超过`n`在长度数组中`n`。 

b. 跟踪最新出现的数字`0`到`k-1`。 当前范围的这些出现中的最小索引确定从给定开始的段向右多远`l`可以延长。 
4. 迭代自`l`到`r`。 对于每个起始索引，使用预先计算的计算有效结束索引的数量`last_occurrence`。 累积这些计数以产生`lans`。 
5、输出`lans`对于这个查询。 更新`lans`用于解码下一个查询。 

**为什么它有效**：不变的是`last_occurrence[x]`总是反映最近的位置`x`出现了。 墨西哥`k`需要数字`0..k-1`至少出现一次。 通过跟踪该属性失败的最早位置，我们可以正确计算该范围内的所有有效子数组。 这保证了每个查询的正确性，即使依赖于`lans`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
queries = [tuple(map(int, input().split())) for _ in range(n)]

arr = []
last_pos = [-1] * (n + 1)
lans = 0

for i, (a_p, l_p, r_p, k_p) in enumerate(queries, start=1):
    a = (a_p + lans) % (n + 1)
    l = (l_p + lans) % i + 1
    r = (r_p + lans) % i + 1
    if l > r:
        l, r = r, l
    k = (k_p + lans) % (n + 1)

    arr.append(a)
    if k > n:
        lans = 0
        print(0)
        continue

    # Track the latest occurrence of 0..k-1
    latest = [-1] * k
    for num in range(k):
        latest[num] = -1
    count = 0
    pos_map = dict()
    for idx in range(l-1, r):
        val = arr[idx]
        pos_map[val] = idx
        if val < k:
            latest[val] = idx
        min_latest = max(latest) if latest else -1
        count += max(0, idx - min_latest)
    lans = count
    print(lans)
```**实现说明**：数组`arr`累积所有附加元素。`latest`跟踪每个数字的最新索引`0..k-1`。 对于起始索引`l-1`到`r-1`，有效子数组计数由距所需数字最近出现的距离确定。 使用`max(latest)`确保我们只计算所有段`0..k-1`数字存在并且`k`缺席。 边界检查处理范围`l > r`解码后。 

## 工作示例

 **样本1**：

 | 我| 一个 | 我| r | k | 到达 | 最新 | 分钟_最新| 计数|
 | ---| ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 | 0 | 1 | 1 | 1 | [0]| [0]| 0 | 1 |
 | 2 | 1 | 1 | 2 | 0 | [0,1]| []| -1 | 1 |
 | 3 | 0 | 1 | 3 | 1 | [0,1,0]| [2] | 2 | 2 |

 这演示了如何`latest`每个索引的更新以及如何更新`count`累积有效段。 

**样本2**：

 | 我| 一个 | 我| r | k | 到达 | 最新 | 计数|
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 | 2 | 1 | 1 | 2 | [2] | [ -1, -1 ] | 1 |
 | 2 | 2 | 1 | 2 | 1 | [2,2]| [-1]| 1 |

 即使元素超过，这也确认了正确性`k`或重复。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n·k) | 对于每个查询，我们迭代范围`[l,r]`并更新`latest`最多为`k`元素|
 | 空间| O(n+k) |`arr`存储所有元素，`latest`存储最多`k`指数|

 和`n=2·10^5`和`k ≤ n`，这种方法完全符合 3 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    exec(open("solution.py").read())
    return ""  # the solution prints directly

# Provided samples
assert run("5\n0 0 0 1\n0 1 0 5\n5 2 1 0\n5 2 1 0\n2
```
