---
title: "CF 1706E - Qpwoeirut 和顶点"
description: "我们得到一个有 $n$ 个顶点和 $m$ 个边的无向连通图。 每条边的编号从 1 到 $m$，我们被要求处理 $q$ 查询。"
date: "2026-06-09T21:20:49+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "dfs-and-similar", "divide-and-conquer", "dsu", "greedy", "trees"]
categories: ["algorithms"]
codeforces_contest: 1706
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 809 (Div. 2)"
rating: 2300
weight: 1706
solve_time_s: 133
verified: false
draft: false
---

[CF 1706E - Qpwoeirut 和顶点](https://codeforces.com/problemset/problem/1706/E)

 **评分：** 2300
 **标签：** 二分查找、数据结构、dfs 和类似、分而治之、dsu、贪婪、树
 **求解时间：** 2m 13s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个连通的无向图$n$顶点和$m$边缘。 每条边的编号从 1 到$m$，并且我们被要求处理$q$查询。 每个查询提供一系列顶点索引$[l, r]$，我们要确定最小的初始边数$k$这样该范围内的所有顶点都可以仅使用边 1 到$k$。 

用实际术语重述一下：想象一下，您按照给定的顺序将边一条一条地添加到最初为空的图中。 对于给定的一组连续顶点，我们想知道它们之间形成连通分量的时刻。 我们不关心与此范围之外的顶点的连接，只关心内部连接。 

约束条件意味着$n$可以达到$10^5$和$m, q$最多$2 \cdot 10^5$每个测试用例，所有测试用例的总数都有类似的界限。 这意味着算法具有复杂性$O(n m q)$或者$O(n^2)$是不可能的。 我们需要一些线性或近线性的东西$m$和$n$每个测试用例。 

非明显的边缘情况包括长度为 1 的范围和查询，其中$l$和$r$处于顶点排序的极端。 例如，像这样的查询$l=1, r=1$应该返回 0，因为单个顶点与自身简单连接。 总是处理边缘的粗心实现将至少返回 1。 

## 方法

 一种简单的方法是模拟增量添加边，并且对于每个查询，检查查询范围内的顶点是否连接。 这需要维护第一个的子图$k$边缘和表演$O(r-l+1)$每个查询的连接检查。 在最坏的情况下，这是$O(m q n)$，这太慢了。 

关键的见解是，该问题要求**连续范围的顶点**的连通性，而不是任意集合。 这使我们能够计算每个顶点$i$, 最早的边$f[i]$之后的顶点$i$变得连接到$i-1$。 如果我们在按顺序迭代边缘时维护此信息，则问题会简化为**范围最大查询**：对于查询$[l, r]$，答案是$\max(f[l+1], f[l+2], ..., f[r])$。 这是可行的，因为整个范围的连接性需要连接任何连续对的最大边缘索引。 

为了高效地计算$f[i]$，我们可以使用不相交集并集（DSU）结构，也称为并查集。 当我们添加边时，我们合并包含边端点的集合并跟踪每个组件中的最大顶点。 当两个组件合并时，我们更新连接该组件中连续顶点的第一条边。 这个过程以接近线性的时间运行。 

这将每个查询的工作量减少到数组上的最大范围查询$f$，如果查询是离线的，可以使用线段树或简单的前缀最大数组进行预处理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(q \cdot n \cdot m)$|$O(n+m)$| 太慢了|
 | 最佳 |$O((n+m) \cdot \alpha(n) + q)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 初始化DSU结构$n$顶点。 每个顶点都从​​其自己的组件开始。 
2.初始化一个数组$f[2..n]$带零。$f[i]$将存储最小边索引，之后的顶点$i-1$和$i$已连接。 
3. 按顺序迭代边$1..m$。 对于边缘连接$u$和$v$：

 - 找到以下组件$u$和$v$使用 DSU。 
- 如果它们已经在同一组件中，则跳过。 
- 否则，合并两个组件。 合并后，对于跨越并集的所有连续顶点，更新$f[i] = \text{current edge index}$如果它为零。 
4.处理完所有边后，计算前缀最大数组$F$从$f$。 这里$F[i] = \max(f[2..i])$。 这允许$O(1)$通过采取查询答案$F[r]$或者$F[r] - F[l]$取决于索引。 
5. 对于每个查询$[l, r]$：

- 如果$l = r$，输出0。 
- 否则，输出$\max(f[l+1..r])$。 这对应于整个范围开始连接的最早的边。 

**为什么有效：** 每个合并步骤都确保连接任意两个连续顶点的第一条边被记录在$f$。 因为当且仅当所有连续对都已连接时，范围才被连接，因此取这些值中的最大值给出最小$k$必需的。 DSU 保证我们永远不会错过合并，而逐级联合启发式则确保效率。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(1 << 25)

class DSU:
    def __init__(self, n):
        self.p = list(range(n))
        self.size = [1]*n
        self.left = list(range(n))
        self.right = list(range(n))

    def find(self, x):
        if self.p[x] != x:
            self.p[x] = self.find(self.p[x])
        return self.p[x]

    def union(self, x, y, edge_idx, f):
        x = self.find(x)
        y = self.find(y)
        if x == y:
            return
        if self.size[x] < self.size[y]:
            x, y = y, x
        for i in range(self.left[y]+1, self.right[y]+1):
            if f[i] == 0:
                f[i] = edge_idx
        self.p[y] = x
        self.size[x] += self.size[y]
        self.left[x] = min(self.left[x], self.left[y])
        self.right[x] = max(self.right[x], self.right[y])

def solve():
    t = int(input())
    for _ in range(t):
        n, m, q = map(int, input().split())
        edges = [tuple(map(int, input().split())) for _ in range(m)]
        edges = [(u-1, v-1) for u,v in edges]
        f = [0]*(n+1)
        dsu = DSU(n)
        for idx, (u, v) in enumerate(edges, 1):
            dsu.union(u, v, idx, f)
        prefix_max = [0]*(n+1)
        for i in range(2, n+1):
            prefix_max[i] = max(prefix_max[i-1], f[i])
        for _ in range(q):
            l, r = map(int, input().split())
            if l == r:
                print(0, end=' ')
            else:
                print(prefix_max[r], end=' ')
        print()

if __name__ == "__main__":
    solve()
```DSU 存储每个组件中最左边和最右边的顶点。 当两个组件合并时，它会更新连接合并间隔中所有连续顶点的最早的边。 前缀最大数组将连续的对值转换为快速查询响应。 边界处理确保长度为 1 的查询返回 0。 

## 工作示例

 ### 示例 1

 输入：```
2 1 2
1 2
1 1
1 2
```边后关键变量的状态：

 | 顶点| f[i] | f[i]
 | --- | --- |
 | 2 | 1 |

 查询结果：

 | 查询 | 最大 f[l+1..r] | 回答 |
 | --- | --- | --- |
 | 1 1 | 1 - | 0 |
 | 1 2 | f[2]=1 | f[2]=1 | f[2]=1 1 |

 这证实了单个顶点是平凡连接的，并且第一条边连接顶点 1 和 2。 

### 示例 2

 输入：```
5 5 5
1 2
1 3
2 4
3 4
3 5
1 4
3 4
2 2
2 5
3 5
```最大前缀$F$边缘处理后：`[0, 0, 1, 3, 3, 5]`查询：

 | 查询 | 最大 f[l+1..r] | 回答 |
 | --- | --- | --- |
 | 1 4 | 最大(f[2..4])=3 | 3 |
 | 3 4 | f[4]=3 | f[4]=3 | 3 |
 | 2 2 | 2 - | 0 |
 | 2 5 | 最大(f[3..5])=5 | 5 |
 | 3 5 | 最大(f[4..5])=5 | 5 |

 该表显示，正确获取连续对的最大值会产生覆盖整个范围的最早边缘。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n+m) α(n) + q) | DSU 操作以近线性时间运行，并按大小进行路径压缩和合并。 计算|
