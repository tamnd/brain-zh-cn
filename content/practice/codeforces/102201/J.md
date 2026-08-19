---
title: "CF 102201J - 嫉妒的老师"
description: "将学生和教师视为二部图的两侧。 左边有（N-1）名学生，右边有（N）名老师。 输入对 ((s,t)) 表示允许学生 (s) 向老师 (t) 送花。"
date: "2026-08-18T01:52:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102201
codeforces_index: "J"
codeforces_contest_name: "Moscow Pre-Finals Workshop 2019. KAIST Contest"
rating: 0
weight: 102201
solve_time_s: 229
verified: true
draft: false
---

[CF 102201J - 嫉妒的老师](https://codeforces.com/problemset/problem/102201/J)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 将学生和教师视为二部图的两侧。 左边有（N-1）名学生，右边有（N）名老师。 输入对 ((s,t)) 表示允许学生 (s) 向老师 (t) 送花。 

每个学生必须恰好分发 (N) 朵鲜花，而每个老师必须恰好收到 (N-1) 朵鲜花。 对于每个允许的对，我们需要选择一个非负整数。 一条边可以携带许多花，而允许的边可以携带零朵花。 输出以与输入边相同的顺序给出这些量。 如果不存在这样的分配，我们打印 (-1)。 该问题是稀疏二部图上的特殊运输问题。 

总供给量为 ((N-1)N)，总需求量为 (N(N-1))，因此全球总量已经一致。 困难完全是由于对可用的师生配对的限制造成的。 

界限 (N\le 10^5) 和 (M\le 2\cdot10^5) 排除了重复处理整个图 (N) 次的算法。 在最坏的情况下， (O(NM)) 方法可以检查大约 (2\cdot10^{10}) 条边缘。 即使是普通的单位增强最大流公式也可能需要 (N(N-1)) 次增强，在最坏的情况下给出 (O(MN^2)) 大约 (2\cdot10^{15}) 边缘检查。 我们需要一个围绕 (O(M\sqrt N)) 的匹配算法，然后是线性时间构造。 

在一些边缘情况下，看似合理的实施会失败。 例如，对于 (N=2)，```
2 2
1 1
1 2
```唯一的学生可以给每位老师一朵花，所以输出必须是`1 1`。 坚持每个老师必须与一个不同的学生匹配的实现会错误地拒绝这一点，因为最终的花数量不匹配。 

一个更微妙的情况是```
3 2
1 1
2 2
```存在包含两个学生的匹配，但教师 3 没有关联边。 正确的输出是`-1`。 因此，找到一个覆盖每个学生的匹配是必要的，但还不够。 

当老师与初始匹配不匹配时，就会发生另一种微妙的情况。 那老师的搭配并没有错误。 它正是我们构建交替结构的根源，用于构建所有所需的花朵分布。 

最后，输出值可以合法地为零。 例如，允许的边缘不能接收鲜花，因为同一学生的其他允许的边缘可以携带全部鲜花。 将每个输入边缘视为需要正值将拒绝有效的解决方案。 

## 方法

 一个直接的方法是构建流量网络。 添加一个以容量 (N) 连接到每个学生的源，以实际上无限的容量连接每个允许的学生-教师对，并将每个教师连接到以容量 (N-1) 的接收器。 (N(N-1)) 流正是所需的答案。 

这个模型是正确的，但使用通用的增广路径算法太慢了。 如果我们一次增加一朵花，则可以有 (N(N-1)) 次增加。 每个搜索可以检查 (O(M+N)) 条边，给出 (O(MN^2)) 工作，这大约是最大约束下的 (2\cdot10^{15}) 条边检查。 

有用的观察结果是，这些能力之间存在非常特殊的关系。 每个学生需要（N），而每个老师需要（N-1），并且老师比学生正好多一名。 

假设我们暂时限制每个允许的边最多携带一朵花。 覆盖所有 (N-1) 名学生的匹配给每个学生一朵花，给 (N-1) 名老师一朵花。 只有一位老师仍然是无与伦比的。 

现在想象一下为每一位可能被省略的老师构建一个匹配。 如果省略教师 (t)，我们希望所有 (N-1) 名学生与其他 (N-1) 名教师之间进行匹配。 对于每个省略的老师 (t)，在该匹配的每个边缘都放一朵花。 

有 (N) 个这样的匹配。 每个学生都属于每个匹配，因此每个学生总共收到正好 (N) 朵花。 固定的老师 (t) 属于除了省略 (t) 的匹配之外的所有匹配，因此老师恰好收到 (N-1) 朵花。 

剩下的问题是在不运行匹配算法 (N) 次的情况下构建所有这些匹配。 从覆盖所有学生的一个匹配开始，让老师 (r) 不匹配。 引导从老师到学生的每一个无与伦比的优势，以及从学生到老师的每一个匹配的优势。 从 (r) 开始，遵循这个有向交替图。 

每当我们搬家时

 [
 \text{老师 } a \rightarrow \text{学生 } s \rightarrow \text{老师 } b,
 ]

 第一条边不在匹配中，第二条边在匹配中。 翻转这两条边会更改不匹配的教师，将不匹配的教师从 (a) 移动到 (b)。 

如果从 (r) 可以到达每个教师，则这些交替转换的生成树给出从 (r) 到每个教师的路径。 沿着该路径翻转边缘会产生与目标教师不匹配的匹配。 因此，所有（N）个匹配可以由一棵树表示，而不是显式存储。 

可达性条件也正是区分可行实例和不可行实例的因素。 原始花作业的霍尔条件降低为更强的要求，即删除任何一位教师后，剩余的图仍然具有覆盖每个学生的匹配。 这正是交替可达性测试所检查的内容。 预期的解决方案使用最大二分匹配，然后使用这种交替结构，匹配时间为 (O(M\sqrt N))。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力/单位增强流程 | (O(MN^2)) 最坏情况 | (O(N+M)) | 太慢了 |
 | 最佳| (O(M\sqrt N)) | (O(N+M)) | 已接受 |

 ## 算法演练

1. 一侧使用学生，另一侧使用教师构建二部图。 保留原始边缘索引，因为最终答案必须按输入顺序打印。 
2. 使用 Hopcroft-Karp 查找最大二分匹配。 我们只需要一个大小（N-1）的匹配，这意味着每个学生都被匹配。 如果最大匹配的尺寸较小，则不存在花分配。 
3. 设(r)为该匹配无法匹配的唯一教师。 将每个不匹配的边视为从教师到学生的方向，将每个匹配的边视为从学生到教师的方向。 
4. 从(r)处开始遍历。 当遍历位于教师 (t) 时，检查每个不匹配的边 (t-s)。 学生 (s) 恰好有一个匹配边，例如 (s-u)，因此交替转换为 (t\rightarrow s\rightarrow u)。 如果 (u) 尚未到达，则使其成为教师树中 (t) 的子级。 
5. 如果从未联系到某位老师，则打印 (-1)。 无法到达的部分会产生霍尔障碍，因此不存在有效的花分配。 
6. 遍历得到一棵树，其顶点是 (N) 个教师。 每个非根教师 (u) 都有一个父教师 (p)、一条不匹配边 (p-s) 和一条匹配边 (s-u)。 这两条原始边形成树中的一个交替步骤。 
7. 以 (r) 为教师树的根并计算每个子树的大小。 令非根教师 (u) 的子树大小为 (k)。 (N) 条根到教师路径中的 (k) 条包含从 (p) 到 (u) 的树边。 
8.最初为每个原始匹配边（N）个花和每个其他边零个花。 对于树边 (p-s-u)，将不匹配边 (p-s) 上的数量更改为 (k)，并将匹配边 (s-u) 上的数量更改为 (N-k)。 

这两个值的原因很简单。 对于 (u) 子树中的每个目标教师，从 (r) 到该目标的路径会翻转这个交替对。 因此，在 (N) 个匹配中的 (k) 个匹配中恰好选择了不匹配边缘，而在其他 (N-k) 个匹配中选择了原始匹配边缘。 

### 为什么它有效

 关键的不变量是，对于每个教师 (t)，从根 (r) 到 (t) 的唯一路径是一条交替路径，其边在不匹配边和匹配边之间交替。 翻转该路径会保留匹配属性并将不匹配的教师从 (r) 更改为 (t)。 因此，对于每个教师 (t)，我们获得包含除 (t) 之外的每个学生和每个教师的匹配。 

现在对所有 (N) 个此类匹配的每条边的指标求和。 每个学生在每次匹配中匹配一次，给它（N）朵花。 老师 (t) 正好缺席一次匹配，给了它 (N-1) 朵花。 每个使用的边都属于原始图，并且所有数量都是非负的，因为子树大小在 (1) 和 (N-1) 之间。 

如果交替遍历无法到达某个老师，那么删除该老师后，图就没有所需的匹配。 因此，花的分配是不可能的。 这确定了构造的两个方向。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

sys.setrecursionlimit(300000)

def solve(stream=None):
    if stream is None:
        stream = sys.stdin
    input = stream.readline

    N, M = map(int, input().split())

    # Edge i joins student S[i] with teacher T[i].
    S = [0] * M
    T = [0] * M

    # Adjacency by student, storing edge indices.
    adj = [[] for _ in range(N - 1)]

    for i in range(M):
        s, t = map(int, input().split())
        s -= 1
        t -= 1
        S[i] = s
        T[i] = t
        adj[s].append(i)

    left_n = N - 1
    right_n = N

    # pair_s[s] = teacher matched to student s, or -1.
    # pair_t[t] = student matched to teacher t, or -1.
    pair_s = [-1] * left_n
    pair_t = [-1] * right_n
    dist = [0] * left_n
    ptr = [0] * left_n

    # A greedy initial matching greatly reduces the number of
    # Hopcroft-Karp phases in practice.
    matching = 0
    for s in range(left_n):
        for eid in adj[s]:
            t = T[eid]
            if pair_t[t] == -1:
                pair_s[s] = t
                pair_t[t] = s
                matching += 1
                break

    def bfs():
        q = deque()
        for s in range(left_n):
            if pair_s[s] == -1:
                dist[s] = 0
                q.append(s)
            else:
                dist[s] = -1

        found = False

        while q:
            s = q.popleft()
            d = dist[s]

            for eid in adj[s]:
                t = T[eid]
                ns = pair_t[t]

                if ns == -1:
                    found = True
                elif dist[ns] == -1:
                    dist[ns] = d + 1
                    q.append(ns)

        return found

    def dfs(s):
        while ptr[s] < len(adj[s]):
            eid = adj[s][ptr[s]]
            ptr[s] += 1

            t = T[eid]
            ns = pair_t[t]

            if ns == -1 or (
                dist[ns] == dist[s] + 1 and dfs(ns)
            ):
                pair_s[s] = t
                pair_t[t] = s
                return True

        dist[s] = -1
        return False

    while bfs():
        for s in range(left_n):
            ptr[s] = 0

        for s in range(left_n):
            if pair_s[s] == -1 and dfs(s):
                matching += 1

    if matching != left_n:
        return "-1\n"

    # For every student, remember the edge used by the matching.
    match_edge = [-1] * left_n
    for s in range(left_n):
        t = pair_s[s]
        for eid in adj[s]:
            if T[eid] == t:
                match_edge[s] = eid
                break

    # Root is the unique unmatched teacher.
    root = -1
    for t in range(right_n):
        if pair_t[t] == -1:
            root = t
            break

    # Teacher-tree construction.
    #
    # parent[t] = parent teacher of t.
    # parent_student[t] is the student used in the alternating step.
    # parent_edge[t] is the nonmatching edge parent[t] -> parent_student[t].
    parent = [-1] * right_n
    parent_student = [-1] * right_n
    parent_edge = [-1] * right_n

    visited_teacher = [False] * right_n
    visited_student = [False] * left_n

    visited_teacher[root] = True
    stack = [root]

    while stack:
        t = stack.pop()

        # Inspect nonmatching edges from teacher t to students.
        for s in range(left_n):
            # This scan would be too slow, so this branch is replaced below.
            pass
        # The actual traversal is performed using a reverse adjacency list.
        break

    # Reverse adjacency by teacher, storing edge indices.
    by_teacher = [[] for _ in range(right_n)]
    for eid in range(M):
        by_teacher[T[eid]].append(eid)

    stack = [root]
    while stack:
        t = stack.pop()

        for eid in by_teacher[t]:
            s = S[eid]

            # Matching edges are directed student -> teacher,
            # so from a teacher we may only use nonmatching edges.
            if pair_s[s] == t:
                continue

            if visited_student[s]:
                continue

            visited_student[s] = True
            nt = pair_s[s]

            if nt == -1 or visited_teacher[nt]:
                continue

            visited_teacher[nt] = True
            parent[nt] = t
            parent_student[nt] = s
            parent_edge[nt] = eid
            stack.append(nt)

    if not all(visited_teacher):
        return "-1\n"

    # Build the teacher tree as an ordinary adjacency list.
    tree = [[] for _ in range(right_n)]
    for t in range(right_n):
        if t == root:
            continue
        p = parent[t]
        tree[p].append(t)

    # Compute subtree sizes iteratively.
    order = [root]
    for t in order:
        for child in tree[t]:
            order.append(child)

    subtree = [1] * right_n
    for t in reversed(order):
        if t != root:
            subtree[parent[t]] += subtree[t]

    # Start from the interpretation of the original matching:
    # every matching edge occurs in all N matchings.
    ans = [0] * M
    for s in range(left_n):
        ans[match_edge[s]] = N

    # Each teacher-tree edge represents an alternating pair:
    # nonmatching edge gets subtree size,
    # matching edge gets N - subtree size.
    for t in range(right_n):
        if t == root:
            continue

        k = subtree[t]
        s = parent_student[t]

        ans[parent_edge[t]] = k
        ans[match_edge[s]] = N - k

    return "".join(f"{x}\n" for x in ans)

if __name__ == "__main__":
    sys.stdout.write(solve())
```该代码首先存储学生的每个输入关系，这是 Hopcroft-Karp 的自然表示。 边索引单独保存，以便最终金额可以完全按照输入顺序写入。 

最初的贪婪匹配只是一种优化。 Hopcroft-Karp 仍然负责获得最大匹配，因此贪心选择不会影响正确性。 

匹配数组使用`-1`作为无与伦比的价值。 匹配后，每个学生恰好有一位匹配的老师，并且恰好一位老师没有匹配的学生，因为有（N-1）名学生和（N）名老师。 

交替遍历需要相反方向的邻接，从教师到边索引，所以`by_teacher`在 (O(M)) 中构建一次。 从老师那里我们故意忽略它的匹配边缘。 一条不匹配的边通向一个学生，而该学生恰好有一个匹配的边通向树中的下一位老师。 

子树大小的计算无需递归树 DFS。 这避免了包含 (10^5) 个教师的路径上的 Python 递归深度问题。 

最终公式使用`N - k`， 不是`N - 1 - k`。 在我们翻转路径之前，原始匹配边出现在每一个 (N) 匹配中。 这些路径中恰好 (k) 条包含该树边并删除该匹配边，留下 (N-k) 次出现。 

该金额始终是零到 (N) 之间的整数，因此 Python 的任意精度整数就足够了。 

一个小的实现细节可以在生产提交中进一步简化：第一个`while stack`代码中的循环是故意无害但不必要的。 实际的教师遍历紧随其后`by_teacher`已建成。 删除该初步循环可以使提交的版本更清晰。 

这是同一解决方案的清理版本。```python
import sys
input = sys.stdin.readline
from collections import deque

sys.setrecursionlimit(300000)

def solve(stream=None):
    if stream is None:
        stream = sys.stdin
    input = stream.readline

    N, M = map(int, input().split())

    S = [0] * M
    T = [0] * M
    adj = [[] for _ in range(N - 1)]
    by_teacher = [[] for _ in range(N)]

    for i in range(M):
        s, t = map(int, input().split())
        s -= 1
        t -= 1
        S[i] = s
        T[i] = t
        adj[s].append(i)
        by_teacher[t].append(i)

    L = N - 1
    pair_s = [-1] * L
    pair_t = [-1] * N
    dist = [0] * L
    ptr = [0] * L

    matching = 0

    for s in range(L):
        for eid in adj[s]:
            t = T[eid]
            if pair_t[t] == -1:
                pair_s[s] = t
                pair_t[t] = s
                matching += 1
                break

    def bfs():
        q = deque()

        for s in range(L):
            if pair_s[s] == -1:
                dist[s] = 0
                q.append(s)
            else:
                dist[s] = -1

        found = False

        while q:
            s = q.popleft()
            d = dist[s]

            for eid in adj[s]:
                t = T[eid]
                ns = pair_t[t]

                if ns == -1:
                    found = True
                elif dist[ns] == -1:
                    dist[ns] = d + 1
                    q.append(ns)

        return found

    def dfs(s):
        while ptr[s] < len(adj[s]):
            eid = adj[s][ptr[s]]
            ptr[s] += 1

            t = T[eid]
            ns = pair_t[t]

            if ns == -1 or (
                dist[ns] == dist[s] + 1 and dfs(ns)
            ):
                pair_s[s] = t
                pair_t[t] = s
                return True

        dist[s] = -1
        return False

    while bfs():
        for s in range(L):
            ptr[s] = 0

        for s in range(L):
            if pair_s[s] == -1 and dfs(s):
                matching += 1

    if matching != L:
        return "-1\n"

    match_edge = [-1] * L
    for s in range(L):
        target = pair_s[s]
        for eid in adj[s]:
            if T[eid] == target:
                match_edge[s] = eid
                break

    root = pair_t.index(-1)

    parent = [-1] * N
    parent_student = [-1] * N
    parent_edge = [-1] * N
    visited = [False] * N

    visited[root] = True
    stack = [root]

    while stack:
        t = stack.pop()

        for eid in by_teacher[t]:
            s = S[eid]

            if pair_s[s] == t:
                continue

            nt = pair_s[s]

            if visited[nt]:
                continue

            visited[nt] = True
            parent[nt] = t
            parent_student[nt] = s
            parent_edge[nt] = eid
            stack.append(nt)

    if not all(visited):
        return "-1\n"

    tree = [[] for _ in range(N)]
    for t in range(N):
        if t != root:
            tree[parent[t]].append(t)

    order = [root]
    for t in order:
        order.extend(tree[t])

    subtree = [1] * N
    for t in reversed(order):
        if t != root:
            subtree[parent[t]] += subtree[t]

    ans = [0] * M

    for s in range(L):
        ans[match_edge[s]] = N

    for t in range(N):
        if t == root:
            continue

        k = subtree[t]
        s = parent_student[t]

        ans[parent_edge[t]] = k
        ans[match_edge[s]] = N - k

    return "".join(f"{x}\n" for x in ans)

if __name__ == "__main__":
    sys.stdout.write(solve())
```## 工作示例

 ### 示例 1

 样本有（N=6），因此有 5 名学生和 6 名教师。 有了输入的顺序，就可以进行贪心匹配选择

 [
 1\右箭头3,\四
 2\右箭头2,\四
 3\右箭头1,\四
 4\右箭头4,\四
 5\右箭头6。 
]

 5老师是无与伦比的，所以它成为了根。 

交替遍历创建教师树

 [
 5\右箭头3\右箭头1\右箭头4,
 ]

 教师 4 也有孩子 2 和 6。生成的子树大小如下所示。 

| 老师| 家长 | 过渡中的学生| 子树大小 |
 | ---| ---| ---| ---|
 | 5 | 无 | 无 | 6 |
 | 3 | 5 | 1 | 5 |
 | 1 | 3 | 3 | 4 |
 | 4 | 1 | 4 | 3 |
 | 2 | 4 | 2 | 1 |
 | 6 | 4 | 5 | 1 |

 例如，树过渡 (5\rightarrow1\rightarrow3) 使用不匹配边 ((1,5)) 和匹配边 ((1,3))。 由于教师 3 的子树大小为 5，因此边 ((1,5)) 接收 5 朵花，边 ((1,3)) 接收 (6-5=1)。 

所得边缘值的完整轨迹为：

 | 输入边沿 | 匹配状态 | 树子树 | 鲜花|
 | ---| ---| ---| ---|
 | (1,3) | 匹配| 5 | 1 |
 | (1,4) | 非树| 0 | 0 |
 | (1,5) | 树不匹配 | 5 | 5 |
 | (2,2) | 匹配| 1 | 5 |
 | (2,4) | 树不匹配 | 1 | 1 |
 | (3,1) | 匹配| 4 | 2 |
 | (3,3) | 树不匹配 | 4 | 4 |
 | (4,1) | 树不匹配 | 3 | 3 |
 | (4,2) | 非树| 0 | 0 |
 | (4,4) | 匹配| 3 | 3 |
 | (5,4) | 树不匹配 | 1 | 1 |
 | (5,6) | 匹配| 1 | 5 |

 每个学生都会收到 (6) 朵鲜花。 每位老师都会收到 (5)。 这些值与样本输出不同，这是预期的，因为问题允许任何有效的构造。 

### 示例 2

 第二个样本也有同样的情况（N=6），但是学生5只能匹配到老师5和6。贪心匹配可以覆盖学生1、2、3和5，而学生4则无法匹配。 

| 学生| 可用教师 | 匹配状态|
 | ---| ---| ---|
 | 1 | 2, 3, 4 | 匹配|
 | 2 | 2, 4 | 匹配|
 | 3 | 1, 3 | 匹配|
 | 4 | 1, 2, 4 | 无与伦比的|
 | 5 | 5, 6 | 匹配|

 最大匹配的大小为 4，而不是所需的 5。Hopcroft-Karp 因此在没有匹配学生 4 的情况下完成，算法立即打印 (-1)。 

这展示了第一次可行性测试。 当图表甚至无法为每个学生提供一位不同的老师时，就没有理由构建交替树。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(M\sqrt N)) | 霍普克罗夫特-卡普占主导地位； 交替遍历、树构建和子树计算都是 (O(N+M)) |
 | 空间| (O(N+M)) | 邻接表、匹配数组、树数组和答案存储 |

 最大匹配是唯一的非线性部分。 对于 (M\le2\cdot10^5) 和 (N\le10^5)，预期的 (O(M\sqrt N)) 界限在最差渐近估计中大致为 (6.3\cdot10^7) 个基本边缘层操作，而所有构造工作都是线性的。 内存使用量完全在 1024 MB 限制之内。 最初的竞赛讨论还将 (O(E\sqrt V)) 二分匹配确定为预期的复杂性。 

## 测试用例

 因为这是一个特殊判断问题，所以确切的有效输出不是唯一的。 下面的测试验证结构条件，而不是与某一特定输出进行比较。```python
# This test file assumes the solution above is available as:
# from solution import solve

import io
from solution import solve

def run(inp: str) -> str:
    return solve(io.StringIO(inp))

def validate(inp: str, out: str):
    data = list(map(int, inp.split()))
    n, m = data[0], data[1]

    edges = []
    pos = 2
    allowed = set()

    for _ in range(m):
        s = data[pos] - 1
        t = data[pos + 1] - 1
        pos += 2
        edges.append((s, t))
        allowed.add((s, t))

    out = out.strip()

    if out == "-1":
        return False

    values = list(map(int, out.split()))
    assert len(values) == m

    row = [0] * (n - 1)
    col = [0] * n

    for value, (s, t) in zip(values, edges):
        assert value >= 0
        row[s] += value
        col[t] += value

    assert row == [n] * (n - 1)
    assert col == [n - 1] * n

    return True

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

assert validate(sample1, run(sample1)), "sample 1"

assert run(sample2).strip() == "-1", "sample 2"

minimum = """\
2 2
1 1
1 2
"""
assert validate(minimum, run(minimum)), "minimum valid case"

disconnected = """\
3 2
1 1
2 2
"""
assert run(disconnected).strip() == "-1", "isolated teacher"

complete = """\
4 12
1 1
1 2
1 3
1 4
2 1
2 2
2 3
2 4
3 1
3 2
3 3
3 4
"""
assert validate(complete, run(complete)), "complete bipartite graph"

# Maximum-size edge count: N = 100000, M = 200000.
# Each student i connects to teachers i and i+1, then two
# additional legal edges make M exactly 200000.
n = 100000
lines = [f"{n} 200000"]

for i in range(1, n):
    lines.append(f"{i} {i}")
    lines.append(f"{i} {i + 1}")

lines.append("1 3")
lines.append("1 4")

maximum = "\n".join(lines) + "\n"
assert validate(maximum, run(maximum)), "maximum-size valid case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品1 | 任何有效的 (M) 行分配 | 循环图的完整构建 |
 | 样品2 |`-1`| 未能获得覆盖每个学生的匹配|
 | (N=2)，两条边 | 任何有效的作业 | 最小边界情况 |
 | (N=3)，两个断开的边 |`-1`| 完整的学生匹配是不够的 |
 | 完成 (K_{3,4}) | 任何有效的作业 | 密集图和许多可能的解决方案|
 | (N=100000,\ M=200000) | 任何有效的作业 | 最大尺寸输入和长交替树 |

 ## 边缘情况

 最小情况```
2 2
1 1
1 2
```有一名学生和两名老师。 Hopcroft-Karp 找到与教师 1 匹配的学生 1，将教师 2 保留为根。 交替遍历使用教师 2 的边和教师 1 的匹配边，创建两顶点教师树。 教师1的子树大小为1，因此匹配的边得到(2-1=1)朵花，另一条边得到1朵花。 两位老师都收到 (N-1=1)，学生收到 (N=2)。 

孤立教师案例```
3 2
1 1
2 2
```更微妙。 最大匹配涵盖两个学生，但教师 3 未匹配并且没有导致交替遍历的边。 遍历仅到达教师 3 本身，因此并未访问所有教师。 该算法打印 (-1)。 这抓住了仅检查是否所有学生都可以匹配的常见错误。 

接受零花的允许边缘是自然处理的。 在示例 1 中，边 ((1,4)) 可以接收零，因为学生 1 已经通过 ((1,3)) 和 ((1,5)) 发送了所有六朵花。 该算法从不假设输入边必须携带正流。 

许多边形成环的情况也是安全的。 交替遍历故意只保留到达每个教师的第一个转换，从而生成一棵树。 额外的边缘保留为零，除非它们属于原始匹配。 它们是不必要的，因为树已经代表了所有 (N) 个所需的匹配。 

最大尺寸的情况有(N=100000)和(M=200000)。 一条长长的交替转换链可以包含几乎所有的教师，因此递归树遍历可能会超过 Python 的递归深度。 该实现迭代地计算遍历顺序和子树大小，保持构造阶段线性且对于边界情况安全。
