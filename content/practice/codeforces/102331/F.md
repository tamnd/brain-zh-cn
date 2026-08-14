---
title: "CF 102331F - 快速生成树"
description: "我们有一组加权顶点和一个索引边列表。 最初没有图边，因此每个顶点都是其自己的连通分量。"
date: "2026-08-14T05:00:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102331
codeforces_index: "F"
codeforces_contest_name: "2019 Summer Petrozavodsk Camp, Day 2: 300iq Contest 2 (XX Open Cup, Grand Prix of Kazan)"
rating: 0
weight: 102331
solve_time_s: 276
verified: true
draft: false
---

[CF 102331F - 快速生成树](https://codeforces.com/problemset/problem/102331/F)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 36s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一组加权顶点和一个索引边列表。 最初没有图边，因此每个顶点都是其自己的连通分量。 对于一条边 (i=(a_i,b_i,s_i))，当其端点当前位于不同的组件中并且这两个组件的总顶点权重之和至少为 (s_i) 时，可以使用该边。 在所有可用边中，该过程始终选择最小的索引，连接两个组件，然后重复。 

输出正是该过程选择的边缘索引序列。 因为每次成功的操作都会连接两个不同的组件，所以最多可以选择 (n-1) 条边。 原始问题有 (n,m\le 300000)、顶点权重和阈值最多 (10^6)、5 秒时间限制和 256 MiB 内存。 

直接模拟无法在每次并集后重复检查所有 (m) 条边。 在最坏的情况下，可能有 (n-1) 个成功的并集，因此在每个并集后扫描每条边的执行情况大致如下

 [
 (n-1)m < 9\cdot 10^{10}
 ]

 边缘检查。 这远远超出了 5 秒实现所能承受的范围。 

有几种边缘情况很容易破坏粗心的实现。 首先，阈值为零的边可以立即使用，但只有在后续副本连接已连接的顶点时才可用一次。 例如，```
2 2
0 0
1 2 0
1 2 0
```有输出```
1
1
```第二条边也满足权重条件，但其端点已经连接。 

精确相等也很重要，因为条件大于或等于阈值。 为了```
2 1
2 3
1 2 5
```输出是```
1
1
```严格的比较会错误地拒绝唯一的边缘。 

最初不可用的边在选择完全不同的、较小索引的边后可以变得可用。 例如，```
3 2
1 1 1
1 2 3
2 3 2
```最初只有边 2 可用。 在边 2 连接顶点 2 和 3 后，该分量的权重为 2，因此边 1 变得可用，因为 (1+2=3)。 正确的输出是```
2
2 1
```选择边缘 2 后，通过边缘阵列的单遍扫描将错误地停止。 

最后，名义下限 (n\ge1) 不会给出 (n=1,m\ge1) 的有效实例，因为每个元组都需要两个不同的端点。 最小的有效实例有两个顶点。 

## 方法

 蛮力模拟在概念上很简单。 维护一个DSU，重复扫描索引1到(m)的边，选择端点具有不同代表​​且两个分量和达到阈值的第一条边。 成功并集后，从索引 1 开始另一次扫描。这完全符合定义，因此它的正确性是立即的。 它的问题是重复扫描：可能有 (n-1) 个并集，每次扫描成本为 (O(m))，在最大约束下进行 (O(nm)) 或几乎 (9\cdot10^{10}) 检查。 

有用的观察结果是组件权重只会增加。 考虑一条边，其两个当前分量权重为 (x) 和 (y)，阈值为 (s)。 如果尚不可用，则将剩余金额定义为

 [
 r=s-x-y>0。 
]

 为了使边缘可用，两个分量的权重必须至少增加 (r)。 两个组件中的至少一个必须贡献至少

 [
 \左\lceil\frac r2\右\rceil。 
]

 因此，我们不会在任一端点组件发生变化时检查该边缘，而是对两个组件发出警报。 重量 (x) 分量的警报在以下时间触发

 [
 x+\left\lceil\frac r2\right\rceil,
 ]

 和其他火灾

 [
 y+\left\lceil\frac r2\right\rceil。 
]

 如果两个警报都没有触发，则边缘肯定无法使用。 当一个警报响起时，我们会检查一次边缘。 如果 (x+y\ge s)，则该边变得全局合格。 否则，我们重新计算剩余金额并将剩余金额再次分成两半。 

假设第一侧的警报响起。 那一侧至少增加了 (\lceil r/2\rceil)，所以新的剩余量满足

 [
 r' \le r-\left\lceil\frac r2\right\rceil
 = \left\lfloor\frac r2\right\rfloor。 
]

 因此，每次重新考虑相同的边缘而不变得可用时，其剩余阈值至少减半。 由于 (s\le10^6)，一条边仅需要 (O(\log s)) 次警报重新计算。 

我们仍然需要避免为每个顶点单独附加的每个边发出警报。 同一连接组件中的所有顶点具有完全相同的组件权重，因此它们的警报可以存储在一起。 每个 DSU 组件都拥有一个最小警报堆。 当两个组件合并时，我们将较小的警报堆合并到较大的警报堆中。 这是从小到大的技术，因此警报条目仅移动 (O(\log n)) 次。 

最后，每条实际可用的边都被放入一个以其原始索引为键的全局最小堆中。 总是首先处理最小的索引。 条目可能会变得过时，因为另一个选定的边缘可能已经加入其端点，因此在使用全局候选者之前，我们会再次检查其 DSU 代表。 

这是蛮力法和最优解之间的中心联系。 蛮力之所以有效，是因为每条边的条件可能发生变化时都会被准确地检查，但它检查的边太多了。 减半观察让我们只安排边缘可能变得相关的时刻，而 DSU 和从小到大使组件更改变得高效。 同样的警报想法是竞赛社论中用于解决此问题的标准技术。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(nm)) | (O(n+m)) | 太慢了|
 | 最佳| (O(m\log C\log n\log m)) 直接二进制堆实现 | (O(n+m\log C)) | 接受的方法|

 这里（C）是最大阈值，最多（10^6）。 使用可融合堆，可以减少堆合并因子，这是预期解决方案通常引用的形式。 直接的`heapq`下面的实现保持数据结构简单并遵循相同的从小到大策略。 

## 算法演练

 1. 构建一个每个组件包含一个顶点的 DSU。 将每个组件的当前总重量存储在其代表处。 由于所有阈值最多为 (10^6)，因此组件权重可以安全地限制在 (10^6)：一旦组件达到该值，它本身就足以满足每个可能的阈值。 
2. 对于每条边 (i=(u,v,s))，找到 (u) 和 (v) 的当前分量。 最初它们只是单独的顶点。 如果它们的权重之和至少为 (s)，则将 (i) 放入全局候选最小堆中。 否则让

 [
 d=s-w_u-w_v
 ]

 并对每个端点组件发出警报

 [
 w_u+\left\lceil\frac d2\right\rceil
 \quad\text{和}\quad
 w_v+\left\lceil\frac d2\right\rceil。 
]

 这两个警报保证边缘在可能变得有效之前将被重新考虑。 

1. 反复从全局候选堆中删除最小的边索引。 查找其端点的当前 DSU 代表。 如果它们相等，则候选者已过时，因为某些较早的边缘已经连接了这些组件，因此将其丢弃。 否则，该边恰好是当前符合条件的最小边，因此将其索引附加到答案中。 
2. 合并两个端点组件。 在警报堆上使用从小到大的顺序，将较大的堆作为目标，并将每个警报从较小的堆移入其中。 将组件权重相加并将结果限制为 (10^6)。 
3. 合并后，检查新组件堆中最小的警报。 如果其阈值大于新的组件重量，则低于它的警报也不会触发，因此停止。 如果达到其阈值，请将其删除并重新考虑该边缘。 
4. 当重新考虑警报时，找到边缘端点的当前分量。 如果它们已经相等，则警报已过时并且可以简单地丢弃。 否则计算他们当前的总重量。 如果达到边阈值，则将边放入全局候选堆中。 如果没有，则计算新的剩余量并创建两个新的半阈值警报。 
5. 继续处理全局候选堆，直到其变空。 此时，不存在满足其阈值的具有不同端点分量的边，因此原始过程也必须停止。 

### 为什么它有效

 对于端点仍处于不同组件中的每条边，保持不变，即每个端点上的警报阈值是当前组件权重加上当前剩余赤字的一半，向上舍入。 如果两个警报都没有触发，则两个组成部分的增加量都小于赤字的一半，因此它们的总增加量小于整个赤字，并且边缘尚无法满足其条件。 如果警报触发，则检查实际情况以确定边缘现在是否合格。 如果不是，剩余的赤字最多是之前的一半，因此更换警报可以保留不变性，并且只能保证对数次重新计算。 

全局候选堆包含已合格的每条边，可能还包括其端点随后被连接的陈旧边。 由于组件权重永远不会减少，因此符合条件的边将保持合格状态，直到其端点变得相等。 因此，在丢弃过时的候选者之后，全局堆的最小元素恰好是原始进程所需的最小有效边。 每个联合都是在两个不同的组件上执行的，因此生成的序列正是来自语句的序列。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

MAX_S = 1_000_000

def solve():
    n, m = map(int, input().split())
    weight = list(map(int, input().split()))

    parent = list(range(n))
    size = [1] * n

    # Component weights. They are capped at MAX_S because
    # every threshold is at most MAX_S.
    comp = weight[:]

    U = [0] * m
    V = [0] * m
    S = [0] * m

    # alarms[root] contains (absolute_threshold, edge_id)
    alarms = [[] for _ in range(n)]

    # Edges that are currently eligible, ordered by original index.
    ready = []

    answer = []

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def schedule(e):
        u = find(U[e])
        v = find(V[e])

        if u == v:
            return

        remaining = S[e] - comp[u] - comp[v]

        if remaining <= 0:
            heapq.heappush(ready, e)
            return

        half = (remaining + 1) // 2
        heapq.heappush(alarms[u], (comp[u] + half, e))
        heapq.heappush(alarms[v], (comp[v] + half, e))

    def merge_components(a, b):
        a = find(a)
        b = find(b)

        if a == b:
            return a

        # Keep the larger alarm heap.
        if len(alarms[a]) > len(alarms[b]):
            a, b = b, a

        parent[a] = b
        size[b] += size[a]
        comp[b] = min(MAX_S, comp[a] + comp[b])

        small = alarms[a]
        large = alarms[b]

        # Move the smaller heap into the larger heap.
        while small:
            threshold, e = heapq.heappop(small)

            # The old alarm may already be obsolete because its endpoints
            # became connected.
            x = find(U[e])
            y = find(V[e])

            if x == y:
                continue

            if threshold <= comp[b]:
                schedule(e)
            else:
                heapq.heappush(large, (threshold, e))

        # Process every alarm that has become active because the component
        # weight increased.
        while large and large[0][0] <= comp[b]:
            threshold, e = heapq.heappop(large)

            x = find(U[e])
            y = find(V[e])

            if x == y:
                continue

            schedule(e)

        return b

    # Build the initial alarm structure.
    for e in range(m):
        u, v, s = map(int, input().split())
        u -= 1
        v -= 1

        U[e] = u
        V[e] = v
        S[e] = s

        schedule(e)

    while ready:
        e = heapq.heappop(ready)

        u = find(U[e])
        v = find(V[e])

        if u == v:
            continue

        # The edge is eligible and has the smallest index among all
        # candidates currently known to be eligible.
        answer.append(e + 1)

        merge_components(u, v)

    print(len(answer))
    print(*answer)

if __name__ == "__main__":
    solve()
```DSU 数组有其通常的含义。`parent`识别组件，`size`支持联合启发式，并且`comp`存储每个代表的当前总重量。 路径压缩使得重复的代表性查找有效地恒定摊销时间。`alarms[root]`是组件的本地优先级队列。 一个条目`(threshold, e)`说那个边缘`e`一旦该组件达到，就应该重新考虑`threshold`。 阈值是绝对的而不是相对增量，这使得合并两个堆变得简单。 

这`schedule`函数是减半技巧的核心。 它首先检查边缘是否已经有效。 如果是，则边缘进入`ready`。 否则，剩余的赤字将在两个端点组件之间平均分配。 表达式`(remaining + 1) // 2`是所需上限的整数实现。 

合并操作故意选择较小的警报堆作为源。 每个移动的条目都会使包含它的数据结构的大小加倍，因此警报只能以对数方式移动多次。 组件权重发生变化后，重复检查最小的警报，直到第一个阈值仍然过大。 

操作顺序在`merge_components`很重要。 在重新考虑警报之前，DSU 父级已更改并计算新组件权重，因为必须根据新组件状态评估每个警报。 什么时候`schedule`之后调用，它使用`find`同样，因此在此操作期间意外合并端点的边将被安全丢弃。 

所有算术都是用Python整数完成的，所以不存在溢出问题。 在 C++ 中，64 位整数也是一个安全的选择，尽管阈值上限使得 32 位值足以满足算法使用的分量和。 

最初的竞赛约束是围绕这种从小到大的堆技术设计的。 已发布的解决方案使用相同的半赤字警报和全局候选优先级队列。 

## 工作示例

 ### 示例 1

 初始分量权重为 (1,4,3,4,0)。 边 2、3、4 和 5 立即符合条件，而边 1 具有总权重 (4+0=4<5)。 

| 运营| 全球候选人| 选定的边缘 | 组件变更 | 结果 |
 | --- | --- | --- | --- | --- |
 | 初始| 2、3、4、5 | 2 | (1) 和 (3) 合并，加权 (4) | 答案 = 2 |
 | 合并后 | 3, 4, 5 | 3 | (4) 和 (0) 合并，加权 (4) | 答案 = 2, 3 |
 | 合并后 | 4, 5 | 4 | 组件权重 (4) 与权重 (4) 的顶点 4 合并 | 答案 = 2, 3, 4 |
 | 合并后 | 1, 5 | 1 | 边 1 现在将权重 8 分量连接到顶点 5，因此它符合条件 | 答案 = 2, 3, 1, 4 |

 有趣的部分是最后一个过渡。 边 1 最初低于其阈值，但其端点分量从权重 4 增长到权重 8。警报机制无需重新扫描所有边即可检测到该变化。 全局队列仍然决定哪个符合条件的边具有最小索引，从而产生所需的顺序 (2,3,1,4)。 官方示例正是这样的输出。 

### 示例 2

 初始权重为(3,2,2)。 边 1、2 和 4 需要顶点 1 和 2 之间的总权重 6，因此最初没有一条有效。 边沿 3 的阈值为 3，并且立即有效。 边 5 需要顶点 2 和 3 之间的 6 个边，并且最初也很短。 

| 运营| 全球候选人| 选定的边缘 | 相关部件重量| 结果 |
 | --- | --- | --- | --- | --- |
 | 初始| 3 | 3 | (3+2=5) | 合并 1 和 2 |
 | 边缘 3 之后 | 5 | 5 | (5+2=7) | 将 1,2 与 3 合并 |
 | 决赛| 空 | 无 | 所有顶点都相连| 停止|

 当边 3 连接顶点 1 和 2 时，它们的分量权重变为 5。这超出了边 5 的警报阈值，现在其实际情况为 (5+2\ge6)。 因此，边 5 被插入到全局候选堆中并被选择为下一个。 输出为 (3,5)，与样本匹配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(m\log C\log n\log m)) | (O(m\log C\log n\log m)) | 每个边都被重新考虑 (O(\log C)) 次，警报条目在从小到大合并下移动 (O(\log n)) 次，二叉堆操作成本为 (O(\log m))。 |
 | 空间| (O(n+m\log C)) | DSU和边缘数组使用(O(n+m))，而生成的警报条目总数为(O(m\log C))。 |

 阈值界限 (C\le10^6) 使减半因子很小，每个边最多约 20 个有意义的减少。 相对于暴力破解的关键改进是，在每个组件合并后不再检查边缘。 预期的解决方案通常概括为从小到大的合并与每个边缘的 (O(\log C)) 警报更新相结合。 

对于最初的 256 MiB 限制，C++ 实现是更安全的竞争选择，因为 Python 堆条目具有大量对象开销。 上面的 Python 实现是算法的忠实实现，但是渐近方法，而不是 Python 对象表示，是原始竞赛约束的设计依据。 

## 测试用例```python
# The test harness assumes the solve() function from the solution above
# is already defined.

import sys
import io

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline
    output = io.StringIO()
    sys.stdout = output

    try:
        solve()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

    return output.getvalue()

# Provided sample 1
assert run("""\
5 5
1 4 3 4 0
4 5 5
3 1 1
2 5 2
4 3 1
4 1 4
""") == """\
4
2 3 1 4
""", "sample 1"

# Provided sample 2
assert run("""\
3 5
3 2 2
1 2 6
1 2 6
1 2 3
1 2 6
2 3 6
""") == """\
2
3 5
""", "sample 2"

# Minimum valid instance, threshold zero.
assert run("""\
2 1
0 0
1 2 0
""") == """\
1
1
""", "minimum valid instance"

# Exact equality at the threshold.
assert run("""\
2 1
2 3
1 2 5
""") == """\
1
1
""", "equality boundary"

# An initially impossible edge becomes valid after another edge is chosen.
assert run("""\
3 2
1 1 1
1 2 3
2 3 2
""") == """\
2
2 1
""", "dynamic eligibility and index ordering"

# Zero weights with a positive threshold: no edge can ever become valid.
assert run("""\
2 1
0 0
1 2 1
""") == """\
0

""", "never eligible"

# Maximum-size structural stress test.
# The first 299999 edges form a chain and are all immediately valid.
n = 300000
edges = [f"{i} {i + 1} 0" for i in range(1, n)]
edges.append(f"1 {n} 0")

large_input = (
    f"{n} {n}\n"
    + " ".join(["0"] * n)
    + "\n"
    + "\n".join(edges)
    + "\n"
)

expected_large = (
    f"{n - 1}\n"
    + " ".join(map(str, range(1, n)))
    + "\n"
)

assert run(large_input) == expected_large, "maximum-size chain"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 1`, 权重`0 0`， 临界点`0`|`1 / 1`| 最小有效图和零阈值|
 |`2 1`, 权重`2 3`， 临界点`5`|`1 / 1`| 与阈值完全相等 |
 |`3 2`, 权重`1 1 1`, 边缘`(1,2,3)`和`(2,3,2)`|`2 / 2 1`| 选择不同的边后，一条边变得符合条件 |
 |`2 1`, 权重`0 0`， 临界点`1`|`0 / blank`| 永远不可能的阳性阈值|
 |`300000`顶点和`300000`零阈值链边|`299999 / 1..299999`| 最大输入大小、DSU 合并和过时的最终边缘 |

 ## 边缘情况

 零阈值情况的处理期间`schedule`。 为了```
2 2
0 0
1 2 0
1 2 0
```边 1 立即插入到全局候选堆中。 它被选中并连接两个顶点。 当边 2 最终从全局堆中删除时，`find(1)`和`find(2)`是相等的，因此它被视为陈旧而被丢弃。 输出是`1`接下来是边缘索引`1`。 

精确相等由`remaining <= 0`测试。 和```
2 1
2 3
1 2 5
```初始分量权重之和恰好为 5。将边插入到`ready`立即并选择，给出输出`1`进而`1`。 

动态顺序案例```
3 2
1 1 1
1 2 3
2 3 2
```开始时只有边 2 符合条件。 选择后，顶点 2 和 3 形成权重 2 的分量。边 1 现在具有端点分量权重 1 和 2，因此达到其阈值 3。 它被插入到全局候选堆中并接下来被选择。 输出是`2 1`。 这说明了为什么算法必须维护未来的警报而不是只扫描边缘一次。 

对于不可能的正阈值，```
2 1
0 0
1 2 1
```剩余的赤字为 1，因此两个警报都比其当前组件权重高出一个单位。 组件不会增长，因此警报不会触发，并且全局候选堆仍为空。 该过程立即停止，产生零个选定边缘和空白的第二行。 

最大尺寸链测试使用零阈值，因此每条边最初都是合格的。 全局堆反复选择剩余的最小索引。 第一条 (299999) 条边连接链，而最后一条边连接同一组件中已有的顶点并被丢弃。 因此，该算法精确生成 (299999) 个选定的边，而无需在每次并集后检查所有 (300000) 个边。
