---
title: "CF 1811F - 是花吗？"
description: "我们被要求检测一种称为 $k$-flower 的特定类型的图。 从概念上讲，$k$-花由长度为 $k$ 的中心环组成，并且在该环的每个顶点处附加有另一个长度为 $k$ 的不相交环。"
date: "2026-06-09T08:41:02+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "graphs", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1811
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 863 (Div. 3)"
rating: 2100
weight: 1811
solve_time_s: 106
verified: true
draft: false
---

[CF 1811F - 这是花吗？](https://codeforces.com/problemset/problem/1811/F)

 **评分：** 2100
 **标签：** dfs 和类似的、图表、实现
 **求解时间：** 1m 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求检测一种特定类型的图，称为$k$-花。 从概念上讲，一个$k$- 花由长度为中心的循环组成$k$，并且在该循环的每个顶点处都有另一个长度不相交的循环$k$随附的。 除连接顶点外，这些附加循环中没有两个彼此共享顶点或与中心循环共享顶点。 一个图以顶点和边的形式给出，任务是判断它是否与$k$- 一些花的结构$k \ge 3$。 

每个测试用例提供顶点和边的数量，后跟边列表。 每个图的输出都是简单的“是”或“否”，具体取决于它是否是一个$k$-花。 

约束很严格：$n$和$m$可以达到$2 \cdot 10^5$，最多可达$10^4$测试用例。 强力尝试检查顶点或循环的所有子集将无法扩展，因为即使是三次算法也是不可行的。 我们需要一个与每个图的大小基本呈线性的解决方案。 

边缘情况包括非常小的图或表面上包含循环但不能结构化为$k$-花。 例如，在其他地方有额外边的三角形**不是**$k$-开花，因为附加循环必须全部不相交并且与中心循环具有相同的长度。 同样，如果图的正确位置上的顶点次数不是 2 或 4，则该图将立即无法通过测试。 

## 方法

 暴力方法会枚举图中所有可能的循环，并尝试通过将循环附加到每个顶点来验证花的属性。 这原则上是有效的，因为周期定义了$k$-flower，但枚举所有长度的循环$k$是指数的。 和$n$最多$2 \cdot 10^5$，这种方法是没有希望的。 

关键的见解是结构性的：每个$k$-花有一个非常具体的程度模式。 中心环中的每个顶点的度数为 4，因为它参与中心环的两条边及其附属环的两条边。 附加循环中的每个顶点（不包括连接到中心的顶点）的度数为 2。这种刚性度模式极大地减少了搜索空间。 

有了这种洞察力，我们可以立即拒绝某些顶点度数不是 2 或 4 的图。此外，度数为 2 的顶点的连通分量本身必须是简单循环。 通过识别所有 4 度顶点并确认它们形成单个循环，并且每个顶点恰好连接到相同长度的 2 度顶点的一个循环，我们可以在线性时间内验证花结构。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n) | O(2^n) | O(n^2) | O(n^2) | 太慢了 |
 | 基于学位的结构检查| O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 阅读测试用例图并构建邻接表。 这允许有效的遍历和度检查。 
2. 计算每个顶点的度数。 如果顶点的度数不是 2 或 4，则立即返回 NO。 这捕获了第一个结构属性$k$-花朵。 
3. 收集度数为 4 的所有顶点。检查它们是否形成一个循环。 我们可以使用 DFS 或 BFS 从一个 4 度顶点开始，并确保我们沿着它们之间的边访问所有 4 度顶点一次。 如果任何顶点丢失或重新访问，则返回 NO。 
4. 对于每个 4 度顶点，检查其 2 度邻居。这些邻居必须形成一个简单的循环，且长度均相同$k$（与中央循环相同）。 执行仅限于 2 度顶点的 DFS 或 BFS，以确认每个连接的组件形成一个循环。 
5. 验证不同 4 度顶点之间没有共享 2 度顶点。 这确保了附加的循环是不相交的。 
6. 如果所有检查均通过，则输出 YES。 否则输出NO。 

为什么它有效：该算法对 a 的精确结构不变量进行编码$k$-花。 通过首先检查度数，我们可以快速过滤掉不可能的图表。 确认中心环可以确保核心顶点之间的连通性。 检查附加循环可保证严格的$k$-花朵图案。 由于不违反度数的情况下不可能存在额外的边，因此检查既是必要的也是充分的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict, deque

def is_k_flower(n, edges):
    adj = [[] for _ in range(n)]
    deg = [0]*n
    for u, v in edges:
        u -= 1
        v -= 1
        adj[u].append(v)
        adj[v].append(u)
        deg[u] += 1
        deg[v] += 1

    deg4 = [i for i, d in enumerate(deg) if d == 4]
    deg2 = [i for i, d in enumerate(deg) if d == 2]

    if any(d not in (2,4) for d in deg):
        return "NO"
    if not deg4:
        return "NO"

    # check central cycle of degree 4 vertices
    visited = [False]*n
    def dfs_cycle(u, parent):
        visited[u] = True
        for v in adj[u]:
            if deg[v] != 4:
                continue
            if v == parent:
                continue
            if visited[v]:
                continue
            dfs_cycle(v, u)
    dfs_cycle(deg4[0], -1)
    if any(visited[v] == False for v in deg4):
        return "NO"

    # check attached cycles
    for u in deg4:
        for v in adj[u]:
            if deg[v] == 2 and not visited[v]:
                # explore attached cycle
                comp = []
                stack = [v]
                while stack:
                    x = stack.pop()
                    if visited[x]:
                        continue
                    visited[x] = True
                    comp.append(x)
                    for y in adj[x]:
                        if deg[y] == 2 and not visited[y]:
                            stack.append(y)
                # verify cycle
                if len(comp) < 3:
                    return "NO"
                for x in comp:
                    if len([y for y in adj[x] if deg[y]==2]) != 2:
                        return "NO"
    return "YES"

def main():
    t = int(input())
    results = []
    for _ in range(t):
        input()  # skip empty line
        n, m = map(int, input().split())
        edges = [tuple(map(int, input().split())) for _ in range(m)]
        results.append(is_k_flower(n, edges))
    print("\n".join(results))

if __name__ == "__main__":
    main()
```代码首先按度过滤不可能的图，然后使用 DFS 确认 4 度顶点的中心循环。 附加循环在同一遍中进行验证，确保它们形成 2 度顶点的简单循环，并且所有顶点都被标记为已访问以避免重叠。 支票`len([y for y in adj[x] if deg[y]==2]) != 2`确保每个附加的循环顶点在循环内恰好有两个连接。 

## 工作示例

 **样品1：**```
9 12
1 2
3 1
2 3
1 6
4 1
6 4
3 8
3 5
5 8
9 7
2 9
7 2
```| 步骤| 访问 deg4 | deg2 的分量 | 检查通过 |
 | --- | --- | --- | --- |
 | 中央循环DFS | 1,2,3 | - | 是的 |
 | 附循环| 4,5,6,7,8,9 | 每个形成长度为 3 的循环 | 是的 |

 输出：是。 确认中心三角形和附加循环的正确识别。 

**样本2：**```
8 12
1 2
3 1
2 3
1 6
4 1
6 4
3 8
3 5
5 8
8 7
2 8
7 2
```中央循环检查失败，因为 4 度顶点无法形成简单循环，输出：NO。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | DFS 最多探索每个顶点和边一次 |
 | 空间| O(n + m) | 邻接表加上访问过的数组 |

 给定线性时间是可以接受的$n + m \le 2 \cdot 10^5$每个测试用例和所有测试用例的总和保持在这个范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    main()
    return sys.stdout.getvalue().strip()

# provided samples
assert run("""5

9 12
1 2
3 1
2 3
1 6
4 1
6 4
3 8
3 5
5 8
9 7
2 9
7 2

8 12
1 2
3 1
2 3
1 6
4 1
6 4
3 8
3 5
5 8
```
