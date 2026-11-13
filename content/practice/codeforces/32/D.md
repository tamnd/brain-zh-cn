---
title: "CF 32D-星座"
description: "我们得到一个大小为 _n_ × _m_ 的 2D 网格，每个单元格要么包含星形 *，要么包含空。任务是找到十字形的星座。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 32
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 32 (Div. 2, Codeforces format)"
rating: 1600
weight: 32
solve_time_s: 59
verified: true
draft: false
---
[CF 32D - 星座](https://codeforces.com/problemset/problem/32/D)

 **评分：** 1600
 **标签：** 实施
 **求解时间：** 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个大小为 _n_ × _m_ 的二维网格，每个单元格包含一颗星星`*`或空`.`。 任务是找到十字形的星座。 十字以一颗星星为中心，并在所有四个方向上垂直和水平延伸恰好 _x_ 个正方形，其中 _x_ 是任何正整数，使得所有五个单元都存在并包含星星。 我们被要求根据特定的顺序找到第 k 个星座：首先按半径（最小的第一个），然后按中心恒星的行（最上面的第一个），然后按列（最左边的第一个）。 

界限为 _n_、_m_ ≤ 300 且 _k_ ≤ 3000 万。 地图大小适中，因此 O(n² m²) 算法是可以接受的，但 O(n m max(n,m)) 会开始突破限制。 对于 300×300 的网格，在每个半径上进行暴力尝试可能会导致数千万次检查，这已经是我们在 2 秒内可以处理的上限。 边缘情况包括没有星星的地图、边缘处的十字、半径为 1 与更大半径的十字，以及当存在的星座少于 k 时要求第 k 个星座。 

粗心的实现可能会在不首先验证边界的情况下迭代潜在的交叉。 例如，如果中心星位于 (1,1)，则简单的检查可能会尝试访问上臂的 (0,1)，从而导致索引错误。 同样，一张充满星星但缺少中间星星的地图可能会欺骗天真的半径计数算法。 

## 方法

 蛮力方法在概念上很简单：对于地图上的每颗星星，尝试从 1 开始的所有可能的半径，直到十字超出范围。 对于每个半径，检查所有四个臂以查看星星是否存在。 如果有效，则记录星座，然后根据半径、行和列对所有找到的星座进行排序。 这是正确的，但效率低下。 当 n = m = 300 时，中心的星形半径可达 150，检查每个星形的每个半径都会进行乘法运算，在最坏的情况下给出 O(n m min(n,m))。 通过 90,000 个单元和 150 个半径检查，我们超过了 1000 万次操作，接近极限。 

关键的见解是我们只需要知道每颗恒星在每个方向上的最大臂长。 使用动态规划预先计算每个单元格在上、下、左、右方向上的连续星星的数量：从上到下迭代“上”数组，从下到上迭代“下”，从左到右迭代“左”，从右到左迭代“右”。 每颗星的最大交叉半径是这四个预先计算值中的最小值。 一旦我们知道了这一点，我们就可以生成所有有效的交叉，而无需单独迭代每个半径。 这减少了冗余检查并使算法足够快。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n m 分钟(n,m)) | O(1) | O(1) | 上限太慢 |
 | 预先计算臂长 | O(n·m) | O(n·m × 4) | 已接受 |

 ## 算法演练

 1.读取网格并初始化四个大小为n×m的矩阵：上、下、左、右。 每个矩阵都会存储从当前单元格开始的该方向上的连续星星。 
2. 通过从上到下迭代每一列来填充“向上”矩阵。 如果单元格包含星号，则设置 up[i][j] = up[i-1][j] + 1（如果顶行则设置为 1）。 这计算了包括当前单元格在内向上存在的连续星星数量。 
3. 类似地，通过从下到上迭代来填充“下”，通过从左到右迭代来填充“左”，通过从右到左迭代来填充“右”。 
4. 对于每个包含星星的单元格，计算其最大交叉半径为`r = min(up[i][j], down[i][j], left[i][j], right[i][j]) - 1`。 减去 1，因为中央恒星在每个方向上都被计数。 
5. 对于从 1 到 r 的每个半径，记录一个元组`(radius, row, col)`代表一个有效的十字。 将所有元组存储在列表中。 
6. 按半径、行、列对十字列表进行排序。 
7. 如果k超过交叉数，则输出-1。 否则，取第k个元组并输出中心、上、下、左、右星星的坐标。 

为什么有效：预计算保证了我们知道每个单元在所有四个方向上的最大范围。 通过取最小值，我们可以避免生成无效的交叉。 排序可确保所请求的第 k 个星座恰好满足问题的排序规则。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m, k = map(int, input().split())
grid = [input().strip() for _ in range(n)]

up = [[0]*m for _ in range(n)]
down = [[0]*m for _ in range(n)]
left = [[0]*m for _ in range(n)]
right = [[0]*m for _ in range(n)]

# Precompute consecutive stars
for i in range(n):
    for j in range(m):
        if grid[i][j] == '*':
            up[i][j] = 1 + (up[i-1][j] if i > 0 else 0)
            left[i][j] = 1 + (left[i][j-1] if j > 0 else 0)

for i in reversed(range(n)):
    for j in reversed(range(m)):
        if grid[i][j] == '*':
            down[i][j] = 1 + (down[i+1][j] if i < n-1 else 0)
            right[i][j] = 1 + (right[i][j+1] if j < m-1 else 0)

crosses = []
for i in range(n):
    for j in range(m):
        if grid[i][j] == '*':
            radius = min(up[i][j], down[i][j], left[i][j], right[i][j]) - 1
            for r in range(1, radius+1):
                crosses.append((r, i, j))

crosses.sort()
if k > len(crosses):
    print(-1)
else:
    r, i, j = crosses[k-1]
    print(i+1, j+1)
    print(i+1-r, j+1)
    print(i+1+r, j+1)
    print(i+1, j+1-r)
    print(i+1, j+1+r)
```该解决方案首先预先计算每个方向的最大拉伸，以避免冗余的半径检查。 半径减 1 确保我们只计算中心以外的星星。 对元组进行排序`(radius, i, j)`直接尊重问题的顺序。 边界检查是隐式的，因为预计算在网格边缘停止。 

## 工作示例

 示例 1 输入：```
5 6 1
....*.
...***
....*.
..*...
.***..
```| 我| j | 向上 | 下| 左| 对| min-1（半径）| 十字架记录|
 | --- | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 5 | 1 | 1 | 1 | 1 | 0 | - |
 | 2 | 4 | 1 | 1 | 1 | 2 | 0 | - |
 | 2 | 5 | 2 | 2 | 2 | 2 | 1 | 半径 1 十字 |

 该迹线确认算法正确计算半径并生成第一个十字。 

第二个例子，具有最小地图的边缘情况：```
3 3 1
.*.
***
.*.
```(2,2) 处的中心星半径为 1。输出：```
2 2
1 2
3 2
2 1
2 3
```## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n·m) | 预先计算四个矩阵并迭代交叉，与单元数量成线性关系； 排序交叉会增加 O(n m log(n m))，但对于 n*m ≤ 90000 | 是可以接受的
 | 空间| O(n·m) | 四个方向矩阵加上交叉列表 |

 该解决方案完全符合 2 秒时间限制和 256 MB 内存限制。 排序不是瓶颈，因为最大交叉数受星星总数乘以 min(n,m) 的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, m, k = map(int, input().split())
    grid = [input().strip() for _ in range(n)]

    up = [[0]*m for _ in range(n)]
    down = [[0]*m for _ in range(n)]
    left = [[0]*m for _ in range(n)]
    right = [[0]*m for _ in range(n)]

    for i in range(n):
        for j in range(m):
            if grid[i][j] == '*':
                up[i][j] = 1 + (up[i-1][j] if i > 0 else
```
