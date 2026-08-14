---
title: "CF 102354H - 反重力"
description: "我们在原点周围有偶数颗卫星。 每颗卫星都由整数极角、距原点的距离和质量来描述。 没有两颗卫星共享一个角度，因此每个整数角度位置最多包含一颗卫星。"
date: "2026-08-14T12:25:29+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102354
codeforces_index: "H"
codeforces_contest_name: "2018-2019 Summer Petrozavodsk Camp, Oleksandr Kulkov Contest 2"
rating: 0
weight: 102354
solve_time_s: 466
verified: false
draft: false
---

[CF 102354H - 反抗重力](https://codeforces.com/problemset/problem/102354/H)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 46s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们在原点周围有偶数颗卫星。 每颗卫星都由整数极角、距原点的距离和质量来描述。 没有两颗卫星共享一个角度，因此每个整数角度位置最多包含一颗卫星。 

Elphaba 选择一条从原点开始的射线。 她需要沿着该射线的每个引力都精确地沿着射线本身指向原点的每个正距离。 输出是所有此类射线方向的集合，以弧秒为单位测量。 由于直线有两条相反的射线，因此一个有效的对称轴给出了相隔 64,800 角秒的两个输出方向。 

物理公式看起来很复杂，但相关性质却简单得多。 对于通过原点的候选线，线一侧的每颗卫星必须在另一侧有一个匹配的卫星，距原点的距离完全相同，质量也相同。 整个线路的反射必须保留完整的加权卫星配置。 这是问题的中心还原。 同样的对称性观察也是对原始问题的有意简化。 

角度域仅包含 129,600 个整数位置。 尽管该语句允许 (n) 最大为 (2\cdot10^5)，但整数角度的唯一性实际上意味着 (n\le129600)。 二次算法仍然需要在最大可能输入上进行大约 (1.7\cdot10^{10}) 比较，远远超出了两秒的限制。 我们需要固定角度域中的线性或近线性算法。 

有三个容易导致错误实施默默失败的地方。 首先，轴可以正好位于卫星上。 为了```
2
1 0 1
1 64800 1
```该配置的反射轴位于 (0^\circ) 和 (90^\circ)，但 (0^\circ) 轴穿过两个卫星，因此被禁止。 只有 (90^\circ) 线幸存下来，给出```
2
32400.0000000
97200.0000000
```未明确拒绝固定卫星的对称检查器将错误地输出四个方向。 

其次，对称轴不必具有整数角度。 和```
2
1 0 1
1 1 1
```两颗卫星以 (0.5) 角秒的速度穿过线相互反射。 正确的输出是```
2
0.5000000000
64800.5000000000
```仅将答案存储为整数弧秒的解决方案会丢失该轴。 

第三，角度在 (129600) 处环绕。 和```
2
1 1 1
1 129599 1
```卫星关于角度 (0) 对称，所以答案是```
2
0.0000000000
64800.0000000000
```将 (1) 和 (129599) 视为相距较远而不是在圆上相邻的实现可能会错过这种对称性。 

## 方法

 蛮力方法从几何表征开始。 对于每一个可能的反射轴，反射每颗卫星，并检查反射角处是否存在具有相同半径和质量的卫星。 有 (129600) 个可能的双轴位置，每次检查可以检查 (n) 个卫星，给出 (O(129600n))，这大约是最大尺寸的 (1.7\cdot10^{10}) 次操作。 即使从卫星对生成候选轴并直接检查每个候选轴也具有相同的二次瓶颈。 

暴力破解之所以有效，是因为反射正是我们需要的条件，但它会重复检查几乎相同的配置。 关键观察结果是角域是一个长度为 129,600 的固定小圆。 我们可以将完整的卫星信息放入按角度索引的数组中。 每个数组元素都包含对 ((\rho,m))，而空角度会获得一个特殊标记。 

现在问题变成纯粹的组合问题。 假设反射轴有两倍的角度（s），意味着它的实际角度是（s/2）。 角度 (x) 的卫星被反射到

 [
 s-x \pmod {129600}。 
]

 因此，当

 [
 A[x]=A[s-x\bmod129600]
 ]

 对于每个角位置 (x)。 

定义一个反向循环数组

 [
 B[x]=A[-x\bmod129600]。 
]

 那么对称条件变为

 [
 A[x]=B[x-s\bmod129600]。 
]

 换句话说，(A)必须等于(B)的循环移位。 找到两个字符串相等的每个循环移位是一个标准的线性字符串匹配问题。 我们可以复制(B)，使用KMP在(B+B)内搜索(A)，并在(O(129600+n))时间内获得每个可能的反射轴。 

找到对称轴后，我们仍然必须强制要求航线不包含卫星。 如果 (s) 为奇数，则方程

 [
 2x=s\pmod{129600}
 ]

 没有整数解，因此没有卫星可以位于轴上。 如果 (s) 为偶数，则两个固定角位置为

 [
 x=\frac{s}{2}
 ]

 和

 [
 x=\frac{s}{2}+64800。 
]

 如果任一位置包含卫星，则该对称轴将被拒绝。 

最后，一条具有双倍角度的有效线代表两个飞行方向。 它们的倍角为 (s) 和 (s+129600)，因此它们的实际角度为 (s/2) 和 (s/2+64800)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n\cdot129600)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳 | (O(n+129600)) | (O(129600)) | 已接受 |

 ## 算法演练

 1. 创建一个长度为 (L=129600) 的数组 (A)。 在位置 (\varphi_i) 处，存储该对 ((\rho_i,m_i))。 在没有卫星的情况下，在每个角度存储一个特殊的空值。 该对必须包含半径和质量，因为反射必须保留实际的卫星，而不仅仅是其角位置。 
2. 通过设置构造循环反向数组（B）

 [
 B[x]=A[-x\bmod L]。 
]

 在数组形式中，这是 (A[0])，然后是 (A[L-1])、(A[L-2])，依此类推，直到 (A[1])。 这种精确的索引将反射转变为循环移位。 

1. 为 (A) 构建 KMP 前缀函数。 前缀函数让我们能够在线性时间内找到另一个序列中 (A) 的每次出现，而无需在不匹配后重新启动比较。 
2. 扫描序列 (B+B)，但仅考虑从位置 (0,\ldots,L-1) 开始的事件。 如果 (A) 从位置 (p) 开始，则

 [
 A[x]=B[p+x]=A[-p-x]。 
]

 与 (A[x]=A[s-x]) 比较，我们得到

 [
 s\equiv-p\pmod L.
 ]

 因此，每次 KMP 匹配都会给出一个候选双轴角度 (s=(-p)\bmod L)。

1.如果候选者是偶数并且固定位置(s/2)或(s/2+L/2)包含卫星，则拒绝该候选者。 这些正是拟定航线上的点。 
2. 对于剩余的每个 (s)，添加双倍的飞行方向 (s) 和 (s+L)。 存储角度加倍可以在算法过程中完全避免浮点运算，并且还可以准确处理半角秒答案。 
3. 对所有双倍方向进行排序，并将每个方向除以二打印。 偶数倍角打印为小数部分为零的整数，而奇数倍角以`.5`。 

工作原理：有效的飞行路线上的每个点垂直于该路线的重力分量为零。 考虑候选线为 (x) 轴的坐标。 ((a,b)) 处的卫星贡献的垂直分量与

 [
 \frac{m b}{((x-a)^2+b^2)^{3/2}}。 
]

 为了使每个 (x) 的总和消失，每个离轴卫星产生的奇异贡献必须被 ((a,-b)) 处反射的卫星抵消，具有相同的质量，因此具有相同的半径和质量对。 因此，每条有效线都是加权卫星配置的反射对称轴。 相反，如果结构是对称的，则每对反射卫星都会在轴上产生相等且方向相反的垂直力，因此总力处处平行于轴。 KMP 步骤准确地找到这些反射对称性，并且固定位置检查准确地删除了包含卫星的禁止轴。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

L = 129600
EMPTY = (-1, -1)

def solve():
    n = int(input())

    a = [EMPTY] * L

    for _ in range(n):
        rho, phi, mass = map(int, input().split())
        a[phi] = (rho, mass)

    # B[x] = A[-x mod L].
    b = [a[0]] + a[:0:-1]

    # KMP prefix function for pattern A.
    pi = [0] * L
    j = 0

    for i in range(1, L):
        while j and a[i] != a[j]:
            j = pi[j - 1]
        if a[i] == a[j]:
            j += 1
        pi[i] = j

    candidates = []

    # Search A inside B+B.
    # We only need starts p in [0, L-1], so the text needs 2L-1 elements.
    j = 0

    for i in range(2 * L - 1):
        value = b[i] if i < L else b[i - L]

        while j and value != a[j]:
            j = pi[j - 1]

        if value == a[j]:
            j += 1

        if j == L:
            p = i - L + 1
            if p < L:
                s = (-p) % L

                # If s is even, these are the two fixed angular positions.
                if s % 2 == 0:
                    x = s // 2
                    y = x + L // 2
                    if a[x] != EMPTY or a[y] != EMPTY:
                        j = pi[j - 1]
                        continue

                candidates.append(s)

            j = pi[j - 1]

    # Each reflection axis gives two opposite flight directions.
    directions = []
    for s in candidates:
        directions.append(s)
        directions.append(s + L)

    directions.sort()

    out = [str(len(directions))]
    for d in directions:
        if d & 1:
            out.append(f"{d // 2}.5000000000")
        else:
            out.append(f"{d // 2}.0000000000")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```实现的第一部分将整个角度配置存储在长度为 129,600 的数组中。 一个元组 ((\rho,m)) 足以识别反射所需的卫星信息，因为角度已经由数组索引表示。 

施工`a[0] + a[:0:-1]`值得关注。 索引 (x) 处所需的元素是 (A[-x\bmod L])，因此索引零保留在前面，其余元素以相反的顺序出现。 一个正常的`a[::-1]`会将 (A[L-1]) 置于索引零处，并表示移动的反射。 

KMP前缀函数直接使用元组相等。 Python 整数可以保存输入的半径和质量而不会溢出，并且在构造数组后不需要涉及 (\rho_i) 或 (m_i) 的算术。 

KMP 扫描使用 (2L-1) 个文本位置。 从位置 (p<L) 开始的完整模式出现在 (p+L-1) 结束，因此到 (2L-2) 的位置就足够了。 转换`s = (-p) % L`直接从反向序列中的匹配和反射之间的关系得出。 

定点测试与对称性测试是分开的。 当卫星位于该线上时，配置可以真正围绕一条线对称。 Elphaba 无法使用这样的线路，因此必须丢弃这些候选线路。 

输出使用双角表示，直到最终格式化。 这完全避免了浮点舍入。 特别是，(0.5) 角秒处的轴由双角 (1) 表示，并且打印完全如下`0.5000000000`。 

## 工作示例

 ### 示例 1

 对于角度为 (0) 和 (64800) 的两颗卫星，角度阵列包含两个彼此相对的相同条目。 反转后的循环数组与原始数组相同，因此 KMP 找到两个循环匹配。 

| KMP 开始 (p) | 双轴 (s=(-p)\bmod L) | 固定卫星| 有效|
 | --- | --- | --- | --- |
 | 0 | 0 | 角度 0 和 64800 | 没有 |
 | 64800 | 64800 | 无 | 是的 |

 候选值 (s=0) 代表水平轴，但两颗卫星都直接位于其上。 候选值 (s=64800) 代表垂直轴，其上没有卫星。 它的两个飞行方向是（64800/2=32400）和（（64800+129600）/2=97200）。 

### 半弧秒示例

 考虑```
2
1 0 1
1 1 1
```有效的对称轴位于两个占用位置的中间。 

| KMP 开始 (p) | 双轴 | 固定职位| 有效|
 | --- | --- | --- | --- |
 | 129599 | 129599 1 | 无 | 是的 |

 这里(s=1)，所以轴角为(1/2=0.5)。 它的相反方向是(0.5+64800=64800.5)。 

该轨迹说明了为什么双角很有用。 发现或比较半整数答案不需要浮点计算。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n+129600)) | 填充角度数组的成本为 (O(n))，而 KMP 在线性时间内处理固定长度 (129600) 的数组。 |
 | 空间| (O(129600)) | 角度数组、前缀函数、候选项和答案都使用角度域中的线性空间。 |

 有效最大值 (n) 为 129,600，因为所有输入角度都是 129,600 个位置范围内的不同整数。 因此，该算法仅执行数十万次数组操作加上 KMP 比较，这完全符合两秒的限制。 

## 测试用例```python
import sys
import io

L = 129600
EMPTY = (-1, -1)

def solve_case(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_input = input

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    n = int(input())
    a = [EMPTY] * L

    for _ in range(n):
        rho, phi, mass = map(int, input().split())
        a[phi] = (rho, mass)

    b = [a[0]] + a[:0:-1]

    pi = [0] * L
    j = 0

    for i in range(1, L):
        while j and a[i] != a[j]:
            j = pi[j - 1]
        if a[i] == a[j]:
            j += 1
        pi[i] = j

    candidates = []
    j = 0

    for i in range(2 * L - 1):
        value = b[i] if i < L else b[i - L]

        while j and value != a[j]:
            j = pi[j - 1]

        if value == a[j]:
            j += 1

        if j == L:
            p = i - L + 1

            if p < L:
                s = (-p) % L

                if s % 2 == 0:
                    x = s // 2
                    y = x + L // 2
                    if a[x] != EMPTY or a[y] != EMPTY:
                        j = pi[j - 1]
                        continue

                candidates.append(s)

            j = pi[j - 1]

    directions = []
    for s in candidates:
        directions.append(s)
        directions.append(s + L)

    directions.sort()

    out = [str(len(directions))]
    for d in directions:
        if d & 1:
            out.append(f"{d // 2}.5000000000")
        else:
            out.append(f"{d // 2}.0000000000")

    sys.stdin = old_stdin
    input = old_input

    return "\n".join(out)

# Provided sample.
sample1 = """\
2
1 0 1
1 64800 1
"""

assert solve_case(sample1) == """\
2
32400.0000000000
97200.0000000000
""", "sample 1"

# Minimum-size input with a half-arc-second symmetry axis.
case2 = """\
2
1 0 1
1 1 1
"""

assert solve_case(case2) == """\
2
0.5000000000
64800.5000000000
""", "half-arc-second axis"

# Boundary wrap-around: angles 1 and 129599 are reflections around angle 0.
case3 = """\
2
1 1 1
1 129599 1
"""

assert solve_case(case3) == """\
2
0.0000000000
64800.0000000000
""", "circular boundary"

# Four equally spaced identical satellites.
# The axes through the satellites are forbidden.
case4 = """\
4
1 0 1
1 32400 1
1 64800 1
1 97200 1
"""

assert solve_case(case4) == """\
4
16200.0000000000
48600.0000000000
81000.0000000000
113400.0000000000
""", "fourfold symmetry with forbidden axes"

# Maximum possible number of distinct angular positions.
# Every angle is occupied by an identical satellite.
# Exactly the odd doubled axes avoid all occupied fixed positions.
parts = ["129600"]
for phi in range(L):
    parts.append(f"1 {phi} 1")

max_case = "\n".join(parts) + "\n"
max_out = solve_case(max_case)
max_lines = max_out.splitlines()

assert max_lines[0] == "129600", "maximum number of valid directions"
assert len(max_lines) == 129601, "maximum output size"
assert max_lines[1] == "0.5000000000", "first maximum-case direction"
assert max_lines[-1] == "129599.5000000000", "last maximum-case direction"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2`角度 0 和 64800 的卫星 | 2 个方向 | 提供包含卫星的轴的样本和剔除 |
 |`2`角度 0 和 1 的卫星 | 0.5 和 64800.5 | 半弧秒答案|
 |`2`卫星角度 1 和 129599 | 0 和 64800 | 圆形环绕|
 | 四颗相同的卫星分别位于 0、32400、64800、97200 | 16200、48600、81000、113400 | 多重对称性和禁轴 |
 | 每个角度都有 129600 颗相同的卫星 | 129600 路线 | 最大角域尺寸和最大输出尺寸 |

 ## 边缘情况

 第一种边缘情况是对称配置，其轴穿过卫星。 为了```
2
1 0 1
1 64800 1
```候选 (s=0) 是真正的反射对称，因为两个占据的位置都是通过反射固定的。 固定位置检查发现卫星位于位置 (0) 和 (64800)，因此候选人被拒绝。 另一个候选者（s=64800）没有固定的占用位置，并产生两个有效方向（32400）和（97200）。 

第二个边缘情况是半整数方向。 为了```
2
1 0 1
1 1 1
```匹配的循环移位给出(s=1)。 由于 (s) 是奇数，因此不存在满足 (2x=s) 的整数角位置，因此没有卫星可以位于轴上。 该算法存储双倍方向 (1)，然后打印 (1/2=0.5)，并打印相反方向 (64800.5)。 

第三种边缘情况是有角度的环绕。 为了```
2
1 1 1
1 129599 1
```角度 (1) 绕轴 (0) 的反射位置为

 [
 0-1\equiv129599\pmod{129600}。 
]

 圆形反转阵列和 KMP 匹配以完整的角圆为模进行运算，因此在没有角度接近零的特殊情况下找到了这种对称性。 结果方向是 (0) 和 (64800)。 

最终的边缘情况是完全占据的角圆。 对于每个整数角度都有一颗相同的卫星，每个奇数双轴都是有效的反射对称，因为它成对交换整数位置并且没有固定的整数位置。 每个偶数都有固定的占用位置并且被禁止。 ([0,129600)) 中的 (s) 有 64,800 个奇数值，每个产生两个相反的方向，因此输出恰好包含 129,600 个方向。 这也是角度域允许的最大可能输出。
