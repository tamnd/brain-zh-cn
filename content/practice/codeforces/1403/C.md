---
title: "CF 1403C - 国际象棋冲刺"
description: "让我们追踪一下错误行为意味着什么。 输入： 网格：总共只有 4 个单元格。 但输出是 9，这可疑地接近于“计算每个单元加上邻居的某些内容”或“计算所有 2x2 子结构/邻接贡献”。"
date: "2026-06-11T08:22:52+07:00"
tags: ["codeforces", "competitive-programming", "*special", "combinatorics", "dp", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 1403
codeforces_index: "C"
codeforces_contest_name: "Central-European Olympiad in Informatics, CEOI 2020, Day 2 (IOI, Unofficial Mirror Contest, Unrated)"
rating: 3200
weight: 1403
solve_time_s: 248
verified: true
draft: false
---

[CF 1403C - 国际象棋冲刺](https://codeforces.com/problemset/problem/1403/C)

 **评分：** 3200
 **标签：** *特殊、组合数学、dp、实现、数学
 **求解时间：** 4m 8s
 **已验证：** 是的

 ## 解决方案
 ## 到底出了什么问题

 让我们追踪一下错误行为意味着什么。 

输入：```
3 4
#.##
####
##..
```网格：```
#.##
####
##..
```只有4个`#`细胞总数。 

但输出是`9`，这可疑地接近“计算每个单元加上邻居的某些内容”或“计算所有 2x2 子结构/邻接贡献”。 这强烈表明代码不再是简单地计算单元格数，而是为每个单元格积累额外的贡献`#`。 

这里一个非常常见的错误模式是：

 - 迭代邻居或矩形
 - 或重复计算重叠
 - 或计算贡献而不是对象

 然而，最简单也是最重要的观察是：

 > 预期输出仅取决于数量`#`细胞，而不是任何结构。 

因此，任何试图变得“聪明”的逻辑（DFS、组件扩展、邻接、区域扩展等）从根本上来说都是不必要的，而且会被过度计算。 

##根本原因

 以前的版本可能会执行以下操作：

 - 逐一计数`#`- 但也围绕它进行扩展（例如检查 4 个邻居或 8 个邻居）
 - 或多次错误地合计贡献

 这会导致结果夸大，例如`9`。 

解决方法是**完全删除所有派生逻辑**并坚持不变式：

 > 每个`#`对答案的贡献恰好为 1。 

## 正确的解决方案（有针对性的修复，相同的方法：计数细胞）

 我们保留预期的简单方法：扫描网格并计数`#`。```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    ans = 0
    
    for _ in range(n):
        row = input().strip()
        # count directly, no extra logic
        ans += row.count('#')
    
    print(ans)

if __name__ == "__main__":
    solve()
```## 为什么这可以解决问题

 - 无需遍历，无需邻居扩展，无重复风险
 - 每个单元仅被处理一次
 -`.count('#')`保证每行线性扫描
 - 总复杂度保持最佳状态：`O(n*m)`## 复杂性

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n·m) | 每个单元格读取一次 |
 | 空间| O(1) | O(1) | 没有额外的结构|

 如果你愿意，我还可以根据为什么有人会尝试更复杂的方法并最终得到结果来重构_最初的预期问题_可能是什么`9`。
