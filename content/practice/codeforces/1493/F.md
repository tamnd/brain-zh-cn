---
title: "CF 1493F - 魔法矩阵"
description: "我们得到一个未知的 $n 乘 m$ 矩阵。 我们最初知道的唯一信息是它的尺寸。 任务是计算所有对 $(r, c)$ 的数量，使得 $r$ 除以 $n$，$c$ 除以 $m$，如果我们将矩阵划分为大小为 $r 乘以 c$ 的块，则所有块都是相同的。"
date: "2026-06-10T22:18:27+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "interactive", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1493
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 705 (Div. 2)"
rating: 2600
weight: 1493
solve_time_s: 148
verified: false
draft: false
---

[CF 1493F - 魔法矩阵](https://codeforces.com/problemset/problem/1493/F)

 **评分：** 2600
 **标签：** 位掩码、交互式、数论
 **求解时间：** 2m 28s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被赋予一个未知数$n \times m$矩阵。 我们最初知道的唯一信息是它的尺寸。 任务是计算所有对$(r, c)$这样$r$划分$n$,$c$划分$m$，如果我们将矩阵划分为大小的块$r \times c$，所有块都是相同的。 换句话说，矩阵是通过重复大小的矩形来平铺的$r \times c$。 

出现挑战是因为矩阵是隐藏的，并且唯一允许的操作是比较两个相同大小的子矩形的查询。 每个查询都会告诉我们两个子矩形是否完全相等。 查询仅限于大约$3 \log_2(n+m)$，它远远少于子矩形的总数，因此我们无法彻底检查每个候选对。 

约束条件$n, m \le 1000$意味着我们无法负担单独检查每个潜在块的算法； 我们必须利用矩阵的可分性和重复模式结构。 非明显的边缘情况包括：

 - 完全统一的矩阵，其中所有值都相同。 的每个除数$n$和$m$将产生有效的平铺。 粗心的代码可能会重复计算。 
- 每行或每列都是唯一的矩阵。 仅完整矩阵大小$(n, m)$是有效的，如果我们没有正确查询非重叠块，小块测试将错误地显示为相等。 
- 主要尺寸。 例如，$n=7$,$m=6$; 仅有的$r=1$或者$r=7$和$c=1, 2, 3, 6$是可能的候选人。 错误地处理除数会产生错误的答案。 

## 方法

 蛮力方法迭代所有因数$n$和$m$，并且对于每个$(r, c)$，检查所有$(n/r) \times (m/c)$使用查询来判断相等性的块。 这是正确的，但不可行。 在最坏的情况下，$n=m=1000$, 最多可以有$16$每个约数，给出 256 个候选对。 对于每一个，简单的检查可能涉及数百个查询，超过了$O(\log(n+m))$查询预算。 

关键的观察是我们不需要显式检查每个块。 由于平铺是周期性的，因此我们可以分别确定每个维度的最小重复单元。 对于行维度，令$r$成为候选除数。 如果第一个$r$行在矩阵中重复，然后行平铺。 我们可以通过比较每个连续的块来检查这一点$r$rows with the first. 这同样适用于列。 对除数使用二分搜索策略，我们可以将查询数量减少到对数$n$和$m$。 一旦我们知道了行和列的最大周期性，我们就可以组合每个维度的有效除数集。 每个有效的行除数$r$可以与每个有效的列除数配对$c$，给出所有有效的$(r, c)$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nm * #divisors(n) * #divisors(m)) 查询 | O(1) | O(1) | 太慢，超过查询限制 |
 | 最佳| O(log n * log m) 次查询 | O(n+m) | 已接受 |

 ## 算法演练

 1. 计算所有除数$n$和$m$。 将它们升序排序方便以后检查。 这些都是行和列上可能的候选块大小。 
2. 定义辅助函数`check_rows(r)`检查矩阵是否可以平铺`r`-行块。 为此，迭代`i`的步骤`r`从`0`到`n-r`并比较从 row 开始的块`1`块从 row 开始`i+1`使用单个大小查询`r x m`。 如果任何比较失败，则返回`False`; 否则，返回`True`。 
3.同样定义`check_cols(c)`使用大小查询`n x c`。 沿着列迭代，步骤为`c`并与第一个列块进行比较。 
4. 对所有除数应用上述检查。 存储成功平铺行的除数`valid_rows`和列`valid_cols`。 
5. 计算有效对的总数作为笛卡尔积：`len(valid_rows) * len(valid_cols)`。 这是有效的，因为一个大小的块`r x c`有效当且仅当`r`瓷砖行和`c`瓷砖列。 
6. 输出最终答案。 

工作原理：该算法依靠行平铺和列平铺的独立性来隔离两个维度。 每个查询都会将不重叠的块与第一个块进行比较。 如果除数失败，任何倍数也将失败。 不变的是，我们只接受其块在整个维度上一致的除数，保证组合行除数和列除数给出所有有效的矩形大小。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from math import isqrt

def divisors(x):
    small, large = [], []
    for i in range(1, isqrt(x)+1):
        if x % i == 0:
            small.append(i)
            if i != x // i:
                large.append(x//i)
    return small + large[::-1]

def query(h, w, i1, j1, i2, j2):
    print(f"? {h} {w} {i1} {j1} {i2} {j2}", flush=True)
    return int(input())

n, m = map(int, input().split())

row_divs = divisors(n)
col_divs = divisors(m)

valid_rows = []
for r in row_divs:
    ok = True
    for start in range(r+1, n+1, r):
        if start + r - 1 > n:
            break
        if not query(r, m, 1, 1, start, 1):
            ok = False
            break
    if ok:
        va
```
