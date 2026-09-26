---
title: "CF 105710H - 脑白质切除术"
description: "我们有一个神经元网络，其中每个神经元都是一个节点，每个突触是两个神经元之间的无向连接。 与标准的简单图不同，多个突触可以连接同一对神经元，并且突触甚至可以将神经元连接到其自身。"
date: "2026-06-26T08:01:06+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105710
codeforces_index: "H"
codeforces_contest_name: "UTPC Contest 2-12-25 Div. 1 (Advanced)"
rating: 0
weight: 105710
solve_time_s: 70
verified: true
draft: false
---

[CF 105710H - 脑白质切除术](https://codeforces.com/problemset/problem/105710/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 10s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个神经元网络，其中每个神经元都是一个节点，每个突触是两个神经元之间的无向连接。 与标准的简单图不同，多个突触可以连接同一对神经元，并且突触甚至可以将神经元连接到其自身。 

医生想要精确地进行一次切割，这意味着我们要切除一个突触。 如果移除突触会将大脑分成至少两个互不相连的部分，从而导致某些神经元无法再到达其他神经元，则该突触被认为是危险的。 任务是识别所有其移除会断开图形的突触，并按排序顺序输出它们的标识符。 如果不存在这样的突触，我们输出-1。 

每个突触都有一个唯一的整数 ID，我们必须根据这些 ID 进行推理，而不仅仅是端点。 

神经元和突触数量的限制达到几十万。 这立即排除了任何二次或每边缘重新模拟方法。 任何尝试删除每条边并运行 BFS 或 DFS 的解决方案都会花费 O(m(n + m))，这太大了。 

关键的微妙之处在于该图并不简单。 平行边缘完全改变了“关键”连接的定义。 例如，如果两个突触连接同一对神经元，移除其中一个永远不会断开该对神经元的连接，即使底层结构会很脆弱。 

忽略这一点的幼稚方法将在以下情况下失败：

 输入：```
3 2
1 0 1
2 0 1
```这里，同一对节点之间有两个平行的突触。 尽管端点在简单图中看起来像一座桥，但任何一条边都不应该被删除，因为另一条边仍然保留连接性。 简单的桥梁查找算法会错误地将它们标记为桥梁。 

另一种故障模式发生在自循环中。 从神经元到自身的突触永远不会对不同组件之间的连接做出贡献，因此删除它永远不会断开图的连接。 将其视为正常边缘会导致错误包含。 

## 方法

 暴力解决方案会迭代每个突触，将其删除，然后运行 DFS 来检查图是否仍然连接。 每次连通性检查的成本为 O(n + m)，因此总复杂度变为 O(m(n + m))。 对于多达 200,000 条边，这是不可行的。 

问题的结构表明我们确实被要求在无向图中找到桥梁。 桥是一种边缘，当被移除时，连接组件的数量会增加。 经典的解决方案是使用 DFS 时间戳和低链接值的 Tarjan 算法，该算法在线性时间 O(n + m) 内计算所有桥。 

然而，多个边缘的存在带来了复杂性。 Tarjan 的算法假设一个简单的图。 如果两个节点由多个边连接，则这些边中的任何一个都不应被视为桥，因为始终保留至少一条备用直接路由。 

这导致了关键的改进：我们首先通过跟踪每个无序节点对之间存在多少个突触来压缩多图结构。 然后我们运行一个标准的桥查找 DFS，但只有当它是 DFS 意义上的桥并且是其端点之间的唯一突触时，我们才接受边缘作为有效桥。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 删除每条边 + DFS | O(m(n + m)) | O(m(n + m)) | O(n + m) | 太慢了|
 | 具有多重过滤功能的 Tarjan 桥 | O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 我们将每个突触视为具有 ID 的不同边缘，但我们也按端点对对边缘进行分组。 

1. 我们为每个神经元构建一个邻接列表，存储所有事件突触及其目的地和 ID。 同时，我们计算连接每对无序神经元的突触数量。 这让我们稍后可以区分独特的边缘和重复的边缘。 
2. 我们在图上运行 DFS 来计算发现时间和低链接值。 这些值捕获每个子树中最早可到达的祖先，这是检测桥的标准工具。 
3.在DFS期间，当我们遍历从u到v的边时，我们立即跳过反向树边，但否则应用标准Tarjan逻辑：访问v后，我们检查是否low[v] > disk[u]。 如果这个不等式成立，那么边 (u, v) 就是一个桥候选。 
4. 在最终将该边确定为桥之前，我们检查该对 (u, v) 是否具有多个突触。 如果是这样，我们会丢弃 u 和 v 之间的所有边，使其不再是桥，因为即使在删除之后，冗余也能保证连接性。 
5. 我们收集满足两个条件的所有突触 ID：它们是 DFS 桥并且属于唯一的边对。 
6. 最后，我们对得到的ID进行排序并输出。 如果不存在，我们输出-1。 

它为何有效与两个不变量有关。 首先，DFS 低链接值正确地表征子树是否具有祖先的替代后边缘，这正是边缘在连通性中不重要的条件。 其次，边重数充当独立的结构保证：如果两个顶点共享至少两条边，则无论 DFS 结构如何，删除一条边都无法断开它们。 结合这两个事实可确保每个报告的突触确实是图的两个部分之间的独特关键连接。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**7)

n, m = map(int, input().split())

edges = []
adj = [[] for _ in range(n)]
pair_count = {}

for i in range(m):
    eid, u, v = map(int, input().split())
    edges.append((u, v, eid))
    adj[u].append((v, i))
    adj[v].append((u, i))

    a, b = (u, v) if u <= v else (v, u)
    pair_count[(a, b)] = pair_count.get((a, b), 0) + 1

disc = [-1] * n
low = [0] * n
timer = 0
is_bridge = [False] * m

def dfs(u, pe):
    global timer
    disc[u] = low[u] = timer
    timer += 1

    for v, eid in adj[u]:
        if eid == pe:
            continue

        if disc[v] == -1:
            dfs(v, eid)
            low[u] = min(low[u], low[v])

            if low[v] > disc[u]:
                is_bridge[eid] = True
        else:
            low[u] = min(low[u], disc[v])

for i in range(n):
    if disc[i] == -1:
        dfs(i, -1)

res = []

for i, (u, v, eid) in enumerate(edges):
    a, b = (u, v) if u <= v else (v, u)
    if is_bridge[i] and pair_count[(a, b)] == 1:
        res.append(eid)

if not res:
    print(-1)
else:
    res.sort()
    print(*res)
```DFS 与标准桥接算法完全相同地维护发现和低链路阵列。 唯一的偏差是我们明确地跟踪边缘身份，因为同一端点之间可以存在多个突触。 这`pe`参数可以防止立即重新访问我们来自的边缘，这在无向 DFS 中是必要的，以避免错误循环。 

这`pair_count`map 强制执行多图校正。 即使 Tarjan 在结构上将一条边标记为桥，我们也仅在它是其端点之间的唯一连接时才接受它。 

一个微妙的实现细节是我们存储每个边缘索引而不是每个节点对的桥信息，因为多个不同的突触可能连接相同的节点。 

## 工作示例

 ### 示例 1

 输入：```
4 4
212 3 0
238 1 2
394 2 0
281 0 1
```| 步骤| 当前节点| DFS行动| 低更新| 发现桥梁|
 | --- | --- | --- | --- | --- |
 | 1 | 0 | 启动 DFS | 低[0]=0 | 无 |
 | 2 | 1 | 访问从 0 | 低[1]=1 | 无 |
 | 3 | 2 | 访问从 1 | 低[2]=2 | 边缘238候选|
 | 4 | 0 | 探索下一个边缘 | 通过后边缘低更新| 无 |
 | 5 | 完成 | 检查边缘| 验证唯一性 | 212 保留 |

 唯一变得关键的边缘是突触212，因为它的移除分离了不能通过任何替代后边缘或并行连接重新连接的子树。 

此跟踪显示仅当更高祖先不存在后边缘时，单个 DFS 树边缘如何成为桥梁。 

### 示例 2

 输入：```
3 3
101 0 1
102 0 2
103 2 1
```| 步骤| DFS 树 | 低值| 桥梁状况|
 | --- | --- | --- | --- |
 | 0 | 0-1-2 结构形式循环| 所有节点可达 | 没有低[v] > 盘[u] |
 | 1 | 检测到循环 | 低链接崩溃| 没有桥梁|

 这里每条边都参与一个循环，因此每个节点都有一条备用路由。 低链路值始终传播回根，从而防止触发任何桥接条件。 

最终输出为-1，确认整个图在任何单次切割下都保持连接。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | DFS 访问每个节点和边缘一次，并进行恒定时间桥接检查 |
 | 空间| O(n + m) | 邻接表、递归栈和辅助数组 |

 考虑到最多 200,000 个突触，线性复杂度是必要的。 任何依赖于重复图遍历的解决方案都会超出时间限制，而这种方法可以一次性处理结构。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    input = _sys.stdin.readline

    n, m = map(int, input().split())
    edges = []
    adj = [[] for _ in range(n)]
    pair_count = {}

    for i in range(m):
        eid, u, v = map(int, input().split())
        edges.append((u, v, eid))
        adj[u].append((v, i))
        adj[v].append((u, i))
        a, b = (u, v) if u <= v else (v, u)
        pair_count[(a, b)] = pair_count.get((a, b), 0) + 1

    sys.setrecursionlimit(10**7)
    disc = [-1]*n
    low = [0]*n
    timer = 0
    is_bridge = [False]*m

    def dfs(u, pe):
        nonlocal timer
        disc[u] = low[u] = timer
        timer += 1
        for v, eid in adj[u]:
            if eid == pe:
                continue
            if disc[v] == -1:
                dfs(v, eid)
                low[u] = min(low[u], low[v])
                if low[v] > disc[u]:
                    is_bridge[eid] = True
            else:
                low[u] = min(low[u], disc[v])

    for i in range(n):
        if disc[i] == -1:
            dfs(i, -1)

    res = []
    for i, (u, v, eid) in enumerate(edges):
        a, b = (u, v) if u <= v else (v, u)
        if is_bridge[i] and pair_count[(a, b)] == 1:
            res.append(eid)

    return " ".join(map(str, sorted(res))) if res else "-1"

# custom cases

# single edge is bridge
assert run("2 1\n5 0 1\n") == "5", "single edge"

# cycle has no bridges
assert run("3 3\n1 0 1\n2 1 2\n3 2 0\n") == "-1", "cycle"

# parallel edges block bridges
assert run("2 2\n10 0 1\n11 0 1\n") == "-1", "parallel edges"

# chain
assert run("4 3\n1 0 1\n2 1 2\n3 2 3\n") == "1 2 3", "chain"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单边 | 5 | 基本桥梁检测|
 | 循环| -1 | 循环中没有桥梁|
 | 平行边| -1 | 多重性处理 |
 | 链条| 1 2 3 | 1 2 3 所有的边缘都是桥梁|

 ## 边缘情况

 自循环是最简单的非显而易见的情况。 对于输入如：```
2 1
100 0 0
```DFS 看到从节点到自身的边。 它永远不会满足桥接条件，因为它一开始就没有连接不同的组件。 该算法正确地忽略它，因为它既不显示为通向新节点的树边，也不满足 low[v] > disk[u]。 

相同节点之间的平行边说明了为什么仅使用结构 DFS 是不够的：```
2 2
1 0 1
2 0 1
```尽管每条边在简单的遍历中看起来都像一个候选桥，但pair_count检查会将它们过滤掉。 移除任一突触后，两个端点仍保持连接，因此两者都不会输出。 

线性节点链显示了预期的积极情况：```
4 3
1 0 1
2 1 2
3 2 3
```每条边都是其端点之间的唯一连接，并且不存在后边，因此每条边都满足桥接条件并正确报告。
