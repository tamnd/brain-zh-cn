---
title: "CF 231E - 仙人掌"
description: "我们得到一个连通的无向图，它保证是一个顶点仙人掌。 在顶点仙人掌中，每个顶点最多属于一个简单循环。 循环可以通过关节点接触图的其余部分，但两个不同的循环永远不能共享一个顶点。"
date: "2026-06-04T09:14:34+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "dp", "graphs", "trees"]
categories: ["algorithms"]
codeforces_contest: 231
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 143 (Div. 2)"
rating: 2100
weight: 231
solve_time_s: 155
verified: false
draft: false
---

[CF 231E - 仙人掌](https://codeforces.com/problemset/problem/231/E)

 **评分：** 2100
 **标签：** 数据结构、dfs 和类似、dp、图、树
 **求解时间：** 2m 35s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个连通的无向图，它保证是一个顶点仙人掌。 在顶点仙人掌中，每个顶点最多属于一个简单循环。 循环可以通过关节点接触图的其余部分，但两个不同的循环永远不能共享一个顶点。 

对于每个查询`(x, y)`，我们必须计算有多少条不同的简单路径从`x`并结束于`y`。 如果两条路径的边集不同，则认为两条路径不同。 答案需要模数`10^9 + 7`。 

该图最多有`10^5`顶点，`10^5`边缘，以及`10^5`查询。 任何通过直接探索图形来处理查询的解决方案都将立即被排除。 甚至一个`O(n)`每个查询的计算量大约需要`10^10`最坏情况下的操作。 

仙人掌限制是问题的关键。 在一般图中，计算简单路径是极其困难的。 在仙人掌中，每个循环都独立运行，并且图可以压缩为树状结构。 

当两个查询的顶点位于同一循环内时，会出现一种微妙的情况。 

例子：```
1-2
| |
4-3
```询问`(1,3)`有两条简单的路径：```
1-2-3
1-4-3
```假设路径唯一性的基于树的方法将错误地返回`1`。 

另一个重要的情况是当两个顶点之间的路线经过多个循环时。 

例子：```
cycle A -- bridge -- cycle B
```从一侧到另一侧的任何简单路径必须选择循环 A 内的一个方向和循环 B 内的一个方向。答案为`2 * 2 = 4`。 

只检查端点周期的粗心实现会错过这种乘法效应。 

第三种边缘情况是当路径通过其铰接顶点接触循环但不需要遍历该循环时。 这样的循环没有任何贡献。 只有位于端点之间的压缩树路径上的循环才重要。 

## 方法

 蛮力的想法是枚举所查询的顶点之间的所有简单路径。 

这是正确的，因为问题直接要求简单路径的数量。 不幸的是，即使是单个查询也可能在具有多个循环的图中具有指数级的许多简单路径。 高达`10^5`查询，这是无望的。 

仙人掌的特性极大地改变了结构。 由于每个顶点最多属于一个循环，因此每个双连通分量要么是单边，要么是单循环。 

想想当我们将每个周期收缩到一个特殊节点时会发生什么。 

由此产生的结构成为一棵树，通常称为仙人掌块切树。 

原始顶点成为一种节点。 

每个周期都成为另一种类型的节点。 

属于循环的每个顶点都连接到该循环节点。 

因为循环永远不会重叠，所以该图是一棵树。 

现在考虑一个查询。 一棵树的两个顶点之间只有一条路线。 每当该路线经过循环节点时，就有两种方法可以遍历相应的循环。 人们可以顺时针或逆时针绕一圈。 

不同的循环节点独立贡献。 如果树路径包含`c`循环节点，答案很简单：```
2^c
```所以问题就简化为：

 1. 构建仙人掌块树。 
2. 对于每个查询，计算树路径上有多少个循环节点。 
3. 返回`2^(count)`。 

计算树路径上的循环节点是一个带有前缀和的标准 LCA 问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数| O(n) | 太慢了 |
 | 最佳 | O((n+m) log n + k log n) | O((n+m) log n + k log n) | O(n+m) | 已接受 |

 ## 算法演练

 ### 1.找到所有循环顶点

 运行 DFS 并计算标准发现时间和低链路值。 

每当 DFS 遇到来自节点的后沿时`u`给祖先`v`，DFS堆栈上的顶点来自`u`回到`v`形成仙人掌的一个循环。 

因为该图是一个顶点仙人掌，所以每个顶点最多可以属于一个这样的循环。 

我们为每个发现的循环分配一个标识符。 

### 2. 构建区块树

 创建两种节点。 

第一个`n`节点对应于原始图的顶点。 

每个发现的循环都会接收一个额外的节点。 

对于循环中包含的每个顶点，连接：```
vertex node <-> cycle node
```不属于任何循环的顶点与循环节点保持隔离。 

生成的图是一棵树。 

原因是仙人掌的每个块要么是一条边，要么是一个环，而这种图的标准块切割表示是非循环的。 

### 3.标记循环节点

 分配权重：```
0 for original vertices
1 for cycle nodes
```稍后，路径总和将计算遇到的循环节点数量。 

### 4. 预处理 LCA

 将块树植根于任意位置，例如在节点处`1`。 

计算：```
depth[u]
up[j][u]
pref[u]
```在哪里`pref[u]`是根到上的循环节点数`u`小路。 

二进制提升给出`O(log n)`LCA 查询。 

### 5.回答问题

 让`a`和`b`是原始顶点节点。 

寻找：```
l = LCA(a,b)
```树路径上的循环节点数为：```
cnt =
pref[a] + pref[b]
- 2 * pref[l]
+ weight[l]
```每个这样的周期贡献两倍。 

答案是：```
2^cnt mod MOD
```### 为什么它有效

 将每个循环替换为专用循环节点后，仙人掌就变成了一棵树。 原始图中两个顶点之间的任何路径都对应于其对应节点之间的唯一树路径。 

每当该树路径经过循环节点时，原始路径就会通过一个循环顶点进入循环并通过另一个循环顶点离开。 一个简单的循环在这些顶点之间提供了两条不同的简单路线，围绕循环的每个方向各一条。 

不同循环内所做的选择是独立的，因为不同循环不共享顶点。 因此，每个遇到的循环都会使有效简单路径的数量加倍。 

树路径循环计数正是独立二元选择的数量，因此答案等于`2^(cycle count)`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1000000007

n, m = map(int, input().split())

g = [[] for _ in range(n + 1)]
for _ in range(m):
    u, v = map(int, input().split())
    g[u].append(v)
    g[v].append(u)

tin = [0] * (n + 1)
low = [0] * (n + 1)
parent = [0] * (n + 1)
timer = 0

cycles = []
stack = []

sys.setrecursionlimit(300000)

def dfs(u, p):
    global timer
    timer += 1
    tin[u] = low[u] = timer

    for v in g[u]:
        if v == p:
            continue

        if not tin[v]:
            parent[v] = u
            dfs(v, u)
            low[u] = min(low[u], low[v])
        elif tin[v] < tin[u]:
            low[u] = min(low[u], tin[v])

            cyc = [v]
            cur = u
            while cur != v:
                cyc.append(cur)
                cur = parent[cur]
            cycles.append(cyc)

dfs(1, 0)

tot = n + len(cycles)
tree = [[] for _ in range(tot + 1)]

for idx, cyc in enumerate(cycles, start=1):
    cid = n + idx
    for v in cyc:
        tree[cid].append(v)
        tree[v].append(cid)

LOG = (tot + 1).bit_length()

depth = [0] * (tot + 1)
pref = [0] * (tot + 1)
up = [[0] * (tot + 1) for _ in range(LOG)]
weight = [0] * (tot + 1)

for i in range(n + 1, tot + 1):
    weight[i] = 1

def dfs_tree(u, p):
    up[0][u] = p

    if p:
        pref[u] = pref[p] + weight[u]
        depth[u] = depth[p] + 1
    else:
        pref[u] = weight[u]

    for v in tree[u]:
        if v != p:
            dfs_tree(v, u)

dfs_tree(1, 0)

for j in range(1, LOG):
    prev = up[j - 1]
    cur = up[j]
    for v in range(1, tot + 1):
        cur[v] = prev[prev[v]]

pow2 = [1] * (len(cycles) + 1)
for i in range(1, len(pow2)):
    pow2[i] = (pow2[i - 1] * 2) % MOD

def lca(a, b):
    if depth[a] < depth[b]:
        a, b = b, a

    diff = depth[a] - depth[b]
    bit = 0

    while diff:
        if diff & 1:
            a = up[bit][a]
        diff >>= 1
        bit += 1

    if a == b:
        return a

    for j in range(LOG - 1, -1, -1):
        if up[j][a] != up[j][b]:
            a = up[j][a]
            b = up[j][b]

    return up[0][a]

q = int(input())

ans = []

for _ in range(q):
    a, b = map(int, input().split())

    l = lca(a, b)

    cnt = (
        pref[a]
        + pref[b]
        - 2 * pref[l]
        + weight[l]
    )

    ans.append(str(pow2[cnt]))

sys.stdout.write("\n".join(ans))
```找到所有循环后，代码为每个循环创建一个额外的节点，并将该节点连接到属于该循环的所有顶点。 这是关键的压缩步骤。 

块树上的 DFS 计算二进制提升祖先和循环节点的前缀计数。 前缀计数允许使用标准 LCA 公式恢复任何路径总和。 

一个微妙的点是循环节点本身带有重量`1`，而普通顶点带有重量`0`。 这使得路径总和等于遇到的循环数。 

另一个细节是两个的预计算能力。 最大循环次数最多为`m`，因此简单的线性预计算就足够了。 

## 工作示例

 ### 示例 1

 该图包含两个循环：```
1-2-3-4-1
6-7-8-6
```压缩树包含两个循环节点。 

询问`(9,2)`:

 | 压缩路径上的节点| 类型 | 贡献 |
 | ---| ---| ---|
 | 9 | 顶点| 0 |
 | 7 周期 | 循环| 1 |
 | 6 | 顶点| 0 |
 | 5 | 顶点| 0 |
 | 3 | 顶点| 0 |
 | 4 周期 | 循环| 1 |
 | 2 | 顶点| 0 |

 总周期数 = 2。 

答：```
2^2 = 4
```与样本相匹配。 

这表明循环贡献独立地倍增。 

### 自定义示例

 输入：```
4 4
1 2
2 3
3 4
4 1
1
1 3
```压缩树：

 | 树节点 | 类型 |
 | ---| ---|
 | 1 | 顶点|
 | 2 | 顶点|
 | 3 | 顶点|
 | 4 | 顶点|
 | C | 循环|

 小路：```
1 -> C -> 3
```周期计数 = 1。 

答：```
2^1 = 2
```这两条路径是：```
1-2-3
1-4-3
```这证实了循环节点作为二元选择的解释。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + m) + (n + c) log n + k log n) | DFS、树预处理和 LCA 查询 |
 | 空间| O((n + c) log n) | O((n + c) log n) | 块树和二元升降台|

 这里`c`是周期数，并且`c ≤ m`。 周围有所有限制`10^5`，复杂性很容易满足 2 秒限制和 256 MB 内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    from solution import solve
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    solve()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout
    return out.getvalue().strip()

# sample 1
assert run(
"""10 11
1 2
2 3
3 4
1 4
3 5
5 6
8 6
8 7
7 6
7 9
9 10
6
1 2
3 5
6 9
9 2
9 3
9 10
"""
) == "\n".join(["2","2","2","4","4","1"])

# tree
assert run(
"""2 1
1 2
1
1 2
"""
) == "1"

# single cycle
assert run(
"""4 4
1 2
2 3
3 4
4 1
1
1 3
"""
) == "2"

# two cycles in chain
assert run(
"""7 8
1 2
2 3
3 1
3 4
4 5
5 6
6 4
6 7
1
1 7
"""
) == "4"

# cycle queried at articulation
assert run(
"""5 5
1 2
2 3
3 1
3 4
4 5
1
5 3
"""
) == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 二节点树| 1 | 树中独特的路径|
 | 单周期| 2 | 一个周期使计数加倍 |
 | 两个循环链 | 4 | 独立乘法|
 | 查询结束于关节 | 1 | 循环不一定要用|
 | 样品1 | 样本输出 | 全仙人掌结构 |

 ## 边缘情况

 考虑一张只有一个周期的图：```
4 4
1 2
2 3
3 4
4 1
1
1 3
```压缩路径恰好包含一个循环节点。 算法返回`2^1 = 2`，对应于循环的两个方向。 

现在考虑：```
5 5
1 2
2 3
3 1
3 4
4 5
1
5 3
```块树中的路径很简单：```
5 -> 4 -> 3
```循环节点未被遍历。 循环计数为零，所以答案是`1`。 这可以防止仅触及路线的循环计数过多。 

最后，考虑通过桥连接的两个周期：```
cycle A -- bridge -- cycle B
```任何穿过图的路径必须在循环 A 中选择一个方向，并在循环 B 中独立选择一个方向。块树路径包含两个循环节点，给出`2^2 = 4`。 乘法结构直接源自仙人掌的循环永不重叠的特性。
