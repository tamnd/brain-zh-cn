---
title: "CF 102192G - 卡牌游戏"
description: "每张卡片都有两个数字，例如当前正面的 (x) 和背面的 (y)。 翻转卡片会改变这两个数字中哪个是可见的。 我们需要每个可见的数字都不同，同时翻转尽可能少的牌。"
date: "2026-08-18T20:27:20+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102192
codeforces_index: "G"
codeforces_contest_name: "2018 Chinese Multi-University Training, Nanjing U Contest"
rating: 0
weight: 102192
solve_time_s: 242
verified: true
draft: false
---

[CF 102192G - 卡牌游戏](https://codeforces.com/problemset/problem/102192/G)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每张卡片都有两个数字，例如当前正面的 (x) 和背面的 (y)。 翻转卡片会改变这两个数字中哪个是可见的。 我们需要每个可见的数字都不同，同时翻转尽可能少的牌。 在所有最小翻转解决方案中，我们还需要计算可以翻转多少组不同的卡片。 仅当两个解翻转完全相同的牌索引时才被认为是相同的。 

有用的表示是图表。 将每个不同的数字视为一个顶点，将每张卡片 ((x,y)) 视为 (x) 和 (y) 之间的无向边。 当前可见的数字告诉我们选择了哪条边的端点。 因此，每张牌最初都指向其可见的数字。 翻转卡片后，其边缘指向另一个端点。 

当多条边指向同一顶点时，多张卡片的正面就会出现一个数字。 因此，所有可见数字唯一的要求正是每个顶点在最终方向上的入度最多为 1 的要求。 

输入允许 (n) 达到 (10^5)，所有测试用例的总和 (n) 达到 (10^6)。 (O(n^2)) 解决方案对于最大的测试来说已经太慢了，而指数搜索是完全不可行的。 预期的解决方案必须仅处理每张卡片和每个数字固定次数，从而为每个测试用例提供 (O(n)) 解决方案。 

有几种情况很容易处理不当。 

考虑```
1
1
1 1
```答案是```
0 1
```该卡是自循环的，但两面都包含相同的数字，因此翻转它不会改变任何内容。 将循环视为普通可逆边的粗心图实现可能会计算出虚假的第二方向。 

考虑```
1
2
1 2
1 3
```答案是```
1 2
```该图是一棵树。 选择顶点 2 作为根需要翻转第二张卡，而选择顶点 3 作为根需要翻转第一张卡。 两种解决方案都使用一次翻转。 仅查看当前重复的数字并贪婪地修复它可能会错过这两个全局最优选择之一。 

考虑```
1
3
1 2
2 3
1 3
```该图是一个单周期。 循环恰好有两种可能的有效方向。 在这个例子中，两者都需要翻转一次，所以答案是```
1 2
```假设每个周期只有一个最佳方向的解决方案会导致计数错误。 

最后，考虑```
1
2
1 1
1 1
```答案是```
-1 -1
```有两张卡，但只有一个可用号码。 更一般地，包含比顶点更多的边的连接组件不能被定向为使得每个顶点最多接收一条传入边。 仅仅检查每个重复的数字是否可以本地修复是不够的。 

## 方法

 直接的方法是对每张牌独立决定是否翻转。 有 (2^n) 个可能的翻转集。 对于每组，我们可以检查所有 (n) 个可见数字，检查它们是否不同，并保留最小翻转次数及其频率。 这是正确的，因为它明确考虑了每种可能的最终状态。 它最坏情况的工作是 (O(n2^n))，对于 (n=10^5) 来说大约是 (10^5\cdot2^{100000}) 次操作，并且远远超出了可行的范围。 

图公式揭示了为什么搜索空间具有比 (2^n) 更多的结构。 每张牌都成为一条边，其选定的端点是其可见的数字。 最终条件最多只是入度之一。 

对于包含 (v) 顶点和 (e) 边的连通分量，所有入度之和恰好为 (e)。 由于每个顶点最多可以有一个入度，因此我们必须有 (e\le v)。 (e<v) 的无向连通图是树，而 (e=v) 的连通图是单循环。 如果 (e>v)，则该分量是不可能的。 

这将问题简化为两个非常结构化的情况。 

对于一棵树，每个有效方向都恰好有一个入度为零的顶点，因为有 (v-1) 条边和 (v) 个顶点。 一旦该顶点被选为根，每条边都被迫指向远离根的方向。 我们只需要找到哪个根最小化初始方向与该强制方向不一致的边的数量。 这是一个标准的重根动态规划问题。 

对于单环分量，每个顶点的入度必须恰好为 1。 与循环相连的树中的所有边都被迫指向远离循环的方向。 循环本身只有两种可能的方向：顺时针或逆时针。 我们计算两者的翻转成本并保留更好的一个，当两者平局时计算两者。 自循环是一种单顶点循环，但其两侧相同，因此它仅贡献一个可能的翻转集。 

因此，关键的结构观察是每个可解分量要么是树，要么是单环图。 我们可以通过重复删除一阶顶点来找到环。 移除的边缘形成附着的树，而留下的边缘形成循环。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n2^n)) | (O(n)) | (O(n)) | 太慢了|
 | 最佳| (O(n)) | (O(n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 构建无向多重图。 顶点(x)代表数字(x)，卡片(i=(x,y))成为边(i)。 将 (x) 存储为初始正面选择的端点。 允许自循环。 
2. 将初始状态视为每条边朝向其当前前端编号的方向。 有效的最终状态恰好是每个顶点的入度至多为 1 的方向。 对于每个连接的组件，从概念上计算其顶点和边。 如果某个组件的边数多于顶点数，则输出 (-1\ -1)，因为其总入度太大而无法容纳其顶点。 
3. 重复删除一级顶点。 当叶子 (v) 通过边 (e) 连接到其剩余的邻居 (u) 时，删除该边并将 (u) 记录为 (v) 的父项。 在幸存部分包含根或循环的每个有效方向中，该树边缘必须指向从 (u) 到 (v)。 当初始选择的端点为 (u) 时，它对翻转计数的贡献恰好为 1。

剥离过程同时识别图结构。 在树的有效组件中，每条边最终都会被删除。 在有效的单循环分量中，完全保留循环边缘。 
4、剥皮后，检查各顶点的剩余度数。 有效组件中的剩余顶点必须具有正好为 2 的度数，计算自循环两次。 如果剩余的某些顶点具有不同的正度，则该分量包含多个循环并且是不可能的。 
5. 处理每个连接的组件。 顶点和边被遍历一次以收集其顶点，并且总成本已经由其剥皮的树边贡献。 如果组件中没有剩余边，则它是一棵树。 否则，它是单环的。 
6. 对于树组件，剥离过程恰好留下一个没有父节点的顶点。 该顶点是自然根。 让`base`是所有去皮边缘的成本之和。 这是当最后一个剩余顶点是根时的成本，因为每个记录的父子边都是从父到子的。 
7. 从这个根重新建立树的根。 假设一条边将当前根侧顶点 (v) 与其子顶点 (u) 连接起来，并且初始前端端点为 (x)。 根位于 (v) 时，所需方向为 (v\to u)，因此该边的成本为 ([x=v])。 将根移至 (u) 后，所需方向变为 (u\to v)，因此成本变为 ([x=u])。 因此

 [
 成本[u]=成本[v]+[x=u]-[x=v]。 
]

 在此遍历过程中，每条边仅更改根一次，因此可以在线性时间内获得所有可能的根成本。 保持最小值并计算有多少根达到它。 
8. 对于单环分量，所有剥皮树边已经具有其强制方向。 通过跟踪任何剩余顶点的未删除边来查找剩余循环。 
9. 沿一个方向运行循环。 如果循环边从 (u) 到 (v)，则其顺时针方向选择 (v)，而相反方向选择 (u)。 每当初始前端端点是相反端点时，将相应的成本加一。 对于具有多个顶点的循环，两个方向会产生不同组的翻转卡片。 如果它们的成本相等，则两者都很重要。 
10. 对于自环，只有一个有效方向，因为两个端点的编号相同。 它的贡献为零，并且它以一种方式而不是两种方式做出贡献。 
11. 添加所有组件的最小翻转次数。 由于不同连接组件中的选择是独立的，因此将它们的最佳翻转集的数量乘以模（998244353）。 

整个算法背后的不变性是，一旦幸存边被固定，每个被剥皮的树边在任何有效解决方案中都只有一个可能的方向。 在树中，唯一剩下的自由是根的选择。 在单环组件中，附加的树没有自由度，唯一剩下的选择是循环的方向。 因此，该算法以压缩形式枚举每个可能的有效方向，而无需枚举 (2^n) 个原始翻转集。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

MOD = 998244353

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())
        m = 2 * n
        V = m + 1

        # Forward-star adjacency.
        head = array('i', [-1]) * V
        to = array('i', [0]) * (2 * n)
        nxt = array('i', [0]) * (2 * n)

        # For edge i, x[i] is the initially visible endpoint.
        x = array('i', [0]) * n
        y = array('i', [0]) * n

        degree = array('i', [0]) * V

        for i in range(n):
            a, b = map(int, input().split())
            x[i] = a
            y[i] = b

            p = 2 * i
            to[p] = b
            nxt[p] = head[a]
            head[a] = p

            to[p + 1] = a
            nxt[p + 1] = head[b]
            head[b] = p + 1

            if a == b:
                degree[a] += 2
            else:
                degree[a] += 1
                degree[b] += 1

        # parent[v] is the vertex that survived when v was peeled.
        parent = array('i', [-1]) * V

        # child_cost[v] is the cost of edge parent[v] -> v
        # in the orientation forced by the surviving side.
        child_cost = bytearray(V)

        removed = bytearray(n)

        # Peel all trees from the outside toward their roots/cycles.
        queue = []
        for v in range(1, V):
            if head[v] != -1 and degree[v] == 1:
                queue.append(v)

        qpos = 0
        while qpos < len(queue):
            v = queue[qpos]
            qpos += 1

            if degree[v] != 1:
                continue

            arc = head[v]
            while arc != -1:
                e = arc >> 1
                if not removed[e]:
                    break
                arc = nxt[arc]

            if arc == -1:
                continue

            removed[e] = 1

            a = x[e]
            b = y[e]
            u = b if a == v else a

            parent[v] = u
            child_cost[v] = 1 if x[e] == u else 0

            degree[v] -= 1
            degree[u] -= 1

            if degree[u] == 1:
                queue.append(u)

        # After peeling, every surviving vertex must have degree 2.
        possible = True
        for v in range(1, V):
            if degree[v] != 0 and degree[v] != 2:
                possible = False
                break

        if not possible:
            out.append("-1 -1")
            continue

        seen = bytearray(V)
        root_cost = array('i', [0]) * V

        answer_cost = 0
        answer_ways = 1

        # Process one connected component at a time.
        for start in range(1, V):
            if head[start] == -1 or seen[start]:
                continue

            stack = [start]
            seen[start] = 1
            vertices = array('i')

            base = 0
            cycle_start = -1

            while stack:
                v = stack.pop()
                vertices.append(v)

                base += child_cost[v]
                if degree[v] > 0:
                    cycle_start = v

                arc = head[v]
                while arc != -1:
                    u = to[arc]
                    if not seen[u]:
                        seen[u] = 1
                        stack.append(u)
                    arc = nxt[arc]

            if cycle_start == -1:
                # The component is a tree.
                root = -1
                for v in vertices:
                    if parent[v] == -1:
                        root = v
                        break

                root_cost[root] = base

                best = base
                ways = 1

                stack = [root]

                while stack:
                    v = stack.pop()
                    cv = root_cost[v]

                    if cv < best:
                        best = cv
                        ways = 1
                    elif cv == best and v != root:
                        ways += 1

                    arc = head[v]
                    while arc != -1:
                        u = to[arc]
                        e = arc >> 1

                        # In a peeled tree, parent[u] == v means u
                        # is a child of v.
                        if parent[u] == v:
                            delta = (1 if x[e] == u else 0) - \
                                    (1 if x[e] == v else 0)
                            root_cost[u] = cv + delta
                            stack.append(u)

                        arc = nxt[arc]

                answer_cost += best
                answer_ways = answer_ways * ways % MOD

            else:
                # The component is unicyclic.
                # Find the remaining cycle.
                cycle_vertices = [cycle_start]
                cycle_edges = []

                cur = cycle_start
                prev_edge = -1

                while True:
                    arc = head[cur]
                    chosen = -1

                    while arc != -1:
                        e = arc >> 1
                        if not removed[e] and e != prev_edge:
                            chosen = e
                            break
                        arc = nxt[arc]

                    if chosen == -1:
                        break

                    cycle_edges.append(chosen)

                    a = x[chosen]
                    b = y[chosen]
                    nxt_vertex = b if a == cur else a

                    if nxt_vertex == cycle_start:
                        break

                    cycle_vertices.append(nxt_vertex)
                    prev_edge = chosen
                    cur = nxt_vertex

                k = len(cycle_vertices)

                if k == 1:
                    # The only possible cycle is a self-loop.
                    cycle_cost = 0
                    cycle_ways = 1
                else:
                    clockwise = 0
                    counterclockwise = 0

                    for i in range(k):
                        u = cycle_vertices[i]
                        v = cycle_vertices[(i + 1) % k]
                        e = cycle_edges[i]

                        # Clockwise wants u -> v, so v is visible.
                        if x[e] == u:
                            clockwise += 1

                        # Counterclockwise wants v -> u, so u is visible.
                        if x[e] == v:
                            counterclockwise += 1

                    if clockwise < counterclockwise:
                        cycle_cost = clockwise
                        cycle_ways = 1
                    elif clockwise > counterclockwise:
                        cycle_cost = counterclockwise
                        cycle_ways = 1
                    else:
                        cycle_cost = clockwise
                        cycle_ways = 2

                answer_cost += base + cycle_cost
                answer_ways = answer_ways * cycle_ways % MOD

        out.append(f"{answer_cost} {answer_ways}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```邻接结构使用前向星形表示，而不是 Python 列表列表。 这很重要，因为可能存在 (2n) 个端点事件，并且内存限制仅为 128 MB。 这`array('i')`容器保持顶点和边索引紧凑，同时`bytearray`对于布尔状态来说足够了，例如删除的边和访问的顶点。 

边索引是从邻接索引中恢复的`arc >> 1`。 每张卡贡献两个连续的邻接记录，因此不需要单独的边缘 ID 数组。 

剥皮过程中，`parent[v]`记录当 (v) 被移除时幸存的唯一邻居。 相应的`child_cost[v]`记录从幸存顶点朝向 (v) 时是否必须翻转该边。 将这些值相加即可得出强制树方向的成本。 

树重新生根使用关系

 [
 成本[u]-成本[v]=[x_e=u]-[x_e=v]。 
]

 该实现将当前的根成本存储在`root_cost`，因此 DFS 堆栈仅包含顶点索引而不包含大元组。 即使对于具有 (10^5) 个顶点的路径，这也可以保持较小的内存使用量。 

循环遍历刻意检查`e != prev_edge`。 如果没有这个条件，遍历将立即沿着刚刚使用的边缘走回。 自循环是单独处理的，因为两个循环方向代表完全相同的可见数，因此代表相同的翻转集。 

所有涉及路数的算术都会以模 (998244353) 进行减少。 翻转次数最多为(n)，因此普通Python整数就足够了，不存在溢出问题。 

## 工作示例

 对于示例 1，该图由两个独立的树组件组成。 

第一个组件包含卡片 ((1,2)) 和 ((1,3))。 其剥离过程最终选择一个顶点作为根。 相关的重新生根状态是：

 | 根| 边缘 (1-2) 成本 | 边缘 (1-3) 成本 | 总计 |
 | --- | --- | --- | --- |
 | 1 | 1 | 1 | 2 |
 | 2 | 0 | 1 | 1 |
 | 3 | 1 | 0 | 1 |

 因此其最小值为 1，并且有 2 个最优根。 

第二个分量具有完全相同的形状，具有顶点 (4,5,6)，因此其最小值也是 1，有 2 个最优根。 

这些组件是独立的，总共给出最小 (1+1=2) 和 (2\cdot2=4) 最小翻转集。 

| 组件| 基础树成本| 最低周期成本| 局部最小值| 本地方式 |
 | --- | --- | --- | --- | --- |
 | (1,2,3) | (1,2,3) | 1 | 0 | 1 | 2 |
 | (4,5,6) | 1 | 0 | 1 | 2 |
 | 总计 | 2 | 0 | 2 | 4 |

 所以输出是`2 4`，匹配样本。 

对于示例 2，两张卡在顶点 1 处都是自循环。每个循环贡献 2 度，因此顶点 1 具有 4 度。 没有叶子可以被移除，并且剩余的度既不是零也不是二。 

| 顶点| 初始学位 | 去皮后| 有效的核心学位？ |
 | --- | --- | --- | --- |
 | 1 | 4 | 4 | 没有 |

 该组件包含两条边，但只有一个顶点。 它的总入度必须为 2，而单个顶点最多可以接受 1。 该算法拒绝测试用例并打印`-1 -1`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n)) | (O(n)) | 每张卡提供两个邻接记录，并且剥离、组件遍历、重新定位和循环遍历每个仅检查每个记录恒定的次数。 |
 | 空间| (O(n)) | (O(n)) | 有 (O(n)) 个与图相关的顶点和 (O(n)) 个边，存储在紧凑数组中。 |

 最大的测试用例有 (n=10^5)，所有测试用例的总数为 (10^6)。 该算法执行恒定数量的线性图遍历，因此总工作量为 (O(\sum n))。 紧凑邻接表示还使内存与 (n) 成比例，这适合 128 MB 限制。 

## 测试用例```python
import sys
import io
from array import array

MOD = 998244353
input = sys.stdin.readline

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())
        V = 2 * n + 1

        head = array('i', [-1]) * V
        to = array('i', [0]) * (2 * n)
        nxt = array('i', [0]) * (2 * n)
        x = array('i', [0]) * n
        y = array('i', [0]) * n
        degree = array('i', [0]) * V

        for i in range(n):
            a, b = map(int, input().split())
            x[i] = a
            y[i] = b

            p = 2 * i
            to[p] = b
            nxt[p] = head[a]
            head[a] = p

            to[p + 1] = a
            nxt[p + 1] = head[b]
            head[b] = p + 1

            if a == b:
                degree[a] += 2
            else:
                degree[a] += 1
                degree[b] += 1

        parent = array('i', [-1]) * V
        child_cost = bytearray(V)
        removed = bytearray(n)

        queue = []
        for v in range(1, V):
            if head[v] != -1 and degree[v] == 1:
                queue.append(v)

        q = 0
        while q < len(queue):
            v = queue[q]
            q += 1

            if degree[v] != 1:
                continue

            arc = head[v]
            while arc != -1:
                e = arc >> 1
                if not removed[e]:
                    break
                arc = nxt[arc]

            if arc == -1:
                continue

            removed[e] = 1

            a = x[e]
            b = y[e]
            u = b if a == v else a

            parent[v] = u
            child_cost[v] = 1 if x[e] == u else 0

            degree[v] -= 1
            degree[u] -= 1

            if degree[u] == 1:
                queue.append(u)

        if any(degree[v] not in (0, 2) for v in range(1, V)):
            out.append("-1 -1")
            continue

        seen = bytearray(V)
        root_cost = array('i', [0]) * V

        total_cost = 0
        total_ways = 1

        for start in range(1, V):
            if head[start] == -1 or seen[start]:
                continue

            stack = [start]
            seen[start] = 1
            vertices = []
            base = 0
            cycle_start = -1

            while stack:
                v = stack.pop()
                vertices.append(v)
                base += child_cost[v]

                if degree[v] > 0:
                    cycle_start = v

                arc = head[v]
                while arc != -1:
                    u = to[arc]
                    if not seen[u]:
                        seen[u] = 1
                        stack.append(u)
                    arc = nxt[arc]

            if cycle_start == -1:
                root = next(v for v in vertices if parent[v] == -1)

                root_cost[root] = base
                best = base
                ways = 0

                stack = [root]
                while stack:
                    v = stack.pop()
                    cv = root_cost[v]

                    if cv < best:
                        best = cv
                        ways = 1
                    elif cv == best:
                        ways += 1

                    arc = head[v]
                    while arc != -1:
                        u = to[arc]
                        e = arc >> 1

                        if parent[u] == v:
                            delta = (x[e] == u) - (x[e] == v)
                            root_cost[u] = cv + delta
                            stack.append(u)

                        arc = nxt[arc]

                total_cost += best
                total_ways = total_ways * ways % MOD

            else:
                cv = [cycle_start]
                ce = []

                cur = cycle_start
                prev = -1

                while True:
                    arc = head[cur]
                    e = -1

                    while arc != -1:
                        z = arc >> 1
                        if not removed[z] and z != prev:
                            e = z
                            break
                        arc = nxt[arc]

                    if e == -1:
                        break

                    ce.append(e)

                    a = x[e]
                    b = y[e]
                    nxt_v = b if a == cur else a

                    if nxt_v == cycle_start:
                        break

                    cv.append(nxt_v)
                    prev = e
                    cur = nxt_v

                k = len(cv)

                if k == 1:
                    cycle_cost = 0
                    ways = 1
                else:
                    a = 0
                    b = 0

                    for i in range(k):
                        u = cv[i]
                        v = cv[(i + 1) % k]
                        e = ce[i]

                        if x[e] == u:
                            a += 1
                        if x[e] == v:
                            b += 1

                    if a < b:
                        cycle_cost = a
                        ways = 1
                    elif b < a:
                        cycle_cost = b
                        ways = 1
                    else:
                        cycle_cost = a
                        ways = 2

                total_cost += base + cycle_cost
                total_ways = total_ways * ways % MOD

        out.append(f"{total_cost} {total_ways}")

    return "\n".join(out)

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_stdout = sys.stdout
    old_input = input

    try:
        sys.stdin = io.StringIO(inp)
        input = sys.stdin.readline
        sys.stdout = io.StringIO()

        ans = solve()
        if ans is None:
            ans = sys.stdout.getvalue()

        return ans.strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        input = old_input

sample = """\
3
4
1 2
1 3
4 5
4 6
2
1 1
1 1
3
1 2
3 4
5 6
"""

assert run(sample) == "2 4\n-1 -1\n0 1", "provided samples"

assert run("""\
1
1
1 2
""") == "0 1", "minimum-size ordinary card"

assert run("""\
1
1
1 1
""") == "0 1", "minimum-size self-loop"

assert run("""\
1
2
1 2
1 3
""") == "1 2", "tree with two optimal roots"

assert run("""\
1
2
1 1
1 1
""") == "-1 -1", "all-equal values are impossible"

assert run("""\
1
2
1 4
2 3
""") == "0 1", "maximum endpoint value 2n"

# Maximum-size linear case.
n = 100000
lines = ["1", str(n)]
for i in range(1, n + 1):
    lines.append(f"{i} {i + 1}")

assert run("\n".join(lines) + "\n") == "0 1", "maximum-size path"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 / 1 2`|`0 1`| 最小化普通外壳，无不必要的翻盖 |
 |`1 / 1 / 1 1`|`0 1`| 自循环处理|
 |`1 / 2 / 1 2 / 1 3`|`1 2`| 树重新生根并计算多个最佳根 |
 |`1 / 2 / 1 1 / 1 1`|`-1 -1`| 不可能的组件，其顶点有太多边 |
 |`1 / 2 / 1 4 / 2 3`|`0 1`| 边界值 (2n) 和已经有效的方向 |
 | (100000) 张卡片的路径 |`0 1`| 最大尺寸输入和线性复杂度 |

 ## 边缘情况

 自循环例如```
1
1
1 1
```图中的度数为 2，因为一个循环对该度数贡献了 2。 它在叶子剥皮过程中不会被移除，因此被认为是单顶点循环。 循环处理程序单独处理这种情况，并分配零翻转成本和一个方向。 输出是`0 1`。 

对于不可能的全等分量，例如```
1
2
1 1
1 1
```顶点 1 的度数为四。 没有叶子可用，剩余度数也不是二。 该算法在尝试任何方向计算之前拒绝该组件，产生`-1 -1`。 

为了树```
1
2
1 2
1 3
```去皮的叶子有2和3片，其中1片是最后存活的根。 以 1 为根的基本方向需要翻转两次。 在 2 处重新生根将成本改变 (-1)，给出成本 1。在 3 处重新生根也给出成本 1。两个根都达到最佳值，因此组件贡献`1 2`。 

对于循环```
1
3
1 2
2 3
1 3
```没有树边可以剥皮。 剩余的循环可以定向在两个方向上。 一个方向翻转一张牌，另一个方向也翻转一张牌。 由于两个方向以相反的方式反转每个循环边缘，因此它们对应于不同的翻转集，因此该组件贡献`1 2`。 

对于已经有效的输入，例如```
1
3
1 2
3 4
5 6
```每个分量都是一条边，其初始方向已经满足唯一数条件。 每棵树在与最初选择的方向相反的端点处都有一个最佳根，从而实现零翻转。 正好有一个最小翻转集，即空集，所以结果是`0 1`。
