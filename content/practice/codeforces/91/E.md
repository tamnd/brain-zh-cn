---
title: "CF 91E - 冰屋摩天大楼"
description: "每只海象都会建造一座摩天大楼，其高度随时间线性变化。 海象 i 从高度 a[i] 开始，每分钟增加 b[i] 层楼，因此在时间 t 时，其高度等于： $$hi(t) = ai + bi cdot t$$ 对于每个查询 [l, r, t]，我们必须在该区间内找到一个索引，其…"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "geometry"]
categories: ["algorithms"]
codeforces_contest: 91
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 75 (Div. 1 Only)"
rating: 2500
weight: 91
solve_time_s: 164
verified: true
draft: false
---

[CF 91E - 冰屋摩天大楼](https://codeforces.com/problemset/problem/91/E)

 **评分：** 2500
 **标签：** 数据结构、几何
 **求解时间：** 2m 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每只海象都会建造一座摩天大楼，其高度随时间线性变化。 海象`i`从身高开始`a[i]`和收获`b[i]`每分钟楼层数，所以在时间`t`它的高度等于：$$h_i(t) = a_i + b_i \cdot t$$对于每个查询`[l, r, t]`，我们必须在该区间内找到一个摩天大楼在某个时刻最高的索引`t`。 

直白的解释是：在所有的线条之中$$y = a_i + b_i t$$仅限于索引`[l, r]`，返回最大值为`t`。 

这些约束立即排除了任何二次方。 和`n, q ≤ 10^5`，甚至一个`O(n)`每个查询的扫描大约需要`10^{10}`最坏情况下的操作。 我们需要一些接近的东西`O(log^2 n)`或者`O(\sqrt n)`每个查询。 

这个问题最危险的部分是随时间的推移而发生的最大变化。 最善于小型化的海象`t`稍后可能会变得更糟，因为另一只海象的坡度更大。 

考虑这个例子：```
2 2
100 1
1 100
1 2 0
1 2 2
```时`0`, 海象`1`以身高取胜`100`。 

时`2`, 海象`2`以身高取胜`201`。 

仅存储当前最大值或按固定顺序比较海象的结构会立即失败。 

另一个微妙的例子是领带。```
2 1
5 3
5 3
1 2 10
```两只海象的高度永远相同。 任何答案都是有效的。 粗心的凸包实现会错误地删除相等的线，可能会意外删除所有候选线或保留错误的线。 

另外一个陷阱是处理具有相同坡度的线路。```
3 1
1 5
10 5
7 5
1 3 100
```所有斜率都相等，因此截距最大的海象总是支配其他海象。 如果在船体构造过程中没有仔细处理相等的斜率，则交叉点上的二分搜索将变得无效，因为平行线永远不会相交。 

几何视点是关键的观察。 每个海象对应一条线，每个查询都要求索引子数组上一个 x 坐标处的最大线。 

## 方法

 暴力解决方案评估里面的每只海象`[l, r]`。 

对于一个查询，我们计算：$$a_i + b_i \cdot t$$为所有人`i`并返回区间内具有最大值的索引。 

这是正确的，因为它直接实现了问题的定义。 问题是成本。 查询可以检查`O(n)`海象，所以总复杂度变成`O(nq)`。 两个值都等于`10^5`，这达到了`10^{10}`评价，远远超出了极限。 

关键的观察结果是，每只海象都在平面上定义了一条线。 查询要求坐标处的上封套`t`。 

如果我们拥有全局的所有线，我们就可以构建一个凸包技巧结构。 难点在于区间限制`[l, r]`。 

这建议结合两个想法：

 首先，在索引上使用线段树。 每个节点都存储属于该段的所有行。 

其次，在每个节点内部，构建一个凸包以实现最大查询。 

然后是查询间隔`[l, r]`分解为`O(log n)`线段树节点。 对于每个节点，我们每次查询它的外壳`t`，而这些答案中最好的是全局最大值。 

为什么这在这里效果很好？ 因为每只海象只属于`O(log n)`线段树节点。 存储行的总数变为`O(n log n)`，这是可以管理的。 

在节点内部，我们按斜率对线进行排序并构造上层船体。 由于查询仅要求单个 x 坐标，因此我们可以对交点进行二分搜索以找到最佳线`O(log n)`时间。 

最终复杂度变为`O(log^2 n)`每个查询，足够快`10^5`运营。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(1) | O(1) | 太慢了 |
 | 最佳| O(n log n + q log² n) | O(n log n + q log² n) | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 1. 将每只海象表示为一条线。 

对于海象`i`， 定义：$$f_i(t) = a_i + b_i t$$我们还存储索引`i`因为查询必须返回海象的数量，而不仅仅是高度。 
2. 在海象索引上构建线段树。 

每个节点对应于某个索引区间。 该节点存储海象属于该区间的所有线。 
3. 对于每个节点，按斜率对线进行排序。 

如果两条线具有相同的斜率，则只有截距较大的一条线很重要，因为它在每次都支配另一条线`t`。 
4. 构造节点的上凸包。 

按斜率顺序插入线时，从后面删除无用的线。 

假设我们已经有线路`A`和`B`，并且想要插入`C`。 如果交集`A`和`B`出现在交集的右侧`B`和`C`， 然后`B`永远不是最佳的，可以删除。 
5. 将船体存储为有序的线列表。 

由于斜率已排序，因此增加的最佳线`t`也沿着船体单调移动。 
6. 处理查询`[l, r, t]`。 

将区间分解为`O(log n)`线段树节点。 
7. 独立查询每个节点外壳。 

对于固定的`t`，对船体进行二分查找以找到具有最大值的线`t`。 
8. 比较所有考生的答案。 

及时评估每条返回的行`t`并保留最佳海象指数。 

### 为什么它有效

 每条海象线出现在区间包含其索引的每个线段树节点中。 查询时`[l, r]`，线段树分解完全覆盖了该区间内的海象，仅此而已。 

在一个节点内，凸包精确存储在某个时间值内可以达到最大值的线。 任何被移除的线路都被其他线路所支配`t`，因此删除它不能改变答案。 

二分搜索之所以有效，是因为沿着上船体，最优线单调变化为`t`增加。 连续船体线之间的交点是有序的，这正是船体建造期间维护的属性。 

组合所有查询的节点可以保证我们考虑到中的每只海象`[l, r]`，并在最佳候选者中取最大值给出正确答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**30

class Line:
    __slots__ = ("m", "b", "idx")

    def __init__(self, m, b, idx):
        self.m = m
        self.b = b
        self.idx = idx

    def value(self, x):
        return self.m * x + self.b

def bad(l1, l2, l3):
    return (l3.b - l1.b) * (l1.m - l2.m) <= (l2.b - l1.b) * (l1.m - l3.m)

class Hull:
    __slots__ = ("lines",)

    def __init__(self, arr):
        arr.sort(key=lambda x: (x.m, x.b))

        filtered = []
        for line in arr:
            if filtered and filtered[-1].m == line.m:
                if filtered[-1].b < line.b:
                    filtered[-1] = line
            else:
                filtered.append(line)

        hull = []
        for line in filtered:
            while len(hull) >= 2 and bad(hull[-2], hull[-1], line):
                hull.pop()
            hull.append(line)

        self.lines = hull

    def query(self, x):
        lines = self.lines

        lo, hi = 0, len(lines) - 1

        while lo < hi:
            mid = (lo + hi) // 2

            if lines[mid].value(x) <= lines[mid + 1].value(x):
                lo = mid + 1
            else:
                hi = mid

        best = lines[lo]
        return best.value(x), best.idx

class SegmentTree:
    def __init__(self, a, b):
        self.n = len(a)
        self.tree = [[] for _ in range(4 * self.n)]

        self.build(1, 0, self.n - 1, a, b)

    def build(self, node, l, r, a, b):
        if l == r:
            self.tree[node] = Hull([Line(b[l], a[l], l + 1)])
            return

        mid = (l + r) // 2

        self.build(node * 2, l, mid, a, b)
        self.build(node * 2 + 1, mid + 1, r, a, b)

        merged = []

        merged.extend(self.tree[node * 2].lines)
        merged.extend(self.tree[node * 2 + 1].lines)

        self.tree[node] = Hull(merged)

    def query(self, node, l, r, ql, qr, t):
        if ql <= l and r <= qr:
            return self.tree[node].query(t)

        mid = (l + r) // 2

        best_val = -INF
        best_idx = -1

        if ql <= mid:
            val, idx = self.query(node * 2, l, mid, ql, qr, t)
            if val > best_val:
                best_val = val
                best_idx = idx

        if qr > mid:
            val, idx = self.query(node * 2 + 1, mid + 1, r, ql, qr, t)
            if val > best_val:
                best_val = val
                best_idx = idx

        return best_val, best_idx

def solve():
    n, q = map(int, input().split())

    a = [0] * n
    b = [0] * n

    for i in range(n):
        a[i], b[i] = map(int, input().split())

    seg = SegmentTree(a, b)

    ans = []

    for _ in range(q):
        l, r, t = map(int, input().split())

        _, idx = seg.query(1, 0, n - 1, l - 1, r - 1, t)

        ans.append(str(idx))

    sys.stdout.write("\n".join(ans))

solve()
```这`Line`类存储斜率、截距和原始海象指数。 表达式写为`m * x + b`， 在哪里`m = b[i]`和`b = a[i]`。 

这`bad`函数使用叉乘实现凸包去除条件。 使用整数运算可以避免浮点精度问题。 

船体建造首先按坡度排序。 如果两条线具有相同的斜率，则只有较大的截距能够幸存，因为较小的截距永远无法获胜。 

里面的二分查找`Hull.query`依赖于沿上船体的值在固定处形成单峰序列的事实`x`。 比较相邻的线足以确定哪一侧包含最优值。 

线段树在每个节点都存储一个外壳。 构建合并两个子级的船体线并为父级重建船体。 

一个微妙的实现细节是索引。 该树的内部工作原理是`0`基于索引，但答案必须使用原始的`1`-基于海象数字，所以该行存储`l + 1`。 

另一个重要细节是查询比较仅使用`>`而不是`>=`。 该问题允许任何有效答案都为平局，因此任一选择都有效。 

## 工作示例

 ### 示例 1

 输入：```
5 4
4 1
3 5
6 2
3 5
6 5
1 5 2
1 3 5
1 1 0
1 5 0
```海象系是：

 | 海象 | 公式|
 | --- | --- |
 | 1 | 4 + t |
 | 2 | 3+5吨|
 | 3 | 6+2吨|
 | 4 | 3+5吨|
 | 5 | 6+5吨|

 询问`[1, 5, 2]`。 

| 海象 | t=2 时的高度 |
 | --- | --- |
 | 1 | 6 |
 | 2 | 13 |
 | 3 | 10 | 10
 | 4 | 13 |
 | 5 | 16 | 16

 答案是海象`5`。 

询问`[1, 3, 5]`。 

| 海象 | t=5 时的高度 |
 | --- | --- |
 | 1 | 9 |
 | 2 | 28 | 28
 | 3 | 16 | 16

 答案是海象`2`。 

这个例子展示了即使起始高度较小，较大的斜坡最终也会占据主导地位。 

### 自定义示例```
3 2
100 1
1 100
50 2
1 3 0
1 3 10
```时`0`:

 | 海象 | 身高|
 | --- | --- |
 | 1 | 100 | 100
 | 2 | 1 |
 | 3 | 50 | 50

 回答：`1`时`10`:

 | 海象 | 身高|
 | --- | --- |
 | 1 | 110 | 110
 | 2 | 1001 | 1001
 | 3 | 70 | 70

 回答：`2`此跟踪说明了为什么静态排序是不可能的。 由于坡度很重要，最大值会随着时间而变化。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n + q log² n) | O(n log n + q log² n) | 每个查询涉及 O(log n) 个节点并执行 O(log n) 外壳搜索 |
 | 空间| O(n log n) | O(n log n) | 每条线都出现在 O(log n) 段树节点 |

 和`10^5`海象和查询，大约执行了几百万次操作，这完全符合 Python 的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

INF = 10**30

class Line:
    __slots__ = ("m", "b", "idx")

    def __init__(self, m, b, idx):
        self.m = m
        self.b = b
        self.idx = idx

    def value(self, x):
        return self.m * x + self.b

def bad(l1, l2, l3):
    return (l3.b - l1.b) * (l1.m - l2.m) <= (l2.b - l1.b) * (l1.m - l3.m)

class Hull:
    def __init__(self, arr):
        arr.sort(key=lambda x: (x.m, x.b))

        filtered = []
        for line in arr:
            if filtered and filtered[-1].m == line.m:
                if filtered[-1].b < line.b:
                    filtered[-1] = line
            else:
                filtered.append(line)

        hull = []
        for line in filtered:
            while len(hull) >= 2 and bad(hull[-2], hull[-1], line):
                hull.pop()
            hull.append(line)

        self.lines = hull

    def query(self, x):
        lines = self.lines

        lo, hi = 0, len(lines) - 1

        while lo < hi:
            mid = (lo + hi) // 2

            if lines[mid].value(x) <= lines[mid + 1].value(x):
                lo = mid + 1
            else:
                hi = mid

        best = lines[lo]
        return best.value(x), best.idx

class SegmentTree:
    def __init__(self, a, b):
        self.n = len(a)
        self.tree = [[] for _ in range(4 * self.n)]

        self.build(1, 0, self.n - 1, a, b)

    def build(self, node, l, r, a, b):
        if l == r:
            self.tree[node] = Hull([Line(b[l], a[l], l + 1)])
            return

        mid = (l + r) // 2

        self.build(node * 2, l, mid, a, b)
        self.build(node * 2 + 1, mid + 1, r, a, b)

        merged = []
        merged.extend(self.tree[node * 2].lines)
        merged.extend(self.tree[node * 2 + 1].lines)

        self.tree[node] = Hull(merged)

    def query(self, node, l, r, ql, qr, t):
        if ql <= l and r <= qr:
            return self.tree[node].query(t)

        mid = (l + r) // 2

        best_val = -INF
        best_idx = -1

        if ql <= mid:
            val, idx = self.query(node * 2, l, mid, ql, qr, t)
            if val > best_val:
                best_val = val
                best_idx = idx

        if qr > mid:
            val, idx = self.query(node * 2 + 1, mid + 1, r, ql, qr, t)
            if val > best_val:
                best_val = val
                best_idx = idx

        return best_val, best_idx

def solve():
    input = sys.stdin.readline

    n, q = map(int, input().split())

    a = []
    b = []

    for _ in range(n):
        x, y = map(int, input().split())
        a.append(x)
        b.append(y)

    seg = SegmentTree(a, b)

    out = []

    for _ in range(q):
        l, r, t = map(int, input().split())

        _, idx = seg.query(1, 0, n - 1, l - 1, r - 1, t)

        out.append(str(idx))

    return "\n".join(out)

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return solve()

# provided sample
assert run(
"""5 4
4 1
3 5
6 2
3 5
6 5
1 5 2
1 3 5
1 1 0
1 5 0
"""
) == "5\n2\n1\n5"

# minimum size
assert run(
"""1 1
7 3
1 1 10
"""
) == "1"

# equal slopes
assert run(
"""3 1
1 5
10 5
7 5
1 3 100
"""
) == "2"

# changing maximum over time
assert run(
"""2 2
100 1
1 100
1 2 0
1 2 10
"""
) == "1\n2"

# single-element range inside larger array
assert run(
"""4 2
1 1
2 2
3 3
4 4
2 2 100
4 4 0
"""
) == "2\n4"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单身海象| 永远是自己| 最小约束 |
 | 等坡| 最大拦截获胜 | 平行线处理 |
 | 更改最大值 | 随着时间的推移，不同的答案 | 正确的船体过渡 |
 | 单元素区间 | 返回精确索引 | 线段树边界 |

 ## 边缘情况

 再次考虑相同的斜率：```
3 1
1 5
10 5
7 5
1 3 100
```所有线都是平行的。 船体建造时，仅截距线`10`幸存下来是因为：$$10 + 5t > 7 + 5t$$和$$10 + 5t > 1 + 5t$$对于每一个`t`。 

查询正确返回 walrus`2`。 

现在考虑关系：```
2 1
5 3
5 3
1 2 10
```两条线是相同的。 船体可以保留其中之一。 时`10`，两者均评估为`35`，因此根据声明，任一索引都是有效的。 

最后，考虑一个优势切换：```
2 2
100 1
1 100
1 2 0
1 2 2
```在`t = 0`:

 | 海象 | 身高|
 | --- | --- |
 | 1 | 100 | 100
 | 2 | 1 |

 在`t = 2`:

 | 海象 | 身高|
 | --- | --- |
 | 1 | 102 | 102
 | 2 | 201 | 201

 凸包存储两条线，因为每条线在某个区间上都是最优的`t`。 对海象船体过渡的二分搜索`1`给海象`2`正好在它们的交点之后。
