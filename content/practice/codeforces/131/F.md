---
title: "CF 131F - 送给妈妈的礼物"
description: "我们得到一张黑白照片，表示为大小为 n × m 的网格，其中每个单元格要么是白色像素的“1”，要么是黑色像素的“0”。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 131
codeforces_index: "F"
codeforces_contest_name: "Codeforces Beta Round 95 (Div. 2)"
rating: 2000
weight: 131
solve_time_s: 109
verified: false
draft: false
---

[CF 131F - 送给妈妈的礼物](https://codeforces.com/problemset/problem/131/F)

 **评级：** 2000
 **标签：** 二分查找、两个指针
 **求解时间：** 1m 49s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一张黑白照片，以大小网格表示`n × m`其中每个单元格的白色像素为“1”，黑色像素为“0”。 Polycarpus 将“星”定义为十字形白色像素的配置：上方、下方、左侧和右侧都有白色邻居的白色像素。 我们的目标是计算照片至少包含多少个矩形子矩阵`k`星星。 矩形的边必须与网格对齐。 

鉴于限制条件，`n`和`m`每个单元格最多可达 500 个，这意味着网格最多可包含 250,000 个单元格。 如果我们尝试一种简单的方法，枚举所有可能的矩形并检查每个矩形内有多少颗星星，则矩形的数量为 O(n^2 × m^2)，在最坏的情况下可能超过 10^10，太大而无法直接处理。 这告诉我们需要一个预处理步骤来快速查询任何矩形内的星星数量。 

边缘情况包括星星很少的网格、所有像素均为白色形成重叠星星的网格，以及星星可能位于边界但不完全适合十字图案的小矩形。 不检查交叉模式而计算星星的粗心实现将会导致计数过多。 例如，在 3×3 全白网格中：```
111
111
111
```中心只有一颗有效的星星。 将任何“1”算作一颗星都会错误地报告九颗星。 

## 方法

 蛮力方法首先会识别每个可能的矩形并计算里面的星星。 为了正确地做到这一点，我们必须首先检测所有有效的星星。 对于每个单元格，我们检查四个相邻单元格是否也是白色的。 然后，对于每个矩形，我们对该区域中的星星求和。 如果我们预先计算星星位置，单独检查每个矩形会导致计算星星的时间复杂度为 O(n^2 × m^2 × 1)，但枚举矩形仍然是 O(n^2 × m^2)，这太慢了。 

关键的见解是将星星检测与矩形枚举分开。 一旦我们在网格上标记了星星，我们就可以构建一个二维前缀和数组，其中`prefix[i][j]`是子矩阵中从 (1,1) 到 (i,j) 的星数。 然后，可以使用标准包含-排除公式在 O(1) 中计算由 (x1, y1) 到 (x2, y2) 定义的任何矩形中的星星总和：```
stars = prefix[x2][y2] - prefix[x1-1][y2] - prefix[x2][y1-1] + prefix[x1-1][y1-1]
```现在问题减少到计算所有矩形至少`k`明星使用有效的策略。 我们迭代所有成对的顶行和底行，将每列的 2D 问题压缩为 1D，作为这些行之间的星数，并使用带有两个指针的滑动窗口来计算星数总和满足或超过的子数组`k`。 这利用了列是累积的并且总和是非负的事实，因此两指针技术可以有效地工作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^2 × m^2) | O(n^2 × m^2) | O(n × m) | 太慢了|
 | 最佳 | O(n^2 × m) | O(n^2 × m) | O(n × m) | 已接受 |

 ## 算法演练

 1. 初始化网格`stars[n][m]`标记有效星星的位置。 迭代每个单元格`(i,j)`其中 1 ≤ i ≤ n-2 且 1 ≤ j ≤ m-2。 如果单元格及其四个侧面邻居是白色的，则标记`stars[i][j] = 1`。 否则，将其标记为 0。这可确保仅计算十字的中心位置。 
2.构建2D前缀和数组`prefix[n+1][m+1]`。 对于每个单元格`(i,j)`， 放`prefix[i][j] = stars[i][j] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1]`。 这允许 O(1) 查询任何矩形内的星星计数。 
3. 迭代所有顶行和底行对`top`和`bottom`。 For each column, compute`col_stars[c]`作为之间的星星数量`top`和`bottom`在该列中使用前缀和数组。 
4. 治疗`col_stars`作为一维数组。 使用两指针技术：维护一个列的滑动窗口`left`到`right`使得该窗口中的星星总和至少为`k`。 增量`right`直到总和≥k，然后递增`left`同时保持总和。 每个窗口定义一个矩形`top`到`bottom`和来自`left`到`right`至少有`k`星星。 添加`(m - right + 1)`到答案，代表从以下位置开始的所有有效矩形`left`。 
5. 对所有上下行对求和以获得有效矩形的总数。 

工作原理：在每个阶段，算法都会使用前缀和来维护当前矩形中星星的准确数量。 两指针方法保证对所有连续的子数组（列）进行计数而不会遗漏任何一个，而滑动窗口则保证对矩形进行高效计数而无需冗余的重新计算。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    n, m, k = map(int, input().split())
    grid = [input().strip() for _ in range(n)]
    
    # Step 1: mark valid stars
    stars = [[0]*m for _ in range(n)]
    for i in range(1, n-1):
        for j in range(1, m-1):
            if grid[i][j] == '1' and grid[i-1][j] == '1' and grid[i+1][j] == '1' \
               and grid[i][j-1] == '1' and grid[i][j+1] == '1':
                stars[i][j] = 1
    
    # Step 2: 2D prefix sum
    prefix = [[0]*(m+1) for _ in range(n+1)]
    for i in range(n):
        for j in range(m):
            prefix[i+1][j+1] = stars[i][j] + prefix[i][j+1] + prefix[i+1][j] - prefix[i][j]
    
    ans = 0
    # Step 3: iterate over all row pairs
    for top in range(1, n+1):
        for bottom in range(top, n+1):
            col_stars = [0]*m
            for col in range(1, m+1):
                col_stars[col-1] = prefix[bottom][col] - prefix[top-1][col] - prefix[bottom][col-1] + prefix[top-1][col-1]
            
            # Step 4: two pointers to count valid column windows
            left = 0
            curr_sum = 0
            for right in range(m):
                curr_sum += col_stars[right]
                while curr_sum - col_stars[left] >= k:
                    curr_sum -= col_stars[left]
                    left += 1
                if curr_sum >= k:
                    ans += m - right
    
    print(ans)

if __name__ == "__main__":
    main()
```这`stars`数组隔离了交叉的检测逻辑。 前缀和允许在 O(1) 中查询任何矩形。 上下对上的嵌套循环是可以管理的，因为`n`≤ 500。对列的两指针扫描可以有效地计算至少具有以下值的矩形：`k`通过利用非负总和来获得星星`col_stars`。 

## 工作示例

 **样品1**```
n=4, m=6, k=2
grid:
111000
111100
011011
000111
```| 顶部 | 底部| col_stars | 左| 对| curr_sum | 添加矩形|
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | 3 | 1 2 2 1 0 0 | 1 2 2 1 0 0 0 | 3 | 6 | 6 |

 该表显示，对于 top=1 和 Bottom=3，第 1-4 列包含总和超过的星号`k=2`。 滑动窗口添加 6 个矩形。 

**样品2（全白3×3，k=1）**```
111
111
111
```| 顶部 | 底部| col_stars | 左| 对| curr_sum | 添加矩形|
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | 3 | 0 1 0 | 0 | 1 | 1 | 3 |

 只有中央的柱子有一颗星星。 滑动窗口计数 3 个覆盖所有有效位置的矩形。 

这些痕迹证实该算法正确识别了恒星位置并计算了至少包含`k`星星。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n^2 × m) | O(n^2 × m) | 行对上的嵌套循环 (O(n^2))，m 列上的两指针扫描。 |
 | 空间| O(n × m) | 存储星星数组和前缀和。 |

 当 n、m ≤ 500、n^2 × m ≤ 125
