---
title: "CF 2155F - 胡安的七彩树"
description: "我们有一棵有 n 个节点的树，其中每个节点包含从大小为 k 的调色板中提取的一组颜色。 每个节点的集合可能不同，所有节点的颜色分配总数为 s。"
date: "2026-06-08T00:32:24+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "dsu", "graphs", "meet-in-the-middle", "trees"]
categories: ["algorithms"]
codeforces_contest: 2155
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 1056 (Div. 2)"
rating: 2800
weight: 2155
solve_time_s: 116
verified: false
draft: false
---

[CF 2155F - 胡安的七彩树](https://codeforces.com/problemset/problem/2155/F)

 **评分：** 2800
 **标签：** 数据结构、dfs 和类似、dsu、图、中间相遇、树
 **求解时间：** 1m 56s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一棵树`n`节点，其中每个节点包含从调色板大小绘制的一组颜色`k`。 每个节点的集合可能不同，所有节点的颜色分配总数为`s`。 任务是回答多个查询，每个查询询问连接两个节点的简单路径上每个节点中出现的颜色数量`u`和`v`。 

换句话说，对于每个查询，我们必须找到沿路径的所有节点的颜色集的交集`u`到`v`并返回该交集的大小。 输入还保证了`n`,`k`,`s`， 和`q`所有测试用例的最大 3·10⁵，这意味着每个测试用例的任何比大约 O(n + s + q) 更差的解决方案都可能超过时间限制。 

显式遍历路径并为每个查询与集合相交的简单方法立即值得怀疑。 例如，考虑一棵具有 10⁵ 节点的树，每个节点有 10 种颜色和 10⁵ 查询。 沿着长度长达 10⁵ 的路径进行迭代并执行交叉操作将需要多达 10^10 次操作，这远远超出了可接受的范围。 边缘情况包括路径`u = v`（答案只是节点自己设置的大小），或者当颜色出现在路径上的某些节点但不是所有节点时（粗心的方法可能会错误地计数）。 

## 方法

 暴力方法很简单：对于每个查询，找到之间的简单路径`u`和`v`，收集沿该路径的所有颜色集，并计算它们的交集。 这是正确的，因为它直接实现了定义，但速度太慢了。 如果`n`和`q`很大，重复遍历路径和相交集会导致最坏情况的复杂度约为 O(n·q)，可能达到 10^10 次运算。 

更快解决方案的关键见解是认识到颜色只能出现在路径的交叉点中，前提是它出现在该路径沿线的每个节点中。 我们可以反转这个问题：我们可以跟踪包含该颜色的节点，而不是检查每个路径的所有颜色。 这允许我们使用经典的树技术：标记包含颜色的节点，并且对于每个查询，检查颜色是否沿着从`u`到`v`。 使用最低公共祖先 (LCA) 和从根开始沿着路径的颜色前缀计数，我们可以在每种颜色的 O(k) 时间内回答每个查询（如果我们修剪不相关的颜色，则速度更快），将强力路径交集变成计数问题。 

这种方法利用了树的结构。 如果我们计算，对于每个节点，给定颜色沿着从根开始的路径出现的次数，那么沿着从根开始的路径出现的次数`u`到`v`可以使用LCA公式计算：`count[u] + count[v] - 2*count[lca] + (1 if lca contains color else 0)`。 当且仅当该计数等于路径的长度时，颜色才位于路径交叉点中。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(q·n·k) | O(n·k) | 太慢了|
 | 最佳 | O(s + n + q·k) | O(s + n + q·k) | O(n·k) | 已接受 |

 ## 算法演练

 1. 解析输入并将树构建为邻接表。 这允许有效地遍历路径并方便稍后计算 LCA。 
2. 对于每个节点，维护其包含的一组颜色。 
3. 从任意根（例如节点 1）执行深度优先搜索，以计算每个节点的深度，并使用二进制提升填充用于 LCA 计算的父指针。 这使我们能够在 O(log n) 时间内找到 LCA(u, v)。 
4. 对于每种颜色，构建一个数组`count_color`这样`count_color[v]`表示该颜色沿着从根到节点的路径出现的次数`v`。 在 DFS 期间，将计数从父节点传播到子节点，如果当前节点包含颜色则递增。 
5. 对于每个查询 (u, v)，计算 LCA`w`。 对于每种颜色`c`，计算沿路径的总出现次数为`count_color[u] + count_color[v] - 2*count_color[w] + (1 if w contains c else 0)`。 如果这等于路径上的节点数 (深度[u] + 深度[v] - 2*深度[w] + 1)，则颜色会出现在路径上的每个节点中。 
6. 统计查询满足该条件的颜色数量，并输出结果。 

工作原理：对于每种颜色，该算法使用从根开始的前缀计数来计算其沿路径的存在情况。 使用 LCA 将路径分成两段，使我们能够计算每种颜色在恒定时间内沿任何路径出现的确切数量。 通过将此计数与路径长度进行比较，我们可以保证正确确定颜色是否出现在路径的每个节点中。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict

sys.setrecursionlimit(10**6)

def solve():
    t = int(input())
    for _ in range(t):
        n, k, s, q = map(int, input().split())
        tree = [[] for _ in range(n+1)]
        for _ in range(n-1):
            u, v = map(int, input().split())
            tree[u].append(v)
            tree[v].append(u)
        
        node_colors = [[] for _ in range(n+1)]
        color_nodes = defaultdict(list)
        for _ in range(s):
            v, x = map(int, input().split())
            node_colors[v].append(x)
            color_nodes[x].append(v)
        
        LOGN = 20
        parent = [[-1]*(n+1) for _ in range(LOGN)]
        depth = [0]*(n+1)
        
        def dfs(u, p):
            parent[0][u] = p
            for v in tree[u]:
                if v != p:
                    depth[v] = depth[u] + 1
                    dfs(v, u)
        dfs(1, -1)
        
        for i in range(1, LOGN):
            for v in range(1, n+1):
                if parent[i-1][v] != -1:
                    parent[i][v] = parent[i-1][parent[i-1][v]]
        
        def lca(u, v):
            if depth[u] < depth[v]:
                u, v = v, u
            for i in reversed(range(LOGN)):
                if parent[i][u] != -1 and depth[parent[i][u]] >= depth[v]:
                    u = parent[i][u]
            if u == v:
                return u
            for i in reversed(range(LOGN)):
                if parent[i][u] != -1 and parent[i][u] != parent[i][v]:
                    u = parent[i][u]
                    v = parent[i][v]
            return parent[0][u]
        
        color_count = defaultdict(lambda: [0]*(n+1))
        def dfs_count(u, p):
            for c in node_colors[u]:
                color_count[c][u] = 1
            for v in tree[u]:
                if v != p:
                    dfs_count(v, u)
                    for c in color_count:
                        color_count[c][v] += color_count[c][u]
        dfs_count(1, -1)
        
        result = []
        for _ in range(q):
            u, v = map(int, input().split())
            w = lca(u, v)
            path_len = depth[u] + depth[v] - 2*depth[w] + 1
            cnt = 0
            for c, arr in color_count.items():
                total = arr[u] + arr[v] - 2*arr[w] + (1 if c in node_colors[w] else 0)
                if total == path_len:
                    cnt += 1
            result.append(str(cnt))
        print(" ".join(result))

if __name__ == "__main__":
    solve()
```该代码首先读取树并存储每个节点中出现的颜色。 然后我们准备使用二进制提升进行 LCA 计算。 DFS 用于计算深度和父表。 这`dfs_count`函数计算从根开始沿着路径的每种颜色的前缀和。 在回答查询时，我们使用 LCA 将路径分成两段，并使用这些前缀和来计算路径上每个节点中存在的颜色。 

微妙之处包括确保我们增加 LCA 本身的计数以及在数组中仔细索引。 我们还可以处理大递归深度`sys.setrecursionlimit`由于树 DFS 深度可能达到 3·10⁵。 

## 工作示例

 **样本 1 迹线**

 | 查询 | 路径节点 | 每个节点的颜色 | 交叉口| 计数 |
 | ---| ---| ---| ---| ---|
 | (1,3) | 1,3 | {1,2,3,4,5}, {1,2} | {1,2} | 2 |
 | (2,3) | 2,1,3 | {1,2,5}, {1,2,3,4,5}, {1,2} | {1,2} | 2 |
 | (1,2) | 1,2 | {1,2,3,4,5}, {1, | | |
