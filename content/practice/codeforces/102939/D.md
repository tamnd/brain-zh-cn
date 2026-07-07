---
title: "CF 102939D - 机器人投掷"
description: "两个机器人站在网格上的两个固定格点上。 他们来回扔球，球沿着连接他们位置的直线段移动。 第三个点，伊芙，正在尝试拦截球。"
date: "2026-07-04T07:46:36+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102939
codeforces_index: "D"
codeforces_contest_name: "UTPC Contest 01-22-21 Div. 2 (Beginner)"
rating: 0
weight: 102939
solve_time_s: 43
verified: true
draft: false
---

[CF 102939D - 机器人投掷](https://codeforces.com/problemset/problem/102939/D)

 **评级：** -
 **标签：** -
 **求解时间：** 43s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 两个机器人站在网格上的两个固定格点上。 他们来回扔球，球沿着连接他们位置的直线段移动。 第三个点，伊芙，正在尝试拦截球。 当从 Alice 到 Bob 的直线段经过她的位置时，Eve 就成功了。 

对于 Eve 的每个候选位置，我们必须确定该点是否位于两个机器人之间的线段上。 这是一个纯粹的几何隶属度测试：一个点是否恰好位于整数网格中的给定线段上。 

输入由两个固定点和最多 100 个查询点组成。 每个查询都是独立的，询问该点是否位于线段上。 坐标是大约在负一万到一万之间的整数，这个值足够小，每个查询的任何常数时间算术都足够了。 

关键的约束意味着我们可以对每个查询进行直接的几何检查，而无需任何预处理。 即使每个查询的 O(E) 方法也太慢，但这里 E 最多为 100，因此每个查询的 O(1) 测试就足够了。 

一个常见的错误是只检查共线性。 这还不够。 例如，如果 Alice 位于 (0, 0)，Bob 位于 (2, 2)，则点 (3, 3) 与它们共线，但明显位于 Bob 之外，不应算作截取该线段。 另一个微妙的边缘情况是当夏娃与爱丽丝或鲍勃重合时。 在这种情况下，答案仍然应该是肯定的，因为该段穿过该端点。 

## 方法

 蛮力的想法是显式地对线段建模并检查点是否位于其上。 一种简单的方法是参数化该段并测试 [0, 1] 中是否存在参数 t，使得该点等于 Alice 加上 t 乘以从 Alice 到 Bob 的向量。 这简化为求解两个方程并检查一致性。 虽然正确，但如果直接实现，它会引入浮点精度问题，并且考虑到坐标的整数性质，这是不必要的。 

更可靠的观察是，当且仅当两个条件成立时，点位于线段上。 首先，三个点必须共线，这可以使用向量AB和AE的叉积来测试。 其次，该点必须位于 Alice 和 Bob 形成的边界框内，这意味着它的 x 坐标位于两个 x 坐标之间，而它的 y 坐标位于两个 y 坐标之间。 

关键的简化在于共线性确保点位于无限直线上，而边界框约束将其限制在有限线段上。 这些条件一起充分表征了整数几何中线段的成员资格。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 使用浮点求解参数线 | O(E) | O(1) | O(1) | 精度带来风险 |
 | 叉积+边界框检查| O(E) | O(1) | O(1) | 已接受 |

 ## 算法演练

 我们将 Alice 视为 A 点，将 Bob 视为 B 点，将每个查询视为 C 点。 

1. 通过减去坐标来计算从 A 到 B 的向量，形成 (dx, dy)。 这定义了线段的方向。 
2. 对于每个查询点C，计算从A到C的向量，形成(cx,cy)。 
3. 通过评估叉积 dx * cy − dy * cx 检查共线性。 如果该值不为零，则 C 不在通过 A 和 B 的直线上。 
4. 如果共线，则通过验证 min(xa, xb) ≤ xc ≤ max(xa, xb) 来检查 C 是否位于 A 和 B 的轴对齐边界框内，对于 y 也类似。 
5. 如果两个条件都成立，则输出 Yes，否则输出 No。 

叉积测试取代了斜率比较并完全避免了除法，从而消除了精度问题并自然地处理垂直线。 

### 为什么它有效

叉积条件确保向量 AB 和 AC 线性相关，这意味着 C 位于通过 A 和 B 的无限直线上。然后，边界框限制会删除位于同一条线上但位于线段端点之外的所有点。 这两个条件一起对于一个点位于平面上的闭合线段上来说既是必要的又是充分的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

xa, ya = map(int, input().split())
xb, yb = map(int, input().split())
e = int(input())

dx = xb - xa
dy = yb - ya

def on_segment(xc, yc):
    cx = xc - xa
    cy = yc - ya

    if dx * cy != dy * cx:
        return False

    if min(xa, xb) <= xc <= max(xa, xb) and min(ya, yb) <= yc <= max(ya, yb):
        return True

    return False

out = []
for _ in range(e):
    x, y = map(int, input().split())
    out.append("Yes" if on_segment(x, y) else "No")

print("\n".join(out))
```该代码首先确定两个机器人之间的方向向量。 每个查询都是通过计算来自 Alice 的相对向量来独立处理的。 叉积检查是中心决策点，因为它编码共线性而无需除法。 

边界框检查是必要的，因为仅共线性就可以接受在两个方向上无限延伸的点。 最小和最大比较确保我们只接受位于端点之间的点。 

一个微妙的实现细节是所有算术都保留在整数中，因此不存在浮点错误的风险。 另一个重要的细节是平等是包容性的，因此端点会被自动接受。 

## 工作示例

 考虑 Alice 位于 (0, 0)，Bob 位于 (2, 2)，以及两个查询 (1, 1) 和 (-1, -1)。 

对于第一个查询：

 | 步骤| CX, CY | 叉积 dx_cy − dy_cx | 共线 | 在边界框中| 结果 |
 | ---| --- | --- | --- | --- | ---|
 | (1,1) | (1,1) | 2_1 − 2_1 = 0 | 是的 | 是的 | 是的 |

 这证实了该点正好位于线段的中间。 

对于第二个查询：

 | 步骤| CX, CY | 叉积 dx_cy − dy_cx | 共线 | 在边界框中| 结果 |
 | --- | --- | --- | --- | --- | --- |
 | (-1,-1) | (-1,-1) | (-1,-1) | (-1,-1) | 2*(-1) − 2*(-1) = 0 | 是的 | 没有 | 没有 |

 该点位于同一条无限线上，但位于线段端点之外，因此被边界框条件拒绝。 

这两种情况表明了两种检查的必要性：仅使用共线性是不够的，并且在不确保点位于线上的情况下，仅使用边界框是没有意义的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | ---| --- |
 | 时间 | O(E) | 每个查询都通过恒定数量的算术运算进行处理 |
 | 空间| O(1) | O(1) | 只存储了几个整型变量 |

 这些约束允许最多 100 个查询，因此每个查询的恒定时间几何测试很容易足够快。 所有运算都是简单的整数乘法和比较，可以在限制内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdin
    data = sys.stdin.read().strip().split()
    it = iter(data)

    xa, ya = int(next(it)), int(next(it))
    xb, yb = int(next(it)), int(next(it))
    e = int(next(it))

    dx = xb - xa
    dy = yb - ya

    def ok(xc, yc):
        cx = xc - xa
        cy = yc - ya
        if dx * cy != dy * cx:
            return False
        return min(xa, xb) <= xc <= max(xa, xb) and min(ya, yb) <= yc <= max(ya, yb)

    res = []
    for _ in range(e):
        x, y = int(next(it)), int(next(it))
        res.append("Yes" if ok(x, y) else "No")

    return "\n".join(res) + ("\n" if res else "")

# sample case
assert run("""0 0
2 2
2
1 1
-1 -1
""") == "Yes\nNo\n"

# collinear but outside segment
assert run("""0 0
2 2
1
3 3
""") == "No\n"

# endpoint case
assert run("""0 0
5 0
1
0 0
""") == "Yes\n"

# vertical line
assert run("""2 0
2 5
2
2 3
3 3
""") == "Yes\nNo\n"

# horizontal line
assert run("""0 7
4 7
2
2 7
5 7
""") == "Yes\nNo\n")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品| 是/否 | 基本正确性 |
 | (3,3) 外部段 | 没有 | 共线性与分段成员资格|
 | 终点| 是的 | 边界包含|
 | 垂直线| 混合 | dx=0 的无除处理 |
 | 水平线| 混合 | 一般轴对齐正确性 |

 ## 边缘情况

 当 Eve 与 Alice 或 Bob 重合时，叉积自动变为零，因为向量相同或为零。 由于坐标等于一个端点，因此边界框条件也通过。 这确保端点无需特殊处理即可被接受。 

对于垂直或水平线段，dx 或dy 之一为零。 叉积公式仍然有效，因为它可以正确减少而不需要除法。 例如，如果 dx 为零，则条件变为 dy * cx = 0，这会强制 cx 为零，这意味着 x 必须与 Alice 的 x 坐标相匹配。 

对于共线但位于线段之外的点，例如沿同一方向延伸到 Bob 之外，叉积会通过，但边界框会拒绝它们。 这种分离可以防止误报，并确保该段被视为有限对象而不是无限线。
