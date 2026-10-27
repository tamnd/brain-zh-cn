---
title: "CF 1413F - 道路和拉面"
description: "我们有一棵树，其中有 $n$ 个村庄，由 $n-1$ 条道路连接，每条道路要么是石头，要么是沙子。 每天，只有一条道路会改变其类型：石头变成沙子，或者沙子变成石头。"
date: "2026-06-11T07:24:38+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "trees"]
categories: ["algorithms"]
codeforces_contest: 1413
codeforces_index: "F"
codeforces_contest_name: "Technocup 2021 - Elimination Round 1"
rating: 2800
weight: 1413
solve_time_s: 107
verified: false
draft: false
---

[CF 1413F - 道路和拉面](https://codeforces.com/problemset/problem/1413/F)

 **评分：** 2800
 **标签：** 数据结构，树
 **求解时间：** 1m 47s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一棵树$n$连接的村庄$n-1$道路，每条路不是石头就是沙子。 每天，只有一条道路会改变其类型：石头变成沙子，或者沙子变成石头。 然后，鸣人和自来也选择一条简单的路径，使其上的石路数量为偶数，这样他们就可以吃到相同数量的拉面杯，并且路径的数量尽可能长。 对于每一天，我们必须输出道路翻转后该路径的最大长度。 

输入保证结构是树，因此任何两个节点之间都有唯一的简单路径。 限制很大：最多$5 \cdot 10^5$村庄和$5 \cdot 10^5$每日翻转。 任何解决方案$O(n)$每天的工作太慢了，因为$n \cdot m$的顺序是$2.5 \cdot 10^{11}$。 这排除了每次翻转后从头开始重新计算最长路径的情况。 我们需要一种在单条道路翻转时能够高效更新的解决方案。 

非明显的边缘情况包括线性链、星形或具有交替的石头/沙子图案的树木。 在所有长度相等的石头组成的链中，任何路径都会自动满足拉面奇偶条件。 翻转奇数长度链中的中心边缘可以减少最长有效路径长度，因此算法必须仔细跟踪奇偶校验分布。 

## 方法

 暴力方法试图通过生成所有可能的简单路径并检查哪些具有偶数个石头边缘来计算每天的最大路径。 在树上，简单路径的数量为$O(n^2)$。 对于每条路径，计算石头边缘需要最多$O(n)$运营。 这会产生最坏情况的复杂性$O(n^3)$，这对于$n$最多$5 \cdot 10^5$。 由于内存限制，即使显式存储所有路径也是不可能的。 

关键的观察结果是，沿着路径的石路的奇偶性可以简化为节点的两种颜色标记：考虑每个节点存储从固定根开始沿着路径的石头边缘的奇偶性。 当且仅当端点具有相同的奇偶性时，一条路径才有偶数条石路。 这允许我们将树划分为两组节点：奇偶校验 0 和奇偶校验 1。最长的有效路径是完全在奇偶校验 0 和奇偶校验 1 集合内的最长路径中较大的一个。 

翻转道路会更改由边分隔的两个子树之一中所有节点的奇偶性。 通过维护每个奇偶校验集中节点的深度并跟踪导出子树的直径，我们可以更新最大有效路径长度$O(\log n)$每次翻转使用线段树或链接切割树。 该问题简化为奇偶翻转的动态树直径问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^3) | O(n^3) | O(n^2) | O(n^2) | 太慢了 |
 | 最优（奇偶校验+动态树）| O((n + m) log n) | O((n + m) log n) | O(n) | 已接受 |

 ## 算法演练

 1. 以任意节点为树的根。 对于每个节点，计算沿着到根的路径的石头边缘的奇偶校验。 对于偶校验，该值存储为 0；对于奇校验，该值存储为 1。 
2. 计算每个奇偶校验集的初始直径。 直径是同一奇偶校验内任意两个节点之间的最长路径。 这可以使用两次 DFS 遍历来完成：首先查找奇偶校验集中最远的节点，第二次查找距该节点最远的节点。 
3. 对于每次翻转，识别被翻转的边缘。 确定由该边分隔的两个子树中的哪一个将切换其奇偶校验。 翻转该子树中所有节点的奇偶校验。 
4. 更新两个奇偶校验集的直径。 翻转的子树可以增加或减少任一奇偶校验集的直径。 可以使用欧拉游览表示与跟踪最大深度的线段树来完成有效的更新。 
5. 每次翻转后，答案是两个奇偶组的直径中的最大值。 输出这个值。 

工作原理：该算法保持每个节点都知道其当前相对于根的奇偶校验的不变式，并且奇偶校验 0 和奇偶校验 1 集合的直径始终反映可以选择的最长路径，其中 Naruto 和 Jiraiya 可以均匀地分割拉面。 翻转边缘恰好影响一个子树的奇偶校验，并相应地更新直径以确保正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(1 << 25)

n = int(input())
edges = []
tree = [[] for _ in range(n)]
for i in range(n-1):
    u, v, t = map(int, input().split())
    u -= 1
    v -= 1
    edges.append((u, v, t))
    tree[u].append((v, t, i))
    tree[v].append((u, t, i))

m = int(input())
flips = [int(input())-1 for _ in range(m)]

# Euler tour for subtree parity flips
in_time = [0]*n
out_time = [0]*n
depth = [0]*n
parity = [0]*n
time = 0

def dfs(u, p, d, par):
    global time
    in_time[u] = time
    time += 1
    depth[u] = d
    parity[u] = par
    for v, t, _ in tree[u]:
        if v == p:
            continue
        dfs(v, u, d+1, par ^ t)
    out_time[u] = time

dfs(0, -1, 0, 0)

# Segment tree to track max depth per parity
size = 1
while size < n:
    size *= 2
seg = [(-1, -1)]*(2*size)

for i in range(n):
    if parity[i] == 0:
        seg[size+i] = (depth[i], -1)
    else:
        seg[size+i] = (-1, depth[i])

for i in range(size-1, 0, -1):
    l, r = seg[2*i], seg[2*i+1]
    seg[i] = (max(l[0], r[0]), max(l[1], r[1]))

def update(pos, old_parity):
    i = size + pos
    if old_parity == 0:
        seg[i] = (-1, depth[pos])
    else:
        seg[i] = (depth[pos], -1)
    i //= 2
    while i >= 1:
        l, r = seg[2*i], seg[2*i+1]
        seg[i] = (max(l[0], r[0]), max(l[1], r[1]))
        i //= 2

def get_max():
    return max(seg[1][0], seg[1][1])

for idx in flips:
    u, v, t = edges[idx]
    if depth[u] < depth[v]:
        u, v = v, u
    old_parity = parity[u]
    def flip_subtree(x):
        parity[x] ^= 1
        for y, _, _
```
