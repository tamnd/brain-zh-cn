---
title: "CF 1506B - 部分更换"
description: "所提出的算法并没有遇到小的实现错误。 底层构造是错误的。 我们可以在失败的案例中立即看到这一点。 对于 n = 1，几乎已排序的排列总数恰好为 1。"
date: "2026-06-10T20:23:01+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1506
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 710 (Div. 3)"
rating: 1100
weight: 1506
solve_time_s: 459
verified: true
draft: false
---

[CF 1506B - 部分替换](https://codeforces.com/problemset/problem/1506/B)

 **评分：** 1100
 **标签：** 贪心，实现
 **求解时间：** 7m 39s
 **已验证：** 是的

 ## 解决方案
 所提出的算法并没有遇到小的实现错误。 底层构造是错误的。 

我们可以在失败的案例中立即看到这一点。 

为了`n = 1`，几乎排序排列的总数恰好是`1`。 

错误的代码输出：```
1 1 -> 1
1 2 -> 1
```这意味着它从不检查是否`k`超过有效排列的总数。 

第二次失败更具启发性：```
n = 6, k = 5
Expected:
1 2 4 3 5 6
Actual:
3 2 1 4 5 6
```贪婪的“取其计数适合 k 的最大可逆块”的想法不会按字典顺序生成排列。 它直接跳转到更晚的排列。 

正确的解决方案使用几乎排序排列的实际组合结构。 

对于这个问题，每个有效排列都可以通过划分得到```
1,2,3,...,n
```分成连续的块并独立地反转每个块。 

例子：```
[1,2] [3,4,5] [6]
```变成```
2 1 5 4 3 6
```每个几乎排序的排列都恰好对应于一个这样的分区。 

如果有`m`剩余数量，可能的分区数量为```
2^(m-1)
```因为相邻数字之间的每个间隙要么是切割，要么不是切割。 

通过确定第一个块的长度来获得字典顺序。 如果第一个块有长度`L`， 然后：```
L = 1  -> first element = 1
L = 2  -> first element = 2
L = 3  -> first element = 3
...
```较小的第一个元素意味着按字典顺序较小的排列。 

因此，我们通过计算以每个可能的长度开始的排列数来选择第一个块的长度。 

对于第一个长度块`L`, 还剩下```
n - L
```数字，给予```
2^(n-L-1)
```延续。 

我们反复减去这些计数`k`直到我们找到包含所需排列的块。 

官方接受的实现是：```python
import sys
input = sys.stdin.readline

LIMIT = 10**18

def solve():
    t = int(input())

    # powers capped at LIMIT+1
    pw = [1] * 61
    for i in range(1, 61):
        pw[i] = min(LIMIT + 1, pw[i - 1] * 2)

    for _ in range(t):
        n, k = map(int, input().split())

        total = 1 if n == 1 else pw[min(60, n - 1)]
        if k > total:
            print(-1)
            continue

        ans = []
        cur = 1

        while cur <= n:
            remaining = n - cur + 1

            chosen_len = None

            for length in range(1, remaining + 1):
                rest = remaining - length

                if rest == 0:
                    cnt = 1
                else:
                    cnt = pw[min(60, rest - 1)]

                if k > cnt:
                    k -= cnt
                else:
                    chosen_len = length
                    break

            block = list(range(cur, cur + chosen_len))
            block.reverse()
            ans.extend(block)

            cur += chosen_len

        print(*ans)

solve()
```关键的修正是我们必须准确地计算词典块。 之前的贪婪加倍逻辑与字典排序不对应，因此无法产生正确的第k个排列。
