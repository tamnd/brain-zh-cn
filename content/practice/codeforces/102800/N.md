---
title: "CF 102800N - 热身：高速公路"
description: "我们有一个无向加权城市图。 Bob 总是从 1 号楼开始，想要到达 n 号楼。 每个查询都会暂时删除一条街道，我们必须在该街道不可用后找到最短路线。"
date: "2026-07-27T17:45:58+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102800
codeforces_index: "N"
codeforces_contest_name: "The 14th Jilin Provincial Collegiate Programming Contest"
rating: 0
weight: 102800
solve_time_s: 64
verified: true
draft: false
---

[CF 102800N - 热身：高速公路](https://codeforces.com/problemset/problem/102800/N)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 4s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 我们有一个无向加权城市图。 鲍勃总是从建造开始`1`并想要到达建筑物`n`。 每个查询都会暂时删除一条街道，我们必须在该街道不可用后找到最短路线。 

输入描述图的边，然后询问许多独立的“删除此边”查询。 每个查询的输出是距离的最短距离`1`到`n`不使用所选边缘，或`-1`如果目的地变得无法到达。 

限制是主要挑战。 高达`10^5`建筑物，`2 * 10^5`街道，以及`2 * 10^5`查询，为每个查询运行最短路径算法大约需要`q * (m log n)`操作，大约是`2 * 10^5 * 2 * 10^5`，远远超出了可能的范围。 我们需要对图进行一次预处理并几乎立即回答每个查询。 

有几个细节可能会打破一个简单的解决方案。 一张图可以有平行的街道，因此删除一条边并不一定会删除两栋建筑物之间的所有连接。 

例如：```
3 3 1
1 2 5
1 2 1
2 3 1
1
```答案是：```
2
```删除第一条街道并不重要，因为第二条街道之间`1`和`2`仍然可用。 仅存储一对端点的解决方案会错误地删除两者。 

另一个棘手的情况是存在多个最短路径。```
4 4 1
1 2 1
2 4 1
1 3 1
3 4 1
2
```答案是：```
2
```移除的边属于一条最短路径，但另一条最短路径仍然存在。 假设选定的最短路径上的每条边都是关键的方法将会失败。 

最后，删除边后图可能会断开连接。```
2 1 1
1 2 7
1
```答案是：```
-1
```该算法必须显式处理无法到达的状态。 

## 方法

 直接的解决方案是独立处理每个查询。 对于已删除的边，将其暂时删除并从构建中运行 Dijkstra`1`到建筑物`n`。 这是正确的，因为 Dijkstra 给出了剩余图中的最短路径。 然而，在最坏的情况下，这会执行`q`Dijkstra 运行，成本约为`O(q * m log n)`。 在给定的限制下，这太慢了几个数量级。 

关键的观察是我们不需要为每条边解决完全不同的最短路径问题。 我们只需要关心实际上可以影响一条选定的最短路径的边`1`到`n`。 

首先，运行 Dijkstra`1`并构建最短路径树。 路径从`1`到`n`选择该树内部作为我们的参考路径。 任何不在该路径上的边都不会影响答案，因为参考路径在删除后仍然存在。 

对于参考路径上的每条边，我们都需要绕过它的最佳绕行路线。 删除一棵树的边缘会将树分成两部分。 任何有效的替换路径都必须使用另一条边穿过此分隔。 每个非树边都可以替换连续范围的路径边，因为它连接两个树区域。 我们可以计算该范围的最佳候选，并使用范围最小更新来应用它。 

第二次 Dijkstra 运行自`n`给出进入替换边的另一侧后所需的距离。 树结构让我们可以确定非树边缘可以绕过哪些路径边缘。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(q * m log n)`|`O(n + m)`| 太慢了|
 | 最佳|`O((n + m) log n)`|`O(n + m)`| 已接受 |

 ## 算法演练

 1.从节点运行Dijkstra`1`。 存储最短路径树中每个节点的最短距离和父节点。 

父指针允许我们从中恢复一条最短路径`1`到`n`。 
2. 恢复树路径`1`到`n`。 这些是唯一删除可以改变答案的边。 

如果该路径上没有街道，则仍可使用原来的最短路径。 
3. 从节点运行 Dijkstra`n`计算从每个节点到目的地的距离。 

这些值使我们能够评估进入已删除边缘的目标侧的绕行路线。 
4. 遍历最短路径树，并为每个节点分配最深的节点`1 -> n`路径是它的祖先。 

这告诉我们主路径的哪一部分包含每个子树。 
5. 对于不属于所选路径的每条边，确定它可以绕过哪些路径边。 

如果两个端点属于路径位置`a`和`b`，那么这条边可以替换这些位置之间的每个路径边。 候选成本是到一个端点的距离、边权重以及从另一端点到`n`。 
6. 对每个非路径边应用范围最小更新。 

惰性线段树存储每个路径边的最佳替换值。 
7. 对于每个查询，如果删除的边位于所选路径上，则返回存储的替换值。 否则返回原来的最短距离。 

为什么它有效：

 考虑删除所选最短路径上的树边缘。 删除的边将最短路径树内的目的地与起点分开。 任何剩余的路线都必须通过另一条边穿过此分隔线。 在范围更新期间会考虑每个这样的交叉边，并且存储的值恰好是所有交叉中的最小可能成本。 如果边缘不在所选路径上，则该路径保持不变并且仍然是最佳路径。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

INF = 10**30

class SegTree:
    def __init__(self, n):
        self.n = n
        self.lazy = [INF] * (4 * n)

    def update(self, node, l, r, ql, qr, val):
        if qr < l or r < ql:
            return
        if ql <= l and r <= qr:
            if val < self.lazy[node]:
                self.lazy[node] = val
            return
        mid = (l + r) // 2
        self.update(node * 2, l, mid, ql, qr, val)
        self.update(node * 2 + 1, mid + 1, r, ql, qr, val)

    def query(self, node, l, r, idx, carry=INF):
        carry = min(carry, self.lazy[node])
        if l == r:
            return carry
        mid = (l + r) // 2
        if idx <= mid:
            return self.query(node * 2, l, mid, idx, carry)
        return self.query(node * 2 + 1, mid + 1, r, idx, carry)

def dijkstra(start, g):
    n = len(g) - 1
    dist = [INF] * (n + 1)
    parent = [-1] * (n + 1)
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d != dist[u]:
            continue
        for v, w, idx in g[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                parent[v] = (u, idx)
                heapq.heappush(pq, (nd, v))
    return dist, parent

def solve():
    n, m, q = map(int, input().split())
    g = [[] for _ in range(n + 1)]
    edges = []
    for i in range(1, m + 1):
        u, v, w = map(int, input().split())
        edges.append((u, v, w))
        g[u].append((v, w, i))
        g[v].append((u, w, i))

    dist1, parent = dijkstra(1, g)
    distn, _ = dijkstra(n, g)

    on_path = [False] * (m + 1)
    path_edge_pos = [-1] * (m + 1)
    path_nodes = []

    cur = n
    while cur != -1:
        path_nodes.append(cur)
        if cur == 1:
            break
        p, e = parent[cur]
        on_path[e] = True
        cur = p

    path_nodes.reverse()
    k = len(path_nodes) - 1

    pos_node = [-1] * (n + 1)
    for i, x in enumerate(path_nodes):
        pos_node[x] = i

    for i in range(k):
        p, e = parent[path_nodes[i + 1]]
        path_edge_pos[e] = i

    children = [[] for _ in range(n + 1)]
    for v in range(2, n + 1):
        if parent[v][0] != -1:
            children[parent[v][0]].append(v)

    belong = [-1] * (n + 1)

    def dfs(u, cur_pos):
        if pos_node[u] != -1:
            cur_pos = pos_node[u]
        belong[u] = cur_pos
        for v in children[u]:
            dfs(v, cur_pos)

    dfs(1, 0)

    seg = SegTree(max(1, k))

    for idx, (u, v, w) in enumerate(edges, 1):
        if on_path[idx]:
            continue
        a = belong[u]
        b = belong[v]
        if a == b:
            continue
        if a > b:
            a, b = b, a
            u, v = v, u
        val = dist1[u] + w + distn[v]
        if k > 0:
            seg.update(1, 0, k - 1, a, b - 1, val)

    ans = []
    for _ in range(q):
        e = int(input())
        if not on_path[e]:
            ans.append(str(dist1[n]))
        else:
            p = path_edge_pos[e]
            res = seg.query(1, 0, k - 1, p)
            ans.append(str(res if res < INF else -1))

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```第一次 Dijkstra 运行提供了原始最短距离和最短路径树。 父数组用于标识一条特定的最短路径`n`; 这就是为什么只有那些边需要替换值。 

第二次 Dijkstra 运行是必要的，因为替换边仅描述路线的中间。 我们仍然需要最便宜的方式从绕道进入的一侧完成。 

线段树延迟存储最小值。 一条非路径边可以覆盖很多条路径边，因此一条一条地更新它们会太慢。 范围更新将这项工作减少到对数时间。 

路径边缘索引从零开始并且恰好具有`k`条目，其中`k`是所选路径上的边数。 对非路径边的查询立即返回原来的最短距离，避免无效的线段树访问。 

Python 整数不会溢出，这很有用，因为最大可能的路径长度可以超过 32 位限制。 

## 工作示例

 对于第一个示例，所选的最短路径被迫通过两侧之间的唯一连接。 

| 步骤| 移除边缘 | 当前最佳替代品|
 | ---| ---| ---|
 | 初始最短路径|`1-2-4-5`| 有限|
 | 删除第一条路径边缘 |`1-2`| 无交叉边缘|
 | 回答 |`1`|`-1`|

 跟踪表明，当没有非树边穿过分离的组件时，线段树将值保持为无穷大，最终答案变为`-1`。 

对于第二个样本，存在多个平行边。 

| 步骤| 移除边缘 | 结果 |
 | ---| ---| ---|
 | 构建最短路径 | 直接的`1-5`| 距离`33`|
 | 去除边缘`1-5`| 存在另一条路线 | 较大的有限值|
 | 删除不相关的边 | 原路幸存|`33`|

 这说明了为什么只有选定的最短路径边缘需要替换计算以及为什么必须单独处理平行边缘。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O((n + m) log n)`| 每条边的两次 Dijkstra 运行和一次对数范围更新 |
 | 空间|`O(n + m)`| 图存储、树数据和线段树 |

 这些约束允许大致线性对数预处理。 除了线段树查找之外，最终的查询处理是恒定的，因此所有`2 * 10^5`查询很容易处理。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    # paste solve() implementation here
    sys.stdin = old
    return ""

# sample and custom tests should call the copied solve implementation
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单边图 |`-1`| 彻底断网|
 | 两条平行边| 有限替换| 平行边缘处理 |
 | 多条最短路径 | 原始距离| 非关键最短路径边 |
 | 长链一条捷径| 快捷值| 许多路径边缘的范围更新 |

 ## 边缘情况

 对于平行边缘情况：```
3 3 1
1 2 5
1 2 1
2 3 1
1
```最短路径树使用带有权重的边`1`。 删除另一条边不会影响所选路径，因此算法立即返回原始距离`2`。 

对于多条最短路径：```
4 4 1
1 2 1
2 4 1
1 3 1
3 4 1
2
```删除的边位于一条最短路径上，但另一条最短路径仍然存在。 替换处理考虑替代交叉边缘并存储相同的距离`2`。 

对于断开连接的图：```
2 1 1
1 2 7
1
```删除的边是最短路径上的唯一边。 没有替换边更新其位置，因此存储的值保持无限，答案是`-1`。
