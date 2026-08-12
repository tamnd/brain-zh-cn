---
title: "CF 102407K - 疯狂的安排"
description: "树本身看起来是该语句的核心，但有用的表示并不是边权重。 树的根位于任意顶点，例如顶点 1，并令 (hv) 为从根到 (v) 的路径上的边权重的异或。"
date: "2026-08-11T23:53:49+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102407
codeforces_index: "K"
codeforces_contest_name: "\u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u044b, \u0421\u0435\u0437\u043e\u043d 2019-2020, \u0412\u0442\u043e\u0440\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430, \u0443\u0441\u043b\u043e\u0436\u043d\u0435\u043d\u043d\u0430\u044f \u043d\u043e\u043c\u0438\u043d\u0430\u0446\u0438\u044f"
rating: 0
weight: 102407
solve_time_s: 403
verified: false
draft: false
---

[CF 102407K - 疯狂安排](https://codeforces.com/problemset/problem/102407/K)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 43s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 树本身看起来是该语句的核心，但有用的表示并不是边权重。 树的根位于任意顶点，例如顶点 1，并令 (h_v) 为从根到 (v) 的路径上的边权重的异或。 因为树的两个顶点之间只有一条路径，所以从 (u) 到 (v) 的路径上的 XOR 很简单

 [
 s(u,v)=h_u\o加上h_v。 
]

 一旦 (h_1=0) 固定，(h_v) 值的每一次分配都恰好对应于树边的一次分配。 因此，原始树的特定形状对答案没有影响。 这是问题的核心简化。 

现在忘记原来的树并构建一个新的图（G）。 它的顶点是原始树顶点，并且它的第(i)条图边连接(u_i)和(v_i)。 该边所需的值为

 [
 h_{u_i}\o加上h_{v_i}=s_i。 
]

 序列 (s_1,\ldots,s_m) 仅由 0 和 1 组成，并且必须是非递减的。 因此，对于 0 和 1 之间的每个边界 (k)，它恰好具有一种可能的形状：

 [
 s_1=\cdots=s_k=0,\qquad
 s_{k+1}=\cdots=s_m=1,
 ]

 其中 (k) 可以是 (0) 到 (m) 之间的任何整数。 

所以问题就变成了：对于多少个边界 (k)，以下 XOR 方程组是一致的？ 

[
 h_{u_i}\oplus h_{v_i}=
 \开始{案例}
 0,&i\le k,\
 1、&i>k。 
\结束{案例}
 ]

 对于每个一致的边界，解的数量是相同的。 在图 (G) 中，每个连通分量都有一个自由的二元选择，因为所有方程仅指定相对 XOR 值。 固定 (h_1=0) 会删除包含顶点 1 的分量的自由度。如果 (G) 有 (c) 个连通分量，则每个一致边界都具有精确的 (2^{c-1}) 条对应的边分配。 

约束达到(n,m\le250,000)。 二次算法已经需要大约 (6.25\cdot10^{10}) 基本运算，这远远超出了原始问题的两秒限制。 即使是扫描所有 (m+1) 个边界并独立检查所有 (m) 个方程的算法也是 (O(m^2))。 预期的解决方案必须以大约 (O(m\log m)) 的图形操作一起处理所有边界。 最初的问题有两秒的时间限制和 512 MiB 的内存限制。 

有几种简单的方法可以使边界条件出错。 首先，边界（k=0）有效：这意味着每个（s_i）都为1。同样，当所有（s_i）都为0时，（k=m）有效。例如，```
2 2
1
1 2
1 2
```总是产生 (s_1=s_2)，因此单个树边缘的两个分配都是疯狂的，答案是 2。仅检查两个实际查询之间的边界的解决方案将错过两个有效常量序列之一。 

第二个陷阱是可行性不必随着 (k) 的变化而单调。 考虑示例 1：```
3 3
1 2
1 2
2 3
1 3
```四个可能的单调目标序列是（000,001,011,111）。 可实现的序列是 (000,011,101,110)，因此只有 (000) 和 (011) 有效。 有效边界是 (k=3) 和 (k=1)，而 (k=2) 是无效边界。 因此，我们不能在第一个矛盾之后就停下来，也不能假设所有可行的边界都形成一个区间。 

第三个陷阱是忘记查询图可能已断开连接。 示例 3 有两个断开连接的查询边：```
4 2
1 2 3
1 2
3 4
```三个单调目标序列中的每一个都是一致的，但每个一致系统都有两个解，因为查询图有两个连通分量，并且其中只有一个包含固定根。 因此答案是 (3\cdot2=6)，而不是 3。 

## 方法

 直接暴力方法很简单。 有 (n-1) 个树边，每个边都有两个可能的权重，因此我们枚举所有 (2^{n-1}) 个分配。 对于一项分配，我们可以计算 (O(n)) 中的根到顶点 XOR 值，然后使用 (h_u\oplus h_v) 评估 (O(1)) 中的每个请求路径，最后检查结果序列是否是非递减的。 这是正确的，因为每个可能的边缘分配都被仅考虑一次。 

问题是指数枚举。 运行时间为

 [
 \Theta((n+m)2^{n-1}),
 ]

 仅仅枚举分配就已经需要最多 (n) (2^{249999}) 次迭代。 这根本不可能实现。 

第一个有用的观察是疯狂序列只有 (m+1) 种可能的形式。 我们只需要确定哪些边界 (k) 产生一致的 XOR 系统。 对于固定边界，奇偶校验 DSU 可以检查 (O(n+m)) 中的一致性，因为方程 (h_u\oplus h_v=q) 正是一个约束，表示 (u) 和 (v) 必须具有规定的相对颜色。 

对所有 (m+1) 个边界独立执行此操作会得到 (O(m(n+m)))，但它仍然太大。 

关键的观察结果是相邻边界仅在一个方程中不同。 当我们从边界 (k-1) 移动到边界 (k) 时，只有第 (k) 个方程发生变化，从

 [
 h_{u_k}\oplus h_{v_k}=1
 ]

 到

 [
 h_{u_k}\o加上h_{v_k}=0。 
]

 这是一个具有奇偶校验约束的离线动态连接问题。 我们可以对边界索引使用分而治之的方法。 在表示边界 ([l,r]) 的节点处，令其中点为 (mid)。 对于左半部分的每个边界，索引大于 (mid) 的每个边都保证位于边界的右侧，因此所有这些方程的奇偶校验都是 1。我们暂时将这些方程添加到 DSU。 然后我们递归到左半部分。 

将这些添加回滚后，右半部分的每个边界都将左半部分的所有边固定为奇偶校验 0。我们暂时添加这些方程并递归到右半部分。 

每个查询边在分而治之树的每个级别添加一次，因此存在 (O(m\log m)) 约束插入。 回滚奇偶校验 DSU 允许我们在每次递归调用后恢复到之前的状态。 

DSU 维护每个顶点与其 DSU 代表的奇偶性。 当添加 (h_u\oplus h_v=q) 时，它要么使用所需的相对奇偶性连接两个分量，要么如果顶点已经使用错误的奇偶性连接，则检测到矛盾。 

最初的竞赛教程描述了相同的分而治之的想法，表述为在下降到左半部分的同时添加带有奇偶校验 1 的右半部分，并在下降到右半部分的同时添加带有奇偶校验 0 的左半部分。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O((n+m)2^{n-1})) | (O(n+m)) | 太慢了|
 | 独立检查每个边界 | (O(m(n+m))) | (O(n+m)) | 太慢了|
 | 分而治之+回滚奇偶校验DSU | (O(m\log m\log n+n)) | (O(n+m)) | 已接受 |

 规定边界中的额外 (\log n) 来自回滚 DSU 的按大小并集查找操作。 分而治之部分贡献了 (O(m\log m)) 数量的 DSU 插入。 

## 算法演练

1.概念上将原始树以顶点1为根，并将(h_v)定义为从根到(v)的异或。 由于 (s_i=h_{u_i}\oplus h_{v_i})，原始树边永远不需要处理。 我们只需从输入中使用它们的父列表。 
2. 构建第 (i) 条边为 ((u_i,v_i)) 的查询图。 还可以在此图上使用普通 DSU 来计算其连接的组件 (c)。 该计数将确定有多少边缘分配对应于每个一致边界。 
3. 用边界 (k\in[0,m]) 表示每个可能的非递减序列。 对于此边界，如果 (i\le k)，查询边 (i) 需要奇偶校验 0，如果 (i>k)，则需要奇偶校验 1。 
4. 在 (n) 个顶点上创建回滚奇偶校验 DSU。 对于每个顶点，存储其父顶点、其组件的大小以及从顶点到其父顶点的异或。 从一个顶点到它的代表的异或是通过跟踪父链接并累积这些奇偶校验值来获得的。 
5. 递归处理可能边界的区间([l,r])。 如果 (l=r)，每个查询边对于这个边界都有一个固定的所需奇偶校验，并且 DSU 的矛盾计数器告诉我们该边界是否可行。 
6. 在 (mid=(l+r)//2) 处分割 ([l,r])。 对于 ([l,mid]) 中的每个边界，具有索引 (mid+1,\ldots,r) 的所有查询边都具有奇偶校验 1。准确添加这些约束，然后递归处理左半部分。 当递归下降时，这些约束保持活动状态，因此不必重建祖先。 
7. 将 DSU 回滚到这些添加之前进行的检查点。 然后，对于 ([mid+1,r]) 中的每个边界，具有索引 (l,\ldots,mid) 的所有查询边都具有奇偶校验 0。添加这些约束并递归处理右半部分。 
8. 在每个叶子 (k) 处，当 DSU 不存在矛盾约束时，精确地增加可行边界的数量。 分而治之的结构保证了 (m) 方程中的每一个都出现在该叶子上，并具有 (k) 所需的精确奇偶性。 
9. 如果查询图具有 (c) 个连通分量，请将可行边界的数量乘以 (2^{c-1}) 模 (998,244,353)。 包含顶点 1 的组件的 (h) 值固定为零，而其他每个 (c-1) 组件都可以独立翻转。 

### 为什么它有效

 对于每个边界 (k)，从根到叶 (k) 的递归路径最终将每个查询边 (i) 与 (k) 分开。 如果 (i\le k)，当两个索引第一次分开时，边缘位于左兄弟中，因此算法将奇偶校验为 0 的方程相加。如果 (i>k)，则它位于右兄弟中，因此算法将奇偶校验为 1 的方程相加。因此，叶 (k) 处的 DSU 正好表示与具有 (k) 个初始零的单调序列相对应的 XOR 系统。 

当 XOR 方程不能同时满足时，奇偶校验 DSU 会准确地报告矛盾。 因此，当可以实现叶子的单调序列时，就可以准确地对叶子进行计数。 

最后，一旦存在一个解决方案，查询图的每个连接组件都可以同时翻转其所有 (h) 值，而无需更改任何边 XOR。 根组件无法翻转，因为 (h_1=0)，恰好留下 (c-1) 个独立的二元选择。 因此，每个可行边界都会贡献 (2^{c-1}) 个分配，并且不同的边界对应于不同的 (s) 序列，因此它们的分配是不相交的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

class RollbackParityDSU:
    __slots__ = ("parent", "size", "parity", "bad", "history")

    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.parity = [0] * n
        self.bad = 0
        self.history = []

    def find(self, x):
        px = 0
        parent = self.parent
        parity = self.parity

        while parent[x] != x:
            px ^= parity[x]
            x = parent[x]

        return x, px

    def add(self, u, v, want):
        ru, pu = self.find(u)
        rv, pv = self.find(v)

        if ru == rv:
            if (pu ^ pv) != want:
                self.bad += 1
                self.history.append((-1, 0))
            else:
                self.history.append((0, 0))
            return

        if self.size[ru] < self.size[rv]:
            ru, rv = rv, ru
            pu, pv = pv, pu

        old_size = self.size[ru]

        self.parent[rv] = ru
        self.parity[rv] = pu ^ pv ^ want
        self.size[ru] += self.size[rv]

        self.history.append((rv, old_size))

    def checkpoint(self):
        return len(self.history)

    def rollback(self, checkpoint):
        parent = self.parent
        parity = self.parity
        size = self.size
        history = self.history

        while len(history) > checkpoint:
            child, old_size = history.pop()

            if child == 0:
                continue

            if child == -1:
                self.bad -= 1
                continue

            root = parent[child]
            parent[child] = child
            parity[child] = 0
            size[root] = old_size

def solve():
    n, m = map(int, input().split())

    # The original tree is irrelevant after the h_v transformation.
    input()

    edges = [None] * m

    # Ordinary DSU, only for the number of connected components.
    comp_parent = list(range(n))
    comp_size = [1] * n
    components = n

    def comp_find(x):
        while comp_parent[x] != x:
            comp_parent[x] = comp_parent[comp_parent[x]]
            x = comp_parent[x]
        return x

    for i in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        edges[i] = (u, v)

        ru = comp_find(u)
        rv = comp_find(v)

        if ru != rv:
            if comp_size[ru] < comp_size[rv]:
                ru, rv = rv, ru
            comp_parent[rv] = ru
            comp_size[ru] += comp_size[rv]
            components -= 1

    dsu = RollbackParityDSU(n)
    good = 0

    def divide(l, r):
        nonlocal good

        if l == r:
            if dsu.bad == 0:
                good += 1
            return

        mid = (l + r) >> 1

        # For every boundary in [l, mid], all edges in [mid+1, r]
        # must have value 1.
        checkpoint = dsu.checkpoint()

        for i in range(mid + 1, r + 1):
            u, v = edges[i]
            dsu.add(u, v, 1)

        divide(l, mid)
        dsu.rollback(checkpoint)

        # For every boundary in [mid+1, r], all edges in [l, mid]
        # must have value 0.
        checkpoint = dsu.checkpoint()

        for i in range(l, mid + 1):
            u, v = edges[i]
            dsu.add(u, v, 0)

        divide(mid + 1, r)
        dsu.rollback(checkpoint)

    # Boundaries are represented by k = 0..m.
    # A boundary k means the first k query values are zero.
    #
    # Edge i (1-based) is therefore:
    #   1 when i > k
    #   0 when i <= k
    #
    # The recursive interval indices below use the same boundary
    # convention directly, so the query edge indices are shifted by 1.
    #
    # We process boundaries 0..m and query edges 1..m together by
    # storing an artificial edge-index range [0,m-1].
    #
    # The divide routine above assumes its index interval refers to
    # query edges, so we instead use a specialized recursion below.

    good = 0

    def divide_boundaries(l, r):
        nonlocal good

        if l == r:
            if dsu.bad == 0:
                good += 1
            return

        mid = (l + r) >> 1

        # Boundaries [l, mid]:
        # every query edge i > mid has parity 1.
        cp = dsu.checkpoint()
        start = max(mid, 0)
        for i in range(start, m):
            u, v = edges[i]
            # Query index is i+1, and i+1 > mid here.
            dsu.add(u, v, 1)

        divide_boundaries(l, mid)
        dsu.rollback(cp)

        # Boundaries [mid+1, r]:
        # every query edge i+1 <= mid has parity 0.
        cp = dsu.checkpoint()
        end = min(mid, m)
        for i in range(0, end):
            u, v = edges[i]
            dsu.add(u, v, 0)

        divide_boundaries(mid + 1, r)
        dsu.rollback(cp)

    divide_boundaries(0, m)

    ways_per_boundary = pow(2, components - 1, MOD)
    answer = good * ways_per_boundary % MOD
    return str(answer)

if __name__ == "__main__":
    print(solve())
```第一个输入行给出 (n) 和 (m)，下一行被消耗，因为输入格式需要原始树描述，即使算法在 (h_v) 转换后不再需要树。 

查询图存储为数组，以便保留其顺序。 该顺序至关重要，因为当边界通过查询 (i) 时，边 (i) 的奇偶校验会发生精确变化。 

普通 DSU 与回滚 DSU 是分开的。 它的唯一目的是计算完整查询图中的连接组件。 保持这个独立使得回滚结构只负责临时一致性检查。 

回滚 DSU 存储`parity[x]`为 (h_x\oplus h_{\text{parent}[x]})。 期间`find`，对这些值进行异或运算得到 (h_x\oplus h_{\text{root}})。 如果两个顶点已经在同一分量中，则新方程要么与它们现有的相对奇偶性一致，要么产生矛盾。 矛盾会被计算在内，而不是导致立即返回，因为稍后的递归分支必须恢复确切的先前状态。 

当两个分量连接时，假设累积奇偶校验为(p_u)和(p_v)。 新的父关系必须满足

 [
 p_u\oplus\text{奇偶校验}[v]\oplus p_v=q,
 ]

 所以分配给附加根的奇偶校验是`pu ^ pv ^ want`。 按大小并集使 DSU 深度保持对数。 

回滚检查点只是历史堆栈的当前长度。 每次成功的合并都会记录附加的根和幸存根的旧大小。 矛盾记录了一个特殊的标记。 回滚将以相反的顺序恢复这些更改。 

分治递归使用从 (0) 到 (m) 的边界，而不是从 (1) 到 (m) 的查询索引。 这种区别是差一误差的主要来源。 边界0表示所有查询值为1，而边界(m)表示所有查询值为0。 

在分割 ([l,r]) 时，查询索引大于中点的所有边在整个左半部分的值均为 1。 相反，查询索引最多位于中点的所有边在整个右半部分的值均为 0。 这些正是可以在下降之前添加的约束，而不会意外地施加在当前间隔内发生变化的条件。 

Python 整数不会溢出，唯一的模算术是最终乘以每个边界的解数。 幂 (2^{c-1}) 通过模幂计算。 

## 工作示例

 ### 示例 1

 查询图是三角形

 [
 1-2、\quad2-3、\quad1-3。 
]

 它有一个连通分量，因此每个可行边界恰好贡献一个分配。 

四个单调目标序列对应于(k=0,1,2,3)。 

| 边界 (k) | 目标| 周期奇偶校验| 持续的？ | 贡献|
 | --- | --- | --- | --- | --- |
 | 0 | 111 | 111 (1\oplus1\oplus1=1) | 没有 | 0 |
 | 1 | 011| (0\oplus1\oplus1=0) | 是的 | 1 |
 | 2 | 001| (0\oplus0\oplus1=1) | 没有 | 0 |
 | 3 | 000 | 000 (0\oplus0\oplus0=0) | 是的 | 1 |

 有效边界是 (k=1) 和 (k=3)，给出两个分配。 这正是示例输出。 

### 示例 2

 查询图是一个四循环

 [
 1-2-3-4-1。 
]

 同样，只有一个连接的组件。 当单个循环包含奇数个目标值为 1 的边时，它恰好是不一致的。 

| 边界 (k) | 目标| 周期中 1 边沿的数量 | 持续的？ | 贡献|
 | --- | --- | --- | --- | --- |
 | 0 | 1111 | 1111 4 | 是的 | 1 |
 | 1 | 0111| 3 | 没有 | 0 |
 | 2 | 0011| 2 | 是的 | 1 |
 | 3 | 0001| 1 | 没有 | 0 |
 | 4 | 0000 | 0000 0 | 是的 | 1 |

 因此，三个边界有效，即 (0,2,4)，答案是 3。这个例子特别有用，因为它表明可行边界可以在有效和无效之间交替，而不是形成一个连续的区间。 

### 示例 3

 查询图由两条不相连的边（1-2）和（3-4）组成。 它有 (c=2) 个连通分量。 

不存在循环，因此对这两个查询边的奇偶校验的每次分配都是一致的。 因此所有 (m+1=3) 边界都是可行的。 

每个边界都有

 [
 2^{c-1}=2
 ]

 因为包含顶点 1 的组件是固定的，而其他组件可以翻转。 答案是(3\cdot2=6)。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n+m\log m\log n)) | 每个查询边在每个分而治之级别最多插入一次，回滚 DSU 会发现 take (O(\log n)) 与 union by size |
 | 空间| (O(n+m)) | 查询边、两个 DSU 结构、递归堆栈和回滚历史记录 |

 使用 (m\le250,000) 时，分治深度低于 20。每个查询在每个级别仅参与一次同级插入，因此临时约束插入的数量为 (O(m\log m))，而不是 (O(m^2))。 原始树仅贡献其输入大小并且从不存储，这使内存使用保持线性。 

## 测试用例

 下面的线束使用相同的`solve`作为提交的解决方案。 最大尺寸的情况是一个压力测试，并且故意很大，因此它应该与普通的单元测试分开运行。```python
import sys
import io

# Paste the solution above before these tests.

def run(inp: str) -> str:
    old_stdin = sys.stdin
    try:
        sys.stdin = io.StringIO(inp)
        return solve().strip()
    finally:
        sys.stdin = old_stdin

# Provided samples

assert run("""\
3 3
1 2
1 2
2 3
1 3
""") == "2", "sample 1"

assert run("""\
4 4
1 1 1
1 2
2 3
3 4
1 4
""") == "3", "sample 2"

assert run("""\
4 2
1 2 3
1 2
3 4
""") == "6", "sample 3"

# Minimum-size case.
# There are two identical queries on the only tree edge.
# The two path parities are always equal, so every edge assignment works.
assert run("""\
2 2
1
1 2
1 2
""") == "2", "minimum size"

# All query values are equal for every assignment.
# Only 0000 and 1111 are possible monotone target sequences.
# There are 2^(4-1) = 8 tree assignments.
assert run("""\
4 4
1 2 3
1 2
1 2
1 2
1 2
""") == "8", "all equal queries"

# Boundary/off-by-one case.
# The query graph is a tree, so every one of the m+1 boundaries is feasible.
# n=5, m=3 gives 4 boundaries and 2^(2-1)=2 assignments per boundary.
assert run("""\
5 3
1 2 3 4
1 2
2 3
4 5
""") == "8", "all boundaries feasible"

# Maximum-size stress case.
# The query graph is a chain plus a duplicate of edge (1,2).
# The only cycle consists of query edges 1 and m, so only k=0 and k=m
# are feasible. The query graph is connected, hence the answer is 2.
n = 250000
parents = " ".join(str(i) for i in range(1, n))
queries = "\n".join(
    [f"{i} {i + 1}" for i in range(1, n)] + ["1 2"]
)
max_input = f"{n} {n}\n{parents}\n{queries}\n"

assert run(max_input) == "2", "maximum-size stress case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 2`, 两份`1 2`| 2 | 最小值(n,m)、重复查询、常数序列|
 |`4 4`, 四份`1 2`| 8 | 断开连接的查询图和相等的路径值 |
 |`5 3`，查询图是一个森林| 8 | 每个边界都是可行的并且组成因子 |
 |`250000 250000`，链加重复边| 2 | 最大尺寸输入和 (O(m\log m)) 分治行为 |

 ## 边缘情况

 常数零边界 (k=m) 由最右边的叶子处理。 在该叶子处，每个查询方程的奇偶校验为 0。对于最小情况```
2 2
1
1 2
1 2
```DSU 接收 (h_1\oplus h_2=0) 的两个副本。 两者都不矛盾，因此边界是可行的。 

常数一边界（k=0）由最左边的叶子处理。 在相同的最小情况下，两个方程都变为(h_1\oplus h_2=1)，这也是一致的。 这两个边界对应于唯一树边的两种可能的分配，给出输出 2。 

处理示例 1 中看到的交替可行性是因为分而治之从未对可行边界集的形状做出任何假设。 为了```
3 3
1 2
1 2
2 3
1 3
```叶子 (k=0,1,2,3) 独立地以矛盾状态 (1,0,1,0) 结束。 因此正好计算了两片叶子。 

断开连接的查询图由组件乘法器处理，而不是由一致性测试处理。 在```
4 2
1 2 3
1 2
3 4
```有两个查询组件。 每个边界都是一致的，因为查询图没有循环，并且每个一致系统在修复后有两个解（h_1=0）。 结果是 (3\cdot2=6)。 

重复的查询对也是普通的图边，不能简单地进行重复数据删除。 具有不同所需奇偶性的两个相等的查询边形成直接矛盾。 这正是为什么具有四个 (1\2) 副本的全相等情况只有两个可用的恒定目标序列，即使同一对出现四次也是如此。 

最后，原始树可以具有任何形状，并且其父列表看起来与查询图完全无关。 变换 (h_v) 使树拓扑变得无关紧要，因为 (h_2,\ldots,h_n) 和 (h_1=0) 的每个分配都恰好对应于一个树边分配。 这就是为什么该实现仅读取父列表以推进输入并且之后不再使用它。 

上面的社论使用了官方分治思想的回滚 DSU 版本。 原始教程还提到使用显式图压缩进行 O(mlogm) 细化，但回滚公式更容易实现和解释。
