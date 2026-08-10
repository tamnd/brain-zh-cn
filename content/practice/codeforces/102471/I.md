---
title: "CF 102471I - 月球"
description: "我们在单位球面上有固定点 a 1 ​ ,…,a n ​。 从球体中均匀选择一个新点 a 0 ​。 我们问是否所有 n+1 个点都可以容纳在一个闭合半球内。"
date: "2026-08-09T04:49:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102471
codeforces_index: "I"
codeforces_contest_name: "2019 ICPC Asia-East Continent Final"
rating: 0
weight: 102471
solve_time_s: 347
verified: true
draft: false
---

[CF 102471I - 月球](https://codeforces.com/problemset/problem/102471/I)

 **评级：** -
 **标签：** -
 **求解时间：** 5m 47s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在单位球面上有固定点 a 1 ​ ,…,a n ​。 从球体中均匀选择一个新点 a 0 ​。 我们问是否所有 n+1 个点都可以容纳在一个闭合半球内。 由于 a 0 ​是随机的，f 要么是 0，要么是 1，所以 f 的期望值正是随机点可接受的概率。 

有用的几何重构是暂时忘记 0 并查看由固定向量生成的圆锥体，

 C={ i Σ​ λ i ​ a i ​ :λ i ​ ≥0}。 

当 -x 位于该圆锥内部时，点 x 就会失效。 因此，a 0 的不良位置形成了不动点的球面凸包的对映图像。 对映映射保留了面积，所以

 E[f]=1− 4π 面积(sconv(a 1 ​ ,…,a n ​ )) ​ .

 因此，概率问题变成了几何问题：计算不动点的球面凸包的面积。 

输入给出整数三元组 (x,y,z)，但实际点是归一化向量。 我们应该保留整数三元组用于几何方向测试，因为它们让我们能够准确地执行所有凸包谓词。 仅在评估最终球形面积时才需要归一化。 

当 n≤10 5 时，O(n 2 ) 算法在最坏的情况下需要大约 5×10 9 成对规模的操作，这远远超出了两秒的限制。 我们需要一个 O(nlogn) 期望时间的几何算法。 标准路线是随机增量三维凸包，其期望复杂度在固定维度为 O(nlogn)。 

有几种退化现象值得明确治疗。 如果 n=0,1 或 2，不动点总是适合半球，因此答案为 1。例如，```
2
1 0 0
-1 0 0
```有答案 1。如果粗心的解决方案将两个对映点视为定义正面积球面多边形，则会错误地从答案中减去面积。 

如果所有固定点都位于通过原点的一个平面内，则它们的球面凸包的二维面积为零。 例如，```
3
1 0 0
-1 0 0
0 1 0
```有答案 1. 三点可以在大圆上形成大圆弧，但大圆弧的表面积为零。 

提供的示例是一个有用的相反情况：```
3
1 0 0
0 1 0
0 0 1
```球面凸包是球体的一个八分圆，其面积为π/2。 因此，坏概率为 (π/2)/(4π)=1/8，即 7/8。 计算普通平面三角形面积而不是球形面积的解决方案将得到错误的答案。 

退化凸包面也是可能的。 多个输入点可以位于同一平面上。 除了将相同的球面多边形细分为三角形之外，这些点不会改变球面面积，因此凸包实现可以使用共面的任何有效三角剖分。 

## 方法

 直接方法会尝试表征包含固定点的每个可能的半球，然后确定可以添加 0 的哪些位置。 这很快就会变成二次方，因为每个候选分离平面都是由多个输入点定义的。 枚举三元组已经给出了 θ(n 3 ) 的可能性，而枚举对也给出了 θ(n 2 )，在 n=10 5 时大约有 5⋅10 9 对。 

关键的观察结果是，只有球形凸包的边界才重要。 内部固定点不能改变圆锥体覆盖的方向集。 球面凸包的边界正是输入向量的普通三维凸包相关面的径向投影。 

因此，蛮力之所以有效，是因为它试图显式地发现支持平面，但会失败，因为可能的平面太多。 凸包将所有支撑平面封装成线性大小的面集合。 一旦知道了这些面，答案就是它们的球形三角形面积之和。 

对于全维点集，构造三维凸包。 将每个船体面朝外。 每个具有顶点 u、v、w 的面通过沿大圆弧将这三个点连接到原点来定义球面三角形。 如果面平面不通过原点，则其径向投影恰好贡献该球面三角形的面积。 包含原点的面的二维球面面积为零并且没有任何贡献。 

对于单位向量 u,v,w 的三角形，其面积的数值稳定公式为

 A=2atan2(∣det(u,v,w)∣,1+u⋅v+v⋅w+w⋅u)。 

使用`atan2`优于通过恢复角度`acos`， 因为`acos`当其参数非常接近 1 或 -1 时，会失去精度。 

三维船体是逐步构建的。 我们从四面体开始，随机化插入顺序，并为每个新点找到当前可见面的连接集。 这些面孔形成一顶帽子。 它们的边界是地平线，将新点连接到每个地平线边缘会产生新的船体。 为每个尚未插入的点存储冲突所有者，因此算法可以定位可见的面，而无需扫描整个船体。 随机增量凸包构造在固定维度上的复杂度预计为 O(nlogn)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 枚举候选支持配置 | O(n 2 ) 或更糟 | O(n) | 太慢了|
 | 随机增量 3D 船体 | 预期 O(nlogn) | O(n) 预期 | 已接受 |

 ## 算法演练

 1. 读取整数方向向量并保留其原始整数坐标。 稍后计算归一化浮点坐标仅用于球面面积评估。 精确的整数坐标很有价值，因为凸包方向测试是决定因素，并且可以在不进行舍入的情况下进行评估。 
2.立即处理n≤2。 最多两个固定点总是适合一个半球，因此概率为 1。 
3. 计算固定向量的秩。 如果它们跨越最多二维的空间，则归一化后所有点都位于一个大圆上。 它们的球形凸包表面积为零，因此答案为 1。 
4、若n=3，且三个向量线性无关，则直接定义一个球面三角形。 计算其面积`atan2`公式并返回 1−A/(4π)。 目前还没有可以构造的三维多面体。 
5. 选择四个仿射独立的输入点并将其四面体的四个面朝外。 定向谓词

 东方(a,b,c,d)=(b−a)⋅((c−a)×(d−a))

 用整数求值。 如果是正数，则d在abc的法线侧，所以面方向必须反转。 

1. 随机洗牌所有剩余的点。 对于尚未插入的每个点，保留一个当前可见的面作为其冲突所有者。 如果该面在插入过程中消失，则该点将重新分配给它可以看到的新创建的面之一。 恰好位于船体面上的点不需要进一步插入，因为它们仅细分现有的边界面。 
2. 一次插入一个剩余的点。 从点的冲突所有者开始，对相邻面执行图形遍历。 当新点严格位于其定向平面之外时，面就准确可见。 遍历收集每个连接的可见面。 
3. 移除可见面。 将可见面与不可见面分开的每条边都属于地平线。 这些地平线边缘正是连接新点必须跨越的边界。 
4. 对于每个地平线边缘，创建一个包含该边缘和插入点的新三角形。 对其进行定向，使原始四面体的已知内点严格位于新船体内部。 通过边缘图连接新面。 
5. 重新分配先前所有者已删除的点的冲突所有者。 对于这些点测试新面就足够了，因为删除的可见区域已被新的地平线扇形取代。 
6. 完成所有插入后，遍历每个幸存的船体面。 标准化其三个顶点并计算球面三角形面积。 将这些区域总结为`spherical_area`。 
7. 球壳正是 0 的不良对映位置的集合。 它的面积除以4π就是f=0的概率。 因此输出

 1− 4π 球形面积 ​ .

 ### 为什么它有效

 对于随机点 x，当存在一个向量 h 使得对于每个固定点 h⋅a i ​ ≥0 且 h⋅x≥0 时，所有固定点和 x 恰好适合一个闭合半球。 根据分离超平面定理，不存在这样的 h 的点恰好是不动点的对映球面凸包，直到其边界，其测度为零。 三维凸包恰好包含定义球形凸包的支撑面。 径向投影每个非原点外壳面会产生一个球面三角形，并且投影将球面外壳分割开来，且其内部没有重叠。 因此，对这些三角形面积求和就可以准确地测量出不良位置。 最终的补数就是所需要的期望值。 

## Python 解决方案

 下面的实现使用精确的整数决定因素来确定船体方向和随机增量船体构造。 只有在组合外壳确定后，最终的球形面积才使用浮点。```python
import sys
input = sys.stdin.readline

import math
import random

def cross(a, b):
    return (
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    )

def sub(a, b):
    return (
        a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2],
    )

def dot(a, b):
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

def orient(a, b, c, d):
    ab = sub(b, a)
    ac = sub(c, a)
    ad = sub(d, a)
    return dot(cross(ab, ac), ad)

def face_area(p, q, r, nf):
    px, py, pz = p
    qx, qy, qz = q
    rx, ry, rz = r

    np = math.sqrt(px * px + py * py + pz * pz)
    nq = math.sqrt(qx * qx + qy * qy + qz * qz)
    nr = math.sqrt(rx * rx + ry * ry + rz * rz)

    ux, uy, uz = px / np, py / np, pz / np
    vx, vy, vz = qx / nq, qy / nq, qz / nq
    wx, wy, wz = rx / nr, ry / nr, rz / nr

    det = (
        ux * (vy * wz - vz * wy)
        - uy * (vx * wz - vz * wx)
        + uz * (vx * wy - vy * wx)
    )

    uv = ux * vx + uy * vy + uz * vz
    vw = vx * wx + vy * wy + vz * wz
    wu = wx * ux + wy * uy + wz * uz

    den = 1.0 + uv + vw + wu

    return 2.0 * math.atan2(abs(det), den)

def spherical_triangle_area(p, q, r):
    return face_area(p, q, r, None)

def solve_points(points):
    n = len(points)

    if n <= 2:
        return 1.0

    # Find three linearly independent vectors if possible.
    a = points[0]

    i1 = -1
    for i in range(1, n):
        if cross(a, points[i]) != (0, 0, 0):
            i1 = i
            break

    if i1 == -1:
        return 1.0

    b = points[i1]

    i2 = -1
    ab = cross(a, b)
    for i in range(i1 + 1, n):
        if dot(ab, points[i]) != 0:
            i2 = i
            break

    if i2 == -1:
        return 1.0

    c = points[i2]

    # Three fixed points already determine the spherical hull.
    if n == 3:
        area = spherical_triangle_area(a, b, c)
        return 1.0 - area / (4.0 * math.pi)

    # Find a fourth point outside the plane of a,b,c.
    i3 = -1
    for i in range(n):
        if i not in (0, i1, i2) and orient(a, b, c, points[i]) != 0:
            i3 = i
            break

    if i3 == -1:
        return 1.0

    # The centroid of the initial tetrahedron is strictly inside
    # the initial hull and remains inside every later hull.
    center = (
        a[0] + b[0] + c[0] + points[i3][0],
        a[1] + b[1] + c[1] + points[i3][1],
        a[2] + b[2] + c[2] + points[i3][2],
    )

    faces = []
    alive = []
    neigh = []
    buckets = []

    # edge -> (face_id, local_edge_index)
    edge_map = {}

    def edge_key(u, v):
        if u < v:
            return (u, v)
        return (v, u)

    def add_face(u, v, w):
        fid = len(faces)
        faces.append([u, v, w])
        alive.append(True)
        neigh.append([-1, -1, -1])
        buckets.append([])

        for e in range(3):
            x = faces[fid][e]
            y = faces[fid][(e + 1) % 3]
            key = edge_key(x, y)

            old = edge_map.get(key)
            if old is None:
                edge_map[key] = (fid, e)
            else:
                of, oe = old
                neigh[fid][e] = of
                neigh[of][oe] = fid

        return fid

    # Create the four tetrahedron faces.
    ids = [0, i1, i2, i3]

    tetra_faces = [
        (ids[0], ids[1], ids[2], ids[3]),
        (ids[0], ids[3], ids[1], ids[2]),
        (ids[0], ids[2], ids[3], ids[1]),
        (ids[1], ids[3], ids[2], ids[0]),
    ]

    for u, v, w, opposite in tetra_faces:
        if orient(points[u], points[v], points[w], points[opposite]) > 0:
            v, w = w, v
        add_face(u, v, w)

    owner = [-1] * n
    used = [False] * n
    for x in ids:
        used[x] = True

    # Every remaining point on the sphere is outside the tetrahedron,
    # except for coplanar degeneracies which can safely remain on the hull.
    for i in range(n):
        if used[i]:
            continue
        p = points[i]
        found = -1
        for fid in range(len(faces)):
            if orient(
                points[faces[fid][0]],
                points[faces[fid][1]],
                points[faces[fid][2]],
                p,
            ) > 0:
                found = fid
                break
        if found != -1:
            owner[i] = found
            buckets[found].append(i)

    order = [i for i in range(n) if not used[i]]
    random.shuffle(order)

    for pidx in order:
        start = owner[pidx]

        # Degenerate coplanar points need not be inserted.
        if start == -1 or not alive[start]:
            continue

        p = points[pidx]

        visible = set()
        stack = [start]

        while stack:
            fid = stack.pop()
            if fid in visible or not alive[fid]:
                continue

            u, v, w = faces[fid]
            if orient(points[u], points[v], points[w], p) <= 0:
                continue

            visible.add(fid)

            for nb in neigh[fid]:
                if nb != -1 and nb not in visible and alive[nb]:
                    stack.append(nb)

        if not visible:
            continue

        candidates = []
        for fid in visible:
            for q in buckets[fid]:
                if owner[q] == fid and q != pidx:
                    owner[q] = -1
                    candidates.append(q)
            buckets[fid].clear()

        horizon = []

        for fid in visible:
            u, v, w = faces[fid]
            vs = (u, v, w)

            for e in range(3):
                nb = neigh[fid][e]
                if nb not in visible:
                    x = vs[e]
                    y = vs[(e + 1) % 3]

                    nb_edge = -1
                    if nb != -1:
                        nu, nv, nw = faces[nb]
                        nvs = (nu, nv, nw)
                        for ee in range(3):
                            if edge_key(nvs[ee], nvs[(ee + 1) % 3]) == edge_key(x, y):
                                nb_edge = ee
                                break

                    horizon.append((x, y, nb, nb_edge))

        # Remove visible faces from the edge map.
        for fid in visible:
            alive[fid] = False
            u, v, w = faces[fid]
            vs = (u, v, w)

            for e in range(3):
                x = vs[e]
                y = vs[(e + 1) % 3]
                key = edge_key(x, y)
                old = edge_map.get(key)
                if old is not None and old[0] == fid:
                    del edge_map[key]

        new_faces = []

        for x, y, nb, nb_edge in horizon:
            u, v, w = x, y, pidx

            # The initial tetrahedron centroid must remain inside the hull.
            if orient(points[u], points[v], points[w], center) > 0:
                v, u = u, v

            fid = add_face(u, v, w)
            new_faces.append(fid)

            if nb != -1:
                # add_face already linked the two faces through the edge.
                pass

        # Reassign points whose only known visible face disappeared.
        for q in candidates:
            qp = points[q]
            for fid in new_faces:
                u, v, w = faces[fid]
                if orient(points[u], points[v], points[w], qp) > 0:
                    owner[q] = fid
                    buckets[fid].append(q)
                    break

    area = 0.0

    for fid in range(len(faces)):
        if not alive[fid]:
            continue

        u, v, w = faces[fid]
        area += spherical_triangle_area(
            points[u],
            points[v],
            points[w],
        )

    area = min(max(area, 0.0), 4.0 * math.pi)
    return 1.0 - area / (4.0 * math.pi)

def main():
    n = int(input())
    points = [tuple(map(int, input().split())) for _ in range(n)]

    ans = solve_points(points)
    print("{:.12f}".format(ans))

if __name__ == "__main__":
    main()
```第一部分`solve_points`在外壳代码开始之前处理所有低维情况。 这是必要的，因为三维凸包需要一个初始四面体，而三个线性独立的固定向量已经定义了一个完全有效的球面三角形。 

这`orient`函数是中心精确谓词。 它是标量三重积，因此对于整数输入，关于点位于船体平面的哪一侧的每个决定都是准确的。 Python 整数具有任意精度，因此不存在`int64`即使中间行列式可能比原始坐标大得多，也会溢出。 

船体将每个面及其三个相邻面存储在一起。`edge_map`让新面孔在恒定的预期时间内找到共享边缘上的现有面孔。 这`buckets`数组是冲突结构。 一个点只需要一个已知的可见面。 当该面消失时，该点将针对新的地平线扇进行测试，如果它留在外面，则会收到新的所有者。 

初始四面体使用其相反的顶点定向。 后来的面孔使用定向`center`，它严格位于初始四面体内部。 由于后来的每个船体都包含最初的四面体，因此该点严格保留在船体内部。 因此，根据新面检查其方向可以提供可靠的向外方向。 

最终面积计算有意使用归一化浮点向量。 船体决策已经准确完成，因此浮点仅限于最终必须打印的连续数量。 这`atan2`公式处理非常小和非常大的球面三角形比分别计算三个球面角更可靠`acos`。 

## 工作示例

 ### 示例 1

 固定点是正坐标轴。 

| 定点| 坐标| 几何结果|
 | --- | --- | --- |
 | 一个 1 ​ | (1,0,0) | (1,0,0) | 第一个顶点 |
 | 一个 2 ​ | (0,1,0) | (0,1,0) | 第二个顶点|
 | 一个 3 ​ | (0,0,1) | (0,0,1) | 第三个顶点|
 | 球面面积| π/2 | 球体的八分之一|
 | 坏概率| 1/8 | a 0 ​ 在相反的八分圆 |
 | 预期 f | 7/8 | 0.875000000000 |

 对于三个归一化向量，每个成对点积为零，行列式为 1。三角形公式变为

 2atan2(1,1)= 2 π ​ .

 除以球体面积 4π 得出的坏概率为 1/8，因此期望的期望为 7/8。 

### 示例 2

 考虑正四面体的四个顶点，```
4
1 1 1
1 -1 -1
-1 1 -1
-1 -1 1
```原点位于其凸包内部。 

| 步骤| 赫尔州| 球面面积|
 | --- | --- | --- |
 | 初始四面体| 所有四个点都是船体顶点 | 4π|
 | 最终遍历| 四个球面划分球体 | 4π|
 | 坏概率| 4π/(4π) | 1 |
 | 预期 f | 补充 | 0 |

 从原点开始的每个方向都属于由四个四面体顶点生成的圆锥体。 因此，每一个可能的 0 都是不好的，这意味着没有一个半球可以包含所有五个点，答案是 0。 

该迹线还说明了为什么即使原点位于普通凸包内部，对船体表面的球形面积求和仍然有效。 所有面的径向投影在其内部恰好覆盖整个球体一次。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 预期 O(nlogn) | 固定维度的随机增量凸包加上线性大小的面遍历 |
 | 空间| 预期 O(n) | 三维船体有 O(n) 个面和边 |

 关键界限是固定维度。 三维凸包只有 O(n) 个面，随机增量构造预计需要 O(nlogn) 工作。 输入包含 10 5 个点，因此这避免了成对或三重枚举的二次 5×10 9 尺度工作。 Python 的任意精度整数使精确方向谓词变得安全，而浮点工作仅限于最终面积计算。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
import math

# Paste the solve_points function and its helpers from the solution above.

def run(inp: str) -> str:
    data = inp.strip().splitlines()
    n = int(data[0])
    points = [tuple(map(int, line.split())) for line in data[1:]]
    return f"{solve_points(points):.12f}"

# Provided sample
assert abs(float(run("""\
3
1 0 0
0 1 0
0 0 1
""")) - 0.875) < 1e-10, "sample 1"

# Minimum-size input
assert abs(float(run("""\
0
""")) - 1.0) < 1e-10, "n = 0"

# Two antipodal points
assert abs(float(run("""\
2
1 0 0
-1 0 0
""")) - 1.0) < 1e-10, "two antipodal points"

# Three points on one great circle
assert abs(float(run("""\
3
1 0 0
-1 0 0
0 1 0
""")) - 1.0) < 1e-10, "coplanar through origin"

# Four regular-tetrahedron directions, origin strictly inside
assert abs(float(run("""\
4
1 1 1
1 -1 -1
-1 1 -1
-1 -1 1
""")) - 0.0) < 1e-10, "origin inside hull"

# Maximum-size input. All directions lie in z = 0, so the
# spherical convex hull has zero two-dimensional area.
pts = ["100000"]
for i in range(1, 100001):
    pts.append(f"{i} 1 0")

assert abs(float(run("\n".join(pts))) - 1.0) < 1e-10, "maximum n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`0`|`1.000000000000`| 最小输入尺寸 |
 | 两个对映向量 |`1.000000000000`| 边界和对映点情况 |
 | 三个共面向量|`1.000000000000`| 零面积球形壳|
 | 正四面体|`0.000000000000`| 起源严格在船体内部|
 | 100000 个共面方向 |`1.000000000000`| 最大输入尺寸和线性船体处理 |

 该问题承诺标准化不动点是不同的，这意味着字面上的重复点是不合法的。 因此，“所有相等值”测试不能是有效输入。 不同的整数三元组可以具有相同的归一化方向，但这些也被独特性条件所禁止。 

## 边缘情况

 对于n=0，a 0没有固定的限制​。 每个随机点都可以单独放置在某个半球中，因此算法立即返回 1。 

对于两个对映不动点，```
2
1 0 0
-1 0 0
```这些点位于许多半球的边界上。 通过选择边界包含对映体对的适当半球，始终可以容纳第三个点。 球壳没有二维面积，所以答案仍然是 1。 

对于三个共面点```
3
1 0 0
-1 0 0
0 1 0
```行列式为零。 所有三个点都位于同一个大圆上，因此它们的球面凸包是一维的。 它的表面积为零，算法返回 1，而不尝试构造四面体。 

对于样本，```
3
1 0 0
0 1 0
0 0 1
```行列式为1，三角形公式中的分母为1，球面面积为π/2。 算法返回

 1− 4π π/2​ = 8 7 ​ 。 

这是概率变换的关键健全性检查。 

对于正四面体，```
4
1 1 1
1 -1 -1
-1 1 -1
-1 -1 1
```原点严格位于普通凸包内部。 来自原点的每条射线都与球体相交，因此球面凸包就是整个球体。 四个球面面积相加为 4π，失败概率为 1，预期值为 0。 

最后，当多个点位于同一支撑平面上时，精确方向测试可能会将某些点分类为共面而不是可见。 这些点不会创建新的二维球形区域。 它们仅细分现有的船体面，因此忽略恰好位于现有面上的点不会改变球面面积之和。
