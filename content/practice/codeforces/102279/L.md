---
title: "CF 102279L - 左还是右？ 两者都没有怎么样？"
description: "我们有一个包含 N 个位置的一维数组。 B21 从位置 u 开始，想要到达位置 v。从位置 i 移动到 i + 1 需要花费 R，而从 i 移动到 i - 1 需要花费 L。只有当目标位置位于数组内部时，这些移动才可能实现。"
date: "2026-08-16T19:23:59+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102279
codeforces_index: "L"
codeforces_contest_name: "HCW 19 Team Round (ICPC format)"
rating: 0
weight: 102279
solve_time_s: 138
verified: true
draft: false
---

[CF 102279L - 左还是右？ 两者都不怎么样？](https://codeforces.com/problemset/problem/102279/L)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个一维数组`N`职位。 B21 起始位置`u`并且想要达到的位置`v`。 从位置移动`i`到`i + 1`成本`R`，同时从`i`到`i - 1`成本`L`。 仅当目标位置位于数组内部时，这些移动才可能实现。 

还有一项附加操作。 如果两个位置包含相同的数组值，B21可以直接在它们之间传送以节省成本`C`，无论它们的距离如何。 任务是找到从以下位置获取所需的最小能量`u`到`v`。 

输入包含`N`，两个方向的移动成本`L`和`R`，以及传送成本`C`。 下一行给出起始位置和目标位置，最后一行包含数组值。 所需的输出是任何有效的普通移动和传送序列的最小能量。 

约束条件`N <= 10^5`排除检查每对位置的算法。 特别是，如果许多位置具有相同的值，明确考虑每个可能的传送可以创建大约`N^2`连接。 高达`10^5`位置，我们需要一个解决方案，其工作大致呈线性或`N log N`。 成本可能高达`10^9`，并且一个路径可以包含许多操作，因此 32 位整数在具有固定宽度整数类型的语言中是不够的。 Python 整数会自动处理这个问题。 

有少数情况很容易处理不当。 首先，起始位置和目的地位置可能已经相等。 例如，```
2 5 7 3
2 2
1 2
```需要`0`，因为B21已经到达目的地。 始终考虑至少一个移动的实现可能会错误地返回正成本。 

即使匹配位置不是紧邻的，最便宜的路线也可以使用传送。 例如，```
3 10 10 2
1 3
5 1 5
```有答案`2`: 职位`1`和`3`包含相同的值，因此B21可以直接传送。 仅考虑相邻位置的实现将返回`20`。 

更便宜的方向还取决于路线行进的方向。 例如，```
2 7 2 100
2 1
1 2
```有答案`7`，因为唯一有用的动作就是后退一步。 将运动视为具有一种对称成本是错误的。 

最后，一个传送可以连接相距很远的位置，并且几个不同的传送组可以参与一条最佳路线。 仅考虑从起始值到目标值的单个传送是不够的。 下面的图形公式自动处理任意序列。 

## 方法

 最直接的解决方案是将每个数组位置视为图的顶点。 连续位置具有有向边：从`i`到`i + 1`有成本`R`，并从`i`到`i - 1`有成本`L`。 对于每对包含相同值的位置，我们还可以添加成本的传送边缘`C`。 

该图准确地代表了原始问题，因此运行 Dijkstra 算法将给出正确的答案。 问题在于传送边缘的数量。 如果全部`N`位置包含相同的值，有`N(N - 1)`定向传送边缘。 为了`N = 100000`，这大约是`10^10`边缘，这远远超出了在时间限制内可以构建或处理的内容。 

关键的观察结果是与一个值关联的所有传送边的行为都是相同的。 假设值`x`发生在位置`p1, p2, ..., pk`。 从这些位置中的任何一个，B21 都可以准确地花费`C`进入传送网络获取价值`x`，并且从该网络他可以到达任何发生的情况`x`无需进一步支付任何费用。 

我们可以用一个称为值中心的额外图顶点来表示成对传送边的整个集合。 对于每一次出现`pi`的`x`，添加一条边`pi -> hub_x`有成本`C`，和一条边`hub_x -> pi`有成本`0`。 从`pi`到`pj`通过枢纽的费用正好`C + 0 = C`，这正是原始传送的成本。 

现在每个数组位置仅贡献恒定数量的边。 最多有`N`不同的值，因此最多有`2N`图的顶点和`O(N)`边缘。 Dijkstra 算法然后运行`O(N log N)`时间。 

暴力构造之所以有效，是因为每个可能的传送都被明确表示，但当一个值出现多次时就会失败。 所有共享一个值的传送都可以被压缩到一个集线器中，这一观察结果将二次传送图减少为稀疏图。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(N^2 log N)`构建完所有传送边之后 |`O(N^2)`| 太慢了 |
 | 最佳 |`O(N log N)`|`O(N)`| 已接受 |

 ## 算法演练

 1. 读取数组并为每个不同的值创建一个虚拟集线器。 中心代表在包含该值的所有位置之间传送的能力。 
2. 在相邻位置之间创建普通移动边。 对于每一个`i < N`， 添加`i -> i + 1`有成本`R`，并添加`i + 1 -> i`有成本`L`。 这些是有向边，因为向前和向后移动可能会产生不同的成本。 
3. 对于每个位置`i`，将其连接到属于的集线器`A[i]`有成本`C`，并将该集线器连接回位置`i`有成本`0`。 两条边路径代表一次传送`i`相同值的任何其他出现。 
4. 从位置运行Dijkstra算法`u`。 每个图边都有一个非负成本，因此第一次从优先级队列中删除具有当前最短距离的顶点时，该距离是最终的。 
5.返回位置距离`v`。 由于原问题中的每一个合法的移动或瞬移在压缩图中都有一条等效路径，并且每条压缩瞬移路径都对应一个合法的瞬移，因此图的最短路径正是所需的最小能量。 

### 为什么它有效

 考虑原始问题中的任何合法途径。 每一个普通的移动都直接对应一个相邻位置的边。 每次从位置传送`i`定位`j`和`A[i] = A[j]`对应于`i -> hub[A[i]] -> j`，其总成本为`C`。 因此，每条原始路线都有一条同样昂贵的图路线。 

相反，每条图路线都由普通的移动边或位置到集线器到位置的序列组成。 后者是有效的传送，因为两个位置属于同一价值组并且成本完全相同`C`。 因此，每条图路线都代表一条具有相同成本的有效原始路线。 

因此，压缩图中的最短路径是最小有效能量。 Dijkstra 找到最短路径，因为所有边权重都是非负的。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

def solve():
    n, L, R, C = map(int, input().split())
    u, v = map(int, input().split())
    a = list(map(int, input().split()))

    # Compress each distinct array value into one virtual hub.
    value_id = {}
    groups = []

    for i, x in enumerate(a):
        if x not in value_id:
            value_id[x] = n + len(groups)
            groups.append([])
        groups[value_id[x] - n].append(i)

    m = n + len(groups)
    graph = [[] for _ in range(m)]

    # Ordinary moves along the array.
    for i in range(n - 1):
        graph[i].append((i + 1, R))
        graph[i + 1].append((i, L))

    # Teleport hubs.
    for hub_index, positions in enumerate(groups):
        hub = n + hub_index
        for pos in positions:
            graph[pos].append((hub, C))
            graph[hub].append((pos, 0))

    start = u - 1
    target = v - 1

    INF = 10**30
    dist = [INF] * m
    dist[start] = 0

    pq = [(0, start)]

    while pq:
        d, node = heapq.heappop(pq)

        if d != dist[node]:
            continue

        if node == target:
            print(d)
            return

        for nxt, cost in graph[node]:
            nd = d + cost
            if nd < dist[nxt]:
                dist[nxt] = nd
                heapq.heappush(pq, (nd, nxt))

if __name__ == "__main__":
    solve()
```第一部分为每个不同的数组值分配一个唯一的虚拟顶点。 实际数值可以大到`10^9`，因此使用值本身作为数组索引是浪费的。 该字典将每个值映射到一个紧凑的中心索引。 

相邻位置边缘分别对两个运动方向进行编码。 边缘从`i`到`i + 1`成本`R`，而反向边成本`L`。 位置使用从零开始的索引在内部存储，因此输入位置`u`变成`u - 1`。 

对于值的每次出现，代码都会增加成本`C`从该位置到其中心的边缘以及从中心返回到该位置的零成本边缘。 因此，从一个事件到另一个事件的传送恰好由两条边表示。 

优先级队列包含`(distance, vertex)`对。 支票`if d != dist[node]`丢弃陈旧的条目，因为 Python 的`heapq`不支持减少现有密钥。 当找到更好的距离时，只需插入一个新的对。 

在 Dijkstra 算法下，目标弹出时的提前返回是有效的。 此时，目标在所有剩余顶点中具有最小的暂定距离，因此以后的松弛不能产生更小的路径。 

Python 中不存在整数溢出问题。 这`10**30`值只是一个方便的无穷大，远大于任何可能的答案。 

## 工作示例

 对于样品 1，```
5 1 2 3
1 5
1 2 1 1 2
```起点是位置`1`，目的地是位置`5`。 价值`1`发生在位置`1`,`3`， 和`4`，而值`2`发生在位置`2`和`5`。 

有用的路线是从位置移动`1`定位`3`，这需要花费`2R = 4`，或移动到位置`2`然后传送到位置`5`，这需要花费`R + C = 2 + 3 = 5`。 第二条路线比继续沿着阵列走要好。 

代表性的 Dijkstra 迹是：

 | 弹出节点| 距离 | 相关放宽| 新距离|
 | ---| ---| ---| ---|
 | 位置 1 | 0 | 位置 2 | 2 |
 | 位置 1 | 0 | 价值 1 的枢纽 | 3 |
 | 位置 2 | 2 | 位置 3 | 4 |
 | 位置 2 | 2 | 价值中心 2 | 5 |
 | 价值 1 的枢纽 | 3 | 位置 3 | 3 |
 | 价值 1 的枢纽 | 3 | 位置 4 | 3 |
 | 位置 3 | 3 | 位置 4 | 3 |
 | 位置 4 | 3 | 位置 5 | 5 |
 | 价值中心 2 | 5 | 位置 5 | 5 |

 答案是`5`。 该迹线表明，值中心可以使远处的等值位置可达，而无需显式存储所有成对传送边。 

对于样品 2，```
5 1 4 3
3 5
1 2 1 1 2
```起点是位置`3`目的地是位置`5`。 位置处的值`3`是`1`，以及最近出现的`2`是位置`2`，可以传送到某个位置`5`。 

从位置向后移动`3`定位`2`成本`L = 1`。 进入价值中心`2`成本`C = 3`，然后从该枢纽到位置的零成本过渡`5`。 

| 弹出节点| 距离 | 相关放宽| 新距离|
 | ---| ---| ---| ---|
 | 位置 3 | 0 | 位置 2 | 1 |
 | 位置 3 | 0 | 位置 4 | 4 |
 | 价值 1 的枢纽 | 3 | 位置 1 | 3 |
 | 位置 2 | 1 | 位置 1 | 2 |
 | 位置 2 | 1 | 价值中心 2 | 4 |
 | 位置 1 | 2 | 价值 1 的枢纽 | 3 |
 | 价值中心 2 | 4 | 位置 5 | 4 |
 | 位置 5 | 4 | 目标达成 | 4 |

 答案是`4`。 该迹线运用了不对称移动成本，并显示了为什么最佳路径可以与从起点到目的地的方向相反的方向移动。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(N log N)`| 压缩图有`O(N)`顶点和边，Dijkstra 用二叉堆处理它们。 |
 | 空间|`O(N)`| 位置、值中心、邻接列表、距离和优先级队列都包含`O(N)`数据。 |

 和`N <= 10^5`，压缩后的图少于`2N`顶点且少于`4N`将邻接条目定向到常数因子。 这对于 256 MB 内存限制来说足够小，而`O(N log N)`避免了由于显式连接等值位置而导致的二次行为。 

## 测试用例```python
import sys
import io
import heapq

def solve():
    input = sys.stdin.readline

    n, L, R, C = map(int, input().split())
    u, v = map(int, input().split())
    a = list(map(int, input().split()))

    value_id = {}
    groups = []

    for i, x in enumerate(a):
        if x not in value_id:
            value_id[x] = n + len(groups)
            groups.append([])
        groups[value_id[x] - n].append(i)

    m = n + len(groups)
    graph = [[] for _ in range(m)]

    for i in range(n - 1):
        graph[i].append((i + 1, R))
        graph[i + 1].append((i, L))

    for hub_index, positions in enumerate(groups):
        hub = n + hub_index
        for pos in positions:
            graph[pos].append((hub, C))
            graph[hub].append((pos, 0))

    start = u - 1
    target = v - 1

    INF = 10**30
    dist = [INF] * m
    dist[start] = 0

    pq = [(0, start)]

    while pq:
        d, node = heapq.heappop(pq)

        if d != dist[node]:
            continue

        if node == target:
            print(d)
            return

        for nxt, cost in graph[node]:
            nd = d + cost
            if nd < dist[nxt]:
                dist[nxt] = nd
                heapq.heappush(pq, (nd, nxt))

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample 1.
assert run("""\
5 1 2 3
1 5
1 2 1 1 2
""") == "5", "sample 1"

# Provided sample 2.
assert run("""\
5 1 4 3
3 5
1 2 1 1 2
""") == "4", "sample 2"

# Minimum-size input, start equals destination.
assert run("""\
2 5 7 3
2 2
1 2
""") == "0", "start already at destination"

# Maximum-size input and all values equal.
n = 100000
maximum_case = (
    f"{n} 1 1 1\n"
    f"1 {n}\n"
    + " ".join(["42"] * n)
    + "\n"
)
assert run(maximum_case) == "1", "maximum-size all-equal case"

# Boundary case, destination is to the left and backward movement is cheaper.
assert run("""\
2 7 2 100
2 1
1 2
""") == "7", "reverse direction"

# Matching values at the two boundaries, catching indexing and teleport errors.
assert run("""\
3 10 10 2
1 3
5 1 5
""") == "2", "boundary teleport"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 5 7 3 / 2 2 / 1 2`|`0`| 最小尺寸和`u == v`|
 |`100000 1 1 1 / 1 100000 / all values 42`|`1`| 最大尺寸、所有相等值和压缩传送集线器 |
 |`2 7 2 100 / 2 1 / 1 2`|`7`| 目的地向左和不对称移动成本|
 |`3 10 10 2 / 1 3 / 5 1 5`|`2`| 在第一个和最后一个位置之间传送，包括边界索引 |

 ## 边缘情况

 当`u == v`，无论数组值或移动成本如何，最短路径的成本为零。 例如，```
2 5 7 3
2 2
1 2
```起始点和目标点均指位置`2`。 迪杰斯特拉开始于`dist[2] = 0`，立即弹出该目标，并打印`0`。 不需要传送或移动。 

当唯一有用的路线是穿过阵列的传送时，值集线器可以防止实现要求每对相等位置之间有明确的边缘。 为了```
3 10 10 2
1 3
5 1 5
```位置`1`进入价值枢纽`5`有成本`2`，轮毂到达位置`3`为了成本`0`。 答案是`2`，即使普通路线的成本`20`。 

当目标位于左侧时，算法必须使用后向成本而不是前向成本。 在```
2 7 2 100
2 1
1 2
```Dijkstra 起始位置`2`并放松姿势`1`有成本`L = 7`。 由于传送的成本要高得多，并且没有匹配的值可以提供帮助，因此最终答案是`7`。 

当每个位置具有相同的值时，显式传送构造将需要二次空间。 对于最大尺寸的情况`100000`相等的值和`C = 1`，压缩图仅包含一个值中心。 每个位置都连接到该单个集线器，因此位置`1`到达位置`100000`有成本`1`。 答案是`1`，并且图形的大小保持线性。 

第一个和最后一个位置也是普通的图顶点，因此在数组之外不会创建特殊的移动边。 该结构仅添加前缘`i < N`以及仅针对同一相邻对的后向边缘。 这避免了越界转换和将基于 1 的输入位置与基于 0 的 Python 索引混淆的常见离一错误。
