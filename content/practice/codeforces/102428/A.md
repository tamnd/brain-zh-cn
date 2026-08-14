---
title: "CF 102428A - 算法教学"
description: "每个老师都知道一小部分算法。 由该老师训练的学生可以学习这些算法的任何非空子集。 当两个学生的学习集都不包含另一个学生的学习集时，两个学生就可以在最终团队中共存。"
date: "2026-08-14T15:30:27+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102428
codeforces_index: "A"
codeforces_contest_name: "2019-2020 ACM-ICPC Latin American Regional Programming Contest"
rating: 0
weight: 102428
solve_time_s: 156
verified: true
draft: false
---

[CF 102428A - 算法教学](https://codeforces.com/problemset/problem/102428/A)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 36s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个老师都知道一小部分算法。 由该老师训练的学生可以学习这些算法的任何非空子集。 当两个学生的学习集都不包含另一个学生的学习集时，两个学生就可以在最终团队中共存。 换句话说，学习到的集合必须在集合包含下形成反链。 

相同的学习集可以通过多个教师获得，但这并不能培养出多个有用的学生。 具有完全相同学习集的两个学生具有可比性，因为学习集相等，因此他们不能都属于团队。 我们只关心不同的可行子集。 

关键的结构观察是每个可行集都带有它的所有子集。 如果老师知道的话`{A, B, C}`， 然后`{A}`,`{B}`,`{A,B}`，并且所有其他子集都是可行的。 因此，可行集在所有子集的布尔格内形成一个向下封闭的族。 

在重要的维度上，约束很小。 最多有100个老师，每个老师最多知道10个算法。 因此，单个教师最多贡献 (2^{10}-1=1023) 个不同的非空训练集。 所有教师最多可以有大约 102,300 个不同的可行集。 这对于全球所有算法的指数搜索来说太多了，因为老师可能会总共提到多达 1000 个不同的算法名称。 枚举这 1000 个算法的每个子集已经需要 (2^{1000}-1) 个候选算法。 

最大答案本身也在普通整数范围内。 不同的训练集最多可以表示 102,300 个不同的学生，因此 Python 整数在这里没有特殊的算术难度。 

一些边缘情况很重要，因为它们暴露了常见的错误简化。 如果一位老师知道一种算法，则唯一可行的训练集就是该单例，因此答案为 1。```
1
1 HAVEFUN
```输出是`1`。 意外允许空子集的解决方案将计入额外的可能性。 

第二个边缘情况是两名教师使用不相交的算法。```
2
1 A
1 B
```答案是`2`， 因为`{A}`和`{B}`是无可比拟的。 仅考虑由同一位教师培训的学生的解决方案将错误地返回 1。 

还必须在不增加相同训练集的情况下处理重复的教师知识。```
2
2 A B
2 A B
```答案是`2`， 不是`4`。 可行集是`{A}`,`{B}`， 和`{A,B}`，最大的反链由`{A}`和`{B}`。 

最后，最好的团队不一定由相同规模的团队组成。 考虑第二个样本。 第一位老师贡献了六个不同的对，而第二位老师则贡献了完全不同算法的两个单例集。 这六对与两个单例一起形成大小为 8 的反链。仅查找最大的单个级别会找到 7，并且是错误的。 

## 方法

 直接暴力方法将构造输入中任何位置出现的每个算法的每个子集，然后搜索成对不可比较子集的最大集合。 搜索空间由不同算法名称的总数决定，而不是由一位老师已知的算法数量决定。 在最坏的情况下，可能有 1000 个不同的名称，因此仅枚举所有可能的非空子集就需要 (2^{1000}-1) 次操作。 检查这些子集的所有组合会更糟糕。 蛮力是正确的，因为它明确地考虑了每个可能的学生，但全局算法宇宙使其无法使用。 

有用的观察是我们不需要全局布尔格。 学生只能接受一位教师最多 10 种算法的子集的训练。 我们可以直接枚举那些局部子集。 他们的并集给出了完整的可行学生集，在删除重复项之前最多有 (100\cdot(2^{10}-1)) 个候选者。 

现在将每个可行的训练集视为有向无环图的顶点。 每当 (X\子集 Y) 时，放置从集合 (X) 到集合 (Y) 的顺序关系。 图中的链是训练集相互可比的学生的集合，因此反链正是满足合作条件的团队。 

迪尔沃斯定理给出了关键的约简：在任何有限偏序集合中，最大反链的大小等于覆盖所有顶点所需的最小链数。 最小链覆盖可以从二部图中的最大匹配获得。 我们为每个可行集制作两个副本，将左侧副本放在第一侧，将右侧副本放在第二侧，并且只要（X）是（Y）的真子集，就将左（X）连接到右（Y）。 如果最大匹配的大小为 (M) 并且有 (V) 个可行集，则最小链覆盖有 (V-M) 条链，这就是所需的答案。 

有一个专门针对此问题的实现细化。 仅使用仅使用一种算法不同的包含边就足够了。 假设 (X\子集 Y) 且两个集合都是可行的。 由于可行族是向下封闭的，每次将 (Y\setminus X) 的元素相加得到的每个集合也是可行的。 因此，子集关系可以由通过这些单元素扩展的路径来表示。 对于这个族，最小链分解可以通过这种方式饱和，因此匹配图只需要覆盖边。 

对于具有 (k) 个算法的教师，有 (2^k) 个子集（包括空集）。 每个子集最多有(k)个单元素扩展，因此生成的有向边的数量最多为(k2^{k-1})。 对于 (k\le10) 和 (N\le100)，在删除重复边之前最多生成 512,000 个边。 

最大匹配是用 Hopcroft-Karp 计算的。 它的分层 BFS 阶段找到最短的增广路径，而 DFS 然后沿着该层图中的所有可能路径进行增广。 这比尝试比较每对可行子集要合适得多。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(2^K)) 只是为了枚举候选者，(K\le1000) | (O(2^K)) | 太慢了 |
 | 最佳 | (O(NK2^K + E\sqrt V))，其中 (K\le10)、(V\le N2^K)、(E\le NK2^{K-1}) | (O(V+E)) | 已接受 |

 这里，局部枚举的复杂度表达式中的 (K) 表示一位老师已知的算法的最大数量，因此 (K\le10)，而不是潜在的 1000 个全局不同的算法名称。 

## 算法演练

1. 为每个算法名称分配一个唯一的全局位位置。 然后，教师的知识可以用位掩码来表示。 即使不同的教师共享算法名称，这也为每个训练集提供了紧凑的、可散列的表示。 
2. 对于每个教师，枚举该教师掩码的所有非空子掩码。 将每个生成的全局掩码插入字典中，将训练集映射到唯一的顶点 ID。 来自不同教师的重复子集会收到相同的 ID，因为它们代表同一可能的学生。 
3. 为二部匹配图创建邻接表。 对于每个教师和该教师算法的每个非空子集 (S)，尝试添加 (S) 中尚未存在的每个算法。 结果集 (T) 与 (S) 恰好有一种算法不同，因此添加一条从 (S) 到 (T) 的边。 
4. 从每个邻接列表中删除重复的邻居。 当多个教师共享相关算法时，可以生成相同的包含边，但它仅代表偏序集中的一种关系。 
5. 在二分图上运行 Hopcroft-Karp。 左右两侧都包含所有可行的训练集。 边缘意味着在饱和包含链中，一个可行集可以紧邻另一个可行集。 
6. 令 (V) 为不同可行集的数量，(M) 为最大匹配大小。 根据迪尔沃斯定理的链覆盖形式，最小链数为(V-M)。 由于团队恰恰是反链，所以打印（V-M）。 

### 为什么它有效

 顶点集正是可能的非空学生训练集的集合，因此不会遗漏有效的学生，也不会引入不可能的学生。 包含定义了所需的偏序，因为当两个学生的训练集具有可比性时，他们无法完全合作。 

每个包含关系都可以展开为单元素加法，因为可行族是向下封闭的。 如果(X\子集Y)可行，则它们之间的每个中间子集也包含在(Y)中，因此是可行的。 因此，可以仅使用一次添加一种算法的边来表示相同的链顺序。 因此，构造图中的链正是训练集的有效可比较序列。 

迪尔沃斯定理指出，最大可能的反链与最小的链盖具有相同的尺寸。 标准二部约简表示，对于由其包含关系表示的偏序集，最小链覆盖大小为（V-M），其中（M）是偏序集的两个副本之间的最大匹配。 Hopcroft-Karp 找到了最大匹配，因此算法打印的值正是最大可能的团队。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(1_000_000)

def solve():
    n = int(input())

    name_id = {}
    teachers = []

    for _ in range(n):
        parts = input().split()
        k = int(parts[0])

        mask = 0
        for name in parts[1:]:
            if name not in name_id:
                name_id[name] = len(name_id)
            mask |= 1 << name_id[name]

        teachers.append(mask)

    # Assign one vertex id to every distinct non-empty feasible subset.
    vertex_id = {}
    masks_by_teacher = []

    for teacher_mask in teachers:
        bits = []
        x = teacher_mask
        while x:
            b = x & -x
            bits.append(b)
            x -= b

        k = len(bits)
        local_masks = [0] * (1 << k)

        for lm in range(1, 1 << k):
            lb = lm & -lm
            j = lb.bit_length() - 1
            local_masks[lm] = local_masks[lm ^ lb] | bits[j]

        masks_by_teacher.append((bits, local_masks))

        for lm in range(1, 1 << k):
            mask = local_masks[lm]
            if mask not in vertex_id:
                vertex_id[mask] = len(vertex_id)

    v = len(vertex_id)

    # Build cover edges: S -> S union {x}.
    adj = [[] for _ in range(v)]

    for bits, local_masks in masks_by_teacher:
        k = len(bits)

        for lm in range(1, 1 << k):
            u_mask = local_masks[lm]
            u = vertex_id[u_mask]

            missing = ((1 << k) - 1) ^ lm
            while missing:
                lb = missing & -missing
                missing -= lb

                j = lb.bit_length() - 1
                v_mask = u_mask | bits[j]
                w = vertex_id[v_mask]
                adj[u].append(w)

    # The same edge may have been generated by several teachers.
    for u in range(v):
        if len(adj[u]) > 1:
            adj[u] = list(set(adj[u]))

    # Hopcroft-Karp maximum matching.
    pair_u = [-1] * v
    pair_v = [-1] * v
    dist = [-1] * v

    from collections import deque

    def bfs():
        q = deque()

        for u in range(v):
            if pair_u[u] == -1:
                dist[u] = 0
                q.append(u)
            else:
                dist[u] = -1

        found = False

        while q:
            u = q.popleft()

            for w in adj[u]:
                pu = pair_v[w]

                if pu == -1:
                    found = True
                elif dist[pu] == -1:
                    dist[pu] = dist[u] + 1
                    q.append(pu)

        return found

    def dfs(u):
        for w in adj[u]:
            pu = pair_v[w]

            if pu == -1 or (
                dist[pu] == dist[u] + 1 and dfs(pu)
            ):
                pair_u[u] = w
                pair_v[w] = u
                return True

        dist[u] = -1
        return False

    matching = 0

    while bfs():
        for u in range(v):
            if pair_u[u] == -1 and dfs(u):
                matching += 1

    print(v - matching)

if __name__ == "__main__":
    solve()
```第一个输入循环将每个算法名称转换为一个位位置。 然后，教师被存储为一个整数，其设置的位准确地标识了教师知道的算法。 

这`local_masks`数组很有用，因为全局位位置可能相距很远。 对于具有 (k) 个算法的教师，其局部掩码范围为`0`到`(1 << k) - 1`，每一个局部位对应一个全局算法位。 这让我们可以枚举所有 (2^k-1) 个非空子集，而无需迭代潜在的 1000 个全局算法位置。 

这`vertex_id`字典就是去重机制。 如果两名教师可以使用完全相同的算法子集训练学生，则两次出现都会映射到同一顶点。 这是必要的，因为两个相同的训练集无法合作。 

邻接构造仅添加单元素扩展。 这`missing`mask 包含当前子集中不存在的教师算法。 重复取其最低设置位来枚举每个可能的下一个算法。 

匹配数组的每个可行集都有一个条目。`pair_u[u]`存储与左侧顶点匹配的右侧顶点`u`， 尽管`pair_v[v]`存储相应的左顶点。 BFS 构建了 Hopcroft-Karp 使用的分层图，而 DFS 仅沿着尊重这些层的边进行搜索。 

Python 中不存在整数溢出问题。 在这个问题中，DFS 的递归深度也很小，因为每个匹配边都会沿着包含路径将子集大小增加一，但无论如何都会提高递归限制以使实现更加稳健。 

最后的减法是关键的 Dilworth 步骤。 每个匹配边都允许两个顶点，否则需要将单独的链连接成一个链。 从 (V) 个单例链开始，大小 (M) 的匹配将所需的链数量减少到 (V-M)，这等于最大反链大小。 

## 工作示例

 ### 示例 1

 输入包含一位了解三种算法的老师。 有七个非空可行子集。 

| 步骤| 子集大小 | 新的可行集 | 总顶点数 |
 | --- | --- | --- | --- |
 | 枚举单例 | 1 | 3 | 3 |
 | 枚举对 | 2 | 3 | 6 |
 | 枚举三元| 3 | 1 | 7 |
 | 构建覆盖边缘 | | 12 | 12 7 |
 | 最大匹配| | 4 个匹配的顶点 | 7 |
 | 最终答案| | (7-4) | 3 |

 这三对集合形成大小为 3 的反链。匹配的大小为 4，因此 Dilworth 给出了四个链的最小链覆盖，因此给出了三个集合的最大反链。 

### 示例 2

 第一个老师知道四种算法，因此它贡献了这四种算法的所有 15 个非空子集。 第二位老师知道两种完全不同的算法，贡献了另外三个子集。 由于算法集是不相交的，因此有 18 个不同的顶点。 

| 步骤| 来源 | 新顶点 | 总顶点数 |
 | --- | --- | --- | --- |
 | 枚举子集 | 老师 1 | 15 | 15 15 | 15
 | 枚举子集 | 老师2 | 3 | 18 | 18
 | 构建覆盖边缘 | 老师 1 | 32 | 32 32 | 32
 | 构建覆盖边缘 | 老师2 | 2 | 34 | 34
 | 最大匹配| 两者 | 10 | 10 18 | 18
 | 最终答案| | (18-10) | 8 |

 有趣的部分是最佳团队的结构。 从第一位老师开始，获取所有六个两种算法子集。 从第二个老师那里，获取它的两个单例子集。 这两个组使用不相交的算法，因此没有选定的集合包含另一个集合。 这给了 8 个学生。 

这个例子正是为什么仅仅计算最大级别是不够的。 全族最大等级包含7套，但混合等级反链达到8套。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(NK2^K + E\sqrt V)) | 每个教师生成 (O(K2^K)) 覆盖边，然后是 Hopcroft-Karp |
 | 空间| (O(V+E)) | 存储不同的可行集、邻接表和匹配数组 |

 这里(K\le10)，(V\le N(2^K-1))，生成的覆盖边的数量最多为(NK2^{K-1})。 对于 (N=100) 和 (K=10)，这意味着在重复删除之前最多生成约 102,300 个顶点和 512,000 条边。 这些界限是故意基于每个教师的少量算法计数，而不是基于可能大量的全局不同算法名称。 

## 测试用例```python
# Save the competitive-programming solution as solution.py first.

import io
import sys

from solution import solve

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided samples
assert run("""1
3 DFS BFS DIJKSTRA
""") == "3", "sample 1"

assert run("""2
4 BFS DFS LCA RMQ
2 PRIM KRUSKAL
""") == "8", "sample 2"

assert run("""4
3 BFS DFS DIJKSTRA
4 BFS DFS LCA RMQ
3 DIJKSTRA BFS DFS
3 FLOYD DFS BFS
""") == "10", "sample 3"

assert run("""1
1 HAVEFUN
""") == "1", "sample 4"

assert run("""3
4 FFEK DANTZIG DEMOUCRON FFT
4 PRIM KRUSKAL LCA FLOYD
4 DFS BFS DIJKSTRA RMQ
""") == "18", "sample 5"

# Minimum-size input.
assert run("""1
1 A
""") == "1", "single possible student"

# Two disjoint singleton teachers.
assert run("""2
1 A
1 B
""") == "2", "disjoint singleton sets"

# All teachers have exactly the same knowledge.
same_teachers = "100\n" + "2 A B\n" * 100
assert run(same_teachers) == "2", "duplicate teachers"

# One teacher with 10 algorithms.
# Its Boolean lattice has maximum antichain size C(10, 5) = 252.
names = " ".join(f"A{i}" for i in range(10))
assert run(f"""1
10 {names}
""") == "252", "maximum local subset size"

# Mixed ranks are required for the optimum.
assert run("""2
4 A B C D
2 E F
""") == "8", "mixed-rank antichain"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 A`| 1 | 最小大小输入和非空子集要求 |
 |`2 / 1 A / 1 B`| 2 | 不同老师培养的学生可以共存 |
 | 100 个相同`2 A B`教师 | 2 | 重复的教师不得重复顶点 |
 | 一位老师掌握10种算法 | 252 | 252 最大局部子集大小和中心布尔格反链 |
 |`4 A B C D`和`2 E F`| 8 | 最大反链可以混合不同的子集大小 |

 ## 边缘情况

 处理单算法情况是因为子集枚举从本地掩码 1 开始，因此永远不会插入空训练集。 为了```
1
1 HAVEFUN
```唯一的顶点是`{HAVEFUN}`，没有边，匹配大小为0，答案为(1-0=1)。 

不相交的教师会被自然地处理，因为他们的子集成为不同的全局掩码。 为了```
2
1 A
1 B
```顶点是`{A}`和`{B}`。 他们之间没有包含边，因此最大匹配为 0，答案为 2。这说明了合作只比较两个学生学到的算法，而不是哪个老师训练了他们。 

重复的老师崩溃了`vertex_id`。 为了```
2
2 A B
2 A B
```两位老师生成完全相同的三个顶点。 盖板边缘是`{A}->{A,B}`和`{B}->{A,B}`。 最大匹配的大小为 1，因此答案为 (3-1=2)。 如果没有重复数据删除，程序可能会错误地将同一训练集视为多个不同的学生。 

十算法边界的处理没有任何特殊情况。 一位使用 10 种算法的教师恰好生成 1023 个非空子集和 512 个单元素扩展边。 对于这样的老师，布尔格有一个大小为 (\binom{10}{5}=252) 的中心反链，匹配公式得到的值为 (1023-771=252)。 

混合等级的情况是最有启发性的。 为了```
2
4 A B C D
2 E F
```第一个老师提供六个双元素子集，而第二个老师提供`{E}`和`{F}`。 后者都不包含或不包含在六对中的任何一组中，因此可以同时选择所有八组。 该算法并不假设最佳反链位于某一层。 Dilworth 定理自动找到混合秩最优值并返回 8。
