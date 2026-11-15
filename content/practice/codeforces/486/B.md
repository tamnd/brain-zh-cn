---
title: "CF 486B - 矩阵中的“或”"
description: "给定一个大小为 m × n 的矩阵 B，其中每个元素为 0 或 1。该矩阵据说是使用特定规则从相同大小的某个原始矩阵 A 生成的：每个元素 B[i][j] 等于 A 的第 i 行中的所有元素与所有...的逻辑或。"
date: "2026-06-07T17:26:52+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "hashing", "implementation"]
categories: ["algorithms"]
codeforces_contest: 486
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 277 (Div. 2)"
rating: 1300
weight: 486
solve_time_s: 92
verified: true
draft: false
---

[CF 486B - 矩阵或](https://codeforces.com/problemset/problem/486/B)

 **评分：** 1300
 **标签：** 贪婪、哈希、实现
 **求解时间：** 1m 32s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给定一个矩阵`B`尺寸的`m × n`，其中每个元素要么是 0 要么是 1。这个矩阵据说是从某个原始矩阵生成的`A`使用特定规则的相同大小：每个元素`B[i][j]`等于所有元素的逻辑或`i`第-行`A`与所有元素相结合`j`第 列`A`。 正式地，`B[i][j] = (OR of row i in A) OR (OR of column j in A)`。 

任务是重建任意矩阵`A`本来可以产生`B`，或确定不存在这样的矩阵，因为`B`不符合 OR 规则。 输入大小限制适中（`m, n ≤ 100`），允许大致运行的解决方案`O(m*n)`时间。 

当零出现在`B`。 如果`B[i][j]`为零，它强制行中的所有元素`i`和列`j`的`A`为零。 任何不强制执行的行为都会产生矛盾。 一种幼稚的方法，试图贪婪地填补任何地方`B[i][j]`如果其他地方的零发生冲突，则可能会失败。 

例如，考虑：```
2 2
1 0
0 0
```这里`B[1][2] = 0`力量`A[1][2] = A[2][2] = 0`。 相似地，`B[2][1] = 0`力量`A[2][1] = A[2][2] = 0`。 但`B[1][1] = 1`要求第 1 行或第 1 列至少有一个 1。任何满足零的零分配都会阻止为以下位置放置 1`B[1][1]`，所以不存在解。 发现这些矛盾是关键。 

## 方法

 蛮力方法就是尝试所有的方法`2^(m*n)`可能的分配`A`并检查结果是否`B`与给定的匹配。 这在理论上是正确的，但对于`m = n = 100`，因为这将涉及到`2^10000`组合。 

关键的见解是归零`B`严格限制元素`A`： 如果`B[i][j] = 0`，所有行`i`和列`j`必须为零。 那些在`B`更灵活，要求 row 的并集中至少有一个 1`i`和列`j`。 因此，我们可以从初始化开始`A`到处都是 1，然后显式地将与 0 相对应的行和列清零`B`。 最后，我们验证是否所有的`B`还是很满意的。 这将问题简化为简单的两遍方法。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^(m*n)) | O(2^(m*n)) | O(m*n) | 太慢了 |
 | 零传播+验证| O(m*n) | O(m*n) | 已接受 |

 ## 算法演练

 1. 初始化一个矩阵`A`尺寸的`m × n`充满了。 这是一个乐观的假设，即人们可以满足所有人的要求`B[i][j] = 1`限制。 
2. 对于每个元素`B[i][j]`等于零，设置行中的每个元素`i`和列`j`的`A`为零。 这强制执行严格要求，即零`B`如果相应行或列中的任何元素都不会出现`A`是一。 
3.构建新的矩阵`C`通过计算`(OR of row i in A) OR (OR of column j in A)`对于每个元素。 这模拟了生成`B`来自候选人`A`。 
4. 比较`C`到原来的`B`。 如果它们完全匹配，则打印“YES”和矩阵`A`。 否则，打印“NO”。 

为什么有效：第 2 步保证了所有零条目`B`受到尊重`A`。 步骤 3 检查所有的`B`可以通过选择的零放置来实现。 如果出现冲突，将在验证过程中检测到，确保正确性。 零传播捕获了所有硬约束； 任何剩余的可以任意放置以满足`B`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

m, n = map(int, input().split())
B = [list(map(int, input().split())) for _ in range(m)]

# Step 1: Initialize A with ones
A = [[1]*n for _ in range(m)]

# Step 2: Zero out rows and columns based on zeros in B
for i in range(m):
    for j in range(n):
        if B[i][j] == 0:
            for k in range(n):
                A[i][k] = 0
            for k in range(m):
                A[k][j] = 0

# Step 3: Verify by reconstructing B
C = [[0]*n for _ in range(m)]
row_or = [0]*m
col_or = [0]*n

for i in range(m):
    row_or[i] = 0
    for j in range(n):
        row_or[i] |= A[i][j]

for j in range(n):
    col_or[j] = 0
    for i in range(m):
        col_or[j] |= A[i][j]

valid = True
for i in range(m):
    for j in range(n):
        C[i][j] = row_or[i] | col_or[j]
        if C[i][j] != B[i][j]:
            valid = False
            break
    if not valid:
        break

if valid:
    print("YES")
    for row in A:
        print(' '.join(map(str, row)))
else:
    print("NO")
```代码首先构造一个候选者`A`通过将零表示的行和列清零`B`。 然后它预先计算每行和每列的 OR 来重建`B`。 如果重建的矩阵匹配，则候选有效； 否则，将被拒绝。 使用预先计算的行和列 OR 可避免对每个元素进行重复计算。 

## 工作示例

 ### 示例 1

 输入：```
2 2
1 0
0 0
```| 我| j | B[i][j] | B[i][j] 对 A 采取行动 |
 | --- | --- | --- | --- |
 | 0 | 0 | 1 | 最初没有 |
 | 0 | 1 | 0 | 零行 0 和列 1 |
 | 1 | 0 | 0 | 零行 1 和列 0 |
 | 1 | 1 | 0 | 已经为零 |

 重构矩阵`C`：```
0 0
0 0
```不匹配`B`，所以输出是`NO`。 这演示了冲突约束的检测。 

### 示例 2

 输入：```
3 3
1 1 1
1 0 1
1 1 1
```第2步调零：

 -`B[1][1] = 0`→ 将第 1 行和第 1 列归零。 

候选人`A`：```
1 0 1
0 0 0
1 0 1
```重建`C`：```
1 1 1
1 0 1
1 1 1
```火柴`B`，所以输出是`YES`与候选人`A`。 确认 1 可以与强制零共存。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(m*n) | 每个零都会触发 O(m+n) 次更新； 重建 B 需要 O(m*n) 次操作。 |
 | 空间| O(m*n) | 存储矩阵 A、B、C，以及 row_or 和 col_or 数组。 |

 和`m, n ≤ 100`,`m*n ≤ 10000`，这非常适合 1 秒的时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    m, n = map(int, input().split())
    B = [list(map(int, input().split())) for _ in range(m)]
    A = [[1]*n for _ in range(m)]
    for i in range(m):
        for j in range(n):
            if B[i][j] == 0:
                for k in range(n):
                    A[i][k] = 0
                for k in range(m):
                    A[k][j] = 0
    row_or = [0]*m
    col_or = [0]*n
    for i in range(m):
        for j in range(n):
            row_or[i] |= A[i][j]
    for j in range(n):
        for i in range(m):
            col_or[j] |= A[i][j]
    valid = True
    for i in range(m):
        for j in range(n):
            if (row_or[i]|col_or[j]) != B[i][j]:
                valid = False
                break
        if not valid:
            break
    if valid:
        print("YES")
        for row in A:
            print(' '.join(map(str, row)))
    else:
        print
```
