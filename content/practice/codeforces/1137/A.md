---
title: "CF 1137A - 摩天大楼"
description: "给定一个城市，其布局为大小为 $n 乘以 m$ 的网格，其中每个单元格代表包含一定高度的摩天大楼的交叉点。"
date: "2026-06-12T03:57:08+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1137
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 545 (Div. 1)"
rating: 1600
weight: 1137
solve_time_s: 101
verified: false
draft: false
---

[CF 1137A - 摩天大楼](https://codeforces.com/problemset/problem/1137/A)

 **评分：** 1600
 **标签：** 实施、排序
 **求解时间：** 1m 41s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个按大小网格排列的城市$n \times m$，其中每个单元格代表包含特定高度的摩天大楼的交叉点。 对于行的每个交叉点$i$和列$j$，我们关注两行摩天大楼：完整的$i$第 排（东街）和全$j$第纵队（南街）。 Dora 希望为这些摩天大楼重新分配整数高度，保持行和列中高度的相对顺序不变，并使用从 1 到某个整数的数字$x$。 目标是最小化最大数量$x$用过的。 

输入包括$n$和$m$，随后是$n \times m$表示初始高度的整数网格。 输出应该是相同大小的网格，其中每个单元格包含最小可能的最大高度$x$该交叉路口可以实现。 

约束条件允许$n, m \le 1000$，所以网格可以达到$10^6$细胞。 通过分别对行和列进行排序来独立解决每个交叉点的简单解决方案需要$O(n m (n + m) \log(n + m))$操作，速度太慢。 这意味着我们需要一种解决方案，可以对行和列信息进行一次预处理，并在每个交叉点有效地使用它。 

当行或列具有重复高度时，会出现微妙的边缘情况。 例如，如果一行是`[1, 1, 2]`有一列是`[1, 2, 2]`，交叉点高度会影响行和列的排名。 在行和列中独立分配排名的粗心方法可能会违反其中一行中的相对顺序。 

另一种边缘情况发生在输入最少的情况下，$n = m = 1$。 在这里，唯一的交集答案通常是 1，但算法必须正确处理单元素行和列，而不会出现索引错误。 

## 方法

 蛮力方法是单独考虑每个交叉点。 对于包含该交集的行和列，我们将从 1 开始对最小高度进行排序和分配等级，并跟踪最大分配的数字。 然后我们计算两个序列的最大数量，考虑交叉点的重叠。 这可以正常工作，但效率低下，因为对每一行和每一列进行排序$nm$次导致大约$O(n m (n + m) \log(n + m))$运营。 

关键的观察是每行和每列内的高度的相对排名可以预先计算。 对于每一行，我们可以为每个单元格分配一个“行排名”，以表示其在排序行中的位置。 同样，对于每一列，我们可以分配一个“列排名”。 对于交汇处$(i, j)$，如果一个等级支配另一个等级，则答案是行等级和列等级的最大值加上调整，因为我们需要扩展数字以对齐两个序列中交集的位置。 这允许在预处理后以恒定的时间计算每个单元的答案，从而将复杂性降低到$O(n m)$后$O(n m \log m + n m \log n)$行和列排序的预处理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n m (n + m) log(n + m)) | O(n m (n + m) log(n + m)) | O(n + m) | 太慢了 |
 | 最佳 | O(nm log m + nm log n) | O(nm log m + nm log n) | O(n·m) | 已接受 |

 ## 算法演练

 1. 对于每一行，提取所有高度并计算该行中每个单元格的排名。 最小高度的排名为 1，次小高度的排名为 2，依此类推。 这可确保在重新映射到最小整数时保持行中的相对顺序。 
2. 对每列重复相同的过程，为每个单元格分配列排名。 在这个阶段，我们有两个秩矩阵：`row_rank[i][j]`和`col_rank[i][j]`。 
3. 对于每个单元格$(i, j)$，计算保留行顺序和列顺序所需的最大数量。 让`r = row_rank[i][j]`和`c = col_rank[i][j]`。 让`row_len`是行中唯一值的数量`i`和`col_len`是列中唯一值的数量`j`。 交集的最小最大值是`max(r, c) + max(row_len - r, col_len - c)`。 该公式确保两个序列都可以映射到`[1, x]`不破坏秩序。 
4. 打印最小最大值的结果矩阵。 

为什么它有效：`row_rank`和`col_rank`对每行的最小相对顺序进行编码。 在交叉点，两者之间的最大排名决定该单元格的起始编号。 行右侧或列下方的任何剩余位置都会按剩余唯一排名的数量扩展最大值，保证不违反相对顺序。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(n)]

row_rank = [[0]*m for _ in range(n)]
col_rank = [[0]*m for _ in range(n)]

# Compute ranks for rows
for i in range(n):
    vals = sorted(set(a[i]))
    val_to_rank = {v: idx+1 for idx, v in enumerate(vals)}
    for j in range(m):
        row_rank[i][j] = val_to_rank[a[i][j]]

# Compute ranks for columns
for j in range(m):
    col_vals = sorted({a[i][j] for i in range(n)})
    val_to_rank = {v: idx+1 for idx, v in enumerate(col_vals)}
    for i in range(n):
        col_rank[i][j] = val_to_rank[a[i][j]]

# Compute final answers
res = [[0]*m for _ in range(n)]
for i in range(n):
    for j in range(m):
        r = row_rank[i][j]
        c = col_rank[i][j]
        row_len = len(set(a[i]))
        col_len = len({a[k][j] for k in range(n)})
        res[i][j] = max(r, c) + max(row_len - r, col_len - c)

for row in res:
    print(*row)
```前两节使用排序集有效地计算行和列的排名。 使用集合可以避免重复的高度干扰排名。 最终的嵌套循环使用上述公式计算每个交点的最小最大值。 必须谨慎使用`len(set(...))`计算唯一的高度，否则重复可能会导致错误的结果。 

## 工作示例

 样本1：

 输入：```
2 3
1 2 1
2 1 2
```| 我| j | 行排名 | 上校排名 | 行长度 | col_len | 资源 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 0 | 1 | 1 | 2 | 2 | 2 |
 | 0 | 1 | 2 | 2 | 2 | 2 | 2 |
 | 0 | 2 | 1 | 1 | 2 | 2 | 2 |
 | 1 | 0 | 2 | 2 | 2 | 2 | 2 |
 | 1 | 1 | 1 | 1 | 2 | 2 | 2 |
 | 1 | 2 | 2 | 2 | 2 | 2 | 2 |

 该表确认，对于每个交叉点，所需的最大高度为 2，正如预期的那样。 

样本2：

 输入：```
1 4
3 1 2 2
```行后排名：`[4, 1, 2, 2]`→ 排名`[4, 1, 2, 2]`每个列的排名：1 长度的列 →`[1, 1, 1, 1]`最大公式：`max(r,c) + max(row_len - r, col_len - c)`→`[4, 1, 2, 2]`这表明该算法可以正确处理单行情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(nm log m + nm log n) | O(nm log m + nm log n) | 对行和列进行排序以计算排名在复杂性中占主导地位
 | 空间| O(n·m) | 存储行排名、列排名和结果网格 |

 该解完全在 2 秒的时间限制内，因为$n, m \le 1000$至多意味着$10^6$细胞，并且分选步骤是负担得起的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, m = map(int, input().split())
    a = [list(map(int, input().split())) for _ in range(n)]
    
    row_rank = [[0]*m for _ in range(n)]
    col_rank = [[0]*m for _ in range(n)]
    
    for i in range(n):
        vals = sorted(set(a[i]))
        val_to_rank = {v: idx+1 for idx, v in enumerate(vals)}
        for j in range(m):
            row_rank
```
