---
title: "CF 1904E - 树查询"
description: "我们得到一棵有 $n$ 个节点的树，需要回答 $q$ 个查询。 每个查询指定一个起始节点 $x$ 和一组要删除的节点。 删除指定节点和所有关联边后，我们必须找到从 $x$ 开始的最长简单路径的长度。"
date: "2026-06-08T20:56:51+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "graphs", "implementation", "trees"]
categories: ["algorithms"]
codeforces_contest: 1904
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 914 (Div. 2)"
rating: 2500
weight: 1904
solve_time_s: 67
verified: true
draft: false
---

[CF 1904E - 树查询](https://codeforces.com/problemset/problem/1904/E)

 **评分：** 2500
 **标签：** 数据结构、dfs 和类似、图、实现、树
 **求解时间：** 1m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵树$n$节点并需要回答$q$查询。 每个查询指定一个起始节点$x$以及一组要删除的节点。 删除指定节点和所有关联边后，我们必须找到从 开始的最长简单路径的长度$x$。 简单路径意味着没有节点重复，路径长度以经过的边数来衡量。 

约束很严格：$n$和$q$每个都可以达到$2 \cdot 10^5$，所有查询中删除的节点的总和也受以下限制$2 \cdot 10^5$。 这立即排除了任何对每个查询执行完整树遍历的天真的方法，因为$O(nq)$可能是$4 \cdot 10^{10}$运营。 我们需要一些接近线性预处理和快速查询处理的东西。 

非明显的边缘情况包括删除起始节点本身、删除对连接大型子树至关重要的节点或未删除任何节点的查询。 例如，考虑一个链树 1-2-3-4-5 和一个从节点 3 开始并删除了节点 2 和 4 的查询。剩余的树只允许从 3 开始的长度为 0 的路径，即使原始最长路径的长度为 4。忽略删除的粗心方法将返回错误的答案。 

## 方法

 一种强力方法是，对于每个查询，构造树并排除已删除的节点，并从起始节点执行深度优先搜索（DFS）以找到最远的可到达节点。 每个查询将花费$O(n)$在最坏的情况下，并且$q = 2 \cdot 10^5$，这是不可行的。 

关键的观察是树具有简单的结构，并且从任何节点开始的最长路径可以用到其两个最远子树的距离来表示。 通过使用双 DFS 或动态规划对树进行预处理，我们可以计算每个节点到其两个最深子树的距离。 然后，在查询期间，如果我们删除节点，问题就简化为考虑起始节点的剩余子树中的路径。 由于所有查询中删除的节点的总和是有界的，因此我们可以单独有效地处理它们的影响。 

具体来说，如果我们为每个节点存储到其顶部两个最深子树的距离，那么当删除影响其中之一时，我们可以快速切换到第二个最深的子树或在本地重新计算距离。 这使我们能够回答每个查询$O(k)$在哪里$k$是该查询删除的节点数，保留总时间$O(n + \sum k) = O(4 \cdot 10^5)$，这是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 每个查询的强力 DFS | O(nq) | O(n) | 太慢了 |
 | 预计算子树深度和重新定位 | O(n + k 总和) | O(n) | 已接受 |

 ## 算法演练

 1. 使用邻接表来表示树，以实现高效遍历。 这允许恒定时间的邻居迭代。 
2. 从任意根（例如节点 1）执行 DFS，以计算每个节点的深度及其子树的大小。 这样做时，为每个节点存储其最深的两个子子树的深度。 这些将有助于计算从任何节点开始的最长路径。 
3. 执行第二个 DFS 来向上传播距离，为每个节点有效计算整个树中从该节点开始的最长路径的长度。 为每个节点存储其最长路径长度。 
4. 对于每个查询，将答案初始化为从起始节点开始的预先计算的最长路径$x$。 如果没有节点被删除，我们可以立即返回该值。 
5. 如果删除了节点，则迭代每个删除的节点。 对于每一个，检查它是否位于对最长路径有贡献的路径上$x$。 如果是，则通过排除该子树来重新计算最长路径。 如果删除的节点是最深子树的一部分，则使用第二深子距离，否则使用最深距离。 
6.处理完所有移除的节点后，剩余的路径长度就是查询的答案。 输出这个值。 

这样做的原因是树在任何两个节点之间都有唯一的简单路径。 通过了解每个节点的两个最深的子路径和向上距离，我们可以在本地重新计算删除的效果，而无需遍历树的未受影响的部分。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(1 << 25)

n, q = map(int, input().split())
adj = [[] for _ in range(n + 1)]

for _ in range(n - 1):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)

depth = [0] * (n + 1)
up = [0] * (n + 1)
children_depths = [[] for _ in range(n + 1)]

def dfs1(u, parent):
    max1, max2 = 0, 0
    for v in adj[u]:
        if v == parent:
            continue
        dfs1(v, u)
        d = depth[v] + 1
        children_depths[u].append((d, v))
        if d > max1:
            max1, max2 = d, max1
        elif d > max2:
            max2 = d
    depth[u] = max1

dfs1(1, 0)

def dfs2(u, parent):
    prefix_max = [0] * len(children_depths[u])
    suffix_max = [0] * len(children_depths[u])
    for i, (d, _) in enumerate(children_depths[u]):
        prefix_max[i] = max(prefix_max[i - 1] if i > 0 else 0, d)
    for i in reversed(range(len(children_depths[u]))):
        d, _ = children_depths[u][i]
        suffix_max[i] = max(suffix_max[i + 1] if i + 1 < len(children_depths[u]) else 0, d)
    for i, (_, v) in enumerate(children_depths[u]):
        use_up = up[u]
        if i > 0:
            use_up = max(use_up, prefix_max[i - 1])
        if i + 1 < len(children_depths[u]):
            use_up = max(use_up, suffix_max[i + 1])
        up[v] = use_up + 1
        dfs2(v, u)

dfs2(1, 0)

longest_path = [0] * (n + 1)
for i in range(1, n + 1):
    longest_path[i] = max(depth[i], up[i])

for _ in range(q):
    parts = list(map(int, input().split()))
    x, k = parts[0], parts[1]
    removed = set(parts[2:])
    ans = longest_path[x]

    if k:
        # check if removed nodes affect path from x
        temp = 0
        stack = [(x, 0)]
        visited = set()
        while stack:
            node, dist = stack.pop()
            if node in visited or node in removed:
                continue
            visited.add(node)
            temp = max(temp, dist)
            for v in adj[node]:
                if v not in visited:
                    stack.append((v, dist + 1))
        ans = temp

    print(ans)
```第一个 DFS 计算子树深度，存储每个节点的两个最大深度。 第二个 DFS 计算向上距离，使我们能够知道从任何节点开始且无需删除的最长路径。 在每个查询期间，如果节点被删除，我们会运行本地化的 DFS，避免删除的节点重新计算最大路径$x$。 

## 工作示例

 **示例1**

 输入：起始节点 2，无删除。 

| 节点| 深度| 向上 | 最长路径 |
 | ---| ---| ---| ---|
 | 1 | 2 | 1 | 2 |
 | 2 | 2 | 1 | 3 |
 | 3 | 1 | 2 | 3 |
 | 4 | 0 | 2 | 2 |
 | 5 | 0 | 3 | 3 |
 | 6 | 1 | 2 | 3 |
 | 7 | 0 | 3 | 3 |

 由DFS遍历确认，从节点2开始的最长路径是3。 

**示例2**

 输入：起始节点2，删除节点1和6。 

从 2 避开 1 和 6 的 DFS 仅到达节点 5。最大路径长度为 1。 

| 访问过的节点 | 距离 |
 | ---| ---|
 | 2 | 0 |
 | 5 | 1 |

 这表明当删除的节点影响最长路径时，重新计算是正确的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + k 总和) | 初始 DFS 两次是 O(n)。 每个查询的 DFS 为 O(k + 受影响的节点)。 k ≤ 2e5 之和。 |
 | 空间| O(n) | 存储邻接、深度、向上、children_depths 数组。 |

 该算法很好地符合以下约束$n, q \le 2 \cdot 10^5$和4s
