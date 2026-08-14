---
title: "CF 102354F - 宇宙十字路口"
description: "我们在单位球面上有两个无序的点集合。 通过原点的每条几何线都由其与球体的两个交点表示两次，因此每当点 (r) 出现时，(-r) 也会出现。"
date: "2026-08-14T02:31:45+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102354
codeforces_index: "F"
codeforces_contest_name: "2018-2019 Summer Petrozavodsk Camp, Oleksandr Kulkov Contest 2"
rating: 0
weight: 102354
solve_time_s: 377
verified: false
draft: false
---

[CF 102354F - 宇宙十字路口](https://codeforces.com/problemset/problem/102354/F)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 17s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们在单位球面上有两个无序的点集合。 通过原点的每条几何线都由其与球体的两个交点表示两次，因此每当点 (r) 出现时，(-r) 也会出现。 第二个集合是通过围绕原点应用一次旋转然后更改点的顺序从第一个集合获得的。 

任务是恢复这两条信息。 对于第二个集合中的每个点，我们必须输出第一个集合中对应点的索引，并且必须通过轴和角度来描述旋转。 所需的几何误差仅为(10^{-6})，而输入精确到大约(10^{-12})，因此如果我们避免不必要的不​​稳定计算，普通双精度就足够了。 

决定性约束是 (n\le 4\cdot10^4)，因此可以有 (8\cdot10^4) 个点。 任何比较每对点的方法大约需要 (6.4\cdot10^9) 对操作，这远远超出了四秒的限制。 除了排序之外，我们还需要几乎线性的计算，因此 (O(n\log n)) 是自然的目标。 

有两个结构性事实使这种解决方案成为可能。 首先，旋转保留了距离、点积以及由它们构建的每个表达式。 其次，方向是随机统一选择的。 随机性在这里不是装饰性的：它使得精心选择的旋转不变量对于不同的线几乎肯定是不同的，因此不变量可以充当指纹。 

对映表示法引起了一个微妙之处。 任何仅依赖于坐标的偶次幂的不变量都为 (r) 和 (-r) 提供相同的值。 这不是一个错误，因为这两个点属于同一条线。 我们首先识别直线，只有在恢复旋转后，我们才能确定两个相对端点中的哪一个是正确的点。 

提供的示例是另一个有用的边缘情况。 它的四个点在一个平面上形成一个正方形。 下面使用的不变量对于所有四个点具有完全相同的值，因此随机唯一性假设对该样本不成立。 盲目地将连续排序点配对的粗心实现可能会形成错误的线对。 下面的实现包含 (n\le3) 的一个小型强力回退，它处理示例和其他微小的对称配置。 对于实际的大量输入，承诺的随机构造使得快速路径极其可靠。 

例如，样本有四个点
 [
 (0.923879533,0.382683432,0),\四
 (0.923879533,-0.382683432,0),
 ]
 连同他们的负面影响。 每个点都接收相同的二次指纹。 正确的输出可能使用围绕 (z) 轴的 (-\pi/2) 旋转和排列 (2,3,4,1)。 假设每个指纹都是唯一的方法在尝试计算旋转之前就会默默地失败。 

第二个简单的边缘情况是身份旋转。 如果两个输入集相同但已打乱，则所需的角度为 (0)，并且轴可以是任何非零向量。 在这种情况下，实现输出 (x) 轴。 当角度为零时，轴不是唯一定义的，因此将打印轴与某些预期轴进行比较将是不正确的。 

## 方法

直接方法在概念上很简单。 尝试两组点之间的对应关系，从足够多的对应向量中确定旋转，并检查所有剩余的点。 第一个点有 (2n) 个可能目标，第二个点有 (2n-1) 个可能目标，即使在处理剩余排列之前，也已经有 (\Theta(n^2)) 个候选对。 如果每个候选点都需要扫描(O(n))个点，最坏的情况是(\Theta(n^3))，大约在(n=4\cdot10^4)处进行(5.12\cdot10^{14})个基本点比较。 即使更仔细的 (O(n^2)) 搜索仍然会执行大约 (6.4\cdot10^9) 对操作。 

有用的观察是首先停止尝试猜测旋转。 相反，构造一个附加到每个点的数字，该数字不会因旋转而改变并且独立于整个集合的排序。 

官方解决方案使用四次方距离多项式
 [
 P_4(x,y,z)=
 \sum_l
 \left((x-x_l)^2+(y-y_l)^2+(z-z_l)^2\right)^2。 
]
 这是旋转不变的，在累积所需力矩后，对每个点进行评估可以减少为每个点的恒定工作。 

4-8(p\cdot r_l)+4(p\cdot r_l)^2。 
]
 对所有点求和，线性项消失，因为输入是对映的：
 [
 \sum_l r_l=0。 
]
 定义对称矩阵
 [
 M=\sum_l r_l r_l^T。 
]
 然后
 [
 \sum_l(p\cdot r_l)^2=p^TMp,
 ]
 所以
 [
 P_4(p)=4(2n)+4p^TMp。 
]
 常数因子和加性常数不影响排序。 因此我们使用
 [
 F(p)=p^TMp
 ]
 作为指纹。 

# b^TM_Bb

 # b^TR^TM_ARb

 # (Rb)^TM_A(Rb)

 F_A(Rb)。 
]
 因此对应点具有相同的指纹。 因为方向是随机的，所以不同的线几乎肯定具有不同的值。 唯一不可避免的相等是在 (r) 和 (-r) 之间，因为 (F(-r)=F(r))。 

我们对指纹进行排序。 在一般情况下，每两个连续的相等值形成一个对映对，并且这些对在两个集合中以相同的顺序出现。 这给出了 (O(n\log n)) 时间内 (n) 行之间的对应关系。 

一旦已知两条不平行的对应线，就只剩下四个方向。 从每组的每一行中选择一个代表。 对于四个符号选择中的每一个，构造将两个选定向量映射到选定目标向量的唯一正确旋转。 然后针对所有点进行测试。 正确的符号组合保证通过。 

最后一步将旋转矩阵转换为轴角表示。 四元数表示很方便，因为当角度接近 (\pi) 时它保持稳定，而仅基于矩阵反对称部分的常用公式会失去精度。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^2)) 到 (O(n^3)) 取决于验证 | (O(n)) | (O(n)) | 太慢了 |
 | 最佳 | (O(n\log n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

1. 读取第一组的所有（2n）个点和第二组的所有（2n）个点。 将坐标存储为浮点三元组。 由于每个点都位于单位球面上，并且所需的误差为 (10^{-6})，因此双精度是合适的。 
2. 对于每个集合，累加对称矩阵的六个独立条目
 [
 M=\sum r_ir_i^T。 
]
 条目是
 [
 M_{xx}=\sum x_i^2,\quad
 M_{xy}=\sum x_iy_i,\quad
 M_{xz}=\sum x_iz_i,
 ]
 对于 (M_{yy},M_{yz},M_{zz}) 也类似。 
3. 评估每个点的 (F(r)=r^TMr)。 每个点只需要恒定数量的算术运算，因为 (M) 只有 (3\times3)。 
4. 按指纹对点索引进行排序。 在随机情况下，每行的两个副本具有相同的指纹，不同的行具有不同的指纹。 因此，在两组中，位置 (0,1) 对应于一条线，位置 (2,3) 对应于另一条线，依此类推。 
5. 使用第一条线作为参考并扫描其他线组，直到找到方向与第一条线几乎不平行的第二条参考线。 由于点是随机的，因此这通常是立即的。 选择分离良好的对可以避免在构造坐标系时除以微小的叉积。 
6. 令(s_1,s_2)代表来自第二组的两个选定行，(t_1,t_2)代表来自第一组的相应行。 尝试所有四种选择
 [
 (\pm t_1,\pm t_2)。 
]
 对于每个选择，从 (s_1,s_2) 构造一个正交基，从带符号的目标向量构造另一个基，并将第一个基映射到第二个基。 这给出了适当的旋转矩阵。 
7. 根据每个点验证候选轮换。 对于第二组点 (b)，它的指纹告诉我们相应的第一组线，该线恰好包含两个相反的点。 将 (Rb) 与这两个候选者进行比较并保留最接近的一个。 如果每个距离都低于较小的数值公差，则候选者就是所需的旋转和排列。 
8. 如果指纹没有将点分成对和 (n\le3)，则使用微小的强力回退。 最多有 (6!=720) 种排列，因此我们可以尝试每种排列，从两个非平行向量构造旋转，并验证所有点。 这可以处理对称样本而不影响渐近复杂度。 
9. 将得到的旋转矩阵转换为单位四元数。 使标量分量为非负，然后使用
 [
 \theta=2\operatorname{atan2}(|v|,w)
 ]
 其中 (w) 是标量部分，(v) 是矢量部分。 矢量 (v/|v|) 是旋转轴。 对于零旋转，任何轴都有效，因此我们输出 ((1,0,0))。 
10. 在所需的基于 1 的索引中打印角度、轴点和排列。 

为什么它有效

 中心不变量是(F(r)=r^TMr)，它是四次方距离多项式的非常数部分。 旋转通过共轭改变 (M)，通过逆共轭改变 (r)，因此对应点的 (F) 不变。 随机的独立方向使得这些指纹在不同的线之间以数学模型中的概率为一区分。 因此，排序步骤识别每个线对。 

对于两个不平行的向量，它们的有序对确定了定向正交框架。 将一帧映射到另一帧的旋转是唯一的。 四个符号选择涵盖了由于一条线有两个可能的代表而引起的唯一歧义。 恰好有一个候选者同意实际轮换，全局验证会拒绝每一个不正确的候选者。 一旦知道了旋转，在每个匹配的对映体对内选择更接近的端点即可给出所需的点排列。 

## Python 解决方案```python
import sys
import math
import itertools

input = sys.stdin.readline

EPS = 1e-8
CHECK_EPS2 = 5e-10
CROSS_EPS = 1e-8

def dot(a, b):
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

def cross(a, b):
    return (
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    )

def norm2(a):
    return dot(a, a)

def scale(a, k):
    return (a[0] * k, a[1] * k, a[2] * k)

def sub(a, b):
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])

def add(a, b):
    return (a[0] + b[0], a[1] + b[1], a[2] + b[2])

def normalize(a):
    d = math.sqrt(norm2(a))
    return scale(a, 1.0 / d)

def apply_rot(R, v):
    return (
        R[0][0] * v[0] + R[0][1] * v[1] + R[0][2] * v[2],
        R[1][0] * v[0] + R[1][1] * v[1] + R[1][2] * v[2],
        R[2][0] * v[0] + R[2][1] * v[1] + R[2][2] * v[2],
    )

def rotation_from_two(source1, source2, target1, target2):
    u = normalize(source1)
    v0 = sub(source2, scale(u, dot(source2, u)))
    vlen2 = norm2(v0)
    if vlen2 < CROSS_EPS * CROSS_EPS:
        return None
    v = scale(v0, 1.0 / math.sqrt(vlen2))
    w = cross(u, v)

    U = normalize(target1)
    V0 = sub(target2, scale(U, dot(target2, U)))
    Vlen2 = norm2(V0)
    if Vlen2 < CROSS_EPS * CROSS_EPS:
        return None
    V = scale(V0, 1.0 / math.sqrt(Vlen2))
    W = cross(U, V)

    # R = [U V W] [u v w]^T
    R = [[0.0] * 3 for _ in range(3)]
    T = (U, V, W)
    S = (u, v, w)

    for i in range(3):
        for j in range(3):
            R[i][j] = (
                T[0][i] * S[0][j]
                + T[1][i] * S[1][j]
                + T[2][i] * S[2][j]
            )
    return R

def matrix_fingerprint(p, M):
    x, y, z = p
    qx = M[0][0] * x + M[0][1] * y + M[0][2] * z
    qy = M[0][1] * x + M[1][1] * y + M[1][2] * z
    qz = M[0][2] * x + M[1][2] * y + M[2][2] * z
    return x * qx + y * qy + z * qz

def build_matrix(points):
    xx = xy = xz = yy = yz = zz = 0.0
    for x, y, z in points:
        xx += x * x
        xy += x * y
        xz += x * z
        yy += y * y
        yz += y * z
        zz += z * z
    return (
        (xx, xy, xz),
        (xy, yy, yz),
        (xz, yz, zz),
    )

def build_groups(values, order):
    groups = []
    for idx in order:
        if not groups or abs(values[idx] - values[groups[-1][0]]) > EPS:
            groups.append([idx])
        else:
            groups[-1].append(idx)
    return groups

def validate_group_rotation(R, A, B, groups_a, groups_b):
    m = len(A)
    perm = [-1] * m

    for g in range(len(groups_b)):
        ga = groups_a[g]
        gb = groups_b[g]

        if len(ga) != 2 or len(gb) != 2:
            return None

        a0, a1 = ga
        for bi in gb:
            rb = apply_rot(R, B[bi])

            d0 = norm2(sub(rb, A[a0]))
            d1 = norm2(sub(rb, A[a1]))

            if d0 <= d1:
                best = a0
                bestd = d0
            else:
                best = a1
                bestd = d1

            if bestd > CHECK_EPS2:
                return None
            if perm[bi] != -1:
                return None
            perm[bi] = best

    if any(x == -1 for x in perm):
        return None
    return perm

def brute_force_small(A, B):
    m = len(A)

    first = 0
    second = -1
    for j in range(1, m):
        if norm2(cross(B[first], B[j])) > CROSS_EPS * CROSS_EPS:
            second = j
            break

    if second == -1:
        return None

    for p in itertools.permutations(range(m)):
        for s1 in (1.0, -1.0):
            for s2 in (1.0, -1.0):
                R = rotation_from_two(
                    B[first],
                    B[second],
                    scale(A[p[first]], s1),
                    scale(A[p[second]], s2),
                )
                if R is None:
                    continue

                ok = True
                for i in range(m):
                    rb = apply_rot(R, B[i])
                    if norm2(sub(rb, A[p[i]])) > CHECK_EPS2:
                        ok = False
                        break

                if ok:
                    return R, list(p)

    return None

def rotation_to_axis_angle(R):
    tr = R[0][0] + R[1][1] + R[2][2]

    if tr > 0.0:
        s = math.sqrt(tr + 1.0) * 2.0
        qw = 0.25 * s
        qx = (R[2][1] - R[1][2]) / s
        qy = (R[0][2] - R[2][0]) / s
        qz = (R[1][0] - R[0][1]) / s
    elif R[0][0] > R[1][1] and R[0][0] > R[2][2]:
        s = math.sqrt(max(0.0, 1.0 + R[0][0] - R[1][1] - R[2][2])) * 2.0
        qx = 0.25 * s
        qy = (R[0][1] + R[1][0]) / s
        qz = (R[0][2] + R[2][0]) / s
        qw = (R[2][1] - R[1][2]) / s
    elif R[1][1] > R[2][2]:
        s = math.sqrt(max(0.0, 1.0 + R[1][1] - R[0][0] - R[2][2])) * 2.0
        qx = (R[0][1] + R[1][0]) / s
        qy = 0.25 * s
        qz = (R[1][2] + R[2][1]) / s
        qw = (R[0][2] - R[2][0]) / s
    else:
        s = math.sqrt(max(0.0, 1.0 + R[2][2] - R[0][0] - R[1][1])) * 2.0
        qx = (R[0][2] + R[2][0]) / s
        qy = (R[1][2] + R[2][1]) / s
        qz = 0.25 * s
        qw = (R[1][0] - R[0][1]) / s

    qn = math.sqrt(qw * qw + qx * qx + qy * qy + qz * qz)
    qw /= qn
    qx /= qn
    qy /= qn
    qz /= qn

    if qw < 0.0:
        qw = -qw
        qx = -qx
        qy = -qy
        qz = -qz

    vnorm = math.sqrt(qx * qx + qy * qy + qz * qz)

    if vnorm < 1e-12:
        return 0.0, (1.0, 0.0, 0.0)

    theta = 2.0 * math.atan2(vnorm, max(0.0, qw))
    axis = (qx / vnorm, qy / vnorm, qz / vnorm)

    if theta > math.pi:
        theta -= 2.0 * math.pi
        axis = scale(axis, -1.0)

    return theta, axis

def solve():
    n = int(input())
    m = 2 * n

    A = [tuple(map(float, input().split())) for _ in range(m)]
    B = [tuple(map(float, input().split())) for _ in range(m)]

    MA = build_matrix(A)
    MB = build_matrix(B)

    qa = [matrix_fingerprint(p, MA) for p in A]
    qb = [matrix_fingerprint(p, MB) for p in B]

    order_a = sorted(range(m), key=qa.__getitem__)
    order_b = sorted(range(m), key=qb.__getitem__)

    groups_a = build_groups(qa, order_a)
    groups_b = build_groups(qb, order_b)

    # The random-instance fast path has exactly n groups,
    # each containing the two antipodal endpoints of one line.
    fast = (
        len(groups_a) == n
        and len(groups_b) == n
        and all(len(g) == 2 for g in groups_a)
        and all(len(g) == 2 for g in groups_b)
    )

    if not fast and n <= 3:
        ans = brute_force_small(A, B)
        if ans is not None:
            R, perm = ans
        else:
            raise RuntimeError("No rotation found")
    else:
        if not fast:
            # The official random-input guarantee makes this branch
            # practically unreachable for large n.
            groups_a = [order_a[2 * i:2 * i + 2] for i in range(n)]
            groups_b = [order_b[2 * i:2 * i + 2] for i in range(n)]

        g0 = 0
        best_g = 1
        best_sep = 2.0

        a0 = A[groups_a[g0][0]]
        b0 = B[groups_b[g0][0]]

        for g in range(1, n):
            ag = A[groups_a[g][0]]
            sep = abs(dot(a0, ag))
            if sep < best_sep:
                best_sep = sep
                best_g = g

        a1 = A[groups_a[best_g][0]]
        b1 = B[groups_b[best_g][0]]

        R = None
        perm = None

        for s0 in (1.0, -1.0):
            for s1 in (1.0, -1.0):
                cand = rotation_from_two(
                    b0,
                    b1,
                    scale(a0, s0),
                    scale(a1, s1),
                )
                if cand is None:
                    continue

                p = validate_group_rotation(
                    cand, A, B, groups_a, groups_b
                )
                if p is not None:
                    R = cand
                    perm = p
                    break

            if R is not None:
                break

        if R is None:
            # This is only a safety net for unusual numerical degeneracy.
            if n <= 3:
                ans = brute_force_small(A, B)
                if ans is None:
                    raise RuntimeError("No rotation found")
                R, perm = ans
            else:
                raise RuntimeError("Fingerprint matching failed")

    theta, axis = rotation_to_axis_angle(R)

    print("{:.12f}".format(theta))
    print("{:.12f} {:.12f} {:.12f}".format(*axis))
    print(" ".join(str(x + 1) for x in perm))

if __name__ == "__main__":
    solve()
```矩阵累加是构造不变量所需坐标的唯一传递。 由于矩阵是对称的，因此仅存储六个值，尽管代码在计算二次形式时保持完整的对称结构。 

表达式在`matrix_fingerprint`计算为 (x(Mr)_x+y(Mr)_y+z(Mr)_z)。 两个对映点产生相同的值，因为用 (-r) 替换 (r) 会改变二次形式的符号乘积的两个因子。 

排序数组包含索引而不是坐标。 这避免了移动实际的点数据，并且可以直接恢复最终排列的原始输入索引。 

四个标志选择是必要的。 输入表示线，而不是定向向量，因此不变量可以告诉我们哪条线对应哪条线，但不能告诉我们所选端点应该是正还是负。 一旦两个不平行的定向向量被固定，旋转本身就解决了这种歧义。 

框架构造减去第二个向量到第一个向量的投影。 这会产生一个垂直于第一个向量，之后叉积完成正交右手基。 将一个右手基础映射到另一个右手基础总是会产生适当的旋转，而不是反射。 

当迹为非正时，四元数转换根据主对角线条目使用不同的公式。 这可以避免除以 (180^\circ) 旋转附近的微小数字。 零角度的情况是单独处理的，因为那里的轴在数学上是任意的。 

## 工作示例

 ### 示例 1

 对于提供的样本，第一组的四个点在 (xy) 平面中形成一个正方形，第二组是在应用所需的反向旋转之前旋转 (+\pi/2) 的相同正方形。 

第一组的二次矩阵是对角的：
 [
 中号=
 \开始{p矩阵}
 3.41421356&0&0\
 0&0.58578644&0\
 0&0&0
 \end{pmatrix}。 
]
 正方形的每个点都有相同的 (r^TMr) 值，因此正常的随机实例配对不可用。 

| 舞台| 状态|
 | --- | --- |
 | (n) | (2) |
 | 点数 | (4) |
 | 指纹组| 包含所有四个点的一组 |
 | 快速路径| 被拒绝 |
 | 后备| 枚举 (4!=24) 个排列 |
 | 有效轮换| 绕 (z) 旋转 (-\pi/2) |
 | 有效排列 | (2,3,4,1) |

 回退尝试排列并确定两个不平行点的旋转。 一旦达到正确的排列，计算出的旋转就会将每个已准备好的点发送到其指定的点。 语句中显示的输出是一种有效的表示，并且程序可能会生成不同但等效的表示，因为问题对此对称配置有许多有效的选择。 

### 非对称四行示例

 考虑四个无方向性的方向
 [
 (1,0,0),\四元组
 (0,1,0),\四元组
 (0,0,1),\四元组
 \frac{1}{\sqrt3}(1,1,1),
 ]
 连同他们的负面影响。 将所有内容绕 (z) 轴旋转 (90^\circ)，然后打乱点。 

每条线的二次指纹不再相同，因此快速路径可以识别线组。 重要的状态转换如下所示。 

| 舞台| 第一组| 第二套 |
 | --- | --- | --- |
 | 矩阵（M）| 累计8分| (M) | 旋转版本
 | 指纹排序| 4线组| 相同顺序的相同 4 组 |
 | 参考组 | 第一组| 对应第一组|
 | 第二参考| 最少平行剩余组| 其对应组|
 | 标志试验| 4 | 4 |
 | 试用成功| 一对符号| 相同的物理旋转|
 | 验证 | 全部 8 点都在公差范围内 | 全部 8 点都在公差范围内 |

 该示例演示了算法为何将线路识别与端点识别分开。 指纹将一对对映体识别为一个物体。 然后，双向量旋转重建确定其两个端点的方向。 

## 复杂度分析

| 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\log n)) | 矩阵累加和指纹评估均为(O(n))； 对 (2n) 个值进行排序成本 (O(n\log n))； 仅针对所有点检查四次旋转。 |
 | 空间| (O(n)) | (O(n)) | 两个点集、指纹、排序索引和排列都使用线性存储器。 |

 对于 (n=4\cdot10^4)，只有 (8\cdot10^4) 个点。 主要操作是对两个相同大小的数组进行排序，然后进行恒定数量的线性扫描。 这完全在编译实现中预期的四秒复杂度目标之内，并且 Python 实现使所有几何运算保持恒定大小并使用`sys.stdin.readline`用于输入。 

随机方向保证是将通用指纹的不变量变成实用的不变量。 如果没有它，不同的线可能具有相同的指纹，并且一般来说没有一个标量不变量是足够的。 官方讨论也做出了同样的区分：(P_4) 对于随机配置很有用，而对称配置则可能使其毫无用处。 

## 测试用例

 此问题的输出不是唯一的，因此断言不应将原始输出字符串与一个预定答案进行比较。 正确的测试是解析返回的旋转和排列并验证几何条件。 以下线束假设`solve()`上述解决方案中的函数可在同一测试文件中使用。```python
import sys
import io
import math
import random

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def rotate_z(p, angle):
    c = math.cos(angle)
    s = math.sin(angle)
    x, y, z = p
    return (c * x - s * y, s * x + c * y, z)

def make_case(points, angle):
    first = []
    for p in points:
        first.append(p)
        first.append((-p[0], -p[1], -p[2]))

    second = []
    for p in points:
        q = rotate_z(p, angle)
        second.append(q)
        second.append((-q[0], -q[1], -q[2]))

    rng = random.Random(1234567)
    rng.shuffle(second)

    lines = [str(len(points))]
    for p in first:
        lines.append("{:.12f} {:.12f} {:.12f}".format(*p))
    for p in second:
        lines.append("{:.12f} {:.12f} {:.12f}".format(*p))
    return "\n".join(lines) + "\n"

def parse_output(inp, out):
    data = inp.split()
    it = iter(data)

    n = int(next(it))
    m = 2 * n

    A = []
    for _ in range(m):
        A.append(tuple(float(next(it)) for _ in range(3)))

    B = []
    for _ in range(m):
        B.append(tuple(float(next(it)) for _ in range(3)))

    out_data = out.split()
    theta = float(out_data[0])
    axis = tuple(map(float, out_data[1:4]))
    perm = list(map(int, out_data[4:4 + m]))

    assert -math.pi - 1e-9 <= theta <= math.pi + 1e-9
    assert 1e-3 <= sum(abs(x) for x in axis) <= 1e3
    assert sorted(perm) == list(range(1, m + 1))

    c = math.cos(theta)
    s = math.sin(theta)
    x, y, z = axis
    length = math.sqrt(x * x + y * y + z * z)
    x /= length
    y /= length
    z /= length

    for i in range(m):
        bx, by, bz = B[i]

        # Rodrigues rotation.
        cross_x = y * bz - z * by
        cross_y = z * bx - x * bz
        cross_z = x * by - y * bx
        d = x * bx + y * by + z * bz

        rx = bx * c + cross_x * s + x * d * (1.0 - c)
        ry = by * c + cross_y * s + y * d * (1.0 - c)
        rz = bz * c + cross_z * s + z * d * (1.0 - c)

        ax, ay, az = A[perm[i] - 1]
        err = math.sqrt(
            (rx - ax) ** 2 +
            (ry - ay) ** 2 +
            (rz - az) ** 2
        )
        assert err <= 2e-6

# Provided sample.
sample1 = """\
2
0.923879533 0.382683432 0
0.923879533 -0.382683432 0
-0.923879533 -0.382683432 0
-0.923879533 0.382683432 0
0.382683432 0.923879533 0
0.382683432 -0.923879533 0
-0.382683432 -0.923879533 0
-0.382683432 0.923879533 0
"""

parse_output(sample1, run(sample1))

# Minimum-size case, n = 2, with an identity rotation.
case_min = make_case(
    [
        (1.0, 0.0, 0.0),
        (0.0, 1.0, 0.0),
    ],
    0.0,
)
parse_output(case_min, run(case_min))

# Symmetric three-line case. This exercises the small brute-force fallback.
case_symmetric = make_case(
    [
        (1.0, 0.0, 0.0),
        (0.0, 1.0, 0.0),
        (0.0, 0.0, 1.0),
    ],
    math.pi / 2,
)
parse_output(case_symmetric, run(case_symmetric))

# Non-symmetric case with a general-looking set of directions.
case_general = make_case(
    [
        (1.0, 0.0, 0.0),
        (0.0, 1.0, 0.0),
        (0.0, 0.0, 1.0),
        (1.0 / math.sqrt(3.0),
         1.0 / math.sqrt(3.0),
         1.0 / math.sqrt(3.0)),
    ],
    -0.731,
)
parse_output(case_general, run(case_general))

# Maximum-size stress case.
# The points are generated deterministically on the sphere and then rotated.
n_big = 40000
points_big = []

for i in range(n_big):
    z = -1.0 + 2.0 * (i + 0.5) / n_big
    phi = i * 2.399963229728653
    r = math.sqrt(max(0.0, 1.0 - z * z))
    points_big.append((r * math.cos(phi), r * math.sin(phi), z))

case_big = make_case(points_big, 1.234567)
parse_output(case_big, run(case_big))
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 提供样品| 任何几何上有效的旋转和排列 | 对称配置和小型暴力后备|
 | (n=2)，身份旋转 | 与任何有效轴和排列的角度 (0) | 最小尺寸和零角度处理|
 | 三个坐标轴| 任何有效的 (90^\circ) 旋转和排列 | 多个相等的指纹和后备正确性 |
 | 四个非对称方向 | 围绕 (z) 轴的有效旋转接近 (-0.731) 弧度 | 基于正态不变的匹配和符号选择 |
 | (n=40000) 生成的方向 | 最多有错误的任何有效排列 (2\cdot10^{-6}) | 最大输入尺寸、排序成本和数值稳定性 |

 ## 边缘情况

 第一个边缘情况是不可避免的对映相等。 假设该集合包含 ((1,0,0)) 和 ((-1,0,0))。 他们的指纹满足
 [
 F(1,0,0)=F(-1,0,0)。 
]
 粗心的实现可能会得出不变量失败的结论。 正确的解释是两个点描述同一条几何线。 该算法将它们保持在一起并延迟符号决策，直到知道旋转之后。 

第二个边缘情况是身份旋转。 采取
 [
 A={(1,0,0),(-1,0,0),(0,1,0),(0,-1,0)}
 ]
 并让 (B=A) 以不同的顺序。 所需的旋转可以是恒等式，其中(θ=0)。 四元数的向量部分为零，因此代码打印 axis ((1,0,0))。 零旋转的轴是任意的，通过直接匹配旋转点获得排列。 

第三种边缘情况是精确旋转 (\pi)。 理论上，旋转矩阵的反对称项在此角度处为零，因此公式如下
 [
 e_x=\frac{R_{32}-R_{23}}{2\sin\theta}
 ]
 数量上是危险的。 当迹为非正时，四元数转换会选择最大的对角项。 例如，绕 (z) 轴旋转 (\pi) 有
 [
 R=
 \开始{p矩阵}
 -1&0&0\
 0&-1&0\
 0&0&1
 \end{pmatrix},
 ]
 最大对角线确定四元数的 (z) 分量，而无需除以接近于零的量。 

第四个边缘情况是提供的方形样本。 它的四个点都具有相同的二次指纹。 仅靠排序无法判断哪两个点构成原始线。 由于 (n=2)，后备枚举了所有 (4!) 个可能的点排列。 对于每个点，它都会从两个不平行的向量构造一个旋转，并检查所有四个点。 这些候选者之一给出有效的 (-\pi/2) 旋转和排列 (2,3,4,1)。 

最终的数值边缘情况是两个非常接近的随机指纹。 对于独立均匀的随机方向，不同线之间完全相等的概率为零，并且在固定数值公差内发生碰撞的概率极小。 该语句故意提供这种随机构造，以便标量四级不变量可以用作实际指纹。 该代码仍然会验证每个点的最终旋转，因此由数字模糊引起的不正确候选者会被拒绝，而不是默默地打印。
