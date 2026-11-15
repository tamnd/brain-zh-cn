---
title: "CF 59E - 最短路径"
description: "我们被要求浏览一张由双向道路连接的城市图，但有一点不同：由于迷信，三个连续城市的某些序列是被禁止的。 形式上，有 n 个节点和 m 个边，全部未加权，代表城市和道路。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "graphs", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 59
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 55 (Div. 2)"
rating: 2000
weight: 59
solve_time_s: 78
verified: true
draft: false
---

[CF 59E - 最短路径](https://codeforces.com/problemset/problem/59/E)

 **评级：** 2000
 **标签：** 图，最短路径
 **求解时间：** 1m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求浏览一张由双向道路连接的城市图，但有一点不同：由于迷信，三个连续城市的某些序列是被禁止的。 形式上，有 _n_ 个节点和 _m_ 个边，全部未加权，代表城市和道路。 我们从城市 1 开始，希望沿着一条不包含任何 _k_ 个禁止三元组作为连续节点的路径到达城市 _n_。 输出必须是沿着该路径的最少道路数和一条有效路径本身。 如果不存在路径，我们返回-1。 

给定约束条件，我们看到 _n_ 最多可以达到 3000，而 _m_ 最多可以达到 20000。这使得 O(n^3) 复杂度的算法处于临界状态，而 O(n^2) 算法是可以接受的。 禁止三元组的数量 _k_ 可以达到 10^5，因此对每条潜在路径上的每个三元组进行简单检查会太慢。 

当禁止三元组阻止通往目标的每一条直接路径时，或者当起始城市只有一个邻居（该城市是禁止三元组序列的一部分）时，就会出现非明显的边缘情况。 例如，如果 n = 4，m = 3，道路连接 1-2、2-3、3-4，并且禁止的三元组是 1-2-3，则如果朴素 BFS 忽略该三元组，则它会错误地声明路径存在。 另一个棘手的情况是，当一条路径以多种简短形式存在时，算法必须选择避免所有禁止三元组的最小形式。 

## 方法

 强力解决方案会在图上尝试标准 BFS，同时记住迄今为止遍历的整个路径。 每次我们通过一个新城市延伸一条路径时，我们都会检查最后三个城市是否形成禁止三元组。 这原则上是可行的，但可能的路径数量随着 _n_ 和 _m_ 呈指数增长，并且显式存储路径的速度非常慢。 在最坏的情况下，这种简单的方法的复杂度为 O(m * 2^n)，对于 n = 3000 显然是不可行的。 

关键的观察是禁止三元组仅限制三个连续节点的序列。 这意味着我们需要的“记忆”只是最后访问的两个城市，而不是整个路径。 如果我们重新定义 BFS 状态以包含当前城市和前一个城市，我们可以确保每个新访问的城市不会完成禁止的三重关系。 有了这种洞察力，我们可以在大小为 n^2（前一个城市 × 当前城市）的状态空间中执行 BFS，在给定约束的情况下这是可以管理的。 禁止的三元组可以存储在字典映射（上一个，当前）→ set（下一个禁止城市）中，以允许在扩展路径时进行 O(1) 查找。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(m * 2^n) | O(m * 2^n) | O(n * 2^n) | O(n * 2^n) | 太慢了 |
 | 具有状态（先前、当前）的 BFS | O(n * m) | O(n^2 + k) | O(n^2 + k) | 已接受 |

 ## 算法演练

 1. 解析输入以构造无向图的邻接表。 对于每个城市，我们存储所有直接连接的邻居。 
2. 将禁止三元组解析为字典映射对`(prev_city, current_city)`到一组`next_city`价值观。 这允许在扩展路径时进行 O(1) 检查，以查看添加新城市是否会完成禁止的三元组。 
3. 初始化BFS队列。 队列的每个元素都是一个元组`(prev_city, current_city)`。 我们可以从`(0, 1)`，其中 0 代表开始前的虚拟城市。 我们还维护一个`distance`字典键控为`(prev_city, current_city)`对于最短路径长度和`parent`用于重建路径的字典。 
4. 当队列不为空时，弹出一个状态`(prev_city, current_city)`并迭代所有邻居`next_city`。 如果`next_city`之后被禁止`(prev_city, current_city)`，跳过它。 如果`(current_city, next_city)`尚未访问过，更新`distance`和`parent`，然后入队`(current_city, next_city)`。 
5. 如果一个州`(prev_city, n)`到达时，通过回溯重建路径`parent`字典，从`(prev_city, n)`。 反向收集城市，然后反转列表以产生正确的顺序。 
6. 如果 BFS 完成但未到达城市`n`，输出-1。 否则，输出距离和重建的路径。 

这样做的原因是 BFS 保证我们第一次到达某个状态`(prev_city, n)`是通过尊重禁忌三元组的最短路径。 通过仅维护该州的最后两个城市，我们确保正确应用所有约束，而不会使用不必要的内存。 

## Python 解决方案```python
import sys
from collections import deque, defaultdict
input = sys.stdin.readline

n, m, k = map(int, input().split())
graph = [[] for _ in range(n + 1)]
for _ in range(m):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

forbidden = defaultdict(set)
for _ in range(k):
    a, b, c = map(int, input().split())
    forbidden[(a, b)].add(c)

queue = deque()
queue.append((0, 1))
distance = dict()
distance[(0, 1)] = 0
parent = dict()

found = False
end_state = None

while queue:
    prev, curr = queue.popleft()
    if curr == n:
        found = True
        end_state = (prev, curr)
        break
    for nxt in graph[curr]:
        if nxt in forbidden.get((prev, curr), set()):
            continue
        if (curr, nxt) not in distance:
            distance[(curr, nxt)] = distance[(prev, curr)] + 1
            parent[(curr, nxt)] = (prev, curr)
            queue.append((curr, nxt))

if not found:
    print(-1)
else:
    path = []
    state = end_state
    while state != (0, 1):
        _, curr = state
        path.append(curr)
        state = parent[state]
    path.append(1)
    path.reverse()
    print(len(path) - 1)
    print(' '.join(map(str, path)))
```该解决方案首先构建图表和禁止地图。 然后 BFS 探索该图，同时跟踪最后两个城市。 BFS 保证最短路径发现，而父字典允许我们有效地重建路径。 使用`(0, 1)`因为初始虚拟状态确保在开始时统一处理禁止的三元组。 

## 工作示例

 输入示例 1：```
4 4 1
1 2
2 3
3 4
1 3
1 4 3
```| 队列| 当前状态（上一个，当前）| 邻居 | 新状态排队 | 距离 |
 | --- | --- | --- | --- | --- |
 | [(0,1)] | (0,1)| 2,3 | (1,2), (1,3) | (1,2), (1,3) | 1 |
 | [(1,2),(1,3)] | (1,2) | 1,3 | (2,3) | 2 |
 | [(1,3),(2,3)] | (1,3) | 1,4| (3,4) | 2 |

 我们到达 (3,4)，即城市 4。回溯给出路径 1 → 3 → 4，距离为 2，避免禁止三元组 (1,4,3)。 

自定义输入：```
3 2 1
1 2
2 3
1 2 3
```BFS 访问 (0,1) → (1,2) → 由于禁止三元组而无法到达 3。 不存在任何路径。 输出-1。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n*m) | 每个 BFS 状态是 (prev, curr)，并且每个状态检查每个边一次。 |
 | 空间| O(n^2 + k) | O(n^2 + k) | O(n^2) 表示距离/父节点，O(k) 表示禁止三元组。 |

 给定 n ≤ 3000 且 m ≤ 20000，n*m ≈ 6×10^7 次操作，在 3 秒内可行。 内存在256MB以内。 

## 测试用例```python
def run(inp: str) -> str:
    import sys, io
    sys.stdin = io.StringIO(inp)
    from collections import deque, defaultdict
    n, m, k = map(int, input().split())
    graph = [[] for _ in range(n + 1)]
    for _ in range(m):
        u, v = map(int, input().split())
        graph[u].append(v)
        graph[v].append(u)
    forbidden = defaultdict(set)
    for _ in range(k):
        a, b, c = map(int, input().split())
        forbidden[(a, b)].add(c)
    queue = deque()
    queue.append((0, 1))
    distance = dict()
    distance[(0, 1)] = 0
    parent = dict()
    found = False
    end_state = None
    while queue:
        prev, curr = queue.popleft()
        if curr == n:
            found = True
            end_state = (prev, curr)
            break
        for nxt in
```
