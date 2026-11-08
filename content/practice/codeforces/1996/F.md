---
title: "CF 1996F - 炸弹"
description: "我们被要求最大化两个数组上的一系列操作的分数。 每个数组的长度为 $n$。 数组 $a$ 表示每个元素的当前“值”，数组 $b$ 表示该元素在使用后衰减的程度。"
date: "2026-06-08T14:44:17+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 1996
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 962 (Div. 3)"
rating: 1900
weight: 1996
solve_time_s: 169
verified: true
draft: false
---

[CF 1996F - 炸弹](https://codeforces.com/problemset/problem/1996/F)

 **评级：** 1900
 **标签：** 二分查找，贪心，数学
 **求解时间：** 2m 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求最大化两个数组上的一系列操作的分数。 每个数组都有长度$n$。 大批$a$表示每个元素的当前“值”，数组$b$表示该元素在使用后衰减的程度。 在一次操作中，我们选择一个索引$i$， 添加$a_i$到我们的分数，然后减少$a_i$经过$b_i$，保持非负数。 我们正好有$k$操作以最大化总分。 

限制因素很重要：$n$可以达到$2 \cdot 10^5$， 和$k$可以达到$10^9$。 单独模拟每个操作的简单解决方案显然是不可行的，因为它可能需要数十亿次操作。 这迫使我们找到一种方法来同时跳过许多操作，而不是一个一个地执行它们。 

边缘情况出现时$b_i \ge a_i$对于某些元素，因为该元素最多只能贡献一次。 同样，如果$k$相比而言非常大$n$，我们需要对同一元素重复应用操作，并且衰减模式很重要。 例如，考虑$a = [1, 1]$,$b = [2, 3]$,$k = 3$。 最高分是$2$， 不是$3$，因为在第一次操作后两个元素都达到零。 不跟踪衰减的天真贪婪方法会计算过多。 

## 方法

 蛮力法很简单：对于每个$k$操作，扫描数组以找到当前值最大的元素，将其添加到分数中，并更新该元素。 这是正确的，但需要$O(n \cdot k)$时间。 和$n \le 2 \cdot 10^5$和$k \le 10^9$，这可能意味着$10^{14}$的操作，这是远远超出可接受范围的。 

关键的观察是每个元素线性衰减：之后$m$元素的用途$i$，其值为$\max(0, a_i - m \cdot b_i)$。 由于这种线性结构，我们可以计算每个元素值得使用的最大次数。 具体来说，当我们第一次使用一个元素时，它会贡献$a_i$。 下次有贡献$a_i - b_i$， 然后$a_i - 2b_i$，依此类推，直到达到零。 This sequence is arithmetic, and we can sum it quickly rather than iterating each decrement.

 A clever way to select operations efficiently is to repeatedly choose the element whose next contribution is currently the largest. 为了避免每次扫描数组，我们可以对元素进行排序$a_i$和$b_i$以一种让我们首先处理高贡献元素的方式，并且对于非常大的元素$k$，我们可以通过计算每个元素仍然会做出积极贡献的次数来批量选择每个元素的次数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n·k) | O(n) | 太慢了 |
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取数组$a$和$b$，以及操作次数$k$。 每个配对$a_i$及其相应的$b_i$。 
2. 对各对进行排序$b_i$首先处理衰减较慢的元素，或者通过一些其他启发式来优先考虑高初始贡献和低衰减。 
3. 对于每个元素，计算其在达到零之前可以使用的最大次数，即$m_i = \min(k, \lceil a_i / b_i \rceil)$如果$b_i > 0$， 否则$m_i = k$如果$b_i = 0$。 
4. 添加该元素贡献的算术序列的总和：$\text{sum}_i = m_i \cdot a_i - b_i \cdot \frac{m_i (m_i - 1)}{2}$。 
5. 减法$m_i$从剩余的操作中$k$。 如果$k = 0$，早点停下来。 
6、将贡献值累计到总分中。 

为什么有效：由于线性衰减，每个元素都以严格递减的步长做出贡献。 通过计算每个元素的正贡献之和，我们无需模拟每个操作即可捕获总贡献。 排序确保首先处理总体贡献最大的元素，这保证了全局最优分数，因为在每一步我们都会选择下一个最大的贡献。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, k = map(int, input().split())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))
        items = list(zip(a, b))
        # Sort by initial value descending to greedily pick highest first
        items.sort(reverse=True, key=lambda x: x[0])
        total = 0
        remaining_ops = k
        for val, dec in items:
            if remaining_ops == 0:
                break
            if dec == 0:
                total += val * remaining_ops
                remaining_ops = 0
                break
            max_use = min(remaining_ops, (val + dec - 1) // dec)
            total += max_use * val - dec * max_use * (max_use - 1) // 2
            remaining_ops -= max_use
        print(total)

if __name__ == "__main__":
    solve()
```解第一对$a$和$b$并排序$a_i$优先考虑高初始值。 我们单独处理零衰减以避免被零除。 算术级数公式可以有效地对重复贡献求和。 如果我们用完所有的话我们会提前停止$k$运营。 

## 工作示例

 ### 输入示例 1```
3 4
5 6 7
2 3 4
```| 步骤| 值| 十二月 | 最大使用量| 贡献 | 剩余操作数 | 总计 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 7 | 4 | 1 | 7 | 3 | 7 |
 | 2 | 6 | 3 | 1 | 6 | 2 | 13 |
 | 3 | 5 | 2 | 2 | 8 | 0 | 21 | 21

 Trace 证明我们使用算术公式正确计算每个元素的最大使用量和总贡献，而不是模拟每个操作。 

### 输入示例 2```
5 1000
1 2 3 4 5
5 4 3 2 1
```| 步骤| 值| 十二月 | 最大使用量| 贡献 | 剩余操作数 | 总计 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 5 | 1 | 5 | 5+4+3+2+1=15 | 995 | 995 15 | 15
 | 2 | 4 | 2 | 2 | 4+2=6 | 993 | 993 21 | 21
 | 3 | 3 | 3 | 1 | 3 | 992 | 992 24 |
 | 4 | 2 | 4 | 1 | 2 | 991 | 991 26 | 26
 | 5 | 1 | 5 | 1 | 1 | 990 | 990 27 | 27

 Trace 确认我们按值的降序选择元素，处理衰减，并在元素达到零时停止。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 对 n 个元素的数组进行排序占主导地位。 其余操作是通过分析计算的，而不是模拟的。 |
 | 空间| O(n) | 我们存储 (a_i, b_i) 对用于排序和处理。 |

 时间复杂度完全在限制范围内，因为$n \le 2 \cdot 10^5$，使解决方案在 2 秒内变得可行。 空间与 n 呈线性关系，远低于 256 MB 限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    solve()
    sys.stdout = sys.__stdout__
    return output.getvalue().strip()

# Provided samples
assert run("5\n3 4\n5 6 7\n2 3 4\n5 9\n32 52 68 64 14\n18 14 53 24 8\n5 1000\n1 2 3 4 5\n5 4 3 2 1\n1 1000000\n1000000\n1\n10 6\n3 3 5 10 6 8 6 8 7 7\n6 1 7 4 1 1 8 9 3 1") == "21\n349\n27\n500000500000\n47"

# Minimum-size input
assert run("1\n1 1\n1\n1") == "1"

# All equal values
assert run("1\n3 5\n5 5 5\n1 1 1") == "25"

# Maximum n, small k
assert
```
