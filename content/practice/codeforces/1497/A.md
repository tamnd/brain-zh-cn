---
title: "CF 1497A - 最大化"
description: "给定一个非负整数数组，我们希望对其重新排序以最大化所有前缀上的 MEX 值之和。 前缀是数组的任何初始段。 集合的 MEX 是该集合中不存在的最小非负整数。"
date: "2026-06-10T21:48:12+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1497
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 708 (Div. 2)"
rating: 800
weight: 1497
solve_time_s: 378
verified: false
draft: false
---

[CF 1497A - 最大化](https://codeforces.com/problemset/problem/1497/A)

 **评分：** 800
 **标签：** 暴力破解、数据结构、贪心、排序
 **求解时间：** 6m 18s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 给定一个非负整数数组，我们希望对其重新排序以最大化所有前缀上 **MEX** 值的总和。 前缀是数组的任何初始段。 集合的 **MEX** 是该集合中不存在的最小非负整数。 例如，墨西哥`{0, 1, 3}`是`2`， 因为`0`和`1`存在但是`2`失踪了。 

输入包含多个测试用例。 每个测试用例提供数组大小`n`（最多 100 个）和数组元素本身（全部在 0 到 100 之间）。 尺寸小`n`意味着复杂度为 O(n²) 的算法可以在 1 秒内轻松运行，但我们应该追求更简单、更直接的算法，因为该问题具有明显的贪婪结构。 

不明显的边缘情况包括数组丢失`0`、所有元素都相等的数组，或某些数字出现多次的数组。 例如，如果数组是`[2, 2, 3]`，一种简单的方法可能会尝试从最大的元素开始来最大化 MEX，但这会失败，因为 MEX 对丢失的小数非常敏感。 正确的输出应该优先从`0`如果存在的话。 

## 方法

 暴力方法会尝试数组的每个排列，计算每个前缀的 MEX，然后将它们相加。 原则上这是可行的，但排列的数量是`n!`甚至会爆炸`n=10`，使得这完全不切实际。 

关键的观察结果是，只有当我们包含最小的缺失数时，MEX 才会增长。 因此，为了最大化前缀 MEX 的总和，我们应该首先包含从`0`向上，按顺序。 每个数字第一次出现后`0,1,2,...`放置后，前缀的 MEX 逐渐增长。 

第一次出现后，剩余元素可以按任何顺序附加，因为它们不再增加 MEX。 这种简单的贪婪策略会产生正确且有效的解决方案，因为每个前缀的 MEX 完全由已放置的数字集决定。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力（所有排列）| O(n!) | O(n) | 太慢了|
 | 第一次出现贪婪 | O(n + 最大(a)) | O(最大(a)) | 已接受 |

 ## 算法演练

 1. 计算数组中每个数字的出现次数。 我们需要知道哪些数字至少出现过一次。 
2. 初始化一个空结果数组。 
3. 循环自`0`向上并附加数组中存在的每个数字的第一次出现。 对于每个附加数字，减少其计数。 这确保了前缀 MEX 在每一步稳定地增加 1。 
4.一旦所有数字来自`0`最多已处理一次，剩余的数字以任意顺序附加。 它们不会增加 MEX，但会完善阵列。 
5. 输出结果数组。 

**为什么有效**：在每一步中，我们保证通过首先包含最小的缺失数字来最大化当前前缀的 MEX。 一旦前缀包含来自以下位置的所有号码`0`到`k-1`，MEX 变为`k`。 之后追加重复项不会增加 MEX，因此将它们放在最后是最佳选择。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    
    count = [0] * 102  # numbers are 0..100
    for x in a:
        count[x] += 1
    
    result = []
    # step 1: include each number once to increase MEX
    for i in range(102):
        if count[i]:
            result.append(i)
            count[i] -= 1
    
    # step 2: append remaining numbers in any order
    for i in range(102):
        while count[i]:
            result.append(i)
            count[i] -= 1
    
    print(' '.join(map(str, result)))
```第一个循环确保每个前缀以最佳方式增长 MEX。 第二个循环处理剩余的数字。 数组`count`足够大以覆盖所有输入数字并防止索引错误。 边界处理是隐式的，因为所有数字都≤100。 

## 工作示例

 **样品1：**

 输入数组：`[4, 2, 0, 1, 3, 3, 7]`| 步骤| 行动| 结果数组 | 前缀 | MEX
 | --- | --- | --- | --- |
 | 1 | 追加 0 | [0]| 1 |
 | 2 | 附录 1 | [0,1]| 2 |
 | 3 | 附录 2 | [0,1,2]| 3 |
 | 4 | 附录 3 | [0,1,2,3]| 4 |
 | 5 | 附录 4 | [0,1,2,3,4] | 5 |
 | 6 | 附录 7 | [0,1,2,3,4,7] | 5 |
 | 7 | 追加剩余 3 | [0,1,2,3,4,7,3] | 5 |

 该序列与样本输出匹配并确认了贪婪逻辑。 

**样本2：**

 输入数组：`[2, 2, 8, 6, 9]`| 步骤| 行动| 结果数组 | 前缀 | MEX
 | --- | --- | --- | --- |
 | 1 | 追加 0（缺失）| 跳过| 墨西哥=0 |
 | 2 | 附录 1（缺失）| 跳过| 墨西哥=0 |
 | 3 | 附录 2 | [2] | 0 |
 | 4 | 添加剩余数字 2,6,8,9 | [2,6,8,9,2] | 1 |

 这里MEX仅在必要时增加； 重复项添加在末尾。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + 最大(a)) | 计数和迭代最多 101 个数字 |
 | 空间| O(最大(a)) | 计算数字 0..100 的数组 |

 当 n ≤ 100 且数量 ≤ 100 时，该算法在每个测试用例中最多执行 200 次迭代，完全在 1 秒限制之内。 

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
        count = [0] * 102
        for x in a:
            count[x] += 1
        result = []
        for i in range(102):
            if count[i]:
                result.append(i)
                count[i] -= 1
        for i in range(102):
            while count[i]:
                result.append(i)
                count[i] -= 1
        print(' '.join(map(str, result)))
    return output.getvalue().strip()

# provided samples
assert run("3\n7\n4 2 0 1 3 3 7\n5\n2 2 8 6 9\n1\n0\n") == "0 1 2 3 4 7 3\n2 6 8 9 2\n0", "samples"

# custom cases
assert run("1\n5\n0 0 0 0 0\n") == "0 0 0 0 0", "all equal zeros"
assert run("1\n4\n1 1 1 1\n") == "1 1 1 1", "all equal nonzero, MEX=0"
assert run("1\n3\n0 2 1\n") == "0 1 2", "small array consecutive numbers"
assert run("1\n6\n0 1 2 4 5 6\n") == "0 1 2 4 5 6", "missing 3"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`0 0 0 0 0`|`0 0 0 0 0`| 重复数为0，MEX增长一次|
 |`1 1 1 1`|`1 1 1 1`| 缺少 0，MEX 最初仍为 0 |
 |`0 2 1`|`0 1 2`| 小连续数字|
 |`0 1 2 4 5 6`|`0 1 2 4 5 6`| 不连续，缺少数字 3 |

 ## 边缘情况

 如果`0`完全丢失，第一个前缀的 MEX 是`0`，并且任何前缀都不能以 MEX > 0 开头。例如，`[1,1,2]`结果`[1,2,1]`。 如果所有元素都相同，则 MEX 仅增加一次（如果存在 0），然后保持不变。 该算法可以正确处理这些，因为它总是检查从`0`并随后附加剩余元素。
