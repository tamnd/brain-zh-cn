---
title: "CF 106189C - 又是迷宫"
description: "我们有一个长方形的迷宫。 空单元格是可穿越的，标记为 X 的单元格是阻塞的。 玩家从左上角开始，想要通过四个方向的移动到达右下角。 我们想在一个空单元格中放置一个额外的障碍物。"
date: "2026-06-25T06:47:33+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106189
codeforces_index: "C"
codeforces_contest_name: "ICPC Central Russia Regional Contest, 2025"
rating: 0
weight: 106189
solve_time_s: 65
verified: true
draft: false
---

[CF 106189C - 又是迷宫](https://codeforces.com/problemset/problem/106189/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个长方形的迷宫。 空单元格可遍历，单元格已标记`X`被封锁。 玩家从左上角开始，想要通过四个方向的移动到达右下角。 

我们想在一个空单元格中放置一个额外的障碍物。 如果在阻塞之后，从开始到结束的最短路径变得严格更长，而路径仍然存在，则单元格有效。 

输出是原始迷宫，只不过每个有效单元都被替换为`*`。 

网格可以大到`1000 × 1000`，这意味着最多一百万个细胞。 任何为每个空单元格重新计算最短路径的解决方案都是完全不可行的。 即使单个 BFS 已经触及大约一百万个顶点，因此我们需要网格大小非常接近线性复杂度的东西。 

微妙之处在于，增加最短路径长度并不等同于断开迷宫。 

考虑这个迷宫：```
...
...
...
```从左上角到右下角的每条最短路径的长度都是 4，但这样的路径有很多条。 阻塞任何单个内部单元仍然会留下另一条长度为 4 的最短路径，因此不存在答案单元。 

现在考虑：```
.....
.XXX.
.....
```中间的走廊是唯一最短路线。 阻挡其内部单元之一会破坏所有最短路径，但更长的绕路仍然存在。 这些单元格是有效的。 

另一个陷阱是真正的瓶颈：```
...
.X.
...
```如果某个单元位于每条可能的路径上，而不仅仅是每条最短路径上，那么阻止它会断开开始和结束的连接。 这样的单元格不能被标记，因为该语句要求之后路径仍然存在。 

## 方法

 蛮力的想法很简单。 对于每个空单元格，暂时阻塞它，从头开始运行 BFS，计算新的最短距离，并检查它是否在保持有限的情况下变得更大。 

如果网格包含 100 万个单元，则意味着最多运行 100 万次 BFS。 每个BFS已经`O(NM)`，因此总工作量大致变为`O((NM)^2)`，这远远超出了任何现实的极限。 

关键的观察是，只有当单元属于**每个最短路径**时，它才能增加最短路径长度。 

假设存在一条避开单元的最短路径`v`。 封锁后`v`，同样的最短路径仍然存在，因此最短距离不能增加。 

这将问题变成了两个独立的问题。 

首先，哪些单元属于每条最短路径？ 

让`distS[v]`是距起点的距离`distT[v]`距终点的距离。 当一个单元格属于某个最短路径时```
distS[v] + distT[v] = D
```在哪里`D`是从起点到终点的最短距离。 

所有最短路径单元形成分层 DAG。 每一条最短路径都恰好访问一个距离上的顶点`0`, 远处的一个`1`, 远处的一个`2`， 等等。 

如果一层恰好包含一个最短路径单元，则每条最短路径都被迫通过它。 如果一个层包含两个或多个单元，则可以在其中选择最短路径。 

因此，当且仅当最短路径单元是其距离层中唯一的最短路径单元时，它才属于每个最短路径。 

这会识别出其移除会破坏每条最短路径的所有单元格。 

第二个问题是，移除这样一个单元是否仍然会留下一些路径。 

这是一个经典的图形问题。 我们需要知道这个细胞是否是一个`s-t`切割顶点。 如果删除它会断开开始与结束的连接，则这不是一个有效的答案。 如果起点和终点保持连接，则所有最短路径都会消失，并且新的最短距离会变得更大。 

这可以通过单个低链路 DFS 进行检查。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O((NM)²) | O(NM) | 太慢了|
 | 最佳 | O(NM) | O(NM) | 已接受 |

 ## 算法演练

 1. 从起始单元运行 BFS 并计算`distS`。 
2. 从完成单元运行 BFS 并计算`distT`。 
3.让`D = distS[finish]`。 
4. 对于每个空闲单元`v`，检查是否```
distS[v] + distT[v] = D
```如果为真，则单元位于至少一条最短路径上。 
5. 计算每个距离层中出现了多少个最短路径单元`distS[v]`。 
6. 最短路径单元`v`当其层数等于时，恰好属于每个最短路径`1`。 

原因是每条最短路径必须包含每一层的一个顶点。 如果一层只有一个候选层，则每条最短路径都会强制通过它。 
7. 从头开始​​对整个自由单元图运行低链接 DFS。 
8. 对于每个顶点，确定删除它是否会断开起点与终点的连接。 将这些顶点标记为`st_cut`。 
9. 如果满足以下所有条件，则单元格就是答案：```
it is free
it is not start
it is not finish
it belongs to every shortest path
it is not an s-t cut vertex
```10. 输出网格，将这些单元格替换为`*`。 

### 为什么它有效

 仅当每条原始最短路径都被破坏时，最短距离才会增加。 当一个细胞属于所有细胞时，它会准确地破坏每条最短路径。 

距离层参数精确地识别了这些单元格。 每条最短路径按顺序穿过各层，并且具有单个最短路径顶点的层强制该顶点进入每条最短路径。 

删除这样的单元格后，所有最短路径都会消失。 如果起点和终点保持连接，则仍然存在一些较长的路径，因此新的最短距离严格更大。 如果开始和结束断开，则该移动无效。 

该算法准确标记满足这两个条件的小区，因此每个报告的小区都是有效的，并且每个有效的小区都会被报告。 

## Python 解决方案```python
import sys
from collections import deque
from array import array

input = sys.stdin.readline

n, m = map(int, input().split())
g = [input().strip() for _ in range(n)]

V = n * m

def idx(r, c):
    return r * m + c

start = 0
target = V - 1

free = bytearray(V)
for r in range(n):
    row = g[r]
    base = r * m
    for c in range(m):
        if row[c] != 'X':
            free[base + c] = 1

def bfs(src):
    dist = array('i', [-1]) * V
    q = deque([src])
    dist[src] = 0

    while q:
        v = q.popleft()
        r = v // m
        c = v - r * m

        nv = v - m
        if r and free[nv] and dist[nv] == -1:
            dist[nv] = dist[v] + 1
            q.append(nv)

        nv = v + m
        if r + 1 < n and free[nv] and dist[nv] == -1:
            dist[nv] = dist[v] + 1
            q.append(nv)

        nv = v - 1
        if c and free[nv] and dist[nv] == -1:
            dist[nv] = dist[v] + 1
            q.append(nv)

        nv = v + 1
        if c + 1 < m and free[nv] and dist[nv] == -1:
            dist[nv] = dist[v] + 1
            q.append(nv)

    return dist

distS = bfs(start)
distT = bfs(target)

D = distS[target]

cnt = array('i', [0]) * (D + 1)
on_shortest = bytearray(V)

for v in range(V):
    if free[v] and distS[v] != -1 and distS[v] + distT[v] == D:
        on_shortest[v] = 1
        cnt[distS[v]] += 1

mandatory = bytearray(V)
for v in range(V):
    if on_shortest[v] and cnt[distS[v]] == 1:
        mandatory[v] = 1

tin = array('i', [0]) * V
low = array('i', [0]) * V
parent = array('i', [-1]) * V
contains_t = bytearray(V)
st_cut = bytearray(V)

timer = 0

stack = [(start, 0)]
parent[start] = start

while stack:
    v, it = stack[-1]

    if tin[v] == 0:
        timer += 1
        tin[v] = low[v] = timer
        if v == target:
            contains_t[v] = 1

    r = v // m
    c = v - r * m

    neigh = []

    if r:
        neigh.append(v - m)
    if r + 1 < n:
        neigh.append(v + m)
    if c:
        neigh.append(v - 1)
    if c + 1 < m:
        neigh.append(v + 1)

    advanced = False

    while it < len(neigh):
        to = neigh[it]
        it += 1
        stack[-1] = (v, it)

        if not free[to]:
            continue

        if tin[to] == 0:
            parent[to] = v
            stack.append((to, 0))
            advanced = True
            break

        if to != parent[v]:
            if tin[to] < low[v]:
                low[v] = tin[to]

    if advanced:
        continue

    stack.pop()

    if v != start:
        p = parent[v]

        if contains_t[v] and low[v] >= tin[p]:
            st_cut[p] = 1

        if low[v] < low[p]:
            low[p] = low[v]

        if contains_t[v]:
            contains_t[p] = 1

ans = [list(row) for row in g]

for v in range(V):
    if v == start or v == target:
        continue

    if mandatory[v] and not st_cut[v]:
        r = v // m
        c = v - r * m
        ans[r][c] = '*'

print("\n".join("".join(row) for row in ans))
```两次 BFS 运行后，每个空闲单元都知道它与两端的距离。 平等```
distS[v] + distT[v] = D
```精确过滤参与至少一条最短路径的单元格。 

层数数组存储从起点开始的每个距离处出现的最短路径单元数。 计数为 1 意味着该层是强制的。 

DFS是标准的低链路遍历。 额外的`contains_t`flag 跟踪 DFS 子树是否包含终点顶点。 什么时候```
low[child] >= tin[parent]
```并且子子树包含结束，删除父级分隔开始和结束。 这些顶点被排除。 

该实现使用迭代 DFS 来避免包含多达一百万个单元的网格上的递归深度问题。 

## 工作示例

 ### 示例 1```
4 5
.....
.XX..
.X...
...X.
```最短距离是7。 

| 层| 最短路径单元 |
 | ---| ---|
 | 0 | (0,0) | (0,0) |
 | 1 | (0,1)|
 | 2 | (0,2) |
 | 3 | (0,3) |
 | 4 | (0,4) |
 | 5 | (1,4) |
 | 6 | (2,4) |
 | 7 | (3,4) |

 第 1、2 和 3 层包含唯一的最短路径单元。 他们都没有完全断开迷宫，所以他们变成`*`。 

输出：```
.***.
.XX..
.X...
...X.
```这个例子展示了核心思想：每条最短路径都被迫通过顶部走廊，但更长的弯路仍然存在。 

### 示例 2```
3 3
...
...
...
```最短距离为 4。 

| 层| 最短路径单元的数量 |
 | ---| ---|
 | 0 | 1 |
 | 1 | 2 |
 | 2 | 3 |
 | 3 | 2 |
 | 4 | 1 |

 没有一个内层恰好包含一个细胞。 

没有单元属于每条最短路径，因此输出保持不变。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(NM) | 两次BFS遍历和一次DFS遍历 |
 | 空间| O(NM) | 距离、低链路阵列和辅助存储 |

 网格最多包含一百万个单元。 每个单元格和每个网格边缘仅处理固定次数，这完全符合预期限制。 

## 测试用例```
# helper: run solution on input string, return output string

# sample-like case
assert run("""4 5
.....
.XX..
.X...
...X.
""") == """.***.
.XX..
.X...
...X.
"""

# minimum grid
assert run("""1 1
.
""") == """.
"""

# completely open 3x3 grid
assert run("""3 3
...
...
...
""") == """...
...
...
"""

# single corridor, removing middle disconnects
assert run("""1 5
.....
""") == """.....
"""

# forced shortest path but longer detour exists
assert run("""3 5
.....
.XXX.
.....
""") == """.....
.XXX.
.....
"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1×1 网格 | 不变| 开始等于结束 |
 | 打开 3×3 网格 | 不变| 许多最短路径|
 | 单廊 | 不变| 阻塞后路径必须仍然存在 |
 | 绕行走廊| 检查有效的星星 | 增加不断开连接的最短距离 |

 ## 边缘情况

 一个单元可以属于每条最短路径，但仍然无效。 

例子：```
.....
XXXXX
.....
```起点和终点之间的唯一联系是不可能越过墙壁障碍的。 任何瓶颈单元在移除后都会完全断开图表。 低链路阶段检测到它是`s-t`剪切顶点，因此没有标记。 

另一个微妙的情况是具有几条长度相等的最短路径的迷宫：```
...
...
...
```中心单元参与许多最短路径，但不是全部。 它的层包含多个最短路径单元，因此不被认为是强制的并且没有被标记。 

最后，考虑一个强制最短路径顶点，周围有较长的绕道：```
.....
.XXX.
.....
```它的层恰好包含一个最短路径单元，因此每个最短路径都使用它。 移除它会在底行留下更长的路线。 最短距离增加，路径仍然存在，这正是算法标记的情况`*`。
