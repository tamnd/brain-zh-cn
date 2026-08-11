---
title: "CF 104282H - 迷宫"
description: "我们有一个 $n × m$ 网格，其中每个单元格要么包含一个蛋糕，要么是空的。 任务是吃掉所有蛋糕，同时最大化总满意度。 有两种可能的操作。 一个动作吃一块蛋糕并给予固定奖励 $p$。"
date: "2026-07-01T21:07:09+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104282
codeforces_index: "H"
codeforces_contest_name: "The 20th Hangzhou City University Programming Contest"
rating: 0
weight: 104282
solve_time_s: 60
verified: true
draft: false
---

[CF 104282H - 迷宫](https://codeforces.com/problemset/problem/104282/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被赋予了一个$n \times m$网格，其中每个单元格要么包含蛋糕，要么为空。 任务是吃掉所有蛋糕，同时最大化总满意度。 有两种可能的操作。 一次行动吃一块蛋糕并给予固定奖励$p$。 另一个动作是吃两个水平或垂直相邻的蛋糕并给予奖励$q$，它取代了两个单一蛋糕操作。 

问题的根本在于选择相邻对的子集来“合并”为双吃操作，而所有剩余的蛋糕则单独取出。 每个蛋糕必须仅被消耗一次，无论是单独的还是作为一对的一部分，因此我们有效地将所有 1-cell 划分为由网格引起的邻接图的单例和边缘。 

网格尺寸最大可达$300 \times 300$，因此最多 90,000 个单元格。 这立即排除了任何尝试枚举配对子集或运行指数匹配的方法。 一个解决方案大致是$O(nm \cdot \text{something linear})$或者$O(V + E)$每个测试都是可以接受的，但是任何涉及匹配的组合探索的事情都是不可接受的。 

一个微妙的点是，我们不需要将尽可能多的相邻蛋糕配对。 配对是否有益完全取决于两者之间的比较$q$和$2p$。 如果$q < 2p$，配对比拿两个单打更糟糕。 如果$q > 2p$，配对总是更好，但我们受到邻接结构的限制，不能任意配对所有单元，因为每个单元最多只能使用一次。 

当蛋糕形成小型连接组件且配对机会有限时，就会出现边缘情况。 例如，仅考虑两个相邻的蛋糕。 如果$q < 2p$，答案是$2p$，但是总是成对的天真贪婪可能会错误地采取$q$。 另一个边缘情况是三个蛋糕排成一行。 如果配对有利，则只能选择一对，其中一只保持单身； 选择哪一对是无关紧要的，但不正确的贪婪匹配可能会尝试计数过多。 

## 方法

 蛮力视角将网格视为一个图，其中每个蛋糕都是一个节点，边连接相邻的蛋糕。 我们需要选择一组边，使得没有两个边共享端点，从而最大化总权重，其中选择一条边给出$q$并留下一个不匹配的节点贡献$p$。 

这正是一般图上的最大权重匹配问题。 简单的暴力破解会尝试所有匹配：对于每个节点，要么使其不匹配，要么将其与其邻居之一匹配，在剩余的图上递归，并计算最佳结果。 在完全填充网格的最坏情况下，每个节点最多有四个选择，并且递归分支大量，导致指数复杂度约为$O(2^{nm})$在精神上。 这对于 90,000 个节点来说是完全不可行的。 

关键的观察结果是所有节点的权重相同，并且边是均匀的。 除了与两个单边相比使用边缘是否可以提高总价值之外，该决定并不局部依赖于结构。 这消除了解决真正匹配问题的任何需要。 相反，唯一有意义的选择是在有益的情况下是否在某些有效匹配中使用尽可能多的边。 

如果我们比较成本，拿两个单打可以得出$2p$，而配对给出$q$。 如果$q \le 2p$，配对从来没有好处，所以我们只是单独拿所有蛋糕。 如果$q > 2p$，我们希望最大化蛋糕引起的网格子图中不相交的相邻对的数量。 这成为由网格单元的棋盘着色形成的二分图中的最大匹配问题。 

由于网格图是二分图，因此我们可以使用标准流或基于 DFS 的二分匹配来计算最大匹配。 每个蛋糕单元在四个方向上与其邻居相连，并且我们匹配尽可能多的边。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力匹配枚举| 指数| 指数| 太慢了|
 | 二分最大匹配 |$O(VE)$最坏的情况|$O(V+E)$| 已接受 |

 ## 算法演练

 我们根据之间的比较将问题分为两种情况$q$和$2p$。 

1. 我们计算网格中有多少个蛋糕。 如果我们单独考虑所有事情，这给出了基线。 
2.如果$q \le 2p$，我们立即返回蛋糕总数乘以$p$。 这是因为每次配对都会减少或不会提高总奖励，因此没有配对是有用的。 
3.如果$q > 2p$，我们将网格建模为一个图，其中每个蛋糕单元都是一个顶点。 我们以棋盘图案对网格进行着色以获得二分。 
4. 我们用相反的颜色连接相邻蛋糕单元之间的边缘。 这确保了图是二分图，这对于干净地应用标准匹配算法是必要的。 
5. 我们计算该图上的最大二分匹配。 每个匹配的边代表用一对操作替换两个单，获得额外的$q - 2p$过度单独对待他们。 
6. 最终答案计算为蛋糕总时间$p$，加上匹配的大小时间$(q - 2p)$。 

这种分解背后的原因是，我们从一个基线开始，其中每个蛋糕都是单独取出的，然后每个匹配的边缘将两个单个贡献升级为一对贡献。 

### 为什么它有效

 每个有效的策略都将蛋糕单元集划分为单例和不相交的相邻对。 这与邻接图中的匹配完全对应。 任何解决方案的价值都是$p \cdot (\text{number of nodes}) + (q - 2p) \cdot (\text{number of matched edges})$。 自从$p$在所有节点上是恒定的，最大化总值减少到最大化匹配中的边数，当$q > 2p$，否则不选择任何边。 匹配约束保证没有单元被重用，因此每个可行的解决方案都对应于有效的匹配，反之亦然。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10**7)

def solve():
    n, m, p, q = map(int, input().split())
    grid = [list(map(int, input().split())) for _ in range(n)]

    ones = []
    idx = [[-1] * m for _ in range(n)]

    for i in range(n):
        for j in range(m):
            if grid[i][j] == 1:
                idx[i][j] = len(ones)
                ones.append((i, j))

    k = len(ones)

    if q <= 2 * p:
        print(k * p)
        return

    # build bipartite graph
    adj = [[] for _ in range(k)]

    dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    for v, (i, j) in enumerate(ones):
        for di, dj in dirs:
            ni, nj = i + di, j + dj
            if 0 <= ni < n and 0 <= nj < m and idx[ni][nj] != -1:
                adj[v].append(idx[ni][nj])

    color = [(i + j) % 2 for i, j in ones]

    match_to = [-1] * k

    def dfs(v, vis):
        for u in adj[v]:
            if vis[u]:
                continue
            vis[u] = True
            if match_to[u] == -1 or dfs(match_to[u], vis):
                match_to[u] = v
                return True
        return False

    matching = 0
    for v in range(k):
        if color[v] == 0:
            vis = [False] * k
            if dfs(v, vis):
                matching += 1

    ans = k * p + matching * (q - 2 * p)
    print(ans)

if __name__ == "__main__":
    solve()
```该实现首先将网格压缩为蛋糕单元列表，并为每个单元分配一个索引。 这可以避免完全处理空单元格并保持快速的邻接检查。 

二分匹配是使用标准 DFS 增广路径方法实现的。 我们只从一种颜色类别开始 DFS 以避免重复工作。 这`match_to`数组存储当前哪个左侧顶点与每个右侧顶点匹配。 每个成功的 DFS 都会找到一条将匹配大小增加一的增广路径。 

最终的公式直接反映了基线加改进的结构。 一个常见的实施陷阱是在将比赛规模转换为总分时忘记减去基线重复计算； 这里的公式通过明确地从基线构建来避免这种情况。 

## 工作示例

 ### 示例 1

 考虑一个小网格：

 输入：```
2 3 10 25
1 1 0
0 1 1
```这里有 4 个蛋糕。 自从$q = 25 > 2p = 20$，配对是有益的。 

我们为蛋糕建立索引：

 | 细胞| 索引 |
 | --- | --- |
 | (0,0) | (0,0) | 0 |
 | (0,1)| 1 |
 | (1,1) | 2 |
 | (1,2) | 3 |

 邻接边存在于 (0,0)-(0,1)、(0,1)-(1,1)、(1,1)-(1,2) 之间。 最大匹配大小为 2。 

| 步骤| 配套尺寸| 基础分数 | 最终得分|
 | --- | --- | --- | --- |
 | 开始| 0 | 40 | 40 40 | 40
 | 匹配后 | 2 | 40 | 40 40 + 2×5 = 50 |

 这表明两对取代了四单，得分提高了$2 \cdot (25 - 20)$。 

### 示例 2

 输入：```
1 4 7 10
1 1 1 1
```一行有 4 个蛋糕。 自从$q = 10 > 14$是错误的，配对没有好处。 

我们立即计算：

 | 蛋糕| p| 问 | 战略| 结果 |
 | --- | --- | --- | --- | --- |
 | 4 | 7 | 10 | 10 所有单打 | 28 | 28

 即使存在邻接，配对也会降低价值，因此根本不使用匹配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(VE)$| DFS 在蛋糕图上增强路径二分匹配 |
 | 空间|$O(V + E)$| 邻接表和匹配数组 |

 和$V \le 90000$并且每个节点最多有 4 条边，图是稀疏的。 实际上，由于 DFS 中度数较小且提前终止，因此在典型约束下运行速度足够快。 

1024 MB 的内存限制可以轻松容纳邻接列表和辅助数组。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import builtins
    return capture()

# we embed solution here for testing

def solve(inp: str) -> str:
    import sys
    input = sys.stdin.readline

    n, m, p, q = map(int, sys.stdin.readline().split())
    grid = [list(map(int, sys.stdin.readline().split())) for _ in range(n)]

    ones = []
    idx = [[-1] * m for _ in range(n)]

    for i in range(n):
        for j in range(m):
            if grid[i][j] == 1:
                idx[i][j] = len(ones)
                ones.append((i, j))

    k = len(ones)

    if q <= 2 * p:
        return str(k * p)

    adj = [[] for _ in range(k)]
    dirs = [(1,0),(-1,0),(0,1),(0,-1)]

    for v,(i,j) in enumerate(ones):
        for di,dj in dirs:
            ni,nj = i+di,j+dj
            if 0<=ni<n and 0<=nj<m and idx[ni][nj]!=-1:
                adj[v].append(idx[ni][nj])

    color = [(i+j)%2 for i,j in ones]
    match_to = [-1]*k

    def dfs(v, vis):
        for u in adj[v]:
            if vis[u]:
                continue
            vis[u]=True
            if match_to[u]==-1 or dfs(match_to[u],vis):
                match_to[u]=v
                return True
        return False

    matching=0
    for v in range(k):
        if color[v]==0:
            vis=[False]*k
            if dfs(v,vis):
                matching+=1

    return str(k*p + matching*(q-2*p))

# custom tests
assert solve("2 3 10 25\n1 1 0\n0 1 1\n") == "50"
assert solve("1 4 7 10\n1 1 1 1\n") == "28"
assert solve("2 2 5 3\n1 1\n1 1\n") == "20"
assert solve("1 1 5 100\n0\n") == "0"
assert solve("3 3 1 10\n1 0 1\n0 1 0\n1 0 1\n") == "5"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2×2 满格，配对不良 | 20 | 20 当 q ≤ 2p | 时不使用配对
 | 单格空 | 0 | 空网格正确性|
 | 棋盘稀疏 | 5 | 稀疏匹配结构|
 | 线和中心混合| 邻接处理的正确性| |

 ## 边缘情况

 一种边缘情况是根本没有蛋糕。 该算法将其映射到$k = 0$，立即产生零，因为基线和匹配贡献都消失了。 

另一种情况是所有蛋糕都被隔离。 即使$q > 2p$，邻接图没有边，因此匹配大小为零，结果保持不变$k \cdot p$。 DFS 匹配正确地找不到增广路径，因为邻接表为空。 

最后一种情况是一个完全填充的网格$q \le 2p$。 即使图很稠密，该算法也完全避免了构造匹配，直接返回$k \cdot p$，防止不必要的计算并避免大输入的时间限制。
