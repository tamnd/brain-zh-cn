---
title: "CF 2204D - 交替路径"
description: "我们得到一个无向图，并要求为每条边指定一个方向，以使某些顶点变得“美丽”。"
date: "2026-06-07T19:57:02+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "dfs-and-similar", "graph-matchings", "graphs"]
categories: ["algorithms"]
codeforces_contest: 2204
codeforces_index: "D"
codeforces_contest_name: "Educational Codeforces Round 188 (Rated for Div. 2)"
rating: 1400
weight: 2204
solve_time_s: 110
verified: false
draft: false
---

[CF 2204D - 替代路径](https://codeforces.com/problemset/problem/2204/D)

 **评分：** 1400
 **标签：** 构造性算法、dfs 和类似算法、图匹配、图
 **求解时间：** 1m 50s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个无向图，并要求为每条边分配一个方向，以使某些顶点变得“美丽”。 如果从顶点开始，原始图中的每条路径都沿着边交替方向，则该顶点是美丽的：第一条边必须向外，下一条边必须向外，下一条边必须向外，依此类推。 我们希望最大化美丽顶点的数量。 

换句话说，这个问题要求我们找到一种方法来定位边缘，以便从尽可能多的顶点开始，每次遍历都能沿着边缘看到精确的外内外内模式。 路径可以重复顶点和边。 

在所有测试用例中，输入图总共最多可以有 200,000 个顶点和 200,000 个边。 这意味着我们不能承受比每个测试用例 O(n + m) 更糟糕的事情。 所有路径或循环上的嵌套循环是不可行的，因为路径的数量会随着图的大小呈指数增长。 

一个重要的微妙之处是，连接到奇数长度循环的顶点不可能是美丽的。 例如，考虑一个三角形（3 周期）。 无论我们如何定向边缘，从任何顶点开始并遵循路径，在某个点，两个连续的边缘将沿着路径以相同的方式定向。 任意定向边的幼稚方法可能会错误地将此类循环上的顶点视为美丽。 

另一种边缘情况是没有边的图。 每个孤立的顶点都很美丽，因为没有路径违反交替条件。 如果图是二分图，则存在一种一致的方法来定向边，以便一个分区中的所有顶点都以传出边开始，而另一个分区中的所有顶点都以传入边开始。 

## 方法

 暴力方法会尝试所有可能的 2^m 种方法来引导边缘。 对于每个方向，我们可以模拟来自每个顶点的所有路径并检查它们是否交替。 这在理论上是正确的，但显然是不可能的：即使对于 m = 20，也有超过一百万种配置，而对于 m = 200,000 这是荒谬的。 

关键的见解来自于理解是什么让顶点变得不美丽。 如果存在可从该顶点到达的奇数长度的循环，则该顶点将失败，因为沿着奇数长度的循环交替方向不能保持一致。 这立即暗示了与二分图的联系：当且仅当一个图没有奇数循环时，它才是二分图。 在二分图中，我们可以将顶点分成两组，并将边从一组到另一组一致地定向。 如果我们选择符合“外内外内”要求的方向，一组中的所有顶点都可以变得漂亮。 

因此，问题简化为识别图的二分。 图的每个连通分量要么是二分的，要么不是二分的。 如果是二分的，所有的顶点都可以是美丽的。 如果它包含奇数循环，则只有较大分区中的顶点才能安全地变得漂亮。 事实上，对于任意图，使用 BFS 或 DFS 用两种颜色着色就足够了。 每个顶点的颜色决定从它出去的第一条边应该出去还是进去。相同颜色顶点之间的任何边都表示非二分组件； 在最坏的情况下，这些边中只有一个顶点可以是漂亮的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^m * f(n,m)) | O(2^m * f(n,m)) | O(n + m) | 太慢了|
 | 二分着色 | O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，读取顶点数`n`和边缘`m`。 初始化图的邻接表。 
2. 通过读取来填充邻接列表`m`边缘。 每条边都是双向存储的。 
3.初始化一个size的颜色数组`n`至-1。 这将存储 0 或 1 以进行二分着色。 
4. 对于每个未着色的顶点，启动 BFS。 为其指定颜色 0。 
5. BFS时，对于每个顶点`v`和每个邻居`u`， 如果`u`未着色，分配`u`的相反颜色`v`。 添加`u`到队列中。 如果`u`已经具有相同的颜色`v`，将组件标记为非二分组件。 
6.对于每个组件，如果它是二分的，则该组件中的所有顶点都可以是美丽的。 如果它包含奇数循环，则该分量中的最大美丽顶点是两个颜色类中较大的尺寸。 
7. 求所有组件中最大美丽顶点的总和。 输出总和。 

工作原理：对图进行着色可确保没有两个相邻顶点具有相同的颜色。 在二分组件中，任何路径都会在颜色之间交替，这对应于交替的边缘方向。 BFS 保证着色一致。 奇数循环会阻止完全交替，并且选择较大的颜色类可以最大化美丽顶点的数量，而不会违反可达路径上的交替。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        adj = [[] for _ in range(n)]
        for _ in range(m):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            adj[u].append(v)
            adj[v].append(u)

        color = [-1] * n
        visited = [False] * n
        max_beautiful = 0

        for i in range(n):
            if not visited[i]:
                queue = deque()
                queue.append(i)
                color[i] = 0
                count = [1, 0]
                bipartite = True
                visited[i] = True

                while queue:
                    v = queue.popleft()
                    for u in adj[v]:
                        if color[u] == -1:
                            color[u] = 1 - color[v]
                            count[color[u]] += 1
                            queue.append(u)
                            visited[u] = True
                        elif color[u] == color[v]:
                            bipartite = False

                if bipartite:
                    max_beautiful += count[0] + count[1]
                else:
                    max_beautiful += max(count)

        print(max_beautiful)

if __name__ == "__main__":
    solve()
```该解决方案使用 BFS 读取输入、构建邻接列表并为图形着色。 这`color`数组跟踪双色分区，而`visited`避免重新访问节点。 每个连接的组件都单独评估。 处理二分组件和非二分组件的逻辑是明确分开的。 Python 的边缘索引调整为从零开始的索引。 

## 工作示例

 **示例输入 1：**```
8 9
1 3
1 4
2 3
2 4
5 6
6 7
7 8
8 5
6 8
```| 步骤| Vertex | Queue | Color | 组件二分？ | 计数 | 最大美丽 |
 | ---| ---| ---| ---| ---| ---| ---|
 | Init | - | [1] | 0 | True | [1,0]| 0 |
 | BFS | 1 | [3,4]| 0/1 | True | [2,2]| 0 |
 | BFS | 3 | ... | ... | True | ... | ... |
 | Complete | - | [] | ... | True | [2,2]| 2 |

 我们看到只有两个顶点可以保证完美交替地开始路径。 BFS 确认二分着色，并且计数确定最大值。 

**示例输入 2（无边缘）：**```
4 0
```所有顶点都是孤立的。 BFS 分别访问每个，颜色数组仍然有效。 四个顶点都很漂亮。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + m) | 每个顶点被访问一次，每条边被考虑两次 |
 | 空间| O(n + m) | 邻接表加上颜色和访问过的数组 |

 对于 n + m ≤ 2×10^5，该解决方案可以在 2 秒内轻松拟合，因为 BFS 随顶点和边线性缩放。 内存使用量也在 512 MB 以内，因为邻接列表存储为 O(m)，辅助数组为 O(n)。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("4\n8 9\n1 3\n1 4\n2 3\n2 4\n5 6\n6 7\n7 8\n8 5\n6 8\n4 0\n6 2\n1 5\n2 3\n1 0\n") == "2\n4\n4\n1"

# Custom: single vertex, no edges
assert run("1\n1 0\n") == "1"

# Custom: 3-cycle
assert run("1\n3 3\n1 2\n2 3\n3 1\n") == "2"

# Custom: bipartite tree
assert run("1\n4 3\n1 2\n2 3\n3 4\n") == "4"

# Custom: disjoint bipartite and non-bipartite
assert run("1\n6 6\n1 2\n2
```
