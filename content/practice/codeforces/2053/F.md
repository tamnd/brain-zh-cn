---
title: "CF 2053F - 认真矩阵补"
description: "对于行 $i$，令： - $zi$ = 该行中 -1 单元格的数量。 - $cnti(u)$ = 值 $u$ 已固定出现的次数。 假设我们决定用相同的值 $pi$ 填充行 $i$ 中的每个空白。 这不是限制。"
date: "2026-06-08T08:26:49+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "dp", "greedy", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 2053
codeforces_index: "F"
codeforces_contest_name: "Good Bye 2024: 2025 is NEAR"
rating: 2600
weight: 2053
solve_time_s: 80
verified: true
draft: false
---

[CF 2053F - 认真的矩阵补集](https://codeforces.com/problemset/problem/2053/F)

 **评分：** 2600
 **标签：** 暴力破解、数据结构、dp、贪心、实现、数学
 **求解时间：** 1m 20s
 **已验证：** 是的

 ## 解决方案
 ## 关键观察

 对于一行$i$， 让：

-$z_i$= 数量`-1`该行中的单元格。 
-$cnt_i(u)$= 已经固定的值出现的次数$u$。 

假设我们决定行中的每个空白$i$填充相同的值$p_i$。 

这不是限制。 因为美度表达式与行计数呈线性关系，所以任何最优分布$z_i$空白可以完全移动到给出最大系数的单个值上。 

因此每一行都由一个选定的值表示$p_i$。 

最终计算值$u$在行中$i$变成$$c_{u,i}=cnt_i(u)+ \begin{cases} z_i,&u=p_i\\ 0,&u\neq p_i \end{cases}$$## 相邻两行的贡献

 对于行$i-1$和$i$,$$\sum_u c_{u,i-1}c_{u,i}$$扩展到$$C_i +z_{i-1}\,cnt_i(p_{i-1}) +z_i\,cnt_{i-1}(p_i) +z_{i-1}z_i[p_{i-1}=p_i]$$在哪里$$C_i=\sum_u cnt_{i-1}(u)\,cnt_i(u)$$是一个与选择无关的常数。 

定义$$dp_i(v)$$作为考虑行的最大美感$1\dots i$当行$i$选择值$v$。 

然后$$dp_i(v) = C_i + z_i\,cnt_{i-1}(v) + \max_p \Big( dp_{i-1}(p) + z_{i-1}\,cnt_i(p) + z_{i-1}z_i[p=v] \Big)$$让$$A(p)=dp_{i-1}(p)+z_{i-1}cnt_i(p).$$然后$$dp_i(v) = C_i + z_i cnt_{i-1}(v) + \max \Big( \max_p A(p), A(v)+z_{i-1}z_i \Big).$$这是关键的简化。 

## 数据结构

 对于每一行转换，我们需要：$$A(v)$$为所有人$v$， 和$$\max_v A(v).$$大多数值永远不会连续出现。 只有当前行或上一行中出现的值才重要。 

标准接受的解决方案存储所有 DP 值$1\ldots k$在惰性线段树中支持：

 - 添加范围，
 - 点添加，
 - 具有全局值的 chmax 范围，
 - 全局最大查询。 

从行的过渡$i-1$划船$i$然后可以完全按照已接受的 Codeforces 解决方案进行实施$$O((\text{distinct values in row }i)+ (\text{distinct values in row }i-1)) \log k.$$由于所有测试用例的矩阵单元总数最多为$6\cdot10^5$，总体复杂度为$$O((nm)\log k),$$它在限制范围内舒适地适合。 

## 已接受的 Python 3 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, n):
        self.n = n
        m = 4 * n + 5
        self.mx = [0] * m
        self.add = [0] * m
        self.tagmax = [0] * m

    def _apply(self, p, addv, maxv):
        self.mx[p] = max(self.mx[p] + addv, maxv)
        self.tagmax[p] = max(self.tagmax[p] + addv, maxv)
        self.add[p] += addv

    def _push(self, p):
        if self.add[p] != 0 or self.tagmax[p] != 0:
            a = self.add[p]
            m = self.tagmax[p]
            self._apply(p * 2, a, m)
            self._apply(p * 2 + 1, a, m)
            self.add[p] = 0
            self.tagmax[p] = 0

    def modify(self, p, l, r, ql, qr, addv, maxv):
        if ql <= l and r <= qr:
            self._apply(p, addv, maxv)
            return

        self._push(p)
        mid = (l + r) >> 1

        if ql <= mid:
            self.modify(p * 2, l, mid, ql, qr, addv, maxv)
        if qr > mid:
            self.modify(p * 2 + 1, mid + 1, r, ql, qr, addv, maxv)

        self.mx[p] = max(self.mx[p * 2], self.mx[p * 2 + 1])

    def clear(self):
        self.mx[:] = [0] * len(self.mx)
        self.add[:] = [0] * len(self.add)
        self.tagmax[:] = [0] * len(self.tagmax)

t = int(input())

for _ in range(t):
    n, m, k = map(int, input().split())
    a = [list(map(int, input().split())) for _ in range(n)]

    seg = SegTree(k)

    prev = {}

    for row in a:
        cur = {}

        for x in row:
            cur[x] = cur.get(x, 0) + 1

        z_prev = prev.get(-1, 0)
        z_cur = cur.get(-1, 0)

        for v, c in cur.items():
            if v != -1:
                seg.modify(1, 1, k, v, v, z_prev * c, 0)

        best = seg.mx[1]

        seg.modify(1, 1, k, 1, k, z_prev * z_cur, 0)
        seg.modify(1, 1, k, 1, k, 0, best)

        for v, c in cur.items():
            if v != -1:
                seg.modify(1, 1, k, 1, k, prev.get(v, 0) * c, 0)

        for v, c in prev.items():
            if v != -1:
                seg.modify(1, 1, k, v, v, z_cur * c, 0)

        prev = cur

    print(seg.mx[1])
```这是从上面的转换派生出来的标准接受的 DP + 惰性线段树实现。
