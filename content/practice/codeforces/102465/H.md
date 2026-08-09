---
title: "CF 102465H - 旅行指南"
description: "每个站都可以用三个数字来表示。 对于站点 (v)，令 [ D(v) = (d0(v), d1(v), d2(v)), ] 其中 (d0(v)) 是其到奥利的最短距离，(d1(v)) 是其到巴黎圣母院的最短距离，(d2(v)) 是其到迪士尼乐园的最短距离。"
date: "2026-08-08T09:22:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102465
codeforces_index: "H"
codeforces_contest_name: "2018-2019 ICPC Southwestern European Regional Programming Contest (SWERC 2018)"
rating: 0
weight: 102465
solve_time_s: 141
verified: true
draft: false
---

[CF 102465H - 旅行指南](https://codeforces.com/problemset/problem/102465/H)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 21s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个站都可以用三个数字来表示。 对于站点 (v)，令

 [
 D(v) = (d_0(v), d_1(v), d_2(v)),
 ]

 其中 (d_0(v)) 是到奥利的最短距离，(d_1(v)) 是到巴黎圣母院的最短距离，(d_2(v)) 是到迪士尼乐园的最短距离。 

当存在另一个站（B），其三个距离均不大于（A）的距离，并且三个距离中至少有一个严格小于（A）的距离时，站（A）是无用的。 就向量而言，当 (B) 支配 (A) 时

 [
 d_0(B) \le d_0(A),\qquad
 d_1(B) \le d_1(A),\qquad
 d_2(B) \le d_2(A),
 ]

 并且至少有一个不等式是严格的。 

该图最多具有 (100000) 个站和 (500000) 个边。 由于所有边权重均为正，因此可以使用 Dijkstra 算法计算距一个源的最短距离。 我们需要 3 次这样的运行，每个 POI 运行一次。 

真正的困难出现在已知最短路径之后。 我们在三维空间中最多有（100000）个点，需要计算不受另一个点支配的点。 

所有站对的二次比较已经太大了。 对于 (100000) 个站点，检查每个有序对意味着

 [
 100000 \cdot 99999 = 9,999,900,000
 ]

 候选人证人检查。 即使每次检查只是几个整数比较，这也远远超出了六秒的限制。 

正边权重还意味着普通 Dijkstra 无需对零权重边进行任何特殊处理即可适用。 多个站可以具有完全相同的距离三倍。 这些电台不会相互支配，因为支配至少需要一种严格的不平等。 独立处理相同三元组的解决方案可能会意外地将第二个副本标记为无用。 

例如，考虑到所有三个 POI 的距离相同的两个站点。```
5 6
0 3 1
1 3 1
2 3 1
0 4 1
1 4 1
2 4 1
```站 3 和站 4 都有矢量 ((1,1,1))。 三个 POI 具有向量 ((0,2,2))、((2,0,2)) 和 ((2,2,0))。 这些都不支配站 3 或站 4，并且站 3 和 4 不能相互支配，因为它们的矢量相等。 正确答案是 5。将相同的早期向量视为严格见证会错误地删除其中一个。 

当前两个坐标相等但第三个坐标不同时，会发生另一种微妙的情况。```
5 6
0 3 1
1 3 1
2 3 2
0 4 1
1 4 1
2 4 3
```站 3 有向量 ((1,1,2))，而站 4 有向量 ((1,1,3))。 3 号车站优于 4 号车站，因为它同样靠近奥利机场和巴黎圣母院，而且距离迪士尼乐园更近。 正确答案是 4。仅考虑第二个坐标的严格较小值的数据结构将错过这种情况。 

最后，允许的最小图表有四个站点，即三个 POI 和一个附加站点。 例如，```
4 3
0 3 1
1 3 1
2 3 1
```这四个向量是 ((0,2,2))、((2,0,2))、((2,2,0)) 和 ((1,1,1))。 没有人能支配另一个人，所以答案是 4。 

## 方法

 直接方法首先使用 Dijkstra 计算三个距离数组。 一旦每个站点都有其向量 ((d_0,d_1,d_2))，我们就可以简单地比较每对站点。 对于每个站点（A），扫描每隔一个站点（B）并检查（B）的所有三个坐标是否不大于（A）的坐标，并且至少存在一个严格不等式。 

这是正确的，因为它从字面上检查了无用的定义。 问题在于比较的次数。 当(N=100000)时，可以有(N(N-1))，或(9,999,900,000)个被命令的候选证人。 图处理远没有这么昂贵，因此成对优势检查是必须替换的部分。 

关键的观察是第一个坐标可以通过排序来处理。 按 ((d_0,d_1,d_2)) 字典顺序对所有距离向量进行排序。 当处理向量 (v=(x,y,z)) 时，每个先前处理的向量 (u) 都满足 (u_x\le x)。 如果 (u_x<x)，第一个坐标已经给出了所需的严格不等式。 如果(u_x=x)，字典顺序保证(u_y\le y)。 如果 (u_y<y)，则第二个坐标给出严格的不等式。 如果 (u_y=y)，则因为相同的向量被分组在一起，所以较早的不同向量必须具有 (u_z<z)。 

那么排序之后，剩下的问题就只是二维的了。 对于当前向量 ((x,y,z))，我们需要知道某个较早的向量是否具有

 [
 u_y\le y
 ]

 和

 [
 u_z\le z。 
]

 这可以减少到前缀最小查询。 在先前处理的所有第二坐标至多为(y)的向量中，保留最小的第三坐标。 如果该最小值至多为 (z)，则这样的向量将主导当前向量。 

芬威克树可以准确地维护此信息。 它存储的值不是总和或计数，而是在每个压缩的第二坐标处看到的最小第三坐标。 前缀查询返回所有处理点中最小的第三坐标，第二坐标最多为请求值。 

还有一个由重复向量引起的细节。 我们对向量进行排序，并将相等的三元组作为一组进行处理。 我们在插入组之前查询芬威克树，因此永远不会认为向量支配另一个相同的副本。 如果该矢量不受先前的不同矢量支配，则具有相同矢量的每个站点都是有用的。 

蛮力方法之所以有效，是因为很容易在两个向量之间测试优势，但当对太多时，它会失败。 排序从搜索中删除一个维度，芬威克树以对数时间处理剩余的两个维度。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O((N+E)\log N + N^2)) | (O(N+E)) | 太慢了 |
 | 最佳| (O((N+E)\log N)) | (O(N+E)) | 已接受 |

 ## 算法演练

1. 根据输入构建无向图。 对于每条边，存储两个方向，因为可以在任一方向上行进。 
2. 从站点 0、1 和 2 开始运行 Dijkstra 三次。这给出了三个距离数组，因此每个站点现在可以表示为 ((d_0,d_1,d_2))。 三次 Dijkstra 运行只会将运行时间乘以一个常数。 
3. 创建距离三元组列表，并按字典顺序对其进行排序：(d_0)、(d_1)、(d_2)。 这种排序保证了当前向量的每个潜在支配者都出现在它之前。 
4. 坐标压缩所有不同的 (d_1) 值。 芬威克树将使用 (d_1) 的压缩位置，每个树单元存储对该单元有贡献的已处理向量中的最小值 (d_2)。 
5. 将相等的三元组作为一个组进行处理。 在将组插入 Fenwick 树之前，查询以 (d_1) 结尾的前缀。 如果返回的最小值 (d_2) 至多是该组的 (d_2)，则较早的不同向量在该三元组中占主导地位，因此该组中的所有站点都是无用的。 否则，组中的所有站点都是有用的，并且它们的重数将添加到答案中。 
6. 将组的 (d_2) 插入到 Fenwick 树的压缩 (d_1) 位置。 更新存储最小值，因为将来的查询只关心某个合适的向量是否具有足够小的第三坐标。 

### 为什么它有效

 经过字典序排序后，每个先前处理的向量的第一个坐标不大于当前向量。 如果先前的向量具有较小的第一坐标，则它已经提供了严格的改进。 如果第一个坐标相等，则按字典顺序给出不大于当前坐标的第二个坐标。 较小的第二坐标给出了严格的改进，并且如果第二坐标也相等，则在增加第三坐标中处理不同的三元组保证了较小的第三坐标。 因此，对于一个不同的早期向量，唯一剩余的支配条件是 (u_y\le y) 和 (u_z\le z)。 

Fenwick 前缀最小值准确地告诉我们这样的先前向量是否存在。 因此，当且仅当存在有效的主站时，当前三元组被标记为无用。 相等的三元组一起处理，因此所有三个坐标中的相等永远不会被误认为严格支配。 

## Python 解决方案```python
import sys
import heapq
from bisect import bisect_left
from array import array

input = sys.stdin.readline

INF = 10**18

def dijkstra(src, head, to, weight, nxt, n):
    dist = [INF] * n
    dist[src] = 0

    pq = [(0, src)]
    heappush = heapq.heappush
    heappop = heapq.heappop

    while pq:
        d, u = heappop(pq)

        if d != dist[u]:
            continue

        e = head[u]
        while e != -1:
            v = to[e]
            nd = d + weight[e]

            if nd < dist[v]:
                dist[v] = nd
                heappush(pq, (nd, v))

            e = nxt[e]

    return dist

def solve():
    n, m = map(int, input().split())

    # Forward-star representation.
    # Using compact integer arrays keeps the memory usage low for
    # up to 500000 undirected edges.
    head = array('i', [-1]) * n
    to = array('i')
    weight = array('i')
    nxt = array('i')

    for _ in range(m):
        a, b, w = map(int, input().split())

        idx = len(to)
        to.append(b)
        weight.append(w)
        nxt.append(head[a])
        head[a] = idx

        idx = len(to)
        to.append(a)
        weight.append(w)
        nxt.append(head[b])
        head[b] = idx

    d0 = dijkstra(0, head, to, weight, nxt, n)
    d1 = dijkstra(1, head, to, weight, nxt, n)
    d2 = dijkstra(2, head, to, weight, nxt, n)

    points = list(zip(d0, d1, d2))
    points.sort()

    # Coordinate compression for the second coordinate.
    ys = sorted({p[1] for p in points})
    k = len(ys)

    # Fenwick tree for prefix minimum of the third coordinate.
    bit = [INF] * (k + 1)

    answer = 0
    i = 0

    while i < n:
        x, y, z = points[i]

        # Find the complete group of identical triples.
        j = i + 1
        while j < n and points[j] == points[i]:
            j += 1

        pos = bisect_left(ys, y) + 1

        # Query minimum z among all previous points with y <= current y.
        p = pos
        best = INF

        while p > 0:
            if bit[p] < best:
                best = bit[p]
            p -= p & -p

        # If no previous point has z <= current z, this triple is useful.
        if best > z:
            answer += j - i

        # Insert this unique triple into the Fenwick tree.
        p = pos
        while p <= k:
            if z < bit[p]:
                bit[p] = z
            p += p & -p

        i = j

    sys.stdout.write(str(answer) + '\n')

if __name__ == "__main__":
    solve()
```该图使用前向星形表示来存储，而不是每个邻接条目的元组的 Python 列表。 对于 (500000) 个无向边，有 (1000000) 个有向邻接条目，因此将端点、权重和下一个指针存储在紧凑整数数组中可以节省大量内存。 

这三个电话`dijkstra`直接对应三个POI。 优先级队列存储当前距离和车站对。 这`d != dist[u]`check 会丢弃当站点在较旧的条目已被推送后收到更好的距离时创建的陈旧堆条目。 

三元组直接排序，因此 Python 的元组排序准确地给出了所需的字典顺序。 循环从`i`到`j`识别所有相同的三元组。 查询发生在更新之前，这很重要，因为相同的向量不能相互支配。 

Fenwick 树的索引从 1 而不是 0 开始。`pos`因此是`bisect_left(ys, y) + 1`。 查询向零移动`p -= p & -p`，而更新向上移动`p += p & -p`。 该树存储最小值，因此每次更新都使用`min`而不是加法。 

最大可能的最短距离最多为 ((N-1)\cdot100)，低于 (10^7)。 Python 整数不存在溢出问题，并且`INF`值比所有可能的距离都大。 

## 工作示例

 ### 示例 1

 该图是一个以站点 3 为中心的星形，站点 4 连接到该中心。 距离三倍是

 | 车站| (d_0) | (d_1) | (d_1) | (d_2) | 排序位置 |
 | ---| ---| ---| ---| ---|
 | 0 | 0 | 2 | 2 | 1 |
 | 3 | 1 | 1 | 1 | 2 |
 | 2 | 2 | 2 | 0 | 3 |
 | 1 | 2 | 0 | 2 | 4 |
 | 4 | 2 | 2 | 2 | 5 |

 实际的字典顺序是 ((0,2,2)), ((1,1,1)), ((2,0,2)), ((2,2,0)), ((2,2,2))。 

| 当前矢量| 前缀最小值 (d_2) | 占主导地位？ | 回答 |
 | ---| ---| ---| ---|
 | ((0,2,2)) | 信息 | 没有 | 1 |
 | ((1,1,1)) | ((1,1,1)) | 信息 | 没有 | 2 |
 | ((2,0,2)) | ((2,0,2)) | 信息 | 没有 | 3 |
 | ((2,2,0)) | ((2,2,0)) | 0 | 是的 | 3 |
 | ((2,2,2)) | ((2,2,2)) | 0 | 是的 | 3 |

 该表显示了一个值得强调的小修正：实际排序顺序中的站点向量将站点 1 放在站点 2 之前，因为它们的第一个坐标相等且 (0<2)。 最终答案仍然是 4，因为站 0、站 1、站 2 和站 3 都有用。 因此，正确的轨迹是：

 | 当前矢量| 前缀最小值 (d_2) | 占主导地位？ | 回答 |
 | ---| ---| ---| ---|
 | ((0,2,2)) | 信息 | 没有 | 1 |
 | ((1,1,1)) | ((1,1,1)) | 信息 | 没有 | 2 |
 | ((2,0,2)) | ((2,0,2)) | 信息 | 没有 | 3 |
 | ((2,2,0)) | ((2,2,0)) | 0 | 不，因为 (0\le0) 在第三个坐标中是相等的，但只有在其更新后见证人才是站 2 本身 | 4 |
 | ((2,2,2)) | ((2,2,2)) | 0 | 是的 | 4 |

 第四行中的区别正是查询必须在插入当前点之前发生的原因。 此时前缀最小值不包括当前向量。 站 2 不受其自身支配，并且没有更早的向量具有 (d_2\le0)。 4号站后来被2号站统治。答案是4。 

### 示例 2

 从站 0 到站 1 和 2 的附加边将距离三倍更改为

 | 车站| 距离三倍|
 | ---| ---|
 | 0 | ((0,1,1)) |
 | 1 | ((1,0,2)) | ((1,0,2)) |
 | 2 | ((1,2,0)) | ((1,2,0)) |
 | 3 | ((1,2,2)) | ((1,2,2)) |
 | 4 | ((2,3,3)) |

 字典序排序后，处理顺序为0、1、2、3、4。 

| 当前矢量| 前缀最小值 (d_2) | 占主导地位？ | 回答 |
 | ---| ---| ---| ---|
 | ((0,1,1)) | 信息 | 没有 | 1 |
 | ((1,0,2)) | ((1,0,2)) | 信息 | 没有 | 2 |
 | ((1,2,0)) | ((1,2,0)) | 1 | 没有 | 3 |
 | ((1,2,2)) | ((1,2,2)) | 0 | 是的 | 3 |
 | ((2,3,3)) | 0 | 是的 | 3 |

 站点 3 由站点 2 控制，站点 2 具有相同的第一和第二坐标，但第三坐标较小。 4号站也受2号站支配。 这三个 POI 仍然有用，因为每个 POI 与其自身的距离为零。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O((N+E)\log N)) | 三个 Dijkstra 运行需要 (O((N+E)\log N))，排序需要 (O(N\log N))，所有 Fenwick 操作需要 (O(N\log N))。 |
 | 空间| (O(N+E)) | 该图使用 (O(N+E)) 内存，而三个距离数组、排序三元组和 Fenwick 树使用 (O(N))。 |

 对于 (N\le100000) 和 (E\le500000)，图形主导输入大小。 三个基于堆的最短路径计算是实用的，并且支配阶段仅添加另一个 (O(N\log N)) 操作。 紧凑的邻接阵列还使内存占用量远低于 256 MB 的限制。 

## 测试用例

 以下测试工具包含两个官方样本、一个最小尺寸图、一个具有相同有用向量的情况、一个前两个坐标相等但第三个给出严格支配的情况，以及一个最大 (N) 链。```python
import io
import heapq
from bisect import bisect_left
from array import array

INF = 10**18

def solve_text(inp: str) -> str:
    reader = io.StringIO(inp).readline
    n, m = map(int, reader().split())

    head = array('i', [-1]) * n
    to = array('i')
    weight = array('i')
    nxt = array('i')

    for _ in range(m):
        a, b, w = map(int, reader().split())

        idx = len(to)
        to.append(b)
        weight.append(w)
        nxt.append(head[a])
        head[a] = idx

        idx = len(to)
        to.append(a)
        weight.append(w)
        nxt.append(head[b])
        head[b] = idx

    def dijkstra(src):
        dist = [INF] * n
        dist[src] = 0
        pq = [(0, src)]

        while pq:
            d, u = heapq.heappop(pq)
            if d != dist[u]:
                continue

            e = head[u]
            while e != -1:
                v = to[e]
                nd = d + weight[e]

                if nd < dist[v]:
                    dist[v] = nd
                    heapq.heappush(pq, (nd, v))

                e = nxt[e]

        return dist

    d0 = dijkstra(0)
    d1 = dijkstra(1)
    d2 = dijkstra(2)

    points = list(zip(d0, d1, d2))
    points.sort()

    ys = sorted({p[1] for p in points})
    k = len(ys)
    bit = [INF] * (k + 1)

    answer = 0
    i = 0

    while i < n:
        x, y, z = points[i]

        j = i + 1
        while j < n and points[j] == points[i]:
            j += 1

        pos = bisect_left(ys, y) + 1

        p = pos
        best = INF
        while p:
            if bit[p] < best:
                best = bit[p]
            p -= p & -p

        if best > z:
            answer += j - i

        p = pos
        while p <= k:
            if z < bit[p]:
                bit[p] = z
            p += p & -p

        i = j

    return str(answer)

def run(inp: str) -> str:
    return solve_text(inp)

sample1 = """\
5 4
0 3 1
1 3 1
2 3 1
4 3 1
"""

sample2 = """\
5 6
0 3 1
1 3 1
2 3 1
4 3 1
0 1 1
0 2 1
"""

assert run(sample1) == "4", "sample 1"
assert run(sample2) == "3", "sample 2"

minimum_case = """\
4 3
0 3 1
1 3 1
2 3 1
"""

assert run(minimum_case) == "4", "minimum-size graph"

duplicate_case = """\
5 6
0 3 1
1 3 1
2 3 1
0 4 1
1 4 1
2 4 1
"""

assert run(duplicate_case) == "5", "identical useful distance vectors"

equal_prefix_case = """\
5 6
0 3 1
1 3 1
2 3 2
0 4 1
1 4 1
2 4 3
"""

assert run(equal_prefix_case) == "4", "equal first two coordinates"

# Maximum N. The graph is a chain:
# 0 - 1 - 2 - 3 - ... - 99999
#
# Station 2 dominates every station after it.
n = 100000
edges = "\n".join(f"{i} {i + 1} 1" for i in range(n - 1))
maximum_n_case = f"{n} {n - 1}\n{edges}\n"

assert run(maximum_n_case) == "3", "maximum-N chain"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品1 | 4 | 一个电台的基本统治地位比另一个电台差得多 |
 | 样品2 | 3 | 相同的第一坐标和多个控制站 |
 | 最小尺寸的星星 | 4 | 最小的合法（N），每个站都有用 |
 | 两个相同的 POI 相邻站 | 5 | 等距三元组不能互相支配|
 | 前两个坐标相等 | 4 | 前两场打平时，第三场坐标严格改进|
 | 10万节点链 | 3 | 最大 (N) 和长最短路径距离 |

 ## 边缘情况

 重复向量的情况是通过在更新 Fenwick 树之前对相等的三元组进行分组来处理的。 在输入中```
5 6
0 3 1
1 3 1
2 3 1
0 4 1
1 4 1
2 4 1
```站 3 和 4 都有矢量 ((1,1,1))。 当查询该组时，两个副本都尚未插入，因此芬威克树仅包含来自其他站的向量。 该组被正确分类为有用的，并且立即添加其重数两个。 

等前缀情况是通过通过当前 (d_1) 位置而不是严格在其之前查询 Fenwick 树来处理的。 为了```
5 6
0 3 1
1 3 1
2 3 2
0 4 1
1 4 1
2 4 3
```站 3 有 ((1,1,2))，站 4 有 ((1,1,3))。 当处理站4时，前缀查询包含站3的(d_1=1)条目并返回(2)。 从 (2\le3) 开始，站 4 被正确标记为无用。 

最小尺寸的情况```
4 3
0 3 1
1 3 1
2 3 1
```正好包含四个站。 三个 POI 之间的距离为零，而站点 3 的向量为 ((1,1,1))。 每个站点至少有一个坐标无法与另一个站点匹配而不会使另一个坐标变得更糟，因此所有四个坐标都被计算在内。 

最大 (N) 链包含 (100000) 个站。 对于每个站点 (v\ge2)，其向量为

 [
 (v,v-1,v-2)。 
]

 站 2 具有向量 ((2,1,0))，该向量支配每个站 (v>2)。 站 0、1 和 2 无法被控制，因为每个站都是 POI 并且与自身的距离为零。 因此，该算法在处理允许的最大站数时返回 3。
