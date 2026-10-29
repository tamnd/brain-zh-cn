---
title: "CF 1519D - 最大乘积之和"
description: "我们有两个整数数组 a 和 b，长度均为 n。 任务是通过反转 a 的最多一个连续子数组来最大化按元素乘积的总和 $sum ai cdot bi$。"
date: "2026-06-10T18:12:35+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "dp", "implementation", "math", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1519
codeforces_index: "D"
codeforces_contest_name: "Educational Codeforces Round 108 (Rated for Div. 2)"
rating: 1600
weight: 1519
solve_time_s: 124
verified: true
draft: false
---

[CF 1519D - 最大乘积和](https://codeforces.com/problemset/problem/1519/D)

 **评分：** 1600
 **标签：** 暴力破解、dp、实现、数学、两个指针
 **求解时间：** 2m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个整数数组，`a`和`b`, 两者长度相同`n`。 任务是最大化元素乘积的总和，$\sum a_i \cdot b_i$，通过反转至多一个连续的子数组`a`。 反转子数组意味着选取一段`a`并翻转其元素的顺序，同时`b`保持不变。 

约束给我们`n`最多 5000。这意味着 O(n^3) 解决方案是不切实际的，因为它可能需要大约 1250 亿次操作。 通过仔细实施，O(n^2) 解决方案可能是可行的。 值在`a`和`b`最大可达 10^7，因此我们必须使用能够存储大约 10^7 之和的数据类型`5000 * 10^7 * 10^7 = 5 * 10^18`。 蟒蛇的`int`处理这个没有溢出。 

边缘情况包括长度为 1 或 2 的小数组，其中反转可能不会提高总和​​。 当最佳子数组是整个数组时，或者当不需要反转时，会发生另一种微妙的情况，因为数组已经与`b`以获得最大总和。 例如，`a = [1, 2, 3]`,`b = [3, 2, 1]`。 整个反转`a`给出`[3, 2, 1]`和最大总和`3*3 + 2*2 + 1*1 = 14`。 

## 方法

 蛮力方法很简单：迭代所有可能的子数组`(l, r)`的`a`，反转子数组，计算总和$\sum a_i \cdot b_i$，并跟踪最大值。 这是有效的，因为每个有效的反转都会被考虑。 然而，这需要 O(n^3) 次操作：所有子数组的 O(n^2) 次和计算每个总和的 O(n) 次。 和`n`最多5000，这太慢了。 

关键的见解是反转子数组仅改变该子数组对总和的贡献。 的部分`a`反转段之外的部分保持对齐`b`。 因此，我们可以在不反转的情况下预先计算总和，并且只关注反转子数组的“增益”。 

我们可以利用对称性：考虑一个子数组`l`到`r`。 如果我们反过来看，元素的贡献`a[l+i] * b[l+i]`更改为`a[r-i] * b[l+i]`。 通过从子数组的中心向外扩展，我们可以在 O(n^2) 时间内增量计算增益。 这种两指针或动态扩展技术将复杂度从 O(n^3) 降低到 O(n^2)，这对于`n=5000`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^3) | O(n^3) | O(1) | O(1) | 太慢了|
 | 最佳 | O(n^2) | O(n^2) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 计算初始乘积之和，不进行任何逆转。 打电话给这个`base_sum`。 
2. 初始化`max_gain = 0`跟踪反转任何子数组的最大增量。 
3. 考虑子数组的每个可能的中心。 对于奇数长度的子数组，单个元素可以是中心； 对于偶数长度子数组，中心位于两个元素之间。 
4. 围绕中心对称展开。 让`l`和`r`是在此扩展中交换的索引。 计算增益`gain = a[r] * b[l] + a[l] * b[r] - a[l] * b[l] - a[r] * b[r]`。 如果我们反转该货币对，这就是总和的净增加。 
5. 积累`gain`当我们向外扩展并更新时`max_gain`当累积增益超过它时。 
6.检查完所有可能的中心后，答案是`base_sum + max_gain`。 

为什么有效：反转子数组仅影响其内部的位置。 通过从中心向外扩展并计算每一步的增量增益，我们确保每个可能的子数组都被恰好考虑一次。 由于增益是相对于原始总和计算的，因此子数组之外的总和保持不变，保证了正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))
b = list(map(int, input().split()))

base_sum = sum(a[i] * b[i] for i in range(n))
max_gain = 0

# Odd-length centers
for center in range(n):
    gain = 0
    l, r = center - 1, center + 1
    while l >= 0 and r < n:
        gain += a[r] * b[l] + a[l] * b[r] - a[l] * b[l] - a[r] * b[r]
        if gain > max_gain:
            max_gain = gain
        l -= 1
        r += 1

# Even-length centers
for center in range(n - 1):
    gain = 0
    l, r = center, center + 1
    while l >= 0 and r < n:
        gain += a[r] * b[l] + a[l] * b[r] - a[l] * b[l] - a[r] * b[r]
        if gain > max_gain:
            max_gain = gain
        l -= 1
        r += 1

print(base_sum + max_gain)
```该代码首先计算总和，不进行任何反转。 然后，它通过从中心扩展来检查所有奇数长度和偶数长度的子数组。 增量增益公式确保我们只考虑交换的贡献，避免从头开始重新计算总和。 边界处理`l`和`r`保证没有索引错误。 

## 工作示例

 **样品1：**

 输入：`a = [2,3,2,1,3], b = [1,3,2,4,2]`| 我| r | a[l]*b[l]+a[r]*b[r] | a[l]*b[l]+a[r]*b[r] | a[r]*b[l]+a[l]*b[r] | a[r]*b[l]+a[l]*b[r] | 增益| 最大增益|
 | --- | --- | --- | --- | --- | --- |
 | 3 | 4 | 1_4+3_2=10 | 3_4+1_2=14 | 4 | 4 |
 | 2 | 5 | ... | ... | ... | 4 |

 反转的最佳子数组是`[1, 3]`（索引 3 到 4），增益为 4。基本总和为 25，因此最大总和为 29。 

**样本2：**

 输入：`a = [1,2,3], b = [3,2,1]`| 我| r | 增益| 最大增益|
 | --- | --- | --- | --- |
 | 0 | 2 | (3_1 +1_3)-(1_3 +3_1)=0 | 0 |

 反转整个数组不会在此扩展中带来额外增益，基本和为 10，最大和仍为 10。 

这表明增益计算可以正确识别何时没有反转可以改善总和。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2) | O(n^2) | 对于每个可能的中心 (O(n))，我们向外扩展最多 n/2 次 |
 | 空间| O(1) | O(1) | 只需几个变量即可跟踪总和和收益； 没有额外的数组 |

 n=5000 时的 O(n^2) 次操作大约为 2500 万次，在 Python 的 2 秒限制下是可以接受的。 与 256 MB 限制相比，内存使用量可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))

    base_sum = sum(a[i] * b[i] for i in range(n))
    max_gain = 0

    for center in range(n):
        gain = 0
        l, r = center - 1, center + 1
        while l >= 0 and r < n:
            gain += a[r] * b[l] + a[l] * b[r] - a[l] * b[l] - a[r] * b[r]
            if gain > max_gain:
                max_gain = gain
            l -= 1
            r += 1

    for center in range(n - 1):
        gain = 0
        l, r = center, center + 1
        while l >= 0 and r < n:
            gain += a[r] * b[l] + a[l] * b[r] - a[l] * b[l] - a[r] * b[r]
            if gain > max_gain:
                max_gain = gain
            l -= 1
            r += 1

    return str(base_sum + max_gain)

# provided samples
assert run("5\n2 3 2 1 3\n1 3 2 4 2\n") == "29", "sample 1"
assert run("2\n13 37\n2 4\n") == "174", "sample 2"

# custom cases
assert run("3\n1 2 3\n3
```
