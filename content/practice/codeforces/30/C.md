---
title: "CF 30C - 射击馆"
description: "我们被要求帮助国王科帕最大限度地提高他在射击场的预期击中次数。 画廊被表示为一个 2D 平面，每个目标恰好在特定时间出现在特定点，然后立即消失。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 30
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 30 (Codeforces format)"
rating: 1800
weight: 30
solve_time_s: 60
verified: true
draft: false
---
[CF 30C - 射击场](https://codeforces.com/problemset/problem/30/C)

 **评分：** 1800
 **标签：** dp，概率
 **求解时间：** 1m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求帮助国王科帕最大限度地提高他在射击场的预期击中次数。 图库表示为 2D 平面，每个目标出现在特定点$(x_i, y_i)$恰好在特定时间$t_i$然后立即消失。 如果国王的枪瞄准出现时瞄准目标，他就有概率击中目标$p_i$。 枪瞄准器可以单位速度移动，因此可以从一点瞄准$(x_1, y_1)$到另一个$(x_2, y_2)$，需要欧氏距离$\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$时间单位。 国王提前知道所有目标及其时间，他想计划一系列的行动以最大化击中目标的概率总和。 

输入包括$n$目标（$1 \le n \le 1000$), each with coordinates, a time, and a probability. The output is the maximum expected number of hits.

 这些限制给我们提供了一些指导。 和$n$最多 1000 个，时间最多$10^9$, 一个天真的 O($n^2$) 的解决方案是可以接受的，但任何接近 O($2^n$）太慢了。 距离可以是负数，但我们只关心欧几里德移动成本。 概率是 0 到 1 之间的实数。 

非明显的边缘情况包括：时间 0 处的单个目标概率小于 1、多个目标在时间上聚集得如此接近以至于不可能在它们之间移动、或者概率为 0 的目标应被忽略。 例如，输入：```
1
0 0 0 0.5
```输出为0.5。 假设国王只能获得全部命中（0 或 1）的幼稚算法在这里会失败。 

另一个棘手的情况是当两个目标相距太远而无法及时到达时：```
2
0 0 1 1
1000 1000 2 1
```虽然$t_2 > t_1$，距离太大以至于国王无法及时到达第二个目标。 粗心的解决方案可能会同时尝试和过度计数。 

## 方法

 蛮力解决方案是考虑目标的每种排列，计算国王是否可以及时从一个移动到下一个，并对概率求和。 这对于正确性是有效的，因为它探索了所有序列，但排列的数量是$n!$，这对于$n=1000$。 

关键的见解是，达到目标与预期无关，因此我们可以将其建模为动态规划的一种形式。 如果我们按照时间的增加对目标进行排序，那么我们只需要考虑完成每个目标后可以实现的最佳期望值。 对于目标$i$，我们可以查看之前的所有目标$j$可以达到$i$及时$t_i - t_j \ge \text{distance}(i, j)$，并计算：$$dp[i] = p_i + \max(dp[j] \text{ for all valid } j)$$如果之前的目标无法达到$i$，我们可以从时间 0 的任意位置开始，这可以简化为$dp[i] = p_i$。 这减少了问题$O(n!)$到$O(n^2)$，这是可以接受的$n \le 1000$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力（所有排列）| O(n!) | O(n) | 太慢了 |
 | 具有时间排序的动态规划 | O(n^2) | O(n^2) | O(n) | 已接受 |

 ## 算法演练

 1. 读取所有目标并将它们存储为元组$(x_i, y_i, t_i, p_i)$。 
2. 按出现时间对目标进行排序$t_i$。 这保证了我们在 DP 中考虑的任何先前目标都保证出现在当前目标之前，因此我们只向后看。 
3.初始化一个DP数组`dp[i]`存储以目标结束的最大预期命中数$i$。 
4. 按照时间增加的顺序迭代目标。 对于每个目标$i$, 假设最初`dp[i] = p_i`，表示从时间 0 的初始位置直接开始到该目标。 
5. 对于每个较早的目标$j < i$，检查国王是否可以从$j$到$i$在可用的时间内。 计算欧几里德距离$\text{dist} = \sqrt{(x_i - x_j)^2 + (y_i - y_j)^2}$。 如果$t_i - t_j \ge \text{dist}$， 更新`dp[i] = max(dp[i], dp[j] + p_i)`。 
6. 处理完所有目标后，答案是 DP 数组中的最大值，因为序列可以在任何目标处结束。 

为什么它有效：DP 不变量是`dp[i]`是如果最后一次目标命中是可实现的最佳预期命中数$i$。 因为期望是相加的，并且我们总是考虑早期目标的可行转换，所以我们保证所考虑的每个序列都是有效的，并且我们永远不会错过更好的序列。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

n = int(input())
targets = []
for _ in range(n):
    x, y, t, p = input().split()
    x = int(x)
    y = int(y)
    t = int(t)
    p = float(p)
    targets.append((t, x, y, p))

targets.sort()  # sort by time

dp = [0.0] * n

for i in range(n):
    t_i, x_i, y_i, p_i = targets[i]
    dp[i] = p_i  # start directly at this target
    for j in range(i):
        t_j, x_j, y_j, _ = targets[j]
        dist = math.hypot(x_i - x_j, y_i - y_j)
        if t_i - t_j >= dist:
            dp[i] = max(dp[i], dp[j] + p_i)

print(f"{max(dp):.10f}")
```代码读取目标并将其存储为元组`(t, x, y, p)`所以按时间排序是微不足道的。`math.hypot`用于欧几里德距离，以避免手动平方和平方根。 DP 初始化为`p_i`从原点或任何初始位置开始处理目标。 检查全部`j < i`确保我们考虑每个有效的先前位置。 

## 工作示例

 **示例1：**

 输入：```
1
0 0 0 0.5
```| 我| t_i | x_i | y_i | p_i | dp[i] | dp[i] |
 | ---| ---| ---| ---| ---| ---|
 | 0 | 0 | 0 | 0 | 0.5 | 0.5 0.5 | 0.5

 输出：`0.5`。 确认单个目标产生`dp[i] = p_i`。 

**示例2：**

 输入：```
3
0 0 1 0.5
1 0 2 0.5
0 1 2 0.5
```| 我| t_i | x_i | y_i | p_i | dp[i] | dp[i] | 考虑的转变|
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 1 | 0 | 0 | 0.5 | 0.5 0.5 | 0.5 从 0 开始 |
 | 1 | 2 | 1 | 0 | 0.5 | 0.5 1.0 | 从 0 开始：dist=1 <=1 |
 | 2 | 2 | 0 | 1 | 0.5 | 0.5 1.0 | 从 0 开始：dist=1 <=1 |

 输出：`1.0`。 演示多个可行的转换，并且 DP 正确选择最佳路径。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n^2) | O(n^2) | 对于 n 个目标中的每一个，我们都会考虑所有先前的目标，因此 n*(n-1)/2 次比较 |
 | 空间| O(n) | DP 数组为每个目标存储一个浮点数 |

 当 n ≤ 1000 时，O(n^2) = 10^6 次操作，完全符合 2 秒的限制。 

## 测试用例```python
import sys, io
import math

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    targets = []
    for _ in range(n):
        x, y, t, p = input().split()
        x = int(x)
        y = int(y)
        t = int(t)
        p = float(p)
        targets.append((t, x, y, p))
    targets.sort()
    dp = [0.0] * n
    for i in range(n):
        t_i, x_i, y_i, p_i = targets[i]
        dp[i] = p_i
        for j in range(i):
            t_j, x_j, y_j, _ = targets[j]
            if
```
