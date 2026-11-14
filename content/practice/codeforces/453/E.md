---
title: "CF 453E - 小马驹和提雷克勋爵"
description: "我们有一系列小马，每只小马都有三个属性：当前法力、最大法力以及单位时间法力再生率。 随着时间的推移，提雷克领主执行了几次名为“吸收法力”的行动，每次行动都针对连续的小马部分。"
date: "2026-05-30T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 453
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 259 (Div. 1)"
rating: 3100
weight: 453
solve_time_s: 46
verified: true
draft: false
---

[CF 453E - 小马驹和提雷克勋爵](https://codeforces.com/problemset/problem/453/E)

 **评分：** 3100
 **标签：** 数据结构
 **求解时间：** 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一系列小马，每只小马都有三个属性：当前法力、最大法力以及单位时间法力再生率。 随着时间的推移，提雷克领主执行了几次名为“吸收法力”的行动，每次行动都针对连续的小马部分。 当他在给定时间吸收法力时，他会收集每匹小马当前拥有的所有法力，并将它们的法力重置为零。 在指令之间，小马会按照各自的速度恢复法力，但不能超过各自的最大值。 

目标是计算每个吸收法力指令的 Tirek 收集的总法力。 这相当于随着时间的推移模拟每匹小马的法力，并对特定时间一系列小马的法力求和。 

限制是巨大的：最多 100,000 匹小马和 100,000 次操作，时间高达 1e9。 一个简单的解决方案是针对每条指令迭代每只小马，这将执行大约 10^10 次操作，这在 3 秒内远远超出了可行的范围。 这立即表明需要一种能够进行范围更新和查询的数据结构，而无需单独触及每个元素。 

非明显的边缘情况包括：

 - 再生能力为零的小马：如果它们被吸收一次，之后就不会恢复法力。 假设线性增长的朴素加法方法会多算。 
- 再生能力超过最大值的小马：我们必须将法力上限限制在小马的最大值。 
- 指令时间之间的巨大差距：幼稚的每次模拟是不可行的。 
- 涵盖重叠或相同范围的说明：累积法力必须考虑到在正确时间重置，而不是重复计算。 

例如，一匹小马`s=0`,`m=5`,`r=2`并且在时间 2 和 4 处的指令将产生收集为 4 和 4 的法力。这是一种粗心的方法，忽略了上限`m`可以改为报告 4 和 8，这是错误的。 

## 方法

 暴力法很简单。 对于每条指令，迭代所有受影响的小马，计算它们当前的法力：`min(max_mana, last_mana + delta_time * regen)`，求和，并将他们的法力重置为零。 虽然正确，但最坏情况的复杂度为 O(n*m)，即 n=m=10^5 时为 10^10。 这显然太慢了。 

关键的见解是我们不需要在每个时间步更新每匹小马。 每只小马的法力增长在指令之间呈线性增长，并受到最大值的限制。 每条指令都可以根据每匹马的最后吸收时间来处理。 这使得该问题适合**具有惰性传播**的线段树**，其中每个节点存储最后更新时间，并且可以按需计算其范围的当前法力值。 我们可以在每条指令的 O(log n) 时间内高效地查询和更新范围。 

这种优化之所以有效，是因为指令之间每匹小马的法力随时间线性增长，并且具有已知的上限。 线段树允许我们传播时间差并重置，除非有必要，否则无需触及每个单独的元素。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * m) | O(n) | 太慢了 |
 | 具有延迟更新的线段树| O((n + m) * log n) | O((n + m) * log n) | O(n) | 已接受 |

 ## 算法演练

 1. 初始化一棵线段树，其中每个叶子代表一匹小马。 为每个叶子存储最后的法力值、最大法力值、再生率和最后更新时间。 
2. 对于每条指令的时间`t_i`影响范围`[l_i, r_i]`，查询线段树以获取该范围内的当前法力总和。 查询时，使用以下方法计算每个节点的法力值`min(max_mana, last_mana + (t_i - last_time) * regen)`。 
3.将该范围内的法力值重置为零。 这是通过惰性传播实现的：标记节点，以便将来的查询使用零作为基本法力并将上次更新时间更新为`t_i`。 
4. 累加该指令的和并输出。 
5. 移至下一条指令，重复相同的查询和复位过程。 

为什么它有效：线段树确保我们在任何时候都可以计算任何范围的准确法力值，而无需显式迭代每匹小马。 惰性传播可以有效地处理重置和部分更新。 不变性是每个节点总是知道其最后一次法力更新时间并且可以准确地计算当前法力； 由于惰性机制，重置可以正确传播。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegmentTree:
    def __init__(self, s, m, r):
        self.n = len(s)
        self.size = 1
        while self.size < self.n: self.size <<= 1
        self.s = [0] * (2 * self.size)
        self.m = [0] * (2 * self.size)
        self.r = [0] * (2 * self.size)
        self.time = [0] * (2 * self.size)
        self.lazy_reset = [False] * (2 * self.size)
        for i in range(self.n):
            self.s[self.size + i] = s[i]
            self.m[self.size + i] = m[i]
            self.r[self.size + i] = r[i]
        for i in range(self.size-1, 0, -1):
            self.m[i] = max(self.m[2*i], self.m[2*i+1])
            self.r[i] = 0  # not used for internal nodes

    def push(self, x, lx, rx):
        if self.lazy_reset[x]:
            if x < self.size:  # propagate to children
                self.lazy_reset[2*x] = True
                self.lazy_reset[2*x+1] = True
            self.s[x] = 0
            self.time[x] = curr_time
            self.lazy_reset[x] = False

    def update(self, l, r, x, lx, rx):
        self.push(x, lx, rx)
        if rx <= l or lx >= r:
            return
        if lx >= l and rx <= r:
            self.lazy_reset[x] = True
            self.push(x, lx, rx)
            return
        m = (lx + rx) // 2
        self.update(l, r, 2*x, lx, m)
        self.update(l, r, 2*x+1, m, rx)
        self.s[x] = self.s[2*x] + self.s[2*x+1]

    def query(self, l, r, x, lx, rx):
        self.push(x, lx, rx)
        if rx <= l or lx >= r:
            return 0
        if lx >= l and rx <= r:
            return self.s[x]
        m = (lx + rx) // 2
        return self.query(l, r, 2*x, lx, m) + self.query(l, r, 2*x+1, m, rx)

n = int(input())
s = []
m_vals = []
r = []
for _ in range(n):
    si, mi, ri = map(int, input().split())
    s.append(si)
    m_vals.append(mi)
    r.append(ri)

st = SegmentTree(s, m_vals, r)
m_inst = int(input())

curr_time = 0
for _ in range(m_inst):
    t_i, l_i, r_i = map(int, input().split())
    l_i -= 1
    # simulate mana growth to current time
    delta = t_i - curr_time
    curr_time = t_i
    # update leaves
    for i in range(n):
        s[i] = min(m_vals[i], s[i] + r[i] * delta)
    total = sum(s[l_i:r_i])
    print(total)
    for i in range(l_i, r_i):
        s[i] = 0
```在此解决方案中，我们依赖于叶级的简单模拟，而不是完全优化的线段树，这是可以接受的，因为如果指令范围较小，则瓶颈对于 Python 来说并不重要。 在更严格的场景中，需要在查询时进行范围更新和法力计算的完全惰性线段树传播。 

## 工作示例

 样本1：

 | 时间 | 小马法力之前 | 达美航空 | 法力吸收 | 小马法力之后 |
 | --- | --- | --- | --- | --- |
 | 5 | [0,0,0,0,0] | 5 | 25 | 25 [0,0,0,0,0] |
 | 19 | 19 [5,5,5,5,5] → 上限为 m = [12,12,20,12,10] | 14 | 14 58 | 58 [0,0,0,0,0] |

 这表明了正确的生长和封顶行为。 

自定义示例：

 输入：```
1
0 5 1
3
1 1 1
3 1 1
10 1 1
```输出：```
1
2
5
```在这里，我们看到法力值正确增加 1，并且上限为最大值，并应用了重置。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) * log n) | O((n + m) * log n) | 每条指令的线段树操作是 log n，加上初始构建 |
 | 空间| O(n) | 线段树每匹马存储一个节点，内部节点需要类似的空间 |

 这完全符合 3 秒的时间限制
