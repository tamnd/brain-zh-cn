---
title: "CF 1607E - 板上机器人 1"
description: "我们被要求将机器人放置在矩形网格上并执行一系列方向命令。 机器人可以左、右、上、下移动，我们可以选择它的起始单元。"
date: "2026-06-10T07:43:29+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1607
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 753 (Div. 3)"
rating: 1600
weight: 1607
solve_time_s: 92
verified: false
draft: false
---

[CF 1607E - 板上机器人 1](https://codeforces.com/problemset/problem/1607/E)

 **评分：** 1600
 **标签：** 实施
 **求解时间：** 1m 32s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求将机器人放置在矩形网格上并执行一系列方向命令。 机器人可以左、右、上、下移动，我们可以选择它的起始单元。 目标是选择一个起始单元，以便机器人在离开棋盘之前可以执行最大数量的命令。 如果命令将机器人推到网格之外，它就会失败，我们无法计算它。 输出是最佳起始位置的行和列。 

问题规模很大：电路板的每个尺寸可达 1,000,000，所有测试用例的总命令长度可达 1,000,000。 这立即排除了从每个可能的起始单元模拟机器人的可能性，因为对$n \times m$起始位置最多需要$10^{12}$操作，这远远超出了任何可行的运行时间。 

当机器人的序列非常短或极端时，就会出现边缘情况。 例如，如果董事会是$1 \times 1$机器人向左移动，机器人根本无法移动。 当长序列具有平衡移动时，例如“LRLRLR”，会发生另一种微妙的情况 - 取决于您开始的位置，机器人可能会或可能不会跌倒，并且忽略累积位移的简单模拟可能会选择次优的起始单元。 

## 方法

 暴力方法很容易描述。 对于板上的每个单元格，逐步模拟机器人的运动，直到它尝试移到外面。 跟踪成功执行命令的数量，并选择允许最大执行次数的起始单元格。 这是正确的，但太慢了。 使用最坏情况下的电路板尺寸$10^6 \times 10^6$和长度序列$10^6$，我们大约需要$10^{12}$每个测试用例的操作。 

关键的观察是我们不需要模拟每个起始单元。 真正重要的是行和列的累积位移。 让我们跟踪机器人在处理序列时垂直和水平移动的距离。 定义`dx`作为水平位移和`dy`作为距起点的垂直位移。 当我们逐步执行命令时，我们会跟踪迄今为止在每个方向上看到的最小和最大位移。 这些代表机器人相对于起始单元所能移动的最左、最右、最上、最下距离。 

一旦我们有`min_dx`,`max_dx`,`min_dy`， 和`max_dy`，安全起始位置是机器人永远不会超出棋盘边界的任何单元格。 违反此约束的第一个命令正是累积位移将机器人推到外面的时候。 我们可以增量处理命令并更新允许的起始范围，当进一步的移动溢出时停止。 这使我们能够以相对于其长度的线性时间处理每个序列，从而避免任何全板模拟。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n * m * | s | ) |
 | 最佳 | O( | s | ) |

 ## 算法演练

 1. 初始化四个变量来跟踪机器人相对于起始单元的位移：`min_row_offset`,`max_row_offset`,`min_col_offset`,`max_col_offset`。 一切从零开始。 These represent the extreme deviations in each direction seen so far.
 2.另外维护两个变量，`current_row_offset`和`current_col_offset`，当我们迭代命令时，它跟踪从假设的起始单元开始的累积位移。 两者都从零开始。 
3. 对于序列中的每个命令，更新累积位移。 'L' 递减`current_col_offset`, 'R' 增加它， 'U' 减少`current_row_offset`，“D”增加它。 
4. 更新累积位移后，检查包含此移动是否会将任何极限推至棋盘尺寸之外。 具体来说，如果`max_row_offset - min_row_offset`变为 ≥ n，或`max_col_offset - min_col_offset`变为 ≥ m，我们不能安全地包含此移动。 此时，我们停止处理命令。 
5. 停止前，用新的累积位移更新极限偏移。 这记录了机器人相对于起点所到达的最远位置。 
6. 完成迭代后（到达终点或提前停止），计算最佳起始单元格。 该行是`1 - min_row_offset`该列是`1 - min_col_offset`。 这使得机器人的最大向上或向左偏差也不会超出棋盘边界。 调整确保从 1 开始的索引。 
7. 返回此单元格。 

这样做的原因是，通过仅跟踪最小和最大偏移，我们可以有效地捕获机器人相对于起始单元的路径的“边界框”。 任何遵守这些边界的起始单元都可以保证安全执行。 由于我们贪婪地延伸路径直到到达边界，因此我们自然会最大化执行的命令数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        s = input().strip()
        
        min_row_offset = max_row_offset = 0
        min_col_offset = max_col_offset = 0
        current_row_offset = current_col_offset = 0
        
        for c in s:
            if c == 'L':
                current_col_offset -= 1
            elif c == 'R':
                current_col_offset += 1
            elif c == 'U':
                current_row_offset -= 1
            elif c == 'D':
                current_row_offset += 1
            
            min_row_offset = min(min_row_offset, current_row_offset)
            max_row_offset = max(max_row_offset, current_row_offset)
            min_col_offset = min(min_col_offset, current_col_offset)
            max_col_offset = max(max_col_offset, current_col_offset)
            
            if max_row_offset - min_row_offset >= n or max_col_offset - min_col_offset >= m:
                # Undo last move; cannot fit
                if c == 'L':
                    current_col_offset += 1
                elif c == 'R':
                    current_col_offset -= 1
                elif c == 'U':
                    current_row_offset += 1
                elif c == 'D':
                    current_row_offset -= 1
                break
        
        start_row = 1 - min_row_offset
        start_col = 1 - min_col_offset
        print(start_row, start_col)
```在代码中，我们维护两个维度的运行偏移和极值。 支票`max_row_offset - min_row_offset >= n`确保我们永远不会超过板的高度。 如果最后一步违反了棋盘边界，我们会撤消它，因为机器人无法安全地执行该命令。 最终计算放置起始单元，以便最小偏移不会将机器人推到板外。 

## 工作示例

 ### 示例 1

 输入：`3 3`板、顺序`RRDLUU`。 

| 步骤| 命令 | 行偏移量| 列偏移量 | 最小行 | 最大行数| 最小列 | 最大列 |
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 | 右 | 0 | 1 | 0 | 0 | 0 | 1 |
 | 2 | 右 | 0 | 2 | 0 | 0 | 0 | 2 |
 | 3 | d | 1 | 2 | 0 | 1 | 0 | 2 |
 | 4 | 左 | 1 | 1 | 0 | 1 | 0 | 2 |
 | 5 | 你| 0 | 1 | 0 | 1 | 0 | 2 |
 | 6 | 你| -1 | 1 | -1 | 1 | 0 | 2 |`max_row_offset - min_row_offset = 1 - (-1) = 2 < n = 3`

`max_col_offset - min_col_offset = 2 - 0 = 2 < m = 3`所有动作都适合。 计算开始：`1 - min_row_offset = 1 - (-1) = 2`,`1 - min_col_offset = 1 - 0 = 1`。 回答：`(2, 1)`。 

### 示例 2

 输入：`1 2`板、顺序`L`。 

- 命令`L`→ col_offset = -1，min_col_offset = -1，max_col_offset = 0
 -`max_col_offset - min_col_offset = 0 - (-1) = 1 < m = 2`→ 适合。 
- 开始：行 = 1 - 0 = 1，列 = 1 - (-1) = 2 →`(1, 2)`这些痕迹确认算法正确地放置了机器人以执行最大命令。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O( | s |
 | 空间| O(1) | O(1) | 仅维护固定数量的计数器，与 n、m 或 | 无关。 

给定总|s| 所有测试用例中 ≤ 10^6，该算法很容易满足 2 秒限制和 256 MB 内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    solve()
    return output.getvalue().strip()

#
```
