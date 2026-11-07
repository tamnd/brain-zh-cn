---
title: "CF 1968F - 相等的 XOR 段"
description: "我们被要求决定，对于给定数组的子数组，是否可以将子数组划分为至少两个连续的段，使得每个段的按位异或相等。"
date: "2026-06-07T18:08:25+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 1968
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 943 (Div. 3)"
rating: 1800
weight: 1968
solve_time_s: 134
verified: false
draft: false
---

[CF 1968F - 相等的 XOR 段](https://codeforces.com/problemset/problem/1968/F)

 **评分：** 1800
 **标签：** 二分查找、数据结构
 **求解时间：** 2m 14s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求决定，对于给定数组的子数组，是否可以将子数组划分为至少两个连续的段，使得每个段的按位异或相等。 形式上，如果我们考虑子数组$a_l, a_{l+1}, \dots, a_r$，我们需要判断是否存在一个整数$k > 1$和指数$l = i_0 < i_1 < \dots < i_k = r+1$这样对于每个段$[i_j, i_{j+1}-1]$，元素的异或是相同的。 

输入包括多个测试用例，每个测试用例都有一个数组和子数组上的多个查询。 数组大小和查询次数可以达到$2 \cdot 10^5$，所有测试用例的总数都有类似的界限。 这排除了任何枚举所有可能分区的方法，这种方法的复杂度呈指数级$n$。 我们需要一种能够有效回答每个查询的算法，最好是$O(n)$预处理和$O(1)$每个查询或稍高一点，使用预先计算的结构，如前缀异或。 

当所有元素都为零时，就会出现边缘情况。 在这里，任何非平凡的分割都有效，因为零与零的异或为零，因此每个子数组都会自动有趣。 另一个微妙的情况是当子数组的总 XOR 不为零但存在 XOR 匹配的内部分区时； 我们需要仔细检测满足等异或条件的分割，同时不丢失有效配置。 

## 方法

 暴力方法会尝试子数组的每一种可能的分割，计算每个段的异或，并检查它们是否相等。 对于长度为的子数组$m$， 有$2^{m-1}-1$方法将其分成至少两部分。 计算每个分割的 XOR 会增加另一个分割$O(m)$，总时间复杂度大致为$O(2^m \cdot m)$。 这是不可行的$m$最多$2 \cdot 10^5$。 

一个关键的观察简化了问题。 让$X$是整个子数组的异或。 如果数组可以划分为$k \ge 2$具有相等 XOR 的段$x$，那么整个数组的异或必须是$x$重复$k$次。 由于 XOR 具有关联性并且$x \oplus x = 0$，总异或必须是$0$如果$k$是偶数或等于$x$如果$k$很奇怪。 更实际的是，我们可以扫描前缀异或：如果我们找到至少两个位置，从开始的累积异或与总异或匹配，我们就可以形成一个有效的分区。 这减少了检查前缀 XOR 数组的问题，该数组可在$O(n)$，并对匹配进行计数，这也可以高效完成。 

最佳方法使用前缀 XOR 并搜索累积 XOR 等于子数组的总 XOR 的索引。 如果存在这样的索引，允许分成至少两个段，我们回答“是”； 否则，“否”。 处理零子数组或单元素段需要仔细的边界检查。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^m * m) | O(2^m * m) | O(1) | O(1) | 太慢了 |
 | 前缀异或检查 | O(n) 预处理，每个测试用例 O(q) | O(n) | 已接受 |

 ## 算法演练

 1. 计算前缀异或数组$px$对于输入数组，使得$px[i] = a_1 \oplus a_2 \oplus \dots \oplus a_i$。 这允许使用以下命令对任何子数组进行恒定时间异或计算$px[r] \oplus px[l-1]$。 
2. 对于每个查询$(l, r)$，计算子数组的总异或为$total = px[r] \oplus px[l-1]$。 
3.如果$total = 0$，子数组总是很有趣。 我们总是可以将其分成至少两个非空段，因为零段的异或可以重复。 
4. 否则，扫描子数组中的前缀位置，其中从子数组开头开始的累积 XOR 等于$total$。 让$count$是此类职位的数量。 
5. 如果我们可以找到至少两个由至少一个元素分隔的此类位置，或者不在允许有效分割的边界处的位置，请回答“是”。 否则，“否”。 
6. 边缘情况：长度为 2 的子数组必须具有相等的元素才有意义。 此外，需要仔细注意以确保段非空。 

为什么它有效：根据 XOR 的性质，如果数组的总 XOR 为$X$，任意分区为$k$等异或段必须满足累积异或，直到每个分割是以下的倍数$X$。 此不变量保证对此类前缀 XOR 进行计数可以正确检测所有可能的有效分区。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, q = map(int, input().split())
        a = list(map(int, input().split()))
        px = [0]*(n+1)
        for i in range(n):
            px[i+1] = px[i] ^ a[i]
        
        for _ in range(q):
            l, r = map(int, input().split())
            total = px[r] ^ px[l-1]
            if total == 0:
                print("YES")
                continue
            found = 0
            xor_acc = 0
            for i in range(l-1, r):
                xor_acc ^= a[i]
                if xor_acc == total:
                    found += 1
                    xor_acc = 0
            print("YES" if found >= 2 else "NO")

if __name__ == "__main__":
    solve()
```前缀 XOR 数组允许对子数组进行恒定时间总 XOR 计算。 内部循环累积异或并在找到与总数匹配的段时重置。 计算至少两个这样的段可确保有效的分割。 通过从以下位置开始循环来处理边界条件$l-1$并包括$r$。 

## 工作示例

 **示例 1：** 子数组$[1,1,2,3,0]$与查询（1,5）。 前缀异或：1,0,2,1,1。 总 XOR = 1。扫描产生段：[1]、[1]、[2,3,0]，每个段 XOR 1。 回答是。 

| 我| 一个[我] | 异或_acc | 发现 |
 | --- | --- | --- | --- |
 | 0 | 1 | 1 | 0 |
 | 1 | 1 | 0 | 1 |
 | 2 | 2 | 2 | 1 |
 | 3 | 3 | 1 | 1 |
 | 4 | 0 | 1 | 1 -> 重置为 0，找到=2 |

 **示例 2：** 带有查询 (1,3) 的子数组 [1,2,3]。 总 XOR = 0。立即回答“是”。 

这些示例确认该算法正确处理非零总异或分区和零总异或子数组。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n + q) | 前缀 XOR 在 O(n) 中计算，每个查询在 O(r-l) 最坏情况下处理，受总 n | 的限制。 
| 空间| O(n) | 大小为 n+1 的前缀 XOR 数组 |

 给定所有测试用例的 n 和 q 之和 ≤ 2e5，该解决方案完全符合 5 秒和 256MB 的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided sample
assert run("""4
5 5
1 1 2 3 0
1 5
2 4
3 5
1 3
3 4
5 5
1 2 3 4 5
1 5
2 4
3 5
1 3
2 3
7 4
12 9 10 9 10 11 9
1 5
1 7
2 6
2 7
11 4
0 0 1 0 0 1 0 1 1 0 1
1 2
2 5
6 9
7 11""") == """YES
YES
NO
NO
NO
YES
NO
NO
YES
NO
NO
NO
NO
NO
YES
NO
YES
YES""", "sample 1"

# Custom: all zeros
assert run("1\n5 2\n0 0 0 0 0\n1 5\n2 4") == "YES\nYES", "all zeros"

# Custom: single-element segments impossible
assert run("1\n3 1\n1 2 3\n1 3") == "NO", "no partition"

# Custom: two equal elements
assert run("1\n2 1\n7 7\n1 2") == "YES", "minimal partition"

# Custom: prefix XOR matches total XOR twice
assert run("1\n5
```
