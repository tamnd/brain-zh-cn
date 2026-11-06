---
title: "CF 1869A - 归零"
description: "对于 Codeforces 1869A，整个解决方案是一个建设性的观察。 如果n是偶数，则执行： 第一次运算后，每个元素都变成X，其中X是整个数组的异或。"
date: "2026-06-09T00:55:22+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms"]
categories: ["algorithms"]
codeforces_contest: 1869
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 896 (Div. 2)"
rating: 900
weight: 1869
solve_time_s: 158
verified: false
draft: false
---

[CF 1869A - 使其为零](https://codeforces.com/problemset/problem/1869/A)

 **评分：** 900
 **标签：** 构造性算法
 **求解时间：** 2m 38s
 **已验证：** 否

 ## 解决方案
 对于 Codeforces 1869A，整个解决方案是一个建设性的观察。 

如果`n`为偶数，执行：```
(1, n)
(1, n)
```第一次操作后，每个元素都变成`X`， 在哪里`X`是整个数组的异或。 

由于段长度是偶数，整个数组的异或现在是：```
X xor X xor ... xor X = 0
```再次应用相同的操作会将每个元素变成`0`。 

如果`n`是奇怪的，使用第一个`n - 1`长度为偶数的元素：```
(1, n - 1)
(1, n - 1)
(n - 1, n)
(n - 1, n)
```前两项操作建仓`1..n-1`等于零。 然后最后两个操作建仓`n-1`和`n`也等于零。 

这最多使用 4 次操作，远低于 8 次的限制。```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())

    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))  # values are irrelevant

        if n % 2 == 0:
            print(2)
            print(1, n)
            print(1, n)
        else:
            print(4)
            print(1, n - 1)
            print(1, n - 1)
            print(n - 1, n)
            print(n - 1, n)

if __name__ == "__main__":
    solve()
```为什么它有效：

 对于偶数长度的段，用其 XOR 值替换该段后`x`, 每个位置包含`x`。 整个段的异或变为`x`重复偶数次，等于`0`。 对同一段重新应用操作会将所有位置替换为`0`。 

什么时候`n`是奇数，段`[1, n-1]`长度为偶数，因此两次操作将其归零。 之后，定位`n-1`已经为零。 应用该操作两次`[n-1, n]`将最后两个位置归零，使整个数组为零。
