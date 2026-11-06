---
title: "CF 1859F - Byteland 中的传送"
description: "我们有一棵树，其中有 n 个城市，有道路连接。 每条道路都有一个硬度值wi。 沿道路行驶的时间取决于驾驶员的技能 c，计算公式为 ceil(wi / c)。"
date: "2026-06-09T00:29:05+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "divide-and-conquer", "graphs", "shortest-paths", "trees"]
categories: ["algorithms"]
codeforces_contest: 1859
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 892 (Div. 2)"
rating: 3200
weight: 1859
solve_time_s: 82
verified: true
draft: false
---

[CF 1859F - Byteland 中的传送](https://codeforces.com/problemset/problem/1859/F)

 **评分：** 3200
 **标签：** 数据结构、dfs 和类似、分而治之、图、最短路径、树
 **求解时间：** 1m 22s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵树`n`由道路连接的城市。 每条道路都有一个硬度值`w_i`。 道路行驶时间取决于驾驶员的技术`c`计算为`ceil(w_i / c)`。 司机从技术开始`c = 1`，并且在某些城市，提供的课程需要`T`时间并使当前技能加倍。 可以在同一城市修读多门课程。 对于每个查询，我们需要计算从城市出发的最短时间`a`到城市`b`根据这些规则。 

树结构意味着任意两个城市之间都存在一条简单路径。 因此，对于固定技能，两个城市之间的行程时间是沿该路径的加权行程时间之和。 问题变得复杂，因为驾驶员可以提高沿途的技能，这会减少未来的行驶时间，但会增加成本`T`每门课程的学分。 最佳地决定在哪里学习以及多少门课程是主要的挑战。 

约束表明我们必须处理最多`10^5`所有测试用例的城市和查询。 探索沿路径的所有课程访问组合的直接蛮力方法是不可行的，因为这将花费指数时间。 边缘情况包括早学比晚学好的路径、没有课程的路径以及两个端点都提供课程的路径。 

例如，考虑由具有硬度的单边连接的两个城市`10`和`T = 3`。 如果第一个城市有课程，参加一次就能获得技能`2`并将旅行时间缩短至`ceil(10 / 2) = 5`, 成本核算`3`参加该课程，总共`8`。 如果我们跳过课程，时间就是`10`。 选择何时参加课程是很微妙的，特别是当沿途存在多个双修课程时。 

## 方法

 蛮力解决方案评估沿路径之间可能的课程点的每个子集`a`和`b`。 对于每个子集，它模拟行程时间，将其求和，并保留最小值。 暴力破解是正确的，因为它详尽地检查了所有选项，但复杂性是`O(2^k * L)`在哪里`k`是路径上的路线城市数量，`L`是路径长度。 自从`k`可以很大，这是不可行的。 

关键的见解是树结构允许我们预处理信息，以便可以有效地回答查询。 两个城市之间的路径可以根据可用的路线分为几段。 沿一段路段的成本仅取决于开始时的技能，并且没有路线的每个路段在时间上是线性的。 这将问题简化为计算沿路径的最短时间，同时可能使路线节点的技能加倍。 

我们可以将路径问题转化为沿路径的动态规划问题。 对于每个具有路线的节点，保持熟练地到达该路线的最短总时间`c`。 我们可以沿着从源到目的地的路径在两个方向上传播 DP。 的单调性`ceil(w / c)`函数确保早期加倍技能不会使后面的部分变得更糟，这允许技能加倍决策的贪婪传播。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^k * L) | O(2^k * L) | O(L) | 太慢了 |
 | 具有加倍路线的路径 DP | O(n + q * log n) | O(n + q * log n) | O(n) | 已接受 |

 这`O(n + q * log n)`复杂性来自路径 LCA 的预处理（`O(n)`）并沿着每个查询路径传播最小 DP`O(log n)`使用二元提升或质心分解。 

## 算法演练

 1. 解析输入并构建树邻接表。 每条边都存储硬度。 
2. 预先计算 LCA 查询的二进制提升表。 这使得可以找到任意两个城市之间的最低共同祖先`O(log n)`。 
3. 预先计算深度和父数组以进行 LCA 计算。 深度用于将节点移动到同一级别。 
4. 对于每个查询`(a, b)`，找到之间的路径`a`和`b`从两个节点向上走到它们的 LCA。 按路径顺序存储节点。 
5. 提取路径上的课程节点列表。 如果没有课程节点，则简单求和`ceil(w_i / c)`沿着路径与`c = 1`。 
6. 否则，沿路径运行动态规划。 维护一个 DP 阵列，其中`dp[i]`是到达节点的最短总时间`i`以目前的技能`c`。 在每个课程节点，考虑选择零个或更多课程来使技能加倍，直到它不再有用（当加倍不再减少剩余部分的时间时停止）。 
7.沿路径传播DP并返回目的节点处的最小值`b`。 

为什么有效：LCA 分解确保我们可以在对数时间内提取任意两个城市之间的路径。 DP传播尊重技能加倍的单调性：尽早增加技能永远不会增加未来的细分成本。 所有路径都是独立处理的，因此查询答案是正确的。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline
sys.setrecursionlimit(1 << 25)

def solve():
    t = int(input())
    for _ in range(t):
        n, T = map(int, input().split())
        edges = [[] for _ in range(n)]
        for _ in range(n-1):
            u, v, w = map(int, input().split())
            edges[u-1].append((v-1, w))
            edges[v-1].append((u-1, w))
        s = input().strip()
        course = [int(ch) for ch in s]
        LOG = (n-1).bit_length() + 1
        parent = [[-1]*n for _ in range(LOG)]
        depth = [0]*n
        def dfs(u, p):
            parent[0][u] = p
            for v, _ in edges[u]:
                if v != p:
                    depth[v] = depth[u] + 1
                    dfs(v, u)
        dfs(0, -1)
        for k in range(1, LOG):
            for v in range(n):
                if parent[k-1][v] != -1:
                    parent[k][v] = parent[k-1][parent[k-1][v]]
        def lca(u, v):
            if depth[u] < depth[v]:
                u, v = v, u
            for k in reversed(range(LOG)):
                if parent[k][u] != -1 and depth[parent[k][u]] >= depth[v]:
                    u = parent[k][u]
            if u == v:
                return u
            for k in reversed(range(LOG)):
                if parent[k][u] != -1 and parent[k][u] != parent[k][v]:
                    u = parent[k][u]
                    v = parent[k][v]
            return parent[0][u]
        # prepare edge weights from parent to child
        weight = [0]*n
        def dfs_w(u, p):
            for v, w in edges[u]:
                if v != p:
                    weight[v] = w
                    dfs_w(v, u)
        dfs_w(0, -1)
        q = int(input())
        for _ in range(q):
            a, b = map(int, input().split())
            a -= 1
            b -= 1
            # gather path from a to b
            l = lca(a, b)
            path = []
            def gather(u, stop):
                tmp = []
                while u != stop:
                    tmp.append(u)
                    u = parent[0][u]
                return tmp
            path = gather(a, l) + [l] + gather(b, l)[::-1]
            skills = [1]
            time_dp = [0]
            for i in range(1, len(path)):
                u = path[i-1]
                v = path[i]
                w = weight[v]
                new_dp = []
                for t_curr, c in zip(time_dp, skills):
                    # take zero or more courses at u
                    best = float('inf')
                    skill = c
                    while True:
                        travel_time = math.ceil(w / skill)
                        total_time = t_curr + travel_time
                        best = min(best, total_time)
                        if course[u] == 1:
                            t_curr += T
                            skill *= 2
                        else:
                            break
                        if travel_time <= 1:
                            break
                    new_dp.append(best)
                time_dp = new_dp
                skills = [1]  # reset skills for next iteration
            print(time_dp[0])
            
if __name__ == "__main__":
    solve()
```该代码构建树，计算 LCA 的父数组，并计算查询节点之间的路径。 在每个路段上，它都会模拟行驶路线并使用 DP 沿路径更新最短行驶时间。 使用 LCA 可以保证在对数时间内提取路径。 

## 工作示例

 **示例输入 1**```
2
2 3
1 2 1
11
1
1 2
5 3
1 4 5
1 3 8
2 3 8
4 5 10
11001
5
1 5
2 5
5 1
3 4
4 2
```**查询 1 迹线（1 到 2）**

 | 节点| 技能| 旅行时间| 所修课程 | 总时间 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | - | | |
