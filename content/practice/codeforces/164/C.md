---
title: "CF 164C - 机器编程"
description: "我们有几份工作，每份都有开始时间、持续时间和利润。 启动作业的机器在从 s 到 s + t - 1 的整个时间间隔内保持占用状态。最多可以同时运行 k 个作业，因为我们只拥有 k 台机器。 目标不是安排所有作业。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "flows", "graphs"]
categories: ["algorithms"]
codeforces_contest: 164
codeforces_index: "C"
codeforces_contest_name: "VK Cup 2012 Round 3"
rating: 2400
weight: 164
solve_time_s: 136
verified: true
draft: false
---

[CF 164C - 机器编程](https://codeforces.com/problemset/problem/164/C)

 **评分：** 2400
 **标签：** 流程、图表
 **求解时间：** 2m 16s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有几份工作，每份都有开始时间、持续时间和利润。 启动作业的机器在从`s`通过`s + t - 1`。 最多`k`工作可能会同时运行，因为我们只拥有`k`机器。 

目标不是安排所有作业。 我们可能会丢弃其中一些。 我们想要总利润最大但不超过的子集`k`任何时候都有重叠的工作。 

输出是一个二进制数组。 位置`i`等于`1`如果`i`选择了第 - 个工作并且`0`否则。 

这些约束完全塑造了解决方案。 最多有`1000`工作，它足够小，可以用于构建大约`O(n^2)`边缘，但对于指数搜索来说太大了。 机器数量最多为`50`，这表明某种流量或 DP 超过了有限的容量。 时间坐标到达`10^9`，因此迭代每个时刻是不可能的。 任何有效的解决方案都必须将时间线压缩到仅有意义的事件点。 

一个微妙的细节是区间定义。 一份工作占据`[s, s+t-1]`与之前开始的另一项工作冲突`s+t`。 例如：```
2 1
1 2 5
3 1 7
```第一份工作占用时间`1,2`。 第二个开始于`3`，因此它们不重叠，并且都可以选择。 使用闭区间的粗心实现`[s, s+t]`会错误地拒绝这一对。 

当多个作业共享相同的开始或结束时间时，会出现另一个容易出现的错误。```
3 1
1 2 5
1 1 4
2 1 4
```第一份工作占据`1,2`。 第二个占据`1`。 第三个占据`2`。 我们不能将第一个项目与任何一个较小的工作一起进行，但我们可以将第二个和第三个项目一起进行以获得总利润`8`。 任何排序不正确或不一致地处理相等坐标的实现都可能会意外地同时允许三个重叠作业`1`或者`2`。 

最后一个危险的情况是许多工作重叠但`k > 1`。```
4 2
1 5 10
2 3 8
3 2 7
4 1 6
```这里最多可以同时运行两个作业。 总是选择利润最高的非重叠工作的贪婪策略会失败，因为允许重叠达到容量上限`k`。 问题不是普通的加权间隔调度。 

## 方法

 蛮力的想法很简单。 我们尝试作业的每个子集，验证是否在任何时候都超过`k`工作重叠，保持最佳利润。 正确性是显而易见的，因为每个可能的答案都会被检查。 

问题在于搜索空间的大小。 和`n = 1000`，子集的数量是`2^1000`，这在天文数字上是不可能的。 即使只检查`2^40`子集已经远远超出了限制。 

更精致的暴力方向是间隔动态规划。 为了`k = 1`，问题就变成了经典的加权区间调度。 我们按完成时间对作业进行排序，并使用二分搜索将每个间隔连接到下一个兼容的间隔。 这给出了`O(n log n)`解决方案。 

障碍在于`k`可能超过`1`。 一旦允许多次重叠，状态就不再仅取决于最新选择的间隔。 不同的机器当前可能被在不同时刻结束的不同作业占用。 机器状态上的直接 DP 会发生组合爆炸。 

关键的观察结果是，该约束从根本上与一段时间内的容量有关。 任何时候，最多`k`乔布斯可能会经过那个点。 这正是自然的最小成本最大流量模型的结构。 

我们压缩所有不同的时间坐标。 在连续时间之间，我们创建具有容量的时间线边缘`k`。 发送一个单位的流量代表一台机器在时间上向前移动。 选择一项工作意味着通过一个特殊的边缘转移一个单位的流量，该边缘从开始时间跳到结束时间，同时收取利润。 

由于利润必须最大化，我们将其转换为负成本并计算最小成本流。 时间线边缘有成本`0`，而每个工作边缘都有成本`-c_i`。 流程可以随着时间的推移而闲置，也可以在有利的时候使用有利可图的工作边缘。 

这将调度约束转化为标准的流量守恒和边缘容量。 容量`k`在时间线边缘保证不超过`k`同时进行的工作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n * n^2) | O(2^n * n^2) | O(n) | 太慢了 |
 | 最优最小成本流程| O(n^3) | O(n^3) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 对于每个作业，计算其结束时刻：`e = s + t`。 

使用`s + t`而不是`s + t - 1`将占用区间转换为半开区间`[s, e)`。 当一项工作在另一项工作开始时间或之后开始时，两项工作完全兼容`e`。 
2. 收集所有不同的起点和终点坐标并对它们进行排序。 

实际数值可能大到`10^9`，但只有相对顺序才重要。 坐标压缩将图形大小减少到最多`2n`节点。 
3. 在压缩时间索引上构建有向图。 

如果压缩时间是`T[0], T[1], ..., T[m-1]`，创建边：`i -> i+1`有能力`k`和成本`0`。 

这些边缘代表机器在不执行工作的情况下随时间向前移动。 
4. 添加连接到第一个有容量的时间节点的源`k`，并将最后一个时间节点连接到具有容量的接收器`k`。 

这恰好创建了`k`可用机器流量的单位。 
5. 对于每个作业，从其压缩起始索引到其压缩结束索引添加一条边。 

边缘有：

 容量`1`成本`-profit`占据这个边缘意味着一台机器在其占用的时间间隔内执行该作业。 
6. 运行从源到接收器的最小成本最大流。 

流程自然决定了哪些工作优势足以有利可图。 
7. 恢复所选作业。 

每个工作边缘的能力变成`0`被流程充分利用，因此该作业属于最优调度。 

### 为什么它有效

 每个流量单位代表一台机器在时间上向前行驶。 时间线边缘保留最多的限制`k`同步机器，因为只有`k`单位可以跨越任何时间段。 

作业边缘从起始坐标到结束坐标占据一台机器。 由于该边缘绕过中间时间线边缘，因此机器无法同时执行另一个重叠作业。 

流程守恒保证每台机器都遵循有效的作业时间顺序。 总流动成本等于所选工作的负总利润。 成本最小化就等于利润最大化。 

因为所有容量和成本都精确地编码了调度约束和目标，所以每个可行流对应于具有相同利润的有效调度，并且每个有效调度对应于可行流。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

INF = 10**18

class Edge:
    def __init__(self, to, rev, cap, cost):
        self.to = to
        self.rev = rev
        self.cap = cap
        self.cost = cost

class MinCostFlow:
    def __init__(self, n):
        self.n = n
        self.g = [[] for _ in range(n)]

    def add_edge(self, fr, to, cap, cost):
        fwd = Edge(to, len(self.g[to]), cap, cost)
        rev = Edge(fr, len(self.g[fr]), 0, -cost)
        self.g[fr].append(fwd)
        self.g[to].append(rev)

    def min_cost_flow(self, s, t, maxf):
        n = self.n
        flow = 0
        cost = 0

        potential = [0] * n

        while flow < maxf:
            dist = [INF] * n
            parent_v = [-1] * n
            parent_e = [-1] * n

            dist[s] = 0

            inq = [False] * n
            q = deque([s])
            inq[s] = True

            while q:
                v = q.popleft()
                inq[v] = False

                for i, e in enumerate(self.g[v]):
                    if e.cap <= 0:
                        continue

                    nd = dist[v] + e.cost + potential[v] - potential[e.to]

                    if nd < dist[e.to]:
                        dist[e.to] = nd
                        parent_v[e.to] = v
                        parent_e[e.to] = i

                        if not inq[e.to]:
                            inq[e.to] = True
                            q.append(e.to)

            if dist[t] == INF:
                break

            for v in range(n):
                if dist[v] < INF:
                    potential[v] += dist[v]

            addf = maxf - flow
            v = t

            while v != s:
                pv = parent_v[v]
                pe = parent_e[v]
                addf = min(addf, self.g[pv][pe].cap)
                v = pv

            v = t

            while v != s:
                pv = parent_v[v]
                pe = parent_e[v]
                e = self.g[pv][pe]

                e.cap -= addf
                self.g[v][e.rev].cap += addf

                cost += addf * e.cost
                v = pv

            flow += addf

        return flow, cost

def solve():
    n, k = map(int, input().split())

    jobs = []
    coords = []

    for i in range(n):
        s, t, c = map(int, input().split())
        e = s + t

        jobs.append((s, e, c, i))

        coords.append(s)
        coords.append(e)

    coords = sorted(set(coords))
    idx = {x: i for i, x in enumerate(coords)}

    m = len(coords)

    SRC = m
    SNK = m + 1

    mcmf = MinCostFlow(m + 2)

    mcmf.add_edge(SRC, 0, k, 0)

    for i in range(m - 1):
        mcmf.add_edge(i, i + 1, k, 0)

    mcmf.add_edge(m - 1, SNK, k, 0)

    job_edges = [None] * n

    for s, e, c, original_idx in jobs:
        u = idx[s]
        v = idx[e]

        edge_index = len(mcmf.g[u])

        mcmf.add_edge(u, v, 1, -c)

        job_edges[original_idx] = (u, edge_index)

    mcmf.min_cost_flow(SRC, SNK, k)

    ans = [0] * n

    for i in range(n):
        u, ei = job_edges[i]
        e = mcmf.g[u][ei]

        if e.cap == 0:
            ans[i] = 1

    print(*ans)

if __name__ == "__main__":
    solve()
```该图对于每个压缩时间坐标包含一个节点。 时间线边缘连接连续的坐标并最多携带`k`机器前进。 

最重要的实现细节是区间转换。 原始区间两端均包含在内，`[s, s+t-1]`。 将其转换为`[s, s+t)`避免了差一问题并使兼容性检查更加清晰。 

每个作业边缘存储容量`1`。 流程结束后，已使用的边有剩余容量`0`。 这就是所选择的工作的重建方式。 

最短路径计算使用具有潜力的降低成本。 成本可能为负，因为有利可图的工作具有负边缘权重。 潜力保证每次增强后非负降低成本。 

另一个微妙的细节是我们准确发送`k`流量单位，即使某些机器处于闲置状态。 空闲机器只需以零成本遍历时间线边缘。 

## 工作示例

 ### 示例 1

 输入：```
3 1
2 7 5
1 3 3
4 1 3
```间隔变为：

 | 工作 | 间隔| 利润|
 | ---| ---| ---|
 | 1 | [2, 9) | 5 |
 | 2 | [1, 4) | 3 |
 | 3 | [4, 5) | 3 |

 压缩坐标：

 | 索引 | 时间 |
 | ---| ---|
 | 0 | 1 |
 | 1 | 2 |
 | 2 | 4 |
 | 3 | 5 |
 | 4 | 9 |

 工作边缘：

 | 工作 | 边缘 |
 | ---| ---|
 | 1 | 1 -> 4 |
 | 2 | 0 -> 2 |
 | 3 | 2 -> 3 | 2 -> 3 |

 最优流路为：

 | 步骤| 边缘使用| 总利润|
 | ---| ---| ---|
 | 1 | 工作 2 | 3 |
 | 2 | 工作 3 | 6 |

 单独选择工作 1 即可获得利润`5`，因此流程更喜欢作业 2 和 3。 

该跟踪演示了顺序兼容作业如何通过时间线边缘自然地链接在一起。 

### 示例 2

 输入：```
4 2
1 5 10
2 3 8
3 2 7
4 1 6
```转换后的间隔：

 | 工作 | 间隔| 利润|
 | ---| ---| ---|
 | 1 | [1, 6) | 10 | 10
 | 2 | [2, 5) | 8 |
 | 3 | [3, 5) | 7 |
 | 4 | [4, 5) | 6 |

 在时间范围内`[4,5)`，四个作业重叠，但只有两台机器存在。 

流程选择：

 | 机器| 工作机会 |
 | ---| ---|
 | 1 | 工作 1 |
 | 2 | 工作 2 |

 总利润变为`18`。 

轨迹显示容量如何`k=2`由时间线边缘容量自动强制执行。 同一时间段内不能有超过两个流量单位。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n^3) | O(n^3) | 该图具有 O(n) 个节点和 O(n) 个边，并且最小成本流使用最短路径执行最多 k 次增强 |
 | 空间| O(n^2) | O(n^2) | 残差图存储|

 和`n <= 1000`，这完全符合限制。 该图仅包含几千条边，并且`k <= 50`，因此增强的数量很少。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    from collections import deque

    input_data = io.StringIO(inp)
    output_data = io.StringIO()

    input = input_data.readline

    INF = 10**18

    class Edge:
        def __init__(self, to, rev, cap, cost):
            self.to = to
            self.rev = rev
            self.cap = cap
            self.cost = cost

    class MinCostFlow:
        def __init__(self, n):
            self.n = n
            self.g = [[] for _ in range(n)]

        def add_edge(self, fr, to, cap, cost):
            fwd = Edge(to, len(self.g[to]), cap, cost)
            rev = Edge(fr, len(self.g[fr]), 0, -cost)
            self.g[fr].append(fwd)
            self.g[to].append(rev)

        def min_cost_flow(self, s, t, maxf):
            n = self.n
            flow = 0
            potential = [0] * n

            while flow < maxf:
                dist = [INF] * n
                pv = [-1] * n
                pe = [-1] * n

                dist[s] = 0

                q = deque([s])
                inq = [False] * n
                inq[s] = True

                while q:
                    v = q.popleft()
                    inq[v] = False

                    for i, e in enumerate(self.g[v]):
                        if e.cap <= 0:
                            continue

                        nd = dist[v] + e.cost + potential[v] - potential[e.to]

                        if nd < dist[e.to]:
                            dist[e.to] = nd
                            pv[e.to] = v
                            pe[e.to] = i

                            if not inq[e.to]:
                                inq[e.to] = True
                                q.append(e.to)

                if dist[t] == INF:
                    break

                for i in range(n):
                    if dist[i] < INF:
                        potential[i] += dist[i]

                addf = maxf - flow
                v = t

                while v != s:
                    addf = min(addf, self.g[pv[v]][pe[v]].cap)
                    v = pv[v]

                v = t

                while v != s:
                    e = self.g[pv[v]][pe[v]]
                    e.cap -= addf
                    self.g[v][e.rev].cap += addf
                    v = pv[v]

                flow += addf

    n, k = map(int, input().split())

    jobs = []
    coords = []

    for i in range(n):
        s, t, c = map(int, input().split())
        e = s + t
        jobs.append((s, e, c, i))
        coords.extend([s, e])

    coords = sorted(set(coords))
    idx = {x: i for i, x in enumerate(coords)}

    m = len(coords)

    SRC = m
    SNK = m + 1

    mcf = MinCostFlow(m + 2)

    mcf.add_edge(SRC, 0, k, 0)

    for i in range(m - 1):
        mcf.add_edge(i, i + 1, k, 0)

    mcf.add_edge(m - 1, SNK, k, 0)

    pos = [None] * n

    for s, e, c, i in jobs:
        u = idx[s]
        v = idx[e]

        edge_id = len(mcf.g[u])

        mcf.add_edge(u, v, 1, -c)

        pos[i] = (u, edge_id)

    mcf.min_cost_flow(SRC, SNK, k)

    ans = []

    for i in range(n):
        u, ei = pos[i]
        ans.append("1" if mcf.g[u][ei].cap == 0 else "0")

    return " ".join(ans)

# provided sample
assert run(
"""3 1
2 7 5
1 3 3
4 1 3
"""
) == "0 1 1"

# minimum size
assert run(
"""1 1
1 1 10
"""
) == "1"

# overlapping jobs, only one machine
assert run(
"""2 1
1 5 10
2 3 9
"""
) == "1 0"

# touching intervals should both work
assert run(
"""2 1
1 2 5
3 1 6
"""
) == "1 1"

# two machines allow overlap
assert run(
"""3 2
1 5 10
2 3 9
3 2 8
"""
) == "1 1 0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单身工作|`1`| 最小尺寸边界 |
 | k=1 的两个重叠作业 |`1 0`| 容量限制|
 | 触摸间隔|`1 1`| 正确的半开区间处理 |
 | k=2 | 严重重叠`1 1 0`| 多台同步机器 |

 ## 边缘情况

 考虑间隔仅在端点处接触的作业。```
2 1
1 2 5
3 1 6
```间隔变为`[1,3)`和`[3,4)`。 它们的压缩边缘连续连接，没有重叠。 一个流动单元可以依次遍历两个作业边缘，因此两个作业都被选择。 

现在考虑相同的开始时间。```
3 1
1 5 10
1 1 4
2 1 4
```第一份工作占据`[1,6)`。 另外两个占据`[1,2)`和`[2,3)`。 由于只有一台机器存在，流不能同时使用大间隔边缘和小间隔链。 较小的链条产生利润`8`，而长期工作会产生`10`，因此算法仅正确选择第一个作业。 

最后，考虑多台机器。```
4 2
1 5 10
2 3 8
3 2 7
4 1 6
```所有四项工作在时间上重叠`4`，但时间线边缘有容量`2`。 最多两个流动单元可以穿过该段，因此残差图实际上防止选择两个以上的重叠作业。 由此产生的时间表在施工中始终是可行的。
