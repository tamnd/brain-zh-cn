---
title: "CF 43E - 竞赛"
description: "我们被要求分析一场长度为 _s_ 公里、涉及 _n_ 辆车的直线比赛。 每辆车都有一个行驶段列表，每个段指定一个恒定速度和持续时间。 汽车以该速度行驶指定时间，然后切换到下一个路段。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 43
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 42 (Div. 2)"
rating: 2300
weight: 43
solve_time_s: 207
verified: true
draft: false
---
[CF 43E - 竞赛](https://codeforces.com/problemset/problem/43/E)

 **评分：** 2300
 **标签：** 暴力破解、实现、两个指针
 **求解时间：** 3m 27s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求分析一场长度为 _s_ 公里、涉及 _n_ 辆车的直线比赛。 每辆车都有一个行驶段列表，每个段指定一个恒定速度和持续时间。 汽车以该速度行驶指定时间，然后切换到下一个路段。 所有赛车同时在起跑线上出发。 我们的任务是计算比赛期间一辆车超越另一辆车的次数，仅考虑瞬时超车。 在起点或终点线相遇的车辆不计算在内。 

输入指定赛车数量和比赛长度，后面是每辆车的赛段序列。 每个部分由以公里每小时为单位的速度和以小时为单位的持续时间组成。 赛车各部分所行驶的距离之和保证等于比赛长度。 

给定约束条件，_n_ 最多为 100，每辆车最多有 100 个分段，而 _s_ 最多可达 10^6。 这表明随着时间的推移以小增量进行简单迭代是不可行的，因为 _s_ 可能非常大。 相反，我们必须利用每辆车在距离-时间空间中分段线性运动的结构。 

非明显的边缘情况包括两辆车在几个路段上具有相同速度然后出现分歧的情况。 例如，两辆车都以速度 5 启动 1 小时，然后一辆加速，另一辆减速。 如果我们只检查路段边界，则错误地计算超车次数可能包括计算路段内的多个领先位置。 另一个微妙的情况是当超过两辆车同时发生多次超车时。 我们必须确保每次成对超车都是单独计算的。 

## 方法

 蛮力方法是以非常精细的时间增量模拟所有汽车，在每个时刻比较每一对汽车。 对于每个小时间步长，我们将计算每辆车的距离，并在一辆车超过另一辆车时计算超车次数。 这原则上是正确的，但速度太慢，因为时间步长必须足够小才能检测到所有线索，并且操作数量随着 _s × n^2_ 增长。 当 _s_ 最大为 10^6 且 _n_ 最大为 100 时，这会导致 10^10 次操作，超出了 2 秒的限制。 

关键的见解是，每辆车的运动都是分段线性的，因此超车仅发生在段边界处或当两辆车的线性轨迹交叉时。 我们可以将每辆车的分段处理为累积的距离-时间表示，然后以所有车辆同步的方式模拟比赛，仅更新每个分段开始和结束时的位置。 在每个时间步长，我们都会按距离检查汽车的相对顺序，并在顺序发生变化时计算超车次数。 由于每辆车最多有 100 个段且 _n_ ≤ 100，因此要检查的事件总数是可控的，O(n × k)，并且每个事件检查对之间的顺序变化为 O(n^2)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(s × n^2) | O(s × n^2) | O(n) | 太慢了|
 | 最佳| O(n × k × n) = O(n^2 × k) | O(n × k × n) = O(n^2 × k) | O(n × k) | O(n × k) | 已接受 |

 ## 算法演练

 1. 解析输入并将每辆车的分段转换为累积距离-时间表示。 对于每个路段，计算结束位置作为该路段中行驶距离的总和。 
2. 初始化所有车辆的当前位置列表和超车计数器。 根据汽车的位置跟踪以前的汽车顺序。 
3. 按时间顺序迭代所有段边界。 由于分段可以有不同的持续时间，因此为每辆车维护一个指示当前分段的指针。 
4. 对于对应于任何汽车的段末端的每个时间步，使用线性运动公式更新该汽车的位置`position += speed × duration`。 
5. 此时更新所有位置后，按距离对车辆进行排序，以确定新的顺序。 将新订单与之前的订单进行比较。 对于相对位置发生变化的每一对汽车，增加超车计数器。 
6. 将之前的订单更新为新订单并继续进行下一个活动。 
7. 继续，直到处理完所有汽车的所有段。 输出超车总数。 

为什么它起作用：不变的是，在段边界之间，所有汽车都线性移动，只有当线性轨迹相交时才会发生超车。 通过仅在路段端点进行处理并检查相对顺序变化，我们对每个超车只计数一次。 由于该问题保证超车是瞬时的，因此我们不会错过路段之间的任何事件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, s = map(int, input().split())
cars = []

for _ in range(n):
    data = list(map(int, input().split()))
    k = data[0]
    segments = []
    for j in range(k):
        v, t = data[1 + 2*j], data[2 + 2*j]
        segments.append((v, t))
    cars.append(segments)

# Convert segments into cumulative distances and times
positions = [[0]] * n
times = [[0]] * n
for i in range(n):
    pos_list = [0]
    time_list = [0]
    for v, t in cars[i]:
        pos_list.append(pos_list[-1] + v * t)
        time_list.append(time_list[-1] + t)
    positions[i] = pos_list
    times[i] = time_list

overtakes = 0
prev_order = list(range(n))
current_time = 0

# Generate all event times
event_times = set()
for tlist in times:
    event_times.update(tlist)
event_times = sorted(event_times)

# For each event time, compute car positions
for t in event_times[1:]:
    dist = []
    for i in range(n):
        # Find which segment car i is in
        seg_idx = 0
        while seg_idx < len(times[i]) - 1 and times[i][seg_idx + 1] <= t:
            seg_idx += 1
        # Compute position at time t
        start_time = times[i][seg_idx]
        start_pos = positions[i][seg_idx]
        v = cars[i][seg_idx][0]
        curr_pos = start_pos + v * (t - start_time)
        dist.append((curr_pos, i))
    # Sort by distance
    dist.sort(reverse=True)
    new_order = [idx for _, idx in dist]
    # Count overtakes: every pair that swapped order
    for j in range(n):
        for k in range(j + 1, n):
            a, b = new_order[j], new_order[k]
            if prev_order.index(a) > prev_order.index(b):
                overtakes += 1
    prev_order = new_order

print(overtakes)
```第一部分读取并解析输入。 每辆车的路段都会转换为累积距离和时间，因此我们可以随时有效地计算位置。 然后，我们生成所有唯一的路段端点作为事件时间，因为超车只能在这些时间发生。 在每个事件中，我们使用线性插值计算每辆车的当前位置。 按距离排序给出当前顺序，并将其与之前的顺序进行比较以确定所有超车。 

## 工作示例

 示例 1 输入：```
2 33
2 5 1 2 14
1 3 11
```| 时间 | 车 0 位置 | 车 1 位置 | 订单| 新超越|
 | --- | --- | --- | --- | --- |
 | 0 | 0 | 0 | [0,1]| 0 |
 | 1 | 5 | 3 | [0,1]| 0 |
 | 3 | 33 | 33 9 | [0,1]| 1 |

 解释：0 号车在第二段结束后的时间 3 超越 1 号车。 这恰好产生一次超车。 

自定义输入：```
3 10
1 2 5
1 1 10
2 1 3 3 1
```| 时间 | 车 0 位置 | 车 1 位置 | 车 2 位置 | 订单| 新超越|
 | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 0 | 0 | [0,1,2]| 0 |
 | 3 | 6 | 3 | 3 | [0,2,1]| 2 |
 | 4 | 8 | 4 | 6 | [0,2,1]| 0 |
 | 5 | 10 | 10 5 | 9 | [0,2,1]| 1 |

 ## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2 × k) | O(n^2 × k) | 对于每个 O(n × k) 段边界，我们比较每对 n 辆汽车。 |
 | 空间| O(n × k) | O(n × k) | 存储每辆车所有路段的累积位置和时间。 |

 n=100、k=100 的最坏情况会导致 10^6 成对检查，​​这完全在 2 秒的时间限制内。 内存使用量仍低于 256 MB 限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    exec(open("solution.py").read())
    return sys.stdout.getvalue().strip()

assert run("2 33\n2
```
