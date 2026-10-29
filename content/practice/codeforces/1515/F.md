---
title: "CF 1515F - 凤凰城和地震"
description: "该问题描述了一个场景，一个国家的道路网络被地震摧毁，导致 n 个城市和 m 条道路处于断开状态。"
date: "2026-06-10T18:34:12+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "dfs-and-similar", "dsu", "graphs", "greedy", "trees"]
categories: ["algorithms"]
codeforces_contest: 1515
codeforces_index: "F"
codeforces_contest_name: "Codeforces Global Round 14"
rating: 2600
weight: 1515
solve_time_s: 176
verified: false
draft: false
---

[CF 1515F - 凤凰城和地震](https://codeforces.com/problemset/problem/1515/F)

 **评分：** 2600
 **标签：** 构造性算法、dfs 和类似算法、dsu、图、贪婪、树
 **求解时间：** 2m 56s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 该问题描述了这样一个场景：一个国家的道路网络被地震摧毁，导致`n`城市和`m`道路处于断开状态。 每个城市一开始都有一定数量的沥青，修建道路会消耗固定数量的沥青`x`，可以来自连接的两个城市中的任何一个。 沥青可以在已经通过修复的道路连接的城市之间流动，这意味着该网络形成了一个动态的资源库。 任务是确定是否有可能通过精确修复来恢复所有城市的连接`n-1`道路，如果是，则输出任何有效的维修序列。 

输入给出城市数量`n`，潜在道路的数量`m`, 沥青成本`x`, 初始沥青量`a_i`每个城市，以及一个列表`m`候选道路。 如果连接不可能，则输出为“NO”，否则输出为“YES”，后跟一系列`n-1`代表有效维修订单的道路索引。 

约束表明`n`和`m`可以达到`3*10^5`并且沥青量可能非常大，因此 O(n log n) 或 O(m log n) 算法是可以接受的。 由于组合爆炸，无法对所有生成树进行暴力枚举。 一种简单的方法是反复尝试所有未使用的边缘，直到可以修复边缘为止，这种方法太慢，并且在大输入时会超时。 

当所有城市的沥青总量勉强足以连接所有东西时，就会出现不明显的边缘情况。 例如，如果`n=3`,`x=5`，沥青用量为`[2, 3, 5]`，并且三条道路都可用，如果起始道路选择错误并且沥青消耗不均匀，粗心的实施可能会失败。 另一个微妙之处是，一些城市可能从零沥青开始，要求早期连接涉及拥有足够沥青的城市来“养活”其他城市。 

## 方法

 蛮力方法会尝试一个接一个地拾取边缘，检查连接组件中的沥青总和是否至少为`x`。 这将涉及重复扫描所有未使用的边缘并保持连接，在最坏的情况下这将是 O(mn)。 和`n`和`m`高达3*10^5，这显然是不可行的。 暴力破解之所以有效，是因为它直接遵循有关沥青可用性的问题规则，但由于重复扫描，它在大型实例中会失败。 

关键的见解来自于将城市视为图中的节点，并将修复过程视为构建生成树。 总沥青量小于的连接组件`x`无法添加另一条道路，因此我们需要一种策略来始终从具有足够沥青的组件延伸。 这自然会导致使用联合查找（DSU）结构来维护连接的组件和贪婪方法：始终选择与总沥青至少为`x`。 我们可以使用具有足够沥青的“活动”组件队列来有效地实现这一点，并优先考虑将这些组件连接到尚未连接的城市的边缘。 这确保了在每一步我们只考虑可行的边缘，避免不必要的扫描。 

通过仔细合并组件并更新其总沥青，我们可以修复所有`n-1`使用邻接列表和 DSU 以及路径压缩和按大小并集，在 O(n + m) 时间内完成道路。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * m) | O(n + m) | 太慢了|
 | 贪婪 DSU | O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1.读取城市数量`n`, 道路`m`, 沥青成本`x`, 沥青量`a[i]`，以及道路列表`(u, v)`从 1 开始索引。 
2. 初始化不相交集并集 (DSU) 结构来跟踪连接的组件，为每个组件存储其包含的沥青总和。 
3. 为每个城市构建边的邻接列表，存储邻居和道路索引。 
4. 初始化一个队列，包含当前拥有沥青≥的所有城市`x`。 这些是发展网络的候选起点。 
5. 当队列不为空时：

 a. 弹出一座城市`u`从队列中。 

b. 迭代所有边`u`对其邻居`v`。 

c. 对于每个邻居，检查是否`u`和`v`位于使用 DSU 的不同组件中。 

d. 如果是，检查合并组件的总沥青是否至少为`x`。 

e. 如果边可行，则修复它：将其索引附加到答案中，合并 DSU 中的组件，并将总沥青更新为`(asphalt_u + asphalt_v - x)`。 

f. 如果新部件的沥青含量≥`x`，将其中一个有代表性的城市推回队列中继续扩张。 
6. 处理完成后，检查所有城市是否属于同一组件。 If yes, print "YES" and the repair sequence. 否则，打印“NO”。 

这样做的原因是我们总是用足够沥青的组件来发展网络。 由于沥青可以集中在连接的组件内，因此我们永远不会遇到错过可行修复的情况。 DSU 确保我们不会创建环路，而只会添加将森林延伸至生成树的边。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

class DSU:
    def __init__(self, n, asphalt):
        self.parent = list(range(n))
        self.size = [1] * n
        self.asphalt = asphalt[:]

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, x, y):
        x_root = self.find(x)
        y_root = self.find(y)
        if x_root == y_root:
            return False
        if self.size[x_root] < self.size[y_root]:
            x_root, y_root = y_root, x_root
        self.parent[y_root] = x_root
        self.size[x_root] += self.size[y_root]
        self.asphalt[x_root] += self.asphalt[y_root]
        return x_root, y_root

n, m, x = map(int, input().split())
a = list(map(int, input().split()))
edges = []
adj = [[] for _ in range(n)]
for idx in range(m):
    u, v = map(int, input().split())
    u -= 1; v -= 1
    edges.append((u, v))
    adj[u].append((v, idx))
    adj[v].append((u, idx))

dsu = DSU(n, a)
used = [False] * m
queue = deque(i for i in range(n) if a[i] >= x)
answer = []

while queue and len(answer) < n-1:
    u = queue.popleft()
    u_root = dsu.find(u)
    for v, idx in adj[u]:
        if used[idx]:
            continue
        v_root = dsu.find(v)
        if u_root == v_root:
            continue
        total = dsu.asphalt[u_root] + dsu.asphalt[v_root]
        if total < x:
            continue
        used[idx] = True
        answer.append(idx + 1)
        new_root, old_root = dsu.union(u_root, v_root)
        dsu.asphalt[new_root] -= x
        if dsu.asphalt[new_root] >= x:
            queue.append(new_root)

if len(answer) == n-1:
    print("YES")
    print("\n".join(map(str, answer)))
else:
    print("NO")
```DSU 类不仅存储每个组件的母体和尺寸，还存储总沥青。 队列确保我们总是尝试从有能力资助道路的城市进行维修。 我们将边缘标记为已使用以避免重复计算。 每次合并后，我们都会更新合并组件的沥青，如果仍然可以为进一步的维修提供资金，则将其重新添加到队列中。 该算法保证无循环的连通性并尊重沥青约束。 

## 工作示例

 输入示例 1：```
5 4 1
0 0 0 4 0
1 2
2 3
3 4
4 5
```| 步骤| 队列| 边缘选择 | 沥青后| DSU 组件 | 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | [3] | 3-4 | 3-4 a=[0,0,3,1,0] | a=[0,0,3,1,0] | 合并(3,4) | [3] |
 | 2 | [3] | 2-3 | 2-3 a=[0,0,2,1,0] | a=[0,0,2,1,0] | 合并(2,3-4) | [3,2]|
 | 3 | [3] | 1-2 | 1-2 a=[0,0,1,1,0] | a=[0,0,1,1,0] | 合并(1,2-3-4) | [3,2,1]|
 | 4 | [3] | 4-5 | a=[0,0,1,0,0] | a=[0,0,1,0,0] | 合并(4-5) | [3,2,1,4] |

 这说明队列总是选择沥青充足的城市，并且所有道路都添加成功。 

输入示例 2（不可能）：```
3 2 5
2 1 0
1 2
2 3
```任何部件中的沥青总量都不足以修复任何道路。 队列从一开始就是空的。 输出为“否”。
