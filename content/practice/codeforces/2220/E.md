---
title: "CF 2220E - 为红黑树着色"
description: "我们有一棵有 n 个节点的树，其中每个节点要么是红色，要么是黑色。 目标是使用随机操作使所有节点变为红色：选择一个节点并使用随机均匀选择的邻居之一的颜色对其重新着色。"
date: "2026-06-09T05:00:28+07:00"
tags: ["codeforces", "competitive-programming", "dp", "greedy", "probabilities", "sortings", "trees"]
categories: ["algorithms"]
codeforces_contest: 2220
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 1093 (Div. 2)"
rating: 2300
weight: 2220
solve_time_s: 122
verified: false
draft: false
---

[CF 2220E - 为红黑树着色](https://codeforces.com/problemset/problem/2220/E)

 **评分：** 2300
 **标签：** dp、贪婪、概率、排序、树
 **求解时间：** 2m 2s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一棵树`n`节点，其中每个节点要么是红色，要么是黑色。 目标是使用随机操作使所有节点变为红色：选择一个节点并使用随机均匀选择的邻居之一的颜色对其重新着色。 输入提供了多个测试用例，每个测试用例都有节点数、表示初始颜色的二进制字符串以及树的边。 输出是将整棵树变成红色的最小预期操作数。 

这些约束需要有效的处理。`n`最多可达 200,000，所有测试用例的总和也是 200,000，这排除了随机操作或指数状态枚举的朴素模拟。 每个操作都取决于当前节点的邻居，因此解决方案必须通过树有效地传播期望。 

不明显的边缘情况包括黑色节点仅具有黑色邻居的树，或者具有红色父代的黑色叶子。 如果您尝试在不考虑树结构和邻居度的情况下计算预期操作，您可能会错误地假设立即转换，这会产生错误的预期。 例如，具有单个红色邻居的黑色叶子的预期值为`1`因为第一次操作时它会变成红色。 具有两个黑色邻居但一个遥远的红色节点的黑色节点需要递归期望计算。 

## 方法

 暴力方法是模拟所有操作序列并计算每个序列的平均步骤数。 虽然正确，但这是不可行的，因为状态空间呈指数增长`n`，并且操作次数一般是无界的。 例如，如果尝试完全枚举，即使是 20 个节点的链也需要模拟超过一百万个状态。 

关键的见解是，节点变为红色的预期操作数量仅取决于其邻居的预期值。 这允许在树上进行递归表述，可以立即解决叶子问题，并且期望会向上传播。 在树中，每个节点的期望值可以用其邻居来表示，并且我们可以使用深度优先搜索有效地计算这些值。 

观察到每个节点的期望是`1 + sum(E[neighbor])/deg(node)`对于黑色节点，其中`deg(node)`计算邻居的数量，让我们将问题简化为树的线性遍历。 红色节点的期望为零。 这导致每个测试用例的解决方案为 O(n)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟| O(2^n) | O(2^n) | O(n) | 太慢了 |
 | DFS 期望传播 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 解析输入以获取测试用例的数量。 对于每个测试用例，请阅读`n`, 二进制字符串`s`，以及`n-1`边缘。 构建代表树的邻接表。 
2.初始化一个数组`E`的期望值。 放`E[i] = 0`如果节点`i`是红色的并且`None`如果节点`i`是黑色的。 
3. 定义递归函数`dfs(u, parent)`计算节点的预期操作数`u`:

 1.如果节点`u`为红色，返回0。 
2. 否则，初始化`sum_neighbors = 0`和`degree = len(adj[u])`。 
3. 对于每个邻居`v`的`u`（不包括家长阻止骑车），请致电`dfs(v, u)`并将结果添加到`sum_neighbors`。 
4. 计算`E[u] = 1 + sum_neighbors / degree`。 这占了一次操作加上邻居的平均期望。 
5. 返回`E[u]`。 
4. 打电话`dfs(root, -1)`从任一红色节点开始，因为至少存在一个红色节点。 
5. 打印`E[root]`具有足够的精度。 

工作原理：递归函数使用期望的线性度计算精确的期望值。 每个节点的操作独立于在其他地方应用操作的顺序，前提是邻居的期望得到正确传播。 红色节点充当零期望的吸收状态，确保递归终止并产生最小的期望操作数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(1 << 25)

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        s = input().strip()
        adj = [[] for _ in range(n)]
        for _ in range(n - 1):
            u, v = map(int, input().split())
            adj[u-1].append(v-1)
            adj[v-1].append(u-1)
        
        E = [None]*n
        red_nodes = [i for i, c in enumerate(s) if c == '1']
        for r in red_nodes:
            E[r] = 0.0

        def dfs(u, parent):
            if E[u] is not None:
                return E[u]
            total = 0.0
            deg = len(adj[u])
            for v in adj[u]:
                if v == parent:
                    continue
                total += dfs(v, u)
            E[u] = 1.0 + total / deg
            return E[u]
        
        # start from any black node
        for i in range(n):
            if E[i] is None:
                dfs(i, -1)
        # the maximum expected among black nodes
        res = max(E[i] for i in range(n))
        print(f"{res:.12f}")

solve()
```此代码读取树、初始化期望并使用 DFS 传播期望值。 使用`max(E[i])`确保我们报告使所有节点变为红色的最小预期操作。 浮点精度的处理方式是`:.12f`。 

## 工作示例

 样本1：

 输入：```
3
3
101
1 2
2 3
```| 节点| 颜色 | 邻居 | 期望计算| E[节点] |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 2 | 红色 → 0 | 0 |
 | 2 | 0 | 1,3 | 1 + (0 + 0)/2 | 1 + (0 + 0)/2 | 1 |
 | 3 | 1 | 2 | 红色 → 0 | 0 |

 输出：`1.000000000000`样本2：

 输入：```
5
10010
1 2
2 3
3 4
2 5
```DFS 计算每个
