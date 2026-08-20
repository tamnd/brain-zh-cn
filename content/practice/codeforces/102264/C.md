---
title: "CF 102264C - 梯子和蛇"
description: "房间是一个半平面，下方以 y = 0 为界，上方以 y = H 为界。每个梯子都是某个整数 X 处的垂直线段，从高度 A 到高度 B。弗林可以在任何地方水平移动，但只有当她在梯子上时才可以进行垂直移动。"
date: "2026-08-19T03:07:23+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102264
codeforces_index: "C"
codeforces_contest_name: "2019 Facebook Hacker Cup, Round 1"
rating: 0
weight: 102264
solve_time_s: 542
verified: true
draft: false
---

[CF 102264C - 梯子和蛇](https://codeforces.com/problemset/problem/102264/C)

 **评级：** -
 **标签：** -
 **求解时间：** 9m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 房间是一个半平面，其下方的边界为`y = 0`及以上由`y = H`。 每个梯子都是某个整数处的垂直线段`X`，从高度`A`到高度`B`。 弗林可以在任何地方水平移动，但只有当她在梯子上时才能垂直移动。 

蛇也是垂直的部分，但它们是障碍物。 有的地方有蛇`x`阻止水平移动`x`对于其两个端点之间的每个高度。 它的端点包含在障碍物中，因此零长度的蛇可以阻挡一个精确的高度。 蛇的成本是它的垂直长度。 

任务是选择总长度最小的蛇，使得从`(0,0)`到`(0,H)`。 如果弗林已经无法在没有蛇的情况下完成这次旅行，那么答案是`0`。 如果没有有限的蛇集合可以阻止她，答案是`-1`。 

最多有50个梯子，但是`H`可以是100,000。 这立即排除了每个整数高度和每个梯子都有一个状态的图，因为即使一个测试用例也可以创建数百万个状态，并且最多有 150 个测试用例。 有用的观察结果是，梯子排列结构发生变化的唯一高度是梯子端点。 最多有`2N`这样的高度，因此连续问题可以压缩为仅`O(N)`相关级别。 

一个特别危险的边缘情况是弗林已经被困在一个房间里。 例如，```
1
2 100
1 0 49
1 50 100
```给出```
Case #1: 0
```两个梯子有相同的`x`坐标但不重叠，因此弗林无法从一个位置垂直移动到另一个位置。 添加蛇是不必要的。 盲目地假设必须放置一条蛇的解决方案将产生肯定的答案。 

另一个重要的情况是唯一可能的过渡使用地板或天花板。 例如，```
1
3 9
33 0 6
66 0 9
99 3 9
```给出```
Case #1: -1
```第一梯子和第二梯子在地板处重叠，第二梯子和第三梯子在天花板处重叠。 蛇不能触及任何一个边界，因此两个过渡都不能被阻止。 将长度为零或端点的重叠视为普通有限成本切割的解决方案将错误地返回`0`。 

第三种边缘情况是零长度蛇。 例如，```
1
2 5
1 0 2
2 2 5
```有答案`0`。 梯子在高处相遇`2`，并且一条长度为零的蛇恰好放置在它们之间`y = 2`阻止唯一的转换。 成本为零，因为蛇只占据一个点。 任何要求每条有用的蛇都具有正长度的实现都会错过这种情况。 

## 方法

 最直接的方法是离散化每个整数高度。 在每个高度，我们可以记录哪些梯子存在以及哪些水平过渡是可能的，然后搜索结果状态图。 问题是`H`可以是 100,000 个，并且最多 50 个梯子中的每个可以与每个高度交互。 图表与`O(NH)`在一个房间里可以达到 500 万个状态，考虑到所有测试用例后，这个数字就太多了。 

蛮力方法在概念上是正确的，因为弗林的运动可以被视为水平和垂直可能性的图表。 问题是几乎所有这些高度都无法区分。 在两个连续的梯子端点之间没有任何变化。 蛇可以在那里连续移动，但在区间内没有新的组合选择。 

关键的观察是从另一面看问题。 想象一下，试图建造一个屏障，阻止弗林从地板一侧移动到天花板一侧。 现有的梯子是这种屏障的障碍。 障碍物可以垂直移动穿过空的垂直带，并且该移动的成本恰好等于所使用的蛇的长度。 在梯子端点，障碍物可以绕过端点并以零额外成本从梯子的左侧切换到右侧。 这是问题的平面对偶视图。 

只有梯子端点才重要。 在两个连续端点高度之间，梯子组是恒定的，因此在该间隔内垂直移动的每单位高度的成本始终相同。 因此，我们可以为每一对创建一个节点，该节点由梯子之间的垂直间隙组成`x`坐标和内部阶梯端点高度。 

在一个间隙内，连续的端点高度与一条边连接，其成本是它们的差值。 绕过梯子的端点，用零成本边将其左侧和右侧的两个间隙立即连接起来。 高地`0`和`H`不能用作蛇端点，因此它们被排除在有限障碍图中。 如果障碍物必须穿过地板或天花板上的梯子，那么这种过渡是不可能被阻挡的，这正是产生的情况`-1`。 

在构建这个图之前，我们首先检查弗林是否可以在没有蛇的情况下到达天花板。 将每个梯子视为一个顶点，当两个梯子的垂直间隔相交时将两个梯子连接起来。 接触地板的梯子是起始顶点，接触天花板的梯子是目标顶点。 如果无法到达目的地，则立即给出答案`0`。 如果目的地是可到达的，则最小障碍问题是有限的，除非每个可能的障碍都被强制穿过边界。 

得到的图只有`O(N^2)`州。 然后，Dijkstra 算法找到障碍物的最小总垂直长度。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 整数高度暴力破解 | O(NH + N2H) | O(NH)| 太慢了|
 | 端点压缩最短路径| O(N² log N) | O(N² log N) | O(N²) | 已接受 |

 ## 算法演练

 1. 阅读所有梯子并对其不同的进行排序`X`坐标。 这些坐标将房间划分为垂直间隙。 间隙是两个连续梯子之间紧邻的区域`x`坐标，每个梯子左侧各有一个额外间隙，右侧各有一个额外间隙。 
2. 检查没有蛇的可达性。 在梯子上创建间隔重叠图。 如果两个梯子的闭合垂直间隔相交，则两个梯子相邻。 从每个梯子开始`A = 0`，看看是否有一些梯子`B = H`是可达的。 这准确地捕捉到了弗林在没有蛇存在时可以做出的动作，因为她可以在一个共同的高度水平移动，也可以沿着梯子垂直移动。 
3. 如果无法到达天花板梯子，请返回`0`。 弗林已经无法完成旅程，所以斯奈德不需要放置任何东西。 
4.严格收集房间内的每个梯子端点，即每个`A`和`B`满意的`0 < y < H`，并对不同的值进行排序。 这是组合结构发生变化的唯一高度。 
5. 为每一对创建一个图节点`(gap, y)`在哪里`y`是这些内部端点高度之一。 该节点表示障碍物当前位于该高度的垂直间隙中`y`。 
6. 在每个间隙内，连接连续的端点高度。 如果两个高度是`y1 < y2`，给出边缘成本`y2 - y1`。 在这些高度之间移动障碍物正好需要那么多蛇的长度。 
7. 对于每个梯子，查看它的两个端点。 在内部端点`y`,连接节点`(left_gap, y)`和`(right_gap, y)`使用零成本优势。 障碍物可以绕过梯子端点，而无需花费垂直长度。 如果端点位于地板或天花板上，请不要添加这样的有限过渡，因为禁止蛇接触这些边界。 
8. 从接触地板的梯子上的每个内部端点高度初始化 Dijkstra。 当梯子存在时，梯子的两侧都是有效的起始位置。 沿着阶梯移动不需要任何成本，因此每个这样的状态都从距离零开始。 
9. 同样，位于触及天花板的梯子上的每个内部端点都是目标状态。 这些状态中最小的 Dijkstra 距离就是所需的答案。 
10. 如果屏障图中没有可到达的目标状态，则输出`-1`。 这意味着每一个可能的分离都必须使用地板或天花板，而蛇是不允许接触的。 

### 为什么它有效

 不变量是每个图路径代表一个有效的障碍，并且每个有效的最小障碍都可以转换为图路径而不增加其长度。 蛇的垂直部分位于一个间隙内，并由总重量等于其长度的垂直图边表示。 每当障碍从梯子的一侧变化到另一侧时，它必须绕过一个端点，这由该端点处的零成本转换表示。 在梯子端点之间，没有结构变化，因此将转折点移动到端点永远不会增加所需的垂直长度。 初始和最终状态对应于弗林可以从地板到天花板使用的梯子。 因此，最短的图路径恰好是最小的蛇总长度。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

INF = 10**30

def solve_case():
    n, H = map(int, input().split())
    ladders = [tuple(map(int, input().split())) for _ in range(n)]

    # First check whether Flynn can already reach the ceiling.
    start = [i for i, (_, a, _) in enumerate(ladders) if a == 0]
    target = [i for i, (_, _, b) in enumerate(ladders) if b == H]

    reachable = [False] * n
    stack = start[:]
    for i in start:
        reachable[i] = True

    while stack:
        u = stack.pop()
        _, au, bu = ladders[u]

        for v in range(n):
            if reachable[v] or v == u:
                continue

            _, av, bv = ladders[v]

            if max(au, av) <= min(bu, bv):
                reachable[v] = True
                stack.append(v)

    if not any(reachable[i] for i in target):
        return 0

    # Distinct x coordinates define vertical gaps.
    xs = sorted(set(x for x, _, _ in ladders))
    x_id = {x: i for i, x in enumerate(xs)}

    # Each ladder at x=xs[k] has gap k on its left and k+1 on its right.
    gap_count = len(xs) + 1

    # Only internal heights matter for finite snakes.
    ys = sorted({
        y
        for _, a, b in ladders
        for y in (a, b)
        if 0 < y < H
    })

    if not ys:
        # If there is a reachable floor-to-ceiling ladder chain but
        # there are no internal endpoints, every relevant ladder
        # touches a boundary. No finite snake can separate it.
        return -1

    y_id = {y: i for i, y in enumerate(ys)}
    k = len(ys)

    # Node (gap, y-index).
    total_nodes = gap_count * k

    def node(g, yi):
        return g * k + yi

    graph = [[] for _ in range(total_nodes)]

    def add_edge(u, v, w):
        graph[u].append((v, w))
        graph[v].append((u, w))

    # Vertical movement inside every empty gap.
    for g in range(gap_count):
        base = g * k
        for i in range(k - 1):
            w = ys[i + 1] - ys[i]
            add_edge(base + i, base + i + 1, w)

    # Crossing around ladder endpoints.
    for x, a, b in ladders:
        g = x_id[x]

        # Internal bottom endpoint.
        if 0 < a < H:
            yi = y_id[a]
            if g > 0:
                add_edge(node(g, yi), node(g - 1, yi), 0)
            if g + 1 < gap_count:
                add_edge(node(g, yi), node(g + 1, yi), 0)

        # Internal top endpoint.
        if 0 < b < H:
            yi = y_id[b]
            if g > 0:
                add_edge(node(g, yi), node(g - 1, yi), 0)
            if g + 1 < gap_count:
                add_edge(node(g, yi), node(g + 1, yi), 0)

    # We need only finite barrier paths that start on a floor ladder
    # and end on a ceiling ladder. Starting/ending at any internal
    # endpoint on such a ladder costs zero.
    dist = [INF] * total_nodes
    pq = []

    def seed_ladder(x, a, b):
        g = x_id[x]

        for yi, y in enumerate(ys):
            if a <= y <= b:
                if g > 0:
                    u = node(g, yi)
                    if dist[u] != 0:
                        dist[u] = 0
                        heapq.heappush(pq, (0, u))

                if g + 1 < gap_count:
                    u = node(g + 1, yi)
                    if dist[u] != 0:
                        dist[u] = 0
                        heapq.heappush(pq, (0, u))

    for x, a, b in ladders:
        if a == 0:
            seed_ladder(x, a, b)

    target_nodes = set()

    for x, a, b in ladders:
        if b == H:
            g = x_id[x]

            for yi, y in enumerate(ys):
                if a <= y <= b:
                    if g > 0:
                        target_nodes.add(node(g, yi))
                    if g + 1 < gap_count:
                        target_nodes.add(node(g + 1, yi))

    while pq:
        d, u = heapq.heappop(pq)

        if d != dist[u]:
            continue

        if u in target_nodes:
            return d

        for v, w in graph[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))

    return -1

def main():
    t = int(input())
    out = []

    for case_id in range(1, t + 1):
        ans = solve_case()
        out.append(f"Case #{case_id}: {ans}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```第一个图搜索故意与最短路径计算分开。 它回答了一个不同的问题：是否根本需要有限的答案。 区间重叠测试使用闭区间，因为弗林可以在梯子端点精确地水平移动。 

第二张图仅使用内部端点高度。 这是主要的压缩。 最多可以有`2N - 2`这样的高度，所以最多`N + 1`差距只有`O(N²)`州。 

垂直边缘使用连续高度之间的差异。 它们的总和正是相应蛇片的长度。 零差异永远不会出现，因为端点高度已进行重复数据删除。 

零成本转换是在阶梯端点创建的。 边界情况`y = 0`和`y = H`被故意排除。 蛇不能接触任何一个边界，因此将边界端点视为普通梯子端点会错误地将不可能的分离变成有限的分离。 

Python 整数是无界的，因此不存在溢出问题。`INF`只需要大于任何可能的答案，并且`10**30`远远超出了最大相关总长度。 

## 工作示例

 ### 示例 1

 房间有两个梯子：```
L0: x = 0, [0, 3]
L1: x = 1, [1, 4]
```第一个梯子到达地板，第二个梯子到达天花板，因此弗林可以在没有蛇的情况下在它们之间移动。 唯一相关的内部高度是`1`和`3`。 

| 状态| 行动| 成本| 距离 |
 | --- | --- | --- | --- |
 | L0 在 y=3 | 从楼梯开始 | 0 | 0 |
 | L0 和 L1 之间的间隙，y=3 | 绕过 L0 顶部 | 0 | 0 |
 | L0 和 L1 之间的间隙，y=1 | 垂直移动| 2 | 2 |
 | L1 在 y=1 | 绕过 L1 底部 | 0 | 2 |

 该路径有总成本`3 - 1 = 2`，所以答案是`2`。 

该痕迹还说明了长度为二的蛇为何能起作用。 它占据高度 1 和高度 3 之间的部分，阻挡两个梯子之间的每个水平交叉点。 

### 示例 2

 两个梯子分别是```
L0: x = 1, [0, 49]
L1: x = 1, [50, 100]
```他们有相同的`x`坐标，但它们的垂直间隔不相交。 

| 当前阶梯 | 候选人阶梯| 交叉口| 结果 |
 | --- | --- | --- | --- |
 |`[0,49]`|`[50,100]`| 空 | 无边|
 |`[0,49]`| 本身|`[0,49]`| 已代表|

 梯子重叠搜索无法从地板梯子到达天花板梯子。 在斯奈德放置任何东西之前弗林就被困住了，所以答案是`0`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N² log N) | O(N² log N) | 有 O(N²) 个压缩状态和边，其次是 Dijkstra |
 | 空间| O(N²) | 压缩图包含 O(N²) 个节点和边 |

 和`N <= 50`，压缩图每个房间仅包含几千个状态。 的价值`H`，即使它是 100,000，也会影响边权重，但不会影响状态数。 这是解决方案对于所有测试用例来说仍然足够小的关键原因。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
import heapq

# The production solve_case/main code should be placed above this test section.
# For a standalone test file, paste the solution implementation before these tests.

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    main()

    result = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout

    return result

# Sample 1
assert run("""\
1
2 4
0 0 3
1 1 4
""") == "Case #1: 2\n"

# Sample 2
assert run("""\
1
2 100
1 0 49
1 50 100
""") == "Case #1: 0\n"

# Sample 3
assert run("""\
1
3 9
33 0 6
66 0 9
99 3 9
""") == "Case #1: -1\n"

# Sample 4
assert run("""\
1
7 30
10 0 10
20 0 10
5 8 21
15 7 20
25 9 22
10 20 30
20 20 30
""") == "Case #1: 3\n"

# Minimum-size room. The single ladder reaches the ceiling directly,
# so no finite snake arrangement can stop Flynn.
assert run("""\
1
1 1
0 0 1
""") == "Case #1: -1\n"

# Zero-length snake is sufficient because the ladders meet at one
# internal height.
assert run("""\
1
2 5
1 0 2
2 2 5
""") == "Case #1: 0\n"

# Same x coordinate, but a genuine gap between ladders. Flynn cannot
# switch from one ladder to the other.
assert run("""\
1
2 10
5 0 3
5 7 10
""") == "Case #1: 0\n"

# A ladder chain reaches the ceiling through an internal touching point,
# so a length-zero snake blocks the only transition.
assert run("""\
1
2 6
2 0 3
4 3 6
""") == "Case #1: 0\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 1 / 0 0 1`|`Case #1: -1`| 直接连接地板和天花板的梯子不能被遮挡|
 |`2 5 / 1 0 2 / 2 2 5`|`Case #1: 0`| 允许内部端点处的零长度蛇 |
 |`2 10 / 5 0 3 / 5 7 10`|`Case #1: 0`| 位于相同 x 坐标的梯子不会跨越垂直间隙连接 |
 |`2 6 / 2 0 3 / 4 3 6`|`Case #1: 0`| 通过一个精确的内部高度的过渡可以零成本 |

 ## 边缘情况

 对于弗林已经无法到达天花板的房间，间隔重叠图会在任何障碍计算之前检测到这一点。 在输入中```
1
2 100
1 0 49
1 50 100
```两个梯子没有共同的高度。 从第一个梯子开始的 DFS 永远不会到达第二个梯子，因此算法返回`0`。 

对于边界重叠，重叠本身不足以创建有限障碍。 在```
1
3 9
33 0 6
66 0 9
99 3 9
```第一次转换可能发生在`y = 0`第二个在`y = 9`。 屏障图故意不在这些边界高度处创建有限端点过渡。 因此 Dijkstra 无法产生有限的分离和返回`-1`。 

对于内部单点转换，端点包含在图中并且穿过它的成本为零。 在```
1
2 5
1 0 2
2 2 5
```两个梯子都可以在以下位置使用`y = 2`。 在该高度处放置在它们之间的零长度蛇阻止了过渡。 该算法在内部端点处对两侧进行播种并获得距离零。 

对于跨越整个房间的梯子，有限障碍没有可以开始或结束的内部端点。 可达性检查发现地板和天花板由同一个梯子连接，而障碍图没有有限的路线将它们分开。 正确的结果是`-1`。 

对于具有相同的多个梯子`x`，每个梯子仍然是一个单独的垂直组件，因为梯子不能重叠。 该结构不会仅仅因为两个这样的梯子共享一个而连接它们`x`协调。 它们仅通过共同高度上的有效水平移动来连接，完全按照原始移动规则的要求。
