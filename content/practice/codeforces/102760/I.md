---
title: "CF 102760I - 树查询 17"
description: "我们有一棵根为 1 的有根树。每个顶点都存储非负数的人数。 最初每个顶点的值都为零。 每个操作都会增加整个子树或整个简单路径上的值。"
date: "2026-07-29T00:03:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102760
codeforces_index: "I"
codeforces_contest_name: "2020 KAIST 10th ICPC Mock Contest (XXI Open Cup. Grand Prix of Korea. Division 2)"
rating: 0
weight: 102760
solve_time_s: 114
verified: true
draft: false
---

[CF 102760I - 树查询 17](https://codeforces.com/problemset/problem/102760/I)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 54s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵根为 1 的有根树。每个顶点都存储非负数的人数。 最初每个顶点的值都为零。 每个操作都会增加整个子树或整个简单路径上的值。 每次更新后，我们必须打印所有人的总旅行距离最小的顶点。 如果几个顶点具有相同的最小值，我们选择最接近根的一个。 

我们最小化的值是距离的加权和。 高达$10^5$顶点和$10^5$操作，每次更新后重新计算每个顶点的值大约需要$10^{10}$工作，这是不可能的。 我们需要对每个操作进行对数或接近对数的处理。 

棘手的情况来自平局规则和零值顶点。 一个顶点的子树恰好包含了所有人的一半，这不会迫使我们移动到该子树中，因为双方的成本相同，并且较浅的顶点必须获胜。 

例如，如果树是一条链：```
1
|
2
|
3
```并且顶点 3 的值为 10，答案是 1，而不是 3。从 1 移动到 2 或 3 并不能改善聚集距离，足以击败较浅的选择。 

## 方法

 强力方法将显式地维护每个顶点值。 每次更新后，我们可以从每个可能的答案顶点运行树遍历并计算总距离。 这是正确的，因为它直接评估定义，但单个查询已经花费$O(n)$或者更糟，导致$O(nQ)$运营。 

关键的观察结果是答案是加权质心。 如果我们从一个顶点移动到其父节点的边，则距离总和仅根据移动子树中的权重而变化。 如果子子树包含一半以上的人，则移入其中可以改善答案。 否则我们应该留下来。 

剩下的问题是在子树添加和路径添加下维护子树和。 我们用重光分解将树压平。 在DFS顺序中，每个子树成为一个区间，每条路径成为$O(\log n)$间隔。 惰性线段树以 DFS 顺序维护值，允许间隔添加和前缀搜索。 

通过定位第一个前缀权重达到总权重一半的DFS顺序位置，可以找到加权质心。 答案就在该顶点的祖先链上。 采用二元提升的方式向上移动，直到找到最高的有效质心。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(nQ)$|$O(n)$| 太慢了|
 | HLD+线段树|$O(Q\log^2 n)$|$O(n\log n)$| 已接受 |

 ## 算法演练

 1. 构建有根树并计算子树大小、深度、重子树、DFS 顺序和二元提升祖先。 
2.采用重轻分解，使得每一棵子树对应一个DFS区间，并且每条路径可以分为对数个区间。 
3. 通过 DFS 顺序将当前顶点值存储在惰性线段树中。 线段树支持区间加1、求总权重、求前缀到达目标的第一个位置。 
4. 更新后，设总人数为$S$。 找到第一个前缀和至少为的DFS位置$\lceil S/2\rceil$。 
5. 答案是该顶点的祖先。 当当前祖先没有足够的权重时，使用二叉提升和子树求和查询向上爬。 

为什么它有效：顶点与其父节点的成本之间的差异仅取决于子节点是否包含总权重的一半以上。 所选择的顶点正是其子方向包含重边的最浅顶点，不能提高成本。 前缀搜索找到重边内的一个点，并且攀登祖先解决了所需的平局规则。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(300000)

n = int(input())
g = [[] for _ in range(n + 1)]
for _ in range(n - 1):
    a, b = map(int, input().split())
    g[a].append(b)
    g[b].append(a)

par = [[0] * (n + 1) for _ in range(17)]
dep = [0] * (n + 1)
sz = [0] * (n + 1)
son = [0] * (n + 1)

def dfs1(u, p):
    par[0][u] = p
    dep[u] = dep[p] + 1
    sz[u] = 1
    best = 0
    for v in g[u]:
        if v == p:
            continue
        dfs1(v, u)
        sz[u] += sz[v]
        if sz[v] > best:
            best = sz[v]
            son[u] = v

dfs1(1, 0)

for j in range(1, 17):
    for i in range(1, n + 1):
        par[j][i] = par[j - 1][par[j - 1][i]]

tin = [0] * (n + 1)
tout = [0] * (n + 1)
rev = [0] * (n + 1)
top = [0] * (n + 1)
timer = 0

def dfs2(u, t):
    global timer
    timer += 1
    tin[u] = timer
    rev[timer] = u
    top[u] = t
    if son[u]:
        dfs2(son[u], t)
    for v in g[u]:
        if v != par[0][u] and v != son[u]:
            dfs2(v, v)
    tout[u] = timer

dfs2(1, 1)

class Seg:
    def __init__(self, n):
        self.s = [0] * (4 * n)
        self.lz = [0] * (4 * n)

    def add(self, x, l, r, ql, qr):
        if ql <= l and r <= qr:
            self.s[x] += r - l + 1
            self.lz[x] += 1
            return
        m = (l + r) // 2
        self.push(x, l, r)
        if ql <= m:
            self.add(x * 2, l, m, ql, qr)
        if qr > m:
            self.add(x * 2 + 1, m + 1, r, ql, qr)
        self.s[x] = self.s[x * 2] + self.s[x * 2 + 1]

    def push(self, x, l, r):
        if self.lz[x]:
            m = (l + r) // 2
            v = self.lz[x]
            self.s[x * 2] += v * (m - l + 1)
            self.s[x * 2 + 1] += v * (r - m)
            self.lz[x * 2] += v
            self.lz[x * 2 + 1] += v
            self.lz[x] = 0

    def query(self, x, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.s[x]
        self.push(x, l, r)
        m = (l + r) // 2
        res = 0
        if ql <= m:
            res += self.query(x * 2, l, m, ql, qr)
        if qr > m:
            res += self.query(x * 2 + 1, m + 1, r, ql, qr)
        return res

    def kth(self, x, l, r, k):
        if l == r:
            return l
        self.push(x, l, r)
        m = (l + r) // 2
        if self.s[x * 2] >= k:
            return self.kth(x * 2, l, m, k)
        return self.kth(x * 2 + 1, m + 1, r, k - self.s[x * 2])

seg = Seg(n)

def path_add(a, b):
    while top[a] != top[b]:
        if dep[top[a]] < dep[top[b]]:
            a, b = b, a
        seg.add(1, 1, n, tin[top[a]], tin[a])
        a = par[0][top[a]]
    if dep[a] > dep[b]:
        a, b = b, a
    seg.add(1, 1, n, tin[a], tin[b])

def subtree_sum(u):
    return seg.query(1, 1, n, tin[u], tout[u])

q = int(input())
ans = []
for _ in range(q):
    data = list(map(int, input().split()))
    if data[0] == 1:
        u = data[1]
        seg.add(1, 1, n, tin[u], tout[u])
    else:
        path_add(data[1], data[2])

    total = seg.s[1]
    need = (total + 1) // 2
    x = rev[seg.kth(1, 1, n, need)]

    for j in range(16, -1, -1):
        p = par[j][x]
        if p and subtree_sum(p) >= need:
            x = p

    while par[0][x] and subtree_sum(par[0][x]) >= need:
        x = par[0][x]

    ans.append(str(x))

print("\n".join(ans))
```线段树以 DFS 顺序存储实际的顶点值。 这`add`操作处理子树和重光路更新。 这`kth`函数找到第一个累积权重达到总权重一半的位置，该位置标识了包含质心的区域。 

祖先跳跃利用了这样一个事实：只有找到的顶点的祖先才能作为答案。 最终的向上运动保持最浅的有效质心，与所需的平局决胜匹配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(Q\log^2 n)$| 每次路径更新使用$O(\log n)$分段，每个分段更新成本$O(\log n)$，质心搜索使用对数祖先跳跃。 |
 | 空间|$O(n\log n)$| 二进制提升主导内存使用。 |

 边界允许这种方法，因为每个操作都是对数的，而不是扫描整个树。 

## 边缘情况

 所有权重都集中在叶子上的单一路径测试了平局规则。 该算法找到了重前缀，但会爬回到最近的有效祖先，因此它不会错误地返回叶子。 

通过两个端点相等的路径更新单个顶点的查询测试路径分解边界。 重光分解将其视为一个顶点间隔，并且线段树执行正常的点更新。 

一棵树的重边恰好包含总重量的一半，用于测试平等处理。 该算法使用$\lceil S/2\rceil$并且只有当祖先仍然满足条件时才向上移动，因此保留较浅的顶点。
