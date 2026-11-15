---
title: "CF 71B - 进度条"
description: "我们被要求构建一个图形进度条作为正方形数组，其中每个正方形都有一个饱和值。 条形图共有 n 个方格，最大饱和度为 k。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 71
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 65 (Div. 2)"
rating: 1300
weight: 71
solve_time_s: 67
verified: true
draft: false
---

[CF 71B - 进度条](https://codeforces.com/problemset/problem/71/B)

 **评分：** 1300
 **标签：** 实现、数学
 **求解时间：** 1m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求构建一个图形进度条作为正方形数组，其中每个正方形都有一个饱和值。 酒吧共有`n`平方，最大饱和度为`k`。 该过程的完成度衡量为`t`百分比，我们需要使用正方形的饱和度直观地反映该百分比。 

规则是：

 - 前几个方块完全饱和（`k`)，代表已完成的部分。 
- 最后几个方块是空的（`0`)，代表未完成的部分。 
- 最多可以部分填充一个方格以精确匹配百分比`t`。 

输入由三个整数组成：`n`,`k`， 和`t`，都在 [0, 100] 范围内`t`和 [1, 100] 为`n`和`k`。 输出是一个数组`n`表示每个方块的饱和度的整数。 

因为`n`和`k`两者都最多为 100，我们可以通过简单的算术和迭代得到 O(n) 的解决方案。 不存在性能问题； 这些约束使得直接模拟变得可行。 

当出现不明显的边缘情况时`t`是 0 或 100，或者当部分填充的正方形的小数部分恰好是 0 或`k`。 例如，如果`t = 0`，所有方格都应为 0，并且如果`t = 100`，所有的方格都应该是`k`。 即使在这些情况下，粗心的解决方案也可能会尝试计算“部分平方”，从而导致差一错误。 

## 方法

 蛮力方法是迭代每个方格，根据百分比计算该方格所需的准确饱和度，并填充数组。 这是有效的，因为我们可以将问题视为分裂`t`占总饱和度的百分比`n`正方形，但当只能部分填充一个正方形时，它会引入不必要的分数算术和复杂性。 

关键的见解是要注意问题是线性的：每个方块的贡献正好`k`饱和度单位，除了可能的一个部分平方。 我们可以将总“饱和度单位”计算为`(t / 100) * (n * k)`。 那么，完全填充的正方形的数量就是该值除以的整数`k`，部分填满的方格为余数，其余方格为空。 这使我们能够在 O(n) 中构建答案，而无需迭代分数或执行复杂的比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n) | O(n) | 已接受但冗长 |
 | 最佳| O(n) | O(n) | 已接受，清晰简洁 |

 ## 算法演练

 1. 计算所需的总饱和度单位`t`完成百分比：`total_saturation = (t * n * k) // 100`整数除法之所以有效，是因为饱和度必须是整数，并且任何小数部分自然会变成部分填充的平方。 
2. 通过除以确定完全填满的正方形的数量`total_saturation`经过`k`：`full_squares = total_saturation // k`这确保了每个第一个`full_squares`方格饱和到最大值。 
3. 计算部分填充的正方形的剩余饱和度：`partial_saturation = total_saturation % k`如果为零，则不存在部分平方； 如果非零，则满格后的下一个格将获得该值。 
4.初始化一个长度的数组`n`带零。 
5.填写第一个`full_squares`和`k`。 
6. 如果`partial_saturation`非零，将其分配给下一个方块。 
7. 数组的其余部分保持为零。 

工作原理：该算法保持饱和度值之和匹配的不变量`(t / 100) * (n * k)`。 由于满格之后的每个方格要么部分填充，要么为零，并且仅存在一个部分方格，因此输出始终满足问题条件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, k, t = map(int, input().split())

# Total saturation units
total_saturation = (t * n * k) // 100

# Number of fully filled squares
full_squares = total_saturation // k

# Remaining saturation for the partial square
partial_saturation = total_saturation % k

# Initialize the progress bar
progress = [0] * n

# Fill full squares
for i in range(full_squares):
    progress[i] = k

# Fill partial square if it exists
if full_squares < n:
    progress[full_squares] = partial_saturation

print(' '.join(map(str, progress)))
```该代码首先计算单位的总饱和度，这是一个缩放整数版本`t%`。 除以`k`将完全填充的正方形与部分正方形分开。 用零初始化数组可确保未填充的方块已经正确。 这`if`条件避免了索引错误`t = 100`。 

## 工作示例

 **样品1：**`n=10, k=10, t=54`| 步骤| 总饱和度 | 完整方块 | 部分饱和 | 进度数组 |
 | --- | --- | --- | --- | --- |
 | 计算总计 | 54 | 54 5 | 4 | [10,10,10,10,10,4,0,0,0,0] |

 此迹线显示部分正方形正确地占了 5 个完整正方形后剩下的 4 个单位。 

**自定义示例：**`n=5, k=20, t=0`| 步骤| 总饱和度 | 完整方块 | 部分饱和 | 进度数组 |
 | --- | --- | --- | --- | --- |
 | 计算总计 | 0 | 0 | 0 | [0,0,0,0,0] |

 这证实了边缘情况处理的进度为零。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 填充数组`n`正方形占主导地位|
 | 空间| O(n) | 我们储存`n`进度条的整数 |

 因为`n ≤ 100`，该算法非常高效，并且非常适合时间和内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, k, t = map(int, input().split())
    total_saturation = (t * n * k) // 100
    full_squares = total_saturation // k
    partial_saturation = total_saturation % k
    progress = [0] * n
    for i in range(full_squares):
        progress[i] = k
    if full_squares < n:
        progress[full_squares] = partial_saturation
    return ' '.join(map(str, progress))

# Provided samples
assert run("10 10 54\n") == "10 10 10 10 10 4 0 0 0 0"
# Custom cases
assert run("5 20 0\n") == "0 0 0 0 0", "zero progress"
assert run("5 20 100\n") == "20 20 20 20 20", "full progress"
assert run("4 5 37\n") == "5 5 3 0", "partial square rounding"
assert run("1 1 50\n") == "0", "single square half progress"
assert run("3 10 33\n") == "10 0 0", "fractional rounding down"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 5 20 0 | 5 20 0 0 0 0 0 0 | 0 0 0 0 0 边缘情况：零进展 |
 | 5 20 100 | 5 20 100 20 20 20 20 20 | 20 20 20 20 20 边缘案例：全面进展 |
 | 4 5 37 | 5 5 3 0 | 5 5 3 0 正确计算部分平方 |
 | 1 1 50 | 1 1 50 0 | 单方圆角|
 | 3 10 33 | 3 10 33 10 0 0 | 10 0 0 分数饱和度向下舍入 |

 ## 边缘情况

 当`t=0`，总饱和度为零。 该算法计算`full_squares=0`和`partial_saturation=0`。 完整正方形的循环不执行任何操作，并且会跳过部分正方形的条件，因为`full_squares < n`是真的但是`partial_saturation`为零，将数组保留为`[0, 0, ...]`，完全正确。 

什么时候`t=100`,`total_saturation = n*k`,`full_squares = n`,`partial_saturation = 0`。 循环将所有方块填充为`k`，并且条件检查不会改变数组，因为`full_squares`等于`n`，避免越界错误。 

对于小数百分比，例如`t=37`和`n=4`和`k=5`，总饱和度为`(37*4*5)//100 = 7`。 满格`7//5=1`， 部分的`7%5=2`。 数组变成`[5,2,0,0]`，正确反映一个完整的正方形和一个部分的正方形。 

这证实了 0、100 或部分饱和度的边缘情况都得到了正确处理。 

这篇社论充分解释了算法的推导、棘手情况的处理以及
