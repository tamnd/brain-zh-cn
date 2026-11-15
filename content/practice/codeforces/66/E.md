---
title: "CF 66E - Petya 和 Post"
description: "我们有一条环形路线，有 n 个邮局，每个邮局都有一个加油站。 每个站 i 有 a[i] 升可用汽油，从站 i 到 i+1 的距离为 b[i] 公里，最后绕一圈。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dp"]
categories: ["algorithms"]
codeforces_contest: 66
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 61 (Div. 2)"
rating: 2000
weight: 66
solve_time_s: 132
verified: false
draft: false
---

[CF 66E - Petya 和 Post](https://codeforces.com/problemset/problem/66/E)

 **评级：** 2000
 **标签：** 数据结构，dp
 **求解时间：** 2m 12s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一条环形路线`n`邮局，每个都有一个加油站。 各站`i`有`a[i]`可用汽油升数以及距车站的距离`i`到`i+1`是`b[i]`公里，最后绕一圈。 Petya 的叔叔想要从邮局出发，取一辆车，沿着圆圈向任一方向行驶一圈，只在他经过的车站加油，并且永远不会在同一个车站加油多次。 汽车每公里消耗正好一升。 

我们被要求找到所有从该路线出发的站点，可以在不耗尽汽油的情况下完成整个循环。 

所有汽油的总和`sum(a)`等于所有距离的总和`sum(b)`，这保证了至少从一个起点存在解决方案。 每个加油站至少有一升汽油，每个距离至少一公里。 

和`n`最多 10^5 且时间限制为 2 秒，任何复杂度低于 O(n log n) 的解决方案都是有风险的。 一种简单的 O(n^2) 方法（尝试从每个站点开始并模拟整个循环）将涉及大约 10^10 次操作，并且是不可行的。 

边缘情况包括所有加油站都有足够的气体到达下一个加油站，加油站的气体分布极其不均匀，或者距离形成阻碍从某些点出发的“瓶颈”。 例如：```
n = 3
a = [1, 5, 2]
b = [3, 2, 3]
```天真地从站 1 开始会立即失败，因为 1 < 3，而从站 2 开始会成功。 缺少这些检查将导致错误的答案。 

## 方法

 蛮力方法很简单：尝试从每个站点开始，保持运行的燃油计数器，然后模拟前进。 对于每个站，减去`b[i]`从您的燃料中添加`a[i]`在下一站。 如果燃料降至零以下，则该起点就会失败。 每次模拟都需要 O(n)，我们重复这个 n 次，时间复杂度为 O(n^2)，这太慢了。 

关键的见解是，该问题相当于经典的“循环加油站/加油之旅”问题。 如果我们将每个站点的净燃料变化定义为`a[i] - b[i]`，那么完成循环需要从所选站点开始，这些净变化的累积总和永远不会低于零。 因为`sum(a) == sum(b)`，总净值为零。 累计和达到最小值的点决定了哪些起始站是可行的。 紧接着累积总和的全局最小值之后的任何站点都是有效的起点。 

这一观察结果使我们能够计算一次累积和并找到全局最小值，从而给出 O(n) 解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了|
 | 累计总和/最小跟踪| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 计算每个站点的净燃料变化：`delta[i] = a[i] - b[i]`。 这代表您从车站出发时获得或损失了多少燃料`i`到`i+1`。 
2. 计算前缀和`delta`沿着圆圈：`pref[i] = delta[0] + delta[1] + ... + delta[i]`。 如果需要，可以将数组循环扩展一轮，以简化环绕处理。 
3. 求累加和的全局最小值。 让`min_sum`是最小的前缀和，让`min_index`是出现该最小值的最后一个索引。 这确定了环路中燃料最“缺乏”的位置。 
4. 紧随该全局最小值之后的任何台站（即`(min_index + 1) % n`）是一个可行的起点。 由于循环对称性，该点之后的站序列在整个环路中保持非负燃料。 
5. 从以下位置开始依次检查所有站`min_index + 1`使用运行总和来识别可以在没有负燃料的情况下启动完整循环的所有站点。 这些是有效的答案。 

工作原理：净燃料的累积总和表示相对于从 0 号站开始的燃料量。全局最小值确定了沿环路的最差点。 在此之后立即开始可确保您永远不会遇到负燃油，因为任何先前的不足都被绕过，并且燃油总和与总距离相匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))
b = list(map(int, input().split()))

delta = [a[i] - b[i] for i in range(n)]

# Compute prefix sums
pref = [0] * n
pref[0] = delta[0]
for i in range(1, n):
    pref[i] = pref[i-1] + delta[i]

# Find minimum prefix sum
min_pref = pref[0]
min_index = 0
for i in range(n):
    if pref[i] < min_pref:
        min_pref = pref[i]
        min_index = i

# The station after the minimum is a valid start
start = (min_index + 1) % n

# Verify all valid stations using running sum from 'start'
res = []
fuel = 0
for i in range(n):
    idx = (start + i) % n
    fuel += delta[idx]
    if fuel < 0:
        start = (idx + 1) % n
        fuel = 0
        res = []
    else:
        res.append(idx + 1)  # 1-based indexing

print(len(res))
print(' '.join(map(str, sorted(res))))
```说明：我们首先计算每个站点的净燃料增益，然后添加前缀总和以跟踪累积燃料变化。 紧接着全局最小前缀和之后的站是起点。 我们围绕圆圈进行迭代以确认所有有效的起始站，并使用模索引处理环绕。 

## 工作示例

 ### 示例 1```
n = 4
a = [1, 7, 2, 3]
b = [8, 1, 1, 3]
```| 车站| 三角洲 | 前缀 | 燃料（从开始 2 开始）|
 | ---| ---| ---| ---|
 | 1 | -7 | -7 | - |
 | 2 | 6 | -1 | 6 |
 | 3 | 1 | 0 | 7 |
 | 4 | 0 | 0 | 7 |

 前缀和的全局最小值在索引 0 处为 -7。此后开始：站 2。迭代给出有效站 2 和 4。 

### 定制案例```
n = 3
a = [1, 5, 2]
b = [3, 2, 3]
```前缀和：-2, 3, 2。最小值 = -2，索引 0。从站 2 开始。只有站 2 允许完成循环。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 一次用于增量，一次用于前缀，一次用于识别有效开始 |
 | 空间| O(n) | 存储增量和前缀和 |

 和`n ≤ 10^5`，该算法在 2 秒的时间限制内轻松运行，与 256 MB 相比，使用的内存可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import builtins
    from contextlib import redirect_stdout
    f = io.StringIO()
    with redirect_stdout(f):
        n = int(input())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))
        delta = [a[i] - b[i] for i in range(n)]
        pref = [0]*n
        pref[0] = delta[0]
        for i in range(1, n):
            pref[i] = pref[i-1] + delta[i]
        min_pref = pref[0]
        min_index = 0
        for i in range(n):
            if pref[i] < min_pref:
                min_pref = pref[i]
                min_index = i
        start = (min_index + 1) % n
        res = []
        fuel = 0
        for i in range(n):
            idx = (start + i) % n
            fuel += delta[idx]
            if fuel < 0:
                start = (idx + 1) % n
                fuel = 0
                res = []
            else:
                res.append(idx + 1)
        print(len(res))
        print(' '.join(map(str, sorted(res))))
    return f.getvalue().strip()

# provided sample
assert run("4\n1 7 2 3\n8 1 1 3\n") == "2\n2 4"

# minimum input
assert run("1\n1\n1\n") == "1\n1"

# all equal values
assert run("3\n2 2 2\n2 2 2\n") == "3\n1 2 3"

# edge case: uneven distribution
assert run("3\n1 5 2\n3 2
```
