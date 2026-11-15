---
title: "CF 484E - 围栏上的标志"
description: "我们有一个由一系列高度表示的栅栏。 必须将矩形标志放置在一些连续面板的顶部。 该标志具有固定宽度 w，因此它必须恰好覆盖 w 个连续的栅栏板。"
date: "2026-06-07T17:25:15+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "constructive-algorithms", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 484
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 276 (Div. 1)"
rating: 2500
weight: 484
solve_time_s: 199
verified: true
draft: false
---

[CF 484E - 在围栏上签名](https://codeforces.com/problemset/problem/484/E)

 **评分：** 2500
 **标签：** 二分查找、构造算法、数据结构
 **求解时间：** 3m 19s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个由一系列高度表示的栅栏。 必须将矩形标志放置在一些连续面板的顶部。 标志有固定宽度`w`，所以它必须完全覆盖`w`连续的栅栏板。 它的高度不能超过被覆盖的面板中最短的面板，否则标志的一部分会伸出栅栏上方。 

对于查询`(l, r, w)`，我们可以选择任意连续的块`w`面板完全包含在间隔内`[l, r]`。 如果我们把标志放在一块上`[x, x+w-1]`，最大可能的符号高度等于$$\min(h_x,h_{x+1},\ldots,h_{x+w-1}).$$在所有有效的展示位置中`[l,r]`，我们想要最大的这样的值。 

同样，每个查询都会询问：$$\max_{x \in [l,r-w+1]} \min(h_x,\ldots,h_{x+w-1}).$$栅栏最多包含$10^5$面板，最多有$10^5$查询。 任何直接扫描查询间隔的算法都是没有希望的。 甚至一个$O((r-l+1)\log n)$每个查询的解决方案可能需要大约$10^{10}$最坏情况下的操作。 

这些约束表明所有查询必须一起处理。 周围的复杂性$O((n+m)\log^2 n)$或者$O((n+m)\log n)$是合适的。 

一个微妙的方面是，答案不是整个区间的最小高度。 我们可以自由选择宽度-`w`标志已放置。 

考虑：```
heights = [5,1,5]
query = (1,3,1)
```答案是`5`，因为宽度`1`允许选择任一端点。 简单地采用最小值的解决方案`[1,3]`会错误地返回`1`。 

另一个常见的错误是忘记标志宽度是固定的。```
heights = [4,4,1,4]
query = (1,4,3)
```有效的窗口是`[4,4,1]`和`[4,1,4]`，两者都具有最小值`1`。 答案是`1`，即使存在一个较短的最小窗口`4`。 

当必须使用整个间隔时，会出现第三种边缘情况。```
heights = [7,3,5]
query = (1,3,3)
```只有一个位置存在，所以答案是区间最小值，即`3`。 

最佳解决方案必须正确处理所有这些情况。 

## 方法

 最直接的解决方案评估标志的每一个可能的位置。 对于查询`(l,r,w)`，我们检查所有起始位置`l`到`r-w+1`。 对于每个宽度 -`w`窗口我们计算其最小高度并取最大值。 

这是正确的，因为它明确检查每个合法标志的位置。 

问题是运行时间。 查询间隔可能包含$O(n)$候选窗口。 即使范围最小结构给出每个窗口的最小值$O(1)$，单个查询仍然需要花费$O(n)$。 和$10^5$查询，最坏的情况变成$10^{10}$运营。 

关键的观察是停止直接思考答案，而是提出一个决策问题：

 对于高度阈值$H$，是否存在宽度-`w`挡在里面`[l,r]`每个面板的高度至少$H$？ 

如果我们至少标记每个位置的高度$H$当处于活动状态时，问题变为：

 内部是否有连续的活动段`[l,r]`至少长度`w`？ 

这将原来的优化问题转化为单调决策问题。 如果身高$H$有效，每个较小的高度也有效。 这种单调性表明二分搜索。 

然而，为每个查询独立进行二进制搜索仍然太昂贵。 标准技巧是并行二分搜索。 

对于固定阈值$H$，我们激活所有高度至少为$H$。 那么我们需要一个可以回答的数据结构：

 区间内`[l,r]`，连续活动段的最大长度是多少？ 

这可以通过存储线段树来维护：

 - 最长的活动前缀
 - 最长的活跃后缀
 - 最长的活动段
 - 间隔长度

 由于高度按降序激活，因此更新是点分配。 

并行二分搜索将当前测试相同高度排名的所有查询分组在一起。 在一次高度扫描期间，我们激活面板并评估所有这些查询。 每个查询只需要$O(\log n)$每轮二分搜索线段树的工作量。 

由此产生的复杂性变成$O((n+m)\log^2 n)$，穿着舒适。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(mn)$|$O(1)$| 太慢了|
 | 最佳 |$O((n+m)\log^2 n)$|$O(n+m)$| 已接受 |

 ## 算法演练

 首先压缩候选答案。 每个查询的答案必须等于围栏高度之一，因为增加标志高度只会改变通过面板高度时的可行性。 

让不同的高度按降序排序。 

### 1. 为每个查询初始化一个二分搜索范围

 为每个查询维护索引`low`和`high`进入排序的不同高度。 

最初每个高度都是可能的，所以：`low = 0`

`high = number_of_distinct_heights - 1`### 2. Repeatedly perform one round of parallel binary search

 对于每个未解决的查询计算$$mid = \frac{low+high}{2}.$$按当前中点对查询进行分组。 

同一组中的所有查询都询问特定的高度阈值是否可行。 

### 3. 扫描高度从最大到最小

 按高度降序对围栏位置进行排序。 

按阈值降序处理中点组。 

每当当前阈值降低时，激活高度至少为该阈值的所有栅栏位置。 

The active set exactly represents panels that can support a sign of that height.

 ### 4. Maintain active segments in a segment tree

 每片叶子对应一个面板。 

非活动面板存储：

 - 前缀=0
 - 后缀=0
 - 最好= 0

 活动面板存储：

 - 前缀=1
 - 后缀=1
 - 最好= 1

 当两个孩子合并时：$$prefix = \begin{cases} left.length + right.prefix & \text{if left is completely active}\\ left.prefix & \text{otherwise} \end{cases}$$后缀是对称计算的。 

最佳分段是以下各项中的最大值：

 - 左最佳
 - 正确.最佳
 - 左后缀 + 右前缀

 ### 5. 回答可行性询问

 供查询`(l,r,w)`获取线段树信息`[l,r]`。 

领域`best`等于该间隔内最长的连续活跃跑步。 

阈值在以下情况下是可行的：$$best \ge w.$$如果可行，将二分搜索移向更高的高度。 

否则将其移向较小的高度。 

### 6. 继续直到所有搜索完成

 大约之后`log(number_of_distinct_heights)`一轮中，每个查询都会收敛到一个高度值。 

### 7.输出对应的高度

 最终的二分搜索位置确定了最大的可行阈值，这正是答案。 

### 为什么它有效

 固定阈值$H$。 宽度-`w`至少高度的符号$H$存在于里面`[l,r]`当且仅当有`w`该区间内的连续面板的高度至少都是$H$。 

准确激活那些高度至少为$H$，当且仅当区间至少包含有效游程时，这样的符号才存在`w`。 

线段树计算每个查询间隔中最长的活动运行，因此可行性测试是正确的。 

可行性是单调的。 如果有一个阈值$H$是可行的，每个较小的阈值也是可行的，因为激活更多面板不会破坏现有的有效运行。 因此，二分搜索找到最大的可行阈值。 并行二分搜索同时评估许多此类搜索，同时重用相同的激活扫描。 因此，每个报告值恰好是可实现的最大标志高度。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, n):
        self.n = n
        self.pref = [0] * (4 * n)
        self.suff = [0] * (4 * n)
        self.best = [0] * (4 * n)
        self.length = [0] * (4 * n)
        self._build(1, 0, n - 1)

    def _build(self, v, tl, tr):
        self.length[v] = tr - tl + 1
        if tl == tr:
            return
        tm = (tl + tr) // 2
        self._build(v * 2, tl, tm)
        self._build(v * 2 + 1, tm + 1, tr)

    def _pull(self, v):
        lc = v * 2
        rc = lc + 1

        self.pref[v] = self.pref[lc]
        if self.pref[lc] == self.length[lc]:
            self.pref[v] += self.pref[rc]

        self.suff[v] = self.suff[rc]
        if self.suff[rc] == self.length[rc]:
            self.suff[v] += self.suff[lc]

        self.best[v] = max(
            self.best[lc],
            self.best[rc],
            self.suff[lc] + self.pref[rc]
        )

    def update(self, v, tl, tr, pos):
        if tl == tr:
            self.pref[v] = 1
            self.suff[v] = 1
            self.best[v] = 1
            return

        tm = (tl + tr) // 2
        if pos <= tm:
            self.update(v * 2, tl, tm, pos)
        else:
            self.update(v * 2 + 1, tm + 1, tr, pos)

        self._pull(v)

    def query(self, v, tl, tr, l, r):
        if l == tl and r == tr:
            return (
                self.pref[v],
                self.suff[v],
                self.best[v],
                self.length[v]
            )

        tm = (tl + tr) // 2

        if r <= tm:
            return self.query(v * 2, tl, tm, l, r)

        if l > tm:
            return self.query(v * 2 + 1, tm + 1, tr, l, r)

        left = self.query(v * 2, tl, tm, l, tm)
        right = self.query(v * 2 + 1, tm + 1, tr, tm + 1, r)

        lp, ls, lb, ll = left
        rp, rs, rb, rl = right

        pref = lp
        if lp == ll:
            pref += rp

        suff = rs
        if rs == rl:
            suff += ls

        best = max(lb, rb, ls + rp)

        return (pref, suff, best, ll + rl)

def solve():
    n = int(input())
    h = list(map(int, input().split()))

    m = int(input())

    queries = []
    for _ in range(m):
        l, r, w = map(int, input().split())
        queries.append((l - 1, r - 1, w))

    vals = sorted(set(h), reverse=True)
    k = len(vals)

    low = [0] * m
    high = [k - 1] * m

    positions = sorted(
        [(h[i], i) for i in range(n)],
        reverse=True
    )

    while True:
        buckets = [[] for _ in range(k)]
        active = False

        for i in range(m):
            if low[i] < high[i]:
                active = True
                mid = (low[i] + high[i]) // 2
                buckets[mid].append(i)

        if not active:
            break

        seg = SegTree(n)

        ptr = 0

        for mid in range(k):
            threshold = vals[mid]

            while ptr < n and positions[ptr][0] >= threshold:
                seg.update(1, 0, n - 1, positions[ptr][1])
                ptr += 1

            for qi in buckets[mid]:
                l, r, w = queries[qi]
                best = seg.query(1, 0, n - 1, l, r)[2]

                if best >= w:
                    high[qi] = mid
                else:
                    low[qi] = mid + 1

    ans = [str(vals[low[i]]) for i in range(m)]
    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```线段树准确地存储了合并连续活动运行所需的信息。 这`best`value 是节点间隔内最长的活动段。 前缀和后缀长度允许重建穿过中点的游程。 

二分搜索是在不同的高度上执行的，而不是在整个范围内执行$10^9$。 这将搜索深度减少到大约`log2(n)`。 

一个常见的实现错误是二分搜索方向向后。 高度数组`vals`按降序排序。 较小的索引对应于较大的高度。 当阈值可行时，我们继续搜索更大的高度，这意味着将上限移动到`mid`。 

另一个微妙之处是每轮并行二值搜索都会重建线段树。 每一轮都代表对阈值的新扫描，因此必须从头开始重建活动集。 

## 工作示例

 ### 示例 1

 输入：```
5
1 2 2 3 3
1
2 5 3
```不同的高度是`[3,2,1]`。 

| 中高| 活跃职位 | 查询间隔| 最长的活跃跑步| 可行|
 | ---| ---| ---| ---| ---|
 | 2 | 2,3,4,5 | [2,5]| 4 | 是的 |
 | 3 | 4,5 | [2,5]| 2 | 没有 |

 二分查找首先验证高度`2`作品。 然后测试高度`3`，这失败了，因为只有两个连续的面板的高度至少`3`。 答案是`2`。 

这证明了单调性。 一次`3`失败，每个更大的阈值也必须失败。 

### 示例 2

 输入：```
4
5 1 5 5
1
1 4 2
```不同的高度是`[5,1]`。 

| 中高| 活跃职位 | 查询间隔| 最长的活跃跑步| 可行|
 | ---| ---| ---| ---| ---|
 | 5 | 1,3,4 | [1,4]| 2 | 是的 |

 主动运行`[3,4]`有长度`2`，因此可以将宽度为 2 的符号与高度一起放置`5`。 

这个例子说明了为什么我们需要最长的连续运行而不是简单地计算活动面板。 存在三个活动面板，但只有两个相邻。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O((n+m)\log^2 n)$| 关于$\log n$并行二分搜索轮次，每轮执行$O(n+m)$线段树操作 |
 | 空间|$O(n+m)$| 线段树、查询、二分搜索状态 |

 和$n,m \le 10^5$,$\log n$大约为 17。生成的操作计数完全在 4 秒限制内，并且完全符合内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    class SegTree:
        def __init__(self, n):
            self.n = n
            self.pref = [0] * (4 * n)
            self.suff = [0] * (4 * n)
            self.best = [0] * (4 * n)
            self.length = [0] * (4 * n)
            self.build(1, 0, n - 1)

        def build(self, v, l, r):
            self.length[v] = r - l + 1
            if l == r:
                return
            m = (l + r) // 2
            self.build(v * 2, l, m)
            self.build(v * 2 + 1, m + 1, r)

        def pull(self, v):
            lc = v * 2
            rc = lc + 1

            self.pref[v] = self.pref[lc]
            if self.pref[lc] == self.length[lc]:
                self.pref[v] += self.pref[rc]

            self.suff[v] = self.suff[rc]
            if self.suff[rc] == self.length[rc]:
                self.suff[v] += self.suff[lc]

            self.best[v] = max(
                self.best[lc],
                self.best[rc],
                self.suff[lc] + self.pref[rc]
            )

        def update(self, v, l, r, pos):
            if l == r:
                self.pref[v] = self.suff[v] = self.best[v] = 1
                return
            m = (l + r) // 2
            if pos <= m:
                self.update(v * 2, l, m, pos)
            else:
                self.update(v * 2 + 1, m + 1, r, pos)
            self.pull(v)

        def query(self, v, l, r, ql, qr):
            if ql == l and qr == r:
                return (self.pref[v], self.suff[v], self.best[v], self.length[v])

            m = (l + r) // 2

            if qr <= m:
                return self.query(v * 2, l, m, ql, qr)
            if ql > m:
                return self.query(v * 2 + 1, m + 1, r, ql, qr)

            A = self.query(v * 2, l, m, ql, m)
            B = self.query(v * 2 + 1, m + 1, r, m + 1, qr)

            ap, asf, ab, al = A
            bp, bsf, bb, bl = B

            pref = ap + bp if ap == al else ap
            suff = bsf + asf if bsf == bl else bsf
            best = max(ab, bb, asf + bp)

            return (pref, suff, best, al + bl)

    out = []

    n = int(input())
    h = list(map(int, input().split()))
    m = int(input())

    qs = [tuple(map(int, input().split())) for _ in range(m)]

    vals = sorted(set(h), reverse=True)
    k = len(vals)

    lo = [0] * m
    hi = [k - 1] * m

    pos = sorted([(h[i], i) for i in range(n)], reverse=True)

    while True:
        buckets = [[] for _ in range(k)]
        alive = False

        for i in range(m):
            if lo[i] < hi[i]:
                alive = True
                md = (lo[i] + hi[i]) // 2
                buckets[md].append(i)

        if not alive:
            break

        seg = SegTree(n)
        ptr = 0

        for md in range(k):
            thr = vals[md]

            while ptr < n and pos[ptr][0] >= thr:
                seg.update(1, 0, n - 1, pos[ptr][1])
                ptr += 1

            for qi in buckets[md]:
                l, r, w = qs[qi]
                best = seg.query(1, 0, n - 1, l - 1, r - 1)[2]

                if best >= w:
                    hi[qi] = md
                else:
                    lo[qi] = md + 1

    return "\n".join(str(vals[lo[i]]) for i in range(m))

# provided sample
assert run(
"""5
1 2 2 3 3
3
2 5 3
2 5 2
1 5 5
"""
) == "2\n3\n1"

# minimum size
assert run(
"""1
7
1
1 1 1
"""
) == "7"

# all equal
assert run(
"""4
5 5 5 5
2
1 4 2
2 3 1
"""
) == "5\n5"

# width equals interval length
assert run(
"""3
7 3 5
1
1 3 3
"""
) == "3"

# separated tall panels
assert run(
"""4
5 1 5 5
1
1 4 2
"""
) == "5"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单面板| 7 | 最小的法律实例|
 | 所有高度均相等 | 5, 5 | 统一高度行为 |
 | 宽度等于间隔长度| 3 | 只有一种可能的安置 |
 |`5 1 5 5`宽度为 2 | 5 | 连续运行逻辑而不是计算活动面板 |

 ## 边缘情况

 考虑：```
3
5 1 5
1
1 3 1
```答案是`5`。 阈值期间`5`，位置 1 和 3 处于活动状态。 最长的活跃跑步时间`[1,3]`是`1`，已经满足宽度`1`。 二分查找正确返回`5`。 使用间隔最小值的解决方案将错误地返回`1`。 

考虑：```
4
4 4 1 4
1
1 4 3
```对于阈值`4`，主动运行有长度`2`和`1`。 最长的行程只有`2`，小于所需宽度`3`，所以阈值失败。 对于阈值`1`，所有位置都变为活跃状态，并且最长的运行变为`4`，所以答案是`1`。 该算法正确地执行了固定宽度的要求。 

考虑：```
3
7 3 5
1
1 3 3
```处于阈值`5`，活跃位置是`{1,3}`最长的运行时间是`1`，所以可行性失败。 处于阈值`3`，每个位置都是活跃的，最长的运行变成`3`，完全匹配所需的宽度。 答案是`3`，这是整个区间的最小高度。
