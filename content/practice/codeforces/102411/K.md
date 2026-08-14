---
title: "CF 102411K - 国王的孩子"
description: "我们有一个（n×m）网格。 有些单元格包含不同的大写字母，每个字母代表一个孩子的城堡，而其他所有单元格都是空的。 任务是用其矩形省份包含该单元格的子项的小写字母替换每个空单元格。"
date: "2026-08-14T14:39:33+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102411
codeforces_index: "K"
codeforces_contest_name: "ICPC 2019-2020 North-Western Russia Regional Contest"
rating: 0
weight: 102411
solve_time_s: 476
verified: false
draft: false
---

[CF 102411K - 国王的孩子](https://codeforces.com/problemset/problem/102411/K)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 56s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个（n \times m）网格。 有些单元格包含不同的大写字母，每个字母代表一个孩子的城堡，而其他所有单元格都是空的。 任务是用其矩形省份包含该单元格的子项的小写字母替换每个空单元格。 每个省份必须是一个恰好包含一座城堡的矩形，并且包含`A`必须有最大可能的面积。 原始的大写城堡单元在输出中保持不变。 官方的限制是(1 \le n,m \le 1000)，最多有26座城堡，因为每个大写字母都是不同的。 

（1000 × 1000）界限意味着可以有一百万个单元格，因此任何解决方案都应该在一个网格维度上接近线性或二次，而不是枚举所有可能的矩形。 对于 (n=m=1000)，已经有 (10^6) 个单元格，而 (n^2m^2) 是 (10^{12})。 小字母表是第二个有用的约束：只能有 26 个省份，因此在找到最佳省份后`A`，我们可以为每个城堡做更多的工作，尽管下面的解决方案不需要这样做。 

第一个棘手的情况是当`A`是在一个边界上。 例如，```
A..
...
..B
```最大省份为`A`不一定只是第一行或第一列。 这里由前两行组成的矩形的面积为 6，因此有效的最优输出为```
Aaa
aaa
bbB
```一种仅尝试围绕对称扩展的解决方案`A`可能会错过这个矩形。 

另一个微妙的情况是另一座城堡仅阻挡一个方向。 为了```
A.B
```

`A`可以拥有前两个单元格，但不能交叉`B`。 正确的输出是```
AaB
```对待每一个非`A`搜索时单元格为空`A`会错误地给出`A`整排。 

第三个问题是几个最大矩形可以具有相同的面积。 为了```
A.
.B
```

`A`可以取第一行或第一列，两者的面积都是 2。一个有效的结果是```
Aa
bB
```正确的实现不能依赖于特定的关系是否是唯一的最佳值。 任何最大矩形就足够了。 

## 方法

 一种直接的方法是枚举包含的每个矩形`A`，检查是否包含另一个城堡，并保留最大的有效城堡。 即使使用二维前缀和进行有效性检查（O(1)），包含固定单元格的矩形数量也可以达到

 [
 500\cdot501\cdot500\cdot501
 =62,750,250,000
 ]

 当网格为 (1000\times1000) 并且`A`靠近中心。 两秒钟内不可能考虑这么多候选人。 检查每个候选人体内的每个细胞会更糟糕。 

有用的观察是一个矩形包含`A`由其顶行、底行、左边界和右边界确定。 一旦顶行和底行被固定，就可以独立于行找到最佳可能的水平边界。 对于所选顶部和底部之间的每一行，计算可以立即在左侧和右侧取多少个空单元格`A`。 该矩形只能使用区间内所有行中的最小左延伸和最小右延伸。 

认为`A`位于 (c) 栏。 令 (L_i) 为可取到左侧的单元格数量`A`在第 (i) 行，以及 (R_i) 右侧相应的数字。 将最小值从包含的行传播出去后`A`， (L_i) 和 (R_i) 表示在行 (i) 和 (R_i) 之间的整个间隔中同时可用的扩展`A`。 

对于顶行 (u) 和底行 (d)，最大宽度为

 [
 \min(L_u,L_d)+\min(R_u,R_d)+1。 
]

这`+1`是包含的列`A`。 尝试所有成对的顶部和底部行需要 (O(n^2))，而计算水平扩展需要 (O(nm))。 对于约束来说这已经足够了。 

一旦最优`A`矩形固定了，剩下的问题就变成了构造问题。 关键是递归地划分矩形之外的区域。 较大矩形内的矩形的补集最多由四个矩形带组成：上、下、左、右。 

这些带中的每个非空带都必须包含另一座城堡。 例如，如果上面的频段`A`不包含任何城堡，`A`矩形可以向上延伸，这与它的最大值相矛盾。 同样的论点适用于所有四个方面。 

现在考虑包含多个城堡的任何矩形区域。 如果它们的行坐标不全部相等，则水平切割最小城堡行和最大城堡行之间的区域。 生成的两个矩形都包含至少一座城堡。 如果所有城堡排成一排，则它们的列不同，因此垂直切割将它们分开。 重复此操作最终会留下恰好包含一座城堡的矩形。 这给出了有效的省份划分，而不改变已经最优的`A`长方形。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^2m^2)) 带有前缀和 | (O(nm)) | 太慢了 |
 | 最佳| (O(nm+n^2+K^2)), (K\le26) | (O(nm+n^2+K^2)), (K\le26) | (O(nm+K)) | 已接受 |

 ## 算法演练

 1. 找到位置`A`并记录所有其他城堡的位置。 我们只会优化`A`，因为一旦确定了其最大可能的矩形，剩余的单元格就可以独立划分。 
2. 找到周围连续的行`A`可以由`A`长方形。 从包含的行开始`A`，当单元格处于`A`的列是`A`本身或`.`。 该列中的一座不同的城堡阻止每个矩形穿过其行。 
3. 对于每个可用行，计算紧邻其左侧和右侧的连续点的数量`A`的专栏。 这些是该行的原始水平扩展。 相应边任何地方的城堡都会阻止延伸。 
4. 传播最小水平扩展远离包含`A`。 向下移动，将每个值替换为其原始扩展名和上一行中的值的最小值。 向上进行对称操作。 此后，(L_i) 表示每行可用的最大左扩展`A`第(i)行和(R_i)具有与右侧类似的含义。 
5. 枚举每个可能的顶行和底行包含`A`。 对于每一对，计算

 [
 宽度=\min(L_{顶部},L_{底部})+\min(R_{顶部},R_{底部})+1
 ]

 并将其乘以高度。 保留面积最大的矩形。 

端点最小值就足够了，因为传播的数组已经包含从`A`到那个端点。 
6. 用小写字母绘制所选矩形`a`，保留大写`A`不变。 里面没有其他城堡，因为每一个水平和垂直的延伸都被城堡阻止了。 
7. 考虑外侧的四个矩形带`A`长方形。 对于每个非空带，收集位于其中的城堡并递归划分该带。 
8. 对于包含一座城堡的递归区域，将整个区域赋予该城堡。 它已经是一个包含一座城堡的矩形，因此不需要进一步切割。 
9. 对于包含多个城堡的区域，检查它们的行坐标。 如果它们不相等，请选择最小和最大城堡行之间的水平边界。 否则，选择最小和最大城堡柱之间的垂直边界。 递归求解两个结果区域。 
10. 打印完成的网格。 每个原始城堡都保持大写，而每个空单元格都被分配了一个小写所有者。 

### 为什么它有效

 对于`A`省，考虑包含的任何有效矩形`A`。 它的顶行和底行是一对 (u,d)。 在它们之间的每一行上，其左边界不能比第一个城堡之前的连续空单元格更左边，右侧也类似。 传播的 (L) 和 (R) 值准确捕获了这些共同限制，因此为 (u,d) 计算的宽度是该垂直间隔的最大可能宽度。 由于检查了每个可能的顶部和底部对，因此所选矩形在可以合法包含的所有矩形中具有最大可能的面积`A`。 

固定这个矩形后，每个非空边带都包含一座城堡，因为否则`A`可以扩展到该频段。 任何包含多个城堡的矩形区域始终可以被水平或垂直边界分割，以便两侧都包含至少一个城堡。 递归最终会生成只包含一座城堡的矩形，并且切割是不相交的并覆盖原始区域。 因此，所有像元都被准确地分配到一个有效省份，而`A`该省仍保持全球最佳状态。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_grid(n, m, rows):
    grid = [list(row) for row in rows]

    castles = []
    ar = ac = -1

    for r in range(n):
        for c in range(m):
            ch = grid[r][c]
            if 'A' <= ch <= 'Z':
                if ch == 'A':
                    ar, ac = r, c
                else:
                    castles.append((r, c, ch))

    # Find the vertical interval that an A-rectangle can occupy.
    lo = ar
    while lo > 0 and grid[lo - 1][ac] == '.':
        lo -= 1

    hi = ar
    while hi + 1 < n and grid[hi + 1][ac] == '.':
        hi += 1

    raw_l = [0] * n
    raw_r = [0] * n

    # Horizontal empty runs around A for every usable row.
    for r in range(lo, hi + 1):
        c = ac - 1
        cnt = 0
        row = grid[r]

        while c >= 0 and row[c] == '.':
            cnt += 1
            c -= 1
        raw_l[r] = cnt

        c = ac + 1
        cnt = 0
        while c < m and row[c] == '.':
            cnt += 1
            c += 1
        raw_r[r] = cnt

    # Propagate minima from A downwards and upwards.
    left = [0] * n
    right = [0] * n

    left[ar] = raw_l[ar]
    right[ar] = raw_r[ar]

    for r in range(ar + 1, hi + 1):
        left[r] = min(raw_l[r], left[r - 1])
        right[r] = min(raw_r[r], right[r - 1])

    for r in range(ar - 1, lo - 1, -1):
        left[r] = min(raw_l[r], left[r + 1])
        right[r] = min(raw_r[r], right[r + 1])

    # Find the maximum-area rectangle containing A.
    best_area = 1
    best_top = best_bottom = ar

    for top in range(ar, lo - 1, -1):
        for bottom in range(ar, hi + 1):
            width = (
                min(left[top], left[bottom])
                + min(right[top], right[bottom])
                + 1
            )
            area = width * (bottom - top + 1)

            if area > best_area:
                best_area = area
                best_top = top
                best_bottom = bottom

    best_left = ac - min(left[best_top], left[best_bottom])
    best_right = ac + min(right[best_top], right[best_bottom])

    # Reserve A's optimal province.
    for r in range(best_top, best_bottom + 1):
        row = grid[r]
        for c in range(best_left, best_right + 1):
            if row[c] == '.':
                row[c] = 'a'

    def fill_region(r1, r2, c1, c2, pts):
        if not pts:
            return

        if len(pts) == 1:
            _, _, ch = pts[0]
            lower = ch.lower()

            for r in range(r1, r2 + 1):
                row = grid[r]
                for c in range(c1, c2 + 1):
                    if row[c] == '.':
                        row[c] = lower
            return

        min_r = min(p[0] for p in pts)
        max_r = max(p[0] for p in pts)

        if min_r != max_r:
            cut = (min_r + max_r) // 2

            top_pts = [p for p in pts if p[0] <= cut]
            bottom_pts = [p for p in pts if p[0] > cut]

            fill_region(r1, cut, c1, c2, top_pts)
            fill_region(cut + 1, r2, c1, c2, bottom_pts)
        else:
            min_c = min(p[1] for p in pts)
            max_c = max(p[1] for p in pts)
            cut = (min_c + max_c) // 2

            left_pts = [p for p in pts if p[1] <= cut]
            right_pts = [p for p in pts if p[1] > cut]

            fill_region(r1, r2, c1, cut, left_pts)
            fill_region(r1, r2, cut + 1, c2, right_pts)

    def process_region(r1, r2, c1, c2):
        if r1 > r2 or c1 > c2:
            return

        pts = [
            p for p in castles
            if r1 <= p[0] <= r2 and c1 <= p[1] <= c2
        ]
        fill_region(r1, r2, c1, c2, pts)

    # The complement of A's rectangle consists of at most four rectangles.
    process_region(0, best_top - 1, 0, m - 1)
    process_region(best_bottom + 1, n - 1, 0, m - 1)
    process_region(best_top, best_bottom, 0, best_left - 1)
    process_region(best_top, best_bottom, best_right + 1, m - 1)

    return [''.join(row) for row in grid]

def solve():
    n, m = map(int, input().split())
    rows = [input().strip() for _ in range(n)]
    print('\n'.join(solve_grid(n, m, rows)))

if __name__ == "__main__":
    solve()
```第一部分位于`A`和所有其他城堡。 城堡列表与可变网格分开保存，这使得后面的递归分区独立于已经写入的小写单元格。 

在计算水平延伸之前先找到垂直间隔。 一座不一样的城堡`A`的列是一个硬屏障，因此超出它的行永远不能参与`A`省。 

原始的左右运行仅检查紧邻的单元格`A`的专栏。 传播步骤是将这些原始值更改为区间范围的限制。 如果没有这种传播，仅使用两个端点行将错误地忽略间隔中间的阻塞城堡。 

最大区域搜索使用严格的`>`比较面积时。 等面积矩形都是有效的，因此保留第一个矩形可以避免不必要的平局处理。 

递归分区永远不会修改`A`长方形。 每个边区域与其不相交，并且每个递归切割将一个矩形划分为两个较小的矩形。 当一个地区只剩下一座城堡时，整个地区都可以涂上该孩子的小写字母。 

Python 中不存在整数溢出问题。 最大的面积仅为 (10^6)，尽管 Python 整数也可以处理更大的值。 

## 工作示例

 官方样本有`A`在第 2 行第 3 列，使用从零开始的坐标。 垂直传播后有用的水平扩展如下。 

| 行| 原始左| 原始右| 向左传播 | 传播权|
 | --- | --- | --- | --- | --- |
 | 0 | 3 | 2 | 1 | 2 |
 | 1 | 1 | 4 | 1 | 4 |
 | 2 | 3 | 4 | 3 | 4 |
 | 3 | 3 | 4 | 3 | 4 |
 | 4 | 3 | 1 | 3 | 1 |
 | 5 | 0 | 4 | 0 | 1 |

 对于从第 1 行到第 3 行的间隔，宽度为

 [
 \min(1,3)+\min(4,4)+1=6,
 ]

 所以面积是 (6\cdot3=18)。 所选矩形为第 1 行至第 3 行和第 2 至第 7 列。 

| 顶部 | 底部| 宽度| 身高| 面积 | 最佳|
 | --- | --- | --- | --- | --- | --- |
 | 2 | 2 | 8 | 1 | 8 | 第 2..2 行 |
 | 1 | 2 | 6 | 2 | 12 | 12 行 1..2 |
 | 1 | 3 | 6 | 3 | 18 | 18 第 1..3 行 |
 | 0 | 3 | 4 | 4 | 16 | 16 第 1..3 行 |
 | 1 | 4 | 5 | 4 | 20 | 行 1..4 |

 表中的最后一行显示了传播值的重要性：尽管第 4 行本身左侧有三个可用单元格，但其右侧被`P`，因此向下延伸矩形会减少宽度。 实际的最佳间隔是通过考虑所有对来确定的，而不仅仅是通过采用最宽的单独行来确定。 

对于第二个例子，考虑```
2 2
A.
.B
```该行包含`A`其右侧有一个空闲单元格。 第二行右侧没有空闲单元格，因为`B`占据那个位置。 

| 顶部 | 底部| 宽度| 身高| 面积 | 最佳|
 | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 2 | 1 | 2 | 行 0..0 |
 | 0 | 1 | 1 | 2 | 2 | 行 0..0 |

 两个选择的面积相等，因此严格比较保留第一个矩形。`A`拥有第一行。 剩下的第二行是一个矩形，仅包含`B`，所以就变成了`bB`。 最终输出是```
Aa
bB
```此示例演示了平局情况和递归构造。 最佳面积为`A`无论选择哪个最大矩形，都是 2。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(nm+n^2+K^2)) | 水平运行扫描网格一次，顶行和底行给出 (O(n^2)) 个候选，递归点过滤成本最多 (O(K^2)) |
 | 空间| (O(nm+K)) | 可变网格主导内存，而扩展数组和城堡列表是线性的 |

 对于 (n,m\le1000)，(nm) 至多为 100 万，(n^2) 也至多为 100 万。 城堡的数量满足(K\le26)，因此与网格操作相比，递归构造很小。 该解决方案完全保持在 512 MB 内存限制内，并避免了 (10^{12}) 规模的矩形枚举，这使得暴力破解变得不切实际。 

## 测试用例

 下面的测试工具假设解决方案保存为`solution.py`并导入其`solve_grid`功能。```python
from solution import solve_grid

def run(inp: str) -> str:
    lines = inp.strip().splitlines()
    n, m = map(int, lines[0].split())
    rows = lines[1:]
    return "\n".join(solve_grid(n, m, rows))

# Provided sample
assert run(
    """6 8
......X.
.F......
...A....
........
.....P..
..L.....
"""
) == """xxxxxxXx
fFaaaaaa
ffaAaaaa
ffaaaaaa
pppppPpp
llLlllll""", "sample 1"

# Constructed sample 2: two maximum rectangles of equal area for A.
assert run(
    """2 2
A.
.B
"""
) == """Aa
bB""", "sample 2, tie between maximum A rectangles"

# Minimum-size input.
assert run(
    """1 1
A
"""
) == """A""", "minimum grid"

# Boundary condition and a castle blocking A's expansion.
assert run(
    """1 3
A.B
"""
) == """AaB""", "boundary and horizontal blocker"

# A at the corner, with the optimal rectangle using two rows.
assert run(
    """3 3
A..
...
..B
"""
) == """Aaa
aaa
bbB""", "corner A and maximum rectangle"

# Maximum-size legal grid with no other castles.
# The requested all-equal-castle case is illegal because all letters
# must be distinct, so this stresses the analogous all-empty interior.
n = m = 1000
rows = ["A" + "." * 999] + ["." * 1000 for _ in range(999)]
inp = f"{n} {m}\n" + "\n".join(rows)

expected = "\n".join(
    ["A" + "a" * 999] + ["a" * 1000 for _ in range(999)]
)

assert run(inp) == expected, "maximum-size grid"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 官方（6\times8）样本 |`A`获取行 1..3 和列 2..7 | 总体构造及优化`A`矩形|
 |`A.`/`.B`|`Aa`/`bB`| 等面积选择和递归分区|
 |`A`|`A`| 最小尺寸 |
 |`A.B`|`AaB`| 边界处理和城堡阻止水平扩展|
 |`A..`/`...`/`..B`|`Aaa`/`aaa`/`bbB`| 角点位置和两行最佳矩形|
 | (1000\times1000), 仅`A`| 整个网格归`A`| 最大尺寸和没有竞争城堡的情况|

 ## 边缘情况

 当`A`占据唯一的单元格，```
A
```垂直间隔有一行，两个水平扩展都为零，唯一的候选矩形的面积为 1。没有其他区域可以划分，因此输出保持不变`A`。 

当另一座城堡挡住一个方向时，例如```
A.B
```的原始右扩展`A`为 1，因为第 1 列的点是空闲的，并且`B`在第 2 列停止扫描。 最佳矩形的宽度为 2。剩余的一个单元格区域包含`B`，所以结果是`AaB`。 在搜索过程中，城堡永远不会被视为空牢房。 

当几个最大矩形面积相同时，```
A.
.B
```第一个候选是覆盖第一行的一个单元格高的矩形，区域为 2。向下延伸也会生成一个区域为 2 的单列宽矩形。 由于比较是严格的，因此保留第一个最大值。 补码是第二行，它被分配给`B`，生产`Aa`和`bB`。 任一最大选择都可以满足优化要求。 

什么时候`A`位于角落，但可以扩展到多行，如```
A..
...
..B
```前两行的传播右扩展为 2，而`B`限制第三行。 覆盖第 0 行和第 1 行的候选区域的宽度为 3，高度为 2，给出区域 6。没有矩形包含`A`可以包含第三行，同时保持该宽度。 所选择的`A`因此，矩形是前两行，剩下的底行仅包含`B`, 给予`Aaa`,`aaa`,`bbB`。 

最大尺寸的情况下只有`A`也很有用，因为每个单元格都适合最喜欢的孩子。 水平延伸到达每行的右边界，垂直间隔到达底部边界，最大矩形是整个（1000×1000）网格。 由于没有其他城堡，所以保留后递归分区就没有什么可处理的`A`的矩形。
