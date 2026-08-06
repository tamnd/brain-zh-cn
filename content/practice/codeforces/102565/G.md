---
title: "CF 102565G - 傀儡师"
description: "我们有一棵有根的树。 每个顶点都拥有一个 1 到 N 之间的唯一数字，因此这些数字形成了顶点的排列。 对于每个顶点 v，我们只查看 v 子树内的顶点并收集它们的编号。 这些数字创建了几个最大连续范围。"
date: "2026-08-05T14:19:31+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102565
codeforces_index: "G"
codeforces_contest_name: "AGM 2020, Final Round, Day 2"
rating: 0
weight: 102565
solve_time_s: 117
verified: true
draft: false
---

[CF 102565G - 傀儡师](https://codeforces.com/problemset/problem/102565/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵有根的树。 每个顶点都拥有一个 1 到 N 之间的唯一数字，因此这些数字形成了顶点的排列。 对于每个顶点 v，我们只查看 v 子树内的顶点并收集它们的编号。 这些数字创建了几个最大连续范围。 任务是计算每个顶点的范围。 

例如，如果子树包含值`{2,3,4,8,10,11}`，紧凑区间是`[2,4]`,`[8,8]`， 和`[10,11]`，所以该子树的答案是 3。 

挑战来自于每个子树都需要这个答案。 当 N 达到 250000 并且所有测试的总大小达到 500000 时，重建每个顶点的值集是不可能的。 二次方法可以在链形树上执行大约 N2 的运算，这远远超出了两秒的限制。 我们需要一个接近线性或 N log N 的解。 

棘手的情况是由于紧凑间隔取决于相邻值而不是直接取决于树结构这一事实引起的。 单个插入值可以合并两个现有间隔或创建一个新间隔。 

考虑一棵有一个顶点的树：```
1
```有价值`1`。 答案是：```
1
```计算相邻对而不是最大范围的解决方案将会失败，因为单个值仍然是一个紧凑的区间。 

另一个案例：```
1
|
2
```具有值：```
[2,3]
```顶点 1 的子树包含`{2,3}`，所以答案是`1`。 只检查每个值是否有后继者的粗心实现会错过这一点`[2,3]`是一个完整的区间。 

最后一个重要的案例是合并：```
values = {1,3}
```有两个区间，`[1,1]`和`[3,3]`。 增加价值`2`将答案从 2 更改为 1，因为新值连接了两边。 任何仅计算新孤立值的更新公式都是不正确的。 

## 方法

 直接的方法是独立处理每个子树。 对于每个顶点，我们收集其下方的所有值，对它们进行排序，并计算连续数字之间的间隔。 这是正确的，因为紧凑间隔正是连续值相差 1 的最大组。 

然而，在链树中，根子树包含 N 个顶点，下一个子树包含 N-1 个顶点，依此类推。 对每个子树进行排序大致得出：```
N + (N-1) + ... + 1 = O(N²)
```甚至在考虑排序成本之前就已经处理了值。 

关键的观察是我们不需要整个排序集。 当我们将值 x 插入维护集中时，只有 x-1 和 x+1 的存在才重要。 

如果两个邻居都不存在，则 x 创建一个新间隔。 

如果存在一个邻居，则 x 延长现有间隔。 

如果两个邻居都存在，则 x 将两个区间合并为一个。 

因此，在遍历子树时可以动态维护紧凑区间的数量。 

为了有效地回答所有子树查询，我们使用树上的 DSU 技术，也称为从小到大合并。 对于每个顶点，我们保留最大的子顶点的数据结构并重用它。 较小的子子树被临时添加到该结构中。 由于每个顶点在结构之间仅移动 O(log N) 次，因此总工作量为 O(N log N)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(N² log N) | O(N² log N) | O(N) | 太慢了 |
 | 树上的 DSU | O(N log N) | O(N log N) | O(N) | 已接受 |

 ## 算法演练

 1. 以顶点 1 为树根并计算每个子树的大小。 在此 DFS 期间，存储每个顶点的重子节点，即具有最大子树的子节点。 
2. 使用DSU on tree 遍历树。 首先处理每个轻子，之后不保留其数据。 然后处理重子项，同时保持其维护集。 
3. 处理完重子树后，将轻子子树中的所有顶点和当前顶点添加到维护集中。 间隔计数器的当前值现在代表该子树的答案。 
4. 将当前计数器保存为该顶点的答案。 如果该子树未标记为保留，则从维护的结构中删除其所有顶点，以便父调用可以正确继续。 

维护的不变量是活动集始终包含属于当前处理的 DSU 子树的顶点。 间隔计数器仅通过添加或删除一个值引起的局部更改进行更新，因此它始终等于该集合中紧凑间隔的数量。 

当插入x时，变化为：```
+1 - (x-1 exists) - (x+1 exists)
```删除x时，逆变化为：```
-1 + (x-1 exists) + (x+1 exists)
```这些公式涵盖了所有情况，包括拆分和合并间隔。 

## Python 解决方案```python
import sys
sys.setrecursionlimit(1 << 20)

input = sys.stdin.readline

def solve():
    n = int(input())
    val = [0] + list(map(int, input().split()))

    g = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        a, b = map(int, input().split())
        g[a].append(b)
        g[b].append(a)

    size = [1] * (n + 1)
    heavy = [0] * (n + 1)
    parent = [0] * (n + 1)

    def dfs(v, p):
        parent[v] = p
        best = 0
        for u in g[v]:
            if u == p:
                continue
            dfs(u, v)
            size[v] += size[u]
            if size[u] > best:
                best = size[u]
                heavy[v] = u

    dfs(1, 0)

    tin = [0] * (n + 1)
    tout = [0] * (n + 1)
    order = []

    def euler(v, p):
        tin[v] = len(order)
        order.append(v)
        for u in g[v]:
            if u != p:
                euler(u, v)
        tout[v] = len(order)

    euler(1, 0)

    present = [False] * (n + 2)
    ans = [0] * (n + 1)
    current = 0

    def add_vertex(v):
        nonlocal current
        x = val[v]
        current += 1
        if present[x - 1]:
            current -= 1
        if present[x + 1]:
            current -= 1
        present[x] = True

    def remove_vertex(v):
        nonlocal current
        x = val[v]
        present[x] = False
        current -= 1
        if present[x - 1]:
            current += 1
        if present[x + 1]:
            current += 1

    def add_subtree(v):
        for i in range(tin[v], tout[v]):
            add_vertex(order[i])

    def remove_subtree(v):
        for i in range(tin[v], tout[v]):
            remove_vertex(order[i])

    def dfs2(v, p, keep):
        for u in g[v]:
            if u != p and u != heavy[v]:
                dfs2(u, v, False)

        if heavy[v]:
            dfs2(heavy[v], v, True)

        for u in g[v]:
            if u != p and u != heavy[v]:
                add_subtree(u)

        add_vertex(v)
        ans[v] = current

        if not keep:
            remove_subtree(v)

    dfs2(1, 0, True)

    print(*ans[1:])

t = int(input())
for _ in range(t):
    solve()
```第一个 DFS 计算子树大小并识别重子树。 第二个 DFS 是 DSU-on-tree 遍历。 这`present`数组存储某个值当前是否位于活动子树内。 

间隔计数器在更改之前更新`present[x]`在插入期间，因为旧的邻居描述了现有的间隔。 在删除过程中，首先删除该值，然后检查邻居，因为该值本身不能再被视为存在。 

Python 整数是任意精度的，因此不需要溢出处理。 递归限制增加，因为一棵树可以是深度为 N 的链。欧拉阶允许通过迭代一个连续的段来添加或删除整个子树。
