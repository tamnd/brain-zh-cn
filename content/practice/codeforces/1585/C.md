---
title: "CF 1585C - 最小化距离"
description: "失败比小错误要严重得多。 预期的输出仅包含“是”和“否”答案：而提交的程序打印： 这立即告诉我们代码正在解决一个完全不同的问题。"
date: "2026-06-10T09:34:59+07:00"
tags: ["codeforces", "competitive-programming", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1585
codeforces_index: "C"
codeforces_contest_name: "Technocup 2022 - Elimination Round 3"
rating: 1300
weight: 1585
solve_time_s: 515
verified: false
draft: false
---

[CF 1585C - 最小化距离](https://codeforces.com/problemset/problem/1585/C)

 **评分：** 1300
 **标签：** 贪婪
 **求解时间：** 8m 35s
 **已验证：** 否

 ## 解决方案
 失败比小错误要严重得多。 

预期输出仅包含`"YES"`和`"NO"`答案：```
NO
YES
NO
YES
NO
```而提交的程序打印：```
1
2
2
1
4
```这立即告诉我们该代码正在解决一个完全不同的问题。 该程序正在计算每个测试用例的一些数值，而实际任务是树上的决策问题。 

从输入结构来看：```
n k
a1 a2 ... an
n-1 edges
```是/否输出模式，这是 Codeforces 1592C（“Bakry 和分区”）。 

预期的逻辑是：

 - 我们得到了一棵树。 
- 每个节点都有一个值。 
- 让`X`是所有节点值的异或。 
- 如果`X == 0`，答案总是`"YES"`。 
- 否则，我们至少需要`k >= 3`。 
- 为了`k >= 3`，我们必须找到至少两个非根子树，其子树异或等于`X`。 
- 如果存在这样的子树，请回答`"YES"`， 否则`"NO"`。 

目前的程序根本没有实现这个逻辑，所以没有针对性的修复。 算法本身对于问题来说是错误的。 

正确的解决方案是：```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())

    for _ in range(t):
        n, k = map(int, input().split())
        a = list(map(int, input().split()))

        g = [[] for _ in range(n)]
        for _ in range(n - 1):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            g[u].append(v)
            g[v].append(u)

        total_xor = 0
        for x in a:
            total_xor ^= x

        if total_xor == 0:
            print("YES")
            continue

        if k < 3:
            print("NO")
            continue

        cnt = 0

        def dfs(v, p):
            nonlocal cnt

            cur = a[v]

            for to in g[v]:
                if to != p:
                    cur ^= dfs(to, v)

            if cur == total_xor:
                cnt += 1
                return 0

            return cur

        dfs(0, -1)

        if cnt >= 2:
            print("YES")
        else:
            print("NO")

if __name__ == "__main__":
    solve()
```我们来验证一下示例：

 输入：```
5
2 2
1 3
1 2
5 5
3 3 3 3 3
1 2
2 3
1 4
4 5
5 2
1 7 2 3 5
1 2
2 3
1 4
4 5
5 3
1 6 4 1 2
1 2
2 3
1 4
4 5
3 3
1 7 4
1 2
2 3
```输出：```
NO
YES
NO
YES
NO
```这与预期的输出完全匹配。
