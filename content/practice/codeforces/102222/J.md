---
title: "CF 102222J - 嵌套三角形"
description: "我们有两个固定枢轴（P）和（Q），以及（n）个其他点（A1，ldots，An）。 其他点都不在线 (PQ) 上。 我们需要一系列索引 (v1,v2,ldots,vk)，使得每个点 (A{v{i+1}}) 严格位于由 (P,Q,A{vi}) 形成的三角形内。"
date: "2026-08-19T00:31:29+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102222
codeforces_index: "J"
codeforces_contest_name: "2018-2019 ACM-ICPC, China Multi-Provincial Collegiate Programming Contest"
rating: 0
weight: 102222
solve_time_s: 227
verified: true
draft: false
---

[CF 102222J - 嵌套三角形](https://codeforces.com/problemset/problem/102222/J)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 47s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个固定枢轴，(P) 和 (Q)，以及 (n) 个其他点 (A_1,\ldots,A_n)。 其他点都不在线 (PQ) 上。 我们需要一系列索引 (v_1,v_2,\ldots,v_k)，使得每个点 (A_{v_{i+1}}) 严格位于由 (P,Q,A_{v_i}) 形成的三角形内。 

第一个目标是最大化 (k)。 在该最大长度的所有序列中，所需的答案是原始索引的字典顺序最小的序列。 官方样本包含三个案例，答案长度为(6)、(3)和(1)。 

对于单个大型案例，约束 (n\le 10^5) 已经排除了任何接近二次方时间的情况。 检查每对点的成本约为 (n(n-1)/2)，当 (n=10^5) 时，大约为 (5\cdot10^9) 对点检查。 所有测试用例的总点数为 (10^6)，因此即使是 (O(n\log^2 n)) 解决方案也必须使用相当小的常数来实现。 坐标可以达到（10^9），所以几何比较必须精确，而不是基于浮点角度。 

有两种特别简单的方法会导致错误答案。 首先，(PQ)同侧的点必须独立处理。 例如，```
1
0 0 10 0
2
5 1
5 -1
```答案长度为 (1)，而不是 (2)。 第二个点位于 (PQ) 的对边，因此它不能位于第三个顶点为第一个点的三角形内部。 

其次，角度方向上的相等表示三角形边上的点，这是不允许的。 例如，```
1
0 0 10 0
3
1 1
2 2
3 3
```有答案```
Case #1: 1
1
```所有三个点都位于 (P) 的同一条射线上。 粗心的非严格 LIS 会将它们视为一条链，即使后面的每个点都位于由前面的点确定的三角形的边界上。 

第三个极端情况是线 (PQ) 不需要是水平的。 例如，```
1
0 0 0 10
4
1 5
2 5
-1 5
-2 5
```具有最大长度 (2)。 右侧链为(2,1)，左侧链为(4,3)，因此字典序较小的最大解为```
Case #1: 2
2
1
```任何基于普通斜率（例如 (y/x)）的解决方案都需要对垂直方向进行特殊处理。 使用叉积可以避免整类问题。 

## 方法

 直接动态规划方法考虑 (PQ) 同一侧的每个有序点对。 对于每个可能的外部点 (A_i)，我们检查每个可能的内部点 (A_j)，测试 (A_j) 是否严格位于三角形 (PQA_i) 内部，并将所得关系用作 DP 转换。 这是正确的，因为一旦几何坐标转换为合适的等级，嵌套关系就会形成有向非循环排序。 问题在于配对检查的数量。 对于 (n=10^5)，在考虑几何谓词的成本之前， (\frac{n(n-1)}2) 个可能的对已经给出了大约 (5\cdot10^9) 个测试。 

有用的观察是，可以仅使用从两个枢轴看到的点的方向来描述三角形包含。 假设 (A) 严格位于三角形 (PQB) 内。 那么(A)和(B)一定在(PQ)的同一侧。 从 (P) 出发，射线 (PA) 严格位于 (PQ) 和 (PB) 之间。 从 (Q) 出发，射线 (QA) 严格位于 (QP) 和 (QB) 之间。 

这将几何图形转化为两个严格的顺序关系。 对于每个点，我们在 (P) 周围分配一个角度等级（从射线 (PQ) 测量），并在 (Q) 周围分配另一个角度等级（从 (QP) 测量）。 在 (PQ) 的一侧内，当两个点的秩都较小时，一个点可以恰好嵌套在另一个点内。 

可以在没有角度或浮点的情况下计算排名。 给定两个向量 (u) 和 (v)，(u\times v) 的符号表明哪个向量在半平面内按角度顺序排在第一位。 同一射线上的点的叉积为零并具有相同的等级，正确表示不能参与严格嵌套的边界情况。 

获得两个秩后，每一边就变成了一个二维严格递增子序列问题。 按第一等级排序并在第二等级上使用 Fenwick 树给出 (O(n\log n)) 中的最长链。 

字典顺序要求自然地适合相同的 DP 结果。 令 (f[i]) 为秩空间中以 (i) 点结束的最长递增链的长度。 每个 (f[i]=L) 的点都可以是最佳答案的第一个、最外面的点。 在与已选择的外部点兼容的所有此类点中，我们只需选择最小的原始索引。 我们处理 (f=L,L-1,\ldots,1)，因此在重建过程中每个点都被检查一次。 

(PQ) 的两条边是独立求解的，因为没有三角形可以包含来自对边的点。 我们取较长的结果，如果长度相等，则第一个索引较小的序列按字典顺序较小。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^2)) 配对检查 | (O(n)) | (O(n)) | 太慢了 |
 | 最佳| (O(n\log n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

1. 计算每个 (A_i) 相对于有向线 (PQ) 的方向。 ((Q-P)\times(A_i-P)) 的符号标识两个开半平面。 由于 (PQ) 上没有点，因此不存在零情况。 
2. 对 (P) 周围的点进行排序，分别按距射线 (PQ) 的角距离对两侧进行排序。 对于一侧，叉积比较是顺时针方向，而对于另一侧，叉积比较是逆时针方向。 相同的光线被组合在一起并获得相同的第一等级。 
3. 对 (Q) 周围的相同点进行排序，这次测量距 (QP) 的角距离。 同样，相同的光线获得相同的第二等级。 
4. 一次只做一侧。 通过增加第一等级来排序其点，当第一等级相等时，通过减少第二等级来排序。 递减的并列顺序可防止具有相同第一等级的两个点形成子序列转换。 它们位于来自 (P) 的同一条射线上，因此这样的过渡将表示边界点而不是严格的内部点。 
5. 按顺序扫描点并维护一棵位置为第二等级的 Fenwick 树。 对于点(i)，查询所有严格小于其自身的第二个等级。 如果最大值为(x)，则设置(f[i]=x+1)。 然后用 (f[i]) 更新该点第二级的 Fenwick 树。 
6. 最大值(f[i])是这一边的最大嵌套深度。 根据其 DP 值将每个点存储在桶中。 这些桶将用于重建字典顺序最小的答案。 
7. 从最大DP值开始向下，选择两个等级严格小于先前选择点的等​​级的最小原始索引。 对于第一个位置，没有先前的点，因此选择具有最大 DP 值的所有点中最小的索引。 
8. 对(PQ) 的另一侧重复计算。 首先比较两个结果序列的长度，当它们的长度相等时，比较它们的第一个索引。 

原理：对于 (PQ) 同一侧的两个点，当射线 (PA) 严格位于 (PQ) 和 (PB) 之间，并且射线 (QA) 严格位于 (QP) 和 (QB) 之间时，点 (A) 严格位于三角形 (PQB) 内部。 这两个严格的角度条件正是两个秩不等式。 因此，当从内部到外部读取时，每个有效的嵌套序列都对应于严格递增的秩对序列。 芬威克树计算最长的此类序列。 在重建过程中，具有 DP 值 (d) 的点始终具有 (d-1) 个前驱链，因此在每个级别选择最小的有效原始索引可以保留最大可能的剩余长度，同时最小化最早的不同索引。 这正是字典最小化。 

## Python 解决方案```python
import sys
from functools import cmp_to_key

input = sys.stdin.readline

class FenwickMax:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def update(self, i, value):
        n = self.n
        bit = self.bit
        while i <= n:
            if value > bit[i]:
                bit[i] = value
            i += i & -i

    def query(self, i):
        bit = self.bit
        ans = 0
        while i > 0:
            if bit[i] > ans:
                ans = bit[i]
            i -= i & -i
        return ans

def cross(ax, ay, bx, by):
    return ax * by - ay * bx

def solve_side(points, pivot_p, pivot_q, side):
    if not points:
        return []

    px, py = pivot_p
    qx, qy = pivot_q

    # The points are already assigned to one side.
    # Rank 1: angular order around P, starting from P->Q.
    def cmp_p(a, b):
        ax = a[0] - px
        ay = a[1] - py
        bx = b[0] - px
        by = b[1] - py
        c = ax * by - ay * bx

        if c == 0:
            return 0

        # side == 0 means cross(PQ, PA) < 0.
        # side == 1 means cross(PQ, PA) > 0.
        if side == 0:
            return -1 if c < 0 else 1
        return -1 if c > 0 else 1

    points.sort(key=cmp_to_key(cmp_p))

    rank = 0
    first = None

    for p in points:
        if first is None:
            rank = 1
            first = p
            p[4] = rank
            continue

        ax = first[0] - px
        ay = first[1] - py
        bx = p[0] - px
        by = p[1] - py

        if ax * by - ay * bx != 0:
            rank += 1
            first = p

        p[4] = rank

    # Rank 2: angular order around Q, starting from Q->P.
    def cmp_q(a, b):
        ax = a[0] - qx
        ay = a[1] - qy
        bx = b[0] - qx
        by = b[1] - qy
        c = ax * by - ay * bx

        if c == 0:
            return 0

        if side == 0:
            return -1 if c > 0 else 1
        return -1 if c < 0 else 1

    points.sort(key=cmp_to_key(cmp_q))

    rank = 0
    first = None

    for p in points:
        if first is None:
            rank = 1
            first = p
            p[5] = rank
            continue

        ax = first[0] - qx
        ay = first[1] - qy
        bx = p[0] - qx
        by = p[1] - qy

        if ax * by - ay * bx != 0:
            rank += 1
            first = p

        p[5] = rank

    # Strictly increasing rank pairs.
    # For equal rank1, decreasing rank2 prevents equal-rank1 transitions.
    points.sort(key=lambda p: (p[4], -p[5]))

    max_rank2 = rank
    bit = FenwickMax(max_rank2)

    groups = [[]]
    maximum = 0

    for p in points:
        f = bit.query(p[5] - 1) + 1
        p[6] = f

        if f > maximum:
            maximum = f
            groups.extend([[] for _ in range(f - len(groups) + 1)])

        groups[f].append(p)
        bit.update(p[5], f)

    # Reconstruct the lexicographically smallest chain.
    answer = []
    current = None

    for length in range(maximum, 0, -1):
        best = None

        if current is None:
            for p in groups[length]:
                if best is None or p[2] < best[2]:
                    best = p
        else:
            r1 = current[4]
            r2 = current[5]

            for p in groups[length]:
                if p[4] < r1 and p[5] < r2:
                    if best is None or p[2] < best[2]:
                        best = p

        current = best
        answer.append(current[2])

    return answer

def solve():
    t = int(input())
    output = []

    for case_id in range(1, t + 1):
        xP, yP, xQ, yQ = map(int, input().split())
        n = int(input())

        P = (xP, yP)
        Q = (xQ, yQ)

        dx = xQ - xP
        dy = yQ - yP

        right = []
        left = []

        for idx in range(1, n + 1):
            x, y = map(int, input().split())
            c = dx * (y - yP) - dy * (x - xP)

            # p = [x, y, original_id, side, rank1, rank2, dp]
            point = [x, y, idx, 0, 0, 0, 0]

            if c < 0:
                point[3] = 0
                right.append(point)
            else:
                point[3] = 1
                left.append(point)

        ans_right = solve_side(right, P, Q, 0)
        ans_left = solve_side(left, P, Q, 1)

        if len(ans_right) > len(ans_left):
            answer = ans_right
        elif len(ans_left) > len(ans_right):
            answer = ans_left
        else:
            if ans_right[0] < ans_left[0]:
                answer = ans_right
            else:
                answer = ans_left

        output.append(f"Case #{case_id}: {len(answer)}")
        output.extend(map(str, answer))

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    solve()
```输入循环首先计算每个点相对于 (PQ) 的方向。 该符号就足够了，因为该语句保证没有点完全位于枢轴线上。 

每个点都存储其坐标、原始索引、边、两个角度等级及其 DP 值。 Python 整数具有任意精度，因此即使坐标可以达到 (10^9)，叉积仍保持精确。 

第一个自定义比较器围绕 (P) 排列光线，而第二个自定义比较器围绕 (Q) 排列光线。 比较器故意使用叉积而不是`atan2`。 浮点角度可以区分大多数方向，但不能保证差异小于机器精度的有理方向的正确排序。 

等级分配将每个点与其当前等射线组的第一个点进行比较。 零交叉积意味着两个向量在相关的开半平面内具有相同的方向。 它们获得相同的等级，因为它们无法形成严格的嵌套过渡。 

Fenwick 树仅包含最大 DP 值。`query(r2 - 1)`在第二等级中强制执行严格的不平等。 相等的一阶组内的二阶递减顺序可以处理其他严格的不等式，而不需要单独的组处理过程。 

重建有意从最大 DP 值降至 1。 DP值为(L)的点是最外面的点，而DP值为(L-1)的点位于最里面。 在所有几何兼容的候选者中选择最小的原始索引给出了可能的最小下一个索引，同时保持剩余链长度不变。 

使用浮点不执行减法或乘法，Python 的任意精度整数消除了溢出问题，否则在低级语言中需要小心。 

## 工作示例

 第一个样本特别有用，因为所有六个点都位于 (PQ) 的同一侧，并且它们形成一个完整的链。 官方输出为(6,5,4,3,2,1)。 

| 点| 第一名| 第二名| DP | 重建|
 | --- | --- | --- | --- | --- |
 | (A_1=(5,1)) | (A_1=(5,1)) | 1 | 1 | 1 | 最后选择|
 | (A_2=(5,2)) | 2 | 2 | 2 | 入选第五名|
 | (A_3=(5,3)) | 3 | 3 | 3 | 入选第四名|
 | (A_4=(6,4)) | 4 | 4 | 4 | 入选第三名|
 | (A_5=(6,5)) | (A_5=(6,5)) | 5 | 5 | 5 | 选择第二个 |
 | (A_6=(6,6)) | 6 | 6 | 6 | 首先选择 |

 每个点的 Fenwick 查询都会看到每个较早的第二排名，因此 DP 值变为 (1,2,3,4,5,6)。 重建从DP(6)开始，选择点(6)，然后选择点(5)，并继续向下到点(1)。 结果正是所需的从外到内的顺序。 

对于第二个样本，主元为 (P=(6,6)) 和 (Q=(0,0))，最大链为 (1,3,2)。 三个选定点位于枢轴线的同一侧。 DP 找到一条长度为 (3) 的链，而其他点要么属于对方，要么不满足两个严格的秩不等式之一。 

| 重建阶段| 所需DP | 选择索引 | 原因 |
 | --- | --- | --- | --- |
 | 第一点| 3 | 1 | 能够启动长度为 3 的链的最小点 |
 | 第二点| 2 | 3 | 与剩余长度的最小兼容点|
 | 第三点| 1 | 2 | 兼容点补全链条|

 第二个例子说明了为什么字典最小化不能简单地选择全局最小的索引。 点(1)是最好的第一选择，但固定后，下一个选择必须满足几何嵌套关系以及剩余的DP要求。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\log n)) | 两种精确角度排序、排序处理、Fenwick DP 和线性重建 |
 | 空间| (O(n)) | (O(n)) | 点存储、Fenwick 树和 DP 存储桶 |

 最大的情况包含 (10^5) 个点，所有情况的总和为 (10^6)。 该算法在排序和 Fenwick 阶段对每个点执行对数数量的操作，而所有重建和排名分配过程都是线性的。 内存使用量与当前测试用例中的点数成线性关系。 

## 测试用例```python
# This test block assumes the solve() function from the solution above
# has already been defined.

import sys
import io

def run(inp: str) -> str:
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

# Official samples.
sample = """\
3
0 0 10 0
6
5 1
5 2
5 3
6 4
6 5
6 6
6 6
0 0
9
1 6
2 3
4 7
6 8
8 2
9 3
7 6
2 4
2 7
0 10 10 0
9
0 0
0 2
2 0
0 4
4 0
0 6
6 0
0 8
8 0
"""

expected_sample = """\
Case #1: 6
6
5
4
3
2
1
Case #2: 3
1
3
2
Case #3: 1
1
"""

assert run(sample) == expected_sample, "official samples"

# Minimum-size input.
assert run("""\
1
0 0 10 0
1
5 1
""") == """\
Case #1: 1
1
""", "minimum n"

# Equal ray from P: every point is on a boundary ray, so no pair can nest.
assert run("""\
1
0 0 10 0
3
1 1
2 2
3 3
""") == """\
Case #1: 1
1
""", "equal ray must remain strict"

# Both sides have a chain of length 2.
# The two maximum solutions are [2, 1] and [4, 3],
# so lexicographic order chooses [2, 1].
assert run("""\
1
0 0 10 0
4
5 1
5 2
5 -1
5 -2
""") == """\
Case #1: 2
2
1
""", "tie between the two sides"

# Vertical PQ. This catches implementations that rely on ordinary slopes.
assert run("""\
1
0 0 0 10
4
1 5
2 5
-1 5
-2 5
""") == """\
Case #1: 2
2
1
""", "vertical pivot line"

# Maximum-size case with a deliberately simple answer.
# All 100000 points lie on the same ray from P, so the answer is still 1.
points = "\n".join(f"{i} {i}" for i in range(1, 100001))
max_case = "1\n0 0 1 0\n100000\n" + points + "\n"

assert run(max_case) == """\
Case #1: 1
1
""", "n = 100000"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | (P=(0,0),Q=(10,0),A_1=(5,1)) |`Case #1: 1 / 1`| 最小输入尺寸|
 | 三点 ((1,1),(2,2),(3,3)) |`Case #1: 1 / 1`| 等角等级和严格性|
 | 相对两侧的两条链条 |`Case #1: 2 / 2 / 1`| 侧面分离和字典顺序打破平局 |
 | 垂直（PQ）|`Case #1: 2 / 2 / 1`| 不分方向处理|
 | 一条射线上有 (100000) 个点 |`Case #1: 1 / 1`| 最大 (n) 和线性记忆行为 |

 ## 边缘情况

 对于 (PQ) 相对侧的点，算法在执行任何 DP 之前将它们放置在不同的数组中。 为了```
1
0 0 10 0
2
5 1
5 -1
```第一个点仅在上侧计算中接收排名，第二个点仅在下侧计算中接收排名。 每边产生一条长度为 (1) 的链，所以最终答案是```
Case #1: 1
1
```比较不会在两侧之间创建过渡，这与几何形状匹配，因为三角形的内点 (PQA) 必须与 (A) 位于 (PQ) 的同一侧。 

对于相等的光线，考虑```
1
0 0 10 0
3
1 1
2 2
3 3
```所有三个点围绕 (P) 具有相同的第一角等级。 因此，它们在一个同等等级的组内进行处理，并且递减的二阶顺序阻止一个组扩展另一个组。 每个 DP 值为 (1)，因此重建选择最小的原始索引，产生```
Case #1: 1
1
```这是捕获普通非严格 LIS 的严格边界情况。 

对于垂直枢轴线，```
1
0 0 0 10
4
1 5
2 5
-1 5
-2 5
```该算法从不计算斜率，例如 (y/x)。 它使用叉积来比较向量，因此 (PQ) 的垂直方向不需要特殊分支。 在每一侧，距离 (PQ) 较远的点是外部点，给出两个可能的链 (2,1) 和 (4,3)。 由于两者都有长度 (2)，因此第一个索引决定答案，产生```
Case #1: 2
2
1
```最后，(n=100000) 测试将每个点放置在一条射线上。 角度等级会折叠成一个第一等级组，因此 Fenwick DP 永远不会创建比一个更长的链。 该算法仍然只执行排序和线性传递和输出```
Case #1: 1
1
```该示例还证实了为什么即使输入包含许多具有非常相似的几何方向的点，存储精确的方向组也很重要。
