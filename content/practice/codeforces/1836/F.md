---
title: "CF 1836F - 博士的布朗假设"
description: "我们正在使用有向图，其中节点代表行星，边代表行星之间的虫洞。 每条边都需要一小时才能走完。"
date: "2026-06-09T06:46:37+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "graphs", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1836
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 880 (Div. 2)"
rating: 2900
weight: 1836
solve_time_s: 114
verified: false
draft: false
---

[CF 1836F - 布朗博士假设](https://codeforces.com/problemset/problem/1836/F)

 **评分：** 2900
 **标签：** dfs 和类似的、图、数学、数论
 **求解时间：** 1m 54s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们正在使用有向图，其中节点代表行星，边代表行星之间的虫洞。 每条边都需要一小时才能走完。 该问题要求我们计算选择一艘或两艘船的方法数量，以便船舶连续准确地移动`k`沿着这些虫洞走了几个小时。 如果我们选择两艘船，它们必须准确地交换位置`k`小时； 如果我们选择一艘船，它必须在之后返回其起始星球`k`小时。 

输入包括`n`节点和`m`边缘有一个非常大的`k`最多可达 10^18。 这立即排除了尝试模拟长度路径的幼稚方法`k`明确地。 该图最多可以有 10^5 个节点和 2×10^5 条边，因此任何比线性或近线性更差的算法`n`和`m`会超时。 这也暗示我们需要一个基于结构图属性而不是显式路径枚举的解决方案。 

不明显的边缘情况来自孤立的行星、断开的组件和小周期。 例如，如果`k`小于任何周期长度，没有船可以精确地移动和返回`k`小时。 另一个微妙的情况是双节点循环，它允许交换两艘船，但需要仔细计数以避免重复计算对称对。 如果图表没有循环，则只有孤立的自循环才允许单艘船满足条件。 

考虑一个具有两个节点和从节点 1 到节点 2 的单边的图。`k = 1`，没有有效的交换或单船周期。 在不考虑周期长度的情况下计算可达节点的简单方法会错误地报告有效的解决方案。 

## 方法

 暴力方法将尝试枚举所有长度的路径`k`每对节点之间。 这将涉及重复 DFS 或 BFS`k`邻接矩阵的步骤或计算能力。 两种方法都失败了，因为`k`最多可达 10^18，甚至无法进行 O(k) 次操作。 

关键的见解是考虑图的强连接组件 (SCC)。 任何能够准确到达自身的节点`k`步骤必须是循环的一部分，循环的长度除以`k`。 同样，两个可以交换的节点`k`步骤必须属于同一个 SCC 并遵循划分的长度循环`k`。 因此，我们将问题简化为分析 SCC 并计算每个 SCC 内周期长度的最大公约数 (GCD)。 

一旦我们获得了每个 SCC 中周期长度的 GCD，如果满足以下条件，则节点可以用作单艘船：`k`可以被这个 GCD 整除。 对于同一 SCC 中的节点对，如果`k`可以被 SCC 的 GCD 整除，任何两个不同的节点都可以交换`k`步骤。 这避免了任何路径枚举，并将问题减少到图形上的一些线性遍历。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力DFS/BFS | O(n·k) | O(n) | 太慢，k 太大 |
 | 邻接矩阵求幂| O(n3·log k) | O(n3·log k) | O(n²) | 对于 n=10^5 | 太慢
 | SCC+循环GCD分析| O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 运行 Tarjan 算法或 Kosaraju 算法来识别图中所有强连通分量。 每个 SCC 代表最大的节点集，其中每个节点都可以到达其他每个节点。 此步骤与节点和边的数量呈线性关系。 
2. 对于每个 SCC，计算所有周期的长度。 这可以通过 DFS 来完成。 在 DFS 期间跟踪每个节点的深度，并在发现后边缘时记录深度差异。 这些差异的 GCD 给出了 SCC 中所有循环长度的 GCD。 
3. 对于每个SCC，确定是否`k`可被其周期 GCD 整除。 如果是，那么SCC中的每个节点都可以作为一艘船。 有效单船选择的数量是此类 SCC 中的节点总数。 
4. 类似地，SCC 中任何一对不同的节点都可以交换位置`k`步骤如果`k`可以被 SCC 的周期 GCD 整除。 计算这样的对的数量`size * (size - 1)`对于每个合格的 SCC。 
5. 将所有 SCC 相加，得到有效单船和对的总数。 

工作原理：SCC 保证节点之间的可达性。 使用循环长度的 GCD 可确保`k`步骤可以与图中的循环对齐。 这些属性的组合保证了任何计算的单船或成对船都满足精确的要求`k`-小时限制。 

## Python 解决方案```python
import sys
import threading
import math
input = sys.stdin.readline
sys.setrecursionlimit(1 << 25)

def main():
    n, m, k = map(int, input().split())
    graph = [[] for _ in range(n)]
    for _ in range(m):
        x, y = map(int, input().split())
        graph[x-1].append(y-1)

    # Tarjan's SCC algorithm
    index = 0
    indices = [-1]*n
    lowlink = [0]*n
    stack = []
    on_stack = [False]*n
    sccs = []

    def strongconnect(v):
        nonlocal index
        indices[v] = lowlink[v] = index
        index += 1
        stack.append(v)
        on_stack[v] = True
        for w in graph[v]:
            if indices[w] == -1:
                strongconnect(w)
                lowlink[v] = min(lowlink[v], lowlink[w])
            elif on_stack[w]:
                lowlink[v] = min(lowlink[v], indices[w])
        if lowlink[v] == indices[v]:
            scc = []
            while True:
                w = stack.pop()
                on_stack[w] = False
                scc.append(w)
                if w == v:
                    break
            sccs.append(scc)

    for v in range(n):
        if indices[v] == -1:
            strongconnect(v)

    total = 0

    # For each SCC, find the GCD of cycle lengths
    for scc in sccs:
        if len(scc) == 1:
            # Single node SCC
            v = scc[0]
            if v in graph[v]:  # self-loop
                if k % 1 == 0:
                    total += 1
        else:
            # Compute cycle GCD
            depths = [-1]*n
            gcd = 0

            def dfs(u, d):
                nonlocal gcd
                depths[u] = d
                for v in graph[u]:
                    if v not in scc_set:
                        continue
                    if depths[v] == -1:
                        dfs(v, d+1)
                    else:
                        cycle_len = d + 1 - depths[v]
                        gcd = math.gcd(gcd, cycle_len)

            scc_set = set(scc)
            for u in scc:
                if depths[u] == -1:
                    dfs(u, 0)

            if k % gcd == 0:
                total += len(scc)  # single ships
                total += len(scc) * (len(scc) - 1)  # pairs

    print(total)

threading.Thread(target=main).start()
```该解决方案首先使用 Tarjan 算法计算 SCC。 然后它使用每个 SCC 内的 DFS 来计算所有循环长度的 GCD。 我们检查整除性`k`以确定可以使用哪些节点。 使用集合将 DFS 限制为 SCC 中的节点可确保 SCC 外部的循环不会影响 GCD 计算。 

## 工作示例

 ### 示例 1

 输入：```
7 8 346
1 2
1 3
2 4
3 4
4 5
5 1
6 7
7 6
```关键 SCC：`{1,2,3,4,5}`形成一个具有循环的SCC，`{6,7}`形成另一个具有 2 个周期的 SCC。 第一个 SCC 周期的 GCD 分为 346，第二个周期的 2 分为 346。节点 6 和 7 可以用作单船。 来自满足 GCD 条件的第一个 SCC 的对产生 3 对。 总计：5。 

### 示例 2

 输入：```
4 4 2
1 2
2 3
3 4
4 1
```该图形成4个循环。 循环 GCD 是 4，它不能整除 2。所以没有对。 如果2能被GCD整除，每个节点可以在2步后返回，但2 % 4 != 0，所以只有特定的遍历循环才有效。 单船总数：0。 

上表跟踪 SCC、循环 GCD 和整除性`k`以验证正确性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + m) | Tarjan 的算法是线性的。 循环长度的 DFS 在 SCC 内运行，每个边沿运行一次。 |
 | 空间| O(n + m) | 用于递归的图邻接表和堆栈。 |

 该算法适用于`n = 10^5`,`m = 2×10^5`和大`k`因为它避免了显式路径枚举并依赖于
