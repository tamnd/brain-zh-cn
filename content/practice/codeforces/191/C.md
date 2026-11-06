---
title: "CF 191C - 傻瓜与道路"
description: "输入描述了城市树。 由于每对城市之间都只有一条简单路径，因此道路网络形成一个连通的非循环图。 然后我们得到几对城市。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "trees"]
categories: ["algorithms"]
codeforces_contest: 191
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 121 (Div. 1)"
rating: 1900
weight: 191
solve_time_s: 115
verified: true
draft: false
---

[CF 191C - 傻瓜与道路](https://codeforces.com/problemset/problem/191/C)

 **评级：** 1900
 **标签：** 数据结构、dfs 和类似、树
 **求解时间：** 1m 55s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 输入描述了城市树。 由于每对城市之间都只有一条简单路径，因此道路网络形成一个连通的非循环图。 

然后我们得到几对城市。 每对代表一次旅行：一个傻瓜从城市出发旅行`a`到城市`b`沿着树中独特的简单路径。 对于每条道路，我们必须计算有多少次行程使用该道路。 

直接解释是：对于每个查询`(a, b)`，找到路径从`a`到`b`并增加该路径每条边上的计数。 这在逻辑上是正确的，因为树保证了路由的唯一性。 

这些限制立即排除了这种方法。 这棵树最多有`10^5`顶点，也可以有`10^5`查询。 单个路径可以包含`O(n)`最坏情况下的边缘，例如链形树。 这给出了`O(nk)`操作，可以变成`10^10`，远远超出了极限。 

树的结构给了我们更强大的东西。 两个节点之间的每条路径都可以使用它们的最低公共祖先（Lowest Common Ancestor）来表示，通常缩写为 LCA。 我们可以标记端点，然后使用一个 DFS 聚合贡献，而不是在每个查询上显式地遍历每条边。 

如果实施不小心，一些边缘情况很容易处理不当。 

考虑两个端点都是同一城市的查询：```
3
1 2
2 3
1
2 2
```没有使用道路，因此正确的输出是：```
0 0
```总是沿着路径递增而不检查空路径的简单实现可能会意外地计算边缘。 

当一个端点是另一个端点的祖先时，会出现另一种微妙的情况：```
4
1 2
2 3
3 4
1
2 4
```该路径仅使用边缘`(2,3)`和`(3,4)`。 如果 LCA 处理从 LCA 的父级而不是 LCA 本身减去两次，则计数将变得不正确。 

星形树也强调正确性：```
5
1 2
1 3
1 4
1 5
2
2 3
4 5
```中心边缘计数应为：```
2 2 2 2
```每一次旅行都经过根源。 子树累积中的错误通常会低估此类配置，因为许多路径在一个节点处重叠。 

## 方法

 暴力解决方案独立处理每个查询。 对于每对`(a, b)`，我们找到它们之间的路径并增加该路径上的所有边。 

由于图是一棵树，因此实现此目的的一种方法是使用 DFS 或父攀登。 该解决方案是正确的，因为每一对都只有一条简单路径，因此访问这些边直接与问题定义匹配。 

问题在于规模。 单个路径可能包含`n - 1`边缘。 和`10^5`查询，最坏情况的工作大致变成：```
10^5 × 10^5 = 10^10
```这太慢了几个数量级。 

关键的观察是我们实际上并不需要立即更新边缘。 我们只需要通过每条边的路径的最终数量。 

假设我们添加`+1`在查询路径的两个端点处，然后减去`2`在他们的 LCA 中。 如果我们稍后从叶子向上执行 DFS，每个子树都会累积经过它的活动路径的数量。 

为什么这有效？ 

想象一条连接节点的边`u`给它的父级。 聚合后，值存储在`u`等于进入以 为根的子树的路径数`u`减去也将其留在子树内的路径数。 正是那些剩余的路径必须穿过之间的边缘`u`及其父级。 

这将昂贵的每路径边缘更新转换为：

 1. 每个查询的恒定时间端点标记。 
2. 在树上进行一次 DFS 累积。 

剩下的唯一挑战是有效计算 LCA。 二元提升解决了这个问题`O(log n)`每个查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(nk) | O(nk) | O(n) | 太慢了 |
 | 最佳 | O((n + k) log n) | O((n + k) log n) | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 1. 根据输入边构建树邻接表。 

我们需要一个允许 DFS 遍历和祖先预处理的结构。 
2. 从任意根（通常是节点）运行 DFS`1`。 

在此 DFS 期间，存储：

 - 每个节点的父节点
 - 每个节点的深度
 - 连接节点与其父节点的边索引

 LCA 计算和按输入顺序将答案分配回边缘都需要这些值。 
3. 搭建二元升降台。 

让`up[v][j]`成为`2^j`- 节点的第一个祖先`v`。 

这使我们能够以对数时间向上移动，而不是一次攀登一个边缘。 
4. 对于每个查询`(a, b)`, 计算`lca(a, b)`。 

然后申请：

 -`cnt[a] += 1`-`cnt[b] += 1`-`cnt[lca] -= 2`这隐式地对路径进行编码，而不是直接接触每个边缘。 
5. 从根运行第二个 DFS。 

对于每个子子树，递归计算其累加值并将其添加到当前节点。 

如果子树返回值`x`，那么正好`x`路径穿过该子项与其父项之间的边缘。 
6. 将返回的子树值存储为将子树连接到其父树的边的答案。 

由于每条边都属于有根树中的一个子父关系，因此每条边都得到一个答案。 
7. 按照原始输入顺序输出答案。 

### 为什么它有效

 每个查询都会在其路径的两个端点添加一个单元。 当子树总和向上聚合时，除了沿着端点之间的实际路线之外，路径内部的贡献会取消。 

减法`2`LCA 是关键的修正。 如果没有它，共享祖先区域将被计算两次。 取消后，每条边都会收到从该边的一侧穿过到另一侧的查询路径的数量。 

对于父母之间的边缘`p`和孩子`u`，子树总和在`u`等于该子树内的查询端点的数量减去完全包含在其中的完整路径的数量。 每条剩余的不匹配路径都必须穿过边缘`(p, u)`。 该计数正是所需的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(1 << 25)

LOG = 17 + 1

def solve():
    n = int(input())

    graph = [[] for _ in range(n + 1)]

    edges = []

    for idx in range(n - 1):
        u, v = map(int, input().split())
        graph[u].append((v, idx))
        graph[v].append((u, idx))
        edges.append((u, v))

    parent = [[0] * (n + 1) for _ in range(LOG)]
    depth = [0] * (n + 1)
    edge_id = [-1] * (n + 1)

    def dfs(v, p):
        parent[0][v] = p

        for to, idx in graph[v]:
            if to == p:
                continue

            depth[to] = depth[v] + 1
            edge_id[to] = idx
            dfs(to, v)

    dfs(1, 0)

    for j in range(1, LOG):
        for v in range(1, n + 1):
            parent[j][v] = parent[j - 1][parent[j - 1][v]]

    def lca(a, b):
        if depth[a] < depth[b]:
            a, b = b, a

        diff = depth[a] - depth[b]

        for j in range(LOG):
            if diff & (1 << j):
                a = parent[j][a]

        if a == b:
            return a

        for j in range(LOG - 1, -1, -1):
            if parent[j][a] != parent[j][b]:
                a = parent[j][a]
                b = parent[j][b]

        return parent[0][a]

    k = int(input())

    cnt = [0] * (n + 1)

    for _ in range(k):
        a, b = map(int, input().split())

        g = lca(a, b)

        cnt[a] += 1
        cnt[b] += 1
        cnt[g] -= 2

    ans = [0] * (n - 1)

    def dfs2(v, p):
        total = cnt[v]

        for to, idx in graph[v]:
            if to == p:
                continue

            subtotal = dfs2(to, v)

            ans[idx] = subtotal
            total += subtotal

        return total

    dfs2(1, 0)

    print(*ans)

solve()
```第一个 DFS 以树为根并记录结构信息。 这`edge_id`数组会记住哪个输入边将节点连接到其父节点。 该映射是必要的，因为答案必须按原始输入顺序而不是 DFS 顺序打印。 

二进制升降台以两倍距离的幂存储祖先。 的价值`LOG`只需要满足`2^LOG > n`。 和`n ≤ 10^5`，十八级就够了。 

LCA 函数首先均衡深度，然后将两个节点一起向上提升，直到它们的父节点匹配。 这给出了每个查询的对数复杂度。 

路径编码步骤是解决方案的核心。 添加到两个端点并从 LCA 中减去两次会在树上创建差异数组样式表示。 没有直接更新边。 

第二个DFS执行累加。 子子树的返回值等于穿过连接该子树与其父树的边的路径数。 因此`ans[idx] = subtotal`是正确的。 

一个微妙的实现细节是在将小计添加到当前节点之前分配边缘答案。 小计代表通过该边缘的流量。 当它合并到父总计中后，这种区别就消失了。 

另一个细节是递归深度。 链状树可能有深度`10^5`，因此必须增加递归限制。 

## 工作示例

 ### 示例 1

 输入：```
5
1 2
1 3
2 4
2 5
2
1 4
3 5
```树结构：```
    1
   / \
  2   3
 / \
4   5
```查询是`(1,4)`和`(3,5)`。 

LCA 计算：

 | 查询 | 生命周期评估 |
 | ---| ---|
 | 1 4 | 1 |
 | 3 5 | 1 |

 端点更新后：

 | 节点| 碳纳米管值|
 | ---| ---|
 | 1 | -2 |
 | 2 | 0 |
 | 3 | 1 |
 | 4 | 1 |
 | 5 | 1 |

 现在自下而上聚合。 

| 节点已处理 | 退回金额 | 边缘答案 |
 | ---| ---| ---|
 | 4 | 1 | 边(2,4)=1 |
 | 5 | 1 | 边(2,5)=1 |
 | 2 | 2 | 边(1,2)=2 |
 | 3 | 1 | 边(1,3)=1 |

 最终输出：```
2 1 1 1
```该跟踪显示了多条路径如何通过子树和自然组合。 边缘`(1,2)`属于两条路线，因此其累加值变为`2`。 

### 自定义示例

 输入：```
4
1 2
2 3
3 4
2
1 4
2 3
```树：```
1 - 2 - 3 - 4
```LCA 计算：

 | 查询 | 生命周期评估 |
 | ---| ---|
 | 1 4 | 1 |
 | 2 3 | 2 |

 差异更新：

 | 节点| 碳纳米管|
 | ---| ---|
 | 1 | -1 |
 | 2 | -1 |
 | 3 | 1 |
 | 4 | 1 |

 自下而上聚合：

 | 节点已处理 | 退回金额 | 边缘答案 |
 | ---| ---| ---|
 | 4 | 1 | 边(3,4)=1 |
 | 3 | 2 | 边(2,3)=2 |
 | 2 | 1 | 边(1,2)=1 |

 输出：```
1 2 1
```此示例演示了链上的重叠路径。 中间的边缘属于两条路线，因此累加计数`2`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + k) log n) | O((n + k) log n) | DFS 预处理是线性的，每个查询需要一次 LCA 计算 |
 | 空间| O(n log n) | O(n log n) | 二进制升降台主导内存使用 |

 和`n`和`k`两者都达到`10^5`，这种复杂性很容易满足限制。 大约执行了几百万次操作，如果仔细实现的话，这完全在 Python 2 秒的限制之内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    sys.setrecursionlimit(1 << 25)

    LOG = 18

    n = int(input())

    graph = [[] for _ in range(n + 1)]

    for idx in range(n - 1):
        u, v = map(int, input().split())
        graph[u].append((v, idx))
        graph[v].append((u, idx))

    parent = [[0] * (n + 1) for _ in range(LOG)]
    depth = [0] * (n + 1)

    def dfs(v, p):
        parent[0][v] = p

        for to, idx in graph[v]:
            if to == p:
                continue

            depth[to] = depth[v] + 1
            dfs(to, v)

    dfs(1, 0)

    for j in range(1, LOG):
        for v in range(1, n + 1):
            parent[j][v] = parent[j - 1][parent[j - 1][v]]

    def lca(a, b):
        if depth[a] < depth[b]:
            a, b = b, a

        diff = depth[a] - depth[b]

        for j in range(LOG):
            if diff & (1 << j):
                a = parent[j][a]

        if a == b:
            return a

        for j in range(LOG - 1, -1, -1):
            if parent[j][a] != parent[j][b]:
                a = parent[j][a]
                b = parent[j][b]

        return parent[0][a]

    k = int(input())

    cnt = [0] * (n + 1)

    for _ in range(k):
        a, b = map(int, input().split())

        g = lca(a, b)

        cnt[a] += 1
        cnt[b] += 1
        cnt[g] -= 2

    ans = [0] * (n - 1)

    def dfs2(v, p):
        total = cnt[v]

        for to, idx in graph[v]:
            if to == p:
                continue

            subtotal = dfs2(to, v)

            ans[idx] = subtotal
            total += subtotal

        return total

    dfs2(1, 0)

    return " ".join(map(str, ans))

# provided sample
assert run(
"""5
1 2
1 3
2 4
2 5
2
1 4
3 5
"""
) == "2 1 1 1", "sample 1"

# minimum tree
assert run(
"""2
1 2
1
1 2
"""
) == "1", "single edge"

# no queries
assert run(
"""3
1 2
2 3
0
"""
) == "0 0", "no paths"

# chain with overlapping paths
assert run(
"""4
1 2
2 3
3 4
2
1 4
2 3
"""
) == "1 2 1", "overlapping chain"

# same-node query
assert run(
"""3
1 2
2 3
1
2 2
"""
) == "0 0", "empty path"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单边树 |`1`| 最小的非平凡树|
 | 没有查询 |`0 0`| 空工作负载的正确处理|
 | 重叠链|`1 2 1`| 共享边缘积累|
 | 同节点查询 |`0 0`| 空路径不得影响边缘 |

 ## 边缘情况

 考虑查询在同一节点开始和结束的情况：```
3
1 2
2 3
1
2 2
```生命周期评估为`(2,2)`是`2`。 更新顺序变为：```
cnt[2] += 1
cnt[2] += 1
cnt[2] -= 2
```所以净效应为零。 在子树聚合期间，每个子树返回零，并且所有边缘答案保持为零。 这正确地模拟了没有经过的道路。 

现在考虑一个祖先-后代查询：```
4
1 2
2 3
3 4
1
2 4
```生命周期评估是`2`。 更新变成：```
cnt[2] += 1
cnt[4] += 1
cnt[2] -= 2
```净值：```
cnt[2] = -1
cnt[4] = 1
```自下而上的聚合给出：```
edge(3,4) = 1
edge(2,3) = 1
edge(1,2) = 0
```该路径正确地排除了祖先上方的边缘。 

最后，考虑一棵星形树：```
5
1 2
1 3
1 4
1 5
2
2 3
4 5
```每个查询都经过节点`1`。 所有叶子的子树总和变为：```
child 2 -> 1
child 3 -> 1
child 4 -> 1
child 5 -> 1
```所以连接到中心的每条边都会被计数`1`，并且因为每对使用两个不同的辐条，所以最终答案是：```
1 1 1 1
```这证实了通过根的重叠流量被正确聚合，而没有重复计算。
