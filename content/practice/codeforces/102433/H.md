---
title: "CF 102433H - 枢轴点"
description: "我们在平面上有一组最多 2000 个点，一条线上没有三个点。 风车由一条旋转线和一个当前充当其枢轴的点组成。 该线顺时针旋转。"
date: "2026-08-12T07:35:22+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102433
codeforces_index: "H"
codeforces_contest_name: "2019-2020 ACM-ICPC Pacific Northwest Regional Contest (Div. 1)"
rating: 0
weight: 102433
solve_time_s: 196
verified: true
draft: false
---

[CF 102433H - 枢轴点](https://codeforces.com/problemset/problem/102433/H)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 16s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在平面上有一组最多 2000 个点，一条线上没有三个点。 风车由一条旋转线和一个当前充当其枢轴的点组成。 该线顺时针旋转。 每当它到达另一个点时，该点就成为新的枢轴，而线保持相同的方向并继续旋转。 完成 360 度转弯后，该过程将返回到原始状态。 

问题不是要求我们选择一种特定的起始配置。 我们可以选择任何初始枢轴和任何初始方向。 对于每个这样的风车，我们计​​算每个点成为枢轴的次数，并且我们希望所有可能的风车中任何点的最大可能计数。 

对于 Python 中的二次工作，约束足够小，但对于三次工作则不够。 对于 (n=2000)，(n^2) 约为 400 万，这是实用的。 完整的 (n^3) 计算大约需要 80 亿次运算，远远超出 10 秒的限制。 官方竞赛规范给出了 10 秒的时间限制和 256 MB 的内存限制。 

几何输入也有意为整数值并以 10000 为界，因此叉积和坐标差可以轻松地适合 Python 整数。 因此，除了角度排序之外，该实现可以完全避免数值几何。 在下面的解决方案中，角度仅用于围绕每个枢轴建立圆形排序。 实际的风车转换按该顺序进行索引，因此不使用浮点比较来决定哪个事件先发生。 

第一个边缘情况是可能的最小集合。```
2
0 0
1 0
```只有两个点，因此线在它们之间交替。 在完整的 360 度旋转过程中，每个点都会提升两次。 答案是`2`。 如果粗心的实现将线视为无向对象并仅存储一对点，则只会看到两点之间的一个转换并错误地返回`1`。 

第二个边缘情况是同一几何线的两个方向之间的区别。 为了```
3
-1 0
1 0
0 2
```答案是`2`。 在完整的 360 度旋转过程中，同一对点可能会遇到两次，有向线的每个方向各一次。 处理以 180 度为模的角度会失去这种区别。 

第三种边缘情况是角阶的圆形边界。 如果当前方向接近角度零并且下一个事件正好低于零，则该事件由接近 (2\pi) 的角度表示。 正常的前驱搜索必须从排序数组的第一个条目回绕到最后一个条目。 第一个示例正是模拟了这种情况。 

最后，重复或完全相等的坐标不是有效的情况。 输入描述了一组点，几何过程假设不同的点不存在三条共线。 因此，对于诸如以下的输入，没有有意义的正确输出```
3
0 0
0 0
0 0
```解决方案不应为此类无效输入添加特殊处理，因为竞赛从不提供它。 

## 方法

 最直接的模拟是从一个风车状态开始，反复寻找旋转线击中的下一个点。 每次提升后，枢轴都会发生变化，因此我们可以检查所有其他点，计算其围绕新枢轴的角度位置，并选择顺时针旋转时遇到的第一个点。 

这是正确的，因为风车仅当线到达另一个输入点时才会发生变化。 在两个这样的事件之间，不会发生任何离散的事情。 如果我们始终选择旋转方向上遇到的第一个点，则模拟将完全遵循问题所描述的物理过程。 

问题是找到第一点所需的工作量。 有 (\Theta(n^2)) 种可能的定向促销活动。 如果每个事件扫描所有 (n-1) 个可能的下一个点，则总数为 (\Theta(n^3))。 更准确地说，对于每个有序对有两个方向，有 (2n(n-1)) 个状态，并且在每个状态扫描 (n-1) 个候选给出

 [
 2n(n-1)^2。 
]

 在 (n=2000) 时，大约有 (159.8) 亿候选支票。 官方的比赛分析准确地指出了这个立方瓶颈。 

也不需要单独模拟每个可能的起始方向。 关键的观察是，一旦我们到达促销活动，风车就是确定性的。 问题陈述告诉我们，在完整的 360 度旋转之后，线返回到其原始位置。 因此，所有可能的促销事件形成不相交的有向循环。 在一个周期的任何一点启动风车只是在不同的位置启动相同的周期。 

因此，真正的任务是将每个促销事件表示为一个状态，并有效地找到其唯一的后继者。 

微妙之处在于，一条几何线有两个方向，但风车旋转的是 360 度而不是 180 度。 我们必须区分同一条线的两个方向。 我们将一个国家表示为

 [
 (a,b,s),
 ]

 其中 (b) 是当前枢轴，(a) 是先前提升所涉及的点，(s) 是 0 或 1。当前有向线方向是从 (a) 到 (b) 的方向，旋转 (s\pi)。 

对于固定枢轴 (b)，每隔一个点 (c) 都会给出两条来自 (b) 的定向射线，一条朝向 (c)，一条直接与它相对。 有 (2(n-1)) 条这样的射线。 如果我们按角度对所有它们进行排序，则下一个提升只是按顺时针顺序紧邻当前射线之前的射线。 

这是关键的减少。 对于每个事件，我们不会询问“其他 (n-1) 个点中哪一个先出现？”，而是预处理围绕每个枢轴的循环顺序。 然后在常数时间内找到继任者。 

对于每个主元，我们对 (2(n-1)) 条射线进行排序，进行 (O(n^2\log n)) 预处理。 一旦知道每个状态的后继者，所有循环总共只包含 (O(n^2)) 个状态，因此遍历它们的成本为 (O(n^2))。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^3)) | (O(n^2)) 或更少 | 太慢了|
 | 最佳 | (O(n^2\log n)) | (O(n^2)) | 已接受 |

 ## 算法演练

 1. 给每个输入点一个索引`0`通过`n - 1`。 状态是一个定向的促销事件`(a, b, side)`， 在哪里`b`是刚刚推广的点`side`通过区分线的两个可能的方向`a`和`b`。 因此该状态有 (2n(n-1)) 种可能性。 
2. 对于每一点`b`，构造所有基于的定向射线`b`。 对于每一个其他点`q`，插入射线`b`到`q`和相反的射线。 每条射线存储其角度、点`q`它属于，以及它是原始射线还是它的相反射线。 
3. 将这些光线逆时针排列`b`。 排序列表表示旋转线遇到其他点的确切顺序，同时其定向方向顺时针递减。 
4. 在构建排序列表时`b`，记录属于每隔一个点的两条光线的位置`q`。 这是重要的实现技巧。 假设当前状态是`(a, b, side)`。 它当前的线方向是`a`到`b`或该方向加 180 度。 在枢轴处`b`，这个方向恰好是属于的两个存储射线之一`a`。 
5. 找到当前射线的位置。 由于风车顺时针旋转，因此下一个事件是按循环排序顺序紧邻其之前的射线。 如果当前射线位于位置零，则前驱射线是列表中的最后一条射线。 
6.让前驱光线属于点`c`并设其方向标志为`next_side`。 下一个状态是`(b, c, next_side)`。 存储此转换。 几何图形现在已转换为确定性有向图，其中每个状态都只有一个传出边缘。 
7. 将每个状态标记为未访问。 每当找到未访问状态时，就跟随其后继指针，直到返回到已访问状态。 因为每个状态都有一个后继，并且过程是确定性的，所以遍历恰好是一个完整的循环。 
8. 在一个循环的遍历过程中，每个状态`(a, b, side)`代表积分的一次提升`b`。 增加计数`b`每次访问该状态时。 循环结束后，将最大计数与全局答案进行比较。 
9. 重复直到访问完每个定向事件状态。 由于每个可能的风车都对应于这些周期之一上的一个位置，因此在所有周期中找到的最大计数就是所需的答案。 

### 为什么它有效

 不变的是每个状态`(a, b, side)`准确地表示一项促销活动以及旋转线的当前定向。 围绕枢轴`b`，当有向线到达与另一点相关的两条射线之一时，所有可能的未来事件都会发生。 排序的射线列表包含按角度顺序排列的这些事件，因此当前射线的前驱恰好是顺时针旋转时遇到的第一个事件。 

后继关系是确定性的，因此完整的状态空间分解为不相交的循环。 风车的完整旋转遵循这样一个循环恰好一次。 因此，计算该周期中每个状态的第二个点就可以准确计算每个点在该风车期间被提升的次数。 由于每个可能的起始状态都属于某个周期，因此检查每个周期时会考虑每个可能的风车。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from math import atan2, pi
from bisect import bisect_left
from array import array

def solve():
    n = int(input())
    points = [tuple(map(int, input().split())) for _ in range(n)]

    if n == 2:
        print(2)
        return

    TWO_PI = 2.0 * pi

    # State:
    #   (a, b, side)
    # where b is the current pivot and the directed line has angle
    # angle(a -> b) + side * pi.
    #
    # Encode it as:
    #   ((a * n + b) << 1) | side
    #
    # There are 2*n*n slots. States with a == b are unused.
    total_states = 2 * n * n
    nxt = array('I', [0]) * total_states

    for b in range(n):
        bx, by = points[b]

        # Each entry is (angle, point, opposite_flag).
        # opposite_flag = 0 means the ray points toward point.
        # opposite_flag = 1 means the ray points in the opposite direction.
        rays = []

        for q in range(n):
            if q == b:
                continue

            qx, qy = points[q]
            ang = atan2(qy - by, qx - bx)
            if ang < 0.0:
                ang += TWO_PI

            rays.append((ang, q, 0))

            opposite = ang + pi
            if opposite >= TWO_PI:
                opposite -= TWO_PI
            rays.append((opposite, q, 1))

        rays.sort(key=lambda x: x[0])

        m = len(rays)

        # pos0[q] = position of the ray b -> q
        # pos1[q] = position of the opposite ray
        pos0 = [-1] * n
        pos1 = [-1] * n

        for i, (_, q, flag) in enumerate(rays):
            if flag == 0:
                pos0[q] = i
            else:
                pos1[q] = i

        # Fill all states whose current pivot is b.
        for a in range(n):
            if a == b:
                continue

            # side = 0:
            #   current direction is angle(a -> b)
            #   which is the ray opposite to b -> a.
            #
            # side = 1:
            #   current direction is angle(a -> b) + pi
            #   which is exactly b -> a.
            current_pos_side0 = pos1[a]
            current_pos_side1 = pos0[a]

            # side 0
            p = current_pos_side0 - 1
            if p < 0:
                p = m - 1

            _, c, next_side = rays[p]
            state = ((a * n + b) << 1)
            nxt[state] = ((b * n + c) << 1) | next_side

            # side 1
            p = current_pos_side1 - 1
            if p < 0:
                p = m - 1

            _, c, next_side = rays[p]
            state = ((a * n + b) << 1) | 1
            nxt[state] = ((b * n + c) << 1) | next_side

    visited = bytearray(total_states)
    answer = 0

    for a in range(n):
        for b in range(n):
            if a == b:
                continue

            base = (a * n + b) << 1

            for side in range(2):
                start = base | side

                if visited[start]:
                    continue

                counts = [0] * n
                cur = start

                while not visited[cur]:
                    visited[cur] = 1

                    pair = cur >> 1
                    promoted = pair % n
                    counts[promoted] += 1

                    cur = nxt[cur]

                cycle_best = max(counts)
                if cycle_best > answer:
                    answer = cycle_best

    print(answer)

if __name__ == "__main__":
    solve()
```一次读取一个点的输入，然后构建转换表。 特殊情况`n == 2`在数学上不是必需的，但它避免了构建微小的过渡结构并使最小情况变得明确。 

这`rays`列表中每隔一个点包含两个条目。 第一个是从枢轴到该点的实际方向。 二是同一条几何线，方向相反。 这就是让算法区分 0 度线和 180 度线的原因。 

这`pos0`和`pos1`数组消除了查找当前射线时进行二分搜索的需要。 一个州已经确定了这一点`a`，这两个方向准确地告诉我们哪一个`a`的两条射线是当前的射线。 下一个事件只是循环数组中的前一个事件。 

这也避免了微妙的浮点问题。 我们从不将当前状态的角度与排序数组中的角度进行比较。 我们直接记住当前射线的确切数组位置并向后移动一个位置。 因此，事实是`atan2`用于对方向进行排序不会产生相等边界问题。 

转换表使用打包的无符号整数数组，而不是 Python 整数的 Python 列表。 最大输入大小可能有大约八百万个状态，因此普通的 Python 整数列表将消耗更多的内存。 每次转换 4 个字节使表保持在 32 MB 左右，而访问的数组仅增加大约 8 MB。 

状态编码使用`(a * n + b) << 1 | side`。 其逆运算为`pair = state >> 1`其次是`promoted = pair % n`。 第二个分量正是要提升的点，这就是为什么它是循环遍历时计数的数量。 

前驱索引包裹着```
p = current_pos - 1
if p < 0:
    p = m - 1
```因为角序是圆形的。 忘记这种环绕是在下一个事件位于零角下方的配置上失败的最简单方法之一。 

所有交叉坐标差异都很小，并且 Python 整数具有任意精度。 整数不可能溢出。 唯一的数值运算是`atan2`，并且它仅用于建立不同光线的循环顺序。 

## 工作示例

 ### 示例 1

 使用积分```
A = (-1, 0)
B = ( 1, 0)
C = ( 0, 2)
```从所在州开始`A`是上一点，`B`为新提升的点，线方向为`0`度。 以下六种状态构成一个完整的周期。 

| 步骤| 状态| 促销点| 线角| 下一个状态 |
 | --- | --- | --- | --- | --- |
 | 1 |`(A, B, 0)`| 乙| (0^\circ) |`(B, C, 1)`|
 | 2 |`(B, C, 1)`| C | (296.6^\circ) |`(C, A, 0)`|
 | 3 |`(C, A, 0)`| 一个 | (243.4^\circ) |`(A, B, 1)`|
 | 4 |`(A, B, 1)`| 乙| (180^\circ) |`(B, C, 0)`|
 | 5 |`(B, C, 0)`| C | (116.6^\circ) |`(C, A, 1)`|
 | 6 |`(C, A, 1)`| 一个 | (63.4^\circ) |`(A, B, 0)`|

 最终状态就是初始状态，因此这六个事件形成一个循环。 每个点都会出现两次升级点。 因此，每个点的循环计数为 2，给出示例答案`2`。 

该迹线说明了为什么需要定向位。 第一个`(A, B)`事件的方向为 (0^\circ)，而第四个事件的方向为 (180^\circ)。 它们涉及同一对点，但处于不同的状态。 

### 示例 2

 让```
A = (0, 0)
B = (5, 0)
C = (0, 5)
D = (5, 5)
E = (1, 2)
F = (4, 2)
```其中一个周期包含以下状态。 

| 步骤| 状态| 促销点| 线角| 下一个状态 |
 | --- | --- | --- | --- | --- |
 | 1 |`(A, B, 1)`| 乙| (180^\circ) |`(B, E, 0)`|
 | 2 |`(B, E, 0)`| 电子| (153.4^\circ) |`(E, C, 0)`|
 | 3 |`(E, C, 0)`| C | (108.4^\circ) |`(C, A, 1)`|
 | 4 |`(C, A, 1)`| 一个 | (90^\circ) |`(A, E, 0)`|
 | 5 |`(A, E, 0)`| 电子| (63.4^\circ) |`(E, D, 0)`|
 | 6 |`(E, D, 0)`| d | (41.6^\circ) |`(D, B, 1)`|
 | 7 |`(D, B, 1)`| 乙| (0^\circ) |`(B, E, 1)`|
 | 8 |`(B, E, 1)`| 电子| (333.4^\circ) |`(E, C, 1)`|
 | 9 |`(E, C, 1)`| C | (288.4^\circ) |`(C, A, 0)`|
 | 10 | 10`(C, A, 0)`| 一个 | (270^\circ) |`(A, B, 1)`|

 本周期的晋升次数为

 [
 A=2，\quad B=2，\quad C=2，\quad D=1，\quad E=3，\quad F=0。 
]

 重点`E`提升了3次，所以答案是`3`。 该迹线很有用，因为每个点的最大值不必相同。 该算法必须单独计算每个周期内每个点的晋升情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n^2\log n)) | 每个主元对 (2(n-1)) 条射线进行排序，然后所有状态都遍历一次 |
 | 空间| (O(n^2)) | 后继表有 (2n^2) 个条目，访问数组有 (2n^2) 个字节 |

 对于 (n=2000)，州的数量约为 800 万。 昂贵的操作是对每个枢轴周围的角射线进行排序，大致给出 (n) 种约 (2n) 个元素。 之后，每个状态都被处理一次。 这是几何学所期望的二次尺度状态空间，它避免了在最大尺寸下需要大约 160 亿个候选检查的三次扫描。 

紧凑的转换表示在 Python 中特别有用，因为单独的数学 (O(n^2)) 空间限制并不能说明 Python 对象的开销。 使用`array('I')`和`bytearray`使实现轻松低于 256 MB 竞赛内存限制。 

## 测试用例

 下面的测试工具使用相同的`solve`作为提交的解决方案。 它重定向每个测试的标准输入并捕获标准输出。 

最大尺寸情况使用标准二次构造 (y=x^2\bmod 2003) 作为素数模数。 取前 2000 个点给出所需范围内的坐标，并避免三个共线点。 对于此压力测试，断言检查数学上的有效范围，而不是硬编码特定答案，因为该案例的目的是锻炼完整的状态空间和内存使用情况。 

故意不将全等坐标输入传递给解决方案，因为它违反了问题的输入假设。```python
import sys
import io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample 1
assert run("""\
3
-1 0
1 0
0 2
""") == "2", "sample 1"

# Provided sample 2
assert run("""\
6
0 0
5 0
0 5
5 5
1 2
4 2
""") == "3", "sample 2"

# Custom 1: minimum size
assert run("""\
2
0 0
1 0
""") == "2", "minimum size"

# Custom 2: boundary coordinates, still only three non-collinear points
assert run("""\
3
-10000 -10000
10000 -10000
-10000 10000
""") == "2", "coordinate boundary"

# Custom 3: symmetric square, useful for checking the two orientations
assert run("""\
4
0 0
1 0
1 1
0 1
""") == "2", "square"

# Custom 4: maximum-size stress case.
# 2003 is prime, and (x, x^2 mod 2003) gives a no-three-collinear set.
points = []
p = 2003
for x in range(2000):
    points.append((x, (x * x) % p))

stress = [str(len(points))]
stress.extend(f"{x} {y}" for x, y in points)
stress_input = "\n".join(stress) + "\n"

stress_answer = int(run(stress_input))
assert 2 <= stress_answer <= 2 * (len(points) - 1), "maximum-size stress"

# Invalid-input guard for the "all equal" case.
# The problem does not define an output for this input because the points
# are not a valid set of distinct points.
invalid_all_equal = """\
3
0 0
0 0
0 0
"""
coords = [tuple(map(int, line.split()))
          for line in invalid_all_equal.strip().splitlines()[1:]]
assert len(set(coords)) != 3, "all-equal input must be rejected as invalid"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 / (0,0) / (1,0)`|`2`| 最小尺寸和一条线的两个方向 |
 |`3 / (-10000,-10000) / (10000,-10000) / (-10000,10000)`|`2`| 协调边界处理 |
 | 单位平方 |`2`| 对称性和方向分离|
 | 2000 点二次构造 |`2 <= answer <= 3998`| 最大状态空间大小和内存使用量 |
 | 三个相同点 | 无效| 确认全相等输入位于问题域之外 |

 ## 边缘情况

 为了两点，```
2
0 0
1 0
```每个枢轴只有一个其他点。 该线的两种可能的方向产生一个四状态循环。 提升后的序列为`B, A, B, A`，因此每个点都会提升两次。 该实现通过为唯一邻居存储的两条相反的光线自然地处理这个问题，并且显式地`n == 2`分行回报`2`直接地。 

对于方向敏感的三角形，```
3
-1 0
1 0
0 2
```各州`(A,B,0)`和`(A,B,1)`是不同的。 它们描述了相同的几何线，但方向相差 180 度。 该循环包含六个状态而不是三个，并且每个点都会提升两次。 这`side`状态编码中的位正是阻止算法崩溃这些事件的原因。 

对于角度环绕，请考虑示例 1 的第一步。当前线具有角度 (0^\circ)，而周围的下一条相关射线`B`角度约为 (296.6^\circ)。 由于风车顺时针旋转，(296.6^\circ) 是零后遇到的下一个方向。 在排序的圆形射线列表中，它是当前射线的前驱，前驱操作从位置零回绕到最终位置。 该代码通过显式执行此操作`if p < 0`分支。 

对于广场```
4
0 0
1 0
1 1
0 1
```几何形状具有很大的对称性，但答案仍然存在`2`。 仅使用无向对的解决方案很容易将同一对的两次访问折叠为一次并返回错误的结果。 即使底层点对相同，方向位也可以使两次遍历保持分离。 

对于第二个示例，内部点显示了为什么答案不能简单地由输入点的数量确定。 重点`(1,2)`一个周期内可以晋升3次，而其他一些积分则只能晋升1-2次。 该算法不会尝试从凸性或深度推导出公式。 它遵循精确的状态周期，自动捕获内部点的重复提升。 

对于最大尺寸的情况，转换表包含大约八百万个状态。 每个状态由后继数组中的四个字节和访问数组中的一个字节表示。 射线列表一次构建一个枢轴，并在写入该枢轴的转换后被丢弃，因此该实现永远不会同时存储所有角度列表。 这使内存使用量与二次状态空间成正比，而不是将二次空间乘以 Python 元组和浮点数的开销。 

全相等的情况是不同的，因为它不是算法的边缘情况。 这是一个无效的输入。 和```
3
0 0
0 0
0 0
```没有由两个不同点确定的明确定义的线，因此在问题的假设下不存在风车过程。 正确的反应不是一个特殊的数字答案，而是认识到这种情况在有效的测试中不可能发生。 

处理类似几何问题的中心思想是停止直接模拟连续运动。 一旦运动被简化为离散事件，正确的状态通常包含足够的方向信息以使下一个事件具有确定性。 在这里，这将风车转变为 O(n 2 ) 定向状态的排列，之后循环遍历就很简单了。
