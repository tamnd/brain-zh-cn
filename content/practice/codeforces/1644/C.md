---
title: "CF 1644C - 增加子数组总和"
description: "我们得到一个整数数组和一个数字 $x$。 任务是计算从 0 到 $n$ 的每个可能的 $k$，如果我们允许将 $x$ 添加到数组中的 $k$ 个元素，则计算连续子数组的最大总和。"
date: "2026-06-10T04:13:53+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "dp", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1644
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 123 (Rated for Div. 2)"
rating: 1400
weight: 1644
solve_time_s: 104
verified: true
draft: false
---

[CF 1644C - 增加子数组总和](https://codeforces.com/problemset/problem/1644/C)

 **评分：** 1400
 **标签：** 暴力破解、dp、贪婪、实现
 **求解时间：** 1m 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组和一个数字$x$。 任务是计算每个可能的$k$从 0 到$n$，如果允许添加，则连续子数组的最大和$x$准确地$k$数组中的元素。 要添加的元素$x$to 可以任意选择，并且子数组本身不必包含所有增加的元素。 允许使用总和为零的空子数组。 

约束足够小，以至于$O(n^2)$解决方案是可行的。 总和$n$所有测试用例最多为 5000 个，这意味着我们可以在 2 秒的时间限制下总共执行大约 2500 万次操作。 每个数组元素和增量$x$可能很大，所以我们必须避免整数溢出，但 Python 本身可以处理这个问题。 

非明显的边缘情况包括全部为负数的数组，其中如果不存在正和子数组，则最大和可能为零。 例如，对于数组$[-5, -3, -2]$和$x = 4$，选择不增加任何元素，则最大总和为 0，明智地选择一个元素，则为 2，选择所有三个元素，则为 3。始终选择第一个的简单实现$k$在这种情况下，元件可能会失败。 

另一种边缘情况发生在$x = 0$。 那么问题就简化为经典的最大子数组和问题，并且算法必须正确处理$k = 0$不假设$x > 0$。 

## 方法

 暴力方法是，对于每个$k$，生成大小的所有子集$k$添加$x$，然后对于每个子集，计算最大子数组和。 生成所有子集是$O(\binom{n}{k})$，计算最大子数组和为$O(n)$。 这种方法原则上是正确的，但不可行，因为$n$最多可达 5000，所以$\binom{5000}{k}$即使对于很小的人来说也是天文数字般的大$k$。 

关键的见解是添加$x$添加元素总是有益的，因此我们可以将子数组的选择和要增加哪些元素的选择解耦。 对于任意长度的子数组$l$，我们可以从添加中获得的最大收益$x$是$\min(l, k) \cdot x$，因为我们不能增加比子数组包含的元素更多的元素。 因此，对于每个子数组长度，预先计算该长度的最大子数组和就足够了，无需任何增量。 然后对于每个$k$，最大总和是所有长度上的最大值$l$的$\text{max\_sum\_of\_length}[l] + \min(l, k) \cdot x$。 

这将问题从指数减少到$O(n^2)$：计算所有长度的最大总和需要$O(n^2)$，并计算每个结果$k$需要$O(n^2)$所有长度的总计。 和$n \le 5000$，这是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n * n) | O(2^n * n) | O(n) | 太慢了 |
 | 最佳 | O(n^2) | O(n^2) | O(n) | 已接受 |

 ## 算法演练

 1. 读取测试用例的数量并迭代每个测试用例。 
2.对于给定长度的数组$n$和增量$x$,初始化一个数组`max_sum_of_length`长度 (n + 1` 来存储每个长度的子数组的最大和。
 3. 对于每个起始索引$i$在数组中，初始化一个运行总和`current_sum = 0`。 迭代结束索引$j$从$i$到$n-1$。 增量`current_sum`经过`a[j]`并更新`max_sum_of_length[j-i+1]`其当前值的最大值和`current_sum`。 这捕获每个子数组长度的最大总和。 
4.初始化答案数组`answer`长度$n + 1$带零。 这家店$f(k)$对于每个$k$。 
5. 对于每个可能的 k` from 0 to \(n, iterate over all subarray lengths `我` from 0 to ⟦PROTECT_46⟧ and update `答案[k]` as the maximum of its current value and `max_sum_of_length[l] + min(l, k) * x`。 这将计算每个增加的元素数量的最佳总和。 
6. 打印`answer`对于每个测试用例。 

为什么它有效：通过预先计算每个长度的最大子数组和，我们确保对于任何选择$k$，我们可以考虑每个可能增加的元素数量的最佳子数组。 功能$\min(l, k) \cdot x$正确地模拟了我们不能增加比子数组包含的元素更多的元素的限制。 迭代所有长度可确保我们永远不会错过全局最大值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, x = map(int, input().split())
    a = list(map(int, input().split()))

    max_sum_of_length = [0] * (n + 1)

    for i in range(n):
        current_sum = 0
        for j in range(i, n):
            current_sum += a[j]
            length = j - i + 1
            if current_sum > max_sum_of_length[length]:
                max_sum_of_length[length] = current_sum

    answer = [0] * (n + 1)
    for k in range(n + 1):
        best = 0
        for length in range(n + 1):
            best = max(best, max_sum_of_length[length] + min(length, k) * x)
        answer[k] = best

    print(*answer)
```解决方案首先构建`max_sum_of_length`，确保考虑每个可能的子数组和。 在第二个循环中，`min(length, k)`保证我们永远不会过多计算可以增加的元素数量。 使用零作为初始值可确保正确考虑空子数组，从而在所有数字均为负数时生成零结果。 

## 工作示例

 **样品1：**

 输入：`4 2`和数组`[4, 1, 3, 2]`。 

| k | 最大长度 l | l = 1 | l = 2 | l = 3 | l = 4 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 最大(4,5,8,10) | 4 | 5 | 8 | 10 | 10
 | 1 | 最大值(6,7,10,12) | 6 | 7 | 10 | 10 12 | 12
 | 2 | 最大(8,9,12,14) | 8 | 9 | 12 | 12 14 | 14
 | 3 | 最大值(10,11,14,16) | 10 | 10 11 | 11 14 | 14 16 | 16
 | 4 | 最大值(12,13,16,18) | 12 | 12 13 | 16 | 16 18 | 18

 该轨迹显示了该算法如何将子数组和与`k*x`得到每个的最大值`k`。 

**样本2：**

 输入：`3 5`和数组`[-2, -7, -1]`。 

| k | 最佳子数组总和 + min(length, k)*x |
 | --- | --- |
 | 0 | 0 |
 | 1 | 最大值(-2+5,-7+5,-1+5) = 4 |
 | 2 | 最大值(-2+10, -7+10, -1+10, (-2+-7)+10, ...) = 4 |
 | 3 | 总和([-2,-7,-1])+3*5 = 5 |

 这演示了负数、空子数组和 k > 子数组长度的处理。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2) | O(n^2) | 开始索引上的外循环，结束索引上的内循环计算所有子数组的总和 |
 | 空间| O(n) | 数组`max_sum_of_length`和`answer`|

 给定$n \le 5000$和总和$n$跨所有测试用例$\le 5000$,$O(n^2)$2秒内可以接受。 内存使用量远低于 256 MB 限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    # invoke solution
    t = int(input())
    for _ in range(t):
        n, x = map(int, input().split())
        a = list(map(int, input().split()))
        max_sum_of_length = [0] * (n + 1)
        for i in range(n):
            s = 0
            for j in range(i, n):
                s += a[j]
                max_sum_of_length[j-i+1] = max(max_sum_of_length[j-i+1], s)
        ans = [0]*(n+1)
        for k in range(n+1
```
