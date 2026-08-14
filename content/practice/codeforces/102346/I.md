---
title: "CF 102346I - 星际"
description: "我们有一个无向加权图，其顶点是行星，边是直接旅行路线。 每个星球都有温度。"
date: "2026-08-13T01:35:59+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102346
codeforces_index: "I"
codeforces_contest_name: "2019-2020 ACM-ICPC Brazil Subregional Programming Contest"
rating: 0
weight: 102346
solve_time_s: 487
verified: true
draft: false
---

[CF 102346I - 星际](https://codeforces.com/problemset/problem/102346/I)

 **评级：** -
 **标签：** -
 **求解时间：** 8m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个无向加权图，其顶点是行星，边是直接旅行路线。 每个星球都有温度。 客户要求从行星（A）到行星（B）的最短路径，但对每个中间行星施加限制：根据请求，中间行星必须属于最冷（K）温度级别或最热（K）温度级别。 

来源地和目的地不受温度限制。 只有路线上严格位于它们之间的顶点才必须满足它。 答案是有效路径的最小总边长，或者（-1）（当不存在有效路径时）。 

短语“最冷 (K) 温度”最好通过由第 (K) 个最小温度引起的温度阈值来理解。 相同的温度必须被视为一个边界组。 例如，如果温度为 (5,10,10,20)，则两个最冷的温度为 (5) 和 (10)，因此允许温度为 (10) 的两个行星。 这同样适用于最热的一侧。 第二个示例完全取决于此行为：在热侧 (K=2) 时，允许温度 (20) 和 (10)，因此可以使用温度为 (10) 的所有三个行星。 

该图最多有 400 个顶点，最多可以有 (N(N-1)/2) 个边（大约 80,000 个），以及多达 100,000 个查询。 少量的顶点强烈建议采用全对最短路径技术，而大量的查询则排除了为每个请求独立运行最短路径算法的可能性。 官方存档的声明给出了 1 秒的时间限制和 1024 MB 的内存限制，因此预期的实现是一个紧凑的 (O(N^3)) Floyd-Warshall 风格的解决方案。 

有几个细节可能会导致看似合理的实现返回错误的答案。 

首先，端点不受限制。 考虑：```
2 1
0 10
1 2 7
1
1 2 1 0
```答案是`7`。 行星 1 是最冷的，但行星 2 不需要满足限制，因为它是目的地。 如果解决方案只是删除超出允许温度设置的所有行星，则会删除行星 2 并错误地返回`-1`。 

其次，必须作为一个群体来处理相同的温度。 考虑：```
4 3
1 2 2 3
1 2 1
2 3 1
3 4 1
2
1 4 2 0
1 4 2 1
```对于冷请求，第二冷的温度是`2`，因此行星 2 和 3 都是允许的。 路线有长度`3`。 对于热请求，第二高的温度也是`2`，所以同样的路线有效，答案又是`3`。 精确选择两个行星索引而不是使用温度阈值的实现可能会意外地只允许两个行星中的一个具有温度`2`。 

第三，即使两个端点都不属于允许的温度设置，直接边缘也必须保持可用。 例如：```
3 1
0 50 100
1 3 9
1
1 3 1 0
```答案是`9`，因为该路线根本没有中间行星。 要求路线的每个顶点都在允许集中的解决方案会错误地拒绝它。 

最后，断开连接的图必须在整个计算过程中保持断开连接。 例如：```
2 0
0 1
1
1 2 1 0
```答案是`-1`，不是一个很大的有限值。 因此，实现需要一个无穷大的值，并且必须将无法到达的距离转换回`-1`。 

## 方法

 最直接的做法就是独立处理每个客户。 对于一个查询，我们可以确定允许的温度阈值，忽略禁止的中间行星，并从 (A) 到 (B) 运行 Dijkstra 算法。 由于所有路线长度均为正数，因此 Dijkstra 对于每个单独的请求都是正确的。 

问题是请求的数量。 在最坏的情况下，大约有 80,000 个边和 100,000 个查询。 即使使用良好的堆实现，处理每个请求的成本也是独立的 (O(Q(R+N)\log N))。 对于最大边界，这意味着在考虑对数因子之前，大约有 (10^5 \cdot 8\cdot10^4) 的量级，大约数十亿个与边缘相关的操作。 每个查询重新计算全对解决方案会更糟糕，在 (O(QN^3)) 处，大约 (6.4\cdot10^{11}) Floyd-Warshall 松弛。 

使更快的解决方案成为可能的结构是允许的集合是嵌套的。 当我们从最冷的温度移动到更热的温度时，我们只添加行星。 对于冷请求，允许的中间顶点是温度至多某个阈值的所有行星。 因此，具有较大 (K) 的请求具有可用于具有较小 (K) 的请求的顶点超集。 当处理温度从最热到最冷时，存在相同的嵌套。 

这正是 Floyd-Warshall 可以被视为允许的中间顶点集上的动态程序的设置。 假设前 (k) 个温度组已被激活。 让`dist[i][j]`是从 (i) 到 (j) 的最短距离，其内部顶点都属于这些激活的组。 当允许出现新的行星 (v) 时，每条新的最短路径要么不使用 (v)，要么可以分为从 (i) 到 (v) 的路径，然后是从 (v) 到 (j) 的路径。 重现是通常的 Floyd-Warshall 松弛：

 [
 dist[i][j] = \min(dist[i][j], dist[i][v] + dist[v][j])。 
]

 我们从冷到热运行此过程一次，从热到冷运行一次。 查询是根据其阈值激活的温度组的数量来存储的，因此每个查询在达到其所需的距离矩阵状态时都会得到准确的回答。 

等温问题自然适合这个公式。 我们不会在温度组中途回答查询。 首先激活具有相同温度的每个行星，然后才回答阈值达到该温度的查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每个查询都使用 Dijkstra 进行暴力破解 | (O(QR\log N)) 在密集最坏情况下 | (O(N+R)) | 太慢了 |
 | 最优分组 Floyd-Warshall | (O(N^3+Q)) | (O(N^2+Q)) | 已接受 |

 两次 Floyd 传递贡献了 (2N^3)，仍然是 (O(N^3))。 对于 (N\le400)，这是预期的渐近解。 在存档 1 秒限制下，编译实现是最安全的选择。 下面的 Python 实现使用局部变量和就地矩阵来保持常数因子尽可能低。 

## 算法演练

 1. 读取图形并构建 (N\times N) 距离矩阵。 将对角线设置为零，将每条直接路径放入矩阵中，并将不存在的路径保留为无穷大。 该图是无向的，因此 (u) 和 (v) 之间的边会初始化两者`dist[u][v]`和`dist[v][u]`。 
2. 对所有行星温度进行排序，并按升序构建不同的温度级别。 具有相同温度的行星被放置在同一组中，因为该温度的阈值必须允许所有行星。 
3. 对于每个可能的 (K) 值，确定第 (K) 个最小温度达到哪个温度组。 如果位置(K-1)处的排序温度为(x)，则允许每个温度最高为(x)的行星。 存储相应数量的冷温组。 
4. 对热点请求进行对称预处理。 第 (K) 个最高温度定义了上限阈值，因此允许温度至少为该值的每个行星。 存储相应数量的高温组。 
5. 将每个查询按照冷热温度组的有效数量放入桶中。 查询不需要立即处理，因为需要相同组计数的所有查询都使用相同的距离矩阵。 
6. 对于冷查询，按从最冷到最热的顺序处理温度组。 当到达一个组时，对该组中的每个行星运行一次 Floyd-Warshall 松弛。 在回答查询之前，有必要将所有行星添加到组中，因为相同的阈值都允许相同温度的行星。 
7. 激活整个组后，通过读取来回答该组存储桶中的每个冷查询`dist[A][B]`。 如果仍然无穷大，则存储`-1`。 
8. 将距离矩阵重新初始化为原始图，并处理从最热到最冷的温度组。 应用完全相同的 Floyd-Warshall 松弛，但改为回答热门查询桶。 
9. 最后，按照原始查询顺序打印存储的答案。 这两遍不需要作为距离矩阵共存，因此一次只保留一个（N×N）矩阵。 

### 为什么它有效

 激活特定数量的温度组后，Floyd-Warshall 不变量为`dist[i][j]`等于从（i）到（j）其内部行星属于激活组的最短路径。 当添加一个新的行星（v）时，内部使用（v）的每条路线都可以在（v）处分解，因此通过（v）的松弛考虑每条新的可能路线。 不使用 (v) 的路线保持不变。 将此应用于温度组中的每个行星，给出中间温度满足该阈值的精确最短路径。 由于只有在激活整个边界温度组后才会回答查询，因此所有绑定在阈值上的行星都可用。 端点永远不会从矩阵中移除，因此无论温度如何，它们仍然可用。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**15

def process_orientation(n, groups, buckets, dist, answers):
    rng = range(n)

    for level, vertices in enumerate(groups, 1):
        for k in vertices:
            dk = dist[k]

            for i in rng:
                di = dist[i]
                dik = di[k]

                if dik >= INF:
                    continue

                for j in rng:
                    cand = dik + dk[j]
                    if cand < di[j]:
                        di[j] = cand

        for qi, a, b in buckets[level]:
            d = dist[a][b]
            answers[qi] = -1 if d >= INF else d

def solve():
    n, r = map(int, input().split())
    temp = list(map(int, input().split()))

    edges = []
    for _ in range(r):
        x, y, d = map(int, input().split())
        x -= 1
        y -= 1
        edges.append((x, y, d))

    q = int(input())

    queries = []
    for qi in range(q):
        a, b, k, typ = map(int, input().split())
        queries.append((a - 1, b - 1, k, typ))

    sorted_temp = sorted(temp)

    unique_temp = []
    for x in sorted_temp:
        if not unique_temp or unique_temp[-1] != x:
            unique_temp.append(x)

    groups_asc = []
    current = []
    last_temp = None

    for v in sorted(range(n), key=lambda x: temp[x]):
        if last_temp is None or temp[v] == last_temp:
            current.append(v)
        else:
            groups_asc.append(current)
            current = [v]
        last_temp = temp[v]

    if current:
        groups_asc.append(current)

    groups_desc = list(reversed(groups_asc))
    group_count = len(groups_asc)

    # cold_level[k] = number of cold temperature groups allowed
    # by the K-th smallest temperature.
    cold_level = [0] * (n + 1)

    # hot_level[k] = number of hot temperature groups allowed
    # by the K-th largest temperature.
    hot_level = [0] * (n + 1)

    # Map each planet temperature to its group from the cold side.
    temp_to_cold_group = {}
    for idx, x in enumerate(unique_temp):
        temp_to_cold_group[x] = idx + 1

    # Map each planet temperature to its group from the hot side.
    temp_to_hot_group = {}
    for idx, x in enumerate(unique_temp):
        temp_to_hot_group[x] = group_count - idx

    for k in range(1, n + 1):
        cold_level[k] = temp_to_cold_group[sorted_temp[k - 1]]
        hot_level[k] = temp_to_hot_group[sorted_temp[n - k]]

    cold_buckets = [[] for _ in range(group_count + 1)]
    hot_buckets = [[] for _ in range(group_count + 1)]

    for qi, (a, b, k, typ) in enumerate(queries):
        if typ == 0:
            level = cold_level[k]
            cold_buckets[level].append((qi, a, b))
        else:
            level = hot_level[k]
            hot_buckets[level].append((qi, a, b))

    answers = [-1] * q

    def initial_dist():
        dist = [[INF] * n for _ in range(n)]

        for i in range(n):
            dist[i][i] = 0

        for x, y, d in edges:
            if d < dist[x][y]:
                dist[x][y] = d
                dist[y][x] = d

        return dist

    if any(cold_buckets):
        dist = initial_dist()
        process_orientation(
            n,
            groups_asc,
            cold_buckets,
            dist,
            answers
        )

    if any(hot_buckets):
        dist = initial_dist()
        process_orientation(
            n,
            groups_desc,
            hot_buckets,
            dist,
            answers
        )

    sys.stdout.write("\n".join(map(str, answers)))

if __name__ == "__main__":
    solve()
```实现的第一部分构造原始图矩阵。 因为每条路线长度均为正且 (N\le400)，所以 (10^{15}) 的无穷大值比每条可能的简单路线都大，其长度最多约为 (399\cdot1000)。 

温度预处理是微妙的部分。`unique_temp`包含每个不同的温度一次，而`groups_asc`包含属于每个温度的实际行星索引。 这两种结构有不同的用途。 唯一值告诉我们查询达到哪个阈值，而组告诉 Floyd-Warshall 在该阈值必须激活哪些顶点。 

数组`cold_level`和`hot_level`将原始查询参数（K）转换为组号。 对于冷查询，`sorted_temp[k - 1]`是第 (K) 个最小温度。 每个具有该温度的行星都必须被允许，所以`temp_to_cold_group`给出完整的群边界。 热计算使用`sorted_temp[n - k]`为第 (K) 个最大温度。 

此转换还可以正确处理重复项。 如果温度是`5, 10, 10, 20`和`K=2`，冷阈值为`10`，并且两颗行星都有温度`10`属于激活组。 如果所有温度都相等，即使`K=1`激活包含每个行星的单个温度组。 

查询桶可以从昂贵的部分中删除（Q）因素。 每个具有相同有效阈值的查询都可以从相同的距离矩阵状态得到回答，因此没有理由为其运行另一个最短路径计算。 

里面`process_orientation`，外循环遍历温度组。 当前组中的每个行星都成为合法的中间顶点，并应用标准的 Floyd-Warshall 松弛。 仅在添加组的每个顶点后才处理查询存储桶。 

源和目的地永远不会被过滤掉。 它们从一开始就保留在矩阵中，这直接处理了终点温度无关紧要的规则。 

该实现在第二个方向之前重建原始距离矩阵。 在冷扫描期间改变矩阵不能重复用于热扫描，因为这两个扫描具有不同的允许中间顶点集。 

Python 整数不会溢出，并且所选的无穷大远高于任何有效的路由长度。 存档竞赛有非常严格的 1 秒限制，因此 Python 版本应被视为目标算法的面向 PyPy 的实现，而不是保证匹配 C++ 提交的运行时。 算法本身是 (O(N^3))，这是 (N\le400) 的预期界限。 

## 工作示例

 ### 示例 1

 温度由高到低的顺序为：```
planet 5: -210
planet 2: -180
planet 1:  -53
planet 6:   15
planet 7:  150
planet 4:  420
planet 3:  456
```这里所有的温度都是不同的，因此每个温度组都包含一个行星。 

对于热扫描，组被处理为`3, 4, 7, 6, 1, 2, 5`。 

| 热门团体已激活 | 新推出的星球 | 查询受影响 | 距离 |
 | --- | --- | --- | --- |
 | 1 | 3 |`1 -> 2`, K=1 | 2 |
 | 2 | 4 |`1 -> 5`, K=2 | 11 | 11
 | 2 | 4 |`1 -> 7`, K=2 | 3 |

 第一个查询已经有从 1 到 2 的直接边，所以它的答案是 2。在行星 3 和 4 可用后，路线`1 -> 3 -> 4 -> 5`有长度`1 + 6 + 4 = 11`。 路线`1 -> 3 -> 7`有长度`1 + 2 = 3`。 

冷扫描从行星 5 开始，因此 (K=1) 从 5 到 6 的查询无法使用行星 4，这是通往行星 6 的唯一有用连接。它仍然无法访问。 

官方示例输出是`11, 2, -1, 3`。 

### 示例 2

 温度为：```
planet 1: 5
planet 2: 10
planet 3: 20
planet 4: 10
planet 5: 10
planet 6: 8
```有四个不同的温度组：```
{1}: 5
{6}: 8
{2,4,5}: 10
{3}: 20
```对于热点查询，处理顺序为：```
{3}, {2,4,5}, {6}, {1}
```| 热门团体已激活 | 允许温度值| 查询 | 距离 |
 | --- | --- | --- | --- |
 | 1 |`{20}`|`1 -> 6`, K=1 | -1 |
 | 2 |`{20, 10}`|`1 -> 6`, K=2 | 25 | 25
 | 1 |`{20}`|`2 -> 4`, K=1 | 10 | 10

 在第一组之后，只能使用行星3作为中间体，因此无法完成从1到6的链条。 在第二组之后，行星 2、4 和 5 都变得可用，因为它们共享温度 10。完整路径```
1 -> 2 -> 3 -> 4 -> 5 -> 6
```有长度`5 + 5 + 5 + 5 + 5 = 25`。 

对于（K=1）从4到5的冷查询，最冷温度是5，对应行星1。从4到5的直接边已经足够了，所以答案是5。 

最终的样本输出是`25, -1, 5, 10`。 

第二个示例特别有用，因为它捕获了最危险的解释错误。 精确选择 (K) 个行星索引将不允许所有三个行星都处于温度 10，而选择第 (K) 个温度作为阈值则允许。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(N^3 + Q)) | 两次温度扫描中的每一次最多执行 (N) 个 Floyd-Warshall 顶点插入，每次成本为 (O(N^2))，而每个查询都被存储并回答一次。 |
 | 空间| (O(N^2 + Q)) | 距离矩阵使用 (O(N^2))，查询桶加答案数组使用 (O(Q))。 |

 有两次 Floyd-Warshall 扫描，每个温度方向各一次，但常数因子 2 在渐近边界中消失。 对于 (N=400)，在最坏情况下，三次项受 (2\cdot400^3=128,000,000) 个基本矩阵松弛为界。 查询处理本身在 (Q) 中是线性的，因此即使是 100,000 个请求与矩阵计算相比也几乎没有增加。 

## 测试用例```python
import sys
import io

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

# Provided sample 1
sample1 = """\
7 9
-53 -180 456 420 -210 15 150
1 2 2
1 3 1
2 3 4
2 4 2
2 5 5
3 4 6
6 4 10
4 5 4
3 7 2
4
1 5 2 1
1 2 1 1
5 6 1 0
1 7 2 1
"""

assert run(sample1) == "11\n2\n-1\n3", "sample 1"

# Provided sample 2
sample2 = """\
6 5
5 10 20 10 10 8
1 2 5
2 3 5
3 4 5
4 5 5
5 6 5
4
1 6 2 1
1 6 1 1
4 5 1 0
2 4 1 1
"""

assert run(sample2) == "25\n-1\n5\n10", "sample 2"

# Minimum-size graph, direct edge, endpoints must remain unrestricted.
case_min = """\
2 1
-5 100
1 2 7
2
1 2 1 0
1 2 1 1
"""

assert run(case_min) == "7\n7", "minimum-size direct route"

# No edges, so even though the endpoints themselves may have any
# temperature, no route exists.
case_disconnected = """\
2 0
0 1
2
1 2 1 0
1 2 1 1
"""

assert run(case_disconnected) == "-1\n-1", "disconnected graph"

# Equal temperatures at the boundary must all be admitted.
case_equal_boundary = """\
4 3
1 2 2 3
1 2 1
2 3 1
3 4 1
2
1 4 2 0
1 4 2 1
"""

assert run(case_equal_boundary) == "3\n3", "equal-temperature boundary"

# All temperatures equal. K=1 already includes every planet.
case_all_equal = """\
4 3
10 10 10 10
1 2 2
2 3 3
3 4 4
2
1 4 1 0
1 4 1 1
"""

assert run(case_all_equal) == "9\n9", "all equal temperatures"

# Maximum-size N and Q, with no edges. This exercises the query limit
# without requiring a huge expected-output literal.
n = 400
q = 100000

parts = [
    f"{n} 0",
    " ".join(["0"] * n),
    str(q),
]

for i in range(q):
    a = (i % n) + 1
    b = ((i + 1) % n) + 1
    parts.append(f"{a} {b} 1 {i & 1}")

case_max = "\n".join(parts) + "\n"

expected_max = "-1\n" * q
assert run(case_max) == expected_max[:-1], "maximum N and Q"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 具有一条边的最小图 |`7`,`7`| 最小 (N)、直接路由、不受限制的端点 |
 | 两个孤立的行星|`-1`,`-1`| 无法到达的对和无限处理|
 | 具有两个相等边界温度的四颗行星 |`3`,`3`| 所有绑在门槛上的行星都必须被激活|
 | 四颗温度相同的行星 |`9`,`9`| 单个温度组可以包含每个行星 |
 | (N=400,\Q=100000)，无边缘 | 100,000 行`-1`| 最大查询数、最大顶点数、大输出处理 |

 ## 边缘情况

 ### 端点超出允许的温度范围

 考虑：```
2 1
0 100
1 2 7
1
1 2 1 0
```最冷温度为 0，因此只有行星 1 属于允许的中间集。 尽管如此，从 1 到 2 的路线仍然有效，因为行星 2 是目的地，而不是中间行星。 距离矩阵包含从一开始的直接边缘，因此算法的答案`7`在需要任何中间顶点之前。 

### 阈值温度相等

 考虑：```
4 3
1 2 2 3
1 2 1
2 3 1
3 4 1
1
1 4 2 0
```第二小的温度是 2。行星 2 和 3 都有该温度，因此在回答查询之前它们都会被激活。 弗洛伊德-沃歇尔发现`1 -> 2 -> 3 -> 4`距离为 3。如果实施仅针对第二个温度位置激活一颗行星，则会错误地报告目的地无法到达。 

### 所有行星都有相同的温度

 考虑：```
4 3
10 10 10 10
1 2 2
2 3 3
3 4 4
1
1 4 1 0
```第一个最冷温度是 10，每个行星都有这个温度。 整个温度组立即激活，因此路线`1 -> 2 -> 3 -> 4`是允许的，费用为 9。对于最热门的请求也是如此。 这就是为什么该算法适用于温度组而不是单个排序位置。 

### 不存在路线

 考虑：```
2 0
0 1
1
1 2 1 0
```距离矩阵开始于`dist[1][2] = INF`。 没有边缘，也没有可能的中间行星，因此弗洛伊德-沃歇尔松弛不能使这对行星可以到达。 查询看到无穷大并将其转换为`-1`。 

### 与禁止的中间行星的直接路线

 考虑：```
3 1
0 50 100
1 3 9
1
1 3 1 0
```唯一的边直接从源 1 到目的地 3。行星 2 不相关，因为它未被使用。 冷限制不会使直接路径无效，答案是 9。矩阵表示自然会处理这个问题，因为在激活任何温度组之前就存在直接边。 

### (K=N)

 当(K=N)时，第(K)个最小温度为最高温度，因此每个行星都属于允许冷集。 对称地，第 (K) 个最高温度是最低温度，因此每个行星都属于允许热集。 预处理将两种情况映射到所有温度组，给出普通的全对最短路径。 

### 在关系内具有重复温度和 (K) 的查询

 假设温度是`5, 10, 10, 10, 20`。 对于 (K=2)，第二小的温度为 10，而不是温度为 10 的三个行星中的特定一颗。因此，允许的低温为 5 和 10，这会在这些温度下激活所有四个行星。 这`cold_level`计算使用温度值本身，因此它会自动将阈值扩展到整个领带组。 

### 空边集

 当 (R=0) 时，每个非对角线距离都从无穷大开始。 Floyd-Warshall 循环仍然正确运行，但永远不会有一个有限对可以松弛。 查询结果返回`-1`除非查询可以具有 (A=B)，而输入明确禁止这样做。
