---
title: "CF 102420A - \u0417\u0430\u0433\u0440\u043e\u0431\u043e\u0446\u0432\u0435\u0442\u0430\u043c\u0438"
description: "我们有 (n) 个猎人，每个猎人在平面上占据一个不同的点 ((xi,yi))。 我们需要选择三名不同的猎人，他们的位置不在一条直线上。 如果存在这样的三元组，我们将打印 Yes 及其索引。"
date: "2026-08-10T11:33:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102420
codeforces_index: "A"
codeforces_contest_name: "\u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u044b, \u0421\u0435\u0437\u043e\u043d 2019-2020, \u0422\u0440\u0435\u0442\u044c\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430, \u0443\u0441\u043b\u043e\u0436\u043d\u0435\u043d\u043d\u0430\u044f \u043d\u043e\u043c\u0438\u043d\u0430\u0446\u0438\u044f"
rating: 0
weight: 102420
solve_time_s: 1141
verified: true
draft: false
---

[CF 102420A - \u0417\u0430 \u0433\u0440\u043e\u0431\u043e\u0446\u0432\u0435\u0442\u0430\u043c\u0438](https://codeforces.com/problemset/problem/102420/A)

 **评级：** -
 **标签：** -
 **求解时间：** 19m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有 (n) 个猎人，每个猎人在平面上占据一个不同的点 ((x_i,y_i))。 我们需要选择三名不同的猎人，他们的位置不在一条直线上。 如果存在这样的三元组，我们打印`Yes`及其指数。 如果每个猎人都位于同一条线上，我们会打印`No`。 

这两种情况之间的区别是几何上的，但可以通过整数算术来检查。 对于三点 (A)、(B) 和 (C)，当向量 (B-A) 和 (C-A) 具有零叉积时，它们正好共线：

 [
 (x_B-x_A)(y_C-y_A)-(y_B-y_A)(x_C-x_A)=0。 
]

 界限（n\le 100000）排除了检查每个三元组。 有

 [
 \binom{100000}{3}\约 1.67\cdot 10^{14}
 ]

 三倍，这远远超出了竞争性编程时间限制所能处理的。 我们需要一个线性或近线性的解决方案。 坐标界限达到(10^9)，因此叉积中的乘积可以达到大约(4\cdot 10^{18})，并且差值可以接近(8\cdot 10^{18})。 Python 整数可以精确地处理这些值，而固定宽度的 32 位整数会严重溢出。 

第一个不明显的情况是，尽管存在有效答案，但前三个猎人共线。 例如，```
4
0 0
1 1
2 2
0 1
```正确的输出是`Yes`，例如使用索引`1 2 4`。 仅测试前三点的方法将错误地打印`No`。 

相反的情况是当所有点实际上都在一条线上时：```
4
1 1
2 2
3 3
4 4
```正确的输出是`No`。 在宣布不可能之前，任何方法都必须能够检查最初三个点之外的点。 

第三种情况涉及垂直线：```
3
5 0
5 2
5 7
```正确的输出是`No`。 计算诸如 ((y_2-y_1)/(x_2-x_1)) 之类的斜率可能会意外地引入除零。 叉积没有这种特殊情况，因此垂直线和水平线的处理方式相同。 

## 方法

 直接暴力解决方案考虑每个三重猎人并检查其三个点是否共线。 这是正确的，因为每个可能的答案都经过明确检查。 问题是三元组的数量。 对于 (n=100000)，大约有 (1.67\cdot10^{14}) 个，因此即使每个三元组的工作量非常小，也太多了。 

有用的观察是前两个猎人是不同的，因此他们确定了一条独特的路线。 如果有任何有效的答案，那么这条线之外一定还有第三个猎人。 相反，如果每个猎人都位于这条线上，那么每个可能的三元组都是共线的，答案是不可能的。 

这意味着我们不需要搜索三元组。 修复猎人（1）和（2），然后扫描每个剩余的猎人并测试它是否位于他们的线上。 不在直线上的第一个点立即给出有效答案。 如果扫描到达终点而没有找到一个，则所有猎人都在同一条线上，答案是`No`。 

蛮力方法之所以有效，是因为测试一个三元组可以直接回答该三元组的问题，但它会失败，因为三元组太多。 固定线观察将问题简化为每个剩余点进行一次共线性测试。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n^3)) | (O(1)) | (O(1)) | 太慢了|
 | 最佳 | (O(n)) | (O(n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 读取所有 (n) 个点及其原始的从 1 开始的索引。 我们需要输出中的索引，而不仅仅是坐标。 
2. 取前两点为(A=(x_1,y_1))和(B=(x_2,y_2))。 因为该语句保证没有两个猎人占据同一点，所以这两点定义了一条唯一的线。 
3. 对于从第三个点开始的每个点 (C=(x_i,y_i))，计算

 [
 交叉=(x_2-x_1)(y_i-y_1)-(y_2-y_1)(x_i-x_1)。 
]

如果`cross != 0`，三点(A,B,C)不共线，所以立即打印`Yes`及其指数。 

1. 如果剩余的每个点都有`cross == 0`，每个猎人都通过前两个猎人在线。 在这种情况下，没有三个猎人可以形成一个非退化三角形，所以打印`No`。 

扫描之所以有效，是因为通过前两个点的线对于整个算法来说是固定的。 非零叉积证明当前点位于该线之外，而零叉积则证明当前点在线上。 

### 为什么它有效

 不变的是前两个点始终定义参考线。 在扫描过程中，如果一个点与这两个点具有非零叉积，则该点位于该线之外，因此所选的三个点不能共线，并且算法已找到有效答案。 

如果算法从未找到这样的点，则每个输入点与前两个点的叉积为零。 因此，每个点都位于其独特的线上。 由于所有猎人都在一条线上，因此三个猎人的每种可能选择都是共线的，所以`No`是唯一正确的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    points = []

    for i in range(1, n + 1):
        x, y = map(int, input().split())
        points.append((x, y, i))

    x1, y1, i1 = points[0]
    x2, y2, i2 = points[1]

    dx = x2 - x1
    dy = y2 - y1

    for x, y, i in points[2:]:
        cross = dx * (y - y1) - dy * (x - x1)

        if cross != 0:
            print("Yes")
            print(i1, i2, i)
            return

    print("No")

if __name__ == "__main__":
    solve()
```输入循环将每个坐标及其原始索引存储在一起。 这避免了稍后重建索引并使几何计算与输出编号分开。 

两者的区别`dx`和`dy`计算一次，因为参考线永远不会改变。 对于后面的每个点，只有从第一个点到当前点的向量发生变化。 

表达式```
dx * (y - y1) - dy * (x - x1)
```是二维叉积。 它的符号表明该点位于参考线的哪一侧，但对于这个问题，只有零与非零很重要。 

没有划分，因此垂直线不会导致特殊情况。 即使对于允许的最大坐标，Python 整数也可以避免溢出。 索引存储在`points`已经从 1 开始，匹配所需的输出格式。 

循环开始于`points[2:]`因为前两个猎人已经被作为固定配对了。 输出中不存在相差一的问题，因为存储的索引正是输入位置。 

## 工作示例

 ### 示例 1

 输入是：```
3
1 1
2 2
2 3
```前两个点定义直线 (y=x)。 第三点位于该线上方。 

| 步骤| 参考文献A | 参考文献 B | 当前C | 叉积| 行动|
 | ---| ---| ---| ---| ---| ---|
 | 1 | ((1,1)) | ((1,1)) | ((2,2)) | ((2,2)) | ((2,3)) | ((2,3)) | (1\cdot2-1\cdot1=1) | 打印`Yes 1 2 3`|

 叉积非零，因此这三个点不共线。 该算法立即以有效的三元组终止。 

### 示例 2

 输入是：```
5
1 2
0 0
3 6
4 8
4 4
```前两个点定义直线 (y=2x)。 点 3 和 4 也在该线上，而点 5 不在该线上。 

| 步骤| 参考文献A | 参考文献 B | 当前C | 叉积| 行动|
 | --- | --- | --- | --- | --- | --- |
 | 1 | ((1,2)) | ((1,2)) | ((0,0)) | ((0,0)) | ((3,6)) | ((-1)\cdot4-(-2)\cdot2=0) | 继续 |
 | 2 | ((1,2)) | ((1,2)) | ((0,0)) | ((0,0)) | ((4,8)) | ((-1)\cdot6-(-2)\cdot3=0) | 继续 |
 | 3 | ((1,2)) | ((1,2)) | ((0,0)) | ((0,0)) | ((4,4)) | ((4,4)) | ((-1)\cdot2-(-2)\cdot3=4) | 打印`Yes 1 2 5`|

 示例输出使用不同的有效三元组，`3 2 5`。 该问题接受任意三个非共线猎人，因此`1 2 5`同样正确。 

参考对之后的前两个候选点说明了为什么仅检查前三个猎人是不够的。 在扫描到达有效的第三点之前，有几个点可能位于参考线上。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n)) | (O(n)) | 每个猎人被读取一次，前两个点之后的每个点都接受一个叉积测试。 |
 | 空间| (O(n)) | (O(n)) | 所有猎人的坐标和索引都被存储。 |

 对于 (n\le100000)，线性扫描仅执行大约 (100000) 几何测试，这很容易实用。 内存使用也是线性的，并且在正常的竞争性编程限制内。 

## 测试用例

 该语句保证没有两个猎人占据同一点，因此所有坐标对都相同的文字输入位于有效输入域之外。 无论如何，下面的测试套件包括这样的输入作为稳健性检查。 不需要一个有效的解决方案来支持它，但实现自然会返回`No`。 

断言助手捕获标准输出，而检查器验证实际的几何属性，而不是需要一个特定的有效三元组。 这是必要的，因为该问题允许任何正确的三个索引集。```python
import sys
import io
import contextlib

def solve():
    input = sys.stdin.readline

    n = int(input())
    points = []

    for i in range(1, n + 1):
        x, y = map(int, input().split())
        points.append((x, y, i))

    x1, y1, i1 = points[0]
    x2, y2, i2 = points[1]

    dx = x2 - x1
    dy = y2 - y1

    for x, y, i in points[2:]:
        cross = dx * (y - y1) - dy * (x - x1)

        if cross != 0:
            print("Yes")
            print(i1, i2, i)
            return

    print("No")

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    output = io.StringIO()
    try:
        with contextlib.redirect_stdout(output):
            solve()
    finally:
        sys.stdin = old_stdin

    return output.getvalue().strip()

def valid_answer(inp: str, out: str) -> bool:
    data = inp.strip().splitlines()
    n = int(data[0])
    points = [tuple(map(int, line.split())) for line in data[1:]]

    tokens = out.split()

    if tokens[0] == "No":
        x1, y1 = points[0]
        x2, y2 = points[1]

        for x, y in points[2:]:
            cross = (x2 - x1) * (y - y1) - (y2 - y1) * (x - x1)
            if cross != 0:
                return False

        return True

    assert tokens[0] == "Yes"
    a, b, c = map(int, tokens[1:4])
    assert 1 <= a <= n
    assert 1 <= b <= n
    assert 1 <= c <= n
    assert len({a, b, c}) == 3

    x1, y1 = points[a - 1]
    x2, y2 = points[b - 1]
    x3, y3 = points[c - 1]

    cross = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1)
    return cross != 0

# Sample 1
sample1 = """\
3
1 1
2 2
2 3
"""
assert run(sample1).startswith("Yes")
assert valid_answer(sample1, run(sample1)), "sample 1"

# Sample 2
sample2 = """\
5
1 2
0 0
3 6
4 8
4 4
"""
assert run(sample2).startswith("Yes")
assert valid_answer(sample2, run(sample2)), "sample 2"

# Sample 3
sample3 = """\
4
1 1
2 2
3 3
4 4
"""
assert run(sample3) == "No"
assert valid_answer(sample3, run(sample3)), "sample 3"

# Minimum-size input, non-collinear
case4 = """\
3
0 0
1 1
1 0
"""
assert valid_answer(case4, run(case4)), "minimum non-collinear case"

# Minimum-size input, all points collinear
case5 = """\
3
-5 7
0 7
10 7
"""
assert run(case5) == "No"
assert valid_answer(case5, run(case5)), "minimum collinear case"

# Boundary coordinates and large cross product
case6 = """\
4
-1000000000 -1000000000
1000000000 1000000000
1000000000 -1000000000
0 0
"""
assert valid_answer(case6, run(case6)), "coordinate boundary case"

# First three points are collinear, fourth is not
case7 = """\
4
0 0
1 1
2 2
0 1
"""
assert valid_answer(case7, run(case7)), "late non-collinear point"

# Robustness only: duplicate coordinates are forbidden by the statement.
case8 = """\
3
5 5
5 5
5 5
"""
assert run(case8) == "No"
assert valid_answer(case8, run(case8)), "duplicate-coordinate robustness"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`3 / 0 0 / 1 1 / 1 0`|`Yes`| 具有非共线三元组的最小有效输入 |
 |`3 / -5 7 / 0 7 / 10 7`|`No`| 每个点都在一条水平线上的最小输入 |
 |`4 / -10^9 -10^9 / 10^9 10^9 / 10^9 -10^9 / 0 0`|`Yes`| 坐标边界和大整数叉积 |
 |`4 / 0 0 / 1 1 / 2 2 / 0 1`|`Yes`| 防止只检查前三点的错误策略 |
 |`3 / 5 5 / 5 5 / 5 5`|`No`| 针对重复坐标的鲁棒性，尽管这违反了输入保证 |

 ## 边缘情况

 当前三个点共线时，算法不会得出答案不可能的结论。 为了```
4
0 0
1 1
2 2
0 1
```参考线是 (y=x)。 第三点给出叉积 (0)，因此扫描继续。 第四点给出

 [
 1\cdot1-1\cdot0=1,
 ]

 所以算法打印`Yes`带索引`1 2 4`。 这正是打破了幼稚的前三点解决方案的情况。 

当所有点共线时，例如```
4
1 1
2 2
3 3
4 4
```前两点定义 (y=x)。 每个后续叉积都为零。 循环结束时没有找到外部点，因此算法打印`No`。 由于每个点都属于同一条线，因此不可能有替代的三元组。 

对于垂直线，```
3
5 0
5 2
5 7
```前两个 (x) 坐标之间的差为零。 叉积仍然直接起作用：

 [
 0\cdot(y-0)-2\cdot(5-5)=0。 
]

 算法打印`No`无需任何划分或特殊处理。 这比基于斜率的实现更安全，其中表达式 ((y_2-y_1)/(x_2-x_1)) 将除以零。 

最后，考虑最大坐标范围：```
4
-1000000000 -1000000000
1000000000 1000000000
1000000000 -1000000000
0 0
```前两个 (x) 坐标之间的差异为 (2\cdot10^9)，对应的 (y) 差异具有相同的大小。 对于第三点，叉积的量级为 (10^{18})，但 Python 的任意精度整数可以准确地计算它。 因此，该算法做出正确的几何决策而不会溢出。
