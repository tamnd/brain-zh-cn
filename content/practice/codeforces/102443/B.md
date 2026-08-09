---
title: "CF 102443B - 阻挡视线"
description: "对于每个测试用例，我们有两个不相交的线段，称为 (a) 和 (b)，以及一个非零方向向量 (vec v)。 我们需要确定 (a) 上的某个点 (A) 是否可以从 (A) 沿 (vec v) 方向移动并到达 (b) 上的某个点 (B)。"
date: "2026-08-08T12:46:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102443
codeforces_index: "B"
codeforces_contest_name: "2019-2020 Russia Team Open, High School Programming Contest (VKOSHP 19)"
rating: 0
weight: 102443
solve_time_s: 123
verified: true
draft: false
---

[CF 102443B - 阻挡视图](https://codeforces.com/problemset/problem/102443/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于每个测试用例，我们有两个不相交的线段，称为（a）和（b），以及一个非零方向向量（\vec v）。 我们需要确定（a）上的某个点（A）是否可以从（A）沿（\vec v）方向移动并到达（b）上的某个点（B）。 

同样，我们需要点 (A\in a) 和 (B\in b) 使得

 [
 B-A=t\vec v
 ]

 对于某些（t>0）。 严格正性源自两个线段不相交的事实，因此 (A) 和 (B) 不可能是同一点。 

每个测试用例包含两个线段端点的八个坐标和观察方向的两个坐标。 可以有多达 (50,000) 个独立测试用例。 所有坐标最多具有绝对值 (10^6)，因此 (O(n)) 或 (O(n\log n)) 总解决方案很容易足够快，但在每个段内执行大量搜索的算法并不合适。 

主要困难在于（A）和（B）是线段上的任意实点。 仅检查端点是不够的。 例如，```
1
0 0 4 4 1 3 3 1 1 1
```方向为 ((1,1))。 端点对没有给出所需的方向，但两个线段包含具有相同垂直坐标的点，并且第二个线段上的一个这样的点位于第一个线段上对应点的前面。 仅检查四个端点对的解决方案可能会错过这一点。 

第二个陷阱是方向。 考虑```
1
0 0 1 0 -3 0 -2 0 1 0
```这些线段位于同一水平线上，但从 ((1,0)) 方向看时，第二个线段位于第一个线段的后面。 正确答案是`No`。 仅检查两个线段是否位于同一直线上的测试将错误地回答`Yes`。 

当线段平行于观察方向时，会出现第三种边缘情况。 例如，```
1
0 0 1 0 2 0 2 1 1 0
```第一个线段平行于 (\vec v)。 正确答案是`Yes`，因为点 ((1,0)) 可以向右移动并到达第二段上的 ((2,0))。 任何除以第一段的垂直坐标差的公式都必须单独处理零分母。 

最后，这些线段可能只有一个共同的垂直坐标。 例如，```
1
0 0 1 0 2 0 2 1 1 0
```正是有这种情况。 将投影区间的重叠视为开区间而不是闭区间会丢失边界处的有效点。 

## 方法

 一个直接的暴力想法是参数化两个段并搜索 (A) 的可能位置。 对于固定的 (A)，我们可以测试射线 (A+t\vec v)、(t\geq0) 是否与 (b) 相交。 困难在于（A）的参数是连续的。 采样 (K) 个位置可以为每个测试提供 (O(K)) 个工作量，或者在最坏的情况下提供 (50,000K) 个样本。 即使使用 (K=10^5)，也有 (5\cdot10^9) 个样本。 更根本的是，有限采样不是一种精确的算法，因为有效的阻塞点可能位于两个样本之间。 

精确的公式最初看起来像一个具有三个连续变量的系统，即 (a) 上的位置、(b) 上的位置以及沿 (\vec v) 行进的距离。 针对每种可能的配置单独解决该系统的问题是不必要的复杂。 有用的观察是方向条件有两个独立的部分。 位移 (B-A) 必须没有垂直于 (\vec v) 的分量，并且其沿 (\vec v) 的分量必须为正。 

为任意点定义两个坐标 (P=(x,y))：

 [
 q(P)=\算子名{交叉}(\vec v,P)=v_x y-v_y x
 ]

 和

 [
 p(P)=\operatorname{dot}(\vec v,P)=v_xx+v_yy。 
]

 值 (q) 测量垂直于观察方向的位置，直至达到恒定比例。 值 (p) 测量沿观察方向的位置，也达到恒定比例。 

现在假设 (B-A=t\vec v)。 然后

 # \operatorname{cross}(\vec v,B-A)

 # \operatorname{cross}(\vec v,t\vec v)

 1.

 ]

 因此 (A) 和 (B) 必须具有相同的 (q) 坐标。 

同时，

 # \operatorname{dot}(\vec v,B-A)

 t|\vec v|^2。 
]

 由于 (t>0)，我们需要 (p(B)>p(A))。 由于保证线段不相交，因此有效对不会出现相等，因此检查 (p(B)\geq p(A)) 也是安全的。 

线段的 (q) 值形成一个区间，因为 (q) 沿线段呈线性。 因此，仅当两个段的 (q) 间隔重叠时，它们才可能相互阻塞。 

在该重叠内部，具有给定 (q) 坐标的每个线段的点通过线性插值确定。 因此，(p_A(q)) 和(p_B(q)) 是线性函数。 他们的区别

 [
 d(q)=p_B(q)-p_A(q)
 ]

 也是线性的。 闭区间上的线性函数在两个端点之一达到最大值。 因此，我们只需检查重叠 (q) 间隔的两个端点。 

这是关键的减少。 连续存在问题变成了有理数的两个精确比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力采样 | 每次测试 (O(K)) | (O(1)) | (O(1)) | 太慢而且不准确|
 | 最优投影法 | 每次测试 (O(1)) | (O(1)) | (O(1)) | 已接受 |

 ## 算法演练

 1. 对于两个线段的每个端点，计算其垂直坐标 (q=\operatorname{cross}(\vec v,P)) 和平行坐标 (p=\operatorname{dot}(\vec v,P))。 这两个整数值完全描述了这个问题的目的。 
2. 对于每个段，取其两个 (q) 值的最小值和最大值。 这些正是该线段所覆盖的垂直坐标的范围。 
3. 计算两个 (q) 范围的交集。 如果左端点大于右端点，则范围是不相交的，因此没有一对点可以具有相等的 (q) 坐标。 答案是立即`No`。 
4. 令重叠为([L,R])。 对于段范围内的特定值 (q=t)，通过线性插值恢复其 (p) 坐标。 如果线段端点的坐标为 ((q_0,p_0)) 和 ((q_1,p_1))，则

 [
 p(t)=
 \frac{p_0(q_1-t)+p_1(t-q_0)}
 {q_1-q_0}。 
]

 如果 (q_0=q_1)，该线段平行于 (\vec v)，因此它的 (q) 坐标是恒定的，而唯一相关 (q) 处的 (p) 坐标就是它的端点 (p)。 

1. 评估 (q=L) 处的两个段。 比较它们的 (p) 坐标。 我们需要 (p_B(L)\geq p_A(L))。 
2. 评估 (q=R) 处的两个段并执行相同的比较。 由于 (p_B(q)-p_A(q)) 在重叠上是线性的，因此如果它在任何地方都是非负的，那么它在这两个端点之一也是非负的。 
3. 使用交叉乘法而不是浮点来比较插值。 如果

 [
 p_A=\frac{n_A}{d_A},
 \qquad
 p_B=\frac{n_B}{d_B},
 ]

 具有正分母，那么

 [
 p_B\geq p_A
 ]

 相当于

 [
 n_Bd_A\geq n_Ad_B。 
]

 Python 整数具有任意精度，因此这些产品是安全的。 

其原理：对于重叠中的每个垂直坐标 (q)，每个线段上都有一个对应点，但平行于 (\vec v) 的线段只有一个可能的 (q)。 两点位于同一视线上的条件恰好是(p_B(q)>p_A(q))。 两个 (p) 坐标之差在 (q) 中是线性的，因此其重叠部分的最大值在 (L) 或 (R) 处达到。 该算法会检查两者，因此当存在一个时，它会准确地找到一个有效的对。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(data):
    ax1, ay1, ax2, ay2, bx1, by1, bx2, by2, vx, vy = data

    def coords(x, y):
        # q: coordinate perpendicular to v
        # p: coordinate along v
        q = vx * y - vy * x
        p = vx * x + vy * y
        return q, p

    a0 = coords(ax1, ay1)
    a1 = coords(ax2, ay2)
    b0 = coords(bx1, by1)
    b1 = coords(bx2, by2)

    aq0, ap0 = a0
    aq1, ap1 = a1
    bq0, bp0 = b0
    bq1, bp1 = b1

    left = max(min(aq0, aq1), min(bq0, bq1))
    right = min(max(aq0, aq1), max(bq0, bq1))

    if left > right:
        return False

    def value_at(q0, p0, q1, p1, q):
        if q0 == q1:
            return p0, 1

        den = q1 - q0
        num = p0 * (q1 - q) + p1 * (q - q0)

        if den < 0:
            den = -den
            num = -num

        return num, den

    for q in (left, right):
        an, ad = value_at(aq0, ap0, aq1, ap1, q)
        bn, bd = value_at(bq0, bp0, bq1, bp1, q)

        if bn * ad >= an * bd:
            return True

    return False

def main():
    t = int(input())
    out = []

    for _ in range(t):
        data = list(map(int, input().split()))
        out.append("Yes" if solve_case(data) else "No")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```这`coords`函数执行中心坐标变换。 叉积给出垂直坐标，而点积给出沿观察方向的坐标。 不需要通过 (|\vec v|) 进行归一化，因为将任一坐标系乘以公共正标度不会改变比较。 

接下来的四行计算两个 (q) 区间并使它们相交。 包含端点是因为允许阻塞点作为任一段的端点。 

这`value_at`函数执行精确的线性插值。 分母被归一化为正数，以便以后的所有比较都具有相同的方向。 特殊情况`q0 == q1`是必需的，因为平行于观察方向的线段具有恒定的垂直坐标。 

最后的循环仅检查`left`和`right`。 这些不是任意的样本点。 它们是垂直坐标整个可行范围的端点，并且两个平行坐标之间的差在该范围上是线性的。 

解决方案中的任何地方都没有浮点运算。 这很重要，因为两个段在投影后可能会被非常小的精确差异分开，并且浮点比较可能会改变答案。 最大的中间值远大于（10^6），但Python的整数会自动增长，因此不存在溢出问题。 

## 工作示例

 第一个示例使用```
0 2 1 1 2 2 3 1 1 1
```这里 (\vec v=(1,1))，所以 (q=y-x) 和 (p=x+y)。 

| 数量 | 段（a）| 部分（b）|
 | ---| ---| ---|
 | 第一个端点 ((q,p)) | ((2,2)) | ((2,2)) | ((0,4)) | ((0,4)) |
 | 第二个端点 ((q,p)) | ((0,2)) | ((0,2)) | ((-2,4)) | ((-2,4)) |
 | (q)-范围 | ([0,2]) | ([0,2]) | ([-2,0]) |
 | 重叠| ([0,0]) | ([0,0]) | ([0,0]) | ([0,0]) |
 | (p_A(0)) | (2) | |
 | (p_B(0)) | | (4) |
 | (p_B-p_A) | | (2>0) | (2>0) |
 | 回答 | |`Yes`|

 重叠由单个垂直坐标 (q=0) 组成。 在该坐标处，段 (a) 贡献 (p=2)，而段 (b) 贡献 (p=4)。 因此，第二段沿着观察方向更远，(a) 上的点可以沿着 ((1,1)) 移动到达 (b)。 

第二个示例案例是```
0 2 1 1 2 2 3 1 -1 -1
```现在 (\vec v=(-1,-1))，给出 (q=x-y) 和 (p=-x-y)。 

| 数量 | 段（a）| 部分（b）|
 | ---| ---| ---|
 | 第一个端点 ((q,p)) | ((-2,-2)) | ((-2,-2)) | ((0,-4)) | ((0,-4)) |
 | 第二个端点 ((q,p)) | ((0,-2)) | ((0,-2)) | ((2,-4)) | ((2,-4)) |
 | (q)-范围 | ([-2,0]) | ([0,2]) | ([0,2]) |
 | 重叠| ([0,0]) | ([0,0]) | ([0,0]) | ([0,0]) |
 | (p_A(0)) | (-2) | |
 | (p_B(0)) | | (-4) |
 | (p_B-p_A) | | (-2<0) | (-2<0) |
 | 回答 | |`No`|

 从相反的方向观察相同的几何片段。 垂直坐标仍然相交，但第二段现在在 (p) 坐标中位于第一段的后面。 方向测试会改变答案。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n)) | (O(n)) | 每个测试用例执行恒定数量的叉积、点积、插值和整数比较 |
 | 空间| (O(1)) 辅助 | 对于一个测试用例，仅存储恒定数量的整数坐标 |

 对于最多 (50,000) 个测试用例，该算法仅对每个用例执行恒定量的算术，因此总工作量与测试用例的数量呈线性关系。 输入本身是数据的主要来源，并且该解决方案完全符合 2 秒和 512 MB 的限制。 

## 测试用例```python
import sys
import io

def blocking(data):
    ax1, ay1, ax2, ay2, bx1, by1, bx2, by2, vx, vy = data

    def coords(x, y):
        return vx * y - vy * x, vx * x + vy * y

    aq0, ap0 = coords(ax1, ay1)
    aq1, ap1 = coords(ax2, ay2)
    bq0, bp0 = coords(bx1, by1)
    bq1, bp1 = coords(bx2, by2)

    left = max(min(aq0, aq1), min(bq0, bq1))
    right = min(max(aq0, aq1), max(bq0, bq1))

    if left > right:
        return False

    def value_at(q0, p0, q1, p1, q):
        if q0 == q1:
            return p0, 1

        den = q1 - q0
        num = p0 * (q1 - q) + p1 * (q - q0)

        if den < 0:
            den = -den
            num = -num

        return num, den

    for q in (left, right):
        an, ad = value_at(aq0, ap0, aq1, ap1, q)
        bn, bd = value_at(bq0, bp0, bq1, bp1, q)

        if bn * ad >= an * bd:
            return True

    return False

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input_fn = sys.stdin.readline

    t = int(input_fn())
    ans = []

    for _ in range(t):
        data = list(map(int, input_fn().split()))
        ans.append("Yes" if blocking(data) else "No")

    return "\n".join(ans)

# Provided sample
sample = """\
2
0 2 1 1 2 2 3 1 1 1
0 2 1 1 2 2 3 1 -1 -1
"""
assert run(sample) == "Yes\nNo", "provided sample"

# Minimum-size case: two horizontal, disjoint segments, second is ahead.
assert run("""\
1
0 0 1 0 2 0 3 0 1 0
""") == "Yes", "minimum-size positive case"

# Same line, but the second segment is behind the first.
assert run("""\
1
0 0 1 0 -3 0 -2 0 1 0
""") == "No", "wrong direction"

# Perpendicular projections do not overlap.
assert run("""\
1
0 0 1 0 0 2 1 2 1 0
""") == "No", "disjoint perpendicular projections"

# First segment is parallel to the viewing direction.
assert run("""\
1
0 0 1 0 2 0 2 1 1 0
""") == "Yes", "parallel segment with a boundary witness"

# Equal direction components, testing a non-axis-aligned direction.
assert run("""\
1
0 0 1 1 2 2 3 3 1 1
""") == "Yes", "equal direction components"

# Maximum number of test cases.
one = "0 0 1 0 2 0 3 0 1 0\n"
large_input = "50000\n" + one * 50000
large_output = run(large_input)
assert large_output.count("Yes") == 50000, "maximum number of tests"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`0 0 1 0 2 0 3 0 1 0`|`Yes`| 最小尺寸阳性案例 |
 |`0 0 1 0 -3 0 -2 0 1 0`|`No`| 沿观察方向的正确方向 |
 |`0 0 1 0 0 2 1 2 1 0`|`No`| 不相交的垂直坐标区间 |
 |`0 0 1 0 2 0 2 1 1 0`|`Yes`| 零插值分母和边界重叠 |
 |`0 0 1 1 2 2 3 3 1 1`|`Yes`| 具有相等分量的非轴对齐方向 |
 | 5万重复有效案例| 50,000`Yes`线路 | 测试用例的最大数量 |

 ## 边缘情况

 第一个边缘情况是垂直坐标边界。 考虑```
1
0 0 1 0 2 0 2 1 1 0
```对于 (\vec v=(1,0))，我们有 (q=y) 和 (p=x)。 段(a)具有(q)-范围([0,0])，而段(b)具有(q)-范围([0,1])。 它们的重叠恰好是(q=0)。 在该坐标处，(a) 有 (p=0) 到 (1)，而 (b) 有 (p=2)，因此比较成功，结果为`Yes`。 闭区间在这里至关重要。 

第二边缘情况是平行于观察方向的线段。 在同一输入中，段 (a) 具有 (q_0=q_1=0)。 插值例程在除法之前检测到这一点。 其 (p) 坐标直接从端点获取，算法将其与线段 (b) 到达 (q=0) 的点进行比较。 这给出了`Yes`不被零除。 

第三种边缘情况是两个共线线段指向错误的顺序：```
1
0 0 1 0 -3 0 -2 0 1 0
```两个 (q) 范围均为 ([0,0])，因此仅垂直条件就说明存在可能的对齐方式。 然而，在 (q=0) 处，第一段具有从 (0) 到 (1) 的 (p) 值，而第二段具有从 (-3) 到 (-2) 的 (p) 值。 第二段位于第一段后面，因此 (p_B<p_A) 无处不在，答​​案是`No`。 

第四种边缘情况是完全不相交的垂直投影：```
1
0 0 1 0 0 2 1 2 1 0
```第一段具有 (q=0)，而第二段具有 (q=2)。 范围的交集为空，因此算法在插值之前停止并返回`No`。 这可以避免意外地将具有附近但不同投影坐标的线段视为对齐。 

第五个边缘情况是方向测试的零距离边界。 在这个问题中，线段保证不相交，因此如果 (q_A=q_B) 和 (p_A=p_B)，这些点实际上是相同的，这与输入保证相矛盾。 因此，实现可以使用`>=`在最终比较中不会意外地接受零长度位移。 对于给定的输入类，每个接受的对都沿着 (\vec v) 具有真正的正位移。 

如果您愿意，我还可以将其转换为更短的 Codeforces 风格的社论，具有相同的证明和代码，但阐述较少。
