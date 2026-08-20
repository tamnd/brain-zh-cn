---
title: "CF 102190I - 标准输入/输出"
description: "我们有 (n) 个点和一个 (n × n) 距离矩阵。 有些条目已经包含它们的最终值，而每个（-1）代表我们可以自由选择的距离。"
date: "2026-08-20T00:44:35+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102190
codeforces_index: "I"
codeforces_contest_name: "2019 ECNU Campus Invitational Contest"
rating: 0
weight: 102190
solve_time_s: 133
verified: true
draft: false
---

[CF 102190I - 标准输入/输出](https://codeforces.com/problemset/problem/102190/I)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有 (n) 个点和一个 (n \times n) 距离矩阵。 有些条目已经包含它们的最终值，而每个（-1）代表我们可以自由选择的距离。 最终的矩阵必须满足四个必需的属性：每个对角线条目都为零，每个距离都是非负的，矩阵是对称的，并且每个直接距离服从三角不等式。 

对现有条目的限制非常严格。 如果输入为 (d(i,j)=7)，则答案也必须在该位置包含 (7)。 另一方面，未知条目可以采用 (0) 到 (10^9) 之间的任何值。 该语句允许不同点之间为零，因此这是一个伪度量，而不是更严格的约定，其中不同点必须具有正距离。 

最大的矩阵有 (500^2=250000) 个条目，所有测试用例的 (n) 之和最多为 (500)。 这使得 (O(n^3)) 算法自然成为目标。 在 (n=500) 时，三次工作大约是 (125) 万次基本迭代，而 (O(n^4)) 或更糟的情况会变得不必要的昂贵。 (n) 的小总和还可以防止许多大型测试用例乘以立方成本。 

在某些情况下，简单的填充策略可能会悄无声息地失败。 已知的对角线值，例如```
2
1 -1
-1 0
```必须产生`NO`，因为第一个点与其自身的距离必须为零。 只处理非对角线条目的粗心算法可能会忽略这一矛盾。 

对称性也可能被直接破坏。 例如，```
2
0 3
4 0
```不可能，因为相同距离的两种表示不一致。 仅填充 (-1) 条目不会修复此问题，因为现有值都不会更改。 

更微妙的矛盾来自较短的已知路径。 考虑```
3
0 5 2
5 0 2
2 2 0
```点 (1) 和 (2) 之间的直接距离固定为 (5)，但路线 (1 \rightarrow 3 \rightarrow 2) 的长度为 (4)。 任何度量都必须满足 (d(1​​,2)\le4)，因此固定值 (5) 使得实例不可能。 对于此类较大的路径，仅检查输入中明确存在的三角形是不够的。 

最后，可以断开已知距离图。 例如，```
3
0 2 -1
2 0 -1
-1 -1 0
```是可以完美完成的。 前两点形成一个组成部分，第三点形成另一个组成部分。 我们可以选择组件之间足够大的距离。 假设每对都有有限最短路径的解决方案将错误地拒绝这种情况。 

官方竞赛样本包含四个测试用例，包括上述断开连接和部分指定的情况。 

## 方法

 暴力方法会将每个未知距离视为变量并尝试可能的值，直到找到完整的度量。 即使在利用对称性之后，（n=500）实例也可以具有

 [
 \frac{500\cdot499}{2}=124750
 ]

 未知的无序对。 由于输出值可以是 (0) 到 (10^9) 之间的任何整数，因此穷举枚举有

 [
 (10^9+1)^{124750}
 ]

 最坏情况下可能的分配。 检查每个候选本身需要至少 (O(n^3)) 工作来验证所有三角形不等式。 这不仅太慢，而且在计算上也是不可行的。 

蛮力思想确实包含正确的概念起点：每个已知距离都可以被视为必须保持不变的约束。 关键是不要将缺失的条目视为自变量。 

将每个已知距离视为无向加权边。 一旦构建了该图，任何有效的指标都必须满足

 [
 d(u,v)\le d(u,x_1)+d(x_1,x_2)+\cdots+d(x_k,v)
 ]

 对于 (u) 和 (v) 之间的每条路径。 因此，只有当其总权重小于 (w) 的端点之间不存在已知路径时，权重 (w) 的固定边才能生存。 

已知图的最短路径度量准确地给出了现有约束所强制的最强距离。 如果固定边长于其已知的最短路径，则该实例是不可能的。 如果没有固定边变短，则最短路径距离本身就是每个连接组件内的有效完成。 

这正是 Floyd-Warshall 的计算结果。 使用已知距离和无穷大来初始化矩阵以查找缺失的条目，然后计算所有对的最短路径。 之后，每个已知距离必须等于相应的最短路径距离。 

断开连接的组件需要一个最后的细节。 两个不同组件之间没有路径，因此在 Floyd-Warshall 之后它们的距离仍然无穷大。 我们可以用 (10^9) 替换每个这样的无穷大。 在组件之间选择一个足够大的共同值可以保留三角不等式并保持在所需的输出范围内。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (\Theta((10^9+1)^{\Theta(n^2)})) 候选 | (O(n^2)) | 太慢了 |
 | 最佳| (O(n^3)) | (O(n^2)) | 已接受 |

 ## 算法演练

 1. 阅读矩阵并记住哪些条目最初是固定的。 仅当输入对角线已为零时，才将工作对角线设置为零。 如果已知的对角线条目是其他内容，请立即拒绝，因为没有指标可以更改它。 
2. 检查每对 (i,j) 的对称性。 如果 (d(i,j)) 和 (d(j,i)) 都已知，则它们必须相等。 如果仅知道一个方向，则将该值复制到工作矩阵中的另一方向。 这是有效的，因为缺失的条目还没有限制，而对称性迫使它等于已知的条目。 
3. 将每个已知的非对角距离解释为无向加权边。 将缺失距离初始化为`INF`， 在哪里`INF`远大于每个可能的有限最短路径距离。 
4. 运行弗洛伊德·沃歇尔。 对于每个中间顶点 (k)，尝试使用以下方法改进每对 (i,j) 到 (k)

 [
 d(i,j)=\min(d(i,j),d(i,k)+d(k,j))。 
]

 生成的矩阵包含仅使用已知距离的最短路径。 

1. 根据最短路径矩阵检查每个最初固定的距离。 如果原始值（w）变得小于（w），则固定边比强制路径长并且不存在补全。 拒绝测试用例。 
2. 更换所有剩余的`INF`输入 (10^9)。 这些正是位于已知距离图的不同连通分量中的对。 大的公​​共值可以安全地连接不同的组件，因为每个有限的内部距离都远小于（10^9）。 
3. 输出结果矩阵。 Floyd-Warshall 生成的每个有限条目都是最短路径距离，而每个跨组件条目都是公共大值。 对角线保持为零。 

**为什么它有效。** 核心不变量是，在 Floyd-Warshall 之后，每个有限值 (d(i,j)) 都是完全由最初已知距离形成的路径的最小长度。 任何有效的完成都必须满足沿着每个这样的路径的三角形不等式，因此它的 (d(i,j)) 必须不大于该最短路径值。 同时，如果最初固定的边恰好具有其最短路径值，则保持该值与每个已知路径兼容。 因此，小于每个已知路径的固定值是安全的，而大于某个已知路径的固定值是不可能的。 一旦所有固定条目都通过了该测试，最短路径距离就可以通过构造满足三角不等式。 不同的连接组件之间没有约束，并且将 (10^9) 分配给每个交叉组件对会创建有效的三角形不等式，因为所有内部有限距离都低于 (10^9)。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**15
BIG = 10**9

def solve_case(a):
    n = len(a)

    # Build a symmetric working matrix.
    dist = [[INF] * n for _ in range(n)]
    fixed = []

    for i in range(n):
        if a[i][i] != -1 and a[i][i] != 0:
            return None

        dist[i][i] = 0

    for i in range(n):
        for j in range(i + 1, n):
            x = a[i][j]
            y = a[j][i]

            if x != -1 and y != -1:
                if x != y:
                    return None
                w = x
                fixed.append((i, j, w))
                dist[i][j] = w
                dist[j][i] = w
            elif x != -1:
                fixed.append((i, j, x))
                dist[i][j] = x
                dist[j][i] = x
            elif y != -1:
                fixed.append((i, j, y))
                dist[i][j] = y
                dist[j][i] = y

    # Floyd-Warshall.
    rng = range(n)
    for k in rng:
        dk = dist[k]
        for i in rng:
            di = dist[i]
            dik = di[k]
            if dik == INF:
                continue

            for j in rng:
                nd = dik + dk[j]
                if nd < di[j]:
                    di[j] = nd

    # Every fixed edge must still have exactly its original value.
    for u, v, w in fixed:
        if dist[u][v] != w:
            return None

    # Connect different components with one sufficiently large value.
    for i in rng:
        di = dist[i]
        for j in rng:
            if di[j] == INF:
                di[j] = BIG

    return dist

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())
        a = [list(map(int, input().split())) for _ in range(n)]

        ans = solve_case(a)

        if ans is None:
            out.append("NO")
            continue

        out.append("YES")
        for row in ans:
            out.append(" ".join(map(str, row)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```第一个构建阶段有意将原始矩阵与工作矩阵分开。 这`fixed`列表记录了每个已知的无序对，因此稍后我们可以区分允许更改的边和需要保持不变的边。 

对称性检查在 Floyd-Warshall 之前进行。 如果仅知道一对的一侧，则将其复制到另一侧不会修改固定值。 它只是分配对称性强制的缺失值。 如果双方都在场并且意见不同，那么就没有可能的答案。 

对角线接受特殊处理，因为没有理由将自循环放入图中。 已知的零与每个度量都一致，而任何其他已知的对角线值立即使该实例变得不可能。`INF`故意比输出限制大得多。 最多包含 500 个顶点的连通分量有一条最多有 499 条边的简单路径，并且每条原始边最多为 1000 条，因此任何有限最短路径最多为 (499000)。 所选择的`INF`因此，在合法距离内无法安全到达。 Python 整数也具有任意精度，因此不存在溢出问题。 

当以下情况时，Floyd-Warshall 循环会跳过一行：`dist[i][k]`是无限的。 这对于断开连接的图很重要，因为在整个计算过程中许多对可能仍然无法访问。 局部变量`dk`和`di`还避免了二维列表的重复索引。 

经过 Floyd-Warshall 后，仅检查输入的已知条目就足够了。 未知条目允许采用最短路径值，因此它们不会施加额外的限制。 如果固定边已被减少，则减少表示违反所需三角形不等式的已知路径。 

最后，所有不可达对都被分配`BIG`。 该值正好是 (10^9)，这是输出界限所允许的。 它大于从原始约束生成的每个可能的有限距离，因此跨组件距离不能引入会改变固定内部距离的新的较短路线。 

## 工作示例

 ### 示例 1

 第一个样本已经是一个完整的指标：```
3
0 3 3
3 0 3
3 3 0
```Floyd-Warshall 期间的关键状态没有改变。 

| 中级 (k) | (d(1,2)) | (d(1​​,2)) | (d(1,3)) | (d(2,3)) | 结果 |
 | --- | --- | --- | --- | --- |
 | 初始| 3 | 3 | 3 | 全部固定|
 | 1 | 3 | 3 | 3 | 没有改善|
 | 2 | 3 | 3 | 3 | 没有改善|
 | 3 | 3 | 3 | 3 | 没有改善|

 每个固定值都等于其最短路径距离，所以答案是`YES`接下来是相同的矩阵。 

此示例表明 Floyd-Warshall 并未尝试任意更改固定条目。 它仅揭示另一个固定边的集合是否会迫使它们变得更小。 

### 示例 2

 第二个样本是```
3
0 0 0
0 0 -1
0 -1 0
```由于对称性和已知的零距离，缺失的对被迫为零。 

| 舞台| (d(1,2)) | (d(1​​,2)) | (d(1,3)) | (d(2,3)) | 状态|
 | --- | --- | --- | --- | --- |
 | 输入 | 0 | 0 | -1 | 缺少一个方向 |
 | 对称完成 | 0 | 0 | 0 | 缺失值变为 0 |
 | (k=1) | 0 | 0 | 0 | 没有改善|
 | (k=2) | 0 | 0 | 0 | 没有改善|
 | (k=3) | 0 | 0 | 0 | 没有改善|

 最终的矩阵全为零。 

本例运用了该语句的非标准部分：允许不同点的距离为零。 对不同点假设严格积极性的实现将拒绝有效输入。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n^3)) | Floyd-Warshall 检查所有顶点三元组 |
 | 空间| (O(n^2)) | 距离矩阵和原始固定边缘信息占据二次空间|

 对于 (n\le500)，立方界是该问题的预期规模，并且测试用例的 (n) 总和也最多为 500。该矩阵最多只需要 (250000) 个距离值，因此二次内存使用很容易管理。 

## 测试用例

 建设性问题的输出不必是唯一的，因此强大的测试工具应该验证返回的矩阵，而不是比较每个矩阵`YES`情况到一个精确矩阵。 官方的小样本恰好与下面的确定性结构相匹配。```python
import sys
import io

INF = 10**15
BIG = 10**9

def solve_case(a):
    n = len(a)
    dist = [[INF] * n for _ in range(n)]
    fixed = []

    for i in range(n):
        if a[i][i] != -1 and a[i][i] != 0:
            return None
        dist[i][i] = 0

    for i in range(n):
        for j in range(i + 1, n):
            x = a[i][j]
            y = a[j][i]

            if x != -1 and y != -1:
                if x != y:
                    return None
                fixed.append((i, j, x))
                dist[i][j] = x
                dist[j][i] = x
            elif x != -1:
                fixed.append((i, j, x))
                dist[i][j] = x
                dist[j][i] = x
            elif y != -1:
                fixed.append((i, j, y))
                dist[i][j] = y
                dist[j][i] = y

    for k in range(n):
        dk = dist[k]
        for i in range(n):
            di = dist[i]
            dik = di[k]
            if dik == INF:
                continue
            for j in range(n):
                nd = dik + dk[j]
                if nd < di[j]:
                    di[j] = nd

    for u, v, w in fixed:
        if dist[u][v] != w:
            return None

    for i in range(n):
        for j in range(n):
            if dist[i][j] == INF:
                dist[i][j] = BIG

    return dist

def solve(inp):
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())
        a = [list(map(int, input().split())) for _ in range(n)]
        ans = solve_case(a)

        if ans is None:
            out.append("NO")
        else:
            out.append("YES")
            for row in ans:
                out.append(" ".join(map(str, row)))

    sys.stdin = old_stdin
    return "\n".join(out)

def parse_output(s):
    return s.strip().splitlines()

def assert_valid_case(a, output_lines, pos):
    n = len(a)

    assert output_lines[pos] == "YES"
    pos += 1

    b = []
    for _ in range(n):
        row = list(map(int, output_lines[pos].split()))
        assert len(row) == n
        b.append(row)
        pos += 1

    for i in range(n):
        assert b[i][i] == 0
        for j in range(n):
            assert 0 <= b[i][j] <= BIG
            assert b[i][j] == b[j][i]
            if a[i][j] != -1:
                assert b[i][j] == a[i][j]

    for i in range(n):
        for j in range(n):
            for k in range(n):
                assert b[i][j] <= b[i][k] + b[k][j]

    return pos

# Official sample
sample = """\
4
3
0 3 3
3 0 3
3 3 0
3
0 0 0
0 0 -1
0 -1 0
3
5 6 7
-1 -1 -1
-1 -1 -1
3
-1 3 5
-1 -1 3
-1 -1 -1
"""

expected_sample = """\
YES
0 3 3
3 0 3
3 3 0
YES
0 0 0
0 0 0
0 0 0
NO
YES
0 3 5
3 0 3
5 3 0
"""

assert solve(sample) == expected_sample.strip(), "official sample"

# Minimum-size valid input.
case_min = """\
1
2
0 1000
1000 0
"""
assert solve(case_min) == """\
YES
0 1000
1000 0
""".strip(), "minimum size and maximum fixed distance"

# All distances equal to zero, including distinct points.
case_zero = """\
1
4
0 0 -1 0
0 0 0 -1
-1 0 0 0
0 -1 0 0
"""
assert solve(case_zero) == """\
YES
0 0 0 0
0 0 0 0
0 0 0 0
0 0 0 0
""".strip(), "all-zero pseudometric"

# A longer known path contradicts a fixed direct edge.
case_shorter_path = """\
1
3
0 5 2
5 0 2
2 2 0
"""
assert solve(case_shorter_path).strip() == "NO", "fixed edge is longer than a known path"

# Asymmetric fixed values.
case_asymmetric = """\
1
2
0 3
4 0
"""
assert solve(case_asymmetric).strip() == "NO", "symmetry contradiction"

# Maximum-size case, all distances initially unknown.
n = 500
rows = []
for i in range(n):
    row = [-1] * n
    row[i] = 0
    rows.append(row)

max_input = "1\n500\n" + "\n".join(" ".join(map(str, row)) for row in rows) + "\n"
max_output = solve(max_input)
max_lines = parse_output(max_output)

assert max_lines[0] == "YES"
assert len(max_lines) == 501

for i in range(500):
    row = list(map(int, max_lines[i + 1].split()))
    assert len(row) == 500
    assert row[i] == 0
    for j in range(500):
        if i != j:
            assert row[j] == BIG
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2`有距离的点`1000`| 固定矩阵| 最小尺寸和最大允许输入距离 |
 | 所有距离均为零的四个点 | 全零矩阵| 不同点之间的距离为零 |
 | 带边的三点`2, 2, 5`|`NO`| 检测较短的多边路径 |
 | 两点与`3`朝一个方向并且`4`在另一个|`NO`| 对称性验证 |
 | 仅零对角线的 (500\times500) 矩阵 |`YES`，零对角线和 (10^9) 其他地方 | 最大尺寸和断开组件|

 ## 边缘情况

 在图形处理之前，非零固定对角线将被拒绝。 对于输入```
1
2
1 -1
-1 0
```第一个对角线条目是`1`， 所以`solve_case`立即返回`None`。 输出是`NO`。 没有最短路径计算可以使这一点有效，因为对角线是直接度量公理。 

不对称对在 Floyd-Warshall 之前处理。 和```
1
2
0 3
4 0
```该对 ((1,2)) 有两个固定值，`3`和`4`。 施工检测`x != y`并驳回该案。 一种诱人的替代方案是用另一侧覆盖一侧，但这会违反固定输入值无法修改的要求。 

较短路径矛盾是通过所有对最短路径相位来检测的。 为了```
1
3
0 5 2
5 0 2
2 2 0
```初始边 (1\leftrightarrow2) 有权重`5`。 一旦顶点 (3) 被视为中间顶点，Floyd-Warshall 就得到

 [
 d(1,2)=\min(5,2+2)=4。 
]

 原来的固定值为`5`，所以最终验证失败，答案是`NO`。 同样的论点适用于包含许多边的路径，这就是为什么仅检查直接可见的三角形是不够的。 

部分指定的对称对从已知侧填充。 在```
1
3
0 3 -1
-1 0 4
-1 -1 0
```条目 (d(1​​,2)) 和 (d(2,1)) 变为`3`，而 (d(2,3)) 和 (d(3,2)) 变为`4`。 剩下的一对可以选择为`7`，这是通过顶点 (2) 的最短路径值。 该算法自然地通过 Floyd-Warshall 发现了这一点。 

计算出最短路径后，断开的组件就完成了。 为了```
1
3
0 2 -1
2 0 -1
-1 -1 0
```顶点 (1) 和 (2) 有距离`2`，而顶点 (3) 与它们没有已知的连接。 Floyd-Warshall 将跨组件条目保留在`INF`，最后阶段将这些条目更改为 (10^9)。 得到的矩阵是```
0 2 1000000000
2 0 1000000000
1000000000 1000000000 0
```每个涉及两个交叉分量距离的三角形都是有效的，并且内部距离`2`远小于 (10^9+10^9)。 

最后，根据该问题的定义，每个非对角线条目都等于零的输入是有效的。 例如，```
1
3
0 0 0
0 0 0
0 0 0
```通过不变。 该实现永远不会插入对不同顶点的积极性要求，以匹配问题所使用的实际条件。
