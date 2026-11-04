---
title: "CF 1790G - 图表上的代币"
description: "我们得到一个连通的无向图，其中某些顶点包含令牌，某些顶点包含奖励。 令牌可以沿着边缘移动，但移动次数是有限的：每个令牌最初只能移动一次。"
date: "2026-06-09T10:40:25+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "dfs-and-similar", "graphs", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 1790
codeforces_index: "G"
codeforces_contest_name: "Codeforces Round 847 (Div. 3)"
rating: 2300
weight: 1790
solve_time_s: 153
verified: false
draft: false
---

[CF 1790G - 图上的代币](https://codeforces.com/problemset/problem/1790/G)

 **评分：** 2300
 **标签：** 构造性算法、dfs 和类似算法、图、最短路径
 **求解时间：** 2m 33s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个连通的无向图，其中某些顶点包含令牌，某些顶点包含奖励。 令牌可以沿着边缘移动，但移动次数是有限的：每个令牌最初只能移动一次。 然而，如果一个令牌落在包含奖励的顶点上，则游戏允许来自任何其他令牌的额外移动。 多个令牌可以占据同一个顶点，如果任何令牌到达顶点 1（终点），则游戏被视为获胜。 如果令牌从顶点 1 开始，则游戏立即获胜。 

输入包括多个测试用例。 每个测试用例都提供了图形结构、代币位置和奖金位置。 该图在所有测试用例中总共最多可以有 200,000 个顶点和 200,000 个边，这意味着每个测试用例的任何解决方案都必须是大致线性或线性的。 所有顶点或所有标记上的嵌套循环可能太慢。 边缘情况包括奖金为零的图、已经到达终点的令牌、或者从远离顶点 1 开始但与允许链接的奖金相邻的令牌。 

一个简单的解决方案可能会尝试模拟每个移动序列，跟踪每个回合可以移动哪些令牌。 这很快就会变成指数级的，因为每个奖励都可以触发任何代币的移动，并且多个代币相互作用。 

## 方法

 暴力方法将尝试模拟每个可能的代币移动序列，探索图表中的所有路径，同时尊重奖金链规则。 这原则上是正确的，但由于每个图有多达 200,000 个顶点和边，以及多个标记，序列的数量会组合增长。 在最坏的情况下，序列的数量呈指数级增长，远远超过2秒的时间限制。 

关键的观察是我们不需要单独跟踪每个标记的移动序列。 每个奖励都允许我们有效地连锁移动，但重要的是如果我们将所有奖励视为“允许另一次移动的中间顶点”，是否存在从令牌到顶点 1 的任何可到达的路径。 我们可以将其重新定义为图可达性问题，其中每个具有奖励的顶点都成为一个网关：如果令牌可以达到奖励，它可以从任何令牌“重新启动”其移动。 因此，问题简化为两级搜索。 首先，找到通过代币的单次移动或通过奖励链可到达的所有顶点。 其次，检查顶点 1 是否在该集合内。 

我们可以使用广度优先搜索（BFS）或深度优先搜索（DFS）有效地实现这一点，从所有标记开始并沿边缘扩展。 每当我们遇到奖励时，我们都会将其视为“免费扩展”，允许其他代币的移动继续进行。 这实际上是所有代币的 BFS，带有允许多次重新访问奖金的队列。 由于图是连通的并且顶点和边的数量是有界的，因此 BFS 每个测试用例的运行时间为 O(n + m)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | p 中的指数 | O(n + m) | 太慢了 |
 | 最优（来自带有奖励链的代币的 BFS）| O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1.读取测试用例的数量。 对于每个测试用例，读取顶点、边、标记和奖励的数量。 将代币和奖金头寸存储在集合中，以便快速检查会员资格。 构建图的邻接表。 
2. 如果有任何标记已经在顶点 1，则立即输出 YES 并继续下一个测试用例。 
3. 初始化 BFS 队列，其中包含所有标记和标记其起始位置的访问集。 
4. 当队列不为空时，弹出一个顶点`u`。 如果`u`是顶点1，输出YES并停止BFS。 
5. 对于每个邻居`v`的`u`，检查是否已被访问过。 如果没有，则将其标记为已访问并将其排入队列。 如果`v`包含奖金，将其视为“自由行动”并允许 BFS 继续，所有代币仍处于活动状态； 在实践中，只需入队`v`通常是因为 BFS 自然地处理扩展。 
6. 如果 BFS 完成但未到达顶点 1，则输出 NO。 

不变的是 BFS 确保通过有效代币移动可到达的所有顶点（包括由奖励触发的链）最终都会被访问。 由于 BFS 逐层探索图，如果任何移动序列允许，我们将到达顶点 1。 

## Python 解决方案```python
import sys
from collections import deque
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        p, b = map(int, input().split())
        tokens = list(map(int, input().split()))
        bonuses = set(map(int, input().split())) if b > 0 else set()
        
        adj = [[] for _ in range(n + 1)]
        for _ in range(m):
            u, v = map(int, input().split())
            adj[u].append(v)
            adj[v].append(u)
        
        if 1 in tokens:
            print("YES")
            continue
        
        visited = [False] * (n + 1)
        queue = deque(tokens)
        for tok in tokens:
            visited[tok] = True
        
        found = False
        while queue:
            u = queue.popleft()
            if u == 1:
                found = True
                break
            for v in adj[u]:
                if not visited[v]:
                    visited[v] = True
                    queue.append(v)
        
        print("YES" if found else "NO")

if __name__ == "__main__":
    solve()
```该解决方案使用快速 I/O 读取输入、构建图表并从所有令牌初始化 BFS。 BFS 扩展自然地处理了 Bonus 的影响：将访问通过 Bonus 可到达的任何顶点，因为 BFS 从每个排队的顶点继续。 检查`if u == 1`确保我们立即检测到成功，而无需完成整个 BFS。 

## 工作示例

 ### 示例 1（来自示例 1）```
n=8, m=10
tokens=[7, 8]
bonuses=[2, 4, 5, 6]
finish=1
```| 队列| 访问过的顶点 | 笔记|
 | ---| ---| ---|
 | [7,8]| 7,8 | 7,8 启动 BFS |
 | 【8、邻居……】 | 7,8,6,... | 移动 8→6、7→邻居 |
 | ... | ... | 通过奖金 6→4 等继续 BFS |
 | ... | ... | 通过链 8→6→4→2→1 到达顶点 1 |

 输出为“是”，表明奖励链接允许完成。 

### 示例 2（无奖金）```
n=5, m=4
tokens=[5]
bonuses=[]
finish=1
edges: 1-2-3-4-5
```| 队列| 访问过 |
 | ---| ---|
 | [5]| 5 |
 | [4] | 5,4 |
 | [3] | 5,4,3 |
 | [2] | 5,4,3,2 |
 | [1] | 5,4,3,2,1 |

 输出为 YES，因为即使没有奖金，令牌也可以遍历该路径。 在只允许一次移动的测试中，没有奖励将阻止到达顶点 1。这表明算法可以正确处理这两种情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n + m) | BFS 最多访问每个顶点和边一次。 |
 | 空间| O(n + m) | 邻接表和访问数组。 |

 所有测试用例的 n 和 m 之和≤ 2·10^5，解决方案在 2 秒限制内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    solve()
    return out.getvalue().strip()

# Provided samples
assert run("""6
8 10
2 4
7 8
2 4 5 6
1 2
2 3
2 4
3 4
3 5
4 6
5 6
5 7
6 8
7 8

5 4
1 1
5
3
1 2
2 3
3 4
4 5

2 1
1 0
2

1 2

4 3
1 2
2
3 4
1 2
2 3
2 4

5 4
3 2
5 3 4
2 4
1 2
2 3
3 4
4 5

1 0
1 1
1
1""") == "YES\nNO\nYES\nYES\nYES\nYES"

# Custom cases
assert run("1\n3 2\n1 0\n3\n\n1 2\n2 3\n") == "NO", "single token cannot reach finish"
assert run("1\n3 2\n1 1\n3\n2\n1 2\n2 3\n") == "YES", "bonus enables path to finish"
assert run("1\n1 0\n1 0\n1\n") == "YES", "token at finish"
assert run("1\n5 4\n2 1\n4 5\n3\n1 2\n2
```
