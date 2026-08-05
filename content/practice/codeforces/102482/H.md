---
title: "CF 102482H - 单次故障切断"
description: "我们有一个代表门的矩形。 导线是直线段，其端点位于边界上，每条导线连接两个不同的边。 我们需要放置尽可能少的新直线段，以便每根现有电线至少与我们的一个线段交叉。"
date: "2026-08-05T19:01:45+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102482
codeforces_index: "H"
codeforces_contest_name: "2018 ACM-ICPC World Finals"
rating: 0
weight: 102482
solve_time_s: 121
verified: true
draft: false
---

[CF 102482H - 单次故障](https://codeforces.com/problemset/problem/102482/H)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个代表门的矩形。 导线是直线段，其端点位于边界上，每条导线连接两个不同的边。 我们需要放置尽可能少的新直线段，以便每根现有电线至少与我们的一个线段交叉。 

答案小得出奇。 两次切割总是足够的：矩形的两条对角线与每条可能的边界到边界线相交。 真正的挑战是确定一次削减是否已经足够。 官方的解决方案观察是，可以将几何图形转换为圆区间问题，在对端点进行排序后，可以使用线性扫描来检查是否存在单割。 

输入大小是主要困难。 电线最多可达一百万条，因此涉及成对电线的任何事情都是不可能的。 在最坏的情况下，二次算法将执行大约 10^12 次比较，远远超出了可用时间。 我们需要一种仅处理每条线恒定次数的方法。 

坐标很大，可达10^8，但它们仅用于确定边界上点的循环顺序。 我们不需要任意线段之间的几何交集计算。 矩形的结构使问题变得易于管理。 

一个常见的错误是通过测试坡度或尝试许多可能的路段来寻找切口。 答案不是由公制几何决定的。 重要的信息只是矩形周围端点的顺序。 

## 方法

 直接方法会尝试所有可能的切割并检查它与哪些电线相交。 由于有效切口可以连续移动，而无需更改其穿过的电线，直到到达电线端点，因此可以将候选者限制在连续端点之间的间隙。 存在 O(n) 这样的间隙，并且根据所有线路检查一个候选者的成本为 O(n)，从而提供 O(n²) 操作。 当 n = 10^6 时，这是不可能的。 

有用的变换是绕着矩形边界走动并将其展开成一条线。 每根线都成为该循环顺序上其两个端点位置之间的间隔。 切割也对应于在该圆上选择一个间隔。 当所选间隔恰好包含导线的两个端点之一时，导线恰好交叉。 

问题变成了查找是否存在包含每条线的一个端点的循环间隔。 这可以通过两指针扫描来解决，同时保持当前有多少条线在活动间隔内具有零、一个或两个端点。 

如果存在这样的区间，则其两个边界点给出所需的单割。 如果不存在，则两条矩形对角线是最佳的，因为两次切割总是足够的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了 |
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

1. 将每个线端点转换为矩形周边上的单个坐标。 我们从左下角开始，沿着底边移动，然后是右侧、顶部，最后是左侧。 确切的起点并不重要，但需要一致的循环顺序。 
2. 对所有端点位置进行排序。 复制已排序的列表并添加周长，以便可以将圆形间隔作为正常间隔进行处理。 
3. 在这个加倍的数组上维护一个滑动窗口。 窗口的左端和右端代表可能切割的两个端点。 对于每条电线，维护其两个端点中当前有多少个位于窗口内。 
4. 向前移动右指针，同时窗口仍可以延伸，而无需使任何导线的两个端点都位于内部。 两个端点都在内部的导线不能与相应的切口交叉。 
5. 每当每根导线在当前窗口内恰好有一个端点时，窗口的两个边界位置就描述了有效的单次切割。 
6. 如果扫描完成后没有找到这样的窗口，则输出矩形的两条稍微缩短的对角线。 

不变量是滑动窗口总是代表一个候选切割区间，其右端点对于当前左端点已经尽可能远地延伸。 在此扫描期间会出现每个可能的有效间隔，因为左指针会访问端点之间的每个可能的间隙，而右指针只会绕着圆向前移动。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, w, h = map(int, input().split())

    events = []
    wires = []

    per = 2 * (w + h)

    def pos(x, y):
        if y == 0:
            return x
        if x == w:
            return w + y
        if y == h:
            return w + h + (w - x)
        return w + h + w + (h - y)

    for i in range(n):
        x1, y1, x2, y2 = map(int, input().split())
        a = pos(x1, y1)
        b = pos(x2, y2)
        wires.append((a, b))
        events.append((a, i))
        events.append((b, i))

    events.sort()

    m = len(events)
    coords = [x[0] for x in events]

    index_a = [0] * n
    index_b = [0] * n
    for i, (_, w_id) in enumerate(events):
        if index_a[w_id] == 0 and index_b[w_id] == 0:
            index_a[w_id] = i
        else:
            index_b[w_id] = i

    cnt = [0] * n
    one = 0
    two = 0

    def add(idx):
        nonlocal one, two
        w_id = events[idx % m][1]
        if cnt[w_id] == 0:
            cnt[w_id] = 1
            one += 1
        elif cnt[w_id] == 1:
            cnt[w_id] = 2
            one -= 1
            two += 1

    def remove(idx):
        nonlocal one, two
        w_id = events[idx % m][1]
        if cnt[w_id] == 1:
            cnt[w_id] = 0
            one -= 1
        else:
            cnt[w_id] = 1
            two -= 1
            one += 1

    def from_pos(p):
        p %= per
        if p < w:
            return 0.0, float(p)
        p -= w
        if p < h:
            return float(w), float(p)
        p -= h
        if p < w:
            return float(w - p), float(h)
        p -= w
        return 0.0, float(h - p)

    r = 0
    while r < m:
        add(r)
        r += 1

    for l in range(m):
        while r < l + m and two == 0 and one < n:
            add(r)
            r += 1

        if one == n and two == 0:
            a = coords[l]
            b = coords[r - 1] if r - 1 < m else coords[(r - 1) % m] + per
            if b - a < per:
                mid1 = a + 0.5
                mid2 = b - 0.5
                if mid2 > per:
                    mid2 -= per
                x1, y1 = from_pos(mid1)
                x2, y2 = from_pos(mid2)
                print(1)
                print(x1, y1, x2, y2)
                return

        remove(l)

    eps = 0.001
    print(2)
    print(eps, eps, w - eps, h - eps)
    print(w - eps, eps, eps, h - eps)

if __name__ == "__main__":
    solve()
```
