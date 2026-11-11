---
title: "CF 2137F - 前缀最大不变性"
description: "对于任何数组$x$，其前缀最大值的序列是完全确定的。 在位置$i$处，前缀最大值为$$max(x1,x2,dots,xi)。$$我们可以构建另一个数组$z$，其前缀最大值与$x$的前缀最大值相同。"
date: "2026-06-08T02:32:07+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "combinatorics", "data-structures", "sortings"]
categories: ["algorithms"]
codeforces_contest: 2137
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 1047 (Div. 3)"
rating: 1900
weight: 2137
solve_time_s: 102
verified: true
draft: false
---

[CF 2137F - 前缀最大不变性](https://codeforces.com/problemset/problem/2137/F)

 **评级：** 1900
 **标签：** 二分查找、组合数学、数据结构、排序
 **求解时间：** 1m 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于任意数组$x$，其前缀最大值的序列就完全确定了。 在位置$i$，前缀最大值为$$\max(x_1,x_2,\dots,x_i).$$我们可以构建另一个数组$z$其前缀最大值与$x$。 在所有这样的数组中$z$，我们想要最大化位置的数量，其中$z_i=y_i$。 该最大值称为$f(x,y)$。 

实际任务要大得多。 我们有两个数组$a$和$b$长度$n$。 对于每个子数组$[l,r]$，我们形成$$x=a_l,a_{l+1},\dots,a_r,$$和$$y=b_l,b_{l+1},\dots,b_r.$$我们必须总结$f(x,y)$在所有子数组上。 

第一个挑战是了解单个位置允许使用哪些值，同时保留前缀最大值。 第二个挑战是避免显而易见的事情$O(n^2)$子数组的枚举。 

所有测试用例的总长度最多为$2\cdot 10^5$。 二次算法的执行大致如下$4\cdot 10^{10}$在最坏的情况下进行操作，这是完全不可行的。 我们需要一些接近的东西$O(n \log n)$。 

当先前已经出现等于当前前缀最大值的值时，会出现微妙的边缘情况。 

考虑：```
a = [2, 2]
b = [0, 1]
```对于第二个位置我们可以设置$z_2=1$，因为第一个元素已经使前缀最大值等于$2$。 如果粗心的解决方案只是寻找严格更大的先前值，则会错误地拒绝这种情况。 

另一个重要的情况是当$b_i$大于$a_i$。```
a = [5, 1]
b = [0, 4]
```第二个位置可以变成$4$只是因为有一个更早的值$5$保持前缀最大值不变。 如果没有这样的先前值，则增加$z_i$会改变前缀最大序列。 

## 方法

 蛮力方法很简单。 枚举每个子数组$[l,r]$。 对于该子数组，确定可以匹配的最大位置数。 即使我们以某种方式在线性时间内处理一个子数组，也已经有$O(n^2)$子数组，导致$O(n^3)$工作。 

蛮力在概念上起作用的原因是$f(x,y)$只是每个位置的独立决策的总和。 是否位置$i$可以等于$y_i$仅取决于该位置之前的前缀最大结构。 

这个观察是关键。 

假设我们检查一个位置$i$在一些子数组内。 

如果$a_i=b_i$，那么我们就已经匹配了，没有做任何改变。 

如果$a_i\neq b_i$，我们什么时候可以强制$z_i=b_i$？ 

让$M$是位置之前的最大前缀$i$。 

如果$M\ge \max(a_i,b_i)$，那么我们就可以自由选择$z_i=b_i$。 较早的前缀最大值仍然占主导地位，因此前缀最大值序列不会改变。 

如果没有更早的值达到$\max(a_i,b_i)$，然后定位$i$它本身负责创造一个新的最大值，并且它的价值受到限制。 在那种情况下$z_i=b_i$是不可能的。 

因此，当满足以下条件之一时，职位就会做出贡献：

 -$a_i=b_i$。 
- 存在一个较早的元素，其值至少为$\max(a_i,b_i)$。 

现在问题变成了对每个索引进行计数$i$，有多少子数组使这个条件成立。 

让$$T_i=\max(a_i,b_i).$$定义$p_i$作为之前最右边的索引$i$其值至少为$T_i$。 

如果不存在这样的索引，$p_i=0$。 

对于任何包含的子数组$i$， 位置$i$当且仅当左端点位于或之前$p_i$。 然后，符合条件的较早元素仍保留在子数组内。 

那么职位的贡献$i$是：

-$i(n-i+1)$如果$a_i=b_i$。 
-$p_i(n-i+1)$否则。 

唯一剩下的任务是计算每个$p_i$高效。 

我们从左到右处理数组。 对于每个值，我们存储它出现的最新位置。 寻找$p_i$，我们至少需要所有值中最大的存储位置$T_i$。 

因为所有的值最多都是$2n$，值坐标上的线段树支持：

 - 点更新：值的最新位置，
 - 范围最大查询$[T_i,2n]$。 

这给出了$O(\log n)$每个索引。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^3)$或者更糟|$O(n)$| 太慢了|
 | 最佳|$O(n\log n)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 从左到右处理数组。 
2、对于职位$i$, 计算$$T_i=\max(a_i,b_i).$$3、查询取值范围上的线段树$[T_i,2n]$。 

结果是最右边的前一个索引，其值至少为$T_i$。 叫它$p$。 
4. 如果$a_i=b_i$， 添加$$i\cdot(n-i+1)$$到答案。 

每个子数组包含$i$在这个岗位上做出贡献。 
5.否则添加$$p\cdot(n-i+1).$$任意起始位置$l\le p$在子数组中保留一个合格的较早元素，以及每个结束位置$r\ge i$是有效的。 
6. 插入当前值$a_i$通过更新坐标进入线段树$a_i$有位置$i$。 
7. 继续，直到处理完所有位置。 

### 为什么它有效

 对于固定子数组和固定位置，唯一重要的是该子数组中较早的元素是否已经到达$\max(a_i,b_i)$。 

如果存在这样的元素，则前面的前缀最大值$i$已经足够大了。 我们可以自由选择$z_i=b_i$不影响任何前缀最大值。 

如果不存在这样的元素，则位置$i$其本身决定了前缀最大级别。 将其更改为$b_i\neq a_i$会改变前缀最大序列，这是被禁止的。 

因此，每个位置都独立做出贡献。 有效左端点的数量恰好是$p_i$，有效右端点的数量为$n-i+1$。 将所有头寸的这些贡献相加即可准确计算所需的总数。 

线段树计算每个$p_i$正确，因为它总是严格存储之前位置中每个值的最新出现$i$。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, n):
        self.n = n
        self.seg = [0] * (4 * n)

    def update(self, idx, val, node, l, r):
        if l == r:
            self.seg[node] = max(self.seg[node], val)
            return

        mid = (l + r) >> 1
        if idx <= mid:
            self.update(idx, val, node * 2, l, mid)
        else:
            self.update(idx, val, node * 2 + 1, mid + 1, r)

        self.seg[node] = max(
            self.seg[node * 2],
            self.seg[node * 2 + 1]
        )

    def query(self, ql, qr, node, l, r):
        if ql <= l and r <= qr:
            return self.seg[node]

        mid = (l + r) >> 1
        res = 0

        if ql <= mid:
            res = max(res, self.query(ql, qr, node * 2, l, mid))
        if qr > mid:
            res = max(res, self.query(ql, qr, node * 2 + 1, mid + 1, r))

        return res

def solve():
    t = int(input())

    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))

        mx = 2 * n
        seg = SegTree(mx)

        ans = 0

        for i in range(1, n + 1):
            ai = a[i - 1]
            bi = b[i - 1]

            if ai == bi:
                ans += i * (n - i + 1)
            else:
                threshold = max(ai, bi)
                p = seg.query(threshold, mx, 1, 1, mx)
                ans += p * (n - i + 1)

            seg.update(ai, i, 1, 1, mx)

        print(ans)

solve()
```线段树按值而不是位置进行索引。 按价值计算$v$，我们将最新的索引存储在其中$a_j=v$到目前为止已经出现了。 

查询结束$[T_i,2n]$至少返回所有先前值中最大的位置$T_i$。 那正是$p_i$。 

一个常见的错误是使用第一个出现的位置而不是最近出现的位置。 我们需要最右边的限定索引，因为直到该索引的每个起始位置都有效，准确给出$p_i$选择。 

另一个简单的错误是忘记值的边界是$2n$，不是由$n$。 线段树必须覆盖整个值范围。 

Python 整数自动处理答案大小。 贡献子阵的总数大约可以达到$n^3$，因此 32 位整数在许多语言中都会溢出。 

## 工作示例

 ### 示例 1```
a = [5, 3, 1]
b = [4, 2, 1]
```| 我| 一个[我] | b[i] | T=最大(a,b) | p| 贡献 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 5 | 4 | 5 | 0 | 0 |
 | 2 | 3 | 2 | 3 | 1 | 2 |
 | 3 | 1 | 1 | - | - | 3 |

 全部的：$$0+2+3=5.$$这与示例答案相符。 

第二个位置有贡献，因为该值$5$在它已经保持前缀最大值之前，允许我们更改当前值。 

### 示例 2```
a = [2, 2]
b = [1, 1]
```| 我| 一个[我] | b[i] | T | p| 贡献 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 2 | 1 | 2 | 0 | 0 |
 | 2 | 2 | 1 | 2 | 1 | 1 |

 全部的：$$1.$$第二个位置演示了为什么“大于或等于”是正确的条件。 较早的值等于$2$，不更大，但它仍然保留前缀最大值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n\log n)$| 每个位置一次线段树查询和一次更新 |
 | 空间|$O(n)$| 基于值的线段树$1 \ldots 2n$|

 自从总共$n$所有测试用例最多是$2\cdot 10^5$，总体运行时间约为$2\cdot 10^5 \log(2\cdot 10^5)$，它完全符合极限。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    input_data = io.StringIO(inp)
    output_data = io.StringIO()

    sys.stdin = input_data
    sys.stdout = output_data

    class SegTree:
        def __init__(self, n):
            self.n = n
            self.seg = [0] * (4 * n)

        def update(self, idx, val, node, l, r):
            if l == r:
                self.seg[node] = max(self.seg[node], val)
                return
            mid = (l + r) >> 1
            if idx <= mid:
                self.update(idx, val, node * 2, l, mid)
            else:
                self.update(idx, val, node * 2 + 1, mid + 1, r)
            self.seg[node] = max(self.seg[node * 2],
                                 self.seg[node * 2 + 1])

        def query(self, ql, qr, node, l, r):
            if ql <= l and r <= qr:
                return self.seg[node]
            mid = (l + r) >> 1
            res = 0
            if ql <= mid:
                res = max(res, self.query(ql, qr, node * 2, l, mid))
            if qr > mid:
                res = max(res, self.query(ql, qr, node * 2 + 1, mid + 1, r))
            return res

    input = sys.stdin.readline

    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))

        seg = SegTree(2 * n)
        ans = 0

        for i in range(1, n + 1):
            ai = a[i - 1]
            bi = b[i - 1]

            if ai == bi:
                ans += i * (n - i + 1)
            else:
                p = seg.query(max(ai, bi), 2 * n, 1, 1, 2 * n)
                ans += p * (n - i + 1)

            seg.update(ai, i, 1, 1, 2 * n)

        print(ans)

    return output_data.getvalue()

# provided sample
assert run(
"""6
3
5 3 1
4 2 1
5
1 2 3 4 5
1 2 3 4 5
6
7 1 12 10 5 8
9 2 4 3 6 5
1
1
2
6
5 1 2 6 3 4
3 1 6 5 2 4
2
2 2
1 1
"""
) == """5
35
26
0
24
1
"""

# minimum size
assert run(
"""1
1
1
1
"""
) == """1
"""

# minimum size, unequal
assert run(
"""1
1
1
2
"""
) == """0
"""

# equal values earlier should count
assert run(
"""1
2
2 2
1 1
"""
) == """1
"""

# all equal arrays
assert run(
"""1
3
4 4 4
4 4 4
"""
) == """10
"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |$n=1$, 等值 | 1 | 最小有效实例 |
 |$n=1$，不同的值| 0 | 不存在先前的元素 |
 |`[2,2]`和`[1,1]`| 1 | 与之前的最大值相等就足够了 |
 | 所有值均相等 | 10 | 10 每个位置对每个包含子数组都有贡献 |

 ## 边缘情况

 考虑：```
a = [2, 2]
b = [1, 1]
```在第二个位置，阈值是$2$。 线段树查询查找索引处的前一个匹配项$1$， 所以$p=1$。 该算法计算一个有效子数组。 

在该子数组内，第一个值已经使前缀最大值等于$2$，让第二个值变为$1$。 这就是为什么条件必须是“至少”而不是“严格更大”。 

现在考虑：```
a = [5, 1]
b = [0, 4]
```对于第二个位置，阈值是$4$。 查询找到索引$1$， 自从$5 \ge 4$。 因此$p=1$，并且该职位有贡献。 

较早的值$5$保留前缀最大值，同时当前值从$1$到$4$。 

最后考虑：```
a = [3, 1]
b = [0, 5]
```位置二的阈值是$5$。 没有更早的值达到$5$，所以查询返回$0$。 该算法没有任何贡献。 

这是正确的。 将第二个值设置为$5$将创建一个新的前缀最大值，更改所需的前缀最大序列。
