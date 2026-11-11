---
title: "CF 2122D - 交通灯"
description: "The problem describes a connected, simple undirected graph with n vertices and m edges. 令牌在时间 0 处从顶点 1 开始。在每个整数秒 t 处，如果令牌位于顶点 u，您有两种选择：要么在 u 处等待一秒，要么沿着 u 的特定边缘移动。"
date: "2026-06-08T03:42:04+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "divide-and-conquer", "dp", "graphs", "greedy", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 2122
codeforces_index: "D"
codeforces_contest_name: "Order Capital Round 1 (Codeforces Round 1038, Div. 1 + Div. 2)"
rating: 2400
weight: 2122
solve_time_s: 51
verified: true
draft: false
---

[CF 2122D - 交通灯](https://codeforces.com/problemset/problem/2122/D)

 **评分：** 2400
 **标签：** 暴力破解、数据结构、分而治之、dp、图、贪心、最短路径
 **求解时间：** 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题描述了一个连通的、简单的无向图`n`顶点和`m`边缘。 令牌从顶点开始`1`在某个时间`0`。 在每个整数秒`t`，如果令牌位于顶点`u`，您有两个选择：要么等待一秒钟`u`，或沿着特定边缘移动`u`。 您可以使用的边缘由以下因素决定`(t mod deg(u)) + 1`， 在哪里`deg(u)`是顶点的度数`u`边按照它们在输入中出现的顺序进行索引。 每个动作，无论是等待还是移动，都只花费一秒钟。 

任务是找到将令牌从顶点移动所需的最小总时间`1`到顶点`n`，以及在实现此最小总时间的所有策略中，最小化总等待时间的策略。 

输入允许多个测试用例。 每个图最多有`5000`所有测试用例的顶点总数，最多`5·10^5`总计边数。 这意味着具有时间复杂度的算法`O(n·m)`或稍高一些都是可行的，但是每个测试用例的任何二次方都可能很容易超出时间限制。 基于模的运动引入了与时间相关的边缘约束，这阻止了在未经修改的情况下使用标准 BFS 或 Dijkstra 等简单的最短路径算法。 

边缘情况包括由于模阶与所需路径不对齐而需要等待才能到达顶点的图。 例如，度数的顶点`2`连接到目标顶点可能需要等待几秒钟才能使用“正确”边。 当最佳路径涉及在两个顶点之间来回移动以将时间与未来的移动同步时，就会出现另一个微妙的情况。 在这种情况下，忽略模约束的朴素 BFS 将失败。 

## 方法

 暴力方法将使用存储的 BFS 来模拟每条可能的路径和每一个等待决策`(vertex, time)`州。 这是可行的，因为在给定当前时间和顶点的情况下，移动是确定性的，但状态数量快速增长：理论上，时间在朴素 BFS 中可以是无界的，即使我们将其限制为`n*m`，状态数量变得太大`n=5000`和`m≈10^5`。 

关键的见解是基于模的边选择为每个顶点创建了输出边的确定性调度。 这使我们能够将问题建模为改进的 BFS，其中下一个状态不仅取决于顶点，还取决于以顶点度数为模的时间。 具体来说，对于顶点`u`和`deg(u)`边缘，我们只需要跟踪时间模`deg(u)`对于每个顶点，因为之后`deg(u)`秒该模式重复。 因此，我们存储`dist[u][r]`作为到达的最短总时间`u`什么时候`t % deg(u) == r`。 我们可以使用状态队列执行 BFS`(vertex, time, wait)`并传播总时间和累计等待时间。 

这种方法将状态数量减少到`sum(deg(u))`跨越所有顶点，其边界为`2*m`。 每条边仅针对相关模状态进行松弛，导致时间复杂度大致为`O(m + n)`每个测试用例，它完全符合限制。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解 BFS 开启`(vertex, time)`| O(n_m_max_time) | O(n_m_max_time) | O(n*max_time) | O(n*max_time) | 太慢了 |
 | 具有模状态的 BFS | O(m + n) | O(m + n) | 已接受 |

 ## 算法演练

 1. 解析输入并按照给定的顺序构造每个顶点的邻接列表。 
2.初始化一个距离数组`dist[u][r]`对于每个顶点`u`和余数`r`模数`deg(u)`。 将所有条目设置为无穷大，除了`dist[1][0] = 0`因为我们从时间 0 的顶点 1 开始。 
3. 用起始状态初始化一个BFS队列`(1, 0, 0)`，其中第三个元素是总等待时间。 
4. 当队列不为空时，弹出`(u, t, wait)`：

 a. 计算`r = t % deg(u)`。 

b. 移动的确定性边缘是`adj[u][r]`。 如果沿着这条边移动会产生更小的`dist[v][(t+1) % deg(v)]`， 推`(v, t+1, wait)`进入队列并更新`dist`。 

c. 考虑等待`u`。 如果`dist[u][(r+1) % deg(u)] > t+1`， 推`(u, t+1, wait+1)`并更新`dist`。 
5. BFS结束后，到达顶点的所有状态中`n`，找到总时间最少的一个。 如果多个总时间相同，请选择等待时间最少的一个。 
6、输出最小总时间和对应的等待时间。 

正确性依赖于 BFS 始终探索每个顶点的每个模状态的最早时间的不变性。 由于等待确定性地使时间增加 1，而移动遵循确定性的模调度，因此 BFS 确保以最小的总时间访问每个状态。 明确地跟踪等待允许在等效的总时间路径之间打破平局。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        adj = [[] for _ in range(n + 1)]
        deg = [0] * (n + 1)
        for _ in range(m):
            u, v = map(int, input().split())
            adj[u].append(v)
            adj[v].append(u)
            deg[u] += 1
            deg[v] += 1
        
        # distance: dist[u][r] = (total_time, wait_time)
        dist = [ [ (float('inf'), float('inf')) for _ in range(deg[u] or 1) ] for u in range(n + 1)]
        dist[1][0] = (0, 0)
        q = deque()
        q.append( (1, 0, 0) )  # vertex, time, wait
        
        while q:
            u, t, w = q.popleft()
            d = deg[u] or 1
            r = t % d
            # move along deterministic edge
            if deg[u] > 0:
                v = adj[u][r]
                nr = (t + 1) % deg[v]
                if (t+1, w) < dist[v][nr]:
                    dist[v][nr] = (t+1, w)
                    q.append( (v, t+1, w) )
            # wait
            nr = (r + 1) % d
            if (t+1, w+1) < dist[u][nr]:
                dist[u][nr] = (t+1, w+1)
                q.append( (u, t+1, w+1) )
        
        # pick best for vertex n
        res = min(dist[n])
        print(res[0], res[1])

if __name__ == "__main__":
    solve()
```该解决方案在跟踪度数的同时构建邻接列表。 这`dist`数组存储元组`(total_time, waiting_time)`对于每个模状态。 BFS 确保每个状态都被最优访问。 等待时间被明确地计算并与总时间一起传播。 我们按字典顺序比较元组，这自然会优先考虑较小的总时间，然后是较小的等待。 

## 工作示例

 ### 示例 1

 输入：```
6 6
1 2
2 3
3 4
4 6
1 5
5 6
```| 时间 | 顶点| 等待| 边缘移动| 笔记|
 | ---| ---| ---| ---| ---|
 | 0 | 1 | 0 | 等待| t%deg=0，最好等待 |
 | 1 | 1 | 1 | 移动 1-5 | t%deg=1 选择边缘为 5 |
 | 2 | 5 | 1 | 等待| 对齐移动到 6 |
 | 3 | 5 | 2 | 移动 5-6 | 达到目标 |
 | 4 | 6 | 2 | - | 完成 |

 输出：`4 2`### 示例 2

 输入：```
4 3
1 2
1 3
1 4
```| 时间 | 顶点| 等待| 边缘移动| 笔记|
 | ---| ---| ---| ---| ---|
 | 0 | 1 | 0 | 移动 1-2 | t%deg=0 选择边缘为 2 |
 | 1 | 2 | 0 | 移动 2-1 | 仅有一条边回到 1 |
 | 2 | 1 | 0 | 移动 1-4 | t%deg=2 选择边缘为 4 |
 | 3 | 4 | 0 | - | 完成 |

 输出：`3 0`该轨迹表明，基于模的确定性边缘决定了最佳等待和移动。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(m + n) | 各州`(vertex, time mod deg)`最多被访问一次，总状态 ≤ 2*m |
 | | | |
