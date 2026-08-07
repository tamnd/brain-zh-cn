---
title: "CF 102498C - \u041a\u043e\u0434\u043e\u0432\u044b\u0439\u0437\u0430\u043c\u043e\u043a"
description: "该板包含三种单元：空单元、固定中心和可旋转手柄。 每个手柄必须指定两个方向之一。"
date: "2026-08-06T04:33:37+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102498
codeforces_index: "C"
codeforces_contest_name: "\u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u044b, \u0421\u0435\u0437\u043e\u043d 2019-2020, \u041f\u0435\u0440\u0432\u0430\u044f \u043b\u0438\u0447\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430"
rating: 0
weight: 102498
solve_time_s: 690
verified: false
draft: false
---

[CF 102498C - \u041a\u043e\u0434\u043e\u0432\u044b\u0439\u0437\u0430\u043c\u043e\u043a](https://codeforces.com/problemset/problem/102498/C)

 **评级：** -
 **标签：** -
 **求解时间：** 11m 30s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 该板包含三种单元：空单元、固定中心和可旋转手柄。 每个手柄必须指定两个方向之一。 仅当沿着其列移动最终到达中心并且该中心之前的每个单元格都是另一个垂直手柄时，垂直手柄才有效。 水平手柄沿其行遵循相同的规则。 

任务是为所有手柄选择方向或证明不存在这样的选择。 每行和每列最多有一个中心的限制是关键的结构属性。 它让我们能够独立地推理水平和垂直可见性。 

大小限制是`n <= 500`，因此网格最多包含 250000 个单元格。 尝试所有可能方向的算法是不可能的，因为句柄的数量也可能约为 250000 个，给出`2^250000`可能的状态。 即使重复检查多对单元的算法也可能变得太慢。 我们需要一个与细胞数量接近线性的解决方案。 

棘手的情况不仅仅是行或列中没有中心的句柄。 一个手柄可以单独具有两个可能的方向，但另一个手柄可以强制其中一个方向不可能。 

例如：```
3
.+.
O++
.O.
```正确答案是：```
No
```顶部中间的手柄只能是垂直的。 中间行中最右边的手柄只能是水平的，这会强制该行的中间手柄也水平。 同样的中间手柄需要垂直才能使顶部手柄到达下部中心，这就产生了矛盾。 

另一种情况是：```
1
+
```答案是：```
No
```任何地方都没有中心，因此唯一的手柄没有有效的方向。 

如果粗心的解决方案仅单独检查每个句柄，就会错过这些交互。 

## 方法

 直接的暴力解决方案将尝试所有可能的分配`|`和`-`到手柄。 对于每个分配，它都会通过沿所选方向行走来验证每个句柄，直到到达中心或无效单元格。 这是正确的，因为它准确地检查有效锁定状态的定义。 然而，当句柄数达到 250000 时，分配数量呈指数级增长，大约`2^250000`，这是不可能的。 

有用的观察是每个方向选择只产生逻辑含义。 如果手柄是水平的，则该手柄与同一行的中心之间的每个手柄也必须是水平的。 同样，如果手柄是垂直的，则该手柄与同一列中的中心之间的每个手柄也必须是垂直的。 

由于中心在行和列中是唯一的，因此这些含义形成简单的链。 例如，连续：```
O + + + .
```最右边的手柄是水平的意味着前一个手柄是水平的，这意味着前一个手柄是水平的。 我们不需要从每个句柄到每个其他句柄的边，只需要相邻的含义。 

这会将问题转换为 2-SAT。 每个句柄都是一个布尔变量。 我们可以解读`true`作为水平和`false`作为垂直的。 每个蕴涵都被添加到蕴涵图中，并且不可能的方向被表示为强制假值或强制真值。 令人满意的作业给出了所需的方向。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(2^k * n^2)`|`O(n^2)`| 太慢了 |
 | 最佳 |`O(n^2)`|`O(n^2)`| 已接受 |

 ## 算法演练

 1. 为每个句柄创建一个布尔变量。 真实状态意味着水平方向。 
2. 构建蕴涵图。 对于每个中心，从两个方向扫描其行。 从中心可见的连续手柄暗示着更远的水平手柄要求前一个手柄也是水平的。 添加对列和垂直方向的类似含义。 

相邻含义就足够的原因是，一系列含义会自动传播到整个段。 
3. 对于每个手柄，检查是否可以水平方向以及是否可以垂直方向。 如果一个方向无法到达任何中心，则添加禁止该方向的蕴涵。 
4. 找到蕴涵图的强连通分量。 如果一个变量和它的负数在同一个分量中，则约束相互矛盾，并且答案是不可能的。 
5. 否则，从组件订单中恢复满意的分配并打印`-`用于水平手柄和`|`用于垂直手柄。 

为什么它有效：

 蕴含图准确地包含了锁所需的条件。 任何有效的排列都必须满足每个含义，因为除非在该方向上之前的所有手柄都对齐，否则手柄无法到达中心。 相反，任何令人满意的含义分配都会使每个句柄选择的方向有效，因为所有必需的前驱句柄都被迫具有相同的方向。 SCC 检查是 2-SAT 的标准正确性条件：当变量同时暗示一个值及其相反时，就存在矛盾。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    a = [list(input().strip()) for _ in range(n)]

    pos = {}
    idx = 0
    for i in range(n):
        for j in range(n):
            if a[i][j] == '+':
                pos[(i, j)] = idx
                idx += 1

    m = idx
    g = [[] for _ in range(2 * m)]
    rg = [[] for _ in range(2 * m)]

    def add_edge(u, v):
        g[u].append(v)
        rg[v].append(u)

    def h(i):
        return 2 * i

    def v(i):
        return 2 * i + 1

    def add_same(x, y, horizontal):
        if horizontal:
            add_edge(h(x), h(y))
            add_edge(v(y), v(x))
        else:
            add_edge(v(x), v(y))
            add_edge(h(y), h(x))

    can_h = [False] * m
    can_v = [False] * m

    for r in range(n):
        c0 = -1
        for c in range(n):
            if a[r][c] == 'O':
                c0 = c
                break
        if c0 != -1:
            last = -1
            for c in range(c0 - 1, -1, -1):
                if a[r][c] == '.':
                    last = -1
                elif a[r][c] == '+':
                    x = pos[(r, c)]
                    can_h[x] = True
                    if last != -1:
                        add_same(x, last, True)
                    last = x
            last = -1
            for c in range(c0 + 1, n):
                if a[r][c] == '.':
                    last = -1
                elif a[r][c] == '+':
                    x = pos[(r, c)]
                    can_h[x] = True
                    if last != -1:
                        add_same(x, last, True)
                    last = x

    for c in range(n):
        r0 = -1
        for r in range(n):
            if a[r][c] == 'O':
                r0 = r
                break
        if r0 != -1:
            last = -1
            for r in range(r0 - 1, -1, -1):
                if a[r][c] == '.':
                    last = -1
                elif a[r][c] == '+':
                    x = pos[(r, c)]
                    can_v[x] = True
                    if last != -1:
                        add_same(x, last, False)
                    last = x
            last = -1
            for r in range(r0 + 1, n):
                if a[r][c] == '.':
                    last = -1
                elif a[r][c] == '+':
                    x = pos[(r, c)]
                    can_v[x] = True
                    if last != -1:
                        add_same(x, last, False)
                    last = x

    for i in range(m):
        if not can_h[i]:
            add_edge(h(i), v(i))
        if not can_v[i]:
            add_edge(v(i), h(i))

    order = []
    seen = [False] * (2 * m)

    sys.setrecursionlimit(1000000)

    def dfs(x):
        seen[x] = True
        for y in g[x]:
            if not seen[y]:
                dfs(y)
        order.append(x)

    for i in range(2 * m):
        if not seen[i]:
            dfs(i)

    comp = [-1] * (2 * m)

    def rdfs(x, c):
        comp[x] = c
        for y in rg[x]:
            if comp[y] == -1:
                rdfs(y, c)

    c = 0
    for x in reversed(order):
        if comp[x] == -1:
            rdfs(x, c)
            c += 1

    ans = [['.' for _ in range(n)] for _ in range(n)]
    for (r, col), x in pos.items():
        if comp[h(x)] == comp[v(x)]:
            print("No")
            return
        if comp[h(x)] > comp[v(x)]:
            ans[r][col] = '-'
        else:
            ans[r][col] = '|'

    for i in range(n):
        for j in range(n):
            if a[i][j] == 'O':
                ans[i][j] = 'O'

    print("Yes")
    for row in ans:
        print(''.join(row))

solve()
```该程序首先为每个句柄分配一个索引，以便 2-SAT 图可以使用紧凑的整数节点。 每个变量都有两个图形节点：一个用于水平方向，一个用于垂直方向。 

行和列扫描构建蕴含图。 变量`last`将最近的前一个句柄存储在可见链中。 仅链接相邻句柄可避免创建二次边数，同时保留相同的传递信息。 

通过添加从该方向到其相反方向的蕴涵来处理不可能的方向。 SCC 阶段检测矛盾并提供重建有效分配所需的排序。 

该实现使用迭代输入处理，并避免存储任何大于原始板的网格派生结构。 Python 递归深度增加是因为蕴涵图可以包含长链。 

## 工作示例

 对于第一个样本：```
3
O++
+.+
++O
```相关的状态变化是：

 | 手柄| 可能的水平| 可能的垂直| 决赛|
 | ---| ---| ---| ---|
 | (0,1)| 是的 | 没有| 水平|
 | (0,2) | 是的 | 是的 | 垂直|
 | (1,0)| 没有| 是的 | 垂直|
 | (2,0) | 是的 | 是的 | 水平|
 | (2,1) | 是的 | 是的 | 水平|

 蕴涵图没有矛盾，因此 SCC 分配产生有效的排列，例如：```
O-|
|.|
--O
```对于第二个样本：```
4
..+.
....
..O.
..+.
```状态是：

 | 手柄| 可能的水平| 可能的垂直|
 | ---| ---| ---|
 | (0,2) | 没有| 没有|
 | (3,2) | 没有| 是的 |

 顶部手柄在任一方向上都没有可到达的中心，因此该图包含强制矛盾，答案为`No`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(n^2)`| 每次扫描都会接触每个单元格恒定的次数，并且 SCC 在蕴含图上以线性时间运行。 |
 | 空间|`O(n^2)`| 该图有`O(n^2)`顶点和边。 |

 最大网格大小可提供 250000 个图柄和最多数倍的图形边数，这符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    # In a local judge, import the submitted solve function and call it here.
    # The placeholder is intentional because this block is only a test template.
    sys.stdin = old
    return ""

assert "Yes" in run("""3
O++
+.+
++O
""")

assert "No" in run("""4
..+.
....
..O.
..+.
""")

assert "No" in run("""3
.+.
O++
.O.
""")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 无中心单手柄|`No`| 能见度缺失案例 |
 | 样品1 |`Yes`| 水平和垂直混合链|
 | 样品 3 |`No`| 句柄之间的冲突含义 |

 ## 边缘情况

 第一个边缘情况是没有可能方向的手柄。 输入```
1
+
```创建一个禁止两个方向的变量。 该算法将两个矛盾相加，使得该变量及其相反的变量属于同一个SCC，因此它打印`No`。 

第二种边缘情况是一个在两个方向上单独有效但受其他句柄约束的句柄。 在```
3
.+.
O++
.O.
```第二排的中间手柄参与两条链条。 蕴涵图捕获了这两个要求，并且 SCC 测试检测到手柄需要水平和垂直。 这可以防止独立检查每个手柄的常见错误。
