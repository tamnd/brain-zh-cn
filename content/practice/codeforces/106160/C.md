---
title: "CF 106160C - 一致性"
description: "每个模型都由一个非常大的板上的圆圈表示。 输入给出圆的中心坐标及其直径。 当两个模型的底座边缘之间的距离最多为两英寸时，两个模型被视为直接连接。"
date: "2026-06-25T11:11:45+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106160
codeforces_index: "C"
codeforces_contest_name: "2025 Benelux Algorithm Programming Contest (BAPC 25)"
rating: 0
weight: 106160
solve_time_s: 56
verified: true
draft: false
---

[CF 106160C - 一致性](https://codeforces.com/problemset/problem/106160/C)

 **评级：** -
 **标签：** -
 **求解时间：** 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个模型都由一个非常大的板上的圆圈表示。 输入给出圆的中心坐标及其直径。 

当两个模型的底座边缘之间的距离最多为两英寸时，两个模型被视为直接连接。 由于所有坐标和直径均以毫米为单位，因此 2 英寸等于 50.8 毫米。 

如果我们构建一个图，其中每个模型都是一个顶点，每个直接连接的对都是一条边，那么当两个条件成立时，集合是连贯的。 

首先，图形必须是连接的。 每个模型都必须可以通过直接连接链从每个其他模型访问。 

其次，当单元包含至少七个模型时，每个模型的程度必须至少为二。 仅连接到一个邻居的模型是不够的。 

输入大小是主要挑战。 最多可以有 200,000 个模型。 对每一对进行简单的检查大约需要$$\frac{200000 \cdot 199999}{2} \approx 2 \cdot 10^{10}$$距离计算，这是完全不可能的。 

关键的几何观察是基底​​很小。 最大直径仅为160毫米，因此中心之间可能的最大连接距离为$$80 + 80 + 50.8 = 210.8 \text{ mm}.$$任何边缘都无法连接中心距离超过 210.8 毫米的模型。 

这种有界交互半径使得空间分区解决方案成为可能。 

当两个模型恰好位于允许的距离时，会出现微妙的边缘情况。 例如：```
2
13 13 25
88 13 25
```中心距为75毫米。 半径之和为25毫米。 底座之间的间隙正好是 50 毫米，在 50.8 毫米以内，所以答案是`yes`。 

严格的`<`比较会错误地拒绝此类情况。 

另一个重要的情况是具有七个或更多模型的连通图，其中一个顶点的度数为一。```
7
...
```即使图是连通的，答案也一定是`no`因为一旦单位规模达到七，学位要求就会生效。 

错误的第三个来源是浮点精度。 阈值涉及50.8毫米。 直接比较浮点距离可能会导致临界错误。 最安全的方法是使用平方距离将条件转换为整数比较。 

## 方法

 暴力解决方案很简单。 对于每对模型，计算它们是否直接连接。 每当存在边时，将其添加到图中、更新度数并将端点合并到 DSU 中。 处理完所有对后，验证连通性和度数条件。 

这是有效的，因为一致性的定义实际上是一个图属性。 问题是对的数量。 20万个模型，配对数约为200亿，远远超出了时间限制。 

我们可以做得更好的原因是边缘非常局部。 无论模型在百公里板上的哪个位置，都只能连接中心距在210.8毫米以内的模型。 

这表明将平面划分为正方形单元。 如果单元边长大于最大可能的连接半径，则任何模型只能连接到其自己单元或八个相邻单元之一中的模型。 

使用 211 毫米的单元尺寸就足够了，因为每个可能的边的长度最多为 210.8 毫米。 

现在每个模型只需要与一小部分附近的模型进行比较。 由于碱基永远不会重叠，因此中心的接近程度存在下限。 在恒定大小的邻域内，只能存在恒定数量的模型。 在实践中和几何堆积论证中，比较的总数变成线性的。 

每当找到有效边时，我们都会更新度计数并将端点合并到 DSU 中。 处理完所有附近的对后，我们检查所有模型是否属于一个组件，以及每个度数是否至少为二：$n \ge 7$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(n) | 太慢了 |
 | 最佳 | O(n α(n)) 预期/几何线性 | O(n) | 已接受 |

 ## 算法演练

 1. 读取所有模型并存储它们的坐标和直径。 
2. 创建每个模型一个节点的 DSU。 
3. 选择 211 毫米的网格单元尺寸。 这略大于最大可能的中心到中心连接距离。 
4. 一一处理模型。 对于模型在`(x, y)`，计算其单元坐标：$$(x // 211,\; y // 211)$$5. 在将模型插入网格之前，检查由其自身单元格和八个相邻单元格组成的九个单元格。 

任何比该距离更远的模型都无法连接，因为像元大小已经超过了最大边长。 
6. 对于在这些单元中找到的每个先前存储的模型，测试是否存在边缘。 

设直径为`d1`和`d2`。 

连接条件为$$\text{center distance}
\le
\frac{d_1+d_2}{2}+50.8$$为了避免浮点运算，请将其重写为$$100 \cdot \text{dist}^2
\le
(5(d_1+d_2)+508)^2$$7. 只要条件成立，就增加两个度数并合并 DSU 中的两个顶点。 
8. 将当前模型插入其网格单元中。 
9. 处理完所有模型后，验证每个模型是否属于同一个 DSU 组件。 
10.如果`n >= 7`，验证每个度数至少为二。 
11. 输出`"yes"`如果两项检查都通过，否则输出`"no"`。 

### 为什么它有效

 网格永远不会错过任何一个边缘。 每个有效边的长度最多为 210.8 毫米，而每个单元的边长为 211 毫米。 在任一坐标中像元相差超过 1 的两个点在至少一个轴上的间距必须大于 211 毫米，从而不可能形成边缘。 

当处理后面的端点时，每个实际边缘都会被测试一次。 每当根据问题定义存在边时，算法就会将其添加到 DSU 并更新度数计数。 

因此，DSU 准确地表示相干图的连通分量，并且度数组准确地包含图的度数。 最终的检查正是一致单元定义中的两个条件。 

## Python 解决方案```python
import sys
from collections import defaultdict

input = sys.stdin.readline

CELL = 211

class DSU:
    def __init__(self, n):
        self.p = list(range(n))
        self.sz = [1] * n

    def find(self, x):
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)

        if a == b:
            return

        if self.sz[a] < self.sz[b]:
            a, b = b, a

        self.p[b] = a
        self.sz[a] += self.sz[b]

def solve():
    n = int(input())

    models = []
    for _ in range(n):
        x, y, d = map(int, input().split())
        models.append((x, y, d))

    dsu = DSU(n)
    deg = [0] * n

    grid = defaultdict(list)

    for i, (x, y, d) in enumerate(models):
        cx = x // CELL
        cy = y // CELL

        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                cell = (cx + dx, cy + dy)

                for j in grid.get(cell, []):
                    x2, y2, d2 = models[j]

                    dist2 = (x - x2) * (x - x2) + (y - y2) * (y - y2)

                    rhs = 5 * (d + d2) + 508

                    if 100 * dist2 <= rhs * rhs:
                        deg[i] += 1
                        deg[j] += 1
                        dsu.union(i, j)

        grid[(cx, cy)].append(i)

    root = dsu.find(0)

    for i in range(1, n):
        if dsu.find(i) != root:
            print("no")
            return

    if n >= 7:
        for d in deg:
            if d < 2:
                print("no")
                return

    print("yes")

solve()
```DSU 跟踪连接性而无需显式存储图表。 每个发现的边都会立即合并其端点。 

几何搜索由哈希网格处理。 模型仅与已插入相邻单元的模型进行比较，这避免了重复检查。 

距离比较完全基于整数。 表达式```
rhs = 5 * (d + d2) + 508
```将阈值乘以 10 得出：$$10 \cdot \left(\frac{d_1+d_2}{2}+50.8\right)
=
5(d_1+d_2)+508$$两边平方会产生精确的整数比较，没有精度问题。 

连接性检查使用单个代表根。 如果任何顶点属于不同的 DSU 组件，则该图将断开连接。 

仅当以下情况时才检查度数条件：`n >= 7`，与问题陈述完全匹配。 

## 工作示例

 ### 示例 1

 输入：```
2
13 13 25
88 13 25
```| 我| 职位| 学位变化| 组件|
 | ---| ---| ---| ---|
 | 0 | (13,13) | 无 | {0} |
 | 1 | (88,13) | 度[0]++，度[1]++ | {0,1} |

 最终学位：

 | 顶点| 学位|
 | ---| ---|
 | 0 | 1 |
 | 1 | 1 |

 该图已连接。 自从`n < 7`，度数规则不适用。 答案是`yes`。 

### 示例 2

 输入：```
7
1066 910 130
1007 1032 130
875 1062 130
770 978 130
770 843 130
875 758 130
1007 788 130
```| 顶点| 加工后度|
 | ---| ---|
 | 0 | 2 |
 | 1 | 2 |
 | 2 | 2 |
 | 3 | 2 |
 | 4 | 2 |
 | 5 | 2 |
 | 6 | 2 |

 所有顶点形成单个循环结构。 该图是连通的并且每个度至少为二。 答案是`yes`。 

此示例说明了为什么度数条件与连通性分开。 当存在七个或更多模型时，仅靠连通图是不够的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n α(n)) 预期 | 每个模型仅与恒定大小邻域中的附近模型交互
 | 空间| O(n) | DSU、度数组和网格存储 |

 棋盘很大，但交互半径却很小且有限。 空间哈希使距离检查的数量与模型的数量成正比，使解决方案能够轻松快速地处理 200,000 个输入。 

## 测试用例```python
# helper: run solution on input string, return output string
import io
import sys
from collections import defaultdict

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline
    CELL = 211

    class DSU:
        def __init__(self, n):
            self.p = list(range(n))
            self.sz = [1] * n

        def find(self, x):
            while self.p[x] != x:
                self.p[x] = self.p[self.p[x]]
                x = self.p[x]
            return x

        def union(self, a, b):
            a = self.find(a)
            b = self.find(b)
            if a == b:
                return
            if self.sz[a] < self.sz[b]:
                a, b = b, a
            self.p[b] = a
            self.sz[a] += self.sz[b]

    n = int(input())
    models = [tuple(map(int, input().split())) for _ in range(n)]

    dsu = DSU(n)
    deg = [0] * n
    grid = defaultdict(list)

    for i, (x, y, d) in enumerate(models):
        cx = x // CELL
        cy = y // CELL

        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                for j in grid.get((cx + dx, cy + dy), []):
                    x2, y2, d2 = models[j]
                    dist2 = (x - x2) ** 2 + (y - y2) ** 2
                    rhs = 5 * (d + d2) + 508
                    if 100 * dist2 <= rhs * rhs:
                        deg[i] += 1
                        deg[j] += 1
                        dsu.union(i, j)

        grid[(cx, cy)].append(i)

    root = dsu.find(0)

    ok = True
    for i in range(n):
        if dsu.find(i) != root:
            ok = False

    if ok and n >= 7:
        ok = all(d >= 2 for d in deg)

    return ("yes\n" if ok else "no\n")

# provided samples
assert run("2\n13 13 25\n88 13 25\n") == "yes\n"
assert run("2\n13 13 25\n89 13 25\n") == "no\n"

# custom cases
assert run("2\n0 0 25\n1000 0 25\n") == "no\n"
assert run("3\n0 0 25\n50 0 25\n100 0 25\n") == "yes\n"
assert run("7\n0 0 25\n50 0 25\n100 0 25\n150 0 25\n200 0 25\n250 0 25\n300 0 25\n") == "no\n"
assert run("7\n100 0 130\n62 78 130\n-22 97 130\n-90 43 130\n-90 -43 130\n-22 -97 130\n62 -78 130\n") == "yes\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 两个相距甚远的模型 | 没有| 断开连接图|
 | 连锁三款| 是的 | 通过中间顶点的连接 |
 | 七模路径| 没有| 程度条件激活 |
 | 七款自行车 | 是的 | 连接且每度至少有两个 |

 ## 边缘情况

 考虑完全处于允许阈值的两个模型：```
2
13 13 25
88 13 25
```中心距离为75。阈值为$$12.5 + 12.5 + 50.8 = 75.8.$$整数比较接受边缘，因为它使用`<=`， 不是`<`。 该图是连通的，所以答案是`yes`。 

现在考虑七个模型的连接链：```
7
0 0 25
50 0 25
100 0 25
150 0 25
200 0 25
250 0 25
300 0 25
```该图是连通的，但端点的度数为一。 边缘处理后，度数数组的开头和结尾为`1`。 自从`n >= 7`，算法拒绝单位并打印`no`。 

最后，考虑浮点边界附近的情况。 该算法从不计算平方根，也从不将 50.8 存储为浮点阈值。 它检查$$100 \cdot \text{dist}^2
\le
(5(d_1+d_2)+508)^2$$仅使用整数，因此舍入误差不会错误地更改结果。
