---
title: "CF 104797F - 字母"
description: "我们得到一个包含小写字母和空单元格的矩形网格。 随着时间的推移，重力会作用在这个网格上，但方向不是固定的。"
date: "2026-06-28T13:44:49+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104797
codeforces_index: "F"
codeforces_contest_name: "2021-2022 ICPC Central Europe Regional Contest (CERC 21)"
rating: 0
weight: 104797
solve_time_s: 30
verified: true
draft: false
---

[CF 104797F - 信件](https://codeforces.com/problemset/problem/104797/F)

 **评级：** -
 **标签：** -
 **求解时间：** 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个包含小写字母和空单元格的矩形网格。 随着时间的推移，重力会作用在这个网格上，但方向不是固定的。 相反，网格在一系列重力方向下重复“固定”，其中每个阶段将所有字母在当前方向上尽可能远地完全移动，直到它们被边界或另一个字母阻挡。 

单相的行为类似于物理模拟：每个字母独立地沿给定方向滑动，但字母沿该方向保留其相对顺序，因为它们不能相互穿过。 当所有字母都静止后，下一阶段可能会以不同的重力方向开始。 

最终任务是在应用所有 K 个重力阶段后计算配置。 

约束很小：N 和 M 最多为 100，K 最多为 100。这立即表明任何复杂度约为 O(KNM) 甚至 O(KN M log N) 的解决方案都可能没问题。 然而，每一步一次模拟一个单元格移动的解决方案仍然是安全的，因为网格很小。 

主要的微妙之处在于，从天真的意义上来说，每个细胞的运动并不是独立的。 如果我们错误地逐个移动字母，较早的移动可能会影响同一阶段较晚的移动。 例如，在下降阶段：```
a
b
.
```如果我们搬家`a`首先，它可能会错误地通过`b`取决于实施顺序。 正确的解释是，一列中的所有字母的行为就像一个堆栈，作为一个整体重新排列。 

另一个微妙的边缘情况是空网格或没有字母的网格。 输出必须保持不变，并且任何压缩逻辑都必须正确处理空序列。 

最后，K = 0 意味着根本没有发生任何移动，因此必须完全按照给定打印原始网格。 

## 方法

 直接强力模拟会将每个阶段视为一个物理步骤，并在重力方向上一次重复移动每个字母一个单元，直到无法移动为止。 对于每个阶段，我们可能会尝试扫描网格、移动字母并重复直到稳定。 在最坏的情况下，单个字母可能会在每个阶段移动 O(max(N, M)) 步，并且我们可能需要多次传递来解决交互，导致在低效实现中复杂性可能降低到 O(KN²M²)。 这是不必要的，因为每行或列内的最终位置完全由排序或压缩确定。 

关键的观察结果是，除了沿着一条线排序之外，重力不会产生复杂的相互作用。 在任何固定方向上，网格都会分解为独立的行：垂直重力的列和水平重力的行。 在每一行中，字母只是简单地“挤”向一侧，同时保留它们的相对顺序。 这相当于从一行中提取所有字母，然后从目标侧按顺序写回，用点填充剩余的单元格。 

因此，每个阶段都可以在 O(NM) 内处理：我们通过收集字母和重写来独立重建每一行或每一列。 

由于 K 最多为 100，因此重复此过程 K 次就足够快了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解步骤模拟| O(K·N2·M2) 最坏情况 | O(1) 额外 | 太慢了 |
 | 每相线压实| O(K·N·M) | O(K·N·M) | O(NM) | 已接受 |

 ## 算法演练

 我们重复模拟每个重力阶段，但我们不是逐步移动字母，而是根据方向以结构化方式重建网格。 

### 分步过程

 1. 将网格读入可变结构，例如列表的列表。 
2. 对于序列中的每个重力方向，一次性处理整个网格。 
3. 如果方向是垂直（向下）：

 我们独立处理每一列。 对于每一列，我们从上到下扫描，按顺序收集所有字母，然后从下到上写回。 这模拟重力将字母向下拉，同时保持顺序。 
4. 如果方向向上：

 再次处理每一列。 我们从上到下收集字母，然后从第 0 行开始从上到下写回。这会将字母向上打包。 
5. 如果方向正确：

 我们独立处理每一行。 我们从左到右收集字母，然后从最后一列开始从右到左写回它们。 
6. 如果方向为左：

 我们独立处理每一行。 我们从左到右收集字母，然后从最左边的位置开始写回。 
7. 处理完一个阶段的所有行或列后，网格将被更新并成为下一阶段的输入。 

### 为什么它有效

 每个阶段都保留字母沿着与运动正交的轴的相对顺序，因为字母永远不会相互交叉。 重力的唯一作用是将所有字母沿着一条线压缩到一个边界。 因此，每一行或每一列的行为就像一个稳定的有序容器，其元素会重新定位，但不会在内部进行排列。 这个不变量确保通过提取和重新插入字母来重建每一行与物理过程完全匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def apply_down(grid, n, m):
    for col in range(m):
        stack = []
        for row in range(n):
            if grid[row][col] != '.':
                stack.append(grid[row][col])
        for row in range(n - 1, -1, -1):
            grid[row][col] = stack.pop() if stack else '.'

def apply_up(grid, n, m):
    for col in range(m):
        stack = []
        for row in range(n):
            if grid[row][col] != '.':
                stack.append(grid[row][col])
        for row in range(n):
            grid[row][col] = stack.pop(0) if stack else '.'

def apply_right(grid, n, m):
    for row in range(n):
        stack = []
        for col in range(m):
            if grid[row][col] != '.':
                stack.append(grid[row][col])
        for col in range(m - 1, -1, -1):
            grid[row][col] = stack.pop() if stack else '.'

def apply_left(grid, n, m):
    for row in range(n):
        stack = []
        for col in range(m):
            if grid[row][col] != '.':
                stack.append(grid[row][col])
        for col in range(m):
            grid[row][col] = stack.pop(0) if stack else '.'

def main():
    n, m, k = map(int, input().split())
    dirs = input().strip()
    grid = [list(input().strip()) for _ in range(n)]

    for d in dirs:
        if d == 'D':
            apply_down(grid, n, m)
        elif d == 'U':
            apply_up(grid, n, m)
        elif d == 'R':
            apply_right(grid, n, m)
        else:
            apply_left(grid, n, m)

    for row in grid:
        print(''.join(row))

if __name__ == "__main__":
    main()
```该解决方案将网格维护为可变的二维列表。 每个阶段根据方向重建行或列。 

对于向下和向上的重力，每一列都被提取到字母的线性列表中。 对于向下的重力，我们从底部重新填充，以便字母聚集在最低的可用单元格中。 对于向上的重力，我们从顶部重新填充。 

对于水平重力，行的处理方式类似，右重力从右边缘填充，左重力从左边缘填充。 

一个微妙的细节是我们必须在提取过程中保持顺序。 这就是为什么我们扫描consi
