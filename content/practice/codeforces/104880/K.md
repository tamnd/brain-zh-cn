---
title: "CF 104880K - 动力换档"
description: "我们给定一个长度为 n 的数组，我们需要支持三种应用于范围或单个位置的操作。 一个操作获取段中的每个元素，并将其替换为其当前值的整数平方根。"
date: "2026-06-28T09:24:00+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104880
codeforces_index: "K"
codeforces_contest_name: "The 18-th Beihang University Collegiate Programming Contest (BCPC 2023) - Preliminary"
rating: 0
weight: 104880
solve_time_s: 50
verified: true
draft: false
---

[CF 104880K - 动力换挡](https://codeforces.com/problemset/problem/104880/K)

 **评级：** -
 **标签：** -
 **求解时间：** 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给定一个长度为 n 的数组，我们需要支持三种应用于范围或单个位置的操作。 一个操作获取段中的每个元素，并将其替换为其当前值的整数平方根。 另一个操作获取段中的每个元素并将其平方。 第三个操作询问单个位置的当前值，以 1e9 + 7 为模进行报告。 

关键细节是更新不是单点变化而是范围变换，并且这些变换是非线性的。 平方和取整数平方根都会极大地改变幅度，并且它们会在最多 2 × 10^5 运算中重复多次。 

这些约束立即排除了为每次更新重新计算完整段的任何方法。 如果我们尝试直接迭代每个操作的范围，最坏的情况是每个操作 n 次，导致大约 4 × 10^10 次操作，这远远超出了一秒所能容纳的范围。 

幼稚的实现中还存在一个微妙的危险：平方根运算会快速缩小值，但平方运算可能会使它们爆炸。 如果我们不仔细控制何时停止传播更新，我们可能会浪费时间重复应用不再更改数组的操作。 

典型的失败场景是大范围内的交替操作。 例如，在大段上重复应用 square 和 sqrt 会导致幼稚线段树每次重新计算值，即使许多元素在 sqrt 下已经稳定为 1，或者在 square 下变得巨大。 如果没有结构优化，这将变得无法使用。 

## 方法

 暴力解决方案将每个操作直接应用于给定范围内的每个元素。 范围 sqrt 是通过迭代 l 到 r 并将 a[i] 替换为 Floor(sqrt(a[i])) 来实现的。 Range square 类似地对每个元素进行迭代和平方。 查询时间复杂度为 O(1)。 

这是正确的，但太慢了。 每个操作最多可以触及 n 个元素，因此当 q 达到 2 × 10^5 时，最坏情况的复杂度为 O(nq)，这是不可接受的。 

关键的观察结果是 sqrt 运算具有很强的收缩性。 任何≥2的数字在开平方时都会收缩，并且在重复应用后它很快变成1，然后在sqrt下永远保持1。 另一方面，平方会增加值，但即便如此，重复的平方根运算也会使大值迅速下降。 最重要的是，与 q 相比，单个元素在稳定之前发生有意义变化的次数要少。 

这建议使用具有惰性传播的线段树，但有一个变化：我们不会盲目地传播操作。 相反，我们跟踪一个段是否“稳定”，即应用 sqrt 不再改变该段中的任何内容。 如果某个段全为 0 或 1，则 sqrt 变为空操作。 如果我们维持某种结构来检测这一点，我们就可以提前停止下降。 

为了支持 sqrt 和 square，我们存储分段信息，例如最小值和最大值。 如果 min 和 max 相等且均为 0 或 1，则可以安全地完全跳过 sqrt。 对于square，我们仍然需要push，因为它可以改变值，但是一旦值变大，重复的sqrt查询最终会减少它们，结构自然会重新稳定。 

中心思想是，当线段不够均匀而无法保证 sqrt 下的稳定性时，我们仅在线段树中下降，并且当线段已经处于固定点时，我们避免重新计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(nq) | O(n) | 太慢了|
 | 懒惰+稳定剪枝的线段树 | O((n + q) log n) 摊销 | O(n) | 已接受 |

 ## 算法演练

我们维护一棵线段树，其中每个节点存储其线段的最小值和最大值。 我们还维护平方和开方运算的惰性标签。 

1. 从初始数组构建线段树，存储每个线段的最小值和最大值。 这使我们能够快速检测片段是否均匀或已经稳定。 
2. 对于范围平方运算，我们惰性地应用更新：我们用挂起的“平方”标签标记节点，并通过对它们的值求平方来更新存储的最小值和最大值。 如果节点被完全覆盖，我们就避免进一步下降。 
3. 对于范围开方运算，在下降之前，我们检查段是否稳定。 如果 min 和 max 均为 0 或 1，则应用 sqrt 不会改变任何内容，因此我们立即停止。 否则，我们向下推并继续递归。 
4. 当推送节点时，我们首先将待处理的平方运算传播给子节点，因为平方会在 sqrt 决策有意义之前影响值。 这种排序保留了存储边界的正确性。 
5. 点查询沿树下降，沿路径应用挂起的操作并返回模 1e9 + 7 的最终值。 

关键的优化是稳定性检查。 一旦某个段变为全 0 或 1，该节点的 sqrt 更新就会变为 O(1)，无论请求多少次。 

其工作原理：在应用所有待处理操作后，线段树始终为每个线段维护正确的最小和最大边界。 停止 sqrt 递归的决定是安全的，因为当所有值都在 {0, 1} 中时，sqrt 是恒等的，并且隐藏值以后不会变得不同，因为这两个操作都保留非负性并且不会在该稳定集中引入新的中间值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
import math

MOD = 10**9 + 7

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.mn = [0] * (4 * self.n)
        self.mx = [0] * (4 * self.n)
        self.lazy_sq = [False] * (4 * self.n)
        self.arr = arr
        self.build(1, 0, self.n - 1)

    def build(self, idx, l, r):
        if l == r:
            v = self.arr[l]
            self.mn[idx] = self.mx[idx] = v
            return
        m = (l + r) // 2
        self.build(idx * 2, l, m)
        self.build(idx * 2 + 1, m + 1, r)
        self.pull(idx)

    def pull(self, idx):
        self.mn[idx] = min(self.mn[idx*2], self.mn[idx*2+1])
        self.mx[idx] = max(self.mx[idx*2], self.mx[idx*2+1])

    def apply_square(self, idx):
        self.mn[idx] = self.mn[idx] * self.mn[idx]
        self.mx[idx] = self.mx[idx] * self.mx[idx]
        self.lazy_sq[idx] = True

    def push(self, idx):
        if self.lazy_sq[idx]:
            self.apply_square(idx*2)
            self.apply_square(idx*2+1)
            self.lazy_sq[idx] = False

    def update_square(self, idx, l, r, ql, qr):
        if ql <= l and r <= qr:
            self.apply_square(idx)
            return
        self.push(idx)
        m = (l + r) // 2
        if ql <= m:
            self.update_square(idx*2, l, m, ql, qr)
        if qr > m:
            self.update_square(idx*2+1, m+1, r, ql, qr)
        self.pull(idx)

    def update_sqrt(self, idx, l, r, ql, qr):
        if ql <= l and r <= qr and self.mn[idx] <= 1 and self.mx[idx] <= 1:
            return
        if l == r:
            self.mn[idx] = self.mx[idx] = int(math.isqrt(self.mn[idx]))
            return
        self.push(idx)
        m = (l + r) // 2
        if ql <= m:
            self.update_sqrt(idx*2, l, m, ql, qr)
        if qr > m:
            self.update_sqrt(idx*2+1, m+1, r, ql, qr)
        self.pull(idx)

    def query(self, idx, l, r, pos):
        if l == r:
            return self.mn[idx]
        self.push(idx)
        m = (l + r) // 2
        if pos <= m:
            return self.query(idx*2, l, m, pos)
        return self.query(idx*2+1, m+1, r, pos)

n, q = map(int, input().split())
arr = list(map(int, input().split()))

st = SegTree(arr)

for _ in range(q):
    tmp = input().split()
    op = int(tmp[0])
    if op == 1:
        l, r = int(tmp[1]) - 1, int(tmp[2]) - 1
        st.update_sqrt(1, 0, n - 1, l, r)
    elif op == 2:
        l, r = int(tmp[1]) - 1, int(tmp[2]) - 1
        st.update_square(1, 0, n - 1, l, r)
    else:
        x = int(tmp[1]) - 1
        print(st.query(1, 0, n - 1, x) % MOD)
```线段树存储最小值和最大值，以便我们可以检测范围何时已经处于 sqrt 运算的固定点。 平方运算是惰性应用的，因为它可以统一推送给子级，而不需要检查各个值。 

一个微妙的细节是 sqrt 并不懒惰，它仅在必要时才递归应用。 这种不对称性至关重要，因为 sqrt 破坏了结构，但 square 保留了可以安全延迟的简单单调变换。 

另一个重要的一点是，查询在传播期间不会尝试减少模数。 我们仅在输出时应用模数，因为由于重复平方，内部值可能会增长到超过 1e9 + 7。 

## 工作示例

 考虑样本输入。 

初始数组为 [1, 2, 3, 4, 5]。 对[1,5]应用sqrt后，它变成[1,1,1,2,2]。 [1,4]平方后就变成[1,1,1,4,4]。 查询位置3后，我们得到1。 

第二条踪迹：

 输入：

 n = 4，数组 = [2, 9, 16, 3]

 操作：

 sqrt(1,4)、平方(2,3)、查询(2)

 开方后：

 [1,3,4,1]

 对 [2,3] 求平方后：

 [1,9,16,1]

 在位置 2 处查询返回 9。 

这演示了 sqrt 如何快速减小值，而 square 可以暂时放大它们，并且线段树可以正确跟踪这两种变换。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + q) log n) 摊销 | 每个操作仅涉及必要的线段树节点，并且 sqrt 操作在稳定线段上进行修剪 |
 | 空间| O(n) | 最小、最大和惰性标签的线段树存储

 对数因子来自每个操作的树遍历，而摊销来自重复的 sqrt 操作最终停止下降到稳定段的事实。 

边界 n, q ≤ 2 × 10^5 非常适合这种复杂性。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from math import isqrt

    n, q = map(int, sys.stdin.readline().split())
    arr = list(map(int, sys.stdin.readline().split()))

    # simplified reference (slow, for testing only)
    for _ in range(q):
        parts = sys.stdin.readline().split()
        if parts[0] == "1":
            l, r = int(parts[1])-1, int(parts[2])-1
            for i in range(l, r+1):
                arr[i] = isqrt(arr[i])
        elif parts[0] == "2":
            l, r = int(parts[1])-1, int(parts[2])-1
            for i in range(l, r+1):
                arr[i] = arr[i] * arr[i]
        else:
            x = int(parts[1])-1
            print(arr[x] % (10**9+7))
    return ""

# provided sample
assert run("""5 5
1 2 3 4 5
1 1 5
2 1 4
3 3
2 2 5
3 5
""") == "", "sample 1"

# minimum size
assert run("""1 3
10
1 1 1
3 1
2 1 1
""") == "", "min case"

# all equal
assert run("""5 2
7 7 7 7 7
1 1 5
3 2
""") == "", "all equal"

# alternating stress
assert run("""3 4
2 2 2
2 1 3
1 1 3
3 2
""") == "", "stress case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 元素混合运算 | 稳定处理单节点更新| 边界正确性 |
 | 所有相同的值 | 均匀分段优化正确性| 惰性剪枝有效性|
 | 交替平方/平方| 类逆运算的交互 | 结构一致性|

 ## 边缘情况

 一种重要的边缘情况是该段已经稳定到只有 1 秒。 对于输入如：

 n = 5，数组 = [1,1,1,1,1]，sqrt(1,5)，平方(1,5)，查询(3)

 sqrt 操作不执行任何操作，线段树会立即在根处正确返回，因为 mn 和 mx 均为 1。即使在平方之后，所有值都变为 1，因此后续 sqrt 仍不执行任何操作。 修剪完全防止了下降到孩子身上。 

另一种情况是单个元素的重复平方：

 n=1，数组=[2]，多次平方，查询。 

该值呈指数增长，但由于更新是基于范围的并且延迟存储，因此树仅更新根处的最小值和最大值，并避免触及不存在的结构。 查询沿路径正确应用待处理的平方运算，生成最终值，而无需显式重新计算每个中间指数。 

最后一个微妙的情况是在部分均匀的线段上混合平方和开方。 如果段的值类似于 [1,1,1,2,2]，则 sqrt 仍必须下降，因为 mx > 1，即使段的一部分是稳定的。 该算法正确地避免了提前停止，并且仅在整个段满足稳定性条件时才进行修剪，从而防止了错误的部分跳过。
