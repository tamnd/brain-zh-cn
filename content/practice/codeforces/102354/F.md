---
title: "CF 102354F - 宇宙十字路口"
description: "我们得到两个通过原点的 (n) 条无方向线的集合。 每条线由其与单位球体的两个交点表示，因此每个集合包含 (2n) 个单位向量，并且每个向量与其负值一起出现。"
date: "2026-08-15T17:42:08+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102354
codeforces_index: "F"
codeforces_contest_name: "2018-2019 Summer Petrozavodsk Camp, Oleksandr Kulkov Contest 2"
rating: 0
weight: 102354
solve_time_s: 610
verified: false
draft: false
---

[CF 102354F - 宇宙十字路口](https://codeforces.com/problemset/problem/102354/F)

 **评级：** -
 **标签：** -
 **求解时间：** 10m 10s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到两个通过原点的 (n) 条无方向线的集合。 每条线由其与单位球体的两个交点表示，因此每个集合包含 (2n) 个单位向量，并且每个向量与其负值一起出现。 

第二个集合是通过围绕原点应用一次旋转然后排列点从第一个集合获得的。 任务是恢复任何此类旋转和相应的排列。 由于直线没有首选方向，因此旋转后相同直径的任一端点都是可接受的匹配。 

上限 (n=4\cdot 10^4) 意味着每个集合中可以有 (8\cdot 10^4) 个点。 (O(n^2)) 算法已经需要大约 (6.4\cdot 10^9) 对操作，这远远超出了四秒的限制。 我们需要接近 (O(n\log n)) 的东西，每个点只有少量恒定大小的线性代数。 坐标最多有 12 位十进制数字，因此实现时必须小心使用浮点，但该语句给出了足够的精度余量来使用普通双精度。 

第一个微妙之处是对映表示。 如果 (p) 代表一条线，则 (-p) 代表完全相同的线。 任何不被 (p\mapsto -p) 改变的不变量都无法区分这两点。 这是预期的并且无害的，因为在旋转之后我们可以选择给出所需排列的端点。 

第二个微妙之处是二次距离不变量在这里毫无用处。 对于单位向量 (p)，从 (p) 到所有输入点的距离平方和是恒定的，因为输入包含每个点及其相反点。 例如，与```
2
1 0 0
-1 0 0
0 1 0
0 -1 0
1 0 0
-1 0 0
0 1 0
0 -1 0
```恒等旋转和排列 (1\ 2\ 3\ 4) 有效，但每个点的距离平方和完全相同。 基于该数量的方法无法区分任何东西。 

第三个微妙之处是，即使是有用的四次不变量对于特殊对称配置中的不同线也可以具有相同的值。 样品本身具有这样的对称性。 假设前两个排序点始终是相反端点的粗心实现可能会意外地尝试从两个并行向量构造一个框架。 正确的实现显式搜索两个不平行点。 对于该示例，前两个点已经不平行，因此可以使用它们。 

最后，随机方向条件很重要。 四度不变量不是任意点集的确定性完整指纹。 对于方向的均匀随机集合，两条不同的线仅在精确算术中概率为零时才具有相等的不变量，并且绝对不可能发生数值碰撞。 这就是独特性的预期来源。 底层的不变方法也是该问题描述的标准解决方案。 

## 方法

 最直接的蛮力想法是猜测第二个集合的哪两个点对应于第一个集合的两个不平行点。 在为第二对选择适当的符号后，两个定向的非平行向量确定唯一的旋转。 然后我们可以旋转每个点并检查结果集是否与第一个集匹配。 

第二个集合中有 (O(n^2)) 个对的选择，并根据所有 (O(n)) 点检查一个候选轮换的成本 (O(n))。 这给出了 (O(n^3)) 工作。 在 (n=4\cdot10^4) 处，在考虑三维几何的常数因子之前，这大约是 (6.4\cdot10^{13}) 个点检查。 尝试每一个完整的排列更糟糕，有 ((2n)!) 种可能性。 

有用的观察是旋转可以保持距离。 定义

 [
 P_4(p)=\sum_q |p-q|^4,
 ]

 其中总和涵盖一个集合中的所有 (2n) 个点。 如果旋转整个集合，则从一个点到所有其他点的距离多重集不变，因此 (P_4) 不变。 最初的编辑见解是使用这个四度旋转不变量并通过它对点进行排序。 

对于这个特殊问题，我们可以大大简化计算。 让

 [
 M=\sum_q qq^T。 
]

 因为每个 (q) 都是一个单位向量，并且该集合同时包含 (q) 和 (-q)，所以我们有

 [
 \sum_q q=0。 
]

 对于单位向量 (p)，

 [
 |p-q|^2=2-2p\cdot q。 
]

 因此，

 [
 \开始{对齐}
 P_4(p)
 &=\sum_q (2-2p\cdot q)^2\
 &=4\sum_q\left(1-2p\cdot q+(p\cdot q)^2\right)\
 &=4\左(2n+p^TMp\右)。 
\结束{对齐}
 ]

 因子 (4) 和常数 (2n) 不影响排序。 因此我们只需要标量

 [
 s(p)=p^TMp。 
]

 矩阵 (M) 只有六个独立的条目，因此它的构造时间为 (O(n))，每个签名的计算时间为 (O(1))。 然后我们对 (2n) 个签名进行排序，获得两个集合之间的对应关系。 

强力方法之所以有效，是因为两个不平行的对应向量决定了旋转。 它失败了，因为我们不知道哪些向量对应。 不变量为我们提供了这种对应关系，而无需尝试所有对，从而将几何匹配问题简化为对 (O(n)) 标量值进行排序。 

仍然存在符号歧义。 识别出两条对应的线后，选择第二个目标向量的符号，使其与第一个目标向量的点积与第一个集合中的相应点积一致。 然后，两个定向的非平行向量定义正交坐标系，而旋转只是将一个坐标系映射到另一个坐标系的矩阵。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n^3)) | (O(n)) | (O(n)) | 太慢了 |
 | 四度不变量+排序 | (O(n\log n)) | (O(n)) | (O(n)) | 已接受 |

## 算法演练

 1.读取每个集合的(2n)个点。 每个点的单位长度都达到给定的输入精度，并且每个点在同一集合中都有其相反的点。 
2. 对于每个集合，构造对称矩阵

 [
 M=\sum_i r_i r_i^T。 
]

 对于一个点 (r_i=(x_i,y_i,z_i))，它的贡献是

 [
 \开始{p矩阵}
 x_i^2 & x_iy_i & x_iz_i\
 x_iy_i & y_i^2 & y_iz_i\
 x_iz_i & y_iz_i & z_i^2
 \end{pmatrix}。 
]

 只需要存储六个值。 

1. 对于每个点 (p)，计算其标量签名

 [
 s(p)=p^TMp。 
]

 这与四度距离不变量 (P_4(p)) 成正比，因此对应点在精确算术中具有相等的签名。 一条线的对映点也具有相同的签名，这正是我们所期望的模糊性。 

1. 按签名对两个集合的索引进行排序。 对于随机独立方向，不同的线几乎肯定具有不同的签名，因此排序的位置标识相应的线。 如果多个签名由于对称性而重合，则任何与该对称性兼容的对应关系都可能有效。 该样本是一个很小的退化情况，因此实现并不假设特定的排序位置一定是相反的端点。 
2. 取出已排序的第一个集合中的第一个点和第二个集合中处于相同排序位置的点。 然后扫描剩余的排序位置，直到找到另一对非平行向量。 这可以处理在一般情况下连续出现的对映体对，也可以处理多个签名一致的样本。 
3. 令所选择的源向量为(a_0,a_1)，对应的目标向量为(b_0,b_1)。 标准化 (a_0) 和 (b_0)。 对于每个第二个向量，删除其沿第一个向量的分量：

 [
 a_1^\perp=a_1-(a_1\cdot a_0)a_0。 
]

 标准化该向量并对 (b_1) 执行相同的操作。 

1. 用叉积完成右手正交框架的两对：

 [
 a_2=a_0\times a_1^\perp,\qquad
 b_2=b_0\times b_1^\perp。 
]

 如果目标第二个向量的方向错误，请在构建框架之前将 (b_1) 替换为 (-b_1)。 通过比较两个相应的点积来选择符号。 

1. 形成旋转矩阵

 [
 R=
 \开始{b矩阵}
 b_0&b_1^\perp&b_2
 \end{b矩阵}
 \开始{b矩阵}
 a_0&a_1^\perp&a_2
 \end{b矩阵}^T。 
]

 通过构造，(Ra_0=b_0) 和 (Ra_1=\pm b_1)，且符号选择一致。 由于两个源向量不平行，这决定了整个正确的旋转。 

1. 将 (R) 转换为单位四元数，然后转换为轴和角度。 将四元数标量部分取非负给出 ([0,\pi]) 中的角度，它满足所需的间隔。 对于零旋转，任何轴都有效，因此实现使用 (x) 轴。 
2. 对于第二个集合的每个输入点 (b_i)，使用 (R) 旋转它。 从排序位置已经知道其对应的行。 该线有两个候选端点：(a_j) 和(-a_j)。 将旋转点与两者进行比较并选择较接近的端点。 所得索引形成所需的排列。 

工作原理：矩阵 (M) 捕获点集的所有二阶矩，并在旋转 (R) 下变换为 (M'=RMR^T)。 因此对于对应点 (p) 和 (Rp)，

 [
 (Rp)^TM'(Rp)=p^TR^TRMR^TRp=p^TMp。 
]

 因此标量签名被保留。 通过随机方向，它独立地识别每条线，除了不可避免的对映模糊性之外。 一旦选择了两条非平行线对应关系，框架结构就会准确地生成映射这些线的旋转。 由于输入保证存在共同的旋转，因此该旋转将每个剩余的行映射到其对应的行。 最后，比较每条线的两个端点可以解决仅存的符号歧义。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

def dot(a, b):
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

def cross(a, b):
    return (
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    )

def norm(a):
    return math.sqrt(dot(a, a))

def normalize(a):
    d = norm(a)
    return (a[0] / d, a[1] / d, a[2] / d)

def mat_vec(r, v):
    return (
        r[0][0] * v[0] + r[0][1] * v[1] + r[0][2] * v[2],
        r[1][0] * v[0] + r[1][1] * v[1] + r[1][2] * v[2],
        r[2][0] * v[0] + r[2][1] * v[1] + r[2][2] * v[2],
    )

def dist2(a, b):
    x = a[0] - b[0]
    y = a[1] - b[1]
    z = a[2] - b[2]
    return x * x + y * y + z * z

def build_signatures(points):
    m00 = m01 = m02 = 0.0
    m11 = m12 = 0.0
    m22 = 0.0

    for x, y, z in points:
        m00 += x * x
        m01 += x * y
        m02 += x * z
        m11 += y * y
        m12 += y * z
        m22 += z * z

    sig = [0.0] * len(points)

    for i, (x, y, z) in enumerate(points):
        tx = m00 * x + m01 * y + m02 * z
        ty = m01 * x + m11 * y + m12 * z
        tz = m02 * x + m12 * y + m22 * z
        sig[i] = x * tx + y * ty + z * tz

    order = list(range(len(points)))
    order.sort(key=sig.__getitem__)
    return sig, order

def make_frame(a, b):
    a = normalize(a)
    d = dot(a, b)
    v = (
        b[0] - d * a[0],
        b[1] - d * a[1],
        b[2] - d * a[2],
    )
    v = normalize(v)
    w = cross(a, v)
    return (a, v, w)

def frame_rotation(source, target):
    # R = T * S^T, where S and T contain frame vectors as columns.
    r = [[0.0] * 3 for _ in range(3)]

    for i in range(3):
        for j in range(3):
            r[i][j] = (
                target[0][i] * source[0][j]
                + target[1][i] * source[1][j]
                + target[2][i] * source[2][j]
            )

    return r

def rotation_to_axis_angle(r):
    trace = r[0][0] + r[1][1] + r[2][2]

    if trace > 0.0:
        s = math.sqrt(trace + 1.0) * 2.0
        qw = 0.25 * s
        qx = (r[2][1] - r[1][2]) / s
        qy = (r[0][2] - r[2][0]) / s
        qz = (r[1][0] - r[0][1]) / s
    elif r[0][0] >= r[1][1] and r[0][0] >= r[2][2]:
        s = math.sqrt(max(0.0, 1.0 + r[0][0] - r[1][1] - r[2][2])) * 2.0
        qw = (r[2][1] - r[1][2]) / s
        qx = 0.25 * s
        qy = (r[0][1] + r[1][0]) / s
        qz = (r[0][2] + r[2][0]) / s
    elif r[1][1] >= r[2][2]:
        s = math.sqrt(max(0.0, 1.0 - r[0][0] + r[1][1] - r[2][2])) * 2.0
        qw = (r[0][2] - r[2][0]) / s
        qx = (r[0][1] + r[1][0]) / s
        qy = 0.25 * s
        qz = (r[1][2] + r[2][1]) / s
    else:
        s = math.sqrt(max(0.0, 1.0 - r[0][0] - r[1][1] + r[2][2])) * 2.0
        qw = (r[1][0] - r[0][1]) / s
        qx = (r[0][2] + r[2][0]) / s
        qy = (r[1][2] + r[2][1]) / s
        qz = 0.25 * s

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

    theta = 2.0 * math.atan2(vnorm, qw)
    axis = (qx / vnorm, qy / vnorm, qz / vnorm)

    if theta > math.pi:
        theta -= 2.0 * math.pi

    return theta, axis

def solve():
    n = int(input())
    total = 2 * n

    a = [tuple(map(float, input().split())) for _ in range(total)]
    b = [tuple(map(float, input().split())) for _ in range(total)]

    sig_a, order_a = build_signatures(a)
    sig_b, order_b = build_signatures(b)

    a0 = order_a[0]
    b0 = order_b[0]

    # Find two nonparallel pairs. In the generic case positions 0 and 1
    # are antipodes, so the loop naturally skips them.
    chosen = None
    for k in range(1, total):
        ia = order_a[k]
        ib = order_b[k]

        ca = cross(a[a0], a[ia])
        cb = cross(b[b0], b[ib])

        if dot(ca, ca) > 1e-14 and dot(cb, cb) > 1e-14:
            chosen = (ia, ib)
            break

    if chosen is None:
        # This is only relevant for extremely degenerate input.
        # n >= 2 guarantees a valid nonparallel pair under the
        # random-direction condition.
        for ia in range(total):
            if ia == a0:
                continue
            ca = cross(a[a0], a[ia])
            if dot(ca, ca) <= 1e-14:
                continue
            for ib in range(total):
                if ib == b0:
                    continue
                cb = cross(b[b0], b[ib])
                if dot(cb, cb) > 1e-14:
                    chosen = (ia, ib)
                    break
            if chosen is not None:
                break

    a1, b1 = chosen

    a0v = normalize(a[a0])
    b0v = normalize(b[b0])
    a1v = normalize(a[a1])
    b1v = normalize(b[b1])

    da = dot(a0v, a1v)
    db = dot(b0v, b1v)

    # The two corresponding unoriented lines have the same angle.
    # Choose the sign giving the matching oriented dot product.
    if abs(da - db) > abs(da + db):
        b1v = (-b1v[0], -b1v[1], -b1v[2])

    source_frame = make_frame(a0v, a1v)
    target_frame = make_frame(b0v, b1v)

    r = frame_rotation(source_frame, target_frame)

    theta, axis = rotation_to_axis_angle(r)

    # Locate the antipode of every point of A exactly as represented
    # in the input. Decimal parsing preserves the sign symmetry.
    lookup = {}
    for i, p in enumerate(a):
        lookup[p] = i

    opposite = [0] * total
    for i, (x, y, z) in enumerate(a):
        opposite[i] = lookup[(-x, -y, -z)]

    position_b = [0] * total
    for pos, idx in enumerate(order_b):
        position_b[idx] = pos

    permutation = [0] * total

    for j in range(total):
        pos = position_b[j]
        candidate = order_a[pos]
        other = opposite[candidate]

        rb = mat_vec(r, b[j])

        if dist2(rb, a[other]) < dist2(rb, a[candidate]):
            permutation[j] = other + 1
        else:
            permutation[j] = candidate + 1

    print("{:.12f}".format(theta))
    print("{:.12f} {:.12f} {:.12f}".format(axis[0], axis[1], axis[2]))
    print(" ".join(map(str, permutation)))

if __name__ == "__main__":
    solve()
```实现的第一部分构建 (3\times3) 二阶矩矩阵。 由于矩阵是对称的，因此存储的六个条目就足够了。 然后，签名计算将每个点简化为一个二次形式评估。 

排序步骤是唯一渐近昂贵的操作。 Python 的内置排序是在优化的本机代码中实现的，因此对 (8\cdot10^4) 浮点键进行排序完全符合预期的复杂性。 

对选择循环故意检查叉积，而不是假设一对固定的排序位置是不平行的。 对于通用输入，前两个排序点是同一行的两个端点，因此它们不能定义框架。 在示例中，多个签名一致，因此前两个排序点可以来自不同的行。 检查叉积可以处理这两种情况。 

符号调整使用

 [
 |d_a-d_b| \quad\text{与}\quad |d_a+d_b|。 
]

 这比仅检查乘积的符号更好，因为点积可能非常接近于零。 所选择的符号使得两个定向对具有相同的相互角度。 

框架旋转构造为(T S^T)。 由于两个帧都是正交的，因此该矩阵会自动进行适当的旋转，直至浮点误差。 四元数转换避免了当角度接近 (0) 或 (\pi) 时直接从 ((R-R^T)/(2\sin\theta)) 提取轴的数值不稳定。 

最终排列不信任排序期间选择的符号。 每个排序位置标识一条线，因此第一个集合中恰好有两个候选端点。 旋转第二个端点并将其与两个候选点的距离进行比较，可以独立地解析每个点的符号。 

## 工作示例

 ### 示例 1

 该示例有两条线，带有端点

 [
 (\cos22.5^\circ,\pm\sin22.5^\circ,0)
 ]

 以及他们的对立面。 第二组是在平面中旋转的同一对线。 

在这个特殊对称示例中，四级签名不足以区分两条线，因此排序顺序包含多个相等的值。 该算法不假设位置 (0) 和 (2) 是两条线。 它会进行扫描，直到找到两个不平行的对。 

| 算法变量 | 价值观或行为|
 | ---| ---|
 | (n) | (2) |
 | 点数 | (4) |
 | 第一个选定点 | 按排序顺序的第一点 |
 | 第二个选定点| 首先稍后点与它不平行|
 | 源点积 | 大约 (0.70710678) |
 | 符号前的目标点积 | 大约 (-0.70710678) |
 | 目标标志| 否定|
 | 旋转矩阵 | 相当于所需旋转的平面旋转 |
 | 输出角度| ([-\pi,\pi]) | 中任何等效的有效角度
 | 排列| 四个端点的有效匹配 |

 官方示例使用角度(-\pi/2)、轴((0,0,1))和排列(2,3,4,1)。 该程序可以产生不同的有效旋转，因为对称的两行配置允许同一行对应的多个描述。 

### 构造样本 2

 考虑由以下表示的三个源代码行

 [
 a=(1,0,0),
 ]

 [
 b=(0,1,0),
 ]

 和

 [
 c=(0.3,0.4,\sqrt{0.75})。 
]

 第二个集合是通过围绕 (z) 轴将所有内容旋转 (90^\circ) 获得的。 轮换代表是

 [
 (0,1,0),\quad (-1,0,0),\quad
 (-0.4,0.3,\sqrt{0.75})。 
]

 每个点都伴随着它的反面。 

对于第一个集合，将每条线的两个端点相加后，这三条线的二次形式签名与 (2.18)、(2.32) 和 (2.50) 成比例。 不需要确切的值，只需要它们的顺序。

| 算法变量 | 源状态| 目标状态|
 | ---| ---| ---|
 | 第一行签名 | (2.18) | (2.18) |
 | 第二行签名 | （2.32）| （2.32）|
 | 第三行签名| (2.50) | (2.50) |
 | 第一帧向量 | ((1,0,0)) | ((1,0,0)) | ((0,1,0)) | ((0,1,0)) |
 | 第二帧矢量 | ((0,1,0)) | ((0,1,0)) | ((-1,0,0)) | ((-1,0,0)) |
 | 第三帧矢量| ((0,0,1)) | ((0,0,1)) | ((0,0,1)) | ((0,0,1)) |
 | 旋转角度| (90^\circ) | (90^\circ) |
 | 旋转轴| ((0,0,1)) | ((0,0,1)) | ((0,0,1)) | ((0,0,1)) |

 该迹线的重要部分是在旋转之前和之后获得相同的标量签名。 一旦两条非平行线配对，整个旋转矩阵就来自两个正交坐标系。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n\log n)) | 构造矩阵和签名需要 (O(n))，排序 (2n) 个值需要 (O(n\log n))，并且所有剩余的几何形状都是线性的 |
 | 空间| (O(n)) | (O(n)) | 两个点数组、签名、排序索引、对映体映射和排列都使用线性内存 |

 对于 (n\le4\cdot10^4)，每个集合中最多有 (8\cdot10^4) 个点。 该算法仅对每个点执行恒定量的算术加上两种 (8\cdot10^4) 元素，这比任何二次方法更适合四秒限制。 内存使用量也是线性的，并且完全保持在规定的 256 MiB 限制内。 

## 测试用例

 这个问题的输出不是唯一的，因此将输出字符串与官方示例输出进行比较的断言过于严格。 下面的测试工具检查生成的排列是否是所有索引的排列，以及按报告的轴和角度旋转每个第二设置点是否将其置于报告的第一设置点的公差范围内。 它还检查官方示例输出本身。```python
import sys
import io
import math
import random

# The following helpers assume that solve() from the solution above
# has been renamed solve_stream(inp) and returns its printed output.
# In a local test file, replace this wrapper with the submitted solution.

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

def rotate(v, axis, theta):
    x, y, z = v
    ax, ay, az = axis

    c = math.cos(theta)
    s = math.sin(theta)
    d = ax * x + ay * y + az * z

    return (
        x * c + (ay * z - az * y) * s + ax * d * (1.0 - c),
        y * c + (az * x - ax * z) * s + ay * d * (1.0 - c),
        z * c + (ax * y - ay * x) * s + az * d * (1.0 - c),
    )

def valid_output(inp: str, out: str, eps=3e-5) -> bool:
    data = inp.strip().splitlines()
    n = int(data[0])
    m = 2 * n

    first = [tuple(map(float, data[i + 1].split())) for i in range(m)]
    second = [tuple(map(float, data[i + 1 + m].split())) for i in range(m)]

    lines = out.strip().splitlines()
    if len(lines) != 3:
        return False

    theta = float(lines[0])
    axis = tuple(map(float, lines[1].split()))
    perm = list(map(int, lines[2].split()))

    if len(perm) != m:
        return False

    if sorted(perm) != list(range(1, m + 1)):
        return False

    an = math.sqrt(sum(x * x for x in axis))
    if an < 1e-12:
        return False

    axis = tuple(x / an for x in axis)

    for i in range(m):
        rotated = rotate(second[i], axis, theta)
        target = first[perm[i] - 1]

        d2 = sum(
            (rotated[k] - target[k]) ** 2
            for k in range(3)
        )

        if d2 > eps * eps:
            return False

    return True

sample1 = """\
2
0.923879533 0.382683432 0
0.923879533 -0.382683432 0
-0.923879533 -0.382683432 0
-0.923879533 0.382683432 0
0.382683432 0.923879533 0
0.382683432 -0.923879533 0
-0.382683432 -0.923879533 0
-0.382683432 0.923879533
"""

official_sample_output = """\
-1.570796327
0.000000000 0.000000000 1.000000000
2 3 4 1
"""

assert valid_output(sample1, official_sample_output), "official sample"
assert valid_output(sample1, run(sample1)), "sample 1 produced by solution"

def make_case(points, theta, axis, order):
    second = [rotate(p, axis, theta) for p in points]

    shuffled = [second[i] for i in order]

    lines = [str(len(points) // 2)]
    for p in points:
        lines.append("{:.12f} {:.12f} {:.12f}".format(*p))
    for p in shuffled:
        lines.append("{:.12f} {:.12f} {:.12f}".format(*p))

    return "\n".join(lines) + "\n"

# Minimum size, n = 2, and a nontrivial rotation.
r = math.sqrt(0.5)
points_min = [
    (1.0, 0.0, 0.0),
    (-1.0, 0.0, 0.0),
    (0.0, r, r),
    (0.0, -r, -r),
]
case_min = make_case(
    points_min,
    math.pi / 3.0,
    (1.0, 1.0, 1.0),
    [2, 0, 3, 1],
)
assert valid_output(case_min, run(case_min)), "minimum n"

# Identity rotation, with the input already shuffled.
points_identity = [
    (1.0, 0.0, 0.0),
    (-1.0, 0.0, 0.0),
    (0.0, 1.0, 0.0),
    (0.0, -1.0, 0.0),
]
case_identity = make_case(
    points_identity,
    0.0,
    (1.0, 0.0, 0.0),
    [2, 3, 0, 1],
)
assert valid_output(case_identity, run(case_identity)), "zero rotation"

# All invariant values coincide. This is deliberately symmetric.
# The second set has the same order, so the arbitrary tie order is valid.
points_equal = [
    (1.0, 0.0, 0.0),
    (-1.0, 0.0, 0.0),
    (0.0, 1.0, 0.0),
    (0.0, -1.0, 0.0),
    (0.0, 0.0, 1.0),
    (0.0, 0.0, -1.0),
]
case_equal = make_case(
    points_equal,
    math.pi / 2.0,
    (0.0, 0.0, 1.0),
    list(range(6)),
)
assert valid_output(case_equal, run(case_equal)), "equal invariant values"

# Boundary angle close to pi.
s = math.sqrt(3.0) / 2.0
points_pi = [
    (1.0, 0.0, 0.0),
    (-1.0, 0.0, 0.0),
    (0.0, s, 0.5),
    (0.0, -s, -0.5),
    (0.5, 0.5, math.sqrt(0.5)),
    (-0.5, -0.5, -math.sqrt(0.5)),
]
case_pi = make_case(
    points_pi,
    math.pi,
    (0.0, 1.0, 0.0),
    [4, 0, 5, 2, 1, 3],
)
assert valid_output(case_pi, run(case_pi)), "angle pi"

# Maximum-size structural test.
# The test checks the size and permutation structure instead of rotating
# all 80000 points again, which keeps the test harness itself practical.
random.seed(123456)
n = 40000
points_max = []

for _ in range(n):
    x = random.gauss(0.0, 1.0)
    y = random.gauss(0.0, 1.0)
    z = random.gauss(0.0, 1.0)
    q = math.sqrt(x * x + y * y + z * z)
    p = (x / q, y / q, z / q)
    points_max.append(p)
    points_max.append((-p[0], -p[1], -p[2]))

case_max = make_case(
    points_max,
    0.0,
    (1.0, 0.0, 0.0),
    list(range(2 * n)),
)

out_max = run(case_max)
lines_max = out_max.strip().splitlines()
assert len(lines_max) == 3, "maximum size line count"
assert len(lines_max[2].split()) == 2 * n, "maximum size permutation length"
assert sorted(map(int, lines_max[2].split())) == list(range(1, 2 * n + 1)), \
    "maximum size permutation"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 官方样品| 任何几何上有效的输出 | 对称 (n=2) 情况和相等的不变值 |
 | 最小值 (n=2) | 任何有效的旋转和排列| 允许的最小输入和对映点处理 |
 | 身份轮换 | 与任何有效轴和排列的角度 (0) | 零角四元数分支|
 | 对称等签名集| 任何有效的轮换 | 当四级不变量有联系时的行为 |
 | 旋转 (\pi) | 任何带有角度 (\pi) 或等效表示的有效旋转 | 四元数边界处理 |
 | (n=40000) | (n=40000) 所有 (80000) 个索引的有效排列 | 最大输入大小和 (O(n\log n)) 行为 |

 ## 边缘情况

 相反的情况是根本性的而不是病理性的。 为了```
2
1 0 0
-1 0 0
0 1 0
0 -1 0
1 0 0
-1 0 0
0 1 0
0 -1 0
```每条线的两个端点具有相同的四度签名。 该算法从不尝试区分它们。 排序识别一条线，最后的距离比较决定旋转后的点是匹配（p）还是（-p）。 带有排列 (1,2,3,4) 的恒等旋转是有效的。 

零旋转情况在轴角转换中单独处理。 如果旋转矩阵在数值上与恒等式无法区分，则其四元数的向量部分几乎为零。 角度报告为零，轴选择为 ((1,0,0))。 当角度为零时，轴是任意的，因此这是有效的输出。 

该示例说明了不变碰撞。 几条不同的线具有相同的 (P_4) 值，因此盲目假设排序位置 (0) 和 (2) 代表不同线的实现可能会选择两个相反的点，并且无法构建框架。 相反，该实现在扫描排序位置时检查叉积。 在示例中，前两个点不平行，因此它们提供了有效的框架。 

精确旋转 (\pi) 是另一个数值边界。 直接除以 (\sin\theta) 来计算轴是不稳定的，因为 (\sin\pi=0)。 四元数转换避免了除法，并从四元数的向量部分提取轴，因此 (\pi) 旋转测试练习了预期的稳定分支。 

最终的标志选择也是一种边缘情况。 假设不变量正确识别了两条线，但第二个集合恰好列出了相反的端点。 旋转映射 (p) 到 (q) 可能需要将 (p) 映射到 (-q)。 该算法将 (d_a=a_0\cdot a_1) 与 (d_b=b_0\cdot b_1) 和 (-d_b) 进行比较，选择保留角度的方向。 然后在构建排列时独立解决剩余的端点选择。
