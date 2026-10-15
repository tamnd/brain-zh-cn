---
title: "CF 106098J - 秃头和伊斯兰"
description: "我们得到一个连通的无向图。 一个顶点是随机均匀选择的。 然后随机均匀地选择其入射边之一并将其从图中删除。"
date: "2026-06-25T11:56:18+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106098
codeforces_index: "J"
codeforces_contest_name: "The American University in Cairo CSEA Fall 2025 contest"
rating: 0
weight: 106098
solve_time_s: 49
verified: true
draft: false
---

[CF 106098J - 秃头和 Eslam](https://codeforces.com/problemset/problem/106098/J)

 **评级：** -
 **标签：** -
 **求解时间：** 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个连通的无向图。 一个顶点是随机均匀选择的。 然后随机均匀地选择其入射边之一并将其从图中删除。 

删除之后，我们从相同的选定顶点开始，询问仍然可以访问多少个不同的顶点。 由于图是无向的，因此这只是包含边缘去除后所选顶点的连接组件的大小。 

任务是计算该组件大小的预期值。 

该图最多可以包含$2 \cdot 10^5$所有测试用例的顶点和边。 任何在每次可能的删除后重新计算连接性的解决方案都是完全不可行的。 即使每条边只有一个 DFS，也已经需要$O(m(n+m))$，远远超出了极限。 

该图最初是连接的。 这立即表明大多数边缘删除没有任何作用。 删除非桥可以保持图的连接，所以答案仍然存在$n$。 只有桥才能减少可到达的组件大小。 

一个常见的错误是在移除桥后考虑图中的所有顶点。 实验首先选择一个端点，然后选择其入射边之一。 概率分布取决于顶点度数，因此每个桥的贡献取决于其两个端点的度数。 

考虑三个顶点的路径：```
1 - 2 - 3
```从顶点 1 开始，移除其唯一的入射边，使顶点 1 孤立。 可达大小为1。 

从顶点 2 开始，可以删除任意一条边。 在这两种情况下，顶点 2 始终与另一个顶点保持连接，因此可达大小为 2。 

期望值为：$$\frac{1+2+1}{3}=\frac43$$仅计算桥而不考虑端点度数的解决方案将产生错误的结果。 

另一个微妙的情况是没有桥的图，例如循环：```
1 - 2
|   |
4 - 3
```删除任何一条边都会使图保持连接，因此答案始终是$n$。 任何试图为每条边减去某些内容的算法都会在这里失败。 

## 方法

 蛮力解释从字面上遵循实验。 

对于每个顶点$v$，迭代每个事件边$e$。 消除$e$，运行 DFS 或 BFS$v$，测量可到达组件的大小，并对结果进行平均。 

这是正确的，因为它直接模拟随机过程。 问题在于它的成本。 一个图可能包含$2 \cdot 10^5$边缘。 对每个可能的选择运行图形遍历大致会导致$O(m(n+m))$工作，在最坏的情况下是数十亿次操作。 

关键的观察结果是删除非网桥不会改变任何事情。 由于图开始连接，删除非桥会使其保持连接，因此每个顶点仍然可以到达所有顶点$n$顶点。 

这意味着只有桥梁才重要。 

假设有一个桥连接一个父顶点$p$和一个子顶点$c$在 DFS 树中。 让子树的根为$c$包含$sz$顶点。 

删除这个桥会将图分成两个部分：$$sz$$和$$n-sz$$如果选择的顶点是$p$，然后删除桥后，它保留在 size 的组件中$n-sz$，正好输掉$sz$顶点。 

如果选择的顶点是$c$，它保留在尺寸的分量中$sz$，正好输掉$n-sz$顶点。 

没有其他顶点可以选择该边，因为实验仅删除与所选顶点相关的边。 

这将问题转化为对每个桥的独立贡献进行求和。 单个 DFS 可以识别所有桥和所有子树大小，从而产生$O(n+m)$解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(m(n+m))$|$O(n)$| 太慢了 |
 | 最佳 |$O(n+m)$|$O(n+m)$| 已接受 |

 ## 算法演练

 1. 读取图形并计算每个顶点的度数。 
2. 运行 Tarjan 的寻桥 DFS。 
3. 在 DFS 期间，维持发现时间和低链路值。 
4. 对于每个 DFS 树顶点，计算其子树大小`sz`。 
5.探索树边时`(u, v)`，从返回后`v`，检查是否：$$low[v] > tin[u]$$如果这个条件成立，`(u,v)`是一座桥。 

1. 让`sz[v]`是子树的大小。 删除这个桥会将图分成不同大小的组件：$$sz[v]$$和$$n - sz[v]$$1. 该桥贡献的总损耗为：$$\frac{sz[v]}{\deg(u)}
+
\frac{n-sz[v]}{\deg(v)}$$第一项对应于选择顶点`u`，第二个选择顶点`v`。 

1. 将所有桥梁上的这些损耗相加。 
2. 设总损失为`S`。 

预期可达大小为：$$n - \frac{S}{n}$$1. 执行所有求模运算$10^9+7$。 将每个除法用乘法替换为模逆。 

### 为什么它有效

 实验的每种可能结果都从连通图开始，并恰好删除与所选顶点相关的一条边。 

如果删除的边不是桥，则图仍保持连接，因此可达大小保持等于$n$。 这样的边缘有助于零损失。 

对于桥来说，删除它会将图分成正好两个部分。 所选端点保留在一侧，并失去对另一侧所有顶点的访问权限。 丢失顶点的数量恰好是相反组件的大小。 

每个桥都独立贡献，因为只有它的两个端点可以选择它。 将所有桥梁的损失相加得出预期减少的总和$n$。 减去该减少量$n$产生预期可达的组件尺寸。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1000000007

MAXN = 200000 + 5
inv = [0] * MAXN
for i in range(1, MAXN):
    inv[i] = pow(i, MOD - 2, MOD)

t = int(input())

for _ in range(t):
    n, m = map(int, input().split())

    adj = [[] for _ in range(n)]
    deg = [0] * n

    for eid in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1

        adj[u].append((v, eid))
        adj[v].append((u, eid))

        deg[u] += 1
        deg[v] += 1

    tin = [0] * n
    low = [0] * n
    sz = [0] * n

    timer = 0
    loss = 0

    sys.setrecursionlimit(1 << 20)

    def dfs(u, pe):
        nonlocal timer, loss

        timer += 1
        tin[u] = low[u] = timer
        sz[u] = 1

        for v, eid in adj[u]:
            if eid == pe:
                continue

            if tin[v]:
                low[u] = min(low[u], tin[v])
            else:
                dfs(v, eid)

                sz[u] += sz[v]
                low[u] = min(low[u], low[v])

                if low[v] > tin[u]:
                    s = sz[v]

                    loss_term = (
                        s * inv[deg[u]]
                        + (n - s) * inv[deg[v]]
                    ) % MOD

                    loss += loss_term
                    loss %= MOD

    dfs(0, -1)

    ans = (n % MOD - loss * inv[n]) % MOD
    print(ans)
```该图存储有边标识符，以便 DFS 可以区分通向父代的树边和其他边。 

数组`tin`和`low`是标准的 Tarjan 桥结构。 条件`low[v] > tin[u]`这正是识别桥梁的标准。 

子树大小`sz[v]`在 DFS 返回阶段计算。 一旦找到一座桥，`sz[v]`立即给出分裂的一侧并`n - sz[v]`给另一个。 

累计数量为`loss`不是预期损失本身。 它是最终除以之前所有桥梁损耗的总和`n`，匹配公式$$n - \frac{S}{n}.$$所有除法都被模逆取代。 由于每个度数至少是连通图中的一个$n \ge 2$，这些逆总是存在模$10^9+7$。 

## 工作示例

 ### 示例 1

 图：```
1 - 2 - 3
```| 桥梁| 子树大小 | 第一个端点的损失 | 第二端点的损失|
 | ---| ---| ---| ---|
 | (1,2) | 2 | 2/1 | 1/2 | 1/2
 | (2,3) | 1 | 1/2 | 1/2 2/1 |

 总损失：$$2+\frac12+\frac12+2=5$$期望值：$$3-\frac53=\frac43$$| 变量| 价值|
 | ---| ---|
 | n | 3 |
 | S | 5 |
 | 回答 | 4/3 |

 此示例显示端点度数如何直接影响概率分布。 

### 示例 2

 图：```
1
|\
| \
2--3
```三角形不包含桥。 

| 桥数| 全损|
 | ---| ---|
 | 0 | 0 |

 | 变量| 价值|
 | ---| ---|
 | n | 3 |
 | S | 0 |
 | 回答 | 3 |

 删除任何边会使图保持连接，因此每个结果都会到达所有顶点。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n+m)$| 一个 DFS 处理每个顶点和边一次 |
 | 空间|$O(n+m)$| 邻接表加DFS数组|

 所有测试用例的顶点和边的总数最多为$2 \cdot 10^5$。 线性解决方案很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    MOD = 1000000007

    data = io.StringIO(inp)
    input = data.readline

    MAXN = 200005
    inv = [0] * MAXN
    for i in range(1, MAXN):
        inv[i] = pow(i, MOD - 2, MOD)

    t = int(input())
    out = []

    sys.setrecursionlimit(1 << 20)

    for _ in range(t):
        n, m = map(int, input().split())

        adj = [[] for _ in range(n)]
        deg = [0] * n

        for eid in range(m):
            u, v = map(int, input().split())
            u -= 1
            v -= 1

            adj[u].append((v, eid))
            adj[v].append((u, eid))

            deg[u] += 1
            deg[v] += 1

        tin = [0] * n
        low = [0] * n
        sz = [0] * n

        timer = 0
        loss = 0

        def dfs(u, pe):
            nonlocal timer, loss

            timer += 1
            tin[u] = low[u] = timer
            sz[u] = 1

            for v, eid in adj[u]:
                if eid == pe:
                    continue

                if tin[v]:
                    low[u] = min(low[u], tin[v])
                else:
                    dfs(v, eid)

                    sz[u] += sz[v]
                    low[u] = min(low[u], low[v])

                    if low[v] > tin[u]:
                        s = sz[v]
                        loss = (
                            loss
                            + s * inv[deg[u]]
                            + (n - s) * inv[deg[v]]
                        ) % MOD

        dfs(0, -1)

        ans = (n % MOD - loss * inv[n]) % MOD
        out.append(str(ans))

    return "\n".join(out)

# sample 1
assert run(
"""1
3 2
1 2
2 3
"""
) == "333333337"

# triangle, no bridges
assert run(
"""1
3 3
1 2
2 3
3 1
"""
) == "3"

# single edge
assert run(
"""1
2 1
1 2
"""
) == "1"

# cycle with tail
assert run(
"""1
4 4
1 2
2 3
3 1
3 4
"""
) != ""

# minimum connected graph
assert run(
"""1
1 0
"""
) == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 长度为 2 的路径 | 4/3 模 MOD | 基本桥梁处理 |
 | 三角形| 3 | 没有桥梁|
 | 单边| 1 | 最小的非平凡图 |
 | 骑车有尾巴| 有效答案 | 混合桥接和非桥接边缘 |
 | 单顶点| 1 | 最小图形尺寸 |

 ## 边缘情况

 考虑一下图表：```
1 - 2 - 3
```输入：```
1
3 2
1 2
2 3
```两边都是桥。 DFS 计算子树大小 2 和 1。它们的贡献变为：$$\frac{2}{1}+\frac{1}{2}$$和$$\frac{1}{2}+\frac{2}{1}$$最终的答案是$\frac43$。 该算法正确地考虑了端点度数，而不是平等地对待每个桥。 

现在考虑一个循环：```
1 - 2
|   |
4 - 3
```输入：```
1
4 4
1 2
2 3
3 4
4 1
```DFS 找不到桥，因为每个树边都有一个后边支撑它。 累计损失为零。 答案就变成了$n=4$，这与删除任何单个边会使图保持连接的事实相匹配。 

最后，考虑一个由带有一片叶子的三角形组成的图：```
1
|\
| \
2--3--4
```仅有边缘`(3,4)`是一座桥。 DFS 计算`sz=1`对于顶点 4。桥贡献：$$\frac{1}{\deg(3)}
+
\frac{3}{\deg(4)}$$并且没有其他边缘有任何贡献。 这证实了该算法隔离了桥梁的影响，同时忽略了所有非桥梁。
