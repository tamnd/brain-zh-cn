---
title: "CF 102203C - \u0424\u0430\u0431\u0440\u0438\u043a\u0430"
description: "工厂是一棵树。 每个房间都是一个顶点，每个走廊都是一条边，并且由于每对房间之间恰好有 (n-1) 条走廊和一条路径，因此两个房间之间的路径是唯一的。"
date: "2026-08-18T11:23:23+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102203
codeforces_index: "C"
codeforces_contest_name: "\u0427\u0435\u0442\u0432\u0435\u0440\u0442\u0430\u044f \u041b\u0438\u043f\u0435\u0446\u043a\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e (8-11 \u043a\u043b\u0430\u0441\u0441\u044b)"
rating: 0
weight: 102203
solve_time_s: 153
verified: true
draft: false
---

[CF 102203C - \u0424\u0430\u0431\u0440\u0438\u043a\u0430](https://codeforces.com/problemset/problem/102203/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 工厂是一棵树。 每个房间都是一个顶点，每个走廊都是一条边，并且由于每对房间之间恰好有 (n-1) 条走廊和一条路径，因此两个房间之间的路径是唯一的。 

对于每个请求 ((s_i,f_i))，在每条走廊都建立为单向之后，人们必须能够从 (s_i) 步行到 (f_i)。 由于底层图是一棵树，因此从 (s_i) 到 (f_i) 只有一条可能的路线。 因此，该路线上的每条边都有一个强制方向。 任务是确定所有这些强制方向是否相互一致，如果一致，则输出满足所有要求的每个走廊的一个方向。 

房间数量和请求数量的约束都达到 (2\cdot10^5)。 检查每个可能方向的解决方案是立即不可能的，因为具有 (n-1) 条边的树具有 (2^{n-1}) 个方向。 即使是显式地沿着每个请求的路径行走的方法也可以达到 (O(nm))，这大约是最大尺寸的 (4\cdot10^{10}) 边缘访问。 预期的解决方案必须几乎线性地处理树和所有请求。 

有几种边缘情况很容易破坏实现。 第一个是端点相等的请求。 例如，```
1 1
1 1
```根本没有走廊，显然是可以满足的，所以答案是`YES`。 假设两个端点不同的路径差异实现可能会意外地引入虚假约束。 

第二个是在同一边缘上要求相反方向的两个请求：```
2 2
1 2
1 2
2 1
```正确答案是`NO`。 两个请求都使用唯一的边，但一个请求需要 (1\to2)，而另一个请求需要 (2\to1)。 独立检查请求并在第一次遇到请求时定向边缘可以默默地接受这种情况。 

第三个请求是经过几位祖先的请求。 考虑```
3 1
1 2
2 3
3 1
```唯一有效的方向是 (3\to2\to1)。 简单地将每条边从所选根朝向其子节点的方法将产生 (1\to2\to3)，它满足树结构但违反了要求。 

## 方法

 最直接的方法是枚举 (n-1) 条边的每个方向。 对于每个方向，检查每个请求并检查其唯一路径上的所有边是否都指向从其起点到终点。 这是正确的，因为每个可能的答案都被明确考虑。 通过简单的路径遍历，在最坏的情况下，一个方向可能需要 (O(mn)) 工作，因此总数为 (O(2^{n-1}mn))。 即使在达到 (n) 的大值之前，这也变得毫无用处。 

更好的方向是停止考虑完整的方向，而是询问每个单独的边缘需要做什么。 使树在房间 (1) 处生根。 每个非根顶点 (v) 在 (v) 与其父顶点 (p(v)) 之间都有一条边。 请求可以通过两种方式之一跨越此边缘。 如果它从 (v) 的子树到父树，则边必须是 (v\to p(v))。 如果从父节点进入子树，则边一定是 (p(v)\to v)。 

对于一个请求 (s\to f)，令 (l) 为 (s) 和 (f) 的最低公共祖先。 该路径分为从 (s) 到 (l) 的向上部分，以及从 (l) 到 (f) 的向下部分。 这是关键的结构观察。 我们可以用一个树差异数组记录所有向上的需求，用另一个树差异数组记录所有向下的需求。 

对于向上部分 (s\to l)，在 (s) 处加 (1)，在 (l) 处减 (1)。 对从子项到父项的值求和后，当某些请求需要 (v\to p(v)) 时，边 ((p(v),v)) 会收到正向上计数。 

对于向下的部分 (l\to f)，在 (f) 处加 (1)，在 (l) 处减 (1)。 然后，当某些请求需要 (p(v)\to v) 时，相同的自下而上累积会准确地给出正向下计数。 

因此，当两个计数均为正值时，精确地不可能出现边缘。 如果只有向上计数为正，则将边缘朝上。 如果只有向下计数为正，则将其向下定向。 如果两个计数都不为正，则边缘不受限制并且可以任意定向。 

剩下的问题是有效地找到所有 LCA。 由于所有请求在处理开始之前都是已知的，因此我们可以使用 Tarjan 的离线 LCA 算法。 它按后序处理树，而 DSU 表示已经完成的子树。 当一个端点被处理并且另一个端点已经被处理时，每个 LCA 请求都会得到应答。 通过路径压缩和按等级联合，这几乎需要线性时间。 

蛮力之所以有效，是因为它明确地测试了每个可能的方向，但由于方向的数量呈指数级增长而失败。 每个请求仅在各个树边上施加独立方向的观察结果使我们能够聚合具有树差异的所有请求，而离线 LCA 提供分割每条路径所需的唯一结构信息。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(2^{n-1}mn)) | (O(n+m)) | 太慢了 |
 | 最佳| (O((n+m)\alpha(n))) | (O(n+m)) | 已接受 |

 ## 算法演练

 1. 以顶点 (1) 为树根，并计算每个顶点的父节点以及 DFS 顺序。 该顺序的相反是有效的后序，因此它允许我们在其父级之前处理每个子级，而无需递归。 
2. 在查询邻接结构中将每个请求存储两次。 对于请求 (i=(s_i,f_i))，将 (f_i) 附加到 (s_i) 并将 (s_i) 附加到 (f_i)。 我们需要这个结构，因为 Tarjan 的离线 LCA 算法在处理任一端点时都会响应请求。 
3. 运行Tarjan的离线LCA算法。 每个顶点最初形成自己的 DSU 集。 当一个顶点完成时，它的集合被合并到它的父节点中，并且 DSU 代表存储该集合的当前树祖先。 当请求的两个端点都已被处理时，`ancestor[find(other)]`是他们的 LCA。 
4. 对于每个请求 (s\to f)，设 (l=\operatorname{LCA}(s,f))。 增量`up[s]`并减少`up[l]`。 这表示线段 (s\to l)，其中每个交叉边都必须指向根。 
5. 对于同一个请求，递增`down[f]`并减少`down[l]`。 这表示 (l\to f)，其中每个交叉边必须指向远离根的方向。 
6. 以逆向 DFS 顺序遍历树并添加每个顶点的`up`和`down`对其父级的值。 累积之后，对于每个非根顶点 (v)，`up[v]`计算需要 (v\toparent[v]) 的请求，同时`down[v]`计算需要 (parent[v]\to v) 的请求。 
7. 如果两者都`up[v]`和`down[v]`为正，输出`NO`。 两个方向都需要相同的走廊，因此没有一个方向可以满足所有要求。 
8. 否则，将边缘定向在 (v) 和`parent[v]`根据可用的要求。 向上的要求给出 (v\to Parent[v])，向下的要求给出 (parent[v]\to v)，无约束的边可以使用 (parent[v]\to v)。 

为什么它有效：对于每个请求 (s\to f)，其唯一的树路径正是 (s\to l) 和 (l\to f) 的串联，其中 (l) 是它们的 LCA。 差异更新将第一段的每个边缘标记为需要向上方向，并将第二段的每个边缘标记为需要向下方向。 因此，在累积之后，每条边都知道所有请求所需的所有方向。 如果两个方向都发生，则该实例是不可能的。 如果最多出现一个方向，则选择该方向可以满足使用边缘的每个请求。 由于每个请求完全由这些边组成，因此生成的方向满足所有请求。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve():
    input = sys.stdin.readline
    n, m = map(int, input().split())

    # Compact forward-star representation of the tree.
    head = array('i', [-1]) * n
    to = array('i')
    nxt = array('i')

    eu = array('i')
    ev = array('i')

    for _ in range(n - 1):
        u, v = map(int, input().split())
        u -= 1
        v -= 1

        eid = len(to)
        to.append(v)
        nxt.append(head[u])
        head[u] = eid

        eid += 1
        to.append(u)
        nxt.append(head[v])
        head[v] = eid

        eu.append(u)
        ev.append(v)

    # Store requests.
    qs = array('i')
    qf = array('i')

    # Query adjacency for Tarjan's offline LCA.
    qhead = array('i', [-1]) * n
    qto = array('i')
    qnext = array('i')
    qid = array('i')

    for i in range(m):
        s, f = map(int, input().split())
        s -= 1
        f -= 1

        qs.append(s)
        qf.append(f)

        idx = len(qto)
        qto.append(f)
        qid.append(i)
        qnext.append(qhead[s])
        qhead[s] = idx

        idx = len(qto)
        qto.append(s)
        qid.append(i)
        qnext.append(qhead[f])
        qhead[f] = idx

    # Root the tree at 0 and build a DFS order.
    parent = array('i', [-1]) * n
    parent[0] = 0
    order = []

    stack = [0]
    while stack:
        v = stack.pop()
        order.append(v)

        e = head[v]
        while e != -1:
            u = to[e]
            if u != parent[v]:
                parent[u] = v
                stack.append(u)
            e = nxt[e]

    # Tarjan offline LCA.
    dsu = array('i', range(n))
    rank = array('b', [0]) * n
    ancestor = array('i', range(n))
    visited = bytearray(n)
    lca = array('i', [-1]) * m

    def find(x):
        root = x
        while dsu[root] != root:
            root = dsu[root]

        while dsu[x] != x:
            y = dsu[x]
            dsu[x] = root
            x = y

        return root

    for pos in range(n - 1, -1, -1):
        v = order[pos]

        # All child subtrees have already been merged into v.
        rv = find(v)
        ancestor[rv] = v
        visited[v] = 1

        # Answer queries whose other endpoint is already processed.
        e = qhead[v]
        while e != -1:
            other = qto[e]
            idx = qid[e]

            if visited[other] and lca[idx] == -1:
                lca[idx] = ancestor[find(other)]

            e = qnext[e]

        # Merge v into its parent after processing queries at v.
        if v != 0:
            p = parent[v]
            rv = find(v)
            rp = find(p)

            if rv != rp:
                if rank[rv] < rank[rp]:
                    dsu[rv] = rp
                    ancestor[rp] = p
                elif rank[rv] > rank[rp]:
                    dsu[rp] = rv
                    ancestor[rv] = p
                else:
                    dsu[rp] = rv
                    rank[rv] += 1
                    ancestor[rv] = p

    # We no longer need the query graph or DSU.
    del qhead, qto, qnext, qid
    del dsu, rank, ancestor, visited

    # Difference arrays for upward and downward requirements.
    up = array('i', [0]) * n
    down = array('i', [0]) * n

    for i in range(m):
        s = qs[i]
        f = qf[i]
        l = lca[i]

        up[s] += 1
        up[l] -= 1

        down[f] += 1
        down[l] -= 1

    del qs, qf, lca

    # Accumulate subtree differences from children to parents.
    possible = True

    for pos in range(n - 1, 0, -1):
        v = order[pos]

        if up[v] > 0 and down[v] > 0:
            possible = False
            break

        p = parent[v]
        up[p] += up[v]
        down[p] += down[v]

    if not possible:
        print("NO")
        return

    # Orient every original edge.
    answer = ["YES"]

    for i in range(n - 1):
        a = eu[i]
        b = ev[i]

        if parent[a] == b:
            child = a
            par = b
        else:
            child = b
            par = a

        if up[child] > 0:
            answer.append(f"{child + 1} {par + 1}")
        else:
            # This covers both down[child] > 0 and the unconstrained case.
            answer.append(f"{par + 1} {child + 1}")

    sys.stdout.write("\n".join(answer))

if __name__ == "__main__":
    solve()
```该树以紧凑的前向星形表示形式存储，而不是 Python 列表列表。 在 (2\cdot10^5) 个顶点，这使得内存占用保持可预测。 原始端点也被保留，因为所需的输出可以以任何顺序列出边缘，但必须为每个原始边缘重建方向。 

第一个 DFS 仅建立`parent`和`order`。 因为该图保证是一棵树，所以检查`u != parent[v]`足以避免走回父母身边。 不使用递归 DFS，因为树可以是 (2\cdot10^5) 个顶点的链，并且会超出 Python 的递归限制。 

Tarjan 的部分使用单独的 DSU 父阵列。 这是故意与树不同的`parent`大批。 父树描述了实际的有根树，而 DSU 父树描述了已处理子树的临时集。 这`ancestor`数组将 DSU 代表连接回当前充当该集合的祖先的树顶点。 

Tarjan 循环内的顺序很重要。 顶点被标记为已处理，并且在合并到其自己的父顶点之前，其查询得到回答。 如果合并首先发生，则 LCA 为当前顶点的查询可能会观察到更高的祖先并收到错误的答案。 

两个差异数组使用有符号 32 位整数。 每个值都受到请求数量的限制，因此它很适合这个范围。 Python本身也有任意精度的整数，但紧凑数组大大减少了内存消耗。 

最终方向使用每个有根边的子端点。`up[child] > 0`意味着至少一个请求需要边缘从子项指向其父项。 如果不是这种情况，则边缘可以安全地从父级指向子级，因为要么向下请求需要它，要么没有人关心它。 

## 工作示例

 对于示例 1，树的根位于顶点 (1)。 有根边是 (1-2)、(1-4)、(4-3) 和 (3-5)。 LCA 和两个路径段是：

 | 请求| 生命周期评估 | 向上段| 下行段|
 | --- | --- | --- | --- |
 | (1\到2) | 1 | 空 | (1\到2) |
 | (5\到3) | 3 | (5\到3) | 空 |
 | (5\到4) | 4 | (5\to3\to4) | (5\to3\to4) | 空 |
 | (1\到4) | 1 | 空 | (1\到4) |
 | (3\到4) | 4 | 空 | 相对于根分割为空 |

 最后一个请求实际上以 (4) 作为其 LCA，因为 (4) 是 (3) 的祖先，因此它的向上段是 (3\to4)。 累积后，受约束的边具有以下方向：

 | 边缘 | 向上计数 | 倒计时| 选择的方向 |
 | --- | --- | --- | --- |
 | (1-2) | 0 | 1 | (1\到2) |
 | (1-4) | 0 | 1 | (1\到4) |
 | (4-3) | 2 | 0 | (3\到4) |
 | (3-5) | 2 | 0 | (5\到3) |

 没有边在两个方向上都有正计数，因此该实例是可行的。 语句中显示的输出是一种有效方向，算法可能会产生不同的方向，因为不受约束的边可以任意定向。 

对于示例 2，重要的中间状态是 LCA 集合：

 | 请求| 生命周期评估 | 更新 | 向下更新 |
 | --- | --- | --- | --- |
 | (6\到10) | 1 | (上[6]++, 上[1]--) | （向下[10]++，向下[1]--）|
 | (13\to1) | (13\to1) | 1 | (上[13]++, 上[1]--) | 无净变化|
 | (5\到14) | 1 | (上[5]++, 上[1]--) | （向下[14]++，向下[1]--）|
 | (15\到12) | 12 | 12 （向上[15]++，向上[12]--）| 无净变化|
 | (2\到8) | 2 | 无净变化| （向下[8]++，向下[2]--）|

 自下而上累加后，每条边最多获得一个正方向计数。 例如，边（1-2）收到来自（6\to10）的向上要求，因此它必须是（2\to1）。 边 (1-3) 收到来自 (6\to10) 的向下要求，因此它必须是 (1\to3)。 边 (2-8) 收到来自 (2\to8) 的向下要求，因此它必须是 (2\to8)。 

结果方向包括路径```
6 -> 2 -> 1 -> 3 -> 10
13 -> 11 -> 4 -> 1
5 -> 1 -> 3 -> 9 -> 12 -> 14
15 -> 12
2 -> 8
```它演示了中心不变量：每个请求的路径完全由边缘组装而成，边缘的方向由相应的差异计数独立固定。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O((n+m)\alpha(n))) | 树的遍历、Tarjan的DSU操作、差异累加都几乎是线性的 |
 | 空间| (O(n+m)) | 存储树、查询列表、DSU 状态、请求和两个差异数组 |

 最大的输入有 (2\cdot10^5) 个顶点和 (2\cdot10^5) 个请求。 该算法仅对树和请求执行恒定数量的传递，DSU 操作具有逆阿克曼摊销成本。 这符合所需的渐近边界，并避免指数枚举和每个请求路径的显式遍历。 

## 测试用例

 此问题的输出不是唯一的，因此测试不应将成功的方向与一个固定字符串进行比较。 下面的测试工具检查`NO`必要时报告，并且，对于`YES`，验证每个生成的边都是有效的原始边，并且每个请求的路由实际上都从其源定向到其目的地。 

对于大型测试，通过完整图搜索来检查每个请求本身就不必要地昂贵，因此这种情况会检查输出的结构属性。```python
# Save the editorial solution as solution.py before running these tests.

import sys
import io
from solution import solve

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def validate_orientation(inp: str, out: str) -> bool:
    data = list(map(int, inp.split()))
    it = iter(data)

    n = next(it)
    m = next(it)

    edges = set()
    for _ in range(n - 1):
        u = next(it)
        v = next(it)
        edges.add((u, v))
        edges.add((v, u))

    queries = []
    for _ in range(m):
        s = next(it)
        f = next(it)
        queries.append((s, f))

    lines = out.splitlines()
    if not lines:
        return False

    if lines[0] == "NO":
        return False

    if lines[0] != "YES":
        return False

    if len(lines) != n:
        return False

    directed = [[] for _ in range(n + 1)]

    for line in lines[1:]:
        a, b = map(int, line.split())
        if (a, b) not in edges:
            return False
        directed[a].append(b)

    # This validator is intended for small tests.
    for s, f in queries:
        seen = [False] * (n + 1)
        stack = [s]
        seen[s] = True

        while stack:
            v = stack.pop()
            if v == f:
                break

            for u in directed[v]:
                if not seen[u]:
                    seen[u] = True
                    stack.append(u)

        if not seen[f]:
            return False

    return True

# Sample 1
sample1 = """\
5 5
2 1
4 1
5 3
3 4
1 2
5 3
5 4
1 4
3 4
"""

out = run(sample1)
assert validate_orientation(sample1, out), "sample 1"

# Sample 2
sample2 = """\
15 5
1 2
1 3
1 4
1 5
2 6
2 7
2 8
3 9
3 10
4 11
9 12
11 13
12 14
12 15
6 10
13 1
5 14
15 12
2 8
"""

out = run(sample2)
assert validate_orientation(sample2, out), "sample 2"

# Sample 3
sample3 = """\
5 5
1 3
5 1
4 2
3 4
4 3
4 3
3 2
1 2
5 4
"""

assert run(sample3) == "NO", "sample 3"

# Minimum-size tree, equal endpoints, no edges to orient.
case_min = """\
1 1
1 1
"""

out = run(case_min)
assert out == "YES", "minimum-size case"

# Two opposite requirements on the only edge.
case_conflict = """\
2 2
1 2
1 2
2 1
"""

assert run(case_conflict) == "NO", "opposite directions"

# A request from a deep leaf to the root.
case_reverse_chain = """\
3 1
1 2
2 3
3 1
"""

out = run(case_reverse_chain)
assert validate_orientation(case_reverse_chain, out), "reverse chain"

# All requests have equal endpoints, so every edge is unconstrained.
case_equal = """\
4 4
1 2
2 3
3 4
2 2
2 2
2 2
2 2
"""

out = run(case_equal)
assert validate_orientation(case_equal, out), "equal endpoints"

# Maximum-size stress shape: a chain and many identical requests.
n = 200000
m = 200000

parts = [f"{n} {m}"]
for v in range(1, n):
    parts.append(f"{v} {v + 1}")
for _ in range(m):
    parts.append(f"1 {n}")

large_case = "\n".join(parts) + "\n"
out = run(large_case)

large_lines = out.splitlines()
assert large_lines[0] == "YES", "maximum-size case must be feasible"
assert len(large_lines) == n, "wrong number of output edges"

print("all tests passed")
```第一个自定义案例验证 (n=1) 边界，其中答案仅包含`YES`并且没有边缘描述。 第二个创建尽可能小的矛盾，并捕获仅记住每个边一个方向的实现。 

反向链案例捕获了关于根方向的错误假设。 等端点情况确认请求 (s\to s) 根本不施加任何边缘约束。 最大尺寸链强调迭代遍历、紧凑存储、离线LCA处理以及实际上限的输出构造。 

| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / 1 1`|`YES`| 最小尺寸树和空路径|
 |`2 2 / 1 2 / 1 2 / 2 1`|`NO`| 一边倒的直接矛盾 |
 |`3 1 / 1 2 / 2 3 / 3 1`|`YES`与 (3\to2\to1) | 叶到根方向和路径边界 |
 |`4 4 / 1 2 / 2 3 / 3 4 / 2 2 ...`|`YES`| 所有请求都有零长度路径 |
 | (n=m=200000)，请求链 (1\to n) |`YES`与所有边 (v\to v+1) | 最大输入大小和迭代实现 |

 ## 边缘情况

 对于等端点情况```
1 1
1 1
```LCA 也是顶点 (1)。 两个差异更新立即取消：`up[1] += 1`其次是`up[1] -= 1`，同样的情况也发生在`down`。 没有边缘可供检查，因此算法会打印`YES`。 

对于直接矛盾```
2 2
1 2
1 2
2 1
```根顶点 (1)。 第一个请求在边 (1-2) 上产生向下的要求，而第二个请求在完全相同的边上产生向上的要求。 经过积累，`down[2] = 1`和`up[2] = 1`。 冲突条件触发并打印算法`NO`。 

对于反向链```
3 1
1 2
2 3
3 1
```(3)和(1)的LCA是(1)。 向上的差异更新为`up[3] += 1`和`up[1] -= 1`。 自底向上累加将值从顶点 (3) 传输到顶点 (2)，然后传输到顶点 (1)。 因此，两个边沿都有正的向上计数而没有向下计数。 它们面向 (3\to2) 和 (2\to1)，与请求的路径完全匹配。 

对于无约束边缘的情况```
4 4
1 2
2 3
3 4
2 2
2 2
2 2
2 2
```每个请求都有相同的端点。 每个 LCA 都等于该端点，因此每个差异更新都会在同一顶点取消。 所有边缘在两个方向上的计数均为零。 该算法选择默认的父子方向，生成 (1\to2)、(2\to3)、(3\to4)，这是有效的，因为没有请求需要遍历边。
