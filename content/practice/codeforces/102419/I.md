---
title: "CF 102419I - 另一个查询问题"
description: "我们维护一个长度为 (n) 的整数数组 (A)，最初用零填充。 类型 2 运算将算术级数添加到一个连续区间。 对于操作 ((l,r,a,b))，位置 (i) 接收 [ a+b(i-l)。"
date: "2026-08-12T20:25:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102419
codeforces_index: "I"
codeforces_contest_name: "SPC 2019"
rating: 0
weight: 102419
solve_time_s: 474
verified: true
draft: false
---

[CF 102419I - 另一个查询问题](https://codeforces.com/problemset/problem/102419/I)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 54s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们维护一个长度为 (n) 的整数数组 (A)，最初用零填充。 类型 2 运算将算术级数添加到一个连续区间。 对于操作 ((l,r,a,b))，位置 (i) 接收

 [
 a+b(i-l)。 
]

 类型 1 运算询问 (A_l,A_{l+1},\ldots,A_r) 中的每个值是否相同。 当间隔恒定时，所需输出为 (1)，否则为 (0)。 

边界 (n,q\le 2\cdot10^5) 排除了为每个查询扫描整个间隔的情况。 在最坏的情况下，长度为 (2\cdot10^5) 的间隔上可能有 (2\cdot10^5) 次操作，这大约提供 (4\cdot10^{10}) 次数组访问。 我们需要每个操作花费大约 (O(\log n))，或者至少大大少于线性时间。 

棘手的部分是算术级数更新看起来像是独立更改区间的每个元素。 存储实际值并修改整个间隔正是导致暴力解决方案太慢的原因。 

一种有用的边缘情况是单元素查询。 例如，```
1 1
1 1 1
```有输出```
1
```因为单个元素总是等于它自己。 搜索区间内差异的解决方案可能会意外地将其视为非常量范围。 

当级数为 (b=0) 时，会出现另一种边缘情况。 例如，```
3 2
2 1 3 5 0
1 1 3
```产生```
1
```因为更新将 (5) 添加到每个位置，给出 ([5,5,5])。 粗心的解决方案可能会假设每个类型 2 运算都必然会创建不同的值，因为它被描述为算术级数。 

间隔边界也很重要。 考虑```
4 3
2 2 4 1 1
1 2 4
1 1 4
```更新后数组为 ([0,1,2,3])，因此输出为```
0
0
```第一个查询仅检查位置 2 到 4。第二个查询包括位置 1，该位置未受影响。 在检查相等性时忘记正确边界或使用 (l) 而不是 (l+1) 的差异数组实现可能会默默地包含错误的差异。 

负面更新是错误的另一个来源。 例如，```
3 3
2 1 3 5 -2
1 1 3
2 2 2 -1 0
1 1 3
```给出```
0
0
```第一次更新创建 ([5,3,1])，第二次更新将位置 2 更改为 (2)，得到 ([5,2,1])。 数据结构必须处理带符号的值，而不仅仅是处理值是递增还是递减。 

## 方法

 直接的解决方案是存储（A）本身。 对于类型 2 运算，从 (l) 迭代到 (r) 并添加级数的相应项。 对于类型 1 查询，扫描间隔并将每个值与第一个值进行比较。 这是正确的，因为它明确地执行了问题所描述的操作，并直接检查常数区间的定义。 

问题是最坏的情况。 一次更新可以触及 (O(n)) 个元素，一次查询可以检查 (O(n)) 个元素。 对于 (2\cdot10^5) 次运算，这可能需要大约 (4\cdot10^{10}) 次基本数组运算，远远超出了时间限制。 

关键的观察是停止查看值本身，而是查看它们相邻的差异。 定义

 [
 D_i=A_i-A_{i-1},
 ]

 与（A_0=0）。 区间 (A_l,\ldots,A_r) 恰好在以下情况下恒定：

 [
 D_{l+1}=D_{l+2}=\cdots=D_r=0。 
]

 因此，一个可能很长的等式查询会变成询问一系列差异是否包含任何非零内容的查询。 

现在考虑算术级数更新对 (D) 的作用。 让

 [
 x=a+b(r-l)
 ]

 是添加到间隔的最后一个值。 在位置 (l) 处，差值变化 (a)。 在(l+1)和(r)之间，每个相邻差值改变(b)。 在 (r+1) 处，差值变化 (-x)。 这样整个更新就变成了

 [
 D_l\mathrel{+}=a,
 ]

 [
 D_{l+1},\ldots,D_r\mathrel{+}=b,
 ]

 [
 D_{r+1}\mathrel{-}=x。 
]

 长算术级数已减少为一个范围加法和两个点变化。 

我们仍然需要确定 (D) 范围内的每个值是否为零。 一种方便的方法是保持差值的平方和。 由于每个 (D_i^2) 都是非负的，

 [
 \sum D_i^2=0
 ]

 当每个 (D_i) 为零时恰好成立。 

惰性线段树可以同时维护

 [
 S=\sum D_i
 ]

 和

 [
 Q=\sum D_i^2
 ]

 对于每个细分市场。 如果我们将 (x) 添加到长度为 (k) 的段中的每个值，则

 [
 S'=S+kx
 ]

 和

 [
 Q' = Q+2xS+kx^2。 
]

 这在每个访问的段上提供了恒定时间的惰性传播。 每次算术级数更新需要 (O(\log n)) 次线段树操作，每个等式查询需要一次 (O(\log n)) 范围查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(nq)) | (O(n)) | (O(n)) | 太慢了|
 | 差异数组+惰性线段树| (O(q\log n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 通过其差值数组（D）表示当前数组，其中（D_i=A_i-A_{i-1}）。 最初，每个 (D_i) 都为零，因为每个 (A_i) 都为零。 
2. 在 (D) 上构建惰性线段树。 每个节点存储其差值之和、平方和以及表示对整个段的待添加的惰性值。 更新平方和时需要求和。 
3. 对于类型 2 更新 ((l,r,a,b))，计算最后添加的值

 [
 x=a+b(r-l)。 
]

 将 (a) 添加到 (D_l)，将 (b) 添加到每个 (D_i)（l+1\le i\le r），并在 (r<n) 时从 (D_{r+1}) 中减去 (x)。 

这准确地代表了将算术级数添加到 (A_l,\ldots,A_r) 的效果。 特殊情况（r=n）在维护的数组内没有（D_{n+1}），因此简单地省略了最终校正。 

1. 对于类型 1 查询 ((l,r))，查询 (D_{l+1},\ldots,D_r) 上的线段树。 如果 (l=r)，则范围不包含差异，因此答案立即为 (1)。 
2. 否则，检查返回的平方和。 如果为零，则区间中的每个差值都为零，因此 (A) 的所有对应值都相等。 如果为正，则至少有一对相邻的值不同，因此间隔不是恒定的。 

### 为什么它有效

不变的是线段树总是代表精确的当前差值数组（D）。 算术级数更新仅在左边界、均匀地穿过其内部以及紧接右边界之后的位置改变（D），因此三个相应的线段树更新保留该不变性。 对于任何查询区间，当且仅当每个相邻差值 (D_{l+1},\ldots,D_r) 为零时，(A_l,\ldots,A_r) 才相等。 由于线段树存储它们的平方和并且平方是非负的，因此在恒定情况下该和恰好为零。 因此每个查询答案都是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegmentTree:
    def __init__(self, n):
        self.n = n
        size = 4 * n + 5
        self.s = [0] * size
        self.sq = [0] * size
        self.lazy = [0] * size

    def _apply(self, node, left, right, x):
        length = right - left + 1
        old_sum = self.s[node]

        self.sq[node] += 2 * x * old_sum + length * x * x
        self.s[node] = old_sum + length * x
        self.lazy[node] += x

    def _push(self, node, left, right):
        x = self.lazy[node]
        if x == 0 or left == right:
            return

        mid = (left + right) >> 1
        self._apply(node << 1, left, mid, x)
        self._apply(node << 1 | 1, mid + 1, right, x)
        self.lazy[node] = 0

    def add(self, ql, qr, x):
        if ql > qr:
            return
        self._add(1, 1, self.n, ql, qr, x)

    def _add(self, node, left, right, ql, qr, x):
        if ql <= left and right <= qr:
            self._apply(node, left, right, x)
            return

        self._push(node, left, right)
        mid = (left + right) >> 1

        if ql <= mid:
            self._add(node << 1, left, mid, ql, qr, x)
        if qr > mid:
            self._add(node << 1 | 1, mid + 1, right, ql, qr, x)

        lc = node << 1
        rc = lc | 1
        self.s[node] = self.s[lc] + self.s[rc]
        self.sq[node] = self.sq[lc] + self.sq[rc]

    def query_sq(self, ql, qr):
        if ql > qr:
            return 0
        return self._query_sq(1, 1, self.n, ql, qr)

    def _query_sq(self, node, left, right, ql, qr):
        if ql <= left and right <= qr:
            return self.sq[node]

        self._push(node, left, right)
        mid = (left + right) >> 1
        result = 0

        if ql <= mid:
            result += self._query_sq(node << 1, left, mid, ql, qr)
        if qr > mid:
            result += self._query_sq(node << 1 | 1, mid + 1, right, ql, qr)

        return result

def solve():
    n, q = map(int, input().split())
    seg = SegmentTree(n)
    out = []

    for _ in range(q):
        query = list(map(int, input().split()))
        typ = query[0]

        if typ == 1:
            l, r = query[1], query[2]

            if l == r:
                out.append("1")
                continue

            # A[l..r] is constant iff
            # D[l+1], ..., D[r] are all zero.
            value = seg.query_sq(l + 1, r)
            out.append("1" if value == 0 else "0")

        else:
            l, r, a, b = query[1:]

            # D[l] += a
            seg.add(l, l, a)

            # D[l+1..r] += b
            if l + 1 <= r:
                seg.add(l + 1, r, b)

            # The value added at position r is the final term.
            last = a + b * (r - l)

            # D[r+1] -= last
            if r < n:
                seg.add(r + 1, r + 1, -last)

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```线段树用零初始化，因为原始数组完全由零组成，因此每个初始差值都为零。 不需要单独的构建过程。 

这`_apply`函数是核心的延迟传播操作。 假设一个节点表示值 (D_1,\ldots,D_k)，以及当前和 (S) 和平方和 (Q)。 将 (x) 添加到每个值后，新的平方和为

 [
 \sum(D_i+x)^2
 =\sum D_i^2+2x\sum D_i+kx^2。 
]

 该代码在修改之前保存旧的总和，因为该公式需要 (S) 的旧值。 

对于更新，`seg.add(l, l, a)`处理差异数组的左边界。 范围更新`seg.add(l + 1, r, b)`处理所有内部差异的共同增量。 最后，`seg.add(r + 1, r + 1, -last)`解释了进程在位置 (r) 之后停止的事实。 

这`r < n`条件是必不可少的。 没有保持差异 (D_{n+1})，因为原始数组以 (n) 结束。 忘记此检查将创建无效的段树索引。 

对于类型 1 查询，相关差异从 (l+1) 开始，而不是 (l)。 (D_l=A_l-A_{l-1}) 告诉我们 (A_l) 与查询区间之前的元素有何不同，这与查询区间本身是否恒定无关。 

Python 整数具有任意精度，因此潜在的大平方值不会溢出。 经过多次操作后，最大的数组值可能会变得比原始 (10^8) 更新参数大得多，这使得固定宽度 32 位表示在使用它的语言中不安全。 

## 工作示例

 ### 示例 1

 输入是```
5 3
2 1 3 4 1
1 1 3
1 4 5
```更新后，(A=[4,9,14,0,0])。 其差分数组为

 [
 D=[4,5,5,-14,0]。 
]

 踪迹是：

 | 运营| (A) 概念上| 相关(D)范围| 平方和 | 回答 |
 | --- | --- | --- | --- | --- |
 | 初始| ([0,0,0,0,0]) | 全部为零| 0 | |
 |`2 1 3 4 1`| ([4,9,14,0,0]) | (D_2,D_3=5,5) | 50 | 50 |
 |`1 1 3`| 不变| (D_2,D_3=5,5) | 50 | 50 0 |
 |`1 4 5`| 不变| (D_5=0) | 0 | 1 |

 第一个查询发现位置 1 到 3 内存在非零差异，因此这些值不可能全部相等。 第二个查询包含两个零值元素，因此其唯一相关差异为零。 

### 构造样本 2

 考虑```
4 5
1 1 4
2 1 4 2 0
1 2 3
2 2 3 -1 2
1 1 4
```踪迹是：

 | 运营| (A) 概念上| 相关(D)范围| 平方和 | 回答 |
 | --- | --- | --- | --- | --- |
 | 初始| ([0,0,0,0]) | 全部为零| 0 | |
 |`1 1 4`| ([0,0,0,0]) | (D_2,D_3,D_4=0,0,0) | 0 | 1 |
 |`2 1 4 2 0`| ([2,2,2,2]) | (D_2,D_3,D_4=0,0,0) | 0 | |
 |`1 2 3`| 不变| (D_3=0) | 0 | 1 |
 |`2 2 3 -1 2`| ([2,1,3,2]) | (D_2,D_3,D_4=-1,2,-1) | 6 | |
 |`1 1 4`| 不变| (D_2,D_3,D_4=-1,2,-1) | 6 | 0 |

 第一次更新为 (b=0)，因此它更改了值，但使每个内部差值都等于 0。 第二次更新引入了非零差异，平方和立即检测到它们。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(q\log n)) | 每次更新最多执行 3 个范围添加，每个查询执行一次线段树查询。 |
 | 空间| (O(n)) | (O(n)) | 线段树为每个节点存储恒定量的信息。 |

 使用 (n,q\le2\cdot10^5)，该解决方案在每个查询中仅执行对数数量的树操作，而不是触及间隔中的每个数组位置。 线段树使用 (O(n)) 内存，完全在 512 MB 限制之内。 

## 测试用例```python
import sys
import io

class SegmentTree:
    def __init__(self, n):
        size = 4 * n + 5
        self.n = n
        self.s = [0] * size
        self.sq = [0] * size
        self.lazy = [0] * size

    def apply(self, node, left, right, x):
        length = right - left + 1
        old_sum = self.s[node]
        self.sq[node] += 2 * x * old_sum + length * x * x
        self.s[node] = old_sum + length * x
        self.lazy[node] += x

    def push(self, node, left, right):
        x = self.lazy[node]
        if x == 0 or left == right:
            return
        mid = (left + right) // 2
        self.apply(node * 2, left, mid, x)
        self.apply(node * 2 + 1, mid + 1, right, x)
        self.lazy[node] = 0

    def add(self, ql, qr, x):
        if ql > qr:
            return
        self._add(1, 1, self.n, ql, qr, x)

    def _add(self, node, left, right, ql, qr, x):
        if ql <= left and right <= qr:
            self.apply(node, left, right, x)
            return

        self.push(node, left, right)
        mid = (left + right) // 2

        if ql <= mid:
            self._add(node * 2, left, mid, ql, qr, x)
        if qr > mid:
            self._add(node * 2 + 1, mid + 1, right, ql, qr, x)

        self.s[node] = self.s[node * 2] + self.s[node * 2 + 1]
        self.sq[node] = self.sq[node * 2] + self.sq[node * 2 + 1]

    def query_sq(self, ql, qr):
        if ql > qr:
            return 0
        return self._query_sq(1, 1, self.n, ql, qr)

    def _query_sq(self, node, left, right, ql, qr):
        if ql <= left and right <= qr:
            return self.sq[node]

        self.push(node, left, right)
        mid = (left + right) // 2
        ans = 0

        if ql <= mid:
            ans += self._query_sq(node * 2, left, mid, ql, qr)
        if qr > mid:
            ans += self._query_sq(node * 2 + 1, mid + 1, right, ql, qr)

        return ans

def solve(data):
    inp = io.StringIO(data)
    n, q = map(int, inp.readline().split())
    seg = SegmentTree(n)
    ans = []

    for _ in range(q):
        v = list(map(int, inp.readline().split()))

        if v[0] == 1:
            l, r = v[1], v[2]
            if l == r:
                ans.append("1")
            else:
                ans.append("1" if seg.query_sq(l + 1, r) == 0 else "0")
        else:
            _, l, r, a, b = v

            seg.add(l, l, a)

            if l + 1 <= r:
                seg.add(l + 1, r, b)

            last = a + b * (r - l)

            if r < n:
                seg.add(r + 1, r + 1, -last)

    return "\n".join(ans)

# Provided sample.
assert solve(
    """5 3
2 1 3 4 1
1 1 3
1 4 5
"""
) == "0\n1", "sample 1"

# Minimum-size input. A one-element interval is always constant.
assert solve(
    """1 4
1 1 1
2 1 1 100000000 100000000
1 1 1
1 1 1
"""
) == "1\n1\n1", "minimum-size case"

# All values remain equal after a constant update.
assert solve(
    """5 4
2 1 5 7 0
1 1 5
2 2 4 -7 0
1 2 4
"""
) == "1\n1", "all-equal values"

# Boundary-sensitive case. The update starts at 2 and ends at 4.
assert solve(
    """4 4
2 2 4 1 1
1 2 4
1 1 4
1 3 4
"""
) == "0\n0\n0", "boundary conditions"

# Cancellation and negative values.
assert solve(
    """4 6
2 1 4 5 -2
1 1 4
2 2 3 -3 0
1 2 3
2 2 3 1 0
1 1 4
"""
) == "0\n1\n0", "negative updates and cancellation"

# Large input size. The update makes the whole array equal,
# then the full-range query must still be answered efficiently.
n = 200000
large_input = f"{n} 2\n2 1 {n} 12345678 0\n1 1 {n}\n"
assert solve(large_input) == "1", "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 4 ...`|`1 1 1`| 单元素区间和 (n=1) |
 | 不断添加|`1 1`| (b=0) 和保持平等 |
 | 从 2 更新到 4 |`0 0 0`| 左右边界，加上未触及的元素 |
 | 负面更新 |`0 1 0`| 签名价值和取消|
 | (n=200000) | (n=200000) |`1`| 最大尺寸输入和对数处理 |

 ## 边缘情况

 对于单元素区间，例如```
1 2
1 1 1
```查询没有要比较的相邻对。 实现通过返回 (1) 显式处理此问题。 在差分数组方面，所需范围 (D_{l+1},\ldots,D_r) 为空。 

为了不断进步，请考虑```
3 2
2 1 3 5 0
1 1 3
```更新添加了 ([5,5,5])，因此 (A=[5,5,5])。 差值数组中，(D_1=5)，而(D_2=D_3=0)。 该查询仅检查(D_2,D_3)，获得平方和等于0，并返回(1)。 

对于触及最后位置的更新，请考虑```
3 2
2 2 3 4 2
1 2 3
```新数组为 ([0,4,6])。 更新将 (D_2) 更改为 (4)，将 (D_3) 更改为 (2)。 维护的结构中没有(D_4)，因此跳过右边界校正。 该查询检查 (D_3=2)，其平方为正，并返回 (0)。 

对于从位置 1 开始的范围，请考虑```
3 2
2 1 3 7 3
1 1 3
```数组变为 ([7,10,13])，差异为 (D_2=3,D_3=3)。 该查询正确检查差异数组的位置 (2) 到 (3)。 它不检查 (D_1=A_1-A_0=7)，因为 (A_0) 位于查询区间之外。 

对于负值，请考虑```
3 2
2 1 3 5 -2
1 1 3
```数组变为([5,3,1])，因此其相关差异为(D_2=-2)和(D_3=-2)。 它们的平方和为 (8)，为正，答案为 (0)。 平方和方法不依赖于差值是正还是负，这正是我们任意签名更新所需要的。
