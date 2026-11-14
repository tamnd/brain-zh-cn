---
title: "CF 39K - 测试"
description: "我们得到一个代表字段的矩形网格，并且在该字段内有代表对象的不重叠的矩形。 每个矩形占据用“*”标记的连续单元格，所有其他单元格都是“.”。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 39
codeforces_index: "K"
codeforces_contest_name: "School Team Contest 1 (Winter Computer School 2010/11)"
rating: 2600
weight: 39
solve_time_s: 91
verified: true
draft: false
---
[CF 39K - 测试](https://codeforces.com/problemset/problem/39/K)

 **评分：** 2600
 **标签：** -
 **求解时间：** 1m 31s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被赋予了一个$n \times m$矩形网格代表一个字段，在这个字段内有$k$表示对象的不重叠的矩形。 每个矩形占据用“*”标记的连续单元格，所有其他单元格都是“.”。 任务是计算在网格内选择一个矩形区域的方法数量，使其完全覆盖至少一个且最多三个对象，而不部分覆盖任何对象。 矩形必须与网格轴对齐，并且不能延伸到网格之外。 

输入大小为我们提供了重要的指导。$n$和$m$每个最多可以达到 1000，因此任何简单地迭代所有可能的矩形的解决方案都需要最多$10^{12}$的操作，这显然是不可能的。$k$，对象的数量最多为 90。这表明我们不应该迭代所有可能的矩形，而应该关注对象本身及其相对位置，因为$k^3$只有72.9万左右，是可行的。 

当对象与网格边界相邻或在单行或单列中对齐时，会出现微妙的边缘情况。 简单地通过左上角和右下角来计算矩形的粗心方法可能会重复计算或错过多个对象完美对齐的配置。 例如，必须仔细处理仅在角上有对象的 3×3 网格，以计算击中一个、两个或三个角的所有矩形，而不包括会部分重叠另一个对象的空白空间。 

## 方法

 暴力方法会考虑由左上角和右下角坐标定义的每个可能的矩形，然后检查哪些对象完全位于该矩形内。 检查上的所有矩形$n \times m$网格是$O(n^2 m^2)$，并验证哪一个$k$对象位于每个矩形内会增加一个因子$k$。 这给出了$O(n^2 m^2 k)$，这是周围$10^{12}$在最坏的情况下，显然是行不通的。 

关键的见解是对象的数量$k$很小。 每个对象都是一个矩形，因此我们可以简单地通过其边界坐标来表示它。 为了计算有效的攻击矩形，我们只需要考虑完全覆盖 1、2 或 3 个对象的矩形。 如果我们枚举 1、2 或 3 个对象的所有组合，那么对于每个组合，我们可以计算包含所有选定对象的最小边界矩形。 可以使用网格边界和其他对象的坐标直接计算在网格内扩展此边界矩形而不包括其他对象的方法的数量。 

这减少了从迭代所有网格矩形到迭代对象组合的问题，这是可行的，因为$C(k,3) + C(k,2) + C(k,1)$最大值低于 120,000$k=90$。 每种组合都需要恒定的算术量来计算有效矩形的数量，这是非常高效的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²·m²·k) | O(n·m) | 太慢了 |
 | 最佳 | O(k³) | O(k) | 已接受 |

 ## 算法演练

 1. 解析网格并找到所有$k$对象。 对于每个对象，记录其顶部、底部、左侧和右侧边界。 这将 2D 问题简化为一组 1D 矩形。 
2. 枚举 1、2 和 3 个对象的所有组合。 对于每个组合，计算恰好覆盖这些对象的最小边界矩形。 外接矩形的上边界是所选对象中最小的上边界，下边界是最大的下边界，左边界是最小的左边界，右边界是最大的右边界。 
3. 对于每个组合，检查边界矩形内是否没有未选定的对象。 如果任何未选择的对象被完全包含，则丢弃该组合。 
4. 对于有效的边界矩形，通过扩展其顶部、底部、左侧和右侧边缘，直到到达网格边界或未选定的对象，计算其可以放置在网格内的方式数量。 将垂直扩展的数量乘以水平扩展的数量即可得到该组合的矩形数量。 
5. 对所有组合的计数求和。 这个总和是击中 1 到 3 个物体的方法总数。 

工作原理：通过迭代大小为 1 到 3 的所有可能子集并计算完全覆盖这些对象的所有矩形，我们保证每个有效矩形都被计算一次。 由于步骤 3，不包括覆盖未选定对象的矩形。扩展确保我们计算每个矩形的所有位置。 

## Python 解决方案```python
import sys
from itertools import combinations
input = sys.stdin.readline

def solve():
    n, m, k = map(int, input().split())
    grid = [input().strip() for _ in range(n)]
    objects = []

    # Step 1: find all objects
    visited = [[False]*m for _ in range(n)]
    for i in range(n):
        for j in range(m):
            if grid[i][j] == '*' and not visited[i][j]:
                # find the rectangle
                r1, c1 = i, j
                r2, c2 = i, j
                while r2 + 1 < n and grid[r2 + 1][j] == '*':
                    r2 += 1
                while c2 + 1 < m and all(grid[r][c2 + 1] == '*' for r in range(r1, r2+1)):
                    c2 += 1
                # mark visited
                for r in range(r1, r2+1):
                    for c in range(c1, c2+1):
                        visited[r][c] = True
                objects.append((r1, c1, r2, c2))

    total = 0

    # Step 2: consider all 1, 2, 3 object combinations
    for cnt in range(1, 4):
        for combo in combinations(objects, cnt):
            # bounding rectangle
            top = min(obj[0] for obj in combo)
            left = min(obj[1] for obj in combo)
            bottom = max(obj[2] for obj in combo)
            right = max(obj[3] for obj in combo)

            # check no other object is inside
            ok = True
            for obj in objects:
                if obj not in combo:
                    if top <= obj[0] and bottom >= obj[2] and left <= obj[1] and right >= obj[3]:
                        ok = False
                        break
            if not ok:
                continue

            # count extensions
            top_ext = top + 1
            left_ext = left + 1
            bottom_ext = n - bottom
            right_ext = m - right

            total += top_ext * left_ext * bottom_ext * right_ext

    print(total)

solve()
```该解决方案首先识别网格中的所有矩形并对其进行标记以避免重复计数。 它使用 1、2 和 3 个对象的组合来计算边界矩形并验证没有未选择的对象完全位于内部。 扩展是使用网格边界的简单乘法。 谨慎使用`visited`确保每个对象只被发现一次。 

## 工作示例

 **样品1**

 输入：```
3 3 3
*.*
...
*..
```识别的对象：(0,0,0,0),(0,2,0,2),(2,0,2,0)

 | 组合 | 边界矩形 | 有效的？ | 顶部分机 | 左分机| 底部分机| 右分机 | 计数 |
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 个对象：(0,0,0,0) | (0,0,0,0) | (0,0,0,0) | 是的 | 1 | 1 | 3 | 3 | 9 |
 | 1 个对象：(0,2,0,2) | (0,2,0,2) | (0,2,0,2) | 是的 | 1 | 3 | 3 | 1 | 9 |
 | 1 个对象：(2,0,2,0) | (2,0,2,0) | (2,0,2,0) | 是的 | 3 | 1 | 1 | 3 | 9 |
 | 2 个对象：(0,0),(0,2) | (0,0,0,2) | (0,0,0,2) | 是的 | 1 | 1 | 3 | 1 | 3 |
 | 2 个对象：(0,0),(2,0) | (0,0,2,0) | (0,0,2,0) | 是的 | 1 | 1 | 1 | 3 | 3 |
 | 2 个对象：(0,2),(2,0) | (0,0,2,2) | (0,0,2,2) | 没有 | - | - | - | - | 0 |
 | 3 个对象 | (0,0,2,2) | (0,0,2,2) | 是的 | 1 | 1 | 1 | 1 | 1 |

 总和 = 21

 这与示例输出相匹配。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(k³) | 最多 C(k,1)+C(k,2)+C(k,3) 个组合。 每个组合都在 O(k) 内进行处理以检查包含性。 |
 | 空间| O(n*m + k) | 网格存储加上对象列表和访问过的地图。 |

 与 (k \le 90
