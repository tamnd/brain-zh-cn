---
title: "CF 1422D - 回家"
description: "我们正在一个巨大的网格上移动。 起始单元格为 $(sx,sy)$，目的地为 $(fx,fy)$。 步行正常工作：水平或垂直移动一个单元格需要一分钟，因此两个位置之间步行的成本是曼哈顿距离。"
date: "2026-06-11T06:22:12+07:00"
tags: ["codeforces", "competitive-programming", "graphs", "shortest-paths", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1422
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 675 (Div. 2)"
rating: 2300
weight: 1422
solve_time_s: 205
verified: true
draft: false
---

[CF 1422D - 回家](https://codeforces.com/problemset/problem/1422/D)

 **评分：** 2300
 **标签：** 图、最短路径、排序
 **求解时间：** 3m 25s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在一个巨大的网格上移动。 起始单元格是$(s_x,s_y)$目的地是$(f_x,f_y)$。 步行正常工作：水平或垂直移动一个单元格需要一分钟，因此两个位置之间步行的成本是曼哈顿距离。 

还有一些特殊的地点。 特殊的位置$(x_i,y_i)$可以从任何共享其位置的位置立即到达$x$- 坐标或其$y$-协调。 同样地，如果我们站在$(a,b)$，我们可以移动到$(x_i,y_i)$按成本$$\min(|a-x_i|,\;|b-y_i|).$$如果$x$-坐标已经匹配，第一项为零并且传送是免费的。 当$y$- 坐标匹配。 

任务是找出到达家所需的最短时间。 

城市规模$n$可以大到$10^9$，它立即告诉我们网格本身无法表示。 特殊位置的个数最多为$10^5$，因此任何直接作用于一组特殊位置的解决方案都是可行的。 图表与$10^5$顶点是可以管理的，但是具有所有成对边的图将包含大约$10^{10}$边缘，这是完全不可能的。 

问题中最危险的部分是了解传送如何交互。 

考虑：```
start = (1,1)
finish = (100,100)

special:
(1,50)
(50,50)
```第一个特殊点是可以免费到达的，因为$x$- 坐标已经匹配。 到达后$(1,50)$，第二个特殊点可以通过花费到达$\min(49,0)=0$因为$y$- 坐标匹配。 仅考虑特殊点之间的普通曼哈顿距离的解决方案会错过这一自由移动链。 

另一个微妙的情况是，当不使用特殊点时是最佳的。```
start = (1,1)
finish = (3,3)
```没有特殊的地点。 

答案很简单$4$。 任何图表构建都必须包括直接步行到目的地的可能性。 

第三个陷阱是假设每对特殊点都需要一条边。```
(1,100)
(2,100)
(1000000000,100)
```有用的转换来自按坐标排序后的相邻点。 连接每一对都是正确的，但速度太慢。 关键的观察是只有按排序顺序的最近邻居才重要。 

## 方法

 一个自然的第一个想法是构建一个图，其顶点是特殊位置以及开始和结束位置。 

假设我们在每对特殊位置之间创建一条边。 从特殊地点移动的费用$i$到特殊点$j$是$$\min(|x_i-x_j|,\;|y_i-y_j|).$$我们还可以用成本将起点连接到每个特殊点$$\min(|s_x-x_i|,\;|s_y-y_i|).$$最终每个顶点都可以直接步行到曼哈顿距离的目的地。 

该图正确地模拟了问题，Dijkstra 算法会找到答案。 

问题是尺寸。 和$m=10^5$，一个完整的图大致包含$$\frac{m(m-1)}2 \approx 5 \cdot 10^9$$边缘。 存储或处理该图是不可能的。 

突破来自于检查边缘权重$$\min(|x_i-x_j|,\;|y_i-y_j|).$$假设两个点相连，因为它们$x$- 坐标很接近。 当点按以下顺序排序时$x$，最便宜的有用连接$x$-维度始终出现在该排序中的相邻点之间。 

这与几个几何最短路径问题中使用的观察结果相同。 If point$A$并点$C$被另一个点分开$B$已排序$x$-订购，然后$$|x_A-x_C|$$不能小于两个相邻间隙。 任何想利用小资源的路径$x$-差异可以通过相邻点来实现。 

同样的推理也适用于$y$-协调。 

因此，我们不是连接每一对，而是对特殊点进行排序$x$并连接相邻对。 然后我们排序$y$并再次连接相邻对。 得到的图只有$O(m)$边缘。 

减少之后，Dijkstra 算法在限制范围内运行良好。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解完整图|$O(m^2 \log m)$|$O(m^2)$| 太慢了 |
 | 邻域图 + Dijkstra |$O(m \log m)$|$O(m)$| 已接受 |

 ## 算法演练

 ### 图表解读

 每个特殊位置都成为图的顶点。 

我们不为起始位置创建顶点。 相反，起点提供了每个特殊位置的初始距离。 

我们也不为目的地创建顶点。 回家被视为从任何访问过的地点的最后步行步骤。 

### 步骤

 1. 读取所有特殊位置并为每个特殊位置分配一个索引。 
2. 对特殊位置进行排序$x$-协调。 
3. 对于此排序中的每个相邻对，添加一条无向边，其权重等于$x$- 坐标。 

基于最短的过渡$x$-维度始终可以通过按排序顺序的相邻点来表示。 
4. 对特殊位置进行排序$y$-协调。 
5. 对于此排序中的每个相邻对，添加一条无向边，其权重等于$y$- 坐标。 

这捕获了基于以下所有有用的转换$y$-方面。 
6. 初始化 Dijkstra。 

对于每一个特殊点$i$,$$dist[i] = \min(|s_x-x_i|,\;|s_y-y_i|).$$这正是从一开始就到达那个特殊位置的成本。 
7. 用直接从起点到终点步行的成本来初始化答案：$$|s_x-f_x|+|s_y-f_y|.$$8. 在特殊位置图上运行 Dijkstra。 
9. 每当一个顶点$i$从优先级队列中提取，使用更新答案$$dist[i] + |x_i-f_x| + |y_i-f_y|.$$这代表使用传送到点$i$，然后直接步行回家。 
10. 以通常的 Dijkstra 方式松弛所有图形边缘。 
11. Dijkstra完成后，输出找到的最小答案。 

### 为什么它有效

 关键的属性是特殊位置之间的每个有用的转换都可以分解为排序中相邻点之间的移动$x$- 排序或排序$y$-命令。 

假设最优路径使用一条边，其成本由$x$-不同之处。 移动已排序的连续点$x$-order 会在不增加成本的情况下重现该成本，因为连续坐标间隙的总和等于总间隙。 同样的论点也适用于$y$-方面。 

因此，完整图中的每条最佳路线在仅由相邻对构建的稀疏图中都有一条等效路线。 然后，Dijkstra 计算到所有特殊位置的最短距离，并将每个位置与最终曼哈顿步行回家的距离相结合，检查每种可能的最佳策略。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    sx, sy, fx, fy = map(int, input().split())

    pts = []
    for i in range(m):
        x, y = map(int, input().split())
        pts.append((x, y, i))

    g = [[] for _ in range(m)]

    by_x = sorted(pts)
    for i in range(m - 1):
        x1, y1, id1 = by_x[i]
        x2, y2, id2 = by_x[i + 1]
        w = x2 - x1
        g[id1].append((id2, w))
        g[id2].append((id1, w))

    by_y = sorted(pts, key=lambda p: p[1])
    for i in range(m - 1):
        x1, y1, id1 = by_y[i]
        x2, y2, id2 = by_y[i + 1]
        w = y2 - y1
        g[id1].append((id2, w))
        g[id2].append((id1, w))

    INF = 10**30
    dist = [INF] * m
    pq = []

    for x, y, idx in pts:
        d = min(abs(sx - x), abs(sy - y))
        dist[idx] = d
        heapq.heappush(pq, (d, idx))

    ans = abs(sx - fx) + abs(sy - fy)

    while pq:
        curd, v = heapq.heappop(pq)
        if curd != dist[v]:
            continue

        x, y, _ = pts[v]

        ans = min(
            ans,
            curd + abs(x - fx) + abs(y - fy)
        )

        for to, w in g[v]:
            nd = curd + w
            if nd < dist[to]:
                dist[to] = nd
                heapq.heappush(pq, (nd, to))

    print(ans)

solve()
```该图仅包含特殊位置。 起始位置通过初始 Dijkstra 距离出现，该距离与从起始点到达每个特殊点的成本完全匹配。 

两个排序过程创建了稀疏图。 一个常见的错误是使用$$\min(|x_i-x_j|, |y_i-y_j|)$$作为相邻点之间的边权重。 接受的解决方案仅使用与排序顺序相对应的坐标差。 这是官方解决方案中的关键压缩参数。 

另一个微妙之处是最终答案的更新。 达到特殊点不会强制进一步使用传送。 我们随时都可能停下来直接走回家，因此每个提取的顶点都会贡献一个候选答案。 

所有值都很容易适合 64 位整数，但 Python 整数消除了任何溢出问题。 

## 工作示例

 ### 示例 1

 输入：```
5 3
1 1 5 5
1 2
4 1
3 3
```特别要点：

 | 索引 | 点|
 | ---| ---|
 | 0 | (1,2) |
 | 1 | (4,1) |
 | 2 | (3,3) |

 初始距离：

 | 顶点| 成本从开始 |
 | ---| ---|
 | (1,2) | 0 |
 | (4,1) | 0 |
 | (3,3) | 2 |

 迪杰斯特拉级数：

 | 弹出的顶点 | 距离 | 迄今为止最佳答案 |
 | ---| ---| ---|
 | (1,2) | 0 | 7 |
 | (4,1) | 0 | 5 |
 | (3,3) | 2 | 4+2=6 |

 找到的最小值是 5。 

这条轨迹表明了为什么直接步行并不总是最佳的。 传送让我们能够到达$(4,1)$免费并保存部分路线。 

### 示例 2

 输入：```
10 2
1 1 10 10
1 7
7 7
```初始距离：

 | 顶点| 成本|
 | ---| ---|
 | (1,7) | 0 |
 | (7,7) | 6 |

 迪杰斯特拉：

 | 弹出的顶点 | 距离 | 候选人回答|
 | ---| ---| ---|
 | (1,7) | 0 | 12 | 12
 | (7,7) | 6 | 12 | 12

 直接步行费用$18$，所以答案就变成了$12$。 

此示例演示了如何免费到达传送点可以显着缩短旅程。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(m \log m)$| 两种排序和 Dijkstra$O(m)$边缘 |
 | 空间|$O(m)$| 图表、距离和优先级队列 |

 和$m \le 10^5$，排序在运行时占主导地位。$m \log m$大约有几百万次操作，完全在 Python 的 2 秒限制之内。 该图仅包含线性多边，因此内存使用量始终低于限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
import heapq

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    n, m = map(int, input().split())
    sx, sy, fx, fy = map(int, input().split()

)
    pts = []
    for i in range(m):
        x, y = map(int, input().split())
        pts.append((x, y, i))

    g = [[] for _ in range(m)]

    by_x = sorted(pts)
    for i in range(m - 1):
        x1, y1, a = by_x[i]
        x2, y2, b = by_x[i + 1]
        w = x2 - x1
        g[a].append((b, w))
        g[b].append((a, w))

    by_y = sorted(pts, key=lambda p: p[1])
    for i in range(m - 1):
        x1, y1, a = by_y[i]
        x2, y2, b = by_y[i + 1]
        w = y2 - y1
        g[a].append((b, w))
        g[b].append((a, w))

    INF = 10**30
    dist = [INF] * m
    pq = []

    for x, y, idx in pts:
        d = min(abs(sx - x), abs(sy - y))
        dist[idx] = d
        heapq.heappush(pq, (d, idx))

    ans = abs(sx - fx) + abs(sy - fy)

    while pq:
        d, v = heapq.heappop(pq)
        if d != dist[v]:
            continue

        x, y, _ = pts[v]
        ans = min(ans, d + abs(x - fx) + abs(y - fy))

        for to, w in g[v]:
            nd = d + w
            if nd < dist[to]:
                dist[to] = nd
                heapq.heappush(pq, (nd, to))

    return str(ans) + "\n"

# sample
assert run(
"""5 3
1 1 5 5
1 2
4 1
3 3
"""
) == "5\n"

# no special locations
assert run(
"""10 0
1 1 10 10
"""
) == "18\n"

# start equals finish
assert run(
"""100 0
5 5 5 5
"""
) == "0\n"

# teleport immediately reachable
assert run(
"""10 1
1 1 10 10
1 10
"""
) == "9\n"

# large coordinate boundary
assert run(
"""1000000000 1
1 1 1000000000 1000000000
1 1000000000
"""
) == "999999999\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 没有特殊地点 | 18 | 18 直达曼哈顿路径 |
 | 开始等于结束 | 0 | 零距离解答|
 | 立即传送访问 | 9 | 通过匹配坐标免费获取 |
 | 大坐标| 999999999 | 正确处理$10^9$- 比例值 |

 ## 边缘情况

 ### 没有特殊地点

 输入：```
10 0
1 1 10 10
```该图是空的。 Dijkstra 从不处理任何顶点。 最初的答案是曼哈顿距离$$18.$$该值直接打印。 

### 目的地已经到达

 输入：```
100 0
5 5 5 5
```直接步行的答案从零开始。 没有任何路线可以对此进行改进，因此算法输出为零。 

###通过匹配坐标自由链

 输入：```
100 2
1 1 100 100
1 50
50 50
```第一个特殊点的初始距离为零，因为它$x$- 坐标与起点匹配。 

第二点是通过零成本连接$y$-过渡。 

Dijkstra 正确地传播这种自由运动并发现最佳路线。 这证实了传送链自然是由图构造处理的。 

### 非常大的网格

 输入：```
1000000000 1
1 1 1000000000 1000000000
1 1000000000
```网格本身永远不会被表示。 仅存储坐标。 所有计算都使用坐标之间的差异，因此算法仍然存在$O(m \log m)$无论大小$n$。
