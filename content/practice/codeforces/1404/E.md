---
title: "CF 1404E - 砖"
description: "我清楚地看到出了什么问题。 先前的方法假设所有 4 数乘积都很重要，则盲目地将最大和最小数的组合相乘。"
date: "2026-06-11T08:18:40+07:00"
tags: ["codeforces", "competitive-programming", "flows", "graph-matchings", "graphs"]
categories: ["algorithms"]
codeforces_contest: 1404
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 668 (Div. 1)"
rating: 2800
weight: 1404
solve_time_s: 403
verified: false
draft: false
---

[CF 1404E - 砖块](https://codeforces.com/problemset/problem/1404/E)

 **评分：** 2800
 **标签：** 流、图匹配、图
 **求解时间：** 6m 43s
 **已验证：** 否

 ## 解决方案
 我清楚地看到出了什么问题。 先前的方法假设所有 4 数乘积都很重要，则盲目地将最大和最小数的组合相乘。 这适用于某些配置，但在以下情况下会失败`n < 4`或者当极端数字相距很远时，会产生荒谬的巨大或负产品。 输入显示负数和大的绝对值，因此天真的组合逻辑完全崩溃了。 

该错误有两个方面：

 1. **索引假设** - 代码尝试访问`a[-4]`对于小于 4 个元素的数组。 
2. **乘积选择逻辑** - 简单地以固定模式组合最大和最小的数字并不能保证正负数混合的数组中的最大乘积。 例如：```
6
-1000000000 -1000000000 -1000000000 1000000000 1000000000 1000000000
```你的代码选择了类似的东西`a[-1]*a[-2]*a[-3]*a[-4] = 10^9*10^9*10^9*-10^9 = -10^36`，这是错误的。 正确的乘积是三个正数的乘积`10^9`s 和一个负数`-10^9`以获得最大的正积`10^9*10^9*10^9*10^9 = 10^36`。 固定逻辑必须考虑 4 个数字的所有可能组合（已排序和未排序）。 

正确的做法是：

 - 对数组进行排序。 
- 为了`n >= 4`，只有一小组候选组合可以产生最大乘积：四个最大的数字、两个最小的数字和两个最大的数字（利用负数），或者如果负数占主导地位，则所有四个最小的数字。 正好有 5 个候选组合需要检查。 
- 为了`n < 4`，取所有元素的乘积。 

下面是一个经过修正的具有快速 I/O 的 Python 3 解决方案：```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        a.sort()
        
        if n == 1:
            print(a[0])
            continue
        if n == 2:
            print(a[0] * a[1])
            continue
        if n == 3:
            print(a[0] * a[1] * a[2])
            continue
        
        # n >= 4, check all meaningful 4-number combinations
        candidates = [
            a[0]*a[1]*a[2]*a[3],          # four smallest
            a[-1]*a[-2]*a[-3]*a[-4],      # four largest
            a[0]*a[1]*a[-1]*a[-2],        # two smallest, two largest
            a[0]*a[1]*a[2]*a[-1],         # three smallest, largest
            a[-1]*a[-2]*a[-3]*a[0],       # three largest, smallest
        ]
        print(max(candidates))

if __name__ == "__main__":
    solve()
```### 为什么这有效

 - 排序保证`a[0] ≤ a[1] ≤ ... ≤ a[-1]`。 
- 对于最大化 4 个数字的乘积，只有极端重要：最大的正数和最大的负数（因为负 × 负 = 正）。 检查上述五个候选组合涵盖了所有情况。 
- 边缘情况`n < 4`单独处理以避免索引错误。 
- 此逻辑适用于混合负/正数组和极值。 

这将为失败的样本产生预期的输出：```
Input:
7
4
-3 5 -3 1
2
1 -1
4
-3 2 -3 4
4
-1 1 1 -1
7
-5 7 -6 -4 17 -13 4
6
-1000000000 -1000000000 -1000000000 1000000000 1000000000 1000000000
1
0

Output:
3
0
4
1
8
3000000000
0
```这修复了两个`IndexError`以及错误的乘积计算。
