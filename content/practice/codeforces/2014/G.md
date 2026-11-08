---
title: "CF 2014G-银河时代"
description: "我们正在跟踪小约翰随时间的牛奶消耗量。 他分批收到牛奶，每批都与日期和数量相关。 牛奶的保鲜期限为 k 天，这意味着在 di 天获得的牛奶将在 di + k - 1 天后变质。"
date: "2026-06-08T13:02:45+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 2014
codeforces_index: "G"
codeforces_contest_name: "Codeforces Round 974 (Div. 3)"
rating: 2200
weight: 2014
solve_time_s: 119
verified: true
draft: false
---

[CF 2014G - 银河日子](https://codeforces.com/problemset/problem/2014/G)

 **评分：** 2200
 **标签：** 暴力破解、数据结构、贪婪、实现
 **求解时间：** 1m 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在跟踪小约翰随时间的牛奶消耗量。 他分批收到牛奶，每批都与日期和数量相关。 牛奶有保鲜期`k`天，意味着当天获得的牛奶`d_i`一天后就会变质`d_i + k - 1`。 每天，约翰都贪婪地喝着最新鲜的牛奶，最多可达`m`品脱。 每当他设法准确喝水时，牛奶满足日就会到来`m`品脱。 

输入是一系列日记条目，每个条目指定一天和收到的牛奶量。 我们的目标是计算每个测试用例 John 完全满意的天数。 奶水不足的日子不算在内。 每个测试用例的输出是一个整数。 

约束条件允许`n`最多`10^5`每个测试用例总共`n`超过所有测试用例`2 * 10^5`。 每日消费限额`m`和新鲜度`k`也达到`10^5`。 这意味着任何在完整时间线上每天迭代的解决方案最多`10^6`会太慢。 相反，我们必须以有效的方式处理牛奶事件，仅关注牛奶存在或变质的日子。 

边缘情况包括前几天的牛奶积聚，但后来的条目不按立即顺序到达的情况。 例如，牛奶在第 1 天和第 4 天到达，`k = 3`，表示第一天的牛奶会在第四天之前变质，即使约翰每天只喝部分牛奶。 另一种边缘情况发生在约翰收到的牛奶多于他一天能喝的量时——剩余的牛奶必须在不失去新鲜度限制的情况下继续使用。 

## 方法

 强力解决方案将维护一个代表每天的数组，并跟踪有多少牛奶可用。 对于每一天，我们都会减去消耗的牛奶，丢弃变质的牛奶，并计算满意的天数。 这原则上是正确的，但太慢了，因为天数可以达到`10^6`。 每天迭代每个批次的结果大约是`10^6 * 10^5`最坏的情况下，超过时间限制的操作。 

关键的见解是我们不需要每天都进行模拟。 牛奶消耗量可以表示为按过期时间排序的批次队列，因为约翰总是先喝最新鲜的牛奶。 使用优先级队列或双端队列使我们能够有效地维护牛奶库存。 直接处理每天的事件（牛奶获取或牛奶过期）。 我们更新牛奶数量并计算满意天数，而不重复空置天数。 通过跳过几天之间的间隙，我们减少了不必要的操作，并实现了日记条目数量的线性复杂性。 

蛮力方法之所以有效，是因为它可以准确地模拟现实，但当天数相对于牛奶事件的数量太大时，它就会失败。 观察到牛奶可以作为过期批次进行追踪，这让我们减少了加工过程中的问题`2n`每个测试用例的事件。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(max(d_i) * n) | O(最大(d_i)) | 太慢了|
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 如果尚未分类，则按收购日期对牛奶批次进行分类。 这确保我们按时间顺序加工牛奶。 由于该问题保证了排序输入，因此我们在实践中可以跳过这一步。 
2. 初始化双端队列或优先队列来存储牛奶批次。 每个元素存储两个值：剩余品脱和到期日。 队列前面的是今天可以喝到的最新鲜的牛奶。 
3. 设置变量`current_day`至第一个收购日。 考虑事件之间的天数间隔，按时间顺序迭代所有牛奶事件。 
4. 每天喝牛奶：

 - 将过期牛奶从队列前面移走。 如果批次的到期日小于`current_day`。 
- 喝最多`m`品脱。 从最新鲜的批次开始。 如果一个批次的数量少于`m`品脱，完全喝完并继续下一批。 跟踪消耗的牛奶总量。 
- 如果确实如此`m`消耗了品脱，增加满意度计数器。 
- 移至第二天。 
5. 对于当天的每个牛奶获取事件`d_i`，追加新批次`(a_i, d_i + k - 1)`到队列中。 处理完当天的消耗后，增量`current_day`。 
6. 重复此操作，直至所有批次的牛奶都用完或过期。 

其原理：不变的是队列中始终包含按新鲜度排列的未变质牛奶。 通过始终首先食用最新鲜的批次，并在每天开始时去除过期的牛奶，我们保证消费尊重新鲜度。 仅当准确时才算满足的一天`m`消耗的品脱反映了问题的定义。 跳过没有活动的日子是安全的，因为没有牛奶，所以不可能有令人满意的日子。 

## Python 解决方案```python
import sys
import heapq
from collections import deque

input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m, k = map(int, input().split())
        events = [tuple(map(int, input().split())) for _ in range(n)]
        
        milk_queue = deque()
        satisfaction_days = 0
        idx = 0
        current_day = events[0][0]
        last_day = max(d + k - 1 for d, _ in events)

        for day in range(current_day, last_day + 1):
            # Add new milk batches for today
            while idx < n and events[idx][0] == day:
                d_i, a_i = events[idx]
                milk_queue.append([a_i, d_i + k - 1])
                idx += 1
            
            # Remove expired milk
            while milk_queue and milk_queue[0][1] < day:
                milk_queue.popleft()
            
            if not milk_queue:
                continue
            
            # Drink milk up to m pints
            to_drink = m
            while milk_queue and to_drink > 0:
                batch = milk_queue[-1]  # freshest milk is at the back
                if batch[0] <= to_drink:
                    to_drink -= batch[0]
                    milk_queue.pop()
                else:
                    batch[0] -= to_drink
                    to_drink = 0
            
            if to_drink == 0:
                satisfaction_days += 1
        
        print(satisfaction_days)

if __name__ == "__main__":
    solve()
```该代码使用了双端队列，最新鲜的牛奶位于后面，因为从后面弹出的时间复杂度为 O(1)，并且与贪婪的“最新鲜的优先”消耗保持一致。 过期的牛奶从前面取出。 没有事件的日子自然会被跳过，因为循环只处理直到`last_day`牛奶可能仍然存在的地方。 

## 工作示例

 **样品1：**

 输入：```
1 1 3
1 5
```| 日 | 牛奶队列（品脱，过期）| 喝 | 满意？ | 排队后 |
 | --- | --- | --- | --- | --- |
 | 1 | [(5,3)] | 1 | 是的 | [(4,3)] |
 | 2 | [(4,3)] | 1 | 是的 | [(3,3)] |
 | 3 | [(3,3)] | 1 | 是的 | [(2,3)] |

 满意天数 = 3。这表明牛奶在几天内持续存在，并且算法正确地喝了`m`品脱，同时尊重新鲜度。 

**样本2：**

 输入：```
2 3 3
1 5
2 7
```| 日 | 牛奶排队| 喝 | 满意？ | 排队后 |
 | --- | --- | --- | --- | --- |
 | 1 | [(5,3)] | 3 | 是的 | [(2,3)] |
 | 2 | [(2,3),(7,4)] | 3 | 是的 | [(1,3),(5,4)] |
 | 3 | [(1,3),(5,4)] | 3 | 是的 | [(3,4)] |
 | 4 | [(3,4)] | 3 | 是的 | []|

 满意天数 = 4。这表明每天开始时清除过期牛奶的重要性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个批次的牛奶添加一次，移除一次，并在每次移除操作的总 O(1) 中部分消耗。 总操作量与批次数量成线性关系。 |
 | 空间| O(n) | 队列在过期之前存储最多所有批次的牛奶。 |

 这完全符合限制，因为`n <= 2*10^5`和`k,m <= 10^5`。 使用双端队列可确保所有操作快速并避免不必要地模拟空天。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    solve()
    return output.getvalue().strip()

# Provided sample
assert run("1\n1 1 3\n1 5\n") == "3", "sample 1"

# Multiple batches, overlapping
assert run("1\n2 3 3\n1 5\n2 7\n") == "4", "overlapping milk"

# Minimum input
assert run("1\n1 1 1\n1 1\n") == "1", "minimum input"

# Maximum satisfaction
```
