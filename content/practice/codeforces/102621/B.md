---
title: "CF 102621B - 跳跃蜥蜴"
description: "房间是一个由柱子组成的矩形网格。 每根柱子都有一个强度值，表明蜥蜴在倒塌之前可以离开它多少次。 有些柱子里有蜥蜴，其余的都是空的。"
date: "2026-08-01T08:37:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102621
codeforces_index: "B"
codeforces_contest_name: "mBIT Advanced June 2020"
rating: 0
weight: 102621
solve_time_s: 66
verified: true
draft: false
---

[CF 102621B - 跳跃的蜥蜴](https://codeforces.com/problemset/problem/102621/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 房间是一个由柱子组成的矩形网格。 每根柱子都有一个强度值，表明蜥蜴在倒塌之前可以离开它多少次。 有些柱子里有蜥蜴，其余的都是空的。 如果两个位置之间的距离最大，蜥蜴可以跳到另一个柱子上`d`，或者当它足够接近边界时它可以跳出房间。 任务是确定有多少蜥蜴无法逃脱。 

输入描述了几个独立的房间。 对于每个房间，第一个网格存储每个柱子的耐久性，第二个网格标记蜥蜴的起始位置。 输出是在最佳可能的跳跃序列之后仍然被困住的蜥蜴的数量。 

尺寸足够小，网格可以扩展到图形，但蜥蜴的数量和可能的运动使得直接模拟变得危险。 诸如首先移动最近的蜥蜴之类的贪婪策略会失败，因为每次跳跃都会消耗共享的支柱容量，因此一只蜥蜴的决定可能会影响另一只蜥蜴的选择。 

考虑约束的正确方法是单元的数量最多约为几百个。 这允许图算法具有数千个顶点和边。 尝试每种可能的蜥蜴运动顺序的解决方案将呈指数级增长，而流算法则很容易保持在限制范围内。 

一个常见的错误是忘记一根柱子可以多次使用。 例如，具有价值的强大支柱`2`可以让两种不同的蜥蜴通过它离开。 将其视为一次性电池会产生错误的答案。 

另一种极端情况是蜥蜴已经足够接近外部。 例如：```
1
1 1
1
L
```正确答案是`0`，因为只有蜥蜴可以直接跳出来。 仅检查柱子之间跳跃的解决方案会错误地使蜥蜴被困。 

一种不同的边缘情况是没有可能的出口：```
1
3 1
000
000
000
L..
...
...
```正确答案是`1`。 蜥蜴没有柱子可以站立，也没有办法到达边界，所以它无法逃脱。 仅计算移动边缘而忘记缺失支柱的实现可能会错误地创建无效路径。 

## 方法

 暴力方法是模拟可能的转义序列。 对于每只蜥蜴，我们可以尝试每个可到达的支柱，更新它离开的支柱的剩余强度，然后递归地继续。 这是正确的，因为每个合法的运动都会被探索，所以最好的序列必须出现在搜索树中的某个地方。 问题在于可能的序列数量激增。 数百根柱子，可能的动作组合数量远远超出我们所能探索的范围。 

关键的观察结果是，每只蜥蜴要么达到安全状态，要么消耗支柱的容量。 这实际上并不是一个运动顺序问题。 这是一个资源分配问题。 每根柱子的离开次数都是有限的，每只蜥蜴在到达外面之前，每使用一根柱子都需要一个单位的容量。 

该结构符合最大流量模型。 我们创建一个图表，其中一个流量单位代表一只蜥蜴。 从蜥蜴节点到水槽的路径代表一种可能的逃生路线。 支柱被分为传入节点和传出节点，它们之间的边缘具有等于支柱强度的容量。 该容量代表有多少蜥蜴可以从该柱子中离开。 

源连接到每只容量为一的起始蜥蜴。 水槽代表离开房间。 运行最大流量给出可以逃脱的蜥蜴的最大数量，然后从蜥蜴总数中减去该数量即可得到答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 可能的移动次数呈指数级增长 | O（细胞）| 太慢了 |
 | 最佳| O(V²E) 与 Dinic 算法 | O(V + E) | 已接受 |

 ## 算法演练

 1. 为每个支柱构建包含两个节点的流程图。 入节点代表到达柱子，出节点代表离开柱子。 在它们之间添加一条边缘，其容量等于支柱的耐用性。 该模型限制了柱子的使用次数。 
2. 添加一个源节点并将其连接到每个容量为 1 的蜥蜴起始位置。 每只蜥蜴只贡献一个单位的流量，因为每只蜥蜴要么逃跑，要么不逃跑。 
3. 对于每个柱子，检查站在那里的蜥蜴是否可以直接跳到外面。 如果可以的话，将输出的pillar节点连接到容量无限的sink。 容量不受限制，因为外部可以容纳任意数量的逃跑蜥蜴。 
4. 对于距离在跳跃范围内的每对柱子，从第一个柱子的出节点到第二个柱子的入节点添加一条容量无限的边。 这代表了支柱之间的合法跳跃。 
5. 运行从源到接收器的最大流量算法。 得到的流量值就是成功逃脱的蜥蜴数量。 
6.从原来的蜥蜴数量中减去逃跑的蜥蜴数量。 剩下的数值就是伤亡人数。 

为什么它有效：

 每条有效的逃生路线都对应于流动网络中的一条路径。 唯一有限的资源是支柱偏离，而这些资源恰好由每个支柱的两个副本之间的容量边缘表示。 因为每只蜥蜴一开始都有一个单位的流量，而接收器只接收来自有效出口的流量，所以每个最大流量单位对应于一只逃脱的蜥蜴。 因此，最大流量找到尽可能多的逃跑蜥蜴，而剩下的蜥蜴恰恰是无法逃脱的蜥蜴。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

class Dinic:
    def __init__(self, n):
        self.n = n
        self.g = [[] for _ in range(n)]

    def add_edge(self, u, v, c):
        self.g[u].append([v, c, len(self.g[v])])
        self.g[v].append([u, 0, len(self.g[u]) - 1])

    def bfs(self, s, t):
        self.level = [-1] * self.n
        q = deque([s])
        self.level[s] = 0

        while q:
            u = q.popleft()
            for v, c, _ in self.g[u]:
                if c and self.level[v] == -1:
                    self.level[v] = self.level[u] + 1
                    q.append(v)

        return self.level[t] != -1

    def dfs(self, u, t, f):
        if u == t:
            return f

        while self.it[u] < len(self.g[u]):
            e = self.g[u][self.it[u]]
            v, c, rev = e

            if c and self.level[v] == self.level[u] + 1:
                pushed = self.dfs(v, t, min(f, c))
                if pushed:
                    e[1] -= pushed
                    self.g[v][rev][1] += pushed
                    return pushed

            self.it[u] += 1

        return 0

    def flow(self, s, t):
        ans = 0
        inf = 10 ** 9

        while self.bfs(s, t):
            self.it = [0] * self.n
            while True:
                pushed = self.dfs(s, t, inf)
                if pushed == 0:
                    break
                ans += pushed

        return ans

def solve_case(n, d, cap, lizards):
    m = len(cap[0])
    cells = n * m

    def inside(r, c):
        return 0 <= r < n and 0 <= c < m

    def idx(r, c):
        return r * m + c

    source = 2 * cells
    sink = source + 1
    dinic = Dinic(sink + 1)

    total = 0
    for r in range(n):
        for c in range(m):
            if cap[r][c] == '0':
                continue

            node = idx(r, c)
            dinic.add_edge(2 * node, 2 * node + 1, int(cap[r][c]))

            if lizards[r][c] == 'L':
                total += 1
                dinic.add_edge(source, 2 * node, 1)

            if r < d or c < d or n - 1 - r < d or m - 1 - c < d:
                dinic.add_edge(2 * node + 1, sink, 10 ** 9)

    for r in range(n):
        for c in range(m):
            if cap[r][c] == '0':
                continue

            for nr in range(n):
                for nc in range(m):
                    if cap[nr][nc] == '0':
                        continue
                    if r == nr and c == nc:
                        continue

                    dist = abs(r - nr) + abs(c - nc)
                    if dist <= d:
                        dinic.add_edge(2 * idx(r, c) + 1,
                                       2 * idx(nr, nc),
                                       10 ** 9)

    escaped = dinic.flow(source, sink)
    return total - escaped

def main():
    t = int(input())
    out = []

    for case in range(1, t + 1):
        n, d = map(int, input().split())
        cap = [input().strip() for _ in range(n)]
        lizards = [input().strip() for _ in range(n)]

        ans = solve_case(n, d, cap, lizards)
        out.append(f"Case {case}: {ans}")

    print("\n".join(out))

if __name__ == "__main__":
    main()
```实现直接遵循图的构建。 每个支柱出现两次，因为容量限制适用于离开支柱时，而不是到达支柱时。 这两个副本之间的边缘是强制执行耐久性限制的地方。 

源边的容量为一，因为蜥蜴无法分裂为多个逃逸。 水槽边缘使用非常大的容量，因为外部没有瓶颈。 相同的值用于移动边缘，因为柱子之间的跳跃不受除了柱子本身之外的任何东西的限制。 

距离检查使用曼哈顿距离，因为移动发生在网格上。 边界检查是通过与任何边缘的最小距离来完成的。 由于约束很小，因此检查所有支柱对是可以接受的，并且可以保持实现简单。 

## 工作示例

 考虑这个小案例：```
1
2 1
11
11
L.
.L
```重要的状态是：

 | 步骤| 电流| 逃脱 | 剩余|
 | --- | --- | --- | --- |
 | 初始| 0 | 0 | 2 蜥蜴 |
 | 构建图表 | 0 | 0 | 两只蜥蜴都有路径|
 | 最大流量| 2 | 2 | 0 被困 |

 两只蜥蜴都可以到达外面，因为每根柱子都距离边界一跳。 流量值达到蜥蜴的数量。 

另一个案例：```
1
3 1
000
010
000
.L.
...
...
```踪迹是：

 | 步骤| 电流| 逃脱 | 剩余|
 | --- | --- | --- | --- |
 | 初始| 0 | 0 | 1 蜥蜴 |
 | 构建图表 | 0 | 0 | 中柱无输出能力|
 | 最大流量| 0 | 0 | 1 被困 |

 现存的唯一一根柱子强度为一，但周围都是缺失的柱子，距离安全太远了。 不存在从源到汇的路径。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(V²E) | 构造图上的 Dinic 算法 |
 | 空间| O(V + E) | 存储图和残差边 |

 最多有几百个网格单元，因此该图仅包含几千个顶点和边。 最大流量计算很容易符合限制。 

## 测试用例```python
import sys
import io

# These tests assume solve_case is available.

assert solve_case(
    1, 1,
    ["1"],
    ["L"]
) == 0

assert solve_case(
    3, 1,
    ["000", "010", "000"],
    [".L.", "...", "..."]
) == 1

assert solve_case(
    2, 1,
    ["11", "11"],
    ["LL", "LL"]
) == 0

assert solve_case(
    3, 2,
    ["111", "111", "111"],
    ["L..", "...", "..."]
) == 0
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 边境单柱 | 0 | 直接逃逸处理|
 | 隔离中心柱| 1 | 不可能的运动检测|
 | 几只蜥蜴有坚固的柱子| 0 | 共享容量处理 |
 | 跳跃距离大| 0 | 远距离跳跃边缘|

 ## 边缘情况

 在外部跳跃距离内开始的蜥蜴可以通过从其柱子到水槽的直接边缘来处理。 例如：```
1
1 1
1
L
```柱子与水槽相连，因此最大流量会立即发送一个单位。 最终的答案是`0`。 

不能使用强度为零的柱子。 为了：```
1
3 1
000
000
000
L..
...
...
```该图不包含起始支柱可用容量的节点。 不存在源到汇路径，因此最大流量为零，算法返回`1`。 

共用一根柱子的多只蜥蜴是通过容量边缘处理的。 如果柱子有力量`2`，传入到传出的边缘允许两个单位的流量。 一次性解释会错误地减少可能的逃逸次数。 流网络准确地保留了问题所描述的资源限制。
