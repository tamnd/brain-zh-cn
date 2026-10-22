---
title: "CF 1179A - 瓦列里和德克"
description: "我们得到一个包含 n 个整数的双端队列。 Valeriy 重复执行一个操作，删除前两个元素，比较它们，然后重新插入它们：两个元素中较大的位于前面，较小的位于后面。"
date: "2026-06-12T01:35:59+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1179
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 569 (Div. 1)"
rating: 1500
weight: 1179
solve_time_s: 184
verified: true
draft: false
---

[CF 1179A - Valeriy 和 Deque](https://codeforces.com/problemset/problem/1179/A)

 **评分：** 1500
 **标签：** 数据结构、实现
 **求解时间：** 3m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个双端队列，其中包含`n`整数。 Valeriy 重复执行一个操作，删除前两个元素，比较它们，然后重新插入它们：两个元素中较大的位于前面，较小的位于后面。 我们被要求，为了`q`查询，以确定哪两个元素被删除`m_j`每个查询的第-次操作。 

关键的限制是`n`最大可达10^5，查询次数`q`最大可达 3×10^5。 每个查询都可以询问`m_j`-th 操作，其中`m_j`可以大到 10^18。 这立即排除了任何针对所有查询一一模拟每个操作的解决方案，因为即使`O(n)`每个查询都会太慢，并且`O(m_j)`对于大的来说是不可能的`m_j`。 

可能导致简单实现失败的边缘情况包括：所有元素相等、已经排序的数组或在最大元素到达前面后查询操作。 例如，如果双端队列是`[5, 5, 5]`当我们要求进行第十次操作时，粗心的模拟可能会假设顺序发生了变化，而这种变化从未发生过。 

## 方法

 蛮力方法很简单。 从给定的双端队列开始，对于每个操作，弹出前两个元素，比较它们，然后相应地重新插入。 重复此操作，直到达到所需的操作次数。 这适用于小型`m_j`，但如果`m_j`大约是10^18，这是不可行的。 即使是为了`n = 10^5`和`q = 10^5`，在最坏的情况下，一项一项地模拟操作将需要数万亿次操作。 

关键的见解是该过程分为两个阶段。 首先，双端队列中的最大元素最终会到达最前面。 在此阶段中，每个操作都会比较两个数字，将较大的数字移到前面，将较小的数字移到后面。 一旦最大值位于前面，第一个元素就永远不会改变。 之后，每个操作只是将前面的元素（最大值）与下一个元素配对，将下一个元素发送到后面。 第二阶段是完全周期性的：它旋转剩余的`n-1`固定循环中落后于最大值的元素。 

通过观察这一点，我们可以预先计算第一个`n`操作直到最大值到达前面。 对于此范围内的查询，我们返回预先计算的结果。 对于超出此范围的查询，可以使用剩余元素的循环序列上的模算术来计算答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(m_j) | O(n) | 太慢了 |
 | 最佳| O(n + q) | O(n) | 已接受 |

 ## 算法演练

 1. 读取输入，包括双端队列元素和查询。 确定双端队列中的最大元素。 
2、初始化一个deque结构来模拟操作，直到最大值到达最前面。 保留一个清单`first_phase`存储每次操作中删除的元素对。 
3. 当双端队列的前面不是最大值时，弹出前两个元素`A`和`B`。 附加`(A, B)`到`first_phase`。 比较`A`和`B`，并将较大的推到前面，较小的推到后面。 这确保了最终最大值将占据前面。 
4. 当最大值位于前面时，按顺序记录其后面的剩余元素：`cycle`。 每次操作后，这些元素都会在最大值后面轮换。 
5. 对于每个查询`m_j`，检查是否落在预先计算的范围内`first_phase`。 如果是这样，只需输出存储的对。 否则，减去操作数`first_phase`获取循环阶段的索引。 与最大值配对的元素是`cycle[(m_j - len(first_phase) - 1) % len(cycle)]`，并且最大值本身始终是另一个元素。 
6. 按照给出的顺序打印所有问题的答案。 

为什么它有效：不变的是，一旦最大值位于前面，它就永远不会移动。 其余元素在其后面形成固定的顺序，每次操作都会将下一个元素移到后面。 这保证了每个查询都可以使用预先计算的第一阶段列表或循环阶段中的简单模块化查找来回答。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

n, q = map(int, input().split())
a = list(map(int, input().split()))
queries = [int(input()) for _ in range(q)]

d = deque(a)
first_phase = []

max_val = max(a)

while d[0] != max_val:
    A = d.popleft()
    B = d.popleft()
    first_phase.append((A, B))
    if A > B:
        d.appendleft(A)
        d.append(B)
    else:
        d.appendleft(B)
        d.append(A)

# Now the maximum is at the front
d.popleft()  # remove max for cycle
cycle = list(d)

answers = []
for m in queries:
    if m <= len(first_phase):
        answers.append(first_phase[m - 1])
    else:
        idx = (m - len(first_phase) - 1) % len(cycle)
        answers.append((max_val, cycle[idx]))

for a, b in answers:
    print(a, b)
```该解决方案首先仅模拟操作，直到最大值到达前面，存储每个操作的结果。 之后，双端队列被拆分为最大值和剩余元素的循环。 对于第一阶段之后的查询，使用模运算来识别哪个元素与最大值配对。 这可以有效地处理极大的查询数量，而无需模拟所有操作。 

## 工作示例

 跟踪示例输入：```
5 3
1 2 3 4 5
1
2
10
```### 第一阶段模拟

 | 运营| 双端队列前两个| 双端队列操作后|
 | ---| ---| ---|
 | 1 | 1, 2 | 2、3、4、5、1 |
 | 2 | 2, 3 | 3, 4, 5, 1, 2 |
 | 3 | 3, 4 | 4, 5, 1, 2, 3 | 4, 5, 1, 2, 3 |
 | 4 | 4, 5 | 5、1、2、3、4 |

 最大限度`5`到达前面，周期为`[1,2,3,4]`。 

### 查询处理

 查询 1 → 操作 1 →`(1,2)`从第一阶段开始。 

查询 2 → 操作 2 →`(2,3)`从第一阶段开始。 

查询 10 → 运算 10 → 10 - 4 = 6 → 索引 6 % 4 = 2 → 周期[2] = 3 → 答案`(5,3)`。 

该迹线显示了第一阶段和循环阶段之间的分离，并且模运算给出了与最大值的正确配对。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + q) | 最多模拟`n`操作将 max 置于前面，然后使用模算术每个查询 O(1) |
 | 空间| O(n) | 存储双端队列和第一阶段操作，并且循环长度最多为n-1 |

 这对于最大的输入来说足够有效，因为`n`≤ 10^5 且`q`≤ 3×10^5。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque
    input = sys.stdin.readline
    
    n, q = map(int, input().split())
    a = list(map(int, input().split()))
    queries = [int(input()) for _ in range(q)]
    
    d = deque(a)
    first_phase = []

    max_val = max(a)
    while d[0] != max_val:
        A = d.popleft()
        B = d.popleft()
        first_phase.append((A, B))
        if A > B:
            d.appendleft(A)
            d.append(B)
        else:
            d.appendleft(B)
            d.append(A)
    
    d.popleft()
    cycle = list(d)
    
    answers = []
    for m in queries:
        if m <= len(first_phase):
            answers.append(first_phase[m - 1])
        else:
            idx = (m - len(first_phase) - 1) % len(cycle)
            answers.append((max_val, cycle[idx]))
    
    return "\n".join(f"{x[0]} {x[1]}" for x in answers)

# Provided samples
assert run("5 3\n1 2 3 4 5\n1\n2\n10\n") == "1 2\n2 3\n5 2"

# Minimum input
assert run("2 1\n0 0\n1\n") == "0 0"

# Maximum element at front initially
assert run("3 2\n9 1 2\n1\n4\n") == "9 1\n9 2"

# All equal elements
assert run("4 3\n7 7 7 7\n1\n5\n10\n") == "7 7\n7 7\n7 7"

# Large query beyond first phase
assert run("5 2\n1 2
```
