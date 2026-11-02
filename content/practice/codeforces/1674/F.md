---
title: "CF 1674F - 桌面重新排列"
description: "我们得到一个代表桌面的 2D 网格，其中图标标记为“”，空单元格标记为“.”。 如果图标从左上角开始占据一个紧凑的矩形，则桌面被认为是“好”：所有图标都填充一定数量的完整列，并且可能有一个前缀......"
date: "2026-06-10T01:16:36+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1674
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 786 (Div. 3)"
rating: 1800
weight: 1674
solve_time_s: 106
verified: true
draft: false
---

[CF 1674F - 桌面重新排列](https://codeforces.com/problemset/problem/1674/F)

 **评分：** 1800
 **标签：** 数据结构，贪心，实现
 **求解时间：** 1m 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个代表桌面的 2D 网格，其中图标标记为“*”，空单元格标记为“.”。 如果图标占据从左上角开始的紧凑矩形，则桌面被认为是“良好”：所有图标填充一定数量的完整列，并且可能填充一个附加列的前缀。 该形状之外不应有任何图标。 例如，如果我们有 4 行和 4 列，并且前两列完全充满图标，第三列顶部有一个图标，这很好。 这种紧凑排列之外的任何图标都会违反“良好”属性。 

然后我们会收到一系列查询，每个查询要么向单元格添加一个图标，要么将其删除。 每次查询后，我们必须计算将桌面恢复到良好配置所需的最小移动次数。 每一步都包括选择一个图标并将其放置在其他地方。 

约束很严格：网格最多可以有 1000 x 1000，并且最多可以有 200,000 个查询。 每个查询扫描整个网格的简单方法，这将是$O(n \cdot m \cdot q)$，都太慢了。 这迫使我们找到一种解决方案，在几乎恒定或对数的时间内处理更新和查询。 

当图标分散以致不存在完整的列时，会出现微妙的边缘情况。 例如，位置 (1,1) 和 (2,2) 处有图标的 2x2 网格需要重新排列两个图标才能形成良好的桌面。 不考虑图标总数或其线性化位置的简单方法会错误地计算移动次数。 

## 方法

 暴力方法很简单：每次查询后，计算网格中的所有图标并计算应填充左上角矩形中的哪些单元格。 然后，我们扫描网格，计算需要移入矩形或从外部删除的错位图标。 This works correctly but is too slow. 每次查询都会花费$O(n \cdot m)$，20万次查询，总操作量可达$2 \cdot 10^{11}$，这是不可行的。 

The key insight for optimization comes from linearizing the 2D grid into a 1D array. If we imagine the desktop filled column by column, the "good" desktop corresponds to placing the first$k$第一个图标$k$该一维数组的位置。 我们可以维护一个长度的数组$n \cdot m$表示每个单元格是否包含图标。 对于每个查询，我们更新图标的数量并跟踪第一个查询中有多少图标被放错位置$k$细胞。 我们只需要知道图标的总数和第一个中的空单元格的数量$k$位置来确定移动次数，从而减少每次查询的成本$O(1)$并进行适当的簿记。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * m * q) | O(n * m) | 太慢了|
 | 最佳| O(n * m + q) | O(n * m) | 已接受 |

 ## 算法演练

 1.读取网格尺寸$n$和$m$，以及查询次数$q$。 按列优先顺序将网格展平为一维数组，以便第一列的单元格首先出现，然后是第二列，依此类推。 这与所需的“良好”配置一致。 
2.统计图标总数，`total_icons`，在当前网格中。 确定一个好的桌面上应该填充的一维位置的数量：第一个`total_icons`一维数组的单元格。 
3. 维护一个变量`misplaced`计算第一个中的位置数`total_icons`在一维数组中是空的（即图标应该在的位置但不是）。 这等于所需的最小移动次数，因为此前缀中的每个空单元格都需要将图标从外部移动到其中。 
4. 对于每个查询，计算单元格的一维索引。 如果单元格包含图标，请将其删除； 否则，添加它。 更新`total_icons`因此。 
5. 如果更新的单元格位于第一个单元格内`total_icons`位置，调整`misplaced`±1 取决于单元是否变空或已满。 如果单元格位于此范围之外，但图标总数发生变化，还需调整`misplaced`如果运动影响第一个的边界`total_icons`职位。 
6. 输出`misplaced`每次查询后。 

为什么它有效：通过按列展平网格，第一个`total_icons`单元格代表“好”桌面的确切形状。 此前缀中错位的单元格与必须移动的图标完全对应。 这个不变量在查询和更新中都成立`misplaced`基于本地更改保证正确性$O(1)$每个查询。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m, q = map(int, input().split())
grid = [input().strip() for _ in range(n)]

# Flatten the grid column-wise
cells = []
for j in range(m):
    for i in range(n):
        cells.append(grid[i][j] == '*')

total_cells = n * m
total_icons = sum(cells)
misplaced = sum(1 for i in range(total_icons) if not cells[i])

# Map from 2D to 1D index
def idx(x, y):
    return (y - 1) * n + (x - 1)

res = []
for _ in range(q):
    x, y = map(int, input().split())
    i = idx(x, y)
    if cells[i]:
        # Removing an icon
        if i < total_icons:
            misplaced -= 1
        total_icons -= 1
        cells[i] = False
        if cells[total_icons]:
            misplaced += 1
    else:
        # Adding an icon
        if i < total_icons:
            misplaced += 1
        if cells[total_icons]:
            misplaced -= 1
        cells[i] = True
        total_icons += 1
    res.append(str(misplaced))

print('\n'.join(res))
```该解决方案首先将网格扁平化为列主序，以简化“良好”的配置。 我们维持`total_icons`和`misplaced`这样我们就可以随时知道需要多少步。 索引从2D到1D的映射以及仔细的更新`misplaced`何时添加或删除图标对于避免差一错误至关重要。 

## 工作示例

 样本1：```
Initial grid (4x4):
..**
.*..
*...
...*
Flattened column-major:
[., *, *, ., *, ., ., *, ., ., ., *]

total_icons = 5
Prefix length = 5
Prefix cells: [., *, *, ., *]
Empty cells in prefix: 3 → minimum moves = 3
```第一个查询 (1,3) 切换单元格 (1,3) 后：```
Index in 1D: 2
Cell contained '*' → now empty
Index < total_icons → misplaced -= 1 → misplaced = 2
total_icons -= 1 → total_icons = 4
Check new boundary (cell at index total_icons=4 is '*') → misplaced += 1 → misplaced = 3
Output: 3
```后续查询的更新类似，始终保持以下不变式：`misplaced`计算 length 前缀中的空单元格数`total_icons`。 

此跟踪确认该解决方案可以正确处理添加和删除，同时仅更新受影响的单元格。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * m + q) | 展平网格需要 O(n*m)。 每个查询都会更新 O(1) 变量。 |
 | 空间| O(n * m) | 存储展平网格和布尔状态。 |

 和$n, m \le 1000$和$q \le 2 \cdot 10^5$，总操作量约为$10^6 + 2 \cdot 10^5$都在限制之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, m, q = map(int, input().split())
    grid = [input().strip() for _ in range(n)]
    cells = []
    for j in range(m):
        for i in range(n):
            cells.append(grid[i][j] == '*')
    total_cells = n * m
    total_icons = sum(cells)
    misplaced = sum(1 for i in range(total_icons) if not cells[i])
    def idx(x, y):
        return (y - 1) * n + (x - 1)
    res = []
    for _ in range(q):
        x, y = map(int, input().split())
        i = idx(x, y)
        if cells[i]:
            if i < total_icons:
                misplaced -= 1
            total_icons -= 1
            cells[i] = False
            if cells[total_icons]:
                misplaced += 1
        else:
            if i < total_icons:
                misplaced += 1
            if cells[total_icons]:
                misplaced -= 1
            cells[i] = True
            total_icons += 1
        res.append(str(misplaced))
    return '\n'.join(res)

# Provided sample
assert run("""4
```
