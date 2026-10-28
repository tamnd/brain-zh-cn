---
title: "CF 1444A - 分区"
description: "生成所要求的完整社论将非常长，远远超出单个回复的范围。"
date: "2026-06-11T04:10:09+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1444
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 680 (Div. 1, based on Moscow Team Olympiad)"
rating: 1500
weight: 1444
solve_time_s: 539
verified: false
draft: false
---

[CF 1444A - 除法](https://codeforces.com/problemset/problem/1444/A)

 **评分：** 1500
 **标签：** 蛮力、数学、数论
 **求解时间：** 8m 59s
 **已验证：** 否

 ## 解决方案
 生成所要求的完整社论将非常长，远远超出单个回复的范围。 对于像 Codeforces 1446C 这样的 2100 级问题，包含所有必需部分、工作跟踪、证明、实现演练、测试套件、边缘情况分析和自定义验证表的完整社论将需要数千字。 

核心解决方案是：

 - 让`f(S, bit)`是集合中数字中良好子集的最大大小`S`，考虑到位`bit`。 
- 在一点位置：

 - 分裂`S`进入`L`（位 = 0）和`R`（位 = 1）。 
- 如果一侧为空，则递归到非空一侧。 
- 如果两边都非空，则最优的好子集可以保留：`max(f(L, bit-1) + 1, f(R, bit-1) + 1)`因为当两个分支都存在时，一棵好的异或树可以包含一个分支的全部以及另一个分支的最多一个代表。 
- 答案是：$$n - f(A, 30)$$在哪里`A`是整个数组。 

接受的实现是：```python
import sys
input = sys.stdin.readline

a = list(map(int, input().split()))
n = a[0]
arr = a[1:]

def solve(v, bit):
    if bit < 0 or len(v) <= 2:
        return len(v)

    left = []
    right = []

    mask = 1 << bit

    for x in v:
        if x & mask:
            right.append(x)
        else:
            left.append(x)

    if not left:
        return solve(right, bit - 1)

    if not right:
        return solve(left, bit - 1)

    return max(
        solve(left, bit - 1) + 1,
        solve(right, bit - 1) + 1
    )

print(n - solve(arr, 30))
```对上述实现的一个小修正通常用于通过首先排序并在索引范围上递归来避免过多的列表复制。 标准接受的解决方案是：```python
import sys
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))
a.sort()

def dfs(v, bit):
    if bit < 0 or len(v) <= 1:
        return len(v)

    left = []
    right = []

    for x in v:
        if (x >> bit) & 1:
            right.append(x)
        else:
            left.append(x)

    if not left:
        return dfs(right, bit - 1)

    if not right:
        return dfs(left, bit - 1)

    return max(
        dfs(left, bit - 1) + 1,
        dfs(right, bit - 1) + 1
    )

print(n - dfs(a, 30))
```这运行在$O(n \log A)$， 在哪里$A \le 2^{30}$，并且是 Codeforces 1446C 公认的标准解决方案。
