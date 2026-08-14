---
title: "CF 102307A - 亚马逊"
description: "我们得到了几对点。 每对都确定了一条通过这两个点的无限直线地铁线路。 点之间的实际路段是无关紧要的，因为地铁线路无限延伸。"
date: "2026-08-13T23:33:58+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102307
codeforces_index: "A"
codeforces_contest_name: "2019 ICPC Universidad Nacional de Colombia Programming Contest"
rating: 0
weight: 102307
solve_time_s: 66
verified: true
draft: false
---

[CF 102307A - 亚马逊](https://codeforces.com/problemset/problem/102307/A)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了几对点。 每对都确定了一条通过这两个点的无限直线地铁线路。 点之间的实际路段是无关紧要的，因为地铁线路无限延伸。 

两条不同的地铁线路在垂直时会产生强烈的交叉。 同一几何线路可以由多个输入对描述，并且这些描述必须算作一条地铁线路。 任务是计算方向形成直角的不同几何线对的数量。 

输入在一个测试用例中最多包含 (10^5) 对，最多有 100 个测试用例。 坐标以 (2\cdot10^4) 为界，但答案可能比坐标范围大得多。 对于 (10^5) 行，检查每一对将需要大约 (10^{10}/2) 次比较，这远远超出了一秒的时间限制。 我们需要一个在输入对数量上接近线性或 (O(n\log n)) 的解决方案。 

有多种方式，粗心的实施可能会默默地计算出错误的东西。 首先，同一条线的重复描述不得产生额外的交叉点。 例如，```
1
3
0 0 2 0
5 0 -3 0
0 1 0 3
```包含水平线 (y=0) 和垂直线 (x=0) 的两个描述。 正确的输出是`1`，因为只有一条几何水平线，并且垂直于垂直线。 直接计算输入对会错误地产生两个交集。 

反转端点也必须保持线路不变。 例如，```
1
2
0 0 4 0
4 0 0 0
```同一行描述了两次，所以答案是`0`。 基于原始方向向量的表示将看到`(4, 0)`和`(-4, 0)`除非方向标准化，否则会有所不同。 

如果用除法表示坡度，则垂直线和水平线需要特殊处理。 例如，```
1
2
-20000 20000 20000 20000
20000 -20000 20000 20000
```描述了 (y=20000) 和 (x=20000)，它们是垂直的，所以答案是`1`。 使用浮点斜率是不必要的，并且可能会引入精度问题。 我们可以用整数完全表示每一行。 

最后，几条平行线是不同的地铁线路，当存在垂直族时必须单独计算。 例如，```
1
3
-2 0 2 0
-2 1 2 1
0 -2 0 2
```包含两条不同的水平线和一条垂直线。 正确答案是`2`，因为垂直线与两条水平线成直角相交。 

## 方法

 直接的方法是建造所有地铁线路，然后检查每一对地铁线路。 对于每一对，我们将检查它们是否不同以及它们的方向向量的点积是否为零。 这是正确的，因为每个强交叉点完全对应于一对垂直的不同线。 

问题在于比较的次数。 对于 (n=10^5)，有

 [
 \frac{n(n-1)}2 \约 5\cdot10^9
 ]

 对。 即使一次比较只需要几次整数运算，数十亿次比较也无法满足时间限制。 

关键的观察结果是，垂直度仅取决于线的方向，而可以通过识别完整的几何线来删除重复的输入对。 我们可以首先规范化每一行并将其放入一个集合中。 删除重复项后，我们只需要知道每个方向有多少条不同的线。 

通过 ((x_1,y_1)) 和 ((x_2,y_2)) 的线有一个方向向量

 [
 (dx,dy)=(x_2-x_1,y_2-y_1)。 
]

 要识别相同的方向（无论比例或方向如何），请除以 (\gcd(|dx|,|dy|)) 并选择一种符号约定。 例如，要求第一个非零分量为正。 因此`(4, 2)`,`(2, 1)`,`(-2, -1)`， 和`(-4, -2)`都代表同一个方向。 

然而，仅凭方向不足以识别一条线，因为平行线可能不同。 因此，我们将完整的生产线表示为

 [
 斧头+By+C=0，
 ]

 哪里

 [
 A=dy,\qquad B=-dx,\qquad C=dx,y_1-dy,x_1。 
]

 我们将所有三个系数除以它们的共同 gcd 并标准化它们的符号。 由此产生的三重`(A, B, C)`是几何线的独特表示。 

一旦知道每条不同的线，假设它的规范方向是`(dx, dy)`。 垂直方向是

 [
 (-dy,dx)。 
]

 我们使用相同的符号约定对该方向进行标准化。 如果`cnt[d]`是有方向的不同线的数量`d`，那么涉及该方向及其垂线的所有交点都贡献

 [
 cnt[d]\cdot cnt[perp]。 
]

 我们使用两个方向元组之间的简单排序比较，仅处理每个无序方向类对一次。 

蛮力方法之所以有效，是因为它直接检查强交集的定义，但它失败了，因为它对数十亿对重复了本质上相同的几何推理。 观察到答案仅取决于按方向分组的唯一线，从而将问题简化为构建一组并计算兼容组。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^2)) | (O(n)) | (O(n)) | 太慢了|
 | 最佳 | (O(n\log C+n)) 预期 | (O(n)) | (O(n)) | 已接受 |

 这里(C)表示整数系数的大小。 对于给定的坐标范围，gcd 计算实际上是恒定时间，因此实际复杂度是 (O(n)) 预期时间，因为 Python 集和字典提供预期 (O(1)) 插入和查找。 

## 算法演练

 1. 对于每对输入点，计算`dx = x2 - x1`和`dy = y2 - y1`。 这些值描述了地铁线路的方向，而不使用浮点运算。 
2. 使用以下公式构建直线方程 (Ax+By+C=0)`A = dy`,`B = -dx`， 和`C = dx*y1 - dy*x1`。 将所有三个系数除以它们的 gcd 并标准化它们的共同符号。 将生成的三元组存储在一个集合中。 这消除了对完全相同的几何线的重复描述，包括具有相反端点的描述。 
3. 对于每条新插入的线，对其方向向量进行归一化`(dx, dy)`除以`gcd(abs(dx), abs(dy))`。 如有必要，翻转两个分量，使第一个非零分量为正。 增加该方向的频率。 我们仅计算不同线路的方向，因为描述同一线路的两个输入对必须仅贡献一条地铁线路。 
4.处理完所有线后，迭代每个方向`d = (dx, dy)`。 构造其垂直方向为`(-dy, dx)`并用相同的约定将其标准化。 这两个方向类别表示的垂直对的数量为`cnt[d] * cnt[perp]`。 
5.仅在以下情况下添加本产品：`d < perp`按字典顺序。 这使得每对无序方向类只出现一次。 直线方向永远不可能等于其自身的垂直方向，因此不存在特殊的自配对情况。 

### 为什么它有效

 规范化后，每条几何地铁线路都只有一个线路键，因此该集合包含每条实际线路一次。 对于每条这样的线，其标准化方向独立于其位置和用于描述它的坐标来确定其方向。 当两个非零方向向量的点积为零时，它们恰好垂直，并且`(dx,dy)`垂直于`(-dy,dx)`。 因此，每对不同的垂直地铁线路恰好属于一对方向类`d`和`perp`。 频率乘积对每个类中一行的每个组合进行计数，而字典条件仅对无序一对类进行一次计数。 因此，最终的总和正是强交集的数量。 

## Python 解决方案```python
import sys
from math import gcd

input = sys.stdin.readline

def normalize_direction(dx, dy):
    g = gcd(abs(dx), abs(dy))
    dx //= g
    dy //= g

    if dx < 0 or (dx == 0 and dy < 0):
        dx = -dx
        dy = -dy

    return dx, dy

def solve():
    t = int(input())
    answers = []

    for _ in range(t):
        n = int(input())

        lines = set()
        direction_count = {}

        for _ in range(n):
            x1, y1, x2, y2 = map(int, input().split())

            dx = x2 - x1
            dy = y2 - y1

            # The problem describes a line using two locations,
            # so the two locations are assumed to be distinct.
            A = dy
            B = -dx
            C = dx * y1 - dy * x1

            g = gcd(gcd(abs(A), abs(B)), abs(C))
            A //= g
            B //= g
            C //= g

            if A < 0 or (A == 0 and B < 0) or (
                A == 0 and B == 0 and C < 0
            ):
                A = -A
                B = -B
                C = -C

            line = (A, B, C)

            if line in lines:
                continue

            lines.add(line)

            direction = normalize_direction(dx, dy)
            direction_count[direction] = direction_count.get(direction, 0) + 1

        answer = 0

        for dx, dy in direction_count:
            perp = normalize_direction(-dy, dx)

            if (dx, dy) < perp:
                answer += direction_count.get(perp, 0) * direction_count[(dx, dy)]

        answers.append(str(answer))

    sys.stdout.write("\n".join(answers))

if __name__ == "__main__":
    solve()
```这`normalize_direction`函数从方向向量中删除公因子，然后固定其方向。 条件`dx < 0 or (dx == 0 and dy < 0)`意味着水平方向变成`(positive, 0)`垂直方向变为`(0, positive)`。 这为每个无向方向提供了一种表示。 

直线方程使用方向向量来构造法向量。 自从`A = dy`和`B = -dx`，向量`(A, B)`垂直于线。 常数`C`选择使得第一个输入点满足方程。 将所有三个系数除以它们的共同 gcd 可以消除任意缩放。 

的符号归一化`(A, B, C)`是必要的，因为两者

 [
 斧头+By+C=0
 ]

 和

 [
 -Ax-By-C=0
 ]

 描述同一条线。 如果没有符号规则，相同的行可能会占用两个不同的集合条目。 

该行被插入到`lines`在计算其方向之前。 这个顺序是必要的。 如果该线已经出现，则其第二个描述不得增加方向频率。 

答案使用Python整数，因此即使最大交集数可以达到，也不存在溢出问题

 [
 \frac{10^5(10^5-1)}2=4,999,950,000。 
]

 最终的词典比较可以防止重复计算。 例如，如果`(1, 0)`垂直于`(0, 1)`， 加工`(1, 0)`在处理过程中对产品进行计数`(0, 1)`什么都不做，因为`(0, 1) < (1, 0)`是假的。 

## 工作示例

 ### 示例 1

 第一个测试用例包含行 (y=2)、(x=3) 和 (y=-3)。 

| 输入线| 规范方向 | 线路| 插入后方向计数 | 回答 |
 | --- | --- | --- | --- | --- |
 |`-3 2 2 2`|`(1, 0)`| (y=2) | (y=2) |`(1,0): 1`| 0 |
 |`3 1 3 -3`|`(0, 1)`| (x=3) | (x=3) |`(1,0): 1`,`(0,1): 1`| 0 |
 |`-3 -3 -1 -3`|`(1, 0)`| (y=-3) | (y=-3) |`(1,0): 2`,`(0,1): 1`| 0 |

 水平方向`(1,0)`垂直于垂直方向`(0,1)`。 它们的频率为 2 和 1，给出 (2\cdot1=2)。 因此输出是`2`。 此示例还演示了为什么平行线在重复删除后必须保持分离。 

### 示例 2

 这三条线的方向向量与`(-6, 9)`,`(6, 4)`， 和`(-4, 2)`。 

| 输入线| 归一化方向 | 垂直方向| 方向数 | 添加|
 | --- | --- | --- | --- | --- |
 |`2 -2 -4 7`|`(2, -3)`|`(3, 2)`| 1 | 最初为 0 |
 |`0 -2 6 2`|`(3, 2)`|`(-2, 3)`→`(2, -3)`| 1 | 1 |
 |`4 -2 0 0`|`(2, -1)`|`(1, 2)`| 1 | 0 |

 第一条线和第二条线垂直，因为它们的原始方向向量具有点积

 [
 (-6)\cdot6+9\cdot4=0。 
]

 第三方向在这三个线之间没有垂直的伙伴。 结果是`1`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n)) 预期 | 每行都使用恒定数量的 gcd 操作和预期的 (O(1)) 集合或字典操作，然后对不同的方向类进行一次传递。 |
 | 空间| (O(n)) | (O(n)) | 规范行集合和方向频率字典各自最多包含 (n) 个条目。 |

 对于 (n=10^5)，该算法对每个输入行大约执行几次哈希表操作，而不是数十亿个成对检查。 坐标范围还使整数系数保持足够小，使得 Python 的任意精度算术在这里很便宜。 

## 测试用例```python
import sys
import io
from math import gcd

def normalize_direction(dx, dy):
    g = gcd(abs(dx), abs(dy))
    dx //= g
    dy //= g

    if dx < 0 or (dx == 0 and dy < 0):
        dx = -dx
        dy = -dy

    return dx, dy

def solve(data):
    it = iter(data.strip().split())
    t = int(next(it))
    out = []

    for _ in range(t):
        n = int(next(it))

        lines = set()
        direction_count = {}

        for _ in range(n):
            x1 = int(next(it))
            y1 = int(next(it))
            x2 = int(next(it))
            y2 = int(next(it))

            dx = x2 - x1
            dy = y2 - y1

            A = dy
            B = -dx
            C = dx * y1 - dy * x1

            g = gcd(gcd(abs(A), abs(B)), abs(C))
            A //= g
            B //= g
            C //= g

            if A < 0 or (A == 0 and B < 0) or (
                A == 0 and B == 0 and C < 0
            ):
                A = -A
                B = -B
                C = -C

            line = (A, B, C)

            if line in lines:
                continue

            lines.add(line)

            d = normalize_direction(dx, dy)
            direction_count[d] = direction_count.get(d, 0) + 1

        ans = 0

        for d in direction_count:
            dx, dy = d
            p = normalize_direction(-dy, dx)

            if d < p:
                ans += direction_count[d] * direction_count.get(p, 0)

        out.append(str(ans))

    return "\n".join(out)

# Provided samples
sample_input = """\
3
3
-3 2 2 2
3 1 3 -3
-3 -3 -1 -3
3
2 -2 -4 7
0 -2 6 2
4 -2 0 0
2
0 -1 -6 1
2 5 -3 0
"""

assert solve(sample_input) == "2\n1\n0", "provided samples"

# Minimum-size input: one line cannot have an intersection.
assert solve("""\
1
1
0 0 1 1
""") == "0", "minimum size"

# Duplicate descriptions of the same line must count once.
assert solve("""\
1
3
0 0 4 0
4 0 0 0
-2 0 2 0
""") == "0", "duplicate line descriptions"

# Horizontal and vertical boundary-coordinate lines are perpendicular.
assert solve("""\
1
2
-20000 20000 20000 20000
20000 -20000 20000 20000
""") == "1", "boundary coordinates"

# Three lines: two horizontal and one vertical, giving two intersections.
assert solve("""\
1
3
-2 0 2 0
-2 1 2 1
0 -2 0 2
""") == "2", "multiple parallel lines"

# Maximum n, but every input pair describes the same geometric line.
max_case = ["1", "100000"]
max_case.extend(["0 0 20000 0"] * 100000)
assert solve("\n".join(max_case)) == "0", "maximum n"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 / 0 0 1 1`|`0`| 最小尺寸输入 |
 | 三份`y=0`|`0`| 删除重复行 |
 |`y=20000`和`x=20000`|`1`| 垂直、水平和坐标边界|
 | 两条水平线和一条垂直线 |`2`| 多条不同的平行线 |
 | 同线10万份|`0`| 最大输入大小和高效的重复处理 |

 ## 边缘情况

 ### 一行的重复描述

 对于```
1
3
0 0 4 0
4 0 0 0
-2 0 2 0
```所有三对都描述 (y=0)。 它们的归一化线方程是相同的规范三元组，因此只有一个条目达到`direction_count`。 不存在垂直方向，输出为`0`。 在删除重复线之前计算方向的解决方案会错误地认为存在三条水平线。 

### 反转端点

 对于```
1
2
0 0 4 0
4 0 0 0
```第一个方向是`(4,0)`第二个是`(-4,0)`。 两者均归一化为`(1,0)`。 更重要的是，两者都产生相同的规范线方程，因此第二个输入对作为重复项被丢弃。 答案是`0`。 

### 垂直线和水平线

 对于```
1
2
-20000 20000 20000 20000
20000 -20000 20000 20000
```第一行与方向水平`(1,0)`，而第二个与方向垂直`(0,1)`。 的垂直查找`(1,0)`产生`(0,1)`，每个方向的频率为一。 该产品是`1`，这是正确答案。 

### 多条平行线

 对于```
1
3
-2 0 2 0
-2 1 2 1
0 -2 0 2
```前两条线标准化为同一方向`(1,0)`但有不同的`C`线性方程中的值，因此两者都保留在集合中。 垂直线有方向`(0,1)`。 方向频率为 2 和 1，产生 (2\cdot1=2)。 即使水平线彼此平行，该算法也会计算两个物理交叉点。 

### 大答案

 如果存在许多不同的水平线和许多不同的垂直线，则每条水平线都垂直于每条垂直线。 答案可以接近（n^2/4），对于（n=10^5）来说，这是十亿。 该实现使用 Python 整数，因此结果可以准确表示而不会溢出。 

### 相同几何形状的最大输入

 对于同一对的 100000 个副本，即使输入很大，线集的大小仍为 1。 每个后续对都会被集合查找拒绝，最终答案为零。 这种情况也是一个有用的实际检查，确保解决方案不会意外地执行与输入描述对的数量成比例的工作。
