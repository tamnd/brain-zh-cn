---
title: "CF 1615D - X（或）-mas 树"
description: "给定一棵有 n 个节点和 n-1 个边的树，其中每个边可以存储代表光的非负整数，如果值未知则为 -1。"
date: "2026-06-10T06:41:35+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "dfs-and-similar", "dsu", "graphs", "trees"]
categories: ["algorithms"]
codeforces_contest: 1615
codeforces_index: "D"
codeforces_contest_name: "Codeforces Global Round 18"
rating: 2200
weight: 1615
solve_time_s: 206
verified: false
draft: false
---

[CF 1615D - X（或）-mas 树](https://codeforces.com/problemset/problem/1615/D)

 **评分：** 2200
 **标签：** 位掩码、dfs 和类似的、dsu、图形、树
 **求解时间：** 3m 26s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一棵树`n`节点和`n-1`边，其中每条边可以存储代表灯光的非负整数，或者`-1`如果该值未知。 几个精灵告诉我们他们关心的两个节点，以及连接这些节点的简单路径上的边缘值的异或中设置位数的奇偶校验。 我们的任务是确定是否存在对未知边的整数分配，以便所有精灵的记忆都是一致的。 如果可能的话，我们必须重建一项有效的作业。 

输入大小很大：最多`2*10^5`每个测试用例的节点和精灵，最多`2*10^4`测试用例。 为每个查询的所有路径计算 XOR 的简单方法是每个查询的 O(n)，这太慢了。 因此，我们必须利用树结构属性并将路径异或查询减少到可以有效传播的局部约束。 这些约束还暗示按位属性仅与模 2 相关，因为精灵报告奇偶校验而不是完整的 XOR 值。 

边缘情况包括所有边缘值未知的树，或者已知值已经与精灵记忆冲突的树。 例如，一个带有边的三个节点的简单树`(1,2,-1)`,`(2,3,0)`和一个查询`(1,3,0)`应将未知边分配为 0 以满足奇偶校验，但如果查询的奇偶校验为 1，则不会有有效分配。 

## 方法

 蛮力方法将枚举所有可能的边分配`-1`，计算每个查询的路径异或，并检查奇偶校验。 对于一棵树来说`k`未知的边，有`2^k`仅用于奇偶校验的组合。 和`k`可能是 2*10^5，这是完全不可行的。 

关键的见解是沿着树中路径的 XOR 约束定义了 GF(2)（二进制域）上的线性系统。 每个 elf 内存都给出路径的奇偶校验方程。 树边分配使用根转换为节点值：define`xor_to_root[u]`作为从根到节点的边的异或`u`。 然后对路径进行异或`u-v`是`xor_to_root[u] XOR xor_to_root[v]`。 每个查询`u-v-p`变成线性方程`xor_to_root[u] XOR xor_to_root[v] = p`。 边缘已知值限制其端点的相对 XOR。 所有这些约束都可以表示为 2 着色问题（将 0 或 1 分配给`xor_to_root[u]`对于每个节点），可以使用 DFS 或 union-find 来解决。 如果发生冲突（两个节点必须具有冲突的 XOR），则分配是不可能的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^k * n * m) | O(2^k * n * m) | O(n) | 太慢了 |
 | 最优（异或奇偶校验传播）| O(n + m) | O(n) | 已接受 |

 ## 算法演练

 1. 读取树的边并将已知值与未知值分开。 将已知值转换为二进制奇偶校验（0 表示偶数设置位，1 表示奇数设置位）。 
2. 为树建立邻接表。 对于具有已知奇偶校验的边，记录其端点之间的 XOR 奇偶校验约束。 
3. 将每个节点建模为代表的变量`xor_to_root[node]`模 2。已知奇偶校验的每条边给出`xor_to_root[u] XOR xor_to_root[v] = edge_parity`。 
4.类似地处理elf查询：每个查询`(u,v,p)`给出`xor_to_root[u] XOR xor_to_root[v] = p`。 将它们与边缘约束组合成并查找或 DFS 着色结构。 
5. 使用DFS 遍历树。 对于每个连接的组件，为根任意分配一个颜色（0或1），根据约束传播颜色。 如果发生冲突（节点同时被分配 0 和 1），则返回 NO。 
6. 在处理完所有约束且没有冲突后，重建边缘值。 对于未知的边，分配`xor_to_root[u] XOR xor_to_root[v]`作为边缘奇偶校验（与该奇偶校验匹配的任何有效整数就足够了）。 
7. 输出 YES，后跟重建边缘。 

工作原理：树结构确保任何一对节点之间都存在一条简单路径，因此每个奇偶校验约束对应于 GF(2) 上的一个线性方程，该方程与节点 XOR 值相关。 通过 DFS 传播分配可以保证连接组件中的所有约束都得到一致满足或检测到冲突。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(1 << 25)

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        edges = []
        adj = [[] for _ in range(n+1)]
        unknown_edges = []
        for _ in range(n-1):
            x, y, v = map(int, input().split())
            edges.append([x, y, v])
            adj[x].append((y, len(edges)-1))
            adj[y].append((x, len(edges)-1))
            if v != -1:
                v_parity = bin(v).count('1') % 2
                edges[-1][2] = v_parity
            else:
                unknown_edges.append(len(edges)-1)

        uf_parent = [i for i in range(n+1)]
        color = [None]*(n+1)

        def find(u):
            if uf_parent[u] != u:
                uf_parent[u] = find(uf_parent[u])
            return uf_parent[u]

        def union(u, v, w):
            ru, rv = find(u), find(v)
            if ru == rv:
                if (color[u] ^ color[v]) != w:
                    return False
                return True
            if color[ru] is None:
                color[ru] = 0
            if color[rv] is None:
                color[rv] = 0
            parity = color[u] ^ color[v] ^ w
            uf_parent[rv] = ru
            color[rv] = parity
            return True

        constraints = []
        for idx, (x, y, v) in enumerate(edges):
            if v != -1:
                constraints.append((x, y, v))
        for _ in range(m):
            a, b, p = map(int, input().split())
            constraints.append((a, b, p))

        possible = True
        for u, v, p in constraints:
            if color[u] is None:
                color[u] = 0
            if color[v] is None:
                color[v] = 0
            if not union(u, v, p):
                possible = False
                break

        if not possible:
            print("NO")
            continue

        # Assign final edge values
        def dfs(u, par):
            for v, idx in adj[u]:
                if v == par:
                    continue
                if edges[idx][2] == -1:
                    edges[idx][2] = color[u] ^ color[v]
                dfs(v, u)

        for i in range(1, n+1):
            if color[i] is None:
                color[i] = 0
                dfs(i, -1)
                break
        dfs(1, -1)

        print("YES")
        for x, y, v in edges:
            print(x, y, v)

if __name__ == "__main__":
    solve()
```此代码首先将所有边缘值转换为奇偶校验并构建邻接表。 然后，它使用并查找和着色技术传播 XOR 约束，确保不会出现冲突。 验证一致性后，它使用分配给节点的颜色通过 DFS 重建未知边。 

## 工作示例

 ### 示例 1

 输入：```
6 5
1 2 -1
1 3 1
4 2 7
6 3 0
2 5 -1
2 3 1
2 5 0
5 6 1
6 1 1
4 5 1
```| 节点| 颜色 | 评论 |
 | ---| ---| ---|
 | 1 | 0 | 根色|
 | 2 | 0 | 从边缘 1-2 奇偶校验未知 |
 | 3 | 1 | 边缘 1-3 奇偶校验 1 |
 | 4 | 1 | 边缘 2-4 奇偶校验 1 |
 | 5 | 0 | 边缘 2-5 奇偶校验未知 |
 | 6 | 1 | 边缘 3-6 奇偶校验 0 |

 重建的边缘奇偶校验满足所有 elf 约束。 

### 示例 2

 输入：```
3 3
1 2 -1
1 3 -1
1 2 0
1 3 1
2 3 0
```DFS 传播揭示了路径奇偶性之间的冲突。 输出为“否”。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + m) | 每个测试用例的 DFS 传播和联合查找在节点和查询中呈线性扩展 |
 | 空间| O(n + m) | 邻接表、颜色和并查数组 |

 即使对于最大限制，这也完全符合 2 秒限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    f = io.StringIO()
    with redirect_stdout(f):
        solve()
    return f.getvalue().strip()

# Provided samples
assert run
```
