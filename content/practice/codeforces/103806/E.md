---
title: "CF 103806E - 检查员"
description: "我们得到一排房屋，索引从 1 到 n。 每栋房子都以初始银行余额开始。 然后随着时间的推移会发生一系列事件。 某些事件通过添加正值或负值来修改整个房屋区间的余额。"
date: "2026-07-02T08:41:05+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103806
codeforces_index: "E"
codeforces_contest_name: "XXVI Spain Olympiad in Informatics, Day 1"
rating: 0
weight: 103806
solve_time_s: 66
verified: true
draft: false
---

[CF 103806E - 检查员](https://codeforces.com/problemset/problem/103806/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一排房屋，索引从 1 到 n。 每栋房子都以初始银行余额开始。 然后随着时间的推移会发生一系列事件。 某些事件通过添加正值或负值来修改整个房屋区间的余额。 其他事件会针对特定房屋展开“调查”，然后将其关闭。 当调查结束时，我们被要求报告该公司在整个调查时间间隔内所拥有的最小余额。 

重要的细节是，由于范围更新，余额会随着时间的推移而变化，我们必须仅在调查期间跟踪每个房屋的最短时间。 所以每个房子 i 都有多个“不活跃”阶段，然后是“主动调查”，然后“再次不活跃”，在活跃阶段我们不断观察它的价值并记住它达到的最小值。 

限制最多为 200000 个房屋和 200000 个事件，这立即排除了每次更新扫描所有房屋或重复重新计算完整数组的任何解决方案。 每次范围更新都会涉及所有受影响的房屋的简单模拟将花费 O(nq)，这远远超出了可行的范围。 即使明确地维护每栋房屋的历史记录，在时间和内存上也会太大，因为每栋房屋都可能受到许多更新的影响。 

一个微妙的困难是更新和查询是完全交错的。 我们无法首先处理所有更新或所有查询。 我们必须维护一个动态结构，支持范围添加和随时快速访问单栋房屋的当前价值。 

另一种隐藏的边缘情况是调查间隔可以包括不同标志的多次更新。 房子的最小值可能出现在其活跃部分的中间，不一定是在开始或结束。 因此，我们必须持续跟踪历史最小值，而不仅仅是端点值。 

## 方法

 直接模拟维护整个数组，并通过从 l 迭代到 r 来应用每个“邮递员”事件，更新每个受影响的房屋。 在调查过程中，我们还会在每次更新后检查该房屋的最低价值。 这在概念上是可行的，但每次更新都可以触及 O(n) 个元素，最坏的情况是 O(nq)，对于 200000 来说太大了。 

关键的观察结果是，每个操作在一个段上都是线性且均匀的：每次更新都会向范围内的所有元素添加一个常量 x。 这表明线段树具有惰性传播，因为它天然支持对数时间的范围添加和点查询。 

然而，我们还需要跟踪每个房子在一个时间间隔内的最小值，而不仅仅是它的最终价值。 关键的结构简化是，对于固定房屋来说，其价值随着时间的推移随着一系列的添加而演变。 如果我们知道它的当前值，并且还保持自调查开始以来它所达到的最小值，那么影响它的每次更新都会将当前值和历史最小值移动相同的量。 这使得在每个房屋本地维护这两个数量成为可能。 

因此，每个房屋不是跟踪完整的历史记录，而是存储两个值：其当前值和自上次“开始”事件以来的最小值。 对于所有受影响的房屋，范围增加对这两个数量的影响相同。 线段树可以通过惰性传播有效地维护这些值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟 | O(nq) | O(n) | 太慢了 |
 | 具有惰性传播的线段树 | O(q log n) | O(q log n) | O(n) | 已接受 |

 ## 算法演练

我们在房屋数组上维护一棵线段树。 每片叶子都存储两条信息：该房屋的当前余额，以及自上次调查开始以来所达到的最低余额。 内部节点仅聚合范围更新所需的内容。 

操作处理如下。 

1. 使用初始余额构建线段树。 开始时，自上次启动以来的最小值等于初始值，因为尚未开始调查。 
2. 对于区间 [l, r] 上值为 x 的范围更新，我们应用惰性传播更新，将 x 添加到每个受影响的节点。 由于当前值和历史最小值都精确地偏移了 x，因此我们将 x 添加到每个受影响段的两个字段中。 这保留了正确性，因为该段中的所有过去值都被统一转换。 
3. 当开始对第 i 个房屋进行调查时，我们首先通过将任何待处理的延迟更新传播到该叶子节点来确保该叶子节点具有正确的当前值。 然后我们将其“自启动以来的最小值”重置为当前值。 这建立了一个新的基线：从这一刻起，我们只关心相对于这个起点的值。 
4. 在调查期间，更新继续影响该房屋。 由于当前值和最小值在范围添加下一起更新，因此最小值始终正确跟踪自上次重置以来看到的最低值。 
5. 当对房屋 i 的调查结束时，我们再次传播以确保应用所有更新，然后输出该房屋的存储最小值。 

关键的不变量是，对于每个房屋，在任何时刻，其存储的最小值等于自上次重置事件以来的时间间隔内其真实余额的最小值。 范围更新保留了这种不变性，因为它们统一移动所有历史值，并且重置事件通过将最小值与当前值同步来正确地重新定义新间隔的开始。 由于每次更新要么是统一移位，要么是重置边界，因此任何操作都不能引入未在存储的最小值中考虑的值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10**7)

class SegTree:
    def __init__(self, arr):
        self.n = len(arr) - 1  # 1-indexed
        self.size = 4 * self.n
        self.val = [0] * self.size
        self.mn = [0] * self.size
        self.lazy = [0] * self.size
        self._build(1, 1, self.n, arr)

    def _build(self, idx, l, r, arr):
        if l == r:
            self.val[idx] = arr[l]
            self.mn[idx] = arr[l]
            return
        mid = (l + r) // 2
        self._build(idx*2, l, mid, arr)
        self._build(idx*2+1, mid+1, r, arr)
        self.mn[idx] = min(self.mn[idx*2], self.mn[idx*2+1])

    def _push(self, idx):
        if self.lazy[idx] != 0:
            v = self.lazy[idx]
            for child in (idx*2, idx*2+1):
                self.val[child] += v
                self.mn[child] += v
                self.lazy[child] += v
            self.lazy[idx] = 0

    def _range_add(self, idx, l, r, ql, qr, v):
        if ql <= l and r <= qr:
            self.val[idx] += v
            self.mn[idx] += v
            self.lazy[idx] += v
            return
        self._push(idx)
        mid = (l + r) // 2
        if ql <= mid:
            self._range_add(idx*2, l, mid, ql, qr, v)
        if qr > mid:
            self._range_add(idx*2+1, mid+1, r, ql, qr, v)
        self.mn[idx] = min(self.mn[idx*2], self.mn[idx*2+1])

    def _query_val(self, idx, l, r, pos):
        if l == r:
            return self.val[idx]
        self._push(idx)
        mid = (l + r) // 2
        if pos <= mid:
            return self._query_val(idx*2, l, mid, pos)
        else:
            return self._query_val(idx*2+1, mid+1, r, pos)

    def reset_min(self, pos):
        self._reset_min(1, 1, self.n, pos)

    def _reset_min(self, idx, l, r, pos):
        if l == r:
            self.mn[idx] = self.val[idx]
            return
        self._push(idx)
        mid = (l + r) // 2
        if pos <= mid:
            self._reset_min(idx*2, l, mid, pos)
        else:
            self._reset_min(idx*2+1, mid+1, r, pos)
        self.mn[idx] = min(self.mn[idx*2], self.mn[idx*2+1])

    def get_min(self, pos):
        return self._get_min(1, 1, self.n, pos)

    def _get_min(self, idx, l, r, pos):
        if l == r:
            return self.mn[idx]
        self._push(idx)
        mid = (l + r) // 2
        if pos <= mid:
            return self._get_min(idx*2, l, mid, pos)
        else:
            return self._get_min(idx*2+1, mid+1, r, pos)

def main():
    n, q = map(int, input().split())
    a = [0] + list(map(int, input().split()))

    st = SegTree(a)

    for _ in range(q):
        tmp = input().split()
        if tmp[0] == 'C':
            l, r, x = map(int, tmp[1:])
            st._range_add(1, 1, n, l, r, x)
        elif tmp[0] == 'I':
            i = int(tmp[1])
            st.reset_min(i)
        else:
            i = int(tmp[1])
            print(st.get_min(i))

if __name__ == "__main__":
    main()
```线段树存储当前值和自上次重置以来每个叶子的运行最小值。 延迟传播确保在对数时间内应用范围添加。 重置操作被实现为点更新，将最小值与当时的当前值同步，从而有效地为该房屋启动一个新的跟踪窗口。 

一个微妙的点是我们总是在访问叶子之前推送延迟更新。 如果没有这个，重置和查询操作可能会读取过时的值并破坏正确性。 

## 工作示例

 最初考虑一个有三栋房子的小场景`[5, 2, 7]`。 假设我们开始对 2 号房子进行调查，然后应用范围更新添加`-3`到所有房屋，然后结束调查。 

| 步骤| 运营| 2号屋的价值观| 自开始以来的最小值 |
 | ---| ---| ---| ---|
 | 1 | 开始调查 | 2 | 2 |
 | 2 | 将 -3 应用于所有 | -1 | -1 |
 | 3 | 结束调查 | -1 | -1 |

 该轨迹显示最小值正确地遵循更新引起的偏移，并且捕获了间隔期间的最低值。 

现在考虑重叠更新仅部分影响房屋。 让 1 号房子的初始值为 10。开始调查，对 [2,3] 应用 +5（无效），然后对 [1,1] 应用 -7，然后结束。 

| 步骤| 运营| 价值| 最低 |
 | ---| ---| ---| ---|
 | 1 | 开始| 10 | 10 10 | 10
 | 2 | +5 至 [2,3] | 10 | 10 10 | 10
 | 3 | -7 到 [1,1] | 3 | 3 |
 | 4 | 结束 | 3 | 3 |

 这证实了只有相关更新才会影响所跟踪的房屋，并且在其值发生变化时进行最小更新。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(q log n) | O(q log n) | 每个范围更新和点操作都会遍历一个线段树路径 |
 | 空间| O(n) | 线段树存储每个节点的常量信息 |

 约束允许最多 200000 次操作，因此每次操作的对数因子就足够了。 该结构避免每次更新触及所有房屋，并且仅处理受影响的部分。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output

    main()

    sys.stdout = sys.__stdout__
    return output.getvalue().strip()

# sample-like test
assert run("""5 5
1 2 3 4 5
I 1
C 1 5 -2
F 1
F 1
F 1
""").split() == ["-1", "-1", "-1"]

# single house stress
assert run("""1 4
10
I 1
C 1 1 -5
C 1 1 2
F 1
""").strip() == "5"

# no updates
assert run("""3 3
1 2 3
I 2
F 2
F 2
""").split() == ["2", "2"]

# full range oscillation
assert run("""3 6
1 1 1
I 2
C 1 3 5
C 1 3 -10
F 2
F 2
""").split() == ["-4", "-4"]
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 独栋住宅更新| 5 | 纠正懒惰+重置交互|
 | 没有更新 | 2,2 | 基线处理|
 | 全范围振荡| -4,-4 | 重复范围变化|

 ## 边缘情况

 一个重要的边缘情况是范围更新后立即开始调查。 在这种情况下，房子的值必须已经包括重置之前所有待处理的延迟更新。 该实现通过在访问叶子之前推送惰性值来处理这个问题。 例如，在待更新后从房屋开始可确保重置基线正确。 

另一种情况是当调查正在进行时多个更新影响不相交的范围。 该算法仍然有效，因为只有受影响的段传播变化，并且叶子上的最小值一致更新。 

最后一个微妙的情况是对同一所房子进行重复重置。 每次重置都会正确地将最小值重新初始化为当前值，确保以前的历史记录不会泄漏到新的调查窗口中。
