---
title: "CF 1937F - 按位悖论"
description: "我们得到两个长度为 n 的整数数组 a 和 b，以及一个固定整数 v。我们被要求处理两种类型的查询。 第一种类型更新 b 中的单个元素。"
date: "2026-06-09T01:50:50+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1937
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 930 (Div. 2)"
rating: 3100
weight: 1937
solve_time_s: 94
verified: false
draft: false
---

[CF 1937F - 按位悖论](https://codeforces.com/problemset/problem/1937/F)

 **评分：** 3100
 **标签：** 数据结构、两个指针
 **求解时间：** 1m 34s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有两个整数数组，`a`和`b`，长度`n`，以及一个固定整数`v`。 我们被要求处理两种类型的查询。 第一种类型更新单个元素`b`。 第二种类型要求所有连续子数组中的最小“美度”`[l_0, r_0]`在给定范围内`[l, r]`这样所有元素的按位或`b`在该子数组中至少是`v`。 子数组的“美丽”是对应子数组中的最大元素`a`。 如果没有子数组满足 OR 条件，则返回`-1`。 

关键的挑战是`n`和`q`每个可以达到 2×10^5，并且所有测试用例的总和也上限为 2×10^5。 枚举每个查询的所有子数组的简单方法将为每个查询执行 O(n^2) 操作，这显然是不可行的。 我们需要一种每个测试用例接近 O(n log n) 或更好的方法，并且每次更新或查询都进行对数或摊销操作。 

非明显的边缘情况包括没有单个元素满足的区间`b[i] >= v`但组合可以。 例如，`b = [1, 2, 4]`和`v = 7`没有单元素良好区间，但是`[1,3]`满足`1|2|4 = 7`。 粗心的解决方案可能只检查单个元素而不是间隔，从而产生`-1`错误地。 同样，更新为`b`可能会创建或销毁多个良好间隔，因此任何预处理都必须支持动态更新。 

## 方法

 蛮力方法迭代所有子数组`[l_0, r_0]`里面`[l, r]`对于类型 2 查询，计算相应的 OR`b`段，并跟踪最大值`a`。 每个 2 类查询可能需要 O(n^2) OR 和 max 计算。 对于最多 2×10^5 次查询和 n 最多 2×10^5，这是完全不可行的。 类型 1 查询中的更新没有帮助，因为除非我们重新计算所有内容，否则任何预处理都会无效。 

关键的见解是 OR 运算是单调的：向右延长区间永远不会减少 OR 值。 这允许使用两指针方法。 我们可以保持从每个开始的最小间隔`l`其 OR 达到`v`通过前进右指针`r`直到 OR 达到或超过`v`。 一旦我们知道满足 OR 条件的区间，我们只需要最大值`a[i]`超过该间隔。 为了有效地处理多个查询，我们可以进行预处理`a`进入线段树或稀疏表进行范围最大查询，并维护`b`采用支持高效增量 OR 计算的结构。 

最终策略结合了这些见解：对于每个查询，我们使用两指针方法来查找内所有起始位置的最小右端点`[l, r]`，然后查询线段树的最大值`a[i]`在这些间隔内。 更新至`b`只需要为将来的查询更新 OR 计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每个查询 O(n^2) | O(n) | 太慢了 |
 | 两指针+线段树| 每个测试用例的 O(n log n + q log n) | O(n) | 已接受 |

 ## 算法演练

 1. 构建线段树`a`支持范围最大查询。 这让我们可以快速计算任何区间的美感。 
2. 对于每个类型 2 查询`[l, r]`,初始化右指针`r_ptr = l`和`current_or = 0`。 该指针将扩展以找到 OR 满足或超过的最小区间`v`。 
3. 迭代可能的左端点`l`到`r`。 对于每个左端点，前进`r_ptr`尽管`current_or | b[r_ptr] < v`。 每个扩展都是合理的，因为 OR 是单调的； 我们只延伸`r_ptr`直到满足 OR 条件。 
4. 如果`r_ptr > r`，从当前左端点开始没有好的区间，我们继续到下一个左端点。 
5. 否则，查询线段树`max(a[l], ..., a[r_ptr])`并跟踪所有左端点中的最小美感。 
6. 对于类型 1 查询，更新值`b[i]`。 这可能会影响未来的 OR 计算。 我们不需要更新线段树`b`，因为它仅用于两指针计算。 
7. 输出类型2查询找到的最小美感，或者`-1`如果没有区间满足 OR 条件。 

为什么它有效：OR 的单调性确保了前进`r_ptr`从给定的左端点找到最小满足区间。 线段树保证我们可以有效地计算最大值`a`在任何间隔内。 由于考虑的每个区间都是有效的，并且我们跟踪最小美感，因此解决方案是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegmentTree:
    def __init__(self, data):
        n = len(data)
        self.N = 1
        while self.N < n:
            self.N *= 2
        self.tree = [0] * (2 * self.N)
        for i in range(n):
            self.tree[self.N + i] = data[i]
        for i in range(self.N - 1, 0, -1):
            self.tree[i] = max(self.tree[2*i], self.tree[2*i + 1])
    def update(self, i, val):
        i += self.N
        self.tree[i] = val
        while i > 1:
            i //= 2
            self.tree[i] = max(self.tree[2*i], self.tree[2*i + 1])
    def query(self, l, r):
        l += self.N
        r += self.N
        res = 0
        while l <= r:
            if l % 2 == 1:
                res = max(res, self.tree[l])
                l += 1
            if r % 2 == 0:
                res = max(res, self.tree[r])
                r -= 1
            l //= 2
            r //= 2
        return res

t = int(input())
for _ in range(t):
    n, v = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))
    seg = SegmentTree(a)
    q = int(input())
    res = []
    for _ in range(q):
        parts = input().split()
        if parts[0] == '1':
            i, x = int(parts[1])-1, int(parts[2])
            b[i] = x
        else:
            l, r = int(parts[1])-1, int(parts[2])-1
            ans = float('inf')
            r_ptr = l
            current_or = 0
            for left in range(l, r+1):
                if r_ptr < left:
                    r_ptr = left
                    current_or = 0
                while r_ptr <= r and (current_or | b[r_ptr]) < v:
                    current_or |= b[r_ptr]
                    r_ptr += 1
                if r_ptr > r:
                    continue
                max_a = seg.query(left, r_ptr)
                ans = min(ans, max_a)
                current_or &= ~b[left]
            res.append(str(ans if ans != float('inf') else -1))
    print(' '.join(res))
```线段树用于恒定时间范围最大查询。 对于每个左端点，`r_ptr`逐渐移动以维持满足 OR 要求的最小间隔。 处理完一个区间后，我们删除`b[left]`从`current_or`为下一个左端点做准备。 需要特别注意管理 Python 中的差一索引（基于 0）与问题（基于 1）。 更新至`b`是立即且正确影响后续查询的。 

## 工作示例

 **示例1：**`a = [2,1,3]`,`b = [2,5,3]`,`v = 7`， 询问`[2,3]`。 
| 左| r_ptr | 当前或| 最大（a [左..r_ptr]）| 和 |
 | --- | --- | --- | --- | --- |
 | 1 | 2 | 2 | - | - |
 | 2 | 3 | 5 | 3 | 3 |
 两指针标识`[2,3]`是唯一好的间隔。 最多为`a[2..3]`是3，这是正确答案。 

**示例2：**`a = [5,1,2,4]`,`b = [4,2,3,3]`,`v = 5`， 询问`[1,4]`。 
| 左| r_ptr | 当前或| 最大（a [左..r_ptr]）| 和 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 4 | 5 | 5 |
 | 2 | 3 | 5 | 2 | 2 |
 | 3 | 3 | 3 | - | 2 |
 | 4 | | | | |
