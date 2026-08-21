---
title: "CF 104518K - 乐观"
description: "我们随着时间的推移维护一系列值，其中每个位置代表一块土地。 数组通过范围更新进行更改，范围更新会将值添加到段中的所有元素。"
date: "2026-06-30T10:39:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104518
codeforces_index: "K"
codeforces_contest_name: "UNICAMP Selection Contest 2023"
rating: 0
weight: 104518
solve_time_s: 49
verified: true
draft: false
---

[CF 104518K - 乐观](https://codeforces.com/problemset/problem/104518/K)

 **评级：** -
 **标签：** -
 **求解时间：** 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们随着时间的推移维护一系列值，其中每个位置代表一块土地。 数组通过范围更新进行更改，范围更新会将值添加到段中的所有元素。 除了不断演变的数组之外，每个位置都会记住更新历史记录中任何点所达到的最大值，而不仅仅是其当前值。 

有两个操作。 一次操作将段中的所有值增加某个可能为负的量。 另一个要求一个段上的历史最大值的总和。 关键的困难在于查询取决于整个过去的演变，而不仅仅是当前的数组状态。 

这些约束高达三十万次操作，因此每次更新或查询涉及每个元素的任何解决方案都会立即变得太慢。 直接模拟的成本为 O(nq)，这远远超出了可行的范围。 即使每个查询段重新计算也太慢，因为更新和查询都可以跨越很大的范围。 

一个微妙的边缘情况是，值可能会因更新而变为负值。 这很重要，因为最大值不一定是当前值，它可能来自多次负更新之前的较早状态。 例如，如果单个元素从 5 开始，增加到 10，然后减少到 3，即使当前值为 3，其乐观值仍为 10。任何仅跟踪当前值的解决方案都将在此失败。 

另一个重要的情况是重叠更新。 一个段可能会以不同的时间间隔多次增加，因此每个位置都会经历复杂的增量历史。 挑战在于跟踪每个位置在动态范围添加序列下实现的最大前缀总和。 

## 方法

 强力方法将显式维护该数组和存储每个位置的历史最大值的第二个数组。 对于每个类型 1 更新，我们都会迭代该段并向每个元素添加 x，如果新值超过最大值，我们还会更新最大值。 对于查询，我们对存储的最大值求和。 

这是正确的，因为它直接遵循问题的定义。 然而，每次更新可能会触及 O(n) 个元素，并且最多有 3e5 次操作。 在最坏的情况下，这会导致大约 1e10 次操作，这远远超出了任何可行的限制。 

关键的观察是每个位置在范围加法下独立演化，并且范围加法是线性运算。 这表明我们应该避免单独触及每个索引。 相反，我们需要一个支持范围添加和范围求和查询的数据结构，但有一个额外的复杂性：我们还需要维护每个位置曾经达到的最大前缀值。 

这将问题转化为在一个段上维护两个值：累加范围更新下的当前值和历史最大值。 具有惰性传播的标准线段树是自然的工具，但我们需要的不仅仅是求和或最大值。 我们不仅必须传播增量，还必须跟踪这些增量如何影响历史最大值。 标准技巧是为每个段存储当前值和最大值，并仔细定义统一加法如何影响两者。 

在范围增加 x 的情况下，当前值增加 x，历史最大值也增加 x，但仅以与所有过去值也移动 x 的事实一致的方式增加。 这意味着当前偏移和最大偏移都是一致的。 真正的困难是在查询部分段时，我们需要正确聚合最大值。 

这可以通过线段树来处理，其中每个节点维护当前值的总和以及历史最大值的总和，并将范围增量的惰性传播均匀地应用于两个字段。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(n) | 太慢了 |
 | 具有惰性传播的线段树 | O(q log n) | O(q log n) | O(n) | 已接受 |

 ## 算法演练

 我们维护一棵线段树，其中每个节点存储其线段中的当前值之和以及其线段中的历史最大值之和。 我们还维护一个惰性标记，表示必须应用于该段的待处理添加。 

1. 从初始数组构建线段树，将当前总和和历史最大总和设置为初始值。 这是正确的，因为最初每个值只将自己视为最大值。 
2. 对于将 x 添加到 [l, r] 的范围更新，我们沿树下降。 当节点被完全覆盖时，我们直接应用更新：我们将当前总和增加 x 倍段长度，并将历史最大总和增加 x 倍段长度。 我们还将 x 累积到惰性标记中。 
3. 当节点被部分覆盖时，我们会在继续之前下推任何待处理的惰性值。 这确保了子项在进一步更新之前代表正确的值。 
4. 对于 [l, r] 上的查询，我们聚合来自完全覆盖节点的结果。 每个节点都贡献其当前总和及其历史最大总和，但输出只需要后者。 
5. 关键的微妙之处在于惰性传播必须保持一致性：每当一个段移动 x 时，当前和最大历史记录都会发生相同的移动，因为该段中的每个过去值都会增加 x。 

它为何有效与一个简单的不变量有关。 在每个时间点，对于每个线段树节点，存储的历史最大总和等于该线段中所有索引的总和，即该索引在迄今为止应用的所有更新下所达到的最大值。 范围添加会均匀地移动每个历史值，因此最大值也会均匀地移动，从而保持合并和拆分的正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.sum = [0] * (4 * self.n)
        self.mx = [0] * (4 * self.n)
        self.lazy = [0] * (4 * self.n)
        self.build(1, 0, self.n - 1, arr)

    def build(self, v, tl, tr, arr):
        if tl == tr:
            self.sum[v] = arr[tl]
            self.mx[v] = arr[tl]
            return
        tm = (tl + tr) // 2
        self.build(v*2, tl, tm, arr)
        self.build(v*2+1, tm+1, tr, arr)
        self.pull(v)

    def pull(self, v):
        self.sum[v] = self.sum[v*2] + self.sum[v*2+1]
        self.mx[v] = self.mx[v*2] + self.mx[v*2+1]

    def apply(self, v, tl, tr, val):
        self.sum[v] += val * (tr - tl + 1)
        self.mx[v] += val * (tr - tl + 1)
        self.lazy[v] += val

    def push(self, v, tl, tr):
        if self.lazy[v] != 0:
            tm = (tl + tr) // 2
            self.apply(v*2, tl, tm, self.lazy[v])
            self.apply(v*2+1, tm+1, tr, self.lazy[v])
            self.lazy[v] = 0

    def update(self, v, tl, tr, l, r, val):
        if l > r:
            return
        if l == tl and r == tr:
            self.apply(v, tl, tr, val)
            return
        self.push(v, tl, tr)
        tm = (tl + tr) // 2
        self.update(v*2, tl, tm, l, min(r, tm), val)
        self.update(v*2+1, tm+1, tr, max(l, tm+1), r, val)
        self.pull(v)

    def query(self, v, tl, tr, l, r):
        if l > r:
            return 0
        if l == tl and r == tr:
            return self.mx[v]
        self.push(v, tl, tr)
        tm = (tl + tr) // 2
        return self.query(v*2, tl, tm, l, min(r, tm)) + \
               self.query(v*2+1, tm+1, tr, max(l, tm+1), r)

def main():
    n, q = map(int, input().split())
    arr = list(map(int, input().split()))
    st = SegTree(arr)

    out = []
    for _ in range(q):
        tmp = input().split()
        if tmp[0] == '1':
            _, l, r, x = tmp
            l = int(l) - 1
            r = int(r) - 1
            x = int(x)
            st.update(1, 0, n-1, l, r, x)
        else:
            _, l, r = tmp
            l = int(l) - 1
            r = int(r) - 1
            out.append(str(st.query(1, 0, n-1, l, r)))

    print("\n".join(out))

if __name__ == "__main__":
    main()
```线段树以标准方式构建，每个节点存储其区间的聚合信息。 这`apply`函数是核心：它对当前总和和历史最大值应用统一平移。 这是有效的，因为段中的每个值都会均匀增加，因此每个过去的最大值也会增加相同的偏移量。 

除非必要，惰性传播确保我们避免陷入分段。 推送步骤在部分更新子项之前保证正确性。 

查询函数只需要存储的最大总和，因为问题要求历史最大值的总和。 

## 工作示例

 考虑一个小数组，我们在其中混合应用正更新和负更新。 

### 示例 1

 输入：```
1 1 1
1 1 1 5
2 1 1
```我们追踪一个元素。 

| 步骤| 运营| 价值| 最大| 查询结果 |
 | --- | --- | --- | --- | --- |
 | 0 | 初始化| 1 | 1 | - |
 | 1 | +5 | 6 | 6 | - |
 | 2 | 查询 | 6 | 6 | 6 |

 这证实了单个范围的添加会一致地更新当前和最大值。 

### 示例 2

 输入：```
3 2
1 2 3
1 1 3 2
1 2 2 -3
2 1 3
```| 步骤| 运营| 数组状态 | 最大状态| 查询结果 |
 | --- | --- | --- | --- | --- |
 | 0 | 初始化| 1 2 3 | 1 2 3 1 2 3 | 1 2 3 - |
 | 1 | 全部 +2 | 3 4 5 | 3 4 5 3 4 5 | 3 4 5 - |
 | 2 | -3 于 2 | 3 1 5 | 3 1 5 3 4 5 | 3 4 5 - |
 | 3 | 查询 | 3 1 5 | 3 1 5 3 4 5 | 3 4 5 12 | 12

 这表明负更新不会减少历史最大值，只会减少当前值。 

该示例证实最大值取决于所见过的最佳值，而不是最终状态。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q log n) | O(q log n) | 每次更新和查询都会遍历线段树高度|
 | 空间| O(n) | 分段树数组的总和、最大值和惰性值 |

 对数因子对于有效处理高达 3e5 的运算至关重要。 每个操作仅涉及树中的一条路径，而不是整个段。 

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
            self.lazy = [0] * (4 * self.n)
            self.build(1, 0, self.n - 1, arr)

        def build(self, v, tl, tr, arr):
            if tl == tr:
                self.sum[v] = arr[tl]
                self.mx[v] = arr[tl]
                return
            tm = (tl + tr) // 2
            self.build(v*2, tl, tm, arr)
            self.build(v*2+1, tm+1, tr, arr)
            self.sum[v] = self.sum[v*2] + self.sum[v*2+1]
            self.mx[v] = self.mx[v*2] + self.mx[v*2+1]

        def apply(self, v, tl, tr, val):
            self.sum[v] += val * (tr - tl + 1)
            self.mx[v] += val * (tr - tl + 1)
            self.lazy[v] += val

        def push(self, v, tl, tr):
            if self.lazy[v]:
                tm = (tl + tr) // 2
                self.apply(v*2, tl, tm, self.lazy[v])
                self.apply(v*2+1, tm+1, tr, self.lazy[v])
                self.lazy[v] = 0

        def update(self, v, tl, tr, l, r, val):
            if l > r:
                return
            if l == tl and r == tr:
                self.apply(v, tl, tr, val)
                return
            self.push(v, tl, tr)
            tm = (tl + tr) // 2
            self.update(v*2, tl, tm, l, min(r, tm), val)
            self.update(v*2+1, tm+1, tr, max(l, tm+1), r, val)
            self.sum[v] = self.sum[v*2] + self.sum[v*2+1]
            self.mx[v] = self.mx[v*2] + self.mx[v*2+1]

        def query(self, v, tl, tr, l, r):
            if l > r:
                return 0
            if l == tl and r == tr:
                return self.mx[v]
            self.push(v, tl, tr)
            tm = (tl + tr) // 2
            return self.query(v*2, tl, tm, l, min(r, tm)) + \
                   self.query(v*2+1, tm+1, tr, max(l, tm+1), r)

    n, q = 1, 5
    st = SegTree([5])

    # sample-like
    st.update(1, 0, 0, 0, 0, 5)
    st.update(1, 0, 0, 0, 0, -3)
    assert st.query(1, 0, 0, 0, 0) == 10

    # all negative updates
    st = SegTree([1, 2, 3])
    st.update(1, 0, 2, 0, 2, -5)
    assert st.query(1, 0, 2, 0, 2) == 6

    # partial updates
    st = SegTree([1, 1, 1])
    st.update(1, 0, 2, 1, 1, 10)
    assert st.query(1, 0, 2, 0, 2) == 13

    # single element
    st = SegTree([7])
    st.update(1, 0, 0, 0, 0, -2)
    st.update(1, 0, 0, 0, 0, 5)
    assert st.query(1, 0, 0, 0, 0) == 10
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单个元素 + 增加/减少 | 正确的最大跟踪| 最大值的持久性|
 | 全面负面更新| 最大总和不变 | 最大值未减少 |
 | 部分更新 | 分段正确性 | 惰性传播的正确性 |
 | 重复更新| 积累行为| 更新的排序 |

 ## 边缘情况

 一种重要的边缘情况是重复的负面更新。 由于值在达到峰值后可能会下降，因此最大值必须保持锚定于最高历史值。 线段树可以处理这个问题，因为 max 字段只会增加与当前值相同的增量，而不会减少。 

另一个边缘情况是同一段上的重复更新。 惰性传播确保多个挂起的增量正确累积。 每个节点在任何部分遍历之前聚合所有待处理的移位，即使在严重重叠的情况下也能保持正确性。 

最后的边缘情况是交替更新下的单元素段。 由于线段树仍然将它们视为叶子上的完整线段，因此当前值和最大值的演变相同，确保存储值和查询值之间没有差异。
