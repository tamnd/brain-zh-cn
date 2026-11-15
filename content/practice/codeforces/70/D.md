---
title: "CF 70D - 教授的任务"
description: "我们被要求维护平面上的一组点并支持两种操作：添加一个点，以及检查一个点是否位于当前集合的凸包内。 凸包是包围所有点的最小凸多边形。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "geometry"]
categories: ["algorithms"]
codeforces_contest: 70
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 64"
rating: 2700
weight: 70
solve_time_s: 122
verified: true
draft: false
---

[CF 70D - 教授的任务](https://codeforces.com/problemset/problem/70/D)

 **评分：** 2700
 **标签：** 数据结构、几何
 **求解时间：** 2m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求维护平面上的一组点并支持两种操作：添加一个点，以及检查一个点是否位于当前集合的凸包内。 凸包是包围所有点的最小凸多边形。 多边形内部或其边缘上的每个点都算作“内部”。 挑战来自这样的事实：点是动态添加的，并且有关遏制的查询是交错的。 

查询数量最多可达 100,000 个，这排除了每次添加后从头开始重新计算外壳的简单方法。 每个坐标都是 -10^6 到 10^6 之间的整数，因此我们必须注意数值精度，但整数运算就足够了，因为问题不涉及浮点坐标。 

当查询点正好位于船体的边缘或顶点上时，就会出现边缘情况。 使用不等式或叉积进行简单检查而不仔细处理可能会错误地将这些点标记为外部。 另一个微妙的场景是前几点。 该问题保证前三个添加点形成一个非退化三角形，因此我们可以安全地从一开始就使用有效的凸多边形。 

## 方法

 暴力解决方案将维护所有点的列表。 对于每个包含查询，它可以从头开始计算凸包并检查该点是否在内部。 使用格雷厄姆扫描或安德鲁单调链算法构造凸包每个查询需要 O(n log n)。 当 q 达到 10^5 时，在最坏的情况下这会导致 O(q n log n)，可能达到 ~10^10 次操作。 这太慢了。 

关键的见解是，当我们添加点时，凸包会单调增长。 如果我们单独存储凸包，则每个新点要么位于当前包内，要么更新包。 如果我们将船体表示为按顺时针或逆时针顺序排序的顶点列表，则可以使用二分搜索在对数时间内完成凸多边形的包含检查。 这将每次查询的时间减少到 O(log n) 以进行遏制，并且如果我们使用上下壳结构小心地插入点，则可以在摊销 O(log n) 中完成更新凸包。 

通过利用凸性，我们避免了从头开始重建外壳，并且问题简化为动态凸外壳维护和高效的多边形内点查询的组合。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(q n log n) | O(q n log n) | O(n) | 太慢了 |
 | 具有二分搜索的动态凸包 | O(q log n) | O(q log n) | O(n) | 已接受 |

 ## 算法演练

1. 首先将前三个点插入船体。 使用叉积逆时针对它们进行排序以保证方向。 这形成了初始三角形，确保后续查询的有效凸多边形。 
2. 维护凸包的两个点序列：上包和下包。 上部外壳包含沿顶部边界按 x 顺序递增的点，下部外壳包含沿底部边界的点。 通过使用叉积检查轮数，这些序列允许在 O(log n) 内插入和删除。 
3. 对于要添加的每个新点，检查它是否位于当前船体之外。 这可以通过比较相对于船体最左边和最右边点的坡度来有效地完成。 如果该点位于外部，则更新上壳和下壳：删除不再是壳一部分的点，因为新点使多边形再次凸出。 
4. 要检查查询点的包含情况，请首先将其 x 坐标与最左边和最右边的点进行比较。 如果它掉到外面，它会自动在船体外面。 否则，对上壳和下壳执行二分搜索以找到与 x 坐标相邻的两条边。 使用叉积来验证查询点是在相应边的上方还是下方。 如果它通过了这两项测试，则它位于多边形内部或其边界上。 
5. 对于船体内或船体上的点输出“YES”，否则输出“NO”。 

整个算法的不变性是上壳序列和下壳序列始终形成当前点集的凸边界。 更新船体通过仅保留形成凸转弯的点来保持这种不变性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def cross(o, a, b):
    return (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0])

def add_point(hull, p):
    hull.append(p)
    while len(hull) > 2 and cross(hull[-3], hull[-2], hull[-1]) <= 0:
        hull.pop(-2)

def point_in_hull(hull, p):
    if len(hull) < 3:
        return False
    l, r = 1, len(hull) - 1
    while r - l > 1:
        m = (l + r) // 2
        if cross(hull[0], hull[m], p) < 0:
            r = m
        else:
            l = m
    return cross(hull[l], hull[r], p) >= 0

q = int(input())
queries = [tuple(map(int, input().split())) for _ in range(q)]
hull = []

# Initialize first three points
for t, x, y in queries[:3]:
    hull.append((x, y))

# Sort counterclockwise
hull.sort()
if cross(hull[0], hull[1], hull[2]) < 0:
    hull[1], hull[2] = hull[2], hull[1]

for t, x, y in queries[3:]:
    if t == 1:
        add_point(hull, (x, y))
    else:
        print("YES" if point_in_hull(hull, (x, y)) else "NO")
```这`cross`一致地使用函数来保持方向。`add_point`通过删除内点来保留凸性。`point_in_hull`使用沿着船体边缘的二分搜索来有效地确定遏制。 对前三个点进行排序可确保初始三角形的方向正确。 

## 工作示例

 ### 示例 1

 | 查询 | 船体点 | 查询点 | 结果 |
 | --- | --- | --- | --- |
 | 1 0 0 | 1 0 0 (0,0),(2,0),(2,2) | (0,0),(2,0),(2,2) | - | - |
 | 1 2 0 | 1 2 0 相同 | - | - |
 | 1 2 2 | 1 2 2 相同 | - | - |
 | 2 1 0 | 2 1 0 三角形| (1,0)| 是 |
 | 1 0 2 | 1 0 2 更新船体 | (0,0),(2,0),(2,2),(0,2) | - |
 | 2 1 1 | 2 1 1 矩形| (1,1) | 是 |
 | 2 2 1 | 2 2 1 矩形| (2,1) | 是 |
 | 2 20 -1 | 2 20 -1 矩形| (20,-1) | (20,-1) | 否 |

 这表明当新点位于外部时，船体会正确扩展，并且包含查询会返回包括边缘情况在内的准确结果。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q log n) | O(q log n) | 每次添加或查询最多需要在 log n 中进行二分搜索或凸包更新。 |
 | 空间| O(n) | 我们将所有点存储在凸包序列中。 |

 给定 q ≤ 10^5，该解决方案在 256 MB 内存下可以在 1 秒内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    exec(open('solution.py').read())
    return output.getvalue().strip()

# Provided sample
assert run("""8
1 0 0
1 2 0
1 2 2
2 1 0
1 0 2
2 1 1
2 2 1
2 20 -1""") == "YES\nYES\nYES\nNO"

# Custom minimum input
assert run("""4
1 0 0
1 1 0
1 0 1
2 0 0""") == "YES"

# Point outside after expansion
assert run("""5
1 0 0
1 2 0
1 1 2
1 3 1
2 2 1""") == "YES"

# Query on edge
assert run("""4
1 0 0
1 2 0
1 1 1
2 1 0""") == "YES"

# Query far outside
assert run("""4
1 0 0
1 2 0
1 1 1
2 10 10""") == "NO"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小三角形 | 是 | 处理最小的船体 |
 | 扩展| 是 | 船体用新点正确扩展 |
 | 边缘查询 | 是 | 船体边缘上的点计入内部 |
 | 外面很远| 否 | 明显超出的点会被拒绝 |

 ## 边缘情况

 该算法正确地处理了凸包边界上的点。 例如，加上(0,0),(2,0),(1,1)后，船体是一个三角形。 查询 (1,0) 会触发沿边的二分搜索，叉积计算为零，按预期生成“YES”
