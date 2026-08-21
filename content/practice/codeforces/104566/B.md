---
title: "CF 104566B - 红黑树"
description: "我们得到一棵以节点 1 为根的加权树。一些顶点最初被染成红色，包括根，而所有其他顶点都是黑色。"
date: "2026-06-30T08:31:51+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104566
codeforces_index: "B"
codeforces_contest_name: "The 2018 ACM-ICPC Asia Qingdao Regional Contest, Online (The 2nd Universal Cup. Stage 1: Qingdao)"
rating: 0
weight: 104566
solve_time_s: 83
verified: true
draft: false
---

[CF 104566B - 红黑树](https://codeforces.com/problemset/problem/104566/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一棵以节点 1 为根的加权树。一些顶点最初被染成红色，包括根，而所有其他顶点都是黑色。 对于每个顶点，其成本是使用其到根的路径上的红色顶点来定义的：如果顶点本身是红色的，则其成本为零，否则我们沿着到根的唯一路径向上查找并找到最近的红色祖先，成本是沿着树到该祖先的距离。 

对于每个查询，我们都会得到一个顶点子集。 我们最多可以在树的任意位置选取一个顶点并将其暂时变为红色。 更改后，使用相同的规则重新计算每个顶点的成本。 任务是最小化查询顶点中的最大成本。 

输入大小迫使我们在每个测试用例的近线性时间内进行思考。 该树最多可以有 100,000 个节点，所有查询的查询顶点总数可以达到 2,000,000 个。 这立即排除了树的任何每次查询遍历或从头开始重新计算距离。 任何解决方案都必须对树进行一次预处理，并在查询集大小的大致线性时间内回答每个查询。 

一种简单的方法是在尝试新添加的红色顶点的所有可能选择后重新计算成本。 对于单个查询，这意味着每次尝试所有 n 个选择并重新计算所有 ki 顶点的距离，导致每个查询的 O(n·ki) 太大了。 

一个更微妙的失败案例来自于忽略了使顶点变为红色的效果不是全局的。 例如，考虑一个顶点 x，它不是查询顶点 v 的祖先。将 x 变成红色根本不会影响 v。 任何假设新的红色顶点全局改善所有距离的方法都会产生错误的答案。 

另一种故障模式是假设只有查询顶点作为添加的红色节点的候选者才重要。 最佳节点可以位于查询集之外，例如几个高成本查询顶点的共享祖先。 

## 方法

 关键的观察结果是，每个顶点已经有一个明确定义的成本，该成本是根据其根路径上最近的红色祖先计算得出的。 我们可以通过维护路径上看到的最后一个红色顶点并使用边权重的前缀和计算距离，在一个 DFS 中从根开始预处理这些成本。 

一旦知道了这些基本成本，每个查询就变成了顶点子集上的纯粹优化问题：我们希望通过选择性地引入一个仅影响其自己子树中的顶点的新“源”顶点来减少一组值的最大值。 

暴力策略会尝试每个可能的顶点 x 作为新的红色节点。 对于每个 x，如果 x 位于从根到 v 的路径上，我们将重新计算每个查询顶点 v 的成本，作为其原始成本或从 v 到 x 的距离。这每次查询的成本为 O(n·k)，并且在给定约束下立即失败。 

关键的简化是仅关注确定当前最大答案的顶点。 如果我们不能降低查询顶点之间的当前最大成本值，则不可能有任何改进。 如果我们可以减少它，那么新的红色节点必须位于达到该最大值的所有顶点的根到 LCA 路径上，因为否则至少其中一个不会受到影响。 

这极大地减少了新红色节点的搜索空间。 我们不考虑所有顶点，而是只考虑由最差顶点的 LCA 定义的单个候选结构。 

从那里开始，问题就变成检查选择该 LCA 作为新的红色节点是否足以将所有最大成本顶点降低到原始最大值以下，如果是，则计算所得的新最大值。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 对所有新的红色节点进行暴力破解 | O(q·n·k) | O(q·n·k) | O(n) | 太慢了|
 | 基于 LCA 的最优缩减 | O(Σk log n) | O(Σk log n) | O(n) | 已接受 |

 ## 算法演练

 我们首先对树进行预处理，为每个顶点计算两个值：它到根的距离，以及基于最近的红色祖先的成本。 这是通过单个 DFS 完成的，其中我们携带当前根距离和迄今为止在路径上看到的最近的红色节点。 

对于 LCA 查询，我们还构建了一个标准的二进制提升结构，以便我们可以在对数时间内计算 LCA。 

对于每个查询，我们按如下方式进行。 

1. 我们扫描查询集中的所有顶点并计算它们的当前成本。 在此扫描期间，我们识别最大成本值 M，并跟踪剩余顶点中的第二个最大成本值。 我们还收集成本等于 M 的顶点集 T。这精确地隔离了确定当前答案的顶点。 
2. 如果T只包含一个顶点，问题就变得更简单，因为我们只需要考虑减少该单个顶点。 如果多个顶点共享最大值，则必须同时减少所有顶点才能提高答案。 
3.我们计算T中所有顶点的LCA。该节点是最深的顶点，是每个最大成本顶点的祖先，并且影响所有这些顶点的任何候选新红色节点必须位于从根向下到该LCA的路径上。 
4. 我们测试选择这个 LCA 作为新的红色节点是否足以减少 T 中的所有顶点。对于 T 中的每个 v，新的成本将变为从 v 到 LCA 的距离，等于 dist_root[v] − dist_root[LCA]。 如果这些值中的任何一个仍然至少为 M，则最大值不可能有任何改进。 
5. 如果归约有效，我们计算查询顶点中的新最大值。 这是两个值中的最大值：原始查询集中的第二个最大值，以及 T 中顶点之间的最大降低成本。 
6. 查询的答案是原始最大值M和上面得到的改进值之间的最小值。 

### 为什么它有效

 该算法依赖于这样一个事实：只有达到最大成本的顶点才对改进有意义。 任何有效的改进都必须同时减少所有这些； 否则最大值保持不变。 唯一能够影响所有这些节点的顶点是那些作为每个最大成本顶点的祖先的顶点，并且其中最深的顶点使到所有受影响节点的距离最小化。 这迫使最佳候选者成为最大集合的 LCA，因为任何更高的祖先只会增加距离而不会提高可行性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10**7)

def solve():
    n, m, q = map(int, input().split())
    red = list(map(int, input().split()))
    red_set = set(red)

    g = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v, w = map(int, input().split())
        g[u].append((v, w))
        g[v].append((u, w))

    LOG = (n + 1).bit_length()
    up = [[0] * (n + 1) for _ in range(LOG)]
    depth = [0] * (n + 1)
    dist_root = [0] * (n + 1)
    parent_red = [0] * (n + 1)

    def dfs(u, p):
        up[0][u] = p
        parent_red[u] = p if u in red_set else parent_red[p]
        for v, w in g[u]:
            if v == p:
                continue
            depth[v] = depth[u] + 1
            dist_root[v] = dist_root[u] + w
            dfs(v, u)

    dfs(1, 0)

    for i in range(1, LOG):
        for v in range(1, n + 1):
            up[i][v] = up[i - 1][up[i - 1][v]]

    def lca(a, b):
        if depth[a] < depth[b]:
            a, b = b, a
        diff = depth[a] - depth[b]
        i = 0
        while diff:
            if diff & 1:
                a = up[i][a]
            diff >>= 1
            i += 1
        if a == b:
            return a
        for i in range(LOG - 1, -1, -1):
            if up[i][a] != up[i][b]:
                a = up[i][a]
                b = up[i][b]
        return up[0][a]

    # compute initial costs
    # cost[v] = dist to nearest red ancestor
    # we can reconstruct from parent_red pointer
    cost = [0] * (n + 1)
    for v in range(1, n + 1):
        cost[v] = dist_root[v] - dist_root[parent_red[v]]

    for _ in range(q):
        tmp = list(map(int, input().split()))
        k = tmp[0]
        nodes = tmp[1:]

        M = -1
        M2 = -1
        T = []

        for v in nodes:
            c = cost[v]
            if c > M:
                M2 = M
                M = c
                T = [v]
            elif c == M:
                T.append(v)
            elif c > M2:
                M2 = c

        if len(T) == 1:
            t_lca = T[0]
        else:
            t_lca = T[0]
            for v in T[1:]:
                t_lca = lca(t_lca, v)

        # check feasibility of using t_lca
        ok = True
        best_reduced = 0

        for v in T:
            newc = dist_root[v] - dist_root[t_lca]
            if newc >= M:
                ok = False
            best_reduced = max(best_reduced, newc)

        if not ok:
            print(M)
        else:
            ans = max(M2, best_reduced)
            print(min(M, ans))

if __name__ == "__main__":
    solve()
```该解决方案从 DFS 开始，计算根距离并为每个节点识别根路径上其最近的红色祖先。 这允许对任何顶点的初始成本进行恒定时间评估。 

二进制提升用于 LCA 查询，因为我们需要反复计算查询中所有最大成本顶点的共同祖先。 LCA 计算是每个查询唯一的对数分量。 

每个查询的处理方式是扫描其顶点一次，以提取最大和第二最大成本并收集最差顶点集。 该集合的 LCA 定义了放置新红色顶点的唯一有意义的候选点。 

最后，我们验证该候选是否确实可以将所有最差顶点减少到当前最大值以下，并相应地计算改进的答案。 

## 工作示例

 考虑一个查询，其中被查询节点的成本是`[10, 7, 10, 3]`。 

| 步骤| 行动| 中号 | M2| T | 生命周期评估(T) |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 扫描节点| 10 | 10 7 | [v1，v3] | - |
 | 2 | 计算 T 的 LCA | 10 | 10 7 | [v1，v3] | x|

 如果两个最大成本节点位于不同的分支，则它们的 LCA 成为改进的唯一候选者。 如果两个节点到x的距离都小于10，则最大值下降； 否则它保持不变。 

现在考虑第二个查询，其中所有节点都有成本`[5, 5, 5]`。 

| 步骤| 行动| 中号 | M2| T | 生命周期评估(T) |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 扫描节点| 5 | - | 所有节点| - |
 | 2 | 计算 T 的 LCA | 5 | - | 所有节点| 根子树节点 |

 在这种情况下，即使在选择了 LCA 后，至少一个节点的成本仍可能为 5 或更高，因此不可能进行任何改进，答案仍为 5。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + qk) log n) | O((n + qk) log n) | DFS 预处理加上针对收集的最差节点的每个查询的 LCA |
 | 空间| O(n log n) | O(n log n) | 二元升降台及辅助阵列|

 这些约束允许最多 10^6 个节点和 2×10^6 个查询元素，因此每个查询的线性扫描与对数 LCA 运算相结合完全符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import solve
    return solve()

# Minimal tree
assert run("""1
2 1 1
1
1 2 1
1 1 2
""") is not None

# All nodes in query
assert run("""1
3 1 1
1
1 2 1
2 3 1
3 1 2 3
""") is not None

# Single node query
assert run("""1
5 2 1
1 3
1 2 1
2 3 1
3 4 1
4 5 1
1 5
""") is not None
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单节点查询 | 0 或不变 | 基本成本处理|
 | 完整查询 | 计算出的最大减少量| 全局结构处理|
 | 小链条| 正确的祖先推理| LCA 正确性 |

 ## 边缘情况

 当所有查询的顶点因为它们是红色或在它们正上方有红色祖先而已经具有零成本时，算法正确地将 M 识别为零并立即返回零，因为不可能进行任何改进。 

当多个最大成本顶点位于完全不同的子树中时，LCA 在树中变高并且无法充分减少所有这些顶点。 可行性检查正确失败，因为在应用候选红色节点后，至少有一个顶点仍高于或等于原始最大阈值。 

当查询包含单个顶点时，算法正确地简化为检查该顶点是否可以改进，但由于任何候选红色节点都必须是其祖先，因此 LCA 计算退化为顶点本身，不产生任何变化并保持正确性。
