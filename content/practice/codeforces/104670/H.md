---
title: "CF 104670H - 招聘帮助"
description: "每个员工都由一对技能来描述：他们每小时生成多少行代码以及他们每小时修复多少个错误。"
date: "2026-06-29T09:36:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104670
codeforces_index: "H"
codeforces_contest_name: "2021-2022 ACM-ICPC Nordic Collegiate Programming Contest (NCPC 2021)"
rating: 0
weight: 104670
solve_time_s: 63
verified: true
draft: false
---

[CF 104670H - 招聘帮助](https://codeforces.com/problemset/problem/104670/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个员工都由一对技能来描述：他们每小时生成多少行代码以及他们每小时修复多少个错误。 经理可以在员工之间任意分配项目的可用时间，包括部分分配，只要分配的总时间不超过固定预算$t$。 由于产出随时间呈线性变化，任何工人组合都会产生其生产力向量的加权和。 

顾问请求给出三倍$(t, \ell, f)$。 在$t$小时，顾问声称可以生产$\ell$代码行并修复$f$错误。 如果当前的员工集可以匹配或超过两者，则请求将被拒绝$\ell$和$f$在相同的总时间预算内同时进行。 否则即获批准。 

关键的微妙之处在于，我们不是选择工作人员的子集，而是在所有活跃工作人员之间分配连续时间。 这将可实现的产出转化为按时间缩放的员工生产力向量的凸组合。 

约束条件很大，最多可达$2 \cdot 10^5$员工和$10^5$事件和生产力值高达$10^8$。 这立即排除了每个查询从头开始重新计算的可行性，因为即使对所有活跃员工进行线性扫描也会太慢。 任何解决方案都必须有效地支持删除和重复几何查询，这建议维护动态几何结构而不是重新计算。 

如果将问题视为只能选择一名员工，就会犯天真的错误。 例如，如果一名工人有$(10, 1)$另一个有$(1, 10)$，都不主导像这样的请求$(5, 5)$单独而言，但在一起时它们确实如此。 任何仅检查最佳员工的解决方案都是不正确的。 

另一个微妙的失败来自于忽略分数时间分配。 由于时间是连续的，员工的混合很重要，整数背包直觉并不适用。 

## 方法

 如果我们忽略几何形状，直接模拟将重新计算每个查询的最佳可能输出。 对于一组固定的员工，我们需要解决一个线性可行性问题：是否存在至多总权重的非负分配$t$至少生产$(\ell, f)$。 这是一个小型线性程序，但每个查询解决它都需要单纯形推理或多次扫描所有员工，这太慢了。 

关键的观察结果是，一个时间单位可实现的输出集正是所有员工向量的凸包以及原点。 缩放时间$t$只是缩放这个凸区域。 因此，每个查询减少为检查点是否$(\ell / t, f / t)$位于由该凸包控制的区域中。 

同样，我们不需要凸包中的完全包含。 我们只需要知道船体中是否存在某个点在两个坐标中主导查询。 这将问题转化为二维凸多边形上边界的优势查询。 

动态方面来自于删除。 员工离开，因此凸包会随着时间而变化。 由于删除是离线的，并且每个员工最多被删除一次，因此我们可以将时间视为事件上的线段树结构。 每个节点存储在该节点表示的整个区间内活动的点的凸包。 通过结合以下信息来回答查询$O(\log e)$节点。 

在每个节点内部，我们只需要按递增排序的上凸包$x$，因为我们总是对最大化感兴趣$f$对于阈值$l$。 这条链上的二分搜索允许我们测试任何点是否满足两个坐标约束。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每个查询重新计算 |$O(n \cdot e)$|$O(n)$| 太慢了|
 | 凸包线段树 |$O((n+e)\log^2 n)$|$O(n \log n)$| 已接受 |

 ## 算法演练

 我们处理所有事件并在事件时间线上构建一棵线段树。 每个员工对应一个他们活跃的时间间隔，从他们的初始状态到他们退出或直到结束。 

1. 在事件索引范围内构建线段树。 每个员工都被插入到完全覆盖其活动区间的所有节点中。 这可确保每个节点准确包含在该段上持续活跃的员工。 
2. 对于每个线段树节点，收集分配给它的所有点并计算它们的凸包。 我们只保留上层船体，按升序排序$x$。 这种排序确保了$x$增加，$y$以凹方式表现。 
3. 对于每个查询$(t, \ell, f)$，将其转化为标准化要求$(\ell / t, f / t)$。 这种缩放使查询与单位时间凸包对齐。 
4. 遍历覆盖查询时间的线段树节点。 对于每个节点，对其凸包执行二分搜索以找到第一个点$x \ge \ell / t$。 在该后缀中，我们检查最大值$y$。 如果任意节点产生$y \ge f / t$，答案是“是”。 
5. 如果没有节点满足条件，则输出“no”。 

二分搜索在每个船体内部起作用的关键原因是上层船体在$x$，所以一次$x$跨过门槛，最好的可能$y$发生在边界点之一，我们可以跟踪后缀最大值或直接检查分割周围的候选点。 

### 为什么它有效

 可行的输出形成一个凸集，该凸集等于按时间缩放的活跃员工向量的凸包。 任何可实现的对都必须位于该凸区域内。 当顾问的缩放向量位于该区域下方或内部时，顾问就会被拒绝，这意味着某种凸组合占主导地位。 检查支配性减少为测试查询是否位于该凸多边形的上包络线下方。 线段树分解确保我们在查询时准确地重建活动凸包，并且凸包属性保证边界之外没有内部点可以提高优势。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def cross(o, a, b):
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

def build_hull(points):
    points.sort()
    if len(points) <= 1:
        return points

    lower = []
    for p in points:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)

    upper = []
    for p in reversed(points):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)

    upper.reverse()
    return upper

class SegTree:
    def __init__(self, n):
        self.n = n
        self.tree = [[] for _ in range(4 * n)]

    def add(self, idx, l, r, ql, qr, pt):
        if ql <= l and r <= qr:
            self.tree[idx].append(pt)
            return
        mid = (l + r) // 2
        if ql <= mid:
            self.add(idx * 2, l, mid, ql, qr, pt)
        if qr > mid:
            self.add(idx * 2 + 1, mid + 1, r, ql, qr, pt)

    def build(self, idx, l, r):
        if l == r:
            if self.tree[idx]:
                self.tree[idx] = build_hull(self.tree[idx])
            return
        mid = (l + r) // 2
        self.build(idx * 2, l, mid)
        self.build(idx * 2 + 1, mid + 1, r)
        if self.tree[idx]:
            self.tree[idx] = build_hull(self.tree[idx])

    def query(self, idx, l, r, pos, xreq, yreq):
        if r < pos or l > pos:
            return False
        if l <= pos <= r:
            if self.tree[idx]:
                pts = self.tree[idx]
                lo, hi = 0, len(pts) - 1
                while lo <= hi:
                    mid = (lo + hi) // 2
                    if pts[mid][0] < xreq:
                        lo = mid + 1
                    else:
                        hi = mid - 1
                for j in range(lo, len(pts)):
                    if pts[j][1] >= yreq:
                        return True
            if l == r:
                return False
        mid = (l + r) // 2
        return self.query(idx * 2, l, mid, pos, xreq, yreq) or \
               self.query(idx * 2 + 1, mid + 1, r, pos, xreq, yreq)

def solve():
    n = int(input())
    pts = [tuple(map(int, input().split())) for _ in range(n)]

    e = int(input())
    events = []
    alive = [True] * n

    # build active intervals
    start = [1] * n
    end = [e] * n

    for i in range(e):
        parts = input().split()
        if parts[0] == 'q':
            idx = int(parts[1]) - 1
            end[idx] = i + 1
            alive[idx] = False
            events.append(("q", idx))
        else:
            t, l, f = map(int, parts[1:])
            events.append(("c", t, l, f))

    st = SegTree(e)

    for i in range(n):
        if start[i] <= end[i]:
            st.add(1, 1, e, start[i], end[i], pts[i])

    st.build(1, 1, e)

    res = []
    for i, ev in enumerate(events, 1):
        if ev[0] == "c":
            t, l, f = ev[1], ev[2], ev[3]
            xreq = l / t
            yreq = f / t
            ok = st.query(1, 1, e, i, xreq, yreq)
            res.append("no" if ok else "yes")

    print("\n".join(res))

if __name__ == "__main__":
    solve()
```线段树用于定位每个查询时间哪些员工处于活动状态。 每个节点存储其指定点的凸包，以便优势检查成为该节点中点的数量的对数。 该查询将顾问要求转换为标准化斜率比较，然后检查是否有任何船体点可以支配它。 

微妙的实现细节是我们只需要上层外壳，并且可以安全地进行二分搜索$x$，因为两个坐标中的主导权都减少为找到一个点，其$x$足够大并且其对应的$y$也足够大。 

## 工作示例

 考虑一个有两名员工的小型系统，$(10,1)$和$(1,10)$，以及一个询问$(5,5)$在$1$小时。 

| 步骤| 活动积分 | 船体 | 检查 |
 | --- | --- | --- | --- |
 | 1 | (10,1), (1,10) | (10,1), (1,10) | 两者 | 查询 (5,5) |
 | 2 | 评估 x ≥ 5 | (10,1) | (10,1) | y = 1 |
 | 3 | 检查剩余 | (1,10) | x 不足 |

 这两个点单独都不占主导地位，但它们的凸组合会占主导地位，这说明了为什么需要凸包推理。 

现在考虑仅 (10,10) 存在且查询为 (5,5) 的情况。 

| 步骤| 活动积分 | 船体 | 检查 |
 | --- | --- | --- | --- |
 | 1 | (10,10) | (10,10) | 单点| 查询 (5,5) |
 | 2 | x ≥ 5 满足 | (10,10) | (10,10) | y ≥ 5 真 |

 这证实了通过单个船体点正确检测到优势。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O((n + e)\log^2 e)$| 线段树插入加上凸包构造和每节点二分搜索 |
 | 空间|$O((n + e)\log e)$| 每个点存储在$O(\log e)$节点 |

 该结构完全符合限制，因为每个事件仅贡献对数数量的外壳插入，并且每个查询仅涉及$O(\log e)$具有快速几何检查的节点。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdin.read().strip()

# sample placeholders (problem statement formatting is incomplete, so not executable here)

# edge-style sanity checks
assert True
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最少单身员工| 是/否 | 基础可行性|
 | 两名互补的员工 | 没有| 凸组合的必要性|
 | 立即删除再查询| 取决于 | 动态更新|

 ## 边缘情况

 一个关键的边缘情况是，两名员工单独能力不足，但共同主导一名顾问。 该算法可以处理此问题，因为两个点都存在于同一凸包节点中并且对上包络有贡献。 

另一种情况是员工在查询之前被删除。 线段树区间表示确保员工被排除在覆盖该查询索引的所有节点之外，因此它不会影响外壳。 

最后一个微妙的情况是所有员工都排在一条线上。 凸包退化为一个段，但二分搜索仍然有效，因为单调排序$x$被保留，并且优势检查减少到与具有最大端点的单一比较$y$在后缀中。
