---
title: "CF 14A-字母"
description: "我们得到一个矩形网格，代表一张具有 _n_ 行和 _m_ 列的方格纸。 一些方块有阴影，用 * 标记，其余的没有阴影，用 .. 标记。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 14
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 14 (Div. 2)"
rating: 800
weight: 14
solve_time_s: 68
verified: true
draft: false
---
[CF 14A - 信件](https://codeforces.com/problemset/problem/14/A)

 **评分：** 800
 **标签：** 实施
 **求解时间：** 1m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个矩形网格，代表一张具有 _n_ 行和 _m_ 列的方格纸。 一些方块有阴影，标记为`*`，其余的都没有阴影，标记为`.`。 鲍勃想要剪出包含所有阴影方块的最小矩形，以便他可以以最小的成本发送它。 输出只是该矩形的内容，保留原始着色图案。 

由于两个维度都以 50 为界，因此网格很小。 这意味着任何接触每个单元几次的算法都足够快。 问题本质上是找到所有周围的最小边界框`*`人物。 

非明显的边缘情况包括所有阴影单元位于同一行、同一列或聚集在角落的情况。 例如，如果输入是：```
3 3
*..
...
...
```输出必须是`*`，而不是整个行或列。 例如，如果总是打印完整的行或列，粗心的实现可能会过度包含空单元格。 同样，只有一行或一列的矩形应该被正确处理，而不会产生索引错误。 

## 方法

 蛮力方法是迭代网格中所有可能的矩形，检查每个矩形是否包含所有矩形`*`并选择面积最小的一个。 这是有效的，因为保证了正确性：任何包含所有星星的矩形都是候选者。 然而，操作次数大致为`(n * m)^2 * (n * m)`用于检查每个矩形，这大约需要 1500 万次迭代`n = m = 50`。 虽然这在 Python 中仍然可以在一秒内运行，但它效率低下且不必要。 

最优方法利用问题结构：我们只需要最上面、最下面、最左边和最右边`*`细胞。 如果我们记录最小和最大的行索引和列索引，其中`*`出现时，这四个值立即定义最小边界矩形。 这减少了对每个单元精确扫描一次并输出由这些边界定义的子网格的工作。 关键的观察是最小矩形必须与阴影单元的极端坐标对齐，因此不需要测试其他矩形。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((纳米)^3) | O(纳米) | 太慢了|
 | 最佳| O(纳米) | O(1) 额外 | 已接受 |

 ## 算法演练

 1. 初始化变量以跟踪最小和最大行（`top`,`bottom`）和列（`left`,`right`）包含`*`。 放`top`和`left`到非常大的数字，并且`bottom`和`right`至-1。 
2. 迭代每个单元格`(i, j)`在网格中。 当一个单元格包含`*`， 更新`top`到`min(top, i)`,`bottom`到`max(bottom, i)`,`left`到`min(left, j)`， 和`right`到`max(right, j)`。 此步骤确定阴影区域的极值。 
3. 扫描后，`top`到`bottom`给出行范围和`left`到`right`给出包含所有星星的最小矩形的列范围.
 4. 迭代行`top`到`bottom`对于每一行，打印列中的子字符串`left`到`right`。 这会输出原始着色图案完好无损的最小矩形。 

为什么它有效：该算法保持了以下不变式：`top`,`bottom`,`left`， 和`right`总是包容一切`*`到目前为止所看到的。 一旦扫描完所有单元格，由这些边界定义的矩形就是可能的最小矩形，因为任何较小的矩形都会错过至少一个`*`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
grid = [input().strip() for _ in range(n)]

top, bottom = n, -1
left, right = m, -1

for i in range(n):
    for j in range(m):
        if grid[i][j] == '*':
            top = min(top, i)
            bottom = max(bottom, i)
            left = min(left, j)
            right = max(right, j)

for i in range(top, bottom + 1):
    print(grid[i][left:right + 1])
```该代码读取网格，跟踪阴影单元的极端位置，并相应地对网格进行切片。 使用`strip()`确保没有换行符干扰。 通过将两个端点都包含在切片中可以避免相差一错误`right + 1`和`bottom + 1`。 

## 工作示例

 **示例1**：

 输入：```
6 7
.......
..***..
..*....
..***..
..*....
..***..
```跟踪变量：

 | 行| '*' 位置 | 顶部 | 底部| 左| 对|
 | --- | --- | --- | --- | --- | --- |
 | 0 | 无 | 6 | -1 | 7 | -1 |
 | 1 | 2,3,4 | 1 | 1 | 2 | 4 |
 | 2 | 2 | 1 | 2 | 2 | 4 |
 | 3 | 2,3,4 | 1 | 3 | 2 | 4 |
 | 4 | 2 | 1 | 4 | 2 | 4 |
 | 5 | 2,3,4 | 1 | 5 | 2 | 4 |

 提取的矩形：第 1-5 行，第 2-4 列

 输出：```
***
*..
***
*..
***
```**示例 2（单细胞）**：

 输入：```
3 3
...
.*.
...
```跟踪变量：

 | 行| '*' 位置 | 顶部 | 底部| 左| 对|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 1 | 1 | 1 | 1 |

 输出：```
*
```这表明即使是单个阴影单元也可以正确处理。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(纳米) | 我们对每个单元格扫描一次，并仅对行进行切片以用于输出。 |
 | 空间| O(纳米) | 网格本身被存储； 额外的变量是 O(1)。 |

 给定`n, m ≤ 50`,`nm`is at most 2500, well within the 1-second limit. Memory usage is negligible.

 ## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    n, m = map(int, input().split())
    grid = [input().strip() for _ in range(n)]

    top, bottom = n, -1
    left, right = m, -1

    for i in range(n):
        for j in range(m):
            if grid[i][j] == '*':
                top = min(top, i)
                bottom = max(bottom, i)
                left = min(left, j)
                right = max(right, j)

    for i in range(top, bottom + 1):
        print(grid[i][left:right + 1])

    return sys.stdout.getvalue().strip()

# Provided sample
assert run("6 7\n.......\n..***..\n..*....\n..***..\n..*....\n..***..") == "***\n*..\n***\n*..\n***", "sample 1"

# Single star
assert run("3 3\n...\n.*.\n...") == "*", "single star"

# Full rectangle
assert run("2 2\n**\n**") == "**\n**", "full 2x2 rectangle"

# Row-only rectangle
assert run("3 5\n.....\n*****\n.....") == "*****", "row only"

# Column-only rectangle
assert run("4 3\n.*.\n.*.\n.*.\n.*.") == "*\n*\n*\n*", "column only"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 3\n...\n.*.\n...`|`*`| 单细胞矩形 |
 |`2 2\n**\n**`|`**\n**`| 完整的小矩形|
 |`3 5\n.....\n*****\n.....`|`*****`| 单行矩形 |
 |`4 3\n.*.\n.*.\n.*.\n.*.`|`*\n*\n*\n*`| 单柱矩形 |

 ## 边缘情况

 如果所有星星排成一排，`top`和`bottom`是平等的。 我们的循环正确地打印了该行。 类似地，如果所有星星都位于一列中，`left`和`right`相等，产生一个单列矩形。 如果星星位于网格的角落，例如`(0,0)`,`min`和`max`逻辑仍然计算正确的边界矩形。 该算法无缝处理最小和最大输入。
