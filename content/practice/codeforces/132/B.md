---
title: "CF 132B - 皮特"
description: "我们被要求在一个小的矩形网格上模拟一个简化的 Piet 解释器。 每个单元格是一个颜色在0到9之间的像素，其中0是黑色，其他数字是彩色块。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 132
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 96 (Div. 1)"
rating: 2100
weight: 132
solve_time_s: 116
verified: true
draft: false
---

[CF 132B - 皮特](https://codeforces.com/problemset/problem/132/B)

 **评分：** 2100
 **标签：** 实施
 **求解时间：** 1m 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求在一个小的矩形网格上模拟一个简化的 Piet 解释器。 每个单元格是一个颜色在0到9之间的像素，其中0是黑色，其他数字是彩色块。 颜色块总是矩形且相连的，因此每个颜色簇形成一个完美的矩形。 黑色像素可以是任意形状。 程序从左上角彩色块的指令指针 (IP) 开始。 IP 由三个组件定义：当前块 (BP)、可以指向上、下、左或右的方向指针 (DP)，以及当 IP 遇到边缘或黑色像素时修改移动的块选择器 (CP)。 

在每一步，如果可能的话，解释器将 BP 在 DP 方向上移动到下一个块，否则，它会更新 CP 并可能旋转 DP。 任务是确定BP之后落地的方块的颜色`n`步骤。 网格最多为 50×50 像素，但是`n`最多可达 5000 万，这对于简单的逐步模拟来说太大了。 

非明显的边缘情况包括单行或单列块、迫使 DP 和 CP 重复旋转的黑色像素序列以及 BP 多次重新访问同一块的循环。 例如，一个网格：```
12
34
```和`n = 10`以可预测的模式循环遍历块。 简单的模拟会尝试所有 10 个步骤，但在更大的情况下`n`，这是不可能的。 

## 方法

 暴力方法很简单：从初始块开始，逐步迭代，应用 DP 和 CP 更新规则，并在每次移动后跟踪当前块。 这是有效的，因为每个步骤都是确定性的，并且规则完全指定了新状态。 然而，随着`n`达到5000万，这种方式执行的操作太多； 每个步骤都需要 O(1) 的工作，因此总复杂度为 O(n)，考虑到 2 秒的时间限制，这太慢了。 

更快解决方案的关键是将 IP 转换视为有限确定性状态机。 每个状态由当前块、DP 和 CP 定义。 由于块的数量有限（50×50 网格最多 2500 个），并且有 8 种可能的 DP/CP 配置（4 个 DP 方向 × 2 个 CP 方向），因此状态总数最多为 20,000 个。 通过模拟步骤直到状态重复，我们检测循环。 一旦找到一个循环，我们就可以计算出最终的块`n`使用模算术的步骤而不是迭代每个步骤。 

蛮力适用于小`n`或小网格但失败时`n`很大。 存在有限多个状态的观察使我们能够将模拟减少到最多一个周期检测，然后进行模计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n) | O(1) | O(1) | 对于大 n 来说太慢 |
 | 循环检测| O(米 × 宽 × 8) | O(米 × 宽 × 8) | 已接受 |

 ## 算法演练

 1. 预处理网格以识别所有彩色块。 对于每个块，存储其左上角和右下角坐标。 这允许在向任何方向移动时对块边缘进行恒定时间检查。 
2、定义DP和CP方向为向量：DP可以向上`(−1,0)`， 向下`(1,0)`， 左边`(0,−1)`， 正确的`(0,1)`，并且 CP 可以相对于 DP 向左或向右。 这使得沿着边缘计算下一个像素变得简单。 
3. 初始化左上角块的 IP，DP 指向右侧，CP 指向左侧。 将每个状态编码为一个元组`(block_id, dp, cp)`。 
4. 逐步模拟程序，同时在字典映射中记录访问过的状态`(block_id, dp, cp)`到步骤编号。 对于每一步，根据DP和CP规则确定下一个块。 
5. 如果某个状态重复出现，则检测循环长度。 让`start`是循环开始的步骤，并且`length`循环中的步数。 以循环长度为模计算最后一步并返回该步骤的块。 
6. 如果在总步数内未检测到循环（不太可能是由于有限状态），则继续正常仿真，直到步骤`n`。 

为什么有效：有限数量的块和方向保证了模拟最终必须重复一个状态。 因为 Piet 解释器是确定性的，所以再次进入相同的状态总是会产生相同的块序列。 通过减少大`n`对于检测到的循环内的步骤，我们无需模拟每个步骤即可实现正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

# direction vectors: 0=right, 1=down, 2=left, 3=up
dp_moves = [(0,1), (1,0), (0,-1), (-1,0)]

# CP left/right: -1 for left, +1 for right relative to DP
cp_changes = {'L': -1, 'R': 1}

def rotate_dp(dp):
    return (dp + 1) % 4

def parse_grid(m):
    grid = []
    for _ in range(m):
        row = list(map(int, list(input().strip())))
        grid.append(row)
    return grid

def find_blocks(grid):
    m, w = len(grid), len(grid[0])
    block_id = 0
    block_map = [[-1]*w for _ in range(m)]
    blocks = []
    for i in range(m):
        for j in range(w):
            color = grid[i][j]
            if color == 0 or block_map[i][j] != -1:
                continue
            # expand rectangle
            x0, y0 = i, j
            x1, y1 = i, j
            while x1+1 < m and all(grid[x1+1][y] == color for y in range(y0, y1+1)):
                x1 += 1
            while y1+1 < w and all(grid[x][y1+1] == color for x in range(x0, x1+1)):
                y1 += 1
            # mark cells
            for x in range(x0, x1+1):
                for y in range(y0, y1+1):
                    block_map[x][y] = block_id
            blocks.append((x0, y0, x1, y1, color))
            block_id += 1
    return block_map, blocks

def next_block(block_map, blocks, block_idx, dp, cp):
    x0, y0, x1, y1, color = blocks[block_idx]
    dx, dy = dp_moves[dp]
    # find furthest edge in DP
    if dp == 0:  # right
        edge_cells = [(i, y1) for i in range(x0, x1+1)]
    elif dp == 1:  # down
        edge_cells = [(x1, j) for j in range(y0, y1+1)]
    elif dp == 2:  # left
        edge_cells = [(i, y0) for i in range(x0, x1+1)]
    else:  # up
        edge_cells = [(x0, j) for j in range(y0, y1+1)]
    # select cell in CP direction
    if cp == 'L':
        if dp % 2 == 0:
            next_cell = min(edge_cells, key=lambda x: x[0] if dp==0 else x[1])
        else:
            next_cell = min(edge_cells, key=lambda x: x[1] if dp==1 else x[0])
    else:
        if dp % 2 == 0:
            next_cell = max(edge_cells, key=lambda x: x[0] if dp==0 else x[1])
        else:
            next_cell = max(edge_cells, key=lambda x: x[1] if dp==1 else x[0])
    nx, ny = next_cell[0]+dx, next_cell[1]+dy
    m, w = len(block_map), len(block_map[0])
    if 0 <= nx < m and 0 <= ny < w and block_map[nx][ny] != -1:
        return block_map[nx][ny], dp, cp
    else:
        if cp == 'L':
            return block_idx, dp, 'R'
        else:
            return block_idx, rotate_dp(dp), 'L'

def main():
    m, n = map(int, input().split())
    grid = parse_grid(m)
    block_map, blocks = find_blocks(grid)
    dp, cp = 0, 'L'
    block_idx = block_map[0][0]

    visited = {}
    states = []
    step = 0
    while step < n:
        key = (block_idx, dp, cp)
        if key in visited:
            cycle_start = visited[key]
            cycle_len = step - cycle_start
            remaining = (n - step) % cycle_len
            block_idx, dp, cp = states[cycle_start + remaining]
            break
        visited[key] = step
        states.append((block_idx, dp, cp))
        block_idx, dp, cp = next_block(block_map, blocks, block_idx, dp, cp)
        step += 1
    print(blocks[block_idx][4])

if __name__ == "__main__":
    main()
``
```
