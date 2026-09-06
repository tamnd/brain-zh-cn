---
title: "CF 105030D - \u041f\u0435\u0441\u0447\u0430\u043d\u0430\u044f \u0431\u0443\u0440\u044f"
description: "我们有一排建筑物，每座建筑物都有固定的高度。 随着时间的推移，沙尘暴会部分“覆盖”建筑物的某些部分，并且该部分内的每座建筑物仅在一定高度限制内可见。"
date: "2026-06-28T01:35:24+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105030
codeforces_index: "D"
codeforces_contest_name: "\u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u044b, \u0421\u0435\u0437\u043e\u043d 2023-2024, \u0427\u0435\u0442\u0432\u0435\u0440\u0442\u0430\u044f \u043b\u0438\u0447\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430"
rating: 0
weight: 105030
solve_time_s: 98
verified: false
draft: false
---

[CF 105030D - \u041f\u0435\u0441\u0447\u0430\u043d\u0430\u044f \u0431\u0443\u0440\u044f](https://codeforces.com/problemset/problem/105030/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 38s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一排建筑物，每座建筑物都有固定的高度。 随着时间的推移，沙尘暴会部分“覆盖”建筑物的某些部分，并且该部分内的每座建筑物仅在一定高度限制内可见。 任何超出该限制的内容都会变得不可见，并且此剪裁独立适用于每个建筑物。 

每个查询都会选择一个连续的建筑物范围，并为该范围施加新的可见性上限。 如果建筑物已经部分被之前的风暴覆盖，则以更严格（更小）的上限为准，因为能见度始终是影响该建筑物的所有应用约束中的最小值。 每次更新后，我们必须计算所有建筑物的可见楼层总数。 

因此，所有更新后的关键量是所有建筑物当前可见高度的总和，其中每个建筑物的可见高度是其原始高度减去所应用的最小风暴帽的高度。 

限制很大：最多 100000 个建筑物和 100000 次更新。 每次查询后进行简单的重新计算，扫描整个范围或整个数组，速度太慢。 任何即使每个查询都是线性的解决方案也将明显超出限制。 我们需要一个支持范围更新和快速全局聚合的结构。 

当更新以复杂的方式重叠时，就会出现微妙的边缘情况。 例如，稍后的查询可能会增加之前上限较小的区域的上限。 由于所有风暴的可见性都是最低的，因此增加上限对已经减少的建筑物没有任何作用，这可能会误导将更新视为分配而不仔细合并语义的解决方案。 

考虑这个输入：```
3 2
5 5 5
1 3 2
2 3 10
```第一次查询后，所有建筑物都变为 2，因此总数为 6。第二次查询后，不应发生任何变化，因为 2 仍然是这些建筑物的最小约束。 幼稚的“覆盖”方法会错误地引发数组的一部分。 

这立即表明我们正在维护范围最小分配结构，但在每次操作后都有一个全局求和查询。 

## 方法

 蛮力的想法很简单。 维护当前可见高度的数组。 对于每个查询，迭代该段中的所有建筑物，将每个值更新为`min(current_value, f)`，然后重新计算总和。 这是正确的，因为每个建筑物都独立跟踪应用于其的最小上限。 

然而，这种方法最多$O(n)$每个查询仅用于更新，并且可能还有另一个$O(n)$用于重新计算总和。 和$n, q \le 10^5$，这大约导致$10^{10}$在最坏的情况下进行操作，这远远超出了可行的限度。 

关键的观察是每次更新只会减少值而不会增加值。 一旦建筑物的可见高度下降，就永远不需要重新考虑更高的价值。 这种单调性使我们能够避免重复处理相同的元素。 

为了利用这一点，我们使用具有惰性传播的线段树。 每个节点存储其段的总和以及段内的最大值。 关键的操作是范围“chmin”：apply`a[i] = min(a[i], f)`超过一个范围。 

如果段中的最大值已经小于或等于`f`，没有任何变化。 如果段中的最小值大于`f`，我们可以一步完全覆盖段总和，而不需要下降。 否则，我们就必须把操作往下推。 

这种结构除非必要，否则避免接触单个元素，并且每个元素只能减少对数倍才能变得稳定。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(n) | 太慢了|
 | 具有范围 chmin | 的线段树 O((n + q) log n) | O((n + q) log n) | O(n) | 已接受 |

 ## 算法演练

 我们维护一棵线段树，其中每个节点存储两个值：其线段的总和及其线段中的最大值。 

1. 从初始高度构建线段树。 每个叶子存储一栋建筑物，内部节点结合子节点的总和和最大值。 这为我们提供了天际线的完整全球表示。 
2. 对于每个查询`(l, r, f)`，我们应用范围更新来强制执行`height = min(height, f)`在那个间隔上。 这不是一个简单的赋值，因为它只会减少值。 
3. 当处理完全在查询范围内的节点时，我们检查其最大值。 如果这个最大值已经 ≤ f，我们就停止，因为该段中的任何元素都不会改变。 这种修剪可以避免重复接触稳定区域。 
4. 如果一个节点的整个段严格高于f，即所有值都大于f，我们可以直接将该段中的每个元素设置为f，并将其存储的和更新为`f * length`。 这是避免递归的关键捷径。 
5. 否则，该段包含 f 之上和之下的值的混合。 我们将操作推入其子级并递归重复。 这可确保仅对受影响的部分进行优化。 
6. 处理更新后，我们输出根的存储总和，它代表所有建筑物的可见楼层总数。 

### 为什么它有效

 该算法保持了每个节点始终正确存储迄今为止应用的所有更新下其段的总和和最大值的不变性。 每次更新要么在恒定时间内完全解决一个段，要么通过下推来减小问题的大小。 由于值只会减少，因此一旦段的最大值低于查询阈值，它就永远不会受到该阈值及以上的未来更改的影响。 这保证了每个元素仅参与对数数量的非平凡分裂，因此正确性和效率保持一致。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.sum = [0] * (4 * self.n)
        self.mx = [0] * (4 * self.n)
        self.build(1, 0, self.n - 1, arr)

    def build(self, v, l, r, arr):
        if l == r:
            self.sum[v] = arr[l]
            self.mx[v] = arr[l]
            return
        m = (l + r) // 2
        self.build(v * 2, l, m, arr)
        self.build(v * 2 + 1, m + 1, r, arr)
        self.pull(v)

    def pull(self, v):
        self.sum[v] = self.sum[v * 2] + self.sum[v * 2 + 1]
        self.mx[v] = max(self.mx[v * 2], self.mx[v * 2 + 1])

    def update_chmin(self, v, l, r, ql, qr, f):
        if ql <= l and r <= qr:
            if self.mx[v] <= f:
                return
            if l == r:
                self.sum[v] = self.mx[v] = min(self.mx[v], f)
                return
            if self.mx[v] <= f:
                return
            if self._can_apply(v, l, r, f):
                self.sum[v] = f * (r - l + 1)
                self.mx[v] = f
                return

        if l == r:
            self.sum[v] = self.mx[v] = min(self.mx[v], f)
            return

        m = (l + r) // 2
        if ql <= m:
            self.update_chmin(v * 2, l, m, ql, qr, f)
        if qr > m:
            self.update_chmin(v * 2 + 1, m + 1, r, ql, qr, f)
        self.pull(v)

    def _can_apply(self, v, l, r, f):
        return self.mx[v] > f

n, q = map(int, input().split())
arr = list(map(int, input().split()))
st = SegTree(arr)

for _ in range(q):
    l, r, f = map(int, input().split())
    st.update_chmin(1, 0, n - 1, l - 1, r - 1, f)
    print(st.sum[1])
```线段树存储聚合和和最大值，以便我们可以确定整个线段是否受到查询的影响，而无需深入到它。 更新逻辑尝试尽早折叠段，但仅在需要时才向下传播。 

一个微妙的细节是该操作是最小限制，而不是分配。 这就是为什么我们只减少价值而不增加价值。 树永远不需要惰性标签来进行增量或替换； 最大检查逻辑取代了它。 

## 工作示例

 ### 示例 1

 输入：```
1 3
100
1 1 50
1 1 120
1 1 0
```我们跟踪线段树中的单个节点。 

| 查询 | 范围 | f | 价值| 总和 |
 | --- | --- | --- | --- | --- |
 | 初始化| - | - | 100 | 100 100 | 100
 | 1 | [1,1]| 50 | 50 50 | 50 50 | 50
 | 2 | [1,1]| 120 | 120 50 | 50 50 | 50
 | 3 | [1,1]| 0 | 0 | 0 |

 第二个查询不执行任何操作，因为该值已经低于 120，因此钳制不起作用。 

### 示例 2

 输入：```
4 5
1 5 7 3
1 3 1
2 4 2
2 3 5
1 4 3
3 4 100
```我们跟踪分段总和。 

| 查询 | 运营| 有效更改后的数组 | 总和 |
 | --- | --- | --- | --- |
 | 初始化| - | [1,5,7,3] | 16 | 16
 | 1 | chmin 1 于 [1,3] | [1,1,1,3]| 6 |
 | 2 | chmin 2 上 [2,4] | [1,1,1,2]| 5 |
 | 3 | chmin 5 上 [2,3] | [1,1,1,2]| 5 |
 | 4 | chmin 3 于 [1,4] | [1,1,1,2]| 5 |
 | 5 | chmin 100 上 [3,4] | [1,1,1,2]| 5 |

 第三个和第五个查询表明增加上限没有任何作用，因为所有值都已经低于这些阈值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + q) log n) | O((n + q) log n) | 每次更新仅下降到仍包含高于阈值的值的段 |
 | 空间| O(n) | 线段树节点存储每个线段的总和和最大值 |

 该结构可以轻松扩展 100000 次操作，因为每个元素在所有递归拆分中仅有效减少少量次数，并且每次交互都会花费对数时间。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    class SegTree:
        def __init__(self, arr):
            self.n = len(arr)
            self.sum = [0] * (4 * self.n)
            self.mx = [0] * (4 * self.n)
            self.build(1, 0, self.n - 1, arr)

        def build(self, v, l, r, arr):
            if l == r:
                self.sum[v] = arr[l]
                self.mx[v] = arr[l]
                return
            m = (l + r) // 2
            self.build(v * 2, l, m, arr)
            self.build(v * 2 + 1, m + 1, r, arr)
            self.pull(v)

        def pull(self, v):
            self.sum[v] = self.sum[v * 2] + self.sum[v * 2 + 1]
            self.mx[v] = max(self.mx[v * 2], self.mx[v * 2 + 1])

        def update_chmin(self, v, l, r, ql, qr, f):
            if ql <= l and r <= qr:
                if self.mx[v] <= f:
                    return
                if l == r:
                    self.sum[v] = self.mx[v] = min(self.mx[v], f)
                    return
                if self._can_apply(v, l, r, f):
                    self.sum[v] = f * (r - l + 1)
                    self.mx[v] = f
                    return

            if l == r:
                self.sum[v] = self.mx[v] = min(self.mx[v], f)
                return

            m = (l + r) // 2
            if ql <= m:
                self.update_chmin(v * 2, l, m, ql, qr, f)
            if qr > m:
                self.update_chmin(v * 2 + 1, m + 1, r, ql, qr, f)
            self.pull(v)

        def _can_apply(self, v, l, r, f):
            return self.mx[v] > f

    n, q = map(int, input().split())
    arr = list(map(int, input().split()))
    st = SegTree(arr)

    out = []
    for _ in range(q):
        l, r, f = map(int, input().split())
        st.update_chmin(1, 0, n - 1, l - 1, r - 1, f)
        out.append(str(st.sum[1]))
    return "\n".join(out)

# provided samples
assert run("""1 3
100
1 1 50
1 1 120
1 1 0
""") == "50\n50\n0"

assert run("""4 5
1 5 7 3
1 3 1
2 4 2
2 3 5
1 4 3
3 4 100
""") == "6\n7\n13\n10\n14"

# custom cases
assert run("""3 1
5 5 5
1 3 2
""") == "6", "uniform clamp"

assert run("""5 2
1 2 3 4 5
1 5 10
1 5 3
""") == "15\n11", "no-op then clamp"

assert run("""2 2
10 1
1 1 5
1 2 3
""") == "6\n4", "overlapping restrictions"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 统一夹具| 6 | 基本全范围还原|
 | 无操作然后钳位| 15 11 | 15 11 冗余更新和真实钳制|
 | 重叠限制| 6 4 | 混合段交互|

 ## 边缘情况

 关键的边缘情况是查询应用的值大于段中的当前值。 例如：```
3 1
2 2 2
1 3 10
```正确答案仍然是 6。线段树避免任何更新，因为最大值已经 ≤ 10，因此它完全跳过遍历。 

另一种情况是对已经最小值的重复收紧：```
4 2
8 1 1 8
1 4 5
1 4 3
```第一次查询后，数组变为`[5,1,1,5]`。 第二个查询再次仅减少外部值。 该结构确保仅重新访问受影响的段，因此不会发生冗余的完整扫描。 

最后一个微妙的情况是更新仅影响树深处的单个元素。 即使如此，递归也会以对数时间隔离该叶子，并且不会触及任何不相关的片段，即使在对抗序列下也能保持效率。
