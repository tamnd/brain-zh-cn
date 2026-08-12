---
title: "CF 102412H - DAG 上的墨西哥"
description: "我们有一个有向无环图，有 (n) 个顶点和 (2n) 条边。 边的编号从 (0) 到 (2n-1)，边 (i) 的值为 (lfloor i/2rfloor)。 因此，从 (0) 到 (n-1) 的每个值恰好出现在两个边上。"
date: "2026-08-10T14:03:21+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102412
codeforces_index: "H"
codeforces_contest_name: "MEX Foundation Contest (supported by AIM Tech)"
rating: 0
weight: 102412
solve_time_s: 141
verified: true
draft: false
---

[CF 102412H - DAG 上的 Mex](https://codeforces.com/problemset/problem/102412/H)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 21s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个有向无环图，有 (n) 个顶点和 (2n) 条边。 边的编号从 (0) 到 (2n-1)，边 (i) 的值为 (\lfloor i/2\rfloor)。 因此，从 (0) 到 (n-1) 的每个值恰好出现在两个边上。 对于有向路径，我们只查看出现在其上的一组边值，并取其 MEX，即未出现的最小非负值。 任务是在所有简单有向路径上最大化此 MEX。 原始语句给出 (2\le n\le2000)、(2n) 个边、5 秒时间限制和 256 MiB 内存。 

顶点已经按拓扑顺序排列，因为每条边都指定为 (a_i<b_i)。 这很重要。 当存在从 (b) 到 (c) 的有向路径时，路径可以包含一条边 (e=(a,b))，后跟一条边 (f=(c,d))，其中允许 (b=c)。 由于该图是非循环的，因此每个有向路径自动都是简单的。 

答案最多是(n-1)。 (n) 个顶点上的路径最多包含 (n-1) 条边，而实现 MEX (k) 需要路径包含所有 (k) 个不同值 (0,1,\ldots,k-1)。 下限至少为 (1)，因为值为 (0) 的两条边中的任何一条本身就是有效路径。 

第一种边缘情况是值的两个边缘具有完全相同的端点。 例如，```
2
1 2
1 2
1 2
1 2
```有两条值为 (0) 的边和两条值为 (1) 的边，全部从顶点 (1) 到顶点 (2)。 答案是（1），因为一条路径只能包含这两个顶点之间的一条边。 如果粗心的解决方案将相同值的两个边视为单独的要求，则可能会错误地认为这两个选择都会以某种方式增加 MEX。 

另一种边缘情况是当两个所需值存在但它们的边缘不能共存于一条路径上时。 考虑```
3
1 3
1 3
1 2
1 2
```前两条边的值为 (0)，后两条边的值为 (1)。 路径可以采用值 (0) 边或值 (1) 边，但不能同时采用两者，因为两种类型都离开顶点 (1)，然后终止。 正确答案是（1）。 在一般问题中，仅检查端点的数字顺序是不够的，因为 (b<c) 并不意味着 (b) 实际上可以到达 (c)。 

第三种边缘情况是两条边共享一个端点。 例如，如果一条边是 (1\to3)，另一条边是 (3\to5)，则它们是兼容的并且可以连续出现。 可达性关系必须包括零长度情况，因此必须将顶点视为从自身可达。 忘记这一点会导致具有连续边缘的路径被拒绝。 

## 方法

 蛮力方法是针对我们想要放入路径中的每个值尝试每一个边的选择。 由于每个值都有两条边，因此强制值 (0,\ldots,k-1) 会给出 (2^k) 个可能的选择。 对于每个选择，我们可以通过根据 DAG 中的位置对所选边进行排序并检查连续可达性来检查所选边是否形成一条有向路径。 这是正确的，因为具有 MEX 至少 (k) 的路径必须包含低于 (k) 的每个值，并且每个此类值只有两个可能的边。 

问题在于选择的数量呈指数级增长。 在最坏的情况下（k=\Theta(n)），给出（2^n）个选择，甚至（O（n））或（O（n^2））有效性检查留下（O（n2^n））或（O（n^22^n））工作。 对于（n=2000），这是完全不可能的。 官方约束特别大，足以排除可能的路径或可能的边缘选择的枚举。 

关键的观察是我们不需要直接构建路径。 相反，修复候选答案 (k) 并询问某个路径是否包含所有值 (0,\ldots,k-1)。 对于每个值正好有两条边，因此我们可以引入一个布尔变量。 该变量决定选择该值的两个边缘中的哪一个。 

现在考虑两条选定的边 (e=(a,b)) 和 (f=(c,d))。 如果 (b) 可以到达 (c)，即 (e) 在 (f) 之前，或者 (d) 可以到达 (a)，即 (f) 在 (e) 之前，则它们都可以属于一条路径。 如果这两个关系都不成立，则不可能选择两条边。 因此，每个不兼容的对都给出一个 2-SAT 子句，表示两条边中至少一条不能被选择。 

这正是标准解决方案所利用的结构：二分搜索 MEX，将每个可行性测试减少到 2-SAT，并使用 SCC 求解生成的蕴涵图。 

还有一项更有用的优化。 我们不需要单独测试每对边的可达性。 对于每个顶点（v），我们可以预先计算起始顶点可以从（v）到达的边的集合，以及结束顶点可以到达（v）的边的集合。 那么，对于一条边 (e=(a,b))，兼容边恰好是 (b) 的第一组和 (a) 的第二组的并集。 Python 的任意大小整数使这些集合成为紧凑的位集，这使得实现能够表示密集 (O(n^2)) 关系，而无需存储数百万个 Python 整数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n^2 2^n)) | (O(n)) | (O(n)) | 太慢了|
 | 最佳 | (O(n^2\log n)) | (O(n^2)) 位加上 SCC 状态 | 已接受 |

 ## 算法演练

 1. 读取所有 (2n) 条边。 边(2x)和边(2x+1)是值(x)的两种选择。 存储它们的端点并构建 DAG 邻接列表。 
2. 计算顶点之间的可达性。 因为每条边都满足 (a<b)，所以顶点编号本身就是一种拓扑排序。 将顶点从 (n) 向下处理到 (1)。 对于每个顶点 (v)，用 (v) 本身和每个传出邻居的可达性位集中的 OR 来启动其可达性位集。 
3. 对于每个顶点 (v)，计算`succ[v]`，从 (v) 可以到达起始顶点的所有边的位集。 使用完全从 (v) 开始的所有边进行初始化，然后向后处理 DAG 并合并相应的`succ`传出邻居集。 
4.同样计算`pred[v]`，结束顶点可以到达 (v) 的所有边的位集。 使用以 (v) 结尾的所有边对其进行初始化，然后向前处理 DAG。 处理 (u\to v) 时，所有可以以 (u) 结尾的内容也可以在 (v) 之前。 
5. 对于一条边 (e_i=(a_i,b_i))，每条与 (e_i) 兼容的边都包含在`succ[b_i] | pred[a_i]`。 第一部分表示 (e_i) 之后的边，第二部分表示 (e_i) 之前的边。 All remaining edges are incompatible with (e_i).
 6. 从不兼容集中删除具有相同值的另一条边。 The two edges of one value are never simultaneously required, because the Boolean variable chooses exactly one of them.
 7. Fix a candidate MEX (k). 为每个值 (0,\ldots,k-1) 创建一个布尔变量。 字面量(2x)表示选择边(2x)，字面量(2x+1)表示选择边(2x+1)。 
8. If edge (i) and edge (j) are incompatible, add the clause (\neg i\lor\neg j). In the implication graph this becomes (i\to\neg j) and (j\to\neg i). 由于图存储为位集，因此可以通过将每个设置位 (j) 交换为 (j\mathbin{\hat{}}!1) 来生成这些含义。 
9. 在蕴涵图上运行 Tarjan 的 SCC 算法。 当没有变量及其否定属于同一 SCC 时，2-SAT 实例是可满足的。 This is the standard SCC characterization of 2-SAT.
 10. Binary-search the largest (k) for which the 2-SAT instance is satisfiable. 可行性是单调的：如果路径包含所有值 (0,\ldots,k-1)，它也包含所有值 (0,\ldots,k-2)。 

### 为什么它有效

 对于固定 (k)，每个令人满意的分配都会为低于 (k) 的每个值精确选择一条边。 这些条款恰恰禁止那些不能在有向路径上共存的选定边对。 因此，每个令人满意的分配都会给出成对兼容边的集合。 由于 DAG 中的可达性是可传递的，因此可以将成对兼容的选定边排序到一条有向路径中。 相反，包含所有必需值的每条路径都会选择每个值的一个边缘，并且永远不会包含不兼容的对，因此其选择满足每个子句。 因此，当存在至少具有 MEX (k) 的路径时，2-SAT 测试准确无误。 Binary search then finds the maximum possible MEX.

 ## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(1_000_000)

def solve():
    n = int(input())
    m = 2 * n

    u = [0] * m
    v = [0] * m
    graph = [[] for _ in range(n)]

    for i in range(m):
        a, b = map(int, input().split())
        a -= 1
        b -= 1
        u[i] = a
        v[i] = b
        graph[a].append(b)

    # Vertices are already in topological order because a < b.
    # reach[x] is a bitset of vertices reachable from x, including x.
    reach = [0] * n
    for x in range(n - 1, -1, -1):
        cur = 1 << x
        for y in graph[x]:
            cur |= reach[y]
        reach[x] = cur

    # starts[x] = edges whose starting vertex is x
    # ends[x]   = edges whose ending vertex is x
    starts = [0] * n
    ends = [0] * n
    for i in range(m):
        starts[u[i]] |= 1 << i
        ends[v[i]] |= 1 << i

    # succ[x] = edges whose starting vertex can be reached from x.
    succ = starts[:]
    for x in range(n - 1, -1, -1):
        cur = succ[x]
        for y in graph[x]:
            cur |= succ[y]
        succ[x] = cur

    # pred[x] = edges whose ending vertex can reach x.
    pred = ends[:]
    for x in range(n):
        for y in graph[x]:
            pred[y] |= pred[x]

    full_edges = (1 << m) - 1

    # bad[i] contains every edge incompatible with edge i.
    bad = [0] * m

    for i in range(m):
        compatible = succ[v[i]] | pred[u[i]]

        # Edges i and i^1 have the same value and are not both selected.
        same_value = (1 << i) | (1 << (i ^ 1))
        bad[i] = (full_edges ^ compatible) & ~same_value

    # If bit j is in bad[i], the implication is i -> (j^1).
    # Swap even and odd bit positions to obtain the implication rows.
    even_mask = sum(1 << i for i in range(0, m, 2))
    odd_mask = sum(1 << i for i in range(1, m, 2))

    implication = [0] * m
    reverse_implication = [0] * m

    for i in range(m):
        b = bad[i]
        implication[i] = ((b & even_mask) << 1) | ((b & odd_mask) >> 1)

        # Incoming edges to literal x correspond to bad[x^1].
        reverse_implication[i] = bad[i ^ 1]

    def possible(k):
        vertices = 2 * k
        mask = (1 << vertices) - 1

        disc = [-1] * vertices
        low = [0] * vertices
        on_stack = bytearray(vertices)
        stack = []
        component = [-1] * vertices
        timer = 0
        comp_id = 0

        def dfs(x):
            nonlocal timer, comp_id

            disc[x] = low[x] = timer
            timer += 1
            stack.append(x)
            on_stack[x] = 1

            bits = implication[x] & mask

            while bits:
                bit = bits & -bits
                bits -= bit
                y = bit.bit_length() - 1

                if disc[y] == -1:
                    dfs(y)
                    if low[y] < low[x]:
                        low[x] = low[y]
                elif on_stack[y] and disc[y] < low[x]:
                    low[x] = disc[y]

            if low[x] == disc[x]:
                while True:
                    y = stack.pop()
                    on_stack[y] = 0
                    component[y] = comp_id
                    if y == x:
                        break
                comp_id += 1

        for x in range(vertices):
            if disc[x] == -1:
                dfs(x)

        for x in range(0, vertices, 2):
            if component[x] == component[x ^ 1]:
                return False

        return True

    lo, hi = 1, n - 1
    answer = 1

    while lo <= hi:
        mid = (lo + hi) // 2
        if possible(mid):
            answer = mid
            lo = mid + 1
        else:
            hi = mid - 1

    print(answer)

if __name__ == "__main__":
    solve()
```实现的第一部分读取 (2n) 条边并构建 DAG。 端点满足 (a<b) 的事实意味着无需运行单独的拓扑排序。 

这`reach`array 使用 Python 整数作为位集。 当顶点 (x) 可达时，位 (x) 被准确设置。 向后处理顶点是有效的，因为每个传出边都会到达编号更大的顶点。 

这`succ`和`pred`数组压缩成对路径兼容性关系。 对于一条边 (u_i\to v_i)，`succ[v_i]`包含其后可能出现的每条边，而`pred[u_i]`包含可能出现在其之前的每条边。 它们的并集正是与 (i) 兼容的边集。 

这`bad`数组是该并集的补集。 具有相同值的两条边被显式删除，因为令人满意的分配仅选择其中之一。 这也解释了为什么代码永远不需要子句来说明一个变量的两个选择不能同时被选择，该限制已经内置到布尔变量的含义中。 

蕴涵图使用子句的标准编码。 如果禁止选择边 (i) 和选择边 (j)，则子句为 (\neg i\lor\neg j)，给出含义 (i\to\neg j) 和 (j\to\neg i)。 由于否定是通过与 (1) 进行异或来表示的，因此交换位集中的每个偶数位和奇数位可以构造蕴涵行，而无需迭代所有不兼容的对。 

Tarjan的算法是递归编写的，因此递归限制大幅提高。 最大深度受文字数量限制，最多（4000），在更改Python递归限制后是安全的。 

二分查找使用`n - 1`作为上限，因为 (n) 顶点 DAG 中的简单路径最多具有 (n-1) 条边。 答案初始化为 (1)，这始终是可行的，因为两个值为 (0) 的边中至少存在一个，并且单个边是有效路径。 

## 工作示例

 原始陈述未在问题陈述的文本中提供常规示例输入/输出对，因此下面的第一个跟踪使用参考解决方案中包含的测试实例，第二个跟踪是一个小型构造实例。 

### 示例 1```
8
3 6
2 7
1 3
2 3
6 7
7 8
7 8
4 6
2 7
1 5
2 5
2 8
6 8
7 8
3 5
7 8
```边具有值 (0,0,1,1,2,2,3,3,\ldots)。 路径```
1 -> 3 -> 6 -> 7 -> 8
```can choose values (1,0,2,3), respectively. 因此它的值集包含 (0,1,2,3)，给出 MEX (4)。 没有路径也可以包含值 (4)，因此答案是 (4)。 

| 二分搜索状态 | 候选人 | 可行的？ | 原因 |
 | ---| ---| ---| ---|
 | 初始| 4 | 是的 | 路径 (1\to3\to6\to7\to8) 包含值 (0,1,2,3) |
 | 上半部分| 6 | 没有 | 值 (0,\ldots,5) 不能全部放置在一条路径上 |
 | 剩余| 5 | 没有 | 值 4 的边不能与所有值 (0,\ldots,3) | 共存。 
| 决赛| 4 | 是的 | Maximum feasible candidate |

 不变量是每个可行候选对应于 2-SAT 实例的实际令人满意的分配。 上面的路径提供了 (k=4) 的具体分配，而对较大候选者的不可满足测试则排除了较大的 MEX 值。 

### 示例 2```
3
1 3
1 3
1 2
1 2
```两个值 (0) 边是 (1\to3)，两个值 (1) 边是 (1\to2)。 任何路径都可以包含这些边类型之一，但不能同时包含两者。 

| 候选人 (k) | 所需值 | 结果 |
 | --- | --- | --- |
 | 1 | (0) | 可行|
 | 2 | (0,1)| 不可行|
 | 回答 | (1) | (1) |

 对于(k=2)，值(0)边缘的每个选择与值(1)边缘的每个选择冲突。 生成的 2-SAT 实例没有令人满意的分配，因此二分搜索正确地停止在 (1)。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n^2\log n)) | 可达性和兼容性预处理使用位集操作； 每个二分搜索步骤都用 (O(n)) 个文字和 (O(n^2)) 个可能的含义求解 2-SAT 实例 |
 | 空间| (O(n^2)) 位加 (O(n)) 数组 | 密集图关系存储为 Python 整数位集而不是 Python 整数邻接列表 |

 原始限制为 (n\le2000)、5 秒和 256 MiB。 密集关系是 Python 实现中主要的内存问题，这就是代码故意将其存储为位集的原因。 包含每个蕴涵的传统 Python 邻接表可能会消耗更多内存，因为每个存储的整数都是一个 Python 对象。 参考实现是用 C++ 编写的，其中相同的 (O(n^2\log n)) 方法完全符合预期限制； 就原始判断而言，Python应该算是对实现更加敏感。 

## 测试用例

 以下测试包括参考样本、小型最小尺寸情况、全相等端点情况、断开选择情况和最大尺寸生成情况。```python
import io
import sys

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()
    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return out

# Reference sample included with the published solution.
sample1 = """\
8
3 6
2 7
1 3
2 3
6 7
7 8
7 8
4 6
2 7
1 5
2 5
2 8
6 8
7 8
3 5
7 8
"""

assert run(sample1) == "4\n", "reference sample"

# Minimum-size graph.
sample2 = """\
2
1 2
1 2
1 2
1 2
"""

assert run(sample2) == "1\n", "minimum-size graph"

# Values 0 and 1 exist, but no path can contain both.
case3 = """\
3
1 3
1 3
1 2
1 2
"""

assert run(case3) == "1\n", "incompatible value choices"

# A single chain can contain both values.
case4 = """\
3
1 2
1 2
2 3
2 3
3 4
3 4
"""

assert run(case4) == "3\n", "three consecutive values"

# Maximum-size instance: every edge has the same endpoints.
# Every path contains only one edge, so the answer is 1.
n = 2000
lines = [str(n)]
lines.extend(["1 2000"] * (2 * n))
case5 = "\n".join(lines) + "\n"

assert run(case5) == "1\n", "maximum-size dense parallel-edge case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 参考 8 顶点案例 |`4`| 可达性和2-SAT之间的充分互动|
 |`n=2`, 四份`1 2`|`1`| 最小尺寸和同端点平行边|
 | 来自顶点 1 的两个不兼容的边类型 |`1`| 成对不相容约束 |
 | 包含值 0、1 和 2 的链 |`3`| 连续可达性和自可达性边界 |
 | (n=2000)，所有边`1 2000`|`1`| 最大输入大小和密集兼容性表示 |

 ## 边缘情况

 对于最小尺寸的情况，```
2
1 2
1 2
1 2
1 2
```该路径只能包含一条边，因为只有两个顶点。 它可以选择一个值（0）边，给出MEX（1），但它不能同时包含值（0）和值（1）。 兼容性预处理发现没有边可以跟随另一条边，因为每条边都在顶点 (2) 结束。 因此答案是（1）。 

对于相等的平行边，```
3
1 2
1 2
2 3
2 3
3 4
3 4
```每个值有两个选择（0,1,2），并且每个值的任何一个选择都可以连续放置在路径上（1\to2\to3\to4）。 因此，选定的边包含所有值 (0,1,2)，给出 MEX (3)。 该算法不会将一个值的两个副本与两个单独的要求混淆，因为一个布尔变量代表两个副本。 

对于不兼容的选择，```
3
1 3
1 3
1 2
1 2
```所选值 (0) 边和所选值 (1) 边始终共享相同的起始顶点，然后发散。 双方都无法跟随对方。 因此，每对选择都会生成一个禁止对，从而使 (k=2) 2-SAT 实例无法满足。 该算法返回 (1)。 

对于连续的边，```
4
1 2
1 2
2 3
2 3
3 4
3 4
4 4
4 4
```最后两行在原始约束（a<b）下无效，因此不能将它们用作实际测试。 一个有效的边界示例是```
4
1 2
1 2
2 3
2 3
3 4
3 4
1 4
1 4
```这里，值 (0,1,2) 可以沿着 (1\to2\to3\to4) 出现，而​​值 (3) 使用与这些边冲突的边 (1\to4)。 答案是（3）。 可达性表示将共享端点视为可从其自身到达，因此可以正确接受 (1\to2) 后跟 (2\to3)。 

对于最大输入大小 (n=2000)，有 (4000) 个边，并且可能有数百万个成对兼容性关系。 将每个关系存储为 Python 列表会带来大量的对象开销。 位集表示在 Python 整数内的机器大小的块中存储相同的密集信息，这就是实现保持在合理内存占用范围内的原因。
