---
title: "CF 104386B - 随机阵列"
description: "我们希望多重集中的第 k 个最小元素由以下形式组成： - X：值 xi 每个重复 si 次 - Y：每个查询转换为 alpha yj + beta 的值，每个重复 tj 次 我们从不扩展数组。 相反，我们回答：有多少个元素 ≤ v？"
date: "2026-07-01T02:49:54+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104386
codeforces_index: "B"
codeforces_contest_name: "TheForces Round #14 (Cool-Forces)"
rating: 0
weight: 104386
solve_time_s: 178
verified: true
draft: false
---

[CF 104386B - 随机数组](https://codeforces.com/problemset/problem/104386/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 58s
 **已验证：** 是的

 ## 解决方案
 ## 关键思想（不变）

 我们想要多重集中的第 k 个最小元素：

 - X：值`x_i`每个重复`s_i`次
 - Y：每个查询的值转换为`alpha * y_j + beta`，每次重复`t_j`次

 我们从不扩展数组。 相反，我们回答：

 > 有多少个元素 ≤ v？ 

这在 v 中是单调的，所以我们对答案进行二分查找。 

## 关键修复

 对于每个查询，二分搜索范围必须包括：

 - 所有 x 值
 - 所有变换后的 y 值

 所以我们计算：

 最小可能值：```
min(x[0], alpha*y[0] + beta)
```最大可能值：```
max(x[-1], alpha*y[-1] + beta)
```这保证了二分搜索始终正确收敛。 

## 修正了 Python 3 解决方案```python
import sys
input = sys.stdin.readline
from bisect import bisect_right

def build_prefix(w):
    pref = [0] * (len(w) + 1)
    for i, val in enumerate(w):
        pref[i + 1] = pref[i] + val
    return pref

def count_leq(arr, pref, x):
    return pref[bisect_right(arr, x)]

def solve():
    N, M, Q = map(int, input().split())

    x = list(map(int, input().split()))
    sx = list(map(int, input().split()))

    y = list(map(int, input().split()))
    ty = list(map(int, input().split()))

    px = build_prefix(sx)
    py = build_prefix(ty)

    for _ in range(Q):
        a, b, k = map(int, input().split())

        def count(v):
            # X contribution
            cx = count_leq(x, px, v)

            # Y contribution (invert transform)
            limit = (v - b) // a
            cy = count_leq(y, py, limit)

            return cx + cy

        # compute safe bounds for this query
        low = min(x[0], a * y[0] + b)
        high = max(x[-1], a * y[-1] + b)

        # expand bounds slightly to avoid edge misses
        lo = low - 1
        hi = high + 1

        while lo + 1 < hi:
            mid = (lo + hi) // 2
            if count(mid) >= k:
                hi = mid
            else:
                lo = mid

        print(hi)

if __name__ == "__main__":
    solve()
```## 到底出了什么问题

 1. **不保证输出路径**

 以前的版本依赖于从未完全连接到判断执行的函数结构，从而导致空输出。 
2. **不安全的二分查找范围**

 使用固定的全局范围，例如`[-1e12, 1e12]`在多次变换下是不可靠的。 在实践中，某些查询会将所有值移出该范围，特别是当`beta`很大。 
3. **正确的不变量（保留）**

 功能`count(v)`是单调的`v`，所以二分查找仍然有效。 只是实现边界是错误的。 

这个更正后的版本保留了相同的算法思想，修复了执行流程，并确保搜索空间始终包含每个查询的真实答案。
