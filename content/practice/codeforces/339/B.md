---
title: "CF 339B - Xenia 和 Ringroad"
description: "我们有一个圆形城市，有 n 栋房屋沿着环路顺时针排列。 每栋房子都有一个从 1 到 n 的唯一编号，交通只按顺时针方向流动。 Xenia 从 1 号房屋开始，有 m 个任务按照特定顺序完成，每个任务位于编号 a[i] 的房屋处。"
date: "2026-06-06T17:08:15+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 339
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 197 (Div. 2)"
rating: 1000
weight: 339
solve_time_s: 115
verified: false
draft: false
---

[CF 339B - Xenia 和 Ringroad](https://codeforces.com/problemset/problem/339/B)

 **评分：** 1000
 **标签：** 实施
 **求解时间：** 1m 55s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个圆形城市`n`房屋沿环路顺时针排列。 每栋房子都有一个唯一的编号，从 1 到`n`，并且交通仅顺时针流动。 Xenia 从 1 号房子开始，并有`m`按特定顺序完成的任务，每个任务位于一个门牌号`a[i]`。 从一栋房子移动到其顺时针方向的邻居所需的时间是 1 个单位。 目标是计算 Xenia 按照给定顺序完成所有任务所需的总时间。 

输入由两个整数组成`n`和`m`， 其次是`m`代表 Xenia 必须访问的房屋序列的整数。 输出是一个整数，即完成所有任务的总时间。 

考虑到约束条件（`2 ≤ n ≤ 10^5`和`1 ≤ m ≤ 10^5`）和 2 秒的时间限制，任何算法都必须在大致线性的时间内运行。 嵌套循环或二次方法，其执行次数可达`10^10`在最坏的情况下，操作速度太慢。 每个动作都可以在常数时间内计算出来，因此我们可以瞄准`O(m)`解决方案。 

非明显的边缘情况包括下一个任务是在数量小于当前房屋的房屋中的情况。 例如，如果 Xenia 位于由 4 栋房屋组成的环中的 3 号房屋，而下一个任务是在 2 号房屋，则她必须遍历 4 号房屋，然后遍历 1 号房屋，然后才能到达 2 号房屋。仅减去索引的简单方法会错误地给出负行程时间。 另一个边缘情况是同一所房子里的连续任务，这应该需要零额外时间。 例如，在`n = 5`, 任务`[3, 3, 2]`，到达 3 处第二个任务的时间为零，然后她沿着环从 3 移动到 2，需要 4 个单位，而不是 2 个单位。 

## 方法

 蛮力方法将模拟 Xenia 沿着环路一步步从一个房子移动到另一个房子。 对于每项任务，我们都会为遍历的每个房屋增加一个计数器。 虽然这在概念上是正确的，但最坏的情况发生在 Xenia 必须遍历每个任务的几乎整个环时，导致`O(m * n)`操作，大约是`10^10`对于最大的限制并且太慢了。 

关键的观察结果是，沿着单向环形道路移动使我们能够使用简单的算术而不是模拟每一步来计算两栋房子之间的旅行时间。 如果 Xenia 在家`current`并且需要达到`next`，沿环的距离为`next - current`如果`next >= current`， 或者`n - (current - next)`如果`next < current`。 这说明了围绕环的缠绕。 这将模拟转换为对任务列表的单个线性传递，以恒定的时间计算每个任务的距离。 

通过将这些距离相加，我们可以计算出总时间`O(m)`除了跟踪当前房屋和总时间的变量之外，没有额外的空间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解（逐步模拟）| O(m * n) | O(1) | O(1) | 太慢了 |
 | 最优（算术计算距离）| O(米) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 初始化`current`到 1，代表 Xenia 的起始房屋，以及`total_time`到 0。我们追踪`current`因为下一个任务取决于Xenia当前所在的房子。 
2. 迭代每个任务`task`按给定的顺序。 对于每个`task`，确定移动的时间`current`到`task`。 如果`task >= current`，距离为`task - current`。 否则，她必须环绕戒指，所以距离是`n - (current - task)`。 将此距离添加到`total_time`。 
3. 更新`current`到`task`以反映 Xenia 的新位置。 
4. 处理完所有任务后，打印`total_time`。 

为什么它有效：保持不变的是`current`在进行下一个任务之前，总是准确地反映 Xenia 当前的房子。 距离计算通过区分下一个任务在房屋编号方面领先或落后的情况，正确处理了道路的循环性质。 按顺序对这些距离求和可以保证所有行程时间都被计算一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
tasks = list(map(int, input().split()))

current = 1
total_time = 0

for task in tasks:
    if task >= current:
        total_time += task - current
    else:
        total_time += n - (current - task)
    current = task

print(total_time)
```第一行读取城市规模和任务数量。 第二行读取任务序列。 我们初始化`current`到 1，起始房屋，以及`total_time`到 0。循环迭代任务并根据任务门牌号是否领先或需要绕行来计算距离。 更新中`current`确保下一次迭代使用正确的起点。 这种方法可以避免差一错误，因为门牌号从 1 开始。 

## 工作示例

 **样品1**

 输入：```
4 3
3 2 3
```| 任务| 当前| 距离 | 总时间 |
 | --- | --- | --- | --- |
 | 3 | 1 | 2 | 2 |
 | 2 | 3 | 3 | 5 |
 | 3 | 2 | 1 | 6 |

 Xenia 移动 1→2→3（2 个单位），环绕 3→4→1→2（3 个单位），然后 2→3（1 个单位）。 总时间为6。 

**样品2**

 输入：```
5 4
2 2 4 1
```| 任务| 当前| 距离 | 总时间 |
 | --- | --- | --- | --- |
 | 2 | 1 | 1 | 1 |
 | 2 | 2 | 0 | 1 |
 | 4 | 2 | 2 | 3 |
 | 1 | 4 | 2 | 5 |

 这表明同一房屋中的连续任务花费了零时间，并且 4→1 的环绕逻辑得到了正确处理。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(米) | 每个任务都使用恒定时间算术处理一次。 |
 | 空间| O(米) | 我们存储任务列表； 不需要额外的结构。 |

 这完全符合以下限制：`m`和`n`最多 10^5，并且每个算术运算都是微不足道的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, m = map(int, input().split())
    tasks = list(map(int, input().split()))
    current = 1
    total_time = 0
    for task in tasks:
        if task >= current:
            total_time += task - current
        else:
            total_time += n - (current - task)
        current = task
    return str(total_time)

# provided sample
assert run("4 3\n3 2 3\n") == "6", "sample 1"

# custom tests
assert run("5 4\n2 2 4 1\n") == "5", "consecutive tasks & wrap"
assert run("2 5\n1 2 1 2 1\n") == "5", "small n, alternating"
assert run("10 1\n10\n") == "9", "single task at last house"
assert run("3 3\n3 3 3\n") == "2", "all tasks same house"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 5 4\n2 2 4 1 | 5 4\n2 2 4 1 5 | 连续任务和环绕逻辑 |
 | 2 5\n1 2 1 2 1 | 2 5\n1 2 1 2 1 5 | 小环、任务交替、全遍历 |
 | 10 1\n10 | 10 1 9 | 最后一栋房子的单一任务|
 | 3 3\n3 3 3 | 3 3\n3 3 3 | 2 | 同屋重复任务，零距离重复|

 ## 边缘情况

 对于环上按降序排列的任务，算法可以正确换行。 输入`n=4, tasks=[4,1,2]`结果`3+1+1=5`单位：1→2→3→4（3 单位）、包裹 4→1（1 单位）、1→2（1 单位）。 对于同一房子中的重复任务，距离为零，例如，`n=5, tasks=[2,2]`产量`1`单元。 在这两种情况下，算术距离计算可确保正确的行进时间，而无需逐步模拟每个房屋。
