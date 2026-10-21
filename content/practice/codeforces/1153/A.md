---
title: "CF 1153A - 仆人和巴士"
description: "Serval 将在特定时间 t 前往公交车站。 有 n 条巴士路线，每条路线都有首趟巴士在 si 分钟到达，后续巴士每 di 分钟到达。 Serval 将乘坐在时间 t 之后或恰好在时间 t 到达的第一辆公共汽车。"
date: "2026-06-12T02:51:19+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "math"]
categories: ["algorithms"]
codeforces_contest: 1153
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 551 (Div. 2)"
rating: 1000
weight: 1153
solve_time_s: 103
verified: true
draft: false
---

[CF 1153A - Serval 和 Bus](https://codeforces.com/problemset/problem/1153/A)

 **评分：** 1000
 **标签：** 蛮力，数学
 **求解时间：** 1m 43s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 Serval 将在特定时间前往巴士站`t`。 有`n`巴士路线，每条都有首班车到达`s_i`分钟和随后的巴士每隔`d_i`分钟。 薮猫将乘坐随后或恰好在该时间到达的第一辆巴士`t`。 如果多辆巴士最早在同一时间到达，则其中任何一条路线都可以接受。 任务是确定Serval 将搭乘哪条巴士路线。 

输入包括`n`和`t`， 其次是`n`对`(s_i, d_i)`代表每条公交线路的首到时间和间隔时间。 输出是一个整数，表示所选公交路线的从 1 开始的索引。 

限制条件适中：`n`最多 100，次数最多可达`10^5`。 对每条公交路线进行暴力检查是可行的，因为即使我们一分钟一分钟地迭代，操作次数也会在限制之内。 边缘情况包括路线的第一辆公交车恰好到达`t`，所有巴士到达的路线`t`，或多条路线共用最早的巴士`t`。 例如，如果`t=2`两条路线有时有巴士`[2,4,6]`和`[2,5,8]`，两者都是有效答案。 

## 方法

 天真的方法是生成每条公交车路线的所有到达时间，直到我们到达或超过`t`然后选择其中最早的一个。 这有效是因为`n`很小并且间隔`d_i`是有界的。 然而，构建所有总线时间是不必要的，可以使用简单的算术来避免。 

关键的见解是，对于从`s_i`有间隔`d_i`，Serval 可以搭乘的第一辆巴士发生在`s_i`如果`s_i >= t`。 否则，我们可以计算之后的第一条总线`t`直接作为最小倍数`d_i`添加到`s_i`那至少是`t`。 从数学上来说，这是`s_i + ceil((t - s_i)/d_i) * d_i`。 使用整数算术，我们可以计算出`(t - s_i + d_i - 1) // d_i`以避免浮点运算。 这将问题简化为扫描每条公交车路线一次并计算其最早可搭乘的公交车，从而使解决方案的时间复杂度为 O(n)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力（所有时间生成）| O(n * max((t - s_i)/d_i)) | O(n * max((t - s_i)/d_i)) | O(1) | O(1) | 对于小 t 有效，对于大间隔则效率低下 |
 | 最优（直接计算）| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 阅读`n`和`t`。 
2.初始化两个变量：`best_time`一个非常大的值（以跟踪最早的巴士）并且`best_route`至-1。 
3. 各公交线路索引`i`从 1 到`n`， 读`s_i`和`d_i`。 
4. 如果`s_i >= t`，将此路线的下一班车设置为`s_i`。 
5. 否则，计算之后需要等待多少个间隔`s_i`至少达到`t`。 这是`(t - s_i + d_i - 1) // d_i`。 将此乘以`d_i`并添加`s_i`获取该路线的最早巴士时间。 
6. 如果此班车时间小于`best_time`， 更新`best_time`并设置`best_route`到`i`。 
7.检查完所有路线后，打印`best_route`。 

为什么它有效：该算法保持了以下不变式：`best_time`Serval 始终保留所有已处理路线中可以搭乘的最早的巴士。 通过使用整数运算计算每条路线的第一辆可搭乘的巴士，我们保证我们永远不会错过实际最早的巴士，以及最后的巴士`best_route`保证是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, t = map(int, input().split())
best_time = float('inf')
best_route = -1

for i in range(1, n + 1):
    s, d = map(int, input().split())
    if s >= t:
        next_bus = s
    else:
        wait = (t - s + d - 1) // d
        next_bus = s + wait * d
    if next_bus < best_time:
        best_time = next_bus
        best_route = i

print(best_route)
```该代码使用有效地读取输入`sys.stdin.readline`。 该循环计算每条路线的最早可搭乘的巴士。 这`(t - s + d - 1) // d`公式确保我们在间隔不均匀划分时进行四舍五入。 更新中`best_time`和`best_route`仅当找到严格较早的总线时才能避免歧义，并且使用基于 1 的索引与问题的预期输出相匹配。 

## 工作示例

 ### 示例 1

 输入：```
2 2
6 4
9 5
```| 路线 | s_i | d_i | 下一班车 | 最佳时间 | 最佳路线 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 6 | 4 | 6 | 6 | 1 |
 | 2 | 9 | 5 | 9 | 6 | 1 |

 最早的公交车是 1 路，时间 6。Serval 乘坐 1 路。 

### 示例 2

 输入：```
3 2
2 2
2 3
2 4
```| 路线 | s_i | d_i | 下一班车 | 最佳时间 | 最佳路线 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 2 | 2 | 2 | 2 | 1 |
 | 2 | 2 | 3 | 2 | 2 | 1 |
 | 3 | 2 | 4 | 2 | 2 | 1 |

 所有路线的首班车时间为2点。1至3号路线均有效； 该算法选择第一个遇到的最小值，即路线 1。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每条路线扫描一次，下一班车的算法为 O(1) |
 | 空间| O(1) | O(1) | 仅维护少数变量； 不需要大型数据结构|

 假设 n ≤ 100，该解决方案的运行时间不到一毫秒。 与 256 MB 限制相比，内存使用量可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, t = map(int, input().split())
    best_time = float('inf')
    best_route = -1
    for i in range(1, n + 1):
        s, d = map(int, input().split())
        if s >= t:
            next_bus = s
        else:
            wait = (t - s + d - 1) // d
            next_bus = s + wait * d
        if next_bus < best_time:
            best_time = next_bus
            best_route = i
    return str(best_route)

# Provided samples
assert run("2 2\n6 4\n9 5\n") == "1", "sample 1"
assert run("3 2\n2 2\n2 3\n2 4\n") == "sample 2"

# Custom cases
assert run("1 1\n1 1\n") == "1", "single route catches immediately"
assert run("2 10\n1 3\n2 4\n") == "1", "earliest bus requires multiple intervals"
assert run("3 5\n2 2\n3 3\n5 1\n") == "3", "exact match at t"
assert run("3 7\n2 2\n3 3\n4 4\n") == "1", "multiple options, first min picked"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 1\n1 1 | 1 1\n1 1 | 1 | 单一路线即刻捕获 |
 | 2 10\n1 3\n2 4 | 1 | 等待多个间隔，检查计算|
 | 3 5\n2 2\n3 3\n5 1 | 3 | 选择恰好在 t 的路线 |
 | 3 7\n2 2\n3 3\n4 4 | 1 | 多条路线到达同一下一班车； 选择第一个最小值 |

 ## 边缘情况

 如果`t`在路线的第一辆巴士之前，`s_i >= t`, 下一班车是`s_i`。 例如，`t=1`,`s=5`,`d=3`给出`next_bus=5`。 该算法正确地将其识别为最早的巴士。 当多条路线具有相同的最早下一班车时，算法会选择第一个遇到的最小值。 为了`t=2`和公共汽车`[2,4]`,`[2,5]`,`[2,6]`,`best_time`在路线 1 处变为 2，输出为路线 1。这满足了问题，因为任何最早公交车的路线都是可接受的。
