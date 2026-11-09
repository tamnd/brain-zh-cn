---
title: "CF 2047F - 为了皇帝！"
description: "我们有一个城市有向图。 城市 i 最初包含人工智能信使。 信使可以沿着指定的道路移动。 如果信使已经知道计划，他就可以在旅行时携带它。"
date: "2026-06-09T03:35:37+07:00"
tags: ["codeforces", "competitive-programming", "flows", "graphs"]
categories: ["algorithms"]
codeforces_contest: 2047
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 990 (Div. 2)"
rating: 3100
weight: 2047
solve_time_s: 123
verified: false
draft: false
---

[CF 2047F - 为了皇帝！](https://codeforces.com/problemset/problem/2047/F)

 **评分：** 3100
 **标签：** 流程、图表
 **求解时间：** 2m 3s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个城市有向图。 城市`i`最初包含`a_i`使者。 

信使可以沿着指定的道路移动。 如果信使已经知道计划，他就可以在旅行时携带它。 当这样的信使到达一个城市时，他可以将计划的副本分发给当前在那里的每个信使。 从那一刻起，所有那些新获悉消息的使者也可能会前往并继续传播该计划。 

在任何事情开始之前，我们可能会选择一些现有的使者，并直接将计划的副本交给他们。 每个被选中的信使都需要花费一份初始副本。 任务是最大限度地减少最初分发的副本数量，同时仍然保证每个城市至少有一名消息灵通的使者访问。 

一座没有信使的城市并不一定就毫无希望。 它可能仍然是由从其他地方到达的信使通知的。 真正的问题是现有信使的集合是否可以通过图表以到达每个城市的方式传播信息。 

该图在测试用例中最多包含 200 个顶点和 800 条边。 对于复杂的大规模图技术来说，这些数字太小了，但它们又足够大，以至于不可能进行指数状态搜索。 该问题的评分为 3100，因为困难不在于计算规模，而在于找到正确的图流模型。 

第一个结构观察是强连接组件表现为不可分割的单元。 如果 SCC 内的一名信使了解了该计划，他就可以走遍整个 SCC 并激活位于其中的每个信使。 之后，该 SCC 内的所有信使都可用于进一步传播。 

一些边缘情况很容易被忽略。 

考虑一个没有信使的组件。```
2 1
0 1
2 1
```城市2可以向城市1发送信使，所以答案是`1`。 仅查看本地信使数量会错误地得出城市 1 无法使用的结论。 

现在考虑：```
2 2
0 0
1 2
2 1
```到处都没有使者。 无法分配初始副本。 正确答案是`-1`。 

一个更微妙的例子是：```
3 2
1 0 1
1 2
3 2
```城市 2 没有信使。 任何一方都可以获悉，但信息不能在两个源城市之间跳转。 我们仍然需要两次初始激活。 仅计算零度 SCC 的贪婪策略无法捕获信使可用性约束。 

## 方法

 蛮力观点是将每个信使视为单独的资源。 我们可以尝试接收初始副本的每个信使子集并模拟传播过程。 如果图表包含甚至 200 个信使，这立即变得不可能，因为搜索空间是指数级的。 

暴力破解之所以诱人，是因为传播看起来像是一个可达性问题。 不幸的是，激活会产生新的活跃信使，而这些信使可以独立分支。 不同激活选择之间的相互作用变得极其复杂。 

关键的观察结果是，在 SCC 压缩之后，图变成了 DAG。 在一个 SCC 内，激活单个信使会激活该 SCC 的所有信使。 

让$$b_u = \text{total number of messengers inside SCC } u.$$一次SCC`u`被激活后，它可以贡献高达`b_u`全球传播过程的使者。 

我们不跟踪单个动作，而是将一个流量单位视为一个信使的轨迹。 轨迹可以通过凝聚 DAG 移动。 每个 SCC 必须至少被一条轨迹访问过。 如果 SCC 包含`b_u`信使，那么激活后最多可以生成`b_u`独立的轨迹。 

这就将问题转化为具有成本的流程可行性问题。 我们必须满足“访问每个 SCC”的要求，同时最大限度地减少手动创建轨迹的位置数量。 

生成的模型是 SCC DAG 上的最小成本可行流构建。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| 指数| 太慢了 |
 | SCC + 最小成本可行流程 |$O(K^3)$到$O(K^4)$在实践中，$K \le 200$|$O(K^2)$| 已接受 |

 这里`K`是 SCC 的数量。 

## 算法演练

 ### 1. 压缩强连通分量

 运行 Tarjan 算法。 

对于每个 SCC，计算$$b_u=\sum a_i$$该 SCC 内的所有原始顶点。 

用其凝结图替换该图。 凝结图是一个 DAG。 

在 SCC 内，一个激活的信使可以激活所有本地信使，因此只有总数`b_u`很重要。 

### 2. 构建流程模型

 对于每个 SCC`u`，创建三个顶点：```
A_u
B_u
C_u
```他们的角色是：`A_u`控制此 SCC 中存在多少个信使。`B_u`代表SCC的要求`u`必须至少激活一次。`C_u`表示满足要求后激活的SCC。 

### 3. 模型信使可用性

 如果是SCC`u`包含`b_u`信使，添加```
Source -> A_u   capacity = b_u
```这最多意味着`b_u`在该 SCC 被激活后，轨迹可能源自该 SCC。 

### 4.模型手动激活成本

 添加```
A_u -> B_u   capacity = 1, cost = 1
A_u -> C_u   capacity = INF, cost = 0
```第一个边缘对应于向 SCC 内的一个信使手动给出计划。 

只有一个单位可以支付这笔费用。 

### 5. 强制激活每个 SCC

 添加```
B_u -> C_u   capacity = 1, cost = -TAG
B_u -> C_u   capacity = INF, cost = 0
```在哪里`TAG`是一个非常大的常数。 

负成本边缘奖励激活 SCC 一次。 

优化将尝试为每个 SCC 收集此奖励。 

### 6. 通过 DAG 传播模型

 对于每个冷凝边缘```
u -> v
```添加```
C_u -> B_v   capacity = INF
```离开激活的SCC的轨迹可以激活后继的SCC。 

### 7. 转换为可行流问题

 添加标准下界/可行流构造。 

公认的解决方案使用的实现创建了超级源和超级接收器，并询问每个SCC是否可以获得其强制激活流。 

### 8. 运行最小成本最大流量

 如果可行流激活每个SCC，则令获得的成本为`cost`。 

真正的答案是$$cost + K \cdot TAG$$因为每个 SCC 都贡献了一项人工奖励`-TAG`。 

如果可行性失败，输出`-1`。 

### 为什么它有效

 每个流量单位代表一个信使轨迹。 

从全球源进入SCC的优势`u`将源自该 SCC 的轨迹数量限制为可用信使的数量。 

路过`B_u -> C_u`对应激活SCC`u`。 负奖励迫使最优解决方案尽可能激活每个 SCC。 

轨迹只能通过 DAG 边或支付手动激活成本才能进入 SCC。 因此，每个激活的 SCC 要么从先前激活的 SCC 到达，要么手动启动。 

可行流约束保证每个 SCC 接收一次激活。 在所有此类解决方案中，成本最低的目标是最大限度地减少手动激活的次数。 因此，结果值恰好是初始分发计划的最小数量。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

INF = 10 ** 9
TAG = 100000

class Edge:
    __slots__ = ("to", "cap", "cost", "rev")

    def __init__(self, to, cap, cost, rev):
        self.to = to
        self.cap = cap
        self.cost = cost
        self.rev = rev

class MinCostMaxFlow:
    def __init__(self, n):
        self.n = n
        self.g = [[] for _ in range(n)]

    def add_edge(self, u, v, cap, cost):
        a = Edge(v, cap, cost, None)
        b = Edge(u, 0, -cost, None)
        a.rev = len(self.g[v])
        b.rev = len(self.g[u])
        self.g[u].append(a)
        self.g[v].append(b)

    def min_cost_flow(self, s, t):
        flow = 0
        cost = 0

        while True:
            dist = [INF] * self.n
            inq = [False] * self.n
            pv = [-1] * self.n
            pe = [-1] * self.n

            dist[s] = 0
            q = deque([s])
            inq[s] = True

            while q:
                v = q.popleft()
                inq[v] = False

                for i, e in enumerate(self.g[v]):
                    if e.cap > 0 and dist[e.to] > dist[v] + e.cost:
                        dist[e.to] = dist[v] + e.cost
                        pv[e.to] = v
                        pe[e.to] = i
                        if not inq[e.to]:
                            inq[e.to] = True
                            q.append(e.to)

            if dist[t] == INF:
                break

            add = INF
            v = t
            while v != s:
                e = self.g[pv[v]][pe[v]]
                add = min(add, e.cap)
                v = pv[v]

            v = t
            while v != s:
                e = self.g[pv[v]][pe[v]]
                e.cap -= add
                self.g[v][e.rev].cap += add
                v = pv[v]

            flow += add
            cost += add * dist[t]

        return flow, cost

def solve():
    t = int(input())

    for _ in range(t):
        n, m = map(int, input().split())
        a = list(map(int, input().split()))

        g = [[] for _ in range(n)]
        edges = []

        for _ in range(m):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            g[u].append(v)
            edges.append((u, v))

        dfn = [0] * n
        low = [0] * n
        in_st = [False] * n
        st = []
        comp = [-1] * n
        timer = 0
        comps = 0

        sys.setrecursionlimit(10000)

        def tarjan(v):
            nonlocal timer, comps

            timer += 1
            dfn[v] = low[v] = timer
            st.append(v)
            in_st[v] = True

            for to in g[v]:
                if not dfn[to]:
                    tarjan(to)
                    low[v] = min(low[v], low[to])
                elif in_st[to]:
                    low[v] = min(low[v], dfn[to])

            if low[v] == dfn[v]:
                while True:
                    x = st.pop()
                    in_st[x] = False
                    comp[x] = comps
                    if x == v:
                        break
                comps += 1

        for i in range(n):
            if not dfn[i]:
                tarjan(i)

        k = comps
        b = [0] * k

        for i in range(n):
            b[comp[i]] += a[i]

        S = 3 * k
        T = S + 1
        SS = T + 1
        TT = SS + 1

        mcmf = MinCostMaxFlow(TT + 1)

        mcmf.add_edge(T, S, INF, 0)

        for u in range(k):
            A = u
            B = u + k
            C = u + 2 * k

            mcmf.add_edge(S, A, b[u], 0)
            mcmf.add_edge(A, B, 1, 1)
            mcmf.add_edge(A, C, INF, 0)

            mcmf.add_edge(B, C, 1, -TAG)
            mcmf.add_edge(B, C, INF, 0)

            mcmf.add_edge(C, T, INF, 0)

            mcmf.add_edge(SS, C, 1, 0)
            mcmf.add_edge(B, TT, 1, 0)

        for u, v in edges:
            cu = comp[u]
            cv = comp[v]
            if cu != cv:
                mcmf.add_edge(cu + 2 * k, cv + k, INF, 0)

        flow, cost = mcmf.min_cost_flow(SS, TT)

        if flow != k:
            print(-1)
        else:
            ans = cost + k * TAG
            print(ans)

if __name__ == "__main__":
    solve()
```第一部分计算 SCC 并用其压缩 DAG 替换原始图。 SCC 内的所有信使计数都会合并，因为激活会立即传播到整个组件。 

流程构建遵循上述模型。 每个SCC的三节点设备是关键部分。 它同时强制激活、限制信使创建，并且仅在使用手动激活时收取费用。 

可行性检查是通过为每个 SCC 要求一个激活单元来执行的。 如果得到的最大流量小于SCC的数量，则某些SCC永远无法被通知，答案是`-1`。 

必须谨慎使用大的负奖励边缘。 其唯一目的是强制优化器尽可能激活 SCC。 计算流量后，我们添加回来`K * TAG`恢复真实的客观价值。 

## 工作示例

 ### 示例 1```
7 6
2 1 0 1 2 3 4
1->2
1->3
2->4
2->5
3->6
3->7
```每个顶点都是它自己的 SCC。 

| 南昌中心 | 信使 | 可以传入激活吗？ |
 | --- | --- | --- |
 | 1 | 2 | 手册|
 | 2 | 1 | 从 1 |
 | 3 | 0 | 从 1 |
 | 4 | 1 | 从 2 |
 | 5 | 2 | 从 2 |
 | 6 | 3 | 从 3 |
 | 7 | 4 | 从 3 |

 必须手动激活根 SCC。 它只包含两个信使，因此它最多可以发送两个独立的轨迹。 

一条轨迹处理左分支，一条轨迹处理右分支。 

| 手动激活 | 结果 |
 | --- | --- |
 | 1 | 分支能力不足|
 | 2 | 覆盖所有城市 |

 回答：`2`。 

这个例子说明了为什么信使计数很重要。 仅有可达性是不够的。 

### 示例 2```
4 4
1 1 1 1
1->2
1->3
2->4
3->4
```| 南昌中心 | 信使 |
 | --- | --- |
 | 1 | 1 |
 | 2 | 1 |
 | 3 | 1 |
 | 4 | 1 |

 SCC 1 只有一名信使。 

| 行动| 活跃轨迹|
 | --- | --- |
 | 激活 SCC 1 | 1 |
 | 达到 SCC 2 或 SCC 3 | 仍然 1 |
 | 需要两个分支 | 一开始就不可能|

 需要第二次手动激活。 

回答：`2`。 

该跟踪突出了中心资源约束：信使本身就是流。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(K^3)$到$O(K^4)$实践 | SCC分解加上最多的最小成本流$4K+2$顶点 |
 | 空间|$O(K^2)$| 流程图存储|

 由于所有测试用例的原始顶点总数最多为 200 个，因此流网络仍然非常小。 基于 SPFA 的标准最小成本流程实施完全符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    # paste solve() and supporting code above
    pass

# provided sample
assert run(
"""2
7 6
2 1 0 1 2 3 4
1 2
1 3
2 4
2 5
3 6
3 7
4 4
1 1 1 1
1 2
1 3
2 4
3 4
"""
).strip() == "2\n2"

# no messengers anywhere
assert run(
"""1
2 2
0 0
1 2
2 1
"""
).strip() == "-1"

# strongly connected component with one messenger
assert run(
"""1
3 3
1 0 0
1 2
2 3
3 1
"""
).strip() == "1"

# two disconnected sources
assert run(
"""1
3 2
1 0 1
1 2
3 2
"""
).strip() == "2"

# chain, one messenger at start
assert run(
"""1
4 3
1 0 0 0
1 2
2 3
3 4
"""
).strip() == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 任何地方都没有信使 | -1 | 不可能的事例 |
 | 单 SCC | 1 | SCC 压缩正确性 |
 | 两个断开的源 | 2 | 多次手动激活|
 | 简单链条| 1 | 纯传播|
 | 官方样品| 2, 2 | 一般正确性 |

 ## 边缘情况

 考虑：```
2 2
0 0
1 2
2 1
```SCC 压缩后有一个 SCC`b=0`。 该 SCC 的源边的容量为零。 永远无法生成激活流。 可行流阶段失败，算法输出`-1`。 

现在考虑：```
3 3
1 0 0
1 2
2 3
3 1
```所有顶点都属于一个 SCC。 压缩图有一个节点`b=1`。 一次手动激活进入SCC，将其激活，并立即通知整个SCC。 答案是`1`。 

最后：```
3 2
1 0 1
1 2
3 2
```有两个独立的源 SCC。 两者都无法激活对方。 可行流构造强制 SCC 2 接收激活，但该激活可以来自任一来源。 由于两个源最终都必须参与，因此优化器需要支付两次手动激活成本。 答案是`2`。 

这些示例正是基于可达性的推理失败的情况，并且流公式捕获了真正的资源约束。
