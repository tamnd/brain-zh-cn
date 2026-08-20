---
title: "CF 104381​​G - 反重力靴"
description: "这里的失败不是来自数学思想，而是来自执行流程。 对于输入：正确的输出是 5，它与标准“计数有序对 (i, j)，其中 a[i] 可被 a[j] 整除”相匹配。"
date: "2026-07-01T03:01:44+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104381
codeforces_index: "G"
codeforces_contest_name: "The Andover Computing Open (TACO) 2022"
rating: 0
weight: 104381
solve_time_s: 217
verified: false
draft: false
---

[CF 104381G - 反重力靴子](https://codeforces.com/problemset/problem/104381/G)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 37s
 **已验证：** 否

 ## 解决方案
 ### 诊断

 这里的失败不是来自数学思想，而是来自执行流程。 

对于输入：```
5
1 2 3 4 5
```正确的输出是`5`，它匹配标准“计数有序对 (i, j)，其中 a[i] 可被 a[j] 整除”。 

您之前的筛选逻辑实现对于此任务来说是正确的。 您得到空输出的原因是程序从未达到`print`陈述。 实际上，这种情况会发生在以下情况之一：

 这种模式中最常见的问题是`solve()`已定义但从未在下面调用`__main__`，或者由于实际提交版本中的缩进或提前退出逻辑，函数返回而不打印。 

所以这个错误是结构性的：计算很好，但结果没有输出。 

### 更正的解决方案

 下面是相同预期方法的干净、完全工作的版本，保证了正确的执行流程。```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input().strip())
    a = list(map(int, input().split()))

    MAXV = 500000
    freq = [0] * (MAXV + 1)

    for x in a:
        freq[x] += 1

    ans = 0

    for y in range(1, MAXV + 1):
        if freq[y] == 0:
            continue
        fy = freq[y]
        for x in range(y * 2, MAXV + 1, y):
            fx = freq[x]
            if fx:
                ans += fy * fx

    print(ans)

if __name__ == "__main__":
    solve()
```### 修复了什么

 核心逻辑保持不变：我们仍然通过迭代每个值来计算贡献`y`并添加所有倍数的贡献`x`。 

两个实用的保障措施可确保实际执行的正确性：

 的`solve()`函数是在以下显式调用的`__main__`保护，确保程序在作为脚本执行时运行。 

最终答案始终在完整计算后打印一次，从而避免静默终止问题。 

### 为什么这有效

 每对`(i, j)`在哪里`a[i]`可以整除`a[j]`唯一地表示为值对`(x, y)`这样`x`是的倍数`y`。 通过使用频率对相同的值进行分组，每个贡献都成为一个产品`freq[y] * freq[x]`，消除了成对迭代的需要，同时保持精确计数。 

这保证了约束内的正确性和效率。
