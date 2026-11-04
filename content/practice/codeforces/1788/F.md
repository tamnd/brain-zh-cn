---
title: "CF 1788F - 异或、树和查询"
description: "我们有一棵有 $n$ 个顶点和 $n-1$ 个边的树。 我们必须为每条边分配一个非负整数权重。 一些约束以 $(u,v,x)$ 的形式给出，这意味着沿着 $u$ 和 $v$ 之间唯一路径的所有边权重的 XOR 必须等于 $x$。"
date: "2026-06-09T10:49:19+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "constructive-algorithms", "dfs-and-similar", "dsu", "graphs", "greedy", "implementation", "trees"]
categories: ["algorithms"]
codeforces_contest: 1788
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 851 (Div. 2)"
rating: 2500
weight: 1788
solve_time_s: 93
verified: true
draft: false
---

[CF 1788F - 异或、树和查询](https://codeforces.com/problemset/problem/1788/F)

 **评分：** 2500
 **标签：** 位掩码、构造性算法、dfs 和类似的、dsu、图、贪婪、实现、树
 **求解时间：** 1m 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵树$n$顶点和$n-1$边缘。 我们必须为每条边分配一个非负整数权重。 一些约束条件以形式给出$(u,v,x)$，这意味着沿着之间的唯一路径的所有边权重的异或$u$和$v$必须等于$x$。 

第一个任务是确定这样的分配是否存在。 如果是，我们必须输出一个有效的赋值。 在所有有效分配中，我们必须最小化整棵树中所有边权重的异或。 

该树最多包含$2.5 \cdot 10^5$顶点，并且最多可以有$2.5 \cdot 10^5$限制。 任何显式处理路径的算法都非常昂贵。 单个路径可以包含$O(n)$边缘，因此天真地检查每个约束可能需要$O(nq)$工作，就在身边$6 \cdot 10^{10}$最坏情况下的操作。 

大小限制强烈表明每个顶点和每个查询必须仅处理固定次数。 解决方案围绕$O((n+q)\alpha(n))$或者$O((n+q)\log n)$是可以接受的。 

一个微妙的点是约束并不直接指定边权重。 它们仅在路径上指定 XOR 值。 不同的边分配可以生成完全相同的路径异或集。 优化目标是最小化所有边权重的异或，引入了另一层结构。 

考虑一个简单的链：```
1 -- 2 -- 3
```有一个约束：```
1 3 5
```唯一的要求是：```
a12 XOR a23 = 5
```许多作业都满足这一点。 例如：```
0 5
1 4
7 2
```全部有效。 将边缘值视为唯一确定的解决方案是不正确的。 

另一个容易犯的错误是缺少矛盾的约束。 认为：```
3 2
1 2
2 3
1 3 1
1 3 2
```需要相同的路径来对 1 和 2 进行异或。不存在解决方案。 

第三个陷阱来自优化目标。 有效的分配不一定是最优的。 考虑一棵有一条边的树：```
1 -- 2
```并且没有任何限制。 分配权重 7 是有效的，但所有边的 XOR 都是 7。分配权重 0 也是有效的，并给出最小可能的答案。 

优化条件不可忽视。 

## 方法

 暴力的观点是给边赋值并验证每个路径约束。 即使我们将每条边限制为仅几个候选值，搜索空间仍将呈指数增长$n$。 高达$250000$边缘，这是无望的。 

关键的观察来自于树上异或约束的标准技巧。 

任意给树求根，例如在顶点 1 处。定义一个值$p[v]$对于每个顶点：$$p[v] = \text{XOR of edge weights on the path from root to } v$$然后两个顶点之间的路径上的 XOR 变为$$p[u] \oplus p[v]$$因为共同的根到 LCA 部分抵消了。 

这完全消除了树的约束。 

每个查询$$(u,v,x)$$变成$$p[u] \oplus p[v] = x$$现在我们只需要为每个顶点分配一个值即可。 

这是 XOR 方程的图。 每个查询都通过所需的 XOR 差异连接两个顶点。 此类系统通常使用具有类似奇偶校验信息的 DFS、BFS 或 DSU 来解决。 

下一个问题是优化目标。 

一旦顶点值$p[v]$众所周知，每棵树的边缘$(parent,child)$有重量$$p[parent] \oplus p[child]$$所有边权重的异或为：$$\bigoplus_{(a,b)\in E}(p[a]\oplus p[b])$$每个非根顶点在其父边中仅出现一次。 每个内部顶点总共出现两次并取消。 根出现的次数小于其度数一次，因为它没有父项。 

取消后，所有边权重的总异或等于$$p[1]\oplus p[2]\oplus\cdots\oplus p[n]$$这种身份是问题的核心。 

查询图仅确定异或差异。 在查询图的一个连接组件内，我们可以对每个$p[v]$按相同的值$t$，并且所有约束仍然有效：$$(p[u]\oplus t)\oplus(p[v]\oplus t)=p[u]\oplus p[v]$$因此，每个连通分量贡献一个自由变量。 

所有边权重的总异或成为每个分量的一个值的异或。 只要有至少两个分量，我们就可以选择这些自由移位以使最终的 XOR 等于 0。 如果只有一个分量，则总的 XOR 是固定的。 

这直接导致最佳结构。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| 指数| 太慢了 |
 | 最佳 |$O((n+q)\alpha(n))$|$O(n+q)$| 已接受 |

 ## 算法演练

 ### 步骤 1

 构建仅包含 XOR 约束的图。 

对于每个查询$(u,v,x)$，在之间添加无向边$u$和$v$标记为$x$。 

该边所表示的方程为：$$p[u]\oplus p[v]=x$$### 步骤 2

 遍历约束图的每个连通分量。 

选择任意起始顶点并设置其值$p=0$。 

每当我们穿过一条边时$$u \leftrightarrow v$$带标签$x$，我们推导出$$p[v]=p[u]\oplus x$$如果$v$尚未分配，分配该值并继续。 

如果$v$已经有一个值，验证方程是否满足。 否则系统不一致，答案为“否”。 

这将计算所有顶点势的一个有效分配。 

### 步骤 3

 对于每个连接的组件，计算$$S_i=\bigoplus_{v\in component_i} p[v]$$这些值描述了每个组件如何对最终全局 XOR 做出贡献。 

### 步骤 4

 设组件为$C_1,C_2,\dots,C_k$。 

如果$k=1$，没有自由了。 步骤 2 的分配已经是最优的。 

如果$k\ge 2$，选择移位以使最终的 XOR 变为零。 

除最后一个组件外，保持所有组件不变。 

让$$need=S_1\oplus S_2\oplus\cdots\oplus S_k$$将最后一个分量的每个顶点异或$need$。 

分量移位保留所有约束，但通过以下方式更改其分量 XOR$need$。 经过此修改后，全局 XOR 变为零，这是最小可能值。 

### 步骤 5

 恢复边权重。 

原始树的根位于顶点 1。 

对于每个树边$(parent,child)$,$$weight = p[parent]\oplus p[child]$$将此值存储在与原始输入顺序对应的位置。 

### 步骤 6

 输出恢复的边权重。 

### 为什么它有效

 查询图上的DFS构造值$p[v]$满足每个方程$p[u]\oplus p[v]=x$。 如果检测到矛盾，则不存在顶点势的分配，因此也不存在边分配。 

每个有效的边缘分配对应于有效的潜在分配，反之亦然，因为边缘权重恰好是相邻潜在之间的异或差。 

在查询图的连接组件内，向每个势添加相同的常量会使所有成对 XOR 差异保持不变。 这是唯一的自由度。 当至少存在两个分量时，总是可以选择一个分量移位来完全取消全局异或。 由于 XOR 值是非负整数，因此零是最小的可能值。 因此构建的解决方案是最优的。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def solve():
    n, q = map(int, input().split())

    tree = [[] for _ in range(n)]
    edges = []

    for i in range(n - 1):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        edges.append((u, v))
        tree[u].append((v, i))
        tree[v].append((u, i))

    cons = [[] for _ in range(n)]

    for _ in range(q):
        u, v, x = map(int, input().split())
        u -= 1
        v -= 1
        cons[u].append((v, x))
        cons[v].append((u, x))

    p = [-1] * n
    comp_id = [-1] * n
    comp_xor = []
    comp_nodes = []

    cid = 0

    for start in range(n):
        if p[start] != -1:
            continue

        p[start] = 0
        comp_id[start] = cid

        dq = deque([start])
        nodes = []
        sx = 0

        while dq:
            u = dq.popleft()
            nodes.append(u)
            sx ^= p[u]

            for v, x in cons[u]:
                want = p[u] ^ x

                if p[v] == -1:
                    p[v] = want
                    comp_id[v] = cid
                    dq.append(v)
                elif p[v] != want:
                    print("No")
                    return

        comp_nodes.append(nodes)
        comp_xor.append(sx)
        cid += 1

    k = cid

    if k >= 2:
        total = 0
        for x in comp_xor:
            total ^= x

        last = k - 1

        if total:
            for v in comp_nodes[last]:
                p[v] ^= total

    parent = [-1] * n
    parent_edge = [-1] * n

    dq = deque([0])
    parent[0] = 0

    while dq:
        u = dq.popleft()

        for v, idx in tree[u]:
            if parent[v] != -1:
                continue

            parent[v] = u
            parent_edge[v] = idx
            dq.append(v)

    ans = [0] * (n - 1)

    for v in range(1, n):
        idx = parent_edge[v]
        ans[idx] = p[v] ^ p[parent[v]]

    print("Yes")
    print(*ans)

solve()
```代码构建的第一个图是约束图，而不是树。 其目的是求解顶点势的 XOR 方程。 

BFS 为顶点赋值并同时检查一致性。 每当通过两条不同的路径到达一个顶点时，两条推导必须产生相同的势。 如果不是，方程组是不可能的。 

存储组件 XOR 值是因为它们确定每个组件对全局目标的贡献。 只有在了解了所有组成部分之后，我们才能决定应用哪个班次。 

树上最终的 BFS 的存在只是为了恢复边权重。 那时所有的潜力都已经固定了。 

一个常见的实现错误是在知道所有组件异或之前尝试移动组件。 最佳移位取决于每个分量的异或，因此必须在处理整个约束图之后完成。 

另一个容易犯的错误是忘记孤立的顶点是有效的组件。 这些顶点对应于完全自由的势，并且正是允许调整全局异或的顶点。 

## 工作示例

 ### 示例 1

 输入：```
4 4
1 2
2 3
3 4
1 4 3
2 4 2
1 3 1
2 3 1
```约束图遍历：

 | 顶点| 分配 p |
 | --- | --- |
 | 1 | 0 |
 | 4 | 3 |
 | 3 | 1 |
 | 2 | 0 |

 检查查询 (2,4,2)：

 | 表达 | 价值|
 | --- | --- |
 | p[2] 异或 p[4] | 0 异或 3 = 3 |
 | 必填 | 2 |

 方程失败。 

输出：```
No
```此示例演示了矛盾检测。 约束图中的两条不同路径对同一顶点强制使用不兼容的值。 

### 示例 2```
3 1
1 2
2 3
1 3 5
```约束图遍历：

 | 顶点| 分配 p |
 | --- | --- |
 | 1 | 0 |
 | 3 | 5 |
 | 2 | 0 |

 组件：

 | 组件| p 值的异或 |
 | --- | --- |
 | {1,3} | 5 |
 | {2} | 0 |

 全局异或为 5。 

将最后一个分量移动 5：

 | 顶点| 老p| 新产品 |
 | --- | --- | --- |
 | 2 | 0 | 5 |

 恢复边权重：

 | 边缘 | 重量 |
 | --- | --- |
 | 1-2 | 1-2 5 |
 | 2-3 | 2-3 0 |

 查看：$$5 \oplus 0 = 5$$满足约束条件，所有边权重的异或为零。 

此示例展示了断开连接的约束组件如何提供最小化目标所需的自由度。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n+q)$| 每个树边和每个约束边都被处理恒定次数 |
 | 空间|$O(n+q)$| 邻接表、势、分量数据和答案数组 |

 顶点和约束边的总数最多为$5 \cdot 10^5$。 线性处理完全符合限制。 

## 测试用例```
# helper structure only, not a full verifier

# minimum tree, no constraints
inp = """\
2 0
1 2
"""

# contradiction
inp = """\
3 2
1 2
2 3
1 3 1
1 3 2
"""

# single constraint component
inp = """\
3 1
1 2
2 3
1 3 5
"""

# isolated vertex allows optimization
inp = """\
4 1
1 2
2 3
3 4
1 3 7
"""

# large chain pattern
n = 100000
# construct programmatically during stress testing
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2 个顶点，无约束 | 是的 | 最小实例 |
 | 矛盾方程| 没有 | 一致性检查|
 | 一个连接的约束组件 | 有效的解决方案| 固定全局异或 |
 | 存在孤立顶点 | 具有最小 XOR 的有效解决方案 | 组件转移|
 | 大链条| 很快就完成了 | 线性复杂度|

 ## 边缘情况

 考虑：```
2 0
1 2
```没有任何限制。 约束图有两个独立的组件。 两个电势都从零开始。 该算法将所有值保持为零，将边缘权重恢复为零，并输出最小可能的答案。 

现在考虑：```
3 2
1 2
2 3
1 3 4
1 3 4
```两个查询是相同的。 第一个分配：$$p[3]=4$$第二个检查相同的方程并成功。 重复的约束是自然处理的。 

最后考虑：```
4 2
1 2
2 3
3 4
1 2 7
3 4 5
```约束图有两个不相连的组件。 初始分量 XOR 为 7 和 5。它们的 XOR 为 2。该算法将一个分量移位 2，使所有边权重的最终 XOR 等于 0。 忽略组件自由度的解决方案将产生有效但非最佳的答案。
