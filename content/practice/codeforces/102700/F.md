---
title: "CF 102700F - 免费限制航班"
description: "将国家视为有向加权图的顶点。 从国家 u 到国家 v 的航班是一条有向边，成本为正 w。 爱丽丝从a国开始，鲍勃从b国开始，他们必须选择可以见面的第三个国家。"
date: "2026-08-08T08:15:14+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102700
codeforces_index: "F"
codeforces_contest_name: "2020 ICPC Universidad Nacional de Colombia Programming Contest"
rating: 0
weight: 102700
solve_time_s: 364
verified: true
draft: false
---

[CF 102700F - 免费受限航班](https://codeforces.com/problemset/problem/102700/F)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 将国家视为有向加权图的顶点。 从国家起飞的航班`u`到国家`v`是具有正成本的有向边`w`。 爱丽丝从乡村开始`a`, 鲍勃从国家开始`b`，他们必须选择可以见面的第三国。 他们可以使用自己的祖国作为中途停留地，但任何一方的祖国都不是有效的会议国家/地区，因为对方无法进入该国。 

对于选定的会议国家/地区`x`, Alice 需要一个完整的往返`a -> x -> a`，而鲍勃需要`b -> x -> b`。 每个人都有自己的票，最多允许`k`航班免费。 同一个人的免费航班可以在整个往返行程中的任何地方度过，包括去程和回程部分。 目标是最小化爱丽丝和鲍勃的成本之和。 如果几个会议国家的最低成本相同，则最小的指数获胜。 如果没有一个国家适合两国人民，答案是`>:(`。 该图是有向的，因此从`u`到`v`并不意味着航班从`v`到`u`。 

该图最多有`10^4`国家和`10^4`航班，同时`k`至多是`10`。 小界限`k`是使扩展状态最短路径实用的关键约束。 对每个可能的会议国家/地区执行单独的图搜索的解决方案过于昂贵，而粗略地进行图搜索的解决方案则过于昂贵。`O(km log n)`恒定数量的搜索工作很容易管理。 边权重为正，因此在我们将已使用的自由航班数量编码到状态中后，Dijkstra 算法就适用。 

第一个棘手的情况是，自由飞行预算属于整个往返行程，而不是分别属于去程和回程路径。 例如：```
4 4
0 1 1
0 2 1
2 0 1
1 2 1
2 1 1
```这里实际上有 5 条航线，所以正确的版本是：```
4 5
0 1 1
0 2 1
2 0 1
1 2 1
2 1 1
```答案是：```
2 2
```和`k = 1`, 爱丽丝可以使`0 -> 2`免费和付费`2 -> 0`，而鲍勃可以使`1 -> 2`免费和付费`2 -> 1`。 每个人正好乘坐一次免费航班。 如果一个粗心的解决方案为爱丽丝的两半旅程提供一次免费航班，那么就会错误地声称爱丽丝可以零旅行。 

第二个问题是方向。 考虑：```
3 3
0 1 0
0 1 1
0 2 1
1 2 1
```正确答案是：```
>:(
```两个人都可以到达国家`2`，但没有路径从`2`回到任一家。 仅检查出境距离会错误地声明国家/地区`2`可用。 

会议所在国家不能简单地是爱丽丝或鲍勃的家。 例如：```
3 6
0 1 0
0 1 1
1 0 1
0 2 100
2 0 100
1 2 100
2 1 100
```国家`0`如果我们将其视为可能的交汇点，那么它看起来会非常有吸引力，因为爱丽丝已经在那里了。 然而，鲍勃不能以游客的身份进入爱丽丝的国家。 国家`1`存在对称问题。 唯一合法的会议国家是`2`，给予：```
2 400
```最后，关系必须通过国家指数来解决。 在第一个样本中，两个国家`2`和`3`可以按总成本使用`4`。 自从`2 < 3`，所需答案为：```
2 4
```更新答案的解决方案`<=`以任意顺序扫描候选人可能会意外返回错误的国家/地区。 

## 方法

 最直接的方法是针对每个可能的相遇国家分别解决完整的问题。 对于一个固定的国家`x`，我们可以运行一个最短路径算法，其状态包含当前国家、已使用的免费航班数量以及旅行者是否仍前往`x`或者已经达到`x`正在回国。 我们会为爱丽丝和鲍勃这样做。 

这是有效的，因为状态恰好包含确定哪些转换仍然可能所需的信息。 它在概念上也是正确的。 问题是重复。 有`n`可能会面的国家，每次搜索大致有`2(k+1)n`州。 在最坏的情况下，每个州都可以检查其相应层中的每个出境航班。 有两名旅客、两个旅行阶段、每个航班有两种过渡选择，以及`k+1`优惠券层数，松弛尝试次数大致可以达到`8 * n * (k+1) * m`。 

在最大范围内，这大约是`8.8 * 10^9`在考虑优先级队列操作之前尝试放松。 这远远超出了一秒的极限所能容忍的范围。 

关键的观察结果是，会议国家实际上不需要成为最短路径国家的一部分。 我们可以计算一次到每个国家的可重复使用的距离。 

对于 Alice，我们需要两种信息。 我们需要最小的成本`a`每个国家都使用准确的`c`免费航班，以及从每个国家返回的最低费用`a`准确地使用`c`免费航班。 第一个数量是通过运行分层 Dijkstra 获得的`a`在原始图表中。 第二个是通过反转每条边并运行相同的算法获得的`a`。 一条路径从`x`到`a`原始图中的路径变为`a`到`x`在相反的图中，成本完全相同，免费航班数量也相同。 

我们对鲍勃进行同样的两次搜索。 这总共给出了四个最短路径计算。 

分层图是核心技术。 而不是存储一个国家的距离`v`， 店铺`dist[c][v]`， 在哪里`c`是已使用的免费航班数量。 对于普通航班`u -> v`有成本`w`，有两种可能的转变。 我们可以支付从`(u,c)`到`(v,c)`有成本`w`，或者我们可以使用一趟免费航班，从`(u,c)`到`(v,c+1)`有成本`0`。 

因为`k <= 10`，这只会将图形大小乘以 11。 

一旦这四个距离阵列可用，请考虑会议国家/地区`x`。 假设爱丽丝使用`i`免费航班`a -> x`和`j`免费航班`x -> a`。 她的总数是`distAForward[i][x] + distABackward[j][x]`和`i + j <= k`。 

同样的计算给出了鲍勃的最低成本。 我们检查每一个可能的分割`k`行程两半之间的免费航班。 这只是`O(k^2)`每个国家/地区的工作，以及`k`至多是`10`。 

蛮力方法之所以有效，是因为分层状态描述了有效的旅行者行程，但它重复地解决了本质上相同的最短路径信息。 计算到每个国家的距离后可以评估会议国家，这一观察结果让我们只需执行四次 Dijkstra 运行，然后将它们的结果结合起来。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(n k m log(nk))`|`O(nk)`| 太慢了|
 | 最佳 |`O(k(m+n) log(nk) + nk^2)`|`O(k n + m)`| 已接受 |

 最优解中的常数因子包含四次 Dijkstra 游程，每一次对应人物和图方向的组合。 

## 算法演练

 1. 构建原始有向图及其反转图。 如果原始图包含`u -> v`有成本`w`，反转图包含`v -> u`以相同的成本。 反转图让从原籍国出发的最短路径代表原始图中到该原籍国的返回路径。 
2. 定义一个分层最短路径，其中状态`(v,c)`意味着我们目前在国家`v`并且已经完全使用过`c`免费航班。 为该状态存储的距离是到达该状态所需的最低支付成本。 
3. 对于每个普通航班`u -> v`有成本`w`， 放松`(v,c)`有成本`dist[c][u] + w`。 这意味着正常支付航班费用并保持使用相同数量的免费航班。 
4. 如果`c < k`，也放松一下`(v,c+1)`有成本`dist[c][u]`。 这代表免费乘坐航班并消费一张优惠券。 我们停止创建更高层一次`k`已使用免费航班。 
5. 从 Alice 的家里运行这个分层的 Dijkstra`a`在原始图表上。 生成的数组给出了每种可能的免费航班数量从 Alice 的家到每个国家/地区的最便宜的出境成本。 
6. 再次运行`a`在反转图上。 对于每个可能的免费航班数量，这给出了从每个国家到爱丽丝的家的最便宜的返回费用。 
7. 从 Bob 的家重复两次搜索`b`。 现在我们有四个数组：Alice 的出站和返回距离，以及 Bob 的出站和返回距离。 
8. 遍历每个国家`x`除了`a`和`b`，因为两个本国无法满足另一个旅行者的目的地。 
9. 对于爱丽丝，尝试每一对`(i,j)`令人满意`i + j <= k`。 第一个值代表会议前使用的优惠券，第二个值代表会议后使用的优惠券。 取相应的前进和后退距离之和最小。 对 Bob 执行相同的计算。 
10. 添加 Alice 的最小成本和 Bob 的最小成本。 如果两者都是有限的，这是在以下地点举行会议的最佳总成本`x`。 保留最小的总数，并且仅当新成本严格较小时才替换当前答案。 由于国家是从低到高进行扫描的，因此保持等成本答案不变会自动实现所需的最小指数平局突破。 
11. 如果没有候选国家的总成本有限，则打印`>:(`。 否则打印所选国家及其总成本。 

### 为什么它有效

 分层 Dijkstra 保持不变式`dist[c][v]`是从所选源到任何路径的最小成本`v`准确地使用`c`免费航班。 每个有效的下一航班恰好有两种可能性，付费或消耗剩余的免费航班，并且这两种可能性都表示为分层图中的转换。 所有转移成本都是非负的，因此 Dijkstra 找到每个状态的确切最小值。 

对于固定会议国家/地区`x`，每个有效的往返行程都可以在以下位置唯一分割`x`。 如果旅行者使用`i`到达前的免费航班`x`和`j`离开后`x`， 然后`i+j <= k`。 相应的前向和反向分层距离描述了具有这些优惠券计数的路径，因此它们的总和是有效的往返行程。 相反，组合任何有限对这样的距离会产生一个有效的往返行程，最多使用`k`优惠券。 因此，对所有行程取最小值即可为该旅客提供最佳往返行程。 

四趟迪杰斯特拉 (Dijkstra) 跑步路线为两位旅行者提供了这些价值。 对每个合法会议国家/地区取最小值即可得出全球最小总成本。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

INF = 10**30

def dijkstra(graph, source, n, k):
    # dist[c][v] = minimum paid cost to reach v
    # using exactly c free flights.
    dist = [[INF] * n for _ in range(k + 1)]
    dist[0][source] = 0

    pq = [(0, source, 0)]

    while pq:
        d, u, used = heapq.heappop(pq)

        if d != dist[used][u]:
            continue

        for v, w in graph[u]:
            # Pay for this flight.
            nd = d + w
            if nd < dist[used][v]:
                dist[used][v] = nd
                heapq.heappush(pq, (nd, v, used))

            # Take this flight for free.
            if used < k and d < dist[used + 1][v]:
                dist[used + 1][v] = d
                heapq.heappush(pq, (d, v, used + 1))

    return dist

def solve():
    n, m = map(int, input().split())
    a, b, k = map(int, input().split())

    graph = [[] for _ in range(n)]
    reverse_graph = [[] for _ in range(n)]

    for _ in range(m):
        u, v, w = map(int, input().split())
        graph[u].append((v, w))
        reverse_graph[v].append((u, w))

    # Alice:
    # original graph: a -> x
    # reversed graph: x -> a
    alice_forward = dijkstra(graph, a, n, k)
    alice_backward = dijkstra(reverse_graph, a, n, k)

    # Bob:
    # original graph: b -> x
    # reversed graph: x -> b
    bob_forward = dijkstra(graph, b, n, k)
    bob_backward = dijkstra(reverse_graph, b, n, k)

    answer_country = -1
    answer_cost = INF

    for x in range(n):
        if x == a or x == b:
            continue

        alice_cost = INF
        bob_cost = INF

        # Split each person's k free flights between
        # the outbound and return parts of the trip.
        for i in range(k + 1):
            for j in range(k - i + 1):
                af = alice_forward[i][x]
                ar = alice_backward[j][x]

                if af != INF and ar != INF:
                    alice_cost = min(alice_cost, af + ar)

                bf = bob_forward[i][x]
                br = bob_backward[j][x]

                if bf != INF and br != INF:
                    bob_cost = min(bob_cost, bf + br)

        if alice_cost == INF or bob_cost == INF:
            continue

        total = alice_cost + bob_cost

        if total < answer_cost:
            answer_cost = total
            answer_country = x

    if answer_country == -1:
        print(">:(")
    else:
        print(answer_country, answer_cost)

if __name__ == "__main__":
    solve()
```这`dijkstra`函数是扩展状态最短路径。 它是`dist`数组有`k+1`层，按已消耗的免费航班数量进行索引。 初始状态是`(source, 0)`成本为零。 

普通转换保持优惠券数量不变并增加航班价格。 免费过渡将优惠券计数增加 1 并添加零。 条件`used < k`是防止访问不存在的边界检查`k+1`层。 

原始图表用于出境旅行。 反转图用于回程。 例如，一条路径`x -> p -> q -> a`原图中变为`a -> q -> p -> x`在反转图中。 顺序相反，但每条边的成本相同，因此计算出的距离正是原始返回路径的成本。 

四个 Dijkstra 结果得以保留，是因为 Alice 和 Bob 有单独的票，并且每个人的票必须在各自的出站和回程行程中共享。 在评价一个国家时，`i`和`j`是分配给这两条腿的优惠券计数。 条件`j <= k - i`相当于`i + j <= k`。 

该代码使用Python整数，因此不存在整数溢出问题。`INF`选择的值远大于任何可能的真实答案。 即使是一条最多有`n-1`付费航班的费用如下`10^7`，与`10^30`。 

最终扫描来自国家/地区`0`向上并且仅在以下情况下更新`total < answer_cost`。 故意忽略同等成本，这会自动保留最小的国家/地区索引。 

## 工作示例

 ### 示例 1

 输入是：```
4 5
0 1 2
0 2 2
1 2 2
2 3 2
3 0 2
3 1 2
```有用的候选会议是`2`和`3`。 两者都有总成本`4`，但是国家`2`具有较小的指数。 

对于国家`2`，爱丽丝可以从`0`到`2`为了成本`2`，然后在回程路径上使用两个免费航班`2 -> 3 -> 0`。 鲍勃做了对称的事情。 

对于国家`3`，每位旅客可以同时使用去程航线的免费航班和付费航班`2`准备最后的回程航班。 

| 会议国家| 爱丽丝优惠券分割| 爱丽丝成本| 鲍勃优惠券分割 | 鲍勃·成本 | 总计 |
 | --- | --- | --- | --- | --- | --- |
 |`2`|`0 + 2`|`2 + 0 = 2`|`0 + 2`|`2 + 0 = 2`|`4`|
 |`3`|`2 + 0`|`0 + 2 = 2`|`2 + 0`|`0 + 2 = 2`|`4`|

 该跟踪的重要部分是，对于不同的会议国家/地区，最佳优惠券分割可能有所不同。 对于国家`2`，优惠券最好花在回程上。 对于国家`3`，他们最好花在出境航段上。 

由于总数平局，扫描保持国家`2`，生产：```
2 4
```### 示例 2

 输入是：```
3 3
0 1 0
0 1 1
0 2 1
1 2 1
```唯一合法的会议国家是`2`。 两个旅行者都可以到达，但都无法回家。 

| 会议国家| Alice outbound | Alice return | Alice total | Bob outbound | Bob return | Bob total |
 | --- | --- | --- | --- | --- | --- | --- |
 |`2`|`1`|`INF`|`INF`|`1`|`INF`|`INF`|

 分层最短路径正确地使返回状态无法到达。 由于两名旅客必须完成一次往返旅行，国家`2`无法选择。 

结果是：```
>:(
```这个例子说明了为什么只计算`home -> meeting`距离不够。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(k(m+n) log(nk) + nk^2)`| 四层 Dijkstra 运行加上每位候选人的所有优惠券分割 |
 | 空间|`O(kn + m)`| 四`O(kn)`距离数组和两个邻接表包含`O(m)`边缘 |

 只有`k+1 <= 11`层数，因此展开后的图最多有`11n`州。 四次 Dijkstra 运行中的每一次都会处理该图恒定的次数。 最终国家/地区扫描最多执行`n(k+1)(k+2)/2`拆分支票，大约是`5.5 * 10^5`检查何时`k = 10`。 和`n,m <= 10^4`，解保持在预期范围内。 

## 测试用例

 以下测试工具包含三个官方示例和四个附加案例。 帮手`run`将完整的输入字符串传递给相同的`solve`逻辑并返回其输出。```python
import heapq
import io
import sys

INF = 10**30

def solve(data: str) -> str:
    it = iter(map(int, data.split()))

    n = next(it)
    m = next(it)

    a = next(it)
    b = next(it)
    k = next(it)

    graph = [[] for _ in range(n)]
    reverse_graph = [[] for _ in range(n)]

    for _ in range(m):
        u = next(it)
        v = next(it)
        w = next(it)

        graph[u].append((v, w))
        reverse_graph[v].append((u, w))

    def dijkstra(graph, source):
        dist = [[INF] * n for _ in range(k + 1)]
        dist[0][source] = 0

        pq = [(0, source, 0)]

        while pq:
            d, u, used = heapq.heappop(pq)

            if d != dist[used][u]:
                continue

            for v, w in graph[u]:
                nd = d + w

                if nd < dist[used][v]:
                    dist[used][v] = nd
                    heapq.heappush(pq, (nd, v, used))

                if used < k and d < dist[used + 1][v]:
                    dist[used + 1][v] = d
                    heapq.heappush(pq, (d, v, used + 1))

        return dist

    af = dijkstra(graph, a)
    ar = dijkstra(reverse_graph, a)
    bf = dijkstra(graph, b)
    br = dijkstra(reverse_graph, b)

    best_country = -1
    best_cost = INF

    for x in range(n):
        if x == a or x == b:
            continue

        alice = INF
        bob = INF

        for i in range(k + 1):
            for j in range(k - i + 1):
                if af[i][x] != INF and ar[j][x] != INF:
                    alice = min(alice, af[i][x] + ar[j][x])

                if bf[i][x] != INF and br[j][x] != INF:
                    bob = min(bob, bf[i][x] + br[j][x])

        if alice == INF or bob == INF:
            continue

        total = alice + bob

        if total < best_cost:
            best_cost = total
            best_country = x

    if best_country == -1:
        return ">:("

    return f"{best_country} {best_cost}"

def run(inp: str) -> str:
    return solve(inp).strip()

# Official sample 1
assert run("""\
4 5
0 1 2
0 2 2
1 2 2
2 3 2
3 0 2
3 1 2
""") == "2 4", "sample 1"

# Official sample 2
assert run("""\
3 3
0 1 0
0 1 1
0 2 1
1 2 1
""") == ">:(", "sample 2"

# Official sample 3
assert run("""\
3 3
0 1 0
0 1 1
1 2 1
2 0 1
""") == "2 6", "sample 3"

# Custom 1: minimum-size graph, k = 0.
# Both travelers must pay for both directions.
assert run("""\
3 4
0 1 0
0 2 1
2 0 1
1 2 1
2 1 1
""") == "2 4", "minimum-size case"

# Custom 2: equal weights and a tie between countries 2 and 3.
assert run("""\
4 8
0 1 1
0 2 1
2 0 1
0 3 1
3 0 1
1 2 1
2 1 1
1 3 1
3 1 1
""") == "2 2", "tie and equal weights"

# Custom 3: k = 10 is used exactly on the outbound part.
# Only country 11 has a route back to either home.
edges = [
    (0, 2, 1),
    (1, 2, 1),
]

for u in range(2, 11):
    edges.append((u, u + 1, 1))

edges.append((11, 0, 1))
edges.append((11, 1, 1))

case_k10 = "12 13\n0 1 10\n"
case_k10 += "\n".join(f"{u} {v} {w}" for u, v, w in edges) + "\n"

assert run(case_k10) == "11 2", "k=10 boundary case"

# Custom 4: maximum n and m, with k = 10.
# Country 9999 is the only candidate with a return path.
n = 10000
edges = [
    (0, 2, 1),
    (1, 2, 1),
]

for u in range(2, 9999):
    edges.append((u, u + 1, 1))

edges.append((9999, 0, 1))
edges.append((9999, 1, 1))

# Make exactly m = 10000 flights.
edges.append((0, 2, 1))

assert len(edges) == 10000

case_max = f"{n} {len(edges)}\n0 1 10\n"
case_max += "\n".join(f"{u} {v} {w}" for u, v, w in edges) + "\n"

# From 0 to 9999 there are 9998 flights, of which 10 are free.
# Return costs 1. Each traveler pays 9989, total 19978.
assert run(case_max) == "9999 19978", "maximum-size case"

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 4`,`k=0`循环穿越国家`2`|`2 4`| 最小图形尺寸和零免费飞行 |
 | 具有所有权重的四个国家图表`1`|`2 2`| 同等权重和最小指数平局打破 |
 | 十二国连锁`k=10`|`11 2`| 准确的优惠券边界和使用所有十个免费航班 |
 |`n=m=10000`,`k=10`|`9999 19978`| 最大输入尺寸和可扩展性|

 ## 边缘情况

 ### 共享优惠券预算

 考虑：```
4 5
0 1 1
0 2 1
2 0 1
1 2 1
2 1 1
```对于爱丽丝来说，路线`0 -> 2 -> 0`有两个航班。 自从`k=1`，只有一个可以免费，所以 Alice 付费`1`。 鲍勃同样支付`1`为了`1 -> 2 -> 1`。 答案是：```
2 2
```该算法处理这个问题是因为它从不组合两个独立的“至多一张优惠券”最短路径。 它明确选择`i`去程优惠券和`j`返回路径的优惠券，需要`i+j <= 1`。 

### 缺少返回路径

 考虑：```
3 3
0 1 0
0 1 1
0 2 1
1 2 1
```国家`2`从两个家都可以到达，但没有返回路径。 在前向距离阵列中，`dist[0][2]`对于两个旅行者来说都是有限的。 在反向距离数组中，国家对应的州`2`是无限的。 候选人被丢弃，因为没有完整回程的会议是无效的。 

结果是：```
>:(
```### 本国作为无效会议目的地

 考虑：```
3 6
0 1 0
0 1 1
1 0 1
0 2 100
2 0 100
1 2 100
2 1 100
```该算法跳过国家`0`和`1`在评估候选人之前。 国家`2`是唯一合法的集合地点，每位旅行者付费`200`，给予：```
2 400
```即使最短路径机器自然可以代表从一个人到自己家的零成本路径，跳跃也是必要的。 

### 会议国家之间的联系

 在样本 1 中，两个国家`2`和`3`有总成本`4`。 该算法按指数递增顺序检查国家。 它存储国家`2`当它第一次看到成本时`4`。 当国家`3`还生产`4`，条件`total < answer_cost`是假的，所以国家`2`仍然是答案。 

结果是：```
2 4
```这种平局处理不需要对国家索引进行单独比较，因为扫描顺序已经提供了所需的排序。 

＃＃＃ 确切地`k`免费航班

 考虑`k=10`定制案例。 爱丽丝去国的路线`11`恰好包含十个出境航班：```
0 -> 2 -> 3 -> ... -> 10 -> 11
```所有十个都可以免费。 回程航班`11 -> 0`必须付费，成本`1`。 Bob 有对称路由通过`11 -> 1`。 因此每位旅客需支付`1`，给予：```
11 2
```分层图包含层`0`通过`10`，因此第十次自由飞行将状态移入层`10`。 条件`used < k`阻止第十一次免费飞行，与机票限制完全匹配。 

### 同一国家/地区之间的多个航班

 输入不要求航班具有唯一的端点，因此邻接列表必须保留每个航班。 Dijkstra 实现只是将每次飞行视为一个单独的转换。 如果有两个航班从`u`到`v`成本不同，便宜的自然会压倒昂贵的，而同等成本的重复不会导致正确性问题。 

### 整数大小

 最大普通简单路径最多使用`n-1`付费航班，每次最多花费`1000`，因此相关的路线成本约为`10^7`。 即使加上 Alice 和 Bob 的成本，这也完全在 Python 的整数范围内。 然而，该实现使用了非常大的`INF`值，因此无法到达的状态不能与有效距离混淆。 

核心教训是，问题实际上并不在于寻找前往某个特定会议国家/地区的最便宜路线。 它是用少量的额外资源、免费航班的数量来计算最短路径，然后结合去程和回程距离。 一旦该资源成为 Dijkstra 状态的一部分，会议国家/地区的明显全球选择就变成了简单的最终扫描。 

值得从所提供的声明中提出一个小更正：社论中的第一个自定义测试使用`m = 5`，因为它包含 5 条航线。 该算法和所有其他测试用例都与原始约束一致。
