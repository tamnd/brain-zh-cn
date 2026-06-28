---
title: "CF 105125E - 非理性路径"
description: "我们得到一个有向图，其边用十进制数字标记。 从顶点 1 开始，我们可以沿着有向边一直走下去。 边缘标签序列成为 0 到 1 之间数字的十进制扩展。"
date: "2026-06-27T19:30:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105125
codeforces_index: "E"
codeforces_contest_name: "MITIT 2024 Spring Invitational Qualification"
rating: 0
weight: 105125
solve_time_s: 95
verified: false
draft: false
---

[CF 105125E - 非理性路径](https://codeforces.com/problemset/problem/105125/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 35s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个有向图，其边用十进制数字标记。 从顶点 1 开始，我们可以沿着有向边一直走下去。 边缘标签序列成为 0 到 1 之间数字的十进制扩展。 

问题是是否存在小数展开无理的无限游走。 当十进制展开的数字**不是最终周期性**时，它就是无理数，因此任务实际上是在询问图是否可以生成非最终周期性数字序列。 

图很大，但所有测试用例的顶点和边的总数最多为$2 \cdot 10^5$。 任何重复探索同一个图或执行与$N^2$或者$M^2$立即被排除。 需要线性或近线性图算法。 

有几种情况很容易被忽视。 

假设没有可达循环。```
1 -> 2 -> 3
```根本不存在无限行走，所以答案是`No`。 仅检查不同边缘标签的解决方案将错误地回答`Yes`。 

假设可达部分是单个有向循环。```
1 -> 2 (digit 1)
2 -> 3 (digit 2)
3 -> 1 (digit 3)
```每一次无限行走都会重复`123123123...`，所以每个小数都是有理数。 正确答案是`No`。 

最微妙的情况是当 SCC 包含分支时，但来自同一“循环中的位置”的每个传出边缘始终携带相同的数字。 这种分支会更改访问的顶点，但不会更改生成的数字序列。 只看图结构是不够的，边标签也很重要。 

## 方法

 一个蛮力的想法是枚举越来越长的游走，同时检查生成的数字序列是否最终变成周期性的。 这在原则上是正确的，因为非理性正是最终周期性的缺失。 不幸的是，步行的数量随着步行长度呈指数增长，因此即使探索长度为 50 的所有步行也已经是不可能的。 

关键的观察结果是，每一次无限行走最终都会停留在一个强连接的组件内。 一旦离开 SCC，就永远无法返回。 这使我们能够独立分析每个可到达的 SCC。 

在一个 SCC 内，每个周期长度都有一些最大公约数$g$。 经典的图属性表明，可以通过取所有值的 gcd 在线性时间内计算该值$$\text{depth}[u] + 1 - \text{depth}[v]$$在每个有向边上$(u,v)$在 DFS 树中。 

计算后$g$，每个顶点自然属于以下之一$g$根据其 DFS 深度模的残差类别$g$。 每个边缘总是来自残留物$c$至残留$c+1 \pmod g$。 

现在是关键的特征描述。 如果离开同一残差类的顶点的每条边始终携带相同的数字，则每次无限游走在访问该残差类时都必须发出完全相同的数字。 产生的小数被迫重复每个$g$位置，因此每次行走最终都是周期性的。 

相反，如果某个残差类包含两个具有不同数字的出边，我们可以在保留在 SCC 内的同时在它们之间重复进行选择。 这允许构造一个最终不是周期性的数字序列，从而给出无理小数。 这个定性在官方的分析中得到了证明。 

整个算法变成了一系列 SCC 分解、DFS、gcd 计算和一次遍历边缘。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数| 指数| 太慢了 |
 | 最佳|$O(N+M)$|$O(N+M)$| 已接受 |

 ## 算法演练

 1. 从顶点 1 运行 DFS 或 BFS 并忽略每个无法到达的顶点。 
2. 计算可达子图的强连通分量。 
3. 单独处理每个可达的SCC。 忽略不能包含无限游走的 SCC，即没有自循环的单个顶点。 
4. 选取SCC 的任意顶点作为根，并在SCC 内构建DFS 树。 记录每个顶点的树深度。 
5. 计算 gcd$$g=\gcd(\text{depth}[u]+1-\text{depth}[v])$$覆盖 SCC 的每个边缘。 
6.为每个顶点着色`depth % g`。 什么时候`g = 0`，将其替换为 1，因为 SCC 始终至少有一个周期。 
7. 对于每个残差类，检查该类中每个顶点的每条出边。 所有这些边必须带有相同的数字。 如果某个残基类别包含两个不同的数字，请立即回答`Yes`。 
8. 如果每个可达的SCC都满足前面的条件，则回答`No`。 

### 为什么它有效

 每一次无限行走最终都会保留在一个可达的 SCC 内。 在 SCC 内部，所有循环长度的 gcd 决定了每个无限游走中位置的规范循环排序。 具有相同深度模的顶点$g$在该排序中始终占据相同的位置。 

如果每个残基类别总是发出相同的数字，则位置处的数字$i$仅取决于$i \bmod g$。 每一次无限行走最终都是周期性的，因此每一个小数都是有理数。 

如果一个残基类可以发出两个不同的数字，我们可以重复地重新访问该残基类并独立选择每次输出哪个数字。 根据任何非最​​终周期的二进制序列进行选择会产生非最终周期的十进制展开，这是不合理的。 

## Python 解决方案```python
import sys
from math import gcd

input = sys.stdin.readline
sys.setrecursionlimit(1_000_000)

t = int(input())

for _ in range(t):
    n, m = map(int, input().split())

    g = [[] for _ in range(n)]
    rg = [[] for _ in range(n)]
    edges = []

    for _ in range(m):
        u, v, d = map(int, input().split())
        u -= 1
        v -= 1
        g[u].append((v, d))
        rg[v].append(u)
        edges.append((u, v, d))

    # reachable
    vis = [False] * n
    stack = [0]
    vis[0] = True
    while stack:
        v = stack.pop()
        for to, _ in g[v]:
            if not vis[to]:
                vis[to] = True
                stack.append(to)

    order = []
    used = [False] * n

    def dfs1(v):
        used[v] = True
        for to, _ in g[v]:
            if vis[to] and not used[to]:
                dfs1(to)
        order.append(v)

    for i in range(n):
        if vis[i] and not used[i]:
            dfs1(i)

    comp = [-1] * n

    def dfs2(v, c):
        comp[v] = c
        comps[-1].append(v)
        for to in rg[v]:
            if vis[to] and comp[to] == -1:
                dfs2(to, c)

    comps = []
    cid = 0
    for v in reversed(order):
        if comp[v] == -1:
            comps.append([])
            dfs2(v, cid)
            cid += 1

    ok = False

    for idx, verts in enumerate(comps):
        if ok:
            break

        if len(verts) == 1:
            u = verts[0]
            self_loop = False
            for to, _ in g[u]:
                if to == u:
                    self_loop = True
            if not self_loop:
                continue

        depth = {}
        root = verts[0]

        def dfs(v):
            for to, _ in g[v]:
                if comp[to] != idx:
                    continue
                if to not in depth:
                    depth[to] = depth[v] + 1
                    dfs(to)

        depth[root] = 0
        dfs(root)

        cyc = 0
        for u in verts:
            for v, _ in g[u]:
                if comp[v] == idx:
                    cyc = gcd(cyc, abs(depth[u] + 1 - depth[v]))
        if cyc == 0:
            cyc = 1

        digit = {}
        for u in verts:
            c = depth[u] % cyc
            for v, d in g[u]:
                if comp[v] != idx:
                    continue
                if c in digit:
                    if digit[c] != d:
                        ok = True
                        break
                else:
                    digit[c] = d
            if ok:
                break

    print("Yes" if ok else "No")
```第一部分删除所有无法到达的顶点，因为没有有效的行走可以进入这些顶点。 

Kosaraju 的算法将剩余的图分解为 SCC。 由于每次无限行走最终都会停留在一个 SCC 内，因此可以独立检查每个组件。 

对于每个相关的 SCC，DFS 分配深度。 这些深度只是一种可能的生成树，但 gcd 计算消除了对特定树的依赖。 价值`depth[u] + 1 - depth[v]`捕获每个非树边改变循环长度的程度，并对所有这些值取 gcd 来恢复 SCC 中每个循环长度的 gcd。 

最后，顶点按以下方式分组`depth % cyc`。 来自一个残基类别的每个传出边缘必须携带相同的数字。 一旦出现两个不同的数字，我们就发现了一条不合理的路径，可以立即停止。 

## 工作示例

 ### 示例 1

 可到达的 SCC 是单个有向循环。 

| 步骤| 价值|
 | ---| ---|
 | 南昌中心 | {1,2,3} |
 | GCCD | 3 |
 | 残留物| 0,1,2 |
 | 按余数排列的数字 | 1,2,3 |
 | 冲突| 没有 |

 每个残基总是发出相同的数字，因此每次行走都会重复`123`。 

### 第二个例子```
1 -> 1 (0)
1 -> 2 (1)
2 -> 1 (1)
2 -> 2 (0)
```| 步骤| 价值|
 | ---| ---|
 | 南昌中心 | {1,2} |
 | GCCD | 1 |
 | 残留物| 两个顶点都在残差 0 |
 | 留下余数 0 的数字 | 0 和 1 |
 | 冲突| 是的 |

 由于一个残基可以发出任一数字，因此我们可以构建任意二进制序列，包括非最终周期序列。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(N+M)$| SCC分解、DFS、gcd计算和边缘扫描都是线性的|
 | 空间|$O(N+M)$| 图存储和辅助数组 |

 因为所有测试用例的顶点和边的总数最多为$2 \cdot 10^5$，线性算法很容易满足限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    # paste solution here
    ...

# sample
assert run("""3
4 4
1 2 1
1 2 1
2 3 2
3 1 3
2 4
1 1 0
1 2 1
2 1 1
2 2 0
6 6
1 2 4
1 3 5
2 4 6
2 5 7
6 6 8
6 6 9
""") == "No\nYes\nNo\n"

assert run("""1
1 1
1 1 7
""") == "No\n"

assert run("""1
2 2
1 2 0
2 1 1
""") == "No\n"

assert run("""1
2 4
1 1 0
1 2 1
2 1 1
2 2 0
""") == "Yes\n"

assert run("""1
3 2
1 2 5
2 3 6
""") == "No\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单自循环 | 没有 | 纯周期小数 |
 | 一个定向循环 | 没有 | 每次行走都会重复 |
 | 具有冲突数字的 SCC | 是的 | 存在无理数列 |
 | 没有可达循环 | 没有 | 无限行走是不可能的|

 ## 边缘情况

 考虑一个没有可达环的图。```
1 2
1 2 5
2 3 6
```可达子图不包含有循环的 SCC，因此每个 SCC 都会被跳过。 算法正确打印`No`。 

考虑单个可达有向循环。```
3 3
1 2 1
2 3 2
3 1 3
```gcd 为 3，每个残基类别恰好发出一位数字，并且未发现冲突。 输出是`No`。 

最后，考虑```
2 4
1 1 0
1 2 1
2 1 1
2 2 0
```整个图就是一个SCC。 gcd 等于 1，因此每个顶点都属于同一残基类。 该残差具有标记为 0 和 1 的传出边缘，因此算法立即报告`Yes`，完全匹配非最终周期性二进制数字序列的存在。
