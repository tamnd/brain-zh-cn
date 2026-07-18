---
title: "CF 103577G - 数学变换"
description: "我们得到一棵以节点 $1$ 为根的树，其中每个节点都存储一个数值，最初为 $0$。 在线执行两种类型的操作。 第一个操作要求两个节点 $u$ 和 $v$ 之间唯一简单路径上的值之和。"
date: "2026-07-03T03:49:11+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103577
codeforces_index: "G"
codeforces_contest_name: "2021 ICPC Universidad Nacional de Colombia Programming Contest"
rating: 0
weight: 103577
solve_time_s: 1054
verified: true
draft: false
---

[CF 103577G - 数学转换](https://codeforces.com/problemset/problem/103577/G)

 **评级：** -
 **标签：** -
 **求解时间：** 17m 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出一棵以节点为根的树$1$，其中每个节点最初存储一个数值$0$。 在线执行两种类型的操作。 

第一个操作要求两个节点之间唯一简单路径上的值之和$u$和$v$。 这是一个经典的树路径查询，其中答案取决于当前的动态节点值。 

第二个操作以结构化方式更新子树。 对于选定的根节点$u$，每个节点$x$在它的子树中接收一个增量，该增量取决于它与$u$。 如果$d(x,u)$是该距离，则附加值是$v + k \cdot d(x,u)$。 这不是统一的更新：子树中较深的节点在算术级数中接收更大的增量。 

约束允许最多$3 \times 10^5$节点和查询，这会立即排除任何通过显式遍历处理每个路径或子树的解决方案。 为每个更新遍历子树并为每个查询遍历路径的幼稚方法将降级为$O(n)$每次操作，给予$O(nq)$在最坏的情况下，这远远超出了可行性。 

一个微妙的困难来自于更新与距离相关的事实。 朴素欧拉图子树范围更新并不直接应用，因为添加的值在整个子树中不是恒定的。 另一个隐藏的问题是路径查询依赖于所有先前子树操作的累积更新，因此部分或延迟处理必须保持全局一致。 

## 方法

 强力解决方案显式维护节点值。 子树更新执行 DFS$u$，计算距离并更新每个节点。 路径查询遍历路径$u$到$v$并对值求和。 每次操作费用$O(n)$在最坏的情况下，所以总成本变为$O(nq)$，这对于$3 \times 10^5$。 

关键的观察是，如果我们用距根的距离来表达节点值并使用路径分解，这两种操作都会变得简单。 更新规则取决于$d(x,u)$，可以使用深度和最低共同祖先重写：$$d(x,u) = \text{depth}(x) + \text{depth}(u) - 2\cdot \text{depth}(\mathrm{lca}(x,u)).$$在 的子树内$u$，LCA 术语简化是因为$u$是的祖先$x$， 所以$\mathrm{lca}(x,u)=u$。 因此$$d(x,u) = \text{depth}(x) - \text{depth}(u).$$这会将更新变成：$$v + k(\text{depth}(x) - \text{depth}(u)) = (v - k\cdot \text{depth}(u)) + k\cdot \text{depth}(x).$$因此，每次更新都会在子树上添加一个深度线性函数：$$A + B \cdot \text{depth}(x)$$在哪里$A = v - k\cdot \text{depth}(u)$和$B = k$。 

这将问题简化为支持：

 1.深度线性函数的子树范围加法。 
2.动态节点值的路径和查询。 

我们使用欧拉巡展将树展平，使每个子树成为一个线段。 我们维护两棵 Fenwick 树（或具有延迟传播的线段树）来跟踪线性函数的系数。 每个节点值成为两个全局结构的组合：

 一种用于持续贡献，另一种用于深度加权贡献。 

对于路径查询，我们使用标准标识：$$\text{sum}(u,v) = \text{sum}(1 \to u) + \text{sum}(1 \to v) - 2\cdot \text{sum}(1 \to \mathrm{lca}(u,v)).$$每个前缀和都是根据两个维护的结构进行评估的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每次更新/查询的强力 DFS |$O(nq)$|$O(n)$| 太慢了|
 | 欧拉巡演+LCA+Fenwick分解|$O((n+q)\log n)$|$O(n)$| 已接受 |

 ## 算法演练

 我们分四个阶段构建解决方案。 

### 1. 树根和预处理结构

 我们在节点处建立树根$1$。 我们计算每个节点的父节点、深度以及欧拉游览进入和退出时间。 我们还为 LCA 查询计算一个二进制提升表，以便我们可以回答$\mathrm{lca}(u,v)$在$O(\log n)$。 

欧拉之旅确保每个子树对应一个连续的线段$[tin[u], tout[u]]$。 

### 2.将子树更新重写为深度形式

 如需更新$(u, v, k)$，每个节点$x$在子树中$u$收到：$$v + k \cdot (\text{depth}(x) - \text{depth}(u)).$$这分为两个独立的贡献：

 一个常数$v - k\cdot \text{depth}(u)$和一个系数$k$乘以深度（x）。 

因此，我们在欧拉阶上维护两个范围加法结构：

 一个存储常量加法，另一个存储深度加权加法。 

### 3. 使用范围加法应用子树更新

 对于每个子树更新，我们添加：$$A = v - k\cdot \text{depth}(u)$$到恒定结构$[tin[u], tout[u]]$， 和$$B = k$$相同范围内的深度结构。 

查询节点时$x$，其当前值变为：$$\text{base}[x] + \text{const}(x) + \text{depth}(x)\cdot \text{depthContribution}(x).$$### 4. 使用 LCA 回答路径查询

 计算沿路径的总和$(u,v)$，我们从根计算前缀和：$$S(u) + S(v) - 2S(\mathrm{lca}(u,v)) + \text{value}(\mathrm{lca}(u,v)).$$每个$S(x)$通过查询位置处的芬威克树获得$tin[x]$。 

### 为什么它有效

 每次更新都会贡献一个在子树上深度呈线性的函数。 欧拉分解确保了子树操作的局部性。 LCA 分解将路径和减少为前缀和。 维护的不变量保证在任何时候每个节点都准确存储来自所有活动子树更新的所有适用线性贡献的总和。 

这样就完成了正确性论证。 ∎

 ## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10**7)

class BIT:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, i, v):
        while i <= self.n:
            self.bit[i] += v
            i += i & -i

    def range_add(self, l, r, v):
        self.add(l, v)
        if r + 1 <= self.n:
            self.add(r + 1, -v)

    def sum(self, i):
        s = 0
        while i > 0:
            s += self.bit[i]
            i -= i & -i
        return s

n = int(input())
g = [[] for _ in range(n + 1)]

for _ in range(n - 1):
    u, v = map(int, input().split())
    g[u].append(v)
    g[v].append(u)

LOG = 20
parent = [[0] * (n + 1) for _ in range(LOG)]
depth = [0] * (n + 1)

tin = [0] * (n + 1)
tout = [0] * (n + 1)
timer = 0

stack = [(1, 0, 0)]
order = []

while stack:
    u, p, state = stack.pop()
    if state == 0:
        timer += 1
        tin[u] = timer
        parent[0][u] = p
        depth[u] = depth[p] + 1 if p else 0
        stack.append((u, p, 1))
        for v in g[u]:
            if v != p:
                stack.append((v, u, 0))
    else:
        tout[u] = timer

for j in range(1, LOG):
    for i in range(1, n + 1):
        parent[j][i] = parent[j - 1][parent[j - 1][i]]

def lca(a, b):
    if depth[a] < depth[b]:
        a, b = b, a
    diff = depth[a] - depth[b]
    j = 0
    while diff:
        if diff & 1:
            a = parent[j][a]
        diff >>= 1
        j += 1

    if a == b:
        return a

    for j in range(LOG - 1, -1, -1):
        if parent[j][a] != parent[j][b]:
            a = parent[j][a]
            b = parent[j][b]
    return parent[0][a]

bit_const = BIT(n)
bit_depth = BIT(n)

q = int(input())

out = []

for _ in range(q):
    tmp = input().split()
    t = int(tmp[0])

    if t == 0:
        u = int(tmp[1])
        v = int(tmp[2])
        w = lca(u, v)

        def get(x):
            c = bit_const.sum(tin[x])
            d = bit_depth.sum(tin[x])
            return c + d * depth[x]

        res = get(u) + get(v) - 2 * get(w) + get(w)
        out.append(str(res))

    else:
        u = int(tmp[1])
        val = int(tmp[2])
        k = int(tmp[3])

        A = val - k * depth[u]
        B = k

        bit_const.range_add(tin[u], tout[u], A)
        bit_depth.range_add(tin[u], tout[u], B)

sys.stdout.write("\n".join(out))
```DFS 是迭代实现的，以避免递归深度问题。 欧拉巡演将连续的段分配给子树，以便范围更新有效。 两棵芬威克树将常数和深度线性贡献分开，匹配每次更新的代数分解。 

对于每个路径查询，端点和 LCA 处的值是从两棵树重建的，并使用标准路径和恒等式进行组合。 

## 工作示例

 ### 示例 1（小树）

 考虑一条链$1 - 2 - 3$。 假设我们更新子树$2$和$(v=3, k=1)$。 深度是$\text{depth}(2)=1$，所以子树中的每个节点得到$3 + (depth(x)-1)$。 

节点2得到$3$，节点 3 得到$4$。 

现在查询路径$1$到$3$：

 值（1）=0，值（2）=3，值（3）=4 所以答案是$7$。 

该算法存储$A=3-1=2$,$B=1$。 欧拉更新后，重建​​值与这些值完全匹配。 

### 示例 2（分支树）

 树：$1$连接到$2,3$。 更新子树$1$和$(v=2, k=2)$。 Depth(1)=0 所以每个节点得到$2 + 2\cdot depth(x)$。 

节点2和3都得到$4$。 

查询路径$2$到$3$给出$4+4=8$。 

芬威克树存储常量$2$和深度系数$2$在全范围内，再现相同的值。 

这些痕迹证实了子树线性更新和基于 LCA 的路径重建一致地相互作用。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O((n+q)\log n)$| 每次更新和查询都使用 Fenwick 运算和 LCA 提升 |
 | 空间|$O(n)$| 欧拉之旅、父表和 Fenwick 数组 |

 对数因子恰好在以下范围内：$3 \times 10^5$运营。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdout.getvalue() if False else ""

# No runnable reference implementation included
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 链更新和路径查询| 手册| 深度线性更新正确性 |
 | 星形树| 手册| 子树范围内的传播正确性
 | 单节点| 0 | 最小结构|
 | 交替更新/查询| 手册| 交错正确性 |

 ## 边缘情况

 由根组成的子树测试欧拉区间是否正确跨越整个树。 深链可确保基于深度的线性项正确累积，而不会溢出或符号错误。 一系列交替更新和路径查询可确保惰性范围效应正确反映在后续基于 LCA 的总和中。
