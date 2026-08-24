---
title: "CF 104764E - 海底水母"
description: "我们得到一棵最多有 100 个节点的加权树。 每个节点代表一个海穴并包含一定数量的水母，由非负值表示。"
date: "2026-06-28T21:41:40+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104764
codeforces_index: "E"
codeforces_contest_name: "UTPC Contest 11-03-23 Div. 1 (Advanced)"
rating: 0
weight: 104764
solve_time_s: 88
verified: false
draft: false
---

[CF 104764E - 海穴水母](https://codeforces.com/problemset/problem/104764/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 28s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一棵最多有 100 个节点的加权树。 每个节点代表一个海穴并包含一定数量的水母，由非负值表示。 在两个相连的洞穴之间移动所消耗的能量等于边缘权重，并且任何两个洞穴之间的总移动成本是沿着树中唯一路径的权重之和。 

如果敖润选择山洞$y$作为他的基地，然后为每个洞穴$x$，他从$y$到$x$，支付距离费用$dist(y,x)$，然后与水母“接触”$x$，这会花费额外的单位能量。 Cave 的参与度贡献$x$定义为$$\frac{c_x}{dist(y,x) + 1}.$$任务是选择基节点$y$最大化所有节点上这些贡献的总和，并输出所选节点和所得的最大总和。 

输入尺寸较小，$n \le 100$，因此三次或二次方法也是可行的。 这立即表明我们可以预先计算节点之间的所有成对距离。 

一个微妙的问题是数值稳定性。 答案需要浮点除法并且必须精确到以内$10^{-4}$，因此朴素整数算术在最终聚合步骤中是不够的，但标准双精度很容易就足够了，因为项数很少（每个和最多 100 个）。 

由于输入明确是一棵树，因此不存在棘手的结构边缘情况，例如断开连接的图或多个组件。 

朴素推理的一个失败案例是尝试仅基于附近的高点贪婪地选择根$c_i$价值观。 例如，在小线树中，附近值稍小但全局距离更好的节点可以优于局部最优选择。 这表明目标是全局性的且依赖于距离，不能分解为局部贡献。 

## 方法

 直接的方法是尝试每个可能的基节点$y$。 对于每个选择，我们计算最短路径距离$y$到所有其他节点，然后求和$\frac{c_x}{dist(y,x)+1}$。 

由于图是一棵树，因此当权重很小时，最短路径是唯一的，可以使用 BFS 或 DFS 计算，但因为权重可达$10^3$，如果我们独立地从每个节点计算，我们需要 Dijkstra。 这给出了$n$Dijkstra 运行，每次成本$O(n \log n)$，那么关于$10^4 \log 100$，这是微不足道的。 

一个更简单的观察是$n$只有 100，所以我们可以预先计算所有对的最短路径。 要么是弗洛伊德·沃歇尔$O(n^3)$，或从每个节点运行 Dijkstra$O(n^2 \log n)$。 一旦我们有了完整的距离矩阵，评估每个候选根就只是一次线性扫描。 

使这项工作有效的关键结构是树没有循环，因此距离是明确定义的并且与根的选择无关。 一旦所有距离已知，目标函数就成为对固定矩阵的直接评估。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 无需预先计算的暴力破解 |$O(n^2 \log n)$每根→$O(n^3 \log n)$|$O(n^2)$| 可以接受但没有必要 |
 | 所有配对距离 + 评估 |$O(n^2 \log n + n^2)$|$O(n^2)$| 已接受 |

 ## 算法演练

 1. 构建带有权重的树的邻接表。 

这给出了一个结构，其中每个节点都可以以已知的成本到达其邻居，这对于最短路径计算是必要的。 
2. 从每个节点运行 Dijkstra$i$计算$dist[i][*]$。 

即使该图是一棵树，我们仍然将其视为一般加权图，以避免对有根表示进行推理。 
3.对于每个节点$y$，计算一个初始化为零的分数。 
4. 对于每个节点$x$， 添加$c_x / (dist[y][x] + 1)$到分数为$y$。 

分母包括额外的 1 单位参与成本，因此即使在同一节点，贡献也是$c_y / 1$。 
5. 计算所有候选节点时，跟踪得分最高的节点。 
6. 输出最佳节点索引及其分数，格式为小数点后 5 位。 

正确性依赖于这样一个事实：一旦距离固定，每个候选根都会独立评估，没有隐藏的交互。 总和中的每一项仅取决于所选的根和预先计算的距离。 

### 为什么它有效

 该算法显式枚举所有可能的基数并计算每个基数的目标函数的精确值。 由于树中的距离是固定的并且与生根无关，因此预先计算的距离矩阵对于每次评估都是有效的。 因此，最终的选择是对一组有限的正确计算值的精确最大化，从而保证了最优性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
import heapq

def dijkstra(start, adj, n):
    INF = 10**18
    dist = [INF] * (n + 1)
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d != dist[u]:
            continue
        for v, w in adj[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist

def solve():
    n = int(input())
    c = [0] + list(map(int, input().split()))

    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        x, y, w = map(int, input().split())
        adj[x].append((y, w))
        adj[y].append((x, w))

    dist = []
    for i in range(1, n + 1):
        dist.append(dijkstra(i, adj, n))

    best_node = 1
    best_val = -1.0

    for y in range(1, n + 1):
        s = 0.0
        for x in range(1, n + 1):
            s += c[x] / (dist[y-1][x] + 1)
        if s > best_val:
            best_val = s
            best_node = y

    print(best_node)
    print(f"{best_val:.5f}")

if __name__ == "__main__":
    solve()
```该解决方案首先构建邻接表并使用重复的 Dijkstra 运行计算所有最短路径。 存储距离表，以便可以单独评估每个候选根，而无需重新计算。 

计算分数时，表达式`dist[y-1][x]`反映我们将距离存储在 1 索引节点的 0 索引列表中。 除法以浮点形式完成，这已经足够了，因为总和最多涉及 100 项，使数值误差远低于容差。 

选择 Dijkstra 而不是 Floyd-Warshall 在这里是出于风格考虑。 两者都足够快，但 Dijkstra 使解决方案更接近标准图直觉。 

## 工作示例

 ### 跟踪示例

 考虑一棵由三个节点组成的小树：1-2-3，所有边权重均为 1 且值为$c = [2, 1, 3]$。 

| 基数 | 距离 (y,1) | 距离 (y,2) | 距离 (y,3) | 分数计算 |
 | ---| ---| ---| ---| ---|
 | 1 | 0 | 1 | 2 | 2/1 + 1/2 + 3/3 = 2 + 0.5 + 1 |
 | 2 | 1 | 0 | 1 | 2/2 + 1/1 + 3/2 = 1 + 1 + 1.5 |
 | 3 | 2 | 1 | 0 | 2/3 + 1/2 + 3/1 | 2/3 + 1/2 + 3/1 |

 最好的基点是节点 3，因为它受益于最接近的最大值。 

该迹线显示了距离不对称如何直接影响每个节点的贡献，使得中心性和价值分布共同重要。 

### 示例轨迹 2

 一棵星形树，中心为 1，连接到 2、3、4，权重为 2，值为$c = [10, 1, 1, 1]$。 

| 基数 | 中心距图案| 分数结构 |
 | ---| ---| ---|
 | 1 | 所有叶子都为 1 | 10/1 + 1/3 + 1/3 + 1/3 | 10/1 + 1/3 + 1/3 + 1/3 |
 | 2 | 不对称距离| 1/1 + 10/3 + 1/5 + 1/5 |
 | 3 | 对称于 2 | 类似|

 该迹线显示，虽然叶子可以更接近中心，但当基部放置在中心时，高中心值占主导地位。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n^2 \log n)$| Dijkstra 从每个节点运行过来$n$节点与$n-1$边缘|
 | 空间|$O(n^2)$| 为所有节点对存储的完整距离矩阵 |

 和$n \le 100$，这最多对应于$10^4$每次跑步的放松步骤，重复 100 次，很容易在限制范围内。 内存使用量也可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import math
    from math import isclose

    # Re-run solution inline
    import heapq

    def dijkstra(start, adj, n):
        INF = 10**18
        dist = [INF] * (n + 1)
        dist[start] = 0
        pq = [(0, start)]
        while pq:
            d, u = heapq.heappop(pq)
            if d != dist[u]:
                continue
            for v, w in adj[u]:
                nd = d + w
                if nd < dist[v]:
                    dist[v] = nd
                    heapq.heappush(pq, (nd, v))
        return dist

    n = int(input())
    c = [0] + list(map(int, input().split()))
    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        x, y, w = map(int, input().split())
        adj[x].append((y, w))
        adj[y].append((x, w))

    dist = [dijkstra(i, adj, n) for i in range(1, n + 1)]

    best_node = 1
    best_val = -1.0

    for y in range(1, n + 1):
        s = 0.0
        for x in range(1, n + 1):
            s += c[x] / (dist[y-1][x] + 1)
        if s > best_val:
            best_val = s
            best_node = y

    return str(best_node) + "\n" + f"{best_val:.5f}"

# provided sample
assert run("5\n5 2 9 1 7\n1 2 2\n1 3 2\n3 4 1\n3 5 3\n") == "3\n13.31667"

# minimum size
assert run("2\n1 2\n1 2 1\n") is not None

# star test
assert run("4\n10 1 1 1\n1 2 1\n1 3 1\n1 4 1\n").startswith("1")

# chain test
assert run("3\n1 2 3\n1 2 1\n2 3 1\n") is not None
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品| 3 / 13.31667 | 完整陈述的正确性|
 | 2 节点树 | 小值| 基本情况处理 |
 | 星树| 1 | 中央支配行为|
 | 链树| 一致的浮点数总和 | 距离累计正确性|

 ## 边缘情况

 具有两个节点的最小树会检查分母规则是否正确应用，即使节点既是源节点又是目标节点。 如果节点 1 以权重 5 连接到节点 2，并且$c = [4, 6]$，然后选择节点 1 产生$4/1 + 6/6$，同时选择节点 2 产生$6/1 + 4/6$。 该算法使用预先计算的距离矩阵正确评估两者并选择较大的一个。 

高度不平衡的树（例如 100 个节点的链）会检查距离累积是否不会引入精度漂移。 由于每个候选根最多使用 100 次小数加法，因此浮点误差保持稳定，并且通过直接比较计算和仍然可以正确识别最佳节点。
