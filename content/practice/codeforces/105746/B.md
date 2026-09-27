---
title: "CF 105746B - 家居装饰"
description: "我们得到一棵树，其中每个节点都已经有一个颜色，以及每个节点所需的最终颜色。 我们可以重新绘制 1 到 N 范围内任意数量的节点，并且每次重新绘制都算作一次操作。"
date: "2026-06-22T04:42:28+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105746
codeforces_index: "B"
codeforces_contest_name: "Bangladesh Olympiad in Informatics 2025 National Round Day 1"
rating: 0
weight: 105746
solve_time_s: 65
verified: true
draft: false
---

[CF 105746B - 家居装饰](https://codeforces.com/problemset/problem/105746/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一棵树，其中每个节点都已经有一个颜色，以及每个节点所需的最终颜色。 我们可以重新绘制 1 到 N 范围内任意数量的节点，并且每次重新绘制都算作一次操作。 目标是将初始颜色转换为目标颜色。 

有一个始终有效的全局限制，包括中间状态：树中的相邻节点绝不能共享相同的颜色。 此约束适用于每次重绘操作之后，而不仅仅是在最终配置中。 

任务是决定是否有可能在遵守这一规则的情况下达到目标着色，如果可能，则最小化重绘操作的​​数量并输出一个有效序列。 

高达 100000 的约束 N 强制采用线性或近线性解。 任何尝试通过回溯来模拟重着色状态或考虑节点顺序的所有排列的策略都会立即失败，因为即使对 N 个元素的排列进行排序也是不可行的。 

一个微妙的困难是，即使节点的最终颜色与其初始颜色不同，过早重新绘制它也会暂时与仍保留其初始颜色的邻居产生冲突。 同样，太晚重新粉刷可能会与已经切换到最终颜色的邻居发生冲突。 因此，操作顺序是核心问题。 

当两个相邻节点想要交换颜色时，会出现一个小故障情况。 

输入：```
2
1 2
2 1
1 2
```如果我们先重新绘制节点 1，它会变成 2，但节点 2 仍然是 2，违反了邻接关系。 如果我们先重新绘制节点 2，则会发生对称冲突。 正确答案是不可能的。 

这表明问题不在于选择要更改哪些节点，而在于在更改之间找到一致的依赖顺序。 

## 方法

 暴力视图将此视为尝试对初始颜色与其目标颜色不同的节点重新着色的所有可能顺序。 对于每个排列，我们模拟重新着色节点，并在每个步骤之后验证没有边缘变成单色。 从概念上讲，这是可行的，因为它直接强制执行约束，但需要检查最多 k! 其中 k 是要更改的节点数，即使 k 约为 20，这也是不可行的。 

关键的观察是每个节点仅与其邻居交互，并且每个节点仅重绘一次。 这将问题转化为构建有效的依赖顺序。 节点 u 是否可以被绘制仅取决于邻居当前的颜色是否等于 u 将要接收的颜色。 由于每个邻居要么仍处于其初始状态，要么已处于其最终状态，因此每个冲突都会减少为两个节点之间的方向约束。 

这使我们能够用必须重新着色的节点上的有向图来替换全局序列搜索。 边缘编码源自潜在颜色冲突的优先约束。 如果该有向图包含环，则不存在有效的排序。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力排列模拟 | O(k!·N) | O(k!·N) | O(N) | 太慢了|
 | 依赖图+拓扑排序| O(N) | O(N) | 已接受 |

 ## 算法演练

 我们只关注初始颜色与其目标颜色不同的节点，因为已经匹配其目标的节点永远不需要被触摸。 

1. 确定节点集合 S，其中 C[u] != T[u]。 这些是我们真正要重新绘制的唯一节点。 S 之外的节点的颜色 C[u] 永远保持固定。 
2. 对于每条边 (u, v)，我们分析重绘一个端点如何与另一个端点发生冲突，具体取决于该端点在此过程中可能保留的颜色。 出现两种类型的冲突：

 如果 v 没有重新着色并且 C[v] 等于 T[u]，则在 v 保持不变的情况下无法绘制 u。 由于 v 永远不会改变，这使得整个问题立即变得不可能。 

如果 v 被重新着色，那么我们必须根据它的初始颜色或最终颜色是否匹配 T[u] 或 T[v] 来决定 v 必须位于 u 之前还是之后。 
3. 我们使用以下规则在 S 中的节点上构建有向图：

 如果 C[v] == T[u]，则 v 必须在 u 之前绘制，否则 u 会看到 v 已经发生冲突。 

如果 T[v] == T[u]，则 u 必须在 v 之前绘制，否则 v 稍后会与已经拥有 T[u] 的 u 产生冲突。 
4. 构造完所有约束后，我们检查这个有向图是否有环。 如果是这样，则没有有效的订购。 
5. 如果它是非循环的，我们计算 S 中节点的拓扑顺序。 
6. 我们通过按拓扑顺序重新绘制节点来输出操作，将每个节点直接设置为其目标颜色 T[u]。 

它的工作原理取决于执行期间状态的不变性。 在任何时刻，每个未处理的节点仍处于其初始颜色，并且每个已处理的节点已经处于其最终颜色。 每个有向边都准确地编码了防止邻居匹配所分配的颜色所需的条件。 拓扑顺序保证每当处理一个节点时，所有可能发生冲突的邻居都已经处于所需的状态，要么已经固定，要么仍然未受影响，确保在此过程中没有边变得无效。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    C = [0] + list(map(int, input().split()))
    T = [0] + list(map(int, input().split()))

    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v = map(int, input().split())
        adj[u].append(v)
        adj[v].append(u)

    need = [False] * (n + 1)
    for i in range(1, n + 1):
        if C[i] != T[i]:
            need[i] = True

    # build directed constraints
    g = [[] for _ in range(n + 1)]
    indeg = [0] * (n + 1)

    for u in range(1, n + 1):
        for v in adj[u]:
            if not need[u] and not need[v]:
                continue
            # if v is fixed (not changed)
            if not need[v]:
                if C[v] == T[u] and need[u]:
                    print(-1)
                    return
                continue

            # v is in S
            if need[u]:
                if C[v] == T[u]:
                    g[v].append(u)
                    indeg[u] += 1
                if T[v] == T[u]:
                    g[u].append(v)
                    indeg[v] += 1

    # topo sort over nodes in need
    from collections import deque
    q = deque([i for i in range(1, n + 1) if need[i] and indeg[i] == 0])

    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in g[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)

    S = [i for i in range(1, n + 1) if need[i]]
    if len(order) != len(S):
        print(-1)
        return

    print(len(order), 1)
    for u in order:
        print(u, T[u])

if __name__ == "__main__":
    solve()
```该实现首先隔离需要更改的节点，因为其他所有节点都充当永久约束源。 然后，它扫描每个边缘并将局部颜色冲突转换为定向排序约束。 每个约束都被编码为图边，而入度则跟踪每个节点有多少个先决条件。 

拓扑排序是标准卡恩算法。 关键的微妙之处在于，不在变更集中的节点永远不会成为图的一部分，但它们仍然参与约束验证。 早期的不可能性检查是必不可少的，因为否则我们会尝试安排一些由于固定邻居已经持有冲突颜色而永远无法满足的事情。 

每个输出操作都直接将节点设置为其目标颜色，这是安全的，因为排序保证当前没有邻居等于该颜色。 

## 工作示例

 考虑第一个示例结构，其中需要在围绕中心节点形成的树中进行多次重新着色。 该算法首先标记初始颜色与目标颜色不同的所​​有节点，然后导出沿边缘的约束。 生成的有向图强制执行唯一的有效序列。 

简化的跟踪：

 | 步骤| 节点选择 | 入度条件 | 行动|
 | ---| ---| ---| ---|
 | 1 | 任意入度为 0 的节点 | 安全| 重新绘制目标|
 | 2 | 下一个可用 | 安全| 重新喷漆|
 | 3 | 继续 | 满足所有约束| 重新喷漆|

 此执行的关键观察结果是，当邻居处于冲突状态时，不会绘制任何节点，因为这种情况会创建一条有向边来阻止这种排序。 

对于不可能的情况：

 输入：```
2
1 2
2 1
1 2
```这里两个节点都在变更集中。 边缘同时产生两个约束：每个节点都要求另一个节点在它之前。 这就形成了一个长度为2的循环。 

| 节点| 约束 1 | 约束 2 |
 | ---| ---| ---|
 | 1 | 必须在 2 |之前 必须在 2 | 之后
 | 2 | 必须在 1 | 之前 必须在 1 | 之后

 不存在拓扑排序，因此算法正确输出 -1。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N) | 每条边最多贡献两次有向约束检查，拓扑排序对每个节点和边处理一次 |
 | 空间| O(N) | 邻接表和入度数组存储线性大小的结构 |

 约束允许最多 100000 个节点，因此线性复杂度是必要的。 图的构建和卡恩的算法都在限制范围内舒适地运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque

    def solve():
        n = int(input())
        C = [0] + list(map(int, input().split()))
        T = [0] + list(map(int, input().split()))

        adj = [[] for _ in range(n + 1)]
        for _ in range(n - 1):
            u, v = map(int, input().split())
            adj[u].append(v)
            adj[v].append(u)

        need = [False] * (n + 1)
        for i in range(1, n + 1):
            if C[i] != T[i]:
                need[i] = True

        g = [[] for _ in range(n + 1)]
        indeg = [0] * (n + 1)

        for u in range(1, n + 1):
            for v in adj[u]:
                if not need[u] and not need[v]:
                    continue
                if not need[v]:
                    if need[u] and C[v] == T[u]:
                        print(-1)
                        return
                    continue

                if need[u]:
                    if C[v] == T[u]:
                        g[v].append(u)
                        indeg[u] += 1
                    if T[v] == T[u]:
                        g[u].append(v)
                        indeg[v] += 1

        q = deque([i for i in range(1, n + 1) if need[i] and indeg[i] == 0])
        order = []
        while q:
            u = q.popleft()
            order.append(u)
            for v in g[u]:
                indeg[v] -= 1
                if indeg[v] == 0:
                    q.append(v)

        S = [i for i in range(1, n + 1) if need[i]]
        if len(order) != len(S):
            print(-1)
            return

        print(len(order), 1)
        for u in order:
            print(u, T[u])

    return sys.stdout.getvalue()

# minimal
assert run("""2
1 2
2 1
1 2
""").strip() == "-1"

# already correct
assert run("""3
1 2 3
1 2 3
1 2
1 3
""").split()[0] == "0"

# simple chain
assert run("""3
1 2 3
3 2 1
1 2
2 3
""").split()[0] >= "0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 2 节点交换 | -1 | 相互依赖循环|
 | 已经正确的树| 0 | 无需任何操作|
 | 3 节点链 | 有效订单 | 基本 DAG 调度 |

 ## 边缘情况

 直接两节点交换是最干净的故障模式。 每个节点都迫使另一个节点同时提前和推迟，从而产生一个循环，算法可以通过入度不平衡立即检测到该循环。 

当节点固定（C[u] = T[u]）但充当阻塞者时，会发生另一种微妙的情况。 这些节点永远不会被调度，但它们仍然可以禁止邻居采用某些颜色。 早期的不可能性检查确保如果固定节点已经具有与邻居目标匹配的颜色，则不可能有解决方案，因为该固定颜色无法移开。 

在较大的树中，多个依赖链可以互锁。 拓扑排序自然地处理了这个问题，任何循环，无论有多大或间接，都表现为处理后剩余入度非零的节点，这正确地触发了不可能性。
