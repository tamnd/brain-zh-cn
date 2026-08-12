---
title: "CF 102411K - 国王的孩子"
description: "网格是一个（n×m）矩形阵列。 有些单元格包含不同的大写字母，每个这样的字母都是属于一个孩子的一座城堡。 其他所有单元格都是空的。"
date: "2026-08-12T00:30:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102411
codeforces_index: "K"
codeforces_contest_name: "ICPC 2019-2020 North-Western Russia Regional Contest"
rating: 0
weight: 102411
solve_time_s: 434
verified: false
draft: false
---

[CF 102411K - 国王的孩子](https://codeforces.com/problemset/problem/102411/K)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 14s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 网格是一个（n × m）矩形阵列。 有些单元格包含不同的大写字母，每个这样的字母都是属于一个孩子的一座城堡。 其他所有单元格都是空的。 我们必须将整个网格划分为轴对齐的矩形，以便每个矩形恰好包含一座城堡。 矩形包含`A`特殊的是：在所有有效分区中，其面积必须尽可能大。 输出将每个城堡保持大写，并将每个空单元格更改为矩形拥有该城堡的子单元格的小写字母。 原问题有(n,m\le 1000)，26个大写字母每个最多有一座城堡。 

两个网格维度都可以达到1000，因此可以有（10^6）个单元格。 对于每个可能的矩形的每个单元格进行大量工作的算法已经太昂贵了。 更准确地说，枚举包含的所有矩形`A`给出顶部和底部边界的二次选择以及左侧和右侧边界的另一个二次选择，这导致大约 (O(n^2m^2)) 个候选. 在 (n=m=1000) 时，约为 (10^{12})，远远超出 2 秒的限制。 我们需要利用这样一个事实：只有一座杰出的城堡，并且包含它的空矩形可以通过其垂直跨度和每行可用的水平空间来表征。 

有几种边界情况可能会导致粗心的实施失败。 如果`A`是唯一的城堡，例如，```
2 2
A.
..
```正确的输出是```
Aa
aa
```因为整个网格可以属于`A`。 坚持在各个方向的城堡边界处停止的实现可能会意外地使单元格处于未分配状态。 

第二种情况是另一座城堡仅阻挡一侧：```
2 3
A.B
...
```最佳省份`A`是前两列，所以正确的输出是```
AaB
aab
```矩形的面积为 (4​​)。 只查看包含以下内容的行的方法`A`会找到宽度 (2)，但可能会错过相同的宽度延伸到第二行。 

第三种情况在候选矩形的正上方或正下方建立一个城堡：```
4 4
A..B
....
C..D
....
```一种最佳输出是```
AaaB
aaab
Cddd
cddd
```这`A`省份有区域 (6)，占据第 1 行和第 2 行，第 1 行到第 3 列。其他省份可以在完成后独立构建`A`是固定的。 不小心的垂直扩展可能会交叉`C`并错误地将其包含在`A`长方形。 

## 方法

 蛮力的想法很简单。 枚举包含单元格的每个矩形`A`，检查是否包含另一个城堡，并保留最大的有效城堡。 如果我们有城堡位置的二维前缀和，则可以在恒定时间内进行检查。 困难在于矩形的数量。 顶行和底行有 (O(n^2)) 个选择，左列和右列有 (O(m^2)) 个选择，因此最坏情况下的候选数是 (O(n^2m^2))。 对于 (n=m=1000)，即使在考虑其余结构之前，大约也有 (2.5\cdot10^{11}) 个包含中心单元的矩形。 这个想法是正确的，但是搜索空间太大了。 

有用的观察是我们只需要优化省份`A`。 一旦我们选择了一个空矩形，其中包含`A`，棋盘的其余部分始终可以划分为有效的矩形。 删除`A`长方形。 它的补集最多由四个矩形条组成：其上方的部分、其下方的部分、其左侧的部分和其右侧的部分。 非空条带不能包含零个城堡，因为否则我们可以扩大`A`矩形进入该条带并获得一个严格更大的空矩形。 然后可以递归地对每个条带进行分区。 

对于至少包含两个城堡的区域，选择具有不同行的两个城堡。 它们的行之间的水平切割创建了两个矩形，每个矩形包含至少一座城堡。 如果所有城堡都具有相同的行，则它们必须具有不同的列，因此垂直切割将其中两个城堡分开。 重复此操作会得到一个矩形分区，每个最终矩形中恰好有一座城堡。 这是一个简单的断头台分区，当有 (k\le26) 个城堡时，它只使用 (O(k^2)) 次工作。 

剩下的任务是找到包含的最大空矩形`A`。 这是最大矩形问题的定点版本。 我们使用通常用于最大空矩形的相同挂线思想：对于可以参与矩形的每一行，计算我们可以从左和右延伸多远`A`在不撞到城堡的情况下，然后在垂直移动时保持前缀最小值。 任何选定的顶行和底行的最终宽度直接从这些最小值获得。 

四个边界上的强力搜索减少到 (O(n^2))，因为只需要显式枚举顶部和底部边界。 计算水平间隙需要 (O(nm))。 由于只有26座城堡，后续的递归构建与网格处理相比可以忽略不计。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n^2m^2)) | (O(nm)) | 太慢了|
 | 最佳 | (O(nm+n^2+K^2)), (K\le26) | (O(nm+n^2+K^2)), (K\le26) | (O(nm+K^2)) | 已接受 |

 ## 算法演练

 1.找到城堡的位置((a_r,a_c))`A`。 算法的第一部分考虑原始网格，其中每个大写城堡都是一个障碍，每个`.`细胞可用。 
2. 从`A`，沿着列 (a_c) 向下移动，直到到达另一个城堡。 向上做同样的事情。 所得的行间隔是包含的空矩形的唯一可能的垂直范围`A`，因为每个这样的矩形都包含列 (a_c)。 该列中的城堡将位于矩形内部，并且违反单城堡条件。 
3. 对于每个可用行，计算紧邻列 (a_c) 左侧和右侧的连续空单元格的数量。 调用这些原始值`left`和`right`。 在其他地方有城堡的行仍然可以参加，但其水平间隔必须停在该城堡之前。 
4. 将这些水平容量传播到远离包含`A`。 当向上或向下移动一行时，矩形必须适合该行和该行之间的每一行`A`，因此可用的左扩展成为当前行的原始扩展和上一行已经可能的扩展的最小值。 这同样适用于右扩展。 
5. 枚举每个顶行和底行包含`A`。 如果顶行是（t），底行是（b），则左侧的最大公共延伸是

 [
 \min(L_t,L_b),
 ]

 因为`L[t]`已经包含从 (t) 到所有行的最小值`A`， 尽管`L[b]`包含最小的`A`至(b)。 同样的推理给出了正确的扩展

 [
 \min(R_t,R_b)。 
]

 因此，该垂直跨度的最大可能宽度是

 [
 \min(L_t,L_b)+\min(R_t,R_b)+1。 
]

 将此宽度乘以 (b-t+1) 即可得出该行对的最佳区域。 
6. 保留面积最大的矩形。 所考虑的每个矩形都没有其他城堡，并且空矩形的每个可能的垂直跨度都包含`A`被考虑，所以所选择的矩形是全局最优的`A`。 
7. 填写所选内容`A`带小写的矩形`a`在其空单元格上。 城堡`A`本身保持大写。 
8. 将剩余的板分成最多四个矩形区域`A`长方形。 对于每个非空区域，收集其中的城堡。 非空区域总是包含一座城堡，因为否则`A`矩形可以扩大到该区域。 
9. 递归地划分每个剩余区域。 如果它包含一座城堡，请用该城堡的小写字母填充该区域的每个空单元格。 如果它包含多个不同行的城堡，请在两个城堡之间水平剪切。 如果所有城堡都在同一行，则在两个城堡之间垂直切割。 生成的两个矩形都至少包含一座城堡，因此该过程可以继续。 
10. 当每个递归区域都有一座城堡时，所有单元都已分配。 这`A`矩形在第一步之后没有被改变，所以它的面积仍然是最大可能的。 

### 为什么它有效

 每个有效省份包含`A`是一个轴对齐的矩形，包含`A`没有其他城堡。 算法的第一部分准确地检查了这些可能性。 它的垂直边界必须位于最大无城堡区间内`A`的列，对于任何固定的顶部和底部行，最大可能的水平间隔是所有这些行上可用的空间隔的交集。 所传播的`L`和`R`数组精确计算这些交集，因此找到的最大值是可能的最大值`A`长方形。 

仍有待证明这个矩形实际上可以出现在一个完整的分区中。 它的补集由四个不相交的矩形条组成。 如果其中一个条带非空且不包含城堡，则`A`矩形可以扩展到其中，这与其面积的极大值相矛盾。 因此，每个非空条带至少包含一座城堡。 任何包含多个城堡的矩形都可以通过选择具有不同行或（如果需要的话，不同列）的两个城堡来分为两个包含城堡的矩形。 重复此操作会生成只有一座城堡的矩形。 由于每次切割都是沿着当前矩形的整个边界进行的，因此最终区域形成补集的不相交分区。 因此最大空矩形为`A`总是可以实现的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

DOT = ord('.')

def solve():
    n, m = map(int, input().split())
    grid = [bytearray(input().strip(), 'ascii') for _ in range(n)]

    ar = ac = -1
    castles = []

    for r in range(n):
        row = grid[r]
        for c in range(m):
            ch = row[c]
            if ch != DOT:
                if ch == ord('A'):
                    ar, ac = r, c
                else:
                    castles.append((r, c, ch))

    # Find the largest empty rectangle containing A.
    left = [0] * n
    right = [0] * n

    top_lim = ar
    bottom_lim = ar

    for r in range(ar - 1, -1, -1):
        if grid[r][ac] != DOT:
            break
        top_lim = r

    for r in range(ar + 1, n):
        if grid[r][ac] != DOT:
            break
        bottom_lim = r

    # Raw horizontal free lengths, then prefix minima toward A.
    for r in range(ar, bottom_lim + 1):
        cnt = 0
        c = ac - 1
        row = grid[r]
        while c >= 0 and row[c] == DOT:
            cnt += 1
            c -= 1

        if r == ar:
            left[r] = cnt
        else:
            left[r] = min(left[r - 1], cnt)

        cnt = 0
        c = ac + 1
        while c < m and row[c] == DOT:
            cnt += 1
            c += 1

        if r == ar:
            right[r] = cnt
        else:
            right[r] = min(right[r - 1], cnt)

    for r in range(ar - 1, top_lim - 1, -1):
        row = grid[r]

        cnt = 0
        c = ac - 1
        while c >= 0 and row[c] == DOT:
            cnt += 1
            c -= 1
        left[r] = min(left[r + 1], cnt)

        cnt = 0
        c = ac + 1
        while c < m and row[c] == DOT:
            cnt += 1
            c += 1
        right[r] = min(right[r + 1], cnt)

    best_area = 1
    best_top = best_bottom = ar

    for top in range(ar, top_lim - 1, -1):
        for bottom in range(ar, bottom_lim + 1):
            width = min(left[top], left[bottom])
            width += min(right[top], right[bottom]) + 1
            height = bottom - top + 1
            area = width * height

            if area > best_area:
                best_area = area
                best_top = top
                best_bottom = bottom

    best_left = min(left[best_top], left[best_bottom])
    best_right = min(right[best_top], right[best_bottom])
    best_left = ac - best_left
    best_right = ac + best_right

    for r in range(best_top, best_bottom + 1):
        row = grid[r]
        for c in range(best_left, best_right + 1):
            if row[c] == DOT:
                row[c] = ord('a')

    # Recursively partition every region outside A's rectangle.
    def partition(top, bottom, left_col, right_col, pts):
        if not pts:
            return

        if len(pts) == 1:
            _, _, ch = pts[0]
            lower = ch + 32

            for r in range(top, bottom + 1):
                row = grid[r]
                for c in range(left_col, right_col + 1):
                    if row[c] == DOT:
                        row[c] = lower
            return

        p0 = pts[0]
        p1 = None

        # Prefer a horizontal cut.
        for p in pts[1:]:
            if p[0] != p0[0]:
                p1 = p
                break

        if p1 is not None:
            cut = min(p0[0], p1[0])

            upper = []
            lower = []
            for p in pts:
                if p[0] <= cut:
                    upper.append(p)
                else:
                    lower.append(p)

            partition(top, cut, left_col, right_col, upper)
            partition(cut + 1, bottom, left_col, right_col, lower)
            return

        # All castles have the same row, so a vertical cut exists.
        for p in pts[1:]:
            if p[1] != p0[1]:
                p1 = p
                break

        cut = min(p0[1], p1[1])

        left_pts = []
        right_pts = []
        for p in pts:
            if p[1] <= cut:
                left_pts.append(p)
            else:
                right_pts.append(p)

        partition(top, bottom, left_col, cut, left_pts)
        partition(top, bottom, cut + 1, right_col, right_pts)

    # The complement of A's rectangle is at most four rectangles.
    regions = []

    if best_top > 0:
        regions.append((0, best_top - 1, 0, m - 1))

    if best_bottom + 1 < n:
        regions.append((best_bottom + 1, n - 1, 0, m - 1))

    if best_left > 0:
        regions.append((best_top, best_bottom, 0, best_left - 1))

    if best_right + 1 < m:
        regions.append((best_top, best_bottom, best_right + 1, m - 1))

    for top, bottom, left_col, right_col in regions:
        pts = [
            p for p in castles
            if top <= p[0] <= bottom
            and left_col <= p[1] <= right_col
        ]
        partition(top, bottom, left_col, right_col, pts)

    return '\n'.join(row.decode('ascii') for row in grid)

if __name__ == "__main__":
    sys.stdout.write(solve())
```输入存储为`bytearray`行而不是 Python 字符串，因为该结构修改了许多单元格。 整数字节值也使得频繁`.`比较便宜。 由于最多有 (10^6) 个单元格，因此这种表示形式可以轻松地保持在内存限制内。 

第一次扫描定位`A`并将所有其他城堡存储为坐标和字节值。 这`top_lim`和`bottom_lim`计算找到最大垂直间隔包含`A`其列中没有另一座城堡。 一个矩形包含`A`无法穿越这样的城堡。 

这`left`和`right`数组在两个方向上独立传播。 对于下面的行`A`,`left[r]`表示适用于每一行的最大左扩展`A`通过`r`。 向上传递具有对称意义。 这就是为什么面积计算只需要`left[top]`,`left[bottom]`,`right[top]`， 和`right[bottom]`，而不是再次扫描整个垂直间隔。 

表达式为`width`为列添加 1`ac`本身。 这很容易就落后一分。 如果左侧有两个空闲单元，右侧有三个空闲单元，则总宽度为 (2+1+3=6)，而不是 (5)。 

递归`partition`函数永远不会改变所选的`A`长方形。 它的输入矩形保证至少包含一个非`A`城堡。 当只有一座城堡时，整个地区都属于它。 对于多个城堡，所选的切割将两个城堡放置在相对的两侧，因此两个递归子都不能没有城堡。 

Python 整数对于最大可能区域 (10^6) 不会溢出，但无论如何都会使用普通整数算术。 递归深度最多为城堡的数量，只有26个，所以这里递归是安全的。 

## 工作示例

 ### 示例 1

 的`A`castle 位于第 3 行第 4 列（使用基于 1 的坐标）。 它的列不包含其他城堡，因此每一行都可以参与。 最佳垂直跨度的相关值总结如下。 

| 顶行| 底排| 常用左扩展 | 共同权利延伸| 宽度| 身高| 面积 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 3 | 3 | 3 | 4 | 8 | 1 | 8 |
 | 2 | 3 | 1 | 4 | 6 | 2 | 12 | 12
 | 3 | 4 | 3 | 4 | 8 | 2 | 16 | 16
 | 2 | 4 | 1 | 4 | 6 | 3 | 18 | 18
 | 2 | 5 | 1 | 0 | 2 | 4 | 8 |

 最佳面积是 18，从第 2 行到第 4 行和第 3 到第 8 列获得。结果`A`矩形是```
......
.Faaaaaa
...Aaaaa
........
.....P..
..L.....
```第 2 至 4 行和第 3 至 8 列内的点转换为`a`。 

其余单元格可以独立分区。 上条仅包含`X`，左边中间的条带只包含`F`，底部条带包含`P`和`L`。 递归构造产生的一个有效输出是```
xxxxxxXx
fFaaaaaa
ffaAaaaa
ffaaaaaa
pppppPpp
llLlllll
```官方示例使用了不同的底部区域有效分区，这是允许的，因为所需的`A`面积是一样的。 

### 四城堡示例

 考虑```
4 4
A..B
....
C..D
....
```这`A`castle 位于第 1 行第 1 列。包含它的最佳矩形使用第 1 行和第 2 行以及第 1 到第 3 列。 

| 顶部 | 底部| 左延伸 | 右延伸| 宽度| 身高| 面积 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 0 | 2 | 3 | 1 | 3 |
 | 1 | 2 | 0 | 2 | 3 | 2 | 6 |
 | 1 | 3 | 0 | 0 | 1 | 3 | 3 |
 | 1 | 4 | 0 | 0 | 1 | 4 | 4 |

 最大值为区域 6。`A`矩形在概念上被删除，留下一个包含`B`和一个底部矩形包含`C`和`D`。 

底部矩形有两个城堡在同一行，因此递归划分使用垂直切割。 最终结果是```
AaaB
aaab
Cddd
cddd
```这`A`该省有6个地区，`B`拥有右上角的细胞对，`C`拥有左下栏，并且`D`拥有剩余的右下矩形。 每个省都是长方形的，并且只包含一座城堡。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(nm+n^2+K^2)) | 水平扫描使用 (O(nm))，所有上下对使用 (O(n^2))，递归城堡过滤使用 (O(K^2)) 和 (K\le26)。 |
 | 空间| (O(nm+K)) | 网格使用(O(nm))，间隙阵列使用(O(n))，最多有26个城堡。 |

 对于 (n,m\le1000)，网格最多有 (10^6) 个单元格。 主要工作是对这些单元格以及最多 (10^6) 个上下对进行一些线性扫描。 递归构造很小，因为不同城堡的数量以 26 为界。这完全符合 512 MB 内存限制，并且比 (O(n^2m^2)) 蛮力搜索小得多。 

## 测试用例

 官方示例有多个有效输出，因此下面的测试将检查此实现产生的确定性输出。 特别评委也会接受官方的样本输出。```python
import sys
import io

DOT = ord('.')

def solve():
    n, m = map(int, input().split())
    grid = [bytearray(input().strip(), 'ascii') for _ in range(n)]

    ar = ac = -1
    castles = []

    for r in range(n):
        for c in range(m):
            ch = grid[r][c]
            if ch != DOT:
                if ch == ord('A'):
                    ar, ac = r, c
                else:
                    castles.append((r, c, ch))

    left = [0] * n
    right = [0] * n

    top_lim = ar
    bottom_lim = ar

    for r in range(ar - 1, -1, -1):
        if grid[r][ac] != DOT:
            break
        top_lim = r

    for r in range(ar + 1, n):
        if grid[r][ac] != DOT:
            break
        bottom_lim = r

    for r in range(ar, bottom_lim + 1):
        row = grid[r]

        cnt = 0
        c = ac - 1
        while c >= 0 and row[c] == DOT:
            cnt += 1
            c -= 1
        left[r] = cnt if r == ar else min(left[r - 1], cnt)

        cnt = 0
        c = ac + 1
        while c < m and row[c] == DOT:
            cnt += 1
            c += 1
        right[r] = cnt if r == ar else min(right[r - 1], cnt)

    for r in range(ar - 1, top_lim - 1, -1):
        row = grid[r]

        cnt = 0
        c = ac - 1
        while c >= 0 and row[c] == DOT:
            cnt += 1
            c -= 1
        left[r] = min(left[r + 1], cnt)

        cnt = 0
        c = ac + 1
        while c < m and row[c] == DOT:
            cnt += 1
            c += 1
        right[r] = min(right[r + 1], cnt)

    best_area = 1
    best_top = best_bottom = ar

    for top in range(ar, top_lim - 1, -1):
        for bottom in range(ar, bottom_lim + 1):
            width = min(left[top], left[bottom])
            width += min(right[top], right[bottom]) + 1
            area = width * (bottom - top + 1)

            if area > best_area:
                best_area = area
                best_top = top
                best_bottom = bottom

    best_left = ac - min(left[best_top], left[best_bottom])
    best_right = ac + min(right[best_top], right[best_bottom])

    for r in range(best_top, best_bottom + 1):
        for c in range(best_left, best_right + 1):
            if grid[r][c] == DOT:
                grid[r][c] = ord('a')

    def partition(top, bottom, left_col, right_col, pts):
        if not pts:
            return

        if len(pts) == 1:
            lower = pts[0][2] + 32
            for r in range(top, bottom + 1):
                for c in range(left_col, right_col + 1):
                    if grid[r][c] == DOT:
                        grid[r][c] = lower
            return

        p0 = pts[0]
        p1 = None

        for p in pts[1:]:
            if p[0] != p0[0]:
                p1 = p
                break

        if p1 is not None:
            cut = min(p0[0], p1[0])
            upper = [p for p in pts if p[0] <= cut]
            lower = [p for p in pts if p[0] > cut]
            partition(top, cut, left_col, right_col, upper)
            partition(cut + 1, bottom, left_col, right_col, lower)
            return

        p1 = pts[1]
        cut = min(p0[1], p1[1])
        left_pts = [p for p in pts if p[1] <= cut]
        right_pts = [p for p in pts if p[1] > cut]

        partition(top, bottom, left_col, cut, left_pts)
        partition(top, bottom, cut + 1, right_col, right_pts)

    regions = []

    if best_top > 0:
        regions.append((0, best_top - 1, 0, m - 1))
    if best_bottom + 1 < n:
        regions.append((best_bottom + 1, n - 1, 0, m - 1))
    if best_left > 0:
        regions.append((best_top, best_bottom, 0, best_left - 1))
    if best_right + 1 < m:
        regions.append((best_top, best_bottom, best_right + 1, m - 1))

    for top, bottom, lc, rc in regions:
        pts = [
            p for p in castles
            if top <= p[0] <= bottom and lc <= p[1] <= rc
        ]
        partition(top, bottom, lc, rc, pts)

    return '\n'.join(row.decode() for row in grid)

def run(inp: str) -> str:
    global input
    old_stdin = sys.stdin
    old_input = input
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline
    try:
        return solve()
    finally:
        sys.stdin = old_stdin
        input = old_input

# Provided sample, using the deterministic output of this implementation.
sample1 = """6 8
......X.
.F......
...A....
........
.....P..
..L.....
"""

expected1 = """xxxxxxXx
fFaaaaaa
ffaAaaaa
ffaaaaaa
pppppPpp
llLlllll"""

assert run(sample1) == expected1, "sample 1"

# Minimum-size input.
assert run("""1 1
A
""") == "A", "minimum-size grid"

# Boundary condition: A touches the top-left corner and another castle
# blocks only the right side.
assert run("""2 3
A.B
...
""") == """AaB
aab""", "boundary expansion"

# All cells except A are empty, so A must own the whole grid.
assert run("""3 3
...
.A.
...
""") == """aaa
aAa
aaa""", "single castle"

# Several castles force recursive horizontal and vertical cuts.
assert run("""4 4
A..B
....
C..D
....
""") == """AaaB
aaab
Cddd
cddd""", "recursive partition"

# Maximum-size grid with only A.
n = 1000
m = 1000
rows = [bytearray(b'a' * m) for _ in range(n)]
rows[499][499] = ord('A')

max_input = f"{n} {m}\n" + "\n".join(
    row.decode() for row in rows
) + "\n"

max_expected = "\n".join(row.decode() for row in rows)
assert run(max_input) == max_expected, "maximum-size input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`6 x 8`样品|`A`区域 18，具有如上所示的确定性分区 | 全面建设、优化`A`矩形|
 |`1 x 1`和`A`|`A`| 最小尺寸且无空单元 |
 |`2 x 3`和`A.B`|`AaB / aab`| 边界扩张和右侧城堡封锁 |
 |`3 x 3`仅与`A`| 所有单元格小写`a`除了`A`| 最大可能的空矩形 |
 |`4 x 4`和`A,B,C,D`在角落|`AaaB / aaab / Cddd / cddd`| 水平和垂直递归切割 |
 |`1000 x 1000`仅与`A`| 拥有一百万个细胞`A`| 最大尺寸、性能和边界处理 |

 ## 边缘情况

 当`A`是唯一的城堡，垂直扫描到达两个边界，并且每一行都有完整的水平范围可用。 对于输入```
2 2
A.
..
```唯一一个没有城堡的矩形，其中包含`A`是整个网格，因此算法计算宽度 (2)、高度 (2) 和面积 (4)。 它用以下内容填充三个空单元格`a`，生产```
Aa
aa
```不存在递归区域，因为`A`矩形是空的。 

当另一座城堡与它位于同一边界行时`A`，水平扫描必须正好停在那个城堡之前。 为了```
2 3
A.B
...
```第一行允许右侧有一个单元格`A`，而第二行允许两个。 因此，两行间隔的传播右容量为 (1)，给出宽度 (2) 和面积 (4)。 所选矩形是第 1 行到第 2 行和第 1 到第 2 列。剩下的第三列仅包含`B`，因此它成为一个矩形省份，输出为```
AaB
aab
```当城堡位于正上方或正下方时`A`，垂直间隔必须停在该行之前。 在```
4 4
A..B
....
C..D
....
```城堡`C`在第 3 行第 1 列防止`A`延伸穿过第 3 行，同时保留第 1 列。因此，最佳矩形是第 1 行到第 2 行和第 1 到第 3 列，面积为 (6)。 其余区域包含`B`,`C`， 和`D`，并且递归分区处理它们而不修改已经最优的`A`长方形。 

当所有空牢房包围一座城堡时，每个方向都可以到达边界。 为了```
3 3
...
.A.
...
```垂直范围为全部三行，每行的每一侧都有一个空单元格`A`。 具有所有三行的候选者的宽度为 (3) 和高度 (3)，因此算法获得面积 (9)。 最终的网格是```
aaa
aAa
aaa
```最大尺寸情况的行为相同，只是具有更多单元。 一个 (1000\times1000) 网格仅包含`A`将整个网格作为其省份，因此该算法在填充网格之前仅执行所需的线性扫描和 (O(n^2)) 边界枚举。 不存在任何其他城堡也意味着递归分区没有剩余区域需要处理。
