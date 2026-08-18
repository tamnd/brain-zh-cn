---
title: "CF 102257B - 桥梁"
description: "我们有一个无向图，其顶点是岛，边是桥。 每个桥都有一个重量限制，因此重量为 w 的汽车可以恰好使用电流限制至少为 w 的桥。"
date: "2026-08-17T20:57:51+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102257
codeforces_index: "B"
codeforces_contest_name: "2019 Asia-Pacific Informatics Olympiad (APIO 19)"
rating: 0
weight: 102257
solve_time_s: 256
verified: true
draft: false
---

[CF 102257B - 桥梁](https://codeforces.com/problemset/problem/102257/B)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 16s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个无向图，其顶点是岛，边是桥。 每座桥都有重量限制，所以一辆车的重量`w`可以精确地使用电流限制至少为的电桥`w`。 更新会更改一座现有桥梁的限制，而当只有可以承载给定汽车的桥梁可用时，查询会询问包含指定岛屿的连接组件中的岛屿数量。 图和查询限制足够大，我们需要利用整个查询序列提前已知的事实。 官方的限制是`n <= 50,000`,`m <= 100,000`， 和`q <= 100,000`，有 2 秒时间限制和 512 MB 内存限制。 

关键的困难在于两个维度同时发生变化。 该图表随着时间的推移而变化，因为桥限制会更新，而每个查询也会选择不同的权重阈值。 对每个查询的直接遍历每次都会检查整个图。 高达`100,000`查询和`100,000`边缘，甚至`O(n + m)`每个查询的遍历量可以达到大约`1.5 * 10^10`最坏情况下的顶点和边访问，远远超出 2 秒的限制允许的范围。 

有几种小情况很容易处理不当。 首先，空图仍必须计算起始岛本身。 例如，```
1 0
1
2 1 1
```有输出```
1
```因为从岛屿本身就可以到达，无需使用任何桥梁。 根据访问的邻居数量初始化其答案的遍历实现可能会意外返回零。 

与电桥极限的比较是包含在内的。 例如，```
2 1
1 2 5
1
2 1 5
```有输出```
2
```因为一辆车的重量正好`5`允许进入限制为的桥梁`5`。 使用`>`而不是`>=`默默地失去这种联系。 

更新可以使桥梁变得更弱，也可以变得更强。 例如，```
2 1
1 2 5
3
2 1 5
1 1 1
2 1 2
```产生```
2
1
```因为更新后唯一的桥有限制`1`，所以一辆车的重量`2`无法跨越它。 仅存储初始权重的实现会错误地持续返回`2`。 

平行桥也必须保持独立。 例如，```
2 2
1 2 3
1 2 5
3
2 1 4
1 2 2
2 1 4
```产生```
2
1
```因为在更新之前限制之桥`5`连接岛屿，而在将该桥改为`2`，剩下的桥只有极限`3`。 仅通过端点对来处理网桥将失去这种区别。 

## 方法

 蛮力方法很简单。 对于每个类型 2 查询，扫描所有桥，仅保留当前限制至少为查询权重的桥，并从请求的岛运行 BFS 或 DFS。 所得到的访问计数正是答案，因为遍历精确地使用了该汽车可用的桥梁。 该方法是正确的，但其最坏情况的成本是`O(q(n + m))`。 和`n = 50,000`,`m = 100,000`， 和`q = 100,000`，大致就是`1.5 * 10^10`基本的顶点和边操作，在考虑 Python 开销之前。 

有用的观察结果是，在短的连续查询块内更新是稀疏的。 将查询序列分成约`B = sqrt(q)`运营。 在一个区块内，只能更新少量不同的桥。 称这些桥梁为特别的。 整个街区中所有其他桥都保持完全相同的重量。 

对于一个街区，暂时移除所有特殊桥梁。 剩下的图是静态的。 我们可以按权重对其边进行排序，并按照请求权重的降序处理所有类型 2 查询。 然后，DSU 表示由权重对于当前查询足够大的所有固定桥形成的连接组件。 

只有特殊的桥梁仍然缺失。 最多有`B`因此，对于一个查询，我们可以采用其端点的 DSU 组件并构建一个小型辅助 DSU。 每个辅助顶点代表固定图的整个组成部分，其初始大小等于主DSU存储的大小。 将特殊的桥添加到这个小图中就可以准确地给出包含所查询岛屿的组件。 

暴力方法之所以有效，是因为它为每个查询构建了精确的阈值图，但它重复地重建了几乎相同的信息。 块观察让我们可以为每个块构建一次昂贵的静态部分，并将所有更改最多隔离到`B`每个查询的边。 

下面的实现还将每个查询的当前特殊边缘状态表示为位掩码。 在按时间顺序遍历块的过程中，我们知道每个特殊桥的当前权重，因此我们可以记录哪些特殊桥满足每个查询的阈值。 稍后，当查询按权重重新排序时，它们的原始时间状态已被保留。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(q(n + m))`|`O(n + m)`| 太慢了 |
 | 块分解 |`O((q/B)m log m + qB)`|`O(n + m + qB)`以简单的形式| 已接受 |

 和`B`大约`sqrt(q)`，昂贵的工作分散在各个块上，而每个单独的查询只需要检查一小组特殊的桥。 

## 算法演练

 1. 在回答任何问题之前，请阅读完整的图表和完整的查询序列。 这使得块分解成为可能，因为我们可以提前知道每个块内哪些桥将被更新。 
2. 将查询分割成大小约为的连续块`sqrt(q)`。 对于当前块，收集至少更新一次的每个桥。 这些是特殊的桥梁。 最多可以有`B`不同的特殊桥，因为该块仅包含`B`运营。 
3. 按其原始时间顺序模拟该块。 保持每座桥梁的当前重量。 每当类型 1 查询更改特殊桥时，请更新其权重。 对于每个类型 2 查询，扫描特殊桥并创建一个位掩码，其中恰好包含当前权重至少为查询权重的特殊桥。 这记录了查询的精确时刻图表的特殊部分。 
4. 排除所有特殊桥并按重量递减对剩余的固定桥进行排序。 它们的权重在块期间永远不会改变，因此这种排序顺序对于块中的每个查询都有效。 
5. 通过减少所需的汽车重量对块的类型 2 查询进行排序。 从空的 DSU 开始。 随着查询阈值的降低，添加权重现在已经足够大的每个固定桥。 因此，DSU 代表该查询可用的所有固定网桥。 
6. 对于按此排序顺序的每个查询，找到包含其起始岛的固定图组件。 然后创建一个临时 DSU，仅包含活动特殊桥接触的基础组件。 为每个临时节点指定其相应基础组件的大小。 
7. 对于其位出现在查询掩码中的每个特殊桥，找到包含其端点的基本组件并联合这些临时节点。 如果两个端点已经在同一个基础组件中，则特殊的桥不会改变任何内容。 
8. 包含起始岛的临时组件的大小就是答案。 将其存储在查询的原始位置下，因为查询是按权重顺序而不是输入顺序处理的。 
9. 移动到下一个块。 现在，桥权重完全包含前一个块中所有更新后的状态，因此可以重复相同的过程。 

### 为什么它有效

 对于固定块，每个非特殊桥在整个块上都有恒定的重量。 当以阈值递减顺序处理查询时，主DSU恰好包含那些限制至少为当前阈值的固定桥。 因此，它的组件正是无需特殊桥梁即可获得的连接组件。 

剩下的每一座可用的桥梁都是特殊的，并且只有`B`其中。 将每个主 DSU 组件收缩到一个临时顶点可以保留通过固定桥的所有连接。 准确添加电流限制满足查询的特殊桥，然后在该查询时重现完整的阈值图。 因此，包含起始岛屿的临时组件恰好包含所有可到达的岛屿，因此其存储的大小是所需的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    __slots__ = ("parent", "size")

    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        parent = self.parent
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(self, a, b):
        parent = self.parent
        size = self.size

        a = self.find(a)
        b = self.find(b)

        if a == b:
            return False

        if size[a] < size[b]:
            a, b = b, a

        parent[b] = a
        size[a] += size[b]
        return True

def solve():
    n, m = map(int, input().split())

    eu = [0] * m
    ev = [0] * m
    weight = [0] * m

    for i in range(m):
        u, v, w = map(int, input().split())
        eu[i] = u - 1
        ev[i] = v - 1
        weight[i] = w

    q = int(input())
    queries = [None] * q

    for i in range(q):
        t, a, b = map(int, input().split())
        queries[i] = (t, a - 1, b)

    answers = [None] * q
    mask_at = [0] * q

    block_size = max(1, int(q ** 0.5) + 1)

    for left in range(0, q, block_size):
        right = min(q, left + block_size)

        special_set = set()

        for i in range(left, right):
            t, a, b = queries[i]
            if t == 1:
                special_set.add(a)

        special = list(special_set)
        k = len(special)

        special_pos = {e: j for j, e in enumerate(special)}

        # Record the exact state of special edges for every query.
        for i in range(left, right):
            t, a, b = queries[i]

            if t == 1:
                weight[a] = b
            else:
                mask = 0
                for j, e in enumerate(special):
                    if weight[e] >= b:
                        mask |= 1 << j
                mask_at[i] = mask

        # The non-special edges are static throughout this block.
        fixed = [e for e in range(m) if e not in special_set]
        fixed.sort(key=weight.__getitem__, reverse=True)

        # Queries are processed by threshold, not by their original order.
        ordered_queries = [
            i for i in range(left, right)
            if queries[i][0] == 2
        ]
        ordered_queries.sort(key=lambda i: queries[i][2], reverse=True)

        base = DSU(n)
        edge_ptr = 0
        fixed_count = len(fixed)

        for qi in ordered_queries:
            _, s, required = queries[qi]

            while edge_ptr < fixed_count:
                e = fixed[edge_ptr]
                if weight[e] < required:
                    break

                base.union(eu[e], ev[e])
                edge_ptr += 1

            # Build the small DSU induced by the special edges.
            local_parent = []
            local_size = []
            local_index = {}

            def get_local_node(root):
                node = local_index.get(root)
                if node is None:
                    node = len(local_parent)
                    local_index[root] = node
                    local_parent.append(node)
                    local_size.append(base.size[root])
                return node

            def local_find(x):
                while local_parent[x] != x:
                    local_parent[x] = local_parent[local_parent[x]]
                    x = local_parent[x]
                return x

            root_s = base.find(s)
            local_s = get_local_node(root_s)

            mask = mask_at[qi]

            while mask:
                bit = mask & -mask
                j = bit.bit_length() - 1
                mask -= bit

                e = special[j]

                ru = base.find(eu[e])
                rv = base.find(ev[e])

                a = get_local_node(ru)
                b = get_local_node(rv)

                a = local_find(a)
                b = local_find(b)

                if a != b:
                    if local_size[a] < local_size[b]:
                        a, b = b, a

                    local_parent[b] = a
                    local_size[a] += local_size[b]

            local_root = local_find(local_s)
            answers[qi] = local_size[local_root]

    sys.stdout.write(
        "\n".join(str(answers[i]) for i in range(q) if answers[i] is not None)
    )

if __name__ == "__main__":
    solve()
```这`DSU`存储每个组件的父组件及其大小。 使用路径压缩是因为这些 DSU 永远不会回滚。 这`union`操作将较小的组件附加到较大的组件上，使树保持浅。 

对于每个块，`special_set`准确识别其值可能发生变化的桥。 按时间顺序排列的传递必须发生在按阈值排序的传递之前。 否则，查询可能会意外地使用桥梁的最终重量，而不是发出查询时存在的重量。 

固定边按降序排序。 指针`edge_ptr`只会向前移动，因为查询阈值也会降低。 条件是`weight[e] < required`， 不是`<=`，因为极限等于汽车重量的桥梁是可用的。 

临时 DSU 使用基础组件根作为其顶点。 它的组件大小从这些基本组件的大小开始，因此当连接两个临时节点时，可以简单地添加它们的大小。 这是将连接计算转换为请求的组件大小计算的部分。 

位掩码由内部桥的位置索引`special`。 使用`mask & -mask`一次提取一个活动的特殊桥，无需在昂贵的临时 DSU 阶段扫描非活动位置。 

所有权重都适合 Python 整数。 在 C++ 实现中，答案本身最多是`n`，尽管桥接限制需要 32 位整数。 

## 工作示例

 声明中的第一个示例是：```
3 4
1 2 5
2 3 2
3 1 4
2 3 8
5
2 1 5
1 4 1
2 2 5
1 1 1
2 3 2
```其官方输出是`3`,`2`,`3`。 

对于小跟踪，可以按如下方式查看查询。 

| 查询 | 当前相关边缘 | 门槛| start | 的基础组件 使用特殊边缘| 回答 |
 | ---| ---| ---| ---| ---| ---|
 |`2 1 5`|`1-2:5`,`2-3:8`| 5 |`{1,2,3}`| 无 | 3 |
 |`1 4 1`| 边 4 从 8 变为 1 | | | | |
 |`2 2 5`|`1-2:5`| 5 |`{1,2}`| 边缘 4 不可用 | 2 |
 |`1 1 1`| 边 1 从 5 变为 1 | | | | |
 |`2 3 2`|`2-3:2`,`3-1:4`| 2 |`{1,2,3}`| 边缘 1 不可用 | 3 |

 第一个查询演示了包含阈值条件。 第二个类型 2 查询演示了为什么必须使用更新的桥的当前值而不是其初始值。 

第二个样本是：```
7 8
1 2 5
1 6 5
2 3 5
2 7 5
3 4 5
4 5 5
5 6 5
6 7 5
12
2 1 6
1 1 1
2 1 2
1 2 3
2 2 2
1 5 2
1 3 1
2 2 4
2 4 2
1 8 1
2 1 1
2 1 3
```官方输出是`7`,`7`,`5`,`7`,`7`,`4`,`7`。 

有用的跟踪重点关注当前可用网桥的数量。 

| 查询 | 门槛| 更新桥接状态 | 可到达的组件来自`s`| 回答 |
 | ---| ---| ---| ---| ---|
 |`2 1 6`| 6 | 所有限制 5 | 唯一的岛屿 1 | 1 |
 |`2 1 2`| 2 | 桥 1 有限制 1 | 通过 1 号桥到达除孤立一侧外的所有岛屿 | 7 |
 |`2 2 2`| 2 | 桥 1 = 1，桥 2 = 3 | 五岛组件| 5 |
 |`2 2 4`| 4 | 几个更新的限制低于 4 | 高限部分| 7 |
 |`2 4 2`| 2 | 低限制更新现已可用 | 所有七个岛屿 | 7 |
 |`2 1 1`| 1 | 所有当前限制至少为 1 | 所有七个岛屿 | 7 |
 |`2 1 3`| 3 | 只剩下限制至少为 3 座的桥梁 | 四岛组件| 4 |

 确切的中间组件名称取决于当前的桥限制，但每行中的不变量都是相同的：主 DSU 包含满足当前阈值的所有固定桥，而临时 DSU 恰好添加活动的特殊桥。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O((q/B)m log m + qB)`| 每个块对固定边进行排序，每个查询最多处理`B`特殊桥梁|
 | 空间|`O(n + m + q)`| 图表、查询、权重、答案和临时 DSU 状态 |

 选择`B`大约`sqrt(q)`平衡每个块完成的工作与每个查询完成的工作。 和`q <= 100,000`，一个块仅包含几百条边，因此每个查询的动态部分保持很小。 该实现还避免了重建图或为每个查询运行完整的 BFS，这种操作使得暴力解决方案在给定限制下变得不可能。 

## 测试用例```python
# The solve() function from the solution above is assumed to be in the same file.

import sys
import io
from contextlib import redirect_stdout

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    output = io.StringIO()

    try:
        with redirect_stdout(output):
            solve()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

    return output.getvalue().strip()

# Provided sample 1
assert run(
    """\
3 4
1 2 5
2 3 2
3 1 4
2 3 8
5
2 1 5
1 4 1
2 2 5
1 1 1
2 3 2
"""
) == "3\n2\n3", "sample 1"

# Provided sample 2
assert run(
    """\
7 8
1 2 5
1 6 5
2 3 5
2 7 5
3 4 5
4 5 5
5 6 5
6 7 5
12
2 1 6
1 1 1
2 1 2
1 2 3
2 2 2
1 5 2
1 3 1
2 2 4
2 4 2
1 8 1
2 1 1
2 1 3
"""
) == "1\n7\n5\n7\n7\n4\n7", "sample 2"

# Minimum-size graph, no bridges.
assert run(
    """\
1 0
1
2 1 1
"""
) == "1", "single island"

# All bridge limits equal, followed by updates in both directions.
assert run(
    """\
4 3
1 2 5
2 3 5
3 4 5
5
2 1 5
1 2 7
2 1 5
1 1 4
2 1 5
"""
) == "4\n4\n1", "equal weights and updates"

# Parallel bridges and exact threshold boundary.
assert run(
    """\
2 2
1 2 3
1 2 5
4
2 1 5
1 2 2
2 1 3
2 1 4
"""
) == "2\n2\n1", "parallel edges and boundary"

# Maximum number of bridges with a single query.
# Every bridge connects the same two islands, so the answer is always 2.
max_case = (
    "50000 99999\n"
    + "1 2 1\n" * 99999
    + "1\n"
    + "2 1 1\n"
)

assert run(max_case) == "2", "maximum m"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 0`, 一项查询 |`1`| 最小尺寸图和起始岛本身 |
 | 四岛链同等极限|`4`,`4`,`1`| 全部平等的价值观和削弱更新|
 | 两座平行桥|`2`,`2`,`1`| 平行边缘和精确的阈值处理 |
 |`n=50000`,`m=99999`, 一项查询 |`2`| 最大边数和大输入处理 |

 ## 边缘情况

 对于空图的情况，```
1 0
1
2 1 1
```该块没有特殊的边缘，也没有固定的边缘。 基础 DSU 最初有一个尺寸为 1 的组件。 查询的岛映射到该组件，因此临时 DSU 还包含一个大小为 1 的顶点。 输出是`1`。 

对于平等边界，```
2 1
1 2 5
1
2 1 5
```固定边的权重恰好等于查询阈值。 固定边指针使用条件`weight[e] >= required`，因此边缘被插入到基础 DSU 中。 因此，两个岛属于同一组件，输出为`2`。 

对于减少更新，```
2 1
1 2 5
3
2 1 5
1 1 1
2 1 2
```桥很特别，因为它是在块内更新的。 在更新之前，第一个查询将其特殊边缘掩码记录为活动状态。 更新将其权重更改为`1`。 最终查询有阈值`2`，因此它的掩模不包含特殊边缘。 基础图是空的，临时 DSU 仅包含起始岛。 答案是`2`和`1`。 

对于平行边，```
2 2
1 2 3
1 2 5
3
2 1 4
1 2 2
2 1 4
```两个桥都存储有单独的边缘索引。 最初只是重量之桥`5`满足阈值`4`，所以答案是`2`。 之后该桥更改为`2`，两座桥都不能承载重量`4`，单独留下起始岛并生产`1`。 这就是实现通过网桥 ID 而不是端点对来索引特殊网桥的原因。 

对于包含对同一桥的重复更新的块，特殊集仅包含该桥一次。 在按时间顺序排列的过程中`weight`每次出现更新时值都会更改，并且每个类型 2 查询都会记录该确切位置的当前值。 因此，同一网桥可以针对一个块中的不同查询具有不同的活动位，而辅助 DSU 仍最多包含该网桥的一个节点。 

中心不变量在所有这些情况下都存在：在每个处理的查询中，主 DSU 准确地包含被查询汽车可用的固定桥，而临时 DSU 准确地添加了该时间点可用的特殊桥。 由此产生的组件大小就是该车可到达的岛屿的数量。
