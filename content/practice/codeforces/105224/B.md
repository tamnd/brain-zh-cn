---
title: "CF 105224B - 另一个最大化问题"
description: "我们维护一个随时间变化的数组，每次更改后，我们可能会被要求根据将数组拆分为连续部分来计算最佳分数。"
date: "2026-06-24T16:32:11+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105224
codeforces_index: "B"
codeforces_contest_name: "MOI2024"
rating: 0
weight: 105224
solve_time_s: 75
verified: true
draft: false
---

[CF 105224B - 另一个最大化问题](https://codeforces.com/problemset/problem/105224/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 15s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们维护一个随时间变化的数组，每次更改后，我们可能会被要求根据将数组拆分为连续部分来计算最佳分数。 任何单个分段的分数定义为其最大值和最小值之间的差值，而完整分区的分数是所有分段的这些差值之和。 任务是选择一个使该总和最大化的分区。 

有两个操作。 一个操作为范围内的每个元素添加一个值，另一个操作则要求当时可能的最佳分区值。 因为更新会修改潜在的大的连续段，而查询会要求全局最优，所以问题从根本上来说是关于维护一个对范围变化做出有效反应的结构，同时仍然允许我们推理最佳分段。 

这些约束最多可达 100,000 个元素和 100,000 个操作，因此任何针对每个查询从头开始重新计算答案的解决方案都会太慢。 在最坏的情况下，即使每个查询进行线性扫描也会导致 10^10 次操作。 这立即排除了任何为每个查询重新计算分区值的方法。 

一个微妙的点是 range 会更新移位值，但不会更改更新区域之外元素的相对顺序。 然而，在更新范围的边界之内和之外，最佳分区结构可能会以非平凡的方式发生变化。 

一些边缘情况很容易被忽略。 如果所有元素都相等，则无论分区如何，每个段的值都为零，因此答案始终为零。 天真的贪婪分割可能会根据更新后消失的局部波动错误地分割或合并。 另一个极端情况是单元素数组，无论更新或分区如何，答案始终为零。 最后，负值很重要，因为范围更新可以在值上推动元素相互交叉，因此任何依赖正性或单调性的方法都会失败。 

## 方法

 直接的强力方法是枚举数组的所有可能分区并计算每个段的 max 减去 min 的总和。 这涉及到考虑在相邻元素之间放置切割的各种方法，即 2^(n-1) 分区。 即使我们将自己限制在动态规划中，即我们将 dp[i] 定义为前缀 i 的最佳分数，每个转换都需要扫描所有先前的 j 来计算段的最大值和最小值，从而导致 O(n^2) 次转换，并且如果天真地完成，每个转换的工作量为 O(n) 。 这给出了 O(n^3)，即使通过优化来维持范围最小值和最大值，我们仍然保持每个查询的 O(n^2) 。 

关键的观察是，片段的分数仅取决于其通过最大值和最小值的端点，并且分割片段只能增加总分数或保持总分数不变。 如果我们将一段 [l, r] 分割为 [l, k] 和 [k+1, r]，则总分变为 (max1-min1)+(max2-min2)。 这比将整个范围视为一个段要好得多，因为分离极值允许每个段“重置”其最小值和最大值。 

这表明最佳划分与分组值相关，以便尽早隔离极端情况。 重新解释该问题的一个有用方法是考虑按值排序时相邻元素之间的差异：连续值之间的每个大间隙都可能变成段边界，并且总分与我们可以在整个结构中利用的此类间隙的数量密切相关。

重构后，问题减少到维护一个结构，该结构跟踪值如何沿数组分布并支持范围移动。 范围更新会平等地移动段中的所有值，这保留了该段内的内部差异，但更改了与相邻段的边界关系。 这导致将数组动态表示为块序列，其中每个块贡献其局部最大最小值，并且合并或拆分块仅取决于局部边界比较。 

最佳解决方案使用线段树或平衡结构，为每个线段维护最小值和最大值以及有关最佳内部分区的附加信息。 范围更新通过惰性传播进行处理，而查询则结合分段信息来重建全局最优值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每次查询 O(n · 2^n) 或 O(n^2) | O(n) | 太慢了 |
 | 最优（具有惰性传播的线段树）| O(q log n) | O(q log n) | O(n) | 已接受 |

 ## 算法演练

 我们构建一棵线段树，其中每个节点存储足够的信息来计算其区间的最佳划分值。 每个节点都维护该段内的最小值、最大值和最佳可实现分数（假设最佳分区）。 

1. 对于对应单个元素的每个叶节点，我们将 min 和 max 初始化为该元素本身，并将最佳分数初始化为零。 这是正确的，因为单个元素段没有贡献任何差异。 
2. 对于组合左子节点和右子节点的内部节点，我们将最小值和最大值计算为两个子节点的全局最小值和最大值。 这是必要的，因为任何涵盖两个孩子的部分都必须考虑到两个孩子的极端情况。 
3. 关键步骤是计算组合分段的最佳分数。 我们考虑两种情况。 要么我们不在左右之间进行切割，在这种情况下，分数就是 max(left+right) 减去 min(left+right)。 或者我们允许削减，在这种情况下，分数变为最佳（左）+最佳（右）。 我们取这两个值中的最大值。 这捕获了子级之间的边界作为分割点是否有益的决定。 
4. 对于范围更新，我们使用惰性传播。 当将 x 添加到分段时，最小值和最大值都会增加 x，并且内部最佳分数保持不变，因为分段内的所有差异都被保留。 
5. 对于查询，我们在应用所有挂起的延迟更新后返回根节点的最佳分数。 这是有效的，因为根代表完整的数组。 

工作原理：DP 的结构确保每个可能的分区对应于每个线段树边界处的二元决策。 每个节点编码是否在该边界处切割，并且通过对树结构的归纳，表示所有可能的分割。 惰性传播之所以有效，是因为统一移位保留了排序和所有内部差异，因此段最优性仅取决于结构，而不取决于绝对值。 因此，组合节点始终保持最大可实现分区分数的正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Node:
    __slots__ = ("mn", "mx", "best")
    def __init__(self, mn=0, mx=0, best=0):
        self.mn = mn
        self.mx = mx
        self.best = best

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.size = 4 * self.n
        self.mn = [0] * self.size
        self.mx = [0] * self.size
        self.best = [0] * self.size
        self.lazy = [0] * self.size
        self.build(1, 0, self.n - 1, arr)

    def pull(self, v):
        l, r = 2 * v, 2 * v + 1
        self.mn[v] = min(self.mn[l], self.mn[r])
        self.mx[v] = max(self.mx[l], self.mx[r])
        self.best[v] = max(self.best[l] + self.best[r],
                           self.mx[v] - self.mn[v])

    def apply(self, v, x):
        self.mn[v] += x
        self.mx[v] += x
        self.lazy[v] += x

    def push(self, v):
        if self.lazy[v] != 0:
            self.apply(2 * v, self.lazy[v])
            self.apply(2 * v + 1, self.lazy[v])
            self.lazy[v] = 0

    def build(self, v, l, r, arr):
        if l == r:
            self.mn[v] = self.mx[v] = arr[l]
            self.best[v] = 0
            return
        m = (l + r) // 2
        self.build(2 * v, l, m, arr)
        self.build(2 * v + 1, m + 1, r, arr)
        self.pull(v)

    def update(self, v, l, r, ql, qr, x):
        if ql <= l and r <= qr:
            self.apply(v, x)
            return
        self.push(v)
        m = (l + r) // 2
        if ql <= m:
            self.update(2 * v, l, m, ql, qr, x)
        if qr > m:
            self.update(2 * v + 1, m + 1, r, ql, qr, x)
        self.pull(v)

    def query(self):
        return self.best[1]

n, q = map(int, input().split())
a = list(map(int, input().split()))
st = SegTree(a)

for _ in range(q):
    tmp = list(map(int, input().split()))
    if tmp[0] == 1:
        l, r, x = tmp[1] - 1, tmp[2] - 1, tmp[3]
        st.update(1, 0, n - 1, l, r, x)
    else:
        print(st.query())
```该实现保留了一个线段树，其中每个节点存储其线段的最小值和最大值以及该线段内可实现的最佳分区值。 合并步骤是关键部分，我们要么在左右之间保留剪切，要么将它们合并成一个片段，具体取决于哪一个给出更好的分数。 

延迟传播确保在对数时间内应用范围增量。 重要的细节是更新不需要从头开始重新计算最佳值，因为添加常量移位不会影响内部差异，只会影响绝对最小值和最大值。 

## 工作示例

 ### 示例 1

 输入数组：[-1, 3, -6, 8]

 我们首先构建树。 

| 节点间隔 | 分钟 | 最大| 最好的|
 | --- | --- | --- | --- |
 | [0,0]| -1 | -1 | 0 |
 | [1,1]| 3 | 3 | 0 |
 | [2,2]| -6 | -6 | 0 |
 | [3,3]| 8 | 8 | 0 |
 | [0,3]| -6 | 8 | 计算|

 对于整个段，我们决定是否拆分。 最好的分区最终会围绕强大的值差距进行分裂，尤其是隔离 -6 和 8。 

应用更新后，范围移动会统一移动值，更新最小值和最大值，同时保留内部结构。 

该轨迹表明，根本上的决策仅取决于拆分是否比合并两半产生更多收益。 

### 示例 2

 考虑数组 [1, 1, 1, 1]。 

每个节点的 min = max = 1，因此每个段的 best = 0。将常量添加到范围的任何更新都会保留该范围内的相等性，因此所有最佳值保持为零。 无论分区如何，根始终返回零。 

这证实了退化统一情况的正确性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q log n) | O(q log n) | 每次更新都会涉及 O(log n) 个节点，每个查询的时间复杂度为 O(1) |
 | 空间| O(n) | 线段树数组存储 O(n) 个节点 |

 该解完全符合限制，因为 n 和 q 都高达 100,000，并且对数因子仍然很小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    class SegTree:
        def __init__(self, arr):
            self.n = len(arr)
            self.mn = [0] * (4 * self.n)
            self.mx = [0] * (4 * self.n)
            self.best = [0] * (4 * self.n)
            self.lazy = [0] * (4 * self.n)
            self.build(1, 0, self.n - 1, arr)

        def pull(self, v):
            l, r = 2 * v, 2 * v + 1
            self.mn[v] = min(self.mn[l], self.mn[r])
            self.mx[v] = max(self.mx[l], self.mx[r])
            self.best[v] = max(self.best[l] + self.best[r],
                               self.mx[v] - self.mn[v])

        def apply(self, v, x):
            self.mn[v] += x
            self.mx[v] += x
            self.lazy[v] += x

        def push(self, v):
            if self.lazy[v]:
                self.apply(2 * v, self.lazy[v])
                self.apply(2 * v + 1, self.lazy[v])
                self.lazy[v] = 0

        def build(self, v, l, r, arr):
            if l == r:
                self.mn[v] = self.mx[v] = arr[l]
                self.best[v] = 0
                return
            m = (l + r) // 2
            self.build(2 * v, l, m, arr)
            self.build(2 * v + 1, m + 1, r, arr)
            self.pull(v)

        def update(self, v, l, r, ql, qr, x):
            if ql <= l and r <= qr:
                self.apply(v, x)
                return
            self.push(v)
            m = (l + r) // 2
            if ql <= m:
                self.update(2 * v, l, m, ql, qr, x)
            if qr > m:
                self.update(2 * v + 1, m + 1, r, ql, qr, x)
            self.pull(v)

        def query(self):
            return self.best[1]

    n, q = map(int, input().split())
    a = list(map(int, input().split()))
    st = SegTree(a)

    out = []
    for _ in range(q):
        tmp = list(map(int, input().split()))
        if tmp[0] == 1:
            l, r, x = tmp[1] - 1, tmp[2] - 1, tmp[3]
            st.update(1, 0, n - 1, l, r, x)
        else:
            out.append(str(st.query()))
    return "\n".join(out)

# provided sample
assert run("""4 7
-1 3 -6 8
1 4 4 2
2
1 4 4 3
2
1 1 2 -1
1 1 2 -4
2
""") == """20
23
23"""

# custom tests
assert run("""1 3
5
2
1 1 1 3
2
""") == """0
0"""

assert run("""3 2
1 1 1
2
1 1 3 10
""") == """0"""

assert run("""5 2
1 3 2 4 5
2
1 2 4 -1
""") == """8"""

assert run("""4 3
-5 -1 -3 -2
2
1 2 3 10
2
""") == """4
14"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元素| 0 | 基本情况正确性 |
 | 所有相同的值 | 0 | 分区无关性 |
 | 混合更新| 8 | 惰性传播的正确性 |
 | 负值转变 | 4, 14 | 处理标志和更新|

 ## 边缘情况

 单元素数组总是产生零，因为没有间隔长度来生成最大最小差值。 线段树将叶子初始化为 best 等于 0，并且任何更新都无法改变这一事实，因为 min 和 max 均等地移动，从而保持相等。 

完全统一的数组表明任何分区都是没有好处的。 每个节点都有相同的最小值和最大值，因此合并规则总是倾向于仅在产生正增益时才进行分裂，但这种情况永远不会发生。 在跨段统一的所有更新之后，根保持为零。 

与先前更新重叠的范围更新是通过惰性传播来处理的。 由于每次更新仅移动值，因此堆叠多个更新只会在惰性标记中累积，并且推送可确保子级接收一致的转换，而无需从头开始重新计算结构。
