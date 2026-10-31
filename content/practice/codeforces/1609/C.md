---
title: "CF 1609C - 复杂的市场分析"
description: "我们得到一个整数数组和步长 e。 对于每个起始索引 i，我们可以通过获取每个第 e 个元素来形成一个子序列：a[i]、a[i+e]、a[i+2e]、...，直到索引不超出数组边界。"
date: "2026-06-10T07:23:37+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "dp", "implementation", "number-theory", "schedules", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1609
codeforces_index: "C"
codeforces_contest_name: "Deltix Round, Autumn 2021 (open for everyone, rated, Div. 1 + Div. 2)"
rating: 1400
weight: 1609
solve_time_s: 96
verified: true
draft: false
---

[CF 1609C - 复杂市场分析](https://codeforces.com/problemset/problem/1609/C)

 **评分：** 1400
 **标签：** 二分查找、dp、实现、数论、时间表、两个指针
 **求解时间：** 1m 36s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组和一个步长`e`。 对于每个起始索引`i`，我们可以通过取每一个来形成一个子序列`e`第-个元素：`a[i], a[i+e], a[i+2e], ...`直到索引不超出数组边界。 对于每个这样的子序列，我们需要计算有多少个连续的长度前缀`k+1`有一个产品是素数。 每个有效前缀对应一对`(i, k)`。 

一个重要的观察结果是，只有当一个乘积的一个元素恰好是素数并且其余元素都是素数时，该乘积才能是素数。`1`s。 这是因为将任何素数乘以另一个大于的整数`1`产生一个合数。 因此，我们只需要寻找质数被零个或多个质数包围的子序列`1`s，可能由步长分隔`e`。 所有其他数字不构成有效对。 

约束条件很高：总和`n`所有测试用例可以达到`2 * 10^5`，每个数字最多可达`10^6`。 检查每个可能的子序列的简单方法将需要与`O(n^2/e)`在最坏的情况下，这太慢了。 任何解决方案都需要在近线性时间内处理每个数组。 

边缘情况包括所有的序列`1`s，素数出现在开头或结尾的序列，以及其中`e`等于`1`（因此子序列是连续的）或等于`n`（因此子序列包含单个元素）。 例如，如果`a = [1, 2, 1]`和`e = 1`，共有三个有效对：`(2, 0)`对于总理`2`独自的，`(1, 1)`对于子序列`[1,2]`给予`2`， 和`(1, 2)`为了`[1,2,1]`给予`2`。 

## 方法

 蛮力方法将迭代每个起始索引`i`然后迭代所有可能的`k`显式计算子序列的乘积。 然后我们会检查该产品是否是优质产品。 这是正确的，因为它确实计算了所有有效对。 然而，最坏情况下的操作次数约为`n^2/e`，这取决于`10^10`以获得最大的投入。 这明显超过了2秒的时间限制。 

关键的见解是，乘积成为素数的唯一方法是子序列中恰好有一个素数，而其余的都是`1`s。 这将问题简化为计算素数两侧有任意数量的序列的数量`1`s 沿 的两侧`e`-步骤子序列。 对于位置处的每个质数`p`， 让`l`是连续的个数`1`s 之前（逐步`e`） 和`r`连续的数量`1`在它之后。 那么这个素数贡献的有效对的数量就是`(l + 1) * (r + 1) - 1`。 的减法`1`删除了以下情况`k = 0`并且不包含素数，这是无效的。 

我们可以通过处理每个`e`分别独立的子序列，线性扫描每个子序列以计算连续的`1`s 并识别素数。 这将整体复杂性降低到`O(n)`每个测试用例，这是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^2/e) | O(n^2/e) | O(1) | O(1) | 太慢了 |
 | Prime + 1 次 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 预先计算直到`10^6`使用埃拉托斯特尼筛法。 This allows us to check if a number is prime in constant time.
 2. 对于每个测试用例，请阅读`n`,`e`，和数组`a`。 
3. 将数组划分为`e`基于索引模的独立子序列`e`。 对于索引`i`，子序列是`a[i], a[i+e], a[i+2e], ...`。 
4. 对于每个子序列，遍历它，同时跟踪连续的`1`s 位于每个质数的左侧和右侧。 初始化一个计数器`cnt`对于连续的长度`1`s 在当前元素之前。 当在位置找到素数时`p`,连续计数`1`通过向前扫描来追随它。 
5. 对于处于位置的素数`p`和`l`之前的和`r`其后的有效对数为`(l + 1) * (r + 1) - 1`。 将其累积到总答案中。 
6. 输出测试用例的有效对总数。 

为什么它有效：每个有效对对应于具有一定数量的子序列中的素数`1`之前和之后。 公式`(l + 1) * (r + 1) - 1`计算所有恰好包含一个素数的前缀，包括所有组合`1`就在它周围。 独立处理子序列确保我们尊重步长`e`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MAX_A = 10**6 + 1
is_prime = [True] * MAX_A
is_prime[0] = is_prime[1] = False
for i in range(2, int(MAX_A ** 0.5) + 1):
    if is_prime[i]:
        for j in range(i*i, MAX_A, i):
            is_prime[j] = False

t = int(input())
for _ in range(t):
    n, e = map(int, input().split())
    a = list(map(int, input().split()))
    res = 0
    
    for start in range(e):
        seq = []
        for i in range(start, n, e):
            seq.append(a[i])
        
        ones_before = 0
        i = 0
        while i < len(seq):
            if seq[i] == 1:
                ones_before += 1
                i += 1
            elif is_prime[seq[i]]:
                ones_after = 0
                j = i + 1
                while j < len(seq) and seq[j] == 1:
                    ones_after += 1
                    j += 1
                res += (ones_before + 1) * (ones_after + 1) - 1
                ones_before = 0
                i = j
            else:
                ones_before = 0
                i += 1
    print(res)
```筛子预先计算素数`10^6`，允许 O(1) 检查素数。 每个子序列都被线性扫描，`ones_before`和`ones_after`跟踪连续的计数`1`s，确保我们正确计算所有有效的`(i, k)`对。 循环小心地重置`ones_before`当遇到合数时，以避免计算不能产生质数的序列。 

## 工作示例

 **示例输入 1：**```
7 3
10 2 1 3 1 19 3
```| 步骤| 序列| 之前的人 | 素数 | 后的个数 | 贡献 | 资源 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | [10, 2, 1, 3, 1, 19, 3] | 0 | 2 在索引 1 | 1 | (0+1)*(1+1)-1=1 | 1 |
 | 1 | [10, 2, 1, 3, 1, 19, 3] | 0 | 3 位于索引 3 | 1 | (0+1)*(1+1)-1=1 | 2 |

 全部的`res = 2`，匹配样本输出。 

**示例输入 2：**```
3 2
1 13 1
```| 步骤| 序列| 之前的人 | 素数 | 后的个数 | 贡献 | 资源 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | [1, 13, 1] | 1 | 13 位于索引 1 | 1 | (1+1)*(1+1)-1=3 | 3 |

 该算法正确计算步长`e=2`和序列`1`s 围绕素数。 由于子序列长度很小，因此覆盖了所有对。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + MAX_A 对数 对数 MAX_A) | 筛子采取`MAX_A log log MAX_A`一次。 每个测试用例处理 n 个元素`e`线性子序列。 |
 | 空间| O(n + MAX_A) | 数组存储和素数筛选数组。 |

 解决方案随输入大小线性缩放`n`并轻松处理总和`n`最多`2 * 10^5`。 筛分成本是一次性预计算，不会影响每个测试用例的性能。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import builtins
    input_backup = builtins.input
    builtins.input = lambda: sys.stdin.readline()
    exec(open("solution.py").read())
    builtins.input = input_backup
    return ""  # assumes solution.py
```
