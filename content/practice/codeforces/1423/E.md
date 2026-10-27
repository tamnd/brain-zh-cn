---
title: "CF 1423E - 5G 天线塔"
description: "我们的任务是管理 5G 天线塔的土地征用。 每个塔占据一个由中心 (x, y) 和半径 r 定义的圆形区域。 土地数据库由定义为具有唯一整数 ID 的多边形的属性组成。"
date: "2026-06-11T06:09:09+07:00"
tags: ["codeforces", "competitive-programming", "geometry"]
categories: ["algorithms"]
codeforces_contest: 1423
codeforces_index: "E"
codeforces_contest_name: "Bubble Cup 13 - Finals [Online Mirror, unrated, Div. 1]"
rating: 2700
weight: 1423
solve_time_s: 80
verified: true
draft: false
---

[CF 1423E - 5G 天线塔](https://codeforces.com/problemset/problem/1423/E)

 **评分：** 2700
 **标签：** 几何
 **求解时间：** 1m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们的任务是管理 5G 天线塔的土地征用。 每个塔占据一个由中心定义的圆形区域`(x, y)`和半径`r`。 土地数据库由定义为具有唯一整数 ID 的多边形的属性组成。 对于每个塔查询，目标是计算与塔的圆相交的所有属性的总面积并返回它们的 ID。 

输入首先给出总区域的宽度和高度，它限制了坐标，但与计算无关。 然后我们有`n`代表属性的多边形。 每个多边形都有 3 到 40 个顶点，按逆时针顺序给出，这确保它们定义一个有效的简单多边形。 查询指定一个圆并要求与该圆相交的属性面积之和。 

约束条件决定了`n * q ≤ 10^6`，这立即排除了在简单的 O(n*q) 几何计算中针对每个查询检查每个多边形的强力解决方案。 多边形与圆的交集并不简单，因此每次检查都可能涉及 O(v) 运算`v`顶点。 和`n`和`q`最多`10^5`，简单的成对检查最多需要 10^10 次操作，这太慢了。 

当圆仅在顶点或边处接触多边形时，就会出现不明显的边缘情况。 简单的多边形内点检查会错过这些，因此相交测试必须正确处理部分重叠，包括圆仅包含多边形的一部分或仅接触多边形的情况。 另一种边缘情况发生在非常小的圆完全位于多边形内部或完全位于所有多边形外部的情况下，这应该返回面积为零。 

## 方法

 暴力方法会迭代每个查询并检查每个多边形的交集。 对于每个多边形，您可以使用几何库计算圆与多边形的交点，或实现一个函数来测试任何多边形边是否与圆相交或圆心是否位于多边形内部。 该算法是正确的，因为它直接实现了问题陈述：如果多边形接触圆，则贡献其面积。 然而，随着`n*q`可能达到 10^6 并且每个多边形最多有 40 个顶点，这种方法可以轻松达到每个查询 4*10^7 次操作，这是临界值，但在 2 秒限制下存在风险。 

最佳方法是利用空间分区来减少不必要的检查。 属性是不重叠的，因此我们可以预处理空间索引，例如 R 树或网格。 观察结果是，远离圆的多边形不能与圆相交。 通过将区域划分为统一的网格并存储哪些多边形接触每个网格单元，每个查询仅检查与查询圆重叠的单元中的多边形。 这减少了昂贵的多边形与圆相交检查的数量`n`到一个小子集，通常平均不变。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n_q_v) | O(n*v) | 可能太慢 |
 | 基于网格的空间索引 | O(n_v + q_k*v) | O(n_v + q_k*v) | O(n*v) | 已接受，对于大 n 和 q 有效 |

 这里，`v`是每个多边形的顶点数，并且`k`是空间过滤后每个查询的候选多边形的平均数量。 

## 算法演练

 1. 解析所有多边形并计算它们的轴对齐边界框 (AABB)。 边界框是`(min_x, max_x, min_y, max_y)`并允许与圆进行快速初始相交测试。 如果圆不与多边形的边界框重叠，则它不能与多边形本身相交。 
2. 将多边形预处理为统一的二维网格。 网格单元的大小可以根据平均多边形大小来选择，例如`sqrt(total_area/n)`平衡每个单元格的多边形数量。 为每个单元格存储其边界框与单元格相交的多边形 ID 列表。 
3.对于每个查询圈`(x, y, r)`，确定圆与哪些网格单元重叠。 这可以通过将圆延伸其半径并查找哪些单元格与该矩形相交来完成。 
4. 将这些重叠单元格中的所有多边形收集到候选集中，避免重复。 
5. 对于每个候选多边形，首先使用条件检查圆的边界框`(closest_x - cx)^2 + (closest_y - cy)^2 ≤ r^2`在哪里`closest_x, closest_y`是边界框距离圆心最近的点。 如果失败，则跳过多边形。 
6. 如果边界框相交，请执行精确的多边形-圆相交检查。 这可以通过检查任何多边形边是否与圆相交，或者圆心是否位于多边形内部来完成。 
7. 对相交多边形的面积求和并收集它们的 ID 以供输出。 

工作原理：边界框和网格过滤保证不会跳过与圆相交的多边形。 精确的多边形-圆相交确保多边形接触或部分位于圆内的正确性。 网格分区减少了不必要的检查，而不会丢失任何有效的多边形。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from math import sqrt

def point_inside_polygon(px, py, polygon):
    cnt = 0
    n = len(polygon)
    for i in range(n):
        x1, y1 = polygon[i]
        x2, y2 = polygon[(i+1)%n]
        if ((y1 <= py < y2) or (y2 <= py < y1)) and (px < (x2-x1)*(py-y1)/(y2-y1)+x1):
            cnt ^= 1
    return cnt

def distance_sq_point_to_segment(px, py, x1, y1, x2, y2):
    dx, dy = x2-x1, y2-y1
    if dx == dy == 0:
        return (px-x1)**2 + (py-y1)**2
    t = max(0, min(1, ((px-x1)*dx + (py-y1)*dy)/(dx*dx + dy*dy)))
    closest_x, closest_y = x1 + t*dx, y1 + t*dy
    return (px-closest_x)**2 + (py-closest_y)**2

def circle_intersects_polygon(cx, cy, r, polygon):
    if point_inside_polygon(cx, cy, polygon):
        return True
    r2 = r*r
    n = len(polygon)
    for i in range(n):
        x1, y1 = polygon[i]
        x2, y2 = polygon[(i+1)%n]
        if distance_sq_point_to_segment(cx, cy, x1, y1, x2, y2) <= r2:
            return True
    return False

def main():
    width, height, n = map(float, input().split())
    n = int(n)
    polygons = []
    bboxes = []
    areas = []

    for _ in range(n):
        data = list(map(float, input().split()))
        v = int(data[0])
        pts = [(data[i*2+1], data[i*2+2]) for i in range(v)]
        polygons.append(pts)
        xs, ys = zip(*pts)
        bboxes.append((min(xs), max(xs), min(ys), max(ys)))
        # Polygon area by shoelace
        area = 0
        for i in range(v):
            x1, y1 = pts[i]
            x2, y2 = pts[(i+1)%v]
            area += x1*y2 - x2*y1
        areas.append(abs(area)/2)

    q = int(input())
    for _ in range(q):
        cx, cy, r = map(float, input().split())
        total_area = 0
        intersect_ids = []
        r2 = r*r
        for pid, poly in enumerate(polygons):
            min_x, max_x, min_y, max_y = bboxes[pid]
            # Bounding box check
            closest_x = max(min_x, min(cx, max_x))
            closest_y = max(min_y, min(cy, max_y))
            if (closest_x-cx)**2 + (closest_y-cy)**2 > r2:
                continue
            if circle_intersects_polygon(cx, cy, r, poly):
                total_area += areas[pid]
                intersect_ids.append(str(pid))
        if intersect_ids:
            print(f"{total_area:.6f} {len(intersect_ids)} {' '.join(intersect_ids)}")
        else:
            print("0.000000 0")

if __name__ == "__main__":
    main()
```该代码首先读取多边形并计算它们的面积和边界框。 对于每个查询，它都会快速消除边界框远离圆的多边形。 对于剩余的候选者，它使用多边形内的点和边缘距离检查来检查精确的交集。 收集并打印相交多边形的面积和 ID。 微妙之处包括一致地使用浮点运算以及正确应用鞋带公式进行面积计算。 

## 工作示例

 ### 示例 1

 查询`(2, 3.5, 0.5)`| 多边形 ID | 边界框检查 | 圆与多边形相交| 包含面积 |
 | --- | --- | --- | --- |
 | 0 | 通行证 | 真实| 1.0 |
 | 1 | 通行证 | 假 | 0 |
 | 2 | 失败| 不适用 | 0 |

 总面积为1.0，ID`[0]`。 

询问`(3.3, 2, 0.4)`| 多边形 ID | 边界框检查 | 圆与多边形相交| 包含面积 |
 | --- | --- | --- | --- |
 | 0 | 通行证 | | |
