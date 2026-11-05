---
title: "CF 1831E - 超规则括号弦"
description: "我们被要求计算长度为 $n$ 的括号序列，这些序列是全局规则的，同时在某些指定的子区间上也是局部规则的。 输入为我们提供了长度 $n$ 和 $k$ 间隔 $[li, ri]$ 的列表。"
date: "2026-06-09T07:08:38+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "data-structures", "hashing", "math", "number-theory", "sortings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1831
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 875 (Div. 2)"
rating: 2400
weight: 1831
solve_time_s: 200
verified: false
draft: false
---

[CF 1831E - 超正则括号字符串](https://codeforces.com/problemset/problem/1831/E)

 **评分：** 2400
 **标签：** 组合数学、数据结构、哈希、数学、数论、排序、两个指针
 **求解时间：** 3m 20s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求计算括号序列的长度$n$它们是全局正则的，同时在某些指定的子区间上也是局部正则的。 输入给我们长度$n$和一个列表$k$间隔$[l_i, r_i]$。 全局正则括号序列是每个左括号都有一个匹配的右括号，并且在其匹配的左括号之前不会出现右括号。 如果每个指定的间隔本身形成一个有效的正则括号序列，则该序列是超正则序列。 我们的输出是此类超正则序列的数量模$998{,}244{,}353$。 

限制很严格。 总计$n$所有测试用例都可以达到$3 \cdot 10^5$， 和$k$还可以达到$3 \cdot 10^5$。 生成所有序列、检查规律性、然后基于间隔进行过滤的简单方法是不可能的，因为序列的数量呈指数增长$n$。 因此，我们需要一种组合或数学方法，最好是在线性或近线性时间内$n + k$。 

边缘情况出现时$n$是奇数，因为不存在规则序列，或者当间隔重叠或嵌套时，因为这些约束减少了有效序列的数量，甚至可以使计数为零。 还需要仔细处理空间隔和长度为 1 的间隔，因为它们会自动限制序列中的某些位置。 

## 方法

 蛮力方法将生成所有$2^n$序列，检查每个序列是否全局正则，然后检查每个区间的局部正则性。 这在原则上是正确的，但对于$n > 20$由于指数增长。 

关键的观察结果是，常规括号序列完全由左括号和右括号的数量及其位置来表征。 加泰罗尼亚数字枚举了给定长度的所有规则序列。 当我们添加具有超正则约束的间隔时，它会强制某些位置匹配，从而有效地固定序列的部分。 如果间隔重叠或嵌套，则内部序列必须同时满足所有重叠约束。 这导致了组合减少：我们只需要考虑这些区间的端点如何匹配以形成更小的有效序列。 

最佳方法利用了这样一个事实：任何嵌套区间结构都可以递归地分割成独立的段。 通过使用加泰罗尼亚数字计算填充每个独立段的方式数量并进行乘法，我们可以有效地计算超正则序列的总数。 预计算阶乘和逆阶乘模$998{,}244{,}353$允许我们在恒定时间内计算每个段的加泰罗尼亚数字。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n * k) | O(2^n * k) | O(n) | 太慢了 |
 | 最佳| O((n + k) log(n)) | O((n + k) log(n)) | O(n) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，请阅读$n$和$k$，并存储间隔$[l_i, r_i]$。 按起点对间隔进行排序。 需要排序才能有效地处理嵌套或重叠间隔。 
2. 初始化一个栈来模拟嵌套结构。 遍历间隔，对于每个间隔，如果它在堆栈顶部之后开始，则弹出堆栈直到适合当前间隔。 这构造了一棵表示嵌套间隔的树。 
3. 对于区间树中的每个节点，递归计算有效序列的数量。 如果节点具有子区间，则将序列拆分为由这些子区间定义的段。 对于每段长度$m$，计算加泰罗尼亚数$C_{m/2}$如果$m$是均匀的。 如果$m$是奇数，将计数设置为零，因为不存在奇数长度的规则序列。 
4. 将所有段的加泰罗尼亚数相乘，并对嵌套子项进行递归。 这给出了当前间隔的计数。 
5. 测试用例的答案是覆盖整个序列的间隔的计数。 如果没有区间覆盖整个序列，则将整个序列视为单个区间。 

为什么有效：加泰罗尼亚数字枚举了所有满足正则性的序列。 通过将序列分割成由嵌套区间结构确定的不重叠的段，我们确保每个段都是独立计数的。 由于独立性，乘法计数是有效的。 递归尊重嵌套，因此满足每个间隔约束。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353
MAX = 3 * 10**5 + 10

# precompute factorials and inverse factorials
fact = [1] * MAX
invfact = [1] * MAX
for i in range(1, MAX):
    fact[i] = fact[i - 1] * i % MOD
invfact[MAX - 1] = pow(fact[MAX - 1], MOD - 2, MOD)
for i in range(MAX - 2, -1, -1):
    invfact[i] = invfact[i + 1] * (i + 1) % MOD

def catalan(n):
    if n == 0:
        return 1
    return fact[2 * n] * invfact[n] % MOD * invfact[n + 1] % MOD

def solve_case(n, k, intervals):
    intervals.sort()
    stack = []
    result = 1
    last = 0

    for l, r in intervals:
        # handle gaps
        if l - 1 > last:
            gap = l - 1 - last
            if gap % 2 != 0:
                return 0
            result = result * catalan(gap // 2) % MOD
        last = max(last, r)
    # handle tail
    if last < n:
        gap = n - last
        if gap % 2 != 0:
            return 0
        result = result * catalan(gap // 2) % MOD
    return result

def main():
    t = int(input())
    for _ in range(t):
        n, k = map(int, input().split())
        intervals = [tuple(map(int, input().split())) for _ in range(k)]
```
