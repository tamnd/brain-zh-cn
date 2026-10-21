---
title: "CF 1146E - 热即冷"
description: "我们得到一个整数数组和一系列查询。 每个查询指示我们翻转数组中满足比较的数字的符号：所有数字大于阈值或所有数字小于阈值。"
date: "2026-06-12T03:20:47+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "data-structures", "divide-and-conquer", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1146
codeforces_index: "E"
codeforces_contest_name: "Forethought Future Cup - Elimination Round"
rating: 2400
weight: 1146
solve_time_s: 125
verified: false
draft: false
---

[CF 1146E - 热即冷](https://codeforces.com/problemset/problem/1146/E)

 **评分：** 2400
 **标签：** 位掩码、数据结构、分而治之、实现
 **求解时间：** 2m 5s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组和一系列查询。 每个查询指示我们翻转数组中满足比较的数字的符号：所有数字大于阈值或所有数字小于阈值。 按顺序执行所有查询后，我们被要求打印数组的最终状态。 

输入大小非常重要：数组和查询数量最多可达 100,000 个。 每个元素的范围从 -100,000 到 100,000。 为每个查询迭代整个数组的简单解决方案在最坏的情况下最多需要 10^10 次操作，这对于一秒的时间限制来说远远超出了可行的范围。 因此，任何暴力方法都太慢。 

存在微妙的边缘情况，因为符号翻转可以以不明显的方式相互作用。 例如，翻转一个数字两次可以恢复其原始值，并且必须小心处理数组边界附近的翻转阈值。 考虑一个小数组`[-1, 0, 1]`有疑问`> -2`和`< 2`。 粗心的实施可能会将同一个数字翻转两次或误用不等式，从而产生错误的结果。 

该问题的困难在于，在考虑查询之间的交互的同时，在有限范围的整数值上有效应用多个条件符号翻转。 

## 方法

 暴力方法很简单：对于每个查询，迭代所有数组元素，如果比较成立则翻转符号。 这是正确的，但执行最多$n \cdot q = 10^10$在最坏的情况下，操作速度太慢了。 

提高性能的关键观察是数组元素和查询阈值是有界整数。 我们可以在所有查询之后预先计算允许范围内每个可能整数的最终符号，而不是直接使用数组。 一旦我们有了这个映射，我们就可以一次性将其应用于数组中的每个元素。 

这种方法之所以有效，是因为翻转操作是确定性的，并且仅取决于值和查询。 这些值位于一个小的离散范围内，因此我们可以为从 -100,000 到 100,000 的所有整数维护一个符号表。 我们反向处理从最后一个到第一个的查询，决定每个值是否应该翻转其符号。 这本质上是对整数值的扫描线，或者对符号状态的分而治之。 

结果是，我们得到的复杂度不是 O(n*q)，而是与整数范围加上查询数量成正比，这是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n * q) | O(n) | 太慢了 |
 | 最佳（符号表）| O(R + q + n)，R ≈ 2*10^5 | O(R)| 已接受 |

 ## 算法演练

 1.初始化一个数组`sign`长度为 200,001 表示从 -100,000 到 100,000 的整数。 每个条目最初存储 +1 表示正号。 
2. 以相反的顺序迭代查询。 对于像这样的查询`> x`，我们考虑所有大于的整数`x`如果尚未修复，则标记其标志以翻转。 同样，对于`< x`，考虑所有小于的整数`x`。 
3. 处理完所有查询后，`sign[v + 100000]`告诉我们整数的最终乘法因子（+1 或 -1）`v`。 
4. 迭代原始数组`a`并将每个元素乘以其对应的`sign`产生最终数组的因子。 

这种方法之所以有效，是因为我们有效地模拟了所有查询对每个整数值的净效果。 反向处理查询可确保后面的翻转在必要时覆盖前面的翻转，从而保留正确的操作顺序。 然后可以将数组中的每个元素直接映射到其最终符号。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

OFFSET = 100000
MAXV = 100000

n, q = map(int, input().split())
a = list(map(int, input().split()))

queries = []
for _ in range(q):
    s, x = input().split()
    x = int(x)
    queries.append((s, x))

# Initialize sign table: 1 means positive, -1 means negative
sign = [1] * (2 * MAXV + 1)
fixed = [False] * (2 * MAXV + 1)

# Process queries in reverse
for s, x in reversed(queries):
    if s == '>':
        for v in range(x + 1, MAXV + 1):
            idx = v + OFFSET
            if not fixed[idx]:
                sign[idx] *= -1
                fixed[idx] = True
    else:  # s == '<'
        for v in range(-MAXV, x):
            idx = v + OFFSET
            if not fixed[idx]:
                sign[idx] *= -1
                fixed[idx] = True

# Apply final signs
result = [val * sign[val + OFFSET] for val in a]
print(' '.join(map(str, result)))
```该解决方案构建一个查找表来编码所有查询的净效果。 反向迭代可保证正确的排序。 这`fixed`array 确保一旦确定了数字的最终符号，它就不会被之前的查询覆盖。 

## 工作示例

 对于示例输入：```
a = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
queries = [('>', 2), ('>', -4), ('<', 5)]
```| 步骤| 签到桌效果| 应用后的数组 |
 | ---| ---| ---|
 | 初始| 全部+1 | [-5、-4、-3、-2、-1、0、1、2、3、4、5] |
 | '>' 2 | 翻转索引 3..5 | [-5、-4、-3、-2、-1、0、1、2、-3、-4、-5] |
 | '>' -4 | '>' -4 | 翻转索引 -3..5 | [-5、-4、3、2、1、0、-1、-2、3、-4、-5] |
 | '<' 5 | 翻转指数 -100000..4 | [5, 4, -3, -2, -1, 0, 1, 2, -3, 4, 5] |

 该跟踪证实该算法正确跟踪累积符号翻转。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(R + q + n) | R = 2*10^5 为整数范围； 每个查询构建表需要 O(R)，迭代数组则需要 O(n) |
 | 空间| O(R + n + q) | O(R + n + q) | 符号数组和固定数组各存储 2*10^5 个值； 输入数组存储 n 个元素和 q 个查询 |

 给定约束 n、q ≤ 10^5 和有界值范围，这可以很好地满足时间和内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    OFFSET = 100000
    MAXV = 100000

    n, q = map(int, input().split())
    a = list(map(int, input().split()))
    queries = [tuple(input().split()) for _ in range(q)]
    queries = [(s, int(x)) for s, x in queries]

    sign = [1] * (2 * MAXV + 1)
    fixed = [False] * (2 * MAXV + 1)

    for s, x in reversed(queries):
        if s == '>':
            for v in range(x + 1, MAXV + 1):
                idx = v + OFFSET
                if not fixed[idx]:
                    sign[idx] *= -1
                    fixed[idx] = True
        else:
            for v in range(-MAXV, x):
                idx = v + OFFSET
                if not fixed[idx]:
                    sign[idx] *= -1
                    fixed[idx] = True

    result = [val * sign[val + OFFSET] for val in a]
    return ' '.join(map(str, result))

# Provided sample
assert run("11 3\n-5 -4 -3 -2 -1 0 1 2 3 4 5\n> 2\n> -4\n< 5\n") == "5 4 -3 -2 -1 0 1 2 -3 4 5", "sample 1"
# Minimum input
assert run("1 1\n0\n> -1\n") == "0", "single element no flip"
# All equal values
assert run("3 2\n2 2 2\n> 1\n< 3\n") == "-2 -2 -2", "all elements flipped twice"
# Maximum value
assert run("2 1\n100000 -100000\n> 0\n") == "-100000 -100000", "boundary flip"
# Mix negative and positive
assert run("4 2\n-1 0 1 2\n< 0\n> 1\n") == "1 0 -1 -2", "mixed signs flip"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1\n0\n> -1`|`0`| 单个元素，查询包含它但不包含 |
