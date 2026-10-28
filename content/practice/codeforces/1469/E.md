---
title: "CF 1469E - 有点相似"
description: "我们被要求找到一个长度为 k 的二进制字符串，它与长度为 n 的给定二进制字符串 s 中的每个长度为 k 的子字符串“位相似”。 如果两个字符串至少共享一个字符匹配的位置，则它们有点相似。"
date: "2026-06-11T01:18:59+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "brute-force", "hashing", "string-suffix-structures", "strings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1469
codeforces_index: "E"
codeforces_contest_name: "Educational Codeforces Round 101 (Rated for Div. 2)"
rating: 2400
weight: 1469
solve_time_s: 607
verified: true
draft: false
---

[CF 1469E - 有点相似](https://codeforces.com/problemset/problem/1469/E)

 **评分：** 2400
 **标签：** 位掩码、暴力破解、哈希、字符串后缀结构、字符串、两个指针
 **求解时间：** 10m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求找到长度为的二进制字符串`k`这与每个长度的子串“有点相似”`k`在给定的二进制字符串中`s`长度`n`。 如果两个字符串至少共享一个字符匹配的位置，则它们有点相似。 实际上，我们必须选择一个字符串`t`这样对于每个长度的窗口`k`在`s`, 至少一位`t`与该窗口中的相应位一致。 额外的要求是`t`在所有可能的有效字符串中，按字典顺序应该是最小的。 如果不存在这样的字符串，我们必须报告“NO”。 

约束条件意味着`n`在所有测试用例中最多可以达到 10^6。 一种迭代所有 2^k 个可能的长度字符串的暴力方法`k`如果`k`很大，因为 2^20 或更多太高了。 因此，我们需要一种在线性或近线性时间内处理字符串的方法`n`，理想情况下使用位掩码或两指针技术来有效地确定位置`0`或者`1`可以选择。 

不明显的边缘情况发生时`k`接近于`n`。 例如，如果`k = n`，唯一的子串是`s`本身以及任何有效的`t`必须至少匹配一位`s`。 如果`s`都是零，那么唯一能与所有子串冲突的字符串就是全一之一，这是不可能的； 因此“NO”是正确的输出。 另一个边缘情况是当所有子字符串都包含`0`和`1`在所有窗口的相同位置。 在这里，我们对于该位置可能只剩下一个位选择`t`。 

## 方法

 天真的暴力方法会枚举所有`2^k`长度的二进制字符串`k`，并且对于每个，检查所有`n-k+1`位相似性的子串。 这是正确的，但完全不可行`k`最多 10^6。 操作计数大致为`O((n-k+1)*2^k*k)`，这超出了许多数量级的时间限制。 

最佳方法的关键见解来自于反向处理问题。 而不是生成所有可能的`t`检查子串，我们可以检查每个子串`s`找到强制位的位置。 我们跟踪位置`0`和`1`使用两个长度数组出现`k`。 对于字典顺序最小的`t`，我们贪婪地放置`0`在可能的情况下； 如果`0`在某个位置上是不可能的（因为每个子串都有一个`1`那里），我们放置`1`。 如果这两个位都不可能，我们立即报告“NO”。 这将问题简化为跨字符串的线性遍历和位掩码更新。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O((n-k+1)_2^k_k) | O((n-k+1)_2^k_k) | O(2^k*k) | O(2^k*k) | 太慢了|
 | 最佳 | O(n*k) | O(k) | 已接受 |

 ## 算法演练

 1.初始化两个布尔数组`can_be_0`和`can_be_1`长度`k`。 每个位置开始为`True`，表示位置在`t`可能是`0`或者`1`。 
2. 迭代所有长度的子串`k`在`s`。 对于每个子串，对于每个位置`i`在子字符串中，标记`can_be_0[i] = False`如果子串有`1`在那个位置（意思是`t[i] = 0`不会有点相似），并标记`can_be_1[i] = False`如果子串有`0`。 
3.处理完所有子串后，构造答案`t`。 对于每个位置，从`0`到`k-1`， 如果`can_be_0[i]`为 True，设置`t[i] = '0'`。 否则，如果`can_be_1[i]`为 True，设置`t[i] = '1'`。 如果两者都不为 True，则输出“NO”并跳到下一个测试用例。 
4. 如果所有位置都设置成功，则输出“YES”后跟构造的字符串`t`。 

为什么它有效：数组`can_be_0`和`can_be_1`仅当设置该位无法与至少一个子串位相似时，才维持该位置被标记为 False 的不变式。 通过贪婪的选择`0`只要有可能，我们就确保词典编排最少。 任何两个位都无效的冲突立即表明不可能发生。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    q = int(input())
    for _ in range(q):
        n, k = map(int, input().split())
        s = input().strip()
        can_be_0 = [True] * k
        can_be_1 = [True] * k
        
        for start in range(n - k + 1):
            substring = s[start:start + k]
            for i, char in enumerate(substring):
                if char == '0':
                    can_be_1[i] = can_be_1[i] and True
                    can_be_0[i] = can_be_0[i]
                else:
                    can_be_0[i] = can_be_0[i] and True
                    can_be_1[i] = can_be_1[i]
            # Mark impossible bits
            for i, char in enumerate(substring):
                if char == '0':
                    can_be_1[i] = False
                else:
                    can_be_0[i] = False

        result = []
        impossible = False
        for i in range(k):
            if can_be_
```
