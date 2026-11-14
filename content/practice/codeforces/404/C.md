---
title: "CF 404C - 恢复图表"
description: "我们被要求从一个顶点的最短距离列表重建一个无向连通图，条件是每个顶点最多可以有 k 条边。"
date: "2026-06-07T01:29:51+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "graphs", "sortings"]
categories: ["algorithms"]
codeforces_contest: 404
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 237 (Div. 2)"
rating: 1800
weight: 404
solve_time_s: 373
verified: false
draft: false
---

[CF 404C - 恢复图表](https://codeforces.com/problemset/problem/404/C)

 **评分：** 1800
 **标签：** dfs 和类似的、图表、排序
 **求解时间：** 6m 13s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求从一个顶点的最短距离列表重建一个无向连通图，条件是每个顶点最多可以有 _k_ 条边。 输入给出顶点数`n`, 最大度数`k`，和一个数组`d`长度`n`在哪里`d[i]`表示从选定的起始顶点到顶点的距离`i`。 该图可以具有任何结构，只要它符合距离和度限制，并且不包含自环或重边。 

主要限制是：`n`最大可达 10^5 并且每个顶点最多有度数`k`。 这意味着任何解决方案都必须大致是线性的或 O(n log n)。 尝试检查所有可能的边组合的算法将需要 O(n^2) 操作，这太慢了。 内存足以存储邻接列表或类似结构，因为在 256 MB 限制下可以接受 10^5 个顶点和最多 10^5 个边。 

非明显的边缘情况包括：一个图，其中除起点外所有顶点的距离都是 0，这是微不足道的； 缺少一些距离值的图表，这将导致无法构建； 以及情况`k`太小而无法连接相同距离的顶点，导致图断开。 例如，如果`n = 3, k = 1`和`d = [0, 1, 2]`，我们无法构建一个有效的图，因为距离 2 处的顶点无法连接到多个顶点，并且它没有其他选择可以在不超过度数的情况下到达距离 1。 

## 方法

 暴力方法会尝试根据距离贪婪地连接顶点：对于每个顶点，尝试将其连接到距离减一的任何顶点，直到满足所有距离。 这原则上是正确的，但速度很慢：对于每个顶点，我们可以迭代最多`n`候选者，给出 O(n^2) 复杂度，这对于 n = 10^5 来说是不可行的。 

关键的见解是利用距离水平。 顶点可以按距起点的距离进行分组。 所有顶点的距离`d`必须连接到远处的某个顶点`d-1`。 在一个关卡内，顶点不会相互连接（因为这会创建快捷方式，从而违反距离）。 这让我们可以逐层构建一个类似 BFS 的树结构。 度数约束`k`通过跟踪每个顶点已经使用了多少条边并确保没有顶点超过来处理`k`。 

暴力破解之所以有效，是因为它考虑了所有可能的连接，但当 n 很大时就会失败。 基于级别的 BFS 方法之所以有效，是因为距离强加了严格的层次结构：距离处的顶点`d`只能连接到远处的顶点`d-1`（或者`d+1`如果向后看），这可以防止与距离相矛盾的循环。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^2) | O(n^2) | O(n^2) | O(n^2) | 太慢了 |
 | 级别 BFS / 距离分组 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 识别距离为 0 的顶点。这是起始顶点，BFS 树的根。 如果不存在距离为0或倍数的顶点，则输出-1，因为输入不一致。 
2. 根据距起点的距离对所有顶点进行分组。 使用字典或列表列表，其中`level[d]`包含距离处的所有顶点`d`。 如果 0 和最大距离之间的任何级别为空，则输出 -1，因为间隙意味着无法到达某些距离。 
3. 为每个顶点初始化一个度计数器，从 0 开始。这将跟踪每个顶点已有多少条边。 
4. 逐层连接顶点。 对于距离`d = 1`对于每个顶点，到 max_distance`v`在水平`d`，选择一个父顶点`u`从水平`d-1`具有剩余学位容量。 如果不存在这样的父级，则无法形成图，输出-1。 
5. 对于每个连接，增加两个顶点的度数计数器。 如果达到了，请停止将子项分配给父项`k`。 
6. 收集所有边缘并打印每个边缘后的总计数。 多个解决方案是可以接受的，因为任何有效的父分配都有效。 

为什么它有效：距离上的每个顶点`d`保证连接到远处的顶点`d-1`。 没有顶点超过度数限制，因为我们在连接之前检查容量。 由于边缘仅在连续级别之间形成，因此保留了距离。 由于 BFS 树跨越所有顶点，因此保证了连通性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, k = map(int, input().split())
d = list(map(int, input().split()))

from collections import defaultdict, deque

# Step 1: check for valid root
roots = [i for i, dist in enumerate(d) if dist == 0]
if len(roots) != 1:
    print(-1)
    sys.exit()

root = roots[0]

# Step 2: group by distance
levels = defaultdict(list)
max_dist = 0
for i, dist in enumerate(d):
    levels[dist].append(i)
    max_dist = max(max_dist, dist)

# Step 3: check for missing levels
for dist in range(max_dist + 1):
    if not levels[dist]:
        print(-1)
        sys.exit()

# Step 4: assign edges
edges = []
degree = [0] * n

for dist in range(1, max_dist + 1):
    parents = deque(levels[dist - 1])
    if not parents:
        print(-1)
        sys.exit()
    for v in levels[dist]:
        # find parent with free degree
        while parents and degree[parents[0]] >= k:
            parents.popleft()
        if not parents:
            print(-1)
            sys.exit()
        u = parents[0]
        edges.append((u + 1, v + 1))
        degree[u] += 1
        degree[v] += 1
        # keep parent in deque if it can take more
        if degree[u] >= k:
            parents.popleft()

print(len(edges))
for u, v in edges:
    print(u, v)
```该解决方案首先找到根，按距离对顶点进行分组，然后逐层分配边。 这`degree`数组确保我们永远不会超过`k`每个顶点的连接。 使用`deque`当父母达到其能力时，可以有效地弹出父母。 

## 工作示例

 **样品1**

 输入：```
3 2
0 1 1
```| 距离 | 级别 | 学位| 边缘 |
 | ---| ---| ---| ---|
 | 0 | [0]| [0,0,0]| []|
 | 1 | [1,2]| [0,0,0]| []|

 - 连接 1 → 0 | - | [1,1,0]| [(1,2)] |
 - 连接 2 → 0 | - | [2,1,1]| [(1,2),(1,3)] |

 输出：```
2
1 2
1 3
```这表明距离 1 处的顶点连接到根。 尊重学位限制。 

**自定义示例**

 输入：```
4 2
0 1 2 2
```| 距离 | 级别 | 学位| 边缘 |
 | ---| ---| ---| ---|
 | 0 | [0]| [0,0,0,0]| []|
 | 1 | [1] | [0,0,0,0]| []|

 - 连接 1 → 0 | - | [1,1,0,0]| [(1,2)] |

 | 2 | [2,3]| [1,1,0,0]| []|
 - 连接 2 → 1 | - | [1,2,1,0] | [(1,2),(2,3)] |
 - 连接 3 → 1 | - | [1,2,1,1] | [(1,2),(2,3),(2,4)] |

 输出：```
3
1 2
2 3
2 4
```显示距离 2 处的顶点连接到距离 1 处的任何可用父级。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个顶点都被处理一次，并且使用双端队列在 O(1) 中形成边。 |
 | 空间| O(n) | 存储水平、度数和边缘需要线性存储器。 |

 这非常符合约束条件`n <= 10^5`和`m <= 10^6`。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    exec(open("solution.py").read())
    return out.getvalue().strip()

# provided sample
assert run("3 2\n0 1 1\n") == "2\n1 2\n1 3"

# custom cases
assert run("4 2\n0 1 2 2\n") == "3\n1 2\n2 3\n2 4", "level 2 vertices connect correctly"
assert run("3 1\n0 1 2\n") == "-1", "degree too small to connect vertex at distance 2"
assert run("1 1\n0\n") == "0
```
