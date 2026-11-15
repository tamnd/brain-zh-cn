---
title: "CF 474C - 土拨鼠船长"
description: "我们被要求帮助土拨鼠船长组织他的鼹鼠军团，使每组四人在平面上形成一个完美的正方形。 每个摩尔从一个位置（xi，yi）开始，并在（ai，bi）有一个“家”。"
date: "2026-05-30T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "geometry"]
categories: ["algorithms"]
codeforces_contest: 474
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 271 (Div. 2)"
rating: 2000
weight: 474
solve_time_s: 72
verified: true
draft: false
---

[CF 474C - 土拨鼠船长](https://codeforces.com/problemset/problem/474/C)

 **评级：** 2000
 **标签：** 蛮力，几何
 **求解时间：** 1m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求帮助土拨鼠船长组织他的鼹鼠军团，使每组四人在平面上形成一个完美的正方形。 每颗痣都从一个位置开始`(xi, yi)`并有一个“家”`(ai, bi)`。 唯一允许的操作是使鼹鼠绕其所在位置逆时针旋转 90 度。 每次轮换算一次移动，目标是最小化每个团形成一个正方形所需的总移动次数。 

输入包括`n`团，每个团有 4 个鼹鼠，所以我们总共有`4*n`痣。 坐标范围从`-10^4`到`10^4`。 给定`n`最多可以有100个，我们最多有400个摩尔。 输出是每个团的最小移动次数，如果不可能形成正方形，则输出为 -1。 

边缘情况包括所有摩尔都位于同一位置、无法形成非简并正方形的情况，或者同一摩尔需要多次旋转的情况。 仅检查每个摩尔一次固定旋转的简单方法可能会失败，因为我们需要探索每个摩尔的所有 0-3 个旋转，并找到以最少的移动形成正方形的组合。 

## 方法

 蛮力方法很简单：对于每个团，尝试对所有四个鼹鼠进行所有可能的旋转（0、90、180、270 度）。 由于每个鼹鼠有 4 个选项，因此每个团有 4^4 = 256 种组合。 对于每个组合，我们检查四个结果点是否形成一个正方形。 考虑到约束 n ≤ 100，这是可行的，因为总共 256 * 100 = 25,600 次检查。 

优化的关键见解是认识到每个团 256 个组合足够小，无需进一步修剪。 主要工作是有效地检查四个点是否形成一个正方形。 正方形具有相等的边长和相等的对角线。 我们可以使用平方距离来避免精度误差，而不是计算角度或使用浮点。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * 4^4) | O(n * 4^4) | O(1) | O(1) | 已接受 |
 | 最佳| O(n * 4^4) | O(n * 4^4) | O(1) | O(1) | 已接受 |

 最佳方法本质上是使用整数算术仔细实施的强力方法来检查平方。 

## 算法演练

 1.读取团数`n`。 
2. 对于每个团，读取四个鼹鼠的位置和家乡坐标。 
3. 对于每个鼹鼠，预先计算其绕其原点旋转 0、1、2 或 3 圈后的四个可能位置。 旋转公式为`(x, y)`旋转`(a, b)`逆时针90度：`(a - (y-b), b + (x-a))`。 
4. 生成所有 4^4 = 256 种旋转组合，每摩尔一种。 跟踪每个组合的总移动量（所用旋转的总和）。 
5. 对于每个组合，检查所得的四个点是否形成非退化正方形：

 - 计算所有成对平方距离。 应该正好有两个唯一的距离：较小的是边，较大的是对角线。 
- 确保对角线距离恰好出现两次，边距恰好出现四次，并且边距 > 0。 
6. 跟踪所有有效方块组合的最小总移动量。 如果不存在有效组合，则为该团输出 -1。 
7. 打印所有团的结果。 

为什么它有效：通过生成所有可能的旋转并检查每个组合，我们保证如果正方形配置是可能的，我们就会找到它。 使用平方距离可确保正确性，而不会出现浮点错误。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from itertools import product
from collections import Counter

def rotate_90(x, y, a, b):
    # rotate (x, y) 90 degrees CCW around (a, b)
    return a - (y - b), b + (x - a)

def is_square(points):
    dists = []
    for i in range(4):
        for j in range(i+1, 4):
            dx = points[i][0] - points[j][0]
            dy = points[i][1] - points[j][1]
            dists.append(dx*dx + dy*dy)
    count = Counter(dists)
    if len(count) != 2:
        return False
    side, diag = sorted(count.keys())
    return count[side] == 4 and count[diag] == 2 and side > 0

n = int(input())
results = []
for _ in range(n):
    moles = [tuple(map(int, input().split())) for _ in range(4)]
    rotations = []
    for x, y, a, b in moles:
        r = [(x, y)]
        for _ in range(3):
            x, y = rotate_90(x, y, a, b)
            r.append((x, y))
        rotations.append(r)
    min_moves = float('inf')
    for choice in product(range(4), repeat=4):
        points = [rotations[i][choice[i]] for i in range(4)]
        moves = sum(choice)
        if is_square(points):
            min_moves = min(min_moves, moves)
    results.append(-1 if min_moves == float('inf') else min_moves)

for res in results:
    print(res)
```该代码首先计算每个摩尔的所有可能位置，然后使用迭代所有旋转组合`itertools.product`。 这`is_square`函数通过使用平方距离确保我们正确识别正方形而没有精度误差。 跟踪每个团的最小移动量，如果配置不起作用，则返回 -1。 

## 工作示例

 对于第一个样本输入，第一个团的轮换产生可能的位置：

 | 鼹鼠 | 0° | 90°| 180° | 270° |
 | --- | --- | --- | --- | --- |
 | 1 | (1,1) | (-1,1) | (-1,1) | (-1,-1) | (-1,-1) | (1,-1) | (1,-1) |
 | 2 | (-1,1) | (-1,1) | (-1,-1) | (-1,-1) | (1,-1) | (1,-1) | (1,1) |
 | 3 | (-1,1) | (-1,1) | (-1,-1) | (-1,-1) | (1,-1) | (1,-1) | (1,1) |
 | 4 | (1,-1) | (1,-1) | (1,1) | (-1,1) | (-1,1) | (-1,-1) | (-1,-1) |

 尝试组合`(0,1,0,0)`产生积分`(1,1)`,`(-1,-1)`,`(-1,1)`,`(1,-1)`，形成一个正方形。 步数之和为 1。没有任何组合会产生更少的步数。 

对于第二团，任何轮换组合都不会产生形成正方形的四个点。 所有尝试都会产生共线点或零面积配置，因此输出为 -1。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * 4^4) | O(n * 4^4) | 每个团有 4 名摩尔，有 4 种轮换选择 → 256 种组合； n ≤ 100，因此 256*100 = 25,600 个检查。 检查每个组合的距离需要 O(6)。 |
 | 空间| 每个团 O(4*4) | 每摩尔存储 4 个位置，进行 4 次旋转； 持续的额外内存。 |

 鉴于操作总数较低（~25k）和较小的数据结构，这完全符合 1 秒的时间限制。 

## 测试用例```python
import sys, io
def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline
    from itertools import product
    from collections import Counter

    def rotate_90(x, y, a, b):
        return a - (y - b), b + (x - a)

    def is_square(points):
        dists = []
        for i in range(4):
            for j in range(i+1, 4):
                dx = points[i][0] - points[j][0]
                dy = points[i][1] - points[j][1]
                dists.append(dx*dx + dy*dy)
        count = Counter(dists)
        if len(count) != 2:
            return False
        side, diag = sorted(count.keys())
        return count[side] == 4 and count[diag] == 2 and side > 0

    n = int(input())
    results = []
    for _ in range(n):
        moles = [tuple(map(int, input().split())) for _ in range(4)]
        rotations = []
        for x, y, a, b in moles:
            r = [(x, y)]
            for _ in range(3):
                x, y = rotate_90(x, y, a, b)
                r.append((x, y))
            rotations.append(r)
        min_moves = float('inf')
        for choice in product(range(4), repeat=4):
            points = [rotations[i][choice[i]] for i in range(4)]
            moves = sum(choice)
            if is_square(points):
                min_moves = min(min_moves, moves)
        results.append(-1 if min_moves == float('inf') else min_moves)

    return "\n".join(map(str, results))

# Provided sample
assert run("""4
1 1 0 0
-1 1 0 0
-1 1 0
```
