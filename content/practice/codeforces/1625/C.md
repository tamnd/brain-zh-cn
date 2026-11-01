---
title: "CF 1625C - 道路优化"
description: "啊，现在我彻底明白了。 该问题不是 XOR 计算中的逻辑错误，而是输入解析和循环假设问题。 失败的输入表明您的网格是矩形，而不是正方形： - 这看起来像 1 行，6 列。"
date: "2026-06-10T05:33:42+07:00"
tags: ["codeforces", "competitive-programming", "dp"]
categories: ["algorithms"]
codeforces_contest: 1625
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 765 (Div. 2)"
rating: 1700
weight: 1625
solve_time_s: 452
verified: false
draft: false
---

[CF 1625C - 道路优化](https://codeforces.com/problemset/problem/1625/C)

 **评分：** 1700
 **标签：** dp
 **求解时间：** 7m 32s
 **已验证：** 否

 ## 解决方案
 啊，现在我彻底明白了。 问题是**不是 XOR 计算中的逻辑错误**，而是**输入解析和循环假设问题**。 

失败的输入表明您的网格是**矩形**，而不是正方形：```
1
6
```- 这看起来像 1 行 6 列。 
- 前面的代码假设`n x n`网格和迭代`for j in range(n)`每行里面。 
- 这导致了`IndexError`因为行长度不等于`n`。 

类似地，对于不同长度的行，迭代至`n`是不安全的。 

### 有针对性的修复

 我们可以通过**精确迭代每行的长度**来修复它，而不是假设`n`列。```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    grid = []
    for _ in range(n):
        row = list(map(int, input().split()))
        grid.append(row)
    
    ans = 0
    for i in range(n):
        for j in range(len(grid[i])):  # <-- use actual row length
            if (i + j) % 2 == 0:
                ans ^= grid[i][j]
    print(ans)
```### 为什么这有效

 1. 我们动态读取**每一行**，因此允许任意数量的列。 
2. XOR计算迭代实际行长度，防止`IndexError`。 
3. 的`(i + j) % 2 == 0`棋盘图案仍然适用于**任何矩形网格**，而不仅仅是方形网格。 
4. 快速 I/O 保留通过`sys.stdin.readline`。 

### 跟踪示例输入

 输入：```
1
6
```-`n = 1`→ 1 行
 - 行：`[6]`- 仅有的`(0+0)%2==0`→ 异或 = 6

 输入：```
2
4 5
2 2
```- 第 0 行：`[4,5]`→ 职位`(0,0),(0,1)`→ 仅异或`(0,0)`→ 异或 = 4
 - 第 1 行：`[2,2]`→ 职位`(1,0),(1,1)`→ 异或`(1,1)`仅有的？ 查看`(i+j)%2==0`:`(1,0)=1`,`(1+0)%2==1`跳过，`(1,1)=2`,`(1+1)%2==0`包括 → 异或 = 4^2=6

 匹配预期输出：`6`。 

这样就彻底解决了`IndexError`对于非方形网格。 

如果您愿意，我可以提供一个**经过全面测试的版本，其中包含您提供的多个示例**来验证其输出`10,6,7`。 

你想让我接下来这样做吗？
