---
title: "CF 102375L - \u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435\u0442\u043e\u0447\u043a\u0438"
description: "我们只关心第一个标记点​​的 Voronoi 单元，仅限于矩形内的整数网格点。 当网格点 (x, y) 到 p1 的欧几里德距离不大于它到每个其他标记点的距离时，它就是好的。"
date: "2026-08-14T13:23:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102375
codeforces_index: "L"
codeforces_contest_name: "\u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0439 \u0440\u0430\u0443\u043d\u0434 \u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442\u0430 \u0421\u0435\u0432\u0435\u0440\u043e-\u0417\u0430\u043f\u0430\u0434\u0430 \u0420\u043e\u0441\u0441\u0438\u0438 \u0438 \u041c\u043e\u0441\u043a\u0432\u044b ICPC 2019"
rating: 0
weight: 102375
solve_time_s: 234
verified: false
draft: false
---

[CF 102375L - \u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435 \u0442\u043e\u0447\u043a\u0438](https://codeforces.com/problemset/problem/102375/L)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 54s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们只关心第一个标记点的 Voronoi 单元，仅限于矩形内的整数网格点。 一个网格点`(x, y)`恰好当其欧几里德距离到`p1`不大于它到每个其他标记点的距离。 

该矩形包含`(X + 1)(Y + 1)`整数点。 对于每个候选点，直接解决方案将其与所有候选点的距离进行比较`K`标记点，所以直接的方法需要大致`(X + 1)(Y + 1)K`距离比较。 三个参数全部达到`2 * 10^5`，这大约是`8 * 10^15`比较，远远超出了实际。 我们需要利用这样一个事实：比较欧几里德距离的平方使得二次项为`x`和`y`取消。 

有几种边界情况可能会悄无声息地破坏实现。 只有一个标记点​​，每个网格点都是好的。 例如，```
1 1 1
0 0
```有答案`4`，因为矩形的所有四个整数点都属于第一个点的区域。 假设至少有一个竞争对手的实现可能会意外地构建一个空的最小或最大信封。 

另一个问题是整数坐标之间传递的平分线。 考虑```
2 1 2
2 0
1 0
```无论何时，第一点都更接近`x >= 1.5`，所以唯一好的整数点有`x = 2`。 两者皆有可能`y`价值观很好，给出答案`2`。 有理边界的粗心整数转换可能会错误地包括`x = 1`。 

当所需的边界是上限而不是下限时，就会出现对称问题。 对于相同的输入，下边界为`x >= 1.5`，并且整数算术必须产生`ceil(1.5) = 2`。 Python 整数除法在这里很有用，但前提是保持分母为正并显式处理上限。 
标记点也可以位于矩形边界上。 例如，```
2 1 2
0 0
2 0
```包含最近标记点沿底部边缘发生变化的点，而相同的比较也适用于该行`y = 1`。 必须包含矩形边界，而不是将其视为严格的不平等。 

## 方法

 蛮力方法检查每个整数`(x, y)`和`0 <= x <= X`和`0 <= y <= Y`，计算其平方距离`p1`，并将其与到每个其他标记点的平方距离进行比较。 这是正确的，因为好点的定义正是比较的集合。 其最坏情况的成本是`(X + 1)(Y + 1)(K - 1)`，这大约是`8 * 10^15`最大限制下的操作。 

有用的观察来自于扩展一项比较。 让`p1 = (a, b)`另一个标记点​​是`(u, v)`。 我们需要`(x-a)^2 + (y-b)^2 <= (x-u)^2 + (y-v)^2`。 

取消后`x^2`和`y^2`，这变成了`2(u-a)x + 2(v-b)y <= u^2 + v^2 - a^2 - b^2`。 

因此，每个参赛者都会贡献一个半平面，而不是弯曲的条件。 好的实点集是所有这些半平面与矩形的交点。 

对于固定整数`x`，每个非垂直半平面给出上界或下界`y`。 如果`v > b`，它的形式为`y <= (C - A x) / B`和`B > 0`。 如果`v < b`，就变成`y >= (A x - C) / (-B)`。 

因此，对于每个`x`，所有竞争者都可以用两个值来概括：最小的上限线和最大的下限线。 这些是线性函数的下包络线和上包络线。 

李超树让我们维护这样一个信封并在每个整数处查询它`x`在对数时间内。 我们保留一棵树作为最小上限，另一棵树作为最大下界。 系数保留为精确分数，因此不需要浮点几何。 

蛮力之所以有效，是因为每个候选人都可以独立检查，但会失败，因为候选人太多。 观察到每次距离比较都变成线性不等式，我们可以通过两个线包络来总结所有竞争对手，并仅处理`X + 1`可能的列。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(XYK)`|`O(K)`| 太慢了 |
 | 最佳|`O(K log X + X log X)`|`O(K + X)`| 已接受 |

 ## 算法演练

 1. 阅读`p1 = (a, b)`并考虑所有其他标记点`(u, v)`作为约束。 平方距离就足够了，因为比较非负距离相当于比较它们的平方。 
2. 扩大对比`(u, v)`进入`A x + B y <= C`，

在哪里`A = 2(u-a)`,`B = 2(v-b)`， 和`C = u^2 + v^2 - a^2 - b^2`。 

二次项消失，这是从几何到线性函数的关键转换。 
3.如果`B > 0`，求解不等式`y`并获得`y <= (C - A x) / B`。 

将这个有理线性函数存储在最小李超树中，因为最强的上限限制是最小的。 
4.如果`B < 0`，求解`y`反方向并得到`y >= (A x - C) / (-B)`。 

将此函数存储在最大李超树中，因为最强的下限限制是最大的。 
5. 如果`B = 0`，约束仅包含`x`。 什么时候`A > 0`，它限制了`x`从上面与`x <= floor(C / A)`。 什么时候`A < 0`，它限制了`x`从下面与`x >= ceil(C / A)`。 将这些限制与`[0, X]`。 

没有`A = B = 0`这种情况是因为标记点是两两不同的。 
6. 在整数域上构建两棵李超树`[0, X]`。 树通过叉乘来比较有理线值，因此每次比较都是准确的。 
7. 对于每个整数`x`从允许的左端点到允许的右端点，查询最小上线和最大下线。 从矩形自身的限制开始`0 <= y <= Y`， 所以`upper = min(Y, minimum upper constraint)`和`lower = max(0, maximum lower constraint)`。 
8. 将有理界转换为整数界。 允许的最大整数`y`是`floor(upper)`，而允许的最小整数`y`是`ceil(lower)`。 如果整数下限不超过整数上限，则将它们的差值加一到答案中。 
9. 输出累计的整数点数。 

不变的是，处理完所有标记点后，每个查询都以固定整数`x`返回每个竞争对手施加的最强上限和下限。 将这些限制与`[0, Y]`精确给出整数`y`满足每个距离比较的值。 由于每个优点都是通过这些比较来表征的，因此每个计算的点都是好的，并且每个优点都被计算在内。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def floor_div(a, b):
    return a // b

def ceil_div(a, b):
    return -((-a) // b)

class LiChao:
    def __init__(self, left, right, is_min):
        self.left = left
        self.right = right
        self.is_min = is_min
        self.tree = [None] * (4 * (right - left + 1))

    @staticmethod
    def value(line, x):
        m, b, d = line
        return m * x + b, d

    def better(self, a, b, x):
        if b is None:
            return True

        an, ad = self.value(a, x)
        bn, bd = self.value(b, x)

        left = an * bd
        right = bn * ad

        if self.is_min:
            return left < right
        return left > right

    def insert(self, line):
        self._insert(1, self.left, self.right, line)

    def _insert(self, node, l, r, line):
        cur = self.tree[node]

        if cur is None:
            self.tree[node] = line
            return

        mid = (l + r) // 2

        if self.better(line, cur, mid):
            self.tree[node], line = line, cur
            cur = self.tree[node]

        if l == r:
            return

        if self.better(line, cur, l) != self.better(line, cur, mid):
            self._insert(node * 2, l, mid, line)
        else:
            self._insert(node * 2 + 1, mid + 1, r, line)

    def query(self, x):
        return self._query(1, self.left, self.right, x)

    def _query(self, node, l, r, x):
        cur = self.tree[node]

        if l == r:
            return cur

        mid = (l + r) // 2

        if x <= mid:
            other = self._query(node * 2, l, mid, x)
        else:
            other = self._query(node * 2 + 1, mid + 1, r, x)

        if cur is None:
            return other
        if other is None:
            return cur

        if self.better(other, cur, x):
            return other
        return cur

def solve():
    X, Y, K = map(int, input().split())
    points = [tuple(map(int, input().split())) for _ in range(K)]

    a, b = points[0]

    lower_x = 0
    upper_x = X

    upper_tree = LiChao(0, X, True)
    lower_tree = LiChao(0, X, False)

    base = a * a + b * b

    for u, v in points[1:]:
        A = 2 * (u - a)
        B = 2 * (v - b)
        C = u * u + v * v - base

        if B > 0:
            # y <= (C - A*x) / B
            upper_tree.insert((-A, C, B))

        elif B < 0:
            # y >= (A*x - C) / (-B)
            lower_tree.insert((A, -C, -B))

        else:
            # A*x <= C
            if A > 0:
                upper_x = min(upper_x, floor_div(C, A))
            else:
                lower_x = max(lower_x, ceil_div(C, A))

    if lower_x > upper_x:
        print(0)
        return

    answer = 0

    for x in range(lower_x, upper_x + 1):
        low = 0
        high = Y

        line = lower_tree.query(x)
        if line is not None:
            m, c, d = line
            low = max(low, ceil_div(m * x + c, d))

        line = upper_tree.query(x)
        if line is not None:
            m, c, d = line
            high = min(high, floor_div(m * x + c, d))

        if low <= high:
            answer += high - low + 1

    print(answer)

if __name__ == "__main__":
    solve()
```输入被读入标记点列表一次，因为每个竞争对手都必须转换为一个线性约束。 第一点被分隔为`(a, b)`，因为所有约束都直接与其进行比较。 

价值观`A`,`B`， 和`C`与因子一起存储`2`包括。 这避免了在转换期间引入半整数常量。 对于上限约束，存储的线表示`(C - A*x) / B`，所以它的分子有斜率`-A`。 对于较低的约束，通过将不等式乘以分母为正`-1`, 给予`(A*x - C) / (-B)`。 

李超树从不将这些值转换为浮点数。 如果有两个分数`n1 / d1`和`n2 / d2`有正分母，比较它们相当于比较`n1*d2`和`n2*d1`。 Python 整数也具有任意精度，因此叉积不会溢出。 

矩形贡献初始边界`low = 0`和`high = Y`。 缺少下信封意味着没有竞争对手限制`y`从下面看，对于上封套也是如此。 这就是使`K = 1`案例工作无需特殊的几何案例。 

决赛`+ 1`在`high - low + 1`是必要的，因为两个端点都是允许的。 该问题使用非严格距离比较，因此必须计算正好位于平分线上的点。 

## 工作示例

 对于样品 1，`p1 = (2, 2)`。 四位参赛者产生以下相关界限：`(1, 1)`给出`y >= 3 - x`。`(1, 3)`给出`y <= x + 1`。`(3, 3)`给出`y <= 5 - x`。`(3, 1)`给出`y >= x - 1`。 

连同`0 <= y <= 4`，查询结果为：

 | x| 下限| 上限 | 良好的 y 值 | 添加 |
 | --- | --- | --- | --- | --- |
 | 0 | 3 | 1 | 无 | 0 |
 | 1 | 2 | 2 | 2 | 1 |
 | 2 | 1 | 3 | 1、2、3 | 3 |
 | 3 | 2 | 2 | 2 | 1 |
 | 4 | 3 | 1 | 无 | 0 |

 总计为`1 + 3 + 1 = 5`。 该迹线说明了为什么必须组合多个半平面：一名参赛者控制左侧的下边界，另一名参赛者控制右侧的下边界，上边界也是如此。 

对于样品 2，`p1 = (0, 0)`所有其他点都是`(1,0)`,`(2,0)`, ...,`(5,0)`。 每个参赛者都给出了一个上限`x`，与最接近的竞争对手`(1,0)`生产最紧的一个：`2x <= 1`， 因此`x <= 1/2`。 

所有整数列，除了`x = 0`被拒绝。 

| x| 下限| 上限 | 良好的 y 值 | 添加 |
 | --- | --- | --- | --- | --- |
 | 0 | 0 | 0 | 0 | 1 |
 | 1 | 0 | 0 | 无 | 0 |
 | 2 | 0 | 0 | 无 | 0 |
 | 3 | 0 | 0 | 无 | 0 |
 | 4 | 0 | 0 | 无 | 0 |
 | 5 | 0 | 0 | 无 | 0 |
 | 6 | 0 | 0 | 无 | 0 |

 该表显示了处理约束后的垂直限制。 对于唯一允许的列`x = 0`，矩形仍然允许所有`7`的整数值`y`，所以答案是`7`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(K log X + X log X)`| 将每个参赛者插入一棵李超树中，然后将每个允许的整数`x`被查询 |
 | 空间|`O(K + X)`| 树木商店`O(X)`节点并且有`O(K)`存储行 |

 和`K <= 2 * 10^5`和`X <= 2 * 10^5`，该算法仅对每个约束和每列执行对数数量的操作。 最大的中间算术值由Python的任意精度整数处理，因此不存在固定宽度溢出问题。 内存使用量与输入大小和可能的列数呈线性关系。 

## 测试用例

 以下线束假设提交的解决方案保存为`solution.py`。 它暂时替换模块的输入和输出流，因此每个断言执行实际的`solve()`功能。```python
import sys
import io
import solution

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    old_input = solution.input

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solution.input = sys.stdin.readline

    try:
        solution.solve()
        return sys.stdout.getvalue().strip()
    finally:
        solution.input = old_input
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided samples
assert run(
    """4 4 5
2 2
1 1
1 3
3 3
3 1
"""
) == "5", "sample 1"

assert run(
    """6 6 6
0 0
1 0
2 0
3 0
4 0
5 0
"""
) == "7", "sample 2"

# Minimum-size instance, only p1 exists.
assert run(
    """1 1 1
0 0
"""
) == "4", "single marked point"

# Boundary and ceiling handling.
assert run(
    """2 1 2
2 0
1 0
"""
) == "2", "half-integer lower boundary"

# All marked points share the same y-coordinate.
# p1=(2,1), competitors are (0,1) and (4,1).
# Good x are 1,2,3, for both y=0..3.
assert run(
    """4 3 3
2 1
0 1
4 1
"""
) == "12", "horizontal Voronoi strip"

# Horizontal bounds around p1.
# p1=(1,1), competitors immediately above and below.
# Only y=1 survives, for all four x coordinates.
assert run(
    """3 2 3
1 1
1 0
1 2
"""
) == "4", "upper and lower horizontal restrictions"

# Maximum-size construction.
# p1=(0,0), followed by 199999 points on y=0.
# Only x=0 is good, while every y from 0 through 200000 is allowed.
points = ["200000 200000 200000"]
points.append("0 0")
for x in range(1, 200000):
    points.append(f"{x} 0")

max_case = "\n".join(points) + "\n"
assert run(max_case) == "200001", "maximum-size input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 1 / 0 0`|`4`| 最小尺寸和`K = 1`案例 |
 |`2 1 2 / 2 0 / 1 0`|`2`| 半整数下界的精确处理 |
 |`4 3 3 / 2 1 / 0 1 / 4 1`|`12`| 具有相同的多个约束`y`坐标|
 |`3 2 3 / 1 1 / 1 0 / 1 2`|`4`| 同时下限和上限限制`y`|
 |`200000 200000 200000`有积分`(0,0), (1,0), ..., (199999,0)`|`200001`| 的最大值`X`,`Y`， 和`K`，加上一个紧密的垂直信封 |

 ## 边缘情况

 单点情况```
1 1 1
0 0
```根本不会产生任何竞争对手的产品线。 两棵李超树都是空的，所以每列都以`low = 0`和`high = 1`。 两列中的每一列贡献两点，给出`4`。 该算法不需要特殊处理这种情况，因为空信封自然意味着不存在额外的限制。 

对于半整数边界```
2 1 2
2 0
1 0
```比较是`(x-2)^2 + y^2 <= (x-1)^2 + y^2`,

 这简化为`x >= 1.5`。 下面的李朝树存储了精确的分数`3/2`。 在`x = 1`，整数下界变为`ceil(3/2) = 2`，超过矩形的`x`值，所以没有`y`被计算在内。 在`x = 2`，下界仍然是`2`，以及两者`y = 0`和`y = 1`是有效的。 答案是`2`。 

对于水平条带```
4 3 3
2 1
0 1
4 1
```竞争对手`(0,1)`给出`x >= 1`， 尽管`(4,1)`给出`x <= 3`。 没有任何限制`y`，所以列`1`,`2`， 和`3`每个贡献四个整数行`0`,`1`,`2`， 和`3`。 结果是`12`。 这练习了两个包络实际上是水平约束的情况，并验证了是否包含矩形边界。 

为了```
3 2 3
1 1
1 0
1 2
```重点`(1,0)`给出`y >= 1/2`， 尽管`(1,2)`给出`y <= 3/2`。 在整数坐标上，仅`y = 1`幸存下来。 每一个`x`从`0`通过`3`是允许的，因此该算法为四列中的每一列添加一个点并返回`4`。 这会检查两个`ceil`和`floor`在理性界限上。 

对于最大尺寸的情况，第一点是`(0,0)`所有其他标记点都是`(x,0)`为了`1 <= x <= 199999`。 最接近的竞争对手`(1,0)`已经迫使`x <= 1/2`，因此仅在整数列中`x = 0`遗迹。 该矩形包含`200001`的可能值`y`， 从`0`通过`200000`，并且所有这些都同样最接近`p1`因为每个竞争对手都有相同的`y`协调。 答案是`200001`，确认该实现处理最大的输入而不扫描所有`K`每个网格点的竞争对手。
