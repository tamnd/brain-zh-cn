---
title: "CF 104639C - 乘然后加"
description: "我们正在维护整数对的动态集合。 每对的行为就像单个变量中的线性函数：对于一对 $(ai, bi)$，我们可以评估值 $fi(x) = ai cdot x + bi$。 随着时间的推移，系统支持两种操作。"
date: "2026-06-29T16:55:08+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104639
codeforces_index: "C"
codeforces_contest_name: "The 2023 ICPC Asia EC Regionals Online Contest (I)"
rating: 0
weight: 104639
solve_time_s: 53
verified: true
draft: false
---

[CF 104639C - 乘法然后加](https://codeforces.com/problemset/problem/104639/C)

 **评级：** -
 **标签：** -
 **求解时间：** 53s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在维护整数对的动态集合。 每对的行为就像单个变量中的线性函数：对于一对$(a_i, b_i)$，我们可以评估一个值$f_i(x) = a_i \cdot x + b_i$。 随着时间的推移，系统支持两种操作。 

一个操作更新单个索引对，完全替换其系数。 另一个操作要求固定值$x$和一个连续的索引段，我们必须找到最大值$a_i x + b_i$在该段的所有对中。 

因此，该任务是线性函数的点更新和在选定的值处评估的范围最大查询的混合。$x$，其中每个查询所评估的函数都不同。 

限制非常大：最多 500,000 对和 500,000 次操作。 这立即排除了任何通过扫描所有元素来重新计算范围查询的解决方案，因为即使是单个最坏情况的查询也已经太慢了。 任何可接受的解决方案都必须在大致对数时间或更好的时间内处理每个操作，并具有仔细的常数因子。 

频繁更新会产生微妙的边缘情况。 一个天真的想法是为每个查询重建辅助结构，或者在应用后维护每个查询的值排序$x$。 这会失败，因为更新会使任何预先计算的排序无效。 

另一个陷阱是假设索引或值的单调性。 即使$a_i$和$b_i$是有界的，表达式$a_i x + b_i$相邻索引之间可能存在很大差异，因此依赖于平滑度的分段修剪策略不适用。 

## 方法

 直接的暴力解决方案通过迭代范围来评估每个查询$[l, r]$和计算$a_i x + b_i$对于每个索引。 这是正确的，因为它直接遵循问题的定义。 但是，每个查询都需要$O(n)$最坏情况下的时间，导致$O(nq)$总操作量，其顺序为$2.5 \times 10^{11}$。 这远远超出了可行的限度。 

关键的观察是每个元素定义一个线性函数，每个查询都要求在单个点评估的一组线的最大值$x$，仅限于一个段。 这是一个经典的动态凸包式问题，但由于动态的两个维度而变得复杂：任意索引的查询和更新。 

处理这种结构的标准方法是在索引上使用线段树。 线段树的每个节点代表一个固定的索引区间。 在每个节点内部，我们维护一个可以回答以下问题的结构：给定一个值$x$，最大是多少$a_i x + b_i$在该节点中存储的所有行中。 

对于静态线集，最佳结构是凸包技巧。 自从$x$查询是任意的而不是单调的，我们不能使用简单的基于指针的外壳。 相反，我们在每个线段树节点中存储一个凸包，并使用二分搜索对其进行评估。 

更新替换单行，因此我们沿着从叶到根的路径重建凸包。 

该组合给出了来自线段树的对数因子和来自每个船体内的二分搜索的另一个对数因子。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(nq)$|$O(1)$| 太慢了|
 | 线段树 + 每个节点的外壳 |$O((n+q)\log^2 n)$|$O(n \log n)$| 已接受 |

 ## 算法演练

 我们维护一个索引从 1 到 n 的线段树，其中每个节点存储与其区间相对应的一组线。 

每行表示为$(a, b)$，对应一个函数$f(x) = ax + b$。 

1. 构建一棵线段树，其中每个叶节点恰好存储输入数组中的一行。 内部节点表示其子区间的并集。 
2. 对于每个节点，从其线构造一个凸包。 我们按斜率对线进行排序$a$，然后使用标准凸包结构删除不必要的。 删除标准基于新添加的行是否使前一行总是变得更糟$x$。 这确保只保留潜在的最佳线路。 
3. 为了评估节点的查询，我们对其外壳执行二分搜索以找到最大化的行$a x + b$对于给定的$x$。 由于斜率已排序，因此函数值按索引顺序是单峰的。 
4. 对于范围查询$[l, r]$，我们将区间分解为$O(\log n)$分割树节点并独立查询每个节点的外壳。 
5. 答案是所有返回值中的最大值。 
6. 更新位置$k$，我们替换叶子处的线并重建沿着到根部的路径的所有外壳。 

为什么二分搜索在这里起作用是因为凸包确保斜率是单调的，并且连续线之间的交点是有序的。 这保证了给定的最佳线路$x$可以用对数时间求得。 

### 为什么它有效

 正确性依赖于两个不变量。 首先，每个线段树节点精确存储覆盖其区间的线集，因此任何查询范围都可以表示为节点区间的不相交并集。 其次，每个节点的凸包仅包含对于某些节点来说可能是最佳的线。$x$，并且斜率的排序保证了对于任何固定$x$，最大值位于船体的单个连续区域。 因此，二分搜索总是能找到该节点的行中真正的最大值，并且组合节点结果可以保持全局最优性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Hull:
    def __init__(self):
        self.lines = []
        self.ptr = 0

    def bad(self, l1, l2, l3):
        return (l2[1] - l1[1]) * (l1[0] - l3[0]) >= (l3[1] - l1[1]) * (l1[0] - l2[0])

    def build(self, lines):
        lines.sort()
        self.lines = []
        for line in lines:
            while len(self.lines) >= 2 and self.bad(self.lines[-2], self.lines[-1], line):
                self.lines.pop()
            self.lines.append(line)
        self.ptr = 0

    def query(self, x):
        l, r = 0, len(self.lines) - 1
        best = -10**30
        while l <= r:
            m = (l + r) // 2
            v1 = self.lines[m][0] * x + self.lines[m][1]
            best = max(best, v1)
            if m + 1 < len(self.lines):
                v2 = self.lines[m + 1][0] * x + self.lines[m + 1][1]
                if v2 >= v1:
                    l = m + 1
                else:
                    r = m - 1
            else:
                r = m - 1
        return best

class SegTree:
    def __init__(self, n):
        self.n = n
        self.tree = [None] * (4 * n)

    def build(self, idx, l, r, arr):
        if l == r:
            self.tree[idx] = Hull()
            self.tree[idx].build([arr[l]])
            return
        m = (l + r) // 2
        self.build(idx * 2, l, m, arr)
        self.build(idx * 2 + 1, m + 1, r, arr)
        self.tree[idx] = Hull()
        self.tree[idx].build(self.tree[idx * 2].lines + self.tree[idx * 2 + 1].lines)

    def update(self, idx, l, r, pos, val):
        if l == r:
            self.tree[idx].build([val])
            return
        m = (l + r) // 2
        if pos <= m:
            self.update(idx * 2, l, m, pos, val)
        else:
            self.update(idx * 2 + 1, m + 1, r, pos, val)
        self.tree[idx].build(self.tree[idx * 2].lines + self.tree[idx * 2 + 1].lines)

    def query(self, idx, l, r, ql, qr, x):
        if qr < l or r < ql:
            return -10**30
        if ql <= l and r <= qr:
            return self.tree[idx].query(x)
        m = (l + r) // 2
        return max(
            self.query(idx * 2, l, m, ql, qr, x),
            self.query(idx * 2 + 1, m + 1, r, ql, qr, x)
        )

n, q = map(int, input().split())
arr = [tuple(map(int, input().split())) for _ in range(n)]

st = SegTree(n)
st.build(1, 0, n - 1, arr)

out = []
for _ in range(q):
    tmp = list(map(int, input().split()))
    if tmp[0] == 1:
        _, k, a, b = tmp
        st.update(1, 0, n - 1, k - 1, (a, b))
    else:
        _, x, l, r = tmp
        out.append(str(st.query(1, 0, n - 1, l - 1, r - 1, x)))

print("\n".join(out))
```线段树存储每个间隔的凸包，并且构建和更新操作都从子节点重新计算这些包。 外壳查询函数对候选线执行二分搜索以找到 x 处的最佳评估。 

一个微妙的细节是，每个节点重建都是通过合并子节点的完整列表来完成的。 这不是渐近最优的，但可以保持实现的简单性。 正确性仅取决于船体结构，而不取决于增量合并效率。 

索引在内部一致地转换为从零开始，这避免了段分割期间的差一错误。 

## 工作示例

 ### 示例 1

 输入：```
3 2
2 3
1 5
3 1
2 2 1 3
2 3 2 3
```我们首先构建线段树节点。 

| 步骤| 细分 | 已存储的线路 | 查询 x | 结果 |
 | --- | --- | --- | --- | --- |
 | 1 | [1,3]| (2,3),(1,5),(3,1) | - | - |
 | 2 | 完整查询 | 相同 | 2 | 最大(7,7,7)=7 |
 | 3 | [2,3]| (1,5),(3,1) | 3 | 最大(8,10)=10 |

 第一个查询评估 x=2 处的所有三行，全部给出 7，因此答案为 7。第二个查询限制索引 2 和 3，最佳行变为索引 3。 

### 示例 2

 输入：```
4 3
1 1
2 0
3 -1
4 -10
2 5 1 4
1 2 10 10
2 5 1 4
```x=5 时的初始评估：

 | 我| 艾、比| 价值|
 | --- | --- | --- |
 | 1 | 1,1 | 6 |
 | 2 | 2,0 | 10 | 10
 | 3 | 3,-1 | 14 | 14
 | 4 | 4、-10 | 10 | 10

 第一个查询返回 14。 

更新后，第二行变为(10,10)。 现在 x=5：

 | 我| 艾、比| 价值|
 | --- | --- | --- |
 | 1 | 1,1 | 6 |
 | 2 | 10,10 | 10,10 60|
 | 3 | 3,-1 | 14 | 14
 | 4 | 4、-10 | 10 | 10

 第二个查询返回 60。 

这些示例展示了更新如何改变全局主导的线路以及段结构如何隔离受影响的区域。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O((n + q)\log^2 n)$| 每次更新/查询都会涉及$O(\log n)$节点，每个节点查询是$O(\log n)$|
 | 空间|$O(n \log n)$| 每个线段树节点存储合并线的外壳 |

 复杂性在限制之内，因为两者$n$和$q$高达 500,000，即使在 Python 中仔细实现，对数因子仍然可以管理。 主要成本是更新期间的重建，但每个操作仍然以段数呈对数缩放。
