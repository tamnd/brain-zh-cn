---
title: "CF 2130D - 支柱或镜子"
description: "我们得到一个长度为 $n$ 的排列，这意味着一个数组包含从 $1$ 到 $n$ 的每个整数恰好一次。 对于此排列中的每个元素，我们可以将其保留为原样，也可以将其替换为由 $2n - pi$ 定义的“镜像”值。"
date: "2026-06-09T04:05:49+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "greedy"]
categories: ["algorithms"]
codeforces_contest: 2130
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 1040 (Div. 2)"
rating: 1600
weight: 2130
solve_time_s: 106
verified: false
draft: false
---

[CF 2130D - 保持或镜像](https://codeforces.com/problemset/problem/2130/D)

 **评分：** 1600
 **标签：** 数据结构，贪心
 **求解时间：** 1m 46s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们给出了长度的排列$n$，这意味着包含来自的每个整数的数组$1$到$n$正好一次。 对于此排列中的每个元素，我们可以将其保留为原样，也可以将其替换为由下式定义的“镜像”值：$2n - p_i$。 任务是选择这些分配来生成一个新数组$a$具有尽可能少的反转。 倒置是一对索引$(i, j)$这样$i < j$和$a_i > a_j$。 

约束条件告诉我们$n$每个测试用例最多可达 5000 个，总和$n$所有测试用例的范围也以 5000 为界。这意味着任何时间复杂度低于的解决方案$O(n^2)$每个测试用例可能仍然是可以接受的，但我们希望有足够高效的方法来处理限制内的所有情况。 因为反转涉及对，所以这是一种尝试所有方法的简单暴力方法$2^n$镜像值或原始值的组合显然是不可行的。 

当元素位于排列的边界时，就会出现边缘情况。 例如，如果排列是严格递增的，则采用任何元素的镜像可能会在开始或结束时引入反转。 类似地，对于严格递减的排列，镜像最大的元素可以大大减少反转。 总是选择所有原始值或所有镜像值的粗心实现将在这些情况下失败。 

## 方法

 蛮力方法是生成所有$2^n$通过为每个元素选择原始值或镜像值来计算可能的数组，然后使用标准对每个数组中的反转进行计数$O(n^2)$方法。 这是有效的，因为它评估所有可能性并保证正确性，但即使对于$n=20$自从$2^{20} \approx 10^6$计算每个组合的反转是另一回事$O(n^2)$手术。 

关键的见解是要注意镜像一个值本质上是在中点附近反映它$n + 0.5$。 如果我们根据元素的原始值或镜像值对元素进行排序，然后为每个元素决定采用原始值还是镜像值是否会最小化相对于先前选择的元素的反转，我们可以将问题简化为贪婪选择以及有效计算反转的数据结构。 

处理计数反转的一种自然方法是按顺序处理元素并跟踪哪些元素已被放置。 Fenwick 树（二叉索引树）或线段树允许$O(\log n)$更新和查询。 通过考虑每个元素$p_i$作为两名候选人$(p_i, 2n - p_i)$并使用对可能的中值分割的二分搜索，我们可以使用双指针或贪婪方法确定反转的最小数量$O(n \log n)$用于主要反演计算。 这避免了$2^n$组合爆炸。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n \cdot 2^n)$| O(n) | 太慢了|
 | 贪婪+BIT |$O(n \log n)$| O(n) | 已接受 |

 ## 算法演练

 1. 计算每个元素的镜像值：$m_i = 2n - p_i$。 
2.初始化一棵大小为Fenwick树或线段树$2n$跟踪到目前为止插入的元素的数量。 这将允许有效地计算反转。 
3. 从左到右迭代排列。 对于每个元素$p_i$，我们有两个选择：$p_i$或者$m_i$。 使用树查询已放置元素的数量大于每个候选元素的数量。 
4. 选择与之前放置的元素组合时可减少反转的候选元素。 将这个选定的值插入到树中。 
5. 在处理每个元素时维护反转的运行总数。 
6. 处理完排列中的所有元素后，输出总的反转计数。 

为什么有效：通过始终选择能够最小化已放置元素的反转次数的值，我们可以保持全局最小值。 由于每个决策仅取决于先前的元素，并且反转贡献是相加的，因此这种贪心方法保证了最小可能的反转计数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class FenwickTree:
    def __init__(self, size):
        self.n = size
        self.tree = [0] * (self.n + 2)

    def update(self, idx, delta):
        while idx <= self.n:
            self.tree[idx] += delta
            idx += idx & -idx

    def query(self, idx):
        res = 0
        while idx > 0:
            res += self.tree[idx]
            idx -= idx & -idx
        return res

def min_inversions(n, p):
    ft = FenwickTree(2 * n)
    total_inv = 0
    for x in p:
        orig = x
        mirror = 2 * n - x
        inv_orig = ft.query(2 * n) - ft.query(orig)
        inv_mirror = ft.query(2 * n) - ft.query(mirror)
        if inv_orig <= inv_mirror:
            total_inv += inv_orig
            ft.update(orig, 1)
        else:
            total_inv += inv_mirror
            ft.update(mirror, 1)
    return total_inv

t = int(input())
for _ in range(t):
    n = int(input())
    p = list(map(int, input().split()))
    print(min_inversions(n, p), end=' ')
```每个元素都会根据 Fenwick 树的当前状态进行评估，该树会跟踪所有先前放置的值的计数。 这`query`方法允许我们计算有多少元素大于当前候选，这直接给出了通过选择该候选添加的反转数。 该树将使用所选值进行更新，因此后续元素在其反转计算中会考虑该值。 

## 工作示例

 **示例1：**输入`[2, 1]`,`n=2`| 我| x| 原始 | 镜子| inv_orig | inv_mirror | 镜像 选择| 总库存量 | 树状态 |
 | --- | --- | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 2 | 2 | 2 | 0 | 0 | 原始 | 0 | [0,0,1]|
 | 2 | 1 | 1 | 3 | 0 | 0 | 原始 | 0 | [0,1,1]|

 没有出现反转，输出是`0`。 

**示例2：**输入`[2, 1, 3]`,`n=3`| 我| x| 原始 | 镜子| inv_orig | inv_mirror | 镜像 选择| 总库存量 | 树状态 |
 | --- | --- | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 2 | 2 | 4 | 0 | 0 | 原始 | 0 | [0,0,1,...] |
 | 2 | 1 | 1 | 5 | 1 | 0 | 镜子| 0 | ... |
 | 3 | 3 | 3 | 3 | 1 | 1 | 原始 | 1 | ... |

 最小反转为`1`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 每个元素都需要在大小的芬威克树中查询和更新$2n$|
 | 空间| O(n) | Fenwick Tree 商店数量高达$2n$价值观 |

 这完全符合 2 秒的限制$n \le 5000$和累积的$n \le 5000$。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    t = int(input())
    for _ in range(t):
        n = int(input())
        p = list(map(int, input().split()))
        output.append(str(min_inversions(n, p)))
    return ' '.join(output) + ' '

assert run("5\n2\n2 1\n3\n2 1 3\n4\n4 3 2 1\n5\n2 3 1 5 4\n6\n2 3 4 1 5 6\n") == "0 1 0 2 2 ", "sample tests"

assert run("1\n2\n1 2\n") == "0 ", "increasing"
assert run("1\n3\n3 2 1\n") == "0 ", "decreasing"
assert run("1\n4\n1 3 2 4\n") == "1 ", "one inversion"
assert run("1\n5\n5 4 3 2 1\n") == "0 ", "all decreasing"
assert run("1\n6\n1 2 6 5 3 4\n") == "2 ", "mixed"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2 1 | 2 0 | 简单的二元案例 |
 | 3 2 1 | 3 2 1 0 | 严格|
