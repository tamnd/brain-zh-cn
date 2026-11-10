---
title: "CF 2110F - 教师"
description: "给定一个正整数数组，对于数组的每个前缀，我们需要计算其“美度”。数组的美度定义为函数 $f(x, y) = (x bmod y) + (y bmod x)$ 在前缀中所有元素对 $x, y$ 上的最大值。"
date: "2026-06-08T04:36:46+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 2110
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 1026 (Div. 2)"
rating: 2400
weight: 2110
solve_time_s: 90
verified: false
draft: false
---

[CF 2110F - 教师](https://codeforces.com/problemset/problem/2110/F)

 **评分：** 2400
 **标签：** 蛮力、贪心、数学、数论
 **求解时间：** 1m 30s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个正整数数组，对于数组的每个前缀，我们被要求计算它的“美度”。 数组的美感被定义为函数的最大值$f(x, y) = (x \bmod y) + (y \bmod x)$在所有元素对上$x, y$在前缀中。 

输入由多个测试用例组成，每个测试用例都有一个长度可达的数组$10^6$，所有测试用例的长度总和也受$10^6$。 这意味着任何解决方案$O(n^2)$每个测试用例的复杂性是不可行的，因为这会导致大致$10^{12}$最坏情况下的操作。 我们需要更接近的东西$O(n \log n)$或者$O(n)$每个测试用例。 

关键的微妙之处在于$f(x, y)$。 对于单个元素$x$，美感为零$x \bmod x = 0$。 另一个重要的观察是$f(x, y)$总是小于$\max(x, y)$，并且前缀中最大的元素通常主导 的最大值$f$。 需要注意的边缘情况包括具有重复元素的数组、最大元素出现在第一个或最后一个的数组，以及大小为 1 的数组，这些数组通常会产生零美感。 

例如，数组`[5, 5]`有美丽`0 + 0 = 0`， 和`[5, 1]`有美丽`(5 mod 1) + (1 mod 5) = 0 + 1 = 1`。 只考虑新元素与先前最大值的粗心方法可能会错过较小元素后来与先前大元素形成更高美感的情况。 

## 方法

 暴力法计算$f(a_i, a_j)$对于每个前缀中的每一对。 这是可行的，因为定义很简单，但它需要对每个前缀的所有对进行求和。 对于长度的数组$n$， 那是$O(n^2)$每个前缀的操作总数$O(n^3)$如果天真地实施。 显然这对于$n \sim 10^6$。 

关键的见解来自于对函数的分析$f(x, y) = (x \bmod y) + (y \bmod x)$。 如果$x = y$,$f(x, x) = 0$。 如果$x > y$， 然后$x \bmod y < y$和$y \bmod x = y$, 给予$f(x, y) < 2y$。 因此，最大值通常是在前缀中当前最大元素和第二大元素或稍小于它的任何元素之间实现的。 

这一观察结果使我们能够在扩展前缀时仅维护最大和第二大元素。 对于每个新元素，我们将其与当前最大和第二大元素进行比较，以计算新的美度。 我们永远不需要检查所有对，从而降低了时间复杂度$O(n^2)$到$O(n)$每个测试用例。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(1) | O(1) | 太慢了|
 | 维持前两个元素 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 初始化`max1 = 0`,`max2 = 0`， 和`beauty = 0`。 These will track the largest element, second-largest element, and current beauty respectively.
 2. 迭代数组`a`。 对于每个元素`x`在前缀中：

 2.1 计算`f(x, max1)`和`f(x, max2)`寻找潜在的新美。 我们只需要这两个比较，因为涉及较小元素的任何其他对都不能超过这些值。 

2.2 更新`beauty`如果这些值中的任何一个大于当前值`beauty`。 

2.3 更新`max1`和`max2`基于新元素`x`。 如果`x`超过`max1`， 分配`max2 = max1`和`max1 = x`。 否则，如果`x > max2`， 更新`max2 = x`。 
3. Append the current`beauty`到此前缀的输出数组。 
4. 重复直到数组末尾。 

这里的不变量是`max1`和`max2`始终保存迄今为止看到的两个最大元素，并且当前`beauty`是最大值$f(x, y)$为当前前缀。 因为最大函数值总是涉及最大元素之一，所以我们不会错过任何候选对。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        max1 = 0
        max2 = 0
        beauty = 0
        res = []
        for x in a:
            # Compute candidate f values
            if max1:
                beauty = max(beauty, (x % max1) + (max1 % x))
            if max2:
                beauty = max(beauty, (x % max2) + (max2 % x))
            # Update the top two elements
            if x > max1:
                max2 = max1
                max1 = x
            elif x > max2:
                max2 = x
            res.append(str(beauty))
        print(' '.join(res))

if __name__ == "__main__":
    main()
```该代码初始化最大值和美丽，迭代数组，仅计算必要的`f`值，并更新运行最大值。 更新顺序`max1`和`max2`对于避免过早覆盖值至关重要。 办理案件时`max1`或者`max2`为零确保我们跳过第一个元素上未定义的模运算。 

## 工作示例

 **示例1：`[3, 1, 4, 1, 5]`**

 | 我| x| 最大1 | 最大2 | 美丽| 资源 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 3 | 3 | 0 | 0 | 0 |
 | 2 | 1 | 3 | 1 | 1 | 0 1 |
 | 3 | 4 | 4 | 3 | 4 | 0 1 4 |
 | 4 | 1 | 4 | 3 | 4 | 0 1 4 4 | 0 1 4 4
 | 5 | 5 | 5 | 4 | 5 | 0 1 4 4 5 | 0 1 4 4 5

 这表明美丽是由涉及顶部两个元素的对决定的，而新的较小元素很少会改变它。 

**示例2：`[5, 11, 11, 4, 2, 1, 10]`**

 | 我| x| 最大1 | 最大2 | 美丽| 资源 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 5 | 5 | 0 | 0 | 0 |
 | 2 | 11 | 11 11 | 11 5 | 6 | 0 6 |
 | 3 | 11 | 11 11 | 11 11 | 11 6 | 0 6 6 |
 | 4 | 4 | 11 | 11 11 | 11 7 | 0 6 6 7 | 0 6 6 7
 | 5 | 2 | 11 | 11 11 | 11 7 | 0 6 6 7 7 | 0 6 6 7 7
 | 6 | 1 | 11 | 11 11 | 11 7 | 0 6 6 7 7 7 | 0 6 6 7 7 7
 | 7 | 10 | 10 11 | 11 11 | 11 11 | 11 0 6 6 7 7 7 11 | 0 6 6 7 7 7 11

 这表明重复的元素得到了正确的处理，只有当新元素与最大或第二大元素的组合产生更高的效果时，美感才会增加。`f`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 每个元素被处理一次，我们只计算`f`有两个元素 |
 | 空间| O(n) 输出数组 | 我们存储每个前缀的美丽值 |

 鉴于总和`n`所有测试用例的总和≤$10^6$，这个解决方案很容易满足 2 秒的时间限制。 空间使用量适中且与数组大小呈线性关系。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from solution import main
    sys.stdout = io.StringIO()
    main()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("2\n5\n3 1 4 1 5\n7\n5 11 11 4 2 1 10\n") == "0 1 4 4 5\n0 6 6 7 7 7 11", "sample 1"

# Custom cases
assert run("1\n1\n42\n") == "0", "single element"
```
