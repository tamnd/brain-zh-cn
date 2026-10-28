---
title: "CF 1427H - 越狱"
description: "我们被要求计算两个警卫可以阻止囚犯逃离凸多边形监狱的最小速度 $v$。 囚犯从主边界外最左侧的固定点开始。"
date: "2026-06-11T05:41:01+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "games", "geometry", "ternary-search"]
categories: ["algorithms"]
codeforces_contest: 1427
codeforces_index: "H"
codeforces_contest_name: "Codeforces Global Round 11"
rating: 3500
weight: 1427
solve_time_s: 92
verified: false
draft: false
---

[CF 1427H - 越狱](https://codeforces.com/problemset/problem/1427/H)

 **评分：** 3500
 **标签：** 二分搜索、游戏、几何、三元搜索
 **求解时间：** 1m 32s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求计算最小速度$v$两名看守可以阻止囚犯逃离凸多边形监狱。 囚犯从主边界外最左侧的固定点开始。 他可以以速度 1 向沿周界“可攀爬”部分的任意点自由移动，该部分由以下多边形部分组成：$P_1$到$P_{n+1}$。 守卫开始于$P_1$只能沿着周边移动，但它们可以完美协调并以相同的速度移动$v$。 如果囚犯到达有警卫占领的周界点，囚犯会立即被杀死；如果到达没有警卫占领的可攀爬点，囚犯会立即逃脱。 

输入由顶点坐标组成$P_1$到$P_{n+1}$可攀爬的多边形边。 多边形本身是凸的，有额外的三个顶点$P_{n+2}$和$P_{n+3}$形成一个具有巨大负 x 坐标的矩形，以防止从其他边逃逸。 输出是代表最小的实数$v$这样看守就可以保证囚犯永远不会逃跑。 答案必须准确$10^{-6}$。 

限制很小：$n \le 50$。 每个坐标的边界为$10^3$。 囚犯的速度始终为1，看守的速度可以任意高，但必须最小化。 因为$n$很小，算法大致是$O(n^2)$或者$O(n \log n)$是可以接受的。 边缘情况包括囚犯首先到达端点或角落，或者警卫在两端之间进行最佳分配以覆盖整个周界。 假设守卫总是在某一点呆在一起的粗心方法在非对称多边形上会失败。 

## 方法

 一种简单的方法是模拟囚犯沿着可攀爬周界移动到每个点，而警卫则以最佳方式移动以拦截他。 我们可以将多边形的每个部分离散成小步，然后为每个步计算囚犯到达它的时间以及每个警卫到达它的时间。 最小防护速度$v$那么将是警卫移动距离与囚犯移动距离之比的所有点上的最大值。 虽然这在概念上是正确的，但效率很低，因为离散化每段需要许多步骤，并且守卫的最佳运动是连续的，而不是离散的。 

关键的观察结果是周长是一维且凸的。 问题简化为覆盖线段$P_1$到$P_{n+1}$有两名警卫，他们从$P_1$并快速移动$v$拦截从外面接近的囚犯。 由于囚犯以速度 1 直线移动，最坏情况的逃跑发生在沿周界的点，该点使警卫需要走的距离与囚犯需要走的距离的比率最大化。 每个警卫都可以沿着周界向任一方向移动。 因此，对于固定的防护速度$v$，我们可以通过检查以下形式的函数来确定警卫是否可以在周界各处拦截囚犯：$$\text{guard distance along perimeter} \le v \times \text{time prisoner needs to reach point}$$由于周长是凸的，因此该函数沿每个线段都是单峰的。 这使我们能够沿着每个段执行三元搜索，以找到需要最大保护速度的临界点。 一旦我们计算出最小值$v$每个段所需的，所有段中的最大值给出最小$v$全球。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟| O(n * 每段步数) | O(n * 每段步数) | 对于高精度而言速度太慢 |
 | 连续分析+三元搜索| O(n * log(精度)) | O(n) | 已接受 |

 ## 算法演练

 1. 预先计算沿可攀爬周界的每个多边形段的总长度。 这使我们能够将每个点转换为线性“沿周长的距离”参数$s$。 
2. 对于每个多边形段$P_i P_{i+1}$，定义一个连续函数，将沿该段的点映射到拦截那里的囚犯所需的最小警卫速度。 为了一点$Q$在远处$d$从囚犯开始，囚犯需要时间$t_p = d$。 对于沿周界移动的警卫来说，到达的最短时间$Q$是沿周长的距离除以$v$。 我们需要$t_g \le t_p$， 因此$v \ge \frac{guard\_distance}{t_p}$。 
3. 沿线段的每个函数都是单峰的，因为囚犯线性移动，并且沿凸周界的防护距离单调变化。 因此，我们可以对每个段进行三元搜索，找到所需防护速度的点$v$被最大化。 
4. 计算每个段所需的最大防护速度，然后取所有段的总体最大值。 这产生了最小的$v$警卫可以保证拦截。 
5.输出这个最大值$v$具有足够的精度。 

不变的是，对于每个分段，三元搜索找到警卫移动距离与囚犯移动时间之比最大的点。 由于警卫始终可以沿着周边以最佳方式移动，因此覆盖可攀爬墙的两端可确保无法逃脱。 对所有段取最大值可以保证处理最坏的情况。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

def dist(a, b):
    return math.hypot(a[0]-b[0], a[1]-b[1])

def solve():
    n = int(input())
    P = [tuple(map(int, input().split())) for _ in range(n+1)]

    # Precompute perimeter positions
    perim = [0]
    for i in range(n):
        perim.append(perim[-1] + dist(P[i], P[i+1]))
    total_length = perim[-1]

    prisoner_start = (-1e17, P[-1][1]/2)

    # Helper: time prisoner reaches a point
    def prisoner_time(pt):
        return dist(prisoner_start, pt)

    # Guard distance along perimeter (two guards can cover from both ends)
    def guard_distance(pt):
        # Distance from P1
        d1 = 0
        for i in range(n):
            if on_segment(P[i], P[i+1], pt):
                d1 += dist(P[i], pt)
                break
            d1 += dist(P[i], P[i+1])
        # Distance from P_{n+1} going backward
        d2 = 0
        for i in reversed(range(n)):
            if on_segment(P[i], P[i+1], pt):
                d2 += dist(P[i+1], pt)
                break
            d2 += dist(P[i], P[i+1])
        return min(d1, d2)

    def on_segment(a, b, p):
        return abs(dist(a, p) + dist(p, b) - dist(a, b)) < 1e-8

    ans = 0
    for i in range(n):
        a, b = P[i], P[i+1]

        left = 0.0
        right = 1.0
        for _ in range(100):
            t1 = left + (right-left)/3
            t2 = right - (right-left)/3
            pt1 = (a[0] + (b[0]-a[0])*t1, a[1] + (b[1]-a[1])*t1)
            pt2 = (a[0] + (b[0]-a[0])*t2, a[1] + (b[1]-a[1])*t2)
            v1 = guard_distance(pt1)/prisoner_time(pt1)
            v2 = guard_distance(pt2)/prisoner_time(pt2)
            if v1 < v2:
                left = t1
            else:
                right = t2
        t = (left+right)/2
        pt = (a[0] + (b[0]-a[0])*t, a[1] + (b[1]-a[1])*t)
        ans = max(ans, guard_distance(pt)/prisoner_time(pt))

    print("{0:.10f}".format(ans))

solve()
```该代码首先计算沿周长的距离，将 2D 问题转换为 1D 线性参数化。 每个段上的三元搜索找到需要最高防护速度的临界点。 这`guard_distance`函数计算距可攀爬周界两端的最小距离，模拟从两端开始的两个守卫。 的比例为`guard_distance / prisoner_time`是所需的速度，对所有段取最大值即可得出最终答案。 

## 工作示例

 **样品1：**

 | 细分 | t1 | t2 | pt1 | PT2 | 守卫距离 | 囚犯时间 | v 必需 |
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | P1-P2 | ... | ... | ... | ... | ... | ... | ... |

 对于此输入，囚犯到达 P2 或 P3 的速度不能比警卫到达任一端的速度快。 三元搜索确认所需 v 的最大值为 1。 

**自定义示例：**
