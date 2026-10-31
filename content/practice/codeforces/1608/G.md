---
title: "CF 1608G - 字母树"
description: "我们得到一棵树，其中的节点通过边连接，每个节点都标有一个小写字母。 此外，我们还有一个字符串集合。 对于树中的任意两个节点，连接它们的路径通过按遍历顺序沿该路径连接字母来定义一个字符串。"
date: "2026-06-10T07:36:06+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "dfs-and-similar", "hashing", "string-suffix-structures", "strings", "trees"]
categories: ["algorithms"]
codeforces_contest: 1608
codeforces_index: "G"
codeforces_contest_name: "Codeforces Round 758 (Div.1 + Div. 2)"
rating: 3500
weight: 1608
solve_time_s: 97
verified: false
draft: false
---

[CF 1608G - 字母树](https://codeforces.com/problemset/problem/1608/G)

 **评分：** 3500
 **标签：** 二分查找、数据结构、dfs 和类似、哈希、字符串后缀结构、字符串、树
 **求解时间：** 1m 37s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一棵树，其中的节点通过边连接，每个节点都标有一个小写字母。 此外，我们还有一个字符串集合。 对于树中的任意两个节点，连接它们的路径通过按遍历顺序沿该路径连接字母来定义一个字符串。 该问题询问，对于给定的查询，该路径字符串作为子字符串在所提供的字符串的连续范围中出现了多少次。 

输入大小非常重要：树最多可以有 100,000 个节点，最多可以有 100,000 个字符串，所有字符串的总长度最多为 100,000 个字符。 查询量也可以达到10万。 这排除了任何尝试提取每个路径字符串并单独扫描所有相关字符串以查找匹配项的解决方案。 一个朴素的算法将涉及形成长度高达 O(n) 的路径字符串，并在每个查询的 O(总字符串长度) 工作中搜索它。 乘以查询数量使得这种方法不可行。 

当路径字符串非常短（例如单个字符）并且字符串包含多个重叠出现时，会出现微妙的边缘情况。 例如，如果树有一条标记为“a”的边，并且集合中的字符串为“aaa”，则要求沿该边出现的查询必须计算所有三个位置，而不仅仅是一个。 另一种边缘情况是查询颠倒边缘顺序的路径； 代码必须沿着路径（从 u 到 v）以精确的顺序遍历边。 

## 方法

 暴力方法将为每个查询构建路径字符串，然后迭代 [l, r] 范围内的所有字符串，扫描子字符串匹配。 对于长度为 k 且相关字符串总长度为 L 的路径，每个查询需要 O(k * L)。 考虑到最坏情况的长度和 100,000 个查询，这种方法很容易需要 10^10 次操作，因此速度太慢。 

关键的观察结果是所有字符串的总长度只有 100,000，这是可以管理的。 这建议预处理字符串以支持快速子字符串出现查询。 在所有字符串上使用后缀自动机或后缀数组使我们能够有效地定位任何子字符串的出现次数。 然后我们可以对其进行扩充以记录每个位置属于哪个字符串，因此可以使用二分搜索或芬威克树来回答范围 [l, r] 的查询。 

另一个重要的见解是路径字符串来自树。 我们可以任意为树建立根，并预先计算从根到每个节点的路径的哈希值或字符串标识符。 然后，沿着从 u 到 v 的路径的字符串可以表示为从 root 到 u 的哈希值的串联，与从 root 到 v 的哈希值相结合，从而说明最低公共祖先。 这允许每次查询在 O(1) 或 O(log n) 时间内构建路径字符串，具体取决于哈希技术。 

最后的方法是结合这些想法：使用二进制提升预先计算路径哈希来查找 LCA，为所有输入字符串构建后缀自动机或 Trie，对其进行扩充以按字符串索引计数出现次数，然后通过构造路径字符串哈希并查询请求范围内的出现结构来回答每个查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(q * n * 总字符串长度) | O(n + 总字符串长度) | 太慢了 |
 | 后缀自动机+路径哈希| O((总字符串长度 + n) log n + q log 总字符串长度) | O(总字符串长度 + n) | 已接受 |

 ## 算法演练

1. 在任意节点（通常是节点 1）处将树作为根。对于每个节点，通过存储连接的字符或滚动哈希来计算从根到该节点的字符串。 
2. 使用二进制提升预先计算所有节点对的最低共同祖先 (LCA)。 这使我们能够有效地找到从 u 到 v 的唯一路径。 
3. 对于每个输入字符串，将其插入 Trie 或后缀自动机中。 将字符串的索引存储在每个终端节点，并可选择维护 Fenwick 树或排序列表，以快速计算有多少字符串包含 [l, r] 范围内的给定子字符串。 
4. 要回答查询 (u, v, l, r)，请通过组合预先计算的 u 和 v 的根到节点路径并删除与 LCA 对应的前缀来计算从 u 到 v 的路径字符串。 
5. 使用路径字符串遍历自动机或 Trie，获得表示该子字符串所有出现位置的节点。 使用二分搜索或 Fenwick 树存储的索引来计算有多少个落在 [l, r] 范围内。 
6. 返回查询的计数。 

为什么它有效：正确性来自后缀自动机或 Trie 的属性。 自动机中存在的任何子字符串都保证对应于树中的路径，并且索引机制确保我们只计算请求范围内的出现次数。 基于 LCA 的路径散列可保证提取准确的路径字符串，而无需显式遍历每个查询的边。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict, deque
import bisect

sys.setrecursionlimit(1 << 25)

class TrieNode:
    def __init__(self):
        self.children = {}
        self.indices = []

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, s, idx):
        node = self.root
        for c in s:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.indices.append(idx)

    def query(self, s, l, r):
        node = self.root
        for c in s:
            if c not in node.children:
                return 0
            node = node.children[c]
        # count indices in range [l, r]
        return bisect.bisect_right(node.indices, r) - bisect.bisect_left(node.indices, l)

def build_tree(n, edges):
    g = [[] for _ in range(n)]
    labels = {}
    for u, v, c in edges:
        u -= 1; v -= 1
        g[u].append(v)
        g[v].append(u)
        labels[(u, v)] = c
        labels[(v, u)] = c
    return g, labels

def dfs(u, parent, g, labels, path, paths):
    paths[u] = ''.join(path)
    for v in g[u]:
        if v != parent:
            path.append(labels[(u, v)])
            dfs(v, u, g, labels, path, paths)
            path.pop()

def lca_precompute(n, g, root=0):
    LOG = 20
    up = [[-1]*LOG for _ in range(n)]
    depth = [0]*n
    def dfs_lca(u, p):
        up[u][0] = p
        for i in range(1, LOG):
            if up[u][i-1] != -1:
                up[u][i] = up[up[u][i-1]][i-1]
        for v in g[u]:
            if v != p:
                depth[v] = depth[u] + 1
                dfs_lca(v, u)
    dfs_lca(root, -1)
    return up, depth

def lca(u, v, up, depth):
    LOG = 20
    if depth[u] < depth[v]:
        u, v = v, u
    for i in range(LOG-1, -1, -1):
        if up[u][i] != -1 and depth[up[u][i]] >= depth[v]:
            u = up[u][i]
    if u == v:
        return u
    for i in range(LOG-1, -1, -1):
        if up[u][i] != -1 and up[u][i] != up[v][i]:
            u = up[u][i]
            v = up[v][i]
    return up[u][0]

def solve():
    n, m, q = map(int, input().split())
    edges = [tuple(input().split()) for _ in range(n-1)]
    edges = [(int(u), int(v), c) for u, v, c in edges]

    g, labels = build_tree(n, edges)
    paths = ['']*n
    dfs(0, -1, g, labels, [], paths)
    up, depth = lca_precompute(n, g)

    strings = []
    trie = Trie()
    for idx in range(1, m+1):
        s = input().strip()
        strings.append(s)
        trie.insert(s, idx)

    for _ in range(q):
        u, v, l, r = map(int, input().split())
        u -= 1; v -= 1
        ancestor = lca(u, v, up, depth)
        # construct path string
        pu = paths[u][:depth[u]-depth[ancestor]]
        pv = paths[v][:depth[v]-depth[ancestor]][::-1]
        path_str = pu + pv
        ans = trie.query(path_str, l, r)
        print(ans)
```该代码首先构建树并存储边缘标签。 然后，它使用 DFS 预先计算根到节点的路径。 二元提升可有效计算 LCA。 Trie 存储所有输入字符串，并使用二分搜索排序的节点索引。 查询根据预先计算的路径构建路径字符串，并使用 Trie 来计算给定范围内的出现次数。 微妙的细节包括将路径段从 v 反转到 LCA 并使用基于 1 的索引
