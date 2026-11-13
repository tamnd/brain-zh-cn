---
title: "CF 246D - 彩色图表"
description: "我们得到一个无向图，其中每个顶点都有一个颜色，由一个整数表示。 目标是确定哪种颜色具有最多样化的邻近颜色集。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "dfs-and-similar", "graphs"]
categories: ["algorithms"]
codeforces_contest: 246
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 151 (Div. 2)"
rating: 1600
weight: 246
solve_time_s: 90
verified: true
draft: false
---

[CF 246D - 彩色图表](https://codeforces.com/problemset/problem/246/D)

 **评分：** 1600
 **标签：** 暴力破解、dfs 和类似的、图表
 **求解时间：** 1m 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个无向图，其中每个顶点都有一个颜色，由一个整数表示。 目标是确定哪种颜色具有最多样化的邻近颜色集。 正式地，对于每种颜色$k$，我们查看该颜色的所有顶点并收集与该颜色不同的所​​有相邻顶点的颜色$k$。 相邻颜色组尺寸最大的颜色就是答案。 如果多种颜色并列，我们选择最小的颜色编号。 

该图最多可以有$10^5$顶点和边，因此复杂度高于$O(n + m)$或者$O((n + m)\log n)$可能会超时。 我们还需要管理高达$10^5$，因此如果简单地创建直接按颜色索引的数组可能会占用大量内存。 

一些不明显的边缘情况至关重要。 首先，所有顶点具有相同颜色的图。 例如，如果 3 个顶点的颜色均为 1，边的颜色为 1-2、2-3、1-3，则没有明显的相邻颜色，因此输出仍必须为 1，即唯一的颜色。 其次，如果多种颜色具有相同的最大多样性，我们必须选择最小的颜色，而不是我们遇到的第一个。 最后，断开连接的顶点或具有孤立颜色的组件不会贡献邻居，但如果存在颜色，仍然需要考虑。 

## 方法

 蛮力法是考虑每种颜色$k$独立。 对于每个颜色顶点$k$，扫描其邻接列表并将所有不同的邻居颜色添加到一个集合中。 一旦我们处理完所有的顶点$k$，我们知道的基数$Q(k)$。 对所有颜色重复此操作可以保证正确性，但速度太慢，因为迭代每种颜色的所有顶点可能会导致$O(n \cdot m)$密集图中的运算。 

优化的关键在于我们不需要处理每种颜色的每个顶点。 每条边仅连接两个顶点，并且它对最多两种颜色的多样性计数有贡献：如果端点的颜色不同，则为端点的颜色。 因此，我们可以迭代所有边一次，并且对于连接顶点的每条边$u$和$v$用不同的颜色，我们添加$c[v]$到相邻颜色的集合$c[u]$和$c[u]$到相邻颜色的集合$c[v]$。 这将问题从重复扫描所有邻接列表减少到一次遍历边缘。 剩下的就是簿记来维护这些集合并找到集合大小最大的颜色。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n·m) | 每种颜色 O(n) | 太慢了 |
 | 最佳 | O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 读取图形的顶点、颜色和边。 维护从顶点索引到颜色的映射。 
2. 初始化一个空字典来存储每种颜色的相邻颜色集。 
3. 对于每条边$u, v$，检查颜色是否$u$和$v$不同。 如果是这样，请插入颜色$v$进入邻居集合$c[u]$，以及颜色$u$进入邻居集合$c[v]$。 这可确保每种颜色的集合仅计算不同的相邻颜色。 
4. 处理完所有边后，迭代图中存在的所有颜色。 跟踪具有相邻集最大大小的颜色。 如果多种颜色具有相同的最大尺寸，请选择最小的一种。 
5. 输出选择的颜色。 

工作原理：连接两种不同颜色的每条边对每种颜色的邻居多样性计数仅贡献一次。 不变的是，每种颜色的相邻颜色集恰好是与该颜色的任何顶点相邻的顶点的所有颜色的并集。 通过使用集合，我们可以自动避免重复。 因此，最大基数被正确计算。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict

n, m = map(int, input().split())
colors = list(map(int, input().split()))
edges = [tuple(map(int, input().split())) for _ in range(m)]

# Map color to its set of neighboring colors
neighbor_colors = defaultdict(set)

for u, v in edges:
    u -= 1
    v -= 1
    cu, cv = colors[u], colors[v]
    if cu != cv:
        neighbor_colors[cu].add(cv)
        neighbor_colors[cv].add(cu)

# Ensure every color present in graph has an entry (even isolated)
unique_colors = set(colors)
for color in unique_colors:
    neighbor_colors[color]  # touch entry to ensure existence

# Find color with maximum neighbor diversity, tie-breaking by smallest color
max_diversity = -1
best_color = None
for color in neighbor_colors:
    diversity = len(neighbor_colors[color])
    if diversity > max_diversity or (diversity == max_diversity and color < best_color):
        max_diversity = diversity
        best_color = color

print(best_color)
```该代码首先构建邻居集，然后确保所有存在的颜色都有相应的条目来处理孤立的颜色。 最后，它在尊重打破平局规则的同时寻求最大的多样性。 注意减少基于 1 的输入的索引。 

## 工作示例

 **样品1：**

 输入：```
6 6
1 1 2 3 5 8
1 2
3 2
1 4
4 3
4 5
4 6
```| 顶点| 颜色 | 相邻颜色（处理所有边缘后）|
 | --- | --- | --- |
 | 1 | 1 | {2, 3} |
 | 2 | 1 | {2, 3} |
 | 3 | 2 | {1, 3} |
 | 4 | 3 | {1,2,5,8}|
 | 5 | 5 | {3} |
 | 6 | 8 | {3} |

 每种颜色的设定尺寸：

 | 颜色 | 邻居多元化|
 | --- | --- |
 | 1 | 2 |
 | 2 | 2 |
 | 3 | 4 |
 | 5 | 1 |
 | 8 | 1 |

 对于打印的颜色 3，最大多样性为 4。 

**自定义示例 2：所有顶点颜色相同**

 输入：```
3 2
1 1 1
1 2
2 3
```每个顶点的颜色为 1，所有边都连接相同颜色的顶点。 邻居集是空的。 最大多样性为 0，唯一存在的颜色为 1。输出：```
1
```这证实了孤立的或非多样化的颜色被正确处理。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | 一次通过读取输入，一次通过边缘来填充邻居集，一次通过颜色以选择最大值。 |
 | 空间| O(n + m) | 每种颜色的邻居集和边缘的存储。 |

 考虑到约束条件，$n, m \le 10^5$，这在 2 秒限制内有效运行。 

## 测试用例```python
import sys, io
from collections import defaultdict

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, m = map(int, input().split())
    colors = list(map(int, input().split()))
    edges = [tuple(map(int, input().split())) for _ in range(m)]
    neighbor_colors = defaultdict(set)
    for u, v in edges:
        u -= 1
        v -= 1
        cu, cv = colors[u], colors[v]
        if cu != cv:
            neighbor_colors[cu].add(cv)
            neighbor_colors[cv].add(cu)
    for color in set(colors):
        neighbor_colors[color]
    max_div = -1
    best = None
    for color in neighbor_colors:
        div = len(neighbor_colors[color])
        if div > max_div or (div == max_div and color < best):
            max_div = div
            best = color
    return str(best)

# provided sample
assert run("6 6\n1 1 2 3 5 8\n1 2\n3 2\n1 4\n4 3\n4 5\n4 6\n") == "3", "sample 1"

# custom cases
assert run("3 2\n1 1 1\n1 2\n2 3\n") == "1", "all same color"
assert run("4 2\n1 2 3 4\n1 2\n3 4\n") == "1", "tie between 1 and 3, pick smaller"
assert run("5 0\n10 20 30 40 50\n") == "10", "no edges, smallest color"
assert run("5 4\n1 2 3 2 1\n1 2\n2 3\n3 4\n4 5\n") == "2", "diversity across middle color"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 3 2，全部 1 | 1 | 处理所有相同颜色的顶点 |
 | 4 2、颜色1-4 | 1 | 决胜局选择最小的|
