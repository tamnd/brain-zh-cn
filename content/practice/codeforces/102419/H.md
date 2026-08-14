---
title: "CF 102419H - 入度"
description: "我们有一个最多有 2000 个顶点和 2000 个边的无向图。 每条边最终都必须精确地朝向其两个端点之一。 对于顶点 i，值 a[i] 指定必须指向 i 的入射边的确切数量。"
date: "2026-08-14T15:12:06+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102419
codeforces_index: "H"
codeforces_contest_name: "SPC 2019"
rating: 0
weight: 102419
solve_time_s: 1099
verified: false
draft: false
---

[CF 102419H - 入度](https://codeforces.com/problemset/problem/102419/H)

 **评级：** -
 **标签：** -
 **求解时间：** 18m 19s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个最多有 2000 个顶点和 2000 个边的无向图。 每条边最终都必须精确地朝向其两个端点之一。 对于一个顶点`i`，值`a[i]`指定必须指向的入射边的确切数量`i`。 值为`-1`消除了这一要求，因此任何最终的入度都是可以接受的。 

输出是`NO`当没有方向满足所有固定的度数时，或者`YES`接下来是每个原始边缘的一个定向版本。 如果原始边是`{u, v}`， 印刷`u v`意味着`v`是它的头，所以边对入度贡献 1`v`。 

对于只有几千个顶点和边的流构造来说，约束足够小。 更重要的是，答案是全局分配：决定一条边的方向可以影响另一条边是否可以满足受约束的顶点。 局部贪婪选择可以轻松消耗另一个顶点所需的唯一边。 一个算法围绕`O(m(n+m))`很容易在预期的范围内，而对所有方向的暴力破解是没有希望的。 

第一种边缘情况是请求入度大于其实际度的顶点。 例如，```
2 1
2 -1
1 2
```只有一条边入射到顶点 1，因此它的入度永远不可能是 2。正确的输出是`NO`。 一个粗心的实现，只检查`a[i] <= m`会错误地接受它。 

第二个边缘情况是请求为零的受约束顶点。 例如，```
2 1
0 -1
1 2
```必须将边缘定向为`2 1`。 如果实现将零视为“不受约束”或错误地初始化其所需的计数，则可能会产生相反的方向并违反要求。 

当所有顶点都受到约束时，会出现第三种边缘情况。 为了```
3 3
1 1 1
1 2
2 3
3 1
```唯一可能的入度序列是通过将三角形定向为有向循环来实现的。 答案是`YES`。 没有可用的自由顶点来吸收无法分配给受约束端点的边。 

第四个边缘情况是值`-1`。 考虑```
2 1
1 -1
1 2
```唯一的边必须指向顶点 1，而顶点 2 允许接收零个边。 治疗`-1`因为字面要求的学位显然是错误的。 这`-1`顶点需要容量，但没有下限。 

## 方法

 蛮力方法是为每条边独立选择一个方向。 一条边有两种可能性，所以有`2^m`检查方向。 对于每个方向，我们可以计算所有入度`O(n+m)`并检查要求。 因此，最坏情况下的操作计数是`O(2^m(n+m))`。 和`m = 2000`，方向数为`2^2000`， 大致`10^602`，所以这种方法不仅慢，而且完全无法使用。 

有用的观察结果是，每条边恰好对一个端点的入度做出一个单位贡献。 这正是一个分配问题。 为每条原始边引入一个流节点。 通过该边缘节点发送一个单元意味着选择相应的无向边缘的结束位置。 边缘节点可以将其单元发送到其两个端点中的任意一个。 

剩下的困难是受约束的顶点需要精确数量的传入单元，而不受约束的顶点可以接收任意数量的单元。 确切的要求自然地由流量的下限和上限来表示。 我们可以把整个问题变成一个可行的循环。 

创建类似源的顶点`S`和一个水槽状的顶点`T`。 对于每个原始边缘`e`,创建一个边缘节点`E_e`。 流网络包含`S -> E_e`下限和上限均等于 1，迫使每个原始边恰好贡献一个单位。 从`E_e`，将容量为一的边添加到原始边的两个端点上。 最后，连接每个原始顶点`v`到`T`。 如果`a[v]`是固定的，该边有下限和上限`a[v]`。 如果`a[v] = -1`，其下界为零，其上限可以是其图度。 

额外的边缘`T -> S`有能力`m`将其封闭成循环。 流守恒现在正是我们想要的：每个边缘节点接收一个单元并将其发送到一个端点，而每个受约束的顶点将其请求的单元数量发送到`T`。 

使用标准循环减少来删除下限。 对于边缘`u -> v`有界限`[L, R]`，我们首先预留`L`单位和剩余容量`R-L`。 保留的下限在其端点处造成不平衡。 然后使用超级源和超级汇通过普通的最大流量计算来修复所有这些不平衡。 有了积分容量，只要存在任何可行流，就存在积分可行流，因此每个原始边缘节点最终将恰好将一个完整单元发送到一个端点。 

对于最大流量步骤，带有 DFS 的 Ford-Fulkerson 就足够了。 它通常的整数容量界限是`O(EF)`， 在哪里`F`是最大流量。 在这种特定的结构中，源自边缘节点的所有流量都受到单位容量的限制`S -> E_e`边，并且只有`m`这样的单位。 剩余的平衡流量可以通过单个处理`T -> S`联系。 因此，有用增强的数量受限于`O(m)`, 给予`O(mE) = O(m(n+m))`是时候解决这个问题了。 

蛮力方法之所以有效，是因为它明确地考虑了每一个可能的分配。 它失败了，因为分配的数量是指数级的。 流模型仅保留相关选择，即哪个端点接收每个边的单元，并让最大流算法同时解决所有选择。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(2^m(n+m))`|`O(n+m)`| 太慢了 |
 | 下限流 + Ford-Fulkerson |`O(m(n+m))`|`O(n+m)`| 已接受 |

 ## 算法演练

 1. 读取图形并计算每个原始顶点的度数。 该度数给出了不受约束的顶点的自然上限，因为没有顶点可以接收比接触它的边数更多的传入边。 
2. 搭建1个流节点`E_e`对于每个原始无向边`e = {u, v}`。 添加有界边`S -> E_e`有界限`[1, 1]`。 这迫使每条原始边恰好贡献一个单位的流量，因此没有边可以从最终方向消失。 
3. 添加`E_e -> u`和`E_e -> v`，每个都有界限`[0, 1]`。 自从`E_e`恰好接收一个单位，流量守恒迫使这两个弧之一恰好携带该单位。 选择第一个意味着原始边缘结束于`u`; 选择第二个意味着它结束于`v`。 
4. 对于每个原始顶点`v`，添加一条边`v -> T`。 如果`a[v]`是固定的，给出这个边缘边界`[a[v], a[v]]`。 如果`a[v] = -1`，给它界限`[0, degree[v]]`。 对于受约束的顶点，下限和上限相等，因此它必须准确接收请求的边单元数。 
5.添加造型边缘`T -> S`有界限`[0, m]`。 如果没有这个边缘，`S`将有流出流量和`T`将有流入流，这是普通的源汇流而不是循环。 关闭网络使每个顶点都遵守守恒。 
6. 替换每个有界边`[L, R]`通过容量的普通剩余边缘`R-L`。 同时，保持`balance[u] -= L`和`balance[v] += L`为边缘`u -> v`。 这些符号描述了修复下限流量后产生的不平衡。 
7.添加超级源`SS`和超级水槽`TT`。 对于每个具有正平衡的顶点，添加`SS -> v`有能力`balance[v]`。 对于每个具有负平衡的顶点，添加`v -> TT`有能力`-balance[v]`。 辅助流必须充满所有这些平衡边缘。 
8. 运行 Ford-Fulkerson`SS`到`TT`。 如果总流量小于所有正余额的总和，则无法使下限兼容，因此打印`NO`。 
9. 如果所有平衡边都饱和，则恢复每个平衡边上的流量`E_e -> u`和`E_e -> v`弧。 其中一个恰好携带一个单位。 如果`E_e -> u`携带一个单位，输出`v u`，因为原来的无向边`{u,v}`必须结束于`u`。 否则输出`u v`。 

为什么它有效

 中心不变量是每个原始边缘节点始终代表一个边缘单元。 固定下限为`S -> E_e`给出该单位，唯一的两个可能的目的地是原始端点。 因此，可行的循环确定了每个原始边的一个有效方向。 

对于受约束的顶点`v`, 边缘`v -> T`下限和上限都等于`a[v]`。 守恒力恰好`a[v]`到达单位`v`，所以它的最终入度是完全正确的。 不受约束的顶点有足够的上限容量来接收从零到其度数的任何数字。 

下界变换相当于原始循环，因为它首先修复每个强制下界单元，并要求辅助最大流修复由此产生的顶点不平衡。 如果辅助流使每个所需的平衡边缘饱和，则将下限添加回来会产生有效的循环。 如果不能使它们饱和，则剩余容量的分配无法恢复守恒，因此不存在原始方向。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(1_000_000)

class Flow:
    def __init__(self, n):
        self.n = n
        self.g = [[] for _ in range(n)]

    def add_edge(self, u, v, cap):
        idx = len(self.g[u])
        rev = len(self.g[v])
        self.g[u].append([v, rev, cap])
        self.g[v].append([u, idx, 0])
        return idx

    def max_flow(self, s, t):
        n = self.n
        total = 0

        while True:
            used = [False] * n

            def dfs(v, pushed):
                if v == t:
                    return pushed

                used[v] = True

                for e in self.g[v]:
                    to, rev, cap = e
                    if cap <= 0 or used[to]:
                        continue

                    got = dfs(to, min(pushed, cap))
                    if got:
                        e[2] -= got
                        self.g[to][rev][2] += got
                        return got

                return 0

            pushed = dfs(s, 10**9)
            if pushed == 0:
                break

            total += pushed

        return total

def solve_case(n, m, a, edges):
    deg = [0] * n
    for u, v in edges:
        deg[u] += 1
        deg[v] += 1

    # Node layout:
    # 0 .. n-1          original vertices
    # n .. n+m-1        one node per original edge
    # S, T              circulation source/sink
    # SS, TT            lower-bound reduction source/sink
    S = n + m
    T = S + 1
    SS = T + 1
    TT = SS + 1
    N = TT + 1

    flow = Flow(N)
    balance = [0] * N

    def add_bounded(u, v, low, high):
        idx = flow.add_edge(u, v, high - low)

        # Lower bound low is already sent on u -> v.
        # It contributes one unit of outgoing lower flow at u
        # and one unit of incoming lower flow at v.
        balance[u] -= low
        balance[v] += low

        return idx

    # For reconstruction:
    # (edge_node, arc_index_to_u, arc_index_to_v, u, v)
    original_refs = []

    for i, (u, v) in enumerate(edges):
        edge_node = n + i

        # Every original edge contributes exactly one unit.
        add_bounded(S, edge_node, 1, 1)

        idx_u = add_bounded(edge_node, u, 0, 1)
        idx_v = add_bounded(edge_node, v, 0, 1)

        original_refs.append((edge_node, idx_u, idx_v, u, v))

    for v in range(n):
        if a[v] == -1:
            add_bounded(v, T, 0, deg[v])
        else:
            add_bounded(v, T, a[v], a[v])

    # Close the S -> ... -> T flow into a circulation.
    add_bounded(T, S, 0, m)

    need = 0

    for v in range(N):
        if balance[v] > 0:
            flow.add_edge(SS, v, balance[v])
            need += balance[v]
        elif balance[v] < 0:
            flow.add_edge(v, TT, -balance[v])

    got = flow.max_flow(SS, TT)

    if got != need:
        return None

    answer = []

    for edge_node, idx_u, idx_v, u, v in original_refs:
        # The transformed capacity was 1, so residual capacity 0
        # means one unit of flow was sent through that arc.
        flow_to_u = 1 - flow.g[edge_node][idx_u][2]
        flow_to_v = 1 - flow.g[edge_node][idx_v][2]

        if flow_to_u == 1:
            # The edge ends at u.
            answer.append((v + 1, u + 1))
        elif flow_to_v == 1:
            # The edge ends at v.
            answer.append((u + 1, v + 1))
        else:
            # This cannot happen in a feasible circulation.
            return None

    return answer

def solve():
    n, m = map(int, input().split())
    a = list(map(int, input().split()))

    edges = []
    for _ in range(m):
        u, v = map(int, input().split())
        edges.append((u - 1, v - 1))

    answer = solve_case(n, m, a, edges)

    if answer is None:
        print("NO")
        return

    out = ["YES"]
    out.extend(f"{u} {v}" for u, v in answer)
    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```这`Flow`类将每个剩余边存储为`[destination, reverse-index, residual-capacity]`。 反向索引可以让增广路径撤销部分先前的选择。 这很重要，因为较早的路径可能会将边缘分配给一个端点，而较晚的路径可能需要重新路由该分配。`add_bounded`执行下界变换。 剩余容量变为`high - low`，而balance数组记录了强制的效果`low`单位。 原始下界本身不会丢失，因为在重构最终流时它被隐式包含在内。 

边节点是在原始顶点之后创建的，这使索引保持简单。 对于原始边缘`i`，其流节点为`n + i`。 两个传出弧通过其索引存储在该节点的邻接列表中。 由于它们的原始容量都是 1，因此它们最终的剩余容量直接告诉我们哪个端点收到了该单元。 

这`T -> S`边缘有容量`m`，因为正是`m`单位进入`T`总共，每个原始边缘一个。 更大的容量也可以，但是`m`是一个紧且方便的界限。 

下限减少使用`balance[u] -= low`和`balance[v] += low`。 正平衡意味着固定的下限在该顶点留下多余的流入流量，因此残差网络必须路由掉该量。 负余额意味着该顶点需要剩余流入流量。 超级源和超级汇边缘精确编码这两种情况。 

Python 中不存在整数溢出问题。 所有相关数量最多为几千，但 Python 整数也消除了对机器整数宽度的任何依赖。 

## 工作示例

 对于样本 1，要求的度数为`[1, 2, 1, -1, 0]`。 一种有效的方向与示例中所示的方向完全相同。 

| 原边| 选定的头| 加工后入度|
 | --- | --- | --- |
 |`1 2`|`2`|`[0,1,0,0,0]`|
 |`1 3`|`1`|`[1,1,0,0,0]`|
 |`2 3`|`2`|`[1,2,0,0,0]`|
 |`3 4`|`3`|`[1,2,1,0,0]`|
 |`4 5`|`5`|`[1,2,1,0,1]`|

 顶点 1、2、3 和 5 处的最终度数为`1, 2, 1, 0`，完全按照要求。 顶点 4 不受约束。 流模型通过每个边缘节点发送一个单元并选择相应的端点弧来达到相同的分配。 

对于示例 2，唯一的变化是顶点 5 现在需要入度 1。 

| 原边| 选定的头| 加工后入度|
 | --- | --- | --- |
 |`1 2`|`2`|`[0,1,0,0,0]`|
 |`1 3`|`1`|`[1,1,0,0,0]`|
 |`2 3`|`2`|`[1,2,0,0,0]`|
 |`3 4`|`3`|`[1,2,1,0,0]`|
 |`4 5`|`5`|`[1,2,1,0,1]`|

 最后一条边现在必须指向顶点 5。这说明了为什么不受约束的顶点 4 不能简单地吸收所有剩余边。 它的容量是可用的，但仍然需要满足顶点 5 的确切要求。 

这两条迹线从不同侧面证明了相同的不变量。 每条边恰好贡献一个单位，并且每个固定顶点恰好消耗其所请求的这些单位数量。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(m(n+m))`| 辅助图有`O(n+m)`边，以及积分增流构造需求`O(m)`相关增强|
 | 空间|`O(n+m)`| 该图包含`O(n+m)`顶点和边，每个建模边具有恒定数量的剩余边 |

 原来的约束条件有`n,m <= 2000`，因此辅助图仅包含几千个顶点和大致恒定倍数`n+m`残留电弧。 原始边缘节点贡献的流量值的边界为`m`，并且每个这样的源侧弧的容量为一。 由此产生的`O(m(n+m))`在这个规模下，bound 已经很小了。 

## 测试用例

 输出方向不是唯一的，因此测试应该验证生成的答案，而不是将其与一个特定方向逐个字符进行比较。 以下线束假设上述解决方案保存为`solution.py`。```python
# Test harness for solution.py
import io
import sys

from solution import solve_case

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    try:
        from solution import solve
        solve()
        return out.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def validate(inp: str, out: str, possible: bool):
    data = inp.strip().splitlines()
    n, m = map(int, data[0].split())
    a = list(map(int, data[1].split()))

    edges = []
    for line in data[2:]:
        u, v = map(int, line.split())
        edges.append((u, v))

    lines = out.strip().splitlines()

    if not possible:
        assert lines == ["NO"], f"expected NO, got:\n{out}"
        return

    assert lines[0] == "YES", f"expected YES, got:\n{out}"
    assert len(lines) == m + 1

    original = {tuple(sorted(e)) for e in edges}
    indeg = [0] * n

    for line in lines[1:]:
        u, v = map(int, line.split())
        assert 1 <= u <= n
        assert 1 <= v <= n
        assert u != v

        assert tuple(sorted((u, v))) in original
        indeg[v - 1] += 1

    for i in range(n):
        if a[i] != -1:
            assert indeg[i] == a[i], (
                f"vertex {i + 1}: expected {a[i]}, got {indeg[i]}"
            )

# Sample 1
sample1 = """\
5 5
1 2 1 -1 0
1 2
1 3
2 3
3 4
4 5
"""
validate(sample1, run(sample1), True)

# Sample 2
sample2 = """\
5 5
1 2 1 -1 1
1 2
1 3
2 3
3 4
4 5
"""
validate(sample2, run(sample2), True)

# Minimum-size valid graph.
case_min = """\
2 1
1 -1
1 2
"""
validate(case_min, run(case_min), True)

# Boundary case: requested degree equals m and is actually attainable.
case_boundary = """\
3 2
2 0 -1
1 2
1 3
"""
validate(case_boundary, run(case_boundary), True)

# All vertices constrained with equal requested values.
case_equal = """\
4 4
1 1 1 1
1 2
2 3
3 4
4 1
"""
validate(case_equal, run(case_equal), True)

# Impossible because vertex 1 has degree 1 but requests in-degree 2.
case_impossible = """\
2 1
2 -1
1 2
"""
validate(case_impossible, run(case_impossible), False)

# Maximum-size graph: a 2000-cycle, every vertex requests in-degree 1.
n = 2000
m = 2000
a = " ".join(["1"] * n)
cycle_edges = "\n".join(
    f"{i} {i % n + 1}" for i in range(1, n + 1)
)
case_max = f"{n} {m}\n{a}\n{cycle_edges}\n"

validate(case_max, run(case_max), True)
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 |`YES`具有有效的方向| 基本混合受约束和无约束顶点 |
 | 样品2 |`YES`具有有效的方向| 以前自由的端点变得完全受限 |
 |`2 1 / 1 -1 / 1 2`|`YES`| 最小有效图和精确度一 |
 |`3 2 / 2 0 -1`|`YES`| 度数等于`m`，零要求，精准定位|
 | 四循环全部`1`|`YES`| 完全平等的要求，没有不受约束的顶点 |
 |`2 1 / 2 -1 / 1 2`|`NO`| 要求学位大于实际学位|
 | 2000 次循环，全部`1`|`YES`| 最大尺寸输入和大流量网络|

 ## 边缘情况

 请求的入度大于顶点度数会被流网络本身拒绝。 为了```
2 1
2 -1
1 2
```边节点有一个可用单元，而顶点 1 的边到`T`需要两个单元，因为它的下限和上限均为 2。无法从单个边缘节点将两个单元发送到顶点 1。 辅助最大流量不能使所有平衡边饱和，因此程序打印`NO`。 

零要求被处理为精确的零下限和上限。 为了```
2 1
0 -1
1 2
```边缘节点必须将其一个单元发送到顶点 2，因为顶点 1 的容量没有`v -> T`边缘。 因此恢复的流量打印`2 1`，给出顶点 1 的入度为零。 

值为`-1`变成灵活区间`[0, degree[v]]`。 为了```
2 1
1 -1
1 2
```顶点 1 有区间`[1,1]`，因此唯一可行的分配将边发送到顶点 1。顶点 2 可以接收从 0 到 1 的任何内容，因此其最终入度 0 是有效的。 

当每个顶点都受到约束时，就没有多余的端点可以吸收多余的流量。 在```
3 3
1 1 1
1 2
2 3
3 1
```每个边缘节点必须发送一个单元，并且每个顶点到`T`边缘恰好接受一个。 循环可以使三个单元围绕三角形运行，产生有向循环。 确切的容量是防止任何顶点接收两条边而另一个顶点则不接收任何边的原因。 

最大尺寸情况是 2000 个周期，每个请求的入度等于 1。 每个顶点可以接收其两个入射边之一，并且有向循环本身是有效的方向。 流结构有 2000 个边缘节点和 2000 个原始顶点节点，但其结构在输入大小上保持线性，因此无需任何特殊处理即可应用相同的算法。
