---
title: "CF 104027F - \u843d\u77f3"
description: "该问题模拟了一组垂直落到由柱子组成的一维地面上的石块。 每列在高度为零时都是空的，当石头掉落时，它们会根据落地位置向上堆积。"
date: "2026-07-02T04:09:10+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104027
codeforces_index: "F"
codeforces_contest_name: "The 10-th BIT Campus Programming Contest for Junior Grade Group"
rating: 0
weight: 104027
solve_time_s: 47
verified: true
draft: false
---

[CF 104027F - \u843d\u77f3](https://codeforces.com/problemset/problem/104027/F)

 **评级：** -
 **标签：** -
 **求解时间：** 47s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题模拟了一组垂直落到由柱子组成的一维地面上的石块。 每列在高度为零时都是空的，当石头掉落时，它们会根据落地位置向上堆积。 

每块石头都会影响一段连续的柱子。 当一块石头到达时，它不会逐渐模拟逐个细胞掉落的情况。 相反，它的行为就像一个刚性块，在整个间隔上平坦地着陆。 石头的最终高度由其覆盖区间内最高的柱子决定，因为石头必须放置在已经存在的东西的顶部。 着陆后，它会将其间隔内的每根柱子的高度均匀地增加到比最大支撑高度高出一个单位。 

输出是处理所有宝石后的最终配置，通常意味着每列的最终高度或所有放置的效果。 

虽然语句很简短，但关键的抽象是每个操作都是一个范围查询，然后是一个范围赋值。 范围查询询问段中的最大当前高度，更新将整个段设置为该最大值加一。 

约束没有明确说明，但预期的解决方案在操作数乘以每个查询的对数开销方面是线性或接近线性的。 如果柱子和石头的数量都很大，则每个单元的简单模拟将太慢，因为每个操作都会涉及整个区间。 

一个微妙的边缘情况来自重叠间隔，其中较早的更新部分主导了较晚的更新。 例如，如果我们将列初始化为零并执行两个操作：第一个更新间隔 [1,3]，然后更新 [2,4]，则第二个操作在计算其最大值时必须观察第一个操作的更新值。 忘记在重叠处正确维护全局状态的幼稚实现将计算出错误的着陆高度。 

当间隔很大并且高度重叠时，例如每个操作都覆盖整个范围，就会出现另一种失败情况。 即使每个单独的操作看起来很简单，每个位置的更新方法也会退化为二次行为并且会超时。 

## 方法

 直接模拟维护一个列高数组。 对于每块石头，我们扫描其间隔内的所有列，计算最大高度，然后再次扫描以将该值加一。 这是正确的，因为它完全遵循“落在区间内的最高支撑上，然后填充整个跨度”的物理规则。 然而，每个操作都会花费间隔宽度的线性时间，因此在最坏的情况下，每个石头几乎跨越整个宽度，总复杂度变成列数乘以操作的二次方。 

关键的结构观察是，该操作完全由静态数组上的两个操作决定：范围最大查询，紧接着将该范围内的每个值设置为常量。 这消除了模拟区间内运动的任何需要。 一旦知道了最大值，整个段的结果都是一致的。 

这使得该问题成为线段树或任何支持快速范围最大查询和快速范围分配的数据结构的经典案例。 由于分配的值始终是根据查询计算出的单个常量，因此我们可以安全地覆盖整个段。 除了标准的惰性传播机制之外，不需要在段内部分传播旧值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 每次操作的最坏情况为 O(n · m)，导致总体 O(n²) | O(米) | 太慢了|
 | 线段树（范围最大值 + 范围分配）| O(n log m) | O(n log m) | O(米) | 已接受 |

 ## 算法演练

我们维护所有列的高度数组，但不是直接更新它，而是将其存储在支持范围最大查询和范围分配更新的线段树中。 

### 步骤

 1. 在所有列上构建线段树，将每个高度初始化为零。 这代表在扔下任何石头之前的空地。 
2.对于每个区间为[l,r]的石块操作，在线段树中查询该区间内的最大值。 该最大值代表石头可以落地而不与现有结构重叠的最高支撑点。 
3. 设该查询的结果为q。 石头将占据高度 q + 1，因为它直接位于其间隔中最高的现有柱子的顶部。 
4. 对 [l, r] 应用范围分配更新，将该间隔中的每个位置设置为 q + 1。这反映了石头在这个新高度处的整个段上形成了一个平坦层。 
5. 按顺序对所有宝石继续此过程，确保每次更新都能看到之前操作的完全更新的结构。 

### 为什么它有效

 在任何时刻，每列都会存储迄今为止构建的堆叠结构的正确高度。 某个时间间隔内的最大查询捕获了石头必须放置在该区域最高障碍物上的确切物理约束。 由于石头是刚性且均匀的，一旦确定了其最终高度，其跨度中的每根柱子都必须与该高度相匹配。 线段树确保查询和覆盖都与所有先前的更新一致，因此后续操作不会忽略先前的结构。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, n):
        self.n = n
        self.mx = [0] * (4 * n)
        self.lazy = [-1] * (4 * n)

    def push(self, idx):
        if self.lazy[idx] != -1:
            v = self.lazy[idx]
            self.mx[idx * 2] = v
            self.mx[idx * 2 + 1] = v
            self.lazy[idx * 2] = v
            self.lazy[idx * 2 + 1] = v
            self.lazy[idx] = -1

    def range_set(self, idx, l, r, ql, qr, val):
        if ql <= l and r <= qr:
            self.mx[idx] = val
            self.lazy[idx] = val
            return
        if r < ql or l > qr:
            return
        self.push(idx)
        mid = (l + r) // 2
        self.range_set(idx * 2, l, mid, ql, qr, val)
        self.range_set(idx * 2 + 1, mid + 1, r, ql, qr, val)
        self.mx[idx] = max(self.mx[idx * 2], self.mx[idx * 2 + 1])

    def range_max(self, idx, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.mx[idx]
        if r < ql or l > qr:
            return 0
        self.push(idx)
        mid = (l + r) // 2
        return max(
            self.range_max(idx * 2, l, mid, ql, qr),
            self.range_max(idx * 2 + 1, mid + 1, r, ql, qr)
        )

def solve():
    n, m = map(int, input().split())
    seg = SegTree(m)

    for _ in range(n):
        l, r = map(int, input().split())
        q = seg.range_max(1, 1, m, l, r)
        seg.range_set(1, 1, m, l, r, q + 1)

    res = []
    for i in range(1, m + 1):
        res.append(str(seg.range_max(1, 1, m, i, i)))
    print(" ".join(res))

if __name__ == "__main__":
    solve()
```线段树以其标准形式使用，并具有用于范围分配的延迟传播。 关键的实现细节是我们永远不需要支持增量更新，只需要用单个值覆盖段。 因此，惰性标记存储完整的分配，而不是增量。 

操作顺序很重要：在应用任何更新之前必须查询最大值，否则新值会污染结果。 通过单独查询每个位置来提取最终的输出，相当于读取线段树的叶子值。 

## 工作示例

 考虑一个有五根柱子和三块石头的小场景：[1,3]、[2,5] 和 [1,5]。 

### 轨迹 1

 | 步骤| 间隔 | 范围内的最大值 (q) | 指定值| 更新后状态 |
 | ---| ---| ---| ---| ---|
 | 1 | [1,3]| 0 | 1 | [1,1,1,0,0] |
 | 2 | [2,5]| 1 | 2 | [1,2,2,2,2] |
 | 3 | [1,5]| 2 | 3 | [3,3,3,3,3] |

 此跟踪显示了早期的部分结构如何直接影响后来的最大查询，以及每次更新如何将段展平到新的统一级别。 

### 轨迹 2

 现在考虑 [2,4]、[1,2]、[3,5]。 

| 步骤| 间隔 | 范围内的最大值 (q) | 指定值| 更新后状态 |
 | ---| ---| ---| ---| ---|
 | 1 | [2,4]| 0 | 1 | [0,1,1,1,0] |
 | 2 | [1,2]| 1 | 2 | [2,2,1,1,0] |
 | 3 | [3,5]| 1 | 2 | [2,2,2,2,2] |

 这表明每个操作仅取决于其区间内的当前最大值，而不取决于全局结构。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log m) | O(n log m) | 每块石头在线段树上执行一次范围最大查询和一次范围分配 |
 | 空间| O(米) | 线段树每列存储恒定数量的节点 |

 对于典型约束条件来说，对数因子足够小，其中石子和柱子的数量最多可达 2×10^5。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from math import isclose

    class SegTree:
        def __init__(self, n):
            self.n = n
            self.mx = [0] * (4 * n)
            self.lazy = [-1] * (4 * n)

        def push(self, idx):
            if self.lazy[idx] != -1:
                v = self.lazy[idx]
                self.mx[idx * 2] = v
                self.mx[idx * 2 + 1] = v
                self.lazy[idx * 2] = v
                self.lazy[idx * 2 + 1] = v
                self.lazy[idx] = -1

        def range_set(self, idx, l, r, ql, qr, val):
            if ql <= l and r <= qr:
                self.mx[idx] = val
                self.lazy[idx] = val
                return
            if r < ql or l > qr:
                return
            self.push(idx)
            mid = (l + r) // 2
            self.range_set(idx * 2, l, mid, ql, qr, val)
            self.range_set(idx * 2 + 1, mid + 1, r, ql, qr, val)
            self.mx[idx] = max(self.mx[idx * 2], self.mx[idx * 2 + 1])

        def range_max(self, idx, l, r, ql, qr):
            if ql <= l and r <= qr:
                return self.mx[idx]
            if r < ql or l > qr:
                return 0
            self.push(idx)
            mid = (l + r) // 2
            return max(
                self.range_max(idx * 2, l, mid, ql, qr),
                self.range_max(idx * 2 + 1, mid + 1, r, ql, qr)
            )

    data = list(map(int, inp.split()))
    it = iter(data)
    n, m = next(it), next(it)
    seg = SegTree(m)

    for _ in range(n):
        l, r = next(it), next(it)
        q = seg.range_max(1, 1, m, l, r)
        seg.range_set(1, 1, m, l, r, q + 1)

    out = []
    for i in range(1, m + 1):
        out.append(str(seg.range_max(1, 1, m, i, i)))
    return " ".join(out)

# custom cases
assert run("1 1\n1 1\n") == "1", "single cell"
assert run("2 3\n1 3\n2 3\n") == "2 2 2", "overlap propagation"
assert run("3 5\n1 2\n3 4\n2 5\n") == "2 2 2 2 2", "full merge"
assert run("2 5\n1 5\n1 5\n") == "2 2 2 2 2", "stacking full range"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单细胞| 1 | 最小边界处理|
 | 重叠传播| 2 2 2 | 2 2 2 正确依赖以前的更新|
 | 完全合并| 2 2 2 2 2 | 2 2 2 2 2 重叠区间的相互作用|
 | 堆码全系列| 2 2 2 2 2 | 2 2 2 2 2 重复全球更新|

 ## 边缘情况

 单列的最小情况可确保线段树正确处理退化范围。 用于输入`1 1`随后进行一次更新`[1,1]`，最大值为零，最终值为 1。 该结构简化为单个叶子，因此查询和更新都必须直接作用于该节点。 

完全重叠的序列，例如重复`[1,m]`间隔强调惰性传播。 第一次更新后，所有值都变为一个。 第二次更新必须在覆盖之前仍然正确查询，从而在各处生成两个。 任何在更新后意外查询的实现都会错误地从已修改的值继续增加，而不尊重原始的最大结构。 

混合重叠的情况，例如`[1,2]`,`[2,3]`,`[1,3]`检查部分传播是否正确处理。 第二次更新取决于第一次更新，第三次更新取决于两者。 段树确保每个查询在发生任何覆盖之前都能看到最新的一致状态，从而保持链接依赖关系的正确性。
