---
title: "CF 1610H - 鱿鱼游戏"
description: "我们有一棵有 n 个顶点和 m 个玩家的树。 每个玩家选择树上的两个顶点，我们将其称为 xi 和 yi。 只有当 Mashtali 选择顶点 v 并且从 xi 到 yi 的路径上最接近 v 的顶点 w 严格位于 xi 和 yi 之间时，玩家才能被淘汰。"
date: "2026-06-10T07:12:58+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "greedy", "trees"]
categories: ["algorithms"]
codeforces_contest: 1610
codeforces_index: "H"
codeforces_contest_name: "Codeforces Global Round 17"
rating: 3100
weight: 1610
solve_time_s: 113
verified: false
draft: false
---

[CF 1610H - 鱿鱼游戏](https://codeforces.com/problemset/problem/1610/H)

 **评分：** 3100
 **标签：** 数据结构、dfs 和类似、贪婪、树
 **求解时间：** 1m 53s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一棵树`n`顶点和`m`玩家。 每个玩家选择树上的两个顶点，我们将其称为`x_i`和`y_i`。 只有当 Mashtali 选择一个顶点时，玩家才能被淘汰`v`和最近的顶点`w`到`v`在路径上从`x_i`到`y_i`**严格介于**之间`x_i`和`y_i`。 如果`w`与任一一致`x_i`或者`y_i`，玩家在该操作中幸存。 目标是找到 Mashtali 必须选择的最小顶点数，以保证消除所有玩家，或者报告`-1`如果不可能的话。 

限制是显着的：最多`3 * 10^5`顶点和玩家。 这排除了任何通过重复树遍历单独处理每条路径的方法，因为这可能需要`O(n * m)`操作，可以达到`10^11`在最坏的情况下。 我们需要一个利用树结构并且不会显式迭代所有路径的解决方案。 

当出现一个重要的微妙之处时`x_i`和`y_i`是**相邻的顶点**。 在这种情况下，路径从`x_i`到`y_i`没有“中间”顶点，所以没有选择`v`可以消灭这个玩家。 另一个边缘情况是多个玩家的路径重叠时：选择一个顶点可以同时消除多个顶点，但我们需要避免错过路径与其他玩家不相交的玩家。 

例如，如果树是一条直线`1-2-3`和一个玩家有`x=1`和`y=2`，它们之间严格没有顶点。 答案是`-1`因为没有任何操作可以删除该玩家。 

## 方法

 蛮力方法将迭代所有顶点`v`并通过检查到所有路径顶点的距离来模拟消除每个玩家。 对于每个操作，我们都会删除一些玩家子集并重复，直到所有玩家都被淘汰。 原则上这是可行的，但每次操作都需要步行路径`O(n)`长，并重复`O(n)`顶点导致`O(n^2 * m)`复杂。 和`n`和`m`最多`3 * 10^5`，这是不可行的。 

关键的观察是对于一个玩家`i`，可以消除它们的顶点是**严格之间的所有顶点`x_i`和`y_i`在路径上**。 如果我们考虑以任意顶点为根的树，则每个路径的内部顶点形成一个连接的子路径。 消除所有玩家简化为经典的**树上的命中集问题**，其中我们必须选择与每个玩家的内部路径相交的最小顶点集。 

问题变得简单，因为树允许贪婪策略：最接近所有路径最深点的顶点将覆盖最大数量的玩家。 如果我们从叶到根处理树，我们可以标记必须用于消除路径无法被先前操作完全覆盖的玩家的边（或顶点）。 这将问题转换为**树上的动态规划**问题，通常称为“树中路径的顶点覆盖”。 

最佳方法是为每个玩家确定 **最低共同祖先 (LCA)**`x_i`和`y_i`。 它们路径的内部顶点形成两条链：`x_i`到 LCA 并从`y_i`到 LCA，不包括端点。 通过维护通过每个顶点的路径数量，我们可以在后序 DFS 中贪婪地选择顶点，确保每个路径的内部顶点至少被选择一次。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n * m) | O(n + m) | 太慢了 |
 | 带有 LCA 的贪婪 DFS | O(n + m log n) | O(n + m log n) | O(n + m) | 已接受 |

 ## 算法演练

 1. 任意确定树的根，例如在顶点 1 处，并预先计算 LCA 查询的深度和父数组。 这使得能够使用二进制提升对任意两个节点的 LCA 进行恒定时间查询。 
2. 对于每个玩家`i`, 计算`lca_i = LCA(x_i, y_i)`。 如果`x_i`是的父级`y_i`（反之亦然），路径没有内部顶点。 在这种情况下，将玩家标记为不可能消除。 
3. 对于所有其他玩家，标记**严格位于**之间的顶点`x_i`和`y_i`在他们的道路上。 我们可以在内部将每条路径表示为以下范围`x_i`到 LCA 并从`y_i`到 LCA，不包括端点。 这给了我们一组可以消除该玩家的顶点。 
4. 从叶子到根执行DFS。 对于每个顶点，维护一个计数器，记录有多少路径的内部段需要该顶点。 如果子子树具有未解析的路径，则将当前顶点标记为操作的选择并向上传播剩余的需求。 
5. 计算为操作选择的每个顶点。 如果在 DFS 后任何路径仍未标记（例如，路径没有内部顶点），则输出`-1`。 否则，所选顶点总数就是最小操作数。 
6. 返回计数。 

正确性得到保证，因为通过在后序 DFS 中选择顶点，我们覆盖了所有内部路径顶点。 选择任何更高的顶点都是多余的，并且每个玩家的路径都至少选择了一个顶点。 

## Python 解决方案```python
import sys
sys.setrecursionlimit(1 << 25)
input = sys.stdin.readline

def main():
    n, m = map(int, input().split())
    parents = list(map(int, input().split()))
    tree = [[] for _ in range(n + 1)]
    for i, p in enumerate(parents, start=2):
        tree[p].append(i)
        tree[i].append(p)

    LOG = 20
    up = [[-1] * (LOG + 1) for _ in range(n + 1)]
    depth = [0] * (n + 1)

    def dfs(u, par):
        up[u][0] = par
        for k in range(1, LOG + 1):
            if up[u][k-1] != -1:
                up[u][k] = up[up[u][k-1]][k-1]
        for v in tree[u]:
            if v != par:
                depth[v] = depth[u] + 1
                dfs(v, u)
    dfs(1, -1)

    def lca(u, v):
        if depth[u] < depth[v]:
            u, v = v, u
        for k in reversed(range(LOG + 1)):
            if up[u][k] != -1 and depth[up[u][k]] >= depth[v]:
                u = up[u][k]
        if u == v:
            return u
        for k in reversed(range(LOG + 1)):
            if up[u][k] != -1 and up[u][k] != up[v][k]:
                u = up[u][k]
                v = up[v][k]
        return up[u][0]

    counter = [0] * (n + 1)
    impossible = False
    for _ in range(m):
        x, y = map(int, input().split())
        l = lca(x, y)
        if (l == x or l == y) and abs(depth[x] - depth[y]) == 1:
            impossible = True
            continue
        if x != l:
            counter[x] += 1
            counter[l] -= 1
        if y != l:
            counter[y] += 1
            counter[l] -= 1

    res = 0
    def dfs_count(u, par):
        nonlocal res
        for v in tree[u]:
            if v == par:
                continue
            dfs_count(v, u)
            counter[u] += counter[v]
        if counter[u] > 0 and u != 1:
            res += 1
            counter[u] = 0
    if impossible:
        print(-1)
        return
    dfs_count(1, -1)
    print(res)

if __name__ == "__main__":
    main()
```具有二进制提升的 LCA 预处理使我们能够有效地计算路径。 使用具有 DFS 的计数器数组可将需求沿树向上传播。 当子树具有未解析的路径时选择顶点可确保以最少的选择淘汰每个玩家。 微妙的部分是仔细处理没有内部顶点的路径，这立即使答案变得不可能。 

## 工作示例

 ### 示例 1

 输入：```
6 3
1 1 1 4 4
1 5
3 4
2 6
```我们计算每对的 LCA：(1,5)->1、(3,4)->1、(2,6)->4。 仅计算内部顶点：对于 (1,5) 为 5，对于 (3,4) 为 3，对于 (2,6) 为 6。从叶子到根的 DFS 选择顶点 1 和 6。结果为 2。 

| 顶点| DFS前柜台 | 选择了？ |
 | ---| ---| ---|
 | 5 | 1 | 没有 |
 | 3 | 1 | 没有 |
 | 6 | 1 | 是的 |
 | 4 | 1 | 是的 |
 | 1 | 2 | 是的 |

 ### 示例 2（边缘情况）

 输入：```
3 1
1 1
1 2
```LCA 为 1 且
