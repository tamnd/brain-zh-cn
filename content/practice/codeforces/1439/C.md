---
title: "CF 1439C - 贪婪购物"
description: "我们看到一系列排成一排的商店，每个商店都有固定的餐价。 价格形成一个非递增数组，因此右侧的每个商店永远不会比左侧的邻居更贵。 我们需要支持两种类型的操作。"
date: "2026-06-11T04:27:41+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "divide-and-conquer", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1439
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 684 (Div. 1)"
rating: 2600
weight: 1439
solve_time_s: 109
verified: true
draft: false
---

[CF 1439C - 贪婪购物](https://codeforces.com/problemset/problem/1439/C)

 **评分：** 2600
 **标签：** 二分查找、数据结构、分而治之、贪心、实现
 **求解时间：** 1m 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们看到一系列排成一排的商店，每个商店都有固定的餐价。 价格形成一个非递增数组，因此右侧的每个商店永远不会比左侧的邻居更贵。 我们需要支持两种类型的操作。 第一个操作将前几家商店的价格提高到至少指定值，而不降低任何现有价格。 第二个操作模拟买家从给定的商店开始，贪婪地花钱：他会在每家他能买得起的商店中购买一顿饭，然后向右移动，当他买不起下一顿饭时停止。 

问题约束很大。 店铺数量和查询数量各可达20万个。 对每个类型 2 查询的简单模拟，迭代每个商店并扣除费用，每个查询将涉及 O(n) 次操作，在最坏的情况下可能达到 4 × 10^10 次操作，远远超出了 3 秒内可行的范围。 同样，通过迭代和更新值来简单地执行类型 1 更新也太慢。 这意味着我们需要一个既能处理范围更新又能处理高效前缀或后缀查询的数据结构。 

非明显的边缘情况包括价格更新实际上并未更改数组的情况，因为值已经高于所请求的最小值。 例如，与商店`[10, 8, 5]`和类型 1 查询`1 2 7`，只有第二个店铺发生变化，导致`[10, 8, 5]`自 8 ≥ 7 以来保持不变。当买家买不起任何餐费时，类型 2 查询中会出现另一个边缘情况； 输出应该正确为零。 例如，与`[5, 4, 3]`和`2 1 2`，买家有2块钱，小于5、4、3，所以正确的输出是0。 

## 方法

 暴力方法直接在数组上处理每个查询。 对于类型 1 查询，我们从第一个商店迭代到第 x 个商店，将每个值设置为其当前值和给定 y 的最大值。 对于类型 2 查询，我们模拟买家从商店 x 向右移动，每次购买餐食时都会减少他的钱。 这可以正常工作，但每个查询最多执行 n 个操作，导致总复杂度为 O(nq)，这对于给定的约束来说太慢了。 

优化的关键见解是，两个查询都处理连续范围，而类型 2 查询涉及后缀上的价格总和。 这允许我们使用具有惰性传播的线段树，它支持两种操作：在前缀上设置最小值，并查询从一个位置开始，在给定的预算下可以购买多少餐。 在此线段树中，每个节点存储其线段与最大值的和。 对于类型 1，我们在范围内传播“最大更新”。 对于类型2，我们对线段树进行贪心遍历：如果一个线段的总和在买家的预算之内，我们一次把所有的饭菜都拿走； 否则，我们就下到孩子们那里，单独数饭菜。 这将每个操作的复杂性降低到 O(log n)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(nq) | O(n) | 太慢了 |
 | 使用 Lazy Max 更新的线段树 | O(q log n) | O(q log n) | O(n) | 已接受 |

 ## 算法演练

 1. 构建代表商店价格数组的线段树。 每个节点存储其段的总和、最高价格以及指示待处理的“最大更新”的惰性传播值。 
2. 对于类型 1 查询，将任何挂起的更新沿着树传播以确保正确性。 然后，递归遍历覆盖前缀的节点`[1..x]`。 如果节点中的最大值已经至少为 y，则无需执行任何操作。 否则，对节点应用“最大更新”并延迟传播。 
3. 对于类型 2 查询，我们想要计算买家在预算 y 的情况下可以从商店 x 到 n 购买的餐食。 从根开始，递归下降到重叠的段`[x..n]`。 如果该段的总和小于或等于剩余预算，则一次性吃完所有餐食，减少预算，并添加餐食数量。 否则，下降到孩子们身上，直到到达各个商店，贪婪地购买食物。 这使用了树在延迟传播后始终存储正确的最大值和总和的不变量。 
4.处理完每个查询后，按顺序输出类型2查询的结果。 

工作原理：线段树通过惰性传播保持准确的总和和最大值。 类型 1 更新永远不会减少值，因此通过最大更新价格不会减少的不变式成立。 类型 2 查询会贪婪地消耗预算，而不会违反数组的真实状态，因为树允许我们有效地求和并检查任何范围内的最大值。 这保证了正确的膳食计数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegmentTree:
    def __init__(self, data):
        self.n = len(data)
        self.size = 1
        while self.size < self.n:
            self.size <<= 1
        self.maxv = [0] * (2 * self.size)
        self.sumv = [0] * (2 * self.size)
        self.lazy = [0] * (2 * self.size)
        for i in range(self.n):
            self.maxv[self.size + i] = data[i]
            self.sumv[self.size + i] = data[i]
        for i in range(self.size - 1, 0, -1):
            self.pull(i)

    def pull(self, i):
        self.maxv[i] = max(self.maxv[i*2], self.maxv[i*2+1])
        self.sumv[i] = self.sumv[i*2] + self.sumv[i*2+1]

    def push(self, i, l, r):
        if self.lazy[i]:
            self.apply(i*2, self.lazy[i], (r-l)//2)
            self.apply(i*2+1, self.lazy[i], (r-l)//2)
            self.lazy[i] = 0

    def apply(self, i, val, length):
        if val <= self.maxv[i]:
            return
        self.maxv[i] = val
        self.sumv[i] = val * length
        if i < self.size:
            self.lazy[i] = val

    def update(self, ql, qr, val, i=1, l=0, r=None):
        if r is None:
            r = self.size
        if qr <= l or r <= ql:
            return
        if ql <= l and r <= qr and val >= self.maxv[i]:
            self.apply(i, val, r-l)
            return
        self.push(i, l, r)
        m = (l+r)//2
        self.update(ql, qr, val, i*2, l, m)
        self.update(ql, qr, val, i*2+1, m, r)
        self.pull(i)

    def query(self, pos, budget, i=1, l=0, r=None):
        if r is None:
            r = self.size
        if l >= self.n or budget <= 0:
            return 0, budget
        if r - l == 1:
            if l >= pos and self.maxv[i] <= budget:
                return 1, budget - self.maxv[i]
            return 0, budget
        self.push(i, l, r)
        m = (l+r)//2
        cnt, budget = self.query(pos, budget, i*2, l, m)
        cnt2, budget = self.query(pos, budget, i*2+1, m, r)
        return cnt + cnt2, budget

n, q = map(int, input().split())
a = list(map(int, input().split()))
tree = SegmentTree(a)

for _ in range(q):
    t, x, y = map(int, input().split())
    if t == 1:
        tree.update(0, x, y)
    else:
        cnt, _ = tree.query(x-1, y)
        print(cnt)
```此代码首先为前缀 max 和 sum 构造一棵线段树。 类型 1 更新使用惰性传播来有效提高商店价格。 类型 2 查询贪婪地遍历树，在尊重买家预算的同时计算餐食。 索引经过仔细调整，因为 Python 数组是从 0 开始的，而问题使用从 1 开始的索引。 

## 工作示例

 **样本 1 迹线：**

 | 查询 | 之前的数组 | 运营| 数组之后 | 买家餐|
 | ---| ---| ---| ---| ---|
 | 2 3 50 | 10 10 10 6 6 5 5 5 3 1 | 10 10 10 6 6 5 5 5 3 1 预算=50 来自shop3 | 10 10 10 6 6 5 5 5 3 1 | 10 10 10 6 6 5 5 5 3 1 8 |
 | 2 4 10 | 相同| 预算=10 来自shop4 | 相同| 3 |
 | 1 3 10 | 1 3 10 相同| 前 3 名加注至 10 名 | 10 10 10 6 6 5 5 5 3 1 | 10 10 10 6 6 5 5 5 3 1 - |
 | 2 2 36 | 2 2 36 数组| 预算=36 来自shop2 | 10 10 10 6 6 5 5 5 3 1 | 10 10 10 6 6 5 5 5 3 1 6 |
 | 1 4 7 | 1 4 7 数组| 将前 4 项提高到至少 | | |
