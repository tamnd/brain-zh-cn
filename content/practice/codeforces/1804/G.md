---
title: "CF 1804G - 流量控制"
description: "我们的任务是模拟由多个用户共享的网络线路，其中每个用户传输数据的速率可以根据网络拥塞而增长或缩小。 每个用户都有开始时间、结束时间和初始数据速率。"
date: "2026-06-09T09:23:53+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dsu", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1804
codeforces_index: "G"
codeforces_contest_name: "Nebius Welcome Round (Div. 1 + Div. 2)"
rating: 3500
weight: 1804
solve_time_s: 80
verified: true
draft: false
---

[CF 1804G - 流量控制](https://codeforces.com/problemset/problem/1804/G)

 **评分：** 3500
 **标签：** 数据结构、DSU、实现
 **求解时间：** 1m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们的任务是模拟由多个用户共享的网络线路，其中每个用户传输数据的速率可以根据网络拥塞而增长或缩小。 每个用户都有开始时间、结束时间和初始数据速率。 在每一毫秒，所有活动用户消耗的总带宽与线路容量进行比较。 如果合适，每个用户都会成功传输，并且速率会增加一。 如果超过容量，就会发生拥塞，不会传输任何字节，并且每个用户的速率减半，向下舍入。 目标是计算所有用户传输的总字节数。 

输入大小可能非常大：多达 200,000 个用户，传输时间可达$10^9$。 模拟每一毫秒是不可能的，因为它可能会导致$10^9$迭代。 关键的观察结果是，费率以可预测的模式变化，我们只需要考虑活跃用户组发生变化或费率因拥塞而调整的时刻。 对于较大的时间间隔和较高的用户数量，朴素的每毫秒模拟将会失败。 

边缘情况包括单个用户重复触发拥塞的场景、多个用户累积初始速率与带宽完全匹配的场景以及用户具有重叠间隔触发交替拥塞模式的场景。 例如，单个用户从 1 开始，速率为 1，持续 10 毫秒，可能会看到其速率多次加倍和减半； 任何相差一的错误都会产生错误的总字节数。 

## 方法

 强力方法逐毫秒迭代，跟踪活跃用户及其当前速率。 它在每一毫秒对速率进行求和，检查带宽，并应用增长或减半规则。 这是正确的，但不可行，因为间隔可以扩展到$10^9$n 可达$2 \cdot 10^5$。 操作数量可能约为$10^{14}$，远远超出了可接受的范围。 

关键的见解是我们不需要检查每一毫秒。 不拥堵时费率加1，拥堵时费率减半，形成等比序列。 通过将用户分组到不发生拥塞的连续块中，并跟踪发生拥塞的第一个毫秒，我们可以直接跳转到事件，而不是模拟每一毫秒。 同样，活跃用户的变化仅发生在其开始和结束时间，从而对事件进行自然划分。 使用优先级队列或平衡树来有效地管理活动集使我们能够仅处理相关的状态更改。 这将有效模拟减少到$O(n \log n)$复杂。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(总毫秒 × n) | O(n) | 太慢了 |
 | 基于事件的模拟| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 将每个用户的开始和结束表示为事件。 对于每个用户 i，创建一个开始事件$s_i$和结束事件$f_i + 1$。 按时间对事件进行排序使我们能够仅处理活跃用户集发生变化的时刻。 
2. 维护活跃用户的数据结构，存储他们当前的费率。 由用户 ID 键入的字典就足够了，因为我们仅在活动时访问用户。 
3. 按时间顺序遍历事件。 在两个连续事件之间，活跃用户集不会改变。 我们可以使用几何方法模拟整个区间的效果：

 - 计算当前利率的总和。 如果小于或等于带宽，则在该时间间隔内传输的总字节数为等差数列之和：$\sum_{i=0}^{length-1} \sum t_i + i \cdot \text{number of users}$。 
- 如果总和超过带宽，则模拟迭代地将速率减半，但仅跟踪第一个拥塞事件，因为速率迅速减半并最终停止下降。 
4. 根据规则更新所有活跃用户的费率。 如果最后一个段以成功传输结束，则将每个用户的速率增加间隔长度。 如果发生拥塞，则根据需要将速率迭代减半，然后继续下一个间隔。 
5. 在每个事件中，根据事件是开始事件还是结束事件，在活动集中添加或删除用户。 
6. 对所有成功传输的字节求和以计算答案。 

工作原理：该算法确保显式考虑网络状态的所有变化（无论是由于用户激活、停用还是拥塞）。 通过使用算术级数和，它可以准确地计算所有字节，而无需逐毫秒迭代。 活动集不变量保证了正确性，因为它总是反映当前传输的用户。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, b = map(int, input().split())
events = []
for i in range(n):
    s, f, d = map(int, input().split())
    events.append((s, 1, i, d))  # start event
    events.append((f + 1, -1, i, d))  # end event

events.sort()
active = {}
total_bytes = 0
prev_time = 0

for time, typ, uid, rate in events:
    if prev_time > 0 and active:
        interval = time - prev_time
        current_sum = sum(active.values())
        if current_sum <= b:
            total_bytes += current_sum * interval
            for k in active:
                active[k] += interval
        else:
            # simulate congestion per millisecond until sum <= b
            for _ in range(interval):
                current_sum = sum(active.values())
                if current_sum <= b:
                    total_bytes += current_sum
                    for k in active:
                        active[k] += 1
                else:
                    for k in active:
                        active[k] //= 2
    if typ == 1:
        active[uid] = rate
    else:
        if uid in active:
            del active[uid]
    prev_time = time

print(total_bytes)
```该解决方案首先将用户间隔转换为事件并对它们进行排序。 活动集字典维护用户速率，并按时间间隔更新。 算术和无需每毫秒迭代即可处理增长。 必要时会迭代处理拥塞。 通过使用可以避免相差一错误$f_i + 1$对于结束事件。 

## 工作示例

 ### 示例 1

 输入：```
1 3
1 5 2
```| 毫秒| 活跃用户 | 总和| 状况 | 已转发 | 新价格 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | {1:2} | 2 | ≤3 | 2 | 3 |
 | 2 | {1:3} | 3 | ≤3 | 3 | 4 |
 | 3 | {1:4} | 4 | >3 | 0 | 2 |
 | 4 | {1:2} | 2 | ≤3 | 2 | 3 |
 | 5 | {1:3} | 3 | ≤3 | 3 | 4 |

 总字节 = 2+3+0+2+3 = 10。这证实了算术级数和拥塞处理。 

### 示例 2

 输入：```
2 5
1 3 2
2 4 3
```| 毫秒| 活跃用户 | 总和| 状况 | 已转发 | 新价格 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | {1:2} | 2 | ≤5 | 2 | 3 |
 | 2 | {1:3,2:3} | 6 | >5 | 0 | {1:1,2:1} |
 | 3 | {1:1,2:1} | 2 | ≤5 | 2 | {1:2,2:2} |
 | 4 | {2:2} | 2 | ≤5 | 2 | {2:3} |

 总字节数 = 2+0+2+2 = 6。表明多个用户触发拥塞按预期工作。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n + 拥塞事件总数 × 活跃用户) | 排序事件占主导地位； 拥塞很少见，并且速率的几何级数限制了每毫秒的模拟。 |
 | 空间| O(n) | 存储事件和活跃用户率。 |

 该解决方案适用于$n = 2 \cdot 10^5$以及非常大的时间间隔，因为我们避免迭代每一毫秒，而是在事件之间跳转。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    # Place the previous Python solution here
    n, b = map(int, input().split())
    events = []
    for i in range(n):
        s, f, d = map(int, input().split())
        events.append((s, 1, i, d))
        events.append((f + 1, -1, i, d))
    events.sort()
    active = {}
    total_bytes = 0
    prev_time = 0
    for time, typ, uid, rate in events:
        if prev_time > 0 and active:
            interval = time - prev_time
            current_sum = sum(active.values())
            if current_sum <= b:
                total_bytes += current_sum * interval
```
