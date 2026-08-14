---
title: "CF 102341H - 催眠"
description: "我们有一个连通的无向图，包含多达 200,000 个交叉路口和 200,000 条道路。 我们从顶点 1 开始，想要到达顶点 n。 穿过一条路需要一分钟，但每条路都隐藏着两种催眠术中的一种。"
date: "2026-08-14T05:10:54+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102341
codeforces_index: "H"
codeforces_contest_name: "Radewoosh+mnbvmar Contest (supported by AIM Tech)"
rating: 0
weight: 102341
solve_time_s: 158
verified: true
draft: false
---

[CF 102341H - 催眠](https://codeforces.com/problemset/problem/102341/H)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 38s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个连通的无向图，包含多达 200,000 个交叉路口和 200,000 条道路。 我们从顶点 1 开始，想要到达顶点 n。 穿过一条路需要一分钟，但每条路都隐藏着两种催眠术中的一种。 Hypno 对我们无害的概率为 1/2，在这种情况下每次遍历都会成功。 概率为 1/2 时，它是有害的，在这种情况下，每次遍历都会以 1/2 的概率独立成功。 

在使用之前我们并不知道道路的类型。 失败的遍历是特别有价值的信息：它证明该路是有害的。 成功的遍历并不能完全识别 Hypno，但是当我们从新的顶点继续时，到目前为止获得的信息足以使自适应策略发挥作用。 

任务是计算从顶点 1 到顶点 n 的最小可能预期行程时间。 要求的绝对或相对误差最多为10^-9。 

这些约束排除了重复检查图的大部分的算法。 对于 200,000 个顶点和 200,000 个边，O(nm) 方法在最坏的情况下可以执行大约 4 * 10^10 邻接操作，这远远超出了两秒的限制。 我们基本上需要线性或 O((n + m) log n) 工作。 

第一个小边缘情况是只有两个顶点的图。```
2 1
1 2
```答案是1.5。 如果粗心的解决方案将每条路都视为预期遍历时间为 2，则会输出 2，而忘记了 1/2 的免疫概率。 

第二个边缘情况是通往目的地的直接道路以及不相关的替代方案。```
3 2
1 3
1 2
```答案还是1.5。 可以使用第一条道路到达目的地，因此有关顶点 2 的信息是不相关的。 对所有外出道路进行平均而不是优化的解决方案可能会产生更差的值。 

有趣的边缘情况是几个同样好的替代方案。 在图中```
4 4
1 2
2 4
1 3
3 4
```每条两条边路线本身的预期成本为 3，但最佳答案为 2.875。 在一条路线第一次尝试失败后，尝试另一条路线可能比立即重试已知的坏路更好。 为每条道路分配固定成本 1.5 并简单地运行普通最短路径的解决方案因此错过了中心观察结果。 

## 方法

 直接的暴力方法将为每个顶点保留所有已发现的相邻顶点的距离，并在每次另一个邻居可用时重新计算最佳局部策略。 为了评估本地策略，我们对已知的邻居值进行排序并检查可能有用的前缀。 这是正确的，因为邻居是按照其最佳连续值的升序来考虑的。 

问题在于，每次更新后进行完整扫描可能会多次检查相同的邻接列表。 对于度数为 d 的顶点，这可能需要 O(d^2)，并且在整个图上最坏的情况是 O(m^2)。 当 m = 200,000 时，可以达到大约 4 * 10^10 邻接检查。 

关键的观察结果是，如果我们从目的地开始使用 Dijkstra 算法处理图，则邻居将按照其最佳值的升序排列而已知。 一旦知道顶点的第一个有用邻居，每个后来的邻居都会按照其距离的非递减顺序到达。 我们可以增量更新期望值，而不是重新计算整个前缀。 

考虑一个顶点 u，其最佳邻居具有最佳连续值 x。 假设我们已经在从 u 出发的 k 条新道路上失败了。 第一条失败的道路是最有名的后路，现在也知道它是有害的。 从该点穿过该路预计还需要两分钟，之后继续行驶的成本为 x。 

在考虑另一条具有连续值 y 的新道路之前，后备成本为 2 + x。 尝试新道路立即花费一分钟。 它以 3/4 的概率成功，给出延拓 y。 失败的概率为 1/4，之后回退成本为 2 + x。 因此尝试这条额外道路的预期成本是

 1 + 3/4 y + 1/4(2 + x)。 

尝试它在什么时候很有用

 1 + 3/4 y + 1/4(2 + x) < 2 + x，

 这简化为

 y < x + 2/3。 

这个阈值是算法可以在距离变得太大时永久停止处理邻居的原因。 

对于第一条路，成功穿越的概率是3/4，因为我们要么免疫，要么易受影响，而随机端点是相反的。 如果失败（发生的概率为 1/4），则已知该道路是有害的。 

如果有用邻居的值为 x1, x2, ..., xk 按升序排列，则期望值为

 E_k = Σ 从 (1/4)^(i-1) * (3/4) * (i + x_i) 的 i=1 到 k
 + (1/4)^k * (k + 2 + x_1)。 

重要的是E_k可以在常数时间内更新。 从 E_1 = 1.5 + x_1 开始，添加 x_k 将答案更改为

 (1/4)^(k-1) * (3/4 * (x_k - x_1) - 1/2)。 

因此，当 Dijkstra 确定其端点时，每条边只需处理一次。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(平方米) | O(n + m) | 太慢了|
 | 最佳| O((n + m) log n) | O((n + m) log n) | O(n + m) | 已接受 |

 ## 算法演练

 1. 反转视角，从顶点n开始运行Dijkstra。 为顶点存储的值将表示从该顶点到 n 的最小预期剩余时间。 

该图是无向的，因此不需要物理地改变边。 我们简单地用距离零初始化 n 并将信息传播到它的邻居。 

1.对于每个顶点u，维持最小的最终邻居距离`first[u]`。 在第一个邻居确定之前，u没有候选策略。 

当距离 d 的第一个邻居 v 确定后，当前已知的最佳策略是使用该道路，直到成功为止。 一条新路预计需要 1.5 分钟，所以我们设定`value[u] = d + 1.5`。 

1. 第一个邻居处理完后，维持概率`p`在之前所有有用的新道路都失败后到达下一条新道路。 

每条新道路以 1/4 的概率失败，因此在处理 k 条有用的道路后，该概率为`(1/4)^k`。 

1. 当另一个距离为 d 的邻居确定后，将其与`first[u]`。 

如果`d >= first[u] + 2/3`，它永远无法改进策略。 所有随后确定的邻居的距离至少为 d，因此它们也无法改进它。 我们可以停止处理 u 的邻居。 

如果`d < first[u] + 2/3`，将其纳入策略中。 当前期望值变化`p * (0.75 * (d - first[u]) - 0.5)`。 

然后将 p 乘以 1/4，因为到达下一条新路需要再次失败。 

1. 每次u的当前值提高时，插入新的对`(value[u], u)`进入优先队列。 

同一顶点可能存在多个条目。 当弹出条目时，如果它不再等于当前最佳值，则将其丢弃。 这是 Dijkstra 实现中使用的标准延迟删除技术。 

1. 一旦顶点 1 确定，它的值就是答案。 

Dijkstra 排序是有效的，因为顶点的有用邻居满足`d < first[u] + 2/3`。 

u 的当前值始终大于`first[u] + 2/3`，因此每个有用的邻居必须在 u 本身被最终确定之前被最终确定。 因此，当 u 离开优先级队列时，每个可以改进其答案的邻居都已被合并。 

### 为什么它有效

 对于固定顶点 u，最优策略按其最优连续值的非递减顺序考虑候选邻居。 在第一条失败的道路之后，该道路将成为已知的有害回退，预计剩余穿越时间为 2。当新道路的连续值小于`first[u] + 2/3`，因此有用的邻居形成了 Dijkstra 阶的前缀。 

维护的值正是尝试该前缀然后在每次新尝试失败时重复使用第一条失败道路的预期成本。 增量公式在代数上等价于完全期望公式，因此每次更新都会保留所有当前可用的有用邻居中的确切最优值。 

由于每个潜在有用的邻居的距离都小于 u 处的值，因此所有此类邻居都会在 u 之前确定。 因此，当 Dijkstra 最终确定 u 时，未来的邻居都无法提高其值。 这给出了与普通 Dijkstra 相同的正确性不变性：最小的未最终值已经是最优的。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    graph = [[] for _ in range(n)]

    for _ in range(m):
        a, b = map(int, input().split())
        a -= 1
        b -= 1
        graph[a].append(b)
        graph[b].append(a)

    INF = float("inf")

    dist = [INF] * n

    # first[u] is the smallest finalized neighbor distance.
    first = [INF] * n

    # value[u] is the best expected value currently known for u.
    value = [INF] * n

    # prob[u] is the probability of reaching the next fresh edge
    # after all currently useful edges have failed.
    prob = [0.0] * n

    # Whether we have already found the first neighbor.
    seen = [False] * n

    pq = [(0.0, n - 1)]
    dist[n - 1] = 0.0

    while pq:
        cur, u = heapq.heappop(pq)

        if cur != dist[u]:
            continue

        if u == 0:
            print(f"{cur:.12f}")
            return

        du = cur

        for v in graph[u]:
            d = du

            if not seen[v]:
                seen[v] = True
                first[v] = d

                # One fresh edge has expected traversal cost 3/2.
                value[v] = d + 1.5

                # To reach the second fresh edge, the first one
                # must have failed, which happens with probability 1/4.
                prob[v] = 0.25

                if value[v] < dist[v]:
                    dist[v] = value[v]
                    heapq.heappush(pq, (dist[v], v))

            else:
                # Later neighbors are processed in nondecreasing d.
                # Once this threshold fails, no later neighbor can help.
                if d >= first[v] + 2.0 / 3.0:
                    continue

                # Add this neighbor to the useful prefix.
                value[v] += prob[v] * (
                    0.75 * (d - first[v]) - 0.5
                )

                prob[v] *= 0.25

                if value[v] < dist[v]:
                    dist[v] = value[v]
                    heapq.heappush(pq, (dist[v], v))

if __name__ == "__main__":
    solve()
```邻接表以通常的方式存储无向图。 无需构建单独的反向图，因为每条道路都是双向的。`dist`是 Dijkstra 值。`value`存储增量局部表达式，同时`first`记住迄今为止处理的邻居中的最佳连续值。`prob`存储到达下一条未使用道路的概率。 

第一个邻居需要特殊处理。 它的道路是新鲜的，所以它的无条件预期穿越时间是3/2。 第一次尝试失败的概率是 1/4，这成为到达第二条新道路的概率。 

对于每个后来的邻居，表达式```
prob[v] * (0.75 * (d - first[v]) - 0.5)
```正是由于将该邻居添加到有用前缀而引起的预期值的变化。 

阈值使用`2.0 / 3.0`， 不是`1.0 / 2.0`。 这是错误实现的常见地方。 新的道路尝试本身总是花费一分钟，然后以 3/4 的概率成功，并以 1/4 的概率失败。 比较这两种策略得出 2/3 阈值。 

浮点在这里就足够了。 乘数`prob`每增加一个有用的邻居，就会减少四倍，因此在只有几十个有用的邻居之后，其贡献就远远低于所需的 10^-9 精度。 Python整数不参与数值循环，因此不存在整数溢出问题。 

优先级队列采用惰性删除。 顶点在最终确定之前可以接收多个逐渐更好的估计。 仅匹配当前条目的条目`dist[u]`已处理。 

## 工作示例

 ### 示例 1

 该图是一个三角形，顶点 3 是目的地。```
3 3
1 2
1 3
2 3
```从顶点 3 开始，顶点 1 和 2 的连续值最初都为零。 

| 最终确定的顶点 | 邻居更新 | 第一个值 | 当前值|
 | --- | --- | --- | --- |
 | 3 | 1 | 0 | 1.500000 |
 | 3 | 2 | 0 | 1.500000 |

 顶点 1 接收到目的地的直接边，给出 1.5。 另一条边无法改进它，因为它的连续值也为零，但在另一个有用的更新发挥作用之前该顶点已经完成。 

因此答案是 1.500000000000。 

该跟踪说明了为什么一条新道路的预期成本为 1.5。 第一次尝试成功的概率为 3/4。 如果失败，则已知该道路有害，并且剩余的预期尝试次数为两次，从而在该道路有害的情况下总预期时间为 2。 

### 示例 2

 该图是```
4 4
1 2
2 4
4 3
3 1
```与目的地 4.

 顶点 2 和 3 各有一条通往目的地的新道路，因此两者都获得值 1.5。 

| 最终确定的顶点 | 更新的顶点 | 第一个值 | 添加邻居 | 新价值|
 | --- | --- | --- | --- | --- |
 | 4 | 2 | 1.500000 | 无 | 1.500000 |
 | 4 | 3 | 1.500000 | 无 | 1.500000 |
 | 2 | 1 | 1.500000 | 无 | 3.000000 |
 | 3 | 1 | 1.500000 | 1.500000 | 2.875000 |

 对于顶点 1，仅使用顶点 2 给出 3。然而，在通往顶点 2 的道路失败后，通过顶点 3 的另一条路线值得尝试，因为它的连续值等于第一条路线的值，并且低于第一条路线的值。`first + 2/3`临界点。 

第二次尝试的成功概率为 1/4。 它的包含将值从 3 减少到 2.875，给出了所需的示例答案。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) log n) | O((n + m) log n) | 每个邻接都被处理一次，并且每个有用的值更新都被插入到二进制堆中 |
 | 空间| O(n + m) | 邻接表、距离数组和优先级队列需要线性空间 |

 该图最多包含 200,000 条边，因此该算法仅执行 O(m) 局部边处理和 O(m) 堆插入。 生成的 O((n + m) log n) 复杂度很容易适合所述约束，而内存使用量与图大小呈线性关系。 

## 测试用例```python
import io
import heapq
import math

def run(inp: str) -> str:
    data = inp.strip().split()
    it = iter(data)

    n = int(next(it))
    m = int(next(it))

    graph = [[] for _ in range(n)]

    for _ in range(m):
        a = int(next(it)) - 1
        b = int(next(it)) - 1
        graph[a].append(b)
        graph[b].append(a)

    INF = float("inf")
    dist = [INF] * n
    first = [INF] * n
    value = [INF] * n
    prob = [0.0] * n
    seen = [False] * n

    pq = [(0.0, n - 1)]
    dist[n - 1] = 0.0

    while pq:
        cur, u = heapq.heappop(pq)

        if cur != dist[u]:
            continue

        if u == 0:
            return f"{cur:.12f}"

        for v in graph[u]:
            d = cur

            if not seen[v]:
                seen[v] = True
                first[v] = d
                value[v] = d + 1.5
                prob[v] = 0.25

                if value[v] < dist[v]:
                    dist[v] = value[v]
                    heapq.heappush(pq, (value[v], v))
            else:
                if d >= first[v] + 2.0 / 3.0:
                    continue

                value[v] += prob[v] * (
                    0.75 * (d - first[v]) - 0.5
                )
                prob[v] *= 0.25

                if value[v] < dist[v]:
                    dist[v] = value[v]
                    heapq.heappush(pq, (value[v], v))

    return ""

def check(inp: str, expected: float, message: str):
    actual = float(run(inp))
    assert math.isclose(actual, expected, rel_tol=1e-10, abs_tol=1e-10), (
        message, actual, expected
    )

# Sample 1
check(
    """\
3 3
1 2
1 3
2 3
""",
    1.5,
    "sample 1",
)

# Sample 2
check(
    """\
4 4
1 2
2 4
4 3
3 1
""",
    2.875,
    "sample 2",
)

# Minimum-size graph
check(
    """\
2 1
1 2
""",
    1.5,
    "minimum graph",
)

# A simple chain of three vertices.
# Each of the two roads has expected cost 1.5.
check(
    """\
3 2
1 2
2 3
""",
    3.0,
    "simple chain",
)

# Three equally good two-edge routes.
# The useful values at vertex 1 are 1.5, 1.5, 1.5.
# E1 = 3
# E2 = 2.875
# E3 = 2.84375
check(
    """\
5 6
1 2
2 5
1 3
3 5
1 4
4 5
""",
    2.84375,
    "three equal alternatives",
)

# Large boundary case: a chain with 200000 vertices.
# There are 199999 roads, each contributing 1.5 in expectation.
n = 200000
parts = [f"{n} {n - 1}"]
for i in range(1, n):
    parts.append(f"{i} {i + 1}")

large_input = "\n".join(parts) + "\n"
check(
    large_input,
    1.5 * (n - 1),
    "maximum-size chain",
)
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 1 / 1 2`|`1.500000000000`| 最小图和基本 3/4 成功概率 |
 |`3 2 / 1 2 / 2 3`|`3.000000000000`| 没有替代路线的图表|
 | 通过顶点 2、3、4 的三个平行两条边路线 |`2.843750000000`| 几个同等有用的邻居和重复的增量更新 |
 | 具有 200,000 个顶点的链 |`299998.500000000000`| 最大输入大小和线性图结构 |

 ## 边缘情况

 对于二顶点图```
2 1
1 2
```Dijkstra 从顶点 2 开始，值为零。 当顶点 2 完成后，顶点 1 接收其第一个邻居`first[1] = 0`。 其候选值变为`0 + 1.5 = 1.5`。 不存在第二个邻居，因此答案恰好是 1.5。 

对于包含直接目标边的图，```
3 2
1 3
1 2
```顶点 3 首先被确定。 直接边为顶点 1 指定的值为 1.5。 即使顶点 2 最终也将被处理，但它的距离无法提供比已最终确定的直接目的地边更好的路线。 答案仍然是1.5。 

对于具有三个相等替代方案的图，```
5 6
1 2
2 5
1 3
3 5
1 4
4 5
```顶点 2、3 和 4 都从顶点 5 接收值 1.5。第一个这样的邻居将值 3 赋予顶点 1。第二个邻居将其更改为`(1/4) * (-1/2) = -1/8`,

 给出 2.875。 第三个将其更改为`(1/16) * (-1/2) = -1/32`,

 给出 2.84375。 第四个相同的替代方案只会将其提高 1/128，依此类推。 几何概率因子正是使增量表示高效的原因。 

对于下一个邻居至少有距离的顶点`first + 2/3`，算法会忽略它。 假设最知名的邻居的值为 x，新邻居的值为 y。 如果`y >= x + 2/3`，尝试新道路的成本至少与立即使用已知有害道路的成本相同。 由于所有未来的邻居都有更大的最终值，因此它们也都没有用处。 这是防止重复扫描同一邻接表的停止条件。 

对于最大尺寸链，每个顶点只有一个朝向目的地的有用邻居。 没有考虑替代道路，因此每条边对预期时间的贡献正好为 1.5。 有 199,999 条道路，结果是`199999 * 1.5 = 299998.5`。 该算法对每条边处理一次并保持在 O((n + m) log n) 时间内。
