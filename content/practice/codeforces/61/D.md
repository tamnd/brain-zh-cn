---
title: "CF 61D - 永恒的胜利"
description: "我们被要求找出 Shapur 至少访问所有城市一次所需的最短距离。 这些城市以树形结构连接，这意味着任意两个城市之间恰好有 $n-1$ 条双向道路和唯一的路径。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "graphs", "greedy", "shortest-paths", "trees"]
categories: ["algorithms"]
codeforces_contest: 61
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 57 (Div. 2)"
rating: 1800
weight: 61
solve_time_s: 89
verified: true
draft: false
---

[CF 61D - 永恒的胜利](https://codeforces.com/problemset/problem/61/D)

 **评分：** 1800
 **标签：** dfs 和类似的、图、贪婪、最短路径、树
 **求解时间：** 1m 29s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求找出 Shapur 至少访问所有城市一次所需的最短距离。 这些城市以树形结构连接，这意味着确切地说$n-1$双向道路和任意两个城市之间的独特路径。 Shapur 从城市 1 开始，可以在任何城市结束。 每条路都有一个权重，代表其长度。 输入给出城市数量$n$进而$n-1$三元组用它们的权重描述道路。 输出是一个整数：最小总行驶距离。 

因为$n$可以大到$10^5$，任何在城市和道路数量上比线性或近线性差的解决方案都会太慢。 尝试所有可能的路线或排列的简单解决方案显然是不可行的，因为排列的数量呈阶乘增长。 我们需要利用树结构来减少计算量。 

一个不明显的边缘情况是一棵树，其中最重的路径位于从城市 1 到叶子的长链中。 例如，在一条线上有三个城市：城市 1 连接到 2，权重为 10，城市 2 连接到 3，权重为 20。最佳策略是步行 1 → 2 → 3，并在 3 处停止。假设 Shapur 必须返回城市 1 的粗心方法会错误地将一些边权重加倍，给出 60 而不是 30。 

另一个微妙的情况是，当树是星形时，所有城市都直接连接到城市 1。这里，最优路径只能遍历每条边一次而不返回，因此将所有边权重相加即可得出答案。 

## 方法

 暴力方法将生成从城市 1 开始的所有路径，这些路径恰好访问每个城市一次，计算它们的距离，并取最小值。 虽然这是正确的，但树中可能的路径数量是非平凡形状的城市数量的阶乘，这对于$n$一样大$10^5$。 

关键的观察是城市形成一棵树。 要访问所有城市，每条边都必须至少遍历一次，因为省略一条边将导致其相连的城市未被访问。 如果我们忽略起始城市，简单的方法将遍历每条边两次：一次深入，一次原路返回。 这会将每条边的权重计算为两倍。 节省距离的唯一方法是避免在从城市 1 出发的最长单条路径上进行回溯，该路径将是从城市 1 到最远叶子的路径。 仅遍历最长路径一次而不是两次即可得到最小的总距离。 

因此，最佳方法是将所有边权重乘以 2 求和，然后减去城市 1 到任意叶子的最大距离。 DFS 用于有效地计算这个最大距离。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n!) | O(n) | 太慢了|
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1.解析输入读取$n$和$n-1$边缘。 将边与邻居和边权重一起存储在邻接列表中。 这种表示方式允许从任何城市快速穿越。 
2. 计算所有边权重的总和。 由于除了避免回溯的路径外，每条边都必须在两个方向上至少遍历一次，因此如果我们在访问每个分支后返回到起点，则该总和乘以 2 即可得出简单的总行程。 
3. 从城市 1 开始执行深度优先搜索，找到从城市 1 到任意叶子节点的最大距离。 将距离累加器初始化为 0，然后对于每个尚未访问的邻居，递归计算路径长度并跟踪最大值。 
4. 将二重合计所得的最大距离减去，即为最短行驶距离。 这是可行的，因为沿着从根到最远叶子的路径，我们不需要在边缘上回溯； 所有其他边都计算两次。 

为什么有效：每条边都必须至少遍历一次，以确保访问所有城市。 最初对每条边进行两次计数以说明外出和返回的情况。 通过确定从起始城市出发的最长单条路径，我们可以避免一次遍历这些边。 DFS保证我们在线性时间内准确地找到这条路径，并且减去这个最大路径长度确保了最少的旅行而不会错过任何城市。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(200000)

n = int(input())
adj = [[] for _ in range(n + 1)]
total_weight = 0

for _ in range(n - 1):
    u, v, w = map(int, input().split())
    adj[u].append((v, w))
    adj[v].append((u, w))
    total_weight += w

visited = [False] * (n + 1)
max_path = 0

def dfs(node, dist):
    global max_path
    visited[node] = True
    if dist > max_path:
        max_path = dist
    for neighbor, weight in adj[node]:
        if not visited[neighbor]:
            dfs(neighbor, dist + weight)

dfs(1, 0)

result = 2 * total_weight - max_path
print(result)
```选择邻接表是为了高效的 DFS 遍历。 全局变量`max_path`跟踪最大距离。 DFS 递归地累积距离并确保每个节点都被访问一次。 我们将总重量乘以二，因为我们最初假设我们去了每个城市并返回。 减法`max_path`避免重复计算从根到叶子的最长路径。 

## 工作示例

 ### 示例 1

 输入：```
3
1 2 3
2 3 4
```| 步骤| 节点| 距离 | 最大路径| 笔记|
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 0 | 0 | 启动 DFS |
 | 2 | 2 | 3 | 3 | 拜访邻居 2 |
 | 3 | 3 | 7 | 7 | 拜访邻居 3 |

 总重量 = 3 + 4 = 7。乘以 2 → 14。减去 max_path 7 → 7。输出为 7。确认通过步行 1→2→3 并停止来实现最小行程。 

### 自定义输入2```
5
1 2 1
1 3 2
3 4 3
3 5 4
```| 步骤| 节点| 距离 | 最大路径| 笔记|
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 0 | 0 | 启动 DFS |
 | 2 | 2 | 1 | 1 | 拜访邻居 2 |
 | 3 | 3 | 2 | 2 | 拜访邻居 3 |
 | 4 | 4 | 5 | 5 | 拜访邻居 4 |
 | 5 | 5 | 6 | 6 | 拜访邻居 5 |

 总权重 = 1+2+3+4=10 → 加倍 = 20。减去 max_path 6 → 14。最优路径 1→3→5，然后回到 3→4→3→1→2。 确认算法正确处理分支路径。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | DFS 恰好访问每个节点和边一次 |
 | 空间| O(n) | 邻接表和访问数组占用线性空间 |

 鉴于以下限制$n \le 10^5$，线性算法非常高效，并且可以轻松满足 2 秒时间限制和 256 MB 内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    adj = [[] for _ in range(n + 1)]
    total_weight = 0
    for _ in range(n - 1):
        u, v, w = map(int, input().split())
        adj[u].append((v, w))
        adj[v].append((u, w))
        total_weight += w

    visited = [False] * (n + 1)
    max_path = 0

    def dfs(node, dist):
        nonlocal max_path
        visited[node] = True
        if dist > max_path:
            max_path = dist
        for neighbor, weight in adj[node]:
            if not visited[neighbor]:
                dfs(neighbor, dist + weight)

    dfs(1, 0)
    return str(2 * total_weight - max_path)

# provided sample
assert run("3\n1 2 3\n2 3 4\n") == "7", "sample 1"

# custom tests
assert run("1\n") == "0", "single node"
assert run("2\n1 2 10\n") == "10", "two nodes only"
assert run("4\n1 2 1\n2 3 2\n3 4 3\n") == "6", "linear chain"
assert run("5\n1 2 1\n1 3 2\n3 4 3\n3 5 4\n") == "14", "branching tree"
assert run("3\n1 2 0\n2 3 0\n") == "0", "zero-weight edges"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | | | |
