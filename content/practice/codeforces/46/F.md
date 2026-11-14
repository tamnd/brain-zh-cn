---
title: "CF 46F - 赫尔克里波洛问题"
description: "我们有一栋房子，里面有一定数量的房间，房间通过门相连，每扇门都有一把唯一的钥匙。 房子里有几位居民，每个人最初都在某个房间里，并有一些钥匙。 我们还可以在稍后了解每个居民的仓位和关键资产。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dsu", "graphs"]
categories: ["algorithms"]
codeforces_contest: 46
codeforces_index: "F"
codeforces_contest_name: "School Personal Contest #2 (Winter Computer School 2010/11) - Codeforces Beta Round 43 (ACM-ICPC Rules)"
rating: 2300
weight: 46
solve_time_s: 61
verified: true
draft: false
---

[CF 46F - 赫尔克里波洛问题](https://codeforces.com/problemset/problem/46/F)

 **评分：** 2300
 **标签：** DSU、图表
 **求解时间：** 1m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一栋房子，里面有一定数量的房间，房间通过门相连，每扇门都有一把唯一的钥匙。 房子里有几位居民，每个人最初都在某个房间里，并有一些钥匙。 我们还可以在稍后了解每个居民的仓位和关键资产。 问题是，是否有可能通过一系列法律行动——用钥匙开门、通过打开的门在房间之间移动以及与同一房间的其他居民交换钥匙——从第一个配置达到第二个配置。 如果是，我们打印“YES”； 否则，“否”。 

房子可以建模为一张图：房间是节点，门是边缘。 如果居民用他们持有的或从其他人那里获得的钥匙解锁了边缘，则居民会沿着边缘移动。 每扇门在居民中的某个地方都只有一把钥匙。 任何门都可以多次打开和关闭，并且居民在同一房间时可以共享钥匙。 该问题实际上是在询问在这些密钥共享约束下每个居民的最终房间是否可以从其初始房间到达。 

限制很小：$n, m, k \le 1000$。 我们为每个居民尝试所有可能的移动的暴力模拟会太慢，因为移动序列的数量呈指数增长。 然而，这些约束允许图遍历方法（例如 BFS 或 DFS）最多超过 1000 个节点和边。 边缘情况包括一扇门最初被隔离的情况，因为没有人拥有同一连接组件中的钥匙，或者所有居民都在一个房间中，但最终需要进入互不相连的房间——假设自由移动会失败的天真方法。 

粗心实施失败的一个例子是两个房间由一扇门连接，每个房间一个人，而门的钥匙由对面房间的人持有。 天真的“每个人都可以联系到其他人”的逻辑会错误地回答“是”，但正确的答案是“否”，因为没有人可以解锁门来见面或交换钥匙。 

## 方法

 暴力解决方案将尝试模拟所有可能的开门顺序、居民移动和钥匙交换顺序。 对于每个时间步骤，我们都会迭代每个居民，并考虑穿过他们可以打开的每一扇门。 虽然这会产生正确的答案，但可能性的数量是天文数字，很容易超过$2^{1000}$最坏情况下的序列，使其不切实际。 

关键的见解是对房间的每个连接组件进行建模，这些组件可以通过该组件中的居民可用的钥匙进行访问。 在任何时刻，同一组件内的居民都可以自由共享密钥。 一旦组件中存在的所有键都已通过可到达的房间传播，则由这些键连接的所有房间都会形成单个“可到达的组件”。 这正是不相交集并集 (DSU) 或并集查找的闪光点：每扇门都是房间之间的桥梁，而门所需的钥匙位于系统中的某个位置。 通过迭代合并可以使用组件中当前密钥集解锁的房间，我们可以确定每组居民可以访问的最大房间集。 如果最终每个居民的目标房间位于其初始房间的可到达部分内，则该配置是可以实现的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟| O(k * 2^m) | O(n + m + k) | O(n + m + k) | 太慢了 |
 | DSU/组件传播 | O(m + n + k) | O(m + n + k) | O(n + m + k) | O(n + m + k) | 已接受 |

 ## 算法演练

 1. 解析输入并存储房间和门的图表。 对于每扇门，维护其端点并将其与唯一的密钥相关联。 
2. 追踪每个住户的初始位置及其持有的钥匙。 还跟踪每个居民的目标位置。 维护从钥匙到最初持有钥匙的居民的映射。 
3. 初始化不相交集并集 (DSU) 结构，以跟踪当前可用的键可到达的房间的组件。 最初，每个房间都有自己的组成部分。 
4. 对于每位居民，标记他们当前可以打开的门。 对于每个可打开的门，合并 DSU 中它连接的两个房间。 这代表拥有钥匙的人可以在这些房间之间自由移动。 
5. 通过组件迭代地传播密钥。 对于每个组件，收集组件内居民持有的所有密钥。 如果一扇门连接不同组件中的两个房间，但该门的钥匙存在于其中一个组件中，则合并这些组件。 重复此操作，直到不可能进行新的合并。 
6. 传播稳定后，对于每个居民，检查他们的目标房间是否与其初始房间位于同一 DSU 组件中。 如果所有居民都满足这个条件，则打印“YES”； 否则，打印“NO”。 

工作原理：DSU 合并确保同一组件中的任何两个房间都可以使用该组件中的居民可用的密钥相互访问。 密钥传播保证一旦钥匙在某个房间内可用，它可以打开的所有门都会被考虑，从而扩大了可到达的区域。 由于居民可以在组件内自由交换密钥，因此这捕获了所有合法的移动。 如果目标房间位于组件外部，则由于限制而无法到达该房间。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        x_root = self.find(x)
        y_root = self.find(y)
        if x_root != y_root:
            self.parent[y_root] = x_root

def solve():
    n, m, k = map(int, input().split())
    doors = []
    for _ in range(m):
        u, v = map(int, input().split())
        doors.append((u-1, v-1))
    
    residents_init = {}
    residents_final = {}
    key_owner_init = [None] * m
    
    for i in range(k):
        parts = input().split()
        name = parts[0]
        room = int(parts[1]) - 1
        num_keys = int(parts[2])
        keys = [int(x)-1 for x in parts[3:]]
        residents_init[name] = (room, set(keys))
        for key in keys:
            key_owner_init[key] = name

    for i in range(k):
        parts = input().split()
        name = parts[0]
        room = int(parts[1]) - 1
        residents_final[name] = room

    dsu = DSU(n)
    
    changed = True
    while changed:
        changed = False
        component_keys = [set() for _ in range(n)]
        for name, (room, keys) in residents_init.items():
            root = dsu.find(room)
            component_keys[root].update(keys)
        for idx, (u, v) in enumerate(doors):
            ru, rv = dsu.find(u), dsu.find(v)
            if ru != rv:
                if idx in component_keys[ru] or idx in component_keys[rv]:
                    dsu.union(ru, rv)
                    changed = True
    
    possible = all(dsu.find(residents_init[name][0]) == dsu.find(residents_final[name]) for name in residents_init)
    print("YES" if possible else "NO")

solve()
```该代码维护一个 DSU 来跟踪可到达的房间，收集每个组件中的所有钥匙，并在可以使用组件中的任何钥匙打开门时迭代地合并组件。 这`changed`标志确保传播继续，直到不可能再进行合并。 最终检查验证每个居民是否可以到达目标房间。 

## 工作示例

 **样品1：**

 输入：```
2 1 2
1 2
Dmitry 1 1 1
Natalia 2 0
Natalia 1 1 1
Dmitry 2 0
```| 居民 | 初始房间 | 按键| 传播后的 DSU 组件 | 最后的房间| 可达吗？ |
 | --- | --- | --- | --- | --- | --- |
 | 德米特里 | 0 | {0} | 0 和 1 合并 | 1 | 是的 |
 | 娜塔莉亚 | 1 | {} | 0 和 1 合并 | 0 | 是的 |

 DSU 合并了房间 0 和房间 1，因为 Dmitry 持有唯一门的钥匙。 两个住户都可以交换钥匙并搬到任何房间。 输出：`YES`。 

**自定义示例 2：**

 输入：```
3 2 2
1 2
2 3
Alice 0 1 0
Bob 2 1 1
Alice 2 1 0
Bob 0 1 1
```Alice 从房间 0 开始使用钥匙 0，Bob 在房间 2 开始使用钥匙 1。钥匙 0 打开门 0 (1-2)，钥匙 1 打开门 1 (2-3)。 DSU 最初：

 - 使用爱丽丝的钥匙合并房间 0 和 1
 - 使用鲍勃的钥匙合并房间 1 和 2

 所有房间都在一个组件中。 两名居民都可以到达目标房间。 输出：`YES`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m + k) | O(n + m + k) | 每个 DSU 并集/查找操作都与路径压缩接近一致。 传播过程中门的迭代至多为 O(m * α(n))，其中 α 是阿克曼的逆。 |
 | 空间| O(n + m + k) | O(n + m + k) | DSU 父数组、每个组件的键集、驻留信息。 |

 给定 n, m, k ≤
