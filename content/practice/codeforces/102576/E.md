---
title: "CF 102576E - 污染"
description: "世界被表示为一个包含许多圆形禁区的平面。 每次爆炸都会产生一个这样的区域。 查询中的两只动物必须在水平带内移动，从 ymin 到 ymax，且不进入任何禁止圈。"
date: "2026-07-31T07:33:19+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102576
codeforces_index: "E"
codeforces_contest_name: "2020 Petrozavodsk Winter Camp, Jagiellonian U Contest"
rating: 0
weight: 102576
solve_time_s: 75
verified: true
draft: false
---

[CF 102576E - 污染](https://codeforces.com/problemset/problem/102576/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 15s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 世界被表示为一个包含许多圆形禁区的平面。 每次爆炸都会产生一个这样的区域。 查询中的两只动物必须在水平带内移动，从`ymin`到`ymax`，不进入任何禁圈。 任务是确定两个点是否属于该带的同一连接部分。 

关键的几何观察是，只有当圆接触水平带的两个水平边界时，它才能阻止水平带内的运动。 如果圆有垂直跨度`[cy-r, cy+r]`，它是一个完整的查询墙，恰好在以下情况下进行：`cy-r <= ymin`和`cy+r >= ymax`。 

由于所有污染区域都是不相交的，因此这些墙无法合并成复杂的形状。 一堵墙将条带分为左侧和右侧。 当存在这样一堵墙且其中心 x 坐标严格位于它们的 x 坐标之间时，两只动物无法精确相遇。 

这些限制迫使我们采用离线解决方案。 对于多达一百万次爆炸和一百万次查询，检查每个查询的每个圆圈将需要大约`10^12`操作，这是不可能的。 我们需要一个接近的预处理策略`O((n+q) log n)`。 

一个常见的错误是只检查条带中是否存在阻塞环。 这是不够的，因为阻挡圈可能完全位于两只动物的左侧或右侧。 另一个错误是包含中心 x 坐标等于动物坐标之一的圆。 如果圆跨越整个带，则带内的有效动物点不会发生这种情况，因为穿过中心的整条垂直线都被污染了。 

例如，考虑：```
1 2
0 0 1
-5 0 5 0 -1 1
```圆圈挡住了条带并将两点分开，所以答案是`NO`。 

然而：```
1 2
0 0 1
-5 0 -3 0 -1 1
```存在同一个圆，但两个点都在其左侧，所以答案是`YES`。 仅检查是否存在阻塞环的解决方案将会失败。 

## 方法

 直接的方法是测试每个查询的每个爆炸。 对于每个查询，我们将检查爆炸是否覆盖垂直范围以及其中心是否位于两个 x 坐标之间。 这是正确的，因为每个分隔符都必须是这些全高圆圈之一。 然而，随着`10^6`查询和`10^6`圈子，最坏的情况是`10^12`检查。 

重要的减少是停止从几何角度考虑单个查询，而是使用相同的移动边界处理所有查询。 按较低纬度对查询进行排序。 当我们增加`ymin`，更多的圆可能成为下墙，因为它们的底边现在位于扫掠线下方。 对于每个插入的圆，我们将其顶部边缘存储在其 x 坐标处。 

在扫描过程中的任何时刻，该结构都恰好包含满足以下条件的圆：`cy-r <= current_ymin`。 

对于查询`[ymin, ymax]`，在这些插入的圆圈中，我们只需要知道两个动物之间的某个 x 坐标是否至少具有最大顶边`ymax`。 如果存在这样的值，则该圆圈到达上边界并挡住道路。 

这成为压缩 x 坐标上的范围最大查询问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(nq) | O(1) | O(1) | 太慢了|
 | 线段树离线扫描 | O((n+q) log n) | O((n+q) log n) | O(n+q) | 已接受 |

 ## 算法演练

 1. 按底部坐标对所有圆进行排序`cy-r`。 对所有查询进行排序`ymin`。 在扫描期间，插入底部已低于当前查询下边界的圆。 
2. 压缩所有圆心x坐标。 线段树为每个压缩的 x 位置存储最大的`cy+r`以该中心插入的圆圈之间。 
3. 对于每个查询，找到严格位于两个动物位置之间的中心 x 坐标的压缩范围。 如果此范围为空，则没有圆可以将它们分开。 
4. 查询该 x 范围上的线段树。 如果存储的最大顶部坐标至少为`ymax`，动物之间存在全高的污染墙，所以答案是`NO`。 否则，答案是`YES`。 

为什么它有效：

 扫描的不变性是在处理完所有圆之后`cy-r <= ymin`，线段树恰好包含可能接触当前条带底部的圆。 仅当其中一个圆圈也到达时查询才会失败`ymax`它的中心 x 坐标位于两只动物之间。 范围最大查询精确地检查此条件，因此每个返回的答案都与条带的实际连接性相匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegmentTree:
    def __init__(self, n):
        self.n = 1
        while self.n < n:
            self.n *= 2
        self.t = [-(10**30)] * (2 * self.n)

    def update(self, i, v):
        i += self.n
        if self.t[i] >= v:
            return
        self.t[i] = v
        i //= 2
        while i:
            nv = self.t[2 * i]
            if self.t[2 * i + 1] > nv:
                nv = self.t[2 * i + 1]
            if self.t[i] == nv:
                break
            self.t[i] = nv
            i //= 2

    def query(self, l, r):
        if l >= r:
            return -(10**30)
        l += self.n
        r += self.n
        ans = -(10**30)
        while l < r:
            if l & 1:
                if self.t[l] > ans:
                    ans = self.t[l]
                l += 1
            if r & 1:
                r -= 1
                if self.t[r] > ans:
                    ans = self.t[r]
            l //= 2
            r //= 2
        return ans

n, q = map(int, input().split())

circles = []
xs = []

for _ in range(n):
    cx, cy, r = map(int, input().split())
    circles.append((cy - r, cy + r, cx))
    xs.append(cx)

xs.sort()
unique_x = []
for x in xs:
    if not unique_x or unique_x[-1] != x:
        unique_x.append(x)

circles.sort()

queries = []
for i in range(q):
    px, py, qx, qy, ymin, ymax = map(int, input().split())
    queries.append((ymin, ymax, px, qx, i))

queries.sort()

seg = SegmentTree(len(unique_x))
ans = ["YES"] * q
ptr = 0

import bisect

for ymin, ymax, px, qx, idx in queries:
    while ptr < n and circles[ptr][0] <= ymin:
        bottom, top, cx = circles[ptr]
        seg.update(bisect.bisect_left(unique_x, cx), top)
        ptr += 1

    if px > qx:
        px, qx = qx, px

    left = bisect.bisect_right(unique_x, px)
    right = bisect.bisect_left(unique_x, qx)

    if seg.query(left, right) >= ymax:
        ans[idx] = "NO"

print("\n".join(ans))
```扫描指针仅向前移动，因此每个圆仅插入一次。 线段树更新保留每个x坐标的最大上边缘，因为在具有相同中心的多个圆中，只有最高的圆可以阻塞查询。 

使用`bisect_right`和`bisect_left`是故意的。 该查询要求严格位于两种动物之间的中心。 包含端点会引入错误的障碍。 

所有坐标都适合 Python 整数。 该算法从不计算平方距离或执行浮点运算，因此避免了精度问题。 

## 工作示例

 对于样本输入，圆圈是：

 | 中心 x | 底部| 顶部 |
 | ---| ---| ---|
 | 3 | 1 | 5 |
 | 7 | 4 | 10 | 10
 | 12 | 12 3 | 7 |

 对于第一个查询，条带是`[2,6]`。 

| 步骤| 当前ymin | 插入圆圈| x=1 和 x=14 之间的最大顶部 | 结果 |
 | ---| ---| ---| ---| ---|
 | 扫频达到2 | 2 | x=3 | 5 | 继续 |
 | 查询 ymax | 6 | x=3,x=12 已检查 | 5 | 是 |

 x=3 处的圆到达下侧但未到达上侧，因此它无法分割条带。 

对于第二个查询，条带是`[4,7]`。 

| 步骤| 当前ymin | 插入圆圈| x=1 和 x=14 之间的最大顶部 | 结果 |
 | ---| ---| ---| ---| ---|
 | 扫数达到4 | 4 | x=3,x=7,x=12 | 10 | 10 否 |

 以 x=7 为中心的圆圈覆盖了整个地带并位于动物之间，形成了一堵无法逾越的墙。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n+q) log n) | O((n+q) log n) | 每次循环更新和查询都是对数 |
 | 空间| O(n+q) | 存储圆、查询、压缩坐标和答案 |

 该解决方案通过对数运算处理 200 万个对象，这适合给定的限制。 内存使用量是线性的。 

## 测试用例```
# The official solution is designed for direct stdin/stdout execution.
# These examples describe expected behavior.

# Minimum case:
# 1 1
# 0 0 1
# -2 0 2 0 -1 1
# Expected:
# NO

# No separating circle:
# 1 1
# 0 0 1
# -5 0 -3 0 -1 1
# Expected:
# YES

# Circle touches lower boundary only:
# 1 1
# 0 0 2
# -5 2 5 2 2 3
# Expected:
# YES

# Multiple circles, only one is relevant:
# 2 1
# -10 0 1
# 5 5 5
# -20 0 20 0 0 9
# Expected:
# NO
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单全高圆 | 否 | 基本分离器检测|
 | x 范围外的圆 | 是 | 只有动物之间的墙才重要|
 | 接触一个边框的圆圈| 是 | 正确的垂直间隔条件 |
 | 几个圈| 否 | 扫掠结构可处理多个障碍物 |

 ## 边缘情况

 恰好接触两个边界的圆必须算作墙。 条件使用`<=`和`>=`，不是严格的不等式。 对于具有垂直跨度的圆`[0,10]`和一个查询条`[0,10]`，圆圈阻止运动。 

仅接触一个边界的圆不得计数。 具有垂直跨度的圆`[0,5]`无法阻止带状运动`[0,10]`因为动物可以绕过它的顶部。 

通过保留最大顶部值来处理具有相同 x 坐标的多个圆。 对于每个未来的查询，最高的这样的圆圈支配所有较低的圆圈。 

查询的回答与它们出现的顺序无关。 离线扫描使用打印前存储的查询索引恢复原始顺序。
