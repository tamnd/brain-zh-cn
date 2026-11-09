---
title: "CF 208E - 血亲"
description: "我们被赋予了一个有根的森林，每个人最多有一个父母。 如果我们沿着父指针向上，我们最终会到达根或脱离结构。 这定义了树的集合。 “第 k 个祖先”意味着应用父关系 k 次。"
date: "2026-06-03T17:24:34+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "dfs-and-similar", "trees"]
categories: ["algorithms"]
codeforces_contest: 208
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 130 (Div. 2)"
rating: 2100
weight: 208
solve_time_s: 110
verified: false
draft: false
---

[CF 208E - 血亲表亲](https://codeforces.com/problemset/problem/208/E)

 **评分：** 2100
 **标签：** 二分查找、数据结构、dfs 和类似、树
 **求解时间：** 1m 50s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被赋予了一个有根的森林，每个人最多有一个父母。 如果我们沿着父指针向上，我们最终会到达根或脱离结构。 这定义了树的集合。 

“第 k 个祖先”意味着应用父关系 k 次。 因此，1-祖先是父代，2-祖先是父代的父代，依此类推，前提是链存在。 

对于每个由一个人 v 和一个距离 p 组成的查询，我们被要求计算有多少其他人与 v 共享相同的第 p 个祖先。换句话说，我们查看从 v 爬上 p 个步骤获得的节点 u，然后计算整个森林中有多少个节点也将 u 作为其第 p 个祖先。 答案排除了 v 本身。 

这些约束使我们远离任何每次查询的遍历。 对于多达 100000 个节点和 100000 个查询，每个查询向上走 p 步的解决方案在最坏的情况下会变成二次方。 即使是显式预先计算所有祖先的解决方案也需要太多内存。 

关键结构是祖先关系由树中的深度固定，因此在距离 p 处共享相同祖先的节点在 DFS 排序中形成连续分组。 这建议对子树结构进行预处理，以便我们可以回答“子树中存在给定深度的节点数”。 

一个微妙的边缘情况来自于第 p 个祖先不存在的节点。 如果 v 太浅，则答案必须为零。 另一种情况是存在多个根时，因为输入是森林，而不是一棵树。 任何基于 DFS 的解决方案都必须正确处理多个根。 

## 方法

 直接方法通过遍历指针来计算每个查询节点的第 p 个祖先，然后扫描整个节点集以计算匹配项。 这是正确的，但速度非常慢。 在最坏的情况下，每个查询可能需要 O(n) 时间复杂度，从而导致 O(nm) 次操作，这在 10^10 规模下是不可行的。 

更好的视角来自于扭转问题。 我们可以固定一个节点 u 并问：有多少个节点以 u 作为其第 p 个祖先，而不是问“谁共享我的第 p 个祖先”？ 这取决于以 u 为根的子树的结构及其内部的深度分布。 

如果我们从每个根运行 DFS，我们可以记录进入时间和子树范围。 我们还计算每个节点的深度。 那么对于任何节点u，其子树中的所有节点都出现在欧拉巡演顺序中的连续段中。 其中，深度 height[u] + p 处的节点正是其第 p 个祖先为 u 的节点。 

因此，我们需要以下形式的快速查询：在 u 的子树中，有多少个节点的深度恰好为 d。 这成为一个经典的离线分组问题。 我们存储按深度分组的节点，并为每个深度维护一个 DFS 进入时间的排序列表。 然后，每个查询减少为该列表上仅限于子树间隔的两个二分搜索。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力祖先行走| O(纳米) | O(n) | 太慢了 |
 | DFS + 深度桶 + 二分查找 | O((n + m) log n) | O((n + m) log n) | O(n) | 已接受 |

 ## 算法演练

1. 使用父数组为林构建邻接表。 每个父节点为 0 的节点都被视为根。 这确保我们可以独立遍历每棵树。 
2. 从每个根运行DFS，为每个节点分配深度并记录其进入时间tin 和退出时间tout。 DFS顺序保证任意节点的子树在欧拉之旅中形成连续的区间。 
3. 对于每个深度值，维护出现在该深度的节点的进入时间列表。 这以保留 DFS 排序的方式按级别对节点进行分组。 
4. 对于查询 (v, p)，使用预先计算的二进制提升表计算 u = v 以上的祖先 p 步。 如果 u 不存在，则立即返回 0，因为没有节点可以共享不存在的祖先。 
5. 一旦找到u，我们就需要计算子树(u)中深度等于深度[u] + p的节点。 我们获取与该目标深度相对应的列表，并使用二分搜索计算有多少个进入时间位于 [tin[u], tout[u]] 内。 
6. 如果 v 本身包含在范围内，则返回此计数减 1，因为问题要求“其他人”，不包括 v。 

它的工作原理基于树上 DFS 的两个结构特性。 首先，子树中的所有节点完全对应于欧拉巡演顺序中的连续段。 其次，深度在祖先到后代的差异上是恒定的，因此第 p 个祖先是 u 的节点必须恰好位于 u 下面的 p 层及其子树内部。 这两个约束唯一地表征了有效节点，因此通过深度桶和子树间隔的交集对它们进行计数不会过度计数或错过任何有效节点。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(200000)

n = int(input())
parent = list(map(int, input().split()))

g = [[] for _ in range(n)]
roots = []

for i, p in enumerate(parent):
    if p == 0:
        roots.append(i)
    else:
        g[p - 1].append(i)

LOG = 17
up = [[-1] * n for _ in range(LOG)]
depth = [0] * n
tin = [0] * n
tout = [0] * n
timer = 0

depth_nodes = {}

def dfs(v, p):
    global timer
    tin[v] = timer
    timer += 1

    up[0][v] = p
    for i in range(1, LOG):
        if up[i - 1][v] != -1:
            up[i][v] = up[i - 1][up[i - 1][v]]

    d = depth[v]
    if d not in depth_nodes:
        depth_nodes[d] = []
    depth_nodes[d].append(tin[v])

    for to in g[v]:
        depth[to] = d + 1
        dfs(to, v)

    tout[v] = timer - 1

for r in roots:
    dfs(r, -1)

def lift(v, k):
    for i in range(LOG):
        if v == -1:
            return -1
        if k & (1 << i):
            v = up[i][v]
    return v

m = int(input())
out = []

for _ in range(m):
    v, p = map(int, input().split())
    v -= 1
    u = lift(v, p)

    if u == -1:
        out.append("0")
        continue

    target_depth = depth[u] + p
    arr = d
```
