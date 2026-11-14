---
title: "CF 402E - 严格正矩阵"
description: "给定一个大小为 $n 乘以 n$ 的方阵 $a$，其元素均为非负整数。 该矩阵可以被认为是具有 $n$ 个节点的图的加权邻接矩阵，其中 $a{ij} 0$ 表示从节点 $i$ 到节点 $j$ 的直接边。"
date: "2026-06-07T01:23:32+07:00"
tags: ["codeforces", "competitive-programming", "graphs", "math"]
categories: ["algorithms"]
codeforces_contest: 402
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 236 (Div. 2)"
rating: 2200
weight: 402
solve_time_s: 248
verified: true
draft: false
---

[CF 402E - 严格正矩阵](https://codeforces.com/problemset/problem/402/E)

 **评分：** 2200
 **标签：** 图表、数学
 **求解时间：** 4m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个方阵$a$尺寸的$n \times n$其元素均为非负整数。 该矩阵可以被认为是图的加权邻接矩阵$n$节点，其中$a_{ij} > 0$表示来自节点的直接边$i$到节点$j$。 

任务是判断是否存在正整数$k$使得矩阵的幂$k$，表示为$a^k$，产生一个矩阵，其中每个条目都是严格正的。 这相当于询问，用图的术语来说，每个节点是否可以精确地到达每个其他节点$k$沿着由原始边缘形成的路径步进。 

限制因素很大。$n$可以大到 2000，因此任何尝试显式计算的解决方案$a^k$天真地乘以矩阵是立即不可行的。 单个矩阵乘法是$O(n^3)$，在最坏的情况下已经是 80 亿次操作——太慢了。 

微妙的边缘情况是由断开的节点或块引起的。 例如，考虑单位矩阵：```
2
1 0
0 1
```这里，矩阵的任何幂都不能连接非对角元素，所以答案是“否”。 一种简单的方法，简单地检查是否$a$如果忽略矩阵的可达性结构，具有非零元素可能会错误地说“是”。 

另一个不明显的情况是循环排列：```
3
0 1 0
0 0 1
1 0 0
```该矩阵最终在以下位置变为严格正数：$a^3$因为每个节点都可以通过三步到达其他所有节点。 一个粗心的实现，只检查$a$或者$a^2$会失败的。 

将这个问题理解为图可达性问题是提高效率的关键。 

## 方法

 蛮力方法很简单：重复将矩阵与其自身相乘，并在每次相乘后检查所有元素是否为正。 开始于$a$， 然后$a^2$， 然后$a^3$， 等等。 当所有元素均为正值或矩阵稳定时停止。 这是正确的，因为矩阵乘法精确地模拟了长度增加的路径的组合。 然而，最坏情况的复杂度是$O(n^4)$如果我们乘以$n$次，因为每次乘法都是$O(n^3)$。 为了$n = 2000$，这是完全不切实际的。 

最佳方法利用图论。 将矩阵解释为有向图的邻接矩阵。 每个非零条目表示一条边。 当且仅当图是**强连通**时，矩阵在某些幂上才变得严格为正，这意味着从每个节点到每个其他节点都有一条路径。 使用深度优先搜索 (DFS) 或广度优先搜索 (BFS) 两次可以有效地检查强连通性：一次在原始图上，一次在转置图上。 这将复杂性降低到$O(n^2)$，因为我们只需要遍历所有边，并且每次遍历邻接矩阵都会花费$O(n^2)$在最坏的情况下。 

蛮力之所以有效，是因为它确实构建了可达性矩阵，但由于每次乘法的立方成本和所需乘法的未知数量，它会失败。 图方法之所以有效，是因为强大的连通性保证了正幂的存在，而与矩阵中的实际数值无关。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^4) | O(n^4) | O(n^2) | O(n^2) | 太慢了 |
 | 图形连接 | O(n^2) | O(n^2) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 从矩阵构造邻接图$a$。 对于每一个$a_{ij} > 0$，从节点添加有向边$i$到节点$j$。 这抽象了数值并仅关注可达性。 
2. 选择任意节点，例如节点 1，并执行 DFS 以标记原始图中从该节点可到达的所有节点。 如果有任何节点未被访问，则该图不是强连通的，我们可以立即返回“NO”。 
3. 通过反转所有边来构造图的转置。 这会翻转可达性的方向。 
4. 从转置图中的同一节点执行 DFS。 如果有任何节点未被访问，则原始图不是强连接的，我们返回“NO”。 
5.如果两次DFS遍历都访问了所有节点，则该图是强连通的。 这保证了存在一些正整数$k$这样$a^k$严格来说是正数，所以我们返回“YES”。 

**为什么起作用**：DFS 检查确保每个节点都可以到达每个其他节点（原始图），并且每个节点都可以从每个其他节点（转置图）到达。 这两个条件共同构成了强连通性的定义。 线性代数的 Perron-Frobenius 定理保证强连通非负矩阵的幂严格为正，这正是我们所需要的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(5000)

def main():
    n = int(input())
    adj = [[] for _ in range(n)]
    for i in range(n):
        row = list(map(int, input().split()))
        for j in range(n):
            if row[j] > 0:
                adj[i].append(j)

    visited = [False] * n

    def dfs(v, graph):
        visited[v] = True
        for u in graph[v]:
            if not visited[u]:
                dfs(u, graph)

    # Check reachability from node 0
    dfs(0, adj)
    if not all(visited):
        print("NO")
        return

    # Check reachability in the transposed graph
    adj_t = [[] for _ in range(n)]
    for i in range(n):
        for j in adj[i]:
            adj_t[j].append(i)

    visited = [False] * n
    dfs(0, adj_t)
    if not all(visited):
        print("NO")
    else:
        print("YES")

if __name__ == "__main__":
    main()
```该代码首先将矩阵转换为邻接表。 DFS 确保原始图中和转置图中的每个节点都可以从起始节点到达。 使用邻接表而不是重复矩阵相乘对于保持在时间限制内至关重要。 增加递归限制可以处理最坏情况图上 DFS 的最大深度。 

## 工作示例

 **样品1**

 输入：```
2
1 0
0 1
```| 步骤| DFS 访问（原件）| DFS 访问（转置）|
 | ---| ---| ---|
 | 启动节点 0 | [对，错] | - |
 | 转置 DFS | - | [对，错] |

 两次 DFS 遍历都没有访问节点 1，因此输出为“NO”。 这演示了断开连接的块的处理。 

**定制样品2**

 输入：```
3
0 1 0
0 0 1
1 0 0
```| 步骤| DFS 访问（原件）| DFS 访问（转置）|
 | ---| ---| ---|
 | 启动节点 0 | [真实，真实，真实] | - |
 | 转置 DFS | - | [真实，真实，真实] |

 两个图中的所有节点均可到达，因此输出为“YES”。 这表明循环确保了最终的积极性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n^2) | O(n^2) | 每个DFS遍历所有边； 最多可以有 n^2 条边。 |
 | 空间| O(n^2) | O(n^2) | 邻接表在最坏的情况下可能会存储所有的边； 访问数组使用 O(n)。 |

 为了$n \le 2000$，该算法最多执行 400 万次操作，时间完全低于 1 秒。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    main()
    return sys.stdout.getvalue().strip()

# provided sample
assert run("2\n1 0\n0 1\n") == "NO", "sample 1"

# custom cases
assert run("3\n0 1 0\n0 0 1\n1 0 0\n") == "YES", "cyclic 3x3"
assert run("2\n1 1\n1 1\n") == "YES", "all ones"
assert run("2\n0 1\n0 0\n") == "NO", "single direction, not strongly connected"
assert run("4\n0 1 0 0\n0 0 1 0\n0 0 0 1\n1 0 0 0\n") == "YES", "4-cycle"
assert run("2\n0 0\n0 0\n") == "NO", "all zeros"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 3周期| 是 | 循环可达性导致最终的积极性|
 | 所有的| 是 | 矩阵已完全连接|
 | 单向| 否 | 单向连接，|
