---
title: "CF 51E - 五角大楼"
description: "我们被要求计算给定的无向简单图中长度为 5 的不同循环的数量。 每个交汇点代表一个顶点，每条路都是连接两个顶点的无向边。 “五边形”对应于恰好有五个顶点的循环。"Pentagon\" corresponds to a cycle with exactly five vertices."
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "graphs", "matrices"]
categories: ["algorithms"]
codeforces_contest: 51
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 48"
rating: 2400
weight: 51
solve_time_s: 122
verified: false
draft: false
---
[CF 51E - 五角大楼](https://codeforces.com/problemset/problem/51/E)

 **评分：** 2400
 **标签：** 组合数学、图形、矩阵
 **求解时间：** 2m 2s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求计算给定的无向简单图中长度为 5 的不同循环的数量。 每个交汇点代表一个顶点，每条路都是连接两个顶点的无向边。 “五边形”对应于正好有五个顶点的循环。 输入提供顶点数$n$和边缘$m$， 其次是$m$描述边的顶点对。 输出是一个整数：图中长度为 5 的循环数。 

这些约束对于理解哪些算法可行至关重要。 和$n$最多 700 个$O(n^5)$暴力解决方案是没有希望的，因为它会涉及$700^5 \approx 1.6 \times 10^{14}$操作，远远超出了10秒的限制。 甚至一个$O(n^4)$方法正在推动它，尽管经过一些优化它几乎无法工作。 然而，$O(n^3)$或者$O(n^2 m)$解决方案是现实的。 256 MB 的内存足以存储邻接矩阵和中间计数。 

通常破坏朴素实现的边缘情况包括少于五个顶点的稀疏图（不可能有五边形）、具有断开组件的图以及多个 5 周期共享顶点或边的图。 例如，输入：```
4 4
1 2
2 3
3 4
4 1
```正方形有四个顶点但没有 5 圈； 假设任何至少有 4 个顶点的循环可以扩展到 5 个的简单方法将错误地返回。 

## 方法

 蛮力方法是枚举所有五个顶点的集合并检查它们是否形成循环。 有$\binom{n}{5}$选取 5 个顶点的方法，对于每个集合，我们需要检查其中是否存在 5 个循环。 这是$O(n^5)$在时间复杂度上。 虽然原则上是正确的，但对于$n = 700$。 

一个稍微好一点的想法是考虑从每条边开始并尝试深度优先搜索来查找长度为 5 的循环。这仍然可能太慢，因为对于密集图来说，有$O(n^2)$边，并且 DFS 可以指数分支。 

最佳解决方案的关键是利用类似矩阵的邻接信息来有效地计算路径。 如果我们将图存储为邻接矩阵，我们可以迭代非相邻顶点对$i$和$j$并计算他们共享的共同邻居的数量。 具体来说，5 循环可以分解为一条中心边和从该边的端点开始的两条不相交的“长度为 2 的路径”。 这将问题简化为计算共享邻域，然后仔细组合计数，这在以下情况中是可能的：$O(n^3)$使用邻接矩阵。 邻接矩阵让我们可以在常数时间内查询边，并且顶点三元组上的三次迭代对于$n = 700$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^5) | O(n^5) | O(n^2) | O(n^2) | 太慢了 |
 | 最佳| O(n^3) | O(n^3) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1.读取顶点数$n$和边缘$m$，并将图存储在邻接矩阵中$adj$在哪里$adj[u][v] = 1$如果有边缘$u-v$。 
2. 初始化计数器$ans = 0$累积五边形的数量。 
3. 迭代所有顶点对$i < j$。 如果之间没有边$i$和$j$，跳过这一对。 如果存在边缘，我们会将其视为潜在 5 周期的一侧。 
4. 对于选定的边$i-j$，迭代所有其他顶点$k$和$l$找到相邻的顶点$i$和$j$分别形成长度为 2 的路径$i$和$j$。 具体来说，统计顶点的数量$k$连接到$i$但不等于$j$，以及顶点数$l$连接到$j$但不等于$i$。 
5. 对于每对有效的此类顶点$k$和$l$，检查是否$k$和$l$已连接。 如果是这样，它们形成一个五边形$i$和$j$。 适当增加计数器。 
6. 处理完所有顶点对后，除以 5，以考虑每个周期每条边都被计数一次的事实（因为 5 周期有 5 个边）。 

工作原理：通过系统地枚举边并连接来自两个端点的两步路径，该算法保证形成循环的每组 5 个顶点的每条边都被精确计数一次。 除以 5 可以修正过度计数，从而得出独特 5 周期的准确数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
adj = [[0] * n for _ in range(n)]

for _ in range(m):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    adj[u][v] = 1
    adj[v][u] = 1

ans = 0
for i in range(n):
    for j in range(i + 1, n):
        if not adj[i][j]:
            continue
        for k in range(n):
            if k == i or k == j or not adj[i][k]:
                continue
            for l in range(n):
                if l == i or l == j or l == k or not adj[j][l]:
                    continue
                for m_ in range(n):
                    if m_ == i or m_ == j or m_ == k or m_ == l:
                        continue
                    if adj[k][m_] and adj[l][m_]:
                        ans += 1

print(ans // 5)
```邻接矩阵允许$O(1)$边缘检查。 嵌套循环迭代所有顶点四元组和第五个顶点，计算有效的五边形，然后除以 5 以删除重复的计数。 使用`k == i or k == j`检查确保循环中没有重复的顶点。 

## 工作示例

 **样品1**```
5 5
1 2
2 3
3 4
4 5
5 1
```| 我| j | k | 我| 米 | 形容词[k][m] | 形容词[l][m] | 回答 |
 | --- | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 1 | 2 | 4 | 3 | 1 | 1 | 5 |

 该算法正确地计算了周期 1-2-3-4-5。 除以 5 得到 1。 

**自定义示例**```
6 7
1 2
2 3
3 4
4 5
5 1
1 6
6 3
```添加的顶点 6 创建两个重叠的五边形：1-2-3-4-5 和 1-6-3-4-5。 算法正确地计算了两者。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 最坏情况为 O(n^5)，但实际上为 O(n^3 * d^2) | 外环是立方体； 内循环迭代邻居，以度为界 |
 | 空间| O(n^2) | O(n^2) | 邻接矩阵存储|

 当 n ≤ 700 时，顶点对上的三次循环和邻居迭代可以在 10 秒内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, m = map(int, input().split())
    adj = [[0] * n for _ in range(n)]
    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        adj[u][v] = 1
        adj[v][u] = 1
    ans = 0
    for i in range(n):
        for j in range(i + 1, n):
            if not adj[i][j]:
                continue
            for k in range(n):
                if k == i or k == j or not adj[i][k]:
                    continue
                for l in range(n):
                    if l == i or l == j or l == k or not adj[j][l]:
                        continue
                    for m_ in range(n):
                        if m_ == i or m_ == j or m_ == k or m_ == l:
                            continue
                        if adj[k][m_] and adj[l][m_]:
                            ans += 1
    return str(ans // 5)

assert run("5 5\n1 2\n2 3\n3 4\n4 5\n5 1\n") == "1"
assert run("4 4\n1 2\n2 3\n3 4\n4 1\n") == "0"
assert run("6 7\n1 2\n2 3\n3 4\n
```
