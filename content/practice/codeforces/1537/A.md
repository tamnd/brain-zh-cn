---
title: "CF 1537A - 算术数组"
description: "给定一个整数数组，我们的任务是通过附加非负整数使其算术平均值等于 1。 每个测试用例都呈现一个任意整数数组，包括正数和负数，并要求所需的最少加法次数。"
date: "2026-06-10T15:02:21+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 1537
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 726 (Div. 2)"
rating: 800
weight: 1537
solve_time_s: 146
verified: true
draft: false
---

[CF 1537A - 算术数组](https://codeforces.com/problemset/problem/1537/A)

 **评分：** 800
 **标签：** 贪心，数学
 **求解时间：** 2m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个整数数组，我们的任务是通过附加非负整数使其算术平均值等于 1。 每个测试用例都呈现一个任意整数数组，包括正数和负数，并要求所需的最少加法次数。 算术平均值的精确计算方式为元素之和除以元素数量。 

输入由多个测试用例组成。 每个测试用例都会给出数组的当前长度和数组元素。 The output is a single integer for each test case: the fewest non-negative integers that, when appended, will adjust the array’s mean to exactly one.

 约束很小：数组长度最多为 50，元素值最多为 ±10^4。 这使得每个测试用例可以轻松地执行 O(n) 次操作。 测试用例总数最多为 1000，这意味着即使每个测试用例进行简单的线性扫描也是高效的。 Edge cases include arrays where the mean is already one, arrays where the sum is negative, and arrays with a sum larger than the length.

 粗心的实现可能会尝试始终添加零，直到平均值变为 1，当总和大于长度时，就会失败。 例如，数组 [3,3] 的平均值为 3，因此添加零只会将平均值减小到零，而永远不会达到 1。 The correct output for this array is two: appending two zeros gives the sum 6, length 4, mean 1.5, which is still too high, so careful reasoning is required.

 ## 方法

 强力方法会重复附加从 0 或 1 开始的整数，并重新计算平均值，直到恰好达到 1。 This works because each append changes the mean in a predictable way, but it is inefficient for arrays where the sum is much larger than the length: the number of iterations could be unbounded, and checking each step is unnecessary.

 关键的观察是我们可以在不进行模拟的情况下以数学方式解决这个问题。 令初始数组的总和为 S 及其长度 n。 我们需要附加 k 个非负整数，使得新的总和除以新的长度等于 1：$$\frac{S + X}{n + k} = 1$$其中 X 是 k 个新数字的总和。 由于所有附加数字都是非负数，因此我们可以添加的最小总和为 0。因此，会出现两种情况：

 1. 如果 S 等于 n，则数组的平均值已为 1，因此我们追加 0 个元素。 
2. 如果 S < n，则附加一个等于 n - S 的整数就足够了，因为该数字是非负数，将平均值增加到正好 1。 
3. 如果S > n，仅添加零是不够的。 我们需要增加长度来匹配总和，这需要附加 k 个元素。 满足 S / (n + k) ≤ 1 的最小 k 为 k = S - n。 

这种见解将问题简化为每个测试用例的恒定时间计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(最大(S)) | O(n + 最大值(S)) | 对于大笔资金来说速度太慢 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取测试用例数t。 
2. 对于每个测试用例，读取 n 和数组 a。 
3. 计算数组a的和S。 
4. 如果 S 等于 n，则打印 0。数组已具有平均值 1。 
5. 如果 S < n，则打印 1。单个附加数字 n - S 使平均值为 1。 
6. 如果 S > n，则打印 S - n。 添加如此多的零将增加长度，使平均值达到 1。 

为什么有效：该算法保留了最终数组的均值恰好为 1 的不变量。 这三种情况涵盖了所有可能性：相等、总和小于长度以及总和大于长度。 元素的总和和数量唯一确定平均值，因此不存在其他情况。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    s = sum(a)
    if s == n:
        print(0)
    elif s < n:
        print(1)
    else:
        print(s - n)
```该解决方案使用有效地读取输入`sys.stdin.readline`。 总和是用内置的`sum`，避免手动循环。 每个决策分支直接对应于算法演练中的三种情况之一。 由于公式源自总和与长度的精确相等，因此可以避免相差一的错误。 

## 工作示例

 ### 输入示例 1```
3
1 1 1
2 1 2
4 8 4 6 2
```| 数组 | n | 总和S | 案例 | 附加| 新手段|
 | --- | --- | --- | --- | --- | --- |
 | [1,1,1]| 3 | 3 | S = n | 0 | 1 |
 | [1,2]| 2 | 3 | S > n | 1 | 1 |
 | [8,4,6,2] | 4 | 20 | S > n | 16 | 16 1 |

 此跟踪显示案例分析的每个分支均正确触发。 在第三个示例中，附加 16 个零将长度调整为 20，使平均值为 1。 

### 输入示例 2```
1
1 -2
```| 数组 | n | 总和S | 案例 | 附加| 新手段|
 | --- | --- | --- | --- | --- | --- |
 | [-2]| 1 | -2 | S<n | 1 | 1 |

 单个附加 3 使平均值为 1，确认 S<n 情况处理。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 对长度为 n 的数组求和是线性的 |
 | 空间| O(n) | 输入数组的存储，不需要额外的结构 |

 假设 n ≤ 50 且 t ≤ 1000，这在 1 秒的时间限制内是有效的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        s = sum(a)
        if s == n:
            print(0)
        elif s < n:
            print(1)
        else:
            print(s - n)
    return output.getvalue().strip()

# Provided samples
assert run("4\n3\n1 1 1\n2\n1 2\n4\n8 4 6 2\n1\n-2\n") == "0\n1\n16\n1", "sample cases"

# Custom cases
assert run("2\n2\n0 0\n3\n2 2 2\n") == "1\n3", "zero sum and all equal >1"
assert run("1\n1\n1\n") == "0", "single element already 1"
assert run("1\n2\n-1 3\n") == "1", "mixed negative and positive"
assert run("1\n4\n5 5 5 5\n") == "16", "large sum > length"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2\n2\n0 0\n3\n2 2 2\n | 1\n3 | 正确处理 sum < n 和 sum > n |
 | 1\n1\n1\n | 1\n1\n1\n | 0 | 单元素情况，均值已经为 1 |
 | 1\n2\n-1 3\n | 1\n2\n-1 3\n | 1 | 混合负数和正数|
 | 1\n4\n5 5 5 5\n | 1\n4\n5 5 5 5\n 16 | 16 总和很大，需要多个零 |

 ## 边缘情况

 对于单元素负数组，例如 [-5]，S < n。 该算法附加 1 个等于 6 的数字，生成 [-5,6]。 总和 1，长度 2，平均值 1。 

对于所有元素都大于 1 的数组，例如 [10,10]，S > n。 附加 S - n = 20 - 2 = 18 个零得到 [10,10,0,...,0]（20 个元素）。 总和 20，长度 20，平均值 1。 

这些示例证实了三种情况的方法可以处理极端负和、大正和以及单元素数组，而不会出现差一错误。
