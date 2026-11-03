---
title: "CF 1759F - 所有可能的数字"
description: "我们有n个任务。 任务 i 完成后会给予 a[i] 个硬币。 在 d 天内，我们每天最多可以执行一项任务。 完成任务后，我们必须等待 k 天才能再次执行相同的任务。"
date: "2026-06-09T14:34:49+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "greedy", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1759
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round  834 (Div. 3)"
rating: 1800
weight: 1759
solve_time_s: 362
verified: false
draft: false
---

[CF 1759F - 所有可能的数字](https://codeforces.com/problemset/problem/1759/F)

 **评分：** 1800
 **标签：** 二分查找、数据结构、贪心、数学、数论
 **求解时间：** 6m 2s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有`n`任务。 寻求`i`给出`a[i]`每当完成时都会获得硬币。 

期间`d`我们每天最多可以执行一项任务。 完成任务后，我们必须等待`k`几天后再次进行同样的任务。 

我们需要最大的`k`至少可以赚取`c`里面的硬币`d`天。 

如果即使`k = 0`无法到达`c`，答案是`Impossible`。 

如果任意大`k`价值观起作用，答案是`Infinity`。 

全部的总和`n`和所有`d`至多是`2·10^5`，所以一个`O(n log n + d log d)`每个测试用例的样式解决方案是可以接受的。 详尽地模拟许多候选值`k`不是。 

## 关键观察

 按降序排列奖励。 

对于固定的冷却时间`k`，最优策略是贪心的：

 在任何块期间`k+1`连续几天，一个任务不能出现两次。 因此，最好的块由最大的块组成`k+1`追求价值。 

让```
cycle = k + 1
```假设我们有```
full = d // cycle
rem  = d % cycle
```每个完整的周期贡献最大的总和`cycle`奖励。 

其余`rem`天贡献最大的总和`rem`奖励。 

如果`cycle > n`，我们只需在一个周期内使用所有可用的任务一次，因为没有更多不同的任务。 

这提供了一种有效的方法来计算固定的最大可获得硬币`k`。 

## 为什么二分查找有效

 作为`k`增加，限制变得更加严格。 

可实现的最大硬币相对于单调非增加`k`。 

所以：```
can(k) = achievable_coins(k) >= c
```是一个单调谓词。 

我们可以二分查找最大的有效值`k`。 

## 检测无穷大

 如果`k`任意大，每个任务在整个期间最多可以有效使用一次。 

那么最好的收入是```
sum of largest min(n, d) rewards
```如果这个值至少已经是`c`，那么每个足够大的`k`作品。 

回答：```
Infinity
```## 检测不可能

 当`k = 0`，我们可能每天都会重复最好的任务。 

最大可能收入变为```
d * max(a)
```如果这仍然低于`c`，达到目标是不可能的。 

回答：```
Impossible
```## 算法

 1.奖励按降序排列。 
2. 构建前缀和。 
3. 检查无穷大。 
4. 检查不可能。 
5.二分查找最大有效`k`。 
6. 输出该值。 

## 正确性草图

 对于固定的`k`，任何任务在每个长度块中最多可以出现一次`k+1`。 

因此，最佳调度重复地获取每个此类块内的最大可用奖励。 由于奖励是独立的并且永远不会减少，因此选择最大的奖励可以独立地最大化每个周期。 

计算得出的结果值`can(k)`等于该冷却时间的真正最佳值。 

自从增加`k`仅删除可行的时间表，`can(k)`是单调的。 因此，二分搜索找到最大可行的`k`。 

无限检查评估任务永远不会重复的限制。 不可能检查评估重复不受限制的相反极端。 它们涵盖了两个特殊输出。 

因此，算法总是返回正确的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())

    for _ in range(t):
        n, c, d = map(int, input().split())
        a = list(map(int, input().split()))

        a.sort(reverse=True)

        pref = [0]
        for x in a:
            pref.append(pref[-1] + x)

        # Infinity
        if pref[min(n, d)] >= c:
            print("Infinity")
            continue

        # Impossible
        if a[0] * d < c:
            print("Impossible")
            continue

        def can(k):
            cycle = k + 1

            take = min(cycle, n)
            cycle_sum = pref[take]

            full = d // cycle
            rem = d % cycle

            total = full * cycle_sum
            total += pref[min(rem, n)]

            return total >= c

        lo, hi = 0, d
        ans = 0

        while lo <= hi:
            mid = (lo + hi) // 2

            if can(mid):
                ans = mid
                lo = mid + 1
            else:
                hi = mid - 1

        print(ans)

solve()
```## 复杂度分析

 | 测量 | 复杂性 |
 | --- | --- |
 | 排序 |`O(n log n)`|
 | 每项可行性检查 |`O(1)`|
 | 二分查找 |`O(log d)`|
 | 每个测试用例总计 |`O(n log n + log d)`|
 | 空间|`O(n)`|

 由于总和为`n`和`d`所有测试用例最多都是`2·10^5`，这很容易符合限制。
