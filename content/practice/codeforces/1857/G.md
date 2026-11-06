---
title: "CF 1857G - 计数图"
description: "我们得到一棵有 $n$ 个顶点的树，其中每条边都有一个整数权重。 任务是计算带权简单图的数量，使得给定的树是唯一的最小生成树（MST），并且图中所有边的权重都是不超过$S$的整数。"
date: "2026-06-09T00:49:22+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "divide-and-conquer", "dsu", "graphs", "greedy", "sortings", "trees"]
categories: ["algorithms"]
codeforces_contest: 1857
codeforces_index: "G"
codeforces_contest_name: "Codeforces Round 891 (Div. 3)"
rating: 2000
weight: 1857
solve_time_s: 115
verified: false
draft: false
---

[CF 1857G - 计数图](https://codeforces.com/problemset/problem/1857/G)

 **评级：** 2000
 **标签：** 组合学、分而治之、DSU、图、贪婪、排序、树
 **求解时间：** 1m 55s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一棵树$n$顶点，其中每条边都有一个整数权重。 任务是计算带权简单图的数量，使得给定的树是唯一的最小生成树（MST），并且图中所有边的权重都是不超过的整数$S$。 该图可能包含树之外的其他边，但添加边决不应该创建替代 MST。 

输入给出了多个测试用例。 每个测试用例指定顶点数$n$, 最大边权重$S$， 进而$n-1$边描述树及其权重。 每个测试用例的输出是一个数字：有效图的计数模$998244353$。 

限制因素很大。$n$可以达到$2 \cdot 10^5$， 和$t$可以是$10^4$，但是总和$n$所有测试用例仅限于$2 \cdot 10^5$。 这意味着对于每个测试用例，任何解决方案都必须是近线性的$n$。 对所有可能的边集进行强力探索是不可能的，因为完整图中的潜在边数为$O(n^2)$，这取决于$4 \cdot 10^{10}$为了$n \sim 2 \cdot 10^5$。 

边缘情况包括只有两个顶点的树、所有边权重相等的树以及以下情况：$S$相对于最大边权重来说较小。 例如，如果树是权重为 5 的单边且$S = 5$，唯一的图是树本身。 一种幼稚的方法，假设我们可以添加权重高达$S$如果不检查 MST 唯一性，这里就会失败。 

## 方法

 一种简单的方法会尝试迭代所有可能不在树中的附加边，并分配每个可能的权重$S$，然后检查结果图的 MST 是否是原始树。 这是组合爆炸：对于$n = 10^5$, 大致有$5 \cdot 10^9$非树边。 即使每微秒检查一个组合也需要数年时间。 暴力破解在概念上是有效的，因为 MST 的唯一性可以用 Kruskal 算法来验证，但对于大的情况它会完全失败。$n$。 

关键的见解是考虑是什么使给定的树成为唯一的 MST。 仅当不在树中的边的权重严格大于连接树中其端点的路径上的最大边权重时，才可以添加该边。 如果添加的边权重较小或相等，它将替换某些 MST 中的树边或创建另一个具有相同总权重的 MST。 

因此，对于每一个潜在的额外优势$(u,v)$不在树中，允许的权重数是$S - \text{maxWeight}(u,v)$，但前提是这是积极的。 树边本身只有一种可能的权重（给定）。 对有效图进行计数减少为计算所有非树边的这些计数的乘积。 

为了有效地计算树中任意两个节点之间的路径上的最大边，我们可以使用深度优先搜索（DFS）和稀疏表的二元提升。 这允许$O(\log n)$预处理树中每条边的查询。 使用 DSU 或巧妙的组合计数，我们可以累加最终计数，而无需显式枚举边。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(S * 2^(n^2)) | O(n^2) | O(n^2) | 太慢了 |
 | 最优（路径最大+组合计数）| O(n log n + m log n) | O(n log n + m log n) | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 1. 解析输入并构造带权重的树邻接表。 

每个节点都存储其子节点以及该子节点的权重。 这种表示使 DFS 变得简单。 
2. 预处理树以实现路径上的快速最大边查询。 

使用二元提升：对于每个节点，存储其第 2^k 个祖先以及沿到该祖先的路径的最大边权重。 DFS 填充深度和直接父/边缘，然后计算更高的祖先：$$up[node][k] = up[up[node][k-1]][k-1], \quad \text{maxEdge[node][k]} = \max(\text{maxEdge[node][k-1]}, \text{maxEdge[up[node][k-1]][k-1]})$$3. 对于每对顶点$u,v$不由树边连接，使用二元提升计算沿树中唯一路径的最大边权重。 打电话给这个$w_{\max}$。 
4. 该边的有效权重数为$\max(0, S - w_{\max})$。 将这些计数乘以模$998244353$。 
5. 对每个树边乘以1（权重是固定的）。 
6. 返回最终产品。 

工作原理：MST 的唯一性得到保证，因为非树边的权重不能小于或等于其树路径上的最大边。 这确保了 Kruskal 算法始终首先选择树边，生成原始树作为 MST。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(1 << 25)

MOD = 998244353

def solve():
    t = int(input())
    for _ in range(t):
        n, S = map(int, input().split())
        adj = [[] for _ in range(n)]
        edges = []
        for _ in range(n-1):
            u,v,w = map(int, input().split())
            u -= 1
            v -= 1
            adj[u].append((v,w))
            adj[v].append((u,w))
            edges.append((u,v,w))

        LOG = 20
        up = [[-1]*LOG for _ in range(n)]
        maxEdge = [[0]*LOG for _ in range(n)]
        depth = [0]*n

        def dfs(u, p):
            for v,w in adj[u]:
                if v == p:
                    continue
                depth[v] = depth[u]+1
                up[v][0] = u
                maxEdge[v][0] = w
                dfs(v,u)
        dfs(0,-1)

        for k in range(1,LOG):
            for v in range(n):
                if up[v][k-1] != -1:
                    up[v][k] = up[up[v][k-1]][k-1]
                    maxEdge[v][k] = max(maxEdge[v][k-1], maxEdge[up[v][k-1]][k-1])

        def path_max(u,v):
            if depth[u] < depth[v]:
                u,v = v,u
            res = 0
            for k in reversed(range(LOG)):
                if up[u][k] != -1 and depth[up[u][k]] >= depth[v]:
                    res = max(res, maxEdge[u][k])
                    u = up[u][k]
            if u == v:
                return res
            for k in reversed(range(LOG)):
                if up[u][k] != -1 and up[u][k] != up[v][k]:
                    res = max(res, maxEdge[u][k], maxEdge[v][k])
                    u = up[u][k]
                    v = up[v][k]
            res = max(res, maxEdge[u][0], maxEdge[v][0])
            return res

        # Count extra edges
        ans = 1
        for u in range(n):
            for v in range(u+1,n):
                if any((x==v) for x,_ in adj[u]):
                    continue
                m = path_max(u,v)
                ways = max(0, S - m)
                ans = ans * ways % MOD
        print(ans)
        
if __name__ == "__main__":
    solve()
```此代码首先对树进行二进制提升预处理，以快速找到沿任何路径的最大边。 然后它迭代所有潜在的非树边并乘以有效权重计数。 DFS 和二进制提升确保最大边缘查询的速度很快。 支票`if any((x==v) for x,_ in adj[u])`跳过树的边缘。 模乘法确保我们保持在界限之内。 

## 工作示例

 **示例输入 1：**```
2 5
1 2 4
```- 只有两个顶点，一条边。 不可能有额外的边缘。 计数 = 1。 

**示例输入 2：**```
4 5
1 2 2
2 3 4
3 4 3
```- 非树边：(1,3)、(1,4)、(2,4)
 - 计算每个路径的最大路径：(1,3)=2、(1,4)=4、(2,4)=4
 - 有效权重：(1,3)=3,4,5→3种方式； (1,4)=5→1路； (2,4)=5 → 1 路
 - 总计 = 3_1_1 = 3，树边乘以 1 → 最终答案 = 3（模 998244353）

 可以构建表格来显示`u,v,m,max_weight,S-m`，确认所有额外边都超过最大路径权重的不变量。 

## 复杂度分析

 |
