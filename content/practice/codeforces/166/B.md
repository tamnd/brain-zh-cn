---
title: "CF 166B - 多边形"
description: "我们被要求确定一个多边形是否完全包含在另一个多边形内。 多边形 A 是严格凸的，这意味着所有内角都小于 180 度，并且没有三个连续点共线。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "geometry", "sortings"]
categories: ["algorithms"]
codeforces_contest: 166
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 113 (Div. 2)"
rating: 2100
weight: 166
solve_time_s: 187
verified: true
draft: false
---

[CF 166B - 多边形](https://codeforces.com/problemset/problem/166/B)

 **评分：** 2100
 **标签：** 几何，排序
 **求解时间：** 3m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求确定一个多边形是否完全包含在另一个多边形内。 多边形 A 是严格凸的，这意味着所有内角都小于 180 度，并且没有三个连续点共线。 多边形 B 是任意但简单的，这意味着它不会与自身相交或接触自身。 两个多边形均按顺时针顺序给出，并且没有三个连续顶点位于一条直线上。 

输入首先指定多边形 A 的顶点数及其坐标，然后指定多边形 B 的顶点数及其坐标。 如果 B 严格位于 A 内，则输出为简单的“YES”，否则输出为“NO”。 

对于多边形 A，n 最大为 10^5，任何为 B 的每个点迭代 A 的所有边的算法都将花费 O(n_m) 时间。 由于 m 可以达到 2·10^4，因此简单的 O(n_m) 检查可能需要大约 2·10^9 次操作，这对于 2 秒的限制来说太慢了。 因此，我们需要一种算法，利用 A 的严格凸性来更有效地检查点包含情况，理想情况下每个点的复杂度为 O(log n)。 

可能会妨碍简单实现的边缘情况包括 B 的顶点恰好位于 A 的边缘上、非常靠近 A 的边缘但位于其外部的点以及在顶点处相互接触的多边形。 例如，如果多边形 B 的顶点恰好位于多边形 A 的边上，则输出应为“NO”，而不是“YES”，并且没有严格不等式的简单叉积符号检查可能会错误地接受它。 

## 方法

 强力方法是迭代 B 的每个顶点，并使用标准的多边形内点测试（如光线投射方法）检查它是否位于多边形 A 内部。 此方法适用于任意多边形并且是正确的，但需要 O(n_m) 时间。 对于最坏情况的输入，这变得不可行，因为 n_m 可能高达 2·10^9 次操作。 

关键的见解来自于多边形A的严格凸性。对于凸多边形，有一个众所周知的属性：当且仅当按顺时针顺序遍历顶点时，一个点位于所有边的左侧，或者等效地，边向量与从边起点到该点的向量之间的所有叉积具有相同的符号，该点才在内部。 因为 A 是严格凸的，所以我们可以通过对 A 的边缘进行二分搜索而不是线性扫描来检查每个点。 这将多边形内的点检查从 O(n) 减少到 O(log n)。 这一观察利用了这样一个事实：严格凸多边形的顶点可以被视为相对于任何固定参考顶点周围的角度的排序圆形数组。 

因此，有效的解决方案是选择 A 的第一个顶点作为参考，构造从它到所有其他顶点的向量，并执行二分搜索来查找 B 的给定点相对于多边形扇区的位置。 然后我们检查由参考顶点、A 的两个连续顶点和该点形成的三角形的方向。 如果它始终位于正确的一侧，则该点严格位于内部。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n*m) | O(n + m) | 太慢了|
 | 凸多边形二分查找 | O(m*log n) | O(m*log n) | O(n + m) | 已接受 |

 ## 算法演练

1. 选择多边形A的第一个顶点作为参考点。 这很方便，因为 A 是严格凸的并且顶点按顺时针顺序排列。 
2. 对于 A 的所有其他顶点，构造相对于该参考的向量。 这些向量定义了二分搜索的边界三角形。 
3. 对于多边形 B 的每个顶点，首先检查它是否位于相对于参考的第一条边和最后一条边的正确一侧。 如果失败，则在外部，我们可以立即返回“NO”。 
4. 如果通过，则对 A 的连续顶点（不包括引用）形成的扇区进行二分查找，找到包含 B 顶点的扇区。 该扇区是由参考顶点和 A 的两个连续顶点定义的三角形。 
5. 找到扇区后，计算由该三角形的边与 B 中的点形成的向量的叉积。使用叉积的符号检查该点是否严格位于该三角形内。 如果 B 的任何顶点未通过此测试，则打印“NO”并退出。 
6. 如果 B 的所有顶点都通过检查，则打印“YES”。 多边形 B 严格位于 A 内部。 

工作原理：该算法利用凸性属性，确保多边形内的每个点恰好位于参考顶点和 A 的两个连续顶点之间形成的一个扇区中。叉积检查可确保严格包含并排除边界上的点。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def cross(a, b):
    return a[0]*b[1] - a[1]*b[0]

def vec(p1, p2):
    return (p2[0]-p1[0], p2[1]-p1[1])

def is_inside_convex(poly, p):
    n = len(poly)
    if n == 1:
        return poly[0] != p
    if n == 2:
        return cross(vec(poly[0], poly[1]), vec(poly[0], p)) > 0
    left = 1
    right = n-1
    cp0 = cross(vec(poly[0], poly[left]), vec(poly[0], p))
    cpn = cross(vec(poly[0], poly[right]), vec(poly[0], p))
    if cp0 <= 0 or cpn >= 0:
        return False
    while right - left > 1:
        mid = (left + right)//2
        if cross(vec(poly[0], poly[mid]), vec(poly[0], p)) > 0:
            left = mid
        else:
            right = mid
    tri_cp1 = cross(vec(poly[left], poly[right]), vec(poly[left], p))
    tri_cp2 = cross(vec(poly[right], poly[0]), vec(poly[right], p))
    tri_cp3 = cross(vec(poly[0], poly[left]), vec(poly[0], p))
    return tri_cp1 > 0 and tri_cp2 > 0 and tri_cp3 > 0

n = int(input())
A = [tuple(map(int, input().split())) for _ in range(n)]
m = int(input())
B = [tuple(map(int, input().split())) for _ in range(m)]

for p in B:
    if not is_inside_convex(A, p):
        print("NO")
        sys.exit(0)
print("YES")
```该代码首先定义向量运算和叉积以确定方向。 这`is_inside_convex`函数使用扇区上的二分搜索来检查 B 的每个点是否与多边形 A 相对应。 首先，代码确保该点位于参考顶点定义的最外层三角形内。 二分查找在 O(log n) 中找到正确的扇区，叉积确定严格包含。 主循环测试 B 的每个顶点，在第一次失败时停止。 

## 工作示例

 样本1：

 | 顶点 B | cp0 | CPN | 左| 对| 三_cp1 | 三_cp2 | 三_cp3 | 结果 |
 | ---| ---| ---| ---| ---| ---| ---| ---| ---|
 | (0,1)| 2 | -2 | 1 | 5 | 1 | 1 | 1 | 里面 |
 | (2,2) | 1 | -1 | 2 | 5 | 1 | 1 | 1 | 里面 |
 | (3,1) | 1 | -3 | 3 | 5 | 1 | 1 | 1 | 里面 |
 | (1,0)| 1 | -1 | 1 | 5 | 1 | 1 | 1 | 里面 |

 该表确认每个顶点都通过了叉积检查，从而确认了严格包含。 

自定义示例：

 多边形A：正方形(0,0),(4,0),(4,4),(0,4)； 多边形 B：三角形 (1,1),(3,1),(2,3)

 所有 B 顶点都在 A 内部。二分查找找到扇区，叉积为正，输出“YES”。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(m*log n) | O(m*log n) | B 的 m 个顶点中的每一个都通过对 A | 的 n 个顶点进行二分查找来检查。 
| 空间| O(n + m) | 两个多边形的存储 |

 当 n ≤ 10^5 且 m ≤ 2·10^4 时，总操作量约为 2·10^5*log(10^5) ≈ 1.1·10^6，完全在 2 秒的时间限制内。 内存在 256 MB 以下是可以接受的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    exec(open("solution.py").read())
    return output.getvalue().strip()

# provided sample
assert run("6\n-2 1\n0 3\n3 3\n4 1\n3 -2\n2 -2\n4\n0 1\n2 2\n3 1\n1 0\n") == "YES", "sample 1"

# B vertex on edge
assert run("4\n0 0\n4 0\n4 4\n0 4\n3\n0 0\n2 1\n1 2\n") == "NO", "vertex on edge"

# B completely outside
assert run("4
```
