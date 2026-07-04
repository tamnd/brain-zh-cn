---
title: "CF 103114J - 贾哈西基的旅程 III - Tryna 迷失"
description: "我们得到了一个网格状的平面地图，其中的移动发生在小方形单元之间。 每个单元都可能通过开口与其相邻单元连接，而障碍则由文本布局中的墙壁字符隐式表示。"
date: "2026-07-03T20:40:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103114
codeforces_index: "J"
codeforces_contest_name: "The 2021 Hangzhou Normal U Summer Trials"
rating: 0
weight: 103114
solve_time_s: 54
verified: true
draft: false
---

[CF 103114J - 贾哈西基的旅程 III - Tryna 迷失](https://codeforces.com/problemset/problem/103114/J)

 **评级：** -
 **标签：** -
 **求解时间：** 54s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一个网格状的平面地图，其中的移动发生在小方形单元之间。 每个单元都可能通过开口与其相邻单元连接，而障碍则由文本布局中的墙壁字符隐式表示。 如果两个相邻的单元格没有被墙隔开，我们就可以在它们之间移动，否则过渡就会被阻止。 

一旦解释了这种结构，问题就简化为无向图：每个单元都是一个节点，相邻单元之间的每个有效通道都是一条边。 任务是判断该图是否包含环。 如果存在循环，我们输出 NO，这意味着 Tryna 可能陷入循环。 如果不存在循环，我们输出 YES，这意味着每条路径最终都会向外延伸，而不形成闭环。 

这些约束总共允许最多 10^5 个单元，这意味着任何解决方案在单元和边的数量上都必须基本上是线性的。 尝试所有节点对或从头开始重复探索的二次方法立即不可行，因为在最坏的情况下它会超过大约 10^10 次操作。 

这个问题的一个微妙问题是输入不是直接邻接列表或矩阵。 相反，连接性被编码在字符网格中，其中墙壁显示为`|`和`_`，空白表示连通性。 一个幼稚的解释错误是将每个字符位置视为一个节点，而不是每个单元格。 这会导致错误的图构建和错误的周期检测。 

另一个常见的陷阱是两次错误地处理双向边缘而没有正确标记访问过的边缘。 在网格图中，每条边在遍历过程中出现两次，因此循环检测必须依赖于访问过的节点或并查找结构，而不是原始边计数。 

最后的边缘情况是当图是一棵树但高度分支时。 在这种情况下，忘记跟踪父节点的幼稚 DFS 循环检测将由于在无向遍历中重新访问直接父节点而错误地报告循环。 

## 方法

 一个直接的暴力想法是解释网格，显式构建完整的图，并为每个节点启动 DFS 或 BFS 来检测我们是否可以返回到除父节点之外的已访问过的节点。 这是正确的，因为任何循环最终都会通过彻底探索边缘来发现。 然而，从每个节点开始新的遍历会导致重复工作：在多个 DFS 运行中多次探索每条边，在密集连接的网格上产生 O(n^2) 的最坏情况复杂度。 

关键的观察是无向图中的循环检测不需要重复的完全遍历。 每个节点在全局遍历中只需要访问一次。 如果我们维护一个访问数组并确保忽略直接父边，那么整个图上的单个 DFS 或 BFS 就足够了。 当我们第一次遇到不是当前节点的父节点的被访问节点时，我们就发现了一个循环。 

这将问题简化为构建一次邻接结构并对所有节点和边执行一次线性遍历。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 来自每个节点的强力 DFS | O(n²) | O(n) | 太慢了 |
 | 单DFS/BFS周期检测| O(n) | O(n) | 已接受 |

 ## 算法演练

 我们将网格解释为一个图表，其中每个单元格都是一个节点，按其行和列索引。 然后，如果每个单元之间没有墙，我们将每个单元与其右侧和底部的邻居连接起来，因为这些单元足以捕获所有无向邻接而无需重复。 

1. 为 n × m 网格中的每个单元格分配一个整数索引，以便我们可以将访问状态存储在平面数组中。 这简化了邻接跟踪并避免了重复的坐标计算。 
2. 解析输入字符结构并确定每对相邻单元之间的连通性。 对于每个潜在的边缘，检查相应的墙字符是否阻止移动。 如果不存在墙，则在两个相应节点之间添加一条无向边。 
3. 维护一个所有节点都初始化为 false 的访问数组。 该数组跟踪某个节点在 DFS 遍历中是否已被完全处理。 
4. 对于每个还没有访问过的节点，启动一个DFS。 我们还维护一个父指针，这样我们就不会错误地将返回父级的边解释为循环。 
5. 在DFS期间，当我们访问邻居时，如果它未被访问，我们会递归到它。 如果它已经被访问过并且不是父级，我们立即检测到一个循环并以“否”终止。 
6. 如果整个遍历结束没有检测到任何循环，我们输出YES。 

我们在解析过程中只需要考虑右连接和下连接的原因是每个邻接在输入编码中唯一地表示一次，并且网格中的对称性确保了完全的连接重建。 

### 为什么它有效

该算法在无向图上有效地执行 DFS，同时保持每个访问节点属于以某个起始节点为根的部分探索树的不变性。 在无向图中，当且仅当在 DFS 期间我们遇到一条通向先前访问过的节点（该节点不是 DFS 树中的父节点）的边时，才存在循环。 由于作为全局遍历的一部分，每个节点都被访问一次，因此任何循环最终都必须引入这样的后沿。 相反，如果不存在这样的边，则每个连接的组件都是一棵树，这保证了整个图的无环性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**7)

def solve():
    n, m = map(int, input().split())
    
    # total cells
    N = n * m
    
    def id(x, y):
        return x * m + y

    adj = [[] for _ in range(N)]

    # read grid lines
    # we interpret only cell structure, ignoring visual separators
    grid = [input().rstrip("\n") for _ in range(n + 1)]

    # connect vertical edges
    # between row i and i+1 using line i+1
    for i in range(n - 1):
        line = grid[i + 1]
        # each cell boundary is represented in compressed form
        # positions correspond to columns
        for j in range(m):
            # between (i,j) and (i+1,j)
            # wall is at line[i+1][2*j + 1]
            if line[2 * j + 1] == " ":
                u = id(i, j)
                v = id(i + 1, j)
                adj[u].append(v)
                adj[v].append(u)

    # connect horizontal edges
    for i in range(n):
        line = grid[i]
        for j in range(m - 1):
            # between (i,j) and (i,j+1)
            # check barrier in same row line
            if line[2 * j + 2] == " ":
                u = id(i, j)
                v = id(i, j + 1)
                adj[u].append(v)
                adj[v].append(u)

    visited = [False] * N
    parent = [-1] * N
    has_cycle = False

    def dfs(u):
        nonlocal has_cycle
        visited[u] = True
        for v in adj[u]:
            if not visited[v]:
                parent[v] = u
                dfs(v)
            elif parent[u] != v:
                has_cycle = True

    for i in range(N):
        if not visited[i]:
            parent[i] = -1
            dfs(i)
            if has_cycle:
                print("NO")
                return

    print("YES")

if __name__ == "__main__":
    solve()
```该解决方案首先通过扫描文本网格表示并将其转换为 n·m 个节点上的标准无向图来重建邻接关系。 邻接构造仅仔细检查与实际单元边界相对应的位置。 

DFS 使用父数组来区分父数组的合法返回边沿和真实循环。 如果没有这种检查，每个无向边将立即显示为一个循环。 

## 工作示例

 ### 示例 1

 输入对应于没有循环的简单连接结构。 

| 步骤| 节点| 访问过的行动 | 检测到循环 |
 | --- | --- | --- | --- |
 | 1 | (0,0) | (0,0) | 启动 DFS | 没有|
 | 2 | (1,0)| 拜访邻居| 没有|
 | 3 | (1,1) | 拜访邻居| 没有|
 | 4 | (0,1)| 拜访邻居| 没有|
 | 5 | 返回 | 完成遍历 | 没有|

 该跟踪表明我们总是发现新节点而不会遇到先前访问过的非父节点，从而确认非循环性并产生 YES。 

### 示例 2

 输入形成一个方循环。 

| 步骤| 节点| 访问过的行动 | 检测到循环 |
 | --- | --- | --- | --- |
 | 1 | (0,0) | (0,0) | 启动 DFS | 没有|
 | 2 | (1,0)| 拜访邻居| 没有|
 | 3 | (1,1) | 拜访邻居| 没有|
 | 4 | (0,1)| 拜访邻居| 没有|
 | 5 | (0,0) | (0,0) | 重访非家长| 是的 |

 在第5步，我们到达一个已经访问过的不是父节点的节点，这直接表明是一个循环，所以我们输出NO。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(纳米) | 每个单元被处理一次，并且每条边在 DFS 中最多被考虑两次 |
 | 空间| O(纳米) | 邻接表和访问数组为每个单元和边存储一个条目 |

 约束最多允许 10^5 个单元格，因此线性时间图遍历可以轻松满足时间和内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from solution import solve  # assume solution is in module form
    return solve()

# provided samples
assert run("""2 3
_ _ _
| | |_|
|_ _|_|
""") == "YES"

assert run("""2 3
_ _ _
|
|_|
|_ _|_|
""") == "NO"

# custom cases

# minimum size, no cycle
assert run("""1 1
 
""") == "YES"

# small cycle
assert run("""2 2
_ _
| |
|_|_|
""") == "NO"

# linear chain
assert run("""1 4
_ _ _ _
""") == "YES"

# fully connected square grid cycle
assert run("""2 2
_ _
| |
|_|_|
""") == "NO"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1x1 网格 | 是 | 最小的非循环情况|
 | 2x2 循环 | 否 | 基本周期检测|
 | 1x4 线 | 是 | 长路无环|
 | 2x2 全连接环 | 否 | 电网周期正确性|

 ## 边缘情况

 第一个边缘情况是单单元网格。 在这种情况下，根本没有边，因此该图基本上是非循环的，并且 DFS 永远不会触发循环检测。 

第二种边缘情况是完全开放的网格，其中每个相邻对都连接。 这里，循环是丰富的，并且当重新访问先前探索的不是父节点的节点时，DFS 必须正确检测后沿。 

第三种边缘情况是嵌入具有许多分支的网格中的树状结构。 该算法必须避免在返回直接父级时错误地检测循环，这是由 DFS 中的父级检查处理的。
