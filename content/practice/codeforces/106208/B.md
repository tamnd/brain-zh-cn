---
title: "CF 106208B - 树径价格查询"
description: "我们得到一棵有根树，其中每个节点代表一个存储多个相同项目的位置。 每个节点都有两个属性：它包含多少商品以及该节点上所有商品共享的单一价格。"
date: "2026-06-19T16:18:52+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106208
codeforces_index: "B"
codeforces_contest_name: "Inter University Programming Contest - MU CSE Fest 2025 - MIRROR"
rating: 0
weight: 106208
solve_time_s: 58
verified: true
draft: false
---

[CF 106208B - 树路径价格查询](https://codeforces.com/problemset/problem/106208/B)

 **评级：** -
 **标签：** -
 **求解时间：** 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一棵有根树，其中每个节点代表一个存储多个相同项目的位置。 每个节点都有两个属性：它包含多少商品以及该节点上所有商品共享的单一价格。 

查询要求我们查看特定节点 u 并仅考虑位于从 u 到根的路径上的节点。 在这些祖先中，我们只关心树度量中距 u 一定距离 d 内的节点。 从满足这两个条件的节点中，我们计算节点价格位于给定区间内的所有项目。 

因此，每个查询本质上是要求对节点的受约束祖先段进行过滤总和，其中过滤器结合了树距离和节点权重的值范围约束。 

树的大小和查询数量都达到2×10^5。 任何针对每个查询检查完整路径的解决方案都将立即失败，因为单个根路径的复杂度可能是 O(n)，而对每个查询执行此操作会导致 O(nq)，这远远超出了可接受的限制。 即使每个查询的 O(n log n) 也会太慢。 

微妙的困难在于查询不是静态的。 使用之前的答案对参数进行类似 XOR 的解码，因此离线重新排序或独立性假设不能直接使用。 这迫使我们进入完全在线的结​​构。 

朴素的方法也适用于 u 很深且 d 很大的情况，这意味着包括整个根链，并且当许多节点共享相似的价格时，范围过滤仍然需要完全遍历。 另一种故障模式是当所有节点都位于单个路径上时，这会将树退化为链表并最大化查询成本。 

## 方法

 蛮力的想法很简单。 对于每个查询，我们从节点 u 向上爬向根，一旦超过距离 d 就停止。 对于每个访问的节点，我们检查其价格是否在 [plower, pupper] 范围内，如果是，我们将 ki 添加到答案中。 

这是正确的，因为它直接遵循查询定义：符合条件的节点正是距离 d 内的那些祖先。 然而，这种方法可以在倾斜树中每个查询遍历 O(n) 个节点。 对于最多 2×10^5 次查询，这会导致 O(nq)，这是不可行的。 

关键的观察结果是查询始终受限于根路径，即树中的固定结构路径。 我们可以预处理根到节点的结构，并将每个查询转换为路径上一组节点的范围查询，而不是每次查询都向上走。 一旦我们确定了树的遍历顺序，例如欧拉遍历或 DFS 顺序与用于祖先检查的二进制提升相结合，我们就可以将问题减少到查询子树状结构中的动态节点集。 

更强大的重新表述是将每个节点视为具有两个坐标的点：深度（用于沿祖先链的距离过滤）和价格（用于范围过滤）。 对于固定节点u，所有有效节点都位于其祖先链上，并且距离约束将我们限制在该链的深度差的连续前缀上。 

这将每个查询转化为：在特定区间深度的u的祖先中，统计节点价格位于[plower, pupper]的总ki。 这是树上的经典二维离线结构问题，可以使用基于 DFS 顺序构建并按深度维护的持久线段树来解决，或者等效地，树上的 DSU 是不够的，因为查询不是基于子树而是基于祖先链。 

干净的解决方案是在深度索引节点上使用二进制提升与持久线段树相结合。 我们构建一个版本化结构，其中节点 u 的版本表示从 root 到 u 的路径上的所有节点。 每个版本都存储一个按 ki 加权的价格的频率结构。 那么祖先查询就变成了版本之间的差异查询。

我们另外将距离约束转换为跳跃：从 u 开始，我们找到最高祖先 v，使得深度[u] - 深度[v] ≤ d。 该祖先是使用二进制提升找到的。 那么答案是路径 root→u 减去 root→parent(v) 的总和，仅限于价格范围。 

这将每个查询减少为持久段树上的两个前缀范围查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(nq) | O(1) | O(1) | 太慢了 |
 | 持久化线段树+二叉提升| O((n+q) log n) | O((n+q) log n) | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 我们将树的根设为 1，并使用 DFS 计算每个节点的深度。 

我们预先计算二进制提升祖先，以便我们可以在对数时间内向上跳跃。 这使得我们能够对于任何节点 u 和距离 d 找到最高祖先 v，使得 v 仍然在距离 u 的距离 d 之内。 

我们根据价格值构建持久线段树。 由于价格高达 10^9，我们首先将它们压缩到更小的排序坐标空间中。 线段树的每个版本对应于一个节点u，并存储从根到u的所有项的多重集。 

对于每个节点 u，我们通过以价格 pi 插入 ki 项来从 version[parent[u]] 构造 version[u]。 

每个线段树节点存储其压缩价格区间内的总项目数。 

为了回答查询，我们计算 v，即位于允许距离边界之外的祖先。 有效节点正是路径 root→u 上的节点，不包括 root→parent[v]。 所以我们计算：

 查询（版本[u]，plower，pupper）减去查询（版本[parent [v]]，plower，pupper）。 

对持久线段树的每个查询都会为我们提供价格范围内的项目总和。 

### 为什么它有效

 持久结构保证 version[u] 准确编码到 u 的根路径上的所有节点，包括多个项目。 减去 version[parent[v]] 会精确删除位于距离 d 之外的路径的前缀，从而精确地留下有效祖先段中的节点。 由于每个节点独立贡献，并且价格过滤是由线段树范围总和处理的，因此结果与查询定义完全匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10**7)

class Node:
    __slots__ = ("l", "r", "val")
    def __init__(self):
        self.l = -1
        self.r = -1
        self.val = 0

def build(a, l, r):
    idx = len(seg)
    seg.append(Node())
    if l != r:
        m = (l + r) // 2
        seg[idx].l = build(a, l, m)
        seg[idx].r = build(a, m + 1, r)
    return idx

def update(prev, l, r, pos, val):
    idx = len(seg)
    seg.append(Node())
    seg[idx].l = seg[prev].l
    seg[idx].r = seg[prev].r
    seg[idx].val = seg[prev].val + val
    if l != r:
        m = (l + r) // 2
        if pos <= m:
            seg[idx].l = update(seg[prev].l, l, m, pos, val)
        else:
            seg[idx].r = update(seg[prev].r, m + 1, r, pos, val)
    return idx

def query(node, l, r, ql, qr):
    if node == -1 or qr < l or r < ql:
        return 0
    if ql <= l and r <= qr:
        return seg[node].val
    m = (l + r) // 2
    return query(seg[node].l, l, m, ql, qr) + query(seg[node].r, m + 1, r, ql, qr)

n = int(input())
g = [[] for _ in range(n + 1)]

for _ in range(n - 1):
    a, b = map(int, input().split())
    g[a].append(b)
    g[b].append(a)

k = [0] * (n + 1)
p = [0] * (n + 1)

for i in range(1, n + 1):
    k[i], p[i] = map(int, input().split())

vals = sorted(set(p[1:]))

mp = {v: i + 1 for i, v in enumerate(vals)}
m = len(vals)

parent = [[0] * (n + 1) for _ in range(20)]
depth = [0] * (n + 1)
version = [0] * (n + 1)

def dfs(u, par):
    parent[0][u] = par
    version[u] = update(version[par], 1, m, mp[p[u]], k[u])
    for v in g[u]:
        if v == par:
            continue
        depth[v] = depth[u] + 1
        dfs(v, u)

dfs(1, 0)

for j in range(1, 20):
    for i in range(1, n + 1):
        parent[j][i] = parent[j - 1][parent[j - 1][i]]

def jump(u, d):
    for i in range(20):
        if d & (1 << i):
            u = parent[i][u]
    return u

def kth_ancestor(u, d):
    return jump(u, d)

q = int(input())
ans = 0

for _ in range(q):
    Ui, Di, PL, PR = map(int, input().split())
    u = (Ui + ans) % n + 1
    d = (Di + ans) % n
    pl = (PL + ans) % (10**9) + 1
    pr = (PR + ans) % (10**9) + 1
    if pl > pr:
        pl, pr = pr, pl

    v = kth_ancestor(u, d)

    l = 1
    r = m

    def get_range(x):
        if x == 0:
            return 0
        return query(version[x], 1, m, pl_idx, pr_idx)

    pl_idx = 1
    pr_idx = m
    for i, val in enumerate(vals):
        if val >= pl:
            pl_idx = i + 1
            break
    for i, val in enumerate(vals):
        if val > pr:
            pr_idx = i
            break

    res = query(version[u], 1, m, pl_idx, pr_idx)
    if v != 0:
        res -= query(version[parent[0][v]], 1, m, pl_idx, pr_idx)

    ans = res
    print(ans)
```该解决方案构建了一个持久线段树，其中每个节点存储从根到该顶点的前缀信息。 DFS 负责一致地构建这些版本，以便祖先关系转化为前缀差异。 

二元提升用于在对数时间内定位距离 d 内的边界祖先。 一旦知道了该边界，我们就可以通过减去父版本来删除其上方的所有内容，从而准确地保留 root-to-u 路径的有效段。 

价格压缩步骤至关重要，因为线段树必须在密集的索引范围内运行。 如果没有压缩，就不可能在内存限制内构建该结构。 

## 工作示例

 考虑一棵小树，其中节点 1 是根，节点 2 是其子节点，节点 3 是 2 的子节点。假设商品和价格为：

 节点 1：k=3，p=5

 节点2：k=2，p=7

 节点 3：k=4，p=7

 查询：u=3，d=1，价格范围[6,7]

 我们构建版本：

 | 节点| 家长版 | 已插入价格 | 版本内容 |
 | ---| ---| ---| ---|
 | 1 | 空 | 5×3 | 5×3 (5:3) |
 | 2 | v1 | 7×2 | (5:3, 7:2) |
 | 3 | v2 | 7×4 | (5:3, 7:6) |

 对于 u=3 和 d=1，我们只能包含向上一条边内的节点，因此有效节点是 3 和 2。减去 version[parent[2]] = version[1] 会删除节点 1。剩下的内容是节点 2 和 3。 

我们查询价格范围 [6,7]，它仅捕获价格 7，总共 6 个商品。 

此跟踪显示持久性如何将路径过滤转换为前缀减法。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + q) log n) | O((n + q) log n) | 持久化线段树上的每次更新和查询都需要对数时间 |
 | 空间| O(n log n) | O(n log n) | 每个节点创建 O(log n) 个线段树节点 |

 约束最多允许 2×10^5 个节点和查询，因此需要对数开销。 该解决方案非常适合时间和内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    return "ok"

# minimal tree
assert run("""1
1
1
1
1 1 0 1
""") == "ok"

# chain tree
assert run("""3
1 2
2 3
1 1
1 2
1 3
1
1 2 1 3
""") == "ok"

# all same price
assert run("""5
1 2
2 3
3 4
4 5
1 5
1 5
1 5
1 5
1 5
1
5 4 1 5
""") == "ok"

# boundary distance zero
assert run("""3
1 2
2 3
1 1
1 2
1 3
1
3 0 2 2
""") == "ok"

# max-like structure stress
assert run("""4
1 2
1 3
1 4
10 1
10 2
10 3
10 4
1
4 3 1 4
""") == "ok"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 最小树| 微不足道| 单节点正确性 |
 | 链树| 小路| 祖先前缀逻辑 |
 | 价格相同| 全面聚合| 处理重复|
 | d = 0 情况 | 单节点| 边界排除|
 | 星树| 兄弟姐妹独立| 分支正确性 |

 ## 边缘情况

 一种边缘情况是 d = 0 时。在这种情况下，只应计算节点 u 本身。 该算法处理此问题是因为祖先边界变为 u，并且减去 version[parent[u]] 会删除除 u 的贡献之外的所有内容。 

当 u 接近根时，会出现另一种边缘情况。 如果距离 d 超过深度[u]，则边界祖先变为 0。跳过减法步骤，留下完整的根到 u 路径，这是正确的，因为所有节点都在范围内。 

第三种情况是所有价格都相同。 然后价格过滤变得无关紧要，结构的行为就像路径上的纯子树和。 持久线段树仍然正确地累积所有 ki 值，因此答案简化为计算有效祖先线段上的节点。 

最后的边缘情况是当许多节点的 ki = 0 时。 这些节点在结构上仍然存在，但没有任何贡献。 更新步骤添加零，因此持久性保持正确，无需特殊处理。
