---
title: "CF 1203C - 公约数"
description: "我们被要求找到能整除给定数组中每个数字的正整数的数量。 该数组最多可包含 400,000 个元素，每个元素的大小可达 $10^{12}$。 从概念上讲，我们正在寻找所有数组元素的公约数集。"
date: "2026-06-11T23:42:03+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 1203
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 579 (Div. 3)"
rating: 1300
weight: 1203
solve_time_s: 99
verified: true
draft: false
---

[CF 1203C - 公约数](https://codeforces.com/problemset/problem/1203/C)

 **评分：** 1300
 **标签：** 实现、数学
 **求解时间：** 1m 39s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求找到能整除给定数组中每个数字的正整数的数量。 该数组最多可以包含 400,000 个元素，每个元素的大小为$10^{12}$。 从概念上讲，我们正在寻找所有数组元素的公约数集。 

输出是一个整数：这些除数的计数。 例如，在像这样的数组中`[2, 4, 6, 2, 10]`, 数字`1`和`2`将所有元素相除，所以答案是`2`。 

这些限制立即告诉我们我们的方法。 自从`n`可以是 4·10^5 并且每个数字最多为 10^12，我们无法迭代所有数字直到最大元素并检查整除性。 一个简单的解决方案需要迭代到`10^12`对于每个数组元素，这是不可行的。 我们需要一种方法，其复杂性取决于数字的除数数量而不是数字本身。 

当数组包含时会出现微妙的边缘情况`1`。 如果有一个元素是`1`，唯一的公约数是`1`。 类似地，如果所有元素都相同，则答案是该数字的约数个数。 具有大素数的数组也构成了挑战，因为它们的除数是有限的。 粗心的解决方案可能会根据数组大小而不是最大公约数在某个范围内进行迭代，从而产生不正确或低效的行为。 

## 方法

 暴力方法将尝试检查来自的每个整数`1`直到数组中的最小元素，计算那些除以所有元素的元素。 这是正确的，因为任何公约数都不能超过最小数。 然而，在最坏的情况下，最小数量最多可达$10^{12}$，并且测试每个数字的整除性太慢。 操作数大概是$10^{12} \cdot n$，永远无法在 2 秒内完成。 

关键的观察是，数组的公约数集合恰好是所有元素的最大公约数（GCD）的约数集合。 这是因为任何除以 GCD 的数字都会自动除以数组的每个元素，反之，任何除以所有数组元素的数字也会除以它们的 GCD。 使用欧几里德算法可以有效地计算所有数字的 GCD，即使对于非常大的数字也是如此。 一旦知道了 GCD，我们只需要计算它的约数即可。 计算除数至$\sqrt{g}$确保我们考虑所有除数对而不迭代超出平方根。 

这一观察结果将问题从潜在的巨大搜索空间减少到可管理的程度，其中操作大致与$n \log(\text{max element})$用于 GCD 计算和$O(\sqrt{g})$用于计算除数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * 分钟(a)) | O(1) | O(1) | 太慢了 |
 | GCD + 除数计数 | O(n log max(a) + √g) | O(n log max(a) + √g) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 从输入读取数组并将元素存储在列表中。 这是计算所有元素的 GCD 所必需的。 
2. 初始化变量`g`与第一个元素。 这将存储正在运行的 GCD。 
3. 迭代数组的剩余元素。 对于每个元素`a[i]`， 更新`g`作为 GCD`g`和`a[i]`使用欧几里得算法。 此步骤确保在循环结束时，`g`是整个数组的 GCD。 
4. 初始化计数器`count`为零。 这将跟踪除数的数量`g`.
5. Iterate over all integers `d`从`1`的整数平方根`g`. For each `d`, check if `g % d == 0`. If true, increment `count` by 1 because `d` is a divisor.
6. For each divisor `d` that is not equal to `g // d`, 增量`count`除以 1 来计算配对除数。 此步骤确保我们不会重复计算完全平方数。 
7. 打印值`count`, which is the number of positive integers that divide all elements of the array.

Why it works: The invariant here is that any divisor of the GCD divides all numbers in the array. Conversely, any number that divides all elements divides the GCD. By iterating up to the square root of `g`并计算每个除数对，我们确保每个公约数都被精确地计算一次。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))

g = a[0]
for num in a[1:]:
    g = math.gcd(g, num)

count = 0
sqrt_g = int(g**0.5)
for d in range(1, sqrt_g + 1):
    if g % d == 0:
        count += 1
        if d != g // d:
            count += 1

print(count)
```该代码使用有效地读取输入`sys.stdin.readline`并使用Python的内置计算GCD`math.gcd`。 我们循环除数直到平方根，以有效地计算所有除数而不重复。 支票`d != g // d`确保我们正确处理完美平方。 

## 工作示例

 ### 示例 1

 输入：```
5
1 2 3 4 5
```| 步骤| 克| 除数计数 | 笔记|
 | --- | --- | --- | --- |
 | 初始| 1 | 0 | 从 g = a[0] = 1 | 开始
 | GCD 循环 | 1 | 0 | gcd(1,2)=1, gcd(1,3)=1, gcd(1,4)=1, gcd(1,5)=1 |
 | 除数循环| 1 | 1 | 唯一的除数是 1 |

 输出：`1`。 正确，因为只有 1 能整除所有数字。 

### 自定义示例 2

 输入：```
4
2 4 6 8
```| 步骤| 克| 除数计数 | 笔记|
 | --- | --- | --- | --- |
 | 初始| 2 | 0 | g = a[0] = 2 |
 | GCD 循环 | 2 | 0 | gcd(2,4)=2, gcd(2,6)=2, gcd(2,8)=2 |
 | 除数循环| 2 | 2 | 约数是 1 和 2 |

 输出：`2`。 正确，2 的约数可以整除所有元素。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log max(a) + √g) | O(n log max(a) + √g) | GCD 计算为 O(n log max(a))，计算除数为 O(√g) |
 | 空间| O(n) | 存储数组 |

 该算法很容易满足以下约束：n ≤ 4·10^5 且数字最多为 10^12。 除数计数循环以√(10^12) ≈ 10^6为界，在时间限制内是可以接受的。 

## 测试用例```python
import sys, io
import math

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    a = list(map(int, input().split()))
    g = a[0]
    for num in a[1:]:
        g = math.gcd(g, num)
    count = 0
    sqrt_g = int(g**0.5)
    for d in range(1, sqrt_g + 1):
        if g % d == 0:
            count += 1
            if d != g // d:
                count += 1
    return str(count)

# Provided sample
assert run("5\n1 2 3 4 5\n") == "1", "sample 1"

# All equal numbers
assert run("4\n6 6 6 6\n") == "4", "all equal"

# Single element
assert run("1\n10\n") == "4", "single element divisors"

# Large prime numbers
assert run("3\n17 34 51\n") == "2", "common divisors of 17,34,51"

# Perfect squares
assert run("3\n16 32 48\n") == "5", "divisors of 16"

# Mixed small and large numbers
assert run("5\n1 1000000000000 500000000000 250000000000 125000000000\n") == "1", "only 1 divides all"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 4 6 6 6 6 | 4 6 6 6 6 4 | 处理所有相等的元素 |
 | 1 10 | 1 4 | 单晶案例|
 | 17 34 51 | 17 34 51 2 | 素数的 GCD |
 | 16 32 48 | 5 | 完美的方形处理|
 | 1 1000000000000 500000000000 250000000000 125000000000 | 1 | 只有 1 个公约数的大数 |

 ## 边缘情况

 当数组包含`1`与更大的数字一起，例如“[1, 2, 3,
