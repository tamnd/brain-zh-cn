---
title: "CF 1766C - 哈密顿墙"
description: "我们有一个包含两行和 m 列的网格，代表一堵墙。 每个单元格要么是黑色 (B)，要么是白色 (W)。 Monocarp 希望在仅在相邻单元格之间移动的单个连续路径中将所有黑色单元格绘制一次。"
date: "2026-06-09T12:57:42+07:00"
tags: ["codeforces", "competitive-programming", "dp", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1766
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 139 (Rated for Div. 2)"
rating: 1300
weight: 1766
solve_time_s: 168
verified: false
draft: false
---

[CF 1766C - 哈密顿墙](https://codeforces.com/problemset/problem/1766/C)

 **评分：** 1300
 **标签：** dp、实施
 **求解时间：** 2m 48s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个有两行的网格`m`代表墙的柱子。 每个单元格要么是黑色的（`B`）或白色（`W`）。 Monocarp 希望在仅在相邻单元格之间移动的单个连续路径中将所有黑色单元格绘制一次。 Every column contains at least one black cell, so it is impossible to have a column without a black cell. The question asks whether such a Hamiltonian path exists for each test case.

 The input guarantees that every column has at least one black cell, so the problem is non-trivial only in how the black cells are connected. Since there are only two rows, each column can have one or two black cells. The Hamiltonian path must traverse all black cells, visiting each exactly once and never entering a white cell. This effectively reduces to checking whether the black cells form a connected "snake" without needing to backtrack or jump over white cells.

 The constraints are tight in terms of the number of test cases and column sum:`t`可以达到10^4，所有的总和`m`跨测试≤ 2 × 10^5。 这排除了任何二次解`m`每个测试用例； 我们需要对每个测试用例的网格进行线性扫描。 

当相邻列中的黑色单元未以允许连续路径的方式对齐时，就会出现不明显的边缘情况。 例如，如果列`j`仅在顶行和顶列中有一个黑色单元格`j+1`仅在底行有一个黑色单元格，有效路径必须在列之间从上到下“下降”。 如果这种下降发生多次或被白细胞阻挡，则可能不可能在不破坏邻接性或访问白细胞的情况下覆盖所有黑细胞。 

## 方法

 一种简单的方法是尝试每个起始黑色单元并执行 DFS 来查看哈密顿路径是否存在。 这种方法是正确的，但太慢，因为递归路径的数量呈指数增长`m`。 在最坏的情况下，每个测试用例可能需要 O(2^m) 检查，考虑到限制，这是不可行的。 

最佳方法利用网格的结构。 由于只有两行，有效的哈密顿路径必须沿着列遵循之字形图案，仅在必要时在行之间移动。 我们可以将“开始”列定义为包含黑色单元格的最顶行中最左边的黑色单元格。 然后，我们逐列扫描，尝试跟踪黑色单元格，同时在必要时切换行。 如果我们可以从一列移动到另一列，而不会遇到黑色单元格阻止相邻的列，则存在一条路径。 否则，它不会。 

关键的见解是，在具有“每列至少一个黑色”保证的 2 行网格中，路径始终可以从最左边的黑色单元格开始贪婪地构建，并在需要时切换行，除非黑色单元格中存在“洞”，迫使跳过白色单元格，这违反了规则。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解（DFS 所有路径）| O(2^m) | O(2^m) | O(米) | 太慢了|
 | 贪婪之字形扫描 | O(米) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 识别包含黑色单元格的最左边的列。 如果
