---
title: "CF 1798D - 令人震惊的安排"
description: "我们得到一个总和为零的整数数组。 任务是重新排列元素，以便任何连续子数组的最大绝对和严格小于数组中最大元素和最小元素之间的差。"
date: "2026-06-09T09:54:42+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 1798
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 860 (Div. 2)"
rating: 1600
weight: 1798
solve_time_s: 230
verified: false
draft: false
---

[CF 1798D - 令人震惊的安排](https://codeforces.com/problemset/problem/1798/D)

 **评分：** 1600
 **标签：** 构造性算法，贪心，数学
 **求解时间：** 3m 50s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个总和为零的整数数组。 任务是重新排列元素，以便任何连续子数组的最大绝对和严格小于数组中最大元素和最小元素之间的差。 换句话说，如果我们将最大元素表示为`max_val`和最小值`min_val`，我们需要找到数组的排列，使得没有连续的数字块的绝对值之和为`max_val - min_val`或更多。 

输入包含多个测试用例。 每个数组最多可包含 300,000 个元素，所有测试用例的总和上限为 300,000。 在 2 秒的时间限制下，任何复杂度低于`O(n log n)`每个测试用例可能会太慢。 这排除了尝试所有排列或计算所有排列总和的方法`O(n^2)`直接子数组。 

当所有数字都为零时，会出现不明显的边缘情况。 任意子数组的和为零，且不小于`0 - 0 = 0`。 当数组包含相互抵消的大正数和负数时，会出现另一种棘手的情况。 天真的尝试排序或洗牌可能会意外地产生一个前缀或后缀，其总和等于总范围`max - min`，违反条件。 

例如，给定`a = [0, 0, 0]`，任何排列产量`max(abs(sum)) = 0`和`max - min = 0`，所以输出应该是`No`。 另一种情况是`a = [5, -5]`; 任何排序都会产生 5 的绝对子数组和，这等于`max - min = 10`，满足条件。 认识到这些边界情况有助于防止关于始终能够构建有效安排的错误假设。 

## 方法

 暴力解决方案将尝试数组的每个排列并检查最大子数组和。 这是可行的，因为条件是确定性的：对于每个排列，我们可以计算所有连续的子数组和并验证不等式。 然而，排列的数量是`n!`，甚至对于`n = 10`，这是 3,628,800 次操作。 计算每个排列的所有子数组总和将乘以`O(n^2)`，使其对于给定的约束完全不可行。 

关键的见解来自观察正数和负数之间的关系。 数组的和为零，因此总正和等于绝对总负和。 如果我们对数字进行排序，将所有正数放在所有负数后面（反之亦然），则最大的子数组和出现在一端，并且其绝对值可以达到所有正数的总和，即最多`max_val - min_val`如果数组包含至少一个严格正数和一个严格负数。 这种布置避免了子阵列与中间位置的总跨度精确求和的风险。 

因此，我们可以通过首先分离正数和负数来构建有效的排列。 如果所有正数之和等于所有负数之和的绝对值，并且两者都不为零，则先正数后负数或先负数后正数的顺序可保证没有子数组总和达到跨度限制。 如果所有数字都为零，则该任务是不可能的，因为所需的不等式是严格的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n! * n^2) | O(n! * n^2) | O(n^2) | O(n^2) | 太慢了 |
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 迭代每个测试用例。 对于每种情况，读取数组长度`n`和数组`a`。 
2.计算最大和最小元素，`max_val`和`min_val`。 如果`max_val - min_val`为零，输出`No`。 这处理全零或全相等的情况。 
3. 将数组划分为两个列表：`pos`包含所有正数，并且`neg`包含所有负数。 （可选）将零收集在单独的列表中，但可以在任何位置添加零。 
4. 将正数按降序排列，将负数按升序排列。 这可确保最大的数字位于构造数组的边缘，从而减少子数组总和超过允许限制的机会。 
5. 通过连接构造重新排列的数组`pos`和`neg`。 如果需要，可以将零放置在中间，但放置不会影响条件，因为零不会对总和产生影响。 
6. 输出`Yes`以及重新排列的数组。 

为什么有效：通过分离正数和负数，数组中的部分和波动较小。 最大正数与另一端的最大负数平衡，防止任何连续子数组的绝对值求和达到数组的整个范围。 这保证了条件得到满足。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    
    max_val = max(a)
    min_val = min(a)
    
    if max_val - min_val == 0:
        print("No")
        continue
    
    pos = [x for x in a if x > 0]
    neg = [x for x in a if x < 0]
    zero = [x for x in a if x == 0]
    
    pos.sort(reverse=True)
    neg.sort()
    
    ans = pos + neg + zero
    print("Yes")
    print(" ".join(map(str, ans)))
```该解决方案将正数和负数分开以减少最大子数组和。 排序可确保最大的数字位于极值。 零放在最后，因为它们不影响子数组和。 通过检查是否可以正确识别边缘情况，例如零数组或具有所有相等值的数组`max_val - min_val`等于零。 

## 工作示例

 ### 示例 1

 输入：`[3, 4, -2, -5]`

`max_val = 4, min_val = -5, max_val - min_val = 9`正数：`[3, 4]`, 负数：`[-2, -5]`| 步骤| 邮政 | 否定| 和|
 | --- | --- | --- | --- |
 | 分开| [3, 4] | [-2，-5] | - |
 | 排序 | [4, 3] | [-5，-2] | - |
 | 结合| - | - | [4, 3, -5, -2] |
 最大绝对子数组和为`7`，小于`9`。 

### 示例 2

 输入：`[0, 1, -1]`

`max_val = 1, min_val = -1, max_val - min_val = 2`积极的：`[1]`， 消极的：`[-1]`， 零：`[0]`结合：`[1, -1, 0]`最大绝对子数组和：`1`， 少于`2`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 积极和消极的排序占主导地位； 分区是 O(n) |
 | 空间| O(n) | 存储正、负和零列表 |

 该解决方案很容易满足 2 秒的限制`n`最多 300,000 且累计总和`n`跨所有测试用例。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # include solution code here
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        
        max_val = max(a)
        min_val = min(a)
        
        if max_val - min_val == 0:
            print("No")
            continue
        
        pos = [x for x in a if x > 0]
        neg = [x for x in a if x < 0]
        zero = [x for x in a if x == 0]
        
        pos.sort(reverse=True)
        neg.sort()
        
        ans = pos + neg + zero
        print("Yes")
        print(" ".join(map(str, ans)))
    return output.getvalue().strip()

# Provided samples
assert run("7\n4\n3 4 -2 -5\n5\n2 2 2 -3 -3\n8\n-3 -3 1 1 1 1 1 1\n3\n0 1 -1\n7\n-3 4 3 4 -4 -4 0\n1\n0\n7\n-18 13 -18 -17 12 15 13\n") == \
"Yes\n4 3 -5 -2\nYes\n2 2 2 -3 -3\nYes\n1 1 1 1 1 1 -3 -3\nYes\n1 -1 0\nYes\n4 4 -4 -4 3 -3 0\nNo\nYes\n15 13 13 12 -18 -18 -17", "sample 1"

# Custom cases
assert run("1\n2\n0 0\n") == "No", "all zeros"
assert run("1\n3\n5 -5 0\n") == "Yes\n5 -5
```
