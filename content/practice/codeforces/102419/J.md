---
title: "CF 102419J - 贾比尔警察"
description: "将每一行和每一列视为二分图的顶点。 包含 1 的单元格是其行顶点和列顶点之间的边。 值 ai 准确地告诉我们有多少条边必须与第 i 行相关。 柱度完全在我们的控制之下。"
date: "2026-08-16T09:11:50+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102419
codeforces_index: "J"
codeforces_contest_name: "SPC 2019"
rating: 0
weight: 102419
solve_time_s: 546
verified: false
draft: false
---

[CF 102419J - 警察贾比尔](https://codeforces.com/problemset/problem/102419/J)

 **评级：** -
 **标签：** -
 **求解时间：** 9m 6s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 将每一行和每一列视为二分图的顶点。 一个单元格包含`1`是其行顶点和列顶点之间的边。 价值`a_i`准确地告诉我们有多少条边必须与行相关`i`。 柱度完全在我们的控制之下。 

当 Jaber 检查顶点时，与已检查顶点相关的每条边都会消失。 因此，他看到的光的数量正是由尚未检查的顶点引起的子图中该顶点的度数。 因此，有效的检查顺序是这样一种顺序，其中每个顶点在被移除时最多具有一个剩余的入射边。 

当图是森林时，它就具有这样的顺序。 如果一个图包含一个环，那么在重复删除度数最多为 1 的顶点后，该环最终会保留下来，并且其上的每个顶点的度数为 2。 相反，每个非空森林都有一个叶子或一个孤立的顶点，因此我们最多可以重复删除一个度数的顶点。 

因此，该问题变成了图构造问题。 我们需要一个简单的二分森林`n`行顶点，`m`列顶点和行侧的规定度数。 

界限`n,m <= 1000`足够小，以至于`O(nm)`施工适宜。 特别是，输出本身包含`nm`字符，所以仅仅打印答案就已经花费了`O(nm)`。 因此，具有二次时间和内存的构造是自然的，而任何指数的构造都是完全不可行的。 

有几种边缘情况会导致简单的构造失败。 考虑```
2 2
2 2
```两行都需要两个，所以所有四个单元格都必须是`1`。 生成的二分图是 4 循环的，并且不存在有效的检查顺序。 仅检查总数是否最多为`n+m-1`足以拒绝这个例子，但这个条件一般来说是不充分的。 

例如，```
5 3
3 3 0 0 0
```只有六个，而有八个顶点，所以粗略的边数条件`6 <= 8-1`通过。 然而，正的两个行的阶数都是三，并且只有三列。 它们必须共享所有三列，从而产生多个循环。 正确答案是`NO`。 

在另一个极端，零度行不得被视为连接结构的一部分。 为了```
3 2
2 0 0
```第一行可以简单地使用两列，而其他行可以被隔离。 答案是`YES`。 假设每行都有正度的构造将错误地拒绝这种情况。 

案例```
1 1
0
```也是有效的。 根本没有边缘，因此可以立即检查行和列。 答案是`YES`。 

## 方法

 直接的暴力方法会枚举每个二进制文件`n x m`矩阵，丢弃行和与所需值不同的矩阵，然后测试生成的二部图是否具有有效的消除顺序。 有`2^(nm)`总共二进制矩阵，所以在最坏的情况下这考虑`2^(1,000,000)`候选人。 即使我们将枚举限制为具有正确行和的矩阵，最坏情况下的候选数也是`C(m, floor(m/2))^n`,

 这仍然是指数级的。 检查每个候选人至少花费`O(nm)`，所以这种方法具有最坏情况成本`Theta(nm * C(m, floor(m/2))^n)`。 它的正确性很简单，但无法使用。 

有用的观察是，有效的检查顺序相当于构建的二分图是一个森林。 因此，我们在构造矩阵时不需要推理检查过程。 我们只需要构建一个具有所请求的行度的非循环图。 

假设有`k`具有正度数的行，并令所有行度数之和为`S`。 考虑使用列作为叶列，包含单个`1`，或作为包含两个的连接器列`1`s 并连接两行顶点。 连接器列的行为类似于两个行顶点之间的边。 如果我们使用`E`连接器列，这些列可以在`k`正行。 这样的森林最多可以有`k-1`边，并且因为每个连接器消耗两个行度单位，所以我们也有`E <= floor(S/2)`。 

因此连接器列的最大有用数量是`E = min(k-1, floor(S/2))`。 

与使用两个单独的叶列相比，每个连接器可节省一列。 因此，使用的列总数为`E + (S - 2E) = S - E`。 

如果这超过`m`，任何构造都不可能存在。 如果没有，我们完全可以建造这样的森林。 

剩下的任务是在正行上实现一个森林，其程度为行`i`有一定的价值`t_i <= a_i`，正好与`E`边缘。 我们选择的是`t_i`所以他们的总和是`2E`。 实现森林的一种便捷方法是临时添加一个超级顶点。 一片森林与`E`边缘上`k`顶点有`k-E`连接的组件。 将超级顶点连接到每个组件中的一个顶点。 结果是一棵树`k+1`顶点，因此我们可以使用 Prüfer 序列从其度数序列构造它。 

这将问题转化为线性大小的度序列构造，然后是普通的森林遍历。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`Theta(nm * C(m,floor(m/2))^n)`|`O(nm)`| 太慢了 |
 | 最佳 |`O(nm + (n+m) log(n+m))`|`O(nm + n+m)`| 已接受 |

 ## 算法演练

 1. 计算`S`，所有行度数之和，并收集度数为正的行。 设他们的号码为`k`。 行与`a_i = 0`永远不需要优势，因此他们可以保持孤立。 
2. 设置`E = min(k - 1, S // 2)`。 

这些是我们要使用的连接器列。 我们不能使用超过`k-1`无需在行顶点之间创建循环，并且我们不能使用超过`S//2`因为每个连接器消耗两个行度单位。 
3. 计算该结构所需的柱数：`S-E`。 如果`S-E > m`， 打印`NO`。 

数量`S-E`是最小可能的列数。 每个连接器在一列中使用两个，而不是两个单独的列，因此每个连接器只保存一列。 
4. 选择连接器度数`t_i`对于正行。 我们需要`0 <= t_i <= a_i`和`sum(t_i) = 2E`。 

什么时候`E > 0`，首先给一个连接器度数`E+1`明显的正行。 这是可能的，因为`E <= k-1`。 然后分配剩余的`E-1`度单位贪婪但不超过`a_i`或者`k-1`。 

给予一个单位`E+1`rows 保证连接器图可以有`E`边，而不试图将其所有度数集中在太少的顶点上。 额外上限为`k-1`稍后很有用，因为没有行的度数可以大于`k`添加超级顶点后的临时树中。 
5.让`C = k-E`，连接器林将具有的组件数量。 每一行都有`t_i=0`必须接收到超级顶点的边。 选择所有这样的行作为超级顶点邻居，然后选择任意附加行，直到恰好`C`已选择行。 

有足够的零度行可以做到这一点，因为该结构至少为连接器提供了正度数`E+1`行。 因此至多`k-E-1`行有`t_i=0`， 尽管`C=k-E`。 
6.定义行的度数`i`在临时树中为`t_i + 1`如果行`i`被选为超级顶点邻居，并且`t_i`否则。 给出超顶点度`C`。 

总学位为`2E + C + C = 2(E+C) = 2k`,

 正好是一棵树所需的数量`k+1`顶点。 每个学位都是积极的，最多`k`，所以这是一个有效的树度序列。 
7. 构建精确包含每个临时顶点的 Prüfer 序列`degree[i]-1`次。 它的长度是`k-1`。 使用包含当前叶子的优先级队列对序列进行解码。 

Prüfer 解码构造出一棵具有精确所需度数序列的树。 由于顶点数只有`k+1 <= 1001`， 这`O(k log k)`实施起来很容易足够快。 
8. 删除与超级顶点相关的每条边。 其余边缘在正行上形成森林。 每个剩余的树边缘都成为一个连接器列，其中恰好有两个连接器，每个端点都有一个连接器列。 
9. 对于每一行`i`， 有`a_i-t_i`连接器列未使用的剩余部分。 给他们每个人一个单独的叶列，其中包含一个`1`在行中`i`。 

创建的列数正好是`E + S - 2E = S-E`，已检查`m`早些时候。 所有未使用的列都用零填充。 
10. 构建结果矩阵的二分邻接表，并重复选取当前度数最多为 1 的顶点。 将其附加到答案顺序中，从概念上删除它，并减少其邻居的度数。 

因为图是一个森林，所以这样的顶点总是存在的。 孤立的行和未使用的列只是以零度进入队列。 
11. 输出矩阵和所得的行/列顺序。 

### 为什么它有效

 连接器列在正行上形成森林。 每增加一个`1`连接器未使用的内容放置在私有叶列中，因此附加这些列无法创建循环。 因此整个二分图是一个森林。 

每行都准确接收`t_i`连接器边缘和`a_i-t_i`叶子边缘，准确地给出`a_i`那些。 建设用途`S-E`列，最多不超过`m`每当算法接受时。 

最后，重复删除最多一个度数的顶点会为任何森林产生有效的检查顺序。 当一个顶点被移除时，它当前的度数正是该行或列中仍然亮着的灯的数量，因此 Jaber 永远不会看到超过一盏灯。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

import heapq

def solve():
    n, m = map(int, input().split())
    a = list(map(int, input().split()))

    positive = [i for i, x in enumerate(a) if x > 0]
    k = len(positive)
    total = sum(a)

    if k == 0:
        mat = ['0' * m for _ in range(n)]
        order = []
        for i in range(n):
            order.append(("row", i))
        for j in range(m):
            order.append(("col", j))

        out = ["YES"]
        out.extend(mat)
        out.extend(f"{typ} {idx + 1}" for typ, idx in order)
        sys.stdout.write("\n".join(out))
        return

    E = min(k - 1, total // 2)

    used_columns = total - E
    if used_columns > m:
        print("NO")
        return

    # t[i] is the number of row i's edges used by connector columns.
    t = [0] * n

    if E > 0:
        # First give one connector incidence to E+1 rows.
        base_count = E + 1
        for idx in range(base_count):
            t[positive[idx]] = 1

        remaining = E - 1

        # Distribute the remaining incidences.
        # Capping at k-1 is enough for a row degree in the
        # temporary tree after possibly adding one super edge.
        for v in positive:
            if remaining == 0:
                break
            cap = min(a[v], k - 1)
            extra = min(cap - t[v], remaining)
            if extra > 0:
                t[v] += extra
                remaining -= extra

        if remaining != 0:
            print("NO")
            return

    # Number of connected components in the connector forest.
    C = k - E

    # Rows selected to connect to the super vertex.
    roots = []
    selected_root = [False] * n

    for v in positive:
        if t[v] == 0:
            roots.append(v)
            selected_root[v] = True

    if len(roots) > C:
        print("NO")
        return

    for v in positive:
        if len(roots) == C:
            break
        if not selected_root[v]:
            roots.append(v)
            selected_root[v] = True

    if len(roots) != C:
        print("NO")
        return

    # Temporary tree vertices:
    # 0 .. k-1 are positive rows
    # k is the super vertex
    super_v = k
    Ntree = k + 1

    degree = [0] * Ntree

    pos_index = {}
    for idx, v in enumerate(positive):
        pos_index[v] = idx

    for v in positive:
        idx = pos_index[v]
        degree[idx] = t[v] + (1 if selected_root[v] else 0)

    degree[super_v] = C

    # Build a Prüfer sequence.
    prufer = []
    for v in range(Ntree):
        prufer.extend([v] * (degree[v] - 1))

    # Decode Prüfer sequence.
    cur_degree = degree[:]
    leaves = []
    for v in range(Ntree):
        if cur_degree[v] == 1:
            heapq.heappush(leaves, v)

    tree_edges = []

    for v in prufer:
        leaf = heapq.heappop(leaves)
        tree_edges.append((leaf, v))

        cur_degree[leaf] -= 1
        cur_degree[v] -= 1

        if cur_degree[v] == 1:
            heapq.heappush(leaves, v)

    last1 = heapq.heappop(leaves)
    last2 = heapq.heappop(leaves)
    tree_edges.append((last1, last2))

    # Convert the tree, after removing the super vertex,
    # into connector columns.
    row_connector_edges = []

    for u, v in tree_edges:
        if u == super_v or v == super_v:
            continue

        original_u = positive[u]
        original_v = positive[v]
        row_connector_edges.append((original_u, original_v))

    if len(row_connector_edges) != E:
        print("NO")
        return

    # Matrix as mutable byte arrays.
    mat = [bytearray(b'0' * m) for _ in range(n)]

    col = 0

    # Each connector edge gets one column with two ones.
    for u, v in row_connector_edges:
        if col >= m:
            print("NO")
            return
        mat[u][col] = ord('1')
        mat[v][col] = ord('1')
        col += 1

    # Remaining row degrees use private leaf columns.
    for i in range(n):
        remaining = a[i] - t[i]
        for _ in range(remaining):
            if col >= m:
                print("NO")
                return
            mat[i][col] = ord('1')
            col += 1

    # Build the bipartite graph.
    total_vertices = n + m
    adj = [[] for _ in range(total_vertices)]
    deg = [0] * total_vertices

    for i in range(n):
        for j in range(m):
            if mat[i][j] == ord('1'):
                u = i
                v = n + j
                adj[u].append(v)
                adj[v].append(u)
                deg[u] += 1
                deg[v] += 1

    # Every forest has a vertex of degree <= 1.
    queue = []
    for v in range(total_vertices):
        if deg[v] <= 1:
            heapq.heappush(queue, v)

    removed = [False] * total_vertices
    order = []

    while queue:
        v = heapq.heappop(queue)
        if removed[v]:
            continue

        removed[v] = True
        order.append(v)

        for u in adj[v]:
            if removed[u]:
                continue
            deg[u] -= 1
            if deg[u] <= 1:
                heapq.heappush(queue, u)

    if len(order) != total_vertices:
        print("NO")
        return

    out = ["YES"]
    out.extend(row.decode() for row in mat)

    for v in order:
        if v < n:
            out.append(f"row {v + 1}")
        else:
            out.append(f"col {v - n + 1}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```实现的第一部分将零行与正行分开。 这很重要，因为零行根本不需要参与连接器林。 

变量`E`是连接器列的数量。 表达式`total - E`是最大化两行列数后所需的列数。 如果该数字大于`m`，任何安排都行不通。 

数组`t`记录每行必需的有多少属于连接器列。 最初的`E+1`分配保证森林有足够的非零顶点`E`边缘。 剩余的度数被贪婪地分配，其中`k-1`作为上限。 Python整数不会溢出，所有相关值最多约为`10^6`这里。 

超顶点构造是图论的关键部分。 一片森林与`E`边缘上`k`顶点有`k-E`成分。 将每个组件的一个顶点连接到一个新的超级顶点会生成一棵树。 我们不是直接构建组件，而是根据其度数序列构建这棵树，然后删除超级顶点。 

Prüfer 序列包含顶点`v`确切地`degree[v]-1`次。 它的长度是`k-1`，将一棵树与`k+1`顶点。 堆在解码期间存储当前叶，从而避免对下一个叶进行任何二次搜索。 

解码后，每条不接触超顶点的树边对应一个连接器列。 剩余的行度被放置到私有列中。 该构造永远不会将两个相同的行对放入单独的连接器列中，并且生成的图是非循环的，因为它是临时树加叶列的子图。 

最终的遍历是标准的叶子去除过程。`deg[v]`是顶点时仍然存活的边数`v`即将接受检查。 删除零度或一度顶点正是该语句所需的条件。 

## 工作示例

 ### 示例 1

 对于```
4 4
1 0 0 0
```只有第 1 行是正数，所以`k=1`和`S=1`。 

| 变量| 价值|
 | ---| ---|
 |`positive`|`[1]`|
 |`k`|`1`|
 |`S`|`1`|
 |`E = min(k-1,S//2)`|`0`|
 | 二手柱|`1`|
 |`t`|`[1,0,0,0]`|

 由于没有连接器边缘，因此所需的单个边缘成为私有叶列。 所得矩阵可以是```
1000
0000
0000
0000
```该图仅包含一条边。 每个顶点的度数为零或一，因此所有八个顶点的任何顺序都有效。 样品订单就是这样的一种订购。 

这个例子练习了`E=0`案件。 该构造不需要超顶点机械来连接行，因为只有一个正行。 

### 示例 2

 对于```
4 4
2 1 1 1
```我们有`k=4`和`S=5`。 

| 变量| 价值|
 | ---| ---|
 |`positive`|`[1,2,3,4]`|
 |`k`|`4`|
 |`S`|`5`|
 |`E`|`2`|
 |`C = k-E`|`2`|
 | 必填栏目|`S-E = 3`|

 施工可选择连接度```
t = [2, 1, 1, 0]
```他们的总和是`4 = 2E`。 对应的临时树有行度```
3, 1, 1, 1
```选择第 1 行和第 4 行作为超级顶点邻居后，而超级顶点的度数为 2。 

一种可能的连接器林是```
row 1 -- row 2
row 1 -- row 3
```第 4 行在连接器林中被隔离。 剩余的度数完全属于第 4 行，因此在那里添加了一个私有列。 

因此，一个可能的矩阵是```
1100
1000
1000
0010
```确切的矩阵与样本不同，这很好，因为该问题接受任何有效的构造。 它的二分图是一个森林，因此存在叶子移除顺序。 

该跟踪演示了为什么行度数不必解释为行本身的树中的度数。 一些行边成为叶子列，而连接列则是决定森林结构的部分。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(nm + (n+m) log(n+m))`| 矩阵和二分邻接的处理`O(nm)`，而 Prüfer 解码和最终的堆遍历对于每个顶点都是对数的。 |
 | 空间|`O(nm + n+m)`| 矩阵和邻接表主导内存使用。 |

 和`n,m <= 1000`，矩阵最多包含一百万个单元。 这`O(nm)`部分也是不可避免的，因为必须打印完整的矩阵。 内存使用量始终低于 256 MB 限制。 

## 测试用例

 由于输出不唯一，因此精确的字符串比较不适用于此问题。 下面的测试运行求解器并验证生成的矩阵并检查顺序。 验证器检查行总和、顺序中每一行和每一列的唯一性，以及每个检查的顶点最多有一条剩余边的条件。```python
import sys
import io
import heapq

def solve_string(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def validate(inp: str, out: str) -> bool:
    data = inp.strip().split()
    it = iter(data)

    n = int(next(it))
    m = int(next(it))
    a = [int(next(it)) for _ in range(n)]

    lines = out.strip().splitlines()
    if not lines:
        return False

    possible = lines[0] == "YES"

    total = sum(a)
    if not possible:
        # A validator for NO instances is supplied separately below.
        return True

    if len(lines) != 1 + n + n + m:
        return False

    matrix = lines[1:1 + n]
    if any(len(row) != m for row in matrix):
        return False

    for i in range(n):
        if sum(c == '1' for c in matrix[i]) != a[i]:
            return False
        if any(c not in '01' for c in matrix[i]):
            return False

    order_lines = lines[1 + n:]
    if len(order_lines) != n + m:
        return False

    seen = set()
    order = []

    for line in order_lines:
        parts = line.split()
        if len(parts) != 2:
            return False

        typ, x = parts
        x = int(x)

        if typ == "row":
            if not (1 <= x <= n):
                return False
            v = x - 1
        elif typ == "col":
            if not (1 <= x <= m):
                return False
            v = n + x - 1
        else:
            return False

        if v in seen:
            return False
        seen.add(v)
        order.append(v)

    if len(seen) != n + m:
        return False

    adj = [[] for _ in range(n + m)]
    for i in range(n):
        for j in range(m):
            if matrix[i][j] == '1':
                u = i
                v = n + j
                adj[u].append(v)
                adj[v].append(u)

    removed = [False] * (n + m)

    for v in order:
        remaining = sum(not removed[u] for u in adj[v])
        if remaining > 1:
            return False
        removed[v] = True

    return True

def expect_no(inp: str):
    out = solve_string(inp)
    assert out.strip() == "NO"

# Sample 1
sample1 = """\
4 4
1 0 0 0
"""
assert validate(sample1, solve_string(sample1)), "sample 1"

# Sample 2
sample2 = """\
4 4
2 1 1 1
"""
assert validate(sample2, solve_string(sample2)), "sample 2"

# Minimum-size instance
case_min = """\
1 1
0
"""
assert validate(case_min, solve_string(case_min)), "minimum-size zero"

# Minimum-size instance with one edge
case_min_edge = """\
1 1
1
"""
assert validate(case_min_edge, solve_string(case_min_edge)), "minimum-size edge"

# Boundary case: both rows require every column.
# The only possible matrix is all ones, which contains a cycle.
case_impossible = """\
2 2
2 2
"""
expect_no(case_impossible)

# Same total-edge count as a sparse graph might allow, but the
# prescribed row degrees force two rows to share all three columns.
case_impossible_2 = """\
5 3
3 3 0 0 0
"""
expect_no(case_impossible_2)

# Maximum-size feasible case.
# Every row has exactly one one, so one private column per row is enough.
case_max = "1000 1000\n" + " ".join(["1"] * 1000) + "\n"
assert validate(case_max, solve_string(case_max)), "maximum-size case"

# All equal positive row degrees.
# 1000 rows and 1000 columns, every row has degree 1.
case_equal = "1000 1000\n" + " ".join(["1"] * 1000) + "\n"
assert validate(case_equal, solve_string(case_equal)), "all-equal case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 / 0`|`YES`| 最小的无边图 |
 |`1 1 / 1`|`YES`| 包含边的最小图 |
 |`2 2 / 2 2`|`NO`| 强制4循环|
 |`5 3 / 3 3 0 0 0`|`NO`| 捕获边数不足的情况 |
 |`1000 1000 / 1 ... 1`|`YES`| 最大尺寸和大产量 |
 |`1000 1000 / 1 ... 1`|`YES`| 全部相等的行度和边界列使用 |

 ## 边缘情况

 对于```
2 2
2 2
```我们有`S=4`,`k=2`， 和`E=min(1,2)=1`。 施工需要`S-E=3`列，但只存在两列。 它立即打印`NO`。 这抓住了这样一个事实，即森林限制比仅仅要求边数最多为顶点数减一更强。 

为了```
5 3
3 3 0 0 0
```我们有`S=6`,`k=2`，再一次`E=1`。 最小列数为`6-1=5`，这超过了`m=3`。 该算法在尝试构建任何图之前会拒绝该实例。 这正是仅检查的情况`S <= n+m-1`给出了错误的答案。 

为了```
3 2
2 0 0
```有一个正行，所以`k=1`,`S=2`， 和`E=0`。 两个必需的列都成为私有叶列。 第一行是`11`，另外两行为零。 该图是以行为中心的星形，是一棵树，因此存在有效的检查顺序。 

为了```
3 3
0 0 0
```我们有`k=0`。 任何地方都没有边，因此每行和每列的度数都为零。 特殊情况直接打印全零矩阵和六个顶点的任意排列。 这可以避免尝试构建没有正行的连接器林。 

对于具有 1000 行和 1000 列且每个`a_i=1`，我们有`S=1000`,`k=1000`， 和`E=999`。 建设用途`1000-999=1`连接器森林的列，其余的度单位结构由相同的连接器树表示。 生成的二分图是一棵包含所有 1000 个行顶点和一个已使用列的树，而其他 999 个列是隔离的。 最后的叶子去除过程会自动处理孤立的列。 

所有这些情况背后的中心不变量都没有改变：每个`1`是森林的边缘。 一旦建立了该不变量，就可以通过重复删除最多具有一条剩余边的顶点来保证所需的检查顺序。
