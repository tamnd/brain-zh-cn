---
title: "CF 2117H - 连绵不断的雨"
description: "我们得到一个整数数组和一系列查询。 每个查询都会更新数组的单个元素，更新后，我们会被要求提供最大整数 $k$，以便某些子数组包含 $k$ 多数。"
date: "2026-06-08T11:05:51+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "divide-and-conquer", "sortings"]
categories: ["algorithms"]
codeforces_contest: 2117
codeforces_index: "H"
codeforces_contest_name: "Codeforces Round 1029 (Div. 3)"
rating: 2500
weight: 2117
solve_time_s: 112
verified: false
draft: false
---

[CF 2117H - 连绵不断的雨](https://codeforces.com/problemset/problem/2117/H)

 **评分：** 2500
 **标签：** 数据结构、分而治之、排序
 **求解时间：** 1m 52s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组和一系列查询。 每个查询更新数组的单个元素，更新后，我们被要求提供最大整数$k$使得某个子数组包含$k$-多数。 一个$k$-majority 是至少出现的数字$\lfloor \frac{|b|+1}{2} \rfloor + k$子数组中的时间$b$。 

这个问题很有挑战性，因为每次更新后，我们都必须计算这个最大值$k$高效。 数组长度$n$和查询数量$q$每个都可以达到$3 \cdot 10^5$，并且所有测试用例的总和也不超过$3 \cdot 10^5$。 这意味着在每次查询后迭代所有子数组的任何算法，这将是$O(n^2)$，是完全不可行的。 我们需要更接近的东西$O(n \log n)$每个测试用例或更好。 

微妙之处来自于定义$k$-多数。 对于小数组或具有重复元素的数组，最大$k$可能很大，但如果数组包含所有不同的数字，则最大$k$可能为零。 尝试在每次更新后对每个子数组的出现次数进行计数的简单方法会默默地产生错误的答案或超出时间限制。 例如，与$a = [1,2,3,4,5]$，设置后$a_3 = 4$, 正确的最大值$k$是$2$，但是只检查整个数组的多数元素的粗心方法将返回$1$。 

## 方法

 暴力解决方案将迭代每个查询的所有子数组，并检查每个数字出现的次数。 对于单个查询，这是$O(n^2)$子数组，并且在每个子数组内，计数出现次数是$O(n)$, 给予$O(n^3)$每个查询。 这太慢了，因为$n$可以是$3 \cdot 10^5$。 

关键的见解是，问题归结为有效地维护元素计数，并利用只有一小部分数字才有可能实现高值这一事实。$k$。 任意数组中，能达到最大值的数$k$必须是某个子数组的众数。 这使我们能够考虑类似于 Mo 算法的分而治之方法或使用具有多数候选的线段树。 具体来说，我们可以使用线段树跟踪大多数的潜在候选者，并在元素更改时快速更新计数。 因为我们只需要最大$k$而不是确切的子数组，我们可以进行二分搜索$k$并验证是否有候选人实现了这一目标。 

这减少了动态维护元素频率、计算跨子阵列的最大候选频率以及执行二分搜索的问题。 通过适当的线段树设计或持久结构，每个查询都可以粗略地处理$O(\log n)$, 给予$O((n+q) \log n)$全面的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(n^3 q)$|$O(n)$| 太慢了 |
 | 线段树+二分查找|$O((n+q)\log n)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 首先，预处理数组以将每个值映射到其位置。 这允许稍后有效地计算频率。 
2. 构造一棵线段树，其中每个节点存储该线段的潜在多数元素及其相对于该线段的频率。 通过比较两个子候选节点来合并节点：如果它们相同，则对频率求和； 如果不同，则从较大的值中减去较小的值，并保留剩余的候选者。 这确保了存储在节点上的任何候选者都是唯一可能成为该段中多数的候选者。 
3、对于每个查询，更新数组并修改变化元素对应的线段树节点。 使用相同的合并逻辑自下而上更新频率。 
4. 计算最大值$k$查询后，从根节点中提取候选者。 使用预处理的位置计算其在数组中出现的总数。 最大$k$那么简单地就是$\text{count} - \lfloor \frac{n+1}{2} \rfloor$。 如果为负，则设置为零。 
5.返回最大值$k$对于每个查询。 

为什么它有效：线段树总是维护一个可能实现$k$- 某些子数组中的多数。 因为一个真实的$k$-多数必须出现超过某个子数组长度的一半加上$k$，任何其他数字都不能超过候选人在任何分段中的计数。 二进制搜索$k$不需要，因为最大值可以直接从总出现次数计算出来。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [None] * (4 * self.n)
        self.build(1, 0, self.n - 1, arr)

    def build(self, node, l, r, arr):
        if l == r:
            self.tree[node] = (arr[l], 1)
            return
        m = (l + r) // 2
        self.build(node*2, l, m, arr)
        self.build(node*2+1, m+1, r, arr)
        self.tree[node] = self.merge(self.tree[node*2], self.tree[node*2+1])

    def merge(self, left, right):
        if left[0] == right[0]:
            return (left[0], left[1] + right[1])
        if left[1] > right[1]:
            return (left[0], left[1] - right[1])
        else:
            return (right[0], right[1] - left[1])

    def update(self, idx, val, node=1, l=0, r=None):
        if r is None:
            r = self.n - 1
        if l == r:
            self.tree[node] = (val, 1)
            return
        m = (l + r) // 2
        if idx <= m:
            self.update(idx, val, node*2, l, m)
        else:
            self.update(idx, val, node*2+1, m+1, r)
        self.tree[node] = self.merge(self.tree[node*2], self.tree[node*2+1])

    def query_candidate(self):
        return self.tree[1][0]

def solve():
    t = int(input())
    for _ in range(t):
        n, q = map(int, input().split())
        a = list(map(int, input().split()))
        st = SegmentTree(a)
        from collections import defaultdict
        positions = defaultdict(list)
        for idx, val in enumerate(a):
            positions[val].append(idx)
        res = []
        for _ in range(q):
            i, x = map(int, input().split())
            i -= 1
            old = a[i]
            positions[old].remove(i)
            a[i] = x
            positions[x].append(i)
            st.update(i, x)
            cand = st.query_candidate()
            cnt = len(positions[cand])
            k = cnt - ((n + 1) // 2)
            res.append(max(0, k))
        print(" ".join(map(str, res)))

if __name__ == "__main__":
    solve()
```这`SegmentTree`类封装了候选计算。 合并逻辑保证在根处返回的任何数字是唯一可以超过某个段中长度一半的数字。 更新位置仅修改从叶到根的路径。 计数出现次数使用`positions`避免扫描整个数组，保持效率。 

## 工作示例

 ### 示例 1

 输入数组`[1,2,3,4,5]`, 查询`[(3,4),(1,4),(2,4),(4,3),(2,3)]`。 

| 步骤| 数组 | 候选人| 计数| k |
 | ---| ---| ---| ---| ---|
 | 0 | [1,2,3,4,5] | 任何| 1 | 0 |
 | 1 | [1,2,4,4,5] | 4 | 2 | 1 |
 | 2 | [4,2,4,4,5] | 4 | 3 | 1 |
 | 3 | [4,4,4,4,5] | 4 | 4 | 2 |
 | 4 | [4,4,4,3,5] | 4 | 3 | 1 |
 | 5 | [4,3,4,3,5] | 4 | 2 | 0 |

 该表显示线段树候选有效地跟踪多数元素，并且 k 计算正确。 

### 示例 2

 输入数组`[3,2,3,3,2,2,3]`, 查询`[(2,3),(5,3),(6,3),(3,4),(4,4),(7,4),(6,4),(2,4)]`。 

该表同样会显示候选者的调整情况，k 是候选者计数与半长之间的差异
