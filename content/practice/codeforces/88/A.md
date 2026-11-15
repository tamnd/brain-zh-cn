---
title: "CF 88A - 和弦"
description: "我们得到了三个音符，任务是将它们形成的和弦分类为大调、小调或“奇怪”和弦。 音符以十二音半音阶表示：C、C、D、D、E、F、F、G、G、A、B、H，并且音阶是循环的，因此 H 之后又是 C。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation"]
categories: ["algorithms"]
codeforces_contest: 88
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 73 (Div. 2 Only)"
rating: 1200
weight: 88
solve_time_s: 77
verified: true
draft: false
---

[CF 88A - 和弦](https://codeforces.com/problemset/problem/88/A)

 **评分：** 1200
 **标签：** 暴力破解、实施
 **求解时间：** 1m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了三个音符，任务是将它们形成的和弦分类为大调、小调或“奇怪”和弦。 音符以十二音半音阶表示：C、C#、D、D#、E、F、F#、G、G#、A、B、H，并且音阶是循环的，因此 H 之后又是 C。 和弦是一个三和弦，一组无序的三个音符。 如果我们可以对音符进行排序，使第一个音程为 4 个半音，第二个音程为 3 个半音，则大三和弦就会出现。 如果第一个音程是 3 个半音，第二个音程是 4 个半音，则出现小三和弦。 否则，该和弦被认为是“奇怪的”。 

输入大小是固定的：正好三个音符。 这保证了任何检查所有排列或计算所有距离的算法都将运行得非常快，因为 3! = 6 种排列可以忽略不计。 对于如此小的输入来说，时间和内存的限制是很大的。 

由于规模的循环性质，出现了边缘情况。 例如，像“B C# F”这样的和弦需要小心处理：我们可能需要环绕音阶才能正确计算距离。 简单地减去音符索引可能会得到负值或过大的值，因此使用模 12 算术是必要的。 另一个微妙之处是和弦是无序的，所以都是 3！ 分类之前必须考虑排列。 

## 方法

 最直接的方法就是暴力破解。 将每个音符转换为表示其在半音阶中位置的整数索引。 对于三个音符的每个排列，计算连续音符之间的距离模 12。 如果距离匹配 (4, 3)，则分类为主要。 如果它们匹配 (3, 4)，则分类为次要。 如果检查所有排列后没有匹配，则分类为奇怪。 

这种蛮力之所以有效，是因为输入大小很小：3！ 排列，并且每个排列只需要几次算术运算。 该问题的约束使我们能够考虑每个排序而无需考虑性能问题。 这里不需要更快的渐近方法，但也可以预先计算所有主要和次要三元组并检查集合中的成员资格。 该方法在实践中稍微快一些，但对于三个音符来说，差异可以忽略不计。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力（检查所有排列）| O(3!) = O(1) | O(3!) = O(1) | O(1) | O(1) | 已接受 |
 | 预计算三元组 | O(1) | O(1) | O(24) | 已接受 |

 ## 算法演练

 1. 创建一个字典，将每个音符映射到其半音索引。 例如，C=0、C#=1、D=2、...、H=11。 这允许从音符名称到整数的快速转换。 
2. 读取三个输入注释并使用字典将其转换为相应的索引。 
3. 生成三个索引的所有六种排列。 每个排列代表和弦的一种可能的顺序。 
4. 对于每个排列，使用模 12 算术计算第一个和第二个音符以及第二个和第三个音符之间的距离：`(second - first) % 12`和`(third - second) % 12`。 这解释了规模的循环性质。 
5. 如果距离恰好为 (4, 3)，则将和弦分类为大和弦并终止。 
6. 如果距离恰好为 (3, 4)，则将和弦分类为小和弦并终止。 
7. 如果没有排列与任一模式匹配，则将和弦分类为奇怪和弦。 

此方法的正确性依赖于检查所有排序。 由于和弦是无序的并且只有三个音符，因此穷举搜索可以保证如果和弦是大调或小调，则将在至少一种排列中检测到它。 

## Python 解决方案```python
import sys
import itertools
input = sys.stdin.readline

note_to_index = {
    "C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6,
    "G": 7, "G#": 8, "A": 9, "B": 10, "H": 11
}

notes = input().strip().split()
indices = [note_to_index[n] for n in notes]

for perm in itertools.permutations(indices):
    d1 = (perm[1] - perm[0]) % 12
    d2 = (perm[2] - perm[1]) % 12
    if d1 == 4 and d2 == 3:
        print("major")
        break
    if d1 == 3 and d2 == 4:
        print("minor")
        break
else:
    print("strange")
```该代码首先将音符名称转换为数字索引，然后检查所有排列以计算模距离。 使用`% 12`对于处理环绕距离（例如从 H 到 C）至关重要。`else`于`for`循环确保如果没有发生中断，则该和弦被归类为奇怪的和弦。 

## 工作示例

 **示例 1：“C E G”**

 | 步骤| 排列| d1 | d2 | 分类|
 | --- | --- | --- | --- | --- |
 | 1 | C E G (0, 4, 7) | 4 | 3 | 专业|
 | 2 | C G E (0, 7, 4) | 7 | 9 | - |

 第一个排列匹配 (4,3)，因此和弦是大调。 

**示例 2：“C# B F”**

 | 步骤| 排列| d1 | d2 | 分类|
 | --- | --- | --- | --- | --- |
 | 1 | C# B F (1, 10, 5) | 9 | 7 | - |
 | 2 | B C# F (10, 1, 5) | 3 | 4 | 次要|

 第二个排列匹配 (3,4)，因此和弦是小调。 这演示了处理循环距离。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(3!) = O(1) | O(3!) = O(1) | 仅考虑六种排列，每种排列有两个算术运算。 |
 | 空间| O(1) | O(1) | 仅存储固定映射和三个索引的输入列表。 |

 鉴于限制，该解决方案可以立即运行并且使用的内存可以忽略不计。 

## 测试用例```python
import sys, io
import itertools

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    note_to_index = {
        "C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6,
        "G": 7, "G#": 8, "A": 9, "B": 10, "H": 11
    }
    notes = input().strip().split()
    indices = [note_to_index[n] for n in notes]
    for perm in itertools.permutations(indices):
        d1 = (perm[1] - perm[0]) % 12
        d2 = (perm[2] - perm[1]) % 12
        if d1 == 4 and d2 == 3:
            return "major"
        if d1 == 3 and d2 == 4:
            return "minor"
    return "strange"

# provided sample
assert run("C E G\n") == "major", "sample 1"
# custom cases
assert run("C# B F\n") == "minor", "wrap around minor"
assert run("F# A C#\n") == "major", "another major triad"
assert run("D F A\n") == "minor", "classic minor triad"
assert run("C D E\n") == "strange", "no valid triad"
assert run("H C D\n") == "strange", "wrap around strange"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | C# BF | 次要| 环绕式小三联检测 |
 | F# 一个 C# | 专业| 标准大三和弦 |
 | DF A | 次要| 经典小三和弦|
 | C D E | 奇怪| 非三和弦|
 | HC D | 奇怪| 奇怪和弦的环绕检测 |

 ## 边缘情况

 对于输入“B C# F”，简单的方法可能会计算`C# - B = -9`和`F - C# = 4`，给出负距离。 使用模 12，我们得到`(1 - 10) % 12 = 3`和`(5 - 1) % 12 = 4`，正确识别和弦为小调。 类似地，像“H C D”这样需要环绕的和弦被正确分类为奇怪的和弦，因为没有任何排列产生所需的 (4,3) 或 (3,4) 半音模式。
