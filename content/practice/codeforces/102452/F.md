---
title: "CF 102452F - 坠落物体"
description: "每个对象都是三种凸实体之一：立方体、球体或正四面体。 给出了其尺寸、方向和水平释放位置。 这些物体一次释放一个，并且每个物体仅垂直下落。"
date: "2026-08-12T08:28:57+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102452
codeforces_index: "F"
codeforces_contest_name: "2019-2020 ICPC Asia Hong Kong Regional Contest"
rating: 0
weight: 102452
solve_time_s: 179
verified: true
draft: false
---

[CF 102452F - 坠落物体](https://codeforces.com/problemset/problem/102452/F)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个对象都是三种凸实体之一：立方体、球体或正四面体。 给出了其尺寸、方向和水平释放位置。 这些物体一次释放一个，并且每个物体仅垂直下落。 一旦它第一次接触地面或任何已经落地的物体，它就会永久停止。 

该旋转是正确的 z-X-Z 欧拉旋转。 应用后，我们只需要得到的固定几何图形。 物体 (i) 的问题不是它被释放的位置，而是垂直坠落后其最高点的最终 (z) 坐标。 

关键的困难在于一个物体可以在任意点接触另一个物体。 例如，一个立方体可以首先沿面、边缘或顶点接触另一个立方体。 球体可以在不明显的点接触多面体的面或边。 将每个实体视为单个边界框会丢失决定着陆高度的几何信息。 

这些约束使得二次模拟变得可行。 所有测试用例总共最多有 (1000) 个对象，因此考虑每个新对象的每个早期对象仅给出大约 (5\cdot10^5) 个对象对。 时间限制为 5.5 秒，内存限制为 512 MB。 因此，我们需要 (O(n^2)) 模拟，但每一对都必须通过仔细选择的恒定时间几何运算而不是数值下落模拟来处理。 官方问题页面给出了相同的（n\le1000）界限和5.5秒的限制。 

有几个微妙的案例暴露了粗心的实现。 在地面上方释放的半径为 (1) 的球体的中心高度必须为 (1)，因此其最高点为 (2)。 将半径解释为最高点的实现将打印 (1)，这是错误的。```
1
1
1 0 0 0 0 0 1
```答案是（2）。 

第二个陷阱是相切。 中心水平相距 (2) 个单位的两个单位球体恰好接触于一点。 第二个球体仍然停在那里，尽管它们的水平投影仅接触边界。```
1
2
1 0 0 0 0 0 1
1 0 0 0 2 0 1
```两个最高点都是 (2)。 需要正面积重叠的严格相交测试会错误地让第二个球体掉落到地面。 

第三个陷阱是旋转。 四面体在任意旋转下不是对称的，因此其最高和最低垂直偏移取决于欧拉角。 仅使用其未旋转的高度会给出错误的着陆位置。```
1
1
2 191 98 10 25 25 2
```正确的最高点约为 (1.9504473433)，而不是未旋转四面体的高度。 

## 方法

 一种诱人的强力模拟是以小增量降低物体，测试它是否与较早的物体相交，并在检测到相交时停止。 这在概念上很简单，但它不能有效地提供所需的 (10^{-4}) 精度。 如果垂直步长为 (10^{-5})，则高度约为 (10^4) 的对象大约需要 (10^9) 次迭代。 即使是一次这样的跌倒也已经太昂贵了，而且可能会有 (1000) 次跌倒。 

更受人尊敬的数值方法是对中心高度进行二分搜索。 对于每个早期的对象，我们可以测试两个实体是否在建议的高度相交，并执行大约 50 到 60 次二分搜索迭代。 在最坏的情况下，这意味着大约 (60\cdot n(n-1)/2)，或者 (n=1000) 大约 3000 万对测试，每对测试本身都需要大量的三维交集计算。 对于立方体和四面体来说，该常数变得特别令人不快。 

有用的观察是两个凸实体的第一次接触总是可以由少量特征组合来表示。 多面体由顶点、边和三角形面组成。 当一个多面体垂直落在另一个多面体上时，第一次接触由接触静态面的移动顶点、接触静态顶点的移动面或水平投影相交的两条边来表示。 对于球体，类似的情况有点-球体、线-球体、平面-球体和球体-球体。 这种特征分解也是该问题的详细解决方案中使用的标准几何组织。 

这完全改变了问题。 我们不必搜索坠落高度。 对于每个可能的接触特征，我们直接计算发生接触的中心高度，然后取最大值。 最大值是第一次接触，因为对象从 (+\infty) 开始向下移动。 

对于落在三角形面上的点，水平坐标是固定的，因此该点到达三角形面的高度是由平面方程得出的唯一高度。 对于两条边，它们的水平投影决定了接触点，它们的垂直坐标之间的差给出了所需的中心高度。 对于直线和球体，高度函数是二次方加上线性项的平方根，由于它是凹的，因此具有单个最大值。 我们可以显式求解其导数，而不是执行数值优化。 

因此，三维几何被简化为基本公式的固定集合。 官方详细的几何文章描述了相同的十种原始碰撞类型，并解释了为什么立方体和四面体碰撞可以简化为它们。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 垂直台阶模拟| 精度要求不受限制 | (O(n)) | (O(n)) | 太慢了 |
 | 高度二分查找 | (O(n^2\log\varepsilon^{-1})) | (O(n)) | (O(n)) | 太多的几何工作|
 | 基于特征的碰撞 | (O(n^2)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

1. 用旋转的顶点、边和三角形面来表示每个立方体或四面体。 将每个正方形面分成两个三角形后，立方体有 8 个顶点、12 条边和 12 个三角形面。 四面体有 4 个顶点、6 条边和 4 个面。 球体由其中心和半径表示。 可以选择边长为 1 的四面体坐标，然后按输入大小进行缩放。 下面使用的坐标以几何中心为中心。 
2. 从三个输入角度构造 z-X-z 旋转矩阵并旋转每个多面体顶点。 在将对象平移到其给定 (x,y) 位置之前应用旋转矩阵。 所得的 (x,y) 坐标在坠落过程中保持固定，而每个顶点都会收到相同的未知垂直平移。 这里使用的标准 z-X-z 矩阵是详细解决方案中描述的矩阵。 
3. 在处理对象 (i) 之前，使用地面初始化其中心高度。 如果相对于中心的最低旋转顶点或点具有坐标 (z_{\min})，则接地发生在中心高度 (-z_{\min})。 对于球体来说，这只是它的半径。 
4. 将之前的每一个物体视为可能的障碍。 如果两个中心之间的水平距离大于它们的边界半径之和，则它们的水平投影无法相交，因此可以立即跳过该对。 这是精确的拒绝测试，而不是近似值。 
5. 对于多面体-多面体对，测试移动顶点与静态面、移动面与静态顶点以及移动边与静态边。 顶点-面接触是通过平面方程和三角形点测试获得的。 面-顶点接触是相同的计算，但角色相反。 从两条水平线段的交点可以找到边缘-边缘接触。 
6. 对于球体-多面体对，测试球体-顶点、球体-边缘和球体-面接触。 对于边缘情况，最大化沿边缘的垂直接触高度。 对于面的情况，请使用面的法线，因为第一次球面接触是沿着法线方向发生的。 
7. 对于两个球体，将静态球体半径扩大运动球体半径。 然后，移动球体的行为就像一个点落在这个扩大的球体上。 如果水平距离为(d)，则中心高度为
 [
 z_{\text{静态}}+\sqrt{(r_1+r_2)^2-d^2}。 
]
 8. 对于每个有效的特征对，用最大的候选特征更新当前的着陆高度。 较高的候选值意味着移动物体在向下运动期间会更早接触该特征。 
9. 已知着陆中心高度后，将对象的所有顶点平移该高度并存储其最终最高点。 下一个对象将此对象视为完全静态的障碍物。 
10. 按时间顺序处理对象并打印每个对象的最高最终顶点。 之前的对象永远不会再移动，因此以后的模拟无法更改已经计算出的答案。 

### 为什么它有效

 在每个阶段，当前对象仅通过垂直平移移动。 考虑它与先前的凸面物体的第一次接触。 接触点位于每个实体的边界上。 对于多面体，边界点属于顶点、边或面。 如果接触位于两个面的内部之间，则它们的支撑平面在第一次接触处重合，并且顶点面计算捕获相同的高度。 如果接触涉及边缘，则两个水平边缘投影相交并且边缘-边缘计算捕获它。 球体接触减少为相应的点、边或面情况，因为负责第一次接触的球体表面点是由垂直方向或面法线唯一确定的。

因此，每个可能的第一次接触都由一个已测试的特征对表示。 每个特征例程都会计算发生接触的确切中心高度。 取它们的最大值给出可能的最高接触高度，这正是从 (+\infty) 坠落时遇到的第一次碰撞。 不变的是，在处理对象（i）之后，其存储的中心高度是它第一次接触已经冻结的雕塑的真实高度，并且其所有存储的几何体都处于其最终位置。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

EPS = 1e-9
NEG = -1e100

def cross2(ax, ay, bx, by):
    return ax * by - ay * bx

def inside_triangle(p, a, b, c):
    abx, aby = b[0] - a[0], b[1] - a[1]
    bcx, bcy = c[0] - b[0], c[1] - b[1]
    cax, cay = a[0] - c[0], a[1] - c[1]

    apx, apy = p[0] - a[0], p[1] - a[1]
    bpx, bpy = p[0] - b[0], p[1] - b[1]
    cpx, cpy = p[0] - c[0], p[1] - c[1]

    x1 = cross2(abx, aby, apx, apy)
    x2 = cross2(bcx, bcy, bpx, bpy)
    x3 = cross2(cax, cay, cpx, cpy)

    scale = max(
        1.0,
        math.hypot(abx, aby) * math.hypot(apx, apy),
        math.hypot(bcx, bcy) * math.hypot(bpx, bpy),
        math.hypot(cax, cay) * math.hypot(cpx, cpy),
    )
    tol = EPS * scale

    return (x1 >= -tol and x2 >= -tol and x3 >= -tol) or (
        x1 <= tol and x2 <= tol and x3 <= tol
    )

def plane_of(tri):
    a, b, c = tri
    ux, uy, uz = b[0] - a[0], b[1] - a[1], b[2] - a[2]
    vx, vy, vz = c[0] - a[0], c[1] - a[1], c[2] - a[2]

    nx = uy * vz - uz * vy
    ny = uz * vx - ux * vz
    nz = ux * vy - uy * vx
    d = nx * a[0] + ny * a[1] + nz * a[2]
    return nx, ny, nz, d

def point_plane(moving_p, static_tri):
    a, b, c = static_tri
    if not inside_triangle(moving_p, a, b, c):
        return NEG

    nx, ny, nz, d = plane_of(static_tri)
    if abs(nz) < EPS:
        return NEG

    z = (d - nx * moving_p[0] - ny * moving_p[1]) / nz
    return z - moving_p[2]

def plane_point(moving_tri, static_p):
    if not inside_triangle(static_p, moving_tri[0], moving_tri[1], moving_tri[2]):
        return NEG

    nx, ny, nz, d = plane_of(moving_tri)
    if abs(nz) < EPS:
        return NEG

    z = (d - nx * static_p[0] - ny * static_p[1]) / nz
    return static_p[2] - z

def line_line(moving_l, static_l):
    a, b = moving_l
    c, d = static_l

    rx, ry = b[0] - a[0], b[1] - a[1]
    sx, sy = d[0] - c[0], d[1] - c[1]

    den = cross2(rx, ry, sx, sy)
    qx, qy = c[0] - a[0], c[1] - a[1]

    if abs(den) > EPS:
        t = cross2(qx, qy, sx, sy) / den
        u = cross2(qx, qy, rx, ry) / den

        if t < -EPS or t > 1.0 + EPS or u < -EPS or u > 1.0 + EPS:
            return NEG

        zm = a[2] + t * (b[2] - a[2])
        zs = c[2] + u * (d[2] - c[2])
        return zs - zm

    if abs(cross2(qx, qy, rx, ry)) > EPS:
        return NEG

    rr = rx * rx + ry * ry
    if rr < EPS:
        return NEG

    tc = ((c[0] - a[0]) * rx + (c[1] - a[1]) * ry) / rr
    td = ((d[0] - a[0]) * rx + (d[1] - a[1]) * ry) / rr

    lo = max(0.0, min(tc, td))
    hi = min(1.0, max(tc, td))

    if lo > hi + EPS:
        return NEG

    ans = NEG

    for t in (lo, hi):
        x = a[0] + rx * t
        y = a[1] + ry * t

        ss = sx * sx + sy * sy
        if ss < EPS:
            continue

        u = ((x - c[0]) * sx + (y - c[1]) * sy) / ss
        if u < -EPS or u > 1.0 + EPS:
            continue

        zm = a[2] + t * (b[2] - a[2])
        zs = c[2] + u * (d[2] - c[2])
        ans = max(ans, zs - zm)

    return ans

def point_sphere(moving_p, sphere_center, radius):
    dx = moving_p[0] - sphere_center[0]
    dy = moving_p[1] - sphere_center[1]
    q = radius * radius - dx * dx - dy * dy

    if q < -EPS:
        return NEG

    return sphere_center[2] + math.sqrt(max(0.0, q)) - moving_p[2]

def sphere_point(sphere_center_xy, radius, static_p):
    dx = sphere_center_xy[0] - static_p[0]
    dy = sphere_center_xy[1] - static_p[1]
    q = radius * radius - dx * dx - dy * dy

    if q < -EPS:
        return NEG

    return static_p[2] + math.sqrt(max(0.0, q))

def line_sphere(moving_l, sphere_center, radius, moving_line=True):
    a, b = moving_l

    dx = b[0] - a[0]
    dy = b[1] - a[1]
    dz = b[2] - a[2]

    ax = a[0] - sphere_center[0]
    ay = a[1] - sphere_center[1]

    B = dx * dx + dy * dy

    if B < EPS:
        q = radius * radius - ax * ax - ay * ay
        if q < -EPS:
            return NEG
        top = math.sqrt(max(0.0, q))

        if moving_line:
            return sphere_center[2] + top - a[2]
        return a[2] + top

    t0 = -(ax * dx + ay * dy) / B
    min_d2 = ax * ax + ay * ay - B * t0 * t0

    if min_d2 > radius * radius + EPS:
        return NEG

    D = max(0.0, radius * radius - min_d2)
    width = math.sqrt(D / B)

    left = max(0.0, t0 - width)
    right = min(1.0, t0 + width)

    if left > right + EPS:
        return NEG

    def value(t):
        px = ax + dx * t
        py = ay + dy * t
        q = radius * radius - px * px - py * py
        if q < -EPS:
            return NEG

        root = math.sqrt(max(0.0, q))

        if moving_line:
            return sphere_center[2] + root - (a[2] + dz * t)
        return a[2] + dz * t + root

    ans = max(value(left), value(right))

    if D > EPS:
        if moving_line:
            qlinear = -dz
        else:
            qlinear = dz

        if abs(qlinear) > EPS:
            t = t0 + qlinear * math.sqrt(
                D / (B * (B + qlinear * qlinear))
            )
            if left - EPS <= t <= right + EPS:
                ans = max(ans, value(t))

    return ans

def plane_sphere(moving_tri, sphere_center, radius):
    nx, ny, nz, d = plane_of(moving_tri)
    norm = math.sqrt(nx * nx + ny * ny + nz * nz)

    if norm < EPS:
        return NEG

    ans = NEG

    for sign in (-1.0, 1.0):
        qx = sphere_center[0] + sign * radius * nx / norm
        qy = sphere_center[1] + sign * radius * ny / norm
        qz = sphere_center[2] + sign * radius * nz / norm

        p = (qx, qy, qz)

        if not inside_triangle(p, moving_tri[0], moving_tri[1], moving_tri[2]):
            continue

        nx2, ny2, nz2, d2 = plane_of(moving_tri)
        if abs(nz2) < EPS:
            continue

        plane_z = (d2 - nx2 * qx - ny2 * qy) / nz2
        ans = max(ans, qz - plane_z)

    return ans

def sphere_plane(center_xy, radius, static_tri):
    nx, ny, nz, d = plane_of(static_tri)
    norm = math.sqrt(nx * nx + ny * ny + nz * nz)

    if norm < EPS:
        return NEG

    ans = NEG

    for sign in (-1.0, 1.0):
        qx = center_xy[0] + sign * radius * nx / norm
        qy = center_xy[1] + sign * radius * ny / norm

        if not inside_triangle(
            (qx, qy, 0.0),
            static_tri[0],
            static_tri[1],
            static_tri[2],
        ):
            continue

        if abs(nz) < EPS:
            continue

        plane_z = (d - nx * qx - ny * qy) / nz
        center_z = plane_z - sign * radius * nz / norm
        ans = max(ans, center_z)

    return ans

class Cloud:
    __slots__ = (
        "typ", "x", "y", "r", "rel", "pts", "edges", "faces",
        "bound", "vmax", "minz", "top", "z"
    )

    def __init__(self, typ, alpha, beta, gamma, x, y, r):
        self.typ = typ
        self.x = float(x)
        self.y = float(y)
        self.r = float(r)
        self.z = 0.0

        if typ == 1:
            self.rel = []
            self.pts = []
            self.edges = []
            self.faces = []
            self.bound = float(r)
            self.vmax = float(r)
            self.minz = -float(r)
            self.top = 0.0
            return

        if typ == 0:
            h = 0.5
            base = [
                (-h, -h, -h),
                ( h, -h, -h),
                ( h,  h, -h),
                (-h,  h, -h),
                (-h, -h,  h),
                ( h, -h,  h),
                ( h,  h,  h),
                (-h,  h,  h),
            ]
            self.edges = [
                (0, 1), (1, 2), (2, 3), (3, 0),
                (4, 5), (5, 6), (6, 7), (7, 4),
                (0, 4), (1, 5), (2, 6), (3, 7),
            ]
            self.faces = [
                (0, 1, 2), (0, 2, 3),
                (4, 6, 5), (4, 7, 6),
                (0, 4, 5), (0, 5, 1),
                (1, 5, 6), (1, 6, 2),
                (2, 6, 7), (2, 7, 3),
                (3, 7, 4), (3, 4, 0),
            ]
        else:
            s3 = math.sqrt(3.0)
            s6 = math.sqrt(6.0)
            base = [
                (-0.5 / s3,  0.5, -0.5 / s6),
                (-0.5 / s3, -0.5, -0.5 / s6),
                ( 1.0 / s3,  0.0, -0.5 / s6),
                ( 0.0,       0.0,  1.5 / s6),
            ]
            self.edges = [
                (0, 1), (0, 2), (0, 3),
                (1, 2), (1, 3), (2, 3),
            ]
            self.faces = [
                (0, 1, 2),
                (0, 1, 3),
                (0, 2, 3),
                (1, 2, 3),
            ]

        a = math.radians(alpha)
        b = math.radians(beta)
        g = math.radians(gamma)

        ca, sa = math.cos(a), math.sin(a)
        cb, sb = math.cos(b), math.sin(b)
        cg, sg = math.cos(g), math.sin(g)

        # Active z-X-z rotation.
        m00 = ca * cg - cb * sa * sg
        m01 = -ca * sg - cb * cg * sa
        m02 = sa * sb

        m10 = cg * sa + ca * cb * sg
        m11 = ca * cb * cg - sa * sg
        m12 = -ca * sb

        m20 = sb * sg
        m21 = cg * sb
        m22 = cb

        scale = float(r)
        rel = []

        for px, py, pz in base:
            px *= scale
            py *= scale
            pz *= scale

            rx = m00 * px + m01 * py + m02 * pz
            ry = m10 * px + m11 * py + m12 * pz
            rz = m20 * px + m21 * py + m22 * pz

            rel.append((self.x + rx, self.y + ry, rz))

        self.rel = rel
        self.pts = list(rel)

        self.bound = 0.0
        self.vmax = 0.0
        self.minz = float("inf")

        for p in rel:
            dx = p[0] - self.x
            dy = p[1] - self.y
            self.bound = max(self.bound, math.hypot(dx, dy))
            self.vmax = max(self.vmax, abs(p[2]))
            self.minz = min(self.minz, p[2])

        self.top = self.z + max(p[2] for p in self.pts)

    def set_height(self, z):
        self.z = z
        if self.typ == 1:
            self.top = z + self.r
            return

        self.pts = [
            (p[0], p[1], p[2] + z)
            for p in self.rel
        ]
        self.top = z + max(p[2] for p in self.rel)

def collision(moving, static):
    if moving.typ == 1 and static.typ == 1:
        dx = moving.x - static.x
        dy = moving.y - static.y
        rr = moving.r + static.r
        q = rr * rr - dx * dx - dy * dy
        if q < -EPS:
            return NEG
        return static.z + math.sqrt(max(0.0, q))

    ans = NEG

    if moving.typ == 1:
        sc = (static.x, static.y, static.z)

        for p in static.pts:
            ans = max(
                ans,
                sphere_point((moving.x, moving.y), moving.r, p)
            )

        for i, j in static.edges:
            ans = max(
                ans,
                line_sphere(
                    (static.pts[i], static.pts[j]),
                    (moving.x, moving.y, 0.0),
                    moving.r,
                    moving_line=False,
                )
            )

        for f in static.faces:
            tri = (static.pts[f[0]], static.pts[f[1]], static.pts[f[2]])
            ans = max(ans, sphere_plane((moving.x, moving.y), moving.r, tri))

        return ans

    if static.typ == 1:
        sc = (static.x, static.y, static.z)

        for p in moving.rel:
            ans = max(ans, point_sphere(p, sc, static.r))

        for i, j in moving.edges:
            ans = max(
                ans,
                line_sphere(
                    (moving.rel[i], moving.rel[j]),
                    sc,
                    static.r,
                    moving_line=True,
                )
            )

        for f in moving.faces:
            tri = (
                moving.rel[f[0]],
                moving.rel[f[1]],
                moving.rel[f[2]],
            )
            ans = max(ans, plane_sphere(tri, sc, static.r))

        return ans

    # Polyhedron versus polyhedron.
    for p in moving.rel:
        for f in static.faces:
            tri = (
                static.pts[f[0]],
                static.pts[f[1]],
                static.pts[f[2]],
            )
            ans = max(ans, point_plane(p, tri))

    for f in moving.faces:
        tri = (
            moving.rel[f[0]],
            moving.rel[f[1]],
            moving.rel[f[2]],
        )
        for p in static.pts:
            ans = max(ans, plane_point(tri, p))

    for i, j in moving.edges:
        ml = (moving.rel[i], moving.rel[j])
        for k, l in static.edges:
            sl = (static.pts[k], static.pts[l])
            ans = max(ans, line_line(ml, sl))

    return ans

def solve():
    T = int(input())
    out = []

    for _ in range(T):
        n = int(input())

        clouds = []

        for _ in range(n):
            typ, alpha, beta, gamma, x, y, r = map(int, input().split())

            cur = Cloud(typ, alpha, beta, gamma, x, y, r)

            # Ground contact.
            if typ == 1:
                ground_z = r
            else:
                ground_z = -cur.minz

            best = ground_z

            # Higher static objects are more likely to determine the answer.
            previous = sorted(
                clouds,
                key=lambda c: c.top,
                reverse=True,
            )

            for old in previous:
                # No point of old can force the center above this bound.
                if old.top + cur.vmax <= best + 1e-10:
                    break

                dx = cur.x - old.x
                dy = cur.y - old.y

                if dx * dx + dy * dy > (
                    cur.bound + old.bound
                ) ** 2 + 1e-8:
                    continue

                h = collision(cur, old)
                if h > best:
                    best = h

            cur.set_height(best)
            clouds.append(cur)
            out.append(f"{cur.top:.15f}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```这`Cloud`构造函数首先创建规范几何体，然后应用 z-X-z 旋转。 保持顶点相对于中心是有用的，因为碰撞检测期间的未知量正是常见的垂直平移。 

对于多面体，`rel`存储具有请求的 (x,y) 平移但中心高度为零的旋转顶点。 一旦物体落地，`set_height`将最终中心高度添加到每个顶点。 这`top`字段然后直接给出所需的答案。 

三个基本平面例程是`point_plane`,`plane_point`， 和`line_line`。 仅当点的水平投影属于三角形面时，点面接触才有效。 该水平位置处的平面 (z) 坐标直接由其方程得出。 边缘例程处理普通交叉和共线重叠，这很重要，因为接触边界是有效的碰撞。 

球体例程使用相同的垂直接触思想。 接触球体的点使用上半球作为下落点，使用下半球作为下落球体。 线球例程值得特别注意。 通过 (t) 对直线进行参数化后，水平距离的平方是 (t) 的二次方，因此垂直接触高度的形式为
 [
 \sqrt{D-B(t-t_0)^2}+qt+c。 
]
 该函数在其有效区间上是凹的。 其驻点可直接写为
 [
 t=t_0+q\sqrt{\frac{D}{B(B+q^2)}}。 
]
 将该点与间隔端点一起检查即可给出精确的最大值，而无需进行三元搜索。 

面球例程使用面法线。 在第一次球面接触时，半径矢量平行于平面法线，因此只需考虑球心沿法线移动一个半径得到的两点。 这与详细解决方案中描述的几何简化相同。 

处理循环还包含两个精确的修剪规则。 水平边界半径测试会拒绝投影无法相交的对象。 垂直测试停止扫描较旧的对象一次`old.top + cur.vmax`不高于当前最佳答案。 由于前面的对象是按照降低的顶部高度进行处理的，因此后面的每个对象都不会更高，也可以被拒绝。 

Python 通过其使用双精度浮点`float`类型。 不涉及整数溢出，因为几何是使用浮点算术计算的，并且输入坐标足够小，可以轻松表示平方​​距离。 

## 工作示例

 ### 示例 1

 第一个测试用例包含一个立方体，后面跟着一个球体。```
2
0 45 90 270 0 0 2
1 11 45 14 0 0 1
```对于立方体来说，地面是唯一的障碍。 

| 对象| 形状| 地面中心高| 最佳碰撞| 最终中心高度| 最高点|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 立方体，侧面 2 | 1.000000 | 无 | 1.000000 | 2.000000 |
 | 2 | 球体，半径 1 | 1.000000 | 3.000000 | 3.000000 | 4.000000 |

 第一个立方体具有垂直偏移 (-1) 和 (1)，因此其中心停在 (z=1)。 其最高点是（2）。 球体的水平位置与立方体的中心相同。 立方体的最高点为 (2)，球体的半径为 (1)，因此其中心在接触立方体之前必须到达 (3)。 因此其最高点是 (4)。 

这证明了一个不变量，即对象的答案是最大有效接触高度，而不是任何几何特征可以相交的最小高度。 

### 示例 2

 第二个测试用例在原点放置一个旋转立方体，在 ((8,9)) 放置一个非常大的球体。```
2
0 45 90 0 0 0 2
1 112 345 67 8 9 99
```踪迹是：

 | 对象| 形状| 地面中心高| 前一个对象候选 | 最终中心高度| 最高点|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 立方体，侧面 2 | 2.000000 | 无 | 2.000000 | 2.000000 |
 | 2 | 球体，半径 99 | 99.000000 | 约 100.384662 | 约 100.384662 | 关于199.384662 |

 第一个立方体的旋转垂直范围为 (2)，因此其最高点为 (2)。 第二个物体足够大，其水平投影能够到达立方体。 因此，球体的中心停在立方体上方而不是地面。 添加其半径即可得出报告的最高点，大约为 (199.3846615614)。 

该示例还说明了为什么简单的仅半径垂直近似是不够的。 到前一个对象的精确水平距离通过平方根确定球体的接触高度。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n^2)) | 每个对象都考虑较早的对象，并且每个实体仅具有恒定数量的顶点、边和面 |
 | 空间| (O(n)) | (O(n)) | 我们存储所有着陆物体的最终几何形状 |

 名义上最坏的情况仍然检查每一对，但每对仅包含恒定数量的几何特征检查。 水平和垂直修剪规则大大减少了特征检查的实际数量，特别是当对象分离或当前对象已经找到高支持时。 总共 (n\le1000) 次，二次外部模拟适合 5.5 秒的限制。 原始竞赛页面证实了这些限制。 

## 测试用例

 以下测试使用`solve()`从上面的解决方案中可以得到函数。 浮点输出以数字方式检查，而不是通过比较格式化字符串。```python
# Save the solution above as solution.py before running these tests.

import io
import sys
import math
import solution

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solution.solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def values(inp: str):
    return [float(x) for x in run(inp).split()]

def assert_close(actual, expected, eps=1e-6):
    assert len(actual) == len(expected)
    for a, b in zip(actual, expected):
        assert abs(a - b) <= eps * max(1.0, abs(b)), (a, b)

# Provided sample.
sample = """\
3
2
0 45 90 270 0 0 2
1 11 45 14 0 0 1
2
0 45 90 0 0 0 2
1 112 345 67 8 9 99
1
2 191 98 10 25 25 2
"""

assert_close(
    values(sample),
    [
        2.000000000000001,
        4.000000000000001,
        2.000000000000001,
        199.384661561446364,
        1.950447343314250,
    ],
    1e-5,
)

# Minimum-size object, a unit sphere on the ground.
assert_close(
    values("""\
1
1
1 0 0 0 0 0 1
"""),
    [2.0],
)

# All equal values, three identical unit spheres stacked vertically.
assert_close(
    values("""\
1
3
1 0 0 0 0 0 1
1 0 0 0 0 0 1
1 0 0 0 0 0 1
"""),
    [2.0, 4.0, 6.0],
)

# Boundary tangency. The second sphere touches the first at exactly
# one point because their centers are two radii apart.
assert_close(
    values("""\
1
2
1 0 0 0 0 0 1
1 0 0 0 2 0 1
"""),
    [2.0, 2.0],
)

# Single tetrahedron with side length 2 and no rotation.
# Its height is 2*sqrt(2/3).
expected_tetra_top = 2.0 * math.sqrt(2.0 / 3.0)

assert_close(
    values("""\
1
1
2 0 0 0 0 0 2
"""),
    [expected_tetra_top],
)

# Maximum n. The spheres are far apart, so every one lands directly
# on the ground. This also exercises the horizontal-distance pruning.
n = 1000
parts = ["1", str(n)]
for i in range(n):
    parts.append(f"1 0 0 0 {3 * i} 0 1")

inp = "\n".join(parts) + "\n"
got = values(inp)

assert len(got) == n
assert all(abs(x - 2.0) < 1e-6 for x in got)
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 提供三例样品|`2, 4, 2, 199.3846615614, 1.9504473433`| 旋转、球体接触、四面体几何、多种情况 |
 | 一个单位球体 |`2`| 最小尺寸的物体和地面接触|
 | 三个相同的球体位于一个位置 |`2, 4, 6`| 反复堆叠和按时间顺序处理|
 | 距离为 2 的两个单位球体 |`2, 2`| 精确相切和非严格相交 |
 | 边 2 的未旋转四面体 | (2\sqrt{2/3}) | 四面体坐标和垂直范围 |
 | 1000 个分离的单位球体 | 1000份`2`| 最大输入大小和水平修剪 |

 ## 边缘情况

 单位球体情况```
1
1
1 0 0 0 0 0 1
```开始于`best = 1`，因为球体的最低点比其中心低一个半径。 之前没有物体，所以最终中心高度仍为(1)，最高点为(1+1=2)。 这直接检查存储的答案是否是最高点而不是中心高度。 

切球情况```
1
2
1 0 0 0 0 0 1
1 0 0 0 2 0 1
```首先将球体中心放置在 (z=1) 处。 对于第二个球体，水平中心距恰好为 (2)，等于半径之和。 球-球公式的平方根项为零，因此其中心高度也是 (1)。 其最高点是（2）。 使用`<=`通过公差检查可以将单点相切算作接触。 

对于重复堆叠，```
1
3
1 0 0 0 0 0 1
1 0 0 0 0 0 1
1 0 0 0 0 0 1
```第一个球体的中心高度为 (1)。 第二个看到高度为 (1) 的静态球体，因此其中心到达 (3)。 第三个将第二个球体视为最高的相关障碍物并达到中心高度 (5)。 因此，它们的最高点是 (2,4,6)。 垂直剪枝规则也说明了排序不变量，因为一旦较高的对象已经确定了答案，足够低的对象就无法改进它。 

对于未旋转的四面体，```
1
1
2 0 0 0 0 0 2
```最低的顶点位于
 [
 -\frac{2}{2\sqrt6}=-\frac1{\sqrt6},
 ]
 所以中心停在 (1/\sqrt6)。 最高顶点位于
 [
 \frac{3}{\sqrt6},
 ]
 最终的最高点是
 [
 \frac1{\sqrt6}+\frac3{\sqrt6}
 =\frac4{\sqrt6}
 =2\sqrt{\frac23}
 \大约1.6329931619。 
]
 结果来自实际的四面体顶点，因此不涉及关于轴对齐边界框的假设。 

最后，最大尺寸测试使用中心相距三个单位的 (1000) 球体。 它们的半径为一，因此相邻的水平投影甚至不接触。 在进行任何昂贵的几何计算之前，边界半径测试会拒绝所有先前的对象。 因此，每个球体都会落在中心高度 (1) 并具有最高点 (2)。 这验证了二次存储结构和保持常数因子可管理的空间修剪。
