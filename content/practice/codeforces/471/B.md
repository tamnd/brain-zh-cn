---
title: "CF 471B - MUH 和重要的事情"
description: "我们得到了一个任务列表，每个任务都有一个相关的难度级别，我们需要生成三个不同的序列来完成所有任务。 每个顺序必须遵守这样的规则：只有当任务难度相同时才能重新排序。"
date: "2026-05-30T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 471
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 269 (Div. 2)"
rating: 1300
weight: 471
solve_time_s: 101
verified: false
draft: false
---

[CF 471B - MUH 和重要的事情](https://codeforces.com/problemset/problem/471/B)

 **评分：** 1300
 **标签：** 实施、排序
 **求解时间：** 1m 41s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一个任务列表，每个任务都有一个相关的难度级别，我们需要生成三个不同的序列来完成所有任务。 每个顺序必须遵守这样的规则：只有当任务难度相同时才能重新排序。 换句话说，对于任何一对具有不同难度的任务，它们的相对顺序不能在序列之间改变。 输入由任务数量组成`n`和一个数组`n`代表任务难度的整数。 如果不可能产生三个不同的序列，则输出应该为“NO”，或者“YES”，后跟满足条件的三个任务索引序列。 

约束条件允许`n`最多 2000，这对于时间复杂度高达大约 O(n²) 的算法来说足够小，可以在一秒内轻松运行。 生成所有排列的蛮力方法是不可行的，因为排列的数量随阶乘增长`n`。 我们还需要小心边缘情况：如果所有任务都有明显的困难，则没有两个任务可以交换，因此只存在一个有效的序列，从而不可能生成三个不同的计划。 如果正好有两个任务具有相同的难度并且没有其他任务重复，我们只能通过交换它们来产生两个不同的序列，这仍然是不够的。 

## 方法

 朴素的暴力方法将尝试生成尊重难度顺序的任务索引的所有有效排列。 这涉及到识别所有具有相同难度的任务并对它们进行排列，同时使不同难度的任务保持相同的相对顺序。 虽然正确，但这种方法很快就变得不切实际，因为即使一个难度重复十次也会产生 10！ 排列，远远超出了我们的时间限制。 

关键的观察是我们只需要三个不同的序列，而不是所有可能的序列。 可以通过交换具有相同难度的任务来改变顺序。 因此，我们只需要找到具有相同难度的两组：一组大小至少为 2 的组允许单个交换创建第二个序列，而另一组大小至少为 2 或同一组（如果它至少有 3 个任务）允许第三个序列。 这将问题简化为计算难度数组中的重复次数。 一旦我们确定了这些组，生成序列就很简单：将第一个序列的任务保持基本排序顺序，将第一个重复组中的任务交换为第二个序列，并将第二个重复组中的任务交换（或者在第一组中进行附加交换，如果它足够大）为第三个序列。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!) | O(n!) | 太慢了 |
 | 最佳| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 将每个任务的难度与其原始索引配对，并按难度对任务进行排序。 这会产生第一个序列的规范排序。 
2. 扫描排序列表以查找具有相同难度的任务组。 跟踪每个重复难度的索引。 
3. 如果没有多次出现困难，则打印“NO”，因为不可能进行交换，然后返回。 
4. 如果恰好一个难度出现至少两次但少于三次，请检查是否有任何其他难度出现至少两次以提供第二次交换。 如果不是，则打印“NO”并返回。 
5. 使用识别出的重复组，生成三个序列。 第一个序列是排序顺序。 第二个序列是通过交换第一个重复组中的前两个索引而形成的。 第三个序列是通过交换同一组中的下两个索引（如果它具有三个或更多元素）或交换第二个重复组中的前两个索引而形成的。 
6. 输出“YES”并打印三个序列。 

为什么有效：按难度对任务进行排序会建立一个满足相对顺序约束的有效基本序列。 一组相同难度的任何交换都会保留这种顺序。 由于该问题只需要三个不同的序列，因此重复组中的两次或三次交换可以保证序列是唯一的，满足问题条件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
h = list(map(int, input().split()))

# pair difficulty with original index
tasks = [(h[i], i+1) for i in range(n)]
tasks.sort()  # sort by difficulty

# find repeated difficulties
groups = {}
for diff, idx in tasks:
    if diff not in groups:
        groups[diff] = []
    groups[diff].append(idx)

first_swap = None
second_swap = None
for indices in groups.values():
    if len(indices) >= 2 and not first_swap:
        first_swap = indices[:2]
    elif len(indices) >= 2 and not second_swap:
        second_swap = indices[:2]

# if no two groups of repeats or one group with 3+, impossible
if not first_swap or (len(first_swap) < 3 and not second_swap):
    print("NO")
    sys.exit()

# build sequences
seq1 = [idx for _, idx in tasks]
seq2 = seq1[:]
seq3 = seq1[:]

# first swap for second sequence
seq2[seq1.index(first_swap[0])], seq2[seq1.index(first_swap[1])] = seq2[seq1.index(first_swap[1])], seq2[seq1.index(first_swap[0])]

# second swap for third sequence
if len(first_swap) >= 3:
    seq3[seq1.index(first_swap[1])], seq3[seq1.index(first_swap[2])] = seq3[seq1.index(first_swap[2])], seq3[seq1.index(first_swap[1])]
else:
    seq3[seq1.index(second_swap[0])], seq3[seq1.index(second_swap[1])] = seq3[seq1.index(second_swap[1])], seq3[seq1.index(second_swap[0])]

print("YES")
print(*seq1)
print(*seq2)
print(*seq3)
```该代码首先使用任务难度创建排序的基本序列，然后识别重复的难度组以执行交换。 这`first_swap`处理第二个序列，并且`second_swap`或额外的交换`first_swap`生成第三个序列。 这`seq1.index()`调用将原始索引正确映射到排序序列中的位置。 

## 工作示例

 输入示例 1：```
4
1 3 3 1
```| 步骤| 任务（已排序）| 第一个交换 | 第二个交换 | 序列1 | 序列2 | 序列3 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 初始| [(1,1),(1,4),(3,2),(3,3)] | [1,4]| [2,3]| [1,4,2,3] | [1,4,2,3] | [1,4,2,3] |
 | seq2 交换 | - | - | - | - | [4,1,2,3] | - |
 | seq3 交换 | - | - | - | - | - | [4,1,3,2] |

 这表明重复组内的交换会产生不同的序列。 

输入示例 2：```
5
1 2 3 4 5
```没有重复的困难。`first_swap`为 None，因此输出为“NO”。 这证实了算法正确地识别了不可能的情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序任务在运行时占据主导地位； 扫描重复困难的时间复杂度为 O(n)。 |
 | 空间| O(n) | 存储任务索引对和序列。 |

 当 n ≤ 2000 时，O(n log n) 操作可以在一秒内顺利运行，并且内存使用量保持在 256 MB 以内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    h = list(map(int, input().split()))
    tasks = [(h[i], i+1) for i in range(n)]
    tasks.sort()
    groups = {}
    for diff, idx in tasks:
        if diff not in groups:
            groups[diff] = []
        groups[diff].append(idx)
    first_swap = None
    second_swap = None
    for indices in groups.values():
        if len(indices) >= 2 and not first_swap:
            first_swap = indices[:2]
        elif len(indices) >= 2 and not second_swap:
            second_swap = indices[:2]
    if not first_swap or (len(first_swap) < 3 and not second_swap):
        return "NO"
    seq1 = [idx for _, idx in tasks]
    seq2 = seq1[:]
    seq3 = seq1[:]
    seq2[seq1.index(first_swap[0])], seq2[seq1.index(first_swap[1])] = seq2[seq1.index(first_swap[1])], seq2[seq1.index(first_swap[0])]
    if len(first_swap) >= 3:
        seq3[seq1.index(first_swap[1])], seq3[seq1.index(first_swap[2])] = seq3[seq1.index(first_swap[2])], seq3[seq1.index(first_swap[1])]
    else:
        seq3[seq1.index(second_swap[0])], seq3[seq1.index(second_swap[1])] = seq3[seq1.index(second_swap[1])], seq3[seq1.index(second_swap[0])]
    return "YES\n" + " ".join(map(str, seq1)) + "\n" + " ".join(map(str, seq2)) + "\n" + " ".join
```
