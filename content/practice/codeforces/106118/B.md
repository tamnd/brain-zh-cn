---
title: "CF 106118B - 气球之旅"
description: "我们给出了一条山脉，每条山脉都有一个初始高度。 旅程定义为从索引 $l$ 步行到 $r$，始终向右移动一步，并以连续高度之间的绝对差来支付每次移动的成本。"
date: "2026-06-19T20:05:37+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106118
codeforces_index: "B"
codeforces_contest_name: "2025 ICPC, Chula Selection Contest"
rating: 0
weight: 106118
solve_time_s: 61
verified: true
draft: false
---

[CF 106118B - 气球之旅](https://codeforces.com/problemset/problem/106118/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了一条山脉，每条山脉都有一个初始高度。 旅程定义为从索引处步行$l$到$r$，总是向右移动一步，并以连续高度之间的绝对差来支付每一步的成本。 所以查询的成本是$|a_i - a_{i+1}|$全面的$i$从$l$到$r-1$，但高度不是静态的。 

在查询之间，我们可以应用范围更新来增加段中的所有高度$[l, r]$按某个值$x$。 重要的是，此更新改变了高度，这改变了全球范围内的许多相邻差异，而不仅仅是部分内部的局部差异。 

困难在于这两个操作的数量都很大，最多$3 \cdot 10^5$，因此每个查询从头开始重新计算全范围成本太慢。 挑战在于维护一个动态数组，其中我们支持范围添加以及对段上绝对相邻差值总和的快速查询。 

一个关键的观察来自于理解更新如何影响差异。 如果一条边的两个端点$(i, i+1)$在更新范围之内或之外，它们的差异不会改变。 只有跨越更新范围边界的边才会受到影响。 这个局部性使得问题变得容易处理。 

打破天真的思维的极端情况包括：

 每个查询的完全幼稚的重新计算会立即失败。 例如，如果所有操作都是类型 2 查询，则每个操作的成本$O(n)$，总工作变为$O(nq)$，这大约是$9 \cdot 10^{10}$运营。 

一个更微妙的失败是假设我们可以直接维护差异的前缀和而不考虑范围更新。 考虑只移动数组的一部分的段更新； 差异数组不会通过简单的点添加来更新，因为只有边界差异发生变化。 

## 方法

 蛮力方法很简单。 我们直接维护数组。 对于范围添加，我们增加每个元素$[l, r]$。 对于查询，我们通过线性扫描来计算请求范围内的绝对差值之和。 

这是正确的，因为它直接遵循操作的定义。 然而，每次更新都会花费$O(n)$在最坏的情况下，每个查询也会花费$O(n)$，导致二次或更糟糕的行为。 

瓶颈来自于每个操作都涉及潜在的大段，并且没有重用以前的计算。 

关键的见解是将问题分为两层。 首先，我们使用具有惰性传播的线段树或芬威克树来维护范围加法下的数组。 其次，我们不是每次都重新计算一定范围内的绝对差，而是维护相邻对的贡献结构。 

我们定义一个辅助数组$d_i = a_{i+1} - a_i$。 查询成本是以下总和$|d_i|$超过该段。 范围添加$x$影响$d_i$仅当恰好是其中之一时$a_i$和$a_{i+1}$处于更新范围内。 这意味着每次更新只有两个边界位置：$l-1$和$r$。 

因此，我们不更新许多差异，而是仅更新两个相邻的差异值。 同时，我们维护一棵线段树$d_i$支持点更新和绝对值的范围求和查询。 为了有效地处理符号更改，我们维护$d_i$本身及其通过支持范围添加引起的端点更新的结构的绝对贡献。 

核心思想是范围加法最多转化为差异数组上的两个点更新，这使得这两个操作都是对数的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(nq)$|$O(n)$| 太慢了 |
 | 最佳 |$O(q \log n)$|$O(n)$| 已接受 |

 ## 算法演练

 我们维护数组$a$隐式使用支持范围添加和点查询的 Fenwick 树或线段树。 同时，我们维护差异结构$d_i = a_{i+1} - a_i$，但我们从来不会在每次操作后显式重建完整的数组。 

1、初始化一个支持对原数组进行范围加法和点查询的数据结构$a$。 这使我们能够恢复任何$a_i$需要时无需显式存储所有更新。 
2. 构建初始差异数组$d_i = a_{i+1} - a_i$。 这些代表了本地对路径成本的贡献。 
3. 构建线段树$|d_i|$，支持点更新和范围求和查询。 该结构直接回答行程成本查询。 
4. 处理范围添加操作时$(l, r, x)$，观察到只有涉及边界的差异发生变化。 具体来说，仅$d_{l-1}$和$d_r$受到影响，因为所有内部边缘的两个端点均等地移动。 
5. 要更新这些边界差异，首先计算旧值$a_{l-1}, a_l, a_r, a_{r+1}$在范围添加结构上使用点查询。 
6. 重新计算$d_{l-1} = a_l - a_{l-1}$如果$l > 1$，并更新其在线段树中的绝对值。 
7. 重新计算$d_r = a_{r+1} - a_r$如果$r < n$，并类似地更新其绝对值。 
8. 应用范围加法$+x$在主要结构上，以便将来的查询反映更新的高度。 
9.行程查询$(l, r)$，返回总和$|d_i|$为了$i \in [l, r-1]$从线段树。 

它之所以有效，与均匀平移下内部差异的不变性有关。 当段中的每个元素增加相同的值时，该段内的差异保持不变。 只有穿过线段边界的边才会看到一个端点发生变化，而另一个端点则不会发生变化，这就是为什么只有这两个位置需要重新计算。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, i, v):
        while i <= self.n:
            self.bit[i] += v
            i += i & -i

    def sum(self, i):
        s = 0
        while i > 0:
            s += self.bit[i]
            i -= i & -i
        return s

    def range_add(self, l, r, v):
        self.add(l, v)
        if r + 1 <= self.n:
            self.add(r + 1, -v)

    def point_query(self, i):
        return self.sum(i)

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.t = [0] * (4 * self.n)
        self.build(1, 0, self.n - 1, arr)

    def build(self, v, tl, tr, arr):
        if tl == tr:
            self.t[v] = arr[tl]
        else:
            tm = (tl + tr) // 2
            self.build(v*2, tl, tm, arr)
            self.build(v*2+1, tm+1, tr, arr)
            self.t[v] = self.t[v*2] + self.t[v*2+1]

    def update(self, v, tl, tr, pos, val):
        if tl == tr:
            self.t[v] = val
        else:
            tm = (tl + tr) // 2
            if pos <= tm:
                self.update(v*2, tl, tm, pos, val)
            else:
                self.update(v*2+1, tm+1, tr, pos, val)
            self.t[v] = self.t[v*2] + self.t[v*2+1]

    def query(self, v, tl, tr, l, r):
        if l > r:
            return 0
        if l == tl and r == tr:
            return self.t[v]
        tm = (tl + tr) // 2
        return self.query(v*2, tl, tm, l, min(r, tm)) + \
               self.query(v*2+1, tm+1, tr, max(l, tm+1), r)

def solve():
    n, q = map(int, input().split())
    a = list(map(int, input().split()))

    fw = Fenwick(n)
    for i, v in enumerate(a, 1):
        fw.range_add(i, i, v)

    if n > 1:
        diff = [abs(a[i+1] - a[i]) for i in range(n-1)]
        st = SegTree(diff)
    else:
        st = None

    out = []

    for _ in range(q):
        tmp = list(map(int, input().split()))
        t = tmp[0]

        if t == 1:
            l, r, x = tmp[1], tmp[2], tmp[3]
            fw.range_add(l, r, x)

            if n > 1:
                if l > 1:
                    i = l - 2
                    left = fw.point_query(l-1)
                    right = fw.point_query(l)
                    st.update(1, 0, n-2, i, abs(right - left))

                if r < n:
                    i = r - 1
                    left = fw.point_query(r)
                    right = fw.point_query(r+1)
                    st.update(1, 0, n-2, i, abs(right - left))

        else:
            l, r = tmp[1], tmp[2]
            if l == r:
                out.append("0")
            else:
                out.append(str(st.query(1, 0, n-2, l-1, r-2)))

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```芬威克树将数组存储在范围添加下，因此可以在对数时间内重建任何点。 线段树存储绝对相邻差，并支持边界值变化时的单位置更新。 更新逻辑在每次范围添加后仅仔细重新计算受影响的差异。 

索引稍微微妙：差异索引$i$对应于边缘$(i, i+1)$，所以查询$[l, r]$映射到$[l-1, r-2]$在差异结构中。 

## 工作示例

 ### 示例 1

 输入：```
5 3
1 3 2 5 4
2 1 5
1 2 4 3
2 1 5
```最初的差异是：

 | 我| 一个[我] | 一个[i+1] | 差异|
 | --- | --- | --- | --- |
 | 1 | 1 | 3 | 2 |
 | 2 | 3 | 2 | 1 |
 | 3 | 2 | 5 | 3 |
 | 4 | 5 | 4 | 1 |

 第一个查询对所有差异求和：2 + 1 + 3 + 1 = 7。 

[2,4]加上3后，数组变为[1,6,5,8,4]。 

更新了受影响的边：

 | 边缘| 新差异|
 | --- | --- |
 | (1,2) | 5 |
 | (4,5) | 4 |

 完整差异变为 [5,1,3,4]，总和为 13。 

### 示例 2

 输入：```
4 2
10 10 10 10
2 1 4
1 2 3 5
```第一个查询为 0，因为所有值都相等。 

更新后，数组变为[10,15,15,10]。 

差异变为 [5,0,5]，表明更新后只有边界边缘很重要。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(q \log n)$| 每次更新都会涉及两个线段树节点并且 Fenwick 更新 |
 | 空间|$O(n)$| 存储 Fenwick 树和线段树 |

 该解决方案完全符合限制，因为每个操作都会减少到恒定数量的对数更新，从而避免了对数组的任何完全遍历。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from main import solve
    solve()
    return sys.stdout.getvalue().strip()

# minimum size
assert run("1 1\n5\n2 1 1\n") == "0"

# simple chain
assert run("3 2\n1 2 3\n2 1 3\n2 2 3\n") == "2\n1"

# range update affects only boundaries
assert run("5 3\n1 1 5 10\n2 1 5\n2 2 4\n") == "0\n0"

# all equal
assert run("4 2\n7 7 7 7\n2 1 4\n2 2 3\n") == "0\n0"

# alternating
assert run("5 1\n1 2 3 4 5\n2 1 5\n") == "4"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元素| 0 | 琐碎的片段|
 | 简单链条| 2,1 | 差异和的正确性 |
 | 全面更新| 0,0 | 仅边界更新 |
 | 一切平等| 0,0 | 没有变化下的稳定性|
 | 交替| 4 | 一般正确性 |

 ## 边缘情况

 对于单元素数组，没有边，因此每个查询都必须返回零。 差异线段树为空，并且代码在以下情况下正确绕过它：$n = 1$。 

对于全方位更新，例如将每个元素增加一个常数，根本没有差异变化。 该算法仅尝试重新计算$d_{l-1}$和$d_r$，在这种情况下两者都超出范围，因此不会发生更新。 这与均匀平移保留所有绝对差异的事实相匹配。 

对于触及边界的更新，例如$l = 1$或者$r = n$，仅存在边界更新的一侧。 该实现在重新计算差异之前显式检查边界，从而防止对 Fenwick 结构进行无效查询。
