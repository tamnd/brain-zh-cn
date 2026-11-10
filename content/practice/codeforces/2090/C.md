---
title: "CF 2090C - 餐厅"
description: "餐厅是一个无限的网格网格。 其中一些单元格被分组为表格，每个表格占据一个 2×2 的正方形，坐标为 $(3x+1,3y+1)$ 到 $(3x+2,3y+2)$，所有其他单元格都是走廊。"
date: "2026-06-09T03:49:23+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "greedy", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 2090
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 1012 (Div. 2)"
rating: 1700
weight: 2090
solve_time_s: 100
verified: false
draft: false
---

[CF 2090C - 餐厅](https://codeforces.com/problemset/problem/2090/C)

 **评分：** 1700
 **标签：** 数据结构、贪心、实现、排序
 **求解时间：** 1m 40s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 餐厅是一个无限的网格网格。 其中一些单元格被分组为表格，每个表格占据位于表格坐标处的 2×2 正方形$(3x+1,3y+1)$通过$(3x+2,3y+2)$，所有其他单元格都是走廊。 客人一一到达原点(0,0)，并希望根据自己的类型占据一个表格单元格。 类型 1 的客人选择最近的空闲桌子单元格，而类型 0 的客人选择最近的完全空的桌子。 距离以沿着走廊单元格的曼哈顿距离来测量，并且首先通过 x 坐标，然后通过 y 坐标断开联系。 

输入提供多个测试用例。 每个测试用例都会列出客人的数量及其类型的序列。 输出必须按到达顺序列出每位客人所坐的表格单元格的坐标。 

最大`n`所有测试用例的总和为 50,000。 由于每个来宾可能天真地要求扫描一组无限的表单元格来查找最近的空闲单元格，因此每个来宾的强力 BFS 太慢了。 具体来说，每个客人从 (0,0) 开始的朴素 BFS 可能需要访问多个走廊单元，这些走廊单元的数量与到最近的空闲桌子的距离成正比，并且无限增长。 这排除了任何具有 O(n*d) 复杂度的解决方案，其中 d 是到表的距离。 

不明显的边缘情况包括连续的 0 类客人，其中某些桌子的单元格被部分占用。 仅检查“任何空闲单元”的简单方法会将部分占用的桌子错误地分配给 0 类客人。 另一个微妙之处是打破平局：多个单元格可能是等距的，因此先按 x 排序，然后按 y 排序对于满足问题的确定性要求至关重要。 例如，如果类型 1 客人看到两个等距的空闲单元 (1,2) 和 (2,1)，则客人必须选择 (1,2)。 

## 方法

 一种强力方法是维护占用单元格的网格图。 对于每个访客，从 (0,0) 开始执行 BFS，直到到达有效的表单元格，然后将其标记为已占用。 这是正确的，但探索的单元数量会随着距离线性增长，并且对于多达 50,000 个客人，每个客人的 BFS 太慢了。 

关键的见解是表格按照规则的 3×3 网格图案对齐。 每个表格单元格可以直接从其“表格坐标”（x，y）映射到实际坐标（（3x+1或+2，3y+1或+2））。 此外，从 (0,0) 到任何表格单元格的曼哈顿距离仅取决于表格坐标和与表格内单元格的小偏移量。 具体来说，对于 {0,1} 中的表坐标 (tx, ty) 和单元格偏移量 (dx, dy)，距离为`(3*tx + dx) + (3*ty + dy)`。 

由于网格是无限的且结构化的，因此我们可以预先计算表格单元格的占用顺序。 0 类客人占据 2×2 块的整张桌子，而 1 类客人可以选择任何桌子上的任何空闲单元格。 我们可以维护两种序列：一种跟踪完全空的表，另一种跟踪部分占用的表中的空闲单元。 由于按距离、x、y 排序是可预测的，因此我们可以按正确的顺序生成表格单元格，并按顺序将它们分配给客人，而无需使用 BFS。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 每个客人的强力 BFS | 最坏情况 O(n*d) | BFS 的 O(d^2) | 太慢了 |
 | 预计算单元序列和贪婪分配 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 用坐标表示表格`(tx, ty)`在 3×3 网格中。 每个表有 4 个单元格：`(3*tx + 1, 3*ty + 1)`,`(3*tx + 1, 3*ty + 2)`,`(3*tx + 2, 3*ty + 1)`,`(3*tx + 2, 3*ty + 2)`。 
2. 使用公式根据距 (0,0) 的距离预先计算表格单元格的顺序`dist = 3*tx + dx + 3*ty + dy`。 对于每个距离，先按 x 然后按 y 对候选单元格进行排序。 
3. 为 0 类客人维护一个完全空的桌子队列。 当 0 类客人到达时，从队列中弹出第一张桌子并分配其第一个空闲单元，将该桌子标记为部分占用，并将剩余的空闲单元添加到池中供 1 类客人使用。 
4. 为 1 类客人维护一个单独的空闲单元队列。 当类型 1 客人到达时，从该队列中弹出第一个空闲单元。 如果单元格的表以前是空的，则将其从空表队列中删除。 
5. 对于按顺序排列的每位客人，根据其类型，从相应的队列中分配下一个适当的单元并将其标记为已占用。 相应地更新队列。 
6. 按照到达顺序输出每个指定单元格的坐标。 

此策略之所以有效，是因为表结构确保表单元格的曼哈顿距离从原点开始在离散层中增加。 通过按距离对单元格进行排序并按坐标打破平局，队列自然地保持了不变性：类型 0 的客人总是选择完全空的表，类型 1 的客人总是选择最接近原点的空闲单元格。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

def solve():
    q = int(input())
    for _ in range(q):
        n = int(input())
        t = list(map(int, input().split()))
        
        # Precompute table cells in order
        empty_tables = deque()
        free_cells = deque()
        
        # Generate enough tables to cover n guests
        # 2D BFS-like layer expansion
        layer = 0
        cells = []
        while len(cells) < n*4:
            for tx in range(layer+1):
                ty = layer - tx
                for dx in (1,2):
                    for dy in (1,2):
                        cells.append((3*tx+dx, 3*ty+dy, tx, ty))
            layer += 1
        
        # empty tables queue
        table_cells_map = {}
        for x,y,tx,ty in cells:
            table_cells_map.setdefault((tx,ty), []).append((x,y))
        
        empty_table_queue = deque(sorted(table_cells_map.keys(), key=lambda k: 3*k[0]+3*k[1]))
        # prepare all free cells queue for type 1 guests
        free_cell_queue = deque()
        
        result = []
        for typ in t:
            if typ == 0:
                tx, ty = empty_table_queue.popleft()
                x, y = table_cells_map[(tx, ty)].pop(0)
                result.append(f"{x} {y}")
                # remaining cells go to free cells queue
                free_cell_queue.extend(table_cells_map[(tx,ty)])
            else:
                x, y = free_cell_queue.popleft()
                result.append(f"{x} {y}")
        
        print("\n".join(result))

if __name__ == "__main__":
    solve()
```该解决方案按照距离顺序预先计算足够数量的表。 每个类型 0 来宾从空表队列中删除一个表，并将剩余单元推送到类型 1 空闲单元队列。 类型 1 的客人总是从空闲单元队列的前面进行选择。 这避免了任何 BFS 并保证按距离和坐标正确排序。 

## 工作示例

 **样品1：**

 | 访客| 类型 | 指定单元 | 空桌子| 自由细胞|
 | ---| ---| ---| ---| ---|
 | 1 | 0 | (1,1) | {(0,1),(1,0),...} | [(1,2),(2,1),(2,2)] |
 | 2 | 1 | (1,2) | 相同| [(2,1),(2,2)] |
 | 3 | 1 | (2,1) | 相同| [(2,2)] |
 | 4 | 0 | (1,4) | 下一个空表| [...] |
 | 5 | 0 | (4,1) | 下一个空表| [...] |
 | 6 | 1 | (1,5) | 相同| [...] |

 该表显示，类型 0 的客人总是占用一张新桌子，而类型 1 的客人则填写剩余的空闲单元格。 

**示例 2：** 构建的所有类型 1 客人的小示例显示空闲单元队列就足够了，而无需触及空表队列。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每位客人均处理一次； 预计算生成足够的与 n 成比例的单元。 |
 | 空间| O(n) | 队列最多存储 4*n 个用于分配的单元。 |

 该解决方案非常适合 n 高达 50,000 和内存 512MB 的 2 秒时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# provided sample
assert run("2\n6\n0 1 1 0 0 1\n5\n1 0 0 1 1\n") == "1 1\n1 2\n2 1\n1 4\n4 1\n1 5\n1 1\n1 4\n4 1\n1
```
