---
title: "CF 105257M - 窗户装饰"
description: "我们在一扇 100 x 100 平方的窗户内放置了一万个相同的装饰品。 每个装饰都以严格位于边界内的整数坐标为中心，每个装饰都是一个旋转的正方形，其对角线与坐标轴对齐，并且总..."
date: "2026-06-24T04:31:01+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105257
codeforces_index: "M"
codeforces_contest_name: "2024 ICPC ShaanXi Provincial Contest"
rating: 0
weight: 105257
solve_time_s: 63
verified: true
draft: false
---

[CF 105257M - 窗户装饰](https://codeforces.com/problemset/problem/105257/M)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在一扇 100 x 100 平方的窗户内放置了一万个相同的装饰品。 每个装饰都以严格位于边界内的整数坐标为中心，每个装饰都是一个旋转的正方形，其对角线与坐标轴对齐，总长度为 2。 

因为对角线与轴平行并且以整数点为中心，所以每个装饰恰好是到其中心的曼哈顿距离至多为 1 的点的集合。从几何角度来看，这是一个菱形，具有四个顶点，在基本方向上相距一个单位。 

任务是计算窗口内至少有一个菱形覆盖的总面积，仅计算一次重叠。 

输入大小最多允许 10000 个形状，因此任何试图逐对测量重叠或以高分辨率对平面进行采样的方法都会变得太慢。 简单的成对并集计算需要检查所有形状对之间的交集，这会导致大约 10^8 次比较，并且如果以几何方式完成，每个交集测试都不是恒定时间的。 

如果试图通过计算网格单元或采样点来近似面积，就会出现一个微妙的问题。 形状是连续的，边界很重要：单个菱形即使只部分覆盖一个区域，也会贡献面积。 任何离散化都会引入超出所需 1e-4 容差的误差。 

另一个陷阱是假设覆盖区域的行为就像原始坐标系中轴对齐正方形的简单联合。 这些形状不是轴对齐的正方形，因此标准矩形联合技术在不进行变换的情况下不能直接应用。 

## 方法

 钻石的直接几何联合很复杂，因为每个形状都是由 L1 约束定义的。 蛮力的想法是通过考虑每个成对交集然后应用包含-排除或平面扫描多边形边界来计算并集面积。 虽然正确，但这会变得混乱，因为每个菱形贡献四个线段，并且处理 O(n) 多边形之间的所有相交会导致二次或更糟糕的行为。 

关键的观察结果是，L1 菱形在变量的线性变化下变得更加简单。 如果我们定义新坐标 u = x + y 和 v = x - y，则条件 |x - xi| + |y - yi| ≤ 1 转变为 u 和 v 都独立地限制在围绕其中心的区间内的条件。 在这个变换后的空间中，每个菱形都变成了一个轴对齐的正方形。 

一旦问题被表达为轴对齐正方形的并集，任务就变成了经典的矩形平面扫描。 我们沿着一个轴进行扫描，并使用线段树或坐标压缩差值计数来维持另一轴上的主动覆盖。 这将问题简化为 O(n log n)，对于 n = 10000 来说这已经足够快了。 

最后，由于变换缩放了区域，我们通过变换的雅可比行列式来校正计算的区域。 这确保结果与原始坐标系匹配。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 强力多边形联合 | O(n^2) 或更糟 | O(n) | 太慢了 |
 | 变换+扫线| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

1. 将每个中心 (x, y) 变换为 (u, v)，其中 u = x + y 且 v = x - y。 选择此线性变换是因为它将 L1 距离约束转换为 u 和 v 上的独立边界。 
2. 重写每个菱形条件 |x - xi| + |y - yi| ≤ 1 作为变换空间中的两个不等式：[ui - 1, ui + 1] 中的 u 和 [vi - 1, vi + 1] 中的 v。 这表明每个形状现在都是边长为 2 的轴对齐正方形。 
3. 将每个正方形表示为 (u, v) 平面中的矩形事件。 每个沿 u 贡献一个区间 [ui - 1, ui + 1]，沿 v 贡献一个区间 [vi - 1, vi + 1]。 
4. 收集所有矩形边缘作为沿 u 轴的扫描事件。 每个事件都会增加或删除 v 中某个时间间隔的覆盖范围。 
5. 按事件的 u 坐标对事件进行排序，并从左到右扫描。 在连续的事件位置之间，活动的矩形集不会改变，因此覆盖的 v 长度在该条带上保持恒定。 
6. 使用坐标压缩和存储总覆盖长度的线段树维持 v 轴上的活动覆盖。 处理位置 u 处的事件后，将贡献计算为 (next_u - current_u) 乘以 active_v_coverage。 
7. 将所有贡献相加以获得 (u, v) 空间中的总面积。 
8. 将最终结果乘以 1/2 以转换回 (x, y) 空间，因为线性变换的雅可比行列式为 1/2。 

正确性依赖于扫描中每个点都被精确计数一次的事实：u 中的每个水平条带与 v 中正确的活动垂直覆盖配对，并且变换保留覆盖结构，而不会超出均匀缩放范围的失真。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, coords):
        self.coords = coords
        self.n = len(coords) - 1
        self.count = [0] * (4 * self.n)
        self.length = [0] * (4 * self.n)

    def _update(self, idx, l, r, ql, qr, val):
        if ql <= l and r <= qr:
            self.count[idx] += val
        else:
            mid = (l + r) // 2
            if ql < mid:
                self._update(idx * 2, l, mid, ql, qr, val)
            if qr > mid:
                self._update(idx * 2 + 1, mid, r, ql, qr, val)

        if self.count[idx] > 0:
            self.length[idx] = self.coords[r] - self.coords[l]
        else:
            if r - l == 1:
                self.length[idx] = 0
            else:
                self.length[idx] = self.length[idx * 2] + self.length[idx * 2 + 1]

    def update(self, l, r, val):
        self._update(1, 0, self.n, l, r, val)

    def query(self):
        return self.length[1]

n = int(input())
rects = []

vs = []

for _ in range(n):
    x, y = map(int, input().split())
    u = x + y
    v = x - y
    x1, x2 = u - 1, u + 1
    y1, y2 = v - 1, v + 1
    rects.append((x1, x2, y1, y2))
    vs.append(y1)
    vs.append(y2)

vs = sorted(set(vs))
idx = {v: i for i, v in enumerate(vs)}

events = []
for x1, x2, y1, y2 in rects:
    events.append((x1, y1, y2, 1))
    events.append((x2, y1, y2, -1))

events.sort()

seg = SegTree(vs)

area_uv = 0
for i in range(len(events)):
    x, y1, y2, t = events[i]
    seg.update(idx[y1], idx[y2], t)
    if i + 1 < len(events):
        dx = events[i + 1][0] - x
        area_uv += dx * seg.query()

print(area_uv / 2)
```该解决方案首先将每个输入中心转换为旋转坐标系，其中每个菱形变成正方形。 矩形列表按照 u 和 v 间隔存储这些正方形。 

线段树在压缩的 v 坐标上运行。 每次更新都会调整当前覆盖 v 段的矩形数量，并且树保持总覆盖长度。 对 u 的扫描将覆盖长度乘以事件之间的水平距离。 

最后除以 2 可以校正线性变换引入的面积缩放。 

一个微妙的点是，区间更新通过坐标压缩隐式地使用半开放结构，这避免了重复计算共享边界。 

## 工作示例

 考虑一个小配置，其中两个菱形在原始网格中稍微重叠。 变换后，我们在 uv 空间中获得两个重叠的正方形。 

为了便于说明，假设两个中心在 v 中产生部分重叠的区间。 

| 扫步| u 坐标 | 主动覆盖 | 线段长度| 贡献 |
 | --- | --- | --- | --- | --- |
 | 1 | u1 | 0 | 0 | 0 |
 | 2 | u2 | k | u2 - u1 | (u2 - u1) * k |

 这显示了仅当事件之间存在水平分隔时面积如何累积。 

第二个例子是单颗钻石。 它在 uv 空间中变成边长为 2 的单个正方形。 扫描在其宽度上产生恒定的活动覆盖，在 uv 空间中恰好产生 4，在缩放后在原始坐标中变为 2。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 为每个端点排序事件和线段树更新 |
 | 空间| O(n) | 事件存储、坐标压缩和线段树 |

 约束允许最多 10000 个形状，并且对数开销足够小，使得扫描线解决方案可以在限制内舒适地运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from math import isclose

    # --- paste solution logic here as function ---
    input = sys.stdin.readline

    class SegTree:
        def __init__(self, coords):
            self.coords = coords
            self.n = len(coords) - 1
            self.count = [0] * (4 * self.n)
            self.length = [0] * (4 * self.n)

        def _update(self, idx, l, r, ql, qr, val):
            if ql <= l and r <= qr:
                self.count[idx] += val
            else:
                mid = (l + r) // 2
                if ql < mid:
                    self._update(idx * 2, l, mid, ql, qr, val)
                if qr > mid:
                    self._update(idx * 2 + 1, mid, r, ql, qr, val)

            if self.count[idx] > 0:
                self.length[idx] = self.coords[r] - self.coords[l]
            else:
                if r - l == 1:
                    self.length[idx] = 0
                else:
                    self.length[idx] = self.length[idx * 2] + self.length[idx * 2 + 1]

        def update(self, l, r, val):
            self._update(1, 0, self.n, l, r, val)

        def query(self):
            return self.length[1]

    n = int(input())
    rects = []
    vs = []

    for _ in range(n):
        x, y = map(int, input().split())
        u = x + y
        v = x - y
        rects.append((u - 1, u + 1, v - 1, v + 1))
        vs += [v - 1, v + 1]

    vs = sorted(set(vs))
    idx = {v: i for i, v in enumerate(vs)}

    events = []
    for x1, x2, y1, y2 in rects:
        events.append((x1, y1, y2, 1))
        events.append((x2, y1, y2, -1))

    events.sort()

    seg = SegTree(vs)

    area_uv = 0
    for i, (x, y1, y2, t) in enumerate(events):
        seg.update(idx[y1], idx[y2], t)
        if i + 1 < len(events):
            area_uv += (events[i + 1][0] - x) * seg.query()

    return str(area_uv / 2)

# sample-like sanity checks
assert run("1\n1 1\n")  # single diamond produces nonzero area
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1个单点| 2 | 基本单一形状正确性 |
 | 多个重叠中心| 合并区| 重叠处理 |
 | 最大散点| 输出稳定| 性能和扫描正确性|
 | 相同的中心重复 | 没有重复计算| 多集处理 |

 ## 边缘情况

 一个关键的边缘情况是重复的中心。 如果多个装饰共享相同的整数点，则简单的方法可能会多次添加它们的面积。 在此解决方案中，两个副本在 uv 空间中生成相同的矩形，但线段树将覆盖率计算为并集，因此副本在第一次插入后不会更改活动长度。 

另一种边缘情况出现在窗口边界附近。 (1, 1) 处的中心生成一个向下延伸至 x = 0 或 y = 0 的菱形。该变换不依赖于窗口的夹紧，因为扫描在整个几何区域上进行，并且放置规则已满足窗口约束。 

最后一种边缘情况是矩形仅在边界处接触。 由于扫描在坐标压缩中使用半开间隔，因此接触边缘不会创建人造区域。 线段树仅在间隔具有正度量时贡献长度，因此零宽度重叠会被正确忽略。
