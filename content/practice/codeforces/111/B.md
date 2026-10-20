---
title: "CF 111B - Petya 和除数"
description: "我们被要求处理一系列查询，每个查询由两个整数 x 和 y 定义。 对于每个查询，我们需要计算有多少 x 的正因数不能整除序列中紧邻 x 之前的任何 y 数字，即数字 x-y、x-y+1、...、x-1。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 111
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 85 (Div. 1 Only)"
rating: 1900
weight: 111
solve_time_s: 170
verified: true
draft: false
---

[CF 111B - Petya 和除数](https://codeforces.com/problemset/problem/111/B)

 **评级：** 1900
 **标签：** 二分查找、数据结构、数论
 **求解时间：** 2m 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求处理一系列查询，每个查询由两个整数 x 和 y 定义。 对于每个查询，我们需要计算有多少 x 的正因数**不**整除序列中紧邻 x 之前的任何 y 数字，即数字 x-y、x-y+1、...、x-1。 如果 y 为零，则答案只是 x 的约数个数，因为没有前面的数字可供检查。 

输入最多允许 100,000 个查询，x 可以大到 100,000。 这意味着任何简单地迭代 x 的所有除数并针对每个查询最多 x 个数字进行检查的解决方案都将太慢。 针对所有相关的先前数字迭代每个查询的每个除数的强力方法可能会接近 10^10 次运算，这是难以管理的。 我们需要一种使用数论属性预先计算或减少工作量的解决方案。 

非明显的边缘情况包括 y = 0 的查询（这是一种捷径情况）和较小的 x 值，特别是 x = 1 或素数，其中除数很简单，但如果我们不正确处理它们，边界条件可能会失败。 另一种边缘情况是当 y 超过 x 时，但约束保证 0 ≤ y ≤ i-1，因此我们永远不会访问先前 x 值的负索引。 

## 方法

 暴力方法会为每个查询枚举 x 的所有除数，然后对照 y 之前的数字检查每个除数，看看它是否能整除其中的任何一个。 对于每个查询，这可能涉及最多 O(sqrt(x)) 除数乘以 O(y) 个先前数字，在最坏的情况下达到 O(n * sqrt(x) * n) ≈ 10^10 次操作。 这显然太慢了。 

关键的观察是，我们只需要知道 x 的除数 d 是否作为任何先前 y 数的除数出现。 我们可以为每个除数 d 维护一个作为除数出现的最后一个查询索引的记录，而不是单独针对每个先前的数字测试每个除数。 然后对于当前查询，我们只需检查最后一次出现是否在最后 y 个查询中。 如果是，我们跳过计算 d； 如果没有，我们就算d。 这减少了枚举 x 的除数并对每个除数执行简单查找的工作，这是可行的，因为每个 x 最多有 O(sqrt(x)) 个除数。 

这种方法利用预计算和缓存，有效地将潜在的二次检查转换为每个除数的一组恒定时间检查。 它是数论预处理与巧妙状态跟踪相结合的经典应用。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * sqrt(x) * n) | O(n * sqrt(x) * n) | O(n) | 太慢了 |
 | 除数跟​​踪 | O(n * sqrt(x)) | O(n * sqrt(x)) | O(max_x) | 已接受 |

 ## 算法演练

 1. 预先计算所有数字的除数，直到最大可能的 x。 我们可以通过从 1 迭代到 max_x 并将 i 作为除数添加到 i 的所有倍数来做到这一点。 这给出了 O(max_x * log(max_x)) 预处理。 对于每个查询，我们可以立即检索 x 的除数。 
2.初始化一个数组或者字典，`last_seen`，存储每个除数出现的最后一个查询索引。 
3. 按顺序处理查询。 对于具有值 x 和 y 的查询 i，迭代 x 的所有除数 d。 
4. 对于每个除数 d，检查`last_seen[d]`。 如果它小于i-y，这意味着d没有出现在前面的y个数字中，我们增加计数。 
5. 更新`last_seen[d]`以i表示x的所有约数，记录当前查询索引。 
6. 打印当前查询的计数。 

这是有效的，因为不变量`last_seen[d]`始终存储最近的查询索引，其中 d 是除数，确保出现在 x-y 到 x-1 范围内的任何除数都将被正确跳过。 通过跟踪指数而不是之前的完整数字，我们可以避免重复的除数检查。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MAX_X = 100000

# Precompute divisors for all numbers up to MAX_X
divisors = [[] for _ in range(MAX_X + 1)]
for i in range(1, MAX_X + 1):
    for j in range(i, MAX_X + 1, i):
        divisors[j].append(i)

def main():
    n = int(input())
    last_seen = [0] * (MAX_X + 1)
    
    for idx in range(1, n + 1):
        x_str, y_str = input().split()
        x = int(x_str)
        y = int(y_str)
        
        count = 0
        for d in divisors[x]:
            if last_seen[d] <= idx - y - 1:
                count += 1
            last_seen[d] = idx
        print(count)

if __name__ == "__main__":
    main()
```这`divisors`数组让我们可以立即检索 x 的所有除数，从而避免重新计算。 我们使用基于 1 的查询索引，以便`idx - y - 1`正确识别最后一次出现的除数是否落在 y 之前的查询之外。 更新中`last_seen[d]`检查后确保下一个查询的正确性。 

## 工作示例

 使用示例输入：```
6
4 0
3 1
5 2
6 2
18 4
10000 3
```| 查询 | x| y | x 的约数 | 计数| 查询后的last_seen |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 4 | 0 | 1,2,4 | 3 | 1→1, 2→1, 4→1 |
 | 2 | 3 | 1 | 1,3 | 1 | 1→2, 3→2 |
 | 3 | 5 | 2 | 1,5 | 1,5 | 1 | 1→3, 5→3 |
 | 4 | 6 | 2 | 1,2,3,6 | 2 | 1→4,2→4,3→4,6→4 |
 | 5 | 18 | 18 4 | 1,2,3,6,9,18 | 2 | 1→5,2→5,3→5,6→5,9→5,18→5 |
 | 6 | 10000 | 3 | 1,2,4,5,... | 22 | 22 相应更新 |

 该痕迹表明`last_seen`正确地跳过最近出现的除数，并计算所有其他除数。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * sqrt(MAX_X)) | O(n * sqrt(MAX_X)) | 每个查询处理 x 的除数，每个查询最多 O(sqrt(x))。 |
 | 空间| O(MAX_X) | 储存`last_seen`以及 MAX_X 以内所有数字的除数列表。 |

 当 n ≤ 10^5 且 x ≤ 10^5 时，O(n * sqrt(MAX_X)) ≈ 10^7 次操作，完全在 5 秒限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    main()
    sys.stdout = sys.__stdout__
    return output.getvalue().strip()

# provided sample
assert run("6\n4 0\n3 1\n5 2\n6 2\n18 4\n10000 3\n") == "3\n1\n1\n2\n2\n22", "sample 1"

# minimum x
assert run("1\n1 0\n") == "1", "minimum x"

# all primes
assert run("3\n2 0\n3 1\n5 2\n") == "2\n1\n1", "primes"

# y=0 edge
assert run("2\n12 0\n7 0\n") == "6\n2", "y zero case"

# large x
assert run("1\n100000 0\n") == "36", "large x with all divisors counted"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1\n1 0 | 1\n1 0 1 | 最小 x 值，平凡除数 |
 | 3\n2 0\n3 1\n5 2 | 2\n1\n1 | 2\n1\n1 | 素数和 y > 0 跳过 |
 | 2\n12 0\n7 0 | 6\n2 | y = 0 快捷方式处理 |
 | 1\n100000 0 | 36 | 36 大 x 的正确性 |

 ## 边缘情况

 例如，对于 y = 0 的查询`x = 12, y = 0`，该算法检索所有除数 [1,2,3,4,6,12] 并对它们进行计数，而不检查先前的查询。`last_seen`更新当前查询索引。 这会产生正确的输出 6。 

例如，对于 y > 0 的查询`x = 5, y = 2`在之前的查询 4 ​​和 3 之后，`last_seen[1] = 3`和`last_seen[5] = 2`。 因为 `idx - y - 1 = 3 - 2 - 1 =
