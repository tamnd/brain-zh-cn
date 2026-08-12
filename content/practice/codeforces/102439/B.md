---
title: "CF 102439B - Varvara 和矩阵"
description: "我们有一个 (n × m) 矩阵，其条目是从 (0) 到 (k) 的整数。 零标记未知单元格，特殊条件是每行每列最多包含一个零。 我们必须用 (A) 或 (B) 独立地替换每个零。"
date: "2026-08-10T06:41:49+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102439
codeforces_index: "B"
codeforces_contest_name: "2018-2019 9th BSUIR Open Programming Championship. Semifinal"
rating: 0
weight: 102439
solve_time_s: 364
verified: true
draft: false
---

[CF 102439B - Varvara 和矩阵](https://codeforces.com/problemset/problem/102439/B)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个 (n \times m) 矩阵，其条目是从 (0) 到 (k) 的整数。 零标记未知单元格，特殊条件是每行每列最多包含一个零。 我们必须用 (A) 或 (B) 独立地替换每个零。 

矩阵的美妙之处在于对行对和列对进行计数，其中四个交集单元格都包含相同的值。 我们没有被要求保留美丽矩形的实际集合，只保留其总数。 关键的结果是，每个包含零的矩形在替换之前并不美观，因为在每行一零和每列一零的条件下不可能有四个零角。 因此，唯一可能的变化是，一些以前不漂亮的矩形在填充零后变得漂亮。 任务正是防止出现每一个这样的新矩形。 

维度最多为 (1000)，因此扫描整个矩阵或对每个单元进行恒定量的工作是实用的。 相反，枚举所有行对和所有列对已经给出

 249,500,250,000
 ]

 最大的正方形情况下的矩形。 这立即排除了检查每个矩形的算法。 零的数量也最多为（1000），因为零形成行和列之间的匹配。 正是这种少量的未知单元使布尔约束公式成为可能。 

值（k）可以大到（nm），但其大小并不影响算法。 我们只关心固定单元格是否等于 (A)、等于 (B) 或都不等于。 

直接方法可能会错误处理几种边缘情况。 首先，可以禁止单个零取两个值之一。 例如，```
2 2
2
1 2
0 1
1 1
```零不能变成 (1)，因为这会创建一个全 (1) 矩形。 可变为(2)，故正确结果为`Yes`，例如```
2 1
1 1
```将每个零视为可自由分配的粗心算法可能会意外创建矩形。 

一个更微妙的情况是禁止一个零同时取这两个值。 考虑```
3 3
2
1 2
1 1 1
1 0 2
1 2 2
```如果中心变为(1)，则左上角(2\times2)矩形全部变为(1)。 如果变成(2)，则右下(2\times2)矩形全部变成(2)。 不存在替代品，所以答案是`No`。 这两个限制来自不同的矩形，必须组合起来。 

另一种边缘情况涉及两个零。 考虑```
2 2
2
1 2
0 1
1 0
```两个零是对角，另外两个角是 (1)。 它们不能同时被 (1) 替换，因为那样会创建一个全 (1) 矩形。 然而，它们可以接收不同的值，所以答案是`Yes`。 仅处理涉及一个零的约束将错过这个条件。 

这些正是下面使用的 2-SAT 公式所捕获的限制类型。 原始声明和限制可在官方 Codeforces Gym 档案中找到。 

## 方法

 直接的暴力解决方案将尝试所有 (2^z) 次替换，其中 (z) 是零的数量，并在每次替换后计算美度。 对于每个作业，枚举每个矩形需要

 [
 O(n^2m^2)
 ]

 时间。 在最坏的情况下（n=m=1000），正好有（249,500,250,000）个矩形，所以暴力工作大约是

 [
 249,500,250,000 \cdot 2^{1000}
 ]

 矩形检查。 即使检查每个矩形一次也已经远远超出了限制。 

接下来的观察是我们实际上不需要计算美丽。 以前漂亮的每个矩形都不包含零，它的四个值保持不变。 因此，原来美丽的矩形会自动保留。 我们只需禁止替换零角后变得漂亮的矩形即可。 

因为每一行和每一列最多有一个零，所以一个矩形最多包含两个零。 如果它恰好包含一个零，则其他三个角是固定的。 零不能获得它们的共同值。 如果它包含两个零，它们必须占据相对的角，另外两个角是固定的。 如果这两个固定角都等于 (A)，则两个零不能同时接收 (A)。 (B)也同样。 

这仅给出了两种逻辑限制。 可以禁止一个零取(A)或(B)，或者可以禁止两个零同时取(A)或同时取(B)。 两者都是最多涉及两个布尔变量的子句，因此整个问题变成了 2-SAT。 

剩下的困难是快速找到所有一零限制。 对于 ((x,y)) 处的零，假设我们想知道分配它 (A) 是否会创建一个全 (A) 矩形。 我们需要另一行（r）和另一列（c）满足

 [
 a_{x,c}=A,\qquad
 a_{r,c}=A,\qquad
 a_{r,y}=A。 
]

 对于每一行 (x)，构建一个位集，其中包含在行 (x) 也具有 (A) 的列中某处具有 (A) 的所有行 (r)。 然后将其与 (y) 列中具有 (A) 的行的位集相交。 非空交集意味着所需的矩形存在。 

对 (B) 进行相同的构造。 这是该问题的标准解决方案中使用的位集优化。 

对于二零矩形，最多有 (1000) 个零，因此直接检查所有对仅花费 (O(z^2))。 然后，我们用强连接组件求解生成的 2-SAT 实例。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(2^z n^2m^2)) | (O(nm)) | 太慢了|
 | 矩形枚举| (O(n^2m^2)) | (O(nm)) | 太慢了|
 | 最佳 | (O(nm\lceil n/w\rceil + z^2 + E)) | (O(nm + E)) | 已接受 |

 这里(z\le\min(n,m))，(w)是位集表示使用的机器字大小，(E=O(zn+z^2))是蕴含边的数量。 对于 (n,m\le1000)，位集操作足够小，足以适合预期的方法。 

## 算法演练

 1. 读取矩阵并将每个零记录为布尔变量。 对于变量 (i)，令`A_i`意味着它的零被（A）取代，并且让`B_i`意思是它被（B）取代。 由于每个零必须恰好接收一个值，`A_i`和`B_i`是互补的文字。 
2. 为包含 (A) 和 (B) 的位置构建位集。 对于每一行，存储包含 (A) 的列，并单独存储包含 (B) 的列。 对于每一列，存储包含 (A) 的行，并单独存储包含 (B) 的行。 
3. 对于每一行 (x)，构造`coverA[x]`。 它的设置位正是存在某些列 (c) 的行 (r)，同时具有 (a_{x,c}=A) 和 (a_{r,c}=A)。 构造`coverB`以同样的方式。 

这会将对一零矩形的搜索转变为一个位集交集，而不是扫描每一可能的行和列对。 
4. 对于 ((x,y)) 处的每个零，检查是否`colA[y] & coverA[x]`是非空的。 如果是，则存在行（r）和列（c），使得矩形的其他三个角都是（A）。 因此，这个零不能被分配（A），所以添加蕴涵

 [
 A_i \右箭头 B_i。 
]

 对 (B) 执行类似的检查。 如果成功则添加

 [
 B_i \右箭头 A_i。 
]
 5. 考虑每对不同的零 (i=(x,y)) 和 (j=(r,c))。 由于每一行和每一列最多包含一个零，因此它们的行和列自动不同。 唯一包含两个零的矩形将它们放在对角处。 

如果 (a_{x,c}=A) 和 (a_{r,y}=A)，将 (A) 分配给两个零将创建一个新的漂亮矩形。 因此该条款是

 [
 \neg(A_i\和 A_j),
 ]

 这变成了两个含义

 [
 A_i\右箭头 B_j,
 \qquad
 A_j\右箭头 B_i。 
]

 如果两个固定角都是(B)，则加上对称限制

 [
 B_i\右箭头 A_j,
 \qquad
 B_j\右箭头 A_i。 
]
 6. 蕴涵图现在代表了每一个会创建一个新的漂亮矩形的作业。 在其上运行强连通分量算法。 当变量及其补集属于同一强连通分量时，2-SAT 实例是不可能的。 
7. 如果某个零有`A_i`和`B_i`在同一个组件中，打印`No`。 否则，根据组件顺序选择一个值，替换每个零，然后打印结果矩阵。 

### 为什么它有效

 每个在替换之前漂亮的矩形都不包含零，因此它的四个角永远不会改变。 因此，只有当旧的矩形发生变化时，美感才会减少，而这是不可能发生的，并且只有当包含一两个零的矩形变成单色时，美感才会增加。 

矩形最多包含两个零，因为没有行或列包含两个零。 有了一个零，其他三个角就固定了，所以唯一的限制是零不能取它们的共同值。 对于两个零，它们是相对的角，另外两个角是固定的，因此当这些固定角与（A）或（B）一致时，唯一的限制发生，禁止两个零都取该值。 

该算法准确地创建了这些限制，而不创建其他限制。 图中的每一个含义都代表了避免出现新的漂亮矩形的必要条件，并且每一个可能的新的漂亮矩形都会产生这些含义之一。 因此，2-SAT 实例的令人满意的分配恰好对应于全零的有效替换。 SCC 测试是 2-SAT 的标准可满足性标准。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline
sys.setrecursionlimit(1_000_000)

def solve():
    n, m = map(int, input().split())
    k = int(input())
    A, B = map(int, input().split())

    matrix = []
    row_a = [0] * n
    row_b = [0] * n
    col_a = [0] * m
    col_b = [0] * m
    zeros = []

    for i in range(n):
        row = list(map(int, input().split()))
        matrix.append(array('I', row))

        ma = 0
        mb = 0

        for j, value in enumerate(row):
            if value == 0:
                zeros.append((i, j))
            elif value == A:
                ma |= 1 << j
                col_a[j] |= 1 << i
            elif value == B:
                mb |= 1 << j
                col_b[j] |= 1 << i

        row_a[i] = ma
        row_b[i] = mb

    z = len(zeros)

    if z == 0:
        out = ["Yes"]
        out.extend(" ".join(map(str, row)) for row in matrix)
        sys.stdout.write("\n".join(out))
        return

    # cover_a[x] contains every row r that shares an A-column
    # with row x. cover_b is analogous.
    cover_a = [0] * n
    cover_b = [0] * n

    for i in range(n):
        bits = row_a[i]
        cur = 0
        while bits:
            low = bits & -bits
            c = low.bit_length() - 1
            cur |= col_a[c]
            bits -= low
        cover_a[i] = cur

        bits = row_b[i]
        cur = 0
        while bits:
            low = bits & -bits
            c = low.bit_length() - 1
            cur |= col_b[c]
            bits -= low
        cover_b[i] = cur

    nodes = 2 * z

    # Forward-star representation of the implication graph.
    head = [-1] * nodes
    to = array('i')
    nxt = array('i')

    def add_edge(u, v):
        e = len(to)
        to.append(v)
        nxt.append(head[u])
        head[u] = e

    # Literal encoding:
    # 2*i     = zero i is assigned A
    # 2*i + 1 = zero i is assigned B
    #
    # The complement of a literal is literal ^ 1.

    # Restrictions involving exactly one zero.
    for i, (x, y) in enumerate(zeros):
        a_lit = 2 * i
        b_lit = a_lit + 1

        if col_a[y] & cover_a[x]:
            # A_i is forbidden: A_i -> B_i
            add_edge(a_lit, b_lit)

        if col_b[y] & cover_b[x]:
            # B_i is forbidden: B_i -> A_i
            add_edge(b_lit, a_lit)

    # Restrictions involving two zeros.
    for i in range(z):
        x, y = zeros[i]
        ai = 2 * i
        bi = ai + 1

        for j in range(i + 1, z):
            r, c = zeros[j]
            aj = 2 * j
            bj = aj + 1

            if matrix[x][c] == A and matrix[r][y] == A:
                # Not (A_i and A_j).
                add_edge(ai, bj)
                add_edge(aj, bi)

            if matrix[x][c] == B and matrix[r][y] == B:
                # Not (B_i and B_j).
                add_edge(bi, aj)
                add_edge(bj, ai)

    # Tarjan SCC.
    index = [-1] * nodes
    low = [0] * nodes
    on_stack = [False] * nodes
    stack = []
    component = [-1] * nodes
    timer = 0
    comp_id = 0

    def dfs(v):
        nonlocal timer, comp_id

        index[v] = timer
        low[v] = timer
        timer += 1

        stack.append(v)
        on_stack[v] = True

        e = head[v]
        while e != -1:
            w = to[e]

            if index[w] == -1:
                dfs(w)
                if low[w] < low[v]:
                    low[v] = low[w]
            elif on_stack[w] and index[w] < low[v]:
                low[v] = index[w]

            e = nxt[e]

        if low[v] == index[v]:
            while True:
                w = stack.pop()
                on_stack[w] = False
                component[w] = comp_id
                if w == v:
                    break
            comp_id += 1

    for v in range(nodes):
        if index[v] == -1:
            dfs(v)

    # A variable and its complement in the same SCC means
    # that the 2-SAT instance is unsatisfiable.
    for i in range(z):
        if component[2 * i] == component[2 * i + 1]:
            sys.stdout.write("No\n")
            return

    # Tarjan numbers SCCs in reverse topological order of the
    # condensation graph, so the larger component id is chosen.
    for i, (x, y) in enumerate(zeros):
        if component[2 * i] > component[2 * i + 1]:
            matrix[x][y] = A
        else:
            matrix[x][y] = B

    out = ["Yes"]
    out.extend(" ".join(map(str, row)) for row in matrix)
    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```输入阶段将矩阵存储在紧凑的整数数组中，而不是普通的嵌套 Python 整数列表中。 这很重要，因为 (1000\times1000) Python 整数列表的开销比矩阵所需的实际 (4) MB 32 位值要大得多。`row_a`和`row_b`是整数位集，其位 (j) 表示列 (j) 是否包含该行中的相应值。`col_a`和`col_b`在另一个方向上使用相同的想法。 Python 整数使这些位集特别方便，因为`&`,`|`，并且位移位在本机代码中同时对许多位进行操作。 

这`cover_a`建设值得重视。 假设行 (x) 在列 (c_1,c_2,\ldots) 中包含 (A)。 对于每个这样的列，`col_a[c]`包含该列中具有 (A) 的每一行。 取它们的并集给出与行 (x) 共享至少一个 (A) 列的每一行。 将此与相交`col_a[y]`然后询问这样的行在 (y) 列是否也有 (A)，与围绕零 ((x,y)) 的矩形所需的三个固定角完全匹配。 

蕴含图使用每个零两个节点。 节点`2*i`代表选择（A），节点`2*i+1`代表选择（B）。 禁止值成为相反值的单向含义。 两个零的禁止成为两个字面子句的标准含义对。 

对循环使用`i + 1`而不是所有有序对。 条件是对称的，因此检查两个订单只会重复相同的子句。 矩阵访问`matrix[x][c]`和`matrix[r][y]`是安全的，因为零位于不同的行和不同的列中。 

Tarjan 的算法避免存储第二个反向图。 在理论上最坏的情况下，蕴涵边多达约 (4) 万，这是 Python 中的一种有用的内存优化。 递归深度以 (2z\le2000) 图顶点为界，并且递归限制远高于该界限。 

最终分配使用 SCC 组件排序。 如果变量的两个文字具有不同的分量，则可以根据通常的 2-SAT 拓扑排序恰好选择一个。 整数溢出是不可能的，因为所有图索引和矩阵值在输入维度上至多都是多项式。 

## 工作示例

 ### 示例 1

 输入有三个零：

 [
 z_0=(1,3),\qquad z_1=(2,1),\qquad z_2=(4,4),
 ]

 使用基于一的坐标。 这里（A=3）和（B=5）。 

| 步骤| 零| 单零限制 | 配对限制 | 结果选择|
 | ---| ---| ---| ---| ---|
 | 1 | (z_0=(1,3)) | (z_0=(1,3)) | 无 | (z_0,z_2) 不能同时为 (3) | (5) |
 | 2 | (z_1=(2,1)) | (z_1=(2,1)) | 无 | 与其他零没有限制 | (5) |
 | 3 | (z_2=(4,4)) | (z_2=(4,4)) | 无 | (z_0,z_2) 不能同时为 (3) | (3) |
 | 4 | 所有变量 | SCC 一致 | 没有变量与其补集发生冲突 |`Yes`|

 唯一相关的新矩形由第一个和第四个零以及两个固定的 (3) 形成。 因此，这两个零不能同时变为 (3)。 分配 (z_0=5,z_1=5,z_2=3) 满足限制并匹配样本的有效构造。 

### 示例 2

 这里 (A=1) 和 (B=2)，零位于 ((2,2)) 和 ((3,3))。 

| 步骤| 零| （一）限制| (B) 限制 | 结果 |
 | ---| ---| ---| ---| ---|
 | 1 | ((2,2)) | ((2,2)) | 被全（1）矩形禁止 | 允许 | 必须是 (2) |
 | 2 | ((3,3)) | ((3,3)) | 受到相应约束的禁止 | 被另一个矩形限制 | 被迫冲突|
 | 3 | 两个变量 | 影响传播| (A_i) 和 (B_i) 相互到达 | 相同的SCC |
 | 4 | 公式| 变量等于其补数 | 不满意|`No`|

 第一个零已经受到来自其他三个角为 (1) 的矩形的限制。 第二个零提供了额外的含义，并且生成的含义图将变量的两个可能的文字放入同一个强连接组件中。 2-SAT 实例无法令人满意，因此任何替代品都无法保持美丽。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(nm\lceil n/w\rceil + z^2 + E)) | 位集结构加上所有零对和 SCC 边缘 |
 | 空间| (O(nm + E)) | 矩阵、位集和蕴涵图 |
 | 变量数量 | (z\le\min(n,m)) | 每行每列最多有一个零 |
 | 图边数 | (E=O(zn+z^2)) | 一零和二零限制 |

 对于 (n,m\le1000)，最多有 (1000) 个布尔变量。 位集工作一次最多操作 (1000) 位，而对枚举最多包含约 (500,000) 个零对。 SCC 图只有 (2000) 个顶点。 这与在 (1000\times1000) 矩阵中枚举大约 (2.5\times10^{11}) 可能的矩形有根本的不同。 

标准 C++ 公式将方形尺寸的位集部分描述为 (O(n^3/w))，这与此处使用的字并行思想相同。 

## 测试用例

 以下测试工具运行相同`solve()`函数，验证`Yes`通过重新计算小矩阵的美度来得到答案，检查`No`直接回答，并包含 (1000\times1000) 边界情况，而无需尝试 (O(n^2m^2)) 美丽计算。```python
import sys
import io
from array import array

# Paste the solve() implementation from the solution above here.

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def parse_input(inp: str):
    lines = inp.strip().splitlines()
    n, m = map(int, lines[0].split())
    k = int(lines[1])
    A, B = map(int, lines[2].split())
    mat = [list(map(int, lines[3 + i].split())) for i in range(n)]
    return n, m, A, B, mat

def beauty(mat):
    n = len(mat)
    m = len(mat[0])
    ans = 0

    for r1 in range(n):
        for r2 in range(r1 + 1, n):
            for c1 in range(m):
                x = mat[r1][c1]
                for c2 in range(c1 + 1, m):
                    if (
                        x != 0
                        and x == mat[r1][c2]
                        and x == mat[r2][c1]
                        and x == mat[r2][c2]
                    ):
                        ans += 1

    return ans

def validate_yes(inp, out):
    n, m, A, B, original = parse_input(inp)
    lines = out.strip().splitlines()

    assert lines[0] == "Yes"
    assert len(lines) == n + 1

    result = [list(map(int, lines[i + 1].split())) for i in range(n)]

    assert all(len(row) == m for row in result)

    for i in range(n):
        for j in range(m):
            if original[i][j] == 0:
                assert result[i][j] in (A, B)
            else:
                assert result[i][j] == original[i][j]

    assert beauty(original) == beauty(result)

def validate_no(inp, out):
    assert out.strip() == "No"

# Provided sample 1.
sample1 = """\
4 4
5
3 5
1 1 0 3
0 5 4 5
1 1 4 4
2 5 3 0
"""

out = run(sample1)
validate_yes(sample1, out)

# Provided sample 2.
sample2 = """\
4 4
4
1 2
1 1 3 3
1 0 2 3
1 2 0 3
1 3 1 3
"""

out = run(sample2)
validate_no(sample2, out)

# Custom 1: minimum-size matrix, all equal, no zeros.
case1 = """\
2 2
2
1 2
1 1
1 1
"""

out = run(case1)
validate_yes(case1, out)

# Custom 2: two opposite zeros. They cannot both become A,
# but assigning different values is valid.
case2 = """\
2 2
2
1 2
0 1
1 0
"""

out = run(case2)
validate_yes(case2, out)

# Custom 3: one zero is forbidden from both A and B.
case3 = """\
3 3
2
1 2
1 1 1
1 0 2
1 2 2
"""

out = run(case3)
validate_no(case3, out)

# Custom 4: maximum-size boundary case.
# There are no zeros, so the matrix must simply remain unchanged.
n = 1000
row = "7 " * 999 + "7"
case4 = f"{n} {n}\n1000\n1 2\n" + "\n".join([row] * n) + "\n"

out = run(case4)
lines = out.strip().splitlines()

assert lines[0] == "Yes"
assert len(lines) == n + 1
assert lines[1] == row
assert lines[-1] == row
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 x 2`，所有条目都相等 |`Yes`| 最小尺寸和非零情况 |
 |`2 x 2`具有相反的零|`Yes`| 两个零子句 |
 |`3 x 3`与一零 |`No`| 禁止使用单个变量的两个值 |
 |`1000 x 1000`，没有零 |`Yes`| 最大矩阵维度和边界内存使用量 |
 | 提供样品1 |`Yes`| 正常可满足实例|
 | 提供样品2 |`No`| SCC矛盾|

 ## 边缘情况

 一零的情况```
2 2
2
1 2
0 1
1 1
```零位于 ((1,1))。 其行在第 (2) 列中包含 (1)，其列在行 (2) 中包含 (1)。 剩余的角也是 (1)，因此将零分配给 (1) 将创建一个新的漂亮矩形。 该算法检测到`col_a[y] & cover_a[x]`作为非空并添加 (A_i\rightarrow B_i)。 (B)没有相应的限制，因此SCC求解器选择(B=2)。 输出可以是```
Yes
2 1
1 1
```两个零的情况```
2 2
2
1 2
0 1
1 0
```对角有零点。 如果两者都变为 (1)，则所有四个角都将为 (1)，因此算法添加

 [
 A_0\右箭头 B_1
 ]

 和

 [
 A_1\右箭头B_0。 
]

 赋值 (A_0=B)、(A_1=A) 满足这两个含义，给出```
Yes
2 1
1 2
```也可以同时禁止两个值中的零：```
3 3
2
1 2
1 1 1
1 0 2
1 2 2
```对于中心零，左上角矩形有三个固定的（1），所以中心不能变成（1）。 右下矩形有三个固定的(2)，所以它不能变成(2)。 因此，该图包含 (A_0\rightarrow B_0) 和 (B_0\rightarrow A_0) 这两个含义，将两个文字放在同一个 SCC 中。 求解器打印`No`。 

如果没有零，则没有布尔变量，也没有含义。 每个矩形都保持四个角完全相同，因此美感自然不会改变。 该算法立即打印`Yes`和原始矩阵。 

如果 (A) 或 (B) 没有出现在原始矩阵中的任何位置，则相应的位集将保持为空。 仍然可以为该值分配零，并且不能存在其固定角使用该缺失值的新矩形。 位集交集自然不会对该值产生任何限制。 

每行一零和每列一零条件也是必不可少的。 它保证矩形最多包含两个零。 如果没有这个属性，一个矩形可能包含三个或四个零，并且该解决方案使用的两种子句将不再覆盖每个可能的新的漂亮矩形。
