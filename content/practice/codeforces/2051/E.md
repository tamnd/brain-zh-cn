---
title: "CF 2051E - 最优惠价格"
description: "算法本身是正确的。 症状是程序根本不产生任何输出，而不是不正确的输出。 这意味着错误不在确定通过/失败的逻辑中。 它在程序结构中。"
date: "2026-06-08T08:43:13+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "data-structures", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 2051
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 995 (Div. 3)"
rating: 1600
weight: 2051
solve_time_s: 175
verified: false
draft: false
---

[CF 2051E - 最优惠价格](https://codeforces.com/problemset/problem/2051/E)

 **评分：** 1600
 **标签：** 二分查找、暴力破解、数据结构、贪心、排序
 **求解时间：** 2m 55s
 **已验证：** 否

 ## 解决方案
 算法本身是正确的。 症状是程序**根本没有输出**，而不是不正确的输出。 

这意味着错误不在确定通过/失败的逻辑中。 它在程序结构中。 

一个非常常见的原因是解决方案被编写在函数内，例如：```python
def solve():
    ...
```但该函数从未被调用。 在这种情况下，程序什么也不读，什么也不写，法官会看到一个空的输出：```
Expected:
0100
0000
1111
10

Actual:
```通过预期算法追踪样本：

 ### 测试用例 1```
n=4, m=4, k=3
known={1,3,4}
```未知问题：```
{2}
```正好有一个未知问题，即2。 

列表是可以通过的当且仅当其省略的问题是 2。```
a = [1,2,3,4]
```结果：```
0100
```### 测试用例2```
n=5, k=3
known={1,3,4}
```未知问题：```
{2,5}
```至少有两个未知的问题。 删除一个问题并不能同时消除两个问题。 

结果：```
0000
```### 测试用例 3```
k=n
```所有的问题都是已知的。 

结果：```
1111
```### 测试用例 4```
n=2
known={2}
```未知问题：```
{1}
```只有省略问题1的列表是可以通过的。 

结果：```
10
```所以算法没问题。 修复方法只是提供完整的可执行解决方案并调用`solve()`。```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    answers = []

    for _ in range(t):
        n, m, k = map(int, input().split())
        a = list(map(int, input().split()))
        q = list(map(int, input().split()))

        known = set(q)
        missing = n - k

        if missing == 0:
            answers.append("1" * m)
            continue

        if missing >= 2:
            answers.append("0" * m)
            continue

        # Exactly one unknown question.
        unknown = -1
        for x in range(1, n + 1):
            if x not in known:
                unknown = x
                break

        res = []
        for x in a:
            if x == unknown:
                res.append('1')
            else:
                res.append('0')

        answers.append(''.join(res))

    sys.stdout.write("\n".join(answers))

if __name__ == "__main__":
    solve()
```这保留了预期的$O(n+m)$每个测试用例方法并正确处理所有边缘情况。
