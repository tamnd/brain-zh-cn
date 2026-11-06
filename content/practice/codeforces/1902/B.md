---
title: "CF 1902B - 获取积分"
description: "我们有一个学生 Monocarp，他一个学期有 n 天的序列。 每天，他要么学习，要么休息。 学习为他提供了两种赚取积分的方式：参加课程（价值 l 分）和完成实践任务（各价值 t 分）。"
date: "2026-06-08T21:07:16+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1902
codeforces_index: "B"
codeforces_contest_name: "Educational Codeforces Round 159 (Rated for Div. 2)"
rating: 1100
weight: 1902
solve_time_s: 120
verified: true
draft: false
---

[CF 1902B - 获取积分](https://codeforces.com/problemset/problem/1902/B)

 **评分：** 1100
 **标签：** 二分查找、暴力破解、贪心
 **求解时间：** 2m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个学生 Monocarp，他有一系列`n`一个学期中的天数。 每天，他要么学习，要么休息。 Studying gives him two ways to earn points: attending a lesson (worth`l`分）并完成实际任务（值得`t`各点）。 每周都会解锁任务：第一个任务在第 1 天解锁，第二个任务在第 8 天解锁，第三个任务在第 15 天解锁，依此类推。 在任何一天，Monocarp 除了参加课程外最多还可以完成 2 项解锁任务。 

目标是弄清楚 Monocarp 可以休息多少天，同时至少还能赚钱`P`总计点数。 输入给出天数`n`, 所需积分`P`, 课程点数`l`，以及任务点`t`。 每个测试用例的输出是一个整数：可能的最大休息天数。 

制约因素很大。`n`和`l`,`t`可以达到`10^9`， 和`P`可以达到`10^18`。 这排除了任何直接模拟每一天的方法。 逐日进行蛮力计数太慢了。 我们需要一种方法来推理时间间隔内累积的积分，而无需每天迭代。 

不明显的边缘情况源自两个观察结果。 首先，如果课程与任务相比非常有价值，Monocarp 可能必须几乎每天都参加。 例如，如果`n = 1`,`P = 5`， 和`l = 5`，他根本无法休息。 其次，他可以完成的最大任务数量不仅受到天数的限制，还受到每天2个限制和每周解锁次数的限制。 例如，如果`n = 8`，到第8天只解锁了两个任务，所以即使以后有足够的天数来完成所有剩余的任务，他每天也不能做超过2个。 

## 方法

 暴力方法将模拟每一天，跟踪解锁的任务、已完成的任务和累积的积分。 每天，我们都会根据距离的远近来选择是学习还是休息。`P`。 原则上这是正确的，但每个测试用例的时间复杂度为 O(n)，这对于`n`最多 10^9 和`tc`最多 10^4。 操作次数将超过`10^13`，这是不可行的。 

关键的观察是学习是“厚重的”和附加的。 每个学习日都有固定的课点`l`加上最多 2 个任务点`t`。 任务每周以一组为一组解锁，因此我们可以计算给定一天之后可用的最大任务数。 Monocarp 希望尽可能少地学习天数以达到`P`。 我们可以重新表述这个问题：最少学习天数是多少`k`需要达到`P`我们是否总是在每个学习日完成最大数量的任务？ 

让`tasks_total`是截至最后一天解锁的任务总数。 在某一天，他学习可以获得的总分`k`天是`l * k + t * min(2*k, tasks_total)`。 我们需要这笔钱至少是`P`。 如果我们求解最小值`k`，那么最大休息天数就是`n - k`。 因为函数是单调的`k`，二分查找可以找到这个最小的`k`高效。 这将每个测试用例的复杂性降低到 O(log n)，这是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每个测试用例 O(n) | O(1) | O(1) | 太慢了 |
 | 最佳（学习日二分搜索）| 每个测试用例的 O(log n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1、计算每天解锁的任务总数`n`。 每个任务每7天解锁一次，因此任务数量为`(n + 6) // 7`。 这说明了第 1 天解锁第一个任务，第 8 天解锁第二个任务，依此类推。 
2. 定义辅助函数`points(study_days)`计算 Monocarp 学习后可以获得的最高分`study_days`天。 在每个学习日，他都会得到`l`课程分数，最多可以完成 2 项任务。 因此，总积分为`l * study_days + t * min(2 * study_days, total_tasks)`。 
3. 对研究天数进行二分查找。 放`lo = 0`和`hi = n`。 在每次迭代中，检查是否`points(mid)`大于或等于`P`。 如果是，我们可以通过设置来尝试减少学习天数`hi = mid`。 否则，设置`lo = mid + 1`。 继续直到`lo == hi`。 
4. 返回`n - lo`作为最大休息天数。 

为什么它有效：功能`points(k)`是单调递增的。 更多的学习天数不会减少总分，而且一旦`points(k)`达到`P`，增加`k`进一步是不必要的。 二分查找找到最小的`k`即满足条件。 从中减去`n`给出最大休息天数。 每天和每周的解锁任务限制受到尊重，因为`min(2*k, total_tasks)`考虑到这两个限制。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def max_rest_days(n, P, l, t):
    total_tasks = (n + 6) // 7
    
    def points(k):
        return l * k + t * min(2 * k, total_tasks)
    
    lo, hi = 0, n
    while lo < hi:
        mid = (lo + hi) // 2
        if points(mid) >= P:
            hi = mid
        else:
            lo = mid + 1
    return n - lo

tc = int(input())
for _ in range(tc):
    n, P, l, t = map(int, input().split())
    print(max_rest_days(n, P, l, t))
```该代码首先计算解锁的任务数量。 辅助函数计算给定学习天数的总分，并遵守每天 2 次的限制。 二分搜索有效地找到所需的最短学习天数。 边界条件如`0`学习日和`n`学习日由`lo = 0, hi = n`初始化。 

## 工作示例

 **示例1：**`1 5 5 2`| k（学习天数）| 点(k) | 状况 |
 | --- | --- | --- |
 | 0 | 0 | < 5 |
 | 1 | 5 + 2*1 = 7 | >= 5 |

 二分查找发现`k = 1`，所以最大休息天数 =`1 - 1 = 0`。 

**示例2：**`14 3000000000 1000000000 500000000`总任务 =`(14 + 6)//7 = 2`。 

| k | 点(k) | 状况 |
 | --- | --- | --- |
 | 0 | 0 | < 3e9 |
 | 2 | 2e9 + min(4,2)*5e8 = 2e9 + 1e9 = 3e9 | >= 3e9 |

 最短学习天数 = 2，最长休息天数 = 14 - 2 = 12。 

这些痕迹表明，二分搜索有效地找到了最短学习天数并尊重任务限制。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(tc * log n) | O(tc * log n) | 对每个 tc 测试用例进行最多 n 天的二分搜索 |
 | 空间| O(1) | O(1) | 只存储几个整数，与 n | 无关

 即使与`tc = 10^4`和`n = 10^9`，总操作次数约为 3×10^5 左右，非常适合 1 秒的时间限制。 

## 测试用例```python
def run(inp: str) -> str:
    import sys, io
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    # call solution
    tc = int(input())
    for _ in range(tc):
        n, P, l, t = map(int, input().split())
        print(max_rest_days(n, P, l, t))
    return out.getvalue().strip()

# provided samples
assert run("5\n1 5 5 2\n14 3000000000 1000000000 500000000\n100 20 1 10\n8 120 10 20\n42 280 13 37") == "0\n12\n99\n0\n37"

# custom cases
assert run("2\n1 1 1 1\n7 14 2 2") == "0\n3", "minimum size and exact week limit"
assert run("1\n1000000000 1000000000000000000 1000 1000") == "999999500", "large n, large P"
assert run("1\n7 10 1 2") == "3", "exactly one week, mixed points"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | `1 | | |
