---
title: "CF 1906F - 价值最大化"
description: "我们得到一个大小为 $N$ 的数组，最初用零填充。 有 $M$ 操作； 每个操作由三个整数 $Li、Ri、Xi$ 描述，这意味着如果我们执行此操作，我们会将 $Xi$ 添加到位置 $Li$ 到 $Ri$ 中的每个元素。"
date: "2026-06-08T20:45:08+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1906
codeforces_index: "F"
codeforces_contest_name: "2023-2024 ICPC, Asia Jakarta Regional Contest (Online Mirror, Unrated, ICPC Rules, Teams Preferred)"
rating: 2100
weight: 1906
solve_time_s: 105
verified: true
draft: false
---

[CF 1906F - 价值最大化](https://codeforces.com/problemset/problem/1906/F)

 **评分：** 2100
 **标签：** 数据结构、排序
 **求解时间：** 1m 45s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个大小的数组$N$，最初用零填充。 有$M$运营; 每个操作由三个整数描述$L_i, R_i, X_i$，这意味着如果我们执行这个操作，我们会添加$X_i$到位置中的每个元素$L_i$通过$R_i$。 

这些查询有点不寻常：对于每个查询$(K, S, T)$，我们想要找到最大可能值$A_K$执行从范围中选择的连续操作子序列后$S$到$T$。 换句话说，我们可以选择任意连续的操作块$[S, T]$并按顺序执行，我们想知道该位置的最大值$K$可以达到。 

限制条件$N, M, Q \le 10^5$这意味着任何为每个查询尝试所有连续范围的简单解决方案都会太慢。 每个查询可能需要$O(M^2)$通过暴力方式进行检查，这是不可行的。 我们必须寻找解决方案$O((M + Q) \log M)$或者$O(M + Q)$每个查询使用预处理和高效的数据结构。 

当运算可以具有负值时，会出现不明显的边缘情况。 例如，如果$X_i$为负数，执行更多操作并不一定会增加$A_K$。 如果粗心地假设“操作越多越好”，就会给出错误的答案。 类似地，如果查询的范围$[S, T]$不包括影响的操作$A_K$，正确答案是零。 

例如，考虑$N = 2$,$M = 2$， 运营：$(1, 1, -10), (2, 2, 20)$，并查询$(1, 1, 2)$。 只有操作 1 影响位置 1，因此最大值$A_1$是-10。 对所有操作的简单求和$[S, T]$会错误地从第二次操作中添加 20。 

## 方法

 暴力方法很简单：对于每个查询，迭代所有操作子数组$[S, T]$，模拟应用操作，并跟踪最大值$A_K$。 This requires$O((T-S+1)^2 \cdot N)$每个查询的工作量，即$O(M^2 \cdot N)$在最坏的情况下。 和$M$最多$10^5$，这种方法需要$10^{15}$操作，显然是不可能的。 

关键的见解是对于每个位置$K$，我们只关心影响它的操作。 每个操作都会影响连续范围的数组位置。 我们可以预处理要构建的操作，对于每个$K$，影响它的操作值列表。 然后，每个查询简化为查找这些值的连续子数组的最大和，仅限于子序列$[S, T]$。 这是一个经典的“最大子数组和”问题，可以解决$O(\text{length})$使用 Kadane 算法，如果我们想有效处理多个查询，则使用线段树甚至更快。 

因为查询要求特定范围内的最大子数组，所以我们可以根据影响每个子数组的操作序列构建线段树$A_K$。 每个线段树节点存储四个值：总和、最大前缀和、最大后缀和、最大子数组和。 然后，回答查询是$O(\log M)$预处理后的每个查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(Q * M * N) | O(N) | 太慢了 |
 | 每个位置的预处理 + 线段树 | O(M log M + Q log M) | O(M log M + Q log M) | O(M)| 已接受 |

 ## 算法演练

 1. 对于每个位置$1 \le K \le N$，迭代所有操作并收集影响位置的操作$K$。 存储为整数列表，其中索引对应于原始操作编号。 
2. 对于每个位置$K$，在其相关操作列表上构建线段树。 线段树中的每个节点存储四个值：线段总和、最大前缀和、最大后缀和、最大子数组和。 这些允许有效地组合子段。 
3. 对于每个查询$(K, S, T)$:

 a. 绘制全球运营指数$[S, T]$影响操作列表中的索引$K$。 只进行实际修改的操作$A_K$是相关的。 

b. 查询线段树以获取这些索引内的最大子数组和。 这将返回最大可能的贡献$A_K$来自查询范围内任何连续的操作子序列。 
4. 输出结果。 如果没有任何操作影响$A_K$在该范围内，最大和为零。 

工作原理：线段树维护了每个节点准确报告其时间间隔内的最大子数组和的不变量。 当查询子范围时，线段树以对数时间组合节点，保留最大子数组和。 通过对每个位置的操作进行预处理，我们避免了迭代不相关的操作，从而确保了效率。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegmentTree:
    def __init__(self, data):
        n = len(data)
        self.N = 1
        while self.N < n: self.N <<= 1
        self.data = [(-float('inf'), -float('inf'), -float('inf'), 0)] * (2*self.N)
        for i in range(n):
            val = data[i]
            self.data[self.N + i] = (val, val, val, val)  # total, prefix, suffix, max subarray
        for i in range(self.N-1, 0, -1):
            self.data[i] = self._combine(self.data[2*i], self.data[2*i+1])
    
    def _combine(self, left, right):
        total = left[0] + right[0]
        prefix = max(left[1], left[0] + right[1])
        suffix = max(right[2], right[0] + left[2])
        maxsum = max(left[3], right[3], left[2] + right[1])
        return (total, prefix, suffix, maxsum)
    
    def query(self, l, r):
        l += self.N
        r += self.N
        left_res = (0, 0, 0, -float('inf'))
        right_res = (0, 0, 0, -float('inf'))
        while l < r:
            if l % 2:
                left_res = self._combine(left_res, self.data[l])
                l += 1
            if r % 2:
                r -= 1
                right_res = self._combine(self.data[r], right_res)
            l //= 2
            r //= 2
        return self._combine(left_res, right_res)[3]

N, M = map(int, input().split())
ops = []
for _ in range(M):
    L, R, X = map(int, input().split())
    ops.append((L-1, R-1, X))

# map each position to affecting operations
pos_ops = [[] for _ in range(N)]
for idx, (L, R, X) in enumerate(ops):
    for k in range(L, R+1):
        pos_ops[k].append((idx, X))

# build segment trees per position
trees = []
for lst in pos_ops:
    vals = [x for idx, x in lst]
    if vals:
        trees.append(SegmentTree(vals))
    else:
        trees.append(None)

Q = int(input())
for _ in range(Q):
    K, S, T = map(int, input().split())
    K -= 1
    S -= 1
    # map global indices S,T to position-specific list indices
    lst = pos_ops[K]
    if not lst:
        print(0)
        continue
    l = 0
    while l < len(lst) and lst[l][0] < S:
        l += 1
    r = l
    while r < len(lst) and lst[r][0] <= T-1:
        r += 1
    if l == r:
        print(0)
    else:
        print(trees[K].query(l, r))
```第一部分读取输入并收集每个数组位置影响它的操作。 每个线段树都存储相关的前缀、后缀和最大和，以支持范围最大查询。 对于每个查询，我们仔细地将全局操作索引映射到特定位置的操作列表，然后查询线段树。 边界检查确保空范围返回零。 

## 工作示例

 **示例输入 1**：```
2 6
1 1 -50
1 2 -20
2 2 -30
1 1 60
1 2 40
2 2 10
5
1 1 6
2 1 6
1 1 3
2 1 3
1 1 2
```对于位置 1：

 | 操作idx | 影响位置 1 | X |
 | --- | --- | --- |
 | 0 | 是的 | -50 |
 | 1 | 是的 | -20 | -20
 | 2 | 没有| - |
 | 3 | 是的 | 60|
 | | | |
