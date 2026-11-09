---
title: "CF 2080A - 强大的连接性反击"
description: "给定一个有 n 个顶点和 m 个边的有向图。 任务是确定需要添加的最小边数以使图强连通。 如果从每个顶点到每个其他顶点都有一条有向路径，则图是强连接的。"
date: "2026-06-08T06:25:39+07:00"
tags: ["codeforces", "competitive-programming", "*special", "constructive-algorithms", "graphs"]
categories: ["algorithms"]
codeforces_contest: 2080
codeforces_index: "A"
codeforces_contest_name: "XIX Open Olympiad in Informatics - Final Stage, Day 2 (Unrated, Online Mirror, IOI rules)"
rating: 3200
weight: 2080
solve_time_s: 56
verified: true
draft: false
---

[CF 2080A - 强大的连接性反击](https://codeforces.com/problemset/problem/2080/A)

 **评分：** 3200
 **标签：** *特殊的、建设性的算法、图表
 **求解时间：** 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个有向图`n`顶点和`m`边缘。 任务是确定需要添加的最小边数以使图**强连接**。 如果从每个顶点到每个其他顶点都有一条有向路径，则图是强连接的。 

输入包括`n`和`m`， 其次是`m`表示顶点之间有向边的整数对。 输出是一个整数：实现强连接所需的最小边数。 

约束条件意味着`n`最多可达 10^5 并且`m`最多 10^5。 这排除了具有二次复杂度的算法，例如重复检查每个顶点的可达性。 我们需要一个线性或近线性的解决方案。 

边缘情况包括：

 - 已经强连接的图。 例如，有边的三角形`1→2`,`2→3`,`3→1`。 答案应该是`0`。 
- 具有孤立顶点的图。 例如，`n=3`并且没有边缘。 每个顶点都是其自己的强连通分量，因此必须添加多条边。 
- 具有单个顶点的图。 答案总是`0`与边缘无关。 

## 方法

 暴力方法会考虑每对顶点并检查它们之间是否存在路径。 对于一个图表`n`顶点，这可能需要`O(n^3)`使用 Floyd-Warshall 或从每个顶点重复 BFS/DFS 进行操作。 这对于`n=10^5`。 

关键见解来自**强连接组件 (SCC)**。 每个 SCC 内部都是强连接的。 SCC 的图形成有向无环图 (DAG)。 为了使原始图强连接，我们只需要将DAG中的SCC连接起来，使其成为单个SCC。 

让`sources`是没有传入边的 SCC 数量，并且`sinks`是没有传出边缘的 SCC 的数量。 那么，所需的最小边数为`max(sources, sinks)`。 这是可行的，因为每个源需要一个传入边缘，每个接收器需要一个传出边缘，并且 DAG 必须以循环方式连接。 

有效计算 SCC 的标准算法是 **Kosaraju 算法** 或 **Tarjan 算法**，两者都运行在`O(n + m)`时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^3) | O(n^3) | O(n^2) | O(n^2) | 太慢了 |
 | SCC+DAG分析| O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1.读取顶点数`n`和边缘`m`，并构造图的邻接表。 
2. 运行Kosaraju 算法来查找所有强连通分量。 这涉及记录完成时间的 DFS 遍、图形转置以及按完成时间相反顺序的 DFS。 
3. 构建 SCC 的压缩图，其中每个 SCC 都是一个节点，如果原始图中两个 SCC 之间存在边，则边存在。 
4. 计算没有传入边沿的 SCC 数量（`sources`）并且没有出边（`sinks`）。 
5.如果SCC的数量为1，则该图已经是强连通的。 否则，返回`max(sources, sinks)`。 

**为什么有效：** SCC 将图划分为无法进一步分解的组件。 连接 SCC DAG 中的源和接收器可确保每个组件都可以相互连接。 最大的源和接收器保证任何组件都不会保持断开连接。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**6)

def kosaraju_scc(n, adj):
    visited = [False] * n
    order = []

    def dfs(u):
        visited[u] = True
        for v in adj[u]:
            if not visited[v]:
                dfs(v)
        order.append(u)

    for u in range(n):
        if not visited[u]:
            dfs(u)

    transpose = [[] for _ in range(n)]
    for u in range(n):
        for v in adj[u]:
            transpose[v].append(u)

    comp_id = [-1] * n
    def dfs_rev(u, label):
        comp_id[u] = label
        for v in transpose[u]:
            if comp_id[v] == -1:
                dfs_rev(v, label)

    label = 0
    for u in reversed(order):
        if comp_id[u] == -1:
            dfs_rev(u, label)
            label += 1

    return comp_id, label

def main():
    n, m = map(int, input().split())
    adj = [[] for _ in range(n)]
    for _ in range(m):
        u, v = map(int, input().split())
        adj[u - 1].append(v - 1)

    comp_id, num_scc = kosaraju_scc(n, adj)
    if num_scc == 1:
        print(0)
        return

    in_deg = [0] * num_scc
    out_deg = [0] * num_scc
    for u in range(n):
        for v in adj[u]:
            if comp_id[u] != comp_id[v]:
                out_deg[comp_id[u]] += 1
                in_deg[comp_id[v]] += 1

    sources = sum(1 for deg in in_deg if deg == 0)
    sinks = sum(1 for deg in out_deg if deg == 0)
    print(max(sources, sinks))

if __name__ == "__main__":
    main()
```第一个 DFS 计算完成时间，第二个 DFS 在转置图上标记 SCC。 计算每个 SCC 的入度和出度可识别源和汇。 小心从 1 开始的输入； 我们将其转换为基于 0 的索引。 

## 工作示例

 **示例输入 1：**```
3 2
1 2
2 3
```| 步骤| 订单| 转置| comp_id | 来源 | 水槽|
 | --- | --- | --- | --- | --- | --- |
 | 免税店 | [0, 1, 2] | [[ ], [0], [1]] | [0,1,2]| 1 | 1 |

 说明：每个节点都是它自己的SCC。 节点 1 没有传入边（源），节点 3 没有传出边（汇）。 最小边数 = max(1, 1) = 1。 

**示例输入 2：**```
3 3
1 2
2 3
3 1
```| 步骤| 订单| 转置| comp_id | 来源 | 水槽|
 | --- | --- | --- | --- | --- | --- |
 | 免税店 | [0,1,2]| [[2]、[0]、[1]] | [0,0,0]| 0 | 0 |

 所有节点都位于一个 SCC 中。 不需要边缘。 输出为0。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | Kosaraju 的算法将所有顶点和边遍历两次。 |
 | 空间| O(n + m) | 邻接表和辅助数组：visited、order、comp_id。 |

 对于 n ≤ 10^5 和 m ≤ 10^5，这在 1-2 秒内即可轻松完成。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        main()
    return out.getvalue().strip()

# provided samples
assert run("3 2\n1 2\n2 3\n") == "1", "sample 1"
assert run("3 3\n1 2\n2 3\n3 1\n") == "0", "sample 2"

# custom cases
assert run("1 0\n") == "0", "single node"
assert run("4 0\n") == "4", "all isolated"
assert run("4 3\n1 2\n2 3\n3 4\n") == "1", "chain of nodes"
assert run("4 4\n1 2\n2 3\n3 4\n4 1\n") == "0", "already cyclic"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 0 | 1 0 0 | 单顶点情况 |
 | 4 0 | 4 | 多个孤立的顶点 |
 | 4 3 链条 | 1 | 连接链的最小边数 |
 | 4 4 周期 | 0 | 已经紧密相连 |

 ## 边缘情况

 对于具有多个孤立顶点的图，`n=4`,`m=0`，每个顶点都是它自己的 SCC。 我们有 4 个源和 4 个汇。 最大值 = 4，它正确给出了形成连接所有顶点的循环所需的边数。 

对于具有自循环的单个顶点，`n=1`,`m=1`，Kosaraju 识别出 1 个 SCC。 源和汇均为 0，按预期返回 0。 

该解决方案可以正确处理所有边界条件和异常拓扑。
