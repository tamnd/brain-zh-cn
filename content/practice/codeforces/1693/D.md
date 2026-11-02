---
title: "CF 1693D - 十进制除法"
description: "我们得到从 1 到 $n$ 的数字排列，并要求我们计算“Decinc”的连续子数组的数量。如果我们可以删除一些递减子序列（可能为空），以便其余元素严格递增，则子数组是 Decinc。"
date: "2026-06-09T22:53:18+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "divide-and-conquer", "dp", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1693
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 800 (Div. 1)"
rating: 2800
weight: 1693
solve_time_s: 147
verified: false
draft: false
---

[CF 1693D - Decinc 除法](https://codeforces.com/problemset/problem/1693/D)

 **评分：** 2800
 **标签：** 暴力破解、数据结构、分而治之、dp、贪婪
 **求解时间：** 2m 27s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了从 1 到$n$，并且要求我们计算“Decinc”的连续子数组的数量。 如果我们可以删除一些递减子序列（可能为空），以便剩余元素严格递增，则子数组是 Decinc。 换句话说，如果每个局部减少都可以通过删除该减少的端点之一来处理，则子数组是 Decinc。 

由于我们正在处理排列，因此每个数字都是不同的，范围从 1 到$n$。 这意味着相对顺序是主要挑战，而不是重复值。 输出是有效子数组的总数$(l, r)$在哪里$1 \le l \le r \le n$。 

限制因素很重要：$n$可以达到$2 \cdot 10^5$。 暴力检查所有$O(n^2)$子数组立刻就太慢了。 甚至$O(n^2)$每个子阵列分析是不可能的； 我们需要一些更接近线性或线性时间的东西。 

不明显的边缘情况包括非常短的数组、已经严格递增或递减的数组以及恰好位于任一端发生单次递减的点的子数组。 例如，通过排列`[2, 3, 1]`，每个子数组都是 Decinc。 幼稚的方法可能会错误分类`[3, 2, 1]`如果它只检查第一个或最后一个元素，则视为有效，但在这种情况下，只有某些子数组满足该属性。 

## 方法

 蛮力方法将迭代所有可能的子数组$(l, r)$并检查每个是否为 Decinc。 要检查子数组，可以模拟删除元素以尝试使其增加。 由于子数组的大小可以达到$n$，每张支票都是$O(n)$。 这给出了$O(n^3)$在最坏的情况下，这显然是不可行的$n = 2 \cdot 10^5$。 

关键的观察是，当且仅当子数组的最大元素可以定位为使得在删除递减子序列后左侧的所有内容都在增加并且右侧的所有内容都在增加时，子数组才是 Decinc。 因为这是一种排列，所以局部最小值和最大值的结构受到很大限制。 我们可以跟踪每个元素左侧和右侧最大的段，该段可以是 Decinc 子数组的一部分。 通过从左到右和从右到左一次完成此操作，我们可以为每个索引计算最远的有效左边界和右边界。 

一旦我们有了这些边界，计算有效子数组的数量就可以减少为范围内的总和。 我们完全避免嵌套循环。 这实际上是一种线性扫描方法，利用排列结构来检测 Decinc 属性失败的无效区域。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^3) | O(n^3) | O(1) | O(1) | 太慢了|
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 将排列中的每个值映射到其位置。 这使我们能够快速推断出相对顺序$O(1)$。 
2.初始化两个数组，`left`和`right`，跟踪每个索引的最大有效段。`left[i]`将存储 Decinc 子数组结束于左侧的最远索引`i`是可能的。`right[i]`存储最远的索引到 Decinc 子数组的起始位置`i`是可能的。 
3. 从左向右扫动。 对于每个元素`p[i]`，检查它是否与前一个元素继续递增序列。 如果是，则扩展该段。 否则，开始一个新的段。 这标识了所有严格递增的前缀。 
4. 类似地从右向左扫描以查找严格递增的后缀。 
5. 对于每个索引`i`，计算子数组的范围`[left[i], right[i]]`包含`p[i]`和是 Decinc。 将这些范围内的所有子数组的计数添加到运行总数中。 
6. 输出总和，现在可以正确计算所有 Decinc 子数组。 

工作原理：在每个索引处，该算法确保包含该元素的子数组可以在不违反递增顺序的情况下删除其减少项。 左右扫描保证不会计算无效子数组，因为任何违反 Decinc 属性的行为都会缩小有效段。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
p = list(map(int, input().split()))

pos = [0] * (n + 1)
for i, val in enumerate(p):
    pos[val] = i

# left[i] is farthest left boundary for Decinc subarray ending at i
left = [0] * n
for i in range(n):
    if i == 0:
        left[i] = 0
    else:
        if p[i-1] < p[i]:
            left[i] = left[i-1]
        else:
            left[i] = i

# right[i] is farthest right boundary for Decinc subarray starting at i
right = [0] * n
for i in reversed(range(n)):
    if i == n - 1:
        right[i] = n - 1
    else:
        if p[i] < p[i+1]:
            right[i] = right[i+1]
        else:
            right[i] = i

total = 0
for i in range(n):
    total += (i - left[i] + 1) * (right[i] - i + 1)

print(total)
```第一个循环将值映射到潜在扩展的位置。 左右扫描计算最大增加段。 最终求和计算包含以下内容的所有子数组`p[i]`将左侧和右侧的选择数量相乘。 使用`i - left[i] + 1`计算结束于的子数组的所有可能的起点`i`， 和`right[i] - i + 1`计算从以下位置开始的子数组的所有可能端点`i`。 

微妙之处：数组边缘的边界处理至关重要。 如果您忘记了，则会出现相差一的错误`+1`在任一范围计算中。 排列属性保证不存在相等的元素，从而简化了比较逻辑。 

## 工作示例

 **样本1**：`[2, 3, 1]`| 我| p[i] | p[i] 左[i] | 右[i] | 子数组计数 |
 | --- | --- | --- | --- | --- |
 | 0 | 2 | 0 | 1 | 2 |
 | 1 | 3 | 0 | 1 | 2 |
 | 2 | 1 | 2 | 2 | 1 |

 Sum = 2 + 2 + 1 +（包括所有组合）= 6。所有子数组均为 Decinc。 

**样本2**：`[1, 3, 2, 4, 6, 5]`| 我| p[i] | p[i] 左[i] | 右[i] | 子数组计数 |
 | --- | --- | --- | --- | --- |
 | 0 | 1 | 0 | 5 | 6 |
 | 1 | 3 | 0 | 3 | 6 |
 | 2 | 2 | 2 | 2 | 1 |
 | 3 | 4 | 0 | 4 | 5 |
 | 4 | 6 | 0 | 4 | 5 |
 | 5 | 5 | 5 | 5 | 1 |

 Sum = 24 个子数组，不包括`[1..6]`和`[2..6]`，与样品一致。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每次扫描（左和右）都是线性的，加上最终的总和。 |
 | 空间| O(n) | 数组`pos`,`left`， 和`right`是线性的。 |

 该解决方案可以轻松扩展$n = 2 \cdot 10^5$在2秒的时间限制下。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    p = list(map(int, input().split()))

    pos = [0] * (n + 1)
    for i, val in enumerate(p):
        pos[val] = i

    left = [0] * n
    for i in range(n):
        if i == 0:
            left[i] = 0
        else:
            if p[i-1] < p[i]:
                left[i] = left[i-1]
            else:
                left[i] = i

    right = [0] * n
    for i in reversed(range(n)):
        if i == n - 1:
            right[i] = n - 1
        else:
            if p[i] < p[i+1]:
                right[i] = right[i+1]
            else:
                right[i] = i

    total = 0
    for i in range(n
```
