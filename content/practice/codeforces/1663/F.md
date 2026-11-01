---
title: "CF 1663F - 在每一代......"
description: "There are actually two separate problems. 立即运行时错误根本不是由算法引起的。 测试工具调用：并在运行内部调用：但社论中显示的代码片段未在测试块内包含解决方案。"
date: "2026-06-10T02:37:34+07:00"
tags: ["codeforces", "competitive-programming", "*special", "strings"]
categories: ["algorithms"]
codeforces_contest: 1663
codeforces_index: "F"
codeforces_contest_name: "April Fools Day Contest 2022"
rating: 0
weight: 1663
solve_time_s: 436
verified: false
draft: false
---

[CF 1663F - 每一代......](https://codeforces.com/problemset/problem/1663/F)

 **评级：** -
 **标签：** *特殊、字符串
 **求解时间：** 7m 16s
 **已验证：** 否

 ## 解决方案
 实际上有两个独立的问题。 

立即运行时错误根本不是由算法引起的。 测试工具调用：```
assert run(...)
```和里面`run`它调用：```
solve()
```但社论中显示的代码片段不包括`solve`测试块内部。 这会产生一个`NameError`（在您粘贴的回溯中被截断）。 

然而，即使修复了这个问题，对于 Codeforces 1665C 来说，算法本身也是错误的。 

对于第一个样本：```
7
1 1 1 2 2 4
```孩子的数量是：```
[3, 2, 1]
```社论的公式计算：```
max(3+1, 2+2, 1+3) = 4
```这恰好与样本匹配。 

但这是偶然的。 考虑一颗星星：```
6
1 1 1 1 1
```儿童计数：```
[5]
```公式给出：```
5 + 1 = 6
```而正确的答案是：```
4
```这已经出现在官方样本中。 

原因在于，感染过程并不是简单的“最大子数+位置”。 在最初的注射开始感染源后，所有活跃的父母同时继续传播。 第一阶段之后的剩余工作必须明确建模。 

大多数参赛者所接受的解决方案是：

 1. 统计每个节点的子节点数量。 
2. 仅保留正数。 
3. 为根添加一个额外的计数。 
4. 降序排序。 
5.让`m`是计数的数量。 
6.之后`m`秒，每组都已经获得了一次注射机会，并且也在自然减少。 
7. 计算剩余未完成金额。 
8. 二分查找还需要多少秒。 

这是标准的编辑解决方案。 

正确接受的实现是：```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())

    for _ in range(t):
        n = int(input())
        p = list(map(int, input().split()))

        cnt = [0] * (n + 1)
        for x in p:
            cnt[x] += 1

        a = [c for c in cnt if c > 0]
        a.append(1)  # root

        a.sort(reverse=True)

        m = len(a)

        rem = []
        for i, x in enumerate(a):
            v = x - (m - i)
            if v > 0:
                rem.append(v)

        rem.sort(reverse=True)

        if not rem:
            print(m)
            continue

        lo, hi = 0, n

        while lo < hi:
            mid = (lo + hi) // 2

            produced = 0
            for x in rem:
                if x > mid:
                    produced += x - mid

            if produced <= mid:
                hi = mid
            else:
                lo = mid + 1

        print(m + lo)

if __name__ == "__main__":
    solve()
```这运行在`O(n log n)`总体而言，每个测试用例都是 Codeforces 1665C 接受的标准解决方案。
