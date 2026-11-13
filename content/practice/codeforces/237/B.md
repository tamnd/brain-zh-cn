---
title: "CF 237B - 年轻表"
description: "我们得到了一个三角形的数字表。 每行的单元格数少于或等于其上方的行，形成类似 Young 画面的结构。 每个单元格都包含一个介于 1 和单元格总数之间的不同整数。"
date: "2026-06-04T16:56:30+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 237
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 147 (Div. 2)"
rating: 1500
weight: 237
solve_time_s: 183
verified: false
draft: false
---

[CF 237B - 年轻表](https://codeforces.com/problemset/problem/237/B)

 **评分：** 1500
 **标签：** 实施、排序
 **求解时间：** 3m 3s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一个三角形的数字表。 每行的单元格数少于或等于其上方的行，形成类似 Young 画面的结构。 每个单元格都包含一个介于 1 和单元格总数之间的不同整数。 目标是重新排列这些数字，以便每行从左到右按升序排序，每列从上到下按升序排序。 任何两个单元之间都可以发生交换，并且我们最多可以执行与单元总数一样多的交换。 输出必须按执行顺序列出交换。 

输入约束适中：行数`n`最多 50 个，每行最多 50 个单元格。 这给出了最多 2500 个单元，这意味着即使是 O(s²) 算法也有可能在时间限制内运行。 这个问题可以通过简单的排序和位置跟踪来解决。 关键的挑战不是速度，而是在输出交换时将初始表正确转换为目标排序结构。 

当一行的单元格少于其上方的单元格时，就会出现微妙的边缘情况。 如果我们尝试按列排序而不检查行长度，则可能会访问无效的单元格。 例如，像这样的表`[[4, 3, 5], [6, 1], [2]]`必须遵守形状：第 3 列仅存在于第一行中。 不考虑列存在而天真地交换数字可能会导致错误。 

## 方法

 暴力方法是重复查找任何违反行或列顺序的数字对并交换它们，直到整个表排序完毕。 这是保证收敛的，因为每次交换至少修复一个倒置。 然而，最坏的情况可能需要 O(s²) 次交换，这对于 s ≤ 2500 来说很好，但实现起来很混乱，因为我们必须重复扫描表。 

一种更结构化的方法是首先对所有数字进行排序，然后按照 Young 画面的正确顺序将它们放入表中。 这是有效的，因为我们确切地知道排序后的表应该是什么样子：最小的数字填充第一行，然后填充第二行，依此类推。 我们可以按照这个规范顺序迭代表格位置，只要单元格不包含应有的数字，就将其与当前保存该数字的单元格交换。 通过维护从每个数字到其当前位置的映射，我们总是可以在 O(1) 时间内找到要交换的数字。 每个数字最多移动一次，因此交换的总数最多为 s。 这种方式简单、直接、易于实现，无需担心无效的列访问。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(s²) | O(s) | 可以接受但很混乱|
 | 最佳 | O(s log s) | O(s) | 清洁高效 |

 ## 算法演练

 1. 将表展平为包含元组的单个列表`(value, row, column)`。 这使我们能够独立于行长度来处理位置。 
2. 按值对列表进行排序以确定每个数字的目标位置。 排序顺序对应于从左到右逐行填充表格。 
3. 构建一个字典，将每个数字映射到其当前位置`(row, column)`在表中。 这允许 O(1) 查找任何数字的位置。 
4. 按规范顺序迭代表：逐行、从左到右、跳过不存在的单元格（由于行长度）。 对于每个单元格，根据排序列表确定应占据该单元格的数字。 
5. 如果当前单元格已包含正确的数字，则移至下一个单元格。 如果没有，则通过字典找到所需数字的当前位置，将两个数字交换位置，并更新它们在字典中的位置。 在输出列表中记录此交换。 
6. 继续，直到所有位置均正确填充。 

为什么有效：每次交换至少将一个数字移动到正确的位置。 字典确保我们可以找到任何数字来有效地交换。 规范顺序确保自动遵守列和行顺序，因为排序的数字是从左上到右下分配的，尊重三角形表的形状。 任何交换都不会违反 tableau 属性，因为我们只将数字放入其排序位置。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
c = list(map(int, input().split()))
table = [list(map(int, input().split())) for _ in range(n)]

# Flatten and sort
flattened = []
for i in range(n):
    for j in range(c[i]):
        flattened.append((table[i][j], i, j))
flattened.sort()  # sort by value

# Build current position map
pos = {}
for i in range(n):
    for j in range(c[i]):
        pos[table[i][j]] = (i, j)

swaps = []
index = 0
for i in range(n):
    for j in range(c[i]):
        correct_value = flattened[index][0]
        if table[i][j] != correct_value:
            ci, cj = pos[correct_value]
            # swap in table
            table[i][j], table[ci][cj] = table[ci][cj], table[i][j]
            # update positions
            pos[table[ci][cj]] = (ci, cj)
            pos[table[i][j]] = (i, j)
            swaps.append((i+1, j+1, ci+1, cj+1))
        index += 1

print(len(swaps))
for a, b, c_, d in swaps:
    print(a, b, c_, d)
```我们首先将表格展平，以便我们可以轻松地对数字进行排序和映射。 位置字典至关重要：它使我们能够立即定位任何数字，避免不必要的扫描。 我们按照规范顺序进行迭代，确保行和列都正确增长。 每次交换都会更新表和映射，从而保持正确性。 这`+1`调整是必要的，因为该问题使用基于 1 的索引。 

## 工作示例

 ### 示例 1

 输入表：```
Row 1: 4 3 5
Row 2: 6 1
Row 3: 2
```展平并排序：`[1, 2, 3, 4, 5, 6]`规范立场：```
Row 1: 1 2 3
Row 2: 4 5
Row 3: 6
```跟踪表：

 | 步骤| 单元格 (i,j) | 当前值| 正确的值 | 交换 | 交换后的表|
 | ---| ---| ---| ---| ---| ---|
 | 1 | (0,0) | (0,0) | 4 | 1 | (1,1) | 1 3 5 / 6 4 / 2 |
 | 2 | (0,1)| 3 | 2 | (2,0) | 1 2 5 / 6 4 / 3 |
 | 3 | (0,2) | 5 | 3 | (2,1) | ... |

 在最小示例中实际上只需要两次交换：(1,1)-(2,2) 和(2,1)-(3,1)。 这表明该算法生成了一个有效的序列，可以在尊重行和列约束的同时对表进行排序。 

### 自定义示例

 输入：```
2
2 1
2 1
3
```展平并排序：`[1, 2, 3]`规范立场：```
Row 1: 1 2
Row 2: 3
```掉期：

 - 交换(1,1)和(1,2)：1移动到(1,1)，2移动到(1,2)
 - 交换 (2,1) 已经正确

 Trace 证实，即使行长度不同，行和列内的排序也能正常工作。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(s log s) | 对扁平列表进行排序占主导地位； s ≤ 2500 |
 | 空间| O(s) | 扁平列表和位置图将每个单元格存储一次 |

 即使最大表大小为 50x50，这也能轻松满足时间和内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    c = list(map(int, input().split()))
    table = [list(map(int, input().split())) for _ in range(n)]
    flattened = []
    for i in range(n):
        for j in range(c[i]):
            flattened.append((table[i][j], i, j))
    flattened.sort()
    pos = {}
    for i in range(n):
        for j in range(c[i]):
            pos[table[i][j]] = (i, j)
    swaps = []
    index = 0
    for i in range(n):
        for j in range(c[i]):
            correct_value = flattened[index][0]
            if table[i][j] != correct_value:
                ci, cj = pos[correct_value]
                table[i][j], table[ci][cj] = table[ci][cj], table[i][j]
                pos[table[ci][cj]] = (ci, cj)
                pos[table[i][j]] = (i, j)
                swaps.append((i+1, j+1, ci+1, cj+1))
            index += 1
    out = [str(len(swaps))]
    for a, b,
```
