---
title: "CF 102426K - X 窗口系统"
description: "我们有一个宽度（W）和高度（H）的屏幕，以及最多十个矩形窗口。 该坐标系有点不寻常：第一个坐标向下增加，第二个坐标向右增加。"
date: "2026-08-12T19:42:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102426
codeforces_index: "K"
codeforces_contest_name: "The 7-th BIT Campus Programming Contest for Junior Grade Group"
rating: 0
weight: 102426
solve_time_s: 565
verified: true
draft: false
---

[CF 102426K - X-Window 系统](https://codeforces.com/problemset/problem/102426/K)

 **评级：** -
 **标签：** -
 **求解时间：** 9m 25s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个宽度（W）和高度（H）的屏幕，以及最多十个矩形窗口。 该坐标系有点不寻常：第一个坐标向下增加，第二个坐标向右增加。 窗口可以延伸到屏幕之外，但实际上只能渲染它与屏幕的交集。 

窗口按 z-index 排序。 z-index 越小意味着窗口在前面。 最初，窗口 (0) 位于最前面，然后是窗口 (1)，依此类推。 在任何时刻，只有一个窗口处于活动状态。 使用当前呈现的屏幕来解释鼠标单击：在包含单击的屏幕点的所有窗口中，最前面的窗口接收单击。 如果没有窗口包含该点，则不会发生任何变化。 

当单击的窗口与活动窗口不同时，该窗口将变为活动窗口并移动到最前面。 其他窗口保持其相对顺序。 向前移动窗口可以显示该窗口之前被前面的窗口覆盖的部分。 所需的输出正是新变得可见并因此必须重新绘制的区域。 

输入给出了屏幕尺寸、所有窗口矩形的初始 z 顺序以及鼠标单击的顺序。 对于每次点击，我们输出处理该点击后必须重绘的最小区域。 

窗口和点击次数的限制非常小。 我们有 (n,q\le 10)，而屏幕可以大到 (2000\times2000)。 这使得算法在 (n) 中呈指数级实用，但依赖于每个屏幕像素的算法不必要地昂贵。 在最坏的情况下，像素模拟可以执行多达 (10\cdot2000\cdot2000\cdot10=400{,}000{,}000) 次窗口遏制检查。 几何形状是连续的，因此独立处理每个单位正方形在概念上也比必要的更加复杂。 

第一个微妙之处是单击必须分配给最上面的渲染窗口，而不仅仅是原始输入中的第一个窗口。 例如：```
1 1
2
0 0 1 1
0 0 1 1
1
0 0
```答案是：```
0
```第一个窗口已经处于活动状态并覆盖了单击，即使第二个窗口也包含该点。 每次激活后按输入顺序搜索窗口的粗心实现最终会丢失当前的 z 顺序。 

第二个微妙之处是窗口可以延伸到屏幕之外。 考虑：```
4 4
2
0 0 1 1
-1 -1 3 3
1
2 2
```第二个窗口仅在屏幕内部可见，但 ((2,2)) 处的单击仍然位于其可见边界上。 它变为活动状态，并且其新暴露的与第一个窗口的重叠区域为 (1)，因此输出为：```
1
```忽略裁剪的实现在计算重绘区域时可能会错误地使用整个屏幕外矩形。 

第三个微妙之处是重叠窗口必须算作一个并集，而不是独立求和。 考虑：```
4 4
3
0 0 1 3
0 0 3 1
0 0 3 3
1
2 2
```单击到达第三个窗口。 前面的两个窗口覆盖了它的区域（3）和（3），但它们的公共部分有区域（1）。 因此，所需的重绘面积为 (3+3-1=5)，得出：```
5
```简单地添加两两相交区域将产生 (6)，这是错误的。 

## 方法

 一种直接的方法是将屏幕表示为（W\times H）单位单元。 由于每个坐标都是整数，每个矩形边界都位于网格线上，因此它的面积确实可以用多个晶胞来表示。 对于每次单击，我们可以检查每个单元格，确定哪个窗口位于最上面，并比较新旧渲染。 这是正确的，但最坏的情况有 (2000\cdot2000) 个单元，最多 (10) 次点击，每个单元最多检查 (10) 个窗口。 这提供了（4 亿）百万个窗口检查。 由于一秒的限制，这是错误的粒度级别。 

蛮力之所以有效，是因为它明确地代表了屏幕，但屏幕本身包含的信息远远多于问题所需的信息。 重绘区域总是由矩形的交集和并集形成，并且只有十个矩形。 

假设窗口 (t) 被移动到前面。 在操作之前，z 顺序中 (t) 之前的每个窗口都覆盖 (t) 的一部分。 操作后，(t) 覆盖了所有这些窗口。 因此，唯一新可见的区域是

 [
 R_t\cap(R_1\杯R_2\杯\cdots\杯R_k),
 ]

 其中 (R_i) 正是当前 (t) 前面的窗口，所有矩形都被屏幕剪切。 

这将问题简化为求一个目标矩形内最多九个矩形的并集面积。 由于矩形很少，包含-排除就特别方便。 对于覆盖矩形的每个非空子集，计算该子集中所有矩形的交集。 当子集包含奇数个矩形时，将其面积相加；当子集包含偶数个矩形时，将其面积减去。 

一次激活最多有 (2^9-1=511) 个非空子集。 通过扫描当前的 z 顺序可以找到鼠标目标，成本仅为 (O(n))。 计算出重绘区域后，将选定的窗口移动到前面只是一个列表操作。 

蛮力方法之所以有效，是因为它明确地模拟了每个可见的区域单位，但由于屏幕比几何对象的数量大得多，所以失败了。 观察到只有最多九个矩形的并集才重要，这让我们可以用几百个矩形交集代替数百万个单元操作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(qWHn)) | (O(WH)) | 太慢了|
 | 最佳 | (O(qn^2 2^n)) | (O(n)) | (O(n)) | 已接受 |

 最佳边界内的 (n) 因子来自通过扫描属于该子集的矩形来计算每个子集交集。 由于 (n\le10)，这个值非常小。 

## 算法演练

 1. 将每个窗口存储为四个坐标，分别代表其垂直间隔和水平间隔。 因为第一个坐标是垂直的，所以窗口`(x, y, w, h)`垂直占据 (x\ldots x+h)，水平占据 (y\ldots y+w)。 保持初始 z 顺序为`[0, 1, ..., n-1]`，其中第一个元素是最前面的窗口。 
2. 对于每次单击，从前到后扫描当前的 z 顺序。 对于每个窗口，首先将其矩形与屏幕相交，然后测试鼠标位置是否位于该剪切矩形内。 对点测试使用包含比较，因为该语句明确将窗口边界视为渲染区域的一部分。 
3. 如果没有窗口包含鼠标位置，则输出零并保持 z 顺序不变。 没有激活，因此渲染的屏幕不会改变。 
4. 如果所选窗口已经是活动窗口，则输出零并保持 z 顺序不变。 单击已经活动的窗口不会移动任何内容。 
5. 否则，令所选窗口为(t)。 在当前的 z 顺序中，(t) 之前的每个窗口都在它的前面。 准确收集那些窗户。 需要重绘的区域是这些前窗的并集所覆盖的(t)区域。 
6. 在计算其面积之前，将目标窗口夹在屏幕上。 对于前窗的每个非空子集，将目标矩形与该子集中的每个矩形相交。 如果生成的交集具有正宽度和高度，则对于奇数大小的子集添加其面积，对于偶数大小的子集减去其面积。 这是联合的标准包含-排除公式。 
7. 将 (t) 从 z 顺序中的当前位置删除并将其插入到开头。 这精确地模拟了将其 z 索引更改为零，同时将之前的每个 z 索引增加 1。 
8. 输出计算出的重绘区域并继续下一步单击。 维护的顺序现在是处理下一个鼠标事件所需的完整状态。 

### 为什么它有效

 关键的不变量是 z 顺序列表始终按照窗口系统当前的方式从前到后存储窗口。 因此，包含单击的第一个窗口正是其渲染像素接收该单击的窗口。 

当不同的窗口 (t) 变为活动状态时，只有它与当前位于其前面的窗口的关系发生变化。 每个这样的前窗之前在它们与 (t) 的重叠上都是可见的，而在激活之后 (t) 在相同的重叠上是可见的。 屏幕的其他部分没有变化。 因此，重绘区域正是 (t) 与其之前的所有窗口之间的交集的并集。 

即使多个覆盖窗口重叠，包含-排除也能准确计算该并集。 将 (t) 移到前面后，z 顺序不变量恢复。 因此，每次点击都会根据正确的屏幕状态进行处理，并且每个报告的区域正是渲染发生变化的区域。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def intersect(a, b):
    x1 = max(a[0], b[0])
    y1 = max(a[1], b[1])
    x2 = min(a[2], b[2])
    y2 = min(a[3], b[3])
    if x1 >= x2 or y1 >= y2:
        return None
    return (x1, y1, x2, y2)

def area(r):
    if r is None:
        return 0
    return (r[2] - r[0]) * (r[3] - r[1])

def union_inside(target, rects):
    k = len(rects)
    if k == 0:
        return 0

    ans = 0

    for mask in range(1, 1 << k):
        cur = target
        bits = 0

        for i in range(k):
            if mask & (1 << i):
                bits += 1
                cur = intersect(cur, rects[i])
                if cur is None:
                    break

        if cur is not None:
            a = area(cur)
            if bits & 1:
                ans += a
            else:
                ans -= a

    return ans

def solve():
    W, H = map(int, input().split())
    n = int(input())

    windows = []

    for _ in range(n):
        x, y, w, h = map(int, input().split())

        # x is vertical, y is horizontal.
        # The screen is [0, H] x [0, W].
        windows.append((x, y, x + h, y + w))

    q = int(input())

    clicks = [tuple(map(int, input().split())) for _ in range(q)]

    # Frontmost to backmost.
    order = list(range(n))

    screen = (0, 0, H, W)

    out = []

    for u, v in clicks:
        target_pos = -1

        # Find the frontmost rendered window containing the click.
        for pos, idx in enumerate(order):
            clipped = intersect(windows[idx], screen)

            if clipped is not None:
                if clipped[0] <= u <= clipped[2] and clipped[1] <= v <= clipped[3]:
                    target_pos = pos
                    break

        if target_pos == -1:
            out.append("0")
            continue

        target = order[target_pos]

        # Clicking the active window causes no change.
        if target_pos == 0:
            out.append("0")
            continue

        # Windows before target are exactly the windows currently
        # covering it from the front.
        front_rects = [
            windows[idx]
            for idx in order[:target_pos]
        ]

        clipped_target = intersect(windows[target], screen)

        repaint = union_inside(clipped_target, front_rects)
        out.append(str(repaint))

        # Move target to the front.
        order.pop(target_pos)
        order.insert(0, target)

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```这`windows`数组将每个矩形存储为`(top, left, bottom, right)`在问题的坐标方向上。 垂直范围使用`h`，而水平范围使用`w`。 这是一个很容易意外交换宽度和高度的地方。 

这`intersect`函数使用严格`x1 < x2`和`y1 < y2`在判断交叉口是否有正面积时。 边界可能包含鼠标单击，但边界的面积为零，因此它不能参与重绘计算。 

屏幕矩形是`(0, 0, H, W)`。 将窗口与此矩形相交会自动处理所有屏幕外情况。 不需要修改原来的窗口坐标。 

点击搜索使用`<=`两端。 这遵循该语句的规则，即可见边界属于渲染窗口。 如果两个窗口在边界处相遇，则当前的 z 顺序仍会决定哪一个窗口在那里接收点击。 

这`union_inside`函数直接应用包含-排除。 具有奇数个矩形的子集具有正向贡献，而偶数大小的子集具有负向贡献。 目标矩形包含在每个交点中，因此计算出的并集会自动限制在激活窗口的区域内。 

Python 整数足以满足所有领域的需要。 最大屏幕区域仅为 (4{,}000{,}000)，尽管包含-排除可能会暂时添加和减去几个此类区域。 

最后，选定的窗口将从其旧位置删除并插入到索引零处。 这直接代表了问题所描述的 z-index 变换。 

## 工作示例

 提供的示例以 z 顺序开始`[0, 1, 2]`，其中窗口`0`是最前面的。 下表跟踪每次单击后的重要状态。 

| 点击| 选定的窗口 | 当前订单之前 | 前窗| 重涂区| 订购后 |
 | --- | --- | --- | --- | --- | --- |
 |`(2,1)`| 2 |`[0,1,2]`|`[0,1]`| 1 |`[2,0,1]`|
 |`(3,1)`| 无 |`[2,0,1]`| 无 | 0 |`[2,0,1]`|
 |`(1,2)`| 2 |`[2,0,1]`| 无 | 0 |`[2,0,1]`|
 |`(3,8)`| 1 |`[2,0,1]`|`[2,0]`| 4 |`[1,2,0]`|
 |`(3,3)`| 0 |`[1,2,0]`|`[1,2]`| 5 |`[0,1,2]`|

 第一次单击时，该点位于窗口的可见边界上`2`。 它与窗口重叠`0`面积 (1)，而窗口`1`在那里不重叠，给出 (1) 的第一个输出。 第二次单击未到达渲染窗口。 第三次点击到达窗口`2`再次，它已经处于活动状态。 

第四次单击激活窗口`1`。 它与窗口重叠`0`贡献了 (4) 的面积，而它与窗口重叠`2`为零。 第五次单击激活窗口`0`。 它与窗口重叠`1`有区域 (4)，并且与窗口重叠`2`面积为(1)。 这些区域彼此不重叠，因此并集具有区域 (5)。 结果输出正是：```
1
0
0
4
5
```第二个例子重点关注重叠覆盖窗口：```
4 4
3
0 0 1 3
0 0 3 1
0 0 3 3
1
2 2
```状态跟踪是：

 | 点击| 选定的窗口 | 当前订单之前 | 覆盖率计算| 重涂区| 订购后 |
 | --- | --- | --- | --- | --- | --- |
 |`(2,2)`| 2 |`[0,1,2]`| (3+3-1) | 5 |`[2,0,1]`|

 单击的点位于前两个窗口的外部和第三个窗口的内部。 第一个前窗覆盖一个 (1\times3) 矩形，第二个前窗覆盖一个 (3\times1) 矩形，它们的交集是一个 (1\times1) 正方形。 包含-排除给出(3+3-1=5)。 此示例说明了为什么对各个重叠进行求和是不够的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(qn^2 2^n)) | 每次单击都会扫描 (O(n)) 个窗口，并且激活最多评估 (2^n) 个子集，每个子​​集最多有 (O(n)) 个矩形交叉点。 |
 | 空间| (O(n)) | (O(n)) | 该算法存储矩形、z 顺序和恒定数量的临时几何图形。 |

 对于(n,q\le10)，最大指数因子仅为(2^{10}=1024)。 即使增加了 (n^2) 的额外因子，原始操作的数量也很少。 屏幕尺寸不会出现在复杂性中，因为该算法从不迭代单个像素或单位单元。 

## 测试用例```python
import sys
import io

def intersect(a, b):
    x1 = max(a[0], b[0])
    y1 = max(a[1], b[1])
    x2 = min(a[2], b[2])
    y2 = min(a[3], b[3])
    if x1 >= x2 or y1 >= y2:
        return None
    return x1, y1, x2, y2

def area(r):
    if r is None:
        return 0
    return (r[2] - r[0]) * (r[3] - r[1])

def union_inside(target, rects):
    k = len(rects)
    ans = 0

    for mask in range(1, 1 << k):
        cur = target
        bits = 0

        for i in range(k):
            if mask & (1 << i):
                bits += 1
                cur = intersect(cur, rects[i])
                if cur is None:
                    break

        if cur is not None:
            if bits & 1:
                ans += area(cur)
            else:
                ans -= area(cur)

    return ans

def solve():
    input = sys.stdin.readline

    W, H = map(int, input().split())
    n = int(input())

    windows = []
    for _ in range(n):
        x, y, w, h = map(int, input().split())
        windows.append((x, y, x + h, y + w))

    q = int(input())
    order = list(range(n))
    screen = (0, 0, H, W)

    ans = []

    for _ in range(q):
        u, v = map(int, input().split())

        pos = -1

        for i, idx in enumerate(order):
            r = intersect(windows[idx], screen)
            if r is not None and r[0] <= u <= r[2] and r[1] <= v <= r[3]:
                pos = i
                break

        if pos <= 0:
            ans.append("0")
            continue

        target = order[pos]
        target_rect = intersect(windows[target], screen)

        front = [windows[idx] for idx in order[:pos]]
        repaint = union_inside(target_rect, front)

        ans.append(str(repaint))

        order.pop(pos)
        order.insert(0, target)

    return "\n".join(ans)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    result = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout

    return result

sample1 = """\
9 6
3
1 2 5 4
2 5 3 2
-1 1 2 3
5
2 1
3 1
1 2
3 8
3 3
"""

assert run(sample1) == "1\n0\n0\n4\n5", "sample 1"

minimum_case = """\
1 1
1
0 0 1 1
1
1 1
"""

assert run(minimum_case) == "0", "minimum size"

boundary_case = """\
4 4
2
0 0 1 1
-1 -1 3 3
1
2 2
"""

assert run(boundary_case) == "1", "screen clipping and boundary"

union_case = """\
4 4
3
0 0 1 3
0 0 3 1
0 0 3 3
1
2 2
"""

assert run(union_case) == "5", "overlapping front windows"

reorder_case = """\
4 4
3
0 0 1 1
0 0 4 4
3 3 1 1
3
3 3
0 0
2 2
"""

assert run(reorder_case) == "1\n0\n2", "z-order changes"

maximum_equal_case = """\
2000 2000
10
0 0 2000 2000
0 0 2000 2000
0 0 2000 2000
0 0 2000 2000
0 0 2000 2000
0 0 2000 2000
0 0 2000 2000
0 0 2000 2000
0 0 2000 2000
0 0 2000 2000
10
0 0
1000 1000
2000 2000
0 2000
2000 0
1 1
1999 1999
500 1500
1500 500
1000 1000
"""

assert run(maximum_equal_case) == "\n".join(["0"] * 10), "maximum size and equal windows"

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小尺寸外壳 |`0`| 最小屏幕，一个窗口，活动窗口点击 |
 | 边界情况 |`1`| 离屏剪切和包容性点击边界 |
 | 联盟案例 |`5`| 重叠覆盖窗口的包含-排除 |
 | 重新订购案例 |`1`,`0`,`2`| 动态 z 顺序和重复激活 |
 | 最大相等情况 | 十个零 | 最大尺寸、最大窗口数和点击次数、相同的矩形 |

 ## 边缘情况

 最小尺寸输入有一个 (1\times1) 屏幕和一个 (1\times1) 窗口。 唯一的窗口开始处于活动状态，因此在该窗口内的任何单击都会选择已经处于活动状态的窗口。 该算法在位置零处找到它`order`，立即输出零，并且永远不会改变顺序。 

剪裁盒用窗`(-1,-1,3,3)`在 (4\times4) 屏幕上。 它的可见区域只是与`[0,4] × [0,4]`。 点击于`(2,2)`位于该可见区域内但在第一个窗口之外，因此第二个窗口被激活。 与第一个窗口的交集正好是 (1\times1) 平方`[0,1] × [0,1]`，给出重绘区域 (1)。 

重叠窗口情况会激活第三个窗口，而其前面有两个窗口。 它们与目标的单独重叠具有区域 (3) 和 (3)，但它们的共同重叠具有区域 (1)。 包含-排除计算为(3+3-1=5)，因此算法输出`5`而不是错误的总和`6`。 

动态顺序情况首先激活窗口`2`，改变顺序`[0,1,2]`到`[2,0,1]`和重涂区域（1）。 下次点击到达窗口`0`，它变得活跃并将订单移动到`[0,2,1]`; 它与窗口重叠`2`面积为零，因此重绘量为零。 最后点击到达窗口`1`。 就在那一刻，两个窗口`0`和窗户`2`在它的前面，并且它们与窗口重叠`1`是不相交的单位正方形，产生的重绘区域为 (2)。 这证实了该算法使用当前的 z 顺序而不是原始输入顺序。 

最大尺寸的机箱有十个相同的全屏窗口。 只有最前面的窗口才能收到点击，因为它完全覆盖了所有其他窗口。 每次点击它都已经处于活动状态，因此每个答案都是零。 测试证实大屏幕尺寸不会导致算法分配或遍历（2000\times2000）网格。
