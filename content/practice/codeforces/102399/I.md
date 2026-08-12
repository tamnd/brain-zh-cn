---
title: "CF 102399I - \u0416\u0443\u043b\u0438\u043a，\u043d\u0435\u0432\u043e\u0440\u0443\u0439"
description: "我们有一个简单的连通无向图。 Swiper 选择一组非空的真顶点，并将这些顶点与所有关联边一起删除。 剩余的顶点必须保持与移除之前相同的模数 (3)。"
date: "2026-08-10T17:23:57+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102399
codeforces_index: "I"
codeforces_contest_name: "2019 \u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432, \u043b\u0438\u0433\u0430 A"
rating: 0
weight: 102399
solve_time_s: 671
verified: true
draft: false
---

[CF 102399I - \u0416\u0443\u043b\u0438\u043a，\u043d\u0435\u0432\u043e\u0440\u0443\u0439]（https://codeforces.com/problemset/problem/102399/I）

 **评级：** -
 **标签：** -
 **求解时间：** 11m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个简单的连通无向图。 Swiper 选择一组非空的真顶点，并将这些顶点与所有关联边一起删除。 剩余的顶点必须保持与移除之前相同的模数 (3)。 

令 (S) 为被窃取的顶点，令 (R=V\setminus S) 为保留的顶点。 对于每个 (v\in R)，从 (v) 到 (S) 的边恰好消失。 因此条件是

 [
 \deg_S(v)\equiv 0\pmod 3。 
]

 由于 (\deg_G(v)=\deg_R(v)+\deg_S(v))，相同的条件可以写为

 [
 \deg_R(v)\equiv\deg_G(v)\pmod 3.
 ]

 第二种形式更容易构建。 我们将构建一个合适的剩余顶点集 (R)，然后窃取 (R) 之外的每个顶点。 

原始 Codeforces 版本有 (n,m\le 500000)，所有测试用例的 (n) 和 (m) 之和也以 (500000) 为界。 最初的比赛限制为 2 秒和 512 MB。 这立即排除了图形大小的任何二次方，甚至重复线性次数的遍历也会太昂贵。 每个图的目标是 (O(n+m))，最多达到恒定数量的图遍历。 

在一些小情况下，实现可能会默默地产生无效答案。 有一个顶点，```
1
1 0
```该图没有合适的非空子集可供窃取，所以答案是`No`。 盲目地看到度数可被 (3) 整除并保留该顶点的程序会意外地尝试窃取零顶点。 

对于两个相连的顶点，```
1
2 1
1 2
```两个度数均为 (1)。 唯一的非空真被盗集合有一个顶点，但输出需要至少两个被盗顶点。 正确答案是`No`。 

一个周期也需要特殊处理。 为了```
1
4 4
1 2
2 3
3 4
4 1
```每个顶点都有度 (2)。 整个图是一个有效的保留循环，但保留整个图意味着什么也没有窃取。 环的任何真子集都包含其端点具有内部度 (1) 的路径，该路径与原始残差 (2) 不匹配。 因此答案是`No`。 

第四个微妙的情况是一个顶点度数可被 (3) 整除的图。 例如，```
1
4 3
1 2
1 3
1 4
```顶点 (1) 的度数 (3)。 仅保留顶点 (1) 是有效的，因为所有三个关联边都消失了，并且 (3\equiv0\pmod3)。 因此，三片叶子可能会被偷走。 

## 方法

 直接蛮力在概念上很简单。 枚举顶点的每个非空真子集 (S)，计算 (S) 之外的每个顶点有多少个邻居属于 (S)，并检查每个这样的计数是否可被 (3) 整除。 这是正确的，因为它准确地测试了合法盗窃的定义。 有 (2^n-2) 个可能的子集，如果图由邻接表表示，则检查一个子集需要 (O(n+m)) 时间。 因此，最坏情况的复杂度是

 [
 O(2^n(n+m))。 
]

 对于（n=500000），这不仅太慢，而且完全不可行。 

有用的观察是停止考虑任意子集。 对于每个剩余的顶点 (v)，其内部度数必须与其原始度数具有相同的余数模 (3)。 这意味着具有原始度数残差 (0)、(1) 和 (2) 的顶点自然表示可以保留的不同小结构。 

根据度模 (3)，将这三种类型称为 (Z,A,B)。 

(Z) 顶点可以单独保留。 其内度为(0)，正是所需要的余数。 

可以保留通过适当路径连接的两个 (A) 顶点。 两个端点有一条内部边，每个内部 (B) 顶点都有两条内部边。 两个 (A) 顶点之间的最短路径恰好给出了这种结构。 

可以保留由 (B) 顶点组成的循环。 每个循环顶点都有两条内部边，与残差 (2) 匹配。 选择最短的循环使其成为无弦的，因此每个循环顶点实际上在所选集合内恰好有两个邻居。 

如果这些结构都不存在，则只有一个 (A) 顶点和 (B) 顶点形成森林。 每个树组件必须至少接触唯一的 (A) 顶点两次。 两个这样的组件给出了从 (A) 顶点返回到自身的两条路径，形成仅共享 (A) 顶点的两个循环。 保留这两条路径和 (A) 顶点会在 (A) 顶点处给出内部度 (4)，这又是 (1\bmod3)，而路径上的每个 (B) 顶点都有内部度 (2)。 

这些案例非常详尽。 官方问题是 Codeforces 1239F 问题，这种分类是公认解决方案背后的核心建设性思想。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(2^n(n+m))) | (O(n+m)) | 太慢了|
 | 最佳 | (O(n+m)) | (O(n+m)) | 已接受 |

 ## 算法演练

 1. 计算每个顶点的度并将其分类`degree % 3`。 这三个类别是（Z）、（A）和（B）。 该分类告诉我们保留顶点必须具有模 (3) 的内部度数。 
2.如果存在(Z)-顶点(v)，则仅保留(v)。 其内部度数为零，与其原始度数模 (3) 匹配。 如果 (n>2)，窃取所有其他顶点会给出有效答案。 对于 (n=1) 来说，没有什么可窃取的，并且 (n=2) 不能在连通图中包含 (Z) 顶点。 
3. 寻找完全位于 (B) 顶点内部的循环。 循环为每个选定的顶点提供恰好两个选定的邻居，这是 (B) 顶点所需的残差。 我们需要无弦循环，因此我们找到 DFS 树意义上的最短循环。 祖先和后代之间的非树边创建了一个基本循环，并且选择具有最小树距离的循环给出了一个没有弦的循环。 
4. 如果存在这样的循环并且不使用每个顶点，则窃取其补集。 如果环是整个图，则该图就是一个环，并且通过这种构造不存在适当的解决方案。 仅当补集不能满足所需的输出大小时，我们才继续处理接下来的情况。 
5. 如果至少有两个 (A) 顶点，则从一个 (A) 顶点开始在图中运行 BFS，并在到达另一个 (A) 顶点时停止。 生成的路径是最短的，因此它内部不能包含另一个 (A) 顶点。 它的两个端点有一个内部邻居，而其内部 (B) 顶点有两个内部邻居。 保留这条路并窃取其他一切。 
6. 如果前面的构造失败，则没有（Z）顶点，没有（B）循环，并且最多有一个（A）顶点。 由于该图是连通的并且具有多个顶点，因此实际上必须恰好有一个 (A) 顶点。 其他每个顶点都是 (B)，由 (B) 顶点导出的子图是一个森林。 
7. 考虑该 (B) 森林的一个连通分量 (T)。 假设它有 (r) 条从其顶点到唯一 (A) 顶点的边。 由于每个 (B)-顶点都有度数 (2\bmod3)，

 [
 2|V(T)|\equiv 2|E(T)|+r\pmod3。 
]

 因为(T)是一棵树，所以(|E(T)|=|V(T)|-1)。 替换给出

 [
 r\equiv2\pmod3。 
]

 因此，每棵 (B) 树至少有两条到 (A) 顶点的边。 还必须至少有两个这样的分量，因为唯一 (A) 顶点的度数为 (1\bmod3)，而一个分量将贡献 (2\bmod3)。 

1. 在两个不同的 (B) 组件中，选择与 (A) 顶点相邻的两个顶点。 在每个组件中，从一个这样的顶点开始，找到与 (A) 相邻的最近的其他顶点。 它们之间的路径内部不包含其他 (A) 邻居，因此添加 (A) 顶点会将该路径变成一个干净的循环。 保留两条路径和 (A) 顶点。 
2. 如果得到的保留集是正确的并且至少留下两个被盗顶点，则输出其补集。 如果是整个图，则该图恰好由在 (A) 处连接的两条 (A) 到 (A) 路径组成，并且在这种最终情况下不存在合法的正确保留集。 早期的构造已经处理了所有其他可能性。 

为什么有效：对于每个构造，保留集中的度数与原始度数具有完全相同的残差。 (Z) 顶点具有内度 (0)。 保留的 (A) 到 (A) 路径在其端点处给出内部度数 (1)，在其 (B) 内部顶点处给出内部度数 (2)。 无弦 (B) 循环在任何地方都给出内度 (2)。 在最终构造中，每个选定的 (B) 路径在其 (B) 顶点处具有内部度 (2)，而唯一的 (A) 顶点具有四个选定的邻居。 由于 (4\equiv1\pmod3)，它的残数也被保留。

穷竭论证遵循相同的结构。 如果存在 (Z) 顶点，则第一个构造起作用。 否则，(B)-循环给出第二个结构。 否则，两个 (A) 顶点给出第三个构造。 如果这些都没有发生，则恰好有一个 (A) 顶点，并且 (B) 子图是一片森林，这会强制形成最终的结构。 如果最终结构占据整个图，则任何有效的保留集都必须包含唯一的 (A) 顶点和至少两个 (B) 组件，从而强制保留两条完整路径，因此不存在正确的解决方案。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def make_answer(n, keep):
    mark = bytearray(n)
    for v in keep:
        mark[v] = 1

    stolen = [v + 1 for v in range(n) if not mark[v]]

    if 1 < len(stolen) < n:
        return stolen
    return None

def find_b_cycle(g, typ):
    n = len(g)

    color = bytearray(n)
    parent = [-1] * n
    depth = [0] * n
    tin = [-1] * n
    tout = [-1] * n

    timer = 0

    for s in range(n):
        if typ[s] != 2 or color[s]:
            continue

        color[s] = 1
        tin[s] = timer
        timer += 1

        stack = [(s, 0)]

        while stack:
            u, idx = stack[-1]

            if idx == len(g[u]):
                color[u] = 2
                tout[u] = timer
                stack.pop()
                continue

            v = g[u][idx]
            stack[-1] = (u, idx + 1)

            if typ[v] != 2:
                continue

            if color[v] == 0:
                parent[v] = u
                depth[v] = depth[u] + 1
                color[v] = 1
                tin[v] = timer
                timer += 1
                stack.append((v, 0))

    best_anc = -1
    best_desc = -1
    best_diff = 10**18

    for u in range(n):
        if typ[u] != 2:
            continue

        for v in g[u]:
            if v <= u or typ[v] != 2:
                continue

            if parent[v] == u or parent[u] == v:
                continue

            if tin[u] <= tin[v] < tout[u]:
                anc, desc = u, v
            elif tin[v] <= tin[u] < tout[v]:
                anc, desc = v, u
            else:
                continue

            diff = depth[desc] - depth[anc]

            if diff < best_diff:
                best_diff = diff
                best_anc = anc
                best_desc = desc

    if best_anc == -1:
        return None

    cycle = []
    x = best_desc

    while x != best_anc:
        cycle.append(x)
        x = parent[x]

    cycle.append(best_anc)
    return cycle

def find_a_path(g, typ):
    n = len(g)
    start = -1

    for v in range(n):
        if typ[v] == 1:
            start = v
            break

    if start == -1:
        return None

    parent = [-2] * n
    parent[start] = -1
    q = deque([start])

    target = -1

    while q:
        u = q.popleft()

        for v in g[u]:
            if typ[v] == 0 or parent[v] != -2:
                continue

            parent[v] = u

            if typ[v] == 1:
                target = v
                q.clear()
                break

            q.append(v)

        if target != -1:
            break

    if target == -1:
        return None

    path = []
    x = target

    while x != -1:
        path.append(x)
        x = parent[x]

    path.reverse()
    return path

def find_tree_path_to_attachment(g, start, attach):
    n = len(g)

    parent = [-2] * n
    parent[start] = -1
    q = deque([start])
    target = -1

    while q:
        u = q.popleft()

        for v in g[u]:
            if parent[v] != -2:
                continue

            if attach[v] == 0:
                parent[v] = u
                q.append(v)
            elif v != start:
                parent[v] = u
                target = v
                q.clear()
                break

        if target != -1:
            break

    if target == -1:
        return None

    path = []
    x = target

    while x != -1:
        path.append(x)
        x = parent[x]

    path.reverse()
    return path

def solve_case(n, m):
    g = [[] for _ in range(n)]
    deg = [0] * n

    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        g[u].append(v)
        g[v].append(u)
        deg[u] += 1
        deg[v] += 1

    typ = [d % 3 for d in deg]

    # Case 1: a degree-0-mod-3 vertex.
    for v in range(n):
        if typ[v] == 0:
            keep = [v]
            ans = make_answer(n, keep)
            if ans is not None:
                return ans

    # Case 2: a cycle consisting only of degree-2-mod-3 vertices.
    cycle = find_b_cycle(g, typ)

    if cycle is not None:
        ans = make_answer(n, cycle)
        if ans is not None:
            return ans

    # Case 3: a path between two degree-1-mod-3 vertices.
    a_count = sum(1 for x in typ if x == 1)

    if a_count >= 2:
        path = find_a_path(g, typ)

        if path is not None:
            ans = make_answer(n, path)
            if ans is not None:
                return ans

    # Case 4: exactly one A vertex and the B-subgraph is a forest.
    if a_count != 1:
        return None

    a = typ.index(1)

    attach = bytearray(n)
    for v in g[a]:
        if typ[v] == 2:
            attach[v] = 1

    visited = bytearray(n)
    chosen_components = []

    for s in range(n):
        if typ[s] != 2 or visited[s]:
            continue

        stack = [s]
        visited[s] = 1
        attachments = []

        while stack:
            u = stack.pop()

            if attach[u]:
                attachments.append(u)

            for v in g[u]:
                if typ[v] == 2 and not visited[v]:
                    visited[v] = 1
                    stack.append(v)

        if len(attachments) >= 2:
            chosen_components.append(attachments)

            if len(chosen_components) == 2:
                break

    if len(chosen_components) < 2:
        return None

    keep = {a}

    for attachments in chosen_components:
        start = attachments[0]
        path = find_tree_path_to_attachment(g, start, attach)

        if path is None:
            return None

        keep.update(path)

    ans = make_answer(n, keep)
    return ans

def main():
    t = int(input())
    out = []

    for _ in range(t):
        line = input()

        while line and not line.strip():
            line = input()

        n, m = map(int, line.split())

        ans = solve_case(n, m)

        if ans is None:
            out.append("No")
        else:
            out.append("Yes")
            out.append(str(len(ans)))
            out.append(" ".join(map(str, ans)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```度数组是在读取边时计算的，因此不需要单独的遍历来对顶点进行分类。 价值`typ[v]`正是原始度数的残差，并在整个构造过程中使用。 

循环例程执行迭代 DFS，因为 Python 递归对于具有 (500000) 个顶点的图不安全。`tin`和`tout`描述 DFS 间隔，允许将每个非树边识别为祖先-后代边。 在这些边缘中，我们选择最小的深度差。 其相应树路径内的任何弦本身都是具有严格较小深度差的非树边，因此所选循环没有弦。 

(A) 路径是通过 BFS 找到的。 由于 BFS 在第一个其他 (A) 顶点处停止，因此路径内部不能包含另一个 (A) 顶点。 这正是我们需要的残基 (1) 端点。 

最后一种情况使用唯一的 (A) 顶点来标记与其相邻的每个 (B) 顶点。 在每个 (B) 树中，从一个标记的顶点开始并在第一个其他标记的顶点处停止给出一条没有标记的内部顶点的路径。 这可以防止唯一的 (A) 顶点将不需要的弦插入路径中间。 

实现使用`bytearray`用于 DFS 颜色、访问过的标志和附件标记。 与存储多个长度 (500000) 的数组的 Python 布尔值或整数相比，这可以节省大量内存。 Python 中不存在整数溢出问题，所有顶点索引在读取后都会立即转换为从零开始的形式。 仅在打印时最终答案才会转换回基于一的索引。 

## 工作示例

 对于示例中的第一张图，该图是一个三角形。 每个顶点的度数为 (2)，因此所有三个顶点都是 (B) 顶点。 (B) 子图包含一个环，但该环包含每个顶点。 窃取其补码不会窃取任何内容，因此该构造被拒绝。 

| 舞台| 状态|
 | ---| ---|
 | 度| (2,2,2) | (2,2,2) |
 | 类型 | (B,B,B) |
 | 找到 (Z)-顶点 | 没有 |
 | (B)-循环| (1-2-3-1) |
 | 循环使用所有顶点 | 是的 |
 | (A)-顶点 | 无 |
 | 最终森林案例| 不适用 |
 | 回答 |`No`|

 这说明了为什么检测周期本身还不够。 所选的保留结构必须合适。 已经是循环的整个图无法使用，因为不会有被盗的顶点。 

对于第二张图，度数为 (2,5,2,1,1,1)。 不存在 (Z) 顶点，(B) 顶点是 (1) 和 (3)，由一条边连接，因此不存在 (B) 循环。 顶点 (4,5,6) 是 (A) 顶点。 BFS 从顶点 (4) 通过顶点 (2) 到达顶点 (5)。 

| 舞台| 状态|
 | ---| ---|
 | 度| (2,5,2,1,1,1) | (2,5,2,1,1,1) |
 | 类型 | （B，B，B，A，A，A）|
 | 找到 (Z)-顶点 | 没有 |
 | (B)-循环| 没有 |
 | BFS 启动 | (4) |
 | 第一个其他 (A) 顶点 | (5) |
 | 保留路径 | (4-2-5) |
 | 被盗的顶点 | (1,3,6) |
 | 被盗后的保留程度（2） | (2) |
 | (2) 模 (3) 的原始次数 | (5\bmod3=2) |
 | 回答 |`Yes`|

 保留的顶点（2）有三个被盗的邻居，即（1,3,6），因此它的度数从（5）减少到（2）。 其他保留的顶点 (4) 和 (5) 不会丢失任何关联边。 因此，每个剩余的度数都保持其余数模 (3)。 

第三个示例图说明了最终情况。 顶点 (1) 的度数为 (7)，因此它是唯一的 (A) 顶点。 (B)-子图由几棵树组成。 一棵树包含顶点 (2,3,6,7,8)，其中 (6,7,8) 与顶点 (1) 相邻。 另一个包含(4,5)，(4)和(5)都与(1)相邻。 从 (6) 开始，最近的其他附件是 (3)，而第二棵树给出路径 (4-5)。 保留（1,6,3,4,5）和窃取（2,7,8）是一种有效的解决方案。 

| 组件| 附件开始 | 第一个其他附件 | 保留路径 |
 | ---| ---| ---| ---|
 | ({2,3,6,7,8}) | 6 | 3 | (6-3) |
 | ({4,5}) | 4 | 5 | (4-5) |
 | 中心顶点| 1 | 两条路 | 1 |

 选定的 (B) 顶点具有内度 (2)。 顶点 (1) 有四个选定的邻居，因此它的度数从 (7) 变为 (4)，并且两个值都是 (1\bmod3)。 被盗的顶点是(2,7,8)。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n+m)) | 执行恒定数量的 DFS、BFS 和邻接扫描 |
 | 空间| (O(n+m)) | 邻接表和线性大小辅助数组主宰内存 |

 所有测试用例的总数 (n) 和总数 (m) 最多为 (500000)，因此总运行时间为 (O(\sum n+\sum m))。 该算法从不构造 (n\times n) 结构，也从不枚举子集，这将内存和运行时间保持在原始竞赛限制内。 

## 测试用例

 该问题的输出不是唯一的，因此测试应该验证结构要求，而不是比较被盗顶点的确切列表。 以下工具检查每个剩余顶点的状态、被盗集合的大小、独特性以及度模 (3) 条件。```python
# Run this after the solution above has been defined.
import sys
import io

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_stdout = sys.stdout
    old_input = input

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline
    sys.stdout = io.StringIO()

    try:
        main()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        input = old_input

def validate(inp: str, out: str, expected):
    data = list(map(int, inp.split()))
    pos = 0
    t = data[pos]
    pos += 1

    tokens = out.split()
    out_pos = 0

    for case_id in range(t):
        n = data[pos]
        m = data[pos + 1]
        pos += 2

        edges = []
        deg = [0] * n

        for _ in range(m):
            u = data[pos] - 1
            v = data[pos + 1] - 1
            pos += 2
            edges.append((u, v))
            deg[u] += 1
            deg[v] += 1

        assert out_pos < len(tokens)
        status = tokens[out_pos]
        out_pos += 1

        assert status == expected[case_id], (
            f"case {case_id}: expected {expected[case_id]}, got {status}"
        )

        if status == "No":
            continue

        c = int(tokens[out_pos])
        out_pos += 1

        stolen = list(map(int, tokens[out_pos:out_pos + c]))
        out_pos += c

        assert 1 < c < n
        assert len(stolen) == c
        assert len(set(stolen)) == c

        stolen_zero = {x - 1 for x in stolen}

        assert all(0 <= x < n for x in stolen_zero)

        for v in range(n):
            if v in stolen_zero:
                continue

            lost = 0
            for u, w in edges:
                if u == v and w in stolen_zero:
                    lost += 1
                elif w == v and u in stolen_zero:
                    lost += 1

            assert lost % 3 == 0, (
                f"case {case_id}: vertex {v + 1} loses {lost} edges"
            )

    assert out_pos == len(tokens)

sample = """\
3
3 3
1 2
2 3
3 1

6 6
1 2
1 3
2 3
2 5
2 6
2 4

8 12
1 2
1 3
2 3
1 4
4 5
5 1
3 6
3 7
3 8
6 1
7 1
8 1
"""

sample_out = run(sample)
validate(sample, sample_out, ["No", "Yes", "Yes"])

minimum = """\
1
1 0
"""
assert run(minimum).strip() == "No"

two_vertices = """\
1
2 1
1 2
"""
assert run(two_vertices).strip() == "No"

star = """\
1
4 3
1 2
1 3
1 4
"""
star_out = run(star)
validate(star, star_out, ["Yes"])

cycle = """\
1
4 4
1 2
2 3
3 4
4 1
"""
assert run(cycle).strip() == "No"

two_triangles = """\
1
5 6
1 2
2 3
3 1
1 4
4 5
5 1
"""
assert run(two_triangles).strip() == "No"

five_triangles = """\
1
11 15
1 2
2 3
3 1
1 4
4 5
5 1
1 6
6 7
7 1
1 8
8 9
9 1
1 10
10 11
11 1
"""
five_triangles_out = run(five_triangles)
validate(five_triangles, five_triangles_out, ["Yes"])

# Maximum-size connected graph, a star with 500000 vertices.
# The center has degree 499999, which is 1 modulo 3.
max_n = 500000
max_edges = "\n".join(f"1 {v}" for v in range(2, max_n + 1))
max_case = f"1\n{max_n} {max_n - 1}\n{max_edges}\n"

max_out = run(max_case)
validate(max_case, max_out, ["Yes"])

print("All tests passed.")
```最小尺寸测试检查不存在合法盗窃的 (n=1) 边界。 两顶点测试检查严格要求 (1<c<n)。 星号检查 (0\bmod3) 结构。 四循环检查整个图是（B）循环的情况。 共享一个顶点的两个三角形是最终不可能结构的最小示例。 共享一个 (A) 顶点的五个三角形创建五个 (B) 组件并练习最终的构造案例。 最大尺寸的星形检查大输入边界和线性时间行为。 

| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | (n=1,m=0) | (n=1,m=0)`No`| 最小尺寸图 |
 | (n=2,m=1) | (n=2,m=1) |`No`| 严格 (1<c<n) 边界 |
 | 四顶点星|`Yes`| 度 (0\bmod3) 构造 |
 | 四循环|`No`| 整个图是一个 (B) 循环 |
 | 两个三角形共用一个顶点 |`No`| 最终不可能的结构 |
 | 五个三角形共享一个顶点 |`Yes`| 多个 (B) 树组件 |
 | (500000)-顶点星|`Yes`| 最大尺寸输入和线性复杂度 |

 ## 边缘情况

 对于单顶点图```
1
1 0
```唯一的顶点的度数为 (0)，因此它属于类 (Z)。 第一个构造会保留它，但这不会留下被盗的顶点。`make_answer`拒绝构造，因为被盗顶点的数量不大于（1），并且没有其他情况可以使用。 输出是`No`。 

对于二顶点图```
1
2 1
1 2
```两个顶点的度数均为 (1)，因此它们都是 (A) 类。 BFS 立即找到路径（1-2），但该路径包含每个顶点。 它的补集是空的，因此该构造被拒绝。 不存在包含至少两个被盗顶点的其他真子集，输出为`No`。 

对于四循环```
1
4 4
1 2
2 3
3 4
4 1
```所有四个顶点均为 (B) 类。 DFS 找到非树边并重建包含所有四个顶点的环。 补码的大小为零，因此无法被窃取。 环的真保留子集是路径的集合，并且路径端点具有内部度(1)，其与残差(2)不匹配。 该算法最终返回`No`。 

对于四顶点星```
1
4 3
1 2
1 3
1 4
```中心的度数为 (3)，因此类别为 (Z)。 只保留中心给出内部度 (0)，而其原始度为 (3)，因此保留残差。 三片叶子被盗，给出有效答案（c=3）。 

对于最终不可能的结构，```
1
5 6
1 2
2 3
3 1
1 4
4 5
5 1
```顶点 (1) 的度数为 (4)，因此是唯一的 (A) 顶点。 (B) 顶点形成两个树组件，每个组件都有一条边，并且每个组件恰好有两条边到顶点 (1)。 为 (A) 顶点提供所需的内部度余数的唯一方法是使用这两个组件。 由于每个组件已经恰好是其两个附件之间的路径，因此保留两条路径意味着保留所有五个顶点。 没有适当的有效保留集，所以答案是`No`。 

对于包含多个此类组件的图，情况会发生变化。 由于五个三角形共享顶点 (1)，因此顶点 (1) 的度数为 (10)，即 (1\bmod3)。 五个 (B) 组件是单独的边，每个组件的两个端点都连接到 (1)。 保留任意两个分量中的路径会给出顶点 (1) 内度 (4)，而所有选定的 (B) 顶点都具有内度 (2)。 其他三个组件可以被盗，所以答案变成`Yes`。
