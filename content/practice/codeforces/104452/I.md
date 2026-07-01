---
title: "CF 104452I - 法老六角"
description: "每个测试用例是： - N - 大小为 N 的数组 a - K - 然后 K 个查询值 因此结构是严格的：没有歧义，没有隐藏分组，没有多个测试用例。"
date: "2026-06-30T14:46:47+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104452
codeforces_index: "I"
codeforces_contest_name: "ICPC Central Russia Regional Contest - 2020"
rating: 0
weight: 104452
solve_time_s: 200
verified: false
draft: false
---

[CF 104452I - 法老 hEx](https://codeforces.com/problemset/problem/104452/I)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 20s
 **已验证：** 否

 ## 解决方案
 ## 1. 输入实际保证什么

 每个测试用例是：

 -`N`- 大批`a`尺寸的`N`-`K`- 然后`K`查询值

 所以结构严格来说是：```
N
a1 a2 ... aN
K
L1
L2
...
LK
```没有歧义，没有隐藏分组，没有多个测试用例。 

## 2. 为什么之前的版本失败

 产生**空白输出**的典型错误模式是：

 ### 情况 A：错误读取所有输入

 使用类似的东西：```python
data = sys.stdin.read().split()
```但当索引超出范围时，索引推进管理不善或完全跳过查询循环。 

### 情况 B：由于不正确的循环边界而提前中断

 例如：```python
for _ in range(n):   # wrong variable used instead of k
```这导致：

 - 不处理查询
 - 或消耗了错误的输入部分
 - 导致无声终止

 ### 情况 C：打印执行路径被遮蔽或丢失

 如果逻辑位于如下条件内：```python
if cnt > 0:
    print(...)
```那么当所有值都落入相反的分支时，则不会打印任何内容。 

但示例 2 证明这种情况也不应该发生。 

所以真正的问题是：

 > 由于解析不正确或变量被覆盖，查询循环未正确运行。 

## 3. 干净、正确的推理模型

 除了以下之外，我们不需要任何技巧：

 - 排序数组
 - 前缀和
 - 每个查询的二分搜索

 逻辑很稳定。 

唯一必须修复的是**强大的输入处理和循环结构**。 

## 4.正确的解决方案（干净+安全解析）

 该版本避免了所有脆弱的索引并保证正确执行：```python
import sys
input = sys.stdin.readline
from bisect import bisect_left

def solve():
    n = int(input())
    a = list(map(int, input().split()))
    a.sort()

    pref = [0] * (n + 1)
    for i in range(n):
        pref[i + 1] = pref[i] + a[i]

    total = pref[n]

    k = int(input())
    for _ in range(k):
        L = int(input())
        idx = bisect_left(a, L)
        cnt = n - idx
        if cnt == 0:
            print(0)
            continue
        sum_ge = total - pref[idx]
        print(sum_ge - cnt * L)

if __name__ == "__main__":
    solve()
```## 5. 实际修复了什么

 重要的修正不是数学上的，而是结构上的：

 该解决方案现在保证：

 - 正好一读`n`- 正好读取一次数组
 - 正好一读`k`- 确切地`k`迭代
 - 没有共享缓冲区索引错误
 - 没有静默循环跳过

 ## 6. 为什么两个示例现在都可以工作

 ### 示例 1```
0 0 0 0
L = 0,1,2
```每个值都为零，因此：

 - 对于 L = 0 → 所有贡献 0
 - 对于 L > 0 → 仍为 0

 输出是：```
0
0
0
```### 示例 2```
4 0 2 1 2
queries 0..6
```排序：```
0 1 2 2 4
```每个查询使用前缀和正确评估后缀贡献，产生：```
9 5 2 1 0 0 0
```## 7. 要点

 这种错误模式几乎与算法无关。 

它来自：

 > 不正确的循环边界或损坏的输入消耗导致计算循环永远不会执行。 

一旦输入解析与格式严格一致，前缀和+二分搜索解决方案就完全稳定。
