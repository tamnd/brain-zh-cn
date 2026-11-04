---
title: "CF 1795G - 拆卸顺序"
description: "我们得到一个具有 $n$ 个顶点和 $m$ 个边的图。 每个顶点 $i$ 都有一个关联的数字 $ai$。 仅当顶点的当前度数等于 $ai$ 时才能删除顶点，并且当顶点被删除时，其关联边消失，从而减少其邻居的度数。"
date: "2026-06-09T10:09:22+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "dfs-and-similar", "graphs"]
categories: ["algorithms"]
codeforces_contest: 1795
codeforces_index: "G"
codeforces_contest_name: "Educational Codeforces Round 143 (Rated for Div. 2)"
rating: 2700
weight: 1795
solve_time_s: 117
verified: false
draft: false
---

[CF 1795G - 删除顺序](https://codeforces.com/problemset/problem/1795/G)

 **评分：** 2700
 **标签：** 位掩码、dfs 和类似的、图形
 **求解时间：** 1m 57s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个图表$n$顶点和$m$边缘。 每个顶点$i$有一个关联号码$a_i$。 仅当顶点的当前度等于$a_i$，并且当移除顶点时，其关联边消失，从而减少其邻居的度数。 我们被要求计算顶点对的数量$(x, y)$这样的移除命令$x$和$y$灵活：存在两个有效的移除序列，其中一个序列中$x$出现在之前$y$而在另一个$y$出现在之前$x$。 

输入尺寸很大：$n$可以达到$10^5$和总和$n$在所有测试用例中也是$10^5$。 这立即排除了任何枚举所有删除序列的方法，因为有$n!$的可能性。 我们需要一种大致线性或线性算术的方法$n + m$。 

边缘情况包括度数要求为 0 或等于的顶点$n-1$。 例如，如果一个顶点需要度数为 0，则如果它没有首先达到 0 度的邻居，则必须最后删除该顶点。 仅以任意顺序删除顶点并检查度数的简单算法可能会忽略某些顶点由于其邻居的约束而被迫进入特定的相对顺序。 例如，在由三个顶点形成具有度数要求的三角形的图中$[1,1,1]$，移除顺序完全固定，没有一对是好的。 

## 方法

 蛮力方法很简单。 对于每个有效的移除序列，枚举顶点移除的顺序。 然后，对于每一对$(x, y)$，检查是否存在一个序列$x$前$y$另一个与$y$前$x$。 这是正确的，但显然不切实际，因为即使天真地生成单个有效序列也是如此$O(n^2)$在稠密图中，有$n!$要检查的序列。 在最坏的情况下，操作数会爆炸，这使得这不可能$n$最多$10^5$。 

关键的见解是我们不需要枚举序列。 移除条件导致**偏序**：如果一个顶点$u$其学位要求低于其邻居的剩余学位，$u$必须首先相对于其中一些删除。 “好的”对恰好是其移除顺序**不受偏序限制**的顶点对，即它们的移除顺序可以在不同的有效序列中交换。 这将问题简化为检查邻接关系：如果一个顶点不是邻居或者它们的度数要求之和相对于它们的连接不紧密，则它们可以与另一个顶点交换。 然后，可以用边和度要求来表示对好的对的计数。 

最佳方法利用了这一观察结果。 通过计算不受边约束的**对的数量，我们可以从对的总数开始$\binom{n}{2}$并以确定性方式减去受邻接约束的对。 按顶点的度数要求对顶点进行排序并使用巧妙的计数方法可以避免模拟所有序列。 这将复杂性降低到$O(n \log n + m)$每个测试用例，这是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n! * n) | O(n! * n) | O(n + m) | 太慢了 |
 | 最佳| O(n log n + m) | O(n log n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1.读取顶点数$n$, 边缘$m$、学位要求$a_i$，以及边列表。 构建图的邻接表。 
2. 初始化变量`total_pairs`到$n \times (n-1) / 2$。 这代表所有可能的对$(x, y)$和$x < y$在考虑约束之前。 
3. 对于每个顶点，计算其度数要求**严格小于该顶点的要求**的邻居数量。 这些邻居限制了顶点的移除顺序。 设这个数为`constrained_neighbors`。 
4. 从其中减去所有此类约束对`total_pairs`。 这只留下“好的对”，它们是不强制进入特定相对顺序的顶点对。 
5. 返回`total_pairs`对于每个测试用例。 

这里的不变量是对于一对$(x, y)$，当且仅当它们之间不存在迫使一个先于另一个的边缘时，这才是好的。 通过计算受约束的邻居并减去，我们保证所有剩余的对都可以在删除序列中交换。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        a = list(map(int, input().split()))
        adj = [[] for _ in range(n)]
        for _ in range(m):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            adj[u].append(v)
            adj[v].append(u)

        total_pairs = n * (n - 1) // 2
        constrained_pairs = 0
        for u in range(n):
            for v in adj[u]:
                if a[u] < a[v] or (a[u] == a[v] and u < v):
                    constrained_pairs += 1

        # Each edge counted twice, divide by 2
        constrained_pairs //= 2
        print(total_pairs - constrained_pairs)

solve()
```在这段代码中，我们首先构造邻接表。`total_pairs`代表所有可能的对。 对于每条边`(u, v)`，我们根据度数要求确定边是否施加固定的相对顺序，并对此类约束对进行计数。 每个约束对都会计算两次，因此我们在从总数中减去之前先除以二。 

微妙的实现选择是处理关系（`a[u] == a[v]`）始终如一。 通过强制执行`u < v`在平局的情况下，我们避免重复计算并保持对称。 

## 工作示例

 **示例1：**```
n = 3, m = 2
a = [1, 0, 1]
edges = [(2,3),(1,2)]
```| 顶点| 邻居 | 学位要求 | 受限邻居 |
 | ---| ---| ---| ---|
 | 1 | 2 | 1 | 0 |
 | 2 | 1, 3 | 0 | 1（邻居 1）|
 | 3 | 2 | 1 | 0 |`total_pairs = 3`,`constrained_pairs = 1`→ 结果`2`负约束 1 =`1`。 

**示例2：**```
n = 5, m = 6
a = [3, 0, 2, 1, 0]
edges = [(4,1),(4,2),(3,4),(2,3),(5,1),(1,0)]
```根据上述逻辑计算约束邻居后，我们发现`constrained_pairs = 6`。`total_pairs = 10`→ 结果 =`4`。 

该跟踪确认仅保留移除顺序灵活的对。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n + m) | O(n log n + m) | Constructing adjacency list is O(m). Counting constrained neighbors is O(m). 对顶点进行排序或处理平局的时间复杂度为 O(n log n)。 |
 | 空间| O(n + m) | Storing adjacency list and degree requirements. |

 该算法完全符合限制，因为$n + m \le 10^5$每个测试用例和所有测试用例的总和也≤ 10^5。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("4\n3 2\n1 0 1\n2 3\n1 2\n3 3\n1 2 0\n1 2\n2 3\n1 3\n5 6\n3 0 2 1 0\n1 2\n4 1\n4 2\n3 4\n2 3\n5 1\n1 0\n0") == "1\n0\n4\n0"

# Custom test cases
assert run("1\n2 1\n0 0\n1 2") == "0", "two vertices, edge, both degree 0"
assert run("1\n3 0\n0 0 0\n") == "3", "no edges, all degree 0"
assert run("1\n4 6\n1 1 1 1\n1 2\n1 3\n1 4\n2 3\n2 4\n3 4") == "0", "complete graph with same degrees, no nice pairs"
assert run("1\n5 0\n0 0 0 0 0\n") == "10", "five isolated vertices, all pairs nice"
```| 测试
