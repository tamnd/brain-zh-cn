---
title: "CF 7B - 内存管理器"
description: "我们被要求为大小为 _m_ 的线性内存阵列实现一个简单的内存管理器。 每个存储单元可以是空闲的或被块占用。 我们要处理一系列操作：分配 n、擦除 x 和碎片整理。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 7
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 7"
rating: 1600
weight: 7
solve_time_s: 61
verified: true
draft: false
---
[CF 7B - 内存管理器](https://codeforces.com/problemset/problem/7/B)

 **评分：** 1600
 **标签：** 实施
 **求解时间：** 1m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求为大小为 _m_ 的线性内存阵列实现一个简单的内存管理器。 每个存储单元可以是空闲的或被块占用。 我们要处理一系列操作：`alloc n`,`erase x`， 和`defragment`。 一个`alloc n`请求尝试分配 _n_ 个字节的连续段。 如果存在多个连续的空闲段，则选择最接近内存开头的一个。 每次成功的分配都会收到一个从 1 开始的唯一标识符。如果分配失败，我们必须返回`NULL`。 

一个`erase x`请求释放与标识符 _x_ 关联的内存。 如果 _x_ 从未分配或已被删除，我们打印`ILLEGAL_ERASE_ARGUMENT`。 最后，`defragment`将所有分配的块移向内存的开头，同时保留它们的顺序，从而消除它们之间的间隙。 

限制很严格但可以管理。 总操作次数最多为100次，内存最多为100字节。 这允许显式模拟内存的解决方案，因为即使是简单的 O(t*m) 算法也最多执行 10,000 个步骤，这完全在 1 秒的限制之内。 

边缘情况包括在不存在足够大的连续空闲段时分配块，尝试擦除从未分配的块，以及在移动块但不更改其大小的碎片整理后进行分配。 例如，如果内存是`[alloc 3, alloc 4, erase 1]`，随后的`alloc 5`不进行碎片整理应该失败，因为可用空间被分割，而进行碎片整理则应该成功。 

## 方法

 暴力方法将内存模拟为长度为 _m_ 的列表，存储`0`空闲字节或占用字节的分配 ID。 为了`alloc n`，我们扫描列表中至少 _n_ 个零的第一个连续序列，将其替换为新 ID，并递增分配计数器。 为了`erase x`，我们扫描内存并替换所有出现的 ID`x`与零。`defragment`是通过将所有非零 ID 过滤到前面并用零填充其余部分来实现的。 这是正确的，因为所有操作只需要检查连续序列并维护分配 ID，但如果约束较大，则重复扫描内存以查找大 _m_ 会很慢。 

优化的关键观察是问题大小允许直接模拟。 对于更大的内存，可以将空闲段列表维护为间隔，分配和合并间隔，并将分配的段作为单独的列表移动。 这个问题的结构使得线性扫描就足够了，因为`t`和`m`≤100。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(t*m) | O(米) | 已接受 |
 | 间隔优化 | O(t*#块) | O(#blocks) | O(#blocks) | 不需要约束|

 ## 算法演练

 1. 将内存初始化为长度为 _m_ 的零列表。 维护一个从 1 开始的分配计数器和一个将 ID 映射到其内存范围的字典，以进行快速擦除检查。 
2. 对于一个`alloc n`操作，从头到尾迭代内存以找到至少 _n_ 个连续零的第一个序列。 如果找到，则将这些零替换为当前分配 ID，记录从 ID 到范围的映射，递增计数器并打印 ID。 如果没有找到，则打印`NULL`。 
3. 对于一个`erase x`操作时，首先检查ID是否`x`存在于映射中。 如果没有，则打印`ILLEGAL_ERASE_ARGUMENT`。 否则，检索块的开始和结束索引，将所有相应的存储单元设置回零，并从映射中删除 ID。 
4.对于一个`defragment`操作，迭代内存并按顺序收集所有非零 ID。 将内存替换为此有序列表，后跟零以填充至长度 _m_。 更新每个 ID 的映射以反映其新范围。 
5. 对输入中的所有操作重复步骤 2-4，确保立即打印输出`alloc`并失败了`erase`运营。 

为什么有效：在每一步，内存都会准确地反映分配状态。 分配扫描保证了首次适应策略。 针对映射的擦除检查保证仅删除有效的 ID。 碎片整理保留了分配的相对顺序。 始终保持内存一致性和正确的 ID 分配的不变量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t, m = map(int, input().split())
memory = [0] * m
alloc_counter = 1
id_map = {}  # ID -> (start, end)

for _ in range(t):
    parts = input().split()
    cmd = parts[0]

    if cmd == 'alloc':
        n = int(parts[1])
        found = False
        i = 0
        while i <= m - n:
            if all(memory[i+j] == 0 for j in range(n)):
                for j in range(n):
                    memory[i+j] = alloc_counter
                id_map[alloc_counter] = (i, i+n)
                print(alloc_counter)
                alloc_counter += 1
                found = True
                break
            i += 1
        if not found:
            print("NULL")

    elif cmd == 'erase':
        x = int(parts[1])
        if x not in id_map:
            print("ILLEGAL_ERASE_ARGUMENT")
        else:
            start, end = id_map[x]
            for i in range(start, end):
                memory[i] = 0
            del id_map[x]

    elif cmd == 'defragment':
        new_memory = [val for val in memory if val != 0]
        memory = new_memory + [0]*(m - len(new_memory))
        idx = 0
        for val in new_memory:
            start = idx
            while idx < m and memory[idx] == val:
                idx += 1
            id_map[val] = (start, idx)
```该代码反映了算法：内存被显式表示，分配扫描空闲空间，ID 映射确保有效擦除。 碎片整理会就地重建内存并更新所有范围。 一个微妙的点是在碎片整理过程中正确维护ID映射； 我们重新计算所有移动块的范围。 另一个微妙之处是有效地扫描内存； 在确认失败之前，我们不会跳过潜在分配中的索引，从而防止差一错误。 

## 工作示例

 **示例输入 1**```
6 10
alloc 5
alloc 3
erase 1
alloc 6
defragment
alloc 6
```| 运营| 内存状态 | 身份证地图 | 输出|
 | --- | --- | --- | --- |
 | 分配 5 | 1 1 1 1 1 0 0 0 0 0 | 1 1 1 1 1 0 0 0 0 0 {1:(0,5)} | 1 |
 | 分配 3 | 1 1 1 1 1 2 2 2 0 0 | 1 1 1 1 1 2 2 2 0 0 {1:(0,5),2:(5,8)} | 2 |
 | 擦除 1 | 0 0 0 0 0 2 2 2 0 0 | 0 0 0 0 0 2 2 2 0 0 {2:(5,8)} | - |
 | 分配 6 | 0 0 0 0 0 2 2 2 0 0 | 0 0 0 0 0 2 2 2 0 0 {2:(5,8)} | 空 |
 | 碎片整理 | 2 2 2 0 0 0 0 0 0 0 | 2 2 2 0 0 0 0 0 0 0 {2:(0,3)} | - |
 | 分配 6 | 2 2 2 3 3 3 3 3 3 0 | 2 2 2 3 3 3 3 3 3 0 {2:(0,3),3:(3,9)} | 3 |

 这演示了首次适应分配、非法分配的处理以及通过 ID 映射更新进行正确的碎片整理。 

**自定义输入2**```
4 5
alloc 2
alloc 2
erase 1
alloc 3
```| 运营| 内存状态 | 身份证地图 | 输出|
 | --- | --- | --- | --- |
 | 分配 2 | 1 1 0 0 0 | 1 1 0 0 0 {1:(0,2)} | 1 |
 | 分配 2 | 1 1 2 2 0 | 1 1 2 2 0 {1:(0,2),2:(2,4)} | 2 |
 | 擦除 1 | 0 0 2 2 0 | 0 0 2 2 0 {2:(2,4)} | - |
 | 分配 3 | 0 0 2 2 0 | 0 0 2 2 0 {2:(2,4)} | 空 |

 这证实，如果不进行碎片整理，碎片化的可用内存无法满足分配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(t*m) | 每个`alloc`和`erase`扫描最多 m 个细胞，重复 t 次操作。 |
 | 空间| O(m + t) | 长度为 m 的内存数组和最多存储 t 个分配的 ID 映射。 |

 给定 m、t ≤ 100，最大步数为 10,000，完全在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
```
