---
title: "CF 105201L - 小加油站"
description: "城市是一棵树：每个十字路口都通过一条路径与其他十字路口相连。 交叉路口 1 始终包含原始加油站，而其他交叉路口可能暂时包含复制品。"
date: "2026-06-27T02:49:33+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105201
codeforces_index: "L"
codeforces_contest_name: "IME++ Open Contest 2024"
rating: 0
weight: 105201
solve_time_s: 71
verified: false
draft: false
---

[CF 105201L - 小加油站](https://codeforces.com/problemset/problem/105201/L)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 11s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 城市是一棵树：每个十字路口都通过一条路径与其他十字路口相连。 路口`1`始终包含原始加油站，而其他交叉路口可能暂时包含复制品。 在这一系列的日子里，副本被添加和删除，有时会询问从给定交叉路口到当前最近的现有加油站的距离。 

任务不是维护树本身。 道路永远不会改变。 挑战在于维护一组标记的顶点，其中标记的顶点意味着那里存在加油站，同时快速回答最小距离查询。 

这些约束迫使动态数据结构。 高达`2 * 10^5`交叉路口和`2 * 10^5`操作时，每次查询都扫描所有加油站的成本太高。 最坏的情况下，如果每次操作都是查询，而且站点很多，直接搜索就可以了`O(nq)`，这大约是`4 * 10^10`运营。 即使从每个查询顶点运行广度优先搜索也是不可能的。 我们需要每次操作的对数或接近对数的工作。 

有几种边缘情况会破坏简单的实现。 第一个是顶点处的原始站`1`永远不会消失。 例如：```
3 3
1 2
2 3
3 3
1 2
3 3
3 1
```输出是：```
0
0
```添加电台后`2`, 查询`3`给出距离`1`， 不是`0`，但重要的情况是查询顶点`1`必须始终返回`0`。 仅删除副本不得意外删除顶点`1`。 

另一个常见的错误是假设最近的站点始终位于最近添加的顶点之中。 例如：```
4 3
1 2
2 3
3 4
1 4
3 2
2 4
```输出是：```
0
```车站位于`1`仍然可用，因此在删除副本后`4`, 顶点`2`还有距离`1`到顶点`1`。 只记住添加内容而忘记旧的活动站点的结构将会失败。 

最后一个边缘情况是答案为零。 包含车站的交叉路口的查询必须立即返回零，因为最近的车站就是它本身。 

## 方法

 一个简单的解决方案是保留当前的加油站集，并且对于每个查询，从查询的交叉路口运行图形搜索，直到到达加油站。 这是正确的，因为广度优先搜索找到的第一个站点距离最近。 然而，一个查询已经可以访问每个顶点，并重复此操作`2 * 10^5`查询给出了不可接受的最坏情况。 

另一种直接的方法是存储所有站点并计算查询顶点到每个站点的距离。 通过最低公共祖先预处理可以快速进行树距离查询，但如果有很多站点，这仍然会留下太多工作。 暴力解决方案之所以成功，是因为它可以很好地处理单个查询，但它会失败，因为查询和更新的数量很大。 

关键的观察结果是树是静态的。 只有标记的顶点集会发生变化。 这使得质心分解变得合适。 质心将树分成更小的组件，每个顶点只属于`O(log n)`质心水平。 我们不是搜索整个树，而是存储每个质心附近的活动站的信息。 

对于每个质心`c`，我们保持距离`c`到属于质心分解路径的所有活动站`c`。 如果查询询问顶点`x`，我们检查所有质心祖先`x`。 任意路径从`x`到任意站点必须在某种程度上经过这些质心之一，因此最佳答案是以下最小值：```
distance(x, centroid) + closest station distance stored at centroid
```添加和删​​除站点只会更改存储在`O(log n)`其分解路径上的质心。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每个查询 O(n) | O(n) | 太慢了 |
 | 最佳 | 每次更新/查询 O(log n) | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 1. 构建树的质心分解。 在分解过程中，对于每个原始顶点存储对的列表`(centroid, distance)`描述其在质心树中的祖先以及到每个祖先的距离。 

该列表是普通树顶点和可以总结有关它的信息的质心之间的桥梁。 
2. 对于每个质心，维护一个包含到当前活动站点的距离的堆。 由于站点可以被删除，因此还需要维护第二个堆，其中包含应延迟删除的距离。 

延迟删除避免了从堆中间删除昂贵的操作。 当最小值出现在两个堆中时，两个副本都被丢弃。 
3. 初始激活顶点`1`，因为原来的加油站一直存在。 激活意味着将其距离插入其路径上的每个质心堆中。 
4. 当在顶点构建副本时`x`, 激活`x`。 对于每一个`(centroid, distance)`对属于`x`， 插入`distance`到质心的堆中。 
5. 当副本在顶点被销毁时`x`，停用它。 将对应的距离插入到所有质心的删除堆中`x`的路径。 
6. 对于顶点的查询`x`，检查每一个`(centroid, distance)`对属于`x`。 首先清理惰性删除堆，然后结合距离`x`到质心，最近的活动站距离存储在该质心。 

取所有质心祖先的最小值给出最近的站点。 

为什么它有效：

 树中的每一对顶点都有唯一的路径。 在质心分解中，对于任何顶点对，两个顶点的分解路径上都存在质心，并考虑它们通过该质心的连接。 该质心处的存储值表示从质心到活动站点的最短路线。 添加从查询顶点到同一质心的距离即可重建到该站的候选路径。 由于每个可能的站点都是通过某个质心祖先来考虑的，因此最小候选点正是真正的最近距离。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline
sys.setrecursionlimit(1 << 25)

n, q = map(int, input().split())
g = [[] for _ in range(n + 1)]

for _ in range(n - 1):
    a, b = map(int, input().split())
    g[a].append(b)
    g[b].append(a)

size = [0] * (n + 1)
dead = [False] * (n + 1)
paths = [[] for _ in range(n + 1)]

def calc_size(v, p):
    size[v] = 1
    for u in g[v]:
        if u != p and not dead[u]:
            size[v] += calc_size(u, v)
    return size[v]

def find_centroid(v, p, total):
    for u in g[v]:
        if u != p and not dead[u] and size[u] * 2 > total:
            return find_centroid(u, v, total)
    return v

def collect(v, p, d, c):
    paths[v].append((c, d))
    for u in g[v]:
        if u != p and not dead[u]:
            collect(u, v, d + 1, c)

def decompose(v):
    total = calc_size(v, 0)
    c = find_centroid(v, 0, total)
    dead[c] = True
    collect(c, 0, 0, c)
    for u in g[c]:
        if not dead[u]:
            decompose(u)

decompose(1)

add_heap = [[] for _ in range(n + 1)]
del_heap = [[] for _ in range(n + 1)]
active = [False] * (n + 1)

def activate(v):
    if active[v]:
        return
    active[v] = True
    for c, d in paths[v]:
        heapq.heappush(add_heap[c], d)

def deactivate(v):
    if not active[v]:
        return
    active[v] = False
    for c, d in paths[v]:
        heapq.heappush(del_heap[c], d)

def clean(c):
    while add_heap[c] and del_heap[c] and add_heap[c][0] == del_heap[c][0]:
        heapq.heappop(add_heap[c])
        heapq.heappop(del_heap[c])

def query(v):
    ans = 10 ** 9
    for c, d in paths[v]:
        clean(c)
        if add_heap[c]:
            ans = min(ans, d + add_heap[c][0])
    return ans

activate(1)

out = []
for _ in range(q):
    data = list(map(int, input().split()))
    if data[0] == 1:
        activate(data[1])
    elif data[0] == 2:
        deactivate(data[1])
    else:
        out.append(str(query(data[1])))

sys.stdout.write("\n".join(out))
```质心分解部分构建静态结构。`paths[v]`是重要的数组：它准确存储顶点在更新或查询时可以使用的质心。 

每个质心的两个堆实现了带有延迟删除的多重集。 Python堆只支持有效地删除最小元素，因此被破坏的站会被单独记录，并在到达顶部时被删除。 这使得每个堆操作都保持对数。 

顶点的激活`1`发生在处理查询之前，因为原始站是初始状态的一部分。 该问题保证删除操作仅针对副本，因此除了保持初始激活之外不需要额外的保护。 

所有距离都可以轻松地用 Python 整数表示。 递归限制增加是因为原始树可以是链，使得第一次深度优先搜索比Python的默认递归限制更深。 

## 工作示例

 使用示例：```
7 5
1 2
1 3
2 4
5 3
6 3
7 1
2 1
3 3
1 7
3 7
3 3
```重要的状态是：

 | 运营| 活跃电台 | 查询顶点 | 回答 |
 | --- | --- | --- | --- |
 | 开始| 1 | | |
 | 在原始语句中删除 1 是不可能的，因此仅删除副本 | | | |
 | 添加 7 | 1, 7 | 3 | 1 |
 | 查询 7 | 1, 7 | 7 | 0 |
 | 查询 3 | 1, 7 | 3 | 1 |

 该跟踪显示该结构保留了所有活动站点，而不仅仅是最新的站点。 质心堆存储两个站点位置，并允许查询找到其中的最小值。 

一个较小的例子：```
5 5
1 2
2 3
3 4
4 5
1 5
3 3
2 5
3 5
3 1
```踪迹是：

 | 运营| 活跃电台 | 查询 | 结果 |
 | --- | --- | --- | --- |
 | 初始状态| 1 | | |
 | 添加 5 | 1, 5 | 3 | 2 |
 | 查询 3 | 1, 5 | 5 | 0 |
 | 删除 5 | 1 | 5 | 4 |
 | 查询 1 | 1 | 1 | 0 |

 这演示了删除处理。 惰性删除堆仅在需要时删除过时的距离，而顶点处的永久站`1`仍然可用。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每次操作 O(log n) | 每个顶点仅出现在对数多个质心级别中。 |
 | 空间| O(n log n) | O(n log n) | 质心路径为每个分解级别的每个顶点存储一个条目。 |

 存储的质心对的最大数量约为`n log n`，大约有数百万个条目`n = 200000`。 每个事件的堆操作数量也是对数，符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    import heapq
    # paste the solution function here in a real test harness
    sys.stdin = old
    return ""

# The following cases should be run with the submitted solution wrapped
# into a callable function.

# Minimum tree:
# 1 1
# 3 1
# Expected:
# 0

# Chain with additions and removals:
# 5 5
# 1 2
# 2 3
# 3 4
# 4 5
# 1 5
# 3 3
# 2 5
# 3 5
# 3 1

# Star tree:
# 5 4
# 1 2
# 1 3
# 1 4
# 1 5
# 1 3
# 3 2
# 2 3
# 3 3

# Large shape should be generated separately:
# a chain of 200000 vertices with alternating add/query/remove operations
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单顶点|`0`| 尽可能小的树和永久站|
 | 链条| 沿线的距离 | 长路径和删除 |
 | 明星| 通过中心节点的距离 | 多种等距选择 |
 | 大链条| 快速对数更新 | 性能限制|

 ## 边缘情况

 对于常驻站情况，算法激活顶点`1`在阅读任何事件之前。 如果在顶点进行查询`1`，其质心路径包含存储的距离`0`从那个活跃的站开始，所以答案立即变为零。 

对于添加并随后删除的站点，激活会将其距离插入到每个相关质心堆中。 删除不会扫描堆或重建任何内容。 它将匹配值插入到删除堆中，并且对这些质心的下一个查询在使用最小值之前丢弃过时的值。 这可以防止删除的电台影响答案。 

对于本身包含站点的顶点处的查询，更新阶段已经将距离零插入到该顶点路径上的每个质心结构中。 在查询过程中，包含该顶点的质心贡献了零的候选值，因此返回的最小值是正确的。
