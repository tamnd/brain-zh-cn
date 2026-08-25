---
title: "CF 104805C - 票价"
description: "我们拥有一个连接的城市网络，形成一棵树。 每条道路连接两个城市并具有权重。 对于任何两个城市，它们之间只有一条简单的路径，因为不存在循环。"
date: "2026-06-28T13:16:33+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104805
codeforces_index: "C"
codeforces_contest_name: "Central Russia Regional Contest, 2022"
rating: 0
weight: 104805
solve_time_s: 89
verified: true
draft: false
---

[CF 104805C - 票价](https://codeforces.com/problemset/problem/104805/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 29s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们拥有一个连接的城市网络，形成一棵树。 每条道路连接两个城市并具有权重。 对于任何两个城市，它们之间只有一条简单的路径，因为不存在循环。 

对于每个查询，我们需要计算两个给定城市之间唯一路径上的值。 该值不是总和或最小值，而是该路径上所有边权重的乘积，取模$10^9 + 7$。 

因此，每个查询都简化为：沿着加权树中两个节点之间的路径找到权重的乘积。 

这些约束使我们远离任何按查询遍历路径的方法。 高达$2 \cdot 10^5$节点和$2 \cdot 10^5$查询，即使每个查询的线性遍历也会导致大约$10^{10}$在最坏的情况下进行操作，这远远超出了可行的限度。 

一些边缘情况在概念上很重要。 如果树退化为链，则每个查询的简单遍历将变得非常昂贵，因为每个查询可能会遍历几乎所有节点。 另一个微妙的问题是大权重的重复乘法$10^9$，这需要在每一步进行模块化运算以避免溢出。 

## 方法

 暴力解决方案通过每次使用父指针或 DFS 从一个节点走到另一个节点来回答每个查询，并沿途乘以边权重。 这是正确的，因为它直接遵循路径的定义。 然而，在树是链的最坏情况下，每次查询都会花费$O(N)$, 给予$O(NQ)$，这对于$2 \cdot 10^5$。 

关键的观察是，树结构允许我们预处理节点之间的关系，以便路径查询可以分解为更小的、可重用的片段。 我们不重新计算路径，而是对树进行根化并预先计算从根到每个节点的信息。 然后，两个节点之间的任何路径都可以使用它们与根的关系以及它们的最低公共祖先来表示。 

如果我们存储从根到每个节点的边权重的乘积，则可以使用祖先结构重建沿着两个节点之间的路径的乘积。 然而，乘法并不像加法那样取消，所以我们不能直接减去值。 相反，我们依赖于这样一个事实：路径分解分为两个根到节点的路径和一个共享前缀。 最低的共同祖先让我们可以干净地隔离共享前缀。 

通过将 LCA 的二进制提升与根到节点产品相结合，每个查询都可以在对数时间内得到答复。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(NQ)$|$O(1)$额外 | 太慢了|
 | 最优（LCA + 预处理）|$O((N+Q)\log N)$|$O(N\log N)$| 已接受 |

 ## 算法演练

 ### 预处理

 1. 将树以任意节点为根，例如节点 1。这为每个节点提供了父子方向，并使路径推理保持一致。 
2. 从根运行 DFS 来计算两个数组：用于二进制提升的父表和一个值`up_prod[node]`它存储从根到该节点模的边权重的乘积$10^9+7$。 每次我们穿过一条边$u \to v$有重量$w$，我们设置`up_prod[v] = up_prod[u] * w mod M`。 这对根到节点的路径进行了紧凑的编码。 
3. 搭建二元升降台`up[k][v]`， 在哪里`up[k][v]`是$2^k$- 节点的第一个祖先$v$。 这允许在 LCA 计算期间以对数步长向上跳跃。 需要这样做的原因是每个查询重复的父级攀登将是线性的，这太慢了。 

### LCA 计算

 1. 计算节点的最低公共祖先$a$和$b$，首先将较深的节点向上提升，使两者处于相同的深度。 这确保我们比较距根的距离相等的节点。 
2. 然后同时向上提升两个节点，首先尝试最大的跳跃。 每当他们的$2^k$-祖先不同，我们将两个节点向上移动。 这个过程收敛到 LCA 下方的点。 
3. 任一节点的最终父节点都是 LCA。 

### 查询答案

 1. 对于每个查询$(a, b)$，计算他们的 LCA$c$。 
2. 路径积来自$a$到$c$可以从根产品导出为：$$\frac{up\_prod[a]}{up\_prod[c]}$$但模算术中的除法被模逆乘法所取代。 
3. 同样，路径从$b$到$c$是：$$\frac{up\_prod[b]}{up\_prod[c]}$$4. 将两部分相乘并取模$10^9+7$以获得最终答案。 

### 为什么它有效

 根到节点的产品`up_prod[x]`代表产品沿着从根到$x$。 对于任意两个节点，它们到根的路径与到它们 LCA 的路径完全重叠。 该共享前缀出现在两个根产品中，必须删除一次。 LCA 精确地识别了这种重叠，而模逆允许我们在模运算下干净地消除它。 由于每条边在重建路径中只包含一次，因此计算值与真实路径乘积相匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7
LOG = 20

def modinv(x):
    return pow(x, MOD - 2, MOD)

def solve():
    n = int(input())
    g = [[] for _ in range(n + 1)]

    for _ in range(n - 1):
        u, v, w = map(int, input().split())
        g[u].append((v, w))
        g[v].append((u, w))

    up = [[0] * (n + 1) for _ in range(LOG)]
    depth = [0] * (n + 1)
    up_prod = [1] * (n + 1)
    parent = [0] * (n + 1)

    sys.setrecursionlimit(10**7)

    def dfs(v, p):
        for to, w in g[v]:
            if to == p:
                continue
            parent[to] = v
            depth[to] = depth[v] + 1
            up_prod[to] = (up_prod[v] * w) % MOD
            up[0][to] = v
            dfs(to, v)

    dfs(1, 0)

    for k in range(1, LOG):
        for v in range(1, n + 1):
            up[k][v] = up[k - 1][up[k - 1][v]]

    def lca(a, b):
        if depth[a] < depth[b]:
            a, b = b, a

        diff = depth[a] - depth[b]
        for k in range(LOG):
            if diff & (1 << k):
                a = up[k][a]

        if a == b:
            return a

        for k in reversed(range(LOG)):
            if up[k][a] != up[k][b]:
                a = up[k][a]
                b = up[k][b]

        return parent[a]

    def path_product(a, b):
        c = lca(a, b)
        res = up_prod[a]
        res = (res * modinv(up_prod[c])) % MOD
        res = (res * up_prod[b]) % MOD
        res = (res * modinv(up_prod[c])) % MOD
        return res

    q = int(input())
    out = []
    for _ in range(q):
        a, b = map(int, input().split())
        out.append(str(path_product(a, b)))

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```该解决方案首先构建树的邻接列表表示。 以节点 1 为根的 DFS 从根计算深度和边权重的乘积。 同时它填充了二元升降台的第一祖级。 

经过DFS后，二进制升降台自下而上填充，保证每次尺寸的跳跃$2^k$可用。 LCA 函数首先对齐深度，然后以 2 的递减幂提升两个节点以找到第一个分歧点。 

路径乘积函数使用根到节点乘积和模逆来重建查询答案。 逆运算是必不可少的，因为直接除法在模运算下无效。 

一个微妙的实现细节是确保通过快速求幂而不是预计算来计算模逆，因为每个查询的值都会有所不同并且取决于任意权重。 

## 工作示例

 我们使用提供的样本。 

### 示例 1

 输入树和查询：

 | 步骤| 行动| 节点 A | 节点 B | 生命周期评估 | 上生产[A] | 上生产[B] | up_prod[LCA] | 结果 |
 | --- | --- | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 查询 1→3 | 1 | 3 | 3 | 1 | 3 | 3 | 3 |
 | 2 | 查询 3→2 | 3 | 2 | 3 | 3 | 15 | 15 3 | 5 |
 | 3 | 查询5→6 | 5 | 6 | 4 | 60| 540 | 540 10 | 10 54 | 54
 | 4 | 查询2→4 | 2 | 4 | 3 | 15 | 15 150 | 150 3 | 150 | 150
 | 5 | 查询2→6 | 2 | 6 | 3 | 15 | 15 540 | 540 3 | 1350 | 1350

 此跟踪显示每个答案如何仅依赖于预先计算的根乘积和 LCA 结构，而不依赖于重新行走路径。 

### 示例 2（已构建）

 考虑一个简单的链：

 输入：```
4
1 2 2
2 3 3
3 4 4
2
1 4
2 3
```预期的：```
24
3
```| 查询 | 路径| 产品 |
 | --- | --- | --- |
 | 1→4 | 1-2-3-4 | 1-2-3-4 | 2×3×4 = 24 |
 | 2→3 | 2-3 | 2-3 3 |

 这证实了最简单的线性结构的正确性，其中天真的遍历在最坏的情况下会很慢。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O((N + Q)\log N)$| DFS 预处理、二进制提升表构造和每个查询的 LCA |
 | 空间|$O(N \log N)$| 邻接表加祖先表|

 复杂性完全符合约束条件，因为$N$和$Q$达到$2 \cdot 10^5$，对数因子仍然很小。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return solve_capture(inp)

def solve_capture(inp: str) -> str:
    import sys
    input = sys.stdin.readline
    MOD = 10**9 + 7
    LOG = 20

    def modinv(x):
        return pow(x, MOD - 2, MOD)

    n = int(input())
    g = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v, w = map(int, input().split())
        g[u].append((v, w))
        g[v].append((u, w))

    up = [[0] * (n + 1) for _ in range(LOG)]
    depth = [0] * (n + 1)
    up_prod = [1] * (n + 1)
    parent = [0] * (n + 1)

    sys.setrecursionlimit(10**7)

    def dfs(v, p):
        for to, w in g[v]:
            if to == p:
                continue
            parent[to] = v
            depth[to] = depth[v] + 1
            up_prod[to] = (up_prod[v] * w) % MOD
            up[0][to] = v
            dfs(to, v)

    dfs(1, 0)

    for k in range(1, LOG):
        for v in range(1, n + 1):
            up[k][v] = up[k - 1][up[k - 1][v]]

    def lca(a, b):
        if depth[a] < depth[b]:
            a, b = b, a
        diff = depth[a] - depth[b]
        for k in range(LOG):
            if diff & (1 << k):
                a = up[k][a]
        if a == b:
            return a
        for k in reversed(range(LOG)):
            if up[k][a] != up[k][b]:
                a = up[k][a]
                b = up[k][b]
        return parent[a]

    def path(a, b):
        c = lca(a, b)
        res = up_prod[a]
        res = res * modinv(up_prod[c]) % MOD
        res = res * up_prod[b] % MOD
        res = res * modinv(up_prod[c]) % MOD
        return res

    q = int(input())
    out = []
    for _ in range(q):
        a, b = map(int, input().split())
        out.append(str(path(a, b)))

    return "\n".join(out)

# provided samples
assert run("""6
1 3 3
3 2 5
4 5 6
6 4 9
4 1 10
5
1 3
3 2
5 6
2 4
2 6
""") == """3
5
54
150
1350"""

# custom cases
assert run("""2
1 2 7
1
1 2
""") == "7", "minimum tree"

assert run("""3
1 2 2
2 3 5
2
1 3
2 3
""") == """10
5""", "chain consistency"

assert run("""5
1 2 1
1 3 1
1 4 1
1 5 1
3
2 3
4 5
2 5
""") == """1
1
1""", "star tree all ones"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小树| 7 | 基本正确性 |
 | 链条| 10, 5 | 线性路径正确性 |
 | 星树| 全部 1 | LCA 处理和微不足道的重量 |

 ## 边缘情况

 一个关键的边缘情况是两个节点都处于父子关系时。 在这种情况下，LCA 本身就是节点之一。 该算法仍然有效，因为`up_prod[c]`正确取消并将完整路径积留在更深的节点侧。 

另一种边缘情况发生在星形树中，其中许多查询共享作为 LCA 的根。 在这里，两个节点都是根的直接子节点，因此答案简化为将两个单边路径相乘。 根积为1，因此取消不影响正确性。 

最后，在退化链中，每个查询 LCA 计算都变成最大深度提升。 二进制提升表确保它仍然以对数时间运行，避免重复遍历中间节点。
