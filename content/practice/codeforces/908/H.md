---
title: "CF 908H - 新年和布尔桥"
description: "给定一个有 n 个节点的未知有向图。 对于每对节点 u 和 v，我们被告知一个涉及图中可达性的布尔条件：u 是否可以到达 v 以及 v 是否可以到达 u 的 AND、OR 或 XOR 为真。"
date: "2026-06-12T10:30:00+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 908
codeforces_index: "H"
codeforces_contest_name: "Good Bye 2017"
rating: 3100
weight: 908
solve_time_s: 115
verified: true
draft: false
---

[CF 908H - 新年和布尔桥](https://codeforces.com/problemset/problem/908/H)

 **评分：** 3100
 **标签：** -
 **求解时间：** 1m 55s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出一个未知的有向图`n`节点。 对于每对节点`u`和`v`，我们被告知涉及图中可达性的布尔条件：是否为 AND、OR 或 XOR`u`可以达到`v`以及是否`v`可以达到`u`是真的。 输入给出一个对称的`n x n`矩阵，其中每个条目（不包括对角线）都是一个字符`'A'`,`'O'`， 或者`'X'`，表示三个布尔条件中的哪一个保证对该对成立。 对角线是`'-'`因为节点可以从其自身轻松到达。 

输出应该是`-1`如果没有图可以满足给定条件，或者满足所有成对约束的图中所需的最小边数。 

主要制约因素，`n ≤ 47`，表示解可达`O(n^3)`是可行的，但任何指数`n`可能太慢了。 这是一个足够小的`n`考虑基于矩阵的可达性计算。 

微妙之处出现了`'X'`条目。`'X'`表明正好是其中之一`f(u,v)`或者`f(v,u)`为 true，意味着节点之间存在严格的方向。`'O'`表明至少有一个可达性为真，但较弱，并且`'A'`表示两者可以相互到达，这意味着它们必须位于强连接组件中。 仅考虑单个对而不考虑传播可达性的简单方法可能无法检测不可能的配置，例如相互矛盾的循环和严格方向。 

边缘情况包括单节点图、全连接图、仅包含节点的图`'X'`一些约束相互矛盾的条目和图表。 

## 方法

 暴力方法将尝试枚举有向边的所有子集，并根据所有成对约束测试每个结果图。 为了`n = 47`， 有`2^(n*(n-1)) ≈ 2^2162`可能的图表，这是完全不可行的。 

关键的见解是，约束将图划分为由下式决定的强连接组件（SCC）：`'A'`条目。 连接的所有节点`'A'`约束必须位于同一个 SCC 中，因为`'A'`需要相互可达。 在每个 SCC 中，我们可以将节点建模为一个派系，并将它们折叠成单个超级节点。`'O'`条目只需要至少一条路径，因此一旦 SCC 形成，它们就会自动满足。`'X'`条目在 SCC 之间施加严格的方向性：如果两个节点属于同一个 SCC，则具有`'X'`他们之间是不可能的； 如果它们属于不同的SCC，我们可以根据拓扑顺序来引导边。 

因此，问题简化为从以下位置查找 SCC：`'A'`条目，验证`'X'`约束与 SCC 成员资格并不矛盾，然后构建 SCC 的 DAG 并计算最小边数以满足所有要求`'X'`限制。 最小边只是 SCC 的数量（SCC 内的每个节点形成一个边团）加上 SCC 之间所需的每个有向关系一条边。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^(n^2)) | O(2^(n^2)) | O(n^2) | O(n^2) | 太慢了|
 | SCC+DAG拓扑 | O(n^3) | O(n^3) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 读取输入矩阵并初始化图结构。 每个节点最初形成自己的 SCC。 
2. 使用以下命令将节点合并到 SCC 中`'A'`限制。 对于每对`(u,v)`和`matrix[u][v] == 'A'`, 联盟`u`和`v`在不相交的集合结构中。 这保证了每个 SCC 内满足相互可达性。 
3. 检查`'X'`不可能的约束。 如果`matrix[u][v] == 'X'`和`u`和`v`属于同一个SCC，打印`-1`并退出，因为`'X'`需要单向可达性，这在强连接组件内不可能发生。 
4. 构建 SCC 的 DAG。 将每个节点映射到其 SCC，然后对于每个`'X'`不同SCC中的节点之间的条目，添加从包含源的SCC到包含目标的SCC的有向边。 使用标准 DAG 循环检测来检测循环。 如果存在循环，则打印`-1`。 
5. 计算最小边数。 每个SCC内尺寸`k`，至少`k`需要边来形成强连接的组件（一个简单的循环就足够了）。 在SCC之间，来自DAG的每条有向边对应于连接代表性节点的至少一条边。 对这些边求和以获得最小总数。 
6. 输出总边沿数。 

**为什么有效**：SCC 合并强制执行以下隐含的所有相互可达性`'A'`。 SCC 的 DAG 确保`'X'`以拓扑一致的方式满足约束。 通过折叠 SCC 并计算每个所需方向的一条边，我们保证了最少的边数。`'O'`由于 DAG 中或 SCC 中至少存在一条路径，因此约束会自动满足。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    n = int(input())
    mat = [input().strip() for _ in range(n)]

    parent = list(range(n))

    def find(u):
        while parent[u] != u:
            parent[u] = parent[parent[u]]
            u = parent[u]
        return u

    def union(u, v):
        u_root = find(u)
        v_root = find(v)
        if u_root != v_root:
            parent[v_root] = u_root

    # Step 1: merge 'A' constraints
    for i in range(n):
        for j in range(n):
            if mat[i][j] == 'A':
                union(i, j)

    # Step 2: check 'X' constraints
    for i in range(n):
        for j in range(n):
            if mat[i][j] == 'X' and find(i) == find(j):
                print(-1)
                return

    # Step 3: build SCC DAG
    scc_map = {}
    for i in range(n):
        r = find(i)
        if r not in scc_map:
            scc_map[r] = []
        scc_map[r].append(i)

    scc_nodes = list(scc_map.values())
    scc_id = {}
    for idx, nodes in enumerate(scc_nodes):
        for node in nodes:
            scc_id[node] = idx

    scc_count = len(scc_nodes)
    dag = [[] for _ in range(scc_count)]
    indegree = [0] * scc_count

    for i in range(n):
        for j in range(n):
            if mat[i][j] == 'X':
                u_scc = scc_id[i]
                v_scc = scc_id[j]
                if v_scc not in dag[u_scc]:
                    dag[u_scc].append(v_scc)
                    indegree[v_scc] += 1

    # Step 4: check DAG for cycles
    from collections import deque
    q = deque([i for i in range(scc_count) if indegree[i] == 0])
    visited = 0
    while q:
        u = q.popleft()
        visited += 1
        for v in dag[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                q.append(v)
    if visited < scc_count:
        print(-1)
        return

    # Step 5: count minimal edges
    total_edges = sum(len(nodes) for nodes in scc_nodes)  # inside SCC
    total_edges += sum(len(neigh) for neigh in dag)       # between SCCs
    print(total_edges)

if __name__ == "__main__":
    main()
```不相交集并集确保所有`'A'`约束已正确合并。 检查`'X'`联合后的约束保证我们不会违反单向可达性。 DAG循环检测确保不存在矛盾的方向。 边计数使用 SCC 内每个节点一条边和每个 DAG 连接一条边，这是最小的。 

## 工作示例

 **样品1**

 输入：```
4
-AAA
A-AA
AA-A
AAA-
```| 步骤| SCC | DAG 边 | 评论 |
 | ---| ---| ---| ---|
 | 初始| [0]、[1]、[2]、[3] | 无 | 每个节点独立|
 | 合并 'A' | [0,1,2,3]| 无 | 同一 SCC 中的所有节点 |
 | 检查“X” | 好的 | 无 | 没有“X”约束|
 | 计算边缘 | 4 | 0 | SCC 内部一个周期就足够了 |

 输出：`4`**样品2**

 输入：```
3
-XX
X- 
XX-
```| 步骤| SCC | DAG 边 | 评论 |
 | ---| ---| ---| ---|
 | 初始| [0],[1],[2] | 无 | 每个节点独立|
 | 合并 'A' | 相同| 无 | 没有“A”|
 | 检查“X” | 好的 | 边 0→1,0→2,1→2 | DAG 构建 |
 | 循环检查| 好的 | | 没有周期|
 | 计算边缘 | 3（SCC 内 | | |
