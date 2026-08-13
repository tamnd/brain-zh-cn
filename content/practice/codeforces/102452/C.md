---
title: "CF 102452C - 建造牧场"
description: "每个商店都是一棵树的一个顶点，商店 (i) 恰好销售一个长度为 (ai) 的栅栏段。 选择两个商店 (x) 和 (y) 意味着选取它们之间唯一树路径上的每一段。"
date: "2026-08-12T08:37:23+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102452
codeforces_index: "C"
codeforces_contest_name: "2019-2020 ICPC Asia Hong Kong Regional Contest"
rating: 0
weight: 102452
solve_time_s: 220
verified: true
draft: false
---

[CF 102452C - 建造牧场](https://codeforces.com/problemset/problem/102452/C)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 40s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个商店都是一棵树的一个顶点，商店 (i) 恰好销售一个长度为 (a_i) 的栅栏段。 选择两个商店 (x) 和 (y) 意味着选取它们之间唯一树路径上的每一段。 问题是有多少对 (x<y) 产生可以排列成非简并简单多边形的线段长度集合。 

对于任何固定路径，只有其路段的长度才重要。 假设它们的总长度为（S），最长的线段长度为（M）。 正长度的集合可以恰好在以下情况下形成一个简单的多边形：

 [
 S>2M。 
]

 原因是最长的边必须比所有其他边的总和短。 如果该不等式成立，则这些线段可以排列成多边形； 如果等式成立，它们仅形成简并直线构型。 

因此图问题变成了路径查询问题。 对于每一对顶点，我们需要知道其路径上的值的总和以及该路径上的最大值，然后测试总和是否大于最大值的两倍。 

该树在一个测试用例中最多包含 (2\cdot10^5) 个顶点，所有测试用例的总数最多为 (4\cdot10^5)。 (O(n^2)) 算法将在 (n=2\cdot10^5) 处检查大约 (2\cdot10^{10}) 对，这远远超出了 5.5 秒的限制。 我们需要接近 (O(n\log^2 n)) 的东西，这是预期解决方案的复杂性。 

有几种边界情况很容易处理不当。 只有一个顶点，根本没有一对。 例如，```
1
1
5
```有答案`0`。 无论长度如何，包含两个顶点的路径也不能形成多边形，因为一条线段不能严格小于另一条线段的总和。 

平等也必须被拒绝。 考虑```
1
3
1 1 2
1 2
2 3
```包含所有三个顶点的唯一路径的总长度 (4) 和最大长度 (2)。 由于 (4=2\cdot2) 是退化的，所以答案是`0`。 诸如 (S\ge2M) 之类的非严格比较会错误地计算它。 

当我们使用质心分解时，最大线段不一定是质心。 例如，```
1
3
2 1 2
1 2
2 3
```给出长度为 (2,1,2) 的路径 (1\to2\to3). 它的总和是 (5)，而其最大值的两倍是 (4)，所以答案是`1`。 在这种情况下，任何仅计算最大线段位于质心的路径的解决方案都会失败。 

最后，相等的长度提供了有用的健全性检查。 为了```
1
5
1 1 1 1 1
1 2
1 3
1 4
1 5
```两个叶子之间的每条路径包含三个单位段并且是有效的，而涉及中心的每条路径仅包含两个段并且是无效的。 有 (\binom42=6) 个有效对。 

## 方法

 暴力解决方案直接来自定义。 对于每对顶点 (x<y)，沿着它们唯一的树路径行走，累积其总和和最大值。 然后检查总和是否大于最大值的两倍。 这是正确的，因为多边形条件仅取决于这两个量。 

问题在于路径的数量。 有 (\binom n2) 个端点对，这已经是 (O(n^2))，并且沿着路径行走本身可以花费 (O(n))。 在链上，这会产生

 [
 \sum_{k=1}^{n-1} k(n-k)=\Theta(n^3)
 ]

 操作。 即使我们对路径信息进行足够的预处理以生成每对 (O(1))，对于 (n=2\cdot10^5)，我们仍然会得到大约 (2\cdot10^{10}) 对。 

有用的结构是图是一棵树。 质心分解让我们根据每条路径经过的第一个质心来分割每条路径。 在一个质心 (c) 处，通过 (c) 的每一条路径都可以使用来自相对于 (c) 的两个端点的信息来描述。 

对于当前组件中的顶点 (u)，将 (s_u) 定义为从 (c) 到 (u) 的路径上的值之和，包括 (a_c)，并将 (m_u) 定义为同一路径上的最大值。 如果去除(c)后(u)和(v)位于不同的分量，则它们的完整路径是从(u)到(c)，然后从(c)到(v)。 因此它的总和和最大值是

 [
 S=s_u+s_v-a_c
 ]

 和

 [
 M=\max(m_u,m_v)。 
]

 有效条件变为

 [
 s_u+s_v-a_c>2\max(m_u,m_v)。 
]

 这就是中央减少。 这棵树已经从不平等中消失了。 在固定质心处，每个端点仅由两个数字表示：(s_u) 和 (m_u)。 

我们仍然需要避免对质心的同一子组件进行计数，因为它们的实际路径不会经过质心。 执行此操作的一种方便方法是使用上面的公式对收集的顶点中的所有对进行计数，然后单独对每个子组件内的所有对进行计数并减去它们。 质心本身被保留为一个单独的组，因此涉及质心的对仍然被计数。 

要有效地计算满足不等式的对，请按递减 (m) 对顶点进行排序。 当处理(u)时，之前处理的每个顶点(v)都满足(m_v\ge m_u)，因此最大值为(m_v)。 不等式变为

 [
 s_u+s_v-a_c>2m_v,
 ]

 可以重新排列为

 [
 2m_v-s_v+a_c<s_u。 
]

 对于每个已处理的顶点，插入密钥

 [
 k_v=2m_v-s_v+a_c
 ]

 进入芬威克树。 对于当前(u)，我们只需要统计严格小于(s_u)的插入键即可。 坐标压缩让 Fenwick 树可以处理这些任意整数键。 

相同的计数例程可以分别应用于整个质心组件和每个子组件。 然后质心分解递归地处理每个子组件，因此每个无序对都被精确地计算一次。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^3)) | (O(n)) | (O(n)) | 太慢了|
 | 使用 (O(1)) 路径查询进行暴力破解 | (O(n^2)) | (O(n^2)) 或更多 | 太慢了|
 | 质心分解+芬威克树| (O(n\log^2 n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

1.首先使用多边形引理。 当路径的线段长度总和严格大于该路径上最大线段长度的两倍时，该路径是有效的。 
2. 构建树的质心分解。 对于当前组件，找到其质心 (c)。 该分量中的每条路径要么经过（c），要么完全包含在删除（c）后获得的分量之一中。 
3. 对于从 (c) 可以到达且不跨越另一个受阻质心的每个顶点 (u)，计算两个值。 令 (s_u) 为从 (c) 到 (u) 的总和，包括 (a_c)，令 (m_u) 为同一路径上的最大值。 记录 (c) 的哪个子组件包含 (u)。 
4. 使用 (s_c=a_c) 和 (m_c=a_c) 将质心本身添加为特殊记录。 这允许通过与两个不同子组件之间的路径完全相同的公式来处理从 (c) 到另一个顶点的路径。 
5. 使用条件对所有收集的记录中的每一对进行计数

 [
 s_u+s_v-a_c>2\max(m_u,m_v)。 
]

 为了有效地做到这一点，请按递减 (m) 对记录进行排序。 对于当前记录 (u)，所有较早的记录 (v) 都有 (m_v\ge m_u)。 那么条件就是

 [
 2m_v-s_v+a_c<s_u。 
]

 将 (2m_v-s_v+a_c) 存储在 Fenwick 树中的早期记录，并查询有多少条严格小于 (s_u)。 

1. 上一步的计数还包括两个顶点属于 (c) 的同一子组件的对。 这样的对实际上并不经过(c)，因此它通过(c)的计算是无关紧要的。 对于每个子组件，仅对其记录运行相同的配对计数例程并减去该结果。 
2. 将 (c) 标记为从当前组件中删除。 递归地求解每个剩余的子组件。 (c) 中未计入的每条路径都完全包含在这些较小组件之一中，因此将在那里进行处理。 
3. 对当前质心和所有递归组件的贡献求和。 得到的数字就是测试用例的答案。 

### 为什么它有效

 在每个质心 (c) 处，算法精确计算端点为 (c) 本身或在删除 (c) 后位于两个不同组件中的有效路径。 对于这样的路径，(s_u+s_v-a_c) 正是其总长度，(\max(m_u,m_v)) 正是其最大线段，因此芬威克条件相当于多边形条件。 

位于一个子组件内的对将从当前贡献中删除，并传递给该组件的递归调用。 因此，每条路径都在其端点分离的最高质心处处理，或者其中一个端点是质心本身。 没有路径可以在两个不同的分解级别上进行计数，并且没有路径可以被跳过。 

排序参数也是精确的。 一旦以递减 (m) 方式处理顶点，较早的顶点总是具有更大或相等的路径最大值。 这让我们可以用已处理的 (m_v) 替换两个值的最大值，将两个变量的最大不等式转换为适合 Fenwick 树的单个阈值比较。 

## Python 解决方案```python
import sys
from bisect import bisect_left

input = sys.stdin.readline

class Fenwick:
    __slots__ = ("n", "bit")

    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, i, value=1):
        n = self.n
        bit = self.bit
        while i <= n:
            bit[i] += value
            i += i & -i

    def sum(self, i):
        bit = self.bit
        res = 0
        while i:
            res += bit[i]
            i -= i & -i
        return res

def count_pairs(items, ac):
    """
    Count unordered pairs (u, v) inside items satisfying

        s_u + s_v - ac > 2 * max(m_u, m_v)

    where each item is (s, m).
    """
    k = len(items)
    if k < 2:
        return 0

    items.sort(key=lambda x: x[1], reverse=True)

    keys = [2 * m - s + ac for s, m in items]
    coords = sorted(set(keys))

    fw = Fenwick(len(coords))
    ans = 0

    for s, m in items:
        # Need key < s, hence bisect_left rather than bisect_right.
        pos = bisect_left(coords, s)
        ans += fw.sum(pos)

        key = 2 * m - s + ac
        idx = bisect_left(coords, key) + 1
        fw.add(idx)

    return ans

def solve(data):
    it = iter(map(int, data.split()))
    t = next(it)
    outputs = []

    for _ in range(t):
        n = next(it)
        a = [next(it) for _ in range(n)]

        graph = [[] for _ in range(n)]
        for _ in range(n - 1):
            u = next(it) - 1
            v = next(it) - 1
            graph[u].append(v)
            graph[v].append(u)

        blocked = [False] * n
        parent = [-1] * n
        size = [0] * n

        def find_centroid(start):
            order = [start]
            parent[start] = -1

            for u in order:
                pu = parent[u]
                for v in graph[u]:
                    if blocked[v] or v == pu:
                        continue
                    parent[v] = u
                    order.append(v)

            for u in reversed(order):
                size[u] = 1
                for v in graph[u]:
                    if blocked[v] or parent[v] != u:
                        continue
                    size[u] += size[v]

            total = len(order)
            centroid = start
            best = total + 1

            for u in order:
                largest = total - size[u]
                for v in graph[u]:
                    if blocked[v] or parent[v] != u:
                        continue
                    if size[v] > largest:
                        largest = size[v]

                if largest < best:
                    best = largest
                    centroid = u

            return centroid

        answer = 0

        def decompose(start):
            nonlocal answer

            c = find_centroid(start)
            ac = a[c]

            all_items = [(ac, ac)]

            branch_items = []

            for first in graph[c]:
                if blocked[first]:
                    continue

                current = []
                stack = [(first, c, ac + a[first], max(ac, a[first]))]

                while stack:
                    u, p, s, m = stack.pop()
                    current.append((s, m))
                    all_items.append((s, m))

                    for v in graph[u]:
                        if blocked[v] or v == p or v == c:
                            continue
                        stack.append(
                            (v, u, s + a[v], max(m, a[v]))
                        )

                branch_items.append(current)

            # Count all pairs whose path is considered through c.
            answer += count_pairs(all_items, ac)

            # Remove pairs whose endpoints are in the same branch.
            for items in branch_items:
                answer -= count_pairs(items, ac)

            blocked[c] = True

            for v in graph[c]:
                if not blocked[v]:
                    decompose(v)

        if n > 0:
            decompose(0)

        outputs.append(str(answer))

    return "\n".join(outputs)

def main():
    data = sys.stdin.buffer.read().decode()
    sys.stdout.write(solve(data))

if __name__ == "__main__":
    main()
```Fenwick 树是标准的前缀计数结构。 坐标压缩后，`add`插入一把钥匙并`sum(pos)`计算所有插入的键，其压缩位置最多为`pos`。 

表达式`bisect_left(coords, s)`是故意严格的。 所需的不等式为 (2m_v-s_v+a_c<s_u)，不小于或等于 (s_u)。 如果两条边相等，则该多边形是退化的，不能被计算。 

质心本身表示为`(ac, ac)`。 如果 (u) 是另一个顶点，则该对`(c,u)`总计 (a_c+s_u-a_c=s_u)，其最大值为 (m_u)，因此通用公式可以处理它，无需特殊情况。 

对每个分支进行减法可以防止完全留在一个分支内的路径在当前质心处被计数。 这些路径仍然存在于递归分解中，其中它们的实际几何形状被正确表示。 

Python 整数具有任意精度，因此总和可以安全地达到 (2\cdot10^{14}) 而不会溢出。 该实现还使用迭代遍历进行组件探索，避免链上的 Python 递归深度问题。 的递归`decompose`它本身具有对数深度，因为每个递归组件最多具有其父级顶点的一半。 

## 工作示例

 ### 示例 1

 第一个样本是```
3
1 10 100
1 2
3 2
```树是一条链。 只有三个可能的端点对，并且每条路径最多包含两个段。 

| 配对 | 路径长度| 总和| 最大| 状况 | 有效|
 | --- | --- | --- | --- | --- | --- |
 | (1, 2) | 1, 10 | 1, 10 11 | 11 10 | 10 (11>20) | 没有 |
 | (1, 3) | 1、10、100 | 111 | 111 100 | 100 (111>200) | 没有 |
 | (2, 3) | 10、100 | 110 | 110 100 | 100 (110>200) | 没有 |

 答案是`0`。 该示例还演示了为什么两条线段永远无法形成有效的多边形，以及为什么非常大的线段会立即使路径无效。 

### 示例 2

 第二个样本是```
5
1 1 1 1 1
1 2
1 3
1 4
1 5
```顶点 1 是中心，其他四个顶点是叶子。 每个叶到叶路径都有三个单元段。 

在第一个质心 (a_c=1)。 质心记录为`(1,1)`，并且每片叶子都有`(2,1)`因为它从中心开始的路径包含两个单位值。 

| 端点类型| (s) | (男)| 数量 |
 | --- | --- | --- | --- |
 | 质心| 1 | 1 | 1 |
 | 叶| 2 | 1 | 4 |

 对于两片叶子来说，

 [
 s_u+s_v-a_c=2+2-1=3,
 ]

 同时

 [
 2\max(m_u,m_v)=2。 
]

 所以每对叶子都是有效的。 

| 配对类型| 对数 | 有效|
 | --- | --- | --- |
 | 中心和叶子 | 4 | 没有 |
 | 两片不同的叶子| (\binom42=6) | 是的 |

 当前的质心贡献是`6`。 每个分支仅包含一个顶点，因此无需减去相同的分支对。 所有递归组件都是单个顶点并且贡献为零。 

最终的答案是`6`，匹配样本。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\log^2 n)) | 每个质心级别处理 (O(n)) 个顶点，排序和 Fenwick 操作成本为 (O(n\log n))，并且有 (O(\log n)) 个级别 |
 | 空间| (O(n)) | (O(n)) | 树、质心分解状态、遍历缓冲区和临时计数数组都是线性的 |

 质心分解将每个分量减少大约一半，因此一个顶点参与 (O(\log n)) 层。 在每个级别，排序和 Fenwick 操作都需要该级别的 (O(n\log n)) 总工作量。 每个案例有 (n\le2\cdot10^5) 个，总共有 (4\cdot10^5) 个顶点，这符合预期的 (O(n\log^2 n)) 解决方案。 官方社论给出了同样的复杂性。 

## 测试用例

 以下测试假设提交的解决方案另存为`solution.py`并暴露了`solve(data)`函数如上所示。```
from solution import solve

def run(inp: str) -> str:
    return solve(inp).strip()

# Provided sample
sample = """\
2
3
1 10 100
1 2
3 2
5
1 1 1 1 1
1 2
1 3
1 4
1 5
"""
assert run(sample) == "0\n6", "provided samples"

# Minimum-size input
assert run("""\
1
1
7
""") == "0", "one vertex has no pair"

# Two vertices can never form a polygon
assert run("""\
1
2
1 100
1 2
""") == "0", "two segments are impossible"

# Equality case: 1 + 1 = 2, so the polygon is degenerate
assert run("""\
1
3
1 1 2
1 2
2 3
""") == "0", "strict polygon inequality"

# A maximum is away from the centroid.
# Path 1-2-3 has lengths 2, 1, 2 and is valid.
assert run("""\
1
3
2 1 2
1 2
2 3
""") == "1", "maximum need not be the centroid"

# All equal values on a chain.
# Every path with at least 3 vertices is valid.
n = 200000
values = " ".join(["1"] * n)
edges = "\n".join(f"{i} {i + 1}" for i in range(1, n))
expected = (n - 1) * (n - 2) // 2

large_input = f"""\
1
{n}
{values}
{edges}
"""
assert run(large_input) == str(expected), "large all-equal chain"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 / 7`|`0`| 最小尺寸边界 |
 |`1 / 2 / 1 100 / 1 2`|`0`| 两条线段不能形成多边形 |
 |`1 / 3 / 1 1 2 / 1-2-3`|`0`| 严格的不平等与平等边界|
 |`1 / 3 / 2 1 2 / 1-2-3`|`1`| 最大值可能远离质心 |
 | 200000 个单位顶点链 |`19999700001`| 最大尺寸输入、等值、性能、大答案 |

 ## 边缘情况

 在发生任何有意义的对计数之前处理单顶点情况。 对于输入```
1
1
7
```唯一的质心是顶点 1，并且`all_items`仅包含`(7,7)`。 Fenwick 例程立即返回零，因为记录少于两条。 递归分解没有剩余分量，所以最终答案是`0`。 

对于两个顶点，该算法也返回零。 考虑```
1
2
1 100
1 2
```质心分解可以选择任一顶点作为质心。 唯一的路径包含长度 (1) 和 (100)，给出总和 (101) 和最大值 (100)。 所需的不等式是 (101>200)，这是错误的。 Fenwick 比较也拒绝它，因为相应的阈值并不严格低于当前总和。 

平等边界是通过使用来处理的`bisect_left`。 为了```
1
3
1 1 2
1 2
2 3
```整个路径有 (s=4) 和 (m=2)，所以 (s=2m)。 在变换后的不等式中，相关键恰好等于当前(s)。`bisect_left`将查询放在相等的键之前，因此该对不被计算在内。 这正是所需要的严格不平等。 

处理质心之外的最大值是因为该算法不假设质心是最大值。 为了```
1
3
2 1 2
1 2
2 3
```以顶点2为质心。 每个叶子有 (s=3) 和 (m=2)，而质心有 (s=m=1)。 对于两片叶子来说，

 [
 3+3-1=5>2\cdot2=4。 
]

 即使质心的值小于两个端点的最大值，该对也会被计数。 这正是该算法同时存储 (s_u) 和 (m_u) 而不是仅存储质心之和的原因。 

对于全相等最大尺寸链，每条至少包含三个顶点的路径都是有效的。 两个顶点的路径有和（2）和最大值（1），因此在数值不等式下它已经有效，但这样的路径仍然不能形成多边形。 这个明显的问题可以通过多边形引理解决，因为对于两个线段，最长的线段始终至少是另一个线段，使得 (S>2M) 不可能。 对于单位值，两顶点路径具有 (S=2) 和 (2M=2)，因此严格失败。 每条具有三个或更多顶点的路径都会成功。 

因此，在 (n=200000) 个单位顶点链上，有效路径恰好是具有至少三个顶点的路径。 有

 [
 \binom n2-(n-1)
 =\frac{(n-1)(n-2)}2
 =19999700001
 ]

 其中，这是通过大测试检查的值。 

同样的推理也解释了为什么明星样本有答案六。 中心到叶子路径包含两个单元段并且相等失败，而每个叶子到叶子路径包含三个单元段并且相等成功。 质心级减法不会删除任何有效的叶子对，因为每个叶子都位于不同的分支中。
