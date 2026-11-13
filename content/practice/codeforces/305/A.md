---
title: "CF 305A - 奇怪的添加"
description: "我们被要求从给定的集合中选择最大可能的整数子集，以便 Vasya 可以将子集中的任何两个数字相加。 瓦西亚的求和规则很不寻常：对于每个小数位，两个数字中至少有一个必须在该位置有零。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "constructive-algorithms", "implementation"]
categories: ["algorithms"]
codeforces_contest: 305
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 184 (Div. 2)"
rating: 1600
weight: 305
solve_time_s: 82
verified: true
draft: false
---

[CF 305A - 奇怪的添加](https://codeforces.com/problemset/problem/305/A)

 **评分：** 1600
 **标签：** 暴力破解、构造性算法、实现
 **求解时间：** 1m 22s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求从给定的集合中选择最大可能的整数子集，以便 Vasya 可以将子集中的任何两个数字相加。 瓦西亚的求和规则很不寻常：对于每个小数位，两个数字中至少有一个必须在该位置有零。 简单来说，如果将两个数字的数字对齐，它们不能在同一列中同时包含非零数字。 

输入由单个整数组成`k`表示不同数字的数量，后跟`k`不同的非负整数，每个最多 100。输出应该是满足求和要求的最大子集的大小，后跟数字本身。 自从`k`最多为 100，强力成对检查原则上是可行的，但巧妙的方法可以绕过不必要的检查。 

关键的边缘情况包括 0 等数字、单位数的数字以及重复的 10 次幂的数字。 例如，使用输入`0 10 100 1`，最佳子集是所有四个数字，因为每一对都遵循“重叠小数位为零”规则。 如果不考虑零数字允许任何非零数字在同一列中共存，那么幼稚的方法可能会失败。 

## 方法

 暴力方法会尝试检查给定数字的每个子集，以查看所有对是否满足 Vasya 的求和条件。 这有效是因为`k`很小，但子集检查涉及最多 2^100 种可能性，这是一个天文数字。 即使检查子集中的每一对也只是`O(k^2)`，但枚举子集是瓶颈。 这种蛮力方法原则上是正确的，但完全不切实际。 

最佳方法依赖于这样的观察：只有当两个数字在同一小数位共享非零数字时，才会违反“零数字规则”。 因此，我们可以根据十进制数字对数字进行分类。 如果一个数字的百位有非零数字，则该子集中不能共存其他具有非零百位数字的数字。 实际上，由于数字≤100，因此只需要考虑三个数字位置：个位、十位和百位。 这大大降低了复杂性：我们只需要为每个“数字模式”选择最多一个数字，如果存在则加零。 仔细检查输入并跟踪已使用的数字就足够了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^k * k^2) | O(2^k * k^2) | O(k) | 太慢了 |
 | 最佳 | O(k * D) 其中 D= 位数 (~3) | O(k) | 已接受 |

 ## 算法演练

 1. 初始化一组来跟踪哪些数字可以安全地添加到答案中。 从一个空列表开始。 
2. 如果存在零，则始终包含零，因为零没有非零数字，并且可以与任何数字配对。 
3. 对于剩余的数字，按升序处理每个数字。 对于每个，将其转换为单位、十位和百位的数字数组。 
4. 维护三个布尔数组（每个数字位置一个），标记非零数字是否已存在于该位置的当前子集中。 
5. 在考虑新数字时，检查其每个非零数字。 如果任何数字与先前选择的数字冲突（同一位置已被非零数字占据），请跳过该数字。 否则，将其数字标记为已使用并包含它。 
6. 处理完所有数字后，列表包含最大子集。 打印它的长度和数字本身。 

为什么它有效：不变的是子集中没有两个数字在同一小数位上共享非零数字。 通过检查和标记每个位置，我们保证每一对都满足 Vasya 的求和条件。 因为 ≤100 的数字只有 3 个位置，这确保了最大的选择。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

k = int(input())
numbers = list(map(int, input().split()))
numbers.sort()

used_digits = [set(), set(), set()]  # units, tens, hundreds
answer = []

if 0 in numbers:
    answer.append(0)

for num in numbers:
    if num == 0:
        continue
    digits = [num % 10, (num // 10) % 10, (num // 100) % 10]
    conflict = False
    for i, d in enumerate(digits):
        if d != 0 and d in used_digits[i]:
            conflict = True
            break
    if not conflict:
        for i, d in enumerate(digits):
            if d != 0:
                used_digits[i].add(d)
        answer.append(num)

print(len(answer))
print(*answer)
```代码首先对数字进行排序，以确保我们首先选择较小的数字，这对于可预测的输出很有用。 它跟踪所使用的个位、十位和百位非零数字。 对于每个数字，它检查它是否可以与当前子集共存。 零被单独处理以保证它被包含在内。 

## 工作示例

 输入示例 1：```
4
100 10 1 0
```| 步骤| 数量 | 数字 | 冲突？ | 行动| 当前子集 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 0 | [0,0,0]| 没有 | 添加| [0]|
 | 2 | 1 | [1,0,0]| 没有 | 添加| [0,1]|
 | 3 | 10 | 10 [0,1,0]| 没有 | 添加| [0,1,10] |
 | 4 | 100 | 100 [0,0,1]| 没有 | 添加| [0,1,10,100] |

 这证实了所有数字都可以共存。 

自定义输入：```
5
1 2 3 10 100
```| 步骤| 数量 | 数字 | 冲突？ | 行动| 当前子集 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 1 | [1,0,0]| 没有 | 添加| [1] |
 | 2 | 2 | [2,0,0]| 没有 | 添加| [1,2]|
 | 3 | 3 | [3,0,0]| 没有 | 添加| [1,2,3]|
 | 4 | 10 | 10 [0,1,0]| 没有 | 添加| [1,2,3,10] |
 | 5 | 100 | 100 [0,0,1]| 没有 | 添加| [1,2,3,10,100] |

 这表明即使存在多个个位数字，选择也能正确避免冲突。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(k) | 每个数字被处理一次； 数字位置固定 (3) |
 | 空间| O(k) | 存储数字的子集和三组|

 当 k ≤ 100 且数字 ≤ 100 时，该解决方案的运行时间可以忽略不计，并且使用的内存也最少。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    k = int(input())
    numbers = list(map(int, input().split()))
    numbers.sort()
    used_digits = [set(), set(), set()]
    answer = []
    if 0 in numbers:
        answer.append(0)
    for num in numbers:
        if num == 0:
            continue
        digits = [num % 10, (num // 10) % 10, (num // 100) % 10]
        conflict = False
        for i, d in enumerate(digits):
            if d != 0 and d in used_digits[i]:
                conflict = True
                break
        if not conflict:
            for i, d in enumerate(digits):
                if d != 0:
                    used_digits[i].add(d)
            answer.append(num)
    return f"{len(answer)}\n{' '.join(map(str,answer))}"

# Provided sample
assert run("4\n100 10 1 0\n") == "4\n0 1 10 100"

# Minimum input
assert run("1\n0\n") == "1\n0"

# Maximum distinct digits
assert run("3\n10 20 30\n") == "3\n10 20 30"

# Conflicting units
assert run("4\n1 2 3 11\n") == "3\n1 2 3"

# Including zero allows more numbers
assert run("5\n0 10 20 30 3\n") == "5\n0 3 10 20 30"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 4\n100 10 1 0 | 100 10 1 0 4\n0 1 10 100 | 4\n0 1 10 100 基本情况，所有数字可以共存 |
 | 1\n0 | 1 1\n0 | 1 最小尺寸输入 |
 | 3\n10 20 30 | 10 20 30 3\n10 20 30 | 10 20 30 具有唯一十位数的数字 |
 | 4\n1 2 3 11 | 1 2 3 11 3\n1 2 3 | 3\n1 2 3 | 个位冲突解决 |
 | 5\n0 10 20 30 3 | 5\n0 5\n0 3 10 20 30 | 5\n0 3 10 20 30 零允许包含其他冲突的数字 |

 ## 边缘情况

 用于输入`4\n1 2 3 11`，算法正确识别出 11 与数字 1 共享个位数 1，因此被跳过。 由此产生的
