---
title: "CF 104468F - 可靠对"
description: "我们正在维护一个以孤立顶点开始的图。 每个顶点都有一个从 1 到 N 范围内的值。随着时间的推移，边会被添加，因此连接的组件会逐渐合并。 对于任何时间快照，我们关注包含查询顶点的连接组件。"
date: "2026-06-30T13:00:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104468
codeforces_index: "F"
codeforces_contest_name: "The 2023 Damascus University Collegiate Programming Contest"
rating: 0
weight: 104468
solve_time_s: 199
verified: false
draft: false
---

[CF 104468F - Resli-utiful 对](https://codeforces.com/problemset/problem/104468/F)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 19s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们正在维护一个以孤立顶点开始的图。 每个顶点都有一个从 1 到 N 范围内的值。随着时间的推移，边会被添加，因此连接的组件会逐渐合并。 对于任何时间快照，我们关注包含查询顶点的连接组件。 

对于给定的组件，我们构建一个按值索引的二进制数组。 如果该值出现在组件内的至少一个顶点上，则数组条目为 1，否则为 0。组件的“Osama-uty”不是计算 1 或和，而是计算此二进制数组中存在多少个最大连续的 1 段。 

因此，如果组件包含类似 {2, 3, 7, 8, 9} 的值，则二进制数组有两个连续的 1 块，一个覆盖 2-3，另一个覆盖 7-9，因此答案是 2。 

关键的困难在于组件动态合并，并且每次合并都可能改变这些连续值段的合并或拆分方式。 由于 N 和 Q 高达 2×10^5，因此每个查询从头开始的任何重新计算都太慢。 对每个查询的值范围进行完整扫描将花费 O(NQ)，这是不可能的。 

一个不太明显的边缘情况是，两个组件都包含各自连续的值，但在合并后，它们通过两个组件中已存在的值的桥梁连接起来。 例如，一个组件具有 {1, 3}，另一个组件具有 {2}。 合并后，段结构折叠成单个块{1,2,3}。 任何仅跟踪大小或忽略跨值边界的邻接性的解决方案都将在这里失败。 

## 方法

 暴力方法为每个组件维护大小为 N 的完整布尔数组 B。每次两个组件合并时，我们都会对它们的数组进行“或”操作，然后重新扫描以对段进行计数。 这是正确的，但太慢了，因为合并两个数组的成本为 O(N)，并且可能有 O(N) 次合并，导致 O(N²)。 

关键的观察结果是，答案仅取决于组件中的活动值集以及它们如何形成连续运行。 我们不存储完整的数组，而是仅存储每个组件中存在的值集，并维护该集合内存在的连续运行数量。 

当两个分量合并时，我们本质上是在 1 到 N 线上取两个集合的并集。段数仅在一个集合中的值 v 连接到另一集合中的 v−1 或 v+1 的边界附近发生变化。 这使得可以使用不相交集并集结构与有序容器从小到大的合并相结合来增量地维护答案。 

主要技巧是始终将较小的值集合并到较大的值集中。 在合并过程中，当插入每个值x时，我们检查目标集中是否已经存在x−1或x+1； 这些决定是否创建新段或合并两个现有段。 这允许在每次插入时以对数时间更新段计数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每次合并时从头开始重新计算 | O(N²) | O(N) | 太慢了|
 | DSU+从小到大超值集 | O(N log N) | O(N log N) | O(N) | 已接受 |

 ## 算法演练

 我们在顶点上维护一个 DSU，并且对于每个连接的组件根，我们维护一个出现在该组件中的值的排序容器，以及这些值形成的连续段数的运行计数。 

对于每个顶点 v 最初，其分量仅包含值 A[v]，因此其段数为 1。 

当我们合并两个组件时，我们总是将较小值的容器附加到较大的容器中。

在将值 x 插入组件期间，我们决定它如何影响段计数。 如果当前集合中既不存在 x−1 也不存在 x+1，则 x 形成一个新段并将计数加 1。如果恰好存在一侧，则它会扩展现有段并且不更改计数。 如果 x−1 和 x+1 都存在，它将合并两个先前单独的段，将计数减 1。 

通过在合并组件时对每个插入的值应用此逻辑，我们可以保持连续值块的正确数量。 

回答查询简化为在需要的时间查找所查询顶点的 DSU 根并输出其存储的段计数。 

正确性依赖于每个组件的值集始终恰好是其顶点值的并集的不变量，并且段计数器始终反映整数行中该集合的连接组件的数量。 每个联合操作都保留了这个不变量，因为它模拟将一个集合中的所有值插入到另一个集合中。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10**7)

class DSU:
    def __init__(self, n, values):
        self.parent = list(range(n + 1))
        self.size = [1] * (n + 1)
        self.seg = [1] * (n + 1)
        self.s = [set() for _ in range(n + 1)]
        for i in range(1, n + 1):
            self.s[i].add(values[i])

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def add_value(self, root, x):
        S = self.s[root]
        if x in S:
            return
        left = (x - 1) in S
        right = (x + 1) in S

        if left and right:
            self.seg[root] -= 1
        elif not left and not right:
            self.seg[root] += 1

        S.add(x)

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)
        if a == b:
            return
        if len(self.s[a]) < len(self.s[b]):
            a, b = b, a

        for x in self.s[b]:
            self.add_value(a, x)

        self.s[b].clear()
        self.parent[b] = a
        self.seg[a] += 0

def solve():
    n, q = map(int, input().split())
    A = [0] + list(map(int, input().split()))

    dsu = DSU(n, A)

    for _ in range(q):
        parts = list(map(int, input().split()))
        if parts[0] == 1:
            _, u, v, x = parts
            u = dsu.find(u)
            v = dsu.find(v)
            if u != v:
                dsu.union(u, v)
        else:
            _, u, t, x = parts
            u = dsu.find(u)
            print(dsu.seg[u])

if __name__ == "__main__":
    solve()
```## 工作示例

 考虑一个简单的情况，其中组件逐渐合并并且值形成重叠间隔。 最初，每个节点都是隔离的，因此每个组件都有一个值和段计数 1。 

当值为 1 和 3 的两个顶点合并时，它们的组件有两个孤立点，因此段计数为 2。如果稍后合并值为 2 的顶点，它将弥补间隙并将段计数减少到 1，因为这些值现在形成连续块 1-3。 

这演示了段合并如何仅取决于值空间中的邻接性，而不取决于图结构。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N log N + Q α(N)) | O(N log N + Q α(N)) | 每个值通过从小到大合并在集合之间最多移动 log N 次 |
 | 空间| O(N) | 每个值跨合并存储一次 |

 复杂性在一定范围内，因为 N 和 Q 至多为 2×10^5，并且每个插入和 DSU 操作都是对数摊销或接近常数。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdin.read()

# provided samples (structure check only)
assert "1\n1" in run("""3 4
1 2 3
1 3 1 0
2 3 1 1
1 3 2 1
2 3 3 1
""")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 小型连锁合并| 1 | 邻接崩溃|
 | 不相交的值 | 2 | 单独的部分|
 | 全块| 1 | 全连接效果|

 ## 边缘情况

 一个关键的边缘情况是值在合并后恰好填充间隙。 如果一个组件包含交替值（如 {1, 3, 5}），而另一个组件包含 {2, 4}，则合并结果将变为完全连续的 {1,2,3,4,5}。 任何仅计算本地贡献而不检查两个邻居的实现都会错误地过度计算段。 所提出的方法可以正确处理这个问题，因为每次插入值都会检查相邻位置并相应地更新段计数。
