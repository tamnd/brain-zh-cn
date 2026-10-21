---
title: "CF 1136E - 娜斯蒂亚尚未书写传奇"
description: "我们有一个数组 a 和另一个数组 k。 该数组始终满足单调类型约束：对于每个相邻对，$$a{i+1} ge ai + ki$$。 有两个操作。 第一个操作将一个位置 a[i] 增加某个值 x。"
date: "2026-06-12T04:02:41+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 1136
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 546 (Div. 2)"
rating: 2200
weight: 1136
solve_time_s: 120
verified: true
draft: false
---

[CF 1136E - Nastya 没有写传奇](https://codeforces.com/problemset/problem/1136/E)

 **评分：** 2200
 **标签：** 二分查找、数据结构
 **求解时间：** 2m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个数组`a`和另一个数组`k`。 

该数组始终满足单调类型约束：$$a_{i+1} \ge a_i + k_i$$对于每一个相邻的对。 

有两个操作。 

第一次操作增加一个仓位`a[i]`按某个值`x`。 增加之后，下一个元素可能会违反约束。 如果确实如此，我们必须提高`a[i+1]`恢复约束的最小值。 这种变化可能会迫使`a[i+2]`增加，等等。 更新向右传播，直到约束再次有效。 

第二个操作要求连续段的总和。 

困难在于两者`n`查询数量最多为`100000`。 单个更新可能会影响数组的几乎整个后缀。 明确执行该传播需要`O(n)`每次更新的时间，变成`O(nq)`在最坏的情况下，大约`10^10`运营。 这已经远远超出了极限。 

关键的挑战是以更新和范围总和都可以在对数时间内处理的形式表示传播的结构。 

一个微妙的点是更新永远不会减少任何元素。 一旦头寸增加，以后就不会变小。 这种单调性是高效数据结构存在的原因。 

另一个容易犯的错误是认为传播在改变一个邻居后立即停止。 考虑：```
a = [5, 7, 9]
k = [3, 3]
```添加后`2`到`a[1]`，我们得到：```
a[1] = 7
```现在：```
a[2] < a[1] + 3
```所以`a[2]`变成`10`。 

然后：```
a[3] < a[2] + 3
```所以`a[3]`变成`13`。 

效果达到整个后缀。 

另一个危险的情况来自于负值`k`。```
a = [10, 20]
k = [-100]
```约束条件是```
20 >= -90
```这已经是事实了。 

增加`a[1]`稍微可能仍然满足约束条件。 假设每次更新至少传播一步的解决方案是不正确的。 

最后一个陷阱是多次重叠更新后的范围总和。 实际的数组值正在隐式更改。 如果我们只存储更新位置而忘记引发的后缀修改，则后面的求和查询就会出错。 

## 方法

 暴力解决方案遵循字面意思。 

当我们收到`+ i x`，我们增加`a[i]`，然后向右扫描。 每当$$a_{j+1} < a_j + k_j$$我们替换`a[j+1]`经过`a_j + k_j`。 

对于求和查询，我们只需添加请求的元素即可。 

这是正确的，因为它直接模拟了该过程。 问题在于复杂性。 一次更新可能会触及所有剩余位置。 和`100000`更新，最坏的情况是关于$$100000 \times 100000 = 10^{10}$$运营。 

为了更快地找到东西，我们需要了解约束的结构。 

定义前缀和数组：$$d_1 = 0$$

$$d_i = \sum_{j=1}^{i-1} k_j$$现在定义$$b_i = a_i - d_i$$原来的状况$$a_{i+1} \ge a_i + k_i$$变成$$b_{i+1} \ge b_i$$所以经过这个变换之后，整个数组`b`根本就是不减的。 

更新有什么作用？ 

增加`a[i]`经过`x`增加`b[i]`经过`x`。 

然后传播再次强制执行非递减属性。 右边每个值小于新值的位置`b[i]`精确地提高到该值。 

换句话说，更新变成：

 “添加`x`在位置`i`，然后替换从以下位置开始的最大连续段`i`一个常数值。”

 现在结构更加清晰了。 

自从`b`总是不减的，我们可以通过二分查找找到最后受影响的位置。 更新成为对一个值的范围分配。 范围总和变成加权总和，因为$$a_i = b_i + d_i.$$数组`d`永远不会改变，因此它的贡献可以预先计算。 动态部分完全在内部`b`。 

我们需要一个数据结构来支持：

 1. 常量的范围赋值。 
2.范围求和查询。 
3. 对非递减数组中的值进行二分查找。 

惰性线段树提供了这三个功能。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(nq) | O(n) | 太慢了 |
 | 最佳 | O(q log² n) | O(q log² n) | O(n) | 已接受 |

 ## 算法演练

 ### 转型

 让$$d_1 = 0$$和$$d_i = k_1 + k_2 + \dots + k_{i-1}.$$定义$$b_i = a_i - d_i.$$给出的保证意味着`b`开始不减。 

### 线段树内容

 线段树存储：

 1. 总和`b`在每个段上。 
2. 每段的最大值。 
3. 惰性范围分配标签。 

最大值让我们可以二分搜索更新范围的末尾。 

### 处理更新

 假设我们收到：```
+ i x
```1.读取当前值`b[i]`。 
2. 设置$$v = b[i] + x.$$3.找到最大的位置`r`使得中的每个元素`[i,r]`严格小于`v`。 

自从`b`是非递减的，受影响的位置形成一个连续的段。 
4. 赋值`v`到整个范围`[i,r]`。 

分配后，数组保持不减。 

### 处理求和查询

 对于```
s l r
```我们需要$$\sum_{i=l}^{r} a_i.$$自从$$a_i=b_i+d_i,$$我们计算$$\sum b_i$$从线段树和$$\sum d_i$$来自静态前缀和数组。 

他们的总和就是答案。 

### 为什么它有效

 变换后的数组`b`总是不减的。 增加一个元素只能违反其右侧的单调性。 每个小于新值的位置都必须恰好变为该值，并且每个较大的位置保持不变。 由于数组已排序，因此受影响的位置形成一个连续的区间。 将该间隔分配给新值可以准确地再现语句中描述的传播。 

线段树总是存储当前的`b`数组，每个查询都会计算$$a_i=b_i+d_i$$确切地。 自从`d`永远不会改变，从动态部分重建总和`b`和静态部分`d`对于每个操作都是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegmentTree:
    def __init__(self, arr):
        self.n = len(arr) - 1

        size = 4 * self.n + 5
        self.sum = [0] * size
        self.mx = [0] * size
        self.lazy = [None] * size

        self._build(1, 1, self.n, arr)

    def _build(self, v, tl, tr, arr):
        if tl == tr:
            val = arr[tl]
            self.sum[v] = val
            self.mx[v] = val
            return

        tm = (tl + tr) // 2
        self._build(v * 2, tl, tm, arr)
        self._build(v * 2 + 1, tm + 1, tr, arr)
        self._pull(v)

    def _pull(self, v):
        self.sum[v] = self.sum[v * 2] + self.sum[v * 2 + 1]
        self.mx[v] = max(self.mx[v * 2], self.mx[v * 2 + 1])

    def _apply(self, v, tl, tr, val):
        self.sum[v] = (tr - tl + 1) * val
        self.mx[v] = val
        self.lazy[v] = val

    def _push(self, v, tl, tr):
        if self.lazy[v] is None or tl == tr:
            return

        tm = (tl + tr) // 2
        val = self.lazy[v]

        self._apply(v * 2, tl, tm, val)
        self._apply(v * 2 + 1, tm + 1, tr, val)

        self.lazy[v] = None

    def assign(self, l, r, val):
        self._assign(1, 1, self.n, l, r, val)

    def _assign(self, v, tl, tr, l, r, val):
        if l > r:
            return

        if l == tl and r == tr:
            self._apply(v, tl, tr, val)
            return

        self._push(v, tl, tr)

        tm = (tl + tr) // 2

        self._assign(v * 2, tl, tm, l, min(r, tm), val)
        self._assign(v * 2 + 1, tm + 1, tr,
                     max(l, tm + 1), r, val)

        self._pull(v)

    def query_sum(self, l, r):
        return self._query_sum(1, 1, self.n, l, r)

    def _query_sum(self, v, tl, tr, l, r):
        if l > r:
            return 0

        if l == tl and r == tr:
            return self.sum[v]

        self._push(v, tl, tr)

        tm = (tl + tr) // 2

        return (
            self._query_sum(v * 2, tl, tm, l, min(r, tm))
            + self._query_sum(v * 2 + 1, tm + 1, tr,
                              max(l, tm + 1), r)
        )

    def query_point(self, pos):
        return self._query_point(1, 1, self.n, pos)

    def _query_point(self, v, tl, tr, pos):
        if tl == tr:
            return self.mx[v]

        self._push(v, tl, tr)

        tm = (tl + tr) // 2

        if pos <= tm:
            return self._query_point(v * 2, tl, tm, pos)
        return self._query_point(v * 2 + 1, tm + 1, tr, pos)

    def first_ge(self, l, value):
        return self._first_ge(1, 1, self.n, l, value)

    def _first_ge(self, v, tl, tr, l, value):
        if tr < l or self.mx[v] < value:
            return -1

        if tl == tr:
            return tl

        self._push(v, tl, tr)

        tm = (tl + tr) // 2

        res = self._first_ge(v * 2, tl, tm, l, value)
        if res != -1:
            return res

        return self._first_ge(v * 2 + 1, tm + 1, tr, l, value)

def solve():
    n = int(input())

    a = list(map(int, input().split()))
    k = list(map(int, input().split()))

    d = [0] * (n + 1)

    for i in range(2, n + 1):
        d[i] = d[i - 1] + k[i - 2]

    b = [0] * (n + 1)

    for i in range(1, n + 1):
        b[i] = a[i - 1] - d[i]

    seg = SegmentTree(b)

    pref_d = [0] * (n + 1)
    for i in range(1, n + 1):
        pref_d[i] = pref_d[i - 1] + d[i]

    q = int(input())
    out = []

    for _ in range(q):
        s = input().split()

        if s[0] == '+':
            pos = int(s[1])
            x = int(s[2])

            cur = seg.query_point(pos)
            nv = cur + x

            nxt = seg.first_ge(pos + 1, nv)

            if nxt == -1:
                r = n
            else:
                r = nxt - 1

            seg.assign(pos, r, nv)

        else:
            l = int(s[1])
            r = int(s[2])

            dyn = seg.query_sum(l, r)
            static = pref_d[r] - pref_d[l - 1]

            out.append(str(dyn + static))

    sys.stdout.write("\n".join(out))

solve()
```变换之后，整个问题就围绕着非减数组展开`b`。 线段树存储以下的总和和最大值`b`，以及惰性范围分配。 

更新首先读取一个位置的当前值。 新传播的值就是该值加上`x`。 然后，我们搜索右侧的第一个位置，其值至少已经是新值。 该位置之前的所有内容都必须提高。 如果不存在这样的位置，则更新到达数组的末尾。 

搜索使用存储的段最大值。 因为`b`是非递减的，第一个位置至少有值`nv`唯一确定受影响的间隔。 

范围和查询分为动态贡献`b`和静态贡献`d`。 后者使用前缀和预先计算一次。 

一个常见的实施错误是忘记更新范围包括修改的位置本身。 另一个正在搜索`pos`而不是`pos + 1`，这将立即找到新更新的元素并产生一个空间隔。 

## 工作示例

 ### 示例 1

 输入：```
3
1 2 3
1 -1
5
s 2 3
+ 1 2
s 1 2
+ 3 1
s 2 3
```我们计算：```
d = [0, 1, 0]
b = [1, 1, 3]
```| 运营| 之前 | b 行动| b 之后 |
 | ---| ---| ---| ---|
 | s 2 3 | s 2 3 | [1,1,3]| 总和| [1,1,3]|
 | + 1 2 | [1,1,3]| 设置位置 1..2 至 3 | [3,3,3]|
 | 1 2 | s 1 2 [3,3,3]| 总和| [3,3,3]|
 | + 3 1 | [3,3,3]| 设置位置 3 至 4 | [3,3,4]|
 | s 2 3 | s 2 3 | [3,3,4]| 总和| [3,3,4]|

 该跟踪显示了传播如何成为转换后的数组中的简单范围分配。 

### 通过多个位置传播

 考虑：```
a = [5, 7, 9, 11]
k = [2, 2, 2]
```然后：```
d = [0,2,4,6]
b = [5,5,5,5]
```申请：```
+ 2 3
```| 步骤| 价值|
 | ---| ---|
 | 当前 b[2] | 5 |
 | 新价值| 8 |
 | 第一个位置 ≥ 8 | 无 |
 | 指定范围 | [2,4]|
 | 最终b | [5,8,8,8] |

 重建：```
a = [5,10,12,14]
```这正是反复执行原始约束的结果。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(q log² n) | O(q log² n) | 每次更新都会执行一次对数搜索和一次对数分配 |
 | 空间| O(n) | 线段树和前缀数组 |

 和`n, q ≤ 100000`,`log n`大约17岁。甚至`O(q log² n)`舒适地保持在限制内，导致只有几千万个原始操作。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    # paste solve() implementation and capture stdout
    pass

# sample 1
assert run(
"""3
1 2 3
1 -1
5
s 2 3
+ 1 2
s 1 2
+ 3 1
s 2 3
"""
) == "5\n7\n8"

# minimum size
assert run(
"""2
1 5
3
2
s 1 2
s 2 2
"""
) == "6\n5"

# propagation to end
assert run(
"""4
5 7 9 11
2 2 2
2
+ 2 3
s 1 4
"""
) == "41"

# negative k
assert run(
"""2
10 20
-100
2
+ 1 1
s 1 2
"""
) == "31"

# single position update
assert run(
"""3
1 10 20
0 0
2
+ 3 5
s 1 3
"""
) == "36"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 最小尺寸数组 | 直接求和| 最小有效实例 |
 | 传播结束 | 41 | 41 后缀更新到达`n`|
 | 负 k | 31 | 没有不必要的传播|
 | 单仓更新 | 36 | 36 右边界处理 |

 ## 边缘情况

 考虑：```
2
10 20
-100
2
+ 1 1
s 1 2
```约束已经非常宽松了。 增加后`a[1]`到`11`，我们还有：```
20 >= -89
```所以没有任何东西传播。 变换后的形式：```
d = [0,-100]
b = [10,120]
```更新位置 1 会产生：```
b = [11,120]
```分配不会进一步扩展，因为下一个值已经更大。 总和变为`31`，它与真实数组匹配。 

现在考虑完整后缀传播：```
4
5 7 9 11
2 2 2
1
+ 2 3
```最初：```
b = [5,5,5,5]
```新值是`8`。 没有后面的元素至少具有值`8`，所以受影响的区间是`[2,4]`。 分配后：```
b = [5,8,8,8]
```重构给出：```
a = [5,10,12,14]
```这正是原始语句中重复传播所产生的结果。 即使每个剩余元素发生变化，线段树更新也符合预期行为。
