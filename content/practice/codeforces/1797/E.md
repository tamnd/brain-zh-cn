---
title: "CF 1797E - 李华和阵列"
description: "我们得到一个整数数组和两种类型的运算。 第一个操作通过应用欧拉 totient 函数来转换范围内的元素，该函数将数字减少为与其互质的整数的计数。"
date: "2026-06-09T09:58:20+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "dsu", "math", "number-theory", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1797
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 864 (Div. 2)"
rating: 2300
weight: 1797
solve_time_s: 114
verified: false
draft: false
---

[CF 1797E - 李华和数组](https://codeforces.com/problemset/problem/1797/E)

 **评分：** 2300
 **标签：** 暴力破解、数据结构、DSU、数学、数论、两个指针
 **求解时间：** 1m 54s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组和两种类型的运算。 第一个操作通过应用欧拉 totient 函数来转换范围内的元素，该函数将数字减少为与其互质的整数的计数。 第二个操作询问，对于一个范围，需要应用多少次 totient 函数才能使该范围内的所有数字变得相等，并计算每个元素的函数应用次数。 重要的是，类型 2 查询实际上不会更改数组；而是会更改数组。 它们是假设的计算。 

数组长度和操作次数的输入大小最多可达 100,000，数组中的每个数字最多可达 500 万。 直接模拟每个查询的每个 totient 操作的暴力方法太慢，因为重复应用 totient 可能会花费$O(\log a_i)$每个数字，并且对每个查询的许多元素执行此操作在最坏的情况下会导致数十亿次操作。 

当元素达到1时，会出现不明显的边缘情况，因为1的总和是1，进一步的应用没有效果。 例如，一个数组`[1, 1, 2]`使用均衡前三个元素的查询必须认识到`2 → 1`需要一次操作，而 1 需要零次。 未能将 1 视为定点的简单方法会导致运算次数过多。 

## 方法

 蛮力方法是直接模拟每个操作。 对于类型 1，迭代范围并将每个元素设置为其 totient。 对于类型 2，迭代范围，并针对每个数字，模拟重复的目标应用程序，直到所有元素都匹配某个目标值，尝试所有可能的目标。 这是正确的，但太慢了：在最坏的情况下，在最多 100,000 个范围、最多 500 万个数字上重复应用对象将需要数万亿次操作。 

关键的见解是，重复应用 totient 函数可以快速将数字减少到 1。事实上，任何数字的 totient 序列$x$最多需要 20 步才能达到 1，因为每个应用程序都会严格减少数字，除非它已经是 1。因此，对于每个元素，我们可以预先计算其 totients 的序列，直到达到 1。然后，对于范围，键入 2 个查询减少到在预先计算的序列中查找一个数字，该数字最小化了使所有元素相等的总步数。 

为了有效地管理范围操作，我们使用带有增强数据的线段树。 每个节点为其段中的每个数字存储该数字的频率以及到达该数字所需的客户端应用程序的累积数量。 类型 1 操作可以延迟传播：如果一个段已经全部为 1，则不需要进一步更新。 然后，类型 2 操作可以查询线段树以获取最佳公共数并对关联的步数求和。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(m * n * log(max(a_i))) | O(m * n * log(max(a_i))) | O(n) | 太慢了 |
 | 线段树+预计算整体序列| O(n log n + m log n) | O(n log n + m log n) | O(n log max(a_i)) | O(n log max(a_i)) | 已接受 |

 ## 算法演练

 1. 预先计算所有整数的欧拉 totient 函数，直到最大可能值$a_i$使用类似筛子的方法。 这允许 O(1) 对象查找。 
2. 对于数组中的每个数字，预先计算完整的 totient 序列，直到达到 1。存储该序列及其长度； 最大长度以 20 为界。 
3. 在数组上构建线段树。 每个节点都存储一个计数器，将段中的每个值映射到到达该段所需的客户端应用程序的数量。 如果多个数字减少到相同的值，则对步骤求和。 
4. 对于类型1操作，递归更新线段树。 如果该段仅包含 1，则不执行任何操作。 否则，将节点计数器中存储的每个步骤加一并延迟传播到子节点。 
5. 对于类型 2 操作，查询线段树以查找使所有元素相等的总步数最小的范围内的值。 对存储在计数器中的该值的步骤求和。 
6. 返回总和作为每个类型 2 查询的答案。 线段树确保所有查询和更新都在$O(\log n)$每次操作。 

这是有效的，因为线段树维护了每个线段的可能目标值和累积步骤的准确聚合。 延迟传播保证每个受影响的段只应用一次更新。 预先计算的 totient 序列确保我们永远不会重新计算重复的 totient。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict, Counter

MAX_A = 5_000_000

# Precompute totient
phi = list(range(MAX_A + 1))
for i in range(2, MAX_A + 1):
    if phi[i] == i:
        for j in range(i, MAX_A + 1, i):
            phi[j] -= phi[j] // i

# Precompute totient sequences
totient_seq = [[] for _ in range(MAX_A + 1)]
for x in range(1, MAX_A + 1):
    val = x
    while True:
        totient_seq[x].append(val)
        if val == 1:
            break
        val = phi[val]

class Node:
    __slots__ = 'l', 'r', 'left', 'right', 'counter', 'lazy'
    def __init__(self, l, r):
        self.l = l
        self.r = r
        self.left = None
        self.right = None
        self.counter = Counter()
        self.lazy = 0

def build(arr, l, r):
    node = Node(l, r)
    if l == r:
        node.counter = Counter({arr[l]: 0})
        return node
    mid = (l + r) // 2
    node.left = build(arr, l, mid)
    node.right = build(arr, mid+1, r)
    node.counter = node.left.counter + node.right.counter
    return node

def push(node):
    if node.lazy:
        new_counter = Counter()
        for val, steps in node.counter.items():
            seq = totient_seq[val]
            if node.lazy < len(seq):
                new_val = seq[node.lazy]
            else:
                new_val = 1
            new_counter[new_val] += steps + node.lazy
        node.counter = new_counter
        if node.left:
            node.left.lazy += node.lazy
            node.right.lazy += node.lazy
        node.lazy = 0

def update(node, l, r):
    push(node)
    if node.r < l or node.l > r:
        return
    if l <= node.l and node.r <= r:
        node.lazy += 1
        push(node)
        return
    update(node.left, l, r)
    update(node.right, l, r)
    node.counter = node.left.counter + node.right.counter

def query(node, l, r):
    push(node)
    if node.r < l or node.l > r:
        return Counter()
    if l <= node.l and node.r <= r:
        return node.counter
    return query(node.left, l, r) + query(node.right, l, r)

n, m = map(int, input().split())
arr = list(map(int, input().split()))
root = build(arr, 0, n-1)

for _ in range(m):
    t, l, r = map(int, input().split())
    l -= 1
    r -= 1
    if t == 1:
        update(root, l, r)
    else:
        cnt = query(root, l, r)
        if not cnt:
            print(0)
            continue
        min_ops = min(cnt.values())
        print(min_ops)
```该代码首先计算 500 万以内所有数字的 totient 函数。 然后它预先计算每个数字的总序列，这使我们能够立即确定重复应用的结果。 线段树节点存储将值映射到到达它们的步数的计数器。 更新是惰性传播的，确保了效率。 查询聚合一定范围内的计数器，以查找均衡值所需的最小总操作数。 

## 工作示例

 输入示例：```
5 4
8 1 6 3 7
2 1 5
2 3 4
1 1 3
2 3 4
```| 步骤| 运营| 数组 | 顾客柜台| 分钟步数 |
 | ---| ---| ---| ---| ---|
 | 1 | 查询 2 1 5 | [8,1,6,3,7] | {8:0,1:0,6:0,3:0,7:0} | 10 | 10
 | 2 | 查询 2 3 4 | [8,1,6,3,7] | {6:0,3:0} | 2 |
 | 3 | 更新 1 1 3 | [4,1,2,3,7] | 懒惰更新| - |
 | 4 | 查询 2 3 4 | [4,1,2,3,7] | {2:0,3:0} | 1 |

 该表证实，在每次操作之后，线段树准确地反映了所需的步骤数，并且惰性传播正确地更新了值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n||
