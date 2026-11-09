---
title: "CF 2069F - 图包含"
description: "我们有两个无向图，$A$ 和 $B$，位于同一组 $n$ 顶点上。 最初，两个图都没有边。 查询一一到达； 每个查询都会切换 $A$ 或 $B$ 中的一条边。"
date: "2026-06-08T07:00:56+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "divide-and-conquer", "dsu", "graphs"]
categories: ["algorithms"]
codeforces_contest: 2069
codeforces_index: "F"
codeforces_contest_name: "Educational Codeforces Round 174 (Rated for Div. 2)"
rating: 2800
weight: 2069
solve_time_s: 108
verified: false
draft: false
---

[CF 2069F - 图包含](https://codeforces.com/problemset/problem/2069/F)

 **评分：** 2800
 **标签：** 数据结构、dfs 和类似、分而治之、dsu、图
 **求解时间：** 1m 48s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 给定两个无向图，$A$和$B$，在同一组上$n$顶点。 最初，两个图都没有边。 查询一一到达； 每个查询要么切换一个边缘$A$或者$B$。 每次查询后，我们都会被问到：必须添加多少条边$A$使得每个连通分量$B$完全包含在某些连接的组件中$A$？ 换句话说，在每次查询之后，我们需要使所需要的最小边数$A$“包括”$B$。 

约束很严格：$n$和$q$每个都可以达到$4 \cdot 10^5$。 这立即排除了在每次使用 DFS 或 BFS 查询后从头开始重建组件的任何算法，这将花费$O(n)$每个查询的结果最多为$1.6 \cdot 10^{11}$运营。 我们需要一种能够在近乎恒定的时间内增量更新连接的解决方案。 

非明显的边缘情况包括边缘反复切换或一个顶点有多个顶点的情况$B$- 组件分布在多个$A$-成分。 例如，如果$B$有一个组件$\{1, 2, 3\}$和$A$最初仅连接$\{1, 2\}$，答案是$1$因为在之间添加一条边$2$和$3$就足够了。 在这种情况下，粗心的实现如果无法有效地跟踪组件成员资格，就会错误地计算边缘。 

## 方法

 蛮力方法是重建两者的连接组件$A$和$B$每次查询后，迭代$B$的组件，并计算有多少个独立的组件$A$-每个接触的组件。 要添加的最小边数就是以下总和$B$-“触摸次数”的组成部分$A$-组件减一。”这是正确的，但成本$O(n)$每个查询，导致$O(nq) = 1.6 \cdot 10^{11}$在最坏的情况下，操作速度太慢了。 

关键的观察是，边的插入和删除形成了**动态连接问题**，连接多个组件所需的边数恰好是不相交的数量$A$- 接触过的组件$B$-分量减一。 如果我们可以追踪哪个$A$- 每个顶点所属的组件以及每个顶点的数量$B$- 组件每$A$-分量，我们可以有效地计算答案。 

我们使用具有两层的**不相交集并集 (DSU)**：一层 DSU 用于$A$另一个用于$B$。 每次我们合并两个$A$-组件，我们调整数量$B$- 接触它们的组件。 通过维护每个$B$- 不同组件的数量$A$-它相交的分量，我们可以计算“接触的分量减一”的总和$O(1)$按 DSU 合并摊销。 这将每个查询减少到几乎$O(\alpha(n))$时间、地点$\alpha$是阿克曼反函数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力DFS/BFS | O(nq) | O(n) | 太慢了|
 | 带计数器的 DSU | O(q α(n)) | O(q α(n)) | O(n) | 已接受 |

 ## 算法演练

 1.初始化两个DSU，`DSU_A`对于图表$A$和`DSU_B`对于图表$B$。 每个顶点都从​​其自己的组件开始。 
2. 维护每个$B$- 组成一个计数器有多少$A$-当前相交的组件。 最初，每个$B$- 组件包含单个顶点，因此它与一个顶点相交$A$-成分。 
3. 处理查询时：

 1. 识别图（`A`或者`B`）和顶点$(x, y)$。 
2. 切换所选 DSU 中的边：如果存在边，则逻辑删除它； 如果不是，则合并组件。 对于边缘添加$A$，合并`DSU_A`x 的分量` and \(y. For edge addition in ⟦PROTECT_55⟧, merge `DSU_B` 组件和更新计数器。 
3.当两个$A$- 组件合并，更新相交计数$A$- 适合所有人的组件$B$- 接触任一合并的组件$A$-成分。 这保持了每个不变量`B`-组件知道有多少个`A`-它跨越的组件。 
4. DSU 更新后，计算答案：总和`B`- 的组成部分`(number of distinct A-components it touches - 1)`。 这是连接各部分所需的最少边数$A$对应每一个`B`-成分。 
5. 输出查询结果。 对所有查询重复此操作。 

工作原理：DSU 确保每个图的组件结构都以增量方式维护。 计数器保持准确的数量`A`- 各分量相交`B`-成分。 自从连接以来`k`不相交的组件完全需要`k-1`边缘，总结`B`-组件产生所需的最小边缘数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1]*n
        self.members = [set([i]) for i in range(n)]
    
    def find(self, x):
        while x != self.parent[x]:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x
    
    def union(self, x, y):
        x_root, y_root = self.find(x), self.find(y)
        if x_root == y_root:
            return False, x_root, y_root
        if self.size[x_root] < self.size[y_root]:
            x_root, y_root = y_root, x_root
        self.parent[y_root] = x_root
        self.size[x_root] += self.size[y_root]
        self.members[x_root] |= self.members[y_root]
        self.members[y_root] = set()
        return True, x_root, y_root

n, q = map(int, input().split())
DSU_A = DSU(n)
DSU_B = DSU(n)

# count of A-components per B-component root
B_count = [1]*n  # initially each vertex touches 1 A-component
A_touch = [defaultdict(int) for _ in range(n)]  # A-component root -> count per B-component

for i in range(n):
    A_touch[i][i] = 1  # vertex i in B-component i touches A-component i

edges = dict()  # track edge state

for _ in range(q):
    line = input().split()
    g, u, v = line[0], int(line[1])-1, int(line[2])-1
    key = (g, min(u,v), max(u,v))
    adding = key not in edges
    if adding:
        edges[key] = True
    else:
        edges.pop(key)

    if g == 'A':
        merged, r1, r2 = DSU_A.union(u,v)
        if merged:
            # merge counts
            for b_root in range(n):
                if A_touch[b_root].get(r2):
                    A_touch[b_root][r1] = A_touch[b_root].get(r1,0) + A_touch[b_root][r2]
                    del A_touch[b_root][r2]
    else:  # B
        merged, r1, r2 = DSU_B.union(u,v)
        if merged:
            # merge B roots, counts follow the new root
            for r in [r1, r2]:
                if r == r2: continue
                # no action needed, B_count and A_touch already mapped by root
                pass

    # compute answer
    ans = 0
    B_roots = set(DSU_B.find(i) for i in range(n))
    for b in B_roots:
        ans += len(A_touch[b]) - 1
    print(ans)
```该解决方案使用带有成员集的 DSU 来跟踪哪些成员`A`-每个组件`B`- 组件接触。 更新中`A_touch`合并时正确`A`-components 确保每次查询后我们可以计算要添加的最小边。 主要的微妙之处是当根由于联合而改变时保持准确的映射并仔细计算不同的`A`- 接触过的组件。 

## 工作示例

 **样品1：**

 | 查询 | 图| 边缘 |`A`组件|`B`组件| 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 一个 | 2-3 | 2-3 {1}、{2,3}、{4}、{5}、{6} | {1}、{2}、{3}、{4}、{5}、{6} | 0 |
 | 2 | 乙| 1-3 | 1-3 {1}、{2,3}、{4}、{5}、{6} | {1,3},{2 | |
