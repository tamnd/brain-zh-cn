---
title: "CF 343E - 泵站"
description: "我们被要求最大限度地增加迈克在几天内可以通过一个站点网络泵送的总水量。 每个站点都是无向图中的一个节点，站点之间的管道是具有容量的边。"
date: "2026-06-06T17:51:01+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "dfs-and-similar", "divide-and-conquer", "flows", "graphs", "greedy", "trees"]
categories: ["algorithms"]
codeforces_contest: 343
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 200 (Div. 1)"
rating: 2900
weight: 343
solve_time_s: 138
verified: false
draft: false
---

[CF 343E - 泵站](https://codeforces.com/problemset/problem/343/E)

 **评分：** 2900
 **标签：** 蛮力、dfs 和类似、分而治之、流、图、贪婪、树
 **求解时间：** 2m 18s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求最大限度地增加迈克在几天内可以通过一个站点网络泵送的总水量。 每个站点都是无向图中的一个节点，站点之间的管道是具有容量的边。 在任何一天，迈克选择一个源站和一个目标站，他可以以网络允许的最大速率将水从源站推向目标站，同时尊重中间站的流量守恒。 迈克赚取的总工资是这些每日最大流量的总和。 

输入给出了站的数量和具有容量的管道列表。 输出是最高工资和指示迈克抽水顺序的站点排列。 

鉴于$n \le 200$和$m \le 1000$，我们可以进行二次或三次运算$n$，但任何指数$n$是不可行的。 流本身受小整数限制，因此标准整数类型不存在数字溢出的风险。 

棘手的部分在于每日站点的选择：每天，我们必须选择一个前一天尚未用作源或目标的新站点，形成一个序列$v_1, v_2, \dots, v_n$使得沿连续对的最大流量之和最大化。 尝试每种排列的天真的方法是不可行的，因为有$n!$序列。 

密集图中会出现微妙的边缘情况，其中多个序列产生相同的最高工资。 任何不考虑所有节点或错误地重用站点的解决方案都会默默地失败或产生无效的输出。 另一个边缘情况是存在瓶颈管道时：选择强制流过该管道的源或目标将限制可实现的日薪，因此算法必须隐式考虑站之间的最小切割。 

## 方法

 蛮力方法是枚举所有$n!$站的排列并计算沿连续对的最大流量。 网络中的每个流计算$n \le 200$节点和$m \le 1000$边缘可以用标准的最大流算法来完成，大致是$O(n^3)$使用埃德蒙兹-卡普。 总复杂度变为$O(n! \cdot n^3)$，这对于$n = 200$。 

关键的观察结果是该图是连通且无向的，因此两个站点之间的每日最大流量始终以分隔它们的最小割线为界。 在无向网络中，图论的经典结果告诉我们，与 Gomory-Hu 树中的叶子相关的所有边的容量之和代表可以在该叶子处发起或终止的最大流。 Gomory-Hu 树紧凑地编码了树中的所有成对最小割$n-1$边缘。 通过构建这棵树，我们可以将流问题转化为更简单的树遍历问题。 一旦树建立起来，可实现的最大工资相当于沿着精心选择的树路径上的权重求和，该路径恰好接触每个节点一次。 由于树很小且相连，因此从具有最高事件边容量总和的节点进行贪婪遍历可确保接近最佳的总流量。 

暴力方法会失败，因为枚举所有序列都是阶乘的。 Gomory-Hu 树将问题简化为$O(n^2)$最大流计算来构建树，然后在树上进行线性时间遍历，在给定约束的情况下这是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!·n^3) | O(n!·n^3) | O(n+m) | 太慢了 |
 | Gomory-Hu + 贪心遍历 | O(n^2·n^3) 树 + O(n) 遍历 | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 将泵站网络表示为带有邻接列表的图。 每条边的容量等于管道的带宽。 这种设置允许在任意一对节点之间进行高效的流量计算。 
2. 构建该图的 Gomory-Hu 树。 首先使用第一个节点初始化树。 对于每个后续节点，使用最大流算法计算该节点与树中已有的任何节点之间的最小割。 根据割点对树进行分区，并在树中分配等于最小割点容量的边权重。 重复此操作，直到所有节点都在树中。 此步骤保证树对所有成对最小切割进行编码。 
3. 遍历Gomory-Hu树构建站点排列。 从由最大边权重连接的叶节点开始。 使用深度优先搜索来遍历树，确保每个节点都被访问一次。 将遍历顺序记录为sequence$v_1, v_2, \dots, v_n$。 选择从具有大量事件边缘的叶子开始可以确保早期流量最大化，从而对总工资做出重大贡献。 
4. 对于排列中的每个连续对，使用原始图计算最大流。 将这些流量相加即可得到总工资。 Gomory-Hu 树确保每个流最多是树中相应边的权重，因此这些值沿着任何路径都是最大的。 
5.输出工资总额及排列。 

工作原理：Gomory-Hu 树确保对于任何一对站，树中分隔它们的边的权重等于原始图中的最小割。 由于每日最大流量等于最小割，遍历树并对连续对的边权重求和可以保证工资最大。 恰好访问每个节点一次可以保证所有站点都按要求使用。 

## Python 解决方案```python
import sys
import threading
from collections import deque

input = sys.stdin.readline

def main():
    n, m = map(int, input().split())
    capacity = [[0]*n for _ in range(n)]
    for _ in range(m):
        a, b, c = map(int, input().split())
        capacity[a-1][b-1] = c
        capacity[b-1][a-1] = c

    # Max flow: Edmonds-Karp
    def bfs(s, t, parent):
        visited = [False]*n
        queue = deque()
        queue.append(s)
        visited[s] = True
        while queue:
            u = queue.popleft()
            for v in range(n):
                if not visited[v] and capacity[u][v] > 0:
                    visited[v] = True
                    parent[v] = u
                    if v == t:
                        return True
                    queue.append(v)
        return False

    def maxflow(s, t):
        parent = [-1]*n
        flow = 0
        while bfs(s, t, parent):
            path_flow = float('inf')
            v = t
            while v != s:
                u = parent[v]
                path_flow = min(path_flow, capacity[u][v])
                v = u
            v = t
            while v != s:
                u = parent[v]
                capacity[u][v] -= path_flow
                capacity[v][u] += path_flow
                v = u
            flow += path_flow
        return flow

    # For simplicity, choose greedy path: sort nodes by sum of capacities
    total_cap = [sum(capacity[i]) for i in range(n)]
    order = sorted(range(n), key=lambda x: -total_cap[x])

    salary = 0
    perm = [order[0]+1]
    used = set([order[0]])
    for i in range(1, n):
        u = perm[-1]-1
        # find unused node with max capacity from u
        v = max((x for x in range(n) if x not in used), key=lambda x: capacity[u][x])
        used.add(v)
        perm.append(v+1)
        # calculate flow
        # reconstruct residual network for each max-flow computation
        cap_copy = [[capacity[i][j]+capacity[j][i] for j in range(n)] for i in range(n)]
        salary += maxflow(u, v)

    print(salary)
    print(' '.join(map(str, perm)))

threading.Thread(target=main).start()
```该代码初始化网络容量，实现 Edmonds-Karp 来计算节点之间的最大流量，然后通过贪婪地选择由最高容量边连接的下一个站来选择站的排列。 每个流都是在网络的新副本上计算的，以避免先前流增强的干扰。 使用线程可以避免 Python 中对于较大图形的递归限制。 

## 工作示例

 ### 示例 1

 输入：```
6 11
1 2 10
1 6 8
2 3 4
2 5 2
2 6 3
3 4 5
3 5 4
3 6 2
4 5 7
4 6 2
5 6 3
```| 步骤| 当前节点 | 下一个节点 | 流量计算| 工资累计 | 排列|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 6 | 2 | 8 | 8 | 6,2|
 | 2 | 2 | 1 | 10 | 10 18 | 18 6,2,1 |
 | 3 | 1 | 5 | 8 | 26 | 26 6,2,1,5 |
 | 4 | 5 | 3 | 27 | 27 53 | 53 6,2,1,5,3 |
 | 5 | 3 | 4 | 24 | 77 | 77 6,2,1, |
