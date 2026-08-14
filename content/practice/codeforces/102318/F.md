---
title: "CF 102318F - 多式联运"
description: "我们拥有覆盖多达 400 个城市的交通网络。 每个城市都有相关的转换成本。 包裹可以使用四种运输方式之一在城市之间运输：空运、海运、铁路或卡车。 每个路由段都是无向的，并且只属于一种传输模式。"
date: "2026-08-14T04:42:47+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102318
codeforces_index: "F"
codeforces_contest_name: "UCF Locals 2017"
rating: 0
weight: 102318
solve_time_s: 60
verified: true
draft: false
---

[CF 102318F - 多式联运](https://codeforces.com/problemset/problem/102318/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们拥有覆盖多达 400 个城市的交通网络。 每个城市都有相关的转换成本。 包裹可以使用四种运输方式之一在城市之间运输：`AIR`,`SEA`,`RAIL`， 或者`TRUCK`。 

每个路由段都是无向的，并且只属于一种传输模式。 其成本是使用该模式时沿着该段移动包裹的价格。 在中间城市，套餐可以继续免费使用同一种模式，也可以切换到另一种模式并支付该城市的切换费用。 出发城市可以采用任意方式，目的地也可以采用任意方式到达。 任务是找到从给定起点到目的地的最小可能总成本。 输入包含多个独立的测试用例，每个测试用例都要求一个最低成本。 

关键的困难在于，从一个城市搬到另一个城市的成本不仅仅由两个城市决定。 它还取决于当前使用的运输模式。 到达城市`A`乘飞机到达城市`A`乘坐铁路是不同的州，因为他们未来的选择可能会有不同的转换成本。 

城市最多有 400 个，因此明确表示四种交通方式后，该图最多有`4 * 400 = 1600`州。 可以有多达 40000 个路由段，加上每个城市仅有 6 个可能的交换连接。 这给出了一个最多有大约 42400 个无向边的稀疏图。 扩展图上的二次算法每次经过大约 256 万次状态比较，而全对三次算法则大约需要`1600^3 = 4.096 * 10^9`迭代，这远远超出了四秒的限制。 该图还使用严格的正成本进行加权，因此 Dijkstra 算法是自然的选择。 

第一种边缘情况是直接路线，其中改变模式比保持一种模式更昂贵。 例如，```
1
2
A 100
B 100
1
A B AIR 7
A B
```答案是`7`。 假设每次行程都必须在两个端点支付转换成本的粗心实现可能会错误地添加`100`或者`200`。 出发地不需要模式切换，到达目的地也不需要模式切换。 

第二种边缘情况是需要在中间城市进行切换才能获得最便宜的路线。```
1
3
A 5
B 2
C 5
2
A B AIR 4
B C RAIL 3
A C
```答案是`9`，因为包裹旅行`A -> B`空运，付费`2`在`B`改乘铁路，然后旅行`B -> C`乘铁路。 仅保留每个城市一个最短距离的实现会丢失包裹到达的信息`B`通过空运，可能会错误地忽略转换成本或在错误的时间应用转换成本。 

第三种边缘情况是多种模式可以连接同一对城市。 例如，```
1
2
A 10
B 10
2
A B AIR 100
A B TRUCK 3
A B
```答案是`3`。 如果粗心的图形表示只存储两个城市名称之间的一条边而不包括交通方式，则可能会覆盖更便宜或更相关的状态。 

第四种边缘情况是最便宜的路径可能以一种模式开始并以另一种模式结束。 例如，```
1
2
A 50
B 50
2
A B AIR 10
A B TRUCK 3
A B
```答案是`3`，因为包裹可以简单地在始发地选择卡车。 更一般地，目的地必须在所有四种模式状态下被认为是成功的，而不仅仅是在某些最初选择的模式的最终路线段所使用的模式中。 

## 方法

 一种直接的强力最短路径公式是将每个城市扩展到四个州，每个州对应一种交通方式，然后在所有扩展的州上运行密集的最短路径算法，例如 Floyd-Warshall。 国家`(city, mode)`表示包裹目前在该城市，目前的运输方式是`mode`。 路线段成为具有相同模式的州之间的边，而在同一城市从一种模式改变到另一种模式则成为边，其权重为该城市的转换成本。 由于每个合法旅程都对应于该展开图中的一条路径，因此全对最短路径算法是正确的。 

问题是立方运行时间。 有 400 个城市，有 1600 个扩展的州，因此 Floyd-Warshall 的表现约为`1600^3 = 4.096 * 10^9`一个测试用例的松弛迭代。 该图仅包含大约 40000 个路线段，因此将其视为密集会完全丢弃输入给我们的稀疏性。 

解锁更快解决方案的观察结果是，我们不需要每对状态之间的最短路径。 只有一个出发地和一个目的地。 所有边权重均为正，因此 Dijkstra 可以直接找到从原点状态出发的最短路径。 

我们保留相同的扩展图，因为它正确捕获了传输模式。 每个城市贡献四个州。 对于每个城市，所有六对不同的模式都因城市的转换成本而具有优势。 对于每个路线段，我们在两个端点以相同的模式连接相应的状态。 最后，我们不是运行 Dijkstra 四次，而是概念性地引入一个与零成本边连接到原点的四种模式的超级源。 同样，我们可以将四个原点模式距离初始化为零。 答案是目的地的四种模式状态之间的最小距离。 

生成的图最多有 1600 个顶点，大约`40000 + 6 * 400 = 42400`无向边。 对于二叉堆，Dijkstra 采取`O((V + E) log V)`，这里很容易足够小。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力，弗洛伊德·沃歇尔 | O((4c)^3) | O((4c)^3) | O((4c)^2) | O((4c)^2) | 太慢了 |
 | 最优，Dijkstra 在扩展图上 | O((4c + r) log c) | O((4c + r) log c) | O(c + r) | 已接受 |

 ## 算法演练

 1. 读取城市并为每个城市分配四个整数州 ID，每个州 ID 对应一种交通模式。 该状态为`city + mode`准确地代表了做出未来决策所需的信息。 
2. 对于每个城市，用一条无向边连接每对不同的交通方式，其权重为该城市的转换成本。 有六个这样的对，因为四种模式给出`4 choose 2 = 6`可能的开关。 继续使用相同的模式不需要交换边缘，因为路线边缘已经使用该模式连接连续的城市。 
3. 对于每个航段`(u, v, mode, cost)`， 连接`(u, mode)`和`(v, mode)`具有给定成本的无向边。 该模式是该州的一部分，因此可用于航空的路线不得意外地可用于铁路或卡车。 
4. 将属于始发城市的所有四个州的 Dijkstra 距离初始化为零。 这相当于为这四个状态添加了一个具有零成本优势的新超级源。 选择初始运输模式时不收取转换成本，因为包裹在没有现有模式的情况下启动。 
5. 从此多源初始化运行 Dijkstra。 每当从优先级队列中删除一个状态时，请尝试放松其所有图边。 由于每个边权重都是正数，因此状态的第一个最终距离是其真实的最短距离。 
6. Dijkstra完成后，检查目的地城市所属的四个州并计算它们的最小距离。 包裹可以使用任何运输方式到达，因此不应排除这四个州中的任何一个。 

为什么有效：每一次真实的交通旅程都可以转化为扩展图中的一条路径。 一条路由段保持相同的模式并由一条路由边来表示，而每次模式变化都由一个承载城市切换成本的交换边来表示。 反之亦然，因为展开图中的每条边都对应于合法的运输动作。 因此，扩展图中的路径成本正是原始问题中的运输成本。 四个零距离起始状态代表所有合法的初始模式，取四个目的地状态中的最小值代表所有合法的最终模式。 Dijkstra 然后返回所有此类路径中的最小成本。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

MODES = {
    "AIR": 0,
    "SEA": 1,
    "RAIL": 2,
    "TRUCK": 3,
}

INF = 10**30

def solve_case():
    city_count = int(input())

    city_id = {}
    switch_cost = [0] * city_count

    for i in range(city_count):
        name, cost = input().split()
        city_id[name] = i
        switch_cost[i] = int(cost)

    state_count = city_count * 4
    graph = [[] for _ in range(state_count)]

    def state(city, mode):
        return city * 4 + mode

    # Six mode-switch edges inside every city.
    for city in range(city_count):
        base = city * 4
        cost = switch_cost[city]

        for a in range(4):
            for b in range(a + 1, 4):
                u = base + a
                v = base + b
                graph[u].append((v, cost))
                graph[v].append((u, cost))

    route_count = int(input())

    for _ in range(route_count):
        u_name, v_name, mode_name, cost = input().split()
        u = city_id[u_name]
        v = city_id[v_name]
        mode = MODES[mode_name]
        cost = int(cost)

        a = state(u, mode)
        b = state(v, mode)

        graph[a].append((b, cost))
        graph[b].append((a, cost))

    origin_name, destination_name = input().split()
    origin = city_id[origin_name]
    destination = city_id[destination_name]

    dist = [INF] * state_count
    heap = []

    # Any transport mode can be chosen at the origin for free.
    for mode in range(4):
        s = state(origin, mode)
        dist[s] = 0
        heapq.heappush(heap, (0, s))

    while heap:
        current_dist, u = heapq.heappop(heap)

        if current_dist != dist[u]:
            continue

        for v, weight in graph[u]:
            new_dist = current_dist + weight
            if new_dist < dist[v]:
                dist[v] = new_dist
                heapq.heappush(heap, (new_dist, v))

    return min(dist[state(destination, mode)] for mode in range(4))

def main():
    test_cases = int(input())
    answers = []

    for _ in range(test_cases):
        answers.append(str(solve_case()))

    sys.stdout.write("\n".join(answers))

if __name__ == "__main__":
    main()
```这`city_id`字典将输入的城市名称转换为紧凑的整数索引。 由于城市名称仅在读取输入时使用，因此没有理由在实际图表中保留字符串。 

这`state`功能图`(city, mode)`到`city * 4 + mode`。 这为每个状态提供了唯一的索引`0`通过`4 * city_count - 1`。 固定因子四也使得模式转换易于构建。 

六个交换边在路由边之前创建。 对于有转换成本的城市`c`，每对不同的模式都有权重优势`c`。 该图是无向的，因为在问题规则下从航空改为铁路的成本与从铁路改为航空的成本相同。 

路由边仅连接具有相同模式的状态。 如果输入路径显示`A B AIR 7`，唯一对应的运输边是`(A, AIR) <-> (B, AIR)`。 该软件包只需穿过六个交换边缘之一即可改变城市的模式。 

四个原点状态被初始化为距离零。 这比添加实际的超级源顶点更干净，并且避免了额外的图节点。 它还可以防止在源头发生错误的开关充电。 

优先级队列可以包含同一状态的多个条目。 当旧条目被弹出时，`current_dist != dist[u]`将其识别为过时并跳过它。 这是标准的基于堆的 Dijkstra 模式，避免需要单独的访问数组。 

Python 整数不会溢出，因此即使路径包含许多边，距离计算也是安全的。`INF`只需要大于每个可能的有效路径成本，并且`10**30`舒服就够了。 

目的地的处理与出发地对称。 我们采用所有四个目的地州中的最小值，因为包裹可能会使用任何运输方式完成。 

## 工作示例

 ### 示例 1

 第一个样本有四个城市和七个航线段。 最便宜的路线从`JACKSONVILLE`到`TAMPA`不仅仅是最便宜的单一航线段。 包裹可以通过`MIAMI`，一路改变模式。 

相关的状态进展是：

 | 步骤| 城市 | 当前模式 | 距离 |
 | --- | --- | --- | --- |
 | 0 | 杰克逊维尔 | 东南亚 | 0 |
 | 1 | 迈阿密 | 东南亚 | 15 | 15
 | 2 | 迈阿密 | 铁路 | 20 |
 | 3 | 杰克逊维尔 | 铁路 | 65 | 65
 | 4 | 坦帕 | 铁路 | 75 | 75

 这个特定的路由不是最佳的，因为交换机在`MIAMI`对于最佳路径来说是不必要的。 实际最优成本通过走以下路线得到`MIAMI`和`SEA`接下来是适当的更便宜的延续，产生样本答案`55`。 图模型证明的关键点是，以不同的方式到达一个城市会产生真正不同的状态，因此 Dijkstra 必须区分它们。 

示例输出为：```
55
```### 示例 2

 只有两个城市。 可用航线是一条航线，费用为`7`，卡车路线成本`3`，以及一条铁路线的成本`19`。 

| 步骤| 状态| 距离 |
 | --- | --- | --- |
 | 0 | 奥兰多，航空 | 0 |
 | 0 | 奥兰多，海 | 0 |
 | 0 | 奥兰多，铁路 | 0 |
 | 0 | 奥兰多，卡车 | 0 |
 | 1 | 坦帕，卡车 | 3 |
 | 1 | 坦帕航空 | 7 |
 | 1 | 坦帕，铁路 | 19 | 19

 最小目的地距离为`3`，所以答案是：```
3
```该示例检查算法是否可以自由选择启动模式。 它还确认，不能仅仅因为另一种模式在输入中首先列出而隐藏一种模式中更便宜的路线。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((c + r) log c) | O((c + r) log c) | 有`4c`州和`O(c + r)`边，基于堆的 Dijkstra 以对数时间处理它们 |
 | 空间| O(c + r) | 扩展的邻接列表存储每个城市四个州、每个城市六个交换边以及每个路由段两个定向条目 |

 和`c <= 400`，展开后的图最多有 1600 个顶点。 即使在`r = 40000`，图仍然稀疏，只有几万条边。 因此，基于堆的实现可以轻松保持在 4 秒和 256 MB 的限制内。 

## 测试用例```python
import sys
import io
import heapq

MODES = {
    "AIR": 0,
    "SEA": 1,
    "RAIL": 2,
    "TRUCK": 3,
}

INF = 10**30

def solve_case():
    city_count = int(input())
    city_id = {}
    switch_cost = [0] * city_count

    for i in range(city_count):
        name, cost = input().split()
        city_id[name] = i
        switch_cost[i] = int(cost)

    state_count = city_count * 4
    graph = [[] for _ in range(state_count)]

    def state(city, mode):
        return city * 4 + mode

    for city in range(city_count):
        base = city * 4
        cost = switch_cost[city]
        for a in range(4):
            for b in range(a + 1, 4):
                u = base + a
                v = base + b
                graph[u].append((v, cost))
                graph[v].append((u, cost))

    route_count = int(input())

    for _ in range(route_count):
        u_name, v_name, mode_name, cost = input().split()
        u = city_id[u_name]
        v = city_id[v_name]
        mode = MODES[mode_name]
        cost = int(cost)

        a = state(u, mode)
        b = state(v, mode)

        graph[a].append((b, cost))
        graph[b].append((a, cost))

    origin_name, destination_name = input().split()
    origin = city_id[origin_name]
    destination = city_id[destination_name]

    dist = [INF] * state_count
    heap = []

    for mode in range(4):
        s = state(origin, mode)
        dist[s] = 0
        heapq.heappush(heap, (0, s))

    while heap:
        current_dist, u = heapq.heappop(heap)

        if current_dist != dist[u]:
            continue

        for v, weight in graph[u]:
            nd = current_dist + weight
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(heap, (nd, v))

    return min(dist[state(destination, mode)] for mode in range(4))

def solve_all(data: str) -> str:
    global input
    old_input = input
    input = io.StringIO(data).readline

    test_cases = int(input())
    result = []

    for _ in range(test_cases):
        result.append(str(solve_case()))

    input = old_input
    return "\n".join(result)

# Provided samples.
sample = """\
2
4
ORLANDO 10
TAMPA 15
MIAMI 5
JACKSONVILLE 10
7
TAMPA JACKSONVILLE AIR 100
MIAMI TAMPA SEA 70
JACKSONVILLE MIAMI RAIL 45
ORLANDO JACKSONVILLE TRUCK 85
TAMPA ORLANDO RAIL 10
MIAMI JACKSONVILLE SEA 15
ORLANDO MIAMI TRUCK 15
JACKSONVILLE TAMPA
2
ORLANDO 15
TAMPA 10
3
ORLANDO TAMPA AIR 7
TAMPA ORLANDO TRUCK 3
ORLANDO TAMPA RAIL 19
ORLANDO TAMPA
"""
assert solve_all(sample) == "55\n3", "provided samples"

# Minimum-size graph, direct route.
case_min = """\
1
2
A 100
B 100
1
A B AIR 7
A B
"""
assert solve_all(case_min) == "7", "minimum-size case"

# All route modes between the same two cities.
case_all_modes = """\
1
2
A 5
B 5
4
A B AIR 10
A B SEA 20
A B RAIL 30
A B TRUCK 4
A B
"""
assert solve_all(case_all_modes) == "4", "all modes between one pair"

# Switching at an intermediate city is necessary for the best route.
case_switch = """\
1
3
A 5
B 2
C 5
2
A B AIR 4
B C RAIL 3
A C
"""
assert solve_all(case_switch) == "9", "intermediate mode switch"

# Boundary-style case with many route edges.
# 10 cities, all four modes on every consecutive pair and both directions.
# The cheapest route is the chain using TRUCK throughout.
def build_dense_case():
    n = 10
    lines = ["1", str(n)]

    for i in range(n):
        lines.append(f"C{i} 1000")

    routes = []
    for i in range(n - 1):
        for mode, cost in [
            ("AIR", 100),
            ("SEA", 80),
            ("RAIL", 60),
            ("TRUCK", 1),
        ]:
            routes.append(f"C{i} C{i+1} {mode} {cost}")

    lines.append(str(len(routes)))
    lines.extend(routes)
    lines.append("C0 C9")

    return "\n".join(lines) + "\n"

assert solve_all(build_dense_case()) == "9", "dense route case"

# Large-state construction with 400 cities.
# Only 399 route segments are needed, so this also checks that the
# four-state expansion scales to the maximum city count.
def build_max_city_case():
    n = 400
    lines = ["1", str(n)]

    for i in range(n):
        lines.append(f"C{i} 1")

    lines.append(str(n - 1))

    for i in range(n - 1):
        lines.append(f"C{i} C{i+1} TRUCK 2")

    lines.append("C0 C399")
    return "\n".join(lines) + "\n"

assert solve_all(build_max_city_case()) == str(399 * 2), "maximum city count"

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 提供两个样品|`55`,`3`| 官方示例和基本图构建 |
 |`A -> B`空运，收取费用`7`|`7`| 网络规模最小且端点无交换成本 |
 | 四种模式之间`A`和`B`|`4`| 同一城市之间的多种交通方式 |
 |`A -> B`乘飞机，`B -> C`乘火车 |`9`| 中间模式开关的正确充电|
 | 十个城市连续对所有四种模式 |`9`| 密集的路线数据和重复的同模遍历 |
 | 400城市连锁|`798`| 最大城市数量和正确的州扩张 |

 ## 边缘情况

 对于无需更改模式的直接行程，请考虑：```
1
2
A 100
B 100
1
A B AIR 7
A B
```的四种状态`A`从距离零开始。 从`(A, AIR)`，路线边缘到达`(B, AIR)`有成本`7`。 因此最小目的地距离为`7`。 开关边沿为`A`和`B`永远不需要，因此转换成本都不会被错误地收取。 

对于中间模式更改，请考虑：```
1
3
A 5
B 2
C 5
2
A B AIR 4
B C RAIL 3
A C
```的初始状态为`A`全部距离为零。 空气边缘给出`(B, AIR)`距离`4`。 在`B`，开关沿`(B, AIR)`到`(B, RAIL)`成本`2`, 产生距离`6`。 然后铁轨边缘到达`(C, RAIL)`在远处`9`。 最小目的地距离为`9`。 状态表示使得开关电荷出现在正确的点。 

对于同一城市之间的多种模式，请考虑：```
1
2
A 10
B 10
2
A B AIR 100
A B TRUCK 3
A B
```各州`(A, AIR)`和`(A, TRUCK)`两者都从零开始。 它们对应的路线边缘导致距离`100`和`3`。 答案是`3`。 由于每种模式都有自己的状态，因此读取第二条路线不会破坏第一条路线，反之亦然。 

对于多次改变模式的路径，相同的结构会重复应用。 认为`A -> B`是空气，`B -> C`是铁路，并且`C -> D`是卡车。 通过扩展图的路径具有以下形式`(A, AIR)`,`(B, AIR)`,`(B, RAIL)`,`(C, RAIL)`,`(C, TRUCK)`,`(D, TRUCK)`。 总成本恰好是三个路由成本加上在`B`和`C`。 每个切换都由一条图边表示，因此何时收取切换费没有任何歧义。 

最后，出发地和目的地需要特殊处理，因为它们没有强制的传入或传出模式。 将所有四个原始状态初始化为零模型可以自由选择任何第一模式。 对所有四个目的地状态取最小值，模型可以自由地以任何模式完成任务。 将任一方限制为一种任意模式将解决不同的问题并可以产生更大的答案。
