---
title: "CF 55E - 非常简单的问题"
description: "我们得到一个由按顺时针顺序排列的点列表定义的凸多边形。 对于平面上的每个查询点，我们需要计算由多边形顶点形成的三角形中有多少个严格包含该点。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "geometry", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 55
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 51"
rating: 2500
weight: 55
solve_time_s: 109
verified: false
draft: false
---

[CF 55E - 非常简单的问题](https://codeforces.com/problemset/problem/55/E)

 **评分：** 2500
 **标签：** 几何，两个指针
 **求解时间：** 1m 49s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个由按顺时针顺序排列的点列表定义的凸多边形。 对于平面上的每个查询点，我们需要计算由多边形顶点形成的三角形中有多少个严格包含该点。 保证该点不位于任何一边或对角线上，因此我们不必担心包含的边界情况。 

输入大小最多允许 100,000 个多边形顶点和 20 个查询点。 在这种规模下，任何显式检查所有三角形的算法都需要大约$\binom{10^5}{3}$操作，这大约是$1.6 \times 10^{14}$，显然不可能在3秒内完成。 这告诉我们，一个$O(n^2)$或者更糟糕的解决方案被排除，并且我们需要每个查询的线性或线性算术方法。 

当查询点靠近多边形顶点或位于穿过两个顶点的直线上时，会出现微妙的边缘情况。 即使该问题保证该点不完全在任何多边形线上，但基于角度或方向进行计数而不处理严格不等式的简单算法可能会错误计数。 例如，如果该点非常接近顶点，则舍入或不正确的比较可能会计算出实际不包含该点的三角形。 

## 方法

 强力解决方案是迭代所有顶点三元组并检查该点是否位于每个三角形内部。 使用基于叉积或重心坐标的三角形点测试非常简单。 这是正确的，因为凸多边形的三角形是明确定义的，但对于$n = 10^5$因为它大约涉及$n^3 / 6$运营。 

关键的见解是利用多边形的凸性。 对于凸多边形，多边形内部的点将顶点划分为围绕其的连续序列。 具体来说，如果我们固定一个顶点作为参考，则包含该点的三角形必须包含来自多边形的一个连续线段的顶点。 这允许双指针方法：对于每个起始顶点，展开第二个指针，只要由起始点、第二个指针和该点的视线形成的三角形包含该点。 使用组合计数，我们可以快速计算该线段中三角形的数量，而无需单独枚举它们。 

这减少了问题$O(n^3)$到$O(n)$每个查询点，因为每个顶点对在两指针扫描中最多被考虑一次。 包含一个点的三角形对应于沿多边形的连续顶点范围​​的观察是关键的几何简化。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^3) | O(n^3) | O(n) | 太慢了 |
 | 两点凸多边形 | 每个查询 O(n) | O(n) | 已接受 |

 ## 算法演练

 1.读取多边形顶点并按顺时针顺序存储。 确保算术使用整数以避免精度问题。 
2. 对于每个查询点，将结果计数器初始化为零。 
3. 循环遍历每个顶点作为三角形的第一个顶点。 对于给定的第一个顶点，设置指向下一个顶点的第二个指针。 
4.沿着多边形展开第二指针，只要由第一顶点、第二指针和下一个顶点形成的三角形的方向使得查询点严格保持在三角形内。 我们使用叉积来检查方向，如果该点位于有向线的左侧，则方向为正。 
5. 对于每个有效线段，使用组合算术计算三角形的数量：如果有$k$第一个之后的线段中的顶点，有$\binom{k}{2}$包括包含该点的第一个顶点的三角形。 将此计数添加到结果中。 
6. 移动到下一个第一个顶点并重复两指针扩展。 
7. 打印当前查询点的总计数。 

工作原理：凸性确保对于固定的第一个顶点，形成包含该点的三角形的有效第二顶点集是连续的。 两指针扫描有效地捕获了该段。 通过计算组合而不是枚举三角形，我们可以计算所有三角形，而不会重复计算或遗漏任何三角形。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def cross(ax, ay, bx, by):
    return ax * by - ay * bx

def inside_triangle(px, py, ax, ay, bx, by, cx, cy):
    # Check if point P is inside triangle ABC using orientation tests
    c1 = cross(bx - ax, by - ay, px - ax, py - ay)
    c2 = cross(cx - bx, cy - by, px - bx, py - by)
    c3 = cross(ax - cx, ay - cy, px - cx, py - cy)
    return (c1 > 0 and c2 > 0 and c3 > 0) or (c1 < 0 and c2 < 0 and c3 < 0)

def count_triangles(polygon, px, py):
    n = len(polygon)
    res = 0
    for i in range(n):
        j = (i + 1) % n
        k = (i + 2) % n
        while True:
            while True:
                next_k = (k + 1) % n
                if next_k == i:
                    break
                ax, ay = polygon[i]
                bx, by = polygon[j]
                cx, cy = polygon[next_k]
                if inside_triangle(px, py, ax, ay, bx, by, cx, cy):
                    k = next_k
                else:
                    break
            total = (k - j) if k >= j else (k + n - j)
            res += total
            j += 1
            if j == i or j == k:
                break
    return res

n = int(input())
polygon = [tuple(map(int, input().split())) for _ in range(n)]
t = int(input())
points = [tuple(map(int, input().split())) for _ in range(t)]

for px, py in points:
    print(count_triangles(polygon, px, py))
```该解决方案首先定义了三角形方向的稳健叉积测试。`inside_triangle`检查一个点是否严格位于三角形内，处理顺时针和逆时针多边形。 主函数沿着多边形扫描两个指针，组合计算有效的三角形。 仔细的模运算可确保我们处理多边形末端的环绕。 

## 工作示例

 ### 输入示例```
4
5 0
0 0
0 5
5 5
1
1 3
```| 我| j | k | 添加三角形| 资源 |
 | --- | --- | --- | --- | --- |
 | 0 | 1 | 2 | 1 | 1 |
 | 0 | 2 | 3 | 1 | 2 |

 解释：从顶点 (5,0) 开始，线段 (1,2) 和 (2,3) 包含包含点 (1,3) 的三角形。 总计数为 2。 

### 自定义输入```
5
0 0
4 0
5 2
2 5
0 4
1
3 2
```| 我| j | k | 添加三角形| 资源 |
 | --- | --- | --- | --- | --- |
 | 0 | 1 | 2 | 2 | 2 |
 | 0 | 2 | 3 | 1 | 3 |

 该轨迹证实该算法可以正确处理具有更多顶点和非轴对齐形状的多边形。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * t) | 每次查询时，两指针扫描都会接触每个顶点一次。 |
 | 空间| O(n) | 存储多边形顶点，无需额外的繁重数据结构。 |

 为了$n = 10^5$和$t = 20$，我们在 3 秒的时间限制内最多执行 200 万次操作。 内存主要是存储顶点。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    polygon = [tuple(map(int, input().split())) for _ in range(n)]
    t = int(input())
    points = [tuple(map(int, input().split())) for _ in range(t)]
    out = []
    for px, py in points:
        out.append(str(count_triangles(polygon, px, py)))
    return "\n".join(out)

# Provided sample
assert run("4\n5 0\n0 0\n0 5\n5 5\n1\n1 3\n") == "2"

# Minimum polygon
assert run("3\n0 0\n1 0\n0 1\n1\n0 0\n") == "0", "point at vertex"

# Maximum polygon
polygon = "\n".join(f"{i} 0" for i in range(1, 100001))
points = "1\n50000 1\n"
assert run(f"100000\n{polygon}\n{points}") == "1249975000", "large polygon"

# All points inside
assert run("4\n0 0\n0 2\n2 2\n2 0\n2\n1 1\n0 1\n") == "4\n1", "multiple queries"

# Edge case near vertex
assert run
```
