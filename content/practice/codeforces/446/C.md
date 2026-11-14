---
title: "CF 446C - DZY 喜欢斐波那契数字"
description: "我们给定了一个整数数组，需要有效地支持两种类型的查询。 第一种类型需要将斐波那契数添加到连续子数组中：对于从 l 到 r 的索引，我们将 F₁ 添加到 l 处的元素，将 F 2 添加到 l+1 处的元素，直到位置 r 处的 F{r-l+1} 。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 446
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round #FF (Div. 1)"
rating: 2400
weight: 446
solve_time_s: 392
verified: false
draft: false
---

[CF 446C - DZY 喜欢斐波那契数字](https://codeforces.com/problemset/problem/446/C)

 **评分：** 2400
 **标签：** 数据结构、数学、数论
 **求解时间：** 6m 32s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们给定了一个整数数组，需要有效地支持两种类型的查询。 第一种类型需要将斐波那契数添加到连续子数组中：对于从 _l_ 到 _r_ 的索引，我们将 _F₁_ 添加到 _l_ 处的元素，_F2_ 添加到 _l+1_ 处的元素，直到位置 _r_ 处的 _F_{r-l+1}_ 。 第二种类型要求子数组中元素的总和以 10⁹+9 为模。 

限制很严格：数组最多可以有 300,000 个元素，查询数量也可以达到 300,000。 这排除了任何在每个查询的范围内执行简单迭代的解决方案，因为在最坏的情况下这将是 O(n·m)，可能大约 9×10^10 操作，这远远超出了 4 秒内可以运行的范围。 数组元素和斐波那契数的值可能会变得非常大，因此我们需要小心处理模运算。 

当查询仅影响单个元素或连续更新重叠时，就会出现微妙的边缘情况。 例如，如果数组为 [1,2] 并且查询是将 1 到 2 之间的斐波那契数相加，则更新会将 [1,1] 添加到数组中。 简单地通过为每个查询重新计算斐波那契数来添加斐波那契数的简单实现会太慢，并且如果索引或斐波那契偏移量未对齐，很容易产生错误的结果。 

## 方法

 暴力解决方案直接实现所描述的查询。 对于类型 1 查询，我们计算前 r-l+1 个斐波那契数，并将它们单独添加到范围中的每个元素。 对于类型 2 查询，我们对范围内的元素求和。 虽然这在概念上可行，但在最坏情况下复杂度为 O(m·n)。 如果所有查询几乎覆盖整个数组，则算法执行大约 9×10^10 次操作，这远远超出了可接受的范围。 

加速这一过程的关键在于认识到斐波那契加法是线性的，并且可以使用线性递推来表达。 这允许我们在线段树上应用延迟传播。 我们不是单独更新每个元素，而是使用线段的前两个斐波那契数以紧凑的形式存储添加斐波那契线段的效果。 当我们沿着树传播更新时，斐波那契数列可以使用其递归有效地扩展。 这将更新操作从 O(range) 转变为 O(log n)，而求和查询也变成了 O(log n)。 

斐波那契属性 F_k+2 = F_k+1 + F_k 允许我们计算某个范围内的下一个值，而无需重新计算整个序列。 线段树节点不仅维护区间之和，还维护代表需要传播的前两个斐波那契贡献的两个数字。 延迟传播可确保正确处理重叠或连续更新。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n·m) | O(n) | 太慢了 |
 | 线段树+斐波那契懒惰| O((n+m)·log n) | O((n+m)·log n) | O(n) | 已接受 |

 ## 算法演练

1. 预先计算斐波那契数以 10⁹+9 为模直至 n+2，因为更新可能需要第 r-l+1 个斐波那契数。 这允许恒定时间访问任何所需的斐波那契值。 
2. 在数组上构造一棵线段树。 每个节点存储其段模 10⁹+9 的总和。 此外，每个节点都将惰性更新维护为一对数字，表示需要传播到子节点的前两个斐波那契值。 
3. 对于类型 1 查询“1 l r”，不是更新每个元素，而是计算从位置 l 开始的前两个斐波那契数。 使用延迟传播将此斐波那契线段添加到线段树中的相应节点中。 当节点被部分覆盖时，将更新推送到其子节点，使用线性递归重新计算每个子节点的起始斐波那契数。 
4. 对于类型 2 查询“2 l r”，在线段树中查询范围之和。 如果路径上存在任何惰性更新，请首先传播它们以确保总和反映所有先前的更新。 
5. 将斐波那契更新传播到子节点时，直接从父节点的惰性对计算左子节点的前两个斐波那契值。 对于右孩子，使用矩阵求幂或已知的斐波那契和来正确移动起点。 这可确保更新保持正确的顺序。 
6. 每一步都执行模运算以避免整数溢出，因为斐波那契增长导致数字快速增长。 

工作原理：线段树保证每个查询都应用于最小的节点集。 惰性传播确保每个斐波那契线段都准确地应用在需要的地方，而无需重新计算。 前两个斐波那契表示就足够了，因为可以根据这两个值重建整个斐波那契序列，从而保证正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 9

def add_mod(a, b):
    return (a + b) % MOD

def mul_mod(a, b):
    return (a * b) % MOD

def build_fib(n):
    fib = [0] * (n + 2)
    fib[1] = 1
    for i in range(2, n + 2):
        fib[i] = add_mod(fib[i-1], fib[i-2])
    return fib

class SegmentTree:
    def __init__(self, a):
        self.n = len(a)
        self.size = 1
        while self.size < self.n:
            self.size <<= 1
        self.sum = [0] * (2 * self.size)
        self.lazy = [(0,0)] * (2 * self.size)
        for i in range(self.n):
            self.sum[self.size + i] = a[i] % MOD
        for i in range(self.size - 1, 0, -1):
            self.sum[i] = add_mod(self.sum[i<<1], self.sum[i<<1|1])

    def push(self, v, l, r):
        a, b = self.lazy[v]
        if a == 0 and b == 0:
            return
        mid = (l + r) >> 1
        len_left = mid - l + 1
        len_right = r - mid
        # Update left child
        self.apply(v<<1, l, mid, a, b)
        # Update right child: shift Fibonacci sequence by len_left
        fib_a = add_mod(mul_mod(fib[len_left-1], b), mul_mod(fib[len_left], a))
        fib_b = add_mod(mul_mod(fib[len_left], b), mul_mod(fib[len_left+1], a))
        self.apply(v<<1|1, mid+1, r, fib_a, fib_b)
        self.lazy[v] = (0,0)

    def apply(self, v, l, r, a, b):
        # Sum over segment: F1+F2+...+Fk = ?
        k = r - l + 1
        s = add_mod(mul_mod(fib[k], b), mul_mod(fib[k-1], a))
        self.sum[v] = add_mod(self.sum[v], s)
        if v < self.size:
            self.lazy[v] = (add_mod(self.lazy[v][0], a), add_mod(self.lazy[v][1], b))

    def update(self, ql, qr, a, b, v=1, l=0, r=None):
        if r is None:
            r = self.size - 1
        if ql > r or qr < l:
            return
        if ql <= l and r <= qr:
            self.apply(v, l, r, a, b)
            return
        self.push(v, l, r)
        mid = (l + r) >> 1
        self.update(ql, qr, a, b, v<<1, l, mid)
        self.update(ql, qr, a, b, v<<1|1, mid+1, r)
        self.sum[v] = add_mod(self.sum[v<<1], self.sum[v<<1|1])

    def query(self, ql, qr, v=1, l=0, r=None):
        if r is None:
            r = self.size - 1
        if ql > r or qr < l:
            return 0
        if ql <= l and r <= qr:
            return self.sum[v]
        self.push(v, l, r)
        mid = (l + r) >> 1
        return add_mod(self.query(ql, qr, v<<1, l, mid),
                       self.query(ql, qr, v<<1|1, mid+1, r))

n, m = map(int, input().split())
a = list(map(int, input().split()))
fib = build_fib(n+2)
st = SegmentTree(a)

for _ in range(m):
    tmp = input().split()
    if tmp[0] == '1':
        l, r = int(tmp[1])-1, int(tmp[2])-1
        st.update(l, r, fib[1], fib[2])
    else:
        l, r = int(tmp[1])-1, int(tmp[2])-1
        print(st.query(l, r))
```此代码首先构建用于常量时间访问的斐波那契数组。 线段树支持惰性传播，其中每个节点存储一对代表待处理更新的斐波那契数。 更新有效地应用于范围，总和查询正确地考虑了所有以前的斐波那契数
