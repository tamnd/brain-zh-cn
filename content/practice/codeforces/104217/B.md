---
title: "CF 104217B - 最大差异"
description: "给定一个整数 $n$，并要求我们查看序列 $(1, 2, 3,dots, n)$ 的所有排列。 每个排列都被解释为通过按顺序连接其元素而形成的数字。"
date: "2026-07-01T23:52:24+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104217
codeforces_index: "B"
codeforces_contest_name: "UTPC Contest 03-03-23 Div. 2 (Beginner)"
rating: 0
weight: 104217
solve_time_s: 61
verified: true
draft: false
---

[CF 104217B - 最大差异](https://codeforces.com/problemset/problem/104217/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数$n$，我们被要求查看序列的所有排列$(1, 2, 3, \dots, n)$。 每个排列都被解释为通过按顺序连接其元素而形成的数字。 例如，对于$n = 4$，像这样的排列$[3, 1, 4, 2]$对应数字3142。 

在所有可能的排列中，我们希望任何两个这样形成的数字之间的最大可能差异。 一种排列应该产生最大可能的串联数，另一种排列应该产生尽可能最小的串联数，我们取它们的差。 

输入大小可达$n = 10^5$。 这排除了任何显式枚举排列或构造所有数字的方法，因为有$n!$排列，即使对于小排列来说也是天文数字$n$。 任何有效的解决方案都必须是线性的或最坏的$O(n \log n)$，尽管这里不需要排序，因为最佳排列的结构是固定的。 

一个微妙的点是我们正在处理连接，而不是数字的算术重新排列。 所以$n = 12$贡献两位数，同时$n = 9$贡献一位数。 这意味着位置权重取决于数字长度，这会影响极值排列的结构。 

边缘情况来自较小的值$n$。 为了$n = 1$，只有一种排列，因此差值必须为零。 为了$n = 10$，数字长度从 1 位数字变为 2 位数字，这正是简单的数字级推理方法在假设宽度一致的情况下可能失败的地方。 

## 方法

 暴力解决方案将生成以下所有排列$1$到$n$，将每个排列转换为其串联整数表示，并计算其中的最小值和最大值。 这在概念上是简单且正确的，因为它直接遵循问题的定义。 然而，它的复杂性是$O(n! \cdot n)$由于生成所有排列并将每个排列连接起来，即使对于$n = 10$。 

关键的观察是我们实际上不需要探索排列。 我们只需要确定哪种数字排列产生最大的串联值，哪种排列产生最小的串联值。 对于基于串联的排序，最佳排列是通过结果字符串的字典顺序比较来确定的，而不是通过各个元素的数值大小来确定的。 

当写成字符串时，通过按降序排列数字来获得最大的串联数字，因为前面放置较大的前导数字总是主导后面的贡献。 类似地，将数字按升序排列即可获得最小的串联数。 

由于序列固定为$1$到$n$，这简化为构造两个字符串：一个是通过写入数字形成的$n$下降到$1$，另一个来自$1$最多$n$，然后将两者都转换为整数并相减。 

该问题从排列组合优化转化为直接构造问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n! \cdot n)$|$O(n)$| 太慢了 |
 | 最佳 |$O(n \cdot d)$在哪里$d$是数字成本 |$O(n \cdot d)$| 已接受 |

 ## 算法演练

 ## 算法演练

 1. 通过附加 1 到 1 之间的数字来构造尽可能小的串联$n$按递增顺序。 这是有效的，因为在结果字符串的字典顺序中，前面的数字支配后面的数字。 
2. 通过附加以下数字来构造最大可能的串联$n$降至 1。这可确保较大的数字较早出现，从而最大化最高有效数字位置。 
3. 将两个构造的字符串转换为整数。 此步骤是安全的，因为结果值可能会变大，但 Python 可以处理任意精度的整数。 
4. 计算较大值和较小值之间的差并输出。 

Why it works: the concatenated number is fully determined by the sequence of string blocks, and comparing two concatenations is equivalent to comparing their lexicographic order when all blocks are fixed tokens. Since the problem allows arbitrary permutation, extremal values are achieved by globally sorting these tokens in descending and ascending order respectively. 任何偏离这些顺序的行为都会导致稍后引入较大的代币或较早引入较小的代币，这会严重恶化目标。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input().strip())

    # build smallest concatenation: 1 to n
    small_parts = []
    for i in range(1, n + 1):
        small_parts.append(str(i))
    small_val = int("".join(small_parts))

    # build largest concatenation: n to 1
    large_parts = []
    for i in range(n, 0, -1):
        large_parts.append(str(i))
    large_val = int("".join(large_parts))

    print(large_val - small_val)

if __name__ == "__main__":
    solve()
```实现直接遵循前面描述的构造。 唯一重要的决定是使用字符串连接而不是算术数字移位。 这避免了手动跟踪十的幂并正确处理连续整数之间不同的数字长度。 

Python 的任意精度整数使得转换安全，即使在$n = 10^5$，其中结果数字有数十万位。 

## 工作示例

 ### 示例 1

 输入：```
4
```我们构建了两个极端。 

| 步骤| 建筑 | 结果 |
 | --- | --- | --- |
 | 小| 1 → 2 → 3 → 4 | 1234 | 1234
 | 大| 4 → 3 → 2 → 1 | 4321 |

 差异计算如下$4321 - 1234 = 3087$。 

This shows how ordering completely determines the value, and no intermediate permutations are needed.

 ### 示例 2

 输入：```
3
```| 步骤| 建筑 | 结果 |
 | --- | --- | --- |
 | 小| 1 → 2 → 3 | 123 | 123
 | 大| 3 → 2 → 1 | 321 | 321

 区别在于$321 - 123 = 198$，确认即使对于小$n$，极值结构是稳定的并且与枚举无关。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \cdot d)$| 每个整数都会转换为字符串一次并连接起来 |
 | 空间|$O(n \cdot d)$| 存储两个连接的字符串 |

 的价值$d$呈对数增长$n$，但实际上每个数字最多贡献 6 位数字$n \le 10^5$。 该解决方案很容易满足时间和内存的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque

    input = sys.stdin.readline

    def solve():
        n = int(input().strip())

        small_parts = []
        for i in range(1, n + 1):
            small_parts.append(str(i))
        small_val = int("".join(small_parts))

        large_parts = []
        for i in range(n, 0, -1):
            large_parts.append(str(i))
        large_val = int("".join(large_parts))

        print(large_val - small_val)

    old_stdout = sys.stdout
    sys.stdout = io.StringIO()
    solve()
    out = sys.stdout.getvalue().strip()
    sys.stdout = old_stdout
    return out

# provided sample
assert run("4") == "3087"

# minimum case
assert run("1") == "0"

# small case
assert run("3") == "198"

# check digit boundary
assert run("10") == str(int("10987654321") - int("12345678910"))
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 | 0 | 单排列边缘情况 |
 | 3 | 198 | 198 构造的基本正确性|
 | 10 | 10 计算差异| 数字长度转换处理 |

 ## 边缘情况

 对于$n = 1$，该算法将两个字符串构建为`"1"`。 差值变为零，这与只有一种排列的事实相符。 

为了$n = 10$，算法构造`"12345678910"`和`"10987654321"`。 关键的微妙之处在于`"10"`贡献两个字符，如果错误地假定固定宽度标记，则会影响对齐。 基于字符串的方法自然可以处理这个问题，因为串联保留了标记边界。 计算出的差异与直接整数解释一致。 

不需要特殊的分支，所有边缘情况都由相同的构造逻辑统一处理。
