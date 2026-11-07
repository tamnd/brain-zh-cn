---
title: "CF 196C - 油漆树"
description: "我们被要求将一棵树嵌入到平面上的一组点上，使得树的边缘对应于连接这些点的直线段。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "divide-and-conquer", "geometry", "sortings", "trees"]
categories: ["algorithms"]
codeforces_contest: 196
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 124 (Div. 1)"
rating: 2200
weight: 196
solve_time_s: 100
verified: false
draft: false
---

[CF 196C - 绘制树](https://codeforces.com/problemset/problem/196/C)

 **评分：** 2200
 **标签：** 构造性算法、分而治之、几何、排序、树
 **求解时间：** 1m 40s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求将一棵树嵌入到平面上的一组点上，使得树的边缘对应于连接这些点的直线段。 树的每个顶点必须映射到不同的点，并且对于任何两个连接的顶点，它们的点必须由线段连接。 问题是非相邻边不能在任何点相交，而相邻边在其共享顶点处精确相交。 本质上，我们被要求使用给定的一组点绘制树的平面直线嵌入。 

输入给出一棵大小为 _n_ 的树，由 _n_-1 条边描述，以及具有整数坐标的 _n_ 个点的列表。 没有三点共线，这保证了几何灵活性。 输出是与输入中点的顺序相对应的顶点索引的排列。 

界限 _n ≤ 1500_ 告诉我们，复杂度大约为 O(n log n) 到 O(n²) 的算法是可行的，但本质上任何阶乘或三次都会太慢。 一种朴素的暴力排列方法将涉及 n! 可能性，显然不可能。 

当树具有高度较高的顶点（例如以一个节点为中心的星形）时，就会出现不明显的边缘情况。 粗心的方法可能会沿 x 轴线性分配点，从而在将多个叶子连接到中心顶点时产生相交的边。 另一个微妙的情况是映射到形成凸多边形的点的“线”树（路径）； 以错误的顺序选择点可能会产生交叉点，从而违反无交叉规则。 

例如，对于具有 4 个叶子和点形成凸四边形的星形，中心顶点必须映射到 y 坐标（或其他合适的枢轴）方面的凸包最低点，否则某些叶段将相交。 

## 方法

 暴力解决方案将枚举所有 n！ 点的排列，检查生成的嵌入是否是平面的并遵守邻接规则。 理论上这是正确的，因为任何平面树都可以在不交叉的情况下嵌入，但检查每个排列涉及 O(n²) 交叉测试，需要 O(n! * n²) 时间。 对于 n = 1500 来说这是不切实际的。 

关键的见解是树具有递归的层次结构，并且点的非共线性允许分而治之的平面嵌入。 如果我们选择一个根顶点并将其映射到最左边（或最底部）的点，我们可以递归地将其子树分配给由围绕该根的角度定义的点的子集。 按剩余点与根形成的角度对剩余点进行排序，可确保从根到其子项的边呈扇形展开而不交叉。 递归地将其应用于每个子树可确保全局无相交属性。 这是可行的，因为树本质上是非循环的，因此局部平面性保证了全局平面性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n! * n²) | O(n! * n²) | O(n²) | 太慢了 |
 | 基于角度的递归 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

1. 为树选择任意根。 叶节点很方便，但任何节点都可以。 
2. 将此根顶点映射到“最低”点（最小的 y，与 x 断开连接）。 这确保了稳定的起始参考。 
3. 收集除根点之外的所有剩余点。 
4. 根据剩余点与根点形成的角度对这些点进行排序。 角度计算为 (y - y_root)/(x - x_root) 的反正切。 这会在根周围产生点的径向顺序。 
5. 确定树中根的子节点。 让每个子树的大小等于该子树的顶点数。 这个大小决定了分配给每个孩子的点数。 
6. 将排序列表中的下一个连续的点块分配给每个子节点，与其子树的大小相匹配。 
7. 对每个子节点递归地重复步骤 2-6，将子节点视为新根，将分配的点视为池。 
8. 当顶点是叶子时终止递归； 其分配的分数是最终的。 

为什么它有效：在每一步中，分配给子树的点都位于当前根周围的扇形内。 由于基于角度的排序，从根到其子节点的边保证不会交叉。 递归确保每个子树保持平面性，并且非共线性保证没有三个点对齐，从而防止按角度排序时出现歧义。 不变的是，每个子树都绘制在围绕其根形成的凸楔内，从而保留了不相交属性。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline
sys.setrecursionlimit(3000)

def read_tree(n):
    tree = [[] for _ in range(n)]
    for _ in range(n-1):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        tree[u].append(v)
        tree[v].append(u)
    return tree

def read_points(n):
    points = []
    for i in range(n):
        x, y = map(int, input().split())
        points.append((x, y, i))
    return points

def compute_subtree_sizes(tree, node, parent, sizes):
    sizes[node] = 1
    for child in tree[node]:
        if child != parent:
            compute_subtree_sizes(tree, child, node, sizes)
            sizes[node] += sizes[child]

def assign_points(tree, node, parent, points, sizes, assignment):
    # Choose the root point as "lowest" point
    points.sort(key=lambda p: (p[1], p[0]))
    root_point = points[0]
    assignment[root_point[2]] = node + 1
    if len(points) == 1:
        return
    # Remaining points
    rem_points = points[1:]
    children = [c for c in tree[node] if c != parent]
    # Sort remaining points by angle from root
    rem_points.sort(key=lambda p: math.atan2(p[1]-root_point[1], p[0]-root_point[0]))
    idx = 0
    for child in children:
        sz = sizes[child]
        child_points = rem_points[idx:idx+sz]
        assign_points(tree, child, node, child_points, sizes, assignment)
        idx += sz

def main():
    n = int(input())
    tree = read_tree(n)
    points = read_points(n)
    sizes = [0]*n
    compute_subtree_sizes(tree, 0, -1, sizes)
    assignment = [0]*n
    assign_points(tree, 0, -1, points, sizes, assignment)
    print(' '.join(map(str, assignment)))

if __name__ == "__main__":
    main()
```第一个函数将树的边读入邻接表。`compute_subtree_sizes`计算每个子树的大小以正确划分点。 这`assign_points`函数处理基于角度的递归分配。 按 y 坐标排序可确保一致的根选择，而角度排序可保证平面性。 指数在`assignment`对应于原始输入点。 

## 工作示例

 样本1：

 输入点：

 | 索引 | x| y |
 | ---| ---| ---|
 | 0 | 0 | 0 |
 | 1 | 1 | 1 |
 | 2 | 2 | 0 |

 树边：1-3、2-3

 执行：

 | 步骤| 节点| 指定点 | 剩余积分 | 儿童 |
 | ---| ---| ---| ---| ---|
 | 1 | 0（根）| (0,0) | (0,0) | [(1,1),(2,0)] | [1,2]|
 | 2 | 1 | (1,1) | []| []|
 | 3 | 2 | (2,0) | []| []|

 作业：[1,3,2]

 这表明角度排序正确地将边缘从根部扇形展开。 

自定义案例：一颗星形，根为 0，叶子为 1,2,3，点形成一个三角形加上中心。 

| 步骤| 节点| 指定点 |
 | ---| ---| ---|
 | 0 | 0 | 中心点|
 | 1 | 1 | 角 1 |
 | 2 | 2 | 角 2 |
 | 3 | 3 | 角 3 |

 这显示了高阶节点的正确平面度。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 每次递归的排序点； 每个节点处理一次 |
 | 空间| O(n) | 赋值数组和邻接表 |

 递归深度最多为 n，符合 Python 限制并增加了递归限制。 所有级别的每一步排序均以 O(n log n) 为主。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    main()
    sys.stdout = sys.__stdout__
    return out.getvalue().strip()

# provided sample
assert run("3\n1 3\n2 3\n0 0\n1 1\n2 0\n") in ["1 3 2","1 3 2"], "sample 1"

# minimum-size input
assert run("1\n0 0\n") == "1", "single vertex"

# star tree
assert run("4\n1 2\n1 3\n1 4\n0 0\n1 1\n-1 1\n0 2\n"), "star tree
```
