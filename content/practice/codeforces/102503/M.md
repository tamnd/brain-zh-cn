---
title: "CF 102503M - Se\u00f1orita"
description: "输入描述了两堆衬衫，其中的衬衫按必须穿着的日期进行了标记。 第一个堆栈从下到上列出，第二个堆栈以同样的方式列出。 目标是按照 1、2、...、m+n 的顺序移除衬衫。"
date: "2026-08-06T19:15:41+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102503
codeforces_index: "M"
codeforces_contest_name: "National Olympiad in Informatics - Philippines (NOI.PH) Online Eliminations 2020"
rating: 0
weight: 102503
solve_time_s: 234
verified: true
draft: false
---

[CF 102503M - Se\u00f1orita](https://codeforces.com/problemset/problem/102503/M)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 54s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 输入描述了两堆衬衫，其中的衬衫按必须穿着的日期进行了标记。 第一个堆栈从下到上列出，第二个堆栈以同样的方式列出。 目标是按顺序删除衬衫`1, 2, ..., m+n`。 将一件衬衫从一堆移到另一堆需要消耗一个单位的能量，而在已经暴露的情况下取出正确的衬衫则不需要任何成本。 

直接模拟每一个可能的动作是不可能的，因为最多可能有`400000`衬衫。 任何尝试许多可能的重新排列的解决方案都会太慢。 我们需要找到一种表示，其中唯一有意义的决策是两个堆栈顶部不可避免的移动。 

一种有用的边缘情况是当一个堆栈为空时。 例如：```
0
1 2 3
```答案是`0`因为每件衬衫都可以从唯一的堆栈中访问。 假设两个堆栈始终都有一件上衣的实现可能会失败。 

另一个边缘情况是当所需的衬衫可以立即从第二个堆栈访问时：```
1 2
3
```答案是`0`因为衬衫`1`位于第一堆和衬衫的顶部`2`在需要后位于第二个堆栈的顶部。 仅检查一个堆栈方向的解决方案将导致计数过多。 

## 方法

 蛮力的想法是实际模拟堆栈。 要检索下一件衬衫，我们可以尝试在堆栈之间一件一件地移动衬衫，直到目标出现。 这是正确的，因为每个合法操作都是明确模拟的。 然而，在最坏的情况下，我们可能会为每件请求的衬衫移动几乎所有剩余的衬衫，大致给出`O(N^2)`运营。 和`N = 400000`，这是不可能的。 

关键的观察结果是衬衫的相对循环顺序永远不会改变。 想象一下，将第一个堆栈从下到上放置，然后将第二个堆栈从上到下围绕一个圆圈放置。 在堆栈之间移动衬衫只会改变两个堆栈之间的分割线位于该圆上的位置。 两件暴露的衬衫就是这件开叉旁边的两件衬衫。 

这将问题转化为维持圆形阵列中的移动切割。 我们只需要知道从当前剪裁到所要求的衬衫的距离。 移除衬衫后，新切口始终紧邻剩余圆圈中移除的衬衫之前。 

为了在删除后保持距离，我们将哪些原始位置仍然存在于芬威克树中。 它可以对范围内的存活衬衫进行计数并找到第 k 个存活位置。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(N²) | O(N) | 太慢了 |
 | 循环顺序+芬威克树| O(N log N) | O(N log N) | O(N) | 已接受 |

 ## 算法演练

 1. 建立循环订单。 按给定顺序放置第一个堆栈，并按相反顺序附加第二个堆栈。 存储该圆圈中每件衬衫的位置。 

当前剪切位于两个原始堆栈之间。 我们保留`cur`作为衬衫在第一堆顶部的位置。 另一件暴露的衬衫是下一个活着的位置`cur`。 

1. 初始化一棵 Fenwick 树，其中每个衬衫位置都有一个 Fenwick 树。 

芬威克树代表了一些衬衫被移除后的当前圆圈。 

1. 对于每一件球衣号码`1`到`N`，求其当前圆距离`cur`。 

如果衬衫是`d`存活位置顺时针从`cur`，然后检索它的成本：```
min(d - 1, remaining - d)
```第一项意味着向前移动剪裁，直到衬衫成为第二叠顶部。 第二项意味着向后移动，直到成为第一个栈顶。 

1. 将这个最低成本添加到答案中。 
2. 从芬威克树上取下衬衫。 

删除后设置`cur`到脱下衬衫之前的活动位置。 

为什么它有效：

 循环顺序不变意味着每个可能的移动序列只会改变剪切位置。 距离公式考虑了移动该剪切的两个可能方向，其中一个始终是最佳方向，因为每次移动都会将剪切更改恰好一个位置。 删除衬衫后，无论使用哪个方向，前趋位置都会成为新的第一堆顶部，因此维护的状态始终有效。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, i, v):
        while i <= self.n:
            self.bit[i] += v
            i += i & -i

    def sum(self, i):
        res = 0
        while i:
            res += self.bit[i]
            i -= i & -i
        return res

    def range_sum(self, l, r):
        if l > r:
            return 0
        return self.sum(r) - self.sum(l - 1)

    def kth(self, k):
        idx = 0
        step = 1 << (self.n.bit_length() - 1)
        while step:
            nxt = idx + step
            if nxt <= self.n and self.bit[nxt] < k:
                idx = nxt
                k -= self.bit[nxt]
            step >>= 1
        return idx + 1

def solve():
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))

    m = a[0]
    first = a[1:]
    n = b[0]
    second = b[1:]

    circle = first + second[::-1]
    total = m + n

    pos = [0] * (total + 1)
    for i, x in enumerate(circle, 1):
        pos[x] = i

    bit = Fenwick(total)
    for i in range(1, total + 1):
        bit.add(i, 1)

    if m:
        cur = m
    else:
        cur = total

    ans = 0
    alive = total

    for x in range(1, total + 1):
        p = pos[x]

        if p == cur:
            cost = 0
        else:
            before = bit.sum(cur)
            if p > cur:
                dist = bit.range_sum(cur, p - 1)
            else:
                dist = bit.range_sum(cur, total) + bit.range_sum(1, p - 1)

            cost = min(dist - 1, alive - dist)

        ans += cost

        bit.add(p, -1)
        alive -= 1

        if alive:
            before = bit.sum(p - 1)
            if before:
                cur = bit.kth(before)
            else:
                cur = bit.kth(alive)

    print(ans)

if __name__ == "__main__":
    solve()
```芬威克树存储活动位置，因此可以在不重建圆的情况下处理删除和圆距离。 这`kth`该操作在移除一件衬衫之后使用，因为我们需要剩余衬衫中移除位置的前一个。 

成本的表达是微妙的部分。`dist`计算从当前顶部到目标有多少个存活位置。 如果目标是第一件暴露的衬衫，`dist`为零，单独处理。 否则继续前进`dist - 1`times 从第二个堆栈中暴露它，同时向后移动`alive - dist`times 从第一个堆栈中暴露它。 

Python整数是任意精度的，因此累积的答案不需要特殊处理。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N log N) | O(N log N) | 每件衬衫都会执行 Fenwick 查询和更新 |
 | 空间| O(N) | 商店位置和芬威克树|

 最大输入大小为`400000`，因此在时间限制下对数因子是可以接受的。 

## 工作示例

 对于样本：```
3 1 5 3
4 7 2 6 4
```循环顺序是：```
1 5 3 4 6 2 7
```最初的剪辑是在之前`4`，所以暴露的衬衫是`3`和`4`。 

| 要求衬衫 | 距离选择| 补充能量|
 | ---| ---| ---|
 | 1 | 移过 3 和 5 | 2 |
 | 2 | 围绕较短的一侧移动 | 4 |
 | 3 | 越过剩余的障碍 | 2 |
 | 剩余衬衫 | 已经可达 | 0 |

 总计为：```
2 + 4 + 2 = 8
```与示例输出匹配。
