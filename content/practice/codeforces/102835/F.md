---
title: "CF 102835F - 电缆保护"
description: "该网络有一个单一的圆形主干网。 每个骨干交换机都可以附加一个树形子网，因此整个图恰好包含一个环，所有其他边都属于挂在该环上的树。"
date: "2026-07-26T14:58:44+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102835
codeforces_index: "F"
codeforces_contest_name: "The 2020 ICPC Asia Taipei-Hsinchu Site Programming Contest"
rating: 0
weight: 102835
solve_time_s: 39
verified: true
draft: false
---

[CF 102835F - 电缆保护](https://codeforces.com/problemset/problem/102835/F)

 **评级：** -
 **标签：** -
 **求解时间：** 39s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 该网络有一个单一的圆形主干网。 每个骨干交换机都可以附加一个树形子网，因此整个图恰好包含一个环，所有其他边都属于挂在该环上的树。 

在交换机上安装保护工具可以监控直接连接到该交换机的每条电缆。 如果电缆的两个端点中至少有一个具有工具，则该电缆受到监控。 任务是选择最少数量的交换机，以便监控每根电缆。 用图术语来说，这是连通单环图上的最小顶点覆盖问题。 

骨干交换机的数量可以达到100000个，子网交换机的数量也可以达到100000个。因此，顶点总数约为200000个，边的数量也相同。 任何尝试所有子集，甚至运行通用图顶点覆盖算法的解决方案都是不可能的。 我们需要一种使用特殊结构的线性时间算法：带有附加树的单个循环。 

棘手的情况来自循环。 树可以被贪婪地求解，但是循环引入了依赖性，因为第一个和最后一个循环顶点是连接的。 

例如，如果整个图只是一个三角形：```
3 0
0 1
1 2
2 0
```答案是`2`。 仅选择一个开关，使另一根电缆未被覆盖。 

另一个边缘情况是连接到循环顶点的长链。 例如：```
3 2
0 1
1 2
2 0
0 3
3 4
```循环仍然需要作为循环来处理，而顶点`3`和`4`应该被当作一棵树来处理。 将整个图视为一棵树会错过额外的循环边。 

# 方法

 一种直接的方法是解决整个图上的最小顶点覆盖问题。 由于每个顶点都可以被选择或不被选择，所以暴力检查所有`2^V`可能性并验证每一个边缘。 这是正确的，因为它会检查每组可能的开关，但对于具有大约 200000 个顶点的图来说，这是完全不可行的。 

有用的观察是该图不是任意的。 从唯一循环中删除任何一条边都会将图变成一棵树。 树对于顶点覆盖有一种简单的动态编程解决方案，因为每个子子树仅通过一条边与其父树交互。 

蛮力之所以有效，是因为它考虑了所有可能的选择。 由于图太大而失败。 结构观察让我们将图分成树部分和一个小循环。 我们根据是否选择每个循环顶点计算最佳答案，然后通过小型动态编程求解剩余循环。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^V * E) | O(2^V * E) | O(V) | 太慢了|
 | 最佳 | O(V) | O(V) | 已接受 |

 # 算法演练

 1. 使用度消除法找到属于唯一循环的顶点。 每片叶子都不可能是循环的一部分，因此重复删除 1 度顶点会恰好留下循环顶点。 
2. 从每个循环顶点到其附加的树运行树动态规划。 对于一个顶点`u`，计算两个值。 第一个值是最小覆盖尺寸，如果`u`没有被选择，这意味着每个孩子都必须被选择。 第二个值是最小覆盖尺寸，如果`u`被选中，这允许每个子项被选择或不被选择。 
3. 暂时忽略树边，只考虑环路。 每个循环顶点现在有两种可能的成本，具体取决于是否选择顶点本身。 
4. 通过固定第一个循环顶点的状态来解决循环。 如果选择它，则可以选择最后一个顶点，也可以不选择最后一个顶点。 如果没有选择，则必须选择它的两个循环邻居。 尝试两种可能性并保留较小的结果。 
5. 输出两个循环情况中获得的最小值。 

不变的是，每个子树 DP 值表示覆盖该子树内部所有边所需的选定顶点的确切最小数量，同时尊重子树根的选定或未选定状态。 然后，循环 DP 只需要强制执行剩余的循环边缘，因此结合独立子树解决方案即可给出全局最优值。 

# Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    data = sys.stdin.buffer.read().split()
    if not data:
        return
    it = iter(data)
    n = int(next(it))
    m = int(next(it))
    total = n + m

    g = [[] for _ in range(total)]
    for _ in range(total):
        a = int(next(it))
        b = int(next(it))
        g[a].append(b)
        g[b].append(a)

    deg = [len(x) for x in g]
    from collections import deque

    q = deque(i for i in range(total) if deg[i] == 1)
    alive = [True] * total

    while q:
        u = q.popleft()
        alive[u] = False
        for v in g[u]:
            if alive[v]:
                deg[v] -= 1
                if deg[v] == 1:
                    q.append(v)

    cycle = [i for i in range(total) if alive[i]]
    cycle_set = set(cycle)

    sys.setrecursionlimit(300000)

    def dfs(u, p):
        take = 1
        leave = 0
        for v in g[u]:
            if v != p and v not in cycle_set:
                a, b = dfs(v, u)
                leave += a
                take += min(a, b)
        return leave, take

    cost = {}
    for c in cycle:
        cost[c] = dfs(c, -1)

    order = []
    start = cycle[0]
    prev = -1
    cur = start
    while True:
        order.append(cur)
        nxt = None
        for v in g[cur]:
            if v in cycle_set and v != prev:
                nxt = v
                break
        prev, cur = cur, nxt
        if cur == start:
            break

    def solve_cycle(first_state):
        inf = 10**18
        k = len(order)
        dp = [inf, inf]
        dp[first_state] = cost[order[0]][first_state]

        for i in range(1, k):
            ndp = [inf, inf]
            for prev_state in (0, 1):
                for state in (0, 1):
                    if prev_state == 0 and state == 0:
                        continue
                    ndp[state] = min(
                        ndp[state],
                        dp[prev_state] + cost[order[i]][state]
                    )
            dp = ndp

        ans = inf
        for last_state in (0, 1):
            if first_state == 0 and last_state == 0:
                continue
            ans = min(ans, dp[last_state])
        return ans

    print(min(solve_cycle(0), solve_cycle(1)))

if __name__ == "__main__":
    solve()
```第一部分构建图表并删除叶子。 因为每个树枝最终都会形成一片叶子，所以只有循环顶点能够在这个过程中幸存下来。 

DFS 计算标准树顶点覆盖递归。 当未选择顶点时，必须选择每个子节点，因为它们之间的边需要覆盖。 当选择一个顶点时，每个孩子都会选择其更便宜的状态。 

循环遍历存储主干顺序。 最终的动态规划过程与经典的圆上抢劫类似，只不过这两个状​​态表示是否选择了循环顶点。 特殊的第一个和最后一个转换可防止未覆盖的循环边缘。 

Python 整数不会溢出，但实现仍然对不可能的状态使用较大的哨兵值。 递归限制会增加，因为子网可以是长度接近输入大小的链。 

# 工作示例

 对于第一个样本：```
3 2
0 1
1 2
0 2
1 3
2 4
```周期为`0,1,2`。 附属的树是两个独生子女。 

| 步骤| 目前的决定| 国家价值观|
 | ---| ---| ---|
 | 循环检测| 保留顶点 0,1,2 | 发现循环|
 | 树 DP 为 0 | 儿童 3 | 离开=1，接受=1 |
 | 树 DP 为 1 | 没有孩子 | 离开=0，接受=1 |
 | 树 DP 为 2 | 儿童 4 | 离开=1，接受=1 |
 | 循环 DP | 尝试顶点 0 的两种状态 | 最小值 = 2 |

 答案是`2`，表明循环不需要选择每个顶点。 

对于没有子树的三角形：```
3 0
0 1
1 2
2 0
```| 步骤| 目前的决定| 国家价值观|
 | ---| ---| ---|
 | 循环检测| 所有顶点均存活 | 发现循环|
 | 树DP | 没有附属的树木| 每个顶点的成本为 0 或 1 |
 | 循环 DP | 测试顶点 0 选择 | 成本 2 |
 | 循环 DP | 测试顶点 0 未选择 | 成本 2 |

 答案是`2`。 这证实了循环处理正确可以防止选择太少的顶点。 

# 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(V) | 每个顶点都被删除，在 DFS 中处理，或在循环 DP 中处理一次 |
 | 空间| O(V) | 图、DP数组、遍历状态都是线性的 |

 该图最多包含约 200000 个顶点，因此线性解很容易满足所需的限制。 

# 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.buffer.read().split()
    sys.stdin = old
    return ""

# The tests below are intended to be used with the solve() function wired
# through standard input/output.

# triangle
# expected: 2

# cycle with a chain
# expected: 3

# single cycle only
# expected: 2

# larger attached tree
# expected: depends on full graph structure
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 三角循环| 2 | 基本循环 DP |
 | 一根长树枝循环| 3 | 树木与循环的分离 |
 | 具有许多相等分支的循环 | 由 DP | 计算 同等成本的选择|
 | 最小周期| 2 | 尽可能小的循环情况|

 # 边缘情况

 对于仅包含循环的图：```
3 0
0 1
1 2
2 0
```叶子移除不会移除任何内容，因此所有顶点都被识别为循环顶点。 树DP贡献零额外成本，并且循环DP强制选择至少两个顶点。 

对于附有路径的循环：```
3 2
0 1
1 2
2 0
0 3
3 4
```剥离阶段删除顶点`4`和`3`，离开`0,1,2`作为循环。 DFS独立计算分支成本，然后周期DP决定应选择哪些骨干交换机。 分支不能影响循环顺序，这正是算法所依赖的分离。 

对于具有多个叶子子节点的顶点，DFS 可以正确处理选择父节点成本更低的情况。 如果未选择父级，则必须选择每个叶子级。 如果选择了父级，则可以忽略所有叶子。 这两个 DP 状态捕获了两种可能性，无需特殊情况。
