---
title: "CF 427C - 检查站"
description: "我们得到一个有向图，其中每个节点代表一个城市路口，每个有向边代表一条单向道路。 每个路口都有建立警察检查站的费用。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "graphs", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 427
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 244 (Div. 2)"
rating: 1700
weight: 427
solve_time_s: 94
verified: true
draft: false
---

[CF 427C - Checkposts](https://codeforces.com/problemset/problem/427/C)

 **评分：** 1700
 **标签：** dfs 和类似的、图、两个指针
 **求解时间：** 1m 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个有向图，其中每个节点代表一个城市路口，每个有向边代表一条单向道路。 每个路口都有建立警察检查站的费用。 A checkpost at junction _i_ protects all junctions reachable from _i_ and able to return to _i_, including _i_ itself. In other words, a checkpost at a node secures its strongly connected component (SCC). 目标是通过放置检查站来覆盖所有节点，以使总成本最小化，然后计算存在多少种不同的最小成本安排。 

The input size allows up to 100,000 junctions and 300,000 roads. A brute-force approach that tries all combinations of junctions is clearly infeasible, because the number of subsets grows exponentially. 我们需要一种关于节点和边的线性或近线性方法，这表明图遍历和 SCC 分解技术是合适的。 

当 SCC 包含多个节点时，会出现微妙的边缘情况。 For example, if nodes 2 and 3 form a cycle, both are mutually reachable. 我们在这个 SCC 内只需要一个检查站。 A careless approach that considers individual nodes independently may place multiple redundant checkposts, inflating the cost. Another edge case is when multiple nodes in an SCC have the same minimal cost-then the number of ways to pick the cheapest node multiplies.

 ## 方法

 The naive approach considers every node independently. 我们可以想象迭代每个交叉点，尝试在那里放置一个检查站，并测试是否通过可达性覆盖所有节点。 这种方法在理论上是正确的，因为它检查所有组合，但实际上它需要枚举节点的所有子集，复杂度为$O(2^n)$- 不可能的$n$最多 100,000。 

关键的见解是保护关系准确地反映了强连接的组件。 任何 SCC 都是最大节点集合，其中每个节点都可以到达其他每个节点。 因此，在每个SCC中放置一个检查站就足以覆盖该SCC中的所有节点，并且不需要更多的检查站。 每个 SCC 的最低成本只是其最便宜节点的成本。 在该 SCC 中选择检查站的方法数量是共享最小成本的节点的数量。 

一旦我们将图分解为 SCC，问题就简化为迭代每个 SCC，选择最小成本并计算重数。 SCC 分解可以使用 Kosaraju 或 Tarjan 算法在线性时间内完成。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n) | O(2^n) | O(n + m) | 太慢了|
 | 最优（SCC + 最小成本）| O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1.解析输入，提取节点数`n`，他们的检查站成本，边数`m`，以及有向边列表。 
2. 构造图的邻接表。 
3. 执行 Kosaraju 算法来查找 SCC。 这涉及到两遍DFS：第一遍根据完成时间将节点填充到堆栈中；第二遍根据完成时间将节点填充到堆栈中。 第二遍在转置图上按堆栈顺序处理节点以识别 SCC。 
4. 对于每个 SCC，确定最小检查站成本。 计算 SCC 中有多少个节点共享该最小成本。 
5. 将所有 SCC 的最低成本相加，得到总的最低支出。 
6. 将每个 SCC 的最小成本节点的数量相乘，取模$10^9 + 7$，得到实现成本最小的方法总数。 

工作原理：每个 SCC 形成可以相互保护的最大节点集。 通过在 SCC 内最便宜的节点放置检查站，我们可以以最小的成本覆盖其所有节点。 由于 SCC 在保护方面是不相交的，因此总的最小成本是 SCC 之间的总和。 乘法计数考虑了每个 SCC 中的独立选择。 

## Python 解决方案```python
import sys
sys.setrecursionlimit(10**6)
input = sys.stdin.readline

MOD = 10**9 + 7

def kosaraju_scc(n, adj):
    visited = [False] * n
    order = []

    def dfs1(u):
        visited[u] = True
        for v in adj[u]:
            if not visited[v]:
                dfs1(v)
        order.append(u)

    for i in range(n):
        if not visited[i]:
            dfs1(i)

    # Transpose graph
    adj_t = [[] for _ in range(n)]
    for u in range(n):
        for v in adj[u]:
            adj_t[v].append(u)

    visited = [False] * n
    sccs = []

    def dfs2(u, comp):
        visited[u] = True
        comp.append(u)
        for v in adj_t[u]:
            if not visited[v]:
                dfs2(v, comp)

    for u in reversed(order):
        if not visited[u]:
            comp = []
            dfs2(u, comp)
            sccs.append(comp)

    return sccs

def main():
    n = int(input())
    costs = list(map(int, input().split()))
    m = int(input())
    adj = [[] for _ in range(n)]
    for _ in range(m):
        u, v = map(int, input().split())
        adj[u-1].append(v-1)

    sccs = kosaraju_scc(n, adj)
    total_cost = 0
    ways = 1

    for comp in sccs:
        min_cost = min(costs[u] for u in comp)
        count = sum(1 for u in comp if costs[u] == min_cost)
        total_cost += min_cost
        ways = (ways * count) % MOD

    print(total_cost, ways)

if __name__ == "__main__":
    main()
```该代码首先构建图表并运行 Kosaraju 的算法来获取 SCC。 对于每个 SCC，它会找到最便宜的节点并计算重复项。 将最小值相加得出总成本。 将计数相乘得出方法的数量。 使用`sys.setrecursionlimit`确保大图上的 DFS 不会崩溃。 

## 工作示例

 **示例输入 1**```
3
1 2 3
3
1 2
2 3
3 2
```| 步骤| 发现 SCC | 每个 SCC 的最低成本 | 每个 SCC 的方式 | 累计总成本| 累计方式|
 | ---| ---| ---| ---| ---| ---|
 | 1 | [0], [1,2] | 1, 2 | 1,1 | 3 | 1 |

 该图分解为单个节点 SCC [0] 和一个循环 [1,2]。 最便宜的节点成本分别为 1 和 2。 在每个 SCC 中只有一种方法来选择最小值。 

**自定义输入2**```
4
1 1 2 2
4
1 2
2 1
3 4
4 3
```| 步骤| 发现 SCC | 每个 SCC 的最低成本 | 每个 SCC 的方式 | 累计总成本| 累计方式|
 | ---| ---| ---| ---| ---| ---|
 | 1 | [0,1], [2,3] | 1,2 | 2,2 | 3 | 4 |

 两个SCC，每个形成一个循环。 第一个 SCC 中的最小成本节点：节点 0,1 的成本均为 1，提供 2 种方式。 第二个 SCC：节点 2,3 的成本都是 2，给出了 2 条路。 乘以 2*2 = 4。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + m) | Kosaraju 的算法以线性时间运行。 每个 SCC 的求和和计数最小值为 O(n)。 |
 | 空间| O(n + m) | 邻接表、转置图、访问数组和 SCC 存储都与 n + m 线性缩放。 |

 给定约束 (n ≤ 10^5，m ≤ 3·10^5) 和线性时间复杂度，该解决方案很容易满足 2 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        main()
    return out.getvalue().strip()

# Provided sample
assert run("3\n1 2 3\n3\n1 2\n2 3\n3 2\n") == "3 1", "sample 1"

# Minimum-size input
assert run("1\n5\n0\n") == "5 1", "single node no edges"

# Two SCCs with multiple minimal nodes
assert run("4\n1 1 2 2\n4\n1 2\n2 1\n3 4\n4 3\n") == "3 4", "two cycles with duplicate minimums"

# All nodes same cost
assert run("3\n2 2 2\n2\n1 2\n2 3\n") == "4 1", "same cost, linear chain"

# Edge case: single cycle covering all nodes
assert run("3\n3 1 2\n3\n1 2\n2 3\n3 1\n") == "1 1", "full cycle"

# No edges, all nodes isolated
assert run("3\n1 2 3\n0\n") == "6 1", "isolated nodes"
```|
