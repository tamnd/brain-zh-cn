---
title: "CF 292A-短信中心"
description: "我们收到一系列到达公司 SMS 中心的任务。 每个任务由到达时间 ti 和要发送的短信数量 ci 组成。 短信中心每秒最多发送一条消息，消息按到达顺序排队。"
date: "2026-06-05T17:17:06+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 292
codeforces_index: "A"
codeforces_contest_name: "Croc Champ 2013 - Round 1"
rating: 1100
weight: 292
solve_time_s: 95
verified: true
draft: false
---

[CF 292A - SMSC](https://codeforces.com/problemset/problem/292/A)

 **评分：** 1100
 **标签：** 实施
 **求解时间：** 1m 35s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们收到一系列到达公司 SMS 中心的任务。 每个任务由一个时间组成`t_i`当它到达时和一个数字`c_i`要发送的短信数量。 短信中心每秒最多发送一条消息，消息按到达顺序排队。 在任何时刻，如果队列非空，中心都会首先发送一条消息，然后将在该时刻到达的任何新消息添加到队列的尾部。 

目标是计算两个量：发送最后一条消息的时间和任意时刻队列中消息的最大数量。 

限制很小：`n`最多 1000 次`t_i`并计数`c_i`最多为 10^6。 自从`n`很小，我们可以线性迭代任务而不用担心时间，但是我们必须仔细处理队列行为，因为每秒的模拟最多`10^6`秒太慢了。 

不明显的边缘情况包括任务到达时间相距很远，这会产生空闲期，队列可能完全清空，以及任务同时到达许多消息，这可能会导致最大队列大小激增。 例如，如果一个任务在第 1 秒到达并携带 5 条消息，而下一个任务在第 10 秒到达并携带 1 条消息，则队列在第 6 秒时清空，然后在第 10 秒收到一条新消息，因此最后一条消息在第 10 秒发送。粗心的实现可能会忘记考虑这些空闲间隙。 

## 方法

 一种暴力的方法是逐秒模拟队列，从第一次到达到所有消息发送完毕。 如果队列非空，则每秒发送一条消息，然后添加在该秒到达的消息。 虽然正确，但在最坏的情况下需要迭代长达 10^6 秒，这是不必要的且效率低下。 

关键的观察是短信中心总是每秒最多处理一条消息，并且我们知道所有任务的到达时间。 因此，我们不需要显式地每秒迭代一次。 相反，我们可以跟踪队列大小和当前时间，如果队列为空，则智能地将时间提前到下一个任务，或者连续发送消息直到下一个任务到达。 这允许在更新队列和最大队列大小的同时对任务进行线性扫描，而无需单独模拟空闲秒数。 最终的最后一条消息时间就是所有消息发送完毕后的时间，考虑到剩余队列。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解（每秒模拟）| O(max(t_i + sum(c_i))) | O(max(t_i + sum(c_i))) | O(1) | O(1) | 对于任务之间的巨大差距来说速度太慢 |
 | 最优（基于任务的模拟）| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 初始化`queue = 0`表示等待发送的消息数量，`max_queue = 0`跟踪最大队列大小，以及`current_time = 0`代表我们处理的最后一秒。 
2. 按时间顺序迭代任务。 对于每个任务`(t, c)`, 提前到达时间`t`。 计算自上次处理时间以来已经过去了多少秒：`delta = t - current_time`。 在此期间，短信中心将发送`sent = min(queue, delta)`消息。 减少`queue`经过`sent`并增加`current_time`经过`delta`。 
3.添加新消息`c`到`queue`在经过的时间间隔内发送消息后。 更新`max_queue`作为`max(max_queue, queue)`来解释新消息。 放`current_time = t`因为我们已经处理到任务到达了。 
4. 所有任务处理完毕后，队列中可能仍然有消息。 最后一条消息将在之后发送`queue`秒。 增量`current_time`经过`queue`获取最后一条消息发送的最终时间。 
5. 返回`current_time`作为最后一条消息的时间和`max_queue`作为观察到的最大队列大小。 

整个算法保持的不变量是`queue`始终表示处理当前时间后立即等待发送的消息数。 这确保了最大队列大小和最后消息时间的计算准确。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
tasks = [tuple(map(int, input().split())) for _ in range(n)]

queue = 0
max_queue = 0
current_time = 0

for t, c in tasks:
    # Time passed since last task
    delta = t - current_time
    # Send as many messages as possible in that interval
    sent = min(queue, delta)
    queue -= sent
    current_time += delta
    # Add new messages
    queue += c
    max_queue = max(max_queue, queue)

# Process remaining messages
current_time += queue

print(current_time, max_queue)
```该解决方案首先读取所有任务，然后通过仅处理任务到达和剩余消息来有效地模拟队列。 这`delta`计算确保隐式考虑空闲秒数，而无需迭代它们。 更新中`max_queue`添加消息后正确跟踪最大队列大小。 

## 工作示例

 样本1：```
Input:
2
1 1
2 1
```| 任务| 当前时间 | 三角洲 | 之前排队 | 已发送 | 排队 | 最大队列 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 1 | 1 0 | 1 | 0 | 0 | 1 | 1 |
 | 2 1 | 2 1 | 1 | 1 | 1 | 1 | 1 |
 | 结束 | 2 | - | 1 | - | 0 | 1 |

 最终输出：`3 1`构造案例：```
Input:
3
1 2
4 3
6 1
```| 任务| 当前时间 | 三角洲 | 之前排队 | 已发送 | 排队 | 最大队列 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 2 | 0 | 1 | 0 | 0 | 2 | 2 |
 | 4 3 | 1 | 3 | 2 | 2 | 3 | 3 |
 | 6 1 | 4 | 2 | 3 | 2 | 2 | 3 |
 | 结束 | 6 | - | 2 | - | 0 | 3 |

 最终输出：`8 3`此跟踪显示了算法如何处理空闲间隙和重叠消息发送。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 我们迭代每个任务一次，每个任务仅执行恒定时间操作 |
 | 空间| O(n) | 我们存储任务列表|

 和`n ≤ 1000`，该算法在 2 秒限制内运行良好。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    queue = 0
    max_queue = 0
    current_time = 0
    n = int(input())
    tasks = [tuple(map(int, input().split())) for _ in range(n)]
    for t, c in tasks:
        delta = t - current_time
        sent = min(queue, delta)
        queue -= sent
        current_time += delta
        queue += c
        max_queue = max(max_queue, queue)
    current_time += queue
    return f"{current_time} {max_queue}"

# provided samples
assert run("2\n1 1\n2 1\n") == "3 1", "sample 1"

# minimum input
assert run("1\n1 1\n") == "2 1", "single task"

# multiple messages arriving before queue empties
assert run("3\n1 2\n2 2\n3 1\n") == "6 3", "messages overlap"

# large gap between tasks
assert run("2\n1 1\n10 2\n") == "12 2", "idle period"

# all tasks have 1 message, consecutive seconds
assert run("5\n1 1\n2 1\n3 1\n4 1\n5 1\n") == "6 1", "consecutive single messages"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1 | 1 2 1 | 2 单任务边缘情况 |
 | 3\n1 2\n2 2\n3 1 | 6 3 | 到达队列重叠 |
 | 2\n1 1\n10 2 | 12 2 | 12 大空闲间隙处理|
 | 5\n1 1\n2 1\n3 1\n4 1\n5 1 | 5\n1 1\n2 1\n3 1\n4 1\n5 1 6 1 | 连续抵达，排队不增长|

 ## 边缘情况

 如果任务在前面的消息发送很久之后才到达，则`delta`确保队列在添加新任务之前完全清空。 用于输入`2\n1 1\n10 2\n`，队列是`1`第一个任务之后。 `增量 = 10 - 0 = 10
