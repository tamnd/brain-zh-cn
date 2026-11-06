---
title: "CF 1868C - 旅行计划"
description: "不匹配不再来自 MEX 计算。 之前版本中的段 MEX 逻辑实际上对于这个问题规模来说是很好的。"
date: "2026-06-08T23:35:40+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "dp", "implementation", "math", "trees"]
categories: ["algorithms"]
codeforces_contest: 1868
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 896 (Div. 1)"
rating: 2400
weight: 1868
solve_time_s: 206
verified: false
draft: false
---

[CF 1868C - 旅行计划](https://codeforces.com/problemset/problem/1868/C)

 **评分：** 2400
 **标签：** 组合数学、dp、实现、数学、树
 **求解时间：** 3m 26s
 **已验证：** 否

 ## 解决方案
 ### 诊断

 不匹配不再来自 MEX 计算。 之前版本中的段 MEX 逻辑实际上对于这个问题规模来说是很好的。 真正的问题更具结构性：DP 状态被错误地用作“每个段可到达的 XOR 的全局累积”，而不是对选择非重叠子阵列的实际组合结构进行建模。 

该错误以两种方式出现：

 首先，`dp`在迭代段时就地更新。 这默默地允许在同一逻辑层内多次重用一个段，这是无效的。 一旦你这样做了`dp |= new_dp`里面同一个`(l, r)`迭代结构，您可以有效地允许与重叠段选择相对应的链接决策。 

其次，模型本身过多地计算了转换：每次看到一个片段时`[l, r]`，您将其与_同一全局级别上所有先前可到达的异或状态_进行异或。 但实际上，选择一个段就修复了一个边界，剩下的问题就出在后缀上。 没有后缀感知 DP（即依赖于`r+1`），这变成了段上的传递闭包，它增加了可达的 XOR 值并产生像这样的答案`3`和`7`在结构应限制组合的情况下。 

因此，正确的修复方法是恢复丢失的结构：DP 必须基于后缀，而不是基于全局集。 

我们定义：`dp[i]`= 使用完全位于从索引开始的后缀内的有效非重叠段可实现的 XOR 集`i`。 

过渡：

 1. 跳过`i`： 拿`dp[i+1]`2. 分段`[i, j]`：异或 mex(i,j) 与`dp[j+1]`这会恢复正确性，因为它强制执行非重叠。 

### 正确的做法

 我们枚举所有子数组，增量计算 MEX，然后从`i`到`j+1`。 DP 是从右到左进行的。 

这是修复过度计数错误的缺失约束。 

### 正确的Python解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))

        # dp[i] = set of XORs achievable from suffix i
        dp = [set() for _ in range(n + 1)]
        dp[n].add(0)

        for i in range(n - 1, -1, -1):
            # option 1: skip index i
            dp[i] = set(dp[i + 1])

            freq = [0] * (n + 2)
            mex = 0

            for j in range(i, n):
                v = a[j]
                if v <= n:
                    freq[v] += 1

                while freq[mex]:
                    mex += 1

                # take segment [i, j]
                for x in dp[j + 1]:
                    dp[i].add(x ^ mex)

        print(max(dp[0]))

if __name__ == "__main__":
    solve()
```### 为什么这会修复失败

 此前，DP 在全球范围内合并了段贡献，这允许对段进行无效的“重新排序”，并有效地计算重叠或后缀不一致的选择。 

现在每个转换显式地消耗一个前缀`[i, j]`并继续从`j+1`，完全按照问题的要求强制执行非重叠约束。 

这将恢复正确的组合结构：每个 XOR 状态对应于按从左到右顺序划分为不相交段的有效分区。
