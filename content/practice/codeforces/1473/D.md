---
title: "CF 1473D - 程序"
description: "我们有一个程序，它操作从 0 开始的单个整数变量 x。每条指令要么将 x 递增或递减 1。"
date: "2026-06-11T00:23:39+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dp", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 1473
codeforces_index: "D"
codeforces_contest_name: "Educational Codeforces Round 102 (Rated for Div. 2)"
rating: 1700
weight: 1473
solve_time_s: 106
verified: true
draft: false
---

[CF 1473D - 程序](https://codeforces.com/problemset/problem/1473/D)

 **评分：** 1700
 **标签：** 数据结构、dp、实现、字符串
 **求解时间：** 1m 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个操作单个整数变量的程序`x`，从`0`。 每条指令要么递增，要么递减`x`经过`1`。 然后，我们被要求进行一系列查询：对于每个查询，忽略连续的指令子序列并确定有多少个不同的值`x`按顺序执行剩余指令时所花费的时间。 查询的输出只是不同值的计数`x`实现。 

限制因素很大。 每个程序最多可以有 200,000 条指令，最多可以有 200,000 个查询。 在所有测试用例中，指令和查询的总和也上限为 200,000。 这立即排除了任何从头开始模拟每个查询的程序的解决方案，因为这可能会采取以下顺序：$O(n \cdot m)$操作，可以是$4 \cdot 10^{10}$在最坏的情况下。 我们需要一个对信息进行预处理的解决方案，以便可以在恒定或对数时间内回答每个查询。 

一个重要的微妙之处是，忽略子序列可能会将所有后续值移动固定的偏移量。 例如，考虑一个程序“+-+-”和一个忽略指令 2 到 3 的查询。结果序列是来自指令 1 和 4 的“+-”，但相对最小值和最大值`x`根据被忽略指令的累积效果进行更改。 粗心的解决方案只是简单地重新计算序列，会多算或少算不同的值。 同样，删除第一条或最后一条指令的查询必须正确处理程序可能变空的边界条件。 

## 方法

 天真的方法很简单：对于每个查询，通过跳过来自的指令来构造一个新的程序序列`l`到`r`, 模拟`x`一步步记录所有值，并返回不同值的计数。 这对于小输入来说是正确的，但效率极低。 如果`n`和`m`是每个$2 \cdot 10^5$，这可能需要$O(n \cdot m) = 4 \cdot 10^{10}$操作，远远超出了2秒的限制。 

关键的见解是我们可以预处理有关程序的前缀和后缀信息。 如果我们知道对于每个位置，最小值和最大值`x`值达到该点（前缀）以及从该点到末尾（后缀），我们可以通过组合被忽略段之前的前缀和其之后的后缀来回答任何查询。 被忽略的部分带来了净变化`delta`，这是该段中增量和减量的总和。 后缀中的值按此移动`delta`当连接在前缀之后时。 我们不需要模拟整个程序； 跟踪最小值和最大值就足够了`x`在前缀和后缀中，并根据被忽略段的净变化来调整它们。 

这在线性预处理后将每个查询的计算减少到恒定时间。 预处理计算前缀最小/最大和后缀最小/最大数组$O(n)$。 每个查询使用这些数组来计算剩余指令的有效最小值和最大值，并将不同值的数量输出为`max_val - min_val + 1`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n * m) | O(n) | 太慢了|
 | 最佳 | O(n + m) | O(n) | 已接受 |

 ## 算法演练

 1.将程序字符串转换为数组`a`在哪里`a[i] = 1`对于“+”和`a[i] = -1`为了 '-'。 这允许数字运算而不是字符串处理。 
2. 构造前缀和`pref[i]`这样`pref[i]`的值是`x`执行第一个之后`i`指示。 初始化`pref[0] = 0`。 
3. 计算前缀最小值`pref_min[i]`和前缀最大值`pref_max[i]`数组。`pref_min[i]`是最小值`x`从开始到指令`i`。`pref_max[i]`是最大的。 
4、同样构造后缀信息。 让`suff[i]`表示指令的累积和`i`到最后。 然后计算`suff_min[i]`和`suff_max[i]`，代表最小值和最大值`x`在相对于其起点的后缀中，最初是`0`。 
5. 对于每个查询`[l, r]`，将程序分成两部分：前缀`1..l-1`和后缀`r+1..n`。 被忽略的部分贡献的净增量为`pref[r] - pref[l-1]`。 
6. 通过净变化调整后缀的最小值和最大值`x`由于前缀 (`pref[l-1]`）。 的最小值`x`其余指令是`min(pref_min[l-1], pref[l-1] + suff_min[r+1])`，最大值为`max(pref_max[l-1], pref[l-1] + suff_max[r+1])`。 
7. 查询的答案是`max_val - min_val + 1`。 

为什么它有效：不变的是任何连续子序列的删除都会简单地通过删除片段的净效应来移动所有后来的值。 通过存储所有前缀和后缀的最小值和最大值，我们可以重建极值，而无需模拟每个步骤。 移位后组合两个极值会产生一组完整的不同值，因为每个增量/减量都会发生变化`x`正好 1。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        s = input().strip()
        a = [1 if c == '+' else -1 for c in s]

        # prefix sums and min/max
        pref = [0] * (n + 1)
        pref_min = [0] * (n + 1)
        pref_max = [0] * (n + 1)
        for i in range(1, n + 1):
            pref[i] = pref[i - 1] + a[i - 1]
            pref_min[i] = min(pref_min[i - 1], pref[i])
            pref_max[i] = max(pref_max[i - 1], pref[i])

        # suffix min/max
        suff_min = [0] * (n + 2)
        suff_max = [0] * (n + 2)
        suff_sum = 0
        for i in range(n, 0, -1):
            suff_sum += a[i - 1]
            suff_min[i] = min(0, suff_min[i + 1] + a[i - 1])
            suff_max[i] = max(0, suff_max[i + 1] + a[i - 1])

        res = []
        for _ in range(m):
            l, r = map(int, input().split())
            # prefix before ignored segment
            pre_min = pref_min[l - 1]
            pre_max = pref_max[l - 1]
            # suffix after ignored segment, shifted by pref[l-1]
            suf_min = pref[l - 1] + suff_min[r + 1]
            suf_max = pref[l - 1] + suff_max[r + 1]
            total_min = min(pre_min, suf_min)
            total_max = max(pre_max, suf_max)
            res.append(str(total_max - total_min + 1))
        print('\n'.join(res))

if __name__ == "__main__":
    solve()
```该代码首先将字符串转换为数字增量和减量。 前缀和及其最小/最大值跟踪每个指令的极值。 后缀最小/最大数组反向计算，从末尾开始累积相对最小/最大值。 对于每个查询，我们合并前缀和后缀值，通过忽略段之前的前缀和调整后缀值。 最终的答案是不同的范围`x`价值观。 

## 工作示例

 输入示例：```
8 4
-+--+--+
1 8
2 8
2 5
1 1
```| 步骤| 首选项 | pref_min | 首选项最大 | suff_min | suff_max | suff_max | 查询 | 回答 |
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 初始| 0 | 0 | 0 | 0 | 0 | - | - |
 | 1 | -1 | -1 | 0 | ... | ... | 1-8 | 1-8 1 |
 | 2 | -1+1=0 | -1+1=0 -1 | 1 | ... | ... | 2-8 | 2-8 2 |
 | 3 | ... | ... | ... | ... | ... | 2-5 | 2-5 4 |
 | 4 | ... | ... | ... | ... | ... | 1-1 | 1-1 4 |

 该轨迹显示了忽略段之前和之后的最小值和最大值，展示了算法如何有效地计算范围。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + m) | 每个数组的构建时间复杂度为 O(n)，每个查询的回答时间复杂度为 O(1) |
 | 空间| O(n) | 前缀和后缀数组各自需要 O(n) 空间 |

 当 n 和 m 达到 2e5 时，O(n + m) 操作可以轻松满足 2 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str)
```
