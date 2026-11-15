---
title: "CF 485B - 宝贵的资源"
description: "我们被要求在二维笛卡尔地图上建立一个方形城市，使其包围所有给定的地雷，以整数坐标的点表示。 正方形的边必须保持与轴平行，我们的目标是最小化正方形的面积。"
date: "2026-05-31T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy"]
categories: ["algorithms"]
codeforces_contest: 485
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 276 (Div. 2)"
rating: 1300
weight: 485
solve_time_s: 669
verified: false
draft: false
---

[CF 485B - 宝贵资源](https://codeforces.com/problemset/problem/485/B)

 **评分：** 1300
 **标签：** 暴力、贪婪
 **求解时间：** 11m 9s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求在二维笛卡尔地图上建立一个方形城市，使其包围所有给定的地雷，以整数坐标的点表示。 正方形的边必须保持与轴平行，我们的目标是最小化正方形的面积。 输入包括`n`点，每个点都有坐标`(x_i, y_i)`，输出是一个表示正方形最小面积的整数。 

约束表明`n`最大可达 1000，坐标最大可达 ±10^9。 这意味着任何复杂性比以下更差的方法`O(n)`或者`O(n log n)`可以接受，因为1000分很容易管理。 尝试迭代所有可能的方形位置的蛮力方法将涉及`O(n^2)`或者更糟，这对于 1000 个点来说仍然可行，但没有必要，因为存在更直接的几何方法。 

当所有点都位于一条线上时，就会出现边缘情况，例如：```
2
1 1
1 5
```在这里，覆盖垂直线的正方形也必须水平延伸，因此正方形的边由任一维度的最大分布决定。 粗心的方法可能只分别取 x 或 y 的最大差值，而不考虑正方形边必须是两个差值中较大的一个。 

另一个微妙的情况是所有点都相同时：```
3
0 0
0 0
0 0
```这里正方形的边长应为 0，面积应为 0。正确处理零面积非常重要。 

## 方法

 一种简单的方法是尝试所有可能的左上角和右下角点对作为正方形的角，计算覆盖它们所需的正方形边，并保留找到的最小面积。 对于每一对，我们都会检查所有点以查看它们是否适合内部。 这大约会产生`O(n^3)`即使对于`n = 1000`，在最坏的情况下可能需要 10^9 次操作。 

关键的观察结果是正方形的边必须覆盖地雷的 x 和 y 坐标的极端。 让`min_x`和`max_x`是最小和最大 x 坐标，并且`min_y`和`max_y`最小和最大 y 坐标。 任何覆盖所有点的正方形必须至少跨越`max_x - min_x`水平和`max_y - min_y`垂直。 为了满足正方形形状，我们取这两个跨度中较大的一个作为边长。 这一观察结果将问题简化为最小/最大值的简单线性扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力（所有角对）| O(n^3) | O(n^3) | O(n) | 太慢了 |
 | 最小-最大减少（最佳）| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.初始化四个变量来跟踪极值坐标：`min_x`,`max_x`,`min_y`， 和`max_y`。 放`min_x`和`min_y`非常大的值（无穷大）和`max_x`和`max_y`到非常小的值（-无穷大）。 
2. 迭代每个矿井坐标`(x_i, y_i)`。 对于每个点，更新`min_x`如果`x_i`较小，`max_x`如果`x_i`较大，`min_y`如果`y_i`更小，并且`max_y`如果`y_i`更大。 这一步找到所有地雷的边界矩形。 
3. 计算正方形所需的边长为`side = max(max_x - min_x, max_y - min_y)`。 这确保了正方形可以覆盖由端点定义的矩形，同时保持相等的边。 
4. 将面积计算为`area = side * side`并输出结果。 

工作原理：点的边界矩形决定了覆盖所有地雷所需的最小宽度和高度。 采用较大的尺寸可确保城市保持正方形，同时仍覆盖所有点。 没有一个更小的正方形可以包围所有地雷，因为至少一侧太短而无法覆盖一维的极值点。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
min_x = float('inf')
max_x = float('-inf')
min_y = float('inf')
max_y = float('-inf')

for _ in range(n):
    x, y = map(int, input().split())
    if x < min_x:
        min_x = x
    if x > max_x:
        max_x = x
    if y < min_y:
        min_y = y
    if y > max_y:
        max_y = y

side = max(max_x - min_x, max_y - min_y)
area = side * side
print(area)
```上面的代码直接反映了算法步骤。 使用`float('inf')`和`float('-inf')`确保任何第一个点都能正确初始化极值。 单独更新最小/最大值可以避免相差一的错误，特别是对于负坐标。 

## 工作示例

 **样品1：**```
Input:
2
0 0
2 2
```| 步骤| 最小_x | 最大_x | 分钟_y | 最大_y |
 | --- | --- | --- | --- | --- |
 | 初始| 信息 | -inf| 信息 | -inf|
 | (0,0) 之后 | 0 | 0 | 0 | 0 |
 | (2,2) | 之后 0 | 2 | 0 | 2 |

 边 = max(2-0, 2-0) = 2，面积 = 4。正确。 

**定制样品2：**```
Input:
3
1 3
4 5
2 2
```| 步骤| 最小_x | 最大_x | 分钟_y | 最大_y |
 | --- | --- | --- | --- | --- |
 | 初始| 信息 | -inf| 信息 | -inf|
 | (1,3) | 之后 1 | 1 | 3 | 3 |
 | (4,5) 之后 | 1 | 4 | 3 | 5 |
 | (2,2) | 之后 1 | 4 | 2 | 5 |

 边 = max(4-1, 5-2) = 3，面积 = 9。正确。 

这些痕迹证实该算法正确计算了覆盖所有点的最小平方。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 单次遍历所有点来计算最小/最大坐标 |
 | 空间| O(1) | O(1) | 只有四个变量来跟踪极值，与 n | 无关

 给定`n`≤ 1000，该算法几乎立即执行。 内存使用微不足道。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    min_x = float('inf')
    max_x = float('-inf')
    min_y = float('inf')
    max_y = float('-inf')

    for _ in range(n):
        x, y = map(int, input().split())
        min_x = min(min_x, x)
        max_x = max(max_x, x)
        min_y = min(min_y, y)
        max_y = max(max_y, y)

    side = max(max_x - min_x, max_y - min_y)
    return str(side * side)

# Provided sample
assert run("2\n0 0\n2 2\n") == "4", "sample 1"

# Minimum size input
assert run("2\n0 0\n0 0\n") == "0", "all points identical"

# Vertical line
assert run("2\n1 1\n1 5\n") == "16", "vertical line"

# Horizontal line
assert run("2\n3 7\n8 7\n") == "25", "horizontal line"

# Maximum spread
assert run("4\n-1000000000 -1000000000\n1000000000 1000000000\n0 0\n-500000000 500000000\n") == "4000000000000000000", "large coordinates"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2 个相同点 | 0 | 零面积案例|
 | 垂直线| 16 | 16 边必须等于 y 差 |
 | 水平线| 25 | 25 边必须等于 x 差 |
 | 大坐标| 4e18 | 4e18 处理极端坐标值而不溢出 |

 ## 边缘情况

 对于相同的点，例如`2\n0 0\n0 0`,`min_x = max_x = min_y = max_y = 0`，边 = 0，面积 = 0。该算法可以正确处理此问题，因为它使用`max(max_x - min_x, max_y - min_y)`这是 0。 

对于垂直线`2\n1 1\n1 5`,`min_x = max_x = 1`,`min_y = 1`,`max_y = 5`，边 = max(0, 4) = 4，面积 = 16。算法正确选择最大尺寸作为正方形边。 

对于水平线`2\n3 7\n8 7`,`min_x = 3`,`max_x = 8`,`min_y = max_y = 7`，side = max(5, 0) = 5，area = 25。再次，它正确识别了正方形边
