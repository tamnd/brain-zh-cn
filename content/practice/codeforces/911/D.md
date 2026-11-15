---
title: "CF 911D - 反转计数"
description: "我们得到了从 1 到 n 的整数排列，这意味着该范围内的每个数字以某种顺序恰好出现一次。 倒置是一对位置，其中较大的索引比较小的索引持有较小的数字，这实际上是一种局部“无序”。"
date: "2026-06-13T00:29:39+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "math"]
categories: ["algorithms"]
codeforces_contest: 911
codeforces_index: "D"
codeforces_contest_name: "Educational Codeforces Round 35 (Rated for Div. 2)"
rating: 1800
weight: 911
solve_time_s: 275
verified: true
draft: false
---

[CF 911D - 反转计数](https://codeforces.com/problemset/problem/911/D)

 **评分：** 1800
 **标签：** 蛮力，数学
 **求解时间：** 4m 35s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了从 1 到 _n_ 的整数排列，这意味着该范围内的每个数字按某种顺序恰好出现一次。 倒置是一对位置，其中较大的索引比较小的索引持有较小的数字，实际上是局部“无序”。 例如，在排列 [4, 1, 3, 2] 中，索引 2 处的数字 1 小于索引 1 处的数字 4，形成反转。 

任务是处理多个查询，每个查询反转排列的一个子段。 每次反转后，我们不需要确切的反转次数，而只需要它是奇数还是偶数。 

限制是微妙的。 排列长度 _n_ 最大为 1500，如果需要，它足够小以在 _n_ 中进行二次运算。 然而，查询的数量_m_非常大，高达2·10^5。 这种组合立即排除了在每次查询后从头开始重新计算反转的任何解决方案，因为即使每个查询的 O(n^2) 反转计数在最坏的情况下也需要大约 4.5·10^11 次操作。 我们需要一种能够在最坏情况下以 O(1) 或 O(n) 处理查询的方法。 

边缘情况由非常短的段或长度为一的段产生。 反转长度为 1 的段根本不会改变反转计数。 已经按升序或降序排列的排列需要仔细处理，以确保正确计算奇偶校验翻转。 例如，反转大小 2 的整个排列会切换一次反转，将奇偶校验从偶数翻转为奇数。 

## 方法

 暴力方法很简单：读取排列后，我们可以迭代每个查询的每对索引并计算反转。 这是可行的，因为反转定义是明确的，但是一旦我们有超过几千个查询，它就变得不切实际，因为每个计数都是 O(n^2)。 

解锁高效解决方案的关键洞察来自于关注奇偶校验而不是精确的反转计数。 考虑一下当我们反转长度为 _k_ 的子数组时会发生什么。 子数组中的每对元素恰好交换其相对顺序一次。 长度为 _k_ 的段中有 _k·(k-1)/2_ 对。 因此，当且仅当 _k·(k-1)/2_ 为奇数时，段中反转次数的奇偶校验才会翻转。 这将每个查询减少为计算这个简单算术值是奇数还是偶数，这可以在常数时间内完成。 

我们不需要跟踪哪些特定元素交换； 不变的是，仅当反转段中的元素对的数量为奇数时，总体反转计数的奇偶性才改变。 这一观察结果将每个查询本质上看起来 O(n^2) 的问题转变为每个查询奇偶校验更新 O(1) 的问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(m·n^2) | O(m·n^2) | O(n) | 太慢了 |
 | 最佳| O(n^2 + m) | O(n^2 + m) | O(n) | 已接受 |

 ## 算法演练

 1. 首先，计算排列中的初始反转次数。 这是通过迭代所有对来完成的`(i, j)`和`i > j`并检查是否`a[i] < a[j]`。 仅存储奇偶校验：偶数或奇数。 
2. 对于每个带段的查询`[l, r]`，计算线段的长度为`k = r - l + 1`。 
3. 计算段内的对数，即`k * (k - 1) / 2`。 检查这个数字是奇数还是偶数。 如果是奇数，则翻转当前的反转奇偶校验。 如果偶数，则保持奇偶校验不变。 
4. 根据更新后的奇偶校验输出“奇”或“偶”。 

工作原理：排列中反转的奇偶校验仅受段内反转顺序的交换的影响。 反转段中的每一对都为反转计数贡献了一次交换。 因此，查询的唯一相关信息是此类对的数量是奇数还是偶数，这保证了奇偶校验更新对于任何排列和任何查询长度都是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))
m = int(input())

# compute initial inversion parity
parity = 0  # 0 = even, 1 = odd
for i in range(n):
    for j in range(i):
        if a[i] < a[j]:
            parity ^= 1  # flip parity

for _ in range(m):
    l, r = map(int, input().split())
    k = r - l + 1
    if (k * (k - 1) // 2) % 2 == 1:
        parity ^= 1
    print("odd" if parity else "even")
```第一个双循环正确计算初始奇偶校验。 每当交换贡献奇数时，使用 XOR 和 1 就会翻转奇偶校验。 查询处理是恒定时间的：计算长度、计算对的数量、检查奇偶校验和翻转。 自从我们计算以来，没有相差一的错误`k = r - l + 1`正确地适用于包容性指数。 

## 工作示例

 输入示例 1：```
3
1 2 3
2
1 2
2 3
```| 步骤| 段长度 k | 对 k*(k-1)/2 | 翻动？ | 平价| 输出|
 | --- | --- | --- | --- | --- | --- |
 | 初始| - | - | - | 0 | - |
 | 查询 1 [1,2] | 2 | 1 | 是的 | 1 | 奇数|
 | 查询 2 [2,3] | 2 | 1 | 是的 | 0 | 甚至|

 这表明奇偶校验翻转对于最小段是正确的。 

输入示例 2：```
4
1 2 4 3
4
2 4
1 3
1 4
3 3
```| 步骤| 段长度 k | 对 k*(k-1)/2 | 翻动？ | 平价| 输出|
 | --- | --- | --- | --- | --- | --- |
 | 初始| - | - | - | 1 | - |
 | 查询 1 [2,4] | 3 | 3 | 是的 | 0 | 甚至|
 | 查询 2 [1,3] | 3 | 3 | 是的 | 1 | 奇数|
 | 查询 3 [1,4] | 4 | 6 | 没有 | 1 | 奇数|
 | 查询 4 ​​[3,3] | 1 | 0 | 没有 | 1 | 奇数|

 The table shows that single-element reversals do not affect parity and larger even-length reversals may not flip parity.

 ## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2 + m) | O(n^2 + m) | Initial inversion parity takes O(n^2), each query is O(1) |
 | 空间| O(n) | 仅存储排列数组 |

 With n ≤ 1500 and m ≤ 2·10^5, the O(n^2) initial step is roughly 2.25·10^6 operations, which is acceptable. O(1) 中的查询处理每次需要 2·10^5 次操作，完全在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    n = int(input())
    a = list(map(int, input().split()))
    m = int(input())
    parity = 0
    for i in range(n):
        for j in range(i):
            if a[i] < a[j]:
                parity ^= 1
    for _ in range(m):
        l, r = map(int, input().split())
        k = r - l + 1
        if (k * (k - 1) // 2) % 2 == 1:
            parity ^= 1
        output.append("odd" if parity else "even")
    return "\n".join(output)

# provided samples
assert run("3\n1 2 3\n2\n1 2\n2 3\n") == "odd\neven", "sample 1"
assert run("4\n1 2 4 3\n4\n2 4\n1 3\n1 4\n3 3\n") == "even\nodd\nodd\nodd", "sample 2"

# custom cases
assert run("1\n1\n1\n1 1\n") == "even", "single element"
assert run("2\n2 1\n1\n1 2\n") == "even", "two element swap flips parity"
assert run("5\n5 4 3 2 1\n3\n1 5\n2 4\n3 3\n") == "even\nodd\nodd", "descending with mixed queries"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | “1\n1\n1\n1 1\n”| 甚至| 单元素段不应翻转奇偶校验 |
 | “2\n2 1\n1\n1 2\n” | 甚至| 两个元素从初始奇数反转翻转奇偶校验 |
 | "5\n5 4 3 2 1\n3\n1 5\n2 4\n3 3\n" | 偶数，奇数，奇数| 大型初始反转，混合长度 |
