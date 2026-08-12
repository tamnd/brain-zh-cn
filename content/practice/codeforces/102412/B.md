---
title: "CF 102412B - 六路圣人阿列克谢"
description: "将每个党员视为一个顶点。 左侧有 (n) 个顶点，编号为 (1) 到 (n)，右侧有 (n) 个顶点，编号为 (n+1) 到 (2n)。 每个问题都会在一个左顶点和一个右顶点之间创建一条边。"
date: "2026-08-10T13:43:45+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102412
codeforces_index: "B"
codeforces_contest_name: "MEX Foundation Contest (supported by AIM Tech)"
rating: 0
weight: 102412
solve_time_s: 352
verified: true
draft: false
---

[CF 102412B - 六路圣人阿列克谢](https://codeforces.com/problemset/problem/102412/B)

 **评级：** -
 **标签：** -
 **求解时间：** 5m 52s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 将每个党员视为一个顶点。 左侧有 (n) 个顶点，编号为 (1) 到 (n)，右侧有 (n) 个顶点，编号为 (n+1) 到 (2n)。 每个问题都会在一个左顶点和一个右顶点之间创建一条边。 多个问题可能会连接同一对构件，因此允许平行边。 

所有作业完成后，每个成员选择一个分配给他们的问题。 当一个问题的两个端点都选择该问题时，该问题就得到了解决。 由于每个成员最多选择一个问题，因此解决问题的最大可能数量正是该二部多重图的最大匹配大小。 任务是精确选择 (m) 条边，以便最大匹配的大小介于 (l) 和 (r) 之间，同时最小化由每个顶点度数确定的工资总和。 

如果顶点 (i) 接收度数 (d_i)，则其贡献为 (p_{i,d_i})。 因此，实际的图结构仅通过两件事起作用：每个顶点的度数决定成本，而这些度数的连接方式决定最大匹配。 

边界 (n,m\le30) 是主要线索。 (m) 或 (n) 的算法指数已经太大了，因为 (30) 足够大，甚至 (2^{30}) 也约为十亿。 另一方面，具有由 (30) 限制的几个维度的多项式算法是现实的。 预期的解决方案使用从 (0) 到 (n) 或 (m) 的多个计数器，给出 (O(n^3m^3)) 动态程序。 公认的 C++ 实现正是使用这种渐近方法。 

有一个有点令人惊讶的输入边界。 这些示例包含 (m=0)，尽管该语句的某些副本将 (m) 与正下界一起描述。 实现自然应该支持（m=0）。 例如，```
2 0 2 2
8
9
3
4
```根本没有边，所以它的最大匹配是 (0)，而不是 (2)。 正确的输出是```
DEFEAT
```假设至少一个问题并盲目尝试构建匹配的粗心解决方案在这里可能会失败。 

另一个边缘情况是 (l=0)。 如果所需的间隔包含零，则只要 (m=0) 就允许无边图。 例如，```
1 0 0 0
7
9
```答案为 (16)，因为两个成员的度数均为零且最大匹配为零。 总是尝试创建正大小匹配的解决方案会错误地报告失败。 

匹配的上限也很重要。 例如，```
2 1 2 2
0 0
0 0
0 0
0 0
```仅包含一个问题，因此只有一条边，因此大小 (2) 的匹配是不可能的。 正确的输出是`DEFEAT`。 仅基于可用成员数量的天真检查可能会错误地认为每一侧有两个成员就足够了。 

最后，不得将平行边视为单独的匹配机会。 和```
2 2 2 2
0 0 0
0 0 0
0 0 0
0 0 0
```这两个问题都可以连接同一对成员，但这两个问题仍然只产生一个已解决的问题，因为相同的两个成员不能各自选择两个不同的问题。 该图有两条平行边，但其最大匹配为(1)。 任何将 (m) 问题视为独立匹配对的实现都会出错。 

## 方法

 最直接的方法是确定每个问题的两个端点。 一个问题有 (n^2) 个可能的对，因此枚举所有分配考虑

 [
 (n^2)^m=n^{2m}
 ]

 图表。 对于最大值 (n=m=30)，在计算每个图的最大匹配之前，这是 (900^{30})，大约 (10^{88}) 种可能性。 该方法是正确的，因为最终会考虑所有可能的分配，但它几乎立即变得无用。 

有用的观察是薪水仅取决于顶点度。 我们应该避免直到最后才决定确切的终点。 相反，我们可以通过仔细选择的匹配和顶点覆盖来描述图，因为二分图具有最大匹配的大小等于最小顶点覆盖的大小的属性。 这就是柯尼希定理。 

假设我们希望最终的最大匹配恰好是(k)。 我们可以明确选择 (k) 条匹配边和恰好包含 (k) 个顶点的顶点覆盖。 每条匹配边必须恰好包含一个覆盖顶点。 每一条边必须至少包含一个覆盖顶点。 然后所选的覆盖层大小为 (k)，因此任何匹配都不能具有超过 (k) 条边，而显式构造的匹配具有 (k) 条边。 因此最大匹配恰好是(k)。 

这是关键的减少。 我们不需要推理任意图的连通性，而只需要确定每个成员的度、它是否是（k）条匹配边之一的端点以及它是否属于覆盖。 

对于左侧，定义 (x_1) 为匹配端点的数量，(x_2) 为属于封面的匹配端点的数量，(x_3) 为入射到左侧的不匹配边的数量，(x_4) 为左端点在封面中的不匹配关联的数量。 右侧类似地定义 (y_1,y_2,y_3,y_4)。 

最后我们需要

 [
 x_1=y_1=k,
 ]

 因为匹配有 (k) 条边，并且每个匹配边的每一侧都有一个端点。 我们还需要

 [
 x_2+y_2=k,
 ]

 因为每条匹配的边必须在覆盖层中恰好有一个端点。 有 (m-k) 条不匹配的边，所以

 [
 x_3=y_3=m-k。 
]

 最后，每个不匹配的边缘都必须接触盖子。 数量 (x_4) 和 (y_4) 计数覆盖这些边缘上的发生次数。 两个端点都在覆盖层内的边贡献两次，因此充要条件是

 [
 x_4+y_4\ge m-k。 
]

 DP 独立地找到满足这些计数器的最便宜的左侧和右侧分配。 然后我们组合兼容的状态。 

原始社论描述了相同的四个计数器和 (O(n^3m^3)) DP，然后是一个将所选度信息实现为实际边缘的构造性过程。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n^{2m}\cdot n^3)) | (O(n^2+m)) | 太慢了|
 | 最佳DP | (O(n^3m^3)) | (O(n^3m^2)) 稀疏 Python 表示 | 已接受 |

 ## 算法演练

1. 将问题解释为二部多重图的边。 会员的学位恰好是分配给该会员的问题数量，因此选择学位决定了薪资贡献。 
2. 使用 (l\le k\le r) 确定所需的最大匹配大小 (k)。 我们将明确构建 (k) 个边的匹配和 (k) 个顶点的顶点覆盖。 根据 Kőnig 定理，使两个结构都具有大小 (k) 足以强制最大匹配精确为 (k)。 
3. 对于每一边，用动态程序逐个处理它的（n）个顶点。 状态为 ((x_1,x_2,x_3,x_4))。 这里 (x_1) 计算选定的匹配端点，(x_2) 计算作为覆盖顶点的匹配端点，(x_3) 计算不匹配的边关联，(x_4) 计算端点在覆盖中的那些关联。 
4. 当处理一个顶点时，令(c)为其不匹配的入射边的数量。 存在三种可能的角色。 顶点可以在匹配之外并且在覆盖之外，给出度(c)。 它可以是匹配端点，但不是覆盖顶点，给出度数 (c+1)。 或者它既可以是匹配端点又可以是覆盖顶点，再次给出度数 (c+1)，而其 (c) 不匹配边也对 (x_4) 做出贡献。 
5. 将相应的工资(p_{i,d})添加到DP成本中。 由于工资仅取决于最终的学位 (d)，因此在 DP 期间，边缘的确切目的地并不重要。 
6. 处理完一侧的所有顶点后，合并两侧。 对于固定的 (k)，要求两侧都有 (k) 个匹配端点和恰好 (m-k) 个不匹配的事件。 对状态，其在匹配端点上的覆盖计数总和为 (k)，并且其在不匹配边上的覆盖发生率总和至少为 (m-k)。 
7. 保持所有兼容州之间的最低总工资。 如果任何 (k\in[l,r]) 都不存在兼容对，则打印`DEFEAT`。 
8. 从DP父指针中恢复每个顶点的选定度数和角色。 恢复的信息告诉我们哪些顶点是匹配端点，哪些是覆盖顶点，以及每个顶点的最终度数。 
9. 首先构造(k)条匹配边。 覆盖物外部的左匹配顶点与覆盖物内部的右匹配顶点配对。 覆盖物内部的左匹配顶点与覆盖物外部的右匹配顶点配对。 这两个组的大小完全相等，因为 (x_2+y_2=k)。 
10. 一些不匹配的边需要覆盖层中的两个端点。 此类边的数量由放置匹配边后覆盖顶点的剩余度数确定。 连接两侧的覆盖顶点，直到创建所需数量的双覆盖边。 
11. 现在可以使用一侧的覆盖顶点与另一侧的非覆盖匹配顶点之间的边来满足所有剩余的度数。 每条剩余的边都恰好有一个覆盖端点，因此每条边都被覆盖。 
12. 输出结果（m）对。 允许使用平行边，因此构造不需要避免多次使用同一对边。 

DP 背后的不变性是，每个存储状态都描述了第一个处理的顶点的可实现的部分分配，具有精确记录的匹配和覆盖事件以及这些计数器的最低可能工资。 当两个最终状态满足四个兼容性方程时，该构造将创建大小 (k) 的匹配和大小 (k) 的覆盖。 匹配证明图至少有(k)个匹配数，而覆盖证明图最多有(k)个匹配数。 因此它的最大匹配恰好是 (k)，并且因为 (k\in[l,r])，该图是有效的。 由于 DP 最小化了每个州的工资，并且最终的枚举考虑了每对兼容的州，因此所选图具有全局最小成本。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**30

def dp_side(cost, n, m, r):
    """
    DP over one side.

    State:
        (x1, x2, x3, x4)

    x1 = number of matching endpoints
    x2 = number of matching endpoints in the cover
    x3 = number of nonmatching edge incidences
    x4 = number of those incidences whose endpoint is in the cover

    Returns:
        dp      : final-state -> minimum cost
        parents : parent information for reconstruction
    """

    dp = {(0, 0, 0, 0): 0}
    parents = [None] * (n + 1)
    parents[0] = {}

    for i in range(1, n + 1):
        ndp = {}
        par = {}

        for state, old_cost in dp.items():
            x1, x2, x3, x4 = state

            remaining = m - x1 - x3

            for c in range(remaining + 1):
                nx3 = x3 + c

                # Vertex is neither a matching endpoint nor a cover vertex.
                ns = (x1, x2, nx3, x4)
                value = old_cost + cost[i - 1][c]

                if value < ndp.get(ns, INF):
                    ndp[ns] = value
                    par[ns] = (state, 1, c)

                # The vertex is a matching endpoint, but not in the cover.
                if x1 < r and remaining - c > 0:
                    ns = (x1 + 1, x2, nx3, x4)
                    value = old_cost + cost[i - 1][c + 1]

                    if value < ndp.get(ns, INF):
                        ndp[ns] = value
                        par[ns] = (state, 2, c + 1)

                    # The vertex is both a matching endpoint and a cover vertex.
                    ns = (x1 + 1, x2 + 1, nx3, x4 + c)
                    value = old_cost + cost[i - 1][c + 1]

                    if value < ndp.get(ns, INF):
                        ndp[ns] = value
                        par[ns] = (state, 3, c + 1)

        dp = ndp
        parents[i] = par

    return dp, parents

def reconstruct(parents, final_state, n):
    degree = [0] * n
    matched = [False] * n
    cover = [False] * n

    state = final_state

    for i in range(n, 0, -1):
        prev, kind, d = parents[i][state]

        degree[i - 1] = d

        if kind == 2:
            matched[i - 1] = True
        elif kind == 3:
            matched[i - 1] = True
            cover[i - 1] = True

        state = prev

    return degree, matched, cover

def solve_case(n, m, l, r, costs):
    left = costs[:n]
    right = costs[n:]

    left_dp, left_parents = dp_side(left, n, m, r)
    right_dp, right_parents = dp_side(right, n, m, r)

    best = INF
    best_states = None

    max_k = min(r, n, m)

    for k in range(l, max_k + 1):
        nonmatching = m - k

        for x2 in range(k + 1):
            y2 = k - x2

            for x4 in range(nonmatching + 1):
                min_y4 = nonmatching - x4

                for y4 in range(min_y4, nonmatching + 1):
                    ls = (k, x2, nonmatching, x4)
                    rs = (k, y2, nonmatching, y4)

                    lc = left_dp.get(ls)
                    rc = right_dp.get(rs)

                    if lc is None or rc is None:
                        continue

                    value = lc + rc

                    if value < best:
                        best = value
                        best_states = (ls, rs)

    if best_states is None:
        return None

    left_state, right_state = best_states

    left_degree, left_matched, left_cover = reconstruct(
        left_parents, left_state, n
    )
    right_degree, right_matched, right_cover = reconstruct(
        right_parents, right_state, n
    )

    # Vectors are indexed by cover status and matching status.
    groups = [[[], []], [[], []]]

    for i in range(n):
        if left_matched[i]:
            groups[0][1 if left_cover[i] else 0].append(i)
        if right_matched[i]:
            groups[1][1 if right_cover[i] else 0].append(i)

    edges = []

    def add_edge(u, v):
        edges.append((u + 1, v + n + 1))
        left_degree[u] -= 1
        right_degree[v] -= 1

    # Construct the k matching edges.
    #
    # Left non-cover matching vertices pair with right cover
    # matching vertices, and vice versa.
    if len(groups[0][0]) != len(groups[1][1]):
        raise AssertionError("invalid matching partition")
    if len(groups[0][1]) != len(groups[1][0]):
        raise AssertionError("invalid matching partition")

    for u, v in zip(groups[0][0], groups[1][1]):
        add_edge(u, v)

    for u, v in zip(groups[0][1], groups[1][0]):
        add_edge(u, v)

    # Rebuild groups using remaining degrees.
    rem_groups = [[[], []], [[], []]]

    for side in range(2):
        for i in range(n):
            if side == 0:
                d = left_degree[i]
                is_cover = left_cover[i]
            else:
                d = right_degree[i]
                is_cover = right_cover[i]

            if d > 0:
                rem_groups[side][1 if is_cover else 0].append(i)

    # First create edges covered at both endpoints.
    #
    # The amount is exactly the excess cover incidence after all
    # edges with one cover endpoint are accounted for.
    left_cover_degree = sum(
        left_degree[i] for i in range(n) if left_cover[i]
    )
    right_noncover_degree = sum(
        right_degree[i] for i in range(n) if not right_cover[i]
    )

    double_edges = left_cover_degree - right_noncover_degree

    p = rem_groups[0][1]
    q = rem_groups[1][1]

    while double_edges > 0:
        if not p or not q:
            raise AssertionError("failed to construct double-covered edges")

        u = p[-1]
        v = q[-1]
        add_edge(u, v)
        double_edges -= 1

        if left_degree[u] == 0:
            p.pop()
        if right_degree[v] == 0:
            q.pop()

    # Finish all remaining edges. Every such edge has exactly one
    # cover endpoint.
    for side in range(2):
        p = rem_groups[side][0]
        q = rem_groups[1 - side][1]

        while p:
            if not q:
                raise AssertionError("failed to construct remaining edges")

            if side == 0:
                u = p[-1]
                v = q[-1]
                add_edge(u, v)
            else:
                u = q[-1]
                v = p[-1]
                add_edge(u, v)

            if left_degree[u] == 0:
                p.pop()
            if right_degree[v] == 0:
                q.pop()

    if len(edges) != m:
        raise AssertionError("wrong number of edges")

    if any(left_degree) or any(right_degree):
        raise AssertionError("degrees were not fully constructed")

    return best, edges

def solve():
    n, m, l, r = map(int, input().split())

    costs = []
    for _ in range(2 * n):
        costs.append(list(map(int, input().split())))

    result = solve_case(n, m, l, r, costs)

    if result is None:
        print("DEFEAT")
        return

    answer, edges = result

    out = [str(answer)]
    out.extend(f"{u} {v}" for u, v in edges)
    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```实施的第一部分，`dp_side`，独立处理一组。 四个计数器存储为一个元组，字典仅保留实际可达的状态。 这在 Python 中特别有用，因为完整的六维数组需要大量的对象开销。 

对于具有 (c) 条不匹配边的顶点，第一个过渡为其指定度数 (c)。 其他两个转换分配度数 (c+1)，因为顶点另外接收一条匹配边。 第三个转换还将覆盖发生率计数器增加了 (c)，因为所有这些不匹配的边在该顶点处都有一个覆盖端点。 

条件`remaining - c > 0`匹配转换之前防止 DP 在所有 (m) 个边缘槽已被消耗后创建匹配边缘。 这是最容易出错的边界条件。 匹配端点始终需要除 (c) 条不匹配边之外的一条附加边。 

重建过程向后遍历存储的父字典。 对于每个处理过的成员，它恢复其度数、是否是匹配端点以及是否是覆盖顶点。 

最终状态枚举使用

 [
 (k,x_2,m-k,x_4)
 ]

 在左边和

 [
 (k,k-x_2,m-k,y_4)
 ]

 在右边。 下界

 [
 y_4\ge m-k-x_4
 ]

 正是要求 (m-k) 个不匹配边各至少有一个覆盖端点。 

构造有意首先创建匹配。 当从剩余度数要求中移除这（k）条边之后，两侧的剩余度数总和相等。 一些剩余边必须覆盖两次，并将它们放置在覆盖顶点之间。 一旦这些被移除，每个剩余的边都可以放置在覆盖顶点和非覆盖顶点之间。 平行边是完全合法的，因此不需要额外的限制。 

Python 整数具有任意精度，因此大至 (10^9) 的工资值及其最多 (2n) 个成员的总和不需要任何特殊的溢出处理。 

## 工作示例

 ### 示例 1

 第一个样本是```
2 0 2 2
8
9
3
4
```没有问题，因此每个顶点的度数为零。 唯一可能的图具有最大匹配 (0)。 

相关的最终DP状态是双方的零状态。 

| 数量 | 左| 对|
 | ---| ---| ---|
 | 匹配端点 | 0 | 0 |
 | 覆盖匹配端点 | 0 | 0 |
 | 不匹配的发生率 | 0 | 0 |
 | 涵盖不匹配的事件 | 0 | 0 |
 | 成本| 17 | 17 7 |

 所需的匹配大小必须介于 (2) 和 (2) 之间，但唯一可能的值为 (0)。 不存在兼容的最终状态，因此算法打印`DEFEAT`。 

此示例确认了 DP 在 (m=0) 时不会发明边，并且根据实际匹配大小检查请求的下限。 

### 示例 2

 第二个样本具有 (n=2)、(m=8) 和 (l=r=2)。 一种最佳度模式是

 [
 d_L=(4,4),\qquad d_R=(5,3),
 ]

 谁的成本是

 [
 p_{1,4}+p_{2,4}+p_{3,5}+p_{4,3}
 =-10+0-9-2=-21。 
]

 相应的最终状态可以描述如下。 

| 数量 | 左| 对|
 | ---| ---| ---|
 | (k) | 2 | 2 |
 | 匹配端点 (x_1,y_1) | 2 | 2 |
 | 匹配封面中的端点 (x_2,y_2) | 2 | 0 |
 | 不匹配的发生率 (x_3,y_3) | 6 | 6 |
 | 涵盖的不匹配事件 (x_4,y_4) | 6 | 0 |
 | 成本| -10 | -11 |

 匹配大小为(k=2)。 两个左侧匹配的顶点都在覆盖中，因此每个不匹配的边也可以从左侧覆盖。 由于存在 (m-k=6) 个不匹配的边，并且左侧提供了六个覆盖事件，因此所有六个都被覆盖。 

示例输出使用边 ((1,3)) 的四个副本、涉及顶点 (2) 和顶点 (4) 的三个边以及一条边 ((2,3))。 它的度数序列正是上面的，并且两个左顶点是唯一的非零左顶点，因此最大匹配正好是（2）。 官方样本给出了总成本（-21）。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n^3m^3)) | 对于 (n) 个顶点和两条边中的每一个，四个计数器有 (O(n^2m^2)) DP 状态，每次转换最多有 (O(m)) 度选择 |
 | 空间| (O(n^3m^2)) | Python 实现存储所有 (n) 层的可达状态和重建信息 |

 预期的界限仅为 (n,m\le30)，这使得六计数器公式在低级实现中实用。 官方规定时间限制为2秒，内存限制为1024 MiB。 

最初接受的实现使用相同的 (O(n^3m^3)) DP 并将完整的 DP 结构存储在数组中。 Python 版本使用稀疏字典来避免分配巨大的多维对象数组，用一些常数因子的速度换取更简单的内存管理。 

## 测试用例

 下面的测试工具假设提交的代码保存为`solution.py`。 它检查确切的答案值，同时允许任何有效的构造，因为问题明确允许任意最佳解决方案。```python
# helper: run solution on input string, return output string
import subprocess
import sys

def run(inp: str) -> str:
    result = subprocess.run(
        [sys.executable, "solution.py"],
        input=inp.encode(),
        stdout=subprocess.PIPE,
        check=True,
    )
    return result.stdout.decode().strip()

sample1 = """\
2 0 2 2
8
9
3
4
"""

assert run(sample1) == "DEFEAT", "sample 1"

sample2 = """\
2 8 2 2
2 5 5 10 -10 -1 3 5 9
8 -10 9 9 0 1 -3 1 -1
0 5 -1 5 3 -9 1 10 6
5 -4 8 -2 2 -8 6 3 -3
"""

out = run(sample2).splitlines()
assert int(out[0]) == -21, "sample 2"

sample3 = """\
3 5 2 3
100 75 125 150 175 200
125 100 75 100 125 150
225 200 175 200 225 250
225 200 175 200 225 250
125 100 75 100 125 150
100 75 125 150 175 200
"""

out = run(sample3).splitlines()
assert int(out[0]) == 650, "sample 3"

# Minimum-size case: no problems, matching number must be zero.
case_min = """\
1 0 0 0
7
9
"""

assert run(case_min) == "16", "minimum-size case"

# Boundary case: one edge cannot create a matching of size two.
case_boundary = """\
2 1 2 2
0 0
0 0
0 0
0 0
"""

assert run(case_boundary) == "DEFEAT", "matching upper-bound case"

# All costs are equal, so every feasible construction has the same cost.
case_equal = """\
2 2 1 1
5 5 5
5 5 5
5 5 5
5 5 5
"""

out = run(case_equal).splitlines()
assert int(out[0]) == 20, "all-equal costs"

# Maximum-size instance. With 30 problems and a required matching
# of 30, every one of the 60 vertices must have degree exactly one.
rows = ["0 1" for _ in range(60)]
case_max = "30 30 30 30\n" + "\n".join(rows) + "\n"

out = run(case_max).splitlines()
assert int(out[0]) == 60, "maximum-size case"
assert len(out) == 31, "maximum-size edge count"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品1 |`DEFEAT`| 零问题和不可能的匹配下限 |
 | 样品2 |`-21`| 最优成本和非平凡的平行边构造 |
 | 样品 3 |`650`| 第二次正式可行建设|
 | (n=1,m=0,l=r=0) |`16`| 最小尺寸和零匹配案例|
 | (n=2,m=1,l=r=2) |`DEFEAT`| 匹配上限和离一处理 |
 | (n=2,m=2,l=r=1)，所有成本 (5) |`20`| 一切均等的成本和刻意的非完美匹配|
 | (n=m=30，l=r=30) |`60`| 最大尺寸边界与完美匹配 |

 ## 边缘情况

 对于零问题的情况，```
1 0 0 0
7
9
```DP 在 ((0,0,0,0)) 开始和结束。 没有过渡选择，因为没有要分配的边。 左成本为(7)，右成本为(9)，匹配大小为(0)，属于请求区间。 答案是（16）。 

对于不可能的下界，```
2 1 2 2
0 0
0 0
0 0
0 0
```DP 无法产生 (k=2) 的最终状态，因为匹配端点消耗了一个完整的边，并且只有一个可用的边。 最终的枚举没有候选状态，所以`DEFEAT`被生产出来。 

对于重复的边，请考虑```
2 2 1 1
5 5 5
5 5 5
5 5 5
5 5 5
```这两个问题可以分配给同一对。 左度和右度都包含一个二度顶点和一个零度顶点。 该图有两条平行边，但只有一对可能的匹配对，因此其最大匹配为 (1)。 DP 允许这样做，因为它记录学位而不是禁止重复配对。 总成本为(20)。 

对于最大匹配边界，```
30 30 30 30
```每个工资行等于`0 1`，需要尺寸 (30) 的匹配。 由于只有 (30) 个问题，因此每个问题都必须属于匹配，因此 (60) 个顶点中的每个顶点的度数恰好为 1。 因此，总工资为（60）。 DP达到(k=30)和(m-k=0)，因此不匹配的计数器都为零。 这会锻炼出不会产生残留边缘的精确边界。 

对于负工资，DP决不能认为学位越高就越贵。 在第二个官方样本中，一些条目是负的，并且最优故意将四度分配给前两个左顶点，将五度分配给一个右顶点。 基于为每个成员独立选择最便宜度数的贪婪策略将会失败，因为每一侧的度数之和必须为 (m)，并且必须同时支持所需的匹配和覆盖结构。 DP 考虑所有兼容学位选择并最大限度地降低其总成本。 该样本的官方答案是（-21）。 

主要概念边缘情况是最大匹配小于任一侧非零度顶点数量的图。 仅仅计算活动顶点不足以确定匹配数量。 DP 的覆盖部分正是处理这种情况：可以将多个活动顶点强制放入仅由 (k) 个顶点覆盖的结构中，这将最大匹配限制为 (k)。 这就是为什么仅跟踪度数或仅跟踪非零顶点的数量会丢失重要信息的原因。 

最终的结构还处理两个端点覆盖的边缘。 这样的边贡献两次覆盖入射，因此(x_4+y_4)可能严格大于(m-k)。 该构造首先准确地创建所需数量的这些双覆盖边，然后使用具有一个覆盖端点的边来分配所有剩余的度数。 这就是使最终度数序列同时满足工资DP和顶点覆盖条件的原因。 

解决类似问题的核心思想是首先停止考虑精确的图形。 工资关心的是学位，而匹配约束可以通过将匹配与顶点覆盖配对来证明。 一旦这两个结构被小计数器编码，图本身就可以在之后重建。
