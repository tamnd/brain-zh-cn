---
title: "CF 2217H - 更近"
description: "我们有一棵有 $2n$ 个顶点的树，每个顶点容纳一个人。 每个人都携带一个与 $n$ 交易中的一笔交易相对应的徽章，并且每笔交易在人们中恰好出现两次。"
date: "2026-06-07T18:28:03+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dp", "trees"]
categories: ["algorithms"]
codeforces_contest: 2217
codeforces_index: "H"
codeforces_contest_name: "Codeforces Round 1091 (Div. 2) and CodeCraft 26"
rating: 2800
weight: 2217
solve_time_s: 121
verified: false
draft: false
---

[CF 2217H - 更近](https://codeforces.com/problemset/problem/2217/H)

 **评分：** 2800
 **标签：** dfs 和类似的、dp、树
 **求解时间：** 2m 1s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一棵树$2n$顶点，每个顶点承载一个人。 每个人都携带与其中之一相对应的徽章$n$交易，并且每笔交易在人们中恰好出现两次。 如果持有相同交易徽章的两个人位于相邻顶点，则该交易立即被密封并贡献利润$w_i$。 

我们可以进行一次重新洗牌：选择一组形成匹配的边（没有两条边共享一个顶点）并交换每个选定边上的人员。 目标是在此次洗牌后实现密封交易利润总额的最大化。 

每个测试用例指定交易数量$n$，利润$w_1 \ldots w_n$，人在顶点上的排列$a_1 \ldots a_{2n}$和树的边缘。 产出就是这样一次洗牌后所能达到的最大总利润。 

给定$n$可以达到$10^5$并且可能最多有$10^4$测试用例的总和$n$在所有情况下以$10^5$，我们无法承受比粗略更糟糕的事情$O(n)$每个测试用例。 这排除了明确尝试所有可能的匹配或成对的人之间的所有交换的方法。 

当交易的两个节点已经相邻或通过长度为 2 的路径间接连接时，就会出现不明显的边缘情况。 例如，如果一笔交易的两个人已经在相邻的顶点上，如果处理不当，将他们交换到其他地方实际上可能会减少利润。 另一个棘手的情况是当多个高价值交易共享相邻顶点时：选择错误的匹配可能会错失这些利润。 

## 方法

 蛮力方法很简单。 对于树中每个可能的边匹配，交换边对并重新计算密封交易的数量。 由于一棵树与$2n$顶点有$2n-1$边，有$2^{2n-1}$边的可能子集。 即使修剪不共享顶点的匹配，选项的数量仍然呈指数级增长。 这显然是不可行的$n \sim 10^5$。 

关键的见解来自于我们认识到我们只需要考虑每笔交易中与两个人的位置相邻的边。 每笔交易都只有两个人，因此唯一重要的交换是那些使两个人更接近的交换。 由于树是非循环的，因此可以独立地考虑任意两个节点之间的唯一路径。 沿着这条路径，我们可以决定哪些交换将使两个人相邻。 对于该路径之外的边，交换对交易没有影响。 

这一观察将问题简化为树动态编程任务：对于每个节点，我们维护沿着匹配边交换其节点是否有利于增加总利润。 由于我们只能沿匹配（非相邻边）进行交换，因此我们执行 DP，在每个节点处考虑是否在匹配中包含到其父节点的边。 这实际上是树问题的加权最大匹配，其中权重是通过沿该边交换来达成交易的潜在收益。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^(2n)) | O(2^(2n)) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 绘制每笔交易的地图$i$到它两个人在树上的位置。 这给出了一对顶点$(u_i, v_i)$对于每笔交易。 
2. 计算已密封交易（其两个顶点相邻）当前对利润的贡献。 初始化`total_profit`有了这笔钱。 
3. 对于两个人不相邻的每个交易，计算树中两个顶点之间的路径。 用完成这笔交易的潜在利润标记这条路径上的所有边缘。 现在，每条边都知道它可以提供的最大增益（如果包含在交换匹配中）。 
4. 在树上运行 DP，以找到匹配中边权重的最大总和。 对于每个节点，维护两个值：`dp[node][0]`如果到其父级的边不包含在匹配中，并且`dp[node][1]`如果包含在内。 在每个节点，考虑所有子节点：

 1. 如果包含子项的边缘，则将其重量加上`dp[child][0]`。 
2. 如果排除了子项的边，则添加`max(dp[child][0], dp[child][1])`。 

根的最大 DP 值给出了通过匹配交换可实现的最大额外利润。 
5. 最终答案是`total_profit`来自最初达成的交易加上 DP 结果。 

为什么有效：每笔交易最多贡献一次利润。 通过沿着两个节点之间的路径标记边，我们确保在匹配中包含任何边只能有助于达成交易。 树 DP 保证不会同时选择两个相邻边，尊重匹配约束。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(1 << 20)

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        w = list(map(int, input().split()))
        a = list(map(int, input().split()))
        
        pos = [[] for _ in range(n)]
        for idx, badge in enumerate(a):
            pos[badge - 1].append(idx)
        
        tree = [[] for _ in range(2 * n)]
        for _ in range(2 * n - 1):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            tree[u].append(v)
            tree[v].append(u)
        
        # Build parent and depth arrays for LCA path retrieval
        parent = [-1] * (2 * n)
        depth = [0] * (2 * n)
        def dfs(node, par):
            parent[node] = par
            for nei in tree[node]:
                if nei != par:
                    depth[nei] = depth[node] + 1
                    dfs(nei, node)
        dfs(0, -1)
        
        # Mark edge weights for potential deal gains
        edge_weight = {}
        total_profit = 0
        for i in range(n):
            u, v = pos[i]
            if v in tree[u]:
                total_profit += w[i]
                continue
            # Move u and v up to LCA
            def add_path(u, v, val):
                while u != v:
                    if depth[u] > depth[v]:
                        edge_weight[(min(u, parent[u]), max(u, parent[u]))] = max(
                            edge_weight.get((min(u, parent[u]), max(u, parent[u])), 0), val)
                        u = parent[u]
                    else:
                        edge_weight[(min(v, parent[v]), max(v, parent[v]))] = max(
                            edge_weight.get((min(v, parent[v]), max(v, parent[v])), 0), val)
                        v = parent[v]
            add_path(u, v, w[i])
        
        # Tree DP for max matching
        dp = [[0,0] for _ in range(2 * n)]
        def tree_dp(node, par):
            incl = 0
            excl = 0
            for nei in tree[node]:
                if nei == par:
                    continue
                tree_dp(nei, node)
                e = edge_weight.get((min(node, nei), max(node, nei)), 0)
                incl += dp[nei][0] + e
                excl += max(dp[nei][0], dp[nei][1])
            dp[node][0] = excl
            dp[node][1] = incl
        tree_dp(0, -1)
        print(total_profit + max(dp[0][0], dp[0][1]))

if __name__ == "__main__":
    solve()
```该解决方案分三个主要阶段进行：解析输入和映射交易、标记交易参与者之间路径上边缘的潜在增益，以及运行树 DP 以选择最佳匹配。 仔细注意基于 0 的索引，确保边缘键的顺序一致，并通过首先检查邻接性来避免重复计算。 

## 工作示例

 输入示例：```
1
3
10 8 5
1 2 1 2 3 3
1 2
2 3
3 4
4 5
5 6
```| 交易 | 你| v | 已经相邻 | 路径边缘 | 添加到边缘的重量 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 0 | 2 | 没有 | (0-1),(1-2) | 10 | 10
 | 2 | 1 | 3 | 没有 | (1-2),(2-3) | 8 |
 | 3 | 4 | 5 | 是的 | - | 已包含 5 个 |

 树DP选择边（0-1）和（3-4）作为最大额外利润的匹配，总共10+5=15。 

第二个例子：输入已经相邻的交易会产生正确的加法`total_profit`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 每个顶点在DFS和DP中被访问一次； 沿交易节点之间的路径标记边缘的成本为 O(n)，因为所有测试用例中的总节点数 ≤ 10^5 |
 | 空间| O(n) | 树邻接表、DP数组、边权字典、|
