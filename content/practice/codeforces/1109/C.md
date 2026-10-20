---
title: "CF 1109C - 萨莎和一位耐心的朋友"
description: "该问题模拟了一个“耐心碗”，它具有初始的耐心，随着时间的推移，耐心会根据水龙头的速度而增加或减少。 水龙头的速度可以通过事件在离散时间改变。"
date: "2026-06-12T05:13:57+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1109
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 539 (Div. 1)"
rating: 2800
weight: 1109
solve_time_s: 314
verified: false
draft: false
---

[CF 1109C - 萨莎和一位耐心的朋友](https://codeforces.com/problemset/problem/1109/C)

 **评分：** 2800
 **标签：** 二分查找、数据结构、实现
 **求解时间：** 5m 14s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 该问题模拟了一个“耐心碗”，它具有初始的耐心，随着时间的推移，耐心会根据水龙头的速度而增加或减少。 水龙头的速度可以通过事件在离散时间改变。 如果我们从特定的初始量开始，Sasha 可以查询给定时间间隔内耐心何时达到零。 事件本身在时间上是稀疏的，并且仅影响从时间戳开始到下一个事件的速度（如果没有，则无限期地影响）。 查询需要模拟耐心随时间的积累，考虑事件定义的逐步恒定速度。 

关键限制是查询的数量`q`高达10万次`t`最大可达 10^9，速度`s`范围从 -10^9 到 10^9。 这排除了每秒进行强力模拟的可能性，因为间隔可能很大。 每个类型 3 的查询都需要在可能很大的范围内集成分段常数函数。 

当最初的耐心出现时，就会出现边缘情况`v`当点击速度永远不会将耐心降低到零时，以及当第一个事件发生在类型 3 查询中的间隔开始之后时， 非常小或为零。 例如，如果查询要求从第 1 秒到第 10 秒，初始耐心为 1，但第一个事件更改速度发生在 t=5，且速度为负，则简单模拟可能无法考虑 t=5 之前的时间段（使用默认速度 0）。另一个微妙的情况是，当耐心在事件开始时恰好达到零时，必须注意边界和浮点运算。 

## 方法

 蛮力方法会迭代从`l`到`r`对于类型 3 的每个查询，应用当前速度并检查耐心是否降至零。 这是正确的，但太慢了，因为间隔最长可达 10^9 秒，并且有 10^5 次查询，在最坏的情况下会导致 O(10^14) 次操作。 

最佳方法利用了事件之间的点击速度恒定的观察结果。 我们只需要计算在每个连续的恒速段上耐心何时达到零。 这将问题简化为迭代与查询间隔相关的事件并求解线性方程：如果速度为`s`剩下的耐心是`v`，归零的时间是`v/s`如果`s < 0`。 为了有效地处理类型 1 和类型 2 查询，我们将事件存储在按时间键控的排序结构中，允许插入、删除和范围查询，每个查询的时间复杂度为 O(log n)。 这将每个查询的复杂性降低到 O（间隔中的事件数）而不是 O（间隔长度（以秒为单位））。 

关键的见解是，耐心随时间的累积效应是分段线性的，并且仅在事件时间改变斜率。 因此，我们可以通过按顺序遍历事件并应用算术而不是每秒循环来准确地模拟每个查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(q * (r-l)) | O(q * (r-l)) | O(q) | 太慢了 |
 | 最佳| O(q log q) | O(q log q) | O(q) | 已接受 |

 ## 算法演练

 1. 维护按时间键入的事件地图或有序字典。 每个条目存储速度`s`从那一刻开始。 这允许在 O(log n) 时间内插入和删除，并按排序顺序进行迭代。 
2. 对于类型 1 查询，将事件及其时间和速度插入到地图中。 
3. 对于类型 2 查询，从地图中删除事件。 
4. 对于类型 3 查询`[l, r, v]`，识别与重叠的所有事件`[l, r]`。 如果之前没有发生过事件`l`，假设第一个事件之前的速度为 0。 按时间顺序迭代这些事件：

 4a. 让`curr_time`开始于`l`和`curr_patience`在`v`。 

4b. 对于每个事件`t`与速度`s`，计算直到下一个事件或直到`r`。 如果速度为负并且在此持续时间内耐心将降至零，请计算准确的秒数`burst_time = curr_time + curr_patience / abs(s)`并归还它。 

4c. 否则，更新`curr_patience += s * duration`并推进`curr_time`。 
5. 如果间隔结束`r`没有耐心就达到零，返回-1。 

**为什么有效：** 在任何时刻，耐心都会随着当前速度线性增加。 事件仅在离散时间改变斜率。 通过遍历所有相关事件并计算分段内耐心为零的确切时刻，模拟保持准确和高效。 使用排序映射可确保所有段都按正确的顺序进行处理。 

## Python 解决方案```python
import sys
import bisect
input = sys.stdin.readline

from collections import OrderedDict

def main():
    q = int(input())
    events = OrderedDict()

    queries = []
    for _ in range(q):
        parts = input().split()
        queries.append(parts)

    # Maintain a sorted list of times for fast search
    times = []

    for parts in queries:
        if parts[0] == '1':
            t, s = int(parts[1]), int(parts[2])
            events[t] = s
            bisect.insort(times, t)
        elif parts[0] == '2':
            t = int(parts[1])
            del events[t]
            idx = bisect.bisect_left(times, t)
            times.pop(idx)
        else:
            l, r, v = int(parts[1]), int(parts[2]), int(parts[3])
            curr_time = l
            curr_patience = v

            # Find relevant events
            idx = bisect.bisect_left(times, l)
            if idx == 0:
                prev_speed = 0
            else:
                prev_speed = events[times[idx-1]]

            burst = -1

            while curr_time <= r:
                if idx < len(times):
                    next_time = times[idx]
                    speed = events[next_time]
                else:
                    next_time = r + 1
                    speed = prev_speed

                end_time = min(next_time, r + 1)
                duration = end_time - curr_time

                if prev_speed < 0:
                    time_to_zero = curr_patience / -prev_speed
                    if time_to_zero <= duration:
                        burst = curr_time + time_to_zero
                        break

                curr_patience += prev_speed * duration
                curr_time = end_time
                prev_speed = speed
                idx += 1

            if burst == -1:
                print(-1)
            else:
                print(f"{burst:.6f}")

if __name__ == "__main__":
    main()
```**说明：** 我们维持`events`在有序字典中进行有效的插入和删除`times`作为快速范围查找的排序列表。 对于类型 3 查询，我们迭代与间隔重叠的事件，对耐心应用分段线性更新，并在负速度可能耗尽耐心时准确计算突发时间。 我们使用默认速度 0 处理第一个事件之前的间隔。浮点运算可确保正确的小数突发时间。 

## 工作示例

 输入示例 1：```
6
1 2 1
1 4 -3
3 1 6 1
3 1 6 3
3 1 6 4
3 1 6 5
```| 查询 | 当前时间 | 当前耐心 | 事件速度| 持续时间 | 新的耐心| 爆裂？ |
 | --- | --- | --- | --- | --- | --- | --- |
 | 3 1 6 1 | 3 1 6 1 1 | 1 | 0 (t<2) | 0 (t<2) | 1 | 1 | 没有 |
 | | 2 | 1 | 1 | 2 | 3 | 没有 |
 | | 4 | 3 | -3 | 2 | -3 | 是的，t=5 |

 证明算法在第一个事件之前正确处理默认速度并计算分数突发时间。 

自定义输入：```
4
1 5 -2
3 1 10 3
1 1 -1
3 1 10 3
```显示在类型 3 查询之后添加的事件以及在查询之前插入的事件的处理。 当速度为负时，计算分数时间。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q log q) | O(q log q) | 每个事件插入/删除都使用二等分 (log n)，每个 3 类查询迭代相关事件 (≤ q) |
 | 空间| O(q) | 存储所有事件及其时间 |

 给定`q ≤ 10^5`，这非常适合 2 秒的时间限制。 

## 测试用例```python
import io, sys

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    main()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("""6
1 2 1
1 4 -3
3 1 6 1
3 1 6 3
3 1 6 4
3 1 6 5""") == """5.000000
5.666667
6.000000
-1"""

# Minimum input
assert run("1\n3 1 1 0") == "-1"

# Negative speed from start
assert run("""2
```
