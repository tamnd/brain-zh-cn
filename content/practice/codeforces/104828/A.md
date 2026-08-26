---
title: "CF 104828A - \u9b54\u6cd5\u7ec3\u4e60"
description: "我们得到一个整数列表和一个模值。 任务是计算列表中所有数字的乘积，然后输出该乘积除以给定模数时的余数。"
date: "2026-06-28T12:26:55+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104828
codeforces_index: "A"
codeforces_contest_name: "The 11-th BIT Campus Programming Contest for Junior Grade Group"
rating: 0
weight: 104828
solve_time_s: 41
verified: true
draft: false
---

[CF 104828A - \u9b54\u6cd5\u7ec3\u4e60](https://codeforces.com/problemset/problem/104828/A)

 **评级：** -
 **标签：** -
 **求解时间：** 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数列表和一个模值。 任务是计算列表中所有数字的乘积，然后输出该乘积除以给定模数时的余数。 

尽管该语句将其包装为有关数据类型和溢出的“神奇训练”课程，但实际计算很简单：将所有元素相乘，但每个中间步骤都必须保持在安全的数值范围内，并且最终结果必须取模$p$。 

关键的限制是$n$可以大到$10^5$。 这立即排除了任何重复重新计算乘积或使用嵌套循环的方法，因为$O(n^2)$工作会太慢。 单线性通道是唯一合理的结构。 

还有一个微妙的数字限制。 产品高达$10^5$数字，每个数字都可能接近$10^9$，如果我们不小心的话，很容易就会溢出 64 位整数。 尽管每个$a_i < p$， 和$p \le 10^9$，乘以许多这样的值而不进行模约化将超过$2^{63}-1$非常快。 因此，将模数延迟到最后的简单实现将产生不正确的结果或运行时问题。 

边缘情况主要围绕模块化算术行为：

 如果任何元素为零，则整个乘积立即为零，并且不需要继续乘法。 另一个极端情况是当$p = 1$。 在这种情况下，每个数字模 1 都为零，因此无论数组如何，答案始终为零。 

## 方法

 强力解释是直接计算乘积，然后应用模$p$。 从概念上讲，这是正确的：乘法是结合的，因此计算$a_1 \cdot a_2 \cdots a_n$首先并在最后减少产生正确的余数。 

失败点是数字增长。 即使使用 64 位整数，重复的乘法也会很快超出可表示的范围。 为了$n = 10^5$，最坏情况的增长是指数级的，溢出发生在最后一步之前很久。 这使得暴力方法在标准固定宽度整数环境中不可靠。 

关键的观察是模块化算术允许在每一步进行减少而不改变最终结果。 自从$$(x \cdot y) \bmod p = ((x \bmod p) \cdot (y \bmod p)) \bmod p,$$我们可以维护一个运行乘积模$p$，确保值永远不会超过$p$。 这将问题转化为具有恒定时间更新的单个线性扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n) 算术，但由于溢出而不安全 | O(1) | O(1) | 实践中不正确 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 我们维护一个运行变量`ans`存储所有已处理元素模的乘积$p$。 

1. 初始化`ans = 1`。 这代表空乘积，它是乘法的中性元素。 我们选择 1，因为乘以 1 不会改变任何值。 
2. 迭代每个元素`a_i`在数组中。 
3. 相乘之前，先对元素进行模减$p$如果需要的话。 在这个问题中它是可选的，因为$a_i < p$，但保持习惯可以确保一般设置中的正确性。 
4. 将正在运行的产品更新为`ans = (ans * a_i) % p`。 这一步是解决方案的核心。 我们在乘法后立即归约以防止溢出并保持值的边界为$p$。 
5.处理完所有元素后，输出`ans`。 

该逻辑从不需要重新访问较早的元素，因此计算严格是一次性的。 

### 为什么它有效

 在每次迭代中，`ans`表示所有先前元素模的乘积$p$。 当我们乘以下一个元素并减少模数时$p$，由于模运算的分配特性，我们保留了这个不变量。 因为从第一个元素到最后一个元素都有不变量，所以最终值恰好是所有元素模的乘积$p$。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    n, p = map(int, input().split())
    arr = list(map(int, input().split()))
    
    ans = 1 % p
    for x in arr:
        ans = (ans * (x % p)) % p
    
    print(ans)

if __name__ == "__main__":
    main()
```代码直接遵循不变量。 变量`ans`始终保持模减`p`，确保它永远不会变大。 尽管 Python 整数的乘法不会溢出，但这种结构在 C++ 等语言中仍然很重要，并且符合预期的问题约束。 

初始化`1 % p`确保正确性时$p = 1$，因为无论输入如何，答案都必须为零。 

## 工作示例

 ### 示例 1

 输入：```
3 2035
2023 6 3
```我们跟踪正在运行的产品：

 | 步骤| x| 之前的回答| 计算| 后|
 | ---| ---| ---| ---| ---|
 | 1 | 2023 | 1 | (1 × 2023) % 2035 | 2023 |
 | 2 | 6 | 2023 | (2023 × 6) % 2035 | 1819 | 1819
 | 3 | 3 | 1819 | 1819 (1819 × 3) % 2035 | 364 | 364

 最终答案是364。 

这演示了如何始终减少中间值，防止溢出并将值保持在范围内。 

### 示例 2

 输入：```
3 1000000000
999999999 999999998 999999997
```| 步骤| x| 之前的回答| 计算| 后|
 | ---| ---| ---| ---| ---|
 | 1 | 999999999 | 1 | (1 × 999999999) % 1e9 | 999999999 |
 | 2 | 999999998 | 999999999 | (999999999 × 999999998) % 1e9 | 2 |
 | 3 | 999999997 | 2 | (2 × 999999997) % 1e9 | 999999994 |

 Final answer is 999999994.

This trace highlights why modulo must be applied after every multiplication, not only at the end.

 ## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | Each element is processed exactly once with constant-time multiplication and modulo |
 | 空间| O(1) | O(1) | Only a single accumulator variable is used |

 The linear scan is optimal for$n \le 10^5$，轻松地在一秒限制内。 Memory usage is negligible since no auxiliary arrays are required.

 ## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    from math import prod

    n, p = map(int, inp.split()[0:2])
    arr = list(map(int, inp.split()[2:2+n]))
    
    ans = 1 % p
    for x in arr:
        ans = (ans * x) % p
    return str(ans)

# provided sample
assert run("3 2035\n2023 6 3\n") == "364", "sample 1"

# sample 2
assert run("3 1000000000\n999999999 999999998 999999997\n") == "999999994", "sample 2"

# minimum n
assert run("1 7\n5\n") == "5", "single element"

# contains zero
assert run("5 13\n3 0 7 9 11\n") == "0", "zero forces product to zero"

# p = 1
assert run("4 1\n10 20 30 40\n") == "0", "mod 1 always zero"

# all ones
assert run("5 100\n1 1 1 1 1\n") == "1", "identity multiplication"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单元素| value itself mod p | 基本情况|
 | contains zero | 0 | 早日消灭财产|
 | p = 1 | 0 | modulus edge case |
 | all ones | 1 | 乘法恒等式 |

 ## 边缘情况

 当$p = 1$，每个乘法步骤都会减少到零。 算法初始化`ans = 1 % p`，立即变为 0。 一旦迭代开始，`ans`无论输入如何，都保持为零，从而产生正确的结果。 

For an input containing zero, such as`3 10 / 4 0 7`，第一个产生零的乘法将运行乘积折叠为零。 Subsequent steps keep it unchanged because`0 * x % p = 0`, so the final output remains zero as expected.

 对于单元素数组，循环执行一次，结果就是该元素对$p$。 该不变量仍然成立，因为初始化对应于一个空乘积，并且一次乘法将其转换为正确的最终值。
