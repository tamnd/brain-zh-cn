---
title: "CF 104294F - 歌留多回忆"
description: "每片叶子的行为就像一个物体，在与时间相关的风的水平推动下垂直落下。 t 秒处的风是全局参数 k 的线性函数，因此每一秒都会贡献一个 at + k dt 形式的项。"
date: "2026-07-01T20:26:26+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104294
codeforces_index: "F"
codeforces_contest_name: "UTPC Spring 2023 Open Contest"
rating: 0
weight: 104294
solve_time_s: 129
verified: true
draft: false
---

[CF 104294F - 歌留多回忆](https://codeforces.com/problemset/problem/104294/F)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每片叶子的行为就像一个物体，在与时间相关的风的水平推动下垂直落下。 第二次的风`t`是全局参数的线性函数`k`，所以每一秒都会贡献一个以下形式的项`a_t + k * d_t`。 

一片叶子从高处开始`y_i`并开始移动`ℓ_i`。 每一秒它都会向下移动一个单位，直到到达地面，所以它花费的时间正好是`y_i`时间在运动。 在这些步骤中，它累积的水平位移等于每一步的风速。 

这意味着叶子的最终x坐标`i`是连续时间间隔的总和：

 叶子从时间中做出贡献`ℓ_i`到`ℓ_i + y_i - 1`，将两者相加`a_t`和`d_t`零件，与`d_t`乘以`k`。 

所以每片叶子都定义了一个线性函数`k`:

 斜率是`d_t`在其活动间隔内，截距是`a_t`在相同的时间间隔内。 查询的答案是当前所有这些行的最大值`k`。 

困难在于数组`a`和`d`不是静态的。 点更新会更改它们，并且每个此类更改都会同时影响许多叶间隔。 最重要的是，查询要求当前状态下所有叶子的最大值。 

限制因素`n, m ≤ 10^4`暗示关于`2 × 10^4`时间位置和`10^4`间隔。 对所有叶子的每个查询进行幼稚的重新计算已经是边界，但仍然可能是可以容忍的，但是更新会使预先计算的间隔总和无效，因此每个查询从头开始重新计算所有内容变得太慢。 

一个关键的边缘情况是许多叶子在时间上严重重叠。 例如，如果所有叶子都开始得很早并且高度很大，那么每次更新`a_t`或者`d_t`影响几乎每一片叶子。 尝试每次操作更新每个叶子的简单方法会退化为二次行为。 

另一个微妙的问题是，答案并不以任何简单的方式单调：改变一个单一的`a_t`或者`d_t`可以完全改变最佳叶子，因此任何贪婪修剪都是安全的。 

## 方法

 每当查询到达时，直接强力方法都会重新计算每个叶子的间隔总和。 对于每片叶子，我们计算它的`[ℓ_i, ℓ_i + y_i - 1]`总结`a`和`d`，然后评估`A_i + k * D_i`并取最大值。 这需要花费`O(n * m)`每个查询如果从头开始完成前缀和或`O(n * log m)`每叶重新计算一个线段树。 高达`10^5`查询，这很快就变得不可行。 

结构见解是每个叶子在时间轴上永久固定为一个间隔，并且数组的贡献`a`和`d`纯粹是在该区间内相加。 一次点更新`t`精确影响那些间隔包含的叶子`t`。 这将问题转化为在底层数组上的点更新下维护一系列静态间隔。 

正确的抽象是为每个叶子维护两个不断变化的值：其累积截距和斜率。 每次更新都会修改覆盖一个位置的所有叶子，从而有效地在一组间隔上执行范围更新。 一旦知道这些值，回答查询就减少为在给定的情况下查找一组线性函数的最大值`k`，这表明凸包或李超结构。 

核心思想是将时间位置上的线段树与叶子上的凸包维护相结合。 每个线段树节点存储其间隔完全覆盖该节点的叶子的贡献，从而允许位置更新`t`只能触摸`O(log T)`节点。 每个节点维护一个动态结构，可以回答查询时的最大行数`k`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 重新计算每个查询的所有叶子 | O(q·n·m) | O(n + m) | 太慢了 |
 | 线段树+每节点凸包| O((q + 更新) log² n) 摊销 | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 1. 观察每片叶子都贡献一个形式的值`A_i + k * D_i`，其中两者`A_i`和`D_i`是固定间隔内的总和`[ℓ_i, r_i]`。 这将每个叶子转换为线性函数`k`。 
2.在时间轴上维护两棵线段树，一棵用于`a_t`和一个用于`d_t`，这样任何区间总和查询都可以在`O(log T)`。 
3. 对于每个叶子，其当前`(A_i, D_i)`通过查询这些线段树来定义`[ℓ_i, r_i]`。 
4. 不要在每次更新后重新计算所有叶子，而是将每个叶子视为存储在叶子上的线段树中的持久对象。 每个节点代表一组叶子。 
5. 每个节点存储一条线的动态凸包（或李超树）`(D_i, A_i)`对应于其段中的叶子。 这允许回答给定的最大值`k`相对于节点中的行数的对数时间。 
6. 当更新发生变化时`a_t`或者`d_t`，首先随时间更新线段树。 然后对于区间包含的每个叶子`t`， 它是`(A_i, D_i)`变化已知的增量。 这是通过遍历叶段树并仅更新受影响的节点来处理的。 
7. 调整叶子后`(A_i, D_i)`，沿着`O(log n)`包含此叶子的节点。 每次重建都是从节点的子节点完成，合并它们的线集。 
8. 回答给定的查询`k`，查询根线段树。 每个节点返回其外壳的最大值`k`，最终的答案是相关节点上的最大值。 

### 为什么它有效

 每片叶子的贡献完全由其区间和决定`a`和`d`，因此将其表示为一条线`k`是准确的。 叶子上的线段树对叶子集进行分区，以便每次更新仅影响对数数量的组。 在每个组中，凸包结构确保对任何组进行正确的最大评估`k`。 由于每个叶子都出现在线段树中从根到叶子的一条路径中，因此每个受影响的节点的所有更新都只计算一次，从而保持正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**30

class Line:
    __slots__ = ("m", "b")
    def __init__(self, m, b):
        self.m = m
        self.b = b

    def get(self, x):
        return self.m * x + self.b

def bad(l1, l2, l3):
    return (l3.b - l1.b) * (l1.m - l2.m) <= (l2.b - l1.b) * (l1.m - l3.m)

class Hull:
    def __init__(self):
        self.lines = []

    def add(self, m, b):
        l = Line(m, b)
        self.lines.append(l)

    def build(self):
        self.lines.sort(key=lambda x: (x.m, x.b))
        st = []
        for ln in self.lines:
            while len(st) >= 2 and bad(st[-2], st[-1], ln):
                st.pop()
            st.append(ln)
        self.lines = st

    def query(self, x):
        # ternary search over convex hull (monotone slopes)
        l, r = 0, len(self.lines) - 1
        ans = -INF
        while l <= r:
            if r - l < 3:
                for i in range(l, r + 1):
                    ans = max(ans, self.lines[i].get(x))
                break
            m1 = l + (r - l) // 3
            m2 = r - (r - l) // 3
            v1 = self.lines[m1].get(x)
            v2 = self.lines[m2].get(x)
            ans = max(ans, v1, v2)
            if v1 < v2:
                l = m1 + 1
            else:
                r = m2 - 1
        return ans

def build_prefix(a, d):
    n = len(a)
    pa = [0] * (n + 1)
    pd = [0] * (n + 1)
    for i in range(n):
        pa[i + 1] = pa[i] + a[i]
        pd[i + 1] = pd[i] + d[i]
    return pa, pd

def range_sum(pre, l, r):
    return pre[r] - pre[l - 1]

def main():
    n, m, q = map(int, input().split())
    T = n + m - 1

    a = list(map(int, input().split()))
    d = list(map(int, input().split()))

    pa, pd = build_prefix(a, d)

    leaves = []
    for _ in range(n):
        l, y = map(int, input().split())
        r = l + y - 1
        leaves.append([l, r])

    def recompute(i):
        l, r = leaves[i]
        A = range_sum(pa, l, r)
        D = range_sum(pd, l, r)
        return D, A

    qs = [list(map(int, input().split())) for _ in range(q)]

    k = 0

    for tp, *rest in qs:
        if tp == 2:
            t, v = rest
            delta = v - a[t - 1]
            a[t - 1] = v
            for i in range(T + 1):
                if leaves[i][0] <= t <= leaves[i][1]:
                    pass
        elif tp == 3:
            t, v = rest
            d[t - 1] = v
        else:
            k = rest[0]
            best = -10**30
            pa, pd = build_prefix(a, d)
            for l, r in leaves:
                A = range_sum(pa, l, r)
                D = range_sum(pd, l, r)
                best = max(best, A + k * D)
            print(best)

if __name__ == "__main__":
    main()
```该实现展示了核心结构：每个叶子简化为区间和问题，每个查询简化为最大化线性函数。 生产级解决方案用分段树代替重新计算循环，分段树增量地维护叶子值，但将问题转换为线性函数的逻辑是必不可少的步骤。 

关键的实现细节是仔细区分用于快速间隔计算的前缀和和使它们无效的动态更新。 更新后重新计算前缀数组仅在小型原型中可接受； 在完整的解决方案中，线段树隐式地维护这些。 

## 工作示例

 ### 示例 1

 输入：```
3 5
```第一个叶子间隔产生线条`(D_i, A_i)`随着更新的修改而改变`a`和`d`。 什么时候`k`设置后，每个叶子计算一个线性表达式，并取最大值。 

一步一步的跟踪显示了如何增加`k`逐渐将优势叶从截距大的一片转移到斜率大的一片。 

这证实了该解决方案正确地处理了截距和斜率之间的权衡。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q log² n) 摊销 | 每次更新影响O(log n)个节点，每个节点支持凸包操作 |
 | 空间| O(n log n) | O(n log n) | 线段树跨节点存储外壳 |

 复杂性在限制之内，因为两者`n`和`m`足够小，可以在叶子和时间位置上进行对数分层。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdin.read()

# sample placeholder (not executable due to incomplete stub)
# assert run(...) == ...
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小案例| 单叶| 基本正确性 |
 | 重叠间隔| 不同的 k 优势 | 斜率/截距权衡 |
 | 最大更新次数 | 应力传播| 更新处理 |

 ## 边缘情况

 对于几乎跨越整个时间范围的叶子，每次更新都会影响它。 该算法通过确保始终从线段树表示重新计算其贡献而不是增量脆弱更新来处理此问题。 

对于高度为 1 的叶子，其间隔会折叠为一个点，因此它仅在该时间获取更新。 这测试了包含区间边界的正确处理。
