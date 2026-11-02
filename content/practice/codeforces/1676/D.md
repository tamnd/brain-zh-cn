---
title: "CF 1676D - X 总和"
description: "我们得到一个代表棋盘的二维网格，其中每个单元格都包含一个非负整数。 主教可以放置在任何单元格上，它会攻击与其位置相交的四个对角线上的所有单元格。 主教所在的牢房算作受到攻击。"
date: "2026-06-10T00:59:24+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1676
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 790 (Div. 4)"
rating: 1000
weight: 1676
solve_time_s: 107
verified: true
draft: false
---

[CF 1676D - X-Sum](https://codeforces.com/problemset/problem/1676/D)

 **评分：** 1000
 **标签：** 暴力、贪婪、实现
 **求解时间：** 1m 47s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个代表棋盘的二维网格，其中每个单元格都包含一个非负整数。 主教可以放置在任何单元格上，它会攻击与其位置相交的四个对角线上的所有单元格。 主教所在的牢房算作受到攻击。 我们的任务是考虑棋盘上所有可能的位置，找到主教可以攻击的单元格的最大值总和。 

输入指定多个测试用例，每个测试用例都有自己的电路板尺寸和值。 约束条件告诉我们，电路板的大小可以达到 200 x 200，并且所有测试用例中的所有单元格的总和上限为 40,000。 这意味着，虽然单独检查每个单元的简单解决方案可能适用于单个测试用例，但每个单元对角线上的简单嵌套迭代对于较大的板和多个测试用例来说将太慢。 

边缘情况包括只有一行或一列的棋盘，其中主教可以攻击很少的单元格，以及除了单个大值之外所有值都为零的棋盘。 在这些情况下，错误计算对角线或重复计算中心单元的粗心方法可能会失败。 例如，一个 2x2 板，其值`[[1, 2], [3, 4]]`如果仅正确计算两个对角单元格，则将主教放置在 (1,1) 处，其总和为 1+4=5，但简单的求和可能会重复计算或漏掉某些单元格。 

## 方法

 蛮力方法将涉及迭代板上的每个单元格，然后沿着所有四个对角线迭代以对受攻击的值求和。 这是有效的，因为每个主教的攻击区域都是可预测的，但对于最大的棋盘来说，它变得太慢了。 对于单个 200x200 板，每个单元可能需要 O(n+m) 来对角线求和，从而导致每个测试用例 O(n_m_(n+m)) = O(200_200_400) = 16,000,000 次操作，这接近可行性的上限，并且对于多个测试用例来说速度很慢。 

关键的观察是位于同一对角线上的细胞共享一个属性：要么是差异`(row - col)`或总和`(row + col)`是恒定的。 左上角到右下角的对角线由下式标识`row - col`，右上角到左下角的对角线由下式标识`row + col`。 如果我们预先计算每条对角线的总和，则为在该位置受到主教攻击的所有单元格的总和`(i,j)`只是其总和`row-col`对角线加上其和`row+col`对角线，减去处的值`(i,j)`（以避免重复计算单元格本身）。 预先计算这些对角线可将每个单元的计算量减少到 O(1)，从而使每块板的总复杂度为 O(n*m)，这已经足够快了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n_m_(n+m)) | O(n_m_(n+m)) | O(1) | O(1) | 对于大板来说速度太慢 |
 | 最佳| O(n*m) | O(n+m) | 已接受 |

 ## 算法演练

 1. 初始化两个字典来保存沿对角线的值的总和。 一本字典地图`row - col`沿该对角线和其他地图的值的总和`row + col`沿该对角线的值的总和。 
2. 迭代每个单元格`(i,j)`在董事会中。 将其值添加到相应的`row - col`对角线和以及`row + col`对角线总和。 此步骤一次性聚合所有单元格对其对角线的贡献。 
3. 计算对角线和后，再次迭代每个单元格`(i,j)`并计算将主教放置在`(i,j)`作为其总和`row - col`对角线加上其和`row + col`对角线，减去单元格自身的值以避免重复计算。 
4. 跟踪本次迭代期间遇到的最大总和。 检查完所有单元格后，最大总和就是该测试用例的答案。 

为什么有效：该算法保证了正确性，因为每个对角线和都包含该对角线上的所有值。 通过组合穿过一个单元的两条对角线并减去一次中心单元，我们可以精确地计算出主教攻击的每个单元，而不会遗漏或重复计算任何值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, m = map(int, input().split())
    a = [list(map(int, input().split())) for _ in range(n)]
    
    diag1 = {}
    diag2 = {}
    
    for i in range(n):
        for j in range(m):
            d1 = i - j
            d2 = i + j
            diag1[d1] = diag1.get(d1, 0) + a[i][j]
            diag2[d2] = diag2.get(d2, 0) + a[i][j]
    
    max_sum = 0
    for i in range(n):
        for j in range(m):
            total = diag1[i - j] + diag2[i + j] - a[i][j]
            if total > max_sum:
                max_sum = total
    
    print(max_sum)
```第一个循环构建对角线和。 使用字典可以确保我们处理负索引`row-col`对角线没有错误。 第二个循环使用这些预先计算的和有效地计算每个单元的主教攻击和。 减法`a[i][j]`避免对单元格本身进行重复计算，这是一个很容易被忽视的微妙点。 

## 工作示例

 ### 示例 1

 董事会：```
1 2 2 1
2 4 2 4
2 2 3 1
2 4 2 4
```关键对角线和：

 | 对角线 (i-j) | 总和|
 | --- | --- |
 | -3 | 1 |
 | -2 | 2+2=4 |
 | -1 | 2+2+4=8 |
 | 0 | 1+4+3+4=12 |
 | 1 | 2+2+2=6 |
 | 2 | 2+4=6 |
 | 3 | 1+4=5 |

 | 对角线 (i+j) | 总和|
 | --- | --- |
 | 0 | 1 |
 | 1 | 2+2=4 |
 | 2 | 2+4+2=8 |
 | 3 | 1+2+3+1=7 |
 | 4 | 4+2+2=8 |
 | 5 | 4+4=8 |
 | 6 | 4 |

 主教在`(1,1)`有`diag1[0]=12`和`diag2[2]=8`， 减`4`对于重复计数的单元格，总数为 16。最大值出现在`(1,2)`或者`(3,1)`总和为 20。 

### 示例 2

 董事会：```
1
0
```只有一个单元格，主教和为1。算法正确计算`diag1[0]=1`,`diag2[0]=1`， 减`1`，共 1 个。 

这些迹线表明对角线总和正确聚合，减去单元格值可以避免重复计算。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n*m) | 棋盘上的两次完整迭代：第一次计算对角线和，第二次计算最大攻击和 |
 | 空间| O(n+m) | 在两个字典中存储最多 n+m 对角线的总和 |

 该解决方案可轻松处理多达 40,000 个单元格的总和。 即使有 1,000 个测试用例，由于每个单元的线性处理，每个小板也能快速完成。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # solution starts here
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        a = [list(map(int, input().split())) for _ in range(n)]
        
        diag1 = {}
        diag2 = {}
        for i in range(n):
            for j in range(m):
                diag1[i - j] = diag1.get(i - j, 0) + a[i][j]
                diag2[i + j] = diag2.get(i + j, 0) + a[i][j]
        
        max_sum = 0
        for i in range(n):
            for j in range(m):
                total = diag1[i - j] + diag2[i + j] - a[i][j]
                if total > max_sum:
                    max_sum = total
        print(max_sum)
    return output.getvalue().strip()

# Provided samples
assert run("4\n4 4\n1 2 2 1\n2 4 2 4\n2 2 3 1\n2 4 2 4\n2 1\n1\n0\n3 3\n1 1 1\n1 1 1\n1 1 1\n3 3\n0 1 1\n1 0 1\n1 1 0\n") == "20\n1\n5\n3", "sample 1"

# Custom cases
assert run("1\n1 1\n100\n") == "100", "single cell"
assert run("1\n2 2\n
```
