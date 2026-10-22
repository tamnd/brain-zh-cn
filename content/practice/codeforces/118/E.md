---
title: "CF 118E - 伯敦道路"
description: "我们给出了一个表示 Bertown 道路网络的无向连通图，其中路口是节点，道路是边。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "graphs"]
categories: ["algorithms"]
codeforces_contest: 118
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 89 (Div. 2)"
rating: 2000
weight: 118
solve_time_s: 136
verified: false
draft: false
---

[CF 118E - Bertown 道路](https://codeforces.com/problemset/problem/118/E)

 **评级：** 2000
 **标签：** dfs 和类似的、图表
 **求解时间：** 2m 16s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们给出了一个表示 Bertown 道路网络的无向连通图，其中路口是节点，道路是边。 目前每条道路都允许双向交通，但我们的任务是为每条道路分配一个方向，以便生成的有向图保持强连接。 强大的连通性意味着从任何路口都可以到达单向街道上的所有其他路口。 

输入规模很大：最多可以有 100,000 个交叉路口和 300,000 条道路。 这意味着任何比 O(n + m) 更差的解决方案都可能太慢，因为 n·m 可能达到 10^10，这远远超出了 5 秒时间限制。 因此，检查道路方向所有排列的简单方法是不可行的。 

不明显的边缘情况是由循环和桥梁产生的。 例如，如果无向图有一座桥（一条被删除的边会断开图的连接），则不可能对边进行定向以保持强连通性。 一个简单的例子是由单个桥连接的三角形：将桥定向到任何方向都将导致不可能沿相反方向遍历。 另一种边缘情况出现在完整图中：每条边都可以以循环方式定向，并且自然地保留了强连通性。 

## 方法

 暴力方法将尝试所有可能的边方向，然后检查生成的有向图是否强连接。 这需要检查 2^m 个方向，每个方向需要 O(n + m) 时间进行 DFS 或 BFS。 当 m 达到 3×10^5 时，这是天文数字般的慢。 

关键的观察结果是网桥阻碍了强连接。 如果图中有一座桥，如果桥的方向错误，一端就无法到达另一端。 因此，第一步是确定桥梁是否存在。 Tarjan 的算法可以通过执行 DFS 并跟踪发现时间和低链路值，在 O(n + m) 时间内检测网桥。 如果找到桥，答案立即为 0。 

一旦我们知道不存在桥，无向图就是 2 边连通的。 在这种情况下，总是可以指定方向，使图变得强连接。 一个简单的基于 DFS 的构建工作：对于 DFS 期间遇到的每个树边，将其从父级定向到子级； 对于每个后边缘，将其从子项定向到父项。 这保证了强大的连接性，因为无向图中的每个循环都变成了有向循环，并且循环将组件链接在一起。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^m · (n + m)) | O(2^m · (n + m)) | O(n + m) | 太慢了 |
 | DFS + Tarjan 桥| O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 从输入边构建无向图的邻接表。 这是我们将用于 DFS 和桥接检测的结构。 
2. 初始化数组以跟踪发现时间（`tin`），最短可达发现时间（`low`），以及每个节点的访问标志。 
3. 从任意节点（例如节点 1）开始执行 DFS 来检测网桥。 对于每个节点，设置`tin`和`low`到当前计时器，然后递归访问未访问的邻居。 更新`low`根据标准 Tarjan 桥检测规则的值。 如果我们找到任何边缘`low[neighbor] > tin[node]`，它是一座桥，我们立即返回 0。 
4. 在 DFS 过程中，记录边缘方向。 树的边缘从父级到子级。 后边从当前节点指向其祖先节点。 将方向存储在由边缘索引键控的字典中以保留输入顺序。 
5. DFS 之后，如果没有找到桥，则按照输入中给出的顺序输出存储的边缘方向。 

为什么有效：桥是将连通无向图定向为强连通有向图的唯一障碍。 通过执行 DFS 并记录树和后边缘，我们以一致的方式沿循环定向所有边缘。 这保证了每个节点都可以到达其他每个节点，因为循环允许通过不同的路径进行双向遍历，满足强连通性。 

## Python 解决方案```python
import sys
sys.setrecursionlimit(10**6)
input = sys.stdin.readline

def main():
    n, m = map(int, input().split())
    adj = [[] for _ in range(n)]
    edges = []
    
    for i in range(m):
        a, b = map(int, input().split())
        a -= 1
        b -= 1
        adj[a].append((b, i))
        adj[b].append((a, i))
        edges.append((a, b))
    
    tin = [-1] * n
    low = [-1] * n
    timer = [0]
    visited = [False] * n
    res = [None] * m
    found_bridge = [False]
    
    def dfs(u, parent):
        visited[u] = True
        tin[u] = low[u] = timer[0]
        timer[0] += 1
        for v, idx in adj[u]:
            if v == parent:
                continue
            if visited[v]:
                low[u] = min(low[u], tin[v])
                if res[idx] is None:
                    res[idx] = (u + 1, v + 1)
            else:
                res[idx] = (u + 1, v + 1)
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if low[v] > tin[u]:
                    found_bridge[0] = True
    
    dfs(0, -1)
    
    if found_bridge[0]:
        print(0)
    else:
        for p, q in res:
            print(p, q)

if __name__ == "__main__":
    main()
```邻接列表捕获每条边及其索引，以便我们稍后可以按输入顺序输出。`tin`和`low`数组实现了 Tarjan 的桥接检测。 DFS 将树边从父节点定向到子节点，并将后边从当前节点定向到祖先节点。 我们立即检测桥梁来处理无法解决的情况。 这`res`数组维护方向映射。 

## 工作示例

 ### 示例 1

 输入：```
6 8
1 2
2 3
1 3
4 5
4 6
5 6
2 4
3 5
```| 步骤| 节点| 锡 | 低| 边缘导向 | 发现桥梁|
 | ---| ---| ---| ---| ---| ---|
 | DFS 1 | 1 | 0 | 0 | 1->2 | 假 |
 | DFS 2 | 2 | 1 | 0 | 2->3 | 假 |
 | DFS 3 | 3 | 2 | 0 | 3->1, 3->5 | 3->1, 3->5 | 假 |
 | DFS 4 | 4 | 3 | 3 | 4->5 | 假 |
 | DFS 5 | 5 | 4 | 3 | 5->6 | 假 |
 | DFS 完成 | - | - | - | - | 假 |

 所有边缘均无桥接，保留了强大的连接性。 

### 示例 2

 输入：```
4 3
1 2
2 3
3 4
```桥接检测立即将边缘 2-3 识别为桥接（`low[3] > tin[2]`）。 该算法输出 0，正确指示无解。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + m) | DFS 访问每个节点一次并检查所有边。 |
 | 空间| O(n + m) | DFS 的邻接表、边方向数组和辅助数组。 |

 这种复杂性完全符合约束条件：可以在一秒内使用 DFS 高效处理 105 个节点和 3·105 条边。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    main()
    return sys.stdout.getvalue().strip()

# Provided sample
assert run("6 8\n1 2\n2 3\n1 3\n4 5\n4 6\n5 6\n2 4\n3 5\n") != "0", "sample 1"

# Minimum-size input, no bridge
assert run("2 1\n1 2\n") == "1 2", "minimum input no bridge"

# Bridge present, no solution
assert run("4 3\n1 2\n2 3\n3 4\n") == "0", "linear bridge"

# Complete graph 3 nodes
assert run("3 3\n1 2\n2 3\n1 3\n") != "0", "triangle, any orientation works"

# Star graph center 1
assert run("4 3\n1 2\n1 3\n1 4\n") == "0", "center is bridge"

# Two separate cycles connected
assert run("6 7\n1 2\n2 3\n3 1\n4 5\n5 6\n6 4\n3 4\n") != "0", "double cycle connected"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 2 1 | 2 1 2 | 最小输入无桥|
 | 4 3 | 0 | 桥接阻碍强连接|
 | 3 3 | 任意方向| 循环允许强大的连接性|
 | 4 3 | 0 | 星图中心是桥|
 | 6 7 | | |
