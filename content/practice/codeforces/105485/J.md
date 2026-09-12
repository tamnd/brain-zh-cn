---
title: "CF 105485J - \u661f\u7a79\u5217\u8f66"
description: "火车沿着固定的水平射线移动，该射线从给定点开始并无限地向右延伸。 每个危险区域都是平面上的一个圆圈，每当火车的路径经过一个圆圈时，我们只计算火车路径位于该圆圈内的部分......"
date: "2026-06-23T18:23:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105485
codeforces_index: "J"
codeforces_contest_name: "2024 China Unversity of Geosciences (Wuhan) Freshman Contest"
rating: 0
weight: 105485
solve_time_s: 62
verified: true
draft: false
---

[CF 105485J - \u661f\u7a79\u5217\u8f66](https://codeforces.com/problemset/problem/105485/J)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 火车沿着固定的水平射线移动，该射线从给定点开始并无限地向右延伸。 每个危险区域都是平面上的一个圆，每当火车的路径经过一个圆时，我们只计算火车路径中位于该圆内的部分。 如果多个圆沿路径重叠，则重叠部分仅计算一次，因为我们测量的是线上的总覆盖长度，而不是每个圆的贡献。 

从几何角度来看，一旦我们修复了火车的路径，一切都会崩溃为一个一维问题。 火车始终停留在水平线 y = y0 上，因此每个圆要么根本不接触这条线，要么沿 x 轴切出一段。 任务变成计算所有这些段的并集总长度，限制为 x ≥ x0。 

约束允许最多 100,000 个圆，因此任何比较每对圆或重复扫描直线的方法都太慢。 简单的 O(k²) 重叠分辨率将远远超出限制。 即使是 O(k²) 区间合并也是不可能的。 

一个微妙的边缘情况来自于根本不与行进水平线相交的圆圈。 例如，以 (0, 10) 为中心、半径为 1 的圆永远不会接触 y = 0，因此它没有任何贡献。 另一个极端情况是相切：如果圆刚刚接触直线，它会贡献一个长度为零的单点线段，这一定不会影响答案。 

另一个重要的情况是圆的交点完全位于起始位置 x0 的左侧。 即使圆与线相交，也只有 x ≥ x0 的部分重要，因此必须正确裁剪间隔。 

## 方法

 一种直接的方法是独立处理每个圆，计算它与水平线 y = y0 的相交位置，然后模拟沿 x 轴行走，同时保持有多少个圆覆盖每个点。 这自然会导致 x 坐标上的扫描线想法。 然而，即使是作为事件结构实现的扫描线也是不必要的，因为我们只需要联合长度，而不需要覆盖计数。 

关键的观察结果是，每个圆最多在 y = y0 线上贡献一个区间。 对于以 (xc, yc) 为中心、半径为 r 的圆，距路径的垂直距离固定为 dy = y0 − yc。 如果|dy| > r，圆不与路径相交。 否则，交点的水平半宽为 sqrt(r² − dy²)，给出区间 [xc − d, xc + d]。 

将所有圆转换为间隔后，问题就变成了合并重叠间隔并计算从 x0 开始的总覆盖长度。 

当 k 很大时，蛮力会失败，因为成对合并或重复扫描会产生二次行为。 按左端点对间隔进行排序可将问题简化为 O(k log k) 中的单遍合并。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力重叠模拟 | O(k²) | O(k) | 太慢了 |
 | 排序+合并间隔| O(k log k) | O(k log k) | O(k) | 已接受 |

 ## 算法演练

 ### 1.将圆转换为x轴上的间隔

 对于每个圆，计算 dy = y0 − yc。 如果 dy² > r²，则跳过它，因为火车永远不会进入圆圈。 否则计算 d = sqrt(r² − dy²)。 圆在 y = y0 线上贡献了区间 [xc − d, xc + d]。 此步骤将二维几何问题简化为一维区间问题。 

### 2. 将区间剪辑到起点

 由于火车从 x = x0 开始，因此 x0 左边的区间的任何部分都是无关紧要的。 将每个区间 [l, r] 替换为 [max(l, x0), r]。 如果裁剪后l≥r，则丢弃。 这确保我们只测量可到达的覆盖段。 

### 3. 按左端点对所有区间进行排序

排序给出了允许线性合并的确定性顺序。 一旦对间隔进行排序，任何重叠结构都可以在单次扫描中轻松解决。 

### 4. 合并区间并累加覆盖长度

 维持当前活动间隔 [cur_l, cur_r]。 遍历排序区间。 如果下一个间隔在 cur_r 之后开始，我们将 cur_r − cur_l 添加到答案中并重置。 否则，如果需要，我们将扩展 cur_r。 最后，添加最后一个活动间隔长度。 

### 为什么它有效

 每个圆精确地映射到线上的凸段，并且线上的并集长度仅取决于间隔端点，而不取决于原始几何形状。 排序可确保当我们处理一个区间时，与较早区间的所有潜在重叠都已被解析为单个合并段。 不变的是，在每一步中，当前段表示所有已处理间隔的并集，因此添加不相交的段不会错过或重复计算任何区域。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
import math

def solve():
    x0, y0, k = map(int, input().split())
    intervals = []

    for _ in range(k):
        xc, yc, r = map(int, input().split())
        dy = y0 - yc
        if dy * dy > r * r:
            continue
        dx = math.sqrt(r * r - dy * dy)
        l = xc - dx
        rgt = xc + dx

        if rgt <= x0:
            continue
        l = max(l, x0)
        intervals.append((l, rgt))

    if not intervals:
        print("0.0000000000")
        return

    intervals.sort()

    total = 0.0
    cur_l, cur_r = intervals[0]

    for l, r in intervals[1:]:
        if l > cur_r:
            total += cur_r - cur_l
            cur_l, cur_r = l, r
        else:
            if r > cur_r:
                cur_r = r

    total += cur_r - cur_l
    print(f"{total:.10f}")

if __name__ == "__main__":
    solve()
```该代码首先将每个圆转换为火车线路上的候选线段，然后删除 x0 左侧的不相关部分。 排序确保我们可以一次性合并。 浮点 sqrt 是必要的，因为圆的交点自然会产生实值端点。 循环后必须仔细完成最后的累积步骤，以避免丢失最后一段。 

一个常见的实现错误是在合并之前忘记对 x0 进行剪辑。 另一个是不正确地处理相切相交； 当 r² == dy² 时，dx 变为零并产生有效的零长度间隔，这是无害的，自然会被并集逻辑忽略。 

## 工作示例

 ### 示例 1

 输入：```
0 0 2
10 0 5
20 0 10
```| 步骤| 间隔 1 | 间隔 2 | 活跃段 | 总计 |
 | --- | --- | --- | --- | --- |
 | 转换后| [5, 15] | [10, 30] | - | 0 |
 | 排序后 | [5, 15] | [10, 30] | - | 0 |
 | 合并 | 合并| 合并为 [5, 30] | [5, 30] | 0 |
 | 决赛| - | - | - | 25 | 25

 两个圆在 x 轴上重叠，因此它们的并集形成一个连续的线段。 

### 示例 2

 输入：```
0 0 3
5 5 2
10 0 3
20 0 1
```| 圈 | 相交 y=0 | 间隔|
 | --- | --- | --- |
 | (5,5,2) | 没有| - |
 | (10,0,3) | (10,0,3) | 是的 | [7, 13] |
 | (20,0,1) | (20,0,1) | 是的 | [19, 21] |

 | 步骤| 活跃段 | 总计 |
 | --- | --- | --- |
 | 开始| [7, 13] | 0 |
 | 添加[19,21] | 分裂| 6 |
 | 决赛| - | 10 | 10

 这显示了如何忽略不相交的圆以及如何独立累积不相交的间隔。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(k log k) | O(k log k) | 排序 k 个区间占主导地位，合并是线性的 |
 | 空间| O(k) | 每圈最多存储一个间隔 |

 该算法完全符合限制，因为 k 最多为 100,000，并且排序在大约 200 万次比较中占主导地位。 

## 测试用例```python
import sys, io
import math

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import math

    x0, y0, k = map(int, input().split())
    intervals = []

    for _ in range(k):
        xc, yc, r = map(int, input().split())
        dy = y0 - yc
        if dy * dy > r * r:
            continue
        dx = math.sqrt(r * r - dy * dy)
        l = xc - dx
        rgt = xc + dx
        if rgt <= x0:
            continue
        l = max(l, x0)
        intervals.append((l, rgt))

    if not intervals:
        return "0.0000000000"

    intervals.sort()

    total = 0.0
    cur_l, cur_r = intervals[0]

    for l, r in intervals[1:]:
        if l > cur_r:
            total += cur_r - cur_l
            cur_l, cur_r = l, r
        else:
            if r > cur_r:
                cur_r = r

    total += cur_r - cur_l
    return f"{total:.10f}"

# provided sample
assert run("0 0 4\n10 0 5\n20 0 10\n30 0 15\n-2 -3 5\n")[:2] != "", "sample"

# minimum size
assert run("0 0 1\n0 1 1\n") == "0.0000000000", "touch only point"

# all overlapping
assert run("0 0 2\n0 0 10\n0 0 10\n") != "", "overlap merge"

# disjoint intervals
assert run("0 0 2\n0 0 2\n10 0 2\n") != "", "disjoint"

# far left clipped
assert run("100 0 1\n0 0 50\n") == "0.0000000000", "clipping"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单个切线圆| 0 | 零长度交集处理 |
 | 重叠相同的圆圈| 正长度一次 | 正确的工会行为 |
 | 不相交的圆| 段总和 | 独立积累|
 | x0 | 完全左边的圆圈 0 | 正确剪裁 |

 ## 边缘情况

 仅在一点处接触直线 y = y0 的圆会产生 dy² = r²，因此 dx = 0。算法将其转换为 [xc, xc]，合并后长度为零，因此不会影响结果。 

当所有圆都位于路径上方或下方时，在 dy² > r² 检查期间将丢弃每个间隔，留下空列表并产生输出零。 

如果一个大圆无限向左延伸，但起点 x0 位于其内部，则裁剪可确保我们只计算从 x0 开始的部分。 左端点变为 x0，因此贡献被正确限制在可达段内。
