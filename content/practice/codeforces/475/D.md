---
title: "CF 475D - CGCDSSQ"
description: "我们得到一个整数列表和一组查询。 每个查询都会询问列表中有多少个连续子数组的最大公约数等于查询值。"
date: "2026-05-30T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "math"]
categories: ["algorithms"]
codeforces_contest: 475
codeforces_index: "D"
codeforces_contest_name: "Bayan 2015 Contest Warm Up"
rating: 2000
weight: 475
solve_time_s: 71
verified: true
draft: false
---

[CF 475D - CGCDSSQ](https://codeforces.com/problemset/problem/475/D)

 **评级：** 2000
 **标签：** 暴力破解、数据结构、数学
 **求解时间：** 1m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数列表和一组查询。 每个查询都会询问列表中有多少个连续子数组的最大公约数等于查询值。 简单来说，对于查询中的每个数字，我们想知道数组中有多少个连续元素共享该数字作为其最大共享除数。 例如，如果数组是`[2, 6, 3]`查询是`2`，子数组`[2]`和`[2, 6]`GCD 等于 2，计数为 2。 

该数组最多可以有`10^5`元素，查询次数可达`3 × 10^5`。 每个元素和每个查询可以大到`10^9`。 这种组合高`n`和高`q`立即排除任何单独考虑每个子数组的解决方案。 一种简单的方法需要检查 O(n^2) 个子数组，其中 n = 10^5 会导致大约 5 × 10^9 次操作，远远超过 2 秒的时间限制。 每个查询也无法通过重新扫描数组来独立处理，因为这会将工作量乘以 q。 

当元素重复或长段的 GCD 快速减小时，会出现不明显的边缘情况。 例如，在数组中`[4, 8, 16]`并查询`2`，简单的扫描可能会错过子数组，例如`[8, 16]`其 GCD 为 8 而不是 2，或者`[16]`其 GCD 为 16。当查询要求一个不是任何元素除数的数字时，会发生另一种微妙的情况； 答案应该是 0，而不是对接近匹配的错误计数。 

## 方法

 强力解决方案将迭代所有可能的起始索引，然后将每个子数组向右扩展，增量计算 GCD。 对于每个扩展，我们都会检查当前 GCD 是否与任何查询匹配。 这是正确的，因为它确实对每个子数组进行计数，但最坏情况的复杂度是 O(n^2)，对于 n 达到 10^5 时会失败。 

提高效率的关键在于，当向右扩展子数组时，GCD 函数不会增加。 一旦我们知道了以位置 i 结尾的子数组的 GCD，通过包含下一个元素来扩展它只会减少 GCD 或保持不变。 这意味着我们可以维护从可能的 GCD 到以当前位置结束的子数组数量的映射。 对于每个元素，我们获取所有先前的 GCD，使用 GCD 将它们与当前元素组合起来，并聚合计数。 这种动态编程方法在线性时间内生成所有可能的子数组 GCD，相对于每一步看到的唯一 GCD 值的数量。 每个步骤中不同 GCD 的数量以 O(log max(a_i)) 为界的观察结果确保了效率。 

此方法将 O(n^2) 问题转换为更接近 O(n log A) 的问题，其中 A 是最大元素。 它还允许我们预先计算所有可能的 GCD 的计数，从而使每个查询的查询应答时间复杂度为 O(1)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(1) | O(1) | 太慢了 |
 | GCD聚合| O(n log A + q) | O(n log A + q) | O(n log A) | O(n log A) | 已接受 |

 ## 算法演练

 1.初始化一个字典`count_gcd`存储所有子数组中遇到的每个 GCD 的累积计数。 这将允许在处理数组后直接查询答案。 
2.初始化另一个字典`current_gcds`它将 GCD 值映射到以具有该 GCD 的当前元素结尾的子数组的数量。 从空开始。 
3. 迭代每个元素`a[i]`在数组中。 对于每一步，初始化`next_gcds`作为一个空字典来存储以结尾的子数组的新 GCD 计数`i`。 
4. 包含仅包含的子数组`a[i]`本身。 放`next_gcds[a[i]] = 1`。 这处理单元素子数组。 
5. 对于每个GCD`g`在`current_gcds`, 计算`gcd(g, a[i])`并增加`next_gcds[gcd(g, a[i])]`按计数`current_gcds[g]`。 这会更新所有扩展子数组的计数。 
6. 合并`next_gcds`进入`count_gcd`通过添加他们的计数。 这保留了迄今为止遇到的每个 GCD 的总数。 
7. 更换`current_gcds`和`next_gcds`并继续下一个元素。 
8.处理完整个数组后，每次查询`x`可以通过查找来回答`count_gcd.get(x, 0)`。 

为什么它有效：该算法保持了不变式`current_gcds`正确计算每个可能的 GCD 以当前索引结尾的子数组的数量。 通过在数组上迭代，所有可能的子数组都被计算一次。 GCD 的非递增特性确保不会遗漏或重复计算子数组 GCD。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))
q = int(input())
queries = [int(input()) for _ in range(q)]

from collections import defaultdict

count_gcd = defaultdict(int)
current_gcds = {}

for num in a:
    next_gcds = defaultdict(int)
    next_gcds[num] += 1
    for g, cnt in current_gcds.items():
        new_g = math.gcd(g, num)
        next_gcds[new_g] += cnt
    for g, cnt in next_gcds.items():
        count_gcd[g] += cnt
    current_gcds = next_gcds

for x in queries:
    print(count_gcd.get(x, 0))
```第一个块读取输入并准备查询存储。 这`count_gcd`字典累积全局计数，同时`current_gcds`跟踪以当前位置结束的子数组。 使用`math.gcd`确保每个组合的正确性，并且`defaultdict(int)`防止按键错误。 增加计数而不是覆盖对于维护共享相同 GCD 的子数组的正确计数至关重要。 最后的循环直接打印来自预先计算的字典的结果。 

## 工作示例

 考虑样本输入`[2, 6, 3]`有疑问`[1, 2, 3, 4, 6]`。 

| 步骤| 当前_gcds | 下一个_gcds | 计数_gcd |
 | --- | --- | --- | --- |
 | 2 | {} | {2:1} | {2:1} |
 | 6 | {2:1} | {6:1, 2:1} | {2:2, 6:1} |
 | 3 | {6:1, 2:1} | {3:2,1:1} | {2:2,6:1,3:2,1:1} |

 该迹线显示了在每个位置结束的每个子阵列如何对总 GCD 计数做出贡献。 计数与查询的预期答案匹配：1 映射到 1、2 映射到 2、3 映射到 2、4 映射到 0、6 映射到 1。 

另一个例子：数组`[4, 8, 16]`并查询`[4,8,16,2]`。 

| 步骤| 当前_gcds | 下一个_gcds | 计数_gcd |
 | --- | --- | --- | --- |
 | 4 | {} | {4:1} | {4:1} |
 | 8 | {4:1} | {8:1,4:1} | {4:2,8:1} |
 | 16 | 16 {8:1,4:1} | {16:1,8:1,4:1} | {4:3,8:2,16:1} |

 所有子阵列均正确计数，包括重叠的 GCD。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log A + q) | O(n log A + q) | 在每个元素处，我们扩展至 O(log A) 个不同的 GCD，每个查询的访问时间为 O(1)。 |
 | 空间| O(n log A) | O(n log A) | 字典存储迄今为止看到的不同 GCD 的计数； 每个元素的时间复杂度为 O(log A)。 |

 和`n`最多 10^5 和`A`最多 10^9，log A ≈ 30，因此大约 3 × 10^6 次操作，在 2 秒内轻松完成。 

## 测试用例```python
import sys, io
def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    exec(open("solution.py").read())  # assume solution in solution.py
    return output.getvalue().strip()

# Provided sample
assert run("3\n2 6 3\n5\n1\n2\n3\n4\n6\n") == "1\n2\n2\n0\n1"

# Minimum-size input
assert run("1\n7\n3\n1\n7\n10\n") == "0\n1\n0"

# All-equal elements
assert run("3\n5 5 5
```
