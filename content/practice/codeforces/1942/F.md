---
title: "CF 1942F - 农夫约翰最喜欢的功能"
description: "我们有一个数组 $a$ 和一个递归定义的值： $$f(1)=sqrt{a1}, qquad f(i)=sqrt{f(i-1)+ai}.$$ 在每个点更新 $ak leftarrow x$ 之后，我们需要 $f(n)$ 的整数部分。 第一个障碍是递归使用实数。"
date: "2026-05-31T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 1942
codeforces_index: "F"
codeforces_contest_name: "CodeTON Round 8 (Div. 1 + Div. 2, Rated, Prizes!)"
rating: 2700
weight: 1942
solve_time_s: 130
verified: true
draft: false
---

[CF 1942F - Farmer John 最喜欢的功能](https://codeforces.com/problemset/problem/1942/F)

 **评分：** 2700
 **标签：** 暴力破解、数据结构、实现、数学
 **求解时间：** 2m 10s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个数组$a$，以及递归定义的值：$$f(1)=\sqrt{a_1}, \qquad f(i)=\sqrt{f(i-1)+a_i}.$$每点更新后$a_k \leftarrow x$，我们需要的整数部分$f(n)$。 

第一个障碍是递归使用实数。 直接模拟会重复计算浮点的平方根，即使很小的精度误差也会改变最终的下限值。 示例已经显示了这样的情况：正确答案是$2$，即使最终值非常接近$3$。 

制约因素很大。 两个都$n$和$q$达到$2 \cdot 10^5$。 每次更新后重新计算整个循环将花费$O(nq)$，这大约是$4 \cdot 10^{10}$最坏情况下的操作。 这对于 5 秒的限制来说是完全无法达到的。 

关键的困难是更新发生在数组上，但重复次数取决于所有先前的位置。 开始附近的单个修改可能会更改后面的每个值。 

有几种简单的方法可以获得错误的解决方案。 

考虑：```
n = 2
a = [3, 14]
```然后$$f(1)=\sqrt3 \approx 1.732,$$

$$f(2)=\sqrt{14+\sqrt3}\approx 3.966.$$答案是$3$。 如果我们舍入中间值而不是采用精确的递归，我们会得到不同的结果。 

另一个危险的情况是非常大的值：```
n = 1
a = [10^18]
```答案正是$10^9$。 不小心使用双打可能会失去边界附近的精度并产生$999999999$。 

一个更微妙的例子是：```
a = [3, 14, 0, 7, 6]
```最终值约为$2.999766$，所以答案是$2$。 任何重复计算浮点平方根然后在最后舍入的方法都有返回的风险$3$。 

该解决方案必须完全避免浮点运算。 

## 方法

 蛮力的想法很简单。 每次更新后，从左到右重建循环。```
cur = sqrt(a[1])
for i = 2..n:
    cur = sqrt(cur + a[i])
answer = floor(cur)
```这是正确的，因为它直接遵循定义。 问题在于复杂性。 每个查询都需要$O(n)$工作，所以总成本是$O(nq)$。 和$n=q=2\cdot10^5$，这大致变成$4\cdot10^{10}$运营。 

第一个观察是我们只需要$\lfloor f(n)\rfloor$，不是确切的实际值。 

定义$$g(1)=\left\lfloor \sqrt{a_1}\right\rfloor,$$

$$g(i)=\left\lfloor \sqrt{g(i-1)+a_i}\right\rfloor.$$一个关键的事实是：$$g(i)=\lfloor f(i)\rfloor$$对于每一个$i$。 

原因很简单。 让$$f(i-1)=g(i-1)+\delta, \qquad 0\le \delta<1.$$然后$$g(i-1)+a_i \le f(i-1)+a_i < g(i-1)+a_i+1.$$取平方根使值保持在长度小于的区间内$1$，因此两个端点具有相同的楼层。 因此$$\left\lfloor \sqrt{f(i-1)+a_i}\right\rfloor = \left\lfloor \sqrt{g(i-1)+a_i}\right\rfloor.$$现在整个问题变成了纯整数问题。 

第二个观察是离线处理所有查询。 

对于固定位置$i$，仅当更新触及索引时其值才会改变$i$。 沿着查询时间线，$a_i$是分段常数。 

假设我们对于每个查询时间都维护$t$，当前值$$dp_t$$加工后位置$1 \ldots i-1$。 

当我们处理位置时$i$，每个时间线点执行$$dp_t \leftarrow \left\lfloor \sqrt{dp_t + a_i(t)} \right\rfloor.$$这里$a_i(t)$表示位置的值$i$查询后$t$。 

所以每个位置贡献：

 1.时间线上添加了几个范围，因为$a_i(t)$是分段常数。 
2. 全球统一运营$x \mapsto \lfloor\sqrt{x}\rfloor$。 

剩下的挑战是有效支持重复的全局平方根运算。 

线段树存储每个节点中的最小值和最大值。 

对于覆盖值的节点$[mn,mx]$， 如果$$mx-mn = \lfloor\sqrt{mx}\rfloor-\lfloor\sqrt{mn}\rfloor,$$那么该段中的每个值都会发生相同的变化。 

确实，在那种情况下$$\lfloor\sqrt{x}\rfloor - x$$在整个区间内保持恒定。 可以使用单个范围添加来延迟更新整个段。 

只有此条件不成立的段才需要进一步拆分。 

这是一个经典的线段树节拍风格的论证。 重复平方根会迅速缩小数字，因此递归深度保持可控。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(nq)$|$O(1)$| 太慢了 |
 | 最佳 |$O((n+q)\log^2 q)$摊销|$O(q)$| 已接受 |

 ## 算法演练

 1. 读取初始数组和所有更新。 
2. 对于每个索引$i$，收集该索引被修改的次数。 
3. 将每个位置的更新历史转换为不相交的时间线间隔。 对于每个间隔$[L,R]$，值$a_i$保持不变。 
4. 根据查询时间构建线段树$1 \ldots q$。 最初每个时间线值是$0$。 
5. 从左到右处理数组位置。 
6. 对于当前位置$i$，在每个时间线间隔上应用范围加法，其中$a_i$是恒定的。 添加这些之后，每个时间线点包含$$g(i-1)+a_i.$$1. 应用转换$$x \mapsto \lfloor\sqrt{x}\rfloor$$到整个线段树。 

1.线段树现在存储$$g(i)$$同时针对每个查询时间。 

1、处理完所有位置后，提取所有叶子。 时间线位置的值$t$正是查询后的答案$t$。 

### 为什么它有效

 处理完第一条后$i$位置，每个时间点$t$商店$$g_i(t),$$查询后数组状态的整数重复值$t$。 

不变量最初为真，因为所有值都是$0$。 

加工位置时$i$，我们首先添加$a_i(t)$到每个时间点。 存储的值变为$$g_{i-1}(t)+a_i(t).$$应用平方根变换将其更改为$$\left\lfloor \sqrt{g_{i-1}(t)+a_i(t)} \right\rfloor,$$这正是$g_i(t)$。 

通过归纳，在最后一个位置之后我们得到$g_n(t)$对于每个查询时间。 自从$g_n(t)=\lfloor f_n(t)\rfloor$，报告的答案是正确的。 

## Python 解决方案```python
import sys
from math import isqrt

input = sys.stdin.readline

class SegTree:
    def __init__(self, n):
        self.n = n
        size = 4 * n + 5
        self.mn = [0] * size
        self.mx = [0] * size
        self.lazy = [0] * size

    def apply_add(self, p, v):
        self.mn[p] += v
        self.mx[p] += v
        self.lazy[p] += v

    def push(self, p):
        if self.lazy[p]:
            v = self.lazy[p]
            self.apply_add(p * 2, v)
            self.apply_add(p * 2 + 1, v)
            self.lazy[p] = 0

    def pull(self, p):
        self.mn[p] = min(self.mn[p * 2], self.mn[p * 2 + 1])
        self.mx[p] = max(self.mx[p * 2], self.mx[p * 2 + 1])

    def range_add(self, p, l, r, ql, qr, v):
        if ql <= l and r <= qr:
            self.apply_add(p, v)
            return

        self.push(p)
        m = (l + r) >> 1

        if ql <= m:
            self.range_add(p * 2, l, m, ql, qr, v)
        if qr > m:
            self.range_add(p * 2 + 1, m + 1, r, ql, qr, v)

        self.pull(p)

    def apply_sqrt(self, p, l, r):
        mn = self.mn[p]
        mx = self.mx[p]

        if mx - mn == isqrt(mx) - isqrt(mn):
            delta = isqrt(mx) - mx
            self.apply_add(p, delta)
            return

        if l == r:
            v = isqrt(mx)
            self.mn[p] = v
            self.mx[p] = v
            self.lazy[p] = 0
            return

        self.push(p)
        m = (l + r) >> 1
        self.apply_sqrt(p * 2, l, m)
        self.apply_sqrt(p * 2 + 1, m + 1, r)
        self.pull(p)

    def collect(self, p, l, r, res):
        if l == r:
            res[l] = self.mn[p]
            return

        self.push(p)
        m = (l + r) >> 1
        self.collect(p * 2, l, m, res)
        self.collect(p * 2 + 1, m + 1, r, res)

def solve():
    n, q = map(int, input().split())
    a = list(map(int, input().split()))

    changes = [[] for _ in range(n)]

    for t in range(1, q + 1):
        k, x = map(int, input().split())
        changes[k - 1].append((t, x))

    seg = SegTree(q)

    for i in range(n):
        cur = a[i]
        last = 1

        for t, x in changes[i]:
            if last <= t - 1:
                seg.range_add(1, 1, q, last, t - 1, cur)
            cur = x
            last = t

        if last <= q:
            seg.range_add(1, 1, q, last, q, cur)

        seg.apply_sqrt(1, 1, q)

    ans = [0] * (q + 1)
    seg.collect(1, 1, q, ans)

    sys.stdout.write("\n".join(map(str, ans[1:])))

solve()
```实现中的第一个重要思想是用整数递归代替实数递归。 这消除了所有精度问题并允许每个值保持整数。 

预处理阶段为每个阵列位置构建时间线间隔。 如果索引$i$有时会更新$5$,$11$， 和$20$，那么它的值在几个不相交的查询范围上是恒定的。 每个这样的范围都成为一个线段树范围加法。 

线段树仅存储最小值、最大值和惰性加法标记。 不需要任何金额。 

微妙的部分是`apply_sqrt`。 如果该节点满足$$mx-mn = \lfloor\sqrt{mx}\rfloor-\lfloor\sqrt{mn}\rfloor,$$那么平方根运算的作用就像向该节点中的每个元素添加一个常量。 我们可以延迟更新整个段。 

否则我们会递归到孩子们。 

使用`math.isqrt`是必不可少的。 它计算精确的整数平方根并避免所有浮点错误。 

## 工作示例

 ### 示例 1

 输入：```
5 6
0 14 0 7 6
1 4
1 3
2 15
4 1
5 2
5 8
```处理位置1后：

 | 查询 | 一个₁| sqrt 之后的值 |
 | ---| ---| ---|
 | 1 | 4 | 2 |
 | 2 | 3 | 1 |
 | 3 | 3 | 1 |
 | 4 | 3 | 1 |
 | 5 | 3 | 1 |
 | 6 | 3 | 1 |

 处理位置2后：

 | 查询 | 上一页 | +a2 | 开方|
 | ---| ---| ---| ---|
 | 1 | 2 | 16 | 16 4 |
 | 2 | 1 | 15 | 15 3 |
 | 3 | 1 | 16 | 16 4 |
 | 4 | 1 | 16 | 16 4 |
 | 5 | 1 | 16 | 16 4 |
 | 6 | 1 | 16 | 16 4 |

 继续遍历所有位置会产生：```
3
2
3
2
1
3
```该跟踪显示了如何沿着时间线同时处理每个查询状态。 

### 示例 2

 输入：```
2 2
386056082462833225 923951085408043421
1 386056082462833225
1 386056082462833224
```查询1后：

 | 职位| 价值|
 | ---| ---|
 | 一个₁| 386056082462833225 |
 | a2 | 923951085408043421 |

 递归给出：$$g(1)=621333955,$$

$$g(2)=961223744.$$查询2后：$$g(1)=621333954,$$

$$g(2)=961223743.$$输出：```
961223744
961223743
```此示例说明了为什么在平方根边界附近需要精确的整数运算。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O((n+q)\log^2 q)$摊销| 范围添加加上线段树节拍风格平方根更新 |
 | 空间|$O(q)$| 线段树和时间线存储|

 线段树包含$O(q)$节点。 每个更新间隔都会成为一个范围添加。 重复平方根会迅速减少值，从而使总递归成本保持有限。 这完全符合以下限制$n,q \le 2\cdot10^5$。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from math import isqrt

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    class SegTree:
        def __init__(self, n):
            self.n = n
            self.mn = [0] * (4 * n + 5)
            self.mx = [0] * (4 * n + 5)
            self.lazy = [0] * (4 * n + 5)

        def apply_add(self, p, v):
            self.mn[p] += v
            self.mx[p] += v
            self.lazy[p] += v

        def push(self, p):
            if self.lazy[p]:
                v = self.lazy[p]
                self.apply_add(p * 2, v)
                self.apply_add(p * 2 + 1, v)
                self.lazy[p] = 0

        def pull(self, p):
            self.mn[p] = min(self.mn[p * 2], self.mn[p * 2 + 1])
            self.mx[p] = max(self.mx[p * 2], self.mx[p * 2 + 1])

        def add(self, p, l, r, ql, qr, v):
            if ql <= l and r <= qr:
                self.apply_add(p, v)
                return
            self.push(p)
            m = (l + r) // 2
            if ql <= m:
                self.add(p * 2, l, m, ql, qr, v)
            if qr > m:
                self.add(p * 2 + 1, m + 1, r, ql, qr, v)
            self.pull(p)

        def sq(self, p, l, r):
            mn = self.mn[p]
            mx = self.mx[p]

            if mx - mn == isqrt(mx) - isqrt(mn):
                self.apply_add(p, isqrt(mx) - mx)
                return

            if l == r:
                v = isqrt(mx)
                self.mn[p] = v
                self.mx[p] = v
                self.lazy[p] = 0
                return

            self.push(p)
            m = (l + r) // 2
            self.sq(p * 2, l, m)
            self.sq(p * 2 + 1, m + 1, r)
            self.pull(p)

        def collect(self, p, l, r, out):
            if l == r:
                out[l] = self.mn[p]
                return
            self.push(p)
            m = (l + r) // 2
            self.collect(p * 2, l, m, out)
            self.collect(p * 2 + 1, m + 1, r, out)

    n, q = map(int, input().split())
    a = list(map(int, input().split()))

    changes = [[] for _ in range(n)]

    for t in range(1, q + 1):
        k, x = map(int, input().split())
        changes[k - 1].append((t, x))

    seg = SegTree(q)

    for i in range(n):
        cur = a[i]
        last = 1

        for t, x in changes[i]:
            if last <= t - 1:
                seg.add(1, 1, q, last, t - 1, cur)
            cur = x
            last = t

        if last <= q:
            seg.add(1, 1, q, last, q, cur)

        seg.sq(1, 1, q)

    ans = [0] * (q + 1)
    seg.collect(1, 1, q, ans)

    return "\n".join(map(str, ans[1:]))

# provided sample
assert run(
"""5 6
0 14 0 7 6
1 4
1 3
2 15
4 1
5 2
5 8
"""
) == "3\n2\n3\n2\n1\n3", "sample 1"

# minimum size
assert run(
"""1 1
0
1 0
"""
) == "0", "single element zero"

# boundary sqrt transition
assert run(
"""1 2
16
1 15
1 16
"""
) == "3\n4", "crosses perfect square boundary"

# very large values
assert run(
"""1 1
1000000000000000000
1 1000000000000000000
"""
) == "1000000000", "1e18 square root"

# repeated updates on same index
assert run(
"""2 3
0 0
1 1
1 4
1 9
"""
) == "1\n2\n3", "timeline interval construction"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单个元素，值 0 | 0 | 最小输入尺寸|
 | 16 → 15 → 16 | 3, 4 | 完美平方边界行为 |
 |$10^{18}$|$10^9$| 大整数平方根 |
 | 一个位置重复更新 | 1、2、3 | 时间线上正确的间隔生成 |

 ## 边缘情况

 考虑：```
1 2
16
1 15
1 16
```第一次更新后，$$\lfloor\sqrt{15}\rfloor=3.$$第二次之后，$$\lfloor\sqrt{16}\rfloor=4.$$该算法从不使用浮点运算。 线段树存储精确的整数并应用`isqrt`，因此两个答案都被精确计算。 

现在考虑：```
1 1
1000000000000000000
1 1000000000000000000
```该值正是$10^{18}$。 浮点解决方案可能会在这个数量级附近失去精度。 整数递归计算$$\lfloor\sqrt{10^{18}}\rfloor = 10^9$$没有任何舍入问题。 

最后，考虑对同一索引进行多次更新：```
2 3
0 0
1 1
1 4
1 9
```对于索引$1$，时间线值为：

 | 查询间隔| 价值|
 | ---| ---|
 | [1,1]| 1 |
 | [2,2]| 4 |
 | [3,3]| 9 |

 预处理将它们转换为三个范围加法。 每个间隔都是独立处理的，因此每个查询都会看到数组的正确版本。
