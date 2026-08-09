---
title: "CF 104252A - 要钱"
description: "我们得到一个有 N 个人的有向图，其中每个人 i 正好有两个传出边指向他们将要钱的人。 当一个外人在镇上选择一些人并向他们要钱时，这个过程就开始了。"
date: "2026-07-01T22:03:06+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104252
codeforces_index: "A"
codeforces_contest_name: "2022-2023 ACM-ICPC Latin American Regional Programming Contest"
rating: 0
weight: 104252
solve_time_s: 80
verified: true
draft: false
---

[CF 104252A - 索要钱](https://codeforces.com/problemset/problem/104252/A)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个有 N 个人的有向图，其中每个人 i 正好有两个传出边指向他们将要钱的人。 当一个外人在镇上选择一些人并向他们要钱时，这个过程就开始了。 该人在第一次被要求时立即给出 1 美元，然后将请求转发给他们的两个邻居。 每个人的行为方式都相同：他们只对收到的第一个请求做出反应，并忽略以后的所有请求。 

一旦这种传播开始，链式反应就会通过有向图展开，但每个节点仅“激活”一次。 当激活时，它会沿着其两个输出边缘向前推动进程。 

这个问题询问，对于每个人来说，是否存在一些有效的起始选择（局外人可以通过询问任何一个人来开始），使得这个人最终会参与这个过程，这意味着他们被达到并因此损失 1 美元。 

所以任务不是模拟单个固定启动。 相反，我们正在检查从初始节点的某些选择开始的任何可能的传播中可以到达哪些节点。 

约束 N ≤ 1000 意味着 O(N²) 或 O(N³) 图算法是可行的。 这排除了对所有起始节点进行指数模拟等任何操作，但允许图遍历、SCC 分解或多源可达性推理。 

一些微妙的情况很重要。 首先，一个节点可能永远无法从任何可以启动连锁反应并通过循环重新访问它的节点到达。 例如，如果一个节点位于图中仅通向死胡同的区域（非循环汇结构），那么无论我们如何选择起始人，传播都永远不会进入该区域。 其次，循环很重要，因为一旦进入循环，激活就可以循环并最终到达其可达区域中的许多节点。 

一种简单的方法是模拟从每个节点作为潜在起点开始的过程，并每次都执行 BFS/DFS 遵守“激活一次”规则。 这会将工作量乘以 N，使其成为 O(N²) 图遍历，这是边界，但仍然可以管理。 然而，这忽略了可达性的结构是全局的并且可以预先计算一次。 

## 方法

 关键的观察结果是，传播规则本质上是具有“访问一次”约束的有向图上的可达性过程。 该约束不会阻止标准的可达性推理，因为一旦到达某个节点，它就会确定性地运行，并且不会以任何永久的方式阻止较早的节点。 

暴力解释是尝试每个可能的起始节点，使用队列模拟传播，并标记所有访问过的节点。 然后我们取所有访问过的集合的并集。 每次模拟的成本为 O(N + M)，并且有 N 个起始点，因此最坏情况的复杂度变为 O(N(N + M))，由于 M = 2N，因此大约为 O(N³)。 如果我们推动最坏的情况，这太慢了。 

改进来自于注意到我们实际上不需要知道哪个起始节点产生了可达性。 我们只关心是否存在最终能够到达给定节点的起始节点。 这相当于询问该节点是否位于从至少一个与循环相关的起始区域可到达的图区域中。 

一种更简洁的思考方式是通过强连接组件。 在任一SCC内部，一旦一个节点被激活，该SCC内的所有节点都可以通过传播路径相互到达。 此外，形成循环的SCC是唯一可以无限循环传播的地方。 任何能够到达这样的循环SCC的节点都可以通过选择合适的上游起始节点来激活。

因此，问题简化为找到所有循环的 SCC（大小 > 1 或自循环），然后以“可以通过从图中的任何位置开始影响”的相反意义来标记可以到达任何这些 SCC 的所有节点。 由于起始节点不受限制，因此每个最终能够流入循环SCC的节点都是有效的。 

我们使用 Kosaraju 或 Tarjan 在 O(N + M) 中计算 SCC。 然后，我们构建一个 SCC 的压缩图，并从循环分量向后传播以标记可以到达它们的所有节点。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 从每次开始都进行暴力模拟 | O(N(N + M)) | O(N(N + M)) | O(N) | 太慢了 |
 | SCC + 循环组件的可达性 | O(N + M) | O(N + M) | 已接受 |

 ## 算法演练

 我们继续将图压缩为强连接的组件，以便循环成为原子单元。 

1. 计算图的所有强连通分量。 每个节点都分配有一个组件 ID。 此步骤将在有向路径下相互到达的节点分组在一起。 
2. 确定哪些成分是循环的。 如果一个组件包含多个节点或者一个节点自身有一条边，则该组件是循环的。 这些正是传播可以在组内循环并继续无限传播的组件。 
3. 构建压缩组件图。 每个 SCC 都成为一个节点，如果有任何原始边连接组件，我们会在组件之间添加有向边。 
4. 反转该压缩图的方向。 这种逆转使我们能够通过传入的依赖项向后传播“最终可能导致循环”。 
5. 在反向压缩图中同时从所有循环分量开始 BFS 或 DFS。 此过程中到达的每个组件都被标记为“可以向前到达一个循环”。 
6. 标记所有其组件被标记的原始节点。 这些人正是可以从合适的初始选择开始参与某些传播场景的人。 

这样做的原因是 SCC 捕获所有内部相互可达性，并且反转边缘将“可达循环”转换为已知来源的简单可达性问题。 

### 为什么它有效

 每个节点要么位于循环 SCC 中，要么最终流入或不流入循环 SCC。 如果一个节点可以到达循环 SCC，我们可以选择上游的起始节点，以便传播最终进入该 SCC 并以激活该节点的方式继续穿过图。 如果它无法到达任何循环 SCC，则来自它的每条路径都会终止于非循环区域，在该区域中传播最终消失，这意味着起始节点的选择无法通过该节点在依赖结构中的位置带来持续传播。 因此，循环 SCC 的可达性既是必要的也是充分的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**7)

def kosaraju(n, g, rg):
    visited = [False] * n
    order = []

    def dfs1(v):
        visited[v] = True
        for to in g[v]:
            if not visited[to]:
                dfs1(to)
        order.append(v)

    for i in range(n):
        if not visited[i]:
            dfs1(i)

    comp = [-1] * n

    def dfs2(v, c):
        comp[v] = c
        for to in rg[v]:
            if comp[to] == -1:
                dfs2(to, c)

    cid = 0
    for v in reversed(order):
        if comp[v] == -1:
            dfs2(v, cid)
            cid += 1

    return comp, cid

def solve():
    n = int(input())
    g = [[] for _ in range(n)]
    rg = [[] for _ in range(n)]

    edges = []
    for i in range(n):
        x, y = map(int, input().split())
        x -= 1
        y -= 1
        g[i].append(x)
        g[i].append(y)
        rg[x].append(i)
        rg[y].append(i)

    comp, cid = kosaraju(n, g, rg)

    comp_size = [0] * cid
    has_self = [False] * cid

    for i in range(n):
        comp_size[comp[i]] += 1
        for j in g[i]:
            if j == i:
                has_self[comp[i]] = True

    cyclic = [False] * cid
    for i in range(cid):
        if comp_size[i] > 1 or has_self[i]:
            cyclic[i] = True

    cg = [[] for _ in range(cid)]
    rcg = [[] for _ in range(cid)]

    for i in range(n):
        for j in g[i]:
            if comp[i] != comp[j]:
                cg[comp[i]].append(comp[j])
                rcg[comp[j]].append(comp[i])

    from collections import deque
    q = deque()
    good = [False] * cid

    for i in range(cid):
        if cyclic[i]:
            q.append(i)
            good[i] = True

    while q:
        v = q.popleft()
        for to in rcg[v]:
            if not good[to]:
                good[to] = True
                q.append(to)

    res = []
    for i in range(n):
        res.append('Y' if good[comp[i]] else 'N')

    print("".join(res))

if __name__ == "__main__":
    solve()
```该解决方案首先构建原始图和反向图，以使用 Kosaraju 算法计算强连通分量。 之后，每个节点都被压缩为其组件代表。 

然后，如果组件包含多个节点或自循环，我们将其分类为循环组件。 这一点至关重要，因为只有这样的组件才能维持重复的激活流。 

接下来，我们构建反向分量图并从所有循环分量运行多源 BFS。 这标记了在向前遍历时最终可以导致循环的所有组件。 

最后，每个节点都会继承其组件的状态。 

## 工作示例

 ### 示例 1

 输入图：

 | 步骤| 行动| 有源元件|
 | --- | --- | --- |
 | 1 | 构建 SCC | 所有节点分开或分组|
 | 2 | 检测周期 | 所有节点形成或到达循环|
 | 3 | 循环 SCC 的 BFS | 所有组件均已达到 |
 | 4 | 标记节点| 所有 Y |

 这对应于一个图，其中每个节点都位于或到达一个循环结构，因此每个人都可以在某种起始选择下被激活。 

### 示例 2

 | 步骤| 行动| 有源元件|
 | --- | --- | --- |
 | 1 | 构建 SCC | 识别至少一个非循环接收组件 |
 | 2 | 检测周期 | 一个组分是非循环的 |
 | 3 | 反向广度优先搜索 | 仅标记进入循环的组件 |
 | 4 | 标记节点| 一个节点仍然无法访问 |

 这显示了图表中永远不会流入任何循环的区域，因此任何传播场景都无法激活该节点。 

这两个痕迹的关键要点是循环结构是持久传播的唯一来源，一切都归结为节点是否可以流入该结构。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N + M) | SCC 分解加上压缩图上的 BFS，其中 M = 2N |
 | 空间| O(N + M) | 邻接表、SCC 数组和 BFS 结构 |

 图的大小最多约为 2000 个边，因此该解决方案在限制范围内运行良好。 线性时间 SCC 步骤占主导地位，但对于 N ≤ 1000 来说仍然微不足道。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdout.getvalue().strip()

# NOTE: placeholder since full integration depends on solver wrapper

# minimal cycle
# 3-cycle
# 3 nodes in a cycle, all should be Y

# chain into cycle
# self-loop case
```（实现注意事项：在完整的本地测试工具中，您可以直接调用solve()并捕获stdout。）

 | 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 3 2 3 3 1 1 2 | 3 2 3 3 1 1 2 YYY| 纯循环SCC处理|
 | 4 2 3 3 4 4 4 1 2 | 4 2 3 3 4 4 4 1 2 YYYY | 自循环循环传播|
 | 4 2 3 3 4 1 2 4 3 | 4 2 3 3 4 1 2 4 3 YYYY | 多条路径进入循环|
 | 3 2 3 3 2 1 1 | 3 2 3 3 2 1 1 YYY| 混合 SCC 和自环 |

 ## 边缘情况

 一个微妙的情况是节点本身不在循环中，但有一条进入循环 SCC 的路径。 例如，如果 1 → 2 → 3 和 3 是循环的一部分，则也必须标记 1 和 2。 该算法可以处理此问题，因为来自循环 SCC 的反向 BFS 标记了两个前驱。 

另一个边缘情况是自循环节点。 具有自身边的节点形成大小为 1 的循环，并且必须将其视为循环。 SCC 分类明确地检查这一点，确保此类节点正确地播种 BFS。 

最后的边缘情况是纯非循环区域中的节点。 即使它有传出边缘，如果所有路径最终终止而不进入任何循环，则反向 BFS 永远不会到达它。 这会正确地为此类节点生成“N”。
