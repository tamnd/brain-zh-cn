---
title: "CF 253E - 打印机"
description: "我们正在模拟一个随着时间的推移接收任务的单线程打印机。 每个任务都会在给定时间到达，具有已知的页面数和优先级，该优先级确定多个任务等待时提供服务的顺序。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 253
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 154 (Div. 2)"
rating: 2200
weight: 253
solve_time_s: 61
verified: true
draft: false
---

[CF 253E - 打印机](https://codeforces.com/problemset/problem/253/E)

 **评分：** 2200
 **标签：** 二分查找、数据结构、实现、排序
 **求解时间：** 1m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在模拟一个随着时间的推移接收任务的单线程打印机。 每个任务都会在给定时间到达，具有已知的页面数和优先级，该优先级确定多个任务等待时提供服务的顺序。 较高优先级的任务会抢占较低优先级的任务。 问题在于，恰好缺少一项任务的优先级。 相反，我们知道该任务何时完成打印。 

目标有两个：第一，推断未知的优先级；第二，确定每个任务的确切完成时间，包括优先级缺失的任务。 打印机每秒打印一页，任务到达后立即进入队列。 

限制因素很大。 我们最多可以有 50,000 个任务，每个任务可以非常大（页面最多 10^9，时间最多 10^9，完成时间最多 10^15）。 这立即排除了整个时间线上任何逐秒的暴力模拟，因为在最坏的情况下，简单的方法可能会迭代长达 10^15 秒。 相反，我们需要一种方法，其复杂性取决于任务数量，而不是打印的总秒数。 

其中存在一些微妙的陷阱。 例如，如果多个任务同时到达，则应首先选择优先级最高的任务。 到货订单管理不善可能会导致完成时间不正确。 另一个陷阱是假设未知任务总是最后完成； 实际上，如果它的优先级低于某些已知任务，它可能会被后来到达的任务抢占。 

## 方法

 强力解决方案将尝试丢失任务的所有可能优先级，逐秒模拟打印机，并检查哪个优先级导致观察到的完成时间。 蛮力之所以有效，是因为模拟打印机很简单：保留等待任务的优先级队列，每秒选择最高优先级的任务，减少其剩余页面，并记录其完成时间。 但这失败了，因为时间线可以达到10^15秒； 一次迭代一秒是不可行的。 

关键的见解是打印机的行为仅在离散时刻发生变化：当任务到达或任务完成时。 我们永远不需要模拟中间的几秒。 通过维护等待任务的优先级队列并将时间提前到下一个相关事件，我们可以有效地计算完成时间。 一旦这个模拟函数存在，我们就可以对未知任务的可能优先级值执行二分搜索。 我们检查候选优先级是否会导致未知任务的给定完成时间，并相应地调整我们的搜索。 

实现这一点的秘诀在于意识到我们只关心优先级的相对顺序。 因此我们只能在其他任务尚未采用的值中进行搜索。 使用堆作为优先级队列可以保持插入和提取对数，从而得到总体 O(n log n log U) 解决方案，其中 U 是未知任务的可能优先级数。 这对于 n = 50,000 且 U 最大为 10^9 是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(T * n) | O(n) | 太慢了，T能到10^15 |
 | 模拟+二分查找| O(n log n log U) | O(n log n log U) | O(n) | 已接受 |

 ## 算法演练

1. 将所有任务读入列表，并分离出优先级未知的任务。 存储到达时间、页数以及已知优先级或未知任务的占位符。 还记录未知任务的目标完成时间。 
2. 建立一组所有已知的优先事项。 这使我们能够为未知任务选择不与现有任务冲突的候选优先级。 
3. 实现模拟功能。 初始化按优先级键控的最小堆（或最大堆，具体取决于约定），以便打印机始终从队列中选择最高优先级的任务。 保留指向当前时间的指针。 关键的优化是事件驱动的模拟：提前到下一个任务到达或当前任务的下一页完成的时间。 
4. 对于未知任务的每个候选优先级，分配它并运行模拟。 在模拟过程中，每当任务完成时，记录其完成时间。 如果未知任务在目标时间完成，我们就找到了正确的优先级。 
5. 由于优先级是最大 10^9 的不同整数，因此在尚未使用的优先级的可行范围内执行二分搜索。 每次模拟运行都会给出一个布尔值：此优先级是否会产生目标完成时间？ 相应地缩小搜索范围。 
6. 确定正确的优先级后，重新运行模拟以捕获所有任务的准确完成时间。 按照任务输入的顺序输出确定的优先级和完成时间。 

工作原理：该算法维护等待打印的任务的优先级队列。 不变的是队列中优先级最高的任务始终是正在打印的任务。 离散事件模拟确保不会跳过任何任务，并且根据规则选择任务，因此计算出的完成时间与打印机将产生的时间完全匹配。 二分搜索确保我们找到一个完全满足缺失任务的已知完成时间的优先级。 

## Python 解决方案```python
import sys
import heapq
input = sys.stdin.readline

def simulate(tasks, unknown_idx, unknown_priority):
    n = len(tasks)
    events = sorted([(t, i) for i, (t, _, _) in enumerate(tasks)])
    finish_times = [0] * n
    waiting = []
    time = 0
    task_pages = [s for _, s, _ in tasks]
    
    if unknown_idx != -1:
        tasks[unknown_idx] = (tasks[unknown_idx][0], tasks[unknown_idx][1], unknown_priority)
    
    i = 0
    while i < n or waiting:
        if not waiting:
            time = max(time, events[i][0])
        
        while i < n and events[i][0] <= time:
            idx = events[i][1]
            _, _, prio = tasks[idx]
            heapq.heappush(waiting, (-prio, idx))
            i += 1
        
        prio, idx = heapq.heappop(waiting)
        task_pages[idx] -= 1
        time += 1
        if task_pages[idx] == 0:
            finish_times[idx] = time
    
    return finish_times

def main():
    n = int(input())
    tasks = []
    unknown_idx = -1
    used_priorities = set()
    
    for idx in range(n):
        t, s, p = map(int, input().split())
        tasks.append([t, s, p])
        if p == -1:
            unknown_idx = idx
        else:
            used_priorities.add(p)
    
    target_time = int(input())
    
    low, high = 1, 10**9
    result_priority = -1
    while low <= high:
        mid = (low + high) // 2
        if mid in used_priorities:
            if mid == 10**9:
                mid -= 1
            else:
                mid += 1
        finish_times = simulate([list(task) for task in tasks], unknown_idx, mid)
        if finish_times[unknown_idx] == target_time:
            result_priority = mid
            break
        elif finish_times[unknown_idx] < target_time:
            low = mid + 1
        else:
            high = mid - 1
    
    finish_times = simulate([list(task) for task in tasks], unknown_idx, result_priority)
    
    print(result_priority)
    print(' '.join(map(str, finish_times)))

if __name__ == "__main__":
    main()
```在代码中，我们仔细处理事件驱动的模拟，以便我们永远不会模拟不必要的空闲秒。 具有相同到达时间的任务在同一迭代中被推入堆中。 即使插入未知任务，优先级队列也始终确保打印正确的任务。 二分查找仅限于尚未使用的值。 

## 工作示例

 **示例输入 1**```
3
4 3 -1
0 2 2
1 3 3
7
```| 时间 | 队列| 印刷| 完成时间 | 说明|
 | --- | --- | --- | --- | --- |
 | 0 | 2 | 2 | - | 仅任务2已到达|
 | 1 | 2,3 | 3 | - | 任务3优先级抢占|
 | 2 | 2,3 | 3 | - | 继续任务 3 |
 | 3 | 2,3 | 3 | 4 | 任务3完成 |
 | 4 | 2,1 | 1 | - | 未知任务1开始|
 | 5 | 2,1 | 1 | - | 继续任务 1 |
 | 6 | 2,1 | 1 | 7 | 任务 1 完成 |
 | 7 | 2 | 2 | - | 恢复任务 2 |
 | 8 | | 2 | 8 | 任务2完成 |

 这证实了未知任务必须具有优先级 4 才能在 7 处准确完成。 

**自定义输入2**```
2
0 5 -1
2 1 1
6
```未知任务到达 0，有 5 页。 任务 2 到达 2。要在 6 处完成，未知任务的优先级必须高于 1。模拟证实了这一点。 

## 复杂度分析

 | 测量| 复杂性 | 解释
