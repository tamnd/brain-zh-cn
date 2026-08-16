---
title: "CF 102419H - 入度"
description: "我们有一个无向图，每条边最终都必须恰好指向其两个端点之一。 对于其值指定为 (ai) 的顶点，恰好 (ai) 入射边必须指向该顶点。 (ai=-1) 的顶点对其最终入度没有限制。"
date: "2026-08-16T09:02:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102419
codeforces_index: "H"
codeforces_contest_name: "SPC 2019"
rating: 0
weight: 102419
solve_time_s: 287
verified: false
draft: false
---

[CF 102419H - 入度](https://codeforces.com/problemset/problem/102419/H)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 47s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个无向图，每条边最终都必须恰好指向其两个端点之一。 对于其值指定为 (a_i) 的顶点，必须正好 (a_i) 条入射边指向该顶点。 (a_i=-1) 的顶点对其最终入度没有限制。 

任务是找到这样的方向，或者证明不存在。 输出包含`NO`， 或者`YES`接下来是每个原始边缘的方向。 对于原始边缘 ((u,v))，打印`u v`表示边从 (u) 指向 (v)，因此 (v) 接收一个入度单位。 

原始约束有 (n,m\le 2000)，没有平行边或自环。 这对于多项式图算法来说足够小，但它排除了枚举方向的算法。 有 (2^m) 个可能的方向，当 (m=2000) 时，即使在恒定时间内检查一个方向也已经是无望的。 具有 (O(n+m)) 个顶点和边的流网络完全在内存限制内，并且标准积分最大流算法是合适的。 

有几种情况很容易处理不当。 

考虑```
2 1
0 0
1 2
```两个顶点都要求入度为零，但唯一的边必须指向某处。 正确答案是`NO`。 仅仅检查每个请求的值至多是相应的度数将错误地接受这种情况。 

现在考虑```
2 1
2 -1
1 2
```顶点 1 的度数为 1，但要求入度为 2。 正确答案是`NO`。 流程构造必须尊重确切的请求量，而不是将其视为上限。 

当一条边连接两个受约束的顶点时，还有一个不太明显的问题。 例如，```
2 1
0 1
1 2
```该边被迫指向顶点 2。仅尝试选择一些边来满足受约束顶点的方法必须确保两个受约束顶点之间的每条边都分配给其中一个。 如果未分配这样的边，以后无法通过将其指向不受约束的顶点来修复，因为两个端点都不受约束。 

最后，两个端点不受约束的边根本不需要参与约束求解部分。 在满足所有约束入度后，该边可以任意定向。 

## 方法

 直接的暴力方法是对每个边尝试两个方向。 深度优先搜索可以对每个边做出一个二元决策，并在达到完整方向后，计算所有入度并检查约束。 这是正确的，因为每个可能的方向都恰好出现在搜索树的一个分支中。 问题在于它的大小：有 (2^m) 个叶子，检查方向需要 (O(m+n))，需要 (O(2^m(m+n))) 工作。 在（m=2000）时，这是完全不可行的。 

有用的观察结果是，定向边可以被视为将一个入度单位分配给恰好一个端点。 我们可以创建一个流决策来说明哪个端点接收该单元，而不是直接决定边缘的方向。 

对于每个相关的原始边，创建一个流节点。 我们可以从边缘节点向任一端点发送一个单元。 受约束的顶点具有必须到达那里的确切数量 (a_i)。 连接两个受约束顶点的边必须将其单元发送到某处，而具有不受约束端点的边可能会离开流网络而不对受约束顶点做出贡献。 

确切的顶点要求和强制约束到约束的边自然地由流的下限和上限表示。 这给出了可行循环问题。 

对于每条边，我们区分三种情况。 如果两个端点都受到约束，则其边缘节点必须恰好接收一个单元。 如果恰好有一个端点受到约束，则其边缘节点可能会向该受约束端点发送零个或一个单元。 如果两个端点都不受约束，我们在求解约束时忽略它，然后任意定向它。 

对于每个受约束的顶点 (v)，从 (v) 到汇点的边的下限和上限都等于 (a_v)。 因此，恰好 (a_v) 个选定的边缘单元必须达到 (v​​)。 

标准下界变换删除下界并记录每个节点处产生的不平衡。 然后添加超级源和超级汇，普通最大流量决定是否存在所需的循环。 

关键联系是到达顶点 (v) 的流单元与指向 (v) 的原始边完全对应。 由于流是完整的，因此每条选定的边都会分配给一个端点，而不会被部分分割。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(2^m(m+n))) | (O(m+n)) | 太慢了 |
 | 下界循环+Dinic | (O(V^2E)) 最坏情况 | (O(V+E)) | 已接受 |

 这里 (V=O(n+m)) 和 (E=O(n+m)) 为构建的网络。 对于 (n,m\le2000)，网络只有几千个顶点和边，Dinic 在这个稀疏、大部分为单位容量的网络上的实际行为足以满足极限。 

## 算法演练

 1. 读取图形并将每个带有 (a_i\ne-1) 的顶点标记为受约束。 存储每条边的原始端点，因为最终答案必须按原始边顺序打印。 
2. 构建一个流网络，其中包含源 (S)、汇 (T)、每个接触至少一个受约束顶点的原始边的一个节点以及每个受约束顶点的一个节点。 

具有两个不受约束端点的边将被省略，因为它永远不会影响所需的入度。 之后可以安全地定向。 
3. 对于每个相关的原始边 (e=(u,v))，创建一个边节点 (E_e)。 

如果 (u) 和 (v) 都受到约束，则添加

[
 S\右箭头 E_e
 ]

 下限和上限均等于 (1)。 该边必须向 (u) 或 (v) 贡献一个传入边。 

如果至少一个端点不受约束，则使用下限 (0) 和上限 (1)。 允许这样的边对受约束的端点做出贡献，但并非必须如此。 

从 (E_e) 开始，将容量 (1) 条边添加到原始边的每个受约束端点。 通过 (E_e\rightarrow v) 发送一个单位意味着将原始边缘朝向 (v)。 
4. 对于每个受约束的顶点 (v)，添加一条边

 [
 v\右箭头 T
 ]

 其下限和上限均为(a_v)。 

由于离开 (v) 的量被迫恰好为 (a_v)，因此流量守恒迫使恰好 (a_v) 个单位进入 (v)。 这正是所需的入度。 
5. 添加容量 (m) 的边 (T\rightarrow S)。 这将网络封闭成一个循环。 它的确切数量并不重要，因为守恒迫使它等于分配给受约束顶点的单位总数。 
6. 将具有下界 (L) 和上限 (R) 的每个有界边 ((u,v)) 转换为容量的普通边 (R-L)。 保持阵列平衡。 从 (u) 的余额中减去 (L)，并将 (L) 添加到 (v) 的余额中。 

天平记录了已被下限强制的流量的影响。 剩余的普通流量必须补偿这些不平衡。 
7. 添加超级源 (SS) 和超级接收器 (TT)。 如果节点有正余额，则添加 (SS\rightarrow v)，其容量等于该余额。 如果余额为负，则添加 (v\rightarrow TT)，其容量等于其绝对余额。 

当从 (SS) 到 (TT) 的最大流量饱和所有这些平衡边缘时，恰好存在可行的循环。 如果没有，则打印`NO`。 
8. 如果循环可行，则检查每个原始相关边从其边节点到其受约束端点的流。 如果一个单元转到 (u)，则将原始边缘朝向 (u)。 如果一个单元转到 (v)，请将其朝向 (v)。 

约束-约束边总是恰好有一个这样的单元，因为它的源到边的流被迫为 1。 对于具有一个不受约束端点的边，零流量仅仅意味着我们将其朝向该不受约束端点。 对于具有两个不受约束端点的边，请选择任一方向。 
9. 打印`YES`以及每个原始边缘的最终方向。 

整个构造过程中的不变性是，进入受约束顶点的每个单元都代表一条且只有一条原始边，其头是该顶点。 受约束顶点的确切下限和上限强制精确地要求其所请求的此类单元的数量。 通过边缘节点的强制流可保证连接两个受约束顶点的每条边缘都收到一个头。 因此，可行的循环直接映射到有效的方向。 相反，任何有效的方向都会通过将一个单元发送到每个边缘节点到该边缘的头部顶点来引发可行的循环，因此流测试无法拒绝真正有效的实例。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(1_000_000)

class Dinic:
    def __init__(self, n):
        self.n = n
        self.g = [[] for _ in range(n)]

    def add_edge(self, u, v, cap):
        idx = len(self.g[u])
        self.g[u].append([v, cap, len(self.g[v])])
        self.g[v].append([u, 0, idx])
        return idx

    def bfs(self, s, t):
        level = [-1] * self.n
        level[s] = 0
        q = [s]
        head = 0

        while head < len(q):
            u = q[head]
            head += 1

            for v, cap, rev in self.g[u]:
                if cap > 0 and level[v] == -1:
                    level[v] = level[u] + 1
                    q.append(v)

        self.level = level
        return level[t] != -1

    def dfs(self, u, t, pushed):
        if u == t:
            return pushed

        g_u = self.g[u]
        while self.it[u] < len(g_u):
            i = self.it[u]
            v, cap, rev = g_u[i]

            if cap > 0 and self.level[v] == self.level[u] + 1:
                got = self.dfs(v, t, min(pushed, cap))
                if got:
                    g_u[i][1] -= got
                    self.g[v][rev][1] += got
                    return got

            self.it[u] += 1

        return 0

    def max_flow(self, s, t):
        flow = 0
        INF = 10**9

        while self.bfs(s, t):
            self.it = [0] * self.n
            while True:
                pushed = self.dfs(s, t, INF)
                if not pushed:
                    break
                flow += pushed

        return flow

def solve(data):
    it = iter(map(int, data.split()))
    n = next(it)
    m = next(it)

    a = [next(it) for _ in range(n)]
    edges = [(next(it), next(it)) for _ in range(m)]

    constrained = [x != -1 for x in a]

    # Node layout:
    # 0 ... n-1                 constrained vertex slots
    # edge_base ... edge nodes
    # S, T, SS, TT
    #
    # We only need vertex nodes for constrained vertices.
    vertex_id = [-1] * n
    vertex_nodes = []

    for v in range(n):
        if constrained[v]:
            vertex_id[v] = len(vertex_nodes)
            vertex_nodes.append(v)

    k = len(vertex_nodes)
    edge_base = k
    relevant = []

    for i, (u, v) in enumerate(edges):
        u -= 1
        v -= 1

        if constrained[u] or constrained[v]:
            relevant.append(i)

    r = len(relevant)

    S = k + r
    T = S + 1
    SS = T + 1
    TT = SS + 1
    N = TT + 1

    dinic = Dinic(N)
    balance = [0] * N

    # Store references to edge-node -> constrained-vertex arcs.
    # Each entry is (edge_index, original_endpoint, network_u, arc_index).
    choice_arcs = []

    def add_bounded(u, v, low, high):
        if low > high:
            return False

        cap = high - low
        dinic.add_edge(u, v, cap)

        balance[u] -= low
        balance[v] += low
        return True

    # Source -> edge node.
    for pos, ei in enumerate(relevant):
        u, v = edges[ei]
        u -= 1
        v -= 1

        enode = edge_base + pos

        if constrained[u] and constrained[v]:
            low = high = 1
        else:
            low, high = 0, 1

        if not add_bounded(S, enode, low, high):
            return "NO\n"

        if constrained[u]:
            idx = dinic.add_edge(enode, vertex_id[u], 1)
            choice_arcs.append((ei, u, enode, idx))

        if constrained[v]:
            idx = dinic.add_edge(enode, vertex_id[v], 1)
            choice_arcs.append((ei, v, enode, idx))

    # Every constrained vertex must receive exactly a[v] units.
    for v in vertex_nodes:
        need = a[v]
        if need < 0:
            continue

        # A vertex cannot receive more than its graph degree.
        # The lower-bound construction would reject this anyway,
        # but this check avoids creating an obviously impossible edge.
        degree = 0
        for u, w in edges:
            u -= 1
            w -= 1
            if u == v or w == v:
                degree += 1

        if need > degree:
            return "NO\n"

        if not add_bounded(vertex_id[v], T, need, need):
            return "NO\n"

    # Close the network into a circulation.
    add_bounded(T, S, 0, m)

    # Satisfy all lower-bound imbalances.
    required = 0

    for v in range(N - 2):
        if balance[v] > 0:
            dinic.add_edge(SS, v, balance[v])
            required += balance[v]
        elif balance[v] < 0:
            dinic.add_edge(v, TT, -balance[v])

    got = dinic.max_flow(SS, TT)

    if got != required:
        return "NO\n"

    # Start with arbitrary directions.
    answer = []
    for u, v in edges:
        answer.append([u, v])

    # A relevant edge with flow into a constrained endpoint is directed
    # toward that endpoint.
    selected = {}

    for ei, endpoint, enode, idx in choice_arcs:
        # The residual capacity of the forward edge is 0 exactly when
        # one unit of flow is using it.
        if dinic.g[enode][idx][1] == 0:
            selected[ei] = endpoint

    for ei in relevant:
        u, v = edges[ei]
        u -= 1
        v -= 1

        if ei in selected:
            head = selected[ei]

            if head == u:
                answer[ei] = [v + 1, u + 1]
            else:
                answer[ei] = [u + 1, v + 1]
        else:
            # No constrained endpoint receives this edge.
            # This is possible only when at least one endpoint is free.
            if not constrained[u]:
                answer[ei] = [v + 1, u + 1]
            else:
                answer[ei] = [u + 1, v + 1]

    out = ["YES"]
    for u, v in answer:
        out.append(f"{u} {v}")

    return "\n".join(out) + "\n"

def main():
    data = sys.stdin.buffer.read()
    sys.stdout.write(solve(data.decode()))

if __name__ == "__main__":
    main()
```这`Dinic`类将每个剩余边存储为`[to, capacity, reverse_index]`。 反向索引可以让扩充立即更新反向剩余容量，而无需搜索邻接列表。 

这`add_bounded`函数是下界变换的核心。 对于原始边界 (L\le f\le R)，它创建剩余容量 (R-L)，然后将强制 (L) 单位记录在`balance`。 正平衡意味着该节点具有强制传入流量，必须通过额外的传出流量进行补偿，这就是超级源与其连接的原因。 

只有受约束的顶点才需要实际的顶点节点。 两个自由顶点之间的边对任何需求都没有影响，因此将其从流网络中删除可以使构造更小，而不会改变可行性。 

这`choice_arcs`数组准确地记住哪个剩余边对应于每个原始边的每个可能的头。 最大流量成功后，饱和选择弧意味着一个单元被发送到该端点。 由于当两个端点都受到约束时，每个相关边缘节点只接收一个单元，或者当存在自由端点时最多接收一个单元，因此所选头永远不会有歧义。 

度检查在技术上是多余的，因为循环本身检测到不可能的下界，但它在运行流程之前处理最明显的不可能的情况。 Python 整数具有任意精度，因此不存在整数溢出问题。 

输出重建故意从任意方向开始。 只有参与约束网络的边才会被覆盖。 未选择的相关边必须有一个自由端点，因此将其指向该端点不能违反任何精确的入度要求。 

## 工作示例

 对于示例 1，约束顶点为 (1,2,3,5)，要求的入度为 (1,2,1,0)。 顶点 4 是免费的。 

所选头的有效序列如下所示。 剩余需求是每个受约束顶点仍然需要的传入边的数量。 

| 边缘| 已选头| 优势后剩余需求|
 | ---| ---| ---|
 | (1-2) | 2 | (a=(1,1,1,0)) |
 | (1-3) | 1 | (a=(0,1,1,0)) |
 | (2-3) | 2 | (a=(0,0,1,0)) |
 | (3-4) | 3 | (a=(0,0,0,0)) |
 | (4-5) | 4 | (a=(0,0,0,0)) |

 最后一条边没有分配给受约束的顶点 5，因为它的需求已经为零。 相反，它指向自由顶点 4。 得到的方向正是样本方向：```
1 2
3 1
3 2
4 3
5 4
```该迹证明了中心不变量。 每次选择一个受约束的端点作为头时，其剩余需求就会减少一，只有当所有确切需求都得到满足时，循环才会接受该方向。 

对于示例 2，唯一的区别是顶点 5 现在需要一条传入边。 前四个边可以像以前一样处理，在顶点 5 处留下一个需求单位。 

| 边缘| 已选头| 优势后剩余需求|
 | ---| ---| ---|
 | (1-2) | 2 | (a=(1,1,1,1)) |
 | (1-3) | 1 | (a=(0,1,1,1)) |
 | (2-3) | 2 | (a=(0,0,1,1)) |
 | (3-4) | 3 | (a=(0,0,0,1)) |
 | (4-5) | 5 | (a=(0,0,0,0)) |

 因此，最终边缘从 4 指向 5。最终的方向是```
1 2
3 1
3 2
4 3
4 5
```此处，轨迹使用了一条具有一个自由端点和一个受约束端点的边。 在示例 1 中，允许该边避开受约束的端点，而在示例 2 中，顶点 5 处的确切要求迫使它指向那里。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(V^2E)) Dinic 最坏情况 | 构建的循环网络有(V=O(n+m))和(E=O(n+m)) |
 | 空间| (O(V+E)) | 残差图、余额、原始边和重建数据都是线性的 |

 对于 (n,m\le2000)，在添加剩余边之前，构建的网络仅具有 (O(4000)) 个顶点和 (O(4000)) 到 (O(6000)) 条逻辑边。 该图是稀疏的，几乎所有边缘选择能力都是一。 这完全在 256 MB 内存限制之内，并且对于优化 Dinic 实现的 1 秒限制来说是实用的。 

## 测试用例

 由于该问题允许任何有效的方向，因此测试无法安全地将完整的输出文本与一个固定答案进行比较。 下面的线束检查`YES`或者`NO`结果，并且，对于`YES`，验证每个打印的有向边是否对应于原始边，以及每个受约束的顶点是否准确接收其请求的入度。```python
# Save the editorial solution as solution.py before running these tests.

from solution import solve

def run(inp: str) -> str:
    out = solve(inp)
    tokens = out.split()

    data = list(map(int, inp.split()))
    p = 0

    n = data[p]
    m = data[p + 1]
    p += 2

    a = data[p:p + n]
    p += n

    edges = []
    for _ in range(m):
        u = data[p]
        v = data[p + 1]
        p += 2
        edges.append((u, v))

    if not tokens:
        raise AssertionError("empty output")

    if tokens[0] == "NO":
        return "NO"

    assert tokens[0] == "YES", f"bad first token: {tokens[0]}"
    assert len(tokens) == 1 + 2 * m, "wrong number of output vertices"

    original = {tuple(sorted(e)) for e in edges}
    used = set()
    indeg = [0] * (n + 1)

    q = 1
    for _ in range(m):
        u = int(tokens[q])
        v = int(tokens[q + 1])
        q += 2

        assert 1 <= u <= n
        assert 1 <= v <= n
        assert u != v
        assert tuple(sorted((u, v))) in original
        assert tuple(sorted((u, v))) not in used, "an original edge was repeated"

        used.add(tuple(sorted((u, v))))
        indeg[v] += 1

    assert len(used) == m

    for v in range(1, n + 1):
        if a[v - 1] != -1:
            assert indeg[v] == a[v - 1], (
                f"vertex {v}: expected {a[v - 1]}, got {indeg[v]}"
            )

    return "YES"

# Sample 1
assert run("""\
5 5
1 2 1 -1 0
1 2
1 3
2 3
3 4
4 5
""") == "YES", "sample 1"

# Sample 2
assert run("""\
5 5
1 2 1 -1 1
1 2
1 3
2 3
3 4
4 5
""") == "YES", "sample 2"

# Minimum-size valid graph.
assert run("""\
2 1
0 1
1 2
""") == "YES", "minimum valid case"

# Boundary case: requested in-degree exceeds the actual degree.
assert run("""\
2 1
2 -1
1 2
""") == "NO", "degree upper boundary"

# Both endpoints are constrained and both demand zero.
# The single edge has nowhere valid to point.
assert run("""\
2 1
0 0
1 2
""") == "NO", "mandatory constrained-constrained edge"

# Maximum-size graph with all vertices unconstrained.
# A 2000-cycle has 2000 edges and needs no constrained flow at all.
n = 2000
cycle_edges = "\n".join(
    f"{i} {i + 1}" for i in range(1, n)
) + f"\n{n} 1\n"

max_case = f"{n} {n}\n" + ("-1 " * (n - 1)) + "-1\n" + cycle_edges

assert run(max_case) == "YES", "maximum-size all-free case"

# All-equal exact demands on a cycle.
all_equal_case = f"{n} {n}\n" + ("1 " * (n - 1)) + "1\n" + cycle_edges

assert run(all_equal_case) == "YES", "maximum-size all-equal case"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 1`，要求`0 1`， 边缘`1 2`|`YES`| 最小有效实例和精确的单件需求 |
 |`2 1`，要求`2 -1`， 边缘`1 2`|`NO`| 请求的入度大于可用度|
 |`2 1`，要求`0 0`， 边缘`1 2`|`NO`| 两个受约束顶点之间的边不能保持未分配状态 |
 | 2000 次循环满足各种需求`-1`|`YES`| 最大尺寸图和不相关自由边的处理 |
 | 2000 次循环满足各种需求`1`|`YES`| 所有顶点均受约束且精确要求相同的最大尺寸图 |

 ## 边缘情况

 第一个边缘情况是请求的入度大于顶点度。 为了```
2 1
2 -1
1 2
```顶点 1 的度数为 1，但需要两条传入边。 该结构在从顶点 1 到 (T) 的边上添加了两个下限和上限，而唯一的入射边最多只能贡献一个单位。 循环无法满足下界，因此最大流量失败，算法打印`NO`。 

第二种边缘情况是端点均受到约束的边缘。 为了```
2 1
0 0
1 2
```(1-2) 的边缘节点从 (S) 接收强制的 1 个单元，因为两个端点都受到约束。 它只能将该单元发送到顶点 1 或顶点 2，但这两个顶点的精确出站 (T) 要求均为零。 由此产生的不平衡无法修复，因此流程报告不可行。 这捕获了将约束网络中的每条边视为可选的常见错误。 

第三种边缘情况是受约束顶点和不受约束顶点之间的边。 考虑```
2 1
0 -1
1 2
```边缘节点对受约束的顶点 1 的可选容量为 1。由于顶点 1 需要 0，因此流不会通过该选择发送任何内容。 在重建过程中，算法发现未选择该边作为受约束端点，而是将其指向顶点 2。 输出有效`1 2`，根据需要给予顶点 1 入度零。 

第四种边缘情况是每个顶点都不受约束的图。 在具有全部(a_i=-1)的2000循环中，流网络没有约束顶点要求，并且循环边不需要参与循环。 该算法简单地为所有方向选择任意方向并打印`YES`。 这就是为什么可以安全地从流模型中省略自由边。 

最后一种情况是全约束情况。 对于一个三角形```
3 3
1 1 1
1 2
2 3
3 1
```每条边都连接两个受约束的顶点，因此每个边节点都被迫携带一个单元。 三个顶点各需要一个单元，因此循环可以将三个单元发送到三个顶点，例如产生有向循环 (1\rightarrow2), (2\rightarrow3), (3\rightarrow1)。 每个顶点恰好接收一条边。 该案例表明，当没有不受约束的顶点时，下界构造也可以处理原始的规定度方向问题。
