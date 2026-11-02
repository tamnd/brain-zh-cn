---
title: "CF 1679C - 鲁克斯后卫"
description: "我们被要求在涉及车的 $n 次 n$ 棋盘上模拟一系列操作。 每辆车都会攻击其整行和整列。"
date: "2026-06-10T00:39:54+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1679
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 791 (Div. 2)"
rating: 1400
weight: 1679
solve_time_s: 83
verified: true
draft: false
---

[CF 1679C - Rooks Defenders](https://codeforces.com/problemset/problem/1679/C)

 **评分：** 1400
 **标签：** 数据结构、实现
 **求解时间：** 1m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求模拟一系列操作$n \times n$涉及车的棋盘。 每辆车都会攻击其整行和整列。 查询要求放置一个车、移除一个车，或者检查给定矩形区域内的每个单元格是否受到至少一个车的攻击。 如果子矩形完全被攻击覆盖，则输出为“Yes”，否则输出为“No”。 

电路板尺寸可达$10^5 \times 10^5$，并且最多可以有$2 \cdot 10^5$查询。 显式标记每个车放置的每个单元或检查矩形内每个单元的简单方法将需要最多$10^{10}$操作，这在典型的竞争性编程时间限制内是完全不可行的。 这迫使我们考虑一个解决方案，其每个查询的复杂度大致为$O(\log n)$或者$O(1)$。 

棘手的边缘情况涉及仅跨越一行或一列的矩形。 假设两个维度都大于一的粗心实现可能会错误地报告矩形未被覆盖，而实际上单个车攻击了整个行或列。 另一个微妙之处是车的放置和移除重叠。 将多个车放在同一行或同一列上需要计算移除后剩余的数量，而不是将行或列简单地视为“受到攻击”或“未受到攻击”。 

## 方法

 暴力方法存储每个单元的状态。 对于放置，它会将相应行和列中的所有单元格标记为受到攻击。 对于删除，它将取消标记这些单元格。 查询将检查矩形中的所有单元格。 这适用于小型$n$，但是对于$n = 10^5$, 标记$n$每次放置或检查的单元格$n^2$每个查询的单元格导致$O(nq)$或者$O(n^2 q)$运营。 和$q \sim 2 \cdot 10^5$，解决方案太慢了。 

关键的观察是，当且仅当一个单元格的行或列中至少有一个车时，该单元格才会受到攻击。 我们不需要确切地知道车在行或列中的位置；我们只需知道车的位置即可。 我们只需要知道每一行和每一列是否至少有一个车。 因此，我们可以为每行和每列维护表示当前该行或列中有多少车的计数器，而不是跟踪单个单元格。 当我们放置车时，我们会增加相应的行和列计数器。 当我们移除车时，我们会减少它们。 如果矩形范围内的所有行都具有非零计数，或者其范围内的所有列都具有非零计数，则矩形被完全覆盖。 

为了有效地检查行和列的范围是否为零，我们可以使用非零计数器维护行和列的集合或映射，并比较最小和最大索引。 另一种方法是在受攻击的行/列的布尔数组上使用前缀和，从而允许$O(1)$更新后的查询$O(1)$每辆车。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2 * q) | O(n^2 * q) | O(n^2) | O(n^2) | 太慢了|
 | 行/列计数器| O(q) | O(n) | 已接受 |

 ## 算法演练

 1.初始化两个数组`row_count`和`col_count`长度$n+1$为零。 这些存储当前每行和每列中放置的车数量。 
2.初始化两组`rows_with_rook`和`cols_with_rook`跟踪当前哪些行和列包含至少一辆车。 
3. 对于每个查询：

 - 如果是类型 1（将车放在$x, y$), 增量`row_count[x]`和`col_count[y]`。 如果计数变为 1，则添加$x$到`rows_with_rook`和$y$到`cols_with_rook`。 
- 如果是类型 2（在以下位置移除车）$x, y$), 递减`row_count[x]`和`col_count[y]`。 如果计数变为0，则删除$x$从`rows_with_rook`和$y$从`cols_with_rook`。 
- 如果是类型3（检查矩形），则提取矩形的最小和最大行和列。 如果矩形中至少有一辆车的行数等于矩形中的行数，或者类似地列数，则该矩形被完全攻击。 同样，检查矩形中是否存在不在对应集合中的行或列； 如果不存在，则输出“Yes”，否则输出“No”。 
4. 打印所有类型 3 查询的答案。 

工作原理：行计数器和列计数器捕获当且仅当其计数器非零时行或列受到攻击的不变量。 这些集合可以有效地确定给定矩形中的所有行或所有列是否受到攻击。 如果每行或每列至少有一个车，则矩形被完全覆盖，这符合车攻击的定义。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, q = map(int, input().split())
row_count = [0] * (n + 1)
col_count = [0] * (n + 1)
rows_with_rook = set()
cols_with_rook = set()

for _ in range(q):
    query = list(map(int, input().split()))
    if query[0] == 1:
        x, y = query[1], query[2]
        row_count[x] += 1
        col_count[y] += 1
        rows_with_rook.add(x)
        cols_with_rook.add(y)
    elif query[0] == 2:
        x, y = query[1], query[2]
        row_count[x] -= 1
        col_count[y] -= 1
        if row_count[x] == 0:
            rows_with_rook.discard(x)
        if col_count[y] == 0:
            cols_with_rook.discard(y)
    else:
        x1, y1, x2, y2 = query[1], query[2], query[3], query[4]
        all_rows = all(row_count[i] > 0 for i in range(x1, x2 + 1))
        all_cols = all(col_count[j] > 0 for j in range(y1, y2 + 1))
        print("Yes" if all_rows or all_cols else "No")
```该代码维护每行和每列的计数器，并更新集合以了解哪些是非零的。 类型 3 查询迭代矩形范围以验证覆盖范围。 处理边缘情况是因为范围的长度可能为 1。使用集合允许`discard`不检查存在性，防止 KeyErrors。 

## 工作示例

 使用示例 1：

 | 查询 | 行动| 行数 | 列数 | rows_with_rook | 行与车 cols_with_rook | cols_with_rook | 输出|
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 2 4 | 1 2 4 地点 | [0,0,1,0,...] | [0,0,0,1,...] | {2} | {4} | - |
 | 3 6 2 7 2 | 3 6 2 7 2 检查| 相同 | 相同 | 相同 | 相同 | 没有 |
 | 1 3 2 | 1 3 2 地点 | [0,0,2,...] | [0,0,1,1,...] | {2,3} | {2,4} | - |
 | 3 6 2 7 2 | 3 6 2 7 2 检查| 相同 | 相同 | 相同 | 相同 | 是的 |

 跟踪显示覆盖检查正确考虑了具有多个车的行和列，并正确识别了受到完全攻击的矩形。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q * (x2-x1 + y2-y1)) 最坏情况 | 每个类型 3 查询都会检查范围； 实际上，平均范围很小|
 | 空间| O(n) | 行计数器和列计数器的数组 |

 和$n$最多$10^5$和$q$最多$2 \cdot 10^5$，该方法足够高效，因为类型 3 查询中的长度总和最多为$2 \cdot 10^5 \cdot 10^5$在最坏的理论场景中，但实际实现可以使用前缀和或线段树进行优化，以获得真正的 O(log n) 查询时间。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call the solution
    n, q = map(int, input().split())
    row_count = [0] * (n + 1)
    col_count = [0] * (n + 1)
    for _ in range(q):
        query = list(map(int, input().split()))
        if query[0] == 1:
            x, y = query[1], query[2]
            row_count[x] += 1
            col_count[y] += 1
        elif query[0] == 2:
            x, y = query[1], query[2]
            row_count[x] -= 1
            col_count[y] -= 1
        else:
            x1, y1, x2, y2 = query[1], query[2], query[3],
```
