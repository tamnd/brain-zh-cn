---
title: "CF 102202H - 嫉妒的老师"
description: "将输入视为二分图。 左侧包含仍在学校的 (N-1) 名学生，右侧包含 (N) 名教师。 边 ((s,t)) 表示允许学生 (s) 向老师 (t) 送花。"
date: "2026-08-18T01:19:20+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102202
codeforces_index: "H"
codeforces_contest_name: "2019 KAIST RUN Spring Contest"
rating: 0
weight: 102202
solve_time_s: 390
verified: true
draft: false
---

[CF 102202H - 嫉妒的老师](https://codeforces.com/problemset/problem/102202/H)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 将输入视为二分图。 左侧包含仍在学校的 (N-1) 名学生，右侧包含 (N) 名教师。 边 ((s,t)) 表示允许学生 (s) 向老师 (t) 送花。 每个学生正好有 (N) 朵花，而每个老师必须正好收到 (N-1) 朵花。 

对于每个给定的边，我们必须输出一个非负整数，表示有多少朵花穿过该边。 与每个学生相关的边的值之和必须为 (N)，并且与每个教师相关的边的值之和必须为 (N-1)。 图中存在但收到零花的边是完全有效的。 

总供给量为 ((N-1)N)，总需求量为 (N(N-1))，因此全局总数自动一致。 困难完全是由缺失的边缘造成的。 这是稀疏二部图上的运输问题。 

约束足够大，足以排除一般的最大流量。 可以有 (10^5) 个学生和 (2\cdot10^5) 个允许的配对，因此 (O(NM)) 或更差的算法已经太大了。 预期的解决方案将昂贵的部分减少为二分匹配，这可以在 (O(M\sqrt N)) 中完成，然后仅进行线性图处理。 最初的竞赛解决方案也使用这种基于匹配的构造，而不是通用的流程算法。 

在一些边缘情况下，看似合理的构造会失败。 一位孤立的老师立即让答案变得不可能。 例如，```
2 1
1 1
```教师 2 没有可能的传入边缘，因此正确的输出是`-1`。 如果不小心实施，只检查每个学生是否有可用的老师，可能会错过这一点。 

一个孤立的学生同样是致命的。 例如，```
3 1
1 1
```让学生 2 无处可寄他的三朵花，所以正确的输出是`-1`。 

匹配是必要的，但还不够。 例如，第二个样本的匹配大小为 5，但图表分裂为包含学生 5 以及教师 5 和 6 的组件，而其他学生无法与这些教师交互。 正确的输出是`-1`。 在找到大小 (N-1) 的匹配后立即停止的解决方案默默地接受无效实例。 

最后，必须允许零流量边缘。 在第一个示例中，许多输入对在有效解决方案中收到零花。 将每个输入边视为必须携带正流会改变问题，并且可能会错误地拒绝有效图。 

## 方法

 最直接的方法是将问题建模为最大流。 添加一个以容量 (N) 连接到每个学生的源，以无限容量连接每个允许的学生-教师对，并将每个教师以容量 (N-1) 连接到接收器。 (N(N-1)) 流正是所需的分配。 

这个模型是正确的，但是一次增强一朵花的故意幼稚的 Ford-Fulkerson 实现可以执行 (N(N-1)) 增强。 每个增强可以检查 (O(M+N)) 图边缘，大致给出

 [
 N(N-1)(M+2N)
 ]

 边缘检查。 在最大范围内，其数量级为 (4\cdot10^{15})，远远超出了时间限制。 官方解决方案描述了小子任务的最大流公式，并给出了 (O(N^4))。 

有用的观察结果来自于查看包含某些学生子集 (S) 的剪辑。 这些学生总共拥有 (N|S|) 朵花。 只有其邻近的老师可以收到它们，并且每个这样的老师最多可以收到（N-1）朵鲜花。 因此每个非空学生子集必须至少有

 [
 N|S|\le (N-1)|N(S)|
 ]

 邻近的老师。 由于 (1\le |S|\le N-1)，这个不等式等价于

 [
 |N(S)|\ge |S|+1。 
]

 额外的一位老师是问题的关键结构。 比普通霍尔的条件还要强。 

首先找到一个覆盖所有（N-1）名学生的匹配。 只有一位老师仍然是无与伦比的。 称那位老师为根。 现在以特殊的方式定向二分图。 每个匹配的边都从学生定向到教师，而每个不匹配的边都从教师定向到学生。 

从不匹配的教师开始，使用这些有向边执行搜索。 如果到达每个学生，则搜索边形成连接所有 (N) 个教师的树。 如果无法联系到某个学生，则所需的更强的霍尔条件失败，因此不存在鲜花分配。 

剩下的结构出奇的简单。 在这棵树中，每个学生都有一个子教师，因为它的匹配边是从学生指向该教师的。 除根之外的每个老师都只有一个家长学生。 一旦我们知道了每棵子树中的学生数量，每棵树边缘上的花朵数量就可以直接从守恒定律中得出。 

暴力流模型之所以有效，是因为它准确地表达了所需的供给和需求。 它失败了，因为总流量是 (N) 的二次方。 容量相差正好一的观察结果将可行性问题转换为匹配加交替树问题，之后可以从子树大小获得实际流量值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(N(N-1)(M+N))) 单位增强 | (O(M+N)) | 太慢了 |
 | 最佳| (O(M\sqrt N)) | (O(M+N)) | 已接受 |

 ## 算法演练

 1. 构建二分图，学生在左边，教师在右边。 将原始输入边索引与每个邻接条目存储在一起，因为最终答案必须完全按照输入顺序打印。 
2. 求最大二分匹配。 我们需要匹配所有 (N-1) 名学生。 如果匹配包含少于（N-1）条边，则立即打印`-1`。 

匹配是必要的，因为任何有效的花分配都满足更强的霍尔条件，并且该条件特别意味着普通霍尔条件。 

1.找到唯一的不匹配的老师，并将其作为交替搜索的根。 
2. 将每个匹配边从其学生定向到其匹配的老师。 将每条不匹配的边从老师引导到学生。 

从无与伦比的老师开始，遵循以下指示。 每当老师找到以前未见过的学生时，将该学生添加到树中。 立即按照学生的匹配边缘找到其匹配的老师，并添加该老师。 

1. 如果搜索到的学生少于 (N-1) 名，则打印`-1`。 

假设搜索涉及一组 (k) 名学生。 它还准确地到达 (k+1) 个教师，因为根教师最初就存在，并且每个新到达的学生都会介绍其独特的匹配教师。 如果该图具有有效的分配，则更强的霍尔条件保证可以从该交替图中不匹配的教师联系到每个学生。 查看此情况的一种方法是将当前匹配与避开当前学生的匹配教师的匹配进行比较。 它们的对称差异包含从不匹配的根到该学生的交替路径。 

1. 将搜索边视为普通的有根树。 为每个学生节点赋予初始子树权重 (1)，为每个教师节点赋予初始子树权重 (0)。 以相反的顺序处理树，以便每个节点接收其子树中的学生总数。 
2. 对于孩子是学生的树边，分配

 [
 f = \运算符名称{大小}(s)。 
]

 该边将该学生与其父教师连接起来，因此 (f) 正是整个学生子树必须向上发送的花的数量。 

1. 对于孩子是老师 (t) 的树边，分配

 [
 f = N-1-\运算符名称{大小}(t)。 
]

 同样，如果其家长学生是（s），

 [
 f=N-\operatorname{size}(s)。 
]

 所有不是树边的输入边都会收到零花。 

1. 按输入顺序输出分配给每个原始边的流。 

### 为什么它有效

 关键的不变量是每个学生子树包含相同数量的学生和教师，而每个非根教师子树包含的教师恰好比学生多一名。 考虑一个学生。 它的父边携带 (\operatorname{size}(s)) 朵花，它的子教师边携带 (N-\operatorname{size}(s)) 朵花。 它们的总和正好是（N），所以每个学生都送出了他们所有的花。 

现在考虑一个非根教师 (t)。 令其子树包含 (k) 个学生。 其父学生将 (N-1-k) 朵花发送到 (t)，而子学生子树集体发送 (k) 朵花。 总数为(N-1)。 根没有父边，其子学生子树包含所有 (N-1) 个学生，因此它也恰好接收 (N-1) 个花。 

每个分配的值都是非负的，因为学生子树最多包含 (N-1) 个学生。 所有非树边都为零，因此每个原始图限制都受到尊重。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def hopcroft_karp(adj, n_left, n_right):
    pair_u = [-1] * n_left
    pair_v = [-1] * n_right
    dist = [-1] * n_left

    def bfs():
        q = deque()

        for u in range(n_left):
            if pair_u[u] == -1:
                dist[u] = 0
                q.append(u)
            else:
                dist[u] = -1

        found = False

        while q:
            u = q.popleft()

            for v in adj[u]:
                w = pair_v[v]

                if w == -1:
                    found = True
                elif dist[w] == -1:
                    dist[w] = dist[u] + 1
                    q.append(w)

        return found

    def dfs(start):
        stack = [start]
        chosen = []
        it = {}

        while stack:
            u = stack[-1]

            if u not in it:
                it[u] = 0

            i = it[u]

            while i < len(adj[u]):
                v = adj[u][i]
                i += 1
                it[u] = i

                w = pair_v[v]

                if w == -1:
                    pair_u[u] = v
                    pair_v[v] = u

                    for j in range(len(chosen) - 1, -1, -1):
                        left = stack[j]
                        right = chosen[j]
                        pair_u[left] = right
                        pair_v[right] = left

                    return True

                if dist[w] == dist[u] + 1:
                    stack.append(w)
                    chosen.append(v)
                    break
            else:
                dist[u] = -1
                stack.pop()
                if chosen:
                    chosen.pop()

        return False

    matching = 0

    while bfs():
        for u in range(n_left):
            if pair_u[u] == -1 and dfs(u):
                matching += 1

    return matching, pair_u, pair_v

def solve():
    n, m = map(int, input().split())
    left = n - 1

    adj = [[] for _ in range(left)]
    edges = []

    for idx in range(m):
        s, t = map(int, input().split())
        s -= 1
        t -= 1
        adj[s].append((t, idx))
        edges.append((s, t))

    # The matching algorithm only needs the teacher number.
    match_adj = [[t for t, _ in adj[s]] for s in range(left)]

    matching, pair_u, pair_v = hopcroft_karp(
        match_adj, left, n
    )

    if matching != left:
        print(-1)
        return

    # Find the original edge corresponding to every matching pair.
    match_edge = [-1] * left
    for s in range(left):
        mt = pair_u[s]
        for t, idx in adj[s]:
            if t == mt:
                match_edge[s] = idx
                break

    root = -1
    for t in range(n):
        if pair_v[t] == -1:
            root = t
            break

    # Nodes 0..n-1 are teachers.
    # Nodes n..n+left-1 are students.
    total_nodes = n + left
    parent = [-1] * total_nodes
    parent_edge = [-1] * total_nodes

    root_node = root
    parent[root_node] = root_node

    visited_students = [False] * left
    teacher_stack = [root_node]
    order = [root_node]

    while teacher_stack:
        tnode = teacher_stack.pop()
        t = tnode

        for s, idx in []:
            pass

        # Every adjacency entry is stored as (teacher, edge_index),
        # so scan all students that are adjacent to this teacher.
        # The graph is stored from students to teachers, therefore
        # build this reverse adjacency lazily once below.
        # This branch is intentionally replaced after reverse_adj exists.
        break

    # Reverse adjacency: teacher -> (student, original edge).
    reverse_adj = [[] for _ in range(n)]
    for s in range(left):
        for t, idx in adj[s]:
            reverse_adj[t].append((s, idx))

    # Restart the alternating-tree search.
    parent = [-1] * total_nodes
    parent_edge = [-1] * total_nodes
    parent[root_node] = root_node

    visited_students = [False] * left
    teacher_stack = [root_node]
    order = [root_node]

    while teacher_stack:
        t = teacher_stack.pop()

        for s, idx in reverse_adj[t]:
            # Matching edges point student -> teacher, so they cannot
            # be followed from a teacher.
            if pair_u[s] == t:
                continue

            if visited_students[s]:
                continue

            visited_students[s] = True

            snode = n + s
            parent[snode] = t
            parent_edge[snode] = idx
            order.append(snode)

            mt = pair_u[s]
            tchild = mt

            # A newly reached student's matched teacher is new as well.
            if parent[tchild] == -1:
                parent[tchild] = snode
                parent_edge[tchild] = match_edge[s]
                order.append(tchild)
                teacher_stack.append(tchild)

    if sum(visited_students) != left:
        print(-1)
        return

    # Count students in every subtree.
    size = [0] * total_nodes

    for node in range(n, total_nodes):
        size[node] = 1

    for node in reversed(order[1:]):
        size[parent[node]] += size[node]

    answer = [0] * m

    # Assign the flow on every tree edge.
    for node in order[1:]:
        idx = parent_edge[node]

        if node >= n:
            # Child is a student.
            answer[idx] = size[node]
        else:
            # Child is a teacher.
            answer[idx] = n - 1 - size[node]

    sys.stdout.write("\n".join(map(str, answer)))

if __name__ == "__main__":
    solve()
```输入在概念上被存储两次。`adj`将原始学生与教师的邻接关系与边缘索引保持在一起，同时`reverse_adj`是在匹配后创建的，因此交替搜索可以有效地从教师移动到邻近的学生。 

匹配仅根据教师编号计算。 知道匹配后，通过扫描该学生的邻接列表一次来恢复每个学生的匹配边缘。 由于输入对的总数为 (M)，因此此恢复成本为 (O(M))。 

交替树使用`parent`标记访问过的节点。 教师节点占用索引`0`通过`N-1`，而学生节点占据`N+s`。 这避免了为树分配单独的图形对象，并使子树计算变得简单。 

之前的第一个探索循环`reverse_adj`是不必要的，不应该出现在完善的实现中。 以下清理版本是要提交的版本：```python
import sys
from collections import deque

input = sys.stdin.readline

def hopcroft_karp(adj, n_left, n_right):
    pair_u = [-1] * n_left
    pair_v = [-1] * n_right
    dist = [-1] * n_left

    def bfs():
        q = deque()

        for u in range(n_left):
            if pair_u[u] == -1:
                dist[u] = 0
                q.append(u)
            else:
                dist[u] = -1

        found = False

        while q:
            u = q.popleft()

            for v in adj[u]:
                w = pair_v[v]
                if w == -1:
                    found = True
                elif dist[w] == -1:
                    dist[w] = dist[u] + 1
                    q.append(w)

        return found

    def dfs(start):
        stack = [start]
        chosen = []
        it = [0] * n_left

        while stack:
            u = stack[-1]

            while it[u] < len(adj[u]):
                v = adj[u][it[u]]
                it[u] += 1

                w = pair_v[v]

                if w == -1:
                    pair_u[u] = v
                    pair_v[v] = u

                    for j in range(len(chosen) - 1, -1, -1):
                        left = stack[j]
                        right = chosen[j]
                        pair_u[left] = right
                        pair_v[right] = left

                    return True

                if dist[w] == dist[u] + 1:
                    stack.append(w)
                    chosen.append(v)
                    break
            else:
                dist[u] = -1
                stack.pop()
                if chosen:
                    chosen.pop()

        return False

    matching = 0

    while bfs():
        for u in range(n_left):
            if pair_u[u] == -1 and dfs(u):
                matching += 1

    return matching, pair_u, pair_v

def solve():
    n, m = map(int, input().split())
    left = n - 1

    adj = [[] for _ in range(left)]
    reverse_adj = [[] for _ in range(n)]
    edges = [None] * m

    for idx in range(m):
        s, t = map(int, input().split())
        s -= 1
        t -= 1

        adj[s].append((t, idx))
        reverse_adj[t].append((s, idx))
        edges[idx] = (s, t)

    match_adj = [[t for t, _ in adj[s]] for s in range(left)]

    matching, pair_u, pair_v = hopcroft_karp(
        match_adj, left, n
    )

    if matching != left:
        print(-1)
        return

    match_edge = [-1] * left
    for s in range(left):
        mt = pair_u[s]
        for t, idx in adj[s]:
            if t == mt:
                match_edge[s] = idx
                break

    root = -1
    for t in range(n):
        if pair_v[t] == -1:
            root = t
            break

    total_nodes = n + left
    parent = [-1] * total_nodes
    parent_edge = [-1] * total_nodes

    parent[root] = root
    visited_student = [False] * left

    stack = [root]
    order = [root]

    while stack:
        t = stack.pop()

        for s, idx in reverse_adj[t]:
            if pair_u[s] == t:
                continue

            if visited_student[s]:
                continue

            visited_student[s] = True

            snode = n + s
            parent[snode] = t
            parent_edge[snode] = idx
            order.append(snode)

            mt = pair_u[s]
            parent[mt] = snode
            parent_edge[mt] = match_edge[s]
            order.append(mt)
            stack.append(mt)

    if not all(visited_student):
        print(-1)
        return

    size = [0] * total_nodes

    for s in range(left):
        size[n + s] = 1

    for node in reversed(order[1:]):
        size[parent[node]] += size[node]

    answer = [0] * m

    for node in order[1:]:
        idx = parent_edge[node]

        if node >= n:
            answer[idx] = size[node]
        else:
            answer[idx] = n - 1 - size[node]

    sys.stdout.write("\n".join(map(str, answer)))

if __name__ == "__main__":
    solve()
```第二个版本去掉了多余的初始化，是实际提交的版本。 Hopcroft-Karp 内部的迭代 DFS 避免了 Python 递归深度问题，这很重要，因为图的一侧可以包含 (10^5) 个顶点。 

Python 中不存在整数溢出问题。 最大流值是(N-1)，而子树计数最多是(N-1)。 唯一微妙的界限是师生公式，即`n - 1 - size[node]`， 不是`n - size[node]`。 包含 (k) 个学生的教师子树需要来自其父学生的 (N-1-k) 朵花。 

## 工作示例

 ### 示例 1

 使用以下有效匹配作为跟踪：

 [
 s_1\至 t_5,\quad
 s_2\到 t_2,\quad
 s_3\到 t_3,\quad
 s_4\到 t_1,\quad
 s_5\至 t_6。 
]

 Teacher (t_4) 是无法匹配的，因此它成为根。 有向交替树是

 [
 t_4
 \到s_1\到t_5，
 \四边形
 t_4\到 s_4\到 t_1\到 s_3\到 t_3，
 \四边形
 t_4\至 s_5\至 t_6,
 \四边形
 t_4\至 s_2\至 t_2。 
]

 | 步骤| 现任教师| 新来的学生 | 匹配老师 | 学生子树大小 |
 | --- | --- | --- | --- | --- |
 | 1 | (t_4) | (s_1) | (t_5) | (1) |
 | 2 | (t_4) | (s_4) | (t_1) | (2) |
 | 3 | (t_4) | (s_5) | (t_6) | (1) |
 | 4 | (t_4) | (s_2) | (t_2) | (1) |
 | 5 | (t_1) | (s_3) | (t_3) | (1) |

 (s_1,s_4,s_5,s_2,s_3) 的最终子树大小分别为 (1,2,1,1,1)。 生成的非零树流是

 | 边缘 | 子树大小 | 鲜花|
 | --- | --- | --- |
 | (s_1,t_4) | (s_1,t_4) | (1) | (1) |
 | (s_1,t_5) | (s_1,t_5) | (0) 教师子树 | (5) |
 | (s_4,t_4) | (s_4,t_4) | (2) | (2) |
 | (s_4,t_1) | (s_4,t_1) | (1)教师子树| (4) |
 | (s_3,t_1) | (s_3,t_1) | (1) | (1) |
 | (s_3,t_3) | (s_3,t_3) | (0) 教师子树 | (5) |
 | (s_5,t_4) | (s_5,t_4) | (1) | (1) |
 | (s_5,t_6) | (s_5,t_6) | (0) 教师子树 | (5) |
 | (s_2,t_4) | (s_2,t_4) | (1) | (1) |
 | (s_2,t_2) | (s_2,t_2) | (0) 教师子树 | (5) |

 每个学生得到总分 (6)，每个老师得到总分 (5)。 这直接证明了子树不变量。 

### 示例 2

 选择一个匹配，例如

 [
 s_1\到 t_2,\quad
 s_2\至 t_4,\quad
 s_3\到 t_3,\quad
 s_4\到 t_1,\quad
 s_5\至 t_6。 
]

 老师（t_5）是无与伦比的，成为根。 

| 步骤| 现任教师| 新来的学生 | 匹配老师| 结果 |
 | --- | --- | --- | --- | --- |
 | 1 | (t_5) | (s_5) | (t_6) | (s_5) 达到 |
 | 2 | (t_6) | 无 | 无 | 搜索停止|
 | 3 | 遥不可及的老师| (s_1,s_2,s_3,s_4) | (s_1,s_2,s_3,s_4) | 各种| 从未达到|

 仅到达一名学生，而四名学生仍留在交替树之外。 该结构因此打印`-1`。 

原因是结构性的，而不是所选匹配的偶然性。 学生 (s_1,s_2,s_3,s_4) 和他们的老师构成了图的独立部分，而 (s_5) 仅限于老师 (5) 和 (6)。 对于较大的学生群体来说，强化霍尔条件所需的额外教师缺失。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(M\sqrt N)) | Hopcroft-Karp 找到匹配项； 其余的图搜索和子树计算是线性的 |
 | 空间| (O(M+N)) | 邻接表、匹配数组、树数组和答案都具有线性大小 |

 对于 (N\le10^5) 和 (M\le2\cdot10^5)，线性部分很容易足够小。 匹配是唯一的非线性分量，并且 (O(M\sqrt N)) 是该问题的预期界限。 最初的竞赛讨论明确将 (O(E\sqrt V)) 二分匹配确定为预期方法。 

## 测试用例

 输出不是唯一的，因此测试工具应该验证输出而不是将其与一项特定分配进行比较。 下面的验证器检查每个打印值是否属于输入边缘，每个值都是非负的，每个学生恰好发送了 (N) 朵花，并且每个老师都恰好收到了 (N-1) 朵花。```python
# Run this block after defining solve() from the solution above.

import sys
import io
from contextlib import redirect_stdout

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    out = io.StringIO()
    with redirect_stdout(out):
        solve()

    sys.stdin = old_stdin
    return out.getvalue().strip()

def check_feasible(inp: str, out: str):
    data = list(map(int, inp.split()))
    it = iter(data)

    n = next(it)
    m = next(it)

    edges = []
    for _ in range(m):
        s = next(it) - 1
        t = next(it) - 1
        edges.append((s, t))

    assert out != "-1", "expected a feasible assignment"

    values = list(map(int, out.split()))
    assert len(values) == m

    student_sum = [0] * (n - 1)
    teacher_sum = [0] * n

    for value, (s, t) in zip(values, edges):
        assert value >= 0
        student_sum[s] += value
        teacher_sum[t] += value

    assert student_sum == [n] * (n - 1)
    assert teacher_sum == [n - 1] * n

sample1 = """\
6 12
1 3
1 4
1 5
2 2
2 4
3 1
3 3
4 1
4 2
4 4
5 4
5 6
"""

sample2 = """\
6 12
1 2
1 3
1 4
2 2
2 4
3 1
3 3
4 1
4 2
4 4
5 5
5 6
"""

check_feasible(sample1, run(sample1))
assert run(sample2) == "-1", "sample 2"

# Custom 1: minimum-size feasible instance.
case1 = """\
2 2
1 1
1 2
"""
check_feasible(case1, run(case1))

# Custom 2: minimum-size impossible instance because one teacher is isolated.
case2 = """\
2 1
1 1
"""
assert run(case2) == "-1", "isolated teacher"

# Custom 3: a chain-like instance that exercises nested subtree sizes.
case3 = """\
3 4
1 1
1 2
2 2
2 3
"""
check_feasible(case3, run(case3))

# Custom 4: maximum-size boundary test.
# N = 100000, M = 199998. Student i can use teachers i and i+1.
n = 100000
lines = [f"{n} {2 * (n - 1)}"]
for s in range(1, n):
    lines.append(f"{s} {s}")
    lines.append(f"{s} {s + 1}")
case4 = "\n".join(lines)

check_feasible(case4, run(case4))

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 | 任何具有 12 个值的有效赋值 | 正常可行的构造和子树流 |
 | 样品2 |`-1`| 具有匹配但没有有效花分配的图表 |
 |`2 2 / 1 1 / 1 2`| 每边各一朵花 | 最小可行 (N=2) 情况 |
 |`2 1 / 1 1`|`-1`| 孤立的教师和边界处理|
 |`3 4 / 1 1 / 1 2 / 2 2 / 2 3`| 任何有效的作业 | 教师流程中嵌套交替树和逐一树 |
 | 生成（N=100000）链 | 具有 199998 个值的任何有效分配 | 最大 (N)、最大稀疏规模和性能 |

 ## 边缘情况

 在交替搜索期间处理孤立的教师，因为该教师只有在是唯一的、不匹配的教师时才能成为根。 如果另一位老师被孤立，则当交替树到达每个老师时，没有匹配可以覆盖所有学生。 为了```
2 1
1 1
```匹配涵盖了学生 1 和教师 1，而教师 2 则作为根。 根没有传出的不匹配边，因此永远不会到达学生 1。 算法打印`-1`。 

一个孤立的学生甚至更早被拒绝。 和```
3 1
1 1
```匹配的尺寸只有一个，而学生有两个。 由于匹配并未覆盖所有学生，因此算法打印`-1`在构建交替树之前。 

覆盖每个学生的匹配仍然是不够的。 在示例 2 中，匹配大小为 5，但选择不匹配的教师作为根仅到达包含学生 5 的组件。搜索到达一名学生而不是所有五个学生，因此算法拒绝该图。 这正是普通霍尔匹配之外的附加条件。 

最小可行情况```
2 2
1 1
1 2
```有一名学生和两名可用教师。 唯一可能的任务是给每位老师一朵花。 匹配使得一位老师不匹配，根通过不匹配的边到达学生，并且两个树边都收到一朵花。 该公式使用`N - 1 - size[teacher_subtree] = 1`。 

链条箱```
3 4
1 1
1 2
2 2
2 3
```很有用，因为树是嵌套的而不是星形的。 根教师到达学生 2，其匹配教师到达学生 1，其匹配教师是叶子。 学生 2 的学生子树大小变为 (2)，学生 1 的学生子树大小变为 (1)。因此，根到学生的边获得 (2) 朵花，学生 2 向其匹配的教师发送 (1) 朵花，学生 1 向其匹配的教师发送 (2) 朵花。 每个学生恰好发送 (3)，而每个老师恰好接收 (2)。 

零流量边缘不需要特殊处理。 一旦选择了交替树，该树外部的每个输入边就保持为零。 该结构绝不会仅仅因为边缘的存在而试图迫使正流通过边缘。 

最大尺寸的情况同时强调匹配实现和线性结构。 对于 (N=100000) 和 (M=199998)，该图```
s -> t_s
s -> t_{s+1}
```for (1\le s<N) 形成一条长链。 迭代匹配和树遍历避免了递归深度失败，并且子树计算在顶点和边的数量上保持线性。
