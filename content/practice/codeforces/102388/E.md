---
title: "CF 102388E - 马厩"
description: "我们有一个无向图，其中包含最多 50 个城市和最多 2500 条道路。 一条道路可以连接两个不同的城市，也可以将一个城市连接到自身，因此允许存在环路。 从一个城市出发，我们必须精确地沿着 (k) 条路到达同一个城市。"
date: "2026-08-14T13:55:45+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102388
codeforces_index: "E"
codeforces_contest_name: "SUFE ICPC Team Formation Test"
rating: 0
weight: 102388
solve_time_s: 313
verified: false
draft: false
---

[CF 102388E - 马厩](https://codeforces.com/problemset/problem/102388/E)

 **评级：** -
 **标签：** -
 **求解时间：** 5m 13s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个无向图，其中包含最多 50 个城市和最多 2500 条道路。 一条道路可以连接两个不同的城市，也可以将一个城市连接到自身，因此允许存在环路。 从一个城市出发，我们必须精确地沿着 (k) 条路到达同一个城市。 如果这样一条长度为 (k) 的封闭步行道存在，则城市是有效的。 

任务是独立统计所有有效的起始城市。 不同的城市可能使用完全不同的步行，并且允许重复城市和道路的步行。 

(n) 的小值是主要线索。 如果只有 50 个顶点，则 (O(n^3)) 甚至 (O(n^3 \log k)) 方法在编译语言中都是合理的，而巨大的值 (k \le 10^9) 排除了每天直接处理的任何内容。 我们需要避免做与 (k) 成比例的功。 最多 2500 条道路的事实也意味着图遍历和小型动态程序很便宜。 

有几种边缘情况可能会欺骗仅基于奇偶校验的解决方案。 

首先，(k=0) 意味着马没有移动，因此每个城市都已经恢复原状。 例如，```
1
1 0 0
```有输出```
1
```需要至少遍历一次道路的解决方案将错误地返回零。 

其次，孤立的顶点不能进行任何正长度的行走。 例如，```
1
2 0 2
```有输出```
0
```两个城市都没有道路，因此即使 2 是偶数，通常的“每个正偶数长度都有效”的论点也不适用。 

第三，循环创建长度为一的闭合行走。 例如，```
1
1 1 1
0 0
```有输出```
1
```将图视为简单图并忽略循环的二分检查会错误地将此组件分类为二分。 

第四，对于小奇数 (k) 来说，处于非二分组件中本身是不够的。 考虑```
1
3 3 1
0 1
1 2
2 0
```该三角形是非二分三角形，但不存在单步闭合游走，因为没有循环。 正确的输出是```
0
```这就是算法在使用最终奇偶校验属性之前恰好处理小 (k) 的原因。 

## 方法

 直接的方法是通过动态规划来模拟行走。 对于每个起始城市，确保在恰好 (t) 个步骤后可到达城市集。 最初只有 (s) 是可达的。 对于每一步，请遵循当前可到达的每个城市的每条事故道路。 在 (k) 步骤之后，检查 (s) 本身是否可达。 

这是正确的，因为 (t) 步骤之后的状态恰好包含所有长度 (t) 的行走的可能端点。 问题在于(k)的值。 在最坏的情况下，动态程序在对每个起始城市运行时都会执行 (O(k n m)) 邻接处理。 对于 (k=10^9)、(n=50) 和 (m=2500)，这大约是 (1.25 \cdot 10^{14}) 图转换。 大的 (k) 使得这不可能。 

关键的观察结果是，无向图对于封闭游走具有非常简单的长期模式。 每个非孤立顶点处的每个正偶数长度都是可能的，因为我们可以遍历任何入射边并立即将其遍历回来。 重复两步步行可以得到每个正偶数长度。 

奇数长度的行为不同。 当连通分量不包含奇环时，它就是二分连通分量。 在二分组件中，每个闭合游走的长度都是偶数，因此 (k) 的奇数值不起作用。 在非二分组件中，每个顶点最终都有两个奇偶校验的闭合游走。 更具体地说，每个顶点最多有一个长度为 (2n-1) 的奇数闭合游走。 一旦存在一个奇数封闭游走，我们就可以添加任意数量的两步回溯，因此每个足够大的奇数长度也存在。 

这给了我们一个干净的分裂。 如果 (k) 至多为 (2n)，我们只需使用小型位集动态程序即可精确计算答案。 如果 (k) 大于 (2n)，我们就不再需要精确的行走结构。 对于偶数 (k)，每个非孤立顶点都有效。 对于奇数 (k)，恰好属于非二分组件的顶点起作用。 

位集表示使得精确部分特别便宜。 一组可达城市由一个 Python 整数表示，其中当城市 (j) 可达时设置位 (j)。 为了前进一步，对于每个可达城市 (v)，我们将其邻接位集或到新的可达集中。 从 (n\le50) 开始，所有这些都适合几个机器大小的 Python 整数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 所有 (k) 步骤的暴力 DP | (O(k·n·m)) | (O(n^2)) | 太慢了 |
 | 精确位集 DP 高达 (2n)，然后进行奇偶校验/分量分析 | (O(n^2 \min(k,n) + n+m)) | (O(n+m)) | 已接受 |

 ## 算法演练

 1. 为图构建邻接列表和邻接位集。 邻接表用于确定连通分量和二分性。 位集允许精确的动态程序使用快速整数或运算来更新所有可能的端点。 
2. 如果(k=0)，则返回(n)。 无论图表如何，空行的起点和终点都在同一个城市。 
3. 如果 (k\le2n)，精确计算答案。 对于每个城市 (i)，初始可达集就是 ({i})，用整数 (1\ll i) 表示。 一步之后，将可达集替换为所有当前可达城市的邻接集的并集。 准确地重复此操作 (k) 次。

在第 (t) 次迭代之后，当存在从原始城市 (i) 到城市 (j) 的长度为 (t) 的步行时，位置 (j) 处的位被准确设置。 因此，(k) 次迭代后的对角线位准确地告诉我们哪些城市具有长度为 (k) 的闭合步行。 
4. 如果 (k>2n)，则对每个连接的组件运行 BFS 或 DFS，同时为每个顶点分配二进制颜色。 在二部图中，沿着每条普通边，其端点必须具有相反的颜色。 如果一条边连接两个具有相同颜色的顶点，则该分量包含奇数环并且是非二分的。 循环会立即产生这样的冲突，因为它的两个端点是相同的顶点。 
5. 对于大偶数 (k)，计算每个度数为正的顶点。 从这样的顶点，选择一个入射边并来回遍历它。 重复这个两步步行会产生任何正偶数长度。 
6. 对于大奇数 (k)，计算其组件被发现为非二分的每个顶点。 非二分组件包含奇数循环。 从任意顶点步行到该循环，遍历该循环一次，然后沿相同路径返回。 这给出了一个奇怪的封闭行走。 该结构的长度最多为(2n-1)，并且因为(k>2n)，所以(k)与该奇数长度之间的差是正偶数。 我们可以通过重复的两步回溯来填补这个差异。 

### 为什么它有效

 对于精确部分，不变量是经过 (t) 次迭代后，`reach[i]`精确包含从 (i) 通过精确 (t) 条边的行走可到达的顶点。 更新采用当前每个可到达的顶点并遵循另一条边，因此它既不会错过可能的行走，也不会引入不可能的端点。 因此，当 (i) 处存在长度 (k) 闭合游走时，(k) 次迭代后的位 (i) 被准确设置。 

对于较大的 (k)，首先考虑偶数长度。 任何非孤立顶点都具有双边闭合游走，通过在两个方向上遍历入射边获得。 重复它给出每个正偶数长度。 孤立的顶点根本没有正向行走。 

对于奇数长度，二分组件不能包含奇数闭合路径，因为每条边都会改变二分边，因此在奇数条边之后，路径必须位于相反的一侧。 非二分组件包含奇数循环。 对于顶点 (v)，取一条从 (v) 到该循环的长度为 (d) 的最短路径，并令奇数循环的长度为 (l)。 可以选择路径和循环仅在端点处相交，因此 (d+l\le n)。 由此产生的闭合行走的长度为 (2d+l)，最多为 (d+n\le2n-1)。 添加任意数量的两条边回溯都会得到每个更大的奇数长度。 由于算法仅在 (k>2n) 时使用此参数，因此所需的大奇数长度始终可达。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(n, m, k, edges):
    graph = [[] for _ in range(n)]
    adj_bits = [0] * n
    degree = [0] * n

    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

        adj_bits[u] |= 1 << v
        adj_bits[v] |= 1 << u

        degree[u] += 1
        degree[v] += 1

    if k == 0:
        return n

    # Small k: compute the exact set of endpoints after k steps.
    if k <= 2 * n:
        reach = [1 << i for i in range(n)]

        for _ in range(k):
            new_reach = [0] * n

            for start in range(n):
                bits = reach[start]
                result = 0

                while bits:
                    low = bits & -bits
                    v = low.bit_length() - 1
                    result |= adj_bits[v]
                    bits -= low

                new_reach[start] = result

            reach = new_reach

        answer = 0
        for i in range(n):
            if (reach[i] >> i) & 1:
                answer += 1

        return answer

    # Large k: only the parity structure of each component matters.
    color = [-1] * n
    component = [-1] * n
    component_bad = []

    for start in range(n):
        if color[start] != -1:
            continue

        cid = len(component_bad)
        component_bad.append(False)

        color[start] = 0
        component[start] = cid
        stack = [start]

        while stack:
            u = stack.pop()

            for v in graph[u]:
                if color[v] == -1:
                    color[v] = color[u] ^ 1
                    component[v] = cid
                    stack.append(v)
                elif color[v] == color[u]:
                    component_bad[cid] = True

    if k % 2 == 0:
        return sum(degree[i] > 0 for i in range(n))

    return sum(component_bad[component[i]] for i in range(n))

def solve():
    t = int(input())

    for _ in range(t):
        n, m, k = map(int, input().split())
        edges = [tuple(map(int, input().split())) for _ in range(m)]

        print(solve_case(n, m, k, edges))

if __name__ == "__main__":
    solve()
```第一部分`solve_case`构造两个图形表示。`graph`存储后续组件和二分遍历的边。`adj_bits[u]`将 (u) 的每个邻居存储在一个整数中，因此再采取一个图步骤就变成了一系列整数 OR 运算。 

确切的动态程序开始于`1 << i`对于城市 (i)，因为在采取任何边之前，唯一可到达的城市是 (i) 本身。 对于每个可到达的顶点`v`,`adj_bits[v]`包含附加步骤后所有可能的目的地。 对所有这些掩码进行“或”运算即可准确给出下一个可到达的集合。 

循环仅限于`k <= 2 * n`。 这个界限是有意为之的。 我们不需要知道超出 (2n) 的精确行走长度，因为组件结构完全决定了那里的答案。 

二分遍历分配颜色`0`和`1`。 循环出现在`graph[u]`作为一条边`u`对自己来说，所以`color[v] == color[u]`立即将该组件标记为非二分组件。 平行边不会产生问题，因为重复相同的邻接检查不会改变结果。 

即使对于较大的 (k)，`degree[i] > 0`是完整的条件。 对于奇数大 (k)，组件标识符将每个顶点映射到其二分状态，因此`component_bad[component[i]]`直接判断城市 (i) 是否属于非二分组件。 

Python 中不存在整数溢出问题。 最大的位集只有 50 个相关位，并且 (k) 被存储为普通的 Python 整数。 

## 工作示例

 ### 示例 1，第一个测试用例

 该图是一条长度为 2 的路径，城市 0 位于中间。 

对于 (k=3)，我们处于精确 DP 范围内，因为 (3\le2n=6)。 

| 步骤| 城市 0 可到达 | 可到达城市 1 | 城市 2 可到达 |
 | --- | --- | --- | --- |
 | 0 | {0} | {1} | {2} |
 | 1 | {1,2} | {0} | {0} |
 | 2 | {0} | {1,2} | {1,2} |
 | 3 | {1,2} | {0} | {0} |

 三步后没有一行包含其起始城市，因此答案为 0。 

该图是二分图，这也解释了为什么奇数闭合游走根本不存在。 仍然使用精确的 DP，因为该算法必须处理 (k) 的所有小值，包括仅最终奇偶校验不足的情况。 

### 示例 1，第三个测试用例

 该图包含一个三角形 (0,1,2)，以及路径 (3-4-0)。 这里 (n=5) 和 (k=5)，所以再次使用 (k\le2n) 和精确的 DP。 

| 步骤| 城市 0 | 城市 1 | 城市2 | 城市3 | 城市 4 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | {0} | {1} | {2} | {3} | {4} |
 | 1 | {1,2,4} | {0,2} | {0,1} | {4} | {0,3} |
 | 2 | {0,2,3,4} | {0,1,4} | {0,1,2,4} | {0,3} | {1,2,4} |
 | 3 | {0,1,2,3,4} | {0,1,2,3} | {0,1,2,3,4} | {4} | {0,1,2,3} |
 | 4 | {0,1,2,3,4} | {0,1,2,3,4} | {0,1,2,3,4} | {0,3} | {0,1,2,4} |
 | 5 | {0,1,2,3,4} | {0,1,2,3,4} | {0,1,2,3,4} | {4} | {0,1,2,3,4} |

 城市 0、1、2 和 4 在五步后就控制住了自己。 城市 3 没有，所以答案是 4。 

该示例还说明了为什么仅靠连接是不够的。 城市 3 与非二分三角形相连，但它没有长度为 5 的奇数闭合路径。 精确的计算正确地处理了短距离限制。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n^2\min(k,2n)+n+m)) | 每个精确DP步骤最多处理(n)个可达集，每个可达集最多包含(n)个顶点。 Large(k)只需要遍历一次图。 |
 | 空间| (O(n+m)) | 邻接列表、位集、颜色、组件 ID 和 DP 数组都最多使用 (O(n+m)) 空间。 |

 对于 (n\le50)，精确阶段最多执行 (2n=100) 次迭代。 即使在密集图中，每次迭代也仅处理 50 个小位集，因此工作量很小。 Large-(k)阶段只是线性图的遍历。 该解决方案完全符合 3 秒和 256 MB 的限制。 

## 测试用例

 以下测试工具通过以下方式重现了该算法`solve_case`并将样本与几种边界情况一起检查。```python
import io

def solve_case(n, m, k, edges):
    graph = [[] for _ in range(n)]
    adj_bits = [0] * n
    degree = [0] * n

    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
        adj_bits[u] |= 1 << v
        adj_bits[v] |= 1 << u
        degree[u] += 1
        degree[v] += 1

    if k == 0:
        return n

    if k <= 2 * n:
        reach = [1 << i for i in range(n)]

        for _ in range(k):
            new_reach = [0] * n

            for start in range(n):
                bits = reach[start]
                result = 0

                while bits:
                    low = bits & -bits
                    v = low.bit_length() - 1
                    result |= adj_bits[v]
                    bits -= low

                new_reach[start] = result

            reach = new_reach

        return sum((reach[i] >> i) & 1 for i in range(n))

    color = [-1] * n
    component = [-1] * n
    component_bad = []

    for start in range(n):
        if color[start] != -1:
            continue

        cid = len(component_bad)
        component_bad.append(False)

        color[start] = 0
        component[start] = cid
        stack = [start]

        while stack:
            u = stack.pop()

            for v in graph[u]:
                if color[v] == -1:
                    color[v] = color[u] ^ 1
                    component[v] = cid
                    stack.append(v)
                elif color[v] == color[u]:
                    component_bad[cid] = True

    if k % 2 == 0:
        return sum(degree[i] > 0 for i in range(n))

    return sum(component_bad[component[i]] for i in range(n))

def run(inp):
    data = list(map(int, inp.split()))
    p = 0

    t = data[p]
    p += 1
    out = []

    for _ in range(t):
        n, m, k = data[p], data[p + 1], data[p + 2]
        p += 3

        edges = []
        for _ in range(m):
            u, v = data[p], data[p + 1]
            p += 2
            edges.append((u, v))

        out.append(str(solve_case(n, m, k, edges)))

    return "\n".join(out) + "\n"

# Provided sample.
sample = """\
3
3 2 3
0 1
0 2
3 2 4
0 1
0 2
5 5 5
0 1
1 2
2 0
3 4
4 0
"""
assert run(sample) == "0\n3\n4\n", "sample"

# Minimum-size graph, no edges, k = 0.
assert run("""\
1
1 0 0
""") == "1\n", "k = 0"

# One vertex with several loops, all endpoints equal.
# Every positive k is possible.
assert run("""\
1
1 5 1000000000
0 0
0 0
0 0
0 0
0 0
""") == "1\n", "all-equal loop edges"

# Boundary between the exact and large-k phases.
# A single edge is bipartite, so even lengths work and odd lengths do not.
assert run("""\
4
2 1 4
0 1
2 1 5
0 1
3 2 6
0 1
1 2
3 2 7
0 1
1 2
""") == "2\n0\n3\n0\n", "parity boundary"

# Large odd k in a non-bipartite component.
# Triangle plus a leaf. Every vertex belongs to the same non-bipartite component.
assert run("""\
1
4 4 1000000001
0 1
1 2
2 0
2 3
""") == "4\n", "large odd non-bipartite"

# Maximum-size graph: complete graph on 50 vertices.
# There are 50^2 = 2500 roads when loops are included.
# Every vertex has a loop, so every positive k works.
n = 50
edges = [(i, j) for i in range(n) for j in range(n)]
max_input = "1\n50 2500 1000000000\n"
max_input += "\n".join(f"{u} {v}" for u, v in edges) + "\n"

assert run(max_input) == "50\n", "maximum-size dense graph"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 0 0`|`1`| 空游和最小图尺寸 |
 |`1 / 1 5 1000000000 / 0 0 ...`|`1`| 循环和任意大的奇数长度 |
 | 单边和路径情况 (k=4,5,6,7) |`2,0,3,0`| 偶数与奇数封闭游走以及小/大边界 |
 | 带有叶子和巨大奇数 (k) 的三角形 |`4`| 大奇数 (k) 的非二分分量处理 |
 | 50 个顶点和 2500 条道路的完整图 |`50`| 最大值 (n)、最大值 (m) 和密集邻接 |

 ## 边缘情况

 对于 (k=0)，考虑```
1
1 0 0
```该算法立即返回`n`，即 1。不需要邻接信息，因为零长度步行不需要道路。 这避免了要求起始城市具有正度的常见错误。 

对于具有正偶数 (k) 的孤立顶点，考虑```
1
2 0 2
```不使用大 (k) 快捷方式，因为 (2\le2n)，因此确切的 DP 开头为`{0}`和`{1}`。 一步之后，两组都变空，因为没有关联边，并且它们仍然是空的。 对角线位都不存在，给出 0。如果相同的情况有一个更大的偶数 (k)，则大 (k) 分支将显式检查`degree[i] > 0`，阻止一座孤立的城市被接受。 

对于循环，请考虑```
1
1 1 1
0 0
```精确的 DP 从设置位 0 开始。 一步之后，它对顶点 0 的邻接掩码进行或运算，由于循环，该顶点包含位 0。 对角位保持设置，因此答案为 1。在 large-(k) 分支中，相同的循环使二分遍历遇到端点具有相同颜色的边，从而标记组件非二分。 

对于奇数 (k) 较小的非二分图，请考虑三角形```
1
3 3 1
0 1
1 2
2 0
```该图包含奇数环，但没有环。 当 (k=1) 时，任何顶点都不能在一条边上返回自身。 由于 (1\le2n)，使用精确的 DP 并正确返回 0。这就是大 (k) 奇偶校验分类不能简单地应用于每个奇数 (k) 的原因。 

最后，考虑一个具有非常大的奇数 (k) 的二分图：```
1
3 2 1000000001
0 1
1 2
```这里 (k>2n)，因此算法运行二分检查而不是迭代十亿次。 该组件是二分组件，因此`component_bad`是假的。 由于 (k) 是奇数，因此不会计算任何城市，并且答案为 0。结果是根据二分图中的每个闭合步行的长度为偶数这一事实得出的。
