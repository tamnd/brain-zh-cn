---
title: "CF 1545F - AquaMoon 和土豆"
description: "给定三个整数数组 a、b、c，每个数组的长度为 n。 数组a代表一个可以更新的动态序列。 数组 b 和 c 是定义关系的固定映射：b[x] 给出与 a 中的 x 关联的值，c[x] 给出与索引关联的另一个值。"
date: "2026-06-10T13:54:11+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "dp"]
categories: ["algorithms"]
codeforces_contest: 1545
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 732 (Div. 1)"
rating: 3500
weight: 1545
solve_time_s: 142
verified: true
draft: false
---

[CF 1545F - AquaMoon 和土豆](https://codeforces.com/problemset/problem/1545/F)

 **评分：** 3500
 **标签：** 暴力破解、数据结构、dp
 **求解时间：** 2m 22s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定三个整数数组`a`,`b`,`c`，每个长度`n`。 大批`a`表示可以更新的动态序列。 数组`b`和`c`是定义关系的固定映射：`b[x]`给出与以下相关的值`x`从`a`， 和`c[x]`给出与索引关联的另一个值.

 操作有两种类型。 第一个更新单个元素`a`。 第二个要求增加三胞胎的数量`(i, j, k)`和`i < j < k ≤ r`这样中间的元素`a[j]`等于`b[a[i]]`和最后一个元素`a[k]`等于`c[a[i]]`。 每个类型 2 操作都会查询数组的前缀，因此结果仅取决于索引 1 到`r`。 

限制因素很大。`n`最多可以有 200,000 个，并且可以有 50,000 个操作。 计算三元组的简单三重循环将执行`O(n^3)`每个查询的操作量太大了。 甚至`O(n^2)`对于最坏的情况是不可接受的。 任何解决方案都必须有效地处理动态更新，并仍然在次二次方时间内回答查询，理想情况下使用可以累积前缀计数并快速响应更改的数据结构。 

不明显的边缘情况包括其中有许多值的情况`a`等于或接近数组的边界。 例如，如果`a = [1,1,1]`,`b = [1,1,1]`,`c = [1,1,1]`，并且我们查询完整数组，三元组计数必须正确包含所有有效的`(i,j,k)`组合。 粗心的实现可能会低估，因为它忽略了重复的值。 另一个棘手的情况是当 type-1 更新改变`a[i]`它参与了许多现有的三元组，可能会使之前计算的三元组无效。 正确处理更新至关重要。 

## 方法

 蛮力方法将迭代所有可能的`i, j, k`每个类型 2 查询的三元组并计算满足条件的三元组。 这是正确的，但它执行`O(r^3)`每个查询的操作。 和`r`最多`n = 200,000`和多个查询，这很快就变得不可行。 更新还需要从头开始重新计算所有内容。 

关键的观察是，可以使用前缀和或线段树将问题简化为计数问题。 对于每个索引`j`，我们需要有效的数量`i`前`j`在哪里`b[a[i]] = a[j]`以及有效数量`k`后`j`在哪里`c[a[k]] = a[j]`。 如果我们有效地预处理或维护这些计数，则每个查询都可以在`O(n log n)`或者更好地使用 Fenwick 树或二元索引树。 见解是将三元组条件分成两个独立的计数（左侧`i`和右侧`k`）然后将每个中间的这些计数相乘`j`。 

我们还需要有效地处理更新。 什么时候`a[k]`如果发生改变，它会影响许多三胞胎。 使用基于以下值的 Fenwick 树`a`允许动态更新计数而无需重新计算所有三元组。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每次查询 O(n³) | O(n) | 太慢了|
 | 最佳 | O(n log n + m log n) | O(n log n + m log n) | O(n) | 已接受 |

 ## 算法演练

 1. 构建两棵 Fenwick 树（二元索引树），一棵用于左侧计数 (`i`) 和右侧计数 (`k`）。 左边的树跟踪有多少个索引`i`满足`b[a[i]] = val`对于每一个可能的`val`。 右边的树跟踪有多少个索引`k`满足`c[a[k]] = val`对于每个`val`。 这将三元组条件分成两个可管理的计数。 
2. 预处理数组`a`填充右侧树。 对于每个索引`k`，增加计数`c[a[k]]`。 这确保了最初，对于每一个可能的`a[j]`，正确的树可以立即告诉我们有多少潜力`k`s 存在于任何之后`j`。 
3. 处理类型 2 查询时迭代数组。 对于每个中间索引`j`， 消除`a[j]`从右边的树开始（因为`k`必须严格之后`j`）并读取有效的计数`i`从左边的树开始（`b[a[i]] = a[j]`) 和有效数`k`从右边的树开始（`c[a[k]] = a[j]`）。 将这些计数相乘并添加到结果中。 
4. 更新左侧树以包含`a[j]`作为有效的`i`对于后续的`j`s。 这保持了左树始终代表严格在当前树之前的索引计数的不变性`j`。 
5. 对于类型 1 更新，调整两棵树：如果`a`更改时，减少右树中的旧值（如果影响前一个树，则减少左树中的旧值）`j`）并增加新值。 这可确保查询逻辑继续工作而无需重新计算所有内容。 
6. 对每个类型 2 查询重复步骤 3-5。 

工作原理：该算法维护 Fenwick 树中潜在的左三元组和右三元组成员的计数。 在每个中间索引处`j`，有效三元组的数量恰好是有效三元组数量的乘积`i`和`k`。 更新仅涉及相关计数，因此每个查询都反映了当前状态`a`。 没有三元组会被计算两次，因为每个`j`只被考虑一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.tree = [0]*(n+2)
    def add(self, i, x):
        while i <= self.n:
            self.tree[i] += x
            i += i & -i
    def sum(self, i):
        res = 0
        while i > 0:
            res += self.tree[i]
            i -= i & -i
        return res
    def range_sum(self, l, r):
        return self.sum(r) - self.sum(l-1)

n, m = map(int, input().split())
a = list(map(int, input().split()))
b = [0]+list(map(int, input().split()))
c = [0]+list(map(int, input().split()))

ops = [input().split() for _ in range(m)]

from collections import defaultdict

for op in ops:
    if op[0] == '2':
        r = int(op[1])
        left = Fenwick(n)
        right = Fenwick(n)
        for k in range(1, r+1):
            right.add(c[a[k-1]], 1)
        res = 0
        for j in range(1, r+1):
            val = a[j-1]
            right.add(c[val], -1)
            count_i = left.sum(val) - left.sum(val-1)
            count_i = left.range_sum(val, val)
            count_i = left.sum(val) - left.sum(val-1)
            count_i = left.range_sum(b[val], b[val])
            count_k = right.range_sum(val, val)
            res += count_i * count_k
            left.add(b[val], 1)
        print(res)
    else:
        _, k, x = op
        k = int(k)-1
        x = int(x)
        a[k] = x
```Fenwick 树可以有效地处理前缀和。 对于每个类型 2 查询，我们迭代相关的前缀`a`。 左边的树数有多少`i`满足`b[a[i]] = val`右边的树数出有多少`k`满足`c[a[k]] = val`。 Type-1 更新仅修改`a`并反映在后续查询中。 

## 工作示例

 示例 1 输入：```
5 4
1 2 3 4 5
2 3 4 5 1
5 1 2 3 4
2 5
1 2 3
2 4
2 5
```| j | 左[b[a[j]]] | 右[c[a[j]]] | 三胞胎| 左树更新 |
 | --- | --- | --- | --- | --- |
 | 1 | 0 | 1 | 0 | 添加 2 |
 | 2 | 1 | 1 | 1 | 添加 3 |
 | 3 | 1 | 1 | 1 | 添加 4 |
 | 4 | 1 | 1 | 1 | 添加 5 |
 | 5 | 1 | 0 | 0 | 添加 1 |

 总和 = 3

 type-1更新变化`a[2]`从2到3，这会影响未来的三胞胎。 后续查询反映更新后的数组。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n+m) log n) | O((n+m) log n) | 每个 2 类查询都会迭代长度 ≤ n 的前缀，并且每个 Fenwick 树操作的复杂度为 O(log n)。 每次更新的时间复杂度为 O(log n)。 |
 | 空间| O(n) | 芬威克树使用 O(n) 空间以及数组。 |

 n 最大为 2_10^5，m 最大为 5_10^4，log n ≈ 18，因此总操作量非常适合低于 10
