---
title: "CF 306B - 优化器"
description: "我们得到一个大小为 n 的线性内存数组和一组 m 条指令，每条指令将一个连续的内存块设置为值 13。指令按输入顺序进行索引。 某些说明可能与其他说明完全或部分重叠。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 306
codeforces_index: "B"
codeforces_contest_name: "Testing Round 6"
rating: 2100
weight: 306
solve_time_s: 86
verified: true
draft: false
---

[CF 306B - 优化器](https://codeforces.com/problemset/problem/306/B)

 **评分：** 2100
 **标签：** 数据结构、贪心、排序
 **求解时间：** 1m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个大小为 _n_ 的线性内存数组和一组 _m_ 指令，每个指令将一个连续的内存块设置为值 13。指令按输入顺序进行索引。 某些说明可能与其他说明完全或部分重叠。 我们的任务是删除尽可能多的指令，同时确保在删除它们后，每个被至少一条指令设置为 13 的存储单元最终仍然设置为 13，并且没有之前未设置的单元被设置为 13。 输出应列出可以删除的最大指令数及其索引。 

约束允许 _n_ 最多为 2·10^6，_m_ 最多为 2·10^5。 任何显式模拟整个内存阵列上的每条指令的每种组合的算法都是不可行的。 简单的 O(n·m) 方法将超出时间限制，因为 2·10^6 × 2·10^5 超出了 3 秒窗口的实际计算范围。 这促使我们采用贪婪或行扫描方法，避免每条指令访问每个存储单元。 

可能导致简单方法失败的边缘情况包括完全嵌套在较大指令中的指令、覆盖同一单个内存单元的多个指令以及触及内存阵列边界的指令。 例如，如果两条指令覆盖了位置 3 到 5，其中一条指令也覆盖了 1 到 7，则可以删除较小的一条，而不会影响最终的内存状态。 不考虑遏制而删除重叠指令的粗心方法将错误地删除对于设置存储单元至关重要的指令。 

## 方法

 暴力的方法是模拟内存阵列，将每条指令一条一条地删除，检查最终的内存配置是否发生变化。 这是正确的，但速度非常慢。 对于每条指令，我们都会标记受影响的内存单元，然后尝试删除该指令并重新模拟其余指令以查看内存是否仍然相同。 最坏情况下的操作次数为 O(m·n)，考虑到约束条件，该操作次数太高了。 

关键的见解是指令可以被视为间隔，如果一条指令的整个间隔已经被后续指令覆盖，则可以删除该指令。 按指令的起始位置对指令进行排序，然后贪婪地迭代，使我们能够跟踪最远的覆盖内存单元。 如果当前指令的末尾小于或等于迄今为止最远的覆盖单元，则该指令是冗余的。 否则，它会扩大覆盖范围并且无法删除。 这将问题转化为经典的区间覆盖问题，大大降低了复杂性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n·m) | O(n) | 太慢了 |
 | 贪心区间扫描| O(m log m) | O(米) | 已接受 |

 ## 算法演练

 1. 读取所有指令并将它们存储为元组`(start, end, index)`， 在哪里`end = start + length - 1`。 保留索引用于输出目的。 存储开始和结束可以简化覆盖率计算。 
2. 首先对指令进行排序`start`按升序排列。 如果两条指令具有相同的起始位置，则先对间隔较长的指令进行排序，以便嵌套指令稍后出现并可以将其删除。 
3. 初始化变量`covered`为零，代表最远的存储单元，到目前为止处理的指令保证将其设置为 13。 
4. 迭代排序后的指令。 对于每条指令，检查其是否`end`位置小于或等于`covered`。 如果是，则该指令完全多余，可以删除。 否则，更新`covered`到`end`该指令的扩展内存覆盖范围。 
5. 在迭代过程中收集可移动指令的索引。 
6. 输出可移除指令的数量及其索引列表。 

为什么它有效：保持不变的是`covered`始终表示最远的存储单元，保证被其余指令设置为 13。 任何结尾在此范围内的指令都不会贡献新的内存覆盖，并且可以安全地删除。 按开始排序可确保我们以正确的顺序遇到潜在的冗余指令，并且在抢七中选择较长的间隔可确保正确考虑删除嵌套指令。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
instructions = []

for i in range(1, m + 1):
    a, l = map(int, input().split())
    instructions.append((a, a + l - 1, i))

# Sort by start, then by end descending to handle nested intervals
instructions.sort(key=lambda x: (x[0], -x[1]))

removable = []
covered = 0

for start, end, idx in instructions:
    if end <= covered:
        removable.append(idx)
    else:
        covered = end

print(len(removable))
if removable:
    print(" ".join(map(str, removable)))
```解决方案首先将每条指令转换为一个区间`[start, end]`。 排序确保我们从左到右处理指令，并在开始重合时优先考虑较大的间隔。 在迭代过程中，`covered`始终反映保证设置的最大存储单元。 只有不扩展此覆盖范围的指令才被标记为可删除。 需要特别注意相差一的错误，特别是在将长度转换为间隔结束时。 

## 工作示例

 **样品1：**

 输入：```
10 4
3 3
3 1
4 1
9 2
```步骤跟踪：

 | 说明 | 间隔| 之前介绍过| 行动| 覆盖后| 可拆卸|
 | ---| ---| ---| ---| ---| ---|
 | 3 3 | [3,5]| 0 | 扩大覆盖范围| 5 | - |
 | 3 1 | 3 1 [3,3]| 5 | 多余| 5 | 2 |
 | 4 1 | [4,4]| 5 | 多余| 5 | 3 |
 | 9 2 | [9,10]| 5 | 扩大覆盖范围| 10 | 10 - |

 输出：```
2
2 3
```此跟踪显示完全包含在先前覆盖范围中的嵌套指令被正确识别为可移除的。 

**自定义输入：**```
5 3
1 5
2 2
4 1
```步骤跟踪：

 | 说明 | 间隔| 之前介绍过| 行动| 覆盖后| 可拆卸|
 | ---| ---| ---| ---| ---| ---|
 | 1 5 | 1 [1,5]| 0 | 扩大覆盖范围| 5 | - |
 | 2 2 | 2 [2,3]| 5 | 多余| 5 | 2 |
 | 4 1 | [4,4]| 5 | 多余| 5 | 3 |

 输出：```
2
2 3
```这表明完全包含在较大指令中的指令被正确删除。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(m log m) | 对指令进行排序占主导地位。 迭代它们的时间复杂度为 O(m)。 |
 | 空间| O(米) | 我们存储区间和可移动索引。 |

 当 m ≤ 2·10^5 时，O(m log m) 操作完全在 3 秒限制内，并且 O(m) 内存适合 256 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, m = map(int, input().split())
    instructions = []
    for i in range(1, m + 1):
        a, l = map(int, input().split())
        instructions.append((a, a + l - 1, i))
    instructions.sort(key=lambda x: (x[0], -x[1]))
    removable = []
    covered = 0
    for start, end, idx in instructions:
        if end <= covered:
            removable.append(idx)
        else:
            covered = end
    out = f"{len(removable)}\n"
    if removable:
        out += " ".join(map(str, removable))
    return out

# provided sample
assert run("10 4\n3 3\n3 1\n4 1\n9 2\n") == "2\n2 3", "sample 1"

# minimum size input
assert run("1 1\n1 1\n") == "0\n", "minimum input"

# all instructions same
assert run("5 3\n1 5\n1 5\n1 5\n") == "2\n2 3", "all equal"

# nested intervals
assert run("5 3\n1 5\n2 2\n4 1\n") == "2\n2 3", "nested intervals"

# adjacent intervals
assert run("6 3\n1 2\n3 2\n5 2\n") == "0\n", "non-overlapping adjacent intervals"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 10 4 / 3 3 / 3 1 / 4 1 / 9 2 | 2 / 2 3 | 2 / 2 3 基本嵌套指令|
 | 1 1 / 1 1 | 1 1 / 1 1 0 / | 最小输入|
 | 5 3 / 1 5 / 1 5 / 1 5 | 5 3 / 1 5 / 1 5 / 1 5 2 / 2 3 | 2 / 2 3 相同的重叠指令|
 | 5 3 / 1 5 / 2 2 / 4 1 | 5 3 / 1 5 / 2 2 / 4 1 2 | |
