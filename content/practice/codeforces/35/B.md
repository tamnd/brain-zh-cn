---
title: "CF 35B - 仓库"
description: "我们被要求模拟一个带有网格状货架系统的仓库。 每个架子有m节，从上到下有n个架子叠放。 每个部分最多可容纳一个盒子。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 35
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 35 (Div. 2)"
rating: 1700
weight: 35
solve_time_s: 81
verified: true
draft: false
---
[CF 35B - 仓库](https://codeforces.com/problemset/problem/35/B)

 **评分：** 1700
 **标签：** 实施
 **求解时间：** 1m 21s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求模拟一个带有网格状货架系统的仓库。 每个架子都有`m`部分，并且有`n`架子从上到下叠放。 每个部分最多可容纳一个盒子。 我们收到一系列操作：一些将箱子添加到给定的架子和部分，另一些则通过标识符删除箱子。 盒子不能重叠。 如果预期区域已满，则该盒子将被放置在同一架子右侧的下一个可用区域中。 如果没有剩余部分，我们将从最左边的部分开始继续到下面的下一个架子。 如果所有架子上都没有空闲部分，则该盒子将被丢弃。 

对于每个移除操作，我们必须输出确切的货架和盒子占用的部分或`-1 -1`如果它不在仓库里。 

限制很小：`n`和`m`最多30个，且操作次数`k`最多 2000。这允许直接模拟。 在最坏的情况下，每个放置可能需要扫描所有`n * m`职位。 这产生`2000 * 900 = 1.8 * 10^6`操作，在2秒限制下是可以接受的。 不明显的边缘情况包括尝试将盒子放入满架子或移除从未插入的盒子。 

例如，如果我们尝试在部分中放置一个框`(1, 2)`但已经满了，整个架子1都满了，箱子应该去分区`(2, 1)`。 如果所有架子都已满，则该盒子将被忽略。 忘记继续下一个架子的幼稚方法会产生错误的放置。 

## 方法

 蛮力方法很简单：维护一个代表仓库的二维网格。 每个单元格要么存储框标识符，要么为空。 对于插入`+1 x y id`，尝试将盒子放置在`(x, y)`。 如果已被占用，则扫描当前行的剩余部分，然后按顺序扫描后续行，直到找到空闲单元或所有架子都用完。 对于移除`-1 id`，搜索整个网格以找到该框并清除其单元格。 

这是正确的，但效率低下`-1`查询，因为每次搜索都可能需要`O(n*m)`时间，导致`O(k * n * m)`全面的。 考虑到这些限制，这种幼稚的搜索仍然有效，但可以避免。 

高效解决方案的关键在于每个盒子都有一个唯一的标识符，我们只需要有效地回答移除问题。 通过维护将框标识符映射到其位置的字典，我们可以在恒定时间内检索位置。 放置逻辑仍然使用网格，但移除操作不再需要扫描。 这减少了删除所花费的时间`O(n*m)`到`O(1)`每个查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(k * n * m) | O(n*m) | 有效，但上限较慢 |
 | 最佳 | O(k * n * m) | O(n*m + k) | 已接受 |

 ## 算法演练

 1. 初始化一个2D数组`warehouse`尺寸的`n x m`存储框标识符或`None`对于空部分。 创建字典`positions`将框标识符映射到当前的`(shelf, section)`坐标。 
2. 对于每个查询，解析操作。 如果是的话`+1 x y id`，尝试将盒子从货架开始放置`x-1`和部分`y-1`。 检查单元格是否为空。 如果是这样，放置盒子，将其坐标存储在`positions`，并继续下一个查询。 如果被占用，则沿着同一个架子向右移动。 如果到达货架末端，则移动到下面的下一个货架，从最左边的部分开始扫描。 重复此操作，直到找到空的部分或所有架子都用完。 如果没有找到空间，请忽略该框。 
3.为了`-1 id`，检查是否`id`存在于`positions`。 如果是，则检索`(shelf, section)`，输出从 1 开始的索引，删除其中的条目`positions`，并将单元格标记为`warehouse`如空。 如果不存在，则输出`-1 -1`。 
4. 对所有查询重复此操作。 

这样做的原因是仓库网格正确地表示了实时占用情况，并且字典确保了恒定时间的移除检​​索。 扫描顺序严格遵循问题放置规则，保证位置正确。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m, k = map(int, input().split())
warehouse = [[None for _ in range(m)] for _ in range(n)]
positions = {}

for _ in range(k):
    parts = input().split()
    if parts[0] == '+1':
        x, y, box_id = int(parts[1]) - 1, int(parts[2]) - 1, parts[3]
        placed = False
        for i in range(x, n):
            start_j = y if i == x else 0
            for j in range(start_j, m):
                if warehouse[i][j] is None:
                    warehouse[i][j] = box_id
                    positions[box_id] = (i, j)
                    placed = True
                    break
            if placed:
                break
    else:
        box_id = parts[1]
        if box_id in positions:
            i, j = positions.pop(box_id)
            print(i + 1, j + 1)
            warehouse[i][j] = None
        else:
            print(-1, -1)
```我们维护放置网格，因为扫描简单且安全。 字典确保删除操作的复杂度为 O(1)。 我们仔细处理基于 0 的索引和基于 1 的索引以匹配输出预期。 当移动到新的架子时，我们还会重置列扫描。 

## 工作示例

 示例 1 输入：```
2 2 9
+1 1 1 cola
+1 1 1 fanta
+1 1 1 sevenup
+1 1 1 whitekey
-1 cola
-1 fanta
-1 sevenup
-1 whitekey
-1 cola
```| 步骤| 运营| 仓库状态 | 职位 | 输出|
 | --- | --- | --- | --- | --- |
 | 1 | +1 1 1 可乐 | [[可乐，无]，[无，无]] | {'可乐':(0,0)} | |
 | 2 | +1 1 1 芬达 | [[可乐，芬达]，[无，无]] | {'可乐':(0,0),'芬达':(0,1)} | |
 | 3 | +1 1 1 七上 | [[可乐，芬达]，[七合，无]] | ... | |
 | 4 | +1 1 1 白键 | [[可乐，芬达]，[七合，白键]] | ... | |
 | 5 | -1 可乐 | [[无，芬达]，[七合，白键]] | {'芬达':(0,1),...} | 1 1 | 1
 | 6 | -1 芬达 | [[无，无]，[七，白键]] | {'sevenup':(1,0),'whitekey':(1,1)} | 1 2 |
 | 7 | -1 七上 | [[无，无]，[无，白键]] | {'白键':(1,1)} | 2 1 | 2
 | 8 | -1 白键 | [[无，无]，[无，无]] | {} | 2 2 | 2
 | 9 | -1 可乐 | [[无，无]，[无，无]] | {} | -1 -1 | -1 -1

 该跟踪确认了放置顺序和字典查找。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(k * n * m) | 在最坏的情况下，每个放置可能会扫描所有部分，删除是 O(1)。 |
 | 空间| O(n*m + k) | 仓库网格 + 最多 k 个盒子标识符的字典。 |

 和`n, m <= 30`和`k <= 2000`，这完全在 2 秒限制之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call solution
    n, m, k = map(int, input().split())
    warehouse = [[None]*m for _ in range(n)]
    positions = {}
    for _ in range(k):
        parts = input().split()
        if parts[0] == '+1':
            x, y, box_id = int(parts[1]) - 1, int(parts[2]) - 1, parts[3]
            placed = False
            for i in range(x, n):
                start_j = y if i == x else 0
                for j in range(start_j, m):
                    if warehouse[i][j] is None:
                        warehouse[i][j] = box_id
                        positions[box_id] = (i,j)
                        placed = True
                        break
                if placed:
                    break
        else:
            box_id = parts[1]
            if box_id in positions:
                i,j = positions.pop(box_id)
                print(i+1,j+1)
                warehouse[i][j] = None
            else:
                print(-1,-1)
    return output.getvalue().strip()
```
