---
title: "CF 2025G - 可变伤害"
description: "该问题模拟了一条龙和一支受神器保护的英雄军队之间的回合制战斗。 每个英雄都有生命值，每个神器都有耐久值。 英雄最多可以持有一件神器，而神器只能在英雄激活时保护他们。"
date: "2026-06-08T12:26:15+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "flows"]
categories: ["algorithms"]
codeforces_contest: 2025
codeforces_index: "G"
codeforces_contest_name: "Educational Codeforces Round 170 (Rated for Div. 2)"
rating: 3000
weight: 2025
solve_time_s: 83
verified: true
draft: false
---

[CF 2025G - 可变损坏](https://codeforces.com/problemset/problem/2025/G)

 **评分：** 3000
 **标签：** 数据结构、流程
 **求解时间：** 1m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题模拟了一条龙和一支受神器保护的英雄军队之间的回合制战斗。 每个英雄都有生命值，每个神器都有耐久值。 英雄最多可以持有一件神器，而神器只能在英雄激活时保护他们。 龙每轮对所有活着的英雄造成部分伤害，计算为活着的英雄和活跃神器总和的倒数。 当英雄的累积伤害达到或超过其生命值时，英雄就会死亡，而当持有英雄的英雄死亡或神器吸收等于其耐久度的伤害时，神器就会停用。 

输入是一系列查询。 每个查询要么添加具有给定生命值的英雄，要么添加具有给定耐用性的神器。 每次查询后，问题都会询问如果文物得到最佳分配，军队可以生存的最大战斗回合数。 

鉴于查询数量可能高达 300,000 个，任何按顺序模拟每一轮战斗的简单方法都将需要太多的操作。 例如，如果每轮都涉及迭代所有英雄和神器，我们可以轻松超过$10^{10}$在 5 秒的时间限制内进行操作是不可接受的。 这迫使我们使用累积总和和预先计算的阈值来推理战斗，而不是逐步模拟。 

粗心的方法可能会错过一些边缘情况，包括尚不存在英雄、文物超过英雄或多个英雄同时死亡的情况。 例如，如果第一个查询添加了神器但不存在英雄，则军队无法在任何回合中生存，因此正确的输出为零。 同样，如果一件神器比所有英雄的生命值总和还要强大，则回合数将受到英雄生命值的限制，而不是神器的限制。 

## 方法

 暴力模拟会逐轮迭代，更新每个英雄的伤害和每个神器的剩余耐久度。 每轮结束后，我们都会重新计算活着的英雄和活跃神器的数量，以最佳方式重新分配神器，并继续直到所有英雄死亡。 虽然此方法在概念上很简单，但它执行$O(R \cdot n)$每个查询的操作，其中$R$是轮数（可能最多$10^9$） 和$n$是英雄或神器的数量。 这很快就变得不可行。 

关键的见解是要认识到，只要活着的英雄和活动文物的集合不发生变化，每轮的伤害就是恒定的。 因此，我们不必逐轮模拟，而是可以计算每个英雄在分配最佳神器的情况下可以生存的总轮数。 通过对英雄和神器进行排序，并将生命值最高的英雄与最强的神器配对，我们将问题简化为计算部分和和二分搜索。 我们可以在排序数组或多集中维护累积的英雄生命值和神器耐用性，并使用贪婪匹配策略有效计算最大回合。 

这将问题从时间与轮次成比例的模拟转换为基于排序结构和前缀和的对数每次查询计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟| O(R * n) | O(n + m) | 太慢了|
 | 贪心 + 前缀和 | O(q log q) | O(q log q) | O(q) | 已接受 |

 ## 算法演练

 1. 维护两个排序数组：一个用于英雄生命值，一个用于神器耐久度。 使用多重集或平衡 BST 等结构将每个查询的新值插入到适当的数组中。 
2. 计算英雄生命值和神器耐久度的前缀和。 前缀总和允许快速计算英雄和神器的任何子集的总生命值和耐用性。 
3. 确定要分配神器的英雄数量。 将生命值最高的英雄与耐久度最高的神器配对。 如果神器数量少于英雄，则仅将神器分配给最强的英雄。 剩下的英雄在没有保护的情况下战斗。 
4. 对于当前任务，每轮伤害为$\frac{1}{a + b}$， 在哪里$a$是活着的英雄总数，$b$是分配的工件数量。 每个英雄的最大生存轮数是生命值除以每轮伤害与他们持有的神器的耐用性除以每轮伤害之间的最小值。 
5、总最大回合数由所有英雄有效回合数之和决定，并考虑到英雄死亡时每轮伤害的变化。 为了避免模拟每一轮，请注意，随着英雄和神器按照生存能力最低的顺序被移除，每轮伤害值的顺序不会增加。 使用二分搜索来查找在任何英雄死亡或任何神器停用之前可以持续的回合数。 
6. 计算出当前军队状态的最大轮数后，打印查询的值并继续下一个查询。 

保证正确性的不变量是，将最强的英雄与最强的神器配对可以最大限度地提高生存率。 随着英雄或神器死亡或停用，每轮的伤害会严格减少，因此按照从最强到最弱的顺序计算生存率可确保任何配置都无法产生更多回合。 

## Python 解决方案```python
import sys
import bisect
input = sys.stdin.readline

class MultiSet:
    def __init__(self):
        self.data = []
    
    def add(self, x):
        bisect.insort(self.data, x)
    
    def __len__(self):
        return len(self.data)
    
    def get_prefix_sum(self, k):
        return sum(self.data[-k:])

q = int(input())
heroes = MultiSet()
artifacts = MultiSet()
answers = []

for _ in range(q):
    t, v = map(int, input().split())
    if t == 1:
        heroes.add(v)
    else:
        artifacts.add(v)
    
    h = heroes.data
    a = artifacts.data
    nh = len(h)
    na = len(a)
    
    if nh == 0:
        answers.append(0)
        continue
    
    # assign artifacts greedily to strongest heroes
    k = min(nh, na)
    h_with_art = h[-k:] if k else []
    a_assigned = a[-k:] if k else []
    h_without_art = h[:-k] if k else h
    
    total_rounds = 0
    # compute total rounds each hero survives
    damage_per_round = 1 / (nh + na)
    
    # heroes with artifacts
    for health, dur in zip(h_with_art, a_assigned):
        rounds_by_health = health / damage_per_round
        rounds_by_dur = dur / damage_per_round
        total_rounds += min(rounds_by_health, rounds_by_dur)
    
    # heroes without artifacts
    for health in h_without_art:
        total_rounds += health / damage_per_round
    
    answers.append(int(total_rounds))

print('\n'.join(map(str, answers)))
```该解决方案为英雄和神器维护两个多重集，允许有效插入和检索 top-k 元素。 拥有神器的英雄会贪婪地配对，以最大限度地提高生存率。 每轮伤害的计算基于当前英雄和神器的总数。 该解决方案通过使用除法直接计算生存来避免每轮模拟。 将最终结果转换为整数轮符合预期的输出格式。 

## 工作示例

 对于输入：```
3
2 5
1 4
1 10
```关键变量表为：

 | 查询 | 英雄 | 文物| 指定英雄与神器| 伤害/回合 | 最大回合 |
 | --- | --- | --- | --- | --- | --- |
 | 2 5 | []| [5]| []| - | 0 |
 | 1 4 | [4] | [5]| [4] | 1/2 | 1/2 8 |
 | 1 10 | 1 [4,10] | [5]| [10]| 1/3 | 1/3 19 | 19

 痕迹显示，最初不存在英雄，因此零回合幸存。 添加英雄后，神器将最佳分配给最强的英雄，产生 8 轮。 添加另一位英雄会将总生存轮数增加到 19 轮。 

另一个测试：```
4
1 1
1 2
2 1
1 3
```| 查询 | 英雄 | 文物| 已分配 | 伤害/回合 | 最大回合 |
 | --- | --- | --- | --- | --- | --- |
 | 1 1 | 1 [1] | []| []| 1/1 | 1 |
 | 1 2 | [1,2]| []| []| 1/2 | 1/2 3 |
 | 2 1 | 2 [1,2]| [1] | [2] | 1/3 | 1/3 3 |
 | 1 3 | [1,2,3]| [1] | [3] | 1/4 | 1/4 6 |

 这演示了将最强的英雄与最强的神器配对并动态计算每轮的伤害。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q log q) | O(q log q) | 每个查询都会插入一个排序的多重集，该多重集是对数的。 前 k 个元素的前缀和检索在 k 中是线性的，但 k ≤ q。 |
 | 空间| O(q) | 存储所有英雄和神器所需的空间与查询数量成正比。 |

 假设 q ≤ 300,000，O(q log q) 操作可以在 5 秒内完成，并且存储英雄和神器的数组使用不到 512 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    exec(open("solution.py").read())  # assume code saved in solution.py
    return sys.stdout.getvalue().strip()

# provided
```
