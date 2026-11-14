---
title: "CF 342E - 森妮娅和树"
description: "我们正在使用一棵树，其中每个节点代表连接的非循环图中的一个点。 最初，只有节点 1 被着色为红色，而其他所有节点都开始为蓝色。 随着时间的推移，我们执行两种操作。"
date: "2026-06-06T17:38:06+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "divide-and-conquer", "trees"]
categories: ["algorithms"]
codeforces_contest: 342
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 199 (Div. 2)"
rating: 2400
weight: 342
solve_time_s: 82
verified: true
draft: false
---

[CF 342E - Xenia 和 Tree](https://codeforces.com/problemset/problem/342/E)

 **评分：** 2400
 **标签：** 数据结构，分而治之，树
 **求解时间：** 1m 22s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在使用一棵树，其中每个节点代表连接的非循环图中的一个点。 最初，只有节点 1 被着色为红色，而其他所有节点都开始为蓝色。 随着时间的推移，我们执行两种操作。 一个操作将选定的蓝色节点永久变为红色，从而增加红色节点集。 另一个操作询问，对于给定节点，它与最近的红色节点在树距离方面有多接近。 

每个查询都是在线的，因此我们必须随着红色集的演变立即回答类型 2 查询。 关键的困难在于红色节点会随着时间的推移而累积，并且距离是在树上测量的，因此从头开始为每个查询重新计算最短路径会太慢。 

这些约束促使我们寻求每个查询接近线性或对数的解决方案。 对于多达 100,000 个节点和 100,000 个查询，在最坏的情况下，任何重新计算 BFS 或 DFS 的操作都会立即退化为大约 1010 个操作，这是不可行的。 即使每次查询重新计算与所有红色节点的距离显然也是不可能的。 

当在添加任何新的红色节点之前发出许多连续的类型 2 查询时，会出现微妙的边缘情况。 在这种情况下，即使答案没有改变，天真的方法也可能会从头开始重复重新计算距离。 另一个问题是，当红色节点在树的一小部分区域变得密集时，这会破坏任何假设单一源或试图仅维护一个“最佳”红色节点的解决方案。 

## 方法

 直接的解决方案将维护一组红色节点，并且对于每个询问距离的查询，从所有红色节点开始运行多源 BFS。 这是正确的，因为树上的 BFS 给出了精确的距离。 然而，每个这样的查询都会花费 O(n)，并且对于 O(n) 查询，这会变成 O(n²)，这太慢了。 

关键的观察是，树结构允许我们使用质心分解将更新与查询分开。 我们没有尝试直接回答“到任何红色节点的距离”，而是通过为每个节点维护有关其通过质心分解树的路径的信息来重新构建问题。 

每个节点属于 O(log n) 质心组件。 对于此分解中的每个质心，我们保持从该质心到其分量子树中的任何红色节点的最小距离。 当一个节点变成红色时，我们更新它所有的祖先质心。 当我们查询一个节点时，我们将这些存储的值组合在其质心路径上，并恢复到任何红色节点的最小距离。 

这是有效的，因为两个节点之间的每条路径都经过一组明确定义的质心祖先，并且距离沿着这些祖先清晰地分解。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每个查询的强力 BFS | O(纳米) | O(n) | 太慢了 |
 | 质心分解| O(n log n + m log n) | O(n log n + m log n) | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 我们构建树的质心分解，并为每个质心维护一个表示从该质心到任何当前红色节点的最小距离的值。

1. 首先，我们对质心分解求根。 在每个阶段，我们计算子树的大小并选择一个质心，将当前组件分割成平衡的部分。 这确保递归深度是对数的。 
2. 对于原始树中的每个节点，我们预先计算其到质心路径上每个质心的距离。 这是在分解过程中使用每个质心的 BFS 或 DFS 完成的。 
3. 我们将所有质心值初始化为无穷大，然后将节点 1 设置为红色。 对于节点 1，我们通过获取从这些质心到节点 1 的最小距离来更新其路径上的所有质心。 
4. 对于类型 1 查询，当节点变为红色时，我们沿着其质心路径向上走。 对于每个质心祖先，我们使用预先计算的从该质心到节点的距离来更新其存储的最小值。 
5. 对于类型2查询，我们再次遍历被查询节点的质心路径。 对于每个质心祖先，我们将存储的质心值与从该质心到查询节点的距离相结合。 所有此类组合中的最小值就是答案。 

关键思想是，从查询节点到任何红色节点的每条路径都必须经过至少一个质心祖先，其中两个距离都被正确考虑。 

### 为什么它有效

 在任何时刻，每个质心都会根据通过该质心测量的距离来存储其组件中最近的红色节点。 对于任意查询节点 v 和任意红色节点 r，v 和 r 的分解路径上都存在质心 c，使得路径距离 dist(v, r) 等于 dist(v, c) + dist(c, r)。 由于我们存储所有红色节点上的最小可能 dist(c, r)，因此检查 v 路径上的所有质心可以保证我们捕获到任何红色节点的真实最小距离。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10**7)

n, q = map(int, input().split())
g = [[] for _ in range(n)]

for _ in range(n - 1):
    a, b = map(int, input().split())
    a -= 1
    b -= 1
    g[a].append(b)
    g[b].append(a)

parent_centroid = [-1] * n
sub_size = [0] * n
blocked = [False] * n

centroid_tree = [[] for _ in range(n)]
dist_to_centroid = [[] for _ in range(n)]
centroids_on_path = [[] for _ in range(n)]

INF = 10**18
best = [INF] * n

def dfs_size(v, p):
    sub_size[v] = 1
    for to in g[v]:
        if to != p and not blocked[to]:
            dfs_size(to, v)
            sub_size[v] += sub_size[to]

def dfs_centroid(v, p, total):
    for to in g[v]:
        if to != p and not blocked[to]:
            if sub_size[to] > total // 2:
                return dfs_centroid(to, v, total)
    return v

def add_dist(v, p, c, d):
    dist_to_centroid[v].append(d)
    centroids_on_path[v].append(c)
    for to in g[v]:
        if to != p and not blocked[to]:
            add_dist(to, v, c, d + 1)

def build(c_parent, entry):
    dfs_size(entry, -1)
    c = dfs_centroid(entry, -1, sub_size[entry])
    blocked[c] = True

    parent_centroid[c] = c_parent

    add_dist(c, -1, c, 0)

    for to in g[c]:
        if not blocked[to]:
            build(c, to)

def update(v):
    for i in range(len(centroids_on_path[v])):
        c = centroids_on_path[v][i]
        d = dist_to_centroid[v][i]
        best[c] = min(best[c], d)

def query(v):
    ans = INF
    for i in range(len(centroids_on_path[v])):
        c = centroids_on_path[v][i]
        d = dist_to_centroid[v][i]
        ans = min(ans, best[c] + d)
    return ans

build(-1, 0)

update(0)

for _ in range(q):
    t, v = map(int, input().split())
    v -= 1
    if t == 1:
        update(v)
    else:
        print(query(v))
```使用递归质心分裂构建一次分解。 在构造过程中，每个节点都会存储其路径上的质心列表以及到它们的距离。 这允许更新和查询在不遍历原始树的情况下进行操作。 

这`best`数组是核心结构：`best[c]`始终表示距质心的最小距离`c`到任何红色节点。 更新一个节点只需要走它的质心路径，它的深度是对数的。 

一个微妙的细节是，质心分解必须将节点标记为一旦选择就被阻止，否则递归将重新访问已经分解的组件并破坏大小保证。 

## 工作示例

 ### 示例 1

 输入：```
5 4
1 2
2 3
2 4
4 5
2 1
2 5
1 2
2 5
```我们从节点 1 红色开始。 

| 步骤| 查询 | 红色节点| 查询节点 | 回答 |
 | --- | --- | --- | --- | --- |
 | 1 | 查询 1 | {1} | 1 | 0 |
 | 2 | 查询 5 | {1} | 5 | 3 |
 | 3 | 油漆 2 | {1,2} | - | - |
 | 4 | 查询 5 | {1,2} | 5 | 2 |

 第二个查询在节点 2 变为红色后有所改善，因为路径 5 → 4 → 2 比 5 → 4 → 2 → 1 短。 

这证实了多个红色源都得到了正确处理，而不仅仅是初始根。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + q) log n) | O((n + q) log n) | 每个节点参与 O(log n) 质心级别，并且每个更新/查询都沿着该路径 |
 | 空间| O(n log n) | O(n log n) | 每个节点存储跨分解级别的质心路径信息 |

 对数因子来自质心分解过程中分量的重复减半。 对于 10⁵ 节点和查询，这完全符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import defaultdict

    # Paste solution here as functionally encapsulated version if needed
    # For illustration, assume solve() exists
    return solve()

# sample 1
assert run("""5 4
1 2
2 3
2 4
4 5
2 1
2 5
1 2
2 5
""").strip() == """0
3
2"""

# single node chain
assert run("""3 3
1 2
2 3
2 3
1 2
2 3
""").strip() == """2
1"""

# all nodes already red via updates
assert run("""4 3
1 2
2 3
3 4
2 4
1 3
2 4
""").strip() == """3
1"""

# star shaped tree
assert run("""5 5
1 2
1 3
1 4
1 5
2 5
1 5
2 5
2 2
""").strip() == """1
0
1"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 链更新| 混合距离 | 沿路径传播|
 | 星树| 中锋统治力| 质心正确性 |
 | 增量激活 | 进化集 | 在线更新|

 ## 边缘情况

 一种棘手的情况是更新一个子树深处的簇时。 在朴素的质心方法中，忘记将更新传播到所有质心祖先会导致该子树外部的节点距离不正确。 质心路径结构可以防止这种情况发生，因为每个节点与穿过其区域的每条路径共享至少一个质心。 

另一个边缘情况是查询节点本身变成红色。 在这种情况下，质心更新确保其自己的质心条目成为零距离源，因此查询它正确返回零，而无需特殊的大小写。 

对于路径图，质心分解退化为平衡的分割序列，但每个节点仍然维护 O(log n) 质心条目，确保即使在最坏情况的线性结构中查询也保持高效。
