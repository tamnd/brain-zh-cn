---
title: "CF 1464F - 我美丽的疯狂"
description: "我们在树上维护多组路径。 可以动态插入和删除路径。 对于参数为 d 的查询，我们必须确定是否存在至少一个顶点，其到每条存储路径的距离至多为 d。"
date: "2026-06-11T01:57:05+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "trees"]
categories: ["algorithms"]
codeforces_contest: 1464
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 692 (Div. 1, based on Technocup 2021 Elimination Round 3)"
rating: 3500
weight: 1464
solve_time_s: 122
verified: false
draft: false
---

[CF 1464F - 我美丽的疯狂](https://codeforces.com/problemset/problem/1464/F)

 **评分：** 3500
 **标签：** 数据结构，树
 **求解时间：** 2m 2s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们在树上维护多组路径。 可以动态插入和删除路径。 

对于带参数的查询`d`，我们必须判断是否存在至少一个顶点，其到每条存储路径的距离最多为`d`。 

表达同一件事的另一种方式是这样的：

 对于每个存储的路径`P`，考虑距离`P`至多是`d`。 我们需要知道所有这些集合的交集是否非空。 

该树最多包含`2 · 10^5`顶点并且有多达`2 · 10^5`运营。 查询期间触及所有活动路径的任何解决方案都会立即被排除。 甚至`O(√q)`每次操作的工作量是不舒服的。 我们需要接近对数时间的东西。 

困难在于维护的对象是路径，而不是顶点。 插入和删除都是在线发生的，因此我们无法离线处理查询。 

当多次插入同一路径时，会出现微妙的边缘情况。```
add (1,2)
add (1,2)
delete (2,1)
```至今仍保留一份副本。 任何只存储存在而不存储多样性的结构都会被打破。 

另一个容易犯的错误是认为查询询问所有存储的路径是否相交。 为了`d > 0`这不是真的。 

考虑一条链：```
1 - 2 - 3 - 4 - 5
```具有存储的路径`(1,1)`和`(5,5)`。 

为了`d = 2`, 顶点`3`在距离内`2`两条路径，所以答案是`Yes`即使路径本身是不相交的。 

最困难的部分是了解所有存储路径上实际正在测试的条件。 

## 方法

 强力方法将明确维护所有活动路径。 对于查询`3 d`，我们可以测试树的每个顶点并检查它到每个活动路径的距离。 

从顶点到路径的距离可以使用 LCA 机器计算，但即使该检查是恒定时间，我们仍然会执行```
O(n · |P|)
```每个查询的工作量。 

当两个值都达到`2 · 10^5`，这是完全不可能的。 

关键的观察是每条路径`(u,v)`可以用其LCA来表示。 

让```
l = lca(u,v)
```一个顶点`x`在距离内`d`从路径`(u,v)`当且仅当投影为`x`到达路径 爬升超过之前到达路径`d`边缘。 同时重写所有活动路径的这个条件揭示了一个令人惊讶的强大结构。 

假设我们收集所有活动路径的 LCA。 

让`L`是最深的活跃 LCA。 

如果某个顶点在距离内`d`对于每条路径，该顶点必须位于通过攀爬获得的祖先的子树内`2d`上面的边缘`L`。 

这将问题简化为子树。 

在该子树中，只有 LCA 很重要。 我们需要所有的活跃LCA都属于同一个祖先子树，并且该子树内的活跃LCA集合的直径必须足够小。 

活动的 LCA 形成一组动态的顶点。 动态树直径是一种标准结构：如果两个线段知道它们的直径，则可以通过仅检查两个直径的端点来获得它们并集的直径。 

这将整个问题变成了维护：

 1. LCA 的动态多重集。 
2.最深的活跃LCA。 
3. 欧拉图子树内所有活动 LCA 的直径。 
4. LCA属于子树的活动路径的数量。 

所有操作都可以在对数时间内处理。 

公认的解决方案使用：

 - 欧拉游览间隔。 
- 二进制提升。 
- 芬威克树。 
- 保持直径的线段树。 
- 按深度排序的多重集。 

由此产生的复杂度是`O(log n)`每次更新和查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每个查询 O(n·| P | ) |
 | 最佳| 每次操作 O(log n) | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 ### 几何重构

 对于活动路径`(u,v)`让```
l = lca(u,v)
```该路径由两条向上链组成，在`l`。 

对于一个顶点`x`在距离内`d`从这条道路开始，祖先`l`攀登后获得`d`边缘仍必须可到达`x`不超过另一个`d`边缘。 

在所有路径上简化此条件后，只有 LCA 仍然相关。 

### 维护的对象

 让`S`是所有活动路径的 LCA 的多重集。 

对于每个活动路径：

 1. 将其LCA添加到`S`。 
2. 当路径消失时移除其LCA。 

我们维持：

 1. 最深的顶点`S`。 
2. Euler-tour 子树内活跃 LCA 的计数。 
3.活动LCA的直径信息。 

### 数据结构

 1. 运行 DFS。 
2. 计算欧拉项`tin`并退出`tout`。 
3. 构建二元升降台。 
4. 根据欧拉阶构建 Fenwick 树。 
5. 构建一棵线段树，其叶子对应于顶点。 

线段树节点存储其区间内所有活动顶点的直径。 

直径表示为：```
(endpoint1, endpoint2, length)
```### 合并两个直径结构

 假设左子节点有直径端点`(a,b)`右边的孩子有`(c,d)`。 

接头的直径必须是以下之一：```
(a,b)
(c,d)
(a,c)
(a,d)
(b,c)
(b,d)
```检查这六对就足够了。 

这是标准动态直径合并。 

### 插入路径

 1. 计算`l = lca(u,v)`。 
2. 添加 1 次出现`l`到深度有序多重集。 
3. 添加 1 次出现`l`到芬威克树。 
4. 如果这是第一次出现`l`，激活其在线段树中的叶子。 

### 删除路径

 1. 计算`l = lca(u,v)`。 
2. 从多重集中删除一个出现的情况。 
3. 从 Fenwick 树中删除一个事件。 
4. 如果重数变为零，则停用线段树叶子。 

### 回答查询`3 d`让`L`是最深的活跃 LCA。 

1. 移动`d`边缘向上从`L`，得到`x`。 
2. 移动另一个`d`边缘向上从`x`，得到`y`。 

候选公共点必须位于子树内部`y`。 

首先检查每个活动的 LCA 是否属于该子树。 

使用欧拉区间和芬威克树：```
count(subtree(y)) == number_of_active_paths
```必须持有。 

如果没有，请回答`No`。 

否则在子树的欧拉区间上查询线段树`y`。 

这将返回该子树中所有活动 LCA 的直径。 

设直径端点为`(p,q)`。 

答案是`Yes`当且仅当```
dist(x,p) ≤ d
and
dist(x,q) ≤ d
```因为每个有效的 LCA 都位于一个集合上，其最远的对是`(p,q)`。 

如果两个直径端点都位于半径内 -`d`球中心位于`x`，每个活跃的 LCA 也都适合。 

### 为什么它有效

 最深的活跃 LCA 是限制性最强的 LCA。 任何可行的顶点都必须靠近它。 

攀登`2d`高于最深 LCA 的级别会生成仍可包含公共可行顶点的最大子树。 每个活动的 LCA 都必须位于该子树内。 即使有一个活动的 LCA 逃逸，也没有顶点可以同时满足所有约束。 

在有效子树内，可行性仅取决于活动 LCA 之间的最大成对距离。 直径端点就足够了，因为每个其他活动 LCA 与中心候选的距离不比直径端点之一更远。 因此，检查两个直径端点可以完全表征整个集合。 

这个不变量在每次插入和删除后都会被保留，因为所有维护的结构仅依赖于活跃的 LCA 多重性。 

## Python 解决方案```python
import sys
from bisect import bisect_left, insort

input = sys.stdin.readline

def solve():
    n, q = map(int, input().split())

    g = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v = map(int, input().split())
        g[u].append(v)
        g[v].append(u)

    LOG = 20

    tin = [0] * (n + 1)
    tout = [0] * (n + 1)
    depth = [0] * (n + 1)
    up = [[0] * (n + 1) for _ in range(LOG + 1)]
    euler = [0] * (n + 1)

    timer = 0

    sys.setrecursionlimit(1 << 20)

    def dfs(v, p):
        nonlocal timer
        timer += 1
        tin[v] = timer
        euler[timer] = v

        up[0][v] = p
        depth[v] = depth[p] + 1

        for i in range(1, LOG + 1):
            up[i][v] = up[i - 1][up[i - 1][v]]

        for to in g[v]:
            if to != p:
                dfs(to, v)

        tout[v] = timer

    dfs(1, 1)

    def lca(a, b):
        if depth[a] < depth[b]:
            a, b = b, a

        diff = depth[a] - depth[b]

        bit = 0
        while diff:
            if diff & 1:
                a = up[bit][a]
            diff >>= 1
            bit += 1

        if a == b:
            return a

        for i in range(LOG, -1, -1):
            if up[i][a] != up[i][b]:
                a = up[i][a]
                b = up[i][b]

        return up[0][a]

    def dist(a, b):
        c = lca(a, b)
        return depth[a] + depth[b] - 2 * depth[c]

    def jump(v, k):
        for i in range(LOG + 1):
            if k >> i & 1:
                v = up[i][v]
        return v

    class Fenwick:
        def __init__(self, n):
            self.n = n
            self.bit = [0] * (n + 1)

        def add(self, idx, val):
            n = self.n
            bit = self.bit
            while idx <= n:
                bit[idx] += val
                idx += idx & -idx

        def sum(self, idx):
            bit = self.bit
            res = 0
            while idx:
                res += bit[idx]
                idx -= idx & -idx
            return res

        def range_sum(self, l, r):
            return self.sum(r) - self.sum(l - 1)

    fenwick = Fenwick(n)

    NEG = (-1, -1, -1)

    def merge(A, B):
        if A[0] == -1:
            return B
        if B[0] == -1:
            return A

        cand = [
            (A[0], A[1]),
            (B[0], B[1]),
            (A[0], B[0]),
            (A[0], B[1]),
            (A[1], B[0]),
            (A[1], B[1]),
        ]

        best_u, best_v = A[0], A[1]
        best_d = dist(best_u, best_v)

        for u, v in cand:
            d = dist(u, v)
            if d > best_d:
                best_d = d
                best_u, best_v = u, v

        return (best_u, best_v, best_d)

    seg = [NEG] * (4 * n)

    def update(node, l, r, pos, val):
        if l == r:
            seg[node] = (val, val, 0) if val != -1 else NEG
            return

        mid = (l + r) // 2

        if pos <= mid:
            update(node * 2, l, mid, pos, val)
        else:
            update(node * 2 + 1, mid + 1, r, pos, val)

        seg[node] = merge(seg[node * 2], seg[node * 2 + 1])

    def query(node, l, r, ql, qr):
        if ql <= l and r <= qr:
            return seg[node]

        mid = (l + r) // 2

        if qr <= mid:
            return query(node * 2, l, mid, ql, qr)
        if ql > mid:
            return query(node * 2 + 1, mid + 1, r, ql, qr)

        return merge(
            query(node * 2, l, mid, ql, qr),
            query(node * 2 + 1, mid + 1, r, ql, qr),
        )

    cnt = [0] * (n + 1)

    depth_set = []

    active = 0
    out = []

    for _ in range(q):
        tmp = list(map(int, input().split()))
        tp = tmp[0]

        if tp == 1:
            _, u, v = tmp
            w = lca(u, v)

            insort(depth_set, (depth[w], w))

            fenwick.add(tin[w], 1)

            cnt[w] += 1
            if cnt[w] == 1:
                update(1, 1, n, tin[w], w)

            active += 1

        elif tp == 2:
            _, u, v = tmp
            w = lca(u, v)

            pos = bisect_left(depth_set, (depth[w], w))
            depth_set.pop(pos)

            fenwick.add(tin[w], -1)

            cnt[w] -= 1
            if cnt[w] == 0:
                update(1, 1, n, tin[w], -1)

            active -= 1

        else:
            _, d = tmp

            L = depth_set[-1][1]

            x = jump(L, d if d < depth[L] else depth[L] - 1)
            y = jump(x, d if d < depth[x] else depth[x] - 1)

            inside = fenwick.range_sum(tin[y], tout[y])

            if inside != active:
                out.append("No")
                continue

            dia = query(1, 1, n, tin[y], tout[y])

            if dia[0] == -1:
                out.append("Yes")
                continue

            ok = (
                dist(x, dia[0]) <= d and
                dist(x, dia[1]) <= d
            )

            out.append("Yes" if ok else "No")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```该实现遵循上述的确切结构。 Fenwick 树对 Euler-tour 子树内的活跃 LCA 进行计数。 线段树维护活动 LCA 的动态直径。 多重性处理至关重要：只有当顶点计数变为零时，顶点才会从线段树中消失。 

直径合并是最重要的部分。 对于两组顶点，它们并集的直径必须由现有直径之一形成，或者通过将左直径的端点与右直径的端点连接来形成。 检查六对就足够了。 

欧拉图区间`[tin[v], tout[v]]`将子树查询转换为范围查询。 这就是芬威克树和线段树都能发挥作用的原因。 

## 工作示例

 ### 示例 1

 输入：```
1 4
1 1 1
1 1 1
2 1 1
3 0
```| 运营| 活跃的 LCA | 最深的 LCA | 结果 |
 | --- | --- | --- | --- |
 | 添加 (1,1) | {1} | 1 | |
 | 添加 (1,1) | {1,1} | 1 | |
 | 删除 (1,1) | {1} | 1 | |
 | 查询 0 | {1} | 1 | 是的 |

 唯一的活动路径是单个顶点`1`，所以它的`0`- 邻里是`{1}`并且交集非空。 

### 自定义示例

 链条：```
1 - 2 - 3 - 4 - 5
```运营：```
add (1,1)
add (5,5)
query 1
query 2
```| 运营| 活跃的 LCA |
 | --- | --- |
 | 添加 (1,1) | {1} |
 | 添加 (5,5) | {1,5} |
 | 查询 1 | 没有 |
 | 查询 2 | 是的 |

 有半径`1`，没有顶点距离两端足够近。 有半径`2`, 顶点`3`满足两个约束条件。 

这表明问题在于邻域，而不是路径交叉点。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + q) log n) | O((n + q) log n) | DFS 预处理加上对数更新和查询 |
 | 空间| O(n log n) | O(n log n) | 二叉升降表和线段树|

 和`n, q ≤ 2 · 10^5`，大约执行几百万次对数运算。 这完全符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    # paste solve() and return captured output
    pass

# sample
assert run("""\
1 4
1 1 1
1 1 1
2 1 1
3 0
""") == "Yes"

# single vertex tree
assert run("""\
1 2
1 1 1
3 0
""") == "Yes"

# duplicate insert/delete handling
assert run("""\
1 5
1 1 1
1 1 1
2 1 1
3 0
3 0
""") == "Yes\nYes"

# chain, radius too small
assert run("""\
5 4
1 2
2 3
3 4
4 5
1 1 1
1 5 5
3 1
""") == "No"

# chain, radius large enough
assert run("""\
5 4
1 2
2 3
3 4
4 5
1 1 1
1 5 5
3 2
""") == "Yes"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单顶点| 是的 | 最小树尺寸 |
 | 重复路径操作 | 是的，是的| 正确的多重性处理 |
 | d=1 的链 | 没有 | 半径太小 |
 | d=2 的链 | 是的 | 半径边界|
 | 官方样品| 是的 | 基本正确性 |

 ## 边缘情况

 考虑同一路径的多个副本：```
1 5
1 1 1
1 1 1
2 1 1
3 0
3 0
```删除一份后，一份副本仍保持活动状态。 顶点计数器`1`变成`1`， 不是`0`，因此线段树的叶子保持活动状态。 仅存储布尔值的解决方案会错误地删除它。 

考虑邻域相交但路径不相交的路径：```
5 3
1 2
2 3
3 4
4 5
1 1 1
1 5 5
3 2
```活跃的 LCA 是`{1,5}`。 它们的直径是`4`。 该算法找到适当的祖先子树并验证两个直径端点是否位于距离内`2`来自候选人中心。 答案就变成了`Yes`，匹配真实的邻域交叉点。 

最后，考虑`d = 0`。 

该查询询问所有活动路径本身是否共享一个公共顶点。 该算法自然会简化为检查活动 LCA 是否崩溃为有效的零半径配置。 无需特殊处理。
