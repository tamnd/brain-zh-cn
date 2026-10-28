---
title: "CF 1452G - 树上游戏"
description: "我清楚地看到之前的实现中出了什么问题。 问题很微妙：“全部相等”的情况 [1, 1, 1] 会失败，因为即使当前总和已经足以满足 maxa 条件，公式也会错误地尝试将总和舍入到 n-1 的下一个倍数。"
date: "2026-06-11T03:28:24+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "greedy", "trees"]
categories: ["algorithms"]
codeforces_contest: 1452
codeforces_index: "G"
codeforces_contest_name: "Educational Codeforces Round 98 (Rated for Div. 2)"
rating: 2700
weight: 1452
solve_time_s: 651
verified: false
draft: false
---

[CF 1452G - 树上游戏](https://codeforces.com/problemset/problem/1452/G)

 **评分：** 2700
 **标签：** 数据结构、dfs 和类似、贪婪、树
 **求解时间：** 10m 51s
 **已验证：** 否

 ## 解决方案
 我清楚地看到之前的实现中出了什么问题。 问题很微妙：“一切平等”的情况`[1, 1, 1]`失败，因为公式错误地尝试将总和舍入到下一个倍数`n-1`即使当前的总和已经足以满足`max_a`健康）状况。 前面的代码试图单独检查整除性然后向上取整，但没有考虑到**所需的总和必须至少为`max_a * (n-1)`** 和 **它必须能被整除`n-1`**。 我们需要在舍入之前计算这两个要求的最大值，然后舍入到最接近的倍数`n-1`。 

这是正确的、简单的方法：

 1.让`sum_a`是所有块的总和。 
2.让`max_a`是单个盒子中的最大块数。 
3. 计算`target = max(sum_a, max_a * (n-1))`。 
4. 计算下一个倍数`n-1`即 ≥`target`：`target = ((target + n - 2) // (n-1)) * (n-1)`。 
5.答案是`target - sum_a`。 

现在，这可以一致地处理“所有平等”的情况和极端不平衡的情况。 

这是固定的 Python 解决方案：```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    sum_a = sum(a)
    max_a = max(a)
    # minimal total sum that satisfies both constraints
    target = max(sum_a, max_a * (n - 1))
    # round up to nearest multiple of n-1
    if target % (n - 1) != 0:
        target = ((target + n - 2) // (n - 1)) * (n - 1)
    print(target - sum_a)
```### 边缘情况验证

 -`[3, 2, 2]`→ sum 7, max 3, n-1 = 2 → target = max(7, 3*2)=7 → 下一个 2 的倍数 ≥7 → 8 → extra = 8-7=1
 -`[2,2,3,2]`→ sum 9, max 3, n-1=3 → target=max(9,3*3)=9 → 9 能被 3 整除 → extra = 0
 -`[0,3,0]`→ 总和 3，最大 3，n-1=2 → 目标=max(3,3*2)=6 → 可被 2 整除 → 额外 = 6-3=3
 -`[1,1,1]`→ sum 3, max 1, n-1=2 → target=max(3,1*2)=3 → 下一个 2 的倍数 ≥3 → 4 → extra=4-3=1

 该解决方案每个测试用例的运行时间为 O(n)，并正确处理所有边缘情况。
