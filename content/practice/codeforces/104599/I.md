---
title: "CF 104599I - 星际恐怖主义"
description: "我们得到一棵有 $n$ 个节点的有根树。 每个节点 $i$ 都带有一个正值 $ai$。 该结构已经是一棵树，因此正好有 $n-1$ 条边，每条边隐式具有 $1$ 权重。"
date: "2026-06-30T03:01:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104599
codeforces_index: "I"
codeforces_contest_name: "GPL 2023 Novice"
rating: 0
weight: 104599
solve_time_s: 44
verified: true
draft: false
---

[CF 104599I - 星际恐怖主义](https://codeforces.com/problemset/problem/104599/I)

 **评级：** -
 **标签：** -
 **求解时间：** 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵有根的树$n$节点。 每个节点$i$具有正值$a_i$。 该结构已经是一棵树，所以正好有$n-1$边，每条边都隐含着权重$1$。 在此结构之上，我们可以在任意两个不同节点之间添加一条新边$u$和$v$。 

添加这条边恰好创建了一个简单的循环，因为在一棵树中，任何两个节点之间都有一条唯一的路径。 该循环由之间的原始路径组成$u$和$v$，加上新的边$(u,v)$。 循环的总“爆炸幅度”定义为该循环上所有边权重的总和。 每个原始边缘都有贡献$1$，并且添加的边贡献$a_u + a_v$。 

所以如果之间的距离$u$和$v$在树上是$\text{dist}(u,v)$，那么由此产生的爆炸是$$\text{dist}(u,v) + (a_u + a_v).$$任务是选择最好的一对$(u,v)$来最大化这个值。 

约束允许最多$10^5$节点，这排除了任何显式检查所有对的解决方案。 一个天真的$O(n^2)$扫描对将需要大约$10^{10}$操作，远远超出了1秒的限制。 即使是每对执行 BFS 或 LCA 的方法也太慢，除非仔细减少。 

一个关键的结构约束是树是通过父指针给出的，这意味着我们可以以有根形式处理它并有效地计算深度和结构聚合。 

一些边缘案例暴露了典型的错误。 如果全部$a_i$相等，问题就简化为最大化$a_u + a_v + \text{dist}(u,v)$，所以最好的对就是直径端点对。 例如，在长度为 3 的链中，所有$a_i = 1$，答案是$2 + 2 = 4$加上距离$2$， 全部的$6$。 只考虑相邻节点的简单方法会错过这一点。 

另一个边缘情况是当最大的$a_i$sits in a leaf and pairing it with a nearby node seems attractive, but the distance term dominates and forces pairing with a farthest node instead.

 ## 方法

 A brute-force method checks every pair$(u,v)$。 对于每一对，计算树距离，例如使用 LCA 或 BFS。 每个距离查询都可以在$O(\log n)$与预处理，但有$O(n^2)$对，导致$O(n^2 \log n)$。 这对于$n = 10^5$。 

关键的观察结果是目标分为两部分：$$a_u + a_v + \text{dist}(u,v).$$这$a$-项仅取决于端点，而距离仅取决于树结构。 这建议以每个节点沿路径独立贡献的形式重写表达式。 

修复节点处的根$1$。 让$d[u]$是深度$u$。 对于任意一对，$$\text{dist}(u,v) = d[u] + d[v] - 2d[\text{lca}(u,v)].$$所以目标就变成了$$(a_u + d[u]) + (a_v + d[v]) - 2d[\text{lca}(u,v)].$$复杂的是 LCA 术语，它阻止了完全分离。 然而，我们可以重新解释结构：我们可以不进行全局思考，而是使用“子树中最好的两个候选者”思想与重新扎根式推理相结合来扎根树并处理贡献。 

对于固定节点$x$被视为最优对的 LCA，两个端点必须位于不同的子子树中$x$，或者一个端点是$x$本身。 这减少了本地问题：对于每个节点，我们想知道来自每个子子树的最佳候选值，通过以下方式测量$$f[u] = a_u + d[u].$$那么对于一个节点$x$，不同子子树中的任何一对节点都给出候选节点：$$f[u] + f[v] - 2d[x].$$因此，对于每个节点，我们只需要每个子树的顶部值，并且我们在子节点之间维护最佳组合。 

这将问题转化为树DP，其中每个节点聚合最好的两个$f$-来自其子子树的值并向上传播。 

最终的答案是最好的：

 1. 在某个 LCA 处将不同子树中的两个节点配对
 2. 节点与自身配对无效，因为$u \ne v$### 复杂度表

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(n^2 \log n)$|$O(n)$| 太慢了|
 | 最佳|$O(n)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 在节点处建立树的根$1$并计算深度$d[u]$。 

需要深度，因为每条边都有权重$1$，因此它直接给出了 LCA 形式的距离。 
2. 定义转换后的值$f[u] = a_u + d[u]$。 

这将节点贡献与树中的向上移动隔离开来。 
3. 在树上运行后序 DFS。 

每个节点都会计算两个最大的$f$-在整个子树中看到的值，按子分支分组。 
4. 在每个节点$x$，收集最好的$f$-来自每个子子树的值。 

这是必要的，因为任何有效的基于 LCA 的对都必须来自两个不同的分支。 
5. 合并节点处两个最大的此类值$x$。 

如果最佳值为$f[u]$和$f[v]$从不同的孩子中，计算候选者：$$f[u] + f[v] - 2d[x].$$这正好对应于扩展$\text{dist}(u,v)$通过 LCA。 
6. 跟踪所有节点上的最大值。 

这确保了每个可能的 LCA 都被视为结构连接点一次。 
7. 返回找到的最大值。 

### 为什么它有效

 每对节点都有一个唯一的最低公共祖先$x$。 该对的贡献完全确定于$x$一旦我们知道每个子子树的最佳代表。 转变$f[u] = a_u + d[u]$将距离公式转换为总和，其中唯一的校正项仅取决于 LCA 深度，每个聚合点的 LCA 深度都是固定的。 由于每对都按照其 LCA 进行精确考虑，因此不会遗漏任何对，也不会对任何对进行两次计数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**7)

n = int(input())
a = list(map(int, input().split()))
parent = [0] + list(map(int, input().split()))

g = [[] for _ in range(n)]
for i in range(1, n):
    p = parent[i]
    g[p-1].append(i)

depth = [0] * n

def dfs_depth(u, p):
    for v in g[u]:
        depth[v] = depth[u] + 1
        dfs_depth(v, u)

dfs_depth(0, -1)

ans = 0

def dfs(u):
    global ans
    best = []  # store f-values from different child subtrees

    f_u = a[u] + depth[u]

    for v in g[u]:
        child_best = dfs(v)
        best.append(child_best)

    # include node itself as candidate subtree
    best.append(f_u)

    # take top two
    best.sort(reverse=True)

    if len(best) >= 2:
        ans = max(ans, best[0] + best[1] - 2 * depth[u])

    return best[0]

dfs(0)

print(ans)
```该解决方案首先从父数组构造有根树，然后使用 DFS 计算深度。 这些深度用于定义
