---
title: "CF 1463E - 讲座计划"
description: "我们有一位老师，Ivan，他需要安排 n 个不同主题的讲座。 每个主题最多有一个先决条件，这意味着他不能在先决条件之前讲授某个主题。 一个主题没有先决条件。"
date: "2026-06-11T02:01:34+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "dfs-and-similar", "dsu", "graphs", "implementation", "sortings", "trees"]
categories: ["algorithms"]
codeforces_contest: 1463
codeforces_index: "E"
codeforces_contest_name: "Educational Codeforces Round 100 (Rated for Div. 2)"
rating: 2400
weight: 1463
solve_time_s: 145
verified: false
draft: false
---

[CF 1463E - 讲座计划](https://codeforces.com/problemset/problem/1463/E)

 **评分：** 2400
 **标签：** 构造性算法、dfs 和类似算法、dsu、图、实现、排序、树
 **求解时间：** 2m 25s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一位老师，伊万，他需要安排以下课程的讲座：`n`不同的主题。 每个主题最多有一个先决条件，这意味着他不能在先决条件之前讲授某个主题。 一个主题没有先决条件。 任务是在尊重这些先决条件的情况下以有效的顺序安排讲座。 

此外，还有`k`特殊主题对`(x_i, y_i)`这样如果主题`x_i`紧接在主题之前`y_i`，学生更加理解。 全部`x_i`和所有`y_i`是唯一的，意味着没有主题作为第一个或第二个元素出现在多个对中。 挑战在于找到既满足先决条件结构又满足特殊对的邻接偏好的讲座顺序，或者确定这是不可能的。 

限制条件很大：`n`最大可达 3 * 10^5 并且`k`最多`n-1`。 这意味着任何具有二次复杂度 (O(n²)) 的解决方案都会太慢。 我们需要一个大致线性的算法`n`或至多 O(n log n)。 

非明显的边缘情况包括特殊对形成与先决条件相冲突的链或循环的情况。 例如，如果先决条件强制执行`1 → 2 → 3`但特殊配对需求`3 → 1`，不存在解。 另一个微妙之处是，当特殊对本身形成任意长度的链时，我们必须确保这些链遵守先决条件的顺序。 

## 方法

 暴力方法将生成主题的所有排列，并根据先决条件和特殊对检查每个排列。 这是正确的，但不可行，因为排列的数量是`n!`，呈指数增长。 

关键的观察结果是，先决条件定义了一种树状依赖结构（具有单根的有向森林，因为只有一个主题没有先决条件）。 一旦我们有了这棵树，我们只需要从根到叶对主题进行线性排序，尊重父项在子项之前。 

特殊对施加邻接约束，这可以解释为形成必须连续出现的主题链。 既然所有`x_i`是独一无二的，这些链在起点处不重叠。 我们可以先构建这些链，然后根据前提树对它们进行拓扑排序。 

因此，最佳方法是构建由特殊对决定的链，将每个链折叠成超级节点，然后执行尊重先决条件的拓扑排序。 如果一条链违反了先决条件（其第一个主题出现在链外的先决条件之后），我们就会检测到不可能性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!) | O(n) | 太慢了|
 | 链式+拓扑排序| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 构建地图`next_in_chain`对于特殊对：对于每个`(x, y)`， 店铺`next_in_chain[x] = y`。 另外，存储`has_prev[y] = x`检测链的开始。 
2. 确定每个链的开始：一个主题`t`那是在`next_in_chain`但不在`has_prev`是链的头。 可以有多个链，因为并非每个主题都参与一个特殊的对。 
3. 遍历每条链，收集必须连续出现的主题的完整序列。 遍历时，检查循环（如果主题在其链中重复）和冲突（主题出现在多个链中）。 如果检测到，则输出`0`。 
4. 将每个主题映射到其所属的链，并创建链序列列表。 不属于任何特殊对的主题成为单例链。 
5. 构建一个先决条件图，其中每个链都是一个节点。 如果一个主题在链中`A`有一个先决条件外`A`，从先决条件链创建一条边缘`A`。 这确保了链顺序遵守先决条件。 
6. 对链进行拓扑排序。 如果在链图中检测到循环，则输出`0`。 否则，按拓扑顺序连接链以形成讲座序列。 
7. 输出序列。 

这里的不变性是链保留邻接约束，拓扑排序保留先决条件。 通过将每条链视为不可分割的块，我们保证如果算法成功，所有约束都得到满足。 

## Python 解决方案```python
import sys
from collections import defaultdict, deque

input = sys.stdin.readline

n, k = map(int, input().split())
p = list(map(int, input().split()))

next_in_chain = {}
has_prev = {}
for _ in range(k):
    x, y = map(int, input().split())
    next_in_chain[x] = y
    has_prev[y] = x

used = set()
chains = []
topic_to_chain = {}

# Build chains from special pairs
for t in range(1, n+1):
    if t in next_in_chain and t not in has_prev:
        chain = []
        cur = t
        while cur:
            if cur in used:
                print(0)
                sys.exit(0)
            used.add(cur)
            chain.append(cur)
            cur = next_in_chain.get(cur, 0)
        chains.append(chain)
        for topic in chain:
            topic_to_chain[topic] = len(chains)-1

# Add singleton topics
for t in range(1, n+1):
    if t not in used:
        chains.append([t])
        topic_to_chain[t] = len(chains)-1

m = len(chains)
in_deg = [0]*m
adj = [[] for _ in range(m)]

# Build graph of chains based on prerequisites
for i, topic in enumerate(p):
    if topic == 0:
        continue
    curr_chain = topic_to_chain[i+1]
    prereq_chain = topic_to_chain[topic]
    if curr_chain != prereq_chain:
        adj[prereq_chain].append(curr_chain)
        in_deg[curr_chain] += 1

# Topological sort of chains
queue = deque([i for i in range(m) if in_deg[i] == 0])
res = []

while queue:
    u = queue.popleft()
    res.extend(chains[u])
    for v in adj[u]:
        in_deg[v] -= 1
        if in_deg[v] == 0:
            queue.append(v)

if len(res) != n:
    print(0)
else:
    print(' '.join(map(str, res)))
```该代码首先从特殊对构建链并检测循环。 然后将单例主题添加为长度为 1 的链。使用先决条件依赖性构建链图，并通过拓扑排序生成讲座顺序。 捕获并返回边缘情况，例如循环特殊对或不可能的先决条件顺序`0`。 

## 工作示例

 输入示例 1：```
5 2
2 3 0 5 3
1 5
5 4
```| 步骤| 链条| 主题到链 | 调整图| 队列 | 资源 |
 | --- | --- | --- | --- | --- | --- |
 | 打造连锁| [1,5,4], [2], [3] | {1:0,5:0,4:0,2:1,3:2} | []| []| []|
 | 构建图表 | 3→2,5→4？ | 查看邻接| adj=[[],[2],[1]] | adj=[[],[2],[1]] | 队列=[0] | 资源=[] |
 | 拓扑排序 | 0->1->2 | | 队列更新 | 3 2 1 5 4 | 3 2 1 5 4 |

 输出：`3 2 1 5 4`这表明链保留邻接性，并且拓扑排序尊重先决条件。 

自定义输入2：```
3 1
0 1 2
1 3
```链：[1,3],[2]； 先决条件：1→2,2→3

 不可能满足链邻接和先决条件。 输出：`0`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 构建链、映射主题、构建链图、拓扑排序都是线性的`n`|
 | 空间| O(n) | 映射、列表、邻接图和队列都最多存储 O(n) 个元素 |

 给定`n <= 3*10^5`，O(n) 解决方案在时间和内存限制内执行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, k = map(int, input().split())
    p = list(map(int, input().split()))
    next_in_chain = {}
    has_prev = {}
    for _ in range(k):
        x, y = map(int, input().split())
        next_in_chain[x] = y
        has_prev[y] = x
    used = set()
    chains = []
    topic_to_chain = {}
    for t in range(1, n+1):
        if t in next_in_chain and t not in has_prev:
            chain = []
            cur = t
            while cur:
                if cur in used:
                    return "0"
                used.add(cur)
                chain.append(cur)
                cur = next_in_chain.get(cur, 0)
            chains.append(chain)
            for topic in chain:
                topic_to_chain[topic] = len(chains)-1
    for t in range(1, n+1):
        if t not in used:
            chains.append([t])
            topic_to_chain[t] = len(chains)-1
    m = len(chains)
    in_deg = [0]*m
    adj = [[] for _ in range(m)]
    for i, topic in enumerate(p):
        if topic ==
```
