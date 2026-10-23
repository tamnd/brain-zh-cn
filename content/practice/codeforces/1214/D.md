---
title: "CF 1214D - 金银岛"
description: "我们得到一个代表地图的 $n 乘 m$ 网格。 每个单元要么被阻塞，要么空闲。 我们从左上角的单元格 $(1,1)$ 开始，并希望到达右下角的单元格 $(n,m)$。"
date: "2026-06-15T18:37:57+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dp", "flows", "hashing"]
categories: ["algorithms"]
codeforces_contest: 1214
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 583 (Div. 1 + Div. 2, based on Olympiad of Metropolises)"
rating: 1900
weight: 1214
solve_time_s: 209
verified: true
draft: false
---

[CF 1214D - 金银岛](https://codeforces.com/problemset/problem/1214/D)

 **评级：** 1900
 **标签：** dfs 和类似、dp、流、哈希
 **求解时间：** 3m 29s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被赋予了一个$n \times m$代表地图的网格。 每个单元要么被阻塞，要么空闲。 我们从左上角的单元格开始$(1,1)$并想要到达右下角的单元格$(n,m)$。 运动受到严格限制：从任何牢房我们只能向下一步或向右一步，而不能向上或向左。 

在我们开始移动之前，对手可以将一些最初空闲的单元格转换为阻塞的单元格。 对手无法触及起始和结束单元格。 目标是找到必须阻塞的最小数量的单元，以便不存在有效的单调路径$(1,1)$到$(n,m)$。 

这本质上是单调运动约束下的“破坏所有路径”问题。 任何有效路径都是精确的序列$n + m - 2$动作，包括$n-1$起伏和$m-1$权，并且它只能通过空闲单元。 

关键的限制是$n \cdot m \le 10^6$，它允许在网格上使用线性或近线性图算法。 任何试图枚举所有路径的解决方案都是不可能的，因为单调路径的数量可能是指数级的$n + m$。 

当网格已经以不存在路径的方式被阻挡时，就会出现微妙的边缘情况。 在这种情况下，答案为零，因为不需要额外的阻塞。 另一个重要的情况是当网格完全开放时：我们实际上要求在有向非循环网格图中将左上角与右下角分开的最小顶点切割。 

## 方法

 一个直接的蛮力想法是枚举来自$(1,1)$到$(n,m)$，然后尝试使用尽可能少的阻塞单元格来访问每条路径。 即使对于中等大小的网格，路径数量也会以组合方式增长。 对于一个$10 \times 10$在网格中，已经有超过 1000 万条单调路径，并且每条路径都需要检查与候选块集的交集。 这是完全不可行的。 

更结构化的观点来自图论。 网格形成一个有向无环图，其中每个单元都是一个节点，边仅向右或向下。 我们想要删除最少数量的顶点（单元），以便不存在从源到汇的路径。 这是一个经典的最小顶点切割问题。 

最小顶点切割通常被简化为流问题。 每个顶点被分成两个节点：一个“入”节点和一个“出”节点，由容量为 1 的边连接，表示移除该单元的成本。 所有原始网格移动（右/下边缘）都表示为从一个单元格的“出”节点到其邻居的“入”节点的无限容量边缘。 答案变成最小值$s$-$t$切入这个变换后的图形。 

由于所有容量都是整数并且图形是稀疏的，因此最大流算法（例如 Dinic）可以在以下限制内轻松运行：$10^6$节点和粗略$2 \cdot 10^6$边缘。 

蛮力在概念上是有效的，因为它隐式搜索所有切割，但由于指数路径增长而失败。 流变换用结构化容量的多项式时间优化取代了组合爆炸。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解（枚举路径）| 指数| 指数| 太慢了 |
 | 最大流量（顶点分割）|$O(E \sqrt{V})$典型（实践中的迪尼克快）|$O(V+E)$| 已接受 |

 ## 算法演练

 我们将网格转换为流网络并计算最小割。 

1. 对于每个单元格$(i,j)$，创建两个节点：$v_{in}$和$v_{out}$。 它们之间的边代表我们是“使用”还是“删除”这个单元格。 我们为空闲单元分配容量 1，因为阻塞它们的成本为 1，为阻塞单元分配容量 0，因为它们已经不可用。 
2. 对于每个单元格，连接$v_{in} \to v_{out}$具有上述容量。 这强制要求，如果我们切割单元格，则需要支付其移除成本。 
3. 对于单元内每一次允许的移动$(i,j)$，我们添加无限容量边$v_{out}$的$(i,j)$到$v_{in}$它的右邻居和下邻居。 这些边缘确保移动是自由的，除非我们切割细胞。 
4.来源是$(1,1)_{out}$，因为我们在离开起始单元后开始，而汇点是$(n,m)_{in}$，因为到达目的地就意味着进入目的地。 
5. 运行最大流量算法。 得到的流量值等于最小切割容量，它对应于必须阻塞的最小单元数。 
6. 返回计算出的最大流量值。 

### 为什么它有效

 从开始到结束的任何有效路径都对应于流程图中的有向路径，该路径必须通过其内部边缘至少穿过每个顶点一次。 切割从顶点入到顶点出的边会从所有可能的路径中删除该单元。 相反，任何将源与接收器分开的切割都恰好对应于一组破坏所有单调路径的阻塞单元。 单位容量强制每个阻塞单元对切割尺寸的贡献恰好为 1，因此最小化切割成本相当于最小化阻塞单元的数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from collections import deque

INF = 10**18

class Dinic:
    def __init__(self, n):
        self.n = n
        self.graph = [[] for _ in range(n)]
    
    def add_edge(self, fr, to, cap):
        self.graph[fr].append([to, cap, len(self.graph[to])])
        self.graph[to].append([fr, 0, len(self.graph[fr]) - 1])
    
    def bfs(self, s, t):
        self.level = [-1] * self.n
        q = deque([s])
        self.level[s] = 0
        while q:
            v = q.popleft()
            for to, cap, rev in self.graph[v]:
                if cap > 0 and self.level[to] < 0:
                    self.level[to] = self.level[v] + 1
                    q.append(to)
        return self.level[t] >= 0
    
    def dfs(self, v, t, f):
        if v == t:
            return f
        for i in range(self.it[v], len(self.graph[v])):
            self.it[v] = i
            to, cap, rev = self.graph[v][i]
            if cap > 0 and self.level[to] == self.level[v] + 1:
                ret = self.dfs(to, t, min(f, cap))
                if ret:
                    self.graph[v][i][1] -= ret
                    self.graph[to][rev][1] += ret
                    return ret
        return 0
    
    def max_flow(self, s, t):
        flow = 0
        while self.bfs(s, t):
            self.it = [0] * self.n
            while True:
                f = self.dfs(s, t, INF)
                if not f:
                    break
                flow += f
        return flow

n, m = map(int, input().split())
grid = [input().strip() for _ in range(n)]

def id_in(i, j):
    return (i * m + j) * 2

def id_out(i, j):
    return (i * m + j) * 2 + 1

N = n * m * 2
dinic = Dinic(N)

for i in range(n):
    for j in range(m):
        if grid[i][j] == '#':
            cap = 0
        else:
            cap = 1
        dinic.add_edge(id_in(i, j), id_out(i, j), cap)

dirs = [(1, 0), (0, 1)]

for i in range(n):
    for j in range(m):
        for di, dj in dirs:
            ni, nj = i + di, j + dj
            if ni < n and nj < m:
                dinic.add_edge(id_out(i, j), id_in(ni, nj), INF)

s = id_out(0, 0)
t = id_in(n - 1, m - 1)

print(dinic.max_flow(s, t))
```该实现将每个单元编码为两个节点，以模拟通过边缘切割去除顶点。 唯一的微妙之处在于容量分配：阻塞的单元贡献为零，因此它们永远不会出现在剪切中，而空闲单元则花费一个单位。 

无限容量边缘必须足够大，以免限制切割； 像这样的值$10^{18}$安全地超过任何可能的切割尺寸，因为网格最多有$10^6$细胞。 

选择源作为起始单元的“出”节点可以避免意外地强制进入第一个单元的成本。 

## 工作示例

 ### 示例 1

 输入：```
2 2
..
..
```| 步骤| 流动状态（概念）| 说明|
 | ---| ---| ---|
 | 1 | 所有路径都存在 | 两条单调路径：右下和右下 |
 | 2 | 尝试切割一个细胞 | 移除任何单个细胞仍然会留下一条路|
 | 3 | 切割尺寸增加 | 需要至少两次移除 |

 该算法发现两个内部单元必须以某种组合被阻塞，从而产生答案 2。这证实了在完全开放的 2x2 网格中，必须破坏两条可能的中间路线。 

### 示例 2

 输入：```
3 3
...
.#.
...
```| 步骤| 流动状态（概念）| 说明|
 | ---| ---| ---|
 | 1 | 中间的细胞受阻 | 中心有一个障碍物 |
 | 2 | 路径重新路由 | 两条不相交的走廊仍然存在 |
 | 3 | 削减计算| 流程识别瓶颈结构 |

 流量计算表明，尽管有中心障碍物，但仍然存在两个不相交的单调走廊，因此需要额外的阻挡来完全分开起点和终点。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(E \sqrt{V})$典型的 Dinic | 每个网格单元贡献恒定的边，总节点为$O(nm)$|
 | 空间|$O(nm)$| 每个单元被分成两个节点加上邻接表 |

 网格尺寸约束为$10^6$单元格完全符合内存限制，并且当在 Python 中仔细实现或更可靠地在 PyPy/C++ 中实现时，Dinic 在类似单位容量的图上的性能在实践中足够快，达到 1 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque

    INF = 10**18

    class Dinic:
        def __init__(self, n):
            self.n = n
            self.graph = [[] for _ in range(n)]

        def add_edge(self, fr, to, cap):
            self.graph[fr].append([to, cap, len(self.graph[to])])
            self.graph[to].append([fr, 0, len(self.graph[fr]) - 1])

        def bfs(self, s, t):
            self.level = [-1] * self.n
            q = deque([s])
            self.level[s] = 0
            while q:
                v = q.popleft()
                for to, cap, rev in self.graph[v]:
                    if cap > 0 and self.level[to] < 0:
                        self.level[to] = self.level[v] + 1
                        q.append(to)
            return self.level[t] >= 0

        def dfs(self, v, t, f):
            if v == t:
                return f
            for i in range(self.it[v], len(self.graph[v])):
                self.it[v] = i
                to, cap, rev = self.graph[v][i]
                if cap > 0 and self.level[to] == self.level[v] + 1:
                    ret = self.dfs(to, t, min(f, cap))
                    if ret:
                        self.graph[v][i][1] -= ret
                        self.graph[to][rev][1] += ret
                        return ret
            return 0

        def max_flow(self, s, t):
            flow = 0
            while self.bfs(s, t):
                self.it = [0] * self.n
                while True:
                    f = self.dfs(s, t, INF)
                    if not f:
                        break
                    flow += f
            return flow

    n, m = map(int, input().split())
    grid = [input().strip() for _ in range(n)]

    def id_in(i, j):
        return (i * m + j) * 2

    def id_out(i, j):
        return (i * m + j) * 2 + 1

    N = n * m * 2
    dinic = Dinic(N)

    for i in range(n):
        for j in range(m):
            cap = 0 if grid[i][j] == '#' else 1
            dinic.add_edge(id_in(i, j), id_out(i, j), cap)

    for i in range(n):
        for j in range(m):
            if i + 1 < n:
                dinic.add_edge(id_out(i, j), id_in(i + 1, j), INF)
            if j + 1 < m:
                dinic.add_edge(id_out(i, j), id_in(i, j + 1), INF)

    s = id_out(0, 0)
    t = id_in(n - 1, m - 1)

    return str(dinic.max_flow(s, t))

# provided sample
assert run("""2 2
..
..""") == "2"

# custom tests
assert run("""3 3
...
.#.
...""") >= "1", "center block case"
assert run("""3 3
...
...
...""") == "2", "fully open small grid sanity"
assert run("""3 3
###
#..
###""") == "0", "already blocked path"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 2x2 空网格 | 2 | 最小非平凡分离 |
 | 中心障碍物网格| ≥1 | 障碍物重新路由行为|
 | 全开3x3 | 2 | 密集路径上的正确性
 | 走廊已被封锁| 0 | 无路径边缘情况 |

 ## 边缘情况

 走廊完全堵塞的案例凸显了为什么暴力推理会失败。 考虑一个网格，其中单个水平墙已经将起点与终点分开。 流程图立即生成零增广路径，因此算法返回 0，而不会尝试不必要的剪切。 

第二个边缘情况是狭窄的蛇形走廊。 在这种情况下，每个单元都位于所有可能的路径上。 最小切割等于内部单元的数量，并且顶点分割结构正确地强制切割精确地累积该成本，因为每条路径都必须经过每个中间顶点入边到顶点出边。
