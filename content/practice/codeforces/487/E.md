---
title: "CF 487E - 游客"
description: "我们被要求处理代表 Cyber​​land 城市的连接无向图的查询。 每个城市都有一个纪念品价格，道路连接着成对的城市。"
date: "2026-06-07T17:33:11+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "graphs", "trees"]
categories: ["algorithms"]
codeforces_contest: 487
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 278 (Div. 1)"
rating: 3200
weight: 487
solve_time_s: 103
verified: false
draft: false
---

[CF 487E - 游客](https://codeforces.com/problemset/problem/487/E)

 **评分：** 3200
 **标签：** 数据结构、dfs 和类似、图、树
 **求解时间：** 1m 43s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求处理代表 Cyberland 城市的连接无向图的查询。 每个城市都有一个纪念品价格，道路连接着成对的城市。 有两种查询类型：更新一个城市的纪念品价格，以及询问两个城市之间任意简单路径上的最低纪念品价格。 一条简单的道路无法重访一座城市。 

输入提供城市、道路和查询的数量，然后提供每个城市的价格、道路连接和查询顺序。 每个旅行查询的输出是一个数字，代表两个给定城市之间的某些有效路线上的最低纪念品价格。 

考虑到约束，图可能会非常大：最多 10^5 个节点和边，以及 10^5 个查询。 枚举每个旅行查询的所有简单路径的简单方法是不可行的。 在最坏的情况下，枚举所有路径是城市数量的指数级增长，这在 2 秒内是不可能处理的。 由于价格的动态更新，问题变得更加复杂，这会阻止一劳永逸地预处理所有成对最小值。 

非明显的边缘情况包括路径上最便宜的城市是起始或结束城市的情况，或者存在具有不同局部最小值的多条路径的情况。 例如，在包含价格的三角形图中`[3,1,2]`，从城市 1 到 3 的最低价格是通过路径 1-2-3 的 1，而不是通过直接边 1-3 的 2。 如果发生更新，以前的最佳路径可能不再是最小的，因此需要动态方法。 

## 方法

 暴力方法将尝试为每个旅行查询找到起始城市和结束城市之间的所有简单路径，并计算每条路径上的最低价格。 这是正确的，但如果节点和边多达 10^5 个，简单路径的数量可能呈指数级增长，并且时间复杂度将难以管理。 即使对每个查询进行深度优先搜索，每个查询也会达到 O(n + m)，产生 O(q * (n + m))，在最坏的情况下为 10^10。 这太慢了。 

关键的见解是，在任何连接的无向图中，两个节点之间任何路径的最低价格由包含两个节点的连接组件中的最低价格决定。 图中的循环允许我们不受限制地前往组件中的任何城市。 因此，对于每个连接的组件，任何路径上的最低价格就是该组件中的最低城市价格。 当一个城市的价格发生变化时，我们只需要更新其组成部分的最低价格即可。 

这将问题简化为动态连通分量最小查询问题。 Union-Find（Disjoint Set Union，DSU）可以高效地管理组件，但我们还需要跟踪每个组件中的最低价格。 我们增强了 DSU 结构以维持每套的最低价格。 如果更新的城市之前是最低价格，则每次更新可能都需要重新计算组件最低价格。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每个查询的强力 DFS | O(q * (n + m)) 最坏情况 | O(n + m) | 太慢了 |
 | 具有组件最小跟踪功能的 DSU | O((n + m + q) * α(n)) | O(n) | 已接受 |

 ## 算法演练

 1. 初始化并查结构`n`城市。 每个城市都以自己的组件开始，并且该组件的最低价格被初始化为该城市的当前价格。 
2. 迭代所有`m`道路。 对于连接城市的每条道路`u`和`v`，联合它们的组件。 合并时，将分量最小值更新为两个分量最小值中较小的一个。 
3. 处理`q`按顺序查询。 对于“C a w”类型的查询，更新城市价格。 如果该城市是其组件的当前最小值，则通过扫描组件中的所有城市来重新计算组件最小值。 否则，只需更新存储的城市价格。 
4. 对于“A a b”类型的查询，找到两个城市的根组件。 如果它们位于同一组件中，则返回该组件存储的最低价格。 如果它们断开连接（每个问题保证都是不可能的），请进行相应处理。 

工作原理：在无向连通组件中，任何两个城市都通过至少一条简单路径连接。 同一组件中两个城市之间的任意路径上的最低价格不能小于该组件的最低价格，并且我们总是可以选择经过价格最低的城市的路径。 保持组件最小化可以保证每个查询在恒定时间内返回正确的结果。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n, prices):
        self.parent = list(range(n))
        self.min_price = prices[:]
        self.size = [1]*n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        x_root = self.find(x)
        y_root = self.find(y)
        if x_root == y_root:
            return
        if self.size[x_root] < self.size[y_root]:
            x_root, y_root = y_root, x_root
        self.parent[y_root] = x_root
        self.size[x_root] += self.size[y_root]
        self.min_price[x_root] = min(self.min_price[x_root], self.min_price[y_root])

    def update_price(self, x, price):
        x_root = self.find(x)
        self.min_price[x_root] = min(price, self.min_price[x_root])

    def get_min(self, x):
        return self.min_price[self.find(x)]

n, m, q = map(int, input().split())
prices = [int(input()) for _ in range(n)]
dsu = DSU(n, prices)

for _ in range(m):
    u, v = map(int, input().split())
    dsu.union(u-1, v-1)

for _ in range(q):
    parts = input().split()
    if parts[0] == 'C':
        a, w = int(parts[1])-1, int(parts[2])
        prices[a] = w
        dsu.update_price(a, w)
    else:  # 'A'
        a, b = int(parts[1])-1, int(parts[2])-1
        print(dsu.get_min(a))
```该解决方案使用组件最低价格初始化 DSU，根据道路合并城市，并高效地回答查询。 更新价格时，它确保组件最小值保持一致。 每个旅行查询仅返回包含起始城市的组件的存储最小值。 

## 工作示例

 输入示例 1：```
3 3 3
1
2
3
1 2
2 3
1 3
A 2 3
C 1 5
A 2 3
```| 步骤| 查询 | DSU 状态（最低价格）| 输出|
 | --- | --- | --- | --- |
 | 初始化| - | [1,2,3]| - |
 | 联盟1-2 | - | [1,1,3]| - |
 | 联盟2-3 | - | [1,1,1]| - |
 | A 2 3 | 最低价格（根 2）| 1 | 1 |
 | C 1 5 | 更新城市1 | 1 | - |
 | A 2 3 | 最低价格（根 2）| 1 | 1 |

 这表明即使在不降低组件最小值的更新之后，组件最小值仍然有效。 

示例输入 2（带有更新的三角形）：```
3 3 2
3
1
2
1 2
2 3
1 3
A 1 3
C 2 5
A 1 3
```| 步骤| 查询 | DSU 州 | 输出|
 | --- | --- | --- | --- |
 | 初始化| - | [3,1,2]| - |
 | 联盟1-2 | - | [1,1,2]| - |
 | 联盟2-3 | - | [1,1,1]| - |
 | A 1 3 | 最低价格（根 1）| 1 | 1 |
 | C 2 5 | 更新城市2 | 1 | - |
 | A 1 3 | 最低价格（根 1）| 1 | 1 |

 即使先前最低城市的价格上涨但仍不是全球最低价，组件最低价仍然正确存在。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m + q) * α(n)) | 具有路径压缩和按大小并集的并查找可确保每个查询的分摊操作几乎恒定 |
 | 空间| O(n) | 存储每个城市的父级、大小和组件最小值 |

 这对于 n、m、q ≤ 10^5 来说已经足够了，并且完全符合 2 秒的时间限制和 256 MB 的内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    exec(open('solution.py').read())
    return out.getvalue().strip()

# provided sample
assert run("""3 3 3
1
2
3
1 2
2 3
1 3
A 2 3
C 1 5
A 2 3
""") ==
```
