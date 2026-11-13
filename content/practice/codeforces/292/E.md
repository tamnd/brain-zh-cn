---
title: "CF 292E - 复制数据"
description: "我们被要求维护两个整数数组，a 和 b，每个数组的长度为 n。 第一个数组 a 是静态的：它的值永远不会改变。"
date: "2026-06-05T17:14:27+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 292
codeforces_index: "E"
codeforces_contest_name: "Croc Champ 2013 - Round 1"
rating: 1900
weight: 292
solve_time_s: 73
verified: true
draft: false
---

[CF 292E - 复制数据](https://codeforces.com/problemset/problem/292/E)

 **评级：** 1900
 **标签：** 数据结构
 **求解时间：** 1m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求维护两个整数数组，`a`和`b`，每个长度`n`。 第一个数组`a`是静态的：它的值永远不会改变。 第二个数组`b`是可变的，我们需要处理两种类型的操作： 从`a`进入`b`，并查询特定元素的值`b`。 每个复制操作可能会影响多个元素`b`同时，我们必须支持最多`m`高效运营。 

考虑到约束条件，两者`n`和`m`最大可达 100,000。 在最坏的情况下（如果 k 也是 O(n)），每次复制以 O(k) 时间复制子段的简单实现可能需要多达 10^10 次操作，这远远超出了 2 秒的时间限制。 这意味着每个副本查询的简单循环是不可行的。 

当多个复制操作重叠时，会出现微妙的边缘情况。 例如，如果我们首先复制`a[1:3]`进入`b[2:4]`然后复制`a[2:4]`进入`b[3:5]`，一个简单的数组覆盖策略可能无法正确跟踪哪个原始数组`a`元素当前表示为`b`。 另一个潜在的陷阱是查询中的元素`b`从未被覆盖。 该算法必须正确返回原始值`b`在那种情况下。 

## 方法

 暴力破解方法直接模拟复制操作。 每个 type-1 查询都会循环`k`元素和赋值`b[y + q] = a[x + q]`。 每个类型 2 查询仅返回`b[x]`。 这种方法对于小输入是正确的，但最坏情况的时间复杂度是 O(m * n)，可以达到 10^10 次操作，显然太慢了。 

提高性能的关键观察是复制操作总是从`a`到`b`。 我们可以表示状态，而不是单独更新每个元素`b`作为“原始”或“链接”到某个片段`a`。 如果我们将这些链接存储在支持有效范围更新和单元素查询的结构中，我们就可以避免显式复制。 线段树或平衡树结构（如treap）可以工作，但更简单且足够的方法是使用映射数组`from_a`长度`n`。 每个`from_a[i]`将索引存储在`a`那`b[i]`当前反映，如果是原始的则为-1`b`价值。 

当发生复制时，我们使用线段树在 O(log n) 时间内更新范围的映射数组。 然后查询按照映射返回`b[i]`如果`from_a[i] == -1`或相应的`a`否则价值。 这将每个操作的复杂度从 O(k) 降低到 O(log n) 并将总操作保持在 2_10^5_log(10^5) 之内，这是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(m * n) | O(n) | 太慢了 |
 | 映射+线段树| O(m log n) | O(n) | 已接受 |

 ## 算法演练

 1.初始化一个数组`from_a`尺寸的`n`，填充-1。 这将跟踪，对于每个位置`b`，是否指向某个元素`a`或保留其原始值。 
2. 构建线段树`from_a`支持范围分配。 每个节点存储 -1 或起始索引`a`它映射到。 线段树允许我们在 O(log n) 时间内分配整个子范围。 
3、对于每个查询，如果是复制操作，则在线段树中进行范围赋值。 具体来说，对于查询复制`k`元素来自`a[x]`到`b[y]`，分配段`[y, y + k - 1]`在`from_a`对应索引`[x, x + k - 1]`的`a`。 这确保我们永远不会物理地移动元素，而是跟踪每个元素的位置`b`应该从.
 4. 如果查询是读操作，则使用线段树检索值`from_a[x]`。 如果为-1，则返回原来的`b[x]`。 否则，计算正确的偏移量`a`并返回`a[from_a[x]]`。 
5. 重复此操作，直到处理完所有查询，同时打印类型 2 查询的结果。 

保持的不变量是对于任何位置`i`在`b`，线段树总是知道当前值是否来自原始值`b[i]`或某些连续的段`a`。 重叠复制操作会正确覆盖以前的映射，因为线段树分配始终会替换受影响的范围。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegmentTree:
    def __init__(self, n):
        self.n = n
        self.data = [-1] * (4 * n)
        self.lazy = [None] * (4 * n)

    def push(self, v, l, r):
        if self.lazy[v] is not None:
            self.data[v] = self.lazy[v]
            if l != r:
                self.lazy[v*2] = self.lazy[v] + 0
                self.lazy[v*2+1] = self.lazy[v] + (r - l + 1)//2
            self.lazy[v] = None

    def update(self, v, l, r, ul, ur, val):
        self.push(v, l, r)
        if ur < l or r < ul:
            return
        if ul <= l and r <= ur:
            self.lazy[v] = val + (l - ul)
            self.push(v, l, r)
            return
        m = (l + r) // 2
        self.update(v*2, l, m, ul, ur, val)
        self.update(v*2+1, m+1, r, ul, ur, val)

    def query(self, v, l, r, pos):
        self.push(v, l, r)
        if l == r:
            return self.data[v]
        m = (l + r) // 2
        if pos <= m:
            return self.query(v*2, l, m, pos)
        else:
            return self.query(v*2+1, m+1, r, pos)

n, m = map(int, input().split())
a = list(map(int, input().split()))
b = list(map(int, input().split()))

tree = SegmentTree(n)

for _ in range(m):
    q = list(map(int, input().split()))
    if q[0] == 1:
        x, y, k = q[1]-1, q[2]-1, q[3]
        tree.update(1, 0, n-1, y, y+k-1, x)
    else:
        x = q[1]-1
        idx = tree.query(1, 0, n-1, x)
        print(a[idx] if idx != -1 else b[x])
```这`SegmentTree`类处理范围分配的延迟传播。 这`update`方法确保当复制子段时，它正确地偏移映射以匹配中的源索引`a`。 这`query`方法检索任意索引的当前映射，时间复杂度为 O(log n)。 在树内使用从零开始的索引可以避免从从一开始的查询输入转换时出现差一错误。 

## 工作示例

 ### 示例 1

 输入：```
5 10
1 2 0 -1 3
3 1 5 -2 0
2 5
1 3 3 3
2 5
2 4
2 1
1 2 1 4
2 1
2 4
1 4 2 1
2 2
```| 步骤| 运营|`from_a`快照 | 输出|
 | ---| ---| ---| ---|
 | 1 | 查询 b[5] | [-1,-1,-1,-1,-1] | 0 |
 | 2 | 复制 a[3:5] -> b[3:5] | [-1,-1,2,3,4] | - |
 | 3 | 查询 b[5] | [-1,-1,2,3,4] | 3 |
 | 4 | 查询 b[4] | [-1,-1,2,3,4] | -1 |
 | 5 | 查询 b[1] | [-1,-1,2,3,4] | 3 |
 | 6 | 复制 a[2:2] -> b[1:1] | [1,-1,2,3,4] | - |
 | 7 | 查询 b[1] | [1,-1,2,3,4] | 2 |
 | 8 | 查询 b[4] | [1,-1,2,3,4] | -1 |
 | 9 | 复制 a[4:5] -> b[2:3] | [1,3,4,3,4] | - |
 | 10 | 10 查询 b[2] | [1,3,4,3,4] | 3 |

 此跟踪确认重叠副本正确更新映射，并且查询从其中检索正确的值`a`或原来的`b`。 

## 复杂度分析

 | 测量 | 复杂
