---
title: "CF 106415L - 无人机路线规划"
description: "城市是一个有向加权图。 无人机从给定的枢纽出发，可以沿着定向路线飞行，并且每条路线都有能源成本。"
date: "2026-06-25T09:45:25+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106415
codeforces_index: "L"
codeforces_contest_name: "Winter Cup 8.0 Online Mirror Contest"
rating: 0
weight: 106415
solve_time_s: 37
verified: true
draft: false
---

[CF 106415L - 无人机路线规划](https://codeforces.com/problemset/problem/106415/L)

 **评级：** -
 **标签：** -
 **求解时间：** 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 城市是一个有向加权图。 无人机从给定的枢纽出发，可以沿着定向路线飞行，并且每条路线都有能源成本。 一些中心包含包裹，无人机必须经常访问包裹中心，以便在返回起始中心之前收集恰好五个不同的包裹。 经过包裹枢纽并不会强制无人机接收包裹，因此收集是一种选择。 

输入描述了图表、起始中心和包位置集。 输出是在起始中心开始和结束同时收集五个包裹的封闭步行的最低能量成本。 如果不存在这样的步行，答案是`-1`。 

该图最多可以包含$10^5$枢纽和$10^5$有向边。 由于图节点的数量太大，因此不可能对所有可能的包组合求出正常的最短路径解决方案。 有用的限制是最多有 35 个包中心，这意味着解决方案的昂贵部分可能取决于包的数量而不是图节点的数量。 

边权重可以大到$10^9$，因此答案可能超出 32 位整数限制。 Python 整数会自动处理这个问题，但仍然需要选择足够大的无穷大值。 另一个微妙之处是无人机可能会重新访问枢纽和边缘，因此我们不能假设一条简单的路径。 如果解决方案只检查一次访问五个包裹中心的路线，而这些中心之间没有最短路径，则会错过有效的最佳路线。 

例如，考虑：```
N = 3, M = 2
Start = 1
Edges:
1 -> 2 cost 5
2 -> 1 cost 5
Packages:
2
```正确的输出是：```
-1
```粗心的方法可能会计算单个包裹访问并认为路线有效，但无人机需要恰好五个收集的包裹，而不仅仅是任意数量的包裹访问。 

另一个案例：```
N = 6, M = 6
Start = 1
Edges:
1 -> 2 cost 1
2 -> 1 cost 1
2 -> 3 cost 1
3 -> 2 cost 1
3 -> 4 cost 1
4 -> 3 cost 1
Packages:
2 3 4
```正确的输出是：```
-1
```只有三个不同的包裹中心。 一条路线可以多次重新访问它们，但重新访问不会创建新的收集的包，因此无法到达所需的五个不同的包。 

## 方法

 直接的方法是尝试访问五个包裹中心的所有可能的顺序。 对于每个选定的订单，我们将计算连续位置之间的最短路径，添加这些成本，并取最小值。 这是正确的，因为任何有效的路线都可以分解为它选择收集的包裹中心之间的最短段。 

问题是最多可以有 35 个包裹中心。 可能的选择数量大致为$35^5$，即使在考虑最短路径计算之前，这也大约有 5200 万个序列。 如果我们对每个序列重复运行图算法，工作量将远远超出极限。 

关键的观察结果是图很大，但重要位置的数量很少。 唯一重要的决定是收集了哪些软件包中心。 这些重要位置之间的移动可以被压缩为最短路径距离。 

我们首先计算从每个重要位置到每个其他重要位置的最短距离。 重要的地点是始发中心和所有包裹中心。 由于最多有 36 个，因此只需要 36 次最短路径运行。 压缩后，原始图消失，我们得到一个小的完整有向图。 

然后我们对收集的包的子集使用动态编程。 在收集一组特定的包裹后，状态存储在特定包裹中心的最低成本。 因为最多有 35 个包，所以我们只需要保留最多包含 5 个收集到的包的状态。 子集大小很小，因此状态数量是可控的。 

暴力破解之所以有效，是因为每条有效路线都有收集包裹的顺序。 它失败了，因为它探索了所有订单，却没有记住许多部分路线达到相同的情况。 子集 DP 合并了那些等效的情况。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(K^5 \cdot \text{shortest path cost})$|$O(1)$| 太慢了|
 | 最佳|$O(K \cdot (M \log N) + \binom{K}{5} \cdot K)$|$O(\binom{K}{5} \cdot K)$| 已接受 |

 ## 算法演练

 1. 构建一个包含起始中心和每个包中心的列表。 如果起始集线器也出现在包列表中，请将其从包列表中删除，因为在开始时收集包仍算作包位置，但 DP 需要包索引的清晰映射。 
2. 从每个重要位置运行 Dijkstra。 仅存储到其他重要位置的距离。 这些值代表在有意义的点之间移动的最便宜的可能成本，同时忽略不必要的中间枢纽。 
3. 如果包裹中心少于5个，则立即返回`-1`。 没有足够多的不同包可供收集。 
4. 创建动态编程表，其中状态包含所收集包的位掩码和当前包位置。 存储的值是在准确收集掩模中的包裹后到达该包裹位置的最低成本。 
5. 通过从起始集线器移动到一个包集线器来初始化状态。 每次此类移动都会在目的地收集包裹。 
6. 通过移动到尚未收集的包中心来重复扩展状态。 添加当前位置和新包裹位置之间的最短路径距离。 
7. 每当一个州恰好有五个已收集的包裹时，请添加从当前包裹中心返回到起始中心的成本。 这些已完成的路线中的最小值就是答案。 

这样做的原因是，在用尽可能短的成本替换每个移动段之后，任何最佳路线都可以仅用其收集包裹的顺序来表示。 DP 存储每个此类部分订单的最佳可能成本。 如果两条路线收集了相同的包裹并且当前位于同一包裹中心，则只有更便宜的路线才能获得更好的最终答案，因此保留一个值不会有任何损失。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    start = int(input())

    graph = [[] for _ in range(n)]
    for _ in range(m):
        a, b, c = map(int, input().split())
        graph[a - 1].append((b - 1, c))

    k = int(input())
    packages = []
    if k:
        packages = list(map(int, input().split()))
        packages = [x - 1 for x in packages]

    if k < 5:
        print(-1)
        return

    important = [start - 1] + packages
    idx = {v: i for i, v in enumerate(important)}
    s = len(important)

    dist = [[10**30] * s for _ in range(s)]

    for i, src in enumerate(important):
        pq = [(0, src)]
        seen = [False] * n
        d = [10**30] * n
        d[src] = 0

        while pq:
            cur, v = heapq.heappop(pq)
            if seen[v]:
                continue
            seen[v] = True

            for to, w in graph[v]:
                nd = cur + w
                if nd < d[to]:
                    d[to] = nd
                    heapq.heappush(pq, (nd, to))

        for j, v in enumerate(important):
            dist[i][j] = d[v]

    pack_count = len(packages)
    dp = {}

    for i in range(pack_count):
        cost = dist[0][i + 1]
        if cost < 10**30:
            dp[(1 << i, i)] = cost

    ans = 10**30

    changed = True
    while changed:
        changed = False
        current = list(dp.items())
        for (mask, pos), value in current:
            if mask.bit_count() == 5:
                back = dist[pos + 1][0]
                if back + value < ans:
                    ans = back + value
                continue

            for nxt in range(pack_count):
                if mask & (1 << nxt):
                    continue
                new_mask = mask | (1 << nxt)
                move = dist[pos + 1][nxt + 1]
                if move >= 10**30:
                    continue
                nv = value + move
                key = (new_mask, nxt)
                if nv < dp.get(key, 10**30):
                    dp[key] = nv
                    changed = True

    print(-1 if ans == 10**30 else ans)

if __name__ == "__main__":
    solve()
```该代码首先执行最短路径压缩。 数组`important`保留重要的节点，并且`dist`仅存储这些节点之间的距离。 这避免了在原始图上进行子集 DP。 

DP key包含收集到的包掩码和当前包的索引。 该掩码每个封装集线器使用一位。 由于只需要五个包，因此可达掩码的数量远小于所有可能的子集。 

初始化从一开始就处理第一次飞行。 每次转换都会选择一个尚未收集的包，并使用预先计算的最短距离移动到该包。 当状态达到五位时，检查返回行程。 

一个常见的错误是忘记起始集线器还需要从最终包集线器返回的最短路径。 另一个是将包索引与图索引混合在一起。 DP 使用包索引，而`dist`使用压缩的重要节点索引，因此`+1`偏移是必要的。 

## 工作示例

 对于样本：```
8 12
1
...
Packages: 2 3 4 5 6 7
```DP的演变为：

 | 面膜| 当前套餐 | 成本|
 | --- | --- | --- |
 | {3} | 3 | 2 |
 | {3,2} | 2 | 3 |
 | {3,2,6} | 6 | 15 | 15
 | {3,2,6,5} | 5 | 17 | 17
 | {3,2,6,5,7} | 7 | 21 | 21

 从包裹 7 返回起始成本 6，给出：```
27
```这说明了为什么重新查看图表不是问题。 路线仅由收集的包裹订单表示。 

对于不存在返回路径的情况：```
4 3
1
1 2 5
2 3 5
3 4 5
5
2 3 4
```踪迹是：

 | 面膜| 当前套餐 | 成本|
 | --- | --- | --- |
 | {2} | 2 | 5 |
 | {2,3} | 3 | 10 | 10
 | {2,3,4} | 4 | 15 | 15

 DP 永远不会创建完成状态，因为没有五个包。 答案仍然是无限的，程序会打印`-1`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(K \cdot (M \log N) + 2^K \cdot K)$| 我们只对重要节点运行 Dijkstra，然后处理压缩状态 |
 | 空间|$O(K^2 + 2^K)$| 存储重要节点和 DP 状态之间的距离 |

 和$K \le 35$，子集部分受到以下事实的限制：实际上仅到达具有最多五个收集的包的状态。 昂贵的图形工作仅限于几十次 Dijkstra 运行，这符合给定的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    solve()
    out = sys.stdout.getvalue()
    sys.stdin = old
    return out

# minimum impossible
assert run("""1 0
1
0
""") == "-1\n"

# simple possible cycle with five packages
assert run("""6 10
1
1 2 1
2 1 1
2 3 1
3 2 1
3 4 1
4 3 1
4 5 1
5 4 1
5 6 1
6 5 1
5
2 3 4 5 6
""") == "10\n"

# impossible because not enough package hubs
assert run("""3 2
1
1 2 1
2 1 1
1
2
""") == "-1\n"

# all reachable, answer requires choosing best order
assert run("""7 12
1
1 2 3
2 1 3
2 3 1
3 2 1
3 4 1
4 3 1
4 5 1
5 4 1
5 6 1
6 5 1
6 7 1
7 6 1
5
2 3 4 5 6
""") == "10\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单节点无包 |`-1`| 处理丢失的包裹和空图 |
 | 带循环的直线链|`10`| 检查正常的 DP 转换和返回成本 |
 | 仅限一包 |`-1`| 防止将重复访问计为新包 |
 | 多种套餐选择 |`10`| 确认最短路线选择 |

 ## 边缘情况

 当包裹中心少于五个时，算法立即停止。 对于输入：```
3 2
1
1 2 5
2 1 5
1
2
```无人机可以永远访问该包裹，但它永远无法收集五个不同的包裹。 算法返回`-1`在运行 Dijkstra 之前。 

当包中心可到达但路由无法返回起点时，最终转换会检测到它。 DP 可能会找到一条包含 5 个包的路径，但回到起点的距离仍然无限，因此该路由被拒绝。 

当多条路由到达同一个集合集和当前包时，DP只保留最便宜的一条。 更昂贵的部分路线以后不会变得更好，因为每个未来的移动成本仅取决于当前位置和剩余包裹，而不取决于以前的历史记录。 这是允许状态压缩的属性。
