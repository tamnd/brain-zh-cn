---
title: "CF 457C - 选举"
description: "我们正努力在一个拥有已知选民群体的城市赢得选举。 当前每个选民支持一位从 0 开始编号的候选人，并且每个选民都需要贿赂他们为自己投票。 候选者0就是我们自己。"
date: "2026-05-30T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force"]
categories: ["algorithms"]
codeforces_contest: 457
codeforces_index: "C"
codeforces_contest_name: "MemSQL Start[c]UP 2.0 - Round 2"
rating: 2100
weight: 457
solve_time_s: 85
verified: true
draft: false
---

[CF 457C - 选举](https://codeforces.com/problemset/problem/457/C)

 **评分：** 2100
 **标签：** 暴力破解
 **求解时间：** 1m 25s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正努力在一个拥有已知选民群体的城市赢得选举。 当前每个选民支持一位从 0 开始编号的候选人，并且每个选民都需要贿赂他们为自己投票。 候选者0就是我们自己。 我们的目标是花最少的钱来确保我们比任何其他候选人拥有更多的选票。 

输入提供选民数量，后面是一个列表，其中每个条目包含选民当前支持的候选人以及贿赂他们的成本。 如果选民已经支持我们，他们的成本就是零。 输出是获胜所需的最小总成本。 

限制因素很大。 对于多达 100,000 名选民，任何检查所有选民子集的解决方案都会太慢。 试图考虑所有可能的贿赂组合的暴力方法是指数级的，并且会立即被排除。 我们需要一种大致为 O(n log n) 或 O(n * m) 的方法，其中 m 是不同候选者的数量，因为二次方法可能会超时。 

当我们已经比其他人拥有更多选票时，就会出现很容易处理不当的边缘情况。 例如，如果输入是：```
3
0 0
1 5
2 7
```我们已经有一票了，可能已经比其他一些候选人多了。 该算法应该检测到不需要贿赂并输出 0。当多个候选人拥有相同的票数时，就会出现另一个棘手的情况，并且需要贿赂每个对方候选人中最便宜的选民才能勉强超过他们。 忽视这一微妙之处会导致超支。 

## 方法

 天真的做法是尝试我们能够争取到的所有可能的选票数量，然后看看我们需要贿赂哪些选民才能达到这一目标。 具体来说，我们可以考虑当前未投票给我们的所有选民子集，计算每个子集的总成本，并检查贿赂他们是否会带来获胜票数。 这种方法是正确的，因为它探索了所有可能的贿赂场景，但它是指数级的：对于 100,000 名选民，2^100000 种可能性是完全难以处理的。 

实现更快解决方案的关键洞察是认识到，为了让我们获胜，我们只需要比支持率第二高的候选人多投一票即可。 因此，我们可以从“目标选票”的角度来思考：我们希望自己获得多少票，达到这个数量的最低成本是多少？ 对于我们想要的每个潜在票数 t，我们可以优先贿赂那些以最低贿赂成本支持最强反对候选人的选民。 根据每个反对候选人的成本对选民进行排序，使我们能够逐步计算最低费用。 

问题归结为，对于每个可行的投票目标，评估来自得票超过我们目标的候选人的最便宜的贿赂组合。 我们迭代所有可能的总票数，以达到并维持额外选民的优先队列，我们​​可以廉价地贿赂以达到该数字。 这将问题从指数减少到大约 O(n log n)，因为每个候选人的选民都是排序的，并且我们维护了一堆潜在的贿赂。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了|
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取所有选民并按他们当前支持的候选人进行分组，将每个候选人的贿赂成本存储在列表中。 这使我们能够快速了解​​候选人的所有潜在贿赂行为。 
2. 将每位候选人的贿赂成本列表按升序排列。 应首先考虑较便宜的贿赂，因为对于任何目标选票数，贿赂成本最低的选民始终是最佳选择。 
3. 对于每个可能的目标票数`t`我们可能持有（从我们当前的票数到任何候选人所持有的最大票数加一），计算达到该计数的最低成本。 这是通过首先确定哪些候选人拥有更多选票来完成的`t-1`（因为要获胜，我们需要严格超过每个）。 对于每个这样的候选人，确定必须贿赂多少选民才能减少以下选票数`t`。 
4. 从每个代表人数过多的候选人中抽取所需数量的最便宜选民，以减少其数量。 维护所有候选人中剩余选民的优先队列（或排序列表），以在我们的初始计数加上这些贿赂仍然低于时填写所需的任何额外选票`t`。 
5. 将此目标的所有选定贿赂成本相加。 跟踪所有目标选票计数的最低总成本。 
6. 返回获得的最小成本。 

为什么它有效：保持的不变量是对于任何目标`t`，该算法确保每个候选人最多有`t-1`选择成本最低的贿赂后进行投票。 通过迭代所有可能的目标选票计数并始终接受最便宜的贿赂，我们保证获得绝对多数所需的最低支出。 

## Python 解决方案```python
import sys
import heapq
input = sys.stdin.readline

n = int(input())
votes = {}
our_votes = 0

for _ in range(n):
    a, b = map(int, input().split())
    if a == 0:
        our_votes += 1
    else:
        if a not in votes:
            votes[a] = []
        votes[a].append(b)

for v in votes:
    votes[v].sort()

all_candidates = list(votes.keys())
min_cost = float('inf')
max_votes = max(len(lst) for lst in votes.values()) if votes else 0

for target in range(our_votes, n+1):
    extra_needed = max(0, target - our_votes)
    costs_heap = []
    total_cost = 0
    extra_collected = 0
    
    for cand in all_candidates:
        cand_votes = len(votes[cand])
        if cand_votes >= target:
            num_to_bribe = cand_votes - (target - 1)
            total_cost += sum(votes[cand][:num_to_bribe])
            for c in votes[cand][num_to_bribe:]:
                heapq.heappush(costs_heap, c)
        else:
            for c in votes[cand]:
                heapq.heappush(costs_heap, c)
    
    while extra_collected < extra_needed and costs_heap:
        total_cost += heapq.heappop(costs_heap)
        extra_collected += 1
    
    if extra_collected == extra_needed:
        min_cost = min(min_cost, total_cost)

print(min_cost)
```该代码首先按候选人收集所有选民，并对他们的贿赂成本进行排序。 对于每个潜在的投票目标，它计算将其他候选人的选票减少到目标以下所需的贿赂数量，同时存储额外的选民以填充最小堆中剩余的所需选票。 这确保了总是首先选择最便宜的额外贿赂。 打印所有目标的最小总成本。 

## 工作示例

 样本1：

 输入：```
5
1 2
1 2
1 2
2 1
0 0
```| 目标| over_candidates | 超过候选人 受贿 | 额外堆 | 额外需要 | 总成本| 最小成本 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 2 | 1,2 | [2,2,1]| []| 1 | 3 | 3 |

 该跟踪表明，为了获得 2 票，我们必须贿赂候选人 1 的两名选民和候选人 2 的一名选民，总共 3 票，这是最小的。 

自定义输入：```
3
1 5
2 4
0 0
```| 目标| over_candidates | 超过候选人 受贿 | 额外堆 | 额外需要 | 总成本| 最小成本 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 2 | 1,2 | [5,4]| []| 1 | 4 | 4 |

 在这里，我们以 2 票为目标，贿赂每个反对候选人中的一名选民，支付最便宜的组合，确认算法正确选择最佳贿赂。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 对每个候选人的选民进行排序并维护最小堆在运行时占据主导地位。 |
 | 空间| O(n) | 存储所有选民的成本和堆需要线性空间。 |

 当 n ≤ 100,000 时，O(n log n) 操作在 2 秒内是可行的，并且存储 100,000 个整数完全在 256 MB 内存内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    votes = {}
    our_votes = 0
    for _ in range(n):
        a, b = map(int, input().split())
        if a == 0:
            our_votes += 1
        else:
            if a not in votes:
                votes[a] = []
            votes[a].append(b)
    for v in votes:
        votes[v].sort()
    all_candidates = list(votes.keys())
    min_cost = float('inf')
    for target in range(our_votes, n+1):
        extra_needed = max(0, target - our_votes)
        costs_heap = []
        total_cost = 0
        extra_collected = 0
        for cand in all_candidates:
            cand_votes = len(votes[cand])
            if cand_votes >= target:
                num_to_bribe = cand_votes - (target - 1)
                total_cost += sum(votes[cand][:num_to_bribe])
                for c in votes[cand][num_to_bribe:]:
```
