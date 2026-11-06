---
title: "CF 1913E - 矩阵问题"
description: "我们从一个二进制矩阵开始。 当前每个单元格包含 0 或 1，并且我们可以将任何单元格更改为任一值。 更改单元格算作一项操作。 最终矩阵必须满足两个独立的要求。"
date: "2026-06-08T20:11:10+07:00"
tags: ["codeforces", "competitive-programming", "flows", "graphs"]
categories: ["algorithms"]
codeforces_contest: 1913
codeforces_index: "E"
codeforces_contest_name: "Educational Codeforces Round 160 (Rated for Div. 2)"
rating: 2400
weight: 1913
solve_time_s: 168
verified: true
draft: false
---

[CF 1913E - 矩阵问题](https://codeforces.com/problemset/problem/1913/E)

 **评分：** 2400
 **标签：** 流程、图表
 **求解时间：** 2m 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从一个二进制矩阵开始。 当前每个单元格包含 0 或 1，并且我们可以将任何单元格更改为任一值。 更改单元格算作一项操作。 

最终矩阵必须满足两个独立的要求。 对于每一行，行数必须与规定的行总和相匹配。 对于每一列，1 的数量必须与规定的列总和相匹配。 

在满足这些行和列要求的所有矩阵中，我们需要一个需要对原始矩阵进行最少单元格更改的矩阵。 

矩阵尺寸最多为 50 × 50，因此最多有 2500 个单元。 对于几千个顶点和边的图算法来说这已经足够小了，但完全排除了枚举可能的矩阵。 具有 2500 个单元的二元矩阵$2^{2500}$可能的配置。 

在考虑优化之前，有一个基本的可行性条件。 行所需的总数必须等于列所需的总数。 如果$$\sum A_i \ne \sum B_j,$$那么没有矩阵可以同时满足两组约束。 

一些边缘情况很容易被忽略。 

考虑```
2 2
0 0
0 0
2 0
1 1
```行总和要求第一行中有两个 1，第二行中有 0。 列总和要求每列一一。 两个方向的总需求均为 2，因此存在解。 

仅检查行要求或仅检查列要求的粗心解决方案可能会错误地拒绝这种情况。 

另一个重要的情况是当原始矩阵已经满足所有条件时：```
2 2
1 0
0 1
1 1
1 1
```答案是 0。任何试图在不考虑现有位置的情况下贪婪地移动元素的算法都可能会执行不必​​要的修改。 

不可能的情况也必须立即检测到：```
2 2
0 0
0 0
2 2
1 1
```行需要四个，而列只需要两个。 没有一个矩阵可以满足这两个要求，所以正确答案是-1。 

最微妙的问题是，最小化变化与构建任何可行的矩阵不同。 不同的可行矩阵可能需要不同数量的编辑。 优化目标必须直接构建到模型中。 

## 方法

 暴力解决方案会尝试每个大小的二进制矩阵$n \times m$，检查其行和和列和是否与目标匹配，并在所有有效矩阵中计算与原始矩阵的最小汉明距离。 

这是正确的，因为它明确地检查每个候选最终矩阵。 不幸的是，即使是 10 × 10 矩阵也已经有$2^{100}$的可能性。 对于多达 2500 个单元，暴力破解是完全没有希望的。 

关键的观察是约束描述了二分结构。 

每行都决定其所需行的去向。 每列都会收到所需数量的 1。 如果我们考虑将一个放入单元格中$(i,j)$作为选择行之间的边缘$i$和列$j$，那么：

 - 行$i$必须准确参与$A_i$选定的边缘。 
- 柱子$j$必须准确参与$B_j$选定的边缘。 

这其实就是一个流量问题。 

现在考虑目标。 假设细胞$(i,j)$目前包含 1。 

如果我们将其保持为 1，则成本为 0。 

如果我们把它改为0，成本就是1。 

类似地，如果单元格当前包含 0：

 - 保持 0 成本 0。 
- 将其更改为 1 需要花费 1。 

与其直接最小化修改，不如最大化保持不变的单元格数量更容易。 

对于选定的最终矩阵$x$,$$\text{changes} = nm - \text{unchanged cells}.$$所以我们想要保留最大数量的原始值的可行矩阵。 

这将问题转化为最小成本流公式。 

对于每个单元格：

 - 选择最终值 1 将发送一个单位的流量通过该行列对。 
- 边缘成本反映了此选择是保留还是更改原始单元格。 

使用成本$$\text{cost}(1)= \begin{cases} 0 & a_{ij}=1\\ 1 & a_{ij}=0 \end{cases}$$计算创建最终矩阵的成本。 

然而，最终为 0 的单元格也可能会产生修改成本。 为了干净地捕获总编辑次数，我们改变了目标。 

让每个原始 1 最初贡献恒定成本 1。 然后：

 - 如果原来的 1 仍然是 1，我们就获得 1。 
- 如果原来的0变成1，我们支付1。 

这导致边权重$$w_{ij}= \begin{cases} 1 & a_{ij}=1\\ -1 & a_{ij}=0 \end{cases}$$我们寻求使总重量最大化的可行矩阵。 

获得最大重量后$W$,$$\text{answer} = (\#\text{original ones}) - W.$$由此产生的优化是最大成本二分流，相当于否定边缘成本后的最小成本流。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(2^{nm})$|$O(1)$| 太慢了 |
 | 最优最小成本流程|$O(V^2E)$或更适合此尺寸 |$O(E)$| 已接受 |

 ## 算法演练

 1. 读取矩阵并计算原始矩阵的个数，表示为`ones`。 
2. 检查是否$$\sum A_i = \sum B_j.$$如果没有，则打印`-1`因为没有一个矩阵能够同时满足这两组要求。 
3.构建流量网络。 

创建源`S`，每行一个节点，每列一个节点，以及一个接收器`T`。 
4. 添加边`S`到每行节点的容量`A_i`和成本`0`。 

这恰好迫使`A_i`离开行的流量单位`i`，正好对应`A_i`那一排的人。 
5. 将每个列节点的边添加到`T`有能力`B_j`和成本`0`。 

这恰好迫使`B_j`进入色谱柱的流量单位`j`。 
6. 对于每个细胞`(i,j)`，从行添加一条边`i`到专栏`j`有能力`1`。 

其成本为：$$-1 \quad \text{if } a_{ij}=1$$

$$+1 \quad \text{if } a_{ij}=0$$我们取消权重，因为标准的最小成本流程可以最大限度地降低成本。 
7. 准确发送$$F=\sum A_i$$从源到汇的流量单位。 

如果网络无法发送这个数量，则不存在可行矩阵，答案是`-1`。 
8.让`cost`是找到的最小总成本。 

由于成本已被抵消，$$W=-cost.$$9. 输出$$\text{ones}-W.$$### 为什么它有效

 每个流单元对应于选择一个最终值为 1 的矩阵单元。行列边缘上的容量为 1 保证单元最多被选择一次。 源行容量强制执行行总和，列接收器容量强制执行列总和。 

对于原始值 1，选择该单元格会贡献权重 +1。 对于原始 0，选择该单元格贡献权重 -1。 总重量等于$$(\text{original 1s kept}) - (\text{original 0s turned into 1}).$$如果原始矩阵包含`ones`那些，那么$$\text{changes} = (\text{original 1s removed}) + (\text{original 0s added}) = \text{ones}-W.$$因此，最大化重量完全等同于最小化修饰细胞的数量。 最小成本流算法找到最佳可行流，因此得到的编辑计数最少。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

class Edge:
    __slots__ = ("to", "rev", "cap", "cost")

    def __init__(self, to, rev, cap, cost):
        self.to = to
        self.rev = rev
        self.cap = cap
        self.cost = cost

class MinCostFlow:
    def __init__(self, n):
        self.n = n
        self.g = [[] for _ in range(n)]

    def add_edge(self, fr, to, cap, cost):
        fwd = Edge(to, len(self.g[to]), cap, cost)
        rev = Edge(fr, len(self.g[fr]), 0, -cost)
        self.g[fr].append(fwd)
        self.g[to].append(rev)

    def min_cost_flow(self, s, t, need):
        n = self.n
        pot = [0] * n
        flow = 0
        cost = 0

        INF = 10**18

        while flow < need:
            dist = [INF] * n
            parent_v = [-1] * n
            parent_e = [-1] * n

            dist[s] = 0
            pq = [(0, s)]

            while pq:
                d, v = heapq.heappop(pq)
                if d != dist[v]:
                    continue

                for i, e in enumerate(self.g[v]):
                    if e.cap <= 0:
                        continue

                    nd = d + e.cost + pot[v] - pot[e.to]
                    if nd < dist[e.to]:
                        dist[e.to] = nd
                        parent_v[e.to] = v
                        parent_e[e.to] = i
                        heapq.heappush(pq, (nd, e.to))

            if dist[t] == INF:
                return None

            for v in range(n):
                if dist[v] < INF:
                    pot[v] += dist[v]

            add = need - flow
            v = t

            while v != s:
                pv = parent_v[v]
                pe = parent_e[v]
                add = min(add, self.g[pv][pe].cap)
                v = pv

            v = t
            while v != s:
                pv = parent_v[v]
                pe = parent_e[v]
                e = self.g[pv][pe]

                e.cap -= add
                self.g[v][e.rev].cap += add

                v = pv

            flow += add
            cost += add * pot[t]

        return cost

def solve():
    n, m = map(int, input().split())

    a = [list(map(int, input().split())) for _ in range(n)]
    A = list(map(int, input().split()))
    B = list(map(int, input().split()))

    if sum(A) != sum(B):
        print(-1)
        return

    original_ones = sum(sum(row) for row in a)

    S = 0
    row_start = 1
    col_start = row_start + n
    T = col_start + m
    N = T + 1

    mcf = MinCostFlow(N)

    for i in range(n):
        mcf.add_edge(S, row_start + i, A[i], 0)

    for j in range(m):
        mcf.add_edge(col_start + j, T, B[j], 0)

    for i in range(n):
        for j in range(m):
            cost = -1 if a[i][j] == 1 else 1
            mcf.add_edge(row_start + i, col_start + j, 1, cost)

    required_flow = sum(A)

    cost = mcf.min_cost_flow(S, T, required_flow)

    if cost is None:
        print(-1)
        return

    max_weight = -cost
    answer = original_ones - max_weight
    print(answer)

if __name__ == "__main__":
    solve()
```该网络每行包含一个节点，每列包含一个节点。 通过行列边的一个流量单位意味着在最终矩阵中相应的单元格被分配值 1。 

行容量和列容量精确编码所需的行和列总和。 由于每个单元边缘的容量为 1，因此没有单元可以贡献多于一个选定的单元。 

微妙的部分是成本分配。 原件收取费用`-1`，而原始零接收成本`+1`。 最小成本流算法最小化总成本，这相当于最大化证明中描述的权重。 计算流量后，最终公式会将最大权重转换回编辑次数。 

该实现使用具有约翰逊势的连续最短增广路径。 负边缘成本仅出现在前向单元边缘，但不存在负循环。 势使得所有降低的成本都是非负的，从而允许有效地使用 Dijkstra 算法。 

## 工作示例

 ### 示例 1

 输入：```
3 3
0 0 0
0 0 0
0 0 0
1 1 1
1 1 1
```原始矩阵包含零个。 

所需流量为3。 

| 选定的细胞| 重量贡献 | 总重量|
 | --- | --- | --- |
 | (1,1) | -1 | -1 |
 | (2,2) | -1 | -2 |
 | (3,3) | -1 | -3 |

 所有选定的单元格都来自原始零。 

| 数量 | 价值|
 | --- | --- |
 | 原创 | 0 |
 | 最大重量 | -3 |
 | 回答 | 3 |

 输出：```
3
```跟踪显示，每个必需的编辑都必须从零开始创建，恰好产生三个编辑。 

### 示例 2```
2 2
1 0
0 1
1 1
1 1
```该矩阵已经满足目标。 

| 选定的细胞| 重量贡献 | 跑步体重|
 | --- | --- | --- |
 | (1,1) | +1 | 1 |
 | (2,2) | +1 | 2 |

 | 数量 | 价值|
 | --- | --- |
 | 原创 | 2 |
 | 最大重量 | 2 |
 | 回答 | 0 |

 输出：```
0
```该流程准确选择已经存在的单元格，保留每个原始值并且不需要编辑。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(V^2E)$| 连续最短增广路径最小成本流|
 | 空间|$O(E)$| 图存储|

 对于这个问题，$$V = n + m + 2 \le 102$$和$$E = nm + n + m \le 2600.$$对于最小成本流程实施而言，这些值非常小，因此该解决方案完全符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    pass

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    solve()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out.getvalue()

# sample 1
assert run(
"""3 3
0 0 0
0 0 0
0 0 0
1 1 1
1 1 1
"""
) == "3\n"

# already valid matrix
assert run(
"""2 2
1 0
0 1
1 1
1 1
"""
) == "0\n"

# impossible totals
assert run(
"""2 2
0 0
0 0
2 2
1 1
"""
) == "-1\n"

# all ones already
assert run(
"""2 2
1 1
1 1
2 2
2 2
"""
) == "0\n"

# minimum dimensions
assert run(
"""2 2
0 0
0 0
1 0
1 0
"""
) == "1\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 | 3 | 创建所有必需的 |
 | 已经有效的矩阵 | 0 | 没有不必要的编辑|
 | 总计不匹配 | -1 | 可行性检查|
 | 都已经了 | 0 | 保留现有结构 |
 | 2×2 边界情况 | 1 | 最小有效尺寸 |

 ## 边缘情况

 考虑不可能完全的情况：```
2 2
0 0
0 0
2 2
1 1
```行要求总和为 4，而列要求总和为 2。在任何流计算开始之前，算法会检测到不匹配并返回`-1`。 不存在可行的矩阵，因为每个矩阵同时贡献一行计数和一列计数。 

考虑一个已经满足所有要求的矩阵：```
2 2
1 0
0 1
1 1
1 1
```流量需求为 2。最便宜的边正是已经包含边的两个单元，每个单元都有成本`-1`。 该算法发送流经这些单元格，获得总成本`-2`，计算权重`2`，并返回`2 - 2 = 0`。 

考虑存在多个可行矩阵的情况：```
2 2
1 0
0 0
1 1
1 1
```最终两个矩阵满足行和列的和。 一种保留现有的单元格，仅更改另外一个单元格。 另一种则丢弃现有的并创建两个新的。 流目标更喜欢第一种配置，因为保留原始配置会贡献正权重。 得到的答案是真正的最小编辑计数，而不仅仅是任何可行的计数。 

这些例子说明了为什么可行性和优化必须一起处理，这正是最小成本流公式所要实现的目标。
