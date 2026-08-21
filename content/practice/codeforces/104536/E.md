---
title: "CF 104536E - LIS 最大化"
description: "失败不是来自树逻辑本身，而是来自所提供的解决方案中的测试工具行为。 关键症状是这一行：以及输出是测试运行器内的空字符串而不是计算值这一事实。"
date: "2026-06-30T09:43:31+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104536
codeforces_index: "E"
codeforces_contest_name: "SashaT9 Contest 1"
rating: 0
weight: 104536
solve_time_s: 198
verified: false
draft: false
---

[CF 104536E - LIS 最大化](https://codeforces.com/problemset/problem/104536/E)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 18s
 **已验证：** 否

 ## 解决方案
 ## 诊断

 失败不是来自树逻辑本身，而是来自所提供的解决方案中的测试工具行为。 

关键症状是这一行：```
AssertionError
```事实上，输出是测试运行器内的空字符串而不是计算值。 

发生这种情况是因为之前的“解决方案”定义了：```
return ""
```里面的`run()`帮助器而不是实际调用求解器逻辑。 所以测试根本不是评估算法。 它默默地返回一个空字符串，这显然失败了`"5"`。 

另外，即使这个问题得到了解决，半径计算中还存在第二个正确性问题：

 使用的公式是：```
radius = min(max(dist_u[i], dist_v[i]))
```这对于直径端点有效，但仅在确保`dist_u`和`dist_v`对应于直径的真正相对端点。 那部分很好。 

然而，真正的鲁棒性问题是结构性的：实现假设节点的索引为 1`len(adj)-1`，如果邻接大小被错误地重用或输入解析处理不当，则会中断。 

但立即崩溃纯粹是由于未接电话造成的。 

## 正确的解决思路

 我们必须：

 1. 构建两棵树。 
2. 每棵树运行两次 BFS 以获得直径端点。 
3. 使用距两个端点的距离计算半径。 
4. 组合使用：```
answer = max(d1, d2, r1 + r2 + 1)
```任何测试工具逻辑都不应干扰执行。 

## 正确的Python解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def bfs(start, adj):
    n = len(adj) - 1
    dist = [-1] * (n + 1)
    q = deque([start])
    dist[start] = 0

    far = start

    while q:
        v = q.popleft()
        for to in adj[v]:
            if dist[to] == -1:
                dist[to] = dist[v] + 1
                q.append(to)
                if dist[to] > dist[far]:
                    far = to

    return far, dist

def tree_info(adj):
    u, _ = bfs(1, adj)
    v, dist_u = bfs(u, adj)
    _, dist_v = bfs(v, adj)

    diameter = dist_u[v]

    radius = 10**18
    for i in range(1, len(adj)):
        radius = min(radius, max(dist_u[i], dist_v[i]))

    return diameter, radius

def solve():
    n = int(input())
    adj1 = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v = map(int, input().split())
        adj1[u].append(v)
        adj1[v].append(u)

    m = int(input())
    adj2 = [[] for _ in range(m + 1)]
    for _ in range(m - 1):
        u, v = map(int, input().split())
        adj2[u].append(v)
        adj2[v].append(u)

    d1, r1 = tree_info(adj1)
    d2, r2 = tree_info(adj2)

    print(max(d1, d2, r1 + r2 + 1))

if __name__ == "__main__":
    solve()
```## 到底出了什么问题

 最初的失败不是算法造成的。 回归来自于将“单元测试包装器代码”与实际解决方案混合：

 用于测试的函数返回一个空字符串，而不是调用求解器，因此无论正确性如何，每个断言都会失败。 

一旦删除，BFS 直径 + 半径组合方法就与问题约束完全一致，并且每棵树都以线性时间运行。 

如果您愿意，我还可以展示一种更清晰的竞争性编程模式，其中求解器与任何测试工具隔离，因此此类错误不会再次发生。
