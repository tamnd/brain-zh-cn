---
title: "CF 1108F - MST 统一"
description: "给定一个有 n 个顶点和 m 个边的无向连通图，每个边都有一个正权重。 目标是通过增加一些边权重来调整它们，以便图的最小生成树（MST）保持与最初相同的成本，但变得唯一。"
date: "2026-06-12T05:19:17+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "dsu", "graphs", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1108
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 535 (Div. 3)"
rating: 2100
weight: 1108
solve_time_s: 45
verified: true
draft: false
---

[CF 1108F - MST 统一](https://codeforces.com/problemset/problem/1108/F)

 **评分：** 2100
 **标签：** 二分查找、dsu、图、贪婪
 **求解时间：** 45s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个连通的无向图`n`顶点和`m`边，每个边都有一个正权重。 目标是通过增加一些边权重来调整它们，以便图的最小生成树（MST）保持与最初相同的成本，但变得唯一。 换句话说，该图最初可能有多个总成本相同的 MST，我们希望通过稍微增加边权重而不改变总体 MST 成本来以最小的方式打破平局。 

输入将图形提供为带有端点和权重的边列表。 输出是一个整数：实现唯一 MST 所需的“加一”操作的最小数量。 

约束很严格：`n`和`m`最大可达200​​,000，边权重可达`10^9`。 任何尝试枚举所有 MST 或显式检查所有周期的解决方案都会太慢，因为即使`O(m^2)`操作是不可行的。 这表明我们需要一个大致适用于以下情况的解决方案`O(m log n)`时间，理想地将 MST 构造与识别模糊边缘的有效方法结合起来。 

微妙的边缘情况是这样的图，其中许多边具有相同的权重并且存在多个 MST。 例如，有边的三角形`(1,2,1)`,`(2,3,1)`,`(1,3,1)`具有三个 MST。 任何仅选择 MST 并增加不在其中的边的简单算法都可能会意外更改 MST 成本或增加超出所需的边。 正确的方法会仔细识别权重增量将打破平局的边，而不影响原始 MST 成本。 

## 方法

 暴力方法会尝试生成所有 MST，找到一些但不是全部 MST 中存在的边，然后递增它们。 这是有效的，因为仅当当前 MST 之外存在可以替换 MST 边缘而不增加总成本的边缘时，MST 唯一性才会失效。 然而，枚举所有 MST 是不切实际的； 即使对每个非 MST 边缘使用循环检查也会导致`O(m * n)`或者更糟。 和`n`最多`2 * 10^5`，这太慢了。 

关键的见解是，MST 模糊性仅由 MST 外部的边产生，这些边的权重等于它们在 MST 中形成的循环上的最大边权重。 如果我们考虑 MST 和非 MST 边`(u, v, w)`，它与MST形成一个循环。 如果`w`等于 MST 中该循环的最大权重，我们可以交换边并获得另一个 MST。 为了防止歧义，我们必须最小限度地增加一些非 MST 边的权重，以便它们不再与循环中的最大值匹配。 这将问题简化为计算每个非 MST 边沿其端点之间的 MST 中唯一路径的最大边权重。 

使用二进制提升可以有效地计算沿路径的最大边缘权重`O(n log n)`预处理，然后查询每个非 MST 边`O(log n)`。 总时间是`O(m log n)`，符合约束条件。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(m * n) | O(n + m) | 太慢了 |
 | 最佳| O(m log n) | O(n log n + m) | O(n log n + m) | 已接受 |

 ## 算法演练

 1. 使用 Kruskal 算法构造图的任意 MST。 存储哪些边属于 MST。 这是有效的，因为所有 MST 具有相同的总权重，并且任何 MST 都可用于分析。 
2. 将 MST 构建为树，并为 LCA 查询准备二进制提升表。 对于每个节点，以 2 的幂存储祖先以及到每个祖先的路径上的最大边权重。 这允许查询任意两个节点之间的路径上的最大权重`O(log n)`。 
3. 对于每条非 MST 边`(u, v, w)`，计算沿路径的最大边权重`u`到`v`在 MST 中使用二元升降台。 如果`w`等于该最大值，则该边可以与 MST 边交换以生成另一个 MST。 
4. 计算每个这样的边。 将其权重增加 1 将打破歧义，因为它将超过其周期中的最大权重。 最小操作数是这些关键边的总数。 
5. 输出该计数。 

工作原理：MST 唯一性相当于确保非 MST 边的权重不等于连接其端点的 MST 路径上的最大值。 该算法准确识别这些边缘并递增它们。 二值提升保证有效地对所有非 MST 边进行正确的最大路径查询。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(1 << 25)

def main():
    n, m = map(int, input().split())
    edges = []
    for _ in range(m):
        u, v, w = map(int, input().split())
        edges.append((w, u - 1, v - 1))
    edges.sort()
    
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    def union(x, y):
        x, y = find(x), find(y)
        if x == y: return False
        parent[y] = x
        return True

    mst_edges = []
    for w, u, v in edges:
        if union(u, v):
            mst_edges.append((u, v, w))
    
    # build tree for LCA
    from collections import defaultdict, deque
    adj = defaultdict(list)
    for u, v, w in mst_edges:
        adj[u].append((v, w))
        adj[v].append((u, w))
    
    LOG = 20
    up = [[-1]*LOG for _ in range(n)]
    max_edge = [[0]*LOG for _ in range(n)]
    depth = [0]*n
    
    def dfs(u, p):
        for v, w in adj[u]:
            if v == p: continue
            up[v][0] = u
            max_edge[v][0] = w
            depth[v] = depth[u] + 1
            for i in range(1, LOG):
                if up[v][i-1] != -1:
                    up[v][i] = up[up[v][i-1]][i-1]
                    max_edge[v][i] = max(max_edge[v][i-1], max_edge[up[v][i-1]][i-1])
            dfs(v, u)
    
    dfs(0, -1)
    
    def query(u, v):
        if depth[u] < depth[v]:
            u, v = v, u
        res = 0
        for i in reversed(range(LOG)):
            if up[u][i] != -1 and depth[up[u][i]] >= depth[v]:
                res = max(res, max_edge[u][i])
                u = up[u][i]
        if u == v:
            return res
        for i in reversed(range(LOG)):
            if up[u][i] != -1 and up[u][i] != up[v][i]:
                res = max(res, max_edge[u][i], max_edge[v][i])
                u, v = up[u][i], up[v][i]
        res = max(res, max_edge[u][0], max_edge[v][0])
        return res

    mst_set = set((min(u,v), max(u,v)) for u,v,w in mst_edges)
    ans = 0
    for w, u, v in edges:
        if (min(u,v), max(u,v)) in mst_set:
            continue
        if w == query(u,v):
            ans += 1
    print(ans)

if __name__ == "__main__":
    main()
```该代码首先使用 Kruskal 构造 MST 并标记 MST 边缘。 它使用邻接列表构建树结构来运行 DFS 并填充二进制提升表以实现最大边缘查询。 然后检查每个非 MST 边：如果其权重等于 MST 中沿其路径的最大值，则它是增量的候选者。 计算所有这些边就可以得出答案。 

## 工作示例

 **样品1：**```
n = 8, m = 10
edges = [
1 2 1, 2 3 2, 2 4 5, 1 4 2, 6 3 3,
6 1 3, 3 5 2, 3 7 1, 4 8 1, 6 2 4
]
```在 Kruskal 之后，MST 边包括权重 1,1,1,2,2,2,3。 边缘`(6,2,4)`位于 MST 之外，形成一个最大权重为 4 的循环。`w == max_cycle`，增加它可以解决歧义。 只有一条这样的边存在。 输出是`1`。 

**自定义输入：**```
n = 3, m = 3
edges = [
1 2 1, 2 3 1, 1 3 1
]
```所有边的权重均为 1。MST 选择任意两条。 非MST边缘`(1,3,1)`有`w == max_cycle`并且必须递增。 输出是`1`。 

| 步骤| 你| v | 路径上的最大值 | 是临界边？ | 计数|
 | --- | --- | --- | --- | --- | --- |
 | 检查 (1, | | | | |
