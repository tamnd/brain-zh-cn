---
title: "CF 1760C - 优势"
description: "我们有一份竞争对手名单，每个人都有一定的实力。 对于每个竞争对手，我们都想计算他们相对于除自己之外的最强对手的优势。 具体来说，如果强度数组是 [s1, s2, ..."
date: "2026-06-09T14:20:24+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1760
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 835 (Div. 4)"
rating: 800
weight: 1760
solve_time_s: 166
verified: false
draft: false
---

[CF 1760C - 优势](https://codeforces.com/problemset/problem/1760/C)

 **评分：** 800
 **标签：** 数据结构、实现、排序
 **求解时间：** 2m 46s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一份竞争对手名单，每个人都有一定的实力。 对于每个竞争对手，我们都想计算他们相对于除自己之外的最强对手的优势。 具体来说，如果强度数组是`[s_1, s_2, ..., s_n]`，对于每个`i`我们需要找到所有值中最大的值`s_j`和`j ≠ i`，并从中减去它`s_i`。 如果出现以下情况，结果可能为负：`s_i`比所有其他的都小。 

约束允许最多`2 * 10^5`所有测试用例的参与者，每个人的强度高达`10^9`。 这意味着任何针对每个竞争对手迭代所有参与者（导致每个测试用例执行 O(n²) 操作）的解决方案都会太慢。 总和`n`被限制于`2 * 10^5`允许每个测试用例的线性或线性算术解决方案。 对数组进行固定次数的排序或扫描是可行的。 

需要注意的主要边缘情况是多个参与者共享最大强度的阵列。 如果最大值出现多次，删除其中一个仍会留下相同的最大值。 例如，在`[5, 5, 3]`，第一个参与者最多看到 5 个，给出`5 - 5 = 0`， 不是`5 - 3 = 2`。 具有所有相等值的数组是另一种边缘情况，例如，`[4, 4, 4, 4]`，其中每个参与者的优势为零。 

## 方法

 一种简单的暴力方法将对每个参与者进行迭代，扫描所有其他参与者，然后选择最大值。 这是可行的，因为它直接实现了问题陈述，但操作计数是`n * (n-1)`，在最坏的情况下大约为 4 * 10^10 如果`n`是 2 * 10^5。 这太慢了。 

更快方法的关键见解是，所有其他参与者的最大值要么是数组的全局最大值，要么如果当前参与者持有最大值，则为数组中的第二大值。 因此，我们只需要知道每个测试用例中最大和第二大的优势。 一旦知道这两个值，计算每个参与者的优势就变成了一次减法运算。 这将工作量减少到一次计算两个最大值和另一次计算答案，每个测试用例实现 O(n)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(1) | O(1) | 太慢了|
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 
2. 对于每个测试用例，请阅读`n`以及一系列的优势`s`。 
3.初始化两个变量`max1`和`max2`存储最大和第二大的值。 迭代`s`一次，更新这些变量。 如果一个数字大于`max1`， 分配`max2 = max1`和`max1 = number`。 如果是介于`max1`和`max2`， 分配`max2 = number`。 
4. 再次遍历数组。 对于每个参与者来说，如果他们的实力相等`max1`，他们的“其他最大值”是`max2`; 否则，就是`max1`。 
5. 计算参与者的力量与其对应的“其他最大值”之间的差异，并将其输出。 

为什么它有效：在每一步，`max1`和`max2`正确存储最大和第二大的数字。 对于任何参与者，如果他们是最大的，删除他们就会暴露`max2`作为下一个最大的。 否则，删除它们不会改变最大值。 这个不变量保证了正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    s = list(map(int, input().split()))
    max1 = max2 = -1
    for num in s:
        if num > max1:
            max2 = max1
            max1 = num
        elif num > max2:
            max2 = num
    res = []
    for num in s:
        other_max = max2 if num == max1 else max1
        res.append(num - other_max)
    print(' '.join(map(str, res)))
```第一个循环计算两个最大值。 第二个循环计算每个参与者在恒定时间内的优势。 使用`max2 if num == max1 else max1`确保如果多个参与者共享最大值，每个参与者仍然使用正确的“其他最大值”。 快速 I/O 在处理大输入时可防止 TLE。 

## 工作示例

 输入跟踪`[4, 7, 3, 5]`:

 | 参与者 | s_i | 最大1 | 最大2 | 其他_最大 | s_i - other_max | s_i - other_max |
 | --- | --- | --- | --- | --- | --- |
 | 4 | 4 | 7 | 5 | 7 | -3 |
 | 7 | 7 | 7 | 5 | 5 | 2 |
 | 3 | 3 | 7 | 5 | 7 | -4 |
 | 5 | 5 | 7 | 5 | 7 | -2 |

 这证实了该算法正确地区分了最大的参与者和其他参与者。 

输入跟踪`[4, 4, 4, 4]`:

 | 参与者 | s_i | 最大1 | 最大2 | 其他_最大 | s_i - other_max | s_i - other_max |
 | --- | --- | --- | --- | --- | --- |
 | 4 | 4 | 4 | 4 | 4 | 0 |
 | 4 | 4 | 4 | 4 | 4 | 0 |
 | 4 | 4 | 4 | 4 | 4 | 0 |
 | 4 | 4 | 4 | 4 | 4 | 0 |

 这表明所有同等强度的边缘情况都得到了正确处理。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 单遍查找 max1 和 max2，单遍计算差异 |
 | 空间| O(n) | 输出数组为每个测试用例存储 n 个值 |

 由于总和为`n`所有测试用例不超过 2 * 10^5，该解决方案可以在 2 秒的时间限制和 256 MB 内存内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    t = int(input())
    for _ in range(t):
        n = int(input())
        s = list(map(int, input().split()))
        max1 = max2 = -1
        for num in s:
            if num > max1:
                max2 = max1
                max1 = num
            elif num > max2:
                max2 = num
        res = []
        for num in s:
            other_max = max2 if num == max1 else max1
            res.append(num - other_max)
        print(' '.join(map(str, res)))
    return output.getvalue().strip()

# Provided samples
assert run("5\n4\n4 7 3 5\n2\n1 2\n5\n1 2 3 4 5\n3\n4 9 4\n4\n4 4 4 4\n") == "-3 2 -4 -2\n-1 1\n-4 -3 -2 -1 1\n-5 5 -5\n0 0 0 0"

# Custom cases
assert run("1\n2\n10 1\n") == "9 -9", "minimum size input"
assert run("1\n3\n7 7 3\n") == "0 0 -4", "duplicate maximum"
assert run("1\n4\n1 2 3 4\n") == "-3 -2 -1 1", "ascending order"
assert run("1\n5\n5 5 5 5 5\n") == "0 0 0 0 0", "all equal values"
assert run("1\n6\n1 1000000000 2 999999999 3 4\n") == "-999999999 1 -999999997 1 -999999996 -999999995", "large numbers and second max"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2\n10 1 | 9 -9 | 9 -9 最小尺寸数组，差值计算|
 | 3\n7 7 3 | 7 0 0 -4 | 0 0 -4 多重最大值边缘情况 |
 | 4\n1 2 3 4 | 4 -3 -2 -1 1 | 递增序列 |
 | 5\n5 5 5 5 5 | 5 0 0 0 0 0 | 0 0 0 0 0 所有值均相等 |
 | 6\n1 1000000000 2 999999999 3 4 | -999999999 1 -999999997 1 -999999996 -999999995 | 非常大的数字，第二个最大选择 |

 ## 边缘情况

 如果最大值出现多次，则持有该值的每个参与者应使用所有数字中第二大的作为“其他最大值”。 例如，`[7, 7, 3]`产生
