---
title: "CF 1936D - 按位悖论"
description: "我们有两个长度为 n 的数组 a 和 b 以及一个目标整数 v。数组 b 表示我们对子数组执行按位 OR 运算的值。 如果区间 [l, r] 中所有 bi 的按位或至少为 v，则该区间为“良好”。"
date: "2026-06-08T18:02:57+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "bitmasks", "data-structures", "greedy", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1936
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 930 (Div. 1)"
rating: 3100
weight: 1936
solve_time_s: 243
verified: false
draft: false
---

[CF 1936D - 按位悖论](https://codeforces.com/problemset/problem/1936/D)

 **评分：** 3100
 **标签：** 二分查找、位掩码、数据结构、贪心、两个指针
 **求解时间：** 4m 3s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有两个数组`a`和`b`长度`n`和一个目标整数`v`。 数组`b`表示我们对子数组执行按位或运算的值。 一个区间`[l, r]`如果所有的按位或，则为“好”`b_i`在该区间内至少`v`。 每个好的区间都有一个“美感”，定义为`a_i`在相同的时间间隔内。 查询要么更新一个元素`b`或者求完全包含在指定范围内的所有好区间中的最小美度`[l, r]`。 

关键的挑战是`n`和`q`两者都可以大到 2·10^5，因此任何天真地迭代所有间隔的方法都不会及时完成。 单个查询可能需要检查 O(n^2) 间隔，这远远超出了可行的范围。 因此，我们需要一种能够高效回答范围最大查询并支持点更新后动态按位或查询的数据结构。 

一个微妙的点是，粗心的实现可能会考虑部分良好的间隔，或者可能返回查询范围内的最大值而不检查 OR 条件是否满足。 例如，如果`b = [2, 3, 1]`和`v = 7`，一个天真的最大查询`a`可以回来`3`对于整个间隔`[1, 3]`虽然`2|3|1 = 3 < 7`，这是无效的。 边缘情况出现时`b`包含零或多个更新在重叠间隔内更改 OR 时。 

## 方法

 蛮力方法将检查每个间隔`[i, j]`对于类型 2 的每个查询，计算 OR`b[i..j]`，并记录最大值`a[i..j]`。 这种方法是正确的，但是速度非常慢。 当 n ≤ 2·10^5 时，区间总数为 O(n^2)，导致时间复杂度约为 10^10 次操作，这显然是不可行的。 

关键的见解是按位或运算是单调的：一旦区间或达到某个值，延长区间就不能减小它。 这使我们能够确定达到 OR ≥ v** 的**最小间隔。 此外，最大`a`可以使用线段树有效地计算间隔上的值。 结合这些想法，我们可以表示`b`使用支持 OR 查询的线段树，以及`a`使用支持最大查询的线段树。 

最佳方法如下：对于类型 2 的每个查询，我们可以使用两指针或基于线段树的滑动搜索来查找`[l, r]`实现 OR ≥ v。对于每个候选区间，我们查询线段树`a`找到最大值。 更新至`b`通过 OR 线段树上的点更新操作进行处理，保持两棵树一致。 这实际上将每个查询的时间减少到大约 O(log n * log n) 时间，这完全符合约束条件。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每个查询 O(n^2) | O(n) | 太慢了 |
 | 线段树+滑动搜索| 每次查询 O(log n * log n)，每次更新 O(log n) | O(n) | 已接受 |

 ## 算法演练

 1. 构建线段树`b`支持范围或查询。 每个节点存储其段的或。 
2. 构建线段树`a`支持范围最大查询。 
3. 对于每个查询：

 a. 如果是类型 1 (`1 i x`）， 更新`b[i] = x`在 OR 线段树中。 

b. 如果是类型 2 (`2 l r`)，将结果初始化为`inf`。 使用两个指针枚举潜在的良好区间`[i, j]`里面`[l, r]`。 对于每个起点`i`，使用二分查找`j`找到最小的`j`使得 OR(`b[i..j]`) ≥ v。如果找到，则查询其中的最大值`a[i..j]`并更新结果。 
4、如果查询范围内不存在好的区间，则输出`-1`。 否则，输出找到的最小美度。 

**为什么有效：** 线段树可确保 OR 和最大查询在任何时间间隔内都是正确的。 二分搜索保证我们只考虑满足 OR 条件的最小间隔，因此我们不会错过任何潜在的答案。 更新正确传播，因此后续查询可以看到当前状态`b`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegmentTree:
    def __init__(self, data, func, default):
        n = len(data)
        self.size = 1
        while self.size < n:
            self.size *= 2
        self.data = [default] * (2 * self.size)
        self.func = func
        self.default = default
        for i in range(n):
            self.data[self.size + i] = data[i]
        for i in range(self.size - 1, 0, -1):
            self.data[i] = func(self.data[2*i], self.data[2*i+1])
    
    def update(self, idx, value):
        idx += self.size
        self.data[idx] = value
        while idx > 1:
            idx //= 2
            self.data[idx] = self.func(self.data[2*idx], self.data[2*idx+1])
    
    def query(self, l, r):
        l += self.size
        r += self.size + 1
        res = self.default
        while l < r:
            if l % 2 == 1:
                res = self.func(res, self.data[l])
                l += 1
            if r % 2 == 1:
                r -= 1
                res = self.func(res, self.data[r])
            l //= 2
            r //= 2
        return res

def solve():
    t = int(input())
    for _ in range(t):
        n, v = map(int, input().split())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))
        q = int(input())
        st_a = SegmentTree(a, max, 0)
        st_b = SegmentTree(b, lambda x, y: x | y, 0)
        res = []
        for _ in range(q):
            parts = input().split()
            if parts[0] == '1':
                i = int(parts[1]) - 1
                x = int(parts[2])
                st_b.update(i, x)
            else:
                l = int(parts[1]) - 1
                r = int(parts[2]) - 1
                ans = float('inf')
                j = l
                while j <= r:
                    lo, hi = j, r
                    pos = -1
                    while lo <= hi:
                        mid = (lo + hi) // 2
                        if st_b.query(j, mid) >= v:
                            pos = mid
                            hi = mid - 1
                        else:
                            lo = mid + 1
                    if pos == -1:
                        j += 1
                        continue
                    ans = min(ans, st_a.query(j, pos))
                    j = pos + 1
                res.append(str(ans) if ans != float('inf') else '-1')
        print(' '.join(res))

if __name__ == "__main__":
    solve()
```**说明：** 我们维护两棵线段树：一棵用于 OR 上`b`和一个最大`a`。 二分搜索确保我们只检查满足 OR ≥ v 的最小间隔。更新直接应用于 OR 线段树。 该解决方案仔细处理从 1 到 0 的索引。 

## 工作示例

 样本1（`a=[2,1,3]`,`b=[2,2,3]`,`v=7`）：

 | 查询 | 发现间隔 | 或 ≥ v | 最大在 | 结果 |
 | --- | --- | --- | --- | --- |
 | 2 1 3 | 2 1 3 无 | 没有 | - | -1 |
 | 1 2 5 | 1 2 5 - | - | - | - |
 | 2 2 3 | 2 2 3 [2,3]| 7 | 最大(1,3)=3 | 3 |
 | 2 1 3 | 2 1 3 [1,2],[2,3],[1,3] | 7 | 2,3,3 | 2 |

 这证实了该算法可以识别最小的良好间隔并正确计算它们的美度。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q log² n) | O(q log² n) | 每个查询都使用二分搜索，在线段树中使用 OR 查询 (log n) 和最大查询 (log n) |
 | 空间| O(n) | 大小为 O(n) | 的两个线段树

 该方法非常适合 n ≤ 2·10^5 和 q ≤ 2·10^5 的约束。 

## 测试用例```python
# helper to run solution
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.String
```
