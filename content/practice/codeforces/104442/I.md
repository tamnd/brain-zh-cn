---
title: "CF 104442I - C\u00e1lculo num\u00e9rico"
description: "我们在二维整数平面上给出了几个独立的场景。 在每个场景中，机器人从坐标 $I = (x1, y1)$ 开始，并且必须到达目标坐标 $F = (x2, y2)$。"
date: "2026-06-30T18:07:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104442
codeforces_index: "I"
codeforces_contest_name: "AdaByron Regional Madrid 2023"
rating: 0
weight: 104442
solve_time_s: 57
verified: true
draft: false
---

[CF 104442I - C\u00e1lculo num\u00e9rico](https://codeforces.com/problemset/problem/104442/I)

 **评级：** -
 **标签：** -
 **求解时间：** 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在二维整数平面上给出了几个独立的场景。 在每个场景中，机器人从一个坐标开始$I = (x_1, y_1)$并且必须到达目标坐标$F = (x_2, y_2)$。 机器人在整数网格点上移动，但平面是无界的，这意味着它不限于初始坐标范围。 

有些网格点是被禁止的。 如果某个坐标被列为障碍物，则不允许机器人站在该坐标上。 它可以在所有其他整数坐标中自由移动。 

移动发生在相邻网格点之间。 成本取决于移动类型：某些移动成本为 8，其他移动成本为 16。如果从开始到结束不存在不踩过禁止点的有效路径，则答案为$-1$。 否则我们必须计算最小可能的总成本。 

关键的解释是，我们正在解决隐式无限图上的最短路径问题，其中顶点除了阻塞顶点之外都是整数坐标，边用两个可能的权重连接几何邻居。 

坐标的约束很小，在$-50$和$50$，每个测试用例最多有 100 个障碍。 然而，机器人被允许离开这个盒子，因此该图没有明确的界限。 这立即排除了任何尝试构建整个网格或在大矩形上执行密集 DP 的方法，因为原则上可到达的区域是无界的。 

最危险的边缘情况是障碍物形成紧密的屏障，迫使绕道到初始边界框之外。 例如，如果开始时间为$(0,0)$，结束于$(2,0)$，以及所有点$(1,y)$为了$y \in [-50,50]$被阻挡时，仅限于边界矩形的天真的 BFS 会错误地得出无法到达的结论，或者错过绕过障碍物的真正绕道$y=51$。 

另一个微妙的情况是起点或终点邻近许多障碍物。 尝试“更接近”的贪婪或基于启发式的方法可能会陷入局部最小值，因为最便宜的立即移动可能会导致进入被阻塞节点包围的死区。 

## 方法

 一个蛮力的想法是将每个整数坐标视为一个节点，并在无限网格上运行 BFS 或 Dijkstra。 从每个节点，我们将尝试所有 8 种可能的移动，跳过障碍。 这是正确的，因为它直接对图进行建模，但由于节点数量是无限的，因此不可能按照所述执行。 

关键的观察是，虽然网格是无限的，但唯一相关的“洞”是障碍点，而且障碍点很少。 具有单元结构的网格中的最短路径不会从任意远的徘徊中受益，因为移动成本随着距离的增加而增加，并且探索空白空间没有奖励。 可以假设任何最佳路径都停留在包含起点、终点和所有障碍物的边界框内，可能会小幅扩展以允许绕过边界相邻障碍物。 

这将问题简化为有限最短路径问题。 我们将自己限制在一个覆盖所有点的网格中$\min(x)$到$\max(x)$，类似地对于$y$，在每个方向上扩展 1。 在这个有限的节点集上，我们运行 Dijkstra，因为边有两个不同的权重。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 无限 BFS 结束$\mathbb{Z}^2$| O(无穷大) | O(无穷大) | 不可行|
 | 有界网格 + Dijkstra |$O(HW \log(HW))$|$O(HW)$| 已接受 |

 ## 算法演练

 我们将网格视为加权图，其节点是精心选择的边界矩形内的整数坐标。 

1. 我们读取起点、终点和障碍物坐标，并收集所有 x 和 y 值。 根据这些我们计算最小和最大 x 和 y。 我们将这个范围在各个方向上扩大 1 个单位。 扩展确保我们可以绕过正好位于有用区域边界上的障碍物。 
2. 我们构建一组用于 O(1) 成员资格检查的分块坐标。 这很重要，因为障碍物查找发生在每个放松步骤期间。 
3. 我们从初始坐标开始运行 Dijkstra 算法。 我们维护一个状态优先队列$(cost, x, y)$。 
4. 从每个弹出状态，我们尝试向所有 8 个方向移动。 每次移动都会导致一个邻居坐标。 如果该坐标位于边界框之外或被阻挡，我们将丢弃它。 
5. 每个有效移动都有固定成本，具体取决于方向类型。 直线移动成本为 8，对角移动成本为 16。如果我们找到一条更便宜的路径，我们就会放松邻居。 
6. 一旦到达目标坐标，我们就提前停止，因为Dijkstra保证这是当时可能的最小成本。 
7. 如果从未达到目标，我们输出$-1$。 

这样做的原因是任何最佳路径都可以嵌入到有限边界框中。 在该区域之外，任何绕行都可以在不增加成本的情况下向后投影，因为移动成本是统一的，并且仅取决于步骤类型，而不取决于绝对位置。 因此，限制图并不会消除最佳解决方案。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

INF = 10**18

# 8 directions: (dx, dy, cost)
dirs = [
    (1, 0, 8), (-1, 0, 8), (0, 1, 8), (0, -1, 8),
    (1, 1, 16), (1, -1, 16), (-1, 1, 16), (-1, -1, 16)
]

P = int(input())
for _ in range(P):
    x1, y1 = map(int, input().split())
    x2, y2 = map(int, input().split())

    n = int(input())
    blocked = set()

    xs = [x1, x2]
    ys = [y1, y2]

    for _ in range(n):
        x, y = map(int, input().split())
        blocked.add((x, y))
        xs.append(x)
        ys.append(y)

    minx, maxx = min(xs) - 1, max(xs) + 1
    miny, maxy = min(ys) - 1, max(ys) + 1

    def inside(x, y):
        return minx <= x <= maxx and miny <= y <= maxy

    dist = {}
    pq = []

    start = (x1, y1)
    if start in blocked:
        print(-1)
        continue

    dist[start] = 0
    heapq.heappush(pq, (0, x1, y1))

    ans = -1

    while pq:
        d, x, y = heapq.heappop(pq)

        if d != dist.get((x, y), INF):
            continue

        if (x, y) == (x2, y2):
            ans = d
            break

        for dx, dy, w in dirs:
            nx, ny = x + dx, y + dy
            if not inside(nx, ny):
                continue
            if (nx, ny) in blocked:
                continue

            nd = d + w
            if nd < dist.get((nx, ny), INF):
                dist[(nx, ny)] = nd
                heapq.heappush(pq, (nd, nx, ny))

    print(ans)
```该实现依赖于 Dijkstra，因为边权重不统一。 优先级队列确保每当我们最终确定一个节点时，我们就已经拥有其最优成本。 

边界框限制使得无限网格变得易于管理。 没有它，算法将永远不会终止。 

## 工作示例

 考虑一个简单的情况，其中 start 是$(0,0)$，结束是$(1,1)$，并且没有任何障碍。 

我们比较两种可能的路径：直接对角线移动，或两条直线移动。 

| 步骤| 职位| 成本| 行动|
 | --- | --- | --- | --- |
 | 1 | (0,0) | (0,0) | 0 | 开始 |
 | 2 | (1,1) | 16 | 16 对角线移动|

 该算法立即选择对角线，因为它是最短路径。 

现在考虑对角线被阻挡的情况：开始$(0,0)$， 结尾$(1,1)$，障碍物在$(1,1)$无效，因此我们调整示例：障碍物位于$(1,0)$。 

| 步骤| 职位| 成本| 行动|
 | --- | --- | --- | --- |
 | 1 | (0,0) | (0,0) | 0 | 开始 |
 | 2 | (0,1)| 8 | 向上 |
 | 3 | (1,1) | 16 | 16 对|

 这显示了算法如何自然地绕过阻塞的单元格并通过替代路径累积成本。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(K \log K)$| Dijkstra 最多结束$K = (dx \cdot dy)$有界网格点 |
 | 空间|$O(K)$| 距离图和优先级队列存储|

 边界框很小，因为每个方向的坐标限制在 100 左右，因此有效网格最多约为$200 \times 200$，使解决方案在限制下轻松快速。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    INF = 10**18
    dirs = [
        (1, 0, 8), (-1, 0, 8), (0, 1, 8), (0, -1, 8),
        (1, 1, 16), (1, -1, 16), (-1, 1, 16), (-1, -1, 16)
    ]

    P = int(input())
    out = []

    for _ in range(P):
        x1, y1 = map(int, input().split())
        x2, y2 = map(int, input().split())
        n = int(input())

        blocked = set()
        xs = [x1, x2]
        ys = [y1, y2]

        for _ in range(n):
            x, y = map(int, input().split())
            blocked.add((x, y))
            xs.append(x)
            ys.append(y)

        minx, maxx = min(xs) - 1, max(xs) + 1
        miny, maxy = min(ys) - 1, max(ys) + 1

        def inside(x, y):
            return minx <= x <= maxx and miny <= y <= maxy

        if (x1, y1) in blocked:
            out.append("-1")
            continue

        dist = {}
        import heapq
        pq = [(0, x1, y1)]
        dist[(x1, y1)] = 0
        ans = -1

        while pq:
            d, x, y = heapq.heappop(pq)
            if d != dist.get((x, y), INF):
                continue
            if (x, y) == (x2, y2):
                ans = d
                break
            for dx, dy, w in dirs:
                nx, ny = x + dx, y + dy
                if not inside(nx, ny): 
                    continue
                if (nx, ny) in blocked:
                    continue
                nd = d + w
                if nd < dist.get((nx, ny), INF):
                    dist[(nx, ny)] = nd
                    heapq.heappush(pq, (nd, nx, ny))

        out.append(str(ans))

    return "\n".join(out)

# custom cases
assert run("1\n0 0\n1 1\n0") == "16"
assert run("1\n0 0\n2 0\n1\n1 0") == "32"
assert run("1\n0 0\n0 0\n0") == "0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 直接对角线| 16 | 16 对角成本正确性 |
 | 中间受阻| 32 | 32 绕行处理|
 | 相同的开始/结束 | 0 | 零长度路径|

 ## 边缘情况

 关键的边缘情况是最短路径需要移动到由起点、终点和障碍物定义的直接矩形之外。 该算法可以处理这一问题，因为边界框扩大了一个单位，从而在紧密的障碍物周围形成最小的绕行走廊。 

另一种情况是起点或终点被大多数边包围。 例如，如果$(x_1, y_1)$当除了一个对角线逃逸之外的所有相邻节点都被阻止时，Dijkstra 仍然探索剩余的有效边，因为它统一考虑所有 8 个方向并且不依赖于贪婪级数。 

最后一个边缘情况是开始等于结束。 该算法正确地将距离初始化为零，并立即返回，而不进入扩展循环，因为第一个提取的节点已经与目标匹配。
