---
title: "CF 2120A - 矩形的正方形"
description: "我们得到了三个轴对齐的矩形。 它们的尺寸已排序，因此 $$l3 le l2 le l1$$ 和 $$b3 le b2 le b1.$$ 矩形无法旋转。"
date: "2026-06-08T03:52:24+07:00"
tags: ["codeforces", "competitive-programming", "geometry", "math"]
categories: ["algorithms"]
codeforces_contest: 2120
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 1033 (Div. 2) and CodeNite 2025"
rating: 800
weight: 2120
solve_time_s: 116
verified: true
draft: false
---

[CF 2120A - 矩形的正方形](https://codeforces.com/problemset/problem/2120/A)

 **评分：** 800
 **标签：** 几何，数学
 **求解时间：** 1m 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了三个轴对齐的矩形。 它们的尺寸已经排序，因此$$l_3 \le l_2 \le l_1$$和$$b_3 \le b_2 \le b_1.$$矩形不能旋转。 我们必须确定所有三个矩形是否可以不重叠地放置在一起，以便它们恰好形成一个正方形。 

维度很小，最多 100 个。测试用例的数量最多 100 个。这意味着我们不需要复杂的优化。 即使检查每个测试用例的少量几何配置也是有效的恒定时间。 

主要的困难不是性能，而是确定三个不可旋转的矩形组合成正方形的所有可能方式。 

一个常见的错误是只检查总面积是否是一个完美的正方形。 面积相等是必要的，但这还远远不够。 

考虑：```
1
3 3 3 3 2 1
```总面积为$$9+9+2=20,$$这不是正方形，所以答案显然是否定的。 

存在更微妙的例子，其中面积是正方形但排列是不可能的。 

例如：```
1
8 5 3 5 3 3
```总面积为$$40+15+9=64=8^2.$$粗心的解决方案可能会立即回答“是”。 正确答案是否定的，因为边长不允许矩形平铺$8 \times 8$正方形。 

当所有三个矩形必须沿一个方向堆叠时，会发生另一种容易错过的情况。```
1
5 3 5 1 5 1
```所有宽度都相等。 将它们一个放在另一个之上会产生$5 \times 5$正方形，所以答案是 YES。 任何仅搜索更复杂布局的解决方案都会错误地拒绝这种情况。 

## 方法

 蛮力思维是一个很好的起点。 由于只有三个矩形，因此可以尝试枚举网格上所有可能的相对位置并检查并集是否形成正方形。 

这样的搜索是正确的，因为每一个有效的安排最终都会受到测试。 问题在于几何放置引入了许多坐标和重叠检查。 尽管实际的限制很小，但这种方法却不必要地复杂。 

关键的观察是只有三个矩形并且禁止旋转。 任何一个正方形与三个矩形的平铺都必须具有非常受限制的结构。 

设正方形边长为$S$。 首先，总面积必须等于$S^2$。 如果该区域不是完美的正方形，答案立即是否定的。 

现在考虑正方形的外边界。 由于只使用了三个矩形，因此一个矩形必须接触正方形的整条边。 这仅创建了两种可能的顶级布局。 

第一种可能性是所有三个矩形都跨越正方形的整个宽度并垂直堆叠，或者对称地全部跨越整个高度并水平堆叠。 

第二种可能性是一个矩形沿着正方形的一侧占据一整条带。 剩下的两个矩形必须恰好填充剩余的矩形。 由于只剩下两个矩形，因此它们只能通过堆叠或并排放置来填充该空间。 

因为尺寸已经排序并且只有三个矩形，所以检查这几个配置就足够了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力安置搜索| 大几何枚举| O(1) | O(1) | 不必要的复杂 |
 | 最优几何案例分析| O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 计算总面积：$$A=l_1b_1+l_2b_2+l_3b_3.$$1.让$$S=\sqrt{A}.$$如果$S^2 \ne A$，形成一个正方形是不可能的，所以回答“否”。 

1. 检查三个矩形是否可以垂直堆叠。 

这需要$$l_1=l_2=l_3=S$$和$$b_1+b_2+b_3=S.$$如果属实，请回答“是”。 

1. 检查三个矩形是否可以水平堆叠。 

这需要$$b_1=b_2=b_3=S$$和$$l_1+l_2+l_3=S.$$如果属实，请回答“是”。 

1. 尝试将每个矩形作为占据正方形全宽条带的矩形。 

假设矩形$i$有尺寸$(l,b)$。 

必须满足$$l=S.$$放置后剩余高度为$$H=S-b.$$另外两个矩形必须正好填满$S \times H$长方形。 

由于只剩下两个矩形，它们必须：$$h_1=h_2=H,\qquad w_1+w_2=S$$或者$$w_1=w_2=S,\qquad h_1+h_2=H.$$如果任一条件成立，请回答“是”。 

1. 对称地，尝试将每个矩形作为全高条带。 

这需要$$b=S.$$剩余宽度为$$W=S-l.$$另外两个矩形必须正好填满$W \times S$使用相同的两个矩形检查的矩形。 

1. 如果以上配置均不起作用，请回答“否”。 

### 为什么它有效

 任何由三个轴对齐的矩形平铺一个正方形都会导致该正方形的分割。 一个矩形必须接触正方形的整条边，否则每一边都会被分割成多个矩形，并且至少需要四个矩形。 

删除该矩形会留下一个矩形区域。 由于只剩下两个矩形，因此剩下的矩形只能通过一次水平或垂直的直线切割来分割。 

该算法准确地检查这些可能性。 每个有效的正方形平铺都属于其中一个，并且每个接受的配置都清楚地形成一个没有重叠的正方形。 因此该算法既完整又正确。 

## Python 解决方案```python
import sys
from math import isqrt

input = sys.stdin.readline

def can_form_square(rects):
    area = sum(l * b for l, b in rects)
    s = isqrt(area)

    if s * s != area:
        return False

    # all stacked vertically
    if all(l == s for l, b in rects) and sum(b for l, b in rects) == s:
        return True

    # all stacked horizontally
    if all(b == s for l, b in rects) and sum(l for l, b in rects) == s:
        return True

    for i in range(3):
        l, b = rects[i]
        others = [rects[j] for j in range(3) if j != i]

        # full-width strip
        if l == s:
            h = s - b
            (l1, b1), (l2, b2) = others

            if b1 == h and b2 == h and l1 + l2 == s:
                return True

            if l1 == s and l2 == s and b1 + b2 == h:
                return True

        # full-height strip
        if b == s:
            w = s - l
            (l1, b1), (l2, b2) = others

            if l1 == w and l2 == w and b1 + b2 == s:
                return True

            if b1 == s and b2 == s and l1 + l2 == w:
                return True

    return False

def solve():
    t = int(input())

    ans = []

    for _ in range(t):
        l1, b1, l2, b2, l3, b3 = map(int, input().split())

        rects = [(l1, b1), (l2, b2), (l3, b3)]

        ans.append("YES" if can_form_square(rects) else "NO")

    sys.stdout.write("\n".join(ans))

solve()
```第一部分计算总面积并验证它是否是一个完美的正方形。 如果没有此检查，不可能的实例稍后可能会被接受。 

接下来的两个检查处理最简单的布局，其中每个矩形跨越最终正方形的整个宽度或整个高度。 

然后，循环将每个矩形视为潜在的外部条带。 一旦固定该条带，就只剩下两个矩形。 两个矩形只能以两种方式分割一个矩形：水平分割或垂直分割。 直接检查相应的维度相等性。 

该实现从不依赖于浮点平方根。 使用`isqrt`完全避免了精度问题。 

## 工作示例

 ### 示例 1

 输入：```
5 3 5 1 5 1
```总面积：$$15+5+5=25.$$方边：$$S=5.$$| 步骤| 状况 | 结果 |
 | --- | --- | --- |
 | 面积完美平方 |$25=5^2$| 是的 |
 | 垂直堆叠| 宽度 = 5，高度总和 = 3+1+1=5 | 是的 |
 | 回答 | | 是 |

 这演示了纯堆叠配置。 每个矩形都跨越正方形的整个宽度。 

### 示例 2

 输入：```
8 5 3 5 3 3
```| 步骤| 价值|
 | --- | --- |
 | 面积 | 64 | 64
 | 方边| 8 |

 检查布局：

 | 检查 | 结果 |
 | --- | --- |
 | 垂直堆叠| 失败|
 | 水平堆叠 | 失败|
 | 矩形 1 作为条带 | 其余尺寸不兼容 |
 | 矩形 2 作为条带 | 不可能|
 | 矩形 3 作为条带 | 不可能|

 最终答案：```
NO
```这个例子表明仅面积是不够的。 虽然$64=8^2$，边长不允许有效的平铺。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(1) | O(1) | 仅执行固定数量的几何检查 |
 | 空间| O(1) | O(1) | 仅使用几个变量 |

 每个测试用例都需要评估恒定数量的公式。 最多有 100 个测试用例，与限制相比，运行时间可以忽略不计。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from math import isqrt

def run(inp: str) -> str:
    def can_form_square(rects):
        area = sum(l * b for l, b in rects)
        s = isqrt(area)

        if s * s != area:
            return False

        if all(l == s for l, b in rects) and sum(b for l, b in rects) == s:
            return True

        if all(b == s for l, b in rects) and sum(l for l, b in rects) == s:
            return True

        for i in range(3):
            l, b = rects[i]
            others = [rects[j] for j in range(3) if j != i]

            if l == s:
                h = s - b
                (l1, b1), (l2, b2) = others

                if b1 == h and b2 == h and l1 + l2 == s:
                    return True

                if l1 == s and l2 == s and b1 + b2 == h:
                    return True

            if b == s:
                w = s - l
                (l1, b1), (l2, b2) = others

                if l1 == w and l2 == w and b1 + b2 == s:
                    return True

                if b1 == s and b2 == s and l1 + l2 == w:
                    return True

        return False

    data = inp.strip().splitlines()
    t = int(data[0])
    out = []

    for i in range(1, t + 1):
        vals = list(map(int, data[i].split()))
        rects = [(vals[0], vals[1]), (vals[2], vals[3]), (vals[4], vals[5])]
        out.append("YES" if can_form_square(rects) else "NO")

    return "\n".join(out)

# provided sample
assert run(
"""5
100 100 10 10 1 1
5 3 5 1 5 1
2 3 1 2 1 1
8 5 3 5 3 3
3 3 3 3 2 1
"""
) == """NO
YES
YES
NO
NO"""

# minimum dimensions
assert run(
"""1
1 1 1 1 1 1
"""
) == "NO"

# all equal rectangles forming a square
assert run(
"""1
2 2 2 2 2 2
"""
) == "NO"

# vertical stacking
assert run(
"""1
4 2 4 1 4 1
"""
) == "YES"

# perfect-square area but impossible layout
assert run(
"""1
8 5 3 5 3 3
"""
) == "NO"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1×1、1×1、1×1 | 否 | 最小尺寸 |
 | 2×2、2×2、2×2 | 否 | 完全相等的矩形不会自动起作用 |
 | 4×2、4×1、4×1 | 是 | 纯垂直堆叠|
 | 8×5、3×5、3×3 | 否 | 完美的正方形面积但不可能的几何形状 |

 ## 边缘情况

 考虑：```
1
5 3 5 1 5 1
```面积为$25$， 所以$S=5$。 所有矩形的宽度均为 5，高度总和为 5。算法在垂直堆栈检查期间接受并返回 YES。 仅搜索 L 形布局的解决方案会错误地拒绝它。 

考虑：```
1
8 5 3 5 3 3
```面积为$64$, 给予$S=8$。 算法检查的每个几何配置都会失败。 答案是否定的，即使该区域是一个完美的正方形。 这可以防止使用面积作为唯一标准的常见错误。 

考虑：```
1
2 3 1 2 1 1
```面积为$$6+2+1=9,$$所以$S=3$。 这$2 \times 3$矩形占据了整个高度的条带。 剩余宽度为 1。其他矩形是$1 \times 2$和$1 \times 1$，垂直堆叠以填充$1 \times 3$地区。 该算法在全高条带情况下检测到这一点并返回 YES。 

考虑：```
1
100 100 10 10 1 1
```面积为$$10101,$$这不是一个完美的正方形。 该算法在执行任何几何检查之前立即拒绝。 这可以安全有效地处理最大尺寸。
