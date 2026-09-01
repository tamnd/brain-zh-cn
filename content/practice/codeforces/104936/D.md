---
title: "CF 104936D - 收集硬币"
description: "我们得到一个图，其中每个节点是一座建筑物，每条边是两座建筑物之间的隧道。 每条隧道都有两个附加值：进入隧道所需的硬币成本，以及穿过隧道后收到的硬币奖励。"
date: "2026-06-28T18:11:40+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104936
codeforces_index: "D"
codeforces_contest_name: "MITIT 2024 Beginner Round"
rating: 0
weight: 104936
solve_time_s: 88
verified: false
draft: false
---

[CF 104936D - 收集硬币](https://codeforces.com/problemset/problem/104936/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 28s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个图，其中每个节点是一座建筑物，每条边是两座建筑物之间的隧道。 每条隧道都有两个附加值：进入隧道所需的硬币成本，以及穿过隧道后收到的硬币奖励。 每次穿越都是无向的，每次我们使用隧道时，我们都会再次支付其成本并获得其奖励。 

我们从 1 栋建筑开始，有一些初始数量的硬币，我们想要到达 N 栋建筑。问题是确定硬币的最小起始数量，以便存在一系列隧道遍历，使我们能够在不让硬币余额降至零以下的情况下到达 N 栋。 

关键的困难在于边缘不仅仅加权一次。 我们可以多次重复使用边缘，如果一条隧道产生的硬币多于其成本，它实际上就像一个可以循环的额外资金来源。 

限制条件很大：多达 100,000 座建筑物和 200,000 条隧道。 这立即排除了任何依赖于模拟每条路径可能的硬币余额或枚举路径的解决方案。 任何以简单的方式跟踪每个节点具有不同代币数量的状态的方法都会发生组合爆炸。 我们需要更接近线性或近线性时间，通常为 O(M log N) 或 O(M)。 

一些微妙的失败案例自然会出现。 

问题之一是负净收益周期或正净收益周期。 例如，如果一个周期总体上增加了币，那么一旦我们可以进入它，我们就可以产生任意大的资金。 忽略重复遍历的天真的最短路径将完全忽略这种效果。 

另一个问题是，即使就连通性而言存在一条路径，也可能无法用小的初始硬币遍历它，因为早期的边缘可能需要比暂时可用的更多的前期资本，即使后来的边缘进行补偿。 

最后，在某些情况下，“最小成本边缘路径”的贪婪选择会失败，因为早期更昂贵的边缘可能会开启一个盈利周期，从而减少总体所需的启动资金。 

## 方法

 一个蛮力的想法是将其视为一个状态图，其中每个状态都是（节点，当前硬币）。 从每个状态，我们尝试所有传出隧道，通过减去成本和增加奖励来更新硬币余额。 目标是用非负币到达节点 N，并且我们需要允许这一点的最小起始币。 

然而，硬币的价值是无限的，因此状态的数量实际上是无限的。 即使我们人为地限制它，转换也会增加硬币，所以我们不能保证有限的有用界限。 这使得扩展状态上的 BFS 或 Dijkstra 不可行。 

关键的观察是，重要的不是旅程中的绝对硬币数量，而是确保所选路径的可行性所需的最低初始资本。 对于固定路径，我们可以通过模拟前缀约束来计算所需的起始币：在每一步，我们必须确保永远不会出现负值。 所需的初始值是沿路径遇到的最大赤字。 

这将问题转化为最短路径问题，其中每条边都具有“成本调整”效应。 如果我们定义一个潜在的转换，我们可以将边缘行为减少为标准松弛：我们不跟踪当前硬币，而是跟踪到达每个节点所需的最小初始硬币。 当以成本 c 和奖励 r 遍历边 u 到 v 时，如果我们以需求 x 到达 u，那么在遍历该边之后，v 处的需求变为 max(0, x + c − r)，但前提是我们当时能负担得起 c，这取决于累积剩余。

更可靠的思考方式是：我们对答案进行二分搜索并检查可行性。 对于候选起始值S，我们模拟是否可以通过始终保持当前硬币余额并贪婪地获取任何可用边缘来达到N。 如果能达到N，S就是可行的。 

为了提高可行性，我们将边视为松弛，仅当当前余额≥成本时才允许遍历。 我们反复传播可达状态，同时保持当前最好的代币剩余。 这变成了一个类似 Dijkstra 的过程，其中“距离”是当前硬币剩余最大化，而不是成本最小化。 

我们反转视角：我们不是直接最小化起始币，而是询问给定的起始数量是否足够，然后使用二分搜索对其进行优化。 每次检查都会运行经过修改的最佳优先搜索，该搜索始终扩展当前代币余额最高的节点，确保我们首先探索最有希望的状态。 

这产生了单调可行性条件，使得能够对 S 进行二分搜索。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力状态扩张 | O(无穷大) | O(N·硬币) | 太慢了 |
 | 二分搜索+最佳优先可行性| O(M log M log V) | O(M log M log V) | O(N + M) | 已接受 |

 ## 算法演练

 我们二分查找最小初始硬币S。 

对于每个候选 S，我们测试是否可以从 S 个币开始到达节点 N。 

我们维护一个按每个节点当前硬币余额排序的优先级队列，始终首先扩展具有最高可用硬币的状态。 

我们还维护一个数组 best[v]，它存储我们在到达节点 v 时获得的最大代币余额。这可以防止重新访问较弱的状态。 

我们初始化 best[1] = S 并将 (S, 1) 推入优先级队列。 

然后我们反复提取硬币余额最高的状态。 

从具有当前币 x 的节点 u 开始，我们尝试每个隧道 (u, v, c, r)。 如果 x < c，我们无法遍历它并跳过。 

如果 x ≥ c，则遍历后我们会得到带有 x − c + r 个硬币的 v。 如果这个值大于 best[v]，我们更新 best[v] 并推送新状态。 

我们继续直到队列为空或者到达节点 N。 

如果定义了best[N]，则S是可行的。 

### 为什么它有效

 对于固定的起始值 S，算法始终按可用硬币的降序探索状态。 任何拥有较少硬币的国家只能产生较少或相同的未来选择，因为边缘可行性取决于至少具有成本 c。 因此，到达具有较高代币余额的节点将主导对同一节点的所有较弱的访问。 最好的数组确保我们只保留主导状态，这样可以保持正确性，同时避免指数爆炸。 

由于币余额在任何有效遍历中都不会变为负数，并且所有转换都保留可行性约束，因此此过程将发现 S 下的任何可到达配置。 因此可行性检查是准确的，二分查找正确地找到了最小的S。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

def can(start, n, g):
    best = [-1] * (n + 1)
    pq = [(-start, 1)]
    best[1] = start

    while pq:
        neg_x, u = heapq.heappop(pq)
        x = -neg_x

        if x < best[u]:
            continue

        if u == n:
            return True

        for v, c, r in g[u]:
            if x < c:
                continue
            nx = x - c + r
            if nx > best[v]:
                best[v] = nx
                heapq.heappush(pq, (-nx, v))

    return False

def solve():
    n, m = map(int, input().split())
    g = [[] for _ in range(n + 1)]
    for _ in range(m):
        a, b, c, r = map(int, input().split())
        g[a].append((b, c, r))
        g[b].append((a, c, r))

    lo, hi = 0, 10**18
    ans = hi

    while lo <= hi:
        mid = (lo + hi) // 2
        if can(mid, n, g):
            ans = mid
            hi = mid - 1
        else:
            lo = mid + 1

    print(ans)

if __name__ == "__main__":
    solve()
```该解决方案构建一个无向邻接列表，存储每个隧道及其成本和奖励。 可行性检查功能在硬币状态上运行最佳优先传播，始终首先扩展最丰富的可达状态。 

二分搜索包装了这个检查，根据给定的初始硬币数量是否足够来缩小答案空间。 关键的实现细节是使用最大堆（通过负值实现）来优先考虑较大的代币余额。 

一个微妙的点是优势检查最佳[v]。 如果没有它，搜索将反复重新访问硬币价值更差的同一节点，从而导致 TLE。 

## 工作示例

 ### 示例 1

 输入：```
3 3
1 2 2 1
2 3 3 0
1 3 5 0
```我们测试候选 S = 3。 

| 步骤| 节点| 硬币 | 行动|
 | ---| ---| ---| ---|
 | 1 | 1 | 3 | 开始 |
 | 2 | 2 | 2 | 使用边 1→2（成本 2，奖励 1） |
 | 3 | 3 | -1 | 无法继续 |

 这失败了，因为不允许使用负硬币。 所以 S = 3 是不够的。 

尝试 S = 4。 

| 步骤| 节点| 硬币 | 行动|
 | ---| ---| ---| ---|
 | 1 | 1 | 4 | 开始 |
 | 2 | 2 | 3 | 1→2 |
 | 3 | 3 | 0 | 2→3 |

 我们成功到达节点 3。 

这表明可行性检查对早期边缘成本敏感，而不仅仅是净收益。 

### 示例 2

 输入：```
4 3
1 2 3 1
2 3 1 2
3 4 2 4
```尝试 S = 3。 

| 节点| 硬币 | 原因 |
 | ---| ---| ---|
 | 1 | 3 | 开始 |
 | 2 | 1 | 1→2 |
 | 3 | 2 | 2→3 |
 | 4 | 4 | 3→4 |

 We reach the destination with positive balance, confirming S = 3 is feasible.

 This demonstrates that intermediate losses are acceptable as long as later rewards compensate.

 ## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(M log N log V) | O(M log N log V) | binary search over S, each feasibility check is a heap-based propagation over edges |
 | 空间| O(N + M) | adjacency list and best array |

 The constraints allow roughly 2e5 edges, and logarithmic factors remain small due to binary search over a bounded coin range. The heap-based propagation ensures each useful state is processed a limited number of times.

 ## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import math
    import heapq

    input = sys.stdin.readline

    def can(start, n, g):
        best = [-1] * (n + 1)
        pq = [(-start, 1)]
        best[1] = start

        while pq:
            neg_x, u = heapq.heappop(pq)
            x = -neg_x
            if x < best[u]:
                continue
            if u == n:
                return True
            for v, c, r in g[u]:
                if x < c:
                    continue
                nx = x - c + r
                if nx > best[v]:
                    best[v] = nx
                    heapq.heappush(pq, (-nx, v))
        return False

    n, m = map(int, input().split())
    g = [[] for _ in range(n + 1)]
    for _ in range(m):
        a, b, c, r = map(int, input().split())
        g[a].append((b, c, r))
        g[b].append((a, c, r))

    lo, hi = 0, 10**6
    ans = hi
    while lo <= hi:
        mid = (lo + hi) // 2
        if can(mid, n, g):
            ans = mid
            hi = mid - 1
        else:
            lo = mid + 1
    return str(ans)

# provided samples
assert run("3 3\n1 2 2 1\n2 3 3 0\n1 3 5 0\n") == "4", "sample 1"
assert run("4 3\n1 2 3 1\n2 3 1 2\n3 4 2 4\n") == "3", "sample 2"

# custom cases
assert run("2 1\n1 2 0 0\n") == "0", "free edge"
assert run("2 1\n1 2 5 10\n") == "0", "profit edge"
assert run("3 2\n1 2 5 0\n2 3 5 0\n") == "10", "tight chain"
assert run("3 3\n1 2 10 0\n2 1 9 0\n2 3 1 100\n") == "1", "cycle benefit"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 自由边缘| 0 | 零成本穿越|
 | 利润优势| 0 | 净增益优势|
 | 紧链| 10 | 10 accumulation of strict costs |
 | 循环效益| 1 | using cycles to unlock feasibility |

 ## 边缘情况

 A direct corner case is when all edges have zero cost and zero reward. The algorithm immediately succeeds with S = 0, since the queue starts with zero coins and every traversal is always allowed.

 另一个微妙的情况是，当存在一个增加硬币的循环，但不在通往 N 的直接路径上时。最佳优先传播确保一旦该循环可达，它将被用来提高硬币余额，从而可能解锁以前不可用的边缘。 A greedy shortest-path interpretation would miss this, but the state dominance mechanism ensures it is fully captured.

 A final case is when the only valid route requires temporarily “losing” coins but later recovering them. 只要当前状态永远不会低于边缘成本，可行性检查就可以正确地允许暂时减少，因为每个状态都是用自己的代币余额独立评估的，并且转换在本地强制执行可行性。
